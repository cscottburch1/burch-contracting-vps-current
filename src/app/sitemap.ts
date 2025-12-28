import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://burchcontracting.com';
  const currentDate = new Date().toISOString();
  
  // Main pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Service pages - all your service offerings
  const services = [
    'general-handyman',
    'kitchen-remodels',
    'bathroom-remodels',
    'screened-porches',
    'decks-patios',
    'flooring',
    'painting',
    'carpentry',
    'drywall-repair',
    'tile-work',
    'home-repairs',
    'light-commercial'
  ];

  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Service areas - cities you serve
  const serviceAreas = [
    'simpsonville',
    'greenville',
    'mauldin',
    'fountain-inn',
    'greer',
    'five-forks',
    'woodruff'
  ];

  const areaRoutes = serviceAreas.map(area => ({
    url: `${baseUrl}/service-areas/${area}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...areaRoutes];
}
