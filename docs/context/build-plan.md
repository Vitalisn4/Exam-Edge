# Build Plan — ExamEdge

## Core Principle

Full page UI built with mock data first — verified visually on 360px viewport before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

Read `AGENTS.md` before any unit involving AI chains. Read `design-brand-identity.md`, `ui-tokens.md`, and `ui-rules.md` before any UI unit.

---

## Phase 0 — Foundation (Weeks 1–2)

### 01 Monorepo Scaffold

Build the monorepo structure. No student UI yet.

**Logic:**

- npm workspaces root with `apps/web`, `packages/db`, `packages/ai`, `packages/shared`
- TypeScript strict in all packages
- ESLint + Prettier + Husky pre-commit hooks
- `GET /api/health` returns `{ status: "ok", version: "0.1.0" }`
- `.env.example` with all keys from architecture.md (placeholder values)
- Root scripts: `typecheck`, `lint`, `test`, `dev`
- Turborepo pipeline config for parallel builds

**Verify:**

- [ ] `npm run dev` starts apps/web
- [ ] `npm run typecheck` passes all packages
- [ ] Health route returns 200

---

### 02 Design System + UI Tokens

Implement design tokens and primitive components.

**UI:**

- `apps/web/app/globals.css` — all tokens from ui-tokens.md
- `tailwind.config.ts` — map CSS variables to Tailwind classes
- Inter font via `next/font/google` in root layout
- shadcn/ui install: Button, Input, Card, Badge, Dialog, Skeleton, Toast
- `/dev/ui` page — renders all primitives with token classes
- Primary button, secondary button, hint button variants

**Logic:**

- None — static demo page only

**Verify:**

- [ ] All ui-tokens.md token groups render correctly on `/dev/ui`
- [ ] Buttons meet 44px min height on mobile
- [ ] No raw hex in component files

**Spec:** `specs/02-design-system.md`

---

### 03 Landing Page UI

Build the complete public landing page — mock content first, auth-aware CTAs.

**UI:**

- `app/page.tsx` — public landing (not behind auth)
- Top navbar: ExamEdge logo, "Log in" link, "Start preparing" primary CTA
- Hero section (MVP scope — extended marketing in Unit 31 / V1.1 per `examedge-ui-mockup-prompt.md`):
  - Headline: "Master your exams — understand, don't memorise" (or brand line from `design-brand-identity.md`)
  - Subheadline: examiner-accurate M1/A1/B1 marking + offline access — built for African students, starting with GCE Board Buea
  - Visual: Teal Forest tokens (`ui-tokens.md`); hero may use navy + teal radial gradient on polish pass
  - Primary CTA: "Start preparing free" → `/register`
  - Secondary CTA: "See how it works" → scroll to features
- Features section — three value props with icons (lucide):
  1. Examiner-accurate M1/A1/B1 marking
  2. Socratic hints that never give answers away
  3. Understanding verification — not a chatbot
- "How it works" section — 4 steps: Register → Practice → Get marked → Verify mastery
- Social proof placeholder — "Built for students across Africa — starting with GCE Board Buea" (no fake testimonials MVP)
- Bottom CTA section — repeat "Start preparing" button
- Footer — links: Login, Privacy (stub), Contact (stub), "© ExamEdge 2026"
- Mobile-first: single column, 360px, no horizontal scroll

**Logic:**

- "Start preparing" / "Log in" → `/register` or `/login` if not authenticated
- If authenticated visitor on `/` → redirect to `/dashboard`
- No API calls — static content only

**Verify:**

- [ ] Landing renders on 360px without horizontal scroll
- [ ] All CTAs use ui-tokens.md classes (no raw hex)
- [ ] Authenticated user visiting `/` redirects to dashboard
- [ ] ui-registry.md updated with Hero, Features, Footer components

**Spec:** Copy `specs/00-spec-template.md` → `specs/03-landing-page.md` before implementing

**Follow-up:** Full Lovable mockup (dark/light, 6 features, pricing, etc.) → **Unit 03b** (`specs/03b-landing-marketing-refresh.md`)

---

### 03b Landing Page Marketing Refresh

Upgrade Unit 03 MVP to **Lovable / Teal Forest mockup parity** — dark + light mode, sticky marketing nav, hero with mastery map preview, examinations grid, testimonials structure, pricing display, multi-column footer.

