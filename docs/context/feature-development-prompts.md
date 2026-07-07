# Feature Development Prompts — ExamEdge

**Implementation playbook and single source of truth for feature-by-feature development.**

| Attribute              | Value                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Version**            | 3.0                                                                                                              |
| **Date**               | June 2026                                                                                                        |
| **Scope**              | MVP V1.0 (31 units) + post-MVP roadmap (V1.1 → V4.0+)                                                            |
| **Authority**          | Implements `build-plan.md` + `roadmap.md`; defers to `AGENTS.md`, `.cursorrules`, `architecture.md` on conflicts |
| **Companion template** | `feature-implementation-prompt-template.md` (18-section reusable template)                                       |
| **Status**             | Phase 0 — no application code yet                                                                                |

---

## 0. Gap Analysis & Completeness Assessment (v2.0 Review)

### What v1.0 covered

| Area                                 | v1.0 status         | v2.0 remediation                                              |
| ------------------------------------ | ------------------- | ------------------------------------------------------------- |
| MVP units 01–31                      | ✅ Detailed prompts | Enhanced with universal requirements block (§3.6)             |
| Mandatory doc read order             | ✅ Partial          | Expanded full reference matrix (§1)                           |
| Development workflow                 | ⚠️ 8 steps only     | Full lifecycle §2 + git/PR/merge §2b–§2d                      |
| Code review process                  | ❌ Missing          | Formal CodeRabbit-style checklist §2c                         |
| Merge gate                           | ❌ Missing          | §2d — no merge without approval                               |
| Per-feature PR workflow              | ❌ Missing          | §2b steps 6–9                                                 |
| Accessibility requirements           | ⚠️ Implicit         | Explicit in §3.6 + template §5                                |
| E2E testing                          | ⚠️ Mentioned once   | Defined per phase in §3.6                                     |
| Post-MVP features                    | ⚠️ Index only       | Full prompts §5 (F-32 → F-55)                                 |
| Reusable 18-section template         | ⚠️ Abbreviated §6   | `feature-implementation-prompt-template.md`                   |
| Infrastructure docs                  | ⚠️ Partial refs     | `zero-budget-stack.md`, `engineering-operations.md` in matrix |
| Tier 3 engineering docs              | ⚠️ Not listed       | Added to conditional read list                                |
| Documentation update rules           | ⚠️ Partial          | Template §17 + §2b step 4                                     |
| Per-feature research + official docs | ❌ Missing in v2.0  | **§1b + Phase A0–A3** + Context and Research Summary          |
| Traceability                         | ✅ Unit matrix      | Extended with infra + ops docs                                |

### Authoritative hierarchy (conflict resolution)

1. **Identity:** `strategic-charter.md`
2. **MVP scope:** `project-overview.md` + `build-plan.md`
3. **Post-MVP scope:** `roadmap.md`
4. **AI behaviour:** `AGENTS.md` (never duplicate chain specs)
5. **Architecture:** `architecture.md`
6. **Security (MVP):** `security.md`
7. **Implementation process:** **this document** + `feature-implementation-prompt-template.md`
8. **Coding standards:** `.cursorrules` + `code-standards.md`

If Tier 1 context docs and Tier 3 engineering docs conflict on implementation, **Tier 1 wins** — update Tier 3 or add errata.

---

## How to Use This Document

**To implement a feature (recommended every session):**

1. Read `docs/context/progress-tracker.md` — confirm the prior unit/feature is **merged to `main`**.
2. Open **[`FEATURE-IMPLEMENTATION-PROMPTS.md`](FEATURE-IMPLEMENTATION-PROMPTS.md)** for the build-order index.
3. Open the next prompt file in **[`feature-prompts/`](feature-prompts/README.md)** (e.g. `unit-01-monorepo-scaffold.md`).
4. **Copy the entire prompt file** and paste it into Cursor chat.
5. Wait for the agent to post **Context and Research Summary** before any code is written.
6. Follow **§2 Mandatory Development Workflow** and **§2b–§2d** without skipping steps.
7. **Do not start the next feature** until §2d Merge Gate passes (merged to `main`).
8. Update `progress-tracker.md` after merge.

**Legacy helper (deprecated):** [`CHAT-IMPLEMENTATION-PROMPT.md`](CHAT-IMPLEMENTATION-PROMPT.md) — use individual prompt files instead; they contain zero placeholders.

**For process reference only:** §4 below duplicates unit summaries from the playbook; the **canonical copy-paste prompts** live in `feature-prompts/*.md`.

**Canonical build order:** Units 01 → 31 in `build-plan.md`. Post-MVP: F-32 → F-56 in `roadmap.md`.

**Strict rule:** One feature · one branch · one PR · one merge · then next feature.

---

## 1. Mandatory Document Read Order (Before Any Feature)

Before writing code for **any** feature, read these documents in order:

| #   | Document                                                                                   | Purpose                                                                                         |
| --- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | `AGENTS.md`                                                                                | AI chains, guardrails, model routing, evaluation thresholds                                     |
| 2   | `.cursorrules`                                                                             | IDE-enforced standards, MVP scope, invariants, git workflow                                     |
| 3   | `docs/context/strategic-charter.md`                                                        | Vision, mission, values (context only)                                                          |
| 4   | `docs/context/progress-tracker.md`                                                         | Current phase and unit; prior unit merged?                                                      |
| 5   | `docs/context/build-plan.md` or `roadmap.md`                                               | Current feature spec                                                                            |
| 6   | `docs/context/feature-development-prompts.md`                                              | This playbook — §2–§2d for current unit                                                         |
| 7   | `docs/context/feature-implementation-prompt-template.md`                                   | 18-section template (fill before coding)                                                        |
| 8   | `docs/context/architecture.md`                                                             | Invariants, schema, API contracts, env vars                                                     |
| 9   | `docs/context/security.md`                                                                 | Auth, RBAC, privacy (Units 06, 08, 17+, 23)                                                     |
| 10  | `docs/context/code-standards.md`                                                           | TypeScript, routes, testing, Plausible events                                                   |
| 11  | `docs/context/design-brand-identity.md` + `ui-tokens.md` + `ui-rules.md` + `ui-context.md` | **UI units only** — Teal Forest tokens, mastery heatmap, mockup: `examedge-ui-mockup-prompt.md` |
| 12  | `docs/context/library-docs.md`                                                             | Third-party integrations                                                                        |
| 13  | Unit-specific spec in `docs/context/specs/`                                                | If exists for current unit                                                                      |

### Complete documentation reference matrix

| Domain                       | Primary doc                                             | Supporting docs                                                                               |
| ---------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Identity & strategy          | `strategic-charter.md`                                  | `ExamEdge_Innovation_Document.md`                                                             |
| MVP product & flows          | `project-overview.md`                                   | `student-journey.md`, `demo-script.md`                                                        |
| Build order                  | `build-plan.md`                                         | `ExamEdge_AI_Driven_Build_Playbook.md`                                                        |
| Post-MVP releases            | `roadmap.md`                                            | `continent-scale-blueprint.md`                                                                |
| System architecture          | `architecture.md`                                       | `ExamEdge_Engineering_Document.md`                                                            |
| Security                     | `security.md`                                           | `ExamEdge_Responsible_AI_Framework.md`                                                        |
| AI chains & pedagogy         | `AGENTS.md`                                             | `platform-how-it-works.md`, `ai-cost-and-exam-system.md`, `ai-workflow-rules.md`              |
| Content model                | `content-architecture.md`                               | `content-governance.md`, `ExamEdge_Volume_V_Blueprint.md`                                     |
| UI system                    | `ui-tokens.md`, `ui-rules.md`                           | `design-brand-identity.md`, `examedge-ui-mockup-prompt.md`, `ui-registry.md`, `ui-context.md` |
| Testing & CI/CD              | `engineering-operations.md`                             | `.github/workflows/` (when created)                                                           |
| Infrastructure & cost        | `zero-budget-stack.md`                                  | `architecture.md` § env vars                                                                  |
| KPIs & pilot                 | `learning-impact.md`                                    | `project-overview.md` § success criteria                                                      |
| Ecosystem & ops              | `platform-ecosystem-ops.md`                             | `engineering-operations.md` § DR                                                              |
| Doc index                    | `documentation-map.md`                                  | `documentation-completeness-audit.md`                                                         |
| Coding standards             | `code-standards.md`                                     | `.cursorrules`                                                                                |
| **Technology official docs** | **`library-docs.md` § Official External Documentation** | Official vendor sites                                                                         |

---

## 1b. Documentation Research Requirement (Mandatory Before Any Code)

**No code until research is complete.** Every feature must ground implementation in internal project docs **and** official external documentation for each technology used. All versions must align with **`tech-stack-versions.md`** — the authoritative pinned stack.

### Step 0 — Confirm technology versions

1. Read `docs/context/tech-stack-versions.md` in full
2. Note pinned versions for every technology this unit touches
3. For each technology, verify the latest **stable patch** via official docs or `npm show <package> version`
4. Check § Deprecated in `tech-stack-versions.md` — do not implement deprecated patterns (e.g. Next.js 14, Tailwind v3 `@tailwind` directives, Zod 3-only APIs, Expo SDK 52 as target)
5. Record confirmed versions in the Context and Research Summary

### Step 1 — Identify technologies

List all frameworks, libraries, APIs, services, and tools the feature touches (e.g. Next.js, Drizzle, Auth.js, Anthropic API, KaTeX). Use the unit prompt §4 or `build-plan.md` Unit NN.

### Step 2 — Review internal documentation

Complete §1 Mandatory Read Order + **`tech-stack-versions.md`** + conditional docs for the feature domain. Check each box in `feature-implementation-prompt-template.md` §2.

### Step 3 — Study official external documentation

For each technology identified:

1. Find the official URL in `library-docs.md` § Official External Documentation (includes pinned version column)
2. Read relevant sections: getting started, API reference, **security**, **changelog/migration guides**, limitations, recommended patterns
3. Cross-check with `library-docs.md` project-specific rules (project rules override generic examples when they conflict)
4. Cross-check with `tech-stack-versions.md` pinned versions and Anthropic model IDs
5. Use web search or documentation MCP tools when APIs may have changed; note security advisories (npm audit, vendor status)

**Authority order:** Internal docs (`AGENTS.md`, `architecture.md`, `security.md`) → `library-docs.md` → **official vendor docs** → training knowledge (last resort — must flag in Research Summary)

### Step 4 — Context and Research Summary (required output)

Before writing any code, the agent **must produce and post** this summary (template in `CHAT-IMPLEMENTATION-PROMPT.md` Phase A3):

| Section                                     | Content                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------- |
| Internal documents reviewed                 | List with checkmarks — must include `tech-stack-versions.md`           |
| Confirmed technology versions               | Table: technology, pinned version, official source, patch verified Y/N |
| Official technology documentation consulted | Table: technology, URL, key practices adopted                          |
| Best practices identified                   | From official docs + library-docs.md                                   |
| Architectural considerations                | Fit with architecture.md; invariants preserved                         |
| Risks, constraints, limitations             | SSR issues, rate limits, cost, offline, etc.                           |
| Implementation approach                     | Ordered steps; files to create/modify                                  |
| Decisions, trade-offs, assumptions          | Document anything not explicit in project docs                         |

**Implementation may begin only after this summary is complete** (and any clarifying question answered).

### Step 5 — Apply during implementation

- Follow documented framework conventions (Next.js App Router, Drizzle repositories, Auth.js in route handlers)
- Strong typing + Zod at API and AI boundaries
- Security by design; performance and accessibility per unit NFRs
- Proper error handling with standard error shape + requestId
- Log and observe per `engineering-operations.md`
- Document implementation decisions in PR description

### Engineering priorities (all features)

