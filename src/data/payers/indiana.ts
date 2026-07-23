import type { PayerConfig } from './types.js';

export const indianaPayers: Record<string, PayerConfig> = {
  'indiana-medicaid': {
    slug: 'indiana-medicaid',
    cardDesc: 'All-PA ABA, 2026 EPSDT-only shift, 4,000-hr lifetime cap, published rate phasedown.',
    assessmentPA: 'Required — all ABA services require prior authorization (FFS vendor: Acentra Health)',
    treatmentPA: 'Required — each PA capped at 6 months; caregiver coaching required in every ABA PA',
    dxRequired: 'Yes \u2014 ASD with a comprehensive diagnostic evaluation (CDE) + physician referral',
    payer: 'Indiana Medicaid (IHCP)',
    state: 'IN', kind: 'state-medicaid',
    pill: 'Payer Guide · Indiana Medicaid',
    h1: 'Indiana Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Indiana Medicaid (IHCP) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Indiana Medicaid (IHCP) covers ABA for autism — prior authorization on all ABA, the 2026 EPSDT-only and under-21 changes, the 4,000-hour lifetime allocation, published fee-schedule rates and the 2026–2027 phasedown, with primary sources.',
    intro: [
      'Indiana Medicaid — the Indiana Health Coverage Programs (IHCP) — covers ABA for autism when medically necessary, across traditional Medicaid and its managed-care entities. The program is in the middle of the most consequential rule changes of any state we track: an EPSDT-only shift, a hard under-21 cutoff, a lifetime hour allocation, published rate cuts, and a provider-accreditation mandate. Intake teams need both the baseline and the moving parts.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — medically necessary ABA for ASD, EPSDT-only since 4/1/2026' },
      { label: 'Prior auth', value: 'Required for all ABA services; each PA max 6 months' },
      { label: 'Age limit', value: 'No ABA reimbursement for members 21+ (DOS on/after 10/1/2026)' },
      { label: 'Lifetime cap', value: '4,000 hours for comprehensive ABA (16+ hrs/wk); targeted ABA ≤15 hrs/wk exempt' },
      { label: 'Hours', value: 'Up to 40 hrs/wk requestable; beyond that needs additional PA' },
      { label: 'Rates', value: 'Published fee schedule, cut 6% (4/1/2026) then 4% more (4/1/2027)' },
      { label: 'Diagnosis recency', value: 'CDE >1 year old needs updated statement of need + current assessment' },
      { label: 'Staff screening', value: 'All ABA specialties high-risk — Indiana State Police fingerprint check before each RBT/BCaBA/BCBA enrolls' },
    ],
    sections: [
      {
        h2: 'Coverage & authorization',
        body: [
          'IHCP covers ABA when medically necessary for the treatment of ASD, and all ABA services require prior authorization — for fee-for-service through Acentra Health, and through each managed-care entity\'s own process for MCE members. The clinical bar is specific: an ASD diagnosis supported by a comprehensive diagnostic evaluation (CDE) performed by a doctoral-level HSPP psychologist, physician, APRN, or PA; a physician referral; and a behavior assessment that must include the Vineland (with the Maladaptive Behavior domain), the BASC parent rating questionnaire, and an age-appropriate direct skills assessment, signed by the lead analyst and a parent. A CDE older than one year needs an updated statement of need, referral, and current behavior assessment.',
          'Each PA runs at most 6 months, up to 40 hours/week may be requested (more than 40 hours of direct therapy needs additional PA), and — since the 2026 rules — every ABA PA must include caregiver coaching (up to 18 hours per standard 6-month authorization), with a minimum of 1 hour of BCBA supervision per 8 hours of technician services.',
        ],
        cites: [
          { title: 'IHCP — Behavioral Health Services module (PROMOD00039, ABA section)', url: 'https://www.in.gov/medicaid/providers/files/modules/behavioral-health-services.pdf' },
          { title: 'IHCP Bulletin BT202562 — ABA documentation requirements (5/2025)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202562.pdf' },
          { title: 'IHCP — ABA prior authorization checklist', url: 'https://www.in.gov/medicaid/providers/files/ihcp-aba-prior-auth-checklist.pdf' },
        ],
      },
      {
        h2: 'What changed in 2026 (and 2027)',
        body: [
          'Effective April 1, 2026, IHCP covers ABA exclusively through the EPSDT benefit; members 21 and older have a transition window through September 30, 2026, and for dates of service on or after October 1, 2026, IHCP will not authorize or reimburse ABA for members 21+ — making age a first-order intake question. Also effective April 1, 2026: comprehensive ABA (16+ hours/week, billed with modifier UA) draws from a 4,000-hour (16,000-unit) lifetime allocation per member — 97155 and 97156 are excluded from the allocation, and the IHCP Portal\'s "Limit Details" panel shows usage — while targeted ABA is capped at 15 hours/week but exempt from the lifetime cap. Codes 97151, 97152, 97153, 97154, and 0373T can no longer be billed with telehealth modifier 95.',
          'Separately, an accreditation mandate now binds every ABA group enrollment — new and existing. Currently enrolled agencies must submit documentation showing accreditation has been initiated with the Autism Commission on Quality (ACQ) or the Behavioral Health Center of Excellence (BHCOE) by August 1, 2026 (to INXIXabaenrollments@gainwelltechnologies.com or via the IHCP Portal) — a deadline that is days away as this guide is updated — and must hold active accreditation by October 1, 2027. Missing either milestone results in enrollment deactivation, not just a warning. One footnote worth reading twice: BT202646 states a previous BHCOE accreditation is accepted only "until an agency\'s reaccreditation with ACQ," so agencies choosing an accreditor should plan the reaccreditation path, not just the first credential.',
        ],
        cites: [
          { title: 'IHCP Bulletin BT202627 — ABA policy & rate changes (2/2026)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
          { title: 'IHCP Bulletin BT202646 — ABA agency accreditation requirement (3/2026)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202646.pdf' },
        ],
      },
      {
        h2: 'Rates: published, and stepping down',
        body: [
          'Indiana publishes its ABA max fees, which makes revenue modeling unusually concrete — including the pain: a 6% reduction on individual ABA codes for dates of service on/after April 1, 2026, and a further 4% on all ABA codes on/after April 1, 2027. Per 15-minute unit: 97153 (technician, U1) $17.06 → $16.04 → $15.39; 97155 (BCBA, U3) $27.63 → $25.97 → $24.93; 97156 (BCBA, U3) $28.23 → $26.54 → $25.47; 97151 assessment (U3) $27.63 → $25.97 → $24.93. From 4/1/2026, 97153 also became billable at the BCaBA/BCBA tiers, and group codes were restratified into group-size tiers with their own rates. MCE-contracted rates are negotiated but the IHCP max fee is the benchmark.',
        ],
        cites: [
          { title: 'IHCP Bulletin BT202627 — full ABA rate tables (eff. 4/1/2026 & 4/1/2027)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Indiana is one of the few states where technicians enroll in Medicaid individually. Since December 18, 2024, RBTs enroll with the IHCP as rendering providers (provider type 11, specialty 625 — ABA Therapist RBT), and all RBTs and BCaBAs had to be individually enrolled by April 1, 2025 — each with their own Type 1 NPI, enrolled once and then associated with every group they render for. Since April 1, 2025 the rendering NPI on claims must align with the credential-level modifier (U1 RBT / U2 BCaBA / U3 BCBA-HSPP), though a bulletin update note delayed enforcement of that alignment. There is no separate state RBT license: IC 25-8.5-3-6 lets "direct contact technicians" practice without a license when implementing plans under the supervision and direction of a licensed behavior analyst, so the certification floor is the BACB\'s — age 18+, high-school education, the 40-hour training, competency assessment, and the RBT exam, plus the BACB\'s own requirement that every applicant pass a criminal background check and an abuse-registry check within 180 days before applying.',
          'On top of that, IHCP classifies all three ABA specialties (615 Masters/Doctoral-HSPP, 624 Bachelors, 625 RBT) as HIGH risk at enrollment — which triggers a fingerprint-based criminal background check for every individually enrolling RBT, BCaBA, and BCBA before the application can be completed. Fingerprints go through the Indiana State Police, the provider pays the fee, and results are sent to the FSSA (not the agency) for review; the check is specific to the individual, so an enrolled RBT joining a second group doesn\'t need a new one. Enrolled school corporations are exempt, but group providers rendering ABA in school settings are not, and specialty 615 group/billing enrollments additionally get a site visit. FSSA can deny enrollment for convictions it "determines is inconsistent with the best interest of IHCP members" — violent, financial, substance, abuse, and firearm offenses are the published examples. Build the fingerprint step into your hiring timeline: it sits between offer and first billable session.',
          'Supervisor-side, Indiana now licenses behavior analysts: LBA and LABA credentials under IC 25-8.5 (applications live May 13, 2025), with LBA licensure requiring current BCBA certification plus a national criminal history background check ($100 application; LABAs pay $75 and must file a signed supervision contract with a licensed behavior analyst). For IHCP enrollment, specialty 615 is limited to HSPP-licensed or BCBA/BCBA-D-certified providers, and the assessments feeding every PA may only be performed by a psychologist, BCBA-D, or master\'s-level BCBA. The binding ratio since April 1, 2026: at least 1 hour of BCBA (or IHCP-approved qualifying clinician) supervision per 8 hours of technician-delivered therapy — and with 97153 now in-person only, that supervision capacity has to exist where the sessions happen. These screening rules ride on IHCP enrollment across fee-for-service and the MCEs; we found no evidence the plans add employee-level checks beyond the state baseline, but current MCE provider manuals weren\'t exhaustively reviewed — confirm with each plan at credentialing.',
        ],
        cites: [
          { title: 'IHCP Bulletin BT2024194 — ABA provider enrollment & high-risk screening (11/2024)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT2024194.pdf' },
          { title: 'IHCP Bulletin BT202519 — ABA enrollment FAQ (fingerprinting, deadlines) (2/2025)', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202519.pdf' },
          { title: 'IHCP Bulletin BT202627 — supervision ratio & 2026 ABA changes', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
          { title: 'Indiana PLA — Behavior Analyst licensing information', url: 'https://www.in.gov/pla/professions/behavior-analyst/behavior-analyst-licensing-information/' },
          { title: 'IC 25-8.5-3-6 — Prohibitions; exceptions (direct contact technicians)', url: 'https://codes.findlaw.com/in/title-25-professions-and-occupations/in-code-sect-25-8-5-3-6/' },
          { title: 'BACB RBT Handbook', url: 'https://www.bacb.com/rbt-handbook' },
        ],
      },
    ],
    collect: [
      { title: 'Member ID & managed-care plan', desc: 'Anthem, MHS, CareSource, or UHC (Hoosier Care Connect/PathWays) — the plan decides the PA process and forms. MDwise ended as an HIP/Hoosier Healthwise MCE 1/1/2026; former MDwise members now carry one of the other three.' },
      { title: 'Age / date of birth', desc: 'No ABA for 21+ from October 2026 — confirm eligibility and runway up front.' },
      { title: 'CDE + physician referral', desc: 'The comprehensive diagnostic evaluation (HSPP/physician/APRN/PA), its date (1-year freshness rule), and the referral.' },
      { title: 'Prior ABA history', desc: 'The 4,000-hour lifetime allocation makes prior comprehensive-ABA hours a coverage question, not just a clinical one.' },
      { title: 'Caregiver availability', desc: 'Caregiver coaching is required in every PA — set the expectation at intake.' },
    ],
    sources: [
      { title: 'IHCP Bulletin BT202627 — ABA policy updates & rate tables', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
      { title: 'IHCP — Behavioral Health Services module (PROMOD00039)', url: 'https://www.in.gov/medicaid/providers/files/modules/behavioral-health-services.pdf' },
      { title: 'IHCP Bulletin BT202562 — ABA documentation requirements', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202562.pdf' },
      { title: 'IHCP Bulletin BT202646 — ABA agency accreditation', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202646.pdf' },
      { title: 'IHCP — ABA prior authorization checklist', url: 'https://www.in.gov/medicaid/providers/files/ihcp-aba-prior-auth-checklist.pdf' },
      { title: 'IHCP Bulletin BT2024194 — ABA provider enrollment & high-risk screening', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT2024194.pdf' },
      { title: 'IHCP Bulletin BT202519 — ABA enrollment FAQ', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202519.pdf' },
      { title: 'Indiana PLA — Behavior Analyst licensing information', url: 'https://www.in.gov/pla/professions/behavior-analyst/behavior-analyst-licensing-information/' },
      { title: 'IC 25-8.5-3-6 — Prohibitions; exceptions', url: 'https://codes.findlaw.com/in/title-25-professions-and-occupations/in-code-sect-25-8-5-3-6/' },
      { title: 'BACB RBT Handbook', url: 'https://www.bacb.com/rbt-handbook' },
    ],
    faq: [
      { q: 'Does Indiana Medicaid cover ABA therapy?', a: 'Yes — IHCP covers medically necessary ABA for autism with prior authorization on all services. Since April 1, 2026 it is covered exclusively through EPSDT, and coverage ends for members 21+ for dates of service on or after October 1, 2026.' },
      { q: 'What is Indiana\'s lifetime cap on ABA?', a: 'Comprehensive ABA (16+ hours/week) draws from a 4,000-hour (16,000-unit) lifetime allocation per member, tracked in the IHCP Portal. 97155 and 97156 don\'t count against it, and targeted ABA (≤15 hrs/week) is exempt.' },
      { q: 'What does Indiana Medicaid pay for ABA?', a: 'Published max fees, per 15-minute unit — e.g., 97153 at $16.04 (technician tier, DOS on/after 4/1/2026, dropping to $15.39 on 4/1/2027) and 97155 at $25.97 (BCBA tier). MCE rates are contractual but benchmark against the IHCP schedule.' },
      { q: 'Can Indiana Medicaid ABA be delivered by telehealth?', a: 'Codes 97151, 97152, 97153, 97154, and 0373T can no longer be billed with modifier 95 as of April 1, 2026 — they require in-person delivery. Verify current rules per code before scheduling.' },
    ],
  },

  'anthem-indiana-medicaid': {
    slug: 'anthem-indiana-medicaid',
    family: 'anthem',
    cardDesc: 'IHCP criteria restated in Anthem\'s UM guideline; Availity/ICR submission, F84.0 + daily schedule.',
    assessmentPA: 'Required — PA with autism dx (F84.0), testing results, intake assessment, treatment plan, and daily schedule',
    treatmentPA: 'Required — max 6 months; continuation needs updated plan, testing within 2 months of treatment start, progress per goal',
    dxRequired: 'Yes \u2014 ASD coded F84.0, with testing results (Anthem package)',
    payer: 'Anthem BCBS Indiana (Medicaid)',
    state: 'IN', kind: 'medicaid-mco', parent: 'Indiana Medicaid (IHCP)',
    pill: 'Payer Guide · Anthem (IN Medicaid)',
    h1: 'Anthem Indiana Medicaid ABA coverage (Hoosier Healthwise / HIP / HCC).',
    metaTitle: 'Anthem Indiana Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Anthem administers ABA for Indiana Medicaid (Hoosier Healthwise, HIP, Hoosier Care Connect) — its UM guideline restating IHCP criteria, the Availity/ICR submission path, and the documentation package that gets requests through.',
    intro: [
      'Anthem Blue Cross and Blue Shield serves Indiana Medicaid members across Hoosier Healthwise, HIP, and Hoosier Care Connect, and administers ABA under its own UM guideline — which is an explicit restatement of the IHCP rules (405 IAC 5-22-12 and the state bulletins). Clinically you\'re dealing with state policy; operationally you\'re dealing with Anthem\'s documentation package and the Availity/Interactive Care Reviewer pipeline. One caution: Anthem\'s published guideline predates the April 2026 state changes, so where they differ, the state rules control.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'IHCP MCE (Hoosier Healthwise, HIP, Hoosier Care Connect)' },
      { label: 'Clinical rules', value: 'Anthem UM guideline restating IHCP criteria (AINPEC-3345-21)' },
      { label: 'Prior auth', value: 'Required for all ABA; max 6-month authorizations' },
      { label: 'Hours', value: 'Up to 40 hrs/wk; beyond needs additional PA (mirrors IHCP)' },
      { label: 'Submission', value: 'Availity / Interactive Care Reviewer; IHCP universal PA form by fax' },
      { label: 'Caution', value: 'Guideline last reviewed 2021 — 2026 state changes control' },
      { label: 'Diagnosis recency', value: 'State rule: CDE >1 year old needs an updated statement of need' },
    ],
    sections: [
      {
        h2: 'The initial request package',
        body: [
          'Anthem\'s stated initial-request requirements are concrete: the PA form, the autism diagnosis coded F84.0, applicable testing results, an intake assessment covering level of functioning, severity, and social/life skills, the treatment plan, and — the one teams miss — the child\'s daily schedule. Continuation requests need a new PA with an updated treatment plan, developmental testing within 2 months of treatment start, and progress-to-date per goal. Submissions run through Availity\'s Interactive Care Reviewer, with fax (using the IHCP universal PA form) and phone as alternatives.',
        ],
        cites: [
          { title: 'Anthem — Indiana Medicaid ABA UM Guideline', url: 'https://providers.anthem.com/docs/gpp/IN_CAID_ABAGuidelines.pdf' },
          { title: 'Anthem — Prior Authorization 201 (IHCP Works)', url: 'https://www.in.gov/medicaid/providers/files/IHCP-Works-2022-Anthem-Prior-Authorization-201.pdf' },
        ],
      },
      {
        h2: 'What intake should watch',
        body: [
          'Members whose care runs through an ACO, PMG, or IPA-contracted group must follow that group\'s authorization and claims rules rather than Anthem\'s direct process — worth checking during verification. And because Anthem\'s guideline hasn\'t been re-issued since 2021, the 2026 IHCP changes (EPSDT-only, the under-21 cutoff, the 4,000-hour lifetime allocation, mandatory caregiver coaching, and the telehealth restrictions) apply through state policy even though the plan document doesn\'t mention them.',
        ],
        cites: [
          { title: 'IHCP Bulletin BT202627 — ABA policy & rate changes', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Program + delivery system', desc: 'Hoosier Healthwise vs. HIP vs. Hoosier Care Connect, and whether an ACO/PMG/IPA controls the auth path.' },
      { title: 'F84.0 diagnosis + testing', desc: 'The diagnosis code, evaluation, and testing results Anthem\'s package requires.' },
      { title: 'Daily schedule', desc: 'Anthem explicitly asks for it — capture school hours and other therapies at intake.' },
      { title: 'Age + prior ABA hours', desc: 'State rules add the under-21 cutoff and lifetime-allocation questions.' },
    ],
    sources: [
      { title: 'Anthem — Indiana Medicaid ABA UM Guideline', url: 'https://providers.anthem.com/docs/gpp/IN_CAID_ABAGuidelines.pdf' },
      { title: 'Anthem — Prior Authorization 201 (IHCP Works 2022)', url: 'https://www.in.gov/medicaid/providers/files/IHCP-Works-2022-Anthem-Prior-Authorization-201.pdf' },
      { title: 'IHCP Bulletin BT202627 — ABA policy updates', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
    ],
    faq: [
      { q: 'Does Anthem Indiana Medicaid cover ABA therapy?', a: 'Yes — under Anthem\'s UM guideline, which restates IHCP criteria: all ABA prior-authorized, 6-month max authorizations, up to 40 hours/week requestable, members 20 and younger.' },
      { q: 'What does Anthem require for an ABA prior authorization?', a: 'The PA form, F84.0 diagnosis, testing results, an intake assessment (functioning, severity, social/life skills), the treatment plan, and the child\'s daily schedule — via Availity\'s Interactive Care Reviewer, fax, or phone.' },
      { q: 'Do the 2026 Indiana ABA changes apply to Anthem members?', a: 'Yes — EPSDT-only coverage, the under-21 cutoff, the 4,000-hour lifetime allocation, and telehealth restrictions are state policy that binds every MCE, even though Anthem\'s published guideline predates them.' },
    ],
  },

  'mhs-indiana': {
    slug: 'mhs-indiana',
    family: 'centene',
    cardDesc: 'IHCP criteria + MHS\'s own OTR form: named diagnostic instrument, outcome measure, utilization reporting.',
    assessmentPA: 'Required — MHS ABA Outpatient Treatment Request form with a named standardized diagnostic tool, date, and score',
    treatmentPA: 'Required — Focused vs. Comprehensive, Initial vs. Concurrent; concurrent requests report actual vs. authorized utilization',
    dxRequired: 'Yes \u2014 ASD with a named standardized instrument, date, and score on the OTR',
    payer: 'MHS — Managed Health Services (Indiana)',
    state: 'IN', kind: 'medicaid-mco', parent: 'Indiana Medicaid (IHCP)',
    pill: 'Payer Guide · MHS (Indiana)',
    h1: 'MHS Indiana ABA coverage (Hoosier Healthwise / HIP).',
    metaTitle: 'MHS Indiana Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How MHS (Managed Health Services, Centene) administers Indiana Medicaid ABA — the ABA Outpatient Treatment Request form, required diagnostic and outcome instruments, utilization reporting at reauthorization, and fax workflow.',
    intro: [
      'MHS — Centene\'s Indiana plan, serving Hoosier Healthwise and HIP — applies the IHCP clinical criteria for ABA, but funnels every request through its own ABA Outpatient Treatment Request (OTR) form. That form is where requests live or die: it demands a named standardized diagnostic instrument with date and score, a designated outcome measure for the whole treatment episode, and utilization reporting at reauthorization. Teams that pre-collect what the form asks for start families weeks faster.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'IHCP MCE (Hoosier Healthwise, HIP; Centene)' },
      { label: 'Clinical rules', value: 'IHCP criteria (no distinct live MHS clinical policy)' },
      { label: 'Prior auth', value: 'Required — all ABA codes on the OTR (97151–97158, 0362T, 0373T)' },
      { label: 'Diagnosis', value: 'Named instrument + date + score required (ADI-R, ADOS, CARS-2, etc.)' },
      { label: 'Outcome measure', value: 'One instrument for the whole episode (VB-MAPP, ABLLS, Vineland…)' },
      { label: 'Submission', value: 'Fax OTR to (866) 694-3649; UM (877) 647-4848; portal accepted' },
      { label: 'Diagnosis recency', value: 'State rule: CDE >1 year old needs an updated statement of need' },
    ],
    sections: [
      {
        h2: 'The OTR form is the funnel',
        body: [
          'MHS\'s OTR covers every ABA code and distinguishes Focused vs. Comprehensive treatment and Initial vs. Concurrent requests. The formal ASD diagnosis must name the standardized tool used — ADI-R, ADOS, CARS-2, M-CHAT, ASSQ, or GARS — with the administration date, score, and diagnosing provider. The treatment episode must also commit to at least one outcome instrument (VB-MAPP, ABLLS, AFLS, PEAK, or Vineland) used throughout, with units requested per authorization timeframe, the FBA/BIP, and parent-goal documentation attached. Incomplete or illegible forms are returned, which restarts the clock.',
          'At reauthorization, concurrent requests must report the "prescription fulfillment rate" — actual utilization against authorized hours. Under-delivery invites hour cuts, so requested intensity should match what the family can genuinely attend, a fact best captured at intake.',
        ],
        cites: [
          { title: 'MHS — ABA Outpatient Treatment Request form', url: 'https://www.mhsindiana.com/content/dam/centene/mhsindiana/medicaid/pdfs/508-BH-IN-Medicaid-ABA-OTR.pdf' },
          { title: 'MHS — Behavioral health provider forms', url: 'https://www.mhsindiana.com/providers/behavioral-health/bh-provider-forms.html' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnostic instrument + score', desc: 'The named tool, date, score, and diagnosing provider — mandatory on the OTR and the most common intake bottleneck.' },
      { title: 'Outcome-measure plan', desc: 'Which instrument (VB-MAPP, Vineland, etc.) the episode will track — decide before the first request.' },
      { title: 'Units per code per timeframe', desc: 'The OTR requests intensity by code — align intake and clinical planning early.' },
      { title: 'Realistic availability', desc: 'Concurrent requests report fulfillment rate — request hours the family will actually use.' },
    ],
    sources: [
      { title: 'MHS — ABA Outpatient Treatment Request form', url: 'https://www.mhsindiana.com/content/dam/centene/mhsindiana/medicaid/pdfs/508-BH-IN-Medicaid-ABA-OTR.pdf' },
      { title: 'MHS — Behavioral health provider forms (incl. ABA tip sheet)', url: 'https://www.mhsindiana.com/providers/behavioral-health/bh-provider-forms.html' },
      { title: 'IHCP Bulletin BT202627 — ABA policy updates', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
    ],
    faq: [
      { q: 'Does MHS Indiana cover ABA therapy?', a: 'Yes — MHS administers the IHCP ABA benefit for Hoosier Healthwise and HIP members under state clinical criteria, with prior authorization on all ABA codes via its Outpatient Treatment Request form.' },
      { q: 'What does MHS require on an ABA authorization?', a: 'A formal ASD diagnosis with a named standardized instrument, date, and score; a committed outcome measure for the episode; units per code; the FBA/BIP; and parent goals. Fax the OTR to (866) 694-3649; incomplete forms are returned.' },
      { q: 'What happens at MHS reauthorization?', a: 'Concurrent requests must report actual utilization versus authorized hours (the "prescription fulfillment rate") — sustained under-delivery risks reduced hours, so request what the family can actually attend.' },
    ],
  },

  'caresource-indiana': {
    slug: 'caresource-indiana',
    family: 'caresource',
    cardDesc: 'Defers to IHCP criteria (own policy archived); portal-first PA, one-agency rule, ABA audit posture.',
    assessmentPA: 'Required — all ABA prior-authorized per IHCP criteria; portal submission preferred',
    treatmentPA: 'Required — 6-month max per IHCP; continuation needs updated progress/assessment scores',
    dxRequired: 'Yes \u2014 ASD with a comprehensive diagnostic evaluation (CDE) + physician referral',
    payer: 'CareSource Indiana',
    state: 'IN', kind: 'medicaid-mco', parent: 'Indiana Medicaid (IHCP)',
    pill: 'Payer Guide · CareSource (IN)',
    h1: 'CareSource Indiana ABA coverage (Hoosier Healthwise / HIP).',
    metaTitle: 'CareSource Indiana Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How CareSource administers Indiana Medicaid ABA — deference to IHCP criteria after archiving its own policy, portal-first prior authorization, the one-lead-analyst/one-agency rule, and its ABA audit posture.',
    intro: [
      'CareSource serves Indiana Medicaid members on Hoosier Healthwise and HIP, and it\'s unusually explicit about its clinical stance on ABA: it archived its own medical policy (MM-0900) at the end of 2022 and reserves the right to follow CMS and state guidelines without a formal documented policy. In practice that means IHCP criteria govern, and the CareSource layer is process — a portal-first PA workflow, the IHCP universal form, and a documented audit posture on ABA claims.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'IHCP MCE (Hoosier Healthwise, HIP)' },
      { label: 'Clinical rules', value: 'IHCP criteria (own ABA policy archived 12/31/2022)' },
      { label: 'Prior auth', value: 'Required for all ABA; CareSource Provider Portal preferred' },
      { label: 'Contacts', value: 'UM (844) 607-2831 · fax (844) 432-8924' },
      { label: 'One-agency rule', value: 'One lead analyst and one ABA agency per member at a time' },
      { label: 'Audit posture', value: 'Post-payment audits / prepay review on ABA compliance' },
      { label: 'Diagnosis recency', value: 'State rule: CDE >1 year old needs an updated statement of need' },
    ],
    sections: [
      {
        h2: 'How CareSource runs ABA authorization',
        body: [
          'Submissions go through the CareSource Provider Portal (its stated preference, with "immediate approvals" possible for clean requests), by phone to utilization management at (844) 607-2831, or by fax to (844) 432-8924 — using the Indiana Medicaid universal PA request form; there is no CareSource-specific ABA form. The clinical package mirrors IHCP: ASD diagnosis from a licensed physician, HSPP, or qualified specialist; the comprehensive diagnostic evaluation; a behavior identification assessment and treatment plan before services; 6-month maximum authorizations; and continuation on updated progress and assessment scores.',
        ],
        cites: [
          { title: 'CareSource — IN Medicaid prior authorization page', url: 'https://www.caresource.com/in/providers/provider-portal/prior-authorization/medicaid/' },
          { title: 'CareSource — archived IN ABA policy MM-0900 (historical reference)', url: 'https://www.caresource.com/documents/medicaid-in-policy-medical-mm-0900-20220601' },
        ],
      },
      {
        h2: 'Rules worth knowing from the archived policy',
        body: [
          'MM-0900 is no longer the operative document, but the rules it codified track state policy and remain good intake heuristics: only one lead analyst and one ABA agency per member at a time (transitions need coordination, not overlap); no coverage for services rendered by family or household members; and no coverage for shadow/paraprofessional/companion support or primarily custodial care. CareSource also explicitly runs post-payment audits and prepayment review on ABA — clean documentation from day one is a revenue-protection issue, not just a compliance one.',
        ],
        cites: [
          { title: 'CareSource — archived IN ABA policy MM-0900', url: 'https://www.caresource.com/documents/medicaid-in-policy-medical-mm-0900-20220601' },
        ],
      },
    ],
    collect: [
      { title: 'Current/prior ABA agency', desc: 'The one-agency rule makes transitions a coordination task — get the outgoing provider\'s details and releases at intake.' },
      { title: 'CDE + diagnosis documentation', desc: 'Per IHCP: HSPP/physician-level evaluation, 1-year freshness, physician referral.' },
      { title: 'Age + prior comprehensive hours', desc: 'State under-21 cutoff and 4,000-hour lifetime allocation apply to CareSource members.' },
      { title: 'Documentation discipline', desc: 'CareSource\'s audit posture means session-note and plan quality directly protect revenue.' },
    ],
    sources: [
      { title: 'CareSource — IN Medicaid prior authorization page', url: 'https://www.caresource.com/in/providers/provider-portal/prior-authorization/medicaid/' },
      { title: 'CareSource — archived IN ABA policy MM-0900', url: 'https://www.caresource.com/documents/medicaid-in-policy-medical-mm-0900-20220601' },
      { title: 'IHCP Bulletin BT202627 — ABA policy updates', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
    ],
    faq: [
      { q: 'Does CareSource Indiana cover ABA therapy?', a: 'Yes — CareSource administers the IHCP ABA benefit under state clinical criteria (it archived its own ABA policy at the end of 2022), with prior authorization on all ABA services.' },
      { q: 'How do I submit an ABA authorization to CareSource Indiana?', a: 'Through the CareSource Provider Portal (preferred), by phone at (844) 607-2831, or fax (844) 432-8924, using the Indiana Medicaid universal PA form.' },
      { q: 'Can a child see two ABA agencies under CareSource?', a: 'No — the plan\'s codified rule is one lead analyst and one ABA agency per member at a time, so provider transitions need coordinated handoffs rather than overlapping services.' },
    ],
  },

  'mdwise-indiana': {
    slug: 'mdwise-indiana',
    family: 'mdwise',
    cardDesc: 'ENDED as an HIP/Hoosier Healthwise MCE effective 1/1/2026 — members reassigned to Anthem, CareSource, or MHS.',
    assessmentPA: 'Required — all ABA codes PA-required (97151–97158, 0362T, 0373T) per the BH Reference Guide',
    treatmentPA: 'Required — IHCP 6-month max applies; OTR to medical management via the member\'s delivery system',
    dxRequired: 'Yes \u2014 ASD with a comprehensive diagnostic evaluation (CDE) + physician referral',
    payer: 'MDwise (Indiana)',
    state: 'IN', kind: 'medicaid-mco', parent: 'Indiana Medicaid (IHCP)',
    pill: 'Payer Guide · MDwise (IN)',
    h1: 'MDwise Indiana ABA coverage (Hoosier Healthwise / HIP).',
    metaTitle: 'MDwise Indiana Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How MDwise administers Indiana Medicaid ABA — full deference to IHCP criteria, PA on every ABA code, the delivery-system contact model, and the filing limits that matter to billing.',
    intro: [
      'FSSA ended MDwise\'s participation as a managed care entity for Indiana Medicaid\'s Healthy Indiana Plan (HIP) and Hoosier Healthwise programs effective January 1, 2026 — following a performance review that found MDwise "both the most expensive and the lowest in quality" of the four legacy plans. MDwise members were required to choose a new plan (Anthem, CareSource, or MHS) during a Nov. 1 – Dec. 15, 2025 open-enrollment window, with automatic assignment plus a 90-day plan-change grace period for anyone who didn\'t choose. MDwise — a McLaren company — publishes no ABA clinical policy of its own: its Behavioral Health Reference Guide simply lists every ABA code as prior-authorization-required and points to IHCP criteria. The rest of this guide is kept for historical/reference purposes; for current Indiana Medicaid ABA authorization, use the Anthem, CareSource, or MHS guides.',
    ],
    atGlance: [
      { label: 'Plan status', value: 'ENDED as an HIP/Hoosier Healthwise MCE effective January 1, 2026 — members reassigned to Anthem, CareSource, or MHS' },
      { label: 'Plan type (historical)', value: 'IHCP MCE (Hoosier Healthwise, HIP; McLaren)' },
      { label: 'Clinical rules (historical)', value: 'IHCP criteria — no MDwise ABA policy exists' },
      { label: 'Prior auth (historical)', value: 'Required for every ABA code, both HHW and HIP' },
      { label: 'Out-of-network (historical)', value: 'PA required for ALL services from non-contracted providers' },
      { label: 'Claim filing (historical)', value: '90 days contracted / 180 days non-contracted' },
    ],
    sections: [
      {
        h2: 'How MDwise runs ABA authorization',
        body: [
          'The Behavioral Health Reference Guide lists ABA codes 97151–97158, 0362T, and 0373T as PA-required across both Hoosier Healthwise and HIP, with treatment requests routed to the medical management department for the member\'s delivery system. There\'s no MDwise-specific ABA form — the IHCP universal PA form plus an outpatient treatment request does the work. Because the historical delivery-system structure means the right PA phone and fax vary, run eligibility first and pull the correct contacts from the Quick Contact Guide at MDwise.org/quickcontact rather than reusing last case\'s numbers. Out-of-network providers need PA for every service, and claim filing runs 90 days for contracted providers (180 non-contracted).',
        ],
        cites: [
          { title: 'MDwise — Behavioral Health Reference Guide (historical)', url: 'https://www.mdwise.org/Uploads/Public/Documents/MDwise/BH-Reference-Guide.pdf' },
          { title: 'FSSA — Announces End of MDwise Participation in Indiana Medicaid Programs (11/12/2025)', url: 'https://www.in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Redirect to new MCE', desc: 'MDwise no longer serves HIP/Hoosier Healthwise as of 1/1/2026 — confirm which of Anthem, CareSource, or MHS the member was reassigned to, and use that guide.' },
      { title: 'IHCP clinical package', desc: 'CDE, physician referral, behavior assessment with Vineland/BASC — state criteria govern regardless of MCE.' },
      { title: 'Continuity of care', desc: 'FSSA states existing authorizations/treatments are honored through a transition period — verify current status with the new plan.' },
    ],
    sources: [
      { title: 'FSSA — Announces End of MDwise Participation in Indiana Medicaid Programs (11/12/2025)', url: 'https://www.in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf' },
      { title: 'MDwise — Behavioral Health Reference Guide (historical)', url: 'https://www.mdwise.org/Uploads/Public/Documents/MDwise/BH-Reference-Guide.pdf' },
      { title: 'IHCP Bulletin BT202627 — ABA policy updates', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
    ],
    faq: [
      { q: 'Does MDwise still cover ABA therapy in Indiana?', a: 'No — FSSA ended MDwise\'s participation as an MCE for HIP and Hoosier Healthwise effective January 1, 2026. Members were reassigned to Anthem, CareSource, or MHS; use those guides for current ABA authorization.' },
      { q: 'What happened to MDwise members?', a: 'They chose a new plan (Anthem, CareSource, or MHS) during a Nov. 1 – Dec. 15, 2025 open-enrollment window, or were auto-assigned with a 90-day window to switch after January 1, 2026. FSSA states coverage and existing authorizations continue through the transition.' },
      { q: 'Why did Indiana end MDwise\'s Medicaid contract?', a: 'FSSA\'s review found MDwise was "both the most expensive and the lowest in quality" of the four legacy plans; federal rules require at least three plans, which the state still meets with Anthem, CareSource, and MHS.' },
    ],
  },

  'unitedhealthcare-community-plan-indiana': {
    slug: 'unitedhealthcare-community-plan-indiana',
    family: 'unitedhealthcare',
    cardDesc: 'Hoosier Care Connect + PathWays for Aging ABA via the Optum carve-out — not HIP/Hoosier Healthwise.',
    assessmentPA: 'Required — via Optum: ABA Treatment Request Form through Provider Express, phone (877) 610-9785, or fax (844) 897-6514',
    treatmentPA: 'Required — non-urgent decisions within 7 calendar days (max 14); urgent 48 hrs; concurrent 1 business day',
    dxRequired: 'Yes \u2014 ASD with a comprehensive diagnostic evaluation (CDE) + physician referral',
    payer: 'UnitedHealthcare Community Plan of Indiana',
    state: 'IN', kind: 'medicaid-mco', parent: 'Indiana Medicaid (IHCP)',
    pill: 'Payer Guide · UHC Community Plan (IN)',
    h1: 'UnitedHealthcare Community Plan of Indiana ABA coverage (Hoosier Care Connect + PathWays for Aging).',
    metaTitle: 'UHC Community Plan Indiana (Hoosier Care Connect) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers Indiana Medicaid ABA for Hoosier Care Connect — the Optum behavioral-health carve-out, separate ABA network credentialing, the ABA Treatment Request Form, and decision timelines.',
    intro: [
      'UnitedHealthcare Community Plan of Indiana is scoped to Hoosier Care Connect — Indiana\'s plan for aged, blind, and disabled members and children in foster care — and PathWays for Aging, for members 60+ and dual-eligible adults; per FSSA\'s own managed-care plan roster, UHC does NOT serve HIP or Hoosier Healthwise in Indiana, unlike Anthem, CareSource, and MHS. ABA runs through an Optum Behavioral Health carve-out. Clinical criteria default to Indiana Medicaid policy (state rules sit atop UHC\'s stated hierarchy, with InterQual as backstop); the operational reality is that ABA lives on Optum\'s rails: a separate provider network, Provider Express submission, and Optum\'s ABA Treatment Request Form. Given the population it serves, expect a higher share of complex cases at intake — though PathWays for Aging skews toward an adult/dual-eligible population less likely to need pediatric ABA.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'IHCP MCE — Hoosier Care Connect + PathWays for Aging ONLY (not HIP/Hoosier Healthwise)' },
      { label: 'Clinical rules', value: 'Indiana Medicaid policy first, then UHC policy, then InterQual' },
      { label: 'ABA network', value: 'Optum-managed — credentialed separately from UHC medical' },
      { label: 'Prior auth', value: 'Required — ABA Treatment Request Form via Provider Express' },
      { label: 'Timelines', value: 'Non-urgent ≤7 days (max 14); urgent 48 hrs; concurrent 1 business day' },
      { label: 'Note', value: 'Most routine outpatient BH needs no PA at UHC — ABA is the exception' },
      { label: 'Diagnosis recency', value: 'State rule: CDE >1 year old needs an updated statement of need' },
    ],
    sections: [
      {
        h2: 'The Optum carve-out, in practice',
        body: [
          'Optum was selected by UHC Community Plan to build and manage the Indiana ABA network, which means ABA providers must be in the Optum network — credentialed separately from UHC\'s medical side — and enrolled with Indiana Medicaid before joining. Behavioral-health PA runs by phone at (877) 610-9785 (or the number on the member\'s card), through Provider Express ("Auth Request"), or by faxing the IHCP universal PA form to (844) 897-6514; ABA specifically uses Optum\'s ABA Treatment Request Form from the Provider Express Indiana Medicaid ABA Program page, which also hosts the provider orientation and quick-reference guide.',
          'Decision timelines are published and fast by Medicaid standards: non-urgent pre-service within 7 calendar days (14 max), urgent within 48 hours, concurrent within 1 business day. Denials appeal to UHC\'s National Appeals Team (fax (855) 312-1470, phone (866) 556-8166). New PA requirement lists took effect July 1, 2026 — re-check the UHC Indiana prior-auth page each quarter.',
        ],
        cites: [
          { title: 'UHC Community Plan — IHCP Works 2024 Prior Authorization seminar deck', url: 'https://www.in.gov/medicaid/providers/files/IHCP-Works-2024-UHC-Prior-Authorization.pdf' },
          { title: 'UHC Community Plan of Indiana — prior authorization page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/indiana-health-plans/in-comm-plan-home/in-cp-prior-auth.html' },
          { title: 'FSSA — Indiana Medicaid managed care health plans (program-by-MCE roster)', url: 'https://www.in.gov/medicaid/partners/medicaid-partners/managed-care-health-plans/' },
        ],
      },
    ],
    collect: [
      { title: 'Program confirmation', desc: 'Confirm the member is on Hoosier Care Connect or PathWays for Aging — UHC does not administer HIP or Hoosier Healthwise in Indiana.' },
      { title: 'Optum network status', desc: 'ABA requires Optum credentialing, separate from UHC medical — confirm before quoting start dates.' },
      { title: 'IHCP clinical package', desc: 'CDE, physician referral, behavior assessment — state criteria govern the request.' },
      { title: 'Guardianship / placement details', desc: 'Foster-care members bring consent and guardianship questions standard intake misses.' },
      { title: 'Age + lifetime-allocation status', desc: 'The 2026 state rules apply to Hoosier Care Connect members too.' },
    ],
    sources: [
      { title: 'UHC — IHCP Works 2024 Prior Authorization deck', url: 'https://www.in.gov/medicaid/providers/files/IHCP-Works-2024-UHC-Prior-Authorization.pdf' },
      { title: 'UHC Community Plan of Indiana — prior authorization page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/indiana-health-plans/in-comm-plan-home/in-cp-prior-auth.html' },
      { title: 'IHCP Bulletin BT202627 — ABA policy updates', url: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Indiana cover ABA?', a: 'Yes — for Hoosier Care Connect and PathWays for Aging members, administered through an Optum Behavioral Health carve-out under Indiana Medicaid clinical criteria, with PA on all ABA via Optum\'s ABA Treatment Request Form. UHC does not serve HIP or Hoosier Healthwise members in Indiana — those route to Anthem, CareSource, or MHS.' },
      { q: 'How fast does UHC/Optum decide Indiana ABA authorizations?', a: 'Published timelines: non-urgent pre-service within 7 calendar days (14 max), urgent within 48 hours, concurrent reviews within 1 business day.' },
      { q: 'Do I need separate credentialing for UHC Indiana ABA?', a: 'Yes — the ABA network is Optum-managed and credentialed separately from UHC medical, and providers must also be enrolled with Indiana Medicaid first.' },
    ],
  },

  'aetna-indiana': {
    slug: 'aetna-indiana',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Ind. Code 27-8-14.2 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes \u2014 ASD only (F84.0\u2013F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Indiana',
    state: 'IN', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Indiana',
    h1: 'Aetna ABA coverage in Indiana: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Indiana: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Indiana families — the national clinical policy, prior authorization, the Ind. Code 27-8-14.2 mandate (ages, caps, exemptions), Indiana behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Indiana, a Aetna card means three layers at once: the carrier\'s national clinical policy, Indiana\'s autism insurance mandate (Ind. Code 27-8-14.2), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Ind. Code 27-8-14.2' },
      { label: 'Mandate age', value: 'No age limit in the mandate' },
      { label: 'Mandate caps', value: 'No dollar, visit, or hour caps' },
      { label: 'Exempt from mandate', value: 'Individual policies are offer-only; self-funded ERISA' },
      { label: 'Licensure', value: 'IN Licensed Behavior Analyst (PLA, applications live since 5/2025)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Indiana',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Indiana is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Indiana.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Indiana mandate: what it guarantees (and doesn\'t)',
        body: [
          'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. Individual-policy insurers must offer (not automatically include) the coverage, and self-funded ERISA plans are exempt by preemption. There’s little parity tension here because the statute imposes no quantitative limits of its own.',
        ],
        cites: [
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
        ],
      },
      {
        h2: 'No Indiana-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Indiana-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Indiana-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Indiana',
        body: [
          'Indiana began licensing behavior analysts in May 2025 (IC 25-8.5, via the Professional Licensing Agency’s Behavior Analyst Committee), built on current BCBA/BCaBA certification with biennial renewal. Expect commercial payers to fold the LBA license into credentialing requirements as it phases in. On rates: Aetna does not publish commercial ABA fee schedules for Indiana (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
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
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Indiana?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Indiana\'s mandate (Ind. Code 27-8-14.2) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Indiana autism mandate require?', a: 'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Indiana?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Indiana Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-indiana': {
    slug: 'cigna-indiana',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Ind. Code 27-8-14.2 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes \u2014 ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Indiana',
    state: 'IN', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Indiana',
    h1: 'Cigna / Evernorth ABA coverage in Indiana: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Indiana: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Indiana families — the national clinical policy, prior authorization, the Ind. Code 27-8-14.2 mandate (ages, caps, exemptions), Indiana behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Indiana, a Cigna card means three layers at once: the carrier\'s national clinical policy, Indiana\'s autism insurance mandate (Ind. Code 27-8-14.2), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Ind. Code 27-8-14.2' },
      { label: 'Mandate age', value: 'No age limit in the mandate' },
      { label: 'Mandate caps', value: 'No dollar, visit, or hour caps' },
      { label: 'Exempt from mandate', value: 'Individual policies are offer-only; self-funded ERISA' },
      { label: 'Licensure', value: 'IN Licensed Behavior Analyst (PLA, applications live since 5/2025)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Indiana',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Indiana is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Indiana.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Indiana mandate: what it guarantees (and doesn\'t)',
        body: [
          'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. Individual-policy insurers must offer (not automatically include) the coverage, and self-funded ERISA plans are exempt by preemption. There’s little parity tension here because the statute imposes no quantitative limits of its own.',
        ],
        cites: [
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
        ],
      },
      {
        h2: 'No Indiana-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no Indiana-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Indiana-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Indiana',
        body: [
          'Indiana began licensing behavior analysts in May 2025 (IC 25-8.5, via the Professional Licensing Agency’s Behavior Analyst Committee), built on current BCBA/BCaBA certification with biennial renewal. Expect commercial payers to fold the LBA license into credentialing requirements as it phases in. On rates: Cigna does not publish commercial ABA fee schedules for Indiana (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
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
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Indiana?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Indiana\'s mandate (Ind. Code 27-8-14.2) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Indiana autism mandate require?', a: 'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Indiana?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Indiana Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-indiana': {
    slug: 'unitedhealthcare-indiana',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Ind. Code 27-8-14.2 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Indiana',
    state: 'IN', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Indiana',
    h1: 'UnitedHealthcare / Optum ABA coverage in Indiana: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Indiana: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Indiana families — the national clinical policy, prior authorization, the Ind. Code 27-8-14.2 mandate (ages, caps, exemptions), Indiana behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Indiana, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Indiana\'s autism insurance mandate (Ind. Code 27-8-14.2), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Ind. Code 27-8-14.2' },
      { label: 'Mandate age', value: 'No age limit in the mandate' },
      { label: 'Mandate caps', value: 'No dollar, visit, or hour caps' },
      { label: 'Exempt from mandate', value: 'Individual policies are offer-only; self-funded ERISA' },
      { label: 'Licensure', value: 'IN Licensed Behavior Analyst (PLA, applications live since 5/2025)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Indiana',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Indiana is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Indiana.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Indiana mandate: what it guarantees (and doesn\'t)',
        body: [
          'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. Individual-policy insurers must offer (not automatically include) the coverage, and self-funded ERISA plans are exempt by preemption. There’s little parity tension here because the statute imposes no quantitative limits of its own.',
        ],
        cites: [
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
        ],
      },
      {
        h2: 'Optum\'s Indiana-specific criteria',
        body: [
          'Indiana is one of the states with its own entry in Optum’s ABA State Mandates supplemental criteria: for Indiana members, services are recognized as intensive and may be provided daily, and the document explicitly disclaims any quantitative benefit limits implied by its guidelines — intensity keys to the individualized treatment plan. That’s useful language to cite when a requested intensity draws pushback.',
        ],
        cites: [
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Indiana',
        body: [
          'A family saying “we have UnitedHealthcare” in Indiana may actually be on the carrier’s Medicaid plan — UnitedHealthcare Community Plan of Indiana — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Indiana',
        body: [
          'Indiana began licensing behavior analysts in May 2025 (IC 25-8.5, via the Professional Licensing Agency’s Behavior Analyst Committee), built on current BCBA/BCaBA certification with biennial renewal. Expect commercial payers to fold the LBA license into credentialing requirements as it phases in. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Indiana (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Indiana (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Ind. Code § 27-8-14.2-4 (group mandate)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-4/' },
      { title: 'Ind. Code § 27-8-14.2-5 (individual offer)', url: 'https://codes.findlaw.com/in/title-27-insurance/in-code-sect-27-8-14-2-5/' },
      { title: 'Indiana PLA — Behavior Analyst licensure', url: 'https://www.in.gov/pla/professions/behavior-analyst/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Indiana?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Indiana\'s mandate (Ind. Code 27-8-14.2) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Indiana autism mandate require?', a: 'Indiana’s mandate (2001) was the first autism insurance mandate in the country, and it remains one of the strongest: group accident and sickness policies must cover ASD treatment prescribed by the treating physician under a treatment plan, with no age limits and no dollar, visit, or hour caps — and cost-sharing no less favorable than for physical illness generally. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Indiana?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Indiana Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
