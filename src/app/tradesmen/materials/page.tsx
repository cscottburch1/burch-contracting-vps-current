'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MaterialRequest {
  id: number;
  project_id: number;
  project_title: string;
  item_name: string;
  quantity: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string | null;
  needed_by_date: string | null;
  status: 'pending' | 'approved' | 'ordered' | 'delivered' | 'denied';
  requested_date: string;
}

export default function MaterialRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<MaterialRequest[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    project_id: '',
    item_name: '',
    quantity: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    reason: '',
    needed_by_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requestsRes, projectsRes] = await Promise.all([
        fetch('/api/tradesmen/materials'),
        fetch('/api/tradesmen/projects')
      ]);

      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.requests || []);
      }

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id || !formData.item_name || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tradesmen/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          project_id: '',
          item_name: '',
          quantity: '',
          priority: 'medium',
          reason: '',
          needed_by_date: ''
        });
        loadData();
      } else {
        toast.error('Failed to submit request');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      case 'ordered': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'approved': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'denied': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/tradesmen/dashboard')} 
            className="flex items-center text-blue-100 hover:text-white mb-2 py-2"
          >
            <span className="text-2xl">←</span>
            <span className="ml-2 text-base">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">📦 Material Requests</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-blue-50 transition-all text-sm"
            >
              {showForm ? 'Cancel' : '+ New Request'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* New Request Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 New Material Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  required
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  placeholder="e.g., 2x4 Lumber, Drywall Screws"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 50 pieces, 2 boxes"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Needed By Date
                </label>
                <input
                  type="date"
                  value={formData.needed_by_date}
                  onChange={(e) => setFormData({ ...formData, needed_by_date: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason / Notes
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Why is this material needed?"
                  rows={3}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
              >
                {submitting ? 'Submitting...' : '✓ Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Request Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">✓</div>
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === 'approved' || r.status === 'ordered').length}
            </div>
            <div className="text-xs text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">📦</div>
            <div className="text-2xl font-bold text-blue-600">
              {requests.filter(r => r.status === 'delivered').length}
            </div>
            <div className="text-xs text-gray-600">Delivered</div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-900">Your Requests</h2>
          </div>
          <div className="divide-y-2 divide-gray-200">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-lg font-semibold mb-2">No Material Requests Yet</p>
                <p className="text-sm">Click "New Request" to submit your first material request.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1">{request.item_name}</div>
                      <div className="text-sm text-gray-600 mb-2">{request.project_title}</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{request.quantity}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.requested_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {request.reason && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border-2 border-gray-200">
                      <span className="font-semibold">Reason:</span> {request.reason}
                    </div>
                  )}
                  {request.needed_by_date && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Needed by:</span> {new Date(request.needed_by_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
