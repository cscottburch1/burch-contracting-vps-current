# Nginx and Upload Readiness Report

Date: 2026-03-27

## Nginx Production Config Verification
- Config file in use: /etc/nginx/sites-enabled/burch-contracting
- Canonical domain configured: burchcontracting.com
- WWW redirect configured: www.burchcontracting.com -> burchcontracting.com
- Proxy upstream: http://127.0.0.1:3000
- Upload body limit: client_max_body_size 20m
- SSL termination: enabled on 443 with certbot paths

## Validation Outcome
- server_name correctness: PASS
- upstream target correctness: PASS
- upload size limit adequate (>=15M): PASS
- stale app root reference in nginx: NOT FOUND

## Upload Path Readiness
- App runtime path: /root/burch-contracting
- Primary upload directory: /root/burch-contracting/public/uploads
- Exists: YES
- Owner: root:root
- Mode: 700
- App user: root (PM2 process user), so writable by app runtime.

## Storage Model
- Uploads stored inside live app path under public/uploads.
- Not symlinked to external shared mount.
- Persistence depends on preserving app directory and git-ignored uploads.

## Nginx Reload
- Config change required: NO
- nginx reload executed: NO (not needed)
