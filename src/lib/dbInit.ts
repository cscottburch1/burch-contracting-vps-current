import pool from './mysql';

interface MigrationResult {
  table: string;
  status: 'exists' | 'created' | 'failed';
  error?: string;
}

/**
 * Auto-initialize database tables if they don't exist
 * This runs on app startup to ensure all required tables are present
 */
export async function initializeDatabaseTables(): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  const tables = [
    {
      name: 'service_settings',
      sql: `
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
      `,
      seed: `
        INSERT IGNORE INTO service_settings 
        (service_name, service_slug, enabled, description, menu_label, menu_order, show_in_calculator, show_in_services_page, show_in_navigation) 
        VALUES
        ('Handyman Services', 'handyman', TRUE, 'Quick fixes, installations, and general home repairs', 'Handyman', 1, TRUE, TRUE, TRUE),
        ('Remodeling', 'remodeling', TRUE, 'Kitchen, bathroom, and full home remodeling projects', 'Remodeling', 2, TRUE, TRUE, TRUE),
        ('Home Additions', 'additions', TRUE, 'Room additions, decks, porches, and outdoor living spaces', 'Additions', 3, TRUE, TRUE, TRUE),
        ('Basement Finishing', 'basement', TRUE, 'Complete basement renovations and finishing services', 'Basement', 4, FALSE, TRUE, TRUE)
      `
    },
    {
      name: 'project_photos',
      sql: `
        CREATE TABLE IF NOT EXISTS project_photos (
          id INT PRIMARY KEY AUTO_INCREMENT,
          project_id INT NOT NULL,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          category ENUM('before', 'progress', 'after', 'other') DEFAULT 'progress',
          caption TEXT,
          file_size INT,
          uploaded_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          INDEX idx_project_id (project_id),
          INDEX idx_category (category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    },
    {
      name: 'project_milestones',
      sql: `
        CREATE TABLE IF NOT EXISTS project_milestones (
          id INT PRIMARY KEY AUTO_INCREMENT,
          project_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          due_date DATE,
          completed_date DATE,
          status ENUM('pending', 'in_progress', 'completed', 'delayed') DEFAULT 'pending',
          order_index INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          INDEX idx_project_id (project_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    },
    {
      name: 'project_activity',
      sql: `
        CREATE TABLE IF NOT EXISTS project_activity (
          id INT PRIMARY KEY AUTO_INCREMENT,
          project_id INT NOT NULL,
          activity_type VARCHAR(50) NOT NULL,
          description TEXT NOT NULL,
          user_name VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          INDEX idx_project_id (project_id),
          INDEX idx_activity_type (activity_type),
          INDEX idx_created_at (created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    },
    {
      name: 'project_subcontractors',
      sql: `
        CREATE TABLE IF NOT EXISTS project_subcontractors (
          id INT PRIMARY KEY AUTO_INCREMENT,
          project_id INT NOT NULL,
          subcontractor_id INT NOT NULL,
          role VARCHAR(100),
          notes TEXT,
          amount_quoted DECIMAL(10, 2),
          amount_paid DECIMAL(10, 2) DEFAULT 0,
          status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
          assigned_date DATE,
          start_date DATE,
          completion_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
          UNIQUE KEY unique_project_sub (project_id, subcontractor_id, role),
          INDEX idx_project_id (project_id),
          INDEX idx_subcontractor_id (subcontractor_id),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    }
  ];

  for (const table of tables) {
    try {
      // Check if table exists
      const [rows] = await pool.query(`SHOW TABLES LIKE '${table.name}'`);
      
      if (Array.isArray(rows) && rows.length > 0) {
        results.push({ table: table.name, status: 'exists' });
        continue;
      }

      // Create table
      await pool.query(table.sql);
      
      // Seed data if provided
      if (table.seed) {
        await pool.query(table.seed);
      }
      
      results.push({ table: table.name, status: 'created' });
      console.log(`✓ Created table: ${table.name}`);
      
    } catch (error: any) {
      results.push({ 
        table: table.name, 
        status: 'failed',
        error: error.message 
      });
      console.error(`✗ Failed to create table ${table.name}:`, error.message);
    }
  }

  return results;
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  tables: string[];
  error?: string;
}> {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames: string[] = Array.isArray(tables) 
      ? tables.map((t: any) => String(Object.values(t)[0])) 
      : [];
    return {
      connected: true,
      tables: tableNames
    };
  } catch (error: any) {
    return {
      connected: false,
      tables: [],
      error: error.message
    };
  }
}
