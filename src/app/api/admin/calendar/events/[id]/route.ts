import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET - Fetch single event
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const events = await query(
      'SELECT * FROM calendar_events WHERE id = ?',
      [params.id]
    );

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event: events[0] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      location,
      attendees,
      event_type,
      status,
    } = body;

    await query(
      `UPDATE calendar_events 
       SET title = ?, description = ?, start_datetime = ?, end_datetime = ?,
           location = ?, attendees = ?, event_type = ?, status = ?
       WHERE id = ?`,
      [
        title,
        description || null,
        start_datetime,
        end_datetime,
        location || null,
        attendees || null,
        event_type,
        status || 'scheduled',
        params.id,
      ]
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM calendar_events WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
