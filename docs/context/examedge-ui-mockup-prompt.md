# ExamEdge — Complete UI/UX Design Generation Prompt

> **How to use:** Copy everything inside the fenced block under "COPY FROM HERE" into an AI design tool (Figma AI, Galileo AI, Uizard, Framer AI, v0.dev, Cursor, etc.). Implementation must align with `ui-tokens.md`, `ui-rules.md`, and `design-brand-identity.md`. Build units reference this file via `build-plan.md` and `feature-prompts/unit-NN-*.md`.

**Related:** `build-plan.md` · `ui-registry.md` · `feature-prompts/`

---

## COPY FROM HERE ↓

```
# ExamEdge — Complete UI/UX Design Generation Prompt

**For use in:** Figma AI, Galileo AI, Uizard, Framer AI, v0.dev, Cursor, Claude, GPT-4o, or any AI design tool capable of generating high-fidelity UI mockups and design systems.

---

## Master Brief

Generate a complete, production-grade design system and full frontend mockup for **ExamEdge** — an AI-powered examination preparation and personalised learning platform serving secondary school students across Africa, beginning with GCE Ordinary and Advanced Level students in Cameroon and expanding to support BEPC, Baccalauréat, WAEC, NECO, and KCSE examination systems.

The design must feel like a platform built by people who genuinely understand African students: their devices, their internet conditions, their aspirations, and the weight of what a national examination means to their future. It should feel simultaneously world-class and deeply local.

**The student should feel:** *"I can succeed here. This platform was built for me."*

**The teacher should feel:** *"I can trust this. It gives me real insight into my students."*

**The parent should feel:** *"My child is in good hands."*

---

## Brand Identity and Visual Philosophy

**Brand name:** ExamEdge

**Tagline:** *Master Every Subject. Ace Every Examination.*

**Brand personality:** Intelligent, calm, focused, trustworthy, quietly ambitious. The brand does not shout. It earns confidence through precision and clarity. Think of a brilliant tutor who arrives early, sits beside you, never judges your mistakes, and genuinely wants you to succeed.

**Design influences to study and synthesise** (do not copy — synthesise):
- Notion's spatial clarity and information hierarchy
- Linear's precision and typographic discipline
- Khan Academy's subject-level warmth and accessibility
- Duolingo's streak-based motivation without its cartoon aggression
- Stripe Dashboard's data density done beautifully
- Apple HIG's respect for human attention
- Google Material 3's adaptive colour and accessibility standards
- Coursera's professional credibility signals

**One aesthetic risk:** The primary signature element of ExamEdge is a **mastery heatmap** — a visual grid of topic squares that fills with colour as a student progresses. This element appears on the dashboard, the subject overview, and the progress page. It is the centrepiece of the platform's visual identity. Every colour decision should feel right when applied to this heatmap.

---

## Complete Colour System

### Primary Palette — Teal Forest

The primary colour communicates knowledge, growth, trust, and calm focus. It draws from the colour of deep forest canopy and still water — environments where deep thinking happens.

```

--color-primary-50: #E6F4F1
--color-primary-100: #C0E4DC
--color-primary-200: #97D2C6
--color-primary-300: #6BBFAF
--color-primary-400: #46B09E
--color-primary-500: #1DA08C ← Primary brand colour
--color-primary-600: #0E8A78 ← Interactive default (buttons, links)
--color-primary-700: #0E5C4A ← Primary dark (headings, strong accents)
--color-primary-800: #0A3D31
--color-primary-900: #051F19

```

### Secondary Palette — Ivory Parchment

The secondary colour communicates warmth, welcome, and academic tradition. It evokes the texture of well-used textbooks and examination paper.

```

--color-secondary-50: #FEFDF9
--color-secondary-100: #FDF8ED
--color-secondary-200: #FAF0D4
--color-secondary-300: #F5E5B0
--color-secondary-400: #EDD57F
--color-secondary-500: #E2C04A ← Secondary brand colour (achievement gold)
--color-secondary-600: #C4A13A
--color-secondary-700: #9E7E28
--color-secondary-800: #735A19
--color-secondary-900: #3D2F09

```

### Accent — Electric Cyan

Used sparingly on interactive highlights, focused states, and AI-generated content indicators.

```

--color-accent-400: #22D3EE
--color-accent-500: #06B6D4 ← AI tutor accent, interactive highlights
--color-accent-600: #0891B2

```

### Semantic Colours

```

/* Success — correct answers, mastery achieved, completed sessions */
--color-success-50: #F0FDF4
--color-success-400: #4ADE80
--color-success-500: #22C55E
--color-success-600: #16A34A
--color-success-700: #15803D

/* Warning — low mastery, approaching deadline, partial credit */
--color-warning-50: #FFFBEB
--color-warning-400: #FBBF24
--color-warning-500: #F59E0B
--color-warning-600: #D97706
--color-warning-700: #B45309

/* Error — wrong answers, failed validation, urgent alerts */
--color-error-50: #FEF2F2
--color-error-400: #F87171
--color-error-500: #EF4444
--color-error-600: #DC2626
--color-error-700: #B91C1C

/* Info — hints, guidance, AI explanations */
--color-info-50: #EFF6FF
--color-info-400: #60A5FA
--color-info-500: #3B82F6
--color-info-600: #2563EB

```

### Neutral Palette — Slate

```

--color-neutral-0: #FFFFFF
--color-neutral-50: #F8FAFC
--color-neutral-100: #F1F5F9
--color-neutral-200: #E2E8F0
--color-neutral-300: #CBD5E1
--color-neutral-400: #94A3B8
--color-neutral-500: #64748B
--color-neutral-600: #475569
--color-neutral-700: #334155
--color-neutral-800: #1E293B
--color-neutral-900: #0F172A ← Deep navy (dark mode background)
--color-neutral-950: #080E1A

