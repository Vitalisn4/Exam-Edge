import { describe, expect, it } from "vitest";

import { EXAM_MATH_SAMPLES } from "@examedge/shared";

import { renderLatex } from "./MathDisplay";

describe("renderLatex", () => {
  it("renders all board sample expressions with trust disabled", () => {
    for (const sample of EXAM_MATH_SAMPLES) {
      const result = renderLatex(sample.latex, true);
      expect(result.error).toBeNull();
      expect(result.html).toBeTruthy();
    }
  });

  it("returns an error for malformed LaTeX instead of throwing", () => {
    const result = renderLatex(String.raw`\frac{1}{`, true);
    expect(result.html).toBeNull();
    expect(result.error).toBeTruthy();
  });
});
