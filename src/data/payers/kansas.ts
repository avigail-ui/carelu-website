import type { PayerConfig } from './types';

export const kansasPayers: Record<string, PayerConfig> = {
  'kansas-medicaid': {
    slug: 'kansas-medicaid',
    cardDesc: 'CCTS + IIS under EPSDT (not "ABA"); 3 MCOs, 6-month diagnosis rule, 50 h/yr + 25 h/wk limits.',
    assessmentPA: 'Required — physician/licensed-practitioner recommendation + PA per KMAP Bulletin 17129; each MCO runs its own intake',
    treatmentPA: 'Required — CCTS soft limit 50 hrs/year, IIS initially authorized up to 25 hrs/week; MCO reauthorization at minimum every 6 months',
    dxRequired: 'Yes — ASD (F84.x); both major MCOs require MD/licensed-psychologist validation within the last 6 months; EPSDT age 20 and under',
    payer: 'KanCare (Kansas Medicaid)',
    state: 'KS', kind: 'state-medicaid',
    pill: 'Payer Guide · KanCare',
    h1: 'KanCare (Kansas Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'KanCare (Kansas Medicaid) ABA / Autism Services Coverage & Prior Auth Guide | Carelu',
    metaDescription:
      'How KanCare (Kansas Medicaid) covers ABA under EPSDT as two services — CCTS and IIS — through three MCOs: prior authorization, the 6-month diagnosis-validation rule, the 50 hr/yr and 25 hr/wk soft limits, KMAP enrollment, and the honest rate picture.',
    intro: [
      'Kansas Medicaid doesn\'t call it ABA. Since January 1, 2017, the benefit lives in the State Plan under EPSDT as two "Autism Services": Consultative Clinical and Therapeutic Services (CCTS) — the BCBA-level tier covering assessment, treatment planning, supervision, and family training — and Intensive Individual Supports (IIS), the technician-level 1:1 tier. Understanding that vocabulary is half the intake battle, because authorizations, provider enrollment, and limits are all organized around the CCTS/IIS split. Delivery runs entirely through KanCare\'s managed care organizations — Sunflower Health Plan, UnitedHealthcare Community Plan, and (since January 1, 2025) Healthy Blue Kansas — with KMAP fee-for-service policy as the baseline underneath. Aetna Better Health of Kansas is gone: it lost the KanCare 3.0 contract and its members moved to Healthy Blue on 1/1/2025.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — as CCTS + IIS under EPSDT, members age 20 and under' },
      { label: 'Prior auth', value: 'Required — physician/practitioner recommendation + PA, per MCO' },
      { label: 'Hour limits', value: 'CCTS soft limit 50 hrs/year; IIS initial auth up to 25 hrs/week (more on medical necessity)' },
      { label: 'Diagnosis recency', value: 'ASD validation within the last 6 months (Sunflower + Optum/UHC rule)' },
      { label: 'Administered by', value: 'Sunflower, UHC Community Plan, Healthy Blue (all MCO, contracts 2025–2027)' },
      { label: 'Licensure', value: 'Kansas LBA/LaBA (BSRB) since 7/1/2016; every provider needs their own KMAP ID' },
      { label: 'Rates', value: 'Not reliably published — KMAP interactive lookup is the source of truth (last verified rate action 4/1/2019)' },
    ],
    sections: [
      {
        h2: 'Kansas doesn\'t call it ABA: CCTS + IIS',
        body: [
          'ABA moved from the old HCBS Autism waiver into the Medicaid State Plan under EPSDT effective January 1, 2017, split into two services. CCTS ("Autism Specialist Services," provider type 11, specialty 403) is the analyst tier — billed under 97151, 97152, 97155, and 97156 — and carries an approved soft limit of 50 hours per year. IIS (specialty 404) is the technician-delivered 1:1 tier billed under 97153, initially authorized up to 25 hours per week with additional hours available on medical necessity. Effective 7/1/2024 the billing map widened: CCTS may also bill 97153, 97154, and 97158, and IIS may also bill 97154. A separate small HCBS Autism waiver still exists for very young children.',
          'Kansas also has unusual non-certified provider pathways: CCTS can be delivered by a master\'s-level professional with a KDADS HCBS director letter plus state-approved training, and IIS by a non-RBT with a high-school diploma, 40 hours of ABA training, and a KDADS validation letter, supervised by a BCBA. But the credentialing bottleneck to plan around is KMAP enrollment: every group AND every individual provider — each BCBA and each RBT — must be screened and enrolled in KMAP with their own KMAP ID before any MCO can pay them, and each service location requires separate enrollment.',
        ],
        cites: [
          { title: 'KMAP Bulletin 17129 — Additional State Plan Services (CCTS/IIS under EPSDT, eff. 1/1/2017)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-17129.html' },
          { title: 'KMAP Bulletin 19029 — Rate Increase for Autism Services (CCTS 50 h/yr, IIS 25 h/wk limits)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html' },
          { title: 'UHC/Optum — Getting started: KanCare members diagnosed with ASD (BH00567_10102024)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ksABA/ksHowToAuth.pdf' },
        ],
      },
      {
        h2: 'The KanCare 3.0 MCO landscape',
        body: [
          'KanCare is comprehensive statewide managed care — effectively all ~458,000 beneficiaries sit with one of three MCOs under contracts running 1/1/2025 through 12/31/2027 (renewable to 2029): Sunflower Health Plan (Centene), UnitedHealthcare Community Plan (behavioral health via Optum), and Healthy Blue Kansas, the new entrant. Aetna Better Health of Kansas, which served KanCare 2019–2024, was not selected — its members auto-transitioned to Healthy Blue on 1/1/2025 unless they chose Sunflower or UHC. Any directory still listing Aetna Better Health as an active KanCare plan is stale. PA and payment run through the MCOs with KMAP FFS policy as the floor; a secondary source reports KanCare MCOs must pay in-network providers at least 100% of the FFS rate (we could not verify this against the contract itself).',
        ],
        cites: [
          { title: 'KDHE — KanCare MCO contract awards 2025–2027', url: 'https://www.kdhe.ks.gov/CivicAlerts.aspx?AID=1104' },
          { title: 'Kansas Action for Children — State selects companies to manage KanCare (Aetna → Healthy Blue transition)', url: 'https://www.kac.org/state_selects_companies_to_manage_kancare' },
        ],
      },
      {
        h2: 'Authorization & the 6-month diagnosis rule',
        body: [
          'At the state-policy level, CCTS — which includes the assessment function, now billed 97151 — requires a recommendation by a physician or other licensed practitioner and is subject to prior authorization; each MCO operates its own PA intake. The tripwire to design intake around is diagnosis recency: both Sunflower (KS.CP.01) and Optum/UHC (BH 803ABA Kansas entry) require that an MD or licensed psychologist has validated the ASD diagnosis via comprehensive diagnostic evaluation within the last 6 months at initial authorization — an unusually aggressive rule that means a two-year-old diagnostic report doesn\'t clear the gate. Reauthorization runs at minimum every 6 months (Optum layers a monthly provider progress review on top), and Sunflower adds its own Kansas-specific gate: a current Kan Be Healthy (EPSDT) screen within the past year. Capture diagnosis date and screening status at first contact, not at submission.',
        ],
        cites: [
          { title: 'KMAP Bulletin 17129 — CCTS PA and practitioner-recommendation requirement', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-17129.html' },
          { title: 'Sunflower KS.CP.01 — Applied Behavioral Analysis (clinical policy)', url: 'https://www.sunflowerhealthplan.com/content/dam/centene/sunflower/policies/clinical-policies/KS.CP.01-Applied-Behavioral-Analysis.pdf' },
          { title: 'Optum — ABA State Mandates supplemental criteria (Kansas Medicaid section)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'Rates: a 2019 anchor, not a current schedule',
        body: [
          'We won\'t quote current Kansas autism-services rates, because we couldn\'t verify them. The last public anchor is the CPT crosswalk effective 1/1/2019, which set 97151 at $17.50 per 15-minute unit — and that was then raised effective 4/1/2019 by a bulletin that did not publish the new amounts. Notably, the 7/1/2022 behavioral-health rate increase did NOT include the 9715x autism codes. The source of truth is the KMAP interactive fee-schedule lookup (Reference Codes on the KMAP portal); UHC/Optum explicitly commits to reimbursing at the Kansas Medicaid autism-services rates, so the KMAP lookup doubles as your MCO benchmark. Treat any dollar figure circulating for Kansas ABA as unverified until you\'ve pulled it from that lookup yourself.',
        ],
        cites: [
          { title: 'KMAP Bulletin 18259 — CPT crosswalk (0359T→97151 at $17.50/15 min, eff. 1/1/2019)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-18259.html' },
          { title: 'KMAP Bulletin 19029 — Rate Increase for Autism Services (eff. 4/1/2019; amounts unpublished)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html' },
          { title: 'KMAP Bulletin 22128 — BH rate increase 7/1/2022 (9715x not included)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-221280.html' },
        ],
      },
    ],
    collect: [
      { title: 'KanCare MCO', desc: 'Sunflower, UnitedHealthcare, or Healthy Blue — same CCTS/IIS baseline, different PA machinery. Anything saying "Aetna Better Health" is stale (moved to Healthy Blue 1/1/2025).' },
      { title: 'ASD diagnosis + date', desc: 'Diagnosing MD/psychologist, credentials, and the evaluation date — Sunflower and Optum require validation within the last 6 months, so an old report may need a refresh first.' },
      { title: 'Physician/practitioner recommendation', desc: 'The CCTS PA requires a recommendation by a physician or other licensed practitioner — chase it at intake.' },
      { title: 'Kan Be Healthy screen status', desc: 'Sunflower members need a current EPSDT screen within the past year (not the same as a well-child exam) — a silent auth-staller.' },
      { title: 'KMAP enrollment of rendering staff', desc: 'Each BCBA and each RBT needs their own KMAP ID (per service location) before any MCO can pay — confirm before quoting start dates.' },
    ],
    sources: [
      { title: 'KMAP Bulletin 17129 — Additional State Plan Services (CCTS/IIS, eff. 1/1/2017)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-17129.html' },
      { title: 'KMAP Bulletin 18259 — Mental Health/Autism CPT crosswalk (eff. 1/1/2019)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-18259.html' },
      { title: 'KMAP Bulletin 19029 — Rate Increase for Autism Services (eff. 4/1/2019)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html' },
      { title: 'KMAP Bulletin 22128 — BH Services Rate Increase 7/1/2022', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-221280.html' },
      { title: 'UHC/Optum — KanCare ASD getting-started guide (BH00567_10102024)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ksABA/ksHowToAuth.pdf' },
      { title: 'KDHE — KanCare MCO contract awards 2025–2027', url: 'https://www.kdhe.ks.gov/CivicAlerts.aspx?AID=1104' },
      { title: 'KMAP fee schedules — interactive lookup (source of truth for current rates)', url: 'https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules' },
    ],
    faq: [
      { q: 'Does KanCare (Kansas Medicaid) cover ABA therapy?', a: 'Yes — but Kansas doesn\'t label it ABA. It\'s covered under EPSDT for members age 20 and under as two services: CCTS (the BCBA tier, soft limit 50 hours/year) and IIS (the technician 1:1 tier, initially authorized up to 25 hours/week, more on medical necessity), with prior authorization through the member\'s MCO.' },
      { q: 'Which MCOs run KanCare autism services?', a: 'Sunflower Health Plan, UnitedHealthcare Community Plan (Optum behavioral health), and Healthy Blue Kansas — the new plan effective 1/1/2025. Aetna Better Health of Kansas lost its contract; its members moved to Healthy Blue on 1/1/2025.' },
      { q: 'How recent does the autism diagnosis need to be?', a: 'Both Sunflower and Optum/UHC require the ASD diagnosis to have been validated by an MD or licensed psychologist within the last 6 months at initial authorization — plan for a diagnostic refresh if the report is older.' },
      { q: 'What does Kansas Medicaid pay for ABA?', a: 'Current rates aren\'t reliably published. The last public anchor is $17.50/15-minute unit for 97151 effective 1/1/2019, raised 4/1/2019 without published amounts; the 2022 BH increase skipped the 9715x codes. Pull current figures from the KMAP interactive fee-schedule lookup — the only source of truth.' },
    ],
  },

  'sunflower-health-plan-kansas': {
    slug: 'sunflower-health-plan-kansas',
    family: 'centene',
    cardDesc: 'Autism Auth Request Form, named assessment tools, 6-month dx rule, Kan Be Healthy screen gate.',
    assessmentPA: 'Required — completed Autism Authorization Request Form with physician recommendation, diagnosis validated within 6 months, plus a standardized assessment and a skills-based assessment',
    treatmentPA: 'Required — focused (10–25 h/wk) or comprehensive (25–40 h/wk) plans; 6-month continuation reviews and annual full reassessment; Kan Be Healthy screen within the past year',
    dxRequired: 'Yes — ASD (F84.x per Sunflower\'s coding table), validated by an MD or licensed psychologist within the last 6 months',
    payer: 'Sunflower Health Plan (KS)',
    state: 'KS', kind: 'medicaid-mco', parent: 'KanCare (Kansas Medicaid)',
    pill: 'Payer Guide · Sunflower Health Plan',
    h1: 'Sunflower Health Plan ABA coverage (KanCare MCO).',
    metaTitle: 'Sunflower Health Plan (KanCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Sunflower Health Plan (Centene) administers KanCare autism services — the Autism Authorization Request Form, named assessment instruments, the 6-month diagnosis-validation rule, the Kan Be Healthy screen gate, and 6-month continuation reviews.',
    intro: [
      'Sunflower Health Plan, Centene\'s KanCare plan, administers the CCTS/IIS autism-services benefit under its own clinical policy KS.CP.01 — which mirrors the state\'s 50 hours/year CCTS and 25 hours/week IIS soft limits but layers real plan-specific requirements on top: a dedicated Autism Authorization Request Form, named assessment instruments, the 6-month diagnosis-validation rule, and a uniquely Kansas gate — the Kan Be Healthy (EPSDT) screen. Two of those regularly stall authorizations silently, so both belong in the first intake conversation.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'KanCare MCO (Centene), contracted 2025–2027' },
      { label: 'Prior auth', value: 'Required — Autism Authorization Request Form + physician recommendation' },
      { label: 'Diagnosis recency', value: 'ASD validated by MD/licensed psychologist within the last 6 months' },
      { label: 'Kan Be Healthy gate', value: 'EPSDT screen within the past year required for Medicaid members' },
      { label: 'Hour tiers', value: 'Focused 10–25 h/wk, comprehensive 25–40 h/wk; state soft limits (50 h/yr CCTS, 25 h/wk IIS) underneath' },
      { label: 'Review cadence', value: '6-month continuations (updated skills assessment); annual full reassessment' },
    ],
    sections: [
      {
        h2: 'The authorization packet Sunflower actually wants',
        body: [
          'KS.CP.01 drives authorization off a fully completed Autism Authorization Request Form with a dated provider signature, and the packet is specific: a physician recommendation or prescription; the original autism diagnosis validated within the last 6 months by an MD or licensed psychologist; a criterion-referenced standardized assessment (Vineland-3, ADOS, CARS, ADI-R, GARS, or ASDS); and a skills-based assessment (VB-MAPP, ABLLS, AFLS, or ASRS). Treatment plans are classified focused (10–25 hours/week) or comprehensive (25–40 hours/week), against the state soft limits of 50 hours/year of CCTS and 25 hours/week of IIS — exceeding them takes additional documentation. Continuation reviews land every 6 months with an updated skills-based assessment; annual reviews require the full standardized-plus-skills battery. One caveat worth knowing: the posted policy version was last reviewed 06/2019, so confirm current requirements through the portal when stakes are high.',
        ],
        cites: [
          { title: 'Sunflower KS.CP.01 — Applied Behavioral Analysis (clinical policy)', url: 'https://www.sunflowerhealthplan.com/content/dam/centene/sunflower/policies/clinical-policies/KS.CP.01-Applied-Behavioral-Analysis.pdf' },
        ],
      },
      {
        h2: 'The Kan Be Healthy gate — and other intake tripwires',
        body: [
          'Medicaid members must have a current Kan Be Healthy (EPSDT) screen completed within the past year by a physician, APRN, PA, or credentialed RN — and the policy is explicit that this is not the same as a well-child exam (the requirement is waived for Ambetter members). Families often need a PCP visit before ABA can be approved, which makes screen status a day-one intake question rather than a submission-day discovery. Same story for the 6-month diagnosis-validation rule: if the diagnostic report is older, plan the refresh before the auth, not after the denial. Sunflower applies this same clinical policy across its KanCare, Medicare, and Ambetter lines, with state Medicaid provisions taking precedence on conflict; submission runs through Sunflower\'s standard secure portal/Availity PA channels — no dedicated ABA portal is named in the policy.',
        ],
        cites: [
          { title: 'Sunflower KS.CP.01 — Applied Behavioral Analysis (clinical policy)', url: 'https://www.sunflowerhealthplan.com/content/dam/centene/sunflower/policies/clinical-policies/KS.CP.01-Applied-Behavioral-Analysis.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis date + diagnosing clinician', desc: 'Must be validated by an MD or licensed psychologist within the last 6 months — schedule the refresh early if it\'s stale.' },
      { title: 'Kan Be Healthy screen status', desc: 'EPSDT screen within the past year (not a well-child exam) — the silent auth-staller; route the family to their PCP if missing.' },
      { title: 'Physician recommendation/prescription', desc: 'Required in the Autism Authorization Request packet.' },
      { title: 'Assessment instruments on file', desc: 'One standardized (Vineland-3, ADOS, CARS, ADI-R, GARS, ASDS) + one skills-based (VB-MAPP, ABLLS, AFLS, ASRS).' },
      { title: 'Requested intensity tier', desc: 'Focused (10–25 h/wk) vs. comprehensive (25–40 h/wk); exceeding the state soft limits needs extra documentation.' },
    ],
    sources: [
      { title: 'Sunflower KS.CP.01 — Applied Behavioral Analysis (clinical policy)', url: 'https://www.sunflowerhealthplan.com/content/dam/centene/sunflower/policies/clinical-policies/KS.CP.01-Applied-Behavioral-Analysis.pdf' },
      { title: 'KMAP Bulletin 19029 — Rate Increase for Autism Services (state CCTS/IIS limits)', url: 'https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html' },
    ],
    faq: [
      { q: 'Does Sunflower Health Plan cover ABA therapy?', a: 'Yes — as KanCare\'s CCTS/IIS autism-services benefit under EPSDT, with prior authorization via the Autism Authorization Request Form, a physician recommendation, and named standardized plus skills-based assessments.' },
      { q: 'What is the Kan Be Healthy requirement?', a: 'Sunflower requires Medicaid members to have a current Kan Be Healthy (EPSDT) screen completed within the past year by a physician, APRN, PA, or credentialed RN — explicitly not the same as a well-child exam. Missing it silently stalls the authorization.' },
      { q: 'How recent must the autism diagnosis be for Sunflower?', a: 'Validated within the last 6 months by an MD or licensed psychologist at initial authorization — build the diagnostic refresh into intake for families with older reports.' },
      { q: 'How many ABA hours does Sunflower authorize?', a: 'Plans run focused (10–25 hours/week) or comprehensive (25–40 hours/week), on top of the state soft limits — 50 hours/year of CCTS and 25 hours/week of IIS — which can be exceeded with additional documentation.' },
    ],
  },

  'unitedhealthcare-community-plan-kansas': {
    slug: 'unitedhealthcare-community-plan-kansas',
    family: 'unitedhealthcare',
    cardDesc: 'Optum-run; 6-month dx rule, 40 h/wk plan ceiling, monthly progress reviews, KMAP-first credentialing.',
    assessmentPA: 'Required — PA for CCTS and IIS reviewed after all requested documentation is submitted (Optum)',
    treatmentPA: 'Required — individualized plan capped at 40 hrs/week; monthly progress review; formal treatment-plan renewal at minimum every 6 months',
    dxRequired: 'Yes — ASD validated within the last 6 months by a licensed psychologist or MD via comprehensive diagnostic evaluation; member age 20 and under',
    payer: 'UnitedHealthcare Community Plan of Kansas',
    state: 'KS', kind: 'medicaid-mco', parent: 'KanCare (Kansas Medicaid)',
    pill: 'Payer Guide · UHC Community Plan (KS)',
    h1: 'UnitedHealthcare Community Plan of Kansas ABA coverage (KanCare MCO).',
    metaTitle: 'UHC Community Plan Kansas (KanCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan of Kansas (Optum) administers KanCare autism services — the Kansas-specific Optum criteria, 40 hr/week plan ceiling, 6-month diagnosis rule, monthly progress reviews, KMAP-first credentialing, and Kansas Medicaid rates.',
    intro: [
      'UnitedHealthcare Community Plan of Kansas runs the KanCare CCTS/IIS benefit through Optum Behavioral Health — and unlike most states, Optum publishes an explicit "For Kansas Medicaid member" section in its ABA State Mandates supplemental criteria, plus a Kansas-specific ABA onboarding guide. The Kansas overlay has teeth: a 40 hours/week ceiling on the individualized plan, the 6-month diagnosis-validation rule, monthly provider progress reviews (the strictest cadence among the three MCOs), and a written exclusion list. It also answers the rate question more directly than anyone: UHC commits to paying the Kansas Medicaid autism-services rates.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'KanCare MCO (incumbent, 2025–2027); BH run by Optum' },
      { label: 'Prior auth', value: 'Required for CCTS and IIS — reviewed once all documentation is in' },
      { label: 'Diagnosis recency', value: 'ASD validated within the last 6 months by licensed psychologist or MD; age 20 and under' },
      { label: 'Plan ceiling', value: 'No more than 40 hrs/week; state 50 h/yr CCTS + 25 h/wk IIS limits underneath' },
      { label: 'Review cadence', value: 'Monthly CCTS progress review; formal renewal at minimum every 6 months' },
      { label: 'Rates', value: 'Pays Kansas Medicaid autism-services rates (per KMAP Reference Codes lookup)' },
    ],
    sections: [
      {
        h2: 'The Kansas-specific Optum criteria',
        body: [
          'Optum\'s Kansas Medicaid entry codifies the state EPSDT framework with its own supplement: the member must be age 20 and under with an ASD diagnosis validated within the last 6 months by a licensed psychologist or MD via comprehensive diagnostic evaluation; identified deficits form the basis of an individualized treatment plan of no more than 40 hours per week; the CCTS provider reviews progress monthly; and a formal treatment-plan review and renewal request goes in at minimum every six months. The document also carries an explicit non-authorization list — speech/OT, vocational rehab, respite, recreational therapy, orientation & mobility, services delivered in PRTF or hospital settings, and duplicated services — worth screening against before a request goes out the door.',
        ],
        cites: [
          { title: 'Optum — ABA State Mandates supplemental criteria (Kansas Medicaid section, annual review 11/2025)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'Credentialing runs KMAP-first — and rates are the Medicaid schedule',
        body: [
          'You cannot start with Optum directly: providers complete KMAP enrollment first, and Optum then retrieves the application from KMAP to begin credentialing (about 60 days). CCTS credentialing requires both BACB certification proof AND the Kansas BSRB license number. Auth resources live on Provider Express; the contracting line is 1-877-614-0484 (ask for the Kansas ABA Network Manager), and the plan publishes a dedicated KanCare network contact (Carolan Wishall, 1-913-608-3064). On payment, the onboarding guide is unambiguous: "We\'ll reimburse you for services according to the Kansas Medicaid rates for autism services" — which makes the KMAP Reference Codes interactive lookup your rate sheet for this plan too.',
        ],
        cites: [
          { title: 'UHC/Optum — KanCare ASD getting-started guide (BH00567_10102024)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ksABA/ksHowToAuth.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis date + evaluator credentials', desc: 'Licensed psychologist or MD, comprehensive evaluation, within the last 6 months — the initial-auth gate.' },
      { title: 'Member age', desc: 'EPSDT scope is age 20 and under for the Kansas Medicaid criteria.' },
      { title: 'Requested hours vs. the 40 h/wk ceiling', desc: 'The individualized plan cannot exceed 40 hours/week; state CCTS/IIS soft limits apply underneath.' },
      { title: 'Concurrent services', desc: 'Screen against the exclusion list (speech/OT, respite, PRTF/hospital settings, duplicated services) before submitting.' },
      { title: 'KMAP + Optum credentialing status', desc: 'KMAP enrollment first, then Optum credentialing (~60 days); CCTS needs BACB proof + the BSRB license number.' },
    ],
    sources: [
      { title: 'Optum — ABA State Mandates supplemental criteria (Kansas Medicaid section)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'UHC/Optum — KanCare ASD getting-started guide (BH00567_10102024)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ksABA/ksHowToAuth.pdf' },
      { title: 'KMAP fee schedules — interactive lookup (rate source)', url: 'https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Kansas cover ABA?', a: 'Yes — the KanCare CCTS/IIS benefit under EPSDT for members age 20 and under, administered by Optum, with prior authorization on both service tiers and an individualized plan capped at 40 hours/week.' },
      { q: 'How is UHC different from the other KanCare MCOs?', a: 'It publishes explicit Kansas criteria: the 40 h/wk plan ceiling, monthly progress reviews (strictest cadence of the three), a written exclusion list, and a commitment to pay the Kansas Medicaid autism-services rates.' },
      { q: 'How do I join the UHC KanCare ABA network?', a: 'Enroll in KMAP first — Optum retrieves your application from KMAP to start credentialing (~60 days). CCTS credentialing requires BACB certification proof plus your Kansas BSRB license number; contracting line 1-877-614-0484.' },
    ],
  },

  'healthy-blue-kansas': {
    slug: 'healthy-blue-kansas',
    family: 'anthem',
    cardDesc: 'Newest MCO (1/1/2025, absorbed Aetna members); Availity intake, own autism-testing form, thin public policy.',
    assessmentPA: 'Required — dedicated Autism Spectrum Disorder Testing request form (KSHB-CD-066296-24), which flags whether the request is to access ABA services',
    treatmentPA: 'Required — via Availity (preferred), phone, or BH outpatient fax 1-866-852-8978; hour rules and review cadence not published — verify in the portal',
    payer: 'Healthy Blue Kansas',
    state: 'KS', kind: 'medicaid-mco', parent: 'KanCare (Kansas Medicaid)',
    pill: 'Payer Guide · Healthy Blue Kansas',
    h1: 'Healthy Blue Kansas ABA coverage (KanCare MCO).',
    metaTitle: 'Healthy Blue Kansas (KanCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Healthy Blue Kansas — the KanCare MCO that replaced Aetna Better Health on 1/1/2025 — handles autism services: Availity prior authorization, the ASD testing request form, Anthem-platform mechanics, and what isn\'t publicly published yet.',
    intro: [
      'Healthy Blue Kansas is the newest KanCare MCO, live January 1, 2025 as a three-way collaboration of Blue Cross and Blue Shield of Kansas, Blue Cross and Blue Shield of Kansas City, and Anthem/Elevance — which is why its provider machinery is Anthem-platform (Availity) even though it isn\'t a plain Elevance subsidiary. It matters for intake because it absorbed most Aetna Better Health of Kansas members automatically at launch, so a large block of ABA cases changed payers at once. Honesty note up front: of the three KanCare MCOs, Healthy Blue publishes the least ABA-specific policy — no Kansas hour rules or review cadence appear on its public pages — so the state CCTS/IIS baseline plus portal verification is the working rulebook.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'KanCare MCO — new 1/1/2025 (BCBSKS + BCBS Kansas City + Anthem/Elevance JV)' },
      { label: 'Aetna transition', value: 'Absorbed most Aetna Better Health members 1/1/2025; continuity-of-care auths honored at transition' },
      { label: 'Prior auth', value: 'Required — Availity preferred; BH outpatient fax 1-866-852-8978' },
      { label: 'Assessment form', value: 'Dedicated ASD Testing request form (KSHB-CD-066296-24)' },
      { label: 'Hour rules', value: 'Not published — state soft limits (50 h/yr CCTS, 25 h/wk IIS) are the KanCare baseline' },
      { label: 'Clinical guidelines', value: 'Anthem/Elevance UM guideline library on healthybluekansas.com' },
    ],
    sections: [
      {
        h2: 'What\'s verified about Healthy Blue\'s ABA process',
        body: [
          'Prior authorization submits through Availity (Patient Registration > Authorizations & Referrals), or by phone or fax — behavioral-health outpatient fax 1-866-852-8978 (inpatient 1-866-852-8976) — and the site hosts a Prior Authorization Lookup Tool for code-level questions. Autism and psychological testing use distinct paper forms: the Autism Spectrum Disorder Testing request (KSHB-CD-066296-24) versus the psychological-testing form (KSHB-CD-066293-24) — using the wrong one delays the assessment auth. The autism form includes whether the request is to access ABA services, and the plan\'s site indicates ABA therapy requires prior authorization (ABA line 877-563-9347). Clinical criteria come from the Anthem/Elevance UM guideline library published on the plan site; internal Anthem BH staff run UM — no external ABA vendor was identified on the pages we reviewed.',
        ],
        cites: [
          { title: 'Healthy Blue Kansas — Prior Authorization Requirements', url: 'https://www.healthybluekansas.com/provider/state-federal/resources/prior-authorization-requirements' },
          { title: 'Healthy Blue KS — ASD Testing request form (KSHB-CD-066296-24)', url: 'https://www.healthybluekansas.com/content/dam/digital/healthyblue/documents/provider/ks/behavioral-health/KSHB-CD-066296-24-SRS66052%20BH%20Autism%20Testing%20Request%20Form_FINAL_v2%20FILLABLE.pdf' },
        ],
      },
      {
        h2: 'What isn\'t published — and the Aetna transition',
        body: [
          'We found no published Kansas-specific ABA hour caps, review cadence, or diagnosis-recency rule for Healthy Blue — the biggest verification gap among the three MCOs. Until the plan publishes more, work from the KanCare baseline (CCTS 50 hours/year, IIS 25 hours/week initial, state PA requirement) and confirm specifics through Availity or the ABA line before promising families a timeline. On the transition: Aetna Better Health of Kansas served KanCare 2019–2024 and was not selected for the 2025–2027 contracts; its members auto-moved to Healthy Blue on 1/1/2025 (with an extended MCO-change deadline of 4/4/2025), and continuity-of-care authorization honoring applied at the switch. Any family or directory record still pointing at Aetna Better Health belongs here now — or at Sunflower or UHC if they actively switched.',
        ],
        cites: [
          { title: 'Kansas Action for Children — State selects companies to manage KanCare (Aetna → Healthy Blue)', url: 'https://www.kac.org/state_selects_companies_to_manage_kancare' },
          { title: 'KDHE — KanCare MCO contract awards 2025–2027', url: 'https://www.kdhe.ks.gov/CivicAlerts.aspx?AID=1104' },
        ],
      },
    ],
    collect: [
      { title: 'Prior-payer history', desc: 'Ex-Aetna Better Health families landed here 1/1/2025 — check for transition-honored auths and stale card details.' },
      { title: 'The right testing form', desc: 'ASD testing uses KSHB-CD-066296-24, not the psychological-testing form (KSHB-CD-066293-24) — the wrong form delays the assessment auth.' },
      { title: 'ASD diagnosis + physician recommendation', desc: 'The state CCTS PA baseline applies; collect the diagnostic report and practitioner recommendation up front.' },
      { title: 'Portal-verified specifics', desc: 'Hour caps and review cadence aren\'t published — confirm per case via Availity or the ABA line 877-563-9347.' },
    ],
    sources: [
      { title: 'Healthy Blue Kansas — Prior Authorization Requirements', url: 'https://www.healthybluekansas.com/provider/state-federal/resources/prior-authorization-requirements' },
      { title: 'Healthy Blue KS — ASD Testing request form (KSHB-CD-066296-24)', url: 'https://www.healthybluekansas.com/content/dam/digital/healthyblue/documents/provider/ks/behavioral-health/KSHB-CD-066296-24-SRS66052%20BH%20Autism%20Testing%20Request%20Form_FINAL_v2%20FILLABLE.pdf' },
      { title: 'BCBSKS — Healthy Blue collaboration announcement (JV structure)', url: 'https://www.bcbsks.com/news-release/new-healthy-blue-collaboration-aims-offer-kansans-trusted-local-medicaid-solution-2024' },
      { title: 'Kansas Action for Children — KanCare 3.0 selection and Aetna transition', url: 'https://www.kac.org/state_selects_companies_to_manage_kancare' },
    ],
    faq: [
      { q: 'Does Healthy Blue Kansas cover ABA therapy?', a: 'Yes — it administers the KanCare CCTS/IIS autism-services benefit under EPSDT, with prior authorization via Availity, phone, or fax. Plan-specific hour rules aren\'t published, so the state baseline plus portal verification governs.' },
      { q: 'What happened to Aetna Better Health of Kansas members?', a: 'Aetna lost its KanCare contract; members auto-transitioned to Healthy Blue on 1/1/2025 (extended change deadline 4/4/2025) with continuity-of-care authorizations honored. Any listing showing Aetna Better Health as an active KanCare MCO is outdated.' },
      { q: 'How do I submit an ABA authorization to Healthy Blue Kansas?', a: 'Availity is preferred (Patient Registration > Authorizations & Referrals); behavioral-health outpatient fax is 1-866-852-8978, and the plan lists an ABA line at 877-563-9347. Assessment requests use the dedicated ASD Testing form KSHB-CD-066296-24.' },
    ],
  },

  'aetna-kansas': {
    slug: 'aetna-kansas',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the K.S.A. 40-2,194 mandate layer; no KanCare plan anymore.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Kansas',
    state: 'KS', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Kansas',
    h1: 'Aetna ABA coverage in Kansas: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Kansas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Kansas families — the national clinical policy, prior authorization, the K.S.A. 40-2,194 mandate (under-12 age limit, hour caps, exemptions), Kansas behavior-analyst licensure, and the Aetna Better Health exit.',
    intro: [
      'For an intake team in Kansas, an Aetna card means three layers at once: the carrier\'s national clinical policy, Kansas\'s autism insurance mandate (K.S.A. 40-2,194), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — plus one Kansas-specific correction worth making early: Aetna no longer runs a Medicaid plan in Kansas.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'K.S.A. 40-2,194 — large group (51+) only' },
      { label: 'Mandate age', value: 'Under age 12 only' },
      { label: 'Mandate caps', value: '1,300 hrs/yr × 4 yrs (dx by age 5), else 520 hrs/yr — exceedable with prior approval; parity-questioned' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA; small employers (2–50) via waiver; limited-benefit plans' },
      { label: 'Licensure', value: 'KS Licensed Behavior Analyst (BSRB), required since 7/1/2016' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Kansas',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — we found no Kansas-specific Aetna ABA policy, form, or supplement — so what changes in Kansas is the legal floor underneath it: the state mandate below governs what fully-insured large-group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Kansas.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Kansas mandate: what it guarantees (and doesn\'t)',
        body: [
          'Kansas\'s mandate, K.S.A. 40-2,194, is one of the narrower ones in our directory. It reaches large-group policies, service-corporation contracts, fraternal benefit societies, and HMOs (issued/renewed after 1/1/2015; grandfathered plans from 1/1/2016), and 2023\'s SB 24 redefined "large employer" down to 51+ employees. Coverage is limited to covered individuals under age 12, and ABA carries hour-based caps: 1,300 hours/year for 4 years for a child diagnosed between birth and age 5, otherwise 520 hours/year until age 12 — though plans may exceed the caps with prior approval when medically necessary, the statute\'s own escape valve. Day care, facility-based, and school-based services are excluded; after 7/1/2016 ABA under the mandate must be delivered by providers licensed or exempt under the ABA licensure act. Small employers (2–50) can obtain a waiver by showing a 2.5%+ premium increase, self-funded ERISA plans sit outside the statute entirely, and a member diagnosed under any DSM edition cannot be forced into re-evaluation upon DSM revision. Advocacy analysis (not a regulator determination) treats the under-12 age limit and hour caps as unenforceable quantitative limits under MHPAEA for parity-covered plans — so treat cap-based denials as appealable, not final.',
        ],
        cites: [
          { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
          { title: '2023 Session Laws Ch. 3, SB 24 (employer-size amendment)', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
          { title: 'Autism Legal Resource Center — Kansas (parity analysis)', url: 'https://www.autismlegalresourcecenter.com/resources/autism-healthcare-info/kansas/' },
        ],
      },
      {
        h2: 'Aetna Better Health of Kansas is gone',
        body: [
          'Unlike many states, "we have Aetna" in Kansas cannot mean Medicaid anymore: Aetna Better Health of Kansas served KanCare from 2019 to 2024, lost the KanCare 3.0 contract, and its members auto-transitioned to Healthy Blue Kansas on January 1, 2025. Any directory, card, or family memory pointing at Aetna Better Health of Kansas is stale — route those inquiries to the Healthy Blue Kansas guide (or Sunflower/UHC if the family actively switched). Every Aetna card you see in Kansas today is commercial.',
        ],
        cites: [
          { title: 'Kansas Action for Children — Aetna not renewed for KanCare 3.0', url: 'https://www.kac.org/state_selects_companies_to_manage_kancare' },
        ],
      },
      {
        h2: 'Licensure & rates in Kansas',
        body: [
          'Kansas has required licensure for practicing behavior analysts since July 1, 2016: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the applied behavior analysis licensure act (K.S.A. 65-7501 et seq.), administered by the Behavioral Sciences Regulatory Board and keyed to BACB certification — and the mandate itself conditions ABA coverage on licensed or exempt providers, so licensure is a coverage requirement, not just a credentialing one. On rates: Aetna does not publish commercial ABA fee schedules for Kansas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The usual Medicaid benchmark is also unusually opaque here: current KanCare autism-services rates are only available through the KMAP interactive fee-schedule lookup, so pull them there before a rate negotiation.',
        ],
        cites: [
          { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured large group (mandate applies) vs. self-funded ERISA (exempt) vs. small group (waiver-eligible) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Aetna Better Health of Kansas no longer exists — anything Medicaid-flavored belongs to Healthy Blue (or Sunflower/UHC) now.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age + diagnosis age', desc: 'The mandate\'s under-12 limit and its 1,300-vs-520 hour tiers key off age at diagnosis — flag edge cases for parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
      { title: '2023 Session Laws Ch. 3, SB 24', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
      { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
      { title: 'Kansas Action for Children — Aetna → Healthy Blue transition', url: 'https://www.kac.org/state_selects_companies_to_manage_kancare' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Kansas?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Kansas\'s mandate (K.S.A. 40-2,194) for fully-insured large-group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Kansas autism mandate require?', a: 'For large-group (51+) fully-insured plans: coverage for members under 12, with ABA capped at 1,300 hours/year for 4 years when diagnosed by age 5, otherwise 520 hours/year — exceedable with prior approval when medically necessary. Federal parity analysis questions whether the age limit and hour caps are enforceable, so treat cap denials as appealable.' },
      { q: 'Is Aetna a KanCare (Medicaid) plan in Kansas?', a: 'Not anymore — Aetna Better Health of Kansas lost the KanCare 3.0 contract and its members moved to Healthy Blue Kansas on 1/1/2025. Aetna cards in Kansas today are commercial.' },
      { q: 'What does Aetna pay for ABA in Kansas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. The Medicaid benchmark is only available via the KMAP interactive fee-schedule lookup, so pull current figures there before contracting conversations.' },
    ],
  },

  'cigna-kansas': {
    slug: 'cigna-kansas',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the K.S.A. 40-2,194 mandate layer; no Kansas carve-out.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Kansas',
    state: 'KS', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Kansas',
    h1: 'Cigna / Evernorth ABA coverage in Kansas: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Kansas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Kansas families — the national clinical policy, prior authorization, the K.S.A. 40-2,194 mandate (under-12 age limit, hour caps, exemptions), Kansas behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Kansas, a Cigna card means three layers at once: the carrier\'s national clinical policy, Kansas\'s autism insurance mandate (K.S.A. 40-2,194), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'K.S.A. 40-2,194 — large group (51+) only' },
      { label: 'Mandate age', value: 'Under age 12 only' },
      { label: 'Mandate caps', value: '1,300 hrs/yr × 4 yrs (dx by age 5), else 520 hrs/yr — exceedable with prior approval; parity-questioned' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA; small employers (2–50) via waiver; limited-benefit plans' },
      { label: 'Licensure', value: 'KS Licensed Behavior Analyst (BSRB), required since 7/1/2016' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Kansas',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Kansas is the legal floor underneath it: the state mandate below governs what fully-insured large-group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Kansas.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Kansas mandate: what it guarantees (and doesn\'t)',
        body: [
          'Kansas\'s mandate, K.S.A. 40-2,194, is one of the narrower ones in our directory. It reaches large-group policies, service-corporation contracts, fraternal benefit societies, and HMOs (issued/renewed after 1/1/2015; grandfathered plans from 1/1/2016), and 2023\'s SB 24 redefined "large employer" down to 51+ employees. Coverage is limited to covered individuals under age 12, and ABA carries hour-based caps: 1,300 hours/year for 4 years for a child diagnosed between birth and age 5, otherwise 520 hours/year until age 12 — though plans may exceed the caps with prior approval when medically necessary, the statute\'s own escape valve. Day care, facility-based, and school-based services are excluded; after 7/1/2016 ABA under the mandate must be delivered by providers licensed or exempt under the ABA licensure act. Small employers (2–50) can obtain a waiver by showing a 2.5%+ premium increase, self-funded ERISA plans sit outside the statute entirely, and a member diagnosed under any DSM edition cannot be forced into re-evaluation upon DSM revision. Advocacy analysis (not a regulator determination) treats the under-12 age limit and hour caps as unenforceable quantitative limits under MHPAEA for parity-covered plans — so treat cap-based denials as appealable, not final.',
        ],
        cites: [
          { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
          { title: '2023 Session Laws Ch. 3, SB 24 (employer-size amendment)', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
          { title: 'Autism Legal Resource Center — Kansas (parity analysis)', url: 'https://www.autismlegalresourcecenter.com/resources/autism-healthcare-info/kansas/' },
        ],
      },
      {
        h2: 'No Kansas-specific Cigna policy exists',
        body: [
          'We checked the current EN0499 line by line: it contains no Kansas entry and no Kansas carve-out — the national criteria apply in Kansas, subject to the standard proviso that state law and the plan contract can override. Cigna also operates no Medicaid plan in Kansas, so a Cigna card here is always commercial. That makes benefits verification (plan funding type, mandate applicability, benefit limits) the place Kansas-specific answers come from, not a carrier document.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (full text checked for a Kansas entry)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Kansas',
        body: [
          'Kansas has required licensure for practicing behavior analysts since July 1, 2016: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the applied behavior analysis licensure act (K.S.A. 65-7501 et seq.), administered by the Behavioral Sciences Regulatory Board and keyed to BACB certification — and the mandate itself conditions ABA coverage on licensed or exempt providers, so licensure is a coverage requirement, not just a credentialing one. On rates: Cigna does not publish commercial ABA fee schedules for Kansas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The usual Medicaid benchmark is also unusually opaque here: current KanCare autism-services rates are only available through the KMAP interactive fee-schedule lookup, so pull them there before a rate negotiation.',
        ],
        cites: [
          { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured large group (mandate applies) vs. self-funded ERISA (exempt) vs. small group (waiver-eligible) — it decides which rulebook governs.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age + diagnosis age', desc: 'The mandate\'s under-12 limit and its 1,300-vs-520 hour tiers key off age at diagnosis — flag edge cases for parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
      { title: '2023 Session Laws Ch. 3, SB 24', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
      { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Kansas?', a: 'Yes — under the carrier\'s national EN0499 policy for ASD (no prior auth on assessment codes; PA at the treatment step), layered on Kansas\'s mandate (K.S.A. 40-2,194) for fully-insured large-group plans. Self-funded plans are exempt from the mandate, so verify funding type first.' },
      { q: 'What does the Kansas autism mandate require?', a: 'For large-group (51+) fully-insured plans: coverage for members under 12, with ABA capped at 1,300 hours/year for 4 years when diagnosed by age 5, otherwise 520 hours/year — exceedable with prior approval when medically necessary. Federal parity analysis questions the age limit and hour caps, so treat cap denials as appealable.' },
      { q: 'What does Cigna pay for ABA in Kansas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. The Medicaid benchmark exists only via the KMAP interactive fee-schedule lookup.' },
    ],
  },

  'unitedhealthcare-kansas': {
    slug: 'unitedhealthcare-kansas',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the K.S.A. 40-2,194 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Kansas',
    state: 'KS', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Kansas',
    h1: 'UnitedHealthcare / Optum ABA coverage in Kansas: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Kansas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Kansas families — the national clinical policy, prior authorization, the K.S.A. 40-2,194 mandate (under-12 age limit, hour caps, exemptions), Kansas behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Kansas, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Kansas\'s autism insurance mandate (K.S.A. 40-2,194), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — and because UHC also runs a KanCare MCO, sorting commercial from Medicaid is the very first step.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'K.S.A. 40-2,194 — large group (51+) only' },
      { label: 'Mandate age', value: 'Under age 12 only' },
      { label: 'Mandate caps', value: '1,300 hrs/yr × 4 yrs (dx by age 5), else 520 hrs/yr — exceedable with prior approval; parity-questioned' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA; small employers (2–50) via waiver; limited-benefit plans' },
      { label: 'Licensure', value: 'KS Licensed Behavior Analyst (BSRB), required since 7/1/2016' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Kansas',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Kansas is the legal floor underneath it: the state mandate below governs what fully-insured large-group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Kansas.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Kansas mandate: what it guarantees (and doesn\'t)',
        body: [
          'Kansas\'s mandate, K.S.A. 40-2,194, is one of the narrower ones in our directory. It reaches large-group policies, service-corporation contracts, fraternal benefit societies, and HMOs (issued/renewed after 1/1/2015; grandfathered plans from 1/1/2016), and 2023\'s SB 24 redefined "large employer" down to 51+ employees. Coverage is limited to covered individuals under age 12, and ABA carries hour-based caps: 1,300 hours/year for 4 years for a child diagnosed between birth and age 5, otherwise 520 hours/year until age 12 — though plans may exceed the caps with prior approval when medically necessary, the statute\'s own escape valve. Day care, facility-based, and school-based services are excluded; after 7/1/2016 ABA under the mandate must be delivered by providers licensed or exempt under the ABA licensure act. Small employers (2–50) can obtain a waiver by showing a 2.5%+ premium increase, self-funded ERISA plans sit outside the statute entirely, and a member diagnosed under any DSM edition cannot be forced into re-evaluation upon DSM revision. Advocacy analysis (not a regulator determination) treats the under-12 age limit and hour caps as unenforceable quantitative limits under MHPAEA for parity-covered plans — so treat cap-based denials as appealable, not final.',
        ],
        cites: [
          { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
          { title: '2023 Session Laws Ch. 3, SB 24 (employer-size amendment)', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
          { title: 'Autism Legal Resource Center — Kansas (parity analysis)', url: 'https://www.autismlegalresourcecenter.com/resources/autism-healthcare-info/kansas/' },
        ],
      },
      {
        h2: 'Optum\'s Kansas entry is a Medicaid entry',
        body: [
          'Optum\'s ABA State Mandates supplemental criteria document does contain an explicit Kansas section — but it is a "For Kansas Medicaid member" section, codifying the KanCare CCTS/IIS rules (age 20 and under, 6-month diagnosis validation, 40 hours/week plan ceiling, monthly progress reviews, 6-month renewals, and an exclusion list). It governs UnitedHealthcare Community Plan of Kansas members, not commercial ones — commercial Kansas members follow the national Supplemental Clinical Criteria. Knowing the distinction keeps a Medicaid rule from being argued (in either direction) on a commercial case.',
        ],
        cites: [
          { title: 'Optum — ABA State Mandates supplemental criteria (Kansas Medicaid section)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Kansas',
        body: [
          'A family saying "we have UnitedHealthcare" in Kansas may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of Kansas, a KanCare MCO with behavioral health run by Optum — which follows the state\'s CCTS/IIS Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Kansas',
        body: [
          'Kansas has required licensure for practicing behavior analysts since July 1, 2016: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the applied behavior analysis licensure act (K.S.A. 65-7501 et seq.), administered by the Behavioral Sciences Regulatory Board and keyed to BACB certification — and the mandate itself conditions ABA coverage on licensed or exempt providers, so licensure is a coverage requirement, not just a credentialing one. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Kansas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The usual Medicaid benchmark is also unusually opaque here: current KanCare autism-services rates are only available through the KMAP interactive fee-schedule lookup, so pull them there before a rate negotiation.',
        ],
        cites: [
          { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured large group (mandate applies) vs. self-funded ERISA (exempt) vs. small group (waiver-eligible) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Kansas (KanCare Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD diagnosis confirmed with a validated tool, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age + diagnosis age', desc: 'The mandate\'s under-12 limit and its 1,300-vs-520 hour tiers key off age at diagnosis — flag edge cases for parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (Kansas Medicaid section)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'K.S.A. 40-2,194 (Kansas Revisor of Statutes)', url: 'https://ksrevisor.gov/statutes/chapters/ch40/040_002_0194.html' },
      { title: '2023 Session Laws Ch. 3, SB 24', url: 'https://sos.ks.gov/publications/sessionlaws/2023/Chapter-03-SB-24.html' },
      { title: 'K.S.A. 65-7502 — ABA licensure act definitions', url: 'https://ksrevisor.gov/statutes/chapters/ch65/065_075_0002.html' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Kansas?', a: 'Yes — under Optum\'s national two-step authorization policy for ASD, layered on Kansas\'s mandate (K.S.A. 40-2,194) for fully-insured large-group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Kansas autism mandate require?', a: 'For large-group (51+) fully-insured plans: coverage for members under 12, with ABA capped at 1,300 hours/year for 4 years when diagnosed by age 5, otherwise 520 hours/year — exceedable with prior approval when medically necessary. Federal parity analysis questions the age limit and hour caps, so treat cap denials as appealable.' },
      { q: 'Does Optum have Kansas-specific ABA criteria?', a: 'Yes, but only for Medicaid: its State Mandates supplement carries a "For Kansas Medicaid member" section (KanCare CCTS/IIS rules). Commercial Kansas members follow the national Supplemental Clinical Criteria.' },
      { q: 'What does UnitedHealthcare pay for ABA in Kansas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. The Medicaid benchmark exists only via the KMAP interactive fee-schedule lookup.' },
    ],
  },
};
