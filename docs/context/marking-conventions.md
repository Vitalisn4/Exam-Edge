# Marking Conventions — ExamEdge

**Single source of truth** for how examination answers are graded across boards, subjects, and paper types.

**Related docs:** `AGENTS.md` § Examiner Marking Chain · `architecture.md` § mark_scheme JSONB · `content-architecture.md` § board_config · `specs/10-marking-framework.md` (implementation spec)

Last updated: July 2026 | Grounded for CGCE (GCE Board Buea) launch; extensible to WAEC, NECO, KCSE, OBC

---

## 1. Design Principle

ExamEdge does **not** apply one universal marking notation to every subject. Real examination boards use different rubric families:

| What varies                                                  | How ExamEdge handles it                                                                |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Mark code notation (M/A vs point ticks vs binary MCQ)        | `markingProfileId` on each subject + paper                                             |
| Partial credit rules (M→A dependency, follow-through, units) | Profile-specific chain prompt + Zod schema                                             |
| Paper format (MCQ Paper 1 vs structured Paper 2)             | `paperType` in mark scheme template                                                    |
| Country/board expansion                                      | New profiles in `packages/shared/constants/marking-profiles.ts` — **no new AI chains** |

**Rule:** The marking chain is one executor; **marking profiles** configure its behaviour per board × subject × paper.

---

## 2. Marking Families (Platform Taxonomy)

### 2.1 `method_accuracy` — GCE Mathematics subjects

Used for all Cameroon CGCE mathematics papers where official mark schemes allocate **Method (M)** and **Accuracy (A)** marks.

| Code              | Meaning                                                              | Dependency                                                 |
| ----------------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| **M** (M1, M2, …) | Valid method or intermediate step shown                              | Independent unless marked `dep`                            |
| **A** (A1, A2, …) | Correct accuracy at that stage (value, simplification, final answer) | **Depends on relevant M** — no A without preceding valid M |
| **dep** / **DM**  | Method mark that depends on a prior step                             | Cannot award if prerequisite step failed                   |
| **ft**            | Follow-through — correct use of a prior incorrect value              | Requires explicit `ft` annotation in scheme                |
| **cao**           | Correct answer only — no working credit                              | Scheme states explicitly                                   |
| **bod**           | Benefit of doubt — examiner discretion                               | Rare; logged when applied                                  |
| **isw**           | Ignore subsequent working                                            | After correct answer seen                                  |
| **oe**            | Or equivalent acceptable form                                        | Alternative expressions credited                           |

**Not used for CGCE mathematics:** **B marks** (independent “bonus” marks). B1/B2 appear in **Pearson GCSE** mathematics schemes, not in Cameroon GCE / Cambridge International mathematics mark schemes for Pure, Additional, or Further Mathematics. ExamEdge must **not** label GCE maths feedback as B1.

**Allocation pattern:** Marks are not always “one M + one A at the end.” A multi-stage question may allocate M and A at **each stage** (e.g. differentiate → M1+A1; solve → M2+A2) or group method marks before a final accuracy mark — exactly as the official mark scheme for that question specifies. The `mark_scheme` JSON stores the **ordered step list** from the validated template; the chain awards only what the scheme defines.

**Sources (grounding):**

- Cambridge International AS & A Level Mathematics (9709) — M/A marking principles
- Cambridge O Level Additional Mathematics (4037) — strict M/A dependency
- Cameroon GCE syllabi: Ordinary Mathematics, Additional Mathematics (O-Level), Pure with Mechanics (765), Pure with Statistics (770), Further Mathematics (775)

### 2.2 `point_rubric` — Sciences, humanities, vocational

Used when official schemes credit **discrete acceptable points** rather than M/A codes.

| Subject area               | Typical rubric shape                                                                      | Example                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Physics** (O & A Level)  | Numbered credit statements; marks in brackets on paper `(4 marks)`; units and sf required | “States Newton’s second law (1); correct substitution (1); answer with unit (1)” |
| **Biology**                | Point per valid fact, label on diagram, named process                                     | “Mitochondria identified (1); ATP role explained (2)”                            |
| **Chemistry**              | Point + calculation steps (ionic equation, moles, yield)                                  | Structured parts (a)(i), (a)(ii) each with bracket total                         |
| **Economics**              | Definition points + application points + diagram                                          | “Define elasticity (2); explain effect on revenue (3)”                           |
| **Geography**              | Map skills, case-study points, annotated diagrams                                         | Per-line ticks in examiner report style                                          |
| **Computer Science / ICT** | Trace table rows, algorithm steps, syntax-correct code blocks                             | Binary or partial per criterion                                                  |

