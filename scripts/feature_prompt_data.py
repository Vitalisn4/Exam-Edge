"""Feature metadata for generate-feature-prompts.py."""

from __future__ import annotations

from typing import Any


def _u(
    num: int,
    slug: str,
    name: str,
    *,
    prereq: str,
    purpose: str,
    problem: str,
    value: str,
    stories: list[str],
    acceptance: list[str],
    tech: list[str],
    functional: list[str],
    external: dict[str, str] | None = None,
    internal: list[str] | None = None,
    nfr: list[tuple[str, str]] | None = None,
    database: str | None = None,
    api: str | None = None,
    frontend: str | None = None,
    ai: str | None = None,
    auth: str | None = None,
    security: list[str] | None = None,
    performance: list[tuple[str, str]] | None = None,
    logging: list[str] | None = None,
    edge_cases: list[str] | None = None,
    unit_tests: list[str] | None = None,
    integration: list[str] | None = None,
    e2e: list[str] | None = None,
    browser: list[str] | None = None,
    doc_updates: list[str] | None = None,
    out_of_scope: list[str] | None = None,
) -> dict[str, Any]:
    short = slug.split("-", 2)[-1] if slug.count("-") >= 2 else slug
    return {
        "id": f"Unit {num:02d}",
        "slug": f"unit-{num:02d}-{slug}",
        "name": name,
        "release": "V1.0 MVP",
        "branch": f"feature/unit-{num:02d}-{short}",
        "prereq": prereq,
        "purpose": purpose,
        "problem": problem,
        "value": value,
        "stories": stories,
        "acceptance": acceptance,
        "tech": tech,
        "functional": functional,
        "external": external or {},
        "internal": internal or ["docs/context/build-plan.md"],
        "nfr": nfr,
        "database": database,
        "api": api,
        "frontend": frontend,
        "ai": ai,
        "auth": auth,
        "security": security,
        "performance": performance,
        "logging": logging,
        "edge_cases": edge_cases,
        "unit_tests": unit_tests,
        "integration": integration,
        "e2e": e2e,
        "browser": browser,
        "doc_updates": doc_updates or ["docs/context/progress-tracker.md"],
        "out_of_scope": out_of_scope,
    }


def _f(
    num: int,
    slug: str,
    name: str,
    release: str,
    *,
    prereq: str,
    purpose: str,
    problem: str,
    value: str,
    stories: list[str],
    acceptance: list[str],
    tech: list[str],
    functional: list[str],
    **kwargs: Any,
) -> dict[str, Any]:
    short = slug.split("-", 2)[-1] if slug.count("-") >= 2 else slug
    base = _u(
        num,
        slug,
        name,
        prereq=prereq,
        purpose=purpose,
        problem=problem,
        value=value,
        stories=stories,
        acceptance=acceptance,
        tech=tech,
        functional=functional,
        internal=["docs/context/roadmap.md"] + kwargs.pop("internal", []),
        **kwargs,
    )
    base["id"] = f"F-{num}"
    base["slug"] = f"f-{num}-{slug}"
    base["release"] = release
    base["branch"] = f"feature/f-{num}-{short}"
    return base


