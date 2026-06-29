import { APP_VERSION } from "@examedge/shared";
import { NextResponse } from "next/server";

export function GET(): NextResponse {
  if (process.env.NODE_ENV === "development") {
    console.log("[health] ok");
  }

  return NextResponse.json({
    status: "ok",
    version: APP_VERSION,
  });
}
