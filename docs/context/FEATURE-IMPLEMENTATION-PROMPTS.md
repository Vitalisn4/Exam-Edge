# Feature Implementation Prompts — ExamEdge

**Version:** 3.0 · **Date:** June 2026 · **Status:** Implementation playbook — copy-paste ready

This document is the **canonical implementation playbook** for ExamEdge. Every MVP unit (01–31) and post-MVP feature (F-32–F-56) has a dedicated, fully written prompt file with zero placeholders.

---

## How to use (every feature session)

1. Open `docs/context/progress-tracker.md` — confirm the prior unit/feature is **merged to `main`**.
2. Open the next prompt file from [`feature-prompts/`](feature-prompts/README.md) (build order below).
3. **Copy the entire prompt file** and paste it into Cursor chat (or any AI coding agent).
4. Wait for the agent to post **Context and Research Summary** before any code is written.
5. The agent implements, tests, validates in browser, opens a PR, passes code review, and merges.
6. Update `progress-tracker.md` after merge. **Do not start the next feature until merged.**

**Strict rule:** One feature · one branch · one PR · one merge · then next feature.

---

## Mandatory agent workflow (every prompt includes this)

1. Review all internal documentation listed in the prompt.
2. Study official documentation for all technologies involved.
3. Post Context and Research Summary before writing code.
4. Create the feature branch named in the prompt.
5. Implement exactly that feature — no scope creep.
6. Run `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px (if UI/API).
8. Update documentation listed in the prompt.
9. Commit with Conventional Commits.
10. Push branch and open Pull Request with Research Summary in PR body.
11. Complete code review checklist (`feature-development-prompts.md` §2c).
12. Address review comments; squash-merge only when approved and all checks pass.

---

## Supporting documents

| Document | Purpose |
|----------|---------|
| [`tech-stack-versions.md`](tech-stack-versions.md) | **Pinned versions**, official links, deprecations — read first every unit |
| [`feature-development-prompts.md`](feature-development-prompts.md) | Process, workflow §2–§2d, code review §2c, traceability matrix |
| [`feature-implementation-prompt-template.md`](feature-implementation-prompt-template.md) | 18-section template reference |
| [`build-plan.md`](build-plan.md) | MVP unit specifications |
| [`roadmap.md`](roadmap.md) | Post-MVP scope and priorities |
| [`AGENTS.md`](../AGENTS.md) | AI chain specifications |
| [`library-docs.md`](library-docs.md) | Official external doc URLs |

---

## Build order — prompt files


### MVP V1.0 — Phase 0 Foundation (Units 01–08)

- [Unit 01 Monorepo Scaffold](feature-prompts/unit-01-monorepo-scaffold.md)
- [Unit 02 Design System](feature-prompts/unit-02-design-system.md)
- [Unit 03 Landing Page](feature-prompts/unit-03-landing-page.md)
- [Unit 04 Katex Mathquill](feature-prompts/unit-04-katex-mathquill.md)
- [Unit 05 Database Schema](feature-prompts/unit-05-database-schema.md)
- [Unit 06 Auth Scaffold](feature-prompts/unit-06-auth-scaffold.md)
- [Unit 07 Plausible Analytics](feature-prompts/unit-07-plausible-analytics.md)
- [Unit 08 Redis Rate Limiting](feature-prompts/unit-08-redis-rate-limiting.md)

### MVP V1.0 — Phase 1 AI Chains (Units 09–14)

- [Unit 09 Model Router](feature-prompts/unit-09-model-router.md)
- [Unit 10 Marking Chain](feature-prompts/unit-10-marking-chain.md)
- [Unit 11 Guidance Chain](feature-prompts/unit-11-guidance-chain.md)
- [Unit 12 Generation Rag](feature-prompts/unit-12-generation-rag.md)
- [Unit 13 Uve Probes](feature-prompts/unit-13-uve-probes.md)
- [Unit 14 Curriculum Chain](feature-prompts/unit-14-curriculum-chain.md)

### MVP V1.0 — Phase 2 Student Core (Units 15–23)

- [Unit 15 Dashboard Ui Mock](feature-prompts/unit-15-dashboard-ui-mock.md)
- [Unit 16 Study Session Ui Mock](feature-prompts/unit-16-study-session-ui-mock.md)
- [Unit 17 Session Api](feature-prompts/unit-17-session-api.md)
- [Unit 18 Hint Flow](feature-prompts/unit-18-hint-flow.md)
- [Unit 19 Dashboard Real Data](feature-prompts/unit-19-dashboard-real-data.md)
- [Unit 20 Curriculum Explain Ui](feature-prompts/unit-20-curriculum-explain-ui.md)
- [Unit 21 Progress Page](feature-prompts/unit-21-progress-page.md)
- [Unit 22 Marking Appeals](feature-prompts/unit-22-marking-appeals.md)
- [Unit 23 Profile Privacy](feature-prompts/unit-23-profile-privacy.md)

### MVP V1.0 — Phase 3 Assessment (Units 24–26)

- [Unit 24 Question Pool](feature-prompts/unit-24-question-pool.md)
- [Unit 25 Exam Simulation](feature-prompts/unit-25-exam-simulation.md)
- [Unit 26 Focus Sessions](feature-prompts/unit-26-focus-sessions.md)

### MVP V1.0 — Phase 4 Resilience (Units 27–31)

- [Unit 27 Pwa Offline](feature-prompts/unit-27-pwa-offline.md)
- [Unit 28 Photo Ocr](feature-prompts/unit-28-photo-ocr.md)
- [Unit 29 Admin Validation](feature-prompts/unit-29-admin-validation.md)
- [Unit 30 Background Jobs](feature-prompts/unit-30-background-jobs.md)
- [Unit 31 Pilot Hardening](feature-prompts/unit-31-pilot-hardening.md)

### Post-MVP V1.1 (F-32–F-40)

- [F 32 React Native Mobile](feature-prompts/f-32-react-native-mobile.md)
- [F 33 Google Oauth](feature-prompts/f-33-google-oauth.md)
- [F 34 Teacher Dashboard](feature-prompts/f-34-teacher-dashboard.md)
- [F 35 Postgresql Rls](feature-prompts/f-35-postgresql-rls.md)
- [F 36 Jwt Refresh Blocklist](feature-prompts/f-36-jwt-refresh-blocklist.md)
- [F 37 Csp Csrf Headers](feature-prompts/f-37-csp-csrf-headers.md)
- [F 38 French I18N](feature-prompts/f-38-french-i18n.md)
- [F 39 Expanded Gce Subjects](feature-prompts/f-39-expanded-gce-subjects.md)
- [F 40 Uve L3 L4](feature-prompts/f-40-uve-l3-l4.md)

### Post-MVP V2.0 (F-41–F-51)

- [F 41 Automated Data Export](feature-prompts/f-41-automated-data-export.md)
- [F 42 Waec Neco](feature-prompts/f-42-waec-neco.md)
- [F 43 Kcse](feature-prompts/f-43-kcse.md)
- [F 44 Obc Francophone](feature-prompts/f-44-obc-francophone.md)
- [F 45 Graduate Success Hub](feature-prompts/f-45-graduate-success-hub.md)
- [F 46 Ussd Sms](feature-prompts/f-46-ussd-sms.md)
- [F 47 Whisper Oral Asr](feature-prompts/f-47-whisper-oral-asr.md)
- [F 48 Cognitive Fingerprint](feature-prompts/f-48-cognitive-fingerprint.md)
- [F 49 Alumni Mentors](feature-prompts/f-49-alumni-mentors.md)
- [F 50 Payment Subscription](feature-prompts/f-50-payment-subscription.md)
- [F 51 Local Model Routing](feature-prompts/f-51-local-model-routing.md)

### Post-MVP V3.0+ (F-52–F-56)

- [F 52 Syllabus Auto Chunking](feature-prompts/f-52-syllabus-auto-chunking.md)
- [F 53 Ministry Analytics](feature-prompts/f-53-ministry-analytics.md)
- [F 54 Public Api Multi Tenant](feature-prompts/f-54-public-api-multi-tenant.md)
- [F 55 Edge Integrity Analytics](feature-prompts/f-55-edge-integrity-analytics.md)
- [F 56 Ecosystem V4](feature-prompts/f-56-ecosystem-v4.md)


---

## Architecture invariants (never violate)

- No client-side AI calls — all LLM requests through Next.js API routes
- Zod-validated AI output before showing to students
- Socratic hints never reveal answers or mark scheme values
- Only `validated=true` questions enter the live student pool
- Haiku for marking (Sonnet for essay marking only)
- No student PII in LLM prompts
- Idempotency keys on all answer submissions
- Repositories only — no raw SQL in route handlers
- AI chains do not call other chains
- No LLM at question delivery — parameter instantiation only

---

*ExamEdge — research first, then implement. One feature at a time.*
