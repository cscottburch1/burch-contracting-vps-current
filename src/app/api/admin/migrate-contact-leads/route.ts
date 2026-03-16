import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';
import { getCurrentAdminUser } from '@/lib/adminAuth';

/**
 * Migration endpoint to fix contact_leads table
 * This should be run once to fix the database schema issue
 */
export async function POST() {
  try {
    // Require admin authentication
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    const results: string[] = [];

    try {
      // Check if contact_leads or leads table exists
      const [tables] = await connection.query<any[]>(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('contact_leads', 'leads')"
      );

      const tableNames = tables.map((t: any) => t.TABLE_NAME);
      results.push(`Found tables: ${tableNames.join(', ') || 'None'}`);

      // If 'leads' exists but not 'contact_leads', rename it
      if (tableNames.includes('leads') && !tableNames.includes('contact_leads')) {
        await connection.query('RENAME TABLE leads TO contact_leads');
        results.push('✅ Renamed "leads" table to "contact_leads"');
      }

      // Create contact_leads table if it doesn't exist
      await connection.query(`
        CREATE TABLE IF NOT EXISTS contact_leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL,
          address TEXT,
          service_type VARCHAR(100),
          budget_range VARCHAR(100),
          timeframe VARCHAR(100),
          referral_source VARCHAR(100),
          description TEXT,
          attachments TEXT COMMENT 'JSON array of uploaded file names',
          preferred_date DATE COMMENT 'Customer preferred consultation date',
          preferred_time VARCHAR(50) COMMENT 'Customer preferred consultation time',
          lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)',
          status ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost') DEFAULT 'new',
          priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
          assigned_to VARCHAR(255),
          estimated_value DECIMAL(10, 2),
          scheduled_date DATETIME,
          last_contact_date DATETIME,
          source_url VARCHAR(500),
          tags JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_priority (priority),
          INDEX idx_email (email),
          INDEX idx_created_at (created_at),
          INDEX idx_lead_score (lead_score)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push('✅ Ensured contact_leads table exists');

      // Check and add missing columns
      const [columns] = await connection.query<any[]>(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_leads'"
      );
      
      const existingColumns = columns.map((c: any) => c.COLUMN_NAME);

      // Add attachments column if missing
      if (!existingColumns.includes('attachments')) {
        await connection.query(`
          ALTER TABLE contact_leads 
          ADD COLUMN attachments TEXT COMMENT 'JSON array of uploaded file names' AFTER description
        `);
        results.push('✅ Added attachments column');
      }

      // Add preferred_date column if missing
      if (!existingColumns.includes('preferred_date')) {
        await connection.query(`
          ALTER TABLE contact_leads 
          ADD COLUMN preferred_date DATE COMMENT 'Customer preferred consultation date' 
          AFTER ${existingColumns.includes('attachments') ? 'attachments' : 'description'}
        `);
        results.push('✅ Added preferred_date column');
      }

      // Add preferred_time column if missing
      if (!existingColumns.includes('preferred_time')) {
        await connection.query(`
          ALTER TABLE contact_leads 
          ADD COLUMN preferred_time VARCHAR(50) COMMENT 'Customer preferred consultation time' 
          AFTER preferred_date
        `);
        results.push('✅ Added preferred_time column');
      }

      // Add lead_score column if missing
      if (!existingColumns.includes('lead_score')) {
        await connection.query(`
          ALTER TABLE contact_leads 
          ADD COLUMN lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)' 
          AFTER preferred_time
        `);
        results.push('✅ Added lead_score column');
        
        // Add index for lead_score
        await connection.query(`
          ALTER TABLE contact_leads 
          ADD INDEX idx_lead_score (lead_score)
        `).catch(() => {
          results.push('ℹ️ Index idx_lead_score already exists or could not be added');
        });
      }

      // Create related tables
      await connection.query(`
        CREATE TABLE IF NOT EXISTS lead_notes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          lead_id INT NOT NULL,
          note_type ENUM('general', 'call', 'email', 'meeting', 'follow_up') DEFAULT 'general',
          content TEXT NOT NULL,
          is_important BOOLEAN DEFAULT FALSE,
          created_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_lead_id (lead_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push('✅ Ensured lead_notes table exists');

      await connection.query(`
        CREATE TABLE IF NOT EXISTS lead_activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          lead_id INT NOT NULL,
          activity_type ENUM('status_change', 'note_added', 'email_sent', 'call_made', 'meeting_scheduled', 'proposal_sent') NOT NULL,
          description TEXT NOT NULL,
          metadata JSON,
          created_by VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_lead_id (lead_id),
          INDEX idx_activity_type (activity_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      results.push('✅ Ensured lead_activities table exists');

      // Verify final structure
      const [finalColumns] = await connection.query<any[]>(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'contact_leads' ORDER BY ORDINAL_POSITION"
      );
      
      const finalColumnNames = finalColumns.map((c: any) => c.COLUMN_NAME);
      const requiredColumns = ['attachments', 'preferred_date', 'preferred_time', 'lead_score'];
      const missingColumns = requiredColumns.filter(c => !finalColumnNames.includes(c));

      if (missingColumns.length > 0) {
        results.push(`⚠️ Still missing columns: ${missingColumns.join(', ')}`);
      } else {
        results.push('✅ All required columns are present');
      }

      return NextResponse.json({
        success: true,
        message: 'Database migration completed successfully',
        results,
        columns: finalColumnNames
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: (error as Error).message
    }, { status: 500 });
  }
}

// GET endpoint to check current status
export async function GET() {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();

    try {
      // Check if contact_leads exists
      const [tables] = await connection.query<any[]>(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN ('contact_leads', 'leads')"
      );

      const tableNames = tables.map((t: any) => t.TABLE_NAME);

      if (tableNames.length === 0) {
        return NextResponse.json({
          status: 'needs_migration',
          message: 'No contact_leads or leads table found'
        });
      }

      // Check columns
      const tableName = tableNames[0];
      const [columns] = await connection.query<any[]>(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
        [tableName]
      );

      const existingColumns = columns.map((c: any) => c.COLUMN_NAME);
      const requiredColumns = ['attachments', 'preferred_date', 'preferred_time', 'lead_score'];
      const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

      return NextResponse.json({
        status: missingColumns.length > 0 ? 'needs_migration' : 'ok',
        table: tableName,
        columns: existingColumns,
        missingColumns
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({
      status: 'error',
      error: (error as Error).message
    }, { status: 500 });
  }
}
