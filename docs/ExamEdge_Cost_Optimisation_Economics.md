> **Canonical positioning & roadmap:** [`context/project-overview.md`](context/project-overview.md) · [`context/roadmap.md`](context/roadmap.md)

__EXAMEDGE__

Cost Optimisation, AI Economics &

Long\-Term Sustainability Engineering

*Model Routing  |  Open\-Source AI  |  Caching Strategy  |  Infrastructure Economics  |  Unit Economics  |  Sustainability Roadmap*

__Engineering Volume VII__

Document Status: Pre\-Development Engineering Specification

June 2026  |  Version 1\.0

__Author: Ngam Vitalis Yuh__

Software Engineer  |  Yaounde, Cameroon  |  github\.com/Vitalisn4

Companion to the Master Engineering Document \(Volume VI\)

# __1\. The Cost Problem — Stated With Precision__

*The single greatest risk to ExamEdge's long\-term sustainability is not competition, regulatory friction, or technical complexity\. It is the possibility that AI inference costs grow linearly with the user base, making the platform economically unviable at the exact moment it achieves continental scale\.*

## __1\.1 The Cost Trap to Avoid__

A naive implementation of ExamEdge sends every student interaction to a frontier AI model API\. The economics of this approach are lethal at scale:

__Metric__

__Naive Impl\.__

__Optimised__

__Target__

__Notes__

__AI calls per active student per day__

~8

~8

~8

Marking \+ UVE \+ guidance per session

__Average tokens per call \(input\+output\)__

~1,200

~1,200

~1,200

Mark scheme \+ answer \+ feedback

__Cost per call \(Claude claude\-sonnet\-4\-6 $3/M tokens\)__

$0\.0036

$0\.0036

$0\.0036

Most expensive model for all tasks

__Daily AI cost per student__

$0\.029

$0\.029

$0\.029

$0\.87/student/month

__Monthly AI cost at 10,000 students__

__$8,700__

—

—

Exceeds entire platform revenue at entry pricing

__Monthly AI cost at 100,000 students__

__$87,000__

—

—

Completely unsustainable

__Monthly AI cost at 1,000,000 students__

__$870,000__

—

—

Platform becomes a charity case

## __1\.2 The Optimised Target Economics__

ExamEdge's cost architecture is engineered to achieve the following unit economics, making the platform sustainable at every scale tier:

__Unit Economics Metric__

__Naive__

__Achieved__

__Target__

__How__

__AI cost per active student per month \(MVP, 500 students\)__

$0\.87

__$0\.08__

__$0\.08__

10\.9x reduction

__AI cost per active student per month \(Year 2, 5,000 students\)__

$0\.87

__$0\.05__

__$0\.04__

21\.8x reduction

__AI cost per active student per month \(Year 3, 50,000 students\)__

$0\.87

__$0\.02__

__$0\.02__

43\.5x reduction

__AI cost per active student per month \(Year 4, 500,000 students\)__

$0\.87

__$0\.008__

__$0\.005__

174x reduction

__Infrastructure cost per student per month \(all tiers\)__

$0\.05

__$0\.03__

__$0\.02__

Scale efficiencies

__Total platform cost per student per month \(Year 2\)__

$0\.92

__$0\.08__

__$0\.06__

vs $3\-5 subscription price

These economics are achieved through five interlocking strategies: intelligent model routing \(the right model for each task\), aggressive question caching \(generate once, serve millions\), open\-source model deployment \(no per\-token cost for high\-frequency tasks\), sub\-linear AI scaling \(costs grow logarithmically, not linearly, with users\), and progressive offloading \(more work moves to cheaper models as training data accumulates\)\.

# __2\. Intelligent Model Routing Architecture__

*Not every AI task in ExamEdge requires a frontier model\. Routing each task to the cheapest model capable of performing it at the required quality level is the single most impactful cost reduction available without degrading the student experience\.*

## __2\.1 The Model Tier System__

ExamEdge defines four model tiers, each with a specific cost profile and capability requirement\. The router assigns every AI task to the cheapest appropriate tier at runtime:

__Tier__

__Model__

__Cost/Call__

__Latency__

__Tasks Assigned__

__Tier 0
On\-device__

Whisper\.cpp, Google ML Kit, on\-device Llama \(future\)

__$0 per call__

150ms–2s

Offline tasks: speech\-to\-text, handwriting OCR, basic spell\-check\. No internet required\. Privacy\-preserving\.

__Tier 1
Open\-source hosted__

Mistral 7B / LLaMA 3 8B fine\-tuned, self\-hosted on Railway \($20/mo GPU\)

__~$0\.0001 per call__

200ms–800ms

High\-frequency structured tasks: GCE Mathematics marking \(post\-fine\-tuning Year 2\), multiple\-choice evaluation, simple hint generation\.

__Tier 2
Claude Haiku__

Claude Haiku 4\.5 — $0\.25/M input, $1\.25/M output

__~$0\.0003 per call__

300ms–1\.5s

Medium\-complexity tasks requiring instruction following: science marking, B1 knowledge\-point marking, guided hint chains, report generation\.

__Tier 3
Claude claude\-sonnet\-4\-6__

Claude claude\-sonnet\-4\-6 — $3/M input, $15/M output

__~$0\.003 per call__

1s–5s

Highest\-reasoning tasks only: question generation, UVE Level 3\-4 probes, Socratic guidance, curriculum explanation, complex proof assessment\.

## __2\.2 Task\-to\-Tier Assignment Matrix__

The following matrix assigns every ExamEdge AI task to its optimal tier, with the routing logic explained:

__Task__

__Tier__

__Routing Justification__

__Upgrade Path__

__GCE Mathematics marking \(M1/A1/B1 rubric\)__

__Tier 2__

Rubric application is structured pattern matching, not open\-ended reasoning\. Haiku handles Zod\-validated JSON output reliably at temperature 0\.1\. After Year 2 fine\-tuning: migrate to Tier 1\.

Tier 2 → Tier 1 \(Year 2\)

__GCE Science marking \(Physics/Chemistry/Biology\)__

__Tier 2__

Same as mathematics marking — structured rubric\. Haiku sufficient for knowledge\-point checklist evaluation\.

Tier 2 → Tier 1 \(Year 3\)

__Humanities marking \(Economics, Geography structured Q\)__

__Tier 2__

Partially structured rubrics\. Haiku handles descriptor\-based marking \(AO1\-AO4 levels\) adequately\.

Tier 2, with Tier 3 escalation for low\-confidence responses

