# Progress Tracker — ExamEdge

Update this file after every meaningful implementation change.

---

## Current Phase

**Phase 0 — Foundation** (Unit 01 implemented — pending merge)

---

## Current Goal

Unit 02: Design system + UI tokens — Tailwind v4, shadcn/ui, `/dev/ui`

---

## Completed

- [x] Engineering docs converted to Markdown (docs/*.md)
- [x] AI-Driven Build Playbook (docs/ExamEdge_AI_Driven_Build_Playbook.md)
- [x] Full Six-File+ context system (docs/context/)
- [x] zero-budget-stack.md + platform-how-it-works.md (cost + pedagogy)
- [x] content-architecture.md (curriculum model, knowledge graph, learner modes, scale)
- [x] ai-cost-and-exam-system.md (AI routing, cost at scale, examination system)
- [x] strategic-charter.md (vision, mission, values, goals — identity SSOT)
- [x] build-plan.md — 31 units with UI + Logic
- [x] Pan-African platform positioning (curriculum-agnostic vision)
- [x] Units 20–23: curriculum UI, progress, appeals, profile/privacy
- [x] specs/ folder + templates for key units
- [x] docs/demo-script.md
- [x] AGENTS.md v2.0 + .cursorrules
- [x] feature-development-prompts.md v2.0 — workflow, code review, merge gate, post-MVP prompts
- [x] feature-implementation-prompt-template.md — 18-section reusable template

---

## In Progress

- Unit 01 — Monorepo scaffold (implementation complete; merge to `main` pending)

---

## Next Up

1. Merge Unit 01 PR → begin Unit 02
2. Unit 02 — Design system + UI tokens
3. Unit 03 — Landing page UI
4. Unit 04 — KaTeX + MathQuill

---

## Open Questions

- Neon PostgreSQL project provisioned? (required before Unit 05)
- Anthropic API key + ~$5 starter credits? (required before Unit 09 — see zero-budget-stack.md)
- Voyage API key for embeddings? (required before Unit 12)
- Plausible domain configured? (required before Unit 07)
- Competition demo date — adjust unit priority if deadline < 10 weeks

---

## Architecture Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06 | Monorepo npm workspaces | Solo dev velocity; shared types |
| 2026-06 | MVP = web PWA only | 10-week constraint |
| 2026-06 | Auth.js over Clerk | Avoid vendor lock-in |
| 2026-06 | Haiku for all marking | Cost + latency |
| 2026-06 | Curriculum-agnostic schema | Pan-African expansion without rewrites |
| 2026-06 | Phase 1 = GCE Buea launch config | Pilot in Cameroon; not platform ceiling |
| 2026-06 | Six-file + security + roadmap + doc map | Single source of truth for agents |

---

## Session Notes

### 2026-06-27 — Documentation complete for V1.0 build
- Added Units 20–23 (curriculum UI, progress, appeals, profile/privacy)
- Created security.md, roadmap.md, documentation-map.md
- Updated positioning: pan-African, curriculum-agnostic platform
- 31 build units total; all MVP features mapped to units
- No application code yet — start Unit 01 next session

---

## Build Velocity

| Phase | Units | Status |
|-------|-------|--------|
| Phase 0 — Foundation | 01–08 | Not started |
| Phase 1 — AI Chains | 09–14 | Not started |
| Phase 2 — Student Core | 15–23 | Not started |
| Phase 3 — Assessment | 24–26 | Not started |
| Phase 4 — Resilience | 27–31 | Not started |

---

## Demo Readiness Checklist

- [ ] Auth flow (register → login → dashboard)
- [ ] Practice session with marking < 3s
- [ ] Socratic hint without answer leakage
- [ ] UVE probe after submission
- [ ] Curriculum explain (cached)
- [ ] Progress page with session history
- [ ] Marking appeal submission
- [ ] Profile + privacy controls
- [ ] Exam simulation end-to-end
- [ ] Offline queue sync
- [ ] Admin validation gate
- [ ] Demo script < 10 minutes
