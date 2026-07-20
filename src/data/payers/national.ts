import type { PayerConfig } from './types';

export const nationalPayers: Record<string, PayerConfig> = {
  'aetna': {
    slug: 'aetna',
    cardDesc: 'CPB 0554 \u2014 ASD-only coverage, precert form GR-69017-4, telehealth codes.',
    family: 'aetna',
    assessmentPA: 'Required — precertification (form GR-69017-4, eff. 1/1/2026)',
    treatmentPA: 'Required — precertification',
    payer: 'Aetna',
    state: 'US', kind: 'commercial',
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
        cites: [{ title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' }],
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
        cites: [{ title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' }, { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' }],
        body: [
          'Practitioners delivering ABA under Aetna policy need BACB national certification or state behavior-analyst licensure; unlicensed staff work under supervision per practice standards. The diagnosis itself must come from a provider qualified to diagnose within their scope — licensed psychologist, psychiatrist, or physician. CPB 0648 also references intensive-intervention research norms (25 hours/week, 12 months/year), useful context when justifying requested intensity.',
        ],
      },
      {
        h2: 'Telehealth',
        cites: [{ title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' }],
        body: [
          'Aetna covers telehealth for 97151, 97153, 97155, 97156, and 97157 (97152 is excluded), billed with GT/95/FR modifiers per its telemedicine payment policy. Notably, Aetna announced it would end ABA telehealth coverage in late 2023 — then rescinded the change within weeks. The lesson for intake: telehealth rules are volatile; verify the current position on every benefits check rather than assuming last quarter\'s answer.',
        ],
      },
      {
        h2: 'The plan-variation trap',
        cites: [{ title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' }],
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
    cardDesc: 'No PA on assessment codes; EN0499 treatment authorization; full telehealth.',
    family: 'cigna',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (with ASD dx + licensed/BCBA provider)',
    treatmentPA: 'Required — assessment + plan with the ABA PA form',
    payer: 'Cigna / Evernorth',
    state: 'US', kind: 'commercial',
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
        cites: [{ title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' }, { title: 'Cigna EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' }],
        body: [
          'With an autism diagnosis on file, an independently licensed provider or BCBA can run assessment codes 97151, 97152, and 0362T without prior authorization (when the plan covers ABA). For intake, that means the sequence can be: verify benefits → book the assessment immediately → build the treatment request from the assessment. No authorization purgatory between first call and first appointment — if your intake process is fast enough to use it.',
        ],
      },
      {
        h2: 'Treatment authorization',
        cites: [{ title: 'Cigna EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' }],
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
        cites: [{ title: 'Cigna EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' }],
        body: [
          'ABA isn\'t covered when delivered at the same time as another therapy (speech, OT) to the same child — so intake should map the family\'s existing therapy schedule, not just list it. Only one provider can bill a unit of time, with the standard supervision exceptions. And if a family is transitioning from another ABA agency, overlapping authorization periods require documented coordination between agencies — capture the outgoing provider\'s details up front.',
        ],
      },
      {
        h2: 'Supervision and credentialing',
        cites: [{ title: 'Cigna EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' }],
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
    cardDesc: 'Two-step auth via Provider Express, 4\u20136 month reviews, code clusters.',
    family: 'unitedhealthcare',
    assessmentPA: 'Required — step 1 of the two-step authorization (assessment auth)',
    treatmentPA: 'Required — step 2 (treatment auth)',
    payer: 'UnitedHealthcare / Optum',
    state: 'US', kind: 'commercial',
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
        cites: [{ title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' }],
        body: [
          'Step one authorizes the assessment: functional behavior assessment, caregiver interviews, direct observation, record review, baseline skills, and norm-referenced instruments. Step two authorizes treatment based on what the assessment produced. Both run through Provider Express. For most commercial plans without a state-specific carve-out, the standard Optum Supplemental Clinical Criteria (BH803ABASCC) apply.',
          'The diagnosis bar: DSM-5-TR ASD from a state-licensed physician, psychologist, or other qualified clinician, confirmed with at least one clinically validated tool (ADI-R, ADOS-2, DISCO — or second-level tools like CARS-2, RITA-T, STAT).',
        ],
      },
      {
        h2: 'Code clusters — and why intake data shapes them',
        cites: [{ title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' }],
        body: [
          'Optum authorizes in four clusters: assessment (97151, 97152), direct care (97153, 97154), multi-staff (0362T, 0373T), and QHP services (97155–97158). Units can flex within a cluster without a new authorization — a genuinely useful operational buffer. Concurrent billing is allowed for supervision (97153+97155), group oversight (97154+97155), and parent training alongside direct care (97153+97156). Not covered: team meetings without the member, 1:1 classroom aides, and services owed under IDEA — which is why intake should capture the school/IEP picture precisely.',
        ],
      },
      {
        h2: 'Continued-service reviews',
        cites: [{ title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' }],
        body: [
          'Reviews land every 4–6 months and want progress documented per targeted behavior using the same measurement methods as baseline — mastered-program rates, change scores, updated standardized adaptive measures. Two operational tripwires matter for scheduling and intake: inadequate progress within 6 months requires documented reasons plus treatment modification, and utilization below 80% of authorized hours over a two-week window draws scrutiny. Families whose availability can\'t support the authorized intensity are a reauthorization risk from day one — capture real availability honestly at intake.',
        ],
      },
      {
        h2: 'Telehealth',
        cites: [{ title: 'Optum ABA FAQ (Provider Express)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaFAQ.pdf' }],
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
};
