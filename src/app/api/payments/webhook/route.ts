import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import pool from '@/lib/mysql';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Handle different event types
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          
          // Update payment status
          await connection.execute(
            `UPDATE payments 
             SET status = 'succeeded', 
                 payment_method_type = ?, 
                 payment_method_last4 = ?,
                 receipt_url = ?
             WHERE stripe_payment_intent_id = ?`,
            [
              'card',
              null,
              null,
              paymentIntent.id
            ]
          );

          // Update invoice status
          const invoiceId = paymentIntent.metadata.invoice_id;
          if (invoiceId) {
            const [invoice] = await connection.execute(
              'SELECT total_amount, amount_paid FROM invoices WHERE id = ?',
              [invoiceId]
            );

            if ((invoice as any[]).length > 0) {
              const inv = (invoice as any[])[0];
              const totalPaid = parseFloat(inv.amount_paid || 0) + (paymentIntent.amount / 100);
              const totalAmount = parseFloat(inv.total_amount);

              let paymentStatus = 'partial';
              if (totalPaid >= totalAmount) {
                paymentStatus = 'paid';
              }

              await connection.execute(
                'UPDATE invoices SET payment_status = ?, amount_paid = ? WHERE id = ?',
                [paymentStatus, totalPaid, invoiceId]
              );
            }
          }

          console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          
          await connection.execute(
            'UPDATE payments SET status = \'failed\', failure_message = ? WHERE stripe_payment_intent_id = ?',
            [
              failedPayment.last_payment_error?.message || 'Payment failed',
              failedPayment.id
            ]
          );

          console.log(`❌ Payment failed: ${failedPayment.id}`);
          break;

        case 'charge.refunded':
          const refund = event.data.object as Stripe.Charge;
          
          await connection.execute(
            'UPDATE payments SET status = \'refunded\' WHERE stripe_payment_intent_id = ?',
            [refund.payment_intent]
          );

          console.log(`🔄 Payment refunded: ${refund.id}`);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return NextResponse.json({ received: true });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}
