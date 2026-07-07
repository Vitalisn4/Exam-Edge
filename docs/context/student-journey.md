# Student Journey — ExamEdge

**Canonical blueprint** for onboarding, privacy trust, focus & engagement, deep mastery preparation, and long-term student empowerment.

**Related:** `project-overview.md` (flows), `security.md` (implementation), `platform-how-it-works.md` (pedagogy), `platform-ecosystem-ops.md` (engagement ethics), `learning-impact.md` (KPIs), `content-architecture.md` (pathways), `roadmap.md`.

---

## 1. Design Philosophy

ExamEdge treats the student journey as a **progressive reveal** — not a feature dump.

| Principle               | Implementation                                                             |
| ----------------------- | -------------------------------------------------------------------------- |
| **Welcome first**       | Landing page explains _why_ before _how_                                   |
| **One goal at a time**  | First session = one topic, one question, one mark                          |
| **Personalize early**   | Level, subjects, learning mode captured at registration                    |
| **Prove value fast**    | First marking + feedback within 5 minutes of register                      |
| **Deep over fast**      | Understanding verification before mastery credit                           |
| **Focus by design**     | No infinite feeds, no social noise, no answer vending                      |
| **Trust transparently** | Privacy and data use explained in plain language                           |
| **Vision beyond exams** | A-Level students see pathways to university and global opportunity (V2.0+) |

**Tagline for onboarding:** _Master Every Subject. Ace Every Examination._

---

## 2. Onboarding Experience (End-to-End)

### 2.1 Stage 0 — First Arrival (Landing Page)

**Route:** `/`  
**Goal:** Student understands purpose in 30 seconds; feels invited, not sold to.

| Element               | Content                                                                                    | Why              |
| --------------------- | ------------------------------------------------------------------------------------------ | ---------------- |
| Hero headline         | Exam preparation that **marks like your examiner** — not a homework solver                 | Sets expectation |
| Subheadline           | Pan-African platform; launching with GCE Board Buea                                        | Honest scope     |
| Three value props     | M1/A1/B1 marking · Socratic hints (never answers) · Works offline                          | Differentiation  |
| Social proof (pilot+) | "Join students preparing for national exams across Africa — starting with GCE in Cameroon" | Belonging        |
| Primary CTA           | **Start preparing free** → `/register`                                                     | Low friction     |
| Secondary CTA         | Log in                                                                                     | Returning users  |

**Progressive disclosure:** No feature matrix, no pricing tables, no subject catalog on landing — details come after commitment.

**Authenticated visitor:** Redirect to `/dashboard` (no re-onboarding).

---

### 2.2 Stage 1 — Registration (Under 2 Minutes)

**Route:** `/register`  
**Goal:** Collect minimum data for personalization; establish trust.

#### Step A — Account (single screen, MVP)

| Field                     | Required    | Purpose                                           |
| ------------------------- | ----------- | ------------------------------------------------- |
| First name                | Yes         | Personal greeting only — **never sent to AI**     |
| Email                     | Yes         | Auth + weekly report                              |
| Password + confirm        | Yes         | bcrypt factor 12                                  |
| Examination level         | Yes         | O-Level or A-Level                                |
| Subject selection         | Yes         | Pure Maths, Physics, Biology (MVP) — multi-select |
| Learning mode             | Yes         | Primary / Supplementary / Exam focus              |
| Date of birth             | Optional    | Triggers parental consent if under 16             |
| Parental consent checkbox | If under 16 | Legal + trust                                     |

Stored in `users.preferences` JSONB:

```typescript
{
  level: "OL" | "AL",
  subjects: string[],
  learningMode: "primary" | "supplementary" | "exam_focus",
  onboardingCompleted: false,
  firstSessionCompleted: false
}
```

#### Step B — Privacy trust moment (inline, not legalese wall)

Short copy above submit:

> Your answers are marked by AI to help you learn — not to sell your data. We never put your name in AI prompts. You can export or delete your account anytime. [Privacy summary →]

Link to privacy policy (required before public launch — `content-governance.md`).

**Post-submit:** Auto-login → `/dashboard` with `onboardingCompleted: false` until first session done.

---

### 2.3 Stage 2 — Welcome Dashboard (First Visit)

**Route:** `/dashboard`  
**Goal:** Orient without overwhelm — **one primary CTA**.