```

### Dark Mode Palette

Dark mode is not simply inverted light mode. It uses the navy-to-teal spectrum as its base, giving the platform a deep, focused study-environment feel — like a student's desk lamp lit room at night.

```

/* Dark mode surfaces */
--dark-surface-base: #0F172A ← Page background
--dark-surface-raised: #1E293B ← Cards, panels
--dark-surface-overlay: #263448 ← Modals, popovers
--dark-surface-sunken: #080E1A ← Input backgrounds, code blocks

/* Dark mode text */
--dark-text-primary: #F1F5F9
--dark-text-secondary: #94A3B8
--dark-text-muted: #64748B
--dark-text-disabled: #334155

/* Dark mode borders */
--dark-border-default: #1E293B
--dark-border-subtle: #263448
--dark-border-strong: #334155

/* Primary stays consistent in dark mode — teal reads well on navy */
--dark-primary: #1DA08C
--dark-primary-hover: #46B09E

```

### Mastery State Colours (for heatmap and progress indicators)

```

--mastery-not-started: #E2E8F0 ← Neutral grey
--mastery-introduced: #97D2C6 ← Light teal
--mastery-developing: #46B09E ← Mid teal
--mastery-proficient: #1DA08C ← Primary teal
--mastery-mastered: #0E5C4A ← Deep teal
--mastery-at-risk: #F59E0B ← Warning amber (declining mastery)

```

### Subject Colour Coding

Each subject has a unique accent colour used on subject cards, progress indicators, and topic chips. These are distinct enough to be distinguishable but all harmonise with the primary teal brand.

```

--subject-mathematics: #6366F1 ← Indigo
--subject-physics: #0EA5E9 ← Sky blue
--subject-chemistry: #10B981 ← Emerald
--subject-biology: #84CC16 ← Lime
--subject-english: #EC4899 ← Pink
--subject-economics: #F59E0B ← Amber
--subject-geography: #14B8A6 ← Teal variant
--subject-history: #A78BFA ← Violet
--subject-literature: #FB7185 ← Rose
--subject-french: #38BDF8 ← Light blue
--subject-computer: #6EE7B7 ← Mint
--subject-further-math: #818CF8 ← Light indigo

```

---

## Typography System

**Primary font:** Inter (Google Fonts — free, extensively optimised for screen readability, renders cleanly at small sizes on Android WebView).

**Display font:** Clash Display (for hero sections and major headings only — conveys ambition and modernity).

**Monospace font:** JetBrains Mono (for mathematical notation display, code blocks, exam reference numbers).

**Fallback stack:** `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Type Scale

```

/* Display — hero sections, landing page headlines */
--text-display-xl: 4rem / 1.1 / -0.04em / 800 ← 64px
--text-display-lg: 3rem / 1.15 / -0.03em / 800 ← 48px
--text-display-md: 2.25rem / 1.2 / -0.02em / 700 ← 36px

/* Headings — page titles, section headers, card titles */
--text-heading-xl: 1.875rem / 1.25 / -0.02em / 700 ← 30px
--text-heading-lg: 1.5rem / 1.3 / -0.015em / 700 ← 24px
--text-heading-md: 1.25rem / 1.35 / -0.01em / 600 ← 20px
--text-heading-sm: 1.125rem / 1.4 / -0.005em / 600 ← 18px
--text-heading-xs: 1rem / 1.4 / 0em / 600 ← 16px

/* Body — paragraphs, explanations, AI tutor responses */
--text-body-xl: 1.125rem / 1.75 / 0em / 400 ← 18px (AI explanations)
--text-body-lg: 1rem / 1.7 / 0em / 400 ← 16px (primary body)
--text-body-md: 0.9375rem / 1.65 / 0em / 400 ← 15px (secondary body)
--text-body-sm: 0.875rem / 1.6 / 0em / 400 ← 14px (captions, labels)

/* UI — buttons, labels, navigation, chips */
--text-ui-lg: 1rem / 1.25 / 0.01em / 500 ← 16px buttons
--text-ui-md: 0.875rem / 1.25 / 0.01em / 500 ← 14px labels
--text-ui-sm: 0.75rem / 1.2 / 0.02em / 500 ← 12px badges, chips

/* Examination — question text (must be highly readable under time pressure) */
--text-exam-question: 1.125rem / 1.8 / 0.01em / 400 ← 18px
--text-exam-option: 1rem / 1.6 / 0em / 400 ← 16px
--text-exam-label: 0.875rem / 1.4 / 0.03em / 600 uppercase ← 14px

```

### Typography Rules

- All body text minimum 15px (accessibility for low-vision students)
- Line height minimum 1.5 for all reading contexts
- Maximum line length 72 characters for body text on desktop (reading comfort)
- Question text always left-aligned, never centred
- Mathematical notation uses MathView / KaTeX with minimum 16px base size
- Avoid light font weights below 400 — thin text renders poorly on low-end Android screens

---

## Spacing System

Based on a 4px base unit. Every spacing value is a multiple of 4.

```

--space-0: 0px
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-7: 28px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-14: 56px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
--space-40: 160px
--space-48: 192px

```

**Semantic spacing:**
```

--spacing-component-inner-xs: 8px ← Chip padding, badge padding
--spacing-component-inner-sm: 12px ← Small button padding
--spacing-component-inner-md: 16px 24px ← Default button, input padding
--spacing-component-inner-lg: 20px 32px ← Large interactive areas
--spacing-card-padding-sm: 16px
--spacing-card-padding-md: 24px
--spacing-card-padding-lg: 32px
--spacing-section-gap-mobile: 48px
--spacing-section-gap-desktop: 96px
--spacing-page-padding-mobile: 16px
--spacing-page-padding-tablet: 32px
--spacing-page-padding-desktop: 48px

```

---

## Border Radius System

