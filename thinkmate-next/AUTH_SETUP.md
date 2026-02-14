# ThinkMate Authentication Setup Guide

This guide explains how to set up authentication for ThinkMate using Google OAuth 2.0 and email/password authentication.

## 🔐 Features

- ✅ Google OAuth 2.0 sign-in
- ✅ Email/password authentication
- ✅ Protected routes with middleware
- ✅ Session management with NextAuth.js
- ✅ Secure password hashing with bcrypt
- ✅ TypeScript type safety
- ✅ Tailwind CSS styled components

## 📁 File Structure

```
thinkmate-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts  # NextAuth API route
│   │   │       └── signup/route.ts         # Sign-up API
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx           # Sign-in page
│   │   │   └── sign-up/page.tsx           # Sign-up page
│   │   └── dashboard/page.tsx             # Protected dashboard
│   ├── components/
│   │   └── auth/
│   │       ├── SignInForm.tsx             # Sign-in form component
│   │       ├── SignUpForm.tsx             # Sign-up form component
│   │       └── SessionProvider.tsx        # Session provider wrapper
│   ├── lib/
│   │   └── auth.ts                        # Auth configuration
│   └── types/
│       └── next-auth.d.ts                 # NextAuth type definitions
├── middleware.ts                           # Route protection middleware
├── .env.local                              # Environment variables (DO NOT COMMIT)
└── .env.local.example                     # Environment variables template
```

## 🚀 Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `next-auth` - Authentication for Next.js
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token handling

### 2. Configure Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click **Enable**

4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Select **Web application**
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

5. Update `.env.local` with your credentials:

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and add it to `.env.local` as `NEXTAUTH_SECRET`.

### 4. Update Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

**IMPORTANT:** Never commit `.env.local` to version control!

## 🧪 Testing Authentication

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Email/Password Sign-Up

1. Go to http://localhost:3000/auth/sign-up
2. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123
   - Confirm Password: testpassword123
3. Click "Create Account"
4. You should be redirected to `/dashboard`

### 3. Test Email/Password Sign-In

1. Go to http://localhost:3000/auth/sign-in
2. Enter your email and password
3. Click "Sign In"
4. You should be redirected to `/dashboard`

### 4. Test Google OAuth

1. Go to http://localhost:3000/auth/sign-in
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to `/dashboard`

### 5. Test Protected Routes

1. Try to access http://localhost:3000/dashboard without being logged in
2. You should be redirected to `/auth/sign-in`
3. Sign in and you'll be redirected back to `/dashboard`

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to git
   - Use different secrets for development and production
   - Rotate secrets regularly

2. **Password Security**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Minimum password length: 8 characters
   - Consider adding password strength requirements

3. **Session Management**
   - Sessions expire after 30 days
   - JWT tokens are signed with `NEXTAUTH_SECRET`
   - Sessions are server-side validated

4. **Production Considerations**
   - Use a real database (PostgreSQL, MongoDB, etc.)
   - Replace in-memory user store with database
   - Enable HTTPS in production
   - Set up proper CORS policies
   - Implement rate limiting

## 📦 Database Integration (Production)

For production, replace the in-memory user store with a real database:

### Option 1: Prisma + PostgreSQL

```bash
npm install @prisma/client @next-auth/prisma-adapter
npx prisma init
```

Update `src/lib/auth.ts` to use Prisma adapter.

### Option 2: MongoDB

```bash
npm install mongodb @next-auth/mongodb-adapter
```

Update `src/lib/auth.ts` to use MongoDB adapter.

## 🛠️ Customization

### Add More OAuth Providers

Edit `src/lib/auth.ts` and add more providers:

```typescript
import GithubProvider from 'next-auth/providers/github';

providers: [
  GoogleProvider({ ... }),
  GithubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
  // Add more providers...
]
```

### Customize Sign-In/Sign-Up Pages

Edit the pages in `src/app/auth/`:
- `sign-in/page.tsx` - Sign-in page layout
- `sign-up/page.tsx` - Sign-up page layout

Edit the components in `src/components/auth/`:
- `SignInForm.tsx` - Sign-in form logic and styling
- `SignUpForm.tsx` - Sign-up form logic and styling

### Protect Additional Routes

Update `middleware.ts` to add more protected routes:

```typescript
const publicRoutes = [
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/about',  // Add more public routes
];
```

## 🐛 Troubleshooting

### "Error: Invalid client ID"
- Check that `GOOGLE_CLIENT_ID` in `.env.local` matches your Google Cloud Console
- Ensure there are no extra spaces or quotes

### "Error: Redirect URI mismatch"
- Add the exact redirect URI to Google Cloud Console
- Format: `http://localhost:3000/api/auth/callback/google`

### "TypeError: Cannot read properties of undefined"
- Check that all environment variables are set correctly
- Restart the development server after changing `.env.local`

### Session not persisting
- Check that `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 What's Next?

- ✅ Add password reset functionality
- ✅ Implement email verification
- ✅ Add user profile management
- ✅ Set up database integration
- ✅ Add more OAuth providers (GitHub, Twitter, etc.)
- ✅ Implement two-factor authentication
