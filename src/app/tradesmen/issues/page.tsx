'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Issue {
  id: number;
  project_id: number;
  project_title: string;
  issue_type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  photo_filename: string | null;
  reported_at: string;
  resolved_at: string | null;
}

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    project_id: '',
    issue_type: 'safety',
    title: '',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [issuesRes, projectsRes] = await Promise.all([
        fetch('/api/tradesmen/issues'),
        fetch('/api/tradesmen/projects')
      ]);

      if (issuesRes.ok) {
        const data = await issuesRes.json();
        setIssues(data.issues || []);
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
    
    if (!formData.project_id || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tradesmen/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          project_id: '',
          issue_type: 'safety',
          title: '',
          description: '',
          severity: 'medium'
        });
        loadData();
      } else {
        toast.error('Failed to submit issue');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error('Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-400';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-400';
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'safety': return '⚠️';
      case 'quality': return '🔍';
      case 'equipment': return '🔧';
      case 'material': return '📦';
      case 'weather': return '🌤️';
      case 'other': return '❓';
      default: return '⚠️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-600 to-red-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/tradesmen/dashboard')} 
            className="flex items-center text-orange-100 hover:text-white mb-2 py-2"
          >
            <span className="text-2xl">←</span>
            <span className="ml-2 text-base">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">⚠️ Issue Reporting</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-orange-50 transition-all text-sm"
            >
              {showForm ? 'Cancel' : '+ Report Issue'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* New Issue Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-orange-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Report New Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  required
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Type *
                </label>
                <select
                  value={formData.issue_type}
                  onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="safety">⚠️ Safety Concern</option>
                  <option value="quality">🔍 Quality Issue</option>
                  <option value="equipment">🔧 Equipment Problem</option>
                  <option value="material">📦 Material Issue</option>
                  <option value="weather">🌤️ Weather Delay</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief summary of the issue"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="low">Low - Minor inconvenience</option>
                  <option value="medium">Medium - Needs attention</option>
                  <option value="high">High - Important issue</option>
                  <option value="critical">Critical - Immediate action required</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 disabled:bg-gray-400 transition-all"
              >
                {submitting ? 'Submitting...' : '⚠️ Submit Issue Report'}
              </button>
            </form>
          </div>
        )}

        {/* Issue Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">🔴</div>
            <div className="text-2xl font-bold text-red-600">
              {issues.filter(i => i.severity === 'critical').length}
            </div>
            <div className="text-xs text-gray-600">Critical</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">🟡</div>
            <div className="text-2xl font-bold text-yellow-600">
              {issues.filter(i => i.status === 'open').length}
            </div>
            <div className="text-xs text-gray-600">Open</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">✓</div>
            <div className="text-2xl font-bold text-green-600">
              {issues.filter(i => i.status === 'resolved').length}
            </div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
            <h2 className="font-bold text-gray-900">Reported Issues</h2>
          </div>
          <div className="divide-y-2 divide-gray-200">
            {issues.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-lg font-semibold mb-2">No Issues Reported</p>
                <p className="text-sm">When you encounter an issue, click "Report Issue" to document it.</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-3xl">{getIssueTypeIcon(issue.issue_type)}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1">{issue.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{issue.project_title}</div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getSeverityColor(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border-2 border-gray-300">
                          {issue.issue_type.toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border-2 border-gray-200 mb-2">
                        {issue.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        Reported: {new Date(issue.reported_at).toLocaleString()}
                      </div>
                      {issue.resolved_at && (
                        <div className="text-xs text-green-600 font-semibold mt-1">
                          ✓ Resolved: {new Date(issue.resolved_at).toLocaleString()}
                        </div>
                      )}
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