__Essay marking \(English Literature, Philosophy\)__

__Tier 3__

Holistic judgement required\. Cannot be reduced to a checklist\. Sonnet's reasoning quality is necessary\. Low frequency — essays are a small % of questions\.

Tier 3 \(always\)

__Hint Level 1 \(first hint after wrong answer\)__

__Tier 2__

Simple reformulation of the question at a lower conceptual level\. Haiku handles this reliably\.

Tier 2

__Hint Level 2 \(intermediate hint\)__

__Tier 2__

More specific conceptual direction\. Haiku with slightly higher temperature \(0\.4\)\. Still structured\.

Tier 2

__Hint Level 3 \(final hint before solution reveal\)__

__Tier 3__

Requires nuanced reasoning about the student's specific error\. Sonnet's deeper understanding prevents accidentally revealing the answer\.

Tier 3

__UVE Level 1 — variable substitution probe__

__Tier 2__

Parameterised template generation with different numbers\. Haiku handles this mechanically\.

Tier 2

__UVE Level 2 — method transparency probe__

__Tier 2__

Semi\-structured explanation request\. Haiku evaluates against a fixed rubric\.

Tier 2

__UVE Level 3 — conceptual explanation probe__

__Tier 3__

Free\-form conceptual understanding assessment\. Requires deeper reasoning to evaluate quality\.

Tier 3

__UVE Level 4 — transfer probe generation__

__Tier 3__

Generating a contextually different but structurally equivalent question\. Requires creativity and curriculum knowledge\.

Tier 3

__Question generation \(new exam\-standard questions\)__

__Tier 3__

Highest\-quality output required\. Questions will be used by thousands of students\. Errors are expensive\. RAG\-grounded but still requires Sonnet's structural reasoning\.

Tier 3 \(but amortised — questions cached permanently\)

__Curriculum concept explanation__

__Tier 3__

Students learning from these explanations for the first time\. Quality directly affects understanding\. Factual accuracy is critical\.

Tier 3 \(but cached permanently per topic\)

__Student weekly progress report__

__Tier 2__

Structured narrative from database\-retrieved statistics\. Template\-guided generation\. Haiku handles personalised narrative from structured data well\.

Tier 2

__Speech\-to\-text \(oral explanation assessment\)__

__Tier 0__

Whisper\.cpp on\-device\. No API cost\. No internet required\. Privacy\-preserving\.

Tier 0 \(always\)

__Handwriting OCR \(photo upload pathway\)__

__Tier 0 / Tier 3__

Google ML Kit on\-device for standard mathematical notation\. Claude vision \(Tier 3\) as fallback for complex diagrams or low\-quality photos\.

Tier 0 primary, Tier 3 fallback

__Spaced repetition scheduling__

__None__

Pure algorithm \(SM\-2\)\. No AI call\. Runs as a database stored procedure or Vercel Cron job\.

No AI cost

__IRT difficulty estimation__

__None__

Statistical algorithm\. No AI call\.

No AI cost

__Focus session analytics__

__None__

Aggregation query on session data\. No AI call\.

No AI cost

__Exam paper assembly__

__None__

Algorithmic: query question pool by topic distribution, difficulty weighting, and student history exclusion\. No AI call\.

No AI cost

## __2\.3 The Model Router Implementation__

The model router is a simple TypeScript function that every AI chain calls before making an API request\. It selects the model based on task type, current confidence context, and system load:

// lib/ai/router\.ts

type TaskType = 'marking\_math' | 'marking\_science' | 'marking\_essay' |

  'hint\_1' | 'hint\_2' | 'hint\_3' | 'uve\_1' | 'uve\_2' | 'uve\_3' | 'uve\_4' |

  'question\_gen' | 'curriculum\_explain' | 'report\_gen' | 'ocr\_fallback';

type ModelConfig = \{ model: string; temperature: number; maxTokens: number; \};

const TASK\_MODEL\_MAP: Record<TaskType, ModelConfig> = \{

  marking\_math:      \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.1, maxTokens: 800 \},

  marking\_science:   \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.1, maxTokens: 800 \},

  marking\_essay:     \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.2, maxTokens: 1200 \},

  hint\_1:            \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.4, maxTokens: 400 \},

  hint\_2:            \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.4, maxTokens: 400 \},

  hint\_3:            \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.5, maxTokens: 600 \},

  uve\_1:             \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.2, maxTokens: 500 \},

  uve\_2:             \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.2, maxTokens: 500 \},

  uve\_3:             \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.3, maxTokens: 700 \},

  uve\_4:             \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.6, maxTokens: 700 \},

  question\_gen:      \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.7, maxTokens: 1500 \},

  curriculum\_explain:\{ model: 'claude\-sonnet\-4\-6', temperature: 0\.6, maxTokens: 2000 \},

  report\_gen:        \{ model: 'claude\-haiku\-4\-5',    temperature: 0\.4, maxTokens: 1000 \},

  ocr\_fallback:      \{ model: 'claude\-sonnet\-4\-6', temperature: 0\.1, maxTokens: 1500 \},

\};

export function getModelConfig\(task: TaskType\): ModelConfig \{

  // Future: check if fine\-tuned local model available for this task

  // if \(localModelRegistry\.supports\(task\)\) return localModelConfig\(task\);

  return TASK\_MODEL\_MAP\[task\];

\}

When the fine\-tuned Tier 1 model becomes available \(Year 2\), the router is updated to check localModelRegistry\.supports\(task\) first\. No chain code changes required — the router is the single point of model switching\.

# __3\. Question Caching — The Primary Cost Lever__

*Question generation is the most expensive AI operation in ExamEdge \(Sonnet, ~$0\.003 per question\)\. But questions, once generated and validated, are permanent, reusable assets\. A question generated today serves every student who encounters it for the lifetime of the platform\. This is the most powerful cost structure in the system: a one\-time AI investment that compounds in value with every additional student\.*

## __3\.1 The Cache Compounding Effect__

The economic principle: a question generated at $0\.003 and served to 10 students costs $0\.0003 per student\-question\. Served to 1,000 students: $0\.000003\. Served to 100,000 students: $0\.00000003\. The question's marginal cost approaches zero as the user base grows\. This is the anti\-linear scaling property that makes ExamEdge economically viable at continental scale\.

__Metric__

__Value__

__Naive Cost__

__Cached Cost__

__Notes__

__Questions in pool \(Phase 1, 3 subjects × 15 topics × 5 difficulty levels × 10 templates\)__

__2,250__

—