```

--radius-none: 0
--radius-xs: 4px ← Inline badges, table cells
--radius-sm: 8px ← Inputs, small buttons, chips
--radius-md: 12px ← Cards, modals, panels
--radius-lg: 16px ← Subject cards, feature cards
--radius-xl: 24px ← Large hero cards, dashboard panels
--radius-2xl: 32px ← Hero images, mascot containers
--radius-full: 9999px ← Pills, avatars, progress bars, circular buttons

```

---

## Shadow and Elevation System

```

--shadow-none: none
--shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06)
--shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)
--shadow-md: 0 4px 6px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)
--shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.05)
--shadow-xl: 0 20px 25px rgba(15, 23, 42, 0.1), 0 8px 10px rgba(15, 23, 42, 0.04)
--shadow-2xl: 0 25px 50px rgba(15, 23, 42, 0.25)

/* Teal glow — used on primary action focus states and AI interactions */
--shadow-primary-glow: 0 0 0 3px rgba(29, 160, 140, 0.25)
--shadow-primary-glow-strong: 0 0 0 4px rgba(29, 160, 140, 0.4)

/* Inset — for sunken inputs, pressed states */
--shadow-inset-sm: inset 0 1px 2px rgba(15, 23, 42, 0.06)
--shadow-inset-md: inset 0 2px 4px rgba(15, 23, 42, 0.1)

```

---

## Animation and Transition System

```

/* Duration */
--duration-instant: 50ms
--duration-fast: 100ms
--duration-normal: 200ms
--duration-moderate: 300ms
--duration-slow: 500ms
--duration-deliberate: 700ms

/* Easing */
--ease-linear: cubic-bezier(0, 0, 1, 1)
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1) ← Default for appearing elements
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) ← Default for moving elements
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) ← For celebrate/reward moments
--ease-exam-timer: linear ← Timer countdown must be linear

/* Standard transitions */
--transition-color: color 200ms ease-out, background-color 200ms ease-out
--transition-opacity: opacity 200ms ease-out
--transition-transform: transform 200ms ease-out
--transition-shadow: box-shadow 200ms ease-out
--transition-all: all 200ms ease-out

/* Page transitions */
--transition-page-enter: opacity 300ms ease-out, transform 300ms ease-out
--transition-page-exit: opacity 150ms ease-in

```

**Animation rules:**
- All animations respect `prefers-reduced-motion: reduce` — no motion for users who have this set
- Never animate during examination mode (distraction prevention)
- Reward animations (streak achieved, mastery milestone) use `--ease-spring` and are 500ms maximum
- Loading spinners rotate at exactly 1 revolution per second
- Page transitions slide content up 16px on enter

---

## Z-Index System

```

--z-base: 0
--z-raised: 10 ← Floating cards, sticky elements
--z-dropdown: 100 ← Dropdowns, select menus
--z-sticky: 200 ← Sticky headers, bottom bars
--z-overlay: 300 ← Page overlays, drawer backdrops
--z-modal: 400 ← Modals, dialogs
--z-popover: 500 ← Tooltips, popovers
--z-toast: 600 ← Toast notifications
--z-exam: 700 ← Exam mode overlay (highest — blocks all distractions)

```

---

## Breakpoints and Grid System

```

--breakpoint-xs: 320px ← Minimum supported (very small Android phones)
--breakpoint-sm: 390px ← Standard small phone (iPhone SE, budget Android)
--breakpoint-md: 640px ← Large phone / small tablet
--breakpoint-lg: 768px ← Tablet portrait
--breakpoint-xl: 1024px ← Tablet landscape / laptop
--breakpoint-2xl: 1280px ← Desktop
--breakpoint-3xl: 1536px ← Large desktop

/* Grid */
--grid-columns-mobile: 4
--grid-columns-tablet: 8
--grid-columns-desktop: 12
--grid-gutter-mobile: 16px
--grid-gutter-tablet: 24px
--grid-gutter-desktop: 32px
--grid-margin-mobile: 16px
--grid-margin-tablet: 32px
--grid-margin-desktop: 64px

```

---

## Component Specifications

### Buttons

**Primary Button (teal — main actions):**
- Background: `--color-primary-600`
- Text: white, `--text-ui-lg`, weight 500
- Padding: 12px 24px (sm), 14px 28px (md), 16px 32px (lg)
- Border radius: `--radius-sm` (8px)
- Hover: `--color-primary-700`, `--shadow-md`
- Active: `--color-primary-800`, scale(0.98)
- Focus: `--shadow-primary-glow`
- Disabled: `--color-neutral-200` background, `--color-neutral-400` text
- Loading: spinner replaces text, width preserved

**Secondary Button (outlined):**
- Background: transparent
- Border: 1.5px solid `--color-primary-600`
- Text: `--color-primary-600`
- Hover: `--color-primary-50` background
- Same sizing as primary

**Ghost Button (minimal):**
- Background: transparent
- Text: `--color-neutral-600`
- Hover: `--color-neutral-100` background
- Used for: cancel, dismiss, secondary navigation

**Danger Button:**
- Background: `--color-error-600`
- Used for: delete, exit exam without saving, irreversible actions

**Icon Button:**
- Circular, `--radius-full`
- 36px (sm), 44px (md), 52px (lg)
- Minimum tap target 44x44px (accessibility)

### Input Fields

```

Height: 48px (mobile), 52px (desktop)
Background: --color-neutral-50 (light), --dark-surface-sunken (dark)
Border: 1.5px solid --color-neutral-200
Border radius: --radius-sm (8px)
Padding: 12px 16px
Font: --text-body-lg, --color-neutral-900

States:
Default: border --color-neutral-200
Hover: border --color-neutral-300
Focus: border --color-primary-500, --shadow-primary-glow
Error: border --color-error-500, background --color-error-50
Success: border --color-success-500
Disabled: background --color-neutral-100, text --color-neutral-400

Label: --text-ui-md, weight 500, --color-neutral-700, 8px above input
Helper: --text-ui-sm, --color-neutral-500, 4px below input
Error message: --text-ui-sm, --color-error-600, with error icon

```

