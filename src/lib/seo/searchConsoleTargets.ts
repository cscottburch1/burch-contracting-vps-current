import { blogPosts, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';
import { localDominancePages, serviceHubPages } from '@/lib/seo/localDominanceData';
import { homeRenovationsHub, renovationCityPages, renovationServicePages } from '@/lib/seo/renovationSeoData';

export const trackedLocalLandingPaths = Array.from(new Set([
  ...serviceLandingPages.map((page) => `/locations/${page.slug}`),
  ...localDominancePages.map((page) => page.path),
  ...serviceHubPages.map((page) => page.path),
  homeRenovationsHub.path,
  ...renovationServicePages.map((page) => page.path),
  ...renovationCityPages.map((page) => page.path),
]));
export const trackedCostPaths = costLandingPages.map((page) => `/cost/${page.slug}`);
export const trackedBlogPaths = blogPosts.map((post) => `/blog/${post.slug}`);
export const trackedProjectPaths = projectSpotlights.map((project) => `/projects/${project.slug}`);

export const trackedCalculatorPaths = [
  '/calculator/kitchen-remodeling',
  '/calculator/bathroom-remodeling',
  '/calculator/room-additions',
  '/calculator/decks-screened-porches',
  '/calculator/basement-finishing',
];
