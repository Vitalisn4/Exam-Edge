# Unit 02: Design System + UI Tokens

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Implementation status

| Field                    | Value                                                    |
| ------------------------ | -------------------------------------------------------- |
| **Status**               | **COMPLETE** — merged to `main` (PR #1)                  |
| **Code primary colour**  | Exam Blue `#1E40AF` (legacy at merge time)               |
| **Docs primary colour**  | Teal Forest `#1DA08C` (`ui-tokens.md`)                   |
| **Teal rebrand in code** | Unit 31 — do not re-open Unit 02 unless doing refresh PR |

---

## Feature overview

| Field             | Value                                    |
| ----------------- | ---------------------------------------- |
| **Feature ID**    | Unit 02                                  |
| **Feature name**  | Design System + UI Tokens                |
| **Release**       | V1.0 MVP                                 |
| **Branch**        | `feature/unit-02-design-system` (merged) |
| **Prerequisites** | Unit 01 merged to `main`                 |
| **Blocks**        | Units 03, 04, 06, 15, 16 (all UI)        |

## Objective

Design tokens live in `globals.css`, shadcn/ui primitives are themed, and `/dev/ui` showcases every token group and component — so all later units use semantic classes only.

## Purpose and business objectives

Implement the visual foundation for a mobile-first African student audience. Ensures brand consistency, 44px touch targets, and M1/A1/B1 mark colours before any student-facing pages.

## Problem statement

Required by `build-plan.md` Unit 02. Without tokens and primitives, every later screen invents one-off styles and breaks accessibility on low-end Android devices.

## User stories

- As a developer, I preview all design tokens and primitives on `/dev/ui`.
- As a developer, I import `Button`, `Card`, `Input`, etc. from `components/ui/` with ExamEdge theming.
- As a student (future), I see consistent, accessible UI across all pages.

## Acceptance criteria

- [ ] All token groups from `ui-tokens.md` render on `/dev/ui` (brand, surfaces, borders, text, mark types, mastery, semantic)
- [ ] Buttons: primary, secondary, **hint** — min 44px height on mobile
- [ ] shadcn/ui installed: Button, Input, Card, Badge, Dialog, Skeleton, Toast (Sonner)
- [ ] No raw hex in `components/` — CSS variables in `globals.css` only
- [ ] Inter via `next/font/google` on root layout
- [ ] `ui-registry.md` UI Primitives table complete
- [ ] **At merge (done):** Exam Blue acceptable; **Unit 31:** migrate to Teal Forest `#1DA08C` per updated `ui-tokens.md`

## Prerequisites and dependencies

- **Prior units:** Unit 01
- **Spec:** `specs/02-design-system.md`
- **Read:** `design-brand-identity.md`, `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`, `examedge-ui-mockup-prompt.md` (component specs)

## Internal documentation (read before coding)

- [ ] docs/context/design-brand-identity.md
- [ ] docs/context/ui-tokens.md
- [ ] docs/context/ui-rules.md
- [ ] docs/context/examedge-ui-mockup-prompt.md
- [ ] docs/context/specs/02-design-system.md
- [ ] docs/context/ui-registry.md
- [ ] docs/context/tech-stack-versions.md
- [ ] docs/context/build-plan.md — Unit 02
- [ ] docs/context/progress-tracker.md
- [ ] docs/context/code-standards.md
- [ ] docs/context/library-docs.md
- [ ] AGENTS.md (invariants only — no AI in this unit)
- [ ] .cursorrules

## External documentation (official URLs — study before coding)

- **Tailwind CSS v4:** https://tailwindcss.com/docs/upgrade-guide
- **Tailwind + Next.js:** https://tailwindcss.com/docs/guides/nextjs
- **Next.js 16 (App Router):** https://nextjs.org/docs
- **React 19:** https://react.dev
- **TypeScript 5.x:** https://www.typescriptlang.org/docs/
- **Radix Dialog:** https://www.radix-ui.com/primitives/docs/components/dialog
- **Sonner:** https://sonner.emilkowal.ski/

Also consult `library-docs.md` § Official External Documentation. **Version authority:** `tech-stack-versions.md`.

## Functional requirements

See `build-plan.md` Unit 02 and `specs/02-design-system.md` for full detail.

### Tokens — `apps/web/app/globals.css`

- All CSS variables from `ui-tokens.md` in `:root`
- Tailwind v4 `@theme inline { … }` mapping semantic tokens to utilities
- shadcn compatibility aliases (`--primary`, `--card`, `--ring`, etc.)
- Include: brand, surfaces, exam-paper, borders, text, mark types (M1/A1/B1/ft/denied), mastery legacy swatches, **mastery heatmap** `--mastery-*` (for Unit 15+), semantic colours, radius tokens

### Primitives — `apps/web/components/ui/`

| Component | Variants / notes                                                            |
| --------- | --------------------------------------------------------------------------- |
| Button    | `default`, `secondary`, `hint`, `destructive`, `ghost`, `link` — `min-h-11` |
| Input     | 44px min height, focus ring via `--color-border-focus`                      |
| Card      | Header, Title, Description, Content, Footer                                 |
| Badge     | Mark types (M1/A1/B1), mastery, review                                      |
| Dialog    | Mobile-friendly width                                                       |
| Skeleton  | Pulse loader                                                                |
| Toast     | Sonner + `toast()` helper                                                   |

### Dev showcase — `apps/web/app/dev/ui/page.tsx`

- `components/dev/ui-showcase.tsx` — swatch grids + typography + all primitives
- Sections: Brand, Surfaces, Borders, Text, Mark types, Mastery, Semantic, Typography, Buttons, Input, Badges, Dialog, Skeleton, Toast

### Utilities

- `apps/web/lib/utils.ts` — `cn()` (clsx + tailwind-merge)

### Fonts

- Inter only in Unit 02 (Clash Display / JetBrains Mono — later units)

## Non-functional requirements

| Category    | Requirement                                                     |
| ----------- | --------------------------------------------------------------- |
| Viewport    | Mobile-first 360px; `/dev/ui` uses `max-w-lg mx-auto px-4 py-6` |
| Typography  | Min 15–16px body text                                           |
| Touch       | 44×44px minimum interactive targets                             |
| Performance | Static page — no API, no LLM                                    |
| Quality     | TypeScript strict; `npm run typecheck` + `lint` + `test` pass   |

## Database and schema changes

None.

## Backend requirements and API contracts

None.

## Frontend requirements and user experience

- Token-based styling only — semantic Tailwind classes (`bg-primary`, `text-text-muted`, etc.)
- Never `bg-blue-500`, never hardcoded hex in components
- Hint button uses lightbulb icon (lucide-react) — study session pattern preview

## AI and agent requirements

None — static UI only.

## Authentication and authorization

None — `/dev/ui` is public in development; hide from production nav in Unit 31.

## Security, privacy, and compliance

- `/dev/*` excluded from production navigation (Unit 31)
- No PII, no analytics required in this unit

## Performance and scalability

Static CSS + one client showcase page — no performance targets beyond clean build.

## Logging, analytics, and observability

N/A for Unit 02.

## Edge cases and failure scenarios

- Missing token mapping → visible unstyled element; catch on `/dev/ui` review
- Dialog/toast SSR — use client boundary where required (`"use client"` on showcase)

## Unit testing requirements

N/A — visual verification on `/dev/ui` is sufficient for Unit 02.

## Integration testing requirements

N/A.

## End-to-end testing requirements

- [ ] Visual verification on `/dev/ui` at 360px and 768px

## Browser validation requirements (manual)

- [ ] `/dev/ui` — all swatch grids render correct colours
- [ ] Tap all button variants — 44px touch targets
- [ ] Dialog opens and closes
- [ ] Toast fires on button click
- [ ] No horizontal scroll at 360px
- [ ] No console errors
- [ ] Grep: no `#` hex colours in `apps/web/components/` (except none expected)

## Documentation updates required after implementation

- [ ] `docs/context/ui-registry.md` — UI Primitives table + dev preview path
- [ ] `docs/context/progress-tracker.md` — after merge
- [ ] `docs/context/specs/02-design-system.md` — verify checklist marked complete

---

## Mandatory implementation process

**Do not write code until you post a Context and Research Summary.**

1. Review internal docs — **start with `tech-stack-versions.md`** and `specs/02-design-system.md`.
2. Study Tailwind v4 CSS-first theming and shadcn + Tailwind v4 compatibility.
3. Post **Context and Research Summary** before coding.
4. Branch: `feature/unit-02-design-system`.
5. Implement exactly this unit — no student pages, no API routes.
6. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
7. Manual browser validation at 360px on `/dev/ui`.
8. Update documentation listed above.
9. Conventional Commits → PR → §2c review → merge → update `progress-tracker.md`.

**Architecture invariants:** N/A for UI-only unit (no AI, no DB, no auth).

---

## Definition of Done and merge requirements

- [ ] `/dev/ui` renders all token swatches and primitives per `specs/02-design-system.md`
- [ ] `ui-registry.md` lists all `components/ui/*` with variants
- [ ] No raw hex in `components/`
- [ ] §2d Merge Gate in `feature-development-prompts.md` passed

## Out of scope

- Landing page, dashboard, auth screens (Units 03, 06, 15)
- Teal Forest code migration if already merged with Exam Blue (defer to Unit 31)
- Dark mode implementation (V1.1)
- MasteryHeatmap component (Unit 15)
- Clash Display / JetBrains Mono fonts
- Business logic and API routes
