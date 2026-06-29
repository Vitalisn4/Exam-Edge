# Engineering Operations — ExamEdge

**Canonical Tier 1 blueprint** for testing, CI/CD, monitoring, observability, disaster recovery, and operational procedures.

**Depth reference:** `ExamEdge_Engineering_Document.md` §9–10, §11 (data governance), `platform-ecosystem-ops.md` §7.

---

## 1. Testing Strategy

### 1.1 Testing Pyramid

| Layer | Tool | Scope | Target |
|-------|------|-------|--------|
| **Unit** | Vitest | Parameter instantiation, IRT/SM-2 math, Zod schemas, mark scheme helpers, sanitize | 80% coverage of `packages/shared`, `packages/db` pure logic |
| **Integration** | Vitest + Neon branch | Route handlers: auth, RBAC, idempotency, DB transactions | Every API route |
| **AI evaluation** | Vitest + fixtures | 500 marking tasks, 100 hint leakage scenarios, generation cross-exam | On every `packages/ai/` change (V1.1 CI gate) |
| **E2E** | Playwright | Register → study → mark → UVE; exam sim → report | Preview deploy before merge to main |

### 1.2 AI-Specific Tests (Non-Negotiable)

| Suite | Threshold | When run |
|-------|-----------|----------|
| Marking agreement vs human | ≥92% | Model/prompt change |
| Hint answer-leakage | 0 violations | Every guidance prompt change |
| Generation cross-examination | ≥95% pass | Before admin pool add |
| Schema validation | 100% conforming outputs | Every chain call in tests |

Fixtures: `packages/ai/__fixtures__/` for dev without API calls.

### 1.3 Manual Verification (Every UI Unit)

- 360px viewport (primary target device)
- Offline queue sync (Unit 27)
- Exam timer + tab-switch pause (Unit 25)
- Pilot checklist: `demo-script.md`

Commands (Unit 01):

```bash
npm run typecheck
npm run lint
npm run test
```

---

## 2. CI/CD Pipeline

### 2.1 GitHub Actions (`.github/workflows/main.yml`)

```
on: push, pull_request

jobs:
  test:
    - npm run lint
    - npm run typecheck
    - npm run test:unit
    - npm run test:integration   # Neon test branch

  deploy-preview:
    needs: test
    - Vercel preview deploy
    - npm run test:e2e -- --base-url $PREVIEW_URL

  deploy-production:
    needs: [test, deploy-preview]
    if: ref == main
    - Vercel production deploy
```

**MVP (solo):** lint + typecheck + unit tests on PR. E2E + preview gate → V1.1.

### 2.2 Environments

| Environment | Database | Purpose |
|-------------|----------|---------|
| Local | Neon branch or Docker Postgres | Development |
| Preview | Neon branch per PR | E2E, stakeholder review |
| Production | Neon main | Pilot + live users |

**Secrets:** Vercel dashboard only — never in git. See `architecture.md` env vars.

### 2.3 Deployment Checklist (Unit 31)

- [ ] Sentry DSN live
- [ ] `/api/health` returns 200 with DB + Redis checks
- [ ] `/dev/*` disabled in production
- [ ] Demo account seeded
- [ ] Anthropic credit balance monitored
- [ ] Cron jobs validate `CRON_SECRET`
- [ ] R2 backup cron verified

---

## 3. Monitoring & Observability

### 3.1 Stack

| Tool | Tier | Purpose |
|------|------|---------|
| **Sentry** | Free | Exceptions, performance transactions |
| **Uptime Robot** | Free | `/api/health` every 5 min |
| **Vercel Analytics** | Hobby | Route latency, geography |
| **Plausible** or Postgres events | See zero-budget-stack | Product analytics |
| **Structured stdout logs** | Vercel | AI call: model, tokens, latency, confidence |

### 3.2 Health Endpoint

```
GET /api/health

200 {
  "status": "healthy",
  "checks": {
    "database": { "status": "ok", "latency_ms": 14 },
    "redis":    { "status": "ok", "latency_ms": 3 },
    "ai_api":   { "status": "ok" | "degraded", "latency_ms": 380 }
  }
}
```

