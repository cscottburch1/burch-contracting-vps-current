# Environment Template (Production/Staging)

## Core Runtime (required)
MYSQL_HOST=
MYSQL_PORT=3306
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

ADMIN_SESSION_SECRET=
ADMIN_EMAIL=

NEXT_PUBLIC_BASE_URL=https://burchcontracting.com
NEXT_PUBLIC_SITE_URL=https://burchcontracting.com

## Email (required for notifications)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

## Spam Protection
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

## Optional Feature Flags
ALLOW_HEALTH_INIT=false

## Optional Analytics/Payments/AI
NEXT_PUBLIC_GA_MEASUREMENT_ID=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=

## Notes
- Keep this file out of client bundle.
- Never commit real secrets.
- For staging, use separate DB/schema and SMTP sender identity.
