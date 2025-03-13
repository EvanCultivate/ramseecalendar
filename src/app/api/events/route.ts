import { NextResponse } from 'next/server';
import { createEvent, getEvents } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error: unknown) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, startTime, endTime, description, location, attendees } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await createEvent(
      title,
      new Date(startTime),
      new Date(endTime),
      description,
      location,
      attendees
    );

    return NextResponse.json(event);
  } catch (error: unknown) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 