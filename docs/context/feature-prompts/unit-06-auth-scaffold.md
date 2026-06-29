# Unit 06: Auth Scaffold

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | Unit 06 |
| **Feature name** | Auth Scaffold |
| **Release** | V1.0 MVP |
| **Branch** | `feature/unit-06-auth-scaffold` |
| **Prerequisites** | Units 01 and 05 merged to main. |

## Purpose and business objectives

Secure student access via email/password. Protect all student and admin routes. Foundation for ownership checks on sessions and responses.

## Problem statement

This unit is required to deliver **Auth Scaffold** as defined in `build-plan.md` Unit 06. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a student, I can register with email, password, and examination level.
- As a student, I can log in and reach my dashboard.
- As an unauthenticated user, I cannot access protected routes.

## Acceptance criteria

- [ ] Register → login → lands on `/dashboard`
- [ ] Unauthenticated `/dashboard` → redirect `/login`
- [ ] Invalid credentials → 401 with clear message
- [ ] bcrypt factor 12 on registration

## Prerequisites and dependencies

Units 01 and 05 merged to main.

- **Prior units:** 01, 05
- **Read:** `security.md` § Authentication

## Internal documentation (read before coding)

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

**UI:** `/login`, `/register`, `/forgot-password` (Resend stub OK)

**Logic:**
- Auth.js v5 in `apps/web/lib/auth.ts`
- JWT HTTP-only cookie, SameSite=Lax
- `middleware.ts` — protect `(student)/*`, `(admin)/*`
- Role: `student` default on register
- Register fields: name, email, password, confirm, level (OL/AL)
- Under-16 parental consent checkbox (feeds Unit 23)

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

- Auth.js routes: `/api/auth/[...nextauth]`

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

- bcrypt factor 12
- Human-readable auth errors — never raw stack traces
- Redirect authenticated users from `/login` → `/dashboard`
- Password never logged

## Performance and scalability

| Metric | Target |
|--------|--------|
| API p95 | < 3s for synchronous AI routes |
| Build | `npm run typecheck` passes all packages |

## Logging, analytics, and observability

- Structured server logs with requestId on API routes
- Plausible events per code-standards.md when user actions fire
- Sentry for unhandled errors (required from Unit 31)

## Edge cases and failure scenarios

- Duplicate email registration → clear error
- Empty password → validation error
- Session expiry → redirect login

## Unit testing requirements

- [ ] Core logic covered with Vitest
- [ ] Valid and invalid input cases
- [ ] Schema validation edge cases

## Integration testing requirements

- [ ] Register, login, protected route redirect

## End-to-end testing requirements

- [ ] Full auth flow in browser

## Browser validation requirements (manual)

- [ ] Register new account
- [ ] Logout, login with same credentials
- [ ] Wrong password — friendly error
- [ ] Direct `/dashboard` while logged out — redirect

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
4. Create branch `feature/unit-06-auth-scaffold`.
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

- [ ] All three auth pages render on 360px
- [ ] Middleware protects student routes
- [ ] security.md checklist items for auth met

## Out of scope

- Google OAuth (V1.1), email verification enforcement, refresh token rotation
