> **Canonical positioning & roadmap:** Platform vision, pan-African scope, and release planning live in [`context/project-overview.md`](context/project-overview.md) and [`context/roadmap.md`](context/roadmap.md). This document uses Phase 1 (GCE Board Buea) examples; the architecture is curriculum-agnostic.

__EXAMEDGE__

Master Engineering &

Technical Design Document

*Architecture  |  AI Design  |  Database  |  Security  |  MVP  |  Roadmap  |  Infrastructure  |  Scaling*

__AI\-Powered Adaptive Examination Preparation & Intelligent Tutoring System__

Document Version: 1\.0

Status: Pre\-Development Specification

Date: June 2026

__Author: Ngam Vitalis Yuh__

Software Engineer  |  Yaounde, Cameroon  |  github\.com/Vitalisn4

Audience: Engineers  |  Judges  |  Investors  |  Technical Reviewers

# __1\. Project Vision and Problem Statement__

*ExamEdge is Africa's AI\-powered examination readiness and learning mastery platform\. It delivers personalised tutoring, examiner\-accurate marking, and verified understanding to every secondary school student — regardless of income, location, or access to private tutors\.*

## __1\.1 The Problem__

Two parallel crises define secondary education in Cameroon and across West Africa\. The first is a preparation gap: over 40% of students who sit GCE A\-Level Mathematics fail annually; private tutoring that addresses this costs 5,000–25,000 XAF per subject per month — unaffordable for most families outside major urban centres\. The second is an integrity gap created by AI: general\-purpose AI tools \(ChatGPT, Gemini, Claude\) give students instant answers, creating a generation of answer\-consumers who fail when those tools are unavailable in an examination room\.

ExamEdge addresses both crises with a single design philosophy: measure and develop genuine understanding, not answer production\.

## __1\.2 Core Value Propositions__

- __For students:__ GCE/BEPC/WAEC\-aligned AI tutor that teaches from first principles, generates exam\-standard questions, marks with M1/A1/B1 partial credit, and guides through errors without giving answers away\.
- __For teachers:__ Class dashboard with topic mastery analytics, at\-risk student detection, and weekly AI\-generated progress reports — all without additional marking workload\.
- __For schools:__ Measurable improvement in examination pass rates, affordable school\-tier subscription, and curriculum alignment with GCE Board Buea, OBC, and WAEC standards\.
- __For Ministries of Education:__ Anonymous aggregated analytics showing national weak topics, enabling curriculum and teaching policy adjustments based on evidence\.

## __1\.3 Design Principles \(Non\-Negotiable\)__

1. Offline\-first: every core student interaction must function without internet connectivity\.
2. Mobile\-first: primary device is a low\-end Android phone \(Android 7\+, 512MB RAM, 4\.5\-inch screen\)\.
3. Free\-tier first: MVP infrastructure cost must not exceed $20/month\.
4. AI must fail safely: every AI chain output is validated before reaching a student; no unvalidated AI output is shown\.
5. Understanding over answers: the platform is designed to make copying counterproductive, not to make it detectable\.
6. Honest about limitations: every AI\-generated mark, explanation, and recommendation carries a confidence indicator\.

# __2\. Platform Architecture__

## __2\.1 Architecture Overview__

ExamEdge is a serverless\-first, monorepo Next\.js 14 application deployed on Vercel\. The architecture follows a clear separation of concerns across five layers: Presentation, API, AI Orchestration, Data, and Infrastructure\. The monorepo pattern is chosen deliberately for a solo developer — it eliminates deployment complexity, CORS configuration, and split billing accounts while maintaining clean code organisation through folder structure\.

### __2\.1\.1 Layer definitions__

- __Layer 1 — Presentation:__ Next\.js 14 App Router\. React Server Components for data\-heavy pages \(dashboards, question display, mastery maps\)\. Client Components for interactive elements \(answer input, timers, hint triggers, equation editors\)\. KaTeX and MathQuill for mathematical notation\. PWA service worker for offline functionality\.
- __Layer 2 — API:__ Next\.js Route Handlers\. All business logic, authentication enforcement, input validation, and AI orchestration calls run server\-side\. The client never accesses the database or AI credentials directly\. Every route handler follows: authenticate → authorise → validate → execute → respond\.
- __Layer 3 — AI Orchestration:__ LangChain\.js manages five independent AI chains \(Curriculum Intelligence, Question Generation, Examiner Marking, Socratic Guidance, UVE Probe\)\. Each chain has a defined system prompt, temperature, output schema, and fallback behaviour\. Chains call the Anthropic API \(Claude claude\-sonnet\-4\-6 for reasoning\-intensive tasks, Claude Haiku for high\-frequency marking\)\.
- __Layer 4 — Data:__ Neon PostgreSQL \(primary relational data \+ pgvector embeddings\)\. Upstash Redis \(session state, rate limiting, question cache\)\. Cloudflare R2 \(audio recordings, uploaded photos, exported reports\)\. IndexedDB on\-device \(offline session cache\)\.
- __Layer 5 — Infrastructure:__ Vercel \(deployment, edge network, cron jobs\)\. GitHub Actions \(CI/CD\)\. Sentry \(error tracking\)\. Uptime Robot \(health monitoring\)\. Africa's Talking \(USSD/SMS\)\. Resend \(transactional email\)\.

## __2\.2 Request Lifecycle — Complete End\-to\-End Flow__

The following describes every step from a student submitting an answer to the mark appearing on their screen:

1. Student types or speaks answer in Client Component\. KaTeX renders mathematical notation in real time\. Client\-side Zod schema validates field length and character set\.
2. POST /api/sessions/\[sessionId\]/responses sent with: answer payload, client\-generated idempotency key \(UUID\), session JWT cookie\.
3. Next\.js middleware \(Edge Runtime, ~0ms cold start\) checks: valid JWT cookie present; rate limit not exceeded \(Upstash Redis sliding window: 100 req/min per user\)\.
4. Route Handler authenticates: Auth\.js verifies JWT signature, extracts userId and role\. If invalid: 401 returned immediately\.
5. Authorisation: Drizzle ORM queries sessions table — confirms session belongs to authenticated user\. If not: 403 returned\.
6. Idempotency check: userId \+ idempotency key checked against Redis SET \(5\-minute TTL\)\. If duplicate: cached result returned immediately, no AI call made\.
7. Mark scheme retrieval: question\_id used to fetch mark\_scheme\_json from PostgreSQL\. Redis cache checked first \(TTL: 1 hour\)\. Cache miss: database query, result cached\.
8. AI Marking Chain invoked: Claude Haiku, temperature 0\.1\. Input: question text \+ mark scheme JSON \+ student answer\. Output: MarkingResultSchema \(Zod\-validated JSON\)\. If Zod validation fails: response flagged for manual review, student notified\.
9. Confidence check: if marking\_result\.confidence < 0\.70, response queued for human review\. Student notified: 'Your response is being reviewed by a curriculum specialist\.'
10. Database transaction \(atomic\): INSERT student\_responses; UPDATE mastery\_records \(optimistic lock on version column\); UPDATE student\_sessions\.questions\_attempted\.
11. Async UVE trigger: after transaction commits, UVE Probe Chain queued as background task \(Vercel background function\)\. Generates follow\-up probe question\. Stored in student\_responses\.uve\_probes\_json\.
12. Response constructed and returned: \{ marks\_awarded, feedback\_per\_step, confidence, next\_probe\_question, mastery\_delta \}\. Total latency target: < 3 seconds\.
13. Client updates: React state updates marks display, feedback panel, and mastery map indicator\. If probe question present: probe presented after 1\-second transition delay\.

## __2\.3 Project Directory Structure__

The following folder structure is the canonical organisation for the ExamEdge codebase:

examedge/

├── app/                          \# Next\.js 14 App Router

│   ├── \(auth\)/                   \# Unauthenticated routes

│   │   ├── login/page\.tsx

│   │   ├── register/page\.tsx

│   │   └── forgot\-password/page\.tsx

│   ├── \(student\)/                \# Student\-facing routes \(role: student\)

│   │   ├── dashboard/page\.tsx    \# Mastery map, streaks, study plan

│   │   ├── study/\[topicId\]/page\.tsx  \# Learning mode

│   │   ├── practice/\[subjectId\]/page\.tsx  \# Practice mode

│   │   ├── exam/\[simulationId\]/page\.tsx    \# Exam simulation

│   │   └── progress/page\.tsx     \# Full progress history

│   ├── \(teacher\)/                \# Teacher\-facing routes \(role: teacher\)

│   │   ├── classes/page\.tsx

│   │   ├── students/\[id\]/page\.tsx

│   │   └── reports/page\.tsx

│   ├── \(admin\)/                  \# Admin routes \(role: admin\)

