# ExamEdge Documentation Index

**Single source of truth:** Start with [context/strategic-charter.md](context/strategic-charter.md) for identity, then [context/documentation-map.md](context/documentation-map.md) for everything else.

**Canonical positioning:** See [context/strategic-charter.md](context/strategic-charter.md). MVP product detail: [context/project-overview.md](context/project-overview.md).

---

## AI Development Context (`docs/context/`)

Read in order before every coding session. Full read order in [context/CLAUDE.md](context/CLAUDE.md).

| # | File | Purpose |
|---|------|---------|
| ★ | [strategic-charter.md](context/strategic-charter.md) | **Identity SSOT:** vision, mission, values, goals, impact |
| 1 | [project-overview.md](context/project-overview.md) | MVP scope, flows, features, success criteria |
| 2 | [roadmap.md](context/roadmap.md) | V1.0–V3.0 releases, expansion, deployment, scalability |
| 3 | [zero-budget-stack.md](context/zero-budget-stack.md) | Free tier assessment, MVP cost reality |
| 4 | [platform-how-it-works.md](context/platform-how-it-works.md) | Learning loop, AI production, grounding |
| 5 | [architecture.md](context/architecture.md) | Stack, schema, API, patterns, invariants |
| 6 | [security.md](context/security.md) | Auth, RBAC, rate limits, privacy MVP |
| 7 | [ui-tokens.md](context/ui-tokens.md) | Colors, typography, spacing |
| 8 | [ui-rules.md](context/ui-rules.md) | Layout, study session, exam mode |
| 9 | [ui-registry.md](context/ui-registry.md) | Component registry (living) |
| 10 | [code-standards.md](context/code-standards.md) | TypeScript, API, testing |
| 11 | [library-docs.md](context/library-docs.md) | Drizzle, Auth.js, LangChain, KaTeX, R2 |
| 12 | [ai-workflow-rules.md](context/ai-workflow-rules.md) | Scoping, UI-first workflow |
| 13 | [build-plan.md](context/build-plan.md) | **31 units** with UI + Logic |
| ★ | [CHAT-IMPLEMENTATION-PROMPT.md](context/CHAT-IMPLEMENTATION-PROMPT.md) | **Paste into chat** — research-first; Context & Research Summary before code |
| — | [library-docs.md](context/library-docs.md) | Project patterns + **official external doc URLs** |
| 13b | [feature-development-prompts.md](context/feature-development-prompts.md) | Full playbook — workflow + detailed prompt per unit |
| 13c | [feature-implementation-prompt-template.md](context/feature-implementation-prompt-template.md) | 18-section written spec (save to `specs/` for complex units) |
| 14 | [progress-tracker.md](context/progress-tracker.md) | Current phase (living) |
| 15 | [documentation-map.md](context/documentation-map.md) | Concern → document index |
| — | [specs/](context/specs/) | Per-unit implementation specs |
| — | [CLAUDE.md](context/CLAUDE.md) | Agent entry point |

---

## Entry Points

| File | Purpose |
|------|---------|
| [../AGENTS.md](../AGENTS.md) | Five AI chains, guardrails, workflows |
| [../.cursorrules](../.cursorrules) | IDE-enforced coding standards |
| [ExamEdge_AI_Driven_Build_Playbook.md](ExamEdge_AI_Driven_Build_Playbook.md) | AI-driven build methodology |
| [demo-script.md](demo-script.md) | 10-minute competition demo |

---

## Engineering Specifications (Tier 3 — Reference Depth)

> These documents use Phase 1 (GCE Buea) examples. Platform vision and expansion plans are in `context/project-overview.md` and `context/roadmap.md`.

| File | Purpose |
|------|---------|
| ExamEdge_Engineering_Document.md | Master technical design |
| ExamEdge_Innovation_Document.md | Product vision and differentiation |
| ExamEdge_Volume_II_Framework.md | Integrity, focus mode, accessibility |
| ExamEdge_Volume_V_Blueprint.md | Curriculum matrix, sample papers |
| ExamEdge_Responsible_AI_Framework.md | Privacy, bias, governance |
| ExamEdge_Cost_Optimisation_Economics.md | Model routing economics |
| ExamEdge_Technical_Interview_Guide.md | Q&A reference |

---

## Documentation Completeness

| Layer | Status | Primary doc |
|-------|--------|-------------|
| Vision & positioning | Complete | project-overview.md |
| Zero-budget stack assessment | Complete | zero-budget-stack.md |
| Platform behaviour & pedagogy | Complete | platform-how-it-works.md |
| MVP build plan (31 units) | Complete | build-plan.md |
| Post-MVP roadmap | Complete | roadmap.md |
| Architecture & API | Complete | architecture.md |
| Security (MVP) | Complete | security.md |
| AI system (5 chains) | Complete | AGENTS.md |
| Deployment (MVP) | Complete | roadmap.md § Deployment |
| Single source of truth map | Complete | documentation-map.md |

---

## Starter Kit Reference

Based on patterns from `Six-File+Context+Methodology/` and `ai_development_starter_kit/`.
