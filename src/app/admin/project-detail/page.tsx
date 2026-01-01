'use client';

import { Suspense, useEffect, useState } from 'react';
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

interface AvailableSubcontractor {
  id: number;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  trade: string;
  specialties: string;
}

interface Document {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  category: string;
  description: string;
  uploaded_by: string;
  created_at: string;
}

type TabType = 'overview' | 'photos' | 'documents' | 'milestones' | 'activity' | 'subcontractors';

function ProjectDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [availableSubcontractors, setAvailableSubcontractors] = useState<AvailableSubcontractor[]>([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<AvailableSubcontractor[]>([]);
  const [trades, setTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showSubcontractorForm, setShowSubcontractorForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCategory, setPhotoCategory] = useState<'before' | 'progress' | 'after' | 'other'>('progress');
  const [photoCaption, setPhotoCaption] = useState('');
  
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentCategory, setDocumentCategory] = useState('general');
  const [documentDescription, setDocumentDescription] = useState('');
  
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'delayed'
  });
  
  const [subcontractorForm, setSubcontractorForm] = useState({
    subcontractor_id: '',
    role: '',
    notes: '',
    amount_quoted: '',
    status: 'pending' as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  });
  
  const [selectedTrade, setSelectedTrade] = useState<string>('');
  const [subcontractorSearch, setSubcontractorSearch] = useState<string>('');

  useEffect(() => {
    if (!projectId) {
      setError('No project ID provided');
      setLoading(false);
      return;
    }
    loadAllData();
    loadAvailableSubcontractors();
  }, [projectId]);

  useEffect(() => {
    // Filter subcontractors based on trade and search
    let filtered = availableSubcontractors;
    
    if (selectedTrade) {
      filtered = filtered.filter(sub => sub.trade === selectedTrade);
    }
    
    if (subcontractorSearch) {
      const searchLower = subcontractorSearch.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.company_name.toLowerCase().includes(searchLower) ||
        sub.contact_name.toLowerCase().includes(searchLower) ||
        sub.trade.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredSubcontractors(filtered);
  }, [selectedTrade, subcontractorSearch, availableSubcontractors]);

  const loadAllData = async () => {
    if (!projectId) return;
    
    try {
      await loadProject();
      await loadPhotos();
      await loadDocuments();
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

  const loadDocuments = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
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

  const loadAvailableSubcontractors = async () => {
    try {
      const res = await fetch('/api/admin/subcontractors');
      if (res.ok) {
        const data = await res.json();
        const subs = data.subcontractors || [];
        setAvailableSubcontractors(subs);
        setFilteredSubcontractors(subs);
        
        // Extract unique trades
        const uniqueTrades = Array.from(new Set(subs.map((s: AvailableSubcontractor) => s.trade).filter(Boolean)));
        setTrades(uniqueTrades as string[]);
      }
    } catch (error) {
      console.error('Failed to load available subcontractors:', error);
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile || !projectId) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const response = await fetch(`/api/admin/projects/${projectId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: photoFile.name,
            data: base64String,
            category: photoCategory,
            caption: photoCaption
          })
        });

        if (response.ok) {
          alert('Photo uploaded successfully!');
          setShowPhotoUpload(false);
          setPhotoFile(null);
          setPhotoCaption('');
          await loadPhotos();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to upload photo');
        }
        setUploading(false);
      };
      reader.readAsDataURL(photoFile);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
      setUploading(false);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile || !projectId) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const response = await fetch(`/api/admin/projects/${projectId}/documents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: documentFile.name,
            url: base64String,
            file_type: documentFile.type,
            file_size: documentFile.size,
            category: documentCategory,
            description: documentDescription
          })
        });

        if (response.ok) {
          alert('Document uploaded successfully!');
          setShowDocumentUpload(false);
          setDocumentFile(null);
          setDocumentCategory('general');
          setDocumentDescription('');
          await loadDocuments();
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to upload document');
        }
        setUploading(false);
      };
      reader.readAsDataURL(documentFile);
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document');
      setUploading(false);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(milestoneForm)
      });

      if (response.ok) {
        alert('Milestone created successfully!');
        setShowMilestoneForm(false);
        setMilestoneForm({
          title: '',
          description: '',
          due_date: '',
          status: 'pending'
        });
        await loadMilestones();
        await loadActivities();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create milestone');
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
      alert('Failed to create milestone');
    }
  };

  const handleAssignSubcontractor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !subcontractorForm.subcontractor_id) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/subcontractors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subcontractor_id: parseInt(subcontractorForm.subcontractor_id),
          role: subcontractorForm.role,
          notes: subcontractorForm.notes,
          amount_quoted: subcontractorForm.amount_quoted ? parseFloat(subcontractorForm.amount_quoted) : null,
          status: subcontractorForm.status,
          assigned_date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        alert('Subcontractor assigned successfully!');
        setShowSubcontractorForm(false);
        setSubcontractorForm({
          subcontractor_id: '',
          role: '',
          notes: '',
          amount_quoted: '',
          status: 'pending'
        });
        setSelectedTrade('');
        setSubcontractorSearch('');
        await loadSubcontractors();
        await loadActivities();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to assign subcontractor');
      }
    } catch (error) {
      console.error('Error assigning subcontractor:', error);
      alert('Failed to assign subcontractor');
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/photos/${photoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Photo deleted successfully');
        await loadPhotos();
      } else {
        alert('Failed to delete photo');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo');
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/documents/${docId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Document deleted successfully');
        await loadDocuments();
      } else {
        alert('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleDeleteMilestone = async (milestoneId: number) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Milestone deleted successfully');
        await loadMilestones();
      } else {
        alert('Failed to delete milestone');
      }
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('Failed to delete milestone');
    }
  };

  const handleUpdateMilestoneStatus = async (milestoneId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await loadMilestones();
      } else {
        alert('Failed to update milestone status');
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Failed to update milestone');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Camera';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'FileText';
    return 'File';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Icon name="File" className="mr-2" />
            Documents
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
              {documents.length}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Photos</h2>
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Icon name="Upload" className="mr-2" />
                Upload Photo
              </button>
            </div>
            {photos.length === 0 ? (
              <p className="text-gray-500">No photos uploaded yet</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="border rounded-lg overflow-hidden relative group">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <img 
                        src={`/uploads/${photo.filename}`} 
                        alt={photo.caption || photo.original_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Icon name="Camera" className="text-gray-400 hidden" />
                    </div>
                    <div className="p-2">
                      <p className="text-sm font-medium capitalize">{photo.category}</p>
                      {photo.caption && <p className="text-xs text-gray-500">{photo.caption}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="Trash2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Documents</h2>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Icon name="Upload" className="mr-2" />
                Upload Document
              </button>
            </div>
            {documents.length === 0 ? (
              <p className="text-gray-500">No documents uploaded yet</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center flex-1">
                      <Icon name={getFileIcon(doc.filetype) as IconName} className="text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium">{doc.filename}</p>
                        {doc.description && (
                          <p className="text-sm text-gray-500">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="capitalize">{doc.category}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.filesize)}</span>
                          <span>•</span>
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize">{doc.uploaded_by}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.filepath}
                        download={doc.filename}
                        className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                      >
                        <Icon name="Download" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                      >
                        <Icon name="Trash2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Milestones</h2>
              <button
                onClick={() => setShowMilestoneForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Icon name="Plus" className="mr-2" />
                Add Milestone
              </button>
            </div>
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
                        {milestone.completed_date && (
                          <p className="text-sm text-green-600 mt-1">
                            Completed: {new Date(milestone.completed_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={milestone.status}
                          onChange={(e) => handleUpdateMilestoneStatus(milestone.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[milestone.status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="delayed">Delayed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                        >
                          <Icon name="Trash2" />
                        </button>
                      </div>
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Assigned Subcontractors</h2>
              <button
                onClick={() => setShowSubcontractorForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Icon name="Plus" className="mr-2" />
                Assign Subcontractor
              </button>
            </div>
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

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Upload Photo</h3>
            <form onSubmit={handlePhotoUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="before">Before</option>
                  <option value="progress">Progress</option>
                  <option value="after">After</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label>
                <textarea
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoUpload(false);
                    setPhotoFile(null);
                    setPhotoCaption('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={uploading || !photoFile}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Upload Document</h3>
            <form onSubmit={handleDocumentUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Document File</label>
                <input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
                {documentFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    {documentFile.name} ({formatFileSize(documentFile.size)})
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={documentCategory}
                  onChange={(e) => setDocumentCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="permit">Permit</option>
                  <option value="invoice">Invoice</option>
                  <option value="photo">Photo</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  placeholder="Add a description for this document..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocumentUpload(false);
                    setDocumentFile(null);
                    setDocumentCategory('general');
                    setDocumentDescription('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={uploading || !documentFile}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Milestone Form Modal */}
      {showMilestoneForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add Milestone</h3>
            <form onSubmit={handleCreateMilestone}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={milestoneForm.due_date}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, due_date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={milestoneForm.status}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMilestoneForm(false);
                    setMilestoneForm({
                      title: '',
                      description: '',
                      due_date: '',
                      status: 'pending'
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcontractor Assignment Modal */}
      {showSubcontractorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Assign Subcontractor</h3>
            <form onSubmit={handleAssignSubcontractor}>
              {/* Trade Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Trade</label>
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">All Trades</option>
                  {trades.map((trade) => (
                    <option key={trade} value={trade}>{trade}</option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Subcontractors</label>
                <input
                  type="text"
                  value={subcontractorSearch}
                  onChange={(e) => setSubcontractorSearch(e.target.value)}
                  placeholder="Search by company name, contact, or trade..."
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Subcontractor Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subcontractor *</label>
                <select
                  value={subcontractorForm.subcontractor_id}
                  onChange={(e) => setSubcontractorForm({ ...subcontractorForm, subcontractor_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Choose a subcontractor...</option>
                  {filteredSubcontractors.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.company_name} - {sub.contact_name} ({sub.trade})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {filteredSubcontractors.length} of {availableSubcontractors.length} subcontractors
                </p>
              </div>

              {/* Role/Position */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position</label>
                <input
                  type="text"
                  value={subcontractorForm.role}
                  onChange={(e) => setSubcontractorForm({ ...subcontractorForm, role: e.target.value })}
                  placeholder="e.g., Electrical Work, Plumbing Installation..."
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Amount Quoted */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Quoted</label>
                <input
                  type="number"
                  step="0.01"
                  value={subcontractorForm.amount_quoted}
                  onChange={(e) => setSubcontractorForm({ ...subcontractorForm, amount_quoted: e.target.value })}
                  placeholder="0.00"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={subcontractorForm.status}
                  onChange={(e) => setSubcontractorForm({ ...subcontractorForm, status: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={subcontractorForm.notes}
                  onChange={(e) => setSubcontractorForm({ ...subcontractorForm, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  placeholder="Add any special instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubcontractorForm(false);
                    setSubcontractorForm({
                      subcontractor_id: '',
                      role: '',
                      notes: '',
                      amount_quoted: '',
                      status: 'pending'
                    });
                    setSelectedTrade('');
                    setSubcontractorSearch('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  disabled={!subcontractorForm.subcontractor_id}
                >
                  Assign Subcontractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-gray-600">Loading...</div></div>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
