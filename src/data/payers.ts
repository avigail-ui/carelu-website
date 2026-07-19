/* ================================================================
   PAYER GUIDE CONFIGS (/payers/:slug)
   ABA coverage & prior-auth guides per payer, distilled from primary
   sources (payer clinical policies, state manuals) compiled June–July
   2026. Framed as verification guidance: every page carries a
   "policies change — verify" disclaimer and links its sources.
   ================================================================ */

export interface PayerFact { label: string; value: string }
export interface PayerSection { h2: string; body?: string[]; list?: { title: string; desc: string }[] }
export interface PayerSource { title: string; url: string }
export interface PayerFaq { q: string; a: string }
export interface PayerConfig {
  slug: string;
  payer: string;
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  atGlance: PayerFact[];
  sections: PayerSection[];
  collect: { title: string; desc: string }[]; // what intake should gather from the family
  sources: PayerSource[];
  faq: PayerFaq[];
}

const REVIEWED = 'July 2026';

export const PAYER_REVIEWED = REVIEWED;

export const payers: Record<string, PayerConfig> = {
  'georgia-medicaid': {
    slug: 'georgia-medicaid',
    payer: 'Georgia Medicaid',
    pill: 'Payer Guide · Georgia Medicaid',
    h1: 'Georgia Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Georgia Medicaid ABA Coverage & Prior Auth: Intake Guide | Carelu',
    metaDescription:
      'How Georgia Medicaid (DCH) covers ABA: eligibility under EPSDT, Katie Beckett access, prior authorization, required documents, CPT codes and modifiers — an intake-focused guide for ABA providers.',
    intro: [
      'Georgia Medicaid covers ABA — the state calls it Adaptive Behavior Services (ABS) — for members under 21 through EPSDT, and Georgia is one of the highest-demand ABA states in the country. But the benefit runs through a thicket of DCH manual rules, CMO-specific policies, and a managed-care transition in flight. Here\'s what an intake team actually needs to know.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21, via EPSDT (since Jan 2018)' },
      { label: 'Prior auth', value: 'Required for assessment AND treatment, separately' },
      { label: 'Auth increments', value: '6-month treatment authorizations' },
      { label: 'Typical hours', value: '10–30 hrs/week; more if medically necessary' },
      { label: 'Middle-income path', value: 'Katie Beckett waiver (income ignored)' },
      { label: 'Managed care', value: 'CMOs administer PA under their own aligned policies' },
    ],
    sections: [
      {
        h2: 'Who qualifies',
        body: [
          'Coverage applies to Medicaid members under age 21 with a documented DSM-5 ASD diagnosis established by a licensed physician, psychologist, or other qualifying professional using evidence-based tools — per current CMO operationalizations, a comprehensive diagnostic evaluation generally needs at least two instruments (one clinician-administered like ADOS-2 or CARS-2, plus one caregiver tool like ADI-R or SRS-2) within the last five years. School psychoeducational assessments don\'t qualify.',
          'The detail most intake teams miss: families who "make too much for Medicaid" often still qualify through the Katie Beckett (TEFRA) deeming waiver — family income is ignored, and qualification is based on the child\'s level of care. It confers full Medicaid eligibility, which unlocks the ABA benefit. An online Katie Beckett application portal launched in April 2026. If your intake process turns away middle-income families without mentioning Katie Beckett, you\'re losing eligible families.',
        ],
      },
      {
        h2: 'Prior authorization',
        body: [
          'Everything is prior-authorized: one PA for the behavioral assessment, a separate PA for treatment, requested by the enrolled QHCP (licensed physician, psychologist, BCBA-D, or BCBA — BCaBAs and RBTs cannot serve as the QHCP). Treatment authorizations come in 6-month increments; fee-for-service PAs go through the GAMMIS portal, while CMO members follow their plan\'s process.',
        ],
        list: [
          { title: 'The treatment PA package', desc: 'Diagnosis + summarized assessment results, proposed Plan of Care (documenting all other services), IFSP/IEP if applicable, psych assessment if applicable, progress notes, and — for CMOs — a Letter of Medical Necessity and the Medicaid cover page.' },
          { title: 'Assessment recency', desc: 'Outside assessments are accepted if dated within 6 months of the request; comprehensive assessments are generally capped at 8 hours per 6-month period.' },
          { title: 'Reauthorization every 6 months', desc: 'Requires a behavior assessment conducted within 2 months of the requested effective date, progress vs. prior goals (with graphs), and updated individualized goals.' },
        ],
      },
      {
        h2: 'The CMO landscape (and why it matters for intake)',
        body: [
          'ABA is not carved out of managed care — most members are in a CMO (CareSource, Peach State, Amerigroup today), and each administers prior auth under its own policy aligned to the DCH manual. December 2024 awards went to CareSource, Humana, Molina, and UnitedHealthcare, with incumbent contracts extended through mid-2026 and go-live potentially slipping to 2027. For intake, the practical rule: always capture which CMO the family is enrolled in — it determines the PA process, forms, and timelines you\'ll be working against.',
        ],
      },
      {
        h2: 'Billing basics your intake data feeds',
        body: [
          'Georgia reimburses CPT 97151–97158, 0362T, and 0373T in 15-minute units, with practitioner-level modifiers (U1–U5) and setting modifiers — U6 in-clinic, U7 out-of-clinic at a higher rate, GT telehealth. Georgia is unusual in paying different rates by setting, which makes the family\'s preferred setting (home vs. center) an intake question with direct revenue implications. Telehealth is billable only if the rendering provider is in Georgia or within 50 miles of the border.',
        ],
      },
    ],
    collect: [
      { title: 'Medicaid ID + CMO', desc: 'Which plan the child is on (CareSource, Peach State, Amerigroup, or FFS) — it decides the whole PA path.' },
      { title: 'Diagnosis report + tools used', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, instruments used, and the date (5-year window; 6-month recency for assessments).' },
      { title: 'Katie Beckett status', desc: 'For non-Medicaid families: whether they\'ve applied, and a pointer to the online portal if not.' },
      { title: 'IEP / IFSP', desc: 'Required in the PA package when applicable; also flags school-setting rules.' },
      { title: 'Preferred setting & availability', desc: 'Home vs. center affects modifiers and rates; school attendance affects allowable weekly hours.' },
      { title: 'Other services in place', desc: 'Speech, OT, PT — the Plan of Care must document coordination.' },
    ],
    sources: [
      { title: 'GA DCH — Autism Spectrum Disorder program', url: 'https://medicaid.georgia.gov/programs/all-programs/autism-spectrum-disorder' },
      { title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' },
      { title: 'GA DCH — Katie Beckett / TEFRA', url: 'https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett' },
      { title: 'CareSource GA MCD-MM-0212 (ABA policy)', url: 'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101' },
      { title: 'Peach State GA.CP.BH.504 (ASD services)', url: 'https://www.pshpgeorgia.com/content/dam/centene/peachstate/policies/clinical-policies/GA.CP.BH.504.pdf' },
    ],
    faq: [
      { q: 'Does Georgia Medicaid cover ABA therapy?', a: 'Yes — for members under age 21 with a documented DSM-5 ASD diagnosis, under EPSDT, effective since January 2018. All services require prior authorization.' },
      { q: 'Can families who earn too much for Medicaid still get ABA covered?', a: 'Often, yes — through the Katie Beckett (TEFRA) deeming waiver, which ignores family income and qualifies the child based on level of care. Approval confers full Medicaid eligibility, including the ABA benefit.' },
      { q: 'How long do Georgia Medicaid ABA authorizations last?', a: 'Treatment authorizations are issued in 6-month increments, with reauthorization requiring a recent assessment (within 2 months), documented progress, and updated goals.' },
    ],
  },

  'aetna': {
    slug: 'aetna',
    payer: 'Aetna',
    pill: 'Payer Guide · Aetna',
    h1: 'Aetna ABA coverage: verification & prior-auth guide.',
    metaTitle: 'Does Aetna Cover ABA Therapy? Prior Auth & Intake Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA therapy: CPB 0554 policy, the precertification process and required information, provider qualifications, and telehealth rules — an intake-focused guide for ABA providers.',
    intro: [
      'Aetna covers ABA for autism spectrum disorder under its clinical policy CPB 0554 — and considers it experimental for everything else. Coverage is real but gated: precertification with specific required information, an ASD-only diagnosis scope, and plan-by-plan variation that makes benefit verification non-negotiable. Here\'s what intake needs to capture to get a family from "we have Aetna" to an authorized start.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD (F84.0–F84.9) only' },
      { label: 'Policy', value: 'CPB 0554 (ABA) + CPB 0648 (ASD)' },
      { label: 'Precert', value: 'Required — form GR-69017-4 (eff. 1/1/2026), via Availity or phone' },
      { label: 'Provider bar', value: 'BACB certification or state BA licensure' },
      { label: 'Telehealth', value: 'Covered for 97151, 97153, 97155, 97156, 97157' },
      { label: 'Reauth cadence', value: 'Commonly ~6 months (verify per plan)' },
    ],
    sections: [
      {
        h2: 'What Aetna requires for precertification',
        body: [
          'As of January 1, 2026, a single form — GR-69017-4 — replaces Aetna\'s previous ABA precert forms, submitted through Availity\'s two-step process (precert add + clinical questionnaire) or by phone. The information it demands is exactly what a good intake process should have already collected:',
        ],
        list: [
          { title: 'Diagnosis details', desc: 'DSM-5 diagnosis code(s), the diagnosing provider, and their credentials.' },
          { title: 'Requested hours by CPT code', desc: 'The proposed intensity, code by code — which means the assessment plan needs to exist before the request.' },
          { title: 'Supervising clinician', desc: 'Name and credential of the BCBA or licensed clinician overseeing the case.' },
          { title: 'Concurrent services', desc: 'PT/OT/speech and school services, plus how care is coordinated across them.' },
          { title: 'Rationale for changes', desc: 'Any increase or change in hours needs explicit clinical justification.' },
        ],
      },
      {
        h2: 'Provider qualifications',
        body: [
          'Practitioners delivering ABA under Aetna policy need BACB national certification or state behavior-analyst licensure; unlicensed staff work under supervision per practice standards. The diagnosis itself must come from a provider qualified to diagnose within their scope — licensed psychologist, psychiatrist, or physician. CPB 0648 also references intensive-intervention research norms (25 hours/week, 12 months/year), useful context when justifying requested intensity.',
        ],
      },
      {
        h2: 'Telehealth',
        body: [
          'Aetna covers telehealth for 97151, 97153, 97155, 97156, and 97157 (97152 is excluded), billed with GT/95/FR modifiers per its telemedicine payment policy. Notably, Aetna announced it would end ABA telehealth coverage in late 2023 — then rescinded the change within weeks. The lesson for intake: telehealth rules are volatile; verify the current position on every benefits check rather than assuming last quarter\'s answer.',
        ],
      },
      {
        h2: 'The plan-variation trap',
        body: [
          'CPB 0554 is Aetna\'s clinical policy — but self-funded employer plans can carve benefits differently, and state mandates layer on top. Two families with Aetna cards can have materially different ABA benefits. The only safe intake behavior is a live benefits verification on every family: ABA coverage confirmation, deductible status, visit or dollar limits, and the precert path for that specific plan.',
        ],
      },
    ],
    collect: [
      { title: 'Member ID, group ID & subscriber', desc: 'Plus a card photo — enough to run verification without a callback.' },
      { title: 'Plan type', desc: 'Fully insured vs. self-funded changes which rules apply; note the state of issue for mandate purposes.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD code, diagnosing provider and credentials, evaluation date.' },
      { title: 'Concurrent services', desc: 'Speech, OT, PT, school supports — required on the precert form.' },
      { title: 'Prior ABA history', desc: 'Previous providers, hours, and progress — needed to justify requested intensity.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy?', a: 'Yes — for autism spectrum disorder (ICD-10 F84.0–F84.9) under clinical policy CPB 0554, with precertification. Aetna considers ABA experimental for non-ASD indications.' },
      { q: 'Does Aetna require prior authorization for ABA?', a: 'Yes. As of 1/1/2026, precertification uses form GR-69017-4, submitted via Availity or by phone, with diagnosis details, requested hours per CPT code, the supervising clinician, and concurrent services.' },
      { q: 'Does Aetna cover ABA by telehealth?', a: 'Yes, for codes 97151, 97153, 97155, 97156, and 97157 (not 97152) — but the policy has shifted before, so confirm the current rule during each benefits verification.' },
    ],
  },

  'cigna': {
    slug: 'cigna',
    payer: 'Cigna / Evernorth',
    pill: 'Payer Guide · Cigna / Evernorth',
    h1: 'Cigna ABA coverage: prior auth, plans & telehealth.',
    metaTitle: 'Cigna ABA Coverage & Prior Authorization: Intake Guide | Carelu',
    metaDescription:
      'How Cigna/Evernorth covers ABA: no PA on assessment codes, treatment authorization requirements under EN0499, treatment-plan standards, session-note rules, and full telehealth coverage.',
    intro: [
      'Cigna (through Evernorth Behavioral Health) covers ABA for autism with one of the more intake-friendly front doors in the industry: no prior authorization on assessment codes. The rigor arrives at the treatment-authorization step, where policy EN0499 sets detailed requirements for assessments, treatment plans, and progress data. Understanding both halves lets an intake team start families fast without setting up a denial later.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — ASD only (Rett syndrome excluded)' },
      { label: 'Assessment PA', value: 'None for 97151, 97152, 0362T (with ASD dx + licensed/BCBA provider)' },
      { label: 'Treatment PA', value: 'Required — assessment + plan + PA form' },
      { label: 'Submission window', value: 'Up to 30 days before or within 2 weeks after start' },
      { label: 'Telehealth', value: '"All ABA CPT codes are covered telehealth services"' },
      { label: 'Policy', value: 'EN0499 (eff. 5/15/2026) + autism resource guide' },
    ],
    sections: [
      {
        h2: 'The intake-friendly part: no assessment PA',
        body: [
          'With an autism diagnosis on file, an independently licensed provider or BCBA can run assessment codes 97151, 97152, and 0362T without prior authorization (when the plan covers ABA). For intake, that means the sequence can be: verify benefits → book the assessment immediately → build the treatment request from the assessment. No authorization purgatory between first call and first appointment — if your intake process is fast enough to use it.',
        ],
      },
      {
        h2: 'Treatment authorization',
        body: [
          'The treatment PA package is the completed assessment plus treatment plan with Cigna\'s ABA PA form, submitted up to 30 days before or within two weeks after the start of service (later submissions trigger retrospective review). Initiation requires a standardized, validated instrument — current edition, e.g., Vineland-3 — administered within 60 days before treatment start, with deficits mapped to DSM-5-TR ASD domains and to the treatment plan\'s goals.',
        ],
        list: [
          { title: 'Treatment-plan bar', desc: 'Measurable goals with operational definitions and mastery criteria; dated baseline data per setting; caregiver-training goals with their own baselines and data plans; a named, credentialed supervisor; and defined discharge criteria with a fading plan.' },
          { title: 'Session notes', desc: 'Every note needs date, start/end times, location, focus, detailed intervention description, persons present, service type, and the rendering provider\'s name, credential, and signature.' },
          { title: 'Continued treatment', desc: 'Updated plan with current data (≤60 days old), sustained progress, a repeat standardized assessment within a year, and re-assessment after any break over 60 days.' },
        ],
      },
      {
        h2: 'Billing restrictions worth knowing at intake',
        body: [
          'ABA isn\'t covered when delivered at the same time as another therapy (speech, OT) to the same child — so intake should map the family\'s existing therapy schedule, not just list it. Only one provider can bill a unit of time, with the standard supervision exceptions. And if a family is transitioning from another ABA agency, overlapping authorization periods require documented coordination between agencies — capture the outgoing provider\'s details up front.',
        ],
      },
      {
        h2: 'Supervision and credentialing',
        body: [
          'Assessment and case supervision must come from a BCBA, licensed behavior analyst, or independently licensed clinician with documented ABA training, with direct supervision at the standard 1–2 hours per 10 hours of direct treatment. Evernorth doesn\'t credential non-licensed staff — RBT services bill under the supervising provider.',
        ],
      },
    ],
    collect: [
      { title: 'Member ID + plan details', desc: 'Card photo, subscriber info, and whether the plan actually includes the ABA benefit.' },
      { title: 'Diagnosis documentation', desc: 'DSM-5-TR ASD diagnosis; note Rett syndrome (F84.2) is excluded under EN0499.' },
      { title: 'Recent standardized assessment', desc: 'E.g., Vineland-3 within 60 days of treatment start — or plan to administer one during your assessment window.' },
      { title: 'Current therapy schedule', desc: 'Days/times of speech, OT, PT — concurrent-service timing directly affects billability.' },
      { title: 'Prior/current ABA provider', desc: 'Transitions need documented coordination; get releases signed at intake.' },
    ],
    sources: [
      { title: 'Cigna EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
    ],
    faq: [
      { q: 'Does Cigna require prior authorization for ABA?', a: 'Not for assessment codes (97151, 97152, 0362T) when there\'s an autism diagnosis and the provider is independently licensed or a BCBA. Treatment services do require authorization — assessment plus treatment plan with the PA form.' },
      { q: 'Does Cigna cover ABA by telehealth?', a: 'Yes — its March 2025 provider guide states all ABA CPT codes are covered telehealth services, with delivery (in-person, telehealth, hybrid) based on the individual\'s needs.' },
      { q: 'Can a child receive ABA and speech therapy under Cigna?', a: 'Yes, but not at the same time of day — Cigna doesn\'t cover ABA delivered concurrently with another therapy session. Intake should capture the existing therapy schedule to plan around it.' },
    ],
  },

  'unitedhealthcare-optum': {
    slug: 'unitedhealthcare-optum',
    payer: 'UnitedHealthcare / Optum',
    pill: 'Payer Guide · UnitedHealthcare / Optum',
    h1: 'UnitedHealthcare & Optum ABA: the authorization guide.',
    metaTitle: 'UnitedHealthcare / Optum ABA Prior Auth & Coverage Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare covers ABA through Optum Behavioral Health: the two-step authorization via Provider Express, 4–6 month reviews, code clusters, supervision standards, and telehealth attestation.',
    intro: [
      'UnitedHealthcare administers ABA through Optum Behavioral Health, with authorization running through the Provider Express portal as a two-step process — assessment first, then treatment. Optum\'s Supplemental Clinical Criteria are among the most operationally specific in the industry (down to utilization thresholds and code clusters), which cuts both ways: more rules to satisfy, but also more predictability for an intake team that knows them.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — via Optum Behavioral Health' },
      { label: 'Prior auth', value: 'Two-step: assessment auth, then treatment auth (Provider Express)' },
      { label: 'Review cadence', value: 'Every 4–6 months, per account/state law' },
      { label: 'Code structure', value: '4 clusters; units shift within a cluster' },
      { label: 'Supervision', value: '1–2 hrs per 10 direct hrs; min 1 hr 97155/case/month' },
      { label: 'Utilization flag', value: '<80% of authorized hours (2-week window) gets scrutiny' },
    ],
    sections: [
      {
        h2: 'The two-step authorization',
        body: [
          'Step one authorizes the assessment: functional behavior assessment, caregiver interviews, direct observation, record review, baseline skills, and norm-referenced instruments. Step two authorizes treatment based on what the assessment produced. Both run through Provider Express. For most commercial plans without a state-specific carve-out, the standard Optum Supplemental Clinical Criteria (BH803ABASCC) apply.',
          'The diagnosis bar: DSM-5-TR ASD from a state-licensed physician, psychologist, or other qualified clinician, confirmed with at least one clinically validated tool (ADI-R, ADOS-2, DISCO — or second-level tools like CARS-2, RITA-T, STAT).',
        ],
      },
      {
        h2: 'Code clusters — and why intake data shapes them',
        body: [
          'Optum authorizes in four clusters: assessment (97151, 97152), direct care (97153, 97154), multi-staff (0362T, 0373T), and QHP services (97155–97158). Units can flex within a cluster without a new authorization — a genuinely useful operational buffer. Concurrent billing is allowed for supervision (97153+97155), group oversight (97154+97155), and parent training alongside direct care (97153+97156). Not covered: team meetings without the member, 1:1 classroom aides, and services owed under IDEA — which is why intake should capture the school/IEP picture precisely.',
        ],
      },
      {
        h2: 'Continued-service reviews',
        body: [
          'Reviews land every 4–6 months and want progress documented per targeted behavior using the same measurement methods as baseline — mastered-program rates, change scores, updated standardized adaptive measures. Two operational tripwires matter for scheduling and intake: inadequate progress within 6 months requires documented reasons plus treatment modification, and utilization below 80% of authorized hours over a two-week window draws scrutiny. Families whose availability can\'t support the authorized intensity are a reauthorization risk from day one — capture real availability honestly at intake.',
        ],
      },
      {
        h2: 'Telehealth',
        body: [
          'Tele-supervision and virtual family training require the provider to be an approved Optum virtual-visits provider with a completed attestation on Provider Express, and the authorization itself must note virtual delivery. Optum frames telehealth as a supplement to — not a replacement for — in-person care.',
        ],
      },
    ],
    collect: [
      { title: 'Member ID + card photo', desc: 'Plus subscriber details for the benefits check.' },
      { title: 'Diagnosis + validated tool', desc: 'DSM-5-TR diagnosis, diagnosing clinician, and which instrument confirmed it (ADI-R, ADOS-2, etc.).' },
      { title: 'School / IEP status', desc: 'IDEA-covered services are excluded from coverage — the school picture must be precise.' },
      { title: 'Real family availability', desc: 'Authorized hours the family can\'t attend become an 80%-utilization problem at review.' },
      { title: 'Caregiver participation capacity', desc: 'Caregiver involvement and progress are review criteria — set expectations at intake.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum ABA FAQ (Provider Express)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaFAQ.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare require prior authorization for ABA?', a: 'Yes — a two-step process via Optum\'s Provider Express portal: an assessment authorization first, then a treatment authorization, generally under Optum\'s Supplemental Clinical Criteria unless state law specifies otherwise.' },
      { q: 'How often does Optum review ABA authorizations?', a: 'Most continued-service reviews occur every 4–6 months, requiring progress data measured the same way as baseline, updated standardized measures, and documented caregiver involvement.' },
      { q: 'What happens if a family uses fewer hours than authorized?', a: 'Utilization below 80% of authorized hours over a two-week period draws scrutiny at review. Intake should capture realistic availability so the requested intensity matches what the family can actually attend.' },
    ],
  },

  'anthem-bcbs-georgia': {
    slug: 'anthem-bcbs-georgia',
    payer: 'Anthem BCBS Georgia',
    pill: 'Payer Guide · Anthem BCBS Georgia',
    h1: 'Anthem BCBS Georgia ABA coverage (+ Ava\'s Law).',
    metaTitle: 'Anthem BCBS Georgia ABA Coverage & Ava\'s Law: Intake Guide | Carelu',
    metaDescription:
      'How Anthem Blue Cross Blue Shield covers ABA in Georgia: CG-BEH-02 medical-necessity criteria, documentation and billing rules, 6-month reauthorization — plus how Ava\'s Law and parity protections apply.',
    intro: [
      'Anthem Blue Cross Blue Shield of Georgia covers ABA under clinical guideline CG-BEH-02, layered on top of Georgia\'s autism insurance mandate — Ava\'s Law. The combination matters: the policy defines what\'s medically necessary, while the mandate (and federal parity law) defines what plans must offer and which caps are actually enforceable. Intake teams that understand both catch coverage that others write off.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — per CG-BEH-02 medical-necessity criteria' },
      { label: 'State mandate', value: 'Ava\'s Law: state-regulated plans, age 20 and under' },
      { label: 'Assessment cap', value: 'Initial behavior-identification assessment ≤20 combined hours' },
      { label: 'Direct-care ceiling', value: '≤40 hrs/week adaptive behavior treatment' },
      { label: 'Reauth', value: 'Updated plan every 6 months; standardized assessment ≥ every 2 years' },
      { label: 'Parity note', value: '$35K/year cap generally unenforceable vs. large groups (MHPAEA)' },
    ],
    sections: [
      {
        h2: 'Medical-necessity criteria',
        body: [
          'CG-BEH-02 requires all of the following: an ASD diagnosis from a licensed, qualified professional; a person-centered treatment plan with measurable, baseline-anchored goals; a provider licensed or certified per state law; completed functional assessments across motor, language, social, and adaptive domains; and age-appropriate goals targeting the deficits that matter. The initial behavior-identification assessment is capped at 20 combined hours — enough for a thorough assessment, not an open-ended one.',
        ],
      },
      {
        h2: 'Ava\'s Law — and its limits',
        body: [
          'Georgia\'s autism mandate (O.C.G.A. § 33-24-59.10) requires state-regulated individual and group plans to cover ASD treatment — including ABA — for individuals 20 and under, with ABA nominally cappable at $35,000/year. Two big caveats every intake team should know: employers with 10 or fewer employees and self-funded ERISA plans are exempt from the state mandate; and federal mental-health parity (MHPAEA) generally makes the dollar and age caps unenforceable against covered large-group plans. A payer applying the $35K cap to a large-group member is a parity red flag worth escalating, not accepting.',
        ],
      },
      {
        h2: 'Billing and documentation rules',
        list: [
          { title: 'Codes & modifiers', desc: '97151–97158 plus 0362T/0373T, with degree-level modifiers (HM/HN/HO). Technician-rendered services must show the supervising BCBA in Box 31 of the CMS-1500.' },
          { title: 'Concurrent billing', desc: '97155 alongside 97153 only when technician and QHP are both face-to-face and the QHP is directing.' },
          { title: 'Hour limits', desc: 'Direct treatment ≤40 hours/week; protocol modification up to 2 hours per 10 direct hours, max 8/week.' },
          { title: 'Documentation', desc: 'Timed codes need total minutes and start/stop times; notes entered within 30 days with signature and credentials; plans must include caregiver training, mastery dates, generalization, and discharge planning.' },
        ],
      },
      {
        h2: 'Reauthorization rhythm',
        body: [
          'Expect an updated treatment plan every 6 months, interim progress assessment at least every 6 months, standardized developmental assessments at minimum every 2 years, and documented clinically significant progress in adaptive functioning, communication, language, or social skills. Intake sets this clock: the baseline data collected at the start is what every future review gets measured against.',
        ],
      },
    ],
    collect: [
      { title: 'Member ID + plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) vs. small group (≤10 employees, exempt) — this determines what the plan owes.' },
      { title: 'Employer size', desc: 'Directly relevant to both the mandate and parity analysis.' },
      { title: 'Diagnosis + functional assessments', desc: 'ASD diagnosis from a qualified professional, plus any existing motor/language/social/adaptive assessments.' },
      { title: 'Age', desc: 'The mandate covers 20 and under; parity may extend practical coverage — flag edge cases for benefits verification.' },
      { title: 'Baseline data expectations', desc: 'Set up the measurable, baseline-anchored goals CG-BEH-02 requires from day one.' },
    ],
    sources: [
      { title: 'Anthem ABA Provider Resource Guide (Oct 2024)', url: 'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf' },
      { title: 'Ava\'s Law — O.C.G.A. § 33-24-59.10', url: 'https://law.justia.com/codes/georgia/title-33/chapter-24/article-1/section-33-24-59-10/' },
      { title: 'Georgia Behavior Analyst Licensing Board', url: 'https://sos.ga.gov/georgia-behavior-analyst-licensing-board' },
    ],
    faq: [
      { q: 'Does Anthem BCBS Georgia cover ABA therapy?', a: 'Yes — under clinical guideline CG-BEH-02, requiring an ASD diagnosis, functional assessments, a measurable treatment plan, and a licensed/certified provider. Georgia\'s Ava\'s Law also mandates coverage in state-regulated plans for individuals 20 and under.' },
      { q: 'Is the $35,000 ABA cap in Ava\'s Law enforceable?', a: 'Against large-group plans covered by federal parity law, generally not — MHPAEA prohibits treatment limits on mental-health benefits that are stricter than medical/surgical benefits. Treat a payer applying the cap to a large-group member as a red flag to escalate.' },
      { q: 'Which plans are exempt from Ava\'s Law?', a: 'Self-funded ERISA plans (federal preemption) and employers with 10 or fewer employees. That\'s why intake should always capture the employer and funding type, not just the insurance card.' },
    ],
  },
};
