# Platform How It Works — ExamEdge

**Purpose:** Explain how ExamEdge delivers genuine learning (not answer vending), how major components integrate, how AI behaves in production, how submissions are evaluated across subjects, and how the system stays grounded, secure, and cost-efficient.

**Companion docs:** `AGENTS.md` (chain specs) · `zero-budget-stack.md` (free tiers) · `security.md` · `roadmap.md`

---

## 1. What ExamEdge Is (and Is Not)

ExamEdge is **an AI-powered examination preparation and personalized learning platform for secondary school students across Africa**, beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to support multiple curricula and national examination systems across the continent. It helps students learn, practice, and prepare for national examinations through a structured loop:

```
Learn concept → Practice with examiner-accurate questions → Receive partial-credit marks
→ Get Socratic hints (never answers) → Verify understanding (UVE) → Track mastery → Advance
```

**ExamEdge is not:**

- A ChatGPT wrapper that gives instant answers
- A question bank with static PDF downloads
- A surveillance system claiming to prevent cheating

**ExamEdge is:**

- A pedagogically constrained AI system with five independent chains, each with immutable rules
- A curriculum-grounded platform where AI-generated content passes human validation before students see it
- An understanding verification engine (UVE) that detects copied answers insufficient for mastery credit

---

## 2. The Learning Loop — Progressive Mastery

Students move through topics via a **closed loop** designed for genuine comprehension:

### Step 1 — Concept Introduction (Curriculum Chain)

When a student opens a topic for the first time or taps **"Learn this topic"**:

1. System checks `topic_explanations` cache
2. If miss: retrieves **syllabus chunk** from PostgreSQL (not the open internet)
3. Curriculum chain (Sonnet) produces four parts: definition, worked example (local context), common mistakes, practice pointer
4. Output validated by Zod; cached **permanently** — no regeneration
5. Student reads explanation before practice

**Progressive design:** Explanation is available but never forced. Practice is where mastery is measured.

### Step 2 — Guided Practice (Study Session)

1. Student selects topic from mastery map (red = not started, amber = developing, green = secure)
2. Focus preparation prompt (Unit 26) — reduces distraction, not surveillance
3. System selects **parameterised question** from validated pool — **no LLM at request time**
4. Student works through question using MathInput, text, or photo upload
5. Student submits → **Marking chain** returns profile-appropriate breakdown (M/A for CGCE maths; point credits for sciences)

### Step 3 — Productive Struggle (Socratic Guidance)

If marks < 50% of available:

1. **Hint button** activates (max 3 per question)
2. Level 1–2 (Haiku): broad conceptual redirect
3. Level 3 (Sonnet): most specific guiding question — **anti-leakage checked**
4. System **never** states the answer, next step, or mark scheme values

### Step 4 — Understanding Verification (UVE)

After every submission (correct or incorrect), **async**:

| Level | Name                  | What it tests                  | Model  |
| ----- | --------------------- | ------------------------------ | ------ |
| L1    | Variable substitution | Same method, different numbers | Haiku  |
| L2    | Method transparency   | Explain steps in own words     | Haiku  |
| L3    | Conceptual (V1.1+)    | Why the method works           | Sonnet |
| L4    | Transfer (V1.1+)      | Apply principle in new context | Sonnet |

**MVP:** L1 + L2 only. A student who copied an answer from ChatGPT will often fail L1 (different parameters) or L2 (cannot explain method).

### Step 5 — Mastery Update

1. Marking result + UVE evaluation update `mastery_records` (theta, MVS)
2. Dashboard mastery map refreshes
3. Spaced repetition scheduler surfaces due topics
4. When theta crosses 0.70 → `topic_mastered` event

### Step 6 — Examination Simulation

When ready, student enters timed exam mode:

- Full paper from validated pool (unique per student)
- No hints; tab-switch logged as focus event
- Full marking run; post-exam report
- Readiness score updates

