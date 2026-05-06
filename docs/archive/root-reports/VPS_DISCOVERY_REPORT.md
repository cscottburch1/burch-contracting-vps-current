# VPS Discovery Report

Date: 2026-03-27

## Environment Facts (Detected)
- Hostname: srv1178278
- SSH user: root
- OS kernel: Linux 6.8.0-90-generic x86_64 GNU/Linux
- Node.js: v24.11.1
- npm: 11.6.2

## Live App Runtime (Detected)
- Process manager: PM2 6.0.14
- Process name: burch-contracting
- PM2 mode: cluster
- PM2 cwd: /root/burch-contracting
- PM2 exec: npm start

## Deploy Path and Git
- Active deploy path (from PM2 cwd): /root/burch-contracting
- Active branch: main
- Active commit at discovery: 1da7b919ba3bd31e48d932bd8e3867172fcd89e8
- Origin remote: https://github.com/cscottburch1/burch-contracting-fresh.git

## Nginx Detection
- Enabled site file: /etc/nginx/sites-enabled/burch-contracting
- Available site file: /etc/nginx/sites-available/burch-contracting
- server_name values:
  - burchcontracting.com
  - www.burchcontracting.com
- Upstream target: http://127.0.0.1:3000
- Upload body limit: client_max_body_size 20m

## Environment Files (Detected)
- /root/burch-contracting/.env.local
- /root/burch-contracting/.env.production
- /root/burch-contracting/.env.local.backup

## Upload Paths (Detected)
- /root/burch-contracting/public/uploads
- /root/burch-contracting/src/app/uploads

## Backup/Recovery Strategy (Detected)
- Git history available in live repo.
- Nginx backup file present: /etc/nginx/sites-available/burch-contracting.bak-20260318-canonical-fix
- Additional server repo copies detected:
  - /var/www/burch-contracting
  - /root/burch-contracting.old.working

## Notes
- Active production process is running from /root/burch-contracting (not /var/www/burch-contracting).
- No destructive changes were made during discovery.
