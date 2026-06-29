# Library Docs — ExamEdge

Project-specific usage patterns for every third-party library. Read the relevant section before implementing any feature that touches these libraries.

**Authority order (never skip):**
```
1. ExamEdge internal docs (AGENTS.md, architecture.md, security.md, build-plan.md)
2. This file (library-docs.md — project rules + official doc links)
3. Official external documentation (URLs below — verify current API patterns)
4. Training knowledge — LAST RESORT ONLY; flag assumptions if used
```

**Mandatory before coding:** Complete the **Context and Research Summary** per `feature-prompts/unit-NN-*.md`. Read **`tech-stack-versions.md`** first for pinned versions, then verify each technology against official docs below. Do not implement until internal + external docs for every technology in the feature are reviewed.

Never rely on training knowledge alone for API patterns — verify against official docs and this file.

---

## Official External Documentation (by technology)

**Version authority:** `tech-stack-versions.md` — verify pinned versions before every feature.

Consult the official docs for **each technology used in the current unit**. Use web search or MCP doc tools when APIs may have changed since training data.

| Technology | Pin (June 2026) | Official documentation | ExamEdge units |
|------------|-----------------|------------------------|----------------|
| **Node.js** | 22 LTS (≥22.13.x) | https://nodejs.org/docs/latest-v22.x/api/ | All |
| **Next.js** (App Router) | 16.x stable | https://nextjs.org/docs · [Upgrade 15→16](https://nextjs.org/docs/app/guides/upgrading/version-16) | All web units |
| **React** | 19.x | https://react.dev | All UI |
| **TypeScript** | 5.x strict | https://www.typescriptlang.org/docs/ | All |
| **Turborepo** | 2.x | https://turbo.build/repo/docs | 01 |
| **Tailwind CSS** | **v4.x** | https://tailwindcss.com/docs · [v4 upgrade](https://tailwindcss.com/docs/upgrade-guide) | 02+ |
| **shadcn/ui** | Tailwind v4 path | https://ui.shadcn.com/docs | 02+ |
| **Zod** | **4.x** | https://zod.dev · [v4 changelog](https://zod.dev/v4/changelog) | All API/AI |
| **Drizzle ORM** | Latest stable | https://orm.drizzle.team/docs/overview | 05+ |
| **Neon PostgreSQL** | Serverless | https://neon.tech/docs | 05+ |
| **pgvector** | Latest | https://github.com/pgvector/pgvector | 05, 12 |
| **Auth.js v5** | 5.x (`next-auth@5`) | https://authjs.dev · [Security status](https://authjs.dev) | 06, 33 |
| **bcryptjs** | Latest | https://github.com/kelektiv/node.bcrypt.js | 06 |
| **Upstash Redis** | HTTP client | https://upstash.com/docs/redis/overall/getstarted | 08 |
| **@upstash/ratelimit** | Latest | https://upstash.com/docs/redis/sdks/ratelimit-ts/overview | 08 |
| **LangChain.js** | Latest | https://js.langchain.com/docs | 09+ |
| **Anthropic API** | See tech-stack-versions.md | https://docs.anthropic.com/en/api/getting-started · [Models](https://platform.claude.com/docs/en/about-claude/models/overview) | 09+ |
| **Voyage AI** | voyage-3 | https://docs.voyageai.com | 12 |
| **KaTeX** | Latest | https://katex.org/docs/api.html | 04 |
| **MathQuill** | Latest | http://docs.mathquill.com/en/latest/ | 04 |
| **AWS SDK S3** (R2) | v3 latest | https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/ | 28 |
| **Cloudflare R2** | — | https://developers.cloudflare.com/r2/ | 28 |
| **Resend** | Latest | https://resend.com/docs | 06, 30 |
| **Plausible** | — | https://plausible.io/docs | 07 |
| **Sentry** | Next.js SDK | https://docs.sentry.io/platforms/javascript/guides/nextjs/ | 31 |
| **Vitest** | Latest | https://vitest.dev/guide/ | All tests |
| **idb** (IndexedDB) | Latest | https://github.com/jakearchibald/idb | 27 |
| **Serwist** (PWA) | `@serwist/next` | https://serwist.pages.dev/docs | 27 |
| **Vercel Cron** | Platform | https://vercel.com/docs/cron-jobs | 30 |
| **Expo SDK** | **56** | https://docs.expo.dev · [SDK 56 changelog](https://expo.dev/changelog/sdk-56) | F-32 |
| **Expo Router** | SDK 56 | https://docs.expo.dev/router/introduction/ | F-32 |
| **NativeWind** | v4 | https://www.nativewind.dev/v4/overview | F-32 |

