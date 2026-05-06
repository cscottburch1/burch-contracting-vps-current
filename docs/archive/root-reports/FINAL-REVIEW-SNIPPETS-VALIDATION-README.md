# Review Snippets — Final Validation Guide

**Date**: April 25, 2026  
**GSC Errors**: "Cannot continue validation process" + "Review has multiple aggregate ratings"  
**Affected pages**: `/calculator/garages`, `/bathroom-remodeling`

---

## Root Cause (Definitive)

Two compounding issues were creating the "multiple aggregate ratings" signal:

### Issue 1 — Inconsistent `@id` across two LocalBusiness schemas
The site emits two separate LocalBusiness schemas built by different builder functions:

| Function | `@id` produced | File |
|----------|---------------|------|
| `generateLocalBusinessSchema()` | `https://www.burchcontracting.com#business` | `src/lib/schema-builders.tsx` |
| `buildLocalBusinessSchema()` | `https://burchcontracting.com/#localbusiness` | `src/lib/seo/schema.ts` |

Google canonicalizes `www.burchcontracting.com` and `burchcontracting.com` as the same domain. When it merges these two entities by name + URL and finds one carries `aggregateRating` and the other doesn't, it reports ambiguity. When it keeps them separate, it sees two entities for the same business — one with a rating — and reports "multiple aggregate ratings".

**Fix**: Changed `generateLocalBusinessSchema()` to use the canonical non-`www` domain (`siteConfig.siteUrl`) so its `@id` is now `https://burchcontracting.com/#business` — consistent with the rest of the SEO stack.

### Issue 2 — Embedded anonymous `GeneralContractor` in `generateServiceSchema()`
The `provider` field in `generateServiceSchema()` embedded a full `GeneralContractor` object with `name`, `telephone`, and `address` but **no `@id`**. On `/bathroom-remodeling`, this created a second anonymous `GeneralContractor` entity on the same page as the sitewide entity (which has `aggregateRating`). Google attempted to associate the `aggregateRating` with both entities, triggering the validation error.

**Fix**: Replaced the full embedded provider object with a slim `@id`-only reference pointing to the same canonical entity.

---

## What Was Changed

### `src/lib/schema-builders.tsx`

**Change 1 — Consistent `@id`**:
```diff
- '@id': `${businessConfig.seo.baseUrl}#business`,   // https://www.burchcontracting.com#business
+ '@id': `${siteConfig.siteUrl}/#business`,           // https://burchcontracting.com/#business
```

**Change 2 — Slim provider reference**:
```diff
  provider: {
    '@type': 'GeneralContractor',
-   name: businessConfig.name,
-   telephone: businessConfig.contact.phone,
-   address: { '@type': 'PostalAddress', ... }
+   '@id': `${siteConfig.siteUrl}/#business`
  },
```

Also added `import { siteConfig } from '@/lib/seo/site'` to the file.

### No other files changed
- `src/lib/seo/schema.ts` — `buildLocalBusinessSchema()` already had no `aggregateRating` ✅  
- `src/app/layout.tsx` — canonical `aggregateRating` source, untouched ✅  
- Calculator pages — no page-level schema emitted, untouched ✅  
- Testimonials, UniversalPageTemplate — no schema emission, untouched ✅

---

## Resulting Schema State

### Every page (via `layout.tsx`)
```json
{
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  "@id": "https://burchcontracting.com/#business",
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": 12 }
}
```
Single entity, consistent `@id`, single `aggregateRating`.

### Service pages (`/bathroom-remodeling`, `/garage-builder`, etc.)
```json
{
  "@type": "Service",
  "provider": {
    "@type": "GeneralContractor",
    "@id": "https://burchcontracting.com/#business"
  }
}
```
Provider is a reference to the existing entity — no duplication, no second copy of the rated entity.

### Calculator pages (`/calculator/garages`, etc.)
No page-level schema. Inherits only the sitewide LocalBusiness.

---

## Validation Steps

### 1. Deploy to production
Push the current branch. Only `src/lib/schema-builders.tsx` changed.

### 2. Verify in Rich Results Test
Open https://search.google.com/test/rich-results and test:
- `https://burchcontracting.com/calculator/garages`
- `https://burchcontracting.com/bathroom-remodeling`
- `https://burchcontracting.com/`

**Expected for each**:
- ✅ No "Cannot continue validation process" warning
- ✅ No "Review has multiple aggregate ratings" warning
- ✅ Single `GeneralContractor` detected with consistent `@id`
- ✅ `AggregateRating` shows once, under the top-level LocalBusiness

To verify the emitted JSON manually: open Chrome DevTools → Elements → search for `ld+json` in the page source. Confirm only ONE `aggregateRating` block, and the `@id` on the LocalBusiness is `https://burchcontracting.com/#business`.

### 3. URL Inspection in Search Console
For each affected URL:
1. GSC → URL Inspection → paste URL → **Test Live URL**
2. Expand **Structured Data** section
3. Confirm no errors under Review Snippets

### 4. Submit Validate Fix
1. GSC → **Enhancements** → **Review Snippets**  
   (or **Search Appearance** → **Rich Results** → Review Snippets)
2. Click the issue showing "Cannot continue validation process"
3. Click **Validate Fix** button
4. Repeat for each listed URL under that issue

### 5. Monitor
| Day | Expected status |
|-----|-----------------|
| 0 | "Validating" shown in GSC |
| 1–7 | Google re-crawls affected pages |
| 7–14 | Status changes to "Passed" ✅ |

---

## Quick verification commands

```bash
# TypeScript clean
npx tsc --noEmit
# Expected exit code: 0 ✅

# Single AggregateRating in codebase
grep -r "AggregateRating\|aggregateRating" src/
# Expected: 2 lines in src/lib/schema-builders.tsx only (the canonical definition)

# No itemReviewed anywhere
grep -r "itemReviewed" src/
# Expected: no results

# Consistent @id usage
grep -r "siteUrl}/#business\|burchcontracting.com/#business" src/
# Expected: 2 matches in src/lib/schema-builders.tsx (generateLocalBusinessSchema + generateServiceSchema provider)
```

---

## Original file reference (for record)
- ratingValue: "5.0"

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