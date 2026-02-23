/**
 * Stripe Webhook Handler
 * Processes Stripe events (payment success, subscription updates, cancellations)
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Stripe from 'stripe';

/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('⚠️ STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Update user subscription status
        if (session.client_reference_id) {
          await User.findOneAndUpdate(
            { _id: session.client_reference_id },
            {
              subscriptionStatus: 'active',
              subscriptionTier: 'pro',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              subscriptionStartDate: new Date(),
            }
          );
          console.log('✅ User subscription activated:', session.client_reference_id);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by Stripe customer ID
        const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
        
        if (user) {
          await User.findOneAndUpdate(
            { _id: user._id },
            {
              subscriptionStatus: subscription.status,
              subscriptionTier: subscription.status === 'active' ? 'pro' : 'free',
            }
          );
          console.log('✅ User subscription updated:', user._id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by Stripe customer ID
        const user = await User.findOne({ stripeCustomerId: subscription.customer as string });
        
        if (user) {
          await User.findOneAndUpdate(
            { _id: user._id },
            {
              subscriptionStatus: 'canceled',
              subscriptionTier: 'free',
              subscriptionEndDate: new Date(),
            }
          );
          console.log('✅ User subscription canceled:', user._id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Find user by Stripe customer ID
        const user = await User.findOne({ stripeCustomerId: invoice.customer as string });
        
        if (user) {
          await User.findOneAndUpdate(
            { _id: user._id },
            {
              subscriptionStatus: 'past_due',
            }
          );
          console.log('⚠️ Payment failed for user:', user._id);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
