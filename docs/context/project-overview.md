# Project Overview — ExamEdge

> **Platform identity (vision, mission, values, goals):** [`strategic-charter.md`](strategic-charter.md) — read first.  
> **This document:** MVP product scope, pages, flows, features, and success criteria.

## Platform Vision

ExamEdge is **an AI-powered examination preparation and personalized learning platform for secondary school students across Africa**, beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to support multiple curricula and national examination systems across the continent. It helps students learn, practice, and prepare for national examinations through examiner-accurate marking, Socratic guidance, understanding verification, and long-term mastery tracking.

The platform is **curriculum-agnostic and extensible by design**. Examination boards, syllabi, languages, marking conventions, and country configurations are layered on a shared core — not baked into the architecture. We launch with one curriculum; we build for an entire continent.

**Tagline:** _Master Every Subject. Ace Every Examination._

---

## About the Project

ExamEdge is an Adaptive Examination Preparation and Intelligent Tutoring System (AEP-ITS). It does not answer questions on demand. It develops the capacity to answer them.

The platform gives every student access to a personalised AI examiner, tutor, and curriculum expert: parameterised exam-standard questions, board-accurate partial-credit marking, hints that never give answers away, understanding verification probes, and mastery tracking over time.

**Mission:** Make quality, examiner-accurate preparation accessible to every secondary student in Africa — regardless of income, location, or access to private tutors. **Starting in Cameroon.**

**Competition:** Presidential African Youth in AI & Robotics Competition 2026 — Education Enhancement Track

---

## Phase 1 Launch Scope (MVP V1.0)

The MVP is a **launch configuration**, not the platform's ceiling:

| Dimension         | Phase 1 (Now)                                     | Platform capability                          |
| ----------------- | ------------------------------------------------- | -------------------------------------------- |
| Geography         | Cameroon pilot                                    | Nigeria, Ghana, Kenya, Francophone Africa, … |
| Examination board | GCE Board Buea                                    | WAEC, NECO, KCSE, OBC, BEPC, custom          |
| Level             | O-Level and A-Level                               | All secondary levels per board               |
| Subjects          | Pure Maths (0765), Physics (0710), Biology (0730) | Full catalog per board                       |
| Language          | English                                           | English, French, local languages             |
| Marking           | M1/A1/B1 (GCE convention)                         | Board-specific rubrics via templates         |
| Client            | Web PWA                                           | Web + native mobile (V1.1)                   |

See `roadmap.md` for V1.1 → V3.0 expansion plan.

---

## The Problem It Solves

Two parallel crises define secondary education across Africa — acute in Cameroon, common continent-wide:

1. **Preparation gap:** High examination failure rates and unaffordable private tutoring (5,000–25,000 XAF/month per subject in Cameroon; similar patterns in Lagos, Accra, Nairobi).

2. **Integrity gap:** General-purpose AI (ChatGPT, Gemini, Claude) gives instant answers, creating answer-consumers who fail when those tools are unavailable in examination halls.

ExamEdge addresses both with one design philosophy: **measure and develop genuine understanding, not answer production.**

---

## What ExamEdge Refuses to Do

These are product constraints, not limitations:

- Give the correct answer on first request
- Provide full worked solutions before productive struggle
- Accept a correct answer as proof of mastery without UVE verification
- Generate examination questions in real-time during student sessions (pool is pre-validated)
- Claim to prevent screenshot sharing or question leakage (honest about limits)
- Lock the platform to a single country or examination board in architecture or data model

---

## Pages (MVP — Web PWA)

```
/                           → Landing page (hero, how it works, CTA)
/login                      → Email/password login
/register                   → Student registration (level + subject selection)
/forgot-password            → Password reset via Resend
/dashboard                  → Mastery map, streak, readiness score, continue studying
/practice/[subjectId]       → Topic grid for subject — select topic to study
/study/[topicId]            → Active study session (question, answer, hints, marks)
/study/[topicId]/learn      → Topic concept explanation (curriculum chain, cached)
/exam/[simulationId]        → Timed exam simulation (fullscreen, no navbar)
/progress                   → Session history, focus analytics, appeals
/profile                    → Settings, subject preferences, offline status
/admin/questions            → Question validation queue (admin only)
/dev/ui                     → Design system demo (development only, not in prod nav)
/dev/math                   → KaTeX/MathQuill test page (development only)
```

Mobile app (React Native + Expo) deferred to V1.1.

---

## Navigation

Top navbar on all authenticated pages except exam simulation (fullscreen).

```
Dashboard    Practice    Progress    Profile
```

- Mobile-first: hamburger menu below 640px if needed
- Full-width content, max-w-lg centred on desktop
- No sidebar in MVP
- Exam mode: no navbar, no tabs, fullscreen only

---

## Core User Flows

**Full onboarding, engagement, privacy trust, and global vision:** `student-journey.md`.

### Landing → Registration

