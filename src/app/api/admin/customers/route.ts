import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { verifyAdminAuth } from '@/lib/adminAuth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const customers = await query(sql, params);

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await verifyAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, address, password } = body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ 
        error: 'Name, email, phone, and password are required' 
      }, { status: 400 });
    }

    // Check if email already exists
    const existing = await query(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ 
        error: 'A customer with this email already exists' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer
    const result = await query(
      'INSERT INTO customers (name, email, phone, address, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, address || null, hashedPassword]
    );

    return NextResponse.json({ 
      success: true,
      customer: {
        id: (result as any).insertId,
        name,
        email,
        phone,
        address
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
