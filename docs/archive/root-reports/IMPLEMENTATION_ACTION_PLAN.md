# SITE CLEANUP IMPLEMENTATION PLAN
## BurchContracting.com - Detailed Action Steps
**Date:** April 14, 2026

---

## EXECUTIVE SUMMARY

**Total Pages Audited:** ~296 pages  
**KEEP (Core Services):** 136 pages (46%)  
**NOINDEX (Non-Core):** 71 pages (24%)  
**REVIEW (Blog/Projects):** 18 pages (6%)  
**ADMIN/PORTAL (Already Protected):** 49 pages (17%)  
**MERGE/REDIRECT:** 7 pages (2%)  

---

## BLOG CLASSIFICATION (14 Posts)

### ✅ KEEP - Core Service Blogs (4)
1. `/blog/how-much-does-a-screened-porch-cost-in-south-carolina` - **KEEP** (Porch)
2. `/blog/deck-building-cost-simpsonville-sc` - **KEEP** (Deck)
3. `/blog/composite-vs-pressure-treated-deck-which-is-better` - **KEEP** (Deck)
4. `/blog/room-addition-cost-in-south-carolina` - **KEEP** (Additions)

### ⚠️ NOINDEX - Non-Core Service Blogs (7)
5. `/blog/cost-of-bathroom-remodeling-simpsonville-sc` - **NOINDEX**
6. `/blog/kitchen-remodel-cost-fountain-inn-sc` - **NOINDEX**
7. `/blog/average-cost-of-basement-finishing-in-south-carolina` - **NOINDEX**
8. `/blog/best-bathroom-tile-options-for-remodels` - **NOINDEX**
9. `/blog/how-long-does-a-kitchen-remodel-take` - **NOINDEX**
10. `/blog/bath-to-shower-conversion-cost-south-carolina` - **NOINDEX**
11. `/blog/how-to-plan-a-kitchen-remodel-step-by-step` - **NOINDEX**
12. `/blog/basement-finishing-ideas-sc` - **NOINDEX**

### 📊 KEEP - General/Multi-Service Blogs (3)
13. `/blog/do-you-need-permits-for-remodeling-in-simpsonville-sc` - **KEEP** (General)
14. `/blog/best-home-improvements-for-property-value-in-south-carolina` - **KEEP** (General)

**Blog Summary:** KEEP 7, NOINDEX 7

---

## PHASE 5: DETAILED ACTION PLAN

### TASK 1: ADD NOINDEX TO NON-CORE PAGES

**Priority:** 🔴 HIGH  
**Estimated Time:** 3-4 hours  
**Files to Modify:** ~71 pages

#### 1A. Service Pages - Add NOINDEX

**Files to Update:**
```
src/app/services/basement/page.tsx
src/app/services/handyman/page.tsx  
src/app/services/remodeling/page.tsx
```

**Change:** Add to metadata:
```typescript
export const metadata: Metadata = {
  // ...existing metadata
  robots: {
    index: false,
    follow: true,
  },
};
```

#### 1B. Calculator Pages - Add NOINDEX

**Files Already Have NOINDEX (✅ VERIFY):**
```
src/app/calculator/basement-finishing/page.tsx
src/app/calculator/bathroom-remodeling/page.tsx
src/app/calculator/kitchen-remodeling/page.tsx
src/app/calculator/handyman/page.tsx
src/app/calculator/remodeling/page.tsx
```

**Action:** Verify these already have noindex from previous work.

#### 1C. ADU City Pages - Add NOINDEX

**Path Pattern:** `src/app/[city]/[service]/page.tsx`  
**Dynamic Route:** Will need middleware or programmatic approach

**ADU Routes (9 cities):**
```
/simpsonville-sc/adu-builder
/fountain-inn-sc/adu-builder
/mauldin-sc/adu-builder
/gray-court-sc/adu-builder
/laurens-sc/adu-builder
/woodruff-sc/adu-builder
/clinton-sc/adu-builder
/ora-sc/adu-builder
/joanna-sc/adu-builder
```

**Solution:** Update `src/app/[city]/[service]/page.tsx` with conditional noindex:
```typescript
// Check if service is adu-builder, kitchen-remodeling, bathroom-remodeling
if (['adu-builder', 'kitchen-remodeling', 'bathroom-remodeling'].includes(service)) {
  metadata.robots = { index: false, follow: true };
}
```

