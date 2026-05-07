# Admin/Backend Audit

Date: 2026-05-06
Scope: admin/backend cleanup only (conservative)

## Phase 1 Baseline
- `git status`: clean on branch `cleanup/repository-audit`
- `git log --oneline -5`: captured in terminal
- `npm run lint`: failed due to existing non-admin error in `src/components/calculators/CompetitivePricingCalculator.tsx` (`react-hooks/preserve-manual-memoization`)
- `npm run typecheck`: script does not exist
- `npm run build`: passes

## Phase 2 Inventory

### Active admin routes (App Router pages)
- `src/app/admin/**/page.tsx` routes are active and present for:
- Dashboard, CRM/Leads, Customers, Projects, Proposals, Invoices, Messages, Calendar, Subcontractors, Tradesmen, Employees, Settings, Tools, Migrate

### Active API routes
- `src/app/api/admin/**/route.ts`: extensive admin CRUD + utilities + migration endpoints
- `src/app/api/contact/route.ts`: public lead capture endpoint (critical)
- `src/app/api/crm/**`: lead detail/notes/activity/attachments
- `src/app/api/health/route.ts`: health endpoint with optional init mode
- `src/app/api/subcontractors/apply/route.ts`: subcontractor intake
- `src/app/api/payments/create-intent/route.ts` and `src/app/api/payments/webhook/route.ts`: intentionally disabled with 410

### Core backend libraries
- Auth/session: `src/lib/adminAuth.ts`, `src/lib/customerAuth.ts`, `src/lib/tradesmanAuth.ts`
- Database/client: `src/lib/mysql.ts`, `src/lib/dbInit.ts`
- Leads/contact: `src/lib/leadService.ts`, `src/lib/leadScoring.ts`, `src/lib/spamDetection.ts`, `src/lib/rateLimit.ts`, `src/lib/recaptcha.ts`
- Uploads/attachments: `src/lib/uploads.ts`, `src/app/api/admin/upload/route.ts`, `src/app/api/crm/leads/[id]/attachments/[filename]/route.ts`
- Email: `src/lib/mailer.ts`

### Environment templates
- `.env.example` is not present
- Present templates: `.env.production.example`, `.env.recaptcha.example`, `.env.stripe.example`

## Phase 3 Classification

### KEEP
- `src/app/api/contact/route.ts`
- `src/lib/leadService.ts`
- `src/lib/uploads.ts`
- `src/app/api/crm/leads/[id]/attachments/[filename]/route.ts`
- `src/app/api/health/route.ts`
- `src/lib/adminAuth.ts`
- `src/lib/mysql.ts`
- `src/lib/mailer.ts`
- `src/app/admin/**` operational pages (dashboard/leads/projects/invoices/messages/settings/tools)

### KEEP BUT DOCUMENT
- `src/app/admin/migrate/page.tsx` and `src/app/api/admin/migrate-*/route.ts`
- Rationale: migration/setup tooling is not day-to-day operational UI, but is useful for recovery and environment bootstrap.
- `src/app/api/payments/create-intent/route.ts` and `src/app/api/payments/webhook/route.ts`
- Rationale: correctly disabled with 410 to protect old URLs.
- `.env.stripe.example`
- Rationale: deprecation marker file already states Stripe is retired.

### REMOVE
- `src/components/admin/AdminPageHeader.tsx`
- Rationale: no references found in `src/**`; safe dead component removal.

### DISABLE
- No newly disabled routes were added in this pass.
- Existing disabled routes retained:
- `src/app/api/payments/create-intent/route.ts` (410)
- `src/app/api/payments/webhook/route.ts` (410)
- `src/app/api/admin/migrate-payments/route.ts` (410)

### NEEDS OWNER DECISION
- `src/app/portal/invoices/[id]/pay/page.tsx` and `src/app/portal/invoices/[id]/success/page.tsx`
- These pages call `/api/customer/invoices/...`, but no matching `src/app/api/customer/**` routes were found.
- Options: remove/deprecate pages, or implement/restore customer invoice API.
- `src/middleware.ts` admin gate only checks whether cookie contains a dot for `/admin/*` redirect behavior.
- Route-level API auth exists in many handlers, but middleware check itself is weak and should be tightened in a dedicated auth pass.

## Phase 4 Critical Systems Protection Review

### Contact/estimate lead capture
- `src/app/api/contact/route.ts` uses:
- honeypot check
- rate limiting
- optional reCAPTCHA validation
- lead schema ensure/create
- attachment persistence
- email notify with fallback logging
- Status: preserved

