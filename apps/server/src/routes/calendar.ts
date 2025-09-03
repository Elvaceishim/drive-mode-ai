import { Router } from 'express';
const router = Router();

// POST /calendar/create: Creates calendar event
router.post('/create', async (req, res) => {
  // TODO: Integrate Google Calendar API
  res.json({ eventId: 'sample-event-id', url: 'https://calendar.google.com' });
});

export default router;
