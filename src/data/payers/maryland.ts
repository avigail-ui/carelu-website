import type { PayerConfig } from './types.js';

export const marylandPayers: Record<string, PayerConfig> = {
  'maryland-medicaid': {
    slug: 'maryland-medicaid',
    cardDesc: 'EPSDT under 21, FFS via Carelon BHASO — the 9 HealthChoice MCOs never touch ABA.',
    assessmentPA: 'Required — ALL ABA services need prior authorization from Carelon (BHASO); a Comprehensive Diagnostic Evaluation with confirmed ASD must precede the 97151 assessment',
    treatmentPA: 'Required — authorizations valid a maximum of 180 days; reassessment + new PA every 180 days on the state Treatment Plan Template, via ProviderConnect',
    dxRequired: 'Yes — confirmed ASD (F84.0, F84.5, F84.8, F84.9) via a Comprehensive Diagnostic Evaluation by a QHCP',
    payer: 'Maryland Medicaid (Medical Assistance)',
    state: 'MD', kind: 'state-medicaid',
    pill: 'Payer Guide · Maryland Medicaid',
    h1: 'Maryland Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Maryland Medicaid ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Maryland Medicaid covers ABA under EPSDT — the fee-for-service carve-out run by Carelon Behavioral Health (not the HealthChoice MCOs), 180-day authorizations via ProviderConnect, the February 2026 fee schedule, and COMAR requirements.',
    intro: [
      'Maryland Medicaid covers ABA for children under 21 through the EPSDT benefit under COMAR 10.09.28 — and its structure is the simplest in our directory once you see it: there is exactly one pipeline. ABA (like all specialty behavioral health) is carved OUT of the nine HealthChoice MCOs and paid fee-for-service by the state through its Behavioral Health Administrative Services Organization (BHASO), Carelon Behavioral Health of Maryland. Whatever MCO card the family carries — Aetna Better Health, Priority Partners, Kaiser, UnitedHealthcare Community Plan — every authorization and every claim goes to Carelon, never to the plan. One credentialing path, one UM vendor, one statewide fee schedule (refreshed February 1, 2026), zero MCO variation.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21, via EPSDT (benefit since Jan 1, 2017)' },
      { label: 'Administered by', value: 'Carelon Behavioral Health (BHASO) — carved out of ALL nine HealthChoice MCOs' },
      { label: 'Prior auth', value: 'Required on every ABA service; auths valid max 180 days' },
      { label: 'Diagnosis', value: 'Confirmed ASD (F84.0/.5/.8/.9) via Comprehensive Diagnostic Evaluation by a QHCP' },
      { label: 'Diagnosis recency', value: 'No fixed expiry — but a Clinical Confirmation Form may be required, depending on age at diagnosis and time since' },
      { label: 'Rates (per 15 min, eff. 2/1/2026)', value: '97153: $24.41 BCBA · $20.91 BCaBA · $19.17 RBT/BT; 97151/97155: $38.34' },
      { label: 'Portals', value: 'Carelon ProviderConnect (auths) · Availity Essentials (claims)' },
      { label: 'Staff screening', value: 'CJIS background check for every enrolled individual (via ePREP) + OIG exclusion checks of all staff every 30 days' },
    ],
    sections: [
      {
        h2: 'The carve-out: the family\'s MCO card doesn\'t matter',
        body: [
          'The MDH ABA Provider Manual states it directly: ABA services are covered and reimbursed by the Medical Assistance fee-for-service program through its BHASO, Carelon Behavioral Health. MDH\'s HealthChoice pages say the same thing from the other side — specialty behavioral health is carved out of managed care, and the state pays providers directly. The practical consequences for intake: never route an ABA eligibility or authorization question to an MCO (Aetna Better Health, Priority Partners, MedStar, Wellpoint, or any of the nine); run benefits checks against Medicaid eligibility and Carelon, not the plan on the card; and expect parents to be confused by this — the MCO card is what they hold, but for ABA it\'s irrelevant. Providers enroll with Maryland Medicaid via ePREP and then register with the BHASO — that single path covers the whole state. (Carelon replaced Optum Maryland as the ASO; anything still pointing at Optum Maryland is stale.)',
        ],
        cites: [
          { title: 'MDH ABA Provider Manual (eff. Feb 1, 2026)', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
          { title: 'MDH HealthChoice — Behavioral Health Coverage (carve-out)', url: 'https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx' },
          { title: 'Carelon Behavioral Health of Maryland — ABA providers', url: 'https://maryland.carelonbh.com/aba-providers/' },
        ],
      },
      {
        h2: 'The authorization pipeline: CDE → assessment → 180-day cycles',
        body: [
          'All ABA services require prior authorization from the BHASO — the assessment included. The gate before everything is the Comprehensive Diagnostic Evaluation (CDE): a QHCP (developmental pediatrician, pediatrician, pediatric neurologist, child psychiatrist, clinical psychologist, neuropsychologist, or nurse practitioner) must complete a CDE with direct observation, caregiver interview, and developmental history, confirming the ASD diagnosis and referring for ABA. Only then can a psychologist, BCBA-D, or BCBA complete the 97151 assessment and treatment plan. Treatment authorizations run a maximum of 180 days; every cycle requires a reassessment (capped at 12 units / 3 hours per request unless more is justified) and a new PA on the state\'s Treatment Plan Template — biopsychosocial information, skill-acquisition goals, a behavior intervention plan, parent goals, and generalization, fading, discharge, and crisis plans. Requesting telehealth for 97155, 97156, or 97157 requires the Telehealth Readiness Checklist. Auths submit through Carelon\'s ProviderConnect; claims go through Availity Essentials; the ABA line is (800) 888-1965.',
          'Two documentation rules to design intake around: depending on the child\'s age at diagnosis and how long ago it was made, Carelon may require a Clinical Confirmation Form from a QHCP confirming the child still meets ASD criteria — so capture the diagnosis date, not just the diagnosis. And services must be home/community-based: clinic delivery needs individualized justification under COMAR 10.09.28.05C, participants over 6 are expected to be in school with an IEP, an RBT/BT may not serve as a 1:1 school aide, and school-based ABA is short-term and clinically justified only.',
        ],
        cites: [
          { title: 'MDH ABA Provider Manual (eff. Feb 1, 2026)', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
          { title: 'MDH Applied Behavior Analysis program page', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/pages/home.aspx' },
        ],
      },
      {
        h2: 'The February 2026 fee schedule (and what just changed)',
        body: [
          'The manual effective February 1, 2026 carries the current statewide fee schedule, tiered by credential per 15-minute unit: 97151 assessment pays $38.34 (psychologist/BCBA-D/BCBA, daily max 32 units); 97153 direct treatment pays $24.41 at the BCBA tier, $20.91 BCaBA, and $19.17 RBT/BT (daily max 32 units); 97155 protocol modification pays $38.34 (daily max 24 units, GT modifier for remote direction of a technician); and 97156 parent training pays $20.91 without the child present versus $38.34 with the child present, billed 97156-U2 (daily max 16 units). Also on the schedule: 97152 at $19.17, group codes 97154/97158, family-group 97157 at $12.91, and 0362T/0373T at $52.28.',
          'Two structural changes landed with this schedule. H2012 (ABA treatment planning) was discontinued effective February 1, 2026 — treatment planning folds into 97151 and care coordination into 97156, with existing H2012 auths honored through their end dates. And PT 42-26 (ABA Transmittal No. 8) loosened the combination-of-services rules effective January 1, 2026: ABA may now be billed same-date with other behavioral health services except 96156/96158/96159 and ECT, and Carelon is auto-reprocessing previously denied combination claims — if you ate those denials in 2025, watch for the reprocess.',
        ],
        cites: [
          { title: 'MDH ABA Provider Manual — fee schedule pp. 15–16 (eff. Feb 1, 2026)', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
          { title: 'PT 42-26 — ABA combination-of-service update + H2012 discontinuation', url: 'https://health.maryland.gov/mmcp/provider/Documents/transmittals/PT42-26_Updates_to_ABA_Combination_of_Service_Rules__and_Discontinuation_of_H2012.pdf' },
        ],
      },
      {
        h2: 'Workforce & billing rules worth knowing',
        body: [
          'Only ABA groups, psychologists, BCBA-Ds, and BCBAs can bill directly — BCaBAs, RBTs, and BTs render under them. Maryland has an unusual workforce on-ramp: Behavior Technicians can enroll in Medicaid before earning RBT certification (specialty code 325), with a 90-day grace period to submit RBT proof. Licensed psychologists may render and bill ABA with an attestation (40 coursework hours in behavior analysis plus 1,500 supervised hours including ASD experience). Supervision has a hard floor — direction of BCaBA/RBT/BT staff must equal at least 10% of technician direct-service hours, and remote direction requires MDH/BHASO approval. Telehealth (GT modifier) is allowed only for direct supervision, parent training, and group parent training — direct 97153 treatment is not on the telehealth list. And Maryland is a payment-in-full program: providers may not balance-bill participants for covered or denied services.',
        ],
        cites: [
          { title: 'MDH ABA Provider Manual (eff. Feb 1, 2026)', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Maryland\'s defining staffing rule: every individual who renders ABA — psychologist, BCBA-D, BCBA, BCaBA, RBT, and even not-yet-certified BTs — enrolls with Maryland Medicaid individually through ePREP, on top of the group\'s own enrollment. The technician floor is codified in state regulation, not just BACB policy: under COMAR 10.09.28.02, an RBT must be 18 or older, hold current BACB registration, hold a high school diploma or national equivalent (a copy attaches to the ePREP application), and work under a documented supervisory relationship with a licensed psychologist, licensed BCBA-D, or licensed BCBA. There is no separate Maryland RBT license or state technician registry — the binding credential is BACB certification plus individual Medicaid enrollment. The pre-certification BT on-ramp (specialty code 325, license number \'BT\', 90-day expiration) covered above has one hiring trap: the 90-day grace period attaches to the person, not your company — a BT who used part of it at a prior employer doesn\'t restart the clock with you. Underneath all of this sits the BACB\'s own floor: RBT applicants must pass a criminal background check and abuse-registry check within 180 days of paying for the certification application, confirmed by the RBT Supervisor or Requirements Coordinator, and effective January 1, 2026 the 40-hour training must follow the updated 2026 curriculum, delivered by active BCBAs/BCaBAs who\'ve completed the BACB\'s 8-hour supervision training.',
          'State screening runs through two instruments, and both are yours to manage. First, the CJIS criminal background check: COMAR 10.09.28.02 makes a completed Criminal Justice Information System background check a condition of participation for the group and each enrolled individual — it\'s completed as part of ePREP enrollment, using the CJIS Private Party Petition form from the Department of Public Safety and Correctional Services (DPSCS). There\'s no separate fingerprint clearance card system for ABA staff; fingerprint-based CHRC obligations attach to licensure applicants (behavior analysts), while unlicensed staff clear through Medicaid enrollment. Second, ongoing exclusion screening: the provider manual makes agencies responsible for OIG exclusion checks of ALL staff who touch the Medicaid program — direct service or administrative support — every 30 days, with documentation maintained; failure to screen is subject to disciplinary action. Enrolled providers must also be sanction-free — no current sanctions or disciplinary actions from licensing authorities, Medicare, Maryland Medical Assistance, or other federally funded programs.',
          'At the supervisor tier, Maryland has required licensure since January 2015: anyone practicing behavior analysis needs a Licensed Behavior Analyst (LBA) license from the Board of Professional Counselors and Therapists — current BCBA/BCBA-D certification, a master\'s or higher from a BACB-accredited/approved program, and a criminal history records check obtained before applying; the license renews every 2 years with a fresh CHRC at each renewal (and the board moves to online-only applications June 20, 2026). For Medicaid, supervisors need both the LBA license and current BACB certification (a licensed psychologist with the ABA attestation is the alternative). The supervision floors that bind your staffing model: direction of a technician (BCaBA/RBT/BT) must equal at least 10% of the technician\'s direct-service hours AND be performed in person at least 25% of the time (COMAR 10.09.28.04) — with remote direction requiring MDH or BHASO approval, and 0362T requiring the supervisor onsite. The BACB\'s 5%-monthly RBT supervision minimum (two face-to-face contacts, one individual) layers underneath. One structural mercy: because ABA runs through a single BHASO, there is no plan-by-plan credentialing — enroll each person via ePREP (applications reviewed by MDH, not the ASO), then register once with Carelon for ProviderConnect/Availity access; Carelon publishes no separate staff-credentialing standard beyond the state\'s, though it does require sentinel-event reporting (including any sexual activity between a staff member and a participant) within 24 hours.',
        ],
        cites: [
          { title: 'COMAR 10.09.28.02 — Provider Qualifications and Conditions for Participation', url: 'https://www.law.cornell.edu/regulations/maryland/COMAR-10-09-28-02' },
          { title: 'MDH ABA Provider Manual (eff. Feb 1, 2026)', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
          { title: 'COMAR 10.09.28.04 — Covered Services (direction of a technician)', url: 'http://mdrules.elaws.us/comar/10.09.28.04' },
          { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
          { title: 'COMAR 10.58.16.06 — Renewal (behavior analysts)', url: 'https://regs.maryland.gov/us/md/exec/comar/10.58.16.06' },
          { title: 'BACB RBT Handbook', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230622-a.pdf' },
          { title: 'BACB — RBT Requirements During the 2026 Transition (upd. 08/2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Medicaid eligibility — not the MCO', desc: 'Verify Medical Assistance eligibility and route everything to Carelon; the HealthChoice MCO on the card is irrelevant for ABA.' },
      { title: 'CDE report + referral', desc: 'The Comprehensive Diagnostic Evaluation by a QHCP, with the confirmed ASD code (F84.0/.5/.8/.9) and the referral for ABA.' },
      { title: 'Diagnosis date + child\'s age at diagnosis', desc: 'Determines whether Carelon will require a Clinical Confirmation Form before authorizing.' },
      { title: 'Home/community setting picture', desc: 'Services must be home/community-based — clinic delivery needs individualized COMAR justification; capture where care will actually happen.' },
      { title: 'School status (age 6+)', desc: 'Participants over 6 should be in school with an IEP; school-based ABA is short-term only and an RBT can\'t be a 1:1 aide.' },
    ],
    sources: [
      { title: 'MDH ABA Provider Manual (eff. Feb 1, 2026) — incl. fee schedule', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf' },
      { title: 'MDH Applied Behavior Analysis program page', url: 'https://health.maryland.gov/mmcp/epsdt/ABA/pages/home.aspx' },
      { title: 'PT 42-26 — ABA combination-of-service update + H2012 discontinuation', url: 'https://health.maryland.gov/mmcp/provider/Documents/transmittals/PT42-26_Updates_to_ABA_Combination_of_Service_Rules__and_Discontinuation_of_H2012.pdf' },
      { title: 'MDH HealthChoice — Behavioral Health Coverage (carve-out)', url: 'https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx' },
      { title: 'MDH HealthChoice home page', url: 'https://health.maryland.gov/mmcp/healthchoice/pages/home.aspx' },
      { title: 'Carelon Behavioral Health of Maryland — ABA providers', url: 'https://maryland.carelonbh.com/aba-providers/' },
      { title: 'COMAR 10.09.28.02 — Provider Qualifications and Conditions for Participation', url: 'https://www.law.cornell.edu/regulations/maryland/COMAR-10-09-28-02' },
      { title: 'COMAR 10.09.28.04 — Covered Services (direction of a technician)', url: 'http://mdrules.elaws.us/comar/10.09.28.04' },
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
      { title: 'COMAR 10.58.16.06 — Renewal (behavior analysts)', url: 'https://regs.maryland.gov/us/md/exec/comar/10.58.16.06' },
      { title: 'BACB RBT Handbook', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230622-a.pdf' },
      { title: 'BACB — RBT Requirements During the 2026 Transition (upd. 08/2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
    ],
    faq: [
      { q: 'Does Maryland Medicaid cover ABA therapy?', a: 'Yes — for children under 21 with a confirmed ASD diagnosis, under the EPSDT benefit (COMAR 10.09.28). Every ABA service requires prior authorization from Carelon Behavioral Health, the state\'s BHASO, with authorizations running up to 180 days.' },
      { q: 'Which Maryland Medicaid MCO should we contact for ABA?', a: 'None of them. ABA is carved out of all nine HealthChoice MCOs and paid fee-for-service through Carelon. Authorizations go through ProviderConnect, claims through Availity — the MCO on the family\'s card never touches ABA.' },
      { q: 'What does Maryland Medicaid pay for ABA?', a: 'Per the fee schedule effective February 1, 2026: 97153 direct treatment pays $24.41/15-min unit at the BCBA tier, $20.91 BCaBA, $19.17 RBT/BT; 97151 assessment and 97155 pay $38.34; 97156 parent training pays $20.91 without the child present or $38.34 with (billed 97156-U2).' },
      { q: 'Is an autism diagnosis required for Maryland Medicaid ABA?', a: 'Yes — a confirmed ASD diagnosis (F84.0, F84.5, F84.8, or F84.9) made through a Comprehensive Diagnostic Evaluation by a qualified health care provider, plus a referral. Depending on the child\'s age at diagnosis and time elapsed, a Clinical Confirmation Form may also be required.' },
    ],
  },

  'aetna-maryland': {
    slug: 'aetna-maryland',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + Maryland\'s habilitative-services mandate with 25/10-hr floors.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Maryland',
    state: 'MD', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Maryland',
    h1: 'Aetna ABA coverage in Maryland: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Maryland: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Maryland families — the national clinical policy, prior authorization, Maryland\'s habilitative services mandate (Md. Ins. § 15-835 + COMAR 31.10.39.03 with 25/10 hour floors), Maryland LBA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Maryland, an Aetna card means three layers at once: the carrier\'s national clinical policy, Maryland\'s habilitative-services mandate (Md. Code Ann., Insurance § 15-835, implemented by COMAR 31.10.39.03), and the plan\'s funding type deciding which of the two actually binds. Maryland\'s mandate is unusual — it carries hour FLOORS below which ABA can\'t be denied. This guide stacks the layers in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Md. Ins. § 15-835 + COMAR 31.10.39.03 (habilitative services)' },
      { label: 'Mandate age', value: 'Through at least the month the enrollee turns 19; hour floors span 18 months–18 years' },
      { label: 'Mandate floors', value: 'No denial solely on hours up to 25 hrs/wk (18 mo–5 yrs) or 10 hrs/wk (6–18); no dollar cap' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans; early-intervention/school-delivered services' },
      { label: 'Licensure', value: 'MD Licensed Behavior Analyst (Board of Professional Counselors & Therapists)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Maryland',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Maryland is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. One Maryland-specific caution: there are indications in Aetna\'s ABA materials that Maryland-regulated plans get distinct medical-necessity handling and that the standard ABA precert form may not apply to Maryland — we could not verify the primary documents, so confirm the correct Maryland submission path with Aetna or in Availity before filing rather than assuming the national form.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Maryland mandate: hour floors, not caps',
        body: [
          'Maryland has no standalone "autism mandate" — ABA is covered as a habilitative service for children with ASD under Insurance § 15-835, with the ABA-specific rules in COMAR 31.10.39.03 (effective April 3, 2014). The statute requires Maryland-regulated insurers, nonprofit health service plans, and HMOs to cover habilitative services until at least the end of the month the enrollee turns 19. The COMAR layer is where the teeth are: ABA may not be denied solely on the basis of prescribed hours up to 25 hours/week for ages 18 months through 5 years and up to 10 hours/week for ages 6 through 18 — with additional hours authorized when medically necessary — and ABA may not be denied as experimental or investigational. There is no dollar cap. The entry requirements: a comprehensive evaluation, a prescription with treatment goals from the PCP or a specialty physician, and annual review by the prescriber — so the prescription and its renewal date are intake data. Carriers aren\'t required to reimburse services delivered through early intervention or the schools, and self-funded ERISA plans are exempt — for those, MHPAEA parity is the fallback lever, and the hour floors don\'t apply.',
        ],
        cites: [
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
      { title: 'Optum BH803ABA State Mandates — quotes COMAR 31.10.39.03 criteria incl. the 25/10 hour floors', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'Aetna Medicaid in Maryland: the card that doesn\'t matter for ABA',
        body: [
          'A family saying "we have Aetna" in Maryland may be on Aetna Better Health of Maryland, a HealthChoice MCO — but unlike other states, that changes nothing for ABA. Maryland carves ABA (and all specialty behavioral health) out of the MCOs entirely: authorizations and claims go to Carelon Behavioral Health, the state\'s BHASO, under the Medicaid fee-for-service rules. If the card is Aetna Better Health, use our Maryland Medicaid guide and route everything to Carelon — Aetna\'s Medicaid plan never touches ABA.',
        ],
        cites: [
      { title: 'MDH HealthChoice — Behavioral Health Coverage (carve-out)', url: 'https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx' },
        ],
      },
      {
        h2: 'Licensure & rates in Maryland',
        body: [
          'Maryland has required licensure to practice behavior analysis since January 2015: the Licensed Behavior Analyst (LBA) credential, administered by the Behavior Analyst Advisory Committee of the State Board of Professional Counselors and Therapists (Health Occupations Title 17, Subtitle 6A; COMAR 10.58.16), built on current BACB certification, a qualifying master\'s degree, and a criminal-history check. The mandate\'s COMAR criteria likewise expect licensed delivery. On rates: Aetna does not publish commercial ABA fee schedules for Maryland (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Maryland\'s Medicaid fee schedule (effective February 1, 2026 — e.g., 97153 at $24.41/15-min BCBA tier) is the public benchmark to negotiate against.',
        ],
        cites: [
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate + hour floors apply) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial Aetna vs. Aetna Better Health of Maryland (Medicaid) — Medicaid ABA goes to Carelon, not Aetna at all.' },
      { title: 'ABA prescription + goals', desc: 'COMAR requires a prescription with treatment goals from the PCP or a specialty physician, reviewed annually — capture the prescriber and date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
      { title: 'Optum BH803ABA State Mandates — COMAR 31.10.39.03 criteria (corroborating text)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Maryland?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Maryland\'s habilitative-services mandate (Md. Ins. § 15-835 + COMAR 31.10.39.03) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Maryland mandate require for ABA?', a: 'For fully-insured plans: coverage of habilitative services through at least the month the enrollee turns 19, no denial of ABA solely on prescribed hours up to 25 hrs/week (ages 18 months–5) or 10 hrs/week (ages 6–18), no experimental/investigational denials, and no dollar cap — entered via a comprehensive evaluation plus a physician prescription reviewed annually.' },
      { q: 'What does Aetna pay for ABA in Maryland?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Maryland Medicaid\'s February 2026 fee schedule and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-maryland': {
    slug: 'cigna-maryland',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + Maryland\'s habilitative-services mandate with 25/10-hr floors.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Maryland',
    state: 'MD', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Maryland',
    h1: 'Cigna / Evernorth ABA coverage in Maryland: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Maryland: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Maryland families — the national clinical policy, prior authorization, Maryland\'s habilitative services mandate (Md. Ins. § 15-835 + COMAR 31.10.39.03 with 25/10 hour floors), Maryland LBA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Maryland, a Cigna card means three layers at once: the carrier\'s national clinical policy, Maryland\'s habilitative-services mandate (Md. Code Ann., Insurance § 15-835, implemented by COMAR 31.10.39.03), and the plan\'s funding type deciding which of the two actually binds. Maryland\'s mandate is unusual — it carries hour FLOORS below which ABA can\'t be denied. This guide stacks the layers in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Md. Ins. § 15-835 + COMAR 31.10.39.03 (habilitative services)' },
      { label: 'Mandate age', value: 'Through at least the month the enrollee turns 19; hour floors span 18 months–18 years' },
      { label: 'Mandate floors', value: 'No denial solely on hours up to 25 hrs/wk (18 mo–5 yrs) or 10 hrs/wk (6–18); no dollar cap' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans; early-intervention/school-delivered services' },
      { label: 'Licensure', value: 'MD Licensed Behavior Analyst (Board of Professional Counselors & Therapists)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Maryland',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Maryland is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Maryland.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Maryland mandate: hour floors, not caps',
        body: [
          'Maryland has no standalone "autism mandate" — ABA is covered as a habilitative service for children with ASD under Insurance § 15-835, with the ABA-specific rules in COMAR 31.10.39.03 (effective April 3, 2014). The statute requires Maryland-regulated insurers, nonprofit health service plans, and HMOs to cover habilitative services until at least the end of the month the enrollee turns 19. The COMAR layer is where the teeth are: ABA may not be denied solely on the basis of prescribed hours up to 25 hours/week for ages 18 months through 5 years and up to 10 hours/week for ages 6 through 18 — with additional hours authorized when medically necessary — and ABA may not be denied as experimental or investigational. There is no dollar cap. The entry requirements: a comprehensive evaluation, a prescription with treatment goals from the PCP or a specialty physician, and annual review by the prescriber — so the prescription and its renewal date are intake data. Carriers aren\'t required to reimburse services delivered through early intervention or the schools, and self-funded ERISA plans are exempt — for those, MHPAEA parity is the fallback lever, and the hour floors don\'t apply.',
        ],
        cites: [
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
      { title: 'Optum BH803ABA State Mandates — quotes COMAR 31.10.39.03 criteria incl. the 25/10 hour floors', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'No Maryland-specific Cigna policy exists',
        body: [
          'We checked the current EN0499 (effective May 15, 2026) in full: it contains no Maryland entry, carve-out, or state-specific exhibit — only the generic clause that a controlling federal or state coverage mandate supersedes the policy. So for fully-insured Cigna members in Maryland, the § 15-835 / COMAR 31.10.39 protections layer directly on top of the national policy without any Cigna-published Maryland supplement, and benefits verification (funding type, mandate applicability) is where Maryland-specific answers come from — not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Maryland',
        body: [
          'Maryland has required licensure to practice behavior analysis since January 2015: the Licensed Behavior Analyst (LBA) credential, administered by the Behavior Analyst Advisory Committee of the State Board of Professional Counselors and Therapists (Health Occupations Title 17, Subtitle 6A; COMAR 10.58.16), built on current BACB certification, a qualifying master\'s degree, and a criminal-history check. The mandate\'s COMAR criteria likewise expect licensed delivery. On rates: Cigna does not publish commercial ABA fee schedules for Maryland (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Maryland\'s Medicaid fee schedule (effective February 1, 2026 — e.g., 97153 at $24.41/15-min BCBA tier) is the public benchmark to negotiate against.',
        ],
        cites: [
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate + hour floors apply) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'ABA prescription + goals', desc: 'COMAR requires a prescription with treatment goals from the PCP or a specialty physician, reviewed annually — capture the prescriber and date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
      { title: 'Optum BH803ABA State Mandates — COMAR 31.10.39.03 criteria (corroborating text)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Maryland?', a: 'Yes — under the carrier\'s national policy for ASD (EN0499, with no PA on assessment codes), layered on Maryland\'s habilitative-services mandate for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Maryland mandate require for ABA?', a: 'For fully-insured plans: coverage of habilitative services through at least the month the enrollee turns 19, no denial of ABA solely on prescribed hours up to 25 hrs/week (ages 18 months–5) or 10 hrs/week (ages 6–18), no experimental/investigational denials, and no dollar cap — entered via a comprehensive evaluation plus a physician prescription reviewed annually.' },
      { q: 'What does Cigna pay for ABA in Maryland?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Maryland Medicaid\'s February 2026 fee schedule and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-maryland': {
    slug: 'unitedhealthcare-maryland',
    family: 'unitedhealthcare',
    cardDesc: 'Optum BH803ABASCC + a published Maryland State Mandates entry adopting the COMAR 25/10-hr floors.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Maryland',
    state: 'MD', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Maryland',
    h1: 'UnitedHealthcare / Optum ABA coverage in Maryland: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Maryland: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Maryland families — the national clinical policy, prior authorization, Optum\'s published Maryland state-mandate criteria (COMAR 31.10.39.03 with 25/10 hour floors), Maryland LBA licensure, and what intake should verify.',
    intro: [
      'For an intake team in Maryland, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Maryland\'s habilitative-services mandate (Md. Code Ann., Insurance § 15-835, implemented by COMAR 31.10.39.03), and the plan\'s funding type deciding which of the two actually binds. UnitedHealthcare is the carrier that makes the Maryland layer easiest to enforce: Optum publishes a Maryland entry in its ABA State Mandates criteria that adopts the COMAR rules — hour floors included — for fully-insured plans. This guide stacks the layers in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Md. Ins. § 15-835 + COMAR 31.10.39.03 (habilitative services)' },
      { label: 'Mandate age', value: 'Through at least the month the enrollee turns 19; hour floors span 18 months–18 years' },
      { label: 'Mandate floors', value: 'No denial solely on hours up to 25 hrs/wk (18 mo–5 yrs) or 10 hrs/wk (6–18); no dollar cap' },
      { label: 'Optum MD criteria', value: 'Published — BH803ABA State Mandates applies COMAR 31.10.39.03 to MD fully-insured plans' },
      { label: 'Licensure', value: 'MD Licensed Behavior Analyst (Board of Professional Counselors & Therapists)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Maryland',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in Maryland is the legal floor underneath it: the state mandate governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Maryland.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'Optum\'s Maryland-specific criteria: COMAR, in the carrier\'s own document',
        body: [
          'Maryland has its own entry in Optum\'s ABA State Mandates supplemental criteria (BH803ABA): for fully-insured policies in Maryland, Optum directs reviewers to use the COMAR 31.10.39.03 criteria (April 3, 2014) in place of its standard medical-necessity rules. The document reproduces the Maryland requirements — comprehensive evaluation, physician prescription with treatment goals and annual prescriber review, the no-denial floors of 25 hours/week for ages 18 months–5 years and 10 hours/week for ages 6–18 (with more when medically necessary), school allowed as a service location (though not as an IEP/IDEA obligation), licensed delivery, and the rule that ABA may not be denied as experimental. Once the mandated benefits are exhausted, Optum reverts to its standard medical-necessity policy. For intake, this is leverage: on a fully-insured UHC plan, an hours reduction below the floors contradicts the carrier\'s own published criteria — cite the state-mandates document, not just the regulation.',
        ],
        cites: [
      { title: 'Optum BH803ABA — ABA State Mandates supplemental criteria (Maryland entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Maryland mandate underneath',
        body: [
          'The legal base: Maryland has no standalone autism mandate — ABA rides on the habilitative-services mandate, Insurance § 15-835, which requires Maryland-regulated insurers, nonprofit health service plans, and HMOs to cover habilitative services until at least the end of the month the enrollee turns 19, with the ABA-specific medical-necessity rules delegated to the Insurance Commissioner\'s regulation, COMAR 31.10.39.03. Carriers aren\'t required to reimburse services delivered through early intervention or the schools, and self-funded ERISA plans are exempt — for those members the Optum Maryland entry doesn\'t apply either, and MHPAEA parity is the fallback lever.',
        ],
        cites: [
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Maryland: the card that doesn\'t matter for ABA',
        body: [
          'A family saying "we have UnitedHealthcare" in Maryland may be on UnitedHealthcare Community Plan, a HealthChoice MCO — but that changes nothing for ABA. Maryland carves ABA out of the MCOs entirely: authorizations and claims go to Carelon Behavioral Health, the state\'s BHASO, under the Medicaid fee-for-service rules — use our Maryland Medicaid guide. One historical wrinkle worth knowing: Optum Maryland was the state\'s previous behavioral-health ASO before Carelon took over, so legacy Optum-branded Maryland ABA manuals still circulate — they are stale; Carelon\'s ProviderConnect is the current pipeline.',
        ],
        cites: [
      { title: 'MDH HealthChoice — Behavioral Health Coverage (carve-out)', url: 'https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx' },
      { title: 'MDH HealthChoice MCO Comparison Chart (UHC Community Plan roster entry)', url: 'https://health.maryland.gov/mmcp/healthchoice/Documents/hc-mco-comparison-chart.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Maryland',
        body: [
          'Maryland has required licensure to practice behavior analysis since January 2015: the Licensed Behavior Analyst (LBA) credential, administered by the Behavior Analyst Advisory Committee of the State Board of Professional Counselors and Therapists (Health Occupations Title 17, Subtitle 6A; COMAR 10.58.16), built on current BACB certification, a qualifying master\'s degree, and a criminal-history check. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Maryland (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Maryland\'s Medicaid fee schedule (effective February 1, 2026 — e.g., 97153 at $24.41/15-min BCBA tier) is the public benchmark to negotiate against.',
        ],
        cites: [
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (COMAR floors + Optum\'s MD criteria apply) vs. self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial UHC vs. UnitedHealthcare Community Plan (Medicaid) — Medicaid ABA goes to Carelon, not UHC/Optum at all.' },
      { title: 'ABA prescription + goals', desc: 'COMAR requires a prescription with treatment goals from the PCP or a specialty physician, reviewed annually — capture the prescriber and date.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report + testing', desc: 'DSM-5-TR ASD diagnosis confirmed with a validated tool (ADI-R, ADOS-2, etc.) — Optum asks for the instrument.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum BH803ABA — ABA State Mandates supplemental criteria (Maryland entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'Md. Insurance Article § 15-835 (Maryland General Assembly)', url: 'https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gin&section=15-835&enactments=false' },
      { title: 'MDH HealthChoice — Behavioral Health Coverage (carve-out)', url: 'https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx' },
      { title: 'MDH Board of Professional Counselors & Therapists — Behavior Analyst License', url: 'https://health.maryland.gov/bopc/pages/analysts.aspx' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Maryland?', a: 'Yes — under Optum\'s national two-step authorization policy for ASD, and for fully-insured Maryland plans Optum\'s own State Mandates document applies the COMAR 31.10.39.03 criteria, including the 25 and 10 hour/week no-denial floors. Self-funded employer plans follow the standard national policy instead.' },
      { q: 'What does the Maryland mandate require for ABA?', a: 'For fully-insured plans: habilitative-services coverage through at least the month the enrollee turns 19, no denial of ABA solely on prescribed hours up to 25 hrs/week (ages 18 months–5) or 10 hrs/week (ages 6–18), no experimental/investigational denials, and no dollar cap — entered via a comprehensive evaluation plus a physician prescription reviewed annually. Optum reproduces these criteria in its own published document.' },
      { q: 'What does UnitedHealthcare pay for ABA in Maryland?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Maryland Medicaid\'s February 2026 fee schedule and treat rate-setting as part of contracting.' },
    ],
  },
};
