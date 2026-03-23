import dotenv from 'dotenv';
import https from 'node:https';

dotenv.config({ path: '.env.production' });
dotenv.config({ path: '.env.local' });

dotenv.config();

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://burchcontracting.com').replace(/\/$/, '');
const indexNowKey = process.env.INDEXNOW_KEY || '';
const indexNowEndpoint = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const configuredUrls = (process.env.INDEXNOW_URLS || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const defaultUrls = [
  `${siteUrl}/`,
  `${siteUrl}/employment`,
  `${siteUrl}/employment/direct-hire`,
  `${siteUrl}/services`,
  `${siteUrl}/contact`,
  `${siteUrl}/sitemap.xml`,
];

const urlList = Array.from(new Set(configuredUrls.length > 0 ? configuredUrls : defaultUrls));

if (!indexNowKey) {
  console.log('IndexNow skipped: INDEXNOW_KEY is not configured.');
  process.exit(0);
}

const payload = JSON.stringify({
  host: new URL(siteUrl).hostname,
  key: indexNowKey,
  keyLocation: `${siteUrl}/indexnow-key.txt`,
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
    const result = await postJson(indexNowEndpoint, payload);
    if (result.statusCode >= 200 && result.statusCode < 300) {
      console.log(`IndexNow submitted ${urlList.length} URL(s): HTTP ${result.statusCode}`);
      process.exit(0);
    }

    console.error(`IndexNow failed: HTTP ${result.statusCode}`);
    if (result.body) {
      console.error(result.body.slice(0, 1000));
    }
    process.exit(1);
  } catch (error) {
    console.error('IndexNow request error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();
