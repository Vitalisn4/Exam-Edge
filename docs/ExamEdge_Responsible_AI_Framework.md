> **Canonical positioning & roadmap:** [`context/project-overview.md`](context/project-overview.md) · [`context/roadmap.md`](context/roadmap.md)

__EXAMEDGE__

Responsible AI, Privacy &

Data Governance Framework

*AI Hallucination Control  |  Bias Mitigation  |  Data Protection  |  Ethical AI  |  Regulatory Compliance*

__Presidential African Youth in AI & Robotics Competition 2026__

Education Enhancement Track  |  Volume III

__Prepared by: Ngam Vitalis Yuh__

Software Engineer  |  Yaounde, Cameroon  |  github\.com/Vitalisn4

June 2026

# __1\. Purpose of This Document and Gap Assessment__

*This document exists because trust in an AI system must be earned through demonstrated design discipline — not claimed through marketing language\. Every mechanism described here is technically specific, operationally realistic, and directly tied to ExamEdge's actual architecture\.*

A structured audit of the three existing ExamEdge documents \(Innovation Document, Volume II Framework, Technical Interview Guide\) against responsible AI requirements reveals the following coverage profile:

__Requirement__

__Doc 1__

__Doc 2__

__Doc 3__

__Gap Assessment__

__AI Hallucination detection and mitigation__

2 mentions

1 mention

1 mention

__Insufficient — no architecture__

__AI Bias detection and mitigation__

1 mention

0

0

__Insufficient — no framework__

__Data governance framework__

0

0

0

__Absent__

__User consent architecture__

1 mention

1 mention

0

__Insufficient — no mechanism__

__Transparency and explainability__

0

0

1 mention

__Absent__

__Accountability and audit trails__

0

0

0

__Absent__

__Regulatory compliance \(GDPR, AU frameworks\)__

2 mentions

1 mention

1 mention

__Insufficient — no detail__

__Ethical AI principles and framework__

1 mention

0

0

__Absent__

__Responsible AI governance structure__

0

0

0

__Absent__

__Incident response for AI failures__

0

0

0

__Absent__

This document closes all identified gaps with dedicated, architecturally specific treatment of each area\. It is structured to serve three audiences simultaneously: competition judges evaluating responsible AI design, grant reviewers assessing trustworthiness and deployability, and technical interviewers probing depth of understanding\.

# __2\. AI Hallucination — Detection, Mitigation, and Management__

*AI hallucination in an educational context is not a minor inconvenience\. A student who learns an incorrect mathematical procedure from a hallucinating AI marker and repeats that procedure in a high\-stakes examination fails because of the platform\. ExamEdge treats hallucination prevention as a safety\-critical requirement, not a quality\-of\-life improvement\.*

## __2\.1 Taxonomy of Hallucination Risk in ExamEdge__

Hallucination risk varies significantly by AI chain\. Each chain in ExamEdge has a distinct risk profile and requires a distinct mitigation strategy:

__AI Chain__

__Hallucination Risk__

__Specific Failure Mode__

__Primary Mitigation__

__Examiner Marking Chain__

__Critical__

Awarding marks that do not match the rubric; inventing steps that were not in the student's answer; fabricating follow\-through mark awards

Rubric\-schema grounding \+ structured output validation \+ temperature 0\.1

__Question Generation Chain__

__High__

Generating questions with incorrect factual content \(wrong formula, wrong physical constant, impossible scenario\); generating mark schemes that do not match the question

RAG grounding over validated past papers \+ mathematical consistency check \+ human validation gate before publication

__Socratic Guidance Chain__

__Medium__

Providing a hint that inadvertently reveals the answer; suggesting an incorrect intermediate step as a hint

Constrained system prompt \+ answer\-leakage detector \+ hint quality scoring

__UVE Probe Chain__

__Medium__

Generating a probe question that tests a concept not relevant to the original question; evaluating a correct explanation as incorrect

Concept graph grounding \+ probe relevance check \+ bidirectional validation

__Curriculum Intelligence Chain__

__Medium__

Stating an incorrect formula, definition, or factual claim in a concept explanation

RAG grounding over validated curriculum corpus \+ factual claim verification layer

__Student Report Chain__

__Low__

Generating a report narrative that misrepresents the student's actual performance data

Report generated from structured data, not from AI memory; all statistics are database\-retrieved, not LLM\-generated

## __2\.2 Structural Grounding — The Primary Defence__

The most effective hallucination mitigation is architectural, not post\-hoc\. ExamEdge is designed so that the highest\-risk chains — marking and question generation — operate within tightly constrained information spaces where free generation is minimised\.

### __2\.2\.1 Retrieval\-Augmented Generation \(RAG\) for factual grounding__

Every question generation call retrieves the five most semantically similar validated past paper questions before generating\. The LLM is not asked to remember or invent mathematical content — it is asked to generate a new question structurally similar to the retrieved examples\. The retrieved examples act as factual anchors\. If the LLM attempts to generate content inconsistent with the anchor questions \(e\.g\. applying the wrong formula\), the inconsistency is detectable through the validation pipeline\.

The curriculum corpus — the complete GCE Board Buea, OBC, WAEC, and NECO syllabi — is stored as validated, human\-reviewed text in the vector database\. Every curriculum explanation call retrieves the relevant syllabus section before generating\. The LLM explains what the syllabus says; it does not invent curriculum content\.

### __2\.2\.2 Schema\-constrained output for marking__

The marking chain does not produce free text\. It produces a structured JSON object conforming to a Zod schema that is enforced at parse time:

