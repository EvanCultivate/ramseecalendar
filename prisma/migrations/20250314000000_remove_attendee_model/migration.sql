-- First, drop the Attendee table and its foreign key constraint
DROP TABLE IF EXISTS "Attendee";

-- Add the attendees array column to Event table
ALTER TABLE "Event" ADD COLUMN "attendees" TEXT[] DEFAULT ARRAY[]::TEXT[]; 