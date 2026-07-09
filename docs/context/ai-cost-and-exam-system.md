# AI Cost Orchestration & Examination System — ExamEdge

**Canonical blueprint** for sustainable AI economics at scale and the full examination simulation lifecycle.

**Related docs:** `AGENTS.md` (five chains, router), `zero-budget-stack.md` (pilot costs), `content-architecture.md` (content reuse), `ExamEdge_Cost_Optimisation_Economics.md` (Tier 3 depth), `ExamEdge_Volume_II_Framework.md` §20 (exam pedagogy depth).

---

## 1. Core Economic Principle

**AI inference must not scale linearly with users.**

ExamEdge achieves this through five interlocking strategies:

| Strategy                         | Mechanism                                                                       | Effect                                                           |
| -------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Generate once, serve forever** | Validated questions, topic explanations, embeddings stored permanently          | Marginal cost → 0 per additional student                         |
| **No AI at delivery time**       | Question selection + parameter instantiation are algorithmic                    | Millions of concurrent "next question" calls cost $0 in LLM fees |
| **Right model for each task**    | Single router (`getModelConfig`) assigns Haiku vs Sonnet vs future local models | 10–20× cost reduction on high-frequency marking                  |
| **Cache before compute**         | Redis + Postgres permanent caches; idempotency prevents duplicate calls         | Eliminates redundant inference                                   |
| **Async expensive work**         | UVE, reports, generation run in background / batch                              | Peak load does not block synchronous paths                       |

At 500 students, ~85% of question serves are cache hits with zero new generation. At 50,000 students, pool hit rate targets ~98% — AI spend grows **sub-linearly** (O(log n)) while users grow linearly.

---

## 2. Model Tier System

Every AI task maps to the **cheapest tier** that meets quality thresholds. The router is the only switch point — chains never hardcode model names.

### 2.1 Tiers (Current → Future)

| Tier                       | Model                                                             | Cost profile  | When used                                                                      |
| -------------------------- | ----------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| **T0 — On-device**         | Whisper.cpp, Google ML Kit, future quantized Llama                | $0/call       | Offline ASR, basic OCR, spell-check (V2.0+)                                    |
| **T1 — Self-hosted OSS**   | Fine-tuned Mistral 7B / Llama 3 8B on Railway GPU (~$20/mo fixed) | ~$0.0001/call | Marking after 10K+ training examples (Year 2)                                  |
| **T2 — Claude Haiku 4.5**  | $0.25/M input · $1.25/M output                                    | ~$0.0003/call | Marking, hints L1-L2, UVE L1-L2, cross-exam, reports                           |
| **T3 — Claude Sonnet 4.6** | $3/M input · $15/M output                                         | ~$0.003/call  | Hints L3, generation, curriculum (cache miss), UVE L3-L4, OCR fallback, essays |

**Rule:** Sonnet is reserved for tasks requiring deep reasoning or one-time generation. Haiku handles everything structured and high-frequency.

### 2.2 Task-to-Model Matrix (Production)

| Task                              | Model  | Temp | Max tokens | Sync/Async             | Blocks student? |
| --------------------------------- | ------ | ---- | ---------- | ---------------------- | --------------- |
| `marking_math`, `marking_science` | Haiku  | 0.1  | 800        | Sync                   | Yes             |
| `marking_essay`                   | Sonnet | 0.2  | 1200       | Sync                   | Yes             |
| `hint_1`, `hint_2`                | Haiku  | 0.4  | 400        | Sync                   | Yes             |
| `hint_3`                          | Sonnet | 0.5  | 400        | Sync                   | Yes             |
| `uve_1`, `uve_2`                  | Haiku  | 0.2  | 700        | Async                  | No              |
| `uve_3`, `uve_4`                  | Sonnet | 0.3  | 700        | Async                  | No              |
| `question_gen`                    | Sonnet | 0.7  | 1500       | Batch cron             | No              |
| `curriculum_explain`              | Sonnet | 0.6  | 2000       | Sync (cache miss only) | Yes             |
| `report_gen`                      | Haiku  | 0.4  | 800        | Async deferred         | No              |
| `ocr_fallback`                    | Sonnet | 0.1  | 1500       | Sync                   | Yes             |
| Cross-examination                 | Haiku  | 0.1  | 800        | Batch                  | No              |

### 2.3 Router Implementation

```typescript
// packages/ai/router.ts — single switch point
export function getModelConfig(task: TaskType): ModelConfig {
  // V3.0: if (localModelRegistry.supports(task)) return localConfig;
  return TASK_MODEL_MAP[task];
}
```