const MarkingResultSchema = z\.object\(\{

  steps: z\.array\(z\.object\(\{

    step\_number: z\.number\(\)\.int\(\)\.min\(1\),

    mark\_type: z\.enum\(\['M1','A1','B1','ft','bod'\]\),

    awarded: z\.boolean\(\),

    marks\_available: z\.number\(\)\.int\(\)\.min\(1\)\.max\(5\),

    marks\_given: z\.number\(\)\.int\(\)\.min\(0\)\.max\(5\),

    feedback: z\.string\(\)\.min\(10\)\.max\(500\),

    justification: z\.string\(\)\.min\(10\)\.max\(300\),

  \}\)\),

  total\_marks: z\.number\(\)\.int\(\),

  confidence: z\.number\(\)\.min\(0\)\.max\(1\),

  flagged\_for\_review: z\.boolean\(\),

\}\);

If the LLM returns any response that does not conform to this schema — including responses where marks\_given exceeds marks\_available, or where mark\_type is not a valid GCE notation — the response is rejected\. The student receives a 'This response has been queued for manual review' message rather than an incorrect mark\. The malformed response is logged to Sentry for monitoring\.

### __2\.2\.3 Temperature control__

Temperature is the primary lever for controlling hallucination risk in LLM outputs\. Higher temperature produces more creative, varied responses; lower temperature produces more deterministic, constrained responses\. ExamEdge sets temperature according to the risk profile of each chain:

__Chain__

__Temperature__

__Regime__

__Reasoning__

__Marking chain__

__0\.1__

Near\-deterministic

Rubric application must be consistent\. Two identical answers must receive identical marks\. Creativity is counterproductive\.

__UVE probe evaluation__

__0\.2__

Near\-deterministic

Evaluating student understanding against defined criteria\. Consistency required across students\.

__Socratic guidance chain__

__0\.5__

Balanced

Hints must be varied \(repetitive hints frustrate students\) but constrained \(must not reveal the answer or suggest incorrect steps\)\.

__Question generation chain__

__0\.7__

Creative within constraints

New questions must be genuinely novel while remaining structurally similar to board originals\.

__Curriculum explanation chain__

__0\.6__

Moderately creative

Explanations should be clear and varied in phrasing but must not introduce factual novelty\.

__Student report generation__

__0\.4__

Low creativity

Reports are personalised narratives but must accurately reflect the data they describe\.

## __2\.3 Post\-Generation Validation Pipeline__

For question generation specifically, no AI\-generated question reaches a student without passing a three\-stage validation pipeline:

1. __Stage 1 — Automated consistency check:__ A secondary LLM call \(Haiku, temperature 0\.0\) is given the generated question and asked to solve it independently\. The solution is compared against the generated mark scheme\. If the model's solution does not match the mark scheme, the question is flagged as potentially inconsistent and moved to manual review\. This 'cross\-examination' technique catches the most common hallucination in mathematical question generation: a question whose mark scheme describes a solution path that is not actually achievable from the question as stated\.
2. __Stage 2 — Syllabus alignment check:__ A vector similarity search confirms that the generated question's embedding is within the cosine similarity threshold of validated questions for the same topic\. Questions that are semantically distant from all validated examples \(i\.e\. genuinely novel in a way that may indicate off\-topic generation\) are flagged for human review\.
3. __Stage 3 — Human validation gate:__ Every AI\-generated question starts with validated=FALSE in the database\. A teacher or curriculum expert must mark it validated=TRUE before it enters the live question pool\. The question review interface shows the question, the mark scheme, the automated cross\-check result, and the syllabus alignment score side by side\. The validator confirms or rejects with one click and optional notes\.

## __2\.4 Confidence Scoring and Uncertainty Communication__

The marking chain returns a confidence score \(0\.0 to 1\.0\) alongside every marking result\. This score reflects the LLM's internal uncertainty about the marking decision\. ExamEdge uses this score operationally:

- __Confidence > 0\.85:__ Mark is displayed to the student immediately with full feedback\.
- __Confidence 0\.70 to 0\.85:__ Mark is displayed with a visual indicator: 'This response was marked with moderate confidence\. If you believe this marking is incorrect, you can request a manual review\.'
- __Confidence < 0\.70:__ Mark is automatically queued for human review\. Student sees: 'Your response is being reviewed by a curriculum specialist\. You will receive your marks within 24 hours\.' This prevents a low\-confidence mark from affecting the student's mastery record until verified\.

## __2\.5 Student Appeal Mechanism__

Any student may flag a marking result as incorrect\. The appeal is routed to a curriculum specialist review queue\. The reviewer sees: the question, the student's answer, the AI marking result with its justification, the mark scheme, and the confidence score\. The reviewer can: confirm the AI mark, override it with a corrected mark and explanation, or escalate to a second reviewer\. The final mark updates the student's mastery record and the outcome is used as training signal for future marking quality improvement\.

Appeal outcomes are tracked in aggregate: if more than 5% of appeals for a specific question type result in overrides, the mark scheme for that question type is flagged for review and the temperature settings for the marking chain are re\-evaluated\.

## __2\.6 Hallucination Monitoring and Continuous Improvement__

ExamEdge maintains a Hallucination Registry — a structured log of every confirmed marking error, question inconsistency, and guidance mistake identified through appeals, manual reviews, and automated checks\. Each entry records: the chain involved, the model version, the prompt template version, the nature of the error, and the resolution\. This registry is reviewed monthly and drives: prompt template refinements, temperature adjustments, validation rule updates, and decisions about when to upgrade to a newer model version\.

