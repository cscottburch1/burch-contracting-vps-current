'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import BottomNav from '@/components/tradesmen/BottomNav';
import QuickActions from '@/components/tradesmen/QuickActions';

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
  status?: string;
}

interface Stats {
  activeProjects: number;
  hoursThisWeek: number;
  pendingRequests: number;
  openIssues: number;
  isClockedIn: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function TradesmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    loadData();

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    
    setDeferredPrompt(null);
  };

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
        router.push('/tradesmen');
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
      router.push('/tradesmen');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/tradesmen/logout', { method: 'POST' });
    toast.success('Logged out successfully!');
    router.push('/tradesmen');
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-5 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-blue-100 text-xs sm:text-sm">Your Active Projects</p>
          </div>
          <div className="flex items-center gap-2">
            {(user as any)?.company_name && (
              <Link
                href="/tradesmen/profile"
                className="bg-white/20 hover:bg-white/30 active:bg-white/40 px-3 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all shadow-lg flex items-center gap-1"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Profile</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 active:bg-white/40 px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-sm transition-all shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        {/* Pending Approval Banner */}
        {(user as any)?.status === 'pending' && (
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg p-4 mb-5 flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-base sm:text-lg">⏳ Application Pending</p>
              <p className="text-sm sm:text-base text-white/90 mt-1">
                Your account is awaiting approval from our admin team. You'll be notified once approved and can access all features.
              </p>
            </div>
          </div>
        )}

        {/* Install App Banner */}
        {showInstallButton && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm sm:text-base">Install the App</p>
                <p className="text-xs sm:text-sm text-green-100">Quick access from your home screen</p>
              </div>
            </div>
            <button
              onClick={handleInstallClick}
              className="bg-white text-green-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-50 active:scale-95 transition-all whitespace-nowrap ml-2"
            >
              Install
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
            <Link href="/tradesmen/time" className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all active:scale-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl">⏱️</span>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.hoursThisWeek}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Hours</div>
                </div>
              </div>
            </Link>
            <Link href="/tradesmen/materials" className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all active:scale-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl">📦</span>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.pendingRequests}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Materials</div>
                </div>
              </div>
            </Link>
            <Link href="/tradesmen/issues" className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all active:scale-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl">⚠️</span>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.openIssues}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Issues</div>
                </div>
              </div>
            </Link>
            <Link href="/tradesmen/reports" className="bg-white rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all active:scale-95">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl sm:text-4xl">📋</span>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.activeProjects}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Reports</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        {projects.length > 0 && stats && (
          <QuickActions projects={projects} isClockedIn={stats.isClockedIn} />
        )}

        {/* Clock Status */}
        {stats?.isClockedIn && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 mb-5 sm:mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                </div>
                <span className="font-bold text-green-900 text-sm sm:text-base">You're Clocked In</span>
              </div>
              <Link href="/tradesmen/time" className="text-green-700 font-semibold text-sm bg-green-100 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">
                View Time →
              </Link>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 text-center">
            <div className="text-gray-300 text-6xl sm:text-7xl mb-4">📋</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Active Projects</h2>
            <p className="text-gray-600 text-sm sm:text-base">You don't have any assigned projects at the moment.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 px-1">Your Projects</h2>
            <div className="space-y-3 sm:space-y-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/tradesmen/project/${project.id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl active:scale-[0.98] transition-all border border-gray-100"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight">{project.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                          <span>👤</span>
                          {project.customer_name}
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {project.description && (
                      <p className="text-sm sm:text-base text-gray-700 mb-3 line-clamp-2 leading-relaxed">{project.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm sm:text-base pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-gray-600 font-medium">
                          {project.role || 'Crew Member'}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <span className="text-lg">📸</span>
                          <span className="font-semibold">{project.photo_count}</span>
                        </span>
                      </div>
                      <div className="text-blue-600 font-bold flex items-center gap-1">
                        Upload
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
