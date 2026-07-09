# Strategic Charter — ExamEdge

**Authoritative single source of truth for platform identity:** vision, mission, core values, strategic goals, problem statement, target users, expected impact, and directional evolution.

**Read this document first** if you are new to the project — engineer, product manager, designer, investor, educator, or partner.

| If you need…                    | Go to…                                |
| ------------------------------- | ------------------------------------- |
| MVP features, pages, user flows | `project-overview.md`                 |
| Release timeline V1.0 → V3.0    | `roadmap.md`                          |
| How to build (31 units)         | `build-plan.md`                       |
| System architecture             | `architecture.md`                     |
| Full documentation index        | `documentation-map.md`                |
| Completeness audit              | `documentation-completeness-audit.md` |

**Last updated:** June 2026 | **Owner:** Project founder | **Status:** Pre-implementation (Phase 0)

---

## 1. What ExamEdge Is

ExamEdge is an **Adaptive Examination Preparation and Intelligent Tutoring System (AEP-ITS)** — an AI-powered examination preparation and personalized learning platform for secondary school students **across Africa**, beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to support multiple curricula and national examination systems across the continent.

It gives every student access to a personalised **AI examiner, tutor, and curriculum expert**: parameterised exam-standard questions, board-accurate partial-credit marking (profile-driven: M/A for CGCE maths), Socratic hints that never give answers away, understanding verification probes, and long-term mastery tracking.

**It does not answer questions on demand. It develops the capacity to answer them.**

**Tagline:** _Master Every Subject. Ace Every Examination._

**Mission line:** _Learn deeply. Prepare confidently. Any exam. Any country._

**Launch configuration (Phase 1):** GCE Board Buea, Cameroon, English, three subjects (Pure Maths, Physics, Biology), Web PWA.  
**Platform capability:** Curriculum-agnostic — boards, countries, languages, and syllabi are data layers, not architectural assumptions.

---

## 2. Vision (Where We Are Going)

**Long-term vision:** Every secondary student in Africa — regardless of income, location, or access to private tutors — has access to examiner-accurate, understanding-verified preparation that develops **deep mastery**, **critical thinking**, and **global competitiveness**, not answer consumption.

**10-year horizon:**

- **Millions of students** across Anglophone and Francophone Africa preparing for national examinations through one shared platform engine
- **Board-faithful** preparation for GCE, WAEC, NECO, KCSE, OBC, BEPC, and future boards — without rebuilding the product
- **Verified understanding** as the standard — students who excel locally and can compete for scholarships, olympiads, and university places globally
- **Sustainable economics** — quality preparation at a fraction of private tutoring cost, viable without perpetual grant dependency
- **Beyond exams** — university readiness, career exploration, and opportunity pathways for A-Level graduates (V2.0+)

**Vision beyond examination halls:** ExamEdge aims to develop **capable, confident, globally competitive young Africans** who transform their own futures and contribute meaningfully to society — starting with examination excellence as the foundation.

Detail: `student-journey.md` §7 · `ExamEdge_Innovation_Document.md` (Tier 3)

---

## 3. Mission (Why We Exist)

**Mission:** Make quality, examiner-accurate examination preparation accessible to every secondary student in Africa — regardless of income, location, or access to private tutors.

**Starting in Cameroon** (GCE Board Buea pilot), expanding board-by-board and country-by-country through content and configuration — not platform rewrites.

**How we fulfil the mission:**

1. Deliver **board-accurate marking** and feedback at scale via AI — previously available only through expensive private tutors
2. **Verify understanding**, not just correct answers — so students succeed in exam halls without external AI tools
3. Design **offline-first, mobile-first** for African connectivity and device realities
4. Keep preparation **affordable** through sub-linear AI economics and free-tier infrastructure
5. **Human-gate** all AI-generated content — quality over speed

---

## 4. Core Values

These values govern product, engineering, and partnership decisions. When in doubt, refer here.

| Value                          | Meaning                                                                      | In practice                                                   |
| ------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Understanding over answers** | Learning requires productive struggle; instant answers harm exam performance | No homework solver; Socratic hints; UVE verification          |
| **Access & equity**            | Quality prep is a right, not a luxury                                        | Free-tier infra; sponsor models; low-bandwidth design         |
| **Honesty & transparency**     | Trust with minors and parents requires truth                                 | Confidence scores; appeal paths; documented AI limits         |
| **Educational integrity**      | We verify understanding, not surveil or punish                               | UVE over plagiarism policing; honest about screenshot limits  |
| **African-first design**       | Built for low-end phones, intermittent connectivity, local exam boards       | PWA offline, 360px, GCE/WAEC-native — not US-edtech ported    |
| **Safety for minors**          | Students are children; data is sacred                                        | Minimal PII, no names in AI prompts, consent flows            |
| **Human in the loop**          | AI generates; humans validate                                                | Admin validation gate; specialist review; appeals             |
| **Sustainability**             | Impact must outlive grants                                                   | Haiku-first routing, content reuse, router-based cost control |
| **Ethical engagement**         | Motivate through competence, not manipulation                                | Mastery maps yes; guilt leaderboards no                       |

