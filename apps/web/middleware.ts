import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { hasAuthenticatedSession } from "@/lib/auth/session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/" && hasAuthenticatedSession(request.headers.get("cookie"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
