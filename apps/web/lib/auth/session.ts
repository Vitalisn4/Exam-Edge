export const AUTH_SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.session-token",
] as const;

export function hasAuthenticatedSession(cookieHeader: string | null | undefined): boolean {
  if (!cookieHeader) {
    return false;
  }

  return AUTH_SESSION_COOKIE_NAMES.some((name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|;\\s*)${escaped}=[^;]+`).test(cookieHeader);
  });
}
