# InterviewRoast

Practice mock interviews with an AI interviewer that scores your answers and tells you exactly where you lost the room.

## Demo

<video src="demo.mp4" width="100%" autoplay loop muted playsinline></video>

![Demo](demo.gif)

## Why I built this

Practicing interview answers in your head doesn't work. You need someone to actually push back and tell you where you're weak. InterviewRoast generates tough, role-specific questions from any job description, then gives you brutally honest feedback with scores.

## How it works

1. **Paste a job description** - the AI generates 10 tough interview questions tailored to the role
2. **Answer each question** - type your response or use voice input (transcribed with Whisper)
3. **Get roasted** - receive an overall score, letter grade, per-question feedback, strengths, and exactly what to fix

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **AI:** OpenAI GPT-4o + Whisper
- **Database:** Convex
- **Styling:** Tailwind CSS + Radix UI

## Running locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

## License

MIT
