'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminToolsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
      return;
    }
    const data = await res.json();
    setCurrentUser(data.user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Tools</h1>
              <p className="text-xl text-gray-600">Essential management and business tools</p>
            </div>
            <a
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-bold"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Business Operations - Most Essential */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">💼</span>
            Business Operations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/crm"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group border-l-4 border-blue-600"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📋</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  CRM / Leads
                </h3>
              </div>
              <p className="text-gray-600">
                Manage leads, track follow-ups, and convert to customers
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/projects"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group border-l-4 border-green-600"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🏗️</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Projects
                </h3>
              </div>
              <p className="text-gray-600">
                View and manage all active and completed projects
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/subcontractors/manage"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group border-l-4 border-orange-600"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🔨</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Subcontractors
                </h3>
              </div>
              <p className="text-gray-600">
                Add, edit, delete, and manage contractor information and projects
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/invoices"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group border-l-4 border-purple-600"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🧾</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Invoices
                </h3>
              </div>
              <p className="text-gray-600">
                View, create, and manage customer invoices and payment tracking
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/proposals"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group border-l-4 border-indigo-600"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📝</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Proposals
                </h3>
              </div>
              <p className="text-gray-600">
                Create and manage professional project proposals for clients
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/customers"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">👤</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Customer Portal Users
                </h3>
              </div>
              <p className="text-gray-600">
                Manage customer accounts and portal access
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                View →
              </div>
            </a>
          </div>
        </section>

        {/* Website & Content Management */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">🌐</span>
            Website & Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/tools/banners"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📢</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Homepage Banners
                </h3>
              </div>
              <p className="text-gray-600">
                Create and manage promotional banners on homepage
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/tools/services"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🎨</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Services
                </h3>
              </div>
              <p className="text-gray-600">
                Enable/disable services and control where they appear on the website
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/tools/projects"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🏠</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Featured Projects
                </h3>
              </div>
              <p className="text-gray-600">
                Showcase completed projects on homepage with photos
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>
          </div>
        </section>

        {/* Team & Communication */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">👥</span>
            Team & Communication
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/tradesmen"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">👷</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Field Crew
                </h3>
              </div>
              <p className="text-gray-600">
                Manage field workers, photo uploads, time tracking, and assignments
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/tools/notifications"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📧</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Email & SMS
                </h3>
              </div>
              <p className="text-gray-600">
                Create and manage notification templates
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/messages"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">💬</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Messages
                </h3>
              </div>
              <p className="text-gray-600">
                View and manage customer communications
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                View →
              </div>
            </a>
          </div>
        </section>

        {/* System & Maintenance - Owner Only (Collapsible) */}
        {isOwner && (
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-3">⚙️</span>
                System & Maintenance
              </h2>
              <button
                onClick={() => setShowMaintenance(!showMaintenance)}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition font-semibold"
              >
                {showMaintenance ? '▼ Hide' : '▶ Show'}
              </button>
            </div>
            <p className="text-gray-600 mb-4 text-sm">Owner-only utilities for system maintenance and setup</p>
            
            {showMaintenance && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                  href="/admin/migrate"
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-4xl mr-3">⚡</span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                      Database Setup
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Run initial database setup and migrations
                  </p>
                  <div className="mt-4 text-sm font-semibold text-blue-600">
                    Run →
                  </div>
                </a>

                <a
                  href="/admin/settings"
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-4xl mr-3">👨‍💼</span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                      Team Settings
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Manage admin users, roles, and permissions
                  </p>
                  <div className="mt-4 text-sm font-semibold text-blue-600">
                    Configure →
                  </div>
                </a>

                <a
                  href="/admin/employees"
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-4xl mr-3">💼</span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                      Direct Hire Employees
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Manage direct hire employee records and assignments
                  </p>
                  <div className="mt-4 text-sm font-semibold text-blue-600">
                    Manage →
                  </div>
                </a>
              </div>
            )}
          </section>
        )}

        {/* Back Button */}
        <div className="mt-12">
          <a
            href="/admin/dashboard"
            className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition font-bold"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
