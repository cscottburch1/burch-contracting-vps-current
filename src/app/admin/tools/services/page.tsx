'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';
import { fetchWithTimeout, isAbortLikeError } from '@/lib/fetchWithTimeout';

interface Service {
  id: number;
  service_name: string;
  service_slug: string;
  enabled: boolean;
  description: string;
  menu_label: string;
  menu_order: number;
  show_in_calculator: boolean;
  show_in_services_page: boolean;
  show_in_navigation: boolean;
  page_title: string;
  page_content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  hero_image: string;
  featured_image: string;
  call_to_action_text: string;
  call_to_action_url: string;
}

export default function ServiceManagementPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    service_name: '',
    service_slug: '',
    description: '',
    menu_label: '',
  });
  const [deleting, setDeleting] = useState<number | null>(null);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      setAuthError('');
      setLoading(true);
      try {
        const authRes = await fetchWithTimeout('/api/admin/me', { cache: 'no-store' });
        if (!authRes.ok) {
          if (mounted) {
            setAuthError('Your admin session has expired. Redirecting to login...');
            setLoading(false);
          }
          router.push('/admin');
          return;
        }

        if (!mounted) {
          return;
        }

        await loadServices();
      } catch (error) {
        if (mounted) {
          setAuthError(
            isAbortLikeError(error)
              ? 'Session check timed out. Please refresh and try again.'
              : 'Unable to verify admin session. Please refresh and try again.'
          );
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [router]);

  const loadServices = async () => {
    try {
      const res = await fetchWithTimeout('/api/admin/services', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      } else {
        setError('Failed to load services');
      }
    } catch (error) {
      setError(isAbortLikeError(error) ? 'Loading services timed out' : 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: number, updates: Partial<Service>) => {
    setSaving(id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        setSuccess('Service updated successfully!');
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update service');
      }
    } catch (err) {
      setError('Failed to update service');
    } finally {
      setSaving(null);
    }
  };

  const toggleEnabled = async (service: Service) => {
    await updateService(service.id, { enabled: !service.enabled });
  };

  const toggleFeature = async (service: Service, feature: keyof Service) => {
    await updateService(service.id, { [feature]: !service[feature] });
  };

  const startEditing = (service: Service) => {
    setEditingService(service.id);
    setEditForm({
      service_name: service.service_name,
      menu_label: service.menu_label,
      description: service.description,
      page_title: service.page_title || '',
      page_content: service.page_content || '',
      meta_title: service.meta_title || '',
      meta_description: service.meta_description || '',
      meta_keywords: service.meta_keywords || '',
      hero_image: service.hero_image || '',
      featured_image: service.featured_image || '',
      call_to_action_text: service.call_to_action_text || 'Get a Free Quote',
      call_to_action_url: service.call_to_action_url || '/contact',
      menu_order: service.menu_order,
    });
  };

  const cancelEditing = () => {
    setEditingService(null);
    setEditForm({});
  };

  const saveEditing = async (serviceId: number) => {
    setSaving(serviceId);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId, ...editForm }),
      });

      if (res.ok) {
        setSuccess('Service content updated successfully!');
        setEditingService(null);
        setEditForm({});
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update service');
      }
    } catch (err) {
      setError('Failed to update service');
    } finally {
      setSaving(null);
    }
  };

  const createService = async () => {
    if (!createForm.service_name || !createForm.service_slug) {
      setError('Service name and slug are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      if (res.ok) {
        setSuccess('Service created successfully!');
        setShowCreateModal(false);
        setCreateForm({ service_name: '', service_slug: '', description: '', menu_label: '' });
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create service');
      }
    } catch (err) {
      setError('Failed to create service');
    }
  };

  const deleteService = async (serviceId: number, serviceName: string) => {
    if (!confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(serviceId);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/services?id=${serviceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Service deleted successfully!');
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete service');
      }
    } catch (err) {
      setError('Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {authError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {authError}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/tools')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Icon name="ArrowLeft" className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
                <p className="text-gray-600 mt-1">Control which services are available on your website</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 shadow-md whitespace-nowrap"
            >
              <Icon name="Plus" className="w-5 h-5" />
              <span>Create New Service</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Icon name="CheckCircle" className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <Icon name="AlertCircle" className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Info Card */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How Service Management Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Master Toggle:</strong> Disables the service completely across the entire website</li>
                <li>• <strong>Calculator:</strong> Controls if the service appears in pricing calculators</li>
                <li>• <strong>Services Page:</strong> Controls if the service appears on the main services listing</li>
                <li>• <strong>Navigation:</strong> Controls if the service appears in website navigation menus</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6">
          {services.map((service) => {
            const isEditing = editingService === service.id;
            
            return (
              <div
                key={service.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  service.enabled ? 'border-green-200' : 'border-gray-300 opacity-75'
                }`}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{service.service_name}</h3>
                        <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          /{service.service_slug}
                        </span>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => isEditing ? cancelEditing() : startEditing(service)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                          >
                            <Icon name={isEditing ? "X" : "Edit"} className="w-4 h-4" />
                            {isEditing ? 'Cancel' : 'Edit Content'}
                          </button>
                          <button
                            onClick={() => deleteService(service.id, service.service_name)}
                            disabled={deleting === service.id}
                            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50"
                          >
                            <Icon name={deleting === service.id ? "Loader" : "Trash2"} className={`w-4 h-4 ${deleting === service.id ? 'animate-spin' : ''}`} />
                            Delete
                          </button>
                        </div>
                      </div>
                      {!isEditing && (
                        <p className="text-gray-600">{service.description}</p>
                      )}
                    </div>

                    {/* Master Toggle */}
                    <button
                      onClick={() => toggleEnabled(service)}
                      disabled={saving === service.id}
                      className={`ml-6 relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                        service.enabled ? 'bg-green-600' : 'bg-gray-300'
                      } ${saving === service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          service.enabled ? 'translate-x-8' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-lg space-y-6">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">Edit Service Content</h4>
                      
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={editForm.service_name || ''}
                            onChange={(e) => setEditForm({ ...editForm, service_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Menu Label
                          </label>
                          <input
                            type="text"
                            value={editForm.menu_label || ''}
                            onChange={(e) => setEditForm({ ...editForm, menu_label: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Short Description
                        </label>
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Page Content */}
                      <div className="pt-4 border-t border-gray-300">
                        <h5 className="font-semibold text-gray-900 mb-3">Page Content</h5>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Page Title
                            </label>
                            <input
                              type="text"
                              value={editForm.page_title || ''}
                              onChange={(e) => setEditForm({ ...editForm, page_title: e.target.value })}
                              placeholder="e.g., Professional Handyman Services in Greenville, SC"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Page Content (HTML allowed)
                            </label>
                            <textarea
                              value={editForm.page_content || ''}
                              onChange={(e) => setEditForm({ ...editForm, page_content: e.target.value })}
                              rows={6}
                              placeholder="<p>Your service description here...</p>"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SEO Fields */}
                      <div className="pt-4 border-t border-gray-300">
                        <h5 className="font-semibold text-gray-900 mb-3">SEO Settings</h5>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Title (50-60 characters)
                            </label>
                            <input
                              type="text"
                              value={editForm.meta_title || ''}
                              onChange={(e) => setEditForm({ ...editForm, meta_title: e.target.value })}
                              maxLength={200}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(editForm.meta_title || '').length} / 200 characters
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Description (150-160 characters)
                            </label>
                            <textarea
                              value={editForm.meta_description || ''}
                              onChange={(e) => setEditForm({ ...editForm, meta_description: e.target.value })}
                              rows={3}
                              maxLength={300}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              {(editForm.meta_description || '').length} / 300 characters
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Keywords (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={editForm.meta_keywords || ''}
                              onChange={(e) => setEditForm({ ...editForm, meta_keywords: e.target.value })}
                              placeholder="handyman, repairs, installations, Greenville SC"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Images & CTA */}
                      <div className="pt-4 border-t border-gray-300">
                        <h5 className="font-semibold text-gray-900 mb-3">Images & Call-to-Action</h5>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hero Image URL
                              </label>
                              <input
                                type="text"
                                value={editForm.hero_image || ''}
                                onChange={(e) => setEditForm({ ...editForm, hero_image: e.target.value })}
                                placeholder="/images/services/handyman-hero.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image URL
                              </label>
                              <input
                                type="text"
                                value={editForm.featured_image || ''}
                                onChange={(e) => setEditForm({ ...editForm, featured_image: e.target.value })}
                                placeholder="/images/services/handyman-featured.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Call-to-Action Text
                              </label>
                              <input
                                type="text"
                                value={editForm.call_to_action_text || ''}
                                onChange={(e) => setEditForm({ ...editForm, call_to_action_text: e.target.value })}
                                placeholder="Get a Free Quote"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Call-to-Action URL
                              </label>
                              <input
                                type="text"
                                value={editForm.call_to_action_url || ''}
                                onChange={(e) => setEditForm({ ...editForm, call_to_action_url: e.target.value })}
                                placeholder="/contact"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Menu Order (lower numbers appear first)
                            </label>
                            <input
                              type="number"
                              value={editForm.menu_order || 0}
                              onChange={(e) => setEditForm({ ...editForm, menu_order: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                          onClick={cancelEditing}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEditing(service.id)}
                          disabled={saving === service.id}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving === service.id ? (
                            <>
                              <Icon name="Loader" className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Icon name="Save" className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feature Toggles */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    {/* Calculator Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Calculator" className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Calculator</p>
                          <p className="text-xs text-gray-600">Pricing tool</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFeature(service, 'show_in_calculator')}
                        disabled={!service.enabled || saving === service.id}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          service.show_in_calculator && service.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!service.enabled || saving === service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            service.show_in_calculator ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Services Page Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Briefcase" className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Services Page</p>
                          <p className="text-xs text-gray-600">Main listing</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFeature(service, 'show_in_services_page')}
                        disabled={!service.enabled || saving === service.id}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          service.show_in_services_page && service.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!service.enabled || saving === service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            service.show_in_services_page ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Navigation Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Menu" className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Navigation</p>
                          <p className="text-xs text-gray-600">Site menus</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFeature(service, 'show_in_navigation')}
                        disabled={!service.enabled || saving === service.id}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          service.show_in_navigation && service.enabled ? 'bg-blue-600' : 'bg-gray-300'
                        } ${!service.enabled || saving === service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            service.show_in_navigation ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          service.enabled ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className={service.enabled ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        {service.enabled ? 'Service is ACTIVE' : 'Service is DISABLED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Icon name="Briefcase" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No services found</p>
          </div>
        )}
      </div>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create New Service</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.service_name}
                  onChange={(e) => setCreateForm({ ...createForm, service_name: e.target.value })}
                  placeholder="e.g., Pool Installation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.service_slug}
                  onChange={(e) => setCreateForm({ ...createForm, service_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="e.g., pool-installation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly identifier (lowercase, hyphens only). Example: /services/pool-installation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Label
                </label>
                <input
                  type="text"
                  value={createForm.menu_label}
                  onChange={(e) => setCreateForm({ ...createForm, menu_label: e.target.value })}
                  placeholder="e.g., Pools (leave blank to use service name)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Brief description of the service..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <Icon name="AlertCircle" className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createService}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <Icon name="Plus" className="w-4 h-4" />
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
