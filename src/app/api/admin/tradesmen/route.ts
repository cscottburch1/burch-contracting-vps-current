import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import { query } from '@/lib/mysql';

// GET - List all tradesmen
export async function GET() {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tradesmen = await query(
      `SELECT id, name, email, phone, pin, is_active, created_at 
       FROM tradesman_users 
       ORDER BY name ASC`
    );

    return NextResponse.json({ tradesmen: Array.isArray(tradesmen) ? tradesmen : [] });
  } catch (error) {
    console.error('Error fetching tradesmen:', error);
    return NextResponse.json({ error: 'Failed to fetch tradesmen' }, { status: 500 });
  }
}

// POST - Create new tradesman
export async function POST(request: Request) {
  try {
    const adminUser = await getCurrentAdminUser();
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, pin, is_active } = body;

    if (!name || !email || !pin) {
      return NextResponse.json(
        { error: 'Name, email, and PIN are required' },
        { status: 400 }
      );
    }

    // Validate PIN is 6 digits
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { error: 'PIN must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await query(
      'SELECT id FROM tradesman_users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO tradesman_users (name, email, phone, pin, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, pin, is_active !== false]
    );

    const insertResult = result as any;

    return NextResponse.json({
      success: true,
      tradesman: {
        id: insertResult.insertId,
        name,
        email,
        phone,
        pin,
        is_active: is_active !== false
      }
    });
  } catch (error) {
    console.error('Error creating tradesman:', error);
    return NextResponse.json({ error: 'Failed to create tradesman' }, { status: 500 });
  }
}
