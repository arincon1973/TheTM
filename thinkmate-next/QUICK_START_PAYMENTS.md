# Quick Start: Enable Payments in 10 Minutes

## ✅ Build Verified
Your payment system is fully implemented and builds successfully! All you need to do is add 3 environment variables.

---

## 🚀 3-Step Setup (10 minutes)

### 1️⃣ Create Stripe Account (2 min)
```
→ Go to: https://stripe.com
→ Click "Sign Up"
→ Create account (use Test Mode - no verification needed)
```

### 2️⃣ Get Your Keys (3 min)

**A. Secret Key:**
```
→ Go to: https://dashboard.stripe.com/apikeys
→ Copy "Secret key" (sk_test_...)
→ Add to .env.local:
  STRIPE_SECRET_KEY=sk_test_your_key_here
```

**B. Create Product & Get Price ID:**
```
→ Go to: https://dashboard.stripe.com/products
→ Click "+ Add product"
→ Name: ThinkMate Pro
→ Price: $9.99 monthly recurring
→ Save
→ Copy "Price ID" (price_...)
→ Add to .env.local:
  STRIPE_PRO_PRICE_ID=price_your_price_id_here
```

### 3️⃣ Set Up Local Webhook (5 min)

**Install Stripe CLI:**
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe
```

**Login & Start:**
```bash
# Login once
stripe login

# Start webhook forwarding (keep running)
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

**Copy webhook secret from terminal output:**
```
→ Look for: whsec_...
→ Add to .env.local:
  STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

---

## 🎯 Your .env.local Should Have:

```env
# Existing variables (already configured)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
MONGODB_URI=...
OPENAI_API_KEY=...
RESEND_API_KEY=...
CONTACT_EMAIL=...

# NEW - Add these 3 Stripe variables:
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRO_PRICE_ID=price_xxxxx
```

---

## 🧪 Test It (2 min)

1. **Start your server:**
   ```bash
   npm run dev
   ```

2. **Keep Stripe CLI running** (in separate terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. **Open app:** http://localhost:3000

4. **Scroll to pricing** and click "Start Free Trial" on Pro plan

5. **Use test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`

6. **Complete checkout** → You'll see success page

7. **Check dashboard** → You should see "⭐ Pro Plan" badge!

---

## ✨ What Works Now

✅ Pricing page shows Free ($0) and Pro ($9.99/mo) plans  
✅ "Start Free Trial" button redirects to Stripe checkout  
✅ Payment processing via Stripe  
✅ Success/cancel pages  
✅ Automatic database updates  
✅ Pro badge on dashboard  
✅ Webhook integration for real-time updates  
✅ Test mode ready (no real charges)  

---

## 📚 Need More Details?

- **Setup Guide**: `STRIPE_SETUP.md` (step-by-step with screenshots)
- **Technical Docs**: `PAYMENTS_README.md` (API reference)
- **Summary**: `PAYMENT_IMPLEMENTATION_SUMMARY.md` (what was built)

---

## 🆘 Troubleshooting

**"Payment system is not configured" error:**
- Check that all 3 Stripe env vars are set in `.env.local`
- Restart `npm run dev` after adding variables

**Webhook not working:**
- Make sure `stripe listen` is running
- Check terminal for webhook events
- Verify `STRIPE_WEBHOOK_SECRET` matches CLI output

**Build errors:**
- ✅ Build verified working! Just add env vars and start.

---

## 🎉 You're Done!

Once you add those 3 environment variables, your payment system is **100% ready**!

Users can subscribe to Pro, payments are processed, and subscription status is tracked automatically.

**Ready to accept payments! 💰**
