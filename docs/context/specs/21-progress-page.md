# Unit 21: Progress Page + Session History

---

## Goal

Full `/progress` page with session history, aggregate stats, and appeals list shell.

---

## Design

- Summary cards: sessions, hours, topics, streak
- Scrollable session history with expandable detail
- Appeals subsection (populated by Unit 22)
- Focus analytics placeholder (populated by Unit 26)

---

## Implementation

- `app/(student)/progress/page.tsx` — Server Component
- `sessionsRepository.getHistory(userId)`
- Components: `ProgressSummary`, `SessionHistoryList`

---

## Dependencies

- Unit 19 — dashboard real data patterns
- Unit 17 — sessions exist in DB

---

## Verify when done

- [ ] History after 3 sessions
- [ ] 360px mobile layout
- [ ] Empty state for new users

---

## Out of scope

- Focus analytics charts (Unit 26)
- Export progress PDF (V1.1)