### Cards

**Base card:**
```

Background: --color-neutral-0 (white)
Border: 1px solid --color-neutral-100
Border radius: --radius-md (12px)
Shadow: --shadow-sm
Padding: 24px

```

**Subject card:**
```

Width: 100% on mobile, 280px fixed on desktop
Height: 180px (mobile), 200px (desktop)
Left border accent: 4px solid [subject-colour]
Contains: Subject icon (32px), subject name (--text-heading-sm),
topic count, mastery bar, last-studied label
Hover: shadow --shadow-lg, translateY(-2px) 200ms ease-out

```

**Question card (exam and practice):**
```

Width: 100%
Background: --color-neutral-0
Border radius: --radius-lg (16px)
Shadow: --shadow-md
Padding: 32px (desktop), 20px (mobile)
Question number: --text-ui-sm uppercase teal label
Question text: --text-exam-question, 1.8 line height
Answer options: 56px min-height each, left-radio + full-width clickable area

```

**Mastery heatmap cell (the signature element):**
```

Width: 32px, Height: 32px
Border radius: --radius-xs (4px)
Gap between cells: 3px
Colour: one of --mastery-* values based on student progress
Hover: scale(1.15), tooltip with topic name and mastery %
Transition: background-color 400ms ease-out (satisfying fill animation)

```

### Navigation

**Top Navigation Bar (web):**
```

Height: 64px
Background: --color-neutral-0 / --dark-surface-raised
Border-bottom: 1px solid --color-neutral-100
Contents (left to right):

- ExamEdge logo (32px height)
- Global search (expandable, 320px wide when focused)
- Notification bell with unread badge
- Exam countdown chip (if exam registered — amber pill with timer)
- User avatar (40px circular) + dropdown
  Sticky: yes (position: sticky, top: 0, z-index: --z-sticky)

```

**Left Sidebar (web dashboard):**
```

Width: 256px (expanded), 72px (collapsed)
Background: --color-neutral-50
Border-right: 1px solid --color-neutral-100
Sections:

- Logo area (64px height, matches top bar)
- Student avatar + name + grade/level
- Primary nav items (icon + label)
- Divider
- Secondary nav items
- Collapse toggle at bottom
  Nav item height: 44px
  Nav item padding: 8px 16px
  Active state: background --color-primary-50, left border 3px solid --color-primary-600, text --color-primary-700
  Hover state: background --color-neutral-100

```

**Mobile Bottom Navigation:**
```

Height: 64px + safe area inset
Background: --color-neutral-0 / --dark-surface-raised
Border-top: 1px solid --color-neutral-100
Items: 5 max (Dashboard, Study, Practice, Exam, Profile)
Active: icon teal, label teal, small dot indicator
Inactive: icon --color-neutral-400, label --color-neutral-400
Tap target: full height, equal width columns

```

**Mobile Top Bar:**
```

Height: 56px
Left: back arrow (when nested) or hamburger menu
Centre: screen title
Right: contextual action (search, settings, etc.)

```

---

## Complete Screen Specifications

### Screen 1: Marketing Landing Page

**Layout:** Full-width, single column on mobile, multi-column on desktop.

**Hero section:**
```

Background: --color-neutral-900 (deep navy)
Overlay: subtle teal radial gradient from top-right corner
Content (centred, max-width 680px):

- Eyebrow text: "GCE · BEPC · WAEC · KCSE" (teal pills, small)
- Headline (Clash Display 64px desktop / 40px mobile):
  "Every Question Answered. Every Examination Conquered."
- Sub-headline (Inter 20px):
  "AI-powered tutoring and examination preparation designed for African students.
  Learn your curriculum. Master every topic. Ace your examinations."
- CTA pair: [Get Started Free] primary button + [See How It Works] ghost button
- Social proof: "Join 12,000+ students preparing for their examinations"
- Hero illustration: student at desk with holographic subject tiles floating around
  Height: 100vh on desktop, auto on mobile

```

**Features section:**
```

Background: --color-neutral-50
3-column grid (desktop) / 1-column (mobile)
Each feature card:

- Icon (48px, teal)
- Heading (--text-heading-sm)
- Description (--text-body-md, --color-neutral-600)
  Features to include:

1. AI Tutor — "Explains any concept, step by step, in the way your textbook never could"
2. Examiner-Accurate Marking — "Awarded marks using the same M1/A1/B1 system as your examination board"
3. Personalised Study Plans — "Knows which topics you need most and builds your revision around them"
4. Exam Simulation — "Timed, full-paper examination simulations at GCE, BEPC, and WAEC standard"
5. Works Offline — "Download your session and study without internet. Syncs when you reconnect."
6. Know Your Level — "Mastery maps show exactly how ready you are, topic by topic"

```

**Curriculum section:**
```

Headline: "Designed for Your Examination"
Tab selector: GCE A-Level | GCE O-Level | BEPC/Bac | WAEC | NECO | KCSE
Per-tab: board logo + supported subjects grid + example question preview

```

**How it works section:**
```

3-step visual flow (horizontal on desktop, vertical on mobile):
Step 1: Choose Your Subjects — subject picker visual
Step 2: Study with Your AI Tutor — chat interface preview
Step 3: Simulate Your Examination — exam screen preview
Each step has a step number (large, teal), heading, and one-sentence description.

```

**Testimonial section:**
```

Background: teal gradient (--color-primary-700 to --color-primary-800)
3 student testimonials in cards (white on teal background)
Each card: student photo (circular), name, school, examination board, quote
Rotating carousel on mobile

```

**Pricing section:**
```

3-tier pricing table:
Free: 5 questions/day, 2 subjects, basic feedback
Student (XAF 2,500/month): All subjects, AI tutor, exam simulation, offline
School (XAF 25,000/month per school): Teacher dashboard, class analytics, all features
Recommended tier highlighted with teal border and "Most Popular" badge
Annual discount shown (2 months free)

```

