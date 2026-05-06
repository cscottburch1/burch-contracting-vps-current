# Pre-Deploy Safety Snapshot

Date: 2026-03-27

## Snapshot Artifacts Created on VPS
- Snapshot directory: /root/deploy-snapshots/20260327-172241
- Captured files:
  - pre_commit.txt
  - pre_branch.txt
  - pre_status.txt
  - nginx-sites-enabled-burch-contracting.conf
  - nginx-sites-available-burch-contracting.conf
  - .env.local.snapshot
  - .env.production.snapshot
  - uploads_stat.txt

## Baseline State Before Pull
- App root: /root/burch-contracting
- Branch: main
- Commit: 1da7b919ba3bd31e48d932bd8e3867172fcd89e8
- Git status baseline:
  - M tmp/subcontractor_applications.json
  - ?? .next-mode
  - ?? ecosystem.config.js
  - ?? public/indexnow-key.txt
  - ?? public/uploads/

## Env File Presence and Metadata
- .env.local present
- .env.production present
- .env.local.backup present

## Nginx References
- /etc/nginx/sites-enabled/burch-contracting
- /etc/nginx/sites-available/burch-contracting

## Database Reachability
- Result: DB_CONNECT:OK
- Verified from production app server using env credentials.

## Disk Space
- /dev/sda1: 49G total, 17G used, 32G available (35%)

## Uploads Directory Check
- /root/burch-contracting/public/uploads
  - owner: root:root
  - mode: 700
- /root/burch-contracting/src/app/uploads
  - owner: root:root
  - mode: 700

## Safety Actions Taken
- No production data deleted.
- No nginx config overwritten.
- Rollback artifacts captured before deploy.
