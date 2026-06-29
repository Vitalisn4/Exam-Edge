# Content Architecture — ExamEdge

**Canonical blueprint** for curriculum-agnostic content, knowledge graph, learner pathways, and continent-scale delivery.

**Related docs:** `architecture.md` (schema, API), `roadmap.md` (release phases), `platform-how-it-works.md` (pedagogy), `AGENTS.md` (AI chains), `ExamEdge_Volume_V_Blueprint.md` (GCE subject matrix depth).

---

## 1. Design Principle

ExamEdge separates **platform engine** from **curriculum content**:

| Layer | What it is | Changes when expanding |
|-------|------------|------------------------|
| **Engine** | Auth, sessions, marking, hints, UVE, mastery, caching, AI router | Rarely — same five chains forever |
| **Configuration** | Board rules, grading scales, paper formats (`board_config` JSONB) | Per board — seed data |
| **Content** | Syllabi, topics, questions, explanations, simulations | Continuously grows |
| **Personalization** | IRT, cognitive fingerprint, pathways | Per student — computed |

**Rule:** Adding Nigeria (WAEC), Kenya (KCSE), or Francophone boards = **content + config + validated pool**. No new AI chains. No architectural rewrites.

---

## 2. Content Hierarchy

### 2.1 Full Model (Platform Capability)

```
curricula                    Board + country + level + language
  └── subjects               Official subject codes (0765, 0710, …)
        └── topics             Syllabus units (Differentiation, Genetics, …)
              └── subtopics    Teachable concepts within a topic (V1.1+ table)
                    └── learning_objectives   Measurable outcomes (V1.1+)
                          └── lessons         Cached explanations + worked examples (V1.1+)
                                └── questions Parameterised templates (practice + assessment)
```

**Assessments** and **exam simulations** are not separate content trees — they are **assembled views** over validated questions, constrained by board paper rules.

### 2.2 MVP V1.0 (Launch Configuration)

MVP uses a **flattened tree** to ship the core loop in 10 weeks:

| Level | MVP implementation |
|-------|-------------------|
| `curricula` | One row: GCE Board Buea (OL + AL) |
| `subjects` | 3: Pure Maths (0765), Physics (0710), Biology (0730) |
| `topics` | 5 per subject minimum (seed in `gce-buea-topics.ts`) |
| Subtopics | Embedded in `topics.concept_graph` JSONB — not a separate table yet |
| Learning objectives | Embedded in `syllabus_chunks` text + `concept_graph` nodes |
| Lessons | `topic_explanations` — one cached four-part explanation per topic |
| Practice | `student_sessions` mode=`practice` + question pool |
| Assessments | In-session marking on individual questions |
| Exam simulations | `simulations` assembled from topic-weighted pool (Unit 25) |

### 2.3 V1.1 — Explicit Subtopic & Lesson Tables

When GCE expands toward the full 16-subject catalog, promote embedded JSON to first-class tables:

#### `subtopics`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| topic_id | UUID FK | Parent topic |
| name | TEXT | e.g. "Chain rule" under Differentiation |
| slug | TEXT | chain-rule |
| sort_order | SMALLINT | Display order within topic |
| syllabus_ref | TEXT | Official syllabus reference |
| difficulty_band | SMALLINT | 1–3 |
| prerequisite_subtopic_ids | UUID[] | Fine-grained graph edges |

#### `learning_objectives`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| subtopic_id | UUID FK | |
| code | VARCHAR(50) | e.g. GCE-0765-DIFF-LO3 |
| statement | TEXT | "Apply chain rule to composite functions" |
| bloom_level | TEXT | remember \| understand \| apply \| analyse |
| exam_weight | NUMERIC | Contribution to typical paper |

#### `lessons`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| subtopic_id | UUID FK | |
| language | TEXT | en \| fr \| sw |
| content | JSONB | { definition, workedExample, commonMistakes, practicePointer } |
| source_chunk_ids | UUID[] | `syllabus_chunks` used for grounding |
| generated_at | TIMESTAMPTZ | |
| validated | BOOLEAN | Human review before serve |

`topic_explanations` remains for topic-level overview; `lessons` adds subtopic granularity.

### 2.4 GCE Expansion Path (Subjects)

