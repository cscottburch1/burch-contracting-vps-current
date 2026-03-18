# Search Console Tracking Setup

This project now publishes segmented sitemap feeds for the new SEO targets:

- `https://burchcontracting.com/sitemaps/local-pages.xml`
- `https://burchcontracting.com/sitemaps/calculators.xml`

## Submit in Google Search Console

1. Open the `burchcontracting.com` property.
2. Go to **Indexing > Sitemaps**.
3. Submit:
   - `sitemap.xml`
   - `sitemaps/local-pages.xml`
   - `sitemaps/calculators.xml`

## Page Filters for Performance Reports

Use these page filters in **Performance > Search results**:

- Local landing pages: `Page contains /locations/`
- Calculator pages: `Page contains /calculator/`

## Conversion Signals (GA)

The site now emits these client events through `gtag`/`dataLayer`:

- `local_landing_page_view`
- `calculator_page_view`
- `call_click`
- `estimate_intent_click`
- `calculator_open_click`

Recommended report setup:

1. In GA4, mark `call_click` and `estimate_intent_click` as key events.
2. Build an exploration with dimensions:
   - `page_path`
   - `event_name`
3. Filter `page_path` by `/locations/` and `/calculator/` to compare leads by SEO page group.