#### 1D. Kitchen/Bathroom Renovation Pages - Add NOINDEX

**Service Hub Pages:**
```
src/app/kitchen-remodeling/page.tsx
src/app/bathroom-remodeling/page.tsx
src/app/home-renovations/page.tsx
```

**City Pages (18 total - 9 cities × 2 services):**  
Pattern: `/[city]-sc/[service]` where service = kitchen-remodeling or bathroom-remodeling

**Solution:** Update `src/app/[city]/[service]/page.tsx` with same conditional noindex

#### 1E. Location Service Landing Pages - Add NOINDEX

**Kitchen Pages (~4):**
```
/locations/kitchen-remodeling-simpsonville-sc
/locations/kitchen-remodeling-fountain-inn-sc
/locations/kitchen-remodeling-greenville-sc
/locations/kitchen-remodeling-greer-sc
```

**Bathroom Pages (~7):**
```
/locations/bathroom-remodeling-simpsonville-sc
/locations/bathroom-remodeling-fountain-inn-sc
/locations/bathroom-remodeling-greenville-sc
/locations/bathroom-remodeling-greer-sc
/locations/bath-to-tile-shower-simpsonville-sc
/locations/bath-to-tile-shower-greenville-sc
/locations/bath-to-tile-shower-greer-sc
```

**Basement Pages (~3):**
```
/locations/basement-finishing-simpsonville-sc
/locations/basement-finishing-fountain-inn-sc
/locations/basement-finishing-greenville-sc
```

**Solution:** Update `src/app/locations/[slug]/page.tsx` with conditional noindex based on slug pattern

####1F. Cost Pages - Add NOINDEX

**Kitchen/Bathroom/Basement Cost Pages:**
```
/cost/kitchen-remodel-cost-simpsonville-sc
/cost/kitchen-remodel-cost-greenville-sc
/cost/bathroom-remodel-cost-greenville-sc
/cost/basement-finishing-cost-greenville-sc
```

**Solution:** Update `src/app/cost/[slug]/page.tsx` with conditional based on slug

#### 1G. Blog Posts - Add NOINDEX

**7 Blog Posts to NOINDEX:**
```
/blog/cost-of-bathroom-remodeling-simpsonville-sc
/blog/kitchen-remodel-cost-fountain-inn-sc
/blog/average-cost-of-basement-finishing-in-south-carolina
/blog/best-bathroom-tile-options-for-remodels
/blog/how-long-does-a-kitchen-remodel-take
/blog/bath-to-shower-conversion-cost-south-carolina
/blog/how-to-plan-a-kitchen-remodel-step-by-step
/blog/basement-finishing-ideas-sc
```

**Solution:** Update `src/lib/seo/localSeoData.ts` - add `noindex: boolean` field to BlogPost interface

---

### TASK 2: UPDATE SITEMAP.TS

**Priority:** 🔴 HIGH  
**Estimated Time:** 1 hour  
**File:** `src/app/sitemap.ts`

**Changes Required:**

1. **Remove hardcoded ADU calculator:**
```typescript
// REMOVE THIS (already removed in previous session)
// { url: `${baseUrl}/adu-builder`, ... }
```

2. **Remove handyman/remodeling/basement calculators from sitemap:**
```typescript
const calculators = [
  // REMOVE: 'handyman',
  // REMOVE: 'remodeling', 
  // REMOVE: 'bathroom-remodeling',
  // REMOVE: 'kitchen-remodeling',
  // REMOVE: 'basement-finishing',
  'room-additions',
  'decks',
  'screened-porches',
  'garages',
  'home-additions',
  // KEEP old ones for now: 'additions', 'decks-screened-porches'
];
```

3. **Filter serviceLandingPages to exclude non-core:**
```typescript
const localServiceRoutes = serviceLandingPages
  .filter(page => {
    // Only include core services
    const allowedServices = [
      'Deck Builder',
      'Screened Porch Builder',
      'Decks and Screened Porches',
      'Room Additions',
    ];
    return allowedServices.includes(page.serviceName);
  })
  .map(page => ({ ...route config }));
```

