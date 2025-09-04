# Netlify Serverless Functions Deployment

## ✅ Backend Converted to Netlify Functions

The backend has been converted from an Express server to Netlify serverless functions. This means:

- **No separate server needed** - everything runs on Netlify
- **No CORS issues** - frontend and backend on same domain
- **Automatic scaling** - serverless functions scale automatically
- **Simpler deployment** - single deploy for frontend + backend

## 📁 Files Created

### Core Function
- `netlify/functions/api.ts` - Main serverless function handling all API routes

### Configuration  
- `netlify.toml` - Updated with function configuration and redirects
- `netlify-production.env` - Environment variables for Netlify dashboard

## 🚀 Deployment Steps

### 1. Update Netlify Environment Variables
Go to your Netlify dashboard → Site settings → Environment variables and add:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://drive-mode-ai.netlify.app/.netlify/functions/api/auth/callback
OPENROUTER_API_KEY=your-openrouter-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SESSION_SECRET=your-secure-session-secret-here
NODE_ENV=production
```

### 2. Update Google OAuth Settings
In Google Cloud Console, update your OAuth app:
- **Authorized redirect URIs**: Add `https://drive-mode-ai.netlify.app/.netlify/functions/api/auth/callback`

### 3. Deploy to Netlify
```bash
# Commit and push all changes
git add .
git commit -m "Add Netlify serverless functions backend"
git push origin main
```

Netlify will automatically deploy both frontend and backend functions.

## 🔗 API Endpoints

All API endpoints are now available at:
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/health`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/auth/google`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/auth/callback`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/stt`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/parse`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/gmail/draft`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/gmail/send`
- `https://drive-mode-ai.netlify.app/.netlify/functions/api/calendar/create`

## 🎯 How It Works

### Frontend Detection
The frontend automatically detects if it's running on Netlify:
```typescript
const isProduction = import.meta.env.PROD;
const isNetlify = window.location.hostname.includes('netlify.app');

export const API_URL = isProduction && isNetlify 
  ? '' // Use same domain for Netlify functions
  : 'http://localhost:8787'; // Local development
```

### URL Redirects
`netlify.toml` redirects all API calls to the function:
```toml
[[redirects]]
  from = "/auth/*"
  to = "/.netlify/functions/api/auth/:splat"
  status = 200
```

### Function Routing
The single `api.ts` function handles all routes internally:
```typescript
if (route.startsWith('/auth')) {
  // Handle authentication
}
if (route === '/stt') {
  // Handle speech-to-text
}
```

## 🧪 Testing

### Local Development
1. Start web dev server: `cd apps/web && npm run dev`
2. Start original server: `cd apps/server && npm run dev`
3. Test at `http://localhost:5173`

### Production Testing
1. Deploy to Netlify
2. Visit `https://drive-mode-ai.netlify.app`
3. Test authentication flow
4. Test microphone functionality

## ✅ Benefits

- **No CORS Issues**: Frontend and backend on same domain
- **Simplified Deployment**: Single Netlify deploy
- **Auto-scaling**: Serverless functions scale automatically
- **Cost Effective**: Pay only for function execution time
- **No Server Management**: Netlify handles infrastructure

## 🔄 Current Implementation

The function currently provides:
- ✅ Google OAuth flow (basic implementation)
- ✅ Mock STT responses
- ✅ Mock Gmail/Calendar responses
- ✅ CORS handling
- ✅ Error handling

## 🚧 Future Enhancements

- Integrate real Google API for token exchange
- Add proper session management
- Implement real STT service (AssemblyAI, Deepgram)
- Add rate limiting and validation
- Enhanced error handling and logging
