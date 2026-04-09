# Burch Contracting Repair Audit (2026-03-27)

## Source Of Truth App Root
- Final app root: src
- Final package root: package.json in repository root
- Final Next config: next.config.ts in repository root

## Package And App Root Inventory
- package.json files found: 2
  - package.json (active production root)
  - imported_repo/package.json (obsolete Vite app copy, not used)
- Next router roots found:
  - src/app (active)
  - burch-contracting/src/app (obsolete nested copy, not active)

## Duplicate Folders To Remove
- imported_repo (obsolete parallel app)
- burch-contracting (obsolete nested app)
- tmp backup artifacts not required for runtime (retain only if needed for local forensics)

Note: direct deletion is blocked by terminal policy in this session. Remove with manual server/local cleanup after branch backup.

## Dead Integrations Found
- Supabase references: only in imported_repo and docs, not active runtime.
- Vercel references: docs only, not active runtime path.
- Firebase references: none in active runtime.
- Legacy/duplicate auth file: src/lib/adminAuth.old.ts (obsolete file; not imported by runtime).

## API/Flow Findings
- Contact flow previously mixed queue fallback + legacy JSON attachment strategy, causing inconsistent attachment persistence semantics.
- CRM lead detail previously read attachment filenames from contact_leads.attachments only, with filesystem fallback.
- Attachment download previously validated only path segment and filesystem presence, not DB ownership metadata.
- No root middleware in active app root for admin route shell gating.
- Recent projects component could enter poor UX states when API failed/slow.

## Attachment State Assessment (before repair)
- Upload accepted and files written to disk in many cases.
- Metadata persisted as JSON filenames in contact_leads.attachments (non-normalized).
- Retrieval depended on JSON parsing + fallback directory listing.
- Email send could fail after lead creation; result was logged but not normalized in activity table.

## Env Variables Required By Active Runtime
- Core DB/Auth:
  - MYSQL_HOST
  - MYSQL_PORT
  - MYSQL_USER
  - MYSQL_PASSWORD
  - MYSQL_DATABASE
  - ADMIN_SESSION_SECRET
- Contact/email/security:
  - ADMIN_EMAIL
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS
  - SMTP_FROM
  - RECAPTCHA_SECRET_KEY
  - NEXT_PUBLIC_RECAPTCHA_SITE_KEY
- URL/public:
  - NEXT_PUBLIC_BASE_URL
  - NEXT_PUBLIC_SITE_URL
- Optional feature envs currently referenced:
  - ALLOW_HEALTH_INIT
  - NEXT_PUBLIC_GA_MEASUREMENT_ID
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - OPENAI_API_KEY

## DB Utilities And Connection Points
- Primary connection utility: src/lib/mysql.ts
- DB init utility: src/lib/dbInit.ts
- New lead domain service introduced: src/lib/leadService.ts

## Recent Projects Data Source
- Public section fetches /api/projects/recent
- Primary source: recent_projects table
- New fallback source added: src/lib/seo/projectSpotlightsData.ts representative entries

## Required Database Tables (minimum for repaired lead/CRM path)
- contact_leads
- lead_attachments
- lead_notes
- lead_activities
- admin_users
- recent_projects (if public recent projects section remains enabled)

## Ranked Root Causes
1. Mixed legacy lead schema strategy (JSON attachment column + filesystem fallback) produced fragile attachment consistency.
2. Missing normalized lead_attachments metadata table in active runtime flow.
3. Admin shell route protection absent at active app root middleware level.
4. Duplicate app roots (imported_repo and burch-contracting) increased maintenance and integration confusion.
5. Weak fail-fast env visibility for production startup/misconfiguration scenarios.
6. Public recent-projects UX had no robust timeout/fallback story for API degradation.