| Priority                | Requirement                                                             |
| ----------------------- | ----------------------------------------------------------------------- |
| **Code quality**        | Clean, maintainable, readable — clarity over cleverness                 |
| **Typing & validation** | TypeScript strict; Zod at boundaries; no `any`                          |
| **Security**            | Auth, RBAC, sanitize, rate limits, no PII in prompts, no client secrets |
| **Performance**         | Marking < 3s; no LLM at delivery; Server Components; Redis cache        |
| **Accessibility**       | 360px, 16px body, 44px touch, semantic tokens, exam contrast            |
| **Error handling**      | Safe client messages; never crash student session; Sentry on server     |
| **Observability**       | Structured AI logs; Plausible events; health checks                     |
| **Testing**             | Unit + integration; manual 360px browser validation                     |
| **Documentation**       | Update progress-tracker, ui-registry, AGENTS, library-docs as needed    |

---

## 2. Mandatory Development Workflow

Every feature **must** follow this sequence. **Do not proceed to the next feature until §2d Merge Gate passes.**

### Phase A — Research & understand (before any code)

| Step | Action                                                               | Required output                                     |
| ---- | -------------------------------------------------------------------- | --------------------------------------------------- |
| A0   | Identify all technologies, libraries, APIs, services for this unit   | Technology list in chat prompt or spec §2b          |
| A1   | Read all internal docs in §1 + §1b Step 2                            | Checked read list                                   |
| A2   | Study official external docs per §1b Step 3 + `library-docs.md` URLs | Notes on API patterns and limitations               |
| A3   | **Post Context and Research Summary**                                | Mandatory — see §1b Step 4; **no code before this** |
| A4   | Read unit prompt §4 or post-MVP §5                                   | System context understood                           |
| A5   | Verify prior unit/feature merged to `main`                           | `progress-tracker.md` confirms                      |
| A6   | Fill template §1–§13 (complex units) OR use CHAT prompt              | Spec in `specs/NN-*.md` if needed                   |
| A7   | Confirm env vars / dependencies provisioned                          | Neon, Redis, API keys per unit                      |

### Phase B — Implement

| Step | Action                                      | Rule                              |
| ---- | ------------------------------------------- | --------------------------------- |
| B1   | Create branch `feature/unit-NN-description` | Never commit directly to `main`   |
| B2   | UI first with mock data (UI units)          | Verified on 360px before backend  |
| B3   | Logic, API, repositories, chains            | Match `build-plan.md` exactly     |
| B4   | Minimize diff — current feature only        | No scope creep (.cursorrules §16) |

### Phase C — Test & validate

| Step | Action                    | Command / method                                                        |
| ---- | ------------------------- | ----------------------------------------------------------------------- |
| C1   | Unit tests                | `npm run test`                                                          |
| C2   | Integration tests         | `npm run test:integration` (when available; required for API units 06+) |
| C3   | Static analysis           | `npm run typecheck` · `npm run lint`                                    |
| C4   | Manual browser validation | 360px viewport — template §16                                           |
| C5   | Security smoke tests      | Auth 401, ownership 403, rate limit 429                                 |
| C6   | Accessibility check       | 16px body, 44px touch, contrast, no horizontal scroll                   |
| C7   | Performance spot-check    | Marking < 3s; no client fetch waterfall                                 |
| C8   | Edge cases                | Empty states, AI failure, offline (if applicable)                       |
| C9   | Alignment audit           | AGENTS.md + .cursorrules + architecture invariants §3.1                 |

### Phase D — Review, document, merge

See **§2b Engineering Lifecycle** and **§2c Code Review Process**.

**Pre-completion commands (all units — must pass before PR):**

```bash
npm run typecheck
npm run lint
npm run test
```

**Session start prompt (copy to agent):**

```
Read docs/context/CHAT-IMPLEMENTATION-PROMPT.md — copy ---START--- to ---END---, fill placeholders, paste.
Do NOT write code until Context and Research Summary (Phase A3) is posted.
Then implement Unit [NN] per build-plan.md and feature-development-prompts.md Unit [NN].
Study library-docs.md + official external docs for every technology in the unit.
Follow §2–§2d workflow. Merge gate before next feature.
```

---

## 2b. Engineering Lifecycle (After Each Feature)

Execute in order after Phase C passes:

| Step | Action                            | Detail                                                                   |
| ---- | --------------------------------- | ------------------------------------------------------------------------ |
| 1    | **Implement**                     | Feature complete per documented requirements (Phase B)                   |
| 2    | **Execute tests**                 | Unit + integration + E2E (when CI available) — all green                 |
| 3    | **Manual browser validation**     | Template §16 — UX behaves as expected                                    |
| 4    | **Update documentation**          | Template §17 — progress-tracker, ui-registry, AGENTS if needed           |
| 5    | **Lint, format, static analysis** | `npm run typecheck` · `npm run lint` · Husky pre-commit                  |
| 6    | **Security self-check**           | Template §10 — no secrets in diff, invariants satisfied                  |
| 7    | **Commit**                        | Conventional Commits: `feat(scope): description` — see `.cursorrules` §9 |
| 8    | **Push branch**                   | `git push -u origin feature/unit-NN-description`                         |
| 9    | **Open Pull Request**             | Target: `main` — use PR template in template §14                         |
| 10   | **Code review**                   | §2c — automated + manual checklist                                       |
| 11   | **Address review comments**       | Re-run tests after changes                                               |
| 12   | **Merge**                         | Squash merge only — §2d Merge Gate                                       |
| 13   | **Post-implementation review**    | Template §18 — session notes in progress-tracker                         |

**Git rules (from `.cursorrules`):**

- Main branch always deployable
- Squash merge to `main`
- Never force push to `main`
- Never commit `.env.local`, secrets, API keys
- PR required even for solo dev — documents decisions

---

## 2c. Formal Code Review Process

Every Pull Request undergoes review equivalent to automated tools (CodeRabbit, Bugbot) **plus** human judgment. Solo developers perform self-review using this checklist — do not merge without completing it.

### Automated review (CI — must pass)

| Check             | Tool                          | Blocker?              |
| ----------------- | ----------------------------- | --------------------- |
| ESLint            | `npm run lint`                | Yes                   |
| TypeScript strict | `npm run typecheck`           | Yes                   |
| Unit tests        | `npm run test`                | Yes                   |
| Integration tests | `npm run test:integration`    | Yes (when configured) |
| E2E tests         | `npm run test:e2e` on preview | V1.1+ gate            |
| Secret scanning   | Manual / git diff review      | Yes                   |

### Manual review checklist

#### Architecture & design

- [ ] Matches `architecture.md` folder structure and layer rules
- [ ] No architecture invariant violations (§3.1)
- [ ] Business logic in repositories/chains — not route handlers or components
- [ ] No undocumented deviations from build-plan or roadmap

#### Security

- [ ] Auth + RBAC at middleware AND route handler
- [ ] Resource ownership verified in repository
- [ ] Zod validation on all POST/PATCH bodies
- [ ] No PII in LLM prompts or analytics props
- [ ] Rate limiting on authenticated AI endpoints
- [ ] Idempotency on answer submissions
- [ ] No secrets in client bundle or committed files

#### Performance

- [ ] No LLM at question delivery time
- [ ] Server Components for dashboard/progress — no fetch waterfall
- [ ] Dynamic import for MathQuill/KaTeX on study pages
- [ ] Marking synchronous path < 3s target

#### Tests & quality

- [ ] New logic has unit tests
- [ ] API routes have integration tests (auth, 403, 400)
- [ ] AI chain changes have fixture tests
- [ ] No `any` types in production code
- [ ] No commented-out code or TODO in committed code

#### Requirements alignment

- [ ] All acceptance criteria from unit prompt met
- [ ] MVP scope not exceeded (.cursorrules §16)
- [ ] Educational correctness: hints never leak answers
- [ ] Human validation gate preserved for questions

#### Code quality

- [ ] Readable — clarity over cleverness
- [ ] Matches `code-standards.md` and `.cursorrules`
- [ ] Minimal diff — only current feature
- [ ] Comments explain WHY not WHAT

### Review outcomes

| Outcome             | Action                                 |
| ------------------- | -------------------------------------- |
| **Approve**         | All blockers resolved → proceed to §2d |
| **Request changes** | Fix issues → re-run CI → re-review     |
| **Reject (scope)**  | Remove out-of-scope code → re-submit   |

---

## 2d. Merge Gate (No Merge Until All True)

**No feature merges to `main` until every item is checked:**

### Tests & validation

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] Integration tests pass (if applicable)
- [ ] Manual browser validation complete (360px + full user flow)
- [ ] No console errors in browser during manual test
- [ ] Security smoke tests pass (401/403/429 as applicable)
- [ ] Accessibility: 16px body, 44px touch targets, no horizontal scroll

### Documentation

- [ ] `progress-tracker.md` updated (after merge, in step 13)
- [ ] `ui-registry.md` updated (if UI components added)
- [ ] `AGENTS.md` updated (if chain behaviour changed)
- [ ] `architecture.md` updated (if schema/API changed)
- [ ] Spec file in `docs/context/specs/` complete (if new feature)

### Code review

- [ ] PR opened with description and test plan
- [ ] §2c automated checks pass in CI
- [ ] §2c manual checklist completed
- [ ] All review comments addressed
- [ ] PR approved (self-approval OK for solo dev with checklist documented in PR)

### Acceptance

- [ ] All acceptance criteria from unit prompt satisfied
- [ ] Definition of Done (template §15) satisfied
- [ ] No known blockers for next unit

**Only after merge:** begin next feature. Update `progress-tracker.md` § Current Goal to next unit.

---

## 2e. Optional: GitHub Project Board (Team Tracking)

ExamEdge already has a **complete implementation system** — you do not need a separate issues document.

| Need                        | Use this (SSOT)                 |
| --------------------------- | ------------------------------- |
| What to build               | `build-plan.md` — Unit NN       |
| Copy-paste agent prompt     | `feature-prompts/unit-NN-*.md`  |
| Process, review, merge gate | **this document** §2–§2d        |
| Current status              | `progress-tracker.md`           |
| Per-unit written spec       | `specs/NN-*.md` where it exists |

**If you want GitHub Issues for visibility** (like NombaFlow), mirror the existing docs — do not duplicate them:

1. Create labels: `type:setup`, `type:frontend`, `type:backend`, `type:ai`, `type:database`, `type:devops`, `priority:critical|high|medium|low`, `milestone:phase-0` through `phase-4`
2. Create milestones matching build-plan phases (Foundation, AI Chains, Student Core, Assessment, Resilience)
3. For each unit NN: create one GitHub issue whose body is **`feature-prompts/unit-NN-*.md`** + link to `build-plan.md` Unit NN
4. Set Depends on / Blocks from the **Unit Index** table in `build-plan.md`
5. Project board columns: Backlog → Ready → In Progress → In Review → Done
6. Definition of Done = **§2d Merge Gate** above (not a second checklist)

**Rule:** When implementation docs and a GitHub issue disagree, **`build-plan.md` + `feature-prompts/` win.**

---

## 3. Global Constraints (All Features)

### 3.1 Architecture Invariants (Never Violate)

1. No client-side AI/Anthropic calls
2. No unvalidated AI output to students (Zod required)
3. No answer revelation in Socratic hints
4. No unvalidated questions served (`validated=true` required)
5. No Sonnet for high-frequency marking
6. No PII (names/emails) in LLM prompts
7. Idempotency on all answer submissions
8. No raw SQL in route handlers — repositories only
9. No chain calls another chain — orchestration in routes/cron only
10. Parameter instantiation at question delivery — no LLM

### 3.2 MVP Exclusions (Do Not Build Unless Explicitly Requested)

React Native app · Google OAuth · Teacher dashboard · 16 subjects · French UI · OBC/WAEC boards · Whisper ASR · Fine-tuned models · Payment system

### 3.3 Error Response Contract

All API errors return:

```typescript
{
  error: {
    code: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND"
         | "IDEMPOTENCY_DUPLICATE" | "AI_VALIDATION_FAILED" | "RATE_LIMITED"
         | "INTERNAL_ERROR",
    message: string,
    status: number,
    requestId: string,
  }
}
```

