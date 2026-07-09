# Content Governance — ExamEdge

**Canonical blueprint** for content acquisition, licensing, ingestion, versioning, and educational quality assurance.

**Related:** `content-architecture.md` (structure), `roadmap.md` § Curriculum onboarding, `ExamEdge_Volume_II_Framework.md` (copyright), `build-plan.md` Units 05, 12, 29.

---

## 1. Content Sources & Legal Framework

### 1.1 What We Use (and Do Not Use)

| Material                         | Source                                               | Legal basis                                                               | MVP                |
| -------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ------------------ |
| **Official syllabus text**       | Public GCE Board Buea syllabus documents             | Factual curriculum reference; cite source in `syllabus_chunks.source_ref` | Manual seed        |
| **AI-generated questions**       | Generation chain + RAG from validated pool           | Original transformative works — not reproductions of past papers          | Batch + admin gate |
| **Past paper structures**        | Inspiration only (topic distribution, mark patterns) | Transformative use — **never reproduce copyrighted paper text**           | Design input       |
| **Past paper reproduction**      | **Prohibited**                                       | Copyright owned by examination boards                                     | Never              |
| **Teacher-contributed content**  | V1.1+ workflow                                       | Contributor license agreement                                             | Deferred           |
| **Licensed third-party content** | V2.0+ if partnership requires                        | Formal license on file                                                    | Deferred           |

**Legal position:** ExamEdge generates **new** parameterised questions aligned to syllabus outcomes — analogous to a teacher writing fresh exercises inspired by textbook problems. This is **not** a past-paper distribution platform.

### 1.2 Content Licensing Framework

| Content type                       | Ownership                                         | Student-facing license                          | Contributor terms               |
| ---------------------------------- | ------------------------------------------------- | ----------------------------------------------- | ------------------------------- |
| Platform code                      | ExamEdge / developer                              | N/A                                             | OSS components per package.json |
| AI-generated questions (validated) | ExamEdge                                          | Use within platform only                        | N/A                             |
| Syllabus chunks                    | Cited to board; stored for RAG                    | Display with attribution                        | N/A                             |
| Topic explanations (cached)        | ExamEdge (AI-assisted, human-reviewed)            | Use within platform only                        | N/A                             |
| Student submissions                | Student                                           | Processed per privacy policy; not redistributed | N/A                             |
| Teacher-contributed (V1.1+)        | Contributor grants ExamEdge non-exclusive license | Platform use + attribution                      | Contributor agreement required  |

### 1.3 Institutional Partnership Strategy

| Phase      | Action                                                                    |
| ---------- | ------------------------------------------------------------------------- |
| Pre-launch | Document transformative-use policy in Terms of Service                    |
| Month 6    | Proactive letter to GCE Board Buea — MoU offer, supplementary positioning |
| V1.1       | Pilot school partnership (1–2 schools) — letter of support for grants     |
| V2.0       | WAEC/KCSE ministry or board engagement per country                        |
| Ongoing    | Frame as **supplementary** to boards, not competitive replacement         |

**MoU goals (non-binding initially):** acknowledge curriculum alignment; optional co-validation of question pool; no past-paper reproduction.

---

## 2. Content Ingestion Pipeline

### 2.1 MVP (Manual)

```
Curriculum specialist / developer
  → Extract syllabus text per topic (PDF → plain text)
  → INSERT syllabus_chunks (topic_id, board, level, text, source_ref, version)
  → Map topics in seed file (gce-buea-topics.ts)
  → Generation cron fills question pool
  → Admin validates at /admin/questions
```

### 2.2 V1.1 (Semi-Automated)

```
Syllabus PDF upload (admin)
  → Chunk by heading/section (scripted split + human review)
  → Map chunks → topics / subtopics
  → Diff against previous version → flag changed sections
  → Trigger re-validation of affected topic explanations
```

### 2.3 V2.0 (Multi-Country)

```
Board onboarding package:
  1. curricula row + board_config
  2. Syllabus PDF(s) → chunked → embedded (optional pgvector on chunks)
  3. Subject/topic tree seed
  4. Mark scheme template conventions documented
  5. 50-question pilot pool per subject → human benchmark
  6. Go-live after marking agreement ≥92%
```

### 2.4 Past Papers — Allowed Use

| Allowed                                                   | Not allowed                          |
| --------------------------------------------------------- | ------------------------------------ |
| Analyze topic frequency and mark distribution             | Host PDF scans of past papers        |
| Use as RAG style reference for **validated** AI questions | Copy question text verbatim          |
| Train curriculum specialists on board conventions         | Sell or redistribute board materials |

---

## 3. Content Versioning System

### 3.1 Version Fields

| Entity                   | Version mechanism                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `curricula.board_config` | Semver string (`1.0.0`) — paper rules, grade boundaries                                |
| `syllabus_chunks`        | `version` + `effective_from` date; latest active per topic                             |
| `questions`              | Immutable once validated; deprecate via `validated=false`                              |
| `topic_explanations`     | `syllabus_chunk_version` reference; regenerate only on syllabus change + admin trigger |
| `lessons` (V1.1)         | Same pattern as topic_explanations                                                     |

