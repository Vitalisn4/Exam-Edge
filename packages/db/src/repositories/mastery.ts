import { and, eq, sql } from "drizzle-orm";

import { db } from "../client";
import { NotFoundError } from "../errors";
import type { MasteryRecord, NewMasteryRecord } from "../schema";
import { masteryRecords } from "../schema";

export type UpsertMasteryInput = Pick<
  NewMasteryRecord,
  "studentId" | "topicId" | "masteryLevel" | "accuracyRate" | "sessionsCount" | "mvsHistory"
>;

export async function upsertMasteryRecord(input: UpsertMasteryInput): Promise<MasteryRecord> {
  const [row] = await db
    .insert(masteryRecords)
    .values({
      studentId: input.studentId,
      topicId: input.topicId,
      masteryLevel: input.masteryLevel,
      accuracyRate: input.accuracyRate,
      sessionsCount: input.sessionsCount,
      mvsHistory: input.mvsHistory,
      lastUpdated: new Date(),
    })
    .onConflictDoUpdate({
      target: [masteryRecords.studentId, masteryRecords.topicId],
      set: {
        masteryLevel: input.masteryLevel,
        accuracyRate: input.accuracyRate,
        sessionsCount: input.sessionsCount,
        mvsHistory: input.mvsHistory,
        lastUpdated: new Date(),
        version: sql`${masteryRecords.version} + 1`,
      },
    })
    .returning();

  if (!row) throw new Error("Failed to upsert mastery record");
  return row;
}

export async function findMasteryRecord(
  studentId: string,
  topicId: string,
): Promise<MasteryRecord | undefined> {
  return db.query.masteryRecords.findFirst({
    where: and(eq(masteryRecords.studentId, studentId), eq(masteryRecords.topicId, topicId)),
  });
}

export async function listMasteryForStudent(studentId: string): Promise<MasteryRecord[]> {
  return db.query.masteryRecords.findMany({
    where: eq(masteryRecords.studentId, studentId),
  });
}

export async function updateMasteryWithVersion(
  studentId: string,
  topicId: string,
  expectedVersion: number,
  updates: Partial<
    Pick<
      NewMasteryRecord,
      | "masteryLevel"
      | "accuracyRate"
      | "sessionsCount"
      | "mvsHistory"
      | "nextReview"
      | "intervalDays"
    >
  >,
): Promise<MasteryRecord> {
  const [row] = await db
    .update(masteryRecords)
    .set({
      ...updates,
      lastUpdated: new Date(),
      version: sql`${masteryRecords.version} + 1`,
    })
    .where(
      and(
        eq(masteryRecords.studentId, studentId),
        eq(masteryRecords.topicId, topicId),
        eq(masteryRecords.version, expectedVersion),
      ),
    )
    .returning();

  if (!row) {
    throw new NotFoundError("Mastery record not found or version conflict");
  }

  return row;
}

export async function deleteMasteryRecord(
  studentId: string,
  topicId: string,
): Promise<MasteryRecord | undefined> {
  const [row] = await db
    .delete(masteryRecords)
    .where(and(eq(masteryRecords.studentId, studentId), eq(masteryRecords.topicId, topicId)))
    .returning();

  return row;
}
