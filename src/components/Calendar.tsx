'use client';

import { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  subDays,
} from 'date-fns';
import { EventWithAttendees } from '@/lib/db';
import EventModal from './EventModal';
import toast from 'react-hot-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EventData {
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  attendees: string[];
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventWithAttendees[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithAttendees | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [mobileStartDate, setMobileStartDate] = useState(startOfWeek(new Date()));

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileStartDate(currentDate);
    }
  }, [currentDate, isMobile]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleSave = async (eventData: EventData) => {
    try {
      if (selectedEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to update event');
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to create event');
      }
      
      fetchEvents();
      setIsModalOpen(false);
      toast.success(selectedEvent ? 'Event updated!' : 'Event created!');
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(`/api/events/${selectedEvent.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
      
      fetchEvents();
      setIsModalOpen(false);
      toast.success('Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handlePrevious = () => {
    if (isMobile) {
      setMobileStartDate(prev => subDays(prev, 5));
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() - 1);
        return newDate;
      });
    }
  };

  const handleNext = () => {
    if (isMobile) {
      setMobileStartDate(prev => addDays(prev, 5));
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
      });
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (isMobile) {
      setMobileStartDate(today);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: EventWithAttendees, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.startTime.toString());
      return isSameDay(eventDate, date);
    });
  };

  const getDayClassName = (day: Date) => {
    const baseClasses = "min-h-[100px] p-2 transition-colors cursor-pointer";
    const monthStart = startOfMonth(currentDate);
    
    if (isToday(day)) {
      return `${baseClasses} bg-pink-100 hover:bg-pink-200 text-pink-800`;
    }
    if (isSameMonth(day, monthStart)) {
      return `${baseClasses} bg-pink-50 hover:bg-pink-100 text-pink-900`;
    }
    if (day < monthStart) {
      return `${baseClasses} bg-gray-100 text-gray-500 hover:bg-gray-200`;
    }
    return `${baseClasses} bg-gray-50 text-gray-500 hover:bg-gray-100`;
  };

  const renderMobileView = () => {
    const days = Array.from({ length: 5 }, (_, i) => addDays(mobileStartDate, i));

    return (
      <>
        <div className="grid grid-cols-5 gap-px bg-pink-200 border border-pink-200 rounded-lg overflow-hidden">
          {days.map((day) => (
            <div
              key={day.toString()}
              className="bg-pink-100 p-2 text-center font-medium text-pink-600"
            >
              <div className="text-base">{format(day, 'EEE')}</div>
              <div className="text-sm">{format(day, 'MMM d')}</div>
            </div>
          ))}
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`${getDayClassName(day)} min-h-[200px] sm:min-h-[150px]`}
              >
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="text-sm p-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 shadow-sm"
                    >
                      <div className="font-medium">
                        {format(parseISO(event.startTime.toString()), 'HH:mm')}
                      </div>
                      <div className="break-words line-clamp-2">
                        {event.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderDesktopView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });

    return (
      <div className="grid grid-cols-7 gap-px bg-pink-200 border border-pink-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-pink-100 p-2 text-center text-sm font-medium text-pink-600"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              className={getDayClassName(day)}
            >
              <div className="font-medium text-sm mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className="text-xs p-1 bg-pink-100 text-pink-700 rounded truncate hover:bg-pink-200"
                  >
                    {format(parseISO(event.startTime.toString()), 'HH:mm')} -{' '}
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-pink-600">
          {isMobile
            ? `${format(mobileStartDate, 'MMM d')} - ${format(
                addDays(mobileStartDate, 4),
                'MMM d, yyyy'
              )}`
            : format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <button
            onClick={handlePrevious}
            className="px-3 py-1 text-sm border border-pink-200 text-pink-600 rounded-md hover:bg-pink-50"
          >
            Previous
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 text-sm border border-pink-200 text-pink-600 rounded-md hover:bg-pink-50"
          >
            Next
          </button>
        </div>
      </div>

      {isMobile ? renderMobileView() : renderDesktopView()}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        event={selectedEvent}
        date={selectedDate}
      />
    </div>
  );
} 