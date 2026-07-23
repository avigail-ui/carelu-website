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

  'community-health-choice-texas': {
    slug: 'community-health-choice-texas',
    cardDesc: 'Own ABA Medical Review Guideline (adopted 6/2026); TSPA+CCP form; 85% attendance rule on extensions.',
    assessmentPA: 'Required — Texas Standard PA form (TSPA) + CCP PA form, signed prescriber referral, ASD dx within 3 years; 97151 capped 6 hrs/24 units',
    treatmentPA: 'Required — 90-day initial + 90-day extension (needs an 85%-attendance log + BCBA-signed progress note) then 180-day recerts',
    dxRequired: 'Yes — ASD per TMPPM criteria, restated in Community Health Choice\'s own ABA Medical Review Guideline',
    payer: 'Community Health Choice',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Community Health Choice',
    h1: 'Community Health Choice ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Community Health Choice (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Community Health Choice administers Texas Medicaid ABA in Harris and Jefferson counties — its own ABA Medical Review Guideline, the TSPA + CCP form combination, the 85% attendance-log rule, named-exclusion list, and Houston-area PA contacts.',
    intro: [
      'Community Health Choice (CHC) — the nonprofit Houston plan launched in 1997 by Harris Health System, serving STAR (Harris and Jefferson counties), STAR+PLUS, CHIP, and Marketplace lines — is one of the few Texas MCOs to publish its own dedicated ABA clinical document: a "Medical Review Guideline: Applied Behavioral Analysis (ABA) Services," newly adopted by its Medical Care Management Committee in June 2026. Read closely, it is substantially a TMPPM restatement — same diagnoser list, 3-year recency rule, 8-hour daily cap — but CHC layers its own UM machinery on top: named frequency tiers, an explicit 85%-attendance threshold on extension requests, and a named list of excluded, non-ABA interventions. CHIP is excluded from the benefit, as it is statewide.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (nonprofit, Harris Health System) — STAR (Harris + Jefferson), STAR+PLUS, CHIP, Marketplace' },
      { label: 'Clinical rules', value: 'CHC\'s own ABA Medical Review Guideline (adopted 6/2026) — a TMPPM restatement plus CHC-specific UM tiers' },
      { label: 'Prior auth', value: 'Evaluation: TSPA + CCP PA form. Extension/recert: adds an 85%-attendance log + BCBA-signed progress note' },
      { label: 'Named exclusions', value: 'DIR/Floortime, TEACCH, and RDI explicitly excluded as non-ABA; school-setting shadow/companion services excluded' },
      { label: 'Submission', value: 'Provider portal or fax 713.295.2283 / 1.844.899.2495 (STAR); BH-specific outpatient fax 713.576.0931' },
      { label: 'Rates', value: 'Not published — contract-specific, references the TMHP fee schedule' },
    ],
    sections: [
      {
        h2: 'CHC\'s own ABA Medical Review Guideline',
        body: [
          'CHC\'s guideline names the Texas Medicaid Provider Procedures Manual, Children\'s Services Handbook §2 Autism Services, as its governing authority and states it "represents the minimum requirements to determine medical necessity for ABA services." It lists 97151, 97153, 97154, 97155, 97156, and 97158 explicitly (0362T and 99366 are not mentioned in CHC\'s own document — rely on the TMPPM baseline for those two codes); maps its own credentialing terms to the state\'s (BCBA = LBA, BCaBA = LaBA, BT = behavior technician requiring RBT/BCAT/ABAT certification); and requires the evaluation PA to bundle a signed prescriber referral with both the Texas Standard Prior Authorization Form (TSPA) and the state\'s CCP Prior Authorization Request Form — two forms, not one, for the initial 97151 request. The 6-hour/24-unit evaluation cap and 3-year diagnosis recency rule both match the statewide baseline.',
          'One inconsistency worth flagging for UM before your first STAR+PLUS submission: the guideline\'s own "Applies To" checkboxes mark STAR and Marketplace, but leave STAR+PLUS unchecked — even though its narrative text elsewhere discusses "Medicaid members" broadly. CHC\'s own STAR+PLUS service-area document (below) also omits Jefferson County. Confirm STAR+PLUS applicability directly with CHC\'s UM department rather than assuming either way.',
        ],
        cites: [
          { title: 'Community Health Choice — Medical Review Guideline: Applied Behavioral Analysis (ABA) Services (adopted 6/2026, PDF)', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2026/07/mrg-aba-services-guideline.pdf' },
          { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
        ],
      },
      {
        h2: 'The attendance rule and CHC\'s named exclusions',
        body: [
          'CHC\'s 90-day extension and 180-day recertification requests both require an attendance log for the child and the parent/caregiver, plus a progress summary signed by the BCBA (LBA) and the parent — and CHC states members/caregivers are "expected to attend at least 85% of scheduled sessions"; falling below that threshold requires the ABA therapist to document why and what corrective measures were taken. Build attendance tracking into practice workflow from day one at CHC, not just at the recert deadline. The guideline also names specific interventions it does not consider ABA and will not authorize under this benefit — DIR/Floortime, TEACCH, and RDI are called out explicitly — and excludes ABA delivered as school-setting shadowing, para-professional, or companion services, along with goals limited to academic content or "performative social norms" not tied to health or safety.',
        ],
        cites: [
          { title: 'Community Health Choice — Medical Review Guideline: Applied Behavioral Analysis (ABA) Services (adopted 6/2026, PDF)', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2026/07/mrg-aba-services-guideline.pdf' },
        ],
      },
      {
        h2: 'Service area and submission mechanics',
        body: [
          'CHC\'s STAR quick reference guide confirms both target counties — Harris and Jefferson — are served under STAR. Its STAR+PLUS quick reference guide, however, lists only Harris (and eight other counties) — Jefferson does not appear on the STAR+PLUS list, consistent with the "Applies To" gap noted above. CHIP is excluded from ABA entirely, per CHC\'s own HHS Provider Manual ("CHIP Exclusions from Covered Services: Applied Behavior Analysis (ABA) Therapy"). PA requests submit through the secure provider portal or by fax — 713.295.2283 or 1.844.899.2495 for general STAR authorizations, with a separate behavioral-health outpatient fax at 713.576.0931 (inpatient 713.576.0932). CHC also accepts its own "Preferred Prior Authorization Form" for non-ABA requests, but the ABA guideline specifically calls for the TSPA + CCP form combination.',
        ],
        cites: [
          { title: 'Community Health Choice — STAR Program Provider Quick Reference Guide', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2021/04/STAR-QRG-3-2021.pdf' },
          { title: 'Community Health Choice — STAR+PLUS Program Provider Quick Reference Guide', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2024/09/STARPLUS-Quick-Reference-Guide.pdf' },
          { title: 'Community Health Choice — HHS Provider Manual (STAR/CHIP/CHIP Perinatal/STAR+PLUS)', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2025/10/HHS-Provider-Manual.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'STAR vs. STAR+PLUS vs. CHIP', desc: 'CHIP is excluded from ABA. Jefferson County is confirmed for STAR — confirm STAR+PLUS eligibility with CHC directly before promising the benefit there.' },
      { title: 'ASD dx + recency', desc: 'CHC\'s diagnoser list and 3-year recency rule match the TMPPM baseline — screen recency at intake.' },
      { title: 'Attendance tracking', desc: 'The 85% attendance threshold drives extension and recert approval — log child and caregiver attendance from the first session.' },
      { title: 'Modality documentation', desc: 'Avoid billing or documenting DIR/Floortime, TEACCH, or RDI as ABA — CHC\'s guideline names them as excluded, non-ABA interventions.' },
    ],
    sources: [
      { title: 'Community Health Choice — Medical Review Guideline: Applied Behavioral Analysis (ABA) Services (adopted 6/2026, PDF)', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2026/07/mrg-aba-services-guideline.pdf' },
      { title: 'Community Health Choice — STAR Program Provider Quick Reference Guide', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2021/04/STAR-QRG-3-2021.pdf' },
      { title: 'Community Health Choice — STAR+PLUS Program Provider Quick Reference Guide', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2024/09/STARPLUS-Quick-Reference-Guide.pdf' },
      { title: 'Community Health Choice — HHS Provider Manual (STAR/CHIP/CHIP Perinatal/STAR+PLUS)', url: 'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2025/10/HHS-Provider-Manual.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Community Health Choice cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit under CHC\'s own ABA Medical Review Guideline (adopted June 2026), which restates TMPPM criteria for STAR members in Harris and Jefferson counties. CHIP is excluded.' },
      { q: 'What\'s different about CHC\'s ABA policy?', a: 'CHC layers its own UM machinery on the TMPPM baseline: named frequency tiers, an 85%-attendance requirement on extension and recertification requests, and an explicit list of excluded non-ABA interventions (DIR/Floortime, TEACCH, RDI).' },
      { q: 'What form does CHC require for the ABA evaluation PA?', a: 'Both the Texas Standard Prior Authorization Form (TSPA) and the state\'s CCP Prior Authorization Request Form, plus a signed prescriber referral — CHC\'s guideline requires the combination, not either form alone.' },
    ],
  },

  'bcbs-texas-medicaid': {
    slug: 'bcbs-texas-medicaid',
    family: 'bcbs',
    cardDesc: 'STAR/STAR Kids in Travis; insourced BH from Magellan in 2024; PA code grid confirms 97151-97158.',
    assessmentPA: 'Required — per the statewide TMPPM benefit; submit via fax 1-888-530-9809 or the Availity provider portal',
    treatmentPA: 'Required — same fax/portal; BCBSTX brought behavioral health/ABA administration in-house in 2024, ending its Magellan carve-out',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria (no distinct BCBSTX Medicaid ABA policy found)',
    payer: 'Blue Cross Blue Shield of Texas (Medicaid)',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · BCBSTX Medicaid',
    h1: 'Blue Cross Blue Shield of Texas Medicaid ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'BCBSTX Medicaid (STAR) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Blue Cross Blue Shield of Texas administers Medicaid ABA in the Travis/Austin service area — the 2024 insourcing of behavioral health from Magellan, the current PA procedure code grid, and submission mechanics via fax and Availity.',
    intro: [
      'Blue Cross Blue Shield of Texas (BCBSTX), a Division of Health Care Service Corporation, runs STAR and STAR Kids in the Travis service area — distinct from BCBSTX\'s commercial and Federal Employee Program lines, which follow different rules entirely (see our BCBSTX commercial guide for those). BCBSTX publishes no dedicated Autism Services chapter in its combined STAR/CHIP/STAR Kids provider manual; ABA policy instead lives in a standalone PA checklist and a periodically updated PA procedure code grid. The operationally important fact for intake: BCBSTX carved Medicaid behavioral health out to Magellan as recently as mid-2023, then "insourced" it in 2024 — older documents referencing Magellan are stale.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (HCSC) — STAR, STAR Kids (Travis service area; STAR Kids adds MRSA Central)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria (no distinct BCBSTX Medicaid ABA policy found)' },
      { label: 'Prior auth', value: 'Required on 97151, 97153, 97154, 97155, 97156, 97158 (confirmed on BCBSTX\'s own PA code grid, eff. 1/1/2024)' },
      { label: 'Behavioral health', value: 'Insourced from Magellan in 2024 — BCBSTX now administers BH/ABA PA directly, not via a vendor carve-out' },
      { label: 'Submission', value: 'BH intake fax 1-888-530-9809, or the Availity Essentials provider portal' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'The 2024 end of the Magellan carve-out',
        body: [
          'As late as a 7/5/2023-dated PA summary, BCBSTX directed providers to "contact Magellan for authorization requirements" for Texas Medicaid behavioral health — a classic BH carve-out. On May 10, 2024, BCBSTX announced the "insourcing of Behavioral Health Services for Medicaid," and every current-generation document we could find (the ABA PA Requirement Checklist, revised 4/26/2024, and a September 2024 UM provider training deck) makes no mention of Magellan and instead routes ABA authorization to BCBSTX\'s own behavioral-health intake fax, 1-888-530-9809, or the Availity Essentials portal. We found no document stating explicitly that the Magellan relationship has fully ended for every BH service line — if a legacy document you\'re working from still references Magellan, treat it as superseded and confirm current routing with BCBSTX\'s Medicaid Provider Network Representative before submitting.',
        ],
        cites: [
          { title: 'BCBSTX — Medicaid Behavioral Health / ABA Forms Update (news, 5/10/2024)', url: 'https://www.bcbstx.com/provider/medicaid/education-and-reference/news/2024/05-10-2024-md-behavioral-health-aba-forms' },
          { title: 'BCBSTX — Applied Behavioral Analysis PA Requirement Checklist (rev. 4/26/2024, PDF)', url: 'https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/applied-behavioral-analysis-pa-requirement-checklist.pdf' },
        ],
      },
      {
        h2: 'What the current PA code grid confirms',
        body: [
          'BCBSTX\'s Texas Medicaid Benefit Prior Authorization Procedure Code List lists 97151, 97153, 97154, 97155, 97156, and 97158 each as "Applied Behavioral Health (Allowable only for members 20 years of age or younger)," PA-required, effective 1/1/2024 — matching the statewide code set. We could not find 0362T or 99366 on this list or any other BCBSTX Medicaid document; treat their handling as unconfirmed and rely on TMPPM baseline expectations rather than a BCBSTX-specific rule. General PA turnaround per BCBSTX\'s own UM training material is 3 business days for routine requests — we found no ABA-specific SLA distinct from that standard.',
        ],
        cites: [
          { title: 'BCBSTX — Texas Medicaid Benefit Prior Authorization Procedure Code List (PDF)', url: 'https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/prior-auth-proc-code-grid-06012026.pdf' },
          { title: 'BCBSTX — Texas Medicaid STAR, CHIP, and STAR Kids Provider Manual (PDF)', url: 'https://www.bcbstx.com/content/dam/hcsc/docs/provider/tx/provider-medicaid/education/2067877-758408-0324-TX-Medicaid-STAR-CHIP-STARKids-Provider-Manual-Handbook.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Line of business', desc: 'Confirm the card is BCBSTX Medicaid (STAR/STAR Kids), not commercial or FEP — different guides, different rules.' },
      { title: 'ASD dx + recency', desc: 'State baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Current routing, not legacy Magellan', desc: 'If an older document or contact points to Magellan, confirm with BCBSTX provider relations — BH/ABA was insourced in 2024.' },
      { title: 'Prescriber referral', desc: 'The state\'s signed-referral requirement applies unchanged for the evaluation PA.' },
    ],
    sources: [
      { title: 'BCBSTX — Medicaid Behavioral Health / ABA Forms Update (news, 5/10/2024)', url: 'https://www.bcbstx.com/provider/medicaid/education-and-reference/news/2024/05-10-2024-md-behavioral-health-aba-forms' },
      { title: 'BCBSTX — Applied Behavioral Analysis PA Requirement Checklist (rev. 4/26/2024, PDF)', url: 'https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/applied-behavioral-analysis-pa-requirement-checklist.pdf' },
      { title: 'BCBSTX — Texas Medicaid Benefit Prior Authorization Procedure Code List (PDF)', url: 'https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/prior-auth-proc-code-grid-06012026.pdf' },
      { title: 'BCBSTX — Texas Medicaid STAR, CHIP, and STAR Kids Provider Manual (PDF)', url: 'https://www.bcbstx.com/content/dam/hcsc/docs/provider/tx/provider-medicaid/education/2067877-758408-0324-TX-Medicaid-STAR-CHIP-STARKids-Provider-Manual-Handbook.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Blue Cross Blue Shield of Texas Medicaid cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit for STAR and STAR Kids members in the Travis service area, on TMPPM criteria. BCBSTX publishes no distinct clinical policy; its own PA code grid confirms PA is required on the core ABA codes.' },
      { q: 'Is ABA carved out to a behavioral health vendor at BCBSTX Medicaid?', a: 'Not currently — BCBSTX carved Medicaid BH out to Magellan as recently as mid-2023, but announced "insourcing" of Medicaid behavioral health in May 2024. Current PA documents route ABA to BCBSTX\'s own fax and portal, not Magellan.' },
      { q: 'How do I submit an ABA PA to BCBSTX Medicaid?', a: 'Fax to 1-888-530-9809 or submit through the Availity Essentials provider portal, per BCBSTX\'s current ABA PA Requirement Checklist.' },
    ],
  },

  'cook-childrens-health-plan': {
    slug: 'cook-childrens-health-plan',
    cardDesc: 'Dedicated 123-page ABA training deck; 6-county Fort Worth-area STAR + STAR Kids; EpicCare Link portal.',
    assessmentPA: 'Required — 97151 capped 6 hrs/24 units, HO modifier only, 30-day authorization window; signed referral + 3-yr dx recency',
    treatmentPA: 'Required — TMPPM 90/90/180 cadence via the CCP PA form; 97155/97156/97158 need HO or HN modifier',
    dxRequired: 'Yes — ASD per TMPPM criteria, restated in Cook Children\'s own ABA provider training materials',
    payer: 'Cook Children\'s Health Plan',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Cook Children\'s Health Plan',
    h1: 'Cook Children\'s Health Plan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Cook Children\'s Health Plan (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Cook Children\'s Health Plan administers Texas Medicaid ABA across its six-county Fort Worth-area service area — its dedicated 123-page ABA provider training, code/modifier table, telehealth rules, and EpicCare Link submission process.',
    intro: [
      'Cook Children\'s Health Plan — the pediatric-focused plan affiliated with Cook Children\'s Health Care System, serving STAR and STAR Kids across six North Texas counties (Wise, Denton, Parker, Tarrant, Hood, and Johnson) — publishes an unusually deep ABA provider-education footprint for a Texas MCO: a dedicated 123-page "Applied Behavior Analysis" training deck plus a separate acute-PA training covering ABA mechanics in detail. Read closely, it\'s a faithful restatement of TMPPM §2.3 rather than a distinct plan overlay — the value here is the clarity and depth of the restatement, not a different rulebook. We found no ABA process that differs between STAR and STAR Kids in the plan\'s own materials.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (pediatric-focused) — STAR, STAR Kids, CHIP, CHIP Perinatal (Wise/Denton/Parker/Tarrant/Hood/Johnson)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria, restated in a dedicated 123-page ABA provider training deck' },
      { label: 'Prior auth', value: 'Required — evaluation, treatment, recerts, and re-evaluations, per TMPPM §2.3.7.x' },
      { label: 'Submission', value: 'EpicCare Link secure provider portal; fax only if portal access is pending (STAR/CHIP 682-885-8402)' },
      { label: 'PA turnaround', value: 'Routine 3 business days; urgent 1 business day; life-threatening 1 hour (plan\'s own figures)' },
      { label: 'Rates', value: 'Not published — plan states it follows the TMHP fee schedule' },
    ],
    sections: [
      {
        h2: 'The code and modifier table, restated in detail',
        body: [
          'Cook Children\'s own training confirms the statewide code set with granular billing notes: 97151 (evaluation/re-evaluation) caps at 6 hours/24 units with a 30-day authorization window and takes the HO modifier only; 97153 and 97154 (direct and group treatment) take no required modifier (HO/HN/HM are informational); 97155, 97156, and 97158 require an HO or HN modifier; and 99366 (interdisciplinary team meetings) takes no modifier, is reimbursable only against an F84.0 autism diagnosis, is capped at twice per year, and requires at least three licensed professionals — one of them the LBA — meeting for a minimum of 30 minutes. Direct treatment caps at 8 hours/day combined across 97153, 97154, 97155, and 97158. Telehealth (modifier 95) is allowed for 97151, 97155, 97156, 97158, and 99366; the plan\'s materials specifically note LaBAs and RBTs may not deliver any service remotely.',
        ],
        cites: [
          { title: 'Cook Children\'s Health Plan — Applied Behavior Analysis provider training (rev. 1/15/2025, PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/provider-relations/applied-behavior-analysis-011525-.pdf' },
          { title: 'Cook Children\'s Health Plan — Acute Prior Authorization (Including PDN & ABA) provider training (rev. 6/24/2026, PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/electronic-visit/acute-prior-authorization-including-pdn--aba-062426.pdf' },
        ],
      },
      {
        h2: 'Submitting through EpicCare Link',
        body: [
          'Cook Children\'s runs authorization through an EpicCare Link secure provider portal, and its determination letters are delivered only through the portal\'s In Basket — the plan states explicitly that PA determination letters will not be faxed. Fax submission (STAR/CHIP: 682-885-8402; STAR Kids: 682-303-0005 or 844-843-0005) is offered only for providers whose portal access is still pending. The plan uses the statewide-style CCP Prior Authorization Request Form with a dedicated ABA checkbox and section. One inconsistency to route around: the plan\'s own materials print at least three different variants of its PA-inquiry email address across different documents — call Provider Support Services at 1-888-243-3312 to confirm the current address rather than guessing from a specific PDF.',
        ],
        cites: [
          { title: 'Cook Children\'s Health Plan — Prior Authorization Search & Submission', url: 'https://www.cookchp.org/providers/prior-authorization-search/' },
          { title: 'Cook Children\'s Health Plan — Comprehensive Care Program Prior Authorization Request Form (PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/provider-manual/comprehensive-care-program-prior-authorization-request-form-2024.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Service area check', desc: 'Six counties, not Tarrant alone: Wise, Denton, Parker, Tarrant, Hood, Johnson.' },
      { title: 'ASD dx + recency', desc: 'TMPPM baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'Modifier discipline', desc: '97155/97156/97158 need HO or HN; 97151 takes HO only — align billing staff to the plan\'s table.' },
      { title: 'Portal access first', desc: 'Get EpicCare Link access set up before your first case — determination letters aren\'t faxed.' },
    ],
    sources: [
      { title: 'Cook Children\'s Health Plan — Applied Behavior Analysis provider training (rev. 1/15/2025, PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/provider-relations/applied-behavior-analysis-011525-.pdf' },
      { title: 'Cook Children\'s Health Plan — Acute Prior Authorization (Including PDN & ABA) provider training (rev. 6/24/2026, PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/electronic-visit/acute-prior-authorization-including-pdn--aba-062426.pdf' },
      { title: 'Cook Children\'s Health Plan — Prior Authorization Search & Submission', url: 'https://www.cookchp.org/providers/prior-authorization-search/' },
      { title: 'Cook Children\'s Health Plan — Comprehensive Care Program Prior Authorization Request Form (PDF)', url: 'https://www.cookchp.org/siteassets/documents/pdfs/provider-manual/comprehensive-care-program-prior-authorization-request-form-2024.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Cook Children\'s Health Plan cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit across STAR and STAR Kids in its six-county North Texas service area, on TMPPM criteria, with a dedicated 123-page ABA provider training restating the requirements in detail.' },
      { q: 'Does STAR Kids have different ABA rules than STAR at Cook Children\'s?', a: 'We found no distinguishing STAR Kids ABA process in the plan\'s own materials — the ABA policy applies uniformly across Medicaid, CHIP, and STAR Kids.' },
      { q: 'How do I submit an ABA PA to Cook Children\'s?', a: 'Through the EpicCare Link secure provider portal, using the Comprehensive Care Program PA form. Fax (682-885-8402 for STAR/CHIP) is available only while portal access is pending — determination letters are delivered via the portal only, not by fax.' },
    ],
  },

  'parkland-community-health-plan': {
    slug: 'parkland-community-health-plan',
    cardDesc: 'Dallas County safety-net STAR plan; BH insourced from Carelon 9/1/2025; PA covers 97151-99366, not 0362T.',
    assessmentPA: 'Required — per the statewide TMPPM benefit; PCHP\'s own PA list confirms 97151 and every treatment code',
    treatmentPA: 'Required — Texas Standard PA form; behavioral health moved from Carelon to direct PCHP administration 9/1/2025',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria (ages 0-20, diagnosed or reconfirmed within 3 years)',
    payer: 'Parkland Community Health Plan',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Parkland Community Health Plan',
    h1: 'Parkland Community Health Plan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Parkland Community Health Plan (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Parkland Community Health Plan administers Texas Medicaid ABA in Dallas County — the September 2025 move of behavioral health from Carelon to direct PCHP administration, its PA code list, and submission mechanics.',
    intro: [
      'Parkland Community Health Plan (PCHP) — a program of Dallas County Hospital District serving STAR, CHIP, and CHIP Perinate across seven North Texas counties (Dallas, Collin, Ellis, Hunt, Kaufman, Navarro, and Rockwall) — delivers the state Autism Services benefit for members ages 0–20 with an ASD diagnosis made or reconfirmed within 3 years, available on STAR only (CHIP is excluded, matching the statewide rule). The operational fact that matters most for intake right now: PCHP transitioned behavioral health administration away from the Carelon Behavioral Health network and brought it in-house, effective September 1, 2025 — providers who contracted with Carelon for Parkland\'s BH network had to re-contract directly with PCHP, and older Carelon-branded provider manuals for this plan are no longer current.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (Dallas County Hospital District) — STAR, CHIP, CHIP Perinate (7-county Dallas service area)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria; PCHP publishes no distinct ABA clinical policy beyond its PA list' },
      { label: 'Prior auth', value: 'Required — PCHP\'s own PA list: "required for ABA evaluation, initial course of treatment, and subsequent re-evaluations for recertification"' },
      { label: 'Behavioral health', value: 'Insourced from Carelon Behavioral Health effective 9/1/2025 — administered directly by PCHP now' },
      { label: 'Submission', value: 'BH-specific fax 214-266-2064 / 1-844-266-2064; general PA fax 214-266-2085 / 1-844-303-1382' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'What PCHP\'s own PA list confirms',
        body: [
          'PCHP\'s Prior Authorization Requirements document (effective September 1, 2025) states plainly: "Prior authorization is required for ABA evaluation, initial course of treatment, and subsequent re-evaluations for recertification." Its code table lists 97151, 97152, 97153, 97154, 97155, 97156, 97157, 97158, and 99366 explicitly under an "Applied Behavior Analysis" category — 0362T does not appear anywhere in the list, and we found no PCHP document addressing that code specifically, so treat its status as unconfirmed rather than assuming it is or isn\'t required. The document points to a supporting-documentation appendix for code-level specifics that we could not independently verify — confirm current documentation requirements with PCHP provider services before your first submission.',
        ],
        cites: [
          { title: 'Parkland Community Health Plan — Prior Authorization Requirements (eff. 9/1/2025, PDF)', url: 'https://providers.parklandhealthplan.com/Uploads/Public/Documents/Provider/PCHP%202025%20Prior%20Authorization%20Requirements%20v2.pdf' },
          { title: 'Parkland Community Health Plan — ABA benefit overview (member-facing)', url: 'https://parklandhealthplan.com/living-well/blog/articles/aba' },
        ],
      },
      {
        h2: 'The September 2025 behavioral health transition',
        body: [
          'PCHP announced it was "transitioning Behavioral Health services from Carelon effective Sept. 1, 2025," with providers required to contract and credential directly with PCHP to remain in-network for behavioral health, and new member ID cards issued with updated BH information. PCHP\'s own 218-page provider manual, last revised September 2024, still describes "Carelon and PCHP will work together" and contains no ABA-specific content at all — it predates both the transition and any ABA-specific policy detail, so treat it as materially out of date for behavioral health and ABA purposes. The PA requirements PDF and direct contact with PCHP provider services (1-888-672-2277) are the more current sources.',
        ],
        cites: [
          { title: 'Parkland Community Health Plan — Behavioral Health Services Transition Announcement', url: 'https://parklandhealthplan.com/living-well/blog/articles/pchp-benefits-update-changes-to-behavioral-health-services/' },
          { title: 'Parkland Community Health Plan — Behavioral Health network page', url: 'https://providers.parklandhealthplan.com/our-network/behavioral-health/' },
        ],
      },
    ],
    collect: [
      { title: 'STAR vs. CHIP', desc: 'ABA is available for STAR members only — CHIP is excluded, per PCHP\'s own member-facing benefit page.' },
      { title: 'ASD dx + recency', desc: 'Diagnosed or reconfirmed within 3 years, by a developmental pediatrician, neurologist, psychiatrist, or licensed psychologist.' },
      { title: 'Current BH contracting status', desc: 'Confirm your practice is credentialed directly with PCHP (not still routed to Carelon) post-9/1/2025.' },
      { title: 'PA channel', desc: 'Use the BH-specific fax (214-266-2064) or PCHP\'s provider portal — don\'t default to a Carelon-era process.' },
    ],
    sources: [
      { title: 'Parkland Community Health Plan — Prior Authorization Requirements (eff. 9/1/2025, PDF)', url: 'https://providers.parklandhealthplan.com/Uploads/Public/Documents/Provider/PCHP%202025%20Prior%20Authorization%20Requirements%20v2.pdf' },
      { title: 'Parkland Community Health Plan — ABA benefit overview (member-facing)', url: 'https://parklandhealthplan.com/living-well/blog/articles/aba' },
      { title: 'Parkland Community Health Plan — Behavioral Health Services Transition Announcement', url: 'https://parklandhealthplan.com/living-well/blog/articles/pchp-benefits-update-changes-to-behavioral-health-services/' },
      { title: 'Parkland Community Health Plan — Behavioral Health network page', url: 'https://providers.parklandhealthplan.com/our-network/behavioral-health/' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does Parkland Community Health Plan cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit for STAR members ages 0-20 with an ASD diagnosis, on TMPPM criteria. CHIP members are excluded.' },
      { q: 'Is behavioral health still carved out to Carelon at PCHP?', a: 'No — PCHP transitioned behavioral health administration from Carelon to direct in-house administration effective September 1, 2025. Providers had to re-contract directly with PCHP.' },
      { q: 'What codes does PCHP require PA for?', a: '97151, 97152, 97153, 97154, 97155, 97156, 97157, 97158, and 99366, per PCHP\'s own Prior Authorization Requirements list (eff. 9/1/2025). 0362T does not appear on that list — its status is unconfirmed.' },
    ],
  },

  'el-paso-health': {
    slug: 'el-paso-health',
    cardDesc: 'El Paso\'s founding Medicaid MCO (ex-El Paso First); 85% attendance rule; not the SDA\'s only plan.',
    assessmentPA: 'Required — 97151 capped 6 hrs/24 units, HO modifier only; initial evaluation authorization valid 60 days from the requested date',
    treatmentPA: 'Required — 90-day initial + 90-day extension (attendance logs + LBA progress summary) then up-to-180-day recerts',
    dxRequired: 'Yes — ASD per TMPPM criteria; El Paso Health requires a validated diagnostic tool (ADOS, ADI-R, CARS) — screening tools alone don\'t qualify',
    payer: 'El Paso Health',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · El Paso Health',
    h1: 'El Paso Health ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'El Paso Health (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How El Paso Health (formerly El Paso First) administers Texas Medicaid ABA in the El Paso service area — its ABA Request Checklist, the 85% attendance rule, validated-diagnostic-tool requirement, and PA submission mechanics.',
    intro: [
      'El Paso Health — a nonprofit HMO established by the El Paso County Hospital District, rebranded from "El Paso First Health Plans" in 2017, serving STAR, CHIP, and STAR+PLUS across El Paso and Hudspeth counties — is one of the more document-rich Texas MCOs for ABA: a dedicated ABA Request Checklist and two 2026 provider memos spell out documentation requirements in more detail than most plans publish. One framing note: El Paso Health is the market\'s founding and longest-standing Medicaid plan, but is not the sole MCO in the El Paso service delivery area — secondary HHSC service-area sources indicate Molina and Superior also participate in STAR and/or CHIP there, so confirm current network participation for STAR+PLUS specifically rather than assuming exclusivity.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Texas Medicaid MCO (nonprofit, El Paso County Hospital District) — STAR, CHIP, STAR+PLUS (El Paso + Hudspeth counties)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria, detailed in El Paso Health\'s own ABA Request Checklist and 2026 provider memos' },
      { label: 'Prior auth', value: 'Required — evaluation (97151, HO modifier, 6-hr/24-unit cap), treatment, extension, and recertification' },
      { label: 'Attendance rule', value: '85%-attendance threshold on extension/recert requests, for both child and parent/caregiver sessions' },
      { label: 'Submission', value: 'Portal (secure.healthx.com/elpasoprovider) or fax 915-298-7866 / 1-844-298-7866; phone 915-532-3778' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'The ABA Request Checklist and 2026 documentation memos',
        body: [
          'El Paso Health\'s ABA Request Checklist (effective 2/1/2022) lays out each PA stage: the initial evaluation (97151, capped at 6 hours/24 units, HO modifier only) needs a signed prescriber referral and comprehensive diagnostic documentation, and the resulting authorization is valid for 60 days from the requested evaluation date; the initial 90-day treatment request needs the signed evaluation/treatment plan plus the referral; a 90-day extension (billed under 97155) needs attendance logs and an LBA progress summary; and 180-day recertifications need a re-evaluation (97151 again, up to 6 hrs/24 units) that, per the checklist, "does not require prior auth, will be reviewed upon submission." Two provider memos dated 5/15/2026 add detail beyond the statewide baseline: attendance logs for both the child and the parent/caregiver are required with every extension/recert, and services fall below 85% attendance trigger a requirement for the LBA to document why and what corrective steps were taken. A separate memo specifies the ASD diagnostic evaluation must use a validated standardized tool — ADOS, ADI-R, or CARS are named — and that screening tools like the M-CHAT-R/F cannot substitute.',
        ],
        cites: [
          { title: 'El Paso Health — ABA Request Checklist (eff. 2/1/2022, PDF)', url: 'https://elpasohealth.com/documents/ABA-REQUEST-CHECKLIST-final-2022.pdf' },
          { title: 'El Paso Health — Documentation Required for ABA Authorizations (memo, 5/15/2026, PDF)', url: 'https://www.elpasohealth.com/pdf/EPH%20-%20Documententaton%20for%20ABA%20Authorization%20_.pdf' },
          { title: 'El Paso Health — Comprehensive Diagnostic Evaluation for Autism Services (memo, 5/15/2026, PDF)', url: 'https://www.elpasohealth.com/pdf/EPH-PR-Comprehensive%20Diagnostic%20Evaluation%20for%20Autism%20Services.pdf' },
        ],
      },
      {
        h2: 'Submission mechanics — and an outdated document to avoid',
        body: [
          'PA requests submit through the DHP-style provider portal at secure.healthx.com/elpasoprovider, or by fax (outpatient/scheduled: 915-298-7866 or 1-844-298-7866) or phone (915-532-3778 or 1-877-532-3778 for STAR/CHIP; 1-833-742-3127 for STAR+PLUS). El Paso Health accepts the Texas Standard Prior Authorization Request Form, its own "Request for Behavioral Health Services" form, or the statewide CCP Prior Authorization Request Form. One caution: the plan\'s older PA Requirements Catalog (dated 2022, with code effective dates from 2019–2021) lists 97151–97158 and 99366 as "no authorization required" — that directly contradicts the current ABA Request Checklist and 2026 memos, and appears to be a stale, unmaintained document that predates the 2/1/2022 Autism Services benefit. Don\'t cite it; the ABA Request Checklist and current memos govern.',
        ],
        cites: [
          { title: 'El Paso Health — Prior Authorization (provider page)', url: 'https://elpasohealth.com/providers/prior-authorization.html' },
          { title: 'El Paso Health — STAR/CHIP/STAR+PLUS Quick Reference Guide (PDF)', url: 'https://www.elpasohealth.com/pdf/EPH-STARCHIPSTARPLUS%20Quick%20Reference%20Guide.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Line of business + network check', desc: 'STAR/CHIP/STAR+PLUS — and confirm El Paso Health is the member\'s assigned MCO, since Molina and Superior also serve the El Paso SDA.' },
      { title: 'Validated diagnostic tool on file', desc: 'El Paso Health requires ADOS, ADI-R, or CARS-level documentation — a screening tool alone won\'t support the PA.' },
      { title: 'Attendance logging', desc: 'Track child and caregiver session attendance from day one — the 85% threshold gates extension and recert approval.' },
      { title: 'Prescriber referral', desc: 'A signed, dated referral attaches to the evaluation PA, per both the statewide rule and El Paso Health\'s checklist.' },
    ],
    sources: [
      { title: 'El Paso Health — ABA Request Checklist (eff. 2/1/2022, PDF)', url: 'https://elpasohealth.com/documents/ABA-REQUEST-CHECKLIST-final-2022.pdf' },
      { title: 'El Paso Health — Documentation Required for ABA Authorizations (memo, 5/15/2026, PDF)', url: 'https://www.elpasohealth.com/pdf/EPH%20-%20Documententaton%20for%20ABA%20Authorization%20_.pdf' },
      { title: 'El Paso Health — Comprehensive Diagnostic Evaluation for Autism Services (memo, 5/15/2026, PDF)', url: 'https://www.elpasohealth.com/pdf/EPH-PR-Comprehensive%20Diagnostic%20Evaluation%20for%20Autism%20Services.pdf' },
      { title: 'El Paso Health — STAR/CHIP/STAR+PLUS Quick Reference Guide (PDF)', url: 'https://www.elpasohealth.com/pdf/EPH-STARCHIPSTARPLUS%20Quick%20Reference%20Guide.pdf' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does El Paso Health cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit across STAR, CHIP, and STAR+PLUS in El Paso and Hudspeth counties, detailed in the plan\'s own ABA Request Checklist and 2026 documentation memos.' },
      { q: 'Is El Paso Health the only Medicaid MCO in El Paso?', a: 'It\'s the market\'s founding plan, but not the only one — Molina and Superior also participate in STAR and/or CHIP there per HHSC service-area sources. Confirm the member\'s assigned MCO before assuming El Paso Health.' },
      { q: 'What diagnostic documentation does El Paso Health require?', a: 'A validated standardized tool — ADOS, ADI-R, or CARS are named in the plan\'s own memo — plus DSM criteria, severity level, and (per a separate memo) documented comorbid conditions and trauma history. Screening tools like the M-CHAT-R/F don\'t substitute.' },
    ],
  },

  'firstcare-health-plans': {
    slug: 'firstcare-health-plans',
    cardDesc: 'Lubbock + MRSA West STAR/CHIP; PA confirmed on 97151-99366; plans wind down 8/31/2026 (pending approval).',
    assessmentPA: 'Required — per FirstCare\'s own PA code list; submit via the Texas Standard PA form, myFirstCare portal, or fax',
    treatmentPA: 'Required — 97151, 97153, 97154, 97155, 97156, 97158, 99366 all confirmed on FirstCare\'s Medicaid PA list',
    dxRequired: 'Yes — ASD per the statewide TMPPM criteria; FirstCare\'s Medicaid PA defers to the TMPPM, not its commercial autism policy',
    payer: 'FirstCare Health Plans',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · FirstCare Health Plans',
    h1: 'FirstCare Health Plans ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'FirstCare Health Plans (Texas Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How FirstCare Health Plans administers Texas Medicaid ABA in Lubbock and MRSA West — its Medicaid PA code list, submission mechanics via the myFirstCare portal, and the confirmed August 2026 plan wind-down.',
    intro: [
      'FirstCare Health Plans — SHA LLC dba FirstCare, owned by Baylor Scott & White Health Plan, serving STAR in the Lubbock service area and the large Medicaid Rural Service Area (MRSA) West, plus CHIP in Lubbock only — administers ABA on the statewide TMPPM baseline with no dedicated Autism Services provider-manual section of its own; the plan\'s Behavioral Health section covers mental health and substance-use benefits in detail but never mentions autism or ABA. **The fact that matters most before building any workflow around FirstCare: the plan\'s own site states "Our plans end on Aug. 31, 2026, subject to regulatory approval"** — confirm current enrollment and transition guidance with FirstCare and HHSC before treating this as a stable long-term payer relationship.',
    ],
    atGlance: [
      { label: 'Plan status', value: 'Winding down — FirstCare\'s own site states plans end 8/31/2026, subject to regulatory approval' },
      { label: 'Plan type', value: 'Texas Medicaid MCO (Baylor Scott & White Health Plan) — STAR (Lubbock + MRSA West), CHIP (Lubbock only)' },
      { label: 'Clinical rules', value: 'TMPPM Autism Services criteria; FirstCare\'s Medicaid PA list defers to it, not its commercial Autism policy #206' },
      { label: 'Prior auth', value: 'Confirmed required on 97151, 97153, 97154, 97155, 97156, 97158, 99366 (Medicaid PA code list, eff. 7/1/2026)' },
      { label: 'Submission', value: 'myFirstCare provider portal, or the Texas Standard PA form by fax to the Health Services Dept.' },
      { label: 'Rates', value: 'Not published — contract-specific' },
    ],
    sections: [
      {
        h2: 'What FirstCare\'s Medicaid PA list confirms — and doesn\'t',
        body: [
          'FirstCare\'s STAR & CHIP Notification/Prior Authorization Codes list (effective 7/1/2026) lists 97151, 97153, 97154, 97155, 97156, 97158, and 99366 as requiring authorization, filed under "Therapy services" rather than behavioral health. Notably absent from that Medicaid-specific list: 97152, 97157, 0362T, and 0373T — those four codes appear only in FirstCare\'s separate commercial-oriented Medical Coverage Policy #206 ("Autism Spectrum Disorder"), which explicitly defers Medicaid decisions to the TMPPM: "For Medicaid plans, please confirm coverage as outlined in the Texas Medicaid Provider Procedures Manual." That same commercial policy confirms the Texas mandate\'s $36,000/year ABA cap for members 10+ "do not apply to self-funded/ERISA plans, Medicaid, or Medicare" — consistent with the statewide Medicaid baseline having no dollar cap. Treat 97152/97157/0362T/0373T PA status for FirstCare Medicaid as unconfirmed rather than assuming either way.',
        ],
        cites: [
          { title: 'FirstCare — Texas Medicaid/CHIP Notification/Prior Authorization Codes (eff. 7/1/2026, PDF)', url: 'https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR/PA-List.pdf' },
          { title: 'FirstCare — Medical Coverage Policy #206: Autism Spectrum Disorder (PDF)', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf' },
        ],
      },
      {
        h2: 'Submission mechanics, and the wind-down to plan for',
        body: [
          'Requests submit through the myFirstCare Self-Service Portal (my.firstcare.com/Web) or by fax using the Texas Standard Prior Authorization Request Form — FirstCare uses the statewide form, not a proprietary one. General turnaround is 3 working days from receipt of complete clinical information, and the plan asks providers to submit at least 5 days before the anticipated service date. One routing ambiguity we could not resolve: FirstCare\'s own contact tables list a separate Medical PA line (1-800-884-4905, fax 1-800-248-1852) and a Behavioral Health PA line (1-855-395-9652, fax 1-844-436-8779) — since ABA codes are filed under "Therapy services" rather than "Behavioral health" on the code list, confirm which line actually processes ABA requests before your first submission. And plan around the closure date directly: FirstCare\'s STAR page states its plans end August 31, 2026 pending regulatory approval — verify current transition guidance for any active caseload well before that date.',
        ],
        cites: [
          { title: 'FirstCare — 2026 STAR and CHIP Provider Manual (PDF)', url: 'https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR-CHIP-Provider-Manual.pdf' },
          { title: 'FirstCare — STAR Medicaid (plan status)', url: 'https://www.firstcare.com/en/Individuals-and-Families/STAR-CHIP/STAR-Medicaid' },
        ],
      },
    ],
    collect: [
      { title: 'Plan continuity check', desc: 'FirstCare\'s own site states plans end 8/31/2026 (pending approval) — confirm current status and any HHSC-directed member transition plan before onboarding new cases.' },
      { title: 'STAR vs. CHIP', desc: 'STAR covers Lubbock + MRSA West; CHIP is Lubbock service area only.' },
      { title: 'ASD dx + recency', desc: 'State baseline: qualified diagnoser, DSM severity, within 3 years.' },
      { title: 'PA routing confirmation', desc: 'Confirm whether Medical PA or Behavioral Health PA processes ABA requests — FirstCare\'s own documents don\'t make this unambiguous.' },
    ],
    sources: [
      { title: 'FirstCare — Texas Medicaid/CHIP Notification/Prior Authorization Codes (eff. 7/1/2026, PDF)', url: 'https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR/PA-List.pdf' },
      { title: 'FirstCare — Medical Coverage Policy #206: Autism Spectrum Disorder (PDF)', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf' },
      { title: 'FirstCare — 2026 STAR and CHIP Provider Manual (PDF)', url: 'https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR-CHIP-Provider-Manual.pdf' },
      { title: 'FirstCare — STAR Medicaid (plan status)', url: 'https://www.firstcare.com/en/Individuals-and-Families/STAR-CHIP/STAR-Medicaid' },
      { title: 'TMPPM Children\'s Services Handbook, § 2.3 Autism Services', url: 'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm' },
    ],
    faq: [
      { q: 'Does FirstCare Health Plans cover ABA?', a: 'Yes — the Texas Medicaid Autism Services benefit for STAR members in Lubbock and MRSA West, on TMPPM criteria. FirstCare\'s own Medicaid PA code list confirms PA is required on 97151, 97153-97156, 97158, and 99366.' },
      { q: 'Is FirstCare still accepting new Texas Medicaid members?', a: 'FirstCare\'s own site states its plans end August 31, 2026, subject to regulatory approval — confirm current enrollment and transition status directly with FirstCare or HHSC before building a long-term care plan around this payer.' },
      { q: 'Does the Texas mandate\'s $36,000 ABA cap apply to FirstCare Medicaid?', a: 'No — FirstCare\'s own commercial autism policy confirms the mandate\'s dollar cap applies to state-regulated commercial plans, not Medicaid, matching the no-cap statewide Medicaid baseline.' },
    ],
  },

  'baylor-scott-white-texas': {
    slug: 'baylor-scott-white-texas',
    cardDesc: 'RightCare/MRSA Central — plan is WINDING DOWN, exits Texas Medicaid 8/31/2026 (regulatory approval pending).',
    assessmentPA: 'Required — 97151 on RightCare\'s own Medicaid PA code list (PA required since 1/3/2020); PA process unaffected during the wind-down',
    treatmentPA: 'Required — 97153, 97154, 97155, 97156, 97158, 99366 all PA-required; defers to TMPPM criteria per Medical Coverage Policy 206',
    dxRequired: 'Yes — ASD, per TMPPM (Medical Coverage Policy 206 defers to TMPPM for Medicaid; own criteria apply only where TMPPM is silent)',
    payer: 'RightCare from Scott and White Health Plan (dba Baylor Scott & White Health Plan)',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · RightCare (Baylor Scott & White)',
    h1: 'RightCare (Baylor Scott & White) ABA coverage — plan is winding down.',
    metaTitle: 'RightCare / Baylor Scott & White (TX Medicaid) ABA Coverage — Plan Exiting 2026 | Carelu',
    metaDescription:
      'RightCare from Scott and White Health Plan (MRSA Central STAR Medicaid) is exiting Texas Medicaid managed care August 31, 2026. What that means for ABA prior authorization, claims deadlines, and transition planning — plus the plan\'s ABA policy while it remains active.',
    intro: [
      'Read this first: RightCare — Baylor Scott & White Health Plan\'s STAR Medicaid product for the Central Texas Medicaid Rural Service Area (MRSA Central) — is exiting the Texas Medicaid managed care program effective August 31, 2026, subject to regulatory approval. TMHP\'s own announcement and the plan\'s own site both confirm it. Its sister brand, FirstCare Health Plans (MRSA West/Lubbock), is exiting on the same date. For any family newly presenting with a RightCare STAR card, factor the wind-down into onboarding — a family\'s Medicaid managed-care assignment is likely to change soon regardless of what you do. For active RightCare cases, the plan\'s guidance is that prior-authorization processes remain unaffected during the transition, so keep following the process below through the exit date.',
    ],
    atGlance: [
      { label: 'Status', value: 'EXITING Texas Medicaid — last date of service accepted 8/31/2026 (regulatory approval pending)' },
      { label: 'Claims deadline', value: 'Providers have until 8/31/2028 to submit claims for DOS through 8/31/2026' },
      { label: 'Service area', value: 'MRSA Central — 30 counties per RightCare\'s own network materials (see below)' },
      { label: 'ABA clinical rules', value: 'Medical Coverage Policy 206 (Autism Spectrum Disorder) — defers to TMPPM for Medicaid' },
      { label: 'PA-required ABA codes', value: '97151, 97153, 97154, 97155, 97156, 97158, 99366 — matches the TMHP statewide code set' },
      { label: 'BH administration', value: 'In-house — "RightCare Behavioral Health Management," not a third-party carve-out' },
      { label: 'Rates', value: 'Not separately published — defers to the TMHP Autism Services fee schedule' },
    ],
    sections: [
      {
        h2: 'The wind-down: what it means for active and new cases',
        body: [
          'TMHP\'s July 17, 2026 announcement states Baylor Scott & White (MRSA Central) and FirstCare Health Plans (MRSA West/Lubbock) will end participation in Texas Medicaid managed care, with the final date of service TMHP will accept being August 31, 2026; claims with a date of service on or after September 1, 2026 will be rejected, and providers have until August 31, 2028 (24 months) to submit claims for dates of service through the exit date. RightCare\'s own site carries the same notice: "Our plans end on Aug. 31, 2026, subject to regulatory approval." The announcement is explicit that prior-authorization processes remain unaffected during the transition — so continue submitting and tracking PAs normally for now — but build the plan-reassignment conversation into intake for any new RightCare family, since members will need to select a new STAR MCO before the exit date. TMHP\'s Contact Center (800-925-9126) is the right first call for transition-specific questions.',
        ],
        cites: [
          { title: 'TMHP — Baylor Scott & White and FirstCare Health Plans will end participation in Texas Medicaid', url: 'https://www.tmhp.com/news/2026-07-17-baylor-scott-white-and-firstcare-health-plans-will-end-participation-texas-medicaid' },
          { title: 'RightCare — plan homepage (exit notice)', url: 'https://rightcare.swhp.org/' },
        ],
      },
      {
        h2: 'While the plan remains active: ABA authorization',
        body: [
          'RightCare\'s own Medicaid/CHIP Prior Authorization Codes list (effective 7/1/2026) confirms PA-required ABA codes 97151, 97153, 97154, 97155, 97156, 97158, and 99366 — each showing a PA-requirement effective date of 1/3/2020 — with 97152 and 97157 absent from the list, matching the TMHP statewide THSteps-CCP Autism Services code set exactly. Requests submit through the RightCare Self-Service Portal or by fax to the Medical Management line. The plan\'s separate clinical policy, Medical Coverage Policy 206 ("Autism Spectrum Disorder," effective 7/1/2026), explicitly defers to the TMPPM first: "For Medicaid plans, please confirm coverage as outlined in the Texas Medicaid Provider Procedures Manual (TMPPM). If there are no applicable criteria to guide medical necessity decision making in the TMPPM, use the criteria set forth below." Note that Policy 206\'s own CPT code table (which lists 97152, 97157, 0362T, and 0373T alongside the others) is the plan\'s general/commercial-oriented table, not the operative Medicaid PA gate — the PA code list above is what actually governs a Medicaid claim, and it matches the narrower TMHP set. We could not confirm a RightCare-specific authorization-period length (e.g., a 90-day or 6-month cycle) beyond the general TMPPM baseline — treat auth-period length as inherited from the state rules and confirm any RightCare-specific timing with the plan directly.',
        ],
        cites: [
          { title: 'RightCare — Texas Medicaid/CHIP Prior Authorization Codes List (eff. 7/1/2026)', url: 'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/forms/medicaid/RightCare_Authorization_List.pdf' },
          { title: 'BSWHP Medical Coverage Policy 206 — Autism Spectrum Disorder', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf' },
        ],
      },
      {
        h2: 'Behavioral health is in-house, not carved out',
        body: [
          'RightCare runs behavioral health administration itself, under the branded units "RightCare Behavioral Health Management" and "RightCare Behavioral Health Disease and Case Management" (phone 1-855-395-9652, fax 1-844-436-8779) — no third-party BH vendor (no Cenpatico, Beacon, Magellan, Carelon, or Optum) appears anywhere in the plan\'s current provider manual or PA materials. That BH line is distinct from the medical Prior Authorization/Medical Management line (1-855-691-7947, fax 1-512-383-8703 or 1-800-292-1349) — we could not confirm from published materials which channel ABA codes route through specifically, since the PA list groups 97151–97158/99366 alongside general PT/OT/rehab codes; confirm the correct submission channel with RightCare before your first request. General Provider Relations runs at 1-855-TX-RIGHT (1-855-897-4448).',
        ],
        cites: [
          { title: 'RightCare — 2026 Provider Manual (phone list)', url: 'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/provider-manual.pdf' },
        ],
      },
      {
        h2: 'Service area and rates',
        body: [
          'RightCare\'s own 2025/2026 network materials list a 30-county MRSA Central service area: Bell, Blanco, Bosque, Brazos, Burleson, Colorado, Comanche, Coryell, Erath, Falls, Fayette, Freestone, Gillespie, Gonzales, Grimes, Hamilton, Hill, Jackson, Lampasas, Lavaca, Leon, Limestone, Llano, Madison, McLennan, Milam, Mills, Robertson, San Saba, and Washington. A separate internal document from a different Texas MCO listing MRSA Central for its own STAR Kids product adds a 31st county (DeWitt) not on RightCare\'s own list — we could not resolve this discrepancy and flag DeWitt as unconfirmed for RightCare specifically rather than asserting it either way. No RightCare-specific ABA fee schedule was found; the plan\'s own provider manual states reimbursement follows the Medicaid fee schedule "when available" — meaning the TMHP statewide Autism Services fee schedule (PRCR615C) already covered in our Texas Medicaid guide is the reference point, not a RightCare-negotiated rate.',
        ],
        cites: [
          { title: 'RightCare — Medicaid (STAR) Network Flyer', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Providers/Network/2025/MD-RightCare.pdf' },
          { title: 'RightCare — 2026 Provider Manual', url: 'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/provider-manual.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan wind-down awareness', desc: 'RightCare exits Texas Medicaid 8/31/2026 — confirm the family\'s plan-reassignment status and don\'t build long-term authorization plans around this plan past that date.' },
      { title: 'ASD diagnosis + TMPPM-standard documentation', desc: 'The plan defers to TMPPM criteria for Medicaid — reuse the same packet you\'d build for any Texas Medicaid MCO.' },
      { title: 'Correct submission channel', desc: 'Confirm with RightCare whether ABA PA routes through Medical Management (1-855-691-7947) or Behavioral Health Management (1-855-395-9652) — not independently confirmed from published materials.' },
      { title: 'County of residence', desc: 'Confirm MRSA Central coverage for the family\'s specific county, especially near the DeWitt County boundary.' },
    ],
    sources: [
      { title: 'TMHP — Baylor Scott & White and FirstCare Health Plans will end participation in Texas Medicaid', url: 'https://www.tmhp.com/news/2026-07-17-baylor-scott-white-and-firstcare-health-plans-will-end-participation-texas-medicaid' },
      { title: 'RightCare — plan homepage (exit notice)', url: 'https://rightcare.swhp.org/' },
      { title: 'RightCare — Texas Medicaid/CHIP Prior Authorization Codes List (eff. 7/1/2026)', url: 'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/forms/medicaid/RightCare_Authorization_List.pdf' },
      { title: 'BSWHP Medical Coverage Policy 206 — Autism Spectrum Disorder', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf' },
      { title: 'RightCare — 2026 Provider Manual', url: 'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/provider-manual.pdf' },
      { title: 'RightCare — Medicaid (STAR) Network Flyer', url: 'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Providers/Network/2025/MD-RightCare.pdf' },
    ],
    faq: [
      { q: 'Is RightCare/Baylor Scott & White still a Texas Medicaid option?', a: 'Only through August 31, 2026 — the plan is exiting Texas Medicaid managed care (regulatory approval pending), per TMHP\'s July 2026 announcement. Claims for dates of service on or after September 1, 2026 will be rejected; providers have until 8/31/2028 to submit claims for earlier dates of service.' },
      { q: 'Does RightCare cover ABA therapy?', a: 'Yes, while active — PA-required codes 97151, 97153, 97154, 97155, 97156, 97158, and 99366, matching the statewide TMHP code set, with criteria deferring to the TMPPM. Prior-authorization processes remain unaffected during the wind-down.' },
      { q: 'Is ABA carved out to a behavioral health vendor at RightCare?', a: 'No — RightCare administers behavioral health in-house through its own "RightCare Behavioral Health Management" unit, not a third-party vendor like Magellan or Carelon.' },
      { q: 'What happens to my RightCare client\'s ABA authorization after the plan exits?', a: 'The family will be reassigned to a different STAR MCO before the 8/31/2026 exit date — confirm current status with TMHP\'s Contact Center (800-925-9126) or the family\'s new MCO once assigned.' },
    ],
  },

  'dell-childrens-health-plan': {
    slug: 'dell-childrens-health-plan',
    cardDesc: 'Established pediatric plan (STAR since 2012), Travis SDA (8 counties); ABA delegated to Magellan BH.',
    assessmentPA: 'Required — 97151 on the plan\'s Medicaid/CHIP PA list (Yes); route through Magellan Healthcare for BH prior auth',
    treatmentPA: 'Required — 97153, 97154, 97155, 97156, 97158, 99366 all PA=Yes on the 6/1/2026 PA list; 97157 also listed PA=Yes (see note below)',
    dxRequired: 'Yes — ASD diagnostic testing by a developmental pediatrician, neurologist, psychiatrist, licensed psychologist, or autism diagnosis team',
    payer: 'Dell Children\'s Health Plan',
    state: 'TX', kind: 'medicaid-mco', parent: 'Texas Medicaid (THSteps-CCP)',
    pill: 'Payer Guide · Dell Children\'s Health Plan',
    h1: 'Dell Children\'s Health Plan ABA coverage (Texas Medicaid MCO).',
    metaTitle: 'Dell Children\'s Health Plan (TX Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Dell Children\'s Health Plan — the Ascension Seton-affiliated STAR/CHIP plan for the Travis service area — covers ABA: Magellan Healthcare\'s behavioral-health delegation, the plan\'s own PA list, and the GoManda autism-app member benefit.',
    intro: [
      'Dell Children\'s Health Plan is not a new entrant — it has administered CHIP in Central Texas since 2000 and was selected to run STAR and CHIP Perinatal in the Travis service area starting March 1, 2012, and it currently serves 40,000+ members across 8 counties. The plan is affiliated with Dell Children\'s Medical Center and Ascension Seton (its provider manual and staff correspondence run through @seton.org and @ascension.org addresses), giving it a pediatric-hospital-system orientation. For ABA specifically, the plan delegates behavioral-health prior authorization to Magellan Healthcare rather than administering it in-house, and it publishes its own current PA code list confirming ABA as a covered STAR benefit.',
    ],
    atGlance: [
      { label: 'Plan history', value: 'CHIP administrator since 2000; STAR + CHIP Perinatal in Travis SDA since 3/1/2012 — an established plan, not new' },
      { label: 'Service area', value: 'Travis SDA — Bastrop, Burnet, Caldwell, Fayette, Hays, Lee, Travis, Williamson counties' },
      { label: 'Affiliation', value: 'Dell Children\'s Medical Center / Ascension Seton' },
      { label: 'ABA covered?', value: 'Yes — explicitly listed for STAR; CHIP-specific coverage of ABA is not explicitly confirmed (see below)' },
      { label: 'BH administration', value: 'Delegated to Magellan Healthcare — phone 1-800-424-1764' },
      { label: 'Prior auth', value: 'Required — 97151, 97153–97156, 97158, 99366 (and 97157 — see note) all PA-required' },
      { label: 'Value-added benefit', value: 'GoManda learning app (ages 2–8, autism/speech delay), free 1-year subscription with referral' },
    ],
    sections: [
      {
        h2: 'An established pediatric plan, not a startup',
        body: [
          'Dell Children\'s Health Plan\'s own provider manual states it plainly: "Dell Children\'s Health Plan has been an administrator of CHIP since 2000 and was selected to administer the CHIP Perinatal and STAR programs in Central Texas beginning March 1, 2012." It currently publishes actively-maintained documents dated into 2026 (a Prior Authorization list effective 6/1/2026, provider directories dated 3/2026), and independent reporting describes it as serving 40,000+ lives across 8 counties. The plan\'s email domains (@seton.org, @ascension.org) and homepage both tie it to the Seton/Ascension health system that also runs Dell Children\'s Medical Center — though we could not locate a single primary-source document stating the exact legal entity structure (e.g., a specific "Seton Health Plan d/b/a" formulation), so treat the precise corporate relationship as indicative rather than a verbatim-confirmed fact.',
        ],
        cites: [
          { title: 'Dell Children\'s Health Plan — STAR Medicaid and CHIP Provider Manual (Oct 2024)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2024/11/Provider-Manual-102024_web.pdf' },
        ],
      },
      {
        h2: 'ABA coverage and prior authorization',
        body: [
          'The plan\'s STAR Member Handbook and provider manual both explicitly list "Applied Behavior Analysis (ABA) therapy" as a covered STAR behavioral-health service, and the member-facing behavioral-health page states ABA "is now a benefit for STAR members as a covered benefit through Texas Medicaid," requiring prior ASD diagnostic testing "by a developmental pediatrician, a neurologist, a psychiatrist, a licensed psychologist, or an autism diagnosis team." The plan\'s Prior Authorization List (effective 6/1/2026) confirms PA is required (marked "Yes") for 97151, 97153, 97154, 97155, 97156, 97158, and 99366, each cross-referenced to the TMPPM Children\'s Services Handbook. One discrepancy worth flagging rather than silently resolving: the same PA list also shows code 97157 with PA=Yes, even though 97157 is confirmed absent from Texas Medicaid\'s actual THSteps-CCP Autism Services billable code set per TMHP\'s own fee schedule and handbook — treat 97157\'s status with this plan as needing direct confirmation. Separately, the provider manual\'s STAR-covered-services list explicitly names ABA, but the CHIP-specific covered-behavioral-health-services bullet list in the same manual does not repeat ABA by name (it lists inpatient/outpatient mental health and substance-use-disorder services only) — this is genuinely ambiguous in the plan\'s own document, so confirm ABA coverage for standard CHIP (non-STAR, non-Perinatal) members directly with the plan rather than assuming either way.',
        ],
        cites: [
          { title: 'Dell Children\'s Health Plan — STAR Medicaid and CHIP Provider Manual (Oct 2024)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2024/11/Provider-Manual-102024_web.pdf' },
          { title: 'Dell Children\'s Health Plan — Behavioral Health (member page)', url: 'https://dellchildrenshealthplan.com/manage-your-health/behavioral-health/' },
          { title: 'Dell Children\'s Health Plan — STAR/CHIP Prior Authorization List (eff. 6/1/2026)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2026/04/Dell-Childrens-Prior-Authorization-List-Final-Effective-6_1_2026.xlsx-DCHP-PA-List-2.pdf' },
        ],
      },
      {
        h2: 'Behavioral health rides on Magellan',
        body: [
          'Unlike some Texas MCOs that handle BH in-house, Dell Children\'s Health Plan delegates behavioral-health services — including ABA-related prior authorization and referrals — to Magellan Healthcare. The member-facing behavioral-health page tells families to "self-refer directly by calling Magellan toll-free at 1-800-424-1764," and the provider manual lists dedicated Magellan-branded forms (Behavioral Health Prior Auth Form, Initial Review Form, Concurrent Review Form, Discharge Assistance, Provider Search) accessed through the Magellan member/provider portal. The dedicated BH PA fax is (866) 354-8758, distinct from the plan\'s general medical PA fax (844-981-3329). General Provider Services runs at 1-844-781-2343; the plan\'s provider portal for eligibility, PA status, and claims is the HealthX Provider Portal.',
        ],
        cites: [
          { title: 'Dell Children\'s Health Plan — Behavioral Health (member page)', url: 'https://dellchildrenshealthplan.com/manage-your-health/behavioral-health/' },
          { title: 'Dell Children\'s Health Plan — STAR Medicaid and CHIP Provider Manual (Oct 2024)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2024/11/Provider-Manual-102024_web.pdf' },
          { title: 'Dell Children\'s Health Plan — Manuals & Forms', url: 'https://dellchildrenshealthplan.com/for-providers/manuals-forms/' },
        ],
      },
      {
        h2: 'A pediatric-specific extra: the GoManda benefit',
        body: [
          'Dell Children\'s Health Plan lists a value-added benefit directly relevant to autism families: the GoManda learning app, free for one year to CHIP/STAR members ages 2 to 8 with autism or speech delay, available with a referral. It\'s not a substitute for ABA, but it\'s worth mentioning at intake as a no-cost supplement families may not know they have access to. No dedicated autism specialty clinic or autism-specific clinical program beyond the standard ABA benefit and GoManda was found in the plan\'s published materials. No plan-specific ABA fee schedule is published — the PA list\'s references point back to the TMPPM/TMHP baseline already covered in our Texas Medicaid guide.',
        ],
        cites: [
          { title: 'Dell Children\'s Health Plan — Value-Added Services', url: 'https://dellchildrenshealthplan.com/for-members/value-added-services/' },
        ],
      },
    ],
    collect: [
      { title: 'STAR vs. CHIP vs. CHIP Perinatal', desc: 'ABA is explicitly covered for STAR; CHIP-specific ABA coverage isn\'t explicitly confirmed in the plan\'s own materials — verify for CHIP-only members.' },
      { title: 'ASD diagnostic report + diagnosing provider credentials', desc: 'The plan names specific qualifying diagnosers (developmental pediatrician, neurologist, psychiatrist, licensed psychologist, or autism diagnosis team).' },
      { title: 'Route through Magellan for BH', desc: 'Behavioral health — including ABA — is delegated to Magellan Healthcare, not handled by the plan directly; use Magellan\'s forms and portal.' },
      { title: 'County of residence', desc: 'Confirm coverage in the Travis SDA\'s 8 counties (Bastrop, Burnet, Caldwell, Fayette, Hays, Lee, Travis, Williamson).' },
      { title: 'GoManda eligibility', desc: 'Ages 2–8 with autism or speech delay qualify for a free 1-year subscription with referral — flag for families as a no-cost extra.' },
    ],
    sources: [
      { title: 'Dell Children\'s Health Plan — STAR Medicaid and CHIP Provider Manual (Oct 2024)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2024/11/Provider-Manual-102024_web.pdf' },
      { title: 'Dell Children\'s Health Plan — Behavioral Health (member page)', url: 'https://dellchildrenshealthplan.com/manage-your-health/behavioral-health/' },
      { title: 'Dell Children\'s Health Plan — STAR/CHIP Prior Authorization List (eff. 6/1/2026)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2026/04/Dell-Childrens-Prior-Authorization-List-Final-Effective-6_1_2026.xlsx-DCHP-PA-List-2.pdf' },
      { title: 'Dell Children\'s Health Plan — Manuals & Forms', url: 'https://dellchildrenshealthplan.com/for-providers/manuals-forms/' },
      { title: 'Dell Children\'s Health Plan — Value-Added Services', url: 'https://dellchildrenshealthplan.com/for-members/value-added-services/' },
      { title: 'Dell Children\'s Health Plan — STAR Member Handbook (May 2023)', url: 'https://dellchildrenshealthplan.com/wp-content/uploads/2023/05/STAR-Handbook-ENG-052023_web.pdf' },
    ],
    faq: [
      { q: 'Is Dell Children\'s Health Plan a new Texas Medicaid plan?', a: 'No — despite sometimes being described as newly launched, the plan\'s own provider manual confirms it has administered CHIP since 2000 and STAR/CHIP Perinatal in the Travis service area since March 1, 2012.' },
      { q: 'Does Dell Children\'s Health Plan cover ABA therapy?', a: 'Yes for STAR members — explicitly listed as a covered behavioral-health benefit, with prior authorization required on assessment and treatment codes. CHIP-specific (non-STAR) coverage of ABA is not explicitly confirmed in the plan\'s own materials — verify directly for CHIP-only members.' },
      { q: 'Who handles ABA prior authorization at Dell Children\'s Health Plan?', a: 'Magellan Healthcare, under delegation — call 1-800-424-1764 or use the Magellan provider portal, not the plan\'s general medical PA line.' },
      { q: 'What areas does Dell Children\'s Health Plan cover?', a: 'The Travis service delivery area: Bastrop, Burnet, Caldwell, Fayette, Hays, Lee, Travis, and Williamson counties.' },
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