**Research rule:** For each row that applies to the current unit, read getting started, API reference, **security notes**, and **migration/changelog** sections before writing code. Record confirmed versions in the Context and Research Summary.

---

## Drizzle ORM + Neon PostgreSQL

### Repository Pattern

All database access goes through `packages/db/repositories/`. Never query from route handlers directly.

```typescript
// packages/db/repositories/responses.ts
import { db } from "../index";
import { studentResponses, masteryRecords, studentSessions } from "../schema";
import { eq, and } from "drizzle-orm";

export async function submitResponse(
  userId: string,
  sessionId: string,
  data: SubmitResponseInput,
): Promise<SubmitResponseResult> {
  // Verify session ownership
  const session = await db.query.studentSessions.findFirst({
    where: and(
      eq(studentSessions.id, sessionId),
      eq(studentSessions.studentId, userId),
    ),
  });
  if (!session) throw new NotFoundError("Session not found");

  // Atomic transaction
  return db.transaction(async (tx) => {
    const [response] = await tx.insert(studentResponses).values({ ... }).returning();
    await tx.update(masteryRecords)
      .set({ masteryLevel: newTheta, version: sql`version + 1` })
      .where(and(
        eq(masteryRecords.studentId, userId),
        eq(masteryRecords.topicId, data.topicId),
        eq(masteryRecords.version, currentVersion), // optimistic lock
      ));
    await tx.update(studentSessions)
      .set({ questionsAttempted: sql`questions_attempted + 1` })
      .where(eq(studentSessions.id, sessionId));
    return response;
  });
}
```

**Rules:**
- Always verify ownership before any read/write
- Use transactions for multi-table updates (answer submission)
- Optimistic locking on mastery_records.version
- Never use raw SQL in route handlers
- Migrations in `packages/db/migrations/` — never modify applied migrations

### pgvector Query

```typescript
import { sql } from "drizzle-orm";

const results = await db.select()
  .from(questions)
  .where(and(
    eq(questions.topicId, topicId),
    eq(questions.validated, true),
  ))
  .orderBy(sql`embedding <=> ${embeddingVector}`)
  .limit(5);
```

---

## Auth.js v5

```typescript
// apps/web/lib/auth.ts — see architecture.md for full config

// In route handler
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return errorResponse("UNAUTHORIZED", 401);
  }
  if (session.user.role !== "student") {
    return errorResponse("FORBIDDEN", 403);
  }
  // ...
}
```

**Rules:**
- Always call `auth()` in route handlers — middleware is first line, not only line
- Never store JWT in localStorage — HTTP-only cookies only
- bcrypt factor 12 for password hashing
- Role checks in every admin/teacher route

---

## Upstash Redis

```typescript
// apps/web/lib/redis.ts
import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();

// Idempotency
const key = `idem:${userId}:${idempotencyKey}`;
const existing = await redis.get(key);
if (existing) return JSON.parse(existing as string);

const result = await runMarkingChain(...);
await redis.set(key, JSON.stringify(result), { ex: 300 });
```

**Rules:**
- Idempotency TTL: 5 minutes (300 seconds)
- Warm question pool TTL: 1 hour (3600 seconds)
- Rate limiting via `@upstash/ratelimit` — see architecture.md
- Never store PII in Redis keys or values

---

## LangChain.js + Anthropic

```typescript
// packages/ai/chains/marking.ts
import { ChatAnthropic } from "@langchain/anthropic";
import { getModelConfig } from "../router";

export async function runMarkingChain(input: MarkingInput): Promise<MarkingResult> {
  const config = getModelConfig("marking_math");

  const model = new ChatAnthropic({
    model: config.model,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await model.invoke([
    { role: "system", content: MARKING_SYSTEM_PROMPT }, // immutable constant
    { role: "user", content: buildHumanMessage(input) }, // user content only here
  ]);

  const parsed = markingResultSchema.safeParse(JSON.parse(response.content as string));
  if (!parsed.success) throw new MarkingValidationError(parsed.error);
  return parsed.data;
}
```

