# ExamEdge: AI-Driven Development Playbook
## From Idea to Production — Start to Finish

**Version 1.0 | June 2026 | Ngam Vitalis Yuh**

This playbook adapts the *Practical Vibe Coding With AI* / Six-File Context methodology to ExamEdge: an AI-powered examination preparation and personalized learning platform for secondary school students across Africa — curriculum-agnostic, beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to multiple curricula and national examination systems. Everything here is grounded in the ExamEdge engineering specification — not invented in theory.

**Companion documents:**
- `docs/context/project-overview.md` — Canonical vision and MVP scope
- `docs/context/roadmap.md` — V1.0–V3.0 release plan
- `docs/context/documentation-map.md` — Single source of truth index
- `docs/ExamEdge_Engineering_Document.md` — Master technical design
- `docs/AGENTS.md` — Definitive AI agent architecture reference
- `docs/context/` — Living context files the coding agent reads every session

---

## Who This Is For

- Solo developers building ExamEdge for the Presidential African Youth in AI competition
- Engineers joining post-competition who need a complete build map
- AI coding agents (Cursor, Claude Code, Copilot) that need structured context

## What You Will Have When Done

- A complete 10-week MVP build plan decomposed into verifiable units
- Six context files that prevent AI drift across sessions
- Spec-driven workflow prompts for every feature
- Clear scope boundaries so the agent never over-builds

---

# Part 1: Before You Build Anything

## The Mindset Shift

**You are the architect. The AI is the implementation engine.**

ExamEdge is not a chatbot wrapper. It is a pedagogically constrained AI system with five independent chains, offline-first mobile constraints, M1/A1/B1 marking semantics, and regulatory obligations around minors' data. None of that can be inferred by an agent from a vague prompt.

The thinking stays with you:
- What each chain may and may not output
- Which features belong in MVP vs V1.1
- How offline sync resolves conflicts
- When a mark routes to human review

The AI executes that thinking at speed.

## Why AI-Assisted ExamEdge Builds Fail

**Failure Mode 1: Vibe coding collapse**

You prompt "build an AI tutor." The agent produces a ChatGPT clone with instant answers. You try to add M1/A1/B1 marking — the architecture fights you. Hints leak answers. There is no idempotency. Costs explode because every interaction hits Sonnet.

Root cause: no foundation. Every decision was a guess.

**Failure Mode 2: Feature drift**

Week 3: marking works. Week 6: you return and the agent "fixes" auth by switching to Clerk, rewrites the marking schema, adds a teacher dashboard you deferred. The codebase contradicts `AGENTS.md`.

Root cause: agents have no memory between sessions without documented context.

**Failure Mode 3: Scope explosion**

The engineering document describes V5. The competition demo needs V1.0 in 10 weeks. An undisciplined agent builds React Native, French UI, WAEC integration, and Whisper ASR in week 2.

Root cause: no explicit out-of-scope list the agent reads before every session.

## The Conversation Before the Code

Before opening Cursor, pressure-test the system with a planning AI. Cover:

| Domain | Questions |
|--------|-----------|
| Product | What does ExamEdge refuse to do? (Give answers immediately) |
| Users | Who is the Phase 1 user? (GCE O/A-Level student, low-end Android) |
| Flows | Registration → topic select → practice → wrong answer → hint → mark → UVE probe → mastery update |
| Complexity | Mark scheme JSON generation from parameters; anti-leakage hint validation; offline answer queue |
| Risks | AI hallucinated marks shown to students; hint reveals answer; cost overrun at scale |
| Stack | Why monorepo? Why Haiku for marking? Why Neon + pgvector? |
| Out of scope | Mobile app, French, teacher dashboard, 16 subjects — all V1.1+ |

### Planning Prompt (Copy-Paste)