**Invariants (never violated):**

- Marking never uses Sonnet (except `marking_essay`)
- Question generation never runs during live student sessions
- Every call logged: model, input/output tokens, latency, estimated cost

### 2.4 When Open-Source Replaces Cloud (Progressive Offloading)

| Milestone     | Trigger                                              | Migration                                                                       |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| Year 2        | 10,000+ marked responses with human agreement labels | Fine-tune 7B model for GCE Maths marking → router switches `marking_math` to T1 |
| Year 2–3      | Science marking benchmark ≥92% on 500-question suite | Extend T1 to `marking_science`                                                  |
| Year 3        | Hint L1-L2 quality score ≥7/10 on specialist review  | Optional T1 for `hint_1`, `hint_2`                                              |
| Never (cloud) | Generation, curriculum, hint L3, UVE L3-L4           | Sonnet quality bar too high for small OSS models at launch                      |

Cloud Sonnet spend **decreases over time** as Haiku/local models absorb high-frequency tasks.

---

## 3. Cost Control by Activity

### 3.1 Activity → AI Cost Profile

| Platform activity             | LLM at runtime?     | Model                       | Cost pattern              |
| ----------------------------- | ------------------- | --------------------------- | ------------------------- |
| Personalized tutoring (hints) | Yes, per hint       | Haiku L1-L2; Sonnet L3 only | ~$0.0002–0.003 per hint   |
| Concept explanations          | Once per topic/lang | Sonnet on cache miss only   | ~$0.003 once → $0 forever |
| Question generation           | Batch only          | Sonnet + Haiku cross-exam   | ~$0.003 per new template  |
| Exam paper assembly           | **No**              | Algorithm                   | $0                        |
| Exam marking (per question)   | Yes                 | Haiku                       | ~$0.0003 per response     |
| Practice marking              | Same as exam        | Haiku                       | Same                      |
| Feedback (step marks)         | Included in marking | Haiku                       | Same call                 |
| Adaptive recommendations      | **No** (MVP)        | IRT + graph algorithm       | $0                        |
| Learning analytics dashboard  | **No** (MVP)        | SQL aggregation             | $0                        |
| Post-exam narrative report    | Deferred async      | Haiku `report_gen`          | ~$0.0004 per exam (V1.0+) |
| Weekly email report           | Batch cron          | Haiku                       | ~$0.0002 per student/week |
| UVE probes                    | Async after mark    | Haiku L1-L2                 | ~$0.0002 per probe        |

**Key insight:** Exam simulation paper creation is **100% algorithmic**. AI cost for an exam = marking N answers (Haiku × N) + optional deferred report (Haiku × 1).

### 3.2 Operations That Must Never Use Sonnet at Scale

- Per-answer marking (millions/day at continental scale)
- Hint levels 1–2 (3× per struggling student per question)
- UVE L1-L2 (every submission)
- Cross-examination validation (batch, but high volume)
- Idempotent duplicate submissions

---

## 4. Caching & Content Reuse

### 4.1 Cache Layers

| Asset                                 | Location                        | TTL                  | Regenerate?                  |
| ------------------------------------- | ------------------------------- | -------------------- | ---------------------------- |
| Question templates + embeddings       | PostgreSQL pgvector             | Permanent            | Only if template edited      |
| Topic explanations                    | PostgreSQL `topic_explanations` | Permanent            | Admin trigger only           |
| Syllabus chunks                       | PostgreSQL                      | Permanent            | Syllabus version bump        |
| Instantiated mark scheme              | Redis                           | 1h                   | Per session instance         |
| Warm question pool (topic/difficulty) | Redis                           | 1h (6h at exam peak) | Rolling refresh              |
| Curriculum tree                       | Redis                           | 24h                  | Syllabus update              |
| Dashboard mastery summary             | Redis                           | 15min                | Session complete invalidates |
| Idempotency / marking duplicate       | Redis                           | 5min                 | N/A                          |
| Report narrative (exam)               | PostgreSQL JSONB                | Permanent            | Once per simulation          |

### 4.2 Three Retrieval Patterns (Not All RAG)

| Pattern             | When                          | LLM?         | Purpose                                                  |
| ------------------- | ----------------------------- | ------------ | -------------------------------------------------------- |
| **Pool selection**  | Every `next-question`         | No           | IRT match + 30-day exclusion + local params              |
| **Generation RAG**  | Nightly pool refresh          | Yes (Sonnet) | Ground new templates in 5 similar validated questions    |
| **Syllabus lookup** | Curriculum explain cache miss | Yes (Sonnet) | Direct DB fetch of `syllabus_chunks` — not vector search |

