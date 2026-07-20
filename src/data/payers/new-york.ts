import type { PayerConfig } from './types';

export const newYorkPayers: Record<string, PayerConfig> = {
  'new-york-medicaid': {
    slug: 'new-york-medicaid',
    cardDesc: 'Under 21, ASD/Rett; FFS has NO prior auth (referral only) — but most kids sit in MCOs that do.',
    assessmentPA: 'FFS: NO prior authorization — the gate is a practitioner referral (valid ≤2 years). MMC plans set their own PA, and every major plan requires it',
    treatmentPA: 'FFS: none stated — referral-gated, with treatment-plan updates every 6 months. MMC: each plan runs its own assessment + treatment PA',
    dxRequired: 'Yes — under 21 with ASD (DSM-5) and/or Rett syndrome (F84.0, F84.2); not available for adults 21+ or other diagnoses',
    payer: 'New York Medicaid (NYS DOH / eMedNY)',
    state: 'NY', kind: 'state-medicaid',
    pill: 'Payer Guide · New York Medicaid',
    h1: 'New York Medicaid ABA coverage: the intake guide.',
    metaTitle: 'New York Medicaid ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How NYS Medicaid covers ABA — no prior authorization at the fee-for-service layer (a 2-year practitioner referral is the gate), the 2023 managed-care carve-in where every major plan does require PA, the phased 25% cut to 97153, LBA-only billing, and the 5% supervision rule.',
    intro: [
      'New York Medicaid covers ABA for members under 21 with autism spectrum disorder or Rett syndrome — a young benefit (first billable in 2021, nine years after the state\'s commercial mandate) with a split personality. At the fee-for-service layer, administered through eMedNY, there is no prior authorization at all: the entire front door is a practitioner referral valid for up to two years. But since January 1, 2023 the benefit is carved into every mainstream Medicaid Managed Care plan, most children sit in one of those ~13 plans, and every major plan does impose its own prior authorization. In practice, "does this family need a PA?" is answered by which card they carry — which makes plan identification the first intake question in New York.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21, ASD (DSM-5) and/or Rett syndrome; no waiver pathway, no adult coverage' },
      { label: 'FFS prior auth', value: 'NONE — a practitioner referral (valid ≤2 years) is the only gate' },
      { label: 'MMC prior auth', value: 'Plan-by-plan — all major MCOs require PA (see the per-plan guides)' },
      { label: 'Diagnosis recency', value: 'Referral valid no more than 2 years (the state\'s de facto recency rule)' },
      { label: 'Rates (per 15 min)', value: '97153: $14.45 (eff. 4/1/2026, after a phased 25% cut) · 97151/97155/97156: $19.26' },
      { label: 'Licensure', value: 'NYSED Licensed Behavior Analyst (LBA) — only LBAs enroll and bill' },
      { label: 'Settings', value: 'Home, clinic, community — NOT reimbursable in schools' },
    ],
    sections: [
      {
        h2: 'The FFS front door: a referral, not a prior authorization',
        body: [
          'Nothing in the current FFS ABA Policy Manual (updated October 1, 2025) requires prior authorization or prior approval — for the assessment or for treatment. The gate is a referral from a NYS-licensed and NYS Medicaid-enrolled physician, psychologist, psychiatric nurse practitioner, pediatric nurse practitioner, or physician assistant (LBAs cannot diagnose or self-refer). The referral is valid for no more than 2 years and must carry a specific payload: the member\'s age, the ASD and/or Rett diagnosis with date of initial diagnosis, co-morbid diagnoses, severity level, a statement of need for ABA, and the DSM-5 Diagnostic Checklist. Once services start, the treatment plan must be updated at least every 6 months and shared with the referring provider. For intake, that means a complete referral packet is the whole authorization battle on FFS — chase its required elements at first contact, because an incomplete referral is the only thing standing between the family and a booked assessment.',
          'One forward-looking caveat: the Governor\'s FY 2026-27 Executive Budget proposed an ABA "Centers of Excellence" designation framework whose criteria were still undefined as of mid-2026 — watch for a new front-end gate on this benefit.',
        ],
        cites: [
          { title: 'eMedNY ABA Provider Policy Manual (updated Oct 1, 2025)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
          { title: 'Acuity News — NY Medicaid ABA rates 2026 & Centers of Excellence proposal', url: 'https://acuity.news/regulation/new-york-medicaid-aba-reimbursement-rate-reduction-2026/' },
        ],
      },
      {
        h2: 'The 2023 carve-in: where most families actually are',
        body: [
          'Effective January 1, 2023, ABA was carved into the mainstream Medicaid Managed Care benefit package — and since most children are enrolled in MMC, most New York ABA runs through a plan, not through eMedNY. The state\'s own manual is blunt about what that means: providers serving an MMC member "must contact the MMC member\'s specific MMC plan for coverage, billing, and reimbursement guidance." Unlike the FFS layer, every major plan imposes prior authorization, each with its own machinery — Fidelis\'s Centene-style clinical policy, UnitedHealthcare\'s Optum portal, Anthem\'s Availity form, Healthfirst, MetroPlus, EmblemHealth, and Molina all have dedicated guides below.',
          'Beyond the seven plans we profile, the carve-in also runs through the regional upstate plans per the eMedNY directory (v2026-2, April 1, 2026): Excellus BCBS (Central NY, Rochester, Southern Tier), MVP Health Plan and CDPHP (Capital Region and Hudson Valley), and Independent Health and Highmark Western & Northeastern NY (Western NY), plus the HIV-SNPs (Amida Care, MetroPlus Partnership) and HARP variants. We haven\'t profiled those individually — expect near-state-baseline clinical criteria but verify each plan\'s PA process directly. One trap: Aetna Better Health appears in the NY directory only as a Partial LTC (MLTC) plan — it is not a mainstream children\'s Medicaid plan and not an ABA payer in NY Medicaid.',
        ],
        cites: [
          { title: 'eMedNY — Information for All Providers, Managed Care Information (plan directory v2026-2)', url: 'https://www.emedny.org/providermanuals/allproviders/pdfs/information_for_all_providers_managed_care_information.pdf' },
          { title: 'eMedNY ABA Provider Policy Manual (updated Oct 1, 2025)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
      {
        h2: 'Rates: a single statewide schedule — and a 25% cut to 97153',
        body: [
          'The FFS fee schedule is flat: one statewide rate per code, no credential tiers, no modifiers, no geographic variation. Assessment (97151) and the QHP codes (97155 protocol modification, 97156 family guidance) pay $19.26 per 15-minute unit; group codes 97154/97157/97158 pay $3.31 per unit per member. The story is 97153, technician-delivered direct treatment — the volume code of every ABA practice. The FY 2025-26 enacted budget authorized a phased 25% cut applied only to 97153: $19.26 → $16.85 effective October 1, 2025 → $14.45 effective April 1, 2026. A NYSABA/CASP survey reported 74% of Medicaid ABA providers would leave the program if the second tranche took effect; the FY 2026-27 Executive Budget nonetheless layered on roughly $28.5M in further cuts. Two modeling notes: MMC plans negotiate their own rates (the state schedule is the FFS reference, not binding on plans), and any margin model built on pre-cut 97153 rates is now ~25% wrong.',
        ],
        cites: [
          { title: 'NYS Medicaid ABA Fee Schedule (effective April 1, 2026)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Fee_Schedule.xls' },
          { title: 'NYS Medicaid Update, August 2025 (Vol 41 No 8) — 97153 rate reduction', url: 'https://health.ny.gov/health_care/medicaid/program/update/2025/no08_2025-08.htm' },
          { title: 'Acuity News — NY Medicaid ABA rate reduction 2026', url: 'https://acuity.news/regulation/new-york-medicaid-aba-reimbursement-rate-reduction-2026/' },
        ],
      },
      {
        h2: 'Licensure, supervision, and the operational rules',
        body: [
          'New York is one of the strictest licensure states in the country: only NYSED Licensed Behavior Analysts (LBAs) can enroll in Medicaid and bill — a BCBA credential alone is not sufficient. Certified Behavior Analyst Assistants (CBAAs) enroll as non-billing (OPRA) providers and bill through their supervising LBA, and unlicensed technicians may deliver scripted 97153 sessions billed under the LBA\'s NPI. Effective October 1, 2025, that supervision has teeth: LBAs must supervise unlicensed technicians for at least 5% of the technician\'s service hours each calendar month, with at least 2 face-to-face real-time contacts per month (one observing service delivery), and no LBA may supervise more than 6 CBAAs/unlicensed individuals at a time — rules that apply to FFS and MMC alike, and that turn supervision capacity into a hard cap on census. Other operational rules worth wiring into intake: ABA is not reimbursable in a school setting (home, clinic, and community are fine); records must be kept at least 6 years and, for minors, until the patient turns 22 (10 years for MMC providers); and ABA-via-telehealth was under formal state evidence review in mid-2025 — supervision of technicians may already occur via synchronous audio/video.',
        ],
        cites: [
          { title: 'NYS Medicaid Update, August 2025 (Vol 41 No 8) — supervision requirements', url: 'https://health.ny.gov/health_care/medicaid/program/update/2025/no08_2025-08.htm' },
          { title: 'eMedNY ABA Provider Policy Manual (updated Oct 1, 2025)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'FFS or which MMC plan', desc: 'The single fact that decides whether there\'s a PA at all — get the card, not the family\'s guess.' },
      { title: 'Complete referral packet', desc: 'From a licensed, Medicaid-enrolled physician/psychologist/NP/PA: dx + initial dx date, co-morbidities, severity, statement of need, DSM-5 checklist. Referral ≤2 years old.' },
      { title: 'Age and diagnosis', desc: 'Under 21 with ASD and/or Rett only — 21st-birthday proximity is a coverage cliff to flag early.' },
      { title: 'Service setting', desc: 'Home, clinic, or community — school-based delivery is not reimbursable.' },
      { title: 'Supervising LBA capacity', desc: 'The 5%/2-contact/6-supervisee rules make LBA bandwidth a scheduling constraint from day one.' },
    ],
    sources: [
      { title: 'eMedNY ABA Provider Policy Manual (updated Oct 1, 2025)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
      { title: 'NYS Medicaid ABA Fee Schedule (effective April 1, 2026)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Fee_Schedule.xls' },
      { title: 'NYS Medicaid Update, August 2025 (Vol 41 No 8)', url: 'https://health.ny.gov/health_care/medicaid/program/update/2025/no08_2025-08.htm' },
      { title: 'eMedNY — Managed Care Information plan directory (v2026-2, 4/1/2026)', url: 'https://www.emedny.org/providermanuals/allproviders/pdfs/information_for_all_providers_managed_care_information.pdf' },
      { title: 'Acuity News — NY Medicaid ABA rates 2026 (secondary; cross-checked against primary sources)', url: 'https://acuity.news/regulation/new-york-medicaid-aba-reimbursement-rate-reduction-2026/' },
    ],
    faq: [
      { q: 'Does New York Medicaid require prior authorization for ABA?', a: 'At the fee-for-service layer, no — the current FFS policy manual contains no PA requirement; the gate is a practitioner referral valid up to 2 years. But most children are in Medicaid Managed Care, and every major MMC plan does require prior authorization under its own process.' },
      { q: 'Who qualifies for ABA under NY Medicaid?', a: 'Members under 21 with ASD as defined by DSM-5 and/or Rett syndrome, referred by a NYS-licensed, Medicaid-enrolled physician, psychologist, psychiatric NP, pediatric NP, or PA. Adults 21+ and non-ASD/Rett diagnoses are not covered.' },
      { q: 'What does NY Medicaid pay for ABA?', a: 'A single statewide rate per code: $19.26 per 15-minute unit for 97151/97155/97156, and $14.45 for technician-delivered 97153 as of April 1, 2026 — after a phased 25% cut from $19.26. MMC plans negotiate their own rates.' },
      { q: 'Can a BCBA bill NY Medicaid for ABA?', a: 'Not on the BCBA credential alone — New York requires NYSED licensure as a Licensed Behavior Analyst (LBA) to enroll and bill. CBAAs enroll as non-billing providers under a supervising LBA.' },
    ],
  },

  'fidelis-care-new-york': {
    slug: 'fidelis-care-new-york',
    family: 'centene',
    cardDesc: 'Largest NY plan; full Centene-style policy: named instruments, graphs, 6-month reauth cycle.',
    assessmentPA: 'Authorization-based — a behavioral assessment must be completed before requesting treatment; the diagnostic evaluation must be within 2 years of the auth request',
    treatmentPA: 'Required — FBA and/or named skill assessment with graphs; 6-month treatment-plan updates; monthly session notes per authorized code at concurrent review',
    dxRequired: 'Yes — under 21, ASD/Rett per the state baseline (Fidelis also lists F84.3); initial requests need a validated diagnostic tool within 60 months',
    payer: 'Fidelis Care New York (Centene)',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · Fidelis Care (NY)',
    h1: 'Fidelis Care New York ABA coverage (Medicaid Managed Care).',
    metaTitle: 'Fidelis Care New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Fidelis Care — New York\'s largest Medicaid plan — authorizes ABA: the Centene-derived clinical policy, named assessment instruments with graphs, the 60-month diagnostic recency rule, 6-month reauthorization cycles, and the school-setting bar.',
    intro: [
      'Fidelis Care, the Centene-owned plan and largest Medicaid plan in New York, is the clearest illustration of the state\'s FFS-versus-MMC split: while the state FFS layer needs only a referral, Fidelis layers a full Centene-style clinical policy (FC.CP.BH.301.04) on the state baseline — named assessment instruments, graphed data requirements, a 6-month reauthorization cycle, and heavy concurrent-review documentation. Eligibility mirrors the state (under 21, ASD/Rett, 2-year referral), but the authorization work is entirely Fidelis\'s own.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (Centene) — the largest Medicaid plan in NY' },
      { label: 'Clinical rules', value: 'Fidelis clinical policy FC.CP.BH.301.04 + ABA Provider Tip Sheet (01/2026)' },
      { label: 'Diagnosis recency', value: 'Validated diagnostic tool within 60 months for initial requests; dx evaluation within 2 years of the auth request' },
      { label: 'Reauth cycle', value: 'Updated treatment plan every 6 months; Medical Director may tighten review frequency' },
      { label: 'Intensity model', value: 'Focused ABA (10–25 hrs/wk) vs. Comprehensive (30–40 hrs/wk) — no hard cap, hours justified' },
      { label: 'Claims', value: 'Due within 90 days of date of service' },
    ],
    sections: [
      {
        h2: 'The Centene-style overlay: instruments, graphs, and the 6-month cycle',
        body: [
          'A behavioral assessment by a BCBA/LBA-equivalent must be completed before treatment is requested, and the treatment request must show results from at least one specified functional behavior assessment (descriptive FBA, traditional FA, or IISCA) and/or a named skill assessment — VB-MAPP, ABLLS-R, AFLS, PEAK, SSIS, EFL, or Socially Savvy; a Vineland alone is explicitly insufficient — with graphs and tables attached. Concurrent reviews are the heaviest in the state: updated graphs and goal-grid performance, one session note per month for each authorized CPT code (including supervision and family-guidance notes), an updated assessment scoring grid, an updated treatment plan, and a signed visit attestation. Treatment plans update every 6 months, and the Medical Director may adjust review frequency. The policy also frames intensity as Focused (10–25 hrs/week) versus Comprehensive (30–40 hrs/week), requires hours be justified against age, school attendance, and daily activities, and expects discharge when there\'s no measurable improvement for 6+ months without a reasonable expectation that a revised plan would help.',
        ],
        cites: [
          { title: 'Fidelis ABA Clinical Policy FC.CP.BH.301.04', url: 'https://www.fideliscare.org/Portals/0/Providers/Applied-Behavior-Analysis-Policy-FC.BH.301.04.pdf' },
        ],
      },
      {
        h2: 'The recency rules — and the waitlist workaround',
        body: [
          'Fidelis runs two clocks: the diagnostic evaluation supporting the request must be within 2 years of the authorization request, and initial requests need a DSM-5 diagnosis made with a validated assessment tool administered within the past 60 months (not required for continuing services). That instrument requirement is stricter than the state\'s referral rule; the 60-month window is looser in time. The plan also offers a genuine waitlist workaround: if a diagnostic assessment can\'t be obtained within 6 months of the request, Fidelis will accept a letter of confirmation from a NYS-licensed qualified professional to start services — but only if the member is in, or recently was in, ABA. For intake, that letter can be the difference between starting now and losing a family to a diagnostic waitlist.',
        ],
        cites: [
          { title: 'Fidelis ABA Clinical Policy FC.CP.BH.301.04', url: 'https://www.fideliscare.org/Portals/0/Providers/Applied-Behavior-Analysis-Policy-FC.BH.301.04.pdf' },
          { title: 'Fidelis ABA Provider Tip Sheet (01/01/2026)', url: 'https://www.fideliscare.org/Portals/0/Providers/TipSheets/ABA-Provider-Tip-Sheet.pdf' },
        ],
      },
      {
        h2: 'Settings, credentialing, and claims mechanics',
        body: [
          'No ABA in school settings since September 1, 2023 — and for treatment during school hours, providers must first contact the local Committee on Special Education for an independent evaluation, so a school-hours request is a coordination project, not a form field. Every ABA practitioner must complete both Fidelis credentialing and MMIS Medicaid enrollment before serving members, and claims are due within 90 days of the date of service — a short window that punishes slow authorization cleanup. Requests run through the Fidelis Provider Portal at fideliscare.org, with the ABA form on the Provider Policies page. Rates are negotiated per contract; whether Fidelis pays the state fee schedule is not published.',
        ],
        cites: [
          { title: 'Fidelis ABA Provider Tip Sheet (01/01/2026)', url: 'https://www.fideliscare.org/Portals/0/Providers/TipSheets/ABA-Provider-Tip-Sheet.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnostic evaluation + dates', desc: 'Two clocks: dx evaluation within 2 years of the request; validated diagnostic tool within 60 months for initial requests.' },
      { title: 'Assessment instrument data', desc: 'A named FBA and/or skill assessment (VB-MAPP, ABLLS-R, etc.) with graphs — Vineland alone bounces.' },
      { title: 'School schedule', desc: 'No school-setting ABA; school-hours treatment requires CSE contact first — capture the school picture at intake.' },
      { title: 'Credentialing + MMIS status', desc: 'Both must be complete before serving Fidelis members — confirm before quoting start dates.' },
      { title: 'Waitlist-workaround eligibility', desc: 'If no diagnostic slot within 6 months and the member is in/recently in ABA, pursue the letter of confirmation.' },
    ],
    sources: [
      { title: 'Fidelis ABA Clinical Policy FC.CP.BH.301.04', url: 'https://www.fideliscare.org/Portals/0/Providers/Applied-Behavior-Analysis-Policy-FC.BH.301.04.pdf' },
      { title: 'Fidelis ABA Provider Tip Sheet (01/01/2026)', url: 'https://www.fideliscare.org/Portals/0/Providers/TipSheets/ABA-Provider-Tip-Sheet.pdf' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does Fidelis Care cover ABA therapy?', a: 'Yes — for NY Medicaid members under 21 with ASD or Rett syndrome, under its own Centene-derived clinical policy: assessment completed first, treatment authorized with named instruments and graphed data, and 6-month reauthorization cycles.' },
      { q: 'How recent does the autism diagnosis need to be for Fidelis?', a: 'Initial requests need a DSM-5 diagnosis using a validated assessment tool administered within the past 60 months, and the supporting diagnostic evaluation must be within 2 years of the authorization request. Continuing services don\'t re-trigger the instrument rule.' },
      { q: 'Can ABA be delivered in schools for Fidelis members?', a: 'No — Fidelis stopped covering school-setting ABA September 1, 2023. For treatment during school hours, contact the local Committee on Special Education for an independent evaluation first.' },
    ],
  },

  'unitedhealthcare-community-plan-new-york': {
    slug: 'unitedhealthcare-community-plan-new-york',
    family: 'unitedhealthcare',
    cardDesc: 'State-baseline clinical criteria, but ALL ABA services are PA-gated through Optum\'s Provider Express.',
    assessmentPA: 'Required — "all ABA services require prior authorization"; assessment auth via the online ABA request on providerexpress.com',
    treatmentPA: 'Required — via Provider Express or the Autism Care Advocate; claims deny without an auth on file, and additional units need a new PA',
    dxRequired: 'Yes — state baseline: under 21, ASD/Rett per DSM-5, with the 2-year practitioner referral incl. the DSM-5 checklist',
    payer: 'UnitedHealthcare Community Plan of New York',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · UHC Community Plan (NY)',
    h1: 'UnitedHealthcare Community Plan of New York ABA coverage (Medicaid Managed Care).',
    metaTitle: 'UHC Community Plan New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers NY Medicaid ABA — Optum/United Behavioral Health of New York UM, universal prior authorization via providerexpress.com, state-deferent clinical criteria, and telehealth rules for supervision and caregiver training.',
    intro: [
      'UnitedHealthcare Community Plan of New York hands its ABA benefit to Optum (United Behavioral Health of New York, I.P.A., Inc.) — and Optum\'s orientation for the plan says it plainly: all ABA services require prior authorization. The clinical criteria underneath are deliberately state-deferent — Optum\'s New York Medicaid entry in its national State Mandates document copies the state\'s eligibility and referral rules essentially verbatim — so the work at this plan isn\'t arguing medical necessity against a foreign standard; it\'s running the state\'s own rules through Optum\'s PA machinery on providerexpress.com.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC + HARP (United HealthCare of NY, Inc.)' },
      { label: 'UM vendor', value: 'Optum — United Behavioral Health of New York, I.P.A., Inc.' },
      { label: 'Prior auth', value: 'Required on ALL ABA services — assessment and treatment alike' },
      { label: 'Portal', value: 'providerexpress.com (online ABA requests; auth status viewable)' },
      { label: 'Clinical criteria', value: 'State baseline per Optum\'s BH803ABA NY Medicaid/CHP entry (under 21, ASD/Rett, 2-year referral)' },
      { label: 'Telehealth', value: '97155 supervision + 97156/97157 caregiver training, POS 02, once approved as a virtual-visits provider' },
    ],
    sections: [
      {
        h2: 'Everything is PA-gated — the inverse of FFS',
        body: [
          'Where the state FFS layer needs only a referral, UHC\'s plan requires prior authorization for every ABA service. The assessment PA goes in as an online ABA Assessment request on providerexpress.com; the treatment PA follows through the portal or by calling the Autism Care Advocate with the member\'s name and ID, diagnosis, and a description of the treatment plan, and authorization status is viewable online. Two claim-killers to design around: claims deny without an authorization on file, and requesting additional units beyond the auth requires a new PA — "over limit" is a listed denial reason. No hour caps are published; treat authorized units as the operative ceiling.',
        ],
        cites: [
          { title: 'Optum NY Medicaid ABA Provider Orientation (BH00869, 01/30/2025)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf' },
        ],
      },
      {
        h2: 'State-deferent criteria, Optum process',
        body: [
          'Optum\'s ABA State Mandates supplemental criteria (BH 803ABA, effective January 2026) carries an explicit "New York Medicaid and Child Health Plus (CHP)" entry that restates the state criteria: under 21, ASD and/or Rett syndrome, and the 2-year practitioner referral including the DSM-5 Diagnostic Checklist. So the referral packet you\'d assemble for FFS is the same clinical foundation here — the difference is that it feeds a PA request instead of going straight to service. Operational extras from the orientation: telehealth is allowed for supervision (97155) and caregiver training (97156/97157) once you\'re approved as a virtual-visits provider, billed with POS 02; and LBAs may form group practices, while CBAAs may work in one but cannot own one.',
        ],
        cites: [
          { title: 'Optum ABA State Mandates BH 803ABA STM12026 (Jan 2026) — NY Medicaid/CHP entry', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
          { title: 'Optum NY Medicaid ABA Provider Orientation (BH00869, 01/30/2025)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Complete state referral packet', desc: 'The state\'s 2-year referral with DSM-5 checklist is the clinical core of the Optum PA — collect it first.' },
      { title: 'Member ID + plan line', desc: 'Mainstream MMC vs. HARP vs. CHP — and confirm the card actually says Community Plan, not UHC commercial.' },
      { title: 'Auth-before-service discipline', desc: 'Claims deny without an auth on file; never start sessions on a pending request.' },
      { title: 'Unit runway', desc: 'Additional units need a new PA — track burn-down and file before the auth exhausts.' },
      { title: 'Telehealth provider status', desc: 'Virtual 97155/97156/97157 requires virtual-visits approval; bill POS 02.' },
    ],
    sources: [
      { title: 'Optum NY Medicaid ABA Provider Orientation (BH00869_01302025)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf' },
      { title: 'Optum ABA State Mandates BH 803ABA STM12026 (Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of New York cover ABA?', a: 'Yes — for NY Medicaid members under 21 with ASD or Rett syndrome, on the state\'s clinical criteria, but with prior authorization required on all ABA services through Optum\'s providerexpress.com portal.' },
      { q: 'How do I get an ABA authorization from UHC Community Plan NY?', a: 'Submit the online ABA Assessment request on providerexpress.com for the assessment, then the treatment request through the portal or the Autism Care Advocate line with member info, diagnosis, and the treatment plan. Status is viewable online.' },
      { q: 'Are UHC\'s clinical criteria different from the state\'s?', a: 'No — Optum\'s New York Medicaid/CHP entry copies the state criteria (under 21, ASD/Rett, 2-year referral with DSM-5 checklist). What differs is process: everything is PA-gated, unlike fee-for-service.' },
    ],
  },

  'anthem-healthplus-new-york': {
    slug: 'anthem-healthplus-new-york',
    family: 'anthem',
    cardDesc: 'Treatment Plan Request Form via Availity; Comprehensive-vs-Focused framing; incomplete forms returned.',
    treatmentPA: 'Required — Treatment Plan Request Form for ASD (NY Medicaid) via Availity.com, with BCBA/QHCP information; incomplete forms are returned',
    dxRequired: 'Yes — state baseline: under 21, ASD/Rett per DSM-5, with the state practitioner referral',
    payer: 'Anthem Blue Cross and Blue Shield HP (NY Medicaid)',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · Anthem HealthPlus (NY)',
    h1: 'Anthem Blue Cross and Blue Shield HP ABA coverage (NY Medicaid Managed Care).',
    metaTitle: 'Anthem HealthPlus New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Anthem Blue Cross and Blue Shield HP (formerly Empire BCBS HealthPlus) authorizes NY Medicaid ABA — the Treatment Plan Request Form via Availity, the Comprehensive-vs-Focused model classification, and what remains unpublished.',
    intro: [
      'Anthem HP, LLC — the Elevance plan formerly branded Empire BlueCross BlueShield HealthPlus — carries the NY Medicaid ABA carve-in with an Anthem-specific authorization layer on the state\'s eligibility baseline. The center of gravity is its Treatment Plan Request Form for Autism Spectrum Disorders (June 2026 revision — proof the plan is an active NY ABA payer), submitted through Availity. Like other Elevance plans, it sorts requests into Comprehensive versus Focused ABA, and it returns incomplete forms rather than pending them.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (Anthem HP, LLC; formerly Empire BCBS HealthPlus)' },
      { label: 'Treatment PA', value: 'Required — Treatment Plan Request Form via Availity (preferred method)' },
      { label: 'Intensity model', value: 'Form distinguishes Comprehensive vs. Focused ABA requests' },
      { label: 'Form details', value: 'Requires BCBA/QHCP information and age of first ABA treatment; incomplete forms returned' },
      { label: 'Clinical criteria', value: 'State eligibility baseline (under 21, ASD/Rett, referral) + Anthem PA overlay' },
      { label: 'Portal', value: 'Availity.com' },
    ],
    sections: [
      {
        h2: 'The Treatment Plan Request Form workflow',
        body: [
          'Treatment authorization runs on Anthem\'s Treatment Plan Request Form for Autism Spectrum Disorders — New York Medicaid (form NY-BCBS-CD-008303-26-GRP2461, June 2026 revision), submitted via Availity.com as the preferred channel. The form requires the treating BCBA/QHCP\'s information, captures the member\'s age at first ABA treatment, and classifies the request as Comprehensive or Focused ABA — the standard Elevance intensity-review framework, so expect requested hours to be weighed against that model. The operational rule that costs the most time: incomplete forms are returned, not worked — so treat every field as required and package the clinical documentation with the first submission.',
        ],
        cites: [
          { title: 'Anthem NY Medicaid ABA Treatment Plan Request Form (June 2026)', url: 'https://providers.anthem.com/docs/gpp/NY_ABC_CAID_ABA_AuthReqForm.pdf?v=202411221617' },
        ],
      },
      {
        h2: 'What Anthem doesn\'t publish — verify in the portal',
        body: [
          'Several operational facts have no published answer we could verify: whether the assessment code 97151 itself requires PA (the plan\'s published process is a treatment-plan-request workflow), whether Carelon Behavioral Health plays a UM role for ABA, and any hour caps or rates. Anthem also maintains an ABA Services FAQ for NY providers (provider news article 13424) that wasn\'t retrievable at review time. Until the plan confirms otherwise in Availity or through provider services, run assessments on the assumption a request may be needed, and get the answer in writing per case.',
        ],
        cites: [
          { title: 'Anthem NY provider news — ABA Services FAQ (article 13424)', url: 'https://providernews.anthem.com/new-york/articles/applied-behavior-analysis-services-faq-for-providers-13424' },
        ],
      },
    ],
    collect: [
      { title: 'BCBA/QHCP details', desc: 'The form requires the treating analyst\'s information — have credentials and NPI ready before submission.' },
      { title: 'ABA treatment history', desc: 'The form captures age of first ABA treatment — ask at intake, not at form time.' },
      { title: 'Comprehensive vs. Focused framing', desc: 'Classify the request deliberately and align requested hours with the model.' },
      { title: 'Complete state referral packet', desc: 'The state eligibility baseline still applies — referral, dx, severity, DSM-5 checklist.' },
    ],
    sources: [
      { title: 'Anthem NY Medicaid ABA Treatment Plan Request Form (June 2026)', url: 'https://providers.anthem.com/docs/gpp/NY_ABC_CAID_ABA_AuthReqForm.pdf?v=202411221617' },
      { title: 'Anthem NY provider news — ABA Services FAQ (article 13424)', url: 'https://providernews.anthem.com/new-york/articles/applied-behavior-analysis-services-faq-for-providers-13424' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does Anthem HealthPlus cover ABA in New York?', a: 'Yes — it carries the NY Medicaid ABA carve-in for members under 21 with ASD/Rett, with treatment authorized via its Treatment Plan Request Form submitted through Availity. The June 2026 form revision confirms it remains an active NY ABA payer.' },
      { q: 'Does the ABA assessment need prior authorization at Anthem NY?', a: 'No published policy answers that for 97151 specifically — the documented process is the treatment-plan-request workflow. Verify per case in Availity or with provider services, and get the answer in writing.' },
      { q: 'Why was our Anthem ABA request returned?', a: 'Anthem returns incomplete Treatment Plan Request Forms rather than pending them. Complete every field — including BCBA/QHCP information and the Comprehensive/Focused classification — and attach clinical documentation up front.' },
    ],
  },

  'healthfirst-new-york': {
    slug: 'healthfirst-new-york',
    cardDesc: 'Own ABA authorization policy; PA routed through Availity Essentials — policy text unpublished, verify.',
    dxRequired: 'Yes — state baseline: under 21, ASD/Rett per DSM-5, with the state practitioner referral',
    payer: 'Healthfirst (New York)',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · Healthfirst (NY)',
    h1: 'Healthfirst ABA coverage (NY Medicaid Managed Care).',
    metaTitle: 'Healthfirst New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Healthfirst handles NY Medicaid ABA — its own ABA authorization policy, prior authorization through the Availity Essentials tool, the state supervision rules applied to Healthfirst plans, and what couldn\'t be verified from published sources.',
    intro: [
      'Healthfirst — the large NYC-area provider-sponsored plan — maintains its own Policy for the Authorization of Applied Behavioral Analysis (ABA) Services, with an updated version announced with a reported effective date of October 2026. The honest caveat up front: the policy PDF itself was unavailable at review time, so this guide covers what\'s verified — the plan runs its own authorization machinery through Availity Essentials on top of state-baseline clinical criteria — and flags exactly what to confirm in the portal before promising a family timelines.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (HealthFirst PHSP, Inc.) — NYC-area footprint' },
      { label: 'Authorization', value: 'Plan-specific ABA authorization policy (updated version announced; text unpublished — verify)' },
      { label: 'PA portal', value: 'Availity Essentials Online Authorization Tool — select "Healthfirst (New York)" as payer' },
      { label: 'Commercial signal', value: 'On Healthfirst small/large group plans, 97151–97158 all require PA' },
      { label: 'Supervision', value: 'State 10/1/2025 rules (5% of tech hours, 2 monthly contacts) applied to Healthfirst plans' },
      { label: 'Provider services', value: '1-888-801-1660' },
    ],
    sections: [
      {
        h2: 'What\'s verified — and what isn\'t',
        body: [
          'Verified: Healthfirst publishes its own ABA authorization policy (the prior version circulated as doc 0374-22, with an updated version announced carrying a reported October 2026 effective date), routes prior authorization through the Availity Essentials Online Authorization Tool with "Healthfirst (New York)" selected as the payer, and — on its commercial small/large group lines — requires PA on the full ABA code range 97151–97158, a strong signal of an authorization-first posture. Also verified: Healthfirst republished the state\'s October 1, 2025 technician-supervision requirements verbatim on its provider site, applying them to Healthfirst plans. Not verified: the Medicaid-line specifics — whether 97151 needs PA, authorization periods, documentation requirements, hour-cap logic, and rates — because the policy PDF 404s. Pull the current policy from hfproviders.org or provider services (1-888-801-1660) and confirm the Medicaid ABA workflow in Availity before committing to start dates.',
        ],
        cites: [
          { title: 'Healthfirst provider page — ABA supervision requirements (eff. 10/1/2025)', url: 'https://hfproviders.org/resource-posts/applied-behavior-analysis-supervision-requirements' },
          { title: 'Healthfirst — prior authorization through Availity', url: 'https://hfproviders.org/resource-posts/prior-auth-through-availity' },
        ],
      },
      {
        h2: 'The state baseline still does the clinical work',
        body: [
          'Healthfirst\'s published ABA content mirrors the state program: members under 21 with ASD and/or Rett syndrome, the practitioner referral, and — per its supervision post — the state\'s LBA/CBAA structure with the 5%-of-tech-hours, two-contacts-per-month supervision rule. So the intake package is the same one the state FFS manual defines; the open question at this plan is purely the authorization mechanics layered on top. Build the referral packet to the state spec, then confirm Healthfirst\'s submission requirements against the live policy.',
        ],
        cites: [
          { title: 'Healthfirst provider page — ABA supervision requirements', url: 'https://hfproviders.org/resource-posts/applied-behavior-analysis-supervision-requirements' },
          { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Current authorization policy', desc: 'The policy text is unpublished — pull the live version from hfproviders.org or provider services before quoting timelines.' },
      { title: 'Complete state referral packet', desc: 'Under-21 ASD/Rett dx, referral with severity and DSM-5 checklist — the clinical baseline is the state\'s.' },
      { title: 'Availity payer selection', desc: 'Submit PA through Availity Essentials with "Healthfirst (New York)" as the payer.' },
      { title: 'Line of business', desc: 'Medicaid vs. Healthfirst commercial — on commercial group plans, all of 97151–97158 require PA.' },
    ],
    sources: [
      { title: 'Healthfirst — ABA supervision requirements (eff. 10/1/2025)', url: 'https://hfproviders.org/resource-posts/applied-behavior-analysis-supervision-requirements' },
      { title: 'Healthfirst — prior authorization through Availity', url: 'https://hfproviders.org/resource-posts/prior-auth-through-availity' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does Healthfirst cover ABA therapy?', a: 'Yes — it carries the NY Medicaid ABA carve-in on the state\'s clinical baseline (under 21, ASD/Rett, practitioner referral) and maintains its own ABA authorization policy, with PA submitted through Availity Essentials.' },
      { q: 'Does Healthfirst require prior authorization for the ABA assessment?', a: 'On its commercial group plans, yes — 97151–97158 all require PA. For the Medicaid line, the policy text was unavailable at review time; confirm the current policy via hfproviders.org or provider services (1-888-801-1660) before booking.' },
      { q: 'Do the state\'s new supervision rules apply at Healthfirst?', a: 'Yes — Healthfirst republished the state\'s October 2025 requirements (LBA supervision of at least 5% of technician hours, 2 monthly face-to-face contacts, max 6 supervisees) as applying to its plans.' },
    ],
  },

  'metroplus-health-new-york': {
    slug: 'metroplus-health-new-york',
    cardDesc: 'NYC H+H plan; auth via email/fax to CSS; unique quirk: diagnosis must be re-validated annually.',
    treatmentPA: 'Required — authorization requests and clinical information go to MetroPlus CSS by email or fax (per the 2023 benefit notice)',
    dxRequired: 'Yes — state baseline plus a MetroPlus quirk: a comprehensive autism evaluation by a NYS-licensed clinician, authenticated and re-validated annually (LBAs don\'t qualify to validate it)',
    payer: 'MetroPlusHealth (NY Medicaid)',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · MetroPlusHealth (NY)',
    h1: 'MetroPlusHealth ABA coverage (NY Medicaid Managed Care).',
    metaTitle: 'MetroPlusHealth New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How MetroPlusHealth — the NYC Health + Hospitals plan — handles NY Medicaid ABA: email/fax authorization to CSS, the annual diagnosis-validation requirement that\'s stricter than the state\'s 2-year rule, and the NYC-only footprint.',
    intro: [
      'MetroPlusHealth, the NYC Health + Hospitals plan, carries the NY Medicaid ABA carve-in with two plan-specific wrinkles worth designing intake around. First, the mechanics are old-school: ABA authorization requests and clinical information go to MetroPlus CSS by email or fax, not a slick portal workflow. Second — and unique among the plans we profile — MetroPlus requires the autism diagnosis to be authenticated and re-validated annually by the member\'s treatment team, a stricter cadence than the state\'s 2-year referral rule, and it holds that LBAs don\'t meet the practitioner level to validate the diagnosis themselves.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (Metroplus Health Plan, Inc. — NYC Health + Hospitals)' },
      { label: 'Footprint', value: 'New York City only' },
      { label: 'Authorization channel', value: 'Email or fax to MetroPlus CSS — requests + clinical information' },
      { label: 'Diagnosis recency', value: 'Annual — diagnosis authenticated and re-validated every year (stricter than the state\'s 2-year referral)' },
      { label: 'Diagnostic evaluation', value: 'Comprehensive autism evaluation by a NYS-licensed clinician; LBAs can\'t validate the dx' },
      { label: 'Clinical criteria', value: 'State baseline (under 21, ASD/Rett) + MetroPlus overlays' },
    ],
    sections: [
      {
        h2: 'The annual diagnosis-validation quirk',
        body: [
          'MetroPlus states that LBAs do not meet the practitioner level to authenticate or validate an autism diagnosis — so ABA providers must coordinate with the member\'s treatment team (physician, psychologist, or other qualified NYS-licensed clinician) to have the diagnosis authenticated and validated annually. That\'s a materially tighter clock than the state\'s 2-year referral: for every MetroPlus family, intake should diary an annual diagnosis-revalidation task with the diagnosing or treating clinician, or reauthorization becomes an avoidable scramble. The underlying diagnostic requirement is a comprehensive autism evaluation by a NYS-licensed clinician accompanying or preceding the diagnosis.',
        ],
        cites: [
          { title: 'MetroPlusHealth notice — 2023 ABA benefit changes', url: 'https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/' },
        ],
      },
      {
        h2: 'Mechanics and what to verify',
        body: [
          'Per the plan\'s 2023 benefit notice, authorization requests and supporting clinical information are submitted to MetroPlus CSS by email or fax — build a submission template and a delivery-confirmation habit, since email/fax workflows lack a portal\'s status visibility. Assessment-PA specifics, authorization periods, hour caps, and rates aren\'t published in the materials we could verify; confirm current requirements with CSS or via the metroplus.org provider portal per case. The footprint is NYC-only, and the clinical baseline is the state\'s: under 21, ASD/Rett, practitioner referral.',
        ],
        cites: [
          { title: 'MetroPlusHealth notice — 2023 ABA benefit changes', url: 'https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/' },
          { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Comprehensive autism evaluation', desc: 'By a NYS-licensed clinician — it must accompany or precede the diagnosis, and an LBA\'s attestation doesn\'t count.' },
      { title: 'Annual revalidation plan', desc: 'Diary a yearly diagnosis-authentication task with the treatment team — MetroPlus\'s cadence is annual, not the state\'s 2 years.' },
      { title: 'CSS submission package', desc: 'Auth request + clinical information by email or fax — use a template and confirm receipt.' },
      { title: 'Complete state referral packet', desc: 'The state baseline (under 21, ASD/Rett, referral with DSM-5 checklist) still applies.' },
    ],
    sources: [
      { title: 'MetroPlusHealth notice — 2023 ABA benefit changes', url: 'https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/' },
      { title: 'MetroPlus provider authorization page', url: 'https://metroplus.org/providers/provider-resources/provider-authorization/' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does MetroPlusHealth cover ABA therapy?', a: 'Yes — it carries the NY Medicaid ABA carve-in for NYC members under 21 with ASD/Rett, with authorization requests and clinical information submitted to MetroPlus CSS by email or fax.' },
      { q: 'How often does the autism diagnosis need to be validated at MetroPlus?', a: 'Annually — MetroPlus requires the diagnosis be authenticated and re-validated every year by the member\'s treatment team, and holds that LBAs don\'t meet the practitioner level to do it. That\'s stricter than the state\'s 2-year referral rule.' },
      { q: 'Is MetroPlus available outside New York City?', a: 'No — it\'s the NYC Health + Hospitals plan, with a New York City-only footprint.' },
    ],
  },

  'emblemhealth-new-york': {
    slug: 'emblemhealth-new-york',
    cardDesc: 'Published ABA content restates the state criteria verbatim; PA specifics unpublished — verify.',
    dxRequired: 'Yes — state baseline: under 21, ASD/Rett per DSM-5, referral from the state\'s practitioner list',
    payer: 'EmblemHealth (NY Medicaid)',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · EmblemHealth (NY)',
    h1: 'EmblemHealth ABA coverage (NY Medicaid Managed Care).',
    metaTitle: 'EmblemHealth New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How EmblemHealth (HIP) handles NY Medicaid ABA — a published benefit that restates the state criteria verbatim, no distinct clinical policy located, and the PA questions to verify in the provider portal.',
    intro: [
      'EmblemHealth — operating NY Medicaid through its HIP entities (HIP of Greater New York, Westchester, and Nassau) — is the closest thing to a pure pass-through among the downstate plans: its published Medicaid ABA benefit content is a verbatim restatement of the state criteria effective with the January 1, 2023 carve-in, and we located no distinct EmblemHealth ABA clinical policy. That makes the state guide your clinical rulebook here — but it does not mean no PA exists. The plan\'s authorization specifics simply aren\'t published, so verify the process in the portal before booking.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (HIP of Greater NY / Westchester / Nassau)' },
      { label: 'Clinical rules', value: 'State criteria restated verbatim — no distinct ABA policy located' },
      { label: 'Prior auth', value: 'Not published — verify assessment and treatment PA in the provider portal' },
      { label: 'BH management', value: 'Carelon Behavioral Health historically manages Emblem BH (unconfirmed for ABA specifically)' },
      { label: 'Portal', value: 'emblemhealth.com provider portal' },
      { label: 'Carve-in date', value: 'January 1, 2023, with the statewide MMC carve-in' },
    ],
    sections: [
      {
        h2: 'A state-baseline plan — with unpublished plumbing',
        body: [
          'EmblemHealth\'s published ABA benefit page restates the state program: members under 21 with ASD and/or Rett syndrome per DSM-5, referred by the state\'s practitioner list, effective with the 2023 carve-in. No named assessment instruments, no plan-specific recency rules, no published intensity framework — the clinical criteria are the state\'s. What the public materials don\'t answer: whether the assessment or treatment requires prior authorization on the Medicaid line, what the authorization periods are, and whether Carelon Behavioral Health (which has historically managed Emblem\'s behavioral benefit) runs ABA UM. Treat those as portal questions — confirm the ABA authorization workflow through emblemhealth.com provider services per case, and get answers in writing.',
        ],
        cites: [
          { title: 'EmblemHealth — Medicaid ABA benefit page', url: 'https://www.emblemhealth.com/providers/resources/State-Sponsored-Programs/medicaid-applied-behavior-analysis-benefit-' },
          { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Complete state referral packet', desc: 'Emblem\'s published criteria are the state\'s — the under-21 ASD/Rett referral with DSM-5 checklist is the clinical core.' },
      { title: 'PA confirmation in writing', desc: 'Authorization specifics are unpublished — confirm assessment and treatment PA per case via the portal.' },
      { title: 'HIP entity on the card', desc: 'Greater NY, Westchester, or Nassau — capture the exact entity for eligibility checks.' },
    ],
    sources: [
      { title: 'EmblemHealth — Medicaid ABA benefit page', url: 'https://www.emblemhealth.com/providers/resources/State-Sponsored-Programs/medicaid-applied-behavior-analysis-benefit-' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does EmblemHealth cover ABA therapy?', a: 'Yes — its Medicaid plans carry the NY ABA carve-in on the state criteria, restated verbatim in its published benefit content: under 21, ASD/Rett per DSM-5, with the state practitioner referral.' },
      { q: 'Does EmblemHealth require prior authorization for ABA?', a: 'The plan publishes no ABA-specific PA details — no distinct clinical policy was located. Verify the authorization workflow through the emblemhealth.com provider portal before booking, and get the answer in writing.' },
    ],
  },

  'molina-healthcare-new-york': {
    slug: 'molina-healthcare-new-york',
    family: 'molina',
    cardDesc: 'Ex-Affinity; ABA UM in-house since 9/2021 (formerly eviCore) — the classic stale-info trap.',
    dxRequired: 'Yes — state baseline: under 21, ASD/Rett per DSM-5, with the state practitioner referral',
    payer: 'Molina Healthcare of New York',
    state: 'NY', kind: 'medicaid-mco', parent: 'New York Medicaid',
    pill: 'Payer Guide · Molina Healthcare (NY)',
    h1: 'Molina Healthcare of New York ABA coverage (Medicaid Managed Care).',
    metaTitle: 'Molina Healthcare New York (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of New York (formerly Affinity) handles NY Medicaid ABA — in-house UM with LBA reviewers since the September 2021 eviCore transition, the stale-info traps that transition left behind, and what to verify per case.',
    intro: [
      'Molina Healthcare of New York — the plan formerly branded Affinity, including the TotalCare ("TONY") plan code — runs its ABA utilization management in-house, with LBA care-review clinicians evaluating assessments and treatment plans for medical necessity. The history matters operationally: ABA UM moved from eviCore to Molina effective September 1, 2021, with PA code changes following that October, and stale eviCore-era instructions still circulate. Molina\'s bulletin trail indicates ABA is PA-based, but the current process specifics aren\'t published in materials we could verify — so this guide covers the verified structure and the exact questions to close in the portal.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Mainstream MMC (formerly Affinity; incl. TotalCare "TONY" plan code)' },
      { label: 'UM vendor', value: 'In-house since 9/1/2021 — previously eviCore (stale-info trap)' },
      { label: 'Reviewers', value: 'Molina ABA care-review clinicians (LBA reviewers) assess medical necessity' },
      { label: 'Prior auth', value: 'PA-based per Molina\'s bulletin trail — current specifics unpublished; verify per case' },
      { label: 'Portal', value: 'Molina provider portal / Availity' },
      { label: 'Clinical criteria', value: 'State baseline (under 21, ASD/Rett); plan-specific overlays unverified' },
    ],
    sections: [
      {
        h2: 'The eviCore transition — and why old instructions still bite',
        body: [
          'Until September 1, 2021, Molina NY\'s ABA authorizations ran through eviCore; since then, assessments and treatment plans are reviewed in-house by Molina\'s ABA care-review clinicians, including LBA reviewers, with PA code changes effective October 1, 2021. That transition is the plan\'s defining operational fact: eviCore-era submission instructions, fax numbers, and code lists still surface in old provider packets and search results, and following them sends requests into a void. Anything referencing eviCore for Molina NY ABA is stale — route requests through Molina\'s own portal/Availity channel and confirm the current PA code list from the plan\'s NY Medicaid bulletins.',
        ],
        cites: [
          { title: 'Molina NY provider notice — changes to ABA prior authorization requirements', url: 'https://www.molinahealthcare.com/providers/ny/medicaid/comm/-/media/Molina/PublicWebsite/PDF/Providers/ny/medicaid/Prior%20Authorization%20Update_Provider_Notice_for_ABA' },
          { title: 'Molina NY Medicaid bulletins index', url: 'https://www.molinahealthcare.com/providers/ny/medicaid/comm/bulletin.aspx' },
        ],
      },
      {
        h2: 'What to verify per case',
        body: [
          'Molina\'s current published materials don\'t answer the operational questions intake needs: whether 97151 requires PA separately from treatment, authorization periods, documentation requirements, hour-cap logic, or rates — and its clinical criteria versus the state baseline are unverified. Until the plan confirms otherwise, work from the state\'s clinical baseline (under 21, ASD/Rett, complete practitioner referral), submit through the current Molina portal, and confirm PA requirements per case with provider services in writing. Families transferred through the Affinity-to-Molina rebrand may also carry outdated card branding — verify plan identity on every inquiry.',
        ],
        cites: [
          { title: 'Molina NY Medicaid bulletins index', url: 'https://www.molinahealthcare.com/providers/ny/medicaid/comm/bulletin.aspx' },
          { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Current plan identity', desc: 'Affinity and TotalCare ("TONY") cards are Molina now — verify against live eligibility, not the card art.' },
      { title: 'Complete state referral packet', desc: 'Under-21 ASD/Rett dx with the full referral payload — the clinical baseline while plan specifics stay unpublished.' },
      { title: 'PA confirmation in writing', desc: 'Molina\'s bulletin trail says PA-based, but specifics are unverified — confirm per case through provider services.' },
      { title: 'Post-2021 submission channel', desc: 'Ignore anything referencing eviCore — route through Molina\'s own portal/Availity.' },
    ],
    sources: [
      { title: 'Molina NY provider notice — ABA prior authorization changes', url: 'https://www.molinahealthcare.com/providers/ny/medicaid/comm/-/media/Molina/PublicWebsite/PDF/Providers/ny/medicaid/Prior%20Authorization%20Update_Provider_Notice_for_ABA' },
      { title: 'Molina NY Medicaid bulletins index', url: 'https://www.molinahealthcare.com/providers/ny/medicaid/comm/bulletin.aspx' },
      { title: 'eMedNY ABA Provider Policy Manual (state baseline)', url: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of New York cover ABA?', a: 'Yes — it carries the NY Medicaid ABA carve-in, with assessments and treatment plans reviewed in-house by Molina\'s ABA care-review clinicians (including LBA reviewers). Its bulletin trail indicates PA-based authorization; confirm current specifics per case.' },
      { q: 'Do I still submit Molina NY ABA requests through eviCore?', a: 'No — eviCore hasn\'t handled Molina NY ABA since September 1, 2021. UM is in-house; route requests through Molina\'s portal/Availity and treat any eviCore-referencing instructions as stale.' },
      { q: 'Is Molina the same as Affinity in New York?', a: 'Yes — Molina acquired and rebranded Affinity (including the TotalCare "TONY" plan code). Verify plan identity on any inquiry carrying the old branding.' },
    ],
  },

  'aetna-new-york': {
    slug: 'aetna-new-york',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the NY autism mandate: 680 hrs/yr, no age limit, LBA-only.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in New York',
    state: 'NY', kind: 'commercial',
    pill: 'Payer Guide · Aetna · New York',
    h1: 'Aetna ABA coverage in New York: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in New York: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for New York families — the national clinical policy, prior authorization, the NY autism mandate (no age limit, 680 hours/year, exemptions), NYSED LBA licensure, and what intake should verify.',
    intro: [
      'For an intake team in New York, an Aetna card means three layers at once: the carrier\'s national clinical policy, New York\'s autism insurance mandate (Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — with the two New York-specific facts that surprise out-of-state operators: the mandate caps ABA in hours (680 per year), not dollars, and only NYSED-licensed behavior analysts can deliver mandated ABA — a BCBA alone is not enough.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'NY Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee) — eff. Nov 1, 2012' },
      { label: 'Mandate age', value: 'No age limit in the mandate or DFS Circular Letter 6 (2014)' },
      { label: 'Mandate cap', value: '680 hours of ABA per policy/calendar year — an hours cap, not a dollar cap' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (federal preemption)' },
      { label: 'Licensure', value: 'NYSED Licensed Behavior Analyst (LBA) — BCBA alone insufficient' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New York',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in New York is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in New York.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The New York mandate: 680 hours, no age limit, LBA-delivered',
        body: [
          'New York\'s autism mandate — enacted via S.5845 (2011), effective for policies issued or renewed on or after November 1, 2012, and implemented through DFS Insurance Circular Letter No. 6 (2014) — requires every state-regulated policy providing physician/medical coverage (individual, group, Article 43/HMO, student plans, municipal cooperatives) to cover screening, diagnosis, and treatment of ASD, including ABA. Three features define it. No age limit: unlike Medicaid\'s under-21 rule, neither the statute nor CL 6 sets one, so adult ABA cases are mandate-covered on fully-insured plans. An hours cap, not dollars: ABA may be limited to 680 hours per policy or calendar year per covered individual — the old $45,000 figure still cited in blogs is not in the current guidance, so track authorization requests against an hours budget (680 hours ≈ 13 hrs/week year-round; comprehensive-intensity programs can exhaust it mid-year). And a credential gate: since October 11, 2014, mandated ABA must be provided or supervised by NYSED-licensed LBAs or CBAAs — BACB certification alone doesn\'t satisfy it. Self-funded ERISA plans sit outside the mandate by preemption; MHPAEA parity applies to ABA as a behavioral health benefit either way. (Bills to add DIR/Floortime to the mandate while keeping the 680-hour max have been introduced — 2023 A7913, 2025 S5107 — but their enactment status is unverified.)',
        ],
        cites: [
          { title: 'DFS Insurance Circular Letter No. 6 (2014) — Standards for Insurance Coverage for ABA', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
        ],
      },
      {
        h2: 'No New York-specific Aetna policy — and no Aetna Medicaid ABA plan here',
        body: [
          'We checked: Aetna publishes no New York-specific ABA policy, form, or supplement — the national CPBs, national precert forms, and the state mandate are the whole picture, with the 680-hour cap and LBA rule reaching Aetna\'s fully-insured NY plans through the Insurance Law rather than any Aetna document. One adjacent trap: Aetna Better Health appears in New York\'s Medicaid directory only as a Partial LTC (MLTC) plan — it is not a mainstream children\'s Medicaid plan, so unlike most states there is no Aetna Medicaid ABA line in New York. A family with an Aetna card in NY is a commercial family.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'eMedNY — Managed Care Information plan directory (v2026-2)', url: 'https://www.emedny.org/providermanuals/allproviders/pdfs/information_for_all_providers_managed_care_information.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in New York',
        body: [
          'New York is one of the strictest licensure states: practicing ABA requires the NYSED Licensed Behavior Analyst (LBA) credential under Education Law Article 167 (§§ 8800–8808; regulations at 8 NYCRR 79-17/79-18), administered by NYSED\'s Office of the Professions — a BCBA alone cannot practice or bill, and the mandate itself conditions commercial ABA coverage on LBA/CBAA delivery or supervision. Practice must be pursuant to a diagnosis and prescription/order from an authorized licensed professional, and §8802 has expanded the licensed scope beyond ASD to behavioral health conditions in the current DSM. On rates: Aetna does not publish commercial ABA fee schedules for New York (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
          { title: 'NYSED Office of the Professions — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Hours used this year', desc: 'The 680-hour annual cap is an hours budget — capture ABA hours already used under the policy year before promising intensity.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Supervising LBA', desc: 'Mandated ABA must be LBA/CBAA-provided or supervised — confirm the NYSED license, not just BCBA status.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'DFS Insurance Circular Letter No. 6 (2014)', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
      { title: 'NYSED — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
      { title: 'eMedNY — Managed Care Information plan directory (v2026-2)', url: 'https://www.emedny.org/providermanuals/allproviders/pdfs/information_for_all_providers_managed_care_information.pdf' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in New York?', a: 'Yes — under the carrier\'s national policy for ASD, layered on New York\'s autism mandate for fully-insured plans: no age limit, up to 680 ABA hours per year, LBA-delivered. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the New York autism mandate require?', a: 'State-regulated plans must cover screening, diagnosis, and treatment of ASD including ABA, with no age limit; ABA may be capped at 680 hours per policy/calendar year (an hours cap — the widely cited $45,000 dollar figure is not in the current DFS guidance), and mandated ABA must be provided or supervised by NYSED-licensed LBAs/CBAAs.' },
      { q: 'What does Aetna pay for ABA in New York?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the NY Medicaid fee schedule ($19.26/unit for most codes; $14.45 for 97153) and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-new-york': {
    slug: 'cigna-new-york',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the NY mandate: 680 hrs/yr, no age limit, LBA-only.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in New York',
    state: 'NY', kind: 'commercial',
    pill: 'Payer Guide · Cigna · New York',
    h1: 'Cigna / Evernorth ABA coverage in New York: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in New York: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for New York families — the national clinical policy, prior authorization, the NY autism mandate (no age limit, 680 hours/year, exemptions), NYSED LBA licensure, and what intake should verify.',
    intro: [
      'For an intake team in New York, a Cigna card means three layers at once: the carrier\'s national clinical policy, New York\'s autism insurance mandate (Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — with the two New York-specific facts that surprise out-of-state operators: the mandate caps ABA in hours (680 per year), not dollars, and only NYSED-licensed behavior analysts can deliver mandated ABA — a BCBA alone is not enough.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'NY Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee) — eff. Nov 1, 2012' },
      { label: 'Mandate age', value: 'No age limit in the mandate or DFS Circular Letter 6 (2014)' },
      { label: 'Mandate cap', value: '680 hours of ABA per policy/calendar year — an hours cap, not a dollar cap' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (federal preemption)' },
      { label: 'Licensure', value: 'NYSED Licensed Behavior Analyst (LBA) — BCBA alone insufficient' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New York',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. Unlike Virginia, New York gets no carve-out from EN0499 — the current policy names New York only as an example of a state mandate ("New York law requires regulated benefit plans to provide coverage for the screening, diagnosis and treatment of ASD, including applied behavioral analysis"), so the national criteria apply to New York business, fully-insured and self-funded alike. What changes in New York is the legal floor underneath: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in New York.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The New York mandate: 680 hours, no age limit, LBA-delivered',
        body: [
          'New York\'s autism mandate — enacted via S.5845 (2011), effective for policies issued or renewed on or after November 1, 2012, and implemented through DFS Insurance Circular Letter No. 6 (2014) — requires every state-regulated policy providing physician/medical coverage (individual, group, Article 43/HMO, student plans, municipal cooperatives) to cover screening, diagnosis, and treatment of ASD, including ABA. Three features define it. No age limit: unlike Medicaid\'s under-21 rule, neither the statute nor CL 6 sets one, so adult ABA cases are mandate-covered on fully-insured plans. An hours cap, not dollars: ABA may be limited to 680 hours per policy or calendar year per covered individual — the old $45,000 figure still cited in blogs is not in the current guidance, so track authorization requests against an hours budget (680 hours ≈ 13 hrs/week year-round; comprehensive-intensity programs can exhaust it mid-year). And a credential gate: since October 11, 2014, mandated ABA must be provided or supervised by NYSED-licensed LBAs or CBAAs — BACB certification alone doesn\'t satisfy it. Self-funded ERISA plans sit outside the mandate by preemption; MHPAEA parity applies to ABA as a behavioral health benefit either way. One Cigna-specific friction point: EN0499 excludes Rett syndrome (F84.2), a diagnosis NY Medicaid covers — a Rett family with a Cigna card should be routed through benefits verification and the plan document, not assumed covered.',
        ],
        cites: [
          { title: 'DFS Insurance Circular Letter No. 6 (2014) — Standards for Insurance Coverage for ABA', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in New York',
        body: [
          'New York is one of the strictest licensure states: practicing ABA requires the NYSED Licensed Behavior Analyst (LBA) credential under Education Law Article 167 (§§ 8800–8808; regulations at 8 NYCRR 79-17/79-18), administered by NYSED\'s Office of the Professions — a BCBA alone cannot practice or bill, and the mandate itself conditions commercial ABA coverage on LBA/CBAA delivery or supervision. Practice must be pursuant to a diagnosis and prescription/order from an authorized licensed professional, and §8802 has expanded the licensed scope beyond ASD to behavioral health conditions in the current DSM. On rates: Cigna does not publish commercial ABA fee schedules for New York (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup. Cigna runs no NY Medicaid plan, so there\'s no Medicaid cross-check on a Cigna card here.',
        ],
        cites: [
          { title: 'NYSED Office of the Professions — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Hours used this year', desc: 'The 680-hour annual cap is an hours budget — capture ABA hours already used under the policy year before promising intensity.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — flag Rett (F84.2), which EN0499 excludes.' },
      { title: 'Supervising LBA', desc: 'Mandated ABA must be LBA/CBAA-provided or supervised — confirm the NYSED license, not just BCBA status.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'DFS Insurance Circular Letter No. 6 (2014)', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
      { title: 'NYSED — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in New York?', a: 'Yes — under national policy EN0499 (which applies fully in New York, with no state carve-out), layered on New York\'s autism mandate for fully-insured plans: no age limit, up to 680 ABA hours per year, LBA-delivered. Self-funded plans are exempt from the mandate, so verify plan funding type first.' },
      { q: 'What does the New York autism mandate require?', a: 'State-regulated plans must cover screening, diagnosis, and treatment of ASD including ABA, with no age limit; ABA may be capped at 680 hours per policy/calendar year (an hours cap — the widely cited $45,000 dollar figure is not in the current DFS guidance), and mandated ABA must be provided or supervised by NYSED-licensed LBAs/CBAAs.' },
      { q: 'Does the ABA assessment need prior authorization with Cigna in New York?', a: 'No — per EN0499, assessment codes 97151, 97152, and 0362T need no prior authorization. Treatment does, with the completed assessment and treatment plan on Cigna\'s ABA PA form.' },
    ],
  },

  'unitedhealthcare-new-york': {
    slug: 'unitedhealthcare-new-york',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the NY mandate: 680 hrs/yr, no age limit, LBA-only.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in New York',
    state: 'NY', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · New York',
    h1: 'UnitedHealthcare / Optum ABA coverage in New York: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in New York: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for New York families — the national clinical policy, two-step prior authorization, the NY autism mandate (no age limit, 680 hours/year), NYSED LBA licensure, and the Medicaid line to check for.',
    intro: [
      'For an intake team in New York, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, New York\'s autism insurance mandate (Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee)), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — with the two New York-specific facts that surprise out-of-state operators: the mandate caps ABA in hours (680 per year), not dollars, and only NYSED-licensed behavior analysts can deliver mandated ABA — a BCBA alone is not enough.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'NY Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee) — eff. Nov 1, 2012' },
      { label: 'Mandate age', value: 'No age limit in the mandate or DFS Circular Letter 6 (2014)' },
      { label: 'Mandate cap', value: '680 hours of ABA per policy/calendar year — an hours cap, not a dollar cap' },
      { label: 'Exempt from mandate', value: 'Self-funded ERISA plans (federal preemption)' },
      { label: 'Licensure', value: 'NYSED Licensed Behavior Analyst (LBA) — BCBA alone insufficient' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in New York',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in New York is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. One nuance for New York specifically: Optum\'s ABA State Mandates supplement does carry an explicit New York entry, but it\'s a Medicaid and Child Health Plus entry restating the state Medicaid criteria — there is no NY commercial-mandate override in the document, so commercial members run on the standard national criteria plus the Insurance Law floor. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in New York.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
          { title: 'Optum ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The New York mandate: 680 hours, no age limit, LBA-delivered',
        body: [
          'New York\'s autism mandate — enacted via S.5845 (2011), effective for policies issued or renewed on or after November 1, 2012, and implemented through DFS Insurance Circular Letter No. 6 (2014) — requires every state-regulated policy providing physician/medical coverage (individual, group, Article 43/HMO, student plans, municipal cooperatives) to cover screening, diagnosis, and treatment of ASD, including ABA. Three features define it. No age limit: unlike Medicaid\'s under-21 rule, neither the statute nor CL 6 sets one, so adult ABA cases are mandate-covered on fully-insured plans. An hours cap, not dollars: ABA may be limited to 680 hours per policy or calendar year per covered individual — the old $45,000 figure still cited in blogs is not in the current guidance, so track authorization requests against an hours budget (680 hours ≈ 13 hrs/week year-round; comprehensive-intensity programs can exhaust it mid-year). And a credential gate: since October 11, 2014, mandated ABA must be provided or supervised by NYSED-licensed LBAs or CBAAs — BACB certification alone doesn\'t satisfy it. Self-funded ERISA plans sit outside the mandate by preemption; MHPAEA parity applies to ABA as a behavioral health benefit either way.',
        ],
        cites: [
          { title: 'DFS Insurance Circular Letter No. 6 (2014) — Standards for Insurance Coverage for ABA', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in New York',
        body: [
          'A family saying "we have UnitedHealthcare" in New York may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of New York, where ABA is managed by Optum under the state Medicaid rules with all services PA-gated through Provider Express. Same portal, different rulebook: verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
        cites: [
          { title: 'Optum NY Medicaid ABA Provider Orientation (BH00869_01302025)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in New York',
        body: [
          'New York is one of the strictest licensure states: practicing ABA requires the NYSED Licensed Behavior Analyst (LBA) credential under Education Law Article 167 (§§ 8800–8808; regulations at 8 NYCRR 79-17/79-18), administered by NYSED\'s Office of the Professions — a BCBA alone cannot practice or bill, and the mandate itself conditions commercial ABA coverage on LBA/CBAA delivery or supervision. Practice must be pursuant to a diagnosis and prescription/order from an authorized licensed professional, and §8802 has expanded the licensed scope beyond ASD to behavioral health conditions in the current DSM. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for New York (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
          { title: 'NYSED Office of the Professions — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of New York (Medicaid) — different rules, different guide.' },
      { title: 'Hours used this year', desc: 'The 680-hour annual cap is an hours budget — capture ABA hours already used under the policy year before promising intensity.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.), diagnosing provider and credentials, evaluation date.' },
      { title: 'Supervising LBA', desc: 'Mandated ABA must be LBA/CBAA-provided or supervised — confirm the NYSED license, not just BCBA status.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'DFS Insurance Circular Letter No. 6 (2014)', url: 'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06' },
      { title: 'NYSED — Article 167 (Ed. Law §§ 8800–8808)', url: 'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in New York?', a: 'Yes — under the carrier\'s national policy for ASD via Optum\'s two-step authorization, layered on New York\'s autism mandate for fully-insured plans: no age limit, up to 680 ABA hours per year, LBA-delivered. Self-funded plans are exempt from the mandate, so verify plan funding type first.' },
      { q: 'What does the New York autism mandate require?', a: 'State-regulated plans must cover screening, diagnosis, and treatment of ASD including ABA, with no age limit; ABA may be capped at 680 hours per policy/calendar year (an hours cap — the widely cited $45,000 dollar figure is not in the current DFS guidance), and mandated ABA must be provided or supervised by NYSED-licensed LBAs/CBAAs.' },
      { q: 'What does UnitedHealthcare pay for ABA in New York?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the NY Medicaid fee schedule ($19.26/unit for most codes; $14.45 for 97153) and treat rate-setting as part of contracting.' },
    ],
  },
};
