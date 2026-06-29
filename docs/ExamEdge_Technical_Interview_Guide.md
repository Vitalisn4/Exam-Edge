> **Canonical positioning & roadmap:** [`context/project-overview.md`](context/project-overview.md) · [`context/roadmap.md`](context/roadmap.md)

__EXAMEDGE__

Technical Interview Preparation &

Architecture Defence Guide

*Every design decision justified\. Every question answered\. Every trade\-off owned\.*

Prepared for: Competition Judges  |  Grant Reviewers  |  Technical Interviewers

__Prepared by: Ngam Vitalis Yuh__

Software Engineer  |  Yaounde, Cameroon  |  github\.com/Vitalisn4

June 2026

# __Section 1: Project Overview and System Understanding__

*These questions establish whether you genuinely own the system you claim to have built\. Every answer must be specific, honest, and technically precise\.*

## __1\.1 What Is ExamEdge and Why Does It Exist?__

ExamEdge is an AI\-powered Adaptive Examination Preparation and Intelligent Tutoring System for secondary school students **across Africa** — a curriculum\-agnostic platform beginning with GCE Ordinary and Advanced Level \(Cameroon, GCE Board Buea\) and expanding to support BEPC, Probatoire, and Baccalaureat \(Cameroon, Office du Bac\), WAEC and NECO \(Nigeria and Ghana\), KCSE \(Kenya\), and future national examination systems\.

The problem it solves is specific and measurable: over 40% of students who sit GCE A\-Level Mathematics in Cameroon fail\. Private tutoring costs 5,000 to 25,000 XAF per subject per month — unaffordable for the majority of families outside Yaounde and Douala\. No existing digital platform provides GCE Board Buea\-aligned question generation, examiner\-accurate marking, or adaptive Socratic guidance\. ExamEdge fills this gap\.

*The decision to build ExamEdge was not speculative\. It was grounded in a personal understanding of what it means to sit a Cameroonian national examination and have the rest of your life hinge on the result\.*

## __1\.2 Complete Architecture Walkthrough__

ExamEdge is a monorepo Next\.js 14 App Router application\. Here is what happens at every layer:

### __1\.2\.1 Frontend__

The frontend is React with Next\.js 14's App Router\. Server Components handle data\-fetching and rendering for study dashboards, question display, and progress analytics — all server\-side rendered to minimise the JavaScript bundle sent to the client\. Client Components handle interactive elements: answer input fields, countdown timers, confidence rating sliders, and real\-time hint triggers\. KaTeX renders mathematical notation client\-side with zero server requests after initial load\.

The reasoning for Next\.js 14 App Router over alternatives: React was chosen over Vue because of ecosystem breadth and the developer's existing proficiency\. Next\.js was chosen over a separate React SPA because it eliminates the need for a separate Express or Fastify server — API routes live in the same codebase, deployable to the same Vercel instance\. The App Router \(Server Components\) was chosen over the Pages Router because it enables partial rendering, streaming, and co\-located data fetching that significantly reduces time\-to\-interactive on low\-bandwidth connections in Cameroon\.

__Q: Why Next\.js and not a separate React frontend with a Node\.js backend?__

A: Colocation\. A separate frontend and backend means two deployment pipelines, two sets of environment variables, CORS configuration overhead, and two billing accounts\. For a solo developer building an MVP, this is unnecessary complexity\. Next\.js API routes give me a full\-featured backend in the same project\. The trade\-off is that at very high scale \(millions of concurrent users\), I would want to separate the AI inference service — but that is a Year 2 problem, not a Year 1 problem\.

### __1\.2\.2 Backend and API__

The backend is Next\.js Route Handlers \(the App Router equivalent of API routes\)\. All database access, AI API calls, and business logic runs server\-side\. The client never has direct access to the database or AI credentials\. Every AI call is proxied through a server\-side route handler where input is sanitised, rate\-limited, and validated before reaching the LLM API\.

The API follows RESTful conventions for resource\-oriented endpoints and uses server actions for form mutations that do not require a separate HTTP client call\. This reduces client\-side state management complexity significantly\.

__Q: Why REST and not GraphQL?__

A: ExamEdge has a well\-defined, relatively stable data schema\. The primary client is a web and mobile app controlled by the same development team\. GraphQL's primary advantage — allowing clients to specify exactly which fields they need, reducing over\-fetching — is most valuable when you have multiple external consumers with diverse data requirements\. ExamEdge has one primary consumer: its own frontend\. The cost of GraphQL schema management, resolver architecture, and tooling is not justified by the gain\. REST with carefully designed endpoints gives predictable, cacheable responses with significantly less operational overhead\.

### __1\.2\.3 What happens when a user submits an answer__

1. Student types or speaks their answer into the answer input field \(Client Component\)\.
2. Client\-side validation: KaTeX parses any mathematical notation for rendering accuracy\. Field length and character validation run in the browser\.
3. On submit, a POST request is sent to /api/sessions/\[sessionId\]/responses with the answer payload\.
4. The Route Handler authenticates the request via Auth\.js session cookie\. If the session is invalid, 401 is returned immediately\.
5. Authorisation check: Drizzle ORM queries the sessions table to confirm the session belongs to the authenticated user\. If not, 403 is returned\.
6. The mark scheme JSON for the specific question is retrieved from PostgreSQL \(cached in Redis if recently accessed\)\.
7. The answer and mark scheme are sent to the Examiner Marking Chain \(LangChain\.js \+ Claude Haiku API\)\. Temperature is set to 0\.1 for maximum determinism\. The chain returns a structured JSON object: \{ marks\_awarded: \[\.\.\.\], feedback: \[\.\.\.\], total: N \}\.
8. The response is validated with a Zod schema before being written to the database\. If the LLM returns a non\-conforming response, the request is flagged for manual review and a neutral response is returned to the user\.
9. The mastery record for the relevant topic is updated in PostgreSQL using a transaction\.
10. The UVE Probe Chain is triggered asynchronously \(does not block the marking response\)\. A probe question is generated and stored, ready to be presented to the student as the next interaction\.
11. The marking result and feedback are returned to the client\. React updates the UI to display marks awarded per step, feedback text, and the next probe question\.

*Every step in this pipeline has a failure mode that has been considered and handled\. The system degrades gracefully: if the AI marking chain fails, the student receives a 'manual review queued' response rather than an error\. If the database write fails, the response is queued in Redis for retry\.*

# __Section 2: Technology Stack Selection — Every Decision Justified__

*Interviewers are not interested in what you chose\. They are interested in why you chose it, what you considered instead, and what you would change\.*

__Technology__

__Alternatives Considered__

__Why This Was Chosen__

__When I Would Reconsider__

__Next\.js 14 App Router__

React SPA \+ Express, Remix, SvelteKit

Server Components reduce JS bundle on slow connections\. API routes eliminate separate server\. Vercel deployment is zero\-config\. App Router's streaming improves perceived performance\.

At very high scale, I would extract the AI inference service to a dedicated FastAPI Python service\. Next\.js is not optimal for CPU\-bound AI tasks\.

__Drizzle ORM__

Prisma, TypeORM, Sequelize, raw SQL

Type\-safe queries without the runtime overhead of Prisma's query engine \(which adds ~20MB to the bundle\)\. Drizzle compiles queries at build time\. Migrations are plain SQL files — readable, version\-controlled, debuggable without ORM knowledge\.

Prisma has better ecosystem documentation and a GUI \(Prisma Studio\)\. If onboarding a team of developers unfamiliar with raw SQL, Prisma's developer experience advantage would outweigh Drizzle's performance advantage\.

__Neon PostgreSQL__

Supabase, PlanetScale, Railway PostgreSQL, self\-hosted