503 if database unreachable — friendly message to clients.

### 3.3 Alert Thresholds

| Signal | Threshold | Action |
|--------|-----------|--------|
| Error rate | >1% of requests | Investigate Sentry |
| AI chain failure | >5% | Check Anthropic status; enable fixtures |
| Marking p95 latency | >5s | Scale concern; check pool cache |
| Anthropic balance | <$1 | Alert owner; demo fallback |
| Appeal rate spike | >3 per question | Flag question in pool |

### 3.4 AI Cost Observability (V1.1 Dashboard)

Log every call: `{ chain, model, inputTokens, outputTokens, estimatedCostUsd, cacheHit }`  
Weekly: actual spend vs budget; pool hit rate; cost per active student.

---

## 4. Disaster Recovery

| Asset | RPO | RTO | Procedure |
|-------|-----|-----|-----------|
| PostgreSQL | 24h (weekly dump); PITR on Neon paid | ~30 min | Restore from R2 `backups/pg_dump_*.sql.gz` |
| Redis cache | N/A | Rebuild | Cold cache → Postgres |
| R2 photos | 0 | N/A | Durable storage |
| AI prompts/chains | 0 | Redeploy | Git tagged releases |

**Neon failover:** Automatic ~30s RTO; sessions cached in Redis survive short outages.

**Weekly cron:** pg_dump → R2 (Unit 30).

---

## 5. Incident Response (Summary)

| Severity | Example | Response |
|----------|---------|----------|
| **SEV1** | Data breach, marking completely broken | All-hands; pause AI if unsafe; notify users if PII |
| **SEV2** | Database outage | 503 message; queue offline answers client-side |
| **SEV3** | Elevated AI validation failures | Rollback prompt; mock chain for demo |
| **SEV4** | UI defect | Next deploy |

**AI provider down:** Save answers; show "Marking delayed — saved locally"; never guess marks.

Full runbook scenarios: `ExamEdge_Engineering_Document.md` §10.3 (Tier 3 detail). Drills: V1.1 quarterly.

---

## 6. Data Governance (Operations View)

| Class | Retention | Deletion |
|-------|-----------|----------|
| Student PII | Account lifetime | Soft delete → 30-day purge |
| Academic responses | Permanent (learning history) | Anonymise on account purge |
| Audit logs | 7 years | Append-only |
| AI marking logs | 2 years | Aggregated after |
| Photos (R2) | 1 year post-session | Purge with account |
| Embeddings | Permanent with question | Deprecate with question |

Detail: Engineering doc §11; student-facing: `student-journey.md` §3; legal: Responsible AI doc §4.

---

## 7. Operational Procedures (Cadence)

| Procedure | Owner | Frequency |
|-----------|-------|-----------|
| Question validation queue | Admin / specialist | Daily during content ramp |
| Appeal resolution | Admin / specialist | Within 48h |
| Hallucination registry review | Dev + specialist | Monthly |
| Syllabus currency check | Curriculum ops | Per board cycle |
| Anthropic spend review | Dev | Weekly |
| Backup verification | Cron + manual spot-check | Weekly |
| Security verification | Dev | Unit 31 + pre-pilot |
| AI benchmark suite | CI | On AI package change |
| Pool monitor / generation | Cron | Nightly |

---

## 8. Production Readiness Gates

| Gate | MVP pilot | V1.1 production | V3.0 scale |
|------|-----------|-----------------|------------|
| Unit + integration tests | Core paths | Full API coverage | + load tests |
| E2E tests | Happy path | Full journeys | Multi-region |
| Sentry | ✓ | + alerting rules | + on-call |
| Health checks | ✓ | + Uptime Robot | Status page |
| RLS policies | App-layer | PostgreSQL RLS | Sharding |
| Staging environment | Preview only | Dedicated staging | Multi-env |
| Incident runbook | Summary | Full drills | 24/7 on-call |
| Compliance audit | Privacy policy | GDPR review | Multi-jurisdiction |

---

*Update when CI pipeline, alerting, or DR procedures change.*
