'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Assignment {
  id: number;
  project_id: number;
  project_title: string;
  project_status: string;
  customer_name: string;
  assigned_at: string;
}

interface Project {
  id: number;
  title: string;
  customer_name: string;
  status: string;
}

interface Tradesman {
  id: number;
  name: string;
  email: string;
}

export default function TradesmanAssignments() {
  const router = useRouter();
  const params = useParams();
  const tradesmanId = (params?.id as string) || '';

  const [tradesman, setTradesman] = useState<Tradesman | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    checkAuth();
    loadData();
  }, [tradesmanId]);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
    }
  };

  const loadData = async () => {
    try {
      const [tradesmanRes, assignmentsRes, projectsRes] = await Promise.all([
        fetch(`/api/admin/tradesmen/${tradesmanId}`),
        fetch(`/api/admin/tradesmen/${tradesmanId}/assignments`),
        fetch('/api/admin/projects')
      ]);

      if (tradesmanRes.ok) {
        const data = await tradesmanRes.json();
        setTradesman(data.tradesman);
      }

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments);
      }

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setAvailableProjects(data.projects);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedProject) return;

    try {
      const res = await fetch(`/api/admin/tradesmen/${tradesmanId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(selectedProject) })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Project assigned!');
        setShowAddForm(false);
        setSelectedProject('');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to assign project');
      }
    } catch (err) {
      setError('Failed to assign project');
    }
  };

  const handleRemove = async (assignmentId: number) => {
    if (!confirm('Remove this project assignment?')) return;

    try {
      const res = await fetch(`/api/admin/tradesmen/${tradesmanId}/assignments?assignment_id=${assignmentId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setSuccess('Assignment removed!');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to remove assignment');
      }
    } catch (err) {
      setError('Failed to remove assignment');
    }
  };

  const getUnassignedProjects = () => {
    const assignedProjectIds = assignments.map(a => a.project_id);
    return availableProjects.filter(p => !assignedProjectIds.includes(p.id));
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tradesman?.name}'s Projects</h1>
              <p className="text-gray-600 mt-1">{tradesman?.email}</p>
            </div>
            <Link href="/admin/tradesmen" className="text-blue-600 hover:underline">
              ← Back to Crew
            </Link>
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

          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {showAddForm ? 'Cancel' : '+ Assign to Project'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4">Assign to Project</h3>
              <div className="flex gap-4">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="flex-1 border rounded-lg px-4 py-2"
                >
                  <option value="">Select a project...</option>
                  {getUnassignedProjects().map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title} - {project.customer_name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedProject}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-2">No project assignments yet</p>
                <p>Click "Assign to Project" to add one</p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{assignment.project_title}</h3>
                      <p className="text-gray-600 mb-2">{assignment.customer_name}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded ${
                          assignment.project_status === 'active' ? 'bg-green-100 text-green-800' :
                          assignment.project_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {assignment.project_status}
                        </span>
                        <span>Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(assignment.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Remove
                    </button>
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
