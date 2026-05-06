# Repository Structure Audit (2026-03-27)

## Confirmed Production App Root
- Root Next.js app is the repository root.
- Evidence:
  - Root package scripts run Next directly: `next build`, `next start`.
  - Active Next config exists at `next.config.ts` in repo root.
  - Active App Router routes are in `src/app` at repo root.
  - Successful local validation has been executed from root (`npx tsc --noEmit`, `npm run build`).

## App Root Candidates Found
1. `./` (root) — **CONFIRMED ACTIVE**
   - `package.json` uses Next scripts.
   - `next.config.ts` present.
   - `src/app` present and compiled.

2. `./imported_repo` — **DUPLICATE CANDIDATE (Vite app)**
   - Has its own `package.json`, but scripts are Vite (`vite build`), not Next.
   - No runtime imports from root app reference this path.
   - Not used by root build/start path.

3. `./burch-contracting` — **DUPLICATE CANDIDATE (nested old Next-like tree)**
   - Contains `src/app`, `src/lib`, `middleware.ts`.
   - No local `package.json` / `next.config.*` in this folder.
   - No runtime imports from root app reference this path.

4. `./tmp/*/src/app` backup snapshots — **NOT APP ROOTS**
   - Found inside backup subfolders only.
   - Not part of build graph.

## Duplicate Folder Classification (Phase 2)

### `/imported_repo`
- Classification: **SAFE TO DELETE**
- Why:
  - Separate Vite project not used by root Next app.
  - No active code imports from root `src` reference this folder.
  - Root TypeScript config already excludes this folder.

### `/burch-contracting`
- Classification: **SAFE TO DELETE**
- Why:
  - Nested source tree is not used by root package build path.
  - No active code imports from root `src` reference this folder.
  - Root TypeScript config already excludes this folder.

### `/tmp`
- Classification: **ACTIVE (must keep)**
- Why:
  - Runtime API routes read/write queue files under `tmp`:
    - `src/app/api/admin/leads/queue/route.ts`
    - `src/app/api/subcontractors/apply/route.ts`
    - `src/app/api/admin/subcontractors/route.ts`
    - `src/app/api/admin/subcontractors/[id]/route.ts`
    - `src/app/api/admin/subcontractors/import/route.ts`
  - Contains queue artifacts and backup/test artifacts.
- Action:
  - Keep folder.
  - Only remove explicit disposable files requested in cleanup rules.

## Folders Not Used by Active Runtime
- `imported_repo/`
- `burch-contracting/`

## Folders Requiring Continued Inspection/Care
- `tmp/` (active for queue fallback paths)
- `.next/` (generated build output; not source)
