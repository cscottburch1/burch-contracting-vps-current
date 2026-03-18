import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/crm/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/portal/', '/api/', '/crm/'],
        crawlDelay: 0,
      },
    ],
    host: 'https://burchcontracting.com',
    sitemap: 'https://burchcontracting.com/sitemap.xml',
  };
}