**Lesson-to-lesson progression:** Dashboard recommends next topic based on lowest mastery + spaced repetition due dates — not random order.

---

## 3. Detecting Copying vs Genuine Understanding

ExamEdge uses **multiple independent signals** — no single check is foolproof; combined they are strong:

| Signal                      | Mechanism                                                               | Catches                                         |
| --------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| **Parameterised questions** | Each student gets different numerical values from same template         | Pasted ChatGPT answers with wrong numbers       |
| **Board-faithful marking**  | M/A for maths; point rubric for sciences — per `marking-conventions.md` | Students who guess final answer without working |
| **Socratic hints**          | Never gives answer; requires next reasoning step                        | Dependency on external AI for steps             |
| **UVE L1**                  | Same question, different parameters immediately after                   | Copy-paste without understanding                |
| **UVE L2**                  | "Explain your method step by step"                                      | Cannot articulate copied working                |
| **Time + focus analytics**  | Unusually fast correct answers + high tab-switch                        | Suspicious patterns (flag, not punish)          |
| **Low marking confidence**  | confidence < 0.70 → human review queue                                  | OCR errors, ambiguous handwriting               |

**Honest limitation (documented in UI):** ExamEdge does not claim to prevent screenshots or phone cameras. It makes copying **insufficient for mastery credit** and **detectable through verification probes**.

---

## 4. How Major Components Work Together

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STUDENT (Web PWA)                                │
│  Dashboard → Practice → Study Session → Exam Sim → Progress → Profile │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS (Auth.js JWT cookie)
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Next.js Route Handlers (Vercel)                       │
│  Auth → Zod validate → Rate limit → Idempotency → Repository / Chain    │
└───────┬─────────────────┬─────────────────┬─────────────────┬─────────┘
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
   Neon Postgres    Upstash Redis     packages/ai       Cloudflare R2
   (users, sessions, (rate limits,     (5 chains via     (photos,
    questions,         idempotency,      router)           backups)
    mastery,           warm cache)
    embeddings)
```

### Personalised Learning

- **IRT theta** per topic in `mastery_records` — question difficulty matched to student level
- **Cognitive fingerprint** (JSONB, updated by cron) — error patterns inform hint emphasis
- **Spaced repetition** (SM-2 nightly cron) — surfaces due topics on dashboard
- **Readiness score** — aggregate of topic thetas weighted by exam weighting

### Practice Exercises

- Validated question pool only (`validated=true`)
- Local parameter instantiation — deterministic, no AI
- 30-day exclusion — no repeat templates for same student
- Redis warm cache — 1h TTL for frequently accessed topics

### Examination Simulation

- Dynamic paper assembly from pool — unique per student per session
- Fullscreen + timer + focus break logging
- Batch marking per question — same marking chain as practice
- Report generation — template-based aggregation (Haiku for narrative in weekly reports only)

### Answer Submission Pipeline (Pattern 1)

```
Submit answer
  → Auth + ownership check
  → Zod validate body
  → Idempotency SET NX (Redis)
  → Load mark scheme (Redis cache 1h, else Postgres)
  → sanitizeUserText(studentAnswer)
  → runMarkingChain (Haiku, temp 0.1)
  → Zod validate MarkingResult
  → If confidence < 0.70: flagForReview
  → DB transaction: INSERT response, UPDATE mastery, UPDATE session
  → Return marks to student (< 3s target)
  → Async: trigger UVE probe generation (non-blocking)
```

### Progress Tracking

- `student_sessions` + `student_responses` — full history
- Progress page (Unit 21) — aggregates sessions, hours, streak
- Focus analytics (Unit 26) — active time vs interruptions
- Appeals (Unit 22) — human review path for disputed marks

### Curriculum Mapping

**Full content model, knowledge graph, learner pathways, and scale:** `content-architecture.md`.

```
curricula (board + country)
  └── subjects (0765 Pure Maths, …)
        └── topics (Differentiation, …)
              ├── concept_graph (prerequisite DAG — subtopics as nodes in MVP)
              ├── syllabus_chunks (source text for RAG + curriculum chain)
              ├── topic_explanations (cached AI explanations)
              └── questions (templates + embeddings for RAG generation)
