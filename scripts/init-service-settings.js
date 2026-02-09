const mysql = require('mysql2/promise');
require('dotenv').config();

async function initServiceSettings() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✓ Connected to database');

    // Check if table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'service_settings'");
    
    if (tables.length > 0) {
      console.log('✓ service_settings table already exists');
      return;
    }

    console.log('Creating service_settings table...');

    // Create table with all fields
    await connection.query(`
      CREATE TABLE IF NOT EXISTS service_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL UNIQUE,
        service_slug VARCHAR(100) NOT NULL UNIQUE,
        enabled BOOLEAN DEFAULT TRUE,
        description TEXT,
        menu_label VARCHAR(100),
        menu_order INT DEFAULT 0,
        page_title VARCHAR(200),
        page_content TEXT,
        meta_title VARCHAR(200),
        meta_description TEXT,
        meta_keywords VARCHAR(500),
        hero_image VARCHAR(255),
        featured_image VARCHAR(255),
        call_to_action_text VARCHAR(200),
        call_to_action_url VARCHAR(255),
        show_in_calculator BOOLEAN DEFAULT TRUE,
        show_in_services_page BOOLEAN DEFAULT TRUE,
        show_in_navigation BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_enabled (enabled),
        INDEX idx_slug (service_slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✓ Table created');

    // Insert default services
    await connection.query(`
      INSERT INTO service_settings 
      (service_name, service_slug, enabled, description, menu_label, menu_order, show_in_calculator, show_in_services_page, show_in_navigation) 
      VALUES
      ('Handyman Services', 'handyman', TRUE, 'Quick fixes, installations, and general home repairs', 'Handyman', 1, TRUE, TRUE, TRUE),
      ('Remodeling', 'remodeling', TRUE, 'Kitchen, bathroom, and full home remodeling projects', 'Remodeling', 2, TRUE, TRUE, TRUE),
      ('Home Additions', 'additions', TRUE, 'Room additions, decks, porches, and outdoor living spaces', 'Additions', 3, TRUE, TRUE, TRUE),
      ('Basement Finishing', 'basement', TRUE, 'Complete basement renovations and finishing services', 'Basement', 4, FALSE, TRUE, TRUE)
    `);

    console.log('✓ Default services inserted');
    console.log('\n✅ service_settings table initialized successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Database connection refused. Make sure:');
      console.error('   - Database credentials in .env are correct');
      console.error('   - Database server is accessible');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Check your database credentials in .env');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initServiceSettings();