**Non-negotiable design principles** (engineering expression of values): `project-overview.md` § Design Principles · `AGENTS.md` guardrails

---

## 5. Strategic Goals

### 5.1 Goal Hierarchy

```
Impact goals          →  Students learn deeply and pass exams with verified understanding
Product goals         →  Full mastery loop works end-to-end per board
Platform goals        →  Curriculum-agnostic engine serves multiple countries
Sustainability goals  →  Unit economics viable at scale
```

### 5.2 Phased Goals

| Horizon                   | Goals                                                        | Success indicators                                                     |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Now (V1.0 MVP)**        | 20-student pilot; competition demo; core loop shipped        | Demo script; ≥15% mastery delta; marking ≥92% agreement                |
| **Year 1 (Cameroon)**     | Full GCE catalog; 1,000+ active students; teacher pilot      | Retention; exam sim completion; school partnership                     |
| **Year 2–3 (Regional)**   | WAEC, KCSE, OBC live; mobile app; French UI                  | Multi-board marking benchmarks; cost <$0.10/student/mo AI              |
| **Year 5+ (Continental)** | 1M+ students; Graduate Success module; ministry partnerships | Impact studies; scholarship placement stories; self-sustaining revenue |

### 5.3 MVP Success Criteria (Measurable)

From `project-overview.md` — the contract for V1.0 completion:

- 10-minute competition demo without errors
- 20-student pilot: measurable topic mastery improvement over 4 weeks
- Marking ≥92% agreement with human ground truth
- Zero Socratic hint answer-leakage violations
- Question generation cross-examination ≥95%
- Core study flow offline-capable
- Marking latency < 3s (p95)
- Registration to first practice session < 5 minutes

---

## 6. The Problem We Solve

Two parallel crises define secondary education across Africa:

### 6.1 Preparation Gap

High national examination failure rates. Private tutoring at **5,000–25,000 XAF/month per subject** in Cameroon — unaffordable for most families. Similar patterns in Lagos, Accra, Nairobi, and beyond. Quality examiner-accurate feedback is scarce outside major cities.

### 6.2 Integrity Gap

General-purpose AI (ChatGPT, Gemini, Claude) gives **instant full answers**, creating answer-consumers who fail when those tools are unavailable in examination halls. Learning science is clear: productive struggle builds durable recall; instant answers build recognition without recall.

### 6.3 Our Response

One design philosophy: **measure and develop genuine understanding, not answer production.**

We do not try to block ChatGPT. We make it **irrelevant to examination success** through verification, parameterised questions, and board-faithful practice.

---

## 7. Target Users

**Primary:** Secondary school students preparing for national examinations.

**Phase 1 pilot profile:**