| Element         | First-visit behaviour                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| Greeting        | "Welcome, {firstName}. Let's prepare for your {level} exams."                        |
| Mastery map     | All topics **red** (not started) — honest empty state                                |
| Exam countdown  | If exam date set in profile (optional V1.1); else "Set your exam date" gentle prompt |
| Readiness score | Hidden or "Complete your first session to see readiness"                             |
| Streak          | "Start your streak today" — not guilt                                                |
| **Primary CTA** | **Start your first practice session** (pulsing, single action)                       |
| Nav tabs        | Visible but secondary — Practice, Progress, Profile                                  |

**Not shown on first visit:** Exam simulation CTA, admin features, advanced analytics, full topic tree essay.

**Learning mode adaptation:**

| Mode          | First-visit message                                        |
| ------------- | ---------------------------------------------------------- |
| Primary       | "We'll guide you topic by topic from the syllabus."        |
| Supplementary | "Pick a topic you're studying in school to practice here." |
| Exam focus    | "When you're ready, we'll run timed exam simulations."     |

---

### 2.4 Stage 3 — First Practice Session (First Win)

**Route:** `/practice/[subjectId]` → `/study/[topicId]`  
**Goal:** Productive struggle → examiner feedback → confidence in <10 minutes.

```
1. Practice → Pure Mathematics (pre-selected from registration)
2. Topic grid — recommend ONE topic with badge "Start here" (lowest prerequisite, high exam_weight)
3. Optional: "Learn this topic first" link (not forced for supplementary mode)
4. Focus preparation prompt (Unit 26):
   "Put your phone face-down. Close other tabs. Next 20 minutes — just you and the question."
5. One parameterised question — KaTeX rendered
6. Student attempts answer (MathInput or text)
7. Submit → M1/A1/B1 marking (<3s)
8. MarkingDisplay — step feedback in plain language
9. If wrong: offer ONE hint (explain hints never give answers)
10. UVE L1 probe (short) — "Same method, different numbers"
11. End session → celebration: "First session complete. Your mastery map is updating."
12. Set preferences.onboardingCompleted = true; firstSessionCompleted = true
```

**Micro-tutorial (first session only):**

- Tooltip on MathInput: "Type your working here"
- Tooltip on marks: "M1 = method mark, A1 = accuracy mark"
- Dismiss forever after first session

---

### 2.5 Stage 4 — Progressive Feature Unlock (Days 1–14)

Features revealed as student earns them — **not day-one overload**:

| Day / trigger                   | Unlocked                                                  | Still hidden       |
| ------------------------------- | --------------------------------------------------------- | ------------------ |
| First session complete          | Full practice loop, mastery map colours                   | Exam simulation    |
| 3 sessions OR 1 topic amber     | Exam simulation CTA on dashboard                          | —                  |
| 1 topic mastered (theta ≥ 0.70) | `topic_mastered` celebration; spaced repetition explained | —                  |
| Week 1 complete                 | Weekly email report; progress page meaning                | —                  |
| 2 weeks + AL student (V2.0)     | "Beyond exams" hub teaser                                 | Full career module |

**Exam simulation gate (MVP):** Soft recommendation — "Complete 3 practice sessions before your first mock exam" — not hard block (exam_focus mode may skip).

---

### 2.6 Stage 5 — Ongoing Personalization (Post-Onboarding)

| Signal                        | Source           | Effect                                         |
| ----------------------------- | ---------------- | ---------------------------------------------- |
| IRT theta per topic           | Every response   | Question difficulty                            |
| Hint dependency               | `hints_used`     | More practice before advance (primary mode)    |
| UVE failures on correct marks | Probe results    | Flag surface memorisation                      |
| Time of day accuracy          | Session metadata | Weekly report scheduling                       |
| Learning mode                 | Registration     | Dashboard CTAs, gating strictness              |
| Cognitive fingerprint         | Weekly cron      | Hint emphasis, subtopic recommendations (V1.1) |
| Exam date proximity           | Profile          | Exam countdown urgency, simulation frequency   |

---

## 3. Security & Privacy — Student & Parent Trust

### 3.1 What We Collect (and Why)

| Data                         | Purpose                  | Shared with AI?                          |
| ---------------------------- | ------------------------ | ---------------------------------------- |
| Email, name                  | Auth, greeting, reports  | **Name never in prompts**                |
| Password hash                | Auth only                | Never                                    |
| Level, subjects, preferences | Personalization          | Aggregated context only (no PII)         |
| Answers, marks, hints        | Learning + mastery       | session_id reference only                |
| Photos of working            | OCR marking              | Transcription only; R2 encrypted storage |
| Focus/tab events             | Self-awareness analytics | Never                                    |
| Analytics events             | Product improvement      | userId internal only                     |

