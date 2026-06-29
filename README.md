# ExamEdge

An AI-powered examination preparation and personalized learning platform for secondary school students across Africa — beginning with GCE O/A Level in Cameroon, expanding to multiple curricula and national examination systems.

## Prerequisites

- Node.js ≥20.19 (22 LTS recommended — see `docs/context/tech-stack-versions.md`)
- npm 10+

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000/api/health](http://localhost:3000/api/health) — expect `{ "status": "ok", "version": "0.1.0" }`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js web app (Turbopack) |
| `npm run typecheck` | TypeScript strict check all packages |
| `npm run lint` | ESLint all packages |
| `npm run test` | Vitest unit tests |
| `npm run build` | Production build |

## Monorepo layout

```
apps/web/          Next.js 16 App Router + API
packages/db/       Drizzle ORM (Unit 05)
packages/ai/       LangChain chains (Units 09–14)
packages/shared/   Shared types and constants
```

See `docs/context/build-plan.md` for the 31-unit implementation sequence.
