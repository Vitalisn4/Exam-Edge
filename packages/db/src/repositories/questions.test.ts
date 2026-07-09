import { beforeEach, describe, expect, it, vi } from "vitest";

const { returningMock, valuesMock, insertMock, findManyMock } = vi.hoisted(() => {
  const returningMock = vi.fn();
  const valuesMock = vi.fn(() => ({ returning: returningMock }));
  const insertMock = vi.fn(() => ({ values: valuesMock }));
  const findManyMock = vi.fn();

  return { returningMock, valuesMock, insertMock, findManyMock };
});

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    query: {
      questions: { findMany: findManyMock },
    },
  },
}));

import { createQuestion, listValidatedQuestionsByTopic } from "./questions";

describe("questions repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a question with validated defaulting to false", async () => {
    const created = {
      id: "question-1",
      topicId: "topic-1",
      validated: false,
    };
    returningMock.mockResolvedValue([created]);

    await expect(
      createQuestion({
        topicId: "topic-1",
        templateText: "Find {a}x + {b}",
        paramSchema: { a: { min: 1, max: 5 } },
        markScheme: { steps: [] },
        difficulty: 2,
        marksTotal: 4,
      }),
    ).resolves.toEqual(created);

    expect(valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        validated: false,
      }),
    );
  });

  it("lists only validated questions for a topic", async () => {
    const questions = [{ id: "question-1", validated: true }];
    findManyMock.mockResolvedValue(questions);

    await expect(listValidatedQuestionsByTopic("topic-1")).resolves.toEqual(questions);
  });
});
