#!/usr/bin/env python3
"""Export copy-paste-ready feature prompts from feature-development-prompts.md + metadata."""

from __future__ import annotations

import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAYBOOK = ROOT / "docs" / "context" / "feature-development-prompts.md"
OUTPUT_DIR = ROOT / "docs" / "context" / "feature-prompts"

COMMON_INTERNAL = [
    "docs/context/tech-stack-versions.md",
    "AGENTS.md",
    ".cursorrules",
    "docs/context/progress-tracker.md",
    "docs/context/architecture.md",
    "docs/context/code-standards.md",
    "docs/context/documentation-map.md",
    "docs/context/library-docs.md",
    "docs/context/build-plan.md",
]

COMMON_EXTERNAL = {
    "Node.js 22 LTS": "https://nodejs.org/docs/latest-v22.x/api/",
    "Next.js 16 (App Router)": "https://nextjs.org/docs",
    "Next.js 15→16 upgrade": "https://nextjs.org/docs/app/guides/upgrading/version-16",
    "React 19": "https://react.dev",
    "TypeScript 5.x": "https://www.typescriptlang.org/docs/",
    "Zod 4": "https://zod.dev/v4/changelog",
    "Vitest": "https://vitest.dev/guide/",
    "Drizzle ORM": "https://orm.drizzle.team/docs/overview",
    "Auth.js v5": "https://authjs.dev",
    "Neon PostgreSQL": "https://neon.tech/docs",
    "Upstash Redis": "https://upstash.com/docs/redis",
    "Anthropic API + models": "https://platform.claude.com/docs/en/about-claude/models/overview",
    "LangChain.js": "https://js.langchain.com/docs/introduction/",
    "KaTeX": "https://katex.org/docs/api.html",
    "Tailwind CSS v4": "https://tailwindcss.com/docs/upgrade-guide",
    "Tailwind + Next.js": "https://tailwindcss.com/docs/guides/nextjs",
    "Plausible": "https://plausible.io/docs",
    "Expo SDK 56": "https://docs.expo.dev/versions/v56.0.0",
}


def workflow_block(branch: str) -> str:
    return textwrap.dedent(f"""\
---
## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review all internal documents listed in this prompt — **start with `tech-stack-versions.md`** for pinned versions and deprecation list.
2. Study official documentation for every technology listed in External documentation; confirm versions match `tech-stack-versions.md` and note any newer patch releases.
3. Post **Context and Research Summary**: internal docs read, official sources consulted (with URLs), **confirmed package versions**, security advisories checked, best practices, architecture fit, risks, implementation approach, assumptions.
4. Create branch `{branch}`.
5. Implement exactly this feature — no scope creep per `.cursorrules` §16.
6. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px viewport (if UI or API consumed by UI).
8. Update all documentation listed in Documentation updates.
9. Commit using Conventional Commits (e.g. `feat(scope): description`).
10. Push branch and open Pull Request to `main` with Research Summary in PR body.
11. Complete code review checklist in `feature-development-prompts.md` §2c (architecture, security, performance, tests, requirements, code quality).
12. Address all review comments. Squash-merge to `main` only when all tests pass, browser validated, and PR approved. Update `progress-tracker.md`. Do not start the next feature until merged.

**Architecture invariants (never violate):** no client-side AI; no unvalidated AI output to students; no hint answer leakage; only `validated=true` questions in live pool; Haiku for marking; no PII in LLM prompts; idempotency on answer submissions; repositories only (no raw SQL in routes); chains do not call chains; no LLM at question delivery.
---""")


def checklist(items: list[str]) -> str:
    return "\n".join(f"- [ ] {x}" for x in items)


def bullet(items: list[str]) -> str:
    return "\n".join(f"- {x}" for x in items)


def parse_playbook_units(content: str) -> dict[str, dict[str, str]]:
    """Parse ### Unit NN: and ### F-NN: sections from playbook."""
    units: dict[str, dict[str, str]] = {}
    # MVP units
    mvp_block = re.search(r"## 4\. MVP Feature Prompts.*?\n(.*?)\n## 5\.", content, re.S)
    if mvp_block:
        chunks = re.split(r"\n### Unit (\d{2}): ", mvp_block.group(1))
        for i in range(1, len(chunks), 2):
            num, body = chunks[i], chunks[i + 1]
            units[f"Unit {num}"] = parse_sections(body.split("\n---")[0])
    # Post-MVP
    post_block = re.search(r"## 5\. Post-MVP Feature Prompts.*?\n(.*?)\n## 6\.", content, re.S)
    if post_block:
        chunks = re.split(r"\n### (F-\d+): ", post_block.group(1))
        for i in range(1, len(chunks), 2):
            fid, body = chunks[i], chunks[i + 1]
            units[fid] = parse_sections(body.split("\n---")[0])
    return units


