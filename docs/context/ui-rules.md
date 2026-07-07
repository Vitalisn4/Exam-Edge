# UI Rules — ExamEdge

Concise rules for building ExamEdge UI. Read `ui-tokens.md` for exact values and `design-brand-identity.md` for brand personality. These rules cover patterns and constraints to keep the UI consistent.

---

## Fonts

**Inter** — primary UI and body via `next/font/google`:

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

**Clash Display** — hero/marketing headlines only (load locally or via CDN; fallback Inter).

**JetBrains Mono** — exam reference numbers, step labels in working space.

Apply Inter to `<html className={inter.variable}>`. KaTeX math inside `.math-display` — minimum **16px**, never override below.

---

## Layout

- **Mobile-first:** Design for 320–360px width first, scale up
- **Student app max width:** `max-w-[1200px]` centred on desktop (not a cramped phone-only layout at xl)
- **Marketing landing:** full-width sections, hero max-width ~680px for copy
- **Page padding:** `px-4 py-6` mobile · `px-8` tablet · `px-12` desktop
- **Section gap:** 48px mobile / 96px desktop between major sections
- **Navigation (MVP web):**
  - **Mobile (<1024px):** bottom tab bar (max 5 items), top bar 56px
  - **Desktop (≥1024px):** left sidebar 256px (collapsible to 72px) + top bar 64px
- **Exam mode:** No sidebar, no bottom nav, no footer — fullscreen paper aesthetic only

> **Note:** Units 03–19 may ship with top navbar only during MVP sprint; migrate to sidebar + bottom nav per `examedge-ui-mockup-prompt.md` before Unit 31 polish.

---

## Navigation

**Student primary nav:** Dashboard, Study/Practice, Progress, Profile (+ Exam when simulation live).

- Active: `text-primary-700 font-medium` + primary-50 background (sidebar) or teal icon + dot (bottom nav)
- Inactive: `text-text-secondary`
- Logo height: 32px
- Offline banner: sticky below top bar when disconnected
- Exam countdown chip (amber pill) in top bar when exam date registered

---

## Signature element: Mastery Heatmap

The visual centrepiece of ExamEdge. Grid of topic squares coloured by mastery state (teal gradient scale).

- Appears on: dashboard, subject overview, progress/analytics
- Cell: 32×32px, 3px gap, `--mastery-*` colours from `ui-tokens.md`
- Hover/tap: tooltip with topic name, mastery %, days since last practice
- Fill animation when mastery improves: **400ms ease-out**
- Legend below grid with all state labels
- Tap cell → `/study/[topicId]` or topic detail
- Empty state: "Your journey starts here" + Start First Session CTA

Do not replace heatmap with a list-only progress view on dashboard.

---

## Cards

Every content section lives in a card except exam mode.

```
background: bg-surface
border: 1px solid border
border-radius: var(--radius-md) (12px)
padding: 16px mobile / 24px desktop
shadow: var(--shadow-sm)
```

Subject cards: 4px left border in subject colour. Hover: shadow-lg + translateY(-2px).

Never use coloured card backgrounds — colour via badges, heatmap cells, mark types, subject accents.

Exam mode: flat paper layout, no card shadows.

---

## AI-generated content

All AI tutor, hint, marking feedback, and curriculum explanation panels:

```
border-left: 3px solid var(--color-primary-500)
optional: "ExamEdge AI" label with teal gradient top bar (3px)
```

Students must always distinguish AI content from static syllabus text.

---

## Typography Hierarchy

**Page title:** `text-2xl font-bold text-text-primary` (mobile) · `text-3xl` desktop

**Section heading:** `text-lg font-semibold text-text-primary`

**Body / question:** `text-base` minimum (15–16px), line-height ≥ 1.5

**Exam question:** 18px, line-height 1.8, **left-aligned never centred**

**Secondary / labels:** `text-sm text-text-muted`

---

## Study Session Layout

