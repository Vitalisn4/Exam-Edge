# UI Tokens — ExamEdge

Design tokens for ExamEdge (**Teal Forest** brand). All colors, typography, spacing, and component values. Use these exact values throughout — never hardcode hex or use raw Tailwind color classes in components.

**Brand SSOT:** `design-brand-identity.md` · **Full mockup spec:** `examedge-ui-mockup-prompt.md`

---

## How to Use

Tailwind CSS **v4** with CSS variables and `@theme` in `apps/web/app/globals.css`.

```tsx
// Correct — semantic tokens (mapped in @theme)
className="bg-surface text-text-primary border-border"

// Correct — CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex
className="bg-[#1DA08C] text-[#111827]"

// Never — raw Tailwind palette
className="bg-teal-500 text-gray-900"
```

**Tailwind v4 setup:** `@import "tailwindcss"` in `globals.css`; `@tailwindcss/postcss` in `postcss.config.mjs`. See `tech-stack-versions.md`.

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Semantic aliases — map to :root variables below */
}

:root {
  /* Fonts */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: "Clash Display", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;
  --font-math: "KaTeX_Main", "Times New Roman", serif;

  /* Primary — Teal Forest */
  --color-primary-50: #e6f4f1;
  --color-primary-100: #c0e4dc;
  --color-primary-200: #97d2c6;
  --color-primary-300: #6bbfaf;
  --color-primary-400: #46b09e;
  --color-primary-500: #1da08c;
  --color-primary-600: #0e8a78;
  --color-primary-700: #0e5c4a;
  --color-primary-800: #0a3d31;
  --color-primary-900: #051f19;

  /* Semantic primary shortcuts */
  --color-primary: var(--color-primary-500);
  --color-primary-light: var(--color-primary-400);
  --color-primary-dark: var(--color-primary-700);
  --color-primary-foreground: #ffffff;
  --color-primary-muted: var(--color-primary-50);

  /* Secondary — Ivory Parchment / achievement gold */
  --color-secondary-50: #fefdf9;
  --color-secondary-100: #fdf8ed;
  --color-secondary-200: #faf0d4;
  --color-secondary-300: #f5e5b0;
  --color-secondary-400: #edd57f;
  --color-secondary-500: #e2c04a;
  --color-secondary-600: #c4a13a;
  --color-secondary-700: #9e7e28;
  --color-secondary-800: #735a19;
  --color-secondary-900: #3d2f09;
  --color-secondary: var(--color-secondary-500);

  /* Accent — Electric Cyan (AI highlights) */
  --color-accent-400: #22d3ee;
  --color-accent-500: #06b6d4;
  --color-accent-600: #0891b2;

  /* Neutrals — Slate */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;
  --color-neutral-950: #080e1a;

  /* Page and surface (light mode) */
  --color-background: var(--color-neutral-50);
  --color-surface: var(--color-neutral-0);
  --color-surface-secondary: var(--color-neutral-100);
  --color-surface-tertiary: var(--color-neutral-200);

  /* Exam simulation — paper aesthetic */
  --color-exam-paper: #fffef7;
  --color-exam-ink: #1a1a1a;

  /* Borders */
  --color-border: var(--color-neutral-200);
  --color-border-light: var(--color-neutral-100);
  --color-border-focus: var(--color-primary-500);

  /* Text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted: var(--color-neutral-400);
  --color-text-inverse: #ffffff;

  /* Mastery heatmap states (signature element) */
  --mastery-not-started: #e2e8f0;
  --mastery-introduced: #97d2c6;
  --mastery-developing: #46b09e;
  --mastery-proficient: #1da08c;
  --mastery-mastered: #0e5c4a;
  --mastery-at-risk: #f59e0b;

  /* Legacy mastery labels (progress copy — optional alongside heatmap) */
  --color-mastery-red: #dc2626;
  --color-mastery-amber: #d97706;
  --color-mastery-green: #16a34a;
  --color-mastery-red-bg: #fef2f2;
  --color-mastery-amber-bg: #fffbeb;
  --color-mastery-green-bg: #f0fdf4;

  /* Mark types (GCE M1/A1/B1 — unchanged pedagogically) */
  --color-mark-m1: #1d4ed8;
  --color-mark-m1-bg: #dbeafe;
  --color-mark-a1: #15803d;
  --color-mark-a1-bg: #dcfce7;
  --color-mark-b1: #7e22ce;
  --color-mark-b1-bg: #f3e8ff;
  --color-mark-denied: #dc2626;
  --color-mark-denied-bg: #fee2e2;
  --color-mark-ft: #b45309;
  --color-mark-ft-bg: #fef3c7;

  /* Semantic */
  --color-success: #22c55e;
  --color-success-light: #f0fdf4;
  --color-warning: #f59e0b;
  --color-warning-light: #fffbeb;
  --color-error: #ef4444;
  --color-error-light: #fef2f2;
  --color-info: #3b82f6;
  --color-info-light: #eff6ff;

  /* Confidence / review */
  --color-review: var(--color-warning);
  --color-review-bg: var(--color-warning-light);

  /* Offline indicator */
  --color-offline: var(--color-neutral-500);
  --color-offline-bg: var(--color-neutral-100);

  /* Subject accent colours */
  --subject-mathematics: #6366f1;
  --subject-physics: #0ea5e9;
  --subject-chemistry: #10b981;
  --subject-biology: #84cc16;
  --subject-english: #ec4899;
  --subject-economics: #f59e0b;
  --subject-geography: #14b8a6;
  --subject-history: #a78bfa;
  --subject-literature: #fb7185;
  --subject-french: #38bdf8;
  --subject-computer: #6ee7b7;
  --subject-further-math: #818cf8;

  /* Spacing base */
  --space-unit: 4px;

  /* Border radius */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 6px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.05);
  --shadow-primary-glow: 0 0 0 3px rgba(29, 160, 140, 0.25);

  /* Animation */
  --duration-normal: 200ms;
  --duration-moderate: 300ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --transition-color: color 200ms ease-out, background-color 200ms ease-out;

  /* Z-index */
  --z-sticky: 200;
  --z-modal: 400;
  --z-toast: 600;
  --z-exam: 700;
}

