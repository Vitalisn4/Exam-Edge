# UI Registry — ExamEdge

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

Last updated: July 2026 | Unit 03b landing marketing refresh

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes and structure
3. If no — build following ui-rules.md and ui-tokens.md, then add entry here

After building any component — update this file with: component name, file path, key props, and primary Tailwind classes used.

---

## Layout Components

| Component       | Path                                    | Notes                                                                                               |
| --------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| MarketingNavbar | `components/layout/MarketingNavbar.tsx` | Sticky `top-0 z-30`, anchors `#features` `#boards` `#how` `#pricing`, theme toggle, `/register` CTA |
| MarketingFooter | `components/layout/MarketingFooter.tsx` | 3-column footer: brand, Examinations, Company + © 2026                                              |
| ExamEdgeLogo    | `components/layout/ExamEdgeLogo.tsx`    | BookOpen mark + Clash Display wordmark                                                              |
| ThemeProvider   | `components/layout/ThemeProvider.tsx`   | Light/dark context, `localStorage` + `prefers-color-scheme`                                         |
| ThemeToggle     | `components/layout/ThemeToggle.tsx`     | Sun/moon toggle, `aria-label`, 44px target                                                          |
| Navbar          | `components/layout/Navbar.tsx`          | _Legacy Unit 03 — not used on landing_                                                              |
| Footer          | `components/layout/Footer.tsx`          | _Legacy Unit 03 — superseded by MarketingFooter on landing_                                         |

---

## Landing Components (Unit 03 + 03b)

| Component           | Path                                         | Notes                                                                     |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------------------- |
| LandingPage         | `components/landing/LandingPage.tsx`         | Server component; composes all sections; data from `getLandingPageData()` |
| Hero                | `components/landing/Hero.tsx`                | Navy band, board pills, 4-line headline, CTAs → `/register` + `#how`      |
| MasteryMapPreview   | `components/landing/MasteryMapPreview.tsx`   | Hero widget: heatmap, Preview badge, honest `—` stats when not live       |
| MasteryHeatmap      | `components/landing/MasteryHeatmap.tsx`      | Ported from `exam-edge-path`; `--mastery-*` cell colours                  |
| Features            | `components/landing/Features.tsx`            | 6 cards, `id="features"` `scroll-mt-16`, eyebrow + headline               |
| FeatureCard         | `components/landing/FeatureCard.tsx`         | Icon tile + title + description; used by Features                         |
| ExaminationsSection | `components/landing/ExaminationsSection.tsx` | Client tabs for boards; `id="boards"`; subject grid from curriculum       |
| HowItWorks          | `components/landing/HowItWorks.tsx`          | 3 steps (01–03), `id="how"`                                               |
| TestimonialsSection | `components/landing/TestimonialsSection.tsx` | Teal gradient band; empty placeholder cards when no verified quotes       |
| PricingSection      | `components/landing/PricingSection.tsx`      | 3 tiers (Free / Student / School), `id="pricing"`, CTAs → `/register`     |
| OfflineBanner       | `components/landing/OfflineBanner.tsx`       | 2G / offline strip with WifiOff + ShieldCheck                             |
| BottomCta           | `components/landing/BottomCta.tsx`           | Navy CTA band via `landing-hero-band`                                     |
| RegisterCtaLink     | `components/landing/RegisterCtaLink.tsx`     | Client Link → `/register` + `register_cta_clicked` Plausible event        |
| PlausibleScript     | `components/layout/PlausibleScript.tsx`      | Loads Plausible when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set                |

### Landing data

| Module                        | Path                              | Notes                                     |
| ----------------------------- | --------------------------------- | ----------------------------------------- |
| getLandingPageData            | `lib/landing/get-landing-data.ts` | Entry point; honest nulls until analytics |
| trackEvent / trackRegisterCta | `lib/analytics.ts`                | Plausible wrapper (Unit 07 foundation)    |
| landing-content               | `constants/landing-content.ts`    | Features, steps, pricing, hero pills      |
| landing-curriculum            | `constants/landing-curriculum.ts` | Board tabs + subjects by board            |
| landing-fixtures              | `constants/landing-fixtures.ts`   | Preview heatmap topic levels              |
| landing types                 | `types/landing.ts`                | `LandingPageData`, `VerifiedTestimonial`  |

---

## Progress Components (Units 21–22)

| Component          | Path                                         | Notes       |
| ------------------ | -------------------------------------------- | ----------- |
| ProgressSummary    | `components/progress/ProgressSummary.tsx`    | _Not built_ |
| SessionHistoryList | `components/progress/SessionHistoryList.tsx` | _Not built_ |
| AppealsList        | `components/progress/AppealsList.tsx`        | _Not built_ |
| AppealModal        | `components/assessment/AppealModal.tsx`      | _Not built_ |

