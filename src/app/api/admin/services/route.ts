import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET /api/admin/services - Get all service settings
export async function GET() {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const services: any = await query(
      `SELECT * FROM service_settings ORDER BY menu_order ASC, service_name ASC`
    );

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching service settings:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// PATCH /api/admin/services - Update service settings
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser || currentUser.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized - Owner access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, enabled, show_in_calculator, show_in_services_page, show_in_navigation, menu_order, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (typeof enabled === 'boolean') {
      updates.push('enabled = ?');
      values.push(enabled);
    }

    if (typeof show_in_calculator === 'boolean') {
      updates.push('show_in_calculator = ?');
      values.push(show_in_calculator);
    }

    if (typeof show_in_services_page === 'boolean') {
      updates.push('show_in_services_page = ?');
      values.push(show_in_services_page);
    }

    if (typeof show_in_navigation === 'boolean') {
      updates.push('show_in_navigation = ?');
      values.push(show_in_navigation);
    }

    if (typeof menu_order === 'number') {
      updates.push('menu_order = ?');
      values.push(menu_order);
    }

    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    values.push(id);
    await query(
      `UPDATE service_settings SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service settings:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}