### 3.2 How We Protect It

| Layer              | Control                                                                          |
| ------------------ | -------------------------------------------------------------------------------- |
| **Authentication** | Auth.js JWT in HTTP-only cookie; bcrypt factor 12; no password in logs           |
| **Transport**      | HTTPS everywhere (Vercel TLS)                                                    |
| **Database**       | Neon PostgreSQL — encryption at rest (AES-256); Drizzle repositories only        |
| **Object storage** | Cloudflare R2 — presigned URLs; owner-only photo access                          |
| **Access control** | Students see **only their own** sessions, marks, mastery                         |
| **AI calls**       | Server-side only; API keys never in client; Anthropic zero-data-retention option |
| **Rate limiting**  | Prevents abuse and protects API budget                                           |
| **Minors**         | Parental consent under 16; minimal PII; no guilt notifications                   |
| **Deletion**       | Account delete → soft delete → 30-day purge cron                                 |
| **Export**         | "Request my data" on profile (MVP queues job)                                    |

Full implementation: `security.md`. Governance: `ExamEdge_Responsible_AI_Framework.md`.

### 3.3 Plain-Language Promises (Student-Facing)

1. **We use your data to teach you better** — not to sell to advertisers.
2. **Your name never goes to the AI** — only your anonymous session ID.
3. **You can challenge any mark** — appeals go to human review.
4. **You can leave** — export or delete your account.
5. **We're honest about AI** — low-confidence marks are flagged for review.

### 3.4 Parent Confidence (V1.1)

- Read-only progress link (opt-in)
- Weekly summary email (no academic detail in subject line)
- Consent management for under-16 accounts

---

## 4. Focus, Engagement & Healthy Study Habits

Digital platforms fail when they optimize **time-on-app**. ExamEdge optimizes **verified learning**.

### 4.1 Anti-Distraction Design

| Design choice                          | Rationale                                 |
| -------------------------------------- | ----------------------------------------- |
| No infinite scroll feed                | Prevents passive consumption              |
| No public leaderboards                 | Prevents shame and comparison             |
| No social chat (MVP)                   | Reduces moderation burden and distraction |
| Single-task study screen               | One question at a time in practice        |
| Exam mode: no navbar                   | Fullscreen immersion                      |
| No push guilt ("You haven't studied!") | One weekly momentum email only            |

### 4.2 Focus Architecture (Unit 26)

| Feature                      | Behaviour                                          |
| ---------------------------- | -------------------------------------------------- |
| **Focus preparation prompt** | Before each session — phone face-down, close tabs  |
| **Block timer**              | 20–35 min adaptive study block                     |
| **Break screen**             | 5-min countdown between blocks                     |
| **Tab-switch logging**       | Logged for self-awareness — exam mode pauses timer |
| **Reflection micro-prompt**  | End of block: "What was hardest? 1–5"              |
| **Focus analytics**          | Progress page: active time vs interruptions        |

### 4.3 Motivation Systems (Ethical)

| Mechanism                     | Type            | Burnout prevention                     |
| ----------------------------- | --------------- | -------------------------------------- |
| Mastery map (red/amber/green) | Competence      | Reflects real progress                 |
| Streak                        | Habit           | **1 grace day per week**               |
| Exam countdown                | Purpose         | Real-world goal, not platform pressure |
| Readiness score               | Honest estimate | Not inflated                           |
| Weekly report                 | Information     | Actionable, not guilt                  |
| Session reflection            | Metacognition   | V1.1 — three honest sentences          |
| Spaced repetition             | Science         | Surfaces due topics — doesn't overload |

**Excluded:** Points for time-on-app, loot boxes, shame notifications, pay-to-win.

Full policy: `platform-ecosystem-ops.md` §5.

### 4.4 Personalized Study Plans (Non-LLM)

Dashboard recommendation (algorithmic):

```
Today: 25 minutes
  1. Integration (due for review — spaced repetition)
  2. One exam-style question on Vectors (weakest topic, 38% accuracy)
  3. Optional: 5-min "Learn" on Chain Rule if stuck yesterday
```

Adapted by `learningMode`, IRT theta, SM-2 schedule, exam_weight — see `content-architecture.md` §6.2.

### 4.5 Reminders

| Channel            | Frequency   | Content                              |
| ------------------ | ----------- | ------------------------------------ |
| Weekly email       | 1×/week     | Progress, focus area, exam countdown |
| In-app dashboard   | Every visit | "Continue studying" + due reviews    |
| Push (V1.1 mobile) | Opt-in only | Same as weekly — no daily spam       |

