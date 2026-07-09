import { eq, isNull } from "drizzle-orm";

import { db } from "../client";
import type { NewUser, User } from "../schema";
import { users } from "../schema";

export type CreateUserInput = Pick<
  NewUser,
  "email" | "name" | "role" | "passwordHash" | "preferences"
>;

export async function createUser(input: CreateUserInput): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      email: input.email,
      name: input.name,
      role: input.role ?? "student",
      passwordHash: input.passwordHash,
      preferences: input.preferences,
    })
    .returning();

  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

export async function findUserById(userId: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function updateUser(
  userId: string,
  updates: Partial<Pick<NewUser, "name" | "preferences" | "passwordHash" | "emailVerified">>,
): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return user;
}

export async function softDeleteUser(userId: string): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return user;
}

export async function listActiveUsers(): Promise<User[]> {
  return db.query.users.findMany({
    where: isNull(users.deletedAt),
  });
}
