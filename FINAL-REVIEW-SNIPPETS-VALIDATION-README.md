# Final Review Snippets Validation

## Final state in codebase
- Only one AggregateRating block exists sitewide, inside the main LocalBusiness schema:
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