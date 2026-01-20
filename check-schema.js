const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    const [columns] = await connection.execute('DESCRIBE contact_leads');
    console.log('contact_leads table structure:');
    console.table(columns);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkSchema();
