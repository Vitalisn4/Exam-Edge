# F-42: KCSE (Kenya)

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | F-42 |
| **Feature name** | KCSE (Kenya) |
| **Release** | V2.0 |
| **Branch** | `feature/f-42-kcse` |
| **Prerequisites** | F-41 board onboarding pattern established. |

## Purpose

Add Kenya KCSE board with syllabus ingestion and marking conventions.

## Problem statement

Post-MVP expansion requires KCSE (Kenya) to scale ExamEdge beyond the Cameroon pilot.

## User value

KCSE (Kenya) unlocks the roadmap milestone described in roadmap.md for V2.0.

## User stories

- As a platform stakeholder, I need kcse (kenya) so that ExamEdge can expand per roadmap.md.
- As a developer, I implement kcse (kenya) without breaking MVP invariants.

## Acceptance criteria

- [ ] roadmap.md acceptance criteria for F-42 met

## Prerequisites

Complete these units/features before starting F-42:

F-41 board onboarding pattern established.

## Internal documentation (read before coding)

- [ ] docs/context/roadmap.md
- [ ] AGENTS.md
- [ ] .cursorrules
- [ ] docs/context/progress-tracker.md
- [ ] docs/context/architecture.md
- [ ] docs/context/code-standards.md
- [ ] docs/context/documentation-map.md
- [ ] docs/context/library-docs.md

## External documentation (official URLs)

- **Next.js 14:** https://nextjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Zod:** https://zod.dev
- **Vitest:** https://vitest.dev/guide/

## Technologies

- Drizzle
- Content pipeline

## Functional requirements

- KCSE board config and subject codes
- Syllabus ingestion pipeline reuse from F-41
- Mark scheme templates per KCSE convention
- Seed pilot topics for 3 launch subjects

## Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Quality** | TypeScript strict; no `any` types |
| **Testing** | Vitest unit tests for new logic |
| **Accessibility** | 360px viewport, 44px touch targets where UI exists |

## Database and data model

None

## API requirements

None

## Frontend requirements

None

## AI and agent requirements

None

## Authentication and authorization

None

## Security and privacy

- [ ] Follow security.md for any new routes
- [ ] Zod validation on all inputs
- [ ] No secrets in client bundle

## Performance and scalability

| Metric | Target |
|--------|--------|
| Build | `npm run typecheck` passes all packages |
| Tests | `npm run test` completes without timeout |

## Logging, monitoring, and analytics

- Structured server logs with requestId where applicable
- Sentry for unhandled errors (Unit 31+)
- Plausible events per code-standards.md when user actions fire

## Edge cases and failure modes

- Invalid input returns 400 with safe message
- Missing env vars fail fast at startup with clear error
- Graceful degradation when optional services unavailable

## Unit tests

- [ ] Core logic covered with Vitest
- [ ] Valid and invalid input cases
- [ ] Edge cases from section above

## Integration tests

- [ ] API routes return correct status codes (401/403/400/404 as applicable)
- [ ] Auth middleware enforced on protected routes

## End-to-end tests

- [ ] Manual E2E for MVP; automated E2E in V1.1+ CI
- [ ] Critical path verified on preview deploy

## Browser validation (manual)

- [ ] N/A for backend-only unit, or verify at 360px if UI touched
- [ ] No console errors
- [ ] Loading, empty, and error states checked

## Documentation updates

- [ ] docs/context/progress-tracker.md

---
## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review all internal documents listed in this prompt.
2. Study official documentation for every technology listed (URLs provided).
3. Post Context and Research Summary: internal docs read, official sources, best practices, architecture fit, risks, implementation approach, assumptions.
4. Create branch `feature/unit-NN-short-name` (or `feature/f-NN-short-name` for post-MVP).
5. Implement exactly this feature — no scope creep per .cursorrules §16.
6. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px (if UI/API).
8. Update documentation listed below.
9. Commit: Conventional Commits (`feat(scope): description`).
10. Push branch and open Pull Request to `main` with Research Summary in PR body.
11. Complete code review checklist (architecture, security, performance, tests, requirements, code quality) — see feature-development-prompts.md §2c.
12. Address review comments. Merge squash to `main` only when all tests pass, browser validated, PR approved. Update progress-tracker.md. Do not start the next feature until merged.

Architecture invariants (never violate): no client-side AI; no unvalidated AI to students; no hint answer leakage; validated=true only for questions; Haiku for marking; no PII in LLM prompts; idempotency on submissions; repositories only (no raw SQL in routes); no chain calls chain; no LLM at question delivery.
---

## Definition of done

- [ ] All acceptance criteria met and manually verified
- [ ] All functional requirements implemented without scope creep
- [ ] Unit and integration tests passing
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` all pass
- [ ] Browser validation complete (if UI/API)
- [ ] Security checklist satisfied
- [ ] Documentation updates committed
- [ ] PR opened with Research Summary, reviewed, squash-merged to `main`
- [ ] progress-tracker.md updated — only then start next feature

## Out of scope

- Features deferred to later units per build-plan.md and roadmap.md
- Do not implement adjacent units in the same PR
