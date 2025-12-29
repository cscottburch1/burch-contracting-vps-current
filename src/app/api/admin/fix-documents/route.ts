import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// Drop old document tables and create the unified one
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Drop old tables
    await query(`DROP TABLE IF EXISTS subcontractor_documents`);
    await query(`DROP TABLE IF EXISTS customer_documents`);
    await query(`DROP TABLE IF EXISTS project_documents`);

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

    console.log('✅ Documents table fixed successfully');

    return NextResponse.json({
      success: true,
      message: 'Documents table fixed successfully - old tables dropped, new unified table created'
    });

  } catch (error: any) {
    console.error('Documents fix error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix documents table' },
      { status: 500 }
    );
  }
}
