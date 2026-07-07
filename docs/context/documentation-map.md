# Documentation Map — ExamEdge

**Single source of truth index.** Every significant platform concern maps to exactly one primary document. When in doubt, read the primary doc first; secondary docs provide depth or historical detail.

Last updated: June 2026 | MVP V1.0 (31 build units)

---

## How to Use This Map

| You need…                                       | Read first                                                            |
| ----------------------------------------------- | --------------------------------------------------------------------- |
| **Vision, mission, values, goals (identity)**   | **`strategic-charter.md`**                                            |
| Is documentation complete?                      | `documentation-completeness-audit.md`                                 |
| Continent-scale gap analysis & strategic index  | `continent-scale-blueprint.md`                                        |
| MVP product scope & flows                       | `project-overview.md`                                                 |
| What to build this week                         | `build-plan.md` + `progress-tracker.md`                               |
| Visual brand & design philosophy                | **`design-brand-identity.md`**                                        |
| UI mockup generation (Figma, v0, etc.)          | **`examedge-ui-mockup-prompt.md`**                                    |
| GitHub Project board (optional)                 | `feature-development-prompts.md` §2e — mirror units, no duplicate doc |
| Paste-into-chat prompt (research-first)         | **`CHAT-IMPLEMENTATION-PROMPT.md`**                                   |
| Official technology doc URLs                    | **`library-docs.md` § Official External Documentation**               |
| Copy-paste implementation prompts (canonical)   | `FEATURE-IMPLEMENTATION-PROMPTS.md` + `feature-prompts/`              |
| **Technology versions (pinned stack)**          | **`tech-stack-versions.md`**                                          |
| Implementation playbook (process + workflow)    | `feature-development-prompts.md`                                      |
| Per-feature 18-section written spec             | `feature-implementation-prompt-template.md`                           |
| Can we afford the stack?                        | `zero-budget-stack.md`                                                |
| Student onboarding & journey                    | `student-journey.md`                                                  |
| How the tutor teaches & verifies understanding  | `platform-how-it-works.md`                                            |
| Content model, knowledge graph, continent scale | `content-architecture.md`                                             |
| AI cost, model routing, exam system             | `ai-cost-and-exam-system.md`                                          |
| How AI behaves                                  | `AGENTS.md` + `platform-how-it-works.md` §6                           |
| How to implement securely                       | `security.md`                                                         |
| What's after MVP                                | `roadmap.md`                                                          |
| How to code it                                  | `architecture.md` + `code-standards.md` + `engineering-operations.md` |

**Canonical positioning:** See `strategic-charter.md` §1–3. MVP detail: `project-overview.md` § Platform Vision.

---

## Document Hierarchy

