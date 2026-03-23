'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

interface EmployeeApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  experience_level: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  certifications?: string;
  bio?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export default function EmployeesPage() {
  const [applications, setApplications] = useState<EmployeeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<EmployeeApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/employees');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(apps =>
          apps.map(app => app.id === id ? { ...app, status: newStatus as any } : app)
        );
        fetchApplications();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Icon name="Users" size={36} className="text-green-600" />
                Direct Hire Applications
              </h1>
              <p className="text-gray-600 mt-2">Manage employment applications</p>
            </div>
            <Button href="/admin" variant="outline">
              Back to Admin
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Reviewing</p>
              <p className="text-3xl font-bold text-blue-600">{applications.filter(a => a.status === 'reviewing').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-3xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Status</h2>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'reviewing', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader" size={48} className="text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Icon name="Inbox" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Position</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Experience</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Contact</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Applied</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{app.first_name} {app.last_name}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{app.position}</td>
                      <td className="px-6 py-4 text-gray-600">{app.experience_level}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{app.email}</p>
                        <p className="text-sm text-gray-600">{app.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[app.status]}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-green-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-green-700 rounded">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="font-medium text-gray-900">{selectedApp.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="font-medium text-gray-900">{selectedApp.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{selectedApp.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(selectedApp.address || selectedApp.city) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Address</h3>
                  <p className="text-gray-900">
                    {selectedApp.address && <>{selectedApp.address}<br /></>}
                    {selectedApp.city && <>{selectedApp.city}, {selectedApp.state} {selectedApp.zip}</>}
                  </p>
                </div>
              )}

              {/* Employment Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium text-gray-900">{selectedApp.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience Level</p>
                    <p className="font-medium text-gray-900">{selectedApp.experience_level}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedApp.bio && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.bio}</p>
                </div>
              )}

              {/* Certifications */}
              {selectedApp.certifications && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Certifications</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.certifications}</p>
                </div>
              )}

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'reviewing', 'approved', 'rejected'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedApp.id, status)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedApp.status === status
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Applied: {new Date(selectedApp.created_at).toLocaleString()}<br/>
                  Last Updated: {new Date(selectedApp.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
