import type { PayerConfig } from './types.js';

export const newJerseyPayers: Record<string, PayerConfig> = {
  'new-jersey-medicaid': {
    slug: 'new-jersey-medicaid',
    cardDesc: 'EPSDT via 5 MCOs since 4/2020; no-PA FFS window pending enrollment, published rates.',
    assessmentPA: 'Required via the MCO — the MCO authorizes a QHP assessment; NO PA while a member is FFS pending MCO enrollment',
    treatmentPA: 'Required — MCO approval of the treatment plan is a precondition for ABA services',
    dxRequired: 'Yes — ASD (F84.0–F84.9) by a qualified healthcare professional; a comprehensive diagnostic evaluation is not required',
    payer: 'NJ FamilyCare (New Jersey Medicaid)',
    state: 'NJ', kind: 'state-medicaid',
    pill: 'Payer Guide · NJ FamilyCare',
    h1: 'NJ FamilyCare (New Jersey Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'NJ FamilyCare ABA Coverage, Rates & Prior Authorization Guide | Carelu',
    metaDescription:
      'How NJ FamilyCare covers ABA for autism under EPSDT — five-MCO administration since April 2020, the no-PA fee-for-service window pending MCO enrollment, published FFS rates and daily unit limits, QHP diagnosis rules, and NJ LBA licensure.',
    intro: [
      'NJ FamilyCare, New Jersey\'s Medicaid program, covers ABA for children with autism under the EPSDT benefit — a benefit that moved from DCF\'s Children\'s System of Care (PerformCare) to the five NJ FamilyCare MCOs on April 1, 2020. Since then the model is fully managed-care: Horizon NJ Health, Aetna Better Health, Fidelis Care, UnitedHealthcare Community Plan, and Wellpoint each prior-authorize and pay ABA through their own networks. The one big exception is a genuine intake asset: members still pending MCO enrollment are covered fee-for-service through Gainwell Technologies — and no prior authorization is required at all while a member is in that pending-enrollment window. The state also publishes real FFS rates and a daily unit guide, which the MCOs have largely adopted as claim edits.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under EPSDT; benefit launched 4/1/2020 (ages ~18 months to 21)' },
      { label: 'Administered by', value: '5 MCOs: Horizon NJ Health, Aetna Better Health, Fidelis Care, UHC Community Plan, Wellpoint' },
      { label: 'Assessment auth', value: 'Required via the MCO — but NO PA while FFS pending MCO enrollment' },
      { label: 'Treatment auth', value: 'Required — MCO treatment-plan approval is a precondition' },
      { label: 'Rates (per 15 min, FFS)', value: '97153 $15.00 · 97155 $21.25 · 97151/97156 $25.00' },
      { label: 'Daily unit guide', value: '97151 32u · 97153 32u · 97155 24u · 97156 16u — overridable under EPSDT' },
      { label: 'Licensure', value: 'NJ Licensed Applied Behavior Analyst (LBA) / assistant LaBA' },
      { label: 'Staff screening', value: 'FBI/SBI fingerprint check at LBA/LaBA licensure; monthly exclusion screening (LEIE, NJ debarment, Treasurer lists); techs ride the BACB RBT background-check floor' },
    ],
    sections: [
      {
        h2: 'The structure: five MCOs, one FFS escape hatch',
        body: [
          'The founding DMAHS newsletter (Vol. 30 No. 06, April 2020) sets the design: ABA is delivered and prior-authorized through the member\'s NJ FamilyCare MCO, with the MCO required to "authorize a QHP to assess the child for the development of a proposed treatment plan," and treatment contingent on the MCO\'s approval of that plan. Fee-for-service — billed to Gainwell Technologies, the fiscal agent — applies only to members pending MCO enrollment, and critically, no prior authorization is required while a member sits in that FFS window. For intake, that makes enrollment status a first-order routing question: a newly eligible child who hasn\'t been assigned a plan yet can start without any authorization at all, then transitions to the MCO\'s process once assigned. FFS ABA providers enroll through a dedicated "Applied Behavior Analysis Treatment Provider" packet, including fingerprint background checks per N.J.A.C. 10:77-4.9(g). DMAHS runs a dedicated Autism Line for ABA and DIR services: 609-588-8522 / MAHS.ASDinquiries@dhs.nj.gov. The current five-MCO roster (Aetna Better Health of NJ, Fidelis Care, Horizon NJ Health, UnitedHealthcare Community Plan, and Wellpoint — formerly Amerigroup NJ) is confirmed unchanged as of this review directly from DMAHS\'s own NJ FamilyCare Health Plans roster page, each still carrying the identical statewide 21-county service area.',
        ],
        cites: [
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services (4/1/2020)', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
          { title: 'NJMMIS — ABA Treatment Provider FFS enrollment packet (May 2026, Gainwell)', url: 'https://www.njmmis.com/documentDownload.aspx?document=Applied_Behavior_Analysis.pdf' },
          { title: 'NJ DMAHS — NJ FamilyCare Health Plans (current MCO roster)', url: 'https://nj.gov/humanservices/dmahs/providers-stakeholders/provider-resources/health-plans' },
        ],
      },
      {
        h2: 'Diagnosis and authorization',
        body: [
          'The benefit requires an ASD diagnosis (ICD-10 F84.0–F84.9) made by a qualified healthcare professional — physicians and psychologists (including BCBA-D psychologists) for diagnosis, with BCBAs among the QHPs for treatment planning. Notably, per Optum\'s NJ Medicaid entry (updated November 2025), a comprehensive diagnostic evaluation is not required to access ABA — a plain ASD diagnosis from a physician or psychologist opens the benefit, for members roughly 18 months to 21 years. Authorization then runs in two steps at the MCO: an assessment authorization (Horizon, for example, issues 32 units of 97151 for 30 days once eligibility, diagnosis, and an ASD script from a QHP are confirmed), followed by treatment-plan review and treatment authorizations — Horizon\'s run in 6-month spans with requests reviewed within 14 days. Non-contracted providers can request a single case provider agreement from the MCO for continuity of care.',
        ],
        cites: [
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services (4/1/2020)', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
          { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'Rates and the daily unit guide',
        body: [
          'New Jersey publishes actual FFS rates per 15-minute unit: 97151 assessment at $25.00 (BCBA/BCBA-D), 97153 direct treatment at $15.00 (RBT/BCaBA) — raised from the launch rate of $11.20 effective February 1, 2022 using American Rescue Plan funds after Autism New Jersey\'s advocacy — 97155 protocol modification at $21.25, and 97156 family training at $25.00. The 97153/97155/97156 rates are confirmed current in the NJMMIS CY2026 Q2 listing; the 97151 rate hasn\'t been seen changed since launch but its current value is unverified. The full billable set also includes the Category III destructive-behavior/multi-tech codes 0362T ($25.00) and 0373T ($16.40). The founding newsletter attaches suggested daily unit limits — 97151 32u, 97152 8u, 97153 32u, 97154 12u, 97155 24u, 97156 16u, 97157 16u, 97158 16u, 0362T 8u, 0373T 32u — "for guidance purposes only," overridable when medically necessary under EPSDT; in practice the MCOs have adopted them as MUE claim edits. One caveat for revenue modeling: the FFS rates "are not required to be utilized" by the MCOs — though Aetna Better Health published an identical schedule.',
        ],
        cites: [
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — launch rates + suggested unit limits', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
          { title: 'Autism NJ — Medicaid rate increase for ABA ($11.20 → $15.00 eff 2/1/2022)', url: 'https://autismnj.org/news/autism-new-jerseys-advocacy-leads-to-medicaid-rate-increase-for-aba-services/' },
          { title: 'ProviderSpark NJ Medicaid rates (NJMMIS Procedure Master Listing CY2026 Q2)', url: 'https://www.providerspark.com/for-providers/medicaid-rates/new-jersey/' },
        ],
      },
      {
        h2: 'Operational facts worth knowing',
        body: [
          'A few rules shape scheduling and billing. Concurrent billing: 97155 is billable while the technician bills 97153 when the QHP is directing the tech face-to-face — but supervision without the tech and patient present is not billable. School settings: the 2020 newsletter said services "may not be provided within a school facility," but Optum\'s November 2025 NJ entry now permits school-setting services as long as they don\'t occur during normal school hours — state guidance has evidently loosened, so confirm per MCO before building school-based programs. Licensure: New Jersey requires the Licensed Applied Behavior Analyst (LBA) credential — master\'s or doctorate plus current BCBA plus the NJ jurisprudence exam — with the assistant-level LaBA under an identified supervisor, per N.J.S.A. 45:8B-91 et seq. and N.J.A.C. 13:42B; the board\'s position is that supervision itself constitutes practicing behavior analysis and requires a license, while RBTs remain unlicensed under a licensee. Finally, PerformCare (DCF/CSOC) still authorizes ABA for non-Medicaid children served through DCF — ID numbers starting "3560" — so not every New Jersey ABA authorization runs through an MCO.',
        ],
        cites: [
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services (4/1/2020)', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
          { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
          { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'At the technician level, New Jersey layers a Medicaid credential on an unlicensed role. The founding DMAHS newsletter names the RBT as the technician provider — high school diploma or GED, the 40-hour training, a passed competency exam, and "close, ongoing supervision" by a BCBA-D, BCBA, or BCaBA — and its provider-specialty table lists RBT (alongside BCaBA) as the permitted renderer of 97152/97153. The state itself doesn\'t license technicians: N.J.S.A. 45:8B-103.b(2) exempts "paraprofessional technicians" delivering ABA under a licensee\'s direction, and the board\'s rules (N.J.A.C. 13:42B-1.2, effective May 6, 2024) expressly fold BACB-certified RBTs into that exempt category. MCO manuals run looser — Optum\'s 2022 NJ orientation asks only that behavior technicians be high school graduates with appropriate BCBA training and supervision, and Horizon says RBT certification is "preferred," not required — but because state FFS policy makes RBT the operative credential, hire to the RBT standard to satisfy the strictest applicable rule. That standard carries its own screening: the BACB\'s RBT 2026 requirements demand age 18+, a criminal background check plus an abuse-registry check reviewed by an attestor, the updated 40-hour training (delivered by BCBAs/BCaBAs who\'ve completed the 8-hour supervision training), and the RBT Initial Competency Assessment.',
          'Background-check obligations split by role. LBA and LaBA applicants clear a criminal history check as part of licensure — the board\'s FAQ notes application processing time depends partly on its completion — coordinated through the Division of Consumer Affairs\' Criminal History Review Unit, which runs FBI and state (SBI) fingerprint checks via New Jersey\'s contracted live-scan vendor (the CHRU\'s published board list hadn\'t yet named the ABA board when checked in mid-2026). For unlicensed technicians, no NJ statute or FamilyCare ABA policy mandating fingerprint or child-abuse-registry checks was found — the BACB\'s RBT screening is the floor, supplemented by whatever your MCO contracts add (agency-level fingerprinting at FFS enrollment, per N.J.A.C. 10:77-4.9(g), is a separate provider-enrollment matter — see above). What binds every hire regardless of role is exclusion screening: NJ guidance (updated January 2023, an obligation the state has run since 2010) requires Medicaid providers and MCOs to verify monthly that current and prospective employees, contractors, and subcontractors aren\'t excluded, unlicensed, or uncertified — searching the NJ debarment list, the federal OIG LEIE, the NJ Treasurer\'s exclusions database, and where applicable the Consumer Affairs and Department of Health licensure databases.',
          'On the supervisory side, licensure is now operational, not just on paper: P.L.2019, c.337 created the Board of Applied Behavior Analyst Examiners and bars unlicensed practice, board rules took effect May 6, 2024, applications opened September 12, 2024, and by February 2026 there were 3,506 active licensees (3,476 LBAs, 30 LaBAs). LBAs need a graduate degree plus current BCBA certification; LaBAs a bachelor\'s plus BCaBA plus an identified LBA supervisor — with supervision floors of at least 5% of practice hours weekly (or one hour every two weeks, whichever is more) in the first year, dropping to 2% or one hour monthly thereafter, face-to-face, under a supervisor who has completed the BACB 8-hour supervisor training. An LBA may delegate intervention implementation to technicians but not assessment, treatment-plan development, or intervention design — and the board holds that supervision in all its forms is itself licensed practice. Two clocks worth tracking in hiring plans: providers working under DDD contracts must hold licenses by May 6, 2027 and Early Intervention contractors by May 6, 2029, while school-district employees delivering ABA solely for their district remain exempt.',
        ],
        cites: [
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — RBT/QHP provider requirements', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
          { title: 'P.L.2019, c.337 — Applied Behavior Analyst Licensing Act (N.J.S.A. 45:8B-91 et seq.)', url: 'https://web.archive.org/web/2024id_/https://pub.njleg.state.nj.us/Bills/2018/PL19/337_.PDF' },
          { title: 'N.J.A.C. 13:42B-1.2 — Definitions (paraprofessional technician incl. RBT)', url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-13-42B-1-2' },
          { title: 'BACB RBT 2026 Requirements (July 2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
          { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
          { title: 'NJ Division of Consumer Affairs — Criminal History Review Unit', url: 'https://www.njconsumeraffairs.gov/ocp/pages/chru.aspx' },
          { title: 'Streamline Verify — Exclusion screening guidance for NJ Medicaid providers (Jan 2023)', url: 'https://streamlineverify.com/updated-guidance-on-exclusion-screening-for-new-jerseys-medicaid-providers-and-plans/' },
          { title: 'Autism NJ — Quick Guide to ABA Licensure Regulations (N.J.A.C. 13:42B)', url: 'https://autismnj.org/article/quick-guide-to-aba-licensure-regulations/' },
          { title: 'Autism NJ — Behavior Analyst Licensure in New Jersey: Where We Are Now', url: 'https://autismnj.org/article/behavior-analyst-licensure-in-new-jersey-where-we-are-now/' },
          { title: 'Optum/UHC Community Plan — NJ FamilyCare ABA Provider Orientation (2022)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/njaba/NJ.FamilyCare.Medicaid.ABA.pdf' },
          { title: 'Horizon NJ Health — Overview of ABA Services (Dec 2020)', url: 'https://www.horizonnjhealth.com/sites/default/files/2020-12/Overview%20of%20ABA%20Services.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'MCO — or pending-enrollment status', desc: 'Horizon, Aetna, Fidelis, UHC, or Wellpoint decides the portal and process; a member still pending MCO assignment can start FFS with NO prior authorization.' },
      { title: 'ASD diagnosis + script', desc: 'F84.0–F84.9 from a physician or psychologist, plus the ASD script a QHP writes — the assessment authorization trigger. No comprehensive evaluation needed.' },
      { title: 'Requested hours vs. the unit guide', desc: 'MCOs run the state daily limits as MUE edits (97153 32u/day, 97155 24u/day) — requests beyond them need explicit EPSDT medical-necessity framing.' },
      { title: 'Supervising LBA licensure', desc: 'Confirm the NJ LBA (and LaBA where applicable) — the board treats supervision itself as licensed practice.' },
      { title: 'DCF/PerformCare check', desc: 'Member IDs starting "3560" are DCF children authorized through PerformCare, not an MCO.' },
    ],
    sources: [
      { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services (4/1/2020)', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
      { title: 'Autism NJ — Medicaid rate increase for ABA services', url: 'https://autismnj.org/news/autism-new-jerseys-advocacy-leads-to-medicaid-rate-increase-for-aba-services/' },
      { title: 'NJMMIS — ABA Treatment Provider FFS enrollment packet (May 2026, Gainwell)', url: 'https://www.njmmis.com/documentDownload.aspx?document=Applied_Behavior_Analysis.pdf' },
      { title: 'ProviderSpark NJ Medicaid rates (NJMMIS CY2026 Q2)', url: 'https://www.providerspark.com/for-providers/medicaid-rates/new-jersey/' },
      { title: 'DMAHS BH Integration Points of Contact V3.1 (per-MCO ABA contacts)', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
      { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'P.L.2019, c.337 — Applied Behavior Analyst Licensing Act (N.J.S.A. 45:8B-91 et seq.)', url: 'https://web.archive.org/web/2024id_/https://pub.njleg.state.nj.us/Bills/2018/PL19/337_.PDF' },
      { title: 'N.J.A.C. 13:42B-1.2 — Definitions (paraprofessional technician incl. RBT)', url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-13-42B-1-2' },
      { title: 'BACB RBT 2026 Requirements (July 2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
      { title: 'NJ Division of Consumer Affairs — Criminal History Review Unit', url: 'https://www.njconsumeraffairs.gov/ocp/pages/chru.aspx' },
      { title: 'Streamline Verify — Exclusion screening guidance for NJ Medicaid providers (Jan 2023)', url: 'https://streamlineverify.com/updated-guidance-on-exclusion-screening-for-new-jerseys-medicaid-providers-and-plans/' },
      { title: 'Autism NJ — Quick Guide to ABA Licensure Regulations (N.J.A.C. 13:42B)', url: 'https://autismnj.org/article/quick-guide-to-aba-licensure-regulations/' },
      { title: 'Autism NJ — Behavior Analyst Licensure in New Jersey: Where We Are Now', url: 'https://autismnj.org/article/behavior-analyst-licensure-in-new-jersey-where-we-are-now/' },
      { title: 'Optum/UHC Community Plan — NJ FamilyCare ABA Provider Orientation (2022)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/njaba/NJ.FamilyCare.Medicaid.ABA.pdf' },
      { title: 'Horizon NJ Health — Overview of ABA Services (Dec 2020)', url: 'https://www.horizonnjhealth.com/sites/default/files/2020-12/Overview%20of%20ABA%20Services.pdf' },
    ],
    faq: [
      { q: 'Does NJ FamilyCare cover ABA therapy?', a: 'Yes — under EPSDT for members with autism (roughly 18 months to 21), delivered and prior-authorized through the five NJ FamilyCare MCOs since April 1, 2020.' },
      { q: 'Does the ABA assessment need prior authorization in New Jersey?', a: 'Through an MCO, yes — the MCO authorizes a QHP assessment (Horizon, for example, issues 32 units of 97151 for 30 days). But members still fee-for-service pending MCO enrollment need no prior authorization at all — a real fast-start window for newly eligible children.' },
      { q: 'What does New Jersey Medicaid pay for ABA?', a: 'FFS rates per 15-minute unit: 97153 $15.00 (raised from $11.20 in February 2022), 97155 $21.25, 97151 and 97156 $25.00, 0362T $25.00, 0373T $16.40. MCOs aren\'t required to match the FFS schedule, though Aetna Better Health published an identical one.' },
      { q: 'Is a comprehensive diagnostic evaluation required for ABA in New Jersey?', a: 'No — per Optum\'s NJ Medicaid criteria, a plain ASD diagnosis (F84.0–F84.9) from a physician or psychologist suffices; a comprehensive diagnostic evaluation is not a prerequisite.' },
    ],
  },

  'horizon-nj-health': {
    slug: 'horizon-nj-health',
    family: 'bcbs',
    cardDesc: 'Largest NJ MCO; NaviNet requests, 32-unit assessment fast-track, MCG review, 6-month auths.',
    assessmentPA: 'Required — ABA Authorization Request Form via NaviNet with an ASD script from a QHP; Horizon issues 32 units of 97151 for 30 days',
    treatmentPA: 'Required — post-assessment ABA Request Form via NaviNet; MCG-based review within 14 days; 6-month authorizations',
    dxRequired: 'Yes — ASD (F84.0–F84.9) with a diagnosis script from a qualified healthcare professional',
    payer: 'Horizon NJ Health',
    state: 'NJ', kind: 'medicaid-mco', parent: 'NJ FamilyCare',
    pill: 'Payer Guide · Horizon NJ Health',
    h1: 'Horizon NJ Health ABA coverage (NJ FamilyCare MCO).',
    metaTitle: 'Horizon NJ Health ABA Coverage & Prior Authorization Guide | Carelu',
    metaDescription:
      'How Horizon NJ Health administers NJ FamilyCare ABA — the NaviNet authorization workflow, the 32-unit/30-day assessment fast-track, MCG criteria and 6-month treatment spans, daily MUE unit limits, and the announced 2026 policy changes.',
    intro: [
      'Horizon NJ Health — the Horizon BCBSNJ Medicaid plan — is the largest NJ FamilyCare MCO and the one with the most built-out ABA machinery: its own medical policy, MCG-based utilization review, and a documented assessment fast-track. It manages ABA across Core Medicaid, DDD, MLTSS, and FIDE-SNP populations. Horizon uses the state\'s code set and daily unit table, but layers a meaningfully stricter process on top than the state baseline — and has announced further policy revisions taking effect through 2026.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NJ FamilyCare MCO (Horizon BCBSNJ) — the state\'s largest' },
      { label: 'Clinical rules', value: 'Own ABA medical policy + MCG criteria on the state code set' },
      { label: 'Assessment auth', value: 'Fast-tracked — 32 units of 97151 for 30 days on confirmed eligibility + dx' },
      { label: 'Treatment auth', value: '6-month spans; requests reviewed within 14 days of receipt' },
      { label: 'Daily unit limits', value: 'State MUE table enforced (97153 32u, 97155 24u, 97156 16u...)' },
      { label: 'Submission', value: 'NaviNet UM Request Tool / Availity; payor ID 22326' },
    ],
    sections: [
      {
        h2: 'How Horizon runs ABA authorization',
        body: [
          'The front door is the ABA Authorization Request Form submitted through NaviNet\'s UM Request Tool, with an ASD diagnosis script from a QHP attached. The assessment step is fast-tracked: once Horizon confirms eligibility, diagnosis, and the script, it issues an assessment authorization of 32 units of 97151 valid for 30 days — no full clinical review at that stage. Treatment is where the review lives: the post-assessment ABA Request Form goes back through NaviNet, a UM clinician reviews against MCG criteria, requests are reviewed within 14 days of receipt, and approved cases get 6-month authorizations. Two hard edges: Horizon enforces the state\'s daily MUE unit limits ("shall not consider for reimbursement units exceeding the daily maximum as clinically authorized"), and claims above authorized units are not reimbursed — so the authorization, not the treatment plan, is the billing ceiling.',
        ],
        cites: [
          { title: 'Horizon Behavioral Health — ABA Government Programs overview (Nov 2020)', url: 'https://www.horizonnjhealth.com/sites/default/files/2020-12/Overview%20of%20ABA%20Services.pdf' },
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — state unit-limit table', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
        ],
      },
      {
        h2: 'The 2026 changes (verify before relying)',
        body: [
          'Horizon has announced two 2026-era changes we could not fully verify against primary policy text — treat both as "confirm in the portal" items. First, a medical-policy revision effective January 1, 2026 revising criteria for prior authorization and pre-service and post-service medical-necessity reviews (search excerpts reference standardized-instrument testing no more often than every 6 months). Second, H0032 is retired for ABA on authorizations and claims effective July 15, 2026 — use the 97151–97158 / 0362T / 0373T set only — with Horizon stating that authorization requirements for ABA treatment hours are not changing as part of that move. Neither announcement could be confirmed against the live policy documents at research time, so verify the current text with Horizon before building process around the details.',
        ],
        cites: [
          { title: 'Horizon: Medical Policy Changes — ABA (eff. 1/1/2026)', url: 'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/medical-policy-changes-applied-behavior-analysis' },
          { title: 'Horizon to Stop Using H0032 for ABA Services (eff. 7/15/2026)', url: 'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/horizon-to-stop-using-h0032-for-aba-services' },
        ],
      },
      {
        h2: 'Contacts and rates',
        body: [
          'Horizon publishes real ABA escalation contacts: ABA UM escalations go to Erin McNeill (732-256-6336, erin_mcneill@horizonblue.com), the behavioral Medicaid inbox is BHMedicaid_@horizonblue.com, and member services runs at 1-800-682-9091; claims use payor ID 22326. On rates: Horizon publishes no ABA fee schedule — it aligned behavioral-health fees to the DMAHS rate increase for claims on or after March 1, 2024, but the specific ABA amounts are unverified, so treat your participating-provider agreement as the source of truth.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — Horizon ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'ASD script + diagnosis', desc: 'The QHP\'s ASD script triggers the 32-unit/30-day assessment fast-track — collect it at first contact.' },
      { title: 'Population segment', desc: 'Core Medicaid vs. DDD vs. MLTSS vs. FIDE-SNP — Horizon manages ABA across all four; note which the member is in.' },
      { title: 'Requested units per code per day', desc: 'Horizon enforces the daily MUE table; claims above authorized units are not paid.' },
      { title: 'Assessment scheduling within 30 days', desc: 'The 97151 authorization expires in 30 days — book the assessment before requesting it.' },
    ],
    sources: [
      { title: 'Horizon Behavioral Health — ABA Government Programs overview (Nov 2020)', url: 'https://www.horizonnjhealth.com/sites/default/files/2020-12/Overview%20of%20ABA%20Services.pdf' },
      { title: 'Horizon: Medical Policy Changes — ABA (eff. 1/1/2026)', url: 'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/medical-policy-changes-applied-behavior-analysis' },
      { title: 'Horizon to Stop Using H0032 for ABA Services (eff. 7/15/2026)', url: 'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/horizon-to-stop-using-h0032-for-aba-services' },
      { title: 'Horizon BCBSNJ reimbursement policy — ABA in Treatment of ASD', url: 'https://www.horizonblue.com/providers/policies-procedures/policies/reimbursement-policies-guidelines/applied-behavior-analysis-treatment-autism-spectrum-disorders' },
      { title: 'DMAHS BH Integration Points of Contact V3.1', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
    ],
    faq: [
      { q: 'Does Horizon NJ Health cover ABA therapy?', a: 'Yes — it administers the NJ FamilyCare ABA benefit under EPSDT, with its own medical policy and MCG-based review layered on the state code set. Both assessment and treatment require prior authorization via NaviNet.' },
      { q: 'How fast is Horizon\'s ABA assessment authorization?', a: 'Fast — once eligibility, an ASD diagnosis, and a QHP script are confirmed, Horizon issues a 32-unit 97151 authorization valid for 30 days without a full clinical review. Treatment requests then get MCG review within 14 days, in 6-month spans.' },
      { q: 'Is Horizon changing its ABA policy in 2026?', a: 'Two announced changes: revised PA and medical-necessity review criteria effective January 1, 2026, and retirement of H0032 for ABA effective July 15, 2026 (use 97151–97158/0362T/0373T). We could not verify the full policy text — confirm current details with Horizon directly.' },
    ],
  },

  'aetna-better-health-new-jersey': {
    slug: 'aetna-better-health-new-jersey',
    family: 'aetna',
    cardDesc: 'Closest to the state baseline: published rate sheet mirrors the FFS schedule, MUE limits verbatim.',
    assessmentPA: 'Required — ABA is on the PA list; urgent requests decided in 24 hours, routine in 7 days',
    treatmentPA: 'Required — via Availity or the BH prior authorization form; progress reports via Availity or fax (844) 404-3972',
    dxRequired: 'Yes — ASD (F84.0–F84.9) by a qualified healthcare professional (state baseline)',
    payer: 'Aetna Better Health of New Jersey',
    state: 'NJ', kind: 'medicaid-mco', parent: 'NJ FamilyCare',
    pill: 'Payer Guide · Aetna Better Health (NJ)',
    h1: 'Aetna Better Health of New Jersey ABA coverage (NJ FamilyCare MCO).',
    metaTitle: 'Aetna Better Health of New Jersey ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Aetna Better Health administers NJ FamilyCare ABA — the published rate sheet mirroring the state FFS schedule, MUE unit limits, Availity submission, PA turnaround times, and the one open rate question on 97153.',
    intro: [
      'Aetna Better Health of New Jersey is the most transparent of the five NJ FamilyCare MCOs about hewing to the state baseline: its published ABA Program sheet copies the DMAHS rates and unit limits verbatim. There\'s no distinct Aetna clinical ABA policy layered on top — authorization runs through the standard behavioral-health PA machinery on Availity, with defined turnaround clocks. The open question worth carrying into contracting: the published rate sheet still shows the launch-era $11.20 on 97153, and whether Aetna followed the state\'s 2022 increase to $15.00 is unverified.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NJ FamilyCare MCO (Aetna Medicaid)' },
      { label: 'Clinical rules', value: 'State baseline — no distinct published ABA clinical policy' },
      { label: 'Prior auth', value: 'Required — urgent decided in 24h, routine in 7 days' },
      { label: 'Published rates', value: '97151/97156 $25.00 · 97155 $21.25 · 97153 $11.20 on the 2020 sheet (state since raised to $15.00 — verify)' },
      { label: 'Unit limits', value: 'State suggested limits adopted verbatim as MUE claim edits' },
      { label: 'Submission', value: 'Availity (provider ID 46320); ABA fax (844) 404-3972' },
    ],
    sections: [
      {
        h2: 'The state schedule, republished',
        body: [
          'Aetna\'s ABA Program sheet (effective 4/1/2020) publishes rates identical to the state FFS schedule — 97151 $25.00, 97153 $11.20, 97155 $21.25, 97156 $25.00, 0362T $25.00, 0373T $16.40 — and adopts the state\'s suggested daily unit limits verbatim, explicitly labeling them MUE (medically-unlikely-edit) limits: functionally claim edits, not soft guidance. The catch is the technician rate: the state raised 97153 from $11.20 to $15.00 effective February 1, 2022, and whether Aetna followed on its own schedule is unverified — make it an explicit contracting question rather than an assumption.',
        ],
        cites: [
          { title: 'Aetna Better Health NJ — ABA Program rates (eff. 4/1/2020)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/newjersey/pdf/Applied%20behavioral%20analysis%20program.pdf' },
          { title: 'Autism NJ — Medicaid rate increase ($11.20 → $15.00 eff 2/1/2022)', url: 'https://autismnj.org/news/autism-new-jerseys-advocacy-leads-to-medicaid-rate-increase-for-aba-services/' },
        ],
      },
      {
        h2: 'Authorization mechanics',
        body: [
          'ABA sits on the plan\'s prior-authorization list, with urgent requests decided within 24 hours and routine requests within 7 days. Requests go through Availity or on the plan\'s behavioral-health prior authorization form; progress reports upload via Availity or fax to (844) 404-3972, and the plan phone is 1-855-232-3596. Claims run through Availity or Office Ally under provider ID 46320; appeals go to NJAppealsandGrievances@AETNA.com. Named clinical ABA contacts (per the state\'s BH integration contact sheet) are Alyx Llorens and Vincenza Stone. The plan also maintains a published ABA/DIR provider directory PDF — useful for checking how your listing appears to referring families.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — Aetna ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
          { title: 'Aetna Better Health NJ — BH prior authorization request form', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/new-jersey-medicaid/provider/pdf/aetna_bh_prior_auth_form.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'ASD diagnosis + QHP script', desc: 'The state baseline applies — diagnosis from a physician/psychologist opens the assessment authorization.' },
      { title: 'Urgency classification', desc: 'Urgent requests get 24-hour decisions vs. 7 days routine — classify honestly but deliberately.' },
      { title: 'Requested units vs. MUE limits', desc: 'Aetna runs the state daily limits as hard claim edits — plan intensity within them or document the EPSDT override.' },
      { title: 'Current 97153 contract rate', desc: 'The published sheet predates the state\'s $15.00 increase — confirm what your contract actually pays.' },
    ],
    sources: [
      { title: 'Aetna Better Health NJ — ABA Program rates (eff. 4/1/2020)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/newjersey/pdf/Applied%20behavioral%20analysis%20program.pdf' },
      { title: 'DMAHS BH Integration Points of Contact V3.1 — Aetna ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
      { title: 'Aetna Better Health NJ — BH prior authorization request form', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/new-jersey-medicaid/provider/pdf/aetna_bh_prior_auth_form.pdf' },
    ],
    faq: [
      { q: 'Does Aetna Better Health of New Jersey cover ABA?', a: 'Yes — it administers the NJ FamilyCare ABA benefit closest to the state baseline of all five MCOs, with a published rate sheet and unit limits copied from the DMAHS schedule. PA is required, via Availity or the BH prior auth form.' },
      { q: 'What does Aetna Better Health NJ pay for ABA?', a: 'Its published 2020 sheet mirrors the state FFS schedule: $25.00 for 97151/97156, $21.25 for 97155, and $11.20 for 97153. The state raised 97153 to $15.00 in February 2022 — whether Aetna followed is unverified, so confirm in your contract.' },
      { q: 'How fast does Aetna Better Health NJ decide ABA authorizations?', a: 'Urgent requests within 24 hours; routine requests within 7 days. Progress reports go via Availity or fax (844) 404-3972.' },
    ],
  },

  'fidelis-care-new-jersey': {
    slug: 'fidelis-care-new-jersey',
    family: 'centene',
    cardDesc: 'Ex-WellCare Centene plan; state-baseline ABA with no published plan policy — verify specifics.',
    assessmentPA: 'Required — NJ FamilyCare baseline (the MCO authorizes a QHP assessment); Fidelis-specific ABA form detail is unpublished',
    treatmentPA: 'Required — state baseline; outpatient auth requests via provider.fideliscarenj.com or fax (888) 339-2677',
    dxRequired: 'Yes — ASD (F84.0–F84.9) by a qualified healthcare professional (state baseline)',
    payer: 'Fidelis Care New Jersey (formerly WellCare)',
    state: 'NJ', kind: 'medicaid-mco', parent: 'NJ FamilyCare',
    pill: 'Payer Guide · Fidelis Care (NJ)',
    h1: 'Fidelis Care New Jersey ABA coverage (NJ FamilyCare MCO).',
    metaTitle: 'Fidelis Care New Jersey (NJ FamilyCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Fidelis Care (formerly WellCare of NJ, a Centene plan) administers NJ FamilyCare ABA — state-baseline coverage through generic Centene BH machinery, portal and fax channels, named ABA contacts, and the gaps to verify directly.',
    intro: [
      'Fidelis Care New Jersey — the Centene plan formerly branded WellCare of NJ — administers the NJ FamilyCare ABA benefit with the least published detail of the five MCOs. Our best-evidence read: it runs the state benefit through generic Centene behavioral-health UM machinery, with no distinct ABA clinical policy, fee schedule, or unit-cap document surfaced anywhere public. That makes this a state-baseline plan with gaps — the clinical rules to plan against are NJ FamilyCare\'s, and the plan-specific specifics (forms, caps, rates) are phone calls, not lookups.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NJ FamilyCare MCO (Centene; formerly WellCare of NJ)' },
      { label: 'Clinical rules', value: 'State baseline — no NJ-specific published ABA policy found' },
      { label: 'Prior auth', value: 'Required per the state benefit design; plan-specific ABA form unpublished' },
      { label: 'Submission', value: 'provider.fideliscarenj.com or fax (888) 339-2677' },
      { label: 'Unit caps / rates', value: 'Unverified — nothing published; confirm directly with the plan' },
      { label: 'Claims', value: 'Availity clearinghouse, payor ID 14163; provider services 1-888-453-2534' },
    ],
    sections: [
      {
        h2: 'A state-baseline plan — and what that means in practice',
        body: [
          'No Fidelis-specific ABA clinical policy, fee schedule, or hour-cap document has been published — the plan appears to defer to the state criteria (unverified). Practically, plan requests against the NJ FamilyCare baseline: an ASD diagnosis from a QHP, an MCO-authorized assessment, and treatment contingent on treatment-plan approval, with the state\'s daily unit guide as the likely claim-edit surface. Outpatient authorization requests go through the provider portal at provider.fideliscarenj.com or by fax to (888) 339-2677, with progress reports uploaded via the portal or faxed. Because nothing ABA-specific is published, confirm assessment-request format, authorization spans, and unit handling with the plan\'s UM contact before your first submission rather than after your first denial.',
        ],
        cites: [
          { title: 'Fidelis Care NJ — Authorizations', url: 'https://www.fideliscarenj.com/providers/medicaid/authorizations.html' },
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — the state baseline', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
        ],
      },
      {
        h2: 'Contacts and identity housekeeping',
        body: [
          'The state\'s BH integration contact sheet — which still titles the plan "Fidelis Care (Formerly Wellcare)" — names the ABA UM/PA contact as Amber Johnson (770-809-7313, Amber.Johnson@centene.com) and the ABA contracting contact as Michael Czajkowski (862-702-6529, Michael.Czajkowski@fideliscarenj.com). Provider services runs at 1-888-453-2534; claims route through Availity under payor ID 14163, and claims disputes mail to Tampa, FL (Centene shared services). Watch the rebrand at intake: families, cards, and stale directory listings may still say WellCare — it\'s the same plan.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — Fidelis ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan identity on "WellCare" inquiries', desc: 'WellCare of NJ is now Fidelis Care — same plan, new name; verify the current card.' },
      { title: 'ASD diagnosis + QHP script', desc: 'The state baseline applies — collect the diagnosis and script that trigger the assessment authorization.' },
      { title: 'UM confirmation before first submission', desc: 'No ABA-specific forms or caps are published — call the ABA UM contact to confirm format and spans up front.' },
      { title: 'Requested units vs. the state guide', desc: 'Absent published plan caps, assume the state daily unit table is the edit surface.' },
    ],
    sources: [
      { title: 'DMAHS BH Integration Points of Contact V3.1 — Fidelis ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
      { title: 'Fidelis Care NJ — Authorizations', url: 'https://www.fideliscarenj.com/providers/medicaid/authorizations.html' },
      { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
    ],
    faq: [
      { q: 'Does Fidelis Care New Jersey cover ABA?', a: 'Yes — it administers the NJ FamilyCare ABA benefit (EPSDT, ASD diagnosis, MCO-authorized assessment and treatment plan). No plan-specific ABA policy is published, so the state baseline is the rulebook to plan against.' },
      { q: 'Is Fidelis Care NJ the same as WellCare?', a: 'Yes — WellCare of NJ rebranded to Fidelis Care under Centene. The state\'s own contact documents still carry both names.' },
      { q: 'What does Fidelis Care NJ pay for ABA?', a: 'Unverified — no fee schedule or ABA rate document is published. Your provider contract is the only source of truth; benchmark against the state FFS schedule ($15.00/unit 97153, $21.25 97155, $25.00 97151/97156).' },
    ],
  },

  'unitedhealthcare-community-plan-new-jersey': {
    slug: 'unitedhealthcare-community-plan-new-jersey',
    family: 'unitedhealthcare',
    cardDesc: 'Optum-run; no comprehensive eval needed, school setting OK outside school hours, Provider Express intake.',
    assessmentPA: 'Required — NJ FamilyCare baseline; ABA/DIR requests via Optum\'s dedicated NJ ABA path on Provider Express (BH intake 1-888-362-3368, option 3)',
    treatmentPA: 'Required — via the Provider Express NJ ABA request path; authorization inquiry at providerexpress.com',
    dxRequired: 'Yes — ASD (F84.0–F84.9) by a physician or psychologist; a comprehensive diagnostic evaluation is NOT required (BH803ABASTM12026)',
    payer: 'UnitedHealthcare Community Plan (NJ FamilyCare)',
    state: 'NJ', kind: 'medicaid-mco', parent: 'NJ FamilyCare',
    pill: 'Payer Guide · UHC Community Plan (NJ)',
    h1: 'UnitedHealthcare Community Plan of New Jersey ABA coverage (NJ FamilyCare MCO).',
    metaTitle: 'UHC Community Plan New Jersey (NJ FamilyCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers NJ FamilyCare ABA through Optum — the November 2025 NJ criteria (no comprehensive evaluation required, ages 18 months to 21, school setting outside school hours), Provider Express intake, and contacts.',
    intro: [
      'UnitedHealthcare Community Plan administers its NJ FamilyCare ABA benefit through Optum Behavioral Health, governed by Optum\'s ABA supplemental criteria plus a dedicated New Jersey Medicaid entry in the ABA State Mandates document (BH803ABASTM12026, revised November 18, 2025, effective January 2026). Substantively it follows the state benefit design — but wraps it in Optum\'s Provider Express intake, forms, and documentation culture, a different operational world from the state baseline. Two of its written positions are genuinely family-friendly: no comprehensive diagnostic evaluation is required, and school-setting services are permitted outside normal school hours.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NJ FamilyCare MCO — BH administered by Optum' },
      { label: 'Clinical rules', value: 'Optum ABA criteria + a dedicated NJ Medicaid entry (rev. 11/18/2025)' },
      { label: 'Diagnosis bar', value: 'ASD dx by physician/psychologist — comprehensive evaluation NOT required' },
      { label: 'Ages', value: '18 months to 21 years, by medical necessity — no stated hour caps' },
      { label: 'School setting', value: 'Permitted outside normal school hours (newer than the state\'s 2020 rule)' },
      { label: 'Submission', value: 'Provider Express NJ ABA path; BH intake 1-888-362-3368 (opt. 3); payer ID 87726' },
    ],
    sections: [
      {
        h2: 'The Optum NJ entry: the friendliest diagnosis bar in the state',
        body: [
          'Optum\'s NJ Medicaid entry states explicitly that "a comprehensive diagnostic evaluation is not required to access ABA services" — any physician or psychologist ASD diagnosis (F84.0–F84.9) opens the benefit, for members 18 months to 21 years, with coverage keyed to medical necessity and no stated NJ hour caps. It also enumerates the QHP roles and permits services in the school setting as long as they don\'t occur during normal school hours — a newer, looser position than the state\'s 2020 "no school facility" rule. For intake this means: don\'t hold a UHC family waiting on a full diagnostic workup, and don\'t rule out after-school programming on school grounds. The NJ entry was specifically revised in the November 18, 2025 interim review, so it reflects current Optum thinking.',
        ],
        cites: [
          { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'Submission mechanics and contacts',
        body: [
          'ABA and DIR requests submit through Optum\'s dedicated NJ ABA page on Provider Express (the state\'s own contact document links abaNJ.html — the direct URL returned a 404 in mid-2026, so navigate from providerexpress.com rather than a saved bookmark); general behavioral-health PA runs by phone at 1-888-362-3368, option 3 for intake, and claims use payer ID 87726. Optum also maintains a dedicated Network Manager for Autism Services — Joelle Carrion (jcarrion@optum.com, 612-474-7148) — a named human for contracting and escalation that most plans don\'t offer. Rates are unverified: no NJ ABA fee schedule is published, so your Optum participation agreement is the source of truth.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — UHC/Optum ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
          { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'ASD diagnosis — any physician/psychologist', desc: 'No comprehensive evaluation needed; a plain dx opens the benefit. Don\'t queue families for a full workup first.' },
      { title: 'Age check (18 months–21 years)', desc: 'Optum\'s NJ entry states the range explicitly — flag edge cases early.' },
      { title: 'Optum credentialing status', desc: 'ABA runs on the Optum behavioral network via Provider Express — separate from UHC medical.' },
      { title: 'School-setting plans', desc: 'Billable outside normal school hours per Optum\'s NJ entry — capture the school schedule to design around it.' },
    ],
    sources: [
      { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'DMAHS BH Integration Points of Contact V3.1 — UHC/Optum ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of New Jersey cover ABA?', a: 'Yes — the NJ FamilyCare ABA benefit, administered by Optum Behavioral Health under Optum\'s criteria plus a dedicated NJ Medicaid entry (revised November 2025). Requests go through Provider Express\'s NJ ABA path.' },
      { q: 'Does UHC NJ Medicaid require a comprehensive diagnostic evaluation for ABA?', a: 'No — Optum\'s NJ entry says so explicitly. An ASD diagnosis (F84.0–F84.9) from any physician or psychologist opens the benefit for members 18 months to 21 years.' },
      { q: 'Can ABA be delivered in schools for UHC NJ members?', a: 'Yes, outside normal school hours — Optum\'s NJ entry permits school-setting services as long as they don\'t occur during the school day, a looser position than the state\'s original 2020 rule.' },
    ],
  },

  'wellpoint-new-jersey': {
    slug: 'wellpoint-new-jersey',
    family: 'anthem',
    cardDesc: 'Ex-Amerigroup Elevance plan; state-baseline ABA via Availity, with Carelon running the BH network.',
    assessmentPA: 'Required — NJ FamilyCare baseline; ABA authorization via Availity or (800) 454-3730',
    treatmentPA: 'Required — same channel; outpatient Medicaid fax (844) 442-8007',
    dxRequired: 'Yes — ASD (F84.0–F84.9) by a qualified healthcare professional (state baseline)',
    payer: 'Wellpoint New Jersey (formerly Amerigroup)',
    state: 'NJ', kind: 'medicaid-mco', parent: 'NJ FamilyCare',
    pill: 'Payer Guide · Wellpoint (NJ)',
    h1: 'Wellpoint New Jersey ABA coverage (NJ FamilyCare MCO).',
    metaTitle: 'Wellpoint New Jersey (NJ FamilyCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Wellpoint (formerly Amerigroup New Jersey) administers NJ FamilyCare ABA — state-baseline coverage with the behavioral network run through Carelon, Availity authorization channels, the separate Carelon contracting funnel, and named ABA contacts.',
    intro: [
      'Wellpoint New Jersey — the Elevance plan formerly branded Amerigroup — administers the NJ FamilyCare ABA benefit as a state-baseline plan: no distinct ABA clinical criteria, unit caps, or fee schedule have been published. Its defining structural quirk is that the behavioral-health network runs through Carelon Behavioral Health, which means ABA contracting is a separate funnel from the medical plan — a routing fact that costs weeks when discovered late. Authorization itself flows through familiar Availity plumbing.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NJ FamilyCare MCO (Elevance; formerly Amerigroup NJ)' },
      { label: 'Clinical rules', value: 'State baseline — no NJ-specific published ABA policy found' },
      { label: 'Prior auth', value: 'Required per the state benefit; via Availity or (800) 454-3730' },
      { label: 'BH network / UM', value: 'Carelon Behavioral Health — a separate contracting funnel' },
      { label: 'Unit caps / rates', value: 'Unverified — nothing published; confirm directly with the plan' },
      { label: 'Claims', value: 'Availity, payor ID WLPNT; provider services (833) 731-2149' },
    ],
    sections: [
      {
        h2: 'State-baseline rules, Carelon plumbing',
        body: [
          'With no published Wellpoint-specific ABA criteria, plan requests against the NJ FamilyCare baseline: ASD diagnosis from a QHP, MCO-authorized assessment, treatment contingent on plan approval, and the state daily unit guide as the likely edit surface. Mechanically, ABA authorization submits through Availity (availity.com) or by phone at (800) 454-3730, with forms at provider.wellpoint.com/new-jersey-provider/resources/forms and outpatient Medicaid fax (844) 442-8007. Because hour caps and rates are unpublished, confirm authorization spans and unit handling with the plan before the first submission — and treat your contract as the only rate source.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — Wellpoint ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
          { title: 'DMAHS Provider Newsletter Vol 30 No 06 — the state baseline', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
        ],
      },
      {
        h2: 'The Carelon funnel, and who to call',
        body: [
          'ABA network contracting runs through Carelon Behavioral Health (provider.relations.NJ@carelon.com) — a separate funnel from the Wellpoint medical plan, so a practice contracted for medical services isn\'t automatically in the ABA network. The named ABA clinical contact is Ann Basil, LCSW, Director of BH Services (732-713-7636, ann.basil@wellpoint.com). Provider services runs at (833) 731-2149 / (800) 454-3730. And watch the rebrand at intake: cards and directory listings may still say Amerigroup — same plan, new name.',
        ],
        cites: [
          { title: 'DMAHS BH Integration Points of Contact V3.1 — Wellpoint ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan identity on "Amerigroup" inquiries', desc: 'Amerigroup NJ is now Wellpoint — verify the current card.' },
      { title: 'ASD diagnosis + QHP script', desc: 'The state baseline applies — collect the diagnosis and script that trigger the assessment authorization.' },
      { title: 'Carelon contracting status', desc: 'ABA contracting runs through Carelon, separately from the medical plan — confirm you\'re in the right network before quoting start dates.' },
      { title: 'Requested units vs. the state guide', desc: 'Absent published plan caps, assume the state daily unit table is the edit surface.' },
    ],
    sources: [
      { title: 'DMAHS BH Integration Points of Contact V3.1 — Wellpoint ABA contacts', url: 'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf' },
      { title: 'DMAHS Provider Newsletter Vol 30 No 06 — Provision of ABA services', url: 'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf' },
    ],
    faq: [
      { q: 'Does Wellpoint New Jersey cover ABA?', a: 'Yes — it administers the NJ FamilyCare ABA benefit on the state baseline (EPSDT, ASD diagnosis, MCO-authorized assessment and treatment plan), with authorization via Availity or (800) 454-3730. No plan-specific ABA criteria are published.' },
      { q: 'Is Wellpoint NJ the same as Amerigroup?', a: 'Yes — Amerigroup New Jersey rebranded to Wellpoint under Elevance. Cards and directories may still carry the old name.' },
      { q: 'How do I join Wellpoint NJ\'s ABA network?', a: 'Through Carelon Behavioral Health (provider.relations.NJ@carelon.com) — a separate contracting funnel from the Wellpoint medical plan. Being contracted for medical services doesn\'t put you in the ABA network.' },
    ],
  },

  'aetna-new-jersey': {
    slug: 'aetna-new-jersey',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the P.L. 2009, c.115 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in New Jersey',
    state: 'NJ', kind: 'commercial',
    pill: 'Payer Guide · Aetna · New Jersey',
    h1: 'Aetna ABA coverage in New Jersey: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in New Jersey: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for New Jersey families — the national clinical policy, prior authorization, the P.L. 2009, c.115 mandate (ages, the parity-voided $36k cap, exemptions), New Jersey behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in New Jersey, an Aetna card means three layers at once: the carrier\'s national clinical policy, New Jersey\'s autism insurance mandate (P.L. 2009, c.115), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'P.L. 2009, c.115 (N.J.S.A. 17:48-6ii and parallel sections)' },
      { label: 'Mandate age', value: 'Under 21 in statute; IHC/SEH markets extended to adults 21+ (Jan 2015)' },
      { label: 'Mandate caps', value: '$36,000/yr in statute — voided for MHPAEA group plans (DOBI Bulletin 10-02)' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (may exclude ABA entirely)' },
      { label: 'Licensure', value: 'NJ Licensed Applied Behavior Analyst (Consumer Affairs board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New Jersey',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in New Jersey is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover (Aetna\'s CPBs state that applicable state mandates take precedence for fully insured plans), while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in New Jersey.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The New Jersey mandate: strong, and stronger than it reads',
        body: [
          'P.L. 2009, c.115 (effective February 9, 2010, codified across N.J.S.A. 17:48-6ii and parallel sections for insurers, HMOs, individual and small-employer plans, plus the SHBP and SEHBP) requires state-regulated plans to cover autism screening and diagnosis, medically necessary PT/OT/ST for autism or other developmental disabilities, and medically necessary ABA-based behavioral interventions for autism in individuals under 21 — coverage owed even when services aren\'t restorative. The statute\'s headline limitation, a $36,000/year ABA cap, is largely dead: DOBI Bulletin 10-02 held the cap cannot be applied to group health plans subject to MHPAEA, because New Jersey classifies autism as a biologically-based mental illness and dollar limits conflict with federal parity — leaving it live mainly in nongroup policies. The IHC and SEH program boards went further in amendments effective January 2015, extending ABA to adults 21+ and removing therapy visit limits in the individual and small-employer markets. Practical current state: state-regulated plans cover medically necessary ABA without dollar caps. Self-funded ERISA plans remain exempt and may exclude ABA entirely.',
        ],
        cites: [
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage (eff. Jan 2015)', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
        ],
      },
      {
        h2: 'Aetna Medicaid in New Jersey',
        body: [
          'A family saying "we have Aetna" in New Jersey may actually be on the carrier\'s Medicaid plan — Aetna Better Health of New Jersey, an NJ FamilyCare MCO — which follows the state Medicaid rules (and publishes a rate sheet mirroring the state FFS schedule), not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in New Jersey',
        body: [
          'New Jersey licenses behavior analysts through the State Board of Applied Behavior Analyst Examiners at the Division of Consumer Affairs: the Licensed Applied Behavior Analyst (LBA — master\'s or doctorate, current BCBA/BCBA-D, and the NJ jurisprudence exam) and the assistant-level LaBA, under N.J.S.A. 45:8B-91 et seq. and N.J.A.C. 13:42B. The board\'s position is that supervision in all its forms constitutes practicing behavior analysis and requires a license; RBTs are unlicensed and work under a licensee. On rates: Aetna does not publish commercial ABA fee schedules for New Jersey (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against NJ FamilyCare\'s published FFS schedule ($15.00/unit for 97153, $21.25 for 97155, $25.00 for 97151/97156) and treat rate-setting as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies, no dollar cap in practice) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. Aetna Better Health of New Jersey (NJ FamilyCare Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Under 21 for the statutory ABA prong — but IHC/SEH-market plans extend ABA to adults, so flag 21+ cases for market analysis rather than turning them away.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in New Jersey?', a: 'Yes — under the carrier\'s national policy for ASD, layered on New Jersey\'s mandate (P.L. 2009, c.115) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does the $36,000 ABA cap in New Jersey\'s mandate still apply?', a: 'Mostly not — DOBI Bulletin 10-02 held the cap cannot be applied to group plans subject to federal parity (MHPAEA), since New Jersey treats autism as a biologically-based mental illness. In practice, state-regulated plans cover medically necessary ABA without dollar caps; the cap survives mainly in nongroup policies.' },
      { q: 'What does Aetna pay for ABA in New Jersey?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against NJ FamilyCare\'s FFS schedule ($15.00 for 97153, $25.00 for 97151/97156 per 15-minute unit) and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-new-jersey': {
    slug: 'cigna-new-jersey',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the P.L. 2009, c.115 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in New Jersey',
    state: 'NJ', kind: 'commercial',
    pill: 'Payer Guide · Cigna · New Jersey',
    h1: 'Cigna / Evernorth ABA coverage in New Jersey: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in New Jersey: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for New Jersey families — the national EN0499 policy with no assessment PA, the P.L. 2009, c.115 mandate (ages, the parity-voided $36k cap, exemptions), New Jersey behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in New Jersey, a Cigna card means three layers at once: the carrier\'s national clinical policy, New Jersey\'s autism insurance mandate (P.L. 2009, c.115), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'P.L. 2009, c.115 (N.J.S.A. 17:48-6ii and parallel sections)' },
      { label: 'Mandate age', value: 'Under 21 in statute; IHC/SEH markets extended to adults 21+ (Jan 2015)' },
      { label: 'Mandate caps', value: '$36,000/yr in statute — voided for MHPAEA group plans (DOBI Bulletin 10-02)' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (may exclude ABA entirely)' },
      { label: 'Licensure', value: 'NJ Licensed Applied Behavior Analyst (Consumer Affairs board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New Jersey',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. And unlike Virginia — the one state whose fully-insured business the current EN0499 (effective 5/15/2026) carves out of the policy — New Jersey has no carve-out: EN0499 applies, with the state mandate below as the legal floor for fully-insured plans and ERISA plus federal parity governing self-funded ones. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in New Jersey.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The New Jersey mandate: strong, and stronger than it reads',
        body: [
          'P.L. 2009, c.115 (effective February 9, 2010, codified across N.J.S.A. 17:48-6ii and parallel sections for insurers, HMOs, individual and small-employer plans, plus the SHBP and SEHBP) requires state-regulated plans to cover autism screening and diagnosis, medically necessary PT/OT/ST for autism or other developmental disabilities, and medically necessary ABA-based behavioral interventions for autism in individuals under 21 — coverage owed even when services aren\'t restorative. The statute\'s headline limitation, a $36,000/year ABA cap, is largely dead: DOBI Bulletin 10-02 held the cap cannot be applied to group health plans subject to MHPAEA, because New Jersey classifies autism as a biologically-based mental illness and dollar limits conflict with federal parity — leaving it live mainly in nongroup policies. The IHC and SEH program boards went further in amendments effective January 2015, extending ABA to adults 21+ and removing therapy visit limits in the individual and small-employer markets. Practical current state: state-regulated plans cover medically necessary ABA without dollar caps. Self-funded ERISA plans remain exempt and may exclude ABA entirely.',
        ],
        cites: [
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage (eff. Jan 2015)', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
        ],
      },
      {
        h2: 'No New Jersey-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no New Jersey-specific ABA policy, form, or supplement, and runs no NJ Medicaid plan — the national EN0499 policy plus the state mandate is the whole picture. That\'s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where New Jersey-specific answers come from, not a carrier document. One EN0499 detail with a New Jersey wrinkle: the policy excludes Rett syndrome from its ASD definition — and DOBI\'s implementing bulletin similarly notes carriers may exclude clear Rett and CDD diagnoses from the mandate\'s autism definition, but must still consider them under the mandate\'s developmental-disability therapy prongs.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in New Jersey',
        body: [
          'New Jersey licenses behavior analysts through the State Board of Applied Behavior Analyst Examiners at the Division of Consumer Affairs: the Licensed Applied Behavior Analyst (LBA — master\'s or doctorate, current BCBA/BCBA-D, and the NJ jurisprudence exam) and the assistant-level LaBA, under N.J.S.A. 45:8B-91 et seq. and N.J.A.C. 13:42B. The board\'s position is that supervision in all its forms constitutes practicing behavior analysis and requires a license; RBTs are unlicensed and work under a licensee. On rates: Cigna does not publish commercial ABA fee schedules for New Jersey (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against NJ FamilyCare\'s published FFS schedule ($15.00/unit for 97153, $21.25 for 97155, $25.00 for 97151/97156) and treat rate-setting as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies, no dollar cap in practice) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — noting EN0499\'s Rett exclusion.' },
      { title: 'Age', desc: 'Under 21 for the statutory ABA prong — but IHC/SEH-market plans extend ABA to adults, so flag 21+ cases for market analysis rather than turning them away.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in New Jersey?', a: 'Yes — under the carrier\'s national EN0499 policy for ASD (no PA on assessment codes 97151/97152/0362T), layered on New Jersey\'s mandate (P.L. 2009, c.115) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does EN0499 apply to New Jersey fully-insured plans?', a: 'Yes — unlike Virginia, New Jersey has no carve-out in the current EN0499. NJ fully-insured plans sit under the policy\'s generic state-mandate language, with P.L. 2009, c.115 controlling as the state mandate.' },
      { q: 'Does the $36,000 ABA cap in New Jersey\'s mandate still apply?', a: 'Mostly not — DOBI Bulletin 10-02 held the cap cannot be applied to group plans subject to federal parity (MHPAEA). In practice, state-regulated plans cover medically necessary ABA without dollar caps; the cap survives mainly in nongroup policies.' },
    ],
  },

  'unitedhealthcare-new-jersey': {
    slug: 'unitedhealthcare-new-jersey',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the P.L. 2009, c.115 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in New Jersey',
    state: 'NJ', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · New Jersey',
    h1: 'UnitedHealthcare / Optum ABA coverage in New Jersey: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in New Jersey: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for New Jersey families — the national clinical policy, prior authorization, the P.L. 2009, c.115 mandate (ages, the parity-voided $36k cap, exemptions), New Jersey behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in New Jersey, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, New Jersey\'s autism insurance mandate (P.L. 2009, c.115), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'P.L. 2009, c.115 (N.J.S.A. 17:48-6ii and parallel sections)' },
      { label: 'Mandate age', value: 'Under 21 in statute; IHC/SEH markets extended to adults 21+ (Jan 2015)' },
      { label: 'Mandate caps', value: '$36,000/yr in statute — voided for MHPAEA group plans (DOBI Bulletin 10-02)' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (may exclude ABA entirely)' },
      { label: 'Licensure', value: 'NJ Licensed Applied Behavior Analyst (Consumer Affairs board)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New Jersey',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in New Jersey is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in New Jersey.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The New Jersey mandate: strong, and stronger than it reads',
        body: [
          'P.L. 2009, c.115 (effective February 9, 2010, codified across N.J.S.A. 17:48-6ii and parallel sections for insurers, HMOs, individual and small-employer plans, plus the SHBP and SEHBP) requires state-regulated plans to cover autism screening and diagnosis, medically necessary PT/OT/ST for autism or other developmental disabilities, and medically necessary ABA-based behavioral interventions for autism in individuals under 21 — coverage owed even when services aren\'t restorative. The statute\'s headline limitation, a $36,000/year ABA cap, is largely dead: DOBI Bulletin 10-02 held the cap cannot be applied to group health plans subject to MHPAEA, because New Jersey classifies autism as a biologically-based mental illness and dollar limits conflict with federal parity — leaving it live mainly in nongroup policies. The IHC and SEH program boards went further in amendments effective January 2015, extending ABA to adults 21+ and removing therapy visit limits in the individual and small-employer markets. Practical current state: state-regulated plans cover medically necessary ABA without dollar caps. Self-funded ERISA plans remain exempt and may exclude ABA entirely.',
        ],
        cites: [
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage (eff. Jan 2015)', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
        ],
      },
      {
        h2: 'Optum\'s New Jersey entry is a Medicaid entry',
        body: [
          'Optum\'s ABA State Mandates document (BH803ABASTM12026, effective January 2026) does carry a dedicated New Jersey section — but it\'s "For New Jersey Medicaid members" only, governing the carrier\'s NJ FamilyCare plan (no comprehensive diagnostic evaluation required, ages 18 months to 21, school setting outside school hours). There is no New Jersey commercial-specific entry, so commercial members ride on the national Supplemental Clinical Criteria plus the state mandate. Don\'t let the Medicaid entry\'s looser diagnosis bar bleed into commercial expectations: the national criteria\'s validated-tool diagnostic standard still applies to commercial requests.',
        ],
        cites: [
      { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in New Jersey',
        body: [
          'A family saying "we have UnitedHealthcare" in New Jersey may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan, an NJ FamilyCare MCO with behavioral health administered by Optum — which follows the state Medicaid rules and Optum\'s NJ Medicaid entry, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in New Jersey',
        body: [
          'New Jersey licenses behavior analysts through the State Board of Applied Behavior Analyst Examiners at the Division of Consumer Affairs: the Licensed Applied Behavior Analyst (LBA — master\'s or doctorate, current BCBA/BCBA-D, and the NJ jurisprudence exam) and the assistant-level LaBA, under N.J.S.A. 45:8B-91 et seq. and N.J.A.C. 13:42B. The board\'s position is that supervision in all its forms constitutes practicing behavior analysis and requires a license; RBTs are unlicensed and work under a licensee. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for New Jersey (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against NJ FamilyCare\'s published FFS schedule ($15.00/unit for 97153, $21.25 for 97155, $25.00 for 97151/97156) and treat rate-setting as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies, no dollar cap in practice) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan (NJ FamilyCare Medicaid) — different rules, different diagnosis bar, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD diagnosis with a validated tool (ADI-R, ADOS-2) for commercial — the looser Medicaid standard doesn\'t apply here.' },
      { title: 'Age', desc: 'Under 21 for the statutory ABA prong — but IHC/SEH-market plans extend ABA to adults, so flag 21+ cases for market analysis rather than turning them away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum ABA State Mandates BH803ABASTM12026 — NJ Medicaid entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'NJ DOBI Bulletin 10-02 — Implementation of P.L. 2009, c.115', url: 'https://www.nj.gov/dobi/bulletins/blt10_02.pdf' },
      { title: 'Autism NJ — Amendments to Insurance Mandate Expand Coverage', url: 'https://autismnj.org/news/amendments-to-insurance-mandate-expand-coverage/' },
      { title: 'NJ Board of Applied Behavior Analyst Examiners — FAQ', url: 'https://www.njconsumeraffairs.gov/abae/Pages/FAQ.aspx' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in New Jersey?', a: 'Yes — under the carrier\'s national policy for ASD (Optum\'s two-step Provider Express authorization), layered on New Jersey\'s mandate (P.L. 2009, c.115) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does Optum have New Jersey-specific ABA criteria?', a: 'Only for Medicaid — its State Mandates document carries a dedicated NJ FamilyCare entry (no comprehensive evaluation required, ages 18 months to 21). There is no NJ commercial entry, so commercial members follow the national Supplemental Clinical Criteria plus the state mandate.' },
      { q: 'Does the $36,000 ABA cap in New Jersey\'s mandate still apply?', a: 'Mostly not — DOBI Bulletin 10-02 held the cap cannot be applied to group plans subject to federal parity (MHPAEA). In practice, state-regulated plans cover medically necessary ABA without dollar caps; the cap survives mainly in nongroup policies.' },
    ],
  },
};
