'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  customer_name: string;
  role: string;
  photo_count: number;
  start_date: string;
  end_date: string | null;
}

interface User {
  name: string;
  email: string;
}

interface Stats {
  activeProjects: number;
  hoursThisWeek: number;
  pendingRequests: number;
  openIssues: number;
  isClockedIn: boolean;
}

export default function TradesmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, projectsRes, timeRes, materialsRes, issuesRes] = await Promise.all([
        fetch('/api/tradesmen/me'),
        fetch('/api/tradesmen/projects'),
        fetch('/api/tradesmen/time'),
        fetch('/api/tradesmen/materials'),
        fetch('/api/tradesmen/issues')
      ]);

      if (!userRes.ok || !projectsRes.ok) {
        router.push('/tradesman');
        return;
      }

      const userData = await userRes.json();
      const projectsData = await projectsRes.json();

      setUser(userData.user);
      setProjects(projectsData.projects || []);

      // Calculate stats
      const timeData = timeRes.ok ? await timeRes.json() : { timeEntries: [], activeEntry: null };
      const materialsData = materialsRes.ok ? await materialsRes.json() : { requests: [] };
      const issuesData = issuesRes.ok ? await issuesRes.json() : { issues: [] };

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const hoursThisWeek = timeData.timeEntries
        .filter((entry: any) => new Date(entry.clock_in) > weekAgo && entry.clock_out)
        .reduce((total: number, entry: any) => {
          const hours = (new Date(entry.clock_out).getTime() - new Date(entry.clock_in).getTime()) / (1000 * 60 * 60);
          return total + hours - (entry.break_minutes || 0) / 60;
        }, 0);

      setStats({
        activeProjects: projectsData.projects?.length || 0,
        hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
        pendingRequests: materialsData.requests?.filter((r: any) => r.status === 'pending').length || 0,
        openIssues: issuesData.issues?.filter((i: any) => i.status === 'open').length || 0,
        isClockedIn: !!timeData.activeEntry
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      router.push('/tradesman');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/tradesmen/logout', { method: 'POST' });
    router.push('/tradesman');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}</h1>
            <p className="text-blue-100 text-sm">Your Active Projects</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-500 text-sm mb-1">Active Projects</div>
              <div className="text-3xl font-bold text-blue-600">{stats.activeProjects}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-500 text-sm mb-1">Hours This Week</div>
              <div className="text-3xl font-bold text-green-600">{stats.hoursThisWeek}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-500 text-sm mb-1">Material Requests</div>
              <div className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-500 text-sm mb-1">Open Issues</div>
              <div className="text-3xl font-bold text-red-600">{stats.openIssues}</div>
            </div>
          </div>
        )}

        {/* Clock Status */}
        {stats?.isClockedIn && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-900">You're clocked in</span>
            </div>
            <Link href="/tradesman/time" className="text-green-700 font-medium">
              View Time →
            </Link>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Projects</h2>
            <p className="text-gray-600">You don't have any assigned projects at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/tradesmen/project/${project.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.customer_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        <span className="font-semibold">{project.role || 'Crew Member'}</span>
                      </span>
                      <span className="text-gray-500">
                        📸 {project.photo_count} photos
                      </span>
                    </div>
                    <div className="text-blue-600 font-semibold">
                      Upload Photos →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
