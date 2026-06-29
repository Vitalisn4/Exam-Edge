# Technology Stack Versions — ExamEdge

**Version:** 1.0 · **Date:** June 2026 · **Status:** Authoritative version matrix for all implementation

This document is the **single source of truth** for pinned technology versions, official documentation links, security posture, and migration notes. Every feature prompt, agent session, and PR must align with this matrix.

**Verification rule (mandatory before coding):** In the Context and Research Summary, confirm each technology's **current stable version** against official sources listed below. If npm or official docs show a newer patch release, use the latest patch within the same major line unless a breaking change requires a deliberate upgrade decision documented in the PR.

**Last verified:** June 2026 (project documentation phase — no application code yet)

---

## Pinned stack (MVP V1.0 — greenfield start)

| Layer | Technology | Pin (June 2026) | Official docs | Release / migration |
|-------|------------|-----------------|---------------|---------------------|
| Runtime | **Node.js** | **22 LTS** (≥22.13.x) | https://nodejs.org/docs/latest-v22.x/api/ | Required by Expo SDK 56; Next.js 16 requires Node 20+ |
| Web framework | **Next.js** | **16.x** (stable; verify patch via `npm show next version`) | https://nextjs.org/docs | [Upgrade guide 15→16](https://nextjs.org/docs/app/guides/upgrading/version-16) · Turbopack default · React 19 |
| UI library | **React** | **19.x** (bundled with Next 16) | https://react.dev | Async request APIs; Server Components default |
| Language | **TypeScript** | **5.x** strict | https://www.typescriptlang.org/docs/ | `strict: true` in all packages |
| Monorepo | **Turborepo** | Latest 2.x | https://turbo.build/repo/docs | npm workspaces |
| Styling (web) | **Tailwind CSS** | **v4.x** | https://tailwindcss.com/docs | [v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) · CSS-first `@theme` · `@tailwindcss/postcss` |
| UI primitives | **shadcn/ui** | Latest (Tailwind v4 compatible) | https://ui.shadcn.com/docs | Install via CLI against Tailwind v4 |
| Validation | **Zod** | **4.x** (`zod@^4.0.0`) | https://zod.dev | [v4 migration](https://zod.dev/v4/changelog) · `z.email()` top-level APIs |
| ORM | **Drizzle ORM** | Latest stable | https://orm.drizzle.team/docs/overview | Neon serverless driver |
| Database | **Neon PostgreSQL** | Serverless + pgvector | https://neon.tech/docs | https://github.com/pgvector/pgvector |
| Cache / rate limit | **Upstash Redis** | HTTP client + `@upstash/ratelimit` | https://upstash.com/docs/redis | Serverless; no persistent PII |
| Auth (MVP) | **Auth.js v5** (`next-auth@5`) | Latest 5.x patch | https://authjs.dev | See § Auth decision below |
| Password hashing | **bcryptjs** | Latest | https://github.com/kelektiv/node.bcrypt.js | Factor **12** |
| AI orchestration | **LangChain.js** | `@langchain/anthropic`, `@langchain/core` latest | https://js.langchain.com/docs | Verify `@langchain/anthropic` matches Anthropic SDK |
| LLM provider | **Anthropic API** | See model IDs below | https://docs.anthropic.com/en/api/getting-started | Zero-data-retention in production |
| Embeddings | **Voyage AI** | `voyage-3` (1536 dims) | https://docs.voyageai.com | Store embeddings once per question |
| Math display | **KaTeX** | Latest | https://katex.org/docs/api.html | `trust: false` always |
| Math input | **MathQuill** | Latest | http://docs.mathquill.com/en/latest/ | Client-only; `ssr: false` |
| Email | **Resend** | Latest | https://resend.com/docs | Batch cron for reports |
| Analytics | **Plausible** | Self-hosted or Cloud | https://plausible.io/docs | No PII in event props |
| Error tracking | **Sentry** | Next.js SDK latest | https://docs.sentry.io/platforms/javascript/guides/nextjs/ | Unit 31+ |
| Object storage | **Cloudflare R2** | S3-compatible API | https://developers.cloudflare.com/r2/ | AWS SDK v3 `@aws-sdk/client-s3` |
| Testing | **Vitest** | Latest | https://vitest.dev/guide/ | Unit + integration |
| PWA / offline | **Serwist** (`@serwist/next`) | Latest | https://serwist.pages.dev/docs | Prefer Serwist over legacy Workbox for Next 16 |
| IndexedDB | **idb** | Latest | https://github.com/jakearchibald/idb | Offline answer queue |
| Cron | **Vercel Cron** | Platform feature | https://vercel.com/docs/cron-jobs | Background jobs Unit 30 |

### Mobile (F-32 — post-MVP V1.1)

| Layer | Technology | Pin (June 2026) | Official docs | Notes |
|-------|------------|-----------------|---------------|-------|
| Framework | **Expo SDK** | **56** (`expo@^56.0.0`) | https://docs.expo.dev · [SDK 56 changelog](https://expo.dev/changelog/sdk-56) | React Native **0.85**, React **19.2** |
| Router | **Expo Router** | Bundled with SDK 56 | https://docs.expo.dev/router/introduction/ | File-based routing |
| Styling | **NativeWind v4** | Latest | https://www.nativewind.dev/v4/overview | Aligns with Tailwind v4 tokens |
| State | **Zustand** + **AsyncStorage** | Latest | https://zustand.docs.pmnd.rs | Secure token: **expo-secure-store** only |
| Offline DB | **expo-sqlite** | Bundled | https://docs.expo.dev/versions/latest/sdk/sqlite/ | Question cache |
| Secure storage | **expo-secure-store** | Bundled | https://docs.expo.dev/versions/latest/sdk/securestore/ | JWT — never AsyncStorage |

