# Unit 07: Plausible Analytics Initialization

---

## Goal

Wire Plausible Analytics in the root layout and expose a `trackEvent` helper before any student-facing features emit events (Units 17+).

---

## Design

No visible UI. Verification via browser network tab (Plausible script load) or Plausible dashboard on staging.

---

## Implementation

### Environment

- Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to `.env.example` with placeholder `examedge.example.com`

### Root Layout Script

- `apps/web/app/layout.tsx` — add Plausible via `next/script`, `strategy="afterInteractive"`, `defer`
- Script src: `https://plausible.io/js/script.js` (or self-hosted URL if configured later)
- `data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}`

### Analytics Helper

- `apps/web/lib/analytics.ts`:
  - Global `Window.plausible` type declaration
  - `trackEvent(name: string, props?: Record<string, string | number>)` — no-op on SSR / when script missing

### Dev Verification Stub

- On `/dev/ui` or a one-line test in an existing dev page: call `trackEvent('session_started', { mode: 'dev' })` to confirm wiring
- Remove or guard stub behind `NODE_ENV === 'development'` if preferred

### Allowed Event Names

Must match `project-overview.md` exactly:

- `session_started`
- `answer_submitted`
- `hint_requested`
- `exam_completed`
- `topic_mastered`
- `offline_sync`
- `appeal_submitted`

---

## Dependencies

Prior units:

- Unit 01 — Monorepo + apps/web layout exists
- Unit 06 — Auth (optional for this unit; login events added in later units)

Environment:

- Plausible site/domain created (staging domain OK for development)

---

## Verify when done

- [ ] Pageviews appear in Plausible dashboard on staging/local
- [ ] `trackEvent` no-ops gracefully during SSR (no throw)
- [ ] Event names documented match project-overview.md
- [ ] No student email, name, or answer text in event props
- [ ] `npm run typecheck` passes
- [ ] `library-docs.md` Plausible section matches implementation

---

## Out of scope (this unit)

- Firing production events from session/marking flows (Units 17+)
- Self-hosted Plausible server setup (use plausible.io for MVP)
- PostHog, Google Analytics, or cookie consent banner
- Server-side Plausible API calls
