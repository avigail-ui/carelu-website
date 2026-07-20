import type { PayerConfig } from './types';

export const massachusettsPayers: Record<string, PayerConfig> = {
  'masshealth-massachusetts-medicaid': {
    slug: 'masshealth-massachusetts-medicaid',
    cardDesc: 'EPSDT under 21, no caps, 100% managed-care ABA via six BH administrators; 1:10 audit live.',
    assessmentPA: 'Required — the MA Standard ABA PA Form has a distinct "Request for initial evaluation"; PA is required for all ABA services/hours/units',
    treatmentPA: 'Required — all treatment hours/units; continued-service authorizations in up to 6-month periods, submitted to the member\'s plan\'s BH administrator',
    dxRequired: 'Yes — ASD via a comprehensive DSM-aligned assessment by a qualified licensed diagnostician; from 1/1/2026 also sole-diagnosis Down syndrome (genetic-testing confirmed)',
    payer: 'MassHealth (Massachusetts Medicaid)',
    state: 'MA', kind: 'state-medicaid',
    pill: 'Payer Guide · MassHealth',
    h1: 'MassHealth (Massachusetts Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'MassHealth ABA Coverage, Rates & Prior Authorization Guide | Carelu',
    metaDescription:
      'How MassHealth covers ABA under EPSDT — the six behavioral-health administrators (MBHP, Carelon, Tufts, Optum), the Massachusetts Standard ABA PA Form, 101 CMR 358 rates and the 2026 rate freeze, the 1:10 supervision audit, and the new Down syndrome pathway.',
    intro: [
      'MassHealth covers ABA for members under 21 through the EPSDT benefit — with no annual or lifetime dollar or unit caps — and administers it entirely through managed care. There is no fee-for-service ABA front door: MassHealth sets the rates (101 CMR 358) and the benefit is authorized by six behavioral-health administrators across the plan landscape — MBHP (a Carelon company), Carelon itself for the WellSense and Fallon plans, Tufts Health Together\'s internal UM, and Optum for Mass General Brigham Health Plan. Which administrator a family\'s plan routes to is the first fact intake needs, because it decides the form, the portal, and — as of 2026 — how hard the state\'s 1:10 supervision-ratio audit lands on your claims.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21 (Standard/CommonHealth) via EPSDT; under 19 on Family Assistance' },
      { label: 'Annual limit', value: 'None — no dollar or unit-of-service caps; EPSDT medical necessity governs' },
      { label: 'Prior auth', value: 'Required for all ABA services/hours/units — assessment and treatment alike' },
      { label: 'Auth periods', value: 'Up to 6 months (standard form); initial-evaluation requests may cover 3 months' },
      { label: 'Rates (per 15 min)', value: '97153 $16.37 · 97151/97155/97156 $30.73 · 97154 $13.91 (101 CMR 358)' },
      { label: 'Administered by', value: 'Six BH administrators: MBHP, Carelon (WellSense/Fallon), Tufts internal UM, Optum (MGB), plus Fallon & HNE as plans' },
      { label: 'Supervision watch', value: 'CY2024 audit enforces a 1:10 97155:97153 floor — recoupment letters issued Feb–Mar 2026' },
    ],
    sections: [
      {
        h2: 'Coverage & benefit',
        body: [
          'ABA is an EPSDT service for MassHealth Standard and CommonHealth members under 21 (under 19 on Family Assistance), with coverage driven by medical necessity — no annual or lifetime dollar caps, no unit-of-service limits. Historically the diagnosis gate was autism: a comprehensive assessment aligned with DSM criteria across the core ASD deficits, completed by a licensed physician, APRN, physician assistant, or psychologist experienced in ASD diagnosis and treatment. Effective January 1, 2026, Chapter 388 of the Acts of 2024 opens a second pathway: ABA for a primary, sole diagnosis of Down syndrome (Trisomy 21) confirmed by genetic testing — the standard PA form already carries the Down syndrome checkbox. One boundary for the youngest referrals: ABA cannot duplicate services the child already receives through Early Intervention.',
        ],
        cites: [
          { title: 'AIRC — MassHealth ABA Coverage factsheet', url: 'https://massairc.org/factsheets/masshealth-aba-coverage/' },
          { title: 'The Arc of Massachusetts — ABA for Down syndrome expansion (eff. 1/1/2026)', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
          { title: 'MA Standard ABA PA Form (MassHealth version, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
        ],
      },
      {
        h2: 'Six administrators, one benefit',
        body: [
          'MassHealth managed care is a lattice of 15 Accountable Care Partnership Plans, 2 Primary Care ACOs, 2 MCOs, and the PCC Plan (roster per the April 2023 state deck; the current lineup — including Steward Health Choice\'s status after Steward\'s collapse — should be re-verified). What matters operationally is who authorizes ABA: PCC Plan, Primary Care ACO, and Health New England BeHealthy members route to MBHP; WellSense\'s plans and Fallon\'s ACPPs route to Carelon; Tufts Health Together runs its own internal UM; and Mass General Brigham Health Plan routes to Optum. Nearly all of them use the multi-payer Massachusetts Standard ABA PA Form — request types for initial evaluation, initial services, continued services, and amendments, completed by the LABA rendering or supervising services, with continued authorizations capped at 6 months. The one defector: as of October 2025, Tufts Health Together uses Point32Health\'s own updated ABA PA form instead of the state standard form — so "which plan?" also decides "which form?".',
        ],
        cites: [
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
          { title: 'MA Standard ABA PA Form (MassHealth version, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
          { title: 'Point32Health — ABA policy and coverage updates (Oct 2025)', url: 'https://www.point32health.org/provider/applied-behavioral-analysis-policy-and-coverage-updates-102025' },
        ],
      },
      {
        h2: 'The 1:10 supervision audit — active enforcement risk',
        body: [
          'MassHealth audited CY2024 encounter data across all six ABA-administering plans and, via Carelon, issued recoupment letters in February–March 2026 enforcing a minimum 1:10 supervision ratio — one hour of protocol modification (97155) for every ten hours of direct treatment (97153). Ratios of 10:1 to 19:1 drew partial recoupment; 20:1 and beyond drew full recoupment of direct-service payments. A provider coalition (MPAAQ, MassABA, BABAT) is disputing the methodology and litigation has been threatened — but until that resolves, treat 1:10 as the operating floor. The intake and staffing implication is concrete: every ten hours of weekly 97153 you promise a family carries an hour of BCBA/LABA supervision your schedule must actually deliver, so capacity planning — not just authorization — is what keeps the revenue.',
        ],
        cites: [
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
      {
        h2: 'Rates: single-tier, and frozen',
        body: [
          '101 CMR 358.03 pays a single rate per code — no credential-tier modifiers; each rate is "full compensation" including necessary administration and professional supervision. Per 15-minute unit: 97151, 97155, and 97156 at $30.73; 97153 at $16.37 (about $65.48/hour); 97154 at $13.91; 97157 at $26.12 — effective September 27, 2024 (published as the October 1, 2024 schedule). EOHHS has proposed re-adopting these rates unchanged effective December 1, 2026 — a rate freeze providers are contesting, noting 97153 at ~$65/hour trails states like Arizona (~$88) and Maryland (~$83). MCEs generally pay at or near this schedule, but plan contracts govern — whether a given plan pays exactly the schedule is a contracting question, not a lookup.',
        ],
        cites: [
          { title: '101 CMR 358.03 Rate Provisions (Cornell LII mirror)', url: 'https://www.law.cornell.edu/regulations/massachusetts/101-CMR-358-03' },
          { title: 'MassHealth ABA rate freeze — 101 CMR 358 re-adoption (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-reimbursement-rate-freeze-101-cmr-358/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan → BH administrator', desc: 'PCC/ACO/HNE → MBHP; WellSense/Fallon → Carelon; Tufts Together → Point32 internal; MGB → Optum. It decides the form and portal.' },
      { title: 'Diagnosis + diagnostic report', desc: 'Comprehensive DSM-aligned ASD evaluation by a qualified licensed diagnostician — or, from 1/1/2026, genetic-testing confirmation of Down syndrome.' },
      { title: 'MassHealth plan type + age', desc: 'Standard/CommonHealth covers under 21; Family Assistance under 19 — the EPSDT clock differs.' },
      { title: 'LABA on the case', desc: 'The standard PA form is completed by the LABA rendering or supervising services — name one before submission.' },
      { title: 'Early Intervention status', desc: 'For under-3s: ABA can\'t duplicate EI services — map what EI already delivers.' },
    ],
    sources: [
      { title: '101 CMR 358.00 — Rates for Applied Behavior Analysis (official regulation page)', url: 'https://www.mass.gov/regulations/101-CMR-35800-rates-of-payment-for-applied-behavior-analysis-0' },
      { title: '101 CMR 358.03 Rate Provisions (Cornell LII mirror)', url: 'https://www.law.cornell.edu/regulations/massachusetts/101-CMR-358-03' },
      { title: 'MassHealth ABA Provider FAQ (mass.gov)', url: 'https://www.mass.gov/doc/applied-behavioral-analysis-provider-frequently-asked-questions/download' },
      { title: 'MA Standard ABA PA Form (MassHealth version, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
      { title: 'AIRC — MassHealth ABA Coverage factsheet', url: 'https://massairc.org/factsheets/masshealth-aba-coverage/' },
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
      { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
      { title: 'MassHealth ABA rate freeze — 101 CMR 358 re-adoption (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-reimbursement-rate-freeze-101-cmr-358/' },
    ],
    faq: [
      { q: 'Does MassHealth cover ABA therapy?', a: 'Yes — for members under 21 (under 19 on Family Assistance) through EPSDT, with no annual or lifetime dollar or unit caps. Prior authorization is required for all ABA services, submitted to the behavioral-health administrator behind the member\'s plan.' },
      { q: 'Is an autism diagnosis required for MassHealth ABA?', a: 'Historically yes — a comprehensive DSM-aligned assessment by a qualified licensed diagnostician. Effective January 1, 2026, Chapter 388 of the Acts of 2024 adds a second pathway: a sole diagnosis of Down syndrome confirmed by genetic testing.' },
      { q: 'What does MassHealth pay for ABA?', a: 'Single-tier rates per 101 CMR 358.03: 97153 at $16.37 per 15-minute unit (~$65/hour), 97151/97155/97156 at $30.73, 97154 at $13.91 — effective since late September 2024, with an unchanged re-adoption proposed through December 2026. Plans generally pay at or near this schedule, but contracts govern.' },
      { q: 'What is the MassHealth 1:10 supervision rule?', a: 'MassHealth\'s CY2024 audit enforced a minimum one hour of 97155 supervision per ten hours of 97153 direct treatment; ratios above that drew partial or full recoupment (letters issued Feb–Mar 2026, currently disputed by provider groups). Staff and schedule to at least 1:10.' },
    ],
  },

  'mbhp-massachusetts': {
    slug: 'mbhp-massachusetts',
    cardDesc: 'The biggest MA ABA gatekeeper: PCC Plan + Primary Care ACOs + HNE, Carelon-run, standard form.',
    assessmentPA: 'Required — Massachusetts Standard ABA PA Form process; submissions via Carelon\'s ProviderConnect portal',
    treatmentPA: 'Required — 6-month authorization periods, per the state standard-form process',
    dxRequired: 'Yes — ASD via comprehensive DSM-aligned assessment; from 1/1/2026 also sole-diagnosis Down syndrome (state baseline)',
    payer: 'Massachusetts Behavioral Health Partnership (MBHP)',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · MBHP (Carelon)',
    h1: 'MBHP ABA coverage (MassHealth behavioral-health administrator).',
    metaTitle: 'MBHP (MassHealth) ABA Coverage & Prior Authorization | Carelu',
    metaDescription:
      'How MBHP — a Carelon Behavioral Health company — administers MassHealth ABA for the PCC Plan, Primary Care ACOs, and HNE\'s BeHealthy Partnership: the standard PA form, ProviderConnect submission, 6-month auths, and the 2026 supervision-ratio recoupments.',
    intro: [
      'The Massachusetts Behavioral Health Partnership (MBHP), a Carelon Behavioral Health company, is MassHealth\'s contracted behavioral-health vendor — and the single biggest ABA gatekeeper in the state. It authorizes ABA for everyone not in an MCO or ACPP (the PCC Plan and the Primary Care ACOs) plus Health New England\'s BeHealthy Partnership plan. Clinically it is the state baseline: Massachusetts Medical Necessity Criteria, the standard PA form, 6-month authorizations. The reason to read it closely in 2026: Carelon, MBHP\'s parent, is the entity that executed MassHealth\'s supervision-ratio recoupments.',
    ],
    atGlance: [
      { label: 'Role', value: 'BH carve-out administrator: PCC Plan, Primary Care ACOs, HNE BeHealthy' },
      { label: 'Clinical rules', value: 'Massachusetts Medical Necessity Criteria (Carelon/MBHP) — state baseline' },
      { label: 'Prior auth', value: 'Required — MA Standard ABA PA Form; 6-month periods' },
      { label: 'Submission', value: 'ProviderConnect at providers.masspartnership.com; phone 1-800-495-0086' },
      { label: 'Hour caps', value: 'None published — medical necessity based' },
      { label: 'Supervision watch', value: 'Carelon executed the 2026 1:10 recoupments — expect strict 97155:97153 scrutiny' },
    ],
    sections: [
      {
        h2: 'How MBHP runs the benefit',
        body: [
          'MBHP essentially is the state program: it applies MassHealth\'s criteria and the multi-payer Massachusetts Standard ABA PA Form — initial evaluation, initial services, continued services, and amendment request types, completed by the LABA rendering or supervising services — with authorizations in up to 6-month periods. Submissions run through Carelon\'s ProviderConnect portal (providers.masspartnership.com); the provider line is 1-800-495-0086, and Carelon\'s Massachusetts forms-and-guides library holds the current documents. No hour caps are published — requests stand on medical necessity. Note the state\'s own ABA performance-specification document sits behind the provider portal, so onboarding should pull it from ProviderConnect directly.',
        ],
        cites: [
          { title: 'Carelon Behavioral Health — Massachusetts forms & guides', url: 'https://www.carelonbehavioralhealth.com/providers/forms-and-guides/ma' },
          { title: 'MA Standard ABA PA Form (MassHealth version, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
        ],
      },
      {
        h2: 'The Carelon audit connection',
        body: [
          'When MassHealth enforced its CY2024 supervision-ratio audit — the 1:10 floor of 97155 to 97153, with recoupment letters in February–March 2026 — Carelon was the administrator that ran the analysis and issued the letters. For practices billing MBHP that means the scrutiny is not hypothetical: keep the supervision hours on the schedule and in the claims at 1:10 or better, and reconcile 97155-to-97153 ratios monthly rather than discovering them in a recoupment letter. Member routing and find-a-provider run through masspartnership.com, which also makes MBHP a referral source worth being listed with.',
        ],
        cites: [
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
    ],
    collect: [
      { title: 'Confirm MBHP routing', desc: 'PCC Plan, a Primary Care ACO, or HNE BeHealthy on the card → the auth goes to MBHP, not the plan.' },
      { title: 'Diagnostic evaluation', desc: 'Comprehensive DSM-aligned ASD assessment (or the Down syndrome genetic-testing pathway from 1/1/2026) — attaches to the standard form.' },
      { title: 'LABA of record', desc: 'The standard form is completed by the rendering or supervising LABA.' },
      { title: 'Supervision capacity', desc: 'Confirm your BCBA/LABA schedule supports ≥1:10 97155:97153 before promising weekly hours.' },
    ],
    sources: [
      { title: 'MBHP provider portal — ProviderConnect (Getting Started)', url: 'https://providers.masspartnership.com/provider/GettingStarted.html' },
      { title: 'Carelon Behavioral Health — Massachusetts forms & guides', url: 'https://www.carelonbehavioralhealth.com/providers/forms-and-guides/ma' },
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
      { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
    ],
    faq: [
      { q: 'Who does MBHP cover for ABA?', a: 'MassHealth members on the PCC Plan and the Primary Care ACOs, plus Health New England\'s BeHealthy Partnership — everyone whose plan doesn\'t bring its own BH administrator. It applies the state-baseline criteria and the Massachusetts Standard ABA PA Form.' },
      { q: 'How do I submit an ABA authorization to MBHP?', a: 'Through Carelon\'s ProviderConnect portal at providers.masspartnership.com, using the Massachusetts Standard ABA PA Form; authorizations run in up to 6-month periods. Provider line: 1-800-495-0086.' },
      { q: 'Does MBHP pay the 101 CMR 358 rates?', a: 'The state schedule is the reference baseline, but whether MBHP pays exactly those rates is a contract question — verify in your MBHP agreement.' },
    ],
  },

  'wellsense-massachusetts': {
    slug: 'wellsense-massachusetts',
    cardDesc: 'Largest ACPP footprint (8 of 15) + Essential MCO; Carelon UM, hosts the standard form.',
    assessmentPA: 'Required — "Request for initial evaluation" on the standard form with the comprehensive diagnostic assessment attached; initial requests cover a 3-month timeframe',
    treatmentPA: 'Required — continued services in 6-month timeframes; submit pages 1–7 of the standard form (portal or fax 857-264-2673)',
    dxRequired: 'Yes — ASD via comprehensive DSM-aligned assessment; the plan\'s form also carries the 1/1/2026 Down syndrome pathway',
    payer: 'WellSense Health Plan',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · WellSense',
    h1: 'WellSense Health Plan ABA coverage (MassHealth MCO + ACPPs).',
    metaTitle: 'WellSense Health Plan (MassHealth) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How WellSense (formerly BMC HealthNet) administers MassHealth ABA across its Essential MCO and eight ACPPs — Carelon behavioral-health UM, the Massachusetts Standard ABA PA Form it hosts, 3-month initial and 6-month continued authorizations.',
    intro: [
      'WellSense Health Plan (formerly BMC HealthNet) carries the largest ACPP footprint in Massachusetts — eight of the fifteen Accountable Care Partnership Plans, from Boston ACO to Southcoast — plus the WellSense Essential MCO. That makes it, alongside MBHP, one of the two highest-volume MassHealth ABA payers. Clinically it is the state baseline: behavioral health runs through Carelon, requests ride the Massachusetts Standard ABA PA Form (WellSense hosts the current version), and no plan-specific caps exist. The plan-specific layer is mechanics: portal, fax, and the 3-month initial / 6-month continued cadence spelled out on its form.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'MassHealth MCO (WellSense Essential) + 8 ACPPs' },
      { label: 'Clinical rules', value: 'State baseline — standard form + InterQual criteria + BH performance specs' },
      { label: 'BH administrator', value: 'Carelon Behavioral Health' },
      { label: 'Prior auth', value: 'Required — initial requests 3 months; continued services 6 months' },
      { label: 'Submission', value: 'HealthTrio Connect portal; ABA PA fax 857-264-2673' },
      { label: 'Hour caps', value: 'None published — medical necessity based' },
    ],
    sections: [
      {
        h2: 'How WellSense runs ABA authorization',
        body: [
          'ABA for WellSense\'s MassHealth plans is authorized by Carelon Behavioral Health on the Massachusetts Standard ABA PA Form — WellSense hosts the current MassHealth version (updated March 12, 2026), which already includes the Down syndrome pathway effective January 1, 2026 and doubles for its Clarity commercial product. Initial-evaluation requests check the dedicated box and attach the comprehensive diagnostic evaluation, with initial requests covering a 3-month timeframe; continued-services requests come in 6-month timeframes, submitting pages 1–7 of the form. Channels: the HealthTrio Connect portal, or ABA PA fax 857-264-2673. One paper-trail note: WellSense\'s medical PA matrix (effective 7/1/2026) doesn\'t list ABA codes at all — that\'s not an exemption; behavioral services route through the BH performance specs and the Carelon process instead.',
        ],
        cites: [
          { title: 'WellSense ABA PA Form (MassHealth, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
          { title: 'WellSense Prior Authorization Matrix (eff. 7/1/2026)', url: 'https://www.wellsense.org/hubfs/Provider/Prior%20Authorization/MA_Prior_Auth_Matrix.pdf' },
        ],
      },
      {
        h2: 'What the footprint means for intake',
        body: [
          'A family may name their ACO — Boston Children\'s ACO, Mercy, Signature, Tufts Medicine Care Alliance — without ever saying "WellSense," so intake should map ACPP names to the WellSense/Carelon flow rather than treating each as a separate payer. All eight ACPPs plus the Essential MCO run the same ABA machinery. And because WellSense sits in the Carelon UM universe, the 2026 statewide supervision-ratio enforcement applies here as everywhere: keep 97155 supervision at or above 1:10 against 97153 direct-treatment hours.',
        ],
        cites: [
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
    ],
    collect: [
      { title: 'ACPP name → WellSense', desc: 'Eight ACPPs plus Essential all route to the same Carelon/standard-form flow — map the plan name at intake.' },
      { title: 'Comprehensive diagnostic evaluation', desc: 'Attaches to the initial-evaluation request; the form also takes the Down syndrome genetic-testing pathway from 1/1/2026.' },
      { title: 'Pages 1–7, complete', desc: 'Continued-services submissions are pages 1–7 of the standard form — incomplete packets stall the 6-month clock.' },
      { title: 'Timeline expectations', desc: 'Initial authorizations cover 3 months; continued run 6 — plan reassessment touchpoints accordingly.' },
    ],
    sources: [
      { title: 'WellSense ABA PA Form (MassHealth, upd. 3/12/2026)', url: 'https://www.wellsense.org/hubfs/Forms/Provider_Forms/Applied_Behavioral_Analysis_Prior_Authorization_Form_MassHealth.pdf' },
      { title: 'WellSense Prior Authorization Matrix (eff. 7/1/2026)', url: 'https://www.wellsense.org/hubfs/Provider/Prior%20Authorization/MA_Prior_Auth_Matrix.pdf' },
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
    ],
    faq: [
      { q: 'Does WellSense cover ABA therapy?', a: 'Yes — across the WellSense Essential MCO and its eight MassHealth ACPPs, on the state-baseline benefit: EPSDT under 21, no caps, PA on all services via Carelon Behavioral Health and the Massachusetts Standard ABA PA Form.' },
      { q: 'How do I submit an ABA authorization to WellSense?', a: 'Via the HealthTrio Connect portal or ABA PA fax 857-264-2673, using the standard form — initial-evaluation requests attach the diagnostic evaluation and cover 3 months; continued services submit pages 1–7 in 6-month timeframes.' },
      { q: 'Why isn\'t ABA on WellSense\'s prior-authorization matrix?', a: 'Because the matrix covers medical services — ABA routes through the behavioral-health performance specifications and the Carelon process. PA is still required for all ABA services.' },
    ],
  },

  'tufts-health-together': {
    slug: 'tufts-health-together',
    cardDesc: 'The defector: Point32\'s own PA form (not the state form), InterQual SmartSheets, accreditation gate.',
    assessmentPA: 'Required — via Point32Health UM on the plan\'s own updated ABA PA form (not the MA standard form)',
    treatmentPA: 'Required — Point32Health\'s own ABA PA form, submitted electronically with the form uploaded, or fax 888-977-0776',
    dxRequired: 'Yes — ASD; covers sole-diagnosis Down syndrome effective 1/1/2026 (incl. Tufts Health Together)',
    payer: 'Tufts Health Together (Point32Health)',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · Tufts Health Together',
    h1: 'Tufts Health Together ABA coverage (MassHealth MCO).',
    metaTitle: 'Tufts Health Together (MassHealth) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Tufts Health Together (Point32Health) administers MassHealth ABA — the only plan family with self-managed behavioral health: its own ABA PA form instead of the state standard form, InterQual SmartSheets, a new medical-necessity guideline effective 1/1/2026, and an ABA accreditation requirement.',
    intro: [
      'Tufts Health Together — Point32Health\'s MassHealth MCO, plus two ACPPs with Cambridge Health Alliance and UMass Memorial Health — is the only MassHealth plan family that self-manages behavioral health. No Carelon, no Optum: Point32Health\'s internal UM reviews ABA against its own medical-necessity guideline using InterQual criteria and SmartSheets. The operational headline for intake: as of the October 2025 update, Tufts Health Together members use Point32Health\'s own updated ABA PA form, not the Massachusetts standard form every other administrator takes. Same no-cap MassHealth benefit — distinct machinery.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'MassHealth MCO + 2 ACPPs (Cambridge Health Alliance, UMass Memorial)' },
      { label: 'BH administrator', value: 'Internal — Point32Health UM (no external BH vendor)' },
      { label: 'PA form', value: 'Point32Health\'s OWN ABA PA form — NOT the MA standard form (as of Oct 2025)' },
      { label: 'Clinical criteria', value: 'Point32Health ABA MNG; InterQual + SmartSheets; new MNG effective 1/1/2026' },
      { label: 'Submission', value: 'Electronic with form uploaded, or precert fax 888-977-0776' },
      { label: 'Network gate', value: 'ABA provider accreditation requirement rolling out (nationally recognized accrediting body)' },
    ],
    sections: [
      {
        h2: 'The Point32 machinery',
        body: [
          'Per the October 2025 provider update, Tufts Health Together adopted InterQual criteria with InterQual SmartSheets for ABA prior-authorization review, with a new ABA medical-necessity guideline effective January 1, 2026 — and moved members onto Point32Health\'s own updated ABA PA form. Requests submit electronically with the form uploaded, or by fax to 888-977-0776. For a practice running one MA workflow, this is the exception to build: a Tufts Together family means the Point32 form and the Point32 portal, and a standard-form packet sent here is a bounce. The benefit itself matches the state baseline — no published hour caps, and sole-diagnosis Down syndrome coverage effective January 1, 2026 explicitly includes Tufts Health Together.',
        ],
        cites: [
          { title: 'Point32Health — ABA policy and coverage updates (Oct 2025)', url: 'https://www.point32health.org/provider/applied-behavioral-analysis-policy-and-coverage-updates-102025' },
        ],
      },
      {
        h2: 'Two gates beyond the auth',
        body: [
          'Point32Health is rolling out an ABA provider accreditation requirement — accreditation by a nationally recognized ABA accrediting body — across its Harvard Pilgrim and Tufts Health Plan products, making accreditation a network-participation gate, not a quality nicety. Budget the accreditation timeline into any Tufts network strategy. Worth knowing on the enforcement front: Point32Health formally disputed MassHealth\'s 2026 ABA supervision-audit methodology (February 9, 2026) — but the statewide 1:10 expectation still makes supervision staffing the safe operating assumption.',
        ],
        cites: [
          { title: 'Point32Health — ABA policy and coverage updates (Oct 2025)', url: 'https://www.point32health.org/provider/applied-behavioral-analysis-policy-and-coverage-updates-102025' },
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
    ],
    collect: [
      { title: 'The RIGHT form', desc: 'Tufts Health Together takes Point32Health\'s own ABA PA form — not the MA standard form. Flag it in your intake workflow.' },
      { title: 'ACPP mapping', desc: 'Cambridge Health Alliance and UMass Memorial ACPP members are Tufts Together — route to Point32, not Carelon.' },
      { title: 'Diagnostic evaluation', desc: 'ASD assessment — or the Down syndrome pathway from 1/1/2026, which Point32 confirms includes this plan.' },
      { title: 'Accreditation status', desc: 'Point32\'s ABA accreditation requirement is a network gate — check where your organization stands before quoting start dates.' },
    ],
    sources: [
      { title: 'Point32Health — ABA policy and coverage updates (Oct 2025)', url: 'https://www.point32health.org/provider/applied-behavioral-analysis-policy-and-coverage-updates-102025' },
      { title: 'Tufts Health Together ABA Medical Necessity Guideline (PDF)', url: 'https://www.point32health.org/provider/wp-content/uploads/sites/2/2024/11/ABA-THP-Together.MNG_.pdf' },
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
    ],
    faq: [
      { q: 'Does Tufts Health Together cover ABA?', a: 'Yes — the MassHealth EPSDT benefit with no published hour caps, reviewed by Point32Health\'s internal UM against its own medical-necessity guideline (InterQual + SmartSheets; new MNG effective 1/1/2026).' },
      { q: 'Does Tufts Health Together use the Massachusetts standard ABA form?', a: 'No — as of the October 2025 update, members use Point32Health\'s own updated ABA PA form, submitted electronically with the form uploaded or faxed to 888-977-0776. It\'s the one MassHealth plan family where the standard form doesn\'t apply.' },
      { q: 'What is Point32Health\'s ABA accreditation requirement?', a: 'A rolling network-participation requirement that ABA providers hold accreditation from a nationally recognized ABA accrediting body, across Harvard Pilgrim and Tufts Health Plan products — treat it as a contracting prerequisite.' },
    ],
  },

  'fallon-health-massachusetts': {
    slug: 'fallon-health-massachusetts',
    cardDesc: 'Three ACPPs (2023 roster), Carelon-run BH, state-baseline rules; first-wave audit recoupments.',
    assessmentPA: 'Required — via the Carelon process on the MA standard form; plan-level specifics not published, verify with Carelon',
    treatmentPA: 'Required — 6-month authorization periods (per statewide practice), via Carelon',
    dxRequired: 'Yes — ASD via comprehensive DSM-aligned assessment; from 1/1/2026 also sole-diagnosis Down syndrome (state baseline)',
    payer: 'Fallon Health (MassHealth ACPPs)',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · Fallon Health',
    h1: 'Fallon Health ABA coverage (MassHealth ACPPs).',
    metaTitle: 'Fallon Health (MassHealth) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Fallon Health\'s MassHealth ACPPs handle ABA — behavioral health through Carelon on the state-baseline criteria and standard form, 6-month authorizations, and Fallon\'s place in the 2026 supervision-ratio audit.',
    intro: [
      'Fallon Health fields Accountable Care Partnership Plans in central and western Massachusetts — three as of the April 2023 state roster (Fallon 365 Care with Reliant, Fallon-Atrius, and the Berkshire Fallon Health Collaborative), a lineup worth re-verifying given ownership shifts since. For ABA, Fallon publishes no distinct policy of its own: behavioral health runs through Carelon, on the state-baseline criteria and the Massachusetts Standard ABA PA Form. Fallon\'s plans were among the six in MassHealth\'s 2026 supervision audit and received first-wave recoupment letters.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'MassHealth ACPPs — 3 per the 2023 roster (verify current lineup)' },
      { label: 'BH administrator', value: 'Carelon Behavioral Health' },
      { label: 'Clinical rules', value: 'State baseline — no distinct Fallon ABA policy found' },
      { label: 'Prior auth', value: 'Required — standard-form process; 6-month authorization periods' },
      { label: 'Hour caps', value: 'None published — medical necessity based' },
      { label: 'Supervision watch', value: 'One of the six audited plans; first-wave recoupment letters received' },
    ],
    sections: [
      {
        h2: 'State baseline via Carelon',
        body: [
          'Fallon has no published ABA criteria of its own — its MassHealth plans defer to Carelon\'s UM on the state-baseline rules: PA required for assessment and treatment on the Massachusetts Standard ABA PA Form, authorizations in 6-month periods, no published hour caps, medical necessity per EPSDT. Plan-level submission specifics (including whether Fallon requests route through Carelon\'s ProviderConnect like MBHP\'s) aren\'t published — confirm the channel with Carelon before the first submission rather than assuming the MBHP flow.',
        ],
        cites: [
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
      {
        h2: 'Two verification flags',
        body: [
          'First, the roster: the 2023 ACPP lineup may have shifted — Atrius\'s ownership changes in particular make the Fallon-Atrius entry worth confirming before onboarding a family who names it. Second, the audit: Fallon is named among the six ABA-administering plans in MassHealth\'s CY2024 supervision-ratio audit and received recoupment letters in the first wave, so the 1:10 97155-to-97153 floor applies to Fallon claims with the same force as everywhere in the Carelon universe.',
        ],
        cites: [
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
    ],
    collect: [
      { title: 'Exact plan name', desc: 'Fallon 365 Care, Fallon-Atrius, or Berkshire Fallon — and verify the plan still exists in its 2023 form.' },
      { title: 'Diagnostic evaluation', desc: 'ASD assessment (or Down syndrome genetic-testing pathway from 1/1/2026) for the standard form.' },
      { title: 'Submission channel', desc: 'Confirm the Carelon submission route for Fallon specifically before the first request.' },
      { title: 'Supervision capacity', desc: 'First-wave audit plan — hold the 1:10 97155:97153 ratio in scheduling.' },
    ],
    sources: [
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
      { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
    ],
    faq: [
      { q: 'Does Fallon Health cover ABA?', a: 'Yes — its MassHealth ACPPs carry the state-baseline EPSDT benefit, with behavioral health (including ABA authorization) administered by Carelon on the Massachusetts Standard ABA PA Form in 6-month periods.' },
      { q: 'Does Fallon have its own ABA policy?', a: 'No distinct Fallon ABA criteria are published — it defers to Carelon UM and the state baseline. Confirm submission mechanics with Carelon directly.' },
    ],
  },

  'health-new-england-massachusetts': {
    slug: 'health-new-england-massachusetts',
    cardDesc: 'Western-MA ACPP (BeHealthy Partnership); ABA auth is the MBHP flow, state-baseline rules.',
    assessmentPA: 'Required — via the MBHP process (Massachusetts Standard ABA PA Form)',
    treatmentPA: 'Required — via MBHP; 6-month authorization periods',
    dxRequired: 'Yes — ASD via comprehensive DSM-aligned assessment; from 1/1/2026 also sole-diagnosis Down syndrome (state baseline)',
    payer: 'Health New England — BeHealthy Partnership',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · HNE BeHealthy',
    h1: 'Health New England BeHealthy Partnership ABA coverage (MassHealth ACPP).',
    metaTitle: 'HNE BeHealthy Partnership (MassHealth) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Health New England\'s BeHealthy Partnership (with Baystate Healthcare Alliance) handles MassHealth ABA — behavioral health administered by MBHP, the standard PA form, 6-month authorizations, and the Springfield/Baystate catchment.',
    intro: [
      'Health New England\'s BeHealthy Partnership — its Accountable Care Partnership Plan with Baystate Healthcare Alliance — is the western-Massachusetts entry in the MassHealth landscape, anchored to the Springfield/Baystate systems. For ABA there is one thing to know: HNE doesn\'t run its own behavioral-health UM. The benefit is administered by MBHP (Carelon), meaning a BeHealthy member\'s ABA authorization is the MBHP flow — the state-baseline criteria, the Massachusetts Standard ABA PA Form, ProviderConnect, 6-month periods.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'MassHealth ACPP (with Baystate Healthcare Alliance) — western MA' },
      { label: 'BH administrator', value: 'MBHP (Carelon)' },
      { label: 'Clinical rules', value: 'State baseline via MBHP — no HNE-specific ABA policy' },
      { label: 'Prior auth', value: 'Required — MA Standard ABA PA Form; 6-month periods' },
      { label: 'Submission', value: 'providers.masspartnership.com (the MBHP channel)' },
      { label: 'Supervision watch', value: 'One of the six audited plans; first-wave recoupment letters' },
    ],
    sections: [
      {
        h2: 'The MBHP flow, with an HNE card',
        body: [
          'BeHealthy Partnership members carry an HNE card, but ABA requests go to MBHP: the standard PA form (initial evaluation, initial services, continued services), 6-month authorization periods, submissions through providers.masspartnership.com. No HNE-specific ABA criteria, forms, or hour caps exist — the state baseline governs, including the Down syndrome pathway from January 1, 2026. For intake in the Springfield catchment, the practical takeaway is routing: build the MBHP workflow once and BeHealthy families slot into it.',
        ],
        cites: [
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
        ],
      },
      {
        h2: 'Audit exposure',
        body: [
          'HNE is named among the six ABA-administering plans in MassHealth\'s CY2024 supervision-ratio audit and received first-wave recoupment letters — so BeHealthy claims sit under the same 1:10 97155-to-97153 enforcement as the rest of the MBHP/Carelon universe. Schedule supervision hours accordingly and reconcile the ratio before continuation requests.',
        ],
        cites: [
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
    ],
    collect: [
      { title: 'BeHealthy → MBHP routing', desc: 'The HNE card routes ABA to MBHP — use the ProviderConnect workflow, not an HNE portal.' },
      { title: 'Diagnostic evaluation', desc: 'ASD assessment (or the 1/1/2026 Down syndrome pathway) for the standard form.' },
      { title: 'LABA of record', desc: 'The standard form is completed by the rendering or supervising LABA.' },
      { title: 'Supervision capacity', desc: 'Audited plan — hold ≥1:10 97155:97153 in the schedule.' },
    ],
    sources: [
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
      { title: 'MBHP provider portal — ProviderConnect', url: 'https://providers.masspartnership.com/provider/GettingStarted.html' },
      { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
    ],
    faq: [
      { q: 'Does HNE\'s BeHealthy Partnership cover ABA?', a: 'Yes — the state-baseline MassHealth EPSDT benefit, with behavioral health administered by MBHP (Carelon): standard PA form, 6-month authorizations, no published caps.' },
      { q: 'Where do BeHealthy ABA authorizations go?', a: 'To MBHP, via providers.masspartnership.com — not to Health New England. It\'s the same flow as PCC Plan and Primary Care ACO members.' },
    ],
  },

  'mass-general-brigham-health-plan': {
    slug: 'mass-general-brigham-health-plan',
    cardDesc: 'The Optum-run MassHealth ACPP: BH803ABA state supplement, 30 hr/wk EI cap, codified 1:10 ratio.',
    assessmentPA: 'Required — via the Optum Behavioral Health process (plan-level submission specifics not published; verify via Provider Express)',
    treatmentPA: 'Required — Optum process; 6-month authorization periods per statewide practice',
    dxRequired: 'Yes — ASD via comprehensive DSM-aligned assessment; from 1/1/2026 also sole-diagnosis Down syndrome (state baseline)',
    payer: 'Mass General Brigham Health Plan (MassHealth ACPP)',
    state: 'MA', kind: 'medicaid-mco', parent: 'MassHealth',
    pill: 'Payer Guide · MGB Health Plan',
    h1: 'Mass General Brigham Health Plan ABA coverage (MassHealth ACPP).',
    metaTitle: 'Mass General Brigham Health Plan (MassHealth) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Mass General Brigham Health Plan (formerly AllWays) handles MassHealth ABA — the only plan whose behavioral health runs through Optum, with the BH803ABA state-mandate supplement\'s 30-hour-per-week Early Intervention cap and codified 1:10 supervision ratio.',
    intro: [
      'Mass General Brigham Health Plan (formerly AllWays) fields one ACPP with the Mass General Brigham ACO — and it is the only MassHealth plan whose ABA runs through Optum Behavioral Health. That routes members into Optum\'s clinical machinery: the United Behavioral Health ABA criteria plus Optum\'s ABA State Mandates supplement (BH 803ABA STM12026, effective January 2026), which carries explicit Massachusetts Medicaid provisions. Notably, Optum\'s supplement hard-codes the very 1:10 supervision ratio MassHealth later enforced statewide — and adds a cap no other MA plan publishes: 30 hours per week for Early Intervention members.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'MassHealth ACPP (with the Mass General Brigham ACO)' },
      { label: 'BH administrator', value: 'Optum Behavioral Health — unique among MassHealth plans' },
      { label: 'Clinical rules', value: 'Optum ABA criteria + BH803ABA State Mandates supplement (MA entries)' },
      { label: 'EI cap', value: 'MA Medicaid EI members (eff. 10/1/2021): ABA not to exceed 30 hrs/week' },
      { label: 'Supervision', value: 'BCBA-to-paraprofessional at 1:10 per the Optum supplement — codified, not just audited' },
      { label: 'Prior auth', value: 'Required — assessment and treatment via the Optum process; ~6-month periods' },
    ],
    sections: [
      {
        h2: 'The Optum layer on the MassHealth benefit',
        body: [
          'Optum\'s ABA State Mandates supplement carries a Massachusetts Medicaid entry effective October 1, 2021: for Early Intervention members, ABA services should not exceed 30 hours per week, and BCBA-to-paraprofessional supervision must run at 1:10 — with the supervisor and technician possibly both required to be present during home visits. No cap is stated for non-EI members, where the standard no-cap MassHealth benefit applies. The supplement makes MGB the one MA plan where the 1:10 ratio is written policy rather than audit posture — and in the 2026 statewide audit, Optum had not yet issued recoupment letters as of the March 2026 reporting, though the same analysis was run. Plan your under-3 referrals against the EI cap and the EI non-duplication rule together.',
        ],
        cites: [
          { title: 'Optum ABA State Mandates — BH 803ABA STM12026 (eff. Jan 2026), Massachusetts entries', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
          { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
        ],
      },
      {
        h2: 'Working the Optum channel',
        body: [
          'Because behavioral health is carved to Optum, expect the Optum toolkit — Provider Express is Optum\'s standard portal, though its use for this plan specifically isn\'t published, so confirm the submission channel with the plan before the first request. Authorization cadence follows the statewide practice of roughly 6-month periods. Clinically, requests are reviewed against Optum\'s ABA criteria layered on the MassHealth baseline: EPSDT medical necessity, the DSM-aligned ASD diagnostic gate, and the Down syndrome pathway from January 1, 2026.',
        ],
        cites: [
          { title: 'Optum ABA State Mandates — BH 803ABA STM12026 (eff. Jan 2026), Massachusetts entries', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Early Intervention status', desc: 'EI members carry the 30 hr/week cap and possible dual-presence home-visit rule — establish EI enrollment at intake.' },
      { title: 'Diagnostic evaluation', desc: 'ASD assessment (or the 1/1/2026 Down syndrome pathway) — reviewed against Optum\'s criteria.' },
      { title: 'Supervision staffing plan', desc: '1:10 BCBA-to-paraprofessional is written into the Optum supplement — document it in the request.' },
      { title: 'Submission channel', desc: 'Confirm the Optum route (Provider Express vs. plan-specific) before the first authorization.' },
    ],
    sources: [
      { title: 'Optum ABA State Mandates — BH 803ABA STM12026 (eff. Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
      { title: 'MassHealth ABA supervision audit & recoupment (Acuity News)', url: 'https://acuity.news/regulation/masshealth-aba-supervision-audit-recoupment-litigation-2026/' },
    ],
    faq: [
      { q: 'Does Mass General Brigham Health Plan cover ABA?', a: 'Yes — the MassHealth EPSDT benefit, administered through Optum Behavioral Health under Optum\'s ABA criteria plus its Massachusetts state-mandate supplement. PA is required for assessment and treatment.' },
      { q: 'Does MGB Health Plan cap ABA hours?', a: 'Only for Early Intervention members: Optum\'s supplement limits EI-member ABA to 30 hours/week (effective 10/1/2021) with 1:10 BCBA-to-paraprofessional supervision. No cap is stated for non-EI members.' },
      { q: 'How is MGB different from other MassHealth plans for ABA?', a: 'It\'s the only plan whose ABA runs through Optum — with the 1:10 supervision ratio codified in written policy and the EI hour cap no other MA plan publishes. Everything else follows the state baseline.' },
    ],
  },

  'aetna-massachusetts': {
    slug: 'aetna-massachusetts',
    family: 'aetna',
    cardDesc: 'CPB 0554/0648 + ARICA (no caps, any age) + Aetna\'s own hosted MA Standard ABA form.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9) under CPB 0554; fully-insured MA plans must also cover sole-diagnosis Down syndrome from 1/1/2026 (Ch. 388)',
    payer: 'Aetna in Massachusetts',
    state: 'MA', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Massachusetts',
    h1: 'Aetna ABA coverage in Massachusetts: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Massachusetts: Prior Auth & ARICA Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Massachusetts families — the national clinical policy, prior authorization, the ARICA mandate (no age limits, no caps), the Down syndrome expansion effective 2026, LABA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Massachusetts, an Aetna card means three layers at once: the carrier\'s national clinical policy, Massachusetts\' autism insurance mandate (ARICA, Chapter 207 of the Acts of 2010), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — plus one genuinely Massachusetts-specific artifact: Aetna hosts and uses the state\'s Standard ABA PA form.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'ARICA — Ch. 207, Acts of 2010 (M.G.L. c. 175 § 47AA et al.)' },
      { label: 'Mandate age', value: 'No age limits — any age, medical-necessity based' },
      { label: 'Mandate caps', value: 'None — no dollar, visit, or unit limits on ABA' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA employer plans' },
      { label: 'New for 2026', value: 'Sole-diagnosis Down syndrome covered from 1/1/2026 (Ch. 388, Acts of 2024)' },
      { label: 'Licensure', value: 'MA Licensed Applied Behavior Analyst (LABA)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Massachusetts',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Massachusetts is the legal floor underneath it: ARICA governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Massachusetts.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Massachusetts mandate: ARICA',
        body: [
          'ARICA — An Act Relative to Insurance Coverage for Autism, Chapter 207 of the Acts of 2010, codified at M.G.L. c. 175 § 47AA and parallel sections for HMOs, service corporations, and GIC state-employee plans — is one of the strongest autism mandates in the country. Since January 1, 2011, fully-insured plans must cover the diagnosis and treatment of ASD with no age limits and no dollar, visit, or unit-of-service caps less than those on physical conditions; ABA is covered as habilitative/rehabilitative care when supervised by a board certified behavior analyst. Self-funded ERISA employer plans — a large share of Massachusetts employment — are exempt, answering to federal parity (MHPAEA) instead. And effective January 1, 2026, Chapter 388 of the Acts of 2024 extends the mandate: plans must also cover ABA (plus PT/OT/speech) for a sole diagnosis of Down syndrome.',
        ],
        cites: [
          { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
          { title: 'The Arc of Massachusetts — ABA for Down syndrome expansion (eff. 1/1/2026)', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
        ],
      },
      {
        h2: 'Aetna\'s Massachusetts layer: the state standard form',
        body: [
          'Unusually for a national carrier, Aetna hosts and uses the Massachusetts Standard Form for Applied Behavior Analysis Services Prior Authorization Requests — the same multi-payer form the MassHealth world runs on: completed by the LABA, with request types for initial evaluation, initial services, continued services, and amendments, and an authorization period not to exceed 6 months. So a Massachusetts Aetna request is CPB 0554 clinical criteria on the state\'s paperwork, with state mandates taking precedence for fully-insured plans (Aetna maintains a CPB state-deviations page for exactly this). One thing Aetna does not have in Massachusetts: a Medicaid plan — no Aetna entity appears in the MassHealth roster, so every MA Aetna card is commercial.',
        ],
        cites: [
          { title: 'Aetna-hosted MA Standard ABA PA Form', url: 'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/healthcare-professionals/documents-forms/ma-behavior-prior-auth-form.pdf' },
          { title: 'Aetna CPB state deviations page', url: 'https://www.aetna.com/health-care-professionals/cpb-state-deviations.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Massachusetts',
        body: [
          'Massachusetts licenses behavior analysts as Licensed Applied Behavior Analysts (LABA), with an assistant tier (LAABA), through the Board of Registration of Allied Mental Health and Human Services Professions — under M.G.L. c. 112 as amended by Chapter 429 of the Acts of 2012, with requirements at 262 CMR 10.00, built on BCBA certification. The state\'s payers key the ABA benefit to the LABA: the standard PA form itself is completed by the LABA rendering or supervising services. On rates: Aetna does not publish commercial ABA fee schedules for Massachusetts (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The MassHealth schedule (97153 at $16.37/unit) is the in-state floor to benchmark against, knowing providers regard it as low.',
        ],
        cites: [
          { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (ARICA applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — or, from 1/1/2026, Down syndrome genetic-testing confirmation on fully-insured plans.' },
      { title: 'LABA of record', desc: 'The MA standard form Aetna uses is completed by the rendering or supervising LABA.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Aetna-hosted MA Standard ABA PA Form', url: 'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/healthcare-professionals/documents-forms/ma-behavior-prior-auth-form.pdf' },
      { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
      { title: 'Session Law — Acts of 2010, Chapter 207 (malegislature.gov)', url: 'https://malegislature.gov/Laws/SessionLaws/Acts/2010/Chapter207' },
      { title: 'The Arc of Massachusetts — Down syndrome ABA expansion', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
      { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Massachusetts?', a: 'Yes — under the carrier\'s national policy for ASD, layered on ARICA for fully-insured plans, which bars age limits and benefit caps. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Massachusetts autism mandate require?', a: 'ARICA (Ch. 207, Acts of 2010) is one of the strongest mandates nationally: fully-insured plans must cover ASD diagnosis and treatment at any age with no dollar, visit, or unit caps, including ABA supervised by a board certified behavior analyst. From 1/1/2026, Chapter 388 adds sole-diagnosis Down syndrome.' },
      { q: 'Does Aetna use a Massachusetts-specific ABA form?', a: 'Yes — Aetna hosts and uses the Massachusetts Standard ABA PA form (LABA-completed, 6-month max authorization periods), the same multi-payer form used across the state.' },
      { q: 'What does Aetna pay for ABA in Massachusetts?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the MassHealth 101 CMR 358 schedule knowing it\'s widely considered low.' },
    ],
  },

  'cigna-massachusetts': {
    slug: 'cigna-massachusetts',
    family: 'cigna',
    cardDesc: 'EN0499 (no MA carve-out) + ARICA\'s no-cap, any-age floor for fully-insured plans.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499; fully-insured MA plans must also cover sole-diagnosis Down syndrome from 1/1/2026 (Ch. 388)',
    payer: 'Cigna / Evernorth in Massachusetts',
    state: 'MA', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Massachusetts',
    h1: 'Cigna / Evernorth ABA coverage in Massachusetts: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Massachusetts: Prior Auth & ARICA Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Massachusetts families — the national EN0499 policy, no-PA assessments, the ARICA mandate (no age limits, no caps), the Down syndrome expansion effective 2026, LABA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Massachusetts, a Cigna card means three layers at once: the carrier\'s national clinical policy, Massachusetts\' autism insurance mandate (ARICA, Chapter 207 of the Acts of 2010), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'ARICA — Ch. 207, Acts of 2010 (M.G.L. c. 175 § 47AA et al.)' },
      { label: 'Mandate age', value: 'No age limits — any age, medical-necessity based' },
      { label: 'Mandate caps', value: 'None — no dollar, visit, or unit limits on ABA' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA employer plans' },
      { label: 'New for 2026', value: 'Sole-diagnosis Down syndrome covered from 1/1/2026 (Ch. 388, Acts of 2024)' },
      { label: 'Licensure', value: 'MA Licensed Applied Behavior Analyst (LABA)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Massachusetts',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Massachusetts is the legal floor underneath it: ARICA governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Massachusetts.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Massachusetts mandate: ARICA',
        body: [
          'ARICA — An Act Relative to Insurance Coverage for Autism, Chapter 207 of the Acts of 2010, codified at M.G.L. c. 175 § 47AA and parallel sections for HMOs, service corporations, and GIC state-employee plans — is one of the strongest autism mandates in the country. Since January 1, 2011, fully-insured plans must cover the diagnosis and treatment of ASD with no age limits and no dollar, visit, or unit-of-service caps less than those on physical conditions; ABA is covered as habilitative/rehabilitative care when supervised by a board certified behavior analyst. Self-funded ERISA employer plans — a large share of Massachusetts employment — are exempt, answering to federal parity (MHPAEA) instead. And effective January 1, 2026, Chapter 388 of the Acts of 2024 extends the mandate: plans must also cover ABA (plus PT/OT/speech) for a sole diagnosis of Down syndrome.',
        ],
        cites: [
          { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
          { title: 'The Arc of Massachusetts — ABA for Down syndrome expansion (eff. 1/1/2026)', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
        ],
      },
      {
        h2: 'EN0499 has no Massachusetts carve-out',
        body: [
          'We checked the current EN0499 (effective 5/15/2026) end to end: it contains no Massachusetts-specific provision — its only state carve-out is Virginia fully-insured business. So Massachusetts Cigna members get the standard EN0499 machinery, including the no-PA assessment fast path, with ARICA layered on top for fully-insured plans: where the national policy and the mandate diverge, the policy itself concedes that state coverage mandates control. Cigna runs no Medicaid plan in Massachusetts, so every MA Cigna card is commercial — the open question on each is only funding type.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Massachusetts',
        body: [
          'Massachusetts licenses behavior analysts as Licensed Applied Behavior Analysts (LABA), with an assistant tier (LAABA), through the Board of Registration of Allied Mental Health and Human Services Professions — under M.G.L. c. 112 as amended by Chapter 429 of the Acts of 2012, with requirements at 262 CMR 10.00, built on BCBA certification. Massachusetts payers key the ABA benefit to the LABA. On rates: Cigna does not publish commercial ABA fee schedules for Massachusetts (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The MassHealth schedule (97153 at $16.37/unit) is the in-state floor to benchmark against, knowing providers regard it as low.',
        ],
        cites: [
          { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (ARICA applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — or, from 1/1/2026, Down syndrome genetic-testing confirmation on fully-insured plans.' },
      { title: 'Assessment fast path', desc: 'No PA on 97151/97152/0362T under EN0499 — with the diagnosis in hand, the assessment can book immediately.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
      { title: 'Session Law — Acts of 2010, Chapter 207 (malegislature.gov)', url: 'https://malegislature.gov/Laws/SessionLaws/Acts/2010/Chapter207' },
      { title: 'The Arc of Massachusetts — Down syndrome ABA expansion', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
      { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Massachusetts?', a: 'Yes — under national policy EN0499 for ASD (no PA on assessment codes), layered on ARICA for fully-insured plans, which bars age limits and benefit caps. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Massachusetts autism mandate require?', a: 'ARICA (Ch. 207, Acts of 2010) is one of the strongest mandates nationally: fully-insured plans must cover ASD diagnosis and treatment at any age with no dollar, visit, or unit caps, including ABA supervised by a board certified behavior analyst. From 1/1/2026, Chapter 388 adds sole-diagnosis Down syndrome.' },
      { q: 'Does EN0499 apply differently in Massachusetts?', a: 'No — unlike Virginia, EN0499 carries no Massachusetts carve-out, so the standard policy (including the no-PA assessment path) applies, with ARICA controlling for fully-insured plans where they diverge.' },
    ],
  },

  'unitedhealthcare-massachusetts': {
    slug: 'unitedhealthcare-massachusetts',
    family: 'unitedhealthcare',
    cardDesc: 'Optum BH803ABASCC + ARICA + two explicit MA entries in Optum\'s state-mandate supplement.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.); MA commercial members also covered for sole-diagnosis Down syndrome eff. 1/1/2026 (Optum state-mandate supplement)',
    payer: 'UnitedHealthcare / Optum in Massachusetts',
    state: 'MA', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Massachusetts',
    h1: 'UnitedHealthcare / Optum ABA coverage in Massachusetts: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Massachusetts: Prior Auth & ARICA Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Massachusetts families — the national clinical policy, prior authorization, the ARICA mandate (no age limits, no caps), Optum\'s explicit Massachusetts state-mandate entries, LABA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Massachusetts, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Massachusetts\' autism insurance mandate (ARICA, Chapter 207 of the Acts of 2010), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — and Massachusetts is one of the states Optum\'s written state-mandate supplement addresses by name, twice.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'ARICA — Ch. 207, Acts of 2010 (M.G.L. c. 175 § 47AA et al.)' },
      { label: 'Mandate age', value: 'No age limits — any age, medical-necessity based' },
      { label: 'Mandate caps', value: 'None — no dollar, visit, or unit limits on ABA' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA employer plans' },
      { label: 'New for 2026', value: 'Optum\'s supplement codifies Down syndrome coverage for MA commercial members eff. 1/1/2026' },
      { label: 'Licensure', value: 'MA Licensed Applied Behavior Analyst (LABA)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Massachusetts',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in Massachusetts is the legal floor underneath it: ARICA governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Massachusetts.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Massachusetts mandate: ARICA',
        body: [
          'ARICA — An Act Relative to Insurance Coverage for Autism, Chapter 207 of the Acts of 2010, codified at M.G.L. c. 175 § 47AA and parallel sections for HMOs, service corporations, and GIC state-employee plans — is one of the strongest autism mandates in the country. Since January 1, 2011, fully-insured plans must cover the diagnosis and treatment of ASD with no age limits and no dollar, visit, or unit-of-service caps less than those on physical conditions; ABA is covered as habilitative/rehabilitative care when supervised by a board certified behavior analyst. Self-funded ERISA employer plans — a large share of Massachusetts employment — are exempt, answering to federal parity (MHPAEA) instead. And effective January 1, 2026, Chapter 388 of the Acts of 2024 extends the mandate: plans must also cover ABA (plus PT/OT/speech) for a sole diagnosis of Down syndrome.',
        ],
        cites: [
          { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
          { title: 'The Arc of Massachusetts — ABA for Down syndrome expansion (eff. 1/1/2026)', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
        ],
      },
      {
        h2: 'Optum\'s Massachusetts-specific criteria',
        body: [
          'Massachusetts appears twice in Optum\'s ABA State Mandates supplement (BH 803ABA STM12026, effective January 2026). First, for Massachusetts Medicaid Early Intervention members (effective 10/1/2021): ABA services should not exceed 30 hours per week, and BCBA-to-paraprofessional supervision must run at 1:10 — with supervisor and technician possibly both required present during home visits. That entry codified, years early, the exact supervision ratio MassHealth enforced statewide in its 2026 audit. Second, for Massachusetts commercial members (effective 1/1/2026): coverage for the treatment of Down syndrome — defined by trisomy-21 genetic criteria — including ABA plus speech, OT, and PT, implementing Chapter 388 in Optum\'s own clinical criteria.',
        ],
        cites: [
          { title: 'Optum ABA State Mandates — BH 803ABA STM12026 (eff. Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare and MassHealth',
        body: [
          'UnitedHealthcare runs no MassHealth MCO or ACPP of its own — but Optum, its behavioral arm, administers the ABA benefit for the Mass General Brigham Health Plan MassHealth ACPP, which has its own guide. UHC\'s Massachusetts Medicaid-linked products — UnitedHealthcare Connected for One Care (ages 21–64) and Senior Care Options (65+) — serve adult populations, so they carry essentially no ABA volume. Practically: a Massachusetts family with a UnitedHealthcare card is on commercial coverage, and an "Optum" authorization for a MassHealth child usually means the MGB plan.',
        ],
        cites: [
          { title: 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023)', url: 'https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Massachusetts',
        body: [
          'Massachusetts licenses behavior analysts as Licensed Applied Behavior Analysts (LABA), with an assistant tier (LAABA), through the Board of Registration of Allied Mental Health and Human Services Professions — under M.G.L. c. 112 as amended by Chapter 429 of the Acts of 2012, with requirements at 262 CMR 10.00, built on BCBA certification. Massachusetts payers key the ABA benefit to the LABA. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Massachusetts (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The MassHealth schedule (97153 at $16.37/unit) is the in-state floor to benchmark against, knowing providers regard it as low.',
        ],
        cites: [
          { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (ARICA applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. the Optum-administered Mass General Brigham Health Plan (MassHealth) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD with a validated tool (ADI-R, ADOS-2) — or, from 1/1/2026, trisomy-21 genetic confirmation for the Down syndrome pathway.' },
      { title: 'Supervision staffing plan', desc: 'Optum\'s MA entries codify 1:10 BCBA-to-paraprofessional supervision — document it in the request.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum ABA State Mandates — BH 803ABA STM12026 (eff. Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'DisabilityInfo/AIRC — ARICA fact sheet', url: 'https://disabilityinfo.org/fact-sheet-library/laws-legislation/act-relative-to-insurance-coverage-for-autism-arica/' },
      { title: 'Session Law — Acts of 2010, Chapter 207 (malegislature.gov)', url: 'https://malegislature.gov/Laws/SessionLaws/Acts/2010/Chapter207' },
      { title: 'The Arc of Massachusetts — Down syndrome ABA expansion', url: 'https://thearcofmass.org/post/expansion-of-coverage-of-applied-behavior-analysis-aba-for-individuals-with-down-syndrome/' },
      { title: '262 CMR 10.00 — LABA/LAABA licensure requirements (mass.gov)', url: 'https://www.mass.gov/regulations/262-CMR-1000-requirements-for-licensure-as-an-applied-behavior-analyst-and-assistant-applied-behavior-analyst' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Massachusetts?', a: 'Yes — under Optum\'s national two-step authorization for ASD, layered on ARICA for fully-insured plans, which bars age limits and benefit caps. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Massachusetts autism mandate require?', a: 'ARICA (Ch. 207, Acts of 2010) is one of the strongest mandates nationally: fully-insured plans must cover ASD diagnosis and treatment at any age with no dollar, visit, or unit caps, including ABA supervised by a board certified behavior analyst. From 1/1/2026, Chapter 388 adds sole-diagnosis Down syndrome — which Optum\'s state-mandate supplement implements by name.' },
      { q: 'Does UnitedHealthcare run MassHealth plans?', a: 'Not directly — but Optum administers ABA for the Mass General Brigham Health Plan MassHealth ACPP (see its guide), and UHC\'s One Care and Senior Care Options products serve adults only.' },
      { q: 'What does UnitedHealthcare pay for ABA in Massachusetts?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the MassHealth 101 CMR 358 schedule knowing it\'s widely considered low.' },
    ],
  },
};
