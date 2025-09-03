import { Router } from 'express';
import { gmailAPI, mockGmailResponses } from '../lib/google';
import { logAction } from '../lib/actionLogger';
import { log } from '../lib/logger';

const router = Router();

// POST /gmail/draft: Creates email draft
router.post('/draft', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const userId = req.headers['x-user-id'] as string; // TODO: Get from session/auth

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
    }

    log('Gmail draft request', { to, subject, userId });

    // Use mock response for testing (temporarily forcing mock mode)
    if (true) { // Temporarily force mock response
      log('Using mock Gmail draft response (forced for testing)');
      try {
        await logAction(userId || 'anonymous', 'gmail_draft', { to, subject, body }, 'mock_success');
      } catch (dbError) {
        log('Database not set up, skipping action log');
      }
      return res.json(mockGmailResponses.draft);
    }

    try {
      const result = await gmailAPI.createDraft(userId, { to, subject, body });
      try {
        await logAction(userId, 'gmail_draft', { to, subject, body }, 'success');
      } catch (dbError) {
        log('Database not set up, skipping action log');
      }
      
      log('Gmail draft created', result);
      res.json(result);
    } catch (gmailError: any) {
      log('Gmail API error', gmailError);
      
      // Fallback to mock if Gmail API fails
      if (gmailError.code === 401) {
        return res.status(401).json({ error: 'Gmail authentication required' });
      }
      
      try {
        await logAction(userId, 'gmail_draft', { to, subject, body }, 'error');
      } catch (dbError) {
        log('Database not set up, skipping action log');
      }
      res.status(500).json({ error: 'Failed to create draft' });
    }
  } catch (error) {
    log('Gmail draft route error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /gmail/send: Sends email immediately
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, draftId } = req.body;
    const userId = req.headers['x-user-id'] as string; // TODO: Get from session/auth

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields: to, subject, body' });
    }

    log('Gmail send request', { to, subject, userId, draftId });

    // Use mock response for testing (temporarily forcing mock mode)
    if (true) { // Temporarily force mock response
      log('Using mock Gmail send response (forced for testing)');
      try {
        await logAction(userId || 'anonymous', 'gmail_send', { to, subject, body }, 'mock_success');
      } catch (dbError) {
        log('Database not set up, skipping action log');
      }
      return res.json(mockGmailResponses.send);
    }

    try {
      const result = await gmailAPI.sendEmail(userId, { to, subject, body });
      await logAction(userId, 'gmail_send', { to, subject, body }, 'success');
      
      log('Gmail email sent', result);
      res.json(result);
    } catch (gmailError: any) {
      log('Gmail API error', gmailError);
      
      if (gmailError.code === 401) {
        return res.status(401).json({ error: 'Gmail authentication required' });
      }
      
      await logAction(userId, 'gmail_send', { to, subject, body }, 'error');
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    log('Gmail send route error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
