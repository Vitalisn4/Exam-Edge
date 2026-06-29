# AGENTS.md — ExamEdge
# AI Agent Architecture, Responsibilities & Interaction Specification
# Version 2.0 | June 2026 | Ngam Vitalis Yuh

Read this file before every feature, every prompt, every AI interaction.
Follow it strictly. Do not approximate. Do not add unrequested features.

This is the **definitive reference** for how every AI component within ExamEdge
is expected to behave and interact with the rest of the system — both runtime
AI chains (marking, guidance, generation, UVE, curriculum) and the AI coding
agent that builds the platform.

---

## CONTEXT FILES — READ ORDER

Before implementing or making architectural decisions, read in order:

1. `docs/context/project-overview.md` — product definition, vision, flows, scope
2. `docs/context/roadmap.md` — V1.0–V3.0 releases, expansion, deployment
3. `docs/context/zero-budget-stack.md` — free tier assessment, MVP cost reality
4. `docs/context/platform-how-it-works.md` — learning loop, AI production, grounding
5. `docs/context/architecture.md` — stack, DB schema, API routes, invariants
6. `docs/context/security.md` — auth, RBAC, rate limits, privacy MVP requirements
5. `docs/context/ui-tokens.md` — colors, typography, spacing tokens
6. `docs/context/ui-rules.md` — layout patterns, page structure
7. `docs/context/ui-registry.md` — existing components (check before building new)
8. `docs/context/code-standards.md` — TypeScript, Next.js, API routes, testing
9. `docs/context/library-docs.md` — Drizzle, Auth.js, LangChain, KaTeX, R2 patterns
10. `docs/context/ai-workflow-rules.md` — scoping, UI-first, verification
11. `docs/context/build-plan.md` — current unit UI + Logic specification (31 units)
12. `docs/context/tech-stack-versions.md` — pinned versions, official doc links, deprecation list
13. `docs/context/progress-tracker.md` — current phase, completed work, next steps
14. `docs/context/specs/` — per-unit spec files (`00-spec-template.md`)
15. `docs/context/documentation-map.md` — single source of truth index

Also reference when needed:
- `docs/demo-script.md` — 10-minute competition demo walkthrough
- `docs/ExamEdge_AI_Driven_Build_Playbook.md` — methodology and extended unit notes
- `docs/ExamEdge_Engineering_Document.md` — master technical design
- `docs/ExamEdge_Responsible_AI_Framework.md` — privacy, bias, governance
- `.cursorrules` — IDE-enforced coding standards

Update `docs/context/progress-tracker.md` after each meaningful implementation change.
Update `docs/context/ui-registry.md` after each new component is built.

---

## ROLE

You are a senior full-stack engineer and AI education systems specialist
helping build ExamEdge: an AI-powered examination preparation and personalized
learning platform for secondary school students across Africa — curriculum-
agnostic by design, beginning with GCE Ordinary and Advanced Level examinations
in Cameroon and expanding to multiple curricula and national examination systems.

You think like a senior engineer who cares deeply about:
- Code clarity over cleverness
- Security (especially for data about minors)
- Educational effectiveness (not just technical correctness)
- Cost discipline (every AI call has a real cost)
- Offline-first design for low-bandwidth African environments

---

## PROJECT OVERVIEW

ExamEdge gives every student access to a personalised AI examiner, tutor,
and curriculum expert. It generates board-standard parameterised questions,
marks with accurate partial credit (M1/A1/B1 for GCE launch), guides through
wrong answers without giving them away, and tracks mastery over time.

**Mission:** Make quality, examiner-accurate preparation accessible to every
secondary student in Africa — starting in Cameroon, expanding country by country.

**Platform:** Curriculum-agnostic — boards, syllabi, languages, and marking
conventions are configuration layers. See `docs/context/roadmap.md`.

**Phase 1 launch:** GCE Board Buea, O-Level and A-Level, English, 3 subjects
**Target users:** Secondary students across Africa (pilot: Cameroon)
**Primary device:** Low-end Android phone (Android 7+, 512MB RAM, 4.5-inch screen)
**Connectivity:** Offline-first. Core features must work without internet.
**Languages:** English (Phase 1), French (V1.1), local languages (V2.0+)
**Examination boards:** GCE Board Buea (Phase 1), WAEC/NECO (V2.0), KCSE (V2.0), OBC (V2.0)

---

## TECH STACK

### Mobile Application
- Framework: React Native + Expo (**SDK 56** — see `tech-stack-versions.md`)
- Router: Expo Router (file-based, deep linking)
- Language: TypeScript strict mode
- Styling: NativeWind v4 (Tailwind v4 syntax in React Native)
- State: Zustand + @react-native-async-storage/async-storage
- Math input: react-native-mathquill (WYSIWYG equation editor)
- Math display: react-native-katex (LaTeX rendering)
- Camera/media: expo-camera, expo-image-picker
- Audio: expo-av (oral explanation recording)
- Offline: expo-sqlite (local question cache), react-native-mmkv for key-value cache