```

Adding Nigeria/WAEC = new `curricula` row + seed data — not a platform rewrite.

---

## 5. Subject-Specific Submission Handling

### Mathematics & Physics (Calculation-Heavy)

| Input method              | Processing                                                                        | Marking                                                              |
| ------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **MathInput (MathQuill)** | LaTeX string exported                                                             | Marking chain evaluates LaTeX working + final answer                 |
| **Plain text**            | Sanitized string                                                                  | Marking chain parses steps from text                                 |
| **Photo (handwritten)**   | R2 upload → Claude vision OCR (Sonnet, temp 0.1) → student confirms transcription | Marking chain marks confirmed text; low OCR confidence → review flag |

**Diagrams/graphs (MVP):** Text description of graph features accepted; full graph plotting deferred V1.1. Mark scheme templates include "accept equivalent descriptions" rubric steps.

**KaTeX rendering:** All question and feedback display uses KaTeX with `trust: false` — no arbitrary HTML injection.

### Biology (Mixed: Facts, Diagrams, Short Answers)

| Question type                   | Submission           | Marking                                      |
| ------------------------------- | -------------------- | -------------------------------------------- |
| Short answer (1–3 marks)        | Text                 | Keyword + concept rubric in mark scheme JSON |
| Labelled diagram                | Text labels or photo | OCR + rubric matching label terms            |
| Extended response (MVP limited) | Text                 | Haiku marking with structured rubric steps   |

**Mark scheme format:** JSON rubric with `steps[]`, each with `markType`, `acceptableAnswers[]`, `marksAvailable` — chain applies rubric, does not invent criteria.

### Cross-Subject Principles

1. Mark scheme is **structured JSON** passed to marking chain — not free-text interpretation
2. Student work is in **human message only** — never in system prompt
3. Photo pipeline always includes **student confirmation** before marking
4. All outputs **Zod-validated** before display

---

## 6. AI Models and Agents in Production

### The Five Chains (Independent — Never Call Each Other)

| Chain      | Trigger                    | Model                     | Sync/Async  | Blocks student? |
| ---------- | -------------------------- | ------------------------- | ----------- | --------------- |
| Marking    | Every answer submit        | Haiku 4.5                 | Sync        | Yes             |
| Guidance   | Hint request               | Haiku L1-L2, Sonnet L3    | Sync        | Yes             |
| Generation | Nightly pool refresh       | Sonnet + Haiku cross-exam | Async batch | No              |
| UVE        | After marking              | Haiku L1-L2               | Async       | No              |
| Curriculum | Topic explain (cache miss) | Sonnet 4.6                | Sync        | Yes             |

Orchestration lives in **route handlers and cron jobs only** — chains do not invoke chains.

### Model Router (`getModelConfig(task)`)

Every LLM call goes through the router:

```typescript
type TaskType =
  | "marking_math"
  | "marking_science"
  | "marking_essay"
  | "hint_1"
  | "hint_2"
  | "hint_3"
  | "uve_1"
  | "uve_2"
  | "uve_3"
  | "uve_4"
  | "question_gen"
  | "curriculum_explain"
  | "report_gen"
  | "ocr_fallback";
