# SEO Audit Report - Burch Contracting

Date: 2026-03-27  
Site: https://burchcontracting.com  
Audited by: GitHub Copilot (GPT-5.3-Codex)

## Executive Summary

Overall SEO posture is strong and materially improved from the earlier baseline: core content hubs are live (`/blog`, `/cost`, `/projects`), technical foundations are mostly sound (metadata, canonical tags, structured data, sitemap coverage), and local-intent targeting is comprehensive.

Current estimated score: **86/100**.

Primary upside now is less about basic setup and more about quality/consistency improvements:
- tighten content uniqueness and anti-doorway quality signals across templated local pages,
- improve schema consistency/trust signals,
- strengthen image and media strategy,
- improve internal-link architecture from high-authority pages,
- formalize measurement and indexing workflow.

## Scope

This audit reviewed:
- Live crawl/indexability signals and key public endpoints.
- On-page metadata and schema implementation.
- Sitemap/robots consistency.
- Information architecture and internal linking.
- Local SEO and conversion-intent page ecosystem.
- Code-level implementation in the Next.js app.

Reviewed implementation files include:
- src/app/layout.tsx
- src/app/sitemap.ts
- src/app/robots.ts
- public/robots.txt
- src/app/sitemaps/content.xml/route.ts
- src/app/page.tsx
- src/app/blog/page.tsx
- src/app/blog/[slug]/page.tsx
- src/app/cost/page.tsx
- src/app/cost/[slug]/page.tsx
- src/app/projects/page.tsx
- src/app/projects/[slug]/page.tsx
- src/lib/seo/schema.ts
- src/lib/seo/localSeoData.ts
- src/lib/seo/searchConsoleTargets.ts

## Scorecard

- Technical SEO: **88/100**
- On-Page SEO: **84/100**
- Content Quality & Topical Depth: **82/100**
- Internal Linking & Architecture: **85/100**
- Local SEO: **90/100**
- Measurement & Operations: **80/100**

Composite score: **86/100**

## What Is Working Well

1. Content hub rollout is active and indexable
- Blog, cost guides, and project spotlight hubs are live and connected.
- Programmatic pages are routed and represented in sitemap outputs.

2. Canonical and metadata foundations are present
- Global metadata with canonical baseline and OG/Twitter defaults exist in `layout.tsx`.
- Key content routes (`/blog`, `/cost`, `/projects`, plus slug pages) define page-level metadata.

3. Structured data is broadly implemented
- LocalBusiness, FAQ, Breadcrumb, ItemList, and Article schema are integrated in core templates.
- This supports rich result eligibility and stronger semantic context.

4. Sitemap architecture is robust
- Root sitemap includes major static + dynamic sets.
- Dedicated content sitemap route exists and emits blog/project URLs.

5. Local-intent coverage is strong
- City/service matrix and cost-intent pages align well with conversion-intent search behavior.

## Findings By Priority

## High Priority

### 1) Templated local pages risk perceived doorway/thin-pattern behavior
Evidence:
- Large service-location matrix is generated from shared templates/data (`src/lib/seo/localSeoData.ts`) with repeated FAQ blocks (`baseFaqs`) and repeated framing.

Risk:
- Even when technically unique, pages can underperform if Google interprets them as near-duplicate doorway variants.

Recommendation:
- Add per-page unique proof elements: 2-3 locality-specific project notes, permitting nuance, neighborhood constraints, and timeline caveats by city.
- Replace shared FAQ blocks with more city/service-specific QA per page.
- Add unique media assets and quote snippets tied to each city/service page.

### 2) Structured data consistency/trust quality needs tightening
Evidence:
- Homepage LocalBusiness schema includes `streetAddress` as empty string in `src/app/page.tsx`.
- Aggregate rating/review values are hardcoded in homepage schema.

Risk:
- Inconsistent or low-trust schema fields can reduce rich result confidence and trust quality.

Recommendation:
- Remove empty fields entirely (do not output empty strings).
- Keep ratings only if they are maintained from verifiable first-party data source and comply with rich results policy.
- Standardize LocalBusiness schema through shared builder to avoid drift.

### 3) Robots/sitemap source-of-truth can drift between dynamic and static
Evidence:
- Both `src/app/robots.ts` and `public/robots.txt` exist and are intended to match.

Risk:
- Operational drift can produce inconsistent crawl directives over time.

Recommendation:
- Choose one authoritative robots source and automate validation in CI.
- Add a deploy-time check that confirms all expected sitemap entries are present in live robots.

## Medium Priority

### 4) Homepage hero H1 readability/spacing quality
Evidence:
- H1 is composed from split spans in `src/app/page.tsx`, and rendered output can read awkwardly in extraction contexts.

Risk:
- Readability and snippet extraction quality can degrade.

Recommendation:
- Keep visual styling, but ensure semantic H1 text is cleanly readable in one logical sentence.

