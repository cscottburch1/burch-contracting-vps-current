import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/adminAuth';
import pool from '@/lib/mysql';
import Stripe from 'stripe';

// Initialize Stripe (you'll need to add your API key to .env.local)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

export async function POST(request: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to .env.local' },
        { status: 500 }
      );
    }

    const currentUser = await getCurrentAdminUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId, customerId, amount, customerEmail } = await request.json();

    if (!invoiceId || !customerId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    try {
      // Get or create Stripe customer
      let stripeCustomerId;
      const [existingStripe] = await connection.execute(
        'SELECT stripe_customer_id FROM customer_stripe_info WHERE customer_id = ?',
        [customerId]
      );

      if ((existingStripe as any[]).length > 0) {
        stripeCustomerId = (existingStripe as any[])[0].stripe_customer_id;
      } else {
        // Create new Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            customer_id: customerId.toString()
          }
        });

        stripeCustomerId = stripeCustomer.id;

        // Save to database
        await connection.execute(
          'INSERT INTO customer_stripe_info (customer_id, stripe_customer_id) VALUES (?, ?)',
          [customerId, stripeCustomerId]
        );
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: stripeCustomerId,
        metadata: {
          invoice_id: invoiceId.toString(),
          customer_id: customerId.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Save payment record
      await connection.execute(
        `INSERT INTO payments 
        (invoice_id, customer_id, stripe_payment_intent_id, amount, status) 
        VALUES (?, ?, ?, ?, 'pending')`,
        [invoiceId, customerId, paymentIntent.id, amount]
      );

      // Update invoice with payment link
      const paymentLink = `${process.env.NEXT_PUBLIC_BASE_URL}/portal/invoices/${invoiceId}/pay`;
      await connection.execute(
        'UPDATE invoices SET payment_link = ? WHERE id = ?',
        [paymentLink, invoiceId]
      );

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}
