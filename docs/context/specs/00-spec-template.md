# Unit NN: [Feature Name]

> Copy this file to `NN-short-name.md` before implementing. Fill every section. Do not leave placeholders in the final spec.

---

## Goal

One or two sentences describing the concrete output when this unit is complete. Be specific.

_Bad:_ "Create the auth pages."

_Good:_ "Create email/password login and register pages with Auth.js v5, middleware protecting `(student)/*`, redirect to `/dashboard` after login."

---

## Design

Visual and structural decisions for this unit. Reference `ui-tokens.md` and `ui-rules.md`.

- Layout structure (mobile 360px first)
- Component choices (which shadcn primitives)
- Responsive behaviour
- Empty/loading/error states
- Token classes to use (no raw hex)

---

## Implementation

Break into sub-sections — one per component or system boundary.

### [Sub-section 1 — e.g. Login Page UI]

Detailed description of what to build.

### [Sub-section 2 — e.g. Auth.js Config]

Detailed description.

### [Sub-section 3 — e.g. Middleware]

Detailed description.

---

## Dependencies

Packages to install in this unit (if not already present):

- `package-name` — reason

Environment variables required:

- `VAR_NAME` — purpose

Prior units that must be complete:

- Unit NN — [name]

---

## Verify when done

- [ ] Specific condition one
- [ ] Specific condition two
- [ ] Renders correctly on 360px viewport (if UI)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] No console errors in browser
- [ ] `ui-registry.md` updated with new components (if UI)

---

## Out of scope (this unit)

Explicitly list what NOT to build in this unit:

- 
