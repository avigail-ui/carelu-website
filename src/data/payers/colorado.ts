import type { PayerConfig } from './types.js';

export const coloradoPayers: Record<string, PayerConfig> = {
  'colorado-medicaid': {
    slug: 'colorado-medicaid',
    cardDesc: 'No autism-dx gate; FFS carve-out (RAEs don\'t run ABA); PAR on everything; no 97156.',
    assessmentPA: 'Required — ALL PBT services need a Prior Authorization Request (PAR) via Acentra\'s Atrezzo portal (ColoradoPAR.com), including the 97151 assessment',
    treatmentPA: 'Required — same Acentra PAR process; approvals valid up to 6 months, reauth needs charts-and-graphs progress data',
    dxRequired: 'NO — no autism diagnosis required; any of three criteria (qualifying condition, functional interference, or safety risk) opens the benefit',
    payer: 'Health First Colorado (Colorado Medicaid)',
    state: 'CO', kind: 'state-medicaid',
    pill: 'Payer Guide · Health First Colorado',
    h1: 'Health First Colorado (Colorado Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'Colorado Medicaid (Health First Colorado) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Health First Colorado covers ABA under the Pediatric Behavioral Therapies EPSDT benefit — no autism diagnosis required, the statewide FFS carve-out (RAEs don\'t administer ABA), Acentra/Atrezzo PARs on every code, the missing 97156, and the October 2025 rate cuts.',
    intro: [
      'Health First Colorado covers ABA for members age 20 and younger through the Pediatric Behavioral Therapies (PBT) EPSDT benefit — and it breaks the usual state-Medicaid mold twice. First, no autism diagnosis is required: the coverage criteria open the benefit on any of three pathways (a qualifying condition including but not limited to ASD, a functional interference with home/school/community life, or a safety risk), so intake should never turn a family away for lacking an ASD evaluation. Second, ABA is a statewide fee-for-service carve-out: Colorado\'s four Regional Accountable Entities administer the capitated behavioral health benefit, but PBT is not in that capitation — every PAR goes to the state\'s UM vendor Acentra, and every claim goes to the state fiscal agent, regardless of the member\'s RAE. The trade-off is authorization rigor: everything, including the initial assessment, is prior-authorized, and 97156 parent-training does not exist as a billable code here.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — age 20 and younger, via EPSDT (Pediatric Behavioral Therapies benefit)' },
      { label: 'Autism dx required?', value: 'NO — three qualifying pathways; ASD is one option, not a gate' },
      { label: 'Prior auth', value: 'Required on ALL services incl. the 97151 assessment — PAR via Acentra (Atrezzo portal)' },
      { label: 'Auth period', value: 'Up to 6 months per PAR; reauth needs charts-and-graphs progress data' },
      { label: 'Diagnosis recency', value: 'Signed comprehensive diagnostic evaluation within the previous 12 months' },
      { label: 'Rates (DOS 10/1/2025+)', value: '97153 $17.20 · 97155 $25.80 per 15-min unit; 97151 flat per assessment' },
      { label: '97156', value: 'NOT COVERED — no billable parent/caregiver guidance code in Colorado' },
      { label: 'Staff screening', value: 'RBT/ABAT certification is a billing condition (Section 8.281; deadline suspended — comply now) + annual background checks' },
    ],
    sections: [
      {
        h2: 'The carve-out: RAEs don\'t touch ABA',
        body: [
          'Under ACC Phase III (launched July 1, 2025), Colorado runs four Regional Accountable Entities — RMHP (Region 1), Northeast Health Partners (Region 2), Colorado Community Health Alliance (Region 3), and Colorado Access (Region 4) — that administer the capitated behavioral health benefit, plus the Elevate (Denver Health) physical-health MCO. PBT/ABA sits outside all of it: it is a fee-for-service EPSDT state-plan benefit, with PARs submitted to HCPF\'s statewide UM vendor Acentra (formerly Kepro) and claims paid by the state fiscal agent (Gainwell). Policy Memo PM 25-005 states it plainly — PBT is "reimbursed by Health First Colorado as fee-for-service." For intake, that means the member\'s RAE or MCO assignment is irrelevant to ABA: one PAR process, one fee schedule, one claims pipeline, statewide. Do not route ABA authorizations to a RAE, and do not expect a RAE to answer ABA UM questions.',
        ],
        cites: [
          { title: 'HCPF PM 25-005 — Pediatric Behavioral Therapy Policy Clarification', url: 'https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20PM%2025-005%20Pediatric%20Behavioral%20Therapy%20Policy%20Clarification.pdf' },
          { title: 'HCPF — Accountable Care Collaborative Phase III', url: 'https://hcpf.colorado.gov/accphaseIII' },
          { title: 'Pediatric Behavioral Therapies Billing Manual (HCPF)', url: 'https://hcpf.colorado.gov/pbt-manual' },
        ],
      },
      {
        h2: 'No autism diagnosis required — the three pathways',
        body: [
          'Colorado\'s Criteria for Behavioral Therapies (February 2023) require only ONE of three things: (1) a diagnosed condition for which behavioral therapy is evidence-based or evidence-informed — "including" ASD, but explicitly not limited to it; (2) an inability to adequately participate in home, school, or community activities because of a behavior or skill deficit, supported by a standardized assessment of maladaptive behaviors; or (3) a safety risk to self or others — self-injury, aggression, elopement, property destruction, stereotypy. Coverage runs on EPSDT medical necessity for members age 20 and younger. This is a genuine intake differentiator: a family waiting months for a diagnostic evaluation can still qualify through the functional-interference or safety pathway.',
          'The recency rule that does apply: the clinical documentation must include a signed comprehensive diagnostic evaluation performed within the previous twelve months by a qualified health care professional (the client\'s physician, nurse practitioner, or psychologist) — a 12-month clock on the evaluation, not an autism-diagnosis mandate. The ordering/referral can come from an MD/DO, PA, NP, or Licensed Psychologist (psychologists were added to the referrer list August 12, 2024).',
        ],
        cites: [
          { title: 'Health First Colorado Criteria for Behavioral Therapies (Feb 2023)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Health%20First%20Colorado%20Criteria%20for%20Behavioral%20Therapies%20February%202023.pdf' },
          { title: 'Pediatric Behavioral Therapies Information for Providers (HCPF)', url: 'https://hcpf.colorado.gov/pediatric-behavioral-therapies-information-providers' },
        ],
      },
      {
        h2: 'PAR mechanics: everything is prior-authorized',
        body: [
          'The PBT Billing Manual is blunt: "All PBT services must be pre-approved in a Prior Authorization Request (PAR) process" — including the 97151 assessment, which many states leave auth-free. PARs go to Acentra through the Atrezzo portal (ColoradoPAR.com) and must include the ordering practitioner\'s prescription or Plan of Care with a diagnosis (ICD-10 preferred), a standardized norm-referenced adaptive-behavior assessment (the state does not mandate a specific instrument — provider\'s choice, completed by the PBT provider), the referral, treatment history, and measurable goals; supporting assessment and progress notes must be no more than 60 days old at submission. Approved PARs run up to six months, so reauthorization is a twice-a-year event: each new PAR needs documented meaningful, measurable, functional improvement "confirmed through data, documented in charts and graphs, durable over time," plus a signed revised treatment plan showing generalization outside the treatment setting. Documentation must meet CASP minimum requirements, and denials have four paths — PAR Reconsideration (second review by a different physician), a new PAR with added information, peer-to-peer, or member appeal to the Office of Administrative Courts.',
          'PM 25-005 (effective April 15, 2025) added operational teeth worth designing intake around: Health First Colorado will no longer cover 40 hours/week of clinic-based PBT when the child has access to school hours, unless the district shows the child can\'t be served in a classroom — school IEP hour counts must be submitted with EPSDT requests, so capture the school picture at intake. Credential floors are explicit: RBT minimum for 97153, BCBA (or equivalent) minimum for 97155, and all PBT providers had to re-enroll as Provider Type 83 (clinic) or 84 (individual) by September 1, 2025. EVV (Electronic Visit Verification) is mandatory for PBT delivered in home or community settings — an operational burden many states don\'t impose on ABA — and the memo warns of recoupment on documentation failures (nap time and other-provider co-treatment time are not billable).',
        ],
        cites: [
          { title: 'Pediatric Behavioral Therapies Billing Manual (HCPF)', url: 'https://hcpf.colorado.gov/pbt-manual' },
          { title: 'HCPF PM 25-005 — Pediatric Behavioral Therapy Policy Clarification', url: 'https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20PM%2025-005%20Pediatric%20Behavioral%20Therapy%20Policy%20Clarification.pdf' },
        ],
      },
      {
        h2: 'Rates: a flat assessment, a missing code, and a mid-year cut',
        body: [
          'Colorado\'s fee schedule has three quirks intake and billing must both know. First, 97151 pays a FLAT amount per assessment — $882.78 on the July 2025 schedule, billable once per 365 days — rather than per 15-minute unit (97151-TJ pays $40.24/unit, set at 2 units per 365 days). Second, 97156 does not exist here: the family adaptive behavior treatment guidance code is absent from the PBT allowable-code table (97151, 97151-TJ, 97153, 97154, 97155, 97158 only) and has no rate — caregiver training is instead a required element woven into the treatment plan, not separately billable revenue. Third, rates were cut mid-year: Special Provider Bulletin B2500528 (September 2025, under Executive Order D 2025 014\'s budget shortfall) reduced PBT rates for dates of service on or after October 1, 2025 — 97153 $18.17 → $17.20 and 97155 $26.62 → $25.80 per 15-minute unit, with the group codes hit hardest: 97154 $11.51 → $8.81 (-23%) and 97158 $17.83 → $9.34 (-48%). There are no credential-tier modifiers — a single rate per code (TJ modifier only on 97151). Build revenue models on the post-cut numbers, and treat group-based service lines with caution.',
        ],
        cites: [
          { title: 'FY2025-26 Health First Colorado Fee Schedule (July 2025 v1.4)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/01_CO_Fee%20Schedule_Health%20First%20Colorado_07012025%20v1.4.xlsx' },
          { title: 'Special Provider Bulletin B2500528 — Rate Reductions (Sep 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Special%20Provider%20Bulletin%20-%20Rate%20Reductions%20092025_B2500528_0.pdf' },
          { title: 'Pediatric Behavioral Therapies Billing Manual (HCPF)', url: 'https://hcpf.colorado.gov/pbt-manual' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Colorado turned technician credentialing into a billing condition in late 2025. Emergency rule MSB 25-09-04-A created Section 8.281 (emergency effective October 10, 2025; finally adopted December 12, 2025) after federal audit findings that uncredentialed technicians had been reimbursed — preliminary estimates put the potential repayment to CMS as high as $59 million. The rule requires billing providers to ensure every technician they supervise holds an active credential: an RBT (high school diploma, 40-hour BACB-specification training, passed competency exam, ongoing supervision per BACB requirements) or the QABA alternative, an ABAT (age 18+, high school diploma, 40 hours of approved coursework plus 15+ supervised hours, a 5% quarterly supervision requirement, passed competency exam). One honesty note on timing: the compliance deadline is currently suspended — HCPF\'s December 22, 2025 notice withdrew the December 12 deadline (which had itself replaced August 31) and promised a new date, while urging providers to reach full compliance now. Colorado has no state registry or license for technicians, so the requirement rides directly on the national certifications — and the BACB\'s own application already requires a criminal background check plus an abuse-registry check within 180 days of applying (the BACB does not require fingerprinting). For hiring pipelines, HB26-1425 (signed June 2, 2026) adds a one-time 45-day pre-certification billing window: Medicaid must reimburse for a not-yet-certified technician for at least 45 days while certification is pursued, but only after the tech clears a name-based judicial record check, completes all certification training, and completes abuse-and-neglect reporting training — the 45-day clock starts when those are done, the agency must submit quarterly technician rosters, and reimbursement requests must stop if certification isn\'t in hand by day 45. The law also protects titles: only techs holding a current, valid credential may be called "Registered Behavior Technician."',
          'Background screening now runs on three layers. Agency layer: Section 8.281.4 requires billing providers to complete ANNUAL background checks on every service provider they supervise — an ongoing employer obligation, not a hire-once event. Enrollment layer: HCPF\'s standard 42 CFR 455.434 screening imposes fingerprint-based checks on provider types designated high categorical risk and on any person with a 5%+ ownership or control interest in such a provider (the CY2026 federal institutional application fee is $750) — HCPF doesn\'t publish the risk category assigned to PBT Provider Types 83/84, so confirm whether enrollment-level fingerprinting applies with provider enrollment directly. Facility layer, center-based programs only: HB26-1425 makes ABA clinics CDHS-licensed day treatment facilities — license applications are due on or before August 1, 2026, and operating unlicensed becomes illegal August 1, 2027 — and the CDHS regime requires fingerprint-based CBI-plus-FBI checks on every applicant, owner, employee, newly hired employee, licensee, and adult 18+ residing in the clinic, screened against the C.R.S. 26-6-905(8) disqualifying offenses, plus a TRAILS check for confirmed child abuse or neglect findings; every new hire triggers a fresh investigation (with a portability exception for commonly owned clinics on a central records system). ABA delivered in homes, schools, or community settings is exempt from clinic licensure (C.R.S. 26-6-904(1)(e)), so this regime binds center-based operations only.',
          'On the supervisor side, Colorado has no behavior analyst license in force today — Medicaid qualifies billing providers through the Behavioral Therapy Provider Attestation (rev. September 2025), whose four tiers run from licensed doctoral clinicians down to BCBA/QASP certification, and Section 8.281.4 requires an approved attestation plus a clean record (no sanctions or discipline from the applicable licensing board or credentialing body), with asynchronous supervision explicitly non-covered. Under HB26-1425\'s Medicaid provisions, a reimbursable RBT must work under the supervision of a licensed psychologist, BCBA, BCBA-D, or BCaBA, and Section 8.281 imports the BACB floor — supervision on a minimum of 5% of service hours each calendar month — as a Medicaid condition. The licensure horizon: on July 1, 2028, mandatory state licensure arrives under a new Colorado Behavior Analyst Licensing Board in DORA — Licensed Behavior Analysts (BCBA, BCBA-D, or QBA certification plus a fingerprint-based CBI/FBI check at the applicant\'s cost) and Licensed Assistant Behavior Analysts (BCaBA or QASP-S, practicing only under LBA supervision) — with unlicensed practice a class 2 misdemeanor. The supervision ratio is left to board rulemaking (no numeric caseload cap in statute yet), so build the 2028 conversion into your credentialing roadmap now.',
        ],
        cites: [
          { title: 'HCPF Emergency Rule MSB 25-09-04-A — Section 8.281 (Oct 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Doc%2009%20MSB%2025-09-04-Av1%20Emergency%20-%20Oct%202025.pdf' },
          { title: 'HCPF Compliance Update — RBT Certification Requirement (Dec 22, 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Compliance%20Update%20%E2%80%93%20Registered%20Behavior%20Technician%20(RBT)%20Certification%20Requirement%20-%2012-22-2025.pdf' },
          { title: 'HB26-1425 — Applied Behavior Analysis Services (enacted bill text)', url: 'https://leg.colorado.gov/bill_files/116474/download' },
          { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
          { title: 'HCPF Provider Enrollment (fingerprint background check requirements & CY2026 fee)', url: 'https://hcpf.colorado.gov/provider-enrollment' },
        ],
      },
    ],
    collect: [
      { title: 'Which of the three pathways applies', desc: 'ASD diagnosis, functional interference (with a standardized assessment), or safety risk — no autism dx needed, so screen for all three instead of gating on diagnosis.' },
      { title: 'Comprehensive evaluation within 12 months', desc: 'A signed diagnostic evaluation by the child\'s physician, NP, or psychologist — the 12-month recency clock is the real document gate.' },
      { title: 'Referral source', desc: 'MD/DO, PA, NP, or Licensed Psychologist — the prescription/Plan of Care anchors the PAR.' },
      { title: 'School enrollment and IEP hours', desc: 'PM 25-005 requires school hour counts with EPSDT requests; 40 hrs/week clinic-based PBT won\'t be approved when school is available.' },
      { title: 'Home/community service settings', desc: 'EVV is mandatory outside the clinic — capture where sessions will happen so operations can stand up visit verification.' },
    ],
    sources: [
      { title: 'Pediatric Behavioral Therapies Billing Manual (HCPF)', url: 'https://hcpf.colorado.gov/pbt-manual' },
      { title: 'Health First Colorado Criteria for Behavioral Therapies (Feb 2023)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Health%20First%20Colorado%20Criteria%20for%20Behavioral%20Therapies%20February%202023.pdf' },
      { title: 'Pediatric Behavioral Therapies Information for Providers (HCPF)', url: 'https://hcpf.colorado.gov/pediatric-behavioral-therapies-information-providers' },
      { title: 'HCPF PM 25-005 — Pediatric Behavioral Therapy Policy Clarification', url: 'https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20PM%2025-005%20Pediatric%20Behavioral%20Therapy%20Policy%20Clarification.pdf' },
      { title: 'FY2025-26 Health First Colorado Fee Schedule (July 2025 v1.4)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/01_CO_Fee%20Schedule_Health%20First%20Colorado_07012025%20v1.4.xlsx' },
      { title: 'Special Provider Bulletin B2500528 — Rate Reductions (Sep 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Special%20Provider%20Bulletin%20-%20Rate%20Reductions%20092025_B2500528_0.pdf' },
      { title: 'HCPF — Accountable Care Collaborative Phase III', url: 'https://hcpf.colorado.gov/accphaseIII' },
      { title: 'HCPF Emergency Rule MSB 25-09-04-A — Section 8.281 (Oct 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Doc%2009%20MSB%2025-09-04-Av1%20Emergency%20-%20Oct%202025.pdf' },
      { title: 'HCPF Compliance Update — RBT Certification Requirement (Dec 22, 2025)', url: 'https://hcpf.colorado.gov/sites/hcpf/files/Compliance%20Update%20%E2%80%93%20Registered%20Behavior%20Technician%20(RBT)%20Certification%20Requirement%20-%2012-22-2025.pdf' },
      { title: 'HB26-1425 — Applied Behavior Analysis Services (enacted bill text)', url: 'https://leg.colorado.gov/bill_files/116474/download' },
      { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
      { title: 'HCPF Provider Enrollment (fingerprint background check requirements & CY2026 fee)', url: 'https://hcpf.colorado.gov/provider-enrollment' },
    ],
    faq: [
      { q: 'Does Colorado Medicaid require an autism diagnosis for ABA?', a: 'No — a genuine differentiator. The Criteria for Behavioral Therapies open the Pediatric Behavioral Therapies benefit on any of three pathways: a qualifying diagnosed condition (including but not limited to ASD), functional interference with home/school/community participation, or a safety risk to self or others. A signed comprehensive evaluation within the past 12 months is still required.' },
      { q: 'Do I submit Colorado ABA authorizations to the member\'s RAE?', a: 'No — PBT/ABA is a fee-for-service carve-out. Regardless of RAE region (RMHP, NHP, CCHA, or Colorado Access) or the Elevate MCO, all PARs go to the state UM vendor Acentra through the Atrezzo portal (ColoradoPAR.com), and claims go to the state fiscal agent.' },
      { q: 'Does the ABA assessment need prior authorization in Colorado?', a: 'Yes — unlike many states, ALL PBT services must be pre-approved in a PAR, including the 97151 assessment. Approved PARs run up to 6 months, so plan for reauthorization twice a year with charts-and-graphs progress data.' },
      { q: 'Can I bill 97156 parent training to Health First Colorado?', a: 'No — 97156 is not in the PBT allowable-code table and has no rate on the fee schedule. Caregiver training is a required element of the treatment plan, not a separately billable service.' },
      { q: 'What does Colorado Medicaid pay for ABA?', a: 'For dates of service on or after 10/1/2025: 97153 pays $17.20 and 97155 pays $25.80 per 15-minute unit (single rate per code, no credential tiers); 97151 pays a flat amount per assessment ($882.78 on the July 2025 schedule, before the October cut), once per 365 days. Group codes 97154/97158 were cut 23-48% in the same bulletin.' },
    ],
  },

  'aetna-colorado': {
    slug: 'aetna-colorado',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the C.R.S. § 10-16-104(1.4) mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Colorado',
    state: 'CO', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Colorado',
    h1: 'Aetna ABA coverage in Colorado: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Colorado: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Colorado families — the national clinical policy, prior authorization, the C.R.S. § 10-16-104(1.4) mandate (no age limits, no caps, exemptions), Colorado\'s coming behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Colorado, a Aetna card means three layers at once: the carrier\'s national clinical policy, Colorado\'s autism insurance mandate (C.R.S. § 10-16-104(1.4)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order. Note the contrast with Colorado Medicaid: Aetna\'s commercial policy requires an ASD diagnosis, while Health First Colorado does not — so a family that qualifies for Medicaid ABA without a diagnosis will still need one here.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'C.R.S. § 10-16-104(1.4) (originally SB 09-244)' },
      { label: 'Mandate age', value: 'No age limits in the current statute' },
      { label: 'Mandate caps', value: 'None — the historical $34K/$12K annual ABA caps were removed' },
      { label: 'Exempt from mandate', value: 'Short-term limited-duration; individual grandfathered; self-funded ERISA' },
      { label: 'Licensure', value: 'None yet (BCBA governs) — state license required 7/1/2028 per HB26-1425' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Colorado',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Colorado is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Colorado.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Colorado mandate: what it guarantees (and doesn\'t)',
        body: [
          'Colorado\'s mandate — C.R.S. § 10-16-104(1.4), originally 2009\'s SB 09-244 — is one of the stronger ones in our directory: it applies to all health benefit plans issued or renewed in Colorado except short-term limited-duration policies and individual grandfathered plans, carries no age limits, and carries no dollar caps — the historical $34,000/year (birth-8) and $12,000/year (9-18) ABA caps no longer appear in the current statute text, and carriers may not deny or restrict coverage because of an ASD diagnosis or utilization of mandated benefits. The statute also defines "autism services provider" with six qualification pathways reaching down to BACB Registered Behavior Technician. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA parity applies on top for plans covering mental-health benefits — the caps\' removal from the statute aligns the mandate with parity rather than fighting it.',
        ],
        cites: [
          { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
        ],
      },
      {
        h2: 'No Colorado-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Colorado-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That\'s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Colorado-specific answers come from, not a carrier document.',
        ],
        cites: [
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Colorado',
        body: [
          'Colorado currently requires no state license to practice behavior analysis — BCBA/BACB certification is the operative credential. That is changing: HB26-1425 (signed June 2, 2026) creates a Colorado Behavior Analyst Licensing Board under DORA\'s Division of Professions and Occupations, and on and after July 1, 2028 practicing ABA without a behavior analyst or assistant behavior analyst license becomes a class 2 misdemeanor; the law also mandates state licensure of ABA clinics. Practices should put the 2028 licensure conversion on their credentialing roadmap now. On rates: Aetna does not publish commercial ABA fee schedules for Colorado (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement; the Health First Colorado fee schedule (97153 at $17.20/unit for DOS 10/1/2025+) is the published in-state benchmark.',
        ],
        cites: [
          { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — required here even though Colorado Medicaid doesn\'t require one.' },
      { title: 'Age', desc: 'The Colorado mandate has no age limits — don\'t screen out older clients on age alone.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
      { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Colorado?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Colorado\'s mandate (C.R.S. § 10-16-104(1.4)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Colorado autism mandate require?', a: 'It applies to all Colorado-issued or renewed health benefit plans (short-term limited-duration and individual grandfathered plans excepted), with no age limits and no dollar caps — the historical $34K/$12K annual ABA caps were removed from the statute. Self-funded ERISA plans are exempt by preemption.' },
      { q: 'Does Aetna require an autism diagnosis for ABA in Colorado?', a: 'Yes — ASD only (F84.0-F84.9) per the national policy, unlike Health First Colorado, which opens its benefit without an autism diagnosis. If a family lacks a diagnosis and holds a commercial Aetna plan, the diagnostic evaluation comes first.' },
      { q: 'What does Aetna pay for ABA in Colorado?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Health First Colorado fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-colorado': {
    slug: 'cigna-colorado',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the C.R.S. § 10-16-104(1.4) mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Colorado',
    state: 'CO', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Colorado',
    h1: 'Cigna / Evernorth ABA coverage in Colorado: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Colorado: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Colorado families — the national clinical policy, prior authorization, the C.R.S. § 10-16-104(1.4) mandate (no age limits, no caps, exemptions), Colorado\'s coming behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Colorado, a Cigna card means three layers at once: the carrier\'s national clinical policy, Colorado\'s autism insurance mandate (C.R.S. § 10-16-104(1.4)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order. Note the contrast with Colorado Medicaid: Cigna\'s commercial policy requires an ASD diagnosis, while Health First Colorado does not — so a family that qualifies for Medicaid ABA without a diagnosis will still need one here.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'C.R.S. § 10-16-104(1.4) (originally SB 09-244)' },
      { label: 'Mandate age', value: 'No age limits in the current statute' },
      { label: 'Mandate caps', value: 'None — the historical $34K/$12K annual ABA caps were removed' },
      { label: 'Exempt from mandate', value: 'Short-term limited-duration; individual grandfathered; self-funded ERISA' },
      { label: 'Licensure', value: 'None yet (BCBA governs) — state license required 7/1/2028 per HB26-1425' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Colorado',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Colorado is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Colorado.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Colorado mandate: what it guarantees (and doesn\'t)',
        body: [
          'Colorado\'s mandate — C.R.S. § 10-16-104(1.4), originally 2009\'s SB 09-244 — is one of the stronger ones in our directory: it applies to all health benefit plans issued or renewed in Colorado except short-term limited-duration policies and individual grandfathered plans, carries no age limits, and carries no dollar caps — the historical $34,000/year (birth-8) and $12,000/year (9-18) ABA caps no longer appear in the current statute text, and carriers may not deny or restrict coverage because of an ASD diagnosis or utilization of mandated benefits. The statute also defines "autism services provider" with six qualification pathways reaching down to BACB Registered Behavior Technician. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA parity applies on top for plans covering mental-health benefits — the caps\' removal from the statute aligns the mandate with parity rather than fighting it.',
        ],
        cites: [
          { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
        ],
      },
      {
        h2: 'No Colorado carve-out found in EN0499',
        body: [
          'Unlike Virginia — where EN0499 explicitly does not apply to fully-insured business — we found no Colorado carve-out in the policy, so the national rules (including the no-assessment-PA fast path) should apply to Colorado members. One honesty note: the current EN0499 PDF could not be fully text-parsed to confirm the state-exceptions list with certainty, so treat "no Colorado carve-out" as high-confidence rather than absolute and confirm the assessment-PA answer on the benefits call before promising families a fast start.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Colorado',
        body: [
          'Colorado currently requires no state license to practice behavior analysis — BCBA/BACB certification is the operative credential. That is changing: HB26-1425 (signed June 2, 2026) creates a Colorado Behavior Analyst Licensing Board under DORA\'s Division of Professions and Occupations, and on and after July 1, 2028 practicing ABA without a behavior analyst or assistant behavior analyst license becomes a class 2 misdemeanor; the law also mandates state licensure of ABA clinics. Practices should put the 2028 licensure conversion on their credentialing roadmap now. On rates: Cigna does not publish commercial ABA fee schedules for Colorado (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement; the Health First Colorado fee schedule (97153 at $17.20/unit for DOS 10/1/2025+) is the published in-state benchmark.',
        ],
        cites: [
          { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — required here even though Colorado Medicaid doesn\'t require one.' },
      { title: 'Age', desc: 'The Colorado mandate has no age limits — don\'t screen out older clients on age alone.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
      { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Colorado?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Colorado\'s mandate (C.R.S. § 10-16-104(1.4)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does the ABA assessment need prior authorization with Cigna in Colorado?', a: 'Per the national EN0499 policy, no — assessment codes 97151, 97152, and 0362T need no PA, and we found no Colorado carve-out from that policy. Confirm on the benefits call, since the current policy PDF could not be fully parsed for the state-exceptions list.' },
      { q: 'What does the Colorado autism mandate require?', a: 'It applies to all Colorado-issued or renewed health benefit plans (short-term limited-duration and individual grandfathered plans excepted), with no age limits and no dollar caps — the historical $34K/$12K annual ABA caps were removed from the statute. Self-funded ERISA plans are exempt by preemption.' },
      { q: 'What does Cigna pay for ABA in Colorado?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Health First Colorado fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-colorado': {
    slug: 'unitedhealthcare-colorado',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the C.R.S. § 10-16-104(1.4) mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Colorado',
    state: 'CO', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Colorado',
    h1: 'UnitedHealthcare / Optum ABA coverage in Colorado: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Colorado: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Colorado families — the national clinical policy, prior authorization, the C.R.S. § 10-16-104(1.4) mandate (no age limits, no caps, exemptions), Colorado\'s coming behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Colorado, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Colorado\'s autism insurance mandate (C.R.S. § 10-16-104(1.4)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order. Note the contrast with Colorado Medicaid: Optum\'s policy requires a validated ASD diagnosis, while Health First Colorado does not — so a family that qualifies for Medicaid ABA without a diagnosis will still need one here.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'C.R.S. § 10-16-104(1.4) (originally SB 09-244)' },
      { label: 'Mandate age', value: 'No age limits in the current statute' },
      { label: 'Mandate caps', value: 'None — the historical $34K/$12K annual ABA caps were removed' },
      { label: 'Exempt from mandate', value: 'Short-term limited-duration; individual grandfathered; self-funded ERISA' },
      { label: 'Licensure', value: 'None yet (BCBA governs) — state license required 7/1/2028 per HB26-1425' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Colorado',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Colorado is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. Notably, Colorado has NO entry in Optum\'s ABA State Mandates supplemental criteria (effective January 2026) — there is no Colorado-specific Optum clinical overlay, so the national guideline plus the state mandate is the whole picture. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Colorado.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
          { title: 'Optum — ABA State Mandates supplemental criteria (eff. Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Colorado mandate: what it guarantees (and doesn\'t)',
        body: [
          'Colorado\'s mandate — C.R.S. § 10-16-104(1.4), originally 2009\'s SB 09-244 — is one of the stronger ones in our directory: it applies to all health benefit plans issued or renewed in Colorado except short-term limited-duration policies and individual grandfathered plans, carries no age limits, and carries no dollar caps — the historical $34,000/year (birth-8) and $12,000/year (9-18) ABA caps no longer appear in the current statute text, and carriers may not deny or restrict coverage because of an ASD diagnosis or utilization of mandated benefits. The statute also defines "autism services provider" with six qualification pathways reaching down to BACB Registered Behavior Technician. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA parity applies on top for plans covering mental-health benefits — the caps\' removal from the statute aligns the mandate with parity rather than fighting it.',
        ],
        cites: [
          { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Colorado: RMHP — but ABA bills the state',
        body: [
          'UnitedHealthcare\'s Medicaid footprint in Colorado runs through Rocky Mountain Health Plans (a UnitedHealthcare company) — RAE Region 1, the RMHP PRIME product, and RMHP CHP+. But unlike most states, that does not create a separate UHC Medicaid ABA process: ABA is a statewide fee-for-service carve-out from the RAE capitation, so RMHP does not authorize or pay ABA claims. A family on RMHP follows the Health First Colorado process — PAR via Acentra\'s Atrezzo portal, state fee schedule — covered in our Colorado Medicaid guide. Verify which line of business the card belongs to, then route Medicaid members to the state process, not a UHC portal.',
        ],
        cites: [
          { title: 'HCPF — Accountable Care Collaborative Phase III', url: 'https://hcpf.colorado.gov/accphaseIII' },
        ],
      },
      {
        h2: 'Licensure & rates in Colorado',
        body: [
          'Colorado currently requires no state license to practice behavior analysis — BCBA/BACB certification is the operative credential. That is changing: HB26-1425 (signed June 2, 2026) creates a Colorado Behavior Analyst Licensing Board under DORA\'s Division of Professions and Occupations, and on and after July 1, 2028 practicing ABA without a behavior analyst or assistant behavior analyst license becomes a class 2 misdemeanor; the law also mandates state licensure of ABA clinics. Practices should put the 2028 licensure conversion on their credentialing roadmap now. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Colorado (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement; the Health First Colorado fee schedule (97153 at $17.20/unit for DOS 10/1/2025+) is the published in-state benchmark.',
        ],
        cites: [
          { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. RMHP (UHC\'s Colorado Medicaid footprint) — RMHP members follow the state FFS ABA process, not this policy.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD diagnosis confirmed with a validated tool (ADI-R, ADOS-2, etc.) — Optum\'s bar is specific.' },
      { title: 'Age', desc: 'The Colorado mandate has no age limits — don\'t screen out older clients on age alone.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (eff. Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'C.R.S. § 10-16-104 (FindLaw, current through 1/1/2025)', url: 'https://codes.findlaw.com/co/title-10-insurance/co-rev-st-sect-10-16-104/' },
      { title: 'HB26-1425 — Applied Behavior Analysis Services (Colorado General Assembly)', url: 'https://leg.colorado.gov/bills/HB26-1425' },
      { title: 'HCPF — Accountable Care Collaborative Phase III', url: 'https://hcpf.colorado.gov/accphaseIII' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Colorado?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Colorado\'s mandate (C.R.S. § 10-16-104(1.4)) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'Does Optum have Colorado-specific ABA criteria?', a: 'No — Colorado has no entry in Optum\'s ABA State Mandates supplemental criteria (effective January 2026), so the national two-step authorization guideline plus the state mandate is the whole picture.' },
      { q: 'What if the family is on Rocky Mountain Health Plans (RMHP)?', a: 'RMHP is UnitedHealthcare\'s Colorado Medicaid footprint, but ABA is a state fee-for-service carve-out — RMHP does not authorize or pay ABA claims. Those members follow the Health First Colorado process (Acentra PAR, state fee schedule) in our Colorado Medicaid guide.' },
      { q: 'What does UnitedHealthcare pay for ABA in Colorado?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Health First Colorado fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },
};
