const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'burch_user',
    password: '8Xh7$dP3mQ',
    database: 'burch_contracting'
  });

  // Create test subcontractor WITHOUT license, insurance, or insurance expiry
  const result = await conn.execute(
    `INSERT INTO subcontractors 
     (company_name, contact_name, email, phone, address, city, state, zip, 
      business_type, years_in_business, specialties, status, 
      license_number, insurance_provider, insurance_expiry, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NOW())`,
    [
      'Test Electrical LLC',
      'John Test',
      'johntest@electrical.com',
      '864-555-9999',
      '789 Test Ave',
      'Greenville',
      'SC',
      '29601',
      'llc',
      5,
      JSON.stringify(['Electrical', 'HVAC']),
      'pending'
    ]
  );

  console.log('✅ Test subcontractor created successfully!');
  console.log('   Company: Test Electrical LLC');
  console.log('   Contact: John Test');
  console.log('   Email: johntest@electrical.com');
  console.log('   Status: pending');
  console.log('   License: NULL (not provided)');
  console.log('   Insurance: NULL (not provided)');
  console.log('   Insurance Expiry: NULL (not provided)');

  await conn.end();
})();
