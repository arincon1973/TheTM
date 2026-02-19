# Contact Form Email Setup Guide

Your contact form is now functional and will send you emails when visitors submit the form!

## 📧 Email Service: Resend

We're using **Resend** - a modern email API service that's developer-friendly and reliable.

### Why Resend?
- ✅ **100 emails/day free** (more than enough for most contact forms)
- ✅ **Easy setup** - just one API key needed
- ✅ **Fast delivery** - emails arrive instantly
- ✅ **Beautiful templates** - professional HTML emails
- ✅ **No credit card required** for free tier

---

## 🚀 Setup Instructions

### Step 1: Create Resend Account

1. Visit **https://resend.com/**
2. Click **"Sign Up"** (top right)
3. Sign up with your Google account or email
4. Verify your email if prompted

### Step 2: Get Your API Key

1. After logging in, go to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name: `ThinkMate Contact Form`
4. Select **"Sending access"** permission
5. Click **"Create"**
6. **Copy the API key** (it starts with `re_...`)
   - ⚠️ You'll only see this once, so save it!

### Step 3: Add API Key to Your Environment

1. Open `thinkmate-next/.env.local` file
2. Find the line: `RESEND_API_KEY=your-resend-api-key-here`
3. Replace with your actual key: `RESEND_API_KEY=re_xxxxxxxxxxxxx`
4. Update `CONTACT_EMAIL` with your email:
   ```env
   CONTACT_EMAIL=arincon73@gmail.com
   ```
5. Save the file

### Step 4: Restart Dev Server

The dev server needs to reload the environment variables:

```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
cd thinkmate-next
npm run dev
```

---

## ✨ Features

### What You'll Receive

When someone submits the contact form, you'll get an email with:

- 📬 **Beautiful HTML email** with gradient header
- 👤 **Sender's name and email** (prominently displayed)
- 💬 **Their message** (formatted and easy to read)
- 📅 **Timestamp** of submission
- ↩️ **Reply-To set** to sender's email (just click "Reply" to respond)

### Email Example

```
Subject: ThinkMate Contact Form: Message from John Doe

From: ThinkMate Contact <onboarding@resend.dev>
Reply-To: john@example.com

[Beautiful gradient header with "📬 New Contact Form Submission"]

From:
Name: John Doe
Email: john@example.com

Message:
Hi! I love ThinkMate and would like to know more about...

💡 Tip: Click "Reply" to respond directly to john@example.com

Submitted on: Thursday, February 19, 2026, 2:45 PM
```

---

## 🧪 Testing

### Test the Contact Form

1. Visit **http://localhost:3000** (scroll to bottom)
2. Fill out the form:
   - **Name:** Test User
   - **Email:** your-test-email@gmail.com
   - **Message:** This is a test message from the contact form
3. Click **"Send Message"**
4. You should see: ✅ "Thank you! Your message has been sent."
5. Check your email inbox (`arincon73@gmail.com`)

### Expected Behavior

- ✅ Form validates before sending
- ✅ Shows "Sending..." while processing
- ✅ Success message appears after sending
- ✅ Form clears automatically
- ✅ Email arrives within seconds

---

## 🔧 Configuration

### Environment Variables

**Local Development** (`.env.local`):
```env
RESEND_API_KEY=re_your_actual_key_here
CONTACT_EMAIL=arincon73@gmail.com
```

**Railway Production**:

Add these to Railway's environment variables:
1. `RESEND_API_KEY` - Your Resend API key
2. `CONTACT_EMAIL` - Your email where messages should be sent

---

## 🎨 Customization

### Change Recipient Email

Edit `.env.local`:
```env
CONTACT_EMAIL=your-email@example.com
```

### Change Email Template

Edit `src/app/api/contact/route.ts` - modify the HTML template in the `html` field.

### Add Auto-Reply

You can send a confirmation email to the user by adding a second `resend.emails.send()` call:

```typescript
// Send confirmation to user
await resend.emails.send({
  from: 'ThinkMate <onboarding@resend.dev>',
  to: [email],
  subject: 'Thanks for contacting ThinkMate!',
  html: `<p>Hi ${name},</p><p>We received your message and will get back to you soon!</p>`,
});
```

---

## 📊 Resend Dashboard

Monitor your emails at **https://resend.com/emails**:

- 📈 View send history
- ✅ Check delivery status
- 🔍 See email content
- 📊 Track open rates (if enabled)

---

## 🚨 Troubleshooting

### "Email service is not configured"
- ❌ API key is missing or invalid
- ✅ Check `RESEND_API_KEY` in `.env.local`
- ✅ Restart dev server after adding

### "Failed to send email"
- ❌ Invalid API key
- ❌ Rate limit exceeded (100/day on free tier)
- ✅ Check Resend dashboard for errors
- ✅ Verify your Resend account is active

### Not Receiving Emails
- ✅ Check spam/junk folder
- ✅ Verify `CONTACT_EMAIL` is correct
- ✅ Check Resend dashboard to see if email was sent

---

## 🔐 Security Notes

1. ✅ API key is only used on the server (never exposed to client)
2. ✅ Form has rate limiting built into Resend
3. ✅ Form validation prevents spam submissions
4. ✅ Email addresses are validated before sending

---

## 💰 Pricing

### Free Tier (Current)
- **100 emails/day**
- **3,000 emails/month**
- Perfect for contact forms!

### Pro Tier ($20/month)
- **50,000 emails/month**
- Custom domains
- Advanced analytics

For a contact form, the **free tier is more than sufficient**!

---

## 🎉 You're All Set!

Your contact form is now live and functional. Test it out and watch the emails arrive in your inbox!

**Next Steps:**
1. Get your Resend API key from https://resend.com/
2. Add it to `.env.local`
3. Restart the dev server
4. Test the form!
