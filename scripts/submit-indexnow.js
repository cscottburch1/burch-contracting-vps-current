#!/usr/bin/env node

/**
 * IndexNow Submission Utility
 * 
 * Command-line tool to submit URLs to IndexNow for immediate indexing
 * 
 * Usage:
 *   node submit-indexnow.js all              # Submit all pages
 *   node submit-indexnow.js locations        # Submit location pages only
 *   node submit-indexnow.js calculators      # Submit calculator pages only
 *   node submit-indexnow.js costGuides       # Submit cost guide pages only
 *   node submit-indexnow.js url https://...  # Submit specific URL
 * 
 * Or use npm scripts:
 *   npm run indexnow:all
 *   npm run indexnow:locations
 *   npm run indexnow:calculators
 *   npm run indexnow:cost-guides
 */

const https = require('https');
const http = require('http');

const API_ENDPOINT = 'https://burchcontracting.com/api/indexnow/submit';
// For local testing: const API_ENDPOINT = 'http://localhost:3000/api/indexnow/submit';

async function submitToAPI(payload) {
  const url = new URL(API_ENDPOINT);
  const protocol = url.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(payload)),
      },
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: result });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
IndexNow Submission Utility

Usage:
  node submit-indexnow.js <command> [options]

Commands:
  all              Submit all pages (locations, calculators, cost guides, core)
  locations        Submit all location-specific service pages
  calculators      Submit all cost calculator pages
  costGuides       Submit all cost guide pages
  url <url>        Submit a specific URL

Examples:
  node submit-indexnow.js all
  node submit-indexnow.js locations
  node submit-indexnow.js url https://burchcontracting.com/deck-builder
    `);
    process.exit(0);
  }

  const command = args[0];
  let payload;

  switch (command) {
    case 'all':
      payload = { preset: 'all' };
      console.log('📤 Submitting all pages to IndexNow...');
      break;

    case 'locations':
      payload = { preset: 'locations' };
      console.log('📍 Submitting location pages to IndexNow...');
      break;

    case 'calculators':
      payload = { preset: 'calculators' };
      console.log('🧮 Submitting calculator pages to IndexNow...');
      break;

    case 'costGuides':
    case 'cost-guides':
      payload = { preset: 'costGuides' };
      console.log('💰 Submitting cost guide pages to IndexNow...');
      break;

    case 'url':
      if (args.length < 2) {
        console.error('❌ Error: URL parameter required');
        console.log('Usage: node submit-indexnow.js url <url>');
        process.exit(1);
      }
      payload = { url: args[1] };
      console.log(`📤 Submitting URL to IndexNow: ${args[1]}`);
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run without arguments to see usage information');
      process.exit(1);
  }

  try {
    const { statusCode, data } = await submitToAPI(payload);

    if (statusCode === 200 && data.success) {
      console.log('✅ Success!');
      console.log(`   ${data.message}`);
      
      if (data.details) {
        console.log('\n📊 Details:');
        console.log(`   Locations: ${data.details.locations.count} URLs (${data.details.locations.success ? '✓' : '✗'})`);
        console.log(`   Calculators: ${data.details.calculators.count} URLs (${data.details.calculators.success ? '✓' : '✗'})`);
        console.log(`   Cost Guides: ${data.details.costGuides.count} URLs (${data.details.costGuides.success ? '✓' : '✗'})`);
        console.log(`   Core Pages: ${data.details.core.count} URLs (${data.details.core.success ? '✓' : '✗'})`);
        console.log(`\n   Total: ${data.totalUrls} URLs submitted`);
      }
    } else {
      console.error(`❌ Submission failed (HTTP ${statusCode})`);
      console.error(`   ${data.error || data.message || 'Unknown error'}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
