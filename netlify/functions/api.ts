// Simplified serverless function for Drive Mode AI
// This provides essential API endpoints for Netlify Functions

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

exports.handler = async (event: any, context: any) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  const { httpMethod, path, body, headers, queryStringParameters } = event;
  
  try {
    // Parse the API route
    const route = path.replace('/.netlify/functions/api', '');
    console.log('API Route:', route, 'Method:', httpMethod);

    // Health check
    if (route === '/health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ status: 'ok', platform: 'netlify-functions' }),
      };
    }

    // Authentication routes
    if (route.startsWith('/auth')) {
      if (route === '/auth/google') {
        // Start OAuth flow
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.URL}/.netlify/functions/api/auth/callback`;
        
        const authUrl = `https://accounts.google.com/oauth2/auth?` +
          `client_id=${clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `scope=${encodeURIComponent('email profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar')}&` +
          `response_type=code&` +
          `access_type=offline`;
        
        return {
          statusCode: 302,
          headers: {
            ...corsHeaders,
            Location: authUrl,
          },
          body: '',
        };
      }
      
      if (route === '/auth/callback') {
        // Handle OAuth callback
        const { code, error } = queryStringParameters || {};
        
        if (error) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: `OAuth error: ${error}` }),
          };
        }
        
        if (!code) {
          return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Missing authorization code' }),
          };
        }
        
        // For now, redirect to frontend with mock success
        // TODO: Exchange code for tokens using Google OAuth API
        const frontendUrl = process.env.URL || 'https://drive-mode-ai.netlify.app';
        const userData = {
          id: `user-${Date.now()}`,
          email: 'user@gmail.com',
          name: 'Test User',
          picture: 'https://via.placeholder.com/150'
        };
        
        return {
          statusCode: 302,
          headers: {
            ...corsHeaders,
            Location: `${frontendUrl}?auth=success&user=${encodeURIComponent(JSON.stringify(userData))}`,
          },
          body: '',
        };
      }
      
      if (route === '/auth/status') {
        // Check auth status
        const userId = headers['x-user-id'];
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ 
            authenticated: !!userId && userId !== 'temp-user-id',
            hasTokens: false 
          }),
        };
      }
    }

    // STT route
    if (route === '/stt' && httpMethod === 'POST') {
      // Mock STT response for now
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          text: "Send an email to john@example.com with subject 'Meeting Tomorrow' and message 'Hi John, let's meet tomorrow at 2 PM to discuss the project.'",
          confidence: 0.95
        }),
      };
    }

    // Parse route
    if (route === '/parse' && httpMethod === 'POST') {
      const { text } = JSON.parse(body || '{}');
      
      // Mock parse response
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          action: 'gmail_send',
          parameters: {
            to: 'john@example.com',
            subject: 'Meeting Tomorrow',
            body: "Hi John, let's meet tomorrow at 2 PM to discuss the project."
          },
          confidence: 0.9
        }),
      };
    }

    // Gmail routes
    if (route.startsWith('/gmail') && httpMethod === 'POST') {
      // Mock Gmail responses
      if (route === '/gmail/draft') {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            draftId: 'mock-draft-123',
            url: 'https://mail.google.com/mail/u/0/#drafts/mock-draft-123'
          }),
        };
      }
      
      if (route === '/gmail/send') {
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            messageId: 'mock-message-456',
            url: 'https://mail.google.com/mail/u/0/#sent/mock-message-456'
          }),
        };
      }
    }

    // Calendar routes
    if (route.startsWith('/calendar') && httpMethod === 'POST') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          eventId: 'mock-event-789',
          url: 'https://calendar.google.com/calendar/event?eid=mock-event-789'
        }),
      };
    }

    // Default 404
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not found' }),
    };
    
  } catch (error) {
    console.error('API function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