```
Tier 1 — Agent reads every session (docs/context/)
├── strategic-charter.md    ★ Identity SSOT: vision, mission, values, goals, impact
├── project-overview.md     MVP product scope, flows, success criteria
├── roadmap.md              V1.0 → V3.0 releases, expansion, ops
├── zero-budget-stack.md    Free tiers, MVP cost, upgrade paths
├── student-journey.md          Onboarding, privacy trust, focus, global vision
├── platform-how-it-works.md Learning loop, AI production, grounding
├── engineering-operations.md Testing, CI/CD, monitoring, DR, ops
├── documentation-completeness-audit.md  Formal SSOT verification
├── continent-scale-blueprint.md Gap analysis & strategic index (20 sections)
├── content-governance.md     Licensing, ingestion, QA
├── learning-impact.md        KPIs, analytics, explainability
├── platform-ecosystem-ops.md i18n, offline, devices, teachers, ops
├── content-architecture.md Curriculum model, knowledge graph, scale
├── ai-cost-and-exam-system.md AI economics, routing, examination system
├── architecture.md         Stack, schema, API, patterns, invariants
├── security.md             Auth, RBAC, rate limits, privacy MVP
├── tech-stack-versions.md  Pinned versions, official links, deprecations (read before every unit)
├── FEATURE-IMPLEMENTATION-PROMPTS.md  Copy-paste prompts index (v3.0)
├── feature-prompts/        56 fully written per-feature prompt files
├── build-plan.md           31 implementation units
├── feature-development-prompts.md  Process, workflow, code review (v3.0)
├── feature-implementation-prompt-template.md  18-section reusable template
├── progress-tracker.md     Current status (living)
├── AGENTS.md (root)        Five AI chains, guardrails, workflows
├── code-standards.md       TypeScript, API, testing conventions
├── library-docs.md         Third-party library patterns
├── design-brand-identity.md  Brand personality, tagline, Teal Forest identity
├── examedge-ui-mockup-prompt.md  Complete UI/UX mockup generation prompt
├── ui-tokens/rules/registry UI system
├── ai-workflow-rules.md    Scoping, UI-first workflow
└── specs/                  Per-unit implementation specs

Tier 2 — Methodology & standards
├── ExamEdge_AI_Driven_Build_Playbook.md   AI-driven build methodology
├── .cursorrules                           IDE-enforced rules
├── demo-script.md                         Competition demo
└── CLAUDE.md                              Context entry point

Tier 3 — Engineering specifications (reference depth)
├── ExamEdge_Engineering_Document.md       Master technical design
├── ExamEdge_Innovation_Document.md        Differentiation, vision
├── ExamEdge_Responsible_AI_Framework.md   Privacy, bias, governance
├── ExamEdge_Volume_II_Framework.md        Integrity, focus, accessibility
├── ExamEdge_Volume_V_Blueprint.md         Curriculum matrix, papers
├── ExamEdge_Cost_Optimisation_Economics.md Model economics
└── ExamEdge_Technical_Interview_Guide.md  Q&A reference

Tier 4 — External methodology (do not edit)
├── Six-File+Context+Methodology/
└── ai_development_starter_kit/
```

---

## Concern → Document Matrix

### Vision & Product

| Concern                             | Primary                                   | Secondary                               |
| ----------------------------------- | ----------------------------------------- | --------------------------------------- |
| Gap analysis (20 sections)          | `continent-scale-blueprint.md`            | documentation-map.md                    |
| **Vision, mission, values, goals**  | **`strategic-charter.md`**                | project-overview.md (MVP detail)        |
| Platform vision & positioning (MVP) | `project-overview.md` § Platform Vision   | strategic-charter.md                    |
| Content licensing & QA              | `content-governance.md`                   | Volume II, Unit 29                      |
| Learning outcomes & KPIs            | `learning-impact.md`                      | project-overview success criteria       |
| i18n / offline / accessibility      | `platform-ecosystem-ops.md`               | build-plan Units 26–27                  |
| Teacher / parent ecosystem          | `platform-ecosystem-ops.md` §4            | roadmap V1.1                            |
| Engagement ethics                   | `platform-ecosystem-ops.md` §5            | `student-journey.md` §4                 |
| Student onboarding & global vision  | `student-journey.md`                      | project-overview flows                  |
| Privacy trust (student-facing)      | `student-journey.md` §3                   | `security.md`                           |
| Operations & DR                     | `platform-ecosystem-ops.md` §7            | Engineering doc §10                     |
| Problem statement                   | `project-overview.md`                     | Innovation doc                          |
| Target users                        | `project-overview.md`                     | roadmap.md                              |
| MVP feature list                    | `project-overview.md` § Features In Scope | `build-plan.md`                         |
| Deferred features                   | `project-overview.md` § Out of Scope      | `roadmap.md`                            |
| Success criteria                    | `project-overview.md`                     | demo-script.md                          |
| Design principles                   | `strategic-charter.md` §4                 | project-overview.md § Design Principles |
| User flows                          | `project-overview.md`                     | build-plan units                        |
| Analytics events                    | `project-overview.md`                     | code-standards.md                       |

### Budget & Sustainability

