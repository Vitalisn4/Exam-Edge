import { describe, expect, it } from "vitest";

import {
  EXAM_MATH_SAMPLES,
  containsDisallowedLatex,
  hasBalancedBraces,
  isEmptyLatex,
  normalizeLatex,
  validateLatex,
} from "./math";

describe("math validation helpers", () => {
  it("normalizes whitespace", () => {
    expect(normalizeLatex("  x^2  ")).toBe("x^2");
  });

  it("detects empty input", () => {
    expect(isEmptyLatex("   ")).toBe(true);
    expect(isEmptyLatex("x")).toBe(false);
  });

  it("validates balanced braces", () => {
    expect(hasBalancedBraces(String.raw`\frac{1}{2}`)).toBe(true);
    expect(hasBalancedBraces(String.raw`\frac{1}{`)).toBe(false);
    expect(hasBalancedBraces(String.raw`}{`)).toBe(false);
  });

  it("rejects disallowed commands", () => {
    expect(containsDisallowedLatex(String.raw`\href{https://evil.com}{x}`)).toBe(true);
    expect(containsDisallowedLatex(String.raw`\htmlId{evil}{x}`)).toBe(true);
    expect(containsDisallowedLatex(String.raw`\htmlClass{evil}{x}`)).toBe(true);
    expect(containsDisallowedLatex(String.raw`\htmlData{foo=bar}{x}`)).toBe(true);
    expect(containsDisallowedLatex(String.raw`\htmlStyle{color:red}{x}`)).toBe(true);
    expect(containsDisallowedLatex("x^2")).toBe(false);
  });

  it("accepts valid board sample expressions", () => {
    for (const sample of EXAM_MATH_SAMPLES) {
      expect(validateLatex(sample.latex)).toEqual({
        valid: true,
        normalized: sample.latex,
      });
    }
  });

  it("rejects malformed frac without closing brace", () => {
    const result = validateLatex(String.raw`\frac{1}{`);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/brace/i);
    }
  });

  it("rejects empty input", () => {
    const result = validateLatex("");
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/empty/i);
    }
  });
});
