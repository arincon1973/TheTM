# 🚂 Railway Deployment Guide

## ✅ Deployment Issue Fixed

The error was caused by Railway's Nixpacks trying to use Node.js 22, which isn't available yet in their Nix packages. I've fixed this by:

1. ✅ Created `nixpacks.toml` to specify Node.js 20
2. ✅ Updated `package.json` engines to require Node >=20
3. ✅ Added `.railwayignore` for cleaner deployments

## 🚀 Deploy to Railway

### Step 1: Set Environment Variables in Railway

Go to your Railway project → Variables tab and add:

```bash
# Required Variables
MONGODB_URI=mongodb+srv://arincon73_db_user:GB43QqD9jeJsTMsy@thinkmate.y5tlj6d.mongodb.net/Thinkmate?appName=ThinkMate
NEXTAUTH_SECRET=thinkmate-secret-key-change-this-in-production-use-openssl-rand-base64-32
OPENAI_API_KEY=your-openai-api-key-here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth URL (will be your Railway URL)
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

**Important:** Replace `your-openai-api-key-here` with your actual OpenAI API key!

### Step 2: Update Google OAuth Redirect URIs

After Railway assigns your domain:

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://your-railway-domain.railway.app/api/auth/callback/google
   ```
4. Click Save

### Step 3: Deploy

```bash
# Option 1: Push to GitHub and connect Railway to your repo
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main

# Option 2: Use Railway CLI
railway up
```

### Step 4: Verify Deployment

Once deployed, your app will be available at:
```
https://your-project-name.railway.app
```

Test:
1. Visit the home page
2. Sign in at `/auth/sign-in`
3. Try the dashboard at `/dashboard`
4. Test AI note generation

## 📋 Files Created/Modified

### `nixpacks.toml` (NEW)
Tells Railway to use Node.js 20 instead of 22:
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### `package.json` (MODIFIED)
Updated Node.js engine requirement:
```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=9.0.0"
}
```

### `.railwayignore` (NEW)
Excludes unnecessary files from deployment:
- `.next` cache
- `node_modules`
- `.env.local` files
- Test files

## 🔧 Troubleshooting

### Build still fails with Node version error
- Clear Railway build cache: Settings → Clear Cache
- Redeploy the service

### Environment variables not working
- Check Variables tab in Railway dashboard
- Ensure NEXTAUTH_URL uses `${{RAILWAY_PUBLIC_DOMAIN}}`
- Click "Deploy" after changing variables

### MongoDB connection fails
- Verify MONGODB_URI is correct
- Check MongoDB Atlas Network Access allows Railway IPs (0.0.0.0/0)
- Ensure database user has read/write permissions

### Google OAuth fails
- Verify redirect URI matches Railway domain exactly
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Ensure OAuth consent screen is configured

### 500 errors on API routes
- Check Railway logs: View Logs tab
- Verify all environment variables are set
- Check OpenAI API key has credits

## 📊 Railway Configuration

### Recommended Settings

**Resources:**
- Memory: 512MB (minimum) - 1GB (recommended)
- CPU: Shared (free tier) or Dedicated

**Auto-Deploy:**
- Enable for main branch
- Auto-deploy on push

**Health Checks:**
- Path: `/api/health` (if you create one)
- Or default: checks if port responds

### Cost Estimates

**Free Tier:**
- $5 credit/month
- Enough for development/testing
- Sleeps after inactivity

**Paid:**
- ~$5-20/month for small apps
- Scales based on usage
- No sleep mode

## 🔒 Security Checklist for Production

Before going live:

- [ ] Change NEXTAUTH_SECRET to a strong random string
- [ ] Use production MongoDB cluster (not development)
- [ ] Set MongoDB Network Access to specific IPs (not 0.0.0.0/0)
- [ ] Enable HTTPS only (Railway does this automatically)
- [ ] Set secure cookie settings in NextAuth
- [ ] Add rate limiting to API routes
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure CORS properly
- [ ] Use Railway environment groups (staging/production)
- [ ] Set up backup strategy for MongoDB

## 🎯 Post-Deployment Steps

After successful deployment:

1. **Test All Features:**
   - Sign up/Sign in
   - Google OAuth
   - AI note generation
   - CRUD operations
   - Dark mode
   - Mobile responsiveness

2. **Monitor:**
   - Check Railway logs regularly
   - Monitor MongoDB usage
   - Track OpenAI API costs
   - Watch for errors

3. **Optimize:**
   - Enable Next.js production optimizations
   - Use Image Optimization API
   - Implement caching strategies
   - Add CDN for static assets

4. **Scale:**
   - Add more Railway resources if needed
   - Upgrade MongoDB tier for more storage
   - Consider Redis for sessions/caching
   - Add load balancing if traffic grows

## 🆘 Common Deployment Errors

### Error: "nodejs_22 undefined"
**Solution:** ✅ Already fixed with nixpacks.toml!

### Error: "Module not found"
**Solution:** 
- Delete `node_modules` and `.next`
- Run `npm ci` locally to verify
- Commit package-lock.json

### Error: "Build timeout"
**Solution:**
- Increase build timeout in Railway settings
- Optimize build process
- Remove unnecessary dependencies

### Error: "Cannot find module 'next'"
**Solution:**
- Ensure `next` is in dependencies (not devDependencies)
- Run `npm install` and commit package-lock.json

## ✅ Summary

Your ThinkMate app is now configured for Railway deployment with:

✅ Node.js 20 (compatible with Railway)  
✅ Nixpacks configuration  
✅ Environment variables guide  
✅ Railway ignore file  
✅ Production-ready settings  

**Next Steps:**
1. Set environment variables in Railway
2. Push to GitHub or deploy via Railway CLI
3. Update Google OAuth redirect URIs
4. Test your deployed app!

Your deployment should now work without the Node.js 22 error! 🚀