### 5) Image strategy is still mostly generic for SEO-critical pages
Evidence:
- Many pages use default OG image and representative placeholders.

Risk:
- Lower CTR and weaker topical relevance in social/search previews.

Recommendation:
- Create unique OG images for top 20 pages (homepage, service pillars, top city pages, top cost pages, top blog posts).
- Add image variants keyed to service + city for core programmatic pages.

### 6) Internal linking can be made more authority-aware
Evidence:
- Internal links exist, but link equity concentration can be improved from high-authority pages.

Recommendation:
- From homepage and top-performing pages, add explicit sections linking to:
  - top conversion pages,
  - top impression but low CTR pages,
  - newly published pages for faster discovery.

### 7) XML sitemap freshness logic uses runtime now() for all entries
Evidence:
- `src/app/sitemap.ts` and `src/app/sitemaps/content.xml/route.ts` use current date for lastmod.

Risk:
- Search engines may treat broad daily changes as low-signal/noisy freshness.

Recommendation:
- Use content-level last-modified timestamps where available.
- Reserve frequent timestamp updates for pages with actual content edits.

## Low Priority

### 8) Meta keywords still present globally
Evidence:
- `keywords` array in `src/app/layout.tsx`.

Risk:
- Minimal direct SEO benefit; mostly maintenance noise.

Recommendation:
- Optional: remove or reduce to key business descriptors.

### 9) Add explicit organization/contact schema on contact page
Opportunity:
- Complement current LocalBusiness data with ContactPoint and service area reinforcement for stronger entity consistency.

## Indexability & Crawl Health Review

Status summary:
- Core public hubs are reachable and render content.
- XML sitemaps are available, including content sitemap endpoint.
- Crawl blocks for private areas (`/admin`, `/portal`, `/api`, `/crm`) are correct.

Recommended validation checks to run weekly:
- Live robots includes all required sitemap lines.
- Root sitemap URL count trend remains stable or improves.
- No critical pages return 4xx/5xx.

## Content & Topical Authority Assessment

Strengths:
- Strong alignment to high-intent remodeling topics: cost, planning, timelines, permits, materials.
- Good service x city matrix and related-path navigation.

Gaps:
- Need stronger proof/E-E-A-T indicators on localized pages (project evidence, specific constraints, local references, real-world outcomes).
- Need broader long-tail cluster expansion around comparison and decision-stage queries tied to each service.

Recommended content expansion (next 30-60 days):
- Service cluster comparisons:
  - "Kitchen remodel vs cabinet refacing" (city-specific variants)
  - "Deck vs screened porch ROI"
- Risk/permit/cost traps:
  - "Most common permit delays in [city]"
  - "Scope changes that move budget the most"
- Commercial intent support:
  - "How to evaluate contractor bids" and "estimate checklist" downloadable assets.

## Local SEO Assessment

Strengths:
- Multi-city coverage with dedicated pages and local phrasing.
- NAP and contact pathways are visible.

Improvements:
- Add explicit geo modifiers and neighborhood references unique to each local page body.
- Add stronger local proof snippets (recent projects by city, before/after summaries, date markers).
- Tie Google Business Profile categories/services to highest-converting landing pages.

## Measurement & Reporting Gaps

Current need:
- A single operating dashboard for SEO execution and impact.

Implement:
- Search Console + GA4 blended KPI sheet by page group:
  - impressions,
  - clicks,
  - CTR,
  - avg position,
  - conversion rate,
  - lead volume.

Track weekly cohorts:
- `/locations/*`
- `/cost/*`
- `/blog/*`
- `/projects/*`

## 90-Day Action Plan

### Days 1-14 (High impact)
1. Normalize LocalBusiness schema quality (remove empty fields, standardize builder usage).
2. Improve local-page uniqueness for top 15 traffic/intent pages.
3. Implement robots/sitemap consistency check in deploy workflow.
4. Publish unique OG images for top 10 pages.

### Days 15-45
1. Expand decision-stage article cluster (10-15 pages).
2. Strengthen internal links from homepage and top-ranking pages to money pages.
3. Introduce content-level lastmod timestamps in sitemap generation.

### Days 46-90
1. Add city-level project proof blocks and quote snippets to top local pages.
2. Build downloadable lead magnets for high-intent conversion pages.
3. Run monthly technical audit regression checks and fix drift.

## KPI Targets (Next 90 Days)

- +25% non-brand organic clicks sitewide.
- +20% CTR improvement on `/cost/*` and `/blog/*` page groups.
- +15% increase in top-10 ranking keywords for city+service terms.
- +20% increase in organic-sourced lead submissions.

## Final Assessment

The site has moved from implementation phase to optimization phase. The technical base is solid enough to scale, and the largest SEO gains now depend on:
- content differentiation quality,
- stronger trust/proof signals,
- better internal authority routing,
- disciplined measurement.

If these recommendations are executed in sequence, the site should materially improve both ranking stability and lead quality from organic search.
