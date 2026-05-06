const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    console.log('Running migration: add-preferred-datetime-to-leads.sql');
    
    const sql = fs.readFileSync('./database/add-preferred-datetime-to-leads.sql', 'utf8');
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✓ Executed:', statement.substring(0, 60) + '...');
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    
    // Verify columns were added
    const [columns] = await connection.execute(
      "SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'contact_leads' AND COLUMN_NAME IN ('preferred_date', 'preferred_time')",
      [process.env.MYSQL_DATABASE]
    );
    
    console.log('\n📋 Verified columns:');
    console.table(columns);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