def parse_sections(body: str) -> dict[str, str]:
    sections: dict[str, str] = {}
    current = "_intro"
    lines: list[str] = []
    for line in body.splitlines():
        m = re.match(r"^#### (.+)$", line)
        if m:
            sections[current] = "\n".join(lines).strip()
            current = m.group(1).strip()
            lines = []
        else:
            lines.append(line)
    sections[current] = "\n".join(lines).strip()
    return sections


def get(section: dict[str, str], *keys: str, default: str = "") -> str:
    for k in keys:
        if k in section and section[k].strip():
            return section[k].strip()
    return default


# Units where build-plan UI requirements are not duplicated in playbook §4
UI_OVERRIDES: dict[int, str] = {
    17: """Wire Unit 16 study session UI to real APIs:
- Replace mock submit with `POST /api/sessions/:id/responses`
- Loading state on Submit: "Marking your answer..."
- Display MarkingDisplay from API response (marks, step feedback, confidence)
- Show "Under review" badge when `flagForReview` or confidence < 0.70
- Error state with retry button — never raw API error text to students
- Generate client UUID as idempotencyKey per submission""",
    18: """Wire Unit 16 HintPanel to real API:
- Hint button disabled until first submission with marks < 50% of available
- Display "Hints remaining: N/3" after each hint
- HintPanel slides in with guiding question from API
- Disable hint button at 0 hints remaining""",
}


def infer_ai(num: int, functional: str, ai_section: str) -> str:
    if ai_section and ai_section != "No LLM calls in this unit.":
        return ai_section
    if any(x in functional for x in ("runMarkingChain", "runGuidanceChain", "runGenerationChain", "runUVE", "runCurriculum")):
        return (
            "Follow AGENTS.md chain specifications exactly. "
            "Use getModelConfig() from packages/ai/router.ts. "
            "Zod-validate all LLM output before returning to clients. "
            "See functional requirements and architecture.md for trigger points."
        )
    if num in (10, 11, 12, 13, 14):
        return f"Implement AI chain per AGENTS.md for Unit {num:02d}. Haiku/Sonnet assignment via router.ts. No client-side LLM calls."
    return "No LLM calls in this unit."


def infer_api(functional: str, api_section: str) -> str:
    if api_section and api_section != "No new API routes in this unit.":
        return api_section
    if "POST /api" in functional or "GET /api" in functional or "**API routes:**" in functional:
        return functional
    return "No new API routes in this unit."


def parse_testing_table(text: str) -> tuple[list[str], list[str], list[str]]:
    unit, integration, e2e = [], [], []
    if "| Type |" not in text:
        return unit, integration, e2e
    rows = [r for r in text.splitlines() if r.startswith("|") and "Type" not in r and "---" not in r]
    for row in rows:
        cols = [c.strip() for c in row.strip("|").split("|")]
        if len(cols) >= 2:
            t, scope = cols[0].lower(), cols[1]
            if "unit" in t:
                unit.append(scope)
            elif "integration" in t:
                integration.append(scope)
            elif "e2e" in t or "manual" in t:
                e2e.append(scope)
            else:
                unit.append(f"{cols[0]}: {scope}")
    return unit, integration, e2e


def parse_post_mvp_table(body: str) -> dict[str, str]:
    """Parse | **Key** | value | rows in post-MVP summaries."""
    out: dict[str, str] = {}
    for line in body.splitlines():
        m = re.match(r"^\| \*\*(.+?)\*\* \| (.+) \|$", line.strip())
        if m:
            out[m.group(1).strip()] = m.group(2).strip()
    return out


