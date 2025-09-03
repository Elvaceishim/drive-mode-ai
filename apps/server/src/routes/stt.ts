import { Router } from 'express';
import multer from 'multer';
import { openai, mockSTTResponse } from '../lib/openai';
import { log } from '../lib/logger';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /stt: Accepts audio Blob, returns {text, confidence}
router.post('/', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    log('STT request received', { size: req.file.size, mimetype: req.file.mimetype });

    // OpenRouter doesn't support Whisper, so we'll use mock response for now
    // In production, you'd integrate with other STT services like:
    // - AssemblyAI, Deepgram, Google Speech-to-Text, etc.
    log('Using mock STT response (OpenRouter does not support Whisper)');
    return res.json(mockSTTResponse);

    // TODO: Integrate with a dedicated STT service
    // Example: AssemblyAI, Deepgram, Google Speech-to-Text
  } catch (error) {
    log('STT error', error);
    res.status(500).json({ error: 'Speech transcription failed' });
  }
});

export default router;
