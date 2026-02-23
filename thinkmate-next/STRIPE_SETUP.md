# Stripe Payment Setup Guide

This guide will help you set up Stripe payment processing for ThinkMate's Pro subscription plan.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Access to your `.env.local` file
- Terminal access for webhook testing

---

## Step 1: Create a Stripe Account

1. Go to https://stripe.com
2. Click "Sign Up" and create an account
3. Complete the business verification process (you can start with Test Mode)

---

## Step 2: Get Your API Keys

### A. Secret Key

1. Go to https://dashboard.stripe.com/apikeys
2. In the "Standard keys" section, find your **Secret key**
3. Click "Reveal test key" or "Reveal live key"
4. Copy the key (starts with `sk_test_` or `sk_live_`)
5. Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### B. Public Key (for future frontend use)

1. On the same page, copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
2. Keep it handy for future reference

---

## Step 3: Create a Product and Price

### A. Create the Pro Product

1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**
3. Fill in the details:
   - **Name**: ThinkMate Pro
   - **Description**: Professional plan with unlimited notes and advanced AI features
   - **Pricing model**: Recurring
   - **Price**: $9.99
   - **Billing period**: Monthly
4. Click **"Save product"**

### B. Get the Price ID

1. After creating the product, you'll be on the product details page
2. In the "Pricing" section, find your price
3. Click on the price to see its details
4. Copy the **Price ID** (starts with `price_`)
5. Add to `.env.local`:

```env
STRIPE_PRO_PRICE_ID=price_your_price_id_here
```

---

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your app when payments succeed, subscriptions are canceled, etc.

### A. For Local Development (using Stripe CLI)

1. **Install Stripe CLI**:
   
   **macOS** (using Homebrew):
   ```bash
   brew install stripe/stripe-cli/stripe
   ```
   
   **Windows** (using Scoop):
   ```bash
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   ```
   
   **Linux**:
   ```bash
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
   This will open your browser to authorize the CLI.

3. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```
   
4. **Copy the webhook signing secret**:
   
   The CLI will output something like:
   ```
   > Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
   ```
   
   Copy the secret (starts with `whsec_`) and add to `.env.local`:
   
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

5. **Keep the CLI running** while testing payments locally

### B. For Production (Railway/Vercel)

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/webhook/stripe
   ```
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to your production environment variables in Railway/Vercel:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
   ```

---

## Step 5: Test the Integration

### A. Test Payment Flow

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Make sure Stripe CLI is forwarding webhooks (if testing locally):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. Open your app at http://localhost:3000

4. Navigate to the Pricing section

5. Click **"Start Free Trial"** on the Pro plan

6. You'll be redirected to Stripe Checkout

7. Use a test card:
   - **Card number**: 4242 4242 4242 4242
   - **Expiry**: Any future date (e.g., 12/34)
   - **CVC**: Any 3 digits (e.g., 123)
   - **ZIP**: Any 5 digits (e.g., 12345)

8. Complete the checkout

9. You should be redirected to the success page

10. Check your terminal - you should see webhook events being received

### B. Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/payments
2. You should see your test payment
3. Go to https://dashboard.stripe.com/subscriptions
4. You should see the new subscription

### C. Verify in Your Database

1. Check your user in MongoDB:
   ```javascript
   // The user should now have:
   {
     subscriptionTier: 'pro',
     subscriptionStatus: 'active',
     stripeCustomerId: 'cus_xxxxx',
     stripeSubscriptionId: 'sub_xxxxx',
     subscriptionStartDate: '2024-xx-xx'
   }
   ```

---

## Step 6: Environment Variables Summary

Your `.env.local` should now have:

```env
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

---

## Step 7: Switch to Live Mode (Production)

When you're ready to accept real payments:

1. Complete Stripe account verification
2. Switch to "Live" mode in Stripe Dashboard
3. Get your **live** API keys (start with `sk_live_` and `pk_live_`)
4. Create a **live** product and price (get the live `price_` ID)
5. Set up a **live** webhook endpoint with the live signing secret
6. Update your production environment variables with live keys

---

## Troubleshooting

### "Payment system is not configured" error

- Make sure `STRIPE_SECRET_KEY` is set in `.env.local`
- Restart your dev server after adding the key

### "Webhook Error: No signatures found matching the expected signature"

- Make sure `STRIPE_WEBHOOK_SECRET` is correct
- Make sure Stripe CLI is running and forwarding to the correct URL
- Check that the webhook URL matches your endpoint

### Checkout session creation fails

- Verify your `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` is correct
- Make sure you're using the Price ID, not the Product ID
- Check Stripe Dashboard logs at https://dashboard.stripe.com/logs

### User subscription not updating after payment

- Check your webhook is receiving events (see Stripe CLI output or Dashboard)
- Verify the webhook handler is running correctly (check server logs)
- Ensure your MongoDB connection is working

---

## Test Cards Reference

### Successful Payments
- **Basic card**: 4242 4242 4242 4242
- **3D Secure required**: 4000 0027 6000 3184

### Failed Payments
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

For more test cards: https://stripe.com/docs/testing

---

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Testing Your Integration](https://stripe.com/docs/testing)

---

## Security Notes

⚠️ **IMPORTANT**:

1. **Never commit** `.env.local` to Git
2. **Never expose** your secret key in client-side code
3. **Always validate** webhook signatures
4. Use **test mode** for development
5. Only use **live keys** in production with proper security measures

---

Need help? Check the [Stripe Support](https://support.stripe.com/) or reach out to the ThinkMate team.