**Physics is not `method_accuracy`:** GCE Physics papers (e.g. 0710 O-Level, 0750 A-Level) show **total marks per part** on the question paper. Published mark schemes use **tick-based point allocation**, not M1/A1 labels. Conceptually, “method then answer” may still be rewarded across separate point lines, but the **display codes** to students must be `P1`, `P2`, … (point credits) or step labels — not M1/A1.

**Error carried forward (ecf):** Common in Physics/Chemistry calculations — if part (a) is wrong, part (b) using that value correctly may still score. Annotate in scheme as `ecf` on dependent steps.

### 2.3 `binary_mcq` — Multiple-choice papers

| Paper examples                                 | Marking                                      |
| ---------------------------------------------- | -------------------------------------------- |
| GCE A-Level Further Mathematics Paper 1        | 1 mark per correct option; no partial credit |
| GCE A-Level Physics Paper 1                    | 1 mark per correct option                    |
| GCE O-Level Mathematics Paper 1 (MCQ sections) | Binary correct/incorrect                     |

Output: `awarded: boolean`, `marksGiven: 0 | 1` (or 0 | marksAvailable for multi-answer items if scheme defines).

### 2.4 `competency_band` — Future / essay-heavy boards

Reserved for boards that use level descriptors (e.g. some WAEC English essay bands). **Not in MVP.** Profile stub only.

---

## 3. CGCE (GCE Board Buea) — Launch Subject Matrix

Cameroon **General Certificate of Education** (CGCE), examined by GCE Board Buea. Syllabus codes below are the official subject identifiers used in content seeding.

### 3.1 Mathematics — `method_accuracy`

| Subject                          | Code | Level   | Papers  | Marking family                   | Notes                                                                       |
| -------------------------------- | ---- | ------- | ------- | -------------------------------- | --------------------------------------------------------------------------- |
| Mathematics                      | 0570 | O-Level | 1, 2    | `method_accuracy` / `binary_mcq` | Paper 1: MCQ; Paper 2: structured working, M/A per scheme                   |
| Additional Mathematics           | 4037 | O-Level | 1, 2    | `method_accuracy`                | Both papers structured; strict M/A dependency                               |
| Pure Mathematics with Mechanics  | 0765 | A-Level | 1, 2, 3 | `method_accuracy` / `binary_mcq` | Paper 1 often MCQ/short; Papers 2–3: “show all steps, answer at each stage” |
| Pure Mathematics with Statistics | 0770 | A-Level | 1, 2, 3 | `method_accuracy` / `binary_mcq` | Same M/A rules as 0765; statistics topics in Papers 2–3                     |
| Further Mathematics              | 0775 | A-Level | 1, 2, 3 | `method_accuracy` / `binary_mcq` | Paper 1: MCQ (no calculator); Papers 2–3: full working, M/A stages          |

**Syllabus instruction (Further Maths Papers 2 & 3):** Candidates should show all steps in their work, giving their answer at each stage. Mark schemes reflect stage-wise M/A allocation.

### 3.2 Sciences — `point_rubric`

| Subject   | Code | Level   | Papers  | Marking family                            |
| --------- | ---- | ------- | ------- | ----------------------------------------- |
| Physics   | 0710 | O-Level | 1, 2, 3 | `binary_mcq` (P1) + `point_rubric` (P2–3) |
| Physics   | 0750 | A-Level | 1, 2, 3 | `binary_mcq` (P1) + `point_rubric` (P2–3) |
| Biology   | 0730 | O-Level | 1, 2, 3 | `binary_mcq` + `point_rubric`             |
| Biology   | 0776 | A-Level | 1, 2, 3 | `binary_mcq` + `point_rubric`             |
| Chemistry | 0725 | O-Level | 1, 2, 3 | `binary_mcq` + `point_rubric`             |
| Chemistry | 0740 | A-Level | 1, 2, 3 | `binary_mcq` + `point_rubric`             |

**Assessment objectives (sciences):** AO1 knowledge, AO2 application, AO3 analysis — used in syllabus weighting; marking still executes as point rubric lines tagged with optional `ao` metadata for analytics.

