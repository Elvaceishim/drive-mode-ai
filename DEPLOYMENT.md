# 🚀 Deployment Guide

## Frontend (Netlify) ✅

### Quick Deploy:
1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Netlify will auto-detect the `netlify.toml` configuration

2. **Environment Variables:**
   - Go to Site settings > Environment variables
   - Add the variables from `netlify-env-vars.txt`

3. **Deploy:**
   - Netlify will automatically build and deploy
   - Your site will be available at `https://YOUR_SITE_NAME.netlify.app`

### Manual Deploy (Alternative):
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd apps/web && npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## Backend (Required for Full Functionality)

The frontend is now deployed, but you'll need to deploy the backend server for full functionality:

### Recommended Backend Hosting:
1. **Railway** (Recommended) - Easy Node.js deployment
2. **Render** - Free tier available
3. **Heroku** - Popular choice
4. **Vercel** - For serverless functions

### Backend Deployment Steps:
1. Choose a hosting provider
2. Deploy the `apps/server` directory
3. Set environment variables (from `apps/server/.env.example`)
4. Update `VITE_SERVER_URL` in Netlify to point to your deployed backend
5. Configure CORS in backend to allow your Netlify domain

## Current Status:
- ✅ Frontend: Ready for Netlify deployment
- ⏳ Backend: Needs separate deployment
- ⏳ Full Integration: After backend deployment

## Demo Mode:
The app includes a "Try Demo Command" button that works without the backend for demonstration purposes.
