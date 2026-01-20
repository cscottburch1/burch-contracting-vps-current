// Check production subcontractors
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });
  
  const [rows] = await conn.execute(
    'SELECT id, company_name, contact_name, email, phone, status, created_at FROM subcontractors ORDER BY id DESC LIMIT 5'
  );
  
  console.log('\nRecent Subcontractors in Production:');
  console.table(rows);
  
  await conn.end();
})();
