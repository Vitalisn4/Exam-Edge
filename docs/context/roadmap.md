# Product Roadmap — ExamEdge

**Release planning SSOT.** Platform identity (vision, mission, values, goals): `strategic-charter.md`. Build scope: `build-plan.md`. MVP features: `project-overview.md`.

---

## Platform Vision

ExamEdge is **an AI-powered examination preparation and personalized learning platform for secondary school students across Africa**, beginning with GCE Ordinary and Advanced Level examinations in Cameroon and expanding to support multiple curricula and national examination systems across the continent.

It helps students **learn, practice, and prepare for national examinations** through examiner-accurate marking, Socratic guidance, understanding verification, and mastery tracking — without giving away answers.

The platform is **curriculum-agnostic and extensible by design**. Countries, examination boards, syllabi, languages, and marking conventions are configuration and content layers — not hardcoded assumptions. Phase 1 launches with one board; the architecture supports many.

**Tagline (external):** *Learn deeply. Prepare confidently. Any exam. Any country.*

---

## Launch vs Long-Term Scope

| Dimension | Phase 1 Launch (MVP V1.0) | Long-term platform |
|-----------|---------------------------|-------------------|
| Geography | Cameroon pilot | Nigeria, Ghana, Kenya, Francophone Africa, etc. |
| Examination boards | GCE Board Buea | WAEC, NECO, KCSE, OBC, BEPC, custom boards |
| Languages | English | English + French + local languages |
| Subjects | 3 (Pure Maths, Physics, Biology) | Full secondary catalog per board |
| Marking semantics | M1/A1/B1 (GCE Buea) | Board-specific rubrics via mark scheme templates |
| Client | Web PWA | Web + React Native mobile |
| AI models | Cloud (Haiku + Sonnet) | Hybrid cloud + on-device (Year 2+) |

**Rule for all documentation and code:** Distinguish **platform capability** (extensible) from **launch configuration** (GCE Buea, Cameroon, English).

---

## Release Timeline

### V1.0 — MVP Pilot (Weeks 1–10)

**Goal:** 20-student Cameroon pilot + 10-minute competition demo.

**Deliverables:** 31 build units in `build-plan.md`

| Area | Included |
|------|----------|
| Student core | Auth, dashboard, practice, marking, hints, UVE L1-L2, exam simulation |
| Content | GCE Buea seed (3 subjects), admin validation queue, question pool + RAG generation |
| Student pages | Progress (history, focus analytics, appeals), profile (settings, privacy) |
| Curriculum | Topic explain UI (syllabus-grounded, cached) |
| Resilience | PWA offline queue, photo OCR, focus sessions |
| Ops | Cron jobs, Sentry, Plausible, weekly reports, demo script |
| Security | Application-layer RBAC, rate limits, idempotency, MVP consent/deletion (Unit 23) |

**Infrastructure budget:** **$0/month possible** for infra (Neon, Vercel, Upstash, R2, Resend, Sentry free tiers). AI requires ~$5 Anthropic starter credits for pilot; see `zero-budget-stack.md`.

**Success metrics:** See `project-overview.md` Success Criteria.

---

### V1.1 — Mobile + Teachers (Months 3–6 post-pilot)

| Feature | Notes |
|---------|-------|
| React Native + Expo mobile app | Secure token storage, offline SQLite cache |
| Google OAuth | Auth.js provider |
| Teacher dashboard | Class roster, assignment, progress views |
| PostgreSQL RLS policies | Row-level security per role |
| JWT refresh rotation + token blocklist | Production auth hardening |
| CSP headers + CSRF tokens | See `security.md` deferred items |
| French UI (i18n framework) | next-intl or equivalent |
| Expanded GCE subject coverage | Toward 16-subject GCE Buea catalog |
| UVE L3-L4 | Conceptual + transfer probes (Sonnet) |
| Automated data export | Self-service JSON/PDF download |

---

### V2.0 — Multi-Country Expansion (Year 1–2)

