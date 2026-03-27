'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function AdminProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = (params?.id as string) || '';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddSubcontractor, setShowAddSubcontractor] = useState(false);

  // Photo upload state
  const [photoCategory, setPhotoCategory] = useState<'before' | 'progress' | 'after' | 'other'>('progress');
  const [photoCaption, setPhotoCaption] = useState('');

  // Milestone form state
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending' as Milestone['status']
  });

  // Subcontractor form state
  const [subForm, setSubForm] = useState({
    subcontractor_id: '',
    role: '',
    notes: '',
    amount_quoted: '',
    status: 'pending' as Subcontractor['status']
  });
  const [availableSubcontractors, setAvailableSubcontractors] = useState<Array<{ id: number; name: string; company: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      loadAllData();
    }
  }, [projectId]);

  const loadAllData = async () => {
    try {
      await loadProject();
      await loadPhotos();
      await loadMilestones();
      await loadActivities();
      await loadSubcontractors();
      await loadAvailableSubcontractors();
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
      console.error('Failed to load project:', error);
      throw error;
    }
  };

  const loadPhotos = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/photos`);
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos);
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
        setMilestones(data.milestones);
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
        setActivities(data.activities);
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
        setSubcontractors(data.subcontractors);
      }
    } catch (error) {
      console.error('Failed to load subcontractors:', error);
    }
  };

  const loadAvailableSubcontractors = async () => {
    try {
      const res = await fetch('/api/admin/subcontractors');
      if (res.ok) {
        const data = await res.json();
        setAvailableSubcontractors(data.subcontractors);
      }
    } catch (error) {
      console.error('Failed to load available subcontractors:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('category', photoCategory);
    if (photoCaption) formData.append('caption', photoCaption);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/photos`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setPhotoCaption('');
        loadPhotos();
        loadActivities();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Failed to upload photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadPhotos();
        loadActivities();
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneForm),
      });

      if (res.ok) {
        setMilestoneForm({ title: '', description: '', due_date: '', status: 'pending' });
        setShowAddMilestone(false);
        loadMilestones();
        loadActivities();
      }
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: number, status: Milestone['status']) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        loadMilestones();
        loadActivities();
      }
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: number) => {
    if (!confirm('Delete this milestone?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadMilestones();
        loadActivities();
      }
    } catch (error) {
      console.error('Failed to delete milestone:', error);
    }
  };

  const handleAssignSubcontractor = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/subcontractors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subcontractor_id: parseInt(subForm.subcontractor_id),
          role: subForm.role,
          notes: subForm.notes || null,
          amount_quoted: subForm.amount_quoted ? parseFloat(subForm.amount_quoted) : null,
          status: subForm.status,
        }),
      });

      if (res.ok) {
        setSubForm({ subcontractor_id: '', role: '', notes: '', amount_quoted: '', status: 'pending' });
        setShowAddSubcontractor(false);
        loadSubcontractors();
        loadActivities();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to assign subcontractor');
      }
    } catch (error) {
      console.error('Failed to assign subcontractor:', error);
    }
  };

  const handleUpdateSubStatus = async (assignmentId: number, status: Subcontractor['status']) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/subcontractors/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        loadSubcontractors();
        loadActivities();
      }
    } catch (error) {
      console.error('Failed to update subcontractor:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading project...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">Error Loading Project</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retry
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
            <p className="text-gray-600 mt-1">{project.customer_name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {project.street_address}, {project.city}, {project.state} {project.zip_code}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status as keyof typeof statusColors]}`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </span>
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
            <Icon name="Home" className="mr-2" />
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
              {photos?.length || 0}
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
              {milestones?.length || 0}
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
              {activities?.length || 0}
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
              {subcontractors?.length || 0}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.description || 'No description'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 text-sm text-gray-900">${project.budget?.toLocaleString() || '0'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.start_date ? (() => {
                  try {
                    const [year, month, day] = project.start_date.split('-').map(Number);
                    return new Date(year, month - 1, day).toLocaleDateString();
                  } catch {
                    return project.start_date;
                  }
                })() : 'N/A'}</dd>
              </div>
              {project.end_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">End Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{(() => {
                    try {
                      const [year, month, day] = project.end_date.split('-').map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString();
                    } catch {
                      return project.end_date;
                    }
                  })()}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Photos</span>
                <span className="text-2xl font-bold text-blue-600">{photos.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Milestones</span>
                <span className="text-2xl font-bold text-blue-600">
                  {milestones.filter(m => m.status === 'completed').length} / {milestones.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subcontractors</span>
                <span className="text-2xl font-bold text-blue-600">{subcontractors.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Quoted</span>
                <span className="text-2xl font-bold text-green-600">
                  ${subcontractors.reduce((sum, s) => sum + (s.amount_quoted || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Photo</h2>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as Photo['category'])}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="before">Before</option>
                  <option value="progress">Progress</option>
                  <option value="after">After</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer inline-block">
                  {uploadingPhoto ? 'Uploading...' : 'Choose Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(photos || []).map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden group">
                <div className="relative aspect-square">
                  <img
                    src={`/uploads/projects/${photo.filename}`}
                    alt={photo.original_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      <Icon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {photo.category}
                  </span>
                </div>
                {photo.caption && (
                  <div className="p-2">
                    <p className="text-sm text-gray-700">{photo.caption}</p>
                  </div>
                )}
                <div className="px-2 pb-2 text-xs text-gray-500">
                  {new Date(photo.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Icon name="Camera" className="mx-auto text-gray-400 mb-4 w-12 h-12" />
              <p className="text-gray-500">No photos uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'milestones' && (
        <div>
          {!showAddMilestone && (
            <button
              onClick={() => setShowAddMilestone(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6 flex items-center"
            >
              <Icon name="Plus" className="mr-2" />
              Add Milestone
            </button>
          )}

          {showAddMilestone && (
            <form onSubmit={handleCreateMilestone} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">New Milestone</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date*</label>
                  <input
                    type="date"
                    required
                    value={milestoneForm.due_date}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Create Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {(milestones || []).map((milestone, idx) => (
              <div key={milestone.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-300">#{idx + 1}</span>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    </div>
                    {milestone.description && (
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Due: {(() => {
                        try {
                          return new Date(milestone.due_date).toLocaleDateString();
                        } catch {
                          return milestone.due_date || 'N/A';
                        }
                      })()}</span>
                      {milestone.completed_date && (
                        <span className="text-green-600">
                          Completed: {(() => {
                            try {
                              return new Date(milestone.completed_date).toLocaleDateString();
                            } catch {
                              return milestone.completed_date;
                            }
                          })()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={milestone.status}
                      onChange={(e) => handleUpdateMilestoneStatus(milestone.id, e.target.value as Milestone['status'])}
                      className={`rounded-md text-sm font-medium ${statusColors[milestone.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Icon name="X" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {milestones.length === 0 && !showAddMilestone && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Icon name="Target" className="mx-auto text-gray-400 mb-4 w-12 h-12" />
              <p className="text-gray-500">No milestones created yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {(activities || []).map((activity) => (
                <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="Clock" className="text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{activity.user_name}</span>
                      <span>•</span>
                      <span>{(() => {
                        try {
                          return new Date(activity.created_at).toLocaleString();
                        } catch {
                          return activity.created_at || 'N/A';
                        }
                      })()}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">{activity.activity_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activities.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Clock" className="mx-auto text-gray-400 mb-4 w-12 h-12" />
                <p className="text-gray-500">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'subcontractors' && (
        <div>
          {!showAddSubcontractor && (
            <button
              onClick={() => setShowAddSubcontractor(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-6 flex items-center"
            >
              <Icon name="Plus" className="mr-2" />
              Assign Subcontractor
            </button>
          )}

          {showAddSubcontractor && (
            <form onSubmit={handleAssignSubcontractor} className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Assign Subcontractor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcontractor*</label>
                  <select
                    required
                    value={subForm.subcontractor_id}
                    onChange={(e) => setSubForm({ ...subForm, subcontractor_id: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    {(availableSubcontractors || []).map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} - {sub.company}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
                  <input
                    type="text"
                    required
                    value={subForm.role}
                    onChange={(e) => setSubForm({ ...subForm, role: e.target.value })}
                    placeholder="e.g., Plumber, Electrician"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={subForm.amount_quoted}
                    onChange={(e) => setSubForm({ ...subForm, amount_quoted: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={subForm.status}
                    onChange={(e) => setSubForm({ ...subForm, status: e.target.value as Subcontractor['status'] })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={subForm.notes}
                  onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubcontractor(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {(subcontractors || []).map((sub) => (
              <div key={sub.assignment_id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{sub.name}</h3>
                    <p className="text-gray-600">{sub.company} - {sub.role}</p>
                    {sub.notes && (
                      <p className="text-sm text-gray-500 mt-2">{sub.notes}</p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      {sub.amount_quoted && (
                        <div>
                          <span className="text-gray-500">Quoted:</span>
                          <span className="ml-2 font-medium">${sub.amount_quoted.toLocaleString()}</span>
                        </div>
                      )}
                      {sub.amount_paid !== null && (
                        <div>
                          <span className="text-gray-500">Paid:</span>
                          <span className="ml-2 font-medium text-green-600">${sub.amount_paid.toLocaleString()}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Assigned:</span>
                        <span className="ml-2">{new Date(sub.assigned_date).toLocaleDateString()}</span>
                      </div>
                      {sub.completion_date && (
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <span className="ml-2">{new Date(sub.completion_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <select
                    value={sub.status}
                    onChange={(e) => handleUpdateSubStatus(sub.assignment_id, e.target.value as Subcontractor['status'])}
                    className={`rounded-md text-sm font-medium ${statusColors[sub.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {subcontractors.length === 0 && !showAddSubcontractor && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Icon name="Users" className="mx-auto text-gray-400 mb-4 w-12 h-12" />
              <p className="text-gray-500">No subcontractors assigned yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
