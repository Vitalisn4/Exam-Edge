# Architecture — ExamEdge

ExamEdge is a **curriculum-agnostic platform** — country, board, syllabus, and marking conventions are data and configuration layers. Phase 1 runs GCE Board Buea; the schema and API are designed for WAEC, KCSE, OBC, and future boards without architectural rewrites. See `roadmap.md` § Curriculum Extensibility.

## Stack

| Layer            | Technology                               | Purpose                                              |
| ---------------- | ---------------------------------------- | ---------------------------------------------------- |
| Monorepo         | npm workspaces + Turborepo               | apps + shared packages                               |
| Web app          | Next.js 16 App Router (Node 22 LTS)      | Student PWA, admin, API                              |
| Mobile (V1.1)    | React Native + Expo SDK 56               | Native app — deferred to F-32                        |
| Language         | TypeScript 5.x strict                    | All packages                                         |
| Styling          | Tailwind CSS v4 (`@tailwindcss/postcss`) | CSS-first tokens — see `ui-tokens.md`                |
| UI primitives    | shadcn/ui pattern                        | Button, Input, Card, Modal, Badge                    |
| Math display     | KaTeX                                    | LaTeX rendering in questions/feedback                |
| Math input       | MathQuill                                | WYSIWYG equation editor                              |
| Auth             | Auth.js v5                               | JWT HTTP-only cookies, bcrypt factor 12              |
| Database         | Neon PostgreSQL + pgvector               | Primary data + vector embeddings                     |
| ORM              | Drizzle ORM                              | Type-safe queries, SQL migrations                    |
| Cache            | Upstash Redis                            | Rate limits, idempotency, warm question pool         |
| Object storage   | Cloudflare R2                            | Photos, audio, exports, pg_dump backups              |
| Offline          | Service Worker + IndexedDB               | App shell cache, answer queue                        |
| AI orchestration | LangChain.js (@langchain/anthropic)      | Five independent chains                              |
| Primary LLM      | Claude Sonnet 4.6                        | Hints L3, generation, curriculum, UVE L3-L4          |
| Fast LLM         | Claude Haiku 4.5                         | Marking, hints L1-L2, UVE L1-L2, reports, cross-exam |
| Embeddings       | Voyage AI text-embedding-3               | 1536 dimensions → pgvector                           |
| Email            | Resend                                   | Password reset, weekly reports                       |
| Analytics        | Plausible                                | Privacy-first event tracking                         |
| Errors           | Sentry                                   | Exception tracking                                   |
| Hosting          | Vercel                                   | Web, API, cron, edge middleware                      |
| CI/CD            | GitHub Actions                           | Lint, typecheck, test on PR                          |

---

## Folder Structure

