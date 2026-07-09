# Spec 03b — Landing Page Marketing Refresh (Lovable Mockup)

**Unit:** 03b (insert after Unit 03 merge, before or parallel with Unit 06)  
**Status:** Phase 1–4 implemented; QA complete 2026-07-09 on `feature/unit-03b-landing-marketing-refresh`  
**Branch:** `feature/unit-03b-landing-marketing-refresh`  
**Mockup source:** Lovable exports + `examedge-ui-mockup-prompt.md` Screen 1  
**Replaces/extends:** Unit 03 MVP landing (`specs/03-landing-page.md`)

---

## Goal

Bring the public landing page at `/` to **visual and structural parity** with the Lovable Teal Forest mockup (dark + light mode), while keeping MVP honesty rules (no fake metrics, no unverified testimonials).

Unit 03 delivered a **mobile-first MVP slice**. This unit delivers the **full marketing landing** students see in the design mockups.

---

## Relationship to other units

| Unit   | Relationship                                                                             |
| ------ | ---------------------------------------------------------------------------------------- |
| **03** | Base route, auth redirect, stub CTAs — **keep** middleware + session logic               |
| **02** | Extend `globals.css` with Teal Forest tokens (subset of full rebrand)                    |
| **15** | Landing `MasteryMapPreview` is a **static mock**; dashboard gets real `MasteryMap` later |
| **31** | Pilot hardening still owns production polish, hiding `/dev/*`, Sentry — not duplicate    |

**Do not wait for Unit 31** to ship the landing mockup — 03b is the dedicated landing refresh.

---

## Mockup → implementation map (top to bottom)

### 1. Marketing navbar (sticky — mockup image 9)

| Mockup                                               | Implementation                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------- |
| Logo + ExamEdge wordmark                             | `components/layout/MarketingNavbar.tsx`                                |
| Links: Features, Examinations, How it works, Pricing | Anchor links `#features`, `#examinations`, `#how-it-works`, `#pricing` |
| Theme toggle (sun/moon)                              | `components/layout/ThemeToggle.tsx` + `ThemeProvider`                  |
| Log in                                               | `/login`                                                               |
| Get started                                          | `/register`                                                            |

**Behavior:** `position: sticky; top: 0; z-index: 40`. Navbar stays fixed at top; **only `<main>` scrolls** (standard document scroll — no nested scroll container).

**Files to replace:** Refactor `Navbar.tsx` → marketing variant or split `MarketingNavbar` vs app `Navbar` (dashboard uses different nav in Unit 15).

---

### 2. Hero section (mockup images 1, 10)

| Mockup element                                          | Component               | Notes                                                                                    |
| ------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| Exam board pills (GCE A-Level, O-Level, BEPC/Bac, WAEC) | `HeroBoardPills.tsx`    | Static labels; no API                                                                    |
| Headline gradient text                                  | `Hero.tsx`              | Copy: _"Every Question Answered. Every Examination Conquered."_                          |
| Sub-headline                                            | `Hero.tsx`              | From mockup prompt Screen 1                                                              |
| CTAs                                                    | `Hero.tsx`              | Primary → `/register`; ghost → `#how-it-works`                                           |
| Social proof line                                       | `Hero.tsx`              | **"Join students preparing…"** — no fake "12,000+" until verified (see § Content policy) |
| Mastery map card (right on desktop)                     | `MasteryMapPreview.tsx` | Static demo data: Pure Maths, 72% ready, heatmap grid, streak/sessions/marks             |
| "Students studying now" badge                           | `LiveStudyBadge.tsx`    | Optional static demo; label as illustrative or omit until real analytics                 |

**Layout:**

- Mobile: single column (current `max-w-lg` OK)
- Desktop (`lg+`): two-column — copy left, mastery card right
- Background: dark navy + subtle teal radial gradient (dark mode); ivory/neutral-50 (light mode)

---

### 3. Features section (mockup images 2, 11)

| Mockup                                             | Component             |
| -------------------------------------------------- | --------------------- |
| Eyebrow: "BUILT FOR AFRICAN STUDENTS"              | `Features.tsx`        |
| Headline: "The tutor you deserve. In your pocket." | `Features.tsx`        |
| 6 feature cards                                    | `FeatureCard.tsx` × 6 |

**Six features** (from `examedge-ui-mockup-prompt.md`):

1. AI Tutor
2. Examiner-accurate marking
3. Personalised study plans
4. Exam simulation
5. Works offline
6. Know your level (mastery maps)

**Grid:** 1 col mobile · 2 col tablet · 3 col desktop.

---

### 4. Examinations / curriculum section (mockup images 3, 12)

