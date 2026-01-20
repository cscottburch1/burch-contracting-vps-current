import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

function generateICalendar(events: any[]) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Burch Contracting//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Burch Contracting Schedule',
    'X-WR-TIMEZONE:America/New_York',
  ];

  events.forEach((event) => {
    const startDate = new Date(event.start_datetime);
    const endDate = new Date(event.end_datetime);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}@burchcontracting.com`);
    lines.push(`DTSTAMP:${formatDate(new Date())}`);
    lines.push(`DTSTART:${formatDate(startDate)}`);
    lines.push(`DTEND:${formatDate(endDate)}`);
    lines.push(`SUMMARY:${event.title.replace(/,/g, '\\,')}`);
    
    if (event.description) {
      lines.push(`DESCRIPTION:${event.description.replace(/,/g, '\\,').replace(/\n/g, '\\n')}`);
    }
    
    if (event.location) {
      lines.push(`LOCATION:${event.location.replace(/,/g, '\\,')}`);
    }
    
    if (event.attendees) {
      const attendeeList = event.attendees.split(',').map((email: string) => email.trim());
      attendeeList.forEach((email: string) => {
        lines.push(`ATTENDEE;CN=${email}:mailto:${email}`);
      });
    }
    
    lines.push(`STATUS:${event.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  
  return lines.join('\r\n');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'ical';

    // Fetch all scheduled events
    const events = await query(
      'SELECT * FROM calendar_events WHERE status = ? ORDER BY start_datetime ASC',
      ['scheduled']
    );

    if (!Array.isArray(events)) {
      throw new Error('Invalid events data');
    }

    if (format === 'ical') {
      const icalContent = generateICalendar(events);
      
      return new NextResponse(icalContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': 'attachment; filename="burch-contracting-calendar.ics"',
        },
      });
    } else if (format === 'google') {
      // Return URL for Google Calendar subscription
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://burchcontracting.com';
      const webcalUrl = `webcal://${baseUrl.replace(/^https?:\/\//, '')}/api/admin/calendar/export?format=ical`;
      
      return NextResponse.json({
        url: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`,
        subscriptionUrl: webcalUrl,
      });
    } else if (format === 'outlook') {
      // Return URL for Outlook subscription
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://burchcontracting.com';
      const webcalUrl = `webcal://${baseUrl.replace(/^https?:\/\//, '')}/api/admin/calendar/export?format=ical`;
      
      return NextResponse.json({
        url: `https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addsubscription&url=${encodeURIComponent(webcalUrl)}&name=${encodeURIComponent('Burch Contracting')}`,
        subscriptionUrl: webcalUrl,
      });
    }

    return NextResponse.json(
      { error: 'Invalid format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error exporting calendar:', error);
    return NextResponse.json(
      { error: 'Failed to export calendar' },
      { status: 500 }
    );
  }
}
