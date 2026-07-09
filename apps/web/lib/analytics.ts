/**
 * Plausible analytics wrapper (Unit 07 foundation).
 * No-ops on SSR and when the script is not loaded.
 */

export const ANALYTICS_EVENTS = [
  "session_started",
  "answer_submitted",
  "hint_requested",
  "exam_completed",
  "topic_mastered",
  "offline_sync",
  "appeal_submitted",
  "register_cta_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type RegisterCtaLocation =
  "navbar" | "hero" | "pricing_free" | "pricing_student" | "pricing_school" | "bottom_cta";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  props?: Record<string, string | number>,
): void {
  if (typeof window === "undefined" || typeof window.plausible !== "function") {
    return;
  }

  window.plausible(name, props ? { props } : undefined);
}

export function trackRegisterCta(location: RegisterCtaLocation): void {
  trackEvent("register_cta_clicked", { location });
}
