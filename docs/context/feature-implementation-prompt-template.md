# Feature Implementation Prompt Template — ExamEdge

**Reusable template for every feature** — MVP units (01–31), post-MVP releases (V1.1+), and ad-hoc fixes.

> **Want to paste into chat?** Open the unit file in [`feature-prompts/`](feature-prompts/README.md) — includes mandatory **Context and Research Summary** before any code.

This file is the **18-section written spec** to save in `docs/context/specs/NN-name.md` for complex units.

**Rule:** Complete §2 and §2b before writing code. Post Context and Research Summary (§2b) in chat or PR.

**Authority:** Implements requirements from `build-plan.md` or `roadmap.md`. Defers to `AGENTS.md`, `.cursorrules`, and `architecture.md` on conflicts.

---

## How to Use

1. Copy this template for the feature you are implementing.
2. Complete **§1–§2b** (research) **before any code**.
3. Post **Context and Research Summary** (§2b) — mandatory gate.
4. Complete **§3–§13** before or during implementation.
5. Follow `feature-development-prompts.md` §2 (workflow) and §2b–§2d (lifecycle & merge gate).
6. Implement **one feature only**. Merge to `main` before the next feature.

**Session start command:**

```
Read docs/context/CHAT-IMPLEMENTATION-PROMPT.md and docs/context/specs/[NN-feature-name].md.
Post Context and Research Summary (§2b) before writing code.
Implement exactly one feature. Follow merge gate §2d in feature-development-prompts.md.
```

---

## 2. Relevant Documentation to Review

Complete **before** implementation. Check each box when read.

### Mandatory (all features)

- [ ] `docs/context/tech-stack-versions.md` — **pinned versions, deprecations, official links (read first)**
- [ ] `AGENTS.md` — AI chains, guardrails (if any AI touchpoint)
- [ ] `.cursorrules` — coding standards, MVP scope, invariants
- [ ] `docs/context/progress-tracker.md` — current phase; confirm prior units complete
- [ ] `docs/context/build-plan.md` or `roadmap.md` — feature spec
- [ ] `docs/context/architecture.md` — schema, API, invariants
- [ ] `docs/context/code-standards.md` — TypeScript, routes, testing
- [ ] `docs/context/documentation-map.md` — locate domain-specific docs
- [ ] `docs/context/library-docs.md` — project patterns **and** official doc URL table

### Conditional (check if applicable)

| Condition | Document |
|-----------|----------|
| Auth, API, privacy | `security.md` |
| UI work | `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`, `ui-context.md` |
| Third-party libs | `library-docs.md` § project section + § Official External Documentation |
| Student UX | `student-journey.md`, `project-overview.md` |
| Pedagogy / marking / hints | `platform-how-it-works.md` |
| AI chains / cost | `ai-cost-and-exam-system.md`, `ai-workflow-rules.md` |
| Content / curriculum | `content-architecture.md`, `content-governance.md` |
| KPIs / pilot | `learning-impact.md` |
| CI / ops / monitoring | `engineering-operations.md` |
| Infrastructure / cost | `zero-budget-stack.md` |
| Responsible AI | `docs/ExamEdge_Responsible_AI_Framework.md` |
| Deep engineering | `docs/ExamEdge_Engineering_Document.md` |
| Existing unit spec | `docs/context/specs/NN-*.md` |

---

## 2b. Technology Stack, Official Documentation & Research Summary

**Mandatory gate — no code until §2b is complete and posted.**

**First:** Read `docs/context/tech-stack-versions.md` and confirm pinned versions for every technology in this feature. Do not use APIs listed in § Deprecated.

### Technologies involved in this feature

| Technology / service | Pinned version | Used for | Official documentation URL |
|----------------------|----------------|----------|----------------------------|
| | From `tech-stack-versions.md` | | From `library-docs.md` § Official External Documentation |
| | | | |
| | | | |

### Official documentation review (per technology)

For each row above:

- [ ] Confirm version matches `tech-stack-versions.md` (verify latest patch via official docs or `npm show`)
- [ ] Read getting-started, API patterns, **changelog/migration guides**, and security sections from official docs
- [ ] Cross-check with `library-docs.md` project rules (project rules win on conflict)
- [ ] Note version-specific behaviour — do not use deprecated APIs from `tech-stack-versions.md` § Deprecated
- [ ] Check npm/GitHub security advisories for dependencies touched

### Context and Research Summary (post before coding)

```markdown
## Context and Research Summary — [Feature ID]: [Feature name]

### Internal documents reviewed
- [ ] docs/context/tech-stack-versions.md
- [ ] [list others]

### Confirmed technology versions
| Technology | Pinned (tech-stack-versions.md) | Verified against official docs | Notes |
|------------|----------------------------------|-------------------------------|-------|
| | | Y/N | |

### Official technology documentation consulted
| Technology | Source | Key practices adopted |
|------------|--------|----------------------|
| | | |

### Best practices identified
-

### Architectural considerations
-

### Risks, constraints, limitations
-

### Implementation approach
1.
2.

### Decisions, trade-offs, assumptions
-
```

### Engineering priorities (apply during implementation)