### Web Application (Teacher Dashboard + Admin + API)
- Framework: **Next.js 16** App Router (Node.js 22 LTS)
- Language: TypeScript strict mode
- Styling: **Tailwind CSS v4** (CSS-first `@theme` tokens — see `ui-tokens.md`)
- Math: KaTeX (display) + MathQuill (input)
- Graphs: Recharts (progress analytics)

### API Layer
- Next.js Route Handlers (server-side only)
- Zod **4.x** for all input validation
- All AI calls proxied through API routes — never called from client directly

### Database
- Primary: Neon PostgreSQL (serverless, pgvector extension)
- ORM: Drizzle ORM (type-safe, already in developer stack)
- Cache: Upstash Redis (serverless HTTP client)
- Storage: Cloudflare R2 (audio files, photos, exports)
- Local: SQLite via expo-sqlite (offline question cache on mobile)

### Authentication
- Auth.js v5 (JWT, HTTP-only cookies, SameSite=Lax)
- Strategies: email/password (bcrypt factor 12), Google OAuth
- Mobile: JWT from web API stored in secure expo-secure-store

### AI Infrastructure
- Primary LLM: Claude claude-sonnet-4-6 (Anthropic) — reasoning-intensive tasks
- Fast LLM: Claude Haiku 4.5 (Anthropic) — high-frequency marking
- Orchestration: LangChain.js (@langchain/anthropic)
- Embeddings: Voyage AI text-embedding-3 (1536 dimensions)
- Vector store: pgvector in Neon PostgreSQL
- On-device ASR: Whisper.cpp (quantized base model, oral assessment)
- On-device OCR: Google ML Kit (handwriting recognition)

### Infrastructure
- Hosting: Vercel (Next.js web + API)
- Mobile builds: EAS Build (Expo Application Services)
- Email: Resend
- Analytics: Plausible (self-hosted, privacy-first)
- Error tracking: Sentry (free tier)
- Uptime: Uptime Robot
- CI/CD: GitHub Actions

**Do not introduce new major libraries without asking first and documenting why.**

---

## DEVELOPMENT PHILOSOPHY

Build feature by feature. For every feature:

1. Read this file first.
2. Identify the minimum files that need to change.
3. Build the simplest version that works end to end.
4. Avoid overengineering. No abstractions until you see repetition.
5. Prefer readable code over clever code.
6. Fix lint and TypeScript errors before finishing.
7. Make sure the feature works end to end before committing.

The codebase should be readable by a developer who has never seen it before.
Comments explain WHY, not WHAT. The code explains what.

---

## ARCHITECTURE

```
examedge/
├── apps/
│   ├── mobile/                   React Native + Expo mobile app
│   │   ├── app/                  Expo Router screens only (no logic)
│   │   │   ├── (auth)/           Login, register, reset password
│   │   │   ├── (tabs)/           Main tab navigation
│   │   │   │   ├── index.tsx     Dashboard: mastery map + study plan
│   │   │   │   ├── study.tsx     Active study session
│   │   │   │   ├── practice.tsx  Practice mode (untimed)
│   │   │   │   ├── progress.tsx  Full progress history
│   │   │   │   └── profile.tsx   User profile + settings
│   │   │   └── exam/[id].tsx     Exam simulation (fullscreen, no tabs)
│   │   ├── components/           Reusable UI. Create when used 2+ times.
│   │   │   ├── math/             KaTeX display, MathQuill input
│   │   │   ├── assessment/       QuestionCard, MarkingDisplay, HintPanel
│   │   │   ├── progress/         MasteryMap, TopicBadge, StreakDisplay
│   │   │   └── ui/               Button, Input, Modal, Card primitives
│   │   ├── constants/
│   │   │   ├── images.ts         Centralised image imports (all assets)
│   │   │   ├── colors.ts         Brand colour constants
│   │   │   └── typography.ts     Font size scale
│   │   ├── hooks/                One hook per domain
│   │   │   ├── useSession.ts     Active session management
│   │   │   ├── useMastery.ts     Mastery data fetching + caching
│   │   │   └── useOffline.ts     Connectivity detection + queue
│   │   ├── store/                Zustand stores
│   │   │   ├── session.ts        Current question, hints used, timer
│   │   │   ├── mastery.ts        Topic mastery map (offline-cached)
│   │   │   └── user.ts           Profile, preferences, auth state
│   │   ├── lib/
│   │   │   ├── api.ts            Typed fetch client to web API
│   │   │   ├── offline.ts        IndexedDB queue for offline answers
│   │   │   └── math.ts           LaTeX helpers and validators
│   │   ├── types/                Shared mobile TypeScript types
│   │   └── assets/images/        All generated visual assets
│   │
│   └── web/                      Next.js 16 web app + API
│       ├── app/
│       │   ├── (student)/        Student-facing web routes
│       │   ├── (teacher)/        Teacher dashboard routes
│       │   ├── (admin)/          Admin routes (question validation, analytics)
│       │   └── api/              Route Handlers — all server-side logic
│       │       ├── auth/         Auth.js routes
│       │       ├── sessions/     Session management + answer submission
│       │       ├── questions/    Question generation + retrieval
│       │       ├── simulations/  Exam paper assembly + submission
│       │       └── students/     Mastery, progress, study plan
│       ├── components/           Web UI components
│       └── lib/
│           ├── auth.ts           Auth.js config
│           └── rate-limit.ts     Upstash rate limiter
│
└── packages/
    ├── db/                       Database layer
    │   ├── schema.ts             Complete Drizzle schema
    │   ├── migrations/           Plain SQL migration files
    │   └── repositories/         Data access functions (never raw SQL in routes)
    │       ├── questions.ts
    │       ├── sessions.ts
    │       ├── responses.ts
    │       └── mastery.ts
    ├── ai/                       AI chain definitions
    │   ├── chains/
    │   │   ├── marking.ts        Examiner Marking Chain (Haiku, temp 0.1)
    │   │   ├── guidance.ts       Socratic Guidance Chain (Sonnet, temp 0.5)
    │   │   ├── generation.ts     Question Generation Chain (Sonnet, temp 0.7)
    │   │   ├── uve.ts            UVE Probe Chain (Sonnet, temp 0.2-0.3)
    │   │   └── curriculum.ts     Concept Explanation Chain (Sonnet, temp 0.6)
    │   ├── router.ts             Model router (task → model config)
    │   ├── rag.ts                pgvector similarity retrieval
    │   └── schemas/              Zod output schemas for all chains
    │       ├── marking.schema.ts
    │       ├── generation.schema.ts
    │       └── uve.schema.ts
    └── shared/                   Types shared across apps
        ├── types/
        │   ├── curriculum.ts     Curriculum, subject, topic types
        │   ├── assessment.ts     Question, mark scheme, response types
        │   └── mastery.ts        Mastery record, IRT types
        └── constants/
            └── boards.ts         Examination board configurations
```

