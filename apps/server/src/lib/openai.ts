// openai.ts - Updated to use OpenRouter
import OpenAI from 'openai';

// Use OpenRouter instead of OpenAI directly
export const openai = process.env.OPENROUTER_API_KEY 
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
    })
  : null;

// Mock responses for testing without API key
export const mockSTTResponse = { text: 'Email John about the meeting tomorrow', confidence: 0.95 };
export const mockParseResponse = {
  action: 'email',
  confidence: 0.9,
  email: {
    to: 'John',
    subject: 'Meeting tomorrow',
    body: 'Hi John,\n\nI wanted to follow up about our meeting scheduled for tomorrow.\n\nBest regards',
    send: false
  }
};