### 3.4 Plausible Events (Exact Names Only)

`session_started` · `answer_submitted` · `hint_requested` · `exam_completed` · `topic_mastered` · `offline_sync` · `appeal_submitted`

### 3.5 Threshold Constants

Import from `@examedge/shared/constants/thresholds` — never hardcode:

`CONFIDENCE_THRESHOLD=0.70` · `MAX_HINTS_PER_QUESTION=3` · `HINT_TRIGGER_PERCENT=0.50` · `QUESTION_POOL_MIN=50` · `QUESTION_EXCLUSION_DAYS=30`

### 3.6 Universal Per-Feature Requirements (Apply to Every Unit §4 Prompt)

**Every unit prompt below is supplemented by this block** and **§1b Documentation Research**. Each unit must also satisfy template §14–§18.

| Requirement                        | Standard                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Technology research**            | Identify all tech; read `library-docs.md` + official vendor docs; post Context and Research Summary **before code** |
| **Context understanding**          | Agent reads §1 + §1b docs; understands feature in system architecture                                               |
| **Implementation**                 | Matches `build-plan.md` + official framework conventions — not assumptions                                          |
| **Unit tests**                     | Required for all logic, repos, chains, helpers                                                                      |
| **Integration tests**              | Required for API routes (Units 06+)                                                                                 |
| **E2E tests**                      | Manual MVP; automated Playwright V1.1+                                                                              |
| **Manual browser test**            | 360px viewport; full user flow; no console errors                                                                   |
| **Security**                       | `security.md` checklist for auth/API/AI units                                                                       |
| **Accessibility**                  | 16px min body, 44px touch, semantic tokens, exam contrast                                                           |
| **Performance**                    | Per `architecture.md` and unit-specific targets                                                                     |
| **Error handling & observability** | Standard error shape, requestId, Sentry, AI structured logs                                                         |
| **Edge cases**                     | Empty, error, AI failure, offline — per unit                                                                        |
| **AGENTS.md compliance**           | All AI units follow chain specs exactly                                                                             |
| **.cursorrules compliance**        | Scope, naming, git, no `any`                                                                                        |
| **PR includes research**           | Context and Research Summary in PR description                                                                      |
| **Definition of Done**             | Template §15 + §2d Merge Gate                                                                                       |
| **PR & code review**               | §2b + §2c before merge                                                                                              |
| **Documentation updates**          | Template §17 + `library-docs.md` if new integration pattern                                                         |
| **Retrospective**                  | Template §18 in progress-tracker                                                                                    |

---

## 4. MVP Feature Prompts (Units 01–31)

Each prompt below is **implementation-ready** for unit-specific behaviour. **Also satisfy §1b, §3.6, §2 workflow, §2b–§2d, and post Context and Research Summary before coding.**

Copy the unit block + `CHAT-IMPLEMENTATION-PROMPT.md` to start a development session.

**Technologies:** See `build-plan.md` Unit NN + map to `library-docs.md` official URLs.

---

### Unit 01: Monorepo Scaffold

#### Purpose & Business Objective

Establish the monorepo foundation so all subsequent features share types, database access, and AI chains. Enables parallel package development and CI from day one.

#### User Stories

- As a developer, I can run `npm run dev` and reach a health endpoint.
- As a developer, I can typecheck and lint all packages from the root.

#### Acceptance Criteria

- [ ] `npm run dev` starts `apps/web`
- [ ] `GET /api/health` returns `{ status: "ok", version: "0.1.0" }` with 200
- [ ] `npm run typecheck` passes all packages
- [ ] `npm run lint` passes
- [ ] `.env.example` lists all keys from `architecture.md`

#### Functional Requirements

- npm workspaces: `apps/web`, `packages/db`, `packages/ai`, `packages/shared`
- TypeScript strict in all packages
- ESLint + Prettier + Husky pre-commit
- Turborepo pipeline for parallel builds
- Root scripts: `typecheck`, `lint`, `test`, `dev`

#### Non-Functional Requirements

- Package aliases: `@examedge/db`, `@examedge/ai`, `@examedge/shared`
- No secrets in committed files

#### Dependencies

- **Prior units:** None
- **Packages:** Next.js 16, Node.js 22 LTS, TypeScript 5.x, Turborepo, ESLint, Prettier, Husky

#### Database / Schema

- None (Unit 05)

#### API Requirements

| Method | Route         | Auth   | Response                             |
| ------ | ------------- | ------ | ------------------------------------ |
| GET    | `/api/health` | Public | `{ status: "ok", version: "0.1.0" }` |

#### Frontend Requirements

- Minimal Next.js App Router shell in `apps/web`
- Root `layout.tsx` with Inter font placeholder

#### AI / Agent Interactions

- None

#### Security Considerations

- `.env.example` with placeholder values only
- `.gitignore` includes `.env.local`

#### Edge Cases & Error Handling

- Health route always returns 200 when server running

#### Performance & Scalability

- Turborepo caching for incremental builds

#### Logging, Analytics & Observability

- Console log on health check (dev only)

#### Testing Requirements

| Type        | Scope                             |
| ----------- | --------------------------------- |
| Unit        | Health route returns correct JSON |
| Integration | N/A                               |
| E2E         | N/A                               |

#### Definition of Done

- [ ] All acceptance criteria met
- [ ] `typecheck`, `lint`, `test` pass
- [ ] `progress-tracker.md` updated to Unit 02

#### Manual Testing Checklist

- [ ] Visit `/api/health` in browser — JSON response
- [ ] `npm run dev` — no startup errors

#### Out of Scope

- Student UI, database, auth, AI packages beyond stubs

---

### Unit 02: Design System + UI Tokens

#### Purpose & Business Objective

Implement the visual foundation for a mobile-first African student audience. Ensures brand consistency and 44px touch targets before any student-facing pages.

#### User Stories

- As a developer, I can preview all design tokens and primitives on `/dev/ui`.
- As a student (future), I see consistent, accessible UI across all pages.

#### Acceptance Criteria

- [ ] All `ui-tokens.md` colors render on `/dev/ui`
- [ ] Buttons meet 44px min height on mobile
- [ ] No raw hex in component files
- [ ] shadcn/ui primitives installed and themed

#### Functional Requirements

- `globals.css` — all CSS variables from `ui-tokens.md`
- `tailwind.config.ts` — map variables to Tailwind classes
- Inter via `next/font/google`
- shadcn/ui: Button, Input, Card, Badge, Dialog, Skeleton, Toast
- `/dev/ui` demo page with primary, secondary, hint button variants

#### Non-Functional Requirements

- Mobile-first: 360px primary viewport
- Min 16px body text

#### Dependencies

- **Prior units:** Unit 01
- **Read:** `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`

#### Database / Schema

- None

#### API Requirements

- None

#### Frontend Requirements

- Token-based styling only — semantic color names
- Component files in `components/ui/`

#### Security Considerations

- `/dev/*` routes excluded from production nav (Unit 31)

#### Testing Requirements

| Type        | Scope                        |
| ----------- | ---------------------------- |
| Unit        | N/A                          |
| Integration | N/A                          |
| Manual      | Visual verification on 360px |

#### Definition of Done

- [ ] `/dev/ui` renders all primitives
- [ ] `ui-registry.md` updated with primitive list
- [ ] No raw hex in `components/`

#### Manual Testing Checklist

- [ ] Open `/dev/ui` at 360px width — no horizontal scroll
- [ ] Tap all button variants — 44px touch targets
- [ ] Verify color contrast readable

#### Out of Scope

- Student pages, business logic, API routes

---

### Unit 03: Landing Page UI

#### Purpose & Business Objective

Convert visitors into registered students. Communicates ExamEdge differentiation: examiner marking, Socratic hints, understanding verification — not a homework solver.

#### User Stories

- As a prospective student, I understand what ExamEdge does within 30 seconds.
- As a visitor, I can navigate to register or login.
- As an authenticated student visiting `/`, I am redirected to dashboard.

#### Acceptance Criteria

- [ ] Landing renders on 360px without horizontal scroll
- [ ] All CTAs use token classes
- [ ] Authenticated user on `/` → redirect `/dashboard`
- [ ] No API calls — static content only
- [ ] `ui-registry.md` updated

#### Functional Requirements

See `build-plan.md` Unit 03 and `specs/03-landing-page.md`.

**Sections:** Navbar · Hero · Features (3 value props) · How it works (4 steps) · Social proof placeholder · Bottom CTA · Footer

**Copy alignment:** `student-journey.md` §2.1 — honest scope ("starting with GCE Board Buea")

#### Dependencies

- **Prior units:** 01, 02
- **Spec:** `specs/03-landing-page.md`

#### API Requirements

- None (static). Auth redirect via middleware/session check only.

#### Frontend Requirements

- `app/page.tsx` — public, not behind auth layout
- lucide-react icons for features
- Mobile single column, max-w-lg centered on desktop

#### Security Considerations

- No user data on landing page
- Privacy/Contact links are stubs (OK for MVP)

#### Definition of Done

- [ ] Full landing visible without API
- [ ] Auth redirect works
- [ ] Spec verification checklist complete

#### Manual Testing Checklist

- [ ] Unauthenticated: all CTAs navigate correctly
- [ ] Authenticated: `/` redirects to `/dashboard`
- [ ] 360px: no overflow, readable text
- [ ] No console errors

#### Out of Scope

- Real testimonials, pricing, subject catalog, API integration

---

### Unit 04: KaTeX + MathQuill Integration

#### Purpose & Business Objective

Enable mathematical notation for GCE Pure Mathematics (0765). Foundation for question display and answer input in study sessions.

#### User Stories

- As a student, I see equations rendered clearly in questions.
- As a student, I input mathematical answers via a WYSIWYG editor.
- As a bad LaTeX input, the page does not crash.

#### Acceptance Criteria

- [ ] Sample expressions render without error on `/dev/math`
- [ ] MathInput exports valid LaTeX string on change
- [ ] Bad LaTeX shows error message, not crash
- [ ] `trust: false` on KaTeX

#### Functional Requirements

- `components/math/MathDisplay.tsx` — KaTeX wrapper, error boundary
- `components/math/MathInput.tsx` — MathQuill, dynamic import, `ssr: false`
- `packages/shared/lib/math.ts` — LaTeX validation helpers
- `/dev/math` test page with differentiation, integration, vectors samples

#### Dependencies

- **Prior units:** 01, 02
- **Read:** `library-docs.md` for KaTeX/MathQuill setup

#### API Requirements

- None

#### Frontend Requirements

- Error boundary around all math renderers
- Dynamic import to avoid SSR issues with MathQuill

#### Security Considerations

- KaTeX `trust: false` — no arbitrary HTML execution

#### Edge Cases

- Empty LaTeX input
- Malformed `\frac` without closing brace
- Very long expressions

#### Testing Requirements

| Type   | Scope                                 |
| ------ | ------------------------------------- |
| Unit   | `math.ts` validation helpers          |
| Manual | All sample expressions on `/dev/math` |

#### Definition of Done

- [ ] MathDisplay + MathInput exported from `components/math/`
- [ ] Error boundary tested with bad input

#### Manual Testing Checklist

- [ ] Render all 4 sample expressions
- [ ] Type in MathInput — LaTeX exports to console/state
- [ ] Enter invalid LaTeX — graceful error

#### Out of Scope

- QuestionCard integration (Unit 16), API submission

---

### Unit 05: Database Schema v1

#### Purpose & Business Objective

Persist users, curriculum, questions, sessions, responses, and mastery data. Foundation for all backend features.

#### User Stories

- As a developer, I can run migrations on a fresh Neon database.
- As a developer, I can seed GCE Buea topics for 3 subjects.
- As a developer, I can CRUD via repository functions with tests.

#### Acceptance Criteria

- [ ] Migration runs on fresh Neon branch
- [ ] Seed populates subjects and topics (5+ per subject)
- [ ] Repository unit tests pass for CRUD
- [ ] pgvector extension enabled

