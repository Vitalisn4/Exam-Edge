# Unit 23: Profile Page + Privacy Settings

---

## Goal

Profile settings, subject preferences, offline status, and MVP privacy controls per `security.md`.

---

## Design

- Sections: Account, Subjects, Offline, Privacy, Data, Deletion
- Footer: "Built for students across Africa — starting with GCE Buea"
- Confirm dialogs for destructive actions

---

## Implementation

- `app/(student)/profile/page.tsx`
- APIs: `GET/PATCH /api/students/me`, `POST .../data-export`, `POST .../delete`
- User fields: `consent_given_at`, `consent_type`, `deleted_at`
- Registration: under-16 consent checkbox (Unit 06 extension)

---

## Dependencies

- Unit 06 — Auth
- Unit 27 — offline queue for live sync status (stub OK in Unit 23)
- `security.md` — minors data requirements

---

## Verify when done

- [ ] Subject toggle persists
- [ ] Delete → logout, cannot re-login
- [ ] Export/deletion audit log entries

---

## Out of scope

- Automated data export email (V1.1)
- Full parental consent workflow (V1.1)
