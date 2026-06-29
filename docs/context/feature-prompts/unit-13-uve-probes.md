# Unit 13: UVE Probe Chain (Basic MVP)

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | Unit 13 |
| **Feature name** | UVE Probe Chain (Basic MVP) |
| **Release** | V1.0 MVP |
| **Branch** | `feature/unit-13-uve-probes` |
| **Prerequisites** | Unit 09 merged to main. |

## Purpose and business objectives

Verify genuine understanding after answers. Differentiates mastery from answer consumption.

## Problem statement

This unit is required to deliver **UVE Probe Chain (Basic MVP)** as defined in `build-plan.md` Unit 13. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a student, I answer a follow-up probe that tests real understanding.
- As the platform, I update Mastery Validation Score without blocking marking response.

## Acceptance criteria

- [ ] L1 probe uses different params than original question
- [ ] Marking API returns before UVE completes
- [ ] MVS delta written to mastery_records

## Prerequisites and dependencies

Unit 09 merged to main.

- **Prior units:** 09, 10

## Internal documentation (read before coding)

- [ ] docs/context/tech-stack-versions.md
- [ ] AGENTS.md
- [ ] .cursorrules
- [ ] docs/context/progress-tracker.md
- [ ] docs/context/architecture.md
- [ ] docs/context/code-standards.md
- [ ] docs/context/documentation-map.md
- [ ] docs/context/library-docs.md
- [ ] docs/context/build-plan.md

## External documentation (official URLs — study before coding)

- **Node.js 22 LTS:** https://nodejs.org/docs/latest-v22.x/api/
- **Next.js 16 (App Router):** https://nextjs.org/docs
- **Next.js 15→16 upgrade:** https://nextjs.org/docs/app/guides/upgrading/version-16
- **React 19:** https://react.dev
- **TypeScript 5.x:** https://www.typescriptlang.org/docs/
- **Zod 4:** https://zod.dev/v4/changelog
- **Vitest:** https://vitest.dev/guide/
- **Drizzle ORM:** https://orm.drizzle.team/docs/overview
- **Auth.js v5:** https://authjs.dev
- **Neon PostgreSQL:** https://neon.tech/docs
- **Upstash Redis:** https://upstash.com/docs/redis
- **Anthropic API + models:** https://platform.claude.com/docs/en/about-claude/models/overview
- **LangChain.js:** https://js.langchain.com/docs/introduction/
- **KaTeX:** https://katex.org/docs/api.html
- **Tailwind CSS v4:** https://tailwindcss.com/docs/upgrade-guide
- **Tailwind + Next.js:** https://tailwindcss.com/docs/guides/nextjs
- **Plausible:** https://plausible.io/docs
- **Expo SDK 56:** https://docs.expo.dev/versions/v56.0.0

Also consult `docs/context/library-docs.md` § Official External Documentation for project-specific integration patterns. **Version authority:** `docs/context/tech-stack-versions.md` — do not use deprecated APIs listed there.

## Functional requirements

- `packages/ai/chains/uve.ts` — L1 (variable substitution), L2 (method transparency)
- Evaluation sub-chain: understandingLevel 0-4, mvsDelta
- Async trigger — never blocks marking response
- Store in `student_responses.uve_probes` JSONB

## Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Quality** | TypeScript strict mode; no `any` without documented exception |
| **Testing** | Vitest unit tests for all new logic; integration tests for API routes |
| **Accessibility** | 360px viewport; 44px minimum touch targets; 16px minimum body text |
| **Security** | Zod validation at all boundaries; auth on protected routes |
| **Performance** | No LLM calls during question delivery; Server Components default |

## Database and schema changes

No schema changes in this unit. Use existing tables via repositories.

## Backend requirements and API contracts

No new API routes in this unit.

## Frontend requirements and user experience

No new student-facing UI in this unit.

## AI and agent requirements

- L1-L2: Haiku only (MVP)
- L3-L4 deferred to V1.1

## Authentication and authorization

Follow existing Auth.js middleware for any protected routes added.

## Security, privacy, and compliance

- [ ] Follow docs/context/security.md for all new routes
- [ ] Zod validation on all inputs
- [ ] No secrets in client bundle
- [ ] Sanitize user text before LLM inclusion
- [ ] No student PII in AI prompts

## Performance and scalability

- Async only — marking response must not wait

## Logging, analytics, and observability

- Structured server logs with requestId on API routes
- Plausible events per code-standards.md when user actions fire
- Sentry for unhandled errors (required from Unit 31)

## Edge cases and failure scenarios

- Invalid input → 400 with safe message
- Unauthorized → 401; wrong resource owner → 403
- Rate limit exceeded → 429 with retry guidance
- AI validation failure → flag for review, never partial marks to student

## Unit testing requirements

- [ ] L1 param substitution differs from original

## Integration testing requirements

- [ ] Async completion writes MVS

## End-to-end testing requirements

- [ ] Manual E2E for MVP critical paths
- [ ] Automated E2E added in V1.1+ CI where applicable

## Browser validation requirements (manual)

- [ ] N/A for backend-only unit
- [ ] If UI touched: verify at 360px, no console errors, loading/empty/error states

## Documentation updates required after implementation

- [ ] docs/context/progress-tracker.md (after merge)
- [ ] docs/context/ui-registry.md (if UI components added)
- [ ] AGENTS.md (if AI chain behaviour changed)
- [ ] docs/context/library-docs.md (if new integration pattern established)

---
## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review all internal documents listed in this prompt — **start with `tech-stack-versions.md`** for pinned versions and deprecation list.
2. Study official documentation for every technology listed in External documentation; confirm versions match `tech-stack-versions.md` and note any newer patch releases.
3. Post **Context and Research Summary**: internal docs read, official sources consulted (with URLs), **confirmed package versions**, security advisories checked, best practices, architecture fit, risks, implementation approach, assumptions.
4. Create branch `feature/unit-13-uve-probes`.
5. Implement exactly this feature — no scope creep per `.cursorrules` §16.
6. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px viewport (if UI or API consumed by UI).
8. Update all documentation listed in Documentation updates.
9. Commit using Conventional Commits (e.g. `feat(scope): description`).
10. Push branch and open Pull Request to `main` with Research Summary in PR body.
11. Complete code review checklist in `feature-development-prompts.md` §2c (architecture, security, performance, tests, requirements, code quality).
12. Address all review comments. Squash-merge to `main` only when all tests pass, browser validated, and PR approved. Update `progress-tracker.md`. Do not start the next feature until merged.

**Architecture invariants (never violate):** no client-side AI; no unvalidated AI output to students; no hint answer leakage; only `validated=true` questions in live pool; Haiku for marking; no PII in LLM prompts; idempotency on answer submissions; repositories only (no raw SQL in routes); chains do not call chains; no LLM at question delivery.
---

## Definition of Done and merge requirements

- [ ] Probe generation + evaluation chains complete
- [ ] Async pattern documented for route handler (Unit 17)

## Out of scope

- L3-L4 probes (V1.1), UVE UI polish beyond Unit 16 mock
