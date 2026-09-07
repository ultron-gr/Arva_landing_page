# ARVA Studios — plan.md

## 1) Objectives
- Prove the **core workflow** works end-to-end with real services: **Supabase (schema `studio_site`) + FastAPI server-side validation + IP rate limiting + Resend emails + audit logging + Sentry (2 DSNs)**.
- Build the **single-page production site** (12 sections) with the specified **brand + motion** while enforcing **performance-first** and WCAG AA.
- Ship a V1 that is **fully responsive (360→1536)**, has **zero dead links**, and a lead form that **really writes + really emails** (with graceful handling of provider limitations).

## 2) Implementation Steps

### Phase 1 — Core POC (Isolation) (must pass before UI work)
**User stories**
1. As a visitor, I can submit a lead and the server stores it in Supabase without exposing write access to the browser.
2. As a visitor, I get an on-screen success even if confirmation email fails (so I’m not blocked).
3. As the studio, I receive an internal notification email for each valid lead.
4. As the system, suspicious bot submits via honeypot get a fake success but are not stored/emailed.
5. As the system, repeated submissions from the same IP are rate-limited to 5/hour.

**Steps**
- Websearch best practices: FastAPI + Supabase PostgREST usage with `Accept-Profile`, RLS/service-role patterns, Resend sandbox sender restrictions.
- Create `backend/test_core.py` (single script) that:
  - Calls Supabase PostgREST with service role key + `Accept-Profile: studio_site`.
  - Detects whether `studio_site.leads` and `studio_site.email_log` exist; if mismatch vs spec, **stop and ask user before drop/recreate**.
  - Runs insert→select→delete round-trip on `leads` (safe test payload), and inserts a row into `email_log`.
  - Sends 1 Resend email to `INTERNAL_NOTIFICATION_EMAIL` and 1 “confirmation-style” email to a non-internal address to validate sandbox constraints; record outcomes.
- Implement minimal FastAPI endpoints (POC-only):
  - `GET /api/health` (checks Supabase connectivity + schema access)
  - `POST /api/leads` (server-side validation + honeypot + rate limit + DB insert + email sends + email_log writes + Sentry capture)
- Exit criteria: POC proves DB connectivity + logging works; email send behavior is known and handled (success or predictable failure).

### Phase 2 — V1 App Development (build around proven core)
**User stories**
1. As a mobile visitor, I can scroll a fast, readable page with no layout shifts or horizontal scroll.
2. As a visitor, I can use the sticky header CTA to jump to the lead form with correct offset.
3. As a visitor, I can complete the lead form with clear inline validation and accessible focus handling.
4. As a visitor, I can understand the four pillars quickly and jump to each pillar section.
5. As a visitor using reduced-motion settings, animations are minimal and never block content.

**Steps**
- Migrate template frontend to **Vite + React + TypeScript** (keep port **3000**; keep `REACT_APP_BACKEND_URL` working alongside `VITE_` vars).
- Add Tailwind + design tokens (colors, typography, spacing, radii) including gold accents: **#D4AF37** primary, **#C9A227** muted.
- Build UI primitives: Button, Pill, Input/Select/Textarea, FormError, Table (responsive table↔cards).
- Build app shell:
  - Sticky shrinking header (logo mark + utility pill + **Book a Call →** only; **no mobile nav menu**).
  - Splash screen with keyboard-operable **Skip →**.
  - Footer with required columns/links.
- Implement anchor scrolling with header offset.
- Implement the 12 sections in order, matching copy/layout requirements:
  - Pricing table (md+ real table, <md cards)
  - Comparison split (lg side-by-side, <lg stacks dark-first)
  - Final CTA + inline lead form wired to `/api/leads`
- Calendar link fallback: if `VITE_CALENDAR_LINK` unset → hide/relabel to **“Calendar link coming soon”**.
- Add `/privacy` route + branded 404.
- Wire Sentry frontend (VITE_SENTRY_DSN) + backend (SENTRY_DSN) with PII-safe events.
- Run 1 end-to-end testing pass (agent): lead submission happy path + key UI flows.

