# Phase 3: Full Competitor-Level Upgrade Plan

**Date:** April 16, 2026  
**Status:** 🔍 PLANNING & REVIEW  
**Dev Server:** http://localhost:3001 (RUNNING)

---

## Current Status Review

### ✅ COMPLETED (Phase 1 & 2)

**Phase 1 Achievements:**
- ✅ Removed SEO-speak from LocalSeoLanding component
- ✅ Enhanced calculators with detailed math toggle and print
- ✅ Perfect footer NAP with Google Maps embed (Gray Court address)
- ✅ Updated business config with correct address (1095 Water Tank Rd, Gray Court, SC 29645)
- ✅ Enhanced schema markup with dynamic NAP, geo coordinates, ratings

**Phase 2 Achievements:**
- ✅ Created MiniCalculatorEmbed component (embeddable quick estimator)
- ✅ Built ProjectGallery component with city tags for local SEO
- ✅ Enhanced CitiesGrid with 12 cities, population, distance data
- ✅ Added Testimonials component with Review Schema markup
- ✅ Expanded navigation dropdown to 6 services (added Kitchen & Bath, Basement)
- ✅ Redesigned homepage with enhanced sections
- ✅ Integrated all components into universal LocalSeoLanding template

---

## 🎯 PHASE 3 REQUIREMENTS (New Competitor-Level Features)

### 1. Navigation Enhancements

**Required:**
- [ ] Make header truly sticky (position: sticky with proper z-index)
- [ ] Add floating mobile "Get Free Estimate" button
- [ ] Make phone number always visible and clickable
- [ ] Add prominent green CTA button (desktop)
- [ ] Ensure dropdown works smoothly on mobile

**Current State:**
- Header exists with 6 services in dropdown
- Need to verify sticky behavior
- Need to add floating mobile CTA
- Need to style prominent green button

**Files to Modify:**
- `src/components/layout/Header.tsx`
- `src/styles/globals.css` (if needed)

---

### 2. Universal Page Template Application

**Required Template Order:**
1. Hero (service + local cities + dual CTAs)
2. Benefits / Options
3. **Embedded Mini Calculator** (on service pages)
4. **Project Gallery** (with city captions)
5. Why Choose Burch Contracting
6. **Cities / Areas We Serve** (clickable grid)
7. Planning Tips & FAQs
8. **Testimonials**
9. Final Strong CTA + Embedded Lead Form

**Current State:**
- ✅ LocalSeoLanding has: Hero, Benefits, Planning, Projects, Cities, FAQs, CTA
- ✅ Phase 2 added: Mini Calculator, Project Gallery, CitiesGrid, Testimonials
- **NEED TO VERIFY ORDER** matches exactly

**Pages to Apply Template:**
- [ ] /deck-builder ✅ (has LocalSeoLanding)
- [ ] /screened-porches ✅ (has LocalSeoLanding)
- [ ] /garage-builder ✅ (has LocalSeoLanding) **CRITICAL REWRITE NEEDED**
- [ ] /home-additions (check if exists)
- [ ] /kitchen-bath-remodeling (verify route)
- [ ] /basement-finishing (verify route)

**Action Items:**
- Review garage-builder page for any remaining SEO-speak
- Verify all service pages use universal template
- Ensure consistent section ordering

---

### 3. Calculator Upgrades (Major Feature Addition)

**Current State:**
- ✅ Basic calculator exists at `/calculator/*`
- ✅ Has material selection
- ✅ Has markup display (22.5% for garages)
- ✅ Has detailed math toggle
- ✅ Has print button

**Still Needed:**
- [ ] **Location Multipliers** (Gray Court 0.98×, Simpsonville/Greenville 1.07×)
- [ ] **Save Estimate** button functionality
- [ ] Immediate "Get Free On-Site Quote" form after results (may already exist)
- [ ] **Real-time sliders** (verify current implementation)
- [ ] Embed mini calculators on ALL matching service pages