| Concern                         | Primary                           | Secondary                                 |
| ------------------------------- | --------------------------------- | ----------------------------------------- |
| Free tier feasibility           | `zero-budget-stack.md`            | Technical Interview Guide                 |
| Per-service limits              | `zero-budget-stack.md`            | `ai-cost-and-exam-system.md`              |
| AI pilot cost estimate          | `zero-budget-stack.md`            | `ai-cost-and-exam-system.md` §6           |
| Cost optimisation at scale      | `ai-cost-and-exam-system.md`      | `AGENTS.md` router, Cost Optimisation doc |
| Model routing & task assignment | `ai-cost-and-exam-system.md` §2   | `AGENTS.md`                               |
| Exam simulation (technical)     | `ai-cost-and-exam-system.md` §7–9 | `build-plan.md` Unit 25                   |
| Post-exam report & tutoring     | `ai-cost-and-exam-system.md` §9   | Volume II §20.2.3                         |
| Peak load / batch AI            | `ai-cost-and-exam-system.md` §5   | Cost Optimisation doc §8.2                |
| Upgrade without migration       | `zero-budget-stack.md`            | roadmap.md                                |

### Pedagogy & AI Production

| Concern                                   | Primary                       | Secondary                 |
| ----------------------------------------- | ----------------------------- | ------------------------- |
| Learning loop (learn → practice → verify) | `platform-how-it-works.md` §2 | project-overview flows    |
| Copying vs understanding detection        | `platform-how-it-works.md` §3 | Volume II Framework       |
| Component integration diagram             | `platform-how-it-works.md` §4 | architecture.md flows     |
| Subject submission (math, bio, photos)    | `platform-how-it-works.md` §5 | build-plan Units 04, 28   |
| Production AI routing & tokens            | `platform-how-it-works.md` §6 | AGENTS.md                 |
| Hallucination / grounding                 | `platform-how-it-works.md` §7 | AGENTS.md, Responsible AI |
| PostHog (not used)                        | `zero-budget-stack.md`        | library-docs.md           |

### Roadmap & Releases

| Concern                                 | Primary                                 | Secondary                       |
| --------------------------------------- | --------------------------------------- | ------------------------------- |
| V1.0 MVP scope                          | `build-plan.md`                         | project-overview.md             |
| V1.1 / V2.0 / V3.0 features             | `roadmap.md`                            | Engineering doc §7              |
| Multi-country expansion                 | `roadmap.md` § Curriculum Extensibility | `content-architecture.md` §7    |
| Content hierarchy & knowledge graph     | `content-architecture.md`               | architecture.md schema          |
| Learner modes (primary / supplementary) | `content-architecture.md` §5            | project-overview flows          |
| Personalization & pathways              | `content-architecture.md` §6            | platform-how-it-works.md        |
| Curriculum onboarding process           | `roadmap.md`                            | `content-architecture.md` §7.4  |
| AI evolution                            | `roadmap.md` § AI Roadmap               | AGENTS.md, Cost doc             |
| Scalability tiers                       | `content-architecture.md` §8            | roadmap.md, Engineering doc §13 |
| Operational maturity                    | `roadmap.md` § Operational Roadmap      | Engineering doc §10             |

### Architecture & Implementation

| Concern                     | Primary                          | Secondary                                        |
| --------------------------- | -------------------------------- | ------------------------------------------------ |
| Tech stack                  | `architecture.md`                | AGENTS.md                                        |
| Folder structure            | `architecture.md`                | .cursorrules §4                                  |
| Database schema             | `architecture.md`                | Engineering doc §3                               |
| API routes                  | `architecture.md`                | build-plan units                                 |
| Data flows (7 patterns)     | `architecture.md`                | AGENTS.md patterns                               |
| Environment variables       | `architecture.md`                | security.md                                      |
| Architecture invariants     | `architecture.md`                | AGENTS.md, playbook appendix                     |
| Error response format       | `architecture.md`                | code-standards.md                                |
| Deployment (MVP)            | `roadmap.md` § Deployment        | architecture.md                                  |
| Build order (31 units)      | `build-plan.md`                  | feature-development-prompts.md                   |
| Per-unit copy-paste prompts | `feature-prompts/*.md`           | FEATURE-IMPLEMENTATION-PROMPTS.md, build-plan.md |
| Implementation process      | `feature-development-prompts.md` | build-plan.md, roadmap.md                        |

### Security & Privacy

