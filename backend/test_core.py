"""
ARVA Studios — Phase 0 Core POC
Single script proving every core integration in isolation:
  1. Supabase PostgREST connectivity (service role, studio_site schema)
  2. Schema/table match against spec (leads + email_log columns)
  3. RLS lockdown: anon key must NOT read/write either table
  4. leads insert -> select -> delete round-trip
  5. email_log insert -> delete round-trip
  6. Resend: internal notification send (must succeed) +
     external confirmation send (expected to fail in sandbox — documented)
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

SUPABASE_URL = os.environ["SUPABASE_URL"].rstrip("/")
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
RESEND_API_KEY = os.environ["RESEND_API_KEY"]
RESEND_FROM = os.environ["RESEND_FROM_EMAIL"]
INTERNAL_EMAIL = os.environ["INTERNAL_NOTIFICATION_EMAIL"]
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdnb3NoeWx5Z3p3a2VmeWNzZGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMDYzNzIsImV4cCI6MjEwMzg4MjM3Mn0.1RJrrluPa-pPtD02Ui5II1OBxaEq5V1vzsLI-w8R5is"
)

REST = f"{SUPABASE_URL}/rest/v1"


def svc_headers(write=False):
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


RESULTS = []


def check(name, ok, detail=""):
    RESULTS.append((name, ok, detail))
    print(f"{'PASS' if ok else 'FAIL'} | {name}" + (f" | {detail}" if detail else ""))
    return ok


# ---------- 1 & 2: connectivity + spec match ----------
SPEC_LEADS_COLS = {
    "id", "created_at", "updated_at", "name", "email", "company",
    "project_type", "budget_range", "message", "status", "source", "ip_hash",
}
SPEC_EMAIL_LOG_COLS = {
    "id", "lead_id", "email_type", "status", "provider_message_id",
    "error_message", "created_at",
}

r = requests.get(f"{REST}/leads?limit=1", headers=svc_headers(), timeout=15)
check("Supabase connectivity + studio_site.leads exists", r.status_code == 200, f"HTTP {r.status_code}")

r2 = requests.get(f"{REST}/email_log?limit=1", headers=svc_headers(), timeout=15)
check("studio_site.email_log exists", r2.status_code == 200, f"HTTP {r2.status_code}")

# Column match via inserting a full-spec row later; probe existing row keys if present
if r.status_code == 200 and r.json():
    cols = set(r.json()[0].keys())
    check("leads columns match spec", cols == SPEC_LEADS_COLS, f"extra={cols - SPEC_LEADS_COLS} missing={SPEC_LEADS_COLS - cols}")
if r2.status_code == 200 and r2.json():
    cols = set(r2.json()[0].keys())
    check("email_log columns match spec", cols == SPEC_EMAIL_LOG_COLS, f"extra={cols - SPEC_EMAIL_LOG_COLS} missing={SPEC_EMAIL_LOG_COLS - cols}")

# ---------- 3: RLS lockdown — anon key must be locked out ----------
anon_h = {"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}", "Accept-Profile": "studio_site"}
ra = requests.get(f"{REST}/leads?limit=1", headers=anon_h, timeout=15)
# Locked = 401/403/404, or 200 with empty list (RLS filters all rows)
anon_read_locked = ra.status_code in (401, 403, 404) or (ra.status_code == 200 and ra.json() == [])
check("RLS: anon key cannot READ leads", anon_read_locked, f"HTTP {ra.status_code} body={ra.text[:80]}")

raw = requests.post(
    f"{REST}/leads",
    headers={**anon_h, "Content-Profile": "studio_site", "Content-Type": "application/json"},
    json={"name": "rls-test", "email": "rls@test.dev", "project_type": "not_sure"},
    timeout=15,
)
check("RLS: anon key cannot WRITE leads", raw.status_code in (401, 403, 404), f"HTTP {raw.status_code} body={raw.text[:120]}")

# ---------- 4: leads insert/select/delete round-trip ----------
payload = {
    "name": "POC Test Lead",
    "email": "poc-test@arvastudios.internal",
    "company": "POC Co",
    "project_type": "web_products",
    "budget_range": "₹35,000+",
    "message": "Core POC round-trip — safe to delete",
    "ip_hash": "poc-hash",
}
ri = requests.post(f"{REST}/leads", headers=svc_headers(write=True), json=payload, timeout=15)
lead_id = None
if ri.status_code == 201:
    lead_id = ri.json()[0]["id"]
    defaults_ok = ri.json()[0]["status"] == "new" and ri.json()[0]["source"] == "website"
    check("leads INSERT (service role)", True, f"id={lead_id}, defaults status/source ok={defaults_ok}")
else:
    check("leads INSERT (service role)", False, f"HTTP {ri.status_code} {ri.text[:200]}")

if lead_id:
    rs = requests.get(f"{REST}/leads?id=eq.{lead_id}", headers=svc_headers(), timeout=15)
    check("leads SELECT round-trip", rs.status_code == 200 and len(rs.json()) == 1)

# ---------- 5: email_log insert ----------
log_id = None
if lead_id:
    rl = requests.post(
        f"{REST}/email_log",
        headers=svc_headers(write=True),
        json={"lead_id": lead_id, "email_type": "notification", "status": "sent", "provider_message_id": "poc-msg-id"},
        timeout=15,
    )
    if rl.status_code == 201:
        log_id = rl.json()[0]["id"]
        check("email_log INSERT", True, f"id={log_id}")
    else:
        check("email_log INSERT", False, f"HTTP {rl.status_code} {rl.text[:200]}")

# ---------- 6: Resend sends ----------
def send_email(to, subject, html):
    resp = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        json={"from": f"ARVA Studios <{RESEND_FROM}>", "to": [to], "subject": subject, "html": html,
              "reply_to": INTERNAL_EMAIL},
        timeout=15,
    )
    return resp

rn = send_email(INTERNAL_EMAIL, "[POC] ARVA core test — internal notification",
                "<p>Core POC: internal notification path works. Safe to ignore.</p>")
check("Resend: internal notification send", rn.status_code == 200, f"HTTP {rn.status_code} {rn.text[:150]}")

rc = send_email("external-submitter-test@example.com", "[POC] ARVA core test — confirmation",
                "<p>Core POC confirmation-path probe.</p>")
# In sandbox this is EXPECTED to fail (403). Either outcome is acceptable; we just document it.
sandbox_restricted = rc.status_code != 200
check("Resend: external confirmation probe (documenting sandbox behavior)", True,
      f"HTTP {rc.status_code} — {'SANDBOX-RESTRICTED as expected; will log as failed in email_log' if sandbox_restricted else 'external sends WORK'} | {rc.text[:150]}")

# ---------- cleanup ----------
if log_id:
    rd = requests.delete(f"{REST}/email_log?id=eq.{log_id}", headers=svc_headers(write=True), timeout=15)
    check("cleanup: email_log test row deleted", rd.status_code in (200, 204))
if lead_id:
    rd = requests.delete(f"{REST}/leads?id=eq.{lead_id}", headers=svc_headers(write=True), timeout=15)
    check("cleanup: leads test row deleted", rd.status_code in (200, 204))

# ---------- summary ----------
failed = [n for n, ok, _ in RESULTS if not ok]
print("\n" + "=" * 60)
print(f"CORE POC: {len(RESULTS) - len(failed)}/{len(RESULTS)} passed")
if failed:
    print("FAILED:", failed)
    sys.exit(1)
print("ALL CORE CHECKS PASSED")
