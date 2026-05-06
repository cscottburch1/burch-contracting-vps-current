# PageSpeed Render-Blocking & Forced Reflow Fixes

**Date:** March 28, 2026  
**Deployment:** Production VPS (72.60.166.68)  
**Commit:** b6b7813

---

## Issues Identified from PageSpeed Insights

### ❌ Issue #1: Render-blocking requests - Est. savings 180ms

**Problem:**
- CSS file blocking initial render (LCP, FCP impact)
- File: `7452e1da1defe709.css` (20.9 KiB, 230ms duration)
- Blocking the page's initial render

**Root Cause:**
- CSS is inherently render-blocking by design
- Even consolidated CSS (1 file) still blocks rendering
- No critical CSS inlining enabled

---

### ❌ Issue #2: Forced reflow - Multiple forced layout recalculations

**Problem:**
- reCAPTCHA scripts causing forced reflows site-wide
- Scripts loaded globally on ALL pages (220+ pages)
- Only 3 pages actually use reCAPTCHA (contact, employment forms)
- Forced reflows when JavaScript queries geometric properties after style changes

**Root Cause:**
- reCAPTCHA script loaded in `layout.tsx` (global)
- Loaded on pages that don't need it (homepage, blog, services, etc.)
- Script executes on every page, causing performance overhead

---

## Solutions Implemented

### ✅ Fix #1: Critical CSS Inlining + Resource Hints

**File:** `next.config.ts`

**Change:** Enable Critters for critical CSS extraction
```typescript
experimental: {
  cssChunking: false,
  optimizeCss: {
    critters: {
      preload: 'swap',      // Use font-display: swap strategy
      pruneSource: false,   // Keep original CSS for non-critical styles
    },
  },
},
```

**How it works:**
- Critters extracts critical above-the-fold CSS
- Inlines critical CSS in `<head>` for immediate rendering
- Defers non-critical CSS with `<link rel="preload" as="style">`
- Reduces render-blocking impact

---

**File:** `src/app/layout.tsx`

**Change:** Add resource hints for faster DNS resolution and font loading
```typescript
<head>
  {/* Resource hints for faster CSS/font loading */}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
</head>
```

**Benefits:**
- `preconnect` for fonts: Establishes early connection (DNS + TCP + TLS)
- `dns-prefetch` for analytics: Resolves DNS before scripts load
- Reduces latency for external resources

---

### ✅ Fix #2: Conditional reCAPTCHA Loading (Eliminate Forced Reflows)

**File:** `src/app/layout.tsx`

**Change:** REMOVED global reCAPTCHA script
```typescript
// BEFORE
{recaptchaSiteKey && (
  <Script
    src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
    strategy="lazyOnload"
  />
)}

// AFTER
// Removed - now loaded only on form pages
```

---

**Files:** 
- `src/app/contact/page.tsx`
- `src/app/employment/direct-hire/page.tsx`
- `src/app/subcontractors/join/page.tsx`

**Change:** Add reCAPTCHA script ONLY to pages with forms
```typescript
import Script from 'next/script';

return (
  <>
    {/* Load reCAPTCHA only on form pages */}
    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="lazyOnload"
      />
    )}
    {/* Page content */}
  </>
);
```

**Impact:**
- **Before:** reCAPTCHA loaded on 220+ pages (homepage, blog, services, etc.)
- **After:** reCAPTCHA loaded ONLY on 3 form pages
- **Result:** Eliminates forced reflows on 217+ pages that don't need it

---

## Technical Details

### Why Forced Reflows Occur

**What is a forced reflow?**
- Browser must recalculate layout when JavaScript reads geometry after styles change
- Examples: `offsetWidth`, `getBoundingClientRect()`, etc.
- Triggers expensive layout recalculation (main thread blocked)

**reCAPTCHA's forced reflows:**
1. reCAPTCHA loads and inserts invisible iframe
2. JavaScript queries iframe dimensions (forced reflow)
3. Adjusts positioning based on viewport (another forced reflow)
4. Happens on EVERY page load (even pages without forms)

**Our fix:**
- Only load reCAPTCHA on pages that actually have forms
- Other pages: NO reCAPTCHA script = NO forced reflows

---

### Pages with reCAPTCHA (3 total)

| Page | Form Type | reCAPTCHA Action |
|------|-----------|------------------|
| `/contact` | Contact form | `contact_form` |
| `/employment/direct-hire` | Employment application | `employee_apply` |
| `/subcontractors/join` | Subcontractor application | `subcontractor_apply` |

**All other pages:** No reCAPTCHA script loaded

---

### Critical CSS Configuration

**Critters Options Explained:**

```typescript
critters: {
  preload: 'swap',
  pruneSource: false,
}
```