#### Functional Requirements

- `packages/db/schema.ts` — all MVP tables from `architecture.md`
- Initial migration SQL
- Repositories: `users`, `questions`, `sessions`, `responses`, `mastery`, `curriculum`
- Seed: `packages/db/seed/gce-buea-topics.ts`
- Script: `npm run db:seed`

**Tables (MVP):** users, curricula, subjects, topics, questions, student_sessions, student_responses, mastery_records, marking_appeals, audit_log, topic_explanations, syllabus_chunks, hallucination_registry

#### Dependencies

- **Prior units:** 01
- **External:** Neon PostgreSQL project provisioned

#### Database / Schema

Full column definitions in `architecture.md` § Database Schema. Key constraints:

- `questions.validated` DEFAULT false
- `student_responses.idempotency_key` UNIQUE
- `mastery_records` UNIQUE (student_id, topic_id)

#### API Requirements

- None (data layer only)

#### Security Considerations

- `DATABASE_URL` server-only
- Repository functions verify ownership (prepare for Unit 06+)

#### Testing Requirements

| Type        | Scope                            |
| ----------- | -------------------------------- |
| Unit        | Repository CRUD per table        |
| Integration | Migration up/down on test branch |

#### Definition of Done

- [ ] Schema matches architecture.md
- [ ] Seed idempotent (safe to re-run)
- [ ] All repository tests pass

#### Manual Testing Checklist

- [ ] `npm run db:migrate` on fresh DB
- [ ] `npm run db:seed` — verify subjects in DB client

#### Out of Scope

- RLS policies (V1.1), production data, question content seed

---

### Unit 06: Auth Scaffold

#### Purpose & Business Objective

Secure student access via email/password. Protect all student and admin routes. Foundation for ownership checks on sessions and responses.

#### User Stories

- As a student, I can register with email, password, and examination level.
- As a student, I can log in and reach my dashboard.
- As an unauthenticated user, I cannot access protected routes.

#### Acceptance Criteria

- [ ] Register → login → lands on `/dashboard`
- [ ] Unauthenticated `/dashboard` → redirect `/login`
- [ ] Invalid credentials → 401 with clear message
- [ ] bcrypt factor 12 on registration

#### Functional Requirements

**UI:** `/login`, `/register`, `/forgot-password` (Resend stub OK)

**Logic:**

- Auth.js v5 in `apps/web/lib/auth.ts`
- JWT HTTP-only cookie, SameSite=Lax
- `middleware.ts` — protect `(student)/*`, `(admin)/*`
- Role: `student` default on register
- Register fields: name, email, password, confirm, level (OL/AL)
- Under-16 parental consent checkbox (feeds Unit 23)

#### Dependencies

- **Prior units:** 01, 05
- **Read:** `security.md` § Authentication

#### API Requirements

- Auth.js routes: `/api/auth/[...nextauth]`

#### Security Considerations

- bcrypt factor 12
- Human-readable auth errors — never raw stack traces
- Redirect authenticated users from `/login` → `/dashboard`
- Password never logged

#### Edge Cases

- Duplicate email registration → clear error
- Empty password → validation error
- Session expiry → redirect login

#### Testing Requirements

| Type        | Scope                                     |
| ----------- | ----------------------------------------- |
| Integration | Register, login, protected route redirect |
| Manual      | Full auth flow in browser                 |

#### Definition of Done

- [ ] All three auth pages render on 360px
- [ ] Middleware protects student routes
- [ ] security.md checklist items for auth met

#### Manual Testing Checklist

- [ ] Register new account
- [ ] Logout, login with same credentials
- [ ] Wrong password — friendly error
- [ ] Direct `/dashboard` while logged out — redirect

#### Out of Scope

- Google OAuth (V1.1), email verification enforcement, refresh token rotation

---

### Unit 07: Plausible Analytics Initialization

#### Purpose & Business Objective

Privacy-first analytics before student events fire. Enables product learning without tracking PII.

#### User Stories

- As a product owner, I can see pageviews and custom events in Plausible.
- As a developer, `trackEvent` no-ops safely during SSR.

#### Acceptance Criteria

- [ ] Pageviews appear in Plausible dashboard
- [ ] `trackEvent` no-ops when script not loaded (SSR)
- [ ] Event names match `code-standards.md` exactly
- [ ] No email or name in event properties

#### Functional Requirements

- Plausible script in `layout.tsx` via `next/script` (defer)
- `apps/web/lib/analytics.ts` — `trackEvent(name, props)` with window check
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in `.env.example`
- Dev stub on `/dev/ui` to verify wiring

#### Dependencies

- **Prior units:** 01, 06
- **Spec:** `specs/07-plausible-init.md`
- **External:** Plausible domain configured

#### API Requirements

- None

#### Security Considerations

- Opaque userId only in props — no PII
- `NEXT_PUBLIC_` prefix only on domain var

#### Testing Requirements

| Type   | Scope                                |
| ------ | ------------------------------------ |
| Unit   | `trackEvent` SSR no-op               |
| Manual | Network tab shows Plausible requests |

#### Definition of Done

- [ ] All 7 event names documented in code
- [ ] Plausible dashboard receives test event

#### Manual Testing Checklist

- [ ] Load page — pageview in Plausible
- [ ] Trigger stub event — appears in dashboard
- [ ] Verify no email in request payload

#### Out of Scope

- PostHog, Google Analytics, cookie banners

---

### Unit 08: Redis + Rate Limiting

#### Purpose & Business Objective

Protect auth endpoints from brute force, control AI costs per user, and enable idempotent answer submissions.

#### User Stories

- As the platform, I reject excessive auth attempts.
- As a student, duplicate answer submissions return cached results without double marking.

#### Acceptance Criteria

- [ ] 6th auth attempt in 1 minute → 429
- [ ] Idempotency SET NX prevents duplicate processing
- [ ] Rate limit headers on 429 responses

#### Functional Requirements

- `apps/web/lib/redis.ts` — Upstash client
- `apps/web/lib/rate-limit.ts`:
  - Auth: 5 req/min per IP
  - AI ops: 60 req/hour per user
  - General API: 300 req/min per user
- Middleware applies auth rate limit on `/api/auth/*`
- `checkIdempotency(userId, key)` helper

#### Dependencies

- **Prior units:** 01, 06
- **Read:** `security.md` § Rate Limiting, Idempotency
- **External:** Upstash Redis provisioned

#### API Requirements

- Rate limiting applied before route handlers
- 429 response uses standard error shape

#### Security Considerations

- Cost circuit breaker: 100 AI ops/hour per user (log + block)
- Redis keys namespaced: `rl:auth`, `rl:ai`, `idem:`

#### Testing Requirements

| Type        | Scope                                    |
| ----------- | ---------------------------------------- |
| Integration | 6 auth attempts → 429                    |
| Unit        | Idempotency SET NX behavior (mock Redis) |

#### Definition of Done

- [ ] All three limiter tiers configured
- [ ] Idempotency helper exported and tested

#### Manual Testing Checklist

- [ ] Rapid login attempts — 429 on 6th
- [ ] Verify rate-limit headers in response

#### Out of Scope

- Distributed rate limiting beyond Upstash, WAF rules

---

### Unit 09: Model Router + Chain Infrastructure

#### Purpose & Business Objective

Single point of model selection and shared AI infrastructure for all five chains. Enforces cost discipline and consistent logging.

#### User Stories

- As a developer, I get the correct model config for any task type.
- As an operator, every AI call logs tokens, latency, and chain type.

#### Acceptance Criteria

- [ ] All TaskType values mapped in router
- [ ] Test call logs all required fields
- [ ] Sanitize strips "ignore previous instructions"

#### Functional Requirements

- `packages/ai/router.ts` — `getModelConfig(task)` per AGENTS.md table
- `packages/ai/log.ts` — structured logging
- `packages/ai/sanitize.ts` — prompt injection stripping
- LangChain.js + Anthropic client setup

#### Dependencies

- **Prior units:** 01
- **Read:** AGENTS.md § Model Router, Guardrails
- **External:** ANTHROPIC_API_KEY (required from this unit)

#### AI / Agent Interactions

- Router maps: marking → Haiku; hint_3 → Sonnet; question_gen → Sonnet; etc.
- No chain execution yet — infrastructure only

#### Security Considerations

- `ANTHROPIC_API_KEY` server-only
- Sanitize all user text before any future chain call

#### Testing Requirements

| Type | Scope                                               |
| ---- | --------------------------------------------------- |
| Unit | Router returns Haiku for marking, Sonnet for hint_3 |
| Unit | Sanitize strips known injection patterns            |

#### Definition of Done

- [ ] Router complete for all TaskTypes in AGENTS.md
- [ ] Log function captures required fields

#### Out of Scope

- Individual chain implementations (Units 10–14)

---

### Unit 10: Examiner Marking Chain

#### Purpose & Business Objective

Core product value: board-accurate M1/A1/B1 partial credit marking at scale. Replaces expensive private tutor feedback.

#### User Stories

- As a student, I receive step-by-step marks matching GCE examiner conventions.
- As the platform, I flag low-confidence marks for human review.

#### Acceptance Criteria

- [ ] Full marks case passes benchmark
- [ ] M1 awarded, A1 denied (wrong final answer) passes
- [ ] Invalid LLM JSON → MarkingValidationError, no partial result
- [ ] marks_given never exceeds marks_available

#### Functional Requirements

- `packages/ai/chains/marking.ts`
- `packages/ai/schemas/marking.schema.ts`
- `packages/ai/examples/marking/` — 3 few-shot examples
- Haiku 4.5, temperature 0.1, max 800 tokens
- confidence < 0.70 → flagForReview: true

#### Dependencies

- **Prior units:** 09
- **Read:** AGENTS.md § Examiner Marking Chain (full section)

#### AI / Agent Interactions

**Input:** questionText, markScheme (JSON), studentAnswer (sanitized)

**Output (Zod):** steps[], totalAwarded, totalAvailable, confidence, flagForReview

**Failure:** Zod fail → throw MarkingValidationError → queue manual review

#### Security Considerations

- Mark scheme as structured JSON in human message
- No student name in prompts — session_id only
- System prompt immutable constant

#### Edge Cases

- Empty student answer
- Mark scheme exceeds token budget → split marking (document if encountered)
- LLM returns extra/missing steps → Zod rejection

#### Performance

- Target < 3s p95 (verified in Unit 31)

#### Testing Requirements

| Type      | Scope                             |
| --------- | --------------------------------- |
| Unit      | Zod schema valid/invalid cases    |
| Benchmark | 10+ known cases minimum           |
| AI eval   | Full marks, M1-only, invalid JSON |

#### Definition of Done

- [ ] Chain exported from `@examedge/ai`
- [ ] Benchmark fixtures in `packages/ai/__fixtures__/`
- [ ] ≥92% agreement target documented for pilot

#### Out of Scope

- Route handler wiring (Unit 17), appeal flow (Unit 22)

---

### Unit 11: Socratic Guidance Chain

#### Purpose & Business Objective

Guide struggling students without revealing answers. Core pedagogical differentiator vs ChatGPT.

#### User Stories

- As a student who answered incorrectly, I receive a guiding question, not the solution.
- As the platform, I never leak mark scheme numerical values in hints.

#### Acceptance Criteria

- [ ] 20 test scenarios: zero numerical leakage
- [ ] Forbidden phrases trigger retry
- [ ] Never returns empty — always useful pointer
- [ ] Max 2 retries then generic conceptual pointer

#### Functional Requirements

- `packages/ai/chains/guidance.ts`
- Haiku for hint_1, hint_2; Sonnet for hint_3
- Hardcoded anti-leakage system prompt (AGENTS.md — never override)
- Post-generation leakage check
- `previousHints[]` prevents repetition

#### Dependencies

- **Prior units:** 09
- **Read:** AGENTS.md § Socratic Guidance Chain

#### AI / Agent Interactions

**Critical constraint (hardcoded):**