| Mockup                          | Component                                                              |
| ------------------------------- | ---------------------------------------------------------------------- |
| "Designed for your examination" | `ExaminationsSection.tsx`                                              |
| Board tab pills                 | `BoardTabs.tsx` — GCE A-Level, GCE O-Level, BEPC/Bac, WAEC, NECO, KCSE |
| Subject cards grid              | `SubjectCard.tsx` — icon, name, topic count, level, checkmark          |

**Data:** Static JSON in `constants/landing-curriculum.ts` (no DB). Tab switch is client state only.

**Section id:** `id="examinations"` for nav anchor.

---

### 5. How it works (mockup images 4, 13)

| Mockup                 | Component                         |
| ---------------------- | --------------------------------- |
| 3 steps (not 4)        | `HowItWorks.tsx` (rewrite)        |
| Large 01/02/03 numbers | Step cards with pale teal numbers |

**Steps:**

1. Choose your subjects
2. Study with your AI tutor
3. Simulate your examination

**Section id:** `id="how-it-works"`.

---

### 6. Testimonials (mockup images 5, 14)

| Mockup                   | Component                 |
| ------------------------ | ------------------------- |
| Teal gradient background | `TestimonialsSection.tsx` |
| 3 quote cards            | `TestimonialCard.tsx`     |

**Content policy (mandatory):**

- **No fabricated names, schools, or quotes** in production without verification (`content-governance.md`).
- **Phase 1 (03b):** Use structure + placeholder copy: _"Student voices coming soon — pilot launching in Cameroon."_ OR anonymized pilot quotes with `verified: true` flag in constants.
- Lovable names (Akwi N., Fatimah O., etc.) are **design placeholders only** — do not ship as real testimonials.

---

### 7. Pricing (mockup images 6, 15)

| Mockup                          | Component                          |
| ------------------------------- | ---------------------------------- |
| 3 tiers: Free, Student, School  | `PricingSection.tsx`               |
| XAF amounts                     | Static — 2,500 / 25,000 per mockup |
| "Most popular" badge on Student | `PricingCard.tsx`                  |

**Logic:** Display only — CTAs → `/register` (payment is F-50, post-MVP).

**Section id:** `id="pricing"`.

---

### 8. Offline / 2G banner + bottom CTA (mockup images 7, 16)

| Mockup                            | Component                 |
| --------------------------------- | ------------------------- |
| "Built for 2G. Works everywhere." | `OfflineBanner.tsx`       |
| Dark hero CTA block               | `BottomCta.tsx` (rewrite) |
| "Start preparing free →"          | Link to `/register`       |

---

### 9. Footer (mockup images 8, 16)

| Mockup                                       | Component                             |
| -------------------------------------------- | ------------------------------------- |
| Logo + tagline                               | `MarketingFooter.tsx`                 |
| Columns: Product, Examinations, Company      | Multi-column footer                   |
| © ExamEdge 2026 · Made for Africa's students | `Footer.tsx` or `MarketingFooter.tsx` |

**Links:** Map to existing stubs (`/login`, `/privacy`, `/contact`) + placeholder `#` for dashboard/practice until those routes exist.

---

## Dark mode + light mode

| Mode      | Mockup images | CSS approach                                                       |
| --------- | ------------- | ------------------------------------------------------------------ |
| **Dark**  | 1–9           | `html.dark` or `[data-theme="dark"]` — navy surfaces, teal accents |
| **Light** | 10–16         | Default/light — ivory background, forest green buttons             |

**Implementation:**

1. Add Teal Forest + dark tokens to `globals.css` (from `ui-tokens.md` — subset needed for landing)
2. `ThemeProvider` client wrapper in `app/layout.tsx` or landing layout
3. `ThemeToggle` persists preference in `localStorage`; respect `prefers-color-scheme` on first visit
4. **Package:** `next-themes` recommended — **ask before adding** per AGENTS.md; alternative: manual `classList` toggle without new dependency

**Every landing component** must use semantic tokens (`bg-surface`, `text-text-primary`, `--dark-*` variants) — no hardcoded light-only colors.

---

## Responsive breakpoints

| Breakpoint    | Layout change                                                         |
| ------------- | --------------------------------------------------------------------- |
| 360px (min)   | Single column, no horizontal scroll                                   |
| `md` (768px)  | 2-col features, 2-col subject grid                                    |
| `lg` (1024px) | Hero 2-col, 3-col features, full footer columns                       |
| `max-w-7xl`   | Marketing pages use full width (remove `max-w-lg` wrapper on landing) |

Unit 03 used `max-w-lg` for mobile MVP — **03b removes that constraint** on the marketing landing.

---

## File structure (target)

