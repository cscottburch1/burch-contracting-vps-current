'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subcontractor {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialties?: string[];
  status: string;
  rating: number;
}

export default function SubcontractorsManagementPage() {
  const router = useRouter();
  const [status, setStatus] = useState('initializing');
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus('mounted');
    console.log('Page mounted successfully');
    loadSubcontractors();
  }, []);

  const loadSubcontractors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/subcontractors');
      if (!response.ok) throw new Error('Failed to load');
      const data = await response.json();
      const subs = data.subcontractors || [];
      setSubcontractors(subs);
      setStatus(`loaded ${subs.length} subcontractors`);
      console.log('Loaded subcontractors:', subs.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading');
      setStatus('error');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subcontractor Management - Debug Mode</h1>
          <p className="text-lg">Status: {status}</p>
          {loading && <p className="text-blue-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && subcontractors.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-4">Count: {subcontractors.length}</p>
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Specialties</th>
                  </tr>
                </thead>
                <tbody>
                  {subcontractors.map((sub) => (
                    <tr key={sub.id} className="border-b">
                      <td className="px-4 py-2">{sub.company_name || sub.name}</td>
                      <td className="px-4 py-2">{sub.email}</td>
                      <td className="px-4 py-2">{sub.phone}</td>
                      <td className="px-4 py-2">{sub.status}</td>
                      <td className="px-4 py-2">
                        {sub.specialties && sub.specialties.length > 0 ? (
                          <span>{sub.specialties.slice(0, 2).join(', ')}</span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
