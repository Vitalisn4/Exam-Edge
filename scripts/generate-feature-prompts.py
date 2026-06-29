#!/usr/bin/env python3
"""Generate copy-paste-ready feature implementation prompts for ExamEdge."""

from __future__ import annotations

import sys
import textwrap
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "docs" / "context" / "feature-prompts"

WORKFLOW_BLOCK = textwrap.dedent("""\
---
## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review all internal documents listed in this prompt.
2. Study official documentation for every technology listed (URLs provided).
3. Post Context and Research Summary: internal docs read, official sources, best practices, architecture fit, risks, implementation approach, assumptions.
4. Create branch `feature/unit-NN-short-name` (or `feature/f-NN-short-name` for post-MVP).
5. Implement exactly this feature — no scope creep per .cursorrules §16.
6. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px (if UI/API).
8. Update documentation listed below.
9. Commit: Conventional Commits (`feat(scope): description`).
10. Push branch and open Pull Request to `main` with Research Summary in PR body.
11. Complete code review checklist (architecture, security, performance, tests, requirements, code quality) — see feature-development-prompts.md §2c.
12. Address review comments. Merge squash to `main` only when all tests pass, browser validated, PR approved. Update progress-tracker.md. Do not start the next feature until merged.

Architecture invariants (never violate): no client-side AI; no unvalidated AI to students; no hint answer leakage; validated=true only for questions; Haiku for marking; no PII in LLM prompts; idempotency on submissions; repositories only (no raw SQL in routes); no chain calls chain; no LLM at question delivery.
---""")

COMMON_INTERNAL = [
    "AGENTS.md",
    ".cursorrules",
    "docs/context/progress-tracker.md",
    "docs/context/architecture.md",
    "docs/context/code-standards.md",
    "docs/context/documentation-map.md",
    "docs/context/library-docs.md",
]

COMMON_EXTERNAL = {
    "Next.js 14": "https://nextjs.org/docs",
    "TypeScript": "https://www.typescriptlang.org/docs/",
    "Zod": "https://zod.dev",
    "Vitest": "https://vitest.dev/guide/",
}


def bullet(items: list[str]) -> str:
    return "\n".join(f"- {x}" for x in items)


def checklist(items: list[str]) -> str:
    return "\n".join(f"- [ ] {x}" for x in items)


def table(rows: list[tuple[str, str]]) -> str:
    lines = ["| Item | Detail |", "|------|--------|"]
    for k, v in rows:
        lines.append(f"| {k} | {v} |")
    return "\n".join(lines)


def ext_docs(tech_map: dict[str, str]) -> str:
    merged = {**COMMON_EXTERNAL, **tech_map}
    return "\n".join(f"- **{k}:** {v}" for k, v in merged.items())


def render(f: dict) -> str:
    fid = f["id"]
    name = f["name"]
    release = f["release"]
    branch = f["branch"]
    prereq = f.get("prereq", "None")
    purpose = f["purpose"]
    problem = f["problem"]
    value = f["value"]
    stories = f["stories"]
    acceptance = f["acceptance"]
    internal = f.get("internal", []) + COMMON_INTERNAL
    external = ext_docs(f.get("external", {}))
    tech = f["tech"]
    functional = f["functional"]
    nfr = f.get("nfr", [])
    database = f.get("database", "N/A — no schema changes in this unit.")
    api = f.get("api", "N/A — no new API routes in this unit.")
    frontend = f.get("frontend", "N/A — no student-facing UI in this unit.")
    ai = f.get("ai", "N/A — no LLM calls in this feature.")
    auth = f.get("auth", "N/A — auth unchanged; follow existing middleware patterns if routes added.")
    security = f.get("security", [])
    performance = f.get("performance", [])
    logging = f.get("logging", [])
    edge_cases = f.get("edge_cases", [])
    unit_tests = f.get("unit_tests", [])
    integration = f.get("integration", [])
    e2e = f.get("e2e", [])
    browser = f.get("browser", [])
    doc_updates = f.get("doc_updates", ["progress-tracker.md"])
    out_of_scope = f.get("out_of_scope", [])

    nfr_block = (
        table(nfr)
        if nfr
        else "| Category | Requirement |\n|----------|-------------|\n| **Quality** | TypeScript strict; no `any` types |\n| **Testing** | Vitest unit tests for new logic |\n| **Accessibility** | 360px viewport, 44px touch targets where UI exists |"
    )
    security_block = (
        checklist(security)
        if security
        else "- [ ] Follow security.md for any new routes\n- [ ] Zod validation on all inputs\n- [ ] No secrets in client bundle"
    )
    performance_block = (
        table(performance)
        if performance
        else "| Metric | Target |\n|--------|--------|\n| Build | `npm run typecheck` passes all packages |\n| Tests | `npm run test` completes without timeout |"
    )
    logging_block = (
        bullet(logging)
        if logging
        else "- Structured server logs with requestId where applicable\n- Sentry for unhandled errors (Unit 31+)\n- Plausible events per code-standards.md when user actions fire"
    )
    edge_block = (
        bullet(edge_cases)
        if edge_cases
        else "- Invalid input returns 400 with safe message\n- Missing env vars fail fast at startup with clear error\n- Graceful degradation when optional services unavailable"
    )
    unit_block = (
        checklist(unit_tests)
        if unit_tests
        else "- [ ] Core logic covered with Vitest\n- [ ] Valid and invalid input cases\n- [ ] Edge cases from section above"
    )
    integration_block = (
        checklist(integration)
        if integration
        else "- [ ] API routes return correct status codes (401/403/400/404 as applicable)\n- [ ] Auth middleware enforced on protected routes"
    )
    e2e_block = (
        checklist(e2e)
        if e2e
        else "- [ ] Manual E2E for MVP; automated E2E in V1.1+ CI\n- [ ] Critical path verified on preview deploy"
    )
    browser_block = (
        checklist(browser)
        if browser
        else "- [ ] N/A for backend-only unit, or verify at 360px if UI touched\n- [ ] No console errors\n- [ ] Loading, empty, and error states checked"
    )
    oos_block = (
        bullet(out_of_scope)
        if out_of_scope
        else "- Features deferred to later units per build-plan.md and roadmap.md\n- Do not implement adjacent units in the same PR"
    )

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

