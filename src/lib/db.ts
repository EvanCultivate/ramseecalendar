import { PrismaClient, Event, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export type EventWithAttendees = Event & {
  attendees: string[];
};

export async function createEvent(
  title: string,
  startTime: Date,
  endTime: Date,
  description?: string,
  location?: string,
  attendees?: string[]
): Promise<EventWithAttendees> {
  return prisma.event.create({
    data: {
      title,
      startTime,
      endTime,
      description,
      location,
      attendees: attendees || []
    } as Prisma.EventCreateInput
  });
}

export async function getEvents(): Promise<EventWithAttendees[]> {
  return prisma.event.findMany({
    orderBy: {
      startTime: 'asc'
    }
  });
}

export async function getEvent(id: string): Promise<EventWithAttendees | null> {
  return prisma.event.findUnique({
    where: { id }
  });
}

export async function updateEvent(
  id: string,
  data: {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    description?: string;
    location?: string;
    attendees?: string[];
  }
): Promise<EventWithAttendees> {
  return prisma.event.update({
    where: { id },
    data: data as Prisma.EventUpdateInput
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await prisma.event.delete({
    where: { id }
  });
} 