| Feature | Notes |
|---------|-------|
| WAEC / NECO (Nigeria, Ghana) | New board configs in `packages/shared/constants/boards.ts` |
| KCSE (Kenya) | Syllabus ingestion pipeline |
| OBC / Francophone Cameroon | French curriculum + marking conventions |
| **Graduate Success hub** | University readiness, scholarships, global competitions — see `student-journey.md` §6 |
| USSD/SMS (Africa's Talking) | Low-bandwidth access path |
| Whisper.cpp oral assessment | On-device ASR for oral exams |
| Advanced Cognitive Fingerprint | Error pattern clustering, learning style adaptation |
| Alumni mentor network | Diaspora mentors for AL graduates — `student-journey.md` §6 |
| Payment / subscription | Pilot monetisation after product-market fit |
| Local model routing | Fine-tuned Haiku-class models for marking (cost reduction) |

**Curriculum onboarding process (V2.0):**
1. Ingest syllabus PDF → chunk → embed
2. Map topics to shared taxonomy where possible
3. Seed mark scheme templates per board convention
4. Human validation gate before live pool
5. Board-specific generation prompts (not new chains)

---

### V3.0 — Platform Scale (Year 2–3)

| Feature | Notes |
|---------|-------|
| Fine-tuned local marking models | Router switches per `getModelConfig()` |
| Government / ministry analytics dashboard | Aggregated anonymised outcomes |
| Public developer API | Partner integrations |
| Multi-tenant school deployments | Institution-level admin |
| Advanced integrity analytics | Cohort-level, not surveillance |
| Edge deployment options | Regional latency for West/East Africa |

---

## Curriculum Extensibility Architecture

**Full blueprint:** `content-architecture.md` — content hierarchy, knowledge graph, learner pathways, scalability.

These structures exist from V1.0 — expansion is content + config, not rewrites:

```
curricula          → board + country + level (e.g. GCE_BUEA, WAEC, KCSE)
subjects           → code per board (0765 Pure Maths GCE; different codes elsewhere)
topics             → syllabus-linked, board-scoped; concept_graph JSONB (subtopics in V1.1+)
questions          → template + param_schema + board-specific mark_scheme_template
marking chains     → consume mark scheme JSON — board conventions in template, not chain code
generation chains  → RAG + board parameter in input schema
```

Adding a new country = seed data + validated question pool + syllabus chunks. No new AI chains required.

**GCE full catalog:** V1.0 ships 3 subjects; V1.1 expands toward ~16 OL + AL subjects per `ExamEdge_Volume_V_Blueprint.md`. V2.0 adds WAEC, KCSE, OBC in parallel.

---

## AI Roadmap

| Phase | AI capability |
|-------|---------------|
| V1.0 | Five chains (marking, guidance, generation, UVE L1-L2, curriculum); Haiku + Sonnet router |
| V1.1 | UVE L3-L4; improved cross-examination; bias benchmark suite per board |
| V2.0 | Board-specific few-shot marking examples; syllabus auto-chunking; SMS-safe report summaries |
| V3.0 | Local fine-tuned marking; on-device OCR/ASR fallback; shadow deployment automation |

Evaluation thresholds (marking ≥92%, zero hint leakage, generation cross-exam ≥95%) apply on every model or prompt change — see `AGENTS.md` Evaluation section.

---

## Operational Roadmap

| Phase | Operations |
|-------|------------|
| V1.0 | Vercel hosting, Neon Postgres, manual admin validation, Sentry + Plausible, weekly cron reports, R2 backups |
| V1.1 | Staging environment, automated CI benchmark on model changes, incident runbook drills |
| V2.0 | Multi-region Neon read replicas, status page, curriculum ops team workflow, cost dashboards per board |
| V3.0 | SLA targets, dedicated support tier for schools, compliance audits (GDPR + local African data laws) |

---

## Scalability Considerations

**Canonical:** `content-architecture.md` §8 (caching, indexing, AI orchestration, performance targets).  
**Engineering depth:** `ExamEdge_Engineering_Document.md` §13. Summary:

| Tier | Students | Key constraint | Mitigation |
|------|----------|----------------|------------|
| Pilot | 20–100 | AI cost | Haiku marking, pool cache, rate limits |
| Regional | 1,000–10,000 | Marking latency | Redis warm pool, connection pooling, Vercel concurrency |
| National | 100,000+ | DB + AI spend | Read replicas, batch reports, local models, CDN for static |

Marking is synchronous and AI-bound — horizontal scale adds concurrent Vercel functions; cost scales linearly until local models (V3.0).

---

## Deployment Approach (MVP)

| Component | Service | Notes |
|-----------|---------|-------|
| Web + API | Vercel | Production + preview branches |
| Database | Neon PostgreSQL | pgvector enabled; branch per environment |
| Cache | Upstash Redis | Serverless HTTP |
| Storage | Cloudflare R2 | Photos, backups |
| Email | Resend | Transactional only |
| Analytics | Plausible | Self-hosted or cloud — privacy-first |
| Errors | Sentry | Free tier |
| CI | GitHub Actions | Lint, typecheck, test on PR |
| Cron | Vercel Cron | CRON_SECRET protected |

Environment variables: see `architecture.md`. Secrets in Vercel dashboard only — never in git.

**Production checklist (Unit 31):** Sentry live, analytics verified, `/dev/*` disabled, demo account seeded, load test p95 < 3s, Anthropic credit balance monitored.

---

## Documentation Maintenance

When a release ships, update:

1. `progress-tracker.md` — phase status
2. `project-overview.md` — scope tables if features move in/out of MVP
3. `build-plan.md` — only for MVP; post-V1.0 features go in this roadmap
4. `documentation-map.md` — if new doc categories added

---

## Deferred Features Quick Reference

See `project-overview.md` Features Out of Scope table for MVP deferrals with target version.