**Footer:**
```

4-column desktop / 2-column tablet / 1-column mobile
Columns: About ExamEdge | Subjects & Boards | Support | Legal
Bottom bar: copyright + social links + language selector

```

---

### Screen 2: Onboarding Flow (First-Time User)

**Step 1: Welcome + Name**
```

Full-screen, centred card (max-width 480px)
Background: --color-neutral-50
Progress indicator: 5 dots at top, step 1 filled teal
Headline: "Welcome to ExamEdge"
Sub: "Let's set up your account in under 2 minutes."
Input: "What should we call you?"
CTA: [Continue →]

```

**Step 2: Country + Examination Board**
```

Question: "Which examination are you preparing for?"
Search input + visual board cards (flag + board name + exam type)
GCE Board Buea, Office du Bac, WAEC, NECO, KNEC, ZIMSEC
Single-select with teal selection state
Sub-selector appears for board-specific levels (e.g., O-Level / A-Level for GCE)

```

**Step 3: Subject Selection**
```

Question: "Which subjects are you studying?"
Subject grid (4 columns desktop / 2 columns mobile)
Each subject: icon + name + [subject colour]
Multi-select: selected state = teal border + checkmark + subject colour fill at 15% opacity
Minimum 1, maximum based on board requirements
"I'm not sure yet — show me all subjects" option at bottom

```

**Step 4: Examination Date**
```

Question: "When is your examination?"
Month + Year picker (not a full date picker — students know their exam month)
OR toggle: "I'm not sure yet / Just exploring"
Drives: exam countdown calculation, daily study plan intensity

```

**Step 5: Daily Study Goal**
```

Question: "How much time can you study each day?"
4 option cards (large, tappable):
15 minutes — "Light revision"
30 minutes — "Steady progress" ← Recommended, pre-selected
60 minutes — "Intensive preparation"
90+ minutes — "Full exam mode"

```

**Completion: Personalised Plan Generated**
```

Full-screen celebration moment:

- Confetti burst (teal + gold particles) for 1 second
- "Your study plan is ready, [Name]!"
- 3-item preview of first day's plan
- CTA: [Start My First Session →]

```

---

### Screen 3: Authentication (Login / Register)

**Shared layout:**
```

Split-screen (desktop): left = illustration + brand message / right = form
Single column (mobile): form only, logo at top
Left panel: dark teal background, student illustration, floating statistic chips
("1,243 students studying right now" / "94% pass rate improvement")

```

**Register form:**
```

Full name input
Email input
Password input (strength indicator below: 4 segments, colours: red/amber/teal/green)
Country selector
Terms checkbox with linked privacy policy
[Create Account] primary button
Divider: "or continue with"
Google OAuth button (white with Google icon)
Sign in link at bottom

```

**Login form:**
```

Email input
Password input + show/hide toggle
[Remember me] checkbox
[Sign In] primary button
Forgot password link
Divider + Google OAuth
Register link at bottom

```

**Password reset:**
```

Step 1: Email entry + [Send Reset Link]
Step 2: "Check your inbox" confirmation with email address displayed
Step 3 (deep link): New password + confirm + [Reset Password]
All steps in same card layout, step indicator at top

```

---

### Screen 4: Student Dashboard

**Layout (desktop):**
```

Left sidebar (256px) + main content area
Top bar with search + notifications + user menu
Main content: 12-column grid

```

**Welcome bar (top of main content):**
```

Height: 120px
Background: linear-gradient from --color-primary-700 to --color-primary-600
Text (white): "Good evening, [Name]. Your examination is in 34 days."
Right: circular exam readiness score (large, e.g., "72%" with arc progress ring)
Responsive: full width, reduced to 80px height on mobile

```

**Today's Study Plan (below welcome bar):**
```

Card with teal left border
Title: "Today's Plan — 45 minutes recommended"
3 session cards inside, horizontal scroll on mobile:
Each session: subject colour + subject name + topic + estimated time + [Start] button
States: Completed (checkmark, greyed), Active (teal border), Upcoming (default)

```

**Mastery Map (signature element — full width card):**
```

Title: "Your Mastery Map" + subject selector tabs
Grid of topic squares (4-6 wide on mobile, 8-10 wide on desktop)
Each square: 28px × 28px with 2px gap, coloured by mastery state
Hover/tap: tooltip "Integration by Parts — 68% mastered — 12 days since last practice"
Legend: 5 colour stops with labels at bottom
CTA link: "View detailed progress →"

```

**Quick Stats row:**
```

4 stat cards (2×2 on mobile, 4×1 on desktop):
Study Streak: 🔥 7 days — "Keep it going!"
Sessions this week: 5/7 — small bar graph
Questions answered: 147 — vs last week
Exam readiness: 72% — upward trend arrow
Each card: icon + large number + label + trend indicator

```

**Recent Sessions:**
```

Table/list (desktop) / stacked cards (mobile)
Columns: Subject | Topic | Questions | Score | Date | Action
Action: [Review] links to session results
Last 5 sessions shown, "View all sessions" link

```

**Recommended Next Topics:**
```

3-card horizontal row
Each card: subject chip + topic name + "Why recommended" tooltip
Based on: weakest mastery scores + upcoming exam topics + spaced repetition schedule
[Start Topic] button on each card

```

---

### Screen 5: Study Mode (AI Tutor / Lesson View)

**Layout:**
```

Single column, max-width 800px, centred
No sidebar during active lesson (distraction prevention)
Breadcrumb at top: Dashboard > Mathematics > Calculus > Integration by Parts

```

