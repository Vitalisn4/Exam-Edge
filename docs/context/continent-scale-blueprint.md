# Continent-Scale Blueprint — Gap Analysis & Strategic Index

**Purpose:** Cross-check all platform concerns against existing documentation; identify gaps; point to canonical Tier 1 sources. This document transforms the MVP spec into a **long-term blueprint index** for a continent-scale AI educational ecosystem.

**Last audit:** June 2026 | Post-gap-fill

---

## Executive Summary

| Area | Overall status | Primary Tier 1 doc |
|------|----------------|-------------------|
| Content acquisition & governance | ✅ Documented (new) | `content-governance.md` |
| Educational QA | ✅ Documented (new) | `content-governance.md` §4 |
| Learning outcomes | ✅ Documented (new) | `learning-impact.md` |
| Curriculum architecture | ✅ Complete | `content-architecture.md` |
| Multilingual / offline / devices | ✅ Documented (new) | `platform-ecosystem-ops.md` |
| Teacher / parent ecosystem | ⚠️ V1.1 spec; MVP deferred | `platform-ecosystem-ops.md` §4 |
| Student onboarding & journey | ✅ Documented (new) | `student-journey.md` |
| Engagement ethics | ✅ Complete | `platform-ecosystem-ops.md` §5 + `student-journey.md` §4 |
| AI evaluation & safety | ✅ Tier 1 + Tier 3 depth | `AGENTS.md` + Responsible AI doc |
| Agent architecture | ✅ Complete | `AGENTS.md` (five chains) |
| Cost & sustainability | ✅ Complete | `ai-cost-and-exam-system.md` |
| Exam integrity | ✅ Complete | `ai-cost-and-exam-system.md` §8 |
| Data architecture | ✅ Complete | `content-architecture.md` §8 |
| AI memory / personalization | ✅ Complete | `content-architecture.md` §6 |
| Explainability | ✅ Documented (new) | `learning-impact.md` §4 |
| Accessibility & operations | ✅ Documented (new) | `platform-ecosystem-ops.md` |
| Long-term vision | ✅ Complete | `roadmap.md` |

**Remaining Tier 3-only (acceptable until V1.1 build):** Full incident runbook SQL, payment flows, complete RLS policies, ministry API specs.

---

## Section-by-Section Audit

### 1. Content Acquisition and Ownership

| Item | Status | Location |
|------|--------|----------|
| Syllabus origin | ✅ | `content-governance.md` §1 |
| Legal / copyright framework | ✅ | `content-governance.md` §1.2; Volume II |
| Licensed vs internal vs teacher content | ✅ | `content-governance.md` §1.1, §1.3 |
| Syllabus update workflow | ✅ | `content-governance.md` §3.2 |
| Content governance strategy | ✅ | `content-governance.md` §5–6 |

**Deliverables:** Content licensing framework ✓ · Ingestion pipeline ✓ · Versioning ✓ · Update workflow ✓

---

### 2. Educational Quality Assurance

| Item | Status | Location |
|------|--------|----------|
| Who validates AI explanations | ✅ | Admin + curriculum specialist |
| Error detection / correction | ✅ | Hallucination registry, appeals, cross-exam |
| SME review | ✅ | Admin validation queue |
| Audit frequency | ✅ | Monthly cadence defined |
| Quality standards | ✅ | `content-governance.md` §4.1 |

**Deliverables:** QA framework ✓ · Human review workflow ✓ · AI evaluation pipeline ✓ · Approval process ✓

---

### 3. Measuring Learning Outcomes

| Item | Status | Location |
|------|--------|----------|
| Exam score improvement | ✅ Pilot protocol | `learning-impact.md` §3.3 |
| Pass rates | ✅ Cohort KPI | `learning-impact.md` §2.2 |
| Time to mastery | ✅ | `learning-impact.md` §2.1 |
| Retention (SM-2) | ✅ | `content-architecture.md` |
| Engagement | ✅ Ethical metrics | `learning-impact.md` §2.1 |
| Exam readiness | ✅ | `project-overview.md` |
| Analytics dashboard | ⚠️ Student MVP; teacher V1.1 | `learning-impact.md` §3.2 |

**Deliverables:** KPI framework ✓ · Analytics architecture ✓ · Impact measurement ✓

---

### 4. Knowledge Representation & Curriculum Architecture

| Item | Status | Location |
|------|--------|----------|
| Country → Curriculum → Subject → Topic → … | ✅ | `content-architecture.md` §2 |
| Multi-country without DB redesign | ✅ | `curricula` + seed data pattern |
| Knowledge graph / prerequisites | ✅ | `concept_graph`, `content-architecture.md` §3 |
| Cameroon / Nigeria / Ghana / Kenya | ✅ | `roadmap.md` V2.0 playbook |

