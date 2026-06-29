# Unit 17: Session API + Answer Submission

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | Unit 17 |
| **Feature name** | Session API + Answer Submission |
| **Release** | V1.0 MVP |
| **Branch** | `feature/unit-17-session-api` |
| **Prerequisites** | Units 05, 06, 08, 10, 13, and 16 merged to main. |

## Purpose and business objectives

Wire the study session to real backend — Pattern 1 from architecture.md. First end-to-end AI marking in the product.

## Problem statement

This unit is required to deliver **Session API + Answer Submission** as defined in `build-plan.md` Unit 17. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

- As a student, I submit an answer and receive M1/A1/B1 marks within 3 seconds.
- As the platform, I prevent duplicate submissions from double-charging AI.

## Acceptance criteria

- [ ] End-to-end submit → marks appear < 3s
- [ ] Duplicate idempotency key → cached result, no double AI call
- [ ] Low confidence → "Under review" badge
- [ ] `answer_submitted` Plausible event fires

## Prerequisites and dependencies

Units 05, 06, 08, 10, 13, and 16 merged to main.

- **Prior units:** 05, 06, 08, 10, 13, 16
- **Read:** architecture.md § Answer Submission, security.md

## Internal documentation (read before coding)

- [ ] docs/context/security.md
- [ ] docs/context/platform-how-it-works.md
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

**API routes:**
- `POST /api/sessions` — create `{ subjectId, mode: 'practice' }`
- `POST /api/sessions/:id/next-question` — serve question (mock pool OK if Unit 24 not done)
- `POST /api/sessions/:id/responses` — full Pattern 1 flow

**Route handler flow:**
auth → validate Zod → idempotency → mark scheme → runMarkingChain → transaction → async UVE → respond

**Repository:** `responsesRepository.submit()` — atomic INSERT + UPDATE mastery + UPDATE session

## Non-functional requirements

| Category | Requirement |
|----------|-------------|
| **Quality** | TypeScript strict mode; no `any` without documented exception |
| **Testing** | Vitest unit tests for all new logic; integration tests for API routes |
| **Accessibility** | 360px viewport; 44px minimum touch targets; 16px minimum body text |
| **Security** | Zod validation at all boundaries; auth on protected routes |
| **Performance** | No LLM calls during question delivery; Server Components default |

## Database and schema changes

No new tables. Uses existing `student_sessions`, `student_responses`, `mastery_records`.
`responsesRepository.submit()` performs atomic transaction: INSERT response + UPDATE mastery + UPDATE session counters.

## Backend requirements and API contracts

**POST /api/sessions/:id/responses**

Request:
```typescript
{
  questionId: string;
  answerText: string;
  answerType: "text" | "image";
  idempotencyKey: string; // UUID
  timeTakenS: number;
}
```

Response:
```typescript
{
  marksAwarded: MarkingResult;
  confidence: number;
  flagForReview: boolean;
  hintsRemaining: number;
}
```

## Frontend requirements and user experience

Wire Unit 16 study session UI to real APIs:
- Replace mock submit with `POST /api/sessions/:id/responses`
- Loading state on Submit: "Marking your answer..."
- Display MarkingDisplay from API response (marks, step feedback, confidence)
- Show "Under review" badge when `flagForReview` or confidence < 0.70
- Error state with retry button — never raw API error text to students
- Generate client UUID as idempotencyKey per submission

## AI and agent requirements

Follow AGENTS.md chain specifications exactly. Use getModelConfig() from packages/ai/router.ts. Zod-validate all LLM output before returning to clients. See functional requirements and architecture.md for trigger points.

## Authentication and authorization

- All routes require authenticated student session (Auth.js JWT)
- Ownership check: session.studentId must match auth user id
- Return 401 if unauthenticated; 403 if resource belongs to another user
- Apply AI rate limit middleware from Unit 08 on marking/hint routes

## Security, privacy, and compliance

- Ownership check: session belongs to authenticated user
- AI rate limit applied
- Idempotency before marking chain
- Sanitize answer text before LLM

## Performance and scalability

- Marking p95 < 3s
- UVE async — does not extend response time

## Logging, analytics, and observability

- Log: chain_type, model, tokens, latency_ms, confidence, requestId
- Sentry on unhandled errors

## Edge cases and failure scenarios

- Session not found → 404
- Session belongs to another user → 403
- Marking chain Zod failure → flag review, safe message
- AI timeout → retry once, then safe error

## Unit testing requirements

- [ ] Core logic covered with Vitest
- [ ] Valid and invalid input cases
- [ ] Schema validation edge cases

## Integration testing requirements

- [ ] Full submit flow with mocked chain
- [ ] Idempotency duplicate returns cache
- [ ] 403 for wrong user

## End-to-end testing requirements

- [ ] Browser submit → marks display

## Browser validation requirements (manual)

- [ ] Submit answer — marks appear
- [ ] Submit same idempotency key twice — same result
- [ ] Low confidence mock — review badge visible
- [ ] 360px: loading state during marking

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
4. Create branch `feature/unit-17-session-api`.
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

- [ ] Pattern 1 complete end-to-end
- [ ] UI loading/error states wired
- [ ] Plausible event fires

## Out of scope

- Real question pool (Unit 24), photo OCR (Unit 28)
