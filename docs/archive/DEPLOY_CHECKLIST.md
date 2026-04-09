# Deploy Checklist (Hostinger VPS)

## 1. Pre-Deploy Safety
- Create staging branch and deploy preview on staging subdomain first.
- Backup database:
  - mysqldump -u USER -p DATABASE > backup-$(date +%F)-pre-repair.sql
- Backup uploads directory:
  - tar -czf uploads-backup-$(date +%F).tar.gz /var/www/burch-contracting/public/uploads
- Record current release commit hash for rollback.

## 2. Required Runtime Env
- Copy values from ENVIRONMENT_TEMPLATE.md into server env file.
- Ensure critical DB/auth vars are set before start.
- Confirm SMTP vars for notification email flow.

## 3. Database Migration
- Run:
  - mysql -u USER -p DATABASE < migrations/2026-03-27-lead-core-hardening.sql
- Verify tables:
  - contact_leads
  - lead_attachments
  - lead_notes
  - lead_activities

## 4. App Build And Release
- Install deps:
  - npm ci
- Build:
  - npm run build
- Start/restart service:
  - pm2 restart burch-contracting
  - or systemctl restart burch-contracting

## 5. Post-Deploy Smoke
- GET /api/health => healthy or includes only missingEmailEnv warnings
- Submit contact form test without file
- Submit contact form test with file
- Open admin CRM list and lead detail
- Download attachment
- Validate public homepage Recent Projects section renders cards (live or fallback)

## 6. Rollback Plan
- Rollback app code:
  - git checkout <previous-stable-commit>
  - npm ci
  - npm run build
  - restart service
- Rollback DB:
  - mysql -u USER -p DATABASE < backup-YYYY-MM-DD-pre-repair.sql
- Rollback uploads:
  - restore uploads backup archive

## 7. Manual Cleanup
- Remove duplicate non-production roots:
  - imported_repo
  - burch-contracting
- Remove stale tmp artifacts not needed for operations.
