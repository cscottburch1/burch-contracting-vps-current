import { trackedBlogPaths, trackedProjectPaths } from '@/lib/seo/searchConsoleTargets';
import { absoluteUrl } from '@/lib/seo/site';
import { getFileLastModified } from '@/lib/seo/lastModified';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const [blogLastmod, projectLastmod] = await Promise.all([
    getFileLastModified('src/lib/seo/localSeoData.ts'),
    getFileLastModified('src/lib/seo/projectSpotlightsData.ts'),
  ]);

  const urls = [
    ...trackedBlogPaths.map((path) => ({ path, lastmod: blogLastmod })),
    ...trackedProjectPaths.map((path) => ({ path, lastmod: projectLastmod })),
  ]
    .map((entry) => {
      const loc = escapeXml(absoluteUrl(entry.path));
      return `<url><loc>${loc}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.78</priority></url>`;
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