—

One\-time generation cost: $6\.75

__Cost to generate this pool__

__$6\.75__

—

—

Single Anthropic API spend, never repeated

__Questions served per day at 500 students \(avg 8 questions/student\)__

__4,000__

—

—

~178% cache reuse rate at 500 students

__New API calls per day \(cache miss rate ~5%\)__

__200__

—

—

~$0\.60/day for new questions only

__API calls per day at 50,000 students \(same pool, 2% miss rate\)__

__~800__

—

—

$2\.40/day for 400,000 question deliveries

__Cost per student per day \(AI question delivery only\)__

__—__

$0\.0012

__$0\.000006__

At 50k students: 200x cheaper than naive

## __3\.2 Cache Architecture — Three Layers__

### __Layer 1: PostgreSQL question pool \(permanent, production\-grade\)__

The primary cache\. All validated questions stored permanently in the questions table with their parameter schemas, mark schemes, and probe libraries\. Cache hit: a question is selected from the pool and parameters are instantiated locally \(no API call\)\. Cache miss: a new question must be generated \(Tier 3 API call\), validated, and added to the pool\.

// Cache hit path — zero API cost

async function getQuestion\(topicId: string, difficulty: number, excludeIds: string\[\]\) \{

  // Select from validated pool, excluding recently seen questions

  const question = await db\.select\(\)\.from\(questions\)

    \.where\(and\(

      eq\(questions\.topicId, topicId\),

      eq\(questions\.difficulty, difficulty\),

      eq\(questions\.validated, true\),

      notInArray\(questions\.id, excludeIds\)  // no repeats in 30 days

    \)\)

    \.orderBy\(sql\`RANDOM\(\)\`\)  // randomise selection

    \.limit\(1\);

  if \(question\.length > 0\) \{

    // Instantiate parameters locally — no AI call

    return instantiateParams\(question\[0\]\);  // $0\.000 cost

  \}

  // Cache miss — generate new question \(triggers Tier 3 API call\)

  return await generateAndCacheQuestion\(topicId, difficulty\);  // $0\.003

\}

### __Layer 2: Redis short\-term cache \(frequently accessed warm questions\)__

For the top 200 most\-accessed questions \(identified by access\_count in the questions table\), Redis caches the fully instantiated question objects with a 1\-hour TTL\. This reduces database query load for the most popular topics \(differentiation, integration, Newton's laws\) — the questions a majority of students encounter\.

### __Layer 3: Concept explanation permanent cache__

AI\-generated concept explanations \(the longest and most expensive Tier 3 calls — up to 2,000 tokens\) are cached permanently in the database against their topic\_id and language\_code\. Once generated, a concept explanation is never regenerated unless the syllabus changes\. At 200 topics × 2 languages, the total one\-time cost to populate this cache is approximately $2\.40 — after which concept explanations have zero marginal AI cost\.

## __3\.3 Cache Pool Management and Quality Maintenance__

A healthy question pool requires ongoing management\. Three automated processes maintain pool health:

- __Pool monitor \(Vercel Cron, nightly\):__ Checks validated question count per topic per difficulty level\. If any bucket falls below the minimum threshold \(30 validated questions\), triggers a batch generation job to top it up\. The minimum threshold ensures no student ever exhausts the pool within their 30\-day exclusion window\.
- __Quality decay detector:__ Tracks appeal outcomes per question\. If a question accumulates >3 student appeals, it is flagged for re\-validation and potentially removed from the pool\. Questions that consistently mislead students are more expensive to keep \(remediation cost\) than to replace\.
- __Seasonal refresh:__ The question pool is refreshed after each year's GCE examination results are released\. New question styles or topic weightings observed in the actual paper are incorporated into generation prompts for the following year's cohort\.

# __4\. Open\-Source AI Strategy — The Path to Near\-Zero Inference Cost__

*Open\-source models have crossed the quality threshold required for ExamEdge's high\-frequency tasks\. Deploying them on modest infrastructure eliminates per\-token costs entirely for those tasks\. This is not a future aspiration — it is a Year 2 target with a specific technical plan\.*

## __4\.1 Open\-Source Model Landscape Assessment__

The following models are evaluated for ExamEdge's specific tasks\. Evaluation criteria: instruction following quality, structured JSON output reliability, mathematical reasoning accuracy, and deployment cost\.

__Model__

__Parameters__

__Deploy Cost__

__Quality Profile__

__ExamEdge Use__

__Assessment__

__Mistral 7B Instruct v0\.3__

7B

~$20/mo \(Railway T4 GPU\)

JSON output: good\. Math: moderate\.

GCE marking \(post\-fine\-tune\)

Best open\-source instruction follower at 7B\. Strong JSON compliance\. Inadequate for math marking without fine\-tuning\.

__LLaMA 3\.1 8B Instruct__

8B

~$20/mo \(Railway T4 GPU\)

JSON output: excellent\. Math: good\.

GCE marking, hint generation

Meta's 8B model shows strong structured output\. Better math baseline than Mistral 7B\. Primary fine\-tuning candidate\.

__Qwen2\.5 7B Instruct__

7B

~$20/mo \(Railway T4 GPU\)

JSON: excellent\. Math: very good\.

Mathematics marking

Alibaba model with notably strong mathematical reasoning\. Leading open\-source candidate for GCE maths marking\.

__Phi\-3 Mini 3\.8B__

3\.8B

~$15/mo \(Railway T4 GPU\)

JSON: good\. Math: moderate\.

Fast hint responses

Microsoft's small model, impressive at 3\.8B\. Suitable for low\-latency hint generation where depth is less critical\.

__Whisper\.cpp \(base model\)__

74M

$0 \(on\-device\)

Speech: excellent for English/French\.

Oral assessment ASR

Already in ExamEdge stack\. Runs on\-device, zero cost, offline\.

__TrOCR / Google ML Kit__

—

$0 \(on\-device\)

OCR: good for printed math\.

Handwriting OCR

On\-device OCR\. ML Kit free, no internet\. TrOCR for complex mathematical handwriting\.

## __4\.2 Domain\-Specific Fine\-Tuning Plan__

Fine\-tuning a 7B or 8B model on ExamEdge's GCE marking data is the highest\-leverage engineering investment in Year 2\. A fine\-tuned Qwen2\.5 or LLaMA 3\.1 model on a dedicated $20/month GPU instance replaces 80% of all Claude Haiku marking calls, reducing marking cost from $0\.0003 per operation to effectively $0 \(fixed monthly infrastructure cost, regardless of volume\)\.

### __4\.2\.1 Training data requirements__

Fine\-tuning a 7\-8B instruction model for GCE marking requires approximately 10,000–50,000 high\-quality marking examples\. Each example is a triple: \(question\_text \+ mark\_scheme\_json, student\_answer, correct\_marking\_result\_json\)\. ExamEdge will accumulate this data from:

- All answered student responses with confirmed marking results \(human\-validated or high\-confidence AI marks that passed appeal review\)
- Manually curated marking examples from GCE past paper mark schemes \(400\-600 examples per subject per level — collected during pre\-development\)
- Augmented examples: for each real question, generate 5\-10 synthetic student answers at varying quality levels using the current production model

Estimated timeline to training threshold: 10,000 examples requires approximately 1,250 students completing 8 questions each\. At 2,000 students by Month 12, the threshold is reached\. Fine\-tuning run: approximately 4\-8 hours on a T4 GPU instance\. Estimated fine\-tuning cost: $5\-15 \(one\-time compute cost for the training run\)\.

### __4\.2\.2 Fine\-tuning infrastructure__

\# Fine\-tuning pipeline \(Year 2\)

\# Platform: Modal\.com \(pay\-per\-second GPU\), or Vast\.ai, or Google Colab Pro

\# Step 1: Export training data from production database

SELECT q\.template\_text, sr\.applied\_params, sr\.answer\_text,

       sr\.marks\_awarded, q\.mark\_scheme

FROM student\_responses sr

JOIN questions q ON q\.id = sr\.question\_id

WHERE sr\.ai\_confidence > 0\.85

  AND sr\.manual\_review = FALSE  \-\- only high\-confidence, unquestioned marks

  AND sr\.submitted\_at > NOW\(\) \- INTERVAL '12 months'

LIMIT 50000;

\# Step 2: Format as instruction\-following JSONL

\# \{ 'instruction': system\_prompt, 'input': question\+scheme\+answer, 'output': marking\_json \}

\# Step 3: Fine\-tune using LoRA \(Low\-Rank Adaptation\)

\# LoRA fine\-tunes only ~1% of model parameters — reduces training time/cost 10x

\# vs full fine\-tuning while achieving 90%\+ of full fine\-tune quality

\# Step 4: Evaluate on holdout set of 500 human\-validated marking examples

\# Accept if: accuracy >= 92%, confidence calibration within 5%, zero mark\_type errors

\# Step 5: Deploy on Railway $20/mo T4 GPU instance

\# Serve via OpenAI\-compatible API endpoint

\# Register in localModelRegistry — model router automatically routes eligible tasks

## __4\.3 On\-Device AI \(Tier 0\) — The True Zero\-Cost Floor__

On\-device AI eliminates API costs entirely for tasks it can handle\. ExamEdge's Tier 0 strategy targets two high\-frequency operations:

- __Whisper\.cpp \(oral explanation ASR\):__ The quantized 'base' model \(~150MB\) runs on Android 7\+ devices with 1GHz\+ ARM processors\. Transcription of a 60\-second oral explanation takes 15\-30 seconds on a mid\-range device\. Zero server cost\. Zero latency waiting for API\. Privacy\-preserving \(audio never leaves the device\)\. Already the specified implementation for V1\.2\.
- __On\-device basic marking \(Year 3\+\):__ Qualcomm's Snapdragon NPU and MediaTek's APU in devices shipping in 2025\+ can run 3\-4B parameter models at 20\+ tokens/second\. Phi\-3 Mini \(3\.8B\) fine\-tuned on GCE marking data running on a 2025 mid\-range Android would handle simple M1/A1 marking entirely offline\. This is a Year 3 target, contingent on device penetration of capable hardware in Cameroon\.

## __4\.4 Embedding Cost Optimisation__

Vector embeddings for the RAG pipeline \(question similarity search\) are generated by Voyage AI's text\-embedding\-3 model\. Voyage AI's free tier provides 200 million tokens per month — sufficient for approximately 130,000 question embedding operations\. The key optimisation: embeddings are generated once per question and stored permanently in the pgvector column\. A 50,000\-question database requires 50,000 embedding calls, after which no further embedding generation is needed unless questions are updated\. At 1,536 dimensions per embedding, 50,000 embeddings consume approximately 300MB of database storage — well within the Neon free tier\.

Alternative: at scale, replace Voyage AI with a self\-hosted sentence\-transformer model \(all\-MiniLM\-L6\-v2, 384 dimensions, 22MB model size\)\. Embedding generation at approximately 500 sentences/second on CPU — fast enough for batch processing of question bank updates\.

# __5\. Infrastructure Cost Optimisation__

## __5\.1 The Free\-Tier First Principle__

ExamEdge's infrastructure is designed to operate at zero or near\-zero cost during development and early operation\. The following table documents the free\-tier provisions of each service and the precise trigger point at which paid tiers become necessary:

__Service__

__Free Tier Provisions__

__Free Tier Limits__

__Upgrade Trigger__

__Upgrade Cost__

__Vercel__

Unlimited personal projects, 100GB bandwidth/mo, 100 serverless function invocations/day \(Hobby\)

Soft limit on Hobby: function timeout 10s \(sufficient for all MVP operations\)

When: >100GB/mo bandwidth OR need longer function timeouts

Vercel Pro: $20/mo — first upgrade needed

__Neon PostgreSQL__

0\.5 vCPU, 1GB RAM, 3GB storage, 191 compute hours/mo

191 compute hours ≈ 6\.4 hrs/day continuous — adequate for up to ~500 concurrent users

When: >3GB storage OR >500 concurrent users

Neon Pro: $19/mo — add when student data exceeds 3GB \(~Year 1 Month 6\)

__Upstash Redis__

10,000 requests/day, 256MB storage

10k req/day = 417 req/hr = ~7 per minute — adequate up to ~200 concurrent users

When: >10k req/day \(>~200 concurrent users at peak\)

Upstash Pay\-as\-you\-go: ~$0\.20 per 100k requests above free

__Cloudflare R2__

10GB storage, ZERO egress fees — unlimited downloads

10GB = ~10,000 audio recordings at 1MB each; sufficient for 6\+ months of growth

When: >10GB storage \(audio files \+ PDFs\)

R2: $0\.015/GB/mo above free — scales cheaply due to zero egress

__Voyage AI__

200M tokens/month free

200M tokens = ~130k embedding operations — adequate for question pool management indefinitely at MVP scale

Unlikely to exceed free tier at MVP scale

Voyage AI paid: $0\.10/M tokens — very cheap even at scale

__Resend__

3,000 emails/month free

3k emails = 100 students receiving 30 weekly reports — adequate to ~100 active students

When: >100 students receiving weekly emails

Resend Pro: $20/mo — 50k emails

__Africa's Talking__

Free sandbox for development; production requires account

Sandbox sufficient for all development and testing phases

When: go live with USSD/SMS for students

Pay\-per\-use: ~XAF 9/SMS; USSD billed per session \(~XAF 5\)

__GitHub Actions__

2,000 minutes/month free

2k min = ~400 CI runs at 5 min/run — more than sufficient for solo developer

When: team grows and CI runs multiply

GitHub Team: $4/user/mo

__Sentry__

5,000 errors/month, 10k performance events free

Sufficient for MVP and early growth phases

When: approaching 5k errors/mo \(indicates scale or quality issues\)

Sentry Team: $26/mo

## __5\.2 Infrastructure Cost Projection — Optimised Architecture__

The following projection reflects the optimised architecture: question caching, model tiering, and progressive open\-source model adoption:

__Metric__

__100__

__500__

__2k__

__10k__

__50k__

__100k__

Active students \(monthly\)

100

500

2,000

10,000

50,000

100,000

Vercel hosting

$0

$0

$20

$20

$40

$80

Neon PostgreSQL

$0

$0

$19

$19

$50

$100

Upstash Redis

$0

$0

$0

$8

$20

$40

Cloudflare R2 \(storage \+ zero egress\)

$0

$0

$5

$20

$80

$150

Anthropic Claude API \(tiered, cached\)

$8

$25

$70

$180

$300

$400

Open\-source model hosting \(Railway, Year 2\+\)

$0

$0

$20

$20

$20

$20

Voyage AI embeddings

$0

$0

$0

$0

$5

$10

Resend email

$0

$0

$0

$20

$20

$20

Africa's Talking \(USSD/SMS\)

$0

$5

$15

$40

$100

$180

Monitoring, domain, misc

$5

$5

$5

$10

$15

$20

__TOTAL MONTHLY INFRASTRUCTURE__

__$13__

__$35__

__$154__

__$337__

__$650__

__$1,020__

__Cost per active student/month__

__$0\.13__

__$0\.07__

__$0\.08__

__$0\.034__

__$0\.013__

__$0\.010__

__Subscription revenue \(XAF 2500 = ~$4\.10\)__

__$410__

__$2,050__

__$8,200__

__$41,000__

__$205,000__

__$410,000__

Infrastructure as % of revenue

3\.2%

1\.7%

1\.9%

0\.8%

0\.3%

0\.2%

*At 100,000 students — a continental\-scale user base — infrastructure costs represent 0\.2% of subscription revenue\. The platform becomes progressively more profitable as it scales, not more expensive\. This is the correct economic structure for an educational infrastructure product\.*

## __5\.3 Key Infrastructure Optimisations__

- __Vercel Edge Runtime for middleware:__ All authentication checks and rate limiting run on Edge Runtime — zero cold start latency, runs in 12 data centres simultaneously, included in the base Vercel cost\. Moving authentication to Edge eliminates a significant source of latency for African users connecting to EU\-West data centres\.
- __Serverless database connection pooling:__ Neon's PgBouncer proxy \(free, built\-in\) pools database connections at the infrastructure layer\. Without pooling, each Vercel serverless function invocation opens a new database connection — PostgreSQL's default connection limit \(100\) is exhausted at approximately 80 concurrent users\. With pooling, 10,000 concurrent serverless requests share a managed pool of 20 persistent connections to PostgreSQL\.
- __Cloudflare CDN for static assets:__ Next\.js static assets \(JS bundles, CSS, fonts, KaTeX fonts\) are served from Vercel's edge network globally\. For African students, the nearest Vercel edge node is in Johannesburg or Frankfurt — adequate for static assets\. Adding Cloudflare in front of Vercel \(free tier: unlimited bandwidth, 300 cache rules\) routes African traffic to Cloudflare's Nairobi and Lagos PoPs — reducing static asset load time from ~800ms to ~120ms for West and East African students\.
- __Streaming AI responses:__ For longer AI operations \(curriculum explanations, report generation\), response streaming is enabled\. The student sees the explanation beginning to appear in ~500ms rather than waiting 4\-5 seconds for the complete response\. This does not reduce cost, but it improves perceived performance significantly on slow connections — students on EDGE or 3G mobile data experience a responsive platform rather than a loading spinner\.

# __6\. Sub\-Linear AI Scaling — Why Costs Grow Logarithmically, Not Linearly__

*The naive assumption is that doubling the number of students doubles AI costs\. ExamEdge's architecture ensures that this is not true\. AI costs grow sub\-linearly with users because the question pool, concept explanation cache, and fine\-tuned models represent fixed investments that serve an unlimited number of students\.*

## __6\.1 The Sub\-Linear Scaling Mechanisms__

__Mechanism__

__How It Works__

__Scaling Effect__

__Quantified Impact__

__Question pool amortisation__

Every new question generated is added to the pool permanently\. As the pool grows, cache hit rates increase and the rate of new question generation decreases\.

AI cost for question delivery grows as O\(log n\) with users — each additional cohort of students requires proportionally fewer new questions\.

At 500 students: pool hit rate ~85%\. At 50,000 students: hit rate ~98%\. Cost per question delivery falls 16x while students grow 100x\.

__Concept explanation cache__

Concept explanations are generated once per topic per language\. 200 topics × 2 languages = 400 explanations\. All students share the same cached explanations\.

Explanation delivery cost: $2\.40 total \(one\-time\)\. Zero marginal cost for every subsequent student regardless of scale\.

At 1M students: explanation delivery cost per student = $0\.0000024\. Effectively zero\.

__Fine\-tuned model migration__

As training data accumulates, high\-frequency marking tasks migrate from Claude Haiku \(per\-token cost\) to the self\-hosted fine\-tuned model \(fixed monthly cost\)\.

Marking cost transitions from variable \(scales with questions attempted\) to fixed \(scales with compute instance count, not with questions\)\.

At 50k students: Haiku marking cost would be ~$500/mo\. Fine\-tuned model: $20/mo fixed\. 25x reduction\.

__Population\-level prompt optimisation__

As question pool grows, average prompt length decreases — RAG context retrieved is more precisely relevant \(higher similarity scores\), reducing context window required per call\.

Token consumption per AI call decreases as pool quality improves\. Less context needed to ground generation accurately\.

10\-20% token reduction at scale through prompt efficiency alone\.

## __6\.2 The AI Cost Curve__

The following describes ExamEdge's AI cost curve across the growth trajectory, incorporating all optimisations:

__Students__

__Total AI Cost/mo__

__AI Cost/Student/mo__

__Key Optimisations Active__

__Cost/Student/day__

__Economic Context__

__100__

$8

__$8__

80% questions from pool; Haiku marking; no fine\-tune

$0\.080

Building phase — grant\-funded

__500__

$25

__$5__

85% pool hit rate; Haiku marking; concept cache complete

$0\.050

Pilot\-to\-commercial transition

__2,000__

$70

__$3\.5__

90% pool hit rate; Haiku marking; report batching

$0\.035

School subscription revenue covers costs

__10,000__

$180

__$1\.8__

95% pool hit rate; fine\-tuned model live \(Year 2\); Haiku for escalations only

$0\.018

Profitable at XAF 2,500/student/mo

__50,000__

$300

__$0\.6__

98% pool hit rate; fine\-tune covers 80% of marking; on\-device Whisper

$0\.006

Infrastructure is 0\.3% of revenue

__100,000__

$400

__$0\.4__

98%\+ pool hit rate; fine\-tune \+ Tier 2 only for complex tasks; Cloudflare CDN

$0\.004

Strongly profitable at scale

__500,000__

$800

__$0\.16__

Fine\-tune covers 90%\+ tasks; minimal Sonnet usage; on\-device Phi\-3 \(Year 3\)

$0\.0016

AI cost < $2 per student per year

# __7\. MVP Economics — The Evidence Base for Grants and Investment__

*The MVP is not a prototype\. It is a proof that the economics work\. Every design decision in the MVP is made to generate the specific evidence that funders, investors, and Ministries of Education need to commit to the platform at scale\.*

## __7\.1 What the MVP Must Prove__

The MVP's purpose is not maximum feature count\. It is maximum evidence generation at minimum cost\. The three questions the MVP must answer with data, not with claims:

1. __Does ExamEdge improve student examination readiness?__ The pilot measures pre/post accuracy scores on standardised topic tests across the 20 pilot students\. A statistically significant improvement \(target: 15\+ percentage points in weak topics over 4 weeks\) is the evidence that the platform works\.
2. __Is AI marking accurate enough to trust?__ The pilot compares AI marking results against teacher\-marked versions of the same student responses on 100 questions across 3 subjects\. Target: 92%\+ agreement on mark awarded, 98%\+ agreement on marking decision direction \(pass/fail threshold\)\. This number is published in the grant application\.
3. __Can the platform operate at sustainable cost?__ Month 1\-3 cost data \($13\-$35/month\) demonstrates that the infrastructure economics are sound\. The cost projection to 10,000 students showing sub\-$2/student/month AI cost is credible because it is derived from actual usage data, not theoretical models\.

## __7\.2 Grant Application Evidence Package__

The following table maps each MVP data point to the grant criterion it addresses:

__Evidence Data Point__

__What It Demonstrates__

__Grant Criterion__

__Why It Matters to Funders__

__Pre/post topic accuracy improvement \(pilot\)__

Measurable educational impact

__Social impact evidence__

Target: \+15 pp on weakest topics\. Exceeds GPE and Mastercard Foundation minimum evidence requirements\.

__AI marking accuracy vs teacher baseline__

Technical reliability and validity

__Technical excellence__

92%\+ agreement positions ExamEdge as peer to commercial EdTech platforms in high\-income markets\.

__School teacher NPS \(Net Promoter Score\)__

Teacher adoption and institutional trust

__Sustainability evidence__

NPS >7 demonstrates that teachers view ExamEdge as an asset, not a threat\. Required by most school\-partnership grant programmes\.

__Month 1\-3 infrastructure costs \($13\-$35/mo\)__

Financial discipline and efficiency

__Cost\-effectiveness__

Demonstrates that educational AI can be delivered responsibly without wasteful infrastructure spending\.

__Cost per student at 10,000 users \($0\.034/mo\)__

Scalability economics

__Scale potential__

Shows funders that $1M in grant funding can serve 2\.4M student\-months of quality AI tutoring — a transformative return\.

__Offline functionality demonstrated__

Equity and inclusion for rural students

__Inclusivity evidence__

Demo with airplane mode on\. Photos of rural students using the platform\. USSD companion interface for feature phones\.

__GCE Board letter of engagement__

Regulatory alignment and legitimacy

__Policy relevance__

Even a letter sent \(with anticipated response\) demonstrates proactive engagement with educational authorities\.

## __7\.3 The Funding Ladder__

ExamEdge's funding strategy is designed as a progressive ladder — each stage provides the evidence required to unlock the next:

1. __Stage 1 — Competition prize \($5,000–$50,000\):__ Funds curriculum specialist collaboration, AWS/Railway GPU for fine\-tuning experiments, legal registration, and first school partnership development\. Target: Presidential African Youth in AI & Robotics 2026\.
2. __Stage 2 — First grants \($50,000–$200,000\):__ GPE EdTech Accelerator, Mastercard Foundation Scholars, USAID DIV Stage 1\. Evidence required: pilot data from MVP\. Uses: 500\-student pilot expansion, V1\.1 mobile app, teacher dashboard, 3 school partnerships\.
3. __Stage 3 — Seed investment \($500,000–$1,000,000\):__ African EdTech investors \(Founders Factory Africa, Ventures Platform, Future Africa\)\. Evidence required: 2,000\+ students, 10\+ school contracts, measurable examination outcome improvement data, MoU with GCE Board\. Uses: V2\.0 French curriculum, WAEC expansion, fine\-tuned model, team hire\.
4. __Stage 4 — Series A \($3,000,000–$8,000,000\):__ International EdTech investors \(Owl Ventures, Reach Capital\)\. Evidence required: 15,000\+ students, 3\-country operation, first Ministry of Education endorsement\. Uses: continental expansion, African infrastructure sovereignty, government analytics platform\.

## __7\.4 Financial Discipline at Every Stage__

The most important thing to communicate to every funder at every stage is this: ExamEdge does not increase infrastructure spending to match available funding\. Each funding tranche is spent on expanding the user base, improving the curriculum coverage, and building the team — not on upgrading to more expensive AI services that could be replaced by better engineering\.

*When Series A funding arrives, ExamEdge does not switch from Claude Haiku to Claude claude\-sonnet\-4\-6 for all tasks\. It deploys the fine\-tuned model that makes Haiku unnecessary\. When revenue grows, it does not move from Neon to a $500/month managed database\. It optimises the existing schema and adds read replicas\. Financial discipline is not a constraint imposed by limited resources\. It is a design principle that makes the platform more defensible, more sustainable, and more impactful per dollar spent\.*

# __8\. Workload Management and Intelligent Batching__

## __8\.1 Real\-Time vs Deferred Workload Classification__

Not every AI operation needs to happen in real time\. Classifying workloads correctly and deferring non\-urgent operations to off\-peak batch processing reduces both API cost \(batch pricing is typically 50% lower than real\-time on most providers\) and peak infrastructure load:

__Task__

__Timing Class__

__Reason__

__Model__

__Cost Notes__

__Answer marking and feedback__

__Real\-time \(<3s\)__

Student is waiting for their mark\. Cannot defer\.

Haiku, cached mark scheme, Zod output

Most frequent\. Most optimised\.

__Hint generation \(Level 1\-2\)__

__Real\-time \(<2s\)__

Student is stuck and waiting for guidance\. Cannot defer\.

Haiku, low temperature

High frequency but cheap\.

__Hint generation \(Level 3\)__

__Real\-time \(<4s\)__

Critical learning moment\. Student needs deeper guidance\.

Sonnet, medium temperature

Low frequency\.

__UVE probe presentation__

__Near\-real\-time \(<5s\)__

Presented 1\-2 seconds after marking result — student transition time covers latency\.

Haiku for L1\-2, Sonnet for L3\-4

Parallel with marking response construction\.

__Concept explanation \(first access\)__

__Near\-real\-time \(<6s, streamed\)__

First time a student accesses a topic\. Streamed response improves perceived speed\.

Sonnet, cached permanently after

One\-time per topic — amortised cost zero\.

__Concept explanation \(repeat access\)__

__Instant \(cache hit\)__

Served from Redis or PostgreSQL\. Zero AI call\.

No AI

Near\-zero latency\.

__Student weekly progress report__

__Deferred \(nightly batch\)__

No student is waiting\. Generated Sunday 06:00 WAT via Vercel Cron\.

Haiku, batch queue \(50% off real\-time\)

Batch pricing applied\.

__Spaced repetition scheduling__

__Deferred \(nightly batch\)__

Algorithm only\. No AI call\. Runs as database stored procedure\.

No AI

Pure compute\.

__Question pool refresh \(below threshold\)__

__Deferred \(nightly batch\)__

No student is waiting\. Quality is maintained\.

Sonnet, batch, cached permanently

One\-time per question\.

__Cognitive fingerprint update__

__Deferred \(post\-session batch\)__

Updated after session ends\. No real\-time requirement\.

Clustering algorithm only — no AI

No API cost\.

__Exam simulation paper assembly__

__Near\-real\-time \(<2s\)__

Student is about to start exam\. Algorithmic — no AI call\.

Algorithm only

No API cost\.

__Post\-exam examiner report__

__Deferred \(30 seconds after submission\)__

Student needs 30s to compose themselves\. Background generation\.

Haiku, structured from exam data

Low token count; structured narrative\.

## __8\.2 Peak Load Management__

ExamEdge will experience predictable peak load periods: the weeks immediately before GCE examinations in June and November\. During these periods, student session frequency increases 3\-5x\. The system must handle this without proportional cost increases\.

- __Pre\-peak question pool preparation:__ Two weeks before examination season, the pool monitor automatically expands minimum thresholds from 30 to 60 validated questions per topic\. Generation happens gradually in nightly batches, spreading API cost over 14 days rather than incurring it at peak\.
- __Examination season rate limiting:__ During peak periods, the per\-user hourly rate limit on AI operations is maintained\. Students who attempt to game the system by running dozens of sessions simultaneously are limited to 60 AI operations per hour — sufficient for normal intensive study but preventing resource monopolisation\.
- __Cached response serving:__ During peak, the Redis cache TTL for frequently accessed questions is extended from 1 hour to 6 hours\. The most popular topics \(which are highly correlated with examination content\) remain warm in cache, reducing database load\.

# __9\. Long\-Term Sustainability Model__

## __9\.1 The Three Sustainability Pillars__

ExamEdge's long\-term sustainability rests on three interdependent pillars, each of which strengthens the others:

- __Pillar 1 — Technical sustainability:__ The platform's cost structure improves with scale\. Every additional student makes the platform more efficient \(higher cache hit rates\), more accurate \(larger training dataset for fine\-tuning\), and more competitive \(stronger evidence base for grant applications\)\. Technical sustainability means the platform does not need to extract more revenue per student as it grows\.
- __Pillar 2 — Commercial sustainability:__ ExamEdge reaches operational self\-sustainability at approximately 200 paying students and 10 school contracts — generating approximately XAF 1\.8M \($2,970\) monthly revenue against $184 monthly infrastructure cost\. This threshold is achievable by Month 6\. Commercial sustainability means the platform does not need continuous grant dependency to operate\.
- __Pillar 3 — Mission sustainability:__ The Sponsored Access Programme ensures that cost never becomes a barrier for the students who need the platform most\. As commercial revenue grows, the proportion of sponsored seats can expand\. Mission sustainability means the platform's equity commitment is not sacrificed to improve financial margins\.

## __9\.2 Revenue Diversification__

A single revenue stream is a fragility\. ExamEdge develops five revenue streams progressively, each providing resilience if another is disrupted:

__Revenue Stream__

__Pricing__

__Timeline__

__Predictability__

__Strategic Importance__

__Individual student subscriptions__

XAF 2,500\-4,500/student/mo

Active from Month 3

Medium

Largest revenue stream at scale; most predictable; directly tied to platform value

__School institutional contracts__

XAF 25,000\-60,000/school/mo

Active from Month 5\-6

High

Anchor revenue; provides institutional legitimacy; enables teacher dashboard investment

__NGO and development partner access bundles__

Bulk discounted rate

Active from Month 6\-9

Low

Unpredictable but high\-value; each deal funds 50\-500 students at once

__Diaspora sponsorship programme__

XAF 3,000/sponsor/student/mo

Active from Month 8

Medium

Recurring, loyal donors; community engagement flywheel

__Government licensing and analytics__

Negotiated per\-MoU

Active from Year 2\-3

Very high

Highest value; longest sales cycle; transformational for scale

## __9\.3 Financial Discipline Principles__

The following principles govern ExamEdge's financial decisions at every stage of growth:

1. Infrastructure cost must not exceed 5% of revenue at any scale tier\. If it does, this indicates a cost optimisation failure, not a need for more revenue\.
2. AI model upgrades are driven by quality requirements, not marketing\. The question before each model upgrade is always: 'Does the current model fail to meet the quality threshold for this task?' Not: 'Is there a newer, more impressive model available?'
3. Free tier maximisation: every infrastructure choice includes an explicit evaluation of whether the free tier is sufficient\. The default is to remain on free tier until a documented threshold is crossed\.
4. Revenue reinvestment priority: 40% curriculum and content \(question banks, subject expansion\), 30% product and engineering \(new features, quality improvements\), 20% growth \(marketing, partnerships\), 10% operational reserve \(buffer against unexpected costs\)\.
5. Open\-source first for non\-differentiating functions: authentication, email delivery, error tracking, analytics, and monitoring are all commodity functions\. ExamEdge uses the best free/open\-source tool for each, reserving spending for the AI infrastructure that is genuinely differentiated\.

# __10\. Implementation Roadmap with Cost Milestones__

__Phase__

__AI Cost__

__Key Activities__

__Target Outcome__

__Cost Breakdown__

__Weeks 1\-2
Pre\-build__

__$0 AI cost__

Collect past papers and mark schemes\. Build curriculum mapping spreadsheet\. Set up all accounts \(Anthropic, Neon, Upstash, R2, Vercel\)\. Configure GitHub repo and CI/CD\. Write first Zod schemas and Drizzle schema\.

Data foundation complete\. Development environment fully configured\. Zero infrastructure cost \(all free\-tier setup\)\.

All infrastructure on free tier\. $0 AI cost until Week 3 question generation begins\.

__Weeks 3\-5
Core AI pipeline__

__~$5 total__

Build question generation chain \(Sonnet\)\. Build marking chain \(Haiku\)\. Build Socratic guidance chain \(Sonnet\)\. Validate against 50 manual marking examples\. Build UVE L1\-L2 probes \(Haiku\)\.

Working AI pipeline for Pure Maths\. 200\+ validated questions in pool\. Marking accuracy >90% on test set\.

Question generation: ~50 Sonnet calls × $0\.003 = $0\.15\. Test marking: ~500 Haiku calls × $0\.0003 = $0\.15\. Total: ~$5\.

__Weeks 6\-7
Student interface__

__$0 new AI cost__

Build Next\.js student interface: lesson flow, practice mode, answer input, KaTeX/MathQuill\. Build exam simulation mode\. Build student dashboard\. All served from question pool \(zero new generation calls\)\.

Complete student\-facing MVP\. Demo\-ready\.

No new AI calls — serving from question pool built in Weeks 3\-5\.

__Weeks 8\-9
Pilot \+ teacher__

__~$10 total__

Recruit 20 GCE students in Yaounde\. Run 2\-week pilot\. Build basic teacher dashboard\. Add Physics and Biology question pools\.

20 pilot students, pre/post test data, marking accuracy data, teacher feedback\.

Pilot student usage: ~20 students × 8 questions/day × 14 days = 2,240 marking calls × $0\.0003 = $0\.67\. New subject questions: ~100 questions × $0\.003 = $0\.30\. Report generation: ~$1\.

__Week 10
Polish \+ pitch__

__$0 new AI cost__

Fix top bugs from pilot\. Build demo script\. Prepare pitch assets\. Record product video\.

Competition\-ready demo with pilot data\.

No new infrastructure costs\.

__Months 3\-6
V1\.1 beta__

__~$35\-80/mo__

Mobile app \(React Native\)\. Google OAuth\. Teacher dashboard\. 5 more subjects \(completing GCE Phase 1\)\. First 100\-200 paying students\. First 2 school contracts\.

200 paying students\. 2 school contracts\. Monthly revenue ~XAF 820k \($1,350\)\. First grant application submitted\.

Infrastructure upgrade: Neon Pro \($19/mo\)\. Claude API usage at 500 students: ~$25/mo\.

__Months 6\-12
V2\.0 scale__

__~$100\-200/mo__

French curriculum \(BEPC/Bac\)\. O\-Level subjects\. 2,000 students target\. Fine\-tuning dataset accumulation \(training data mining begins\)\. Open\-source model evaluation\.

2,000 students\. 10 school contracts\. Revenue ~XAF 7M \($11,500\)/mo\. First seed conversations\.

Open\-source model hosting added \($20/mo\)\. Anthropic usage optimised to ~$70/mo at 2k students\.

__Year 2
Fine\-tune \+ WAEC__

__~$200\-400/mo__

Fine\-tune LLaMA 3\.1 8B / Qwen2\.5 on 10,000\+ marking examples\. WAEC integration\. 10,000\-15,000 students\. Series A preparation\.

Fine\-tuned model live\. Marking cost reduced 10\-15x\. First WAEC students\. Seed round closed\.

Fine\-tuned model replaces Haiku for 80% of marking\. Railway GPU: $20/mo fixed vs $180/mo Haiku at 10k students\.

## __10\.1 Cost Summary: Entire Pre\-Revenue Phase__

*From first commit to first paying student: estimated total AI and infrastructure cost of $30\-50\. This is the cost of proving that ExamEdge works\. It is less than one month of private GCE tutoring for a single student in Yaounde\.*

# __11\. Closing Statement — Cost Discipline as Mission Alignment__

Every cost optimisation in this document serves the mission directly\. When question caching reduces AI costs by 95%, it does not just improve margins — it makes it possible to sponsor 20 additional students at no extra cost to the platform\. When the fine\-tuned model replaces Claude Haiku for mathematics marking, the $160 per month saved funds a month of curriculum specialist consultation\. When Cloudflare's edge network reduces static asset load time for a student in Bamenda from 800ms to 120ms, the saved latency is not measured in milliseconds — it is measured in the quality of the learning session that follows\.

The architecture described in this document is not built to impress investors with AI spending\. It is built to deliver maximum educational impact per XAF spent — because the students ExamEdge serves do not have the luxury of subsidising expensive engineering choices\. The platform's financial discipline is not separate from its mission\. It is an expression of it\.

*The goal is not to build the most sophisticated AI educational platform\. It is to build the most effective one — and to make that effectiveness available to every student in Cameroon and across Africa, regardless of what their family can afford\.*

Document ends\. ExamEdge Cost Optimisation and AI Economics Engineering\. Volume VII\. June 2026\.

