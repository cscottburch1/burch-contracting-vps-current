import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

/**
 * Initialize service_settings table
 * GET /api/admin/init-service-settings
 */
export async function GET(request: Request) {
  try {
    // Check if table exists
    const tables = await query(
      `SHOW TABLES LIKE 'service_settings'`
    );

    if (Array.isArray(tables) && tables.length > 0) {
      return NextResponse.json({ 
        message: 'service_settings table already exists',
        status: 'exists'
      });
    }

    // Create the table
    await query(`
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

    // Insert default services
    await query(`
      INSERT INTO service_settings 
      (service_name, service_slug, enabled, description, menu_label, menu_order, show_in_calculator, show_in_services_page, show_in_navigation) 
      VALUES
      ('Handyman Services', 'handyman', TRUE, 'Quick fixes, installations, and general home repairs', 'Handyman', 1, TRUE, TRUE, TRUE),
      ('Remodeling', 'remodeling', TRUE, 'Kitchen, bathroom, and full home remodeling projects', 'Remodeling', 2, TRUE, TRUE, TRUE),
      ('Home Additions', 'additions', TRUE, 'Room additions, decks, porches, and outdoor living spaces', 'Additions', 3, TRUE, TRUE, TRUE),
      ('Basement Finishing', 'basement', TRUE, 'Complete basement renovations and finishing services', 'Basement', 4, FALSE, TRUE, TRUE)
      ON DUPLICATE KEY UPDATE 
        description = VALUES(description),
        menu_label = VALUES(menu_label)
    `);

    return NextResponse.json({ 
      message: 'service_settings table created and populated successfully',
      status: 'created'
    });

  } catch (error: any) {
    console.error('Error initializing service_settings table:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize service_settings table',
      details: error.message
    }, { status: 500 });
  }
}
