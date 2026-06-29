# UI Rules — ExamEdge

Concise rules for building ExamEdge UI. Read ui-tokens.md for exact values. These rules cover patterns and constraints to keep the UI consistent.

---

## Font

Always import Inter via `next/font/google` in root layout:

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

Apply to `<html className={inter.variable}>`. Never use system fonts as primary.

KaTeX math renders inside `.math-display` wrapper — do not override KaTeX font sizes below 16px.

---

## Layout

- **Mobile-first:** Design for 360px width first, scale up
- **Max content width:** `max-w-lg mx-auto` on desktop (student app is not a wide dashboard)
- **Page padding:** `px-4 py-6` minimum on all student pages
- **Section gap:** 24px (`gap-6`) between major sections
- **Navbar height:** 56px, sticky top, white background, bottom border
- **No sidebar** in MVP — top navbar only
- **Exam mode:** No navbar, no footer, fullscreen — paper aesthetic only

---

## Navbar

Four nav items: Dashboard, Practice, Progress, Profile.

- Active: `text-primary font-medium`
- Inactive: `text-text-secondary font-medium`
- No underline — color change only for active state
- Logo left, nav items right (or hamburger below 640px)
- Offline banner appears below navbar when disconnected

---

## Cards

Every content section lives in a card except exam mode.

```
background: bg-surface
border: 1px solid border
border-radius: 12px
padding: 16px (mobile) / 24px (desktop)
shadow: subtle (see ui-tokens.md)
```

Never use colored card backgrounds — color goes inside via badges, mastery cells, mark types.

Exam mode: no cards — flat paper layout with question number header only.

---

## Typography Hierarchy

**Page title**
```
text-2xl font-bold text-text-primary
```

**Section heading (card title)**
```
text-lg font-semibold text-text-primary
```

**Body / question text**
```
text-base text-text-primary (16px minimum)
```

**Secondary / labels / timestamps**
```
text-sm text-text-muted
```

**Exam question number**
```
text-sm font-medium text-text-secondary
"Question 3 of 10"
```

---

## Study Session Layout

Mobile viewport split:

```
┌─────────────────────────┐
│ Question 2/5    [Hint]  │  ← header row
├─────────────────────────┤
│                         │
│   Question (KaTeX)      │  ← 45% viewport, scrollable
│                         │
├─────────────────────────┤
│   MathInput / Photo     │  ← 35% viewport
├─────────────────────────┤
│   [Submit Answer]       │  ← fixed bottom, full width
└─────────────────────────┘
```

After submit: MarkingDisplay slides up below question, replacing MathInput.

---

## Marking Display

- Show total: "4 / 6 marks" prominently
- Each step: mark type badge + awarded/denied + feedback text
- Denied steps: line-through on mark badge
- If confidence < 0.70: amber "Under review" badge above total
- Never show full mark scheme — only steps with feedback

---

## Hint Panel

- Appears below question when hint requested
- Shows: lightbulb icon + hint text (guiding question only)
- Footer: "Hints remaining: 2/3"
- Never show hint before first wrong/partial submission
- Hint text max 200 chars — truncate with ellipsis if needed in UI

---

## Mastery Map

- Grid of topic cells (see ui-tokens.md colors)
- Each cell: topic name + mastery percentage
- Tap cell → navigate to `/study/[topicId]`
- Legend below grid: Red = Needs work, Amber = Developing, Green = Mastered
- Empty state (all red): "Start with [recommended topic]" CTA

---

## Exam Simulation

- Request fullscreen on session start
- Timer top-right, always visible, turns amber at 5 minutes remaining, red at 1 minute
- Question navigation: Previous / Next at bottom (no jumping ahead unvisited in MVP)
- No hint button in exam mode
- Tab switch → pause overlay: "You left the exam environment. Return to continue."
- Submit paper button on last question only

---

## Focus Preparation Prompt

Shown once at session start (dismissible):

```
Before you start: For the next 30 minutes, consider putting your phone
face-down, closing other tabs, and letting those around you know you are
studying. ExamEdge works best when you give it your full attention.

[I'm ready — Start studying]
```

Minimal design — no illustrations, text + single button only.

---

## Empty States

Every section that can be empty needs an empty state:

- Short descriptive text in `text-text-muted`
- Optional icon (lucide, 24px, muted)
- CTA button if logical next action exists

Examples:
- No sessions yet: "Complete your first practice session to see progress here."
- No appeals: "If you disagree with a mark, you can appeal from the marking screen."

---

## Loading States

- Dashboard: skeleton loaders for mastery map cells — not full-page spinner
- Marking: inline spinner on Submit button + "Marking your answer..."
- Hint: inline spinner on Hint button + "Getting a hint..."
- Never block entire screen except initial auth check

---

## Photo Upload

- Camera icon button beside MathInput
- After capture: thumbnail preview + "Confirm" / "Retake"
- OCR processing: "Reading your working..." spinner
- Show transcription for student review before marking
- Low confidence OCR: warning text before submit

---

## Admin Validation Queue

- Desktop-friendly layout (admin may use laptop)
- Two-column: question preview left, cross-examination result right
- Approve (green) / Reject (red) buttons with optional notes field
- Show param_schema and mark_scheme JSON in collapsible panel

---

## Do Nots

- Never use Tailwind built-in color classes — project tokens only
- Never show raw error messages or API stack traces to students
- Never add social feeds, news, or entertainment to break screens
- Never use guilt-trip streak notifications ("You lost your streak!")
- Never show the correct answer in hint panel
- Never use font size below 14px for interactive element labels
- Never use `position: fixed` for navbar — use sticky
- Never add gradients to card backgrounds (except readiness ring)
- Never use more than 2 font weights in a single UI element
