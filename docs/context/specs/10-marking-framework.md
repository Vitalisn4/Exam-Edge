# Spec 10 — Marking Framework (Implementation)

**Unit:** 10 — Examiner Marking Chain  
**Status:** Specification (pre-implementation)  
**SSOT for conventions:** `../marking-conventions.md`

---

## 1. Objective

Implement a **single marking chain** driven by **marking profiles** so CGCE mathematics uses **M/A marks only** (no B1), while Physics, Biology, and future subjects use **point rubrics** or **binary MCQ** as their boards require.

---

## 2. Files to Create (Unit 10 + shared types)

| File                                                | Purpose                                             |
| --------------------------------------------------- | --------------------------------------------------- |
| `packages/shared/src/types/marking.ts`              | `MarkingProfile`, `MarkStep`, `MarkingResult` types |
| `packages/shared/src/constants/marking-profiles.ts` | CGCE launch profiles (see §4)                       |
| `packages/ai/chains/marking.ts`                     | Chain executor — loads profile, builds prompt       |
| `packages/ai/schemas/marking.schema.ts`             | Zod output — profile-aware `creditType` enum        |
| `packages/ai/lib/get-marking-profile.ts`            | Resolve profile from board + subject + paper        |
| `packages/ai/examples/marking/`                     | Few-shot examples per profile family                |

---

## 3. TypeScript Types (Draft)

```typescript
/** Marking family — determines chain prompt and allowed credit types */
export type MarkingFamily =
  | "method_accuracy" // GCE maths: M/A, dep, ft — NO B marks for CGCE
  | "point_rubric" // Sciences, humanities: P1, P2, ...
  | "binary_mcq" // Paper 1 MCQ: correct/incorrect
  | "competency_band"; // Future WAEC essays — not MVP

export type MarkingProfile = {
  id: string; // e.g. "gce_buea.method_accuracy.pure_maths"
  boardId: string; // "GCE_BUEA"
  subjectCodes: string[]; // ["0765", "0770", "0775", "0570", "4037"]
  paperNumbers?: number[]; // undefined = all papers; [2,3] = structured only
  family: MarkingFamily;
  taskType: "marking_math" | "marking_science" | "marking_essay" | "marking_mcq";
  allowedCreditTypes: string[]; // Enforced in Zod + post-validation
  displayLabels: Record<string, string>; // UI: M1 → "Method mark"
};

export type MarkStep = {
  stepNumber: number;
  marksAvailable: number;
  creditType: string;
  label: string;
  acceptableResponses?: string[];
  dependsOn?: number[];
  annotations?: ("ft" | "ecf" | "cao" | "bod" | "oe" | "isw")[];
  requiresUnit?: boolean;
};

export type MarkScheme = {
  markingProfileId: string;
  paperType: "structured" | "mcq" | "practical" | "essay";
  totalMarks: number;
  steps: MarkStep[];
};

export type MarkingStepResult = {
  stepNumber: number;
  creditType: string;
  awarded: boolean;
  marksAvailable: number;
  marksGiven: number;
  feedback: string;
};

export type MarkingResult = {
  steps: MarkingStepResult[];
  totalAwarded: number;
  totalAvailable: number;
  confidence: number;
  flagForReview: boolean;
  markingProfileId: string;
};
```

---

## 4. Launch Profiles (`marking-profiles.ts`)