```
You MUST NOT state the correct answer.
You MUST NOT state the next correct step.
You MUST NOT reveal any intermediate result the student has not produced.
```

#### Security Considerations

- Anti-leakage check never removed or bypassed
- Regenerate max 2 times on leakage detection

#### Testing Requirements

| Type    | Scope                                    |
| ------- | ---------------------------------------- |
| Unit    | Leakage detection function               |
| AI eval | 20 scenarios, forbidden phrase detection |

#### Definition of Done

- [ ] Anti-leakage tests pass
- [ ] Generic fallback returns on double leakage

#### Out of Scope

- Hint API route (Unit 18), UI (Unit 16)

---

### Unit 12: Question Generation Chain + RAG

#### Purpose & Business Objective

Maintain validated question pool through AI generation grounded in similar past questions. Runs in batch, not during student sessions.

#### User Stories

- As an admin, I receive candidate questions for human review.
- As the platform, I never generate without 5+ validated retrieval examples.

#### Acceptance Criteria

- [ ] Generation blocked when pool < 5 validated examples
- [ ] Output passes generation.schema.ts Zod
- [ ] Cross-examination flags inconsistent mark schemes
- [ ] Insert with validated=false — never auto-approve

#### Functional Requirements

- `packages/ai/rag.ts` — Voyage embedding + pgvector, k=5
- `packages/ai/chains/generation.ts` — Sonnet, temp 0.7
- Cross-examination sub-chain: Haiku solves + validates
- Output: templateText, paramSchema, markSchemeTemplate, probeLibrary

#### Dependencies

- **Prior units:** 05, 09
- **External:** VOYAGE_API_KEY

#### AI / Agent Interactions

- RAG required — abort if k < 5
- Cross-exam before admin queue
- Human gate before live pool (Unit 29)

#### Testing Requirements

| Type        | Scope                                 |
| ----------- | ------------------------------------- |
| Unit        | RAG abort when k < 5                  |
| Unit        | Zod validation on generation output   |
| Integration | pgvector query with seeded embeddings |

#### Definition of Done

- [ ] Generation + cross-exam chains complete
- [ ] Questions inserted as validated=false only

#### Out of Scope

- Admin UI (Unit 29), cron trigger (Unit 30), student delivery (Unit 24)

---

### Unit 13: UVE Probe Chain (Basic MVP)

#### Purpose & Business Objective

Verify genuine understanding after answers. Differentiates mastery from answer consumption.

#### User Stories

- As a student, I answer a follow-up probe that tests real understanding.
- As the platform, I update Mastery Validation Score without blocking marking response.

#### Acceptance Criteria

- [ ] L1 probe uses different params than original question
- [ ] Marking API returns before UVE completes
- [ ] MVS delta written to mastery_records

#### Functional Requirements

- `packages/ai/chains/uve.ts` — L1 (variable substitution), L2 (method transparency)
- Evaluation sub-chain: understandingLevel 0-4, mvsDelta
- Async trigger — never blocks marking response
- Store in `student_responses.uve_probes` JSONB

#### Dependencies

- **Prior units:** 09, 10

#### AI / Agent Interactions

- L1-L2: Haiku only (MVP)
- L3-L4 deferred to V1.1

#### Performance

- Async only — marking response must not wait

#### Testing Requirements

| Type        | Scope                                       |
| ----------- | ------------------------------------------- |
| Unit        | L1 param substitution differs from original |
| Integration | Async completion writes MVS                 |

#### Definition of Done

- [ ] Probe generation + evaluation chains complete
- [ ] Async pattern documented for route handler (Unit 17)

#### Out of Scope

- L3-L4 probes (V1.1), UVE UI polish beyond Unit 16 mock

---

### Unit 14: Curriculum Intelligence Chain

#### Purpose & Business Objective

Explain topics grounded in official syllabus text. Cached permanently to control costs.

#### User Stories

- As a student, I read a four-part topic explanation based on syllabus content.
- As the platform, I never regenerate a cached explanation.

#### Acceptance Criteria

- [ ] Second request → no LLM call (cache hit)
- [ ] Output validated by Zod
- [ ] No syllabus → safe error, no hallucinated content

#### Functional Requirements

- `packages/ai/chains/curriculum.ts`
- Check `topic_explanations` cache first
- Retrieve syllabus chunk from DB by topicId
- Sonnet, temp 0.6 — definition, worked example, common mistakes, practice pointer
- Cache permanently on first generation

#### Dependencies

- **Prior units:** 05, 09
- **Read:** AGENTS.md § Curriculum Intelligence Chain

#### Testing Requirements

| Type | Scope                                   |
| ---- | --------------------------------------- |
| Unit | Cache hit returns without LLM mock call |
| Unit | No syllabus → abort with safe error     |

#### Definition of Done

- [ ] Chain complete with Zod output schema
- [ ] Cache write on first generation

#### Out of Scope

- Student UI (Unit 20), syllabus PDF ingestion pipeline (seed data OK)

---

### Unit 15: Student Dashboard UI (Mock Data)

#### Purpose & Business Objective

Visualize mastery, streak, and readiness — the student's home base. UI verified before backend wiring.

#### User Stories

- As a student, I see my progress at a glance and can continue studying.
- As a developer, I verify layout on 360px without API dependencies.

#### Acceptance Criteria

- [ ] Renders on 360px without horizontal scroll
- [ ] Mastery colors match ui-tokens.md
- [ ] All sections visible with mock data only
- [ ] No fetch calls

#### Functional Requirements

**UI sections:**

- Navbar: Dashboard (active), Practice, Progress, Profile
- Welcome header with name
- ReadinessScore ring (mock 62%)
- StreakDisplay (mock 5-day)
- MasteryMap grid (15 mock topics, red/amber/green)
- "Continue studying" CTA
- Focus preparation prompt (dismissible)
- Recent sessions list (3 mock entries)

#### Dependencies

- **Prior units:** 02, 03, 04, 06
- **Read:** `ui-rules.md`, `student-journey.md` §2

#### Frontend Requirements

- `app/(student)/dashboard/page.tsx`
- Mock data local to page or `lib/mocks/dashboard.ts`
- Server Component shell OK with client sub-components

#### Definition of Done

- [ ] Full dashboard visible with mocks
- [ ] `ui-registry.md` updated with dashboard components

#### Manual Testing Checklist

- [ ] 360px: all sections visible, no scroll issues
- [ ] Mastery map colors correct
- [ ] CTA links to study route (may 404 until Unit 16)

#### Out of Scope

- Real data (Unit 19), API calls

---

### Unit 16: Study Session UI (Mock Data)

#### Purpose & Business Objective

Complete study session interface — the core learning loop UI. Verified before marking API integration.

#### User Stories

- As a student, I see a question, input an answer, view marks, request hints, and answer a probe.
- As a developer, I verify the full state machine visually.

#### Acceptance Criteria

- [ ] Full flow visible: question → submit → marks → hint → probe
- [ ] Mark badges use correct colors (M1 blue, A1 green)
- [ ] Hint text is a question, not an answer
- [ ] No API calls

#### Functional Requirements

**Components:**

- QuestionCard with KaTeX sample question
- MathInput answer area
- Photo upload icon (stub)
- Submit Answer button
- MarkingDisplay (mock M1/A1/B1 breakdown)
- HintPanel (mock guiding question)
- UVEProbeModal (mock variant question)

**State machine:** question → answering → marked → probe

#### Dependencies

- **Prior units:** 04, 15

#### Frontend Requirements

- `app/(student)/study/[topicId]/page.tsx`
- Header: "Question 2 of 5" + Hint button
- Exam mode styling N/A here

#### Definition of Done

- [ ] State machine transitions work with mocks
- [ ] All assessment components in `ui-registry.md`

#### Manual Testing Checklist

- [ ] Submit shows mock marks
- [ ] Hint panel shows question format
- [ ] Probe modal appears after mock submit
- [ ] 360px layout correct

#### Out of Scope

- Real API (Unit 17), real questions (Unit 24)

---

### Unit 17: Session API + Answer Submission

#### Purpose & Business Objective

Wire the study session to real backend — Pattern 1 from architecture.md. First end-to-end AI marking in the product.

#### User Stories

- As a student, I submit an answer and receive M1/A1/B1 marks within 3 seconds.
- As the platform, I prevent duplicate submissions from double-charging AI.

#### Acceptance Criteria

- [ ] End-to-end submit → marks appear < 3s
- [ ] Duplicate idempotency key → cached result, no double AI call
- [ ] Low confidence → "Under review" badge
- [ ] `answer_submitted` Plausible event fires

#### Functional Requirements

**API routes:**

- `POST /api/sessions` — create `{ subjectId, mode: 'practice' }`
- `POST /api/sessions/:id/next-question` — serve question (mock pool OK if Unit 24 not done)
- `POST /api/sessions/:id/responses` — full Pattern 1 flow

**Route handler flow:**
auth → validate Zod → idempotency → mark scheme → runMarkingChain → transaction → async UVE → respond

**Repository:** `responsesRepository.submit()` — atomic INSERT + UPDATE mastery + UPDATE session

#### Dependencies

- **Prior units:** 05, 06, 08, 10, 13, 16
- **Read:** architecture.md § Answer Submission, security.md

#### API Contracts

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

#### Security Considerations

- Ownership check: session belongs to authenticated user
- AI rate limit applied
- Idempotency before marking chain
- Sanitize answer text before LLM

#### Edge Cases

- Session not found → 404
- Session belongs to another user → 403
- Marking chain Zod failure → flag review, safe message
- AI timeout → retry once, then safe error

#### Performance

- Marking p95 < 3s
- UVE async — does not extend response time

#### Logging

- Log: chain_type, model, tokens, latency_ms, confidence, requestId
- Sentry on unhandled errors

#### Testing Requirements

| Type        | Scope                               |
| ----------- | ----------------------------------- |
| Integration | Full submit flow with mocked chain  |
| Integration | Idempotency duplicate returns cache |
| Integration | 403 for wrong user                  |
| Manual      | Browser submit → marks display      |

#### Definition of Done

- [ ] Pattern 1 complete end-to-end
- [ ] UI loading/error states wired
- [ ] Plausible event fires

#### Manual Testing Checklist

- [ ] Submit answer — marks appear
- [ ] Submit same idempotency key twice — same result
- [ ] Low confidence mock — review badge visible
- [ ] 360px: loading state during marking

#### Out of Scope

- Real question pool (Unit 24), photo OCR (Unit 28)

---

### Unit 18: Hint Flow

#### Purpose & Business Objective

Wire Socratic hints — Pattern 2. Pedagogical guidance without answer leakage.

#### User Stories

- As a student with low marks, I request up to 3 escalating hints.
- As the platform, I never leak mark scheme values in hints.

#### Acceptance Criteria

- [ ] 4th hint request → 400 with clear message
- [ ] Hint never contains mark scheme numerical values
- [ ] Hints escalate L1 → L2 → L3
- [ ] `hint_requested` event fires

#### Functional Requirements

- `GET /api/sessions/:id/hints?questionId=...`
- Increment hints_used on student_responses
- Escalate level based on hints_used
- runGuidanceChain + anti-leakage check

**UI:**

- Hint button disabled until first submission with marks < 50%
- "Hints remaining: N/3"
- HintPanel slides in
- Disabled at 0 hints

#### Dependencies

- **Prior units:** 11, 17

#### API Contract

Response:

```typescript
{
  hint: string;
  conceptPointed: string;
  hintsRemaining: number;
}
```

#### Security Considerations

- Anti-leakage mandatory
- Rate limit as AI operation

#### Testing Requirements

| Type        | Scope                                |
| ----------- | ------------------------------------ |
| Integration | 4th hint → 400                       |
| AI eval     | No numerical leakage in 20 scenarios |

#### Definition of Done

- [ ] Hint UI wired to API
- [ ] Escalation logic correct

#### Manual Testing Checklist

- [ ] Wrong answer → hint available
- [ ] 3 hints → button disabled
- [ ] Hint is a question, not solution