│   │   ├── questions/page\.tsx    \# Question validation queue

│   │   └── analytics/page\.tsx

│   └── api/                      \# Route Handlers \(backend\)

│       ├── auth/\[\.\.\.nextauth\]/route\.ts

│       ├── health/route\.ts

│       ├── sessions/\[id\]/responses/route\.ts

│       ├── questions/generate/route\.ts

│       ├── simulations/route\.ts

│       └── students/\[id\]/mastery/route\.ts

├── components/                   \# Shared React components

│   ├── ui/                       \# Design system primitives

│   ├── math/                     \# KaTeX, MathQuill wrappers

│   ├── assessment/               \# Answer input, marking display

│   └── graphs/                   \# Desmos embed, sketch canvas

├── lib/                          \# Shared utilities

│   ├── db/                       \# Drizzle ORM schemas \+ queries

│   │   ├── schema\.ts             \# All table definitions

│   │   ├── migrations/           \# SQL migration files

│   │   └── repositories/        \# Data access functions

│   ├── ai/                       \# LangChain chains

│   │   ├── chains/marking\.ts

│   │   ├── chains/guidance\.ts

│   │   ├── chains/generation\.ts

│   │   ├── chains/uve\.ts

│   │   └── chains/curriculum\.ts

│   ├── auth/                     \# Auth\.js config

│   ├── redis/                    \# Upstash client \+ rate limiter

│   ├── storage/                  \# R2 upload/download

│   └── validations/             \# Zod schemas

├── middleware\.ts                 \# Auth \+ rate limit at Edge

├── drizzle\.config\.ts

├── next\.config\.ts

└── public/                       \# Static assets \+ PWA manifest

## __2\.4 Coding Standards and Development Workflow__

- __Language:__ TypeScript strict mode throughout\. No any types\. All API inputs and outputs typed with Zod schemas that double as runtime validators\.
- __Linting:__ ESLint with Next\.js recommended config \+ custom rules: no console\.log in production code, no hardcoded secrets, no direct database access outside repository functions\.
- __Formatting:__ Prettier with single quotes, 2\-space indent, 100 character line length\. Pre\-commit hooks via Husky enforce formatting before commit\.
- __Git workflow:__ Feature branches off main\. Branch naming: feature/topic\-name, fix/bug\-description, chore/task\-name\. Pull requests required even for solo development — enforces commit message discipline and provides a review record\. Squash merge to main\.
- __Commit messages:__ Conventional Commits format: feat\(marking\): add follow\-through mark support; fix\(auth\): resolve refresh token race condition\.
- __Environment variables:__ All secrets in \.env\.local \(never committed\)\. \.env\.example maintained with placeholder values\. Vercel environment variables set through dashboard with separate values for preview and production\.

# __3\. Database Design__

## __3\.1 Database Technology Choice — PostgreSQL with pgvector__

ExamEdge requires: ACID transactions \(multiple tables must update atomically on answer submission\), referential integrity \(a question cannot be deleted while responses reference it\), complex relational queries \(find all questions for a topic the student has not seen in 14 days, weighted by difficulty\), and vector similarity search \(find the five most similar past paper questions to a given topic and difficulty\)\. PostgreSQL with the pgvector extension satisfies all four requirements in a single database instance\.

MongoDB was evaluated and rejected: ExamEdge's schema is stable and highly relational\. MongoDB's flexibility is a cost, not a benefit, for a well\-defined domain\. PlanetScale \(MySQL\) was evaluated and rejected: MySQL lacks native array types and the pgvector extension\. Supabase was evaluated and retained as an upgrade path \(bundles auth, realtime, and storage\) but Auth\.js \+ Neon was chosen for MVP to avoid vendor lock\-in\.

## __3\.2 Complete Schema__

### __3\.2\.1 Core identity tables__

\-\- Users: all platform participants

CREATE TABLE users \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  email           VARCHAR\(255\) UNIQUE NOT NULL,

  name            VARCHAR\(255\) NOT NULL,

  role            TEXT CHECK \(role IN \('student','teacher','admin'\)\) NOT NULL DEFAULT 'student',

  password\_hash   TEXT,                    \-\- NULL for OAuth users

  email\_verified  TIMESTAMPTZ,

  cognitive\_fp    JSONB,                   \-\- Cognitive Fingerprint vector

  preferences     JSONB DEFAULT '\{\}',

  created\_at      TIMESTAMPTZ DEFAULT NOW\(\),

  updated\_at      TIMESTAMPTZ DEFAULT NOW\(\)

\);

\-\- Examination boards

CREATE TABLE curricula \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  code            VARCHAR\(20\) UNIQUE NOT NULL,  \-\- e\.g\. 'GCE\_AL', 'WAEC', 'OBC\_BAC'

  name            TEXT NOT NULL,

  country         VARCHAR\(100\) NOT NULL,

  language        TEXT CHECK \(language IN \('en','fr','sw'\)\) NOT NULL DEFAULT 'en',

  board\_config    JSONB NOT NULL              \-\- grading scales, time allocations, paper formats

\);

### __3\.2\.2 Curriculum tables__

CREATE TABLE subjects \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  curriculum\_id   UUID REFERENCES curricula\(id\) ON DELETE RESTRICT,

  code            VARCHAR\(20\) NOT NULL,       \-\- e\.g\. '0765'

  name            TEXT NOT NULL,              \-\- 'Pure Mathematics With Mechanics'

  level           TEXT CHECK \(level IN \('OL','AL','BEPC','PROB','BAC','WAEC'\)\) NOT NULL,

  syllabus\_ref    TEXT,

  created\_at      TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE topics \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  subject\_id      UUID REFERENCES subjects\(id\) ON DELETE RESTRICT,

  name            TEXT NOT NULL,

  slug            TEXT NOT NULL,

  syllabus\_ref    TEXT,

  prerequisite\_ids UUID\[\] DEFAULT '\{\}',

  exam\_weight     NUMERIC\(5,2\),              \-\- % of typical paper marks for this topic

  difficulty\_band SMALLINT CHECK \(difficulty\_band BETWEEN 1 AND 3\),

  concept\_graph   JSONB,                     \-\- prerequisite concept tree

  created\_at      TIMESTAMPTZ DEFAULT NOW\(\)

\);

### __3\.2\.3 Question bank tables__

CREATE TABLE questions \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  topic\_id        UUID REFERENCES topics\(id\) ON DELETE RESTRICT,

  template\_text   TEXT NOT NULL,             \-\- parameterised LaTeX template

  param\_schema    JSONB NOT NULL,             \-\- allowed parameter ranges/sets

  mark\_scheme     JSONB NOT NULL,             \-\- step\-by\-step M1/A1/B1 schema

  probe\_library   JSONB,                     \-\- UVE probe question templates

  difficulty      SMALLINT CHECK \(difficulty BETWEEN 1 AND 5\) NOT NULL,

  marks\_total     SMALLINT NOT NULL,

  question\_type   TEXT CHECK \(question\_type IN \('structured','proof','graph','diagram','mcq'\)\) NOT NULL,

  embedding       vector\(1536\),              \-\- Voyage AI text embedding

  source          TEXT CHECK \(source IN \('ai\_generated','human\_authored','past\_paper\_inspired'\)\),

  validated       BOOLEAN DEFAULT FALSE,

  validated\_by    UUID REFERENCES users\(id\),

  validation\_notes TEXT,

  created\_at      TIMESTAMPTZ DEFAULT NOW\(\)

\);

### __3\.2\.4 Assessment tables__

CREATE TABLE student\_sessions \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  student\_id      UUID REFERENCES users\(id\) ON DELETE CASCADE,

  subject\_id      UUID REFERENCES subjects\(id\) ON DELETE RESTRICT,

  mode            TEXT CHECK \(mode IN \('learn','practice','exam','review'\)\) NOT NULL,

  status          TEXT CHECK \(status IN \('active','paused','completed','abandoned'\)\) DEFAULT 'active',

  questions\_attempted SMALLINT DEFAULT 0,

  marks\_total     SMALLINT DEFAULT 0,

  marks\_awarded   SMALLINT DEFAULT 0,

  focus\_breaks    SMALLINT DEFAULT 0,       \-\- tab\-switch events during exam mode

  started\_at      TIMESTAMPTZ DEFAULT NOW\(\),

  ended\_at        TIMESTAMPTZ,

  metadata        JSONB DEFAULT '\{\}'

\);