**Deliverables:** Curriculum engine ✓ · Knowledge graph ✓ · Multi-country framework ✓

**Answer:** Yes — proposed hierarchy is supported. MVP flattens subtopics into JSONB; V1.1 promotes to tables without schema redesign of core entities.

---

### 5. Multilingual Support

| Item | Status | Location |
|------|--------|----------|
| English | ✅ V1.0 | `roadmap.md` |
| French | ✅ V1.1 UI; V2.0 content | `platform-ecosystem-ops.md` §1 |
| AI tutoring multilingual | ✅ Per-language cache + prompts | §1.3 |
| i18n framework | ✅ next-intl V1.1 | `platform-ecosystem-ops.md` |

**Deliverables:** i18n strategy ✓ · Localization framework ✓ · Language roadmap ✓

---

### 6. Internet Constraints

| Item | Status | Location |
|------|--------|----------|
| Poor connectivity behaviour | ✅ | `platform-ecosystem-ops.md` §2 |
| Offline practice | ✅ Unit 27 | IndexedDB queue |
| PWA | ✅ | `build-plan.md` Unit 27 |
| Low-bandwidth plan | ✅ | §2.3 |
| Lesson download | ⚠️ V1.1 mobile SQLite | Deferred web download |

**Deliverables:** Offline-first strategy ✓ · Sync architecture ✓ · Low-bandwidth plan ✓

---

### 7. Device Constraints

| Item | Status | Location |
|------|--------|----------|
| Minimum device spec | ✅ | `platform-ecosystem-ops.md` §3 |
| Data consumption budget | ✅ | §3.2 |
| 3G support | ✅ | §3.1 |

**Deliverables:** Device matrix ✓ · Performance strategy ✓

---

### 8. Teacher and Parent Ecosystem

| Item | Status | Location |
|------|--------|----------|
| Parent monitoring | ⚠️ V1.1 | `platform-ecosystem-ops.md` §4.3 |
| Teacher dashboard | ⚠️ V1.1 | §4.2 |
| Classrooms | ⚠️ V1.1 | §4.1 |
| Teacher assignments | ⚠️ V1.1 | §4.2 |

**Deliverables:** Spec complete; **implementation deferred V1.1** (MVP student-only by design)

---

### 9. Student Motivation and Engagement

| Item | Status | Location |
|------|--------|----------|
| Streaks | ✅ Ethical (grace day) | `platform-ecosystem-ops.md` §5 |
| Achievements / leaderboards | ✅ Explicitly excluded | §5.2 |
| Study reminders | ✅ Weekly email only | §5.1 |
| Personalized study plans | ✅ Algorithmic | `content-architecture.md` §6.2 |
| Gamification | ✅ Ethical framework only | Volume II + §5 |

**Deliverables:** Engagement framework ✓ · No manipulative gamification ✓

---

### 10. AI Evaluation Framework

| Item | Status | Location |
|------|--------|----------|
| Hallucination rate | ✅ Registry + benchmarks | `AGENTS.md` Evaluation |
| Answer accuracy | ✅ ≥92% marking threshold | `project-overview.md` |
| Latency | ✅ <3s p95 | `ai-cost-and-exam-system.md` |
| Cost per request | ✅ Logged per call | `ai-cost-and-exam-system.md` §11 |
| Educational effectiveness | ✅ Pilot protocol | `learning-impact.md` |
| Benchmark datasets | ⚠️ 500 Q suite specified; files V1.0 build | `packages/ai/examples/` |

**Deliverables:** Evaluation framework ✓ · Benchmark specs ✓ · CI pipeline V1.1

---

### 11. AI Safety Framework

| Item | Status | Location |
|------|--------|----------|
| Incorrect information handling | ✅ | Responsible AI doc; confidence + review |
| Uncertainty admission | ✅ confidence < 0.70 → review queue | `AGENTS.md`, UI copy |
| Human escalation | ✅ Appeals + manual review | Units 22, 29 |
| Hallucination mitigation | ✅ | `platform-how-it-works.md` §7 |

**Deliverables:** Safety framework ✓ (Tier 3 depth) · Escalation ✓ · Tier 1 summary in `AGENTS.md` guardrails

---

### 12. Agent Architecture

| Item | Status | Location |
|------|--------|----------|
| Specialized vs monolithic | ✅ **Five independent chains** — not one agent | `AGENTS.md` |
| Tutor / Grader / Generator / etc. | ✅ Maps to chains | See matrix below |
| Orchestration | ✅ Route handlers + cron — chains never call chains | `architecture.md` |

**Architecture decision (locked):** Specialized chain architecture — NOT a monolithic tutor agent.