| Phase | GCE coverage |
|-------|--------------|
| V1.0 | Pure Maths, Physics, Biology (3 subjects) |
| V1.1 | Toward full GCE Buea OL + AL catalog (~16 subjects per level) |
| V2.0 | WAEC/NECO, KCSE, OBC parallel catalogs |
| V3.0 | Ministry partnerships; custom school syllabi overlays |

Full subject matrix and paper analysis: `ExamEdge_Volume_V_Blueprint.md`.

---

## 3. Knowledge Graph & Curriculum Map

### 3.1 What the Graph Represents

The curriculum map is a **directed acyclic graph (DAG)** of concepts:

- **Nodes:** topics (MVP) → subtopics (V1.1+) → learning objectives
- **Edges:** prerequisite relationships (`prerequisite_ids`, `prerequisite_subtopic_ids`)
- **Weights:** `exam_weight` — how often a concept appears on typical papers
- **Metadata:** `concept_graph` JSONB on each topic — nested structure for UI rendering

Example `concept_graph` (MVP, on `topics` row):

```json
{
  "nodes": [
    { "id": "diff-basics", "label": "Rate of change", "lo": "Define derivative as gradient" },
    { "id": "power-rule", "label": "Power rule", "lo": "Differentiate x^n", "requires": ["diff-basics"] },
    { "id": "chain-rule", "label": "Chain rule", "lo": "Composite functions", "requires": ["power-rule"] }
  ],
  "edges": [
    { "from": "diff-basics", "to": "power-rule" },
    { "from": "power-rule", "to": "chain-rule" }
  ]
}
```

### 3.2 How the Graph Guides Students

| System behaviour | Graph usage |
|------------------|-------------|
| **Dashboard recommendations** | Surface topics with unmet prerequisites first; block advanced topics until prerequisites ≥ mastery threshold |
| **Mastery gating** | Student cannot mark topic "complete" until MVS ≥ 0.75 (configurable) on all required subtopics |
| **Exam simulation assembly** | Weight question selection by `exam_weight` across topics |
| **Gap analysis** | Identify weak nodes downstream of failed prerequisites |
| **Learn mode ordering** | `Learn this topic` follows prerequisite chain bottom-up |

### 3.3 Cross-Board Taxonomy (V2.0)

When adding WAEC or KCSE, map local topics to a **shared taxonomy** where concepts align:

```
shared_concepts (V2.0)
  id, canonical_slug, description
board_topic_mappings
  topic_id, shared_concept_id, alignment_confidence
```

Enables: "You studied Differentiation under GCE — here's the WAEC-equivalent topic" for students who change boards or countries.

---

## 4. Content Types & Session Modes

### 4.1 Learn (Concept Introduction)

| Aspect | Detail |
|--------|--------|
| Trigger | Student taps "Learn this topic" |
| Source | `syllabus_chunks` → curriculum chain → `topic_explanations` cache |
| AI cost | Once per topic per language — permanent cache |
| Pedagogy | Four parts: definition, worked example (Cameroonian context), common mistakes, practice pointer |

### 4.2 Practice (Untimed Mastery Building)

| Aspect | Detail |
|--------|--------|
| Trigger | `/practice/[subjectId]` → topic selection |
| Questions | Validated pool; parameterised at delivery (no LLM) |
| Features | Hints (max 3), UVE probes, partial credit marking |
| Goal | Build understanding through productive struggle |

### 4.3 Assessment (Topic / Unit Check)

| Aspect | Detail |
|--------|--------|
| MVP | Implicit — end of study session mastery update |
| V1.1 | Explicit "Topic check" — fixed question count, no hints, mastery gate |
| Assembly | N questions from topic pool, difficulty matched to IRT theta |
| Outcome | Pass/fail gate; unlock next topic in pathway |

### 4.4 Exam Simulation (Board-Realistic Papers)

| Aspect | Detail |
|--------|--------|
| Trigger | Dashboard or `/exam/[simulationId]` |
| Assembly | Dynamic paper from pool using `board_config`: section count, marks per section, time limit, topic weights |
| Constraints | No hints; fullscreen; tab-switch logging |
| Output | Examiner report with per-question M1/A1/B1 breakdown |

### 4.5 Review (Spaced Repetition)