# Metadata: slug, branch, prereq, release, extra internal docs, extra external
MVP_META: dict[int, dict] = {
    1: {"slug": "monorepo-scaffold", "prereq": "None — first unit.", "release": "V1.0 MVP"},
    2: {"slug": "design-system", "prereq": "Unit 01 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/ui-tokens.md", "docs/context/ui-rules.md", "docs/context/ui-registry.md"]},
    3: {"slug": "landing-page", "prereq": "Unit 02 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/ui-registry.md"]},
    4: {"slug": "katex-mathquill", "prereq": "Unit 02 merged to main.", "release": "V1.0 MVP"},
    5: {"slug": "database-schema", "prereq": "Unit 01 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/zero-budget-stack.md"]},
    6: {"slug": "auth-scaffold", "prereq": "Units 01 and 05 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    7: {"slug": "plausible-analytics", "prereq": "Unit 01 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    8: {"slug": "redis-rate-limiting", "prereq": "Unit 01 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md", "docs/context/zero-budget-stack.md"]},
    9: {"slug": "model-router", "prereq": "Units 01 and 08 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/ai-workflow-rules.md", "docs/context/security.md"]},
    10: {"slug": "marking-chain", "prereq": "Unit 09 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/platform-how-it-works.md", "docs/context/ai-cost-and-exam-system.md"]},
    11: {"slug": "guidance-chain", "prereq": "Unit 09 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/platform-how-it-works.md"]},
    12: {"slug": "generation-rag", "prereq": "Units 05 and 09 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/content-architecture.md", "docs/context/zero-budget-stack.md"]},
    13: {"slug": "uve-probes", "prereq": "Unit 09 merged to main.", "release": "V1.0 MVP"},
    14: {"slug": "curriculum-chain", "prereq": "Units 05 and 09 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/content-architecture.md"]},
    15: {"slug": "dashboard-ui-mock", "prereq": "Units 02, 04, and 06 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/ui-registry.md", "docs/context/ui-context.md"]},
    16: {"slug": "study-session-ui-mock", "prereq": "Units 04 and 15 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/ui-registry.md"]},
    17: {"slug": "session-api", "prereq": "Units 05, 06, 08, 10, 13, and 16 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md", "docs/context/platform-how-it-works.md"]},
    18: {"slug": "hint-flow", "prereq": "Units 11 and 17 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    19: {"slug": "dashboard-real-data", "prereq": "Units 15 and 17 merged to main.", "release": "V1.0 MVP"},
    20: {"slug": "curriculum-explain-ui", "prereq": "Units 14 and 16 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/content-architecture.md"]},
    21: {"slug": "progress-page", "prereq": "Unit 19 merged to main.", "release": "V1.0 MVP"},
    22: {"slug": "marking-appeals", "prereq": "Unit 17 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    23: {"slug": "profile-privacy", "prereq": "Unit 06 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    24: {"slug": "question-pool", "prereq": "Units 05, 12, and 17 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/content-architecture.md"]},
    25: {"slug": "exam-simulation", "prereq": "Units 17 and 24 merged to main.", "release": "V1.0 MVP"},
    26: {"slug": "focus-sessions", "prereq": "Unit 25 merged to main.", "release": "V1.0 MVP"},
    27: {"slug": "pwa-offline", "prereq": "Unit 17 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/zero-budget-stack.md"]},
    28: {"slug": "photo-ocr", "prereq": "Unit 17 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/security.md"]},
    29: {"slug": "admin-validation", "prereq": "Units 12 and 06 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/content-architecture.md"]},
    30: {"slug": "background-jobs", "prereq": "Units 12, 14, and 29 merged to main.", "release": "V1.0 MVP", "internal": ["docs/context/engineering-operations.md"]},
    31: {"slug": "pilot-hardening", "prereq": "All Units 01–30 merged to main.", "release": "V1.0 MVP", "internal": ["docs/demo-script.md", "docs/context/zero-budget-stack.md", "docs/context/engineering-operations.md", "docs/context/security.md", "docs/context/project-overview.md"]},
}