CREATE TABLE student\_responses \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  session\_id      UUID REFERENCES student\_sessions\(id\) ON DELETE CASCADE,

  question\_id     UUID REFERENCES questions\(id\) ON DELETE RESTRICT,

  rendered\_text   TEXT NOT NULL,             \-\- actual question shown \(params applied\)

  applied\_params  JSONB NOT NULL,            \-\- parameter values used

  answer\_text     TEXT,

  answer\_type     TEXT CHECK \(answer\_type IN \('text','image','audio','graph'\)\),

  answer\_media\_url TEXT,                    \-\- R2 URL for image/audio answers

  marks\_awarded   JSONB,                    \-\- \{step: mark\_type, awarded: bool, feedback: text\}

  ai\_confidence   NUMERIC\(4,3\),             \-\- 0\.000 to 1\.000

  manual\_review   BOOLEAN DEFAULT FALSE,

  hints\_used      SMALLINT DEFAULT 0,

  uve\_probes      JSONB,                    \-\- probe results

  mvs\_score       NUMERIC\(4,3\),             \-\- Mastery Validation Score

  time\_taken\_s    INTEGER,

  idempotency\_key UUID UNIQUE,              \-\- prevents duplicate submissions

  submitted\_at    TIMESTAMPTZ DEFAULT NOW\(\)

\);

CREATE TABLE mastery\_records \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  student\_id      UUID REFERENCES users\(id\) ON DELETE CASCADE,

  topic\_id        UUID REFERENCES topics\(id\) ON DELETE RESTRICT,

  mastery\_level   NUMERIC\(4,3\) DEFAULT 0,   \-\- 0\.000 to 1\.000 \(IRT theta estimate\)

  mvs\_history     JSONB DEFAULT '\[\]',        \-\- rolling 10\-session MVS values

  sessions\_count  INTEGER DEFAULT 0,

  accuracy\_rate   NUMERIC\(4,3\) DEFAULT 0,

  next\_review     TIMESTAMPTZ,              \-\- SM\-2 spaced repetition schedule

  ease\_factor     NUMERIC\(4,2\) DEFAULT 2\.50,

  interval\_days   SMALLINT DEFAULT 1,

  version         INTEGER DEFAULT 0,        \-\- optimistic locking

  last\_updated    TIMESTAMPTZ DEFAULT NOW\(\),

  UNIQUE\(student\_id, topic\_id\)

\);

### __3\.2\.5 Supporting tables__

CREATE TABLE teacher\_assignments \(

  id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  teacher\_id  UUID REFERENCES users\(id\) ON DELETE CASCADE,

  student\_id  UUID REFERENCES users\(id\) ON DELETE CASCADE,

  subject\_id  UUID REFERENCES subjects\(id\),

  assigned\_at TIMESTAMPTZ DEFAULT NOW\(\),

  UNIQUE\(teacher\_id, student\_id, subject\_id\)

\);

CREATE TABLE marking\_appeals \(

  id              UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  response\_id     UUID REFERENCES student\_responses\(id\),

  student\_id      UUID REFERENCES users\(id\),

  reason          TEXT NOT NULL,

  status          TEXT CHECK \(status IN \('pending','reviewing','resolved'\)\) DEFAULT 'pending',

  original\_marks  JSONB,

  revised\_marks   JSONB,

  reviewer\_id     UUID REFERENCES users\(id\),

  reviewer\_notes  TEXT,

  created\_at      TIMESTAMPTZ DEFAULT NOW\(\),

  resolved\_at     TIMESTAMPTZ

\);

CREATE TABLE audit\_log \(

  id          UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\),

  actor\_id    UUID REFERENCES users\(id\),

  action      TEXT NOT NULL,               \-\- 'marking\_override', 'role\_change', 'data\_access'

  target\_type TEXT NOT NULL,               \-\- 'student\_response', 'user', 'question'

  target\_id   UUID NOT NULL,

  old\_value   JSONB,

  new\_value   JSONB,

  ip\_addr     INET,

  created\_at  TIMESTAMPTZ DEFAULT NOW\(\)

\);

## __3\.3 Indexing Strategy__

\-\- High\-frequency query: student session lookup

CREATE INDEX idx\_sessions\_student ON student\_sessions\(student\_id, status\);

\-\- High\-frequency: mastery read for dashboard

CREATE INDEX idx\_mastery\_student ON mastery\_records\(student\_id\);

CREATE INDEX idx\_mastery\_student\_topic ON mastery\_records\(student\_id, topic\_id\);

\-\- Question pool selection: topic \+ difficulty \+ validated

CREATE INDEX idx\_q\_topic\_diff ON questions\(topic\_id, difficulty\) WHERE validated = TRUE;

\-\- Response history per session

CREATE INDEX idx\_resp\_session ON student\_responses\(session\_id, submitted\_at DESC\);

\-\- Spaced repetition scheduling: find due topics

CREATE INDEX idx\_mastery\_review ON mastery\_records\(student\_id, next\_review\);

\-\- Appeal queue

CREATE INDEX idx\_appeals\_status ON marking\_appeals\(status, created\_at\);

\-\- Audit log search

CREATE INDEX idx\_audit\_actor ON audit\_log\(actor\_id, created\_at DESC\);

\-\- Vector similarity \(approximate nearest neighbour\)

CREATE INDEX idx\_q\_embed ON questions USING ivfflat \(embedding vector\_cosine\_ops\) WITH \(lists=100\);

# __4\. AI Architecture — Training, Chains, and Reliability__

## __4\.1 AI Model Selection and Justification__

ExamEdge uses two Claude models from Anthropic, selected for their structured output fidelity and instruction\-following reliability on educational tasks:

__Model__

__Use Case Category__

__Specific Tasks__

__Selection Reasoning__

__Claude claude\-sonnet\-4\-6__

Reasoning\-intensive tasks

Question generation, UVE probes, Socratic guidance, curriculum explanations, student reports

Best structured output compliance; 200k context window fits full session history; superior instruction following on constrained tasks \(never\-reveal\-answer requirement\)

__Claude Haiku 4\.5__

High\-frequency, cost\-sensitive tasks

Examiner marking \(primary task\), simple hint level 1, confidence scoring

$0\.25/M input tokens vs $3/M for Sonnet; marking is rubric\-application, not reasoning — Haiku is sufficient; 5x cost reduction on the highest\-volume operation

## __4\.2 The Five AI Chains — Complete Specification__

### __4\.2\.1 Examiner Marking Chain__

__Model: __Claude Haiku 4\.5

__Temperature: __0\.1 — near\-deterministic; consistent marks across identical inputs

__Max tokens: __800 — sufficient for detailed per\-step feedback

__Context: __question\_text \+ mark\_scheme\_json \+ student\_answer\_text

System prompt \(abbreviated\):

You are an experienced GCE Board Buea examiner\. Mark the student's response

against the provided mark scheme\. Award marks ONLY for what is explicitly

present in the student's work\. Do not infer intent\. Do not award marks for

steps that are absent even if the student could have included them\.

Return ONLY valid JSON matching the MarkingResultSchema\. No prose\.

Output schema \(Zod\):

z\.object\(\{

  steps: z\.array\(z\.object\(\{

    step\_number: z\.number\(\)\.int\(\)\.min\(1\),

    mark\_type: z\.enum\(\['M1','A1','B1','ft','bod'\]\),

    awarded: z\.boolean\(\),

    marks\_available: z\.number\(\)\.int\(\)\.min\(1\)\.max\(5\),

    marks\_given: z\.number\(\)\.int\(\)\.min\(0\),

    feedback: z\.string\(\)\.min\(10\)\.max\(500\),

  \}\)\),

  total\_awarded: z\.number\(\)\.int\(\),

  total\_available: z\.number\(\)\.int\(\),

  confidence: z\.number\(\)\.min\(0\)\.max\(1\),

  flag\_for\_review: z\.boolean\(\),

  marking\_notes: z\.string\(\)\.max\(300\)\.optional\(\),

\}\)

### __4\.2\.2 Question Generation Chain__

__Model: __Claude claude\-sonnet\-4\-6

__Temperature: __0\.7 — creative within constraints

__RAG context: __5 most similar validated past paper questions \(pgvector cosine search\)

__Validation: __Automated cross\-examination: secondary Haiku call solves generated question; solution checked against generated mark scheme

System prompt structure:

You are a GCE Board Buea question setter for \[subject\] at \[level\]\.

Generate ONE examination question for topic: \[topic\_name\]\.

Requirements: \[difficulty\] difficulty; \[marks\] marks; match the style of the

examples provided; use contexts familiar to Cameroonian secondary students\.

CONSTRAINTS: use only contexts that do not assume equipment unavailable in

Cameroonian schools; use gender\-neutral examples; parameter ranges: \[schema\]\.

Return ONLY valid JSON matching QuestionSchema\.

### __4\.2\.3 Socratic Guidance Chain__

__Model: __Claude claude\-sonnet\-4\-6

__Temperature: __0\.5

__Critical constraint: __System prompt hardcoded: 'You MUST NOT state the correct answer, the next correct step, or any intermediate result\. You may ONLY ask one guiding question\.'