| Aspect | Detail |
|--------|--------|
| Trigger | Dashboard "Due for review" (cron: `spaced-repetition`) |
| Algorithm | SM-2 on `mastery_records` (`ease_factor`, `interval_days`, `next_review`) |
| Questions | Prior seen templates with new parameter instantiation |

---

## 5. Learner Modes — Primary vs Supplementary

ExamEdge serves students in **different educational contexts** through adaptive behaviour, not separate products.

### 5.1 Learner Profiles

| Profile | Context | Platform role |
|---------|---------|---------------|
| **Primary learner** | Limited access to quality teachers; school gaps; self-study main path | Full pathway: diagnostic → learn → practice → gate → exam prep |
| **Supplementary learner** | Attends school; uses platform to reinforce, clarify, practice | Targeted mode: gap analysis, weak-topic drill, exam simulation |
| **Exam cram** | Weeks before national exams | Simulation-heavy, readiness score, weakest-topic sprint |
| **Returning learner** | Long gap since last session | Spaced repetition + prerequisite refresh |

### 5.2 Onboarding Signals (V1.0)

Captured in `users.preferences` JSONB at registration:

```typescript
{
  learningMode: "primary" | "supplementary" | "exam_focus",
  level: "OL" | "AL",
  subjects: string[],           // subject IDs
  selfReportedConfidence: 1 | 2 | 3 | 4 | 5,  // per subject, optional
  schoolAttends: boolean        // optional — adjusts messaging, not access
}
```

### 5.3 Behavioural Adaptation by Mode

| Feature | Primary learner | Supplementary learner |
|---------|---------------|---------------------|
| First visit to topic | Diagnostic question **before** full lesson | Offer "Learn" or "Jump to practice" |
| Curriculum explain | Shown by default on first access | Available on demand; not forced |
| Mastery gating | Strict — block next topic until MVS ≥ threshold | Soft — recommend, don't block |
| Dashboard CTA | "Continue your learning path" | "Strengthen weak areas" / "Practice more" |
| Hint aggressiveness | Standard (3 hints) | Same — pedagogy unchanged |
| Weekly report emphasis | Progress along pathway | Gaps vs school syllabus, exam readiness |

### 5.4 Inferring Mode Over Time

Post-onboarding, `users.cognitive_fp` (updated by cron) refines pathways:

- Error pattern clusters → recommend subtopics
- Time-of-day accuracy → schedule suggestions
- Hint dependency score → more practice before next topic
- UVE failure on "correct" marks → flag surface memorisation

---

## 6. Personalization & Learning Pathways

### 6.1 Per-Student State

| Store | Purpose |
|-------|---------|
| `mastery_records` | IRT theta (0–1), MVS history, SM-2 fields per topic |
| `users.cognitive_fp` | Strengths, error patterns, learning style signals |
| `student_responses` | Full attempt history for analytics |
| `student_sessions` | Mode, duration, focus breaks |

### 6.2 Pathway Recommendation Algorithm

Executed on dashboard load and after each session:

```
1. Load curriculum graph for student's subjects
2. Filter topics where all prerequisites have mastery_level ≥ PREREQ_THRESHOLD (default 0.6)
3. Rank remaining by:
   a. next_review due (spaced repetition) — highest priority
   b. lowest mastery_level among unlocked topics
   c. highest exam_weight (exam_focus mode)
4. Return top 3 recommendations with rationale string
5. Cache in Redis (TTL 15min) — invalidate on session complete
```

Constants in `packages/shared/constants/thresholds.ts`.

### 6.3 Question Selection (Per Session)

```
POST /api/sessions/:id/next-question
  → Exclude templates seen in last 30 days
  → Filter validated=true, topic_id, difficulty ≈ IRT theta
  → Weight toward weak subtopics (from cognitive_fp) in V1.1+
  → instantiateParams() locally
  → Cache rendered question in Redis (TTL 1h)
```

No LLM at delivery — scales to millions of concurrent students.

### 6.4 Difficulty Adaptation

- **IRT theta** updated after each response (atomic with mastery transaction)
- Correct + high confidence → slight difficulty increase
- Wrong + hints used → maintain or decrease difficulty band
- UVE probe failure on correct answer → don't advance difficulty (surface knowledge detected)

---

## 7. Content Lifecycle

### 7.1 Ingestion Pipeline (V2.0 Formalised)

