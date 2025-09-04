# Authentication & CORS Fixes

## Issues Fixed

### 1. CORS Configuration
- **Problem**: Frontend couldn't connect to backend due to CORS restrictions
- **Fix**: Added proper CORS configuration in `apps/server/src/index.ts` with:
  - Support for Netlify domain: `https://drive-mode-ai.netlify.app`
  - Local development URLs
  - Credentials support
  - Proper headers including `x-user-id`

### 2. Google OAuth Flow
- **Problem**: OAuth callback wasn't properly connecting frontend to user data
- **Fix**: 
  - Enhanced `apps/server/src/routes/auth.ts` to fetch user info from Google
  - Updated OAuth callback to redirect with user data
  - Added proper frontend URL handling

### 3. Frontend Authentication State
- **Problem**: App didn't check for OAuth callbacks or maintain proper session
- **Fix**:
  - Updated `apps/web/src/pages/index.tsx` to handle OAuth callback URL params
  - Enhanced session store with logout functionality
  - Added proper user ID extraction for API calls

### 4. API Authentication Headers
- **Problem**: API calls didn't include proper user authentication
- **Fix**: Updated all API calls in `apps/web/src/lib/api.ts` to include `x-user-id` header

### 5. User Interface Improvements
- **Problem**: No clear indication of logged-in state or way to logout
- **Fix**: Added header to main screen showing user email and logout button

## Testing Steps

### 1. Start Backend Server
```bash
cd apps/server
npm run dev
```
Server should start on `http://localhost:8787`

### 2. Start Frontend
```bash
cd apps/web
npm run dev
```
Frontend should start on `http://localhost:5173`

### 3. Test Authentication Flow
1. Visit `http://localhost:5173`
2. You should see the AuthGate with "Get Started with Google" button
3. Click the button - should redirect to Google OAuth
4. Complete Google authentication
5. Should redirect back with user data and show the main Drive Mode screen
6. Header should show your email address and logout button

### 4. Test Microphone Function
1. After authentication, try clicking the microphone button
2. CORS errors should be resolved
3. Should connect to backend STT endpoint (currently uses mock data)

## Production Deployment

### Backend Environment Variables Needed:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-backend-url.com/auth/callback
FRONTEND_URL=https://drive-mode-ai.netlify.app
OPENROUTER_API_KEY=your-openrouter-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Frontend Environment Variables:
```
VITE_SERVER_URL=https://your-backend-url.com
VITE_SUPABASE_URL=https://cgesyetpyyqsbxtddbqo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Google OAuth Setup
Update Google Cloud Console OAuth settings:
- **Authorized JavaScript origins**: Add your frontend URL (Netlify)
- **Authorized redirect URIs**: Add your backend callback URL

## Security Notes

✅ **Properly Secured**:
- Google OAuth credentials only in backend environment
- No API keys exposed in frontend code
- User authentication required for all API calls
- CORS properly configured for specific domains

⚠️ **Still Needs Work**:
- Session management is currently localStorage-based (should use secure HTTP-only cookies)
- User ID generation is temporary (should use proper database user management)
- Supabase token storage needs proper user table setup

## Files Modified

### Backend:
- `apps/server/src/index.ts` - CORS configuration
- `apps/server/src/routes/auth.ts` - OAuth flow with user info
- `apps/server/src/lib/google.ts` - Added getUserInfo method
- `apps/server/.env` - Added FRONTEND_URL

### Frontend:
- `apps/web/src/pages/index.tsx` - OAuth callback handling
- `apps/web/src/lib/api.ts` - Authentication headers
- `apps/web/src/store/useSession.ts` - Enhanced session management
- `apps/web/src/components/DriveModeScreen.tsx` - User header with logout

## Next Steps

1. **Deploy Backend**: Deploy to a service like Railway, Heroku, or Vercel
2. **Update Environment Variables**: Set production URLs and secrets
3. **Test Full Flow**: Verify authentication and microphone work in production
4. **Enhance Security**: Implement proper session management with HTTP-only cookies