POST_META: dict[int, dict] = {
    32: {"slug": "react-native-mobile", "release": "V1.1", "prereq": "All MVP Units 01–31 merged to main.", "internal": ["docs/context/roadmap.md", "docs/context/platform-ecosystem-ops.md"]},
    33: {"slug": "google-oauth", "release": "V1.1", "prereq": "Unit 06 merged to main.", "internal": ["docs/context/security.md"]},
    34: {"slug": "teacher-dashboard", "release": "V1.1", "prereq": "MVP V1.0 complete.", "internal": ["docs/context/roadmap.md", "docs/context/content-architecture.md"]},
    35: {"slug": "postgresql-rls", "release": "V1.1", "prereq": "Units 05 and 06 merged to main.", "internal": ["docs/context/security.md"]},
    36: {"slug": "jwt-refresh-blocklist", "release": "V1.1", "prereq": "Unit 06 merged to main.", "internal": ["docs/context/security.md"]},
    37: {"slug": "csp-csrf-headers", "release": "V1.1", "prereq": "Unit 06 merged to main.", "internal": ["docs/context/security.md", "docs/context/engineering-operations.md"]},
    38: {"slug": "french-i18n", "release": "V1.1", "prereq": "MVP student UI complete.", "internal": ["docs/context/roadmap.md", "docs/context/platform-ecosystem-ops.md"]},
    39: {"slug": "expanded-gce-subjects", "release": "V1.1", "prereq": "Units 05 and 29 merged to main.", "internal": ["docs/context/content-architecture.md", "docs/context/content-governance.md"]},
    40: {"slug": "uve-l3-l4", "release": "V1.1", "prereq": "Unit 13 merged to main.", "internal": ["docs/context/ai-cost-and-exam-system.md"]},
    41: {"slug": "automated-data-export", "release": "V1.1", "prereq": "Unit 23 merged to main.", "internal": ["docs/context/security.md", "docs/context/student-journey.md"]},
    42: {"slug": "waec-neco", "release": "V2.0", "prereq": "V1.1 content architecture complete.", "internal": ["docs/context/content-architecture.md", "docs/context/content-governance.md", "docs/context/roadmap.md"]},
    43: {"slug": "kcse", "release": "V2.0", "prereq": "F-42 WAEC/NECO board onboarding pattern established.", "internal": ["docs/context/content-architecture.md"]},
    44: {"slug": "obc-francophone", "release": "V2.0", "prereq": "F-38 French i18n complete.", "internal": ["docs/context/roadmap.md", "docs/context/content-governance.md"]},
    45: {"slug": "graduate-success-hub", "release": "V2.0", "prereq": "MVP student journey complete.", "internal": ["docs/context/student-journey.md", "docs/context/strategic-charter.md"]},
    46: {"slug": "ussd-sms", "release": "V2.0", "prereq": "Core API and auth complete.", "internal": ["docs/context/platform-ecosystem-ops.md", "docs/context/zero-budget-stack.md"]},
    47: {"slug": "whisper-oral-asr", "release": "V2.0", "prereq": "F-32 mobile app complete.", "internal": ["docs/context/platform-ecosystem-ops.md"]},
    48: {"slug": "cognitive-fingerprint", "release": "V2.0", "prereq": "Units 13 and 30 merged to main.", "internal": ["docs/context/platform-how-it-works.md"]},
    49: {"slug": "alumni-mentors", "release": "V2.0", "prereq": "F-45 Graduate Success Hub complete.", "internal": ["docs/context/student-journey.md", "docs/context/platform-ecosystem-ops.md"]},
    50: {"slug": "payment-subscription", "release": "V2.0", "prereq": "Pilot product-market fit validated.", "internal": ["docs/context/zero-budget-stack.md", "docs/context/roadmap.md"]},
    51: {"slug": "local-model-routing", "release": "V2.0+", "prereq": "Unit 09 router complete; marking benchmarks ≥92% established.", "internal": ["docs/context/ai-cost-and-exam-system.md"]},
    52: {"slug": "syllabus-auto-chunking", "release": "V2.0", "prereq": "F-42 board onboarding started.", "internal": ["docs/context/content-governance.md", "docs/context/content-architecture.md"]},
    53: {"slug": "ministry-analytics", "release": "V3.0", "prereq": "V2.0 multi-board deployment with sufficient student volume.", "internal": ["docs/context/roadmap.md", "docs/context/learning-impact.md"]},
    54: {"slug": "public-api-multi-tenant", "release": "V3.0", "prereq": "F-34 Teacher dashboard and F-35 RLS complete.", "internal": ["docs/context/architecture.md"]},
    55: {"slug": "edge-integrity-analytics", "release": "V3.0", "prereq": "Units 25 and F-48 complete.", "internal": ["docs/context/roadmap.md", "docs/context/platform-ecosystem-ops.md"]},
    56: {"slug": "ecosystem-v4", "release": "V4.0+", "prereq": "V3.0 platform scale complete.", "internal": ["docs/context/strategic-charter.md", "docs/context/student-journey.md"]},
}


