// Test production subcontractor form submission
const https = require('https');

const testData = {
  company_name: 'Test Company LLC',
  contact_name: 'John Test',
  email: 'test@testcompany.com',
  phone: '8641234567',
  address: '123 Test St',
  city: 'Greenville',
  state: 'SC',
  zip: '29601',
  business_type: 'LLC',
  years_in_business: 5,
  license_number: '',
  insurance_provider: '',
  insurance_expiry: '',
  specialties: ['Electrical', 'Plumbing'],
  website: '', // honeypot
  recaptchaToken: 'test_token_for_manual_review'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'burchcontracting.com',
  port: 443,
  path: '/api/subcontractors/apply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing production subcontractor form...');
console.log('URL: https://burchcontracting.com/api/subcontractors/apply');
console.log('Data:', JSON.stringify(testData, null, 2));
console.log('\nSending request...\n');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n✅ SUCCESS: Form submission worked!');
        if (json.queued) {
          console.log('⚠️  Application was queued (DB issue). Run sync-import script to import.');
        } else {
          console.log('✅ Application saved directly to database.');
        }
      } else {
        console.log('\n❌ FAILED: Form submission returned error');
      }
    } catch (e) {
      console.log(data);
      console.log('\n❌ Could not parse response as JSON');
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request Error: ${e.message}`);
});

req.write(postData);
req.end();
