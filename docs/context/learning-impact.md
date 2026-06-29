# Learning Impact & Analytics — ExamEdge

**Canonical blueprint** for measuring educational outcomes, KPIs, analytics architecture, and explainability.

**Related:** `project-overview.md` (success criteria), `content-architecture.md` §6 (personalization), `ai-cost-and-exam-system.md` §10, `platform-how-it-works.md`.

---

## 1. Proof of Learning — Philosophy

ExamEdge does not optimize for **time-on-app** or **questions attempted**. It optimizes for **verified understanding** and **examination readiness**.

Primary evidence hierarchy:

1. **Mastery Validation Score (MVS)** — UVE probes verify understanding beyond correct answers
2. **IRT theta progression** — topic-level ability estimates over time
3. **Exam simulation performance** — board-realistic conditions
4. **External validation (pilot)** — comparison to teacher-marked work and mock exam scores

---

## 2. Educational KPI Framework

### 2.1 Student-Level KPIs

| KPI | Definition | Source | MVP |
|-----|------------|--------|-----|
| **Topic mastery level** | IRT theta 0–1 per topic | `mastery_records` | ✓ |
| **MVS (Mastery Validation Score)** | Rolling probe performance 0–1 | `mastery_records.mvs_history` | ✓ L1-L2 |
| **Time to mastery** | Days from first attempt to theta ≥ 0.70 | Computed from responses | ✓ |
| **Knowledge retention** | Theta decay / SM-2 review success | Spaced repetition cron | ✓ |
| **Exam readiness score** | Weighted sum of topic thetas × exam_weight | Dashboard aggregate | ✓ |
| **Hint dependency rate** | Hints used / questions attempted | `student_responses` | ✓ |
| **UVE pass rate** | Probes with understandingLevel ≥ 3 | `student_responses.uve_probes` | ✓ |
| **Exam simulation grade** | Mock paper % vs grade boundaries | Simulations | ✓ |
| **Focus quality** | Active time / total time ratio | Session metadata | ✓ Unit 26 |
| **Lesson completion** | Topics with explanation viewed + practice started | Events | ✓ V1.0 |

### 2.2 Cohort / Platform KPIs

| KPI | Definition | Phase |
|-----|------------|-------|
| **Pass rate delta (pilot)** | Mock exam scores week 1 vs week 4 | Pilot only — requires teacher partnership |
| **Marking agreement rate** | AI vs human mark alignment | Ongoing benchmark |
| **Topic coverage** | % syllabus topics with validated pool ≥50 | Content ops |
| **Pool hit rate** | Questions served without generation | Infra/cost |
| **Appeal rate** | Appeals / total responses | Quality signal |
| **30-day retention** | Students with ≥1 session in days 1–30 and 23–30 | Product |
| **Session completion rate** | Completed / started sessions | Engagement |

### 2.3 Impact Metrics (Grant / Competition Evidence)

| Metric | Target (pilot) | Measurement |
|--------|----------------|-------------|
| Topic mastery improvement | ≥15% theta increase in focus topics over 4 weeks | Pre/post per student |
| Mock exam improvement | ≥10 percentage points on simulation | Week 1 vs week 4 paper |
| Hint leakage violations | 0 | Automated test suite |
| Marking agreement | ≥92% | 100-question human comparison |
| Student self-efficacy survey | ≥7/10 "feel better prepared" | Optional pilot survey |

---

## 3. Analytics Architecture

### 3.1 Data Layers (No LLM for Dashboards)

```
Operational (real-time)
  → mastery_records, student_sessions, student_responses
  → Redis cache for dashboard aggregates (15min TTL)

Product analytics (event stream)
  → Plausible custom events OR analytics_events Postgres table ($0 mode)
  → Events: session_started, answer_submitted, hint_requested, exam_completed, topic_mastered

Impact analytics (batch)
  → Weekly cron: cohort aggregates
  → Haiku report_gen for student email narrative only — not per-page-view

Research export (anonymised)
  → V2.0: de-identified dataset for academic partnerships
```

### 3.2 Analytics Dashboard (By Role)

| Dashboard | MVP | V1.1 | V3.0 |
|-----------|-----|------|------|
| **Student** | Mastery map, readiness, streak, progress history | Focus analytics, predicted grade | Career pointers |
| **Teacher** | — | Class roster, topic gaps, AI confidence by topic | Assignment builder |
| **Parent** | — | V1.1 read-only child progress link | Weekly summary email |
| **Admin** | Validation queue, appeal queue | Cost + quality metrics | Ministry aggregates (anonymised) |

### 3.3 Learning Impact Measurement Framework

**Pilot protocol (20 students, 4 weeks):**

```
Week 0: Baseline simulation (untimed OK) + topic diagnostic
Weeks 1–3: Recommended 3×45min sessions/week (self-paced)
Week 4: Post simulation (same difficulty assembly) + survey
Analysis:
  - Paired theta change per topic
  - Simulation mark delta
  - Hint usage trend (should decrease on mastered topics)
  - UVE pass rate trend (should increase)
Publish: anonymised aggregate in grant/competition materials
```

---

## 4. Explainability Framework

### 4.1 What the System Explains (MVP)

| Question | Mechanism | LLM? |
|----------|-----------|------|
| Why marks were deducted | Marking chain step feedback (M1/A1/B1 per step) | Haiku (same marking call) |
| Why marks were awarded | Same — `awarded: true` steps with feedback | Haiku |
| Low confidence marking | UI: "Under review" if confidence < 0.70 | No extra call |
| Why topic recommended | Dashboard rationale string from pathway algorithm | No |
| Why readiness score changed | Delta breakdown by topic weight | No |
| Priority revision after exam | SQL aggregate → Haiku narrative (deferred) | Haiku async |

### 4.2 Explainability Principles

1. **Marking explanations use student language** — not "confidence score 0.72" but "Your method was correct (M1) but the final value was wrong (A1 not awarded)."
2. **Recommendations cite data** — "Integration is your weakest topic (42% accuracy over 8 attempts)."
3. **No black-box paths** — pathway algorithm is deterministic and documentable (`content-architecture.md` §6.2).
4. **Appeals show full audit** — question, answer, mark scheme, AI result, confidence (admin view).

### 4.3 Educational Reasoning Engine (V1.1+)

Structured post-session reflection (Haiku, once per session end):

```
Input: session stats (pre-aggregated, no PII in prompt)
Output: {
  summary: string,
  strengthObserved: string,
  gapIdentified: string,
  nextAction: string  // links to topicId
}
```

Cost: ~$0.0002/session — optional, not blocking.

---

## 5. Event Schema (Canonical)

Extend only via `project-overview.md` + this file:

| Event | Properties | Impact use |
|-------|------------|------------|
| `session_started` | mode, subjectId | Engagement |
| `answer_submitted` | topicId, marksRatio, hintsUsed | Mastery |
| `hint_requested` | hintLevel | Struggle signal |
| `exam_completed` | totalMarks, grade, focusBreaks | Readiness |
| `topic_mastered` | topicId, daysToMaster | Impact |
| `uve_completed` | understandingLevel | Verification |
| `offline_sync` | queueSize | Access equity |
| `appeal_submitted` | responseId | Quality |

---

## 6. Privacy & Minors

- Analytics use internal userId — never name/email in event payloads
- Cohort reports anonymised (minimum n=5 for any published slice)
- Parent dashboard (V1.1): read-only, consent-linked
- See `security.md` for consent and deletion

---

*Update when new KPIs, dashboards, or pilot protocols change.*
