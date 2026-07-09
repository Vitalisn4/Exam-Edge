import { beforeEach, describe, expect, it, vi } from "vitest";

const { returningMock, insertMock, findFirstMock } = vi.hoisted(() => {
  const returningMock = vi.fn();
  const valuesMock = vi.fn(() => ({ returning: returningMock }));
  const insertMock = vi.fn(() => ({ values: valuesMock }));
  const findFirstMock = vi.fn();

  return { returningMock, insertMock, findFirstMock };
});

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    query: {
      curricula: { findFirst: findFirstMock },
    },
  },
}));

import { createCurriculum, findCurriculumByCode } from "./curriculum";

describe("curriculum repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a curriculum row", async () => {
    const created = { id: "curr-1", code: "GCE_AL", name: "GCE A-Level" };
    returningMock.mockResolvedValue([created]);

    await expect(
      createCurriculum({
        code: "GCE_AL",
        name: "GCE A-Level",
        country: "Cameroon",
        language: "en",
      }),
    ).resolves.toEqual(created);
  });

  it("finds a curriculum by code", async () => {
    const curriculum = { id: "curr-1", code: "GCE_AL" };
    findFirstMock.mockResolvedValue(curriculum);

    await expect(findCurriculumByCode("GCE_AL")).resolves.toEqual(curriculum);
  });
});
