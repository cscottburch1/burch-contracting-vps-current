'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProfileData {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  logo_url?: string;
  bio?: string;
  services_offered?: string;
  specialties: string[];
  years_in_business?: number;
  license_number?: string;
  insurance_provider?: string;
  profile_theme?: string;
}

export default function SubcontractorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/tradesmen/me');
      if (!res.ok) {
        router.push('/tradesmen');
        return;
      }
      const data = await res.json();
      setProfile(data.user);
      setFormData(data.user);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be less than 2MB');
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', file);

      const res = await fetch('/api/tradesmen/profile/logo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setProfile({ ...profile!, logo_url: data.logo_url });
      setFormData({ ...formData, logo_url: data.logo_url });
      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/tradesmen/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Save failed');

      const data = await res.json();
      setProfile(data.profile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-5 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/tradesmen/dashboard" className="flex items-center text-blue-100 hover:text-white group">
            <span className="text-xl group-hover:translate-x-[-4px] transition-transform">←</span>
            <span className="ml-2 text-sm sm:text-base font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">My Profile</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b">
            <div className="relative">
              {profile.logo_url ? (
                <img
                  src={profile.logo_url}
                  alt="Company Logo"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profile.company_name.charAt(0)}
                </div>
              )}
              {editing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                  {uploadingLogo ? '...' : '📷'}
                </label>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {profile.company_name}
              </h2>
              <p className="text-gray-600 mb-2">{profile.contact_name}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {profile.specialties.map((spec, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📞</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.phone}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                  {editing ? (
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Years in Business</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.years_in_business || ''}
                      onChange={(e) => setFormData({ ...formData, years_in_business: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {profile.years_in_business || 'Not set'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📝</span>
                About Us
              </h3>
              {editing ? (
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell clients about your company, experience, and what makes you unique..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {profile.bio || 'No bio added yet. Click "Edit Profile" to add one.'}
                </div>
              )}
            </div>

            {/* Services Offered */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🔧</span>
                Services Offered
              </h3>
              {editing ? (
                <textarea
                  value={formData.services_offered || ''}
                  onChange={(e) => setFormData({ ...formData, services_offered: e.target.value })}
                  placeholder="List your services, separated by lines..."
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  {profile.services_offered ? (
                    <ul className="space-y-2">
                      {profile.services_offered.split('\n').filter(s => s.trim()).map((service, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 mt-1">✓</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">No services listed yet. Click "Edit Profile" to add services.</span>
                  )}
                </div>
              )}
            </div>

            {/* Business Credentials */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📜</span>
                Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">License Number</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.license_number || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Insurance Provider</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {profile.insurance_provider || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile);
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-400 active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
