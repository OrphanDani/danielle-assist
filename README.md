# SmartWork AI — Your Intelligent Productivity Assistant

SmartWork AI is a modern, AI-powered productivity workspace that helps professionals write polished emails, summarize meeting notes, and prioritize their day. It demonstrates how responsible AI can save real time at work — while keeping every result transparent, editable, and under human control.

> **Demo-ready:** the app ships with sample meeting notes, sample tasks, demo activity history and default preferences, so every feature works the moment you open it — no setup required.

---

## ✨ Features

### 📊 Productivity Dashboard (`/`)
A single command center: a welcome hero, weekly metrics (emails generated, meetings summarized, tasks planned, estimated minutes saved), today's priorities, and recent activity — all backed by demo data.

### ✉️ Smart Email Generator (`/email`)
Generate a complete professional email from the purpose, key information, audience, tone, length and an optional call-to-action. Each result includes a subject line, greeting, body, call-to-action and sign-off, plus an "assumptions" list of anything left as a placeholder. Refine the draft (shorter / longer / change tone / more formal / more persuasive), copy it, and every output is clearly labelled AI-generated.

Audience options: Client · Manager · Colleague · Team · Customer · Business Partner · General Professional
Tone options: Formal · Professional · Friendly · Informal · Persuasive · Apologetic · Concise · Assertive

### 🗒️ Meeting Notes Summarizer (`/meetings`)
Turn raw, unstructured notes into a structured summary: key points, explicit decisions, action items (with owners, deadlines and status), open questions, and a "missing information" list. The AI never invents decisions, deadlines or responsibilities — absent facts are shown as *"Not specified in the meeting notes."* Action items can be imported straight into your task list.

### 🗓️ Task Planner & Scheduler (`/planner`)
An Eisenhower (Urgency × Importance) planner that prioritizes your tasks, builds a time-blocked daily schedule within your working hours, detects conflicts, and recommends realistic blocks with buffers. Every recommendation is a suggestion you can accept, reject or modify. Recommendations include batching, reducing context switching, adding buffers, reserving contingency time and moving flexible tasks.

### 📈 Productivity Insights (`/insights`)
Usage metrics, task-completion rates, per-feature usage, and a transparent **"You saved approximately X hours Y minutes this week"** summary. Time saved is clearly labelled as an **estimate**, not a guaranteed measurement.

### 🕘 History (`/history`)
A local-only activity log of everything you've generated. Delete individual entries or clear all. Raw content is only ever stored when you explicitly enable it in Settings.

### ⚙️ Settings (`/settings`)
Name, working hours, and a "save generated content" privacy preference, plus full disclosures about what is and isn't stored.

---

## 🧠 Responsible AI by design

- **AI-generated content is always labelled** — every result carries a visible AI notice.
- **Everything is editable** — drafts, summaries and plans are starting points, not final answers.
- **No fabrication** — prompts explicitly forbid inventing decisions, deadlines, owners, names or numbers; missing facts are flagged, not guessed.
- **Privacy-first** — raw emails, notes and tasks stay in your browser (localStorage). Content is only persisted when you opt in.
- **User input is untrusted** — all prompts delimit user text and treat it as data, never as instructions, neutralizing prompt-injection attempts.
- **Safe failure** — credit, rate-limit, auth and network errors map to friendly, non-technical messages.
- **Suggestions, not commands** — plans present options to accept, reject or modify.

---

## 🏗️ Technical architecture

| Layer | Technology |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) v1 (full-stack React 19, SSR/SSG, file-based routing) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (oklch design tokens) + shadcn/ui components |
| AI SDK | [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`) + `@ai-sdk/openai-compatible` |
| AI provider | [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) (OpenAI-compatible endpoint) |
| Default model | `google/gemini-3.7-flash` |
| Validation | Zod (inputs and structured AI outputs) |
| Persistence | Browser `localStorage` (no backend database required for the demo) |

### Secure server-side AI calls

All AI calls run on the server via TanStack Start `createServerFn`. The API key lives in a server-only environment variable (`LOVABLE_API_KEY`) and is **never** exposed to the browser. Inputs are validated with Zod and user text is wrapped in clearly-delimited, untrusted `USER_INPUT` blocks inside the prompts.

### Prompt engineering architecture

Every AI function uses a modular, reusable prompt built from: **Role · Context · Objective · Constraints · delimited User Input · Output Format · Validation & Safety rules.** Prompts live in `src/lib/prompts.server.ts` and return structured, Zod-validated JSON consumed internally.

---

## 📁 Project structure

```
src/
├── components/            # AppShell, AiNotice, ErrorBanner, ui/* (shadcn)
├── lib/
│   ├── ai-gateway.server.ts   # Lovable AI Gateway provider + friendly errors
│   ├── ai.functions.ts        # generateEmail, summarizeMeeting, planTasks (server fns)
│   ├── prompts.server.ts       # Modular structured prompts (Role/Context/…/Validation)
│   ├── store.ts                # localStorage activities, tasks, prefs, demo data
│   └── format.ts               # Time/date formatting + store version hook
└── routes/
    ├── __root.tsx        # App shell, Toaster
    ├── index.tsx         # Dashboard
    ├── email.tsx         # Smart Email Generator
    ├── meetings.tsx      # Meeting Notes Summarizer
    ├── planner.tsx       # Task Planner & Scheduler
    ├── insights.tsx      # Productivity Insights
    ├── history.tsx       # Activity History
    └── settings.tsx      # Settings
```

---

## 🚀 Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)
- A Lovable AI Gateway API key (set as `LOVABLE_API_KEY`)

### Install & run

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The dev server starts on `http://localhost:8080`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `LOVABLE_API_KEY` | server only | Authenticates AI Gateway calls; must **never** be exposed to the client |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## 🛠️ Built with

- [TanStack Start](https://tanstack.com/start) · [React 19](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/) · [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway)
- [Zod](https://zod.dev/) · [TanStack Router](https://tanstack.com/router) · [TanStack Query](https://tanstack.com/query)

---

## 📦 Deployment

SmartWork AI is built on TanStack Start and deploys to edge/serverless runtimes (e.g. Cloudflare Workers). When you connect this project to GitHub in [Lovable](https://lovable.dev), every change commits straight to your repository, and the latest preview is published automatically.

---

## 🔒 Privacy & data

- Raw emails, notes and task descriptions are **not** persisted unless you explicitly enable "save generated content" in Settings.
- All activity data lives in your browser's `localStorage`; clearing your browser data removes it.
- AI requests send only the text you submit to the AI Gateway for generation — nothing else is shared.

---

## 📄 License

This project is yours to own and extend. See your repository's license file for details.

---

_Built with [Lovable](https://lovable.dev) — your AI-powered app builder._
