# AI Workflow Rules — ExamEdge

Direct instructions for the AI coding agent. Rules, not guidelines.

---

## Approach

Build incrementally using spec-driven workflow. Context files define what to build, how, and current progress. Implement against `docs/context/build-plan.md` — do not infer behaviour from scratch.

### Read Order (Every Session)

1. `AGENTS.md`
2. `.cursorrules`
3. `docs/context/progress-tracker.md`
4. Current unit in `docs/context/build-plan.md`
5. `docs/context/feature-development-prompts.md` §1b + Unit NN
6. `docs/context/library-docs.md` — project patterns + **official external doc URLs**
7. `docs/context/architecture.md` (if touching API/DB/AI)
8. `docs/context/ui-tokens.md` + `docs/context/ui-rules.md` (if touching UI)

### Research-First Rule (No Code Until Complete)

Before writing any code:

1. **Identify** all technologies, libraries, APIs, and services for the unit
2. **Read** internal project docs (list above + conditional docs in `documentation-map.md`)
3. **Study** official documentation for each technology (`library-docs.md` § Official External Documentation)
4. **Post** Context and Research Summary (`CHAT-IMPLEMENTATION-PROMPT.md` Phase A3 or template §2b)
5. **Then** implement — grounded in docs, not training assumptions

Never rely on training knowledge alone for API patterns. Verify against official docs and `library-docs.md`.

---

## Scoping Rules

- Work on **one build unit at a time**
- Prefer small verifiable increments
- Do not combine UI + DB migration + AI chain unless unit explicitly requires all three
- Do not scaffold V1.1 features during MVP (mobile app, teacher dashboard, OAuth)
- Do not install packages not listed in current unit or library-docs.md approved list
- Do not modify AI system prompts without explicit instruction + AGENTS.md update

---

## UI-First Principle

For every student-facing feature:

1. Build complete UI with mock data
2. Verify on 360px viewport (Chrome DevTools)
3. Update ui-registry.md with component classes
4. Wire backend in separate step within same unit or next sub-step
5. Never ship invisible backend with no UI verification

---

## When to Split Work

Split if combining:
- UI changes + AI chain + database migration (unless unit says otherwise)
- Multiple unrelated API routes
- Behaviour undefined in context files

**For complex units:** copy `specs/00-spec-template.md` → `specs/NN-name.md` before implementing.

**Find the right doc:** `documentation-map.md` maps every concern to its primary file.

If not verifiable end-to-end quickly — scope too broad.

---

## Handling Missing Requirements

- Do not invent product behaviour — check project-overview.md and AGENTS.md
- Do not invent marking/hint rules — follow AGENTS.md chain specs exactly
- Ambiguous: add to progress-tracker.md Open Questions, ask user
- Architectural decision needed: update architecture.md first
- One clarifying question beats wrong implementation

---

## Protected Files

Do not modify unless explicitly instructed:

- `AGENTS.md` (docs tasks only)
- `packages/ai/chains/*` SYSTEM_PROMPT constants
- Applied Drizzle migrations (create new migration instead)
- `.env.local` / secrets
- `components/ui/*` primitives (extend, don't rewrite)

---

## AI-Specific Rules

- Never call Anthropic from client
- Never bypass Zod on chain outputs
- Never return partial marking on validation failure
- Never disable anti-leakage on guidance chain
- Never serve `validated=false` questions
- Never use Sonnet for marking
- Log every AI call per code-standards.md
- Run marking/hint benchmarks when modifying those chains

---

## Keeping Docs in Sync

| Change | Update |
|--------|--------|
| New component built | ui-registry.md |
| New API route | architecture.md if new boundary |
| New table/column | architecture.md + migration |
| New UI token | ui-tokens.md |
| Unit completed | progress-tracker.md |
| Scope change | project-overview.md |
| Chain behaviour change | AGENTS.md |
| New library pattern | library-docs.md |

---

## Verification Before Next Unit

1. Unit works end-to-end within scope
2. No architecture invariant violated
3. `npm run typecheck && npm run lint && npm run test` pass
4. 360px viewport verified for UI units
5. ui-registry.md updated for new components
6. progress-tracker.md updated

---

## Session Prompts

**Start:**
```
Read AGENTS.md and docs/context/progress-tracker.md.
Implement Unit [NN] from docs/context/build-plan.md exactly.
Do not go beyond scope. Update progress-tracker when done.
```

**Correct:**
```
Unit [NN]: [element] does not match build-plan.
Expected: [spec]
Current: [built]
Fix only this.
```

**Close:**
```
Unit [NN] verified. Mark complete in progress-tracker.md.
List files changed and end-to-end test steps.
```

---

## Cost Discipline

- Haiku for marking, L1-L2 hints, UVE L1-L2, reports, cross-examination
- Sonnet only where AGENTS.md router specifies
- No generation chain in real-time student sessions
- No regenerating cached curriculum explanations
- Never remove idempotency checks