#### Out of Scope

- Hints in exam mode (disabled by design)

---

### Unit 19: Dashboard Real Data

#### Purpose & Business Objective

Replace mock dashboard with live mastery and session data from PostgreSQL.

#### User Stories

- As a student, I see my actual progress after practicing.
- As a student, my streak reflects consecutive study days.

#### Acceptance Criteria

- [ ] After 3 practice sessions, mastery map reflects real data
- [ ] Streak updates after consecutive days
- [ ] Page loads without client fetch waterfall
- [ ] Empty state for new users

#### Functional Requirements

- Server Component fetches via repositories:
  - `masteryRepository.getMapForStudent(userId)`
  - `sessionsRepository.getRecent(userId, limit: 5)`
  - Compute readiness from mastery thetas
  - Streak with grace day logic

#### Dependencies

- **Prior units:** 15, 17

#### Performance

- Server Components only — no client fetch waterfall
- Skeleton loaders while fetching

#### Testing Requirements

| Type        | Scope                                |
| ----------- | ------------------------------------ |
| Integration | Dashboard data after seeded sessions |
| Manual      | Visual verification after 3 sessions |

#### Definition of Done

- [ ] No mock data remains on dashboard
- [ ] Empty state renders for new user

#### Manual Testing Checklist

- [ ] New user — empty state
- [ ] After sessions — mastery colors update
- [ ] Streak displays correctly

#### Out of Scope

- Focus analytics (Unit 26), spaced repetition UI

---

### Unit 20: Curriculum Explain UI

#### Purpose & Business Objective

Student-facing topic explanations grounded in syllabus. Supports deep learning before practice.

#### User Stories

- As a student, I tap "Learn this topic" and read a structured explanation.
- As a student, my second visit loads instantly from cache.

#### Acceptance Criteria

- [ ] Second visit → instant load (cache hit)
- [ ] No syllabus → friendly error
- [ ] Four-part structure displayed
- [ ] `ui-registry.md` updated

#### Functional Requirements

- `GET /api/topics/:id/explain` — auth required
- UI: `/study/[topicId]/learn` or slide-over panel
- Sections: Definition, Worked example, Common mistakes, Practice pointer
- "Based on official syllabus" source note

#### Dependencies

- **Prior units:** 14, 16
- **Spec:** `specs/20-curriculum-explain-ui.md`

#### API Contract

Response: four-part explanation object from curriculum chain schema.

404 when no syllabus chunk — safe message, no hallucination.

#### Definition of Done

- [ ] API + UI complete
- [ ] Cache hit verified

#### Manual Testing Checklist

- [ ] First load — skeleton then content
- [ ] Second load — instant
- [ ] Topic without syllabus — empty state

#### Out of Scope

- Syllabus PDF upload UI (admin seed OK)

---

### Unit 21: Progress Page + Session History

#### Purpose & Business Objective

Long-term progress visibility — sessions, stats, appeals entry point.

#### User Stories

- As a student, I review my session history and performance trends.
- As a student, I access my marking appeals from progress page.

#### Acceptance Criteria

- [ ] History populates after 3 sessions
- [ ] Session detail shows per-question marks
- [ ] Empty state for new users
- [ ] 360px without horizontal scroll

#### Functional Requirements

- `app/(student)/progress/page.tsx`
- Summary cards: sessions, hours, topics, streak
- Session history list with expandable detail
- Placeholder for focus analytics (Unit 26)
- Link to appeals subsection

#### Dependencies

- **Prior units:** 17, 19
- **Spec:** `specs/21-progress-page.md`

#### API / Data

- Server Component: `sessionsRepository.getHistory(userId, { limit: 50 })`
- Aggregate stats from session + response repositories

#### Definition of Done

- [ ] Progress page complete
- [ ] Appeals link present (Unit 22 wires logic)

#### Manual Testing Checklist

- [ ] 3+ sessions — history populated
- [ ] Expand session — per-question marks
- [ ] New user — empty state

#### Out of Scope

- Focus analytics data (Unit 26), export PDF

---

### Unit 22: Marking Appeals Flow

#### Purpose & Business Objective

Trust mechanism for AI marking. Students can dispute marks; appeals queue for human review.

#### User Stories

- As a student, I appeal a mark I disagree with.
- As the platform, I prevent duplicate appeals per response.

#### Acceptance Criteria

- [ ] Student can appeal own response only → 403 for others
- [ ] Duplicate appeal → 409
- [ ] Appeal appears on progress page
- [ ] `appeal_submitted` event fires
- [ ] Audit log entry on submit

#### Functional Requirements

- `POST /api/appeals` — `{ responseId, reason }` min 20 chars
- `GET /api/appeals` — list own appeals
- UI: appeal link on MarkingDisplay, modal, progress page list
- Admin resolution via manual DB/admin PATCH (Unit 29 audit)

#### Dependencies

- **Prior units:** 17, 21
- **Spec:** `specs/22-marking-appeals.md`
- **Read:** `security.md` § Audit Logging

#### API Contract

POST response: `{ id, status: "pending" }`

409 on duplicate. 403 on wrong owner.

#### Definition of Done

- [ ] Appeal submit + list complete
- [ ] Audit log written

#### Manual Testing Checklist

- [ ] Submit appeal — confirmation shown
- [ ] Appeal on progress page
- [ ] Duplicate submit — error message

#### Out of Scope

- Admin appeal resolution UI (manual MVP)

---

### Unit 23: Profile Page + Privacy Settings

#### Purpose & Business Objective

Student settings, subject preferences, and MVP privacy controls for minors.

#### User Stories

- As a student, I update my subject preferences.
- As a student under 16, I see parental consent status.
- As a student, I can request data export or delete my account.

#### Acceptance Criteria

- [ ] Subject toggle persists
- [ ] Delete account → logout → cannot login
- [ ] Data export writes audit log
- [ ] Offline queue count displays when queued (after Unit 27)

#### Functional Requirements

**UI sections:** Account · Subjects · Offline · Privacy · Data · Deletion

**APIs:**

- `PATCH /api/students/me` — preferences
- `POST /api/students/me/data-export` — queue job
- `POST /api/students/me/delete` — soft-delete

**Fields:** consent_given_at, consent_type, deleted_at

#### Dependencies

- **Prior units:** 06, 19
- **Spec:** `specs/23-profile-privacy.md`
- **Read:** `security.md` § Data Protection (Minors)

#### Security Considerations

- Soft delete sets deleted_at
- Invalidate session on delete
- Audit log on export and deletion requests
- No PII in export queue metadata

#### Definition of Done

- [ ] All profile sections functional
- [ ] Deletion flow complete

#### Manual Testing Checklist

- [ ] Toggle subject — persists after reload
- [ ] Delete account — cannot re-login
- [ ] Export request — toast confirmation

#### Out of Scope

- Automated export email (V1.1), full parental workflow (V1.1)

---

### Unit 24: Question Pool + Parameter Instantiation

#### Purpose & Business Objective

Real question delivery without LLM at request time — Pattern 3. Scales to millions of students.

#### User Stories

- As a student, I receive unique parameterised questions from the validated pool.
- As the platform, I never serve the same template within 30 days to one student.

#### Acceptance Criteria

- [ ] Two students same template → different parameter values
- [ ] Same student within 30 days → no repeat template
- [ ] Unvalidated question never returned
- [ ] Wire next-question API (replace Unit 17 mock)

#### Functional Requirements

- `questionsRepository.selectFromPool({ topicId, studentId, irtTheta })`
- `instantiateParams`, `generateMarkScheme`, `renderTemplate` — local, deterministic
- Redis warm cache TTL 1h
- validated=true only; exclude seen in 30 days; difficulty ± 0.5 IRT theta

#### Dependencies

- **Prior units:** 05, 12, 17, 29 (for validated pool — seed validated questions for dev)

#### Performance

- No LLM at delivery time
- Redis cache 1h TTL

#### Testing Requirements

| Type        | Scope                                    |
| ----------- | ---------------------------------------- |
| Unit        | instantiateParams determinism            |
| Unit        | renderTemplate with params               |
| Integration | Pool selection excludes recent templates |
| Integration | validated=false never returned           |

#### Definition of Done

- [ ] next-question uses real pool
- [ ] Parameter instantiation tested

#### Out of Scope

- IRT adaptive difficulty refinement beyond ±0.5

---

### Unit 25: Exam Simulation Mode

#### Purpose & Business Objective

Timed full-paper examination practice. Core exam readiness feature for competition demo.

#### User Stories

- As a student, I take a timed exam simulation without hints.
- As a student, I receive a post-exam report with per-question breakdown.

#### Acceptance Criteria

- [ ] Timer pauses on tab switch
- [ ] Two simulations → different question sets
- [ ] Report shows per-question mark breakdown
- [ ] `exam_completed` event fires
- [ ] No hint button in exam mode

#### Functional Requirements

**UI:**

- Entry from practice page
- Fullscreen on start
- ExamTimer — amber at 5min, red at 1min
- Question navigation Previous/Next
- Tab switch → pause overlay
- ExamReport page post-submit

**API:**

- `POST /api/simulations` — assemble paper from pool
- `POST /api/simulations/:id/submit`
- `GET /api/simulations/:id/report`

**Logic:**

- Page Visibility API — log focus_breaks
- Fullscreen API on start

#### Dependencies

- **Prior units:** 17, 24
- **Read:** `ai-cost-and-exam-system.md`, `demo-script.md`

#### Frontend Requirements

- Exam mode: paper-white background, no shadows, no navbar
- `app/(student)/exam/[simulationId]/page.tsx`

#### Definition of Done

- [ ] Full exam flow completable
- [ ] Report page renders breakdown

#### Manual Testing Checklist

- [ ] Start exam — fullscreen requested
- [ ] Switch tab — pause overlay
- [ ] Submit — report with marks
- [ ] 360px exam layout (where applicable)

#### Out of Scope

- Proctoring, cheat prevention claims

---

### Unit 26: Focus Session Architecture

#### Purpose & Business Objective

Structured study blocks and honest focus analytics. Supports deep learning over distraction.

#### User Stories

- As a student, I see a focus preparation prompt at session start.
- As a student, I view focus analytics on my progress page.

#### Acceptance Criteria

- [ ] Focus prompt shown at session start
- [ ] Tab switch increments interruption count
- [ ] Progress page shows focus analytics after 3 sessions

#### Functional Requirements

- Focus preparation prompt (ui-rules.md)
- Block timer 20-35 min (default 25 min MVP)
- Break screen with countdown
- Reflection micro-prompt at block end
- Store focus events in session metadata JSONB
- Page Visibility API during study sessions
- Grace day streak logic

#### Dependencies

- **Prior units:** 16, 21

#### Definition of Done

- [ ] Focus events stored
- [ ] Progress page analytics section populated

#### Manual Testing Checklist

- [ ] Session start — focus prompt
- [ ] Tab away — interruption logged
- [ ] Progress — analytics visible

#### Out of Scope

- Push notifications, guilt-based streaks

---

### Unit 27: PWA + Offline Queue

#### Purpose & Business Objective

Offline-first study for intermittent connectivity — African network realities.

#### User Stories

- As a student offline, I queue my answer and see it sync when reconnected.
- As a student, duplicate sync does not double-mark my answer.

#### Acceptance Criteria

- [ ] Airplane mode: submit → queued locally
- [ ] Reconnect: queue syncs, marks appear
- [ ] Duplicate sync → idempotency prevents double marking
- [ ] Profile shows live queued count
- [ ] `offline_sync` event fires

#### Functional Requirements

- Service worker: app shell + static assets
- `apps/web/lib/offline-queue.ts` — IndexedDB
- OfflineBanner sticky below navbar
- Sync on `online` event + app focus
- Queue payload includes idempotency UUID

#### Dependencies

- **Prior units:** 17, 23

#### Security Considerations

- Queued payloads same as online — idempotency on server

#### Testing Requirements