# __3\. AI Bias Detection, Mitigation, and Fairness Framework__

*Bias in an educational AI system is not merely an ethical concern — it is a fundamental threat to the platform's mission\. ExamEdge exists to reduce educational inequality\. A biased system could deepen the inequalities it was built to address\.*

## __3\.1 Bias Taxonomy for ExamEdge__

ExamEdge faces five distinct categories of bias, each with different sources, manifestations, and mitigation strategies:

### __3\.1\.1 Language and register bias__

The LLMs used by ExamEdge \(Claude claude\-sonnet\-4\-6, Claude Haiku\) are trained predominantly on English text from North American and European sources\. African English registers — including the specific vocabulary, phrasing conventions, and cultural references used in Cameroonian, Nigerian, and Ghanaian educational contexts — are underrepresented in training data\. This creates a risk that the LLM's marking chain disadvantages students who write correct answers in African English register rather than Standard British English\.

Mitigation strategy:

- The marking chain's system prompt explicitly instructs the model: 'You are marking answers written by African secondary school students\. Accept all grammatical conventions of African English\. Do not penalise phrasing that differs from Standard British English unless the difference affects the mathematical or scientific accuracy of the answer\.'
- The human validation pipeline for mark schemes includes a register bias check: reviewers are specifically asked to confirm that the mark scheme's acceptable\_responses list includes African English phrasing variants, not only Standard British English\.
- Bias testing protocol: before each major model version upgrade, ExamEdge runs a standardised bias test suite of 50 questions with paired answers in Standard British English and African English register\. If the marking chain awards systematically different marks to register\-equivalent answers, the model upgrade is delayed pending prompt refinement\.

### __3\.1\.2 Socioeconomic and cultural bias in question content__

Question content can embed socioeconomic or cultural assumptions that disadvantage students from lower\-income or rural backgrounds\. A physics problem about 'a car accelerating on a motorway' assumes familiarity with motorways that may not exist in rural Cameroon\. A chemistry problem referencing 'a laboratory with a fume cupboard' assumes access to equipment that most Cameroonian schools do not have\. These contextual assumptions do not change the mathematical or scientific content, but they create comprehension friction for students from specific backgrounds\.

Mitigation strategy:

- The question generation prompt explicitly instructs: 'Use contexts familiar to secondary school students in Cameroon and West Africa\. Avoid contexts that assume access to infrastructure or equipment not commonly available in African secondary schools\.'
- The question validation interface includes a cultural context flag: reviewers are asked to identify any contextual assumptions that may be unfamiliar to rural or low\-income students\.
- Question contexts are periodically analysed to ensure geographic, socioeconomic, and cultural diversity across the question pool\.

### __3\.1\.3 Gender bias in question framing__

Research on gender bias in mathematical assessment has established that question framing \(e\.g\. problems centred on typically male\-coded activities such as construction, sports, and engineering versus typically female\-coded activities such as cooking, textiles, and childcare\) can affect performance confidence and engagement, particularly for female students\. ExamEdge actively neutralises this:

- The question generation prompt instructs the model to use gender\-neutral names and contexts, or to alternate systematically between contexts associated with different genders\.
- Question pool analysis tracks the gender distribution of named characters and activity contexts quarterly\.
- The validation checklist includes a gender neutrality check\.

### __3\.1\.4 Cognitive style bias in the adaptive engine__

Item Response Theory \(IRT\), the statistical model underlying ExamEdge's adaptive difficulty engine, estimates student ability from response accuracy\. IRT assumes that a higher\-ability student will outperform a lower\-ability student on any question, regardless of the question's presentation style\. In practice, students with different cognitive styles \(visual vs verbal, procedural vs conceptual\) may perform differently on questions with different presentation formats\. A student who understands calculus conceptually may struggle with algorithmically presented questions while excelling at geometric interpretation questions, and vice versa\.

Mitigation strategy: ExamEdge's Cognitive Fingerprint system tracks performance by question presentation type as well as topic\. The adaptive engine accounts for cognitive style in question selection — a student who consistently performs better on conceptually framed questions receives more conceptually framed questions at the diagnostic stage, ensuring ability estimation is not confounded by presentation format preference\.

### __3\.1\.5 Historical bias in past paper training data__

GCE Board Buea past papers from the 1990s and early 2000s were created in a different social context\. Some historical questions contain contextual assumptions, examples, or vocabulary that reflect colonial\-era educational frameworks\. Using these papers as RAG grounding without filtering risks propagating outdated assumptions into new questions\.

Mitigation strategy: Past papers are timestamped in the database\. The RAG retrieval pipeline de\-weights papers older than 15 years \(2011 and earlier\) in question generation queries\. Pre\-2011 papers are retained in the database for historical reference but are filtered from the generation context window unless explicitly requested for historical analysis purposes\.

## __3\.2 Bias Monitoring Framework__

Bias is not a problem that is solved once during design — it requires ongoing measurement\. ExamEdge implements the following continuous bias monitoring mechanisms:

- __Differential marking analysis:__ Monthly analysis of marking outcomes segmented by: school type \(urban/rural\), examination board, subject, and \(where demographic data is available with consent\) gender\. Statistically significant differences in marking outcomes between demographically comparable groups on equivalent questions trigger a bias investigation\.
- __Question difficulty calibration by demographic segment:__ IRT difficulty parameters are estimated separately for different demographic segments\. A question that shows significantly different difficulty across segments \(not explained by curriculum exposure differences\) is flagged as potentially biased and reviewed by a curriculum specialist\.
- __Hint usage disparity analysis:__ If students from a specific region or school type consistently require more hints than peers on equivalent topics, this may indicate that the curriculum explanation quality is less accessible for their background\. Triggered investigations focus on whether the explanation language, examples, or assumed prior knowledge are appropriate\.
- __Community feedback channel:__ Teachers and students can flag specific questions or feedback as potentially biased via a structured reporting form\. All flags are reviewed within 5 business days\.

