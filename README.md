# ARVA Studios — Official Website

Production single-page site for ARVA Studios, a digital creative studio in
Bengaluru (early access Dec 2026, launch Jan 1 2027). Real backend, real
database, real transactional email — not a static page.

## Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 19 (Vite) + TypeScript + Tailwind CSS |
| Backend   | FastAPI (Python) — all validation, rate limiting, DB writes and email sends are server-side |
| Database  | Supabase Postgres — `studio_site` schema (`leads`, `email_log`), RLS locked to service role only |
| Auth      | Supabase Auth initialized for a future client portal (unused today) |
| Email     | Resend (confirmation + internal notification, 1 retry with backoff, audited in `email_log`) |
| Monitoring| Sentry — two separate projects: one backend DSN, one frontend DSN |

## Architecture

- `GET /api/health` — checks real Supabase connectivity, returns JSON status.
- `POST /api/leads` — the lead pipeline: sanitize → validate → honeypot (silent
  fake-success) → IP rate limit (5/hour, one-way hashed IP, never raw) → insert
  into `studio_site.leads` → send confirmation + notification via Resend with one
  retry → audit both sends in `studio_site.email_log` → Sentry on every failure
  path (PII-free). If the DB insert fails the lead is still emailed to the studio
  ("don't lose the lead").
- The browser's Supabase anon key has **zero** table access — all reads/writes go
  through FastAPI with the service role key.

## Running locally

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in real values
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend
cd frontend
yarn install
cp .env.example .env   # fill in real values
yarn start             # Vite dev server on :3000
```

The backend **fails loudly at startup** if any required env var is missing.

## Environment variables

See `backend/.env.example` and `frontend/.env.example`. Never commit real values.

| Variable | Tier | Notes |
|----------|------|-------|
| `SUPABASE_URL` | backend (server-only) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | backend (server-only) | Full-access key — never expose to the browser |
| `RESEND_API_KEY` | backend (server-only) | Resend transactional email |
| `RESEND_FROM_EMAIL` | backend (server-only) | Verified sending address |
| `INTERNAL_NOTIFICATION_EMAIL` | backend (server-only) | Studio inbox for lead notifications |
| `SENTRY_DSN` | backend (server-only) | Backend Sentry project DSN |
| `IP_HASH_SALT` | backend (server-only) | Salt for one-way IP hashing |
| `CORS_ORIGINS` | backend (server-only) | Comma-separated allowed origins |
| `ALLOW_TEST_SIMULATION` | backend (server-only) | **Must be `false` or unset in production — this flag exists for QA only.** When false, the `X-Simulate` header is silently ignored (never read), with no behavioral or timing difference. |
| `VITE_SUPABASE_URL` | frontend (client-exposed) | For Supabase Auth init only |
| `VITE_SUPABASE_ANON_KEY` | frontend (client-exposed) | Zero table access (RLS) |
| `VITE_CALENDAR_LINK` | frontend (client-exposed) | Empty/placeholder → "Book a Call" shows a disabled "Calendar link coming soon" state |
| `VITE_SENTRY_DSN` | frontend (client-exposed) | Frontend Sentry project DSN (separate project from backend) |

## Pre-launch checklist

- [ ] **Confirm `ALLOW_TEST_SIMULATION` is `false` or unset in the production environment** — fine in a test env, dangerous if it silently ships on.
- [ ] Verify `arvastudios.in` in Resend, switch `RESEND_FROM_EMAIL` to the verified domain, and re-test both email paths (confirmation to an external address must log `sent`).
- [ ] Set `INTERNAL_NOTIFICATION_EMAIL` to the real studio inbox (post-verification it no longer has to be the Resend account email).
- [ ] Replace the 132×132 raster logo source with the designer's vector/≥512px file and regenerate the 180/192/512 icons.
- [ ] Set `VITE_CALENDAR_LINK` to the real Google Calendar scheduling URL.
- [ ] Confirm no real secrets are committed; `.env.example` files contain placeholders only.

### Resend sandbox note

While `RESEND_FROM_EMAIL=onboarding@resend.dev` (unverified domain), Resend only
delivers to the account owner's email. Confirmation emails to real submitters
log as `failed` in `email_log` — expected until the domain is verified in
Resend. No code changes needed after verification.

### QA simulation hooks

With `ALLOW_TEST_SIMULATION=true`, `POST /api/leads` honors an `X-Simulate`
header (`db_failure` | `email_failure`) so failure paths can be tested without
breaking infrastructure. Keep `false` in production.

## Database schema

Schema `studio_site` (not `public`), RLS enabled on every table, no anon
policies. `leads` (name, email, company, project_type, budget_range, message,
status, source, ip_hash) and `email_log` (lead_id FK, email_type, status,
provider_message_id, error_message). Indexes on created_at DESC, email, status.
