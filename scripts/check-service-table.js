const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkServiceTable() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'service_settings'");
    console.log('Table exists:', tables.length > 0 ? 'YES' : 'NO');
    
    if (tables.length === 0) {
      console.log('Creating service_settings table...');
      const fs = require('fs');
      const path = require('path');
      const sql = fs.readFileSync(path.join(__dirname, '../database/service_settings.sql'), 'utf8');
      
      await pool.query(sql);
      console.log('✓ service_settings table created successfully');
    } else {
      console.log('✓ service_settings table already exists');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkServiceTable();