### 4.3 Token Minimization (Without Quality Loss)

| Technique                              | Where             | Savings                                                          |
| -------------------------------------- | ----------------- | ---------------------------------------------------------------- |
| Mark scheme JSON minification          | Marking chain     | Caps context at 4,000 tokens; split sequential calls if exceeded |
| Immutable system prompts               | All chains        | No dynamic prompt bloat                                          |
| Structured output (Zod + tool_use)     | All chains        | Fewer retry tokens                                               |
| Few-shot examples loaded at build time | Marking only      | 3 examples per subject — not per call                            |
| `max_tokens` per chain                 | Router config     | Prevents runaway generation                                      |
| Sanitize user input before prompt      | `sanitize.ts`     | Strips injection patterns; truncates extreme length              |
| No PII in prompts                      | All chains        | session_id only — smaller, safer context                         |
| Curriculum cache                       | Permanent         | Second student = 0 tokens                                        |
| Parameter instantiation local          | Question delivery | 0 tokens per serve                                               |

---

## 5. Peak Load & Queue Architecture

### 5.1 Predictable Peaks

GCE revision season (May–June, Oct–Nov) drives 3–5× session frequency. Architecture handles this without proportional AI spend increase.

### 5.2 Pre-Peak Preparation (Automated)

```
T-14 days before exam season:
  → Pool monitor raises minimum from 50 → 60 questions per topic/difficulty
  → Nightly generation batches spread Sonnet cost over 14 days
  → Redis cache TTL extended 1h → 6h for top 20 topics by exam_weight
```

### 5.3 Request Classification

```
Incoming request
  ├── READ (pool, dashboard, explain cache hit) → Postgres/Redis only
  ├── SYNC AI (marking, hint, OCR) → Vercel function → Haiku/Sonnet → <3s SLA
  ├── ASYNC AI (UVE, exam report) → Return 202 / fire-and-forget → background
  └── BATCH AI (generation, weekly reports) → Vercel Cron / Anthropic Batch API
```

### 5.4 Rate Limiting & Circuit Breakers

| Limit              | Value             | Purpose                            |
| ------------------ | ----------------- | ---------------------------------- |
| Auth endpoints     | 5/min per IP      | Brute-force prevention             |
| AI operations      | 60/hour per user  | Normal intensive study cap         |
| AI circuit breaker | 100/hour per user | Abuse / budget protection          |
| Idempotency        | 5min TTL          | Duplicate submit = 0 extra AI cost |

During peak, limits are **maintained** (not raised) — prevents resource monopolisation while allowing ~8 full practice sessions/hour per student.

### 5.5 Queue Strategy (V1.1+ at 10K+ concurrent)

| Queue              | Work                 | Processor                                 |
| ------------------ | -------------------- | ----------------------------------------- |
| `marking-priority` | Live session submits | Sync — Vercel concurrent functions        |
| `uve-deferred`     | Post-response probes | Async worker / `waitUntil`                |
| `report-deferred`  | Post-exam narrative  | Async — 30s after submit                  |
| `generation-batch` | Pool refresh         | Cron + Anthropic Batch API (50% discount) |

MVP (V1.0): async via Vercel `waitUntil` or return marking first, poll for UVE/report. No separate queue infrastructure required until regional scale.

### 5.6 Anthropic Batch API (Scale)

For non-latency-sensitive work:

- Weekly reports (Sunday cron)
- Question generation (nightly)
- Bulk cross-examination

**50% token discount** vs synchronous API. Same prompts, deferred completion within 24h.

---

## 6. Cost Projections by Scale

| Scale       | Students  | Est. AI/month | Primary drivers      | Mitigation                                   |
| ----------- | --------- | ------------- | -------------------- | -------------------------------------------- |
| Pilot       | 20        | $1–5          | Marking, hints       | Starter credits, caching                     |
| Regional    | 1,000     | $50–150       | Marking volume       | 85% pool hit, Haiku-only marking             |
| National    | 10,000    | $300–800      | Peak season spikes   | Pre-peak pool, Batch API, rate limits        |
| Continental | 100,000   | $2,000–5,000  | Marking at scale     | T1 fine-tuned marking, 98% pool hit          |
| Continental | 1,000,000 | $8,000–20,000 | Inference throughput | Dedicated AI service, local models, sharding |

