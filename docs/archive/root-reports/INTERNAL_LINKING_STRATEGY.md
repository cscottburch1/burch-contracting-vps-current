# INTERNAL LINKING STRATEGY - IMPLEMENTATION PLAN
## BurchContracting.com - SEO Authority Network  
**Date:** April 14, 2026  
**Goal:** Build powerful internal link network for 4 core services across 6 primary locations

---

## 🎯 LINK HIERARCHY ESTABLISHED

### LEVEL 1 - Maximum Authority (Homepage)
- **Page:** `/` (homepage)
- **Status:** ✅ Already has good structure
- **Current Links:** Service areas, featured local pages, calculators
- **❌ MISSING:** Direct links to 4 core service hubs
- **Action Required:** Add prominent links to /deck-builder, /screened-porches, /garage-builder, /room-additions

### LEVEL 2 - Core Service Hubs (Distribute Homepage Authority)
- **Pages:** 
  - `/deck-builder` (deck building hub)
  - `/screened-porches` (screened porch hub)
  - `/garage-builder` (garage construction hub)
  - `/room-additions` (home additions hub)
- **Status:** ⚠️ Uses LocalSeoLanding component, needs internal links
- **Current Links:** Breadcrumbs, external authority links
- **❌ MISSING:** 
  - Links to all 6 location pages
  - Links to related services (cross-linking)
  - Links to relevant projects
  - Links to service+location pages
- **Action Required:** Enhance LocalSeoLanding component with internal linking section

### LEVEL 3 - Location Pages (Geographic Authority)
- **Pages:**
  - `/service-areas/simpsonville`
  - `/service-areas/fountain-inn`
  - `/service-areas/mauldin`
  - `/service-areas/laurens`
  - `/service-areas/woodruff`
  - `/service-areas/gray-court`
- **Status:** ⚠️ Custom template, may contain non-core content
- **❌ CRITICAL:** cityContent data includes basement, kitchen, bathroom references - **MUST REMOVE**
- **❌ MISSING:**
  - Links to all 4 services for each city
  - Links to nearby cities
  - Links to relevant projects
- **Action Required:** 
  1. Remove references to basement, kitchen, bathroom, handyman, ADU
  2. Add strategic links to 4 core services
  3. Add nearby city links

### LEVEL 4 - Service+Location Pages (Maximum Relevance)
- **Pages:** 
  - `/simpsonville-sc/deck-builder`
  - `/simpsonville-sc/screened-porches`
  - `/simpsonville-sc/garage-builder`
  - `/simpsonville-sc/room-additions`
  - ... (×6 cities × 4 services = 24 pages)
- **Status:** ✅ Uses LocalSeoLanding, good structure
- **❌ MISSING:**
  - Link to parent service page (/deck-builder)
  - Link to parent location page (/service-areas/simpsonville)
  - Links to related services in same city
  - Links to nearby city + service pages
- **Action Required:** Enhance LocalSeoLanding with contextual internal links

### LEVEL 5 - Projects & Resources (Supporting Authority)
- **Pages:**
  - `/projects/*` (project showcase)
  - `/cost/*` (cost guides)
  - `/blog/*` (blog posts)
- **Status:** Needs audit
- **Action Required:** Add service + location links

---

## 🚨 PHASE 8 - REMOVE BAD LINKS (DO THIS FIRST!)

### Critical Cleanup Required

**Files to Audit:**
1. `src/app/service-areas/[city]/page.tsx` - check cityContent data
2. `src/components/RecentProjects.tsx` - remove handyman/remodeling categories
3. Any navigation components
4. Any footer links

**Non-Core Services to Remove:**
- ❌ Basement finishing
- ❌ Kitchen remodeling
- ❌ Bathroom remodeling
- ❌ Bath to tile shower conversion
- ❌ Handyman services
- ❌ General remodeling
- ❌ ADU builder

