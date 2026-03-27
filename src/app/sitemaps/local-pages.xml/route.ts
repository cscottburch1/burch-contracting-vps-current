import { trackedCostPaths, trackedLocalLandingPaths } from '@/lib/seo/searchConsoleTargets';
import { absoluteUrl } from '@/lib/seo/site';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const lastmod = new Date().toISOString();
  const urls = [...trackedLocalLandingPaths, ...trackedCostPaths]
    .map((path) => {
      const loc = escapeXml(absoluteUrl(path));
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>`;
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
