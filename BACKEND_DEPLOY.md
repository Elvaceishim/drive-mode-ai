# Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended)
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `apps/server` folder as the root
4. Add environment variables in Railway dashboard
5. Deploy automatically

### Option 2: Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. In `apps/server` directory run: `vercel`
3. Follow prompts and add environment variables

### Option 3: Heroku
1. Install Heroku CLI
2. In `apps/server`: 
   ```bash
   heroku create your-app-name
   heroku config:set GOOGLE_CLIENT_ID=your-value
   # Add all other env vars
   git subtree push --prefix apps/server heroku main
   ```

## Environment Variables to Set

Copy these to your deployment platform:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.com/auth/callback
FRONTEND_URL=https://drive-mode-ai.netlify.app
OPENROUTER_API_KEY=your-openrouter-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SESSION_SECRET=production-session-secret-generate-random
PORT=8787
NODE_ENV=production
```

## After Backend Deployment

1. **Update Frontend Config**: Change `VITE_SERVER_URL` in Netlify to your backend URL
2. **Update Google OAuth**: Add your backend callback URL to Google Cloud Console
3. **Test**: Try the authentication flow end-to-end

## Adding Start Script

The backend needs a start script for production. Add this to `apps/server/package.json`:

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "ts-node-dev --transpile-only src/index.ts"
  }
}
```
