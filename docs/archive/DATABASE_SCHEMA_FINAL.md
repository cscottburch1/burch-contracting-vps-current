# Database Schema Final (Lead/CRM Core)

## Canonical Migration
- migrations/2026-03-27-lead-core-hardening.sql

## Required Tables

### contact_leads
- Primary key: id
- Core fields:
  - name, email, phone
  - address
  - service_type
  - description/message
  - budget_range, timeframe
  - preferred_date, preferred_time
  - status, priority
  - lead_score
  - source, source_url
  - created_at, updated_at
- Indexes:
  - idx_status
  - idx_priority
  - idx_email
  - idx_created_at
  - idx_lead_score

### lead_attachments
- Primary key: id
- Foreign key: lead_id -> contact_leads.id (cascade delete)
- Fields:
  - original_filename
  - stored_filename
  - file_path
  - mime_type
  - file_size
  - uploaded_at
- Index/constraints:
  - idx_lead_attachments_lead
  - uniq_lead_stored (lead_id, stored_filename)

### lead_notes
- Primary key: id
- Foreign key: lead_id -> contact_leads.id (cascade delete)
- Fields:
  - note_type
  - content
  - is_important
  - created_by
  - created_at

### lead_activities
- Primary key: id
- Foreign key: lead_id -> contact_leads.id (cascade delete)
- Fields:
  - activity_type
  - description
  - metadata
  - created_by
  - created_at
- Activity values used by runtime:
  - lead_created
  - status_change
  - note_added
  - attachment_uploaded
  - email_sent
  - email_failed
  - call_made
  - meeting_scheduled
  - proposal_sent

## Migration Safety Notes
- Migration is idempotent for table creation.
- Includes best-effort JSON attachment backfill from contact_leads.attachments into lead_attachments.
- Back up DB before first production run:
  - mysqldump -u USER -p DATABASE > backup-before-lead-hardening.sql

## Minimal Integrity Requirements
- InnoDB engine for FK enforcement.
- utf8mb4 charset/collation.
- Foreign keys enabled in MariaDB/MySQL config.
