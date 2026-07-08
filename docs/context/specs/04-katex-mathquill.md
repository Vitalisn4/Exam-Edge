# Spec 04 — KaTeX + MathQuill Integration

**Unit:** 04  
**Status:** Implemented on `feature/unit-04-katex-mathquill`  
**Branch:** `feature/unit-04-katex-mathquill`

---

## Objective

Mathematical notation for GCE O/A Level — question display (KaTeX) and answer input (MathQuill). Foundation for study sessions (Unit 16).

## Deliverables

| Item               | Path                                             | Notes                                      |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| MathDisplay        | `apps/web/components/math/MathDisplay.tsx`       | KaTeX, `trust: false`, error boundary      |
| MathInput          | `apps/web/components/math/MathInput.tsx`         | MathQuill, dynamic import, `ssr: false`    |
| MathErrorBoundary  | `apps/web/components/math/MathErrorBoundary.tsx` | Prevents render crashes                    |
| Validation helpers | `packages/shared/src/lib/math.ts`                | Brace balance, length, disallowed commands |
| Dev test page      | `apps/web/app/dev/math/page.tsx`                 | 4 GCE samples + input demo                 |

## GCE sample expressions

| Topic                      | LaTeX                          |
| -------------------------- | ------------------------------ |
| Differentiation (A-Level)  | `\frac{d}{dx}(3x^2 - 12x + 7)` |
| Integration (A-Level)      | `\int_0^1 x^2 \, dx`           |
| Vectors / Mechanics        | `\vec{F} = m\vec{a}`           |
| Vector magnitude (O-Level) | `\sqrt{x^2 + y^2}`             |

## Verification checklist

- [x] All 4 sample expressions render on `/dev/math`
- [x] MathInput exports LaTeX string on change
- [x] Bad LaTeX shows error message, page does not crash
- [x] KaTeX `trust: false` in MathDisplay
- [x] MathQuill `addStyles()` in `useEffect` (no SSR)
- [x] `validateLatex` unit tests in `@examedge/shared`
- [x] KaTeX render tests with `trust: false`
- [x] `npm run typecheck`, `npm run lint`, `npm run test` pass

## Out of scope

- QuestionCard integration (Unit 16)
- API answer submission
- Mobile MathQuill (F-32)