**Concept explanation panel:**
```

Background: white card, --shadow-md
AI Tutor indicator: teal gradient bar at top (3px) + "ExamEdge AI" label
Content sections:

- Learning objective (teal pill badge)
- Concept headline (--text-heading-lg)
- Explanation body (--text-body-xl, 1.75 line height)
- Worked example (distinct background: --color-primary-50, left teal border)
- Mathematical notation rendered via KaTeX (--radius-sm background per expression)
- "Did you understand this?" confidence check at bottom
  [I understand] [Explain again] [I'm stuck — give me a hint]

```

**Confidence interaction:**
```

Three buttons trigger different AI responses:
"I understand" → advances to practice question
"Explain again" → AI rephrases with different analogy/approach
"I'm stuck" → hint system activates (see hint panel below)
AI response appears below with slide-up animation, teal left border

```

**Hint panel (Socratic guidance):**
```

Background: --color-info-50
Border-left: 3px solid --color-info-500
AI message: question, not answer
Example: "You correctly identified that we need to find ∫xe^x dx.
What rule do we use when we have two functions multiplied together?"
Input field below: student types their attempt
[Submit My Thinking] button
If correct: affirm + advance
If incorrect: further Socratic hint (maximum 3 before showing worked solution)

```

---

### Screen 6: Practice Mode

**Layout:**
```

Two-panel (desktop): left = question + answer / right = topic context panel
Single column (mobile): question only, context collapsed
Progress indicator at top: "Question 3 of 8 — Mathematics: Integration"
Timer shown only in timed practice mode (default: untimed)

```

**Question display:**
```

Question number badge: "Q3" in teal pill
Marks badge: "[ 6 marks ]" in neutral pill — right-aligned
Question text: --text-exam-question (18px), 1.8 line height
Mathematical expressions: inline KaTeX rendering
Diagram (if present): centred, responsive, labelled with small caption text
Answer space: varies by question type (see below)

```

**Answer input types:**

*Type 1 — Free text (written answer):*
```

Large textarea, min-height 120px
Monospace font for mathematical working
Character counter (for essay questions)
"Show working" toggle (adds structured working space above final answer)

```

*Type 2 — Mathematical working (step-by-step):*
```

Step-by-step builder:
Step field: labelled "Step 1", "Step 2" etc.
Each step: text input + optional math input (KaTeX toolbar)
[+ Add Step] button
Final answer field (distinct styling, larger, "Final Answer" label)

```

*Type 3 — Multiple choice (O-Level / WAEC OBJ):*
```

Option cards: A, B, C, D — full width, 56px height
Left: letter in circle (neutral default, teal when selected)
Right: option text
Single select — tapping one deselects previous
Keyboard navigation: arrow keys

```

*Type 4 — Graph/diagram:*
```

Blank coordinate grid (SVG, responsive)
Drawing tools: point, line, curve, label
Colour: black only (exam-appropriate)
Undo/redo
"Clear" button

```

**After submission:**
```

Marking result appears below answer (slide-down, 300ms ease-out):
Per-step marking display:
Step 1: [M1 ✓] "Correct method: differentiation applied" — 1/1
Step 2: [A1 ✓] "Correct calculation" — 1/1
Step 3: [A1 ✗] "Sign error in final simplification" — 0/1
Total: 5/6 marks
Colour coding: green row = awarded, red row = not awarded, amber = follow-through

AI feedback below marking:
Border-left: 3px solid --color-primary-500
"You correctly identified the integration by parts method and set up u and dv
correctly. The error was in your final simplification — check the sign when
integrating e^x with a negative coefficient."

UVE Probe (appears after 1 second delay):
"Before we continue: explain in your own words why you chose integration by parts
for this problem. What told you this was the right method?"
Text input + [Submit Explanation] button

```

---

### Screen 7: Examination Simulation Mode

**Pre-exam screen:**
```

Full-screen card, centred, max-width 600px
Exam details:
Subject: Pure Mathematics With Mechanics
Paper: Paper 2
Duration: 3 Hours
Total Marks: 100
Instructions: (scrollable list from actual board instructions)
System check:
✓ Full-screen mode supported
✓ Timer ready
✓ Questions loaded (offline available)
✗ Camera not available (photo upload will be unavailable)
[Begin Examination] large primary button
[← Return to Dashboard] ghost button below

```

**Active examination interface:**
```

Layout: STRICTLY single-column, full-screen, browser fullscreen API active

Top bar (examination mode — distinct from normal navigation):
Background: --color-neutral-900 (dark, serious)
Left: "GCE Advanced Level · Pure Mathematics · Paper 2"
Centre: Countdown timer — large, HH:MM:SS format - Normal: white text - 30 minutes remaining: --color-warning-400 text - 10 minutes remaining: --color-error-400 text, pulse animation
Right: "Q [current] of [total]" + [Question Navigator] toggle

Question navigator panel (toggleable drawer):
Background: --dark-surface-raised
Grid of question number buttons (4 columns)
States:
Not visited: neutral outline
Visited: neutral filled
Answered: teal filled
Flagged for review: amber filled with flag icon
Current: white filled (contrast)

Question area:
Background: --color-neutral-0 on --dark-surface-base
Strict content width: 720px max, centred
All normal UI chrome removed (no sidebar, no recommendations, no notifications)
Question display and answer input identical to practice mode
Additional exam-only element: [Flag for Review] button (amber, right-aligned)

Footer bar (examination):
Background: --dark-surface-raised
[← Previous] ghost button
[→ Next Question] primary button
[Submit Paper] secondary button (only visible on last question or via navigator)

Focus break detection:
If student tabs away or exits fullscreen:
Overlay appears: "You left the examination environment"
Timer pauses
[Return to Examination] large button
Event logged to session data

```

**Submission flow:**
```

Step 1: [Submit Paper] clicked
Modal: "Are you sure you want to submit?"
Summary: X answered, Y flagged, Z not attempted
[Go Back and Review] / [Submit My Paper] (danger red)

Step 2: Submission processing
Full-screen loading with animation
"Your examination is being marked by ExamEdge AI..."
Progress indicator (estimated time remaining)

Step 3: Results delivered (3-5 seconds)
Celebration animation (moderate — not excessive for serious exam context)
Results screen appears

```

