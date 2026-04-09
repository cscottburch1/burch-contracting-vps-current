'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { fetchWithTimeout, isAbortLikeError } from '@/lib/fetchWithTimeout';
import { useAdminAuth } from '@/hooks/useAdminAuth';

type LeadQueueStatus = {
  queuedCount: number;
  latestQueuedAt: string | null;
  sampleReasons: string[];
};

type ToolCategory =
  | 'Lead & CRM Tools'
  | 'Proposal & Estimate Tools'
  | 'Project Management Tools'
  | 'Customer Communication Tools'
  | 'Financial/Admin Tools'
  | 'Website/SEO Tools'
  | 'System Utilities';

type ToolItem = {
  id: string;
  name: string;
  description: string;
  href: string;
  cta: string;
  category: ToolCategory;
  priority: 'high' | 'medium';
  ownerOnly?: boolean;
  note?: string;
};

const TOOL_ITEMS: ToolItem[] = [
  {
    id: 'crm',
    name: 'CRM / Leads',
    description: 'Track incoming leads, follow-up stages, and conversion pipeline activity.',
    href: '/admin/crm',
    cta: 'Open CRM',
    category: 'Lead & CRM Tools',
    priority: 'high',
  },
  {
    id: 'customers',
    name: 'Customer Portal Users',
    description: 'Manage portal access, account states, and customer profile details.',
    href: '/admin/customers',
    cta: 'Manage Users',
    category: 'Lead & CRM Tools',
    priority: 'medium',
  },
  {
    id: 'proposals',
    name: 'Proposals',
    description: 'Create, track, and update proposal records for active opportunities.',
    href: '/admin/proposals',
    cta: 'Manage Proposals',
    category: 'Proposal & Estimate Tools',
    priority: 'high',
  },
  {
    id: 'invoices',
    name: 'Invoices',
    description: 'Create and manage invoice lifecycle from issue to payment status.',
    href: '/admin/invoices',
    cta: 'Manage Invoices',
    category: 'Financial/Admin Tools',
    priority: 'high',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Monitor job progress, delivery stages, and project records.',
    href: '/admin/projects',
    cta: 'View Projects',
    category: 'Project Management Tools',
    priority: 'high',
  },
  {
    id: 'subcontractors',
    name: 'Subcontractors',
    description: 'Assign work, manage subcontractor profiles, and operational details.',
    href: '/admin/subcontractors/manage',
    cta: 'Manage Subcontractors',
    category: 'Project Management Tools',
    priority: 'high',
  },
  {
    id: 'field-crew',
    name: 'Field Crew',
    description: 'Manage field team assignments, uploads, and accountability workflows.',
    href: '/admin/tradesmen',
    cta: 'Open Field Crew',
    category: 'Project Management Tools',
    priority: 'medium',
  },
  {
    id: 'messages',
    name: 'Messages',
    description: 'Review and respond to customer communications from one location.',
    href: '/admin/messages',
    cta: 'Open Messages',
    category: 'Customer Communication Tools',
    priority: 'medium',
  },
  {
    id: 'notifications',
    name: 'Email & SMS Templates',
    description: 'Configure automated messaging templates for customer and internal updates.',
    href: '/admin/tools/notifications',
    cta: 'Manage Templates',
    category: 'Customer Communication Tools',
    priority: 'high',
  },
  {
    id: 'services',
    name: 'Services Manager',
    description: 'Control service visibility, content, and website display behavior.',
    href: '/admin/tools/services',
    cta: 'Manage Services',
    category: 'Website/SEO Tools',
    priority: 'high',
  },
  {
    id: 'featured-projects',
    name: 'Featured Projects',
    description: 'Curate portfolio projects displayed publicly on the website.',
    href: '/admin/tools/projects',
    cta: 'Manage Showcase',
    category: 'Website/SEO Tools',
    priority: 'medium',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Coordinate schedules, milestones, and team availability.',
    href: '/admin/calendar',
    cta: 'Open Calendar',
    category: 'System Utilities',
    priority: 'medium',
  },
  {
    id: 'employees',
    name: 'Direct Hire Employees',
    description: 'Maintain internal employee records and assignment context.',
    href: '/admin/employees',
    cta: 'Manage Employees',
    category: 'Financial/Admin Tools',
    priority: 'medium',
    ownerOnly: true,
    note: 'Owner only',
  },
  {
    id: 'settings',
    name: 'Team Settings',
    description: 'Manage admin roles, access permissions, and account security settings.',
    href: '/admin/settings',
    cta: 'Configure Access',
    category: 'System Utilities',
    priority: 'high',
    ownerOnly: true,
    note: 'Owner only',
  },
  // Database Setup / Migrations removed from UI (2026-03-27)
  // Migration utilities are one-time setup tasks. Owner can still access directly at /admin/migrate
  // Removed from TOOL_ITEMS to reduce noise in tools hub and clarify that migrations are maintenance utilities, not operational tools
  // API routes remain intact for recovery/debugging purposes
];

const CATEGORY_ORDER: ToolCategory[] = [
  'Lead & CRM Tools',
  'Proposal & Estimate Tools',
  'Project Management Tools',
  'Customer Communication Tools',
  'Financial/Admin Tools',
  'Website/SEO Tools',
  'System Utilities',
];