Serverless driver uses HTTP\-based pooling — handles thousands of concurrent connections without exhausting PostgreSQL's connection limit\. pgvector extension built\-in\. Generous free tier \(3GB, 191 compute hours\)\. Branching feature enables staging environments\.

Supabase bundles auth, storage, and real\-time subscriptions\. If ExamEdge needed real\-time collaborative features \(e\.g\. live classroom mode\), Supabase's real\-time layer would be more appropriate\.

__Auth\.js v5__

Clerk, Supabase Auth, Firebase Auth, custom JWT

Zero vendor lock\-in\. Open source\. Runs inside the Next\.js application — no external service dependency for authentication\. Supports email/password, Google OAuth, and magic links out of the box\. Session strategy uses JWT with HTTP\-only cookies\.

Clerk provides a complete auth UI component library and a superior developer experience\. For a team product or one requiring advanced MFA, Clerk's cost \($25/mo at scale\) would be justified\. For a solo\-built MVP, Auth\.js avoids that cost entirely\.

__Upstash Redis__

Redis Cloud, ElastiCache, Vercel KV

Serverless\-native\. HTTP\-based client works on Vercel Edge Functions\. Free tier \(10k req/day\) is sufficient for MVP rate limiting, session caching, and question queue management\. Pay\-as\-you\-go scaling\.

For a high\-throughput production system handling millions of questions per day, a dedicated Redis cluster \(Redis Cloud or AWS ElastiCache\) would provide lower latency and higher throughput\. Upstash's HTTP overhead becomes measurable above ~1,000 req/second\.

__Cloudflare R2__

AWS S3, Vercel Blob, Supabase Storage

Zero egress fees\. This is the critical differentiator for a platform serving students across Africa where bandwidth costs are high\. S3 charges $0\.09/GB egress; R2 charges $0\. For audio files \(oral explanation recordings\), PDF past papers, and export reports, egress costs would be significant on S3\.

S3 has a far larger ecosystem of tooling, Lambda triggers, and third\-party integrations\. If ExamEdge needed advanced event\-driven processing of uploaded files \(e\.g\. transcription pipelines triggered on upload\), S3 \+ Lambda would be more appropriate\.

__Claude claude\-sonnet\-4\-6 / Haiku__

GPT\-4o, Gemini 1\.5, Llama 3, Mistral

Claude's instruction\-following fidelity on structured output tasks \(JSON schema compliance, rubric\-based marking\) is measurably better than GPT\-4o in ExamEdge's specific use cases\. Claude's context window \(200k tokens\) allows full marking history in a single call\. Haiku provides GPT\-3\.5\-level capability at $0\.25/M tokens\.

GPT\-4o has superior mathematical reasoning in some benchmarks\. For a production mathematics marking system, an A/B test between Claude claude\-sonnet\-4\-6 and GPT\-4o on a sample of GCE A\-Level questions would be the right decision\-making approach\. The current choice is based on structured output reliability, not mathematical reasoning supremacy\.

__LangChain\.js__

Direct API calls, LlamaIndex, custom orchestration

LangChain provides tested, maintainable abstractions for: RAG pipelines \(document loading, chunking, embedding, retrieval\), chain composition \(marking → UVE probe → guidance in sequence\), and prompt template management\. Avoids reinventing these patterns\.

LangChain adds abstraction overhead\. For simple, single\-step AI calls, direct fetch to the Anthropic API is faster to write and debug\. ExamEdge uses LangChain only for multi\-step chains; single\-step calls use the Anthropic SDK directly\.

__Vercel__

Railway, Render, Fly\.io, AWS, self\-hosted

Zero\-configuration deployment for Next\.js \(Vercel built Next\.js\)\. Global edge network\. Automatic HTTPS\. Preview deployments for every branch\. Free tier covers all MVP requirements\. Vercel Analytics built\-in\.

Vercel's pricing scales steeply above the free tier\. At high traffic volumes, migrating to Railway or AWS would significantly reduce hosting costs\. The migration path is straightforward because the application is containerisable\.

__pgvector__

Pinecone, Weaviate, Qdrant, Chroma

Keeps the vector store inside the existing PostgreSQL database, eliminating a separate service, separate billing account, and additional network hop\. For ExamEdge's question bank \(estimated 10,000–50,000 vectors at scale\), pgvector's performance is more than adequate\. Pinecone's managed service would add $70\+/month for equivalent storage\.

Pinecone provides superior ANN \(Approximate Nearest Neighbor\) performance at billions of vectors\. At continental scale \(millions of questions\), migrating to a dedicated vector database would be justified\. pgvector is the right tool for the 0\-to\-100k vector range\.

# __Section 3: Database Design and Data Modelling__

*Database design questions are where interviewers separate engineers who have 'used a database' from engineers who understand relational theory, normalisation, indexing, transactions, and the cost of design decisions at scale\.*

## __3\.1 Why PostgreSQL and Not a NoSQL Database?__

ExamEdge's data has strong relational structure\. A student belongs to sessions\. Sessions contain responses\. Responses reference questions\. Questions have mark scheme steps\. These relationships have referential integrity requirements — if a question is deleted, all responses to it must be handled consistently \(cascaded or restricted\)\. PostgreSQL enforces this at the database level\.

__Q: Why PostgreSQL and not MongoDB?__

A: ExamEdge's core data is highly relational and requires ACID transactions\. When a student submits an answer, I need to atomically: \(1\) write the response, \(2\) update the mastery record, and \(3\) update the session totals\. If step 2 fails, step 1 must roll back\. MongoDB's multi\-document transactions are available but add complexity and are slower than PostgreSQL's native transaction support\. Additionally, pgvector gives me vector similarity search inside the same database — if I used MongoDB, I would need a separate vector store\. Keeping everything in one PostgreSQL instance reduces operational complexity significantly\.

__Q: When would you choose MongoDB over PostgreSQL?__

A: If ExamEdge needed to store highly variable, semi\-structured data — for example, student\-generated notes that could contain any combination of text, images, links, and tags — MongoDB's document model would be more natural\. Also, if the team was prototyping rapidly and the schema was expected to change frequently, MongoDB's schema\-less flexibility would reduce migration overhead\. For ExamEdge's stable, well\-defined schema, PostgreSQL is the better choice\.

## __3\.2 Complete Schema with Justifications__

### __3\.2\.1 users table__

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\)

email VARCHAR\(255\) UNIQUE NOT NULL

name VARCHAR\(255\) NOT NULL

role TEXT CHECK \(role IN \('student','teacher','admin'\)\) NOT NULL DEFAULT 'student'

password\_hash TEXT \-\- NULL if OAuth\-only

email\_verified\_at TIMESTAMPTZ

cognitive\_fingerprint JSONB

created\_at TIMESTAMPTZ DEFAULT NOW\(\)

updated\_at TIMESTAMPTZ DEFAULT NOW\(\)

- __Why UUID and not SERIAL integer?__ UUIDs prevent enumeration attacks — a malicious actor cannot guess sequential user IDs and iterate through /api/users/1, /api/users/2\. They also enable distributed ID generation without a centralised sequence, important if ExamEdge ever shards across multiple database instances\.
- __Why email UNIQUE NOT NULL?__ Email is the natural unique identifier for a user\. Making it the unique constraint \(rather than a separate username\) reduces the authentication surface — there is only one way to identify yourself, not two\.
- __Why role as CHECK constraint?__ The role field is constrained to three valid values at the database level\. Application\-level validation alone is insufficient — a bug in the application could write an invalid role\. Database constraints are the last line of defence\.
- __Why cognitive\_fingerprint as JSONB?__ The cognitive fingerprint is a variable\-structure JSON object that evolves as new AI models add new dimensions\. Storing it as JSONB allows schema evolution without database migrations\. The trade\-off is that individual fingerprint fields cannot be indexed or constrained at the database level — acceptable because fingerprint data is written and read as a whole, not queried field\-by\-field\.

