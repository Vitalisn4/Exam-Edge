import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirstMock } = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
}));

vi.mock("../client", () => ({
  db: {
    query: {
      studentSessions: {
        findFirst: findFirstMock,
      },
    },
  },
}));

import { ForbiddenError, NotFoundError } from "../errors";
import { assertSessionOwnership, findSessionForStudent } from "./sessions";

describe("sessions repository", () => {
  beforeEach(() => {
    findFirstMock.mockReset();
  });

  it("returns a session owned by the student", async () => {
    const session = {
      id: "session-1",
      studentId: "student-1",
      subjectId: "subject-1",
      mode: "practice",
      status: "active",
    };
    findFirstMock.mockResolvedValue(session);

    await expect(findSessionForStudent("session-1", "student-1")).resolves.toEqual(session);
  });

  it("throws NotFoundError when the session does not exist", async () => {
    findFirstMock.mockResolvedValue(undefined);

    await expect(findSessionForStudent("missing", "student-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("throws ForbiddenError when a different student requests the session", async () => {
    findFirstMock.mockResolvedValueOnce({
      id: "session-1",
      studentId: "student-1",
    });

    await expect(assertSessionOwnership("session-1", "student-2")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});
