const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testContactForm() {
  console.log('🧪 Testing contact form database...\n');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    // Test 1: Check if table exists
    console.log('1️⃣ Checking if contact_leads table exists...');
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_leads'"
    );
    
    if (tables.length === 0) {
      console.log('   ❌ Table does not exist!\n');
      console.log('   👉 Run: node scripts/fix-contact-leads.js\n');
      console.log('   OR visit: http://localhost:3000/admin/fix-contact-leads\n');
      process.exit(1);
    }
    console.log('   ✅ Table exists\n');

    // Test 2: Check required columns
    console.log('2️⃣ Checking required columns...');
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_leads' ORDER BY ORDINAL_POSITION"
    );
    
    const columnNames = columns.map(c => c.COLUMN_NAME);
    const required = ['attachments', 'preferred_date', 'preferred_time', 'lead_score'];
    const missing = required.filter(c => !columnNames.includes(c));
    
    if (missing.length > 0) {
      console.log('   ❌ Missing columns:', missing.join(', '), '\n');
      console.log('   👉 Run migration to add missing columns\n');
      process.exit(1);
    }
    console.log('   ✅ All required columns present\n');

    // Test 3: Try a test insert
    console.log('3️⃣ Testing insert operation...');
    const testData = {
      name: 'Test User',
      phone: '555-0000',
      email: 'test@example.com',
      description: 'Test submission',
      preferred_date: '2026-04-01',
      preferred_time: 'morning',
      lead_score: 100,
    };

    const [result] = await connection.query(
      `INSERT INTO contact_leads (name, phone, email, description, preferred_date, preferred_time, lead_score, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [testData.name, testData.phone, testData.email, testData.description, testData.preferred_date, testData.preferred_time, testData.lead_score]
    );
    
    const insertId = result.insertId;
    console.log('   ✅ Test insert successful (ID:', insertId, ')\n');

    // Clean up test data
    await connection.query('DELETE FROM contact_leads WHERE id = ?', [insertId]);
    console.log('   ✅ Test data cleaned up\n');

    console.log('✨ All tests passed! Contact form should work now.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Cannot connect to database. Database might be remote.');
      console.log('   Visit: http://localhost:3000/admin/fix-contact-leads\n');
    }
    process.exit(1);
  } finally {
    await connection.end();
  }
}

testContactForm();