| Type        | Scope                            |
| ----------- | -------------------------------- |
| Manual      | Airplane mode submit + reconnect |
| Integration | Idempotency on sync              |

#### Definition of Done

- [ ] PWA manifest + service worker registered
- [ ] Offline queue end-to-end

#### Manual Testing Checklist

- [ ] Enable airplane mode — submit queues
- [ ] Disable airplane mode — sync completes
- [ ] Profile shows queue count

#### Out of Scope

- Full offline question cache (V1.1 mobile SQLite)

---

### Unit 28: Photo Answer Upload + OCR

#### Purpose & Business Objective

Support handwritten working — common for GCE mathematics and sciences.

#### User Stories

- As a student, I photograph my written work and receive marks on the transcription.
- As a student, I confirm the transcription before marking proceeds.

#### Acceptance Criteria

- [ ] Photo of quadratic working → M1/A1 marks applied
- [ ] Student confirms transcription before marking
- [ ] Low quality photo → review flag, not crash

#### Functional Requirements

- `POST /api/sessions/:id/responses` with `answerType: 'image'`
- Upload to R2: `photos/{userId}/{responseId}.jpg`
- Claude vision transcription (ocr_fallback, Sonnet temp 0.1)
- Pass transcription to runMarkingChain
- Low OCR confidence → flagForReview

**UI:** Camera icon, capture, thumbnail, confirm/retake, spinner, transcription preview

#### Dependencies

- **Prior units:** 10, 17
- **External:** R2 bucket configured

#### Security Considerations

- Presigned URLs with short TTL
- Owner-only photo access
- Max 1MP WebP/JPEG

#### Definition of Done

- [ ] Photo upload → OCR → marking flow complete

#### Manual Testing Checklist

- [ ] Capture photo — preview shown
- [ ] Confirm transcription — marking proceeds
- [ ] Blurry photo — review flag

#### Out of Scope

- On-device ML Kit OCR (mobile V1.1)

---

### Unit 29: Admin Question Validation Queue

#### Purpose & Business Objective

Human gate before AI questions reach students. Quality and safety control.

#### User Stories

- As an admin, I approve or reject candidate questions.
- As a student, I never receive unvalidated questions.

#### Acceptance Criteria

- [ ] Student next-question never returns unvalidated question
- [ ] Admin approve → question in pool within 1h (cache TTL)
- [ ] Non-admin → 403 on admin routes

#### Functional Requirements

**UI:** `(admin)/questions/page.tsx`

- Table: pending questions with topic, difficulty, marks, cross-exam result
- Detail: KaTeX rendered question + mark scheme + param schema
- Approve / Reject + notes

**API:**

- `GET /api/admin/questions/review`
- `PATCH /api/admin/questions/:id/validate`

Approve: validated=true, generate embedding, audit log.

#### Dependencies

- **Prior units:** 06, 12, 24

#### Security Considerations

- RBAC: admin role only
- Audit log on approve/reject

#### Definition of Done

- [ ] Admin queue functional
- [ ] Approved questions enter pool

#### Manual Testing Checklist

- [ ] Login as admin — queue visible
- [ ] Approve question — appears in student session
- [ ] Student role — 403 on /admin

#### Out of Scope

- Multi-reviewer workflow, specialist roles (V1.1)

---

### Unit 30: Background Jobs (Vercel Cron)

#### Purpose & Business Objective

Nightly batch processes: pool refresh, weekly reports, spaced repetition, backups.

#### User Stories

- As a student, I receive a weekly progress email.
- As the platform, I auto-refresh question pools below threshold.

#### Acceptance Criteria

- [ ] Cron endpoints reject without CRON_SECRET
- [ ] Pool refresh triggers when count below threshold
- [ ] Weekly report email sent for test student

#### Functional Requirements

- `POST /api/cron/weekly-reports` — Sunday 06:00 WAT
- `POST /api/cron/pool-refresh` — nightly
- `POST /api/cron/spaced-repetition` — nightly SM-2 updates
- `POST /api/cron/backup` — Sunday 02:00 WAT pg_dump to R2
- `vercel.json` cron schedule

#### Dependencies

- **Prior units:** 12, 14, 05
- **External:** RESEND_API_KEY, R2 for backups

#### Security Considerations

- CRON_SECRET header required on all cron routes
- No cron endpoint publicly triggerable

#### Definition of Done

- [ ] All 4 cron routes implemented
- [ ] vercel.json configured

#### Manual Testing Checklist

- [ ] Call cron without secret — 401
- [ ] Call with secret — job executes
- [ ] Test student receives weekly email

#### Out of Scope

- Cognitive fingerprint cron (V1.1)

---

### Unit 31: Pilot Hardening + Demo Script

#### Purpose & Business Objective

Production readiness for 20-student pilot and 10-minute competition demo.

#### User Stories

- As a competition judge, I complete the demo in under 10 minutes without errors.
- As an operator, I see errors in Sentry and analytics in Plausible.

#### Acceptance Criteria

- [ ] Demo script completable in < 10 minutes
- [ ] Sentry captures test exception
- [ ] Load test: 50 concurrent marking — p95 < 3s
- [ ] All 31 units marked complete in progress-tracker.md
- [ ] `/dev/*` routes hidden in production

#### Functional Requirements

- Sentry client + server initialization
- Verify Plausible still firing
- Demo account seeded with realistic mastery data
- Polish: loading states, error boundaries on all pages
- `docs/demo-script.md` walkthrough validated

**Demo script steps:**

1. Login demo student (30s)
2. Dashboard — mastery, streak, readiness (1min)
3. Pure Maths practice — live question (1min)
4. Wrong answer → Socratic hint (1.5min)
5. Correct answer → M1/A1/B1 breakdown (1.5min)
6. UVE probe (1.5min)
7. Exam simulation — fullscreen, timer (2min)
8. Post-exam report (1min)
9. Admin validation queue peek (30s)

#### Dependencies

- **Prior units:** All 01–30
- **Read:** `demo-script.md`, `engineering-operations.md`, `learning-impact.md`

#### Testing Requirements

| Type     | Scope                          |
| -------- | ------------------------------ |
| Load     | 50 concurrent marking requests |
| E2E      | Full demo script path          |
| Security | security.md pilot checklist    |

#### Definition of Done

- [ ] Demo script run without errors
- [ ] progress-tracker.md shows Phase complete
- [ ] MVP success criteria from project-overview.md verified

#### Manual Testing Checklist

- [ ] Complete demo-script.md start to finish
- [ ] Trigger test Sentry error — appears in dashboard
- [ ] 360px on all student pages
- [ ] security.md § Pilot verification complete

#### Out of Scope

- Production payment, full legal privacy policy text

---

## 5. Post-MVP Feature Prompts (V1.1 → V4.0+)

**Prerequisite:** All MVP Units 01–31 merged to `main`. Confirm priority in `roadmap.md` before starting.

Each post-MVP prompt follows the 18-section template. Copy `feature-implementation-prompt-template.md` → `docs/context/specs/f-NN-name.md` and use the summary below to fill it.

**Also satisfy:** §3.6 Universal Requirements · §2 workflow · §2b–§2d lifecycle.

---

### F-32: React Native + Expo Mobile App (V1.1)

| Section          | Detail                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Objective**    | Native mobile app sharing web API; offline SQLite question cache                                         |
| **Docs**         | `roadmap.md` V1.1 · `architecture.md` mobile note · `platform-ecosystem-ops.md` · `library-docs.md` Expo |
| **Scope**        | `apps/mobile/` Expo Router; secure token in expo-secure-store; same API as web                           |
| **Out of scope** | Rewriting backend; new AI chains                                                                         |
| **Acceptance**   | Login → practice → submit → marks on Android 7+ device; offline cache serves cached questions            |
| **NFR**          | 512MB RAM target; 4.5" screen; offline study flow                                                        |
| **Security**     | JWT in secure store — not AsyncStorage; same RBAC as web                                                 |
| **Tests**        | E2E on device/emulator; offline sync integration                                                         |

---

### F-33: Google OAuth (V1.1)

| **Objective** | Auth.js Google provider alongside email/password |
| **Docs** | `security.md` · `library-docs.md` Auth.js · `roadmap.md` |
| **Acceptance** | Google login → dashboard; account linking strategy documented |
| **Security** | OAuth state validation; role defaults to student |
| **Schema** | Optional: `accounts` table for Auth.js adapter |

---

### F-34: Teacher Dashboard (V1.1)

| **Objective** | Class roster, assignments, read-only student progress |
| **Docs** | `project-overview.md` · `content-architecture.md` § learner modes · `platform-ecosystem-ops.md` |
| **Routes** | `(teacher)/dashboard`, `(teacher)/classes/[id]`, assignments |
| **RBAC** | New `teacher` role; students see own data only |
| **Acceptance** | Teacher views class mastery aggregate; cannot see individual hint text |
| **Out of scope** | Marking override UI (admin only MVP) |

---

### F-35: PostgreSQL RLS Policies (V1.1)

| **Objective** | Row-level security per role as defense-in-depth |
| **Docs** | `security.md` deferred items · `roadmap.md` · `ExamEdge_Engineering_Document.md` §5 |
| **Acceptance** | Student JWT can only SELECT own rows; teacher sees assigned class; admin sees validation queue |
| **Tests** | Integration tests with role-specific DB connections |

---

### F-36: JWT Refresh Rotation + Token Blocklist (V1.1)

| **Objective** | Production auth hardening |
| **Docs** | `security.md` · `roadmap.md` |
| **Acceptance** | Refresh token rotation; logout invalidates refresh; stolen token window minimized |

---

### F-37: CSP Headers + CSRF Tokens (V1.1)

| **Objective** | Production security headers |
| **Docs** | `security.md` deferred · `engineering-operations.md` |
| **Acceptance** | CSP blocks inline scripts except nonce; CSRF on state-changing forms |

---

### F-38: French UI / i18n Framework (V1.1)

| **Objective** | next-intl or equivalent; French UI for Francophone expansion prep |
| **Docs** | `platform-ecosystem-ops.md` · `roadmap.md` |
| **Acceptance** | Language toggle; curriculum chain accepts `language: 'fr'` |
| **Out of scope** | Full BEPC content (F-42) |

---

### F-39: Expanded GCE Subject Coverage (V1.1)

| **Objective** | Expand from 3 to ~16 GCE Buea subjects |
| **Docs** | `content-governance.md` · `ExamEdge_Volume_V_Blueprint.md` · `content-architecture.md` |
| **Acceptance** | Seed data + validated pools per subject; marking benchmarks per subject |
| **Process** | 50-question pilot pool per subject → human benchmark |

---

### F-40: UVE L3-L4 Probes (V1.1)

| **Objective** | Conceptual explanation (L3) and transfer challenge (L4) probes |
| **Docs** | `AGENTS.md` § UVE · `ai-cost-and-exam-system.md` |
| **AI** | Sonnet for L3-L4 generation and evaluation; extend `uve.ts` |
| **Acceptance** | L3/L4 async after marking; MVS delta updated; zero answer leakage |
| **Tests** | AI eval suite for L3/L4 probes |

---

### F-41: Automated Data Export (V1.1)

| **Objective** | Self-service JSON/PDF download replacing manual export queue |
| **Docs** | `security.md` · `student-journey.md` · Unit 23 stub |
| **Acceptance** | Profile "Download my data" → email link within 24h; audit log entry |

---

### F-42: WAEC / NECO Boards (V2.0)

| **Objective** | Nigeria/Ghana board configs + validated question pools |
| **Docs** | `content-architecture.md` · `content-governance.md` · `boards.ts` |
| **Process** | Syllabus ingest → chunk → embed → seed → validate (roadmap § V2.0) |
| **Acceptance** | WAEC marking benchmarks ≥92%; board-specific mark scheme templates |
| **Out of scope** | New AI chains — config + content only |

---

### F-43: KCSE — Kenya (V2.0)

| Same pattern as F-42 for KCSE board config and syllabus pipeline |

---

