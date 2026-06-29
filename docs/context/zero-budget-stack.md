# Zero-Budget Stack Assessment — ExamEdge MVP

**Purpose:** Confirm whether the MVP can be built, tested, deployed, and piloted with **no initial funding**, using free tiers and open-source tools — without compromising quality or requiring architectural rewrites when you upgrade.

**Verdict summary:**

| Category | Zero-dollar feasible? | Notes |
|----------|----------------------|-------|
| Application code (Next.js, Drizzle, Auth.js, KaTeX…) | **Yes** | 100% open source |
| Hosting + database + cache + storage | **Yes** | Free tiers sufficient for 20-student pilot |
| Email + error monitoring | **Yes** | Resend + Sentry free tiers |
| Analytics | **Yes (with choice)** | Plausible script to cloud trial, self-host CE, or defer |
| Embeddings (Voyage AI) | **Yes** | 200M tokens free per account |
| LLM inference (Anthropic) | **Partially** | ~$5 starter credits only — not a permanent free tier |
| **Realistic MVP cash outlay** | **$0–15/month** | $0 infra possible; AI is the only mandatory spend after credits exhaust |

See `roadmap.md` for upgrade paths. See `platform-how-it-works.md` for pedagogical and AI production behaviour.

---

## Design Principle: Upgrade Without Migration

Every component was chosen so that **paid upgrades change plan tier or API volume — not architecture**:

```
Free tier          →  Paid tier              →  Scale tier
Neon Free          →  Neon Launch ($)        →  Neon Scale + read replicas
Vercel Hobby       →  Vercel Pro ($)         →  Dedicated / multi-region
Upstash Free       →  Pay-as-you-go ($)      →  Fixed plans / Redis Cloud
R2 Free 10GB       →  $0.015/GB-month        →  Same API
Haiku marking      →  Same API, higher limits →  Local fine-tuned model (router swap)
Voyage embeddings  →  $0.02–0.06/1M tokens   →  Same pgvector schema
```

The **model router** (`packages/ai/router.ts`) is the single switch point for AI cost optimisation at scale — no chain rewrites required.

---

## Component-by-Component Assessment

### Application Layer (100% Free — Open Source)

| Component | Cost | MVP sufficiency | Upgrade path |
|-----------|------|-----------------|--------------|
| Next.js 14 App Router | $0 | Excellent | Same framework at scale |
| React 18 | $0 | Excellent | — |
| TypeScript | $0 | Excellent | — |
| Tailwind CSS v3 | $0 | Excellent | — |
| shadcn/ui pattern | $0 | Excellent | — |
| npm workspaces + Turborepo | $0 | Excellent | — |
| Drizzle ORM | $0 | Excellent | — |
| Auth.js v5 | $0 | Excellent | Add OAuth providers (V1.1) |
| KaTeX | $0 | Excellent | — |
| MathQuill | $0 | Excellent | — |
| LangChain.js | $0 (library) | Excellent | API costs billed separately |
| Zod | $0 | Excellent | — |
| Service Worker + IndexedDB | $0 | Excellent | — |
| Expo / React Native | $0 (deferred V1.1) | N/A for MVP | EAS free tier limited builds |

**Quality note:** These are industry-standard choices used in production at scale. Free does not mean inferior.

---

### Hosting — Vercel (Hobby Plan)

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month |
| **Includes** | 1M function invocations, 4 CPU-hours, 360 GB-hrs memory, 100 GB fast data transfer |
| **MVP pilot (20 students)** | More than sufficient |
| **Limitations** | Hobby is intended for **personal, non-commercial** projects per Vercel ToS; team features limited; 300s max function duration |
| **Risk** | Competition/education startup may eventually need Vercel Pro ($20/mo) or alternative host for commercial use |
| **Zero-budget alternative** | **Cloudflare Pages** (free, generous) + **Cloudflare Workers** for API; or **Railway** ($5 trial credit). Next.js App Router deploys to both with minimal config changes |
| **Upgrade path** | Vercel Pro → same codebase; or containerise to Railway/Fly.io without rewrite |

