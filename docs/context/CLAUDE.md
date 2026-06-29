# CLAUDE.md — ExamEdge Context Entry Point

Read these files **in order** before any implementation work:

1. `docs/context/project-overview.md` — vision, Phase 1 scope, flows, MVP features
2. `docs/context/roadmap.md` — V1.0–V3.0 releases, expansion, deployment
3. `docs/context/zero-budget-stack.md` — free tiers, MVP cost reality (read before provisioning services)
4. `docs/context/platform-how-it-works.md` — learning loop, AI production, grounding
5. `docs/context/architecture.md` — stack, schema, API, invariants
6. `docs/context/security.md` — auth, RBAC, privacy MVP
7. `docs/context/ui-tokens.md` + `ui-rules.md` — before any UI unit
8. `docs/context/build-plan.md` — current unit specification (31 units)
9. `docs/context/progress-tracker.md` — what's done, what's next
10. `AGENTS.md` — five AI chains, guardrails (before any AI work)

Also reference:
- `docs/context/documentation-map.md` — find the right doc for any concern
- `docs/context/library-docs.md` — third-party integration patterns
- `docs/context/specs/` — per-unit specs for complex units
- `docs/demo-script.md` — competition demo walkthrough

**Platform:** AI-powered examination preparation and personalized learning for secondary students across Africa — beginning with GCE O/A Level in Cameroon, expanding to multiple curricula and national examination systems. Architecture: curriculum-agnostic.

**Budget:** Infrastructure $0/month on free tiers; Anthropic ~$5 starter credits for AI pilot.

After each unit: update `progress-tracker.md` and `ui-registry.md` (if UI).
