# UI Tokens — ExamEdge

Design tokens for ExamEdge. All colors, typography, spacing, and component values. Use these exact values throughout — never hardcode hex or use raw Tailwind color classes in components.

---

## How to Use

Tailwind CSS **v4** with CSS variables and `@theme` in `apps/web/app/globals.css`.

```tsx
// Correct — semantic tokens (mapped in @theme)
className="bg-surface text-text-primary border-border"

// Correct — CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex
className="bg-[#1E40AF] text-[#111827]"

// Never — raw Tailwind palette
className="bg-blue-800 text-gray-900"
```

**Tailwind v4 setup:** `@import "tailwindcss"` in `globals.css`; `@tailwindcss/postcss` in `postcss.config.mjs`. See [Tailwind + Next.js guide](https://tailwindcss.com/docs/guides/nextjs) and `tech-stack-versions.md`.

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Map semantic tokens — see full variable list below */
  --color-primary: #1E40AF;
  /* ... remaining tokens defined in :root block or @theme */
}

:root {
  /* Font */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-math: "KaTeX_Main", "Times New Roman", serif;

  /* Brand — Exam Blue */
  --color-primary: #1E40AF;
  --color-primary-light: #3B82F6;
  --color-primary-dark: #1E3A8A;
  --color-primary-foreground: #FFFFFF;
  --color-primary-muted: #EFF6FF;

  /* Page and surface backgrounds */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F1F5F9;
  --color-surface-tertiary: #E2E8F0;

  /* Exam simulation — paper aesthetic */
  --color-exam-paper: #FFFEF7;
  --color-exam-ink: #1A1A1A;

  /* Borders */
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;
  --color-border-focus: #3B82F6;

  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-inverse: #FFFFFF;

  /* Mastery states */
  --color-mastery-red: #DC2626;
  --color-mastery-amber: #D97706;
  --color-mastery-green: #16A34A;
  --color-mastery-red-bg: #FEF2F2;
  --color-mastery-amber-bg: #FFFBEB;
  --color-mastery-green-bg: #F0FDF4;

  /* Mark types */
  --color-mark-m1: #1D4ED8;
  --color-mark-m1-bg: #DBEAFE;
  --color-mark-a1: #15803D;
  --color-mark-a1-bg: #DCFCE7;
  --color-mark-b1: #7E22CE;
  --color-mark-b1-bg: #F3E8FF;
  --color-mark-denied: #DC2626;
  --color-mark-denied-bg: #FEE2E2;
  --color-mark-ft: #B45309;
  --color-mark-ft-bg: #FEF3C7;

  /* Semantic */
  --color-success: #16A34A;
  --color-success-light: #DCFCE7;
  --color-warning: #D97706;
  --color-warning-light: #FFFBEB;
  --color-error: #DC2626;
  --color-error-light: #FEE2E2;
  --color-info: #0EA5E9;
  --color-info-light: #E0F2FE;

  /* Confidence / review */
  --color-review: #D97706;
  --color-review-bg: #FFFBEB;

  /* Offline indicator */
  --color-offline: #64748B;
  --color-offline-bg: #F1F5F9;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

Map in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: 'var(--color-primary)', foreground: 'var(--color-primary-foreground)' },
      surface: { DEFAULT: 'var(--color-surface)', secondary: 'var(--color-surface-secondary)' },
      'text-primary': 'var(--color-text-primary)',
      'exam-paper': 'var(--color-exam-paper)',
      // ... etc
    },
  },
},
```

---

## Color Usage Guide

### Page Layout

| Element | Token |
|---------|-------|
| Page background | `bg-background` |
| Card / surface | `bg-surface` |
| Secondary surface | `bg-surface-secondary` |
| Default border | `border-border` |
| Exam mode background | `bg-exam-paper` |
| Exam mode text | `text-[var(--color-exam-ink)]` |

### Mastery Map Topic Cells

| State | Background | Text/Border | Threshold |
|-------|------------|-------------|-----------|
| Not started / weak | `bg-mastery-red-bg` | `text-mastery-red border-mastery-red` | theta < 0.30 |
| Developing | `bg-mastery-amber-bg` | `text-mastery-amber border-mastery-amber` | 0.30 ≤ theta < 0.70 |
| Mastered | `bg-mastery-green-bg` | `text-mastery-green border-mastery-green` | theta ≥ 0.70 |

### Mark Type Badges

| Mark | Background | Text |
|------|------------|------|
| M1 (Method) | `bg-[var(--color-mark-m1-bg)]` | `text-[var(--color-mark-m1)]` |
| A1 (Accuracy) | `bg-[var(--color-mark-a1-bg)]` | `text-[var(--color-mark-a1)]` |
| B1 (Independent) | `bg-[var(--color-mark-b1-bg)]` | `text-[var(--color-mark-b1)]` |
| ft (Follow-through) | `bg-[var(--color-mark-ft-bg)]` | `text-[var(--color-mark-ft)]` |
| Denied | `bg-[var(--color-mark-denied-bg)]` | `text-[var(--color-mark-denied)] line-through` |

### Confidence Indicators

| State | Badge |
|-------|-------|
| confidence ≥ 0.70 | No badge — normal display |
| confidence < 0.70 | Amber badge: "Under review" on `bg-review-bg text-review` |

---

## Typography

| Element | Size | Weight | Line Height | Color |
|---------|------|--------|-------------|-------|
| Page title (mobile) | 24px | 700 | 32px | text-primary |
| Section heading | 20px | 600 | 28px | text-primary |
| Question text (KaTeX) | 18px | 400 | 28px | text-primary |
| Body text | 16px | 400 | 24px | text-primary |
| Nav item | 14px | 500 | 20px | text-secondary / primary when active |
| Card label | 14px | 500 | 20px | text-secondary |
| Badge / caption | 12px | 500 | 16px | text-muted |
| Exam timer | 20px | 600 | 28px | exam-ink |
| Stat number (readiness) | 36px | 700 | 40px | text-primary |

Font: **Inter** via `next/font/google`. Math: KaTeX default fonts via MathDisplay component.

Minimum body text: **16px** — never smaller for readable content on mobile.

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` | 8px | Inline badge gaps |
| `gap-3` | 12px | Form field gaps |
| `gap-4` | 16px | Card internal spacing |
| `gap-6` | 24px | Between sections |
| `p-4` | 16px | Standard card padding (mobile) |
| `p-6` | 24px | Large card padding (desktop) |
| `px-4 py-3` | 16px/12px | Button padding (min 44px height) |
| Page padding | `px-4 py-6` | All student pages mobile |

