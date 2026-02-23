# ThinkMate Payment System

## Overview

ThinkMate uses **Stripe** for payment processing, offering two subscription tiers:

- **Free Plan**: $0/forever - Up to 50 notes, basic AI features
- **Pro Plan**: $9.99/month - Unlimited notes, advanced AI features

## Features Implemented

### 1. Pricing Component
- Interactive pricing cards on homepage
- Clicking "Start Free Trial" on Pro plan initiates Stripe checkout
- Free plan button redirects to sign-up or dashboard

### 2. Stripe Checkout
- Secure hosted checkout page
- Subscription-based billing
- Automatic customer and subscription creation
- Test mode supported for development

### 3. Webhook Integration
- Real-time payment event processing
- Handles subscription lifecycle:
  - `checkout.session.completed` - New subscription activated
  - `customer.subscription.updated` - Subscription changes
  - `customer.subscription.deleted` - Cancellation
  - `invoice.payment_failed` - Failed payments

### 4. User Subscription Management
- Database stores subscription status
- `subscriptionTier`: 'free' | 'pro'
- `subscriptionStatus`: 'active' | 'canceled' | 'past_due' | 'trialing'
- Stripe customer and subscription IDs tracked

### 5. Payment Success/Cancel Pages
- Custom success page with auto-redirect to dashboard
- Cancel page with retry options

### 6. Subscription Utilities
- Helper functions to check Pro status
- Feature access control
- Note limits enforcement
- AI generation limits

### 7. API Routes

#### `/api/checkout` (POST)
Creates Stripe checkout session for Pro plan subscription

#### `/api/webhook/stripe` (POST)
Receives and processes Stripe webhook events

#### `/api/subscription` (GET)
Fetches user's current subscription details

#### `/api/billing-portal` (POST)
Creates Stripe billing portal session for managing subscription

## Setup Instructions

See **STRIPE_SETUP.md** for detailed setup instructions.

Quick start:
1. Create Stripe account at https://stripe.com
2. Get API keys from https://dashboard.stripe.com/apikeys
3. Create Pro product and get Price ID
4. Set up webhook endpoint
5. Add environment variables to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
```

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Start Stripe CLI webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
3. Navigate to pricing section
4. Click "Start Free Trial" on Pro plan
5. Use test card: `4242 4242 4242 4242`

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184

More test cards: https://stripe.com/docs/testing

## File Structure

```
src/
├── lib/
│   ├── stripe.ts              # Stripe client configuration
│   └── subscription.ts        # Subscription utility functions
├── models/
│   └── User.ts               # User model with subscription fields
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts      # Checkout session creation
│   │   ├── webhook/
│   │   │   └── stripe/
│   │   │       └── route.ts  # Webhook event handler
│   │   ├── subscription/
│   │   │   └── route.ts      # Subscription status API
│   │   └── billing-portal/
│   │       └── route.ts      # Billing portal session
│   ├── payment/
│   │   ├── success/
│   │   │   └── page.tsx      # Success page
│   │   └── cancel/
│   │       └── page.tsx      # Cancel page
│   └── dashboard/
│       └── page.tsx          # Shows subscription badge
├── components/
│   └── ui/
│       └── Pricing.tsx       # Pricing component with checkout
└── types/
    └── user.ts               # User types with subscription fields
```

## Plan Limits

Defined in `src/lib/stripe.ts`:

```typescript
PLAN_LIMITS = {
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
}
```

## Subscription Utilities

```typescript
import { isProUser, canCreateNote, hasFeatureAccess } from '@/lib/subscription';

// Check if user is Pro
if (isProUser(user)) {
  // Grant Pro features
}

// Check note limit
if (canCreateNote(user, currentNoteCount)) {
  // Allow note creation
}

// Check feature access
if (hasFeatureAccess(user, 'export')) {
  // Allow export
}
```

## Security

- ✅ API keys stored in environment variables
- ✅ Webhook signature verification
- ✅ Server-side authentication checks
- ✅ No sensitive keys in client code
- ✅ Subscription status validated on backend

## Production Deployment

### Railway Setup
1. Add environment variables in Railway dashboard
2. Use **live** Stripe keys (not test keys)
3. Create production webhook endpoint
4. Update `NEXTAUTH_URL` to production URL

### Environment Variables (Production)
```env
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (from production webhook)
STRIPE_PRO_PRICE_ID=price_xxxxx (from live product)
NEXTAUTH_URL=https://your-production-domain.com
```

## Billing Portal

Pro users can manage their subscription via Stripe's hosted billing portal:

```typescript
// Create billing portal session
const response = await fetch('/api/billing-portal', { method: 'POST' });
const { url } = await response.json();
window.location.href = url;
```

The portal allows users to:
- Update payment method
- View invoices
- Cancel subscription
- Update billing information

## Support

For issues:
1. Check Stripe Dashboard logs: https://dashboard.stripe.com/logs
2. Check webhook delivery: https://dashboard.stripe.com/webhooks
3. Review server logs for webhook processing
4. Verify environment variables are set correctly

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Testing Guide](https://stripe.com/docs/testing)
