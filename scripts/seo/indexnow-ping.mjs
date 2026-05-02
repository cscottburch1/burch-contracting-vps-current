import dotenv from 'dotenv';
import https from 'node:https';

dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env.local' });
dotenv.config();

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://burchcontracting.com').replace(/\/$/, '');
const indexNowKey = process.env.INDEXNOW_KEY || 'f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2';
const indexNowEndpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';

// Comprehensive URL list covering all important pages
const corePages = [
  `${siteUrl}/`,
  `${siteUrl}/about`,
  `${siteUrl}/contact`,
  `${siteUrl}/services`,
  `${siteUrl}/locations`,
  `${siteUrl}/projects`,
  `${siteUrl}/deck-builder`,
  `${siteUrl}/screened-porches`,
  `${siteUrl}/garage-builder`,
  `${siteUrl}/room-additions`,
  `${siteUrl}/kitchen-remodeling`,
  `${siteUrl}/bathroom-remodeling`,
  `${siteUrl}/basement-finishing`,
  `${siteUrl}/adu-builder`,
];

const serviceAreas = [
  `${siteUrl}/service-areas/simpsonville`,
  `${siteUrl}/service-areas/greenville`,
  `${siteUrl}/service-areas/fountain-inn`,
  `${siteUrl}/service-areas/mauldin`,
  `${siteUrl}/service-areas/five-forks`,
  `${siteUrl}/service-areas/greer`,
  `${siteUrl}/service-areas/laurens`,
  `${siteUrl}/service-areas/woodruff`,
  `${siteUrl}/service-areas/gray-court`,
];

const locationPages = [
  // Simpsonville
  `${siteUrl}/locations/kitchen-remodeling-simpsonville-sc`,
  `${siteUrl}/locations/bathroom-remodeling-simpsonville-sc`,
  `${siteUrl}/locations/deck-builder-simpsonville-sc`,
  `${siteUrl}/locations/screened-porches-simpsonville-sc`,
  `${siteUrl}/locations/garage-builder-simpsonville-sc`,
  `${siteUrl}/locations/room-additions-simpsonville-sc`,
  `${siteUrl}/locations/basement-finishing-simpsonville-sc`,
  // Fountain Inn
  `${siteUrl}/locations/kitchen-remodeling-fountain-inn-sc`,
  `${siteUrl}/locations/bathroom-remodeling-fountain-inn-sc`,
  `${siteUrl}/locations/deck-builder-fountain-inn-sc`,
  `${siteUrl}/locations/screened-porches-fountain-inn-sc`,
  `${siteUrl}/locations/garage-builder-fountain-inn-sc`,
  `${siteUrl}/locations/room-additions-fountain-inn-sc`,
  `${siteUrl}/locations/basement-finishing-fountain-inn-sc`,
  // Greenville
  `${siteUrl}/locations/kitchen-remodeling-greenville-sc`,
  `${siteUrl}/locations/bathroom-remodeling-greenville-sc`,
  `${siteUrl}/locations/deck-builder-greenville-sc`,
  `${siteUrl}/locations/screened-porches-greenville-sc`,
  `${siteUrl}/locations/garage-builder-greenville-sc`,
  `${siteUrl}/locations/room-additions-greenville-sc`,
  `${siteUrl}/locations/basement-finishing-greenville-sc`,
];

const calculators = [
  `${siteUrl}/calculator/decks`,
  `${siteUrl}/calculator/screened-porches`,
  `${siteUrl}/calculator/garages`,
  `${siteUrl}/calculator/room-additions`,
  `${siteUrl}/calculator/home-additions`,
  `${siteUrl}/calculator/kitchen-remodeling`,
  `${siteUrl}/calculator/bathroom-remodeling`,
  `${siteUrl}/calculator/basement-finishing`,
  `${siteUrl}/calculator/adus`,
  `${siteUrl}/calculator/decks-screened-porches`,
];

const costGuides = [
  `${siteUrl}/cost`,
  `${siteUrl}/cost/deck-cost-simpsonville-sc`,
  `${siteUrl}/cost/deck-cost-fountain-inn-sc`,
  `${siteUrl}/cost/deck-cost-greenville-sc`,
  `${siteUrl}/cost/screened-porch-cost-simpsonville-sc`,
  `${siteUrl}/cost/screened-porch-cost-fountain-inn-sc`,
  `${siteUrl}/cost/garage-cost-simpsonville-sc`,
  `${siteUrl}/cost/garage-construction-cost-greenville-sc`,
  `${siteUrl}/cost/garage-construction-cost-laurens-sc`,
  `${siteUrl}/cost/kitchen-remodeling-cost-simpsonville-sc`,
  `${siteUrl}/cost/kitchen-remodeling-cost-fountain-inn-sc`,
  `${siteUrl}/cost/kitchen-remodeling-cost-greenville-sc`,
  `${siteUrl}/cost/bathroom-remodeling-cost-simpsonville-sc`,
  `${siteUrl}/cost/bathroom-remodeling-cost-fountain-inn-sc`,
  `${siteUrl}/cost/basement-finishing-cost-simpsonville-sc`,
  `${siteUrl}/cost/basement-finishing-cost-fountain-inn-sc`,
  `${siteUrl}/cost/room-addition-cost-simpsonville-sc`,
  `${siteUrl}/cost/room-addition-cost-fountain-inn-sc`,
];

// Allow environment variable to override default URLs
const configuredUrls = (process.env.INDEXNOW_URLS || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const urlList = configuredUrls.length > 0 
  ? configuredUrls 
  : [...corePages, ...serviceAreas, ...locationPages, ...calculators, ...costGuides];

if (!indexNowKey) {
  console.log('IndexNow skipped: INDEXNOW_KEY is not configured.');
  process.exit(0);
}

const payload = JSON.stringify({
  host: new URL(siteUrl).hostname,
  key: indexNowKey,
  keyLocation: `${siteUrl}/${indexNowKey}.txt`,
  urlList,
});

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const req = https.request(
      {
        method: 'POST',
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || 443,
        path: `${target.pathname}${target.search}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode || 0, body: data });
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log(`📤 Submitting ${urlList.length} URLs to IndexNow...`);
    const result = await postJson(indexNowEndpoint, payload);
    if (result.statusCode >= 200 && result.statusCode < 300) {
      console.log(`✅ IndexNow submitted ${urlList.length} URL(s): HTTP ${result.statusCode}`);
      console.log(`   Core pages: ${corePages.length}`);
      console.log(`   Service areas: ${serviceAreas.length}`);
      console.log(`   Location pages: ${locationPages.length}`);
      console.log(`   Calculators: ${calculators.length}`);
      console.log(`   Cost guides: ${costGuides.length}`);
      process.exit(0);
    }

    console.error(`❌ IndexNow failed: HTTP ${result.statusCode}`);
    if (result.body) {
      console.error(result.body.slice(0, 1000));
    }
    process.exit(1);
  } catch (error) {
    console.error('❌ IndexNow request error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