```
I am building ExamEdge: an AI-powered examination preparation and personalized learning platform for secondary school students across Africa — beginning with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems. It marks with M1/A1/B1 partial credit,
guides wrong answers Socratically (never revealing answers), verifies
understanding with UVE probes, and works offline-first on low-end Android.

Ask me questions one at a time to clarify:
- Core student flows from registration to mastery
- The five AI chains and their constraints
- MVP scope vs deferred features
- Database schema and offline sync
- Security for minors' data

Push back when my answers are vague. Help me think clearly before code.
```

---

# Part 2: Building Your Foundation

## The Six-File Context System

Create `docs/context/` with these files. Your coding agent reads them **in order** before every session.

```
docs/context/
├── project-overview.md      ← What ExamEdge is, flows, scope, success criteria
├── architecture.md          ← Stack, boundaries, invariants, data model
├── code-standards.md        ← TypeScript, Next.js, naming, testing rules
├── ai-workflow-rules.md     ← How the agent behaves while building
├── ui-context.md            ← Colors, typography, component conventions
├── progress-tracker.md      ← Current phase, completed units, session notes
└── build-plan.md            ← Numbered units in build order (this playbook's Part 3)
```

### Entry Point: AGENTS.md

Root `AGENTS.md` and `docs/AGENTS.md` are the first files the agent reads. They define AI chain architecture, guardrails, and point to context files.

`.cursorrules` defines coding standards the IDE enforces automatically.

---

# Part 3: The Complete Build Plan

## Core Principle

**UI with mock data first — verified visually before logic.** Then wire backend step by step. Every unit produces something visible and testable. No invisible multi-week backend phases.

## Timeline Overview

| Phase | Weeks | Focus |
|-------|-------|-------|
| 0 — Foundation | 1–2 | Monorepo, DB, auth scaffold, math stack, design system |
| 1 — AI Chains | 3–5 | Five chains, router, RAG, validation schemas |
| 2 — Student Core | 6–7 | Dashboard, study session, marking flow, hints, UVE |
| 3 — Assessment | 7–8 | Question pool, exam simulation, mastery map |
| 4 — Resilience | 8–10 | PWA offline, photo OCR, admin queue, pilot hardening |

**MVP demo target:** 10 weeks. **Infrastructure:** $0/month achievable on free tiers. **AI:** ~$5 Anthropic starter credits for pilot — see `docs/context/zero-budget-stack.md`.

---

## Phase 0 — Foundation (Weeks 1–2)

### Unit 01 — Monorepo Scaffold

**Goal:** Turborepo/npm workspaces with `apps/web`, `packages/db`, `packages/ai`, `packages/shared`. Next.js 14 App Router boots locally.

**UI:** None yet.

**Logic:**
- TypeScript strict in all packages
- ESLint + Prettier + Husky pre-commit
- `.env.example` with all required keys (no secrets committed)
- Health check route: `GET /api/health`

**Verify:**
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] Health route returns 200

---

### Unit 02 — Design System + UI Tokens

**Goal:** Tailwind configured with ExamEdge brand tokens. Primitive components: Button, Input, Card, Modal, Badge.

**UI:**
- Color tokens: primary (exam blue), success (mastery green), warning (amber), danger (red), neutral scale
- Typography scale for mobile-first (min 16px body)
- `components/ui/*` — shadcn-style primitives

**Logic:** Static Storybook-style demo page at `/dev/ui` (dev only, not in production nav)

**Verify:**
- [ ] All tokens defined in `ui-context.md` match implementation
- [ ] Components render on 360px viewport without horizontal scroll

---

### Unit 03 — Landing Page UI

**Goal:** Complete public landing page with mock content — auth-aware CTAs, mobile-first.

**UI:**
- `app/page.tsx` — public landing (not behind auth)
- Navbar: logo, "Log in", "Start preparing" CTA
- Hero: headline, subheadline (examiner-accurate marking + offline — pan-African platform, GCE Buea launch), primary/secondary CTAs
- Social proof: "Built for students across Africa — starting with GCE Board Buea"
- Features: examiner marking, Socratic hints, understanding verification
- How it works: Register → Practice → Get marked → Verify mastery
- Footer: Login, Privacy stub, Contact stub
- Single column, 360px, no horizontal scroll

