# Progress Tracker — ExamEdge

Update this file after every meaningful implementation change.

---

## Current Phase

**Phase 0 — Foundation** (Units 01–03b merged; Unit 04 ready on branch)

---

## Current Goal

Merge `feature/unit-04-katex-mathquill` → `main`, then Unit 05 (Database schema v1)

---

## Completed

- [x] Engineering docs converted to Markdown (docs/*.md)
- [x] AI-Driven Build Playbook (docs/ExamEdge_AI_Driven_Build_Playbook.md)
- [x] Full Six-File+ context system (docs/context/)
- [x] build-plan.md — 31 units with UI + Logic + unit dependency index
- [x] feature-development-prompts.md v3.0 — workflow, merge gate §2d, GitHub mirror §2e
- [x] feature-prompts/ — 31 copy-paste unit prompts
- [x] Teal Forest design system docs (ui-tokens.md, design-brand-identity.md, examedge-ui-mockup-prompt.md)
- [x] **Unit 01** — Monorepo scaffold (merged to `main`)
- [x] **Unit 02** — Design system + UI tokens (merged via PR #1)
- [x] **Unit 03** — Landing page MVP (merged via PR #2)
- [x] **Unit 03b** — Landing marketing refresh (merged via PR #4)
- [x] **Marking conventions SSOT** — `marking-conventions.md` + `specs/10-marking-framework.md`
- [x] **Unit 04** — KaTeX + MathQuill (`feature/unit-04-katex-mathquill`; merged with `main`, ready for PR)

---

## In Progress

- [ ] **Unit 04** — PR merge to `main`

---

## Next Up

1. Merge `feature/unit-04-katex-mathquill` → `main`
2. Unit 05 — Database schema v1 (Neon required)

---

## Open Questions

- Neon PostgreSQL project provisioned? (required before Unit 05)
- Anthropic API key + ~$5 starter credits? (required before Unit 09)
- Voyage API key for embeddings? (required before Unit 12)
- Plausible domain configured? (required before Unit 07)
- Competition demo date — adjust unit priority if deadline < 10 weeks

---

## Architecture Decisions

| Date    | Decision                          | Rationale                                                 |
| ------- | --------------------------------- | --------------------------------------------------------- |
| 2026-06 | Monorepo npm workspaces           | Solo dev velocity; shared types                           |
| 2026-06 | MVP = web PWA only                | 10-week constraint                                        |
| 2026-06 | Auth.js over Clerk                | Avoid vendor lock-in                                      |
| 2026-06 | Haiku for all marking             | Cost + latency                                            |
| 2026-06 | Curriculum-agnostic schema        | Pan-African expansion without rewrites                    |
| 2026-06 | Phase 1 = GCE Buea launch config  | Pilot in Cameroon                                         |
| 2026-07 | Unit 03b spec for Lovable landing | Full mockup map; dark/light; ports exam-edge-path         |
| 2026-07 | Marking profiles per subject      | M/A maths; point rubric sciences — not universal M1/A1/B1 |

---

## Session Notes

### 2026-07-09 — Unit 03b QA + pre-merge polish

- Lighthouse mobile (prod build): Performance 88, Accessibility 92, Best Practices 96, SEO 100
- Plausible foundation: `lib/analytics.ts`, `PlausibleScript`, `register_cta_clicked` on landing CTAs
- Removed legacy `SocialProof.tsx`

### 2026-07-07 — Design system + doc consolidation

- Integrated Teal Forest brand into ui-tokens, ui-rules, mockup prompt
- Unit 03 landing merged to main

### 2026-06-27 — Documentation complete for V1.0 build

- 31 build units; all MVP features mapped
- Units 01–02 implemented and merged

---

## Build Velocity

| Phase                  | Units | Status                                         |
| ---------------------- | ----- | ---------------------------------------------- |
| Phase 0 — Foundation   | 01–08 | 01–03 merged; 03b QA complete; 04+ in progress |
| Phase 1 — AI Chains    | 09–14 | Not started                                    |
| Phase 2 — Student Core | 15–23 | Not started                                    |
| Phase 3 — Assessment   | 24–26 | Not started                                    |
| Phase 4 — Resilience   | 27–31 | Not started                                    |

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
