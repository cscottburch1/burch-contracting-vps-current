import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// PATCH /api/admin/subcontractors/[id] - Update subcontractor
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const subId = parseInt(id);
    const body = await request.json();

    const updates: string[] = [];
    const values: any[] = [];

    // Allow updating these fields
    if (body.company_name !== undefined) {
      updates.push('company_name = ?');
      values.push(body.company_name);
    }

    if (body.contact_name !== undefined) {
      updates.push('contact_name = ?');
      values.push(body.contact_name);
    }

    if (body.email !== undefined) {
      updates.push('email = ?');
      values.push(body.email);
    }

    if (body.phone !== undefined) {
      updates.push('phone = ?');
      values.push(body.phone);
    }

    if (body.pin !== undefined) {
      // Validate PIN is 6 digits
      if (!/^\d{6}$/.test(body.pin)) {
        return NextResponse.json({ error: 'PIN must be exactly 6 digits' }, { status: 400 });
      }
      updates.push('pin = ?');
      values.push(body.pin);
    }

    if (body.address !== undefined) {
      updates.push('address = ?');
      values.push(body.address);
    }

    if (body.city !== undefined) {
      updates.push('city = ?');
      values.push(body.city);
    }

    if (body.state !== undefined) {
      updates.push('state = ?');
      values.push(body.state);
    }

    if (body.zip_code !== undefined) {
      updates.push('zip_code = ?');
      values.push(body.zip_code);
    }

    if (body.specialties !== undefined) {
      updates.push('specialties = ?');
      values.push(JSON.stringify(body.specialties));
    }

    if (body.years_experience !== undefined) {
      updates.push('years_experience = ?');
      values.push(body.years_experience);
    }

    if (body.insurance_info !== undefined) {
      updates.push('insurance_info = ?');
      values.push(body.insurance_info);
    }

    if (body.license_number !== undefined) {
      updates.push('license_number = ?');
      values.push(body.license_number);
    }

    if (body.status !== undefined) {
      updates.push('status = ?');
      values.push(body.status);
      
      // Track status changes in activity log
      if (body.status === 'approved') {
        await query(
          `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
           VALUES (?, 'approved', 'Application approved', ?)`,
          [subId, currentUser.id]
        );
        
        // Set approved timestamp
        updates.push('approved_at = NOW()');
        updates.push('approved_by = ?');
        values.push(currentUser.id);
      } else if (body.status === 'rejected') {
        await query(
          `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
           VALUES (?, 'rejected', 'Application rejected', ?)`,
          [subId, currentUser.id]
        );
      }
    }

    if (body.admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(body.admin_notes);
      
      await query(
        `INSERT INTO subcontractor_activity (subcontractor_id, activity_type, description, performed_by)
         VALUES (?, 'note_added', 'Admin notes updated', ?)`,
        [subId, currentUser.id]
      );
    }

    if (body.rating !== undefined) {
      updates.push('rating = ?');
      values.push(body.rating);
    }

    if (body.business_type !== undefined) {
      updates.push('business_type = ?');
      values.push(body.business_type);
    }

    if (body.total_projects !== undefined) {
      updates.push('total_projects = ?');
      values.push(body.total_projects);
    }

    if (body.w9_submitted !== undefined) {
      updates.push('w9_submitted = ?');
      values.push(body.w9_submitted);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: true });
    }

    values.push(subId);
    await query(
      `UPDATE subcontractors SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subcontractor:', error);
    return NextResponse.json({ error: 'Failed to update subcontractor' }, { status: 500 });
  }
}

// GET /api/admin/subcontractors/[id] - Get single subcontractor details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const subId = parseInt(id);

    const results: any = await query(
      `SELECT * FROM subcontractors WHERE id = ?`,
      [subId]
    );

    if (results.length === 0) {
      return NextResponse.json({ error: 'Subcontractor not found' }, { status: 404 });
    }

    const subcontractor = {
      ...results[0],
      specialties: results[0].specialties ? JSON.parse(results[0].specialties) : [],
    };

    // Get activity history
    const activity: any = await query(
      `SELECT * FROM subcontractor_activity WHERE subcontractor_id = ? ORDER BY created_at DESC LIMIT 50`,
      [subId]
    );

    // Get documents
    const documents: any = await query(
      `SELECT * FROM subcontractor_documents WHERE subcontractor_id = ? ORDER BY uploaded_at DESC`,
      [subId]
    );

    return NextResponse.json({ 
      subcontractor, 
      activity,
      documents
    });
  } catch (error) {
    console.error('Error fetching subcontractor:', error);
    return NextResponse.json({ error: 'Failed to fetch subcontractor' }, { status: 500 });
  }
}

// DELETE /api/admin/subcontractors/[id] - Delete subcontractor
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const subId = parseInt(id);

    // Ensure project_subcontractors table exists
    await query(`
      CREATE TABLE IF NOT EXISTS project_subcontractors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        project_id INT NOT NULL,
        subcontractor_id INT NOT NULL,
        role VARCHAR(100),
        notes TEXT,
        amount_quoted DECIMAL(10, 2),
        amount_paid DECIMAL(10, 2) DEFAULT 0,
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        assigned_date DATE,
        start_date DATE,
        completion_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (subcontractor_id) REFERENCES subcontractors(id) ON DELETE CASCADE,
        UNIQUE KEY unique_project_sub (project_id, subcontractor_id, role),
        INDEX idx_project_id (project_id),
        INDEX idx_subcontractor_id (subcontractor_id),
        INDEX idx_status (status)
      )
    `);

    // Check for existing project assignments
    const assignments: any = await query(
      'SELECT COUNT(*) as count FROM project_subcontractors WHERE subcontractor_id = ?',
      [subId]
    );

    if (assignments[0]?.count > 0) {
      return NextResponse.json({ 
        error: `Cannot delete subcontractor: ${assignments[0].count} project assignment(s) exist. Please remove project assignments first.` 
      }, { status: 400 });
    }

    // Delete related records first to avoid foreign key constraints
    await query('DELETE FROM subcontractor_documents WHERE subcontractor_id = ?', [subId]);
    await query('DELETE FROM subcontractor_activity WHERE subcontractor_id = ?', [subId]);
    
    // Delete from bid-related tables if they exist
    await query('DELETE FROM subcontractor_bids WHERE subcontractor_id = ? AND 1=1', [subId]).catch(() => {});
    await query('DELETE FROM subcontractor_reviews WHERE subcontractor_id = ? AND 1=1', [subId]).catch(() => {});
    
    // Now delete the subcontractor
    await query('DELETE FROM subcontractors WHERE id = ?', [subId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subcontractor:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete subcontractor' 
    }, { status: 500 });
  }
}