**Logic:**
- CTAs → `/register` or `/login`
- Authenticated visitor on `/` → redirect `/dashboard`
- Static content only — no API calls

**Verify:**
- [ ] Renders on 360px without horizontal scroll
- [ ] All CTAs use ui-tokens.md classes
- [ ] Authenticated user on `/` redirects to dashboard
- [ ] ui-registry.md updated with Hero, Features, Footer

**Spec:** `docs/context/specs/03-landing-page.md`

---

### Unit 04 — KaTeX + MathQuill Integration

**Goal:** Render and input GCE Pure Mathematics notation (0765 paper symbols).

**UI:**
- `MathDisplay` — KaTeX wrapper with error boundary
- `MathInput` — MathQuill WYSIWYG with LaTeX export

**Logic:**
- LaTeX validation helpers in `packages/shared`
- Test page at `/dev/math` with sample differentiation, integration, vectors

**Verify:**
- [ ] `\frac{d}{dx}`, `\int`, `\vec{}`, `\sqrt{}` render correctly
- [ ] MathQuill output converts to valid LaTeX string

---

### Unit 05 — Database Schema v1

**Goal:** Drizzle schema + initial migration on Neon PostgreSQL.

**Tables (minimum):**
- `users` — id, email, password_hash, role, cognitive_fp jsonb, created_at
- `topics` — id, subject_id, name, syllabus_ref, board, level
- `questions` — id, topic_id, template_text, param_schema jsonb, mark_scheme_template jsonb, validated bool, embedding vector(1536)
- `student_sessions` — id, user_id, mode, status, started_at, questions_attempted
- `student_responses` — id, session_id, question_id, answer_text, marking_result jsonb, hints_used, idempotency_key
- `mastery_records` — id, user_id, topic_id, theta, mvs, next_review, version (optimistic lock)

**Logic:**
- Repository functions in `packages/db/repositories/` — no raw SQL in routes
- Seed script: GCE 0765 Pure Maths topic tree (5 topics minimum for MVP)

**Verify:**
- [ ] Migration runs cleanly on fresh Neon branch
- [ ] Seed populates topics
- [ ] Repository CRUD tests pass

---

### Unit 06 — Auth Scaffold

**Goal:** Auth.js v5 email/password registration and login.

**UI:**
- `/login` — email, password, submit
- `/register` — email, password, confirm, role defaults to student
- `/forgot-password` — email request form (Resend integration stub OK)

**Logic:**
- bcrypt factor 12
- JWT in HTTP-only cookie, SameSite=Lax
- Middleware protects `(student)/*`, `(teacher)/*`, `(admin)/*`
- Role-based route guards

**Verify:**
- [ ] Register → login → redirect to dashboard
- [ ] Unauthenticated access to `/dashboard` → redirect `/login`
- [ ] Invalid credentials → 401 with clear message

---

---

### Unit 07 — Plausible Analytics Initialization

**Goal:** Plausible wired before any student events fire (Units 17+).

**UI:** None visible — verify via Plausible dashboard or network tab.