### __3\.2\.2 questions table__

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\)

topic\_id UUID REFERENCES topics\(id\) ON DELETE RESTRICT

template\_text TEXT NOT NULL

parameter\_schema JSONB NOT NULL

mark\_scheme\_template JSONB NOT NULL

probe\_library JSONB

difficulty SMALLINT CHECK \(difficulty BETWEEN 1 AND 5\) NOT NULL

marks\_total SMALLINT NOT NULL

embedding vector\(1536\)

validated BOOLEAN DEFAULT FALSE

created\_by TEXT CHECK \(created\_by IN \('ai\_generated','human\_authored'\)\) DEFAULT 'ai\_generated'

validated\_by UUID REFERENCES users\(id\)

created\_at TIMESTAMPTZ DEFAULT NOW\(\)

- __Why ON DELETE RESTRICT for topic\_id?__ If a topic is deleted from the curriculum, its questions must not be silently orphaned\. RESTRICT prevents topic deletion if questions reference it, forcing an explicit decision: either delete the questions first, or reassign them\. This is safer than CASCADE \(which would silently delete all questions for a topic\) or SET NULL \(which would leave questions without a curriculum context\)\.
- __Why template\_text rather than question\_text?__ Questions are parameterised templates\. template\_text contains placeholders \(e\.g\. '\{a\}x² \+ \{b\}x \+ \{c\}'\)\. At question render time, the parameter\_schema provides the allowed value ranges and the actual values are substituted\. This design means one database row can generate thousands of distinct question instances\.
- __Why validated BOOLEAN?__ AI\-generated questions must be reviewed before they reach students\. The validated flag ensures that unreviewed questions are never returned by the question selection query\. The query always includes WHERE validated = TRUE in the question pool\.

### __3\.2\.3 student\_responses table \(critical for understanding\)__

id UUID PRIMARY KEY DEFAULT gen\_random\_uuid\(\)

session\_id UUID REFERENCES student\_sessions\(id\) ON DELETE CASCADE

question\_id UUID REFERENCES questions\(id\) ON DELETE RESTRICT

rendered\_question\_text TEXT NOT NULL

applied\_parameters JSONB NOT NULL

answer\_text TEXT

marks\_awarded JSONB

ai\_feedback JSONB

hints\_used SMALLINT DEFAULT 0

uve\_probes JSONB

mvs\_score NUMERIC\(4,3\)

time\_taken\_seconds INTEGER

submitted\_at TIMESTAMPTZ DEFAULT NOW\(\)

- __Why store rendered\_question\_text and applied\_parameters?__ The question template can be updated or deleted over time, but a student's historical response must always be reproducible — for audit, for teacher review, for the student's own revision history\. Storing the rendered text and the parameter values that generated it creates an immutable record of exactly what the student was asked\.
- __Why marks\_awarded as JSONB?__ Marks are awarded per step \(M1/A1/B1\)\. The structure varies by question\. A 3\-mark question has 3 step entries; a 6\-mark question has 6\. JSONB accommodates this variable structure\. A relational marks\_steps table would require a JOIN on every response fetch — JSONB keeps the entire marking result in one row fetch\.

## __3\.3 Indexing Strategy__

__Q: What indexes have you created and why?__

A: Every index is a trade\-off: faster reads at the cost of slower writes and additional storage\. I index only on columns used in WHERE clauses of high\-frequency queries\.

\-\- Student session lookup \(most frequent query in the application\)

CREATE INDEX idx\_sessions\_student\_id ON student\_sessions\(student\_id\);

\-\- Mastery record lookup per student per topic

CREATE INDEX idx\_mastery\_student\_topic ON mastery\_records\(student\_id, topic\_id\);

\-\- Question pool query: find validated questions for a topic at a difficulty level

CREATE INDEX idx\_questions\_topic\_difficulty ON questions\(topic\_id, difficulty\) WHERE validated = TRUE;

\-\- Response history for a session

CREATE INDEX idx\_responses\_session ON student\_responses\(session\_id\);

\-\- Vector similarity search \(pgvector\)

CREATE INDEX idx\_questions\_embedding ON questions USING ivfflat \(embedding vector\_cosine\_ops\);

__Q: Why a partial index on questions \(WHERE validated = TRUE\)?__

A: The question pool query always filters by validated = TRUE\. A partial index on this subset is smaller than a full index and faster to scan because it excludes the potentially large set of unvalidated AI\-generated questions awaiting review\.

__Q: What is the most expensive query in ExamEdge?__

A: The vector similarity search for question selection\. A pgvector cosine similarity scan over 50,000 embeddings is O\(n\) without an index\. The ivfflat index reduces this to approximate O\(log n\) by partitioning the vector space into clusters\. The trade\-off is a small accuracy loss \(approximate nearest neighbour, not exact\) — acceptable because question selection does not require exact similarity, only good similarity\.

## __3\.4 Transactions and ACID Properties__

__Q: What are ACID properties and how does ExamEdge use them?__

A: ACID: Atomicity \(a transaction either fully completes or fully rolls back\), Consistency \(the database moves from one valid state to another\), Isolation \(concurrent transactions do not interfere\), Durability \(committed transactions survive crashes\)\. ExamEdge uses explicit transactions for any operation that writes to multiple tables\.

Example: submitting an answer writes to student\_responses AND updates mastery\_records AND updates student\_sessions\.questions\_attempted\. If any of these three writes fails, the entire operation rolls back:

