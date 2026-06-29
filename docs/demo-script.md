# ExamEdge — 10-Minute Competition Demo Script

**Audience:** Judges, investors, technical reviewers  
**Duration:** 10 minutes maximum  
**Device:** Low-end Android phone or 360px browser viewport (preferred)  
**Prerequisite:** Demo account seeded with realistic mastery data (Unit 27)

---

## Pre-Demo Checklist

- [ ] Production or staging URL loads without errors
- [ ] Demo account credentials ready (do not use personal account)
- [ ] Pure Maths topic pool has validated questions (admin approved)
- [ ] Anthropic API key active — marking responds < 3s
- [ ] Admin account available for validation queue peek (final 30s)
- [ ] Internet connection stable (offline demo is Unit 23 — not this script)
- [ ] Browser notifications silenced; fullscreen permission granted for exam step

**Demo credentials (set in seed — replace before live demo):**

```
Student: demo@examedge.cm / [set in .env.demo]
Admin:   admin@examedge.cm / [set in .env.demo]
```

---

## Script

### 0:00 — Opening (30 seconds)

**Say:** "ExamEdge is an AI-powered examination preparation and personalized learning platform for secondary students across Africa — we launch with GCE in Cameroon and expand to WAEC, NECO, KCSE, and other national systems. It does not give answers — it marks like an examiner, guides with Socratic hints, and verifies understanding. Every student gets a different version of every question."

**Do:** Show landing page `/` — hero headline, three value props, CTA.

**Point out:** Mobile-first layout, offline-capable PWA, M1/A1/B1 marking — not a chatbot.

---

### 0:30 — Login (30 seconds)

**Do:** Click "Start preparing" → `/login` → enter demo student credentials → `/dashboard`

**Say:** "Registration takes under two minutes. Email auth for MVP — OAuth in V1.1."

---

### 1:00 — Dashboard (1 minute)

**Do:** Scroll dashboard slowly.

**Show:**
- Mastery map — red/amber/green topics across Pure Mathematics
- Study streak (e.g. 5 days)
- Exam readiness score ring
- "Continue studying" CTA

**Say:** "The mastery map uses IRT-based estimates updated after every answer. Streaks celebrate milestones, not guilt — one grace day per week for unpredictable schedules in Cameroon."

---

### 2:00 — Practice Session Start (1 minute)

**Do:** Tap Practice → Pure Mathematics → topic (e.g. Differentiation) → focus preparation prompt → dismiss → study session loads.

**Show:** Parameterised question rendered in KaTeX — not a static past paper question.

**Say:** "Question parameters are instantiated locally — no AI call at delivery time. Two students in the same classroom get different numbers, same method."

---

### 3:00 — Wrong Answer + Socratic Hint (1.5 minutes)

**Do:** Enter intentionally wrong working (e.g. wrong derivative) → Submit → see partial marks.

**Do:** Tap Hint → read guiding question aloud.

**Say:** "The hint is a question, never the answer. Anti-leakage checks run on every hint. Three levels — Haiku for L1-L2, Sonnet for L3."

**Do:** Show "Hints remaining: 2/3"

---

### 4:30 — Correct Answer + Marking (1.5 minutes)

**Do:** Correct the working → Submit → MarkingDisplay appears.

**Show:**
- Total marks: e.g. "5 / 6"
- M1 awarded (blue badge), A1 awarded, step feedback text
- If confidence < 0.70: "Under review" amber badge

**Say:** "Haiku marks with GCE Board Buea conventions — method marks even when the final answer is wrong. Low confidence routes to human review, never silent wrong marks."

---

### 6:00 — UVE Probe (1.5 minutes)

**Do:** Answer UVE probe modal — variant question with different parameters.

**Say:** "A correct answer is not the end. The Understanding Verification Engine checks genuine mastery. Copied ChatGPT answers fail the variant."

**Do:** Submit probe → brief acknowledgment.

---

### 7:30 — Exam Simulation (2 minutes)

**Do:** Navigate to Exam Simulation → select Pure Maths → fullscreen → timer starts.

**Do:** Answer 1–2 questions quickly → switch tab briefly → show pause overlay → return.

**Say:** "Fullscreen exam mode with tab-switch logging — honest about what we can and cannot prevent, but makes focus visible to the student."

**Do:** Submit paper → ExamReport with per-question M1/A1/B1 breakdown.

---

### 9:30 — Admin Validation Peek (30 seconds)

**Do:** Log out → log in as admin → `/admin/questions` → show pending question with cross-examination result.

**Say:** "No AI-generated question reaches students without human validation. Cross-examination catches mark scheme inconsistencies before admin review."

---

### 10:00 — Close (15 seconds)

**Say:** "ExamEdge: examiner-accurate marking, Socratic guidance, verified understanding — built for every GCE student in Cameroon regardless of income or location. Infrastructure under twenty dollars a month at pilot scale."

---

## Fallback Plans

| Problem | Fallback |
|---------|----------|
| Marking > 5s | Use pre-recorded screenshot; explain Haiku target < 3s |
| API key error | Switch to staging with pre-seeded marked response demo |
| Hint leakage (unlikely) | Skip hint; show marking only; note benchmark suite |
| No admin account | Skip admin peek; mention validation gate in closing |
| Offline request | Show OfflineBanner + queued answer if Unit 23 complete |

---

## Key Messages for Judges

1. **Not a chatbot** — refuses to give answers; develops understanding
2. **Examiner-accurate** — M1/A1/B1 partial credit, GCE Board Buea aligned
3. **Integrity by design** — parameterised questions + UVE, not surveillance
4. **Africa-first** — offline PWA, low-end Android, XAF-accessible cost model
5. **AI fails safely** — Zod validation, confidence scoring, human review gates

---

## After Demo

- [ ] Note any errors in Sentry
- [ ] Log open questions in `progress-tracker.md`
- [ ] Collect judge questions for Technical Interview Guide prep
