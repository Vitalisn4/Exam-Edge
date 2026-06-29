# Unit 01: Monorepo Scaffold

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | Unit 01 |
| **Feature name** | Monorepo Scaffold |
| **Release** | V1.0 MVP |
| **Branch** | `feature/unit-01-monorepo-scaffold` |
| **Prerequisites** | None — first unit. |

## Purpose and business objectives

Establish the monorepo foundation so all subsequent features share types, database access, and AI chains. Enables parallel package development and CI from day one.

## Problem statement

This unit is required to deliver **Monorepo Scaffold** as defined in `build-plan.md` Unit 01. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a developer, I can run `npm run dev` and reach a health endpoint.
- As a developer, I can typecheck and lint all packages from the root.

## Acceptance criteria

- [ ] `npm run dev` starts `apps/web`
- [ ] `GET /api/health` returns `{ status: "ok", version: "0.1.0" }` with 200
- [ ] `npm run typecheck` passes all packages
- [ ] `npm run lint` passes
- [ ] `.env.example` lists all keys from `architecture.md`

## Prerequisites and dependencies

None — first unit.

- **Prior units:** None
- **Packages:** Next.js 16, Node.js 22 LTS, TypeScript 5.x, Turborepo, ESLint, Prettier, Husky

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

- npm workspaces: `apps/web`, `packages/db`, `packages/ai`, `packages/shared`
- TypeScript strict in all packages
- ESLint + Prettier + Husky pre-commit
- Turborepo pipeline for parallel builds
- Root scripts: `typecheck`, `lint`, `test`, `dev`

## Non-functional requirements

- Package aliases: `@examedge/db`, `@examedge/ai`, `@examedge/shared`
- No secrets in committed files

## Database and schema changes

- None (Unit 05)

## Backend requirements and API contracts

| Method | Route | Auth | Response |
|--------|-------|------|----------|
| GET | `/api/health` | Public | `{ status: "ok", version: "0.1.0" }` |

## Frontend requirements and user experience

- Minimal Next.js App Router shell in `apps/web`
- Root `layout.tsx` with Inter font placeholder

## AI and agent requirements

- None

## Authentication and authorization

Follow existing Auth.js middleware for any protected routes added.

## Security, privacy, and compliance

- `.env.example` with placeholder values only
- `.gitignore` includes `.env.local`

## Performance and scalability

- Turborepo caching for incremental builds

## Logging, analytics, and observability

- Console log on health check (dev only)

## Edge cases and failure scenarios

- Health route always returns 200 when server running

## Unit testing requirements

- [ ] Health route returns correct JSON

## Integration testing requirements

- [ ] N/A

## End-to-end testing requirements

- [ ] N/A

## Browser validation requirements (manual)

- [ ] Visit `/api/health` in browser — JSON response
- [ ] `npm run dev` — no startup errors

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
4. Create branch `feature/unit-01-monorepo-scaffold`.
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

- [ ] All acceptance criteria met
- [ ] `typecheck`, `lint`, `test` pass
- [ ] `progress-tracker.md` updated to Unit 02

## Out of scope

- Student UI, database, auth, AI packages beyond stubs