## __3\.3 Fairness Principles__

ExamEdge adopts the following formal fairness principles, adapted from the EU AI Act's requirements for high\-risk AI systems and the IEEE Ethically Aligned Design framework:

1. Equitable treatment: ExamEdge's AI systems shall award marks based solely on the academic content of a student's response, without regard to the student's demographic characteristics, geographic location, school type, or language register\.
2. Representational fairness: The question bank shall represent the diversity of African students, contexts, and cultures across all supported examination boards\.
3. Procedural fairness: Every student shall have access to the same appeal mechanism and the same human review process, regardless of their subscription tier\.
4. Outcome fairness: ExamEdge shall monitor and report on marking outcome distributions across demographic groups, and shall investigate and remediate any statistically significant disparities\.
5. Transparency of limitations: ExamEdge shall clearly communicate to students, teachers, and parents the known limitations of its AI marking system and the conditions under which human review may be preferable\.

# __4\. User Data Protection, Privacy, and Security__

*ExamEdge stores academic performance data about children and young adults — one of the most sensitive categories of personal data\. The platform's privacy architecture is designed to be defensible under GDPR, the Cameroon Law on Cybersecurity and Cybercrime \(Law No\. 2010/012\), and the emerging African Union Data Policy Framework\.*

## __4\.1 Applicable Regulatory Framework__

__Regulation__

__Applicability to ExamEdge__

__Status__

__Key Requirements__

__GDPR \(EU General Data Protection Regulation\)__

Any data processor operating internationally that may serve EU\-based Cameroonian diaspora or international students

__Applies \(extra\-territorial scope\)__

Lawful basis for processing, data minimisation, consent architecture, right to erasure, data subject rights, 72\-hour breach notification

__Cameroon Law No\. 2010/012__

Platform operates from Cameroon; students are Cameroonian

__Directly applicable__

Data protection obligations for electronic communications; cybersecurity requirements

__African Union Data Policy Framework \(2022\)__

Continental aspiration for data governance

__Advisory compliance__

Data sovereignty, localisation considerations, cross\-border transfer governance

__ECOWAS Supplementary Act A/SA\.1/01/10 on Personal Data__

Nigeria and Ghana in Phase 3 expansion

__Applies to Phase 3__

Consent requirements, data subject rights, purpose limitation

__Kenya Data Protection Act 2019__

Kenya KCSE integration in Phase 4

__Applies to Phase 4__

Registration with Office of the Data Protection Commissioner, data subject rights

__COPPA equivalent principles__

Students under 13 \(younger secondary students\)

__Best practice__

Enhanced parental consent, data minimisation, no behavioural advertising

## __4\.2 Data Classification and Handling__

__Tier__

__Data Type__

__Protection Measures__

__Retention__

__Access and Handling Rules__

__Tier 1 — Identity PII__

Email address, full name, profile photo

Encrypted at rest \(AES\-256\), encrypted in transit \(TLS 1\.3\)

Deleted within 30 days of account closure

Never logged in application logs; never included in analytics exports

__Tier 2 — Academic performance__

Question responses, marks, mastery scores, cognitive fingerprint

Encrypted at rest; row\-level security in database

3 years \(to support full secondary school journey\); deletion on request

Accessible only to the student, their assigned teacher, and platform admins

__Tier 3 — Session metadata__

Session timestamps, duration, device type, IP address \(anonymised after 24h\)

Encrypted at rest

12 months

IP addresses are truncated to /24 prefix after 24 hours; no full IP stored beyond this

__Tier 4 — Operational__

Question bank, curriculum data, system logs

Standard encryption

Indefinite \(question bank\); 90 days \(system logs\)

No PII included in system logs; logs are anonymised before storage

__Tier 5 — Analytics \(aggregated\)__

Pass rate trends, question difficulty calibration, usage patterns

Anonymised, non\-re\-identifiable

Indefinite

Individual students cannot be identified from aggregated analytics

## __4\.3 Consent Architecture__

ExamEdge collects the minimum necessary data for its stated purpose\. Consent is obtained explicitly and separately for each category of data processing:

### __4\.3\.1 Consent collection mechanism__

At registration, the user is presented with a layered consent interface — not a wall of legal text but a structured series of clear choices:

1. Essential data processing \(required\): 'ExamEdge needs your email and study data to personalise your learning experience\. Without this, the platform cannot function\.' — No checkbox; this is disclosed as a condition of service\.
2. AI\-powered personalisation \(required for full functionality\): 'ExamEdge uses AI to adapt question difficulty, generate personalised reports, and identify your weak topics\. This requires processing your study performance data\.' — Checkbox with plain\-English explanation\.
3. Teacher access \(optional, relevant only if enrolled in a school\): 'Your assigned teacher can see your topic mastery and progress reports\. They cannot see your individual question answers\.' — Checkbox with specific description of what teacher can see\.
4. Product improvement \(optional\): 'May ExamEdge use your anonymised study data to improve question quality and AI marking accuracy? Your identity is never associated with this data\.' — Checkbox, default unchecked\.
5. Email communications \(optional\): 'May ExamEdge send you weekly progress summaries and examination countdown reminders?' — Checkbox, default unchecked\.

