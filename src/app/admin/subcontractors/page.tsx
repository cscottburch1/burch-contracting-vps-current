'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Subcontractor } from '@/types/subcontractor';

const SPECIALTIES = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Roofing', 'Flooring', 'Drywall', 'Concrete', 'Landscaping'];
const STATUSES = ['pending', 'approved', 'active', 'suspended', 'rejected'];

export default function SubcontractorsManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pageError, setPageError] = useState<string | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  
  // Modal states
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'SC',
    zip_code: '',
    specialties: [] as string[],
    years_experience: 0,
    insurance_info: '',
    license_number: '',
    status: 'pending',
    admin_notes: '',
    rating: 0,
    business_type: 'llc'
  });

  useEffect(() => {
    checkAuth();
    loadSubcontractors();
  }, []);

  useEffect(() => {
    // Defer filtering until data is loaded
    if (!loading && subcontractors.length >= 0) {
      filterSubcontractors();
    }
  }, [subcontractors, statusFilter, searchQuery, specialtyFilter, loading]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (!res.ok) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      router.push('/admin');
    }
  };

  const loadSubcontractors = async () => {
    try {
      const res = await fetch('/api/admin/subcontractors');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSubcontractors(data.subcontractors || []);
    } catch (err) {
      console.error('Load subcontractors error:', err);
      setError('Failed to load subcontractors');
      setPageError(`Failed to load subcontractors: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterSubcontractors = () => {
    try {
      let filtered = [...subcontractors];

      // Status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(s => s.status === statusFilter);
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(s => 
          (s.company_name && s.company_name.toLowerCase().includes(query)) ||
          (s.contact_name && s.contact_name.toLowerCase().includes(query)) ||
          (s.email && s.email.toLowerCase().includes(query)) ||
          (s.phone && s.phone.includes(query))
        );
      }

      // Specialty filter
      if (specialtyFilter !== 'all') {
        filtered = filtered.filter(s => 
          s.specialties && Array.isArray(s.specialties) && s.specialties.includes(specialtyFilter)
        );
      }

      setFilteredSubcontractors(filtered);
    } catch (err) {
      console.error('Filter error:', err);
      setPageError(`Filtering error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/subcontractors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');
      
      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
      loadSubcontractors();
    } catch (err) {
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const saveNotes = async () => {
    if (!selectedSubcontractor) return;

    try {
      const res = await fetch(`/api/admin/subcontractors/${selectedSubcontractor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSuccess('Notes saved successfully');
      setTimeout(() => setSuccess(''), 3000);
      setShowNotesModal(false);
      loadSubcontractors();
    } catch (err) {
      setError('Failed to save notes');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'SC',
      zip_code: '',
      specialties: [],
      years_experience: 0,
      insurance_info: '',
      license_number: '',
      status: 'pending',
      admin_notes: '',
      rating: 0,
      business_type: 'llc'
    });
    setEditingId(null);
    setShowAddEditForm(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowAddEditForm(true);
  };

  const handleEdit = (sub: Subcontractor) => {
    setFormData({
      company_name: sub.company_name,
      contact_name: sub.contact_name,
      email: sub.email,
      phone: sub.phone,
      address: sub.address || '',
      city: sub.city || '',
      state: sub.state || 'SC',
      zip_code: sub.zip || '',
      specialties: sub.specialties || [],
      years_experience: sub.years_in_business || 0,
      insurance_info: sub.insurance_provider || '',
      license_number: sub.license_number || '',
      status: sub.status,
      admin_notes: sub.admin_notes || '',
      rating: Number(sub.rating) || 0,
      business_type: sub.business_type || 'llc'
    });
    setEditingId(sub.id);
    setShowAddEditForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/admin/subcontractors/${editingId}` : '/api/admin/subcontractors';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(editingId ? 'Subcontractor updated!' : 'Subcontractor created!');
        resetForm();
        loadSubcontractors();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save subcontractor');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Failed to save subcontractor');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/subcontractors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Subcontractor deleted!');
        loadSubcontractors();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete subcontractor');
        setTimeout(() => setError(''), 5000);
      }
    } catch (err) {
      setError('Failed to delete subcontractor');
      setTimeout(() => setError(''), 3000);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const allSpecialties = React.useMemo(() => {
    try {
      return Array.from(
        new Set(
          subcontractors
            .flatMap(s => Array.isArray(s.specialties) ? s.specialties : [])
            .filter(Boolean)
        )
      ).sort();
    } catch (err) {
      console.error('Error computing specialties:', err);
      return [];
    }
  }, [subcontractors]);

  const stats = React.useMemo(() => {
    try {
      return {
        total: subcontractors.length,
        pending: subcontractors.filter(s => s && s.status === 'pending').length,
        active: subcontractors.filter(s => s && s.status === 'active').length,
        approved: subcontractors.filter(s => s && s.status === 'approved').length,
        suspended: subcontractors.filter(s => s && s.status === 'suspended').length,
      };
    } catch (err) {
      console.error('Error computing stats:', err);
      return { total: 0, pending: 0, active: 0, approved: 0, suspended: 0 };
    }
  }, [subcontractors]);

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl">
          <h2 className="text-xl font-bold mb-2">Page Error</h2>
          <p>{pageError}</p>
          <button
            onClick={() => { setPageError(null); loadSubcontractors(); }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Subcontractor Management</h1>
            <p className="text-gray-600 mt-2">Manage your subcontractor network</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              + Add New Subcontractor
            </button>
            <button
              onClick={async () => {
                if (!confirm('Import queued applications now?')) return;
                setLoading(true);
                setError('');
                setSuccess('');
                try {
                  const res = await fetch('/api/admin/subcontractors/import', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    setSuccess(`Imported ${data.imported} entries; skipped ${data.skipped}; remaining ${data.remaining}`);
                    loadSubcontractors();
                  } else {
                    setError(data.error || 'Import failed');
                  }
                } catch (err) {
                  setError('Import failed');
                } finally {
                  setLoading(false);
                  setTimeout(() => { setSuccess(''); setError(''); }, 5000);
                }
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Import Queued
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {stats.approved}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">
              {stats.suspended}
            </div>
            <div className="text-gray-600">Suspended</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Company, name, email..."
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Specialty</label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSpecialtyFilter('all');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddEditForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Subcontractor' : 'Add New Subcontractor'}</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  PIN for Crew App Access
                  <span className="text-xs text-gray-500 ml-2">(6 digits - allows login at /tradesmen)</span>
                </label>
                <input
                  type="text"
                  value={(formData as any).pin || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData({ ...formData, pin: value } as any);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="123456"
                  maxLength={6}
                  pattern="[0-9]*"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set a 6-digit PIN to allow this subcontractor to access the crew mobile app
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialty(spec)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        formData.specialties.includes(spec)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Years Experience</label>
                  <input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Insurance Info</label>
                <textarea
                  value={formData.insurance_info}
                  onChange={(e) => setFormData({ ...formData, insurance_info: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Business Type</label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="sole_proprietor">Sole Proprietor</option>
                    <option value="llc">LLC</option>
                    <option value="corporation">Corporation</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Rating (0-5)</label>
                  <input
                    type="number"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Admin Notes</label>
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subcontractors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Specialties</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Projects</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcontractors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No subcontractors found
                    </td>
                  </tr>
                ) : (
                  filteredSubcontractors.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{sub.company_name || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{sub.license_number || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{sub.contact_name || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{sub.email || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{sub.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.specialties && sub.specialties.slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                          {sub.specialties && sub.specialties.length > 3 && (
                            <span className="text-xs text-gray-600">
                              +{(sub.specialties?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRatingStars(Math.round(Number(sub.rating) || 0))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({(Number(sub.rating) || 0).toFixed(1)})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {sub.total_projects || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubcontractor(sub);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                          >
                            View Details
                          </button>
                          
                          {sub.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(sub.id, 'approved')}
                                className="text-green-600 hover:text-green-800 text-sm font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(sub.id, 'rejected')}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          
                          {(sub.status === 'approved' || sub.status === 'active') && (
                            <button
                              onClick={() => updateStatus(sub.id, sub.status === 'active' ? 'suspended' : 'active')}
                              className={sub.status === 'active' ? 'text-red-600 hover:text-red-800 text-sm font-semibold' : 'text-green-600 hover:text-green-800 text-sm font-semibold'}
                            >
                              {sub.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedSubcontractor(sub);
                              setAdminNotes(sub.admin_notes || '');
                              setShowNotesModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-800 text-sm font-semibold"
                          >
                            {sub.admin_notes ? 'Edit Notes' : 'Add Notes'}
                          </button>
                          
                          <button
                            onClick={() => handleEdit(sub)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(sub.id, sub.company_name)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedSubcontractor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedSubcontractor.company_name || 'N/A'}</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Contact Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Contact:</strong> {selectedSubcontractor.contact_name || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedSubcontractor.email || 'N/A'}</p>
                      <p><strong>Phone:</strong> {selectedSubcontractor.phone || 'N/A'}</p>
                      <p><strong>PIN:</strong> {(selectedSubcontractor as any).pin || 'Not set'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedSubcontractor as any).pin 
                          ? '🟢 Can login to crew app at burchcontracting.com/tradesmen' 
                          : (
                            <button
                              onClick={() => {
                                setShowDetailsModal(false);
                                router.push('/admin/subcontractors/manage');
                                // Let the page load, then trigger edit
                                setTimeout(() => {
                                  const editButtons = document.querySelectorAll('[data-subcontractor-id]');
                                  editButtons.forEach((btn) => {
                                    if (btn.getAttribute('data-subcontractor-id') === String(selectedSubcontractor.id)) {
                                      (btn as HTMLButtonElement).click();
                                    }
                                  });
                                }, 500);
                              }}
                              className="text-red-600 hover:text-red-800 underline"
                            >
                              🔴 Set PIN to enable crew app access
                            </button>
                          )}
                      </p>
                      <p><strong>Address:</strong> {selectedSubcontractor.address || 'N/A'}</p>
                      {selectedSubcontractor.city && (
                        <p><strong>City:</strong> {selectedSubcontractor.city}, {selectedSubcontractor.state} {selectedSubcontractor.zip}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Business Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Business Type:</strong> {selectedSubcontractor.business_type ? selectedSubcontractor.business_type.replace('_', ' ') : 'N/A'}</p>
                      <p><strong>Years in Business:</strong> {selectedSubcontractor.years_in_business || 'N/A'}</p>
                      <p><strong>License #:</strong> {selectedSubcontractor.license_number || 'N/A'}</p>
                      <p><strong>Insurance:</strong> {selectedSubcontractor.insurance_provider || 'N/A'}</p>
                      <p><strong>Insurance Expires:</strong> {selectedSubcontractor.insurance_expiry ? new Date(selectedSubcontractor.insurance_expiry).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>W9 Submitted:</strong> {selectedSubcontractor.w9_submitted ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedSubcontractor.specialties) && selectedSubcontractor.specialties.map((spec, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Performance</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{(Number(selectedSubcontractor.rating) || 0).toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedSubcontractor.total_projects || 0}</div>
                        <div className="text-sm text-gray-600">Total Projects</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedSubcontractor.created_at ? new Date(selectedSubcontractor.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Member Since</div>
                      </div>
                    </div>
                  </div>

                  {selectedSubcontractor.admin_notes && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-bold mb-3 text-gray-900">Admin Notes</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg text-gray-700">
                        {selectedSubcontractor.admin_notes}
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">📎 Documents</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-1">📄</div>
                          <div className="text-xs font-semibold text-gray-700">License</div>
                          <div className="text-xs text-gray-500 mt-1">Upload</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-1">🛡️</div>
                          <div className="text-xs font-semibold text-gray-700">Insurance</div>
                          <div className="text-xs text-gray-500 mt-1">Upload</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-1">📋</div>
                          <div className="text-xs font-semibold text-gray-700">W-9</div>
                          <div className="text-xs text-gray-500 mt-1">Upload</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-center">
                          <div className="text-2xl mb-1">⭐</div>
                          <div className="text-xs font-semibold text-gray-700">Certificates</div>
                          <div className="text-xs text-gray-500 mt-1">Upload</div>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                        onClick={() => {
                          setShowDetailsModal(false);
                          setShowDocumentsModal(true);
                        }}
                      >
                        <span>📤</span>
                        Upload Documents
                      </button>
                      <div className="mt-3 text-xs text-gray-600 text-center">
                        Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => handleEdit(selectedSubcontractor)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && selectedSubcontractor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Admin Notes - {selectedSubcontractor.company_name}
                </h2>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                  placeholder="Add internal notes about this subcontractor..."
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNotes}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Upload Modal */}
        {showDocumentsModal && selectedSubcontractor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  📎 Document Management - {selectedSubcontractor.company_name}
                </h2>

                <DocumentUploadSection subcontractorId={selectedSubcontractor.id} />

                <div className="mt-8 flex gap-4 justify-end">
                  <button
                    onClick={() => {
                      setShowDocumentsModal(false);
                      setShowDetailsModal(true);
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  } catch (err) {
    console.error('Render error:', err);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-2xl">
          <h2 className="text-xl font-bold mb-2">Render Error</h2>
          <p className="mb-4">{err instanceof Error ? err.message : 'Unknown error'}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
}

// Document Upload Component
function DocumentUploadSection({ subcontractorId }: { subcontractorId: number }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDocuments();
  }, [subcontractorId]);

  const loadDocuments = async () => {
    try {
      const res = await fetch(`/api/admin/subcontractors/${subcontractorId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (documentType: string, file: File, title: string, description: string, expirationDate?: string) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('title', title);
      formData.append('description', description);
      if (expirationDate) {
        formData.append('expirationDate', expirationDate);
      }

      const res = await fetch(`/api/admin/subcontractors/${subcontractorId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      setSuccess('Document uploaded successfully!');
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`/api/admin/subcontractors/${subcontractorId}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setSuccess('Document deleted successfully');
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleStatusUpdate = async (documentId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/subcontractors/${subcontractorId}/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed');

      setSuccess('Status updated successfully');
      loadDocuments();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Quick Upload Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['license', 'insurance', 'w9', 'certificate'].map((docType) => (
          <DocumentUploadButton
            key={docType}
            documentType={docType}
            onUpload={handleFileUpload}
            uploading={uploading}
          />
        ))}
      </div>

      {/* Documents List */}
      <div>
        <h3 className="text-lg font-bold mb-4">Uploaded Documents ({documents.length})</h3>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            No documents uploaded yet. Use the buttons above to upload.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {doc.document_type === 'license' ? '📄' :
                       doc.document_type === 'insurance' ? '🛡️' :
                       doc.document_type === 'w9' ? '📋' :
                       doc.document_type === 'certificate' ? '⭐' : '📎'}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Type: {doc.document_type}</span>
                        <span>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</span>
                        {doc.expiration_date && (
                          <span className={new Date(doc.expiration_date) < new Date() ? 'text-red-600 font-semibold' : ''}>
                            Expires: {new Date(doc.expiration_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={doc.status}
                    onChange={(e) => handleStatusUpdate(doc.id, e.target.value)}
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${
                      doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                      doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      doc.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                  <a
                    href={doc.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-semibold"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:underline text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Document Upload Button Component
function DocumentUploadButton({ 
  documentType, 
  onUpload, 
  uploading 
}: { 
  documentType: string; 
  onUpload: (type: string, file: File, title: string, description: string, expirationDate?: string) => void;
  uploading: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const icons: Record<string, string> = {
    license: '📄',
    insurance: '🛡️',
    w9: '📋',
    certificate: '⭐',
  };

  const labels: Record<string, string> = {
    license: 'License',
    insurance: 'Insurance',
    w9: 'W-9 Form',
    certificate: 'Certificate',
  };

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    onUpload(documentType, file, title, description, expirationDate || undefined);
    
    // Reset form
    setFile(null);
    setTitle('');
    setDescription('');
    setExpirationDate('');
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="col-span-2 md:col-span-4 bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
          <span>{icons[documentType]}</span>
          Upload {labels[documentType]}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">File *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              className="w-full border rounded p-2"
            />
            <p className="text-xs text-gray-600 mt-1">Max 10MB • PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g., SC ${labels[documentType]} 2024`}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this document"
              rows={2}
              className="w-full border rounded p-2"
            />
          </div>
          {(documentType === 'license' || documentType === 'insurance' || documentType === 'certificate') && (
            <div>
              <label className="block text-sm font-semibold mb-1">Expiration Date</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={uploading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="bg-white border-2 border-gray-300 hover:border-blue-500 p-4 rounded-lg text-center transition group"
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition">{icons[documentType]}</div>
      <div className="font-semibold text-sm">{labels[documentType]}</div>
      <div className="text-xs text-gray-500 mt-1">Click to upload</div>
    </button>
  );
}