__Anti\-leakage check: __Output parsed to detect: correct numerical answers, explicit next steps, solution\-revealing phrases\. If detected: chain re\-runs with explicit leakage flag\.

### __4\.2\.4 UVE Probe Chain__

__Model: __Claude claude\-sonnet\-4\-6

__Temperature: __0\.2

__Input: __question \+ mark\_scheme \+ submitted\_answer \+ probe\_type \+ cognitive\_fingerprint

__Output: __\{ probe\_question, evaluation\_rubric, understanding\_indicators\[\], misconception\_signals\[\] \}

__Evaluation sub\-chain: __After student responds to probe: Haiku evaluates response against evaluation\_rubric → \{ understanding\_level: 0\-4, misconception\_detected: bool, mvs\_delta: float \}

### __4\.2\.5 Curriculum Intelligence Chain__

__Model: __Claude claude\-sonnet\-4\-6

__Temperature: __0\.6

__RAG source: __Official syllabus text \+ validated concept explanations corpus

__Output format: __Structured explanation: definition → worked example → common mistakes → practice pointer

__Factual grounding: __Every factual claim must be supported by a retrieved syllabus passage\. Chain instructed to refuse to state anything not in the retrieval context\.

## __4\.3 RAG Pipeline Architecture__

Retrieval\-Augmented Generation \(RAG\) is ExamEdge's primary hallucination mitigation mechanism\. Rather than relying on the LLM's training data for curriculum facts, every generation and explanation call retrieves relevant validated text before generating\.

// RAG pipeline \(simplified\)