### 3.3 Humanities & applied — `point_rubric`

| Subject   | Code | Level   | Marking family |
| --------- | ---- | ------- | -------------- |
| Economics | 0785 | O-Level | `point_rubric` |
| Economics | 0790 | A-Level | `point_rubric` |
| Geography | 0735 | O-Level | `point_rubric` |
| Geography | 0780 | A-Level | `point_rubric` |

### 3.4 Computing — `point_rubric` (+ binary where MCQ)

| Subject          | Code | Level   | Marking family                |
| ---------------- | ---- | ------- | ----------------------------- |
| Computer Science | 0690 | O-Level | `point_rubric` / `binary_mcq` |
| ICT              | 0695 | O-Level | `point_rubric` / `binary_mcq` |

### 3.5 MVP V1.0 scope (implementation order)

| Priority               | Subjects                                              | Marking profiles to ship                                   |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **P0 (MVP)**           | Pure Maths 0765, Physics 0710, Biology 0730           | `method_accuracy`, `point_rubric`, `binary_mcq`            |
| **P1 (GCE expansion)** | Additional Maths, Further Maths, Chemistry, Economics | Extend profiles + benchmark fixtures                       |
| **P2 (multi-board)**   | WAEC, NECO, KCSE                                      | New board rows; may introduce `competency_band` for essays |

---

## 4. Mark Scheme JSON Contract

All question templates store `mark_scheme` as structured JSON — never free-text rubrics in the marking prompt.

### 4.1 Common fields

```typescript
type MarkSchemeBase = {
  markingProfileId: string; // e.g. "gce_buea.method_accuracy.pure_maths"
  paperType: "structured" | "mcq" | "practical" | "essay";
  totalMarks: number;
  steps: MarkStep[];
};

type MarkStep = {
  stepNumber: number;
  marksAvailable: number;
  creditType: string; // Profile-specific: "M1" | "A1" | "P1" | "mcq" | ...
  label: string; // Examiner-facing description
  acceptableResponses?: string[]; // For generation/validation — not shown to student
  dependsOn?: number[]; // stepNumber refs for dep / A-on-M
  annotations?: ("ft" | "ecf" | "cao" | "bod" | "oe" | "isw")[];
  requiresUnit?: boolean; // Sciences: true when unit mark separate
};
```

### 4.2 `method_accuracy` step example (differentiation)

```json
{
  "markingProfileId": "gce_buea.method_accuracy.pure_maths",
  "paperType": "structured",
  "totalMarks": 5,
  "steps": [
    {
      "stepNumber": 1,
      "creditType": "M1",
      "marksAvailable": 1,
      "label": "Correct power rule applied to x³"
    },
    { "stepNumber": 2, "creditType": "A1", "marksAvailable": 1, "label": "3x²", "dependsOn": [1] },
    {
      "stepNumber": 3,
      "creditType": "M1",
      "marksAvailable": 1,
      "label": "Product rule structure for x² sin x"
    },
    {
      "stepNumber": 4,
      "creditType": "A1",
      "marksAvailable": 1,
      "label": "Correct derivative of product",
      "dependsOn": [3]
    },
    {
      "stepNumber": 5,
      "creditType": "A1",
      "marksAvailable": 1,
      "label": "Fully simplified final answer",
      "dependsOn": [3, 4]
    }
  ]
}
```

### 4.3 `point_rubric` step example (Physics)

```json
{
  "markingProfileId": "gce_buea.point_rubric.physics",
  "paperType": "structured",
  "totalMarks": 4,
  "steps": [
    {
      "stepNumber": 1,
      "creditType": "P1",
      "marksAvailable": 1,
      "label": "States F = ma",
      "requiresUnit": false
    },
    {
      "stepNumber": 2,
      "creditType": "P1",
      "marksAvailable": 1,
      "label": "Correct substitution of values"
    },
    {
      "stepNumber": 3,
      "creditType": "P1",
      "marksAvailable": 1,
      "label": "Calculates magnitude correctly"
    },
    {
      "stepNumber": 4,
      "creditType": "P1",
      "marksAvailable": 1,
      "label": "Unit N stated",
      "requiresUnit": true
    }
  ]
}
```

---

## 5. Marking Chain Behaviour (Per Profile)

