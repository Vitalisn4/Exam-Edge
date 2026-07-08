import katex from "katex";
import { describe, expect, it } from "vitest";

import { GCE_MATH_SAMPLES } from "@examedge/shared";

describe("KaTeX rendering", () => {
  it("renders all GCE sample expressions with trust disabled", () => {
    for (const sample of GCE_MATH_SAMPLES) {
      expect(() =>
        katex.renderToString(sample.latex, {
          displayMode: true,
          throwOnError: true,
          trust: false,
        }),
      ).not.toThrow();
    }
  });

  it("throws on malformed LaTeX instead of silently accepting", () => {
    expect(() =>
      katex.renderToString(String.raw`\frac{1}{`, {
        displayMode: true,
        throwOnError: true,
        trust: false,
      }),
    ).toThrow();
  });
});