**Recommendation for zero budget:** Start on Vercel Hobby for development and demo. Before public commercial launch, evaluate Pro plan or Cloudflare Pages (still $0 at pilot scale).

---

### Database — Neon PostgreSQL + pgvector

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month (permanent free tier, no credit card) |
| **Includes** | 0.5 GB storage, 100 CU-hours/month, 5 GB egress, pgvector extension, 10 branches |
| **MVP pilot** | Sufficient for 20 students, thousands of responses, syllabus chunks, embeddings |
| **Limitations** | Scale-to-zero after 5 min idle (cold start ~100–500ms); 0.5 GB storage cap; compute suspended if quota exceeded |
| **Mitigation** | Keep seed data lean; archive old sessions post-pilot; use one project only; monitor storage in Neon dashboard |
| **Upgrade path** | Neon Launch pay-as-you-go — same connection string pattern, no schema migration |

**Quality note:** Neon is production-grade serverless Postgres used by serious startups. The free tier is a real database, not a toy.

---

### Cache — Upstash Redis

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month |
| **Includes** | 500,000 commands/month, 256 MB, 10 GB bandwidth |
| **MVP usage** | Rate limiting (~2–3 commands/check), idempotency keys, warm question cache |
| **Estimated pilot load** | ~5,000–20,000 commands/month at 20 active students |
| **Limitations** | HTTP-based client adds ~1–5ms vs TCP Redis; 500K/month cap |
| **Upgrade path** | Pay-as-you-go $0.20/100K commands — same `@upstash/redis` client |

---

### Object Storage — Cloudflare R2

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month |
| **Includes** | 10 GB storage, 1M Class A ops, 10M Class B ops, **zero egress fees** |
| **MVP usage** | Handwritten answer photos (~500 KB each), pg_dump backups |
| **Pilot estimate** | 100 photos × 500 KB = 50 MB — well within free tier |
| **Upgrade path** | $0.015/GB-month beyond 10 GB — S3-compatible API unchanged |

---

### Email — Resend

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month |
| **Includes** | 3,000 emails/month, 100/day, 1 verified domain |
| **MVP usage** | Password reset, weekly reports (20 students × 4 weeks = 80 emails) |
| **Limitations** | 1 domain; daily cap |
| **Upgrade path** | Pro $20/mo — same API |

---

