const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

const pagesToTest = {
  public: [
    '/',
    '/services',
    '/services/handyman',
    '/services/remodeling',
    '/services/additions',
    '/services/basement',
    '/service-areas/greenville',
    '/service-areas/simpsonville',
    '/contact',
    '/subcontractors/join',
    '/calculator/handyman',
    '/calculator/remodeling',
    '/calculator/additions',
  ],
  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/projects',
    '/admin/customers',
    '/admin/subcontractors',
    '/admin/invoices',
    '/admin/messages',
    '/admin/proposals',
    '/admin/crm',
    '/admin/settings',
    '/admin/tradesmen',
    '/admin/tools',
    '/admin/tools/banners',
    '/admin/tools/notifications',
  ],
  portal: [
    '/portal',
    '/portal/dashboard',
    '/portal/projects',
    '/portal/messages',
    '/portal/forgot-password',
  ],
  tradesman: [
    '/tradesmen',
    '/tradesmen/dashboard',
    '/tradesmen/tasks',
    '/tradesmen/materials',
    '/tradesmen/time',
    '/tradesmen/reports',
    '/tradesmen/issues',
    '/tradesmen/profile',
  ],
};

async function testPage(page, url, section) {
  const result = {
    url,
    section,
    status: null,
    errors: [],
    consoleErrors: [],
    networkErrors: [],
    loadTime: 0,
  };

  const startTime = Date.now();
  const pageErrors = [];
  const pageConsole = [];
  const networkFails = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      pageConsole.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  page.on('requestfailed', request => {
    networkFails.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'Unknown',
    });
  });

  try {
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    result.status = response ? response.status() : null;
    result.loadTime = Date.now() - startTime;
    result.errors = pageErrors;
    result.consoleErrors = pageConsole;
    result.networkErrors = networkFails;

    const bodyText = await page.textContent('body').catch(() => '');
    
    if (bodyText.includes('404') || bodyText.includes('Not Found')) {
      result.errors.push('Page shows 404 or Not Found');
    }
    if (bodyText.includes('500') || bodyText.includes('Internal Server Error')) {
      result.errors.push('Page shows 500 or Internal Server Error');
    }
    if (bodyText.includes('Unhandled Runtime Error') || bodyText.includes('Application error')) {
      result.errors.push('Page shows runtime error');
    }

    if (result.errors.length > 0 || result.consoleErrors.length > 0 || result.networkErrors.length > 0) {
      const failDir = path.join(__dirname, '..', 'tmp', 'test-failures');
      if (!fs.existsSync(failDir)) {
        fs.mkdirSync(failDir, { recursive: true });
      }
      const screenshotPath = path.join(failDir, `${section}_${url.replace(/[^a-z0-9]/gi, '_')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
    }

  } catch (error) {
    result.errors.push(`Failed to load: ${error.message}`);
  }

  // Remove listeners
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.removeAllListeners('requestfailed');

  return result;
}

async function runTests() {
  console.log('🔍 COMPREHENSIVE WEBSITE TEST\n');
  console.log('='.repeat(60));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    totalPages: 0,
    passedPages: 0,
    failedPages: 0,
    tests: [],
  };

  for (const [section, urls] of Object.entries(pagesToTest)) {
    console.log(`\n📋 Testing ${section} section...`);
    
    for (const url of urls) {
      results.totalPages++;
      const fullUrl = `${BASE_URL}${url}`;
      
      process.stdout.write(`  ${url.padEnd(35)}... `);
      
      const result = await testPage(page, fullUrl, section);
      results.tests.push(result);

      const hasFailed = result.errors.length > 0 || result.networkErrors.length > 0 || 
                        result.status >= 400 || result.status === null;

      if (hasFailed) {
        results.failedPages++;
        console.log(`❌ FAILED (${result.status || 'N/A'})`);
        if (result.errors.length > 0) {
          result.errors.forEach(err => console.log(`      Error: ${err}`));
        }
        if (result.networkErrors.length > 0) {
          result.networkErrors.slice(0, 3).forEach(err => console.log(`      Network: ${err.url.substring(0, 60)}...`));
        }
      } else {
        results.passedPages++;
        console.log(`✅ OK (${result.loadTime}ms)`);
      }
    }
  }

  await browser.close();

  const reportPath = path.join(__dirname, '..', 'tmp', 'comprehensive-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Pages: ${results.totalPages}`);
  console.log(`Passed: ${results.passedPages} ✅`);
  console.log(`Failed: ${results.failedPages} ❌`);
  console.log(`Success Rate: ${((results.passedPages / results.totalPages) * 100).toFixed(1)}%`);
  console.log(`\nReport: ${reportPath}`);

  if (results.failedPages > 0) {
    console.log(`\n❌ FAILED PAGES:`);
    results.tests.filter(t => t.errors.length > 0 || t.networkErrors.length > 0 || t.status >= 400 || t.status === null)
      .forEach(t => {
        console.log(`\n  ${t.url}`);
        console.log(`    Section: ${t.section} | Status: ${t.status || 'N/A'}`);
        if (t.errors.length > 0) console.log(`    Errors: ${t.errors.length}`);
        if (t.consoleErrors.length > 0) console.log(`    Console: ${t.consoleErrors.length}`);
        if (t.networkErrors.length > 0) console.log(`    Network: ${t.networkErrors.length}`);
      });
  }

  process.exit(results.failedPages > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
