import { beforeEach, describe, expect, it, vi } from "vitest";

const { sessionFindFirstMock, responseFindFirstMock, returningMock, insertMock } = vi.hoisted(
  () => {
    const sessionFindFirstMock = vi.fn();
    const responseFindFirstMock = vi.fn();
    const returningMock = vi.fn();
    const valuesMock = vi.fn(() => ({ returning: returningMock }));
    const insertMock = vi.fn(() => ({ values: valuesMock }));

    return {
      sessionFindFirstMock,
      responseFindFirstMock,
      returningMock,
      insertMock,
    };
  },
);

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    query: {
      studentSessions: {
        findFirst: sessionFindFirstMock,
      },
      studentResponses: {
        findFirst: responseFindFirstMock,
      },
    },
  },
}));

import { ForbiddenError, NotFoundError } from "../errors";
import { createResponse, findResponseForStudent } from "./responses";

describe("responses repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a response when the session belongs to the student", async () => {
    sessionFindFirstMock.mockResolvedValue({
      id: "session-1",
      studentId: "student-1",
    });
    const created = {
      id: "response-1",
      sessionId: "session-1",
      idempotencyKey: "00000000-0000-4000-8000-000000000001",
    };
    returningMock.mockResolvedValue([created]);

    await expect(
      createResponse("student-1", {
        sessionId: "session-1",
        questionId: "question-1",
        renderedText: "Solve x^2 = 4",
        idempotencyKey: "00000000-0000-4000-8000-000000000001",
      }),
    ).resolves.toEqual(created);
  });

  it("rejects response creation for another student's session", async () => {
    sessionFindFirstMock.mockResolvedValue({
      id: "session-1",
      studentId: "student-1",
    });

    await expect(
      createResponse("student-2", {
        sessionId: "session-1",
        questionId: "question-1",
        renderedText: "Solve x^2 = 4",
        idempotencyKey: "00000000-0000-4000-8000-000000000002",
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("returns a response only for the owning student", async () => {
    responseFindFirstMock.mockResolvedValue({
      id: "response-1",
      sessionId: "session-1",
    });
    sessionFindFirstMock.mockResolvedValue({
      id: "session-1",
      studentId: "student-1",
    });

    await expect(findResponseForStudent("response-1", "student-1")).resolves.toMatchObject({
      id: "response-1",
    });
  });

  it("throws when the response does not exist", async () => {
    responseFindFirstMock.mockResolvedValue(undefined);

    await expect(findResponseForStudent("missing", "student-1")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
