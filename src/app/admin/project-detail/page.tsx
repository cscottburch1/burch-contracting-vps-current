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
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [showSubcontractorForm, setShowSubcontractorForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  });
  
  // Form states
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCategory, setPhotoCategory] = useState<'before' | 'progress' | 'after' | 'other'>('progress');
  const [photoCaption, setPhotoCaption] = useState('');
  
  const [documentFile, setDocumentFile] = useState<FileList | null>(null);
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
    if (photoFiles.length === 0 || !projectId) return;

    setUploading(true);
    try {
      let successCount = 0;
      let failCount = 0;

      for (const file of photoFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', photoCategory);
          formData.append('caption', photoCaption);
          
          const response = await fetch(`/api/admin/projects/${projectId}/photos`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
            console.error(`Failed to upload ${file.name}`);
          }
        } catch (err) {
          failCount++;
          console.error(`Error uploading ${file.name}:`, err);
        }
      }

      if (successCount > 0) {
        alert(`${successCount} photo(s) uploaded successfully!${failCount > 0 ? ` ${failCount} failed.` : ''}`);
        setShowPhotoUpload(false);
        setPhotoFiles([]);
        setPhotoCaption('');
        await loadPhotos();
      } else {
        alert('All uploads failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile || documentFile.length === 0 || !projectId) return;

    setUploading(true);
    
    try {
      // Upload each file
      for (let i = 0; i < documentFile.length; i++) {
        const file = documentFile[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`/api/admin/projects/${projectId}/documents`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          const data = await response.json();
          alert(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`);
        }
      }
      
      alert(`Successfully uploaded ${documentFile.length} document(s)!`);
      setShowDocumentUpload(false);
      setDocumentFile(null);
      await loadDocuments();
      setUploading(false);
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Failed to upload documents');
      setUploading(false);
    }
  };

  const handleEditProject = () => {
    if (project) {
      setEditForm({
        title: project.title,
        description: project.description || '',
        budget: project.budget?.toString() || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status || 'pending'
      });
      setIsEditingProject(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProject(false);
  };

  const handleSaveProject = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          budget: editForm.budget ? parseFloat(editForm.budget) : null,
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null,
          status: editForm.status
        })
      });

      if (response.ok) {
        alert('Project updated successfully!');
        setIsEditingProject(false);
        await loadProject();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    try {
      if (editingMilestone) {
        // Update existing milestone
        const response = await fetch(`/api/admin/projects/${projectId}/milestones/${editingMilestone.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(milestoneForm)
        });

        if (response.ok) {
          alert('Milestone updated successfully!');
          setShowMilestoneForm(false);
          setEditingMilestone(null);
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
          alert(data.error || 'Failed to update milestone');
        }
      } else {
        // Create new milestone
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
      }
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Failed to save milestone');
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

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description || '',
      due_date: milestone.due_date.split('T')[0],
      status: milestone.status
    });
    setShowMilestoneForm(true);
  };

  const handleMarkMilestoneComplete = async (milestoneId: number) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      if (response.ok) {
        await loadMilestones();
        alert('Milestone marked as complete!');
      } else {
        alert('Failed to complete milestone');
      }
    } catch (error) {
      console.error('Error completing milestone:', error);
      alert('Failed to complete milestone');
    }
  };

  const handleDuplicateMilestone = async (milestone: Milestone) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${milestone.title} (Copy)`,
          description: milestone.description,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        })
      });

      if (response.ok) {
        await loadMilestones();
        alert('Milestone duplicated successfully!');
      } else {
        alert('Failed to duplicate milestone');
      }
    } catch (error) {
      console.error('Error duplicating milestone:', error);
      alert('Failed to duplicate milestone');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('image')) return 'Camera';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'FileText';
    return 'File';
  };

  const isImageFile = (fileType: string) => {
    return fileType.includes('image') || 
           fileType.includes('jpg') || 
           fileType.includes('jpeg') || 
           fileType.includes('png') || 
           fileType.includes('gif') || 
           fileType.includes('webp');
  };

  const handlePreviewDocument = (doc: Document) => {
    // Open document in new tab for preview
    window.open(doc.filepath, '_blank');
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Project Details</h2>
              {!isEditingProject ? (
                <button
                  onClick={handleEditProject}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Icon name="Edit" size={18} />
                  Edit Project
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProject}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Icon name="Check" size={18} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {!isEditingProject ? (
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
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{project.status}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.budget}
                      onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
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
                      {isImageFile(doc.filetype) ? (
                        <img 
                          src={doc.filepath} 
                          alt={doc.filename}
                          className="w-16 h-16 object-cover rounded mr-3 cursor-pointer"
                          onClick={() => handlePreviewDocument(doc)}
                        />
                      ) : (
                        <Icon name={getFileIcon(doc.filetype) as IconName} className="text-gray-400 mr-3" />
                      )}
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
                      <button
                        onClick={() => handlePreviewDocument(doc)}
                        className="bg-green-50 text-green-600 p-2 rounded-md hover:bg-green-100"
                        title="Preview"
                      >
                        <Icon name="Eye" />
                      </button>
                      <a
                        href={doc.filepath}
                        download={doc.filename}
                        className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                        title="Download"
                      >
                        <Icon name="Download" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                        title="Delete"
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Project Milestones</h2>
                {milestones.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {milestones.filter(m => m.status === 'completed').length} of {milestones.length} completed
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setMilestoneForm({
                    title: '',
                    description: '',
                    due_date: '',
                    status: 'pending'
                  });
                  setShowMilestoneForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Icon name="Plus" className="mr-2" />
                Add Milestone
              </button>
            </div>

            {/* Progress Bar */}
            {milestones.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(milestones.filter(m => m.status === 'completed').length / milestones.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {milestones.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Icon name="CheckSquare" className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="text-gray-600 mb-4">No milestones created yet</p>
                <button
                  onClick={() => setShowMilestoneForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first milestone
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {milestones.map((milestone) => {
                  const isOverdue = new Date(milestone.due_date) < new Date() && milestone.status !== 'completed';
                  const daysUntilDue = Math.ceil((new Date(milestone.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={milestone.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      milestone.status === 'completed' ? 'bg-green-50 border-green-200' :
                      isOverdue ? 'bg-red-50 border-red-200' :
                      'bg-white'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {milestone.status === 'completed' ? (
                              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Icon name="Check" size={16} className="text-white" />
                              </div>
                            ) : (
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${
                                milestone.status === 'in_progress' ? 'border-blue-500 bg-blue-100' :
                                isOverdue ? 'border-red-500 bg-red-100' :
                                'border-gray-300 bg-white'
                              }`}></div>
                            )}
                            <h3 className={`font-semibold text-lg ${
                              milestone.status === 'completed' ? 'text-gray-600 line-through' : 'text-gray-900'
                            }`}>
                              {milestone.title}
                            </h3>
                          </div>
                          
                          {milestone.description && (
                            <p className="text-gray-600 text-sm ml-9 mb-2">{milestone.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 ml-9 text-sm">
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} className="text-gray-400" />
                              <span className={isOverdue && milestone.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                Due: {new Date(milestone.due_date).toLocaleDateString()}
                                {milestone.status !== 'completed' && (
                                  <span className="ml-1">({daysUntilDue > 0 ? `${daysUntilDue} days` : 'Overdue'})</span>
                                )}
                              </span>
                            </div>
                            {milestone.completed_date && (
                              <div className="flex items-center gap-1">
                                <Icon name="CheckCircle" size={14} className="text-green-600" />
                                <span className="text-green-600">
                                  Completed: {new Date(milestone.completed_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <select
                            value={milestone.status}
                            onChange={(e) => handleUpdateMilestoneStatus(milestone.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm min-w-[130px] ${
                              statusColors[milestone.status] || 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="delayed">Delayed</option>
                          </select>
                          
                          <div className="flex gap-1">
                            {milestone.status !== 'completed' && (
                              <button
                                onClick={() => handleMarkMilestoneComplete(milestone.id)}
                                className="bg-green-50 text-green-600 p-1.5 rounded-md hover:bg-green-100 flex-1"
                                title="Mark Complete"
                              >
                                <Icon name="CheckCircle" size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditMilestone(milestone)}
                              className="bg-blue-50 text-blue-600 p-1.5 rounded-md hover:bg-blue-100 flex-1"
                              title="Edit"
                            >
                              <Icon name="Edit" size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicateMilestone(milestone)}
                              className="bg-gray-50 text-gray-600 p-1.5 rounded-md hover:bg-gray-100 flex-1"
                              title="Duplicate"
                            >
                              <Icon name="Copy" size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMilestone(milestone.id)}
                              className="bg-red-50 text-red-600 p-1.5 rounded-md hover:bg-red-100 flex-1"
                              title="Delete"
                            >
                              <Icon name="Trash2" size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            <h3 className="text-xl font-semibold mb-4">Upload Photos</h3>
            <form onSubmit={handlePhotoUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Photos
                  <span className="ml-2 text-xs text-blue-600 font-normal">(Ctrl+Click or Shift+Click for multiple)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                  className="w-full border-2 border-dashed border-gray-300 rounded-md p-3 hover:border-blue-500 cursor-pointer"
                  required
                />
                {photoFiles.length > 0 ? (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-700">✓ {photoFiles.length} file(s) selected</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {photoFiles.map(f => f.name).join(', ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Tip: Hold Ctrl (Windows) or Cmd (Mac) to select multiple files at once</p>
                )}
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
                    setPhotoFiles([]);
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
                  disabled={uploading || photoFiles.length === 0}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Document File(s)</label>
                <input
                  type="file"
                  onChange={(e) => setDocumentFile(e.target.files)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  multiple
                  required
                />
                {documentFile && documentFile.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {Array.from(documentFile).map((file, index) => (
                      <p key={index} className="text-sm text-gray-500">
                        {file.name} ({formatFileSize(file.size)})
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Max 10MB per file. You can select multiple files.</p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDocumentUpload(false);
                    setDocumentFile(null);
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
            <h3 className="text-xl font-semibold mb-4">{editingMilestone ? 'Edit Milestone' : 'Add Milestone'}</h3>
            <form onSubmit={handleCreateMilestone}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Construction Phase</label>
                <select
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select a phase...</option>
                  <option value="Pre-Construction">Pre-Construction</option>
                  <option value="Demolition">Demolition</option>
                  <option value="Site Preparation">Site Preparation</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Framing">Framing</option>
                  <option value="Rough-In Plumbing">Rough-In Plumbing</option>
                  <option value="Rough-In Electrical">Rough-In Electrical</option>
                  <option value="Rough-In HVAC">Rough-In HVAC</option>
                  <option value="Insulation">Insulation</option>
                  <option value="Drywall Installation">Drywall Installation</option>
                  <option value="Interior Painting">Interior Painting</option>
                  <option value="Flooring">Flooring</option>
                  <option value="Cabinetry & Countertops">Cabinetry & Countertops</option>
                  <option value="Trim & Finish Carpentry">Trim & Finish Carpentry</option>
                  <option value="Plumbing Fixtures">Plumbing Fixtures</option>
                  <option value="Electrical Fixtures">Electrical Fixtures</option>
                  <option value="Final Inspections">Final Inspections</option>
                  <option value="Exterior Finishes">Exterior Finishes</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Final Walkthrough">Final Walkthrough</option>
                  <option value="Project Closeout">Project Closeout</option>
                  <option value="Custom">Custom (Enter Below)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter custom title or modify selected phase"
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
                    setEditingMilestone(null);
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
                  {editingMilestone ? 'Update Milestone' : 'Create Milestone'}
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