**Location Multiplier Map:**
```javascript
const locationMultipliers = {
  'gray-court': 0.98,
  'simpsonville': 1.07,
  'greenville': 1.07,
  'fountain-inn': 1.02,
  'mauldin': 1.05,
  'laurens': 0.99,
  'woodruff': 1.00,
  'five-forks': 1.06
};
```

**Files to Modify:**
- `src/components/calculators/CompetitivePricingCalculator.tsx`
- `src/components/calculators/MiniCalculatorEmbed.tsx`

---

### 4. Homepage Specific Flow

**Required Order:**
1. Hero
2. Services Overview Cards
3. Why Choose Us
4. Recent Projects
5. Calculators Teaser
6. Large Cities We Serve Grid
7. Testimonials
8. Final CTA

**Current State (src/app/page.tsx):**
1. ✅ Hero
2. ✅ Core Services (4 blocks) - **NEED 6 BLOCKS**
3. ✅ Why Choose Us
4. ✅ Our Simple Process
5. ✅ Featured Projects (RecentProjectsSSR)
6. ✅ Testimonials (NEW - Phase 2)
7. ✅ Enhanced Cities Grid (NEW - Phase 2)
8. ✅ Calculator Teaser
9. ✅ Final CTA

**Action Items:**
- [ ] Expand Services section from 4 to 6 cards
- [ ] Add Kitchen & Bath Remodeling card
- [ ] Add Basement Finishing card
- [ ] Verify order matches requirements exactly
- [ ] Move Calculators section BEFORE Cities Grid

---

### 5. Local SEO / GEO / Technical

**Current State:**
- ✅ Full NAP in footer (1095 Water Tank Rd, Gray Court, SC 29645)
- ✅ Phone: (864) 724-4600 visible in footer
- ✅ Google Maps embed in footer
- ✅ JSON-LD LocalBusiness schema on pages
- ✅ Service schema on service pages
- ✅ FAQ schema
- ✅ Review schema (Testimonials component)

**Still Needed:**
- [ ] NAP in **header** on every page (currently only footer)
- [ ] Verify schema on ALL pages (not just service pages)
- [ ] Audit /garage-builder for any remaining SEO-speak
- [ ] Optimize meta titles & descriptions for every page

**Files to Check:**
- `src/components/layout/Header.tsx` - Add NAP
- `src/app/garage-builder/page.tsx` - Remove SEO-speak
- All page metadata objects

---

### 6. Content Voice & Polish

**Required:**
- Warm, experienced, straightforward local contractor tone
- Benefit-focused
- NO internal SEO notes
- NO "this page targets..." language
- NO templated fluff

**Action Items:**
- [ ] Audit all pages for SEO meta language
- [ ] Review garage-builder page specifically (mentioned as "critical rewrite")
- [ ] Ensure natural keyword usage only
- [ ] Check for any remaining template placeholders

---

## 🔍 IMMEDIATE REVIEW CHECKLIST

**Now that localhost:3001 is open, review these areas:**

### Homepage (/)
- [ ] Count service cards (should be 6, not 4)
- [ ] Check if Testimonials section is visible
- [ ] Check if enhanced Cities Grid is showing (12 cities with data)
- [ ] Verify section order matches requirements
- [ ] Check if header is sticky
- [ ] Look for floating mobile CTA

### Service Pages (/deck-builder, /screened-porches, /garage-builder)
- [ ] Verify mini calculator is embedded on page
- [ ] Check project gallery with city tags is showing
- [ ] Verify cities grid is showing
- [ ] Check testimonials section exists
- [ ] Look for any SEO-speak language
- [ ] Verify order matches universal template

### Calculator Pages (/calculator/garages, /calculator/decks, etc.)
- [ ] Check if location selector exists
- [ ] Verify detailed math toggle works
- [ ] Check print button functionality
- [ ] Look for Save button
- [ ] Check if CTA form appears after results