```
Syllabus PDF / official document
  → Chunk into syllabus_chunks (by topic, subtopic)
  → Embed chunks (pgvector) for curriculum RAG
  → Map to topics / subtopics in taxonomy
  → Seed mark_scheme_templates per board convention
```

MVP: manual seed files + admin-entered syllabus text.

### 7.2 Question Generation & Validation

```
Pool monitor: count < 50 per topic/difficulty bucket
  → RAG: 5 similar validated questions (pgvector)
  → Generation chain (Sonnet) → candidate template
  → Cross-examination (Haiku solves + validates)
  → INSERT validated=false
  → Admin queue → human approves
  → validated=true → generate embedding → live pool
```

**Invariant:** `validated=false` questions are never served. See `architecture.md` invariants.

### 7.3 Content Versioning

| Content type | Version strategy |
|--------------|------------------|
| Questions | Immutable once validated; deprecate via `validated=false`, never delete responses |
| Syllabus chunks | Version field; curriculum chain uses latest validated version |
| Topic explanations | Regenerate only on syllabus change + admin trigger |
| Board config | Semver in `curricula.board_config`; simulations reference config version |

### 7.4 Adding a New Country (Playbook)

1. Insert `curricula` row (code, country, language, `board_config`)
2. Seed `subjects` from official catalog
3. Import syllabus → `syllabus_chunks` + `topics` tree
4. Configure mark scheme templates (M1/A1/B1 or board equivalent)
5. Run batch generation per topic; human validation gate
6. Add board-specific few-shot marking examples to `packages/ai/examples/marking/`
7. Pilot with 20 students; benchmark marking agreement ≥ 92%
8. No changes to chain code — only prompts, examples, and seed data

---

## 8. Scalability & Performance

### 8.1 Scale Tiers

| Tier | Students | Primary constraint | Mitigation |
|------|----------|-------------------|------------|
| Pilot | 20–100 | AI cost | Haiku marking, question pool cache, rate limits |
| Regional | 1K–10K | DB connections, marking latency | PgBouncer, Redis warm pool, 80%+ cache hit target |
| National | 100K | AI spend, read throughput | Read replicas, batch reports, board-specific fine-tuned models |
| Continental | 1M+ | DB write throughput, latency | Shard by `student_id`, regional DB deployments, dedicated AI inference service |

Full engineering detail: `ExamEdge_Engineering_Document.md` §13.

### 8.2 Caching Strategy

| Data | Store | TTL | Rationale |
|------|-------|-----|-----------|
| Curriculum tree (subjects, topics) | Redis | 24h | Changes only on syllabus updates |
| Validated question pool per topic/difficulty | Redis | 1h | Highest read volume |
| Topic explanations | Postgres + Redis | Permanent / 6h | Generate once per topic per language |
| Dashboard mastery summary | Redis | 15min | Staleness acceptable for map display |
| Mark schemes | Redis | 1h | Fetched every submission |
| Idempotency results | Redis | 5min | Duplicate submit protection |

**Never cached:** live session state, marking results being written, appeal status.

### 8.3 Database Indexing

Required indexes for content at scale (add in migrations as volume grows):

```sql
-- Question pool selection (hot path)
CREATE INDEX idx_questions_pool ON questions (topic_id, difficulty, validated)
  WHERE validated = true;

-- Vector similarity (RAG generation)
CREATE INDEX idx_questions_embedding ON questions
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Student history exclusion
CREATE INDEX idx_responses_student_question ON student_responses
  (session_id, question_id, submitted_at DESC);

-- Mastery dashboard
CREATE INDEX idx_mastery_student ON mastery_records (student_id, mastery_level);

-- Spaced repetition cron
CREATE INDEX idx_mastery_review_due ON mastery_records (next_review)
  WHERE next_review IS NOT NULL;
```

### 8.4 AI Orchestration at Scale

| Principle | Implementation |
|-----------|----------------|
| **No AI at question delivery** | Parameter instantiation is local — O(1) per student |
| **Haiku for high-frequency** | Marking, hints L1-L2, UVE L1-L2 |
| **Sonnet for low-frequency** | Generation (batch), curriculum (cached), hints L3 |
| **Async by default** | UVE, reports, pool refresh — never block student response |
| **Idempotency** | Redis SET NX before every marking call |
| **Cost circuit breaker** | 100 AI ops/hour per user → rate limit |
| **Pool hit rate** | Target 85% (pilot) → 98% (50K+ students) — marginal AI cost → 0 |