1. Student visits landing page
2. Clicks "Start preparing" → `/register`
3. Enters name, email, password, selects O-Level or A-Level
4. Selects subjects (Pure Maths, Physics, Biology for MVP)
5. Selects learning mode: **primary** (main study path) or **supplementary** (reinforce after school) — see `content-architecture.md` §5
6. Redirect to `/dashboard`
7. Dashboard shows all topics red (not started) + focus preparation prompt; recommendations adapt to learning mode

### Onboarding (First Session)

1. Dashboard shows "Start your first practice session" CTA
2. Student taps Practice → selects Pure Mathematics → selects topic (e.g. Differentiation)
3. Focus preparation prompt: "Put your phone face-down, close other tabs..."
4. Study session begins with parameterised question from validated pool

### Study Session (Practice Mode)

1. Question rendered with KaTeX; student answers via MathInput or photo upload
2. Student submits → marking chain returns M1/A1/B1 breakdown (< 3s target)
3. If marks < 50% of available: "Get a hint" button active (max 3 hints)
4. Each hint is a Socratic question — never the answer
5. After marking response: UVE L1 probe presented (variable substitution)
6. Student answers probe → MVS updated on mastery record
7. Mastery map topic colour updates (red → amber → green)
8. "Next question" or "End session"

### Hint Flow

1. Student submits wrong or partial answer
2. Clicks "Hint" — shows "Hints remaining: 2/3"
3. Level 1 hint (Haiku): broad conceptual redirect
4. Level 2 hint (Haiku): narrower, still no answer
5. Level 3 hint (Sonnet): most specific guiding question, anti-leakage checked
6. After 3 hints exhausted: "Keep trying — you have not used all your attempts yet"

### Exam Simulation

1. Student selects "Exam Simulation" from dashboard or practice page
2. Selects subject → system assembles dynamic paper from validated pool
3. Fullscreen mode requested; timer starts
4. No hints available during exam
5. Tab switch → timer pauses, event logged, confirmation prompt shown
6. Submit paper → full marking run per question
7. Post-exam examiner report: per-question M1/A1/B1, total marks, readiness delta

### Photo Answer Flow

1. Student taps camera icon in study session
2. Photographs handwritten working (minimum 1MP)
3. Image uploaded to R2 → Claude vision transcribes
4. Transcription shown for student confirmation before marking
5. Marking chain processes transcription with confidence disclosure

### Offline Flow

1. Student loses connectivity mid-session
2. Banner: "You are offline. Answers will sync when connected."
3. Student continues answering — responses queued in IndexedDB
4. On reconnect: queue syncs with idempotency keys
5. Marks appear after sync completes

### Weekly Cycle

1. Spaced repetition scheduler surfaces due topics on dashboard
2. Sunday 06:00 WAT: weekly AI report generated (Haiku batch)
3. Report emailed via Resend: sessions completed, topics improved, focus areas

### Admin Validation Flow

1. Nightly cron detects question pool below threshold
2. Generation chain + cross-examination produces candidate questions
3. Admin sees queue at `/admin/questions`
4. Admin approves → `validated=true` → enters live pool
5. Admin rejects → logged, never served

### Marking Appeal Flow

1. Student receives marks on study session
2. Clicks "Disagree with this mark?" on MarkingDisplay
3. Submits reason (min 20 characters)
4. Appeal appears on `/progress` with `pending` status
5. Admin resolves → status updated, student notified (email stub OK MVP)

### Curriculum Explain Flow

1. Student on practice topic grid or study session taps "Learn this topic"
2. System checks cache — instant if previously generated
3. If miss: curriculum chain retrieves syllabus chunk, generates four-part explanation
4. Cached permanently — subsequent visits are free (no LLM call)

### Profile & Privacy Flow

1. Student opens `/profile`
2. Updates subject preferences, views offline sync status
3. Under-16 users see parental consent status
4. Can request data export or account deletion (see `security.md`)

---

## Data Architecture

### Student Profile Data

- Lives in `users` table + `mastery_records`
- Updated on every answer submission (atomic transaction)
- Cognitive Fingerprint in `users.cognitive_fp` — updated post-session by cron

### Question Data

- Stored as parameterised templates in `questions` table
- `validated=false` until admin approves
- Embeddings in pgvector for RAG retrieval
- Never regenerated once validated — permanent pool asset

### Session Data

- `student_sessions` — one row per study/exam session
- `student_responses` — one row per answer with marking JSON, hints, UVE probes
- Idempotency key prevents duplicate submissions

### Curriculum Data

- `curricula`, `subjects`, `topics` — seeded from GCE Buea syllabus
- `topic_explanations` — cached curriculum chain output (permanent)
- `syllabus_chunks` — source text for curriculum grounding

---

## Features In Scope (MVP V1.0)

### Student