def default_nfr() -> str:
    return """| Category | Requirement |
|----------|-------------|
| **Quality** | TypeScript strict mode; no `any` without documented exception |
| **Testing** | Vitest unit tests for all new logic; integration tests for API routes |
| **Accessibility** | 360px viewport; 44px minimum touch targets; 16px minimum body text |
| **Security** | Zod validation at all boundaries; auth on protected routes |
| **Performance** | No LLM calls during question delivery; Server Components default |"""


def render_mvp(num: int, name: str, sections: dict[str, str]) -> str:
    meta = MVP_META[num]
    slug = meta["slug"]
    fid = f"Unit {num:02d}"
    branch = f"feature/unit-{num:02d}-{slug}"
    prereq = meta["prereq"]
    release = meta["release"]

    purpose = get(sections, "Purpose & Business Objective")
    deps = get(sections, "Dependencies")
    functional = get(sections, "Functional Requirements")
    database = get(sections, "Database / Schema", "Database and data model", default="No schema changes in this unit. Use existing tables via repositories.")
    api_raw = get(sections, "API Requirements", "API Contracts", "Backend requirements and API contracts")
    api = infer_api(functional, api_raw if api_raw else "No new API routes in this unit.")
    frontend = UI_OVERRIDES.get(num) or get(sections, "Frontend Requirements", "Frontend requirements and user experience", default="No new student-facing UI in this unit.")
    ai_raw = get(sections, "AI / Agent Interactions", "AI and agent requirements")
    ai = infer_ai(num, functional, ai_raw if ai_raw else "")
    auth = get(sections, "Authentication and authorization", "Authentication & Authorization", default="Follow existing Auth.js middleware for any protected routes added.")
    security = get(sections, "Security Considerations", "Security, privacy, and compliance")
    edge = get(sections, "Edge Cases & Error Handling", "Edge Cases", "Edge cases and failure scenarios")
    perf = get(sections, "Performance & Scalability", "Performance", "Performance and scalability")
    logging = get(sections, "Logging, Analytics & Observability", "Logging", "Logging, monitoring, and analytics")
    testing = get(sections, "Testing Requirements")
    manual = get(sections, "Manual Testing Checklist", "Browser validation requirements (manual)")
    dod = get(sections, "Definition of Done", "Definition of Done and merge requirements")
    oos = get(sections, "Out of Scope", "Out of scope")
    nfr = get(sections, "Non-Functional Requirements", default=default_nfr())
    stories_raw = get(sections, "User Stories")
    acceptance_raw = get(sections, "Acceptance Criteria")

    if num in (6, 17, 18, 22, 23, 29) and auth == "Follow existing Auth.js middleware for any protected routes added.":
        auth = (
            "- All routes require authenticated student session (Auth.js JWT)\n"
            "- Ownership check: session.studentId must match auth user id\n"
            "- Return 401 if unauthenticated; 403 if resource belongs to another user\n"
            "- Apply AI rate limit middleware from Unit 08 on marking/hint routes"
        )
    if num == 17 and database.startswith("No schema"):
        database = (
            "No new tables. Uses existing `student_sessions`, `student_responses`, `mastery_records`.\n"
            "`responsesRepository.submit()` performs atomic transaction: INSERT response + UPDATE mastery + UPDATE session counters."
        )

    unit_t, int_t, e2e_t = parse_testing_table(testing)
    stories = bullet([s.lstrip("- ").strip() for s in stories_raw.splitlines() if s.strip().startswith("-")]) if stories_raw else "- See acceptance criteria"
    acceptance = checklist([s.lstrip("- [ ] ").lstrip("- ").strip() for s in acceptance_raw.splitlines() if s.strip() and not s.strip().startswith("#")])
    internal = list(dict.fromkeys(meta.get("internal", []) + COMMON_INTERNAL))

    external_lines = [f"- **{k}:** {v}" for k, v in COMMON_EXTERNAL.items()]
    default_perf = "| Metric | Target |\n|--------|--------|\n| API p95 | < 3s for synchronous AI routes |\n| Build | `npm run typecheck` passes all packages |"
    default_logging = "- Structured server logs with requestId on API routes\n- Plausible events per code-standards.md when user actions fire\n- Sentry for unhandled errors (required from Unit 31)"
    default_edge = "- Invalid input → 400 with safe message\n- Unauthorized → 401; wrong resource owner → 403\n- Rate limit exceeded → 429 with retry guidance\n- AI validation failure → flag for review, never partial marks to student"
    default_functional = f"See build-plan.md Unit {num:02d} for full functional specification."

    return f"""# {fid}: {name}

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | {fid} |
| **Feature name** | {name} |
| **Release** | {release} |
| **Branch** | `{branch}` |
| **Prerequisites** | {prereq} |

## Purpose and business objectives

{purpose}

## Problem statement

This unit is required to deliver **{name}** as defined in `build-plan.md` Unit {num:02d}. Without it, the MVP pilot cannot proceed to the next build phase.

## User value

Completing this unit advances ExamEdge toward a demo-ready MVP pilot — an AI-powered examination preparation and personalized learning platform for secondary students across Africa, launching with GCE O/A Level in Cameroon and expanding to multiple curricula and national examination systems.

## User stories

{stories}

## Acceptance criteria

{acceptance}

## Prerequisites and dependencies

{prereq}

{deps}

## Internal documentation (read before coding)

{checklist(internal)}

## External documentation (official URLs — study before coding)

{chr(10).join(external_lines)}

Also consult `docs/context/library-docs.md` § Official External Documentation for project-specific integration patterns. **Version authority:** `docs/context/tech-stack-versions.md` — do not use deprecated APIs listed there.

## Functional requirements

{functional if functional else default_functional}

## Non-functional requirements

{nfr}

## Database and schema changes

{database}

## Backend requirements and API contracts

{api}

## Frontend requirements and user experience

{frontend}

## AI and agent requirements

{ai}

## Authentication and authorization

{auth}

## Security, privacy, and compliance

{security if security else checklist(["Follow docs/context/security.md for all new routes", "Zod validation on all inputs", "No secrets in client bundle", "Sanitize user text before LLM inclusion", "No student PII in AI prompts"])}

## Performance and scalability

{perf if perf else default_perf}

## Logging, analytics, and observability

{logging if logging else default_logging}

## Edge cases and failure scenarios

{edge if edge else default_edge}

## Unit testing requirements

{checklist(unit_t) if unit_t else checklist(["Core logic covered with Vitest", "Valid and invalid input cases", "Schema validation edge cases"])}

## Integration testing requirements

{checklist(int_t) if int_t else checklist(["API routes return correct status codes", "Auth middleware enforced on protected routes", "Repository layer tested against test database"])}

## End-to-end testing requirements

{checklist(e2e_t) if e2e_t else checklist(["Manual E2E for MVP critical paths", "Automated E2E added in V1.1+ CI where applicable"])}

## Browser validation requirements (manual)

{checklist([s.lstrip("- [ ] ").lstrip("- ").strip() for s in manual.splitlines() if s.strip() and s.strip().startswith("-")]) if manual else checklist(["N/A for backend-only unit", "If UI touched: verify at 360px, no console errors, loading/empty/error states"])}

## Documentation updates required after implementation

{checklist(["docs/context/progress-tracker.md (after merge)", "docs/context/ui-registry.md (if UI components added)", "AGENTS.md (if AI chain behaviour changed)", "docs/context/library-docs.md (if new integration pattern established)"])}

{workflow_block(branch)}

## Definition of Done and merge requirements

{dod if dod else checklist(["All acceptance criteria met and manually verified", "`npm run typecheck`, `npm run lint`, `npm run test` pass", "PR approved and squash-merged to main", "progress-tracker.md updated"])}

## Out of scope

{oos if oos else "Features assigned to later units per build-plan.md and roadmap.md. Do not implement adjacent units in the same PR."}
"""