**Revenue anchor:** Sustainable at $3–5/student/month from Month 12 — AI cost target <$0.10/student/month at 2,000+ users.

Per-student AI at scale (question delivery only): ~$0.000003 per serve when pool hit rate ≥98%.

---

## 7. Examination System — Educational Design

### 7.1 Purpose

Exam simulation trains **examination readiness**, not just content knowledge:

- Time pressure and stamina
- Paper format familiarity (sections, instructions, mark allocations)
- Psychological preparation (fullscreen, no hints, invigilation-like warnings)
- Honest readiness measurement before national exams

ExamEdge distinguishes **knowing the material** from **performing under examination conditions** — a gap private tutors address but most EdTech ignores.

### 7.2 Paper Fidelity

Simulations mirror official GCE Board Buea papers via `curricula.board_config`:

```json
{
  "version": "1.0.0",
  "paperCode": "0765/2",
  "level": "AL",
  "durationMinutes": 150,
  "totalMarks": 100,
  "gradeBoundaries": { "A": 80, "B": 70, "C": 60, "D": 50, "E": 40 },
  "sections": [
    {
      "label": "Section A",
      "instruction": "Answer ALL questions in this section.",
      "questionCount": 10,
      "marksEach": 4,
      "topicWeights": { "differentiation": 0.2, "integration": 0.2, "vectors": 0.15 },
      "allowCalculator": false
    },
    {
      "label": "Section B",
      "instruction": "Answer ANY FOUR questions from this section.",
      "questionCount": 8,
      "answerCount": 4,
      "marksEach": 15,
      "topicWeights": { "differentiation": 0.25, "integration": 0.25, "mechanics": 0.25 }
    }
  ],
  "frontPageInstructions": [
    "Write your answers in the spaces provided.",
    "Show all working. Marks are awarded for method.",
    "Calculators are NOT permitted in Section A."
  ]
}
```

Adding WAEC/KCSE = new `board_config` JSON — not new assembly code.

### 7.3 Fairness: Unique Papers, Equivalent Difficulty

| Requirement             | Implementation                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| No two papers identical | Parameter instantiation + different template selection per student  |
| Equivalent difficulty   | IRT theta targeting ±0.5; section topic weights from `board_config` |
| No repeat fatigue       | Exclude templates seen in last 14 days (exam) / 30 days (practice)  |
| Syllabus coverage       | Weighted selection by `exam_weight` per topic                       |
| Mark allocation match   | Section `marksEach` × `questionCount` = section total               |

---

## 8. Examination System — Technical Architecture

### 8.1 Paper Assembly Pipeline (Zero LLM)

```
POST /api/simulations
  Input: { subjectId, boardPaperCode, studentId }
        ↓
  Load board_config from curricula
        ↓
  PaperBuilder (fluent builder pattern)
    For each section:
      → Query validated pool: topic weights, difficulty ≈ student IRT
      → Exclude templates seen in 14 days
      → Select questionCount templates
      → instantiateParams() locally for each
      → generateMarkScheme() locally
      → renderTemplate() → LaTeX question text
      → Assign question numbers, section headers, mark labels
        ↓
  INSERT simulation record + question manifest (JSONB)
        ↓
  Return { simulationId, durationMinutes, sections[], frontPageInstructions }
```

**Latency target:** p95 < 2s — database queries + local rendering only.

### 8.2 Examination Session Lifecycle

```
1. Student selects subject → "Start Exam Simulation"
2. Client requests fullscreen (Fullscreen API)
3. POST /api/simulations → paper assembled
4. ExamTimer starts (duration from board_config)
5. Loop: render question → MathInput/photo → submit (marking sync, no hints)
6. Page Visibility API: tab switch → pause overlay + log focus_break
7. Warnings at 15min and 5min remaining (board convention)
8. Auto-submit at expiry OR manual submit on last question
9. POST /api/simulations/:id/submit → finalize session
10. Redirect to ExamReport
```

### 8.3 Academic Integrity Features (Web-Realistic)

| Feature                  | Implementation                                      | Honest limit                                    |
| ------------------------ | --------------------------------------------------- | ----------------------------------------------- |
| Fullscreen mode          | Fullscreen API on start                             | Cannot force on all browsers; student can exit  |
| Tab-switch logging       | Page Visibility API → `focus_breaks` counter        | Detects distraction; does not prevent phone use |
| Timer pause on switch    | Exam paused until student confirms return           | Mirrors invigilator attention                   |
| No hints                 | UI omits HintPanel in exam mode                     | Enforced server-side                            |
| Answer lock after submit | Session status = `completed`; no PATCH on responses | Immutable exam attempt                          |
| Post-exam integrity note | Report shows focus_breaks count                     | Transparent, not punitive                       |