### 3.2 Syllabus Change Workflow

```
Board publishes syllabus update
  → Admin uploads new document
  → Diff engine flags affected topics
  → Status: topics marked `review_required`
  → Curriculum specialist reviews chunks
  → Affected explanations queued for regeneration (not automatic)
  → Question pool for affected topics flagged for expert re-review
  → board_config semver bump if paper structure changed
  → Announce to active students: "Syllabus updated — review these topics"
```

**Rule:** Never auto-regenerate cached explanations without human trigger — prevents silent factual drift.

---

## 4. Educational Quality Assurance Framework

### 4.1 Quality Standards (All Content)

| Standard                 | Requirement                                                                | Verification                        |
| ------------------------ | -------------------------------------------------------------------------- | ----------------------------------- |
| **Syllabus alignment**   | Every LO maps to official syllabus reference                               | Specialist sign-off on topic tree   |
| **Factual accuracy**     | Curriculum claims grounded in `syllabus_chunks`                            | RAG + "no chunk = no generate" rule |
| **Mark scheme validity** | Cross-examination pass (Haiku solves + checks)                             | ≥95% pass before admin queue        |
| **Board convention**     | Marking profile rules correctly applied (M/A maths; point rubric sciences) | 500-question marking benchmark ≥92% |
| **Anti-leakage**         | Hints never reveal answers                                                 | 100-scenario zero-violation test    |
| **Accessibility**        | KaTeX alt text; readable at 360px                                          | UI checklist Unit 02                |
| **Bias neutrality**      | Context examples gender/culture neutral                                    | Responsible AI bias suite           |

### 4.2 Human Review Workflow

| Stage                          | Reviewer                      | Action                         |
| ------------------------------ | ----------------------------- | ------------------------------ |
| Question generation            | AI cross-examination          | Auto-flag inconsistent         |
| Admin validation queue         | Admin / curriculum specialist | Approve / reject / edit        |
| Low-confidence marking (<0.70) | Specialist queue              | Verify before mastery update   |
| Student appeal                 | Admin / specialist            | Confirm, override, or escalate |
| Hallucination registry entry   | Monthly review                | Prompt/template adjustment     |
| Syllabus update                | Curriculum specialist         | Chunk + explanation review     |

### 4.3 AI Quality Evaluation Pipeline

| Chain      | Benchmark                          | Frequency                 | Threshold                 |
| ---------- | ---------------------------------- | ------------------------- | ------------------------- |
| Marking    | 500 questions vs human marks       | Every model/prompt change | ≥92% agreement            |
| Hints      | 100 scenarios — leakage check      | Every prompt change       | 0 violations              |
| Generation | 50 questions/subject expert review | Monthly sample            | ≥95% cross-exam pass      |
| Curriculum | Specialist review of 20 topics     | Quarterly                 | Factual accuracy sign-off |
| UVE        | Probe relevance rubric             | V1.1+ quarterly           | ≥85% specialist approval  |

**Automation:** CI runs marking + hint benchmarks on PR when `packages/ai/` changes (V1.1).

### 4.4 Content Approval Process

```
AI candidate content
  → Zod schema validation (automated)
  → Cross-examination (generation only)
  → INSERT validated=false
  → Admin queue (/admin/questions)
  → Human approves:
      validated=true
      validated_by=admin_id
      validation_notes (optional)
      embedding generated → live pool
  → OR reject → logged, never served
```

**Invariant:** `validated=false` never served via API — enforced in repository layer.

### 4.5 Audit Cadence

| Audit                         | Owner                       | Frequency                   |
| ----------------------------- | --------------------------- | --------------------------- |
| Question pool spot-check      | Curriculum specialist       | Monthly (10 random/subject) |
| Marking agreement sample      | Specialist vs AI            | Monthly (50 responses)      |
| Hallucination registry review | Lead developer + specialist | Monthly                     |
| Syllabus currency check       | Curriculum ops              | Per board publication cycle |
| Appeal outcome analysis       | Product + specialist        | Monthly                     |

---

## 5. Roles (Current → Scale)

| Role                                    | MVP       | V1.1          | V2.0+           |
| --------------------------------------- | --------- | ------------- | --------------- |
| Developer / admin validator             | ✓         | ✓             | ✓               |
| Curriculum specialist (co-founder hire) | Part-time | Full-time     | Team per region |
| Teacher validators                      | —         | Pilot schools | Network         |
| Board liaison                           | —         | MoU pursuit   | Per country     |

---

## 6. Governance Decisions (Locked)

1. **No past-paper hosting** — ever, unless explicit board license
2. **Human gate on all AI questions** — no exception for pilot
3. **Syllabus chunk required** — curriculum chain aborts without source
4. **Immutable validated questions** — deprecate, don't delete
5. **Appeals always available** — no mark final without appeal path
6. **Monthly hallucination review** — drives prompt changes, not silent fixes

---

_Update when licensing partnerships, ingestion automation, or QA thresholds change._