| Profile                  | Chain task key    | Model      | Prompt focus                                     | Output `creditType` values |
| ------------------------ | ----------------- | ---------- | ------------------------------------------------ | -------------------------- |
| `method_accuracy`        | `marking_math`    | Haiku 0.1  | M/A dependency, dep, ft; never award A without M | M1, M2, A1, A2, ft, bod    |
| `point_rubric` (science) | `marking_science` | Haiku 0.1  | Tick each rubric line; units; ecf                | P1, P2, …, ecf             |
| `point_rubric` (essay)   | `marking_essay`   | Sonnet 0.2 | Holistic + per-point where scheme lists points   | P1, P2, …                  |
| `binary_mcq`             | `marking_mcq`     | Haiku 0.1  | Option key match only                            | mcq                        |

**Router:** `getMarkingProfile(boardId, subjectCode, paperNumber)` → `markingProfileId` + `taskType`.

**Validation (Zod):**

- `marksGiven ≤ marksAvailable` per step
- For `method_accuracy`: if `creditType` starts with `A` and `dependsOn` step not awarded → force `marksGiven: 0`
- `totalAwarded ≤ totalMarks`

---

## 6. Student-Facing Display

| Profile           | UI badge colours (see `ui-tokens.md`)   | Copy                                 |
| ----------------- | --------------------------------------- | ------------------------------------ |
| `method_accuracy` | M = blue, A = green, ft = amber         | “Method mark”, “Accuracy mark”       |
| `point_rubric`    | P = teal (reuse mastery-adjacent token) | “Credit point”                       |
| `binary_mcq`      | Correct / Incorrect only                | No step breakdown                    |
| B1 badge          | **Hidden for GCE maths**                | Reserved for future GCSE boards only |

Marketing copy must say **“examiner-accurate partial credit”** or **“board-faithful marking”** — not “M1/A1/B1” unless the page explicitly refers to mathematics subjects.

---

## 7. Benchmark & QA Requirements

| Profile                | Minimum fixtures before pilot                  | Acceptance                                                         |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| `method_accuracy`      | 500 maths cases across 0765, 4037, 0775 topics | ≥92% agreement with human markers; **zero** A-without-M violations |
| `point_rubric` physics | 200 structured + 50 ecf cases                  | ≥90% point agreement                                               |
| `point_rubric` biology | 150 diagram + explanation cases                | ≥88% (higher variance — flag <0.70)                                |
| `binary_mcq`           | 100 per subject paper 1                        | 100% (deterministic)                                               |

**Anti-patterns to regression-test:**

- Awarding B1 on GCE mathematics
- Showing M1/A1 badges on Physics/Biology feedback
- Awarding accuracy marks when method step missing
- Ignoring unit marks in science rubrics

---

## 8. Multi-Board Expansion (V2.0+)

| Board                 | Maths notation                                  | Sciences                 | Notes                      |
| --------------------- | ----------------------------------------------- | ------------------------ | -------------------------- |
| GCE Board Buea        | M/A (no B)                                      | Point rubric             | Launch board               |
| WAEC / NECO           | Often point-based; some maths uses method steps | Point rubric             | Add `waec.*` profiles      |
| KCSE                  | Board-specific                                  | Point + competency bands | Kenya config layer         |
| Pearson GCSE (future) | M/A/**B**                                       | Point rubric             | B marks enabled in profile |

Adding a board = seed `marking_profiles` + benchmark suite + admin validation checklist — **not** a new chain.

---

## 9. References

| Source                                         | URL / location                  | Use                                          |
| ---------------------------------------------- | ------------------------------- | -------------------------------------------- |
| Cambridge 9709 Mathematics syllabus            | cambridgeinternational.org      | M/A principles, paper structure              |
| Cambridge 4037 Additional Mathematics          | cambridgeinternational.org      | O-Level M/A schemes                          |
| Cameroon GCE Further Mathematics 0775 syllabus | cameroongcerevision.com         | Paper 1–3 format, stage-wise answers         |
| Pearson GCSE mark scheme guidance              | pearson.com (M/A/B definitions) | **GCSE only** — do not apply B to CGCE maths |
| ExamEdge AGENTS.md                             | `/AGENTS.md`                    | Chain executor spec                          |
| Implementation spec                            | `specs/10-marking-framework.md` | Types, files, Unit 10 acceptance             |

---

_ExamEdge · Marking Conventions SSOT · July 2026_
_Update when: new board onboarded, benchmark thresholds change, or syllabus code added_
