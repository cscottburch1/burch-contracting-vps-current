'use client';

import { useState } from 'react';

export default function FixProjectsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackupAndRecreate = async () => {
    if (!confirm('This will:\n1. Rename "projects" table to "projects_old_backup"\n2. Create new "projects" table with correct schema\n3. You can then delete test customers and start fresh\n\nContinue?')) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'backup_and_recreate' })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to fix projects table');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <a
              href="/admin/tools"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Admin Tools
            </a>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fix Projects Table Schema</h1>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Schema Mismatch Detected
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your projects table has the old schema with columns like "title" instead of "project_name".</p>
                  <p className="mt-2">This is preventing:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Projects from displaying in the list</li>
                    <li>Deletion of customers with projects</li>
                    <li>Creating new projects</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Current Situation
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Found <strong>1 project</strong> in the old table:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Customer: Denise Majewski</li>
                    <li>Project: Bath/Shower Conversion</li>
                    <li>Budget: $6,750</li>
                    <li>Start: Jan 5, 2026</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Solution</h2>
              <p className="text-gray-700 mb-4">
                Click the button below to fix the schema. This will:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
                <li>Rename the current "projects" table to "projects_old_backup"</li>
                <li>Create a new "projects" table with the correct schema</li>
                <li>The old project data will be preserved in the backup table</li>
                <li>You can then delete test customers without errors</li>
                <li>New projects will work correctly with the customer portal</li>
              </ol>

              <button
                onClick={handleBackupAndRecreate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : '🔧 Backup Old Table & Create New Schema'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result && result.success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Success!</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p className="font-semibold">{result.message}</p>
                      <div className="mt-4 space-y-2">
                        <p>✅ Old table backed up as "projects_old_backup"</p>
                        <p>✅ New table created with correct schema</p>
                        <p>✅ You can now delete test customers</p>
                        <p>✅ New projects will display correctly</p>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded border border-green-200">
                        <p className="font-semibold text-gray-900 mb-2">Next Steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                          <li>Go to <a href="/admin/customers" className="text-blue-600 hover:underline">Customers</a> and delete test customer</li>
                          <li>Go to <a href="/admin/customers" className="text-blue-600 hover:underline">Customers</a> and add a new customer</li>
                          <li>Open the customer profile and click "+ Add Project"</li>
                          <li>The project will auto-link and appear in the tracker!</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Need the Old Data?</h3>
            <p className="text-gray-600 text-sm mb-3">
              The old project data is preserved in the "projects_old_backup" table. If you need to manually recreate the project:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-semibold mb-2">Project Details to Recreate:</p>
              <ul className="space-y-1">
                <li><strong>Customer:</strong> Denise Majewski</li>
                <li><strong>Title:</strong> Bath/Shower Conversion</li>
                <li><strong>Description:</strong> Remove existing bathtub and install new stand up shower with tile and ada upfits.</li>
                <li><strong>Status:</strong> Active (use "In Progress" in new system)</li>
                <li><strong>Budget:</strong> $6,750.00</li>
                <li><strong>Start Date:</strong> January 5, 2026</li>
                <li><strong>End Date:</strong> January 28, 2026</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
