'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Subcontractor } from '@/types/subcontractor';

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
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    checkAuth();
    loadSubcontractors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Defer filtering until data is loaded
    if (!loading && subcontractors.length >= 0) {
      filterSubcontractors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Gÿà
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
        <div className="text-xl">Loading subcontractors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Subcontractor Management</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Total: {stats.total}</p>
          <p>Pending: {stats.pending}</p>
          <p>Active: {stats.active}</p>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
