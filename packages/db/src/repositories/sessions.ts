import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { ForbiddenError, NotFoundError } from "../errors";
import type { NewStudentSession, StudentSession } from "../schema";
import { studentSessions } from "../schema";

export type CreateSessionInput = Pick<
  NewStudentSession,
  "studentId" | "subjectId" | "mode" | "metadata"
>;

export async function createSession(input: CreateSessionInput): Promise<StudentSession> {
  const [row] = await db
    .insert(studentSessions)
    .values({
      studentId: input.studentId,
      subjectId: input.subjectId,
      mode: input.mode,
      metadata: input.metadata,
    })
    .returning();

  if (!row) throw new Error("Failed to create session");
  return row;
}

export async function findSessionById(sessionId: string): Promise<StudentSession | undefined> {
  return db.query.studentSessions.findFirst({
    where: eq(studentSessions.id, sessionId),
  });
}

export async function findSessionForStudent(
  sessionId: string,
  studentId: string,
): Promise<StudentSession> {
  const session = await db.query.studentSessions.findFirst({
    where: and(eq(studentSessions.id, sessionId), eq(studentSessions.studentId, studentId)),
  });

  if (!session) {
    throw new NotFoundError("Session not found");
  }

  return session;
}

export async function assertSessionOwnership(
  sessionId: string,
  studentId: string,
): Promise<StudentSession> {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw new NotFoundError("Session not found");
  }
  if (session.studentId !== studentId) {
    throw new ForbiddenError("Session access denied");
  }
  return session;
}

export async function updateSession(
  sessionId: string,
  updates: Partial<
    Pick<
      NewStudentSession,
      "status" | "questionsAttempted" | "marksTotal" | "marksAwarded" | "focusBreaks" | "endedAt"
    >
  >,
): Promise<StudentSession | undefined> {
  const [row] = await db
    .update(studentSessions)
    .set(updates)
    .where(eq(studentSessions.id, sessionId))
    .returning();

  return row;
}

export async function listSessionsForStudent(studentId: string): Promise<StudentSession[]> {
  return db.query.studentSessions.findMany({
    where: eq(studentSessions.studentId, studentId),
  });
}

export async function deleteSession(sessionId: string): Promise<StudentSession | undefined> {
  const [row] = await db
    .delete(studentSessions)
    .where(eq(studentSessions.id, sessionId))
    .returning();
  return row;
}