Mobile viewport split:

```
┌─────────────────────────┐
│ Question 2/5    [Hint]  │
├─────────────────────────┤
│   Question (KaTeX)      │  ← ~45% viewport, scrollable
├─────────────────────────┤
│   MathInput / Photo     │  ← ~35% viewport
├─────────────────────────┤
│   [Submit Answer]       │  ← fixed bottom, full width, 44px min
└─────────────────────────┘
```

Desktop: two-panel optional — question left, context/hints right (50/50 at lg+).

After submit: MarkingDisplay slides up; AI feedback with teal left border.

---

## Marking Display

- Total: "4 / 6 marks" prominently
- Per step: mark type badge + awarded/denied + feedback
- Denied: line-through on badge
- confidence < 0.70: amber "Under review" badge
- Never show full mark scheme — only awarded/denied steps with feedback

---

## Hint Panel

- Background: `bg-[var(--color-info-light)]`
- Border-left: 3px solid info colour
- Lightbulb icon + guiding question only (max 200 chars)
- Footer: "Hints remaining: N/3"
- Disabled until first submission with marks < 50%
- Never reveal answer or next correct step

---

## Exam Simulation

- Pre-exam system check screen before Begin
- Request fullscreen on start
- Top bar: dark (`neutral-900`), subject + paper, centre timer HH:MM:SS
- Timer: white → amber at 30 min → red + pulse at 10 min
- Question navigator drawer: grid of question numbers with visited/answered/flagged states
- No hints, no recommendations, no notifications
- Tab switch / exit fullscreen → pause overlay, timer pauses, event logged
- Submit paper: confirmation modal with answered/flagged/unattempted summary
- **No animations** except timer pulse at critical thresholds

---

## Gamification (calm, not aggressive)

- **Streak:** flame + count; celebrate 7/30/100 day milestones; no guilt-trip loss messaging
- **Badges:** hexagonal tiles; locked = greyscale + padlock
- **Daily goal ring:** fills on dashboard; celebrates at 100% without locking further study
- **Mastery milestone:** subtle confetti (0.5s, respects `prefers-reduced-motion`)

---

## Empty, Loading, and Error States

See `examedge-ui-mockup-prompt.md` for copy. Every list/dashboard section needs empty state + CTA.

- **Loading:** skeleton shimmer matching content shape — not full-page spinner (except exam submit processing)
- **AI loading:** teal pulsing dots — "ExamEdge AI is thinking..."
- **Marking:** "Marking your response..." + teal progress bar
- **Errors:** human message + action — never raw API errors or stack traces

---

## Accessibility

- WCAG AA minimum (AAA preferred for body text)
- Focus ring: 3px primary with 2px offset — never `outline: none` without replacement
- Min touch target 44×44px
- `prefers-reduced-motion: reduce` — disable celebratory animations
- Profile accessibility tab (V1.1): text size, dyslexia font, high contrast, dark mode toggle

---

## Dark Mode

Tokens defined in `ui-tokens.md`. Full dark mode implementation targeted **V1.1** (`roadmap.md`). When implemented: navy-to-teal surfaces, not inverted light mode.

---

## Do Nots

- Never use Tailwind built-in colour classes — project tokens only
- Never show raw error messages to students
- Never add social feeds, news, or entertainment on study screens
- Never use guilt-trip streak notifications
- Never show correct answer in hint panel
- Never use font size below 14px for interactive labels
- Never animate distractingly during exam mode
- Never use gradients on card backgrounds (except welcome bar, hero, results celebration)
- Never hide offline state — always show OfflineBanner when disconnected

---

## References

| Screen spec                      | Document                       |
| -------------------------------- | ------------------------------ |
| All 11 core screens + components | `examedge-ui-mockup-prompt.md` |
| Tokens                           | `ui-tokens.md`                 |
| Brand                            | `design-brand-identity.md`     |
| Component inventory              | `ui-registry.md`               |
