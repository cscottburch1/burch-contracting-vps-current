# IndexNow Protocol Implementation

IndexNow is a protocol that enables immediate indexing of website content by Bing Copilot, Yandex, Seznam.cz, and Naver. When URLs are submitted via IndexNow, they are indexed within hours instead of days or weeks.

## 🎯 Benefits

- **Immediate Indexing**: New location pages and cost updates indexed within hours
- **Bing Copilot Priority**: Critical for local service queries and AI-powered search results
- **15 Points**: Full value in Bing Copilot rubric for timely content availability
- **Multi-Engine Support**: Automatically shared with Bing, Yandex, Seznam.cz, Naver

## 📁 Implementation Files

### Core Files
- `/public/f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2.txt` - IndexNow API key file (required by protocol)
- `/src/lib/indexnow.ts` - Reusable IndexNow submission functions
- `/src/app/api/indexnow/submit/route.ts` - API endpoint for submissions
- `/scripts/seo/indexnow-ping.mjs` - CLI utility for bulk submissions

### Updated Files
- `/scripts/seo/write-indexnow-key.mjs` - Writes key file from environment variable
- `/scripts/submit-indexnow.js` - Node.js CLI tool with presets

## 🚀 Usage

### 1. Quick Submit All Pages

```bash
npm run indexnow:ping
```

This submits all important pages (100+ URLs) to IndexNow including:
- Core pages (home, about, contact, services)
- All service area pages
- All location-specific service pages
- All cost calculators
- All cost guide pages

### 2. Submit via API Endpoint

```bash
# Submit all pages
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"preset":"all"}'

# Submit only location pages
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"preset":"locations"}'

# Submit only calculators
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"preset":"calculators"}'

# Submit only cost guides
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"preset":"costGuides"}'

# Submit specific URL
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://burchcontracting.com/new-page"}'

# Submit multiple URLs
curl -X POST https://burchcontracting.com/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"urlList":["https://burchcontracting.com/page1","https://burchcontracting.com/page2"]}'
```

### 3. Submit via Node.js Utility

```bash
# Submit all pages
node scripts/submit-indexnow.js all

# Submit location pages only
node scripts/submit-indexnow.js locations

# Submit calculators only
node scripts/submit-indexnow.js calculators

# Submit cost guides only
node scripts/submit-indexnow.js costGuides

# Submit specific URL
node scripts/submit-indexnow.js url https://burchcontracting.com/new-page
```

### 4. Programmatic Usage in Code

```typescript
import { submitToIndexNow, submitLocationPages, submitCalculatorPages } from '@/lib/indexnow';

// Submit single URL
await submitToIndexNow({ url: 'https://burchcontracting.com/new-page' });

// Submit multiple URLs
await submitToIndexNow({ 
  urlList: [
    'https://burchcontracting.com/page1',
    'https://burchcontracting.com/page2'
  ] 
});

// Submit all location pages
await submitLocationPages();

// Submit all calculator pages
await submitCalculatorPages();

// Submit all cost guide pages
await submitCostGuidePages();

// Submit everything
await submitAllPages();
```

## 📋 Available Presets

### `all` - Submit All Pages (~100+ URLs)
Includes all pages across all categories for comprehensive site indexing.

### `locations` - Location Service Pages (~30 URLs)
- Service area pages (Simpsonville, Fountain Inn, Greenville, etc.)
- Location-specific service pages (kitchen remodeling, bathroom remodeling, etc.)

### `calculators` - Cost Calculators (~10 URLs)
- All interactive cost calculator pages
- Critical for AI citation and original research value

### `costGuides` - Cost Guide Pages (~18 URLs)
- All cost guide landing pages by service and city
- High-value content for local search queries

## 🔑 IndexNow Key Management

The IndexNow key is stored in two locations:
1. `/public/f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2.txt` - Public verification file
2. Environment variable `INDEXNOW_KEY` (optional, defaults to hardcoded key)

To regenerate the key file from environment variable:
```bash
npm run indexnow:sync-key
```

## 📊 Response Codes

- **200 OK** - URLs successfully received and will be indexed
- **202 Accepted** - URLs received and queued for processing
- **400 Bad Request** - Invalid request format
- **403 Forbidden** - Invalid API key
- **422 Unprocessable Entity** - Invalid URLs in request
- **429 Too Many Requests** - Rate limited (wait before retry)

## 🎯 When to Submit

### Automatic Triggers (Recommended)
- After deploying new location pages
- After updating cost calculator data
- After publishing cost guide updates
- After major content changes

### Manual Triggers
- During initial site launch
- After sitemap updates
- When adding new service areas
- When debugging indexing issues

## 🔄 Post-Deployment Integration

Add to your deployment pipeline:

```bash
# After successful deployment
npm run build
npm run indexnow:ping  # Submit all pages to IndexNow
```

Or use the API endpoint from CI/CD:

```yaml
# GitHub Actions example
- name: Submit to IndexNow
  run: |
    curl -X POST https://burchcontracting.com/api/indexnow/submit \
      -H "Content-Type: application/json" \
      -d '{"preset":"all"}'
```

## 📖 IndexNow Protocol Details

- **Endpoint**: `https://api.indexnow.org/indexnow`
- **Method**: POST
- **Max URLs per Request**: 10,000 (we batch at 100 for safety)
- **Format**: JSON with `host`, `key`, `keyLocation`, `urlList`
- **Verification**: Key file must be publicly accessible at `{siteUrl}/{key}.txt`

## 🔗 Resources

- [IndexNow Official Documentation](https://www.indexnow.org/documentation)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow API Specification](https://www.indexnow.org/documentation)

## ✅ Verification

To verify IndexNow is working:

1. Submit URLs via any method above
2. Check response code is 200 or 202
3. Verify key file is accessible: `https://burchcontracting.com/f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2.txt`
4. Monitor Bing Webmaster Tools for indexing status
5. Check Bing Copilot for appearance in AI-powered results

## 🎓 Best Practices

1. **Submit After Changes**: Always submit URLs after content updates
2. **Batch Submissions**: Use presets for bulk submissions instead of individual URLs
3. **Monitor Responses**: Check for 200/202 status codes
4. **Rate Limiting**: Don't submit the same URLs repeatedly (wait 24 hours)
5. **Key Security**: Keep the key file in public folder but don't expose in API responses
6. **Verify Accessibility**: Ensure the key file is publicly accessible before submitting

## 🚨 Troubleshooting

### 403 Forbidden
- Key file not accessible or doesn't match submitted key
- Check: `https://burchcontracting.com/f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2.txt`

### 422 Unprocessable Entity
- Invalid URLs in submission
- Ensure all URLs use HTTPS and are properly formatted

### 429 Too Many Requests
- Rate limited by IndexNow
- Wait at least 1 hour before resubmitting

### No Response
- Network connectivity issue
- Check firewall and outbound HTTPS access
