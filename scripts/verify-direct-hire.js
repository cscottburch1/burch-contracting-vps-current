// Verify and create direct hire tables if needed
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function verifyDirectHire() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  });

  console.log('✓ Connected to database');

  // Check if table exists
  const [tables] = await connection.query(
    `SHOW TABLES LIKE 'direct_hire_applications'`
  );

  if (tables.length === 0) {
    console.log('❌ Table direct_hire_applications does not exist');
    console.log('Creating table...');
    
    // Create the table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`direct_hire_applications\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(20) NOT NULL,
        \`address\` VARCHAR(255),
        \`city\` VARCHAR(100),
        \`state\` VARCHAR(50),
        \`zip\` VARCHAR(10),
        \`position\` VARCHAR(100) NOT NULL,
        \`experience_level\` VARCHAR(50) NOT NULL,
        \`years_experience\` SMALLINT,
        \`certifications\` LONGTEXT,
        \`bio\` LONGTEXT,
        \`ip_address\` VARCHAR(45),
        \`status\` ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
        \`admin_notes\` LONGTEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_email\` (\`email\`),
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_position\` (\`position\`),
        INDEX \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✓ Table created successfully');
  } else {
    console.log('✓ Table direct_hire_applications exists');
  }

  // Verify table structure
  const [columns] = await connection.query(
    `SHOW COLUMNS FROM direct_hire_applications`
  );
  
  console.log('\n✓ Table structure:');
  columns.forEach(col => {
    console.log(`  - ${col.Field}: ${col.Type}`);
  });

  // Check for any existing applications
  const [count] = await connection.query(
    `SELECT COUNT(*) as total FROM direct_hire_applications`
  );
  
  console.log(`\n✓ Total applications: ${count[0].total}`);

  await connection.end();
  console.log('\n✓ Verification complete!');
}

verifyDirectHire().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
