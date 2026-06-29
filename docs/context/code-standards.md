# Code Standards — ExamEdge

Implementation rules for every session. The AI agent must follow these without exception.

---

## Engineering Mindset

- **Think before implementing** — read AGENTS.md and context files first
- **Scope is sacred** — only build the current unit from build-plan.md
- **Every feature must be testable** — verify on 360px viewport immediately after building
- **Clean over clever** — readable code a junior developer understands
- **One unit at a time** — complete and verify before moving on
- **Educational correctness** — a hint that leaks an answer is a critical bug, not UX
- **Failures are expected** — wrap AI calls in try/catch, never crash student session

---

## TypeScript

- Strict mode — no exceptions in any package
- Never use `any` — use `unknown` and narrow
- Never use type assertions unless necessary and commented
- All exported function parameters and return types explicitly typed
- Use `type` for object shapes; `interface` only for extendable component props
- All async functions handle errors — no floating promises
- Prefer `const`; `let` only when reassignment required

---

## Next.js 16 Conventions

- App Router only — no Pages Router
- Node.js **22 LTS** in local dev and CI (see `tech-stack-versions.md`)
- Server Components by default
- Add `"use client"` only when requiring: useState, useEffect, browser APIs, event listeners, KaTeX/MathQuill
- Never add `"use client"` to layout files unless required
- Data fetching in Server Components or route handlers — not Client Components
- Route handlers: thin — auth, validate (Zod 4), delegate to repository/chain, respond
- Business logic in `packages/db/repositories/` and `packages/ai/chains/` — not inline in routes
- Verify Next.js and React patterns against https://nextjs.org/docs before each web unit

---

## File and Folder Naming

| Item | Convention | Example |
|------|------------|---------|
| Folders | kebab-case | `student-sessions`, `mark-schemes` |
| Components | PascalCase | `QuestionCard.tsx` |
| Utilities | camelCase | `rate-limit.ts` |
| API routes | `route.ts` | `responses/route.ts` |
| Repositories | camelCase plural | `responses.ts` |
| Chains | camelCase | `marking.ts` |
| Schemas | `*.schema.ts` | `marking.schema.ts` |

One component per file. Index exports only in `components/ui/`.

---

## Component Structure

```typescript
"use client"; // only if needed

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MarkingResult } from "@examedge/shared";

type Props = { result: MarkingResult };

export function MarkingDisplay({ result }: Props) {
  // ...
}
```

- Named exports only — no default exports for components
- Props type directly above component
- No inline styles — Tailwind tokens from ui-tokens.md

---

## API Route Handlers

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { submitResponseSchema } from "@examedge/shared";
import { responsesRepository } from "@examedge/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = uuidv4();
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated", status: 401, requestId } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = submitResponseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid request", status: 400, requestId } },
        { status: 400 }
      );
    }

    const result = await responsesRepository.submit(session.user.id, params.id, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`[api/sessions/${params.id}/responses]`, requestId, error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong", status: 500, requestId } },
      { status: 500 }
    );
  }
}
```

- Every route has try/catch
- Every route validates input with Zod
- Errors logged with route path prefix and requestId
- Return standard error shape from architecture.md
- Never expose stack traces or internal errors to client

---

## AI Chain Code

```typescript
// packages/ai/chains/guidance.ts
export async function runGuidanceChain(input: GuidanceInput): Promise<GuidanceResult> {
  try {
    const config = getModelConfig(`hint_${input.hintLevel}` as TaskType);
    const raw = await invokeChain(config, GUIDANCE_SYSTEM_PROMPT, buildHumanMessage(input));
    const parsed = guidanceResultSchema.safeParse(raw);
    if (!parsed.success) throw new GuidanceValidationError(parsed.error);

    if (detectAnswerLeakage(parsed.data.hint, input.markScheme)) {
      // retry logic — max 2 retries, see AGENTS.md
    }
    return parsed.data;
  } catch (error) {
    logAICall({ chain: "guidance", error: String(error) });
    return getGenericConceptualPointer(input); // never block student
  }
}
```

- Every chain returns validated typed result or throws typed error
- Anti-leakage never removed from guidance chain
- Never import from `apps/web/` in chain files

---

## Error Handling

- Never empty catch blocks — always log with context prefix
- Console errors: `[component/route name]` prefix
- User-facing: human readable, never raw API errors
- AI failures: log server-side, return safe message + optional review flag
- Marking validation failure: queue for manual review, notify student

---

## Plausible Events

Exact event names — never invent new ones without updating project-overview.md:

| Event | When | Properties |
|-------|------|------------|
| `session_started` | Session created | userId, mode, subjectId |
| `answer_submitted` | Answer POST succeeds | userId, topicId, answerType |
| `hint_requested` | Hint GET succeeds | userId, hintLevel |
| `exam_completed` | Exam submitted | userId, subjectId, totalMarks |
| `topic_mastered` | theta crosses 0.70 | userId, topicId |
| `offline_sync` | Queue synced | userId, queueSize |
| `appeal_submitted` | Appeal created | userId, responseId |

---

## Environment Variables

All in `.env.local` — never committed. See architecture.md for full list.

`NEXT_PUBLIC_` prefix = browser-safe only. Never prefix secrets.

---

## Import Aliases

Always use package aliases:

```typescript
import { MarkingResult } from "@examedge/shared";
import { responsesRepository } from "@examedge/db";
import { runMarkingChain } from "@examedge/ai";
import { Button } from "@/components/ui/button";
```

Never import across package boundaries incorrectly (app → packages OK; packages → app NEVER).

---

## Threshold Constants

Never hardcode — import from `@examedge/shared/constants/thresholds`:

- `CONFIDENCE_THRESHOLD = 0.70`
- `MAX_HINTS_PER_QUESTION = 3`
- `HINT_TRIGGER_PERCENT = 0.50`
- `QUESTION_POOL_MIN = 50`
- `QUESTION_EXCLUSION_DAYS = 30`

---

## Comments

- Explain WHY, not WHAT
- Chain files may note non-obvious pedagogical constraints
- Never leave TODO in committed code
- Never comment out code — delete it

---

## Dependencies

See library-docs.md approved list. Do not install without explicit unit approval.

Before installing: Does shadcn have it? Does Next.js provide it? Is there a native solution?

---

## Testing Before Unit Complete

```bash
npm run typecheck
npm run lint
npm run test
```

Plus manual verification on 360px viewport for UI units.
