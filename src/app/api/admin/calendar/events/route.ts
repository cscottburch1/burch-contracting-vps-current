import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET - Fetch all calendar events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    let sql = 'SELECT * FROM calendar_events WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      sql += ' AND start_datetime >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND start_datetime <= ?';
      params.push(endDate);
    }

    sql += ' ORDER BY start_datetime ASC';

    const events = await query(sql, params);

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new calendar event
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lead_id,
      title,
      description,
      start_datetime,
      end_datetime,
      location,
      attendees,
      event_type = 'consultation',
    } = body;

    if (!title || !start_datetime || !end_datetime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO calendar_events (lead_id, title, description, start_datetime, end_datetime, location, attendees, event_type, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')`,
      [
        lead_id || null,
        title,
        description || null,
        start_datetime,
        end_datetime,
        location || null,
        attendees || null,
        event_type,
      ]
    );

    const eventId = (result as any).insertId;

    return NextResponse.json(
      { success: true, eventId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