**Depends on:** Unit 03 merged  
**Does not block:** Units 04–06 (can run in parallel after 03 merges)

**UI:** See `specs/03b-landing-marketing-refresh.md` for full mockup → component map and 5-phase build order.

**Key deliverables:**

- `MarketingNavbar`, `ThemeToggle`, `ThemeProvider`
- `MasteryMapPreview` (static demo heatmap)
- 6 feature cards, `ExaminationsSection` + board tabs, 3-step How it works
- `TestimonialsSection`, `PricingSection`, `OfflineBanner`, `MarketingFooter`
- Teal Forest tokens + dark mode on landing route

**Content rules:** No fake student counts; no unverified named testimonials.

**Spec:** `specs/03b-landing-marketing-refresh.md` · Prompt: `feature-prompts/unit-03b-landing-marketing-refresh.md`

---

### 04 KaTeX + MathQuill Integration

Mathematical notation for GCE Pure Maths 0765.

**UI:**

- `components/math/MathDisplay.tsx` — KaTeX wrapper, error boundary, `trust: false`
- `components/math/MathInput.tsx` — MathQuill, dynamic import, `ssr: false`
- `/dev/math` test page with sample expressions:
  - `\frac{d}{dx}(3x^2 - 12x + 7)`
  - `\int_0^1 x^2 \, dx`
  - `\vec{F} = m\vec{a}`
  - `\sqrt{x^2 + y^2}`

**Logic:**

- `packages/shared/lib/math.ts` — LaTeX validation helpers
- Export LaTeX string from MathInput on change

**Verify:**

- [ ] All sample expressions render without error
- [ ] MathInput exports valid LaTeX string
- [ ] Bad LaTeX shows error message, does not crash page

---

### 05 Database Schema v1

Drizzle schema, migrations, repositories, seed data.

**Logic:**

- `packages/db/schema.ts` — all tables from architecture.md (MVP subset)
- Initial migration SQL
- Repositories: `users`, `questions`, `sessions`, `responses`, `mastery`, `curriculum`
- `packages/db/seed/gce-buea-topics.ts`:
  - Curriculum: GCE Board Buea A-Level
  - Subjects: 0765 Pure Maths, 0710 Physics, 0730 Biology
  - 5 topics per subject minimum (e.g. Differentiation, Integration, Vectors...)
- Seed script: `npm run db:seed`
- pgvector extension enabled on Neon

**Verify:**

- [ ] Migration runs on fresh Neon branch
- [ ] Seed populates subjects and topics
- [ ] Repository unit tests pass for CRUD

---

### 06 Auth Scaffold

Email/password authentication with role-based access.

**UI:**

- `/login` — email, password, submit, link to register
- `/register` — name, email, password, confirm password, level select (OL/AL), submit
- `/forgot-password` — email input, submit (Resend stub OK for MVP)
- Auth error messages: human readable, never raw errors

**Logic:**

- Auth.js v5 in `apps/web/lib/auth.ts`
- bcrypt factor 12 on registration
- JWT HTTP-only cookie, SameSite=Lax
- `middleware.ts` — protect `(student)/*`, `(admin)/*`
- Role in JWT: student default on register
- Redirect authenticated users from `/login` → `/dashboard`
- Redirect unauthenticated from protected routes → `/login`

**Verify:**

- [ ] Register → login → lands on `/dashboard`
- [ ] Unauthenticated `/dashboard` → redirect `/login`
- [ ] Invalid credentials → 401 with clear message

---

### 07 Plausible Analytics Initialization

Set up Plausible before any student events fire. Must complete before Units that emit events (17+).

**Logic:**