export default function AdminToolsPage() {
  const { user: currentUser, authLoading, authError } = useAdminAuth();
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ToolCategory>('all');

  const [queueLoading, setQueueLoading] = useState(false);
  const [queueReplaying, setQueueReplaying] = useState(false);
  const [queueError, setQueueError] = useState('');
  const [queueSuccess, setQueueSuccess] = useState('');
  const [leadQueueStatus, setLeadQueueStatus] = useState<LeadQueueStatus | null>(null);

  const isOwner = currentUser?.role === 'owner';

  const loadLeadQueueStatus = async () => {
    setQueueLoading(true);
    setQueueError('');

    try {
      const res = await fetchWithTimeout('/api/admin/leads/queue', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok) {
        setQueueError(data.error || 'Failed to load queue status.');
        return;
      }

      setLeadQueueStatus(data as LeadQueueStatus);
    } catch (error) {
      setQueueError(isAbortLikeError(error) ? 'Queue request timed out.' : 'Failed to load queue status.');
    } finally {
      setQueueLoading(false);
    }
  };

  const replayLeadQueue = async () => {
    if (!confirm('Replay queued leads into CRM now?')) {
      return;
    }

    setQueueReplaying(true);
    setQueueError('');
    setQueueSuccess('');

    try {
      const res = await fetchWithTimeout('/api/admin/leads/queue', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setQueueError(data.error || 'Failed to replay queued leads.');
        return;
      }

      setQueueSuccess(`Replayed ${data.replayed} lead(s). Remaining: ${data.remaining}`);
      await loadLeadQueueStatus();
    } catch (error) {
      setQueueError(isAbortLikeError(error) ? 'Queue replay timed out.' : 'Failed to replay queued leads.');
    } finally {
      setQueueReplaying(false);
    }
  };

  useEffect(() => {
    if (isOwner && showMaintenance && !leadQueueStatus && !queueLoading) {
      void loadLeadQueueStatus();
    }
  }, [isOwner, showMaintenance, leadQueueStatus, queueLoading]);

  const visibleTools = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();

    return TOOL_ITEMS.filter((tool) => {
      if (tool.ownerOnly && !isOwner) {
        return false;
      }

      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return [tool.name, tool.description, tool.category, tool.cta]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [isOwner, searchTerm, selectedCategory]);

  const groupedTools = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      tools: visibleTools
        .filter((tool) => tool.category === category)
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === 'high' ? -1 : 1)),
    })).filter((group) => group.tools.length > 0);
  }, [visibleTools]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-gray-700 shadow-sm">
          Loading admin tools...
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Tools failed to load</h1>
          <p className="mt-2 text-gray-700">{authError}</p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Retry
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Admin Tools</h1>
              <p className="mt-2 text-gray-600">Internal operations workspace for day-to-day management.</p>
              <p className="mt-2 text-sm text-gray-500">Signed in as {currentUser?.name || currentUser?.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/dashboard" className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
                Back to Dashboard
              </Link>
              <Link href="/admin/crm" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                Open Admin CRM
              </Link>
              <Link href="/admin/projects/new" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                New Project
              </Link>
              <Link href="/admin/proposals/create" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                New Proposal
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools by name, purpose, or category"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as 'all' | ToolCategory)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_ORDER.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
              Showing {visibleTools.length} tool{visibleTools.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {groupedTools.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">No tools match your filters</h2>
            <p className="mt-2 text-gray-600">Adjust search or category filters to see available tools.</p>
          </div>
        ) : (
          groupedTools.map((group) => (
            <section key={group.category} className="mb-8">
              <h2 className="mb-3 text-xl font-bold text-gray-900">{group.category}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.tools.map((tool) => (
                  <article key={tool.id} className="flex min-h-48 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tool.priority === 'high' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tool.priority === 'high' ? 'High Use' : 'Standard'}
                      </span>
                    </div>
                    <p className="mb-4 flex-1 text-sm text-gray-600">{tool.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <Link
                        href={tool.href}
                        className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        {tool.cta}
                      </Link>
                      {tool.note ? <span className="text-xs font-semibold text-gray-500">{tool.note}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}

        {isOwner && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900">Legacy Lead Recovery</h2>
              <button
                onClick={() => setShowMaintenance((prev) => !prev)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                {showMaintenance ? 'Hide Legacy Panel' : 'Show Legacy Panel'}
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Contact leads now save directly into CRM. This owner-only panel is kept only to inspect or replay older fallback items already written to the legacy queue file.
            </p>

            {queueError ? <p className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{queueError}</p> : null}
            {queueSuccess ? <p className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">{queueSuccess}</p> : null}

            {showMaintenance ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700 md:grid-cols-2">
                  <div>
                    <span className="font-semibold">Queued leads:</span> {queueLoading ? 'Checking...' : leadQueueStatus?.queuedCount ?? 0}
                  </div>
                  <div>
                    <span className="font-semibold">Last queued:</span>{' '}
                    {leadQueueStatus?.latestQueuedAt
                      ? new Date(leadQueueStatus.latestQueuedAt).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>

                {leadQueueStatus?.sampleReasons?.length ? (
                  <div className="mt-3 text-sm text-gray-700">
                    <p className="font-semibold">Recent queue reasons:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {leadQueueStatus.sampleReasons.map((reason, idx) => (
                        <li key={`${reason}-${idx}`}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={loadLeadQueueStatus}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Refresh
                  </button>
                  <button
                    onClick={replayLeadQueue}
                    disabled={queueReplaying || (leadQueueStatus?.queuedCount ?? 0) === 0}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                  >
                    {queueReplaying ? 'Replaying...' : 'Replay Queue'}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </div>
    </div>
  );
}
