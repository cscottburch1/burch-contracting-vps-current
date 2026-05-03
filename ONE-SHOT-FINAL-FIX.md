# ONE-SHOT-FINAL-FIX.md

## Summary of Everything Fixed

### 1. robots.txt — Removed Invalid Host Directive
- **File**: `public/robots.txt`
- **Problem**: Bing Webmaster Tools flagged `Host: https://burchcontracting.com` as "Syntax not understood" (the `Host:` directive is non-standard and not recognized by Bing or Google).
- **Fix**: Removed the `# Host directive` comment and the `Host:` line. All AI crawler rules and Sitemap entries preserved.

### 2. /calculator → /calculators Hub (301 Redirect)
- **Files**: `next.config.ts`, `src/app/calculators/page.tsx`, `src/components/layout/Header.tsx`
- **Problem**: `/calculator` had no page (404), causing Bing to flag it as "Discovered but not crawled" / HTTP 4xx.
- **Fix**:
  - Created `src/app/calculators/page.tsx` — clean hub listing all 13 calculators with descriptions, icons, and links.
  - Added permanent 301 redirect in `next.config.ts`: `/calculator` → `/calculators`.
  - Updated `Header.tsx` desktop and mobile "Calculators" nav links to point to `/calculators`. Active highlighting still works for both `/calculators` and `/calculator/[specific]` routes.

### 3. Commercial Renovations Page Polish
- **File**: `src/app/commercial-renovations/page.tsx`, `src/components/calculators/CommercialMiniCalculator.tsx`
- **Problems**:
  - EEATSignals was rendering inside UniversalPageTemplate header (before hero), violating "exactly once, immediately after hero" requirement.
  - Calculator section was only a link button, not an embedded interactive tool.
- **Fixes**:
  - Set `showCredentials={false}` on `UniversalPageTemplate` to suppress the auto-rendered EEATSignals.
  - Added `<EEATSignals variant="compact" />` in its own Section immediately after the hero stats grid — exactly once.
  - Created `CommercialMiniCalculator` client component with interactive inputs (project type, sqft, finish level), instant price-range output, and links to the full `/calculator/commercial-renovations` page.
  - Replaced the old link-only CTA section with the embedded `<CommercialMiniCalculator />`.
  - Kept `UniversalPageTemplate` wrapper, correct breadcrumbs, single `AggregateRating` (ratingValue: "5.0", reviewCount: 12, bestRating: 5, worstRating: 1), and `ClickableCityGrid`.

### 4. Navigation
- **File**: `src/components/layout/Header.tsx`
- Commercial Renovations was already present in `serviceLinks` at line 37 — no change needed.
- Calculators dropdown parent link corrected from `/calculator` to `/calculators` (desktop + mobile).

---

## Deployment Steps

```bash
# 1. Commit all changes
git add public/robots.txt next.config.ts \
  src/app/calculators/page.tsx \
  src/components/calculators/CommercialMiniCalculator.tsx \
  src/app/commercial-renovations/page.tsx \
  src/components/layout/Header.tsx
git commit -m "fix: robots Host directive, /calculators hub, commercial-renovations EEAT + mini calc"

# 2. Push to main (triggers GitHub Actions deploy)
git push origin main

# 3. After deploy completes (~5 min), verify:
curl -I https://burchcontracting.com/calculator
# Expect: HTTP 301  Location: /calculators

curl -I https://burchcontracting.com/calculators
# Expect: HTTP 200

curl -s https://burchcontracting.com/robots.txt | grep -i host
# Expect: no output (Host line removed)

curl -s https://burchcontracting.com/commercial-renovations | grep -c "EEATSignals\|bbb\|BBB\|5\.0"
# Expect: trust signals present exactly once
```

---

## Verification Checklist

| Check | Tool | Expected Result |
|-------|------|-----------------|
| robots.txt syntax | Bing Webmaster Tools → Robots Tester | **0 errors** — no "Syntax not understood" warning |
| /calculator redirect | Bing URL Inspection OR `curl -I` | **HTTP 301** → `/calculators` |
| /calculators hub | Browser / Bing URL Inspection | **HTTP 200**, lists all 13 calculators |
| /commercial-renovations EEAT | Browser source / visual inspect | EEATSignals bar appears **once**, immediately below hero stats |
| /commercial-renovations calculator | Browser | Interactive price estimator renders, Calculate button produces range output |
| Schema — AggregateRating | Google Rich Results Test → `burchcontracting.com/commercial-renovations` | **One** AggregateRating: ratingValue 5.0, reviewCount 12 |
| Header nav — Calculators | Browser hover | Dropdown shows, parent link goes to `/calculators` |
| 35+ Years messaging | Grep / Visual | "35+ Years" present in page content and EEATSignals |
