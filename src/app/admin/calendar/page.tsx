'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CalendarEvent {
  id: string;
  lead_id?: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  attendees?: string;
  event_type: 'consultation' | 'site_visit' | 'meeting' | 'follow_up' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  google_event_id?: string;
  outlook_event_id?: string;
  created_at: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    location: '',
    attendees: '',
    event_type: 'consultation' as 'consultation' | 'site_visit' | 'meeting' | 'follow_up' | 'other',
  });

  // Calendar sync settings
  const [syncProvider, setSyncProvider] = useState<'none' | 'google' | 'outlook' | 'ical'>('none');
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchEvents();
    }
  }, [authenticated, selectedDate]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/calendar/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('/api/admin/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create event');

      await fetchEvents();
      setShowEventModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      const response = await fetch(`/api/admin/calendar/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update event');

      await fetchEvents();
      setShowEventModal(false);
      setEditingEvent(null);
      resetForm();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/admin/calendar/events/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete event');

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleExport = async (format: 'ical' | 'google' | 'outlook') => {
    try {
      const response = await fetch(`/api/admin/calendar/export?format=${format}`);
      if (!response.ok) throw new Error('Failed to export');

      if (format === 'ical') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar.ics';
        a.click();
      } else {
        const data = await response.json();
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error exporting calendar:', error);
      toast.error('Failed to export calendar');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      location: '',
      attendees: '',
      event_type: 'consultation',
    });
  };

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      location: event.location || '',
      attendees: event.attendees || '',
      event_type: event.event_type,
    });
    setShowEventModal(true);
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      consultation: 'bg-blue-100 text-blue-700 border-blue-300',
      site_visit: 'bg-green-100 text-green-700 border-green-300',
      meeting: 'bg-purple-100 text-purple-700 border-purple-300',
      follow_up: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[type] || colors.other;
  };

  const formatDateTime = (datetime: string) => {
    try {
      const dateOnly = datetime.split('T')[0];
      const timeOnly = datetime.split('T')[1]?.substring(0, 5);
      const [year, month, day] = dateOnly.split('-').map(Number);
      
      const date = new Date(year, month - 1, day);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      return timeOnly ? `${formattedDate} at ${timeOnly}` : formattedDate;
    } catch {
      return datetime;
    }
  };

  if (loading || !authenticated) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
            <p className="text-gray-600 mt-2">Manage appointments and consultations</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowSyncModal(true)}
              variant="outline"
            >
              <Icon name="RefreshCw" size={18} className="mr-2" />
              Sync Settings
            </Button>
            <Button
              onClick={() => {
                setEditingEvent(null);
                resetForm();
                setShowEventModal(true);
              }}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              New Event
            </Button>
          </div>
        </div>

        {/* Calendar Header */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                variant="outline"
                size="sm"
              >
                <Icon name="ChevronLeft" size={18} />
              </Button>
              <h2 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <Button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                variant="outline"
                size="sm"
              >
                <Icon name="ChevronRight" size={18} />
              </Button>
              <Button
                onClick={() => setSelectedDate(new Date())}
                variant="outline"
                size="sm"
              >
                Today
              </Button>
            </div>

            <div className="flex gap-2">
              {(['list', 'month'] as const).map((v) => (
                <Button
                  key={v}
                  onClick={() => setView(v)}
                  variant={view === v ? 'primary' : 'outline'}
                  size="sm"
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Events List */}
        <div className="grid gap-4">
          {events.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Icon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No events scheduled</p>
                <Button onClick={() => setShowEventModal(true)}>
                  Create Your First Event
                </Button>
              </div>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="blue" className={getEventTypeColor(event.event_type)}>
                        {event.event_type.replace('_', ' ')}
                      </Badge>
                      {event.status === 'cancelled' && (
                        <Badge variant="gray">Cancelled</Badge>
                      )}
                      {event.status === 'completed' && (
                        <Badge variant="green">Completed</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h3>
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Icon name="Clock" size={16} className="mr-2 text-gray-400" />
                        {formatDateTime(event.start_datetime)}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-700">
                          <Icon name="MapPin" size={16} className="mr-2 text-gray-400" />
                          {event.location}
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center text-gray-700">
                          <Icon name="Users" size={16} className="mr-2 text-gray-400" />
                          {event.attendees}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditModal(event)}
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteEvent(event.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <Button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Consultation with John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="site_visit">Site Visit</option>
                    <option value="meeting">Meeting</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start_datetime}
                      onChange={(e) => setFormData({ ...formData, start_datetime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_datetime}
                      onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Customer address or office"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., john@example.com, jane@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Add notes or details about this event..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={editingEvent ? handleUpdateEvent : handleCreateEvent}
                    disabled={!formData.title || !formData.start_datetime || !formData.end_datetime}
                    className="flex-1"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Sync Modal */}
        {showSyncModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Calendar Sync Settings</h2>
                <Button
                  onClick={() => setShowSyncModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600">
                  Export your calendar to sync with your preferred email/calendar software
                </p>

                <div className="grid gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() => handleExport('google')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                        <p className="text-sm text-gray-600">Subscribe to calendar in Gmail</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() => handleExport('outlook')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon name="Mail" size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Outlook</h3>
                        <p className="text-sm text-gray-600">Subscribe to calendar in Outlook</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() => handleExport('ical')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon name="Download" size={24} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">iCal / Thunderbird</h3>
                        <p className="text-sm text-gray-600">Download .ics file for any calendar app</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-2">How to sync:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Click on your preferred calendar provider above</li>
                        <li>Copy the subscription URL or download the .ics file</li>
                        <li>Add to your calendar app as a subscription calendar</li>
                        <li>Your calendar will update automatically when you create/edit events</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Section>
  );
}
