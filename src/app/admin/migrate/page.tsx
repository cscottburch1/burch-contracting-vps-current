'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MigrationPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [passwordResetRunning, setPasswordResetRunning] = useState(false);
  const [projectTrackerRunning, setProjectTrackerRunning] = useState(false);
  const [proposalsRunning, setProposalsRunning] = useState(false);
  const [documentsRunning, setDocumentsRunning] = useState(false);
  const [paymentsRunning, setPaymentsRunning] = useState(false);
  const [leadScoringRunning, setLeadScoringRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [passwordResetResult, setPasswordResetResult] = useState<any>(null);
  const [projectTrackerResult, setProjectTrackerResult] = useState<any>(null);
  const [proposalsResult, setProposalsResult] = useState<any>(null);
  const [documentsResult, setDocumentsResult] = useState<any>(null);
  const [paymentsResult, setPaymentsResult] = useState<any>(null);
  const [leadScoringResult, setLeadScoringResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');
  const [projectTrackerError, setProjectTrackerError] = useState('');
  const [proposalsError, setProposalsError] = useState('');
  const [documentsError, setDocumentsError] = useState('');
  const [paymentsError, setPaymentsError] = useState('');
  const [leadScoringError, setLeadScoringError] = useState('');

  const runMigration = async () => {
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/migrate-subcontractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run migration');
    } finally {
      setRunning(false);
    }
  };

  const runPasswordResetMigration = async () => {
    setPasswordResetRunning(true);
    setPasswordResetError('');
    setPasswordResetResult(null);

    try {
      const res = await fetch('/api/admin/migrate-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordResetResult(data);
      } else {
        setPasswordResetError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setPasswordResetError(err.message || 'Failed to run migration');
    } finally {
      setPasswordResetRunning(false);
    }
  };

  const runProjectTrackerMigration = async () => {
    setProjectTrackerRunning(true);
    setProjectTrackerError('');
    setProjectTrackerResult(null);

    try {
      const res = await fetch('/api/admin/migrate-project-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setProjectTrackerResult(data);
      } else {
        setProjectTrackerError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setProjectTrackerError(err.message || 'Failed to run migration');
    } finally {
      setProjectTrackerRunning(false);
    }
  };

  const runProposalsMigration = async () => {
    setProposalsRunning(true);
    setProposalsError('');
    setProposalsResult(null);

    try {
      const res = await fetch('/api/admin/migrate-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setProposalsResult(data);
      } else {
        setProposalsError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setProposalsError(err.message || 'Failed to run migration');
    } finally {
      setProposalsRunning(false);
    }
  };

  const runDocumentsMigration = async () => {
    setDocumentsRunning(true);
    setDocumentsError('');
    setDocumentsResult(null);

    try {
      const res = await fetch('/api/admin/migrate-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setDocumentsResult(data);
      } else {
        setDocumentsError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setDocumentsError(err.message || 'Failed to run migration');
    } finally {
      setDocumentsRunning(false);
    }
  };

  const runPaymentsMigration = async () => {
    setPaymentsRunning(true);
    setPaymentsError('');
    setPaymentsResult(null);

    try {
      const res = await fetch('/api/admin/migrate-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setPaymentsResult(data);
      } else {
        setPaymentsError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setPaymentsError(err.message || 'Failed to run migration');
    } finally {
      setPaymentsRunning(false);
    }
  };

  const runLeadScoringMigration = async () => {
    setLeadScoringRunning(true);
    setLeadScoringError('');
    setLeadScoringResult(null);

    try {
      const res = await fetch('/api/admin/migrate-lead-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setLeadScoringResult(data);
      } else {
        setLeadScoringError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setLeadScoringError(err.message || 'Failed to run migration');
    } finally {
      setLeadScoringRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Subcontractor Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Subcontractor Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the subcontractor database tables.
          </p>

          {!result && !error && (
            <button
              onClick={runMigration}
              disabled={running}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 text-xl"
            >
              {running ? 'Running Migration...' : 'Run Subcontractor Migration'}
            </button>
          )}

          {result && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2">
                {result.results?.map((line: string, idx: number) => (
                  <div key={idx} className="text-sm">{line}</div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/subcontractors')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Subcontractor Management
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  runMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Password Reset Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Password Reset Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the password reset tokens table for customer portal.
          </p>

          {!passwordResetResult && !passwordResetError && (
            <button
              onClick={runPasswordResetMigration}
              disabled={passwordResetRunning}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 text-xl"
            >
              {passwordResetRunning ? 'Running Migration...' : 'Run Password Reset Migration'}
            </button>
          )}

          {passwordResetResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2">
                {passwordResetResult.results?.map((line: string, idx: number) => (
                  <div key={idx} className="text-sm">{line}</div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/portal')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Customer Portal
                </button>
              </div>
            </div>
          )}

          {passwordResetError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{passwordResetError}</p>
              <button
                onClick={() => {
                  setPasswordResetError('');
                  runPasswordResetMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Project Tracker Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Project Tracker Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the project tracking database tables (projects, milestones, updates, photos, etc.).
          </p>

          {!projectTrackerResult && !projectTrackerError && (
            <button
              onClick={runProjectTrackerMigration}
              disabled={projectTrackerRunning}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 text-xl"
            >
              {projectTrackerRunning ? 'Running Migration...' : 'Run Project Tracker Migration'}
            </button>
          )}

          {projectTrackerResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{projectTrackerResult.message}</p>
                <p className="text-sm">Tables created:</p>
                <ul className="list-disc list-inside text-sm">
                  {projectTrackerResult.tables?.map((table: string, idx: number) => (
                    <li key={idx}>{table}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/projects')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Project Management
                </button>
                <button
                  onClick={() => router.push('/portal')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  View Customer Portal
                </button>
              </div>
            </div>
          )}

          {projectTrackerError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{projectTrackerError}</p>
              <button
                onClick={() => {
                  setProjectTrackerError('');
                  runProjectTrackerMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Proposals Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Proposals System Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the proposals and customer notes database tables.
          </p>

          {!proposalsResult && !proposalsError && (
            <button
              onClick={runProposalsMigration}
              disabled={proposalsRunning}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 text-xl"
            >
              {proposalsRunning ? 'Running Migration...' : 'Run Proposals Migration'}
            </button>
          )}

          {proposalsResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{proposalsResult.message}</p>
                <p className="text-sm">Tables created: proposals, customer_notes</p>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/proposals/create')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  Create Your First Proposal
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {proposalsError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{proposalsError}</p>
              <button
                onClick={() => {
                  setProposalsError('');
                  runProposalsMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Documents Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">📄 Document Management Migration</h1>
          <p className="text-gray-600 mb-8">
            Create database tables for document management across subcontractors, customers, and projects. 
            This enables document uploads, approval workflow, and expiration tracking.
          </p>

          {!documentsResult && !documentsError && (
            <button
              onClick={runDocumentsMigration}
              disabled={documentsRunning}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50 text-xl"
            >
              {documentsRunning ? 'Running Migration...' : 'Run Documents Migration'}
            </button>
          )}

          {documentsResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{documentsResult.message}</p>
                <p className="text-sm">Tables created:</p>
                <ul className="list-disc list-inside text-sm">
                  {documentsResult.tables?.map((table: string, idx: number) => (
                    <li key={idx}>{table}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/subcontractors')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Subcontractors
                </button>
                <button
                  onClick={() => router.push('/admin/customers')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Go to Customers
                </button>
              </div>
            </div>
          )}

          {documentsError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{documentsError}</p>
              <button
                onClick={() => {
                  setDocumentsError('');
                  runDocumentsMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Payments Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Payments Migration (Disabled)</h1>
          <p className="text-gray-600 mb-8">
            Online payments are not enabled for this project. Payment migration is intentionally disabled.
          </p>

          {!paymentsResult && !paymentsError && (
            <button
              onClick={runPaymentsMigration}
              disabled={true}
              className="bg-gray-400 text-white px-8 py-4 rounded-lg font-bold transition disabled:opacity-80 text-xl cursor-not-allowed"
            >
              Online Payments Disabled
            </button>
          )}

          {paymentsResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{paymentsResult.message}</p>
                <p className="text-sm">Tables created:</p>
                <ul className="list-disc list-inside text-sm">
                  {paymentsResult.tables?.map((table: string, idx: number) => (
                    <li key={idx}>{table}</li>
                  ))}
                </ul>
                {paymentsResult.invoicesAltered && (
                  <p className="text-sm mt-2">✓ Invoices table altered with payment tracking columns</p>
                )}
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/invoices')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Invoices
                </button>
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {paymentsError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{paymentsError}</p>
              <button
                onClick={() => {
                  setPaymentsError('');
                  runPaymentsMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Lead Scoring Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10 border-4 border-blue-400">
          <h1 className="text-4xl font-bold mb-4">🎯 Lead Scoring & Intelligence Migration</h1>
          <p className="text-gray-600 mb-6">
            Add intelligent lead scoring to your CRM system. This migration adds the <code className="bg-gray-100 px-2 py-1 rounded">lead_score</code> column 
            to automatically calculate and track lead quality based on budget, timeframe, service type, and referral source.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-semibold text-blue-900">✨ What this enables:</p>
            <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
              <li>Automatic priority assignment (Urgent/High/Medium/Low)</li>
              <li>Lead quality scores (0-375 points)</li>
              <li>Smart email notifications with priority badges</li>
              <li>Visual indicators in CRM dashboard</li>
              <li>Lead aging alerts and recommended actions</li>
            </ul>
          </div>

          {!leadScoringResult && !leadScoringError && (
            <button
              onClick={runLeadScoringMigration}
              disabled={leadScoringRunning}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 text-xl shadow-lg"
            >
              {leadScoringRunning ? 'Running Migration...' : '🚀 Run Lead Scoring Migration'}
            </button>
          )}

          {leadScoringResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{leadScoringResult.message}</p>
                <div className="text-sm mt-3">
                  <p className="font-semibold mb-2">Changes applied:</p>
                  <ul className="list-none space-y-1">
                    {leadScoringResult.results?.map((line: string, idx: number) => (
                      <li key={idx} className="pl-4">{line}</li>
                    ))}
                  </ul>
                </div>
                {leadScoringResult.tables && leadScoringResult.tables.length > 0 && (
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Tables updated:</span> {leadScoringResult.tables.join(', ')}
                  </p>
                )}
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/crm')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  View CRM Dashboard
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Test Contact Form
                </button>
              </div>
            </div>
          )}

          {leadScoringError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{leadScoringError}</p>
              <button
                onClick={() => {
                  setLeadScoringError('');
                  runLeadScoringMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
