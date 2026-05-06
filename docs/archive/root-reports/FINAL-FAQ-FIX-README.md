# Final FAQ Fix: Duplicate FAQPage

## What was fixed
- Ensured only one canonical FAQPage generator remains in the schema layer.
- Removed FAQPage JSON-LD emissions from page-level and component-level duplicate emitters.
- Kept all existing FAQ content/questions/answers rendered on pages.
- Preserved previous schema updates including 35+ years messaging and aggregate rating values (reviewCount: 12).

## Canonical FAQPage source
- src/lib/seo/schema.ts
  - buildFaqSchema(items)

## Duplicate emitters removed
- src/lib/schema-builders.tsx (removed generateFAQSchema)
- src/app/adu-builder/page.tsx
- src/app/deck-builder/page.tsx
- src/app/garage-builder/page.tsx
- src/app/screened-porches/page.tsx
- src/app/basement-finishing/page.tsx
- src/app/bathroom-remodeling/page.tsx
- src/app/kitchen-remodeling/page.tsx
- src/app/room-additions/page.tsx
- src/components/seo/LocalSeoLanding.tsx
- src/components/seo/RenovationSeoLanding.tsx
- src/app/blog/[slug]/page.tsx
- src/app/cost/[slug]/page.tsx
- src/app/locations/[slug]/page.tsx
- src/app/services/[slug]/page.tsx
- src/app/page.tsx
- src/app/page-BACKUP.tsx
- src/components/templates/UniversalPageTemplate.tsx (removed FAQPage option from schemaType union)

## Verification steps (Google Rich Results Test)
1. Deploy current branch to production.
2. Open: https://search.google.com/test/rich-results
3. Test at minimum:
   - https://burchcontracting.com/
   - one service page URL
   - one location page URL
   - one blog or cost page URL
4. In detected structured data, verify only one FAQPage object appears per tested page.
5. Confirm no "Duplicate field 'FAQPage'" error appears.

## Verification steps (Search Console URL Inspection)
1. Open Google Search Console for burchcontracting.com.
2. Inspect homepage, then previously affected service/location/blog/cost URLs.
3. Click Test Live URL.
4. Confirm rendered structured data does not include duplicate FAQPage objects.
5. Click Request Indexing on validated URLs.

## Structured data report cleanup
1. Open Search Console > Enhancements (or relevant structured data report).
2. Open the "Duplicate field 'FAQPage'" issue.
3. Click Validate Fix.
4. Monitor validation state until complete.

## Expected result
- 0 active "Duplicate field 'FAQPage'" errors in Search Console after recrawl and validation.