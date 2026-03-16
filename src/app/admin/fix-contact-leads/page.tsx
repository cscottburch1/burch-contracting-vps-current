'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FixContactLeadsPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'running' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const checkStatus = async () => {
    setStatus('checking');
    setError('');
    
    try {
      const response = await fetch('/api/admin/migrate-contact-leads');
      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
        setStatus('idle');
      } else {
        setError(data.error || 'Failed to check status');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error');
      setStatus('error');
    }
  };

  const runMigration = async () => {
    if (!confirm('This will modify your database. Continue?')) {
      return;
    }

    setStatus('running');
    setError('');
    
    try {
      const response = await fetch('/api/admin/migrate-contact-leads', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
        setStatus('success');
      } else {
        setError(data.details || data.error || 'Migration failed');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card padding="lg">
          <h1 className="text-3xl font-bold mb-6">🔧 Fix Contact Form Database</h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 mb-2">What does this fix?</h2>
              <p className="text-blue-800 text-sm">
                This migration fixes the contact form submission error by ensuring the <code>contact_leads</code> table 
                exists with all required columns (attachments, preferred_date, preferred_time, lead_score).
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={checkStatus}
                disabled={status === 'checking' || status === 'running'}
                variant="secondary"
              >
                {status === 'checking' ? 'Checking...' : 'Check Database Status'}
              </Button>

              <Button
                onClick={runMigration}
                disabled={status === 'running' || status === 'checking'}
                variant="primary"
              >
                {status === 'running' ? 'Running Migration...' : 'Run Migration'}
              </Button>
            </div>

            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">✅ Migration Successful!</h3>
                {results?.results && (
                  <ul className="text-sm text-green-800 space-y-1">
                    {results.results.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
                {results?.columns && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-green-900 mb-1">Table columns:</p>
                    <p className="text-xs text-green-700">{results.columns.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">❌ Error</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {results && status === 'idle' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Database Status</h3>
                <div className="text-sm space-y-2">
                  <p><strong>Status:</strong> {results.status}</p>
                  {results.table && <p><strong>Table:</strong> {results.table}</p>}
                  {results.missingColumns?.length > 0 && (
                    <p className="text-orange-600">
                      <strong>Missing columns:</strong> {results.missingColumns.join(', ')}
                    </p>
                  )}
                  {results.columns && (
                    <div>
                      <p className="font-medium mb-1">Existing columns:</p>
                      <p className="text-xs text-gray-600">{results.columns.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">After Migration:</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Test the contact form at <a href="/contact" className="text-blue-600 hover:underline">/contact</a></li>
                <li>Verify submissions appear in <a href="/admin/crm/leads" className="text-blue-600 hover:underline">CRM Leads</a></li>
                <li>You can safely navigate away from this page</li>
              </ol>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
