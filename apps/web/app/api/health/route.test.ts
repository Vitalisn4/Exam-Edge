import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns 200 with correct JSON shape", async () => {
    const response = GET();

    expect(response.status).toBe(200);

    const body: unknown = await response.json();
    expect(body).toEqual({
      status: "ok",
      version: "0.1.0",
    });
  });
});
