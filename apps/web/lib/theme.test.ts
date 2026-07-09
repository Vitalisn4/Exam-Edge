import { afterEach, describe, expect, it, vi } from "vitest";

import { applyTheme, getPreferredTheme, isTheme, persistTheme, THEME_STORAGE_KEY } from "./theme";

describe("isTheme", () => {
  it("validates theme values", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("getPreferredTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns stored theme when valid", () => {
    const getItem = vi.fn().mockReturnValue("dark");
    vi.stubGlobal("localStorage", {
      getItem,
      setItem: vi.fn(),
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });

    expect(getPreferredTheme()).toBe("dark");
    expect(getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it("falls back to system preference when storage is empty", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: true }),
    });

    expect(getPreferredTheme()).toBe("dark");
  });

  it("falls back when localStorage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: vi.fn(),
    });
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: false }),
    });

    expect(getPreferredTheme()).toBe("light");
  });
});

describe("applyTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sets dark class and dataset on documentElement", () => {
    const classList = {
      toggle: vi.fn(),
    };
    const documentElement = {
      classList,
      dataset: {} as DOMStringMap,
    };

    vi.stubGlobal("document", { documentElement });

    applyTheme("dark");

    expect(classList.toggle).toHaveBeenCalledWith("dark", true);
    expect(documentElement.dataset.theme).toBe("dark");
  });
});

describe("persistTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("writes theme to localStorage", () => {
    const setItem = vi.fn();
    vi.stubGlobal("localStorage", { getItem: vi.fn(), setItem });

    persistTheme("light");

    expect(setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "light");
  });

  it("ignores localStorage write failures", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: () => {
        throw new Error("denied");
      },
    });

    expect(() => {
      persistTheme("dark");
    }).not.toThrow();
  });
});
