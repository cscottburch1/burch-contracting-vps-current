'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: number | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/tradesmen/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        if (data.projects?.length > 0) {
          setSelectedProject(data.projects[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (projectId: string) => {
    try {
      const response = await fetch(`/api/tradesmen/tasks?project_id=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    setUpdating(taskId);
    try {
      const response = await fetch('/api/tradesmen/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, status: newStatus })
      });

      if (response.ok) {
        loadTasks(selectedProject);
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    } finally {
      setUpdating(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🔵';
      default: return '⚪';
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/tradesmen/dashboard')} 
            className="flex items-center text-purple-100 hover:text-white mb-2 py-2"
          >
            <span className="text-2xl">←</span>
            <span className="ml-2 text-base">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold">✓ Task Management</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Project Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-2 border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Project
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">⏳</div>
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">🔄</div>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-gray-200">
            <div className="text-3xl mb-1">✅</div>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-2">⏳ Pending Tasks</h2>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-yellow-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{getPriorityIcon(task.priority)}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                      )}
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.due_date && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                            isOverdue(task.due_date) 
                              ? 'bg-red-100 text-red-800 border-red-400' 
                              : 'bg-blue-100 text-blue-800 border-blue-400'
                          }`}>
                            📅 Due: {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task.due_date) && ' (OVERDUE)'}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        disabled={updating === task.id}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                      >
                        {updating === task.id ? 'Updating...' : '▶️ Start Task'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-2">🔄 In Progress</h2>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-blue-300">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">{getPriorityIcon(task.priority)}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                      )}
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.due_date && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                            isOverdue(task.due_date) 
                              ? 'bg-red-100 text-red-800 border-red-400' 
                              : 'bg-blue-100 text-blue-800 border-blue-400'
                          }`}>
                            📅 Due: {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task.due_date) && ' (OVERDUE)'}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, 'pending')}
                          disabled={updating === task.id}
                          className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-700 disabled:bg-gray-400 transition-all"
                        >
                          {updating === task.id ? 'Updating...' : '⏸️ Pause'}
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          disabled={updating === task.id}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
                        >
                          {updating === task.id ? 'Updating...' : '✅ Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 px-2">✅ Completed Tasks</h2>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-xl shadow-lg p-4 border-2 border-green-200 opacity-75">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✅</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900 mb-1 line-through">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-600 mb-2">{task.description}</div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        {task.completed_at && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border-2 border-green-400">
                            ✓ Completed: {new Date(task.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-gray-200">
            <div className="text-5xl mb-3">✓</div>
            <p className="text-lg font-semibold mb-2 text-gray-900">No Tasks Assigned</p>
            <p className="text-sm text-gray-500">Tasks will appear here when they're assigned to you by the project manager.</p>
          </div>
        )}
      </div>
    </div>
  );
}
