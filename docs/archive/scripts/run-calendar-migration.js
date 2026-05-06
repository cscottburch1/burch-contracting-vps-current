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
    console.log('Running migration: calendar_events.sql');
    
    const sql = fs.readFileSync('./database/calendar_events.sql', 'utf8');
    await connection.execute(sql);
    console.log('✓ Created calendar_events table');
    
    console.log('\n✅ Calendar migration completed successfully!');
    
    // Verify table was created
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'calendar_events'"
    );
    
    if (Array.isArray(tables) && tables.length > 0) {
      console.log('\n📋 Table verified: calendar_events');
      
      const [columns] = await connection.execute('DESCRIBE calendar_events');
      console.table(columns);
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
