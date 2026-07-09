/**
 * LaTeX validation helpers for student math input.
 * Rendering stays in apps/web — these run at validation boundaries only.
 */

export type LatexValidationResult =
  { valid: true; normalized: string } | { valid: false; error: string };

const DISALLOWED_LATEX_PATTERN = /\\(?:html|href|url|includegraphics)\b|javascript:/i;

/** Standard LaTeX samples for African examination boards (GCE Board Buea, WAEC, KCSE, etc.). */
export const EXAM_MATH_SAMPLES = [
  {
    id: "differentiation",
    label: "Differentiation (A-Level Pure Maths)",
    latex: String.raw`\frac{d}{dx}(3x^2 - 12x + 7)`,
    topic: "Calculus",
    boards: ["GCE_BUEA", "WAEC", "KCSE"] as const,
  },
  {
    id: "integration",
    label: "Definite integral (A-Level Pure Maths)",
    latex: String.raw`\int_0^1 x^2 \, dx`,
    topic: "Calculus",
    boards: ["GCE_BUEA", "WAEC", "KCSE"] as const,
  },
  {
    id: "vectors",
    label: "Newton's second law (Mechanics)",
    latex: String.raw`\vec{F} = m\vec{a}`,
    topic: "Vectors & Mechanics",
    boards: ["GCE_BUEA", "WAEC", "KCSE"] as const,
  },
  {
    id: "magnitude",
    label: "Vector magnitude (O-Level)",
    latex: String.raw`\sqrt{x^2 + y^2}`,
    topic: "Vectors",
    boards: ["GCE_BUEA", "WAEC", "KCSE"] as const,
  },
  {
    id: "quadratic",
    label: "Quadratic formula (O-Level / WAEC)",
    latex: String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
    topic: "Algebra",
    boards: ["GCE_BUEA", "WAEC", "KCSE"] as const,
  },
] as const;

/** @deprecated Use EXAM_MATH_SAMPLES — kept for existing imports */
export const GCE_MATH_SAMPLES = EXAM_MATH_SAMPLES;

export function isEmptyLatex(latex: string): boolean {
  return latex.trim().length === 0;
}

export function hasBalancedBraces(latex: string): boolean {
  let depth = 0;

  for (const char of latex) {
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth < 0) {
        return false;
      }
    }
  }

  return depth === 0;
}

export function containsDisallowedLatex(latex: string): boolean {
  return DISALLOWED_LATEX_PATTERN.test(latex);
}

export function normalizeLatex(latex: string): string {
  return latex.trim();
}

/**
 * Lightweight structural validation before API submission.
 * KaTeX parse/render in MathDisplay is the authoritative render check.
 */
export function validateLatex(latex: string): LatexValidationResult {
  const normalized = normalizeLatex(latex);

  if (isEmptyLatex(normalized)) {
    return { valid: false, error: "Expression is empty" };
  }

  if (!hasBalancedBraces(normalized)) {
    return { valid: false, error: "Unbalanced braces in expression" };
  }

  if (containsDisallowedLatex(normalized)) {
    return { valid: false, error: "Disallowed LaTeX command" };
  }

  if (normalized.length > 4_000) {
    return { valid: false, error: "Expression is too long" };
  }

  return { valid: true, normalized };
}
