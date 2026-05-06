# Deprecation & Redirect Plan
**Project**: Burch Contracting Redesign (2025 Phase)  
**Status**: Ready for Implementation  
**Created**: 2025-03-30

---

## Overview

This document outlines legacy routes that should be deprecated, redirected, or removed from navigation during the simplified sitemap redesign. The new structure consolidates 9 services into 5 core services and reorganizes content around cleaner navigation.

---

## Service Route Consolidations

### Old Structure → New Structure

| Old Route(s) | New Route | Notes |
|---|---|---|
| `/deck-builder` | `/outdoor-living` | All outdoor living under one hub; internal links to /outdoor-living/decks |
| `/deck-pricing` | `/pricing` | Pricing centralized; outdoor living details in service page FAQ |
| `/screened-porch` | `/outdoor-living` | Porch details in hub; can add `/outdoor-living/screened-porches` sub-page if traffic exists |
| `/covered-patio` | `/outdoor-living` | Patio details in hub; can add `/outdoor-living/covered-patios` sub-page if traffic exists |
| `/room-additions` | `/additions` | Comprehensive additions hub with breadcrumb schema; redirects keep SEO equity |
| `/addition-pricing` | `/pricing` | Additions pricing in central hub + FAQ in `/additions` |
| `/room-addition-contractor` | `/additions` | Consolidated into service hub |
| `/garage-builder` | `/garages` | New dedicated garage hub page with full details |
| `/garage-cost` `/garage-pricing` | `/pricing` | Garage pricing in central hub + service page FAQ |
| `/kitchen-remodeling` | `/remodeling` | Kitchen is sub-section of remodeling hub |
| `/bathroom-remodeling` | `/remodeling` | Bathroom is sub-section of remodeling hub |
| `/kitchen-bathroom-remodeling` | `/remodeling` | Both consolidated in single hub |
| `/commercial-renovations` `/commercial-construction` | `/commercial-upfits` | Commercial work centralizes under upfits hub |
| `/locations` | `/service-areas` | All city landing pages consolidated here |
| `/cost` `/calculator-costs` | `/pricing` | Central pricing hub replaces scattered cost pages |

---

## Area Route Consolidations

### Service Areas – Old vs. New

| Old Route(s) | New Route | Type |
|---|---|---|
| `/simpsonville` `/simpsonville-sc` | `/service-areas/simpsonville-sc` | ✅ Keep (standardized path) |
| `/mauldin` `/mauldin-sc` | `/service-areas/mauldin-sc` | ✅ Keep (standardized path) |
| `/fountain-inn` `/fountain-inn-sc` | `/service-areas/fountain-inn-sc` | ✅ Keep (standardized path) |
| `/woodruff` `/woodruff-sc` | `/service-areas/woodruff-sc` | ✅ Keep (standardized path) |
| `/charleston-sc` `/atlanta-ga` | N/A | ❌ Remove (out of scope) |

---

## Hidden But Still Accessible Routes

### Calculators (Removed from Main Nav)

| Route | Availability | Notes |
|---|---|---|
| `/addition-calculator` | Still accessible, linked from `/pricing` and `/additions` | Not in main header dropdown; traffic funneled through `/pricing` |
| `/garage-calculator` | Still accessible, linked from `/pricing` and `/garages` | Not in main header dropdown |
| `/deck-calculator` | Still accessible, linked from `/pricing` and `/outdoor-living` | Not in main header dropdown |

---

## URL Redirect Implementation Strategy

### Phase 1: Soft Redirects (301 Permanent Redirects)

**Server-Level Redirect (next.config.ts or Next.js rewrites)**

```typescript
redirects: async () => [
  // Service consolidations
  { source: '/deck-builder', destination: '/outdoor-living', permanent: true },
  { source: '/deck-pricing', destination: '/pricing', permanent: true },
  { source: '/screened-porch', destination: '/outdoor-living', permanent: true },
  { source: '/covered-patio', destination: '/outdoor-living', permanent: true },
  { source: '/room-additions', destination: '/additions', permanent: true },
  { source: '/addition-pricing', destination: '/pricing', permanent: true },
  { source: '/garage-builder', destination: '/garages', permanent: true },
  { source: '/garage-cost', destination: '/pricing', permanent: true },
  { source: '/garage-pricing', destination: '/pricing', permanent: true },
  { source: '/kitchen-remodeling', destination: '/remodeling', permanent: true },
  { source: '/bathroom-remodeling', destination: '/remodeling', permanent: true },
  { source: '/commercial-renovations', destination: '/commercial-upfits', permanent: true },
  { source: '/commercial-construction', destination: '/commercial-upfits', permanent: true },
  
  // Area consolidations
  { source: '/simpsonville', destination: '/service-areas/simpsonville-sc', permanent: true },
  { source: '/mauldin', destination: '/service-areas/mauldin-sc', permanent: true },
  { source: '/fountain-inn', destination: '/service-areas/fountain-inn-sc', permanent: true },
  { source: '/woodruff', destination: '/service-areas/woodruff-sc', permanent: true },
  
  // General nav consolidations
  { source: '/locations', destination: '/service-areas', permanent: true },
  { source: '/cost', destination: '/pricing', permanent: true },
  { source: '/calculator-costs', destination: '/pricing', permanent: true },
],
```

