import type { PayerConfig } from './types.js';

export const arizonaPayers: Record<string, PayerConfig> = {
  'arizona-ahcccs': {
    slug: 'arizona-ahcccs',
    cardDesc: 'Dual path: six ACC plans or DDD Health Plans; no autism dx required; tiered rates.',
    assessmentPA: 'Delegated to plans — the two largest (Mercy Care, UHC/Optum) require NO PA for 97151/97152; verify per plan',
    treatmentPA: 'Plan-level — Mercy Care: 97153–97158 with 6-month auths; UHC/Optum: all codes except 97151/97152',
    dxRequired: 'No — AMPM 320-S covers ASD "and/or other diagnoses as justified by medical necessity"',
    payer: 'AHCCCS (Arizona Medicaid)',
    state: 'AZ', kind: 'state-medicaid',
    pill: 'Payer Guide · AHCCCS',
    h1: 'AHCCCS (Arizona Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'AHCCCS (Arizona Medicaid) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How AHCCCS covers ABA under AMPM 320-S — the ACC-plan vs. DDD dual path, no autism-diagnosis requirement, plan-delegated prior authorization, credential-tiered physician-fee-schedule rates, A.R.S. § 32-2091 licensure, and the 2026 reform to watch.',
    intro: [
      'AHCCCS — the Arizona Health Care Cost Containment System — covers Behavior Analysis Services under Medical Policy Manual chapter AMPM 320-S, and it is one of the friendliest coverage baselines in our directory: no autism diagnosis is strictly required, and the state policy itself imposes no prior-authorization rules. But Arizona is a two-front-door state, and routing the family correctly is the first intake job: most members get ABA through one of six AHCCCS Complete Care (ACC) managed care plans, while ALTCS-eligible members with developmental disabilities get it through DES/DDD, which runs two statewide DDD Health Plans — Mercy Care DD and UnitedHealthcare Community Plan DD. Ask "ACC plan or DDD?" before anything else, because the payer, portal, and authorization pathway all hang on the answer.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — AMPM 320-S, for ASD and/or other diagnoses as justified by medical necessity' },
      { label: 'Structure', value: 'Dual path: six ACC plans, or DDD Health Plans (Mercy Care DD / UHCCP DD) for ALTCS-DD members' },
      { label: 'Diagnosis', value: 'No autism dx required — BHP recommendation based on assessment' },
      { label: 'Prior auth', value: 'Delegated to plans — Mercy Care and UHC/Optum skip PA on 97151/97152' },
      { label: 'Rates (per 15 min)', value: '97153: $17.91 HM · $21.32 HN · $23.69 HO/HP; 97155: $25.05–$37.28 (home ~10% more)' },
      { label: 'Licensure', value: 'Arizona-licensed behavior analyst (A.R.S. § 32-2091, Board of Psychologist Examiners)' },
      { label: 'Watch', value: 'AMPM 320-S rewrite in flight (2026) + March 2026 in-network provider terminations' },
      { label: 'Staff screening', value: 'AHCCCS FCBC hits owners/execs only — front-line staff get DPS cards via ADHS licensure (apply within 7 working days) and DDD Level One cards' },
    ],
    sections: [
      {
        h2: 'Two front doors: ACC plans vs. DDD',
        body: [
          'AMPM 320-S applies across every AHCCCS delivery system — ACC, ALTCS, DES/DDD, DCS/CMDP, the RBHA contracts, and fee-for-service tribal programs — but the operational path splits in two. Most children get ABA through their ACC plan: Arizona Complete Health-Complete Care Plan, Banner-University Family Care, Blue Cross Blue Shield of Arizona Health Choice, Mercy Care, Molina Healthcare, or UnitedHealthcare Community Plan (Care1st no longer exists — it merged into Arizona Complete Health, with northern-county members transferred in 2024). Children who are ALTCS-eligible through the Division of Developmental Disabilities — autism is a DDD qualifying-condition category — instead get physical and behavioral health including ABA through one of two statewide DDD Health Plans, Mercy Care DD or UHCCP DD. Over age 3, ALTCS approval is the gate to DDD-funded services. The intake question that routes everything: which card does the family hold, an ACC plan card or a DDD Health Plan card?',
        ],
        cites: [
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
          { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
          { title: 'DES — DDD Health Plans information', url: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info' },
        ],
      },
      {
        h2: 'No autism diagnosis required — and PA lives at the plans',
        body: [
          'AMPM 320-S states that Behavior Analysis Services are a covered benefit "for individuals with Autism Spectrum Disorder (ASD) and/or other diagnoses as justified by medical necessity" — Arizona is one of the states that does not strictly require an autism diagnosis for ABA. Services must be prescribed or recommended by a qualified Behavioral Health Professional based on assessment (the policy lists example instruments like the PDDBI, Brigance, and Vineland), and progress reports are required at minimum every 6 months with specified components. The state policy sets no prior-authorization rules of its own — PA is delegated to the contractors, and the two largest verified examples both skip PA on assessment: Mercy Care ("You don\'t need PA for adaptive behavior assessments: CPT codes 97151 and 97152") and UHC/Optum ("All ABA services require prior authorization except 97151 and 97152"). Treatment codes do require PA at those plans, on their own forms and cadences — see the per-plan guides. For the three plans with no published ABA policy (Banner, Health Choice, Molina), verify the current PA rules in the portal before quoting a start date.',
        ],
        cites: [
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
          { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
          { title: 'Mercy Care — Applied Behavior Analysis provider page', url: 'https://www.mercycareaz.org/providers/applied-behavior-analysis.html' },
        ],
      },
      {
        h2: 'Rates: credential-tiered, and on the physician fee schedule',
        body: [
          'AHCCCS converted the ABA codes from by-report to fixed rates effective November 1, 2023, tiered by rendering credential via modifiers: HM = below bachelor\'s (BT/RBT level), HN = bachelor\'s (BCaBA), HO = master\'s (BCBA), HP = doctoral (BCBA-D). Per 15-minute unit: 97151 assessment pays $30.06 / $35.78 / $44.73 at the HN/HO/HP tiers; 97153 direct treatment pays $17.91 / $21.32 / $23.69 (HM/HN/HO-HP); 97155 protocol modification pays $25.05 / $29.82 / $37.28. Home delivery (POS 12) pays roughly a 10% premium on every code — 97153 at home runs $19.96–$26.43. Two traps: the 2023 rate notice did not set a rate for 97156 (family training) — check the AHCCCS physician fee schedule code lookup directly — and the 9715x codes are not on the Behavioral Health Outpatient fee schedule at all; they live on the physician fee schedule. Practices that look up "behavioral health rates" find nothing and assume ABA is unpriced — it isn\'t.',
        ],
        cites: [
          { title: 'AHCCCS — Final Public Notice, FFS rate changes 11/1/2023 (ABA codes)', url: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf' },
          { title: 'AHCCCS — FY26 Behavioral Health Outpatient MCO fee schedule (9715x absent)', url: 'https://www.azahcccs.gov/PlansProviders/Downloads/FFSrates/Behavioral/FY26BHOP_MCO_10012025.xlsx' },
          { title: 'acuity.news — Arizona Medicaid ABA rates & AHCCCS reform 2026', url: 'https://acuity.news/regulation/arizona-medicaid-aba-reimbursement-ahcccs-reform-2026/' },
        ],
      },
      {
        h2: 'Watch: the 2026 reform and the March network disruption',
        body: [
          'Arizona ABA is mid-upheaval, and intake teams should track two live threads. First, AHCCCS is running a spending-driven ABA reform: proposed AMPM 320-S revisions previewed at April 15–16, 2026 webinars would make state licensure plus fingerprint clearance conditions of AHCCCS provider registration and change the PA process — the substantive text had not yet posted for formal public comment as of mid-2026, so today\'s rules still govern, but expect movement. Second, in March 2026 Mercy Care, Arizona Complete Health, and UnitedHealthcare each terminated network contracts with Action Behavior Centers and/or Centria — roughly 1,000 children lost in-network ABA at once, and 11 families sued AHCCCS to halt the terminations. For providers still in network, displaced families are actively seeking new placements: staff intake for that volume, and verify network status on every inbound rather than assuming last year\'s directory.',
        ],
        cites: [
          { title: 'AHCCCS — informational webinars on proposed ABA policy updates (4/3/2026)', url: 'https://www.azahcccs.gov/shared/News/GeneralNews/ABA_PolicyUpdates.html' },
          { title: 'azfamily — Nearly 1K Arizona children with autism to lose ABA therapy coverage (3/5/2026)', url: 'https://www.azfamily.com/2026/03/05/nearly-1k-arizona-children-with-autism-lose-aba-therapy-coverage/' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'AMPM 320-S never says "RBT." A Behavior Technician is "a paraprofessional credentialed by a nationally recognized Behavior Analyst certification board or as specified in A.A.C. R9-10-101(39)" — meaning either a nationally certified tech (the RBT pathway) or an unlicensed Behavioral Health Technician working at a licensed health care institution under Behavioral Health Professional oversight. There is no state RBT registry; the Arizona-licensed Behavior Analyst (A.R.S. § 32-2091, Board of Psychologist Examiners) is responsible for all clinical direction and supervision, for training technicians, and for their compliance with the policy — and because 320-S sets no numeric supervision percentage of its own, the BACB\'s floor is the binding number for RBT-credentialed staff: 5% of monthly service hours, including two face-to-face contacts. ADHS outpatient-treatment-center rules (R9-10-1011) add that personnel providing behavioral health services must be at least 18, and if you staff the RBT pathway, the BACB baseline travels with it: a criminal background check plus an abuse-registry check, both completed within 180 days before the certification application, and — from January 1, 2026 — the new 40-hour curriculum (delivered over 5–180 days by trained BCBAs/BCaBAs), an updated competency assessment, and a 2-year recertification cycle.',
          'Now the part Arizona owners most often get backwards: fingerprint clearance cards. AHCCCS enrollment screening itself barely touches your staff — per PEP-902, the fingerprint-based criminal background check (run exclusively through Arizona DPS; FBI checks and out-of-state cards are not accepted) applies to "high-risk" provider types like 77 Behavioral Health Outpatient Clinic and IC Integrated Clinic, and only to individual high-risk providers, 5%+ direct or indirect owners, and the Directors/Executive Directors/CEOs/Presidents on the Corporation Commission listing; employees below that line are expressly exempt. But front-line staff need DPS cards anyway — the trigger is just elsewhere. Under A.R.S. § 36-425.03, all personnel, volunteers included, of a children\'s behavioral health program (behavioral health services to patients under 18 at an ADHS-licensed facility) must hold a valid fingerprint clearance card or apply within 7 working days of starting, and must certify on notarized forms that they are not awaiting trial on or convicted of the offenses listed in A.R.S. § 41-1758.03. Licensed behavior analysts carry their own card requirement as a condition of licensure (A.R.S. § 32-2091.02, effective January 1, 2022) — and the proposed 2026 AMPM rewrite would push licensure-plus-fingerprint into AHCCCS registration itself.',
          'The DDD side of the dual path layers on the heaviest screening. Qualified Vendors must hold Level One fingerprint clearance cards (A.R.S. § 41-1758.07) for all employee types except immediate relatives, add staff to the roster within 30 days of hire, and the OLCR tracking system re-validates every card against DPS every 24 hours — an expired card surfaces the next day, not at revalidation. DDD also screens staff against the APS Registry automatically every 24 hours, requires DCS Central Registry (child abuse/neglect) checks under A.R.S. § 8-804 for anyone providing direct service to children — with a Direct Service Position Form (DDD-1727A) completed before service pending results — and mandates monthly LEIE and SAM exclusion searches for all employees, contractors, and subcontractor staff, with results retained 5 years. New direct-care workers get 90 days to complete CPR, First Aid, and Article 9 training and cannot work alone with members until they do. Two gaps to confirm directly: AMPM 320-S is silent on TB tests or health screening for ABA staff (any such duty flows from the R9-10 article your ADHS license class sits under), and the ACC plans publish no staff screening beyond the state baseline — Mercy Care defers clinical standards to AHCCCS policy — so confirm plan-specific credentialing paperwork at contracting.',
        ],
        cites: [
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
          { title: 'BACB — RBT 2026 requirements transition guidance', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
          { title: 'Ariz. Admin. Code R9-10-1011 — Outpatient Treatment Centers, Behavioral Health Services', url: 'https://www.law.cornell.edu/regulations/arizona/Ariz-Admin-Code-SS-R9-10-1011' },
          { title: 'AHCCCS PEP-902 — Fingerprint-Based Criminal Background Check requirement', url: 'https://www.azahcccs.gov/PlansProviders/Downloads/apep/FCBC_OnePager.pdf' },
          { title: 'A.R.S. § 36-425.03 — Children\'s behavioral health programs; fingerprinting', url: 'https://www.azleg.gov/ars/36/00425-03.htm' },
          { title: 'A.R.S. § 32-2091.02 — Behavior analysts; licensure qualifications', url: 'https://www.azleg.gov/ars/32/02091-02.htm' },
          { title: 'DES/DDD — Staff Roster and Background Check Guide', url: 'https://des.az.gov/sites/default/files/media/Roster_and_BG_Check_Guide_110822.pdf' },
          { title: 'DES/DDD — Central Registry, LEIE and SAM background check requirements (8/7/2015)', url: 'https://des.az.gov/sites/default/files/central_registry_leie_sam_requirements.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'ACC plan vs. DDD enrollment', desc: 'The routing question — an ACC card and a DDD Health Plan card mean different payers, portals, and auth pathways.' },
      { title: 'Diagnosis (any qualifying)', desc: 'ASD or another diagnosis justified by medical necessity — Arizona doesn\'t gate ABA on an autism dx.' },
      { title: 'BHP recommendation + assessment', desc: 'A qualified Behavioral Health Professional must prescribe/recommend ABA based on assessment.' },
      { title: 'Rendering credential tier', desc: 'HM/HN/HO/HP modifiers set the rate — who delivers each code is a revenue decision.' },
      { title: 'Prior ABA provider', desc: 'Post-March-2026, many inbounds are displaced Action Behavior Centers / Centria families — capture the history and any active auths.' },
    ],
    sources: [
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
      { title: 'AHCCCS — Final Public Notice, FFS rate changes 11/1/2023 (ABA codes)', url: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf' },
      { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
      { title: 'AHCCCS — informational webinars on proposed ABA policy updates (4/3/2026)', url: 'https://www.azahcccs.gov/shared/News/GeneralNews/ABA_PolicyUpdates.html' },
      { title: 'DES — DDD Health Plans information', url: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info' },
      { title: 'azfamily — Nearly 1K Arizona children lose in-network ABA (3/5/2026)', url: 'https://www.azfamily.com/2026/03/05/nearly-1k-arizona-children-with-autism-lose-aba-therapy-coverage/' },
      { title: 'AHCCCS PEP-902 — Fingerprint-Based Criminal Background Check requirement', url: 'https://www.azahcccs.gov/PlansProviders/Downloads/apep/FCBC_OnePager.pdf' },
      { title: 'A.R.S. § 36-425.03 — Children\'s behavioral health programs; fingerprinting', url: 'https://www.azleg.gov/ars/36/00425-03.htm' },
      { title: 'A.R.S. § 32-2091.02 — Behavior analysts; licensure qualifications', url: 'https://www.azleg.gov/ars/32/02091-02.htm' },
      { title: 'Ariz. Admin. Code R9-10-1011 — Outpatient Treatment Centers, Behavioral Health Services', url: 'https://www.law.cornell.edu/regulations/arizona/Ariz-Admin-Code-SS-R9-10-1011' },
      { title: 'DES/DDD — Staff Roster and Background Check Guide', url: 'https://des.az.gov/sites/default/files/media/Roster_and_BG_Check_Guide_110822.pdf' },
      { title: 'DES/DDD — Central Registry, LEIE and SAM background check requirements (8/7/2015)', url: 'https://des.az.gov/sites/default/files/central_registry_leie_sam_requirements.pdf' },
      { title: 'BACB — RBT 2026 requirements transition guidance', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
    ],
    faq: [
      { q: 'Does AHCCCS cover ABA therapy?', a: 'Yes — under AMPM 320-S, for members with autism spectrum disorder and/or other diagnoses as justified by medical necessity. Coverage runs through the member\'s ACC plan, or through a DDD Health Plan (Mercy Care DD or UHCCP DD) for ALTCS-DD members.' },
      { q: 'Does Arizona Medicaid require an autism diagnosis for ABA?', a: 'No — AMPM 320-S explicitly covers "other diagnoses as justified by medical necessity," and Optum\'s Arizona orientation states verbatim that an ASD diagnosis is not required for AHCCCS members. A qualified Behavioral Health Professional must still recommend the service based on assessment.' },
      { q: 'What does AHCCCS pay for ABA?', a: 'Fixed, credential-tiered rates since 11/1/2023: 97153 pays $17.91 (HM) / $21.32 (HN) / $23.69 (HO/HP) per 15-minute unit, with home delivery about 10% higher. The codes live on the physician fee schedule, not the behavioral-health outpatient one, and 97156 wasn\'t in the 2023 rate notice — look it up directly.' },
      { q: 'Which plans run AHCCCS ABA?', a: 'Six ACC plans — Arizona Complete Health, Banner-University Family Care, Blue Cross Blue Shield of Arizona Health Choice, Mercy Care, Molina, and UnitedHealthcare Community Plan — plus the two statewide DDD Health Plans (Mercy Care DD and UHCCP DD) for ALTCS-DD members. Prior-auth mechanics are plan-specific.' },
    ],
  },

  'mercy-care-arizona': {
    slug: 'mercy-care-arizona',
    family: 'aetna',
    cardDesc: 'No PA on 97151/97152; 6-month auths on its own ABA form; serves ACC + DDD + DCS books.',
    assessmentPA: 'Not required for 97151 and 97152 — explicit on the plan\'s ABA page',
    treatmentPA: 'Required for 97153–97158 — dedicated ABA PA form with clinical documentation; 6-month authorization periods',
    dxRequired: 'No — clinical criteria defer to AMPM 320-S: ASD and/or other diagnoses as justified by medical necessity',
    payer: 'Mercy Care (AZ)',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · Mercy Care',
    h1: 'Mercy Care ABA coverage (AHCCCS plan).',
    metaTitle: 'Mercy Care (Arizona AHCCCS) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Mercy Care administers Arizona AHCCCS ABA — no PA on assessment codes, 6-month treatment authorizations on the plan\'s ABA PA form, Aetna Medicaid administration, the ACC + DDD + DCS triple footprint, and the TPL/COB quirks.',
    intro: [
      'Mercy Care — administered by Aetna Medicaid Administrators LLC — is the widest single payer relationship in Arizona Medicaid ABA: it holds an ACC contract, the ACC-RBHA Central GSA contract, one of the two statewide DDD Health Plans (Mercy Care DD), and the DCS Comprehensive Health Plan for children in foster care. Clinically it runs no separate medical-necessity policy — its ABA page links AMPM 320-S as the criteria — but operationally it is distinct: an explicit no-PA rule on assessment codes, 6-month authorization blocks on its own ABA PA form, and third-party-liability quirks worth knowing before the first claim.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'ACC + ACC-RBHA Central + DDD Health Plan + DCS CHP (Aetna Medicaid administration)' },
      { label: 'Clinical rules', value: 'AMPM 320-S — the plan links the state policy as its criteria' },
      { label: 'Assessment PA', value: 'None — 97151 and 97152 explicitly need no PA' },
      { label: 'Treatment PA', value: 'Required for 97153–97158; 0362T/0373T are required billing codes' },
      { label: 'Auth periods', value: '6 months — matching AMPM 320-S\'s 6-month progress-report cadence' },
      { label: 'Portal', value: 'Availity, with a dedicated ABA PA form (initial + reauth)' },
    ],
    sections: [
      {
        h2: 'How Mercy Care runs ABA authorization',
        body: [
          'Assessments start without authorization — the plan\'s ABA page says directly that you don\'t need PA for adaptive behavior assessment codes 97151 and 97152 — so eligibility verification can flow straight into a booked assessment. Treatment codes 97153–97158 require PA, and payment may be denied for services delivered without it. Requests go on Mercy Care\'s dedicated ABA PA form (initial and reauthorization versions) with the required clinical documentation, through the Availity portal, and authorizations run 6 months at a time — deliberately aligned with AMPM 320-S\'s minimum 6-month progress-report requirement, so build the reauth packet from the progress report you already owe the state. The child and family team (CFT) — or adult recovery team — determines medically necessary services, so expect care-team coordination rather than a pure paper review.',
        ],
        cites: [
          { title: 'Mercy Care — Applied Behavior Analysis provider page', url: 'https://www.mercycareaz.org/providers/applied-behavior-analysis.html' },
          { title: 'Mercy Care — ABA PA request form', url: 'https://www.mercycareaz.org/content/dam/mercycare/pdf/PAabarequest_ua.pdf' },
        ],
      },
      {
        h2: 'Three funnels, one payer — and the COB quirks',
        body: [
          'A Mercy Care contract touches three distinct member populations: ACC members, DDD/ALTCS members via Mercy Care DD, and foster-care children via the DCS Comprehensive Health Plan — one credentialing relationship, three intake funnels. Two billing quirks matter at intake. First, coordination of benefits: the 9715x CPT codes require billing primary insurance first when the member has other coverage (unless the service is non-covered or benefits are exhausted — noted on the PA form), while H/S/T-prefixed codes bypass COB internally. Second, the child-friendly exception: per AHCCCS instruction, approved children\'s services (18 and younger) are reimbursed at a primary level with post-adjudication reclamation — claims aren\'t denied for a missing primary EOB. And note the March 2026 network purge: Mercy Care terminated its Action Behavior Centers and Centria contracts, so displaced families are actively looking for in-network providers.',
        ],
        cites: [
          { title: 'Mercy Care — Applied Behavior Analysis provider page', url: 'https://www.mercycareaz.org/providers/applied-behavior-analysis.html' },
          { title: 'azfamily — Nearly 1K Arizona children lose in-network ABA (3/5/2026)', url: 'https://www.azfamily.com/2026/03/05/nearly-1k-arizona-children-with-autism-lose-aba-therapy-coverage/' },
        ],
      },
    ],
    collect: [
      { title: 'Which Mercy Care book', desc: 'ACC, Mercy Care DD (DDD/ALTCS), or DCS CHP (foster care) — same payer, different funnel and care team.' },
      { title: 'Diagnosis (any qualifying)', desc: 'AMPM 320-S criteria — no autism dx strictly required; then book the assessment, no PA needed.' },
      { title: 'Other insurance', desc: '9715x codes bill primary first when other coverage exists — capture COB status up front (children 18 and under are paid primary per AHCCCS instruction).' },
      { title: 'Prior provider + active auths', desc: 'Ex-Action Behavior Centers / Centria families may arrive mid-authorization — get the history.' },
    ],
    sources: [
      { title: 'Mercy Care — Applied Behavior Analysis provider page', url: 'https://www.mercycareaz.org/providers/applied-behavior-analysis.html' },
      { title: 'Mercy Care — ABA PA request form', url: 'https://www.mercycareaz.org/content/dam/mercycare/pdf/PAabarequest_ua.pdf' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
    ],
    faq: [
      { q: 'Does Mercy Care cover ABA therapy?', a: 'Yes — on AMPM 320-S criteria (the plan links the state policy directly). Assessment codes 97151/97152 need no PA; treatment codes 97153–97158 require PA on the plan\'s ABA form, in 6-month authorization periods.' },
      { q: 'Is Mercy Care the same as Aetna?', a: 'Mercy Care is administered by Aetna Medicaid Administrators LLC, so the machinery is Aetna\'s — but it\'s a Medicaid plan on AHCCCS rules, not Aetna\'s commercial CPB 0554 policy. A family saying "we have Aetna" in Phoenix may well be a Mercy Care member.' },
      { q: 'How long do Mercy Care ABA authorizations last?', a: 'Six months, matching the state\'s 6-month progress-report cadence — build reauthorization requests from the AMPM 320-S progress report.' },
    ],
  },

  'unitedhealthcare-community-plan-arizona': {
    slug: 'unitedhealthcare-community-plan-arizona',
    family: 'unitedhealthcare',
    cardDesc: 'Optum-run; PA on everything except 97151/97152; explicit "no ASD dx required" rule.',
    assessmentPA: 'Not required — "All ABA services require prior authorization except 97151 and 97152" (Optum AZ orientation)',
    treatmentPA: 'Required for all treatment codes — Provider Express online ABA Treatment Form or fax 1-888-541-6691',
    dxRequired: 'No — "ASD diagnosis is not required for ABA services for Arizona Medicaid members" (Optum AZ orientation, verbatim)',
    payer: 'UnitedHealthcare Community Plan of Arizona',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · UHC Community Plan (AZ)',
    h1: 'UnitedHealthcare Community Plan of Arizona ABA coverage (AHCCCS plan).',
    metaTitle: 'UHC Community Plan Arizona (AHCCCS) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers Arizona AHCCCS ABA through Optum — no PA on 97151/97152, the AZ Treatment Request Form documentation regime, the ACC + DDD dual membership, and AHCCCS registration mechanics.',
    intro: [
      'UnitedHealthcare Community Plan of Arizona runs its ABA benefit through Optum, with a dedicated AZ AHCCCS ABA Program on Provider Express — an Arizona-specific orientation, treatment request form, and quick reference guide, staffed by a dedicated Arizona autism clinical team. Like Mercy Care, it covers both Arizona funnels: it is an ACC plan and one of the two statewide DDD Health Plans ("DD by UHCCP"), plus an ALTCS contractor. The clinical posture matches the state baseline — no PA on assessment, no autism diagnosis required — but the paperwork is Optum-national in flavor, with Arizona-specific forms and a demanding treatment-request documentation list.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'ACC plan + statewide DDD Health Plan ("DD by UHCCP") + ALTCS; BH run by Optum' },
      { label: 'Assessment PA', value: 'None — all ABA codes require PA except 97151 and 97152' },
      { label: 'Treatment PA', value: 'Required — Provider Express ABA Treatment Form or fax 1-888-541-6691' },
      { label: 'Diagnosis', value: 'ASD diagnosis explicitly NOT required for Arizona Medicaid members' },
      { label: 'Portals', value: 'providerexpress.com (auth) + UHCprovider.com (claims); payer ID 03432' },
      { label: 'Claims deadline', value: '90 days from date of service' },
    ],
    sections: [
      {
        h2: 'The Optum layer: forms, documentation, concurrent review',
        body: [
          'Assessments (97151/97152) start without authorization; every other ABA code requires PA, submitted through the online ABA Treatment Form on Provider Express or by fax to 1-888-541-6691. The treatment request is where Optum\'s rigor lives — it must include baseline and mastery criteria, a transition plan, discharge criteria, a behavior-reduction/crisis plan, parent goals, and supervision hours, and goals must not be educational or academic in nature. Concurrent reviews weigh progress and medical necessity under Optum\'s Autism/ABA clinical policy, run by a dedicated Arizona autism team of licensed clinicians and BCBAs. The plan\'s fee schedule mirrors the AHCCCS structure — 9715x plus 0362T/0373T in 15-minute units with credential modifiers — though dollar amounts aren\'t published in the orientation. Note the operational split: authorizations live on Provider Express, claims on UHCprovider.com (payer ID 03432), with a 90-day filing deadline.',
        ],
        cites: [
          { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
        ],
      },
      {
        h2: 'Both funnels, and the registration mechanics',
        body: [
          'The orientation is explicit that UHC Community Plan is "the selected managed care administrator for Arizona AHCCCS Complete Care and AZ DD membership" — DD member cards say "DDD Health Plan by UHCCP" and carry Group AZDDD, versus AZHCCCS for ACC members. Same forms and rules, but confirm which book the member is in, since the DDD path comes with a different eligibility gate and bundled HCBS services. Registration mechanics that block claims if missed: the agency must be enrolled as AHCCCS provider type 77, BCBAs must be individually AHCCCS-registered, and the rendering provider\'s NPI (the BCBA or licensed clinician) goes in box 24J. And the diagnosis rule worth quoting in any dx-gate dispute: "ASD diagnosis is not required for ABA services for Arizona Medicaid members." Like the other big plans, UHC terminated Action Behavior Centers in the March 2026 network purge — expect displaced families.',
        ],
        cites: [
          { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
          { title: 'azfamily — Nearly 1K Arizona children lose in-network ABA (3/5/2026)', url: 'https://www.azfamily.com/2026/03/05/nearly-1k-arizona-children-with-autism-lose-aba-therapy-coverage/' },
        ],
      },
    ],
    collect: [
      { title: 'ACC vs. DD membership', desc: 'Check the card — Group AZDDD ("DDD Health Plan by UHCCP") vs. AZHCCCS routes the eligibility conversation.' },
      { title: 'Diagnosis (any qualifying)', desc: 'No ASD dx required — capture whatever diagnosis and assessment supports medical necessity.' },
      { title: 'Treatment-request inputs', desc: 'Baseline/mastery criteria, transition + discharge plans, crisis plan, parent goals, supervision hours — collect early; goals can\'t be academic.' },
      { title: 'AHCCCS registration status', desc: 'Agency as provider type 77, BCBA individually registered, rendering NPI for box 24J — verify before the first claim.' },
    ],
    sources: [
      { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
      { title: 'UHC Community Plan — Arizona DDD program page', url: 'https://www.uhc.com/communityplan/arizona/plans/medicaid/developmental-disabilities' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Arizona cover ABA?', a: 'Yes — through Optum\'s AZ AHCCCS ABA Program. Assessment codes 97151/97152 need no PA; all other ABA codes require authorization via Provider Express or fax, with a detailed treatment-request documentation list.' },
      { q: 'Does UHC require an autism diagnosis for AHCCCS ABA?', a: 'No — Optum\'s Arizona orientation states verbatim that an ASD diagnosis is not required for ABA services for Arizona Medicaid members. Medical necessity, supported by assessment, governs.' },
      { q: 'How do I submit an ABA authorization to UHC in Arizona?', a: 'The online ABA Treatment Form on providerexpress.com, or fax 1-888-541-6691. Claims go separately through UHCprovider.com (payer ID 03432) within 90 days of the date of service.' },
    ],
  },

  'arizona-complete-health': {
    slug: 'arizona-complete-health',
    family: 'centene',
    cardDesc: 'Centene\'s CP.BH.104 overlay: dx confirmation, 5-year eval recency, hour bands; every county.',
    treatmentPA: 'Required per CP.BH.104 — BCBA behavioral assessment + FBA or skills assessment + individualized plan; updated assessment and plan every 6 months',
    dxRequired: 'CP.BH.104 asks for a confirmed ASD dx — but defers to "state-defined ABA criteria," which in Arizona means non-ASD diagnoses qualify under AMPM 320-S; cite it',
    payer: 'Arizona Complete Health - Complete Care Plan',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · Arizona Complete Health',
    h1: 'Arizona Complete Health ABA coverage (AHCCCS plan).',
    metaTitle: 'Arizona Complete Health (AHCCCS) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Arizona Complete Health (Centene) administers AHCCCS ABA — corporate clinical policy CP.BH.104, the confirmed-diagnosis and 5-year eval-recency rules, hour-band guidance, the Care1st merger, and the statewide footprint.',
    intro: [
      'Arizona Complete Health - Complete Care Plan — Centene\'s Arizona vehicle — is the only ACC plan in every county, holds both the North and South GSA ACC-RBHA contracts, and absorbed Care1st\'s members in 2024. Unlike the plans that simply link AMPM 320-S, AzCH runs a genuinely distinct corporate clinical policy: CP.BH.104 "Applied Behavior Analysis" (last revised 12/24), which layers a confirmed-diagnosis expectation, a five-year evaluation-recency rule, and hour-band guidance on top of the state baseline. Knowing where the corporate policy yields to Arizona\'s rules is the intake skill for this plan.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'ACC in all counties + ACC-RBHA North & South GSAs (Centene)' },
      { label: 'Clinical rules', value: 'Centene CP.BH.104 (rev. 12/24) — a real overlay, deferring to state criteria where Arizona differs' },
      { label: 'Diagnosis recency', value: 'Comprehensive diagnostic evaluation within the past 5 years (CP.BH.104 — not a state rule)' },
      { label: 'Hour guidance', value: 'Focused ABA 10–25 hrs/wk; comprehensive 30–40; supervision 1–2 hrs per 10 direct' },
      { label: 'Reauth cadence', value: 'Updated behavior assessment + treatment plan every 6 months' },
      { label: 'UM', value: 'Centene Advanced Behavioral Health (in-house); azcompletehealth.com portal' },
    ],
    sections: [
      {
        h2: 'CP.BH.104: what the corporate policy requires',
        body: [
          'Initiation under CP.BH.104 requires medical stability, a behavioral assessment completed by a BCBA (or state-law equivalent) using record review, interviews, rating scales, and direct observation, plus an FBA — descriptive, traditional, or IISCA — or a skills assessment from a named list (VB-MAPP, ABLLS-R, AFLS, PEAK, SSIS, EFL, Socially Savvy), feeding an individualized treatment plan. Continuation requires an updated behavior assessment and updated treatment plan every 6 months (or more often if state-mandated), with progress data across settings. Intensity guidance comes as bands rather than hard caps: focused ABA at 10–25 hours/week, comprehensive ABA at 30–40 hours/week of direct treatment, and supervision at 1–2 hours per 10 direct hours (2 hours required below 10 hours/week). Whether AzCH operationally requires PA on the 97151 assessment for AHCCCS members isn\'t published as a single rule — the plan\'s prior-auth page works code-by-code, so run the lookup before promising an auth-free assessment.',
        ],
        cites: [
          { title: 'Centene/AzCH — Clinical Policy CP.BH.104, Applied Behavior Analysis (rev. 12/24)', url: 'https://www.azcompletehealth.com/content/dam/centene/policies/behavioral-policies/CP.BH.104.pdf' },
          { title: 'AzCH — prior authorization page', url: 'https://www.azcompletehealth.com/providers/resources/prior-authorization.html' },
        ],
      },
      {
        h2: 'Where the policy yields to Arizona — and the plan\'s footprint',
        body: [
          'CP.BH.104 asks for a confirmed ASD diagnosis (current DSM, confirmed via tools like the ADOS-2, ADI-R, or CARS-2) "or an appropriate diagnosis as otherwise specified according to state-defined ABA criteria" — and that escape clause is what reconciles the corporate policy with Arizona\'s no-ASD-required Medicaid rule. When the diagnosis is non-ASD, cite AMPM 320-S explicitly in the request rather than arguing the corporate criteria. Two more facts to hold: CP.BH.104\'s five-year evaluation-recency rule is a dx-recency gate the state policy does not impose, so check the evaluation date at intake; and the footprint is the state\'s largest — every county as an ACC plan, both ACC-RBHA GSAs, and the former Care1st membership (Apache, Coconino, Mohave, Navajo, Yavapai) transitioned in 2024. AzCH also terminated Action Behavior Centers in the March 2026 network purge, so displaced-family inbounds will carry this plan\'s card statewide.',
        ],
        cites: [
          { title: 'Centene/AzCH — Clinical Policy CP.BH.104, Applied Behavior Analysis (rev. 12/24)', url: 'https://www.azcompletehealth.com/content/dam/centene/policies/behavioral-policies/CP.BH.104.pdf' },
          { title: 'azfamily — Nearly 1K Arizona children lose in-network ABA (3/5/2026)', url: 'https://www.azfamily.com/2026/03/05/nearly-1k-arizona-children-with-autism-lose-aba-therapy-coverage/' },
        ],
      },
    ],
    collect: [
      { title: 'Evaluation date', desc: 'CP.BH.104 wants the comprehensive diagnostic evaluation within 5 years — flag stale evals for re-evaluation early.' },
      { title: 'Diagnosis + confirming tools', desc: 'ASD confirmed via ADOS-2/ADI-R/CARS-2-style tools — or a non-ASD dx framed under AMPM 320-S\'s state criteria.' },
      { title: 'Assessment inputs', desc: 'BCBA assessment with FBA or a named skills assessment (VB-MAPP, ABLLS-R, etc.) — the initiation package is prescriptive.' },
      { title: 'Requested intensity vs. bands', desc: 'Fit requests to the 10–25 (focused) / 30–40 (comprehensive) hour bands, with supervision ratios in the plan.' },
    ],
    sources: [
      { title: 'Centene/AzCH — Clinical Policy CP.BH.104, Applied Behavior Analysis (rev. 12/24)', url: 'https://www.azcompletehealth.com/content/dam/centene/policies/behavioral-policies/CP.BH.104.pdf' },
      { title: 'AzCH — prior authorization page', url: 'https://www.azcompletehealth.com/providers/resources/prior-authorization.html' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
    ],
    faq: [
      { q: 'Does Arizona Complete Health cover ABA?', a: 'Yes — under Centene\'s clinical policy CP.BH.104 layered on the AHCCCS baseline: a BCBA behavioral assessment, an FBA or skills assessment, and an individualized treatment plan at initiation, with updates every 6 months.' },
      { q: 'Does Arizona Complete Health require an autism diagnosis?', a: 'CP.BH.104 asks for a confirmed ASD diagnosis, but its own text defers to "state-defined ABA criteria" — and Arizona\'s AMPM 320-S covers other diagnoses justified by medical necessity. For non-ASD cases, cite AMPM 320-S in the request.' },
      { q: 'Does Arizona Complete Health cap ABA hours?', a: 'No hard caps — CP.BH.104 uses guideline bands: 10–25 hours/week for focused ABA, 30–40 for comprehensive, with supervision at 1–2 hours per 10 direct hours.' },
      { q: 'What happened to Care1st?', a: 'Care1st no longer exists as a separate ACC plan — it merged into Arizona Complete Health, with northern-county members transitioned in 2024. Any "Care1st" card or listing is stale.' },
    ],
  },

  'banner-university-family-care': {
    slug: 'banner-university-family-care',
    cardDesc: 'State baseline + its own ABA PA form; specifics unpublished — verify in the Banner portal.',
    treatmentPA: 'Required — the plan publishes an ABA Prior Authorization Form; durations and specifics unpublished, verify in the portal',
    dxRequired: 'No distinct plan policy published — AMPM 320-S baseline applies (autism dx not strictly required)',
    payer: 'Banner-University Family Care',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · Banner-University Family Care',
    h1: 'Banner-University Family Care ABA coverage (AHCCCS plan).',
    metaTitle: 'Banner-University Family Care (AHCCCS) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Banner-University Family Care handles Arizona AHCCCS ABA — the AMPM 320-S state baseline, the plan\'s ABA Prior Authorization Form, the 10-county ACC + ALTCS footprint, and the specifics you\'ll need to verify in the Banner portal.',
    intro: [
      'Banner-University Family Care — the Banner Health / University of Arizona Health Plans entry — carries the second-largest ACC footprint (ten counties, including Maricopa and Pima) plus ALTCS contracts. Unlike Mercy Care, UHC, or Arizona Complete Health, Banner publishes no distinct ABA clinical policy: everything we can verify points to the AMPM 320-S state baseline plus the plan\'s own ABA Prior Authorization Form. That makes this a verify-in-the-portal plan — the state guide tells you the clinical rules; Banner\'s portal tells you the paperwork.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'ACC in 10 counties + ALTCS (Banner Health / UA Health Plans)' },
      { label: 'Clinical rules', value: 'No distinct published ABA policy — AMPM 320-S baseline' },
      { label: 'Treatment PA', value: 'Required — via Banner\'s ABA Prior Authorization Form' },
      { label: 'Assessment PA', value: 'Not published — verify whether 97151/97152 need PA before booking' },
      { label: 'Portal', value: 'bannerhealth.com/bhpprovider (Banner Health Plans provider portal)' },
      { label: 'Rates', value: 'Not published — AHCCCS physician fee schedule is the benchmark' },
    ],
    sections: [
      {
        h2: 'What\'s verified — and what to pull from the portal',
        body: [
          'Banner lists an "Applied Behavior Analysis (ABA) Prior Authorization Form" among its behavioral-health materials, which confirms treatment PA exists — but the plan publishes no ABA clinical policy, no assessment-PA rule, no authorization durations, and no hour guidance that we could verify. The honest operating assumption is the state baseline: AMPM 320-S clinical criteria (including the no-autism-dx-required rule and 6-month progress reports), with Banner\'s own form as the PA vehicle. Before quoting a family a start date, pull the current ABA PA form from the behavioral-health materials page at bannerhealth.com/bhpprovider and confirm directly with the plan whether assessment codes 97151/97152 require PA — the two largest Arizona plans skip it, but Banner\'s position isn\'t published.',
        ],
        cites: [
          { title: 'Banner Health Plans — behavioral health materials and forms (lists the ABA PA form)', url: 'https://www.bannerhealth.com/bhpprovider/resources/bh/materials' },
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
        ],
      },
      {
        h2: 'Footprint',
        body: [
          'Banner-University Family Care operates as an ACC plan in Maricopa, Pinal, Cochise, Gila, Graham, Greenlee, La Paz, Pima, Santa Cruz, and Yuma counties, plus ALTCS in ten counties — the second-largest geographic reach after Arizona Complete Health. For intake, that means Banner cards show up across both metro Phoenix and southern Arizona; treat every one as an AMPM 320-S case with Banner-specific paperwork to confirm.',
        ],
        cites: [
          { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis (any qualifying)', desc: 'AMPM 320-S baseline — ASD or another diagnosis justified by medical necessity, with a BHP recommendation.' },
      { title: 'Current Banner ABA PA form', desc: 'Pull it from bannerhealth.com/bhpprovider before submitting — the specifics aren\'t published anywhere else.' },
      { title: 'Assessment-PA answer', desc: 'Confirm with the plan whether 97151/97152 need PA — unpublished, so don\'t assume the Mercy Care/UHC pattern.' },
      { title: 'County + plan line', desc: 'ACC vs. ALTCS membership — Banner holds both, on different rules.' },
    ],
    sources: [
      { title: 'Banner Health Plans — behavioral health materials and forms', url: 'https://www.bannerhealth.com/bhpprovider/resources/bh/materials' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
      { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
    ],
    faq: [
      { q: 'Does Banner-University Family Care cover ABA?', a: 'Yes — as an AHCCCS ACC plan it covers Behavior Analysis Services under AMPM 320-S. Treatment requires PA via Banner\'s ABA Prior Authorization Form; the plan publishes no distinct clinical policy beyond the state baseline.' },
      { q: 'Does Banner require PA for the ABA assessment?', a: 'Not published — unlike Mercy Care and UHC, Banner\'s assessment-PA position isn\'t stated publicly. Verify with the plan or the current PA form before booking an assessment as auth-free.' },
      { q: 'What does Banner pay for ABA?', a: 'Not published. Benchmark against the AHCCCS physician fee schedule (97153 at $17.91–$23.69 per 15-minute unit by credential tier); your contract is the source of truth.' },
    ],
  },

  'health-choice-arizona': {
    slug: 'health-choice-arizona',
    family: 'bcbs',
    cardDesc: 'Now officially "Blue Cross Blue Shield of Arizona Health Choice"; grid-driven PA, no published ABA policy.',
    dxRequired: 'No distinct plan policy published — AMPM 320-S baseline applies (autism dx not strictly required)',
    payer: 'Blue Cross Blue Shield of Arizona Health Choice',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · BCBSAZ Health Choice',
    h1: 'Blue Cross Blue Shield of Arizona Health Choice ABA coverage (AHCCCS plan).',
    metaTitle: 'BCBSAZ Health Choice (AHCCCS, formerly Health Choice Arizona) ABA Coverage | Carelu',
    metaDescription:
      'How Blue Cross Blue Shield of Arizona Health Choice (formerly branded "Health Choice Arizona") handles AHCCCS ABA — the AMPM 320-S state baseline, the frequently-updated PA grids that answer the code-level questions, and the northern-Arizona footprint.',
    intro: [
      'Blue Cross Blue Shield of Arizona\'s Medicaid vehicle is officially branded "Blue Cross Blue Shield of Arizona Health Choice" — AHCCCS\'s own current health plan list (revised 6/30/2026) uses this full name, not the older "Health Choice Arizona" branding this guide previously used; the coverage and mechanics below are unaffected by the naming update. Its strongest presence is in northern Arizona (Apache, Coconino, Mohave, Navajo, Yavapai) plus Maricopa, Gila, and Pinal — post-Care1st-merger, it competes mainly with Arizona Complete Health in the north. It publishes no distinct ABA clinical policy; its operational tool is the PA grid, updated frequently (versions have shipped effective 1/2024 through 5/2026). That makes the current grid, not a policy PDF, the document that answers the 9715x questions for this plan.',
    ],
    atGlance: [
      { label: 'Plan name', value: 'Blue Cross Blue Shield of Arizona Health Choice (formerly "Health Choice Arizona")' },
      { label: 'Plan type', value: 'ACC — northern GSA counties + Maricopa, Gila, Pinal (BCBSAZ)' },
      { label: 'Clinical rules', value: 'No distinct published ABA policy — AMPM 320-S baseline' },
      { label: 'PA source of truth', value: 'The current PA grid on healthchoiceaz.com — updated several times a year' },
      { label: 'Assessment/treatment PA', value: 'Not published as a standing rule — check the grid rows for 97151–97158' },
      { label: 'PA contacts', value: 'Fax 480-760-4732 · phone 1-800-322-8670' },
      { label: 'Portal', value: 'providerportal.healthchoiceaz.com' },
    ],
    sections: [
      {
        h2: 'Grid-driven PA on a state-baseline plan',
        body: [
          'Health Choice runs prior authorization from PA Guidelines grids rather than a published ABA program document, and the grids revise often — at least seven versions between January 2024 and May 2026. We could not verify the current grid rows for 97151 or 97153–97158, so the intake rule for this plan is procedural: pull the newest grid from healthchoiceaz.com (or ask via the PA line, 1-800-322-8670 / fax 480-760-4732) and read the 9715x rows before booking. Clinically, assume the AMPM 320-S baseline — no strict autism-diagnosis requirement, BHP-recommended services, 6-month progress reports — since no evidence suggests Health Choice layers distinct criteria on top.',
        ],
        cites: [
          { title: 'Health Choice Arizona — PA guidelines (grids)', url: 'https://www.healthchoiceaz.com/providers/pa-guidelines' },
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
        ],
      },
      {
        h2: 'Footprint: the northern-Arizona play',
        body: [
          'Health Choice\'s ACC footprint centers on the five northern counties — Apache, Coconino, Mohave, Navajo, Yavapai — where, after Care1st folded into Arizona Complete Health, the practical plan choice is Health Choice vs. AzCH, plus its Maricopa/Gila/Pinal presence. Providers building northern-Arizona intake should have both plans\' machinery mapped, because families in those counties will split between exactly these two.',
        ],
        cites: [
          { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis (any qualifying)', desc: 'AMPM 320-S baseline — ASD or another diagnosis justified by medical necessity.' },
      { title: 'Current PA grid rows for 9715x', desc: 'The grid revises several times a year — check the live version, not a saved copy.' },
      { title: 'County', desc: 'Northern counties are a Health Choice / AzCH duopoly — confirm which of the two the family actually holds.' },
      { title: 'Portal access', desc: 'providerportal.healthchoiceaz.com for submissions; PA phone and fax as fallback.' },
    ],
    sources: [
      { title: 'AHCCCS — Available Health Plans list (lists "Blue Cross Blue Shield of Arizona Health Choice")', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
      { title: 'Health Choice Arizona — PA guidelines (grids)', url: 'https://www.healthchoiceaz.com/providers/pa-guidelines' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
    ],
    faq: [
      { q: 'Does Blue Cross Blue Shield of Arizona Health Choice cover ABA?', a: 'Yes — as an AHCCCS ACC plan, on the AMPM 320-S baseline. It publishes no distinct ABA clinical policy; PA requirements live in its frequently-updated PA grids.' },
      { q: 'Does BCBSAZ Health Choice require PA for ABA codes?', a: 'Not published as a standing rule — check the current PA grid rows for 97151–97158 on healthchoiceaz.com, or call the PA line at 1-800-322-8670. Grids have revised at least seven times since early 2024.' },
      { q: 'Is Health Choice Arizona now Blue Cross Blue Shield of Arizona Health Choice?', a: 'Yes — AHCCCS\'s official health plan roster (revised 6/30/2026) lists it as "Blue Cross Blue Shield of Arizona Health Choice." It has been a BCBSAZ subsidiary since BCBSAZ acquired Steward Health Choice Arizona; the plan\'s AHCCCS contract, coverage, and mechanics are unchanged by the naming update.' },
    ],
  },

  'molina-healthcare-arizona': {
    slug: 'molina-healthcare-arizona',
    family: 'molina',
    cardDesc: 'Smallest ACC footprint (3 Phoenix-metro counties); no published ABA policy — verify by phone.',
    dxRequired: 'No distinct plan policy published — AMPM 320-S baseline applies (autism dx not strictly required)',
    payer: 'Molina Healthcare of Arizona',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · Molina Healthcare (AZ)',
    h1: 'Molina Healthcare of Arizona ABA coverage (AHCCCS plan).',
    metaTitle: 'Molina Healthcare of Arizona (AHCCCS) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of Arizona handles AHCCCS ABA — the AMPM 320-S state baseline, the Prior Auth and Pre-Service Review Guide, Availity Essentials submission, and the three-county Phoenix-metro footprint.',
    intro: [
      'Molina Healthcare of Arizona is the newest and smallest ACC plan — it entered with the 2022 ACC awards and covers three counties (Maricopa, Gila, Pinal), making it Phoenix-metro-centric. Like Banner and Health Choice, it publishes no distinct ABA clinical policy: the honest picture is the AMPM 320-S state baseline, with Molina\'s Prior Auth and Pre-Service Review Guide and its Healthcare Services line as the operational front door. Every ABA specific for this plan should be verified directly before quoting it to a family.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'ACC in Maricopa, Gila, Pinal (entered with the 2022 awards)' },
      { label: 'Clinical rules', value: 'No distinct published ABA policy — AMPM 320-S baseline' },
      { label: 'PA initiation', value: 'Healthcare Services (844) 782-2678 or fax (833) 832-1015' },
      { label: 'Portal', value: 'Availity Essentials (encouraged for submissions)' },
      { label: 'Assessment/treatment PA', value: 'Not published — verify against the current Prior Auth Guide' },
      { label: 'Rates', value: 'Not published — AHCCCS physician fee schedule is the benchmark' },
    ],
    sections: [
      {
        h2: 'The state baseline, with plan mechanics to verify',
        body: [
          'Nothing we could verify shows Molina layering clinical criteria beyond AMPM 320-S — so the coverage conversation follows the state guide: no strict autism-diagnosis requirement, BHP-recommended services based on assessment, 6-month progress reports. The mechanics run through Molina\'s Prior Auth and Pre-Service Review Guide, with PA initiated via Healthcare Services at (844) 782-2678 or fax (833) 832-1015, and Availity Essentials as the encouraged submission portal. The guide\'s current ABA rows — including whether 97151/97152 need PA — are the thing to check on first contact, because none of it is published as a standing ABA rule.',
        ],
        cites: [
          { title: 'Molina Healthcare of Arizona — Prior Auth and Pre-Service Review Guide', url: 'https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/az/Forms/MHAZ-Prior-Auth-and-Pre-Service-Review-Guide-508.pdf' },
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis (any qualifying)', desc: 'AMPM 320-S baseline — ASD or another diagnosis justified by medical necessity.' },
      { title: 'Current Prior Auth Guide rows', desc: 'Verify the ABA code rows (97151–97158) in the live guide, or via (844) 782-2678, before promising timelines.' },
      { title: 'County', desc: 'Molina only operates in Maricopa, Gila, and Pinal — outside those, the card is another plan\'s.' },
      { title: 'Availity access', desc: 'Molina encourages Availity Essentials — have the workflow ready rather than defaulting to fax.' },
    ],
    sources: [
      { title: 'Molina Healthcare of Arizona — Prior Auth and Pre-Service Review Guide', url: 'https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/az/Forms/MHAZ-Prior-Auth-and-Pre-Service-Review-Guide-508.pdf' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
      { title: 'AHCCCS — Available Health Plans list', url: 'https://www.azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of Arizona cover ABA?', a: 'Yes — as an AHCCCS ACC plan on the AMPM 320-S baseline. Molina publishes no distinct ABA clinical policy; PA mechanics run through its Prior Auth and Pre-Service Review Guide and Availity Essentials.' },
      { q: 'Does Molina require PA for ABA in Arizona?', a: 'Its code-level ABA PA rules aren\'t published as a standing rule — verify against the current Prior Auth Guide or call Healthcare Services at (844) 782-2678 before booking.' },
      { q: 'Where does Molina operate in Arizona?', a: 'Three counties: Maricopa, Gila, and Pinal — the smallest ACC footprint, centered on Phoenix metro.' },
    ],
  },

  'arizona-ddd': {
    slug: 'arizona-ddd',
    cardDesc: 'The second funnel: ALTCS-DD members get ABA via Mercy Care DD or UHCCP DD, statewide.',
    assessmentPA: 'Follows the member\'s DDD Health Plan — Mercy Care DD and UHCCP DD both skip PA on 97151/97152',
    treatmentPA: 'Through the member\'s DDD Health Plan (Mercy Care DD or UHCCP DD), on the same ABA PA machinery as their ACC lines',
    dxRequired: 'No — AMPM 320-S applies; autism is a DDD qualifying-condition category, but ABA rides on medical necessity',
    payer: 'DES/DDD (Arizona Division of Developmental Disabilities)',
    state: 'AZ', kind: 'medicaid-mco', parent: 'AHCCCS (Arizona Medicaid)',
    pill: 'Payer Guide · Arizona DES/DDD',
    h1: 'Arizona DES/DDD ABA coverage (the ALTCS-DD path).',
    metaTitle: 'Arizona DES/DDD (ALTCS-DD) ABA Coverage & Health Plans | Carelu',
    metaDescription:
      'How ALTCS-DD members get ABA in Arizona — the DES/DDD second funnel, the two statewide DDD Health Plans (Mercy Care DD and UHCCP DD), the over-age-3 ALTCS gate, and the bundled habilitation/respite conversation.',
    intro: [
      'The Division of Developmental Disabilities (DES/DDD) is Arizona\'s second ABA funnel: ALTCS-eligible members with developmental disabilities get their physical and behavioral health — including ABA — not through an ACC plan but through one of two statewide DDD Health Plans, Mercy Care DD or UnitedHealthcare Community Plan DD (both effective October 2019). Clinically nothing changes — AMPM 320-S governs DES/DDD by its own terms — but structurally this is a separate eligibility gate and plan-choice flow, and routing a DDD family down the ACC path (or vice versa) burns weeks. Intake teams that ask the DDD question first route correctly.',
    ],
    atGlance: [
      { label: 'What it is', value: 'The ALTCS-DD path — DDD subcontracts health care to two statewide DDD Health Plans' },
      { label: 'The plans', value: 'Mercy Care DD and UHCCP DD ("DD by UHCCP") — member chooses; both statewide' },
      { label: 'Clinical rules', value: 'AMPM 320-S — identical to the ACC path' },
      { label: 'Eligibility gate', value: 'Over age 3, ALTCS approval is the gate to DDD-funded services; autism is a qualifying-condition category' },
      { label: 'Assessment PA', value: 'None at either DDD plan — same 97151/97152 rule as their ACC lines' },
      { label: 'Bundled services', value: 'DDD members also get habilitation and respite (HCBS) alongside ABA' },
    ],
    sections: [
      {
        h2: 'The dual path, from the DDD side',
        body: [
          'Children under 21 can get ABA either through their ACC plan under EPSDT or — if ALTCS/DDD-eligible — through a DDD Health Plan. Autism is a DDD qualifying-condition category, and over age 3 ALTCS approval is the gate to DDD-funded services (habilitation, respite, ABA). Once eligible, the family chooses between Mercy Care DD and UHCCP DD, and unlike the ACC side, both DDD Health Plans are statewide — county doesn\'t restrict DDD members the way ACC geographic service areas do. Authorization then runs through the chosen plan\'s ABA machinery, identical to its ACC line: no PA on 97151/97152 at either plan, treatment PA on their respective forms (Mercy Care\'s ABA PA form with 6-month auths; Optum\'s Provider Express Treatment Form for UHCCP DD). DDD ALTCS also maintains its own service-approval matrix on the LTSS side.',
        ],
        cites: [
          { title: 'DES — DDD Health Plans information', url: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info' },
          { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
          { title: 'AZA United — navigating the systems of care (the ALTCS gate over age 3)', url: 'https://azaunited.org/blog/navigating-the-systems-of-care' },
        ],
      },
      {
        h2: 'Why the DDD conversation is different at intake',
        body: [
          'A DDD family isn\'t just an ABA inquiry — DDD members also receive habilitation and respite through home- and community-based services alongside ABA, a bundled-service conversation ACC-only families never have. Intake that recognizes a DDD card (UHCCP DD cards read "DDD Health Plan by UHCCP," Group AZDDD; Mercy Care DD is branded accordingly) can coordinate the ABA request with the family\'s DDD support coordinator instead of working blind. For families who look DDD-eligible but aren\'t enrolled, the ALTCS application is the long pole — flag it early, and run the ACC path in parallel where EPSDT coverage already exists.',
        ],
        cites: [
          { title: 'DES — DDD Health Plans information', url: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info' },
          { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'DDD enrollment + ALTCS status', desc: 'Enrolled DDD member, ALTCS application pending, or ACC-only — three different routes with different timelines.' },
      { title: 'Which DDD Health Plan', desc: 'Mercy Care DD or UHCCP DD — the choice sets the PA form, portal, and auth cadence.' },
      { title: 'Support coordinator contact', desc: 'DDD members have one — coordinate the ABA request with the existing service plan.' },
      { title: 'Other DDD services in place', desc: 'Habilitation and respite hours shape the realistic ABA schedule.' },
    ],
    sources: [
      { title: 'DES — DDD Health Plans information', url: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info' },
      { title: 'AMPM 320-S — Behavior Analysis Services (AHCCCS)', url: 'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf' },
      { title: 'AZA United — navigating the systems of care', url: 'https://azaunited.org/blog/navigating-the-systems-of-care' },
    ],
    faq: [
      { q: 'How do DDD members get ABA in Arizona?', a: 'Through their chosen DDD Health Plan — Mercy Care DD or UHCCP DD, both statewide — on the same AMPM 320-S clinical rules and the same plan-level ABA PA machinery as those plans\' ACC lines.' },
      { q: 'Can a child get ABA through an ACC plan instead of DDD?', a: 'Yes — children under 21 can get ABA via their ACC plan under EPSDT even without DDD. If the child is ALTCS/DDD-eligible, the DDD path adds bundled services (habilitation, respite); over age 3, ALTCS approval is the gate.' },
      { q: 'Does county matter for DDD members?', a: 'No — both DDD Health Plans are statewide, unlike ACC plans, which are restricted to geographic service areas.' },
    ],
  },

  'aetna-arizona': {
    slug: 'aetna-arizona',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + Steven\'s Law with its caps repealed by SB 1590 (2025).',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Arizona',
    state: 'AZ', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Arizona',
    h1: 'Aetna ABA coverage in Arizona: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Arizona: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Arizona families — the national clinical policy, prior authorization, Steven\'s Law with its dollar caps repealed by SB 1590 (2025), A.R.S. § 32-2091 behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Arizona, an Aetna card means three layers at once: the carrier\'s national clinical policy, Arizona\'s autism insurance mandate (Steven\'s Law, its dollar caps freshly repealed by SB 1590), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — plus one Arizona twist: Aetna also administers Mercy Care, so "we have Aetna" often means a Medicaid member.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Steven\'s Law (A.R.S. § 20-826.04 and three parallel sections)' },
      { label: 'Mandate caps', value: 'NONE — the $50K/$25K annual caps were repealed by SB 1590 (2025)' },
      { label: 'Mandate age', value: 'No explicit age limit remains — the age tiers lived in the repealed cap subsection' },
      { label: 'Exempt from mandate', value: 'Individual & small-employer policies; self-funded ERISA' },
      { label: 'Licensure', value: 'AZ Licensed Behavior Analyst (A.R.S. § 32-2091, Board of Psychologist Examiners)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Arizona',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Arizona is the legal floor underneath it: the state mandate below governs what fully-insured group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Arizona.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Arizona mandate: Steven\'s Law, caps repealed',
        body: [
          'Steven\'s Law (HB 2847, 2008) lives in four parallel sections of the insurance code — A.R.S. §§ 20-826.04, 20-1057.11, 20-1402.03, and 20-1404.03 — covering state-regulated group coverage: large-group contracts, HMO plans, and group and blanket disability policies. Plans may not deny or limit treatment based solely on an autism spectrum disorder diagnosis, and may not exclude medically necessary behavioral therapy, which the statute defines to include ABA (discrete trial training, pivotal response training, intensive behavioral intervention), delivered or supervised by a licensed or certified provider. The headline change: SB 1590 (signed May 7, 2025) struck the dollar-cap subsection from all four sections — the old $50,000/year (under age 9) and $25,000/year (ages 9–16) behavioral-therapy maximums are repealed, taking the statute\'s only age tiers with them, and the ASD definition now tracks the current DSM. No annual dollar ceiling remains on any state-regulated group plan (federal parity had already made the caps largely unenforceable; SB 1590 cleaned the statute to match — do not treat the old $50K/$25K numbers as current). Exemptions: policies issued to an individual or small employer (those reach ABA via the ACA EHB benchmark instead), limited-benefit coverage, and self-funded ERISA plans. Ordinary cost sharing is still permitted.',
        ],
        cites: [
          { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
          { title: 'A.R.S. § 20-826.04 — current text (caps absent)', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
          { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'Aetna Medicaid in Arizona: Mercy Care',
        body: [
          'A family saying "we have Aetna" in Arizona may actually be a Mercy Care member — Mercy Care is administered by Aetna Medicaid Administrators LLC and covers the largest Phoenix-metro Medicaid, DDD, and foster-care books. Mercy Care runs on AHCCCS rules (AMPM 320-S), not this commercial policy: no autism diagnosis required, no PA on assessment codes. Verify which line of business the card belongs to, and use the dedicated Mercy Care guide for the Medicaid plan. Aetna publishes no Arizona-specific commercial ABA policy or supplement — the national policy plus the state mandate is the whole commercial picture.',
        ],
        cites: [
          { title: 'Mercy Care — Applied Behavior Analysis provider page', url: 'https://www.mercycareaz.org/providers/applied-behavior-analysis.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Arizona',
        body: [
          'Arizona requires a state license to practice behavior analysis — A.R.S. § 32-2091, administered by the Arizona Board of Psychologist Examiners (behavior analysts sit under the psychology board, not a standalone board) — and BCBA certification alone is not sufficient; AHCCCS itself defines "Behavior Analyst" as a person licensed under § 32-2091. On rates: Aetna does not publish commercial ABA fee schedules for Arizona (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against the AHCCCS fee schedule (97153 at $17.91–$23.69 per 15-minute unit by credential tier), remembering the ABA codes live on the AHCCCS physician fee schedule, not the behavioral-health one.',
        ],
        cites: [
          { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
          { title: 'AHCCCS — Final Public Notice, FFS rate changes 11/1/2023 (ABA codes)', url: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured group (mandate applies) vs. self-funded ERISA (exempt) vs. individual/small-group (EHB benchmark) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial Aetna vs. Mercy Care (Medicaid, Aetna-administered) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — the commercial policy is ASD-only.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
      { title: 'A.R.S. § 20-826.04 — current text', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
      { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
      { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Arizona?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Steven\'s Law for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does Arizona still cap ABA benefits at $50,000 a year?', a: 'No — SB 1590 (signed May 7, 2025) repealed the $50,000/$25,000 annual behavioral-therapy caps from all four Steven\'s Law sections. No annual dollar ceiling remains on any state-regulated group plan.' },
      { q: 'What does Aetna pay for ABA in Arizona?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the AHCCCS physician fee schedule and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-arizona': {
    slug: 'cigna-arizona',
    family: 'cigna',
    cardDesc: 'EN0499 (no AZ carve-out) + Steven\'s Law with its caps repealed by SB 1590 (2025).',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Arizona',
    state: 'AZ', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Arizona',
    h1: 'Cigna / Evernorth ABA coverage in Arizona: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Arizona: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Arizona families — national policy EN0499, prior authorization, Steven\'s Law with its dollar caps repealed by SB 1590 (2025), A.R.S. § 32-2091 licensure, and what intake should verify.',
    intro: [
      'For an intake team in Arizona, a Cigna card means three layers at once: the carrier\'s national clinical policy, Arizona\'s autism insurance mandate (Steven\'s Law, its dollar caps freshly repealed by SB 1590), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Steven\'s Law (A.R.S. § 20-826.04 and three parallel sections)' },
      { label: 'Mandate caps', value: 'NONE — the $50K/$25K annual caps were repealed by SB 1590 (2025)' },
      { label: 'Mandate age', value: 'No explicit age limit remains — the age tiers lived in the repealed cap subsection' },
      { label: 'Exempt from mandate', value: 'Individual & small-employer policies; self-funded ERISA' },
      { label: 'Licensure', value: 'AZ Licensed Behavior Analyst (A.R.S. § 32-2091, Board of Psychologist Examiners)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Arizona',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form — EN0499 expects a confirmed ASD diagnosis (F84.0–F84.9, Rett excluded) by an independently licensed professional, a current-version standardized assessment instrument (e.g., Vineland-3) administered within 60 days before treatment start, and an individualized plan with baseline data. That clinical policy is national — what changes in Arizona is the legal floor underneath it: the state mandate below governs what fully-insured group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Arizona.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Arizona mandate: Steven\'s Law, caps repealed',
        body: [
          'Steven\'s Law (HB 2847, 2008) lives in four parallel sections of the insurance code — A.R.S. §§ 20-826.04, 20-1057.11, 20-1402.03, and 20-1404.03 — covering state-regulated group coverage: large-group contracts, HMO plans, and group and blanket disability policies. Plans may not deny or limit treatment based solely on an autism spectrum disorder diagnosis, and may not exclude medically necessary behavioral therapy, which the statute defines to include ABA (discrete trial training, pivotal response training, intensive behavioral intervention), delivered or supervised by a licensed or certified provider. The headline change: SB 1590 (signed May 7, 2025) struck the dollar-cap subsection from all four sections — the old $50,000/year (under age 9) and $25,000/year (ages 9–16) behavioral-therapy maximums are repealed, taking the statute\'s only age tiers with them, and the ASD definition now tracks the current DSM. No annual dollar ceiling remains on any state-regulated group plan (federal parity had already made the caps largely unenforceable; SB 1590 cleaned the statute to match — do not treat the old $50K/$25K numbers as current). Exemptions: policies issued to an individual or small employer (those reach ABA via the ACA EHB benchmark instead), limited-benefit coverage, and self-funded ERISA plans. Ordinary cost sharing is still permitted.',
        ],
        cites: [
          { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
          { title: 'A.R.S. § 20-826.04 — current text (caps absent)', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
          { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No Arizona carve-out in EN0499',
        body: [
          'We checked: the current EN0499\'s state-mandate paragraph names only New York and Virginia — there is no Arizona carve-out, so Arizona fully-insured business runs on the standard EN0499 criteria, including the no-assessment-PA fast path and the 60-day assessment-instrument recency rule. Cigna publishes no Arizona-specific ABA policy or supplement, and it runs no AHCCCS Medicaid plan in Arizona. SB 1590\'s cap repeal still binds Cigna\'s Arizona-regulated group plans at the benefit level regardless of the clinical policy — so benefits verification (plan funding type, benefit terms) is where the Arizona-specific answers come from.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Arizona',
        body: [
          'Arizona requires a state license to practice behavior analysis — A.R.S. § 32-2091, administered by the Arizona Board of Psychologist Examiners (behavior analysts sit under the psychology board, not a standalone board) — and BCBA certification alone is not sufficient; AHCCCS itself defines "Behavior Analyst" as a person licensed under § 32-2091. On rates: Cigna does not publish commercial ABA fee schedules for Arizona (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against the AHCCCS fee schedule (97153 at $17.91–$23.69 per 15-minute unit by credential tier), remembering the ABA codes live on the AHCCCS physician fee schedule, not the behavioral-health one.',
        ],
        cites: [
          { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
          { title: 'AHCCCS — Final Public Notice, FFS rate changes 11/1/2023 (ABA codes)', url: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured group (mandate applies) vs. self-funded ERISA (exempt) vs. individual/small-group (EHB benchmark) — it decides which rulebook governs.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report + assessment recency', desc: 'DSM-5 ASD diagnosis by an independently licensed professional, and a standardized instrument within 60 days of treatment start (EN0499).' },
      { title: 'Age', desc: 'Arizona\'s mandate now carries no explicit age limit — flag edge cases for the benefit analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
      { title: 'A.R.S. § 20-826.04 — current text', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
      { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
      { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Arizona?', a: 'Yes — under national policy EN0499 for ASD (no Arizona carve-out exists), layered on Steven\'s Law for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does Arizona still cap ABA benefits at $50,000 a year?', a: 'No — SB 1590 (signed May 7, 2025) repealed the $50,000/$25,000 annual behavioral-therapy caps from all four Steven\'s Law sections. No annual dollar ceiling remains on any state-regulated group plan.' },
      { q: 'What does Cigna pay for ABA in Arizona?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the AHCCCS physician fee schedule and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-arizona': {
    slug: 'unitedhealthcare-arizona',
    family: 'unitedhealthcare',
    cardDesc: 'BH803ABASCC + Optum\'s AZ state-mandate entry reflecting SB 1590\'s cap repeal.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Arizona',
    state: 'AZ', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Arizona',
    h1: 'UnitedHealthcare / Optum ABA coverage in Arizona: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Arizona: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Arizona families — the national clinical policy, prior authorization, Optum\'s Arizona state-mandate entry reflecting SB 1590\'s cap repeal, A.R.S. § 32-2091 licensure, and what intake should verify.',
    intro: [
      'For an intake team in Arizona, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Arizona\'s autism insurance mandate (Steven\'s Law, its dollar caps freshly repealed by SB 1590), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — and UHC is the one national carrier whose Optum criteria carry an explicit Arizona commercial entry.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Steven\'s Law (A.R.S. § 20-826.04 and three parallel sections)' },
      { label: 'Mandate caps', value: 'NONE — the $50K/$25K annual caps were repealed by SB 1590 (2025)' },
      { label: 'Mandate age', value: 'No explicit age limit remains — the age tiers lived in the repealed cap subsection' },
      { label: 'Exempt from mandate', value: 'Individual & small-employer policies; self-funded ERISA' },
      { label: 'Licensure', value: 'AZ Licensed Behavior Analyst (A.R.S. § 32-2091, Board of Psychologist Examiners)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Arizona',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in Arizona is the legal floor underneath it: the state mandate below governs what fully-insured group plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Arizona.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Arizona mandate: Steven\'s Law, caps repealed',
        body: [
          'Steven\'s Law (HB 2847, 2008) lives in four parallel sections of the insurance code — A.R.S. §§ 20-826.04, 20-1057.11, 20-1402.03, and 20-1404.03 — covering state-regulated group coverage: large-group contracts, HMO plans, and group and blanket disability policies. Plans may not deny or limit treatment based solely on an autism spectrum disorder diagnosis, and may not exclude medically necessary behavioral therapy, which the statute defines to include ABA (discrete trial training, pivotal response training, intensive behavioral intervention), delivered or supervised by a licensed or certified provider. The headline change: SB 1590 (signed May 7, 2025) struck the dollar-cap subsection from all four sections — the old $50,000/year (under age 9) and $25,000/year (ages 9–16) behavioral-therapy maximums are repealed, taking the statute\'s only age tiers with them, and the ASD definition now tracks the current DSM. No annual dollar ceiling remains on any state-regulated group plan (federal parity had already made the caps largely unenforceable; SB 1590 cleaned the statute to match — do not treat the old $50K/$25K numbers as current). Exemptions: policies issued to an individual or small employer (those reach ABA via the ACA EHB benchmark instead), limited-benefit coverage, and self-funded ERISA plans. Ordinary cost sharing is still permitted.',
        ],
        cites: [
          { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
          { title: 'A.R.S. § 20-826.04 — current text (caps absent)', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
          { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'Optum\'s Arizona-specific criteria',
        body: [
          'Arizona has its own entry in Optum\'s ABA State Mandates supplemental criteria (BH803ABASTM12026, effective January 2026): for Arizona commercial plans, Optum operationalizes SB 1590 — the repeal of the maximum benefit limits for members 16 and under and the DSM-based ASD definition. In practice that means Optum\'s own criteria document already reflects the cap repeal, so a UM conversation that cites the old $50K/$25K numbers is out of date on both the statute and the carrier\'s paperwork.',
        ],
        cites: [
          { title: 'Optum — ABA State Mandates supplemental criteria (BH803ABASTM12026, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Arizona',
        body: [
          'A family saying "we have UnitedHealthcare" in Arizona may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of Arizona, which is both an ACC plan and one of the two statewide DDD Health Plans ("DD by UHCCP"), with ABA administered by Optum under AHCCCS rules: no autism diagnosis required, no PA on 97151/97152, its own AZ treatment-request forms. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
        cites: [
          { title: 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Arizona',
        body: [
          'Arizona requires a state license to practice behavior analysis — A.R.S. § 32-2091, administered by the Arizona Board of Psychologist Examiners (behavior analysts sit under the psychology board, not a standalone board) — and BCBA certification alone is not sufficient; AHCCCS itself defines "Behavior Analyst" as a person licensed under § 32-2091. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Arizona (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against the AHCCCS fee schedule (97153 at $17.91–$23.69 per 15-minute unit by credential tier), remembering the ABA codes live on the AHCCCS physician fee schedule, not the behavioral-health one.',
        ],
        cites: [
          { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
          { title: 'AHCCCS — Final Public Notice, FFS rate changes 11/1/2023 (ABA codes)', url: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured group (mandate applies) vs. self-funded ERISA (exempt) vs. individual/small-group (EHB benchmark) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Arizona (Medicaid/DDD) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD diagnosis confirmed with a validated tool (ADI-R, ADOS-2, etc.), diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH803ABASTM12026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'SB 1590 — chaptered law (Laws 2025, ch. 142)', url: 'https://www.azleg.gov/legtext/57leg/1R/laws/0142.pdf' },
      { title: 'A.R.S. § 20-826.04 — current text', url: 'https://www.azleg.gov/ars/20/00826-04.htm' },
      { title: 'Autism Speaks — Arizona state-regulated insurance coverage', url: 'https://www.autismspeaks.org/arizona-state-regulated-insurance-coverage' },
      { title: 'A.R.S. § 32-2091 — behavior analyst licensure', url: 'https://www.azleg.gov/ars/32/02091.htm' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Arizona?', a: 'Yes — under Optum\'s national two-step authorization policy for ASD, layered on Steven\'s Law for state-regulated group plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does Arizona still cap ABA benefits at $50,000 a year?', a: 'No — SB 1590 (signed May 7, 2025) repealed the $50,000/$25,000 annual caps, and Optum\'s own Arizona state-mandate entry (effective January 2026) already reflects the repeal. No annual dollar ceiling remains on any state-regulated group plan.' },
      { q: 'What does UnitedHealthcare pay for ABA in Arizona?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the AHCCCS physician fee schedule and treat rate-setting as part of contracting.' },
    ],
  },
};