- GCE O-Level or A-Level, GCE Board Buea, Cameroon
- Low-end Android phone (Android 7+, 512MB RAM, 4.5" screen)
- Intermittent internet; needs offline-capable study
- Cannot afford private tutoring at local rates
- Needs examiner-accurate feedback — not instant answers

**Secondary (V1.1+):** Teachers (class analytics, assignments), parents (read-only progress), administrators (content validation), curriculum specialists (QA).

**Future:** A-Level graduates exploring university and global opportunities via Graduate Success module (V2.0+).

Detail: `student-journey.md` · `content-architecture.md` §5 (learner modes)

---

## 8. Expected Impact

### 8.1 Educational Impact

| Outcome                        | Mechanism                                            | Measurement                      |
| ------------------------------ | ---------------------------------------------------- | -------------------------------- |
| Improved examination readiness | Exam simulation + mastery tracking                   | Readiness score; mock exam delta |
| Genuine understanding          | UVE probes + board-faithful marking                  | MVS; UVE pass rate               |
| Reduced tutoring inequality    | Affordable AI examiner at scale                      | Cost per student vs tutor fees   |
| Metacognition & study habits   | Focus sessions, spaced repetition, honest reflection | Focus analytics; retention       |

### 8.2 Social Impact

- **Access:** Quality prep for students in Bamenda, Buea, rural areas — not only Yaoundé/Douala
- **Scale path:** Year 1 ~50K addressable (Cameroon GCE/BEPC); Year 5 vision 10M+ secondary students across Africa
- **Global competitiveness:** Deep mastery + digital literacy + critical thinking → scholarships, olympiads, university success (`student-journey.md` §7)

### 8.3 Impact Evidence (Pilot Protocol)

4-week paired study: baseline vs post simulation, topic theta improvement, student self-efficacy survey. Detail: `learning-impact.md` §3.3.

---

## 9. What We Refuse to Do

Product constraints that express our values — not limitations:

- Give the correct answer on first request
- Provide full worked solutions before productive struggle
- Accept a correct answer as mastery without UVE verification
- Generate questions in real-time during student sessions (pool is pre-validated)
- Claim to prevent all cheating (screenshots, second devices)
- Lock architecture to one country or board
- Use manipulative gamification (guilt streaks, public shame leaderboards)

---

## 10. Strategic Direction & Evolution

### 10.1 Platform Evolution (Summary)

| Version   | Theme            | Key additions                                                                      |
| --------- | ---------------- | ---------------------------------------------------------------------------------- |
| **V1.0**  | Prove the loop   | Auth, practice, marking, hints, UVE L1-L2, exam sim, offline PWA, admin validation |
| **V1.1**  | Scale within GCE | Mobile app, teachers, French UI, full GCE subjects, RLS, UVE L3-L4                 |
| **V2.0**  | Multi-country    | WAEC, KCSE, OBC; Graduate Success hub; USSD; syllabus auto-chunking                |
| **V3.0**  | Platform scale   | Local AI models, ministry analytics, multi-tenant schools, regional edge           |
| **V4.0+** | Ecosystem        | Mentors, peer learning, career API, research partnerships                          |

**Full timeline:** `roadmap.md`

### 10.2 Architectural Direction (Locked)

These decisions do **not** change per release — only content and config grow:

- Five independent AI chains (marking, guidance, generation, UVE, curriculum) — orchestrated in routes, never monolithic agent
- Curriculum-agnostic schema: `curricula` → `subjects` → `topics` → questions
- Model router as single AI cost/quality switch point
- Human validation gate on all AI questions
- Offline-first PWA; mobile native V1.1

Detail: `architecture.md` · `AGENTS.md` · `content-architecture.md`

### 10.3 Reasoning Behind Major Decisions

| Decision                         | Rationale                                                           |
| -------------------------------- | ------------------------------------------------------------------- |
| Five chains, not one chatbot     | Testable, swappable, cost-routable; prevents answer-vending         |
| Haiku for marking                | 10–20× cheaper; rubric application not deep reasoning               |
| No LLM at question delivery      | Scales to millions without linear AI cost                           |
| GCE Buea first                   | Founder market knowledge; competition timeline; one board done well |
| Web PWA before native            | 10-week MVP; offline via service worker; React Native V1.1          |
| Plausible not PostHog            | Privacy-first; minors; no cookie banner                             |
| Understanding verification (UVE) | Differentiates from ChatGPT and homework apps; competition strength |
| Human admin gate                 | Prevents hallucinated questions reaching students                   |

---

## 11. Reading Guide for New Team Members

**15-minute orientation:**

1. This document (you are here)
2. `platform-how-it-works.md` §2 — the learning loop
3. `roadmap.md` — what ships when

**By role:**

| Role                      | Essential reading                                                                |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Engineer**              | `architecture.md` → `AGENTS.md` → `build-plan.md` → `code-standards.md`          |
| **Product / Design**      | `student-journey.md` → `project-overview.md` → `ui-rules.md`                     |
| **Educator / Curriculum** | `content-governance.md` → `content-architecture.md` → `platform-how-it-works.md` |
| **Investor / Partner**    | This charter → `ExamEdge_Innovation_Document.md` → `learning-impact.md`          |
| **AI / ML**               | `AGENTS.md` → `ai-cost-and-exam-system.md` → Responsible AI Framework            |
| **Ops / DevOps**          | `engineering-operations.md` → `security.md` → `zero-budget-stack.md`             |

**Full index:** `documentation-map.md`

---

## 12. Document Authority Matrix

Avoid conflicting sources — each domain has one canonical doc:

| Domain                                        | Authoritative document                     |
| --------------------------------------------- | ------------------------------------------ |
| **Identity (vision, mission, values, goals)** | **This document (`strategic-charter.md`)** |
| MVP product scope & flows                     | `project-overview.md`                      |
| Release planning                              | `roadmap.md`                               |
| Implementation order                          | `build-plan.md`                            |
| AI chain specifications                       | `AGENTS.md` (never duplicate)              |
| System architecture                           | `architecture.md`                          |
| Security (MVP)                                | `security.md`                              |
| Student experience                            | `student-journey.md`                       |
| Curriculum & content model                    | `content-architecture.md`                  |
| Documentation completeness                    | `documentation-completeness-audit.md`      |

When this charter and `project-overview.md` overlap on vision/mission, **this charter is authoritative for identity**; `project-overview.md` is authoritative for **MVP product detail**.

---

## 13. Maintenance

Update this charter when:

- Vision, mission, or core values change
- Strategic goals or impact targets are revised
- Major directional decisions are locked (e.g. new primary market)
- A new release phase completes (summary in §10.1)

Do **not** duplicate AI chain specs or API details here — link to canonical docs.

**Commit convention:** `docs(strategic): description` — separate from feature commits.

---

_ExamEdge — Learn deeply. Prepare confidently. Any exam. Any country._
