import { NextRequest } from 'next/server';
import { getEvent, updateEvent, deleteEvent } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = (await params).id;
    const event = await getEvent(id);
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    return Response.json(event);
  } catch (error: unknown) {
    console.error('Failed to fetch event:', error);
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = (await params).id;
    const body = await request.json();
    const { title, startTime, endTime, description, location, attendees } = body;

    const event = await updateEvent(id, {
      title,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      description,
      location,
      attendees
    });

    return Response.json(event);
  } catch (error: unknown) {
    console.error('Failed to update event:', error);
    return Response.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated()) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = (await params).id;
    await deleteEvent(id);
    return Response.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to delete event:', error);
    return Response.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 