**Rules:**
- Always call `getModelConfig(task)` — never hardcode model in chain
- System prompt as TypeScript constant — never constructed from user input
- User content (answers, question text) in human message only
- Parse JSON output and validate with Zod before returning
- Log every call: chain_type, model, tokens, latency_ms, confidence, schema_valid
- Enable Anthropic zero-data-retention option in production
- Never call from client code

---

## Voyage AI Embeddings

```typescript
// packages/ai/rag.ts
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      model: "voyage-3",
    }),
  });
  const data = await response.json();
  return data.data[0].embedding; // 1536 dimensions
}
```

**Rules:**
- Generate embedding once per validated question — store in questions.embedding
- Never regenerate unless template_text changes
- Query embedding generated at retrieval time (not cached) for quality

---

## KaTeX (react-katex or katex direct)

```typescript
// components/math/MathDisplay.tsx
"use client";
import katex from "katex";
import "katex/dist/katex.min.css";

export function MathDisplay({ latex, displayMode = true }: Props) {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: false, // security — no \url or \href
    });
    return <div className="math-display" dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span className="text-error text-sm">Unable to render equation</span>;
  }
}
```

**Rules:**
- Always wrap in error boundary / try-catch — bad LaTeX must not crash session
- `trust: false` always — prevent XSS via LaTeX
- Client component only (KaTeX uses DOM)
- Min font size 16px for inline math in questions

---

## MathQuill

```typescript
// components/math/MathInput.tsx
"use client";
// Dynamic import to avoid SSR issues
const EditableMathField = dynamic(
  () => import("react-mathquill").then(m => m.EditableMathField),
  { ssr: false, loading: () => <div className="h-24 bg-surface-secondary animate-pulse rounded-md" /> }
);
```

**Rules:**
- Client component only — `"use client"` required
- Dynamic import with `ssr: false` — MathQuill requires DOM
- Export LaTeX string via `onChange` — validate with shared math helpers before submit
- Support all Pure Maths 0765 symbols: fractions, indices, integrals, vectors, matrices

---

## Cloudflare R2

```typescript
// apps/web/lib/storage.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadPhoto(userId: string, responseId: string, buffer: Buffer) {
  const key = `photos/${userId}/${responseId}.jpg`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
  }));
  return key; // Store key in DB, generate signed URL for display
}
```

**Rules:**
- Server-side only — never upload from client directly to R2
- Client uploads to API route → API uploads to R2
- Max file size: 5MB, min resolution: 1MP
- Authenticated access only — signed URLs with short TTL

---

## Claude Vision (Photo OCR)

```typescript
// Called from marking flow when answer_type = 'image'
const config = getModelConfig("ocr_fallback"); // Sonnet, temp 0.1

const response = await anthropic.messages.create({
  model: config.model,
  max_tokens: 1000,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Image }},
      { type: "text", text: "Transcribe all handwritten mathematical working. Output LaTeX where possible. Do not solve or mark." },
    ],
  }],
});
```

**Rules:**
- Vision call is transcription only — marking chain processes the transcription separately
- Show transcription to student for confirmation before marking
- Low OCR confidence → flag for manual review
- Never send student name in vision prompt

---

## Resend (Email)

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Password reset
await resend.emails.send({
  from: "ExamEdge <noreply@examedge.cm>",
  to: user.email,
  subject: "Reset your ExamEdge password",
  html: resetEmailTemplate(resetLink),
});

// Weekly report (batch cron)
await resend.emails.send({
  from: "ExamEdge <reports@examedge.cm>",
  to: student.email,
  subject: `Your weekly study report — ${weekLabel}`,
  html: weeklyReportTemplate(reportData),
});
```

**Rules:**
- Batch weekly reports in cron — never send real-time per session
- Plain text + HTML versions for accessibility
- No student academic data in email subject lines (privacy)

---

## Plausible Analytics

**Setup in Unit 07 — before any event-emitting features.**

### Script in Root Layout

```typescript
// apps/web/app/layout.tsx
import Script from "next/script";

