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
              <p className="font-semibold">Count: {subcontractors.length}</p>
              <pre className="mt-2 bg-gray-100 p-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(subcontractors[0], null, 2)}
              </pre>
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
