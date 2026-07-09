import { relations, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const vector1536 = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    if (!value || value === "[]") return [];
    return value
      .slice(1, -1)
      .split(",")
      .map((entry) => Number(entry.trim()));
  },
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: text("role").notNull().default("student"),
  passwordHash: text("password_hash"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  cognitiveFp: jsonb("cognitive_fp").$type<Record<string, unknown>>(),
  preferences: jsonb("preferences").$type<Record<string, unknown>>(),
  dateOfBirth: date("date_of_birth"),
  consentGivenAt: timestamp("consent_given_at", { withTimezone: true }),
  consentType: text("consent_type"),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const curricula = pgTable("curricula", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: text("name").notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  language: text("language").notNull().default("en"),
  boardConfig: jsonb("board_config").$type<Record<string, unknown>>(),
});

export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  curriculumId: uuid("curriculum_id")
    .notNull()
    .references(() => curricula.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 20 }).notNull(),
  name: text("name").notNull(),
  level: text("level").notNull(),
  syllabusRef: text("syllabus_ref"),
});

export const topics = pgTable(
  "topics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    syllabusRef: text("syllabus_ref"),
    prerequisiteIds: uuid("prerequisite_ids")
      .array()
      .notNull()
      .default(sql`'{}'::uuid[]`),
    examWeight: numeric("exam_weight", { precision: 5, scale: 2 }),
    difficultyBand: smallint("difficulty_band"),
    conceptGraph: jsonb("concept_graph").$type<Record<string, unknown>>(),
  },
  (table) => [unique("topics_subject_slug_unique").on(table.subjectId, table.slug)],
);

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  templateText: text("template_text").notNull(),
  paramSchema: jsonb("param_schema").$type<Record<string, unknown>>().notNull(),
  markScheme: jsonb("mark_scheme").$type<Record<string, unknown>>().notNull(),
  probeLibrary: jsonb("probe_library").$type<Record<string, unknown>>(),
  difficulty: smallint("difficulty").notNull(),
  marksTotal: smallint("marks_total").notNull(),
  questionType: text("question_type").notNull().default("structured"),
  embedding: vector1536("embedding"),
  source: text("source").notNull().default("ai_generated"),
  validated: boolean("validated").notNull().default(false),
  validatedBy: uuid("validated_by").references(() => users.id),
  validationNotes: text("validation_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const studentSessions = pgTable("student_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  mode: text("mode").notNull(),
  status: text("status").notNull().default("active"),
  questionsAttempted: smallint("questions_attempted").notNull().default(0),
  marksTotal: smallint("marks_total").notNull().default(0),
  marksAwarded: smallint("marks_awarded").notNull().default(0),
  focusBreaks: smallint("focus_breaks").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
});

export const studentResponses = pgTable("student_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => studentSessions.id, { onDelete: "cascade" }),
  questionId: uuid("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  renderedText: text("rendered_text").notNull(),
  appliedParams: jsonb("applied_params").$type<Record<string, unknown>>(),
  answerText: text("answer_text"),
  answerType: text("answer_type").notNull().default("text"),
  answerMediaUrl: text("answer_media_url"),
  marksAwarded: jsonb("marks_awarded").$type<Record<string, unknown>>(),
  aiConfidence: numeric("ai_confidence", { precision: 4, scale: 3 }),
  manualReview: boolean("manual_review").notNull().default(false),
  hintsUsed: smallint("hints_used").notNull().default(0),
  uveProbes: jsonb("uve_probes").$type<Record<string, unknown>>(),
  mvsScore: numeric("mvs_score", { precision: 4, scale: 3 }),
  timeTakenS: integer("time_taken_s"),
  idempotencyKey: uuid("idempotency_key").notNull().unique(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const masteryRecords = pgTable(
  "mastery_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    masteryLevel: numeric("mastery_level", { precision: 4, scale: 3 }).notNull().default("0"),
    mvsHistory: jsonb("mvs_history")
      .$type<unknown[]>()
      .default(sql`'[]'::jsonb`),
    sessionsCount: integer("sessions_count").notNull().default(0),
    accuracyRate: numeric("accuracy_rate", { precision: 4, scale: 3 }).notNull().default("0"),
    nextReview: timestamp("next_review", { withTimezone: true }),
    easeFactor: numeric("ease_factor", { precision: 4, scale: 2 }).notNull().default("2.50"),
    intervalDays: smallint("interval_days").notNull().default(1),
    version: integer("version").notNull().default(1),
    lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique("mastery_records_student_topic_unique").on(table.studentId, table.topicId)],
);

export const markingAppeals = pgTable("marking_appeals", {
  id: uuid("id").primaryKey().defaultRandom(),
  responseId: uuid("response_id")
    .notNull()
    .references(() => studentResponses.id, { onDelete: "cascade" }),
  studentId: uuid("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  resolution: text("resolution"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const topicExplanations = pgTable(
  "topic_explanations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    board: text("board").notNull(),
    level: text("level").notNull(),
    language: text("language").notNull().default("en"),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    syllabusChunkVersion: integer("syllabus_chunk_version"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("topic_explanations_topic_board_level_lang_unique").on(
      table.topicId,
      table.board,
      table.level,
      table.language,
    ),
  ],
);

export const syllabusChunks = pgTable("syllabus_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  board: text("board").notNull(),
  level: text("level").notNull(),
  language: text("language").notNull().default("en"),
  text: text("text").notNull(),
  sourceRef: text("source_ref"),
  version: integer("version").notNull().default(1),
  effectiveFrom: date("effective_from"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const hallucinationRegistry = pgTable("hallucination_registry", {
  id: uuid("id").primaryKey().defaultRandom(),
  chainType: text("chain_type").notNull(),
  modelVersion: text("model_version").notNull(),
  promptTemplateVersion: text("prompt_template_version").notNull(),
  natureOfError: text("nature_of_error").notNull(),
  resolution: text("resolution"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(studentSessions),
  masteryRecords: many(masteryRecords),
}));

export const curriculaRelations = relations(curricula, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  curriculum: one(curricula, {
    fields: [subjects.curriculumId],
    references: [curricula.id],
  }),
  topics: many(topics),
  sessions: many(studentSessions),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
  questions: many(questions),
  masteryRecords: many(masteryRecords),
}));

export const studentSessionsRelations = relations(studentSessions, ({ one, many }) => ({
  student: one(users, {
    fields: [studentSessions.studentId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studentSessions.subjectId],
    references: [subjects.id],
  }),
  responses: many(studentResponses),
}));

export const studentResponsesRelations = relations(studentResponses, ({ one }) => ({
  session: one(studentSessions, {
    fields: [studentResponses.sessionId],
    references: [studentSessions.id],
  }),
  question: one(questions, {
    fields: [studentResponses.questionId],
    references: [questions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Curriculum = typeof curricula.$inferSelect;
export type NewCurriculum = typeof curricula.$inferInsert;
export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type StudentSession = typeof studentSessions.$inferSelect;
export type NewStudentSession = typeof studentSessions.$inferInsert;
export type StudentResponse = typeof studentResponses.$inferSelect;
export type NewStudentResponse = typeof studentResponses.$inferInsert;
export type MasteryRecord = typeof masteryRecords.$inferSelect;
export type NewMasteryRecord = typeof masteryRecords.$inferInsert;
