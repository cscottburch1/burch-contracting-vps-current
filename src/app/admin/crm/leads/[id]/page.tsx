'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadNote, LeadActivity } from '@/types/crm';
import { 
  calculateLeadAge, 
  getLeadAgingStatus, 
  getRecommendedAction,
  formatPhoneForCall,
  generateEmailSubject 
} from '@/lib/leadScoring';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = (params?.id as string) || '';

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  // Note form
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [isImportant, setIsImportant] = useState(false);

  // Convert to customer
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [customerPassword, setCustomerPassword] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Attachment upload
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && leadId) {
      fetchLeadDetails();
    }
  }, [authenticated, leadId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchLeadDetails = async () => {
    try {
      const [leadRes, notesRes, activitiesRes] = await Promise.all([
        fetch(`/api/crm/leads/${leadId}`),
        fetch(`/api/crm/leads/${leadId}/notes`),
        fetch(`/api/crm/leads/${leadId}/activities`)
      ]);

      if (!leadRes.ok) throw new Error('Failed to fetch lead');

      const leadData = await leadRes.json();
      const notesData = await notesRes.json();
      const activitiesData = await activitiesRes.json();

      setLead(leadData.lead);
      setFormData(leadData.lead);
      setNotes(notesData.notes || []);
      setActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update lead');

      const data = await response.json();
      setLead(data.lead);
      setFormData(data.lead);
      setEditMode(false);
      fetchLeadDetails(); // Refresh to get new activities
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          note_type: noteType,
          is_important: isImportant
        })
      });

      if (!response.ok) throw new Error('Failed to add note');

      setNewNote('');
      setNoteType('general');
      setIsImportant(false);
      fetchLeadDetails(); // Refresh data
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleDeleteLead = async () => {
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete lead');

      router.push('/admin/crm');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleQuickStatusUpdate = async (status: Lead['status']) => {
    if (!lead || status === lead.status) return;

    const previousStatus = lead.status;
    setUpdatingStatus(true);
    setLead({ ...lead, status });

    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setLead(data.lead);
      setFormData(data.lead);
      fetchLeadDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      setLead({ ...lead, status: previousStatus });
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConvertToCustomer = async () => {
    if (!customerPassword.trim()) {
      toast.error('Please enter a password for the customer portal');
      return;
    }

    if (!confirm(`Convert ${lead?.name} to a customer with portal access?`)) return;

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: customerPassword })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to convert lead');
      }

      const data = await response.json();
      
      setShowConvertModal(false);
      setCustomerPassword('');
      
      const newCustomerId = data.customerId || data.customer?.id;
      
      toast.success('Lead successfully converted to customer!');
      router.push(`/admin/customers/${newCustomerId}`);
    } catch (error: any) {
      console.error('Error converting lead:', error);
      toast.error(error.message || 'Failed to convert lead to customer');
    }
  };

  const handleAttachmentUpload = async (fileList: FileList) => {
    if (fileList.length === 0) return;
    setUploadingFiles(true);
    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append('file', file));
      const response = await fetch(`/api/crm/leads/${leadId}/attachments`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Upload failed');
      } else {
        toast.success('Files uploaded successfully');
        fetchLeadDetails();
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingFiles(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      qualified: 'bg-yellow-100 text-yellow-800',
      proposal: 'bg-orange-100 text-orange-800',
      negotiation: 'bg-pink-100 text-pink-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return 'Unknown size';

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!authenticated || loading || !lead) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="lg" background="white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
          <span>›</span>
          <a href="/admin/crm" className="hover:text-blue-600">CRM / Leads</a>
          <span>›</span>
          <span className="text-gray-900 font-semibold">{lead.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" href="/admin/crm" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Leads
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600 mt-2">{lead.email} • {lead.phone}</p>
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Lead Status</label>
              <select
                value={lead.status}
                onChange={(e) => handleQuickStatusUpdate(e.target.value as Lead['status'])}
                disabled={updatingStatus}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-900 disabled:opacity-60"
                aria-label="Update lead status"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              {updatingStatus && <span className="text-xs text-gray-500">Updating...</span>}
            </div>
          </div>
          <div className="flex gap-3">
            {!editMode ? (
              <>
                {lead.status !== 'won' && (
                  <Button variant="primary" onClick={() => setShowConvertModal(true)}>
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Convert to Customer
                  </Button>
                )}
                <Button variant="outline" onClick={() => setEditMode(true)}>
                  <Icon name="Edit" size={16} className="mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={handleDeleteLead} className="text-red-600 border-red-300 hover:bg-red-50">
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setEditMode(false);
                  setFormData(lead);
                }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateLead}>
                  <Icon name="Check" size={16} className="mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions & Lead Scoring Card */}
            {lead && (
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-col gap-2">
                      <a 
                        href={`tel:${formatPhoneForCall(lead.phone)}`}
                        className="flex items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                      >
                        <Icon name="Phone" size={20} />
                        <div>
                          <div className="font-semibold">Call Lead</div>
                          <div className="text-sm">{lead.phone}</div>
                        </div>
                      </a>
                      <a 
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(generateEmailSubject({ name: lead.name, serviceType: lead.service_type, status: lead.status }))}`}
                        className="flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      >
                        <Icon name="Mail" size={20} />
                        <div>
                          <div className="font-semibold">Send Email</div>
                          <div className="text-sm">{lead.email}</div>
                        </div>
                      </a>
                      <a 
                        href={`sms:${formatPhoneForCall(lead.phone)}`}
                        className="flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                      >
                        <Icon name="MessageSquare" size={20} />
                        <div>
                          <div className="font-semibold">Send SMS</div>
                          <div className="text-sm">Text message</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Lead Intelligence */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Intelligence</h3>
                    
                    {/* Lead Score */}
                    {lead.lead_score && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Lead Score</div>
                        <div className="text-2xl font-bold text-gray-900">{lead.lead_score}/375</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${
                              (lead.lead_score / 375) >= 0.67 ? 'bg-green-500' :
                              (lead.lead_score / 375) >= 0.47 ? 'bg-blue-500' :
                              (lead.lead_score / 375) >= 0.27 ? 'bg-yellow-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${(lead.lead_score / 375) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Lead Age & Status */}
                    {lead.created_at && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Lead Age</span>
                          <span className="font-semibold text-gray-900">
                            {calculateLeadAge(lead.created_at)} days
                          </span>
                        </div>
                        {(() => {
                          const agingStatus = getLeadAgingStatus(lead.created_at, lead.status);
                          if (agingStatus.severity !== 'normal') {
                            return (
                              <div className={`p-2 rounded text-sm ${
                                agingStatus.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                agingStatus.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {agingStatus.severity === 'critical' ? '🔴' : '⚠️'} {agingStatus.message}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {/* Recommended Action */}
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <div className="text-sm font-semibold text-blue-900 mb-1">
                        💡 Recommended Action
                      </div>
                      <div className="text-sm text-blue-800">
                        {getRecommendedAction({ status: lead.status, createdAt: lead.created_at, lastContactDate: lead.last_contact_date })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Lead Details Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  {editMode ? (
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  ) : (
                    <Badge variant={lead.status === 'won' ? 'green' : lead.status === 'lost' ? 'gray' : 'blue'}>
                      {lead.status}
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  {editMode ? (
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  ) : (
                    <Badge variant={lead.priority === 'urgent' ? 'orange' : 'gray'}>
                      {lead.priority}
                    </Badge>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.service_type || ''}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.service_type || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.budget_range || ''}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.budget_range || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.timeframe || ''}
                      onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.timeframe || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Consultation Date</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={formData.preferred_date || ''}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.preferred_date ? new Date(lead.preferred_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.preferred_time || ''}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.preferred_time || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Value</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={formData.estimated_value || ''}
                      onChange={(e) => setFormData({ ...formData, estimated_value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{formatCurrency(lead.estimated_value)}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.address || 'N/A'}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  {editMode ? (
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{lead.description}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Attachments Section */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Attachments{lead.attachment_details && lead.attachment_details.length > 0 ? ` (${lead.attachment_details.length})` : ''}
                </h3>
                <label className={`cursor-pointer px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${uploadingFiles ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  {uploadingFiles ? 'Uploading...' : '+ Add Files'}
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    disabled={uploadingFiles}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAttachmentUpload(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>
              {(!lead.attachment_details || lead.attachment_details.length === 0) ? (
                <p className="text-sm text-gray-500 py-2">No attachments. Use the button above to add files.</p>
              ) : (
                <div className="space-y-2">
                  {lead.attachment_details.map((attachment) => {
                    const filename = attachment.stored_filename;
                    const isExternal = /^https?:\/\//i.test(attachment.file_path);
                    const normalizedFilename = filename.split('/').pop() || filename;
                    const fileUrl = isExternal
                      ? attachment.file_path
                      : `/api/crm/leads/${lead.id}/attachments/${encodeURIComponent(normalizedFilename)}`;
                    const downloadUrl = isExternal ? fileUrl : `${fileUrl}?download=1`;
                    const displayName = attachment.original_filename || normalizedFilename;
                    const ext = displayName.split('.').pop()?.toLowerCase() || '';
                    const isImage =
                      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(ext) ||
                      attachment.mime_type.startsWith('image/');
                    const isPdf = ext === 'pdf' || attachment.mime_type === 'application/pdf';
                    return (
                      <div key={attachment.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 text-2xl">
                          {isImage ? '🖼️' : isPdf ? '📄' : '📎'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                          <p className="text-xs text-gray-500">
                            {attachment.mime_type} • {formatFileSize(attachment.file_size)} • Uploaded {formatDate(attachment.uploaded_at)}
                          </p>
                          <div className="flex gap-3 mt-0.5">
                            {isImage && (
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View image
                              </a>
                            )}
                            {isPdf && (
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                View PDF
                              </a>
                            )}
                          </div>
                        </div>
                        <a
                          href={downloadUrl}
                          download={!isExternal ? displayName : undefined}
                          className="flex-shrink-0 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Notes Section */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              
              {/* Add Note Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                />
                <div className="flex items-center gap-4">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="general">General</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="follow_up">Follow Up</option>
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Important</span>
                  </label>
                  <Button variant="primary" size="sm" onClick={handleAddNote} className="ml-auto">
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="gray">{note.note_type}</Badge>
                          {note.is_important && (
                            <Badge variant="orange">Important</Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                      {note.created_by && (
                        <p className="text-sm text-gray-500 mt-2">By: {note.created_by}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-gray-900 font-medium">{formatDate(lead.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-gray-900 font-medium">{formatDate(lead.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Contact</p>
                  <p className="text-gray-900 font-medium">{formatDate(lead.last_contact_date)}</p>
                </div>
                {lead.referral_source && (
                  <div>
                    <p className="text-sm text-gray-600">Referral Source</p>
                    <p className="text-gray-900 font-medium">{lead.referral_source}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No activities yet</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Convert to Customer Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Convert to Customer</h2>
                <button onClick={() => setShowConvertModal(false)} className="text-gray-400 hover:text-gray-600">
                  <Icon name="X" size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                This will create a customer portal account for <strong>{lead?.name}</strong> with email <strong>{lead?.email}</strong>.
                They'll be able to log in and view their projects, documents, and updates.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Portal Password *
                </label>
                <input
                  type="password"
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password for customer"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This password will be used for customer portal login. Please share it securely with the customer.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  setShowConvertModal(false);
                  setCustomerPassword('');
                }} className="flex-1">
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={handleConvertToCustomer} className="flex-1">
                  Convert to Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