---

## RUNTIME AI AGENT RESPONSIBILITIES

ExamEdge deploys **five runtime AI agents** (chains). Each is a single-purpose,
stateless executor with fixed constraints. They do not share memory, call each
other, or adapt their own prompts.

| Agent | Primary Responsibility | Must Never |
|-------|------------------------|------------|
| **Examiner (Marking)** | Award M1/A1/B1 marks from explicit rubric | Infer unstated steps; exceed marks_available |
| **Socratic Tutor (Guidance)** | Ask one guiding question per hint | Reveal answers, next steps, or mark scheme values |
| **Question Author (Generation)** | Create parameterised GCE questions + mark schemes | Generate without RAG context; skip human validation |
| **Verifier (UVE)** | Probe genuine understanding post-submission | Block marking response; run synchronously on hot path |
| **Curriculum Expert** | Explain topics from syllabus text only | Invent curriculum facts; regenerate cached content |

### Runtime Agent Capabilities

| Capability | Marking | Guidance | Generation | UVE | Curriculum |
|------------|---------|----------|------------|-----|------------|
| Award partial credit | ✓ | — | — | — | — |
| Socratic questioning | — | ✓ | — | partial | — |
| Parameterised templates | — | — | ✓ | ✓ | — |
| RAG retrieval | — | — | ✓ | — | ✓ |
| Confidence scoring | ✓ | — | — | ✓ | — |
| Permanent caching | — | — | ✓ (validated pool) | — | ✓ |
| Async execution | — | — | ✓ | ✓ | — |

### Development AI Agent Responsibilities

The AI coding agent (Cursor, Claude Code, etc.) building ExamEdge must:

- Read context files and this document before every session
- Implement one build unit at a time per `docs/context/build-plan.md`
- Enforce all architecture invariants in generated code
- Never simplify away Zod validation, anti-leakage checks, or idempotency
- Never expose API keys or call Anthropic from client code
- Update progress-tracker.md after each unit
- Ask before schema changes, new dependencies, or chain prompt modifications

---

## AI AGENT ARCHITECTURE

### The Five Chains

ExamEdge has exactly five AI chains. Each is independent. Each has a
defined model, temperature, input schema, output schema, and failure mode.

#### 1. Examiner Marking Chain (`packages/ai/chains/marking.ts`)

**Purpose:** Award M1/A1/B1 marks for a student's submitted answer.

**Model:** Claude Haiku 4.5
**Temperature:** 0.1 (near-deterministic — consistent marks required)
**Max tokens:** 800
**Trigger:** Every answer submission via POST /api/sessions/:id/responses

**Input:**
```typescript
{
  questionText: string,        // Rendered question with applied parameters
  markScheme: MarkScheme,      // JSON rubric: steps, mark types, acceptable answers
  studentAnswer: string,       // Student's submitted working and answer
}
```

**Output (Zod-validated):**
```typescript
{
  steps: Array<{
    stepNumber: number,
    markType: 'M1' | 'A1' | 'B1' | 'ft' | 'bod',
    awarded: boolean,
    marksAvailable: number,
    marksGiven: number,
    feedback: string,          // Min 10, max 500 chars
  }>,
  totalAwarded: number,
  totalAvailable: number,
  confidence: number,          // 0.0 to 1.0
  flagForReview: boolean,      // true if confidence < 0.70
}
```

**System prompt principles:**
- Mark only what is explicitly present in the student's work
- Do not infer intent or award marks for absent steps
- Follow GCE Board Buea marking conventions exactly
- Award M marks for correct method even if final answer is wrong
- Award ft marks when error propagates correctly through subsequent steps

