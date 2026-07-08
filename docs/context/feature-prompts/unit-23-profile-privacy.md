# Unit 23: Profile Page + Privacy Settings

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field             | Value                             |
| ----------------- | --------------------------------- |
| **Feature ID**    | Unit 23                           |
| **Feature name**  | Profile Page + Privacy Settings   |
| **Release**       | V1.0 MVP                          |
| **Branch**        | `feature/unit-23-profile-privacy` |
| **Prerequisites** | Unit 06 merged to main.           |

## Purpose and business objectives

Student settings, subject preferences, and MVP privacy controls for minors.

## Problem statement

This unit is required to deliver **Profile Page + Privacy Settings** as defined in `build-plan.md` Unit 23. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a student, I update my subject preferences.
- As a student under 16, I see parental consent status.
- As a student, I can request data export or delete my account.

## Acceptance criteria

- [ ] Subject toggle persists
- [ ] Delete account → logout → cannot login
- [ ] Data export writes audit log
- [ ] Offline queue count displays when queued (after Unit 27)

## Prerequisites and dependencies

Unit 06 merged to main.

- **Prior units:** 06, 19
- **Spec:** `specs/23-profile-privacy.md`
- **Read:** `security.md` § Data Protection (Minors)

## Internal documentation (read before coding)

- [ ] docs/context/design-brand-identity.md
- [ ] docs/context/ui-tokens.md
- [ ] docs/context/ui-rules.md
- [ ] docs/context/security.md
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

**UI sections:** Account · Subjects · Offline · Privacy · Data · Deletion

**APIs:**

- `PATCH /api/students/me` — preferences
- `POST /api/students/me/data-export` — queue job
- `POST /api/students/me/delete` — soft-delete

**Fields:** consent_given_at, consent_type, deleted_at

## Non-functional requirements

| Category          | Requirement                                                           |
| ----------------- | --------------------------------------------------------------------- |
| **Quality**       | TypeScript strict mode; no `any` without documented exception         |
| **Testing**       | Vitest unit tests for all new logic; integration tests for API routes |
| **Accessibility** | 360px viewport; 44px minimum touch targets; 16px minimum body text    |
| **Security**      | Zod validation at all boundaries; auth on protected routes            |
| **Performance**   | No LLM calls during question delivery; Server Components default      |

## Database and schema changes

No schema changes in this unit. Use existing tables via repositories.

## Backend requirements and API contracts

**UI sections:** Account · Subjects · Offline · Privacy · Data · Deletion

**APIs:**

- `PATCH /api/students/me` — preferences
- `POST /api/students/me/data-export` — queue job
- `POST /api/students/me/delete` — soft-delete

**Fields:** consent_given_at, consent_type, deleted_at

## Frontend requirements and user experience

No new student-facing UI in this unit.

## AI and agent requirements

No LLM calls in this unit.

## Authentication and authorization

- All routes require authenticated student session (Auth.js JWT)
- Ownership check: session.studentId must match auth user id
- Return 401 if unauthenticated; 403 if resource belongs to another user
- Apply AI rate limit middleware from Unit 08 on marking/hint routes

## Security, privacy, and compliance

- Soft delete sets deleted_at
- Invalidate session on delete
- Audit log on export and deletion requests
- No PII in export queue metadata

## Performance and scalability

| Metric  | Target                                  |
| ------- | --------------------------------------- |
| API p95 | < 3s for synchronous AI routes          |
| Build   | `npm run typecheck` passes all packages |

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

- [ ] Core logic covered with Vitest
- [ ] Valid and invalid input cases
- [ ] Schema validation edge cases

## Integration testing requirements

- [ ] API routes return correct status codes
- [ ] Auth middleware enforced on protected routes
- [ ] Repository layer tested against test database

## End-to-end testing requirements

- [ ] Manual E2E for MVP critical paths
- [ ] Automated E2E added in V1.1+ CI where applicable

## Browser validation requirements (manual)

- [ ] Toggle subject — persists after reload
- [ ] Delete account — cannot re-login
- [ ] Export request — toast confirmation

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
4. Create branch `feature/unit-23-profile-privacy`.
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

- [ ] All profile sections functional
- [ ] Deletion flow complete

## Out of scope

- Automated export email (V1.1), full parental workflow (V1.1)
