# ROUTE_KEEP_REMOVE_PLAN

Date: 2026-05-05
Scope: src/app route audit only (no production route changes applied in this cleanup).

## keep
- Public marketing/service pages under src/app (home, services, service-areas, locations, projects, cost, calculators, blog, contact)
- High-intent SEO pages (deck-builder, screened-porches, garage-builder, room-additions, kitchen-remodeling, bathroom-remodeling, basement-finishing, adu-builder, commercial-renovations)
- Public conversion routes: /employment and /employment/direct-hire
- Public APIs needed by live site: /api/contact, /api/services/active, /api/projects/recent, /api/indexnow/submit, /api/health, payment endpoints

## noindex
- /test-direct-hire (test page)
- All authenticated UI surfaces (/admin/*, /portal/*, /tradesmen/*)
- Migration/maintenance admin pages and diagnostic tooling pages

## redirect
- Candidate: /calculators -> /cost (if duplicate intent and content parity is confirmed)
- Candidate: old/duplicate calculator slugs to canonical calculator slugs after analytics review
- Candidate: any legacy local-service URL that duplicates /service-areas/[city]/[service]

## delete
- Deleted in this cleanup: src/app/page-BACKUP.tsx (backup file not referenced)
- Candidate: /test-direct-hire after owner confirms no active QA workflow depends on it
- Candidate: one-time migration route handlers under /api/admin/migrate-* after owner confirms completion

## admin/private
- UI: /admin/*, /portal/*, /tradesmen/*
- APIs: /api/admin/*, /api/portal/*, /api/tradesmen/*
- Action: keep protected; ensure robots noindex and strict auth checks remain enforced

## do-not-remove without owner approval
- /services/[slug]
- /service-areas/[city]
- /[city]/[service]
- /projects/[slug]
- /cost/[slug]
- /blog/[slug]
- Any route currently listed in sitemap outputs

## owner approval required before route removals
- Removing any indexed SEO page
- Redirecting calculators or service pages
- Deleting migration/debug admin routes
- Deleting test/preview pages that may still support operations
