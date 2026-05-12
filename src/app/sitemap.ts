import { MetadataRoute } from 'next';
import { blogPosts, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { localDominancePages, serviceHubPages } from '@/lib/seo/localDominanceData';
import { homeRenovationsHub as _homeRenovationsHub, renovationCityPages, renovationServicePages } from '@/lib/seo/renovationSeoData';
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
    // Core service hubs — primary authority pages
    {
      url: `${baseUrl}/additions`,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/garages`,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/outdoor-living`,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/outdoor-living/decks`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/outdoor-living/screened-porches`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/outdoor-living/covered-patios`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/remodeling`,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.93,
    },
    {
      url: `${baseUrl}/commercial-upfits`,
      lastModified: appLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.90,
    },
    // Core service area pages
    {
      url: `${baseUrl}/areas`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.90,
    },
    {
      url: `${baseUrl}/service-areas/simpsonville-sc`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/service-areas/mauldin-sc`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.87,
    },
    {
      url: `${baseUrl}/service-areas/fountain-inn-sc`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.87,
    },
    {
      url: `${baseUrl}/service-areas/woodruff-sc`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.86,
    },
    // Core conversion pages
    {
      url: `${baseUrl}/contact`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.92,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: projectSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.90,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/areas`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.87,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    // Legacy URLs - kept for redirects
    {
      url: `${baseUrl}/projects`,
      lastModified: projectSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.60,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: appLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.60,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: localSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.70,
    },
    {
      url: `${baseUrl}/cost`,
      lastModified: costSeoLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.70,
    },
  ];

  // Services pages (sub-service routes)
  const services = [
    'remodeling',
    'additions',
    'garages',
    'outdoor-living',
    'commercial-upfits',
  ];

  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: appLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const serviceHubRoutes = serviceHubPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.60,  // legacy pages — canonicalized to new authority pages
  }));

  const renovationServiceRoutes = renovationServicePages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: renovationSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.60,  // legacy pages — canonicalized to new authority pages
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
    'garages',
  ];

  const calculatorRoutes = calculators.map(calc => ({
    url: `${baseUrl}/calculator/${calc}`,
    lastModified: appLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Service areas — primary 4 targets only (others served via [city] dynamic route)
  const serviceAreas = [
    'simpsonville-sc',
    'mauldin-sc',
    'fountain-inn-sc',
    'woodruff-sc',
  ];

  const areaRoutes = serviceAreas.map(area => ({
    url: `${baseUrl}/service-areas/${area}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.87,
  }));

  const localServiceRoutes = serviceLandingPages.map((page) => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const localDominanceRoutes = localDominancePages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: localSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const renovationCityRoutes = renovationCityPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: renovationSeoLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
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
