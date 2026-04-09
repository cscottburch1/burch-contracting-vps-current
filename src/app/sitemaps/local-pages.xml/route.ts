import { trackedCostPaths, trackedLocalLandingPaths } from '@/lib/seo/searchConsoleTargets';
import { absoluteUrl } from '@/lib/seo/site';
import { getFileLastModified } from '@/lib/seo/lastModified';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const [localDominanceLastmod, renovationLastmod, costLastmod] = await Promise.all([
    getFileLastModified('src/lib/seo/localDominanceData.ts'),
    getFileLastModified('src/lib/seo/renovationSeoData.ts'),
    getFileLastModified('src/lib/seo/costSeoData.ts'),
  ]);

  const localLastmod = renovationLastmod > localDominanceLastmod ? renovationLastmod : localDominanceLastmod;

  const urls = [
    ...trackedLocalLandingPaths.map((path) => ({ path, lastmod: localLastmod })),
    ...trackedCostPaths.map((path) => ({ path, lastmod: costLastmod })),
  ]
    .map((entry) => {
      const loc = escapeXml(absoluteUrl(entry.path));
      return `<url><loc>${loc}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
