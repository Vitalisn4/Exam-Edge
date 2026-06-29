# Security — ExamEdge

MVP security requirements for implementation. Full long-term security architecture is in `docs/ExamEdge_Engineering_Document.md` §5. This file is the **agent-readable source of truth** for what to build in V1.0.

Read before Units 06 (Auth), 08 (Redis), 23 (Profile + Privacy), and any API route work.

---

## Security Model (Three Layers)

1. **Application layer** — Auth.js session, role checks, ownership checks in every route handler
2. **Database layer** — Repository functions verify `studentId` / session ownership before reads/writes (MVP). PostgreSQL RLS policies deferred to V1.1 (see roadmap.md)
3. **Input layer** — Zod validation on every request body; sanitize user text before LLM inclusion

Middleware is the first line of defence, not the only line. Every protected route handler must call `auth()` and verify role + resource ownership.

---

## Authentication (MVP — Unit 06)

| Requirement | Implementation |
|-------------|----------------|
| Provider | Auth.js v5 |
| Methods | Email/password only (OAuth V1.1) |
| Password hashing | bcrypt factor 12 |
| Session storage | JWT in HTTP-only cookie, `SameSite=Lax`, `Secure` in production |
| Session payload | userId, role, email (display only) |
| Public routes | `/`, `/login`, `/register`, `/forgot-password` |
| Protected routes | `(student)/*`, `(admin)/*` |

**MVP simplification:** Single JWT session cookie without refresh rotation. Refresh token rotation + token blocklist → V1.1 (roadmap.md).

---

## Authorization (RBAC)

| Role | MVP access |
|------|------------|
| `student` | Own sessions, responses, mastery, appeals, profile |
| `admin` | Question validation queue, audit log read |
| `teacher` | Deferred V1.1 |

### Route handler pattern

```typescript
const session = await auth();
if (!session?.user) return errorResponse("UNAUTHORIZED", 401);

// Resource ownership — sessions, responses, simulations
const record = await sessionsRepository.findById(sessionId);
if (!record || record.studentId !== session.user.id) {
  return errorResponse("FORBIDDEN", 403);
}

// Admin-only
if (session.user.role !== "admin") {
  return errorResponse("FORBIDDEN", 403);
}
```

Repository functions must verify ownership internally — never trust client-supplied userId alone.

---

## Rate Limiting (Unit 08)

| Endpoint class | Limit | Key |
|----------------|-------|-----|
| Auth (`/api/auth/*`) | 5 / minute | IP |
| AI operations (marking, hints, UVE, generation) | 60 / hour | userId |
| General API | 300 / minute | userId |
| Cost circuit breaker | 100 AI ops / hour | userId → hard block + log |

Return `429` with standard error shape. Include rate-limit headers where supported.

---

## Idempotency

- Every answer submission includes client-generated UUID
- Redis `SET NX` with 5-minute TTL before marking chain call
- Duplicate key returns cached marking result — no second AI call

---

## Prompt Injection Protection

Implemented in `packages/ai/sanitize.ts` (Unit 09):

- Strip known patterns: "ignore previous instructions", "you are now", "override system prompt", "disregard all"
- Mark schemes passed as structured JSON in human message — not embedded in system prompt
- System prompts are immutable TypeScript constants — never constructed from user input

---

## Data Protection (Minors)

ExamEdge serves secondary students, many under 18. MVP requirements (Unit 23):

| Control | MVP | V1.1+ |
|---------|-----|-------|
| No names in LLM prompts | Required | — |
| No PII in analytics props | Required | — |
| No academic data in email subjects | Required | — |
| Parental consent (under 16) | Registration checkbox + stored consent timestamp | Full consent workflow |
| Data export | Profile page "Request my data" → queues admin/cron job | Automated self-service export |
| Account deletion | Profile page "Delete my account" → soft-delete + 30-day purge cron | Immediate automated purge |
| Anthropic zero-data-retention | Enable on API calls | — |

Consent and deletion flows must write to `audit_log`.

---

## API Security Checklist

- [ ] Zod validation on every POST/PATCH body
- [ ] No raw SQL in route handlers — Drizzle repositories only
- [ ] No stack traces in client error responses
- [ ] `requestId` on every error for log correlation
- [ ] CRON endpoints protected by `CRON_SECRET` header
- [ ] Secrets never prefixed with `NEXT_PUBLIC_`
- [ ] CORS: same-origin only (monorepo — no cross-origin API in MVP)

**Deferred to V1.1:** CSP headers, explicit CSRF tokens (SameSite=Lax sufficient for MVP), PostgreSQL RLS policies.

---

## Audit Logging

Write to `audit_log` table for:

- Admin question approve/reject
- Marking appeal resolution (Unit 22)
- Account deletion requests (Unit 23)
- Admin role changes (future)

Fields: `actor_id`, `action`, `resource_type`, `resource_id`, `metadata` jsonb, `created_at`. Logs are append-only — no user deletes audit rows.

---

## Storage Security (R2)

| Path pattern | Access |
|--------------|--------|
| `photos/{user_id}/{response_id}.jpg` | Authenticated owner only |
| `backups/` | Cron job only — never client-accessible |

Presigned URLs with short TTL for photo upload/download. Never expose bucket credentials to client.

---

## Security Verification (Pilot — Unit 31)

- [ ] Unauthenticated `/dashboard` → redirect `/login`
- [ ] Student cannot access another student's session by ID tampering → 403
- [ ] Non-admin `/admin/*` → 403
- [ ] 6th auth attempt in 1 minute → 429
- [ ] Duplicate idempotency key → cached response, single AI call
- [ ] Sentry captures server errors without leaking secrets in client payload

---

## Reference

| Topic | Document |
|-------|----------|
| Auth.js patterns | `library-docs.md` |
| Error response shape | `architecture.md` |
| Responsible AI / governance | `docs/ExamEdge_Responsible_AI_Framework.md` |
| Full security architecture | `docs/ExamEdge_Engineering_Document.md` §5 |
| V1.1+ security hardening | `roadmap.md` |
