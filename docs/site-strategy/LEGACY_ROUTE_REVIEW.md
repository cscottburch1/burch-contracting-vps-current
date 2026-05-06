# Legacy Route Review
**Date**: 2026-05-06  
**Scope**: Routes that exist in the codebase but are not in the primary navigation after the 2026 revamp.  
**Branch created by**: cleanup/repository-audit  

> Do not delete or redirect any route in this list without:  
> 1. Checking Google Search Console for indexed traffic  
> 2. Implementing a 301 redirect in `next.config.ts`  
> 3. Testing the redirect locally before deploying

---

## Routes Requiring Owner Decision

### Legacy Service Pages (Full Content Pages — Active in Build)

| Old Route | Status | Recommended Action | Proposed Destination | SEO Risk |
|---|---|---|---|---|
| `/adu-builder` | Active full page, not in primary nav | Keep + noindex OR redirect | `/additions` or `/services/adu-builder` | Medium — may have indexed traffic |
| `/deck-builder` | Active full page, not in primary nav | Keep + noindex OR redirect | `/outdoor-living` | Medium |
| `/garage-builder` | Active full page, not in primary nav | Keep + noindex OR redirect | `/garages` | Medium |
| `/room-additions` | Active full page, not in primary nav | Redirect 301 | `/additions` | High — likely indexed |
| `/basement-finishing` | Active full page, not in primary nav | Keep OR redirect | `/remodeling` | Medium |
| `/bathroom-remodeling` | Active full page, not in primary nav | Keep OR redirect | `/remodeling` | Medium |
| `/kitchen-remodeling` | Active full page, not in primary nav | Keep OR redirect | `/remodeling` | Medium |
| `/screened-porches` | Active full page, not in primary nav | Keep OR redirect | `/outdoor-living` | Medium |
| `/commercial-renovations` | Active full page, overlaps with `/commercial-upfits` | Keep OR redirect | `/commercial-upfits` | Medium |
| `/commercial-renovations-simpsonville-sc` | Specific geo page | Keep + noindex OR redirect | `/commercial-upfits` | Low |

### Hub / Aggregator Pages

| Old Route | Status | Recommended Action | Proposed Destination | SEO Risk |
|---|---|---|---|---|
| `/home-renovations` | Active hub page using `renovationSeoData` | Keep (has SEO value as a hub) | N/A — keep | Low |
| `/locations` | Old city listing, overlaps with `/service-areas` | Redirect 301 | `/service-areas` | Low |
| `/services` | Generic services listing | Keep or redirect | `/` or `/service-areas` | Medium |
| `/services/[slug]` | Dynamic pages for services (9 slugs) | Keep OR redirect individual slugs | Per-service hub pages | Medium |

### Cost Guide Pages

| Old Route | Status | Recommended Action | Proposed Destination | SEO Risk |
|---|---|---|---|---|
| `/cost` | Hub page for cost guides | Keep (informational SEO value) | N/A | Low |
| `/cost/[slug]` | 11 cost guide articles | Keep (informational SEO value) | N/A | Low |

### Calculator Pages

| Old Route | Status | Recommended Action | Proposed Destination | SEO Risk |
|---|---|---|---|---|
| `/calculators` | Hub redirecting to individual calculators | Keep | N/A | Low |
| `/calculator/decks` | Redirect stub (139 B) | 301 redirect | `/calculator/decks-screened-porches` | Low |
| `/calculator/garages` | Redirect stub (139 B) | 301 redirect | `/calculator/decks-screened-porches` or remove | Low |
| `/calculator/home-additions` | Redirect stub (138 B) | 301 redirect | `/calculator/additions` | Low |
| `/calculator/room-additions` | Redirect stub (139 B) | 301 redirect | `/calculator/additions` | Low |
| `/calculator/screened-porches` | Redirect stub (139 B) | 301 redirect | `/calculator/decks-screened-porches` | Low |

### Local SEO Pages (Dynamic)

| Route Pattern | Count | Status | Recommended Action | SEO Risk |
|---|---|---|---|---|
| `/[city]/[service]` | 63 pages | Active — core local SEO strategy | KEEP | High — do not touch |
| `/locations/[slug]` | 39 pages | Active but may overlap with `/service-areas` | Keep — built off `localDominanceData` | High |
| `/service-areas/[city]` | 9 pages | Active generic city pages | Keep | Medium |
| `/service-areas/simpsonville-sc` | Static page | Keep | N/A | Low |
| `/service-areas/mauldin-sc` | Static page | Keep | N/A | Low |
| `/service-areas/fountain-inn-sc` | Static page | Keep | N/A | Low |
| `/service-areas/woodruff-sc` | Static page | Keep | N/A | Low |

### Test / Internal Pages

| Route | Status | Recommended Action | SEO Risk |
|---|---|---|---|
| `/test-direct-hire` | Live test/diagnostic page with no noindex | ADD `robots: { index: false }` to metadata immediately | Low once noindexed |

---

## Immediate Action Items (Safe to Do Now)

1. **`/test-direct-hire`** — Add `robots: { index: false }` to `src/app/test-direct-hire/page.tsx` metadata export. This page should never appear in search results.

2. **`/calculator/decks`, `/calculator/garages`, `/calculator/home-additions`, `/calculator/room-additions`, `/calculator/screened-porches`** — These are already 139B stubs. Add proper `redirect()` calls or add them to `next.config.ts` redirects pointing to their canonical calculator equivalents.

## Deferred Actions (Owner Decision Required)

3. `/room-additions` → `/additions` — High priority redirect once confirmed no longer needed standalone.  
4. `/locations` → `/service-areas` — Simple redirect, low risk.  
5. `/commercial-renovations` → `/commercial-upfits` — Needs content merge review first.  
6. Individual legacy service pages — Leave active until Search Console confirms no significant indexed traffic.
