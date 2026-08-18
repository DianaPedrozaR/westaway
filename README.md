# Westaway OS + Onboarding

Two apps, one Next.js project:

- **`/os`** — Westaway OS, the internal tool (dashboard, deal pre-brief, meeting
  intelligence, email triage, deals pipeline).
- **`/onboard`** — Westaway Onboarding, the client-facing portal (upload, AI
  chatbot, pre-fill, review, sheets, pending items, legal matters).

Both AI features are real Claude API calls, not simulated:

1. **Onboarding chatbot** (`/onboard/chat`) — a live conversation that collects
   Employment Agreement parameters and saves them via a tool call once complete.
2. **Request AI Draft** (Pipeline → Follow Up column) — generates a real offer
   email grounded in that specific deal's context and the flat-fee menu price.

## Requirements

- Node 20+ (this repo pins `20.20.2` via `.nvmrc` — run `nvm use` first if you
  have nvm installed).
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

## Local setup

```bash
nvm use               # if you use nvm — this repo needs Node 20+
npm install
cp .env.example .env  # then fill in ANTHROPIC_API_KEY
npm run db:push        # creates the local SQLite dev database
npm run db:seed        # loads the 11 seeded deals + the Nimbus Robotics onboarding case
npm run dev
```

Open http://localhost:3000 — it links to both apps. You'll hit a passcode gate
first (`ACCESS_PASSCODE` in `.env`, defaults to `westaway2026`).

## Project structure

- `app/os/(shell)/*` — internal pages behind the sidebar; `app/os/login` sits
  outside that shell (its own full-bleed screen).
- `app/onboard/(shell)/*` — Home/Pending/Legal Matters behind the client top-nav.
- `app/onboard/(flow)/*` — the 5-step onboarding flow (Upload → Chatbot →
  Pre-fill → Review → Sheets) behind the stepper header.
- `app/api/onboarding/chat` — streaming chat endpoint (Claude Sonnet 5 + a
  `save_employment_parameters` tool).
- `app/api/deals/[id]/draft-offer` — offer-email generation endpoint.
- `prisma/schema.prisma` + `prisma/seed.ts` — the data model and seed data.
- `middleware.ts` — the passcode gate.

This prototype supports **one active onboarding case at a time** (see
`lib/onboarding.ts`'s `getActiveCase`) — matching how the client portal is
actually used for a single engagement, not a multi-tenant SaaS.

## Deploying to Railway

1. Push this repo to GitHub.
2. Create a new Railway project from that repo, and add the **Postgres**
   plugin — Railway will inject a `DATABASE_URL` automatically.
3. **Switch the Prisma datasource provider** in `prisma/schema.prisma` from
   `sqlite` to `postgresql` (one line) before your first deploy — the local
   dev database is SQLite for zero-setup convenience; production uses the
   Postgres Railway just provisioned.
4. Set environment variables on the Railway service: `ANTHROPIC_API_KEY`,
   `ACCESS_PASSCODE` (pick a real one — don't ship the default), and confirm
   `DATABASE_URL` is present (Railway sets this from the Postgres plugin).
5. Set the build command to `npm run build` and run `npx prisma migrate deploy`
   (or `npx prisma db push` for this prototype) once against the Postgres
   database before or during first deploy, then `npm run db:seed` once to load
   the seed data.
6. Start command: `npm run start`.
