# Cleanup Summary (2026-03-27)

## Overview
This cleanup consolidated the repository to a single active Next.js app root while preserving runtime behavior and validating build safety.

## Confirmed Active App Root
- Active app root: `src/app` under repository root.
- Build owner: root `package.json` (`next build`, `next start`).
- Active Next config: root `next.config.ts`.

## Folders Removed
- `imported_repo/` (obsolete Vite app copy; no runtime imports from active app)
- `burch-contracting/` (obsolete nested source tree; no runtime imports from active app)

## Folders Archived
- Root markdown documentation was moved to `docs/archive/`.
- Archived markdown count: 42 files moved.

## Files Removed (explicit temp artifacts)
- `dev.log`
- `dev.err`
- `build_output.txt`
- `temp_original.txt`
- `temp_tradesman_tables.sql`

## Files Removed Inside `tmp/` (disposable artifacts)
- `tmp/smoke-results.txt` (generated smoke test output)

## Files Kept Intentionally
- `tmp/` kept because active API routes use queue/fallback files in this directory.
- `temp-lead-scoring-migration.sql` kept because it does not match requested `temp_*.sql` cleanup pattern.
- `tmp/next-start-log.txt` kept because it was locked by an active process at cleanup time.
- `tmp/subcontractor_applications.json` kept because it is active queue fallback state.

## Code/Config Fixes Made During Cleanup
- Added `REPO_STRUCTURE_AUDIT.md` with app-root and duplicate-folder classification evidence.
- Updated `tsconfig.json` excludes to reflect cleaned structure:
  - removed obsolete explicit excludes for deleted duplicate roots
  - added `archive` and `archive/**` to prevent archived assets entering compile scope
- Root markdown cleanup completed to keep only required top-level docs plus required audit/final outputs.

## Root Documentation Kept
- `README.md`
- `DEPLOYMENT_CHECKLIST.md`
- `ARCHITECTURE.md`
- `HOSTINGER_DEPLOY.md`
- Cleanup deliverables: `REPO_STRUCTURE_AUDIT.md`, `TMP_USAGE.md`, `CLEANUP_SUMMARY.md`, `FINAL_PROJECT_STRUCTURE.md`, `WARNINGS.md`

## Validation Results
1. `npm install` -> PASS
2. `npx tsc --noEmit` -> PASS
3. `npm run build` -> PASS

## Manual VPS Actions Required
1. Deploy the latest commit to the Hostinger VPS.
2. Restart the production process serving this repo root build.
3. Re-run production smoke checks (`npm run verify:production -- --base-url=https://burchcontracting.com`) to confirm live routes are now aligned with this cleaned repo.