```typescript
export const MARKING_PROFILES: MarkingProfile[] = [
  {
    id: "gce_buea.method_accuracy.pure_maths",
    boardId: "GCE_BUEA",
    subjectCodes: ["0570", "0765", "0770", "0775", "4037"],
    family: "method_accuracy",
    taskType: "marking_math",
    allowedCreditTypes: ["M1", "M2", "M3", "A1", "A2", "A3", "ft", "bod"],
  },
  {
    id: "gce_buea.binary_mcq",
    boardId: "GCE_BUEA",
    subjectCodes: ["0570", "0765", "0770", "0775", "0710", "0750", "0730", "0776"],
    paperNumbers: [1],
    family: "binary_mcq",
    taskType: "marking_mcq",
    allowedCreditTypes: ["mcq"],
  },
  {
    id: "gce_buea.point_rubric.physics",
    boardId: "GCE_BUEA",
    subjectCodes: ["0710", "0750"],
    paperNumbers: [2, 3],
    family: "point_rubric",
    taskType: "marking_science",
    allowedCreditTypes: ["P1", "P2", "P3", "P4", "P5", "ecf"],
  },
  {
    id: "gce_buea.point_rubric.biology",
    boardId: "GCE_BUEA",
    subjectCodes: ["0730", "0776"],
    paperNumbers: [2, 3],
    family: "point_rubric",
    taskType: "marking_science",
    allowedCreditTypes: ["P1", "P2", "P3", "P4", "P5", "ecf"],
  },
];
```

**Resolution order:** `(boardId, subjectCode, paperNumber)` → most specific profile (paper filter) → fallback to subject-only profile.

---

## 5. Chain Prompt Variants

### 5.1 `method_accuracy` (mathematics)

System prompt MUST include:

- Award M for valid method even if arithmetic slips
- Never award A (accuracy) if required M not present
- Follow `dependsOn` in mark scheme JSON
- Apply `ft` only when scheme annotates and student method is correct on prior value
- **Never use B1 or B marks for CGCE mathematics**

### 5.2 `point_rubric` (physics / biology)

System prompt MUST include:

- Award each point independently per rubric line
- Do not use M1/A1 notation in output — use P1, P2, …
- Enforce `requiresUnit` when scheme specifies
- Apply `ecf` on dependent calculation steps

### 5.3 `binary_mcq`

Deterministic comparison to keyed answer where possible; Haiku fallback for explanation text only.

---

## 6. Post-Validation Rules (after Zod)

```typescript
function enforceMarkingRules(
  result: MarkingResult,
  scheme: MarkScheme,
  profile: MarkingProfile,
): MarkingResult {
  // 1. Reject credit types not in profile.allowedCreditTypes
  // 2. method_accuracy: zero A marks if dependsOn M not awarded
  // 3. marksGiven <= marksAvailable per step
  // 4. totalAwarded = sum(marksGiven)
}
```

---

## 7. Unit 10 Acceptance Criteria (updated)

- [ ] Full marks case passes (maths `method_accuracy`)
- [ ] M1 awarded, A1 denied when final answer wrong but method correct
- [ ] **A1 denied when M1 not awarded** (dependency enforcement)
- [ ] **No B1 in output for `gce_buea.method_accuracy.*` profiles**
- [ ] Physics fixture: point rubric P1–P4, no M1/A1 in output
- [ ] MCQ fixture: binary 0/1 only
- [ ] Invalid LLM JSON → `MarkingValidationError`
- [ ] `marks_given` never exceeds `marks_available`

---

## 8. UI Integration (Units 16–17)

| Component           | Behaviour                                                             |
| ------------------- | --------------------------------------------------------------------- |
| `MarkingDisplay`    | Read `markingProfileId` from response; map badges via `displayLabels` |
| `MarkBadge`         | Show M/A for maths; P for sciences; hide B1 unless profile allows     |
| Landing / marketing | “Board-faithful partial credit” — not “M1/A1/B1” globally             |

---

## 9. Database

No schema migration required for Unit 10. Existing `questions.mark_scheme` JSONB stores full `MarkScheme` including `markingProfileId`.

Optional V1.1: `subjects.marking_profile_id` default for generation chain.

---

## 10. Out of Scope (Unit 10)

- Route handler wiring (Unit 17)
- Appeals (Unit 22)
- WAEC/NECO profiles (F-41)
- `competency_band` essays

---

_Spec 10 · Marking Framework · July 2026_
