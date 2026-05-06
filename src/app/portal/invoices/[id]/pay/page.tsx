'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PayInvoicePage() {
  const params = useParams();
  const invoiceId = Array.isArray(params?.id) ? params.id[0] : (params?.id || '');
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) {
        setError('Invalid invoice ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch invoice details
        const invoiceRes = await fetch(`/api/customer/invoices/${invoiceId}`);
        if (!invoiceRes.ok) {
          throw new Error('Invoice not found');
        }
        const invoiceData = await invoiceRes.json();
        setInvoice(invoiceData.invoice);
      } catch (err: any) {
        setError(err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/portal/invoices')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-6">Pay Invoice #{invoice.invoice_number}</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invoice Date</p>
                <p className="font-semibold">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-semibold">{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount Due</p>
                <p className="text-2xl font-bold text-blue-600">${invoice.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Online Payments Disabled</h2>
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
              <p className="text-amber-900 font-semibold">Online payments are not enabled.</p>
              <p className="text-amber-800 text-sm mt-2">
                Please contact Burch Contracting directly to arrange payment for this invoice.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Need help with invoice payment options? Please contact our office.</p>
          <button
            onClick={() => router.push('/portal/invoices')}
            className="text-blue-600 hover:underline mt-4"
          >
            ← Back to Invoices
          </button>
        </div>
      </div>
    </div>
  );
}