**`preload: 'swap'`:**
- Sets `font-display: swap` for web fonts
- Shows fallback font immediately, swaps when web font loads
- Prevents layout shifts (FOUT instead of FOIT)

**`pruneSource: false`:**
- Keeps original CSS file intact
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously via `<link rel="preload">`
- Ensures all styles available (safe mode)

---

## Expected Performance Improvements

### Render-Blocking CSS Fix

**Before:**
- Single CSS file: 20.9 KiB, 230ms duration
- Blocks LCP and FCP
- No critical CSS inlining

**After:**
- Critical CSS: Inlined in `<head>` (~5-10 KB estimated)
- Non-critical CSS: Preloaded asynchronously
- Fonts: Preconnected for faster loading

**Expected savings:** 100-150ms on initial render

---

### Forced Reflow Fix

**Before:**
- reCAPTCHA loaded on 220+ pages
- Forced reflows on EVERY page
- Unnecessary JavaScript execution

**After:**
- reCAPTCHA loaded on 3 form pages only
- 217+ pages: ZERO forced reflows from reCAPTCHA
- Reduced JavaScript overhead site-wide

**Expected savings:** 
- Eliminate "Forced reflow" warnings on non-form pages
- Reduce main thread work by ~50-100ms per page
- Better Total Blocking Time (TBT)

---

## Build Results

**Build Status:** ✅ SUCCESS (221 pages generated)

**Form Pages with reCAPTCHA:**
```
/contact                         - 8.80 kB (added Script tag)
/employment/direct-hire          - 4.32 kB (added Script tag)
/subcontractors/join             - 7.07 kB (added Script tag, increased from 5.45 kB)
```

**All other pages:** No reCAPTCHA script overhead

---

## Deployment Timeline

**Commits:**
```
b6b7813 - perf: fix render-blocking CSS and forced reflows
          - Critical CSS inlining via critters
          - Resource hints (preconnect, dns-prefetch)
          - Conditional reCAPTCHA loading (form pages only)
```

**Deployment Steps:**
1. ✅ Committed changes to git
2. ✅ Pushed to GitHub
3. ✅ Pulled on VPS: `/var/www/burch-contracting`
4. ✅ Built with critical CSS extraction
5. ✅ Restarted PM2
6. ✅ Verified application online

**Production URL:** https://burchcontracting.com

---

## Verification Steps

### 1. Functional Testing (CRITICAL)

**Test reCAPTCHA on form pages:**
- [ ] Visit `/contact` - Submit form (should work)
- [ ] Visit `/employment/direct-hire` - Submit application (should work)
- [ ] Visit `/subcontractors/join` - Submit application (should work)

**Check browser console:**
- [ ] No reCAPTCHA errors on form pages
- [ ] reCAPTCHA token generated successfully
- [ ] Forms submit without errors

**Test non-form pages:**
- [ ] Visit homepage - Check console (no reCAPTCHA script loaded)
- [ ] Visit `/services/handyman` - Check console (no reCAPTCHA)
- [ ] Visit `/blog` - Check console (no reCAPTCHA)

---

### 2. PageSpeed Insights Testing

**Wait 5-10 minutes for caches to clear, then:**

```
URL: https://pagespeed.web.dev/
Test URL: https://burchcontracting.com
Device: Mobile

Expected Improvements:
✅ "Render-blocking resources" - REDUCED or ELIMINATED
✅ "Forced reflow" - ELIMINATED on homepage
✅ Lower Total Blocking Time (TBT)
✅ Faster First Contentful Paint (FCP)
✅ Better Largest Contentful Paint (LCP)

Before:
- Render-blocking: 180ms savings available
- Forced reflow: Multiple warnings

After (Expected):
- Render-blocking: Minimal (critical CSS inlined)
- Forced reflow: NONE on non-form pages
```

**Test non-form page:**
```
URL: https://burchcontracting.com
Expected: No forced reflow warnings
```

**Test form page:**
```
URL: https://burchcontracting.com/contact
Expected: Forced reflow OK (needed for reCAPTCHA functionality)
```

---

### 3. Critical CSS Verification

**Check HTML source (View Page Source):**

**Homepage:**
```html
<head>
  <style data-critters-container>
    /* Critical CSS should be inlined here */
    /* Should include above-the-fold styles */
  </style>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  <!-- Non-critical CSS preloaded -->
  <link rel="preload" as="style" href="/_next/static/css/...css">
</head>
```

**Verification:**
- [ ] Critical CSS inlined in `<style data-critters-container>`
- [ ] Resource hints present (preconnect, dns-prefetch)
- [ ] Non-critical CSS loaded with `rel="preload"`
- [ ] NO reCAPTCHA script on homepage

---

### 4. DevTools Network Panel

