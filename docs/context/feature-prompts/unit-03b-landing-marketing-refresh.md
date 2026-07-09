# Unit 03b: Landing Page Marketing Refresh (Lovable Mockup)

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Implementation status

| Field      | Value                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------- |
| **Status** | **QA complete** — ready for PR merge on `feature/unit-03b-landing-marketing-refresh`              |
| **Spec**   | `docs/context/specs/03b-landing-marketing-refresh.md`                                             |
| **QA**     | Browser verified 2026-07-09: sections, dark mode, anchors, auth redirect; `build` + 11 tests pass |

---

## Feature overview

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| **Feature ID**    | Unit 03b                                     |
| **Feature name**  | Landing Page Marketing Refresh               |
| **Release**       | V1.0 MVP (marketing polish)                  |
| **Branch**        | `feature/unit-03b-landing-marketing-refresh` |
| **Prerequisites** | Unit 03 merged to `main`                     |
| **Blocks**        | None (parallel with 04–06)                   |

## Objective

Upgrade `/` from Unit 03 MVP to **full Lovable mockup parity**: Teal Forest design, dark + light mode, sticky marketing navbar, hero with mastery map preview, 6 features, examinations grid, 3-step flow, testimonials structure, pricing display, offline banner, multi-column footer.

## Problem statement

Unit 03 shipped a minimal mobile landing (3 features, Exam Blue, light-only). The Lovable mockup defines the production marketing experience students and investors expect. Without 03b, the product looks unfinished compared to design docs.

## User stories

- As a visitor, I see a polished marketing site matching the Teal Forest brand in dark or light mode.
- As a visitor, I can navigate via sticky header links to Features, Examinations, How it works, and Pricing.
- As a visitor on desktop, I see the mastery map preview and understand the product visually.
- As a student on 2G, I see offline capability called out before I register.

## Acceptance criteria

See `docs/context/specs/03b-landing-marketing-refresh.md` § Acceptance criteria.

**Summary:**

- [x] Full section order matches mockup (nav → footer)
- [x] Sticky navbar + anchor scroll (`scroll-mt-16`)
- [x] Dark and light mode with toggle
- [x] Teal Forest tokens (not Exam Blue)
- [x] No fake metrics or unverified testimonials
- [x] Auth redirect preserved

## Prerequisites and dependencies

- **Prior units:** 03 (merged)
- **Read:** `specs/03b-landing-marketing-refresh.md` (full mockup map + build order)
- **Design:** `design-brand-identity.md`, `ui-tokens.md`, `examedge-ui-mockup-prompt.md` Screen 1

## Internal documentation (read before coding)

- [ ] docs/context/specs/03b-landing-marketing-refresh.md
- [ ] docs/context/design-brand-identity.md
- [ ] docs/context/ui-tokens.md
- [ ] docs/context/ui-rules.md
- [ ] docs/context/examedge-ui-mockup-prompt.md (Screen 1)
- [ ] docs/context/student-journey.md §2.1
- [ ] docs/context/build-plan.md
- [ ] docs/context/ui-registry.md
- [ ] AGENTS.md
- [ ] .cursorrules

## External documentation

- **Next.js 16 App Router:** https://nextjs.org/docs
- **Tailwind CSS v4:** https://tailwindcss.com/docs/upgrade-guide
- **next-themes (if approved):** https://github.com/pacocoursey/next-themes
- **lucide-react:** https://lucide.dev/icons/

## Functional requirements

Follow **build order in spec** (5 phases). Key deliverables:

| Component                   | Path                                         |
| --------------------------- | -------------------------------------------- |
| MarketingNavbar             | `components/layout/MarketingNavbar.tsx`      |
| ThemeToggle + ThemeProvider | `components/layout/`                         |
| Hero + MasteryMapPreview    | `components/landing/`                        |
| Features (6 cards)          | `components/landing/Features.tsx`            |
| ExaminationsSection         | `components/landing/ExaminationsSection.tsx` |
| HowItWorks (3 steps)        | `components/landing/HowItWorks.tsx`          |
| TestimonialsSection         | `components/landing/TestimonialsSection.tsx` |
| PricingSection              | `components/landing/PricingSection.tsx`      |
| OfflineBanner + BottomCta   | `components/landing/`                        |
| MarketingFooter             | `components/layout/MarketingFooter.tsx`      |
| Curriculum data             | `constants/landing-curriculum.ts`            |

## Non-functional requirements

| Category        | Requirement                                                           |
| --------------- | --------------------------------------------------------------------- |
| Responsive      | 360px min; desktop `lg+` two-column hero                              |
| Accessibility   | 44px touch targets; theme toggle `aria-label`                         |
| Performance     | Server Components default; client only for theme/tabs                 |
| Content honesty | No fake "12,000+ students" or named testimonials without verification |

## Build phases (execute in order)

1. **Foundation** — Teal tokens, dark mode, sticky MarketingNavbar
2. **Hero** — gradient, pills, MasteryMapPreview, desktop layout
3. **Sections** — Features ×6, Examinations tabs, How it works ×3
4. **Conversion** — Testimonials, Pricing, Offline banner, Footer
5. **Polish** — fonts, analytics hooks, QA

## Unit testing

- [ ] `landing-curriculum.ts` — tab data shape validation (optional Zod)
- [ ] Theme persistence logic (if extracted to util)

## Browser validation (manual)

- [x] Dark mode all sections (mockup images 1–9) — verified 2026-07-09
- [x] Light mode initial load (mockup images 10–16) — verified 2026-07-09
- [x] Sticky nav + anchor scroll (`#pricing` lands below header) — verified
- [x] Board tab switch — client component + curriculum data (code + `ExaminationsSection` review)
- [x] 360px — responsive layout (`max-w-6xl`, single-col hero); no fixed widths > viewport in components
- [x] 1280px desktop two-column hero — verified in browser
- [x] Auth cookie → `/` redirects to `/dashboard` — verified in browser + 9 unit tests

## Documentation updates (after merge)

- [ ] `progress-tracker.md`
- [ ] `ui-registry.md`
- [ ] `build-plan.md` unit index

---

## Mandatory implementation process

1. Read `specs/03b-landing-marketing-refresh.md` in full.
2. Post **Context and Research Summary** before coding.
3. Branch `feature/unit-03b-landing-marketing-refresh`.
4. Implement **phase by phase** — merge or commit per phase.
5. Run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
6. Manual validation: dark/light toggle + 360px + 1280px.
7. PR to `main` with before/after screenshots in PR body.

## Definition of Done

- [x] Mockup section map complete (spec checklist)
- [x] Dark + light mode working
- [x] Unit 03 auth redirect unchanged
- [x] No AGENTS.md violations (no client AI, no fake validated content)
- [x] `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass

## Out of scope

- Stripe / payments (F-50)
- Real-time student count
- DB-driven curriculum
- Student dashboard navbar (Unit 15)
