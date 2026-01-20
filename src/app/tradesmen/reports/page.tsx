'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DailyReport {
  id: number;
  project_id: number;
  report_date: string;
  work_completed: string;
  hours_worked: number | null;
  materials_used: string | null;
  weather_conditions: string | null;
  safety_issues: string | null;
  notes: string | null;
  photos: string | null;
  created_at: string;
}

export default function DailyReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    project_id: '',
    report_date: new Date().toISOString().split('T')[0],
    work_completed: '',
    hours_worked: '',
    materials_used: '',
    weather_conditions: '',
    safety_issues: '',
    notes: '',
    photos: [] as string[]
  });

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadReports(selectedProject);
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
          setFormData(prev => ({ ...prev, project_id: data.projects[0].id.toString() }));
        }
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async (projectId: string) => {
    try {
      const [reportsRes, timeRes] = await Promise.all([
        fetch(`/api/tradesmen/reports?project_id=${projectId}`),
        fetch(`/api/tradesmen/time?project_id=${projectId}`)
      ]);

      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data.reports || []);
      }

      if (timeRes.ok) {
        const data = await timeRes.json();
        setTimeEntries(data.timeEntries || []);
        
        // Auto-calculate today's hours if not already set
        const today = new Date().toISOString().split('T')[0];
        const todayEntries = (data.timeEntries || []).filter((e: any) => 
          new Date(e.clock_in).toISOString().split('T')[0] === today && e.clock_out
        );
        
        if (todayEntries.length > 0 && !formData.hours_worked) {
          const totalHours = todayEntries.reduce((sum: number, e: any) => {
            const hours = (new Date(e.clock_out).getTime() - new Date(e.clock_in).getTime()) / (1000 * 60 * 60);
            return sum + hours - (e.break_minutes || 0) / 60;
          }, 0);
          setFormData(prev => ({ ...prev, hours_worked: totalHours.toFixed(2) }));
        }
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      return null;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => url !== null) as string[];
      const newPhotos = [...uploadedPhotos, ...validUrls];
      setUploadedPhotos(newPhotos);
      setFormData(prev => ({ ...prev, photos: newPhotos }));
    } catch (error) {
      console.error('Upload error:', error);
      alert('Some photos failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url: string) => {
    const newPhotos = uploadedPhotos.filter(p => p !== url);
    setUploadedPhotos(newPhotos);
    setFormData(prev => ({ ...prev, photos: newPhotos }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.project_id || !formData.work_completed) {
      alert('Please fill in required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/tradesmen/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        loadReports(formData.project_id);
        // Reset form but keep project and date
        setUploadedPhotos([]);
        setFormData(prev => ({
          ...prev,
          work_completed: '',
          hours_worked: '',
          materials_used: '',
          weather_conditions: '',
          safety_issues: '',
          notes: '',
          photos: []
        }));
      } else {
        alert('Failed to submit report');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const getWeatherIcon = (weather: string | null) => {
    if (!weather) return '🌤️';
    const w = weather.toLowerCase();
    if (w.includes('rain')) return '🌧️';
    if (w.includes('sun')) return '☀️';
    if (w.includes('cloud')) return '☁️';
    if (w.includes('snow')) return '❄️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/tradesmen/dashboard')} 
            className="flex items-center text-green-100 hover:text-white mb-2 py-2"
          >
            <span className="text-2xl">←</span>
            <span className="ml-2 text-base">Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">📋 Daily Reports</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm && selectedProject) {
                  setFormData(prev => ({ ...prev, project_id: selectedProject }));
                  loadReports(selectedProject);
                }
              }}
              className="bg-white text-green-600 px-4 py-2 rounded-xl font-semibold shadow-lg hover:bg-green-50 transition-all text-sm"
            >
              {showForm ? 'Cancel' : '+ New Report'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Project Selector */}
        {!showForm && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* New Report Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2 border-green-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Daily Work Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project *
                </label>
                <select
                  required
                  value={formData.project_id}
                  onChange={(e) => {
                    setFormData({ ...formData, project_id: e.target.value });
                    loadReports(e.target.value);
                  }}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Report Date
                </label>
                <input
                  type="date"
                  value={formData.report_date}
                  onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Completed Today *
                </label>
                <textarea
                  required
                  value={formData.work_completed}
                  onChange={(e) => setFormData({ ...formData, work_completed: e.target.value })}
                  placeholder="Describe what was accomplished today..."
                  rows={4}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hours Worked
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.hours_worked}
                  onChange={(e) => setFormData({ ...formData, hours_worked: e.target.value })}
                  placeholder="Auto-calculated from time entries"
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Materials Used
                </label>
                <textarea
                  value={formData.materials_used}
                  onChange={(e) => setFormData({ ...formData, materials_used: e.target.value })}
                  placeholder="List materials consumed today..."
                  rows={2}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weather Conditions
                </label>
                <select
                  value={formData.weather_conditions}
                  onChange={(e) => setFormData({ ...formData, weather_conditions: e.target.value })}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select weather...</option>
                  <option value="Clear/Sunny">☀️ Clear/Sunny</option>
                  <option value="Partly Cloudy">⛅ Partly Cloudy</option>
                  <option value="Cloudy">☁️ Cloudy</option>
                  <option value="Light Rain">🌦️ Light Rain</option>
                  <option value="Heavy Rain">🌧️ Heavy Rain</option>
                  <option value="Snow">❄️ Snow</option>
                  <option value="Windy">💨 Windy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Safety Issues or Concerns
                </label>
                <textarea
                  value={formData.safety_issues}
                  onChange={(e) => setFormData({ ...formData, safety_issues: e.target.value })}
                  placeholder="Report any safety concerns..."
                  rows={2}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any other notes or observations..."
                  rows={2}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Photo/Receipt Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📸 Photos & Receipts
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-600">
                      {uploading ? 'Uploading...' : 'Tap to upload photos or receipts'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Multiple images supported</span>
                  </label>
                </div>

                {/* Photo Preview Grid */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {uploadedPhotos.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(url)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition-all"
              >
                {submitting ? 'Submitting...' : '✓ Submit Daily Report'}
              </button>
            </form>
          </div>
        )}

        {/* Reports List */}
        {!showForm && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
            <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
              <h2 className="font-bold text-gray-900">Report History</h2>
              <p className="text-xs text-gray-500 mt-1">Last 30 reports for selected project</p>
            </div>
            <div className="divide-y-2 divide-gray-200">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-3">📋</div>
                  <p className="text-lg font-semibold mb-2">No Reports Yet</p>
                  <p className="text-sm">Click "New Report" to submit your first daily work report.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-lg text-gray-900 mb-1">
                          {new Date(report.report_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        {report.hours_worked && (
                          <div className="text-sm text-gray-600">
                            ⏱️ {report.hours_worked} hours worked
                          </div>
                        )}
                        {report.weather_conditions && (
                          <div className="text-sm text-gray-600">
                            {getWeatherIcon(report.weather_conditions)} {report.weather_conditions}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 mb-2 border-2 border-green-200">
                      <div className="text-xs font-semibold text-green-700 mb-1">WORK COMPLETED</div>
                      <div className="text-sm text-gray-800">{report.work_completed}</div>
                    </div>

                    {report.materials_used && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-2 border-2 border-blue-200">
                        <div className="text-xs font-semibold text-blue-700 mb-1">📦 MATERIALS USED</div>
                        <div className="text-sm text-gray-800">{report.materials_used}</div>
                      </div>
                    )}

                    {report.safety_issues && (
                      <div className="bg-orange-50 rounded-lg p-3 mb-2 border-2 border-orange-200">
                        <div className="text-xs font-semibold text-orange-700 mb-1">⚠️ SAFETY CONCERNS</div>
                        <div className="text-sm text-gray-800">{report.safety_issues}</div>
                      </div>
                    )}

                    {report.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-2 border-2 border-gray-200">
                        <div className="text-xs font-semibold text-gray-700 mb-1">📝 NOTES</div>
                        <div className="text-sm text-gray-800">{report.notes}</div>
                      </div>
                    )}

                    {report.photos && (() => {
                      try {
                        const photoUrls = JSON.parse(report.photos);
                        if (photoUrls.length > 0) {
                          return (
                            <div className="bg-purple-50 rounded-lg p-3 mb-2 border-2 border-purple-200">
                              <div className="text-xs font-semibold text-purple-700 mb-2">📸 PHOTOS & RECEIPTS ({photoUrls.length})</div>
                              <div className="grid grid-cols-4 gap-2">
                                {photoUrls.map((url: string, idx: number) => (
                                  <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={url}
                                      alt={`Photo ${idx + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border-2 border-purple-300 hover:border-purple-500 transition-colors"
                                    />
                                  </a>
                                ))}
                              </div>
                            </div>
                          );
                        }
                      } catch (e) {
                        return null;
                      }
                      return null;
                    })()}

                    <div className="text-xs text-gray-400 mt-2">
                      Submitted: {new Date(report.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
