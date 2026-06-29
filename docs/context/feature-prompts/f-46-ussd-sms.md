# F-46: USSD/SMS Access

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | F-46 |
| **Feature name** | USSD/SMS Access |
| **Release** | V2.0 |
| **Branch** | `feature/f-46-ussd-sms` |
| **Prerequisites** | Core API and auth complete. |

## Purpose and business objectives

Low-bandwidth access via Africa's Talking

## Problem statement

Post-MVP expansion requires **USSD/SMS Access** to scale ExamEdge beyond the Cameroon MVP pilot per `roadmap.md`.

## User value

USSD/SMS Access unlocks the roadmap milestone for **V2.0**, extending access, security, or platform capabilities for students, teachers, and institutional partners.

## User stories

- As a platform stakeholder, I need ussd/sms access so ExamEdge can expand per roadmap.md without breaking MVP invariants.
- As a developer, I implement ussd/sms access on a dedicated branch with full test coverage and documentation updates.
- As a student or teacher (where applicable), I benefit from ussd/sms access without regression to core marking, hints, or offline study flows.

## Acceptance criteria

- [ ] SMS daily practice prompt; USSD menu for streak/mastery summary

## Prerequisites and dependencies

Core API and auth complete.

## Internal documentation (read before coding)

- [ ] docs/context/platform-ecosystem-ops.md
- [ ] docs/context/zero-budget-stack.md
- [ ] docs/context/tech-stack-versions.md
- [ ] AGENTS.md
- [ ] .cursorrules
- [ ] docs/context/progress-tracker.md
- [ ] docs/context/architecture.md
- [ ] docs/context/code-standards.md
- [ ] docs/context/documentation-map.md
- [ ] docs/context/library-docs.md
- [ ] docs/context/build-plan.md
- [ ] docs/context/roadmap.md
- [ ] `platform-ecosystem-ops.md` · `zero-budget-stack.md`

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

Consult `docs/context/library-docs.md` for project integration patterns.

## Functional requirements

Implement USSD/SMS Access per roadmap.md and architecture.md.

## Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Quality** | TypeScript strict mode; no `any` without documented exception |
| **Testing** | Vitest unit tests for all new logic; integration tests for API routes |
| **Accessibility** | 360px viewport; 44px minimum touch targets; 16px minimum body text |
| **Security** | Zod validation at all boundaries; auth on protected routes |
| **Performance** | No LLM calls during question delivery; Server Components default |

## Database and schema changes

Document any schema changes in a Drizzle migration with rollback notes. Follow architecture.md naming conventions.

## Backend requirements and API contracts

Define REST routes with Zod request/response schemas. Document contracts in PR description.

## Frontend requirements and user experience

Follow `ui-tokens.md`, `ui-rules.md`, and `ui-context.md`. Mobile-first at 360px. Loading, empty, and error states required.

## AI and agent requirements

No new AI chains unless explicitly specified in roadmap.md. If chains added, follow AGENTS.md exactly — new chain requires architecture review.

## Authentication and authorization

Extend RBAC per security.md. Default role for new users remains student unless specified.

## Security, privacy, and compliance

- [ ] Follow docs/context/security.md
- [ ] Zod validation on all inputs
- [ ] No PII in LLM prompts
- [ ] Audit log for sensitive operations

## Performance and scalability

| Metric | Target |
|--------|--------|
| API p95 | < 3s for synchronous routes |
| Mobile | 512MB RAM target for mobile features |
| Offline | Core study flows work without network where specified |

## Logging, analytics, and observability

- Structured logs with requestId on new API routes
- Plausible events for new user-facing actions
- Sentry error capture on unhandled exceptions

## Edge cases and failure scenarios

- Invalid input → 400 with safe message
- Unauthorized → 401; insufficient role → 403
- External service failure → graceful degradation with user-safe message
- Feature flags for gradual rollout where risk is high

## Unit testing requirements

- [ ] Core logic covered with Vitest
- [ ] RBAC permission checks
- [ ] Zod schema valid/invalid cases

## Integration testing requirements

- [ ] API routes with auth scenarios
- [ ] Database repository integration tests
- [ ] Third-party webhook handlers (if applicable)

## End-to-end testing requirements

- [ ] Manual E2E on preview deploy
- [ ] Device testing for mobile features (F-32, F-46)
- [ ] Cross-browser smoke at 360px

## Browser validation requirements (manual)

- [ ] 360px viewport — no horizontal scroll
- [ ] No console errors on happy path
- [ ] Loading, empty, and error states verified

## Documentation updates required after implementation

- [ ] docs/context/progress-tracker.md
- [ ] docs/context/roadmap.md (if scope changed)
- [ ] AGENTS.md (if AI chains changed)
- [ ] docs/context/library-docs.md (new patterns)

---
## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review all internal documents listed in this prompt — **start with `tech-stack-versions.md`** for pinned versions and deprecation list.
2. Study official documentation for every technology listed in External documentation; confirm versions match `tech-stack-versions.md` and note any newer patch releases.
3. Post **Context and Research Summary**: internal docs read, official sources consulted (with URLs), **confirmed package versions**, security advisories checked, best practices, architecture fit, risks, implementation approach, assumptions.
4. Create branch `feature/f-46-ussd-sms`.
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
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` pass
- [ ] Code review checklist §2c complete
- [ ] PR squash-merged to main
- [ ] progress-tracker.md updated

## Out of scope

Full marking via SMS — link to web/PWA
