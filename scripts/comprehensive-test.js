const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function comprehensiveTest() {
  console.log('🔍 COMPREHENSIVE WEBSITE TEST\n');
  console.log('='.repeat(60));
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'burch_contracting'
  });

  try {
    // Test 1: Check all required tables exist
    console.log('\n📊 Test 1: Database Tables');
    console.log('-'.repeat(60));
    
    const requiredTables = [
      'customers', 'projects', 'documents', 'project_updates',
      'contact_leads', 'lead_notes', 'lead_activities',
      'subcontractors', 'admin_users'
    ];
    
    for (const table of requiredTables) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table.padEnd(25)} - ${rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table.padEnd(25)} - TABLE MISSING`);
      }
    }

    // Test 2: Check data integrity
    console.log('\n🔗 Test 2: Data Integrity');
    console.log('-'.repeat(60));
    
    // Check projects have valid customer_ids
    const [orphanProjects] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM projects p 
      LEFT JOIN customers c ON p.customer_id = c.id 
      WHERE c.id IS NULL
    `);
    console.log(`${orphanProjects[0].count === 0 ? '✅' : '❌'} Projects with valid customers: ${orphanProjects[0].count === 0 ? 'ALL' : orphanProjects[0].count + ' ORPHANED'}`);
    
    // Check documents have valid project_ids
    const [orphanDocs] = await connection.query(`
      SELECT COUNT(*) as count 
      FROM documents d 
      LEFT JOIN projects p ON d.project_id = p.id 
      WHERE p.id IS NULL
    `);
    console.log(`${orphanDocs[0].count === 0 ? '✅' : '❌'} Documents with valid projects: ${orphanDocs[0].count === 0 ? 'ALL' : orphanDocs[0].count + ' ORPHANED'}`);

    // Test 3: Check date formats
    console.log('\n📅 Test 3: Date Formats');
    console.log('-'.repeat(60));
    
    const [projectDates] = await connection.query(`
      SELECT id, title, start_date, end_date 
      FROM projects 
      WHERE start_date IS NOT NULL OR end_date IS NOT NULL 
      LIMIT 3
    `);
    
    for (const project of projectDates) {
      const startValid = project.start_date !== null;
      const endValid = project.end_date !== null;
      console.log(`${startValid && endValid ? '✅' : '⚠️'} Project ${project.id}: Start=${startValid ? '✓' : 'NULL'}, End=${endValid ? '✓' : 'NULL'}`);
    }

    // Test 4: Check file paths
    console.log('\n📁 Test 4: Document File Paths');
    console.log('-'.repeat(60));
    
    const [docs] = await connection.query(`
      SELECT id, filename, filepath, filetype 
      FROM documents 
      LIMIT 5
    `);
    
    for (const doc of docs) {
      const isValid = doc.filepath && doc.filepath.startsWith('/uploads/');
      console.log(`${isValid ? '✅' : '❌'} Doc ${doc.id}: ${doc.filepath}`);
    }

    // Test 5: Check admin users
    console.log('\n👤 Test 5: Admin Users');
    console.log('-'.repeat(60));
    
    const [admins] = await connection.query('SELECT id, email, name FROM admin_users');
    console.log(`${admins.length > 0 ? '✅' : '❌'} Admin users found: ${admins.length}`);
    for (const admin of admins) {
      console.log(`   - ${admin.email} (${admin.name || 'No name'})`);
    }

    // Test 6: Check subcontractors
    console.log('\n🔧 Test 6: Subcontractors');
    console.log('-'.repeat(60));
    
    const [subs] = await connection.query('SELECT COUNT(*) as count, status FROM subcontractors GROUP BY status');
    if (subs.length > 0) {
      for (const sub of subs) {
        console.log(`✅ Status '${sub.status}': ${sub.count} subcontractor(s)`);
      }
    } else {
      console.log('⚠️ No subcontractors found');
    }

    // Test 7: Check leads
    console.log('\n📞 Test 7: CRM Leads');
    console.log('-'.repeat(60));
    
    const [leads] = await connection.query('SELECT COUNT(*) as count, status FROM contact_leads GROUP BY status');
    if (leads.length > 0) {
      for (const lead of leads) {
        console.log(`✅ Status '${lead.status}': ${lead.count} lead(s)`);
      }
    } else {
      console.log('⚠️ No leads found');
    }

    // Test 8: Check customers
    console.log('\n👥 Test 8: Customer Accounts');
    console.log('-'.repeat(60));
    
    const [customers] = await connection.query('SELECT COUNT(*) as count FROM customers');
    console.log(`${customers[0].count > 0 ? '✅' : '⚠️'} Total customers: ${customers[0].count}`);
    
    const [customersWithProjects] = await connection.query(`
      SELECT COUNT(DISTINCT p.customer_id) as count 
      FROM projects p
    `);
    console.log(`✅ Customers with projects: ${customersWithProjects[0].count}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETE');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error);
  } finally {
    await connection.end();
  }
}

comprehensiveTest();
