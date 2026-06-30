import { describe, expect, it } from "vitest";

import { hasAuthenticatedSession } from "./session";

describe("hasAuthenticatedSession", () => {
  it("returns false when cookie header is missing", () => {
    expect(hasAuthenticatedSession(undefined)).toBe(false);
    expect(hasAuthenticatedSession(null)).toBe(false);
    expect(hasAuthenticatedSession("")).toBe(false);
  });

  it("returns false when no auth session cookie is present", () => {
    expect(hasAuthenticatedSession("theme=dark; locale=en")).toBe(false);
  });

  it("returns true when authjs.session-token is present", () => {
    expect(hasAuthenticatedSession("authjs.session-token=abc123")).toBe(true);
  });

  it("returns true when secure authjs cookie is present", () => {
    expect(hasAuthenticatedSession("__Secure-authjs.session-token=abc123")).toBe(true);
  });

  it("returns true when cookie appears among other cookies", () => {
    expect(hasAuthenticatedSession("theme=dark; authjs.session-token=abc123; locale=en")).toBe(
      true,
    );
  });
});