def render_post(num: int, name: str, sections: dict[str, str]) -> str:
    meta = POST_META[num]
    slug = meta["slug"]
    fid = f"F-{num}"
    branch = f"feature/f-{num}-{slug}"
    prereq = meta["prereq"]
    release = meta["release"]
    table = parse_post_mvp_table(get(sections, "_intro"))

    purpose = table.get("Objective", get(sections, "Purpose & Business Objective", default=f"Deliver {name} per roadmap.md."))
    scope = table.get("Scope", table.get("Features", ""))
    docs = table.get("Docs", "")
    acceptance = table.get("Acceptance", "")
    security = table.get("Security", table.get("RBAC", ""))
    oos = table.get("Out of scope", table.get("Out of Scope", ""))
    schema = table.get("Schema", "")
    routes = table.get("Routes", "")

    internal = list(dict.fromkeys(meta.get("internal", []) + COMMON_INTERNAL + ["docs/context/roadmap.md"] + ([docs] if docs else [])))

    return f"""# {fid}: {name}

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Feature overview

| Field | Value |
|-------|-------|
| **Feature ID** | {fid} |
| **Feature name** | {name} |
| **Release** | {release} |
| **Branch** | `{branch}` |
| **Prerequisites** | {prereq} |

## Purpose and business objectives

{purpose}

## Problem statement

Post-MVP expansion requires **{name}** to scale ExamEdge beyond the Cameroon MVP pilot per `roadmap.md`.

## User value

{name} unlocks the roadmap milestone for **{release}**, extending access, security, or platform capabilities for students, teachers, and institutional partners.

## User stories

- As a platform stakeholder, I need {name.lower()} so ExamEdge can expand per roadmap.md without breaking MVP invariants.
- As a developer, I implement {name.lower()} on a dedicated branch with full test coverage and documentation updates.
- As a student or teacher (where applicable), I benefit from {name.lower()} without regression to core marking, hints, or offline study flows.

## Acceptance criteria

{checklist([acceptance]) if acceptance else checklist([f"roadmap.md acceptance criteria for {fid} met", "No regression to MVP Units 01–31 behaviour", "Security and RBAC requirements satisfied"])}

## Prerequisites and dependencies

{prereq}

## Internal documentation (read before coding)

{checklist(internal)}

## External documentation (official URLs — study before coding)

{chr(10).join(f"- **{k}:** {v}" for k, v in COMMON_EXTERNAL.items())}

Consult `docs/context/library-docs.md` for project integration patterns.

## Functional requirements

{scope if scope else get(sections, "Functional Requirements", default=f"Implement {name} per roadmap.md and architecture.md.")}

## Non-functional requirements

{default_nfr()}

## Database and schema changes

{schema if schema else "Document any schema changes in a Drizzle migration with rollback notes. Follow architecture.md naming conventions."}

## Backend requirements and API contracts

{routes if routes else "Define REST routes with Zod request/response schemas. Document contracts in PR description."}

## Frontend requirements and user experience

Follow `ui-tokens.md`, `ui-rules.md`, and `ui-context.md`. Mobile-first at 360px. Loading, empty, and error states required.

## AI and agent requirements

{table.get("AI", "No new AI chains unless explicitly specified in roadmap.md. If chains added, follow AGENTS.md exactly — new chain requires architecture review.")}

## Authentication and authorization

{table.get("RBAC", "Extend RBAC per security.md. Default role for new users remains student unless specified.")}

## Security, privacy, and compliance

{security if security else checklist(["Follow docs/context/security.md", "Zod validation on all inputs", "No PII in LLM prompts", "Audit log for sensitive operations"])}

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

{checklist(["Core logic covered with Vitest", "RBAC permission checks", "Zod schema valid/invalid cases"])}

## Integration testing requirements

{checklist(["API routes with auth scenarios", "Database repository integration tests", "Third-party webhook handlers (if applicable)"])}

## End-to-end testing requirements

{checklist(["Manual E2E on preview deploy", "Device testing for mobile features (F-32, F-46)", "Cross-browser smoke at 360px"])}

## Browser validation requirements (manual)

{checklist(["360px viewport — no horizontal scroll", "No console errors on happy path", "Loading, empty, and error states verified"])}

## Documentation updates required after implementation

{checklist(["docs/context/progress-tracker.md", "docs/context/roadmap.md (if scope changed)", "AGENTS.md (if AI chains changed)", "docs/context/library-docs.md (new patterns)"])}

{workflow_block(branch)}

## Definition of Done and merge requirements

{checklist(["All acceptance criteria met", "`npm run typecheck`, `npm run lint`, `npm run test` pass", "Code review checklist §2c complete", "PR squash-merged to main", "progress-tracker.md updated"])}

## Out of scope

{oos if oos else "Features assigned to later roadmap phases. One feature per branch/PR/merge."}
"""