**Homepage (non-form page):**
1. Open DevTools → Network
2. Filter: JS
3. Reload page
4. **Verify:** NO `recaptcha/api.js` request

**Contact page (form page):**
1. Open DevTools → Network
2. Filter: JS
3. Reload page
4. **Verify:** YES `recaptcha/api.js` loaded (lazyOnload)

---

## Rollback Plan

**If reCAPTCHA forms break:**

```bash
ssh root@72.60.166.68
cd /var/www/burch-contracting
git reset --hard f80b0de  # Previous commit (before reCAPTCHA changes)
npm run build
pm2 restart burch-contracting
```

**Partial rollback (restore global reCAPTCHA):**

Edit `src/app/layout.tsx`:
```typescript
// Add back before </body>
{recaptchaSiteKey && (
  <Script
    src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
    strategy="lazyOnload"
  />
)}
```

Then remove Script tags from individual form pages.

---

## Known Trade-offs

### Critical CSS Inlining

**Benefits:**
- Faster initial render
- Reduced render-blocking CSS

**Trade-offs:**
- Larger HTML payload (~5-10 KB inlined CSS)
- Accepts `pruneSource: false` to keep original CSS (safe mode)
- May duplicate some CSS (inlined + in CSS file)

**Verdict:** Acceptable trade-off for better performance

---

### Conditional reCAPTCHA Loading

**Benefits:**
- Eliminates forced reflows on 217+ pages
- Reduces JavaScript overhead
- Better performance on non-form pages

**Trade-offs:**
- Slightly larger form page bundles (+1-2 KB for Script tag)
- Must maintain list of pages that need reCAPTCHA
- If new forms added, must add Script tag to those pages

**Verdict:** Significant performance win, minor maintenance overhead

---

## Future Optimizations

### Not Yet Implemented

**1. Resource Hints for CSS:**
- Add `<link rel="preload" as="style" href="/path/to/critical.css">`
- Requires knowing CSS file hash at build time

**2. Font Subsetting:**
- Reduce Geist Sans/Mono to only used characters
- Would require font subsetting tool

**3. Service Worker Font Caching:**
- Cache Google Fonts in service worker
- Faster repeat visits

**4. HTTP/2 Server Push:**
- Push critical CSS to browser before requested
- Requires server-side configuration

---

## Success Criteria

### Deployment Successful If:

**Functional:**
- ✅ All form pages work (contact, employment, subcontractors)
- ✅ reCAPTCHA tokens generated successfully
- ✅ Form submissions complete without errors
- ✅ No console errors on any page

**Performance (PageSpeed Mobile):**
- ✅ "Render-blocking resources" reduced or eliminated
- ✅ "Forced reflow" warnings eliminated on non-form pages
- ✅ TBT (Total Blocking Time) improved
- ✅ FCP (First Contentful Paint) improved
- ✅ Mobile score +3 to +8 points

**Compatibility:**
- ✅ Modern browsers render correctly
- ✅ Critical CSS renders above-the-fold content
- ✅ Non-critical CSS loads without FOUC

---

## Monitoring

**What to watch for:**

**Error logs (PM2):**
```bash
ssh root@72.60.166.68 "pm2 logs burch-contracting --lines 50"
```

**Browser console errors:**
- Check form pages for reCAPTCHA errors
- Check non-form pages for missing CSS

**User reports:**
- Form submission failures
- Visual layout issues
- Missing styles on initial load

---

## Documentation

**Files Modified:**
```
✓ next.config.ts - Critical CSS extraction
✓ src/app/layout.tsx - Resource hints, removed global reCAPTCHA
✓ src/app/contact/page.tsx - Added conditional reCAPTCHA
✓ src/app/employment/direct-hire/page.tsx - Added conditional reCAPTCHA
✓ src/app/subcontractors/join/page.tsx - Added conditional reCAPTCHA
```

**Documentation Created:**
```
✓ PAGESPEED_RENDER_BLOCKING_FIX.md (this file)
✓ PAGESPEED_JS_OPTIMIZATION.md (previous optimization)
```

**Git Repository:**
```
Remote: https://github.com/cscottburch1/burch-contracting-fresh
Branch: main
Latest: b6b7813
```

---

## Contact & Support

**Deployment:** GitHub Copilot AI  
**Repository:** cscottburch1/burch-contracting-fresh  
**Production Server:** root@72.60.166.68  
**Domain:** https://burchcontracting.com

**Next Steps:**
1. Wait 5-10 minutes for CDN/browser caches to clear
2. Test all 3 form pages manually (submit test forms)
3. Run PageSpeed Insights on homepage (mobile)
4. Run PageSpeed Insights on /contact (mobile)
5. Compare before/after metrics
6. Document final performance gains

---

**Status:** ✅ DEPLOYED - READY FOR VERIFICATION
