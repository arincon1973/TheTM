/**
 * Stripe Configuration
 * Server-side Stripe client for payment processing
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// Stripe Price IDs are loaded from environment variables
// Set STRIPE_PRO_PRICE_ID in your .env.local file

// Plan features mapping
export const PLAN_LIMITS = {
  free: {
    maxNotes: 50,
    maxAIGenerations: 20,
    features: ['basic_ai', 'cloud_sync', 'mobile_access'],
  },
  pro: {
    maxNotes: -1, // Unlimited
    maxAIGenerations: -1, // Unlimited
    features: ['advanced_ai', 'priority_support', 'team_collaboration', 'custom_templates', 'api_access', 'export'],
  },
};
