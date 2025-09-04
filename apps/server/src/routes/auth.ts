import { Router } from 'express';
import { googleAuth } from '../lib/google';
import { log } from '../lib/logger';

const router = Router();

// GET /auth/google - Start OAuth flow
router.get('/google', (req, res) => {
  try {
    const state = req.query.state as string || 'default';
    
    // Debug: log environment variables (without secrets)
    log('OAuth config', { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_REDACTED
    });
    
    const authUrl = googleAuth.getAuthUrl(state);
    
    log('OAuth redirect', { authUrl: authUrl.substring(0, 100) + '...', state });
    res.redirect(authUrl);
  } catch (error) {
    log('OAuth start error', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(`OAuth initialization failed: ${errorMessage}`);
  }
});

// GET /auth/callback - Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      log('OAuth error', { error });
      return res.status(400).send(`OAuth error: ${error}`);
    }
    
    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    log('OAuth callback received', { code: '***', state });

    // Exchange code for tokens
    const tokens = await googleAuth.exchangeCodeForTokens(code as string);
    
    // Get user info from Google
    const userInfo = await googleAuth.getUserInfo(tokens.access_token);
    
    // TODO: Create/get user ID from Supabase
    const userId = userInfo.id || 'temp-user-id'; // Use Google ID as user ID
    
    // Store tokens securely
    await googleAuth.storeTokens(userId, tokens);
    
    log('OAuth tokens stored', { userId, email: userInfo.email });

    // Redirect to frontend with user info
    const frontendUrl = process.env.GOOGLE_REDIRECT_URI?.replace('/auth/callback', '') || 'http://localhost:5174';
    const redirectUrl = new URL(frontendUrl);
    redirectUrl.searchParams.set('user_id', userId);
    redirectUrl.searchParams.set('email', userInfo.email);
    if (userInfo.name) redirectUrl.searchParams.set('name', userInfo.name);
    if (userInfo.picture) redirectUrl.searchParams.set('picture', userInfo.picture);
    
    res.redirect(redirectUrl.toString());
  } catch (error) {
    log('OAuth callback error', error);
    res.status(500).send('OAuth callback failed');
  }
});

// GET /auth/status - Check authentication status
router.get('/status', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.json({ authenticated: false });
    }

    try {
      const tokens = await googleAuth.getStoredTokens(userId);
      res.json({ 
        authenticated: true, 
        hasTokens: !!tokens.access_token,
        expiryDate: tokens.expiry_date 
      });
    } catch (error) {
      res.json({ authenticated: false });
    }
  } catch (error) {
    log('Auth status error', error);
    res.status(500).json({ error: 'Failed to check auth status' });
  }
});

export default router;
