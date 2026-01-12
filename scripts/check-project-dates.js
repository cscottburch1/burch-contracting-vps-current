const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDates() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'burch_contracting'
  });

  try {
    const [rows] = await connection.query('SELECT id, title, start_date, end_date FROM projects LIMIT 5');
    console.log(JSON.stringify(rows, null, 2));
  } finally {
    await connection.end();
  }
}

checkDates();
