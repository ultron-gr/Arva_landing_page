"""
ARVA Studios — FastAPI backend.
All writes go through this server with the Supabase service role key.
The browser NEVER gets write access to any table (RLS: service-role only).
"""
import asyncio
import hashlib
import html
import logging
import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------------------------------------------------------------------------
# Startup env validation — fail LOUDLY, not silently (spec requirement)
# ---------------------------------------------------------------------------
REQUIRED_ENV = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
    "INTERNAL_NOTIFICATION_EMAIL",
]
_missing = [v for v in REQUIRED_ENV if not os.environ.get(v)]
if _missing:
    raise RuntimeError(
        "FATAL — ARVA backend cannot start. Missing required environment "
        f"variables: {', '.join(_missing)}. Copy backend/.env.example to "
        "backend/.env and provide real values."
    )

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
RESEND_API_KEY = os.environ["RESEND_API_KEY"]
RESEND_FROM = os.environ["RESEND_FROM_EMAIL"]
INTERNAL_EMAIL = os.environ["INTERNAL_NOTIFICATION_EMAIL"]
SENTRY_DSN = os.environ.get("SENTRY_DSN", "")
IP_HASH_SALT = os.environ.get("IP_HASH_SALT", "arva-default-salt")
ALLOW_TEST_SIMULATION = os.environ.get("ALLOW_TEST_SIMULATION", "false").lower() == "true"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("arva")

# ---------------------------------------------------------------------------
# Sentry (backend project DSN — separate from the frontend's)
# ---------------------------------------------------------------------------
import sentry_sdk

if SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=False,  # never ship PII in events
        traces_sample_rate=0.1,
        environment=os.environ.get("SENTRY_ENVIRONMENT", "production"),
    )
else:
    logger.warning("SENTRY_DSN not set — backend error monitoring is DISABLED.")

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="ARVA Studios API", docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS", "*").split(",")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    return response


# ---------------------------------------------------------------------------
# Shared HTTP client
# ---------------------------------------------------------------------------
_http: Optional[httpx.AsyncClient] = None


@app.on_event("startup")
async def _startup():
    global _http
    _http = httpx.AsyncClient(timeout=15.0)


@app.on_event("shutdown")
async def _shutdown():
    if _http:
        await _http.aclose()


# ---------------------------------------------------------------------------
# Supabase PostgREST helpers (studio_site schema, service role only)
# ---------------------------------------------------------------------------
REST = f"{SUPABASE_URL}/rest/v1"


def _sb_headers(write: bool = False) -> dict:
    h = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Accept-Profile": "studio_site",
    }
    if write:
        h["Content-Profile"] = "studio_site"
        h["Content-Type"] = "application/json"
        h["Prefer"] = "return=representation"
    return h


async def sb_insert(table: str, row: dict) -> dict:
    """Insert a row; returns the created row. Raises on failure."""
    r = await _http.post(f"{REST}/{table}", headers=_sb_headers(write=True), json=row)
    if r.status_code != 201:
        raise RuntimeError(f"supabase insert into {table} failed: HTTP {r.status_code} {r.text[:300]}")
    return r.json()[0]


async def sb_recent_lead_count(ip_hash: str) -> int:
    """Rate-limit counter: leads from this hashed IP in the last hour."""
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
    r = await _http.get(
        f"{REST}/leads",
        headers={**_sb_headers(), "Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"},
        params={"ip_hash": f"eq.{ip_hash}", "created_at": f"gte.{cutoff}", "select": "id"},
    )
    if r.status_code not in (200, 206):
        raise RuntimeError(f"rate-limit count query failed: HTTP {r.status_code}")
    content_range = r.headers.get("content-range", "*/0")
    try:
        return int(content_range.split("/")[-1])
    except ValueError:
        return 0


# ---------------------------------------------------------------------------
# Sanitization & validation (server-side — never trust the client)
# ---------------------------------------------------------------------------
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")
CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
PROJECT_TYPES = {"content_video", "web_products", "automation_ai", "brand_design", "not_sure"}


def sanitize(value: Optional[str], max_len: int, allow_newlines: bool = False) -> str:
    if not isinstance(value, str):
        return ""
    v = CONTROL_CHARS_RE.sub("", value)
    if not allow_newlines:
        v = v.replace("\n", " ").replace("\r", " ")
    return v.strip()[:max_len]


def hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{IP_HASH_SALT}:{ip}".encode()).hexdigest()


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# ---------------------------------------------------------------------------
# Resend email with one retry + short backoff, audited to email_log
# ---------------------------------------------------------------------------
async def send_email(to: str, subject: str, html_body: str) -> tuple[str, Optional[str], Optional[str]]:
    """Returns (status 'sent'|'failed', provider_message_id, error_message)."""
    last_error = None
    for attempt in range(2):
        try:
            r = await _http.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
                json={
                    "from": f"ARVA Studios <{RESEND_FROM}>",
                    "to": [to],
                    "subject": subject,
                    "html": html_body,
                    "reply_to": INTERNAL_EMAIL,
                },
            )
            if r.status_code == 200:
                return "sent", r.json().get("id"), None
            last_error = f"HTTP {r.status_code}: {r.text[:300]}"
        except Exception as exc:  # network failure etc.
            last_error = f"{type(exc).__name__}: {exc}"[:300]
        if attempt == 0:
            await asyncio.sleep(0.75)  # short backoff, then one retry
    return "failed", None, last_error


async def log_email(lead_id: Optional[str], email_type: str, status: str,
                    provider_message_id: Optional[str], error_message: Optional[str]) -> None:
    try:
        await sb_insert("email_log", {
            "lead_id": lead_id,
            "email_type": email_type,
            "status": status,
            "provider_message_id": provider_message_id,
            "error_message": error_message,
        })
    except Exception as exc:
        logger.error("email_log write failed: %s", exc)
        sentry_sdk.capture_message(f"email_log write failed for type={email_type}: {exc}", level="error")


PROJECT_TYPE_LABELS = {
    "content_video": "Content & Video",
    "web_products": "Web Products",
    "automation_ai": "Automation & AI",
    "brand_design": "Brand Design",
    "not_sure": "Not sure yet",
}


