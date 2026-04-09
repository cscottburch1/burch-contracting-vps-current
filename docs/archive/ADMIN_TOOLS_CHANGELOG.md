# Admin Tools Refactor Log

Date: 2026-03-26
Scope: /admin/tools and directly linked tool modules

## Why this change

The Admin Tools route could remain in a perpetual loading state when session verification failed or threw before local loading state was cleared. Several linked tool modules had similar fragile auth/data bootstrap flows and inconsistent empty/error handling.

## Safety measures

- Created timestamped backups before major changes:
  - tmp/backups-admin-tools-20260326-180640/src/app/admin/tools/page.tsx
  - tmp/backups-admin-tools-20260326-180640/src/app/admin/tools/banners/page.tsx
  - tmp/backups-admin-tools-20260326-180640/src/app/admin/tools/services/page.tsx
  - tmp/backups-admin-tools-20260326-180640/src/app/admin/tools/projects/page.tsx
  - tmp/backups-admin-tools-20260326-180640/src/app/admin/tools/notifications/page.tsx
- Kept existing route architecture, auth APIs, and backend contracts intact.
- No new runtime dependencies added.

## What changed and why

### 1) Rebuilt /admin/tools dashboard
File: src/app/admin/tools/page.tsx

Changes:
- Replaced ad-hoc card markup with typed, reusable tool registry and category grouping.
- Added clear sections:
  - Lead & CRM Tools
  - Proposal & Estimate Tools
  - Project Management Tools
  - Customer Communication Tools
  - Financial/Admin Tools
  - Website/SEO Tools
  - System Utilities
- Added search and category filtering for faster scanning.
- Added quick actions for high-frequency tasks.
- Added robust auth bootstrap with explicit loading, failure, and redirect behavior.
- Preserved owner-only maintenance controls and queue replay actions.
- Kept owner queue status fetches but isolated errors from page render.

Reason:
- Prevent hanging UI, improve operational speed, and standardize dashboard structure.

### 2) Hardened auth/data boot in tools modules
Files:
- src/app/admin/tools/projects/page.tsx
- src/app/admin/tools/notifications/page.tsx
- src/app/admin/tools/services/page.tsx
- src/app/admin/tools/banners/page.tsx

Changes:
- Consolidated startup flow to verify auth first and then load module data.
- Added explicit auth error messaging in each page.
- Added no-store fetch behavior for admin-sensitive data calls.
- Ensured loading state is always resolved in error paths.
- Improved fallback user messaging when module data requests fail.

Reason:
- Remove deadlock risk and provide deterministic user feedback under API/network issues.

## Functionality preserved

- Existing admin auth and role behavior.
- Existing API routes and payload contracts.
- Existing navigation links to CRM, projects, proposals, invoices, banners, services, notifications, etc.
- Owner-only queue replay functionality.

## Verified checks

- Type diagnostics on modified files: no errors.
- Production build (`npm run build`): success.
- Production runtime smoke test on local server:
  - Request to /admin/tools returned HTTP 200.

## Notes

- This pass prioritized reliability, navigation efficiency, and maintainability without changing backend logic.
- Additional module-level UX polish (e.g., deeper card standardization in each sub-tool) can be completed in a follow-up pass.

---

## Follow-up pass (same day)

### 3) Introduced shared admin auth guard hook
File:
- src/hooks/useAdminAuth.ts

Changes:
- Added centralized admin session verification with timeout-safe fetch behavior.
- Standardized auth result states for all tools pages:
  - authLoading
  - authError
  - user / isAuthenticated
- Kept redirect behavior on invalid sessions.

Reason:
- Remove duplicated auth bootstrap logic and reduce risk of inconsistent loading behavior across tools modules.

### 4) Migrated all tools modules to shared auth guard
Files:
- src/app/admin/tools/page.tsx
- src/app/admin/tools/services/page.tsx
- src/app/admin/tools/projects/page.tsx
- src/app/admin/tools/notifications/page.tsx
- src/app/admin/tools/banners/page.tsx
- src/app/admin/tools/fix-projects/page.tsx

Changes:
- Replaced per-page session verification useEffect blocks with useAdminAuth.
- Ensured auth failure paths always resolve loading states and surface actionable errors.
- Preserved existing redirects and route-level access behavior.

Reason:
- Prevent state drift and eliminate deadlock-prone duplicate logic.

### 5) Added timeout-safe mutation requests in tools modules
Files:
- src/app/admin/tools/projects/page.tsx
- src/app/admin/tools/notifications/page.tsx
- src/app/admin/tools/banners/page.tsx
- src/app/admin/tools/fix-projects/page.tsx

Changes:
- Converted key create/update/delete actions from plain fetch to fetchWithTimeout.
- Added timeout-aware user messages for mutation failures.

Reason:
- Avoid stuck UI actions when admin APIs are slow or unreachable.

### 6) Additional cleanup
Files:
- src/app/admin/tools/banners/page.tsx
- src/app/admin/tools/fix-projects/page.tsx

Changes:
- Replaced plain anchor navigation with Next Link in banner and fix-projects tools pages.
- Removed obsolete local auth state/effects after hook migration.

Reason:
- Improve client-side navigation consistency and reduce dead code.

### Re-verified

- Type diagnostics on modified tools and hook files: no errors.
- Production build (`npm run build`): success after refactor.

### 7) Final UX/error-state polish pass

Files:
- src/app/admin/tools/services/page.tsx
- src/app/admin/tools/projects/page.tsx
- src/app/admin/tools/notifications/page.tsx
- src/app/admin/tools/banners/page.tsx

Changes:
- Added explicit empty states for tools with list content (services and banners).
- Standardized auth-failure rendering in projects, notifications, and banners pages to return a dedicated fallback screen with retry and back-to-login actions.
- Removed now-redundant inline auth banners where dedicated fallback screens are used.

Reason:
- Ensure admin operators always receive deterministic, actionable states for empty data and expired sessions.

Verification:
- Type diagnostics: no errors.
- Production build (`npm run build`): success.
