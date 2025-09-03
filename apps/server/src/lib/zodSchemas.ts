// zodSchemas.ts
import { z } from 'zod';

export const ActionSchema = z.object({
  action: z.enum(['email', 'calendar', 'other']),
  confidence: z.number().min(0).max(1),
  email: z
    .object({
      to: z.string().optional(),
      subject: z.string().optional(),
      body: z.string().optional(),
      send: z.boolean().optional(),
    })
    .optional(),
  calendar: z
    .object({
      title: z.string().optional(),
      datetime: z.string().optional(),
      durationMin: z.number().optional(),
      attendees: z.array(z.string()).optional(),
    })
    .optional(),
});
