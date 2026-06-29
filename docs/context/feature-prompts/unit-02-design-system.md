# Unit 02: Design System + UI Tokens

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | Unit 02 |
| **Feature name** | Design System + UI Tokens |
| **Release** | V1.0 MVP |
| **Branch** | `feature/unit-02-design-system` |
| **Prerequisites** | Unit 01 merged to main. |

## Purpose and business objectives

Implement the visual foundation for a mobile-first African student audience. Ensures brand consistency and 44px touch targets before any student-facing pages.

## Problem statement

This unit is required to deliver **Design System + UI Tokens** as defined in `build-plan.md` Unit 02. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a developer, I can preview all design tokens and primitives on `/dev/ui`.
- As a student (future), I see consistent, accessible UI across all pages.

## Acceptance criteria

- [ ] All `ui-tokens.md` colors render on `/dev/ui`
- [ ] Buttons meet 44px min height on mobile
- [ ] No raw hex in component files
- [ ] shadcn/ui primitives installed and themed

## Prerequisites and dependencies

Unit 01 merged to main.

- **Prior units:** Unit 01
- **Read:** `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`

## Internal documentation (read before coding)

- [ ] docs/context/ui-tokens.md
- [ ] docs/context/ui-rules.md
- [ ] docs/context/ui-registry.md
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

- `globals.css` — all CSS variables from `ui-tokens.md`
- `tailwind.config.ts` — map variables to Tailwind classes
- Inter via `next/font/google`
- shadcn/ui: Button, Input, Card, Badge, Dialog, Skeleton, Toast
- `/dev/ui` demo page with primary, secondary, hint button variants

## Non-functional requirements

- Mobile-first: 360px primary viewport
- Min 16px body text

## Database and schema changes

- None

## Backend requirements and API contracts

- None

## Frontend requirements and user experience

- Token-based styling only — semantic color names
- Component files in `components/ui/`

## AI and agent requirements

No LLM calls in this unit.

## Authentication and authorization

Follow existing Auth.js middleware for any protected routes added.

## Security, privacy, and compliance

- `/dev/*` routes excluded from production nav (Unit 31)

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

- Invalid input → 400 with safe message
- Unauthorized → 401; wrong resource owner → 403
- Rate limit exceeded → 429 with retry guidance
- AI validation failure → flag for review, never partial marks to student

## Unit testing requirements

- [ ] N/A

## Integration testing requirements

- [ ] N/A

## End-to-end testing requirements

- [ ] Visual verification on 360px

## Browser validation requirements (manual)

- [ ] Open `/dev/ui` at 360px width — no horizontal scroll
- [ ] Tap all button variants — 44px touch targets
- [ ] Verify color contrast readable

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
4. Create branch `feature/unit-02-design-system`.
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

- [ ] `/dev/ui` renders all primitives
- [ ] `ui-registry.md` updated with primitive list
- [ ] No raw hex in `components/`

## Out of scope

- Student pages, business logic, API routes
