import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';
import fs from 'fs';
import path from 'path';

function getQueueFilePath() {
  return path.join(process.cwd(), 'tmp', 'subcontractor_applications.json');
}

function removeQueuedApplicationById(queueId: string) {
  const queueFile = getQueueFilePath();

  if (!fs.existsSync(queueFile)) {
    return { removed: false, reason: 'Queue file not found' };
  }

  const queueRaw = fs.readFileSync(queueFile, 'utf8') || '[]';
  const queue = JSON.parse(queueRaw);

  if (!Array.isArray(queue)) {
    return { removed: false, reason: 'Queue file is invalid' };
  }

  const idx = queue.findIndex((item: any, i: number) => {
    const itemId = item?.id ? String(item.id) : `queued-${i}`;
    return itemId === queueId;
  });

  if (idx < 0) {
    return { removed: false, reason: 'Queued application not found' };
  }

  queue.splice(idx, 1);
  fs.writeFileSync(queueFile, JSON.stringify(queue, null, 2), 'utf8');
  return { removed: true };
}

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
      updates.push('zip = ?');
      values.push(body.zip_code);
    }

    if (body.specialties !== undefined) {
      updates.push('specialties = ?');
      values.push(JSON.stringify(body.specialties));
    }

    if (body.years_experience !== undefined) {
      updates.push('years_in_business = ?');
      values.push(body.years_experience);
    }

    if (body.insurance_info !== undefined) {
      updates.push('insurance_provider = ?');
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
    const idStr = String(id);

    // Queued applications are stored in tmp/subcontractor_applications.json
    // and use non-numeric ids (for example, "queued-0").
    if (!/^\d+$/.test(idStr)) {
      const queueDelete = removeQueuedApplicationById(idStr);

      if (!queueDelete.removed) {
        return NextResponse.json({ error: queueDelete.reason }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: 'Queued application deleted successfully' });
    }

    const subId = Number(idStr);

    if (!Number.isInteger(subId) || subId <= 0) {
      return NextResponse.json({ error: 'Invalid subcontractor id' }, { status: 400 });
    }

    // Check for existing project assignments (if table exists)
    try {
      const assignments: any = await query(
        'SELECT COUNT(*) as count FROM project_subcontractors WHERE subcontractor_id = ?',
        [subId]
      );

      if (assignments[0]?.count > 0) {
        return NextResponse.json({ 
          error: `Cannot delete subcontractor: ${assignments[0].count} project assignment(s) exist. Please remove project assignments first.` 
        }, { status: 400 });
      }
    } catch (tableError) {
      // Table doesn't exist, continue with deletion
      console.log('project_subcontractors table does not exist, skipping check');
    }

    // Delete related records first to avoid foreign key constraints (safely ignore missing tables)
    try {
      await query('DELETE FROM subcontractor_activity WHERE subcontractor_id = ?', [subId]);
    } catch (e) {
      console.log('Could not delete from subcontractor_activity:', e);
    }
    
    try {
      await query('DELETE FROM subcontractor_documents WHERE subcontractor_id = ?', [subId]);
    } catch (e) {
      console.log('Could not delete from subcontractor_documents:', e);
    }
    
    try {
      await query('DELETE FROM subcontractor_bids WHERE subcontractor_id = ?', [subId]);
    } catch (e) {
      console.log('Could not delete from subcontractor_bids:', e);
    }
    
    try {
      await query('DELETE FROM subcontractor_reviews WHERE subcontractor_id = ?', [subId]);
    } catch (e) {
      console.log('Could not delete from subcontractor_reviews:', e);
    }
    
    // Now delete the subcontractor
    const result: any = await query('DELETE FROM subcontractors WHERE id = ?', [subId]);

    if (!result?.affectedRows) {
      return NextResponse.json({ error: 'Subcontractor not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Subcontractor deleted successfully' });
  } catch (error) {
    console.error('Error deleting subcontractor:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete subcontractor' 
    }, { status: 500 });
  }
}