/* Dark mode — implement V1.1; tokens defined for mockups and future CSS */
.dark,
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-secondary: #263448;
  --color-surface-tertiary: #080e1a;
  --color-border: #1e293b;
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  --color-primary: #1da08c;
  --color-primary-light: #46b09e;
}
```

---

## Color Usage Guide

### Page Layout

| Element              | Token                          |
| -------------------- | ------------------------------ |
| Page background      | `bg-background`                |
| Card / surface       | `bg-surface`                   |
| Secondary surface    | `bg-surface-secondary`         |
| Default border       | `border-border`                |
| Exam mode background | `bg-exam-paper`                |
| Exam mode text       | `text-[var(--color-exam-ink)]` |

### Mastery Heatmap Cells (signature)

| State       | CSS variable            | When                                          |
| ----------- | ----------------------- | --------------------------------------------- |
| Not started | `--mastery-not-started` | theta = 0 or never attempted                  |
| Introduced  | `--mastery-introduced`  | 0 < theta < 0.25                              |
| Developing  | `--mastery-developing`  | 0.25 ≤ theta < 0.50                           |
| Proficient  | `--mastery-proficient`  | 0.50 ≤ theta < 0.75                           |
| Mastered    | `--mastery-mastered`    | theta ≥ 0.75                                  |
| At risk     | `--mastery-at-risk`     | declining mastery / spaced repetition overdue |

**Cell spec:** 32×32px (28px on compact mobile), `border-radius: var(--radius-xs)`, gap 3px, hover scale 1.15 with tooltip, fill transition 400ms ease-out.

### Mark Type Badges

| Mark                | Background                         | Text                                           |
| ------------------- | ---------------------------------- | ---------------------------------------------- |
| M1 (Method)         | `bg-[var(--color-mark-m1-bg)]`     | `text-[var(--color-mark-m1)]`                  |
| A1 (Accuracy)       | `bg-[var(--color-mark-a1-bg)]`     | `text-[var(--color-mark-a1)]`                  |
| B1 (Independent)    | `bg-[var(--color-mark-b1-bg)]`     | `text-[var(--color-mark-b1)]`                  |
| ft (Follow-through) | `bg-[var(--color-mark-ft-bg)]`     | `text-[var(--color-mark-ft)]`                  |
| Denied              | `bg-[var(--color-mark-denied-bg)]` | `text-[var(--color-mark-denied)] line-through` |

### AI-Generated Content

| Element                       | Style                                                       |
| ----------------------------- | ----------------------------------------------------------- |
| Tutor / hint / feedback panel | `border-l-[3px] border-primary-500` or `border-primary-600` |
| AI loading indicator          | Teal pulsing dots — "ExamEdge AI is thinking..."            |
| AI accent highlight           | `text-accent-500` sparingly                                 |

---

## Typography

| Element                | Size    | Weight  | Line height | Token class          |
| ---------------------- | ------- | ------- | ----------- | -------------------- |
| Display hero (desktop) | 48–64px | 700–800 | 1.1–1.15    | `font-display`       |
| Page title             | 24–30px | 700     | 1.25        | `text-heading-lg`    |
| Section heading        | 20px    | 600     | 1.35        | `text-heading-md`    |
| Body (primary)         | 16px    | 400     | 1.7         | `text-body-lg`       |
| Body (secondary)       | 15px    | 400     | 1.65        | `text-body-md`       |
| Exam question          | 18px    | 400     | 1.8         | `text-exam-question` |
| UI button / label      | 14–16px | 500     | 1.25        | `text-ui-md`         |
| Badge / caption        | 12px    | 500     | 1.2         | `text-ui-sm`         |
| Exam timer             | 20px+   | 600     | 1.25        | monospace feel       |

**Minimum body text: 15px** (16px preferred) on mobile. **Never below 400 font weight** on low-end Android screens.

---

## Spacing (4px base unit)

| Token        | Value | Usage                                    |
| ------------ | ----- | ---------------------------------------- |
| `--space-1`  | 4px   | Tight inline gaps                        |
| `--space-2`  | 8px   | Badge padding, chip inner                |
| `--space-3`  | 12px  | Small button padding                     |
| `--space-4`  | 16px  | Card padding mobile, page padding mobile |
| `--space-6`  | 24px  | Card padding desktop, section gaps       |
| `--space-8`  | 32px  | Large card padding                       |
| `--space-12` | 48px  | Section gap mobile                       |
| `--space-24` | 96px  | Section gap desktop                      |

Page padding: `px-4` mobile · `px-8` tablet · `px-12` desktop.

---

## Component Tokens

### Primary Button

```
background: var(--color-primary-600)
hover: var(--color-primary-700)
active: var(--color-primary-800) scale(0.98)
focus: var(--shadow-primary-glow)
color: white
border-radius: var(--radius-sm)
padding: 12px 24px (md)
min-height: 44px
font: text-ui-lg, weight 500
```

### Cards

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: var(--radius-md)
padding: 16px mobile / 24px desktop
shadow: var(--shadow-sm)
```