```
examedge/
├── AGENTS.md
├── .cursorrules
├── docs/
│   ├── context/                    ← AI agent reads every session
│   │   ├── project-overview.md
│   │   ├── roadmap.md
│   │   ├── architecture.md
│   │   ├── security.md
│   │   ├── documentation-map.md
│   │   ├── ui-tokens.md
│   │   ├── ui-rules.md
│   │   ├── ui-registry.md
│   │   ├── code-standards.md
│   │   ├── library-docs.md
│   │   ├── ai-workflow-rules.md
│   │   ├── build-plan.md
│   │   ├── progress-tracker.md
│   │   └── specs/
│   └── ExamEdge_Engineering_Document.md
├── apps/
│   └── web/
│       ├── app/
│       │   ├── layout.tsx                    → Root layout, fonts, providers
│       │   ├── page.tsx                      → Landing page
│       │   ├── globals.css                   → Tailwind + @theme tokens
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   ├── register/page.tsx
│       │   │   └── forgot-password/page.tsx
│       │   ├── (student)/
│       │   │   ├── dashboard/page.tsx        → Mastery map, streak, readiness
│       │   │   ├── practice/[subjectId]/page.tsx
│       │   │   ├── study/[topicId]/page.tsx  → Active study session
│       │   │   ├── exam/[simulationId]/page.tsx
│       │   │   ├── progress/page.tsx
│       │   │   └── profile/page.tsx
│       │   ├── (admin)/
│       │   │   └── questions/page.tsx        → Validation queue
│       │   ├── dev/
│       │   │   ├── ui/page.tsx               → Design system demo
│       │   │   └── math/page.tsx             → Math component test
│       │   └── api/
│       │       ├── health/route.ts
│       │       ├── auth/[...nextauth]/route.ts
│       │       ├── sessions/
│       │       │   ├── route.ts
│       │       │   └── [id]/
│       │       │       ├── route.ts
│       │       │       ├── responses/route.ts
│       │       │       └── hints/route.ts
│       │       ├── questions/
│       │       │   ├── generate/route.ts
│       │       │   └── [id]/route.ts
│       │       ├── topics/[id]/explain/route.ts
│       │       ├── simulations/
│       │       │   ├── route.ts
│       │       │   └── [id]/
│       │       │       ├── route.ts
│       │       │       ├── submit/route.ts
│       │       │       └── report/route.ts
│       │       ├── students/[id]/
│       │       │   ├── mastery/route.ts
│       │       │   └── progress/route.ts
│       │       ├── appeals/route.ts
│       │       ├── admin/questions/
│       │       │   ├── review/route.ts
│       │       │   └── [id]/validate/route.ts
│       │       └── cron/
│       │           ├── weekly-reports/route.ts
│       │           ├── pool-refresh/route.ts
│       │           ├── spaced-repetition/route.ts
│       │           └── backup/route.ts
│       ├── components/
│       │   ├── ui/                           → shadcn primitives only
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   └── OfflineBanner.tsx
│       │   ├── math/
│       │   │   ├── MathDisplay.tsx           → KaTeX wrapper
│       │   │   └── MathInput.tsx             → MathQuill wrapper
│       │   ├── assessment/
│       │   │   ├── QuestionCard.tsx
│       │   │   ├── MarkingDisplay.tsx
│       │   │   ├── HintPanel.tsx
│       │   │   ├── UVEProbeModal.tsx
│       │   │   └── PhotoUpload.tsx
│       │   ├── progress/
│       │   │   ├── MasteryMap.tsx
│       │   │   ├── TopicBadge.tsx
│       │   │   ├── StreakDisplay.tsx
│       │   │   └── ReadinessScore.tsx
│       │   ├── exam/
│       │   │   ├── ExamTimer.tsx
│       │   │   ├── ExamReport.tsx
│       │   │   └── FocusBreakLog.tsx
│       │   └── admin/
│       │       └── ValidationQueue.tsx
│       ├── lib/
│       │   ├── auth.ts                       → Auth.js config
│       │   ├── redis.ts                      → Upstash client
│       │   ├── rate-limit.ts                 → Sliding window limiter
│       │   ├── storage.ts                    → R2 upload/download
│       │   ├── offline-queue.ts              → IndexedDB helpers
│       │   └── utils.ts                      → Shared constants (CONFIDENCE_THRESHOLD, etc.)
│       └── middleware.ts                     → Auth + rate limit at Edge
├── packages/
│   ├── db/
│   │   ├── schema.ts                         → Drizzle table definitions
│   │   ├── migrations/                       → SQL migration files
│   │   ├── repositories/
│   │   │   ├── users.ts
│   │   │   ├── questions.ts
│   │   │   ├── sessions.ts
│   │   │   ├── responses.ts
│   │   │   ├── mastery.ts
│   │   │   └── curriculum.ts
│   │   └── seed/
│   │       └── gce-buea-topics.ts            → MVP topic tree seed
│   ├── ai/
│   │   ├── router.ts                         → getModelConfig(task)
│   │   ├── rag.ts                            → pgvector retrieval
│   │   ├── sanitize.ts                       → Prompt injection stripping
│   │   ├── chains/
│   │   │   ├── marking.ts
│   │   │   ├── guidance.ts
│   │   │   ├── generation.ts
│   │   │   ├── uve.ts
│   │   │   └── curriculum.ts
│   │   ├── schemas/
│   │   │   ├── marking.schema.ts
│   │   │   ├── guidance.schema.ts
│   │   │   ├── generation.schema.ts
│   │   │   └── uve.schema.ts
│   │   └── examples/
│   │       └── marking/                      → Few-shot marking examples
│   └── shared/
│       ├── types/
│       │   ├── curriculum.ts
│       │   ├── assessment.ts
│       │   └── mastery.ts
│       ├── validations/
│       │   ├── auth.schema.ts
│       │   ├── session.schema.ts
│       │   └── response.schema.ts
│       └── constants/
│           ├── boards.ts
│           └── thresholds.ts                 → CONFIDENCE_THRESHOLD, MAX_HINTS, etc.
```