For students under 18, consent items 3, 4, and 5 require a parent or guardian email verification before activation\. The parental consent flow sends a verification email to the provided guardian email, requiring explicit confirmation before the feature activates\.

### __4\.3\.2 Consent withdrawal__

Any consent item can be withdrawn at any time from the Privacy Settings page\. Withdrawal is immediate: within 24 hours of withdrawal, the data covered by the withdrawn consent is no longer processed for that purpose\. Data already processed is retained for the period specified in the data classification table unless the student exercises their right to erasure\.

### __4\.3\.3 Right to erasure \(right to be forgotten\)__

A student may request complete account deletion from the Account Settings page\. ExamEdge's deletion process:

1. Immediate: session authentication tokens are invalidated\.
2. Within 24 hours: Tier 1 PII \(email, name\) is deleted from the primary database\.
3. Within 30 days: Tier 2 academic performance data is deleted\. Anonymised, non\-re\-identifiable aggregate statistics derived from the student's data are retained\.
4. Deletion certificate: the student receives an email confirmation that their data has been deleted, specifying what was deleted and what \(if any\) anonymised data was retained and why\.

## __4\.4 Data Breach Response Protocol__

ExamEdge's breach response protocol follows GDPR's 72\-hour notification requirement and the Cameroon Law No\. 2010/012 disclosure obligations:

1. __Hour 0\-2:__ Breach detected \(via Sentry alert, anomaly detection, or external report\)\. Incident commander designated \(the developer at MVP stage; a designated security officer at scale\)\. Affected systems isolated\.
2. __Hour 2\-24:__ Scope assessment: what data was exposed? How many users affected? Was the exposure to unauthorised external parties or internal? Mitigation applied: credentials rotated, vulnerable endpoint patched or taken offline\.
3. __Hour 24\-72:__ Regulatory notification: if the breach involves Tier 1 or Tier 2 data of EU\-connected users, notify the relevant supervisory authority within 72 hours\. Prepare user notification\.
4. __Hour 72\+:__ User notification: affected users receive an email describing: what happened, what data was involved, what ExamEdge has done to address it, what the user should do, and who to contact with questions\. This notification is in plain language, not legal boilerplate\.

# __5\. Ethical AI Framework__

*An ethical AI framework is not a values statement\. It is an operational architecture that translates abstract principles into specific, enforceable design decisions\. Every principle in this framework is accompanied by a concrete implementation mechanism\.*

## __5\.1 Core Ethical Principles__

