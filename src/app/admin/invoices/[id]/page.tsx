'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  project_id: number | null;
  items: string;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  status: string;
  invoice_date: string;
  due_date: string;
  notes: string;
  created_at: string;
}

interface Payment {
  id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes: string;
  created_at: string;
}

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && invoiceId) {
      fetchInvoiceDetails();
    }
  }, [authenticated, invoiceId]);

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

  const fetchInvoiceDetails = async () => {
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch invoice');
      
      const data = await response.json();
      setInvoice(data.invoice);
      setPayments(data.payments || []);
      
      // Parse items JSON
      try {
        const parsedItems = JSON.parse(data.invoice.items);
        setItems(parsedItems);
      } catch (e) {
        console.error('Error parsing items:', e);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(paymentForm)
      });

      if (response.ok) {
        alert('Payment recorded successfully');
        setShowPaymentModal(false);
        setPaymentForm({
          amount: '',
          payment_method: 'cash',
          payment_date: new Date().toISOString().split('T')[0],
          notes: ''
        });
        await fetchInvoiceDetails();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment');
    }
  };

  const handleSendEmail = async () => {
    if (!invoice) return;
    
    if (!confirm('Send this invoice to the customer?')) return;
    
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          invoiceNumber: invoice.invoice_number,
          customerName: invoice.customer_name,
          customerEmail: invoice.customer_email,
          invoiceDate: invoice.invoice_date,
          dueDate: invoice.due_date,
          items: items,
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          total: invoice.total,
          amountPaid: invoice.amount_paid,
          notes: invoice.notes
        })
      });

      if (response.ok) {
        alert('Invoice sent successfully!');
      } else {
        alert('Failed to send invoice');
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Failed to send invoice');
    }
  };

  const handleDeleteInvoice = async () => {
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Invoice deleted successfully');
        router.push('/admin/invoices');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
    setShowDeleteConfirm(false);
  };

  const getStatusColor = (status: string): 'blue' | 'green' | 'gray' | 'orange' => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'green';
      case 'partial':
        return 'blue';
      case 'overdue':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return 'Invalid Date';
    }
  };

  const balance = invoice ? parseFloat(invoice.total.toString()) - parseFloat(invoice.amount_paid.toString()) : 0;

  if (!authenticated || loading || !invoice) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="lg" background="white">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
        <span className="mx-2">/</span>
        <a href="/admin/invoices" className="hover:text-blue-600">Invoices</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">{invoice.invoice_number}</span>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" href="/admin/invoices" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Invoices
            </Button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{invoice.invoice_number}</h1>
              <Badge variant={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            </div>
            <p className="text-gray-600 mt-2">Created {formatDate(invoice.created_at)}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={handleSendEmail}>
              <Icon name="Send" size={16} className="mr-2" />
              Send Email
            </Button>
            {balance > 0 && (
              <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
                <Icon name="DollarSign" size={16} className="mr-2" />
                Record Payment
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Invoice Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <a 
                    href={`/admin/customers/${invoice.customer_id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {invoice.customer_name}
                  </a>
                  <div className="text-sm text-gray-600 mt-1">{invoice.customer_email}</div>
                  <div className="text-sm text-gray-600">{invoice.customer_phone}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                  <div className="text-sm text-gray-900">Invoice: {formatDate(invoice.invoice_date)}</div>
                  <div className="text-sm text-gray-900">Due: {formatDate(invoice.due_date)}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Qty</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Rate</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{item.description}</td>
                        <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(item.price)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 border-t pt-4">
                <div className="max-w-md ml-auto space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span className="font-semibold">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatCurrency(invoice.total)}</span>
                  </div>
                  {invoice.amount_paid > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Amount Paid:</span>
                        <span className="font-semibold">-{formatCurrency(invoice.amount_paid)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t">
                        <span>Balance Due:</span>
                        <span>{formatCurrency(balance)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-lg text-gray-900">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(invoice.amount_paid)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold text-gray-900">Balance Due:</span>
                  <span className={`font-bold text-lg ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Payment History */}
            {payments.length > 0 && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                        <span className="text-xs text-gray-500">{formatDate(payment.payment_date)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.payment_method.charAt(0).toUpperCase() + payment.payment_method.slice(1)}
                      </div>
                      {payment.notes && (
                        <div className="text-xs text-gray-500 mt-1">{payment.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount * (Balance Due: {formatCurrency(balance)})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={balance}
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                  <input
                    type="date"
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional payment notes..."
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Record Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Delete Invoice</h2>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete invoice <strong>{invoice.invoice_number}</strong>? This action cannot be undone.
                {payments.length > 0 && (
                  <span className="block mt-2 text-orange-600 font-medium">
                    This invoice has payment history and cannot be deleted.
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDeleteInvoice}
                  disabled={payments.length > 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Delete Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
