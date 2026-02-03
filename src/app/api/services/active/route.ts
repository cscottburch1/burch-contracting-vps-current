import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET /api/services/active - Get active services (public endpoint)
export async function GET() {
  try {
    const services: any = await query(
      `SELECT 
        service_name, 
        service_slug, 
        enabled, 
        description, 
        menu_label, 
        menu_order,
        show_in_calculator,
        show_in_services_page,
        show_in_navigation
       FROM service_settings 
       WHERE enabled = TRUE 
       ORDER BY menu_order ASC, service_name ASC`
    );

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching active services:', error);
    // Return empty array on error to prevent site breaking
    return NextResponse.json({ services: [] });
  }
}
