import { beforeEach, describe, expect, it, vi } from "vitest";

const { onConflictReturningMock, insertMock, findFirstMock } = vi.hoisted(() => {
  const returningMock = vi.fn();
  const onConflictReturningMock = vi.fn();
  const onConflictDoUpdateMock = vi.fn(() => ({ returning: onConflictReturningMock }));
  const valuesMock = vi.fn(() => ({
    returning: returningMock,
    onConflictDoUpdate: onConflictDoUpdateMock,
  }));
  const insertMock = vi.fn(() => ({ values: valuesMock }));
  const findFirstMock = vi.fn();

  return {
    onConflictReturningMock,
    insertMock,
    findFirstMock,
  };
});

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    query: {
      masteryRecords: { findFirst: findFirstMock },
    },
  },
}));

import { findMasteryRecord, upsertMasteryRecord } from "./mastery";

describe("mastery repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("upserts a mastery record", async () => {
    onConflictReturningMock.mockResolvedValue([
      {
        id: "mastery-1",
        studentId: "student-1",
        topicId: "topic-1",
        masteryLevel: "0.500",
      },
    ]);

    await expect(
      upsertMasteryRecord({
        studentId: "student-1",
        topicId: "topic-1",
        masteryLevel: "0.500",
        accuracyRate: "0.750",
        sessionsCount: 2,
        mvsHistory: [],
      }),
    ).resolves.toMatchObject({
      studentId: "student-1",
      topicId: "topic-1",
    });
  });

  it("finds a mastery record for a student and topic", async () => {
    const record = { id: "mastery-1", studentId: "student-1", topicId: "topic-1" };
    findFirstMock.mockResolvedValue(record);

    await expect(findMasteryRecord("student-1", "topic-1")).resolves.toEqual(record);
  });
});
