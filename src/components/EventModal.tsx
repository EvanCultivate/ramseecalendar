'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { EventWithAttendees } from '@/lib/db';

interface EventData {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: EventData) => Promise<void>;
  onDelete: () => Promise<void>;
  event: EventWithAttendees | null;
  date: Date | null;
}

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  date,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newAttendee, setNewAttendee] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');
      setStartTime(format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"));
      setAttendees(event.attendees || []);
    } else if (date) {
      const defaultStart = new Date(date);
      defaultStart.setHours(9, 0, 0, 0);
      const defaultEnd = new Date(date);
      defaultEnd.setHours(10, 0, 0, 0);
      
      setTitle('');
      setDescription('');
      setLocation('');
      setStartTime(format(defaultStart, "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(defaultEnd, "yyyy-MM-dd'T'HH:mm"));
      setAttendees([]);
    }
  }, [event, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      title,
      description,
      location,
      startTime,
      endTime,
      attendees,
    });
    onClose();
  };

  const addAttendee = () => {
    if (newAttendee) {
      setAttendees([...attendees, newAttendee]);
      setNewAttendee('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-50/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-pink-600 mb-4">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-pink-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700 placeholder-pink-300"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-pink-600">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700 placeholder-pink-300"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-pink-600">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700 placeholder-pink-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-pink-600">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700"
                  required
                />
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-pink-600">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-600 mb-2">
                Attendees
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Add attendee"
                  className="flex-1 rounded-md border-pink-200 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-pink-700 placeholder-pink-300"
                />
                <button
                  type="button"
                  onClick={addAttendee}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-pink-50 p-2 rounded-md"
                  >
                    <span className="text-pink-700">{attendee}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newAttendees = [...attendees];
                        newAttendees.splice(index, 1);
                        setAttendees(newAttendees);
                      }}
                      className="text-pink-600 hover:text-pink-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {event && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-pink-200 text-pink-600 rounded-md hover:bg-pink-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                {event ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 