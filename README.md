# Drive Mode AI

A voice-first AI assistant for safe, hands-free email and calendar management while driving.

## Features

- 🎤 **Voice Commands** - Speak naturally to draft emails and create calendar events
- 🗣️ **Smart Parsing** - AI-powered intent recognition with confidence scoring
- 📧 **Gmail Integration** - Draft and send emails via voice commands
- 📅 **Calendar Management** - Create events with natural language
- 🔒 **Secure OAuth** - Server-side token management for Google services
- 🌙 **Car-Friendly UI** - High contrast, large touch targets, voice feedback

## Tech Stack

**Frontend:** React + TypeScript + Vite + Tailwind CSS + Zustand  
**Backend:** Express + TypeScript + OpenAI + Supabase  
**Audio:** MediaRecorder API, OpenAI Whisper, Web Speech API  
**Integrations:** Gmail API, Google Calendar API, Google OAuth 2.0

## Quick Start

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   cd drive-mode-ai
   npm install
   cd apps/web && npm install
   cd ../server && npm install
   ```

2. **Environment Setup:**
   - Copy `apps/server/.env.example` to `apps/server/.env`
   - Copy `apps/web/.env.example` to `apps/web/.env`
   - Add your API keys (OpenAI, Supabase, Google OAuth)

3. **Run Development:**
   ```bash
   npm run dev  # Runs both frontend (5173) and backend (8787)
   ```

## Voice Commands

**Email Examples:**
- "Email Sarah about the Friday meeting"
- "Send John a message saying I'll be late"
- "Draft an email to team@company.com about the project update"

**Calendar Examples:**
- "Schedule lunch with Mike tomorrow at noon"
- "Create a meeting with the team Friday at 3pm"
- "Book a 1 hour call with Sarah next Tuesday"

## API Routes

- `POST /stt` - Speech-to-text (audio → transcript)
- `POST /parse` - Intent parsing (transcript → structured action)
- `POST /gmail/draft` - Create email draft
- `POST /gmail/send` - Send email
- `POST /calendar/create` - Create calendar event
- `GET /auth/google` - OAuth login
- `GET /auth/callback` - OAuth callback

## Architecture

```
[Voice] → [STT] → [Parse] → [Preview] → [Confirm] → [Gmail/Calendar] → [TTS Feedback]
```

## Safety Features

- **Confirmation Required** - All actions require voice/tap confirmation
- **Confidence Thresholds** - Low confidence commands ask for clarification
- **Error Handling** - Graceful degradation when services fail
- **Secure Tokens** - OAuth tokens stored server-side only

## Development

- `npm run dev` - Start both frontend and backend
- `npm run lint` - Run ESLint on both projects
- `npm run typecheck` - TypeScript checks
- `npm run test` - Run tests

## Next Steps

1. Set up environment variables
2. Configure Google OAuth credentials
3. Test voice commands
4. Customize system prompts for your use case

---

**Note:** This is an MVP focused on core functionality. Production deployment requires additional security, error handling, and UI polish.
