# Platform Ecosystem, Accessibility & Operations — ExamEdge

**Canonical blueprint** for multilingual support, offline/devices, teacher/parent ecosystem, engagement ethics, accessibility, and operational reliability.

**Related:** `roadmap.md`, `build-plan.md` Units 26–27, `ExamEdge_Volume_II_Framework.md`, `security.md`, `ExamEdge_Engineering_Document.md` §10.

---

## 1. Multilingual Strategy (§5)

### 1.1 Language Roadmap

| Phase | Languages | Scope |
|-------|-----------|-------|
| V1.0 | English | UI + content + AI prompts |
| V1.1 | French UI shell (i18n) | next-intl; student-facing chrome |
| V2.0 | French content | Syllabus chunks + explanations for OBC/BEPC |
| V2.0 | Kiswahili UI (Kenya pilot) | KCSE launch |
| V3.0 | Local languages | Partnership-driven |

### 1.2 Localization Framework

```
packages/shared/i18n/
  en.json, fr.json (V1.1+)
apps/web/middleware.ts → locale detection (cookie + Accept-Language)

Content localization (not just UI):
  syllabus_chunks.language
  topic_explanations.language
  questions.template_text — same template, localized param labels where needed
  AI chains: system prompts per language (immutable constants per locale)
```

**Rule:** Never machine-translate cached curriculum without human review — generate per language from syllabus chunk.

### 1.3 Multilingual AI Tutoring

| Chain | Multilingual approach |
|-------|----------------------|
| Marking | Accept answers in English; French science terms in V2.0 rubrics |
| Hints | Prompt includes `language` param — output in student locale |
| Curriculum | Separate cache per topic per language |
| UVE | Probe templates localized at generation time |

---

## 2. Offline-First & Low-Bandwidth (§6)

### 2.1 MVP Offline Capabilities (Unit 27)

| Feature | Offline? | Sync |
|---------|----------|------|
| App shell (PWA) | ✓ Service worker | On install/update |
| View cached dashboard | Partial (last fetched) | On reconnect |
| Study session (cached questions) | ✓ Pre-cache next 5 | N/A |
| Submit answer | ✓ IndexedDB queue | POST with idempotency key |
| Marking results | After sync | Server returns marks |
| Topic explain | If previously viewed | Cache in SW |
| Exam simulation start | ✗ Requires assembly API | — |
| Photo upload | Queue blob; upload on reconnect | R2 |

### 2.2 Sync Architecture

```
offline-queue.ts (IndexedDB)
  → { idempotencyKey, sessionId, questionId, answerText, timestamp }
  → On navigator.onLine: sequential POST
  → Server idempotency SET NX → duplicate returns cached mark
  → Client removes entry on 200
  → Conflict: server wins (examination answers immutable post-submit)
```

### 2.3 Low-Bandwidth Optimizations

| Technique | Effect |
|-----------|--------|
| KaTeX CSS subset | Smaller initial bundle |
| No auto-play video | Zero video in MVP |
| Lazy-load admin routes | Student bundle lean |
| Redis warm pool | Fewer DB round-trips |
| Compress API JSON | gzip via Vercel |
| Plausible lightweight script | vs heavy analytics SDKs |
| V2.0 USSD/SMS summaries | Africa's Talking — exam countdown, streak |

### 2.4 Downloadable Lessons (V1.1 Mobile)

React Native app: SQLite cache of topic explanations + next 20 question templates per enrolled subject — full offline study without sync for pre-cached content.

---

## 3. Device Compatibility (§7)

### 3.1 Minimum Supported Device (Locked)

| Spec | Minimum |
|------|---------|
| OS | Android 7+ (API 24); iOS 14+ (V1.1); modern Chromium/Firefox/Safari |
| RAM | 512 MB |
| Screen | 4.5" (360px CSS width) |
| Network | 3G (384 Kbps) usable for marking sync; offline for study |
| Storage | 50 MB PWA cache budget |

### 3.2 Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 3s on 3G |
| Time to Interactive | < 5s on 3G |
| JS bundle (student routes) | < 200 KB gzipped (excl. KaTeX) |
| Memory peak | < 150 MB on 512 MB device |
| Data per 30-min session | < 2 MB (excl. photos) |

### 3.3 Device Compatibility Matrix

| Device class | Support | Notes |
|--------------|---------|-------|
| Low-end Android (2016–2018) | Primary target | Test on BrowserStack |
| Mid-range Android | Full | — |
| iPhone (V1.1 native) | Full | Expo |
| Feature phone | V2.0 USSD only | No app |
| Desktop browser | Full | max-w-lg centered layout |
| Tablet | Full | Same mobile layout |

---

## 4. Teacher & Parent Ecosystem (§8)

### 4.1 Roadmap

| Feature | Version | Description |
|---------|---------|-------------|
| Teacher role in DB | V1.0 | Schema ready; routes deferred |
| Teacher dashboard | V1.1 | Class roster, progress, topic gaps |
| Assignments | V1.1 | Assign topic practice to class |
| Parent read-only link | V1.1 | Magic link; weekly email summary |
| School admin portal | V3.0 | Multi-tenant, bulk provisioning |
| Classroom creation | V1.1 | Teacher creates class code; students join |

### 4.2 Teacher Dashboard (V1.1 Spec)