**Logic:**
- Plausible script in root layout via `next/script` (defer)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.example`
- `apps/web/lib/analytics.ts` — `trackEvent(name, props)` wrapper
- Event names match `project-overview.md` exactly
- No PII in props — opaque userId only

**Verify:**
- [ ] Pageviews appear in Plausible on staging
- [ ] `trackEvent` no-ops gracefully during SSR
- [ ] No email or name in event properties

**Spec:** `docs/context/specs/07-plausible-init.md`

---

### Unit 08 — Redis + Rate Limiting

**Goal:** Upstash Redis client, sliding window rate limiter in middleware.

**Logic:**
- Auth endpoints: 5 req/min per IP
- AI operations: 60 req/hour per authenticated user
- General API: 300 req/min per user
- Idempotency key store: SET NX, 5-minute TTL

**Verify:**
- [ ] 6th auth attempt in 1 minute → 429
- [ ] Duplicate idempotency key returns cached response

---

## Phase 1 — AI Chains (Weeks 3–5)

### Unit 09 — Model Router + Chain Infrastructure

**Goal:** `packages/ai/router.ts` with `getModelConfig(task)`. LangChain.js + Anthropic client. Structured logging for every call.

**Logic:**
- Task → model map per `AGENTS.md`
- Log: chain_type, model, input_tokens, output_tokens, latency_ms, confidence, schema_valid
- No chain calls another chain directly

**Verify:**
- [ ] Router returns Haiku for `marking_math`, Sonnet for `hint_3`
- [ ] Test call logs all required fields

---

### Unit 10 — Examiner Marking Chain

**Goal:** `packages/ai/chains/marking.ts` — M1/A1/B1 marking with Zod output validation.

**Logic:**
- Claude Haiku 4.5, temperature 0.1, max 800 tokens
- Input: questionText, markScheme JSON, studentAnswer
- Output: MarkingResultSchema — steps, totalAwarded, confidence, flagForReview
- 3 few-shot examples from `packages/ai/examples/marking/`
- confidence < 0.70 → flagForReview true
- Zod failure → MarkingValidationError, queue manual review

**Verify:**
- [ ] Known test case: full marks awarded correctly
- [ ] Known test case: M1 awarded, A1 denied (wrong final answer)
- [ ] Invalid LLM output → validation error, no partial result returned

---

### Unit 11 — Socratic Guidance Chain

**Goal:** `packages/ai/chains/guidance.ts` — 3-level hints that never reveal answers.

**Logic:**
- Haiku L1-L2, Sonnet L3
- Hardcoded anti-leakage system prompt (see AGENTS.md)
- Post-generation leakage check: mark scheme numbers, forbidden phrases
- Max 2 retries, then generic conceptual pointer

**Verify:**
- [ ] 100 test scenarios: zero answer leakage
- [ ] previousHints passed — no repeated hints

---

### Unit 12 — Question Generation Chain + RAG

**Goal:** Generate parameterised GCE questions with mark schemes. RAG retrieves 5 similar validated questions first.

**Logic:**
- Voyage AI embeddings → pgvector similarity search
- Sonnet generation, temperature 0.7
- Cross-examination: Haiku solves and validates mark scheme consistency
- Output flagged for human review if inconsistent — never enters live pool unreviewed

**Verify:**
- [ ] Generation blocked without RAG context (empty pool → explicit error)
- [ ] Generated question has valid param_schema and mark_scheme_template

---

### Unit 13 — UVE Probe Chain (Basic MVP)

**Goal:** Post-submission understanding verification — L1 variable substitution + L2 method transparency.

**Logic:**
- Runs async after marking response sent (Vercel background function)
- L1/L2: Haiku; stores probe in student_responses.uve_probes_json
- Evaluation sub-chain updates MVS delta

**Verify:**
- [ ] Marking response returns before UVE completes
- [ ] L1 probe uses different parameter values than original question

---

### Unit 14 — Curriculum Intelligence Chain

**Goal:** Topic concept explanations grounded in syllabus text, cached permanently.

**Logic:**
- Retrieve syllabus chunk for topicId
- Sonnet, temperature 0.6
- Output: definition, worked example (Cameroonian context), common mistakes, practice pointer
- Cache in DB — never regenerate if cached

**Verify:**
- [ ] Second request for same topic → no LLM call (cache hit)
- [ ] Output cites only syllabus-provided facts

---

## Phase 2 — Student Core (Weeks 6–7)

### Unit 15 — Student Dashboard UI (Mock Data)

**Goal:** Complete dashboard UI before any real data wiring.

**UI:**
- Mastery map — topic grid red/amber/green
- Study streak display
- Exam readiness score ring
- Understanding Depth indicator
- "Continue studying" CTA
- Recent sessions list

**Logic:** Mock data in component file. No API calls.

**Verify:**
- [ ] Renders correctly on 360px Android viewport
- [ ] All sections visible without API

---

### Unit 16 — Study Session UI (Mock Data)

**Goal:** Full study/practice session interface.

**UI:**
- Question card with KaTeX rendering
- MathInput answer area
- Submit button
- Hint button (shows remaining: 3/3)
- Marking result panel — step-by-step M1/A1/B1 feedback
- Confidence indicator when < 0.70
- UVE probe modal (mock)

**Logic:** Mock question + mock marking result. Timer optional.

**Verify:**
- [ ] Complete flow visible: question → answer → marks → feedback → probe
- [ ] Hint panel shows guiding question, not answer

---

### Unit 17 — Session API + Answer Submission

**Goal:** Wire study session to real backend. Full Pattern 1 from AGENTS.md.

**Logic:**
- `POST /api/sessions` — create session
- `POST /api/sessions/:id/next-question` — cache-first question delivery
- `POST /api/sessions/:id/responses` — full marking flow with idempotency
- Atomic DB transaction: INSERT response, UPDATE mastery, UPDATE session

**Verify:**
- [ ] End-to-end: submit answer → marks appear < 3s
- [ ] Duplicate submit with same idempotency key → cached result, no double AI call
- [ ] Low confidence → review flag + student notification

---

### Unit 18 — Hint Flow

**Goal:** `GET /api/sessions/:id/hints` — Pattern 2 from AGENTS.md.

**Logic:**
- Max 3 hints per question
- Increment hints_used
- Escalate level 1 → 2 → 3
- Anti-leakage check on every response

**Verify:**
- [ ] 4th hint request → 400 with clear message
- [ ] Hint never contains mark scheme values

---

### Unit 19 — Dashboard Real Data

**Goal:** Replace mock dashboard with PostgreSQL queries.

**Logic:**
- Mastery map from mastery_records
- Streak from session history
- Readiness score computed from topic thetas
- Server Components for initial load speed

**Verify:**
- [ ] After 3 practice sessions, mastery map reflects performance
- [ ] Dashboard loads without client-side fetch waterfall

---

### Unit 20 — Curriculum Explain UI

**Goal:** Wire curriculum chain to student-facing topic explanation pages.

**UI:** "Learn this topic" → four-part explanation (definition, example, mistakes, pointer). Cache-first.

**Logic:** `GET /api/topics/:id/explain` — cache hit or runCurriculumChain. Abort without syllabus chunk.

**Verify:**
- [ ] Second visit instant (no LLM)
- [ ] No syllabus → safe error

---

### Unit 21 — Progress Page + Session History

**Goal:** Full `/progress` page with session history and stats.

**UI:** Summary cards, session list with expandable detail, appeals subsection shell.

**Logic:** Server Component + `sessionsRepository.getHistory()`.

**Verify:**
- [ ] History after 3 sessions
- [ ] 360px layout

---

### Unit 22 — Marking Appeals Flow

**Goal:** Student mark disputes with audit trail.

**UI:** Appeal modal on MarkingDisplay; list on progress page.

**Logic:** `POST/GET /api/appeals`, one appeal per response, Plausible event.

**Verify:**
- [ ] Ownership enforced → 403
- [ ] Duplicate → 409

---

### Unit 23 — Profile Page + Privacy Settings

**Goal:** Settings, preferences, offline status, MVP privacy controls.

**UI:** Account, subjects, offline sync, consent status, data export/deletion.

**Logic:** `GET/PATCH /api/students/me`, export/delete endpoints. See `security.md`.

**Verify:**
- [ ] Delete account → logout
- [ ] Audit log on export/deletion request

---

## Phase 3 — Assessment (Weeks 7–8)

### Unit 24 — Question Pool + Parameter Instantiation

**Goal:** Serve parameterised questions without AI at request time.

**Logic:**
- Select template from validated pool
- Exclude questions seen in last 30 days
- IRT theta matching for difficulty
- Instantiate parameters locally
- Generate mark scheme from template + params
- Redis cache warm pool (TTL 1h)

**Verify:**
- [ ] Two students same template → different parameter values
- [ ] Same student within 30 days → no repeat template

---

### Unit 25 — Exam Simulation Mode

**Goal:** Timed full-paper simulation with post-exam report.

**UI:**
- Fullscreen examination aesthetic (white paper, minimal chrome)
- Countdown timer
- Tab-switch logging via Page Visibility API
- Exit fullscreen → pause + confirmation prompt
- Post-exam examiner report with per-question breakdown

**Logic:**
- Dynamic paper assembly from validated pool
- No two simulations identical
- Session report stored in DB

**Verify:**
- [ ] Timer pauses on tab switch
- [ ] Report shows M1/A1/B1 breakdown per question

---

### Unit 26 — Focus Session Architecture

**Goal:** Structured study blocks with break prompts.

**UI:**
- Pre-session focus preparation prompt (dismissible once)
- 20–35 minute adaptive block timer
- 5–7 minute break screen (minimal, no feeds)
- 2–3 minute reflection micro-session

**Logic:**
- Block length adapts from historical session data
- Focus analytics: active time vs total time, interruption count

**Verify:**
- [ ] Focus prompt shown at session start
- [ ] Analytics panel shows interruption count after tab switches

---

## Phase 4 — Resilience (Weeks 8–10)

### Unit 27 — PWA + Offline Queue

**Goal:** Core study flow works without internet.

**Logic:**
- Service worker caches app shell + next 5 study sessions
- IndexedDB offline answer queue
- On reconnect: sync queue with idempotency keys
- Conflict resolution: server wins on mark, client wins on draft text

**Verify:**
- [ ] Airplane mode: answer question → queued
- [ ] Reconnect: queue syncs, marks appear

---

### Unit 28 — Photo Answer Upload + OCR

**Goal:** Photograph handwritten working, AI vision marking.

**Logic:**
- Upload to Cloudflare R2
- Claude vision transcribes working
- Marking chain processes transcription
- Confidence disclosure shown to student

**Verify:**
- [ ] Photo of handwritten quadratic solution → M1/A1 marks applied
- [ ] Low OCR confidence → flagged for review

---

### Unit 29 — Admin Question Validation Queue

**Goal:** Human gate before questions enter live pool.

**UI:**
- `(admin)/questions` — pending validation list
- Approve / reject / edit mark scheme
- Side-by-side: generated question + cross-examination result

**Logic:**
- Only `validated=true` questions served to students
- Rejection logged with reason

**Verify:**
- [ ] Unvalidated question never returned by next-question API
- [ ] Admin approve → question appears in pool

---

### Unit 30 — Background Jobs (Vercel Cron)

**Goal:** Nightly batch processes.

**Jobs:**
- Sunday 06:00 WAT — weekly report generation (Haiku)
- Nightly — question pool refresh if below threshold
- Nightly — spaced repetition scheduler (SM-2)
- Sunday 02:00 WAT — pg_dump backup to R2

**Verify:**
- [ ] Cron endpoints protected by CRON_SECRET
- [ ] Weekly report email sent via Resend for active students

---

### Unit 31 — Pilot Hardening + Demo Script

**Goal:** 20-student pilot ready. 10-minute competition demo script.

**Logic:**
- Sentry error tracking live
- Plausible already initialized in Unit 07 — verify events still firing
- Load test: 50 concurrent marking requests
- Demo account with pre-seeded mastery data
- Full walkthrough in `docs/demo-script.md`

**Verify:**
- [ ] Demo script completable in < 10 minutes without errors
- [ ] Infrastructure cost ≤ $20/month at pilot scale

---

## Explicit MVP Exclusions

Do not build these until V1.1+:

| Deferred | Version |
|----------|---------|
| React Native mobile app | V1.1 |
| Google/Facebook OAuth | V1.1 |
| Teacher dashboard | V1.1 |
| Full 16-subject coverage | V1.1 |
| French language UI | V1.1 |
| OBC Francophone curriculum | V2.0 |
| WAEC/NECO integration | V2.0 |
| Whisper oral assessment | V2.0 |
| Fine-tuned local models | V3.0 |

---

# Part 4: The Workflow

## Three-Prompt Cycle (Per Unit)

**1. Implement:**
```
Read docs/context/build-plan.md Unit NN and docs/AGENTS.md.
Update docs/context/progress-tracker.md — mark Unit NN in progress.
Implement exactly as specified. Do not go beyond scope.
Run npm run typecheck && npm run lint when done.
```

**2. Correct (if needed):**
```
Unit NN: [element] does not match spec.
Expected: [from build plan]
Current: [what was built]
Fix only this. Do not change anything else.
```

**3. Close:**
```
Unit NN verified. Mark complete in progress-tracker.md.
List what changed. Note any open questions.
```

## When AI Gets Stuck

1. **Re-read context files** — the answer is usually in architecture invariants
2. **Split the unit** — if verification fails across UI + API + AI, separate them
3. **Write a spec file** — `docs/context/specs/NN-feature-name.md` with Goal, Design, Implementation, Verify
4. **Never guess on AI chain behaviour** — if marking output format is unclear, update AGENTS.md first

## Spec File Template

```markdown
# Unit NN: [Name]