| User concept | ExamEdge implementation |
|--------------|-------------------------|
| Tutor Agent | Guidance chain (Socratic hints) |
| Question Generation Agent | Generation chain + RAG |
| Examination Agent | PaperBuilder algorithm (no LLM) + simulation routes |
| Grading Agent | Marking chain (Haiku) |
| Feedback Agent | Marking step feedback + report_gen |
| Recommendation Agent | IRT + graph algorithm (no LLM) |
| Analytics Agent | SQL aggregation + Plausible |
| Curriculum Agent | Curriculum chain (cached) |

**Deliverables:** Agent responsibilities ✓ · Orchestration ✓ · Diagram in `platform-how-it-works.md` §4

---

### 13. Cost Modeling and Sustainability

| Item | Status | Location |
|------|--------|----------|
| Cost per student / exam / session | ✅ | `ai-cost-and-exam-system.md` §3, §6 |
| Break-even | ✅ | Cost Optimisation doc; ~200 paying students |
| Free → paid infra migration | ✅ | `zero-budget-stack.md` |
| AI optimization | ✅ | `ai-cost-and-exam-system.md` |

**Deliverables:** Cost model ✓ · Budget forecasts ✓ · Optimization ✓

---

### 14. Examination Integrity

| Item | Status | Location |
|------|--------|----------|
| Plagiarism / answer sharing | ✅ UVE + parameterisation | `platform-how-it-works.md` §3 |
| AI-generated answer detection | ✅ UVE L1-L2 | Same |
| Multi-device | ✅ Honest limits documented | `ai-cost-and-exam-system.md` §8.3 |
| Tab switching / fullscreen | ✅ | Unit 25 |

**Deliverables:** Integrity framework ✓ · Anti-cheating strategy ✓ (verification not surveillance)

---

### 15. Data Architecture

| Item | Status | Location |
|------|--------|----------|
| Storage types | ✅ | `architecture.md` schema |
| Scale 10K / 100K / 1M | ✅ | `content-architecture.md` §8 |
| Embeddings, logs, audit | ✅ | schema + R2 backups |
| Sharding path | ✅ V5.0 | Engineering doc §13 |

**Deliverables:** Data architecture ✓ · Storage strategy ✓ · Scaling roadmap ✓

---

### 16. AI Memory System

| Item | Status | Location |
|------|--------|----------|
| Weak topics | ✅ | `mastery_records` |
| Learning preferences | ✅ | `users.preferences`, `cognitive_fp` |
| Previous mistakes | ✅ | `student_responses` history |
| Progress history | ✅ | Full session/response tables |
| Retention policy | ✅ | Account lifetime; soft delete Unit 23 |

**Not LLM session memory** — structured PostgreSQL + cron-updated cognitive fingerprint. No prompt history sent to Anthropic.

**Deliverables:** Memory architecture ✓ · Retention ✓ · Personalization ✓

---

### 17. Explainability

| Item | Status | Location |
|------|--------|----------|
| Why marks deducted | ✅ M1/A1/B1 step feedback | Marking chain |
| Why recommendation | ✅ Pathway rationale strings | `learning-impact.md` §4 |
| Why path changed | ✅ Mastery delta visible | Dashboard |
| Why struggling | ✅ Topic accuracy + hint rate | Progress page |

**Deliverables:** Explainability framework ✓ · Reasoning patterns ✓

---

### 18. Accessibility

| Item | Status | Location |
|------|--------|----------|
| Screen reader / keyboard | ✅ MVP requirements | `platform-ecosystem-ops.md` §6 |
| TTS / dyslexia font | ⚠️ V1.1+ | §6.2 |
| WCAG AA | ✅ ui-tokens | Unit 02 |

**Deliverables:** Accessibility framework ✓ · Inclusive guidelines ✓

---

### 19. Operations and Reliability

| Item | Status | Location |
|------|--------|----------|
| Moderation | ✅ Admin queues | `content-governance.md` |
| Bug reports | ✅ Sentry | Unit 31 |
| Incidents | ✅ Summary | `platform-ecosystem-ops.md` §7 |
| AI provider failure | ✅ Fallback policy | §7.2 |
| Disaster recovery | ✅ | §7.3 |

**Deliverables:** Incident summary ✓ · Reliability targets ✓ · Full runbook Tier 3 until V1.1

---

### 20. Long-Term Vision

| Item | Status | Location |
|------|--------|----------|
| Multi-year roadmap | ✅ | `roadmap.md` |
| University / career / scholarships | ✅ V2.0 spec | `student-journey.md` §6–7 |
| Global competitiveness vision | ✅ | `student-journey.md` §7 |
| Expansion strategy | ✅ | `content-architecture.md`, `roadmap.md` |

