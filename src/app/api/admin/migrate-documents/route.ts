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

    // Create subcontractor_documents table
    await query(`
      CREATE TABLE IF NOT EXISTS subcontractor_documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        subcontractor_id INT NOT NULL,
        document_type ENUM('license', 'insurance', 'w9', 'certificate', 'contract', 'other') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        expiration_date DATE,
        status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
        uploaded_by INT NOT NULL,
        reviewed_by INT,
        reviewed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
        INDEX idx_subcontractor (subcontractor_id),
        INDEX idx_document_type (document_type),
        INDEX idx_status (status),
        INDEX idx_expiration (expiration_date)
      )
    `);

    // Create customer_documents table
    await query(`
      CREATE TABLE IF NOT EXISTS customer_documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        project_id INT,
        document_type ENUM('contract', 'permit', 'invoice', 'receipt', 'photo', 'other') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        is_visible_to_customer BOOLEAN DEFAULT TRUE,
        status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'approved',
        uploaded_by INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        INDEX idx_customer (customer_id),
        INDEX idx_project (project_id),
        INDEX idx_document_type (document_type),
        INDEX idx_status (status)
      )
    `);

    // Create project_documents table
    await query(`
      CREATE TABLE IF NOT EXISTS project_documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        customer_id INT,
        document_type ENUM('contract', 'permit', 'invoice', 'photo', 'blueprint', 'change_order', 'other') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        uploaded_by_admin BOOLEAN DEFAULT TRUE,
        status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'approved',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        INDEX idx_project (project_id),
        INDEX idx_customer (customer_id),
        INDEX idx_document_type (document_type)
      )
    `);

    console.log('✅ Documents tables created successfully');

    return NextResponse.json({
      success: true,
      message: 'Documents tables created successfully',
      tables: [
        'subcontractor_documents',
        'customer_documents',
        'project_documents'
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
