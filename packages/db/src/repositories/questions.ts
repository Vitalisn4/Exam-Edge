import { and, eq } from "drizzle-orm";

import { db } from "../client";
import type { NewQuestion, Question } from "../schema";
import { questions } from "../schema";

export type CreateQuestionInput = Omit<NewQuestion, "id" | "createdAt" | "validated"> & {
  validated?: boolean;
};

export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  const [row] = await db
    .insert(questions)
    .values({
      ...input,
      validated: input.validated ?? false,
    })
    .returning();

  if (!row) throw new Error("Failed to create question");
  return row;
}

export async function findQuestionById(questionId: string): Promise<Question | undefined> {
  return db.query.questions.findFirst({
    where: eq(questions.id, questionId),
  });
}

export async function listValidatedQuestionsByTopic(topicId: string): Promise<Question[]> {
  return db.query.questions.findMany({
    where: and(eq(questions.topicId, topicId), eq(questions.validated, true)),
  });
}

export async function updateQuestion(
  questionId: string,
  updates: Partial<
    Pick<
      NewQuestion,
      | "templateText"
      | "paramSchema"
      | "markScheme"
      | "validated"
      | "validatedBy"
      | "validationNotes"
    >
  >,
): Promise<Question | undefined> {
  const [row] = await db
    .update(questions)
    .set(updates)
    .where(eq(questions.id, questionId))
    .returning();
  return row;
}

export async function deleteQuestion(questionId: string): Promise<Question | undefined> {
  const [row] = await db.delete(questions).where(eq(questions.id, questionId)).returning();
  return row;
}
