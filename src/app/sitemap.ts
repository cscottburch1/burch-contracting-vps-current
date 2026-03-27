import { MetadataRoute } from 'next';
import { blogPosts, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';

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
    {
      url: `${baseUrl}/locations`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/cost`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.83,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/employment`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/employment/direct-hire`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Service pages - all your service offerings
  const services = [
    'handyman',
    'remodeling',
    'additions',
    'basement'
  ];

  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
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
    lastModified: currentDate,
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
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const localServiceRoutes = serviceLandingPages.map((page) => ({
    url: `${baseUrl}/locations/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  const costRoutes = costLandingPages.map((page) => ({
    url: `${baseUrl}/cost/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.82,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.74,
  }));

  const projectRoutes = projectSpotlights.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.76,
  }));

  return [...staticRoutes, ...serviceRoutes, ...calculatorRoutes, ...areaRoutes, ...localServiceRoutes, ...costRoutes, ...blogRoutes, ...projectRoutes];
}