---

## System Boundaries

| Location                    | Owns                                            | Must NOT                                 |
| --------------------------- | ----------------------------------------------- | ---------------------------------------- |
| `apps/web/app/`             | Routes, page composition, layouts               | Business logic, raw SQL, direct AI calls |
| `apps/web/components/`      | UI rendering, client interactivity              | Database access, AI chain invocation     |
| `apps/web/app/api/`         | HTTP handling: auth → validate → delegate       | Raw SQL, inline chain logic              |
| `apps/web/lib/`             | Third-party client init, rate limiting, storage | Business rules, chain prompts            |
| `packages/db/repositories/` | All database reads/writes                       | AI calls, HTTP responses                 |
| `packages/ai/chains/`       | Single chain execution + Zod validation         | Call other chains, HTTP, DB directly     |
| `packages/ai/router.ts`     | Model selection per task                        | Chain execution                          |
| `packages/shared/`          | Types, Zod schemas, pure helpers                | Side effects, I/O                        |

---

## Data Flow

### Answer Submission (Pattern 1)

```
Student submits in MathInput / PhotoUpload component
        ↓
POST /api/sessions/:id/responses
        ↓
Middleware: JWT + rate limit check
        ↓
Route: auth → validate (Zod) → idempotency (Redis SET NX)
        ↓
responsesRepository.getMarkScheme(questionId, appliedParams)
        ↓
runMarkingChain() in packages/ai/chains/marking.ts
        ↓
Zod validate MarkingResult
        ↓
If confidence < 0.70 → flag manual_review
        ↓
DB transaction: INSERT student_responses, UPDATE mastery_records, UPDATE student_sessions
        ↓
Async: queue UVE probe (Vercel background / after response sent)
        ↓
Return { marks, feedback, confidence, hintsRemaining }
        ↓
Client: MarkingDisplay updates, UVEProbeModal if probe ready
```

### Hint Request (Pattern 2)

```
Student clicks Hint (marks < 50% or wrong answer)
        ↓
GET /api/sessions/:id/hints?questionId=...
        ↓
Check hints_used < MAX_HINTS (3)
        ↓
runGuidanceChain() — Haiku L1-L2, Sonnet L3
        ↓
Anti-leakage post-processing
        ↓
Return { hint, conceptPointed, hintsRemaining }
        ↓
HintPanel displays guiding question
```

### Question Delivery (Pattern 3 — No AI)

```
Student requests next question
        ↓
POST /api/sessions/:id/next-question
        ↓
questionsRepository.selectFromPool(topicId, studentId, irtTheta)
  → Exclude templates seen in 30 days
  → Filter validated=true
  → Match difficulty to IRT theta
        ↓
instantiateParams(paramSchema) — local, deterministic
        ↓
generateMarkScheme(markSchemeTemplate, params) — local, no LLM
        ↓
Cache in Redis (TTL 1h)
        ↓
Return { renderedText, questionId, appliedParams, marksTotal }
```

### Question Generation (Async Batch)

```
Vercel Cron: pool-refresh OR admin trigger
        ↓
Check pool count < 50 per topic/difficulty
        ↓
rag.retrieve(topicId, k=5) — pgvector similarity
        ↓
runGenerationChain() — Sonnet
        ↓
runCrossExamination() — Haiku solves + validates
        ↓
INSERT questions SET validated=false
        ↓
Admin approves at /admin/questions
        ↓
validated=true → generate embedding → enters live pool
```

