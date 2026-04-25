# Review Snippets — Final Validation Guide

**Date**: April 25, 2026  
**GSC Error**: "Cannot continue validation process" — Review Snippets  
**Affected pages**: `/calculator/garages`, `/bathroom-remodeling` (and all service/calculator pages)  
**Root cause identified and fixed**: `hasOfferCatalog` with nested `Offer > itemOffered > Service` objects was nested inside the sitewide `GeneralContractor` schema that also carries `aggregateRating`. Google's Review Snippets validator tried to resolve `itemReviewed` on those nested `Service` entities, failed, and emitted the validation error.

---

## What Was Changed

### 1. `src/lib/schema-builders.tsx` — `generateLocalBusinessSchema()`
- **Removed**: entire `hasOfferCatalog` block (6 nested `Offer > itemOffered > Service` objects)
- **Kept**: single canonical `aggregateRating` (ratingValue 5.0, reviewCount 12, bestRating 5, worstRating 1)

### 2. `src/lib/schema-builders.tsx` — `generateServiceSchema()`
- **Removed**: `hasOfferCatalog` block containing a nested `Offer` with `price` / `priceCurrency`

### 3. `src/app/page.tsx` — Homepage
- **Removed**: `hasOfferCatalog` argument passed to `buildLocalBusinessSchema()`

---

## Schema State After Fix

### Sitewide (every page via `layout.tsx`)
- `GeneralContractor` with `aggregateRating` (5.0, reviewCount 12) — **no nested Service objects**

### Service pages
- `Service` schema with `provider` reference — **no `aggregateRating`, no nesting**

### Calculator pages
- No page-level schema — inherits sitewide only

---

## Validation Steps

### 1. Deploy to production

### 2. Test in Rich Results Test
URL: https://search.google.com/test/rich-results  
Test each affected URL:
- `https://burchcontracting.com/calculator/garages`
- `https://burchcontracting.com/bathroom-remodeling`
- `https://burchcontracting.com/` (homepage)

Expected: no "Cannot continue validation process" warning, no Review Snippets errors

### 3. URL Inspection in Search Console
Test Live URL for each affected page. Confirm Structured Data section shows no Review Snippets errors.

### 4. Submit Validate Fix
GSC → Enhancements → Review Snippets → click the issue → **Validate Fix**

### 5. Monitor timeline
| Day | Status |
|-----|--------|
| 0 | "Validating" in GSC |
| 1–7 | Google re-crawls |
| 7–14 | "Passed" (green checkmark) |

---

## Confirm fix locally

```bash
npx tsc --noEmit   # should exit 0

grep -r "AggregateRating" src/
# Expected: 3 lines, all in src/lib/schema-builders.tsx (canonical definition only)

grep -r "itemReviewed" src/
# Expected: no results

grep -r "hasOfferCatalog" src/ --include="*.tsx" --include="*.ts" | grep -v BACKUP | grep -v "schema.ts"
# Expected: no results (only dead type definition remains in schema.ts)
```

## Original file (preserved below for reference)
- ratingValue: "5.0"
  - reviewCount: 12
  - bestRating: 5
  - worstRating: 1
- No additional Review schema objects remain.
- No FAQPage schema objects remain.
- Testimonials JSON-LD review output is disabled.
- Calculator pages (including /calculator/garages) and service pages (including /bathroom-remodeling) do not emit review-related JSON-LD.

## Deploy first
1. Deploy the current branch to production.
2. Confirm deployment completed and cache/CDN is updated.

## Verify with Google Rich Results Test
1. Open: https://search.google.com/test/rich-results
2. Test these URLs first:
   - https://burchcontracting.com/calculator/garages
   - https://burchcontracting.com/bathroom-remodeling
3. Also test one additional calculator page and one additional service page.
4. In detected structured data, confirm:
   - exactly one AggregateRating appears
   - no Review objects appear
   - no FAQPage objects appear
5. Confirm no Review snippet invalid-item warnings are shown.

## Re-run Search Console URL Inspection
1. Open Google Search Console for burchcontracting.com.
2. Inspect these URLs one-by-one:
   - /calculator/garages
   - /bathroom-remodeling
   - any other URL listed in the failed validation report
3. Click Test Live URL for each.
4. Confirm rendered page data no longer contains duplicate review-related items.
5. Click Request Indexing for each validated URL.

## Fix the "Cannot continue validation process" state
1. In Search Console, open the existing Review snippets issue.
2. If it is stuck on "Cannot continue validation process", click the issue and check latest failed examples.
3. Re-inspect those exact failed URLs with URL Inspection and request indexing again.
4. Start a new validation cycle by clicking Validate Fix.
5. Monitor status for several days until examples are recrawled.

## Expected result
- No "10 items detected: Some are invalid" warnings.
- No "Cannot continue validation process" loop after recrawl.
- Review snippets report returns to valid/clean state.