---

## Component Tokens

### Cards

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: var(--radius-lg) (12px)
padding: 16px mobile / 24px desktop
box-shadow: 0 1px 3px rgba(0,0,0,0.08)
```

Exam mode cards: no shadow, `bg-exam-paper`, no border.

### Buttons

**Primary:**
```
background: bg-primary
color: text-primary-foreground
border-radius: rounded-md (8px)
padding: px-4 py-3
min-height: 44px
font-weight: 500
font-size: 16px
```

**Secondary:**
```
background: bg-surface
border: 1px solid var(--color-border)
color: text-primary
```

**Hint button:**
```
background: bg-surface-secondary
border: 1px solid var(--color-border)
color: text-secondary
icon: Lightbulb (lucide), 20px
```

**Submit answer:**
```
background: bg-primary
full-width on mobile
disabled: opacity-50 when empty answer
loading: spinner + "Marking your answer..."
```

### Form Inputs

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: rounded-md
padding: px-3 py-3
min-height: 44px
font-size: 16px
focus: ring-2 ring-primary ring-offset-2
error: border-error + text-error caption below
```

### Mastery Map Grid

```
grid: grid-cols-2 gap-3 (mobile) / grid-cols-3 (tablet+)
cell: rounded-lg p-3 border-2
cell min-height: 72px
topic name: 14px font-medium
mastery %: 12px text-muted
```

### Readiness Score Ring

```
size: 80px diameter
stroke-width: 8px
track: var(--color-border)
fill: var(--color-primary) proportional to score
centre text: 24px font-bold
label below: "Exam Readiness"
```

### Offline Banner

```
background: var(--color-offline-bg)
border-bottom: 1px solid var(--color-border)
text: var(--color-offline)
icon: WifiOff (lucide)
padding: py-2 px-4
position: sticky top-0 z-50
```

---

## Logo / Brand

```
App name: ExamEdge
Primary color: #1E40AF
Logo mark: BookOpen + graduation cap concept (simple, no complex illustration)
Navbar logo height: 32px
```

---

## Invariants

- Never use hex directly in components — always CSS variables / Tailwind token classes
- Font is Inter — import via next/font/google, never system font as primary
- Never use Tailwind built-in color scales (`bg-blue-500`, `text-gray-600`)
- Mastery colors always use mastery-red/amber/green tokens — never generic red/yellow/green
- Mark type badges always use mark-m1/a1/b1 tokens — consistent across MarkingDisplay
- Exam mode always uses exam-paper background — never white with shadows
- Min touch target 44×44px for all interactive elements
- Min body text 16px — accessibility requirement for low-end Android screens