### F-44: OBC / Francophone Cameroon (V2.0)

| **Objective** | French curriculum + BEPC marking conventions |
| **Docs** | `roadmap.md` · F-38 i18n · `content-governance.md` |
| **Depends on** | F-38 French UI |

---

### F-45: Graduate Success Hub (V2.0)

| **Objective** | University readiness, scholarships, global competitions for A-Level graduates |
| **Docs** | `student-journey.md` §6 · `strategic-charter.md` §2 |
| **Routes** | `(student)/graduate/` — opportunities, readiness checklist |
| **Acceptance** | AL students see pathways; no exam marking in this module |
| **AI** | Optional report_gen chain (Haiku) for opportunity matching — not blocking |

---

### F-46: USSD/SMS Access (V2.0)

| **Objective** | Low-bandwidth access via Africa's Talking |
| **Docs** | `platform-ecosystem-ops.md` · `zero-budget-stack.md` |
| **Acceptance** | SMS daily practice prompt; USSD menu for streak/mastery summary |
| **Out of scope** | Full marking via SMS — link to web/PWA |

---

### F-47: Whisper.cpp Oral Assessment (V2.0)

| **Objective** | On-device ASR for oral explanation probes |
| **Docs** | `AGENTS.md` · `platform-ecosystem-ops.md` · mobile F-32 |
| **Acceptance** | Record → transcribe → evaluate oral UVE response |
| **Platform** | Mobile primarily; web optional |

---

### F-48: Advanced Cognitive Fingerprint (V2.0)

| **Objective** | Error pattern clustering; learning style adaptation post-session |
| **Docs** | `AGENTS.md` § Memory · `platform-how-it-works.md` |
| **Acceptance** | Cron updates `users.cognitive_fp`; hints adapt to error patterns |
| **Schema** | Existing `cognitive_fp` JSONB — no new tables required |

---

### F-49: Alumni Mentor Network (V2.0)

| **Objective** | Diaspora mentors for A-Level graduates |
| **Docs** | `student-journey.md` §6 · `platform-ecosystem-ops.md` |
| **Acceptance** | Mentor profile; student request intro; no in-app messaging MVP |

---

### F-50: Payment / Subscription (V2.0)

| **Objective** | Pilot monetisation after product-market fit |
| **Docs** | `zero-budget-stack.md` · `roadmap.md` |
| **Acceptance** | Mobile Money / card for premium tier; free tier preserved |
| **Requires** | Legal/commercial review before implementation |

---

### F-51: Local Model Routing (V2.0+)

| **Objective** | Fine-tuned Haiku-class models for marking via router swap |
| **Docs** | `AGENTS.md` § Model Router · `ai-cost-and-exam-system.md` |
| **Acceptance** | `getModelConfig()` checks local registry first; benchmark ≥92% before rollout |
| **Process** | Shadow deployment per AGENTS.md Evaluation section |

---

### F-52: Syllabus Auto-Chunking Pipeline (V2.0)

| **Objective** | PDF syllabus → chunks → embeddings automated |
| **Docs** | `content-governance.md` · `roadmap.md` § V2.0 process |
| **Acceptance** | Admin uploads PDF → chunks in `syllabus_chunks` → curriculum chain grounded |

---

### F-53: Fine-Tuned Local Marking + Ministry Analytics (V3.0)

| **Objective** | Local models at scale; anonymised aggregated outcomes for ministries |
| **Docs** | `roadmap.md` V3.0 · `continent-scale-blueprint.md` · `learning-impact.md` |
| **Acceptance** | Ministry dashboard — cohort aggregates only; no individual surveillance |
| **Security** | k-anonymity thresholds; no student PII in aggregates |

---

### F-54: Public Developer API + Multi-Tenant Schools (V3.0)

| **Objective** | Partner integrations; institution-level admin |
| **Docs** | `architecture.md` · `ExamEdge_Engineering_Document.md` |
| **Acceptance** | API keys with scoped access; school tenant isolation |
| **Schema** | `schools`, `school_memberships` tables |

---

### F-55: Edge Deployment + Advanced Integrity Analytics (V3.0)

| **Objective** | Regional latency; cohort-level integrity signals |
| **Docs** | `roadmap.md` · `platform-ecosystem-ops.md` |
| **Acceptance** | Edge functions in West/East Africa; integrity dashboard — not individual surveillance |

---

### F-56: Ecosystem — Mentors, Peer Learning, Career API (V4.0+)

| **Objective** | Platform ecosystem beyond examination prep |
| **Docs** | `strategic-charter.md` §10.1 V4.0+ · `student-journey.md` |
| **Features** | Peer study groups; career API; research partnerships |
| **Acceptance** | Defined per sub-feature when V3.0 complete — copy template for each |

---

### Post-MVP feature index (quick reference)

| ID   | Feature                            | Version |
| ---- | ---------------------------------- | ------- |
| F-32 | React Native mobile                | V1.1    |
| F-33 | Google OAuth                       | V1.1    |
| F-34 | Teacher dashboard                  | V1.1    |
| F-35 | PostgreSQL RLS                     | V1.1    |
| F-36 | JWT refresh rotation               | V1.1    |
| F-37 | CSP + CSRF                         | V1.1    |
| F-38 | French UI / i18n                   | V1.1    |
| F-39 | Expanded GCE subjects              | V1.1    |
| F-40 | UVE L3-L4                          | V1.1    |
| F-41 | Automated data export              | V1.1    |
| F-42 | WAEC / NECO                        | V2.0    |
| F-43 | KCSE                               | V2.0    |
| F-44 | OBC / Francophone                  | V2.0    |
| F-45 | Graduate Success hub               | V2.0    |
| F-46 | USSD/SMS                           | V2.0    |
| F-47 | Whisper oral ASR                   | V2.0    |
| F-48 | Cognitive fingerprint              | V2.0    |
| F-49 | Alumni mentors                     | V2.0    |
| F-50 | Payment / subscription             | V2.0    |
| F-51 | Local model routing                | V2.0+   |
| F-52 | Syllabus auto-chunking             | V2.0    |
| F-53 | Local marking + ministry analytics | V3.0    |
| F-54 | Public API + multi-tenant          | V3.0    |
| F-55 | Edge + integrity analytics         | V3.0    |
| F-56 | Ecosystem (mentors, peer, career)  | V4.0+   |

---

## 6. Feature Implementation Prompt Template

**Canonical reusable template:** [`feature-implementation-prompt-template.md`](feature-implementation-prompt-template.md)

The template provides the standardized 18-section workflow:

1. Feature Overview and Objectives
2. Relevant Documentation to Review
3. User Stories and Acceptance Criteria
4. Functional Requirements
5. Non-Functional Requirements
6. Database and Data Model Changes
7. API Requirements and Contracts
8. Frontend Requirements and User Experience Expectations
9. AI and Agent Requirements
10. Security and Privacy Considerations
11. Performance and Scalability Requirements
12. Logging, Monitoring, and Analytics Requirements
13. Testing Requirements
14. Pull Request and Code Review Requirements
15. Definition of Done
16. Manual Validation Checklist
17. Documentation Updates
18. Post-Implementation Review and Retrospective

**Usage:** Copy template → fill all sections → implement → follow §2–§2d → merge → next feature.

Do not duplicate the full template in this file — maintain single source in `feature-implementation-prompt-template.md`.

---

## 7. Traceability Matrix

| Unit | build-plan | architecture | AGENTS.md      | security      | engineering-ops | zero-budget | Spec        |
| ---- | ---------- | ------------ | -------------- | ------------- | --------------- | ----------- | ----------- |
| 01   | ✓          | Stack        | —              | —             | CI setup        | —           | —           |
| 02   | ✓          | —            | —              | —             | —               | —           | —           |
| 03   | ✓          | Routes       | —              | —             | —               | —           | specs/03    |
| 04   | ✓          | Math         | —              | —             | —               | —           | —           |
| 05   | ✓          | Schema       | —              | —             | —               | Neon        | —           |
| 06   | ✓          | Auth         | —              | ✓             | —               | —           | —           |
| 07   | ✓          | Analytics    | —              | PII           | —               | Plausible   | specs/07    |
| 08   | ✓          | Redis        | —              | ✓             | —               | Upstash     | —           |
| 09   | ✓          | AI bounds    | ✓ Router       | ✓ Sanitize    | —               | API keys    | —           |
| 10   | ✓          | Pattern 1    | ✓ Marking      | ✓             | AI eval         | Anthropic   | —           |
| 11   | ✓          | —            | ✓ Guidance     | ✓ Anti-leak   | AI eval         | —           | —           |
| 12   | ✓          | RAG          | ✓ Generation   | —             | —               | Voyage      | —           |
| 13   | ✓          | Async UVE    | ✓ UVE          | —             | —               | —           | —           |
| 14   | ✓          | Cache        | ✓ Curriculum   | —             | —               | —           | —           |
| 15   | ✓          | Dashboard    | —              | —             | —               | —           | —           |
| 16   | ✓          | Study        | —              | —             | —               | —           | —           |
| 17   | ✓          | Pattern 1    | ✓ Marking      | ✓ Full        | Monitoring      | —           | —           |
| 18   | ✓          | Pattern 2    | ✓ Guidance     | ✓             | —               | —           | —           |
| 19   | ✓          | Repos        | —              | —             | —               | —           | —           |
| 20   | ✓          | Explain API  | ✓ Curriculum   | —             | —               | —           | specs/20    |
| 21   | ✓          | Progress     | —              | —             | —               | —           | specs/21    |
| 22   | ✓          | Appeals      | —              | ✓ Audit       | —               | —           | specs/22    |
| 23   | ✓          | Profile      | —              | ✓ Minors      | —               | —           | specs/23    |
| 24   | ✓          | Pattern 3    | —              | validated     | —               | —           | —           |
| 25   | ✓          | Simulations  | —              | —             | —               | —           | demo-script |
| 26   | ✓          | Focus        | —              | —             | —               | —           | ui-rules    |
| 27   | ✓          | Pattern 7    | —              | Idempotency   | —               | —           | —           |
| 28   | ✓          | R2 OCR       | ✓ ocr_fallback | ✓ Storage     | —               | R2          | —           |
| 29   | ✓          | Admin        | ✓ Human gate   | ✓ RBAC        | Audit           | —           | —           |
| 30   | ✓          | Cron         | ✓ Batch        | ✓ CRON_SECRET | Cron            | Resend      | —           |
| 31   | ✓          | All          | ✓ Eval         | ✓ Pilot       | CI/CD           | All infra   | demo-script |

---

## 8. Maintenance

Update this document when:

- A new unit is added to `build-plan.md`
- A new post-MVP feature is prioritised in `roadmap.md`
- API contracts change in `architecture.md`
- AI chain behavior changes in `AGENTS.md`
- Code review or merge process changes
- A unit spec is created in `docs/context/specs/`

**Also update:** `feature-implementation-prompt-template.md` if workflow sections change.

**Commit convention:** `docs(prompts): description`

**Do not duplicate:** AI chain specifications, full schema definitions, or UI token values — link to canonical docs.

---

## 9. Completeness Statement (v2.0)

This document is the **authoritative implementation playbook** for ExamEdge when used together with:

| Document                                        | Role                                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| **This file**                                   | Workflow, merge gates, code review, MVP unit prompts, post-MVP prompts |
| **`feature-implementation-prompt-template.md`** | 18-section per-feature template                                        |
| **`build-plan.md`**                             | MVP unit UI + logic detail                                             |
| **`roadmap.md`**                                | Post-MVP prioritisation                                                |
| **`AGENTS.md` + `.cursorrules`**                | AI and coding standards                                                |
| **`architecture.md`**                           | Schema, API, invariants                                                |

**Development rule:** One feature at a time · fully tested · reviewed · merged · then next.

---

_ExamEdge Feature Development Prompts v2.1 — June 2026_
_Research first: library-docs.md + official vendor docs · CHAT-IMPLEMENTATION-PROMPT.md_