async function ragPipeline\(query: string, topicId: string\): Promise<string\[\]> \{

  // 1\. Generate query embedding

  const queryEmbedding = await voyageAI\.embed\(query\);

  // 2\. pgvector similarity search: top 5 validated questions for topic

  const similar = await db\.select\(\)\.from\(questions\)

    \.where\(and\(

      eq\(questions\.topicId, topicId\),

      eq\(questions\.validated, true\)

    \)\)

    \.orderBy\(sql\`embedding <=> $\{queryEmbedding\}\`\) // cosine distance

    \.limit\(5\);

  // 3\. Return rendered question texts as context

  return similar\.map\(q => renderTemplate\(q\.templateText, sampleParams\(q\.paramSchema\)\)\);

\}

## __4\.4 AI Cost Management__

AI API cost is the primary scaling expense\. ExamEdge implements four cost management strategies:

- __Question caching:__ Generated and validated questions are stored in PostgreSQL permanently\. A question generated once costs one API call; served to 10,000 students over its lifetime, the amortised cost is negligible\. The question pool grows over time — API call rate does not scale linearly with user count\.
- __Model tiering:__ Haiku handles all marking operations \(the highest\-frequency AI task\)\. At $0\.25/M tokens vs $3/M for Sonnet, a marking operation costing $0\.0005 with Haiku would cost $0\.006 with Sonnet — a 12x cost difference on the highest\-volume operation\.
- __Batch inference:__ Weekly report generation, consistency test scheduling, and cognitive fingerprint updates run as batch jobs \(Vercel Cron, nightly\)\. These tasks are queued in Redis and processed off\-peak, avoiding real\-time API latency costs\.
- __Domain\-specific fine\-tuning \(Year 2\):__ At 100,000 marking operations, sufficient training data exists to fine\-tune a Mistral 7B or LLaMA 3 8B model for GCE mathematics marking\. Deployed on a $20/month GPU instance \(Railway or Modal\), this reduces marking cost to near\-zero while improving domain specificity\.

# __5\. Security Framework__

## __5\.1 Authentication Architecture__

Auth\.js v5 provides the authentication layer\. JWT\-based sessions with HTTP\-only, Secure, SameSite=Lax cookies\. The JWT contains: userId, role, email \(for display\), and emailVerified flag\. Access token lifetime: 15 minutes\. Refresh token lifetime: 7 days with rotation \(each use invalidates the current token and issues a new one\)\. Tokens stored in HTTP\-only cookies — not localStorage or sessionStorage\.

- __Password storage:__ bcrypt with work factor 12 \(~250ms per hash\)\. OWASP recommends minimum 10; 12 balances security against performance on low\-end devices\.
- __OAuth support:__ Google OAuth for students who prefer social login\. Auth\.js handles the OAuth flow; ExamEdge never sees the user's Google password\.
- __Magic links:__ Email\-based passwordless login via Resend\. Token is 32\-byte random \(crypto\.randomBytes\), SHA\-256 hashed before database storage, 15\-minute expiry\.
- __Token revocation:__ A token blocklist in Upstash Redis allows immediate invalidation of specific JWTs\. Checked on every sensitive operation\. Cost: 1\-2ms per check\.

## __5\.2 Authorisation and Row\-Level Security__

Three\-layer authorisation: application layer \(every Route Handler validates role\), database layer \(PostgreSQL Row\-Level Security policies\), and API layer \(Zod schema validation rejects malformed requests before reaching business logic\)\.

\-\- RLS: students access only their own data

ALTER TABLE student\_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY student\_own\_responses ON student\_responses

  FOR ALL USING \(

    session\_id IN \(

      SELECT id FROM student\_sessions

      WHERE student\_id = current\_setting\('app\.user\_id'\)::uuid

    \)

  \);

\-\- RLS: teachers access only assigned students

CREATE POLICY teacher\_assigned\_mastery ON mastery\_records

  FOR SELECT USING \(

    student\_id = current\_setting\('app\.user\_id'\)::uuid OR

    EXISTS \(

      SELECT 1 FROM teacher\_assignments

      WHERE teacher\_id = current\_setting\('app\.user\_id'\)::uuid

      AND student\_id = mastery\_records\.student\_id

    \)

  \);

## __5\.3 API Security__

- __Input validation:__ Zod schema validation on every Route Handler input before any business logic executes\. Invalid inputs return 400 with specific field errors — never reach the database or AI layer\.
- __SQL injection prevention:__ Drizzle ORM generates parameterised queries exclusively\. No string concatenation in SQL\. Verified by ESLint rule: no raw SQL strings in Route Handlers\.
- __XSS prevention:__ React JSX escapes all dynamic values\. KaTeX sanitises mathematical input\. Content\-Security\-Policy header restricts script execution to ExamEdge's own domain\.
- __CSRF prevention:__ Auth\.js sets SameSite=Lax on session cookies \(prevents cross\-origin POST submissions\)\. CSRF token validation on state\-changing form submissions\.
- __Rate limiting:__ Upstash Redis sliding window: 5/minute on auth endpoints \(brute force prevention\), 60/hour on AI operations \(cost abuse prevention\), 300/minute on general API\.
- __Prompt injection protection:__ Student answer text is sanitised before inclusion in AI prompts\. Known injection patterns \(ignore previous instructions, you are now, override system prompt\) are detected and stripped\. The mark scheme is passed as a structured JSON object, not embedded in the prompt text — injection into the JSON structure is prevented by schema validation\.

## __5\.4 Data Security__

- __Encryption at rest:__ Neon PostgreSQL uses AES\-256 encryption at rest\. Cloudflare R2 uses AES\-256\. Upstash Redis uses AES\-256\.
- __Encryption in transit:__ TLS 1\.3 enforced on all connections\. Vercel enforces HTTPS\. Database connections use Neon's TLS\-encrypted serverless driver\. All external API calls \(Anthropic, Africa's Talking, Resend\) use HTTPS\.
- __Secret management:__ All credentials stored as environment variables\. Never committed to Git\. Vercel's encrypted environment variable storage for production\. GitHub Secrets for CI/CD pipeline variables\.
- __Audit logging:__ All admin and teacher data access logged to audit\_log table\. Marking overrides, role changes, and consent changes logged immutably\. Logs cannot be deleted by any user including admins\.

# __6\. API Design__

## __6\.1 API Philosophy__

ExamEdge uses REST for its API\. REST was chosen over GraphQL because ExamEdge has a single primary consumer \(its own frontend\) with stable, well\-defined data requirements\. GraphQL's flexibility advantage \(client\-specified fields\) is most valuable with multiple heterogeneous external consumers\. The trade\-off: REST endpoints require explicit design for each resource; GraphQL would add schema management overhead\. For a solo developer, REST's lower operational complexity is the correct choice\.

## __6\.2 Complete Endpoint Reference__

__Method__

__Endpoint__

__Auth__

__Request Body__

__Purpose__

__GET__

  /api/health

Public

—

Health check: DB, Redis, AI API status\. Used by Uptime Robot\.

__POST__

  /api/auth/register

Public

\{ email, name, password \}

Create account\. Returns session JWT\.

__POST__

  /api/auth/login

Public

\{ email, password \}

Authenticate\. Returns JWT in HTTP\-only cookie\.

__POST__

  /api/auth/logout

Auth

—

Invalidate refresh token\. Clear cookie\.

__POST__

  /api/auth/reset\-password

Public

\{ email \}

Send reset link via Resend\.

__GET__

  /api/curricula

Auth

—

List all supported exam boards\.

__GET__

  /api/curricula/:id/subjects

Auth

—

Subjects for a board\.

__GET__

  /api/subjects/:id/topics

Auth

—

Topics with prerequisites and mastery overlay\.

__GET__

  /api/topics/:id/explain

Auth

—

AI concept explanation for topic\. Cached 24h\.

__POST__

  /api/questions/generate

Auth:student

\{ topicId, difficulty, marks \}

Generate parameterised question\. AI call\.

__GET__

  /api/questions/:id

Auth

—

Retrieve specific question \(validated only\)\.

__POST__

  /api/sessions

Auth:student

\{ subjectId, mode \}

Start study session\.

__GET__

  /api/sessions/:id

Auth:owner

—

Session state \+ question queue\.

__PATCH__

  /api/sessions/:id

Auth:owner

\{ status \}

Pause, resume, abandon session\.

__POST__

  /api/sessions/:id/responses

Auth:owner

\{ questionId, answer, type, idempotencyKey \}

Submit answer\. Triggers marking \+ UVE\.

__GET__

  /api/sessions/:id/responses

Auth:owner\+teacher

—

All responses for session with marks\.

__POST__

  /api/simulations

Auth:student

\{ subjectId, paperId \}

Assemble and start exam paper\.

__GET__

  /api/simulations/:id

Auth:owner

—

Simulation state \+ assembled paper\.

__POST__

  /api/simulations/:id/submit

Auth:owner

—

Submit completed paper\. Triggers full marking\.

__GET__

  /api/simulations/:id/report

Auth:owner\+teacher

—

Post\-exam AI examiner report\.

__GET__

  /api/students/:id/mastery

Auth:owner\+teacher

—

Full mastery map across all topics\.

__GET__

  /api/students/:id/progress

Auth:owner\+teacher

—

Progress dashboard data\.

__GET__

  /api/students/:id/study\-plan

Auth:owner

—

AI\-generated weekly study plan\.

__POST__

  /api/appeals

Auth:student

\{ responseId, reason \}

Submit marking appeal\.

__GET__

  /api/appeals/:id

Auth:owner\+admin

—

Appeal status and outcome\.

__GET__

  /api/teacher/classes

Auth:teacher

—

Classes and student list\.

__GET__

  /api/teacher/analytics

Auth:teacher

—

Class\-level topic mastery analytics\.

__GET__

  /api/admin/questions/review

Auth:admin

—

Question validation queue\.

__PATCH__

  /api/admin/questions/:id/validate

Auth:admin

\{ approved, notes \}

Approve or reject generated question\.

## __6\.3 Error Response Standard__

// All errors return this shape:

\{ "error": \{ "code": "QUESTION\_NOT\_FOUND",

             "message": "The question does not exist or is not accessible\.",

             "status": 404,

             "requestId": "req\_abc123" \} \}

Error codes are application\-level constants\. HTTP status codes follow semantic conventions: 400 validation error, 401 unauthenticated, 403 unauthorised, 404 not found, 409 conflict \(idempotency duplicate\), 422 unprocessable AI output, 429 rate limited, 500 server error\. The requestId enables correlation between client error reports and server\-side logs\.

# __7\. Minimum Viable Product \(MVP\) — Version 1\.0__

*The MVP is the smallest deployable version of ExamEdge that can demonstrate the core value proposition to a competition judge in a 10\-minute demo, produce measurable learning improvement in a 20\-student pilot, and operate at under $20/month infrastructure cost\.*

## __7\.1 MVP Feature Set__

__Feature__

__Description__

__Build Week__

__Key Constraints__

__AI Question Generator__

Generates GCE A\-Level standard questions for Pure Mathematics \(0765\), Physics \(0710\), Biology \(0730\)\. Parameterised templates with automatic mark scheme\. Validated question pool only\.

__Week 3__

10 marks/question, 5 topics per subject

__Examiner Marking Engine__

M1/A1/B1 partial credit marking for mathematics and sciences\. Per\-step feedback\. Confidence scoring\. Manual review queue for low\-confidence responses\.

__Week 4__

Haiku model; <3s response time target

__Socratic Guidance Engine__

3\-level hint chain for wrong answers\. System prompt constrained to never reveal answers\. Answer\-leakage detection on outputs\.

__Week 5__

Triggers on any answer earning <50% marks

__UVE \(Basic\)__

Variable substitution probe after every answer\. One conceptual explanation probe for mastery\-gated topics\.

__Week 5__

Post\-submission, non\-blocking

__Student Dashboard__

Topic mastery map \(red/amber/green per topic\)\. Session history\. Exam readiness score\. Understanding Depth indicator\. Study streak\.

__Week 7__

Server\-rendered, fast initial load

__Exam Simulation Mode__

Timed full\-paper simulation\. Paper assembled dynamically from validated question pool\. Post\-exam examiner report with per\-question mark breakdown\.

__Week 7__

Full\-screen mode; tab\-switch logging

__Auth and Accounts__

Email/password registration\. Auth\.js v5\. Role\-based access \(student, teacher, admin\)\. Password reset flow\.

__Week 6__

Google OAuth deferred to V1\.1

__KaTeX \+ MathQuill__

Mathematical notation rendering and WYSIWYG equation input\. All symbols required for Pure Maths 0765 paper\.

__Week 1 \(infra\)__

Installed from Day 1; used throughout

__Photo Answer Upload__

Student photographs handwritten working\. Image stored in R2\. AI vision analysis via Claude vision\. M1/A1/B1 marking applied to transcribed working\.

__Week 8__

Minimum 1MP; confidence disclosure

__Offline PWA__

Service worker caches app shell and next 5 study sessions\. IndexedDB offline answer queue\. Resume\-from\-interruption on reconnect\.

__Week 8__

Android Chrome primary target

## __7\.2 MVP Exclusions \(Explicitly Deferred\)__

- __Deferred to V1\.1:__ Mobile app \(React Native\)\. Google/Facebook OAuth\. Teacher dashboard\. Full 16\-subject coverage\. French language UI\.
- __Deferred to V2\.0:__ OBC Francophone curriculum\. WAEC/NECO integration\. Oral explanation assessment \(Whisper\)\. Advanced Cognitive Fingerprint clustering\. MathQuill diagram tools for Biology/Chemistry\.
- __Deferred to V3\.0:__ Kenya KCSE\. Fine\-tuned local marking model\. University entrance preparation layer\. Government analytics dashboard\. Developer API\.

## __7\.3 MVP Infrastructure Costs__

__Service__

__Month 1__

__Month 3__

__Month 6__

__Month 12__

Vercel \(hosting \+ deployment\)

$0

$0

$0

$20

Neon PostgreSQL \(3GB, 191 compute hrs/mo\)

$0

$0

$0

$19

Upstash Redis \(10k req/day\)

$0

$0

$0

$0

Cloudflare R2 \(10GB/mo free\)

$0

$0

$5

$15

Anthropic Claude API \(question gen \+ marking\)

$0

$15

$40

$70

Voyage AI embeddings \(200M tokens/mo free\)

$0

$0

$5

$10

Africa's Talking \(USSD/SMS, sandbox free\)

$0

$0

$5

$15

Resend \(3k emails/mo free\)

$0

$0

$0

$0

Sentry \(5k errors/mo free\)

$0

$0

$0

$0

Domain name \(examedge\.cm ~$15/yr\)

$15

$0

$0

$0

__TOTAL__

__$15__

__$15__

__$55__

__$149__

At Month 12 with approximately 2,000 active students the primary cost driver is Claude API usage\. Mitigation: 80% of marks awarded from cached questions \(zero API cost on cache hit\); Haiku model for all marking operations; batch report generation off\-peak\. Projected cost per active student at Month 12: $0\.07/month — well within a XAF 2,500/month subscription model\.

# __8\. Version Roadmap — MVP to V5__

*Every version is designed so that its additions do not require architectural changes to the preceding version\. The database schema, AI chain architecture, and API structure are designed from Day 1 to accommodate V5 without a rebuild\.*

__Version__

__Timeline__

__Scope__

__Success Criteria__

__Key Technical Additions__

__V1\.0
\(MVP\)__

10 weeks

GCE A\-Level: Maths \(0765/0766\), Physics \(0710\), Biology \(0730\)\. Web app\. Basic UVE\. Photo upload pathway\.

Competition demo\. 20\-student pilot\. Competition prize/grant application\.

Core AI chains; question pool; marking engine; basic UVE; exam simulation; PWA offline\.

__V1\.1__

Months 3\-4

Mobile app \(React Native Expo\)\. Google OAuth\. Teacher dashboard\. Maths subject expanded to all A\-Level Pure topics\.

First 5 paying schools\. 200 registered students\. Teacher NPS > 7\.

EAS Build pipeline; React Native app; teacher route group; Expo push notifications\.

__V1\.2__

Months 5\-6

Complete GCE A\-Level 8 subjects: \+ Chemistry \(0720\), Geography \(0630\), English \(0650\), Economics \(0610\)\. Oral explanation assessment \(Whisper\.cpp\)\.

500 students\. First NGO partnership\. First international grant application submitted\.

Whisper\.cpp React Native integration; 5 new subject question pools; multilingual UI prep\.

__V2\.0__

Months 7\-12

OBC Francophone: BEPC, Probatoire, Baccalauréat\. French language UI\. Advanced Cognitive Fingerprint \(k\-means clustering\)\. GCE O\-Level subjects \(5 core\)\.

2,000 students\. Dual\-curriculum\. Revenue self\-sustaining from school subs\. Seed investor meeting\.

i18n with next\-intl; French question corpora; O\-Level schema extension; CF clustering microservice\.

__V3\.0__

Year 2 \(2027\-28\)

WAEC/NECO Nigeria and Ghana\. Knowledge Consistency Testing\. Full 30\-subject coverage\. Domain\-specific fine\-tuned marking model \(Year 2 data\)\.

15,000 students\. 3\-country operation\. Series A conversations\.

WAEC curriculum import; fine\-tuned Mistral 7B on Railway GPU; knowledge consistency scheduler\.

__V4\.0__

Year 3 \(2028\-29\)

Kenya KCSE \(Kiswahili interface\)\. University entrance preparation layer\. Government analytics dashboard\. Developer API \(public question bank \+ marking engine\)\.

100,000 students\. Ministry MoU in 2 countries\. First developer ecosystem applications\.

Kiswahili NLP; university admissions database; anonymised government API; OAuth2 for developer API\.

__V5\.0__

Year 4\-5 \(2029\-31\)

Cambridge IGCSE\. African\-hosted infrastructure \(data sovereignty\)\. Community question authoring platform\. Open\-source AI marking SDK\. Continental franchise model\.

1M\+ students\. Self\-sustaining without grants\. Platform licensed to 3\+ governments\.

African cloud migration; community authoring tools; open\-source SDK; franchise management system\.

# __9\. Testing Strategy__

## __9\.1 Testing Pyramid__

ExamEdge follows a testing pyramid with four layers, each addressing a different class of failure:

- __Unit tests \(Vitest\):__ Pure functions — IRT ability estimation, SM\-2 interval calculation, parameter instantiation, Zod schema validation, mark scheme step evaluation logic\. Fast, no external dependencies\. Target: 80% coverage of lib/ directory\.
- __Integration tests \(Vitest \+ test database\):__ Route Handler tests with a real Neon test branch database\. Test: authentication enforcement, authorisation checks, database transactions, idempotency key handling\. Neon's branching feature creates an isolated test database per test run\.
- __AI chain tests \(evaluation suite\):__ 50 marking tasks with known correct outcomes per subject\. Run on every model version upgrade\. Measure: marking accuracy \(vs human\-marked ground truth\), confidence calibration, and answer\-leakage rate in Socratic chain\. Stored in tests/ai/ directory\.
- __End\-to\-end tests \(Playwright\):__ Critical user journeys: register → study session → submit answer → receive mark → complete UVE probe; exam simulation → submit paper → view report\. Run on Vercel preview deployments before merge to main\.

## __9\.2 CI/CD Pipeline__

\# \.github/workflows/main\.yml \(abbreviated\)

on: \[push, pull\_request\]

jobs:

  test:

    \- run: npm run lint

    \- run: npm run type\-check

    \- run: npm run test:unit

    \- run: npm run test:integration  \# uses Neon test branch

  deploy\-preview:

    needs: test

    \- uses: vercel/deploy\-action  \# deploys to preview URL

    \- run: npm run test:e2e \-\- \-\-base\-url $PREVIEW\_URL

  deploy\-production:

    needs: \[test, deploy\-preview\]

    if: github\.ref == 'refs/heads/main'

    \- uses: vercel/deploy\-action \-\-prod

Every pull request \(even solo developer PRs — for discipline and audit trail\) must pass all three test stages before merge\. Production deployments require passing end\-to\-end tests on the preview URL\.

# __10\. Monitoring, Observability, and Incident Response__

## __10\.1 Observability Stack__

- __Sentry \(free tier\):__ All unhandled exceptions captured with full context: user ID, session ID, route, request body shape, breadcrumb trail\. Alert triggers: error rate spike >1% of requests; new error type; AI chain failure rate >5%\.
- __Uptime Robot \(free\):__ HTTP checks every 5 minutes: /api/health endpoint \(tests DB, Redis, AI API reachability\)\. Alert via email on failure\. Targets: 99\.5% uptime\.
- __Vercel Analytics \(free\):__ Page load times, API route latencies, geographic distribution of traffic\. Identifies slow routes before users report them\.
- __Plausible \(self\-hosted\):__ Privacy\-first event tracking: session\_started, question\_attempted, hint\_used, exam\_simulation\_completed, appeal\_submitted, offline\_session\_detected\. Powers product analytics without GDPR complexity\.
- __Structured application logs:__ Every AI chain call logged to stdout: model, chain\_type, input\_tokens, output\_tokens, latency\_ms, confidence, schema\_valid\. Vercel captures to log aggregation\. Weekly cost analysis: actual API spend vs budgeted\.

## __10\.2 /api/health Specification__

GET /api/health

Response \(200 — healthy\):

\{ "status": "healthy",

  "timestamp": "2026\-06\-25T10:00:00Z",

  "version": "1\.0\.0",

  "checks": \{

    "database": \{ "status": "ok", "latency\_ms": 14 \},

    "redis":    \{ "status": "ok", "latency\_ms": 3 \},

    "ai\_api":   \{ "status": "ok", "latency\_ms": 380 \},

    "storage":  \{ "status": "ok", "latency\_ms": 45 \}

  \}

\}

## __10\.3 Incident Response Runbook__

The following runbook defines the response procedure for the four most likely production incidents:

### __Incident 1: AI marking returns wrong marks at scale__

1. __Detect:__ Sentry alert on marking chain error rate >5%; or spike in marking appeals; or teacher reports via feedback channel\.
2. __Contain:__ Feature flag disables AI marking for affected subject\. Manual review queue absorbs all new submissions\. Students notified: 'Marking for \[subject\] is being reviewed by curriculum specialists\.'
3. __Investigate:__ Query audit\_log for all marking events in past 2 hours where confidence < 0\.8\. Check Hallucination Registry for pattern match\. Check if model version was updated recently \(AI model change log\)\.
4. __Remediate:__ Identify prompt template change or model version change that caused regression\. Rollback prompt to previous version \(templates are version\-controlled in Git\)\. Re\-run affected marking operations with corrected prompt\.
5. __Post\-mortem:__ Document in Hallucination Registry\. Update bias regression test suite\. Notify affected students of corrected marks\.

### __Incident 2: Database connectivity failure__

1. __Detect:__ Uptime Robot alert; Sentry NeonError exceptions; /api/health returning 503\.
2. __Contain:__ Neon automatic failover to standby replica \(~30 seconds RTO\)\. During failover: API routes return 503 with user\-friendly message\. Student sessions cached in Redis survive the outage\.
3. __Data protection:__ Neon continuous WAL archiving to S3\. Point\-in\-time recovery to any second in the last 7 days\. Weekly pg\_dump backup to Cloudflare R2 \(run by Vercel Cron, Sunday 02:00 WAT\)\.
4. __Recovery:__ Verify all transactions from outage period committed correctly\. Check student\_responses for any orphaned records \(transaction started but not completed during failover\)\.

# __11\. Data Governance and Privacy__

## __11\.1 Data Classification and Retention__

__Tier__

__Data Type__

__Protection__

__Retention__

__Access Rules__

__T1 — Identity PII__

Email, name, profile photo

AES\-256 at rest, TLS 1\.3 in transit

30 days post\-account closure

Never logged; never in analytics; deleted on erasure request

__T2 — Academic data__

Responses, marks, mastery, cognitive fingerprint

AES\-256 at rest; RLS enforced

3 years \(full secondary cycle\)

Student \+ assigned teacher \+ admin only; access logged

__T3 — Session metadata__

Timestamps, duration, device, IP \(truncated after 24h\)

AES\-256 at rest

12 months

IP addresses truncated to /24 prefix after 24h; no full IP retained

__T4 — Operational__

Question bank, curriculum, system logs

Standard encryption

Question bank: indefinite; logs: 90 days

Anonymised before storage; no PII in logs

__T5 — Aggregated analytics__

Pass rate trends, difficulty calibration

Anonymised, non\-re\-identifiable

Indefinite

No individual student identifiable; used for product improvement

## __11\.2 Consent Architecture__

Five distinct consent items are presented at registration, each with separate opt\-in/opt\-out:

1. Essential data processing \(required — disclosed as condition of service, not checkbox\)\.
2. AI\-powered personalisation \(required for full functionality — checkbox with plain\-English explanation\)\.
3. Teacher access \(optional — checkbox specifying exactly what teacher can see\)\.
4. Product improvement via anonymised data \(optional — default unchecked\)\.
5. Email communications \(optional — default unchecked\)\.

Students under 18 require parental consent for items 3, 4, and 5 via guardian email verification\. All consent changes are logged immutably in the audit\_log table with timestamp and previous/new state\.

## __11\.3 Third\-Party Processor Register__

Anthropic \(Claude API\): zero\-data\-retention option selected — student responses are not stored or used to train future models\. Disclosed in privacy policy and consent interface\. Neon \(PostgreSQL\): SOC 2 Type II, EU\-West region, AES\-256 at rest\. Cloudflare \(R2 \+ CDN\): GDPR\-compliant, EU data residency for R2\. Upstash \(Redis\): EU region, AES\-256 at rest\. Vercel: SOC 2 Type II, application code only — no student data stored beyond anonymised 30\-day logs\. Resend: GDPR\-compliant transactional email only\. Africa's Talking: data processing agreement in place, phone numbers not retained beyond 30 days\.

# __12\. Responsible AI — Hallucination, Bias, and Ethical Framework__

## __12\.1 Hallucination Management Architecture__

Four mechanisms work in combination to prevent hallucinated content from reaching students:

- __Structural grounding \(RAG\):__ Every question generation and curriculum explanation call retrieves validated past paper questions or syllabus text before generating\. The LLM explains retrieved content; it does not invent curriculum facts\.
- __Schema\-constrained output:__ All AI chain outputs are validated with Zod schemas before use\. A marking result that does not conform \(e\.g\. marks\_given > marks\_available, invalid mark\_type\) is rejected and queued for review\.
- __Cross\-examination validation:__ For question generation, a secondary Haiku call independently solves the generated question and checks the solution against the mark scheme\. Inconsistencies flag the question for human review before it enters the validated pool\.
- __Confidence disclosure:__ Every AI\-generated mark carries a confidence score visible to the student\. Below 0\.70: human review triggered automatically\. Below 0\.85: confidence indicator shown to student with appeal invitation\.

## __12\.2 Bias Mitigation__

Five categories of bias are actively monitored and mitigated:

- __Language register bias:__ System prompts explicitly instruct the marking chain to accept all grammatical conventions of African English\. Bias test suite: 50 question pairs with Standard British English and African English register\-equivalent answers\. Run on every model upgrade\.
- __Socioeconomic context bias:__ Question generation prompts instruct use of contexts familiar to Cameroonian and West African secondary students\. Question pool reviewed quarterly for geographic and socioeconomic representativeness\.
- __Gender bias:__ Gender\-neutral contexts and names in all questions\. Question pool analysed quarterly for gender\-coded activity distribution\.
- __Historical bias in past paper data:__ Past papers pre\-2011 are de\-weighted in RAG retrieval\. Papers over 15 years old are retained for reference but filtered from generation context\.
- __Cognitive style bias:__ IRT adaptive engine accounts for question presentation type \(procedural vs conceptual vs contextual\) in ability estimation\.

## __12\.3 Ethical AI Principles__

ExamEdge adopts seven principles aligned with the UNESCO Recommendation on the Ethics of AI \(2021\):

1. Human agency: every AI mark can be challenged; teachers retain authority over grade recommendations\.
2. Robustness and safety: AI chains fail safely \(flagged for review\) rather than silently\.
3. Privacy: Section 11 implements GDPR\-aligned privacy architecture\.
4. Transparency: marking methodology published; every mark includes a justification; confidence scores disclosed\.
5. Non\-discrimination and fairness: Section 12\.2 bias framework; differential outcome monitoring\.
6. Societal wellbeing: platform mission is educational equity; no commercial profiling of students\.
7. Accountability: Section 12\.4 accountability matrix assigns specific responsibility for every AI decision type\.

## __12\.4 Child Safety Design__

- __No commercial profiling:__ Student academic data serves one purpose: improving examination readiness\. Never used for advertising or data brokerage\.
- __No dark patterns:__ Engagement design \(Section 21 of Volume II\) explicitly avoids anxiety\-inducing streak mechanics, social pressure notifications, and variable reward schedules\.
- __Psychologically safe feedback:__ All student\-facing AI chains include: 'Your feedback must be supportive and educational\. Never express frustration or personal judgement about the student's answer\.'
- __Free right to human explanation:__ Any student who receives an AI\-generated assessment and wants a human explanation has the right to request one, free of charge, within 48 hours\.

# __13\. Scalability Architecture__

## __13\.1 Bottleneck Analysis by Scale Tier__

__Scale__

__Primary Bottleneck__

__Mitigation__

__Implementation Notes__

__100\-1,000 users__

AI API rate limits \(1,000 req/min default\); Neon free tier compute hours

Upgrade to Anthropic standard tier; upgrade Neon to Pro \($19/mo\)

No code changes required\. Infrastructure upgrade only\.

__1,000\-10,000 users__

Database connection exhaustion \(serverless functions open new connections\); Claude API throughput

PgBouncer connection pooling \(Neon built\-in\); question cache hit rate optimisation \(target 80%\+\)

Connection pool configuration; Redis cache TTL tuning\.

__10,000\-100,000 users__

Next\.js serverless function cold starts on high\-traffic routes; AI inference latency becomes user\-noticeable

Vercel Edge Runtime for high\-frequency routes; extract AI inference to dedicated FastAPI service on Railway

AI service extraction — significant architectural change\. Plan for V3\.0\.

__100,000\-1M users__

Database read throughput; single\-region latency for African users; AI fine\-tuned model cost

Neon read replicas for dashboards/analytics; Cloudflare CDN for static assets; domain\-specific fine\-tuned model \(replace Haiku\)

Database read replica routing; fine\-tuned model deployment\. Both planned for V3\.0\.

__1M\+ users__

PostgreSQL single\-instance limits; multi\-country data residency requirements; monorepo becomes harder to maintain

Database sharding by student\_id hash; regional database deployments; service extraction to microservices

Major architecture evolution\. Plan for V5\.0\. Design decisions made now should not block this\.

## __13\.2 Caching Strategy__

- __Curriculum and topic data \(Redis, TTL 24h\):__ Changes only on syllabus updates\. Every student request for subject structure hits cache, not database\.
- __Validated question pool per topic/difficulty \(Redis, TTL 1h\):__ Most\-read data in the system\. 80% cache hit rate target at scale reduces database load proportionally\.
- __AI\-generated concept explanations \(Redis, TTL 6h\):__ Generated once per topic per language\. At 200 topics × 2 languages = 400 cached explanations — negligible storage\.
- __Student mastery summary for dashboard \(Redis, TTL 15min\):__ Updated on session completion\. 15\-minute staleness acceptable for dashboard display\.
- __Never cached:__ Student responses, marking results, active session state, and appeal status — must always reflect current database state\.

## __13\.3 Database Connection Strategy__

Neon's serverless driver uses HTTP\-based connection management — each request opens and closes a connection without maintaining a persistent pool in the application layer\. This is optimal for Vercel serverless functions \(which cannot maintain persistent connections between invocations\) but can exhaust PostgreSQL connection limits at scale\. Mitigation: Neon's PgBouncer proxy \(enabled in Neon dashboard\) pools connections at the infrastructure layer, presenting a single persistent pool to PostgreSQL while allowing thousands of concurrent serverless requests\.

# __14\. Technology Integration Map — How Everything Connects__

The following describes how each technology in the stack connects to the others, and why the integration points are designed as they are:

### __Next\.js ↔ Neon PostgreSQL \(via Drizzle ORM\)__

Drizzle ORM generates TypeScript types from the PostgreSQL schema, ensuring compile\-time type safety for all database queries\. The Neon serverless driver \(@neondatabase/serverless\) sends queries over HTTP rather than TCP, enabling use from Vercel Edge Runtime where persistent TCP connections are not supported\. Migration files are plain SQL stored in lib/db/migrations/ and applied with drizzle\-kit — readable and version\-controlled without ORM\-specific migration formats\.

### __Next\.js ↔ Auth\.js__

Auth\.js is configured in lib/auth/config\.ts and exposed via the Next\.js catch\-all route /api/auth/\[\.\.\.nextauth\]\. Middleware\.ts runs on Edge Runtime and reads the session JWT from the request cookie on every request before it reaches any Route Handler — authentication check adds approximately 0ms latency \(no database round\-trip\)\. The user's ID and role are extracted from the JWT and set as request context for downstream use\.

### __Route Handlers ↔ Upstash Redis__

Upstash's @upstash/redis client uses HTTP fetch internally, compatible with Vercel Edge Runtime\. Rate limiting uses @upstash/ratelimit with sliding window algorithm\. Question caching uses standard GET/SET with TTL\. Idempotency key checking uses SET NX \(set if not exists\) — atomic operation preventing race conditions in duplicate request handling\.

### __AI Chains ↔ LangChain\.js ↔ Anthropic API__

LangChain\.js @langchain/anthropic provides the ChatAnthropic class wrapping the Anthropic API\. Each chain is defined as a RunnableSequence: prompt template → model call → output parser \(Zod schema validation\)\. The structured output parser uses Anthropic's tool\_use feature to enforce JSON schema compliance at the model level, not just post\-processing\. Temperature, max\_tokens, and system prompt are set per\-chain in the chain definition, not at runtime — ensuring consistent behaviour regardless of calling context\.

### __AI Chains ↔ pgvector \(RAG\)__

Question generation chains call the RAG pipeline before the model\. The pipeline: \(1\) generates a query embedding via Voyage AI API \(text\-embedding\-3 model, 1536 dimensions\), \(2\) queries the questions table with pgvector cosine distance operator <=> ordered by similarity, \(3\) filters WHERE validated = TRUE AND topic\_id = :topicId, \(4\) returns top 5 question texts as context strings\. The embedding is generated at query time — not cached — because query specificity matters for retrieval quality\.

### __React Native ↔ Whisper\.cpp \(V1\.2 — oral assessment\)__

expo\-av records audio on the device\. The recording is saved as a WAV file\. Whisper\.cpp runs on\-device using a quantized 'base' model \(approximately 150MB, downloaded once on first oral assessment initiation\)\. The transcription runs entirely offline — no audio is sent to a server\. The transcribed text is then submitted to the UVE Probe evaluation chain via the API in the same flow as typed answers\.

### __Cloudflare R2 ↔ Photo Upload Pathway__

Student photos of handwritten work are uploaded from the mobile app directly to Cloudflare R2 using a presigned URL generated by the Route Handler\. The Route Handler generates the presigned URL \(valid for 5 minutes\) and returns it to the client\. The client uploads directly to R2 — the photo never transits through Vercel, avoiding Vercel's 4\.5MB request body limit and reducing response latency\. After upload, the R2 object URL is stored in student\_responses\.answer\_media\_url and passed to the AI vision chain\.

### __Vercel Cron ↔ Background Jobs__

Vercel Cron triggers four nightly background functions: \(1\) spaced\_repetition\_scheduler — updates next\_review dates in mastery\_records using SM\-2 algorithm for all active students; \(2\) weekly\_report\_generator — runs every Sunday at 06:00 WAT, generates AI reports for all students with sessions in the past 7 days, queues emails via Resend; \(3\) question\_pool\_refresh — checks if any topic's validated question pool has fallen below the minimum threshold \(50 questions per difficulty level\), triggers generation if so; \(4\) consistency\_test\_scheduler — identifies mastery records where next\_review has passed and MVS was previously >0\.75, flags them for consistency testing in the student's next session\.

# __15\. Development Constraints and Risk Mitigation__

## __15\.1 Known Constraints__

- __Solo developer:__ Every architectural decision prioritises developer velocity over theoretical optimality\. The monorepo, the free\-tier stack, the 10\-week MVP scope, and the deferred features list are all consequences of this constraint\. The correct response is not to pretend the constraint does not exist but to design around it intelligently\.
- __No GPU compute:__ Fine\-tuned local models require GPU\. All AI inference at MVP stage uses Anthropic's managed API\. Domain\-specific fine\-tuning is a Year 2 goal contingent on funding\. The architecture supports model swapping — fine\-tuning does not require code changes\.
- __Curriculum data acquisition:__ The quality of the question bank depends entirely on the quality of the past papers and mark schemes collected\. This is a human problem, not a technical one\. The 76\-118 hours of pre\-development data collection work is the highest\-risk item in the project\.
- __AI marking accuracy for humanities:__ Mathematics and sciences can be marked to high accuracy with structured rubric\-based schemas\. English Literature, History, and Philosophy essays require holistic judgment that current LLMs cannot replicate with the consistency of an experienced examiner\. These subjects are in Phase 2 with explicitly disclosed accuracy limitations and a lower confidence threshold that routes more responses to human review\.

## __15\.2 Risk Register__

__Risk__

__Impact__

__Likelihood__

__Residual Risk__

__Mitigation__

__AI marking inaccuracy__

__Critical__

High

Medium

Rubric\-schema grounding; Zod validation; confidence threshold routing; student appeal mechanism; monthly accuracy audit\.

__Past paper copyright__

__High__

Medium

Low

Generate inspired\-by questions, not reproductions\. Proactive GCE Board MoU letter before launch\.

__Solo founder burnout__

__High__

Medium

High

Strict MVP scope enforcement\. No feature additions until pilot data collected\. Post\-competition co\-founder search\.

__Low Africa's Talking approval time__

__Medium__

Low

High

Begin Africa's Talking business account application in Week 2 of build\. USSD is nice\-to\-have for MVP; SMS is sufficient\.

__Claude API pricing changes__

__Medium__

Medium

Medium

Anthropic API cost represents ~30% of total infrastructure cost\. Model tiering to Haiku reduces exposure\. Local fine\-tuned model in Year 2 eliminates dependency\.

__Student AI cheating__

__Medium__

High

High

UVE post\-submission verification makes cheating pedagogically counterproductive\. Position: we welcome external AI assistance as a diagnostic tool\.

__GCE Board objection__

__Medium__

Low

Low

Generate new questions \(not reproductions\)\. Approach Board proactively with MoU offer\. Frame ExamEdge as supplementary tool, not competitor\.

__Neon service outage__

__Low__

Medium

Low

Neon provides automatic failover \(~30s RTO\)\. pg\_dump weekly backup to R2\. Session state cached in Redis survives short outages\.

# __16\. Long\-Term Sustainability and Social Impact Vision__

## __16\.1 Commercial Sustainability__

ExamEdge's commercial model is designed to reach sustainability before it requires grant dependency\. The path: \(1\) competition prize/early grants fund the MVP build; \(2\) school subscription revenue \($25\-60/month per school\) provides the first sustainable revenue from Month 6; \(3\) individual student subscriptions \(XAF 2,500\-4,500/month\) provide scale revenue from Year 2; \(4\) NGO and diaspora sponsorship programmes ensure the lowest\-income students are never excluded\.

Revenue self\-sustainability projection: at 200 paying students and 10 school contracts, monthly revenue of approximately XAF 1\.8M \($2,970\) exceeds monthly infrastructure cost of $184 by a factor of 16\. Operational sustainability does not require a large user base — it requires a small, committed school partner network\.

## __16\.2 Social Impact Metrics__

ExamEdge tracks and publicly reports three primary impact metrics:

- __Examination outcome improvement:__ Pre/post comparison of GCE pass rates for schools using ExamEdge vs matched comparison schools\. Target: 10\+ percentage point improvement in pass rate for schools with >6 months of use\.
- __Equity gap reduction:__ Comparison of platform usage and outcome improvement between urban \(Yaounde, Douala\) and rural \(Adamawa, North West\) students\. Target: <10% performance gap between urban and rural users of the same subject and level\.
- __Access expansion:__ Number of students from the bottom income quintile with full\-access accounts \(via sponsored access programme\)\. Target: 30% of active users on sponsored access by Year 2\.

## __16\.3 The Final Statement__

*ExamEdge is built to solve a problem the developer understands personally — what it means to prepare for national examinations in Africa without adequate support, starting with GCE in Cameroon\. The platform's technical architecture, its pricing model, its offline\-first design, its rural accessibility provisions, and its commitment to never excluding a student on the basis of inability to pay are all expressions of that understanding — and of a broader mission to serve secondary students across the continent through multiple curricula and examination systems\. The vision is not a billion\-dollar exit\. It is the student in Garoua with a basic Android phone and no qualified mathematics teacher who, because of ExamEdge, passes their national examination \(beginning with GCE A\-Level Pure Mathematics in the pilot\) and gains entry to university\. That outcome is the metric that matters\.*

Document ends\. Version 1\.0\. June 2026\. Prepared by Ngam Vitalis Yuh, Yaounde, Cameroon\.

