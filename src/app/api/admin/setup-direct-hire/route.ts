import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: Request) {
  try {
    // Check if table already exists
    const [tables] = await query(
      `SHOW TABLES LIKE 'direct_hire_applications'`
    ) as any[];

    if (tables && tables.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Table already exists',
        tableExists: true
      });
    }

    // Create the table
    await query(`
      CREATE TABLE IF NOT EXISTS \`direct_hire_applications\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`phone\` VARCHAR(20) NOT NULL,
        \`address\` VARCHAR(255),
        \`city\` VARCHAR(100),
        \`state\` VARCHAR(50),
        \`zip\` VARCHAR(10),
        \`position\` VARCHAR(100) NOT NULL,
        \`experience_level\` VARCHAR(50) NOT NULL,
        \`years_experience\` SMALLINT,
        \`certifications\` LONGTEXT,
        \`bio\` LONGTEXT,
        \`ip_address\` VARCHAR(45),
        \`status\` ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending',
        \`admin_notes\` LONGTEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_email\` (\`email\`),
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_position\` (\`position\`),
        INDEX \`idx_created_at\` (\`created_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Verify table was created
    const [verifyTables] = await query(
      `SHOW TABLES LIKE 'direct_hire_applications'`
    ) as any[];

    if (!verifyTables || verifyTables.length === 0) {
      throw new Error('Table creation failed');
    }

    // Get table structure
    const columns = await query(
      `SHOW COLUMNS FROM direct_hire_applications`
    ) as any[];

    return NextResponse.json({
      success: true,
      message: 'Table created successfully',
      tableExists: true,
      columns: columns.map((col: any) => ({
        field: col.Field,
        type: col.Type,
        null: col.Null,
        key: col.Key,
        default: col.Default
      }))
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create table',
      details: error.sqlMessage || null
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check if table exists
    const [tables] = await query(
      `SHOW TABLES LIKE 'direct_hire_applications'`
    ) as any[];

    const tableExists = tables && tables.length > 0;

    if (tableExists) {
      // Get table structure
      const columns = await query(
        `SHOW COLUMNS FROM direct_hire_applications`
      ) as any[];

      // Get row count
      const [countResult] = await query(
        `SELECT COUNT(*) as total FROM direct_hire_applications`
      ) as any[];

      return NextResponse.json({
        tableExists: true,
        columns: columns.map((col: any) => ({
          field: col.Field,
          type: col.Type
        })),
        applicationCount: countResult.total
      });
    }

    return NextResponse.json({
      tableExists: false,
      message: 'Table does not exist. POST to this endpoint to create it.'
    });

  } catch (error: any) {
    console.error('Check error:', error);
    return NextResponse.json({
      error: error.message,
      details: error.sqlMessage || null
    }, { status: 500 });
  }
}
