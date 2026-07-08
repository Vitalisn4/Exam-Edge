# UI Context — ExamEdge

UI documentation is split for clarity. Read all referenced files before any UI work.

| File                           | Purpose                                                                   |
| ------------------------------ | ------------------------------------------------------------------------- |
| `design-brand-identity.md`     | Brand personality, tagline, Teal Forest philosophy, ten design directives |
| `ui-tokens.md`                 | Colors, typography, spacing, component token values (implementation SSOT) |
| `ui-rules.md`                  | Layout patterns, navigation, mastery heatmap, do-nots                     |
| `ui-registry.md`               | Living component registry — update after every component built            |
| `examedge-ui-mockup-prompt.md` | Complete mockup generation prompt for Figma AI, v0, Galileo, etc.         |

Read `design-brand-identity.md` + `ui-tokens.md` + `ui-rules.md` before any UI unit. Update `ui-registry.md` after shipping components.

**Quick reference:**

- **Tagline:** _Master Every Subject. Ace Every Examination._
- **Primary brand:** Teal Forest `#1DA08C` (interactive `#0E8A78`)
- **Secondary:** Ivory Parchment / achievement gold `#E2C04A`
- **Signature UI:** Mastery heatmap — teal gradient topic cells (32×32px)
- **Mobile-first:** 320–360px, min 15px body, 44px touch targets
- **Fonts:** Inter (UI), Clash Display (hero), JetBrains Mono (refs), KaTeX (math ≥16px)
- **Exam mode:** paper `#FFFEF7`, fullscreen, no nav, timer-only chrome
- **AI content:** teal left border on all tutor/hint/feedback panels
- **Mark badges:** M1 blue, A1 green, B1 purple, denied red (unchanged)
- **Dark mode:** tokens defined; full implementation V1.1 (`roadmap.md`)

**Migration:** Units 01–03 code may still use legacy Exam Blue `#1E40AF` until Unit 31 polish or design-system refresh — docs and mockups use Teal Forest.
