'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type TabType = 'overview' | 'time' | 'photos' | 'tasks' | 'materials' | 'issues' | 'report';

export default function TradesmanProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params?.id as string) || '';
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const [projectRes, timeRes] = await Promise.all([
        fetch(`/api/admin/projects/${projectId}`),
        fetch('/api/tradesmen/time')
      ]);

      if (!projectRes.ok) {
        router.push('/tradesmen/dashboard');
        return;
      }

      const projectData = await projectRes.json();
      setProject(projectData.project);

      if (timeRes.ok) {
        const timeData = await timeRes.json();
        setIsClockedIn(!!timeData.activeEntry && timeData.activeEntry.project_id == projectId);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const response = await fetch('/api/tradesmen/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clock_in', project_id: projectId })
      });

      if (response.ok) {
        setIsClockedIn(true);
        alert('✅ Clocked in successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to clock in');
      }
    } catch (error) {
      alert('Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    const breakMinutes = prompt('How many minutes of break did you take?', '30');
    if (breakMinutes === null) return;

    try {
      const response = await fetch('/api/tradesmen/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'clock_out', 
          break_minutes: parseInt(breakMinutes) || 0 
        })
      });

      if (response.ok) {
        setIsClockedIn(false);
        alert('✅ Clocked out successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to clock out');
      }
    } catch (error) {
      alert('Failed to clock out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/tradesmen/dashboard" className="flex items-center text-blue-100 hover:text-white mb-2">
            <span className="text-xl">←</span>
            <span className="ml-2 text-sm">Back to Projects</span>
          </Link>
          <h1 className="text-xl font-bold">{project?.title}</h1>
          <p className="text-blue-100 text-sm">{project?.customer_name}</p>
        </div>
      </div>

      {/* Clock In/Out Bar */}
      <div className="bg-white border-b-2 border-gray-200 p-3 sticky top-[76px] z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {isClockedIn ? (
            <>
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">Clocked In</span>
              </div>
              <button
                onClick={handleClockOut}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md"
              >
                Clock Out
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600 text-sm">Not clocked in</span>
              <button
                onClick={handleClockIn}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md"
              >
                Clock In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[136px] z-10">
        <div className="max-w-4xl mx-auto flex overflow-x-auto">
          {[
            { key: 'overview', label: 'Info', icon: '📋' },
            { key: 'time', label: 'Time', icon: '⏰' },
            { key: 'tasks', label: 'Tasks', icon: '✓' },
            { key: 'photos', label: 'Photos', icon: '📸' },
            { key: 'materials', label: 'Materials', icon: '📦' },
            { key: 'issues', label: 'Issues', icon: '⚠️' },
            { key: 'report', label: 'Report', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Project Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <div className="font-medium">{project?.description || 'No description'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Budget</div>
                <div className="font-medium text-green-600">${project?.budget?.toLocaleString() || '0'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Start Date</div>
                  <div className="font-medium">{project?.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">End Date</div>
                  <div className="font-medium">{project?.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-700 mb-1">Use the Clock In/Out buttons above</div>
              <div className="text-xs text-blue-600">Your time will be tracked automatically</div>
            </div>
            <Link 
              href="/tradesmen/time"
              className="block bg-white rounded-lg shadow p-4 text-center hover:shadow-md"
            >
              <div className="text-blue-600 font-semibold">View Full Time History →</div>
            </Link>
          </div>
        )}

        {activeTab === 'photos' && (
          <Link
            href={`/tradesmen/project/${projectId}/photos`}
            className="block bg-white rounded-lg shadow p-6 text-center hover:shadow-md"
          >
            <div className="text-6xl mb-4">📸</div>
            <div className="text-xl font-bold text-gray-900 mb-2">Upload Photos</div>
            <div className="text-gray-600">Take or choose photos to upload</div>
            <div className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold inline-block px-8">
              Go to Photo Upload →
            </div>
          </Link>
        )}

        {(activeTab === 'tasks' || activeTab === 'materials' || activeTab === 'issues' || activeTab === 'report') && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              {activeTab === 'tasks' && '✓'}
              {activeTab === 'materials' && '📦'}
              {activeTab === 'issues' && '⚠️'}
              {activeTab === 'report' && '📝'}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'tasks' && 'Task Management'}
              {activeTab === 'materials' && 'Material Requests'}
              {activeTab === 'issues' && 'Report Issues'}
              {activeTab === 'report' && 'Daily Reports'}
            </h3>
            <p className="text-gray-600 mb-6">
              Feature interface coming soon...
            </p>
            <Link
              href="/tradesmen/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