**Documented in UI:** ExamEdge does not claim to prevent screenshots, second devices, or cheating. It trains readiness and logs focus patterns for self-awareness.

### 8.4 Marking During Exam

Each answer uses **identical Pattern 1** as practice:

- Haiku marking chain
- M1/A1 step breakdown
- Confidence scoring
- Idempotency on submit
- **No UVE during exam** (deferred to post-exam review mode — V1.1)

Hints are disabled server-side regardless of client manipulation.

---

## 9. Post-Examination: From Marks to Learning

### 9.1 Educational Goal

The post-exam report is the **highest-value learning moment** — transforming mistakes into actionable preparation. The platform functions as an intelligent tutor, not a scoreboard.

### 9.2 Report Components

| Component                             | Source                                      | LLM?                 |
| ------------------------------------- | ------------------------------------------- | -------------------- |
| Total marks / percentage              | SQL aggregate                               | No                   |
| Grade boundary (board-specific)       | `board_config.gradeBoundaries`              | No                   |
| Per-question mark breakdown           | Stored `marks_awarded` JSONB                | No                   |
| Unanswered questions list             | Session manifest vs responses               | No                   |
| Topic performance profile             | Group marks by topic_id                     | No                   |
| Time per question vs recommended      | `time_taken_s` vs marks ratio               | No                   |
| Error pattern classification          | Marking step `markType` + awarded flags     | No                   |
| Priority revision list (top 3 topics) | Lowest topic scores weighted by exam_weight | No                   |
| Readiness score delta                 | IRT aggregate before/after                  | No                   |
| **Personalized narrative**            | Structured prompt from above data           | **Haiku async**      |
| **Examiner-friendly model answers**   | Per lost-mark question (V1.1)               | Sonnet batch, cached |

### 9.3 MVP vs V1.1 Report Depth

| Capability                        | V1.0 MVP                          | V1.1+                                |
| --------------------------------- | --------------------------------- | ------------------------------------ |
| Numeric breakdown + topic profile | ✓ Template aggregation            | ✓                                    |
| Priority revision list            | ✓ Algorithm                       | ✓                                    |
| Personalized guidance narrative   | ✓ Haiku `report_gen` deferred 30s | ✓                                    |
| Error type classification         | Basic (from mark types)           | ML clustering on cognitive_fp        |
| Model examiner answers            | Deferred                          | Sonnet per question template, cached |
| Predicted grade trend             | Simple linear                     | Historical regression                |

### 9.4 Post-Exam Report Pipeline

```
POST /api/simulations/:id/submit
  → Mark any unsubmitted questions as zero
  → Aggregate marks per question, section, topic
  → UPDATE simulation status = completed
  → UPDATE mastery_records (exam mode weighting)
  → Return { totalMarks, grade, perQuestionSummary } immediately
        ↓
  Async (waitUntil / deferred job, ~30s):
    → Build structured report payload (all SQL aggregates)
    → runReportGenChain() — Haiku, temp 0.4, max 800 tokens
    → Input: aggregates only — NOT raw student PII
    → Output: { narrative, priorityActions[], encouragement }
    → Store in simulation.report JSONB
    → Client polls GET /api/simulations/:id/report or WebSocket push (V1.1)
```

**Token discipline:** Report input is pre-aggregated JSON (~500 tokens), not full exam text. Output capped at 800 tokens. Cost ~$0.0004 per exam.

### 9.5 Turning Mistakes into Learning (Post-Exam Flow)

```
ExamReport page
  → Summary: marks, grade, focus breaks
  → Per-question expandable cards: student answer vs marks awarded
  → "Why marks were lost" — from marking chain feedback (already stored)
  → Priority revision: 3 topics → deep links to /study/[topicId]
  → Optional: "Review with tutor" → practice mode on missed topics (hints enabled)
  → V1.1: UVE probes on questions where marks < 50% (understanding check)
```

Student leaves exam simulation with **specific next actions**, not just a score.

---

## 10. Learning Analytics Without LLM Cost

Dashboard analytics are **SQL-computed**, not LLM-generated:

| Metric                  | Computation                                | Update trigger                     |
| ----------------------- | ------------------------------------------ | ---------------------------------- |
| Mastery map colours     | `mastery_records.mastery_level` thresholds | Every response                     |
| Readiness score         | Weighted sum of topic thetas × exam_weight | Session complete                   |
| Streak                  | Consecutive study days (1 grace day/week)  | Daily cron                         |
| Focus analytics         | `focus_breaks`, active time ratio          | Session metadata                   |
| Spaced repetition due   | SM-2 `next_review`                         | Nightly cron                       |
| Pathway recommendations | Graph + IRT algorithm                      | Dashboard load (Redis 15min cache) |

Weekly email narrative uses Haiku **once per student per week** in batch — not per page view.

---

## 11. Monitoring & Governance

### 11.1 Cost Observability

Every AI call logs:

```typescript
{
  chain: "marking" | "guidance" | ...,
  model: "claude-haiku-4-5",
  inputTokens: number,
  outputTokens: number,
  estimatedCostUsd: number,
  latencyMs: number,
  cacheHit: boolean,
  userId: "uuid",  // not in prompt — logs only
  sessionId: "uuid"
}
```

Dashboards (V1.1): cost per chain, cost per student, pool hit rate, cache hit rate.

### 11.2 Quality Gates (Never Sacrifice for Cost)

| Chain      | Minimum quality bar               | If below threshold                                              |
| ---------- | --------------------------------- | --------------------------------------------------------------- |
| Marking    | ≥92% agreement with human markers | Block model upgrade; escalate to Sonnet for low-confidence only |
| Hints      | Zero answer-leakage violations    | Anti-leakage retry; never downgrade L3 to Haiku                 |
| Generation | ≥95% cross-examination pass       | Human validation gate regardless                                |
| Curriculum | Syllabus-grounded only            | No generation without chunk — cache permanent                   |

**Cost optimization never removes:** Zod validation, human validation gate, anti-leakage checks, appeal pathway, confidence scoring.

---

## 12. Documentation Coverage

### Previously documented

| Concern                      | Location                                       |
| ---------------------------- | ---------------------------------------------- |
| Model router & five chains   | `AGENTS.md`                                    |
| Pilot cost estimates         | `zero-budget-stack.md`                         |
| Tier 0–3 economics           | `ExamEdge_Cost_Optimisation_Economics.md`      |
| Exam simulation UI (Unit 25) | `build-plan.md`                                |
| Exam workflow summary        | `platform-how-it-works.md` §2, §4              |
| Pool selection (no LLM)      | `AGENTS.md` Pattern 3                          |
| Scalability tiers            | `content-architecture.md` §8, `roadmap.md`     |
| Post-exam report vision      | `ExamEdge_Volume_II_Framework.md` §20.2.3      |
| Peak load strategies         | `ExamEdge_Cost_Optimisation_Economics.md` §8.2 |

### Consolidated in this document

| Gap                                              | Section |
| ------------------------------------------------ | ------- |
| Full task-to-model matrix with sync/async        | §2.2    |
| Activity-level AI cost profile                   | §3.1    |
| Open-source migration triggers                   | §2.4    |
| Peak load queuing strategy                       | §5      |
| Anthropic Batch API                              | §5.6    |
| Exam paper assembly (PaperBuilder, board_config) | §7–8    |
| Post-exam report pipeline (MVP vs V1.1)          | §9      |
| Integrity features + honest limits               | §8.3    |
| Analytics without LLM                            | §10     |
| Cost projections by scale                        | §6      |

---

## 13. Implementation Phasing

| Capability                         | Version | Build unit          |
| ---------------------------------- | ------- | ------------------- |
| Router + Haiku marking             | V1.0    | Units 09, 10        |
| Pool assembly (no LLM)             | V1.0    | Unit 24             |
| Exam simulation + timer + focus    | V1.0    | Unit 25             |
| Template post-exam report          | V1.0    | Unit 25             |
| Haiku deferred report narrative    | V1.0    | Unit 25 (async)     |
| Pre-peak pool expansion cron       | V1.1    | Unit 30 extension   |
| Anthropic Batch API for generation | V1.1    | Unit 30             |
| Model examiner answers (cached)    | V1.1    | roadmap             |
| Post-exam UVE on weak questions    | V1.1    | roadmap             |
| Fine-tuned local marking router    | V3.0    | roadmap             |
| Dedicated AI inference service     | V3.0    | Engineering doc §13 |

---

_This document is Tier 1 canonical. Update when router assignments, exam report pipeline, or scale strategy changes._
