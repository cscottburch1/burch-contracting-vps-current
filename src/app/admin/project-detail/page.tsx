'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon, { IconName } from '@/components/ui/Icon';

interface Project {
  id: number;
  customer_name: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string | null;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface Photo {
  id: number;
  filename: string;
  original_name: string;
  category: 'before' | 'progress' | 'after' | 'other';
  caption: string | null;
  created_at: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  completed_date: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  order_index: number;
}

interface Activity {
  id: number;
  activity_type: string;
  description: string;
  user_name: string;
  created_at: string;
}

interface Subcontractor {
  id: number;
  assignment_id: number;
  name: string;
  company: string;
  role: string;
  notes: string | null;
  amount_quoted: number | null;
  amount_paid: number | null;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assigned_date: string;
  start_date: string | null;
  completion_date: string | null;
}

type TabType = 'overview' | 'photos' | 'milestones' | 'activity' | 'subcontractors';

export default function ProjectDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }
    loadAllData();
  }, [projectId]);

  const loadAllData = async () => {
    if (!projectId) return;
    
    try {
      await loadProject();
      await loadPhotos();
      await loadMilestones();
      await loadActivities();
      await loadSubcontractors();
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load project data');
      setLoading(false);
    }
  };

  const loadProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load project: ${res.status}`);
      }
      const data = await res.json();
      setProject(data.project);
      setLoading(false);
    } catch (error: any) {
      throw error;
    }
  };

  const loadPhotos = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/photos`);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const loadMilestones = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones`);
      if (res.ok) {
        const data = await res.json();
        setMilestones(data.milestones || []);
      }
    } catch (error) {
      console.error('Failed to load milestones:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/activity?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const loadSubcontractors = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/subcontractors`);
      if (res.ok) {
        const data = await res.json();
        setSubcontractors(data.assignments || []);
      }
    } catch (error) {
      console.error('Failed to load subcontractors:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Error Loading Project</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button 
          onClick={() => router.push('/admin/projects')} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Project not found</div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    on_hold: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    delayed: 'bg-orange-100 text-orange-800',
    confirmed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <Icon name="ArrowLeft" className="mr-2" />
          Back to Projects
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600 mt-1">Customer: {project.customer_name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {project.street_address}, {project.city}, {project.state} {project.zip_code}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="FileText" className="mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'photos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="Camera" className="mr-2" />
            Photos
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {photos.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'milestones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="Target" className="mr-2" />
            Milestones
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {milestones.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="Clock" className="mr-2" />
            Activity
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {activities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('subcontractors')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'subcontractors'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="Users" className="mr-2" />
            Subcontractors
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {subcontractors.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{project.description || 'No description'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">${project.budget?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Photos</h2>
            {photos.length === 0 ? (
              <p className="text-gray-500">No photos uploaded yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Icon name="Camera" className="text-gray-400" />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium">{photo.category}</p>
                      {photo.caption && <p className="text-xs text-gray-500">{photo.caption}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Milestones</h2>
            {milestones.length === 0 ? (
              <p className="text-gray-500">No milestones created yet</p>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{milestone.title}</h3>
                        {milestone.description && (
                          <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Due: {new Date(milestone.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[milestone.status] || 'bg-gray-100 text-gray-800'}`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {activities.length === 0 ? (
              <p className="text-gray-500">No activity yet</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 border-b pb-3">
                    <Icon name="Clock" className="text-gray-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.user_name} • {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subcontractors' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Assigned Subcontractors</h2>
            {subcontractors.length === 0 ? (
              <p className="text-gray-500">No subcontractors assigned yet</p>
            ) : (
              <div className="space-y-4">
                {subcontractors.map((sub) => (
                  <div key={sub.assignment_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{sub.company}</h3>
                        <p className="text-sm text-gray-600">{sub.role}</p>
                        {sub.notes && <p className="text-sm text-gray-500 mt-2">{sub.notes}</p>}
                        {sub.amount_quoted && (
                          <p className="text-sm text-gray-600 mt-2">
                            Quote: ${sub.amount_quoted.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[sub.status] || 'bg-gray-100 text-gray-800'}`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
