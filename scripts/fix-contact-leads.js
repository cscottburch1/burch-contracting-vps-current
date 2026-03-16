/**
 * Script to fix the contact_leads table issue
 * This will:
 * 1. Check if contact_leads table exists
 * 2. If not, check if 'leads' table exists and rename it
 * 3. Add missing columns if needed
 * 4. Create related tables
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function main() {
  console.log('🔧 Fixing contact_leads table...\n');

  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
  });

  try {
    // Check if contact_leads table exists
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('contact_leads', 'leads')",
      [process.env.MYSQL_DATABASE]
    );

    const tableNames = tables.map(t => t.TABLE_NAME);
    console.log('📋 Existing tables:', tableNames.length > 0 ? tableNames.join(', ') : 'None found');

    // If 'leads' exists but not 'contact_leads', rename it
    if (tableNames.includes('leads') && !tableNames.includes('contact_leads')) {
      console.log('\n🔄 Renaming "leads" table to "contact_leads"...');
      await connection.query('RENAME TABLE leads TO contact_leads');
      console.log('✅ Table renamed successfully');
    }

    // Read and execute the migration SQL
    console.log('\n📝 Running migration script...');
    const sqlPath = path.join(__dirname, '..', 'database', 'fix-contact-leads-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await connection.query(sql);
    console.log('✅ Migration completed successfully');

    // Verify the table structure
    console.log('\n🔍 Verifying table structure...');
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contact_leads' ORDER BY ORDINAL_POSITION",
      [process.env.MYSQL_DATABASE]
    );

    console.log('📊 contact_leads columns:');
    columns.forEach(col => console.log('  -', col.COLUMN_NAME));

    // Check for required columns
    const requiredColumns = ['attachments', 'preferred_date', 'preferred_time', 'lead_score'];
    const existingColumns = columns.map(c => c.COLUMN_NAME);
    const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

    if (missingColumns.length > 0) {
      console.log('\n⚠️  Missing columns:', missingColumns.join(', '));
    } else {
      console.log('\n✅ All required columns are present');
    }

    console.log('\n✨ Database is ready!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