## Goal
[Concrete output when complete]

## Design
[UI decisions referencing ui-context.md]

## Implementation
### [Sub-section]
[Exact build instructions]

## Dependencies
- [packages]

## Verify when done
- [ ] [condition]
- [ ] npm run typecheck passes
- [ ] npm run lint passes
- [ ] No console errors in browser
```

---

# Appendix A: Feature Count

| Phase | Units | Weeks |
|-------|-------|-------|
| Phase 0 — Foundation | 8 | 1–2 |
| Phase 1 — AI Chains | 6 | 3–5 |
| Phase 2 — Student Core | 9 | 6–7 |
| Phase 3 — Assessment | 3 | 7–8 |
| Phase 4 — Resilience | 5 | 8–10 |
| **Total** | **31** | **10** |

---

# Appendix B: Key Architecture Invariants

These must never be violated. If an agent proposes breaking one, stop and update architecture.md first.

1. **No client-side AI calls** — all LLM requests through Next.js Route Handlers
2. **No unvalidated AI output to students** — every chain output passes Zod before display
3. **No answer revelation in hints** — Socratic chain hard constraint + anti-leakage check
4. **No raw SQL in routes** — all DB access through repository functions
5. **No question served without validated=true** — human gate for generated content
6. **No chain calls chain** — orchestration in route handlers and cron jobs only
7. **No Sonnet for high-frequency marking** — Haiku only, router enforced
8. **No PII in LLM prompts** — session_id references only, zero-data-retention option

---

# Appendix C: Document Map

| Document | Purpose |
|----------|---------|
| `docs/ExamEdge_Engineering_Document.md` | Full technical specification |
| `docs/ExamEdge_Innovation_Document.md` | Product vision and differentiation |
| `docs/ExamEdge_Volume_II_Framework.md` | Integrity, focus mode, accessibility |
| `docs/ExamEdge_Volume_V_Blueprint.md` | Curriculum matrix, sample paper analysis |
| `docs/ExamEdge_Responsible_AI_Framework.md` | Privacy, bias, hallucination governance |
| `docs/ExamEdge_Cost_Optimisation_Economics.md` | Model routing economics |
| `docs/AGENTS.md` | AI agent architecture (definitive) |
| `.cursorrules` | IDE coding standards |

---

*Built with the Six-File Context System, adapted for ExamEdge.*
*Ngam Vitalis Yuh · June 2026*
