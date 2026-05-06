const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

(async () => {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Dropping old tables...');
    await pool.query('DROP TABLE IF EXISTS subcontractor_documents');
    await pool.query('DROP TABLE IF EXISTS customer_documents');
    await pool.query('DROP TABLE IF EXISTS project_documents');
    
    console.log('Creating unified documents table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT,
        project_id INT,
        subcontractor_id INT,
        category ENUM('contract', 'permit', 'invoice', 'receipt', 'photo', 'license', 'insurance', 'w9', 'certificate', 'blueprint', 'change_order', 'other') NOT NULL,
        title VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100),
        file_size INT,
        description TEXT,
        is_visible_to_customer BOOLEAN DEFAULT TRUE,
        expiration_date DATE,
        uploaded_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_customer (customer_id),
        INDEX idx_project (project_id),
        INDEX idx_subcontractor (subcontractor_id),
        INDEX idx_category (category)
      )
    `);
    
    console.log('✅ Documents table fixed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
})();