### Phase 3 — Hardening: Accessibility, Performance, Security, QA
**User stories**
1. As a keyboard user, I can navigate the entire page with visible gold focus rings and logical tab order.
2. As a screen reader user, I get correct landmarks/headings and form announcements (errors + success).
3. As a privacy-conscious user, my submission is protected by server-side validation and security headers.
4. As a mobile user, the site loads quickly and stays smooth during scroll.
5. As the studio, I can trust errors are captured in Sentry without leaking PII.

**Steps**
- Accessibility pass: skip-to-content link, aria-live form status, semantic headings (single h1), table scopes, contrast checks.
- Performance pass: self-host fonts (woff2), lazy-load below-fold, minimal observers/listeners, strict bundle hygiene.
- Security: add headers (CSP, frame/content-type/referrer policies), sanitize user text, strict env var checks at startup.
- Full QA sweep:
  - Zero dead links/placeholder hrefs
  - Lead form failure paths: missing fields, invalid email, honeypot, rate limit, simulated DB failure, simulated email failure
  - Responsive sweep: 360/640/768/1024/1280/1536
  - Reduced-motion verification
  - Lighthouse 90+ (mobile) all categories
  - Re-test `/api/health`, `/privacy`, 404
- Run 1 end-to-end testing pass (agent) focused on regressions + edge cases.

### Phase 4 — Optional/Next (post-V1, only if requested)
**User stories**
1. As the studio, I can log into an internal area (Supabase Auth) to review leads.
2. As the studio, I can change lead status (new/contacted/qualified/archived).
3. As the studio, I can export leads to CSV.
4. As the studio, I can view email delivery status from email_log.
5. As the studio, I can edit site copy without code changes.

**Steps**
- Add Supabase Auth UI + protected admin-only pages (deferred because it complicates testing).
- Add minimal admin CRUD (status updates only) with strict RLS and server-side enforcement.