### Offline Sync (Pattern 7)

```
Student offline → answer queued in IndexedDB
        ↓
navigator.onLine = true
        ↓
offlineQueue.sync() → POST each with idempotencyKey
        ↓
Server idempotency check → full Pattern 1 or cached result
        ↓
Client removes queue entry on 200
```

---

## Database Schema

### `users`

| Column           | Type                | Notes                                   |
| ---------------- | ------------------- | --------------------------------------- |
| id               | UUID PK             | gen_random_uuid()                       |
| email            | VARCHAR(255) UNIQUE | Required                                |
| name             | VARCHAR(255)        | Required                                |
| role             | TEXT                | student \| teacher \| admin             |
| password_hash    | TEXT                | NULL for OAuth (V1.1)                   |
| email_verified   | TIMESTAMPTZ         |                                         |
| cognitive_fp     | JSONB               | Cognitive Fingerprint — updated by cron |
| preferences      | JSONB               | Subject selections, level               |
| date_of_birth    | DATE                | Optional — for under-16 consent         |
| consent_given_at | TIMESTAMPTZ         | Parental consent timestamp              |
| consent_type     | TEXT                | parental \| self (16+)                  |
| deleted_at       | TIMESTAMPTZ         | Soft delete (Unit 23)                   |
| created_at       | TIMESTAMPTZ         |                                         |
| updated_at       | TIMESTAMPTZ         |                                         |

### `curricula`

| Column       | Type               | Notes                         |
| ------------ | ------------------ | ----------------------------- |
| id           | UUID PK            |                               |
| code         | VARCHAR(20) UNIQUE | GCE_AL, GCE_OL, WAEC, OBC_BAC |
| name         | TEXT               |                               |
| country      | VARCHAR(100)       | Cameroon                      |
| language     | TEXT               | en \| fr \| sw                |
| board_config | JSONB              | Grading scales, paper formats |

### `subjects`

| Column        | Type        | Notes                           |
| ------------- | ----------- | ------------------------------- |
| id            | UUID PK     |                                 |
| curriculum_id | UUID FK     |                                 |
| code          | VARCHAR(20) | 0765, 0710, 0730                |
| name          | TEXT        | Pure Mathematics With Mechanics |
| level         | TEXT        | OL \| AL                        |
| syllabus_ref  | TEXT        |                                 |

### `topics`

| Column           | Type     | Notes                |
| ---------------- | -------- | -------------------- |
| id               | UUID PK  |                      |
| subject_id       | UUID FK  |                      |
| name             | TEXT     | e.g. Differentiation |
| slug             | TEXT     | differentiation      |
| syllabus_ref     | TEXT     |                      |
| prerequisite_ids | UUID[]   |                      |
| exam_weight      | NUMERIC  | % of typical paper   |
| difficulty_band  | SMALLINT | 1-3                  |
| concept_graph    | JSONB    | Prerequisite tree    |

### `questions`

| Column           | Type         | Notes                                                             |
| ---------------- | ------------ | ----------------------------------------------------------------- |
| id               | UUID PK      |                                                                   |
| topic_id         | UUID FK      |                                                                   |
| template_text    | TEXT         | Parameterised LaTeX template                                      |
| param_schema     | JSONB        | Allowed parameter ranges                                          |
| mark_scheme      | JSONB        | Marking profile + step template (M/A or point rubric per subject) |
| probe_library    | JSONB        | UVE probe templates                                               |
| difficulty       | SMALLINT     | 1-5                                                               |
| marks_total      | SMALLINT     |                                                                   |
| question_type    | TEXT         | structured \| proof \| graph \| diagram \| mcq                    |
| embedding        | vector(1536) | Voyage AI embedding                                               |
| source           | TEXT         | ai_generated \| human_authored \| past_paper_inspired             |
| validated        | BOOLEAN      | DEFAULT false — must be true to serve                             |
| validated_by     | UUID FK      | Admin who approved                                                |
| validation_notes | TEXT         |                                                                   |
| created_at       | TIMESTAMPTZ  |                                                                   |