## Purpose

{purpose}

## Problem statement

{problem}

## User value

{value}

## User stories

{bullet(stories)}

## Acceptance criteria

{checklist(acceptance)}

## Prerequisites

Complete these units/features before starting {fid}:

{prereq}

## Internal documentation (read before coding)

{checklist(list(dict.fromkeys(internal)))}

## External documentation (official URLs)

{external}

## Technologies

{bullet(tech)}

## Functional requirements

{bullet(functional)}

## Non-functional requirements

{nfr_block}

## Database and data model

{database}

## API requirements

{api}

## Frontend requirements

{frontend}

## AI and agent requirements

{ai}

## Authentication and authorization

{auth}

## Security and privacy

{security_block}

## Performance and scalability

{performance_block}

## Logging, monitoring, and analytics

{logging_block}

## Edge cases and failure modes

{edge_block}

## Unit tests

{unit_block}

## Integration tests

{integration_block}

## End-to-end tests

{e2e_block}

## Browser validation (manual)

{browser_block}

## Documentation updates

{checklist(doc_updates)}

{WORKFLOW_BLOCK}

## Definition of done

- [ ] All acceptance criteria met and manually verified
- [ ] All functional requirements implemented without scope creep
- [ ] Unit and integration tests passing
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` all pass
- [ ] Browser validation complete (if UI/API)
- [ ] Security checklist satisfied
- [ ] Documentation updates committed
- [ ] PR opened with Research Summary, reviewed, squash-merged to `main`
- [ ] progress-tracker.md updated — only then start next feature

## Out of scope

{oos_block}
"""


# Feature definitions loaded from companion module
from feature_prompt_data import FEATURES  # noqa: E402

README_ORDER = [
    ("MVP V1.0 — Phase 0 Foundation", range(1, 9)),
    ("MVP V1.0 — Phase 1 AI Chains", range(9, 15)),
    ("MVP V1.0 — Phase 2 Student Core", range(15, 24)),
    ("MVP V1.0 — Phase 3 Assessment", range(24, 27)),
    ("MVP V1.0 — Phase 4 Resilience", range(27, 32)),
    ("Post-MVP V1.1", range(32, 41)),
    ("Post-MVP V2.0", range(41, 52)),
    ("Post-MVP V3.0+", range(52, 56)),
]


def write_readme(files: list[str]) -> None:
    lines = [
        "# Feature Implementation Prompts — ExamEdge",
        "",
        "Copy-paste-ready prompts for every MVP unit and post-MVP feature.",
        "Each file is self-contained — paste the entire file into chat before implementing.",
        "",
        "**Gate:** Post Context and Research Summary before writing code.",
        "",
        "## Build order",
        "",
    ]
    by_slug = {Path(p).stem: p for p in files}
    for section, ids in README_ORDER:
        lines.append(f"### {section}")
        lines.append("")
        for i in ids:
            matches = [s for s in by_slug if s.startswith(f"unit-{i:02d}-") or s.startswith(f"f-{i}-")]
            for slug in sorted(matches):
                fname = by_slug[slug]
                title = slug.replace("-", " ").title()
                lines.append(f"- [{title}](./{Path(fname).name})")
        lines.append("")
    lines.append("## Usage")
    lines.append("")
    lines.append("1. Confirm prerequisites in progress-tracker.md.")
    lines.append("2. Open the prompt file for the next unit.")
    lines.append("3. Paste entire file into chat.")
    lines.append("4. Complete Context and Research Summary before any code.")
    lines.append("5. Follow the 12-step mandatory workflow in each prompt.")
    lines.append("")
    (OUTPUT_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    written: list[str] = []
    for feat in FEATURES:
        slug = feat["slug"]
        path = OUTPUT_DIR / f"{slug}.md"
        path.write_text(render(feat), encoding="utf-8")
        written.append(str(path.relative_to(ROOT)))
        print(f"Wrote {path.relative_to(ROOT)}")
    write_readme(written)
    print(f"Wrote {OUTPUT_DIR.relative_to(ROOT)}/README.md")
    print(f"Generated {len(written)} feature prompt files.")


if __name__ == "__main__":
    main()