<Script
  defer
  data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

### Client Helper

```typescript
// apps/web/lib/analytics.ts
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

export function trackEvent(
  name: string,
  props?: Record<string, string | number>,
): void {
  if (typeof window !== "undefined" && window.plausible) {
    window.plausible(name, props ? { props } : undefined);
  }
}
```

### Allowed Events

See `project-overview.md`: `session_started`, `answer_submitted`, `hint_requested`, `exam_completed`, `topic_mastered`, `offline_sync`, `appeal_submitted`

**Rules:**

- Initialize in Unit 07 before Units 17+ fire events
- Never include email, name, or answer text in props
- userId must be opaque UUID only
- Plausible only for MVP — no PostHog or Google Analytics

### Zero-budget fallback (pilot without Plausible subscription)

If Plausible Cloud is not yet funded, implement `trackEvent()` to **dual-write**:

1. No-op or console log in development
2. `INSERT INTO analytics_events` in Postgres for pilot metrics

Switch script source to Plausible when $9/mo available — wrapper API unchanged. See `zero-budget-stack.md` § Analytics.

---

## Service Worker + IndexedDB (Offline)

```typescript
// apps/web/lib/offline-queue.ts
const DB_NAME = "examedge-offline";
const STORE_NAME = "answer-queue";

export async function queueAnswer(payload: QueuedAnswer): Promise<void> {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) { db.createObjectStore(STORE_NAME, { keyPath: "idempotencyKey" }); },
  });
  await db.put(STORE_NAME, payload);
}

export async function syncQueue(sessionId: string): Promise<void> {
  const items = await getAllQueued();
  for (const item of items) {
    const res = await fetch(`/api/sessions/${sessionId}/responses`, {
      method: "POST",
      body: JSON.stringify(item),
    });
    if (res.ok) await removeFromQueue(item.idempotencyKey);
  }
}
```

**Rules:**
- Every queued item includes client-generated idempotency UUID
- Sync on `online` event and on app foreground
- Show OfflineBanner when `navigator.onLine === false`
- Service worker caches app shell + next 5 study session question payloads

---

## Approved Dependencies

Do not install packages not on this list without updating architecture.md:

| Package | Purpose |
|---------|---------|
| `next` | Framework |
| `react`, `react-dom` | UI |
| `drizzle-orm`, `drizzle-kit` | ORM |
| `@neondatabase/serverless` | Neon driver |
| `next-auth` (@v5) | Auth.js |
| `bcryptjs` | Password hashing |
| `@upstash/redis`, `@upstash/ratelimit` | Cache + rate limit |
| `@langchain/anthropic`, `@langchain/core` | AI chains |
| `@anthropic-ai/sdk` | Direct Anthropic (vision OCR) |
| `zod` | Validation |
| `katex` | Math rendering |
| `react-mathquill` | Math input |
| `@aws-sdk/client-s3` | R2 storage |
| `resend` | Email |
| `lucide-react` | Icons |
| `tailwindcss`, `@tailwindcss/postcss` | Styling (v4) |
| shadcn/ui components | UI primitives |
| `idb` | IndexedDB wrapper |
| `workbox-*` or `@serwist/next` | Service worker (PWA) — prefer Serwist for Next.js 16 |

---

## Constants — Never Hardcode

```typescript
// packages/shared/constants/thresholds.ts
export const CONFIDENCE_THRESHOLD = 0.70;
export const MAX_HINTS_PER_QUESTION = 3;
export const HINT_TRIGGER_PERCENT = 0.50; // hints available when marks < 50%
export const QUESTION_POOL_MIN = 50; // per topic/difficulty
export const QUESTION_EXCLUSION_DAYS = 30;
export const IDEMPOTENCY_TTL_SECONDS = 300;
export const MARKING_TIMEOUT_MS = 3000;
export const AI_OPS_PER_HOUR_LIMIT = 100;
```

Import from `@examedge/shared/constants/thresholds` everywhere — never inline these values.
