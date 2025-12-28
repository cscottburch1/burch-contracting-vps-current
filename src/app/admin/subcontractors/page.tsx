'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubcontractorsManagementPage() {
  const router = useRouter();
  const [status, setStatus] = useState('initializing');

  useEffect(() => {
    setStatus('mounted');
    console.log('Page mounted successfully');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Subcontractor Management - Debug Mode</h1>
          <p className="text-lg">Status: {status}</p>
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