---

### Screen 8: Results and Feedback

**Overall results card:**
```

Background: linear gradient teal
Score display: large circular progress ring
Inner: "72 / 100"
Ring: teal filled portion, neutral empty
Below: Grade (e.g., "B") in large bold
Sub: "Above the board average for this topic set"
Stats row: Time taken | Questions answered | Flagged questions | Exam date
[Download Results PDF] [Share Achievement] [Review All Questions]

```

**Per-question breakdown:**
```

Accordion list, each question collapsible
Question header: Q1 | [6 marks] | [5/6 awarded] | [expand]
When expanded:
Original question
Student's answer (read-only)
Marking breakdown (step-by-step with M1/A1/B1 as in practice mode)
AI examiner comment
Correct solution (revealed in full on results page)

```

**Topic performance analysis:**
```

Bar chart: per-topic accuracy (horizontal bars, coloured by subject)
"Your Weakest Areas" — 3 topic cards with [Revise Now] buttons
"Your Strongest Areas" — 2 topic cards (affirming, positive)
"Recommended next session" — auto-generated based on results

```

---

### Screen 9: Analytics Dashboard

**Layout:** Full page, scrollable, 2-column on desktop, 1-column on mobile.

**Panels:**
```

1. Exam Readiness Score — large gauge chart, 0-100%, per-subject breakdown
2. Study Time This Week — area chart, daily minutes, goal line
3. Accuracy Trend — line chart, last 30 days, per-subject toggle
4. Mastery Map (full version) — all topics, all subjects, filterable
5. Questions Answered — stat card with sparkline
6. Predicted Grade — per-subject prediction based on mastery trajectory
7. Study Streak — 12-week calendar heatmap (GitHub contribution style)
8. Weakest Topics — ranked list with time-since-last-practice

```

---

### Screen 10: Profile and Settings

**Tabs:** Account | Study Preferences | Subjects | Notifications | Privacy | Accessibility

