# Feature Implementation Prompts — ExamEdge

Copy-paste-ready prompts for every MVP unit and post-MVP feature.

**How to use:** Open the next prompt file → copy the **entire file** → paste into chat → wait for Context and Research Summary → implement.

**Canonical index:** [`FEATURE-IMPLEMENTATION-PROMPTS.md`](../FEATURE-IMPLEMENTATION-PROMPTS.md)

**Process reference:** [`feature-development-prompts.md`](../feature-development-prompts.md) §2–§2d

## Design system (all UI units — Units 02, 03, 04, 06, 15–23, 25–29, 31)

Before any UI unit, read:

1. [`design-brand-identity.md`](../design-brand-identity.md) — Teal Forest brand, tagline, mastery heatmap
2. [`ui-tokens.md`](../ui-tokens.md) — CSS variables (authoritative)
3. [`ui-rules.md`](../ui-rules.md) — layout, navigation, do-nots
4. [`examedge-ui-mockup-prompt.md`](../examedge-ui-mockup-prompt.md) — full screen mockup target

**Solo dev note:** GitHub Issues are optional. Track progress in [`progress-tracker.md`](../progress-tracker.md) only.

**Code vs docs:** If merged code still uses legacy Exam Blue (`#1E40AF`), docs/mockups use Teal Forest — rebrand in Unit 31.

## Build order

### MVP V1.0 — Phase 0 Foundation (Units 01–08)

- [Unit 01 Monorepo Scaffold](./unit-01-monorepo-scaffold.md)
- [Unit 02 Design System](./unit-02-design-system.md)
- [Unit 03 Landing Page](./unit-03-landing-page.md)
- [Unit 04 Katex Mathquill](./unit-04-katex-mathquill.md)
- [Unit 05 Database Schema](./unit-05-database-schema.md)
- [Unit 06 Auth Scaffold](./unit-06-auth-scaffold.md)
- [Unit 07 Plausible Analytics](./unit-07-plausible-analytics.md)
- [Unit 08 Redis Rate Limiting](./unit-08-redis-rate-limiting.md)

### MVP V1.0 — Phase 1 AI Chains (Units 09–14)

- [Unit 09 Model Router](./unit-09-model-router.md)
- [Unit 10 Marking Chain](./unit-10-marking-chain.md)
- [Unit 11 Guidance Chain](./unit-11-guidance-chain.md)
- [Unit 12 Generation Rag](./unit-12-generation-rag.md)
- [Unit 13 Uve Probes](./unit-13-uve-probes.md)
- [Unit 14 Curriculum Chain](./unit-14-curriculum-chain.md)

### MVP V1.0 — Phase 2 Student Core (Units 15–23)

- [Unit 15 Dashboard Ui Mock](./unit-15-dashboard-ui-mock.md)
- [Unit 16 Study Session Ui Mock](./unit-16-study-session-ui-mock.md)
- [Unit 17 Session Api](./unit-17-session-api.md)
- [Unit 18 Hint Flow](./unit-18-hint-flow.md)
- [Unit 19 Dashboard Real Data](./unit-19-dashboard-real-data.md)
- [Unit 20 Curriculum Explain Ui](./unit-20-curriculum-explain-ui.md)
- [Unit 21 Progress Page](./unit-21-progress-page.md)
- [Unit 22 Marking Appeals](./unit-22-marking-appeals.md)
- [Unit 23 Profile Privacy](./unit-23-profile-privacy.md)

### MVP V1.0 — Phase 3 Assessment (Units 24–26)

- [Unit 24 Question Pool](./unit-24-question-pool.md)
- [Unit 25 Exam Simulation](./unit-25-exam-simulation.md)
- [Unit 26 Focus Sessions](./unit-26-focus-sessions.md)

### MVP V1.0 — Phase 4 Resilience (Units 27–31)

- [Unit 27 Pwa Offline](./unit-27-pwa-offline.md)
- [Unit 28 Photo Ocr](./unit-28-photo-ocr.md)
- [Unit 29 Admin Validation](./unit-29-admin-validation.md)
- [Unit 30 Background Jobs](./unit-30-background-jobs.md)
- [Unit 31 Pilot Hardening](./unit-31-pilot-hardening.md)

### Post-MVP V1.1 (F-32–F-40)

- [F 32 React Native Mobile](./f-32-react-native-mobile.md)
- [F 33 Google Oauth](./f-33-google-oauth.md)
- [F 34 Teacher Dashboard](./f-34-teacher-dashboard.md)
- [F 35 Postgresql Rls](./f-35-postgresql-rls.md)
- [F 36 Jwt Refresh Blocklist](./f-36-jwt-refresh-blocklist.md)
- [F 37 Csp Csrf Headers](./f-37-csp-csrf-headers.md)
- [F 38 French I18N](./f-38-french-i18n.md)
- [F 39 Expanded Gce Subjects](./f-39-expanded-gce-subjects.md)
- [F 40 Uve L3 L4](./f-40-uve-l3-l4.md)

### Post-MVP V2.0 (F-41–F-51)

- [F 41 Automated Data Export](./f-41-automated-data-export.md)
- [F 42 Waec Neco](./f-42-waec-neco.md)
- [F 43 Kcse](./f-43-kcse.md)
- [F 44 Obc Francophone](./f-44-obc-francophone.md)
- [F 45 Graduate Success Hub](./f-45-graduate-success-hub.md)
- [F 46 Ussd Sms](./f-46-ussd-sms.md)
- [F 47 Whisper Oral Asr](./f-47-whisper-oral-asr.md)
- [F 48 Cognitive Fingerprint](./f-48-cognitive-fingerprint.md)
- [F 49 Alumni Mentors](./f-49-alumni-mentors.md)
- [F 50 Payment Subscription](./f-50-payment-subscription.md)
- [F 51 Local Model Routing](./f-51-local-model-routing.md)

### Post-MVP V3.0+ (F-52–F-56)

- [F 52 Syllabus Auto Chunking](./f-52-syllabus-auto-chunking.md)
- [F 53 Ministry Analytics](./f-53-ministry-analytics.md)
- [F 54 Public Api Multi Tenant](./f-54-public-api-multi-tenant.md)
- [F 55 Edge Integrity Analytics](./f-55-edge-integrity-analytics.md)
- [F 56 Ecosystem V4](./f-56-ecosystem-v4.md)
