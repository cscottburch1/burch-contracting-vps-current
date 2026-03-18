import { serviceLandingPages } from '@/lib/seo/localSeoData';

export const trackedLocalLandingPaths = serviceLandingPages.map((page) => `/locations/${page.slug}`);

export const trackedCalculatorPaths = [
  '/calculator/kitchen-remodeling',
  '/calculator/bathroom-remodeling',
  '/calculator/room-additions',
  '/calculator/decks-screened-porches',
  '/calculator/basement-finishing',
];
