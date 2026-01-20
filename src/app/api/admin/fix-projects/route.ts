import { NextResponse } from 'next/server';
import { verifyAdminAuth, findAdminById } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    const session = await verifyAdminAuth(request);
    let currentUser = null;
    if (session) currentUser = await findAdminById(session.userId);
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, projectId, customerId } = await request.json();

    const connection = await pool.getConnection();
    try {
      if (action === 'delete_project_by_id') {
        // Delete a specific project by ID
        await connection.execute('DELETE FROM projects WHERE id = ?', [projectId]);
        return NextResponse.json({ 
          success: true, 
          message: `Project ${projectId} deleted successfully` 
        });
      }

      if (action === 'delete_customer_projects') {
        // Delete all projects for a customer
        const [result] = await connection.execute('DELETE FROM projects WHERE customer_id = ?', [customerId]);
        return NextResponse.json({ 
          success: true, 
          message: `Deleted ${(result as any).affectedRows} projects for customer ${customerId}` 
        });
      }

      if (action === 'list_customer_projects') {
        // List all projects for a customer (any columns)
        const [projects] = await connection.execute('SELECT * FROM projects WHERE customer_id = ?', [customerId]);
        return NextResponse.json({ 
          success: true, 
          projects 
        });
      }

      if (action === 'backup_and_recreate') {
        // Backup old projects table and create new one
        try {
          // Rename old table
          await connection.execute('RENAME TABLE projects TO projects_old_backup');
          
          // Create new table with correct schema
          await connection.execute(`
            CREATE TABLE IF NOT EXISTS projects (
              id INT AUTO_INCREMENT PRIMARY KEY,
              customer_id INT NOT NULL,
              project_name VARCHAR(255) NOT NULL,
              project_type VARCHAR(100) NOT NULL,
              description TEXT,
              start_date DATE,
              estimated_completion_date DATE,
              actual_completion_date DATE,
              status ENUM('scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled') DEFAULT 'scheduled',
              completion_percentage INT DEFAULT 0,
              total_cost DECIMAL(10,2),
              address_line1 VARCHAR(255),
              address_line2 VARCHAR(255),
              city VARCHAR(100),
              state VARCHAR(2) DEFAULT 'SC',
              zip_code VARCHAR(10),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
              INDEX idx_customer_id (customer_id),
              INDEX idx_status (status),
              INDEX idx_start_date (start_date)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
          `);

          return NextResponse.json({ 
            success: true, 
            message: 'Old table backed up as projects_old_backup, new table created with correct schema'
          });
        } catch (err: any) {
          return NextResponse.json({ 
            success: false, 
            error: err.message 
          }, { status: 500 });
        }
      }

      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in fix-projects:', error);
    return NextResponse.json(
      { error: 'Failed to execute', details: (error as Error).message },
      { status: 500 }
    );
  }
}
