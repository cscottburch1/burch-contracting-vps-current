# TMP Usage Inventory (2026-03-27)

## Summary
The `tmp` folder is still used by active runtime fallback and recovery paths. It must remain available in production.

## Runtime References

1. `src/app/api/admin/leads/queue/route.ts`
- Reads: `tmp/emergency_leads_queue.json`
- Reads/Writes: `tmp/emergency_lead_uploads/{tempDirId}/{storedName}`
- Writes: `tmp/emergency_leads_queue.json`
- Purpose:
  - Owner-only recovery endpoint for replaying queued lead submissions.
  - Moves queued upload files into `public/uploads/leads/{leadId}` during replay.

2. `src/app/api/subcontractors/apply/route.ts`
- Writes: `tmp/subcontractor_applications.json` when DB insert fails.
- Purpose:
  - Preserves subcontractor applications when database is unavailable.

3. `src/app/api/admin/subcontractors/route.ts`
- Reads: `tmp/subcontractor_applications.json`
- Purpose:
  - Merges queued subcontractor applications into admin listing output.

4. `src/app/api/admin/subcontractors/[id]/route.ts`
- Reads/Writes: `tmp/subcontractor_applications.json`
- Purpose:
  - Deletes queued subcontractor entries by queued id (for non-numeric id values).

5. `src/app/api/admin/subcontractors/import/route.ts`
- Reads/Writes/Deletes: `tmp/subcontractor_applications.json`
- Purpose:
  - Imports queued subcontractor applications into DB and rewrites/removes queue file.

## Current `tmp` Contents Classification

### Active / Keep
- `subcontractor_applications.json` (runtime queue fallback state)
- `emergency_leads_queue.json` (when present)
- `emergency_lead_uploads/` (when present)

### Operational Backups / Reports (review periodically)
- `backups/`
- `backups-admin-tools-20260326-180640/`
- `seo-backups/`
- `qa_reports/`
- `screenshots/`
- `test-failures/`
- Proposal/test artifacts under `tmp/` (George proposal generation files)

### Disposable Logs (cleanup candidate)
- `smoke-results.txt` was removed in this cleanup.
- `next-start-log.txt` remains because the file was process-locked at cleanup time.

## Recommendation
1. Keep `tmp` in repository/deploy path for now to avoid breaking queue fallback.
2. Ensure production startup creates `tmp` with write permissions if missing.
3. Long-term hardening:
- Move queue state from local files to a durable DB table or persistent storage mount.
- Add retention cleanup for stale `tmp` backup/test artifacts.