**Subject card:** left border 4px solid subject colour; hover `shadow-lg` + translateY(-2px).

### Mastery Heatmap Grid

```
grid: 4–6 cols mobile (horizontal scroll if >8), 8–10 cols desktop
cell: 32×32px, gap 3px, radius-xs
legend: 5–6 colour stops at bottom
```

### Readiness Score Ring

```
size: 80–120px diameter
stroke: var(--color-primary-600) proportional to score
track: var(--color-neutral-200)
centre: large bold percentage
```

### Offline Banner

```
background: var(--color-offline-bg)
border-bottom: 1px solid var(--color-border)
icon: WifiOff (lucide)
sticky below nav, z-index below exam overlay
```

---

## Logo / Brand

```
App name: ExamEdge
Primary colour: #1DA08C (Teal Forest)
Secondary accent: #E2C04A (achievement gold)
Logo mark: BookOpen + graduation cap concept
Navbar logo height: 32px
```

---

## Tailwind Config Extension

```javascript
// tailwind.config.ts — extend theme
colors: {
  primary: {
    50: '#E6F4F1', 100: '#C0E4DC', 200: '#97D2C6',
    300: '#6BBFAF', 400: '#46B09E', 500: '#1DA08C',
    600: '#0E8A78', 700: '#0E5C4A', 800: '#0A3D31', 900: '#051F19',
    DEFAULT: '#1DA08C', foreground: '#FFFFFF',
  },
  secondary: { 500: '#E2C04A', 600: '#C4A13A', 700: '#9E7E28' },
  navy: { 900: '#0F172A', 800: '#1E293B', 700: '#334155' },
},
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Clash Display', 'Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
boxShadow: {
  'primary-glow': '0 0 0 3px rgba(29, 160, 140, 0.25)',
},
```

---

## Invariants

- Never use hex directly in components — always CSS variables / Tailwind token classes
- Primary UI font is **Inter**; display font **Clash Display** for marketing hero only
- Never use Tailwind built-in colour scales (`bg-teal-500`, `text-gray-600`)
- Mastery heatmap uses `--mastery-*` tokens — never generic red/green for heatmap cells
- Mark type badges always use mark-m1/a1/b1 tokens
- Exam mode always uses exam-paper background
- Min touch target **44×44px**
- Min body text **15px**
- AI content panels always have teal left border

---

## Migration from Exam Blue (legacy Unit 02)

If `globals.css` still uses `#1E40AF`, treat as legacy. Update to this document during Unit 31 polish or a dedicated design-system refresh PR before pilot demo.
