import { NextResponse } from 'next/server';
import { getCurrentAdminUser, verifyAdminAuth, findAdminById } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET /api/admin/subcontractors - List all subcontractors
export async function GET(request: Request) {
  try {
    // Try to resolve admin session from the incoming request (works for app routes)
    const session = await verifyAdminAuth(request);
    let currentUser = null;
    if (session) {
      currentUser = await findAdminById(session.userId);
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let subcontractors: any[] = [];
    try {
      subcontractors = await query(`SELECT * FROM subcontractors ORDER BY created_at DESC`);
    } catch (dbErr) {
      console.error('DB fetch failed, will include queued applications if any:', dbErr);
      subcontractors = [];
    }

    // Parse JSON fields - handle both JSON arrays and comma-separated strings
    const parsed = subcontractors.map((sub: any) => {
      let specialties = [];
      
      if (sub.specialties) {
        // If it's already an array (MySQL JSON type), use it directly
        if (Array.isArray(sub.specialties)) {
          specialties = sub.specialties;
        } else if (typeof sub.specialties === 'string') {
          try {
            // Try to parse as JSON first
            const parsed = JSON.parse(sub.specialties);
            specialties = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            // If JSON parsing fails, treat as comma-separated string
            specialties = sub.specialties.split(',').map((s: string) => s.trim()).filter((s: string) => s);
          }
        }
      }
      
      return {
        ...sub,
        specialties,
      };
    });

    // Also include any queued applications saved to tmp/subcontractor_applications.json
    try {
      const path = require('path');
      const fs = require('fs');
      const queueFile = path.join(process.cwd(), 'tmp', 'subcontractor_applications.json');
      if (fs.existsSync(queueFile)) {
        const queuedRaw = JSON.parse(fs.readFileSync(queueFile, 'utf8') || '[]');
        const queuedMapped = (queuedRaw || []).map((q: any, idx: number) => ({
          id: q.id || `queued-${idx}`,
          company_name: q.company_name,
          contact_name: q.contact_name,
          email: q.email,
          phone: q.phone,
          address: q.address,
          city: q.city,
          state: q.state,
          zip: q.zip,
          business_type: q.business_type,
          years_in_business: q.years_in_business,
          license_number: q.license_number,
          insurance_provider: q.insurance_provider,
          insurance_expiry: q.insurance_expiry,
          specialties: Array.isArray(q.specialties) ? q.specialties : (typeof q.specialties === 'string' ? JSON.parse(q.specialties || '[]') : []),
          status: q.status || 'queued',
          admin_notes: q.admin_notes || '',
          total_projects: 0,
          rating: 0,
          created_at: q.created_at || new Date().toISOString(),
        }));

        // Merge queued entries first so they appear at top
        return NextResponse.json({ subcontractors: [...queuedMapped, ...parsed] });
      }
    } catch (fileErr) {
      console.error('Failed to read queued applications file:', fileErr);
    }

    return NextResponse.json({ subcontractors: parsed });
  } catch (error) {
    console.error('Error fetching subcontractors:', error);
    return NextResponse.json({ error: 'Failed to fetch subcontractors' }, { status: 500 });
  }
}

// POST /api/admin/subcontractors - Create new subcontractor
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentAdminUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      company_name,
      contact_name,
      email,
      phone,
      address,
      city,
      state,
      zip_code,
      specialties,
      years_experience,
      insurance_info,
      license_number,
      status,
      admin_notes
    } = body;

    if (!company_name || !contact_name || !email || !phone) {
      return NextResponse.json({ 
        error: 'Company name, contact name, email, and phone are required' 
      }, { status: 400 });
    }

    const result: any = await query(
      `INSERT INTO subcontractors 
       (company_name, contact_name, email, phone, address, city, state, zip_code, 
        specialties, years_experience, insurance_info, license_number, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        contact_name,
        email,
        phone,
        address || '',
        city || '',
        state || '',
        zip_code || '',
        JSON.stringify(specialties || []),
        years_experience || 0,
        insurance_info || '',
        license_number || '',
        status || 'pending',
        admin_notes || ''
      ]
    );

    return NextResponse.json({ 
      success: true, 
      subcontractorId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating subcontractor:', error);
    return NextResponse.json({ error: 'Failed to create subcontractor' }, { status: 500 });
  }
}