## Profile Components (Unit 23)

| Component          | Path                                        | Notes       |
| ------------------ | ------------------------------------------- | ----------- |
| ProfileSettings    | `components/profile/ProfileSettings.tsx`    | _Not built_ |
| SubjectPreferences | `components/profile/SubjectPreferences.tsx` | _Not built_ |
| PrivacyControls    | `components/profile/PrivacyControls.tsx`    | _Not built_ |

## Curriculum Components (Unit 20)

| Component         | Path                                          | Notes       |
| ----------------- | --------------------------------------------- | ----------- |
| TopicExplainPanel | `components/curriculum/TopicExplainPanel.tsx` | _Not built_ |

---

## Math Components

| Component   | Path                              | Notes                                         |
| ----------- | --------------------------------- | --------------------------------------------- |
| MathDisplay | `components/math/MathDisplay.tsx` | KaTeX wrapper, error boundary, `trust: false` |
| MathInput   | `components/math/MathInput.tsx`   | MathQuill WYSIWYG, client-only, `ssr: false`  |

---

## Assessment Components

| Component      | Path                                       | Notes       |
| -------------- | ------------------------------------------ | ----------- |
| QuestionCard   | `components/assessment/QuestionCard.tsx`   | _Not built_ |
| MarkingDisplay | `components/assessment/MarkingDisplay.tsx` | _Not built_ |
| HintPanel      | `components/assessment/HintPanel.tsx`      | _Not built_ |
| UVEProbeModal  | `components/assessment/UVEProbeModal.tsx`  | _Not built_ |
| PhotoUpload    | `components/assessment/PhotoUpload.tsx`    | _Not built_ |

---

## Progress Components

| Component      | Path                                     | Notes       |
| -------------- | ---------------------------------------- | ----------- |
| MasteryMap     | `components/progress/MasteryMap.tsx`     | _Not built_ |
| TopicBadge     | `components/progress/TopicBadge.tsx`     | _Not built_ |
| StreakDisplay  | `components/progress/StreakDisplay.tsx`  | _Not built_ |
| ReadinessScore | `components/progress/ReadinessScore.tsx` | _Not built_ |

---

## Exam Components

| Component     | Path                                | Notes       |
| ------------- | ----------------------------------- | ----------- |
| ExamTimer     | `components/exam/ExamTimer.tsx`     | _Not built_ |
| ExamReport    | `components/exam/ExamReport.tsx`    | _Not built_ |
| FocusBreakLog | `components/exam/FocusBreakLog.tsx` | _Not built_ |

---

## UI Primitives (shadcn)

Installed Unit 02 — themed with Teal Forest tokens from `globals.css`.

| Component | Path                         | Variants / notes                                                                 |
| --------- | ---------------------------- | -------------------------------------------------------------------------------- |
| Button    | `components/ui/button.tsx`   | `default`, `secondary`, `hint`, `destructive`, `ghost`, `link` — min-h-11 (44px) |
| Input     | `components/ui/input.tsx`    | min-h-11, 16px text, focus ring                                                  |
| Card      | `components/ui/card.tsx`     | Header, Title, Description, Content, Footer                                      |
| Badge     | `components/ui/badge.tsx`    | mastery + mark type variants                                                     |
| Dialog    | `components/ui/dialog.tsx`   | Radix dialog, mobile-friendly width                                              |
| Skeleton  | `components/ui/skeleton.tsx` | Pulse loader                                                                     |
| Toast     | `components/ui/toast.tsx`    | Sonner Toaster + `toast()` helper                                                |

**Dev preview:** `app/dev/ui/page.tsx` — all tokens and primitives (not in production nav).

**Utilities:** `lib/utils.ts` — `cn()` for class merging.

---

## Page Compositions

| Page            | Path                                         | Key Components Used                                                                                                                                                 |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing         | `app/page.tsx`                               | MarketingNavbar, Hero, MasteryMapPreview, Features, ExaminationsSection, HowItWorks, TestimonialsSection, PricingSection, OfflineBanner, BottomCta, MarketingFooter |
| Math Dev        | `app/dev/math/page.tsx`                      | MathPlayground, MathDisplay, MathInput                                                                                                                              |
| Dashboard       | `app/(student)/dashboard/page.tsx`           | _Stub — Unit 15_                                                                                                                                                    |
| Study Session   | `app/(student)/study/[topicId]/page.tsx`     | _Not built_                                                                                                                                                         |
| Exam Simulation | `app/(student)/exam/[simulationId]/page.tsx` | _Not built_                                                                                                                                                         |
| Admin Queue     | `app/(admin)/questions/page.tsx`             | _Not built_                                                                                                                                                         |
