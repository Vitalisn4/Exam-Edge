CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"password_hash" text,
	"email_verified" timestamp with time zone,
	"cognitive_fp" jsonb,
	"preferences" jsonb,
	"date_of_birth" date,
	"consent_given_at" timestamp with time zone,
	"consent_type" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "curricula" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"country" varchar(100) NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"board_config" jsonb,
	CONSTRAINT "curricula_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"curriculum_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"syllabus_ref" text
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"syllabus_ref" text,
	"prerequisite_ids" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"exam_weight" numeric(5, 2),
	"difficulty_band" smallint,
	"concept_graph" jsonb,
	CONSTRAINT "topics_subject_slug_unique" UNIQUE("subject_id","slug")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"template_text" text NOT NULL,
	"param_schema" jsonb NOT NULL,
	"mark_scheme" jsonb NOT NULL,
	"probe_library" jsonb,
	"difficulty" smallint NOT NULL,
	"marks_total" smallint NOT NULL,
	"question_type" text DEFAULT 'structured' NOT NULL,
	"embedding" vector(1536),
	"source" text DEFAULT 'ai_generated' NOT NULL,
	"validated" boolean DEFAULT false NOT NULL,
	"validated_by" uuid,
	"validation_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"mode" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"questions_attempted" smallint DEFAULT 0 NOT NULL,
	"marks_total" smallint DEFAULT 0 NOT NULL,
	"marks_awarded" smallint DEFAULT 0 NOT NULL,
	"focus_breaks" smallint DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "student_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"rendered_text" text NOT NULL,
	"applied_params" jsonb,
	"answer_text" text,
	"answer_type" text DEFAULT 'text' NOT NULL,
	"answer_media_url" text,
	"marks_awarded" jsonb,
	"ai_confidence" numeric(4, 3),
	"manual_review" boolean DEFAULT false NOT NULL,
	"hints_used" smallint DEFAULT 0 NOT NULL,
	"uve_probes" jsonb,
	"mvs_score" numeric(4, 3),
	"time_taken_s" integer,
	"idempotency_key" uuid NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_responses_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "mastery_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"mastery_level" numeric(4, 3) DEFAULT '0' NOT NULL,
	"mvs_history" jsonb DEFAULT '[]'::jsonb,
	"sessions_count" integer DEFAULT 0 NOT NULL,
	"accuracy_rate" numeric(4, 3) DEFAULT '0' NOT NULL,
	"next_review" timestamp with time zone,
	"ease_factor" numeric(4, 2) DEFAULT '2.50' NOT NULL,
	"interval_days" smallint DEFAULT 1 NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mastery_records_student_topic_unique" UNIQUE("student_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "marking_appeals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"response_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolution" text,
	"resolved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_explanations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"board" text NOT NULL,
	"level" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"content" jsonb NOT NULL,
	"syllabus_chunk_version" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topic_explanations_topic_board_level_lang_unique" UNIQUE("topic_id","board","level","language")
);
--> statement-breakpoint
CREATE TABLE "syllabus_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_id" uuid NOT NULL,
	"board" text NOT NULL,
	"level" text NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"text" text NOT NULL,
	"source_ref" text,
	"version" integer DEFAULT 1 NOT NULL,
	"effective_from" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hallucination_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chain_type" text NOT NULL,
	"model_version" text NOT NULL,
	"prompt_template_version" text NOT NULL,
	"nature_of_error" text NOT NULL,
	"resolution" text,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_curriculum_id_curricula_id_fk" FOREIGN KEY ("curriculum_id") REFERENCES "public"."curricula"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_validated_by_users_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_sessions" ADD CONSTRAINT "student_sessions_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_responses" ADD CONSTRAINT "student_responses_session_id_student_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."student_sessions"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "student_responses" ADD CONSTRAINT "student_responses_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mastery_records" ADD CONSTRAINT "mastery_records_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mastery_records" ADD CONSTRAINT "mastery_records_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "marking_appeals" ADD CONSTRAINT "marking_appeals_response_id_student_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."student_responses"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "marking_appeals" ADD CONSTRAINT "marking_appeals_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "marking_appeals" ADD CONSTRAINT "marking_appeals_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "topic_explanations" ADD CONSTRAINT "topic_explanations_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "syllabus_chunks" ADD CONSTRAINT "syllabus_chunks_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "questions_topic_id_idx" ON "questions" USING btree ("topic_id");
--> statement-breakpoint
CREATE INDEX "questions_validated_idx" ON "questions" USING btree ("validated");
--> statement-breakpoint
CREATE INDEX "student_sessions_student_id_idx" ON "student_sessions" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX "student_responses_session_id_idx" ON "student_responses" USING btree ("session_id");
--> statement-breakpoint
CREATE INDEX "mastery_records_student_id_idx" ON "mastery_records" USING btree ("student_id");
--> statement-breakpoint
CREATE INDEX "topics_subject_id_idx" ON "topics" USING btree ("subject_id");
