# Unit 22: Marking Appeals Flow

---

## Goal

Students can dispute AI marks; appeals tracked with audit trail.

---

## Design

- "Disagree with this mark?" on MarkingDisplay
- Modal: reason (min 20 chars), submit, confirmation
- Progress page: pending/resolved badges

---

## Implementation

- `POST /api/appeals`, `GET /api/appeals`
- `marking_appeals` table + repository
- `AppealModal.tsx`, `AppealsList.tsx`
- Plausible: `appeal_submitted`
- Audit log on submit

---

## Dependencies

- Unit 17 — responses with marking results
- Unit 21 — progress page appeals section
- `security.md` — audit logging

---

## Verify when done

- [ ] Own response only → 403 for others
- [ ] Duplicate appeal → 409
- [ ] Event fires

---

## Out of scope

- Full admin appeal resolution UI (manual MVP; Unit 29 audit)
