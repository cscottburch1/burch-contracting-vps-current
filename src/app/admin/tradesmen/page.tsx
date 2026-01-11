'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Tradesman {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  pin: string;
  is_active: boolean;
  created_at: string;
}

export default function TradesmenManagement() {
  const router = useRouter();
  const [tradesmen, setTradesmen] = useState<Tradesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    is_active: true
  });

  useEffect(() => {
    checkAuth();
    loadTradesmen();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
    }
  };

  const loadTradesmen = async () => {
    try {
      const res = await fetch('/api/admin/tradesmen');
      if (res.ok) {
        const data = await res.json();
        setTradesmen(data.tradesmen);
      }
    } catch (err) {
      setError('Failed to load tradesmen');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      pin: '',
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate PIN
    if (!/^\d{6}$/.test(formData.pin)) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    try {
      const url = editingId ? `/api/admin/tradesmen/${editingId}` : '/api/admin/tradesmen';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(editingId ? 'Tradesman updated!' : 'Tradesman created!');
        resetForm();
        loadTradesmen();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save tradesman');
      }
    } catch (err) {
      setError('Failed to save tradesman');
    }
  };

  const handleEdit = (tradesman: Tradesman) => {
    setFormData({
      name: tradesman.name,
      email: tradesman.email,
      phone: tradesman.phone || '',
      pin: tradesman.pin,
      is_active: tradesman.is_active
    });
    setEditingId(tradesman.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This will remove all project assignments for this person.')) return;

    try {
      const res = await fetch(`/api/admin/tradesmen/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Tradesman deleted!');
        loadTradesmen();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete tradesman');
      }
    } catch (err) {
      setError('Failed to delete tradesman');
    }
  };

  const toggleActive = async (tradesman: Tradesman) => {
    try {
      const res = await fetch(`/api/admin/tradesmen/${tradesman.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !tradesman.is_active })
      });

      if (res.ok) {
        loadTradesmen();
      }
    } catch (err) {
      setError('Failed to toggle status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crew & Subcontractor Management</h1>
              <p className="text-gray-600 mt-1">Manage field workers who can upload photos and track time</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {showForm ? 'Cancel' : '+ Add Person'}
              </button>
              <Link href="/admin/tools" className="text-blue-600 hover:underline self-center">
                ← Back to Tools
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Person' : 'Add New Person'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="(864) 555-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">6-Digit PIN *</label>
                  <input
                    type="text"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full border rounded-lg px-4 py-2 font-mono text-lg"
                    placeholder="123456"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">They'll use this PIN to login on mobile</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="font-medium">Active (can login)</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {tradesmen.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-2">No crew members or subcontractors yet</p>
                <p>Click "Add Person" to create their account</p>
              </div>
            ) : (
              tradesmen.map((person) => (
                <div key={person.id} className="border rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{person.name}</h3>
                        {person.is_active ? (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-gray-600">
                        <p>📧 {person.email}</p>
                        {person.phone && <p>📱 {person.phone}</p>}
                        <p className="font-mono">🔑 PIN: {person.pin}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/tradesmen/${person.id}/assignments`}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
                      >
                        Projects
                      </Link>
                      <button
                        onClick={() => toggleActive(person)}
                        className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
                          person.is_active
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {person.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(person)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
