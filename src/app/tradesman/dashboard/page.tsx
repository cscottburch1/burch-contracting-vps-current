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

export default function TradesmanDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userRes, projectsRes] = await Promise.all([
        fetch('/api/tradesman/me'),
        fetch('/api/tradesman/projects')
      ]);

      if (!userRes.ok || !projectsRes.ok) {
        router.push('/tradesman');
        return;
      }

      const userData = await userRes.json();
      const projectsData = await projectsRes.json();

      setUser(userData.user);
      setProjects(projectsData.projects || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      router.push('/tradesman');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/tradesman/logout', { method: 'POST' });
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
                href={`/tradesman/project/${project.id}`}
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
