# Unit 03: Landing Page UI

> **Copy this entire file into chat.** Post Context and Research Summary before writing any code.

## Implementation status

| Field       | Value                                                                                   |
| ----------- | --------------------------------------------------------------------------------------- |
| **Status**  | **IMPLEMENTED** — pending manual validation and merge on `feature/unit-03-landing-page` |
| **Commits** | `45a29b8` (landing UI), `8671d51` (spec alignment)                                      |
| **Tests**   | 10 passing (`session.test.ts`, `health/route.test.ts`)                                  |

---

## Feature overview

| Field             | Value                                   |
| ----------------- | --------------------------------------- |
| **Feature ID**    | Unit 03                                 |
| **Feature name**  | Landing Page UI                         |
| **Release**       | V1.0 MVP                                |
| **Branch**        | `feature/unit-03-landing-page`          |
| **Prerequisites** | Unit 02 merged to `main`                |
| **Blocks**        | Unit 06 (auth CTAs land on stub routes) |

## Objective

Public landing at `/` converts visitors with clear ExamEdge differentiation; authenticated sessions redirect to `/dashboard`. Static only — no API.

## Purpose and business objectives

Convert visitors into registered students. Communicates examiner marking, Socratic hints, and understanding verification — not a homework solver.

## User stories

- As a prospective student, I understand what ExamEdge does within 30 seconds.
- As a visitor, I can navigate to register or login.
- As an authenticated student visiting `/`, I am redirected to `/dashboard`.

## Acceptance criteria

- [x] Landing renders on 360px without horizontal scroll
- [x] All CTAs use token classes (no raw hex in `components/landing/`)
- [x] Authenticated user on `/` → redirect `/dashboard` (middleware + `session.ts`)
- [x] No API calls — static content only
- [x] `ui-registry.md` updated
- [x] "See how it works" scrolls to `#features` (`scroll-mt-14` on Features section)

## Prerequisites and dependencies

- **Prior units:** 01, 02
- **Spec:** `docs/context/specs/03-landing-page.md`

## Internal documentation (read before coding)

- [ ] docs/context/design-brand-identity.md
- [ ] docs/context/ui-tokens.md
- [ ] docs/context/ui-rules.md
- [ ] docs/context/specs/03-landing-page.md
- [ ] docs/context/ui-registry.md
- [ ] docs/context/student-journey.md §2.1
- [ ] docs/context/build-plan.md — Unit 03
- [ ] docs/context/tech-stack-versions.md
- [ ] docs/context/progress-tracker.md
- [ ] docs/context/code-standards.md
- [ ] .cursorrules

## External documentation

- **Next.js 16 App Router:** https://nextjs.org/docs
- **Next.js Middleware:** https://nextjs.org/docs/app/building-your-application/routing/middleware
- **Auth.js v5 (session cookies):** https://authjs.dev/getting-started/session-management
- **Tailwind CSS v4:** https://tailwindcss.com/docs/upgrade-guide
- **lucide-react:** https://lucide.dev/icons/

## Functional requirements

See `docs/context/build-plan.md` Unit 03 and `docs/context/specs/03-landing-page.md`.

### Page — `apps/web/app/page.tsx`

Renders `<LandingPage />` — public, not behind auth layout.

### Components

| Component   | Path                                 | Notes                           |
| ----------- | ------------------------------------ | ------------------------------- |
| LandingPage | `components/landing/LandingPage.tsx` | Composes all sections           |
| Navbar      | `components/layout/Navbar.tsx`       | Logo, Log in, Start preparing   |
| Hero        | `components/landing/Hero.tsx`        | Headline, subheadline, CTAs     |
| Features    | `components/landing/Features.tsx`    | 3 value props, `id="features"`  |
| HowItWorks  | `components/landing/HowItWorks.tsx`  | 4 steps                         |
| SocialProof | `components/landing/SocialProof.tsx` | GCE Board Buea placeholder      |
| BottomCta   | `components/landing/BottomCta.tsx`   | Start preparing                 |
| Footer      | `components/layout/Footer.tsx`       | Login, Privacy, Contact, © 2026 |

### Auth redirect

- `middleware.ts` — matcher `["/"]`; uses `shouldRedirectHomeToDashboard()`
- `lib/auth/session.ts` — detects Auth.js v5 session cookies (`authjs.session-token`, `__Secure-authjs.session-token`; Unit 06 will wire real auth)

### Stub routes (CTA targets)

- `/register`, `/login`, `/privacy`, `/contact` — placeholder pages until Unit 06
- `/dashboard` — stub until Unit 15

## Non-functional requirements

| Category      | Requirement                                                      |
| ------------- | ---------------------------------------------------------------- |
| Layout        | `max-w-lg mx-auto`, single column, 360px first                   |
| Accessibility | 44px touch targets (Button `min-h-11`), 16px body text           |
| Performance   | Server Components default; no client JS except none required     |
| Styling       | Semantic tokens only — `bg-primary`, `text-text-secondary`, etc. |

## Database / backend / AI

None — static landing + cookie check in middleware only.

## Unit testing

- `lib/auth/session.test.ts` — 9 tests for cookie detection and redirect logic

## Browser validation (manual)

- [ ] Unauthenticated: CTAs → `/register`, `/login`; scroll to features works
- [ ] Set `authjs.session-token` cookie → visit `/` → redirects to `/dashboard`
- [ ] 360px viewport — no horizontal scroll, no console errors

## Documentation updates (after merge)

- [ ] `progress-tracker.md` — mark Unit 03 complete, set Unit 04 as current goal
- [ ] `docs/context/specs/03-landing-page.md` — verify checklist (already complete)

---

## Mandatory implementation process

1. Read `docs/context/specs/03-landing-page.md` and internal docs above.
2. Post Context and Research Summary before coding.
3. Branch: `feature/unit-03-landing-page`.
4. Run: `npm run typecheck`, `npm run lint`, `npm run test`.
5. Manual 360px validation.
6. PR → merge → update `progress-tracker.md`.

---

## Definition of Done

- [x] Full landing visible without API
- [x] Auth redirect works (session cookie → `/dashboard`)
- [x] Spec verification checklist complete
- [x] §2d merge gate: typecheck, lint, test pass

## Out of scope

- Real testimonials, pricing, curriculum tabs
- Plausible events on landing (optional later)
- Full auth forms (Unit 06)
- Teal Forest rebrand (Unit 31 — uses Unit 02 Exam Blue tokens)

**Full Lovable mockup** (dark/light, 6 features, examinations grid, pricing, etc.) → **Unit 03b** — `docs/context/specs/03b-landing-marketing-refresh.md`
