# Unit 20: Curriculum Explain UI

---

## Goal

Student-facing topic explanations wired to the curriculum intelligence chain (Unit 14) with permanent caching.

---

## Design

- "Learn this topic" entry point on practice grid and study session header
- Four-part layout: Definition, Worked example, Common mistakes, Practice pointer
- Loading skeleton; "Content unavailable" if no syllabus chunk
- Source note: "Based on official syllabus"

---

## Implementation

- Route: `/study/[topicId]/learn` or slide-over panel
- API: `GET /api/topics/:id/explain` — cache-first, then chain
- Component: `TopicExplainPanel.tsx`

---

## Dependencies

- Unit 14 — Curriculum chain
- Unit 05 — syllabus_chunks + topic_explanations tables
- Unit 17 — study session shell

---

## Verify when done

- [ ] Cache hit on second visit (no LLM)
- [ ] No syllabus → safe error, no hallucination
- [ ] ui-registry.md updated

---

## Out of scope

- Multi-language explanations (V1.1)
- Non-GCE syllabus content (V2.0 boards)
