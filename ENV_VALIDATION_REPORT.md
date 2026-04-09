# Environment Validation Report

Date: 2026-03-27
Validation source: /root/burch-contracting/.env.production and /root/burch-contracting/.env.local

## Required Variables
- DB_HOST: PRESENT
- DB_PORT: PRESENT
- DB_NAME: PRESENT
- DB_USER: PRESENT
- DB_PASSWORD: PRESENT
- SMTP_HOST: PRESENT
- SMTP_PORT: PRESENT
- SMTP_USER: PRESENT
- SMTP_PASS: PRESENT
- SMTP_FROM: PRESENT
- ADMIN_SESSION_SECRET: PRESENT
- NEXT_PUBLIC_BASE_URL: PRESENT

## Optional / Conditional Variables
- RECAPTCHA_SECRET_KEY: OPTIONAL_MISSING
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY: OPTIONAL_MISSING
- UPLOAD_DIR: OPTIONAL_MISSING
- UPLOAD_PATH: OPTIONAL_MISSING
- DATABASE_URL: OPTIONAL_MISSING

## Mapping Note
Production uses SMTP_PASS and SMTP_FROM naming (not SMTP_PASSWORD / MAIL_FROM).

## Result
- Critical environment set: PASS
- Deployment blocked by env: NO
