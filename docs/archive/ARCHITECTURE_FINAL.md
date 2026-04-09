# Architecture Final (2026-03-27)

## Final App Root
- Single production app root: src
- Single production package root: repository package.json
- Single production build/start path:
  - npm run build
  - npm run start

## Folders Intentionally Kept
- src: active app, API routes, components, services
- public: static assets and persisted uploads under public/uploads/leads
- migrations: SQL migrations for controlled schema evolution
- database: legacy/reference SQL scripts (not authoritative migration source)
- scripts: deployment, smoke tests, utility scripts
- email-templates: template assets

## Folders To Remove Or Archive
- imported_repo: obsolete Vite app copy
- burch-contracting: obsolete nested Next app copy
- tmp runtime backups/artifacts: keep only required operational files

## Core Runtime Data Flow

### Contact Form + Lead Creation
1. Client submits multipart/form-data to /api/contact.
2. API validates rate-limit, honeypot, required fields, recaptcha, and file constraints.
3. Lead service ensures schema and inserts contact_leads row.
4. Upload service writes files to public/uploads/leads/{leadId}/ and normalizes metadata to lead_attachments.
5. Activity log writes lead_created, attachment_uploaded, and email_sent/email_failed.
6. Mail service sends admin notification if SMTP env is fully configured.

### Attachment Access
1. Admin requests /api/crm/leads/{id}/attachments/{filename}.
2. API verifies admin auth.
3. API checks filename ownership in lead_attachments.
4. API streams file from disk with safe headers.

### Admin CRM
- List: /api/crm/leads uses contact_leads + lead_attachments count.
- Detail: /api/crm/leads/{id} returns lead + attachment_details.
- Notes/activities: existing CRM routes continue, backed by normalized tables.

## Security Model
- API-level admin auth remains authoritative.
- Root middleware now blocks unauthenticated admin route shell access by session-cookie presence.
- Download route validates lead/file ownership via DB metadata.
- Upload handling enforces mime whitelist, file count, size limits, and filename/path sanitization.

## Operational Guardrails
- Health route now reports missing critical env as misconfigured.
- Contact flow uses non-blocking activity logging and preserves lead when email fails.
- Recent projects route now returns stable fallback payload when DB query fails.
