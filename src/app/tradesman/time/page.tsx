'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TradesmanTimeTracking() {
  const router = useRouter();
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    loadTimeData();
  }, []);

  const loadTimeData = async () => {
    try {
      const response = await fetch('/api/tradesman/time');
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data.timeEntries || []);
        setActiveEntry(data.activeEntry);

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const todayHours = calculateHours(data.timeEntries, today);
        const weekHours = calculateHours(data.timeEntries, weekAgo);
        const monthHours = calculateHours(data.timeEntries, monthAgo);

        setStats({ today: todayHours, thisWeek: weekHours, thisMonth: monthHours });
      }
    } catch (error) {
      console.error('Failed to load time data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (entries: any[], since: Date) => {
    return entries
      .filter(e => new Date(e.clock_in) > since && e.clock_out)
      .reduce((total, e) => {
        const hours = (new Date(e.clock_out).getTime() - new Date(e.clock_in).getTime()) / (1000 * 60 * 60);
        return total + hours - (e.break_minutes || 0) / 60;
      }, 0);
  };

  const formatDuration = (clockIn: string, clockOut: string | null, breakMinutes: number = 0) => {
    if (!clockOut) return 'In Progress...';
    const ms = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60)) - breakMinutes;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push('/tradesman/dashboard')} className="flex items-center text-blue-100 hover:text-white mb-2">
            <span className="text-xl">←</span>
            <span className="ml-2 text-sm">Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-bold">⏰ Time Tracking</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Today</div>
            <div className="text-2xl font-bold text-blue-600">{stats.today.toFixed(1)}h</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">This Week</div>
            <div className="text-2xl font-bold text-green-600">{stats.thisWeek.toFixed(1)}h</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">This Month</div>
            <div className="text-2xl font-bold text-purple-600">{stats.thisMonth.toFixed(1)}h</div>
          </div>
        </div>

        {/* Active Entry */}
        {activeEntry && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-900">Currently Clocked In</span>
                </div>
                <div className="text-sm text-green-700">{activeEntry.project_title}</div>
                <div className="text-xs text-green-600">Since {new Date(activeEntry.clock_in).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Time Entries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Recent Entries</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {timeEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No time entries yet. Clock in on a project to start tracking!
              </div>
            ) : (
              timeEntries.map((entry) => (
                <div key={entry.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{entry.project_title}</div>
                      <div className="text-sm text-gray-600">{new Date(entry.clock_in).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{formatDuration(entry.clock_in, entry.clock_out, entry.break_minutes)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </div>
                    </div>
                  </div>
                  {entry.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 rounded p-2 mt-2">
                      {entry.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
