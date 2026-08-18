# Westaway Intake Concierge

A conversational replacement for Westaway's static 3-question Calendly intake form.
Founders chat for 3-4 turns with an AI concierge that extracts a structured
"Research Base Object" (the legal matter, specific technical terms, their exact
question, funding/entity context) and hands off to the right rep's Calendly —
Kyle Westaway for ongoing General Counsel engagements at Series A or later,
Stephanie for everything else (project work or earlier-stage).

## Run locally

```bash
pip install -r requirements.txt
cp .env.example .env   # fill in ANTHROPIC_API_KEY and (eventually) the Calendly URLs
uvicorn app.main:app --reload
```

Open http://localhost:8000 and click "Book Free Consult".

## Two invariants this app depends on

1. **Single worker, single Railway replica.** Session state is an in-memory
   Python dict — it is *not* shared across processes. Do not add
   `--workers N>1` to the Procfile or scale this service to multiple Railway
   replicas: a visitor's second message could land on a process that has
   never seen their `session_id`, silently starting them over.
2. **Session state doesn't survive a redeploy.** Every completed conversation
   is also appended to `data/sessions.jsonl` as a durability/audit log, and
   `/session-summary/{session_id}` falls back to reading it if the in-memory
   session is gone — but Railway's container filesystem is itself ephemeral
   across deploys, so this only helps *within* a deploy's lifetime, not
   across one. If you need summaries to survive redeploys, mount a
   [Railway Volume](https://docs.railway.com/reference/volumes) at `data/`.

## Deploying to Railway

This app lives in the same repo as `westaway-os` (the Next.js internal/onboarding apps) but
deploys as its **own Railway service** in the same project — it's a separate Python runtime,
not a Next.js route, and its in-memory session state means it must stay a single service with
a single replica (see the invariants above).

1. In the existing `Westaway` Railway project, add a new service from this same GitHub repo
   and set its **root directory** to `intake-agent/`. Railway's Railpack/Nixpacks builder
   auto-detects the Python app from `requirements.txt` and uses the `Procfile`'s start command.
2. Set environment variables on that service:
   - `ANTHROPIC_API_KEY` — reference the same key already set on the `web` service
     (`${{web.ANTHROPIC_API_KEY}}`) rather than duplicating the secret.
   - `CALENDLY_KYLE_URL`, `CALENDLY_STEPHANIE_URL` — no real links exist yet;
     the widget won't be able to complete a handoff until these are set.
   - `CLAUDE_MODEL=claude-sonnet-5` — materially cheaper and faster than the `claude-opus-5`
     default and plenty capable for this task; also matches the model used elsewhere in
     westaway-os.
3. Generate a public domain for the service. Unlike `/os` and `/onboard`, this app is
   intentionally **not** behind the shared passcode gate — it's a public lead-intake form for
   real prospects, so its domain stays open.
4. Deploy. Confirm `/health` responds before testing the chat flow — it's a
   trivial endpoint with no Anthropic call, so it stays healthy even if the
   Claude API has a bad moment.

## Known simplifications (MVP scope)

- `/session-summary/{session_id}` has no authentication — the session ID is
  an unguessable UUID (same trust model as an "anyone with the link" share).
  Revisit this once it's wired into a real internal workflow.
- No CRM/Slack/email notification when a conversation completes — the sales
  rep currently has to know a `session_id` to look up a summary. Piping
  completions into Monday.com (the client's system of record) or a Slack
  webhook is a natural next step, not built here.
- The homepage mock uses Westaway's actual brand palette (electric blue
  `#0253FE` / navy `#19296D`, Helvetica, 0px border radius) from
  `../sources/brand_identity.md` rather than literally reproducing the dark
  background in the reference screenshot, which read as a possibly-stylized
  mockup rather than the live site's real styling. Easy to adjust once you
  see it running.

## Editing styles

Tailwind is compiled to a static `app/static/styles.css` rather than loaded
from a CDN (avoids a flash of unstyled content and ships a real production
asset). After changing classes in `app/static/index.html` or `app/static/app.js`,
recompile:

```bash
npx tailwindcss -i ./input.css -o ./app/static/styles.css --minify
```

## Project layout

```
app/
├── main.py           # FastAPI routes: /chat, /session-summary, /health, static mount
├── conversation.py    # system prompt, Claude call, turn-cap/skip-ahead/merge/routing logic
├── models.py          # Pydantic request/response models + in-memory SessionState
└── static/            # the whole frontend: index.html, app.js, compiled styles.css, logo
data/sessions.jsonl     # append-only durability/audit log (gitignored)
```
