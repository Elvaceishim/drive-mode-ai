import { Router } from 'express';
import { openai, mockParseResponse } from '../lib/openai';
import { ActionSchema } from '../lib/zodSchemas';
import { log } from '../lib/logger';

const router = Router();

const PARSING_SYSTEM_PROMPT = `You translate raw voice transcripts into strict actionable JSON for email/calendar tasks. Return ONLY valid JSON, no prose or markdown.

EXACT format required:
{
  "action": "email" | "calendar" | "other",
  "confidence": 0.0-1.0,
  "email": {
    "to": "recipient",
    "subject": "subject line", 
    "body": "email body",
    "send": false
  }
}

For calendar tasks, use "calendar" object instead of "email".
Only return confidence 0.6+ if reasonably sure about intent.
Always use "action" field, never "type".`;

// POST /parse: Accepts text, returns strict action JSON
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'No text provided' });
    }

    log('Parse request received', { text });

    // Use mock response if OpenAI key not configured
    if (!openai) {
      log('Using mock parse response (no OpenAI key)');
      return res.json(mockParseResponse);
    }

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-sonnet:beta', // Good model for structured output on OpenRouter
      messages: [
        { role: 'system', content: PARSING_SYSTEM_PROMPT },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    log('Raw AI response', { responseText });
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from response (strip markdown, extra text)
    let jsonString = responseText;
    // Remove markdown code block if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }
    // Try to find first and last curly braces
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseError) {
      log('JSON parse error', { responseText, jsonString, parseError });
      return res.status(500).json({ error: 'Invalid JSON response from AI', raw: responseText });
    }

    const validated = ActionSchema.safeParse(parsed);
    if (!validated.success) {
      log('Schema validation failed', { parsed, errors: validated.error.errors });
      return res.status(400).json({ error: 'Invalid action schema', raw: responseText });
    }

    log('Parse completed', validated.data);
    res.json(validated.data);
  } catch (error) {
    log('Parse error', error);
    res.status(500).json({ error: 'Intent parsing failed' });
  }
});

export default router;