```
apps/web/
├── app/
│   ├── layout.tsx              # ThemeProvider wrapper
│   └── page.tsx                # LandingPage (unchanged entry)
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx     # Recompose all sections
│   │   ├── Hero.tsx
│   │   ├── HeroBoardPills.tsx
│   │   ├── Features.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── ExaminationsSection.tsx
│   │   ├── BoardTabs.tsx
│   │   ├── SubjectCard.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── PricingSection.tsx
│   │   ├── PricingCard.tsx
│   │   ├── OfflineBanner.tsx
│   │   ├── BottomCta.tsx
│   │   ├── MasteryMapPreview.tsx
│   │   └── LiveStudyBadge.tsx      # optional
│   └── layout/
│       ├── MarketingNavbar.tsx
│       ├── MarketingFooter.tsx
│       ├── ThemeToggle.tsx
│       └── ThemeProvider.tsx
├── constants/
│   └── landing-curriculum.ts   # Board tabs + subjects static data
└── app/globals.css             # Teal Forest + dark mode tokens
```

---

## Build order (recommended phases)

Execute in order — each phase is mergeable and testable.

### Phase 1 — Foundation (≈ 1 PR)

- [x] Teal Forest tokens in `globals.css` (landing subset)
- [x] Dark mode CSS variables + `ThemeProvider` + `ThemeToggle`
- [x] `MarketingNavbar` (sticky, anchor links, theme toggle)
- [x] Remove `max-w-lg` shell; add responsive page container (`max-w-7xl`)
- [x] Manual: sticky nav + scroll anchors at 360px and 1280px

### Phase 2 — Hero + signature widget (≈ 1 PR)

- [x] Rewrite `Hero.tsx` (copy, pills, gradient background)
- [x] `MasteryMapPreview.tsx` (static heatmap — reuse `--mastery-*` tokens)
- [x] Desktop two-column hero layout
- [x] `BottomCta` in Phase 4

### Phase 3 — Content sections (≈ 1 PR)

- [x] `Features.tsx` — 6 cards
- [x] `ExaminationsSection.tsx` + `landing-curriculum.ts`
- [x] `HowItWorks.tsx` — 3 steps

### Phase 4 — Trust + conversion (≈ 1 PR)

- [x] `TestimonialsSection.tsx` (structure + policy-compliant copy)
- [x] `PricingSection.tsx` (display-only)
- [x] `OfflineBanner.tsx` + rewrite `BottomCta.tsx`
- [x] `MarketingFooter.tsx`

### Phase 5 — Polish (≈ 1 PR)

- [x] Clash Display for hero (Fontshare in `layout.tsx`)
- [x] Plausible events on CTA clicks (`register_cta_clicked` via `RegisterCtaLink`)
- [x] `ui-registry.md` + `progress-tracker.md` update
- [x] Manual dark/light toggle QA on all sections
- [x] Lighthouse pass on `/` (mobile) — prod build 2026-07-09: Perf 88, A11y 92, BP 96, SEO 100 (LCP 3.0s)

**Total estimate:** 4–5 PRs or 1 large PR if solo dev prefers single merge.

---

## Acceptance criteria

- [x] Landing matches mockup section order: Nav → Hero → Features → Examinations → How it works → Testimonials → Pricing → Offline banner → Bottom CTA → Footer
- [x] Sticky navbar remains visible while scrolling; anchor links scroll to correct sections (`scroll-mt-16`)
- [x] Dark mode: matches mockup images 1–9 (navy/teal palette)
- [x] Light mode: matches mockup images 10–16 (ivory/forest green)
- [x] Theme toggle persists across reload (`localStorage` via `ThemeProvider`)
- [x] 360px: responsive single-column layout; 1280px: desktop two-column hero verified
- [x] All CTAs use token classes — no raw hex in components
- [x] Auth redirect on `/` still works (Unit 03 middleware)
- [x] No fake student counts or unverified testimonials in production copy
- [x] `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass

---

## Out of scope (03b)

- Real payment / Stripe (F-50)
- Live "students studying now" count (needs analytics backend)
- Subject catalog from database (static JSON only)
- French i18n (F-38)
- Dashboard/app navbar (Unit 15)
- Full-app Teal rebrand of student screens (still Unit 31 for non-landing routes if not done in 03b)

---

## Verification checklist (manual)

- [x] Toggle dark → light — dark mode verified; light on initial load
- [x] Click Pricing nav link; section scrolls into view below sticky header
- [x] Board tabs — client state in `ExaminationsSection.tsx` + `landing-curriculum.ts`
- [x] Mastery map preview renders teal heatmap cells
- [x] Pricing CTAs go to `/register`
- [x] Set `authjs.session-token` cookie → `/` redirects to `/dashboard`

---

## Documentation updates after merge

- [x] `progress-tracker.md` — Unit 03b QA complete (pre-merge)
- [x] `ui-registry.md` — all new components + page composition
- [ ] `specs/03-landing-page.md` — add note "superseded by 03b for visual spec"
- [ ] `build-plan.md` — unit index row for 03b (on merge)