```

**Future:** Router checks `localModelRegistry.supports(task)` first — local fine-tuned model for marking at V3.0. Only the router changes.

### Token Consumption

| Chain      | Typical input tokens             | Typical output tokens | Cost tier                   |
| ---------- | -------------------------------- | --------------------- | --------------------------- |
| Marking    | 800–2,500 (mark scheme minified) | 200–600               | ~$0.0003/call (Haiku)       |
| Hint L1-L2 | 400–800                          | 50–150                | ~$0.0001                    |
| Hint L3    | 600–1,200                        | 50–200                | ~$0.003                     |
| UVE L1-L2  | 500–1,000                        | 150–400               | ~$0.0002                    |
| Curriculum | 1,500–3,000 (syllabus chunk)     | 400–800               | ~$0.01 (cached after first) |
| Generation | 3,000–6,000 (RAG context)        | 800–1,500             | ~$0.02–0.05                 |
| OCR        | 1,000 (image) + prompt           | 200–800               | ~$0.005                     |

**Logging (required every call):** `chain_type`, `model`, `input_tokens`, `output_tokens`, `latency_ms`, `confidence`, `schema_valid`

### Concurrent Users

| Scale                   | Architecture behaviour                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pilot (20 students)** | Vercel auto-scales serverless functions; Neon free tier sufficient                                                                              |
| **1,000 concurrent**    | Vercel 30K concurrency limit; Anthropic rate limit (~1K RPM standard) becomes bottleneck — request queue + retry with backoff                   |
| **10,000+ concurrent**  | Neon Launch + connection pooling; Upstash paid tier; Anthropic tier upgrade; consider marking queue (Redis list + worker) for peak exam periods |
| **1M+ students**        | Read replicas; regional edge; local marking models via router; archive cold data to R2                                                          |

**MVP strategy:** Synchronous marking with Haiku (< 3s p95). At scale, **marking queue** defers non-exam practice marking by seconds — exam mode stays synchronous.

**No architectural rewrite required** — queue is additive middleware in route handler.

### Cost Optimisation Stack (Production)

```
Layer 1 — Prevent unnecessary calls
  ├── Question pool (no LLM at delivery)
  ├── Curriculum cache (no LLM on repeat)
  ├── Idempotency (no double marking)
  └── Rate limits + circuit breaker

Layer 2 — Cheapest model for task
  ├── Haiku: marking, hints L1-L2, UVE L1-L2, reports, cross-exam
  └── Sonnet: hints L3, generation, curriculum, OCR only

Layer 3 — Async / batch
  ├── UVE after response sent
  ├── Generation nightly cron
  └── Weekly reports Sunday batch (Haiku)

Layer 4 — At scale (V2+)
  ├── Anthropic Batch API (50% off)
  ├── Embedding once per question (never regenerate)
  └── Local fine-tuned models (router swap)