### `student_sessions`

| Column              | Type        | Notes                                      |
| ------------------- | ----------- | ------------------------------------------ |
| id                  | UUID PK     |                                            |
| student_id          | UUID FK     |                                            |
| subject_id          | UUID FK     |                                            |
| mode                | TEXT        | learn \| practice \| exam \| review        |
| status              | TEXT        | active \| paused \| completed \| abandoned |
| questions_attempted | SMALLINT    |                                            |
| marks_total         | SMALLINT    |                                            |
| marks_awarded       | SMALLINT    |                                            |
| focus_breaks        | SMALLINT    | Tab-switch count in exam mode              |
| started_at          | TIMESTAMPTZ |                                            |
| ended_at            | TIMESTAMPTZ |                                            |
| metadata            | JSONB       |                                            |

### `student_responses`

| Column           | Type         | Notes                           |
| ---------------- | ------------ | ------------------------------- |
| id               | UUID PK      |                                 |
| session_id       | UUID FK      |                                 |
| question_id      | UUID FK      |                                 |
| rendered_text    | TEXT         | Actual question shown           |
| applied_params   | JSONB        | Parameter values used           |
| answer_text      | TEXT         |                                 |
| answer_type      | TEXT         | text \| image \| audio \| graph |
| answer_media_url | TEXT         | R2 URL for photo/audio          |
| marks_awarded    | JSONB        | Step-by-step marking result     |
| ai_confidence    | NUMERIC(4,3) | 0.000-1.000                     |
| manual_review    | BOOLEAN      | true if confidence < 0.70       |
| hints_used       | SMALLINT     | 0-3                             |
| uve_probes       | JSONB        | Probe Q&A and evaluation        |
| mvs_score        | NUMERIC(4,3) | Mastery Validation Score        |
| time_taken_s     | INTEGER      |                                 |
| idempotency_key  | UUID UNIQUE  | Client-generated                |
| submitted_at     | TIMESTAMPTZ  |                                 |

### `mastery_records`

| Column         | Type                   | Notes                  |
| -------------- | ---------------------- | ---------------------- |
| id             | UUID PK                |                        |
| student_id     | UUID FK                |                        |
| topic_id       | UUID FK                |                        |
| mastery_level  | NUMERIC(4,3)           | IRT theta 0-1          |
| mvs_history    | JSONB                  | Rolling 10-session MVS |
| sessions_count | INTEGER                |                        |
| accuracy_rate  | NUMERIC(4,3)           |                        |
| next_review    | TIMESTAMPTZ            | SM-2 spaced repetition |
| ease_factor    | NUMERIC(4,2)           | Default 2.50           |
| interval_days  | SMALLINT               | Default 1              |
| version        | INTEGER                | Optimistic lock        |
| last_updated   | TIMESTAMPTZ            |                        |
| UNIQUE         | (student_id, topic_id) |                        |

### Supporting Tables (MVP schema present, some features V1.1+)

- `marking_appeals` — student mark disputes
- `audit_log` — admin actions, marking overrides
- `topic_explanations` — cached curriculum chain output
- `syllabus_chunks` — syllabus text for RAG/curriculum
- `hallucination_registry` — confirmed AI errors for monthly review

### Content Model Extensions (V1.1+)

Full hierarchy, knowledge graph, learner modes, and scale strategy: **`content-architecture.md`**.

| Table                  | Version | Purpose                                             |
| ---------------------- | ------- | --------------------------------------------------- |
| `subtopics`            | V1.1    | Concepts within a topic; fine-grained prerequisites |
| `learning_objectives`  | V1.1    | Measurable outcomes linked to subtopics             |
| `lessons`              | V1.1    | Subtopic-level cached explanations                  |
| `shared_concepts`      | V2.0    | Cross-board canonical taxonomy                      |
| `board_topic_mappings` | V2.0    | Map local topics to shared concepts                 |

MVP encodes subtopic structure in `topics.concept_graph` JSONB until tables are promoted.

