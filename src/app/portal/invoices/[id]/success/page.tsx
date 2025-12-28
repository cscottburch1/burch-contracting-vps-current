'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get payment_intent from URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get('payment_intent');

        if (paymentIntentId) {
          // Verify payment status
          const res = await fetch(`/api/customer/invoices/${params.id}`);
          const data = await res.json();
          setPaymentStatus(data.invoice);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your invoice has been updated and you should receive a receipt via email shortly.
        </p>

        {paymentStatus && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invoice</p>
                <p className="font-semibold">#{paymentStatus.invoice_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount Paid</p>
                <p className="font-semibold text-green-600">
                  ${paymentStatus.amount_paid?.toFixed(2) || paymentStatus.total_amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Payment Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  {paymentStatus.payment_status || 'Paid'}
                </span>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => router.push('/portal/invoices')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            View All Invoices
          </button>
          <button
            onClick={() => router.push('/portal')}
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Back to Portal Home
          </button>
        </div>
      </div>
    </div>
  );
}