**Where They Appear:**
- Service-areas city content (whyChooseUs, servicesIntro)
- RecentProjects component categories
- Calculator pages (keep but NOINDEX)
- Service navigation
- Internal links in content

---

## 📋 IMPLEMENTATION CHECKLIST

### PHASE 1 - Current State Analysis ✅
- [x] Examined homepage structure
- [x] Identified service page component (LocalSeoLanding)
- [x] Identified location page structure
- [x] Found bad links in cityContent data
- [x] Mapped link hierarchy

### PHASE 2 - Homepage Linking 🔄
- [ ] Add "Our Core Services" section with 4 prominent service links
- [ ] Enhance service card links in existing section
- [ ] Add keyword-rich anchor text
- [ ] Link text examples:
  - "Expert Deck Builder in Simpsonville, Fountain Inn & Mauldin"
  - "Custom Screened Porch Contractor Serving Upstate SC"
  - "Professional Garage Builder | Laurens & Greenville County"
  - "Home Addition Specialist | Room Additions Across Upstate SC"

### PHASE 3 - Service Page Linking 🔄
- [ ] Create new internal linking section for LocalSeoLanding component
- [ ] Add "Service Areas" section linking to all 6 location pages
- [ ] Add "Related Services" section (2-3 related services)
- [ ] Add "Recent Projects" section (2-4 relevant projects)
- [ ] Add keyword-rich anchor text throughout
- [ ] Example for `/deck-builder` page:
  - Link to: /service-areas/simpsonville, /service-areas/fountain-inn, etc.
  - Related: /screened-porches, /garage-builder, /room-additions
  - Projects: 2-4 deck building projects

### PHASE 4 - Location Page Linking 🔄
- [ ] Clean cityContent data (remove non-core references)
- [ ] Add "Our Services in [City]" section
- [ ] Link to all 4 service+location pages for that city
- [ ] Add "Nearby Service Areas" section
- [ ] Link to 2-3 nearby cities
- [ ] Example for `/service-areas/simpsonville`:
  - Services: /simpsonville-sc/deck-builder, /simpsonville-sc/screened-porches, etc.
  - Nearby: /service-areas/fountain-inn, /service-areas/mauldin, /service-areas/five-forks

### PHASE 5 - Service+Location Page Linking 🔄
- [ ] Enhance LocalSeoLanding with contextual parent links
- [ ] Add breadcrumb links (may already exist)
- [ ] Add "Other Services in [City]" section (2-3 related services)
- [ ] Add "Nearby [Service]" section (2-3 nearby cities)
- [ ] Example for `/simpsonville-sc/deck-builder`:
  - Parent service: /deck-builder
  - Parent location: /service-areas/simpsonville
  - Related: /simpsonville-sc/screened-porches, /simpsonville-sc/garage-builder
  - Nearby: /fountain-inn-sc/deck-builder, /mauldin-sc/deck-builder

### PHASE 6 - Project Page Linking 🔄
- [ ] Audit all project pages
- [ ] Add service link (e.g., "This is a deck building project")
- [ ] Add location link (e.g., "Serving Simpsonville, SC")
- [ ] Add related projects (optional)

### PHASE 7 - Resource Page Linking 🔄
- [ ] Audit cost guide pages
- [ ] Audit blog posts
- [ ] Add service links
- [ ] Add location links
- [ ] Add CTA links

### PHASE 8 - Remove Bad Links ⚠️ PRIORITY
- [ ] Remove basement, kitchen, bathroom content from cityContent
- [ ] Remove handyman/remodeling from RecentProjects component
- [ ] Audit navigation for non-core service links
- [ ] Audit footer for non-core service links
- [ ] Search codebase for hardcoded non-core links

### PHASE 9 - Breadcrumb Verification 🔄
- [ ] Verify breadcrumbs exist on all pages
- [ ] Verify breadcrumbs have proper schema
- [ ] Verify breadcrumbs are clickable
- [ ] Test breadcrumb navigation

