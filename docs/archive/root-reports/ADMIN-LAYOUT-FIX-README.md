# Admin Layout Fix

## What was changed
- Updated the shared admin shell in `src/app/admin/layout.tsx` to a full-height column layout.
- Added a stable top header (`h-16`) and moved admin page rendering into one scroll container:
  - `main` now uses `flex-1 min-h-0 overflow-auto p-6 md:p-8`.
- Prevented outer-page scrolling conflicts by making the admin shell `overflow-hidden` and keeping scrolling inside `main`.

## Why this fixes it
- Eliminates nested competing scroll contexts (browser/body + inner container).
- Ensures content starts below a consistent header and is no longer clipped at the top.

## Quick testing steps
1. Open `/admin/subcontractors`.
2. Confirm only one vertical scrollbar is visible for content.
3. Scroll to top and verify page header/content is not cut off.
4. Repeat on at least:
   - `/admin/customers`
   - `/admin/projects`
   - `/admin/invoices`
   - `/admin/crm`
5. Test desktop + mobile widths.

## Notes
- `globals.css` has no `html`/`body` overflow override causing admin scroll conflict.
- This fix is applied at shared layout level, so it affects all admin routes using `src/app/admin/layout.tsx`.