import type { PayerConfig } from './types.js';

export const georgiaPayers: Record<string, PayerConfig> = {
  'georgia-medicaid': {
    slug: 'georgia-medicaid',
    cardDesc: 'EPSDT under 21, Katie Beckett path, CMO landscape, PA packages.',
    assessmentPA: 'Required — a separate prior authorization for the behavioral assessment',
    treatmentPA: 'Required — separate PA, issued in 6-month increments',
    dxRequired: 'Yes \u2014 documented DSM-5 ASD diagnosis (EPSDT ABS benefit)',
    payer: 'Georgia Medicaid',
    state: 'GA', kind: 'state-medicaid',
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
      { label: 'Diagnosis recency', value: 'Eval instruments within 5 years; outside assessments within 6 months' },
    ],
    sections: [
      {
        h2: 'Who qualifies',
        cites: [{ title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' }, { title: 'GA DCH — Katie Beckett / TEFRA', url: 'https://medicaid.georgia.gov/programs/all-programs/tefrakatie-beckett' }],
        body: [
          'Coverage applies to Medicaid members under age 21 with a documented DSM-5 ASD diagnosis established by a licensed physician, psychologist, or other qualifying professional using evidence-based tools — per current CMO operationalizations, a comprehensive diagnostic evaluation generally needs at least two instruments (one clinician-administered like ADOS-2 or CARS-2, plus one caregiver tool like ADI-R or SRS-2) within the last five years. School psychoeducational assessments don\'t qualify.',
          'The detail most intake teams miss: families who "make too much for Medicaid" often still qualify through the Katie Beckett (TEFRA) deeming waiver — family income is ignored, and qualification is based on the child\'s level of care. It confers full Medicaid eligibility, which unlocks the ABA benefit. An online Katie Beckett application portal launched in April 2026. If your intake process turns away middle-income families without mentioning Katie Beckett, you\'re losing eligible families.',
        ],
      },
      {
        h2: 'Prior authorization',
        cites: [{ title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' }],
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
        cites: [{ title: 'GA DCH — Autism Spectrum Disorder program', url: 'https://medicaid.georgia.gov/programs/all-programs/autism-spectrum-disorder' }, { title: 'CareSource GA MCD-MM-0212 (ABA policy)', url: 'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101' }, { title: 'Peach State GA.CP.BH.504 (ASD services)', url: 'https://www.pshpgeorgia.com/content/dam/centene/peachstate/policies/clinical-policies/GA.CP.BH.504.pdf' }],
        body: [
          'ABA is not carved out of managed care — most members are in a CMO (CareSource, Peach State, Amerigroup today), and each administers prior auth under its own policy aligned to the DCH manual. December 2024 awards went to CareSource, Humana, Molina, and UnitedHealthcare, with incumbent contracts extended through mid-2026 and go-live potentially slipping to 2027. For intake, the practical rule: always capture which CMO the family is enrolled in — it determines the PA process, forms, and timelines you\'ll be working against.',
        ],
      },
      {
        h2: 'Billing basics your intake data feeds',
        cites: [{ title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' }],
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

  'anthem-bcbs-georgia': {
    slug: 'anthem-bcbs-georgia',
    cardDesc: 'CG-BEH-02 criteria + Ava\u2019s Law mandate; caps, parity, billing rules.',
    family: 'anthem',
    assessmentPA: 'Required; initial behavior-identification assessment capped at 20 combined hours',
    treatmentPA: 'Required — updated plan every 6 months',
    dxRequired: 'Yes \u2014 ASD diagnosis from a licensed, qualified professional (CG-BEH-02)',
    payer: 'Anthem BCBS Georgia',
    state: 'GA', kind: 'commercial',
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
        cites: [{ title: 'Anthem ABA Provider Resource Guide (Oct 2024)', url: 'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf' }],
        body: [
          'CG-BEH-02 requires all of the following: an ASD diagnosis from a licensed, qualified professional; a person-centered treatment plan with measurable, baseline-anchored goals; a provider licensed or certified per state law; completed functional assessments across motor, language, social, and adaptive domains; and age-appropriate goals targeting the deficits that matter. The initial behavior-identification assessment is capped at 20 combined hours — enough for a thorough assessment, not an open-ended one.',
        ],
      },
      {
        h2: 'Ava\'s Law — and its limits',
        cites: [{ title: 'Ava\'s Law — O.C.G.A. § 33-24-59.10', url: 'https://law.justia.com/codes/georgia/title-33/chapter-24/article-1/section-33-24-59-10/' }],
        body: [
          'Georgia\'s autism mandate (O.C.G.A. § 33-24-59.10) requires state-regulated individual and group plans to cover ASD treatment — including ABA — for individuals 20 and under, with ABA nominally cappable at $35,000/year. Two big caveats every intake team should know: employers with 10 or fewer employees and self-funded ERISA plans are exempt from the state mandate; and federal mental-health parity (MHPAEA) generally makes the dollar and age caps unenforceable against covered large-group plans. A payer applying the $35K cap to a large-group member is a parity red flag worth escalating, not accepting.',
        ],
      },
      {
        h2: 'Billing and documentation rules',
        cites: [{ title: 'Anthem ABA Provider Resource Guide (Oct 2024)', url: 'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf' }],
        list: [
          { title: 'Codes & modifiers', desc: '97151–97158 plus 0362T/0373T, with degree-level modifiers (HM/HN/HO). Technician-rendered services must show the supervising BCBA in Box 31 of the CMS-1500.' },
          { title: 'Concurrent billing', desc: '97155 alongside 97153 only when technician and QHP are both face-to-face and the QHP is directing.' },
          { title: 'Hour limits', desc: 'Direct treatment ≤40 hours/week; protocol modification up to 2 hours per 10 direct hours, max 8/week.' },
          { title: 'Documentation', desc: 'Timed codes need total minutes and start/stop times; notes entered within 30 days with signature and credentials; plans must include caregiver training, mastery dates, generalization, and discharge planning.' },
        ],
      },
      {
        h2: 'Reauthorization rhythm',
        cites: [{ title: 'Anthem ABA Provider Resource Guide (Oct 2024)', url: 'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf' }],
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

  'caresource-georgia': {
    slug: 'caresource-georgia',
    cardDesc: 'MCD-MM-0212 aligned to the DCH manual; in-house PA; 2026 rate change.',
    family: 'caresource',
    assessmentPA: 'Required — in-house PA/medical review, aligned to the DCH ASD manual',
    treatmentPA: 'Required — signed treatment documentation before claims',
    dxRequired: 'Yes \u2014 DSM-5 ASD per the DCH ASD manual',
    payer: 'CareSource (Georgia Medicaid CMO)',
    pill: 'Payer Guide · CareSource Georgia',
    h1: 'CareSource Georgia ABA coverage (GA Medicaid CMO).',
    metaTitle: 'CareSource Georgia Medicaid ABA (CMO) Coverage & Prior Auth | Carelu',
    metaDescription:
      'How CareSource administers ABA for Georgia Medicaid members — policy MCD-MM-0212 aligned to the DCH ASD manual, in-house medical review, MUE daily-unit limits, and a 2026 reimbursement change.',
    state: 'GA', kind: 'medicaid-mco', parent: 'Georgia Medicaid',
    intro: [
      'CareSource is one of the Georgia Medicaid care management organizations (CMOs) that administers the ABA benefit. Its ABA policy (MCD-MM-0212) is aligned to the Georgia DCH Part II ASD manual, but CareSource layers its own utilization-management process on top — so if a family carries CareSource, this is the guide that governs their authorization.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Georgia Medicaid CMO (managed care)' },
      { label: 'Policy', value: 'GA MCD-MM-0212, aligned to the DCH ASD manual' },
      { label: 'Prior auth', value: 'Required; in-house PA/medical review (GA manual + MCG)' },
      { label: 'Docs', value: 'Signed treatment documentation before claims submission' },
      { label: 'Daily units', value: 'CMS MUE per-code daily-unit limits apply' },
      { label: '2026 rate', value: 'Pays 80% of the GA Medicaid fee schedule (eff. 5/11/2026)' },
      { label: 'Diagnosis recency', value: 'Eval within 5 years (DCH-aligned criteria)' },
    ],
    sections: [
      {
        h2: 'How CareSource administers the benefit',
        cites: [{ title: 'CareSource GA MCD-MM-0212 (ABA policy)', url: 'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101' }],
        body: [
          'CareSource performs in-house prior authorization and medical review using the Georgia ASD manual plus MCG Health criteria, and requires signed treatment documentation to be submitted prior to claims submission. Because it aligns to the DCH manual, the underlying clinical rules mirror Georgia Medicaid — but the submission path, forms, and timelines are CareSource\'s own.',
        ],
        list: [
          { title: 'Maximum daily units (MUE)', desc: 'Per CMS MUE as published by GA (via MM-0212): e.g., 97151=32, 97153=32, 97155=24, 97156=16 daily units — capture requested intensity by code.' },
          { title: 'Assessment cap', desc: 'Comprehensive assessments generally not to exceed 8 hours per 6-month period, consistent with the DCH manual.' },
        ],
      },
      {
        h2: 'The 2026 rate change',
        cites: [{ title: 'CareSource GA MCD-MM-0212 (ABA policy)', url: 'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101' }],
        body: [
          'Effective May 11, 2026, CareSource pays 80% of the Georgia Medicaid fee schedule for covered services — a material change for practices modeling CareSource revenue. It does not change coverage, but it changes the economics of every CareSource authorization.',
        ],
      },
    ],
    collect: [
      { title: 'CareSource member ID', desc: 'Confirm the family is on CareSource (vs. another GA CMO or FFS) — it decides the whole PA path.' },
      { title: 'DSM-5 ASD diagnosis + tools', desc: 'Diagnosis, instruments used, and date, per the DCH manual requirements CareSource follows.' },
      { title: 'Treatment documentation', desc: 'Signed treatment documentation is required before claims — set the expectation at intake.' },
      { title: 'Requested units by code', desc: 'MUE daily-unit limits apply, so plan requested intensity code by code.' },
    ],
    sources: [
      { title: 'CareSource — GA MCD-MM-0212 (ABA policy)', url: 'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101' },
      { title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' },
    ],
    faq: [
      { q: 'Does CareSource Georgia cover ABA therapy?', a: 'Yes — CareSource administers the Georgia Medicaid ABA benefit under policy MCD-MM-0212, aligned to the DCH ASD manual, with in-house prior authorization and medical review. Members must be under 21 with an ASD diagnosis.' },
      { q: 'What changed with CareSource ABA reimbursement in 2026?', a: 'Effective May 11, 2026, CareSource pays 80% of the Georgia Medicaid fee schedule for covered services. Coverage is unchanged; the reimbursement rate is lower.' },
      { q: 'How is CareSource different from Georgia Medicaid fee-for-service?', a: 'The clinical rules align to the DCH ASD manual, but CareSource runs its own PA/medical-review process (using MCG criteria) and requires signed treatment documentation before claims. Always confirm the member\'s plan at intake.' },
    ],
  },

  'peach-state-georgia': {
    slug: 'peach-state-georgia',
    cardDesc: 'GA.CP.BH.504; hour parameters + 80%-attendance rule; 0373T rules.',
    family: 'centene',
    assessmentPA: 'Required — criteria based on the DCH ASD manual',
    treatmentPA: 'Required — criteria based on the DCH ASD manual',
    dxRequired: 'Yes \u2014 DSM-5 ASD per the DCH ASD manual',
    payer: 'Peach State Health Plan (GA Medicaid CMO)',
    pill: 'Payer Guide · Peach State (GA)',
    h1: 'Peach State Health Plan ABA coverage (GA Medicaid CMO).',
    metaTitle: 'Peach State Health Plan (GA Medicaid CMO) ABA Coverage | Carelu',
    metaDescription:
      'How Peach State Health Plan administers ABA for Georgia Medicaid — policy GA.CP.BH.504 aligned to the DCH ASD manual, hour parameters, the 80%-attendance rule, and 0373T requirements.',
    state: 'GA', kind: 'medicaid-mco', parent: 'Georgia Medicaid',
    intro: [
      'Peach State Health Plan is a Georgia Medicaid CMO that administers the ABA benefit under clinical policy GA.CP.BH.504, with prior-authorization criteria explicitly based on the DCH Part II ASD manual. For families carrying Peach State, this is the plan-level layer on top of the state rules.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Georgia Medicaid CMO (managed care)' },
      { label: 'Policy', value: 'GA.CP.BH.504 (ASD services), based on the DCH manual' },
      { label: 'Hours', value: '≤6 hrs/day up to 30/week unless clinically justified' },
      { label: 'Students', value: '<20 hrs/week if attending school full-time' },
      { label: 'Attendance', value: 'Below 80% of authorized hours requires justification' },
      { label: 'Note', value: 'Lost the 2024 CMO rebid (protest pending) — watch status' },
      { label: 'Diagnosis recency', value: 'Eval within 5 years (DCH-aligned criteria)' },
    ],
    sections: [
      {
        h2: 'Utilization parameters',
        cites: [{ title: 'Peach State GA.CP.BH.504 (ASD services)', url: 'https://www.pshpgeorgia.com/content/dam/centene/peachstate/policies/clinical-policies/GA.CP.BH.504.pdf' }],
        body: [
          'Peach State\'s PA criteria follow the DCH ASD manual. Hour parameters: no more than 6 hours per day, up to 30 hours per week unless clinically justified; fewer than 20 hours per week for full-time students; protocol modification (97155) at least 2 hours per week or 10% of direct hours. If attendance falls below 80% of authorized hours, justification documentation is required — which makes capturing realistic family availability at intake a reauthorization safeguard.',
        ],
        list: [
          { title: '0373T requirements', desc: 'Requests need an extra-technician plan, environmental modifications per target behavior, a titration plan toward 97153, and a BCBA on-site and immediately available.' },
        ],
      },
    ],
    collect: [
      { title: 'Peach State member ID', desc: 'Confirm the plan — it determines the PA process and forms.' },
      { title: 'DSM-5 ASD diagnosis', desc: 'Per the DCH manual criteria Peach State follows.' },
      { title: 'Realistic availability', desc: 'The 80%-attendance rule makes accurate availability a first-order intake question.' },
      { title: 'School status', desc: 'Full-time school attendance caps weekly hours below 20 — capture it up front.' },
    ],
    sources: [
      { title: 'Peach State — GA.CP.BH.504 (ASD services)', url: 'https://www.pshpgeorgia.com/content/dam/centene/peachstate/policies/clinical-policies/GA.CP.BH.504.pdf' },
      { title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' },
    ],
    faq: [
      { q: 'Does Peach State Health Plan cover ABA therapy?', a: 'Yes — Peach State administers the Georgia Medicaid ABA benefit under policy GA.CP.BH.504, with prior-authorization criteria based on the DCH ASD manual, for members under 21 with ASD.' },
      { q: 'What are Peach State\'s ABA hour limits?', a: 'Generally no more than 6 hours/day up to 30 hours/week unless clinically justified, and under 20 hours/week for full-time students. Attendance below 80% of authorized hours requires justification.' },
      { q: 'Is Peach State staying a Georgia Medicaid CMO?', a: 'Peach State lost the December 2024 CMO rebid and filed a protest; the transition timeline has been in flux. Confirm the member\'s current plan and any transition at intake.' },
    ],
  },

  'amerigroup-georgia': {
    slug: 'amerigroup-georgia',
    cardDesc: 'CG-BEH-02 adaptive behavioral treatment; verify current version.',
    family: 'anthem',
    assessmentPA: 'Required — CG-BEH-02 medical-necessity review',
    treatmentPA: 'Required — CG-BEH-02 medical-necessity review',
    dxRequired: 'Yes \u2014 DSM-5 ASD per the DCH ASD manual',
    payer: 'Amerigroup (GA Medicaid CMO)',
    pill: 'Payer Guide · Amerigroup (GA)',
    h1: 'Amerigroup Georgia ABA coverage (GA Medicaid CMO).',
    metaTitle: 'Amerigroup Georgia Medicaid (CMO) ABA Coverage Guide | Carelu',
    metaDescription:
      'How Amerigroup administers ABA for Georgia Medicaid — the CG-BEH-02 adaptive behavioral treatment guideline aligned to the DCH ASD manual, with prior authorization and medical-necessity review.',
    state: 'GA', kind: 'medicaid-mco', parent: 'Georgia Medicaid',
    intro: [
      'Amerigroup is a Georgia Medicaid CMO that administers ABA under its Adaptive Behavioral Treatment for ASD guideline (CG-BEH-02), aligned to the Georgia DCH ASD manual. Its published guideline has an older revision date, so verifying the current version on the Amerigroup provider portal is especially important here.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Georgia Medicaid CMO (managed care)' },
      { label: 'Guideline', value: 'CG-BEH-02 (Adaptive Behavioral Treatment for ASD)' },
      { label: 'Aligned to', value: 'Georgia DCH Part II ASD manual' },
      { label: 'Prior auth', value: 'Required; medical-necessity review' },
      { label: 'Caution', value: 'Published guideline dated 2017/2018 — verify current version' },
      { label: 'Note', value: 'Amerigroup\'s Georgia CMO status was affected by the 2024 rebid' },
      { label: 'Diagnosis recency', value: 'Eval within 5 years (DCH-aligned criteria)' },
    ],
    sections: [
      {
        h2: 'How Amerigroup administers the benefit',
        cites: [{ title: 'Amerigroup — Adaptive Behavioral Treatment for ASD (CG-BEH-02, GA Medicaid)', url: 'https://provider.amerigroup.com/docs/gpp/GA_CAID_UMGuideline_AdaptiveBehavioralTreatmentAutismSpectrumDisorder.pdf?v=202101081602' }],
        body: [
          'Amerigroup covers ABA under CG-BEH-02, its adaptive behavioral treatment guideline, aligned to the Georgia DCH ASD manual and subject to prior authorization and medical-necessity review. Because the published version is dated 2017/2018 and likely superseded, treat the linked guideline as a starting point and confirm the current requirements on the Amerigroup provider portal before relying on any specific rule.',
        ],
      },
    ],
    collect: [
      { title: 'Amerigroup member ID', desc: 'Confirm the plan and current CMO status at intake.' },
      { title: 'DSM-5 ASD diagnosis', desc: 'Per the DCH manual criteria the guideline aligns to.' },
      { title: 'Medical-necessity documentation', desc: 'Required for the prior-authorization request.' },
      { title: 'Plan of Care', desc: 'Measurable, baseline-anchored goals consistent with the DCH manual.' },
    ],
    sources: [
      { title: 'Amerigroup — Adaptive Behavioral Treatment for ASD (CG-BEH-02, GA Medicaid)', url: 'https://provider.amerigroup.com/docs/gpp/GA_CAID_UMGuideline_AdaptiveBehavioralTreatmentAutismSpectrumDisorder.pdf?v=202101081602' },
      { title: 'GA DCH — Part II ASD Policy Manual', url: 'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download' },
    ],
    faq: [
      { q: 'Does Amerigroup Georgia cover ABA therapy?', a: 'Yes — Amerigroup administers the Georgia Medicaid ABA benefit under its CG-BEH-02 adaptive behavioral treatment guideline, aligned to the DCH ASD manual, with prior authorization and medical-necessity review.' },
      { q: 'Is Amerigroup\'s Georgia ABA guideline current?', a: 'The publicly available version is dated 2017/2018 and is likely superseded. Verify the current guideline on the Amerigroup provider portal before relying on specific requirements.' },
    ],
  },

  'aetna-georgia': {
    slug: 'aetna-georgia',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes \u2014 ASD only (F84.0\u2013F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Georgia',
    state: 'GA', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Georgia',
    h1: 'Aetna ABA coverage in Georgia: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Georgia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Georgia families — the national clinical policy, prior authorization, the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate (ages, caps, exemptions), Georgia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Georgia, a Aetna card means three layers at once: the carrier\'s national clinical policy, Georgia\'s autism insurance mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'O.C.G.A. § 33-24-59.10 (Ava’s Law)' },
      { label: 'Mandate age', value: 'Age 20 and under (mandate); parity may extend in practice' },
      { label: 'Mandate caps', value: '$35,000/yr nominal ABA cap; no visit limits allowed' },
      { label: 'Exempt from mandate', value: '≤10-employee groups; self-funded ERISA plans' },
      { label: 'Licensure', value: 'Licensed Behavior Analyst (GA Behavior Analyst Licensing Board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Georgia',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Georgia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Georgia.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Georgia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. The statute exempts employers with 10 or fewer employees, and insurers can seek a one-year opt-out if an actuary certifies the mandate raises average premiums more than 1%. Self-funded ERISA plans are exempt by federal preemption. Federal mental-health parity (MHPAEA) generally makes the dollar and age caps hard to enforce against covered large-group plans — a payer applying the $35K cap to a large-group member is a red flag to escalate, not accept.',
        ],
        cites: [
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No Georgia-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Georgia-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Georgia-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Georgia',
        body: [
          'Georgia now licenses behavior analysts: HB 412 (2022) created the Georgia Behavior Analyst Licensing Board under the Secretary of State, with licensure built on BCBA certification. Confirm your supervising analysts hold the Georgia license when credentialing with any commercial plan. On rates: Aetna does not publish commercial ABA fee schedules for Georgia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Georgia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Georgia\'s mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Georgia autism mandate require?', a: 'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Georgia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Georgia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-georgia': {
    slug: 'cigna-georgia',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes \u2014 ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Georgia',
    state: 'GA', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Georgia',
    h1: 'Cigna / Evernorth ABA coverage in Georgia: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Georgia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Georgia families — the national clinical policy, prior authorization, the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate (ages, caps, exemptions), Georgia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Georgia, a Cigna card means three layers at once: the carrier\'s national clinical policy, Georgia\'s autism insurance mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'O.C.G.A. § 33-24-59.10 (Ava’s Law)' },
      { label: 'Mandate age', value: 'Age 20 and under (mandate); parity may extend in practice' },
      { label: 'Mandate caps', value: '$35,000/yr nominal ABA cap; no visit limits allowed' },
      { label: 'Exempt from mandate', value: '≤10-employee groups; self-funded ERISA plans' },
      { label: 'Licensure', value: 'Licensed Behavior Analyst (GA Behavior Analyst Licensing Board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Georgia',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Georgia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Georgia.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Georgia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. The statute exempts employers with 10 or fewer employees, and insurers can seek a one-year opt-out if an actuary certifies the mandate raises average premiums more than 1%. Self-funded ERISA plans are exempt by federal preemption. Federal mental-health parity (MHPAEA) generally makes the dollar and age caps hard to enforce against covered large-group plans — a payer applying the $35K cap to a large-group member is a red flag to escalate, not accept.',
        ],
        cites: [
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No Georgia-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no Georgia-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Georgia-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Georgia',
        body: [
          'Georgia now licenses behavior analysts: HB 412 (2022) created the Georgia Behavior Analyst Licensing Board under the Secretary of State, with licensure built on BCBA certification. Confirm your supervising analysts hold the Georgia license when credentialing with any commercial plan. On rates: Cigna does not publish commercial ABA fee schedules for Georgia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Georgia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Georgia\'s mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Georgia autism mandate require?', a: 'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Georgia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Georgia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-georgia': {
    slug: 'unitedhealthcare-georgia',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Georgia',
    state: 'GA', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Georgia',
    h1: 'UnitedHealthcare / Optum ABA coverage in Georgia: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Georgia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Georgia families — the national clinical policy, prior authorization, the O.C.G.A. § 33-24-59.10 (Ava’s Law) mandate (ages, caps, exemptions), Georgia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Georgia, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Georgia\'s autism insurance mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'O.C.G.A. § 33-24-59.10 (Ava’s Law)' },
      { label: 'Mandate age', value: 'Age 20 and under (mandate); parity may extend in practice' },
      { label: 'Mandate caps', value: '$35,000/yr nominal ABA cap; no visit limits allowed' },
      { label: 'Exempt from mandate', value: '≤10-employee groups; self-funded ERISA plans' },
      { label: 'Licensure', value: 'Licensed Behavior Analyst (GA Behavior Analyst Licensing Board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Georgia',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Georgia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Georgia.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Georgia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. The statute exempts employers with 10 or fewer employees, and insurers can seek a one-year opt-out if an actuary certifies the mandate raises average premiums more than 1%. Self-funded ERISA plans are exempt by federal preemption. Federal mental-health parity (MHPAEA) generally makes the dollar and age caps hard to enforce against covered large-group plans — a payer applying the $35K cap to a large-group member is a red flag to escalate, not accept.',
        ],
        cites: [
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No Georgia-specific UnitedHealthcare policy exists',
        body: [
          'We checked: UnitedHealthcare / Optum publishes no Georgia-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Georgia-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Georgia',
        body: [
          'Georgia now licenses behavior analysts: HB 412 (2022) created the Georgia Behavior Analyst Licensing Board under the Secretary of State, with licensure built on BCBA certification. Confirm your supervising analysts hold the Georgia license when credentialing with any commercial plan. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Georgia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Georgia Code § 33-24-59.10 (Ava\'s Law)', url: 'https://codes.findlaw.com/ga/title-33-insurance/ga-code-sect-33-24-59-10/' },
      { title: 'Autism Speaks — Georgia state-regulated coverage', url: 'https://www.autismspeaks.org/georgia-state-regulated-insurance-coverage' },
      { title: 'Georgia Association for Behavior Analysis — licensure (HB 412)', url: 'https://www.georgia-aba.org/licensure' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Georgia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Georgia\'s mandate (O.C.G.A. § 33-24-59.10 (Ava’s Law)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Georgia autism mandate require?', a: 'Ava’s Law requires state-regulated accident and sickness plans (including the state employee health plan) to cover ASD treatment for individuals 20 years of age or under, with ABA nominally cappable at $35,000 per year — and no limits allowed on the number of visits. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Georgia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Georgia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
