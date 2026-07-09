import { and, eq } from "drizzle-orm";

import { db } from "../client";
import type { Curriculum, NewCurriculum, NewSubject, NewTopic, Subject, Topic } from "../schema";
import { curricula, subjects, topics } from "../schema";

export async function createCurriculum(input: NewCurriculum): Promise<Curriculum> {
  const [row] = await db.insert(curricula).values(input).returning();
  if (!row) throw new Error("Failed to create curriculum");
  return row;
}

export async function findCurriculumByCode(code: string): Promise<Curriculum | undefined> {
  return db.query.curricula.findFirst({
    where: eq(curricula.code, code),
  });
}

export async function createSubject(input: NewSubject): Promise<Subject> {
  const [row] = await db.insert(subjects).values(input).returning();
  if (!row) throw new Error("Failed to create subject");
  return row;
}

export async function findSubjectByCode(
  curriculumId: string,
  code: string,
): Promise<Subject | undefined> {
  return db.query.subjects.findFirst({
    where: and(eq(subjects.curriculumId, curriculumId), eq(subjects.code, code)),
  });
}

export async function listSubjectsByCurriculum(curriculumId: string): Promise<Subject[]> {
  return db.query.subjects.findMany({
    where: eq(subjects.curriculumId, curriculumId),
  });
}

export async function createTopic(input: NewTopic): Promise<Topic> {
  const [row] = await db.insert(topics).values(input).returning();
  if (!row) throw new Error("Failed to create topic");
  return row;
}

export async function findTopicBySlug(subjectId: string, slug: string): Promise<Topic | undefined> {
  return db.query.topics.findFirst({
    where: and(eq(topics.subjectId, subjectId), eq(topics.slug, slug)),
  });
}

export async function listTopicsBySubject(subjectId: string): Promise<Topic[]> {
  return db.query.topics.findMany({
    where: eq(topics.subjectId, subjectId),
  });
}

export async function updateTopic(
  topicId: string,
  updates: Partial<Pick<NewTopic, "name" | "syllabusRef" | "examWeight" | "difficultyBand">>,
): Promise<Topic | undefined> {
  const [row] = await db.update(topics).set(updates).where(eq(topics.id, topicId)).returning();
  return row;
}

export async function deleteTopic(topicId: string): Promise<Topic | undefined> {
  const [row] = await db.delete(topics).where(eq(topics.id, topicId)).returning();
  return row;
}