| Concern                     | Primary                  | Secondary                        |
| --------------------------- | ------------------------ | -------------------------------- |
| Authentication              | `security.md`            | architecture.md, library-docs.md |
| Authorization (RBAC)        | `security.md`            | architecture.md API table        |
| Rate limiting               | `security.md`            | architecture.md, Unit 08         |
| Idempotency                 | `security.md`            | architecture.md, AGENTS.md       |
| Prompt injection            | `security.md`            | AGENTS.md guardrails             |
| Minors / consent / deletion | `security.md`            | Unit 23, Responsible AI doc      |
| Audit logging               | `security.md`            | architecture.md schema           |
| RLS / CSP / refresh tokens  | `roadmap.md` V1.1        | Engineering doc §5               |
| Responsible AI governance   | Responsible AI Framework | AGENTS.md guardrails             |

### AI System

| Concern                  | Primary                | Secondary                   |
| ------------------------ | ---------------------- | --------------------------- |
| Five chains (spec)       | `AGENTS.md`            | Engineering doc §4          |
| Model router             | `AGENTS.md`            | library-docs.md             |
| RAG pipeline             | `AGENTS.md`            | architecture.md             |
| Marking chain            | `AGENTS.md`            | Unit 10, marking.schema     |
| Guidance / hints         | `AGENTS.md`            | Unit 11, ui-rules.md        |
| Question generation      | `AGENTS.md`            | Unit 12                     |
| UVE probes               | `AGENTS.md`            | Unit 13                     |
| Curriculum chain         | `AGENTS.md`            | Units 14, 20                |
| Interaction patterns     | `AGENTS.md`            | architecture.md flows       |
| Guardrails               | `AGENTS.md`            | security.md, Responsible AI |
| Hallucination mitigation | `AGENTS.md`            | Responsible AI doc          |
| Evaluation thresholds    | `AGENTS.md`            | roadmap.md                  |
| Cost routing             | `AGENTS.md` + Cost doc | roadmap.md                  |

### UI / UX

| Concern            | Primary           | Secondary                   |
| ------------------ | ----------------- | --------------------------- |
| Design tokens      | `ui-tokens.md`    | Unit 02                     |
| Layout rules       | `ui-rules.md`     | project-overview navigation |
| Component registry | `ui-registry.md`  | (living — update per unit)  |
| Landing page       | Unit 03, specs/03 | ui-rules.md                 |
| Study / exam UI    | ui-rules.md       | Units 16, 21                |
| Progress / profile | Units 21, 23      | project-overview pages      |

### Student Features → Build Units

| Feature                 | Build unit(s) | Spec           |
| ----------------------- | ------------- | -------------- |
| Monorepo + health       | 01            | —              |
| Design system           | 02            | —              |
| Landing page            | 03            | specs/03       |
| KaTeX / MathQuill       | 04            | —              |
| Database + seed         | 05            | —              |
| Auth                    | 06            | security.md    |
| Plausible               | 07            | specs/07       |
| Redis + rate limits     | 08            | security.md    |
| AI router + sanitize    | 09            | —              |
| Marking chain           | 10            | —              |
| Guidance chain          | 11            | —              |
| Generation + RAG        | 12            | —              |
| UVE chain               | 13            | —              |
| Curriculum chain        | 14            | —              |
| Dashboard UI (mock)     | 15            | —              |
| Study session UI (mock) | 16            | —              |
| Session API + marking   | 17            | —              |
| Hint flow               | 18            | —              |
| Dashboard real data     | 19            | —              |
| Curriculum explain UI   | 20            | specs/20       |
| Progress page           | 21            | specs/21       |
| Marking appeals         | 22            | specs/22       |
| Profile + privacy       | 23            | specs/23       |
| Question pool           | 24            | —              |
| Exam simulation         | 25            | —              |
| Focus sessions          | 26            | Volume II      |
| PWA offline             | 27            | —              |
| Photo OCR               | 28            | —              |
| Admin validation        | 29            | —              |
| Cron jobs               | 30            | —              |
| Pilot hardening         | 31            | demo-script.md |

### Operations