4. **Filter costLandingPages to exclude non-core:**
```typescript
const coreServiceCostPages = [
  'deck-cost-simpsonville-sc',
  'cost-to-build-a-deck-simpsonville-sc',
  'screened-porch-vs-sunroom-sc',
  'home-addition-cost-greenville-sc',
  'room-addition-cost-greenville-sc',
  'garage-construction-cost-laurens-sc',
];

const costRoutes = costLandingPages
  .filter(page => coreServiceCostPages.includes(page.slug))
  .map(page => ({ ...route config }));
```

5. **Filter blogPosts to exclude non-core:**
```typescript
const coreServiceBlogs = [
  'how-much-does-a-screened-porch-cost-in-south-carolina',
  'deck-building-cost-simpsonville-sc',
  'composite-vs-pressure-treated-deck-which-is-better',
  'room-addition-cost-in-south-carolina',
  'do-you-need-permits-for-remodeling-in-simpsonville-sc',
  'best-home-improvements-for-property-value-in-south-carolina',
];

const blogRoutes = blogPosts
  .filter(post => coreServiceBlogs.includes(post.slug))
  .map(post => ({ ...route config }));
```

6. **Filter renovation pages (exclude ALL):**
```typescript
// REMOVE renovationCityRoutes completely
// REMOVE renovationServiceRoutes completely
// KEEP serviceHubRoutes but filter for core services only
const serviceHubRoutes = serviceHubPages
  .filter(page => {
    const coreServices = ['garage-builder', 'room-additions', 'screened-porches', 'deck-builder'];
    return coreServices.includes(page.service.slug);
  })
  .map(page => ({ ...route config }));
```

---

### TASK 3: NAVIGATION CLEANUP

**Priority:** 🟡 MEDIUM  
**Estimated Time:** 30 minutes  
**File:** `src/components/layout/Header.tsx`

**Current Navigation (from previous work):**
```typescript
const services = [
  { name: 'Deck Builder', href: '/deck-builder' },
  { name: 'Screened Porches', href: '/screened-porches' },
  { name: 'Garage Builder', href: '/garage-builder' },
  { name: 'Home Additions', href: '/room-additions' },
];
```

**Verification:** ✅ Already clean (from Phase 2)

**Footer Navigation Check:**
File: `src/components/layout/Footer.tsx`

**Current Footer (from previous work):**
- Blog link updated to "Blog" (not "Remodeling Blog") ✅

**Action:** VERIFY footer doesn't link to non-core services

---

### TASK 4: INTERNAL LINK CLEANUP

**Priority:** 🟡 MEDIUM  
**Estimated Time:** 2-3 hours

#### 4A. Homepage Internal Links
**File:** `src/app/page.tsx`

**Already cleaned in Phase 2:**
- Services filtered to core 4 services ✅
- FAQ updated to remove kitchen/handyman ✅

**Action:** VERIFY no remaining links to basement/ADU/kitchen/bathroom

#### 4B. Services Hub Page
**File:** `src/app/services/page.tsx`

**Already cleaned in Phase 2:**
- Hero updated to focus on core 4 services ✅

**Action:** VERIFY services listing only shows core 4

#### 4C. Projects Page
**File:** `src/app/projects/page.tsx`

**Already cleaned in Phase 2:**
- Project spotlights filtered to core services ✅

**Action:** VERIFY no kitchen/bathroom/basement projects shown

#### 4D. Service Landing Pages
**Pattern:** Check all service landing pages for cross-links

**Files:**
- `src/app/deck-builder/page.tsx`
- `src/app/garage-builder/page.tsx`
- `src/app/screened-porches/page.tsx`
- `src/app/room-additions/page.tsx`

**Action:** Remove any "Related Services" links to basement/kitchen/bathroom/handyman

#### 4E. Blog Posts
**Action:** Update blog post templates to exclude non-core service links

---

### TASK 5: PROJECT SPOTLIGHT REVIEW

**Priority:** 🟢 LOW  
**Estimated Time:** 30 minutes

**Project Pages to Review:**
1. `/projects/basement-living-suite-greenville` - **DECISION: KEEP** (good content, hide from navigation)
2. `/projects/basement-finishing-simpsonville` - **DECISION: KEEP** (good content, hide from navigation)
3. `/projects/kitchen-workflow-upgrade-simpsonville` - **DECISION: KEEP** (good content, hide from navigation)
4. `/projects/bathroom-renovation-greenville` - **DECISION: KEEP** (good content, hide from navigation)

