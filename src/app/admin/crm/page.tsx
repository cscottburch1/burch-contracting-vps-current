'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead } from '@/types/crm';
import { calculateLeadAge, getLeadAgingStatus } from '@/lib/leadScoring';

export default function AdminCRMPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Stats state
  const [stats, setStats] = useState<any>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchLeads();
      fetchStatistics();
    }
  }, [authenticated, filterStatus, filterPriority, searchQuery]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/crm/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setErrorMessage('Failed to load leads. Refresh the page or try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/crm/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      
      const data = await response.json();
      setStats(data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStats(null);
    }
  };

  const handleInlineStatusUpdate = async (leadId: string, status: Lead['status']) => {
    setUpdatingLeadId(leadId);

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead))
    );

    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status');
      await fetchLeads();
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      qualified: 'bg-yellow-100 text-yellow-800',
      proposal: 'bg-orange-100 text-orange-800',
      negotiation: 'bg-pink-100 text-pink-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    try {
      // Handle both date-only and datetime formats
      const dateOnly = date.split('T')[0]; // Remove time if present
      const [year, month, day] = dateOnly.split('-').map(Number);
      
      // Validate the parsed values
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return 'Invalid Date';
      }
      
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return 'Invalid Date';
    }
  };

  if (!authenticated || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  const totalLeads = stats?.byStatus
    ? stats.byStatus.reduce((sum: number, item: { count: number }) => sum + Number(item.count || 0), 0)
    : leads.length;
  const totalValue = Number(stats?.totalValue || leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0));
  const newLeads = Number(stats?.byStatus?.find((item: { status: string }) => item.status === 'new')?.count || leads.filter((lead) => lead.status === 'new').length);
  const wonLeads = Number(stats?.byStatus?.find((item: { status: string }) => item.status === 'won')?.count || leads.filter((lead) => lead.status === 'won').length);

  return (
    <>
      <Section padding="lg" background="white">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
          <span>›</span>
          <span className="text-gray-900 font-semibold">CRM / Leads</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all customer leads</p>
          </div>
          <Button variant="primary" href="/admin/dashboard">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {errorMessage ? (
          <Card className="mb-6 border border-red-200 bg-red-50">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </Card>
        ) : null}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Icon name="Users" size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">New Leads</p>
                <p className="text-3xl font-bold text-gray-900">{newLeads}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Icon name="UserPlus" size={24} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Won Deals</p>
                <p className="text-3xl font-bold text-gray-900">{wonLeads}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Icon name="TrendingUp" size={24} className="text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon name="DollarSign" size={24} className="text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Contact</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Service</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Priority</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Value</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const leadAge = calculateLeadAge(lead.created_at);
                    const agingStatus = getLeadAgingStatus(lead.created_at, lead.status);
                    
                    return (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-2">
                            <div>
                              <p className="font-semibold text-gray-900">{lead.name}</p>
                              {lead.lead_score && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs text-gray-500">Score:</span>
                                  <span className={`text-xs font-semibold ${
                                    (lead.lead_score / 375) >= 0.67 ? 'text-green-600' :
                                    (lead.lead_score / 375) >= 0.47 ? 'text-blue-600' :
                                    (lead.lead_score / 375) >= 0.27 ? 'text-yellow-600' : 'text-gray-500'
                                  }`}>
                                    {lead.lead_score}/375
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          <p className="text-sm text-gray-600">{lead.phone}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{lead.service_type || 'N/A'}</span>
                          {lead.budget_range && (
                            <p className="text-xs text-gray-500 mt-1">{lead.budget_range}</p>
                          )}
                          {Number(lead.attachment_count || 0) > 0 && (
                            <p className="text-xs text-blue-600 mt-1 font-medium">
                              {lead.attachment_count} attachment{lead.attachment_count === 1 ? '' : 's'}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            disabled={updatingLeadId === lead.id}
                            onChange={(e) => handleInlineStatusUpdate(lead.id, e.target.value as Lead['status'])}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-900 disabled:opacity-60"
                            aria-label={`Update status for ${lead.name}`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>
                          <div className="mt-2">
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          {agingStatus.severity !== 'normal' && (
                            <div className={`text-xs mt-1 ${
                              agingStatus.severity === 'critical' ? 'text-red-600' :
                              agingStatus.severity === 'warning' ? 'text-yellow-600' : 'text-gray-500'
                            }`}>
                              {agingStatus.severity === 'critical' ? '🔴' : '⚠️'} {leadAge}d old
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(lead.priority)}>
                            {lead.priority === 'urgent' ? '🔥' : ''} {lead.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {formatCurrency(lead.estimated_value)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            href={`/admin/crm/leads/${lead.id}`}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>
    </>
  );
}