- Add Plausible script to `apps/web/app/layout.tsx` via `next/script` (defer)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.example`
- Create `apps/web/lib/analytics.ts`:
  - `trackEvent(name, props)` — wrapper with typeof window check
  - Event names must match project-overview.md exactly
- Call `trackEvent('session_started', ...)` stub in dev page to verify wiring
- After auth login success (Unit 06): no PII in props — opaque userId only
- Document all 7 events in code-standards.md (already listed)

**UI:**

- None visible — verify via Plausible dashboard or browser network tab

**Verify:**

- [ ] Pageviews appear in Plausible dashboard on local/staging
- [ ] `trackEvent` no-ops gracefully when script not loaded (SSR)
- [ ] Event names match project-overview.md list exactly
- [ ] No student email or name in event properties

**Spec:** `specs/07-plausible-init.md`

---

### 08 Redis + Rate Limiting

Upstash Redis client and sliding window rate limiter.

**Logic:**

- `apps/web/lib/redis.ts` — Upstash client from env
- `apps/web/lib/rate-limit.ts`:
  - Auth: 5 req/min per IP
  - AI ops: 60 req/hour per user
  - General API: 300 req/min per user
- Middleware applies auth rate limit on `/api/auth/*`
- Idempotency store: `redis.set(key, value, { ex: 300, nx: true })`
- Helper: `checkIdempotency(userId, key)` → cached result or null

**Verify:**

- [ ] 6th auth attempt in 1 minute → 429
- [ ] Idempotency SET NX prevents duplicate processing
- [ ] Rate limit headers returned on 429

---

## Phase 1 — AI Chains (Weeks 3–5)

### 09 Model Router + Chain Infrastructure

Foundation for all five AI chains.

**Logic:**

- `packages/ai/router.ts` — `getModelConfig(task: TaskType)` per AGENTS.md table
- `packages/ai/log.ts` — structured logging: chain_type, model, tokens, latency_ms
- `packages/ai/sanitize.ts` — strip prompt injection patterns from user text
- LangChain.js + Anthropic client setup
- Unit tests: router returns Haiku for marking, Sonnet for hint_3

**Verify:**

- [ ] All TaskType values mapped in router
- [ ] Test call logs all required fields
- [ ] Sanitize strips "ignore previous instructions"

---

### 10 Examiner Marking Chain

M1/A1/B1 partial credit marking.

**Logic:**

- `packages/ai/chains/marking.ts`
- `packages/ai/schemas/marking.schema.ts` — Zod output schema
- `packages/ai/examples/marking/` — 3 few-shot examples (differentiation, integration, vectors)
- Claude Haiku 4.5, temperature 0.1, max 800 tokens
- confidence < CONFIDENCE_THRESHOLD (0.70) → flagForReview: true
- Zod failure → MarkingValidationError
- Benchmark test fixtures: 10 known cases minimum

**Verify:**

- [ ] Full marks case passes
- [ ] M1 awarded, A1 denied (wrong final answer) passes
- [ ] Invalid LLM JSON → validation error, no partial result
- [ ] marks_given never exceeds marks_available (schema enforced)

---

### 11 Socratic Guidance Chain

3-level hints that never reveal answers.

**Logic:**

- `packages/ai/chains/guidance.ts`
- Haiku for hint_1, hint_2; Sonnet for hint_3
- Hardcoded anti-leakage system prompt (AGENTS.md — never override)
- Post-generation leakage check: mark scheme numbers, forbidden phrases
- Max 2 retries on leakage; then generic conceptual pointer
- `previousHints[]` passed to prevent repetition

**Verify:**

- [ ] 20 test scenarios: zero numerical leakage
- [ ] Forbidden phrases detected and trigger retry
- [ ] Never returns empty — always useful pointer

---

### 12 Question Generation Chain + RAG

Parameterised GCE question generation with retrieval grounding.

**Logic:**

- `packages/ai/rag.ts` — Voyage embedding + pgvector cosine search, k=5
- `packages/ai/chains/generation.ts` — Sonnet, temp 0.7
- Abort if k < 5 validated questions in pool for topic
- Output: templateText, paramSchema, markSchemeTemplate, probeLibrary
- Cross-examination sub-chain: Haiku solves, validates consistency
- Insert with validated=false — never auto-approve

**Verify:**

- [ ] Generation blocked when pool < 5 validated examples
- [ ] Output passes generation.schema.ts Zod validation
- [ ] Cross-examination flags inconsistent mark schemes

---

### 13 UVE Probe Chain (Basic MVP)

Post-submission understanding verification — L1 and L2 only.

**Logic:**

- `packages/ai/chains/uve.ts` — probe generation
- L1: variable substitution (Haiku)
- L2: method transparency (Haiku)
- Evaluation sub-chain: understandingLevel 0-4, mvsDelta
- Async trigger — never blocks marking response
- Store in student_responses.uve_probes JSONB

**Verify:**

- [ ] L1 probe uses different params than original question
- [ ] Marking API returns before UVE completes
- [ ] MVS delta written to mastery_records

---

### 14 Curriculum Intelligence Chain

Topic explanations grounded in syllabus text.

**Logic:**

- `packages/ai/chains/curriculum.ts`
- Check `topic_explanations` cache first — return without LLM if cached
- Retrieve syllabus chunk from DB by topicId
- Sonnet, temp 0.6 — output: definition, worked example, common mistakes, practice pointer
- Cache result permanently on first generation
- Abort if no syllabus chunk — return "content unavailable"

**Verify:**

- [ ] Second request → no LLM call (cache hit)
- [ ] Output structure validated by Zod
- [ ] No syllabus → safe error, no hallucinated content

---

## Phase 2 — Student Core (Weeks 6–7)

### 15 Student Dashboard UI (Mock Data)

Complete dashboard UI — no API calls.

**UI:**

- Top navbar: Dashboard (active), Practice, Progress, Profile
- Welcome header: "Good morning, [Name]"
- ReadinessScore ring — mock 62%
- StreakDisplay — mock 5-day streak
- MasteryHeatmap grid — 15 mock topic cells (teal gradient states per `ui-tokens.md` `--mastery-*`)
- "Continue studying" CTA → `/study/[topicId]`
- Focus preparation prompt on first visit (dismissible)
- Recent sessions list — 3 mock entries

**Logic:**

- Mock data in `dashboard/page.tsx` or local mock file
- No fetch calls

**Verify:**

- [ ] Renders on 360px without horizontal scroll
- [ ] Mastery heatmap colours match ui-tokens.md `--mastery-*` scale
- [ ] All sections visible without API

---

### 16 Study Session UI (Mock Data)

Complete study session interface — no API.

**UI:**

- Header: "Question 2 of 5" + Hint button ("Hints: 3/3")
- QuestionCard with KaTeX sample differentiation question
- MathInput answer area
- Photo upload camera icon beside MathInput
- Submit Answer button (full width, primary)
- Mock MarkingDisplay after submit:
  - "4 / 6 marks"
  - M1 awarded, A1 awarded, A1 denied steps with feedback
- Mock HintPanel after hint click — guiding question text
- Mock UVEProbeModal — variant question

**Logic:**

- State machine in client component: question → answering → marked → probe
- Mock data hardcoded — no API

**Verify:**

- [ ] Full flow visible: question → submit → marks → hint → probe
- [ ] Mark badges use correct colors (M1 blue, A1 green)
- [ ] Hint text is a question, not an answer

---

### 17 Session API + Answer Submission

Wire study session to real backend — Pattern 1.

**UI:**

- Replace mock submit with real API call
- Loading state on Submit: "Marking your answer..."
- Show confidence badge if < 0.70
- Error state: retry button, never raw error text

**Logic:**

- `POST /api/sessions` — create session `{ subjectId, mode: 'practice' }`
- `POST /api/sessions/:id/next-question` — serve question (mock pool OK if Unit 20 not done)
- `POST /api/sessions/:id/responses`:
  - Auth → validate Zod → idempotency → mark scheme → runMarkingChain → transaction
  - Return `{ marks, feedback, confidence, flagForReview }`
- `responsesRepository.submit()` — atomic INSERT + UPDATE mastery + UPDATE session
- Plausible event: `answer_submitted`

**Verify:**

- [ ] End-to-end submit → marks appear < 3s
- [ ] Duplicate idempotency key → cached result, no double AI call
- [ ] Low confidence → "Under review" badge shown

---

### 18 Hint Flow

Wire hint button — Pattern 2.

**UI:**

- Hint button disabled until first submission with marks < 50%
- Shows "Hints remaining: N/3" after each hint
- HintPanel slides in with guiding question
- Disabled at 0 hints remaining

**Logic:**

- `GET /api/sessions/:id/hints?questionId=...`
- Increment hints_used on student_responses
- Escalate level 1 → 2 → 3 based on hints_used
- runGuidanceChain + anti-leakage check
- Return `{ hint, conceptPointed, hintsRemaining }`
- Plausible event: `hint_requested`

**Verify:**

- [ ] 4th hint request → 400 with clear message
- [ ] Hint never contains mark scheme numerical values
- [ ] Hints escalate L1 → L2 → L3

---

### 19 Dashboard Real Data

Replace mock dashboard with PostgreSQL queries.

**UI:**

- Same layout as Unit 15 — no visual changes
- Skeleton loaders while data fetches
- Empty state if no sessions yet

**Logic:**

- Server Component fetches via repositories:
  - `masteryRepository.getMapForStudent(userId)`
  - `sessionsRepository.getRecent(userId, limit: 5)`
  - Compute readiness score from mastery thetas
  - Compute streak from session dates (grace day logic)
- No client-side fetch waterfall

**Verify:**

- [ ] After 3 practice sessions, mastery map reflects real data
- [ ] Streak updates after consecutive days
- [ ] Page loads without client fetch spinner

---

### 20 Curriculum Explain UI

Wire the curriculum intelligence chain to student-facing topic pages.

**UI:**

- "Learn this topic" link on practice topic grid and study session header
- `/study/[topicId]/learn` or slide-over panel — four sections from chain output:
  1. Definition (1–2 sentences)
  2. Worked example (Cameroonian context for MVP)
  3. Common mistakes (top 3)
  4. Practice pointer
- Loading skeleton while fetching
- "Content unavailable" empty state if no syllabus chunk
- Confidence/source note: "Based on official syllabus"

**Logic:**

- `GET /api/topics/:id/explain` — auth required
- Server: check `topic_explanations` cache → return if hit
- Miss: retrieve syllabus chunk → runCurriculumChain → cache permanently → return
- Abort LLM if no syllabus chunk — return 404 with safe message
- Zod validate chain output before display

**Verify:**

- [ ] Second visit → instant load (cache hit, no LLM)
- [ ] No syllabus → friendly error, no hallucinated content
- [ ] Output matches four-part structure
- [ ] ui-registry.md updated with TopicExplainPanel

**Spec:** `specs/20-curriculum-explain-ui.md`

---

### 21 Progress Page + Session History

Full `/progress` page — session history, stats, and shell for focus analytics.

**UI:**

- Top navbar: Progress tab active
- Summary cards: total sessions, hours studied, topics touched, current streak
- Session history list — date, subject, mode (practice/exam), marks %, duration
- Tap session → expandable detail: questions attempted, hints used, marks breakdown
- Empty state: "Complete your first session to see progress here"
- Placeholder section for focus analytics (populated in Unit 26)
- Link to appeals: "View marking appeals" → appeals subsection

**Logic:**

- Server Component: `sessionsRepository.getHistory(userId, { limit: 50 })`
- Aggregate stats from session + response repositories
- No client fetch waterfall

**Verify:**

- [ ] History populates after 3 sessions
- [ ] Session detail shows per-question marks
- [ ] Empty state renders for new users
- [ ] Renders on 360px without horizontal scroll

**Spec:** `specs/21-progress-page.md`

---

### 22 Marking Appeals Flow

Student dispute mechanism for AI marks — human review queue.

**UI:**

- On MarkingDisplay (study session): "Disagree with this mark?" link when `flagForReview` OR always available
- Appeal modal: reason textarea (required, min 20 chars), submit button
- Confirmation: "Your appeal has been submitted for review"
- Progress page appeals section: list pending/resolved appeals with status badge
- Resolved appeal shows outcome note (admin/system)

**Logic:**

- `POST /api/appeals` — `{ responseId, reason }` — student auth, ownership check
- Insert `marking_appeals` row: status `pending`
- One appeal per response (duplicate → 409)
- Plausible event: `appeal_submitted`
- Admin resolution deferred to manual DB/admin tool MVP; status `resolved` via admin PATCH (Unit 29 audit log)
- Audit log entry on submit

**Verify:**

- [ ] Student can appeal own response only → 403 for others
- [ ] Duplicate appeal on same response → 409
- [ ] Appeal appears on progress page
- [ ] `appeal_submitted` event fires

**Spec:** `specs/22-marking-appeals.md`

---

### 23 Profile Page + Privacy Settings

Settings, preferences, offline status, and MVP privacy controls.

**UI:**

- `/profile` — navbar Profile tab active
- Sections:
  - **Account:** name, email (read-only), level (OL/AL), change password link
  - **Subjects:** toggle enrolled subjects (0765, 0710, 0730)
  - **Offline:** last sync time, queued answers count (stub `0` until Unit 27 wires offline-queue.ts)
  - **Privacy:** parental consent checkbox (required if age < 16 on register — display status here)
  - **Data:** "Request my data" button → confirmation toast "We'll email you within 7 days"
  - **Account deletion:** "Delete my account" → confirm dialog → soft-delete
- App version + "Built for students across Africa — starting with GCE Buea"

**Logic:**

- `PATCH /api/students/me` — update preferences, subject selection
- `POST /api/students/me/data-export` — queue export job (cron stub OK MVP)
- `POST /api/students/me/delete` — soft-delete user, invalidate session, audit log
- Consent timestamp stored on `users` table (`consent_given_at`, `consent_type`)
- See `security.md` for minors data requirements

**Verify:**

- [ ] Subject toggle persists across sessions
- [ ] Offline queue count displays when items queued
- [ ] Delete account → logout → cannot login
- [ ] Data export request writes audit log entry
- [ ] ui-registry.md updated with Profile sections

**Spec:** `specs/23-profile-privacy.md`

---

## Phase 3 — Assessment (Weeks 7–8)

### 24 Question Pool + Parameter Instantiation

Real question delivery — no LLM at request time.

**Logic:**

- `questionsRepository.selectFromPool({ topicId, studentId, irtTheta })`:
  - validated=true only
  - Exclude templates seen in last 30 days
  - Match difficulty to IRT theta ± 0.5
- `instantiateParams(paramSchema)` — local, deterministic
- `generateMarkScheme(template, params)` — local
- `renderTemplate(templateText, params)` — LaTeX question text
- Redis warm cache TTL 1h
- Wire `next-question` API to use real pool (replace Unit 17 mock)

**Verify:**

- [ ] Two students same template → different parameter values
- [ ] Same student within 30 days → no repeat template
- [ ] Unvalidated question never returned

---

### 25 Exam Simulation Mode

Timed full-paper examination.

**UI:**

- Entry: select subject → "Start Exam Simulation" on practice page
- Fullscreen request on start
- ExamTimer top-right — amber at 5min, red at 1min
- Question navigation: Previous / Next
- No hint button
- Tab switch → pause overlay with confirmation
- Submit on last question
- ExamReport page: total marks, per-question M1/A1/B1 breakdown, focus breaks count

**Logic:**

- `POST /api/simulations` — assemble paper from pool (dynamic, unique per student)
- `POST /api/simulations/:id/submit` — mark all responses
- `GET /api/simulations/:id/report` — aggregate marks (no LLM for report template)
- Page Visibility API — log focus_breaks on student_sessions
- Fullscreen API — request on start
- Plausible event: `exam_completed`

**Verify:**

- [ ] Timer pauses on tab switch
- [ ] Two simulations → different question sets
- [ ] Report shows per-question mark breakdown

---

### 26 Focus Session Architecture

Structured study blocks and focus analytics.

**UI:**

- Focus preparation prompt at session start (see ui-rules.md)
- Block timer in study session header (20–35 min adaptive)
- Break screen: minimal, "Take a 5-minute break" + countdown
- Reflection micro-prompt at block end: "What was hardest? Rate 1-5"
- Focus analytics section on `/progress` page:
  - Active time vs total time
  - Interruption count
  - Time-of-day performance

**Logic:**

- Store focus events in session metadata JSONB
- Page Visibility API logs tab switches during study (not just exam)
- Block length from historical session data (default 25 min MVP)
- Grace day streak logic in streak calculation

**Verify:**

- [ ] Focus prompt shown at session start
- [ ] Tab switch increments interruption count
- [ ] Progress page shows focus analytics after 3 sessions

---

## Phase 4 — Resilience (Weeks 8–10)

### 27 PWA + Offline Queue

Offline-first study flow.

**UI:**

- OfflineBanner sticky below navbar when offline
- Submit button works offline — shows "Queued — will sync when online"
- Sync success toast when queue clears

**Logic:**

- Service worker: cache app shell + static assets
- `apps/web/lib/offline-queue.ts` — IndexedDB queue
- Queue payload includes idempotency UUID
- Sync on `online` event + app focus
- `POST /api/sessions/:id/responses` with queued payload on reconnect

**Verify:**

- [ ] Airplane mode: submit answer → queued locally
- [ ] Reconnect: queue syncs, marks appear
- [ ] Duplicate sync → idempotency prevents double marking
- [ ] Profile page (Unit 23) shows live queued answer count

---

### 28 Photo Answer Upload + OCR

Handwritten working via camera.

**UI:**

- Camera icon in study session (already stubbed in Unit 16)
- Capture → thumbnail preview → Confirm / Retake
- "Reading your working..." spinner
- Transcription preview for student confirmation
- Then normal MarkingDisplay flow

**Logic:**

- `POST /api/sessions/:id/responses` with `answerType: 'image'`
- Upload to R2: `photos/{userId}/{responseId}.jpg`
- Claude vision transcription (ocr_fallback task, Sonnet temp 0.1)
- Pass transcription to runMarkingChain
- Low OCR confidence → flagForReview

**Verify:**

- [ ] Photo of quadratic working → M1/A1 marks applied
- [ ] Student confirms transcription before marking
- [ ] Low quality photo → review flag, not crash

---

### 29 Admin Question Validation Queue

Human gate before questions enter live pool.

**UI:**

- `(admin)/questions/page.tsx` — admin role required
- Table: pending questions with topic, difficulty, marks, cross-exam result
- Detail view: rendered question (KaTeX) + mark scheme + param schema
- Approve button (green) / Reject button (red) + notes textarea
- Side panel: cross-examination pass/fail indicator

**Logic:**

- `GET /api/admin/questions/review` — validated=false, ordered by created_at
- `PATCH /api/admin/questions/:id/validate`:
  - `{ approved: true }` → validated=true, generate embedding, enter pool
  - `{ approved: false, notes }` → logged, stays out of pool
- Audit log entry on approve/reject

**Verify:**

- [ ] Student next-question never returns unvalidated question
- [ ] Admin approve → question appears in pool within 1h (cache TTL)
- [ ] Non-admin → 403 on admin routes

---

### 30 Background Jobs (Vercel Cron)

Nightly batch processes.

**Logic:**

- `POST /api/cron/weekly-reports` — Sunday 06:00 WAT, CRON_SECRET protected
  - Query active students with sessions in past 7 days
  - Haiku report generation per student
  - Store in DB + send via Resend
- `POST /api/cron/pool-refresh` — nightly
  - Check pool count < QUESTION_POOL_MIN per topic/difficulty
  - Trigger generation chain + cross-examination
- `POST /api/cron/spaced-repetition` — nightly SM-2 next_review updates
- `POST /api/cron/backup` — Sunday 02:00 WAT pg_dump to R2
- `vercel.json` cron schedule config

**Verify:**

- [ ] Cron endpoints reject requests without CRON_SECRET
- [ ] Pool refresh triggers when count below threshold
- [ ] Weekly report email sent for test student

---

### 31 Pilot Hardening + Demo Script

Production readiness for 20-student pilot and 10-minute competition demo.

**Logic:**

- Sentry initialized in web app (client + server)
- Plausible already initialized in Unit 07 — verify still firing
- Load test: 50 concurrent marking requests — p95 < 3s
- Demo account seeded with realistic mastery data
- `docs/demo-script.md` — 10-minute walkthrough steps

**UI:**

- Polish: loading states, error boundaries on all pages
- Remove `/dev/*` routes from production build (env check)

**Demo script (10 minutes):**

1. Login as demo student (30s)
2. Dashboard — mastery map, streak, readiness (1min)
3. Start Pure Maths practice — live parameterised question (1min)
4. Submit wrong answer → Socratic hint (1.5min)
5. Submit correct answer → M1/A1/B1 breakdown (1.5min)
6. UVE probe — answer variant (1.5min)
7. Exam simulation — fullscreen, timer (2min)
8. Post-exam report (1min)
9. Admin validation queue peek (30s)

**Verify:**

- [ ] Demo script completable in < 10 minutes without errors
- [ ] Sentry captures test exception
- [ ] Infrastructure cost manageable at pilot scale (infra $0; AI ~$1–15 — see zero-budget-stack.md)
- [ ] All 31 units marked complete in progress-tracker.md

---

## Unit Index & Dependencies

Each unit below is the **single source of truth** for what to build. Copy-paste prompts live in `feature-prompts/unit-NN-*.md`. Track status in `progress-tracker.md`. Merge gate: `feature-development-prompts.md` §2d.

| #   | Unit                          | Phase | Depends on         | Blocks (summary) |
| --- | ----------------------------- | ----- | ------------------ | ---------------- |
| 01  | Monorepo Scaffold             | 0     | —                  | 02–08            |
| 02  | Design System + UI Tokens     | 0     | 01                 | 03, 15–16        |
| 03  | Landing Page UI               | 0     | 02                 | 06               |
| 03b | Landing Marketing Refresh     | 0     | 03                 | —                |
| 04  | KaTeX + MathQuill             | 0     | 01, 02             | 16               |
| 05  | Database Schema v1            | 0     | 01                 | 06, 09, 17, 19+  |
| 06  | Auth Scaffold                 | 0     | 01, 02, 05         | 07, 15, 17       |
| 07  | Plausible Analytics           | 0     | 01, 06             | 17+              |
| 08  | Redis + Rate Limiting         | 0     | 01                 | 17               |
| 09  | Model Router + Chains infra   | 1     | 01, 05             | 10–14            |
| 10  | Examiner Marking Chain        | 1     | 09                 | 13, 17, 28       |
| 11  | Socratic Guidance Chain       | 1     | 09                 | 18               |
| 12  | Question Generation + RAG     | 1     | 05, 09             | 24, 29, 30       |
| 13  | UVE Probe Chain               | 1     | 09, 10             | 17               |
| 14  | Curriculum Intelligence Chain | 1     | 05, 09             | 20, 30           |
| 15  | Dashboard UI (mock)           | 2     | 02, 06             | 19               |
| 16  | Study Session UI (mock)       | 2     | 02, 04             | 17, 20, 25       |
| 17  | Session API + Answers         | 2     | 05, 06, 08, 10, 16 | 18–22, 24–28     |
| 18  | Hint Flow                     | 2     | 11, 17             | —                |
| 19  | Dashboard Real Data           | 2     | 05, 15, 17         | —                |
| 20  | Curriculum Explain UI         | 2     | 14, 16             | —                |
| 21  | Progress Page                 | 2     | 05, 06, 02         | 22, 26           |
| 22  | Marking Appeals               | 2     | 17, 21             | —                |
| 23  | Profile + Privacy             | 2     | 06, 02             | 27               |
| 24  | Question Pool                 | 3     | 05, 12, 17         | 25               |
| 25  | Exam Simulation               | 3     | 16, 17, 24         | 31               |
| 26  | Focus Sessions                | 3     | 17, 21             | —                |
| 27  | PWA + Offline Queue           | 4     | 17, 23             | 31               |
| 28  | Photo Upload + OCR            | 4     | 10, 17             | —                |
| 29  | Admin Validation Queue        | 4     | 05, 06, 12         | 31               |
| 30  | Background Jobs (Cron)        | 4     | 09, 12, 14         | 31               |
| 31  | Pilot Hardening + Demo        | 4     | 01–30              | —                |

**Optional GitHub Issues:** If your team uses a GitHub Project board, create **one issue per unit** by copying the body from `feature-prompts/unit-NN-*.md` — do not maintain a separate issue document. Labels, milestones, and board setup: `feature-development-prompts.md` §2e.

---

## MVP Exclusions — Do Not Build

React Native app · Google OAuth · Teacher dashboard · 16 subjects · French UI · OBC · WAEC · Whisper ASR · Fine-tuned models · Payment system

---

## Feature Count

| Phase                  | Units  | Weeks  |
| ---------------------- | ------ | ------ |
| Phase 0 — Foundation   | 8      | 1–2    |
| Phase 1 — AI Chains    | 6      | 3–5    |
| Phase 2 — Student Core | 9      | 6–7    |
| Phase 3 — Assessment   | 3      | 7–8    |
| Phase 4 — Resilience   | 5      | 8–10   |
| **Total**              | **31** | **10** |

---

## Implementation Prompt

```
Read AGENTS.md, docs/context/progress-tracker.md, docs/context/feature-development-prompts.md Unit [NN] (§2–§2d),
and docs/context/feature-implementation-prompt-template.md.
Implement Unit [NN] from docs/context/build-plan.md exactly.
Follow Mandatory Development Workflow and merge gate §2d before next feature.
```