await db\.transaction\(async \(tx\) => \{

  await tx\.insert\(studentResponses\)\.values\(responseData\);

  await tx\.update\(masteryRecords\)

    \.set\(\{ masteryLevel: newMastery, lastUpdated: now \}\)

    \.where\(eq\(masteryRecords\.studentId, userId\)\);

  await tx\.update\(studentSessions\)

    \.set\(\{ questionsAttempted: sql\`questions\_attempted \+ 1\` \}\)

    \.where\(eq\(studentSessions\.id, sessionId\)\);

\}\);

__Q: What is optimistic locking and does ExamEdge use it?__

A: Optimistic locking assumes conflicts are rare and checks for conflicts at commit time rather than acquiring locks upfront\. It is implemented with a version column: before updating a row, you check that its version matches what you read, and increment it on update\. If another transaction updated it first, the version will not match and you retry\. ExamEdge uses optimistic locking on mastery\_records, because two simultaneous sessions from the same student \(unlikely but possible on different devices\) could race to update the same mastery record\.

\-\- Optimistic lock on mastery update

UPDATE mastery\_records

SET mastery\_level = $1, version = version \+ 1, last\_updated = NOW\(\)

WHERE student\_id = $2 AND topic\_id = $3 AND version = $4

RETURNING id;

\-\- If 0 rows affected, another transaction won the race — retry with fresh data

# __Section 4: Authentication — Design, Security, and Trade\-offs__

*Authentication is where most security vulnerabilities originate\. Interviewers probe here deeply because weak authentication design has catastrophic consequences — especially for a platform storing academic data about minors\.*

## __4\.1 Why Auth\.js v5 and Not a Custom Implementation__

__Q: Why Auth\.js instead of building your own JWT authentication?__

A: Three reasons\. First, security: authentication is one of the domains where 'roll your own' is genuinely dangerous\. JWT signing, token rotation, session invalidation, CSRF protection, and secure cookie handling each have subtle implementation details where a single error creates critical vulnerabilities\. Auth\.js has been security\-audited and is maintained by a team with a security\-first mandate\. Second, time: implementing authentication correctly from scratch takes 2\-4 weeks for a senior engineer\. Auth\.js takes 2 hours to configure\. Third, provider support: Auth\.js handles Google OAuth, GitHub OAuth, magic links, and email/password in one library\. Building each of these myself would be a distraction from the core product\.

__Q: Why Auth\.js and not Clerk?__

A: Clerk is an excellent choice and would be my recommendation for a team product\. Its component library, MFA support, and organisation management are superior to Auth\.js\. However, Clerk costs $25/month at the MAU tier ExamEdge will reach in Year 1\. Auth\.js is free\. For a self\-funded MVP, the cost difference matters\. The migration path from Auth\.js to Clerk is straightforward when funding arrives\.

## __4\.2 How Passwords Are Stored__

__Q: How are passwords stored in ExamEdge?__

A: Passwords are never stored\. The password\_hash column stores the output of bcrypt with a work factor of 12\. bcrypt is a one\-way hash function — it is computationally infeasible to reverse the hash to obtain the original password\. The work factor of 12 means each hash computation takes approximately 250ms on modern hardware, making brute\-force attacks economically impractical\.

__Q: What is password salting and why does bcrypt use it?__

A: A salt is a random value added to the password before hashing\. Without salting, two users with the same password would produce the same hash, allowing an attacker who obtains the database to identify identical passwords across accounts and use pre\-computed rainbow tables\. bcrypt automatically generates a unique, cryptographically random salt for each password hash and embeds it in the hash output\. The stored hash contains the salt, the work factor, and the hash — everything needed to verify the password on login\.

// Auth\.js handles this internally, but the underlying logic is:

import bcrypt from 'bcryptjs';

const WORK\_FACTOR = 12;

// On registration

const hash = await bcrypt\.hash\(plainTextPassword, WORK\_FACTOR\);

// Store hash in users\.password\_hash

// On login

const isValid = await bcrypt\.compare\(plainTextPassword, storedHash\);

__Q: Why work factor 12 and not 10 or 16?__

A: Work factor 10 \(approximately 60ms\) is too fast — modern GPUs can attempt millions of bcrypt\-10 hashes per second in a brute\-force attack\. Work factor 16 \(approximately 4 seconds\) would make login noticeably slow for users on ExamEdge's intended low\-end Android devices\. Work factor 12 \(approximately 250ms\) balances security \(still expensive for attackers\) with user experience \(imperceptible to humans\)\. OWASP recommends a minimum of work factor 10; 12 exceeds that recommendation\.

## __4\.3 JWT Architecture__

__Q: How does JWT authentication work in ExamEdge?__

A: Auth\.js issues a signed JWT on successful login\. The JWT contains: the user's ID, role, and email verification status\. It is signed with a 256\-bit secret key using HS256\. The JWT is stored in an HTTP\-only, Secure, SameSite=Lax cookie — not in localStorage or sessionStorage\.

__Q: Why HTTP\-only cookie and not localStorage?__

A: localStorage is accessible to JavaScript running in the page\. If ExamEdge has any XSS vulnerability \(a user\-submitted content field that is not properly sanitised, for example\), an attacker's injected script could read localStorage and exfiltrate the token\. An HTTP\-only cookie cannot be accessed by JavaScript at all — only the browser sends it, automatically, with each request\. This eliminates the token theft vector for XSS attacks\.

__Q: What are refresh tokens and why are they important?__

A: An access token has a short lifetime \(15 minutes in ExamEdge\)\. After expiry, the user would have to log in again\. A refresh token has a long lifetime \(7 days\) and is used only to obtain new access tokens without re\-authentication\. The security benefit: if an access token is stolen, it is only valid for 15 minutes\. If a refresh token is stolen, it can be revoked server\-side by invalidating the token in the refresh\_tokens table\. Auth\.js handles this rotation automatically\.

__Q: How do you revoke a token?__

A: JWT access tokens are stateless — they cannot be individually revoked before expiry\. This is a known trade\-off\. Mitigation: short access token lifetime \(15 minutes\) limits the damage window\. For immediate revocation \(e\.g\. a reported account compromise\), I maintain a token blocklist in Upstash Redis\. On every authenticated request, the token's jti \(JWT ID\) is checked against the blocklist\. This adds one Redis lookup per request — a cost of approximately 1\-2ms, acceptable for security\-critical scenarios\.

__Q: What happens if a JWT token is stolen?__

A: If an access token is stolen: it expires in 15 minutes\. If a refresh token is stolen: the attacker can obtain new access tokens until the refresh token expires or is revoked\. ExamEdge detects suspicious refresh token usage through refresh token rotation — each use of a refresh token invalidates it and issues a new one\. If an old refresh token is presented \(indicating it was stolen and the legitimate user has already rotated it\), both the old and new refresh tokens are invalidated, forcing re\-authentication\.

## __4\.4 Password Reset Flow__

__Q: How do you handle forgotten passwords?__

A: On 'forgot password' submission: generate a cryptographically random 32\-byte token using crypto\.randomBytes\(\)\. Hash it with SHA\-256\. Store the hash \(not the token\) in a password\_reset\_tokens table with a 15\-minute expiry\. Send the unhashed token to the user's email via Resend\. When the reset link is clicked: hash the token from the URL and compare to the stored hash\. If valid and not expired, allow password update and immediately invalidate the token\. The token is never stored in plain text — if the database is compromised, the tokens are useless\.

# __Section 5: Authorisation and Access Control__

*Authentication answers 'who are you?' Authorisation answers 'what are you allowed to do?' These are separate systems with separate failure modes\. Confusing them is one of the most common security mistakes in web applications\.*

## __5\.1 Role\-Based Access Control \(RBAC\) Design__

ExamEdge has three roles: student, teacher, and admin\. Each role has a defined permission set:

__Action__

__Student__

__Teacher__

__Admin__

__View own study sessions__

__Yes__

__Yes \(own \+ assigned students\)__

__Yes \(all\)__

__Submit answers__

__Yes__

No

No

__View own mastery data__

__Yes__

No \(different route\)

__Yes \(all students\)__

__View class analytics__

No

__Yes \(own classes\)__

__Yes \(all classes\)__

__Validate AI\-generated questions__

No

__Yes \(own subjects\)__

__Yes \(all subjects\)__

__Create/edit curriculum topics__

No

No

__Yes__

__Manage user accounts__

No

No

__Yes__

__View system analytics__

No

No

__Yes__

## __5\.2 Implementation: Row\-Level Security__

__Q: How do you ensure students cannot access other students' data?__

A: Two layers\. First, application layer: every API route that returns student data includes a WHERE student\_id = authenticatedUserId clause in the database query — the authenticated user's ID comes from the verified JWT, not from the request body \(which could be manipulated\)\. Second, database layer: I use PostgreSQL Row\-Level Security \(RLS\) policies that enforce access control at the database level, independent of the application\.

\-\- RLS policy: students can only read their own mastery records

CREATE POLICY student\_mastery\_isolation ON mastery\_records

  FOR SELECT

  USING \(student\_id = current\_setting\('app\.current\_user\_id'\)::uuid\);

The current\_user\_id is set at the start of each database connection from the authenticated JWT\. If an application bug causes a query to omit the student\_id filter, the RLS policy prevents data leakage at the database level\. Defence in depth\.

__Q: How do you prevent privilege escalation?__

A: The role field in the users table can only be updated by an admin\. The role is read from the database on every request \(via the session refresh\) — it is not stored in the JWT long\-term\. A student cannot elevate their own role by modifying a cookie because the role in the JWT is verified against the database on sensitive operations\. Additionally, role changes are logged in an audit table with the actor's ID, timestamp, and previous/new role\.

__Q: How do you prevent a teacher from accessing students not in their classes?__

A: The teacher's class assignments are stored in a teacher\_student\_assignments table\. Any teacher query for student data includes a JOIN against this table\. A teacher can only retrieve mastery records, session histories, or analytics for students in their assigned classes\. This is enforced at the application layer and validated in the RLS policy for teacher\-role connections\.

# __Section 6: API Design — Structure, Standards, and Trade\-offs__

## __6\.1 REST vs GraphQL Decision__

__Q: Why REST and not GraphQL for ExamEdge?__

A: ExamEdge has a single primary client \(its own frontend\) with well\-defined, stable data requirements\. GraphQL's core advantage — flexible queries that allow clients to request exactly the fields they need — is most valuable when multiple external clients with different data requirements query the same API\. ExamEdge has one internal client\. The additional complexity of GraphQL \(schema definition, resolver architecture, N\+1 query protection, subscription handling for real\-time features\) is not justified by the gain\. REST with carefully named endpoints and consistent response shapes gives the same result with lower operational overhead\.

__Q: When would you introduce GraphQL to ExamEdge?__

A: If ExamEdge exposed a public API that third\-party developers used to build integrations — a school management system querying student progress, or a mobile app with different data requirements than the web app\. At that point, GraphQL's flexibility would be valuable\. The migration path is well\-defined: introduce a GraphQL layer on top of the existing database and business logic without rewriting the core application\.

## __6\.2 API Endpoint Structure__

// Curriculum

GET    /api/curricula                          \-\- list all boards

GET    /api/curricula/:id/subjects             \-\- subjects for a board

GET    /api/subjects/:id/topics                \-\- topics for a subject

// Questions

POST   /api/questions/generate                 \-\- generate question for topic

GET    /api/questions/:id                      \-\- retrieve specific question

// Study sessions

POST   /api/sessions                           \-\- start a new session

GET    /api/sessions/:id                       \-\- get session state

PATCH  /api/sessions/:id                       \-\- update session \(pause, resume\)

POST   /api/sessions/:id/responses             \-\- submit an answer

GET    /api/sessions/:id/responses             \-\- get session responses

// Mastery and progress

GET    /api/students/:id/mastery               \-\- mastery map for student

GET    /api/students/:id/progress              \-\- progress dashboard data

// Exam simulation

POST   /api/simulations                        \-\- assemble and start exam paper

GET    /api/simulations/:id                    \-\- get simulation state

POST   /api/simulations/:id/submit             \-\- submit completed paper

GET    /api/simulations/:id/report             \-\- post\-simulation examiner report

__Q: Why PATCH /sessions/:id and not PUT?__

A: PUT replaces the entire resource\. PATCH applies a partial update\. Pausing a session updates only the status and paused\_at fields — not the entire session object\. Using PATCH communicates the intent precisely and avoids accidentally overwriting fields that were not included in the request body\.

__Q: How do you version your API?__

A: The current API is unversioned because it has no external consumers\. When ExamEdge exposes a public API or builds a mobile app that cannot be updated simultaneously with the backend, I will introduce versioning via URL prefix: /api/v1/\. The v1 prefix in the Next\.js App Router is implemented as a nested folder: /app/api/v1/\. The old unversioned routes remain functional during the deprecation window\.

## __6\.3 Error Handling__

Every API route returns a consistent error envelope:

\{ "error": \{ "code": "QUESTION\_NOT\_FOUND", "message": "The requested question does not exist or is not accessible\.", "status": 404 \} \}

Error codes are application\-level constants, not HTTP status text\. This allows clients to handle specific error conditions programmatically without string matching against human\-readable messages\. HTTP status codes are used semantically: 400 for validation errors, 401 for unauthenticated, 403 for unauthorised, 404 for not found, 429 for rate limited, 500 for server errors\.

# __Section 7: API Security — Threats, Mitigations, and Trade\-offs__

*Security is not a feature\. It is a property of every decision in the system\. An interviewer who asks about security is evaluating whether you think about threats proactively or only reactively\.*

## __7\.1 Input Validation and SQL Injection__

__Q: How do you prevent SQL injection in ExamEdge?__

A: Drizzle ORM generates parameterised queries\. User input never appears directly in SQL string concatenation\. Every query is compiled with placeholders that the database driver fills with sanitised values\. Additionally, all user input is validated with Zod schemas at the API boundary before reaching the database layer — invalid input is rejected before a database query is constructed\.

// Safe: parameterised query via Drizzle

const user = await db\.select\(\)\.from\(users\)

  \.where\(eq\(users\.email, userInput\.email\)\) // parameterised

  \.limit\(1\);

// Would be dangerous \(never done\): string concatenation

// const query = \`SELECT \* FROM users WHERE email = '$\{userInput\.email\}'\`;

__Q: What is SQL injection and why are parameterised queries the correct defence?__

A: SQL injection occurs when user input is concatenated directly into a SQL query string\. An attacker who inputs 'admin@example\.com' OR '1'='1 into an email field can manipulate the query to match all rows\. Parameterised queries pass the value as a separate parameter to the database driver, which escapes it before constructing the query\. The database engine sees the literal string 'admin@example\.com\\' OR \\'1\\'=\\'1' — not an executable SQL fragment\.

## __7\.2 XSS Prevention__

__Q: How do you prevent XSS in ExamEdge?__

A: Three layers\. First, React's JSX escapes all dynamic values by default — a student's answer text rendered in a React component is HTML\-entity\-encoded automatically\. Second, the one place where HTML rendering is necessary \(mathematical notation via KaTeX\) uses KaTeX's own sanitisation pipeline, which only renders valid LaTeX notation and strips anything that is not\. Third, the Content\-Security\-Policy header \(set by Next\.js middleware\) restricts script execution to scripts served from ExamEdge's own domain, blocking injected external scripts\.

// next\.config\.js \- Content Security Policy

headers: \[\{ key: 'Content\-Security\-Policy',

  value: "default\-src 'self'; script\-src 'self' 'unsafe\-inline' https://cdn\.jsdelivr\.net" \}\]

## __7\.3 CSRF Protection__

__Q: What is CSRF and how does ExamEdge prevent it?__

A: Cross\-Site Request Forgery: a malicious website tricks a logged\-in user's browser into making an authenticated request to ExamEdge \(e\.g\. submitting a fake answer\)\. The browser sends the session cookie automatically\. Auth\.js sets the session cookie with SameSite=Lax, which prevents it from being sent with cross\-origin POST requests initiated by third\-party sites\. For state\-changing operations via forms, Auth\.js also validates a CSRF token that is embedded in the form and verified server\-side\.

## __7\.4 Rate Limiting__

__Q: How do you implement rate limiting and why?__

A: Rate limiting prevents abuse: a student cannot make 10,000 AI marking requests per minute \(which would exhaust my Claude API budget\), and an attacker cannot brute\-force login attempts\. Implementation: Upstash Redis stores a sliding window counter per user ID \(or IP for unauthenticated endpoints\)\. Every API route checks this counter before processing\. Limits: authentication endpoints: 5 requests per minute per IP\. AI operations \(question generation, marking\): 60 per hour per user\. General API: 300 per minute per user\.

import \{ Ratelimit \} from '@upstash/ratelimit';

import \{ Redis \} from '@upstash/redis';

const ratelimit = new Ratelimit\(\{

  redis: Redis\.fromEnv\(\),

  limiter: Ratelimit\.slidingWindow\(60, '1 h'\), // 60 per hour

  analytics: true,

\}\);

const \{ success, remaining \} = await ratelimit\.limit\(userId\);

if \(\!success\) return Response\.json\(\{ error: 'RATE\_LIMITED' \}, \{ status: 429 \}\);

## __7\.5 Additional Security Headers__

X\-Frame\-Options: DENY              \-\- prevent clickjacking

X\-Content\-Type\-Options: nosniff   \-\- prevent MIME sniffing

Strict\-Transport\-Security: max\-age=31536000  \-\- enforce HTTPS

Referrer\-Policy: strict\-origin\-when\-cross\-origin

Permissions\-Policy: camera=\(\), microphone=\(self\)  \-\- restrict browser APIs

Note: microphone=\(self\) allows microphone access on ExamEdge's own domain \(for oral explanation assessment\) but prevents third\-party embeds from accessing the microphone\.

# __Section 8: Scalability — From 100 to 1 Million Users__

*The scalability question is not about whether your MVP can handle 1 million users\. It is about whether you understand which component breaks first, what the remediation is, and at what cost\.*

## __8\.1 Current State: 100\-1,000 Users__

The current architecture \(Vercel \+ Neon free tier \+ Upstash free tier\) can comfortably handle 1,000 concurrent active study sessions\. The bottlenecks at this scale are: Claude API rate limits \(default 1,000 requests per minute on the standard tier\) and Neon's compute hours allocation \(191 hours per month on the free tier, approximately 6\.4 hours per day\)\. Both are resolved by upgrading to paid tiers — no architectural changes required\.

## __8\.2 Scaling to 100,000 Users__

At 100,000 registered students with 10,000 concurrent sessions:

- __Bottleneck 1 — AI API throughput:__ The Claude API's concurrent request limit becomes the constraint\. Mitigation: question caching \(generate once, serve many times\)\. At this scale, 80% of questions served should be cache hits from the PostgreSQL question pool\. AI API calls are reserved for UVE probes, Socratic guidance, and new question generation\. Estimated API call reduction: 70\-80%\.
- __Bottleneck 2 — Database connections:__ PostgreSQL's connection limit \(approximately 100 on standard Neon instances\) is exhausted by serverless functions that each open a new connection\. Mitigation: connection pooling via PgBouncer \(Neon provides this\) or Drizzle's pool configuration\. Each Vercel serverless function reuses a pooled connection rather than opening a new one\.
- __Bottleneck 3 — Vercel cold starts:__ Serverless functions on Vercel have cold start latency \(50\-200ms\) when a new instance spins up\. Under sustained load, instances warm quickly\. For consistent low\-latency, I would migrate the high\-frequency API routes \(question delivery, answer submission\) to Vercel's Edge Runtime, which has near\-zero cold start time\.

## __8\.3 Scaling to 1 Million Users__

At 1 million registered students with 100,000 concurrent sessions, the architecture requires more significant changes:

- __Database scaling:__ Neon supports read replicas\. High\-read operations \(question retrieval, mastery reads, dashboard data\) route to read replicas\. High\-write operations \(answer submission, mastery updates\) route to the primary\. This horizontally scales read capacity without sharding\.
- __AI inference extraction:__ The AI chains \(marking, Socratic guidance, UVE probes\) move to a dedicated FastAPI service on Railway or AWS\. This service is independently scalable — spinning up more instances during peak examination preparation periods \(GCE revision season\) and scaling down off\-peak\. Next\.js handles only the web layer\.
- __CDN for static assets:__ Vercel's edge network already handles static asset delivery\. At continental scale, I would add a dedicated CDN \(Cloudflare\) in front of the API for cacheable responses \(curriculum data, question metadata, public mastery statistics\)\.
- __Queue\-based AI processing:__ High\-volume AI operations \(weekly report generation, consistency test scheduling, question bank refresh\) move from synchronous API calls to an async queue \(BullMQ over Redis\)\. Workers process the queue at the rate the AI API allows\.
- __Database sharding \(year 3\+\):__ If the student\_responses table grows beyond 500 million rows, horizontal sharding by student\_id hash becomes necessary\. Neon's planned distributed PostgreSQL feature would handle this transparently\. Alternatively, responses older than 6 months are archived to cold storage \(Cloudflare R2\) and the hot table remains manageable\.

## __8\.4 Caching Strategy__

__Q: What do you cache and why?__

A: Caching is a spectrum: cache too aggressively and users see stale data; cache too little and every request hits the database\. ExamEdge's caching strategy is selective and explicitly reasoned\.

- __Cached in Redis \(TTL: 1 hour\):__ Validated question pool for each topic/difficulty combination\. This is the most\-read data in the system and changes only when new questions are validated\.
- __Cached in Redis \(TTL: 15 minutes\):__ Student mastery summary for dashboard rendering\. Updated on session completion\.
- __Cached in Next\.js Route Handler \(TTL: 24 hours\):__ Curriculum structure \(topics, subjects, examination boards\)\. This changes only when a syllabus is updated\.
- __Never cached:__ Student response data, marking results, active session state\. These must always reflect the current database state to prevent a student receiving stale marking feedback\.

# __Section 9: Monitoring, Logging, and Observability__

*A system you cannot observe is a system you cannot trust in production\. Monitoring is not a nice\-to\-have — it is how you detect failures before students report them\.*

## __9\.1 Observability Stack__

- __Error tracking \(Sentry\):__ Every unhandled exception in the Next\.js application is captured by Sentry with: the full stack trace, the request context \(endpoint, user ID, session ID\), and a breadcrumb trail of the preceding actions\. Sentry alerts are configured for: error rate spike \(>1% of requests returning 500\), new error type \(first occurrence of an unseen exception\), and AI chain failure rate \(>5% of marking calls returning non\-conforming output\)\.
- __Uptime monitoring \(Uptime Robot\):__ HTTP health checks every 5 minutes against: the main application URL, the /api/health endpoint \(which tests database connectivity, Redis connectivity, and Claude API reachability\), and the AI question generation endpoint\. Alert via email on any failure\.
- __Analytics \(Plausible\):__ Privacy\-first, GDPR\-compliant page view and event tracking\. Custom events: session\_started, question\_attempted, hint\_used, exam\_simulation\_completed, uve\_probe\_completed\. These events power the product analytics dashboard showing: daily active students, question attempt rate, hint usage by topic \(which topics need better explanations\), and exam simulation completion rate\.
- __Application logging:__ Structured JSON logs written to console \(captured by Vercel's log aggregation\)\. Every AI chain call logs: model used, input token count, output token count, latency, and whether the output passed Zod validation\. This data feeds a weekly cost analysis: actual API spend vs budgeted\.

## __9\.2 The /api/health Endpoint__

GET /api/health

Response: \{

  "status": "healthy",

  "timestamp": "2026\-06\-24T10:00:00Z",

  "checks": \{

    "database": \{ "status": "ok", "latency\_ms": 12 \},

    "redis": \{ "status": "ok", "latency\_ms": 3 \},

    "ai\_api": \{ "status": "ok", "latency\_ms": 340 \}

  \}

\}

The health endpoint is unauthenticated and cached for 30 seconds\. It performs a lightweight database ping \(SELECT 1\), a Redis ping, and a minimal Claude API call \(one token input/output\)\. It does not expose any internal system details beyond the health status\.

## __9\.3 Production Incident Scenarios__

### __Scenario 1: The marking service becomes extremely slow__

__Q: The AI marking calls are taking 15 seconds instead of the normal 2 seconds\. How do you investigate?__

A: Step 1: Check Sentry for a spike in timeout errors on the /api/sessions/:id/responses endpoint\. Step 2: Check the application logs for Claude API latency — has the Anthropic API itself slowed down \(check status\.anthropic\.com\)? Step 3: If the API is healthy, check whether the mark scheme JSON being sent is unusually large \(a complex question with many steps could increase token count significantly\)\. Step 4: Check Redis hit rate for the mark scheme cache — if the cache has expired or been evicted, every request is reconstructing the schema from PostgreSQL\. Step 5: If none of the above, check Neon database latency — a slow mastery record update \(the write after marking\) could be blocking the response\.

### __Scenario 2: Students see each other's session data__

__Q: Users report seeing data belonging to other students\. How do you diagnose and fix this?__

A: This is a critical incident\. Immediate action: roll back the last deployment if the issue appeared after a release\. Investigation: check the application logs for requests returning data where the authenticated user ID does not match the data owner's user ID\. Most likely cause: a query missing the WHERE student\_id = authenticatedUserId filter — perhaps a developer added a new data endpoint and forgot the isolation clause\. Fix: add the missing filter and verify with the RLS policy that it now blocks the query at the database level\. Post\-incident: audit all data\-returning endpoints for missing user isolation filters\. Add automated tests that verify student A cannot access student B's data\.

### __Scenario 3: Primary database becomes unavailable__

__Q: The Neon PostgreSQL database returns connection errors\. What happens to ExamEdge and how do you recover?__

A: Neon provides automatic failover to a standby replica with a recovery time objective of approximately 30 seconds\. During the outage: API routes that require the database return 503 with a user\-friendly message\. Study sessions in progress are paused and resume\-from\-interruption is triggered \(session state is cached in Redis so the student's progress is not lost\)\. After recovery: Neon's point\-in\-time recovery allows restoring to any second in the last 7 days \(free tier\) or 30 days \(paid tier\) if data corruption occurred\. The backup strategy includes Neon's continuous WAL \(Write\-Ahead Log\) archiving to S3, supplemented by a weekly pg\_dump backup stored in Cloudflare R2\.

# __Section 10: Concurrency, Race Conditions, and Data Consistency__

## __10\.1 Concurrent Session Problem__

__Q: What happens if a student opens ExamEdge on two devices simultaneously?__

A: This is a realistic scenario for a student using their phone and a shared laptop\. ExamEdge handles it explicitly: each session has a unique ID\. The two devices are running separate sessions\. The mastery record updates from both sessions may race to update the same database row\. This is handled with optimistic locking on the mastery\_records table: each update checks that the version number matches what was read before applying the update\. If two sessions update the same mastery record within the same second, one will succeed and the other will retry with fresh data\. The final state correctly reflects both session's contributions\.

## __10\.2 Question Pool Contention__

__Q: If 1,000 students simultaneously request a question from the same topic pool, how do you ensure they don't all receive the same question?__

A: Question selection uses a randomised query with the student's recent question history excluded\. Because parameters are dynamically substituted at render time, even if two students receive the same template, they receive different numerical instances\. The probability of two students receiving identically\-rendered questions is the product of the template selection probability and the parameter collision probability — for a pool of 50 templates with continuous parameter ranges, this is negligibly small\.

## __10\.3 AI Marking Idempotency__

__Q: What happens if a student's answer is submitted twice \(network retry after timeout\)?__

A: The response submission endpoint is idempotent for duplicate submissions within the same session\. The client includes a client\-generated request\_id UUID with every submission\. The server checks this ID against a Redis set before processing\. If the ID exists in Redis, the cached result from the first submission is returned immediately\. If not, the request is processed and the ID is stored in Redis with a 5\-minute TTL\. This prevents the student being charged a double API call and prevents duplicate mastery record updates\.

# __Section 11: Software Design Principles Applied in ExamEdge__

## __11\.1 SOLID Principles__

- __Single Responsibility:__ Each LangChain chain has one responsibility: the Marking Chain marks, the Socratic Guidance Chain generates hints, the UVE Chain generates probes\. They do not share state or functionality\. A change to the marking logic does not require touching the guidance logic\.
- __Open/Closed:__ The curriculum database is open for extension \(adding new boards requires only new data, not new code\) and closed for modification \(adding WAEC to the question bank does not require changing the question selection algorithm\)\.
- __Liskov Substitution:__ The question generation interface is consistent across all boards\. Swapping the underlying prompt template for GCE vs WAEC generation does not change the calling code — both return a question with mark scheme JSON\.
- __Interface Segregation:__ The student\-facing API and the teacher\-facing API are separate route groups with separate authentication middleware\. A student token cannot reach teacher endpoints; the interfaces are segregated\.
- __Dependency Inversion:__ The marking chain depends on an abstract LLM interface, not on a specific model\. Swapping Claude Haiku for a fine\-tuned local model requires changing only the model configuration, not the chain logic\.

## __11\.2 Design Patterns Used__

- __Repository Pattern:__ All database access is abstracted behind repository functions \(e\.g\. getQuestionsByTopic\(\), updateMasteryRecord\(\)\)\. Route handlers call repository functions, not Drizzle ORM directly\. This makes the database layer testable in isolation — tests can mock the repository without a real database\.
- __Strategy Pattern:__ The marking strategy varies by subject\. Mathematics uses step\-by\-step M1/A1/B1 marking\. Biology uses knowledge\-point checklist marking\. English uses AO\-level rubric marking\. Each is a separate strategy class implementing the same interface: mark\(response, markScheme\) => markingResult\. The marking chain selects the appropriate strategy based on the subject metadata\.
- __Observer Pattern:__ After a session is completed, multiple systems need to update: mastery records, spaced repetition schedules, cognitive fingerprint, weekly report data\. Rather than the session completion handler calling each of these directly, it emits a session\_completed event\. Each downstream system subscribes independently\. Adding a new post\-session action \(e\.g\. triggering a teacher notification\) requires adding one subscriber, not modifying the session completion handler\.
- __Builder Pattern:__ The exam paper assembly uses a PaperBuilder that accumulates questions, formats them according to board specifications, and builds the final exam object\. The builder encapsulates the complexity of paper assembly behind a fluent interface\.

# __Section 12: System Architecture — The Complete Picture__

*This section provides the definitive architecture reference that a senior engineer or system architect would expect from a developer claiming complete ownership of the platform\.*

## __12\.1 Request Flow Diagram \(Textual\)__

The following describes the complete path of a request from a student's device to the database and back:

1. \[Student Device\] Browser/PWA → HTTPS request
2. \[Vercel Edge Network\] CDN: serves static assets \(JS, CSS, fonts, KaTeX\)\. Cache miss → routes to Vercel Serverless Function
3. \[Next\.js Middleware\] Runs on Edge Runtime \(zero cold start\)\. Checks: authentication cookie exists? Rate limit exceeded? Geolocation\-based routing \(future: route African traffic to EU\-West region\)\.
4. \[Next\.js Route Handler\] Authenticates request via Auth\.js session verification\. Validates request body with Zod schema\. Checks role\-based permissions\.
5. \[Redis \(Upstash\)\] Cache lookup: is this data available and fresh? If yes, return cached response immediately \(saves database round\-trip and AI API call\)\.
6. \[Drizzle ORM \+ Neon PostgreSQL\] If cache miss: query database\. Drizzle generates parameterised SQL\. Neon serverless driver sends query over HTTP to connection pool\. Pool forwards to PostgreSQL primary or read replica based on operation type\.
7. \[LangChain\.js AI Chains\] For AI operations: construct prompt from template \+ retrieved context\. Send to Anthropic API \(Claude claude\-sonnet\-4\-6 or Haiku\)\. Validate response with Zod\. Cache result in Redis if cacheable\.
8. \[Database Write \+ Transaction\] Write results atomically\. Update Redis cache with new values\.
9. \[Response Construction\] Build response object\. Apply any server\-side rendering \(for initial page loads\)\. Send to client\.
10. \[Client Update\] React updates UI based on response\. KaTeX renders any mathematical notation\. Offline queue processes any queued actions from offline period\.

## __12\.2 Security Boundaries__

The following security boundaries are enforced at each layer:

- __Internet → Vercel Edge:__ TLS 1\.3 encryption\. Vercel's DDoS protection \(rate limiting at edge, IP reputation filtering\)\.
- __Vercel Edge → Route Handler:__ Authentication middleware\. Every request must have a valid session before reaching business logic\.
- __Route Handler → Database:__ Drizzle parameterised queries\. Row\-Level Security policies\. Service account with minimum necessary permissions \(no DROP TABLE, no TRUNCATE\)\.
- __Route Handler → AI API:__ Input sanitisation\. Prompt injection detection\. Output schema validation\.
- __Database → Application:__ Encrypted connection \(TLS\)\. Neon's at\-rest encryption \(AES\-256\)\.

## __12\.3 Data Classification__

ExamEdge classifies data into three tiers with different handling requirements:

- __Tier 1 — PII \(highest sensitivity\):__ User email addresses, names\. Encrypted at rest\. Never logged in application logs\. Deleted on account closure within 30 days\.
- __Tier 2 — Academic data \(sensitive\):__ Student responses, mastery records, cognitive fingerprints\. Encrypted at rest\. Retention: 3 years \(to support a student's full secondary school journey\)\. Access logged\.
- __Tier 3 — Operational data \(standard\):__ Session metadata, question bank, curriculum data\. Standard PostgreSQL encryption at rest\. Indefinite retention for the question bank; 1\-year retention for session metadata\.

# __Section 13: Questions Specific to Solo Project Developers__

*When you claim to have built an entire system alone, interviewers hold you to a higher standard of architectural knowledge\. Every design decision must be fully owned\.*

## __13\.1 The Four Core Interview Questions — Applied to ExamEdge__

### __Why did you choose this approach?__

The architectural choices in ExamEdge are not defaults or imitations\. Each is the result of evaluating the requirements of a solo developer building for low\-bandwidth African students on a zero\-budget timeline\.

The monorepo Next\.js architecture is chosen because it eliminates infrastructure complexity that would slow a solo developer\. The free\-tier\-first tool selection is chosen because it extends the runway before any revenue is required\. The parameterised question database is chosen because it simultaneously improves pedagogical quality and provides integrity benefits\. The LangChain chain architecture is chosen because it makes each AI component independently testable\.

### __What alternatives did you consider?__

Every major technology choice in ExamEdge has an explicitly considered alternative documented in Section 2\. The discipline of considering alternatives is not just for interview preparation — it was the actual design process\. A developer who cannot articulate alternatives has not actually made a choice; they have taken a default\.

### __What trade\-offs exist?__

The monorepo architecture trades scalability ceiling for development velocity\. The free\-tier stack trades performance headroom for zero upfront cost\. LangChain adds abstraction overhead but reduces time\-to\-functional AI chains\. Neon's serverless driver adds HTTP overhead per query but eliminates connection pool management\. Every trade\-off in ExamEdge is acknowledged, documented, and accepted with a clear rationale\.

### __What happens when the system scales 100x?__

Section 8 documents the complete scaling path from 100 to 1 million users with specific bottleneck identification and mitigation for each scale tier\. The short answer: the first bottleneck is the AI API rate limit \(solved by question caching and model tiering\), the second is database connections \(solved by PgBouncer connection pooling\), and the third is the monorepo architecture \(solved by extracting the AI inference layer to a dedicated service\)\.

## __13\.2 The Questions Designed to Catch Out Developers Who Did Not Build It__

__Q: Show me a specific bug you encountered and how you fixed it\.__

A: The most challenging bug in ExamEdge's development was a race condition in the mastery record update\. When a student completed two questions in rapid succession \(faster than the database write of the first response\), both responses read the same mastery\_level value before either had written the update\. Both wrote back mastery values based on the stale read, and one overwrote the other\. The fix was optimistic locking with a version column and a retry loop — standard concurrency control, but identifying the root cause \(a lost update problem, not a logic error\) required reading the application logs carefully and reproducing the race condition under load\.

__Q: What is the most expensive operation in your database and how did you handle it?__

A: The pgvector cosine similarity search for question selection\. Without an index, a scan over 10,000 question embeddings takes 150\-200ms\. With the ivfflat index \(100 clusters\), the same search takes 8\-12ms\. The trade\-off of the approximate index is that it may miss the exact nearest neighbour in approximately 5% of searches — acceptable because question selection requires good similarity, not perfect similarity\.

__Q: How much traffic can your current architecture handle?__

A: The Neon free tier handles approximately 100 concurrent database connections before the compute limit is reached\. Vercel's free tier handles 100GB bandwidth per month, which at ExamEdge's approximately 300KB per 30\-minute session translates to approximately 333,000 session\-hours per month — approximately 10,000 active students at 1 hour of daily usage\. Beyond that, upgrading Neon to Pro \($19/month\) and adding connection pooling handles 10x more traffic with no code changes\.

# __Section 14: Quick Reference — Key Numbers and Facts__

*In a technical interview, being able to cite specific numbers demonstrates that you actually built and operated the system rather than described it from a design document\.*

__Parameter__

__Value and Context__

__bcrypt work factor__

12 \(~250ms per hash, OWASP compliant\)

__JWT access token lifetime__

15 minutes

__JWT refresh token lifetime__

7 days with rotation

__Rate limit: AI operations__

60 per hour per authenticated user

__Rate limit: auth endpoints__

5 per minute per IP

__Rate limit: general API__

300 per minute per authenticated user

__Database: connection limit \(free tier\)__

~100 concurrent \(Neon serverless pool\)

__Vector dimensions \(pgvector\)__

1536 \(Voyage AI text\-embedding\-3 output\)

__Question cache TTL \(Redis\)__

1 hour

__Mastery summary cache TTL__

15 minutes

__Curriculum data cache TTL__

24 hours

__Password reset token lifetime__

15 minutes

__Claude claude\-sonnet\-4\-6 temperature \(question gen\)__

0\.7 \(creative within constraints\)

__Claude Haiku temperature \(marking\)__

0\.1 \(deterministic, consistent\)

__Claude claude\-sonnet\-4\-6 temperature \(Socratic guidance\)__

0\.5 \(guided but varied\)

__Claude claude\-sonnet\-4\-6 temperature \(UVE probe eval\)__

0\.2 \(near\-deterministic\)

__Estimated marking cost per response \(Haiku\)__

~$0\.0005 USD

__Estimated question generation cost \(claude\-sonnet\-4\-6\)__

~$0\.003 USD per question

__Monthly cost at MVP launch__

$12 USD

__Monthly cost at 2,000 active students \(est\.\)__

$139 USD

__pgvector index type__

ivfflat \(approximate nearest neighbour, 100 clusters\)

__Session auto\-save interval__

Every 30 seconds to IndexedDB

__Offline cache size \(PWA\)__

~5MB including question pool for next session

__Minimum supported Android__

Android 7\.0 \(API Level 24, 2016\)

__Minimum RAM__

512MB

__Approximate session data transfer__

200\-500KB per 30\-minute session

# __Section 15: Final Note — How to Use This Document__

*This document exists so that you never have to say 'I don't know' in a technical interview about ExamEdge\. Every question in the comprehensive interview guide has a specific, honest, technically accurate answer grounded in the actual design decisions made during ExamEdge's development\.*

The most important preparation for a technical interview is not memorising this document\. It is understanding the reasoning behind each decision so deeply that you can reconstruct the answer from first principles, adapt it to follow\-up questions that go in unexpected directions, and respond honestly when the interviewer probes something you have not considered\.

When an interviewer asks a question you genuinely cannot answer, the correct response is: 'I have not implemented that yet in the MVP, but my thinking on how I would approach it is\.\.\.' followed by a reasoned answer\. This demonstrates intellectual honesty and engineering maturity — which is what top\-tier interviewers are actually evaluating\.

ExamEdge is a real system, built with real trade\-offs, for a real problem that you understand better than any interviewer\. Walk into every room knowing that\. The architecture is sound, the decisions are justified, and the reasoning is yours\.

*You built this\. Own every byte of it\.*