### 8.5 Content Delivery Performance Targets

| Operation | Target (p95) |
|-----------|--------------|
| Dashboard load | < 1.5s |
| Next question (pool hit) | < 500ms |
| Marking response | < 3s |
| Topic explain (cache hit) | < 300ms |
| Topic explain (cache miss) | < 8s |
| Exam simulation start | < 2s |

### 8.6 Offline & Low-Bandwidth

- PWA app shell cached via service worker
- Next 5 study sessions pre-cached (Unit 27)
- Answers queued in IndexedDB; sync with idempotency on reconnect
- V2.0: USSD/SMS summaries via Africa's Talking for feature phones

---

## 9. Content Operations (Human in the Loop)

| Role | Responsibility |
|------|----------------|
| **Curriculum specialist** | Syllabus accuracy, topic mapping, explanation review |
| **Admin validator** | Approve/reject generated questions |
| **Appeal reviewer** | Resolve marking disputes; feed hallucination registry |
| **Teacher (V1.1)** | Class assignments, override mastery gates, view cohort gaps |

AI generates candidates; humans gate quality. This scales content without sacrificing examination fidelity.

---

## 10. Documentation Coverage

### Fully documented (before this file)

| Concern | Location |
|---------|----------|
| Curriculum-agnostic positioning | `project-overview.md`, `roadmap.md` |
| Core schema (curricula → questions) | `architecture.md` |
| Curriculum tree (4 levels) | `platform-how-it-works.md` §4 |
| Five AI chains + RAG | `AGENTS.md` |
| Question pool + validation | `build-plan.md` Units 12, 24, 29 |
| Exam simulation | `build-plan.md` Unit 25 |
| Spaced repetition cron | `architecture.md` API routes |
| Scalability tiers (summary) | `roadmap.md` |
| Caching strategy (detail) | `ExamEdge_Engineering_Document.md` §13 |
| GCE subject matrix | `ExamEdge_Volume_V_Blueprint.md` |
| Mastery gating concept | `ExamEdge_Innovation_Document.md`, Volume II |
| Cost sub-linear scaling | `ExamEdge_Cost_Optimisation_Economics.md` |

### Consolidated in this file (gaps closed)

| Gap | Now covered |
|-----|-------------|
| Full content hierarchy (subtopics, lessons, LOs) | §2 |
| Knowledge graph structure & student guidance | §3 |
| Learner modes (primary vs supplementary) | §5 |
| Pathway recommendation algorithm | §6 |
| Assessment vs practice vs simulation distinction | §4 |
| Multi-country onboarding playbook | §7.4 |
| DB indexing for content scale | §8.3 |
| V1.1+ schema promotion path | §2.3 |
| Cross-board taxonomy (V2.0) | §3.3 |
| Content operations roles | §9 |

---

## 11. Implementation Phasing

| Capability | Version | Build reference |
|------------|---------|-----------------|
| Flat topics + concept_graph JSONB | V1.0 | Unit 05 seed |
| Topic explain + syllabus chunks | V1.0 | Units 14, 20 |
| Practice + marking + hints + UVE L1-L2 | V1.0 | Units 10–18 |
| Exam simulation assembly | V1.0 | Unit 25 |
| Spaced repetition | V1.0 | Unit 30 cron |
| `learningMode` onboarding preference | V1.0 | Unit 06 register |
| Subtopics + learning_objectives tables | V1.1 | roadmap.md |
| Explicit topic check assessments | V1.1 | roadmap.md |
| Full GCE 16-subject catalog | V1.1 | Volume V Blueprint |
| Teacher dashboard + class pathways | V1.1 | roadmap.md |
| WAEC / KCSE / OBC catalogs | V2.0 | roadmap.md § Curriculum onboarding |
| shared_concepts cross-board map | V2.0 | This doc §3.3 |
| Syllabus PDF auto-chunking | V2.0 | roadmap.md |
| Regional read replicas + AI service extraction | V3.0 | Engineering doc §13 |

---

*This document is the Tier 1 canonical reference for content architecture. Update when schema, learner modes, or scale strategy changes.*