def confirmation_html(name: str) -> str:
    safe_name = html.escape(name)
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#0A0A0A;color:#EDEDED;padding:40px 32px;">
      <p style="letter-spacing:4px;font-size:12px;color:#D4AF37;margin:0 0 24px;">ARVA STUDIOS</p>
      <h1 style="font-size:24px;margin:0 0 16px;color:#FFFFFF;">Thanks, {safe_name}.</h1>
      <p style="line-height:1.6;color:#BDBDBD;">We received your message. A real person from the studio will be in touch within <strong style="color:#FFFFFF;">1 business day</strong>.</p>
      <p style="line-height:1.6;color:#BDBDBD;">No commitment. No agency speak. Just a real conversation.</p>
      <p style="margin-top:32px;font-size:12px;color:#7A7A7A;">ARVA Studios — Bengaluru · Content · Web · Automation · Design</p>
    </div>
    """


def notification_html(data: dict) -> str:
    rows = "".join(
        f"<tr><td style='padding:6px 12px;border:1px solid #ddd;font-weight:bold;'>{html.escape(k)}</td>"
        f"<td style='padding:6px 12px;border:1px solid #ddd;'>{html.escape(str(v) if v else '—')}</td></tr>"
        for k, v in data.items()
    )
    return f"""
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;">
      <h2>New lead — ARVA Studios website</h2>
      <table style="border-collapse:collapse;">{rows}</table>
    </div>
    """


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health():
    """Deploy verification: checks real Supabase connectivity, not just liveness."""
    try:
        r = await _http.get(
            f"{REST}/leads", headers=_sb_headers(), params={"select": "id", "limit": "1"}
        )
        supabase_ok = r.status_code == 200
    except Exception:
        supabase_ok = False
    status_code = 200 if supabase_ok else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if supabase_ok else "unhealthy",
            "supabase": "connected" if supabase_ok else "unreachable",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.post("/api/leads")
async def create_lead(request: Request):
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Invalid request body."})
    if not isinstance(body, dict):
        return JSONResponse(status_code=400, content={"ok": False, "error": "Invalid request body."})

    simulate = request.headers.get("x-simulate", "") if ALLOW_TEST_SIMULATION else ""

    # -- honeypot: pretend success, do nothing (don't reveal the trap) --------
    if sanitize(body.get("website_url"), 500):
        logger.info("honeypot triggered — dropping submission silently")
        return {"ok": True, "message": "Thanks — we'll be in touch within 1 business day."}

    # -- sanitize + server-side validation ------------------------------------
    name = sanitize(body.get("name"), 200)
    email = sanitize(body.get("email"), 320).lower()
    company = sanitize(body.get("company"), 200)
    project_type = sanitize(body.get("project_type"), 50)
    budget_range = sanitize(body.get("budget_range"), 100)
    message = sanitize(body.get("message"), 5000, allow_newlines=True)

    errors: dict = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    elif not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if not project_type:
        errors["project_type"] = "Select a project type."
    elif project_type not in PROJECT_TYPES:
        errors["project_type"] = "Select a valid project type."
    if errors:
        return JSONResponse(status_code=400, content={"ok": False, "error": "Please fix the highlighted fields.", "errors": errors})

    # -- rate limiting: max 5 per hashed IP per hour --------------------------
    ip = client_ip(request)
    ip_hashed = hash_ip(ip)
    try:
        recent = await sb_recent_lead_count(ip_hashed)
    except Exception as exc:
        logger.error("rate-limit check failed (allowing through): %s", exc)
        sentry_sdk.capture_message(f"rate-limit check failed: {exc}", level="warning")
        recent = 0
    if recent >= 5:
        return JSONResponse(
            status_code=429,
            content={"ok": False, "error": "Too many submissions from your network in the last hour. Please try again later or email us directly.", "fallback_email": INTERNAL_EMAIL},
        )

    lead_row = {
        "name": name,
        "email": email,
        "company": company or None,
        "project_type": project_type,
        "budget_range": budget_range or None,
        "message": message or None,
        "source": "website",
        "ip_hash": ip_hashed,
    }

    # -- DB insert (with don't-lose-the-lead fallback) -------------------------
    lead_id: Optional[str] = None
    db_failed = False
    try:
        if simulate == "db_failure":
            raise RuntimeError("simulated DB failure (test mode)")
        created = await sb_insert("leads", lead_row)
        lead_id = created["id"]
    except Exception as exc:
        db_failed = True
        logger.error("lead insert failed: %s", exc)
        sentry_sdk.capture_message(f"lead insert failed (lead NOT stored, attempting email fallback): {type(exc).__name__}", level="error")

    notification_data = {
        "Name": name, "Email": email, "Company": company,
        "Project type": PROJECT_TYPE_LABELS.get(project_type, project_type),
        "Budget range": budget_range, "Message": message,
        "Stored in DB": "NO — insert failed, this email is the only copy" if db_failed else "yes",
    }

    async def _send_emails() -> bool:
        """Send notification + confirmation; audit both. Returns notification success."""
        if simulate == "email_failure":
            await log_email(lead_id, "notification", "failed", None, "simulated email-provider failure (test mode)")
            await log_email(lead_id, "confirmation", "failed", None, "simulated email-provider failure (test mode)")
            sentry_sdk.capture_message("email send failed (simulated)", level="error")
            return False
        n_status, n_id, n_err = await send_email(
            INTERNAL_EMAIL, f"New lead: {name} — {PROJECT_TYPE_LABELS.get(project_type, project_type)}",
            notification_html(notification_data),
        )
        await log_email(lead_id, "notification", n_status, n_id, n_err)
        if n_status == "failed":
            sentry_sdk.capture_message(f"notification email failed after retry: {n_err}", level="error")
        c_status, c_id, c_err = await send_email(
            email, "Thanks — we'll be in touch within 1 business day", confirmation_html(name),
        )
        await log_email(lead_id, "confirmation", c_status, c_id, c_err)
        if c_status == "failed":
            # Expected while Resend is in sandbox mode (unverified domain) — log, don't alarm
            logger.warning("confirmation email failed: %s", c_err)
            sentry_sdk.capture_message(f"confirmation email failed after retry: {c_err}", level="warning")
        return n_status == "sent"

    notification_sent = await _send_emails()

    # -- outcome ---------------------------------------------------------------
    if db_failed and not notification_sent:
        # Lead is genuinely lost — be honest, give a retry path.
        return JSONResponse(
            status_code=500,
            content={
                "ok": False,
                "error": "Something went wrong on our side and your message didn't get through. Please try again, or email us directly.",
                "fallback_email": INTERNAL_EMAIL,
            },
        )
    # Captured via DB, or via notification email fallback — success either way.
    return {"ok": True, "message": "Thanks — we'll be in touch within 1 business day."}