```

---

## 7. Minimising Hallucinations — Grounding Strategy

### Principle: AI May Only Claim What Sources Support

| Chain      | Grounding source                              | Block if missing                                     |
| ---------- | --------------------------------------------- | ---------------------------------------------------- |
| Marking    | Mark scheme JSON (human-validated template)   | N/A — rubric is authoritative                        |
| Guidance   | Mark scheme + question text                   | Anti-leakage check                                   |
| Generation | RAG: 5 similar validated questions + syllabus | **Abort if k < 5**                                   |
| Curriculum | Syllabus chunk from DB                        | **Abort if no chunk** — return "content unavailable" |
| UVE        | Original question + mark scheme               | Template-based probes                                |

### RAG Pipeline (Question Generation)

```
1. Embed topic query (Voyage AI — once per generation call)
2. pgvector cosine search: validated=true, same topicId, k=5
3. Pass retrieved question texts as context to Sonnet
4. Generate template + param_schema + mark_scheme_template
5. Haiku cross-examination: solve independently, compare to mark scheme
6. If inconsistent → flag for admin, never enter pool
7. Admin human approval (Unit 29) → validated=true → embed permanently
```

### Hallucination Registry

Confirmed errors logged to `hallucination_registry` table — reviewed monthly; drives prompt and temperature adjustments.

### Student-Facing Confidence

- Every mark displays confidence score
- confidence < 0.70 → **"Under review"** badge — never hidden
- Curriculum explanations cite "Based on official syllabus"
- OCR transcription requires student confirmation

---

## 8. Security and Data Protection

See `security.md` for implementation detail. Summary:

| Control                      | MVP implementation                                   |
| ---------------------------- | ---------------------------------------------------- |
| **Encryption in transit**    | TLS 1.3 (Vercel, Neon, R2, Anthropic)                |
| **Encryption at rest**       | Neon AES-256, R2 AES-256 (provider-managed)          |
| **Authentication**           | Auth.js JWT, HTTP-only cookie, bcrypt factor 12      |
| **Authorization**            | RBAC + resource ownership in every route             |
| **Secrets**                  | Environment variables only — never client-exposed    |
| **PII in AI prompts**        | session_id only — no names or emails                 |
| **Anthropic data retention** | Zero-data-retention option enabled                   |
| **Minors**                   | Parental consent (Unit 23); export/deletion requests |
| **Audit trail**              | Admin actions, appeals, deletions logged append-only |
| **Rate limiting**            | Prevents abuse and runaway AI cost                   |

**Upgrade path (V1.1):** PostgreSQL RLS, JWT refresh rotation, CSP headers — same schema, additive policies.

---

## 9. Analytics and Observability (No PostHog)

ExamEdge uses **Plausible** (or Postgres event logging on zero budget) — not PostHog.

| Tool                  | Purpose                             | Free tier                        |
| --------------------- | ----------------------------------- | -------------------------------- |
| Plausible / DB events | Product analytics (7 custom events) | See zero-budget-stack.md         |
| Sentry                | Error tracking                      | 5K errors/mo                     |
| Structured AI logs    | Cost + quality monitoring           | Postgres or stdout → Vercel logs |
| `/api/health`         | Uptime checks                       | Free                             |

---

## 10. End-to-End Student Journey (MVP)

```
Register (Cameroon, GCE Buea, 3 subjects)
  → Dashboard (all topics red)
  → Learn topic (curriculum chain, cached)
  → Practice session (parameterised question)
  → Submit wrong answer → Hint (Socratic)
  → Submit correct answer → profile-appropriate mark feedback
  → UVE L1 probe (different numbers) → MVS update
  → Mastery map turns amber
  → Repeat until green (theta ≥ 0.70)
  → Exam simulation (timed, no hints)
  → Post-exam report
  → Progress page shows history
  → Optional: appeal mark, request data export
```

**10-minute demo script:** `docs/demo-script.md`

---

## 11. Documentation Map for This Topic

| Question                  | Read                                      |
| ------------------------- | ----------------------------------------- |
| Can I build for $0?       | `zero-budget-stack.md`                    |
| Chain input/output specs  | `AGENTS.md`                               |
| API routes and schema     | `architecture.md`                         |
| Auth and privacy          | `security.md`                             |
| What to build when        | `build-plan.md` (31 units)                |
| V2/V3 expansion           | `roadmap.md`                              |
| Cost economics at scale   | `ExamEdge_Cost_Optimisation_Economics.md` |
| Responsible AI governance | `ExamEdge_Responsible_AI_Framework.md`    |
| Find any document         | `documentation-map.md`                    |

---

## 12. Quality Without Budget

Free infrastructure does not mean inferior education. ExamEdge quality comes from:

1. **Pedagogical constraints** hardcoded in chain system prompts — not from model size
2. **Human validation gate** — no AI question reaches students unreviewed
3. **Understanding verification** — mastery requires probes, not single correct answers
4. **Board-accurate rubrics** — marking profiles from real mark schemes (`marking-conventions.md`)
5. **Offline resilience** — learning continues without connectivity
6. **Honest UX** — confidence badges, appeal mechanism, no false anti-cheating claims

The platform is designed to **start on zero infrastructure dollars**, **spend minimally on AI during pilot**, and **scale economically** to millions of students through routing, caching, and batching — without rewriting the architecture that makes learning work.