MVP: list[dict[str, Any]] = [
    _u(
        1,
        "monorepo-scaffold",
        "Monorepo Scaffold",
        prereq="None — first unit.",
        purpose="Establish the ExamEdge monorepo with npm workspaces, TypeScript strict mode, linting, testing, and a health-check API so all subsequent units share a consistent foundation.",
        problem="Without a unified monorepo structure, packages drift apart, type sharing breaks, and CI cannot enforce quality gates across web, database, AI, and shared code.",
        value="Developers can run one command to typecheck, lint, test, and dev the entire platform; every future unit builds on predictable package boundaries.",
        stories=[
            "As a developer, I run `npm run dev` and the web app starts so that I can iterate on features immediately.",
            "As a DevOps engineer, I hit GET /api/health and receive status ok so that uptime monitors can verify deployment.",
            "As a contributor, pre-commit hooks run ESLint and Prettier so that code style stays consistent.",
        ],
        acceptance=[
            "`npm run dev` starts apps/web on localhost",
            "`npm run typecheck` passes across all packages with strict TypeScript",
            "`npm run lint` and `npm run test` pass with zero errors",
            "GET /api/health returns 200 with `{ status: \"ok\", version: \"0.1.0\" }`",
            ".env.example documents all keys from architecture.md with placeholder values",
            "Turborepo pipeline runs parallel builds for apps/web and packages/*",
        ],
        tech=["Next.js 16 App Router", "Node.js 22 LTS", "Turborepo", "TypeScript 5.x strict", "ESLint", "Prettier", "Husky", "Vitest"],
        functional=[
            "Root package.json defines npm workspaces: apps/web, packages/db, packages/ai, packages/shared",
            "Each package has its own tsconfig.json extending root strict config",
            "Root scripts: typecheck, lint, test, dev wired through Turborepo",
            "apps/web exposes GET /api/health route handler returning JSON status",
            "Husky pre-commit runs lint-staged for ESLint + Prettier",
            "No database connection required in this unit",
        ],
        external={
            "Next.js 16": "https://nextjs.org/docs",
            "Node.js 22 LTS": "https://nodejs.org/docs/latest-v22.x/api/",
            "Vitest": "https://vitest.dev/guide/",
        },
        internal=["docs/context/build-plan.md", "docs/context/architecture.md", "docs/context/zero-budget-stack.md"],
        nfr=[
            ("Build time", "Cold `npm run typecheck` completes under 60s on dev machine"),
            ("Strictness", "noImplicitAny, strictNullChecks enabled everywhere"),
            ("DX", "Single `npm install` at root installs all workspaces"),
        ],
        api="| Method | Route | Auth | Response |\n|--------|-------|------|----------|\n| GET | /api/health | None | `{ status: \"ok\", version: \"0.1.0\" }` |",
        frontend="N/A — no student UI. Health route only.",
        ai="N/A — no LLM calls in this feature.",
        auth="N/A — authentication added in Unit 06.",
        security=[
            "No secrets committed; .env.example only placeholder values",
            ".gitignore excludes .env.local and node_modules",
            "Health endpoint exposes no internal system details beyond version string",
        ],
        unit_tests=[
            "Health route returns 200 and correct JSON shape",
            "Shared package exports resolve from web app imports",
        ],
        integration=["GET /api/health integration test with Vitest + Next.js test utils"],
        browser=["N/A — API-only unit"],
        doc_updates=["progress-tracker.md", "README.md setup steps if changed"],
        out_of_scope=[
            "Database schema, Auth.js, AI chains, student UI",
            "React Native mobile app (F-32)",
            "Production deployment configuration beyond .env.example",
        ],
    ),
    _u(
        2,
        "design-system",
        "Design System + UI Tokens",
        prereq="Unit 01 complete.",
        purpose="Implement ExamEdge design tokens, Tailwind configuration, Inter typography, and shadcn/ui primitives so every student-facing screen shares consistent, accessible styling.",
        problem="Without a token-based design system, components use ad-hoc colors and sizes, breaking mobile accessibility and making exam-mode theming impossible.",
        value="All UI built after this unit uses semantic tokens, 44px touch targets, and reusable primitives — reducing design debt and ensuring 360px readability.",
        stories=[
            "As a student on a low-end Android phone, I see buttons tall enough to tap easily so that I never mis-tap during study.",
            "As a developer, I open /dev/ui and preview all primitives so that I know which components exist before building pages.",
            "As a designer, all colors come from ui-tokens.md CSS variables so that brand consistency is enforced in code.",
        ],
        acceptance=[
            "globals.css defines all tokens from ui-tokens.md as CSS variables via @theme",
            "globals.css uses @import \"tailwindcss\" (Tailwind v4 — not @tailwind directives)",
            "Inter font loaded via next/font/google in root layout",
            "shadcn Button, Input, Card, Badge, Dialog, Skeleton, Toast installed and working",
            "/dev/ui renders all primitives with primary, secondary, and hint button variants",
            "Primary buttons meet 44px minimum height on mobile viewport",
            "No raw hex color values in component source files",
        ],
        tech=["Tailwind CSS v4", "shadcn/ui", "next/font/google (Inter)", "CSS custom properties (@theme)"],
        functional=[
            "apps/web/app/globals.css — full token set from ui-tokens.md",
            "tailwind.config.ts — semantic color, spacing, radius mappings",
            "Install shadcn/ui components: Button, Input, Card, Badge, Dialog, Skeleton, Toast",
            "apps/web/app/dev/ui/page.tsx — static showcase of all primitives",
            "Button variants: primary (brand), secondary (outline), hint (amber accent)",
            "Toast provider wired in root layout for downstream units",
        ],
        external={
            "Tailwind CSS v4": "https://tailwindcss.com/docs/upgrade-guide",
            "Tailwind + Next.js": "https://tailwindcss.com/docs/guides/nextjs",
            "shadcn/ui": "https://ui.shadcn.com/docs",
        },
        internal=[
            "docs/context/ui-tokens.md",
            "docs/context/ui-rules.md",
            "docs/context/ui-registry.md",
        ],
        nfr=[
            ("Accessibility", "44px min touch targets; 16px min body text"),
            ("Mobile", "360px viewport with no horizontal scroll on /dev/ui"),
            ("Consistency", "Semantic tokens only — zero raw hex in components"),
        ],
        frontend="Route: /dev/ui — static component gallery. Root layout: Inter font, Toast provider.",
        ai="N/A — no LLM calls in this feature.",
        browser=[
            "Open /dev/ui at 360px — all buttons, inputs, cards visible",
            "Verify primary button height ≥ 44px in DevTools",
            "Check no console errors; tokens render correct brand colors",
            "Test Dialog open/close and Toast trigger",
        ],
        doc_updates=["progress-tracker.md", "docs/context/ui-registry.md"],
        out_of_scope=["Landing page (Unit 03)", "KaTeX/MathQuill (Unit 04)", "Authenticated student pages"],
    ),
]

from feature_prompt_specs_rest import MVP_REST, POST  # noqa: E402

FEATURES: list[dict[str, Any]] = MVP + MVP_REST + POST