---

## Cloudflare R2 Storage

| Path                                  | Contents                  | Access                    |
| ------------------------------------- | ------------------------- | ------------------------- |
| `photos/{user_id}/{response_id}.jpg`  | Handwritten answer photos | Authenticated, owner only |
| `backups/pg_dump_{date}.sql.gz`       | Weekly DB backups         | Admin/cron only           |
| `exports/{user_id}/report_{date}.pdf` | Weekly report PDFs (V1.1) | Owner only                |

---

## Authentication

- Provider: Auth.js v5
- Methods: Email/password (MVP), Google OAuth (V1.1)
- Session: JWT in HTTP-only cookie, SameSite=Lax
- bcrypt factor 12 for passwords
- Protected routes: all `(student)/*`, `(admin)/*`, `(teacher)/*` (V1.1)
- Public routes: `/`, `/login`, `/register`, `/forgot-password`
- Middleware in `middleware.ts`: JWT validation + rate limiting
- Role checks in route handlers: student, teacher, admin
- Mobile (V1.1): JWT in expo-secure-store, same API

---

## Auth.js Pattern

```typescript
// apps/web/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { usersRepository } from "@examedge/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const user = await usersRepository.findByEmail(credentials.email);
        if (!user?.password_hash) return null;
        const valid = await compare(credentials.password, user.password_hash);
        if (!valid) return null;
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: ({ session, token }) => {
      session.user.role = token.role;
      return session;
    },
  },
});
```

---

## Rate Limiting Pattern

```typescript
// apps/web/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  prefix: "rl:auth",
});

export const aiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 h"),
  prefix: "rl:ai",
});
```

---

## Idempotency Pattern

```typescript
// Before marking chain call
const cacheKey = `idem:${userId}:${idempotencyKey}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// After successful marking
await redis.set(cacheKey, JSON.stringify(result), { ex: 300, nx: true });
```

---

## Marking Chain Invocation Pattern

```typescript
// packages/ai/chains/marking.ts — called from route handler ONLY
import { getModelConfig } from "../router";
import { markingResultSchema } from "../schemas/marking.schema";
import { sanitizeUserText } from "../sanitize";

export async function runMarkingChain(input: MarkingInput): Promise<MarkingResult> {
  const config = getModelConfig("marking_math");
  const sanitizedAnswer = sanitizeUserText(input.studentAnswer);

  // System prompt is immutable constant — never from user input
  // User content in human message only
  const raw = await invokeLLM(config, SYSTEM_PROMPT, buildHumanMessage(input, sanitizedAnswer));

  const parsed = markingResultSchema.safeParse(raw);
  if (!parsed.success) throw new MarkingValidationError(parsed.error);

  logAICall({ chain: "marking", ...config, confidence: parsed.data.confidence });
  return parsed.data;
}
```

---

## Parameter Instantiation Pattern

```typescript
// packages/shared — NO AI call
export function instantiateParams(schema: ParamSchema): Record<string, number | string> {
  const params: Record<string, number | string> = {};
  for (const [key, def] of Object.entries(schema)) {
    if (def.type === "range") {
      params[key] = randomInt(def.min, def.max);
    } else if (def.type === "set") {
      params[key] = def.values[randomInt(0, def.values.length - 1)];
    }
  }
  return params; // Constraints validated before return
}

