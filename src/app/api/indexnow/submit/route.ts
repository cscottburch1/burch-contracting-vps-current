import { NextResponse } from 'next/server';
import { submitToIndexNow, submitAllPages, submitLocationPages, submitCalculatorPages, submitCostGuidePages } from '@/lib/indexnow';

/**
 * API Route: /api/indexnow/submit
 * 
 * Submits URLs to IndexNow for immediate indexing by Bing Copilot and other search engines
 * 
 * POST with JSON body:
 * - { "url": "https://burchcontracting.com/page" } - single URL
 * - { "urlList": ["url1", "url2"] } - multiple URLs
 * - { "preset": "all" | "locations" | "calculators" | "costGuides" } - predefined sets
 * 
 * Security: Should be protected by API key or admin authentication in production
 */

export async function POST(request: Request) {
  try {
    // Optional: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.INDEXNOW_API_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { url, urlList, preset } = body;

    let result;

    // Handle preset submissions
    if (preset) {
      switch (preset) {
        case 'all':
          result = await submitAllPages();
          return NextResponse.json({
            success: result.success,
            message: `Submitted ${result.totalUrls} URLs across all categories`,
            details: result.results,
          });

        case 'locations':
          result = await submitLocationPages();
          return NextResponse.json({
            success: result.success,
            message: `Submitted ${result.urlCount} location pages`,
            error: result.error,
          });

        case 'calculators':
          result = await submitCalculatorPages();
          return NextResponse.json({
            success: result.success,
            message: `Submitted ${result.urlCount} calculator pages`,
            error: result.error,
          });

        case 'costGuides':
          result = await submitCostGuidePages();
          return NextResponse.json({
            success: result.success,
            message: `Submitted ${result.urlCount} cost guide pages`,
            error: result.error,
          });

        default:
          return NextResponse.json(
            { error: `Unknown preset: ${preset}` },
            { status: 400 }
          );
      }
    }

    // Handle custom URL submission
    if (url || urlList) {
      result = await submitToIndexNow({ url, urlList });
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: `Successfully submitted ${result.urlCount} URL(s) to IndexNow`,
          statusCode: result.statusCode,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error,
          statusCode: result.statusCode,
        }, { status: 500 });
      }
    }

    // No valid input provided
    return NextResponse.json(
      { error: 'Missing required parameters: url, urlList, or preset' },
      { status: 400 }
    );

  } catch (error) {
    console.error('IndexNow API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing/status
 */
export async function GET() {
  return NextResponse.json({
    message: 'IndexNow submission endpoint',
    usage: {
      method: 'POST',
      body: {
        singleUrl: { url: 'https://burchcontracting.com/page' },
        multipleUrls: { urlList: ['url1', 'url2'] },
        presets: {
          all: { preset: 'all' },
          locations: { preset: 'locations' },
          calculators: { preset: 'calculators' },
          costGuides: { preset: 'costGuides' },
        },
      },
    },
    keyLocation: 'https://burchcontracting.com/f8b5a3e7c4d1f9a2e8b6d3c7f4a1e9b2.txt',
  });
}
