import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { ForbiddenError, NotFoundError } from "../errors";
import type { NewStudentResponse, StudentResponse } from "../schema";
import { studentResponses, studentSessions } from "../schema";

export type CreateResponseInput = Omit<NewStudentResponse, "id" | "submittedAt">;

export async function createResponse(
  studentId: string,
  input: CreateResponseInput,
): Promise<StudentResponse> {
  const session = await db.query.studentSessions.findFirst({
    where: eq(studentSessions.id, input.sessionId),
  });

  if (!session) {
    throw new NotFoundError("Session not found");
  }
  if (session.studentId !== studentId) {
    throw new ForbiddenError("Session access denied");
  }

  const [row] = await db.insert(studentResponses).values(input).returning();
  if (!row) throw new Error("Failed to create response");
  return row;
}

export async function findResponseById(responseId: string): Promise<StudentResponse | undefined> {
  return db.query.studentResponses.findFirst({
    where: eq(studentResponses.id, responseId),
  });
}

export async function findResponseByIdempotencyKey(
  idempotencyKey: string,
): Promise<StudentResponse | undefined> {
  return db.query.studentResponses.findFirst({
    where: eq(studentResponses.idempotencyKey, idempotencyKey),
  });
}

export async function listResponsesForSession(sessionId: string): Promise<StudentResponse[]> {
  return db.query.studentResponses.findMany({
    where: eq(studentResponses.sessionId, sessionId),
  });
}

export async function updateResponse(
  responseId: string,
  updates: Partial<
    Pick<
      NewStudentResponse,
      "marksAwarded" | "aiConfidence" | "manualReview" | "uveProbes" | "mvsScore"
    >
  >,
): Promise<StudentResponse | undefined> {
  const [row] = await db
    .update(studentResponses)
    .set(updates)
    .where(eq(studentResponses.id, responseId))
    .returning();

  return row;
}

export async function findResponseForStudent(
  responseId: string,
  studentId: string,
): Promise<StudentResponse> {
  const response = await findResponseById(responseId);
  if (!response) {
    throw new NotFoundError("Response not found");
  }

  const session = await db.query.studentSessions.findFirst({
    where: and(
      eq(studentSessions.id, response.sessionId),
      eq(studentSessions.studentId, studentId),
    ),
  });

  if (!session) {
    throw new ForbiddenError("Response access denied");
  }

  return response;
}
