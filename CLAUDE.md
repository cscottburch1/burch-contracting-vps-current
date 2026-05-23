# CLAUDE.md — Burch Contracting Site Context

## Project Overview
Next.js 14 App Router site for Burch Contracting (burchcontracting.com). Garage door contractor,
license CLG118679, founded 1995, BBB A+. Owner: C. Scott Burch.

## Server & Deploy

- **VPS**: Hostinger at 72.60.166.68, user `root`
- **App root**: `/var/www/burch-contracting/`
- **Process manager**: PM2, process name `burch-contracting`
- **Database**: SQLite at `/var/www/burch-contracting/database/`
- **Deploy pipeline**: `git push` → GitHub Actions → SSH → `npm ci` → `npm run build` → `pm2 restart burch-contracting`
- **Uploads**: Set `UPLOAD_DIR` env var on VPS to a path outside the git folder (e.g. `/var/uploads/burch-contracting`) so files survive `git reset --hard`. Falls back to `public/uploads` if unset.

## Environment Variables (VPS `.env`)
- `UPLOAD_DIR` — persistent upload storage root outside git folder
- `ADMIN_SECRET` — used for HMAC-SHA256 admin session cookie signing
- `DATABASE_URL` — SQLite path (or MySQL connection string locally)
- `RECAPTCHA_SECRET_KEY`, `OPENAI_API_KEY`, `NODEMAILER_*` — DO NOT TOUCH

## Auth Pattern
Admin routes use `verifyAdminAuth(request)` from `@/lib/adminAuth`. Cookie name is `admin_session`
(underscore). Never use `request.cookies.get('admin-session')` (hyphen — wrong).

## App Structure
```
src/app/
  (site)/          — public-facing pages
  admin/           — admin CRM and portal
  api/
    crm/           — lead management endpoints
    admin/         — admin utility endpoints (upload, etc.)
    contact/       — DO NOT TOUCH (nodemailer)
    employment/    — DO NOT TOUCH (nodemailer)
  portal/          — client portal (noindex)
  uploads/[filename]/ — protected file serving route
src/lib/
  adminAuth.ts     — HMAC cookie verification
  leadService.ts   — CRM lead/attachment DB queries
  uploads.ts       — file validation and storage helpers
  mysql.ts         — DB query helpers (used locally; SQLite on VPS via same interface)
```

## NO-TOUCH ZONES
Never modify these files/paths:
- `src/app/api/contact/route.ts`
- `src/app/api/employment/` (any file)
- `src/components/forms/MultiStepEstimateForm.tsx`
- `src/components/seo/QuickEstimateForm.tsx`
- `.github/workflows/` (any file)
- `.env.local`, `.env`
- `package.json`, `package-lock.json`
- `next.config.ts` — except the redirects array
- `database/` (any file)
- Any file containing: `nodemailer`, `handleSubmit`, `RECAPTCHA`, `OPENAI_API_KEY`

## Working Rules
1. Read before write — always
2. One commit per fix
3. Specific `git add <file>` only — never `git add .`
4. Never force push, never amend after pushing
5. Never run `npm run build` or `npm start`
6. If a fix touches more than 2 files, stop and confirm with user before proceeding
7. Never delete files
8. Show exact diff before writing any change
9. If unsure — stop and ask

## Key URLs
- Production: https://burchcontracting.com
- Sitemap: https://burchcontracting.com/sitemap.xml
- Robots: https://burchcontracting.com/robots.txt

## Canonical Routes (do not add redirects without verifying these)
- `/projects` — portfolio (canonical; `/work` redirects here 301)
- `/services` — services index
- `/about`, `/contact`, `/careers`, `/portal`

## Verified Stats
- 27 garage projects in portfolio
- Service areas: Raleigh, Durham, Chapel Hill, Cary, Apex, Morrisville, Holly Springs, Fuquay-Varina, Garner, Clayton, Wake Forest, Pittsboro, Sanford, Siler City