**Failure behaviour:**
- If Zod validation fails: throw MarkingValidationError, queue for manual review
- Never return undefined or partial results
- Log: model, input tokens, output tokens, latency, confidence, schema_valid

**Cost classification:** Tier 2 (Haiku). Target: $0.0003 per call.

---

#### 2. Socratic Guidance Chain (`packages/ai/chains/guidance.ts`)

**Purpose:** Generate a guiding question when a student answers incorrectly.
Never reveal the answer or the next correct step.

**Model:** Claude claude-sonnet-4-6 (Level 3 hints), Claude Haiku 4.5 (Level 1-2)
**Temperature:** 0.5
**Max tokens:** 400

**Trigger:** When a student submits an incorrect answer with hints remaining.

**Input:**
```typescript
{
  questionText: string,
  markScheme: MarkScheme,
  studentWrongAnswer: string,
  hintLevel: 1 | 2 | 3,       // Level 3 escalates to Sonnet
  previousHints: string[],    // Avoid repeating hints
}
```

**Output:**
```typescript
{
  hint: string,               // A single guiding question, max 200 chars
  conceptPointed: string,     // Which concept the hint points toward
  hintLevel: number,
}
```

**CRITICAL system prompt constraint (hardcoded, never overridden):**
```
You MUST NOT state the correct answer.
You MUST NOT state the next correct step.
You MUST NOT reveal any intermediate result that the student has not produced.
You may ONLY ask one question that directs the student toward the next
correct reasoning step. The question must require the student to produce
the next step themselves.
```

**Anti-leakage check:** After generation, parse output for:
- Specific numerical results that appear in the mark scheme
- Phrases: "the answer is", "you should get", "the next step is", "differentiate to get"
- If detected: regenerate with explicit leakage flag. Max 2 retries, then escalate to Sonnet.

**Failure behaviour:**
- If anti-leakage check fails twice: return a generic conceptual pointer, log for review
- Never block the student — always return something useful

---

#### 3. Question Generation Chain (`packages/ai/chains/generation.ts`)

**Purpose:** Generate a new GCE-standard examination question with mark scheme.

**Model:** Claude claude-sonnet-4-6
**Temperature:** 0.7
**Max tokens:** 1500
**Trigger:** Question pool monitor detects topic/difficulty bucket below threshold.
  Runs as nightly batch job, NOT in real-time student sessions.

**Input:**
```typescript
{
  topicId: string,
  difficulty: 1 | 2 | 3 | 4 | 5,
  marksTotal: number,
  ragContext: string[],        // 5 similar validated past paper questions
  board: string,               // 'GCE_BUEA' | 'WAEC' | 'OBC'
  level: 'OL' | 'AL',
}
```

**Output (Zod-validated):**
```typescript
{
  templateText: string,        // Question with {param} placeholders
  paramSchema: ParamSchema,    // Allowed values/ranges per parameter
  markSchemeTemplate: object,  // Steps auto-generated from param values
  probeLibrary: UVEProbeSet,   // Pre-generated UVE probes
  estimatedDifficulty: number,
}
```

**RAG requirement:** ALWAYS retrieve 5 similar validated questions before generating.
Do not generate without retrieval context. The context grounds factual claims.

**Cross-examination validation:** After generation, a secondary Haiku call
independently solves the question and checks the solution against the mark scheme.
If inconsistent: flag for human review, do not add to validated pool.

**Output cache:** Every validated question is permanent. Never regenerate a
cached question. Questions are reused across all students.

---

#### 4. UVE Probe Chain (`packages/ai/chains/uve.ts`)

**Purpose:** Generate follow-up verification probes to check genuine understanding.

**Model:** Claude claude-sonnet-4-6 (L3-L4), Claude Haiku 4.5 (L1-L2)
**Temperature:** 0.2 (probe generation), 0.1 (probe evaluation)
**Max tokens:** 700

**Trigger:** After every submitted answer (correct or incorrect).
Runs asynchronously — does not block marking response.

**Probe levels:**
- L1: Variable substitution — same question, different parameters (Haiku)
- L2: Method transparency — explain your working step by step (Haiku)
- L3: Conceptual explanation — explain why the method works (Sonnet)
- L4: Transfer challenge — apply same principle in different context (Sonnet)

**Input:**
```typescript
{
  questionText: string,
  markScheme: MarkScheme,
  submittedAnswer: string,
  probeLevel: 1 | 2 | 3 | 4,
  cognitiveFingerprint: CognitiveFP,  // Student's known strengths/weaknesses
}
```

**Output:**
```typescript
{
  probeQuestion: string,
  evaluationRubric: string,         // How to score the student's response
  understandingIndicators: string[],
  misconceptionSignals: string[],
}
```

**Evaluation sub-chain:** After student responds to probe:
- Model: Claude Haiku 4.5, temperature 0.1
- Returns: `{ understandingLevel: 0-4, misconceptionDetected: boolean, mvsDelta: number }`
- MVS delta updates the student's Mastery Validation Score for this topic

---

