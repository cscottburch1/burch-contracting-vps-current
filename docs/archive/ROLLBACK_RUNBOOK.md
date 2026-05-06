# Rollback Runbook

Date: 2026-03-27
Applies to live app at /root/burch-contracting

## Current Deployed Commit
- 41bba7333aa44c7996a8b7ae31a1250010cdfed5

## Pre-Deploy Baseline Commit
- 1da7b919ba3bd31e48d932bd8e3867172fcd89e8

## Snapshot Artifacts
- /root/deploy-snapshots/20260327-172241
  - includes nginx and env snapshots plus pre-deploy git metadata

## Fast Rollback Procedure (Git Reset to Baseline Commit)
Run on VPS:

1. cd /root/burch-contracting
2. git fetch origin
3. git checkout main
4. git reset --hard 1da7b919ba3bd31e48d932bd8e3867172fcd89e8
5. npm install --no-fund --no-audit
6. npm run build
7. pm2 restart burch-contracting
8. curl -sS https://burchcontracting.com/api/health

Notes:
- Use only for emergency rollback to known pre-deploy commit.
- This does not touch database data.

## Alternative Rollback (Revert Commit)
1. cd /root/burch-contracting
2. git checkout main
3. git revert --no-edit 41bba7333aa44c7996a8b7ae31a1250010cdfed5
4. npm install --no-fund --no-audit
5. npm run build
6. pm2 restart burch-contracting
7. verify /api/health and admin routes

## Nginx Restore (Only If Needed)
If nginx config was changed and broken:
1. cp /root/deploy-snapshots/20260327-172241/nginx-sites-enabled-burch-contracting.conf /etc/nginx/sites-enabled/burch-contracting
2. cp /root/deploy-snapshots/20260327-172241/nginx-sites-available-burch-contracting.conf /etc/nginx/sites-available/burch-contracting
3. nginx -t
4. systemctl reload nginx

## Env Restore (Only If Needed)
1. cp /root/deploy-snapshots/20260327-172241/.env.local.snapshot /root/burch-contracting/.env.local
2. cp /root/deploy-snapshots/20260327-172241/.env.production.snapshot /root/burch-contracting/.env.production
3. pm2 restart burch-contracting

## Upload Preservation
- Upload path: /root/burch-contracting/public/uploads
- Rollback commands above do not delete this path.
- Do NOT run rm on uploads.
- Verify after rollback:
  - ls -ld /root/burch-contracting/public/uploads

## Post-Rollback Validation
- curl -sS https://burchcontracting.com/api/health
- open /admin, /admin/crm, /contact
- check PM2 status:
  - pm2 status burch-contracting
- check logs:
  - tail -n 100 /root/.pm2/logs/burch-contracting-error-0.log
