# Railway Deployment Guide for ThinkMate

## Problem Solved
Fixed the "Script start.sh not found" error by configuring Railway to understand the project structure.

## Files Created
- `railway.toml` - Railway configuration
- `nixpacks.toml` - Build configuration (specifies Node.js 22)
- `thinkmate-next/.node-version` - Node version file (Node.js 22)
- `thinkmate-next/package.json` - Updated with engine requirements

## Deployment Steps

### 1. Push Configuration Files
Make sure these files are committed to your repository:
```bash
git add railway.toml nixpacks.toml
git commit -m "Add Railway deployment configuration"
git push
```

### 2. Configure Railway Dashboard

Go to your Railway project settings and add these environment variables:

#### Required Environment Variables:
```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=your-production-secret-here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://arincon73_db_user:GB43QqD9jeJsTMsy@thinkmate.y5tlj6d.mongodb.net/Thinkmate?appName=ThinkMate

# Google OAuth  
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI API
OPENAI_API_KEY=your-openai-api-key
```

**IMPORTANT:** 
- Replace `your-app.up.railway.app` with your actual Railway domain
- Generate a new NEXTAUTH_SECRET using: `openssl rand -base64 32`

### 3. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   - `https://your-app.up.railway.app/api/auth/callback/google`
   - `https://your-app.up.railway.app/api/auth/signin/google`

### 4. Alternative: Set Root Directory (Simpler Method)

Instead of using configuration files, you can:

1. Go to your Railway project settings
2. Find "Service Settings"
3. Set **Root Directory** to: `thinkmate-next`
4. This tells Railway where your Next.js app is located

### 5. Deploy

Railway will automatically deploy when you push to your connected branch.

## Troubleshooting

### Node.js Version Error
If you see `"Unsupported engine"` errors:
- **Solution:** The project now uses Node.js 22 (specified in `nixpacks.toml`, `.node-version`, and `package.json`)
- Railway will automatically use the correct version when you deploy
- If issues persist, check Railway logs and ensure the build is using Node 22+

### Build Fails
- Check that all environment variables are set in Railway dashboard
- Verify MongoDB connection string is correct
- Ensure Node.js version is 22 or higher (automatically set by configuration files)

### App Crashes After Deploy
- Check Railway logs: `railway logs`
- Verify NEXTAUTH_URL matches your Railway domain
- Ensure MongoDB allows connections from Railway's IP ranges (use 0.0.0.0/0 for Atlas)

### OAuth Not Working
- Double-check redirect URIs in Google Console match your Railway domain exactly
- Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct in Railway

## Railway Commands (Optional)

If you want to use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Deploy manually
railway up
```

## Production Checklist

- [ ] All environment variables set in Railway
- [ ] NEXTAUTH_SECRET is a secure random string (not the dev one)
- [ ] NEXTAUTH_URL points to your Railway domain
- [ ] Google OAuth redirect URIs updated
- [ ] MongoDB Atlas allows Railway connections
- [ ] Configuration files committed to repository

## Notes

- Railway automatically detects Next.js projects in subdirectories with proper configuration
- The app runs on the port Railway provides via PORT environment variable
- Next.js handles this automatically with `next start`
- File uploads are stored locally - consider using cloud storage (S3, Cloudinary) for production
