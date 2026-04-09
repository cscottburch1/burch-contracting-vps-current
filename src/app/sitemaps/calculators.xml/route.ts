import { trackedCalculatorPaths } from '@/lib/seo/searchConsoleTargets';
import { absoluteUrl } from '@/lib/seo/site';
import { getFileLastModified } from '@/lib/seo/lastModified';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const lastmod = await getFileLastModified('src/lib/seo/searchConsoleTargets.ts');
  const urls = trackedCalculatorPaths
    .map((path) => {
      const loc = escapeXml(absoluteUrl(path));
      return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
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