### Phase 2: Search Console & Analytics

- Submit new URL structure to Google Search Console
- Update XML sitemaps to reflect new routes
- Set up 301 redirect monitoring to track migration success
- Monitor GA4 for traffic to old routes (should see redirects)

### Phase 3: Content & Link Updates

- Update all internal links in blog posts, emails, and documentation to point to new routes
- Update CMS if links are stored in database
- Update footer links (already done in Header/Footer components)

---

## SEO Considerations

### Preserved Equity

- **301 Redirects**: All permanent redirects preserve ~90–95% of page authority and ranking signals
- **Breadcrumb Schema**: All new pages include breadcrumb schema for clear hierarchy
- **Local Business Schema**: City pages include local business markup with address, phone, service area
- **Meta Tags**: All new pages include proper title, description, Open Graph tags

### New Opportunities

- **Cleaner URLs**: Shorter, more memorable paths improve click-through rate
- **Internal Linking**: Related services now clearly linked; improves crawler crawl depth
- **Topic Authority**: Consolidation creates topic clusters (e.g., `/additions`, `/additions-faq`, external backlinks)

---

## Navigation Structure Summary

### Before (9 Services)
- Home | Services (9-item dropdown) | About | Contact | Pricing | Calculators | Blog

### After (5 Services)
- Home | Services (5-item dropdown) | Service Areas | Pricing | Projects | About | Contact

### Service Dropdown Structure

**Services** (New)
- Additions
- Garages
- Outdoor Living
  - Decks
  - Screened Porches
  - Covered Patios
- Remodeling
- Commercial Upfits

---

## Pages Created/Modified

### New Pages
- ✅ `/additions` (service hub)
- ✅ `/garages` (service hub)
- ✅ `/outdoor-living` (service hub)
- ✅ `/outdoor-living/[decks|screened-porches|covered-patios]` (optional sub-pages if traffic warrants)
- ✅ `/remodeling` (service hub)
- ✅ `/commercial-upfits` (service hub)
- ✅ `/service-areas` (city hub)
- ✅ `/service-areas/simpsonville-sc` (city landing)
- ✅ `/service-areas/mauldin-sc` (city landing)
- ✅ `/service-areas/fountain-inn-sc` (city landing)
- ✅ `/service-areas/woodruff-sc` (city landing)
- ✅ `/pricing` (central pricing hub)

### Modified Pages
- ✅ `src/components/layout/Header.tsx` (simplified navigation)
- ✅ `src/components/layout/Footer.tsx` (updated links)
- 🔄 `src/app/page.tsx` (homepage – pending revision)

### Deprecated from Main Navigation
- ❌ Calculators dropdown (but still accessible via `/pricing` and service pages)
- ❌ Individual pricing pages (consolidated to `/pricing`)
- ❌ Unrelated services from old menu

---

## Testing Checklist

- [ ] All 301 redirects return HTTP 301 with correct Location header
- [ ] Old URLs redirect to new URLs correctly in browser
- [ ] New service hub pages load without 404 errors
- [ ] Breadcrumb navigation works on all new pages
- [ ] Internal links between service pages work correctly
- [ ] Service areas cross-link to all 5 services correctly
- [ ] Pricing page displays all service cost ranges correctly
- [ ] Mobile navigation works (header dropdown on mobile)
- [ ] Schema markup validates (breadcrumb, local business)
- [ ] Google Search Console reports no errors after redirect setup

---

## Timeline

- **Week 1**: Implement 301 redirects in `next.config.ts`
- **Week 2**: Monitor Search Console for redirect success; update XML sitemaps
- **Week 2–3**: Update internal link references across blog/content
- **Week 3**: Monitor traffic migration; check GA4 for old route access patterns
- **Week 4**: Verify all pages indexed correctly in Google Search

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Lost backlinks from old URLs | 301 redirects preserve authority; monitor backlink profile in GSC |
| Confusion from URL changes | Clear internal linking + breadcrumbs help users navigate |
| Ranking volatility | All redirects are permanent (301); Google respects these quickly |
| Cached old URLs in search | Disavow old URLs in GSC if they remain indexed after 8 weeks |

---

## Future Optimization

### Phase 2 (Optional)
- Create `/outdoor-living/decks`, `/outdoor-living/screened-porches`, `/outdoor-living/covered-patios` as standalone SEO-optimized pages if search volume warrants
- Create separate `/service-areas/simpsonville-sc/additions`, etc., if local service page authority grows
- Build blog content around each service hub with internal linking

### Phase 3 (Optional)
- Expand service areas to include neighboring cities if business model changes
- Create project gallery pages with before/after images
- Build customer testimonial pages by service type

---

## Questions & Contact

For questions about this deprecation plan, contact the development team. All redirects should be tested in a staging environment before deploying to production.