### PHASE 10 - Build & Deploy 🔄
- [ ] Create git branch: internal-linking-phase-1
- [ ] Implement changes incrementally
- [ ] Test locally
- [ ] Build without errors
- [ ] Deploy to production
- [ ] Verify on live site

### PHASE 11 - Link Audit & Validation 🔄
- [ ] Crawl site to verify all internal links work
- [ ] Check link density (5-10 per page)
- [ ] Verify anchor text variety
- [ ] Test mobile navigation
- [ ] Verify no broken links

### PHASE 12 - Final Report 📊
- [ ] Pages updated (count)
- [ ] Links added per page type (metrics)
- [ ] Links removed (count)
- [ ] Issues found (list)
- [ ] SEO impact assessment

---

## 🔗 ANCHOR TEXT STRATEGY

### Good Anchor Text Examples:
- "deck builder in Simpsonville SC"
- "screened porch contractor near Fountain Inn"
- "garage construction services in Laurens County"
- "home addition specialist serving Woodruff"
- "custom decks in Mauldin"
- "professional garage builders"

### Avoid:
- ❌ "click here"
- ❌ Exact same keyword repeated everywhere
- ❌ Over-optimization (too many exact match anchors)
- ❌ Generic "learn more"

### Variation Strategy:
- Use city variations: "Simpsonville SC", "Simpsonville", "Simpsonville, South Carolina"
- Use service variations: "deck builder", "deck building", "custom decks", "deck construction"
- Mix branded and keyword: "Burch Contracting deck services", "professional deck builder"
- Natural language: "our deck building services in Simpsonville"

---

## 📊 LINK DENSITY TARGETS

### Per Page Type:
- **Homepage:** 15-20 internal links (more is OK due to navigation)
- **Service Pages:** 8-12 internal links (focused, relevant)
- **Location Pages:** 10-15 internal links (services + nearby cities)
- **Service+Location Pages:** 8-10 internal links (parent pages + related)
- **Project Pages:** 5-8 internal links (service + location + CTA)
- **Blog/Cost Pages:** 6-10 internal links (educational + service + location)

### Distribution:
- Navigation: 4-6 links (core services)
- Main content: 5-8 contextual links
- Related sections: 3-5 links
- Footer: Standard (contact, about, etc.)

---

## ⚠️ CRITICAL NOTES

1. **DO NOT** over-optimize - keep it natural
2. **DO NOT** stuff keywords - use variations
3. **DO NOT** create orphan pages - every page should be linked
4. **DO** maintain clean UX - links should help users
5. **DO** use descriptive anchor text - avoid generic
6. **DO** link to parent pages - build hierarchy
7. **DO** cross-link related services - build topical authority
8. **DO** link nearby locations - strengthen geographic relevance

---

## 🎯 SUCCESS METRICS (30-60 Days Post-Implementation)

### SEO Metrics:
- Core service pages: Improved rankings for target keywords
- Location pages: Better local pack visibility
- Service+location pages: Ranking for long-tail combinations
- Internal PageRank: Authority flowing from homepage → services → locations

### Technical Metrics:
- Crawl efficiency: All pages discovered within 3 clicks from homepage
- Link equity: Root domain authority distributed to key pages
- User engagement: Lower bounce rate, higher pages/session
- Conversion: More contacts from core service pages

### Tracking:
- Google Search Console: Monitor impressions/clicks for core pages
- Google Analytics: Track navigation paths and conversion flows
- Rank tracking: Monitor keyword positions for service+location combos
- Crawl analysis: Use Screaming Frog to verify link structure

---

## 🚀 NEXT STEPS

1. ✅ Create this strategy document
2. 🔄 Remove bad links to non-core services (PRIORITY)
3. 🔄 Enhance homepage with direct service links
4. 🔄 Add internal linking sections to LocalSeoLanding component 
5. 🔄 Clean location page content
6. 🔄 Implement breadcrumb verification
7. 🔄 Build, test, deploy
8. 🔄 Monitor and refine

---

**READY TO IMPLEMENT** ✅