### Error Monitoring — Sentry

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0/month (Developer plan) |
| **Includes** | 5,000 errors/month, 10K performance transactions, 1 user |
| **MVP pilot** | Sufficient if error budget managed (don't log expected 404s as errors) |
| **Limitations** | 1 user only; events dropped (not queued) when exceeded |
| **Upgrade path** | Team $26/mo — same SDK, add team members |

---

### Analytics — Plausible (Not PostHog)

**PostHog is not in the ExamEdge architecture.** The starter-kit reference project (JobPilot) uses PostHog; ExamEdge deliberately uses **Plausible** for privacy-first, cookie-free analytics suitable for minors.

| Option | Cost | Trade-off |
|--------|------|-----------|
| **Plausible Cloud** | 30-day trial, then ~$9/mo for low traffic | Zero ops; EU-hosted |
| **Plausible Community Edition (self-hosted)** | $0 software; needs VPS (~$5–6/mo if no free VPS) | Full control; you manage Docker, Postgres, ClickHouse |
| **Defer analytics (Units 07 stub only)** | $0 | Track events in Postgres audit table for pilot; add Plausible when funded |
| **Vercel Web Analytics** | 50K events/mo on Hobby | Pageviews only — not custom events |

**Zero-budget recommendation:** For true $0, defer Plausible Cloud until grant funding OR log custom events to a `analytics_events` Postgres table during pilot (already have DB). Wire Plausible when $9/mo is available. Unit 07 can ship with a `trackEvent()` wrapper that writes to DB in development.

---

### AI — Anthropic Claude (Critical: Not Permanently Free)

| Attribute | Detail |
|-----------|--------|
| **Starter credits** | New Console accounts receive ~**$5 free API credits** (phone verification required) |
| **Permanent free tier?** | **No** — after credits exhaust, prepaid credits required |
| **MVP model mix** | Haiku 4.5 (marking, hints L1-L2, UVE L1-L2) + Sonnet 4.6 (hints L3, generation, curriculum, OCR) |

**Estimated pilot AI cost (20 students, 4 weeks, moderate use):**

| Chain | Model | Calls (est.) | Cost (est.) |
|-------|-------|--------------|-------------|
| Marking | Haiku | ~800 | ~$0.24 |
| Hints | Haiku + Sonnet | ~200 | ~$0.15 |
| UVE L1-L2 | Haiku | ~400 | ~$0.08 |
| Curriculum explain | Sonnet (cached) | ~30 unique topics | ~$0.10 |
| Question generation | Sonnet (batch, admin) | ~50 | ~$0.50 |
| OCR fallback | Sonnet | ~50 photos | ~$0.25 |
| Cross-examination | Haiku | ~50 | ~$0.05 |
| **Total pilot (est.)** | | | **~$1.50–$5.00** |

**Conclusion:** $5 Anthropic starter credits can cover the **entire 20-student pilot** if Sonnet usage is controlled (cache curriculum, batch generation, rate limits enforced).

**If credits exhaust before funding:**

1. **Development:** Mock marking chain with JSON fixtures — zero API calls (`packages/ai/__fixtures__/`)
2. **Competition demo:** Pre-seed demo account; rehearse script without regenerating AI content
3. **Grants:** Anthropic Startup Program, AWS Activate, Google for Startups, competition prizes
4. **Minimal spend:** Preload $10–20 prepaid credits — still achieves ≤$20/month total with $0 infra

**Upgrade path:** Same API keys, higher rate limits, Batch API (50% discount for async jobs) — no architecture change.

---

### Embeddings — Voyage AI

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0 for first **200 million tokens** per account (voyage-4-lite recommended) |
| **MVP usage** | ~1,500 tokens × 500 questions = 750K tokens — negligible |
| **Permanent?** | Free tokens persist even after adding payment method |
| **Upgrade path** | $0.02/1M tokens (voyage-4-lite) — same embedding dimensions stored in pgvector |

**Quality note:** Voyage's free allowance is among the most generous in the industry — RAG is effectively free for MVP and early scale.

---

### CI/CD — GitHub Actions

| Attribute | Detail |
|-----------|--------|
| **Cost** | $0 for public repos; 2,000 min/month free for private repos |
| **MVP** | Lint + typecheck + unit tests on PR — sufficient |
| **Upgrade path** | More minutes or self-hosted runners |

---

## Services Explicitly Not in MVP Stack

| Service | Status | Reason |
|---------|--------|--------|
| **PostHog** | Not used | Privacy + cookie concerns for minors; Plausible or DB logging instead |
| **Google Analytics** | Not used | GDPR/cookie banner; privacy-first design |
| **Clerk / Auth0** | Not used | Vendor cost; Auth.js is free |
| **Supabase** | Not used | Neon chosen for pgvector + branching |
| **Pinecone / Weaviate** | Not used | pgvector in Neon avoids separate vector DB cost |
| **OpenAI** | Not used | Anthropic-only via router (swappable later) |

---

## Zero-Budget MVP Operating Modes

### Mode A — True $0 (Maximum Constraint)

| Layer | Strategy |
|-------|----------|
| Infra | Neon + Upstash + R2 + Vercel Hobby + Resend + Sentry free tiers |
| Analytics | Postgres event log instead of Plausible |
| AI (dev) | Mock chains with fixtures — no API calls |
| AI (pilot) | $5 Anthropic starter credits only |
| Email | Stub password reset in dev; real Resend for pilot |

**Risk:** Anthropic credits may not cover full pilot if usage is heavy. Mitigate with rate limits (Unit 08) and caching.

### Mode B — Recommended Pilot ($0 infra + ≤$15 AI)

| Layer | Strategy |
|-------|----------|
| Everything in Mode A | — |
| AI | $5 starter + $10 prepaid if needed |
| Analytics | Plausible Cloud $9/mo OR defer |

**Total:** $0–24 for entire 10-week build + 4-week pilot — aligns with original ≤$20/month **average** target.

### Mode C — Funded Pilot ($20–50/month)

| Layer | Strategy |
|-------|----------|
| Vercel Pro | $20/mo (commercial use, team) |
| Plausible Cloud | $9/mo |
| Anthropic | $10–20/mo prepaid |
| Infra rest | Still free tiers |

---

## Free Tier Limitations — Honest Matrix

| Service | Hard limit | What happens when exceeded | Pilot impact |
|---------|------------|---------------------------|--------------|
| Neon | 0.5 GB storage | Writes fail | Low if photos in R2 not DB |
| Neon | 100 CU-hours | Compute suspended until next month | Low with scale-to-zero |
| Upstash | 500K commands | Errors / upgrade required | Very low at pilot scale |
| Vercel Hobby | 1M invocations | Feature blocked 30 days | Low |
| Anthropic | Credit balance $0 | API returns 402 — marking stops | **High — monitor balance daily** |
| Resend | 100 emails/day | 429 error | Low |
| Sentry | 5K errors/mo | Events dropped | Low with good error hygiene |
| R2 | 10 GB | Overages billed (needs card on file) | Very low |

---

## Cost Optimisation Strategies (Built Into Architecture)

These are not future ideas — they are **MVP requirements** documented in `AGENTS.md`:

1. **Haiku for all marking** — 10–20× cheaper than Sonnet for rubric application
2. **Router enforced** — never hardcode Sonnet in marking routes
3. **Question pool cache-first** — zero LLM at question delivery time
4. **Curriculum + validated questions cached permanently** — second request = no LLM
5. **UVE async** — does not block marking response
6. **Idempotency** — duplicate submits never double-charge AI
7. **Rate limits** — 60 AI ops/hour/user; 100/hour circuit breaker
8. **Generation is batch-only** — nightly cron, not real-time
9. **Cross-examination uses Haiku** — not Sonnet
10. **Mark scheme minification** — caps tokens per marking call at 4,000

At scale (see `ExamEdge_Cost_Optimisation_Economics.md`):

11. **Batch API** for reports and generation (50% discount)
12. **Local fine-tuned Haiku-class models** (V3.0) — router swap only
13. **Read replicas** for dashboard — reduce primary load
14. **Archive cold responses to R2** — keep Neon storage lean

---

## Monitoring Spend on Zero Budget

| Service | Where to check |
|---------|----------------|
| Anthropic | console.anthropic.com → Billing → credit balance |
| Neon | Console → Usage |
| Upstash | Dashboard → Usage |
| Vercel | Dashboard → Usage |
| Resend | Dashboard → Emails sent |
| Voyage | Dashboard → Token usage (200M free — unlikely to matter) |

**Alert rule for pilot:** Set Anthropic low-balance mental threshold at $1.00 — switch demo to pre-recorded session if needed.

---

## Summary: Can You Start With $0?

**Yes — with one non-negotiable caveat:**

| Question | Answer |
|----------|--------|
| Can I build and deploy the app for $0? | **Yes** — all infra free tiers cover MVP |
| Can I run AI features forever for $0? | **No** — Anthropic requires credits after ~$5 starter |
| Can I complete a 20-student pilot for ≤$5 total AI spend? | **Yes** — with Haiku-first routing, caching, and rate limits |
| Will I need to rewrite when funded? | **No** — upgrade plan tiers and API budgets only |
| Is quality compromised? | **No** — free tiers are production tools; pedagogical quality comes from architecture (five chains, UVE, human validation), not spend |

**Next document:** `platform-how-it-works.md` — pedagogy and production AI behaviour. **`ai-cost-and-exam-system.md`** — model routing, cost at scale, and examination system.
