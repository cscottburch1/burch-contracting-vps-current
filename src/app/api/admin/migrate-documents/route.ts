import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// Run documents migration
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create unified documents table
    await query(`
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

    console.log('✅ Documents table created successfully');

    return NextResponse.json({
      success: true,
      message: 'Documents table created successfully',
      tables: [
        'documents'
      ]
    });

  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
