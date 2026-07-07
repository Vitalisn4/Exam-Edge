# Unit 02: Design System + UI Tokens

---

## Goal

Implement ExamEdge design tokens in `globals.css`, theme shadcn/ui primitives, and ship `/dev/ui` — a static showcase of all token swatches and UI components. No student-facing pages or API logic.

**Brand target:** Teal Forest per `ui-tokens.md` and `design-brand-identity.md`.

**Implementation note (June 2026):** Unit 02 merged with **Exam Blue** (`#1E40AF`) in code. Teal Forest (`#1DA08C`) is documented as authoritative; full code rebrand is **Unit 31** (or a dedicated design-system refresh PR). Do not block Units 03+ on rebrand.

---

## Design

Reference: `design-brand-identity.md`, `ui-tokens.md`, `ui-rules.md`, `examedge-ui-mockup-prompt.md` (component tokens section).

### Token groups in `globals.css`

| Group                     | Variables / classes                                          | Purpose                         |
| ------------------------- | ------------------------------------------------------------ | ------------------------------- |
| Brand                     | `--color-primary*`, `bg-primary`, `primary-light/dark/muted` | CTAs, links, active nav         |
| Surfaces                  | `--color-background`, `--color-surface*`, `bg-exam-paper`    | Page + card backgrounds         |
| Borders                   | `--color-border*`, `border-border-focus`                     | Inputs, cards, dividers         |
| Text                      | `--color-text-primary/secondary/muted/inverse`               | Typography hierarchy            |
| Mark types                | `--color-mark-m1/a1/b1/denied/ft` + `-bg`                    | M1/A1/B1 marking display        |
| Mastery (legacy swatches) | `--color-mastery-red/amber/green` + `-bg`                    | Progress copy, badges           |
| Mastery heatmap           | `--mastery-not-started` … `--mastery-at-risk`                | Signature heatmap (Unit 15+)    |
| Semantic                  | success, warning, error, info, review, offline               | Status, banners, toasts         |
| Radius                    | `--radius-sm` … `--radius-full`                              | 8px default buttons (Teal spec) |
| shadcn aliases            | `--primary`, `--card`, `--ring`, etc.                        | shadcn component theming        |

### Tailwind v4 setup

- `@import "tailwindcss"` in `globals.css`
- `@theme inline { … }` maps semantic tokens to Tailwind utilities
- `postcss.config.mjs` uses `@tailwindcss/postcss`
- Optional `tailwind.config.ts` only if extra extensions needed — **CSS-first is canonical**

### Typography

- **Inter** via `next/font/google` on root layout (`--font-sans`)
- Body minimum **15–16px** on mobile
- Display font (Clash Display) — **out of scope Unit 02**; landing hero polish Unit 31 / V1.1

### `/dev/ui` showcase sections

1. Swatch grids: Brand, Surfaces, Borders, Text, Mark types, Mastery, Semantic
2. Typography scale sample
3. Buttons: primary, secondary, **hint** (lightbulb icon)
4. Input (44px min height)
5. Badges: M1, A1, B1, mastery, review
6. Dialog (focus preparation copy sample)
7. Skeleton loaders
8. Toast trigger (Sonner)

Layout: `max-w-lg mx-auto`, `px-4 py-6`, 360px verified.

---

## Implementation

### `apps/web/app/globals.css`

All CSS variables from `ui-tokens.md`. No raw hex in component files — variables only in `:root` / `@theme`.

### `apps/web/app/layout.tsx`

Inter font, Sonner `<Toaster />`, base body classes (`bg-background text-text-primary`).

### `apps/web/components/ui/*`

shadcn-style primitives themed to tokens:

- `button.tsx` — variants: `default`, `secondary`, `hint`, `destructive`, `ghost`, `link`; `min-h-11` (44px)
- `input.tsx`, `card.tsx`, `badge.tsx`, `dialog.tsx`, `skeleton.tsx`, `toast.tsx`

### `apps/web/lib/utils.ts`

`cn()` helper (clsx + tailwind-merge).

### `apps/web/app/dev/ui/page.tsx`

Renders `components/dev/ui-showcase.tsx` — static, no API.

### `apps/web/components/dev/ui-showcase.tsx`

All swatch grids and primitive demos listed above.

---

## Dependencies

Prior units:

- Unit 01 — Monorepo scaffold

Packages (if not present):

- `tailwindcss`, `@tailwindcss/postcss`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- `@radix-ui/react-dialog` (Dialog)
- `sonner` (Toast)
- `lucide-react` (hint button icon)

No new environment variables.

---

## Verify when done

- [ ] `/dev/ui` renders all token swatch groups without error
- [ ] Primary, secondary, hint buttons visible — 44px min height
- [ ] Input, Card, Badge, Dialog, Skeleton, Toast work
- [ ] No raw hex in `components/` (grep check)
- [ ] Renders on 360px — no horizontal scroll
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `ui-registry.md` updated — UI Primitives table + dev preview path

---

## Out of scope (this unit)

- Student pages (landing, dashboard) — Units 03, 15
- Clash Display / JetBrains Mono font loading — later units
- Dark mode CSS — tokens defined in docs; implementation V1.1
- MasteryHeatmap component — Unit 15
- Teal Forest code migration — **Unit 31** (if still on Exam Blue after merge)
