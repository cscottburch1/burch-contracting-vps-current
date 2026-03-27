import { blogPosts, serviceLandingPages } from '@/lib/seo/localSeoData';
import { costLandingPages } from '@/lib/seo/costSeoData';
import { projectSpotlights } from '@/lib/seo/projectSpotlightsData';

export const trackedLocalLandingPaths = serviceLandingPages.map((page) => `/locations/${page.slug}`);
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
