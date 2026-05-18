'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Document {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  uploaded_by: 'customer' | 'admin';
  category: string;
  description: string;
  created_at: string;
}

interface Photo {
  id: number;
  filename: string;
  original_name: string;
  photo_url: string;
  category: 'before' | 'progress' | 'after' | 'other';
  caption: string | null;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: 'PlayCircle' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: 'CheckCircle' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
};

const photoCategoryLabel: Record<string, string> = {
  before: 'Before',
  progress: 'In Progress',
  after: 'After',
  other: 'Other',
};

const photoCategoryColor: Record<string, string> = {
  before: 'bg-yellow-100 text-yellow-800',
  progress: 'bg-blue-100 text-blue-800',
  after: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800',
};

function formatDate(dateString: string) {
  try {
    const dateOnly = dateString.split('T')[0];
    const [y, m, d] = dateOnly.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function fileIcon(filetype: string) {
  if (filetype.startsWith('image/')) return 'Image';
  if (filetype === 'application/pdf') return 'FileText';
  if (filetype.includes('word')) return 'FileText';
  if (filetype.includes('excel') || filetype.includes('spreadsheet')) return 'FileText';
  return 'File';
}

type TabType = 'overview' | 'updates' | 'photos' | 'documents';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : (params?.id || '');

  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectId) fetchAll();
  }, [projectId]);

  const fetchAll = async () => {
    if (!projectId) { router.push('/portal/dashboard'); return; }
    try {
      const [projRes, photoRes] = await Promise.all([
        fetch(`/api/portal/projects/${projectId}`),
        fetch(`/api/portal/projects/${projectId}/photos`),
      ]);

      if (!projRes.ok) {
        if (projRes.status === 401) router.push('/portal');
        else router.push('/portal/dashboard');
        return;
      }

      const projData = await projRes.json();
      setProject(projData.project);
      setUpdates(projData.updates || []);
      setDocuments(projData.documents || []);

      if (photoRes.ok) {
        const photoData = await photoRes.json();
        setPhotos(photoData.photos || []);
      }
    } catch {
      router.push('/portal/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('category', uploadCategory);
      formData.append('description', uploadDescription);

      const res = await fetch(`/api/portal/projects/${projectId}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        closeUploadModal();
        fetchAll();
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadCategory('general');
    setUploadDescription('');
    setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteDocument = async (docId: number) => {
    if (!confirm('Delete this document?')) return;
    const res = await fetch(
      `/api/portal/projects/${projectId}/documents?documentId=${docId}`,
      { method: 'DELETE' }
    );
    if (res.ok) fetchAll();
    else alert('Failed to delete document');
  };

  if (loading) {
    return (
      <Section padding="xl">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading project…</p>
        </div>
      </Section>
    );
  }

  if (!project) return null;

  const statusInfo = statusConfig[project.status];

  // Group photos by category
  const photosByCategory: Record<string, Photo[]> = {};
  photos.forEach((p) => {
    if (!photosByCategory[p.category]) photosByCategory[p.category] = [];
    photosByCategory[p.category].push(p);
  });

  return (
    <Section padding="xl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link href="/portal/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                <Icon name={statusInfo.icon as any} size={14} className="mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <Link href="/portal/messages">
              <Button variant="primary">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Message Us
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {!!project.budget && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Icon name="DollarSign" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                </div>
              </div>
            </Card>
          )}
          {project.start_date && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon name="Calendar" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(project.start_date)}</p>
                </div>
              </div>
            </Card>
          )}
          {project.end_date && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Icon name="Flag" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target Completion</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(project.end_date)}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-1 overflow-x-auto">
            {(
              [
                { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                { key: 'updates', label: `Updates (${updates.length})`, icon: 'Bell' },
                { key: 'photos', label: `Photos (${photos.length})`, icon: 'Image' },
                { key: 'documents', label: `Documents (${documents.length})`, icon: 'FileText' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-4 px-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon name={tab.icon as any} size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold mb-3">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mr-3 shrink-0" />
                  <div>
                    <p className="font-medium">Project Created</p>
                    <p className="text-sm text-gray-600">{formatDateTime(project.created_at)}</p>
                  </div>
                </div>
                {project.start_date && (
                  <div className="flex items-center">
                    <Icon name="PlayCircle" size={20} className="text-blue-600 mr-3 shrink-0" />
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.start_date)}</p>
                    </div>
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center">
                    <Icon name="Flag" size={20} className="text-orange-600 mr-3 shrink-0" />
                    <div>
                      <p className="font-medium">Target Completion</p>
                      <p className="text-sm text-gray-600">{formatDate(project.end_date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ── UPDATES ── */}
        {activeTab === 'updates' && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Bell" size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No updates posted yet. Check back soon.</p>
              </Card>
            ) : (
              updates.map((u) => (
                <Card key={u.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-2 rounded-lg shrink-0">
                      <Icon name="Bell" size={20} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900">{u.title}</h4>
                        <span className="text-sm text-gray-500 ml-4 shrink-0">{formatDateTime(u.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{u.description}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* ── PHOTOS ── */}
        {activeTab === 'photos' && (
          <div>
            {photos.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Image" size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No progress photos yet. We'll post them as work moves forward.</p>
              </Card>
            ) : (
              Object.entries(photosByCategory).map(([cat, catPhotos]) => (
                <div key={cat} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${photoCategoryColor[cat] || 'bg-gray-100 text-gray-800'}`}>
                      {photoCategoryLabel[cat] || cat}
                    </span>
                    <span className="text-sm text-gray-500">{catPhotos.length} photo{catPhotos.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {catPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        onClick={() => setLightboxPhoto(photo)}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-orange-500 transition focus:outline-none"
                      >
                        <Image
                          src={photo.photo_url}
                          alt={photo.caption || photo.original_name || 'Project photo'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {photo.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                            {photo.caption}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Project Documents</h2>
                <p className="text-sm text-gray-500 mt-0.5">Contracts, permits, invoices, and files shared with you</p>
              </div>
              <Button onClick={() => setShowUploadModal(true)}>
                <Icon name="Upload" size={16} className="mr-2" />
                Upload File
              </Button>
            </div>

            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="FileText" size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No documents yet. Upload a file or wait for us to share documents with you.</p>
                <Button onClick={() => setShowUploadModal(true)} variant="outline">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Upload Your First File
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                        <Icon name={fileIcon(doc.filetype) as any} size={22} className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mt-0.5">
                          {doc.filesize > 0 && <span>{formatFileSize(doc.filesize)}</span>}
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                          <span>•</span>
                          <span className={`font-medium ${doc.uploaded_by === 'admin' ? 'text-orange-600' : 'text-blue-600'}`}>
                            {doc.uploaded_by === 'admin' ? 'Burch Contracting' : 'You'}
                          </span>
                          {doc.category && doc.category !== 'general' && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{doc.category}</span>
                            </>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{doc.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a
                          href={doc.filepath}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={doc.filename}
                        >
                          <Button variant="outline" size="sm" title="Download">
                            <Icon name="Download" size={16} />
                          </Button>
                        </a>
                        {doc.uploaded_by === 'customer' && (
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Icon name="Trash2" size={16} className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setLightboxPhoto(null)}
          >
            <Icon name="X" size={32} />
          </button>
          <div
            className="relative max-w-5xl w-full max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto.photo_url}
              alt={lightboxPhoto.caption || lightboxPhoto.original_name || 'Project photo'}
              className="max-w-full max-h-[80vh] mx-auto rounded-lg object-contain"
            />
            {lightboxPhoto.caption && (
              <p className="text-white text-center mt-3 text-sm">{lightboxPhoto.caption}</p>
            )}
            <div className="flex justify-center mt-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${photoCategoryColor[lightboxPhoto.category] || ''}`}>
                {photoCategoryLabel[lightboxPhoto.category] || lightboxPhoto.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold">Upload File</h3>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-gray-600">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="Upload" size={28} className="text-gray-400 mx-auto mb-2" />
                {uploadFile ? (
                  <div>
                    <p className="font-medium text-gray-800">{uploadFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(uploadFile.size)}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600">Click to select a file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Images — max 10 MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="contract">Contract</option>
                  <option value="permit">Permit</option>
                  <option value="invoice">Invoice</option>
                  <option value="photo">Photo / Image</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  rows={2}
                  placeholder="Add a note about this file…"
                />
              </div>

              {uploadError && (
                <p className="text-sm text-red-600 font-medium">{uploadError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={closeUploadModal} variant="outline" className="flex-1" disabled={uploading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  disabled={!uploadFile || uploading}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading…
                    </span>
                  ) : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