def extract_unit_names(content: str) -> dict[str, str]:
    names: dict[str, str] = {}
    for m in re.finditer(r"### Unit (\d{2}): (.+)$", content, re.M):
        names[f"Unit {m.group(1)}"] = m.group(2).strip()
    for m in re.finditer(r"### (F-\d+): (.+?) \(", content, re.M):
        names[m.group(1)] = m.group(2).strip()
    return names


def write_readme(files: list[str]) -> None:
    sections = [
        ("MVP V1.0 — Phase 0 Foundation (Units 01–08)", range(1, 9)),
        ("MVP V1.0 — Phase 1 AI Chains (Units 09–14)", range(9, 15)),
        ("MVP V1.0 — Phase 2 Student Core (Units 15–23)", range(15, 24)),
        ("MVP V1.0 — Phase 3 Assessment (Units 24–26)", range(24, 27)),
        ("MVP V1.0 — Phase 4 Resilience (Units 27–31)", range(27, 32)),
        ("Post-MVP V1.1 (F-32–F-40)", range(32, 41)),
        ("Post-MVP V2.0 (F-41–F-51)", range(41, 52)),
        ("Post-MVP V3.0+ (F-52–F-56)", range(52, 57)),
    ]
    lines = [
        "# Feature Implementation Prompts — ExamEdge",
        "",
        "Copy-paste-ready prompts for every MVP unit and post-MVP feature.",
        "",
        "**How to use:** Open the next prompt file → copy the **entire file** → paste into chat → wait for Context and Research Summary → implement.",
        "",
        "**Canonical index:** [`FEATURE-IMPLEMENTATION-PROMPTS.md`](../FEATURE-IMPLEMENTATION-PROMPTS.md)",
        "",
        "**Process reference:** [`feature-development-prompts.md`](../feature-development-prompts.md) §2–§2d",
        "",
        "## Build order",
        "",
    ]
    by_name = {Path(f).name: f for f in files}
    for title, ids in sections:
        lines.append(f"### {title}")
        lines.append("")
        for i in ids:
            prefix = f"unit-{i:02d}-" if i <= 31 else f"f-{i}-"
            matches = sorted(n for n in by_name if n.startswith(prefix))
            for fname in matches:
                label = fname.replace(".md", "").replace("-", " ").title()
                lines.append(f"- [{label}](./{fname})")
        lines.append("")
    (OUTPUT_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def write_master_index(files: list[str]) -> None:
    master = ROOT / "docs" / "context" / "FEATURE-IMPLEMENTATION-PROMPTS.md"
    readme = (OUTPUT_DIR / "README.md").read_text(encoding="utf-8")
    build_order = readme.split("## Build order", 1)[1] if "## Build order" in readme else ""
    build_order = build_order.replace("](./", "](feature-prompts/")
    body = f"""# Feature Implementation Prompts — ExamEdge

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
{build_order}

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
"""
    master.write_text(body, encoding="utf-8")


def main() -> None:
    content = PLAYBOOK.read_text(encoding="utf-8")
    parsed = parse_playbook_units(content)
    names = extract_unit_names(content)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    written: list[str] = []

    for num in range(1, 32):
        fid = f"Unit {num:02d}"
        name = names.get(fid, MVP_META[num]["slug"].replace("-", " ").title())
        sections = parsed.get(fid, {})
        slug = MVP_META[num]["slug"]
        path = OUTPUT_DIR / f"unit-{num:02d}-{slug}.md"
        path.write_text(render_mvp(num, name, sections), encoding="utf-8")
        written.append(path.name)
        print(f"Wrote {path.relative_to(ROOT)}")

    for num in range(32, 57):
        fid = f"F-{num}"
        name = names.get(fid, POST_META[num]["slug"].replace("-", " ").title())
        sections = parsed.get(fid, {})
        slug = POST_META[num]["slug"]
        path = OUTPUT_DIR / f"f-{num}-{slug}.md"
        path.write_text(render_post(num, name, sections), encoding="utf-8")
        written.append(path.name)
        print(f"Wrote {path.relative_to(ROOT)}")

    write_readme(written)
    write_master_index(written)
    print(f"Generated {len(written)} prompts + README + FEATURE-IMPLEMENTATION-PROMPTS.md")


if __name__ == "__main__":
    main()
