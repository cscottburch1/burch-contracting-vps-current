import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    // Create recent_projects table
    await query(`
      CREATE TABLE IF NOT EXISTS recent_projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        short_description TEXT,
        description TEXT,
        image_url VARCHAR(500),
        before_image VARCHAR(500),
        after_image VARCHAR(500),
        completion_date DATE,
        project_duration VARCHAR(100),
        location VARCHAR(200),
        budget_range VARCHAR(100),
        featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_featured (featured),
        INDEX idx_active (is_active),
        INDEX idx_order (display_order)
      )
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Tables created successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to create tables', details: error },
      { status: 500 }
    );
  }
}