#### 5. Curriculum Intelligence Chain (`packages/ai/chains/curriculum.ts`)

**Purpose:** Explain a topic concept to a student, grounded in syllabus content.

**Model:** Claude claude-sonnet-4-6
**Temperature:** 0.6
**Max tokens:** 2000

**Trigger:** Student accesses a topic for the first time, or requests concept explanation.
Output is cached permanently per topic per language. NEVER regenerate a cached explanation.

**Input:**
```typescript
{
  topicId: string,
  syllabusContext: string,    // Retrieved syllabus text for this topic
  studentLevel: string,       // 'OL' | 'AL'
  language: 'en' | 'fr',
}
```

**Output format:** Structured explanation in four parts:
1. Definition (1-2 sentences)
2. Worked example (relevant to Cameroonian context)
3. Common mistakes (top 3)
4. Practice pointer (what to focus on)

**Factual grounding:** Every factual claim must come from retrieved syllabus text.
System prompt: "Only state what is supported by the provided syllabus context.
If you are uncertain about a fact, say so. Do not invent curriculum content."

---

### Model Router (`packages/ai/router.ts`)

Every AI chain calls `getModelConfig(task)` before making any API request.
This is the single point of model switching. When a fine-tuned local model
becomes available (Year 2), only the router changes.

```typescript
type TaskType =
  | 'marking_math' | 'marking_science' | 'marking_essay'
  | 'hint_1' | 'hint_2' | 'hint_3'
  | 'uve_1' | 'uve_2' | 'uve_3' | 'uve_4'
  | 'question_gen' | 'curriculum_explain'
  | 'report_gen' | 'ocr_fallback';

export function getModelConfig(task: TaskType): ModelConfig {
  // Future hook: check localModelRegistry.supports(task) first
  return TASK_MODEL_MAP[task];
}
```

Model assignments (current):
| Task | Model | Temperature | Rationale |
|------|-------|-------------|-----------|
| marking_math, marking_science | Haiku | 0.1 | Rubric application, not reasoning |
| marking_essay | Sonnet | 0.2 | Holistic judgment required |
| hint_1, hint_2 | Haiku | 0.4 | Simple conceptual reformulation |
| hint_3 | Sonnet | 0.5 | Nuanced guidance, prevent leakage |
| uve_1, uve_2 | Haiku | 0.2 | Template-based probe generation |
| uve_3, uve_4 | Sonnet | 0.3 | Complex conceptual assessment |
| question_gen | Sonnet | 0.7 | Creativity within constraints |
| curriculum_explain | Sonnet | 0.6 | Factual accuracy critical |
| report_gen | Haiku | 0.4 | Structured narrative from data |
| ocr_fallback | Sonnet | 0.1 | Visual analysis, deterministic |

---

### RAG Pipeline (`packages/ai/rag.ts`)

Used by the Question Generation Chain and Curriculum Intelligence Chain.

```typescript
async function retrieve(query: string, topicId: string, k = 5): Promise<string[]> {
  // 1. Generate embedding for the query
  const embedding = await voyageAI.embed(query);

  // 2. pgvector cosine similarity search
  const results = await db.select().from(questions)
    .where(and(
      eq(questions.topicId, topicId),
      eq(questions.validated, true)
    ))
    .orderBy(sql`embedding <=> ${embedding}`)
    .limit(k);

  // 3. Instantiate parameters for context representation
  return results.map(q => renderTemplate(q.templateText, sampleParams(q.paramSchema)));
}
```

**Cache:** Embeddings are generated once per question and stored permanently.
Never regenerate an existing embedding unless the question text changes.

---

## RETRIEVAL MECHANISMS

ExamEdge uses three distinct retrieval patterns. Do not conflate them.

### 1. Question Generation RAG (pgvector)

**When:** Nightly batch or pool refresh when topic/difficulty bucket < 50 questions
**Source:** `questions` table where `validated = true`
**Embedding model:** Voyage AI text-embedding-3 (1536 dimensions)
**Query:** Topic + difficulty description embedded at generation time
**Retrieval:** Cosine similarity, k=5, filtered by topicId
**Purpose:** Ground new question templates in validated past paper style
**Failure mode:** If k < 5 validated questions exist → abort generation, alert admin

### 2. Curriculum Syllabus Retrieval (structured lookup)

**When:** Student first accesses topic or requests concept explanation
**Source:** `syllabus_chunks` table keyed by topicId + board + level
**Method:** Direct DB lookup — not vector search (syllabus is finite and structured)
**Cache:** Generated explanation stored permanently in `topic_explanations`
**Purpose:** Factual grounding for curriculum chain
**Failure mode:** If no syllabus chunk → return "Syllabus content unavailable" — do not generate

### 3. Question Pool Selection (IRT + history filter)

**When:** Real-time student session — `POST /api/sessions/:id/next-question`
**Source:** Validated question pool — no LLM involved
**Filters:**
- Exclude templates seen by student in last 30 days
- Match difficulty to student IRT theta (±0.5)
- Minimum 50 templates per topic/difficulty bucket
**Instantiation:** Parameters sampled locally from paramSchema
**Mark scheme:** Generated deterministically from markSchemeTemplate + params
**Cache:** Warm pool in Redis, TTL 1 hour

