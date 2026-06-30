import { describe, expect, it } from "vitest";

import { hasAuthenticatedSession, shouldRedirectHomeToDashboard } from "./session";

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

  it("returns true when host authjs cookie is present", () => {
    expect(hasAuthenticatedSession("__Host-authjs.session-token=abc123")).toBe(true);
  });
});

describe("shouldRedirectHomeToDashboard", () => {
  it("returns false for unauthenticated visitors on home", () => {
    expect(shouldRedirectHomeToDashboard("/", null)).toBe(false);
    expect(shouldRedirectHomeToDashboard("/", "theme=dark")).toBe(false);
  });

  it("returns false for authenticated visitors on other routes", () => {
    expect(shouldRedirectHomeToDashboard("/login", "authjs.session-token=abc")).toBe(false);
    expect(shouldRedirectHomeToDashboard("/dashboard", "authjs.session-token=abc")).toBe(false);
  });

  it("returns true for authenticated visitors on home", () => {
    expect(shouldRedirectHomeToDashboard("/", "authjs.session-token=abc")).toBe(true);
  });
});