ExamEdge adopts the following ethical AI principles, aligned with the UNESCO Recommendation on the Ethics of AI \(2021\), the African Union's emerging AI ethics guidelines, and Anthropic's Responsible Scaling Policy \(relevant because ExamEdge uses Anthropic's Claude models\):

__Principle__

__Meaning for ExamEdge__

__Implementation Mechanism__

__Human agency and oversight__

AI should augment human decision\-making, not replace it in high\-stakes contexts

Every AI marking result above a confidence threshold can be challenged\. No mark is final without a human appeal pathway\. Teachers retain authority over final grade recommendations\.

__Robustness and safety__

AI systems should be technically robust and tested against adversarial conditions

Zod schema validation, temperature constraints, hallucination detection pipeline, and confidence scoring ensure the AI fails safely rather than silently\.

__Privacy and data governance__

AI systems should respect privacy and process data lawfully

Section 4 of this document implements GDPR\-aligned privacy architecture with explicit consent, data minimisation, and breach response protocols\.

__Transparency__

Stakeholders should be able to understand how AI decisions are made

ExamEdge publishes its marking methodology documentation \(not the specific prompts, which would enable gaming, but the principles\)\. Every mark includes a justification\. Confidence scores are disclosed\.

__Non\-discrimination and fairness__

AI must not produce discriminatory outcomes

Section 3 implements the bias detection and mitigation framework, differential analysis monitoring, and community feedback mechanisms\.

__Societal and environmental wellbeing__

AI should serve societal benefit and minimise environmental harm

ExamEdge's primary mission is educational equity\. Environmental: Anthropic's Claude models run on data centres with renewable energy commitments\. ExamEdge's own infrastructure \(Vercel, Cloudflare, Neon\) uses providers with active sustainability programmes\.

__Accountability__

Developers and operators must be accountable for AI outcomes

The accountability framework in Section 5\.3 establishes specific responsibility assignments for each category of AI decision\.

## __5\.2 Transparency and Explainability Architecture__

Transparency in ExamEdge operates at three levels — each serving a different stakeholder:

### __5\.2\.1 Transparency to students__

Students receive a marking explanation for every awarded or withheld mark\. The explanation uses language appropriate for a secondary school student: not 'the LLM's confidence score was below threshold' but 'You correctly identified the differentiation rule \(method mark awarded\), but your substitution produced an incorrect value \(accuracy mark not awarded because the correct calculation gives x = 2, not x = 3\)\.'

Students are additionally informed, in the platform's Terms of Service and in the marking interface, that: ExamEdge uses AI to mark responses; AI marking may occasionally be incorrect; every mark can be challenged; a human reviewer will verify any disputed mark\.

### __5\.2\.2 Transparency to teachers__

Teachers receive the full marking breakdown for every student response in their class, including the AI's confidence score and any flags raised by the validation pipeline\. Teachers can see when a response was marked by AI alone versus when it was reviewed or overridden by a human\. The teacher dashboard displays a 'AI marking confidence' metric across the class — if confidence scores are systematically low for a topic, this signals that the question pool for that topic may need expert review\.

### __5\.2\.3 Transparency to regulators and auditors__

ExamEdge maintains a Model Card for each AI model version used in production\. A Model Card is a standardised documentation format \(introduced by Mitchell et al\., 2019, now a de facto standard in responsible AI\) that describes: the model's intended use, performance characteristics, known limitations, and evaluation results on ExamEdge\-specific benchmarks\. Model Cards are available to regulatory bodies, educational authorities, and academic researchers on request\.

## __5\.3 Accountability Framework__

Clear accountability requires assigning specific responsibility for specific decisions\. The following matrix defines accountability across ExamEdge's AI decision types:

__Decision Type__

__Primary Accountable Party__

__Review Accountable__

__Escalation Path__

__AI marks a student's answer__

Automated \(AI\)

Developer reviews if flagged

Student may appeal; teacher may override; developer resolves systematic errors

__AI\-generated question enters the question pool__

Human \(validator\)

Developer manages pipeline

Validator is accountable for approved questions; developer for pipeline quality

__AI withholds a mark due to low confidence__

Automated, reviewed

Curriculum specialist

Curriculum specialist is accountable for final mark

__AI generates a biased question__

Developer \(design failure\)

Developer and validator \(missed in review\)

Developer remediates pipeline; validator process reviewed

__AI produces a hallucinated curriculum explanation__

Automated detection \+ Developer

Developer

Developer remediates prompt and updates Hallucination Registry

__Student data is exposed in a breach__

Developer \(technical\)

Developer \(response\)

Developer notifies users and authorities per breach protocol

__AI adaptation disadvantages a student group__

Developer \(design\)

Developer \+ bias monitor

Developer remediates; documented in Bias Registry

## __5\.4 Responsible AI in the Specific Context of Child Education__

ExamEdge serves students who may be as young as 12 years old\. This demographic requires specific ethical protections beyond standard adult\-oriented AI systems:

- __No profiling for commercial purposes:__ ExamEdge's AI never builds student profiles for advertising, commercial data sales, or third\-party targeting\. The student's academic data serves one purpose: improving their examination readiness\.
- __No dark patterns:__ The platform's engagement design deliberately avoids manipulative techniques \(Section 21 of the Volume II document\)\. AI\-driven engagement prompts are informational, not anxiety\-inducing\.
- __Age\-appropriate AI explanations:__ When students ask 'how does ExamEdge know this?', the platform provides age\-appropriate explanations of AI marking and guidance\. The goal is to build AI literacy alongside subject knowledge\.
- __Psychological safety in AI feedback:__ The AI's feedback on incorrect answers is instructionally focused, never personally critical\. The system prompt for all student\-facing chains includes: 'Your feedback must be supportive and educational\. Never express frustration, disappointment, or judgement about the student's answer\.'
- __Right to human explanation:__ Any student who receives an AI\-generated assessment and wants a human explanation has the right to request one, free of charge, within 48 hours\. This is a right, not a premium feature\.

# __6\. Data Governance Framework__

*Data governance is the system of policies, processes, and accountabilities that ensures data is used correctly, consistently, and responsibly across the platform's lifecycle\. Without governance, even well\-intentioned privacy and ethics commitments are not enforced in practice\.*

## __6\.1 Data Governance Principles__

- __Data minimisation:__ ExamEdge collects only the data necessary for its stated educational purpose\. No data is collected 'because it might be useful later'\. Every data collection decision requires a documented purpose\.
- __Purpose limitation:__ Data collected for one purpose is not used for another without explicit consent\. Academic performance data collected for personalised tutoring is not used for marketing without separate opt\-in\.
- __Storage limitation:__ Data is retained only for as long as necessary\. Retention periods are defined, enforced automatically through scheduled database jobs, and documented in the data classification table\.
- __Accuracy:__ ExamEdge provides mechanisms for students and teachers to correct inaccurate data \(e\.g\. wrongly assigned topic, incorrectly recorded session result\)\.
- __Integrity and confidentiality:__ Data is protected through technical and organisational measures against unauthorised processing, accidental loss, destruction, or damage\.

## __6\.2 Data Flows and Third\-Party Processors__

ExamEdge uses the following third\-party data processors\. Each has been evaluated for GDPR compliance and data processing agreements are in place:

__Processor__

__Purpose__

__Data Transmitted__

__Compliance and Safeguards__

__Anthropic \(Claude API\)__

AI marking, question generation, guidance, reporting

Student answer text, question content — no PII transmitted

Anthropic's API processes data under their Data Processing Agreement\. Student responses are not used to train future models \(zero\-retention API option selected\)\.

__Neon \(PostgreSQL\)__

Primary database

All student and operational data

SOC 2 Type II certified\. Data stored in EU\-West region\. Encryption at rest \(AES\-256\)\. WAL archiving for backup\.

__Upstash \(Redis\)__

Session caching, rate limiting

Session tokens, rate limit counters — no academic data

Upstash does not retain data beyond the configured TTL\. EU data residency option selected\.

__Cloudflare \(R2 \+ CDN\)__

Audio file storage, static asset delivery

Oral explanation audio files, application assets

GDPR\-compliant\. Audio files stored in EU region\. CDN serves only public static assets; no student PII cached at edge\.

__Vercel__

Application hosting and deployment

Application code and environment variables

SOC 2 Type II\. No student data stored at Vercel beyond logs \(anonymised, 30\-day retention\)\.

__Resend__

Transactional email delivery

Student email address, report content

GDPR\-compliant\. Emails are transactional only; Resend does not use recipient data for their own marketing\.

__Africa's Talking__

USSD and SMS delivery

Phone numbers for USSD/SMS users

Data processing agreement in place\. Phone numbers used only for message delivery; not retained by Africa's Talking beyond 30 days\.

__Critical note on AI API data handling:__ Student answer text is transmitted to the Anthropic Claude API for marking and guidance\. This is disclosed in the privacy policy and consent interface\. The zero\-data\-retention API option is selected, meaning Anthropic does not store or use submitted data to train future models\. Students are informed of this in plain language: 'Your answers are processed by an AI system to generate marks and feedback\. Your answers are not stored by the AI provider or used to train AI models\.'

## __6\.3 Audit Trail Architecture__

Accountability requires that every significant system action is logged and reviewable\. ExamEdge maintains the following audit trails:

- __Marking audit log:__ Every AI marking result is stored permanently with: timestamp, student ID, question ID, model version, prompt template version, input token count, output token count, confidence score, and the full marking result JSON\. This log cannot be deleted by any user, including admins\. It provides a complete, reproducible audit trail for any marking dispute\.
- __Data access audit log:__ Every access to student Tier 1 or Tier 2 data by admin or teacher accounts is logged with: accessor ID, data type accessed, timestamp, and the API endpoint that triggered the access\.
- __Consent change audit log:__ Every change to a student's consent settings is logged with: timestamp, the consent item changed, the previous state, and the new state\. This log is retained for the duration of the account plus 3 years\.
- __AI model change log:__ Every change to model version, prompt template, or temperature setting for any production chain is recorded with: timestamp, changed parameter, previous value, new value, and justification\. This log enables investigation of whether a change in AI behaviour is related to a model or prompt update\.

## __6\.4 Data Sovereignty Considerations__

The African Union Data Policy Framework \(2022\) advocates for data sovereignty — the principle that African data about African citizens should be governed by African legal frameworks and, where feasible, processed on African infrastructure\. ExamEdge acknowledges this principle and implements the following:

- __Current state \(MVP\):__ Primary database \(Neon\) uses EU\-West region, which provides GDPR\-level protections\. This is the highest\-compliance option currently available for serverless PostgreSQL\. Anthropic's API processing occurs on US/EU infrastructure\.
- __Medium\-term goal \(Year 2\):__ Evaluate Neon's Africa region offering when available \(Neon has announced plans for additional regions\)\. Evaluate African cloud infrastructure options \(AWS af\-south\-1 Cape Town, Azure South Africa North\) for database hosting as they mature\.
- __Long\-term goal \(Year 3\+\):__ Advocate within the Tech4Dev and African AI community for sovereign AI infrastructure that enables African educational data to be processed on African\-owned, African\-governed computational infrastructure\.
- __Transparency:__ The current data residency situation — EU\-hosted database, US/EU AI processing — is disclosed in the privacy policy\. Students and schools are informed of this and given the opportunity to decline if they have specific data localisation requirements\.

# __7\. Responsible AI Operational Practices__

*Responsible AI is not achieved through a one\-time design review\. It requires operational processes that continuously monitor, evaluate, and improve the system's behaviour in the real world\.*

## __7\.1 Model Version Management__

ExamEdge does not automatically upgrade to new AI model versions\. Every model upgrade follows a structured evaluation process:

1. __Step 1 — Benchmark evaluation:__ The candidate model version is evaluated on ExamEdge's internal benchmark suite: 500 marking tasks with known correct outcomes across all supported subjects, 100 Socratic guidance tasks evaluated by curriculum specialists, and 50 UVE probe tasks evaluated for pedagogical quality\. Results are compared against the current production model\.
2. __Step 2 — Bias regression test:__ The candidate model is run through the 50\-question bias test suite \(African English vs Standard British English register, gender\-coded contexts, socioeconomic contexts\)\. Outcomes are compared against the production model baseline\.
3. __Step 3 — Hallucination regression test:__ The candidate model is run on the 30 questions in the Hallucination Registry where the production model has historically underperformed\. Improvement must be demonstrated on at least 80% of these cases before upgrade proceeds\.
4. __Step 4 — Shadow deployment:__ The candidate model runs in parallel with the production model for 2 weeks, processing a random 10% of real student submissions\. Results are compared but the candidate model's marks are not shown to students\. Discrepancies above 5% in marking outcomes trigger investigation\.
5. __Step 5 — Gradual rollout:__ The candidate model is promoted to production for 25% of traffic, then 50%, then 100% over 2 weeks\. Rollback is triggered automatically if error rates, confidence score distributions, or appeal rates deviate significantly from baseline\.

## __7\.2 Ongoing Human Oversight Requirements__

Certain categories of AI decision require mandatory human review regardless of confidence score:

- __Examination simulation final papers:__ Every AI\-assembled examination paper is reviewed by a curriculum specialist before being made available in the simulation pool\. No untested paper reaches a student in exam mode\.
- __New subject onboarding:__ When a new subject is added to the platform, the first 100 AI\-generated questions for that subject undergo 100% human validation before any student encounters them\.
- __Appeal resolutions:__ All appeal outcomes are reviewed by the developer \(at MVP stage\) or the designated curriculum team \(at scale\)\. No appeal is resolved by the AI alone\.
- __Anomalous performance patterns:__ If any student's mastery scores change by more than 40 percentage points in a single session, the session data is flagged for human review to distinguish genuine rapid learning from potential data integrity issues\.

## __7\.3 AI Limitations Communication__

ExamEdge communicates the following limitations of its AI systems to all users through the Help Centre, the marking interface, and the onboarding flow:

1. ExamEdge's AI marking is highly accurate for mathematics and science subjects where marking criteria are structured and objective\. It is less reliable for humanities subjects where holistic judgement is required\. For English Literature and Economics, AI marking provides an indicative score; human review is recommended before treating the mark as authoritative\.
2. ExamEdge's AI may occasionally misunderstand ambiguous mathematical notation\. If your working is correct but formatted unusually \(e\.g\. non\-standard fraction notation, unconventional equation layout\), the AI may not recognise it\. Use the appeal mechanism if you believe a correct answer was marked wrong for formatting reasons\.
3. ExamEdge's question bank is not a substitute for the actual GCE Board Buea or WAEC past papers\. The questions are generated to examination standard but are not official board materials\.
4. ExamEdge's predicted examination grade is an estimate based on platform performance, not a guarantee of actual examination outcome\. Many factors affecting examination performance \(examination conditions, physical health, test anxiety\) are outside the platform's visibility\.

## __7\.4 Incident Response for AI Failures__

ExamEdge defines the following incident severity levels for AI\-related failures:

__Severity__

__Example__

__Immediate Response__

__Follow\-Up__

__P0 — Critical__

AI consistently marking correct answers as incorrect across multiple students

Immediately pause AI marking for affected subject; revert to manual review queue; notify affected students within 2 hours

Post\-mortem within 48 hours; root cause document published internally

__P1 — High__

AI hallucinating factual content in curriculum explanations that students have accessed

Remove affected explanations from production; notify students who accessed them with correction; investigate within 24 hours

Root cause analysis; update Hallucination Registry; prompt refinement

__P2 — Medium__

Marking confidence scores systematically low for a specific topic \(>20% below\-threshold responses\)

Flag topic for expedited human review; notify teachers of affected class; investigate within 72 hours

Mark scheme review; possible prompt or RAG corpus update

__P3 — Low__

Individual marking appeal resolved in student's favour

Update student's marks; log outcome in marking audit; feed back to bias and hallucination analysis

Monthly aggregate review of P3 incidents for systemic patterns

# __8\. Integration Notes — How This Document Connects to the Existing Portfolio__

This document \(Volume III\) is designed to be read alongside the three existing ExamEdge documents\. The following table maps each major topic in this document to the relevant sections in the other documents, enabling cross\-referencing for a complete picture:

__Topic in This Document__

__Related Section__

__Relationship__

__AI Hallucination — structural grounding \(RAG\)__

Innovation Doc Sec 4 \(AI Integration\)

This document provides the specific mitigation architecture; the Innovation Document provides the chain\-by\-chain AI integration overview

__AI Bias — marking chain register sensitivity__

Innovation Doc Sec 3 \(Proposed Innovation\)

This document provides the specific bias testing and monitoring framework; the Innovation Document describes the marking architecture

__Data Privacy — GDPR compliance__

Technical Interview Guide Sec 4 \(Authentication\)

This document provides the complete privacy architecture; the Interview Guide covers the authentication mechanism that enforces access control

__Consent architecture — parental consent for minors__

Volume II Sec 22 \(Accessibility\)

This document provides the full consent collection and withdrawal mechanism; Volume II covers the device and connectivity accessibility requirements

__Accountability — marking audit log__

Technical Interview Guide Sec 9 \(Monitoring\)

This document defines what is logged and why; the Interview Guide describes the monitoring infrastructure that captures and stores those logs

__Ethical AI — no dark patterns__

Volume II Sec 21 \(Student Engagement\)

This document provides the ethical framework; Volume II describes the specific engagement design decisions that implement it

__AI incident response__

Technical Interview Guide Sec 9 \(Production Incidents\)

This document provides the AI\-specific incident severity classification; the Interview Guide covers general production incident scenarios

__Data governance — third\-party processors__

Technical Interview Guide Sec 2 \(Stack Justification\)

This document provides the data governance assessment of each processor; the Interview Guide provides the technical justification for selecting each tool

## __8\.1 Recommended Reading Order for Different Audiences__

- __Competition judges \(education track\):__ Volume I Innovation Document \(Sections 1\-7\) → This document \(Sections 2, 3, 5\) → Volume II Framework \(Section 25 — Final Design Principle\)\.
- __Grant reviewers \(development funders\):__ This document in full → Volume I \(Executive Summary, Sections 6, 7\) → Volume II \(Sections 23, 24\)\.
- __Technical interviewers \(software engineering\):__ Technical Interview Guide in full → This document \(Sections 2, 4, 6\) for responsible AI specifics\.
- __Ministry of Education reviewers:__ This document \(Sections 3, 4, 5\) → Volume II \(Sections 20, 21, 22, 23\) → Volume I \(Section 11, 13\)\.
- __Potential investors:__ Volume I \(Executive Summary, Sections 5, 8\) → Volume II \(Section 23 — Cost and Sustainability\) → This document \(Section 5 — Ethical AI Framework\) to assess reputational risk management\.

## __8\.2 Living Document Commitment__

This responsible AI framework is a living document\. It will be updated:

- When ExamEdge integrates a new AI model version — with updated bias test results and hallucination benchmark comparisons\.
- When ExamEdge expands to a new examination board or country — with jurisdiction\-specific regulatory compliance assessment\.
- When any P0 or P1 AI incident occurs — with a post\-mortem summary and framework update\.
- Annually — with a full review of all regulatory requirements against current implementation\.

*The commitment to responsible AI is not demonstrated by writing this document\. It is demonstrated by updating it every time something goes wrong, every time the system changes, and every time a student's trust is tested\. This document is the baseline\. What matters is the discipline to maintain it\.*

