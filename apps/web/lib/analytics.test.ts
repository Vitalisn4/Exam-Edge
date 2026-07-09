import { afterEach, describe, expect, it, vi } from "vitest";

import { trackEvent, trackRegisterCta } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete (globalThis as { window?: Window }).window;
  });

  it("no-ops when window.plausible is missing", () => {
    vi.stubGlobal("window", {});
    expect(() => {
      trackEvent("register_cta_clicked", { location: "hero" });
    }).not.toThrow();
  });

  it("calls window.plausible with props", () => {
    const plausible = vi.fn();
    vi.stubGlobal("window", { plausible });

    trackEvent("register_cta_clicked", { location: "hero" });

    expect(plausible).toHaveBeenCalledWith("register_cta_clicked", {
      props: { location: "hero" },
    });
  });

  it("trackRegisterCta uses register_cta_clicked event", () => {
    const plausible = vi.fn();
    vi.stubGlobal("window", { plausible });

    trackRegisterCta("navbar");

    expect(plausible).toHaveBeenCalledWith("register_cta_clicked", {
      props: { location: "navbar" },
    });
  });
});
