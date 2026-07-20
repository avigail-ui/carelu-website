import type { PayerConfig } from './types.js';

export const texasPayers: Record<string, PayerConfig> = {
  'texas-medicaid': {
    slug: 'texas-medicaid',
    cardDesc: 'THSteps-CCP EPSDT ages 0–20; PA on everything, 90/90/180 cadence, 3-yr dx recency.',
    assessmentPA: 'Required — CCP PA form with signed prescriber referral + ASD dx (made/reconfirmed within 3 years); 97151 capped at 24 units',
    treatmentPA: 'Required — two 90-day initial periods, then 180-day recerts; since 4/1/2025 no prescriber signature on the 90-day extension',
    dxRequired: 'Yes — ASD (F84.0); diagnosis alone doesn\'t establish medical necessity',
    payer: 'Texas Medicaid (THSteps-CCP)',
    state: 'TX', kind: 'state-medicaid',
    pill: 'Payer Guide · Texas Medicaid',
    h1: 'Texas Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Texas Medicaid (THSteps-CCP) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Texas Medicaid covers ABA under the THSteps-CCP Autism Services benefit — prior authorization on evaluation and treatment, the 90/90/180-day cadence, the April 2025 signature change, the 3-year diagnosis recency rule, September 2025 rates, and the STAR/STAR Kids/STAR Health MCO landscape.',
    intro: [
      'Texas Medicaid added ABA as a defined benefit on February 1, 2022 — "Autism Services" under the Texas Health Steps Comprehensive Care Program (THSteps-CCP), the state\'s EPSDT vehicle. It is one statewide rulebook: HHSC writes the medical-necessity criteria into the Texas Medicaid Provider Procedures Manual (TMPPM), and every delivery channel — fee-for-service through TMHP and all the STAR, STAR Kids, and STAR Health managed-care plans — applies the same criteria. The benefit covers ages birth through 20 (eligibility ends on the 21st birthday; CHIP is explicitly excluded), requires prior authorization on everything from the initial evaluation forward, and runs on a distinctive 90/90/180-day authorization cadence. The MCO guides below cover per-plan submission mechanics; the clinical rules on this page apply everywhere.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — ages birth through 20, via THSteps-CCP (EPSDT); CHIP excluded' },
      { label: 'Assessment auth', value: 'Required — 97151 (24 units / 6 hrs max), CCP PA form + signed prescriber referral' },
      { label: 'Treatment auth', value: 'Required — 90-day initial + 90-day extension, then 180-day recertifications' },
      { label: 'Diagnosis recency', value: 'ASD dx (DSM criteria + severity level) made or reconfirmed within the past 3 years' },
      { label: 'Rates (per 15 min)', value: '97153: $14.50 · 97151: $27.56 · 97155: $20.08–$25.10 (eff. 9/1/2025, ~11.5% increase)' },
      { label: 'Daily cap', value: '8 hours (32 units) of direct treatment across 97153, 97154, 97155, 97158' },
      { label: 'Delivery', value: 'FFS via TMHP + STAR / STAR Kids / STAR Health MCOs — identical TMPPM criteria' },
      { label: 'Staff screening', value: 'BTs need RBT, BCAT, or ABAT cert (no Medicaid enrollment); monthly LEIE + HHSC-OIG exclusion checks on all staff' },
    ],
    sections: [
      {
        h2: 'The benefit and who qualifies',
        body: [
          'Autism Services is an EPSDT benefit: THSteps-CCP covers medically necessary ABA for members from birth through age 20, with eligibility ending on the 21st birthday. The gate is an ASD diagnosis — but not any diagnosis, from anyone, at any time. The TMPPM requires the diagnosis to come from a developmental pediatrician, neurologist, psychiatrist, licensed psychologist, or an interdisciplinary team (a physician, PA, or NP in consultation with qualified child specialists with autism expertise), documented with DSM diagnostic criteria and a symptom severity level, and made or reconfirmed within the 3 years before the PA request. A diagnosis alone is not sufficient to establish medical necessity — the evaluation builds that case. For intake, the 3-year recency rule is the trap to screen for early: a child diagnosed at 2 who shows up at 7 needs a diagnostic reconfirmation before the PA can go in.',
        ],
        cites: [
          { title: 'TMHP — HHSC Release of Autism Services Benefits (eff. 2/1/2022)', url: 'https://www.tmhp.com/news/2021-07-30-hhsc-release-autism-services-benefits-effective-february-1-2022' },
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
        ],
      },
      {
        h2: 'The authorization cadence: eval → 90 → 90 → 180',
        body: [
          'Everything is prior-authorized. The ABA evaluation (97151, limited to 24 units / 6 hours per evaluation, billed with the HO modifier by the LBA) needs a PA that includes a signed referral from the prescribing provider plus the diagnosis documentation, submitted on the CCP Prior Authorization Request Form. Treatment then authorizes in two consecutive 90-day periods — the initial 180-day treatment plan must be signed and dated by the prescribing provider — followed by recertifications in increments of up to 180 days.',
          'The friction-reducer worth knowing: effective April 1, 2025, TMHP dropped the prescribing-provider signature requirement on the CCP PA form for the 90-day treatment extension. The initial plan still needs the prescriber\'s signature, but the mid-cycle extension no longer stalls on chasing a physician\'s pen — a real cycle-time win for practices that learned the benefit in its first three years.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
          { title: 'TMHP — Update to a PA Requirement for Autism Services (eff. 4/1/2025)', url: 'https://www.tmhp.com/news/2025-02-14-update-prior-authorization-requirement-autism-services-effective-april-1-2025' },
        ],
      },
      {
        h2: 'Rates, modifiers, and who can enroll',
        body: [
          'HHSC raised ABA rates roughly 11.5% across the board effective September 1, 2025 — the first adjustment since the benefit launched. Per 15-minute unit: 97151 evaluation pays $27.56 (was $24.71); 97153 direct treatment by a behavior technician pays $14.50 (was $13.00); 97155 protocol modification pays $20.08–$25.10 and 97156 family training $18.40–$23.01, tiered by credential modifier. Texas flags credentials with modifiers — HO for the Licensed Behavior Analyst (LBA), HN for the Licensed assistant Behavior Analyst (LaBA), HM for behavior technicians — though 97153 itself takes no credential modifier. Two structural notes: only LBAs can enroll in Texas Medicaid (LaBAs and BTs bill under the LBA\'s supervision), and MCO reimbursement is contract-specific even though it generally tracks the HHSC fee schedule. The rate figures here come from the HHSC rate-hearing packet; confirm current values in the TMHP Online Fee Lookup before building revenue models.',
        ],
        cites: [
          { title: 'HHSC Provider Finance — ABA fee adjustment packet (eff. 9/1/2025)', url: 'https://pfd.hhs.texas.gov/sites/default/files/documents/2025/9-1-2025-fee-adj-fetal-med-applied-behavior-dental-rate.pdf' },
          { title: 'TMHP Online Fee Lookup', url: 'https://public.tmhp.com/FeeSchedules/Default.aspx' },
        ],
      },
      {
        h2: 'Delivery rules: hour caps, telehealth, and the MCO landscape',
        body: [
          'Direct treatment is capped at 8 hours (32 units) per day combined across 97153, 97154, 97155, and 97158. Telehealth (synchronous audio-visual, modifier 95) is allowed for 97151, 97155, 97156, 97158, and 99366 — but 1:1 direct treatment delivered by a BT or LaBA must be in person; no telehealth. Interdisciplinary team meetings are billable under 99366 with an ABA PA on file.',
          'On the delivery side, Texas runs a hybrid: fee-for-service through TMHP, and managed care through STAR (most children), STAR Kids (disability-related Medicaid), and STAR Health (foster care, statewide through Superior). Texas has 15+ Medicaid MCOs across its service delivery areas — including BCBSTX, Community Health Choice, Cook Children\'s, El Paso Health, and Parkland alongside the plans profiled below — and all of them apply the same TMPPM criteria. What varies per plan is the PA intake machinery: forms, portals, fax lines. Capture the child\'s plan at intake and use the matching MCO guide.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
          { title: 'TMHP — HHSC Release of Autism Services Benefits (eff. 2/1/2022)', url: 'https://www.tmhp.com/news/2021-07-30-hhsc-release-autism-services-benefits-effective-february-1-2022' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Texas certifies behavior technicians but doesn\'t license them. The TMPPM (§ 2.3.6.3) requires every BT to hold one of three certifications — RBT, BCAT, or ABAT — so the RBT is accepted but explicitly not the only pathway. BTs may not enroll in Texas Medicaid (they render under the enrolled LBA), may not use "therapist" in their job title when interacting with Medicaid families, and may not conduct assessments or modify the treatment plan. There\'s no state license, registry, or training-hour add-on for BTs: Occupations Code § 506.054 exempts a person designated as a behavior technician from behavior analyst licensure when working under the authority and direction of an LBA or LaBA, so the certification requirement comes from Medicaid policy, not licensure law. For the RBT pathway, the BACB\'s own floor is what screens your hires: 18+, high-school education, a criminal background check and abuse-registry check no more than 180 days before applying, the 40-hour training, a competency assessment, and the exam.',
          'The agency-level screening that actually binds a standalone ABA practice is exclusion screening, not the long-term-care registries. As a condition of enrollment, all providers must screen every employee and contractor every month against both the federal HHS-OIG LEIE and the Texas HHSC-OIG exclusion list (TMPPM Vol. 1, § 1.3.1) — build this into payroll-cycle compliance, not just onboarding. The Employee Misconduct Registry, by contrast, applies only to the facility types listed in Health & Safety Code § 253.001 (nursing facilities, HCSSAs, assisted living, ICF/IID, and similar) — a standalone ABA agency isn\'t on that list, so EMR pre-hire checks aren\'t legally required unless you also hold one of those licenses. Fingerprinting is similarly narrow: it attaches at provider enrollment, only for high categorical-risk providers and owners with a 5%+ interest (via IdentoGO, with proof uploaded to PEMS within 30 days of application) — individually licensed behavior analysts are not designated high-risk. At the supervisor level, TDLR requires every LBA and LaBA applicant to pass a criminal history background check as a condition of licensure.',
          'Supervision structure follows enrollment structure. Only the LBA enrolls and bills; the LBA must directly employ or contract with every LaBA and BT on the team, and LaBAs can\'t practice independently — by statute they must be supervised by an LBA per their certifying body\'s requirements. The TMPPM makes LBAs the direct supervisors of LaBAs and BTs but sets no numeric ratio of its own, deferring to certifying-body minimums — which makes the BACB standard the operative floor for RBT-credentialed staff: supervision of at least 5% of service hours each month, with at least two face-to-face contacts per month (one observing service delivery, one individual). One billing wrinkle to plan around: only direct supervision — the LBA observing the LaBA or BT with the client — is reimbursable, under 97155; indirect supervision (caseload review, data discussion) is unpaid time. And BTs and LaBAs must deliver 1:1 treatment in person — no remote service delivery. MCOs mirror this baseline (Texas Children\'s Health Plan\'s autism guideline repeats it nearly verbatim), but only TCHP was checked in depth — confirm each MCO\'s provider manual for staff-level extras at contracting.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
          { title: 'Tex. Occ. Code § 506.054 — Paraprofessional licensure exemption', url: 'https://texas.public.law/statutes/tex._occ._code_section_506.054' },
          { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
          { title: 'TMPPM Vol. 1, Provider Enrollment and Responsibilities, § 1.3.1 (monthly exclusion screening)', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/1_01_Provider_Enrollment/1_01_Provider_Enrollment.htm' },
          { title: 'Tex. Health & Safety Code § 253.001 — EMR covered facility types', url: 'https://texas.public.law/statutes/tex._health_and_safety_code_section_253.001' },
          { title: 'TMHP — Texas Medicaid Provider Fingerprinting Requirement FAQ (D00412)', url: 'https://www.tmhp.com/sites/default/files/file-library/topics/provider-enrollment/texas-medicaid-provider-fingerprinting-requirement-FAQ.pdf' },
          { title: 'TDLR — How to Apply for a Behavior Analyst License', url: 'https://www.tdlr.texas.gov/bhv/bhvapply.htm' },
          { title: 'Tex. Occ. Code § 506.254 — Licensed Assistant Behavior Analyst', url: 'https://texas.public.law/statutes/tex._occ._code_section_506.254' },
        ],
      },
    ],
    collect: [
      { title: 'Program & plan', desc: 'FFS vs. STAR / STAR Kids / STAR Health, and which MCO — same clinical rules, different PA machinery.' },
      { title: 'ASD diagnosis + date', desc: 'Diagnoser type matters (TMPPM list), and the dx must be made or reconfirmed within 3 years — screen recency at intake.' },
      { title: 'Prescriber referral', desc: 'A signed referral from the prescribing provider attaches to the evaluation PA — chase it first, not last.' },
      { title: 'Age check', desc: 'Benefit runs birth through 20 and ends on the 21st birthday; CHIP members are excluded entirely.' },
      { title: 'Supervising LBA', desc: 'Only LBAs enroll in Texas Medicaid — confirm the enrolled LBA who will bill for the team.' },
    ],
    sources: [
      { title: 'TMHP — HHSC Release of Autism Services Benefits (eff. 2/1/2022)', url: 'https://www.tmhp.com/news/2021-07-30-hhsc-release-autism-services-benefits-effective-february-1-2022' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
      { title: 'TMHP — Update to a PA Requirement for Autism Services (eff. 4/1/2025)', url: 'https://www.tmhp.com/news/2025-02-14-update-prior-authorization-requirement-autism-services-effective-april-1-2025' },
      { title: 'HHSC Provider Finance — ABA fee adjustment packet (eff. 9/1/2025)', url: 'https://pfd.hhs.texas.gov/sites/default/files/documents/2025/9-1-2025-fee-adj-fetal-med-applied-behavior-dental-rate.pdf' },
      { title: 'TMHP Online Fee Lookup', url: 'https://public.tmhp.com/FeeSchedules/Default.aspx' },
      { title: 'Tex. Occ. Code § 506.054 — Paraprofessional licensure exemption', url: 'https://texas.public.law/statutes/tex._occ._code_section_506.054' },
      { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
      { title: 'TMPPM Vol. 1, Provider Enrollment and Responsibilities, § 1.3.1 (monthly exclusion screening)', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/1_01_Provider_Enrollment/1_01_Provider_Enrollment.htm' },
      { title: 'Tex. Health & Safety Code § 253.001 — EMR covered facility types', url: 'https://texas.public.law/statutes/tex._health_and_safety_code_section_253.001' },
      { title: 'TMHP — Texas Medicaid Provider Fingerprinting Requirement FAQ (D00412)', url: 'https://www.tmhp.com/sites/default/files/file-library/topics/provider-enrollment/texas-medicaid-provider-fingerprinting-requirement-FAQ.pdf' },
      { title: 'TDLR — How to Apply for a Behavior Analyst License', url: 'https://www.tdlr.texas.gov/bhv/bhvapply.htm' },
      { title: 'Tex. Occ. Code § 506.254 — Licensed Assistant Behavior Analyst', url: 'https://texas.public.law/statutes/tex._occ._code_section_506.254' },
    ],
    faq: [
      { q: 'Does Texas Medicaid cover ABA therapy?', a: 'Yes — since February 1, 2022, as the Autism Services benefit under THSteps-CCP (EPSDT), for members from birth through age 20 with an ASD diagnosis. Everything requires prior authorization, from the evaluation forward. CHIP is excluded.' },
      { q: 'How recent does the autism diagnosis need to be?', a: 'The diagnosis — with DSM criteria and a symptom severity level — must be made or reconfirmed within the 3 years before the PA request. Older diagnoses need reconfirmation before the evaluation PA can be approved.' },
      { q: 'What changed on April 1, 2025?', a: 'TMHP removed the prescribing-provider signature requirement from the CCP PA form for the 90-day treatment extension. The initial 180-day treatment plan still needs the prescriber\'s signature; the mid-cycle extension no longer does.' },
      { q: 'What does Texas Medicaid pay for ABA?', a: 'Effective September 1, 2025 (an ~11.5% increase): 97153 direct treatment pays $14.50 per 15-minute unit, 97151 evaluation $27.56, 97155 $20.08–$25.10 and 97156 $18.40–$23.01 depending on the LaBA/LBA modifier tier. Confirm current values in the TMHP Online Fee Lookup.' },
    ],
  },

  'superior-healthplan-texas': {
    slug: 'superior-healthplan-texas',
    family: 'centene',
    cardDesc: 'TMPPM criteria; PA on every ABA code; the only STAR Health (foster care) plan statewide.',
    assessmentPA: 'Required — PA on all ABA services before delivery, including the 97151 evaluation',
    treatmentPA: 'Required — 97153, 97154, 97155, 97156, 97158, 99366 all on Superior\'s PA list; TMPPM 90/90/180 cadence',
    dxRequired: 'Yes — ASD per TMPPM criteria (Superior defers to the state manual)',
    payer: 'Superior HealthPlan (TX)',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Superior HealthPlan',
    h1: 'Superior HealthPlan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Superior HealthPlan (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Superior HealthPlan (Centene) administers the Texas Medicaid ABA benefit — TMPPM criteria, PA on every ABA code, the statewide STAR Health foster-care line, and Superior\'s PA-list history.',
    intro: [
      'Superior HealthPlan — Centene\'s Texas plan and one of the largest Medicaid footprints in the state — administers the THSteps-CCP Autism Services benefit on the TMPPM\'s criteria; its provider notices point straight at the state manual for diagnosis and clinical rules. Two things make Superior structurally important for ABA intake: its breadth (STAR and STAR Kids across multiple service areas including Bexar, El Paso, Hidalgo, Lubbock, Nueces, MRSA West, and Travis), and its exclusivity — Superior is the only STAR Health plan, so every Texas foster-care child, statewide, routes ABA through Superior.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (Centene) — STAR, STAR Kids, STAR Health, STAR+PLUS MBCC' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (state baseline, no distinct policy)' },
      { label: 'Prior auth', value: 'Required on ALL ABA services before delivery, evaluation included' },
      { label: 'Foster care', value: 'Sole STAR Health plan — all Texas foster-care ABA runs through Superior' },
      { label: 'Submission', value: 'Superior provider portal / PA Requirements page (superiorhealthplan.com)' },
      { label: 'Rates', value: 'Not published — contract-specific (generally tracks the HHSC fee schedule)' },
    ],
    sections: [
      {
        h2: 'How Superior runs the benefit',
        body: [
          'Superior announced the ABA benefit at its February 2022 launch with prior authorization required on every service code — 97151 for the evaluation, then 97153, 97154, 97155, 97156, 97158, and 99366 for treatment and team meetings — and its notices defer to the TMPPM for medical-necessity criteria, so the state\'s 3-year diagnosis recency, 90/90/180 cadence, and 8-hour daily cap all apply unchanged. Requests go through Superior\'s provider portal, with the plan\'s Prior Authorization Requirements page as the code-level reference. And the PA posture is stable: Superior\'s January 1, 2026 PA-removal list touched no ABA codes (the Medicaid removals were 36471, A6216, and A6218 only), so plan on full PA for the foreseeable future.',
        ],
        cites: [
          { title: 'Superior — New Medicaid Benefit for ABA Services, PA Required (eff. 2/1/2022)', url: 'https://www.superiorhealthplan.com/newsroom/effective-0201222-new-medicaid-benefit-for-aba-services-prior-auth-required.html' },
          { title: 'Superior — Medicaid ABA Services for Children and Youth With Autism (2/24/2023)', url: 'https://www.superiorhealthplan.com/newsroom/medicaid-aba-services-02242023.html' },
          { title: 'Superior — Removal of PA Requirement for Certain Procedures (eff. 1/1/2026)', url: 'https://www.superiorhealthplan.com/newsroom/eff-01012026-removal-of-pa-req-for-certain-procedures-12012025.html' },
        ],
      },
      {
        h2: 'The STAR Health angle',
        body: [
          'If your practice serves children in foster care, Superior is unavoidable: STAR Health is administered by Superior alone, statewide. That makes Superior credentialing and PA fluency a de facto requirement for foster-care ABA anywhere in Texas — and it means intake should treat "foster care" as a routing answer, not just a demographic note. The clinical rules are the same TMPPM baseline; the population\'s documentation (medical consenters, caseworker involvement) is the added layer to plan for.',
        ],
        cites: [
          { title: 'Superior — Medicaid ABA Services for Children and Youth With Autism (2/24/2023)', url: 'https://www.superiorhealthplan.com/newsroom/medicaid-aba-services-02242023.html' },
        ],
      },
    ],
    collect: [
      { title: 'Program line', desc: 'STAR vs. STAR Kids vs. STAR Health — foster-care children are always Superior (STAR Health).' },
      { title: 'ASD dx + recency', desc: 'TMPPM rules apply: qualified diagnoser, DSM criteria + severity, within 3 years.' },
      { title: 'Prescriber referral', desc: 'Signed referral for the evaluation PA, per the state baseline.' },
      { title: 'PA on file before service', desc: 'Superior requires PA on every ABA code before delivery — no assessment-first shortcut.' },
    ],
    sources: [
      { title: 'Superior — New Medicaid Benefit for ABA Services, PA Required (eff. 2/1/2022)', url: 'https://www.superiorhealthplan.com/newsroom/effective-0201222-new-medicaid-benefit-for-aba-services-prior-auth-required.html' },
      { title: 'Superior — Medicaid ABA Services for Children and Youth With Autism (2/24/2023)', url: 'https://www.superiorhealthplan.com/newsroom/medicaid-aba-services-02242023.html' },
      { title: 'Superior — Removal of PA Requirement for Certain Procedures (eff. 1/1/2026)', url: 'https://www.superiorhealthplan.com/newsroom/eff-01012026-removal-of-pa-req-for-certain-procedures-12012025.html' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Superior HealthPlan cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit on TMPPM criteria, with prior authorization required on every ABA code, evaluation included, through Superior\'s provider portal.' },
      { q: 'Is Superior\'s ABA policy different from the state\'s?', a: 'No — Superior explicitly points providers to the TMPPM for diagnosis and clinical criteria and mirrors the state PA code list. What\'s Superior-specific is the portal, the PA-list mechanics, and the STAR Health foster-care line.' },
      { q: 'Why does foster care always mean Superior?', a: 'STAR Health, the Texas Medicaid program for children in foster care, is administered statewide by Superior alone — every foster-care ABA case routes through it.' },
    ],
  },

  'texas-childrens-health-plan': {
    slug: 'texas-childrens-health-plan',
    cardDesc: 'Own 30-page guideline (#11281 v3) that restates TMPPM; PA via portal, fax, phone, or mail.',
    assessmentPA: 'Required — referral must document age, year of initial ASD dx, comorbidities, DSM severity; dx within 3 years',
    treatmentPA: 'Required — 90-day initial → 90-day extension → 180-day recerts (guideline §§ 7.8.1–7.8.3); e-signature accepted',
    dxRequired: 'Yes — ASD per TMPPM criteria (restated in TCHP\'s guideline)',
    payer: 'Texas Children\'s Health Plan',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Texas Children\'s Health Plan',
    h1: 'Texas Children\'s Health Plan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Texas Children\'s Health Plan ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Texas Children\'s Health Plan administers Texas Medicaid ABA — its Autism Services Guideline #11281 v3 (a TMPPM restatement), UM submission channels, the 90/90/180 cadence, and the CHIP exclusion.',
    intro: [
      'Texas Children\'s Health Plan (TCHP) — the Houston-anchored plan serving STAR, STAR Kids, and CHIP in the Harris, Jefferson, and Northeast service areas — is the rare Texas MCO that wrote its own ABA document: the ~30-page Autism Services Guideline #11281, version 3. Read it closely and it\'s the TMPPM in a different binder — the same diagnoser list, 3-year recency rule, LBA/LaBA/BT role definitions, and BT restrictions, transcribed nearly verbatim — with TCHP\'s own UM process bolted on. That\'s good news operationally: nothing clinically new to learn, and a clearly documented submission path.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO — STAR, STAR Kids, CHIP (Harris / Jefferson / Northeast SDAs)' },
      { label: 'Clinical rules', value: 'Autism Services Guideline #11281 v3 — a formatted restatement of TMPPM criteria' },
      { label: 'Prior auth', value: 'Required — online portal, fax, phone, or mail to the UM Department' },
      { label: 'Auth cadence', value: '90-day initial → 90-day extension → 180-day recertifications (§§ 7.8.1–7.8.3)' },
      { label: 'CHIP', value: 'Explicitly excluded from the ABA benefit — Medicaid lines only' },
      { label: 'Rates', value: 'References the Texas Medicaid fee schedule (no plan-specific rates published)' },
    ],
    sections: [
      {
        h2: 'What the guideline asks for',
        body: [
          'TCHP\'s evaluation PA wants a referral that documents the child\'s age, the year of the initial ASD diagnosis, comorbidities and trauma history, and DSM symptom severity — with the diagnosis made or reconfirmed within the past 3 years, per the state rule. Requests go to the UM Department via the electronic authorization portal, fax, phone, or mail; electronic signatures are accepted, with the paper process running by fax. Treatment then follows the TMPPM cadence exactly, mapped in guideline sections 7.8.1 through 7.8.3: a 90-day initial course, a 90-day extension, then recertifications in up to 180-day increments. One continuity wrinkle the guideline adds: the LBA must have provided direct services within the previous 180 days for certain continuity requirements — worth tracking when supervision rotates.',
        ],
        cites: [
          { title: 'TCHP — Autism Services Guideline #11281 v3 (PDF)', url: 'https://www.texaschildrenshealthplan.org/sites/default/files/2025-02/Autism%20Services%20Guideline.pdf' },
        ],
      },
      {
        h2: 'The CHIP boundary',
        body: [
          'TCHP sells CHIP alongside its Medicaid lines, and the ABA benefit does not extend to CHIP — the exclusion is explicit in both the state benefit and TCHP\'s guideline. For intake, that means "we have Texas Children\'s" isn\'t enough: confirm the child is on STAR or STAR Kids, not CHIP, before quoting the ABA pathway. A CHIP family\'s options are commercial-style coverage rules, not THSteps-CCP.',
        ],
        cites: [
          { title: 'TCHP — Autism Services Guideline #11281 v3 (PDF)', url: 'https://www.texaschildrenshealthplan.org/sites/default/files/2025-02/Autism%20Services%20Guideline.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'STAR / STAR Kids vs. CHIP', desc: 'CHIP is excluded from ABA — confirm the Medicaid line before promising the benefit.' },
      { title: 'Referral details', desc: 'Age, year of initial dx, comorbidities/trauma history, DSM severity — TCHP\'s evaluation PA asks for all of it.' },
      { title: 'Dx recency', desc: 'Within 3 years, or a reconfirmation is needed first.' },
      { title: 'Supervising LBA continuity', desc: 'The guideline\'s 180-day direct-service continuity rule makes supervisor tracking a compliance item.' },
    ],
    sources: [
      { title: 'TCHP — Autism Services Guideline #11281 v3 (PDF)', url: 'https://www.texaschildrenshealthplan.org/sites/default/files/2025-02/Autism%20Services%20Guideline.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Texas Children\'s Health Plan cover ABA?', a: 'Yes — for STAR and STAR Kids members under the state Autism Services benefit, governed by TCHP\'s Guideline #11281 v3, which restates the TMPPM criteria. CHIP members are excluded.' },
      { q: 'Is TCHP\'s ABA guideline stricter than the state\'s?', a: 'No — it\'s a formatted restatement of TMPPM requirements (same diagnoser list, 3-year recency, credential roles) with TCHP\'s UM submission process added. Plan against the state baseline and TCHP\'s channels.' },
      { q: 'How do I submit an ABA PA to TCHP?', a: 'Online via the electronic authorization portal, or by fax, phone, or mail to the UM Department. Electronic signatures are accepted.' },
    ],
  },

  'wellpoint-texas': {
    slug: 'wellpoint-texas',
    family: 'anthem',
    cardDesc: 'TMPPM restated; accepts its own ASD form OR the state CCP PA form; Availity submission.',
    assessmentPA: 'Required — its ASD Treatment Plan Request Form OR the state CCP PA form, plus a current signed physician ABA referral',
    treatmentPA: 'Required — TMPPM cadence; submit via Availity Essentials, phone, or fax; appeals via Availity or 833-731-2162',
    dxRequired: 'Yes — ASD, ages 0–20, per TMPPM (restated in Wellpoint\'s provider doc)',
    payer: 'Wellpoint (formerly Amerigroup Texas)',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Wellpoint (TX)',
    h1: 'Wellpoint Texas ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Wellpoint Texas (Medicaid MCO) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Wellpoint (formerly Amerigroup Texas) administers Texas Medicaid ABA — TMPPM rules restated in its behavioral-health provider doc, the two-form choice, Availity submission, and billing rules worth knowing.',
    intro: [
      'Wellpoint — the Elevance plan formerly branded Amerigroup Texas, serving STAR, STAR Kids, and STAR+PLUS — administers the ABA benefit as a faithful restatement of TMPPM policy: its Texas behavioral-health provider document carries the state\'s modifier table (HO=LBA, HN=LaBA, HM=BT, 95=telehealth), unit caps, ages 0–20 scope, and the telehealth ban on BT/LaBA-delivered direct treatment, essentially unchanged. The January 2024 Amerigroup-to-Wellpoint rebrand changed no PA or claims processes. The plan\'s one genuine convenience: it accepts either its own ASD form or the state\'s.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (Elevance, ex-Amerigroup) — STAR, STAR Kids, STAR+PLUS' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services policy, restated in the plan\'s BH provider doc' },
      { label: 'Forms', value: 'Its ASD Treatment Plan Request Form OR the state CCP PA form — either works' },
      { label: 'Submission', value: 'Availity Essentials, phone, or fax; appeals via Availity or 833-731-2162' },
      { label: 'Caps', value: '97151 max 24 units / 6 hrs; 8 hrs/day direct treatment (state baseline)' },
      { label: 'Rates', value: 'Paid per contract; no separate pay for report writing outside 97151' },
    ],
    sections: [
      {
        h2: 'How Wellpoint runs authorization',
        body: [
          'The assessment PA needs a completed treatment-request form — Wellpoint accepts either its own "Treatment Plan Request Form for Autism Spectrum Disorders" or the state CCP Prior Authorization Request Form — plus a current, signed physician ABA referral and the clinical documentation the TMPPM requires. If your practice standardizes on the state CCP form across payers, Wellpoint doesn\'t force a conversion step: one less template to maintain. Submissions run through Availity Essentials (or phone/fax), with appeals via Availity or 833-731-2162, and treatment follows the state\'s 90/90/180 cadence.',
        ],
        cites: [
          { title: 'Wellpoint/Amerigroup — Texas Behavioral Health provider document (PDF)', url: 'https://provider.amerigroup.com/docs/gpp/TX_CAID_TexasBehavioralHealth.pdf?v=202207071852' },
        ],
      },
      {
        h2: 'Billing rules that bite',
        body: [
          'Wellpoint\'s provider doc spells out the billing edges that mirror the TMPPM: 97151 is capped at 24 units (6 hours) per evaluation; direct treatment caps at 8 hours per day; the credential-modifier table governs claims; LaBAs and BTs may not deliver via telehealth; and — explicitly — no separate reimbursement for treatment planning or report writing outside 97151, and no partial units. Practices that bill documentation time separately elsewhere should scrub that habit out of Wellpoint claims before it generates denials.',
        ],
        cites: [
          { title: 'Wellpoint/Amerigroup — Texas Behavioral Health provider document (PDF)', url: 'https://provider.amerigroup.com/docs/gpp/TX_CAID_TexasBehavioralHealth.pdf?v=202207071852' },
        ],
      },
    ],
    collect: [
      { title: 'Physician ABA referral', desc: 'A current, signed referral attaches to the PA — collect it with the diagnosis report.' },
      { title: 'Form choice', desc: 'State CCP PA form or Wellpoint\'s ASD form — pick one and standardize.' },
      { title: 'ASD dx + recency', desc: 'TMPPM rules: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Clean unit math', desc: 'No partial units, no separate documentation-time billing — align billing staff early.' },
    ],
    sources: [
      { title: 'Wellpoint/Amerigroup — Texas Behavioral Health provider document (PDF)', url: 'https://provider.amerigroup.com/docs/gpp/TX_CAID_TexasBehavioralHealth.pdf?v=202207071852' },
      { title: 'Wellpoint TX — Prior Authorization Requirements', url: 'https://www.wellpoint.com/tx/provider/state-federal/resources/prior-authorization-requirements' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Wellpoint Texas cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit on TMPPM criteria, restated in its behavioral-health provider document: PA on evaluation and treatment, ages 0–20, credential modifiers, 8-hour daily cap.' },
      { q: 'Do I have to use Wellpoint\'s own PA form?', a: 'No — Wellpoint accepts either its Treatment Plan Request Form for Autism Spectrum Disorders or the state CCP Prior Authorization Request Form, plus the signed physician referral.' },
      { q: 'Did the Amerigroup-to-Wellpoint rebrand change anything?', a: 'No — the January 2024 rebrand changed no PA or claims processes. Documents and portals under the Amerigroup name remain valid references.' },
    ],
  },

  'unitedhealthcare-community-plan-texas': {
    slug: 'unitedhealthcare-community-plan-texas',
    family: 'unitedhealthcare',
    cardDesc: 'TMPPM criteria with ABA carved out to Optum\'s BH network — not the medical PA pipeline.',
    assessmentPA: 'Required (state benefit) — but routed through the designated behavioral health network (Optum), NOT UHC\'s medical PA list',
    treatmentPA: 'Required — through Optum Behavioral Health; BH line 888-887-9003',
    dxRequired: 'Yes — ASD per TMPPM criteria (no distinct TX criteria published)',
    payer: 'UnitedHealthcare Community Plan of Texas',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · UHC Community Plan (TX)',
    h1: 'UnitedHealthcare Community Plan of Texas ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'UHC Community Plan Texas (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan of Texas administers Medicaid ABA — TMPPM criteria with the behavioral benefit carved out to Optum\'s BH network, why ABA codes are missing from the medical PA list, and how to route authorizations correctly.',
    intro: [
      'UnitedHealthcare Community Plan of Texas (STAR, STAR Kids, CHIP) applies the state\'s TMPPM Autism Services criteria — it publishes no distinct Texas ABA clinical policy, and Optum\'s national ABA state-mandates supplement has no Texas entry. What it does differently is routing: behavioral health, ABA included, is carved out to UHC\'s designated behavioral health network run by Optum. That carve-out is the single most important thing to know about this plan, because it explains a fact that misleads new providers constantly: ABA codes are absent from UHC\'s Texas medical PA lists — not because PA isn\'t required, but because ABA never travels through the medical pipeline at all.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO — STAR, STAR Kids, CHIP' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (no distinct TX policy; no TX entry in Optum\'s mandate supplement)' },
      { label: 'The carve-out', value: 'ABA routes via Optum\'s BH network — NOT UHC\'s medical PA list' },
      { label: 'BH contact', value: '888-887-9003 for referrals and authorizations; uhcprovider.com portal' },
      { label: 'PA timelines', value: 'Routine decisions within 3 business days; expedited within 72 hours' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'The carve-out, and the trap it sets',
        body: [
          'UHC\'s STAR Kids medical prior-authorization list (effective 11/1/2025) does not contain ABA codes 97151–97158 — and a provider who reads that as "no PA needed" is walking into denials. The codes are missing because behavioral health services are carved out to the plan\'s designated behavioral network, administered by Optum: ABA authorization requests go through that BH pipeline (phone 888-887-9003, with the UnitedHealthcare Provider Portal as the submission surface), not the medical PA tool. The state benefit\'s PA requirement applies in full — TMPPM criteria, prescriber referral, 3-year dx recency, the 90/90/180 cadence. Route it correctly on day one and set family expectations against the plan\'s published timelines: routine PA decisions within 3 business days, expedited within 72 hours. Third-party sources also cite a BH intake fax (877-940-1972), though we could not verify that number against a UHC primary source — confirm it on the portal before relying on it.',
        ],
        cites: [
          { title: 'UHC Community Plan of TX — STAR Kids PA list (eff. 11/1/2025, PDF)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tx/prior-auth/star-kids/TX-UHCCP-STAR-KIDS-Prior-Auth-Eff-11-1-2025.pdf' },
          { title: 'UHC Community Plan of Texas — prior authorization page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/texas-health-plans/tx-comm-plan-home/tx-cp-prior-auth.html' },
        ],
      },
      {
        h2: 'Which criteria actually govern',
        body: [
          'Optum\'s national ABA supplemental clinical criteria document (BH803ABA) lists state-specific overlays for a handful of states — and Texas is not one of them. With no distinct plan policy either, the TMPPM governs Medicaid medical necessity for UHC members exactly as it does everywhere else in Texas: same diagnoser list, same recency rule, same hour caps, same telehealth restrictions. Build your clinical documentation to the state baseline and treat Optum as the intake mechanism, not a second rulebook.',
        ],
        cites: [
          { title: 'Optum — ABA State Mandates supplemental clinical criteria (BH803ABA STM 1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Line of business', desc: 'STAR / STAR Kids vs. CHIP — CHIP is excluded from the state ABA benefit.' },
      { title: 'BH routing from day one', desc: 'ABA auths go to Optum\'s BH network (888-887-9003), never the medical PA tool.' },
      { title: 'ASD dx + recency', desc: 'TMPPM baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Prescriber referral', desc: 'The state\'s signed-referral requirement applies unchanged.' },
    ],
    sources: [
      { title: 'UHC Community Plan of TX — STAR Kids PA list (eff. 11/1/2025, PDF)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tx/prior-auth/star-kids/TX-UHCCP-STAR-KIDS-Prior-Auth-Eff-11-1-2025.pdf' },
      { title: 'UHC Community Plan of Texas — prior authorization page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/texas-health-plans/tx-comm-plan-home/tx-cp-prior-auth.html' },
      { title: 'Optum — ABA State Mandates supplemental clinical criteria (BH803ABA STM 1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Texas cover ABA?', a: 'Yes — the state Autism Services benefit on TMPPM criteria. Authorization runs through UHC\'s designated behavioral health network (Optum), not the medical PA pipeline.' },
      { q: 'Why aren\'t ABA codes on UHC\'s Texas PA list?', a: 'Because behavioral health is carved out to Optum\'s BH network — the medical PA list doesn\'t govern ABA. PA is still required; it just routes through the BH pipeline at 888-887-9003.' },
      { q: 'Does Optum apply its own clinical criteria to Texas Medicaid ABA?', a: 'No — Optum\'s ABA state-mandates supplement has no Texas entry, and the plan publishes no distinct TX policy, so the TMPPM criteria govern. Optum is the UM intake, not a separate rulebook.' },
    ],
  },

  'aetna-better-health-texas': {
    slug: 'aetna-better-health-texas',
    family: 'aetna',
    cardDesc: 'TMPPM state baseline in Bexar & Tarrant; plan-specific PA mechanics not publicly verifiable.',
    assessmentPA: 'Required — per the statewide TMPPM benefit (PA on all ABA services); Aetna\'s plan-specific process is not publicly verifiable',
    treatmentPA: 'Required — state 90/90/180 cadence applies; confirm forms and submission channel with the plan directly',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria',
    payer: 'Aetna Better Health of Texas',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Aetna Better Health (TX)',
    h1: 'Aetna Better Health of Texas ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Aetna Better Health of Texas ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Aetna Better Health of Texas fits the state Medicaid ABA benefit — the TMPPM baseline that governs it, its Bexar and Tarrant service areas, and which plan-specific details you\'ll need to confirm directly because they aren\'t publicly verifiable.',
    intro: [
      'Aetna Better Health of Texas serves STAR, STAR Kids, and CHIP in the Bexar and Tarrant service areas — putting it alongside UnitedHealthcare in the DFW/Tarrant STAR Kids market. Like every Texas MCO, it delivers the statewide THSteps-CCP Autism Services benefit and must apply the TMPPM medical-necessity criteria. An honesty note that shapes this guide: Aetna Better Health\'s Texas provider manual and PA pages block automated retrieval, and we found no distinct TX ABA clinical policy in public sources — so this page gives you the state baseline that verifiably governs, and flags exactly which plan-level mechanics to confirm with the plan before your first submission.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (CVS/Aetna) — STAR, STAR Kids, CHIP (Bexar & Tarrant SDAs)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (statewide baseline; no distinct TX policy found)' },
      { label: 'Prior auth', value: 'Required on evaluation and treatment, per the state benefit' },
      { label: 'Auth cadence', value: 'State 90/90/180 cadence; 3-year dx recency; 8 hrs/day cap' },
      { label: 'Plan mechanics', value: 'Forms, portal, and UM contacts NOT publicly verified — confirm with the plan' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'What verifiably governs: the state baseline',
        body: [
          'Every fact on the Texas Medicaid guide applies to Aetna Better Health members: PA required on the 97151 evaluation (24-unit cap) with a signed prescriber referral and an ASD diagnosis made or reconfirmed within 3 years; treatment authorized in two 90-day periods then 180-day recertifications, with the prescriber signature no longer required on the 90-day extension since April 1, 2025; the 8-hour daily direct-treatment cap; the HO/HN/HM credential modifiers; and the telehealth ban on BT/LaBA-delivered direct treatment. Build your clinical package to that baseline and it will be substantively correct regardless of Aetna\'s intake mechanics.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
          { title: 'TMHP — Update to a PA Requirement for Autism Services (eff. 4/1/2025)', url: 'https://www.tmhp.com/news/2025-02-14-update-prior-authorization-requirement-autism-services-effective-april-1-2025' },
        ],
      },
      {
        h2: 'What to confirm with the plan directly',
        body: [
          'We could not verify Aetna Better Health of Texas\'s ABA-specific submission mechanics from public sources — the plan\'s provider manual and Medicaid pages return errors to automated retrieval, and no distinct TX ABA policy surfaced elsewhere. Aetna Better Health plans typically run submissions through Availity, but treat that as an assumption, not a fact. Before your first case: confirm the PA submission channel and any plan-specific form (or whether the state CCP PA form is accepted), the UM department\'s fax/phone, expected turnaround times, and appeals routing. A ten-minute provider-relations call up front beats a bounced authorization later.',
        ],
        cites: [
          { title: 'Aetna Better Health of Texas — provider manual (access-restricted)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/texas/providers/pdf/tx_provider_manual.pdf' },
          { title: 'Aetna Better Health of Texas — plan site', url: 'https://www.aetnabetterhealth.com/texas/index.html' },
        ],
      },
    ],
    collect: [
      { title: 'STAR / STAR Kids vs. CHIP', desc: 'CHIP is excluded from the ABA benefit — confirm the Medicaid line.' },
      { title: 'ASD dx + recency', desc: 'State baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Prescriber referral', desc: 'The signed referral is a state requirement — it will be needed whatever Aetna\'s form looks like.' },
      { title: 'Plan mechanics on file', desc: 'Call provider relations once, document the submission channel/forms/fax, and template it.' },
    ],
    sources: [
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
      { title: 'TMHP — Update to a PA Requirement for Autism Services (eff. 4/1/2025)', url: 'https://www.tmhp.com/news/2025-02-14-update-prior-authorization-requirement-autism-services-effective-april-1-2025' },
      { title: 'Aetna Better Health of Texas — provider manual (access-restricted)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/texas/providers/pdf/tx_provider_manual.pdf' },
      { title: 'Aetna Better Health of Texas — plan site', url: 'https://www.aetnabetterhealth.com/texas/index.html' },
    ],
    faq: [
      { q: 'Does Aetna Better Health of Texas cover ABA?', a: 'Yes — as a Texas Medicaid MCO it delivers the statewide THSteps-CCP Autism Services benefit under TMPPM criteria: PA on evaluation and treatment, ages 0–20, 3-year dx recency. CHIP members are excluded.' },
      { q: 'Does Aetna Better Health have its own Texas ABA policy?', a: 'None that we could find publicly — and its provider documents block automated retrieval. Texas MCOs must apply TMPPM criteria, so plan clinically against the state baseline and confirm submission mechanics with the plan directly.' },
      { q: 'How do I submit an ABA PA to Aetna Better Health of Texas?', a: 'Confirm with the plan — the specific channel and forms aren\'t publicly verifiable. Ask provider relations whether the state CCP PA form is accepted and get the UM fax/portal details in writing before your first submission.' },
    ],
  },

  'molina-healthcare-texas': {
    slug: 'molina-healthcare-texas',
    family: 'molina',
    cardDesc: 'TMPPM baseline; verify codes in Molina\'s PA Code Matrix — its PA guide PDFs sit behind bot walls.',
    assessmentPA: 'Required — per the statewide TMPPM benefit; verify code-level handling in Molina\'s BH/Medical PA Code Matrix',
    treatmentPA: 'Required — state cadence applies; out-of-network requests need authorization regardless of service',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria',
    payer: 'Molina Healthcare of Texas',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Molina Healthcare (TX)',
    h1: 'Molina Healthcare of Texas ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Molina Healthcare of Texas ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of Texas fits the state Medicaid ABA benefit — the TMPPM baseline, where ABA volume actually sits in Molina\'s book (STAR, not the ex-Cigna STAR+PLUS), and which PA specifics to pull manually from Molina\'s code matrix.',
    intro: [
      'Molina Healthcare of Texas runs STAR, STAR+PLUS, and CHIP — with a book that includes the Cigna Texas Medicaid (STAR+PLUS) membership Molina acquired in 2021. For ABA purposes, keep the programs straight: STAR+PLUS is the adult program, so pediatric ABA volume rides on Molina STAR. Like every Texas MCO, Molina delivers the statewide Autism Services benefit on TMPPM criteria; we found no evidence of distinct Molina ABA criteria. The caveat shaping this guide: Molina\'s Texas PA guide PDFs are served behind bot protection, so plan-specific PA details below are flagged for manual confirmation rather than asserted.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO — STAR, STAR+PLUS, CHIP' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (no distinct Molina ABA policy found)' },
      { label: 'Prior auth', value: 'Required on evaluation and treatment, per the state benefit' },
      { label: 'Code-level lookup', value: 'Molina BH & Medical PA Code Matrix / Look-Up Tool — pull it manually' },
      { label: 'Out-of-network', value: 'All OON requests require authorization regardless of service' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'The state baseline is the rulebook',
        body: [
          'Molina members get the same benefit as everyone else in Texas Medicaid: PA on the 97151 evaluation with signed prescriber referral and a 3-year-recent ASD diagnosis, the 90/90/180 treatment cadence (no prescriber signature on the 90-day extension since April 2025), the 8-hour daily cap, credential modifiers, and the in-person requirement for BT/LaBA-delivered direct treatment. Build the clinical package to the TMPPM and it travels to Molina intact. One Molina-specific rule surfaced in its PA guidance: out-of-network requests require authorization regardless of the service — relevant while credentialing is in flight.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
          { title: 'Molina Healthcare of Texas — Prior Authorizations page (access-restricted)', url: 'https://www.molinahealthcare.com/providers/tx/medicaid/forms/PA.aspx' },
        ],
      },
      {
        h2: 'What to pull manually',
        body: [
          'Molina directs providers to its Behavioral Health and Medical Prior Authorization Code Matrix / Look-Up Tool for code-level PA handling, and its current-year "MHT Prior Authorization Guide" PDF is the document of record — but those files sit behind bot protection, so we could not verify their ABA specifics for this guide. Before your first Molina submission: download the current PA guide from molinahealthcare.com manually, run the ABA codes (97151–97158, 99366) through the look-up tool, and confirm the submission channel (Molina plans typically use Availity or the Molina Provider Portal, but confirm for Texas ABA specifically). Note also which program the child is on: a family that says "Molina" after the Cigna transition may be a STAR+PLUS adult — not an ABA case profile.',
        ],
        cites: [
          { title: 'Molina TX — Medicaid/CHIP Prior Authorization Guide (access-restricted)', url: 'https://www.molinamarketplace.com/-/media/Molina/PublicWebsite/PDF/Providers/tx/medicaid/forms/MHT-Prior-Authorization-Guide-2025_R.ashx' },
          { title: 'Molina Healthcare of Texas — Prior Authorizations page (access-restricted)', url: 'https://www.molinahealthcare.com/providers/tx/medicaid/forms/PA.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Program line', desc: 'STAR (pediatric ABA) vs. STAR+PLUS (adult) vs. CHIP (excluded) — the answer routes everything.' },
      { title: 'ASD dx + recency', desc: 'State baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Network status', desc: 'Out-of-network requests always need authorization at Molina — check credentialing before quoting timelines.' },
      { title: 'Current PA guide on file', desc: 'Pull the MHT Prior Authorization Guide manually each year — it\'s the code-level source of truth.' },
    ],
    sources: [
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
      { title: 'Molina Healthcare of Texas — Prior Authorizations page (access-restricted)', url: 'https://www.molinahealthcare.com/providers/tx/medicaid/forms/PA.aspx' },
      { title: 'Molina TX — Medicaid/CHIP Prior Authorization Guide (access-restricted)', url: 'https://www.molinamarketplace.com/-/media/Molina/PublicWebsite/PDF/Providers/tx/medicaid/forms/MHT-Prior-Authorization-Guide-2025_R.ashx' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of Texas cover ABA?', a: 'Yes — the statewide THSteps-CCP Autism Services benefit on TMPPM criteria, with PA on evaluation and treatment. Pediatric ABA members sit on Molina STAR; STAR+PLUS is the adult program and CHIP is excluded.' },
      { q: 'Does Molina have its own Texas ABA criteria?', a: 'We found no evidence of distinct criteria — Texas MCOs must apply the TMPPM. Plan clinically to the state baseline, and confirm code-level PA handling in Molina\'s PA Code Matrix / Look-Up Tool since its PA guide PDFs are not reliably accessible online.' },
      { q: 'What happened to Cigna\'s Texas Medicaid members?', a: 'Molina acquired Cigna\'s Texas Medicaid (STAR+PLUS) business in 2021 — those are adult-program members. A "Cigna Medicaid" mention in Texas today means Molina.' },
    ],
  },

  'community-first-health-plans': {
    slug: 'community-first-health-plans',
    cardDesc: 'Bexar-area plan with the clearest published TX ABA billing crosswalk — a TMPPM digest.',
    assessmentPA: 'Required — 97151 not reimbursable unless the evaluation was submitted for authorization; up to 24 units per period',
    treatmentPA: 'Required — 97153, 97154, 97155, 97156, 97158 + 99366 all PA-gated',
    dxRequired: 'Yes — F84.0 diagnosis mandatory, per the plan\'s billing guidelines',
    payer: 'Community First Health Plans',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Community First (TX)',
    h1: 'Community First Health Plans ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Community First Health Plans (TX Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Community First Health Plans administers Texas Medicaid ABA in the Bexar service area — its published Autism Services Billing Guidelines, the HO/HN/HM modifier crosswalk, PA requirements, and concurrent-billing rules.',
    intro: [
      'Community First Health Plans — the San Antonio-based plan serving STAR, STAR Kids, and CHIP in the Bexar service delivery area — administers the state ABA benefit as a straight TMPPM pass-through, and it publishes one of the clearest MCO billing references for Texas ABA anywhere: its Autism Services Billing Guidelines page lays out the code list, the HO/HN/HM modifier crosswalk, unit caps, and the concurrent-billing rules in plain tables. Even practices that never bill Community First bookmark it as an onboarding reference for the Texas modifier system.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO — STAR, STAR Kids, CHIP (Bexar SDA)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria — billing page is a TMPPM digest' },
      { label: 'Prior auth', value: 'Required — 97151 not reimbursable without an authorization on file' },
      { label: 'Diagnosis', value: 'F84.0 mandatory; ages 0–20' },
      { label: 'Daily cap', value: '8 hours / 32 units combined (97153, 97154, 97155, 97158)' },
      { label: 'Rates', value: 'References 1 TAC § 355 / the Texas Medicaid fee schedule' },
    ],
    sections: [
      {
        h2: 'The billing crosswalk worth bookmarking',
        body: [
          'Community First\'s published guidelines make the state\'s billing mechanics concrete: 97151 "is not reimbursable unless evaluation was submitted for authorization of payment," capped at 24 units per period; treatment codes 97153, 97154, 97155, 97156, and 97158 plus team-meeting code 99366 are all PA-gated; direct treatment caps at 8 hours / 32 units per day combined; and the credential modifiers (HO = LBA, HN = LaBA, HM = behavior technician) map exactly to the TMPPM. The page also spells out the edges that generate denials elsewhere: no separate pre/post-evaluation billing beyond 97151, telehealth prohibited for BT/LaBA-delivered direct treatment, and concurrent billing prohibited unless the family service is delivered without the child present.',
        ],
        cites: [
          { title: 'Community First Health Plans — Autism Services Billing Guidelines', url: 'https://communityfirsthealthplans.com/community-first-providers/medicaid-providers/autism-services-billing-guidelines/' },
        ],
      },
      {
        h2: 'Running cases at Community First',
        body: [
          'The clinical rulebook is the state\'s: F84.0 diagnosis mandatory, ages 0 through 20, the TMPPM\'s PA cadence, and rates referencing 1 TAC § 355 and the Texas Medicaid fee schedule (no plan-specific rates published). Authorizations run through the Community First provider portal. Because the plan is a TMPPM digest rather than a second rulebook, a practice that has its state-baseline package tight — referral, recency-checked diagnosis, per-code units within caps — should find Community First one of the more predictable Texas submissions.',
        ],
        cites: [
          { title: 'Community First Health Plans — Autism Services Billing Guidelines', url: 'https://communityfirsthealthplans.com/community-first-providers/medicaid-providers/autism-services-billing-guidelines/' },
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
        ],
      },
    ],
    collect: [
      { title: 'F84.0 diagnosis + recency', desc: 'The plan states the diagnosis requirement explicitly — and the state 3-year recency rule applies.' },
      { title: 'PA before the evaluation', desc: '97151 is not reimbursable without a submitted authorization — no assess-first shortcut.' },
      { title: 'Session structure', desc: 'Concurrent billing is prohibited unless family services run without the child present — schedule accordingly.' },
      { title: 'Modifier discipline', desc: 'HO/HN/HM must match who rendered — the crosswalk on the plan\'s page is the reference.' },
    ],
    sources: [
      { title: 'Community First Health Plans — Autism Services Billing Guidelines', url: 'https://communityfirsthealthplans.com/community-first-providers/medicaid-providers/autism-services-billing-guidelines/' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Community First Health Plans cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit in the Bexar service area, on TMPPM criteria: F84.0 diagnosis, ages 0–20, PA on evaluation and all treatment codes, 8-hour daily cap.' },
      { q: 'Does the ABA evaluation need prior authorization at Community First?', a: 'Yes — the plan\'s billing guidelines state 97151 is not reimbursable unless the evaluation was submitted for authorization, capped at 24 units per period.' },
      { q: 'Why do providers outside Bexar County reference Community First\'s guidelines?', a: 'Its Autism Services Billing Guidelines page is one of the clearest public crosswalks of the Texas ABA codes, HO/HN/HM modifiers, and unit caps — a useful TMPPM digest even for other plans\' cases.' },
    ],
  },

  'driscoll-health-plan': {
    slug: 'driscoll-health-plan',
    cardDesc: 'South Texas plan using the statewide TARF form; per-code PA checks via its lookup portal.',
    assessmentPA: 'Required — verify per-code on the DHP Prior Authorization Portal (driscollhealthplan.com/priorauthcheck)',
    treatmentPA: 'Required — submit via the DHP portal or fax 1-866-741-5650 using the Texas Authorization Referral Form (TARF)',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria',
    payer: 'Driscoll Health Plan',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Driscoll Health Plan',
    h1: 'Driscoll Health Plan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Driscoll Health Plan (TX Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Driscoll Health Plan administers Texas Medicaid ABA in South Texas — TMPPM criteria, the statewide Texas Authorization Referral Form (TARF), and the plan\'s per-code prior authorization lookup portal.',
    intro: [
      'Driscoll Health Plan — the children\'s-hospital-affiliated plan serving STAR, STAR Kids, and CHIP across South Texas — administers the state ABA benefit with no distinct clinical policy: TMPPM criteria govern. Its operational profile is unusually low-friction for practices that already work statewide, because Driscoll uses the statewide Texas Authorization Referral Form (TARF) rather than a proprietary form, and it runs a public per-code PA lookup portal that answers "does this code need auth?" without a phone call.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO — STAR, STAR Kids, CHIP (South Texas)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (no distinct ABA policy)' },
      { label: 'Prior auth', value: 'Required — Autism (ABA) Services listed on the plan\'s PA portal' },
      { label: 'Form', value: 'Statewide Texas Authorization Referral Form (TARF) — no proprietary form' },
      { label: 'Submission', value: 'DHP portal or fax 1-866-741-5650' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'How Driscoll runs authorization',
        body: [
          'Autism (ABA) Services appear on Driscoll\'s Prior Authorization Requirement Portal (driscollhealthplan.com/priorauthcheck) — the plan\'s own tool for verifying PA requirements code by code, which is the right first stop before any submission. Requests submit through the DHP portal or by fax to 1-866-741-5650 using the Texas Authorization Referral Form. Because the TARF is the statewide form, a practice already producing TARFs for other plans has no form-conversion work here — attach the state-baseline clinical package (signed prescriber referral, recency-checked ASD diagnosis, per-code units) and follow the TMPPM\'s 90/90/180 cadence.',
        ],
        cites: [
          { title: 'Driscoll Health Plan — Prior Authorization Requirement Portal (Autism/ABA Services)', url: 'https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services' },
          { title: 'Driscoll Health Plan — For Providers', url: 'https://driscollhealthplan.com/for-providers/' },
        ],
      },
      {
        h2: 'The state rules travel with the member',
        body: [
          'Everything on the Texas Medicaid guide applies unchanged: PA on the 97151 evaluation (24-unit cap), the April 2025 removal of the prescriber signature on 90-day extensions, the 3-year diagnosis recency rule, the 8-hour daily direct-treatment cap, credential modifiers, and the telehealth restrictions. Driscoll\'s only plan-specific wrinkle is workflow — verify the code on the portal, submit the TARF, track through the DHP portal.',
        ],
        cites: [
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
        ],
      },
    ],
    collect: [
      { title: 'Program line', desc: 'STAR / STAR Kids vs. CHIP — CHIP is excluded from the ABA benefit.' },
      { title: 'ASD dx + recency', desc: 'State baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'TARF ready', desc: 'Driscoll takes the statewide Texas Authorization Referral Form — reuse your existing template.' },
      { title: 'Portal check per code', desc: 'Run the codes through priorauthcheck before submitting — it\'s the plan\'s own source of truth.' },
    ],
    sources: [
      { title: 'Driscoll Health Plan — Prior Authorization Requirement Portal (Autism/ABA Services)', url: 'https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services' },
      { title: 'Driscoll Health Plan — For Providers', url: 'https://driscollhealthplan.com/for-providers/' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Driscoll Health Plan cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit across its South Texas service areas, on TMPPM criteria, with PA required (Autism/ABA Services are listed on the plan\'s PA portal).' },
      { q: 'What form does Driscoll use for ABA authorizations?', a: 'The statewide Texas Authorization Referral Form (TARF), submitted via the DHP portal or fax to 1-866-741-5650 — no proprietary plan form.' },
      { q: 'Is Driscoll\'s ABA policy different from the state\'s?', a: 'No — it publishes no distinct ABA criteria. The TMPPM baseline governs; the plan-specific layer is the PA lookup portal and TARF workflow.' },
    ],
  },

  'aetna-texas': {
    slug: 'aetna-texas',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Tex. Ins. Code § 1355.015 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Texas',
    state: 'TX', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Texas',
    h1: 'Aetna ABA coverage in Texas: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Texas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Texas families — the national clinical policy, prior authorization, the Tex. Ins. Code § 1355.015 mandate (the before-age-10 diagnosis gate, the $36,000 cap, exemptions), Texas behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Texas, an Aetna card means three layers at once: the carrier\'s national clinical policy, Texas\'s autism insurance mandate (Tex. Ins. Code § 1355.015), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Tex. Ins. Code § 1355.015 (HB 1919, 2007, as amended)' },
      { label: 'Mandate age', value: 'From diagnosis — but the ASD dx must predate the 10th birthday; coverage continues once eligible' },
      { label: 'Mandate caps', value: 'No cap under 10; $36,000/yr ABA cap at age 10+ (parity-limited)' },
      { label: 'Exempt from mandate', value: 'ERS and UT/A&M system plans; self-funded ERISA; limited policies' },
      { label: 'Licensure', value: 'TX Licensed Behavior Analyst — TDLR (Occupations Code Ch. 506)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Texas',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Texas is the legal floor underneath it: the state mandate below governs what state-regulated group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Texas.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Texas mandate: the age-10 gate and the $36K cap',
        body: [
          'Texas\'s mandate — Tex. Ins. Code § 1355.015, enacted by HB 1919 in 2007 and expanded several times since — applies to group health benefit plans (group policies, HMOs, group hospital service contracts, and TRS school-employee plans), and it has a structure intake teams must internalize: coverage runs from the date of diagnosis, but only if the ASD diagnosis was in place before the child\'s 10th birthday. Once eligible, coverage continues — the statute sets no upper age cutoff on continuing benefits. Covered services are broad ("all generally recognized services": evaluation, ABA, behavior training, speech/OT/PT, medications). The statute also requires autism screening at 18 and 24 months.',
          'The dollar terms split at the same birthday: under age 10 there is no dollar cap, and at age 10 and older the plan isn\'t required to cover ABA beyond $36,000 per year (§ 1355.015(c-1)). That cap should be framed carefully: ASD is generally treated as a mental health condition, and an annual dollar limit on MH benefits sits in tension with federal parity law for parity-covered large-group plans — the standard industry reading is that many fully-insured large-group plans don\'t enforce it, though we found no TDI or federal guidance document confirming that, so treat the parity argument as analysis, not settled rule. Exemptions: the state-employee (ERS) and UT/A&M system plans are carved out, self-funded ERISA plans are exempt by federal preemption, and small-group applicability has a genuine statutory ambiguity — § 1355.015 has no small-employer subsection, so confirm small-group cases with TDI rather than assuming either way.',
        ],
        cites: [
          { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
          { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
          { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
        ],
      },
      {
        h2: 'Aetna Medicaid in Texas',
        body: [
          'A family saying "we have Aetna" in Texas may actually be on the carrier\'s Medicaid plan — Aetna Better Health of Texas (STAR, STAR Kids, and CHIP in the Bexar and Tarrant service areas) — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan. Note also that we found no Texas-specific Aetna commercial ABA policy or form in public sources (Aetna\'s document servers restrict automated retrieval, so treat that absence as high-confidence but worth a portal check): the national policy plus the state mandate is the working picture.',
        ],
      },
      {
        h2: 'Licensure & rates in Texas',
        body: [
          'Texas has required licensure to practice ABA since 2018: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the Behavior Analyst Licensing Act (Occupations Code Chapter 506), administered by the Texas Department of Licensing and Regulation (TDLR) with BACB certification as the backbone — family members implementing plans and technicians working under an LBA/LaBA\'s authority are statutorily exempt. On rates: Aetna does not publish commercial ABA fee schedules for Texas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Texas Medicaid fee schedule (97153 at $14.50/unit as of 9/1/2025) is the public benchmark to negotiate against.',
        ],
        cites: [
          { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. Aetna Better Health of Texas (Medicaid) — different rules, different guide.' },
      { title: 'Diagnosis date vs. age 10', desc: 'The mandate\'s eligibility gate: was the ASD diagnosis made before the 10th birthday? Capture the exact dx date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
      { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
      { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
      { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Texas?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Texas\'s mandate (Tex. Ins. Code § 1355.015) for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Texas autism mandate require?', a: 'For covered group plans: treatment coverage from the date of diagnosis, provided the ASD diagnosis was made before the child\'s 10th birthday (coverage continues once eligible), with no dollar cap under 10 and a $36,000/year ABA cap at 10+ that federal parity arguably limits for large-group plans. Screening is covered at 18 and 24 months.' },
      { q: 'My client was diagnosed after age 10 — is Aetna coverage impossible?', a: 'The Texas mandate doesn\'t apply, but that isn\'t the end: Aetna\'s national policy covers ABA for ASD on its own terms, and federal parity governs group plans. Run the benefits verification before turning any family away.' },
      { q: 'What does Aetna pay for ABA in Texas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Texas Medicaid fee schedule (97153 at $14.50 per 15-minute unit effective 9/1/2025), and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-texas': {
    slug: 'cigna-texas',
    family: 'cigna',
    cardDesc: 'EN0499 (no TX carve-out) + the Tex. Ins. Code § 1355.015 mandate layer; no TX Medicaid plan.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Texas',
    state: 'TX', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Texas',
    h1: 'Cigna / Evernorth ABA coverage in Texas: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Texas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Texas families — the national EN0499 policy (which applies in Texas with no carve-out), prior authorization, the Tex. Ins. Code § 1355.015 mandate, Texas behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Texas, a Cigna card means three layers at once: the carrier\'s national clinical policy, Texas\'s autism insurance mandate (Tex. Ins. Code § 1355.015), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Tex. Ins. Code § 1355.015 (HB 1919, 2007, as amended)' },
      { label: 'Mandate age', value: 'From diagnosis — but the ASD dx must predate the 10th birthday; coverage continues once eligible' },
      { label: 'Mandate caps', value: 'No cap under 10; $36,000/yr ABA cap at age 10+ (parity-limited)' },
      { label: 'Exempt from mandate', value: 'ERS and UT/A&M system plans; self-funded ERISA; limited policies' },
      { label: 'Licensure', value: 'TX Licensed Behavior Analyst — TDLR (Occupations Code Ch. 506)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Texas',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. And unlike some states, Texas has no carve-out: we verified the current EN0499 contains no Texas-specific exception, so the national policy applies to Texas business, with the state mandate below as the legal floor for state-regulated group plans. Plan funding type is still the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Texas.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Texas mandate: the age-10 gate and the $36K cap',
        body: [
          'Texas\'s mandate — Tex. Ins. Code § 1355.015, enacted by HB 1919 in 2007 and expanded several times since — applies to group health benefit plans (group policies, HMOs, group hospital service contracts, and TRS school-employee plans), and it has a structure intake teams must internalize: coverage runs from the date of diagnosis, but only if the ASD diagnosis was in place before the child\'s 10th birthday. Once eligible, coverage continues — the statute sets no upper age cutoff on continuing benefits. Covered services are broad ("all generally recognized services": evaluation, ABA, behavior training, speech/OT/PT, medications). The statute also requires autism screening at 18 and 24 months.',
          'The dollar terms split at the same birthday: under age 10 there is no dollar cap, and at age 10 and older the plan isn\'t required to cover ABA beyond $36,000 per year (§ 1355.015(c-1)). That cap should be framed carefully: ASD is generally treated as a mental health condition, and an annual dollar limit on MH benefits sits in tension with federal parity law for parity-covered large-group plans — the standard industry reading is that many fully-insured large-group plans don\'t enforce it, though we found no TDI or federal guidance document confirming that, so treat the parity argument as analysis, not settled rule. Exemptions: the state-employee (ERS) and UT/A&M system plans are carved out, self-funded ERISA plans are exempt by federal preemption, and small-group applicability has a genuine statutory ambiguity — § 1355.015 has no small-employer subsection, so confirm small-group cases with TDI rather than assuming either way.',
        ],
        cites: [
          { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
          { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
          { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
        ],
      },
      {
        h2: 'No Cigna Medicaid in Texas',
        body: [
          'Unlike Aetna and UnitedHealthcare, Cigna has no Texas Medicaid plan to cross-wire with: its Texas Medicaid (STAR+PLUS) contracts were sold to Molina Healthcare in 2021, and its 2025 sale to HCSC covered Medicare businesses only. A "Cigna Medicaid" mention in Texas today means Molina — route those families to the Molina guide. Every genuine Cigna card in Texas is commercial (or marketplace) business under this page\'s rules.',
        ],
        cites: [
          { title: 'Molina — Cigna Transition Provider Notice (TX Medicaid sale)', url: 'https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/tx/medicaid/comm/Cigna-Transition-Provider-Notice-Final.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Texas',
        body: [
          'Texas has required licensure to practice ABA since 2018: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the Behavior Analyst Licensing Act (Occupations Code Chapter 506), administered by the Texas Department of Licensing and Regulation (TDLR) with BACB certification as the backbone — family members implementing plans and technicians working under an LBA/LaBA\'s authority are statutorily exempt. On rates: Cigna does not publish commercial ABA fee schedules for Texas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Texas Medicaid fee schedule (97153 at $14.50/unit as of 9/1/2025) is the public benchmark to negotiate against.',
        ],
        cites: [
          { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Diagnosis date vs. age 10', desc: 'The mandate\'s eligibility gate: was the ASD diagnosis made before the 10th birthday? Capture the exact dx date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
      { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
      { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
      { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Texas?', a: 'Yes — under national policy EN0499 (which has no Texas carve-out), layered on Texas\'s mandate (Tex. Ins. Code § 1355.015) for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Texas autism mandate require?', a: 'For covered group plans: treatment coverage from the date of diagnosis, provided the ASD diagnosis was made before the child\'s 10th birthday (coverage continues once eligible), with no dollar cap under 10 and a $36,000/year ABA cap at 10+ that federal parity arguably limits for large-group plans.' },
      { q: 'Is there a Cigna Medicaid plan in Texas?', a: 'No — Cigna sold its Texas Medicaid (STAR+PLUS) business to Molina in 2021. A Texas family mentioning "Cigna Medicaid" is on Molina today.' },
      { q: 'What does Cigna pay for ABA in Texas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Texas Medicaid fee schedule (97153 at $14.50 per 15-minute unit effective 9/1/2025), and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-texas': {
    slug: 'unitedhealthcare-texas',
    family: 'unitedhealthcare',
    cardDesc: 'Optum criteria (no TX mandate entry) + the Tex. Ins. Code § 1355.015 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Texas',
    state: 'TX', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Texas',
    h1: 'UnitedHealthcare / Optum ABA coverage in Texas: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Texas: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Texas families — the national clinical policy, prior authorization, the Tex. Ins. Code § 1355.015 mandate (the before-age-10 diagnosis gate, the $36,000 cap, exemptions), Texas behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Texas, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Texas\'s autism insurance mandate (Tex. Ins. Code § 1355.015), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Tex. Ins. Code § 1355.015 (HB 1919, 2007, as amended)' },
      { label: 'Mandate age', value: 'From diagnosis — but the ASD dx must predate the 10th birthday; coverage continues once eligible' },
      { label: 'Mandate caps', value: 'No cap under 10; $36,000/yr ABA cap at age 10+ (parity-limited)' },
      { label: 'Exempt from mandate', value: 'ERS and UT/A&M system plans; self-funded ERISA; limited policies' },
      { label: 'Licensure', value: 'TX Licensed Behavior Analyst — TDLR (Occupations Code Ch. 506)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Texas',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. Notably, Optum\'s "ABA State Mandates" supplemental criteria document has no Texas entry — we verified the current edition\'s state list (Arizona through Pennsylvania) contains no Texas overlay — so Texas commercial ABA runs on Optum\'s standard criteria plus the state mandate below for state-regulated group plans. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Texas.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
          { title: 'Optum — ABA State Mandates supplemental criteria (BH803ABA STM 1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Texas mandate: the age-10 gate and the $36K cap',
        body: [
          'Texas\'s mandate — Tex. Ins. Code § 1355.015, enacted by HB 1919 in 2007 and expanded several times since — applies to group health benefit plans (group policies, HMOs, group hospital service contracts, and TRS school-employee plans), and it has a structure intake teams must internalize: coverage runs from the date of diagnosis, but only if the ASD diagnosis was in place before the child\'s 10th birthday. Once eligible, coverage continues — the statute sets no upper age cutoff on continuing benefits. Covered services are broad ("all generally recognized services": evaluation, ABA, behavior training, speech/OT/PT, medications). The statute also requires autism screening at 18 and 24 months.',
          'The dollar terms split at the same birthday: under age 10 there is no dollar cap, and at age 10 and older the plan isn\'t required to cover ABA beyond $36,000 per year (§ 1355.015(c-1)). That cap should be framed carefully: ASD is generally treated as a mental health condition, and an annual dollar limit on MH benefits sits in tension with federal parity law for parity-covered large-group plans — the standard industry reading is that many fully-insured large-group plans don\'t enforce it, though we found no TDI or federal guidance document confirming that, so treat the parity argument as analysis, not settled rule. Exemptions: the state-employee (ERS) and UT/A&M system plans are carved out, self-funded ERISA plans are exempt by federal preemption, and small-group applicability has a genuine statutory ambiguity — § 1355.015 has no small-employer subsection, so confirm small-group cases with TDI rather than assuming either way.',
        ],
        cites: [
          { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
          { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
          { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Texas',
        body: [
          'A family saying "we have UnitedHealthcare" in Texas may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of Texas (STAR, STAR Kids, CHIP) — which follows the state TMPPM rules with ABA carved out to Optum\'s behavioral health network, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Texas',
        body: [
          'Texas has required licensure to practice ABA since 2018: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LaBA) credentials under the Behavior Analyst Licensing Act (Occupations Code Chapter 506), administered by the Texas Department of Licensing and Regulation (TDLR) with BACB certification as the backbone — family members implementing plans and technicians working under an LBA/LaBA\'s authority are statutorily exempt. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Texas (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Texas Medicaid fee schedule (97153 at $14.50/unit as of 9/1/2025) is the public benchmark to negotiate against.',
        ],
        cites: [
          { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Texas (Medicaid) — different rules, different guide.' },
      { title: 'Diagnosis date vs. age 10', desc: 'The mandate\'s eligibility gate: was the ASD diagnosis made before the 10th birthday? Capture the exact dx date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH803ABA STM 1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'Tex. Ins. Code § 1355.015 (full text + history)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.015' },
      { title: 'Tex. Ins. Code § 1355.002 (applicability)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.002' },
      { title: 'Tex. Ins. Code § 1355.003 (exceptions)', url: 'https://texas.public.law/statutes/tex._ins._code_section_1355.003' },
      { title: 'TDLR — Behavior Analysts program (Occupations Code Ch. 506)', url: 'https://www.tdlr.texas.gov/bhv/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Texas?', a: 'Yes — under Optum\'s national clinical criteria for ASD, layered on Texas\'s mandate (Tex. Ins. Code § 1355.015) for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Texas autism mandate require?', a: 'For covered group plans: treatment coverage from the date of diagnosis, provided the ASD diagnosis was made before the child\'s 10th birthday (coverage continues once eligible), with no dollar cap under 10 and a $36,000/year ABA cap at 10+ that federal parity arguably limits for large-group plans.' },
      { q: 'Does Optum have Texas-specific ABA criteria?', a: 'No — Optum\'s ABA State Mandates supplement contains no Texas entry, so its standard national criteria apply, with the Texas mandate as the legal floor for state-regulated plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Texas?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Texas Medicaid fee schedule (97153 at $14.50 per 15-minute unit effective 9/1/2025), and treat rate-setting as part of contracting.' },
    ],
  },
};