- [ ] Clean, maintainable, well-structured code
- [ ] Strong typing + Zod validation at boundaries
- [ ] Security by design
- [ ] Performance and scalability per unit NFRs
- [ ] Accessibility and usability (360px, 44px touch, 16px body)
- [ ] Proper error handling and observability
- [ ] Comprehensive tests and documentation updates

---

## 1. Feature Overview and Objectives

| Field | Value |
|-------|-------|
| **Feature ID** | Unit NN or F-NN |
| **Feature name** | |
| **Release** | V1.0 MVP / V1.1 / V2.0 / V3.0 / V4.0+ |
| **Business objective** | Why this feature exists — link to `strategic-charter.md` or `roadmap.md` |
| **System context** | Where this feature sits in the architecture (routes, packages, chains) |
| **Out of scope** | Explicit exclusions for this feature |

---

## 3. User Stories and Acceptance Criteria

### User stories

- As a **[role]**, I **[action]** so that **[outcome]**.

### Acceptance criteria (measurable)

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All criteria verifiable manually or by automated test

---

## 4. Functional Requirements

Detailed behavior. Reference `build-plan.md` unit spec — do not contradict.

- Requirement 1
- Requirement 2

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | e.g. marking p95 < 3s |
| **Accessibility** | 360px viewport, 16px min body, 44px touch targets, exam mode contrast |
| **Offline** | Required? Which flows must work offline? |
| **Cost** | Haiku vs Sonnet; no LLM at delivery time |
| **i18n** | English only MVP; French V1.1+ |
| **Reliability** | Fail-safe AI; never crash student session |

---

## 6. Database and Data Model Changes

| Item | Detail |
|------|--------|
| **Tables affected** | |
| **Migration file** | `packages/db/migrations/NNNN_*.sql` |
| **Repository functions** | |
| **Seed data changes** | |
| **Indexes** | |

Schema definitions: `architecture.md` — do not duplicate; link and note deltas only.

---

## 7. API Requirements and Contracts

| Method | Route | Auth | Request | Response | Errors |
|--------|-------|------|---------|----------|--------|
| | | | | | |

- Standard error shape: `architecture.md` § Error Response Standard
- Rate limiting tier: `security.md`
- Idempotency required? Y/N

---

## 8. Frontend Requirements and User Experience Expectations

| Item | Detail |
|------|--------|
| **Route(s)** | |
| **Components** | New / modified — update `ui-registry.md` |
| **Layout** | Mobile-first 360px; max-w-lg centered |
| **States** | Loading, empty, error, success |
| **Tokens** | Semantic colors only — no raw hex |
| **Exam mode** | If applicable: no navbar, paper-white bg |

---

## 9. AI and Agent Requirements

| Item | Detail |
|------|--------|
| **Chain(s)** | marking / guidance / generation / uve / curriculum / none |
| **Task type** | `getModelConfig(task)` value |
| **Model / temp / max tokens** | Per AGENTS.md |
| **Input schema** | |
| **Output schema (Zod)** | |
| **Sync vs async** | |
| **Anti-leakage / human gate** | Required checks |
| **PII in prompts** | Never — session_id only |

If no AI: write "N/A — no LLM calls in this feature."

---

## 10. Security and Privacy Considerations

- [ ] Auth + RBAC enforced at middleware AND route handler
- [ ] Resource ownership verified in repository
- [ ] Zod validation on all inputs
- [ ] User text sanitized before LLM (if applicable)
- [ ] No secrets in client bundle
- [ ] Minors' data controls (if applicable): `security.md` § Data Protection
- [ ] Audit log entries (if applicable): approve/reject, appeal, deletion
- [ ] Rate limiting applied

---

## 11. Performance and Scalability Requirements

| Metric | Target |
|--------|--------|
| Marking latency (if applicable) | p95 < 3s |
| Dashboard load | Server Components, no fetch waterfall |
| Question delivery | No LLM; Redis cache TTL 1h |
| Bundle | Dynamic import MathQuill/KaTeX on study pages |

---

## 12. Logging, Monitoring, and Analytics Requirements

| Item | Detail |
|------|--------|
| **Structured logs** | chain_type, model, tokens, latency_ms, requestId |
| **Sentry** | Capture unhandled errors |
| **Plausible events** | Exact name from `code-standards.md` — no PII in props |
| **Health checks** | If infra feature — extend `/api/health` |

---

## 13. Testing Requirements

### Unit tests

- [ ] Repository CRUD (if DB)
- [ ] Zod schemas — valid + invalid inputs
- [ ] Pure helpers (param instantiation, sanitize, etc.)
- [ ] Chain output validation (if AI — use fixtures)

### Integration tests

- [ ] API route: auth, RBAC, ownership, 400/401/403/404/409/429
- [ ] Idempotency duplicate handling (if applicable)
- [ ] DB transaction atomicity (if applicable)

### AI evaluation tests (if modifying chains)

- [ ] Marking: ≥92% agreement fixtures (Unit 10+)
- [ ] Guidance: zero leakage in 20 scenarios (Unit 11+)
- [ ] Generation: cross-exam ≥95% (Unit 12+)

