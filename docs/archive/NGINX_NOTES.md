# Nginx Notes (Hostinger VPS)

## Reverse Proxy Basics
- Proxy to Next app (Node) upstream, typically localhost:3000.
- Ensure forwarded headers are preserved.

## Upload Size Requirements
- Contact route supports files up to 10MB each, max 5 files.
- Nginx must allow request body above aggregate form size overhead.
- Recommended:
  - client_max_body_size 60m;

## Example Server Block Snippet
server {
  listen 80;
  server_name burchcontracting.com www.burchcontracting.com;

  client_max_body_size 60m;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}

## Optional Hardening
- Add rate limiting on /api/contact at nginx layer for burst abuse.
- Keep static upload files private by default if switching to protected non-public storage in a later iteration.

## Validation
- nginx -t
- systemctl reload nginx
- Test contact form with/without attachment through public domain
