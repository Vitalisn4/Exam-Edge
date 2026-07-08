import { describe, expect, it } from "vitest";

import { isTheme } from "./theme";

describe("theme helpers", () => {
  it("validates theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});
