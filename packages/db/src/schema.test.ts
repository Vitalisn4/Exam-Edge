import { describe, expect, it } from "vitest";

import {
  auditLog,
  curricula,
  hallucinationRegistry,
  markingAppeals,
  masteryRecords,
  questions,
  studentResponses,
  studentSessions,
  subjects,
  syllabusChunks,
  topicExplanations,
  topics,
  users,
} from "./schema";

describe("database schema", () => {
  it("exports all MVP tables", () => {
    expect(users).toBeDefined();
    expect(curricula).toBeDefined();
    expect(subjects).toBeDefined();
    expect(topics).toBeDefined();
    expect(questions).toBeDefined();
    expect(studentSessions).toBeDefined();
    expect(studentResponses).toBeDefined();
    expect(masteryRecords).toBeDefined();
    expect(markingAppeals).toBeDefined();
    expect(auditLog).toBeDefined();
    expect(topicExplanations).toBeDefined();
    expect(syllabusChunks).toBeDefined();
    expect(hallucinationRegistry).toBeDefined();
  });
});