---

## 5. Systematic Exam Preparation — Deep Mastery, Not Memorization

### 5.1 The Learning Loop (Core Engine)

ExamEdge is an **Adaptive Examination Preparation and Intelligent Tutoring System** — not a flashcard app.

```
Learn (syllabus-grounded) → Practice (productive struggle) → Mark (examiner-accurate)
  → Hint if stuck (Socratic, never answer) → Verify (UVE probes) → Master → Advance
  → Simulate (timed exam) → Reflect → Repeat weak topics
```

### 5.2 Why This Builds Understanding (Not Memorization)

| Mechanism                | What it prevents                           | What it develops           |
| ------------------------ | ------------------------------------------ | -------------------------- |
| Parameterised questions  | Copying ChatGPT answers with wrong numbers | Method transfer            |
| M1/A1/B1 marking         | Guessing final answer without working      | Structured problem-solving |
| Socratic hints           | Passive answer consumption                 | Active reasoning           |
| UVE after every response | "Correct" without understanding            | Verified comprehension     |
| Mastery gating           | Skipping gaps                              | Prerequisite depth         |
| Exam simulation          | Exam hall shock                            | Stamina + time management  |
| Post-exam report         | Ignoring mistakes                          | Targeted revision          |

### 5.3 AI Tutor Behaviour (Continuous Assessment)

| Moment              | AI action                                      | Model             |
| ------------------- | ---------------------------------------------- | ----------------- |
| Wrong answer        | Socratic hint — one guiding question           | Haiku / Sonnet L3 |
| Every submit        | Rubric marking with step feedback              | Haiku             |
| After marking       | UVE probe — different params or explain method | Haiku             |
| First topic visit   | Four-part explanation from syllabus            | Sonnet (cached)   |
| Low confidence mark | Queue for human review — student notified      | —                 |
| Weekly              | Honest progress narrative                      | Haiku batch       |

**The tutor never:** gives the full answer on request, accepts correct answers without UVE, invents syllabus facts.

### 5.4 Pathway to Exceptional Exam Standard

| Phase            | Student experience                         | Outcome                     |
| ---------------- | ------------------------------------------ | --------------------------- |
| **Foundation**   | Learn topic → practice easy questions      | Concept clarity             |
| **Building**     | Increasing difficulty matched to IRT theta | Skill fluency               |
| **Verification** | UVE pass + mastery theta ≥ 0.70            | Genuine understanding       |
| **Integration**  | Mixed-topic sessions                       | Transfer across syllabus    |
| **Examination**  | Full timed simulations                     | Board-realistic performance |
| **Refinement**   | Post-exam priority revision list           | Weakness elimination        |

**Target:** Student arrives at national exams having **practised under examiner conditions** hundreds of times — with verified understanding, not memorised templates.

---

## 6. Beyond Examination Preparation (V2.0+)

ExamEdge's vision exceeds passing GCE. For **A-Level and final-year students**, the platform evolves into a **transition companion**.

### 6.1 Graduate Success Module (Roadmap)

| Feature                                | Version | Description                                                                    |
| -------------------------------------- | ------- | ------------------------------------------------------------------------------ |
| University readiness checklist         | V2.0    | Application timelines, subject requirements                                    |
| Career exploration by subject affinity | V2.0    | "Strong in Physics + Maths → engineering paths"                                |
| Scholarship directory (curated)        | V2.0    | Mastercard Foundation, MasterCard, Chevening, African Leadership Academy, etc. |
| Global competitions calendar           | V2.0    | Olympiads, hackathons, Presidential AI competition alumni path                 |
| Study skills module                    | V2.0    | Note-taking, exam technique, stress management                                 |
| Leadership & service programs          | V3.0    | Model UN, youth parliament, community project templates                        |
| Alumni mentor matching                 | V3.0    | Opt-in diaspora mentors                                                        |

**MVP:** Not included — focus 100% on exam mastery loop. AL students see footer link "Coming soon: university pathways" (V2.0 placeholder acceptable).

### 6.2 Content Principles (Beyond Exams)

- **Curated, not scraped** — scholarship links verified quarterly
- **Africa-first opportunities** — not only US/UK-centric
- **No false promises** — "Competitive — here's what strong candidates typically show"
- **Tied to demonstrated mastery** — readiness score unlocks relevant opportunity suggestions

---

## 7. Global Competitiveness Vision

### 7.1 The Larger Mission

ExamEdge aims to develop **capable, confident, globally competitive young Africans** — not merely students who pass local exams.

