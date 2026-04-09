# Comprehensive Repair Test Report (2026-03-27)

## Scope
- Source-of-truth consolidation
- Lead submission hardening
- Attachment metadata normalization
- CRM list/detail/download reliability
- Admin shell route protection
- Recent projects fallback behavior

## Automated Validation Run
1. Type check
- Command: npx tsc --noEmit
- Result: PASS

2. Production build
- Command: npm run build
- Result: PASS
- Notes: Edge-runtime warnings remain for mysql/crypto import traces in some server paths; build completes successfully.

## Functional Checks Completed In Code
1. Contact API now validates:
- Required fields
- Honeypot
- Recaptcha token (when present)
- File count/size/type

2. Contact API now ensures:
- Lead row inserted first
- Attachments stored with metadata in lead_attachments
- Actionable failure response if attachment persistence fails
- Email success/failure activity logging

3. CRM endpoints now:
- Read attachment metadata from lead_attachments
- Return attachment details on lead detail API
- Use attachment metadata for secure downloads

4. Public recent projects now:
- Falls back to stable seeded project spotlight payload when DB/API query fails
- Exposes fallback marker header for UI messaging

5. Health endpoint now:
- Returns 503 misconfigured when critical env vars are missing

## Manual Verification Steps (required)
1. Submit contact form without attachments.
- Expect 200 success and lead in admin CRM.
2. Submit contact form with one valid PDF/image.
- Expect 200 success, file present under public/uploads/leads/{id}, metadata row in lead_attachments.
3. Submit invalid file type.
- Expect 400 with unsupported file type.
4. Submit oversize file (>10MB).
- Expect 400 with size-limit error.
5. Open lead detail in admin.
- Expect attachment count and downloadable links.
6. Download attachment from lead detail.
- Expect file stream and correct content type.
7. Update lead status in CRM.
- Expect persisted status update and activity row.
8. Add note on lead detail page.
- Expect note persisted and visible.
9. Temporarily break SMTP env.
- Expect lead still saved and email_failed activity logged.
10. Force recent_projects DB failure (e.g., table rename in staging only).
- Expect UI fallback project cards, no permanent loading state.

## Known Limitations
- Direct deletion of duplicate folders (imported_repo, burch-contracting) was blocked by terminal command policy in this environment and must be completed manually.
- Existing codebase includes many legacy admin migration routes; only core lead/CRM path was hardened in this pass.
- Edge-runtime warning traces should be reviewed if moving middleware/edge behavior further.