### Lead storage + CRM
- Lead creation and activities are persisted via `src/lib/leadService.ts`
- CRM attachment download route enforces admin auth and sanitized path segments
- Status: preserved

### Upload/attachment handling
- Admin upload endpoint preserved and hardened (see Phase 9 changes)
- Lead attachment metadata handling preserved
- Status: preserved

### Admin lead/project visibility
- Admin CRM and projects routes/pages remain intact
- Status: preserved

### `/api/health`
- Present and preserved
- Status: preserved

## Phase 5 Stripe/Payment Findings
- Stripe SDK usage not found in active backend logic.
- Payment endpoints are already retired and return 410.
- Payment migration endpoint also returns 410.
- No Stripe dependency removal needed from `package.json` in this pass.

## Phase 6 Supabase/Database Findings
- No active Supabase usage found in `src/**`.
- Active database layer is MySQL (`mysql2`) via `src/lib/mysql.ts`.
- Environment mismatch found in template and corrected in this pass.

## Phase 7 Admin UX Cleanup (safe)
- No structural redesign performed.
- Dead admin component removed.
- Existing admin tools organization retained.

## Phase 8 Security Review

### Fixed low-risk issue
- Hardened `src/app/api/admin/upload/route.ts` with MIME and extension allowlist checks.

### Noted concerns
- `src/middleware.ts` admin gate checks cookie format, not signature validity.
- Multiple routes still use broad `console.error(...)`; verify no sensitive payloads are logged in production logs.

## Phase 9 Cleanup Actions Performed
- Updated env template keys to match runtime expectations:
- `.env.production.example`
- Replaced `DB_*` keys with `MYSQL_*`
- Added required `ADMIN_SESSION_SECRET`
- Added required `SMTP_FROM`
- Removed confirmed-unused component:
- `src/components/admin/AdminPageHeader.tsx`
- Hardened upload endpoint:
- `src/app/api/admin/upload/route.ts`
- Added conservative file type and extension allowlist

## Phase 10 Validation Status
- Post-cleanup checks run:
- `npm run lint`: still fails due to pre-existing non-admin error in calculator component
- `npm run typecheck`: script missing
- `npm run build`: passes

### Route smoke checks
- Not executed via local running server in this pass.
- Validation confidence is based on successful build and targeted static code review of critical paths.
- Recommended next command sequence for local route checks:
- `npm run dev`
- `curl -i http://localhost:3000/api/health`
- `curl -i http://localhost:3000/contact`
- `curl -i http://localhost:3000/admin`
- `curl -i http://localhost:3000/admin/projects`
- `curl -i -X POST http://localhost:3000/api/contact` (with safe test payload)
- Attachment download route requires admin auth cookie; cannot fully validate anonymously.

## Phase 11 Deliverable Summary

1. Files changed
- `.env.production.example`
- `src/app/api/admin/upload/route.ts`
- `docs/admin-backend/ADMIN_BACKEND_AUDIT.md`
- `src/components/admin/AdminPageHeader.tsx` removed

2. Admin/backend files removed
- `src/components/admin/AdminPageHeader.tsx`

3. Disabled routes
- Retained existing 410 payment routes (no new disabled route added)

4. Stripe/payment remnants
- Retired endpoints remain intentionally disabled (410)
- No active Stripe runtime integration found

5. Supabase/database findings
- Supabase not active
- MySQL is active backend store
- Env template mismatch fixed

6. Lead/contact form validation status
- Critical lead pipeline code preserved and reviewed
- Build passes
- Runtime endpoint post not executed in this pass

7. Upload/attachment validation status
- CRM secure attachment route preserved
- Admin upload route hardened with allowlist checks

8. Security concerns found
- Weak middleware cookie-format gate for admin redirects
- Recommend dedicated auth hardening pass (without broad architecture changes)

9. Build/lint/typecheck results
- Build: pass (324 pages after payment portal removal)
- Lint: fail (pre-existing non-admin calculator issue)
- Typecheck: pass (exit 0) — `typecheck` script added to package.json

10. Owner decisions resolved / remaining
- RESOLVED: Portal invoice pay/success pages deleted; Stripe API routes deleted; migrate-payments route deleted; payments section removed from /admin/migrate
- Remaining: Decide whether migration UI should remain directly accessible (`/admin/migrate`) or be owner-hidden
- Remaining: Strengthen middleware admin gate to signed-cookie verification

11. Recommended next pass
- Tighten middleware admin gate to signed-cookie verification strategy compatible with middleware runtime
- Add authenticated integration checks for lead attachments and admin uploads