| Concern               | Primary                          | Secondary                      |
| --------------------- | -------------------------------- | ------------------------------ |
| Weekly reports        | Unit 30                          | AGENTS.md Pattern 4            |
| Question pool refresh | Unit 30                          | AGENTS.md                      |
| Backups               | Unit 30                          | architecture.md R2             |
| Monitoring            | `engineering-operations.md` §3   | Unit 31                        |
| Demo script           | demo-script.md                   | Unit 31                        |
| Testing / CI/CD       | `engineering-operations.md` §1–2 | Engineering doc §9             |
| Disaster recovery     | `engineering-operations.md` §4   | platform-ecosystem-ops.md §7.3 |
| Incident response     | `engineering-operations.md` §5   | Engineering doc §10.3          |

---

## Read Order for New Contributors

1. **`strategic-charter.md`** — vision, mission, values, goals, impact (identity SSOT)
2. `continent-scale-blueprint.md` — gap analysis & full platform index
3. `student-journey.md` — onboarding, trust, focus, mastery path
4. `project-overview.md` — MVP product scope and flows
5. `roadmap.md` — understand launch vs long-term
6. `content-architecture.md` — curriculum model, pathways, scale
7. `ai-cost-and-exam-system.md` — AI economics, exam system
8. `content-governance.md` — licensing, QA, content ops
9. `learning-impact.md` — KPIs, impact measurement
10. `AGENTS.md` — understand AI architecture
11. `architecture.md` — understand system design
12. `security.md` — understand security requirements
13. `build-plan.md` + `progress-tracker.md` — start building
14. `ExamEdge_AI_Driven_Build_Playbook.md` — methodology

---

## Maintenance Rules

| When this changes…                      | Update these docs                                             |
| --------------------------------------- | ------------------------------------------------------------- |
| New MVP feature                         | build-plan.md, project-overview.md, documentation-map.md      |
| Feature deferred                        | project-overview.md, roadmap.md                               |
| New API route                           | architecture.md, build-plan unit, security.md if auth changes |
| New AI chain behaviour                  | AGENTS.md only (never duplicate full spec elsewhere)          |
| New analytics event                     | project-overview.md, code-standards.md, library-docs.md       |
| Positioning / vision / mission / values | `strategic-charter.md`, `project-overview.md`, `roadmap.md`   |
| Unit completed                          | progress-tracker.md, ui-registry.md if UI                     |

**Do not duplicate** full AI chain specifications outside `AGENTS.md`. Other docs reference and link.

---

## Completeness Checklist (V1.0 Documentation)

- [x] Strategic charter (vision, mission, values, goals — identity SSOT)
- [x] Platform vision (pan-African, curriculum-agnostic)
- [x] MVP scope and success criteria
- [x] 31-unit build plan with UI + Logic
- [x] Architecture, schema, API, invariants
- [x] Security MVP requirements
- [x] Five AI chains fully specified
- [x] UI system (tokens, rules, registry)
- [x] Library integration patterns
- [x] Zero-budget stack assessment
- [x] Platform how-it-works (pedagogy, AI production, grounding)
- [x] Content architecture (curriculum model, knowledge graph, learner modes, scale)
- [x] AI cost orchestration & examination system
- [x] Student journey (onboarding, privacy trust, focus, global vision)
- [x] Continent-scale blueprint (gap analysis, 20 sections)
- [x] Content governance (licensing, ingestion, QA)
- [x] Learning impact (KPIs, analytics, explainability)
- [x] Platform ecosystem & ops (i18n, offline, devices, teachers, accessibility)
- [x] Roadmap V1.1 → V3.0
- [x] Deployment approach
- [x] Demo script
- [x] Per-unit specs (template + key units)
- [x] Engineering deep-dive docs (Tier 3)
- [x] Engineering operations (testing, CI/CD, monitoring, DR)
- [x] Documentation completeness audit (formal SSOT verification)
- [x] This documentation map

**Not in context files (Tier 3 only):** Full endpoint reference (Engineering §6), step-by-step incident runbook (Engineering §10.3), complete RLS SQL, payment flows, privacy policy legal text — see `documentation-completeness-audit.md` § Known Gaps.