### E2E tests (V1.1+ CI gate; manual for MVP)

- [ ] Critical user path on preview deploy

### Commands

```bash
npm run typecheck
npm run lint
npm run test
# npm run test:integration  # when available
# npm run test:e2e          # V1.1+
```

---

## 14. Pull Request and Code Review Requirements

### Branch and commit

- Branch: `feature/unit-NN-short-description` or `feature/f-NN-short-description`
- Commits: Conventional Commits — `feat(scope): description`
- Never commit: `.env.local`, secrets, credentials

### Pre-PR checklist

- [ ] All tests pass locally
- [ ] Manual browser validation complete (§16)
- [ ] No `any` types; no raw SQL in routes
- [ ] No client-side AI calls
- [ ] No unvalidated AI output to students
- [ ] Scope limited to this feature only
- [ ] Documentation updated (§17)

### Automated review (CI — GitHub Actions)

- [ ] `npm run lint` — pass
- [ ] `npm run typecheck` — pass
- [ ] `npm run test` — pass
- [ ] No secrets in diff (manual scan)

### Manual code review (CodeRabbit-style checklist)

Reviewers (or self-review with checklist) verify:

| Area | Check |
|------|-------|
| **Architecture** | Matches `architecture.md`; no invariant violations |
| **Security** | Auth, RBAC, sanitize, rate limits, no PII in prompts |
| **Performance** | No LLM at delivery; no client fetch waterfalls |
| **Tests** | Coverage for new logic; edge cases included |
| **Requirements** | All acceptance criteria addressed |
| **Documentation** | Traceable to build-plan/roadmap; no undocumented assumptions |
| **Code quality** | Readable, minimal diff, matches `code-standards.md` |
| **Educational correctness** | Hints never leak answers; marking follows rubric |
| **MVP scope** | No deferred features sneaked in |

### PR description template

```markdown
## Summary
[1-3 sentences — why this change]

## Unit / Feature
Unit NN: [name] | F-NN: [name]

## Test plan
- [ ] typecheck, lint, test pass
- [ ] Manual: [specific flows]
- [ ] 360px viewport verified

## Docs updated
- [ ] progress-tracker.md
- [ ] ui-registry.md (if UI)
- [ ] AGENTS.md (if chain behavior changed)

## Acceptance criteria
- [ ] [copy from §3]
```

---

## 15. Definition of Done

A feature is **done** only when ALL are true:

- [ ] All acceptance criteria (§3) met
- [ ] All functional requirements (§4) implemented
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing (where applicable)
- [ ] Manual validation (§16) complete
- [ ] Security checklist (§10) satisfied
- [ ] Accessibility: 360px, touch targets, no horizontal scroll
- [ ] `npm run typecheck`, `lint`, `test` pass
- [ ] Documentation updates (§17) complete
- [ ] `progress-tracker.md` updated
- [ ] PR opened, reviewed, approved — see §2d merge gate in `feature-development-prompts.md`
- [ ] Merged to `main` — only then start next feature

---

## 16. Manual Validation Checklist

### Browser validation (required for UI features)

- [ ] Test at **360px** viewport width (primary target device)
- [ ] Test at 768px and 1024px if layout changes
- [ ] No horizontal scroll on mobile
- [ ] No console errors in browser DevTools
- [ ] Loading, empty, and error states verified
- [ ] Complete user flow end-to-end

### Feature-specific manual tests

- [ ] Test 1
- [ ] Test 2

### Offline validation (Units 27+)

- [ ] Airplane mode behavior verified

### Security smoke tests (API features)

- [ ] Unauthenticated access → 401
- [ ] Wrong user resource → 403
- [ ] Invalid input → 400 with safe message

---

## 17. Documentation Updates

Update applicable docs when this feature ships:

| Document | Update when… |
|----------|--------------|
| `progress-tracker.md` | Always — mark unit complete |
| `ui-registry.md` | New or modified UI components |
| `architecture.md` | Schema, API, or pattern changes |
| `AGENTS.md` | Chain behavior, guardrails, router changes |
| `security.md` | Auth, privacy, or RBAC changes |
| `code-standards.md` | New Plausible events or conventions |
| `build-plan.md` | Only if MVP unit spec corrected |
| `roadmap.md` | Post-MVP feature shipped |
| `documentation-map.md` | New doc category added |
| `feature-development-prompts.md` | New unit or prompt correction |
| `README.md` | Setup steps or env vars changed |

**Commit convention for docs-only changes:** `docs(scope): description`

---

## 18. Post-Implementation Review and Retrospective

Complete within 24 hours of merge:

| Question | Answer |
|----------|--------|
| Did implementation match documentation? | Y/N — note deviations |
| Any undocumented assumptions made? | |
| Tests sufficient? | |
| Performance acceptable? | |
| Open questions for next unit? | |
| Blockers discovered? | |

Log answers in `progress-tracker.md` § Session Notes.

---

*Template v1.1 — June 2026 · ExamEdge*
*Research first: §2b + library-docs.md official URLs · CHAT-IMPLEMENTATION-PROMPT.md*