## 3) Next Actions
> STATUS 2026-09-05: PHASE 0 COMPLETE & VERIFIED.
> - POC test_core.py: 13/13 passed (Supabase connectivity, spec-matching tables reused as-is, RLS anon lockout confirmed 401 both read+write, insert/delete round-trips, Resend internal send works, external confirmation sandbox-restricted as expected).
> - INTERNAL_NOTIFICATION_EMAIL corrected to admin@arvastudios.in (Resend account owner per provider 403 message) — flagged to user.
> - Backend server.py: full lead pipeline live (sanitize, validate w/ per-field errors, honeypot fake-success, rate limit 5/hr via ip_hash count, insert, dual Resend email w/ 1 retry, email_log audit, Sentry both levels, security headers, loud env validation, /api/health w/ real Supabase check). QA simulation hooks via ALLOW_TEST_SIMULATION + X-Simulate header.
> - Frontend migrated CRA → Vite 8 + TypeScript + Tailwind 3.4 (port 3000, envPrefix VITE_+REACT_APP_, hmr clientPort 443). Fonts self-hosted: Anton (display) + Inter (body) via @fontsource. Sentry frontend DSN wired. Supabase Auth client initialized (unused, future portal).
> - User logo (132×132 white tile, black lockup) cropped + favicon set generated. NOTE: 180/192/512 icons are upscaled from 132px raster — vector/hi-res requested from user for production sharpness.
> - .env.example both tiers + README done. E2E verified live: health healthy, validation 400s, honeypot silent-drop, happy path → DB row + notification 'sent' + confirmation 'failed' (sandbox, expected). Test rows cleaned up.
> NEXT: Phase 1 (tokens+primitives) → Phase 2 (shell: header/splash/footer) → Phase 3 (anchor scroll) → Phase 4 (Hero/About/Pillars) → CHECKPOINT with user at Phase 4. Call design_agent before Phase 1 implementation.
> STATUS 2026-09-05 (2): PHASES 1-4 COMPLETE. Design guidelines at /app/design_guidelines.md (dark #0a0a0a + cream #f6f1e6 token swap via .theme-cream, gold #D4AF37 sparing use, Anton display + Inter body). Built: primitives (Button 3 variants w/ full hover/focus/active/disabled, Input/Select/Textarea w/ error states, Pill, Eyebrow, Reveal IO-based + reduced-motion), shell (fixed shrinking header logo+pill+BookACall only, splash w/ Skip→ + Esc + reduced-motion shortened, footer 3 labeled nav columns), anchor scroll (scroll-mt-24 verified 96px offset), Hero (h1 clamp, 2 CTAs), About (cream, 3 stats), Pillars (1/2/4 grid, accessible Explore links), /privacy full content, branded 404. Stubs in place for sections 5-11 so anchors work. Verified: no overflow at 360px, no console errors, tsc clean. react-router-dom upgraded to 7.15.1 (template resolutions pin). TODO flagged: Instagram/LinkedIn handles unconfirmed (visible TODO comment in Footer.tsx).
> AWAITING: Phase 4 checkpoint review. NEXT: Phase 5 (detail sections + pricing), 6 (process/comparison), 7 (lead form UI + wiring, checkpoint), 8-10 (responsive/a11y/perf + testing agent full QA sweep).
> STATUS 2026-09-05 (3): PHASES 5-7 COMPLETE + TESTED. All 12 sections live with spec copy: ContentVideo (5 services + stat callout), WebProducts (real table md+ w/ scoped row headers + caption, cards below md, 6 spec prices, Built With badges, footer note), AutomationAI (3 labeled tiers + retainer note), BrandDesign (6-grid 1/2/3), Process (cream, ordered list 4 steps), Comparison (split lg+, dark-first stack below), FinalCTA + LeadForm (client validation inline per-field, honeypot, Sending... state, 10s timeout w/ Retry, inline success, error preserves data + fallback email, consent note, aria-live). Below-fold sections lazy-loaded via React.lazy. Testing agent iteration_1: 100% pass, 35 tests, ZERO bugs (backend validation/honeypot/rate-limit/simulations, Supabase writes + audit, all frontend flows, responsive table/cards + comparison stacking, no console errors). Test rows cleaned; ALLOW_TEST_SIMULATION back to false. CONTACT_EMAIL switched to pavan@arvastudios.in (TODO: unconfirmed, user to finalize; also social handles TODO).
> AWAITING: Phase 7 checkpoint. REMAINING: Phase 8 responsive refinement, Phase 9 a11y pass, Phase 10 performance (sitemap.xml, robots.txt already needed - NOT yet created; Lighthouse 90+ verification; font/bundle audit) + final full QA sweep + checkpoint.
1. Start Phase 1 by running `test_core.py` to detect existing Supabase tables and verify PostgREST schema access (`Accept-Profile: studio_site`).
2. Confirm Resend behavior with `onboarding@resend.dev` sender (whether confirmation emails to arbitrary submitters succeed); decide final confirmation-email handling if sandbox-restricted.
3. Once Phase 1 passes, proceed to Vite+TS migration + Tailwind tokens and build Phase 2 UI.

## 4) Success Criteria
- Core POC passes: Supabase insert/select/delete works in `studio_site`; email_log writes; Resend behavior understood; Sentry captures non-PII errors.
- V1 site complete: all 12 sections + /privacy + 404, brand styling, motion with reduced-motion support, no mobile nav.
- Lead form is production-real: server-side validation/honeypot/rate-limit, DB write, internal notification, confirmation attempt, audit logging, user-safe responses.
- Non-functional: WCAG AA, Lighthouse 90+ mobile, security headers present, zero console errors, zero dead links, secrets not shipped, `.env.example` correct.