### Retrieval Caching Rules

| Asset | Cache Location | TTL | Regenerate? |
|-------|---------------|-----|-------------|
| Question embeddings | PostgreSQL pgvector | Permanent | Only if template text changes |
| Topic explanations | PostgreSQL | Permanent | Never — human corrects if wrong |
| Mark schemes (instantiated) | Redis | 1 hour | Per session instance |
| Validated question pool | PostgreSQL | Permanent | Never regenerate same template |
| Idempotency results | Redis | 5 minutes | N/A |

---

## AGENT INTERACTION PATTERNS

### Pattern 1: Answer Submission Flow

```
Student submits answer
  → POST /api/sessions/:id/responses
    → Authenticate (Auth.js JWT)
    → Validate input (Zod)
    → Check idempotency key (Redis SET NX)
    → Retrieve mark scheme (PostgreSQL, Redis cache)
    → Call Marking Chain (Haiku)
    → Validate output (Zod)
    → If confidence < 0.70: flag for review, notify student
    → Database transaction: INSERT response + UPDATE mastery + UPDATE session
    → Async: trigger UVE Probe Chain (non-blocking)
    → Return: { marks_awarded, feedback, confidence, probe_question }
```

### Pattern 2: Hint Request Flow

```
Student requests hint (max 3 per question)
  → GET /api/sessions/:id/hints
    → Authenticate
    → Increment hints_used counter
    → Select hint level (1, 2, or 3)
    → Call Guidance Chain (Haiku for L1-2, Sonnet for L3)
    → Anti-leakage check
    → Return: { hint, conceptPointed, hintsRemaining }
```

### Pattern 3: Question Delivery Flow (Cache-First)

```
Student starts new question
  → POST /api/sessions/:id/next-question
    → Query validated question pool (PostgreSQL)
    → Exclude: questions seen in last 30 days (student history)
    → Select: topic + difficulty matching student IRT theta
    → Instantiate parameters locally (NO AI call)
    → Cache question in Redis (TTL: 1h for warm pool)
    → Return: rendered question text + answer space config
```

### Pattern 4: Weekly Report Generation (Batch)

```
Vercel Cron: Sunday 06:00 WAT
  → Query all active students with sessions in past 7 days
  → For each student:
    → Aggregate session stats from database
    → Call Report Generation Chain (Haiku)
    → Store report in database
    → Send via Resend (plain text + HTML)
```

### Pattern 5: Curriculum Explanation Flow

```
Student opens topic for first time
  → GET /api/topics/:id/explanation
    → Check topic_explanations cache
    → If cached: return immediately (no LLM call)
    → If not cached:
      → Retrieve syllabus chunk from DB
      → Call Curriculum Chain (Sonnet)
      → Validate output structure
      → Store in topic_explanations (permanent)
      → Return explanation
```

### Pattern 6: Question Validation Flow (Human Gate)

```
Nightly generation OR admin manual trigger
  → Generation Chain produces candidate question
  → Cross-examination Chain (Haiku) solves independently
  → If inconsistent: flag rejected, log reason
  → If consistent: insert with validated=false
  → Admin reviews in validation queue
  → Admin approves → validated=true → enters live pool
  → Admin rejects → logged, never served
```

### Pattern 7: Offline Sync Flow

```
Student submits answer offline
  → Answer queued in IndexedDB with client idempotency UUID
  → On reconnect:
    → POST /api/sessions/:id/responses with queued payload
    → Server idempotency check (Redis SET NX)
    → If duplicate: return cached mark
    → If new: full Pattern 1 flow
    → Client clears queue entry on 200 response
```

---

## WORKFLOWS

### Student Practice Workflow (End-to-End)

```
Register → Select subject/topic → Start session
  → next-question (pool selection, param instantiation)
  → Display question (KaTeX) + MathInput
  → [Optional] Request hint (max 3, Pattern 2)
  → Submit answer (Pattern 1)
  → Display M1/A1/B1 feedback + confidence
  → [Async] UVE probe presented
  → Student responds to probe → UVE evaluation → MVS update
  → Mastery map updates → next question OR end session
```

### Exam Simulation Workflow

```
Start simulation → Fullscreen mode
  → Assemble paper (dynamic, no two identical)
  → Timed question loop (submit only, no hints)
  → Tab-switch events logged (Page Visibility API)
  → End simulation → Aggregate marks
  → Generate examiner report (no LLM — template from stored marks)
  → Display readiness score delta
```

### Admin Content Workflow

```
Generation cron detects pool deficit
  → RAG retrieve 5 validated examples
  → Generate candidate → cross-examine
  → Queue for admin review
  → Admin approve/reject/edit
  → Approved → embedding generated → pool replenished
```

### Cost-Optimised Request Routing

Every LLM call passes through `getModelConfig(task)`:

```
Incoming task
  → Router selects model + temperature + max_tokens
  → Check response cache (curriculum, idempotency)
  → If cache hit: return without LLM call
  → If cache miss: invoke chain
  → Validate output (Zod)
  → Log tokens + latency + cost tier
  → Cost circuit breaker check (100 AI ops/hour/user)
```