**Expo SDK 56 requirements:** New Architecture only (SDK 55+); min Android 7+, iOS 16.4+; Node **22.13.x+** for tooling.

---

## Anthropic model IDs (pinned in `packages/ai/router.ts`)

Use **exact API IDs** — never unversioned aliases in production code.

| Task tier | Model | API ID | Temperature (see AGENTS.md) |
|-----------|-------|--------|----------------------------|
| Marking (math/science) | Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | 0.1 |
| Marking (essay) | Claude Sonnet 4.6 | `claude-sonnet-4-6` | 0.2 |
| Hints L1–L2 | Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | 0.4 |
| Hint L3, UVE L3–L4, generation, curriculum | Claude Sonnet 4.6 | `claude-sonnet-4-6` | per AGENTS.md |
| OCR fallback | Claude Sonnet 4.6 | `claude-sonnet-4-6` | 0.1 |

**Docs:** [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions)

**Security:** Enable Anthropic zero-data-retention for production. No student names or emails in prompts — session_id only.

---

## Auth decision (MVP vs post-MVP)

| Option | Status | Rationale |
|--------|--------|-----------|
| **Auth.js v5** | **MVP choice (Units 06, 33)** | Entire architecture, library-docs, and security.md are built around Auth.js patterns. Auth.js receives **security and critical patches** (maintenance mode — no new features). |
| **Better Auth** | **Evaluate at V1.1+ (optional F-33 alt)** | Auth.js team maintains Better Auth; recommended for **new greenfield** projects elsewhere. Migrating ExamEdge mid-MVP is high-risk — requires explicit architecture approval. See https://authjs.dev/getting-started/migrate-to-better-auth |

**Do not switch auth libraries during MVP Units 01–31 without documented approval.**

---

## Deprecated — do not use in new code

| Item | Replacement | Reason |
|------|-------------|--------|
| Next.js 14 / Pages Router | Next.js 16 App Router | Next 16 stable; Turbopack default; React 19 |
| Tailwind CSS v3 `@tailwind` directives | Tailwind v4 `@import "tailwindcss"` + `@theme` | v4 stable; faster Oxide engine; shadcn v4 path |
| `tailwind.config.ts` (v3 JS config) | CSS `@theme` in `globals.css` | Tailwind v4 CSS-first configuration |
| Expo SDK 52 (as minimum) | Expo SDK **56** for F-32 | SDK 56 current stable; New Architecture required |
| Zod 3 import patterns | Zod 4 (`zod@^4.0.0`) | v4 stable at npm root; performance + API cleanup |
| JWT in localStorage / AsyncStorage | HTTP-only cookies (web); expo-secure-store (mobile) | XSS/token theft |
| Client-side Anthropic calls | Next.js Route Handlers only | API key security |
| Raw SQL in route handlers | Drizzle repositories | Type safety + testability |
| `workbox-*` direct (if Serwist available) | `@serwist/next` | Better Next.js 16 integration |

---

## Version verification checklist (Context and Research Summary)

Before writing code for any unit, the agent must confirm:

- [ ] Read `tech-stack-versions.md` (this file) for pinned versions
- [ ] Read `library-docs.md` for project integration patterns
- [ ] For each technology in the unit: opened official docs URL from tables above
- [ ] Checked release notes / changelog for breaking changes since last doc update
- [ ] Checked security advisories (npm audit, GitHub advisories, vendor status pages)
- [ ] Confirmed Node.js version in CI/local matches ≥22.13.x
- [ ] Confirmed no deprecated APIs from § Deprecated above appear in implementation plan
- [ ] Documented any version assumption or newer patch adopted in PR description

---

## Security advisories — standing requirements

| Area | Requirement | Reference |
|------|-------------|-----------|
| Dependencies | Run `npm audit` before merge; fix high/critical or document accepted risk | CI gate Unit 01+ |
| Secrets | Never commit `.env.local`; `.env.example` placeholders only | security.md |
| Auth | bcrypt factor 12; HTTP-only SameSite=Lax cookies; CSRF on state-changing forms (F-37) | security.md |
| LLM | Input sanitization; structured mark scheme JSON; anti-injection patterns | AGENTS.md |
| XSS | KaTeX `trust: false`; no `dangerouslySetInnerHTML` except vetted math render | library-docs.md |
| Rate limiting | Upstash sliding window on auth + AI routes | architecture.md |
| Minors' data | No PII in LLM prompts, analytics props, or Redis keys | security.md |

---

## When official docs outpace this file

If official documentation introduces a **new major version** or breaking change:

1. Do **not** adopt silently — open a documentation PR updating this file first
2. Note breaking changes and migration steps
3. Update `library-docs.md`, affected feature prompts (re-run `python3 scripts/export-feature-prompts.py`), and `AGENTS.md` if AI models change
4. Update `progress-tracker.md` with any blocked units

---

## Regenerate feature prompts after stack changes

```bash
python3 scripts/export-feature-prompts.py
```

This syncs external documentation links and version notes into all 56 copy-paste prompt files.

---

*ExamEdge — build on current stable releases, verify before every feature.*
