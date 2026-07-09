# ExamEdge

**Learn deeply. Prepare confidently. Any exam. Any country.**

An AI-powered examination preparation and personalized learning platform for secondary school students across Africa — beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to support multiple curricula and national examination systems across the continent.

ExamEdge is an **Adaptive Examination Preparation and Intelligent Tutoring System (AEP-ITS)**. It does not answer questions on demand. It develops the capacity to answer them.

---

## The problem

Millions of secondary students in Africa prepare for high-stakes national examinations without access to personalised guidance, examiner-accurate feedback, or adaptive practice at examination standard. Private tutoring is often unaffordable. General-purpose AI tools give instant answers — which helps in the moment but undermines genuine exam preparation.

ExamEdge addresses both gaps: **examiner-accurate preparation at scale**, and **verification of real understanding**, not answer consumption.

---

## What ExamEdge does

| Capability                           | Description                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Board-accurate marking**           | Partial credit per marking profile (M/A for GCE maths); national examination conventions |
| **Socratic guidance**                | Hints that guide reasoning — never revealing the answer or next correct step             |
| **Understanding verification (UVE)** | Follow-up probes that confirm a student truly understands, not just lucky guesses        |
| **Parameterised questions**          | Every student receives a different version of every question                             |
| **Mastery tracking**                 | Long-term progress across topics, with adaptive difficulty                               |
| **Offline-first design**             | Built for low-bandwidth environments and low-end Android devices                         |

---

## Launch scope vs platform vision

ExamEdge is **curriculum-agnostic by design**. Examination boards, syllabi, languages, and marking conventions are configuration layers — not hardcoded assumptions.

|               | Phase 1 (MVP)                | Long-term                                             |
| ------------- | ---------------------------- | ----------------------------------------------------- |
| **Geography** | Cameroon pilot               | Nigeria, Ghana, Kenya, Francophone Africa, and beyond |
| **Boards**    | GCE Board Buea               | WAEC, NECO, KCSE, OBC, BEPC, and future boards        |
| **Subjects**  | Pure Maths, Physics, Biology | Expanded per board and country                        |
| **Platform**  | Web PWA                      | React Native mobile (V1.1+)                           |

---

## Tech stack

| Layer                 | Technology                                             |
| --------------------- | ------------------------------------------------------ |
| Runtime               | Node.js 22 LTS (≥20.19)                                |
| Web                   | Next.js 16, React 19, TypeScript 5 (strict)            |
| Monorepo              | npm workspaces, Turborepo                              |
| Styling               | Tailwind CSS v4, shadcn/ui                             |
| Database              | Neon PostgreSQL, Drizzle ORM, pgvector                 |
| Cache / rate limiting | Upstash Redis                                          |
| Auth                  | Auth.js v5                                             |
| AI                    | Anthropic (Claude), LangChain.js, Voyage AI embeddings |
| Math                  | KaTeX, MathQuill                                       |
| Testing               | Vitest                                                 |
| Hosting               | Vercel                                                 |

Pinned versions and migration notes: [`docs/context/tech-stack-versions.md`](docs/context/tech-stack-versions.md)

---

## Repository structure

```
examedge/
├── apps/
│   └── web/                 # Next.js 16 App Router + API routes
├── packages/
│   ├── shared/              # Shared types and constants (@examedge/shared)
│   ├── db/                  # Drizzle ORM schema and repositories (@examedge/db)
│   └── ai/                  # LangChain chains and model router (@examedge/ai)
├── docs/
│   ├── context/             # Engineering context, build plan, architecture
│   └── *.md                 # Product and engineering specifications
├── AGENTS.md                # AI chain architecture and agent guardrails
└── .cursorrules             # IDE development standards
```

---

## Getting started

### Prerequisites

- **Node.js** ≥20.19 ([22 LTS recommended](https://nodejs.org/))
- **npm** 10+

### Installation

```bash
git clone git@github.com:Vitalisn4/Exam-Edge.git
cd Exam-Edge

cp .env.example .env.local   # fill in values when services are provisioned
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check:

```bash
curl http://localhost:3000/api/health
# {"status":"ok","version":"0.1.0"}
```

### Development commands

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start Next.js web app (Turbopack) |
| `npm run build`     | Production build (all packages)   |
| `npm run typecheck` | TypeScript strict check           |
| `npm run lint`      | ESLint (all packages)             |
| `npm run test`      | Vitest unit tests                 |

---

## Documentation

Start here if you are new to the project:

| Document                                                                 | Purpose                                 |
| ------------------------------------------------------------------------ | --------------------------------------- |
| [`docs/context/strategic-charter.md`](docs/context/strategic-charter.md) | Vision, mission, values — identity SSOT |
| [`docs/context/project-overview.md`](docs/context/project-overview.md)   | MVP scope, flows, features              |
| [`docs/context/build-plan.md`](docs/context/build-plan.md)               | 31-unit implementation sequence         |
| [`docs/context/architecture.md`](docs/context/architecture.md)           | Stack, schema, API, invariants          |
| [`docs/context/roadmap.md`](docs/context/roadmap.md)                     | V1.0 → V3.0 release plan                |
| [`docs/README.md`](docs/README.md)                                       | Full documentation index                |
| [`AGENTS.md`](AGENTS.md)                                                 | Five AI chains and safety guardrails    |

Feature implementation prompts (Units 01–31): [`docs/context/feature-prompts/`](docs/context/feature-prompts/)

---

## AI architecture

ExamEdge uses **five independent AI chains**, each with a defined model, temperature, input/output schema, and failure mode:

1. **Examiner Marking** — Profile-driven partial credit (M/A maths; point rubric sciences) (Claude Haiku)
2. **Socratic Guidance** — hints without answer leakage (Haiku / Sonnet)
3. **Question Generation** — board-standard questions with RAG grounding (Sonnet)
4. **UVE Probes** — understanding verification after every submission (Haiku / Sonnet)
5. **Curriculum Intelligence** — syllabus-grounded concept explanations (Sonnet)

All AI calls are server-side only. Student answers are never sent with PII. Output is Zod-validated before reaching students.

Details: [`AGENTS.md`](AGENTS.md) · [`docs/context/platform-how-it-works.md`](docs/context/platform-how-it-works.md)

---

## Build status

| Phase              | Units | Status                               |
| ------------------ | ----- | ------------------------------------ |
| Foundation         | 01–08 | Unit 01 complete (monorepo scaffold) |
| AI chains          | 09–14 | Planned                              |
| Student core       | 15–23 | Planned                              |
| Assessment         | 24–26 | Planned                              |
| Resilience & pilot | 27–31 | Planned                              |

Live progress: [`docs/context/progress-tracker.md`](docs/context/progress-tracker.md)

---

## Contributing

This project follows a **unit-by-unit build process**: one feature per branch, one PR, merge before the next unit. See [`docs/context/build-plan.md`](docs/context/build-plan.md) and [`docs/context/feature-development-prompts.md`](docs/context/feature-development-prompts.md).

Before contributing:

1. Read [`AGENTS.md`](AGENTS.md) and [`docs/context/code-standards.md`](docs/context/code-standards.md)
2. Confirm the current unit in [`docs/context/progress-tracker.md`](docs/context/progress-tracker.md)
3. Run `npm run typecheck`, `npm run lint`, and `npm run test` before opening a PR

---

## Author

**Ngam Vitalis Yuh** — Software Engineer, Yaounde, Cameroon

Built for the **Presidential African Youth in AI & Robotics Competition 2026** (Education Enhancement Track).

---

## License

License to be determined.
