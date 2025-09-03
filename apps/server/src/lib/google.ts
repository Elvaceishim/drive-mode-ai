// google.ts - Google OAuth and Gmail API helpers
import { google } from 'googleapis';
import { supabase } from './supabase';

// OAuth2 client configuration - lazy load to ensure env vars are loaded
const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_REDACTED,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// Gmail API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
];

export const googleAuth = {
  getAuthUrl: (state?: string) => {
    const oauth2Client = getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state, // Can be used to track user sessions
    });
  },

  exchangeCodeForTokens: async (code: string) => {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  },

  storeTokens: async (userId: string, tokens: any) => {
    // Store tokens securely in Supabase (server-side only)
    const { error } = await supabase
      .from('user_tokens')
      .upsert([
        {
          user_id: userId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          updated_at: new Date().toISOString(),
        },
      ]);
    
    if (error) throw error;
    return true;
  },

  getStoredTokens: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      // Database not set up, throw error to trigger fallback
      throw new Error('Database not configured');
    }
  },

  refreshAccessToken: async (refreshToken: string) => {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();
    return credentials;
  },
};

export const gmailAPI = {
  // Create Gmail API client with user tokens
  getGmailClient: async (userId: string) => {
    const tokens = await googleAuth.getStoredTokens(userId);
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials(tokens);
    return google.gmail({ version: 'v1', auth: oauth2Client });
  },

  // Create email draft
  createDraft: async (userId: string, emailData: any) => {
    const gmail = await gmailAPI.getGmailClient(userId);
    
    const message = gmailAPI.createMessage(emailData);
    
    const draft = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: message,
      },
    });

    return {
      draftId: draft.data.id,
      url: `https://mail.google.com/mail/u/0/#drafts/${draft.data.message?.id}`,
    };
  },

  // Send email directly
  sendEmail: async (userId: string, emailData: any) => {
    const gmail = await gmailAPI.getGmailClient(userId);
    
    const message = gmailAPI.createMessage(emailData);
    
    const sent = await gmail.users.messages.send({
      userId: 'me',
      requestBody: message,
    });

    return {
      messageId: sent.data.id,
      url: `https://mail.google.com/mail/u/0/#sent/${sent.data.id}`,
    };
  },

  // Helper to create email message format
  createMessage: (emailData: { to: string; subject: string; body: string }) => {
    const { to, subject, body } = emailData;
    
    const messageParts = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body,
    ];
    
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    
    return {
      raw: encodedMessage,
    };
  },
};

// Mock responses for testing without Google OAuth
export const mockGmailResponses = {
  draft: { draftId: 'mock-draft-123', url: 'https://mail.google.com/mock-draft' },
  send: { messageId: 'mock-message-456', url: 'https://mail.google.com/mock-sent' },
};