**Local excellence is the foundation.** A student who masters GCE A-Level Pure Mathematics with verified understanding has already demonstrated capability comparable to international A-Level and IB standards — the gap is often **opportunity access**, not ability.

### 7.2 How the Platform Builds Global Readiness

| Capability                         | ExamEdge mechanism                            | Global relevance                    |
| ---------------------------------- | --------------------------------------------- | ----------------------------------- |
| **Critical thinking**              | Socratic hints + UVE — must produce reasoning | International interviews, olympiads |
| **Problem-solving under pressure** | Timed exam simulations                        | SAT, university entrance exams      |
| **Mathematical literacy**          | KaTeX, rigorous marking                       | STEM pathways worldwide             |
| **Scientific reasoning**           | M1/A1/B1 in Physics/Biology                   | International science competitions  |
| **Digital literacy**               | PWA, offline sync, AI-augmented learning      | Modern workforce                    |
| **Self-directed learning**         | Mastery map, spaced repetition                | University independence             |
| **Academic integrity**             | Verification over copying                     | Research ethics foundation          |
| **Metacognition**                  | Focus analytics, session reflection           | Lifelong learning                   |

### 7.3 Pathways to International Opportunity

ExamEdge does not replace scholarship applications — it **prepares students to compete for them**:

```
Strong local exam performance (verified mastery)
  → Readiness score + topic profile as evidence portfolio
  → Graduate Success module surfaces matched opportunities
  → Study skills + competition prep resources
  → Alumni/mentor network (V3.0)
  → Student applies with confidence and documented progress
```

**Examples of opportunities to curate (V2.0):**

| Category                  | Examples                                                                |
| ------------------------- | ----------------------------------------------------------------------- |
| Fully funded scholarships | Mastercard Foundation, African Leadership Academy, Chevening (AL grads) |
| Global competitions       | International Olympiads, Pan-African Math Olympiad, AI competitions     |
| Research programs         | AIMS, MISE, local university summer research                            |
| Leadership                | Youth parliament, UNESCO youth forums                                   |
| University pathways       | Cameroon → Nigeria/Ghana/UK/US requirement guides                       |

### 7.4 Positioning Statement (External)

> ExamEdge starts where African students are — GCE, WAEC, KCSE — and builds the deep understanding, exam discipline, and digital confidence to compete anywhere. We don't replace national curricula; we **elevate students through them** toward global opportunity.

---

## 8. Journey Map (Visual Summary)

```
LANDING          REGISTER         FIRST WIN          GROW             EXCEL            BEYOND
   │                │                 │                │                │                │
   ▼                ▼                 ▼                ▼                ▼                ▼
Understand       Personalize       One question     Mastery map      Exam sim         University
the mission      level/subjects    marked + UVE     fills green      timed paper      scholarships
                 learning mode     first streak     spaced rep       readiness        global comps
                 privacy trust                      focus blocks     grade path       career explore
```

---

## 9. MVP vs Roadmap Summary

| Journey aspect                        | V1.0 MVP        | V1.1                  | V2.0+          |
| ------------------------------------- | --------------- | --------------------- | -------------- |
| Registration + learning mode          | ✓               | OAuth                 | —              |
| Welcome dashboard + first session CTA | ✓               | Exam date picker      | —              |
| Focus preparation prompt              | ✓ Unit 26       | Block timer           | —              |
| Progressive feature unlock            | Soft            | Harder gates optional | —              |
| Parent read-only link                 | —               | ✓                     | —              |
| Weekly email report                   | ✓               | Richer narrative      | —              |
| Graduate Success hub                  | Placeholder     | —                     | ✓              |
| Scholarship directory                 | —               | —                     | ✓              |
| Global competitiveness content        | Vision doc only | —                     | Curated module |

---

## 10. Documentation Cross-References

| Concern                     | Document                          |
| --------------------------- | --------------------------------- |
| Registration implementation | `build-plan.md` Unit 06           |
| Profile + privacy + consent | Unit 23, `security.md`            |
| Pedagogy / UVE / hints      | `platform-how-it-works.md`        |
| Pathway algorithm           | `content-architecture.md` §6      |
| Engagement ethics           | `platform-ecosystem-ops.md` §5    |
| Learning KPIs               | `learning-impact.md`              |
| Exam lifecycle              | `ai-cost-and-exam-system.md` §7–9 |
| Long-term product phases    | `roadmap.md`                      |
| Global vision depth         | `ExamEdge_Innovation_Document.md` |

---

_Update when onboarding UI, Graduate Success module, or privacy copy changes._
