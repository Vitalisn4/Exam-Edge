# UI Registry — ExamEdge

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes and structure
3. If no — build following ui-rules.md and ui-tokens.md, then add entry here

After building any component — update this file with: component name, file path, key props, and primary Tailwind classes used.

---

## Layout Components

_Empty — populate as built._

| Component     | Path                                  | Notes       |
| ------------- | ------------------------------------- | ----------- |
| Navbar        | `components/layout/Navbar.tsx`        | _Not built_ |
| OfflineBanner | `components/layout/OfflineBanner.tsx` | _Not built_ |

## Landing Components (Unit 03)

| Component  | Path                                | Notes       |
| ---------- | ----------------------------------- | ----------- |
| Hero       | `components/landing/Hero.tsx`       | _Not built_ |
| Features   | `components/landing/Features.tsx`   | _Not built_ |
| HowItWorks | `components/landing/HowItWorks.tsx` | _Not built_ |
| Footer     | `components/layout/Footer.tsx`      | _Not built_ |

---

## Progress Components (Units 21–22)

| Component          | Path                                         | Notes       |
| ------------------ | -------------------------------------------- | ----------- |
| ProgressSummary    | `components/progress/ProgressSummary.tsx`    | _Not built_ |
| SessionHistoryList | `components/progress/SessionHistoryList.tsx` | _Not built_ |
| AppealsList        | `components/progress/AppealsList.tsx`        | _Not built_ |
| AppealModal        | `components/assessment/AppealModal.tsx`      | _Not built_ |

## Profile Components (Unit 23)

| Component          | Path                                        | Notes       |
| ------------------ | ------------------------------------------- | ----------- |
| ProfileSettings    | `components/profile/ProfileSettings.tsx`    | _Not built_ |
| SubjectPreferences | `components/profile/SubjectPreferences.tsx` | _Not built_ |
| PrivacyControls    | `components/profile/PrivacyControls.tsx`    | _Not built_ |

## Curriculum Components (Unit 20)

| Component         | Path                                          | Notes       |
| ----------------- | --------------------------------------------- | ----------- |
| TopicExplainPanel | `components/curriculum/TopicExplainPanel.tsx` | _Not built_ |

---

| Component   | Path                              | Notes                         |
| ----------- | --------------------------------- | ----------------------------- |
| MathDisplay | `components/math/MathDisplay.tsx` | KaTeX wrapper, error boundary |
| MathInput   | `components/math/MathInput.tsx`   | MathQuill, client-only        |

---

## Assessment Components

| Component      | Path                                       | Notes       |
| -------------- | ------------------------------------------ | ----------- |
| QuestionCard   | `components/assessment/QuestionCard.tsx`   | _Not built_ |
| MarkingDisplay | `components/assessment/MarkingDisplay.tsx` | _Not built_ |
| HintPanel      | `components/assessment/HintPanel.tsx`      | _Not built_ |
| UVEProbeModal  | `components/assessment/UVEProbeModal.tsx`  | _Not built_ |
| PhotoUpload    | `components/assessment/PhotoUpload.tsx`    | _Not built_ |

---

## Progress Components

| Component      | Path                                     | Notes       |
| -------------- | ---------------------------------------- | ----------- |
| MasteryMap     | `components/progress/MasteryMap.tsx`     | _Not built_ |
| TopicBadge     | `components/progress/TopicBadge.tsx`     | _Not built_ |
| StreakDisplay  | `components/progress/StreakDisplay.tsx`  | _Not built_ |
| ReadinessScore | `components/progress/ReadinessScore.tsx` | _Not built_ |

---

## Exam Components

| Component     | Path                                | Notes       |
| ------------- | ----------------------------------- | ----------- |
| ExamTimer     | `components/exam/ExamTimer.tsx`     | _Not built_ |
| ExamReport    | `components/exam/ExamReport.tsx`    | _Not built_ |
| FocusBreakLog | `components/exam/FocusBreakLog.tsx` | _Not built_ |

---

## UI Primitives (shadcn)

Installed Unit 02 — themed with ExamEdge tokens from `globals.css`.

| Component | Path                         | Variants / notes                                                                 |
| --------- | ---------------------------- | -------------------------------------------------------------------------------- |
| Button    | `components/ui/button.tsx`   | `default`, `secondary`, `hint`, `destructive`, `ghost`, `link` — min-h-11 (44px) |
| Input     | `components/ui/input.tsx`    | min-h-11, 16px text, focus ring                                                  |
| Card      | `components/ui/card.tsx`     | Header, Title, Description, Content, Footer                                      |
| Badge     | `components/ui/badge.tsx`    | mastery + mark type variants                                                     |
| Dialog    | `components/ui/dialog.tsx`   | Radix dialog, mobile-friendly width                                              |
| Skeleton  | `components/ui/skeleton.tsx` | Pulse loader                                                                     |
| Toast     | `components/ui/toast.tsx`    | Sonner Toaster + `toast()` helper                                                |

**Dev preview:** `app/dev/ui/page.tsx` — all tokens and primitives (not in production nav).

**Utilities:** `lib/utils.ts` — `cn()` for class merging.

---

## Page Compositions

| Page            | Path                                         | Key Components Used |
| --------------- | -------------------------------------------- | ------------------- |
| Dashboard       | `app/(student)/dashboard/page.tsx`           | _Not built_         |
| Study Session   | `app/(student)/study/[topicId]/page.tsx`     | _Not built_         |
| Exam Simulation | `app/(student)/exam/[simulationId]/page.tsx` | _Not built_         |
| Admin Queue     | `app/(admin)/questions/page.tsx`             | _Not built_         |