---

## GUARDRAILS AND SAFETY CONTROLS

### Academic Safety Guardrails

1. **Answer non-revelation (Socratic chain):**
   Hard constraint in system prompt. Anti-leakage post-processing.
   If violated: regenerate. Max 2 retries. Log all violations.

2. **Curriculum accuracy (Generation + Curriculum chains):**
   RAG grounding required. Cannot generate without retrieval context.
   Cross-examination validation for all generated questions.
   Human validation gate before any question enters live pool.

3. **Marking accuracy:**
   Schema-constrained output prevents mark hallucination.
   Confidence scoring surfaces uncertainty.
   Low-confidence responses auto-route to human review queue.
   Student appeal mechanism for all marks.

### Data Safety Guardrails

4. **PII protection:**
   Student answers are sent to Anthropic API with zero-data-retention option.
   No student names or emails in prompt context.
   Student answers referenced by session_id, not name.

5. **Prompt injection prevention:**
   All user-submitted text is sanitised before inclusion in prompts.
   Known injection patterns stripped: "ignore previous instructions",
   "you are now", "override system prompt", "disregard all".
   Mark scheme passed as structured JSON, not embedded in prompt text.

6. **API key security:**
   ANTHROPIC_API_KEY never accessible from client code.
   All AI calls go through Next.js Route Handlers.
   Mobile app calls Next.js API, never Anthropic directly.

### Operational Guardrails

7. **Rate limiting (Upstash Redis sliding window):**
   - Auth endpoints: 5 requests/minute per IP
   - AI operations: 60 requests/hour per authenticated user
   - General API: 300 requests/minute per authenticated user

8. **Idempotency:**
   All answer submissions include a client-generated UUID.
   Server uses SET NX to detect and reject duplicates.
   Duplicate submissions return the cached result from the first call.

9. **Cost circuit breaker:**
   If a single user exceeds 100 AI operations in one hour: rate limit.
   Prevents abuse and budget overrun.
   Logged and reviewed if triggered.

### Responsible AI Controls (see Volume III)

10. **Transparency:**
    Every AI-generated mark displays confidence score.
    Low confidence (<0.70) shows "Under review" badge — never hidden.
    Curriculum explanations cite syllabus source.

11. **Bias mitigation:**
    Benchmark suite includes African English variants.
    Shadow deployment before model upgrades.
    Monthly review of marking disagreements by subject and region.

12. **Data governance (minors):**
    Parental consent flow for users under 16 (Cameroon law alignment).
    Data export and deletion endpoints (GDPR-aligned).
    No student names in LLM prompts — session_id only.
    Anthropic zero-data-retention option enabled.

13. **Audit trail:**
    All AI calls logged: chain_type, model, tokens, latency, confidence, schema_valid.
    All marking disputes logged with appeal outcome.
    Hallucination Registry for confirmed errors (monthly review).

14. **Human-in-the-loop gates:**
    Generated questions require admin validation before live pool.
    Low-confidence marks route to curriculum specialist review queue.
    Student appeal mechanism for all marks — human decision is final.

15. **Integrity by design (not surveillance):**
    Parameterised questions make shared answers useless across students.
    UVE probes make copied answers insufficient for mastery credit.
    Platform does not claim to prevent screenshots — honesty in UI copy.

---

## MEMORY AND CONTEXT MANAGEMENT

### Chain-Level Memory

AI chains are stateless. Each call includes full required context.
No session memory is stored in the LLM provider.
History is stored in PostgreSQL and retrieved for each new call.

For the Socratic chain: `previousHints: string[]` prevents repetition
within a session. Passed explicitly with each hint request.

### Student Knowledge Memory

Student's learning history is stored in `mastery_records` table.
Cognitive Fingerprint (topic strengths, error patterns, learning style)
stored as JSONB in `users.cognitive_fp`.

The Cognitive Fingerprint is updated after each session completion
by a background Vercel Cron job (not in real-time).

### Context Window Management

For long questions with extensive mark schemes:
- Mark scheme JSON is minified before inclusion
- Maximum context per marking call: 4,000 tokens
- If mark scheme exceeds limit: split into steps, mark in sequential calls

---

## HALLUCINATION MITIGATION

### For the Marking Chain
- Schema-constrained output: marks_given cannot exceed marks_available
- Temperature 0.1: near-deterministic, minimal creativity
- Mark scheme is explicit rubric, not a question for the AI to interpret
- Zod validation rejects non-conforming outputs

### For the Generation Chain
- RAG grounding: 5 similar validated questions in context
- Cross-examination: secondary model solves and checks
- Human validation gate: no question enters live pool unreviewed
- Parameter schemas constrain what can be generated

### For the Curriculum Chain
- Syllabus text retrieved and passed as context
- System prompt: "Only state what is in the provided context"
- Cached permanently: human can review and correct cached explanations

### Hallucination Registry
Any confirmed hallucination is logged to the Hallucination Registry table:
- chain_type, model_version, prompt_template_version
- nature_of_error, resolution, date
Reviewed monthly. Drives prompt template and temperature adjustments.

---

## EVALUATION AND MONITORING