**Deliverables:** Roadmap ✓ · Graduate Success spec ✓ · Global vision ✓

---

## Additional Documentation Checklist (20 Topics)

| # | Topic | Tier 1 canonical doc |
|---|-------|---------------------|
| 1 | Educational philosophy | `project-overview.md` Design Principles + `platform-how-it-works.md` |
| 2 | Curriculum architecture | `content-architecture.md` |
| 3 | AI governance | `AGENTS.md` + `content-governance.md` |
| 4 | Cost modeling | `ai-cost-and-exam-system.md` + `zero-budget-stack.md` |
| 5 | Scalability planning | `content-architecture.md` §8 + `roadmap.md` |
| 6 | Evaluation framework | `learning-impact.md` + `AGENTS.md` Evaluation |
| 7 | Content licensing | `content-governance.md` |
| 8 | Analytics & impact | `learning-impact.md` |
| 9 | Accessibility | `platform-ecosystem-ops.md` §6 |
| 10 | Offline-first | `platform-ecosystem-ops.md` §2 |
| 11 | Teacher/parent ecosystem | `platform-ecosystem-ops.md` §4 |
| 12 | Business sustainability | `ExamEdge_Cost_Optimisation_Economics.md` (Tier 3) + roadmap |
| 13 | Disaster recovery | `platform-ecosystem-ops.md` §7.3 |
| 14 | Multi-country expansion | `content-architecture.md` §7 + `roadmap.md` |
| 15 | Success metrics / KPIs | `learning-impact.md` + `project-overview.md` |
| 16 | AI safety / responsible AI | `ExamEdge_Responsible_AI_Framework.md` (Tier 3) + AGENTS guardrails |
| 17 | Security & data governance | `security.md` |
| 18 | Infrastructure cost optimization | `ai-cost-and-exam-system.md` |
| 19 | Educational research / validation | `learning-impact.md` §3.3 pilot protocol |
| 20 | Long-term org/ops strategy | `roadmap.md` + `content-governance.md` §5 roles |

**All 20 topics now have a Tier 1 pointer.** Tier 3 docs provide depth where noted.

---

## Tier 1 Document Map (Complete Set)

```
docs/context/
├── project-overview.md          Vision, flows, success criteria
├── roadmap.md                   V1.0 → V3.0 releases
├── architecture.md              Stack, schema, API, invariants
├── security.md                  Auth, privacy, rate limits
├── content-architecture.md      Curriculum tree, graph, scale
├── content-governance.md        Licensing, ingestion, QA  ← NEW
├── learning-impact.md           KPIs, analytics, explainability
├── student-journey.md           Onboarding, privacy, focus, global vision
├── platform-ecosystem-ops.md    i18n, offline, devices, teachers, ops
├── ai-cost-and-exam-system.md   AI economics, exam lifecycle
├── platform-how-it-works.md     Pedagogy, learning loop
├── zero-budget-stack.md         Free tiers, pilot costs
├── continent-scale-blueprint.md This index  ← NEW
├── build-plan.md                31 implementation units
└── documentation-map.md         Master index
```

---

## Gaps Closed in This Audit (June 2026)

| Gap | Resolution |
|-----|------------|
| No unified content licensing doc | `content-governance.md` |
| QA workflow scattered | `content-governance.md` §4 |
| KPI / impact framework implicit | `learning-impact.md` |
| i18n / offline / devices not Tier 1 | `platform-ecosystem-ops.md` |
| Teacher/parent only in roadmap bullets | §4 spec added |
| Engagement ethics buried in Volume II | §5 ethical framework |
| No master gap analysis index | This document |
| Onboarding / global vision scattered | `student-journey.md` |

---

## Remaining Intentional Deferrals (Not Gaps)

| Item | Target | Reason |
|------|--------|--------|
| Teacher dashboard implementation | V1.1 | MVP scope |
| French content generation | V2.0 | Requires syllabus + specialist |
| Benchmark dataset files on disk | Unit 10–11 | Build phase |
| Full incident runbook | V1.1 | Post-pilot ops |
| Payment / subscription | Post-pilot | After PMF |
| PostgreSQL RLS SQL | V1.1 | App-layer RBAC sufficient for MVP |
| Ministry analytics API | V3.0 | Requires partnerships |

---

## Maintenance Rule

When adding a platform concern:

1. Add to this audit table (section + status)
2. Create or extend exactly **one** Tier 1 canonical doc
3. Update `documentation-map.md`
4. Do **not** duplicate full AI chain specs outside `AGENTS.md`

---

*This document is the strategic index for continent-scale planning. Implementation remains governed by `build-plan.md` for MVP.*