export function renderTemplate(template: string, params: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}
```

---

## API Routes (MVP)

| Method | Route                             | Auth          | Purpose                         |
| ------ | --------------------------------- | ------------- | ------------------------------- |
| GET    | /api/health                       | Public        | Health check                    |
| POST   | /api/sessions                     | student       | Start session                   |
| GET    | /api/sessions/:id                 | owner         | Session state                   |
| PATCH  | /api/sessions/:id                 | owner         | Pause/resume/abandon            |
| POST   | /api/sessions/:id/next-question   | owner         | Serve next question             |
| POST   | /api/sessions/:id/responses       | owner         | Submit answer → marking         |
| GET    | /api/sessions/:id/hints           | owner         | Request Socratic hint           |
| GET    | /api/topics/:id/explain           | student       | Curriculum explanation (cached) |
| POST   | /api/simulations                  | student       | Start exam simulation           |
| POST   | /api/simulations/:id/submit       | owner         | Submit exam paper               |
| GET    | /api/simulations/:id/report       | owner         | Post-exam report                |
| GET    | /api/students/me                  | student       | Profile data                    |
| PATCH  | /api/students/me                  | student       | Update preferences              |
| POST   | /api/students/me/data-export      | student       | Queue data export               |
| POST   | /api/students/me/delete           | student       | Soft-delete account             |
| GET    | /api/students/:id/mastery         | owner+teacher | Mastery map data                |
| GET    | /api/students/:id/progress        | owner+teacher | Progress history                |
| POST   | /api/appeals                      | student       | Marking appeal                  |
| GET    | /api/appeals                      | student       | List own appeals                |
| GET    | /api/admin/questions/review       | admin         | Validation queue                |
| PATCH  | /api/admin/questions/:id/validate | admin         | Approve/reject question         |
| POST   | /api/cron/*                       | CRON_SECRET   | Background jobs                 |

---

## Error Response Standard

```typescript
// All API errors return this shape
{
  error: {
    code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND"
         | "IDEMPOTENCY_DUPLICATE" | "AI_VALIDATION_FAILED" | "RATE_LIMITED"
         | "INTERNAL_ERROR",
    message: string,      // Human-readable, safe for client
    status: number,
    requestId: string,    // Correlate with server logs
  }
}
```

---

## Environment Variables

| Variable                     | Used In         | Notes                           |
| ---------------------------- | --------------- | ------------------------------- |
| DATABASE_URL                 | packages/db     | Neon PostgreSQL connection      |
| UPSTASH_REDIS_REST_URL       | lib/redis       | Rate limiting + cache           |
| UPSTASH_REDIS_REST_TOKEN     | lib/redis       |                                 |
| ANTHROPIC_API_KEY            | packages/ai     | Server only — never NEXT_PUBLIC |
| VOYAGE_API_KEY               | packages/ai/rag | Embeddings                      |
| AUTH_SECRET                  | lib/auth        | Auth.js JWT signing             |
| CRON_SECRET                  | api/cron/*      | Protect cron endpoints          |
| R2_ACCOUNT_ID                | lib/storage     | Cloudflare R2                   |
| R2_ACCESS_KEY_ID             | lib/storage     |                                 |
| R2_SECRET_ACCESS_KEY         | lib/storage     |                                 |
| R2_BUCKET_NAME               | lib/storage     |                                 |
| RESEND_API_KEY               | email           | Password reset + reports        |
| NEXT_PUBLIC_PLAUSIBLE_DOMAIN | analytics       | Browser-safe                    |
| SENTRY_DSN                   | monitoring      | Server + client                 |

Never prefix secrets with `NEXT_PUBLIC_`.

---

## Invariants

Rules the AI coding agent must never violate:

1. API routes contain no UI logic. Components contain no DB logic.
2. AI chain code in `packages/ai/` never imports from `apps/web/components/`.
3. All DB writes go through repository functions — never raw SQL in routes.
4. All LLM calls go through `getModelConfig()` — never hardcode model names in routes.
5. No hardcoded hex colors in components — use tokens from ui-tokens.md.
6. Every AI chain output passes Zod validation before reaching a student.
7. Socratic chain anti-leakage check is never removed or bypassed.
8. Questions with `validated=false` are never served via next-question API.
9. Marking uses Haiku only — Sonnet never used for marking (router enforced).
10. Idempotency check runs before every marking chain call.
11. ANTHROPIC_API_KEY never appears in client bundle or NEXT_PUBLIC vars.
12. Student names/emails never included in LLM prompts — session_id only.
13. Parameter instantiation is local — no LLM call at question delivery time.
14. Browserbase/Stagehand patterns do not apply — ExamEdge has no browser automation.
15. Every cron endpoint validates CRON_SECRET before executing.