```
/teacher/classes          → List classes
/teacher/classes/:id      → Roster + aggregate mastery heatmap
/teacher/classes/:id/topics → Weakest topics across class
/teacher/assignments      → Assign topic + due date
/teacher/review           → Low-confidence marks for class (optional)
```

**Privacy:** Teachers see own students only; RLS policies (V1.1).

### 4.3 Parent Access (V1.1)

- Opt-in link generated by student (13+) or parent account for under-16
- View: readiness score, streak, topics studied, **no** other students' data
- No messaging through platform (avoid moderation burden)

---

## 5. Student Engagement (§9) — Ethical Framework

ExamEdge **rejects** manipulative gamification (guilt notifications, shame leaderboards, activity badges without learning).

### 5.1 Included (Aligned with Learning)

| Mechanism | Purpose | MVP |
|-----------|---------|-----|
| **Mastery map** (red/amber/green) | Competence visibility | ✓ |
| **Streak** | Habit formation; 1 grace day/week | ✓ |
| **Exam countdown** | Real-world urgency | ✓ |
| **Readiness score** | Honest preparation estimate | ✓ |
| **Session reflection** | Metacognition | V1.1 |
| **Spaced repetition reminders** | Retention science | ✓ cron |
| **Weekly momentum email** | Information, not guilt | ✓ |

### 5.2 Explicitly Excluded

| Mechanism | Reason |
|-----------|--------|
| Public leaderboards | Shames struggling students |
| Pay-to-win features | Equity violation |
| Guilt push notifications | Anxiety without learning |
| Points for time-on-app | Rewards activity not mastery |
| Social comparison feeds | Distraction + inequality |

### 5.3 Personalized Study Plans

Generated by pathway algorithm (`content-architecture.md` §6.2) — not LLM:

```
"Today: 25 min — Integration (weak, due review) + 1 exam-style question on Vectors"
```

Optional Haiku narrative in weekly email only.

---

## 6. Accessibility (§18)

### 6.1 MVP Requirements

| Feature | Implementation |
|---------|----------------|
| Screen reader | ARIA labels on interactive elements; semantic HTML |
| Keyboard navigation | Focus order on study session, exam, forms |
| Touch targets | ≥ 44px (ui-rules.md) |
| Font scaling | rem-based; respects OS settings to 24px |
| Color contrast | WCAG AA (ui-tokens.md) |
| KaTeX alt text | MathDisplay aria-label from LaTeX plain-text fallback |
| Motion | Respect `prefers-reduced-motion` |

### 6.2 V1.1+

| Feature | Phase |
|---------|-------|
| High contrast mode toggle | V1.1 |
| Dyslexia-friendly font option (OpenDyslexic) | V1.1 |
| Text-to-speech for explanations | V2.0 (expo-speech / Web Speech API) |
| Full exam accommodations mode | V2.0 (extended time — teacher flag) |

---

## 7. Operations & Reliability (§19)

### 7.1 Moderation & Support (MVP)

| Function | Owner | Channel |
|----------|-------|---------|
| Question validation | Admin | /admin/questions |
| Marking appeals | Admin | /progress appeals queue |
| Bug reports | Sentry + email | support@ (stub OK) |
| Content errors | Hallucination registry | Monthly review |

### 7.2 Incident Response (Summary)

| Severity | Example | Response |
|----------|---------|----------|
| SEV1 | Marking API down; data breach | Page owner immediately; pause AI if unsafe |
| SEV2 | Neon outage | 503 friendly message; Redis session cache survives short outage |
| SEV3 | Single chain validation spike | Enable mock fallback for demo; fix prompt |
| SEV4 | UI bug | Next deploy |

**AI provider failure:**

```
Anthropic 402/503
  → Marking: queue responses; show "Marking delayed — your answer is saved"
  → Hints: generic conceptual pointer (pre-written, no LLM) — max 24h
  → Generation: pause cron; alert admin
  → Curriculum cache hit: unaffected
Never: return unvalidated LLM output or guess marks
```

Full runbook detail: `ExamEdge_Engineering_Document.md` §10 (Tier 3); MVP drills in V1.1.

### 7.3 Disaster Recovery

| Asset | RPO | RTO | Method |
|-------|-----|-----|--------|
| PostgreSQL | 24h | ~30min | Weekly pg_dump → R2; Neon PITR on paid tier |
| R2 photos | 0 | N/A | Durable object storage |
| Redis cache | N/A | Rebuild | Cache miss → Postgres |
| AI prompts/chains | 0 | Deploy | Git versioned |

### 7.4 Uptime Targets

| Phase | Target |
|-------|--------|
| MVP pilot | Best effort |
| V1.1 | 99.5% monthly |
| V2.0 | 99.9% + status page |

---

## 8. Long-Term Vision Extensions (§20)

See `roadmap.md` for full timeline. Potential expansions:

| Domain | Version | Notes |
|--------|---------|-------|
| University entrance prep | V3.0+ | Same engine, new curricula rows |
| Vocational (TVET) | V3.0+ | Rubric templates differ |
| Teacher training | V4.0 | CPD modules for marking literacy |
| Career guidance | V3.0 | Readiness + subject affinity — not LLM-heavy |
| Scholarships | V4.0 | Partner API; match on merit + need |
| AI study groups | V4.0 | Async peer Q&A moderated — high ops cost |
| Peer learning | V3.0 | Opt-in study pairs — no open forums (safety) |

**Rule:** Expand via **content + config layers** — never fork the engine.

---

*Update when i18n, teacher features, or operational SLAs ship.*
