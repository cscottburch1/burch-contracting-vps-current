// Simple script to run the project tracker migration
const https = require('https');

const options = {
  hostname: 'burchcontracting.com',
  port: 3000,
  path: '/api/admin/migrate-project-tracker',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  rejectUnauthorized: false
};

console.log('Running project tracker migration...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    try {
      const result = JSON.parse(data);
      console.log('\n✅ Migration result:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