**Solution:** Keep pages but:
1. Add NOINDEX to metadata
2. Remove from sitemap
3. Remove from projects listing page

**File to Update:** `src/lib/seo/projectSpotlightsData.ts`
- Add `noindex: boolean` field
- Mark these 4 as `noindex: true`

---

### TASK 6: CALCULATOR CONSOLIDATION

**Priority:** 🟡 MEDIUM  
**Estimated Time:** 1 hour

**Old Calculators (Keep for URL preservation, plan redirect later):**
- `/calculator/decks-screened-porches` → Eventually 301 to `/calculator/decks` or `/calculator/screened-porches`
- `/calculator/additions` → Eventually 301 to `/calculator/home-additions`
- `/calculator/room-additions` → Already points to new system ✅

**Action:** 
1. Keep old calculators live for now (6-12 months)
2. Add internal note: "Updated calculator available at [new URL]"
3. Plan 301 redirects after traffic analysis

---

### TASK 7: SEO PROTECTION CHECKLIST

**Priority:** 🔴 HIGH  
**Estimated Time:** 1 hour

#### 7A. Verify No Broken Links
**Command:**
```powershell
npm run build
# Check build output for any broken internal links
```

#### 7B. Verify robots.txt
**File:** `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /portal/
Disallow: /tradesmen/
Disallow: /api/

Sitemap: https://burchcontracting.com/sitemap.xml
```

**Action:** ✅ Verify admin/portal/tradesmen are blocked

#### 7C. Test Sitemap Generation
**Command:**
```powershell
# Visit https://burchcontracting.com/sitemap.xml
# Should only show KEEP pages
```

#### 7D. Verify Core Pages Still Index
**Pages to Monitor:**
- All 68 core service pages
- 9 service area pages  
- 10 core static pages

#### 7E. Setup Search Console Monitoring
**Action:** Monitor for:
- Coverage drops on core pages
- Unexpected noindex issues
- 404 errors from removed pages

---

## IMPLEMENTATION ORDER

### WEEK 1: NOINDEX & SITEMAP

**Day 1-2:**
- ✅ Task 1A-1E: Add NOINDEX to non-core pages
- ✅ Task 2: Update sitemap.ts

**Day 3:**
- ✅ Task 1F-1G: NOINDEX cost pages and blogs
- ✅ Task 7A-7B: SEO protection checks

**Day 4:**
- ✅ Build and test locally
- ✅ Verify sitemap generation
- ✅ Deploy to production

**Day 5:**
- ✅ Monitor Search Console
- ✅ Verify Google crawl behavior

### WEEK 2: CLEANUP & VERIFICATION

**Day 1-2:**
- ✅ Task 3: Navigation verification
- ✅ Task 4: Internal link cleanup

**Day 3:**
- ✅ Task 5: Project spotlight review
- ✅ Task 6: Calculator notes

**Day 4-5:**
- ✅ Final verification
- ✅ Documentation update
- ✅ Search Console monitoring

---

## ROLLBACK PLAN

If core pages lose rankings:

1. **Immediate:** Check which pages affected
2. **Verify:** Sitemap still includes all core pages
3. **Fix:** Remove any accidental noindex tags
4. **Re-deploy:** Push fix within 24 hours
5. **Monitor:** Search Console coverage report

**Backup:** Git commit before each phase for easy rollback

---

## SUCCESS METRICS

**Track After 30 Days:**
1. Core service pages maintain/improve rankings ✅
2. Non-core pages drop from SERPs ⚠️
3. Crawl budget focuses on core content ✅
4. Internal linking structure clean ✅
5. No unexpected 404s or broken links ✅

**Track After 90 Days:**
1. Organic traffic to core pages increases
2. Conversion rate improves (fewer distractions)
3. User engagement metrics improve
4. Brand searches increase for core services

---

## QUESTIONS FOR USER

Before proceeding, confirm:

1. **Basement/Kitchen/Bathroom Projects:** Keep with NOINDEX, or delete completely?
2. **Old Calculators:** Keep for 6 months then redirect, or redirect now?
3. **Renovation Silo:** Complete NOINDEX, or keep for local branded searches?
4. **Timeline:** Implement all at once, or phase over 2 weeks?
5. **Blog Strategy:** Keep general blogs, or NOINDEX those too?

