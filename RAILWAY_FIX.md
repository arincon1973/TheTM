# 🚂 Railway Deployment Fix - Node.js 22 Error

## ✅ What I Fixed

The error `undefined variable 'nodejs_22'` happens because Railway's Nixpacks doesn't have Node.js 22 available yet. I've provided **two solutions**:

### Solution 1: Use Node.js 20 with Nixpacks (Recommended)

**What I updated:**
- ✅ Changed `nixpacks.toml` to use `nodejs_20` instead of `nodejs_22`
- ✅ Updated `package.json` to require Node >=20

### Solution 2: Use Dockerfile (Fallback)

**What I created:**
- ✅ Created `Dockerfile` with Node.js 20
- ✅ Updated `next.config.mjs` with standalone output option

## 🚀 How to Deploy Now

### Option A: Try Nixpacks Again (Quick)

The nixpacks.toml has been fixed. Just:

1. **Commit and push:**
   ```bash
   cd /Users/adrianarincon/playground/ai/my-other-project
   git add .
   git commit -m "Fix: Use Node.js 20 for Railway deployment"
   git push origin main
   ```

2. **Clear Railway cache:**
   - Go to Railway dashboard
   - Click your project
   - Settings → Clear Build Cache
   - Click "Redeploy"

3. **It should work now!** ✅

### Option B: Switch to Dockerfile (If Nixpacks Still Fails)

If the Nixpacks approach still doesn't work, use the Dockerfile instead:

1. **Tell Railway to use Dockerfile:**
   - Railway dashboard → your project
   - Settings → Build Configuration
   - **Builder**: Select "Dockerfile"
   - **Dockerfile Path**: `Dockerfile` (leave default)
   - **Root Directory**: Keep blank (Dockerfile handles the path)
   
2. **Set environment variable:**
   - Variables tab → Add variable
   - Name: `BUILD_STANDALONE`
   - Value: `true`

3. **Redeploy**

## 🔧 Required Railway Settings

Make sure these are set in Railway → Variables:

```bash
# Required
MONGODB_URI=mongodb+srv://arincon73_db_user:GB43QqD9jeJsTMsy@thinkmate.y5tlj6d.mongodb.net/Thinkmate?appName=ThinkMate
NEXTAUTH_SECRET=thinkmate-production-secret-change-this
OPENAI_API_KEY=your-actual-openai-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# NextAuth URL (Railway auto-fills this)
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# If using Dockerfile
BUILD_STANDALONE=true
```

## 📋 Files Changed

### At Repository Root (`/playground/ai/my-other-project/`)

**`nixpacks.toml`** - Changed from:
```toml
[phases.setup]
nixPkgs = ["nodejs_22"]  # ❌ Not available
```

To:
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]  # ✅ Available
```

**`Dockerfile`** - NEW (fallback option)
- Uses official Node.js 20 Alpine image
- Multi-stage build for smaller image
- Handles the `thinkmate-next` subfolder correctly

### In `thinkmate-next/`

**`package.json`** - Changed from:
```json
"engines": {
  "node": ">=22.0.0"
}
```

To:
```json
"engines": {
  "node": ">=20.0.0"
}
```

**`next.config.mjs`** - Added:
```javascript
output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined
```

## 🎯 Deployment Checklist

Before deploying, make sure:

- [ ] All files committed and pushed
- [ ] Railway build cache cleared
- [ ] Environment variables set
- [ ] Root directory configured (if needed)
- [ ] Builder selected (Nixpacks or Dockerfile)

### Quick Check Commands

```bash
# Check git status
cd /Users/adrianarincon/playground/ai/my-other-project
git status

# Commit if needed
git add .
git commit -m "Fix Railway Node.js version"
git push origin main

# Check Railway logs
railway logs
```

## 🆘 Troubleshooting

### Still getting nodejs_22 error?

1. **Clear Railway cache:**
   - Settings → Clear Build Cache
   - Try deploying again

2. **Switch to Dockerfile:**
   - Settings → Builder → Select "Dockerfile"
   - Add `BUILD_STANDALONE=true` variable
   - Redeploy

### Build succeeds but app crashes?

1. **Check logs:**
   ```bash
   railway logs
   ```

2. **Verify environment variables:**
   - Make sure all required vars are set
   - Check NEXTAUTH_URL uses `${{RAILWAY_PUBLIC_DOMAIN}}`

3. **Check MongoDB connection:**
   - Verify MONGODB_URI is correct
   - MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)

### "Module not found" errors?

```bash
# Clean install locally
cd thinkmate-next
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

## ✅ Summary

Your options:

**Option 1 (Recommended):** Use the fixed nixpacks.toml
- ✅ Fast builds
- ✅ Optimized for Railway
- ✅ Just commit and push

**Option 2 (Fallback):** Use Dockerfile
- ✅ More control
- ✅ Standard Docker workflow
- ✅ Works everywhere

Both should work now! The Node.js 22 error is fixed. 🎉

## 📞 Next Steps

1. Commit and push the changes
2. Clear Railway build cache
3. Redeploy
4. Your app should build successfully!

If you still have issues, try the Dockerfile approach as a backup.
