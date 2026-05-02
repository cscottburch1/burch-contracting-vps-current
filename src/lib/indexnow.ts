/**
 * IndexNow Protocol Implementation
 * 
 * Submits URLs to IndexNow API for immediate indexing by:
 * - Bing/Microsoft Copilot
 * - Yandex
 * - Seznam.cz
 * - Naver
 * 
 * Documentation: https://www.indexnow.org/documentation
 */

import { siteConfig } from '@/lib/seo/site';

const INDEXNOW_KEY = 'f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

// Alternative endpoints (all share the same protocol):
// - https://www.bing.com/indexnow
// - https://yandex.com/indexnow
// - https://api.indexnow.org/indexnow

export interface IndexNowSubmission {
  url?: string;
  urlList?: string[];
}

/**
 * Submit single or multiple URLs to IndexNow for immediate indexing
 */
export async function submitToIndexNow({ url, urlList }: IndexNowSubmission): Promise<{
  success: boolean;
  statusCode?: number;
  error?: string;
  urlCount?: number;
}> {
  try {
    // Validate input
    if (!url && (!urlList || urlList.length === 0)) {
      return {
        success: false,
        error: 'No URLs provided for submission',
      };
    }

    // Prepare URLs
    const urls = url ? [url] : urlList || [];
    const absoluteUrls = urls.map(u => {
      // If already absolute, use as-is; otherwise make absolute
      if (u.startsWith('http://') || u.startsWith('https://')) {
        return u;
      }
      return new URL(u, siteConfig.siteUrl).toString();
    });

    // IndexNow accepts up to 10,000 URLs per request, but we'll batch at 100 for safety
    const batchSize = 100;
    const batches: string[][] = [];
    
    for (let i = 0; i < absoluteUrls.length; i += batchSize) {
      batches.push(absoluteUrls.slice(i, i + batchSize));
    }

    // Submit each batch
    const results = await Promise.all(
      batches.map(batch => submitBatch(batch))
    );

    // Check if all batches succeeded
    const allSucceeded = results.every(r => r.success);
    const totalUrls = absoluteUrls.length;

    if (allSucceeded) {
      return {
        success: true,
        statusCode: 200,
        urlCount: totalUrls,
      };
    } else {
      const failedBatches = results.filter(r => !r.success);
      return {
        success: false,
        error: `${failedBatches.length} of ${batches.length} batches failed`,
        urlCount: totalUrls,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit a single batch of URLs
 */
async function submitBatch(urls: string[]): Promise<{ success: boolean; statusCode?: number }> {
  try {
    const payload = {
      host: new URL(siteConfig.siteUrl).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${siteConfig.siteUrl}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns:
    // 200 - OK (URLs received)
    // 202 - Accepted (URLs received, processing)
    // 400 - Bad request (invalid format)
    // 403 - Forbidden (invalid key)
    // 422 - Unprocessable Entity (invalid URLs)
    // 429 - Too Many Requests (rate limited)

    const success = response.status === 200 || response.status === 202;
    
    if (!success) {
      console.error(`IndexNow submission failed: ${response.status} ${response.statusText}`);
    }

    return {
      success,
      statusCode: response.status,
    };
  } catch (error) {
    console.error('IndexNow batch submission error:', error);
    return {
      success: false,
    };
  }
}

/**
 * Submit all location pages for indexing
 */
export async function submitLocationPages(): Promise<{
  success: boolean;
  urlCount: number;
  error?: string;
}> {
  const locationUrls = [
    // Service area pages
    '/service-areas/simpsonville',
    '/service-areas/greenville',
    '/service-areas/fountain-inn',
    '/service-areas/mauldin',
    '/service-areas/five-forks',
    '/service-areas/greer',
    '/service-areas/laurens',
    '/service-areas/woodruff',
    '/service-areas/gray-court',
    
    // Location-specific service pages (examples - expand as needed)
    '/locations/kitchen-remodeling-simpsonville-sc',
    '/locations/bathroom-remodeling-simpsonville-sc',
    '/locations/deck-builder-simpsonville-sc',
    '/locations/screened-porches-simpsonville-sc',
    '/locations/garage-builder-simpsonville-sc',
    '/locations/room-additions-simpsonville-sc',
    '/locations/basement-finishing-simpsonville-sc',
    
    '/locations/kitchen-remodeling-fountain-inn-sc',
    '/locations/bathroom-remodeling-fountain-inn-sc',
    '/locations/deck-builder-fountain-inn-sc',
    '/locations/screened-porches-fountain-inn-sc',
    '/locations/garage-builder-fountain-inn-sc',
    '/locations/room-additions-fountain-inn-sc',
    '/locations/basement-finishing-fountain-inn-sc',
    
    '/locations/kitchen-remodeling-greenville-sc',
    '/locations/bathroom-remodeling-greenville-sc',
    '/locations/deck-builder-greenville-sc',
    '/locations/screened-porches-greenville-sc',
    '/locations/garage-builder-greenville-sc',
    '/locations/room-additions-greenville-sc',
    '/locations/basement-finishing-greenville-sc',
  ];

  const result = await submitToIndexNow({ urlList: locationUrls });
  
  return {
    success: result.success,
    urlCount: result.urlCount || 0,
    error: result.error,
  };
}

/**
 * Submit all cost calculator pages for indexing
 */
export async function submitCalculatorPages(): Promise<{
  success: boolean;
  urlCount: number;
  error?: string;
}> {
  const calculatorUrls = [
    '/calculator/decks',
    '/calculator/screened-porches',
    '/calculator/garages',
    '/calculator/room-additions',
    '/calculator/home-additions',
    '/calculator/kitchen-remodeling',
    '/calculator/bathroom-remodeling',
    '/calculator/basement-finishing',
    '/calculator/adus',
    '/calculator/decks-screened-porches',
  ];

  const result = await submitToIndexNow({ urlList: calculatorUrls });
  
  return {
    success: result.success,
    urlCount: result.urlCount || 0,
    error: result.error,
  };
}

/**
 * Submit all cost guide pages for indexing
 */
export async function submitCostGuidePages(): Promise<{
  success: boolean;
  urlCount: number;
  error?: string;
}> {
  const costGuideUrls = [
    '/cost',
    '/cost/deck-cost-simpsonville-sc',
    '/cost/deck-cost-fountain-inn-sc',
    '/cost/deck-cost-greenville-sc',
    '/cost/screened-porch-cost-simpsonville-sc',
    '/cost/screened-porch-cost-fountain-inn-sc',
    '/cost/garage-cost-simpsonville-sc',
    '/cost/garage-construction-cost-greenville-sc',
    '/cost/garage-construction-cost-laurens-sc',
    '/cost/kitchen-remodeling-cost-simpsonville-sc',
    '/cost/kitchen-remodeling-cost-fountain-inn-sc',
    '/cost/kitchen-remodeling-cost-greenville-sc',
    '/cost/bathroom-remodeling-cost-simpsonville-sc',
    '/cost/bathroom-remodeling-cost-fountain-inn-sc',
    '/cost/basement-finishing-cost-simpsonville-sc',
    '/cost/basement-finishing-cost-fountain-inn-sc',
    '/cost/room-addition-cost-simpsonville-sc',
    '/cost/room-addition-cost-fountain-inn-sc',
  ];

  const result = await submitToIndexNow({ urlList: costGuideUrls });
  
  return {
    success: result.success,
    urlCount: result.urlCount || 0,
    error: result.error,
  };
}

/**
 * Submit all important pages in bulk
 */
export async function submitAllPages(): Promise<{
  success: boolean;
  totalUrls: number;
  results: {
    locations: { success: boolean; count: number };
    calculators: { success: boolean; count: number };
    costGuides: { success: boolean; count: number };
    core: { success: boolean; count: number };
  };
}> {
  const corePages = [
    '/',
    '/about',
    '/contact',
    '/services',
    '/locations',
    '/projects',
    '/deck-builder',
    '/screened-porches',
    '/garage-builder',
    '/room-additions',
    '/kitchen-remodeling',
    '/bathroom-remodeling',
    '/basement-finishing',
    '/adu-builder',
  ];

  const [locations, calculators, costGuides, core] = await Promise.all([
    submitLocationPages(),
    submitCalculatorPages(),
    submitCostGuidePages(),
    submitToIndexNow({ urlList: corePages }),
  ]);

  return {
    success: locations.success && calculators.success && costGuides.success && core.success,
    totalUrls: locations.urlCount + calculators.urlCount + costGuides.urlCount + (core.urlCount || 0),
    results: {
      locations: { success: locations.success, count: locations.urlCount },
      calculators: { success: calculators.success, count: calculators.urlCount },
      costGuides: { success: costGuides.success, count: costGuides.urlCount },
      core: { success: core.success, count: core.urlCount || 0 },
    },
  };
}
