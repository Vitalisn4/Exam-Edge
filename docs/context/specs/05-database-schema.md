# Spec 05 — Database Schema v1

**Unit:** 05  
**Status:** Implemented on `feature/unit-05-database-schema`  
**Branch:** `feature/unit-05-database-schema`

---

## Objective

Drizzle schema, initial migration, repositories, and GCE Buea curriculum seed for MVP backend foundation.

## Deliverables

| Item         | Path                                        | Notes                                                      |
| ------------ | ------------------------------------------- | ---------------------------------------------------------- |
| Schema       | `packages/db/src/schema.ts`                 | 13 MVP tables + pgvector column                            |
| Migration    | `packages/db/migrations/0000_initial.sql`   | Enables `vector` extension                                 |
| Client       | `packages/db/src/client.ts`                 | Neon HTTP driver                                           |
| Repositories | `packages/db/src/repositories/*.ts`         | users, curriculum, questions, sessions, responses, mastery |
| Seed         | `packages/db/src/seed/gce-buea-topics.ts`   | GCE AL: 0765, 0710, 0730                                   |
| Scripts      | root `db:migrate`, `db:seed`, `db:generate` | Workspace scripts                                          |

## Tables

`users`, `curricula`, `subjects`, `topics`, `questions`, `student_sessions`, `student_responses`, `mastery_records`, `marking_appeals`, `audit_log`, `topic_explanations`, `syllabus_chunks`, `hallucination_registry`

## Verification checklist

- [x] Schema matches `architecture.md` MVP columns and constraints
- [x] `questions.validated` defaults to `false`
- [x] `student_responses.idempotency_key` unique
- [x] `mastery_records` unique on `(student_id, topic_id)`
- [x] pgvector extension in migration
- [x] Seed: 3 subjects, 5+ topics each, idempotent
- [x] Repository unit tests for CRUD and ownership checks
- [x] `npm run typecheck`, `npm run lint`, `npm run test` pass

## Manual verification (requires Neon)

```bash
cp .env.example .env.local  # set DATABASE_URL
npm run db:migrate
npm run db:seed
```

## Out of scope

- RLS policies (V1.1)
- Question content seed
- Production data
