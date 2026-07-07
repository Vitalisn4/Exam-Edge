# Design Brand Identity — ExamEdge

**Single source of truth for visual brand, personality, and design philosophy.** Implementation tokens live in `ui-tokens.md`. Screen-level specifications live in `examedge-ui-mockup-prompt.md`. Layout and component rules live in `ui-rules.md`.

Last updated: June 2026

---

## Brand

| Field            | Value                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Name**         | ExamEdge                                                                                        |
| **Tagline**      | _Master Every Subject. Ace Every Examination._                                                  |
| **Mission line** | _Learn deeply. Prepare confidently. Any exam. Any country._ (use in footer, about, pitch decks) |

---

## Personality

**Intelligent, calm, focused, trustworthy, quietly ambitious.** The brand does not shout. It earns confidence through precision and clarity — like a brilliant tutor who arrives early, sits beside you, never judges your mistakes, and genuinely wants you to succeed.

### Emotional targets

| Audience    | Should feel                                                    |
| ----------- | -------------------------------------------------------------- |
| **Student** | "I can succeed here. This platform was built for me."          |
| **Teacher** | "I can trust this. It gives me real insight into my students." |
| **Parent**  | "My child is in good hands."                                   |

---

## Design influences (synthesise — do not copy)

- Notion — spatial clarity and information hierarchy
- Linear — precision and typographic discipline
- Khan Academy — subject-level warmth and accessibility
- Duolingo — streak motivation without cartoon aggression
- Stripe Dashboard — data density done beautifully
- Apple HIG — respect for human attention
- Google Material 3 — adaptive colour and accessibility
- Coursera — professional credibility signals

---

## Signature visual element

The **mastery heatmap** — a grid of topic squares that fills with teal as a student progresses. It appears on the dashboard, subject overview, and progress page. It is the centrepiece of the platform's visual identity. Every colour decision should feel right when applied to this heatmap.

---

## Colour philosophy

| Palette                         | Role                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **Teal Forest** (primary)       | Knowledge, growth, trust, calm focus — deep forest canopy and still water        |
| **Ivory Parchment** (secondary) | Warmth, welcome, academic tradition — well-used textbooks and exam paper         |
| **Electric Cyan** (accent)      | Sparingly — AI tutor highlights, focused states, AI-generated content indicators |
| **Slate** (neutral)             | Structure, readability, dark-mode base (navy `#0F172A`)                          |

Full hex scales: `ui-tokens.md` · `examedge-ui-mockup-prompt.md`

---

## Typography

| Role               | Font                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------- |
| **UI & body**      | Inter (Google Fonts) — minimum 15px body on mobile                                           |
| **Display / hero** | Clash Display — hero sections and major headings only                                        |
| **Math & code**    | JetBrains Mono — exam reference numbers, code blocks; KaTeX for rendered math (16px minimum) |

---

## Ten design directives (non-negotiable)

1. Every interactive element **minimum 44×44px** touch target on mobile.
2. **No unnecessary animations during examination mode** — only timer pulse at critical thresholds.
3. **Mastery heatmap fill animation** — 400ms ease-out when a topic improves; satisfying and earned.
4. **Mathematical notation minimum 16px** — never scale below on any device.
5. **AI tutor messages** always have a **teal left border** — students must know when content is AI-generated.
6. **Examination interface is always full-screen** — browser chrome hidden; question, timer, navigation only.
7. **Platform must function at 2G speeds** — cached content; no feature blocks the student waiting on server.
8. **Dark mode is complete** when shipped (tokens defined now; MVP implements light mode first — see `roadmap.md` V1.1).
9. **Offline state is first-class** — clear communication without making the student feel the platform failed.
10. **Never show raw error messages** — human explanation + actionable next step always.

---

## Migration note (Unit 02 → Teal Forest)

Units 01–03 were implemented with **Exam Blue** (`#1E40AF`) as primary. The authoritative brand is now **Teal Forest** (`#1DA08C` / `#0E8A78`). Rebrand implementation:

- **Unit 31 (Pilot Hardening)** or dedicated **Unit 02 refresh** PR updates `globals.css` and all components to `ui-tokens.md` v2.
- Until rebrand lands in code, documentation and mockups use Teal Forest; `/dev/ui` may still show legacy blue.

---

## Related documents

| Document                       | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| `ui-tokens.md`                 | CSS variables, Tailwind mapping, component tokens |
| `ui-rules.md`                  | Layout, navigation, screen patterns               |
| `examedge-ui-mockup-prompt.md` | Full mockup generation prompt for AI design tools |
| `ui-registry.md`               | Component inventory                               |
| `build-plan.md`                | When each screen is built                         |
| `feature-prompts/`             | Copy-paste implementation prompts per unit        |
| `progress-tracker.md`          | Current implementation status                     |