### Marking Chain Evaluation
- Benchmark suite: 500 questions with known correct marks across all subjects
- Run on every model version upgrade
- Acceptance threshold: ≥92% agreement with human-marked ground truth
- Zero mark_type errors (M1 never awarded without method, etc.)

### Socratic Chain Evaluation
- 100 hint scenarios evaluated by curriculum specialists
- Acceptance threshold: 0 answer-leakage violations
- Pedagogical quality score ≥7/10 from specialists

### Generation Chain Evaluation
- 50 questions per subject reviewed by domain experts
- Cross-examination pass rate ≥95% required for production
- Board-style conformance checked by curriculum specialists

### Shadow Deployment Protocol
Before any model upgrade:
1. Benchmark evaluation (existing suite)
2. Bias regression test (African English vs Standard British English)
3. 2-week shadow deployment on 10% of real traffic (results not shown to students)
4. Gradual rollout: 25% → 50% → 100% with automatic rollback trigger

---

## PROMPT ENGINEERING PRINCIPLES

### 1. System prompts are immutable constants
System prompts are defined as TypeScript constants in the chain file.
They are never constructed from user input.
They include: role, constraints, output format, and examples.

### 2. User content is separated from instructions
User-provided content (student answers, question text) is always in
the human message, never in the system message.
Structural instructions are never in the human message.

### 3. Output schemas are explicit
Every chain specifies its output format in the system prompt AND
validates the output with Zod before returning.
If the AI returns non-conforming output: retry once, then throw.

### 4. Temperature is intentional
Temperature is set per chain based on the task's creativity/determinism
requirement. It is documented with the rationale. It is never defaulted.

### 5. Token budgets are managed
Max tokens is set per chain to prevent runaway costs.
Prompts are designed to fit within the budget with room for output.
Token usage is logged for every call.

### 6. Few-shot examples are included for marking
The marking chain system prompt includes 3 worked examples showing
correct M1/A1/B1 award decisions for the relevant subject.
Examples are maintained in packages/ai/examples/ and loaded at build time.

---

## ORCHESTRATION STRATEGY

### Synchronous chains (block response)
- Marking Chain: student waits for mark
- Guidance Chain: student waits for hint
- OCR fallback: student waits for transcription

### Asynchronous chains (background, non-blocking)
- UVE Probe Chain: probe generated after marking response sent
- Report Generation Chain: nightly batch via Vercel Cron
- Question Pool Refresh: nightly batch when pool below threshold
- Cognitive Fingerprint update: post-session batch

### No chain calls another chain directly
Chains are independent. Orchestration logic lives in the Route Handler
or the Vercel Cron job, not within a chain. This makes each chain
independently testable, debuggable, and swappable.

---

## TOOL USAGE

### Tools the AI development agent may use
- Create and edit files in the repository
- Run `npm run typecheck` and `npm run lint` to verify output
- Run `npm run test` to verify unit tests pass
- Query the Drizzle schema to understand database structure

### Tools the AI development agent must NOT use
- Make direct API calls to Anthropic (all AI calls go through the chain layer)
- Modify the database schema without documenting the migration
- Install new npm packages without asking first
- Modify files outside the explicitly stated scope of the current feature

---

## REASONING BOUNDARIES

The AI agent must stay within these boundaries:

**In scope:**
- Building features described in the feature backlog
- Fixing bugs in existing features
- Writing tests for existing code
- Refactoring only when explicitly requested

**Out of scope (ask first):**
- Changing the database schema
- Adding new npm dependencies
- Modifying AGENTS.md itself
- Changing authentication logic
- Modifying security-sensitive code (rate limiting, input sanitisation)
- Changing the examination marking rubric logic

**Out of scope (refuse and explain why):**
- Removing input validation
- Disabling rate limiting
- Exposing API keys in client code
- Making AI chains call the LLM API directly from the client
- Bypassing the Zod output validation

---

## CODE REVIEW EXPECTATIONS

Every PR — even solo development — must verify:

- [ ] No architecture invariant violated (see `docs/context/architecture.md`)
- [ ] All API inputs validated with Zod
- [ ] All AI outputs validated with Zod before student display
- [ ] No `any` types introduced
- [ ] No secrets or PII in logs or prompts
- [ ] No client-side AI API calls
- [ ] Rate limiting not removed or weakened
- [ ] Anti-leakage check present on guidance chain changes
- [ ] `npm run typecheck && npm run lint && npm run test` pass
- [ ] UI verified on 360px viewport for student-facing changes
- [ ] progress-tracker.md updated if unit completed

---

## COMMUNICATION STYLE

When explaining code changes:
- State what changed and why (not just what)
- Flag any deviation from this document and justify it
- Note any assumptions made about ambiguous requirements
- State how to test the change end to end

When something is unclear:
- Ask before implementing
- Do not guess and produce a large diff
- One clarifying question is better than a wrong implementation

---

## FILE MAINTENANCE

This file is a living document. Update it when:
- A new library is added to the stack
- A new architectural pattern is established
- A new AI chain is created
- A convention changes (update the convention AND this file)

AGENTS.md version history is tracked in git.
Every update to AGENTS.md is a separate commit: `docs(agents): description`
