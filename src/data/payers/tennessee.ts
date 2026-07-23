import type { PayerConfig } from './types.js';

export const tennesseePayers: Record<string, PayerConfig> = {
  'tenncare-tennessee-medicaid': {
    slug: 'tenncare-tennessee-medicaid',
    cardDesc: 'Through age 21 via EPSDT, no annual limit, LBA licensure, one tri-MCO program.',
    assessmentPA: 'Required — Universal ABA Request Form ("Assessment Request") with diagnostic report + doctor\'s order, to the member\'s MCO',
    treatmentPA: 'Required — 6-month (26-week) authorization periods; continuation must report % of units used',
    dxRequired: 'ASD or another qualifying DSM-5-TR diagnosis \u2014 not strictly autism-only',
    payer: 'TennCare (Tennessee Medicaid)',
    state: 'TN', kind: 'state-medicaid',
    pill: 'Payer Guide · TennCare',
    h1: 'TennCare (Tennessee Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'TennCare ABA Coverage & Prior Authorization Guide | Carelu',
    metaDescription:
      'How TennCare (Tennessee Medicaid) covers ABA for autism under EPSDT — one unified tri-MCO program description and universal request form, prior authorization, LBA licensure, 6-month reviews, and why no ABA rates are published.',
    intro: [
      'TennCare, Tennessee\'s Medicaid program, covers ABA for children with autism through the EPSDT benefit — administered entirely through its three managed care organizations. Tennessee is a strong ABA-demand state, and unusually, its MCOs run one deliberately unified ABA program: since a 2024 tri-MCO workgroup (with TennCare and Vanderbilt TRIAD), BlueCare, UnitedHealthcare, and Wellpoint share a single program description and a single universal request form. The clinical rules are the same everywhere; what changes per plan is the submission mechanics — each MCO has its own guide below.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — through age 21, via EPSDT' },
      { label: 'Annual limit', value: 'No annual benefit limit; no fixed hour caps (hours justified by severity)' },
      { label: 'Prior auth', value: 'Required — one universal ABA request form across all three MCOs' },
      { label: 'Licensure', value: 'Direct ABA requires a TN Licensed Behavior Analyst (LBA)' },
      { label: 'Administered by', value: 'BlueCare, UnitedHealthcare Community Plan, Wellpoint (all MCO)' },
      { label: 'Rates', value: 'Not published — negotiated in each MCO\'s provider contracts' },
      { label: 'Staff screening', value: 'BACB checks for RBTs; LTSS/Katie Beckett staff: criminal check within 30 days pre-start + 6 registries, monthly SAM/LEIE/TTPL' },
    ],
    sections: [
      {
        h2: 'Coverage & benefit',
        body: [
          'Children on TennCare receive services through EPSDT, which requires coverage of medically necessary services — including ABA — for members under 21. There is no annual benefit limit on ABA under TennCare, and the unified MCO program sets no fixed weekly-hour cap either: requested hours are justified clinically using a severity/unit guide (levels 1–3 per domain), in 15-minute units. Covered ABA includes assessment, direct therapy, and parent/caregiver training.',
        ],
      },
      {
        h2: 'One program, three MCOs',
        body: [
          'TennCare and its three MCOs jointly issued a single "ABA Provider Requirements and Program Description" (2024) and a universal "Request for Applied Behavior Analysis" form carrying all three MCOs\' logos, fax numbers, and portals (current version January 2026). The shared baseline: an ASD or other qualifying DSM-5-TR diagnosis by a qualified professional with the diagnostic report and a doctor\'s order; direct ABA delivered by a Tennessee Licensed Behavior Analyst (LBA), with RBTs working under LBA authority; a treatment plan within 30 days of starting, reviewed every 6 months; and telehealth allowed per-code (flagged on the form) but treated cautiously.',
          'The operational tripwire intake should know from day one: continuation requests must report the percentage of authorized units actually used — utilization under 90% (on direct-treatment code 97153) requires a written explanation. Families whose real availability can\'t support the requested hours become a reauthorization problem six months later, so capture honest availability at intake.',
        ],
        cites: [
          { title: 'ABA Provider Requirements & Program Description — TennCare MCOs (rev. 06/2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf' },
          { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
          { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
        ],
      },
      {
        h2: 'Authorization & provider requirements',
        body: [
          'A licensed provider must prescribe the service, and coverage is always subject to medical necessity, with prior authorization required for both the assessment and treatment. Authorizations run in 6-month (26-week) periods; continuation requires documented progress against goals, current severity levels, requested hours per code, and parent-training (97156) volume. Tennessee requires that a BCBA or other qualified licensed clinician delivering direct ABA be licensed as a Licensed Behavior Analyst (LBA) through the Tennessee Applied Behavior Analyst Licensing Board. Because TennCare is entirely MCO-administered, capture which plan the family is on — it decides the portal, fax, forms, and timelines (see the per-MCO guides).',
        ],
        cites: [
          { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
        ],
      },
      {
        h2: 'Rates: negotiated, not published',
        body: [
          'Unlike most state Medicaid programs, TennCare publishes no ABA fee schedule — each "at-risk" MCO negotiates its own provider contracts and maintains its own rates. A February 2026 multistate comparison of Medicaid ABA reimbursement leaves every Tennessee cell blank for exactly this reason. For practices modeling TennCare revenue, the only source of truth is your own MCO contracts — and rate negotiation is a per-plan conversation, not a state lookup.',
        ],
        cites: [
          { title: 'CSG South — Comparison of Medicaid Reimbursement for ABA Individual Services (Feb 2026)', url: 'https://csgsouth.org/wp-content/uploads/HSPS-Converted-IR__Comparison-of-Medicaid-Reimbursement-for-ABA-Individual-Services.pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Tennessee does not license or register behavior technicians — the tri-MCO program description is the binding document, and it requires that RBTs and their supervising BCBAs "comply with ALL of the current BACB requirements for credentialing, ethics, competency, supervision, and maintenance of the RBT credential." Unlicensed staff deliver ABA under the extended authority and direction of a TN LBA and may not represent themselves as behavior analysts. So the BACB floor is the operative technician standard: 18+, high-school education, the 40-hour training and initial competency assessment (updated curriculum from January 2026), and — within 180 days of paying for the RBT application — a criminal background check plus an abuse-registry check "comparable to those required of home health aides, child care professionals, and teachers," attested by the RBT supervisor or employer. Tennessee sets no numeric supervision ratio of its own, so the BACB minimum governs: 5% of monthly service hours supervised, with two face-to-face contacts per month, at least one individual.',
          'State-mandated screening enters through TennCare\'s Aligned Background Check Protocol (effective July 1, 2024), and its scope matters: it formally binds LTSS providers — 1915(c) waiver, Katie Beckett, ECF CHOICES, and CHOICES. For those programs, every employee, subcontractor, or volunteer with direct member contact needs a Title 52-compliant criminal check (TBI fingerprint check, or a state-licensed private investigation company as an alternative; nationwide check if the hire has lived in TN a year or less) completed within 30 days before their first day of direct contact, plus six registry clearances: the TN Elderly/Vulnerable Abuse Registry, National Sex Offender Registry, SAM, OIG LEIE, the TennCare Terminated Provider List, and TN FOIL. A hit on the first five is automatically disqualifying; convictions and FOIL hits require a documented individualized assessment — blanket no-felony policies are prohibited. SAM, LEIE, and TTPL must then be rechecked monthly, and TennCare can recoup payments for services rendered by staff whose checks weren\'t compliant. An ABA agency serving only standard EPSDT members inherits employee screening chiefly through the BACB requirement and its MCO contract terms — but any agency serving Katie Beckett children falls squarely under the protocol, so most practices should simply run it for everyone.',
          'At the supervisor level, direct ABA requires a Tennessee Licensed Behavior Analyst (LBA) — a BCBA or BCBA-D credential is the qualification basis — through the Applied Behavior Analyst Licensing Committee. Application mechanics under the May 2025-revised Rules 1180-05: minimum age 21, a vendor-submitted criminal background check sent directly to the Committee, two good-moral-character letters, and fees of $50 (application), $40 (license), and $150 biennial renewal, which also requires proof of current BACB certification plus 3 CE hours on cultural diversity. Assistant-level LABAs (BCaBA-based) may practice only under LBA supervision, and practicing without a license draws $500–$1,000 civil penalties. One carve-out worth knowing: a licensed mental health clinician who can attest to BACB and MCO standards may provide direct ABA without an LBA license if practicing within a provider group, not independently. Each MCO also independently verifies BCBA credentials at network enrollment, requires an annual ABA quality-assurance attestation — and does not separately reimburse non-client-specific administrative supervision or technician training. The rules and program description publish no TB-test, CPR, or crisis-training mandate for ABA staff (only a crisis plan per BACB best practices); confirm any extra health-screening requirements with your MCO contract.',
        ],
        cites: [
          { title: 'ABA Provider Requirements & Program Description — TennCare MCOs (rev. 06/2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf' },
          { title: 'TennCare Aligned Background Check Protocol (eff. July 1, 2024)', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/AlignedBackgroundCheckProtocol.pdf' },
          { title: 'Rules of the TN Applied Behavior Analyst Licensing Committee, Ch. 1180-05 (rev. May 2025)', url: 'https://publications.tnsosfiles.com/rules/1180/1180-05.20250507.pdf' },
          { title: 'BACB — Meeting RBT Requirements During the 2026 Transition (updated 08/2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
          { title: 'BACB RBT Handbook', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230622-a.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'TennCare MCO', desc: 'BlueCare, UnitedHealthcare, or Wellpoint — clinically identical program, but the portal, fax, and mechanics differ per plan.' },
      { title: 'ASD diagnosis + report', desc: 'Diagnosis, diagnosing provider and credentials, date, and the diagnostic report — required with the universal request form.' },
      { title: 'Doctor\'s order', desc: 'The physician order or licensed treating provider\'s recommendation for ABA — required for the assessment PA.' },
      { title: 'LBA licensure', desc: 'Confirm the supervising/rendering analyst holds a Tennessee LBA license.' },
      { title: 'Realistic availability', desc: 'Continuations must explain utilization under 90% of authorized units — request hours the family can actually attend.' },
    ],
    sources: [
      { title: 'TennCare — official program site', url: 'https://www.tn.gov/tenncare.html' },
      { title: 'ABA Provider Requirements & Program Description — TennCare MCOs', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf' },
      { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
      { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
      { title: 'CSG South — Medicaid ABA reimbursement comparison (Feb 2026)', url: 'https://csgsouth.org/wp-content/uploads/HSPS-Converted-IR__Comparison-of-Medicaid-Reimbursement-for-ABA-Individual-Services.pdf' },
      { title: 'TennCare Aligned Background Check Protocol (eff. July 1, 2024)', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/AlignedBackgroundCheckProtocol.pdf' },
      { title: 'Rules of the TN Applied Behavior Analyst Licensing Committee, Ch. 1180-05 (rev. May 2025)', url: 'https://publications.tnsosfiles.com/rules/1180/1180-05.20250507.pdf' },
      { title: 'BACB — Meeting RBT Requirements During the 2026 Transition (updated 08/2025)', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
      { title: 'BACB RBT Handbook', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230622-a.pdf' },
    ],
    faq: [
      { q: 'Does TennCare cover ABA therapy?', a: 'Yes — for members up to age 21 through the EPSDT benefit, with no annual benefit limit and no fixed hour cap (hours are justified clinically). Coverage requires prior authorization and medical necessity, through the member\'s MCO.' },
      { q: 'Who can provide ABA under TennCare?', a: 'Direct ABA must be delivered by a BCBA or qualified licensed clinician who holds a Tennessee Licensed Behavior Analyst (LBA) license, with RBTs working under LBA authority.' },
      { q: 'Are TennCare\'s ABA rules different per MCO?', a: 'The clinical rules are deliberately unified — one shared program description and one universal request form across BlueCare, UnitedHealthcare, and Wellpoint. What differs is submission mechanics (portal, fax, forms, timelines) and UnitedHealthcare\'s additional Level of Care guidelines — see each MCO\'s guide.' },
      { q: 'What does TennCare pay for ABA?', a: 'TennCare publishes no ABA fee schedule — each MCO negotiates rates in its provider contracts. Your contract is the only source of truth on reimbursement.' },
    ],
  },

  'bluecare-tennessee': {
    slug: 'bluecare-tennessee',
    family: 'bcbst',
    cardDesc: 'Shared TennCare program via Availity/BCBST; 26-week auths, 14-day UM decisions.',
    assessmentPA: 'Required — Universal ABA Request Form (diagnostic report + doctor\'s order) via Availity or fax (800) 292-5311',
    treatmentPA: 'Required — 26-week periods; continuation shows progress, severity levels, and hours approved vs. used',
    dxRequired: 'ASD or another qualifying DSM-5-TR diagnosis \u2014 not strictly autism-only',
    payer: 'BlueCare Tennessee (BCBST)',
    state: 'TN', kind: 'medicaid-mco', parent: 'TennCare',
    pill: 'Payer Guide · BlueCare Tennessee',
    h1: 'BlueCare Tennessee ABA coverage (TennCare MCO).',
    metaTitle: 'BlueCare Tennessee (TennCare MCO) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How BlueCare Tennessee (BCBST) administers TennCare\'s ABA benefit — the shared tri-MCO program description, the universal request form via Availity, BlueCare\'s supplemental initiation/continuation form, and 14-day UM timelines.',
    intro: [
      'BlueCare Tennessee (including TennCareSelect), run by BlueCross BlueShield of Tennessee, administers the TennCare ABA benefit under the shared tri-MCO program description — so the clinical rules match the TennCare baseline exactly. What\'s BlueCare-specific is the machinery: Availity submission, BlueCare\'s own supplemental initiation/continuation form, dedicated fax lines, and a 14-day standard UM clock.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'TennCare MCO (BlueCross BlueShield of TN; incl. TennCareSelect)' },
      { label: 'Clinical rules', value: 'Shared tri-MCO ABA program description (TennCare baseline)' },
      { label: 'Prior auth', value: 'Required — universal form + BlueCare initiation/continuation form' },
      { label: 'Auth periods', value: '26 weeks / 6 months; continuation shows approved vs. used hours' },
      { label: 'UM timeline', value: 'Non-urgent decisions within 14 calendar days; retrospective within 30' },
      { label: 'Rates', value: 'Negotiated per contract — no published ABA fee schedule' },
    ],
    sections: [
      {
        h2: 'How BlueCare administers the benefit',
        body: [
          'Submissions run through Availity (or via provider.bcbst.com), with fax as the fallback — (800) 292-5311 for BlueCare/TennCareSelect and (800) 851-2491 for CoverKids. The assessment PA uses the universal tri-MCO request form with the diagnostic report and doctor\'s order attached; treatment requests add BlueCare\'s supplemental "Initiation and Continuation of ABA Therapy" form (rev. 2/26), which asks for the diagnosis with severity level (1–3), measurable progress, requested hours per week per code, and — at continuation — whether progress would hold if hours were reduced. UM questions go to the in-house behavioral team (BHABA@bcbst.com or (423) 535-5717, option 2).',
        ],
        cites: [
          { title: 'BlueCare — Initiation and Continuation of ABA Therapy form (rev. 2/26)', url: 'https://content.bcbst.com/api/public/content/aba_initiation_continuation_for_therapy.pdf' },
          { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
        ],
      },
      {
        h2: 'What\'s worth knowing at intake',
        body: [
          'Authorized ABA hours are not inclusive of other services — the form explicitly separates OT/PT — so map the family\'s full therapy schedule without fear of crowding out the ABA request. Non-urgent UM decisions land within 14 calendar days (retrospective reviews within 30), which is the number to set family expectations against. And like all TennCare MCOs, continuation requests must account for authorized-versus-used hours, making honest availability capture at intake a six-months-later safeguard.',
        ],
        cites: [
          { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'BlueCare vs. TennCareSelect vs. CoverKids', desc: 'Same BCBST machinery, different fax lines — confirm the exact program.' },
      { title: 'Diagnostic report + doctor\'s order', desc: 'Both attach to the universal form for the assessment PA.' },
      { title: 'Severity levels + requested hours by code', desc: 'BlueCare\'s supplemental form asks for severity (1–3) and hours/week per code.' },
      { title: 'Full therapy schedule', desc: 'ABA hours are counted separately from OT/PT — document everything.' },
    ],
    sources: [
      { title: 'BlueCare — Initiation and Continuation of ABA Therapy form (rev. 2/26)', url: 'https://content.bcbst.com/api/public/content/aba_initiation_continuation_for_therapy.pdf' },
      { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
      { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
    ],
    faq: [
      { q: 'Does BlueCare Tennessee cover ABA therapy?', a: 'Yes — BlueCare administers the TennCare ABA benefit under the shared tri-MCO program description: EPSDT members under 21, prior authorization on assessment and treatment, TN LBA licensure for direct ABA.' },
      { q: 'How do I submit an ABA prior authorization to BlueCare?', a: 'Through Availity (or provider.bcbst.com), or by fax to (800) 292-5311 for BlueCare/TennCareSelect — using the universal tri-MCO ABA request form, plus BlueCare\'s initiation/continuation form for treatment. Non-urgent decisions come within 14 calendar days.' },
      { q: 'Is BlueCare\'s ABA policy different from TennCare\'s?', a: 'Clinically, no — the rules are the shared TennCare baseline. The differences are mechanical: BlueCare\'s portal, fax lines, supplemental form, and UM timelines.' },
    ],
  },

  'unitedhealthcare-community-plan-tennessee': {
    slug: 'unitedhealthcare-community-plan-tennessee',
    family: 'unitedhealthcare',
    cardDesc: 'Shared TennCare baseline + UHC\'s own Level of Care rules: physician order, 20-hr gate.',
    assessmentPA: 'Required — universal form + comprehensive clinical evaluation AND a physician order recommending ABA',
    treatmentPA: 'Required — initial + concurrent review; no measurable progress over 3 months can end medical necessity',
    dxRequired: 'ASD or another qualifying DSM-5-TR diagnosis \u2014 not strictly autism-only',
    payer: 'UnitedHealthcare Community Plan of Tennessee',
    state: 'TN', kind: 'medicaid-mco', parent: 'TennCare',
    pill: 'Payer Guide · UHC Community Plan (TN)',
    h1: 'UnitedHealthcare Community Plan of Tennessee ABA coverage (TennCare MCO).',
    metaTitle: 'UnitedHealthcare Community Plan TN (TennCare) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers TennCare ABA — the shared tri-MCO program plus UHC\'s own Level of Care Guidelines: physician-order requirement, extra scrutiny above 20 hrs/week, telehealth limits, and 3-month progress rules.',
    intro: [
      'UnitedHealthcare Community Plan of Tennessee administers the TennCare ABA benefit under the shared tri-MCO program description — but unlike the other two MCOs, UHC layers its own Level of Care Guidelines (revised December 2024) on top. Those add real operational teeth: an explicit physician-order requirement, extra scrutiny for comprehensive programs above 20 hours/week, a device-attention test for telehealth ABA, and a three-month no-progress discharge rule. If a family carries UHC, plan the request against both documents.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'TennCare MCO (UnitedHealthcare / Optum platform)' },
      { label: 'Clinical rules', value: 'Shared tri-MCO program + UHC Level of Care Guidelines (12/2024)' },
      { label: 'Prior auth', value: 'Required — universal form via Provider Express, fax, or secure email' },
      { label: 'Physician order', value: 'Explicitly required for ABA initiation (strictest of the 3 MCOs)' },
      { label: 'Intensity gate', value: '>20 hrs/week comprehensive ABA gets extra scrutiny (severity 2–3, early in treatment)' },
      { label: 'Progress rule', value: 'No measurable change over 3 months of optimal treatment ends medical necessity' },
    ],
    sections: [
      {
        h2: 'The UHC overlay: what it adds to the TennCare baseline',
        body: [
          'UHC\'s Level of Care Guidelines require a comprehensive clinical evaluation by a Tennessee-licensed clinician and a physician order or script recommending ABA before initiation — the most explicit ordering requirement among the TennCare MCOs. Comprehensive programs above 20 hours/week "should generally only be considered" when the member has multiple needs, is within roughly the first two years of ABA, and presents at DSM-5 severity level 2–3; intensity must also leave room for rest, family time, and other activities. And maintenance-phase ABA must step down: lower intensity, caregiver-training-focused, not full-time.',
        ],
        cites: [
          { title: 'UHC — Level of Care Guidelines: Applied Behavior Analysis (rev. 12/13/2024)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-BH-Level-of-Care-Guidelines-Applied-Behavioral-Analysis.pdf' },
        ],
      },
      {
        h2: 'Authorization mechanics',
        body: [
          'Requests use the universal tri-MCO form, submitted via Provider Express, fax (877) 217-6068, or secure email (tn_medicaid_aba@uhc.com); the ABA line is (800) 690-1606. Authorization lengths are set per individual need (the universal form models 26-week periods), with reassessment at the end of each authorized period. Two rules to design intake around: caregiver training is required with a documented caregiver plan — refusal or non-participation is a discharge criterion — and direct telehealth ABA is only medically necessary when the member can attend to a device for an extended period.',
        ],
        cites: [
          { title: 'TN ABA Program Description (shared tri-MCO, UHC copy 6/2024)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-ABA-Program-Description.pdf' },
          { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Physician order for ABA', desc: 'UHC explicitly requires the order/script at initiation — chase it at intake, not at submission.' },
      { title: 'Comprehensive evaluation', desc: 'By a TN-licensed clinician; attach with the diagnostic report.' },
      { title: 'Severity level + time in ABA', desc: 'Requests above 20 hrs/week need severity 2–3 and early-in-treatment framing.' },
      { title: 'Caregiver participation commitment', desc: 'A documented caregiver plan is required; non-participation is a discharge criterion.' },
      { title: 'Telehealth suitability', desc: 'Direct telehealth ABA needs documented device-attention skills.' },
    ],
    sources: [
      { title: 'TN ABA Program Description (shared tri-MCO, UHC copy 6/2024)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-ABA-Program-Description.pdf' },
      { title: 'UHC — Level of Care Guidelines: ABA (rev. 12/13/2024)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-BH-Level-of-Care-Guidelines-Applied-Behavioral-Analysis.pdf' },
      { title: 'UHC TN Community Plan — behavioral health provider page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/tennessee-health-plans/tn-comm-plan-home/tn-cp-behavioral-health.html' },
      { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Tennessee cover ABA?', a: 'Yes — it administers the TennCare ABA benefit (EPSDT, under 21) under the shared tri-MCO program description, plus UHC\'s own Level of Care Guidelines with additional requirements like an explicit physician order.' },
      { q: 'How is UHC different from the other TennCare MCOs for ABA?', a: 'It\'s the only one with a distinct clinical overlay: physician-order requirement, extra scrutiny above 20 hours/week of comprehensive ABA, a device-attention test for telehealth, and a 3-month no-measurable-progress discharge rule.' },
      { q: 'How do I submit a UHC TennCare ABA authorization?', a: 'The universal tri-MCO ABA request form via Provider Express, fax (877) 217-6068, or secure email tn_medicaid_aba@uhc.com; ABA line (800) 690-1606.' },
    ],
  },

  'wellpoint-tennessee': {
    slug: 'wellpoint-tennessee',
    family: 'anthem',
    cardDesc: 'Shared TennCare program via Availity ICR; MD-order emphasis, <90% utilization rule.',
    assessmentPA: 'Required — universal form with MD order / treating-provider recommendation, via Availity or fax (866) 920-6006',
    treatmentPA: 'Required — 26-week periods; continuation reports unit utilization (<90% on 97153 needs explanation)',
    dxRequired: 'ASD or another qualifying DSM-5-TR diagnosis \u2014 not strictly autism-only',
    payer: 'Wellpoint Tennessee (formerly Amerigroup)',
    state: 'TN', kind: 'medicaid-mco', parent: 'TennCare',
    pill: 'Payer Guide · Wellpoint (TN)',
    h1: 'Wellpoint Tennessee ABA coverage (TennCare MCO).',
    metaTitle: 'Wellpoint Tennessee (TennCare MCO) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Wellpoint Tennessee (formerly Amerigroup) administers TennCare ABA — the shared tri-MCO program description, universal request form workflow in Availity, the MD-order requirement, and the sub-90% utilization explanation rule.',
    intro: [
      'Wellpoint Tennessee — the Elevance plan formerly branded Amerigroup — administers the TennCare ABA benefit under the shared tri-MCO program description it helped build (Wellpoint hosts the unified program documents). Clinically it\'s the TennCare baseline; the Wellpoint-specific layer is workflow: the Availity Interactive Care Reviewer submission path, its fax lines, an MD-order emphasis on assessment requests, and named regional ABA contacts.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'TennCare MCO (Wellpoint / Elevance, formerly Amerigroup)' },
      { label: 'Clinical rules', value: 'Shared tri-MCO ABA program description (TennCare baseline)' },
      { label: 'Prior auth', value: 'Required — universal form attached as "clinical" in Availity ICR' },
      { label: 'Assessment PA', value: 'MD order / licensed treating provider recommendation required' },
      { label: 'Utilization rule', value: 'Continuation must explain <90% use of authorized 97153 units' },
      { label: 'Rates', value: 'Negotiated per contract — no published ABA fee schedule' },
    ],
    sections: [
      {
        h2: 'How Wellpoint administers the benefit',
        body: [
          'Submissions go through Availity — Wellpoint\'s stated preferred workflow is to complete the universal tri-MCO ABA request form and attach it as the clinical documentation in the Interactive Care Reviewer; fax fallback is (866) 920-6006 (the form also lists (888) 881-6309). The assessment request needs an MD order or a licensed treating provider\'s recommendation. Treatment authorizations run in the standard 26-week periods, and continuation requests must report the percentage of authorized units used — under 90% on direct-treatment code 97153 requires a written explanation — plus the 97156 parent-training volume delivered.',
        ],
        cites: [
          { title: 'Universal Request for ABA form (TN-WP-CD-000947-25, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
          { title: 'ABA Provider Requirements & Program Description (Wellpoint copy, rev. 06/2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf' },
        ],
      },
      {
        h2: 'Contacts worth having on file',
        body: [
          'Wellpoint publishes named regional ABA contacts (West, Middle, and East Tennessee plus a statewide UM manager and behavioral-health liaison) with direct phones and emails in its tri-MCO update materials; provider services runs at (833) 731-2154. For an intake team, a saved contact sheet per region turns authorization questions from portal tickets into phone calls.',
        ],
        cites: [
          { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'MD order / provider recommendation', desc: 'Required on the assessment request — collect it with the diagnostic report.' },
      { title: 'Diagnosis + severity levels', desc: 'DSM-5-TR diagnosis with the severity/unit guide levels the universal form requests.' },
      { title: 'Realistic availability', desc: 'The <90% utilization explanation rule makes honest scheduling a reauthorization safeguard.' },
      { title: 'Parent-training capacity', desc: '97156 volume is reported at continuation — set caregiver expectations at intake.' },
    ],
    sources: [
      { title: 'ABA Provider Requirements & Program Description (Wellpoint copy, rev. 06/2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf' },
      { title: 'Universal Request for ABA form (Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
      { title: 'Tri-MCO ABA Overview of Updates (Sept 2024)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf' },
      { title: 'Wellpoint TN — ABA provider page', url: 'https://www.provider.wellpoint.com/tennessee-provider/patient-care/behavioral-health/applied-behavior-analysis' },
    ],
    faq: [
      { q: 'Does Wellpoint Tennessee cover ABA therapy?', a: 'Yes — Wellpoint (formerly Amerigroup) administers the TennCare ABA benefit under the shared tri-MCO program description: EPSDT members under 21, PA on assessment and treatment, TN LBA licensure.' },
      { q: 'How do I submit an ABA authorization to Wellpoint TN?', a: 'Complete the universal tri-MCO ABA request form and attach it as clinical documentation in Availity\'s Interactive Care Reviewer; fax fallback (866) 920-6006. The assessment request needs an MD order or treating-provider recommendation.' },
      { q: 'Is Wellpoint\'s ABA policy different from TennCare\'s?', a: 'Clinically, no — it\'s the shared TennCare baseline. The plan-specific layer is workflow: Availity ICR, fax lines, the MD-order emphasis, and the sub-90% unit-utilization explanation rule at continuation.' },
    ],
  },

  'tenncare-select': {
    slug: 'tenncare-select',
    family: 'bcbst',
    cardDesc: 'Statewide PIHP (VSHP) — separate contract from BlueCare; SSI kids, foster youth, IDD/CHOICES. 37,095 members.',
    assessmentPA: 'Required — shared tri-MCO universal ABA request form; submit via Availity (in-state) or Cohere (out-of-state)',
    treatmentPA: 'Required — 26-week (6-month) authorization periods; continuation reports severity level and hours used',
    dxRequired: 'ASD or another qualifying DSM-5-TR diagnosis — not strictly autism-only (shared TennCare baseline)',
    payer: 'TennCare Select',
    state: 'TN', kind: 'medicaid-mco', parent: 'TennCare',
    pill: 'Payer Guide · TennCare Select',
    h1: 'TennCare Select ABA coverage (TennCare\'s statewide PIHP).',
    metaTitle: 'TennCare Select ABA Coverage & Prior Auth Guide | Carelu',
    metaDescription:
      'How TennCare Select — the statewide PIHP run by Volunteer State Health Plan/BlueCare Tennessee for SSI children, foster youth, and IDD/CHOICES members — administers ABA: its own state contract, 37,095-member census, shared tri-MCO clinical rules, and Select-specific phone/fax lines.',
    intro: [
      'TennCare Select is not a fourth TennCare MCO alongside BlueCare, UnitedHealthcare Community Plan, and Wellpoint — it\'s a separate state contract. TennCare Select operates as a Prepaid Inpatient Health Plan (PIHP) under its own agreement between the Division of TennCare and Volunteer State Health Plan, Inc. (d/b/a BlueCare Tennessee) — a distinct Edison contract ID from BlueCare\'s own MCO contract, even though both are run by the same BlueCross BlueShield of Tennessee subsidiary. Members don\'t choose TennCare Select; TennCare assigns them to it because they fall into specific categories — children receiving SSI, children in DCS (foster care) custody, enrollees in intellectual-disability HCBS waivers, and a handful of statewide safety-net groups. For ABA, the clinical rules are the same shared tri-MCO program covered in our main TennCare guide — what\'s different here is the population TennCare Select serves and the phone/fax/contact structure built around it.',
    ],
    atGlance: [
      { label: 'Structure', value: 'Statewide PIHP — separate state contract from BlueCare\'s MCO contract, both run by VSHP/BCBST' },
      { label: 'Enrollment', value: '37,095 average monthly members (CY2024, TennCare\'s CMS-submitted MCPAR) — 2.5% of TennCare' },
      { label: 'Who\'s assigned here', value: 'SSI children, DCS custody/foster youth ("SelectKids"), IDD 1915(c)/CHOICES waiver members, out-of-state and safety-net enrollees' },
      { label: 'TennCare Select-only programs', value: 'SelectCommunity (IDD Target Population) and Katie Beckett Part A' },
      { label: 'ABA clinical rules', value: 'Shared tri-MCO program description — same as BlueCare, UHC, Wellpoint' },
      { label: 'Prior auth', value: 'Required — universal ABA request form via Availity or Cohere (out-of-state)' },
      { label: 'Provider Service Line', value: '1-800-276-1978 (distinct from BlueCare\'s 1-800-468-9736)' },
    ],
    sections: [
      {
        h2: 'A separate contract, the same clinical rules',
        body: [
          'The state\'s own contract text describes it plainly: "The Contractor shall operate under and market the services delivered via the prepaid Inpatient Health Plan (PIHP) as \'TennCare Select.\'" That PIHP agreement (Edison Contract ID 83332, term 1/1/2025–12/31/2027) is separate from BlueCare Tennessee\'s standard MCO contract, though both sit with Volunteer State Health Plan. BlueCare Tennessee\'s own Provider Administration Manual confirms the setup: "TennCareSelect is the State\'s self-insured TennCare Health Maintenance Organization... administered by BlueCare Tennessee... Enrollees cannot choose TennCareSelect as their TennCare MCO; TennCare members assigned to the TennCareSelect MCO must meet certain criteria and must be assigned to the TennCareSelect MCO by the Division of TennCare." For ABA specifically, the same PAM section covers both BlueCare and TennCareSelect members under one shared policy — the same CPT codes (97151–97155, 0362T, 0373T), the same RBT/BCaBA/BCBA billing structure, and the same tri-MCO baseline (26-week authorization periods, severity-level justification, no fixed annual hour cap) that governs the rest of TennCare. Practically: if a family is on TennCare Select, plan clinically exactly as you would for BlueCare — the differences that matter are contact numbers and, for a subset of members, LTSS-specific programs.',
        ],
        cites: [
          { title: 'TennCare (Volunteer State Health Plan d.b.a. BlueCare) Contract Amendment #1 (Edison ID 83332)', url: 'https://www.capitol.tn.gov/Archives/Joint/committees/fiscal-review/contracts/2025/05-21-25/28.%20TennCare%20(Volunteer%20State%20Health%20Plan%20d.b.a%20BlueCare)%20Amend%201%20Redacted.pdf' },
          { title: 'BlueCare Tennessee Provider Administration Manual', url: 'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf' },
        ],
      },
      {
        h2: 'Who ends up on TennCare Select',
        body: [
          'TennCare assigns — rather than lets members pick — enrollees who fall into defined categories: children under 21 who are SSI-eligible; children in DCS (foster care) custody and those transitioning out of custody (branded "SelectKids"); enrollees receiving services in an institution or an HCBS 1915(c) waiver for intellectual disabilities; enrollees living out-of-state; enrollees TennCare couldn\'t contact; and members of the "Integrated Health Services Delivery Model" target population for intellectual disabilities, branded "SelectCommunity" — largely 1915(c) waiver enrollees and former ICF/IID ("Arlington class") residents. TennCare Select is also the sole administrator of the Katie Beckett Program Part A (non-Medicaid-eligible-by-income children with significant disabilities up to 18). For an ABA intake team, the practical read is: TennCare Select skews toward higher-acuity, higher-support-need members — foster youth, IDD/CHOICES populations, and SSI kids — more than a random cross-section of TennCare.',
        ],
        cites: [
          { title: 'BlueCare Tennessee Provider Administration Manual', url: 'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf' },
        ],
      },
      {
        h2: 'Census: 37,095 members',
        body: [
          'TennCare\'s own Managed Care Program Annual Report (MCPAR), submitted to CMS on 6/29/2025 for reporting period CY2024, lists average monthly enrollment across TennCare\'s four managed-care products: Wellpoint Tennessee 438,735; BlueCare Tennessee 552,517; UnitedHealthcare Community Plan 439,049; and TennCare Select 37,095 — about 2.5% of statewide TennCare enrollment. That\'s the most current figure independently confirmed against a primary source; TennCare also publishes monthly enrollment spreadsheets that may carry a more current number, but those weren\'t retrievable during this review — treat 37,095 as the latest verified figure, not necessarily the latest available one.',
        ],
        cites: [
          { title: 'TennCare Managed Care Program Annual Report (MCPAR), CY2024', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/2025ManagedCareProgramAnnualReport.pdf' },
        ],
      },
      {
        h2: 'Submission mechanics and TennCare Select-specific contacts',
        body: [
          'ABA requests use the shared tri-MCO universal request form, submitted through Availity for in-state providers or Cohere for out-of-state providers; PA questions route to (423) 535-5717, option 2. Two BCBST-hosted ABA forms — an "ABA Therapy Services Assessment Request Form" and an "Initiation and Continuation of ABA Therapy Form" (the latter confirming the 26-week/6-month certification period and a severity-level 1–3 field) — surfaced in this review, consistent with the tri-MCO baseline, but neither form\'s text explicitly labels itself TennCare Select-specific versus a general BCBST form; confirm the exact required form with BlueCare/TennCare Select provider relations before submitting. What is confirmed distinct is the contact structure: TennCare Select runs its own Member Service Line (1-800-263-5479, vs. BlueCare\'s 1-800-468-9698), Provider Service Line (1-800-276-1978, vs. 1-800-468-9736), and Prior Auth phone (1-800-711-4104, vs. BlueCare\'s 1-888-423-0131) — though the PA fax (1-800-292-5311) is shared with BlueCare. SelectKids (the foster-care population) carries its own further layer: Provider/Family Services at 1-800-451-9147 (fax 1-800-330-2842) and Member Services at 1-888-422-2963. SelectCommunity (the IDD population) has its own line, 1-800-292-8196 (fax 1-888-255-9175).',
        ],
        cites: [
          { title: 'BlueCare Tennessee Provider Administration Manual (contact tables)', url: 'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf' },
          { title: 'BCBST — ABA Therapy Services Assessment Request Form', url: 'https://content.bcbst.com/api/public/content/aba_therapy_assessment_request_form.pdf' },
          { title: 'BCBST — Initiation and Continuation of ABA Therapy Form', url: 'https://content.bcbst.com/api/public/content/aba_initiation_continuation_for_therapy.pdf' },
        ],
      },
      {
        h2: 'CHOICES, ECF CHOICES, and background-check screening',
        body: [
          'TennCare Select is the exclusive administrator of SelectCommunity and Katie Beckett Part A, and shares CHOICES/ECF CHOICES LTSS administration with BlueCare — the MLTSS Provider Manual states plainly that "all BlueCare/TennCare Select billing guidelines apply" for these populations. That matters for staffing: TennCare\'s Aligned Background Check Protocol (effective July 1, 2024) governs providers serving 1915(c) waiver, Katie Beckett, Employment and Community First CHOICES, and CHOICES members — criminal background checks plus registry screening (TN Abuse Registry, National/TN Sex Offender Registry, LEIE, SAM, TennCare Terminated Provider List) within 30 days before first contact, monthly SAM/LEIE/TTPL rechecks. The protocol document itself refers generically to "Managed Care Organizations" rather than naming TennCare Select, but because TennCare Select administers exactly these programs, any ABA agency serving a TennCare Select family through SelectCommunity, ECF CHOICES, or Katie Beckett falls under it — the same guidance our main TennCare guide gives: if you serve Katie Beckett or CHOICES children, run the full protocol for everyone rather than trying to split by plan.',
        ],
        cites: [
          { title: 'MLTSS Provider Manual (BlueCare/TennCare Select)', url: 'https://content.bcbst.com/api/public/content/prov-mltss-manual.pdf' },
          { title: 'TennCare Aligned Background Check Protocol (eff. July 1, 2024)', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/AlignedBackgroundCheckProtocol.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Confirm TennCare Select vs. BlueCare', desc: 'Both are run by the same BCBST/VSHP entity — check the card or portal for which contract the member is actually on; contact numbers differ.' },
      { title: 'Program sub-type if applicable', desc: 'SelectKids (foster care), SelectCommunity (IDD/1915c), or Katie Beckett Part A each carry their own dedicated contact lines.' },
      { title: 'Diagnostic report + doctor\'s order', desc: 'Same shared tri-MCO baseline as BlueCare — required for the assessment PA.' },
      { title: 'LBA licensure', desc: 'Confirm the supervising/rendering analyst holds a Tennessee LBA license, per the shared TennCare program description.' },
      { title: 'Background-check applicability', desc: 'CHOICES/ECF CHOICES/Katie Beckett members trigger TennCare\'s Aligned Background Check Protocol — confirm program sub-type at intake.' },
    ],
    sources: [
      { title: 'TennCare (Volunteer State Health Plan d.b.a. BlueCare) Contract Amendment #1 (Edison ID 83332)', url: 'https://www.capitol.tn.gov/Archives/Joint/committees/fiscal-review/contracts/2025/05-21-25/28.%20TennCare%20(Volunteer%20State%20Health%20Plan%20d.b.a%20BlueCare)%20Amend%201%20Redacted.pdf' },
      { title: 'BlueCare Tennessee Provider Administration Manual', url: 'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf' },
      { title: 'TennCare Managed Care Program Annual Report (MCPAR), CY2024', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/2025ManagedCareProgramAnnualReport.pdf' },
      { title: 'MLTSS Provider Manual (BlueCare/TennCare Select)', url: 'https://content.bcbst.com/api/public/content/prov-mltss-manual.pdf' },
      { title: 'TennCare Aligned Background Check Protocol (eff. July 1, 2024)', url: 'https://www.tn.gov/content/dam/tn/tenncare/documents/AlignedBackgroundCheckProtocol.pdf' },
      { title: 'BCBST — ABA Therapy Services Assessment Request Form', url: 'https://content.bcbst.com/api/public/content/aba_therapy_assessment_request_form.pdf' },
      { title: 'BCBST — Initiation and Continuation of ABA Therapy Form', url: 'https://content.bcbst.com/api/public/content/aba_initiation_continuation_for_therapy.pdf' },
      { title: 'Universal Request for ABA form (all 3 MCOs, Jan 2026)', url: 'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf' },
    ],
    faq: [
      { q: 'Is TennCare Select the same as BlueCare Tennessee?', a: 'No — they\'re separate state contracts (different Edison contract IDs) even though both are administered by Volunteer State Health Plan, a BlueCross BlueShield of Tennessee subsidiary. Members are assigned to TennCare Select by the Division of TennCare, not chosen; contact numbers and some LTSS programs differ.' },
      { q: 'Who is on TennCare Select?', a: 'SSI-eligible children under 21, children in DCS foster-care custody ("SelectKids"), members in intellectual-disability HCBS waivers ("SelectCommunity"), Katie Beckett Part A children, and some out-of-state or safety-net enrollees — roughly 37,095 members statewide (CY2024 average).' },
      { q: 'Does TennCare Select cover ABA therapy?', a: 'Yes — the same shared tri-MCO ABA program that governs BlueCare, UnitedHealthcare Community Plan, and Wellpoint: EPSDT members under 21, prior authorization on assessment and treatment, TN Licensed Behavior Analyst licensure, 26-week authorization periods.' },
      { q: 'How do I submit an ABA prior authorization to TennCare Select?', a: 'The shared tri-MCO universal ABA request form, via Availity (Tennessee providers) or Cohere (out-of-state providers). TennCare Select\'s own Provider Service Line is 1-800-276-1978 and PA phone is 1-800-711-4104 — both distinct from BlueCare\'s numbers.' },
    ],
  },

  'aetna-tennessee': {
    slug: 'aetna-tennessee',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Tenn. Code Ann. § 56-7-2367 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes \u2014 ASD only (F84.0\u2013F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Tennessee',
    state: 'TN', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Tennessee',
    h1: 'Aetna ABA coverage in Tennessee: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Tennessee: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Tennessee families — the national clinical policy, prior authorization, the Tenn. Code Ann. § 56-7-2367 mandate (ages, caps, exemptions), Tennessee behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Tennessee, a Aetna card means three layers at once: the carrier\'s national clinical policy, Tennessee\'s autism insurance mandate (Tenn. Code Ann. § 56-7-2367), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Tenn. Code Ann. § 56-7-2367' },
      { label: 'Mandate age', value: 'Statute keyed to under-12 (parity-style, not an ABA mandate)' },
      { label: 'Mandate caps', value: 'No ABA-specific benefit — carrier policy governs' },
      { label: 'Exempt from mandate', value: 'Plans without neurological-disorder benefits; self-funded ERISA' },
      { label: 'Licensure', value: 'TN Licensed Behavior Analyst (Dept. of Health committee)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Tennessee',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Tennessee is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Tennessee.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Tennessee mandate: what it guarantees (and doesn\'t)',
        body: [
          'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. For insureds under 12, plans that cover neurological disorders must provide ASD benefits at least as comprehensive, with cost-sharing no more stringent; ABA is never named, and the statute explicitly doesn’t expand the type or scope of treatment beyond other neurological disorders. In practice, commercial ABA coverage in Tennessee rides on the carrier’s national medical policy and the plan document — which makes benefits verification, not the mandate, the load-bearing step. Self-funded ERISA plans are exempt where federal law preempts, and MHPAEA supplies the stronger parity floor for group plans.',
        ],
        cites: [
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
        ],
      },
      {
        h2: 'No Tennessee-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Tennessee-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Tennessee-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Tennessee',
        body: [
          'Tennessee requires the Licensed Behavior Analyst (LBA) credential under Tenn. Code Ann. §§ 63-11-301 through 63-11-311, administered by the Applied Behavior Analyst Licensing Committee at the Department of Health — the same licensure gate that governs TennCare work applies on the commercial side. On rates: Aetna does not publish commercial ABA fee schedules for Tennessee (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
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
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Tennessee?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Tennessee\'s mandate (Tenn. Code Ann. § 56-7-2367) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Tennessee autism mandate require?', a: 'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Tennessee?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Tennessee Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-tennessee': {
    slug: 'cigna-tennessee',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Tenn. Code Ann. § 56-7-2367 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes \u2014 ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Tennessee',
    state: 'TN', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Tennessee',
    h1: 'Cigna / Evernorth ABA coverage in Tennessee: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Tennessee: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Tennessee families — the national clinical policy, prior authorization, the Tenn. Code Ann. § 56-7-2367 mandate (ages, caps, exemptions), Tennessee behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Tennessee, a Cigna card means three layers at once: the carrier\'s national clinical policy, Tennessee\'s autism insurance mandate (Tenn. Code Ann. § 56-7-2367), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Tenn. Code Ann. § 56-7-2367' },
      { label: 'Mandate age', value: 'Statute keyed to under-12 (parity-style, not an ABA mandate)' },
      { label: 'Mandate caps', value: 'No ABA-specific benefit — carrier policy governs' },
      { label: 'Exempt from mandate', value: 'Plans without neurological-disorder benefits; self-funded ERISA' },
      { label: 'Licensure', value: 'TN Licensed Behavior Analyst (Dept. of Health committee)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Tennessee',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Tennessee is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Tennessee.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Tennessee mandate: what it guarantees (and doesn\'t)',
        body: [
          'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. For insureds under 12, plans that cover neurological disorders must provide ASD benefits at least as comprehensive, with cost-sharing no more stringent; ABA is never named, and the statute explicitly doesn’t expand the type or scope of treatment beyond other neurological disorders. In practice, commercial ABA coverage in Tennessee rides on the carrier’s national medical policy and the plan document — which makes benefits verification, not the mandate, the load-bearing step. Self-funded ERISA plans are exempt where federal law preempts, and MHPAEA supplies the stronger parity floor for group plans.',
        ],
        cites: [
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
        ],
      },
      {
        h2: 'No Tennessee-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no Tennessee-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Tennessee-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Tennessee',
        body: [
          'Tennessee requires the Licensed Behavior Analyst (LBA) credential under Tenn. Code Ann. §§ 63-11-301 through 63-11-311, administered by the Applied Behavior Analyst Licensing Committee at the Department of Health — the same licensure gate that governs TennCare work applies on the commercial side. On rates: Cigna does not publish commercial ABA fee schedules for Tennessee (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
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
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Tennessee?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Tennessee\'s mandate (Tenn. Code Ann. § 56-7-2367) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Tennessee autism mandate require?', a: 'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Tennessee?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Tennessee Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-tennessee': {
    slug: 'unitedhealthcare-tennessee',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Tenn. Code Ann. § 56-7-2367 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Tennessee',
    state: 'TN', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Tennessee',
    h1: 'UnitedHealthcare / Optum ABA coverage in Tennessee: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Tennessee: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Tennessee families — the national clinical policy, prior authorization, the Tenn. Code Ann. § 56-7-2367 mandate (ages, caps, exemptions), Tennessee behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Tennessee, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Tennessee\'s autism insurance mandate (Tenn. Code Ann. § 56-7-2367), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Tenn. Code Ann. § 56-7-2367' },
      { label: 'Mandate age', value: 'Statute keyed to under-12 (parity-style, not an ABA mandate)' },
      { label: 'Mandate caps', value: 'No ABA-specific benefit — carrier policy governs' },
      { label: 'Exempt from mandate', value: 'Plans without neurological-disorder benefits; self-funded ERISA' },
      { label: 'Licensure', value: 'TN Licensed Behavior Analyst (Dept. of Health committee)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Tennessee',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Tennessee is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Tennessee.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Tennessee mandate: what it guarantees (and doesn\'t)',
        body: [
          'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. For insureds under 12, plans that cover neurological disorders must provide ASD benefits at least as comprehensive, with cost-sharing no more stringent; ABA is never named, and the statute explicitly doesn’t expand the type or scope of treatment beyond other neurological disorders. In practice, commercial ABA coverage in Tennessee rides on the carrier’s national medical policy and the plan document — which makes benefits verification, not the mandate, the load-bearing step. Self-funded ERISA plans are exempt where federal law preempts, and MHPAEA supplies the stronger parity floor for group plans.',
        ],
        cites: [
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Tennessee',
        body: [
          'A family saying “we have UnitedHealthcare” in Tennessee may actually be on the carrier’s Medicaid plan — UnitedHealthcare Community Plan of Tennessee — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Tennessee',
        body: [
          'Tennessee requires the Licensed Behavior Analyst (LBA) credential under Tenn. Code Ann. §§ 63-11-301 through 63-11-311, administered by the Applied Behavior Analyst Licensing Committee at the Department of Health — the same licensure gate that governs TennCare work applies on the commercial side. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Tennessee (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Tennessee (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Tenn. Code Ann. § 56-7-2367 (autism/neurological parity)', url: 'https://codes.findlaw.com/tn/title-56-insurance/tn-code-sect-56-7-2367/' },
      { title: 'TN Dept. of Health — LBA application (T.C.A. §§ 63-11-301–311)', url: 'https://www.tn.gov/content/dam/tn/health/healthprofboards/behavior-analyst/LBA-Application.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Tennessee?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Tennessee\'s mandate (Tenn. Code Ann. § 56-7-2367) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Tennessee autism mandate require?', a: 'Tennessee’s statute is the weakest of the states we cover — it’s a parity rule, not an ABA mandate. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Tennessee?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Tennessee Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
