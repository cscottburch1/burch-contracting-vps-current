import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

/**
 * POST /api/admin/migrate-lead-scoring
 * Adds lead_score column to contact_leads table for intelligent lead prioritization
 */
export async function POST() {
  try {
    const results: string[] = [];
    
    // Check if the column already exists
    const columns = await query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'contact_leads' 
      AND COLUMN_NAME = 'lead_score'
    `);

    if (Array.isArray(columns) && columns.length > 0) {
      results.push('✓ lead_score column already exists in contact_leads table');
    } else {
      // Add lead_score column
      await query(`
        ALTER TABLE contact_leads 
        ADD COLUMN lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)'
      `);
      results.push('✓ Added lead_score column to contact_leads table');

      // Add index for efficient sorting
      await query(`
        ALTER TABLE contact_leads 
        ADD INDEX idx_lead_score (lead_score)
      `);
      results.push('✓ Added index on lead_score column');

      // Update existing leads with default score
      await query(`
        UPDATE contact_leads 
        SET lead_score = 100 
        WHERE lead_score = 0 OR lead_score IS NULL
      `);
      results.push('✓ Updated existing leads with default score (100)');
    }

    // Check if the table exists as 'leads' (alternative name)
    const leadsTable = await query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'leads'
    `);

    if (Array.isArray(leadsTable) && leadsTable.length > 0) {
      // Check if column exists in leads table
      const leadsColumns = await query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'leads' 
        AND COLUMN_NAME = 'lead_score'
      `);

      if (Array.isArray(leadsColumns) && leadsColumns.length > 0) {
        results.push('✓ lead_score column already exists in leads table');
      } else {
        // Add to leads table as well
        await query(`
          ALTER TABLE leads 
          ADD COLUMN lead_score INT DEFAULT 0 COMMENT 'Calculated lead score (0-375)'
        `);
        results.push('✓ Added lead_score column to leads table');

        await query(`
          ALTER TABLE leads 
          ADD INDEX idx_lead_score (lead_score)
        `);
        results.push('✓ Added index on lead_score column in leads table');

        await query(`
          UPDATE leads 
          SET lead_score = 100 
          WHERE lead_score = 0 OR lead_score IS NULL
        `);
        results.push('✓ Updated existing leads in leads table with default score (100)');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead scoring migration completed successfully',
      results,
      tables: ['contact_leads', ...(leadsTable && leadsTable.length > 0 ? ['leads'] : [])]
    });
  } catch (error: any) {
    console.error('Lead scoring migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed: ' + error.message },
      { status: 500 }
    );
  }
}
