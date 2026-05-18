import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/crm/', '/tradesmen/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/crm/', '/tradesmen/'],
        crawlDelay: 0,
      },
    ],
    host: 'https://burchcontracting.com',
    sitemap: [
      'https://burchcontracting.com/sitemap.xml',
      'https://burchcontracting.com/sitemaps/local-pages.xml',
      'https://burchcontracting.com/sitemaps/calculators.xml',
      'https://burchcontracting.com/sitemaps/content.xml',
    ],
  };
}