- Email/password registration and login
- Subject and topic selection (0765, 0710, 0730)
- Mastery map dashboard (red/amber/green per topic)
- Study streak with grace day (one miss per week allowed)
- Exam readiness score
- Practice mode with KaTeX + MathQuill
- M1/A1/B1 marking with per-step feedback
- 3-level Socratic hint chain
- Basic UVE (L1 variable substitution, L2 method transparency)
- Topic concept explanations (curriculum chain, cached)
- Exam simulation with fullscreen and tab-switch logging
- Post-exam examiner report
- Photo answer upload with AI vision OCR
- Offline PWA with IndexedDB answer queue
- Marking appeal submission with status tracking
- Progress page (session history, stats, appeals list)
- Profile page (settings, subjects, offline status, privacy controls)
- Focus session blocks with break prompts
- Focus analytics (active time vs interruptions)
- Parental consent capture (under-16) and data export/deletion requests (MVP stubs)

### Admin

- Question validation queue
- Approve/reject generated questions with notes

### Infrastructure

- Auth.js v5 with role-based access
- Rate limiting (Upstash Redis)
- Sentry error tracking
- Plausible analytics (privacy-first)
- Weekly report emails (Resend)
- Vercel Cron background jobs

---

## Features Out of Scope (MVP)

| Feature                                   | Deferred To |
| ----------------------------------------- | ----------- |
| React Native mobile app                   | V1.1        |
| Google/Facebook OAuth                     | V1.1        |
| Teacher dashboard and class analytics     | V1.1        |
| Full 16-subject GCE coverage              | V1.1        |
| French language UI                        | V1.1        |
| PostgreSQL RLS policies                   | V1.1        |
| Automated self-service data export        | V1.1        |
| WAEC / NECO (Nigeria, Ghana)              | V2.0        |
| KCSE (Kenya)                              | V2.0        |
| OBC / Francophone Cameroon curriculum     | V2.0        |
| Whisper oral assessment                   | V2.0        |
| Advanced Cognitive Fingerprint clustering | V2.0        |
| USSD/SMS delivery (Africa's Talking)      | V2.0        |
| Fine-tuned local marking models           | V3.0        |
| Payment/subscription system               | Post-pilot  |
| Government analytics dashboard            | V3.0        |
| Developer API                             | V3.0        |

Full release plan: `roadmap.md`

---

## Analytics Events (Plausible)

Custom events tracked via Plausible. Never invent new event names without updating this list first.

| Event              | When                                 | Key Properties                             |
| ------------------ | ------------------------------------ | ------------------------------------------ |
| `session_started`  | Student starts study or exam session | userId, mode, subjectId                    |
| `answer_submitted` | Answer submitted for marking         | userId, topicId, answerType                |
| `hint_requested`   | Hint button clicked                  | userId, hintLevel, hintsRemaining          |
| `exam_completed`   | Exam simulation submitted            | userId, subjectId, totalMarks, focusBreaks |
| `topic_mastered`   | Mastery level crosses 0.70 threshold | userId, topicId                            |
| `offline_sync`     | Offline queue synced on reconnect    | userId, queueSize                          |
| `appeal_submitted` | Marking appeal filed                 | userId, responseId                         |

---

## Target User

Secondary school student preparing for national examinations — **Phase 1 pilot:** GCE O-Level or A-Level in Cameroon (GCE Board Buea).

Typical profile:

- Uses a low-end Android phone as primary device (Android 7+, 512MB RAM)
- Has intermittent internet connectivity
- Cannot afford private tutoring at local market rates
- Needs examiner-accurate feedback for their board's marking conventions — not instant answers
- Wants to understand why an answer is wrong, not just what the answer is

The same profile applies across Lagos (WAEC), Accra (WAEC), Nairobi (KCSE), and beyond — with board-specific content swapped in.

---

## Success Criteria (MVP)

- [ ] 10-minute competition demo completable without errors
- [ ] 20-student pilot shows measurable topic mastery improvement over 4 weeks
- [ ] Marking chain ≥92% agreement with human-marked ground truth (500-question benchmark)
- [ ] Zero answer-leakage violations in Socratic chain (100-scenario evaluation)
- [ ] Cross-examination pass rate ≥95% for generated questions
- [ ] Infrastructure cost ≤ $20/month at Month 1 pilot scale (infra $0 possible; AI ~$1–15 — see zero-budget-stack.md)
- [ ] Core study flow works offline with queue sync on reconnect
- [ ] PWA loads on Android 7+ / 512MB RAM without crash
- [ ] Marking response latency < 3 seconds (p95)
- [ ] Registration to first practice session completable in under 5 minutes

---

## Design Principles (Non-Negotiable)

1. **Offline-first:** Core student interactions work without internet
2. **Mobile-first:** 360px viewport, min 16px body text, 44px touch targets
3. **Free-tier first:** MVP infrastructure $0/month achievable; AI ~$5 starter credits for pilot
4. **AI fails safely:** No unvalidated AI output shown to students
5. **Understanding over answers:** Copying is counterproductive by design
6. **Honest about limitations:** Confidence indicators on all AI outputs
7. **Parameterised questions:** Every student gets different numerical instances
8. **Human gate for content:** No AI-generated question served without admin validation
