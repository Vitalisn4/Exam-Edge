import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  returningMock,
  valuesMock,
  insertMock,
  findFirstMock,
  findManyMock,
  updateReturningMock,
  updateMock,
} = vi.hoisted(() => {
  const returningMock = vi.fn();
  const valuesMock = vi.fn(() => ({ returning: returningMock }));
  const insertMock = vi.fn(() => ({ values: valuesMock }));
  const findFirstMock = vi.fn();
  const findManyMock = vi.fn();
  const updateReturningMock = vi.fn();
  const updateWhereMock = vi.fn(() => ({ returning: updateReturningMock }));
  const updateSetMock = vi.fn(() => ({ where: updateWhereMock }));
  const updateMock = vi.fn(() => ({ set: updateSetMock }));

  return {
    returningMock,
    valuesMock,
    insertMock,
    findFirstMock,
    findManyMock,
    updateReturningMock,
    updateMock,
  };
});

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    update: updateMock,
    query: {
      users: {
        findFirst: findFirstMock,
        findMany: findManyMock,
      },
    },
  },
}));

import { createUser, findUserByEmail, softDeleteUser, updateUser } from "./users";

describe("users repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a user and returns the inserted row", async () => {
    const created = {
      id: "user-1",
      email: "student@example.com",
      name: "Student",
      role: "student",
    };
    returningMock.mockResolvedValue([created]);

    await expect(
      createUser({
        email: "student@example.com",
        name: "Student",
        role: "student",
        passwordHash: "hash",
      }),
    ).resolves.toEqual(created);

    expect(insertMock).toHaveBeenCalledOnce();
    expect(valuesMock).toHaveBeenCalledOnce();
  });

  it("finds a user by email", async () => {
    const user = { id: "user-1", email: "student@example.com" };
    findFirstMock.mockResolvedValue(user);

    await expect(findUserByEmail("student@example.com")).resolves.toEqual(user);
  });

  it("updates a user profile", async () => {
    const updated = { id: "user-1", name: "Updated Name" };
    updateReturningMock.mockResolvedValue([updated]);

    await expect(updateUser("user-1", { name: "Updated Name" })).resolves.toEqual(updated);
  });

  it("soft deletes a user", async () => {
    const deleted = { id: "user-1", deletedAt: new Date() };
    updateReturningMock.mockResolvedValue([deleted]);

    await expect(softDeleteUser("user-1")).resolves.toEqual(deleted);
  });
});
