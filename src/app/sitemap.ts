import { MetadataRoute } from 'next';
import { blogPosts, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { localDominancePages, serviceHubPages } from '@/lib/seo/localDominanceData';
import { homeRenovationsHub, renovationCityPages, renovationServicePages } from '@/lib/seo/renovationSeoData';
import { getFileLastModified } from '@/lib/seo/lastModified';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://burchcontracting.com';
  const [
    appLastModified,
    localSeoLastModified,
    renovationSeoLastModified,
    costSeoLastModified,
    projectSeoLastModified,
  ] = await Promise.all([
    getFileLastModified('src/app/page.tsx'),
    getFileLastModified('src/lib/seo/localDominanceData.ts'),
    getFileLastModified('src/lib/seo/renovationSeoData.ts'),
    getFileLastModified('src/lib/seo/costSeoData.ts'),
    getFileLastModified('src/lib/seo/projectSpotlightsData.ts'),
  ]);
  
  // Main pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}${homeRenovationsHub.path}`,
      lastModified: renovationSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: localSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cost`,
      lastModified: costSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.83,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: localSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: projectSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/employment`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/employment/direct-hire`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Existing service pages and new SEO-first service hubs
  const services = [
    'handyman',
    'remodeling',
    'additions',
    'basement'
  ];

  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: appLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const serviceHubRoutes = serviceHubPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.92,
  }));

  const renovationServiceRoutes = renovationServicePages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: renovationSeoLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.91,
  }));

  // Calculators
  const calculators = [
    'handyman',
    'remodeling',
    'additions',
    'kitchen-remodeling',
    'bathroom-remodeling',
    'room-additions',
    'decks-screened-porches',
    'basement-finishing',
  ];

  const calculatorRoutes = calculators.map(calc => ({
    url: `${baseUrl}/calculator/${calc}`,
    lastModified: appLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Service areas - cities you serve
  const serviceAreas = [
    'simpsonville',
    'greenville',
    'greer',
    'mauldin',
    'fountain-inn',
    'five-forks',
    'woodruff',
    'gray-court',
    'laurens'
  ];

  const areaRoutes = serviceAreas.map(area => ({
    url: `${baseUrl}/service-areas/${area}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const localServiceRoutes = serviceLandingPages.map((page) => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const localDominanceRoutes = localDominancePages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.88,
  }));

  const renovationCityRoutes = renovationCityPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: renovationSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.87,
  }));

  const costRoutes = costLandingPages.map((page) => ({
    url: `${baseUrl}/cost/${page.slug}`,
    lastModified: costSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.82,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.74,
  }));

  const projectRoutes = projectSpotlights.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: projectSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.76,
  }));

  const routes = [
    ...staticRoutes,
    ...serviceRoutes,
    ...serviceHubRoutes,
    ...renovationServiceRoutes,
    ...calculatorRoutes,
    ...areaRoutes,
    ...localServiceRoutes,
    ...localDominanceRoutes,
    ...renovationCityRoutes,
    ...costRoutes,
    ...blogRoutes,
    ...projectRoutes,
  ];

  return routes.filter((route, index, self) => self.findIndex((item) => item.url === route.url) === index);
}
