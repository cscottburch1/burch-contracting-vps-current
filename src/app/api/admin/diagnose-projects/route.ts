import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';

export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      // Get table structure
      const [columns] = await connection.execute('SHOW COLUMNS FROM projects');
      
      // Get count of projects
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM projects');
      const count = (countResult as any[])[0]?.count || 0;
      
      // Get sample projects (raw data)
      const [projects] = await connection.execute('SELECT * FROM projects LIMIT 5');
      
      // Get projects with customer info (might fail if wrong columns)
      let projectsWithCustomers = null;
      try {
        const [result] = await connection.execute(`
          SELECT p.*, c.name as customer_name, c.email as customer_email 
          FROM projects p 
          LEFT JOIN customers c ON p.customer_id = c.id 
          LIMIT 5
        `);
        projectsWithCustomers = result;
      } catch (err: any) {
        projectsWithCustomers = { error: err.message };
      }

      return NextResponse.json({
        success: true,
        tableStructure: columns,
        projectCount: count,
        sampleProjects: projects,
        projectsWithCustomers
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error diagnosing projects table:', error);
    return NextResponse.json(
      { error: 'Failed to diagnose', details: (error as Error).message },
      { status: 500 }
    );
  }
}