### Navigation & Footer (All Pages)
- [ ] Verify sticky header
- [ ] Check services dropdown has all 6 services
- [ ] Look for floating mobile CTA
- [ ] Verify footer has full NAP
- [ ] Check Google Maps embed in footer
- [ ] Verify clickable phone number

---

## 📋 IMPLEMENTATION PRIORITY

### HIGH PRIORITY (Do First)
1. **Add 2 service cards to homepage** (Kitchen & Bath, Basement)
2. **Fix garage-builder page** (remove any SEO-speak)
3. **Add location multipliers to calculator**
4. **Make header sticky with floating mobile CTA**
5. **Add NAP to header**

### MEDIUM PRIORITY
6. Verify schema on all pages
7. Add Save Estimate functionality
8. Optimize all meta titles/descriptions
9. Ensure universal template order is exact on all pages

### LOW PRIORITY (Polish)
10. Content voice audit across all pages
11. Remove any remaining template placeholders
12. Final QA pass

---

## 🛠️ FILES TO MODIFY (Phase 3)

### Critical Changes
1. **src/app/page.tsx** - Add 2 service cards, reorder sections
2. **src/components/layout/Header.tsx** - Sticky header, floating mobile CTA, add NAP
3. **src/components/calculators/CompetitivePricingCalculator.tsx** - Add location multipliers, Save button
4. **src/app/garage-builder/page.tsx** - Content audit, remove SEO-speak

### Supporting Changes
5. **src/components/calculators/MiniCalculatorEmbed.tsx** - Add location multipliers
6. **All page.tsx metadata** - Optimize titles/descriptions
7. **src/components/layout/Footer.tsx** - Verify complete (likely already good)

---

## 📊 COMPETITOR ANALYSIS REFERENCE

**Top Competitors Studied:**
- Legacy Decks (https://legacydecks.com)
- Archadeck Greenville
- Elite Decks
- Nunley Custom Homes
- Ferguson Builders

**Key Patterns Observed:**
- Sticky navigation with phone always visible
- Prominent CTA buttons (often green/orange)
- Calculators integrated into service pages
- Extensive city coverage with local content
- Strong social proof (reviews/testimonials)
- Project galleries with location tags
- Multi-step lead capture forms
- Location-based pricing transparency

---

## 🚀 NEXT STEPS

1. **Review Site Locally** (http://localhost:3001)
   - Use checklist above
   - Document what's missing vs complete
   - Screenshot any issues

2. **Create Implementation Plan**
   - Prioritize HIGH priority items
   - Estimate time for each item
   - Group related changes

3. **Execute Phase 3 Changes**
   - Work through priority list
   - Test each change locally
   - Commit incrementally

4. **Final QA & Deploy**
   - Run full build (`npm run build`)
   - Test all pages
   - Check mobile responsiveness
   - Deploy to production

---

## 💡 NOTES

**Business Details (Use Verbatim):**
- Name: Burch Contracting
- Address: 1095 Water Tank Rd, Gray Court, SC 29645
- Phone: (864) 724-4600
- Established: 1995
- Services: Custom decks (pressure-treated & composite), screened porches, attached & detached garages, home additions, kitchen & bathroom remodeling, basement finishing
- Markets: Simpsonville, Fountain Inn, Gray Court, Greenville, Laurens County, Mauldin, Woodruff, Five Forks, and all Upstate SC

**Phase 2 Components Available:**
- `<MiniCalculatorEmbed />` - Quick estimator widget
- `<ProjectGallery />` - Projects with city tags
- `<CitiesGrid />` - Enhanced city grid with data
- `<Testimonials />` - Reviews with schema

These are already integrated but may need positioning adjustments.

---

**Current Status:** 🟢 Dev server running at http://localhost:3001  
**Next Action:** Review site against checklist, then begin HIGH priority implementations