**Accessibility tab (critical for ExamEdge's audience):**
```

Display:

- Text size: 3 radio options (Default / Large / Extra Large)
- Dyslexia-friendly font: toggle (activates OpenDyslexic)
- High contrast mode: toggle
- Dark mode: toggle / system default / always dark / always light

Reading:

- Line spacing: normal / relaxed / double
- Text-to-speech for questions: toggle

Examination:

- Extra time: toggle (requires documentation — opens guidance modal)
- Font size during exam: independent setting from general setting

```

---

### Screen 11: Teacher Dashboard

**Overview cards:**
```

Classes managed: number + list
Students active today: count + sparkline
Upcoming examinations: list with dates
Average class readiness score: gauge
Marking appeals pending: number + [Review] button

```

**Student table:**
```

Columns: Name | Subject | Last Active | Sessions This Week | Avg Score | Readiness | Action
Actions: View Profile | Send Message | Assign Practice
Filterable by subject, class, last active
Sortable by all columns
Colour-coded readiness: red < 40%, amber 40-70%, teal > 70%

```

**Class performance:**
```

Mastery heatmap for entire class (topics × students)
Each cell: average mastery colour for that topic across all students
Immediately shows teacher which topics need more classroom time

```

---

## Gamification Design Specifications

**Study streak:**
```

Display: flame emoji + number + "day streak"
Location: dashboard quick stats, profile page, daily reminder notification
Streak freeze: 1 available per week (consumed automatically on missed day)
Milestone celebrations: 7-day, 30-day, 100-day animations

```

**Achievement badges:**
```

Badge design: hexagonal tiles, 48px, subject colour + icon
Categories: Consistency (streak-based) | Mastery (topic completion) | Excellence (score-based) |
Explorer (new subject) | Resilience (improvement after poor score)
Unlocked badge: full colour + glow
Locked badge: greyscale with padlock icon
Badge notification: toast appears bottom-right when unlocked

```

**Mastery milestones:**
```

Progress celebration when a topic moves from Developing → Proficient:
Subtle confetti burst (green particles, 0.5 seconds, reduced motion respected)
Toast: "Topic mastered: Integration by Parts ✓"
When entire subject reaches Proficient:
Larger celebration + achievement badge unlock

```

**Daily goal completion:**
```

Progress ring in dashboard fills as student completes planned sessions
At 100%: animation + "Daily goal complete!" message
Does not lock student out of additional study — just celebrates

```

---

## Empty States

Each empty state has: an illustration, a heading, a short description, and a CTA.

```

No sessions yet: student at starting line illustration + "Your journey starts here" + [Start First Session]
No results yet: empty chart illustration + "Complete a practice session to see your scores"
No subjects selected: blank subject grid + "Choose your subjects to get started"
No notifications: bell illustration + "You're all caught up"
Offline mode: cloud with disconnected plug + "You're offline — your session will sync when you reconnect"

```

---

## Loading States

```

Page load: skeleton screens (animated shimmer, --color-neutral-100 to --color-neutral-200)
Match shape of actual content: card skeletons, text line skeletons, avatar circles

AI response loading:
3 animated dots in teal (pulsing, not spinning)
Label: "ExamEdge AI is thinking..."
Typical wait: 1.5-3 seconds

Marking result loading:
"Marking your response..." with subtle teal progress bar
Do not show spinning — feels too generic for important moment

Exam submission processing:
Full-screen with animation — "Analysing your examination..."
Progress bar from 0 to 100% over 3-5 seconds
Cannot be cancelled or dismissed

```

---

## Error States

```

Network error toast (bottom-right, 4 second auto-dismiss):
Red left border, wifi-off icon, "Connection lost — working offline"

AI error (in tutor/marking):
Inline card with amber border
"ExamEdge AI couldn't process this right now. [Try again] or [Request manual review]"
Never block the student — always offer an alternative path

Form validation errors:
Appear below each field (not in an alert at top)
Red text, error icon, specific actionable message
Never: "An error occurred" — always: "Your password must be at least 8 characters"

Exam error (critical):
Full-screen overlay if exam data fails to save
"Your answers have been saved locally — do not close this tab"
Auto-retry every 30 seconds with countdown displayed

```

---

## Responsive Behaviour Rules

**Mobile (320px - 639px):**
- Bottom navigation (5 items max)
- No sidebar
- Cards full width
- 2-column subject grid
- Questions single column, answer input below
- Exam mode: full screen, large touch targets (min 48px)
- Mastery heatmap: horizontal scroll if topics > 8

**Tablet (640px - 1023px):**
- Top navigation with collapsed hamburger menu
- Cards in 2-column grid
- 3-column subject grid
- Practice mode: question left, feedback right (50/50)
- Mastery heatmap: full grid visible

**Desktop (1024px+):**
- Full sidebar (256px) + top bar
- Cards in 3-4 column grid
- 4-6 column subject grid
- All two-panel layouts enabled
- Analytics in 2-column layout
- Maximum content width: 1200px (centred with equal margins)

---

## Accessibility Specifications

```

Contrast ratios (WCAG AA minimum, AAA preferred):
Body text on white: 7:1 (AAA)
Primary teal on white: 4.7:1 (AA) — use --color-primary-700 for text
White on primary-600 button: 5.2:1 (AA)
All interactive elements: minimum 4.5:1

Keyboard navigation:
Focus ring: 3px solid --color-primary-500 with 2px offset (always visible, no hidden outlines)
Tab order: logical, matches visual order
All interactive elements reachable by keyboard
Escape key: closes modals, popovers, exam timer pauses

Screen reader:
ARIA roles on all navigation, landmark regions
All images have alt text or aria-hidden if decorative
Exam questions: aria-live region for answer feedback
Mathematical notation: MathML markup for screen reader compatibility

Touch:
Minimum touch target: 44×44px
Swipe gestures: swipe right to go back (mobile)
No double-tap required for any primary action

```

---

## Iconography

**Icon library:** Lucide Icons (open source, consistent stroke weight, MIT licence)

**Sizes:**
```

--icon-xs: 12px ← Inline badges
--icon-sm: 16px ← Label icons, navigation labels
--icon-md: 20px ← Default UI icons
--icon-lg: 24px ← Navigation, action buttons
--icon-xl: 32px ← Feature icons, empty states
--icon-2xl: 48px ← Illustration icons, subject icons

````

**Stroke weight:** 1.5px (default), 2px (emphasis)

**Subject icons:** Custom SVG set, each in subject colour, 48px, on rounded square background.

---

## Developer Handoff Token Format (CSS Custom Properties + Tailwind Config)

```css
:root {
  /* Brand */
  --examedge-primary: #1DA08C;
  --examedge-primary-dark: #0E5C4A;
  --examedge-secondary: #E2C04A;
  --examedge-navy: #0F172A;

  /* Semantic */
  --examedge-success: #22C55E;
  --examedge-warning: #F59E0B;
  --examedge-error: #EF4444;
  --examedge-info: #3B82F6;

  /* Typography */
  --examedge-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --examedge-font-display: 'Clash Display', 'Inter', sans-serif;
  --examedge-font-mono: 'JetBrains Mono', 'Courier New', monospace;

  /* Radius */
  --examedge-radius: 8px;
  --examedge-radius-lg: 12px;
  --examedge-radius-xl: 16px;

  /* Spacing base */
  --examedge-space-unit: 4px;
}
````

---

## Tailwind Config Extension for ExamEdge

```javascript
// tailwind.config.js extended values
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E6F4F1",
          100: "#C0E4DC",
          200: "#97D2C6",
          300: "#6BBFAF",
          400: "#46B09E",
          500: "#1DA08C",
          600: "#0E8A78",
          700: "#0E5C4A",
          800: "#0A3D31",
          900: "#051F19",
        },
        secondary: {
          500: "#E2C04A",
          600: "#C4A13A",
          700: "#9E7E28",
        },
        navy: { 900: "#0F172A", 800: "#1E293B", 700: "#334155" },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Clash Display", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        "primary-glow": "0 0 0 3px rgba(29, 160, 140, 0.25)",
        exam: "0 25px 50px rgba(15, 23, 42, 0.25)",
      },
    },
  },
};
```

---

## Final Design Directives

1. **Every interactive element minimum 44×44px touch target.** No exceptions on mobile.
2. **No unnecessary animations during examination mode.** Only the timer pulse at critical thresholds.
3. **The mastery heatmap is the visual centrepiece.** Its fill animation (when a topic improves) should feel satisfying and earned — 400ms ease-out colour transition.
4. **Mathematical notation must render at 16px minimum.** Never scale below this regardless of device.
5. **AI tutor messages always have a teal left border.** Students must always know when they are reading AI-generated content.
6. **Examination interface is always full-screen.** The browser chrome disappears. The only visible information is the question, the timer, and the navigation.
7. **The platform must function at 2G speeds.** All page-level interactions must work with cached content. No feature should block the student waiting for a server response.
8. **Dark mode must be complete, not an afterthought.** Every surface, every component, every colour token has a dark mode equivalent defined above.
9. **Offline state is a first-class state.** The interface should clearly communicate offline mode without making the student feel the platform has failed.
10. **Never show a raw error message to a student.** Every error state has a human-written explanation and an actionable next step.

---

_This prompt defines the complete design system for ExamEdge. Every colour, size, spacing value, and interaction pattern is specified. Generate the design components, screens, and mockups by applying this system exactly. Where specific values are provided, use them. Where a design decision is required that this prompt does not specify, default to the principle: what serves the student's focus and confidence in this moment?_

```

```
