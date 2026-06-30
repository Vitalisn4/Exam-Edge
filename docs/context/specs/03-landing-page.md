# Unit 03: Landing Page UI

---

## Goal

Build the complete public landing page at `/` with mock content, mobile-first layout, and auth-aware CTAs. Authenticated visitors redirect to `/dashboard`.

---

## Design

Reference `ui-tokens.md` and `ui-rules.md`.

- Single column layout, 360px minimum width, no horizontal scroll
- Navbar: ExamEdge logo (text OK for MVP), "Log in" link, "Start preparing" primary button
- Hero: headline "Master your exams — understand, don't memorise"; subheadline on examiner-accurate marking + offline access for students across Africa (GCE Board Buea launch)
- Primary CTA → `/register`; secondary "See how it works" → scroll to features
- Features section: three cards with lucide icons (marking, hints, verification)
- How it works: 4 numbered steps (Register → Practice → Get marked → Verify mastery)
- Social proof placeholder: "Built for students across Africa — starting with GCE Board Buea" — no fake testimonials
- Bottom CTA repeats primary button
- Footer: Login, Privacy (stub `#`), Contact (stub `#`), "© ExamEdge 2026"

---

## Implementation

### Page Route

- `apps/web/app/page.tsx` — public, not behind auth middleware
- Server component where possible; client only for scroll-to-section if needed

### Components

- `components/landing/Hero.tsx`
- `components/landing/Features.tsx`
- `components/landing/HowItWorks.tsx`
- `components/layout/Footer.tsx` (shared with other public pages later)

Use shadcn Button, Card. All colors from CSS variables — no raw hex.

### Auth Redirect

- In page or middleware: if session exists, `redirect('/dashboard')`
- CTAs: unauthenticated → `/register` or `/login`

---

## Dependencies

Prior units:

- Unit 02 — Design system + UI tokens (Button, Card, tokens in globals.css)

No new packages required (lucide-react if not already installed with shadcn).

---

## Verify when done

- [x] Landing renders on 360px without horizontal scroll
- [x] All CTAs use ui-tokens.md classes
- [x] Authenticated user visiting `/` redirects to `/dashboard`
- [x] "See how it works" scrolls to features section
- [x] `npm run typecheck` passes
- [x] `npm run lint` passes
- [x] `ui-registry.md` updated with Hero, Features, HowItWorks, Footer

---

## Out of scope (this unit)

- Real testimonials or analytics events
- Privacy/Contact page content (stubs only)
- Teacher or admin landing variants
- i18n / French copy
