import type { PayerConfig } from './types.js';

export const floridaPayers: Record<string, PayerConfig> = {
  'florida-medicaid': {
    slug: 'florida-medicaid',
    cardDesc: 'No autism dx required; BA carved INTO nine MMA plans 2/1/2025; 97153 at $12.26/unit.',
    assessmentPA: 'Required — FFS via Acentra\'s eQSuite (assessment codes submitted separately from treatment); MMA enrollees via their plan',
    treatmentPA: 'Required — authorization before initiation and at least every 180 days; behavior plan covers up to 6 months',
    dxRequired: 'No — eligibility is functional impairment of a major life activity, gated by a physician referral + order + Comprehensive Diagnostic Evaluation (no F84.x requirement)',
    payer: 'Florida Medicaid — Behavior Analysis Services (AHCA)',
    state: 'FL', kind: 'state-medicaid',
    pill: 'Payer Guide · Florida Medicaid',
    h1: 'Florida Medicaid Behavior Analysis (BA) coverage: the intake guide.',
    metaTitle: 'Florida Medicaid ABA (Behavior Analysis) Coverage & Prior Auth Guide | Carelu',
    metaDescription:
      'How Florida Medicaid covers ABA under the Behavior Analysis (BA) benefit — no autism diagnosis required, the February 2025 SMMC 3.0 carve-in to nine MMA plans, Acentra/eQSuite for fee-for-service, Vineland-3 and BASC-3 documentation, 180-day authorizations, and the low fee schedule.',
    intro: [
      'Florida Medicaid covers ABA as "Behavior Analysis (BA) Services" for recipients under 21 — and its front door is one of the widest in the country: no autism diagnosis is required. Eligibility turns on behavior that impairs a major life activity, gated by an independent physician\'s referral. The structure changed fundamentally on February 1, 2025, when SMMC 3.0 carved BA INTO the nine Managed Medical Assistance plans: most families now get BA through their plan\'s network with prior authorization routed to the plan, while the shrinking fee-for-service remainder still authorizes through Acentra Health\'s eQSuite. The trade-off for the wide front door is heavy documentation (Vineland-3 and BASC-3 with every request) and some of the lowest ABA rates in the Southeast.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21, via the BA benefit (EPSDT can exceed policy limits)' },
      { label: 'Autism dx required?', value: 'NO — functional-impairment eligibility; physician referral + order + CDE instead' },
      { label: 'Prior auth', value: 'Required for all BA services — via the MMA plan, or Acentra (eQSuite) for FFS' },
      { label: 'Auth periods', value: 'Up to 180 days / 6 months; reassessment + updated behavior plan to renew' },
      { label: 'Hour cap', value: 'Up to 40 hrs/week as prior-authorized in the behavior plan' },
      { label: 'Rates (per 15 min)', value: '97151 $19.05 · 97153 $12.26 · 97155 $19.17 · 97156 $19.05' },
      { label: 'Administered by', value: 'Nine MMA plans (since 2/1/2025) + Acentra FFS for non-enrolled recipients' },
      { label: 'Staff screening', value: 'Level 2 fingerprint (FDLE + FBI) via the Clearinghouse — every rendering practitioner, employer-renewed every 5 years' },
    ],
    sections: [
      {
        h2: 'The February 2025 carve-in: who authorizes what now',
        body: [
          'For years Florida ran BA as a fee-for-service carve-out with all prior authorization through eQHealth (now Acentra Health). SMMC 3.0 ended that on February 1, 2025: BA moved into the nine MMA plans — Aetna Better Health, Children\'s Medical Services Health Plan, Community Care Plan, Florida Community Care, Humana Healthy Horizons, Molina, Simply Healthcare, Sunshine Health, and UnitedHealthcare Community Plan. If the family is enrolled in an MMA plan, the plan\'s process (portal, UM vendor, fax, turnaround) governs the PA; only recipients NOT enrolled in a plan remain fee-for-service with authorization through Acentra\'s eQSuite portal at fl.acentra.com (customer service 855-444-3747). At the transition, plans had to honor pre-existing Acentra authorizations — AHCA\'s baseline was ~90 days of auth protection, and UHC, Humana, and Florida Community Care each publicly committed to 120 days plus paying non-par providers at prior rates. The first intake question in Florida is therefore: which plan — because it decides where the paperwork goes.',
          'One guardrail keeps the nine plans aligned: the coverage policy requires managed care plans to comply with its service coverage requirements and forbids more stringent limits than Florida Medicaid policy. Plans differ on process — portals, delegated UM vendors, faxes — not clinical criteria. The per-plan guides below cover those mechanics.',
        ],
        cites: [
          { title: 'Florida Medicaid Behavior Analysis Services Coverage Policy (Dec 2024, Rule 59G-4.125)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
          { title: 'Acuity News — Florida Medicaid ABA in 2026: SMMC 3.0 carve-in & rates', url: 'https://acuity.news/regulation/florida-medicaid-aba-in-2026-managed-care-carve-in-a-refreshed-coverage-policy-and-where-ahca-rates-sit-across-the-southeast/' },
          { title: 'Acentra Health — Florida Medicaid Behavior Analysis (eQSuite)', url: 'https://fl.acentra.com/behavior-analysis/' },
        ],
      },
      {
        h2: 'No autism diagnosis required — the referral gate instead',
        body: [
          'Florida\'s eligibility test is functional, not diagnostic: recipients under 21 "requiring medically necessary BA services to address behavior that impairs a recipient\'s ability to perform a major life activity" — safety, communication, self-care, self-stimulating and other behaviors all qualify. There is no F84.x requirement. What gates entry instead is a referral from an independent physician or practitioner (a PCP in family practice, internal medicine, or pediatrics; a developmental-behavioral or neurodevelopmental pediatrician; a pediatric neurologist; a psychiatrist; or a child psychologist), and that referral must include a physician\'s order for BA services plus a Comprehensive Diagnostic Evaluation (CDE) performed to national evidence-based practice standards, led by a licensed practitioner. Claims still need the most current, most specific diagnosis code that supports medical necessity, plus co-occurring disorders — but for intake, the practical checklist is referral, order, and CDE, not a diagnosis hunt. Families waiting on an autism evaluation don\'t have to wait for BA.',
        ],
        cites: [
          { title: 'Florida Medicaid Behavior Analysis Services Coverage Policy (Dec 2024, Rule 59G-4.125)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
        ],
      },
      {
        h2: 'Authorization mechanics & the documentation stack',
        body: [
          'All BA services require prior authorization — assessment included. On the FFS side, assessment requests (97151, 97152, 97151-TS) are submitted separately from treatment codes in eQSuite; initial ("admission") requests go in at least 5 business days before the start date, reauthorizations ("continued stay") 10–30 business days before the current period ends, with decisions in 3 business days at first level (5 at physician level) once information is complete, and reconsideration available within 30 calendar days of a denial. Authorizations run up to 180 calendar days; renewing one takes a reassessment and an updated behavior plan at least every 6 months, with the core instruments re-administered every 12 months.',
          'The documentation stack is Florida\'s real workload: every PA request must attach complete scoring reports for the Vineland-3 (Comprehensive Parent Interview Form, plus the Maladaptive Behavior Domain for ages 3+) and the BASC-3 PRQ (ages 2–18). School-based BA needs the IEP (or 504 plan, or a documented explanation) with the request, and reauthorizations must include data on parent/guardian participation — so caregiver engagement is a renewal variable from day one. Interventions cap at 40 hours/week as prior-authorized in the behavior plan, though EPSDT allows exceeding policy and fee-schedule limits when medically necessary. Billing runs on the 8-minute rule for 15-minute units; supervisor and supervisee can\'t both bill the same time; group treatment maxes at 6 participants; travel time and 1:1 shadow/personal care are explicitly non-covered.',
        ],
        cites: [
          { title: 'Acentra Health (eQHealth) — Behavior Analysis Provider Manual 2026', url: 'https://fl.acentra.com/wp-content/uploads/sites/14/2026/05/Behavior-Analysis-Provider-Manual-2026.pdf' },
          { title: 'Florida Medicaid Behavior Analysis Services Coverage Policy (Dec 2024, Rule 59G-4.125)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
        ],
      },
      {
        h2: 'Rates: among the lowest in the Southeast',
        body: [
          'The January 1, 2025 BA fee schedule (still operative through 2026) pays per 15-minute unit: 97151 behavior assessment $19.05 (max 24 units per assessment; reassessment 97151-TS $19.05, max 18 units), 97153 direct treatment $12.26 (RBT, BCaBA, or Lead Analyst — same rate regardless of credential), 97155 protocol modification $19.17 at the Lead Analyst tier ($15.37 with the HN modifier for BCaBA), and 97156 family training $19.05 (telemedicine 97156-GT at the same rate, max 2 hours/week). The $12.26 on 97153 — the code that fills most of a week — is the number to build Florida Medicaid unit economics around, and it has barely moved: the August 2022 schedule paid $12.19. A caveat on sourcing: AHCA\'s fee-schedule PDFs block automated retrieval, so the 2025/2026 figures here are cross-verified from two secondary trackers and anchored against the archived 2022 AHCA schedule — confirm the current PDF from AHCA directly before contracting. MCO-contracted rates use the state schedule as the reference baseline.',
        ],
        cites: [
          { title: 'BellMedEx — Florida Medicaid ABA fee schedule rates 2026', url: 'https://bellmedex.com/florida-medicaid-applied-behavior-analysis-fee-schedule-rates/' },
          { title: 'Acuity News — Florida Medicaid ABA in 2026: where AHCA rates sit', url: 'https://acuity.news/regulation/florida-medicaid-aba-in-2026-managed-care-carve-in-a-refreshed-coverage-policy-and-where-ahca-rates-sit-across-the-southeast/' },
          { title: 'Behavior Analysis Fee Schedule eff. 8/1/2022 (archived AHCA primary)', url: 'https://web.archive.org/web/20241006051746/https://fl.acentra.com/wp-content/uploads/sites/14/2024/03/BA_Services_2022_Fee_Schedule.pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Florida licenses no behavior analysts: s. 393.17, F.S. instead recognizes certification from a national credentialing board — the BACB — and the FL-CBA is a closed legacy credential (the BACB absorbed the old state program in October 2003; no new FL-CBAs are issued, and a lapsed one requires requalifying as a BCBA). Under the December 2024 coverage policy, technicians must be BACB-credentialed RBTs working under a BCBA or BCaBA, and the Lead Analyst on every case must be a BCBA, an FL-CBA, or a practitioner licensed under chapter 490 or 491. The policy adds no training hours beyond the BACB\'s own RBT requirements (40-hour training, competency assessment, exam, plus the BACB\'s own criminal-background and abuse-registry check within 180 days of applying). The staffing catch is enrollment: every rendering practitioner individually enrolls in Florida Medicaid — Lead Analysts as provider type 392, BCaBAs as 391, RBTs as 390, with 390s and 391s enrollable only as members of an enrolled BA group (type 393). Each application needs a color copy of the BACB certification matching the applicant\'s legal name (black-and-white copies are rejected) and a completed background screening — AHCA says missing screenings and missing tax-ID proof are the two most common causes of BA application delays.',
          'The background screening reaches far past owners: s. 409.907(8)(a), F.S. requires a Level 2 screening not just for the provider and each principal (officers, directors, managing employees, 5%+ owners) but for anyone who participates "by way of rendering services to Medicaid recipients or having direct access to Medicaid recipients" — i.e., every RBT, BCaBA, and analyst on the schedule. Mechanics: the employer initiates the screening through the Care Provider Background Screening Clearinghouse; the candidate submits fingerprints and a photo at an approved Livescan provider; FDLE runs the statewide check and the FBI the national one, plus sex-offender registry searches in states of residence over the preceding 5 years; the eligibility determination must be in hand before employment begins, and for Medicaid enrollment the screening must be within the last 5 years. Prints are retained — FDLE automatically reports new Florida arrests against them — and the employer must initiate a Clearinghouse renewal via the Clearinghouse Results Website before the 5-year expiration (the window opens 60 days out); miss it and the prints drop, the determination expires, and the employee re-fingerprints at a Livescan provider at higher cost. Since January 1, 2024, employers must also register with the Clearinghouse and report employment-status changes within 5 business days. One honest gap: neither the coverage policy nor AHCA\'s BA enrollment materials publish an OIG-LEIE/SAM.gov exclusion-screening cadence for BA staff — federal exclusion-screening obligations still apply, so set your own monthly-check policy rather than waiting for a state instruction.',
          'Supervision floors: Florida sets no numeric ratio in rule. The coverage policy instead requires all BA services — including supervision of BCaBAs and RBTs — to follow "current practice standards as published by the Council of Autism Service Providers," as laid out in the supervision plan inside the approved behavior plan (which must name the authorized supervisors). The incorporated CASP standard is 1–2 hours of case supervision per 10 hours of direct treatment; the BACB\'s 5%-of-monthly-hours minimum for RBTs remains the floor underneath. Supervision is billable — the supervisor can be reimbursed for observing a supervisee implementing the plan, but the supervisee isn\'t paid for the same time period. At the plan level, the two MMA plans checked (Simply/Carelon and Humana) layer only administrative credentialing and portal registration on top — no evidence of employee-level screening beyond the AHCA Level 2/Clearinghouse baseline, which already covers every rendering practitioner through enrollment.',
        ],
        cites: [
          { title: 'Florida Statutes s. 393.17 (behavior analyst certification)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/393.17' },
          { title: 'BACB — Florida Certified Behavior Analysts (FL-CBAs)', url: 'https://www.bacb.com/flcba/' },
          { title: 'Florida Medicaid Behavior Analysis Services Coverage Policy (Dec 2024, Rule 59G-4.125)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
          { title: 'AHCA — Enrolling as a Florida Medicaid Behavior Analysis Provider (webinar deck + FAQ)', url: 'https://ahca.myflorida.com/content/download/11448/file/Enrolling_as_a_Florida_Medicaid_Behavior_Analysis_Provider.pdf' },
          { title: 'Florida Statutes s. 409.907 (Medicaid provider agreements; background screening)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/409.907' },
          { title: 'Florida Statutes s. 435.04 (Level 2 screening standards)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/435.04' },
          { title: 'Florida Statutes s. 435.12 (Care Provider Background Screening Clearinghouse)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/435.12' },
          { title: 'AHCA — Clearinghouse Renewals', url: 'https://ahca.myflorida.com/health-quality-assurance/bureau-of-central-services/background-screening/clearinghouse-renewals' },
          { title: 'CASP — ABA Practice Guidelines for the Treatment of ASD (3.0)', url: 'https://assets-002.noviams.com/novi-file-uploads/casp/pdfs-and-documents/ASD_Guidelines/ABA_Practice_Guidelines_3_0-70a721a1.pdf' },
          { title: 'BACB — RBT Handbook', url: 'https://www.bacb.com/wp-content/uploads/2022/01/RBTHandbook.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'MMA plan (or FFS)', desc: 'One of the nine plans, or unenrolled/FFS via Acentra — it decides the entire PA pathway.' },
      { title: 'Physician referral + order + CDE', desc: 'The eligibility gate: independent physician referral with a BA order and a Comprehensive Diagnostic Evaluation. No autism diagnosis needed.' },
      { title: 'Vineland-3 & BASC-3 PRQ scoring reports', desc: 'Complete scoring reports attach to every PA request — schedule the instruments as part of intake, not after.' },
      { title: 'School status + IEP/504', desc: 'School-based BA requires the IEP or 504 (or a documented explanation) with the auth request.' },
      { title: 'Caregiver participation commitment', desc: 'Reauthorizations must report parent/guardian participation data — set expectations at intake.' },
    ],
    sources: [
      { title: 'Florida Medicaid Behavior Analysis Services Coverage Policy (Dec 2024, Rule 59G-4.125)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
      { title: 'Rule 59G-4.125, F.A.C. (effective 2/10/2025)', url: 'https://www.flrules.org/gateway/ruleno.asp?id=59G-4.125' },
      { title: 'Acentra Health — Behavior Analysis Provider Manual 2026', url: 'https://fl.acentra.com/wp-content/uploads/sites/14/2026/05/Behavior-Analysis-Provider-Manual-2026.pdf' },
      { title: 'Acentra Health — Florida Medicaid Behavior Analysis (eQSuite)', url: 'https://fl.acentra.com/behavior-analysis/' },
      { title: 'Acuity News — Florida Medicaid ABA in 2026 (carve-in & rates)', url: 'https://acuity.news/regulation/florida-medicaid-aba-in-2026-managed-care-carve-in-a-refreshed-coverage-policy-and-where-ahca-rates-sit-across-the-southeast/' },
      { title: 'BellMedEx — Florida Medicaid ABA fee schedule rates 2026', url: 'https://bellmedex.com/florida-medicaid-applied-behavior-analysis-fee-schedule-rates/' },
      { title: 'Behavior Analysis Fee Schedule eff. 8/1/2022 (archived AHCA primary)', url: 'https://web.archive.org/web/20241006051746/https://fl.acentra.com/wp-content/uploads/sites/14/2024/03/BA_Services_2022_Fee_Schedule.pdf' },
      { title: 'Florida Statutes s. 393.17 (behavior analyst certification)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/393.17' },
      { title: 'BACB — Florida Certified Behavior Analysts (FL-CBAs)', url: 'https://www.bacb.com/flcba/' },
      { title: 'AHCA — Enrolling as a Florida Medicaid Behavior Analysis Provider (webinar deck + FAQ)', url: 'https://ahca.myflorida.com/content/download/11448/file/Enrolling_as_a_Florida_Medicaid_Behavior_Analysis_Provider.pdf' },
      { title: 'Florida Statutes s. 409.907 (Medicaid provider agreements; background screening)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/409.907' },
      { title: 'Florida Statutes s. 435.04 (Level 2 screening standards)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/435.04' },
      { title: 'Florida Statutes s. 435.12 (Care Provider Background Screening Clearinghouse)', url: 'https://www.flsenate.gov/Laws/Statutes/2025/435.12' },
      { title: 'AHCA — Clearinghouse Renewals', url: 'https://ahca.myflorida.com/health-quality-assurance/bureau-of-central-services/background-screening/clearinghouse-renewals' },
      { title: 'CASP — ABA Practice Guidelines for the Treatment of ASD (3.0)', url: 'https://assets-002.noviams.com/novi-file-uploads/casp/pdfs-and-documents/ASD_Guidelines/ABA_Practice_Guidelines_3_0-70a721a1.pdf' },
      { title: 'BACB — RBT Handbook', url: 'https://www.bacb.com/wp-content/uploads/2022/01/RBTHandbook.pdf' },
    ],
    faq: [
      { q: 'Does Florida Medicaid require an autism diagnosis for ABA?', a: 'No. Eligibility is functional — behavior that impairs a major life activity, for recipients under 21. The gate is a referral from an independent physician or qualifying practitioner, including a physician\'s order for BA services and a Comprehensive Diagnostic Evaluation. Claims carry the most specific supporting diagnosis, but no F84.x code is required.' },
      { q: 'Who approves Florida Medicaid ABA prior authorizations now?', a: 'Since February 1, 2025 (SMMC 3.0), the member\'s MMA plan — one of nine — authorizes BA for plan enrollees. Only recipients not enrolled in a plan still authorize through Acentra Health\'s eQSuite portal on the fee-for-service side.' },
      { q: 'How long do Florida BA authorizations last?', a: 'Up to 180 calendar days. Renewal requires a reassessment and an updated behavior plan at least every 6 months, with the Vineland-3 and BASC-3 core instruments re-administered every 12 months.' },
      { q: 'What does Florida Medicaid pay for ABA?', a: 'Per the January 2025 schedule: 97153 direct treatment $12.26 per 15-minute unit, 97151 assessment $19.05, 97155 $19.17 (Lead Analyst), 97156 family training $19.05 — among the lowest ABA rates in the Southeast. MCO contracts use the state schedule as the baseline.' },
    ],
  },

  'sunshine-health-florida': {
    slug: 'sunshine-health-florida',
    family: 'centene',
    cardDesc: 'Largest SMMC plan; in-house UM, dedicated BA fax/form, 5-day determinations, BA VBP.',
    assessmentPA: 'Required — all BA services incl. 97151, with Vineland-3 and BASC-3 PRQ scoring reports at initial assessment and annually',
    treatmentPA: 'Required — authorizations up to 6 months; determinations within 5 calendar days (7 for CMS Health Plan)',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Sunshine Health (FL)',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Sunshine Health',
    h1: 'Sunshine Health ABA / Behavior Analysis coverage (Florida MMA plan).',
    metaTitle: 'Sunshine Health (Florida Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Sunshine Health administers Florida Medicaid Behavior Analysis since the February 2025 carve-in — in-house UM, the dedicated BA PA form and fax, 5-day determinations, the value-based incentive program, and a reported network enrollment pause.',
    intro: [
      'Sunshine Health, Centene\'s Florida plan and the largest in SMMC, administers the Behavior Analysis benefit in-house — no delegated UM vendor. Clinical criteria mirror the AHCA coverage policy (Vineland-3/BASC-3 documentation, 6-month authorizations, the referral gate), so what\'s Sunshine-specific is machinery: a dedicated BA PA request form and fax line, a 5-calendar-day determination clock, a value-based incentive program for BA providers, and — worth knowing for network planning — an industry-reported pause on adding practitioners to existing BA groups. Sunshine also operates the Children\'s Medical Services Health Plan on behalf of the state, which has its own guide.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan (Centene) — largest in Florida; also operates CMS Health Plan' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy (plans can\'t be more stringent)' },
      { label: 'Prior auth', value: 'Required for all BA — dedicated BA PA form, fax 1-844-208-9113' },
      { label: 'Determinations', value: '5 calendar days (MMA/CW/SMI/LTC/HIV); 7 for CMS Health Plan' },
      { label: 'UM', value: 'In-house Sunshine UM Department — 1-844-477-8313' },
      { label: 'Rates', value: 'Contracted; state BA fee schedule is the reference baseline' },
    ],
    sections: [
      {
        h2: 'How Sunshine runs BA authorization',
        body: [
          'Requests go through the Sunshine Health Secure Provider Portal or by fax to the dedicated BA line, 1-844-208-9113, using Sunshine\'s BA PA request form. The documentation requirements are the state stack: Vineland-3 and BASC-3 PRQ scoring reports at the initial assessment and annually, the physician referral/order/CDE gate, and 6-month authorization periods. Determinations land within 5 calendar days for MMA and most other lines (7 calendar days for the CMS Health Plan line). UM questions go to Sunshine\'s in-house department at 1-844-477-8313. In late October 2025 Sunshine extended authorization timeframes and units for members with renewals landing October 31 and told providers to check the portal before submitting renewals — a reminder to verify the current auth on file before building a renewal packet.',
        ],
        cites: [
          { title: 'Sunshine Health — BA Provider Quick Reference Guide', url: 'https://www.sunshinehealth.com/providers/Billing-manual/ba.html' },
        ],
      },
      {
        h2: 'The VBP program — and a reported enrollment pause',
        body: [
          'Sunshine runs a value-based incentive program for BA providers with outcome-tied bonuses — worth asking about at contracting, since it\'s the only one of the nine plans with a published BA VBP. On the flip side: industry reporting describes a temporary pause, effective October 1, 2025, on enrolling new practitioners into existing BA provider groups — effectively a network moratorium at the practitioner level. We could not verify this against a Sunshine primary source (the plan\'s newsroom blocks automated access), so treat it as a flagged, unconfirmed report: if you\'re adding BCBAs or RBTs to a Sunshine-contracted group, confirm current enrollment status with your provider-relations contact before promising start dates.',
        ],
        cites: [
          { title: '3 Pie Squared — Sunshine Health ABA enrollment pause (industry report, unverified)', url: 'https://3piesquared.com/blog/sunshine-healths-aba-enrollment-pause-what-aba-practice-owners-need-to-know_361' },
          { title: 'Sunshine Health — BA Provider Quick Reference Guide', url: 'https://www.sunshinehealth.com/providers/Billing-manual/ba.html' },
        ],
      },
      {
        h2: 'Ambetter is NOT Florida Medicaid — the marketplace distinction',
        body: [
          'Sunshine Health\'s own newsroom describes Centene\'s Florida footprint as spanning several separate lines of business: "Sunshine Health offers government-sponsored managed care through Medicaid, Long Term Care, the Health Insurance Marketplace (Ambetter), and Medicare (Allwell)." Ambetter from Sunshine Health is the ACA Health Insurance Marketplace (exchange) brand — a completely different product from the Sunshine Health Medicaid MMA plan covered by the rest of this guide, underwritten by a separate entity (Centene Venture Company Florida / Sunshine State Health Plan, Inc. as a Qualified Health Plan issuer). Because roughly a quarter of Carelu\'s Florida intake mentions "Sunshine" or "Ambetter," and families often use the names interchangeably, intake should always ask which card the family actually holds rather than assuming Medicaid rules apply.',
          'The distinction isn\'t just branding — it changes which coverage rules govern. Florida\'s autism mandate (the Steven A. Geller Autism Coverage Act, § 627.6686, Fla. Stat.) explicitly excludes individual-market plans by its own text: the statute\'s definition of "health insurance plan" states it "does not include any health insurance plan offered in the individual market, any health insurance plan that is individually underwritten, or any health insurance plan provided to a small employer." Florida\'s own Office of Insurance Regulation confirms the practical effect: the mandate "appl[ies] to Florida regulated, fully-insured large group health insurance and Health Maintenance Organization plans," while "the regulation of coverage and benefits for ASD under individual and small group health plans" falls instead under the federal Mental Health Parity and Addiction Equity Act (MHPAEA) — and OIR notes MHPAEA "does not explicitly mandate applied behavior analysis (ABA) therapy as outlined in Florida law for large group plans." Ambetter marketplace plans are individual-market fully-insured products, so they sit outside the Geller Act entirely — a materially different, and more fragile, legal basis for ABA coverage than Florida Medicaid\'s AHCA-mandated Behavior Analysis benefit. Ambetter\'s own ABA coverage instead rests on ACA Essential Health Benefits/plan design and Centene\'s corporate-wide medical-necessity clinical policy (CP.BH.104, "Applied Behavior Analysis"), which explicitly carves out that Medicaid state rules take precedence over its own general criteria wherever the two conflict — confirming Ambetter is not simply a rebrand of the Medicaid benefit. We could not verify whether Ambetter\'s prior-authorization contacts are genuinely separate from Sunshine Health Medicaid\'s (the same portal, phone, and BH fax numbers appear on Ambetter\'s own published provider pages), so route by the family\'s actual card and plan documents rather than assuming a distinct process.',
        ],
        cites: [
          { title: 'Sunshine Health newsroom — "Ambetter from Sunshine Health makes it easier..."', url: 'https://www.sunshinehealth.com/content/sunshine-new/en_us/newsroom/ambetter-from-sunshine-health-makes-it-easier-than-ever-to-get-health-insurance-coverage.html' },
          { title: 'Ambetter Health — Florida health plans page', url: 'https://www.ambetterhealth.com/en/fl/health-plans/' },
          { title: '§ 627.6686, Fla. Stat. (2024) — Steven A. Geller Autism Coverage Act', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
          { title: 'Florida CFO/Office of Insurance Regulation — Autism Spectrum Disorder coverage', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
          { title: 'Centene Clinical Policy CP.BH.104 — Applied Behavior Analysis', url: 'https://www.ambetterhealth.com/content/dam/centene/Sunshine/Ambetter/policies/clinical-policies/CP.BH.104.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Exact Sunshine line of business', desc: 'MMA vs. Child Welfare vs. SMI vs. CMS Health Plan — the determination clock and processes differ.' },
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies unchanged — collect it before the PA.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'Required at initial assessment and annually with Sunshine requests.' },
      { title: 'Practitioner enrollment status', desc: 'A reported pause on adding practitioners to existing BA groups — verify with provider relations before quoting start dates.' },
      { title: 'Sunshine Medicaid vs. Ambetter marketplace', desc: 'Ask which card the family holds — Ambetter is Centene\'s ACA marketplace brand, not Florida Medicaid, and follows different coverage rules (ACA/MHPAEA + CP.BH.104, not the state autism mandate or the AHCA BA policy).' },
    ],
    sources: [
      { title: 'Sunshine Health — BA Provider Quick Reference Guide', url: 'https://www.sunshinehealth.com/providers/Billing-manual/ba.html' },
      { title: 'Sunshine Health — BA PA Request Form (fax 1-844-208-9113)', url: 'https://www.sunshinehealth.com/content/dam/centene/Sunshine/pdfs/SH-PRO-BH-BA-PA-Request.pdf' },
      { title: '3 Pie Squared — Sunshine ABA enrollment pause (industry report)', url: 'https://3piesquared.com/blog/sunshine-healths-aba-enrollment-pause-what-aba-practice-owners-need-to-know_361' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
      { title: 'Sunshine Health newsroom — Ambetter marketplace description', url: 'https://www.sunshinehealth.com/content/sunshine-new/en_us/newsroom/ambetter-from-sunshine-health-makes-it-easier-than-ever-to-get-health-insurance-coverage.html' },
      { title: 'Ambetter Health — Florida health plans page', url: 'https://www.ambetterhealth.com/en/fl/health-plans/' },
      { title: '§ 627.6686, Fla. Stat. (2024) — Steven A. Geller Autism Coverage Act', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
      { title: 'Florida CFO/Office of Insurance Regulation — Autism Spectrum Disorder coverage', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
      { title: 'Centene Clinical Policy CP.BH.104 — Applied Behavior Analysis', url: 'https://www.ambetterhealth.com/content/dam/centene/Sunshine/Ambetter/policies/clinical-policies/CP.BH.104.pdf' },
    ],
    faq: [
      { q: 'Does Sunshine Health cover ABA in Florida?', a: 'Yes — since the February 1, 2025 carve-in, Sunshine administers the Florida Medicaid Behavior Analysis benefit for its MMA members on the AHCA clinical criteria: no autism diagnosis required, physician referral + order + CDE, PA on all BA services.' },
      { q: 'How fast does Sunshine decide BA authorizations?', a: 'Published determinations run 5 calendar days for MMA and most lines, 7 calendar days for the CMS Health Plan line. Submit via the secure portal or the dedicated BA fax, 1-844-208-9113.' },
      { q: 'Is Sunshine accepting new ABA providers?', a: 'Industry reporting describes a temporary pause (from October 1, 2025) on enrolling new practitioners into existing BA groups, which we could not confirm against a Sunshine primary source. Verify current status with Sunshine provider relations.' },
      { q: 'Is Ambetter the same as Sunshine Health Medicaid?', a: 'No — Ambetter from Sunshine Health is Centene\'s ACA Marketplace (exchange) brand, a fully-insured individual-market product. It is NOT Florida Medicaid, and Florida\'s autism mandate (§ 627.6686) explicitly excludes individual-market plans, so Ambetter\'s ABA coverage rests on ACA/MHPAEA rules and Centene\'s own clinical policy rather than the state mandate or the AHCA Medicaid BA policy. Always confirm which card a family holds.' },
    ],
  },

  'cms-health-plan-florida': {
    slug: 'cms-health-plan-florida',
    family: 'centene',
    cardDesc: 'Specialty plan for children with chronic conditions; Sunshine machinery, 7-day clock.',
    assessmentPA: 'Required — via Sunshine Health\'s BA process (portal or BA fax 1-844-208-9113); Title 21/CHIP members included',
    treatmentPA: 'Required — determinations within 7 calendar days (vs. 5 on other Sunshine lines)',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Children\'s Medical Services (CMS) Health Plan (FL)',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · CMS Health Plan (FL)',
    h1: 'Children\'s Medical Services Health Plan ABA coverage (Florida specialty plan).',
    metaTitle: 'CMS Health Plan (Florida Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How the Children\'s Medical Services Health Plan — Florida\'s specialty plan for children with chronic conditions, operated by Sunshine Health — handles Behavior Analysis: Sunshine\'s BA process, the 7-day determination clock, and Title 21 (CHIP) PA requirements.',
    intro: [
      'The Children\'s Medical Services (CMS) Health Plan is Florida\'s Title XIX/XXI specialty plan for children with chronic conditions, operated by Sunshine Health on behalf of the state — which makes its membership disproportionately ABA-relevant and its BA process effectively a Sunshine line of business. Requests run through Sunshine\'s portal, form, and BA fax; the practical differences are a longer determination clock (7 calendar days instead of 5) and the fact that Title 21 (CHIP) members also require PA for ABA CPT codes.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC specialty plan (Title XIX/XXI), operated by Sunshine Health' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy, via Sunshine\'s BA process' },
      { label: 'Prior auth', value: 'Required — Sunshine portal or BA fax 1-844-208-9113; CHIP members too' },
      { label: 'Determinations', value: '7 calendar days (the longest clock among Sunshine lines)' },
      { label: 'Population', value: 'Children with chronic conditions — high per-member ABA relevance' },
      { label: 'Rates', value: 'Contracted via Sunshine; state fee schedule baseline' },
    ],
    sections: [
      {
        h2: 'A Sunshine line with two differences',
        body: [
          'Everything mechanical about CMS Health Plan BA is Sunshine Health: the Secure Provider Portal, the BA PA request form, the dedicated BA fax at 1-844-208-9113, in-house UM, and the AHCA clinical criteria underneath (referral + order + CDE, Vineland-3/BASC-3 reports, 6-month authorizations). The two differences worth building into intake: determinations take up to 7 calendar days rather than 5 — set family expectations accordingly — and PA applies to ABA CPT codes for Title 21 (CHIP) members as well as Title 19, so don\'t assume a CHIP card changes the workflow. Because the plan serves children with chronic and complex conditions, Florida\'s no-autism-diagnosis eligibility matters here more than anywhere: members with co-occurring medical conditions and functionally impairing behavior qualify through the referral gate without an ASD label.',
        ],
        cites: [
          { title: 'Sunshine Health — BA Provider Quick Reference Guide (CMS turnaround)', url: 'https://www.sunshinehealth.com/providers/Billing-manual/ba.html' },
        ],
      },
    ],
    collect: [
      { title: 'Title 19 vs. Title 21', desc: 'Both require PA for ABA codes — but capture which program the member is in for eligibility hygiene.' },
      { title: 'Referral + order + CDE', desc: 'The state gate applies; no autism diagnosis required.' },
      { title: 'Medical complexity picture', desc: 'Chronic-condition membership means richer clinical records — gather co-occurring diagnoses for the most specific coding.' },
      { title: 'Timeline expectations', desc: 'The 7-day determination clock is the longest of the Sunshine lines — communicate it to families.' },
    ],
    sources: [
      { title: 'Sunshine Health — BA Provider Quick Reference Guide', url: 'https://www.sunshinehealth.com/providers/Billing-manual/ba.html' },
      { title: 'Sunshine Health — PA required for ABA CPT codes incl. CMS Title 21 (plan notice)', url: 'https://www.sunshinehealth.com/newsroom/aba-cpt-codes.html' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does the CMS Health Plan cover ABA?', a: 'Yes — it administers the Florida Medicaid BA benefit for its specialty population through Sunshine Health\'s process, on the state clinical criteria. No autism diagnosis is required; the physician referral + order + CDE gate applies.' },
      { q: 'How is CMS Health Plan different from regular Sunshine Health for ABA?', a: 'Same portal, form, fax, and criteria — but determinations take up to 7 calendar days instead of 5, and Title 21 (CHIP) members also need PA for ABA CPT codes.' },
    ],
  },

  'simply-healthcare-florida': {
    slug: 'simply-healthcare-florida',
    family: 'anthem',
    cardDesc: 'BA fully delegated to Carelon — auths AND claims; 30-day data-freshness rule on PAs.',
    assessmentPA: 'Required — via Carelon Behavioral Health: eServices portal or fax 1-800-370-1116',
    treatmentPA: 'Required — via Carelon; treatment plan and data must be no older than 30 days at submission',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Simply Healthcare Plans (FL)',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Simply Healthcare (FL)',
    h1: 'Simply Healthcare ABA / Behavior Analysis coverage (Florida MMA plan).',
    metaTitle: 'Simply Healthcare (Florida Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Simply Healthcare (Elevance) administers Florida Medicaid Behavior Analysis — full delegation to Carelon Behavioral Health for both authorizations and claims, the 30-day treatment-plan freshness rule, eServices and Availity workflows.',
    intro: [
      'Simply Healthcare, Elevance\'s Florida plan, took the most distinctive path of the nine MMA plans at the February 1, 2025 carve-in: it delegated Behavior Analysis UM to Carelon Behavioral Health — and not just authorizations. Claims go to Carelon too, via Availity Essentials, making Simply the only Florida plan where providers effectively work for a national behavioral-health vendor end to end. Clinical criteria still defer to the AHCA policy; the workflow is what\'s different, including one Carelon-specific rule with real intake consequences: treatment plans and data must be no older than 30 days when the PA is submitted.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan (Elevance Health)' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy; UM delegated to Carelon (eff. 2/1/2025)' },
      { label: 'Prior auth', value: 'Required — Carelon eServices portal or fax 1-800-370-1116' },
      { label: 'Freshness rule', value: 'Treatment plan + data no older than 30 days at submission' },
      { label: 'Claims', value: 'To Carelon via Availity Essentials (not Simply); Payspan for payments' },
      { label: 'Provider relations', value: 'FL-dedicated Carelon team — provider.relations.FL@carelon.com' },
    ],
    sections: [
      {
        h2: 'The Carelon delegation: auths and claims',
        body: [
          'Effective February 1, 2025, Simply\'s BA authorizations run through Carelon Behavioral Health — submit via the Carelon eServices portal or fax 1-800-370-1116 — and claims submit to Carelon through Availity Essentials (Carelon\'s preferred direct-data-entry channel), with Payspan handling payments. At the transition, existing authorizations were auto-extended at least 90 days for continuity of care. Support runs through Carelon\'s National Provider Service Line, Availity Client Services, and a Florida-dedicated provider-relations mailbox at provider.relations.FL@carelon.com. For a practice used to billing the health plan directly, the operational takeaway is blunt: for Simply members, your counterparty is Carelon — portal registrations, claims setup, and escalation paths should all be built there.',
        ],
        cites: [
          { title: 'Simply Healthcare / Carelon — Behavioral Analysis provider training (Feb 2025 transition)', url: 'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513' },
        ],
      },
      {
        h2: 'The 30-day freshness rule',
        body: [
          'Carelon requires that the treatment plan and supporting data be no older than 30 days at the time of PA submission. That\'s a process rule, not a coverage limit — the state\'s 6-month reassessment cycle still governs clinically — but it changes sequencing: don\'t finalize the behavior plan months ahead of the submission date, and when a renewal window opens, refresh data collection before assembling the packet. A stale-dated plan is an avoidable administrative denial. Everything else follows the state stack: referral + order + CDE at entry, Vineland-3/BASC-3 scoring reports, up-to-6-month authorization periods.',
        ],
        cites: [
          { title: 'Simply Healthcare / Carelon — Behavioral Analysis provider training (Feb 2025 transition)', url: 'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513' },
        ],
      },
    ],
    collect: [
      { title: 'Carelon setup status', desc: 'eServices for auths, Availity for claims, Payspan for payments — three registrations before the first Simply member.' },
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required.' },
      { title: 'Plan/data dates', desc: 'Treatment plan and data must be under 30 days old at submission — track document dates in the packet.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack rides along with every Carelon request.' },
    ],
    sources: [
      { title: 'Simply Healthcare / Carelon — Behavioral Analysis provider training (Feb 2025)', url: 'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Simply Healthcare cover ABA in Florida?', a: 'Yes — on the AHCA Behavior Analysis criteria (no autism diagnosis required), with utilization management and claims both delegated to Carelon Behavioral Health since February 1, 2025.' },
      { q: 'Where do Simply Healthcare ABA authorizations go?', a: 'To Carelon — via the eServices portal or fax 1-800-370-1116. Claims also go to Carelon, submitted through Availity Essentials, not to Simply directly.' },
      { q: 'What is the 30-day rule on Simply/Carelon PAs?', a: 'The treatment plan and supporting data must be no older than 30 days at submission — a Carelon process rule layered on the state\'s 6-month clinical cycle. Refresh data before assembling any renewal packet.' },
    ],
  },

  'unitedhealthcare-community-plan-florida': {
    slug: 'unitedhealthcare-community-plan-florida',
    family: 'unitedhealthcare',
    cardDesc: 'Optum-run since 2/2025: portal-only PA on Provider Express, 2-step auth, 120-day continuity.',
    assessmentPA: 'Required — portal-only via Provider Express ("ABA Assessment" request type); no fax pathway advertised',
    treatmentPA: 'Required — "ABA Treatment" request type; Optum\'s two-step assessment-then-treatment structure',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'UnitedHealthcare Community Plan of Florida',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · UHC Community Plan (FL)',
    h1: 'UnitedHealthcare Community Plan of Florida ABA / BA coverage (MMA plan).',
    metaTitle: 'UHC Community Plan Florida (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers Florida Medicaid Behavior Analysis — Optum\'s portal-only Provider Express workflow, the two-step assessment/treatment authorization, 120-day carve-in continuity, and claims mechanics (payer ID 87726).',
    intro: [
      'UnitedHealthcare Community Plan of Florida handed its Behavior Analysis program to Optum (United Behavioral Health) at the February 1, 2025 carve-in — making it the most "national-carrier" experience of the nine MMA plans. Authorizations run Optum\'s standard two-step structure on Provider Express, and uniquely among Florida\'s plans, the pathway is portal-only: no fax route is advertised for BA auths. The AHCA coverage policy remains the clinical floor and ceiling per the state contract, but the day-to-day machinery — clinical criteria documents, portal, credentialing — is Optum\'s ABA stack.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan; BA program managed by Optum since 2/1/2025' },
      { label: 'Clinical rules', value: 'AHCA BA policy (state floor/ceiling) + Optum criteria (BH803ABA + FL supplement)' },
      { label: 'Prior auth', value: 'Portal-only — Provider Express, "ABA Assessment" then "ABA Treatment"' },
      { label: 'Continuity at carve-in', value: '120 days honoring Acentra auths; non-par paid at prior rates ≥60 days' },
      { label: 'Claims', value: 'Payer ID 87726; 180-day timely filing; clean claims in 15 calendar days' },
      { label: 'Support', value: 'Web support 1-866-209-9320; provider services 1-877-614-0484' },
    ],
    sections: [
      {
        h2: 'The Optum workflow on a state-policy base',
        body: [
          'All BA services require prior authorization, and requests must be submitted via the secure Provider Express portal (One Healthcare ID login): Auths → Request a new authorization → select "ABA Assessment" or "ABA Treatment" from the dropdown. That two-step, assessment-then-treatment structure is Optum\'s national ABA pattern, applied to the Florida Medicaid population — with the state contract requiring compliance with the AHCA coverage policy, so the referral + order + CDE gate, the no-autism-diagnosis eligibility, and the state documentation stack all still apply. There is no advertised fax pathway for BA auths, which makes portal access a day-one credentialing task for any practice taking UHC members. Optum\'s Gold Card program can waive PA for eligible network behavioral providers — worth asking about once a track record exists.',
        ],
        cites: [
          { title: 'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG (BH00998-1-25)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf' },
        ],
      },
      {
        h2: 'Transition history and claims mechanics',
        body: [
          'At the carve-in, UHC committed to a 120-day continuity-of-care period from February 1, 2025 — honoring and extending existing Acentra authorizations for the full 120 days and paying non-participating providers at prior rates for a minimum of 60 days. That window has closed; every auth now lives in Provider Express. Claims go to UHC Community Plan under payer ID 87726 with 180-day timely filing, and clean claims process within 15 calendar days. First-time submitters must include a W9 and a copy of the Florida license with the claim — a known first-claim tripwire for groups new to the plan.',
        ],
        cites: [
          { title: 'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG (BH00998-1-25)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Provider Express access', desc: 'Portal-only PA — confirm One Healthcare ID and Provider Express registration before the first UHC member.' },
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack attaches to Optum requests too.' },
      { title: 'First-claim documents', desc: 'W9 + Florida license copy required with a first-time claim submission.' },
    ],
    sources: [
      { title: 'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG (BH00998-1-25)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf' },
      { title: 'Optum Provider Express — Florida ABA QRG', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/flaba/FLABAQRG.pdf' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Florida cover ABA?', a: 'Yes — since February 1, 2025 its Behavior Analysis program is managed by Optum on the state clinical criteria: no autism diagnosis required, physician referral + order + CDE, PA on all BA services.' },
      { q: 'How do I submit a BA authorization to UHC Community Plan of Florida?', a: 'Portal-only: Provider Express → Auths → Request a new authorization → "ABA Assessment" or "ABA Treatment." No fax pathway is advertised for BA — unique among Florida\'s nine plans.' },
      { q: 'Where do UHC Florida Medicaid ABA claims go?', a: 'To UHC Community Plan, payer ID 87726, within 180-day timely filing; clean claims process in 15 calendar days. First-time submitters must attach a W9 and a copy of the Florida license.' },
    ],
  },

  'humana-healthy-horizons-florida': {
    slug: 'humana-healthy-horizons-florida',
    family: 'humana',
    cardDesc: 'Widest channels of the nine (Availity, 24/7 IVR, fax), named BA reps, fee-schedule-linked non-par pay.',
    assessmentPA: 'Required — via Availity Essentials (preferred), IVR 800-523-0023 (24/7), or fax 813-321-7220, with CDE, physician order, and BASC-3 PRQ attached',
    treatmentPA: 'Required — same channels; PA list at Humana.com/PAL',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Humana Healthy Horizons in Florida',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Humana Healthy Horizons (FL)',
    h1: 'Humana Healthy Horizons in Florida ABA / BA coverage (MMA plan).',
    metaTitle: 'Humana Healthy Horizons Florida (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Humana Healthy Horizons administers Florida Medicaid Behavior Analysis — Availity, 24/7 IVR and fax channels, the MCD 466 PA form, documentation requirements, named regional BA reps, and non-par payment tied to the state fee schedule.',
    intro: [
      'Humana Healthy Horizons administers Florida\'s Behavior Analysis benefit in-house on the AHCA criteria, and differentiates on access: the broadest channel set of the nine plans (Availity Essentials preferred, a 24/7 IVR line, and fax), a dedicated BA provider-relations mailbox with named regional reps, and an unusually explicit rate anchor — non-participating providers\' claims for authorized codes default to a percentage of the Florida Medicaid allowable fee schedule. It was also among the most generous at the carve-in, honoring pre-existing authorizations for 120 days.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan (Humana), in-house UM' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy; PA form MCD 466' },
      { label: 'Prior auth', value: 'Availity (preferred), IVR 800-523-0023 (24/7), or fax 813-321-7220' },
      { label: 'Documentation', value: 'CDE, physician order, BASC-3 PRQ (initial + every 12 months), hours rationale, IEP/504 if school-based' },
      { label: 'Claims', value: 'Availity payer ID 61101; clean claims in 20 days; non-par default = % of state fee schedule' },
      { label: 'BA support', value: 'FLBA@humana.com + named regional reps; provider line 800-477-6931' },
    ],
    sections: [
      {
        h2: 'How Humana runs BA authorization',
        body: [
          'PA is required for all BA services and can be initiated three ways: Availity Essentials (Humana\'s preferred channel), the 24/7 IVR at 800-523-0023, or fax to 813-321-7220, using the Florida ABA PA form (MCD 466). The documentation list tracks the state policy closely: the Comprehensive Diagnostic Evaluation, the physician\'s order, the BASC-3 PRQ for ages 2–18 (at initial request and every 12 months), a rationale for the requested hours, and the IEP or 504 plan when services are school-based. The plan\'s full PA list lives at Humana.com/PAL. Uniquely among the nine, Humana publishes a dedicated BA provider-relations structure: the FLBA@humana.com mailbox plus named regional representatives covering Regions A–E and F–I — for an intake team, a saved contact sheet turns authorization questions into emails with a named owner. Non-par contracting starts at RequestToJoin@humana.com.',
        ],
        cites: [
          { title: 'Humana Healthy Horizons FL — Behavior Analysis Informational Flyer (675204FL0225)', url: 'https://assets.humana.com/is/content/humana/ABA_Informational_Flyer_AHCApdf' },
          { title: 'Humana FL — ABA clinical toolkit', url: 'https://provider.humana.com/medicaid/florida-medicaid/aba-toolkit' },
        ],
      },
      {
        h2: 'Rates and claims: the fee-schedule anchor',
        body: [
          'Participating providers bill at contracted rates (claims via Availity, payer ID 61101; paper to Humana\'s Lexington, KY claims office), with clean claims processed within 20 days. The notable rate fact: for codes inside an approved authorization, non-participating claims default-pay at a percentage of the Florida Medicaid allowable fee schedule — an explicit statutory-schedule linkage that makes the state\'s low BA rates (97153 at $12.26/unit) the reference point for any Humana negotiation. At the February 2025 carve-in, Humana honored and auto-extended pre-existing Acentra authorizations for 120 days and paid non-par providers at pre-transition rates through that window.',
        ],
        cites: [
          { title: 'Humana Healthy Horizons FL — Behavior Analysis Informational Flyer (675204FL0225)', url: 'https://assets.humana.com/is/content/humana/ABA_Informational_Flyer_AHCApdf' },
        ],
      },
    ],
    collect: [
      { title: 'Referral + order + CDE', desc: 'The CDE and physician order attach to the Humana PA — collect them at intake.' },
      { title: 'BASC-3 PRQ scoring report', desc: 'Required at initial request and every 12 months for ages 2–18.' },
      { title: 'Hours rationale', desc: 'Humana asks for the rationale behind requested hours — align clinical planning with the ask.' },
      { title: 'School status + IEP/504', desc: 'Required with school-based requests.' },
      { title: 'Regional BA rep', desc: 'Identify the named Humana rep for your region and save the FLBA@humana.com contact.' },
    ],
    sources: [
      { title: 'Humana Healthy Horizons FL — BA Informational Flyer (675204FL0225)', url: 'https://assets.humana.com/is/content/humana/ABA_Informational_Flyer_AHCApdf' },
      { title: 'Humana FL — ABA PA Form (MCD 466)', url: 'https://assets.humana.com/is/content/humana/ABA_PA_Formpdf' },
      { title: 'Humana FL — ABA clinical toolkit', url: 'https://provider.humana.com/medicaid/florida-medicaid/aba-toolkit' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Humana Healthy Horizons cover ABA in Florida?', a: 'Yes — it administers the state Behavior Analysis benefit on AHCA criteria: no autism diagnosis required, physician referral + order + CDE, PA on all BA services via Availity, 24/7 IVR, or fax.' },
      { q: 'What documents does a Humana Florida BA authorization need?', a: 'The CDE, the physician\'s order, the BASC-3 PRQ (ages 2–18, initial and every 12 months), a rationale for requested hours, and the IEP/504 for school-based services — submitted with the MCD 466 form.' },
      { q: 'What does Humana pay non-par ABA providers in Florida?', a: 'For codes in an approved authorization, non-par claims default-pay at a percentage of the Florida Medicaid allowable fee schedule — so the state\'s BA rates are the explicit reference point.' },
    ],
  },

  'aetna-better-health-florida': {
    slug: 'aetna-better-health-florida',
    family: 'aetna',
    cardDesc: 'BA contracting runs through third-party BSN; universal PA from 7/1/2025 (per plan notices).',
    assessmentPA: 'Required — the state BA policy requires PA on all BA services; ABHFL submission specifics are not publicly verifiable (plan site blocks access) — confirm channel in the portal',
    treatmentPA: 'Required — per the state policy; ABHFL-specific process details unverified — confirm via Availity/plan portal',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Aetna Better Health of Florida',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Aetna Better Health (FL)',
    h1: 'Aetna Better Health of Florida ABA / BA coverage (MMA plan).',
    metaTitle: 'Aetna Better Health of Florida (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Aetna Better Health of Florida administers the Medicaid Behavior Analysis benefit — BSN-delegated network contracting, the July 2025 universal PA start after extended carve-in continuity, BA office hours, and which process details remain unverified.',
    intro: [
      'Aetna Better Health of Florida (ABHFL) administers the Behavior Analysis benefit on the AHCA criteria with no distinct clinical policy of its own — but with one structural quirk that matters before any member is ever served: BA network contracting and credentialing are delegated to a third party, Behavioral Services Network (BSN), rather than run through Aetna directly. A transparency note up front: aetnabetterhealth.com blocks automated access, so this guide\'s process specifics (PA channels, portal details) are thinner and flagged where unverified — the state-policy requirements, which bind every MMA plan, are the reliable floor.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan (CVS Health/Aetna), in-house UM' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy — no distinct ABHFL clinical policy found' },
      { label: 'Prior auth', value: 'Required for all BA per state policy; universal PA from 7/1/2025 per plan notices' },
      { label: 'BA contracting', value: 'Delegated to Behavioral Services Network (BSN) — info@bsnnet.com, 305-907-7470' },
      { label: 'Provider support', value: 'Recurring "BA Provider Open Office Hours" covering PA, claims, Availity' },
      { label: 'Rates', value: 'Contracted; state fee schedule baseline' },
    ],
    sections: [
      {
        h2: 'The BSN contracting layer',
        body: [
          'To join ABHFL\'s BA network, providers contract and credential through Behavioral Services Network, Inc. (BSN) — info@bsnnet.com, 305-907-7470 — a distinct entry point from Aetna\'s own credentialing machinery and from every other Florida plan. For a group planning multi-plan participation, BSN is a separate pipeline to start early. Once in network, ABHFL publishes a set of BA-specific artifacts (a BA one-pager, FAQ, claims update, and change-of-provider form) and holds recurring "BA Provider Open Office Hours" covering the PA process, claims timely filing, and Availity — the best venue for resolving the process details this guide can\'t verify from published sources.',
        ],
        cites: [
          { title: 'ABHFL — BA Provider Open Office Hours notice (02/24/2025)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/pdf/ABHFL_BA_Office_Hours_Provider_Notice_02.24.2025.pdf' },
          { title: 'ABHFL — provider materials & forms (BA one-pager, FAQ)', url: 'https://www.aetnabetterhealth.com/florida/providers/materials-forms.html' },
        ],
      },
      {
        h2: 'Authorization: the state floor, and what\'s unverified',
        body: [
          'The AHCA coverage policy binds ABHFL like every MMA plan: PA on all BA services, the referral + order + CDE gate (no autism diagnosis required), Vineland-3/BASC-3 documentation, and up-to-6-month authorizations that the plan cannot make more stringent. Plan notices indicate ABHFL ran extended carve-in continuity into mid-2025, with universal PA applying to all members receiving BA from July 1, 2025 — i.e., ABHFL held the transition window open longer than the AHCA 90-day baseline. What we could not verify against a primary source, because the plan\'s site blocks automated access: the exact submission channel (general ABHFL guidance points to Availity) and any BA-specific form. Confirm the current channel in the portal or at the plan\'s BA office hours before the first submission, and treat this guide\'s state-policy facts as the dependable part.',
        ],
        cites: [
          { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
          { title: 'ABHFL — BA Provider Open Office Hours notice (02/24/2025)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/pdf/ABHFL_BA_Office_Hours_Provider_Notice_02.24.2025.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'BSN credentialing status', desc: 'BA network entry runs through BSN, not Aetna — confirm contracting is complete before quoting start dates.' },
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack applies to ABHFL requests.' },
      { title: 'Current PA channel', desc: 'Verify the live submission path (Availity/portal/fax) with the plan — published specifics are unverified.' },
    ],
    sources: [
      { title: 'ABHFL — BA Provider Open Office Hours notice (02/24/2025)', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/pdf/ABHFL_BA_Office_Hours_Provider_Notice_02.24.2025.pdf' },
      { title: 'ABHFL — provider materials & forms', url: 'https://www.aetnabetterhealth.com/florida/providers/materials-forms.html' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Aetna Better Health of Florida cover ABA?', a: 'Yes — it administers the state Behavior Analysis benefit on AHCA criteria: no autism diagnosis required, the physician referral + order + CDE gate, and PA on all BA services (universal PA from July 1, 2025 per plan notices).' },
      { q: 'How do I join Aetna Better Health of Florida\'s ABA network?', a: 'Through Behavioral Services Network (BSN), the plan\'s delegated BA contracting and credentialing partner — info@bsnnet.com or 305-907-7470 — not through Aetna directly.' },
      { q: 'Where do ABHFL BA authorizations get submitted?', a: 'The plan\'s general PA guidance points to Availity, but ABHFL\'s BA-specific submission details aren\'t publicly verifiable — confirm the current channel in the portal or at the plan\'s BA Provider Open Office Hours.' },
    ],
  },

  'molina-healthcare-florida': {
    slug: 'molina-healthcare-florida',
    family: 'molina',
    cardDesc: 'Administers BA in-house on state criteria; a BA QRG exists, but specifics aren\'t publicly verifiable.',
    assessmentPA: 'Required — the state BA policy requires PA on all BA services (CDE + documentation with requests); Molina-specific submission details are not publicly verifiable — use the plan\'s PA Code Lookup Tool and portal',
    treatmentPA: 'Required — per the state policy; check Molina\'s Prior Authorization Code Lookup Tool for current specifics',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Molina Healthcare of Florida',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Molina Healthcare (FL)',
    h1: 'Molina Healthcare of Florida ABA / BA coverage (MMA plan).',
    metaTitle: 'Molina Healthcare of Florida (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of Florida administers the Medicaid Behavior Analysis benefit since the February 2025 carve-in — in-house UM on state criteria, the BA Quick Reference Guide, and which process specifics remain publicly unverifiable.',
    intro: [
      'Molina Healthcare of Florida administers the Behavior Analysis benefit in-house — it published a carve-in notice ("Molina Healthcare Will Provide Behavior Analysis (BA) Services") and maintains a BA Quick Reference Guide with October 2025 and 2026 editions. Honesty about the limits of this guide: Molina\'s site blocks automated access, so it is the weakest-verified of Florida\'s nine plans here. No evidence of distinct clinical criteria surfaced, which means the reliable playbook is the state one — the AHCA policy binds Molina like every MMA plan, and plan-specific submission mechanics should be confirmed in the portal.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan (Molina), in-house UM' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy — no distinct Molina clinical criteria found' },
      { label: 'Prior auth', value: 'Required for all BA per state policy; check Molina\'s PA Code Lookup Tool' },
      { label: 'Plan resources', value: 'BA Quick Reference Guide (10/2025 and 2026 editions) — access-restricted' },
      { label: 'Verification note', value: 'Molina blocks automated access — confirm specifics in the provider portal' },
      { label: 'Rates', value: 'Contracted; state fee schedule baseline' },
    ],
    sections: [
      {
        h2: 'What\'s verified, and what to confirm in the portal',
        body: [
          'Verified: Molina administers BA in-house since the February 1, 2025 carve-in, maintains a BA Quick Reference Guide (updated October 2025, with a 2026 edition), and — like every MMA plan — must comply with the AHCA coverage policy without imposing more stringent limits. That gives you the dependable core: PA on all BA services with the CDE and required documentation, the referral + order gate with no autism-diagnosis requirement, Vineland-3/BASC-3 scoring reports, and up-to-6-month authorization periods. Not publicly verifiable (the plan\'s site blocks automated retrieval): the exact submission channel, forms, and turnaround commitments. Molina\'s Prior Authorization Code Lookup Tool and provider portal are the authoritative sources for those — build the first Molina submission around a portal session, not this page.',
        ],
        cites: [
          { title: 'Molina FL — BA Quick Reference Guide 2026 (access-restricted)', url: 'https://www.molinahealthcare.com/providers/fl/medicaid/comm/-/media/D0605825716B47F8819AD3B554626A86.ashx' },
          { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack applies to Molina requests.' },
      { title: 'Current QRG + PA lookup', desc: 'Pull the latest BA Quick Reference Guide and run the codes through Molina\'s PA lookup tool in the portal.' },
      { title: 'Submission channel', desc: 'Confirm portal vs. fax and any Molina-specific form directly with the plan — not publicly verifiable.' },
    ],
    sources: [
      { title: 'Molina FL — BA Quick Reference Guide 2026 (access-restricted)', url: 'https://www.molinahealthcare.com/providers/fl/medicaid/comm/-/media/D0605825716B47F8819AD3B554626A86.ashx' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of Florida cover ABA?', a: 'Yes — it administers the state Behavior Analysis benefit in-house since the February 2025 carve-in, on AHCA criteria: no autism diagnosis required, referral + order + CDE, PA on all BA services.' },
      { q: 'Where are Molina\'s Florida BA rules published?', a: 'In its BA Quick Reference Guide (October 2025 / 2026 editions) and PA Code Lookup Tool — both access-restricted, so confirm current specifics in the Molina provider portal. Clinically, the AHCA coverage policy governs.' },
    ],
  },

  'community-care-plan-florida': {
    slug: 'community-care-plan-florida',
    cardDesc: 'BA fully delegated to Therapy Network of FL — auths AND claims; fastest published turnarounds.',
    assessmentPA: 'Required — all codes on the FL BA fee schedule need PA from Therapy Network of Florida (portal at asp.healthsystemone.com/hs1providers; fax backup)',
    treatmentPA: 'Required — via TNFL; standard approvals within 5 calendar days, expedited within 2',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Community Care Plan (FL)',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Community Care Plan',
    h1: 'Community Care Plan ABA / BA coverage (Florida MMA plan).',
    metaTitle: 'Community Care Plan (Florida Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Community Care Plan — the provider-owned South Florida MMA plan — administers Behavior Analysis: full delegation of authorizations and claims to Therapy Network of Florida, 5-day standard / 2-day expedited turnarounds, and the state criteria underneath.',
    intro: [
      'Community Care Plan (CCP) — the provider-owned plan of Broward Health and Memorial Healthcare System, with a South Florida footprint — delegates its entire Behavior Analysis function to Therapy Network of Florida (TNFL): prior authorizations AND claims. Day to day, a practice serving CCP members works with TNFL, not CCP. The plan\'s BA provider manual copies the AHCA coverage criteria nearly verbatim, and its published turnarounds are the fastest of the nine plans: 5 calendar days standard, 2 expedited.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC MMA plan — provider-owned (Broward Health + Memorial), South FL' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy, near-verbatim in the CCP BA manual' },
      { label: 'Prior auth', value: 'Required for every code on the FL BA fee schedule — via Therapy Network of FL' },
      { label: 'Turnarounds', value: '5 calendar days standard / 2 expedited — fastest published of the nine' },
      { label: 'Claims', value: 'Also to TNFL — portal at therapynetwork.com; paper to Therapy Network of Florida' },
      { label: 'Age scope', value: 'Members 21 and over excluded (per the state benefit)' },
    ],
    sections: [
      {
        h2: 'The TNFL delegation: one counterparty for everything',
        body: [
          'CCP\'s BA manual is direct: behavior assessments, reassessments, and all codes on the Florida BA Fee Schedule require prior authorization by Therapy Network. Requests go through the Provider Web Portal at asp.healthsystemone.com/hs1providers (fax available as backup), and approvals and claims status run 24/7 on therapynetwork.com — claims themselves also go to TNFL, with paper claims addressed to Therapy Network of Florida. Standard/routine approvals come within 5 calendar days and expedited/urgent within 2; when a TNFL clinician recommends denial, the recommendation completes within 4 calendar days with referral to the plan\'s Medical Director if the reviewing clinician and provider disagree. Services not on the Florida BA fee schedule are non-covered, and members 21 and over are excluded — consistent with the state benefit\'s under-21 scope.',
        ],
        cites: [
          { title: 'Community Care Plan — Behavior Analysis Provider Manual (2025-01-29, hosted by TNFL)', url: 'https://www.therapynetwork.com/state_links/ba/manuals/Community-Care-Plan-Behavior-Analysis-Provider-Manual.pdf' },
        ],
      },
      {
        h2: 'The state criteria, unchanged underneath',
        body: [
          'CCP\'s coverage criteria and exclusions track the AHCA policy nearly verbatim: the referral + order + CDE gate with no autism-diagnosis requirement, Vineland-3/BASC-3 documentation, up-to-6-month authorizations, and the 40-hour weekly ceiling as prior-authorized. The operative difference is purely who you talk to — for intake, that means TNFL portal credentials are the day-one setup task, and the 2-day expedited pathway is worth knowing when a family\'s clinical urgency justifies it.',
        ],
        cites: [
          { title: 'Community Care Plan — Behavior Analysis Provider Manual (2025-01-29)', url: 'https://www.therapynetwork.com/state_links/ba/manuals/Community-Care-Plan-Behavior-Analysis-Provider-Manual.pdf' },
          { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'TNFL portal access', desc: 'Auths at asp.healthsystemone.com/hs1providers, status and claims at therapynetwork.com — set both up first.' },
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack rides with every TNFL request.' },
      { title: 'Urgency assessment', desc: 'The 2-calendar-day expedited pathway exists — flag clinically urgent cases at intake.' },
    ],
    sources: [
      { title: 'Community Care Plan — Behavior Analysis Provider Manual (2025-01-29)', url: 'https://www.therapynetwork.com/state_links/ba/manuals/Community-Care-Plan-Behavior-Analysis-Provider-Manual.pdf' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Community Care Plan cover ABA?', a: 'Yes — the state Behavior Analysis benefit on AHCA criteria (no autism diagnosis required), with the entire BA function — authorizations and claims — delegated to Therapy Network of Florida.' },
      { q: 'How fast does CCP approve BA authorizations?', a: 'The fastest published turnarounds of Florida\'s nine plans: 5 calendar days standard, 2 calendar days expedited, via Therapy Network of Florida.' },
      { q: 'Where do CCP ABA claims go?', a: 'To Therapy Network of Florida, not CCP — electronically via the TNFL portal, or on paper addressed to Therapy Network of Florida.' },
    ],
  },

  'florida-community-care': {
    slug: 'florida-community-care',
    cardDesc: 'CIDD-focused specialty plan; in-house UM, PA by fax, email, or portal; 120-day continuity honored.',
    assessmentPA: 'Required — FCC ABA PA Request Form by fax 305-675-6138, email FCCUMDepartment@FCCHealthPlan.com, or the FCC Provider Portal',
    treatmentPA: 'Required — same channels, via FCC\'s in-house Utilization Department',
    dxRequired: 'No — state BA policy applies: physician referral + order + CDE, no autism-diagnosis requirement',
    payer: 'Florida Community Care',
    state: 'FL', kind: 'medicaid-mco', parent: 'Florida Medicaid (AHCA)',
    pill: 'Payer Guide · Florida Community Care',
    h1: 'Florida Community Care ABA / BA coverage (specialty plan).',
    metaTitle: 'Florida Community Care (Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Florida Community Care — the Independent Living Systems specialty plan serving the CIDD population — administers Behavior Analysis: the FCC ABA PA form by fax, email, or portal, in-house UM, and 120-day carve-in continuity.',
    intro: [
      'Florida Community Care (FCC), operated by Independent Living Systems, is the smallest and most specialized of the nine plans — focused on long-term care and the CIDD (intellectual/developmental disability) population, which makes its membership unusually ABA-relevant per capita. The BA workflow is lightweight and in-house: a dedicated FCC ABA Prior Authorization Request Form submitted by fax, email (unusual among the nine), or the provider portal to FCC\'s own Utilization Department, on the state clinical criteria.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'SMMC specialty plan (Independent Living Systems) — LTC/CIDD focus' },
      { label: 'Clinical rules', value: 'AHCA BA Coverage Policy; no external UM vendor' },
      { label: 'Prior auth', value: 'FCC ABA PA form — fax 305-675-6138, email FCCUMDepartment@FCCHealthPlan.com, or portal' },
      { label: 'Continuity at carve-in', value: 'Ongoing BA auths honored for the full CoC period, minimum 120 days' },
      { label: 'Claims', value: 'Payer ID FLCCR via Availity/clearinghouse; portal at secure.healthx.com' },
      { label: 'Support', value: 'Provider call center 1-833-322-7526' },
    ],
    sections: [
      {
        h2: 'How FCC runs BA authorization',
        body: [
          'Submit the Florida Community Care ABA Prior Authorization Request Form to the in-house Utilization Department by fax (305-675-6138), email (FCCUMDepartment@FCCHealthPlan.com — email PA submission is unusual among Florida\'s plans and handy for small teams), or through the FCC Provider Portal at secure.healthx.com. The clinical criteria are the state\'s: referral + order + CDE at entry, no autism-diagnosis requirement, Vineland-3/BASC-3 documentation, authorizations up to 6 months. At the February 2025 carve-in, FCC honored ongoing BA authorizations for the entirety of the continuity-of-care period — a minimum of 120 days after enrollment. Claims run under payer ID FLCCR via Availity or your clearinghouse, and the provider call center is 1-833-322-7526. Given the CIDD focus, expect members with rich existing clinical records — leverage them for the CDE and the most specific supporting diagnoses.',
        ],
        cites: [
          { title: 'Florida Community Care — Behavioral Analysis Services (provider page)', url: 'https://fcchealthplan.com/ba-services/' },
        ],
      },
    ],
    collect: [
      { title: 'Referral + order + CDE', desc: 'The state eligibility gate applies; no autism diagnosis required — existing CIDD records often cover much of it.' },
      { title: 'Vineland-3 & BASC-3 scoring reports', desc: 'The state documentation stack applies to FCC requests.' },
      { title: 'Preferred submission channel', desc: 'Fax, email, or portal all work — standardize one internally for tracking.' },
      { title: 'Claims setup', desc: 'Payer ID FLCCR via Availity/clearinghouse before the first date of service.' },
    ],
    sources: [
      { title: 'Florida Community Care — Behavioral Analysis Services (provider page)', url: 'https://fcchealthplan.com/ba-services/' },
      { title: 'Florida Medicaid BA Services Coverage Policy (Dec 2024)', url: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf' },
    ],
    faq: [
      { q: 'Does Florida Community Care cover ABA?', a: 'Yes — the state Behavior Analysis benefit on AHCA criteria (no autism diagnosis required), authorized by FCC\'s in-house Utilization Department via its ABA PA form.' },
      { q: 'How do I submit a BA authorization to FCC?', a: 'The FCC ABA Prior Authorization Request Form by fax to 305-675-6138, email to FCCUMDepartment@FCCHealthPlan.com, or through the FCC Provider Portal — email submission is an FCC-specific convenience.' },
    ],
  },

  'aetna-florida': {
    slug: 'aetna-florida',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the § 627.6686 Geller Act mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Florida',
    state: 'FL', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Florida',
    h1: 'Aetna ABA coverage in Florida: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Florida: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Florida families — the national clinical policy, prior authorization, the Steven A. Geller Autism Coverage Act (§ 627.6686) mandate with its Down syndrome extension, Florida\'s no-license BCBA landscape, and what intake should verify.',
    intro: [
      'For an intake team in Florida, an Aetna card means three layers at once: the carrier\'s national clinical policy, Florida\'s autism insurance mandate (the Steven A. Geller Autism Coverage Act, § 627.6686, Fla. Stat.), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: '§ 627.6686, Fla. Stat. (insurers) + § 641.31098 (HMOs) — Geller Act' },
      { label: 'Mandate age', value: 'Under 18 (or 18+ still in high school), dx of a developmental disability by age 8' },
      { label: 'Mandate caps', value: '$36,000/yr; $200,000 lifetime (CPI-adjusted; parity-limited)' },
      { label: 'Exempt from mandate', value: 'Individual, individually underwritten, and small-group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'None — no FL behavior analyst license; BCBA/FL-CBA credential (s. 393.17)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Florida',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Florida is the legal floor underneath it: the state mandate below governs what covered group plans must include, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. Note the contrast with Florida Medicaid, which requires no autism diagnosis at all — on the commercial side, Aetna\'s ASD-only rule is strict. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Florida.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Florida mandate: what it guarantees (and doesn\'t)',
        body: [
          'The Steven A. Geller Autism Coverage Act (2008) requires coverage in group plans issued or delivered in Florida after April 1, 2009 — in practice fully-insured large-group plans and the state employee plan under § 627.6686, with companion § 641.31098 reaching large-group HMO contracts. It explicitly excludes individual-market, individually underwritten, and small-employer plans. The eligible individual is narrow: under 18 (or 18 and older but still in high school) AND diagnosed with a developmental disability at 8 years of age or younger. Covered services include well-child ASD screening plus speech, OT, PT, and applied behavior analysis — and unusually for a state mandate, it covers treatment of Down syndrome as well as ASD. ABA benefits cap at $36,000 annually and $200,000 lifetime, with an annual CPI-medical adjustment each January 1; ABA providers must be certified under s. 393.17, Fla. Stat. or licensed under chapters 490/491. Self-funded ERISA plans sit outside state reach, and because ASD/ABA is treated as a mental health benefit, MHPAEA\'s ban on dollar-value treatment limits arguably neuters the caps for parity-subject plans — treat the caps-vs-parity question as analysis, not settled guidance. Florida DFS consumer guidance notes that individual and small-group plans, though outside the mandate, generally cover ABA via the ACA EHB benchmark plus parity.',
        ],
        cites: [
          { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
          { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
        ],
      },
      {
        h2: 'Aetna Medicaid in Florida',
        body: [
          'A family saying "we have Aetna" in Florida may actually be on the carrier\'s Medicaid plan — Aetna Better Health of Florida, one of the nine SMMC MMA plans administering Behavior Analysis since February 2025 — which follows the state Medicaid rules (no autism diagnosis required), not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan. No Florida-specific Aetna commercial ABA policy, form, or supplement exists — the national CPBs plus the state mandate are the whole picture.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Florida',
        body: [
          'Florida has no state behavior-analyst license — it is absent from the BACB\'s list of states with licensure laws. The operative credential is BACB certification (BCBA/BCaBA/RBT); s. 393.17, Fla. Stat. requires the state to recognize BACB certification, and legacy Florida Certified Behavior Analysts (FL-CBA, administered by BACB since 2003) remain recognized — the Geller Act itself keys ABA coverage to s. 393.17 certification or chapter 490/491 licensure. On rates: Aetna does not publish commercial ABA fee schedules for Florida (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Florida Medicaid schedule is the local floor to benchmark against, and it is low: 97153 pays $12.26 per 15-minute unit.',
        ],
        cites: [
          { title: 'BACB — U.S. Licensure of Behavior Analysts (FL not listed)', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured large-group (mandate applies) vs. individual/small-group or self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial vs. Aetna Better Health of Florida (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — Aetna\'s commercial policy is ASD-only.' },
      { title: 'Age + diagnosis-age history', desc: 'The mandate keys to under-18 (or in high school) with the developmental-disability dx made by age 8 — flag edge cases for parity analysis.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
      { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
      { title: 'BACB — U.S. Licensure of Behavior Analysts', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Florida?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Florida\'s Geller Act (§ 627.6686) for covered fully-insured group plans. Individual, small-group, and self-funded employer plans sit outside the mandate, so always verify plan funding type first.' },
      { q: 'What does the Florida autism mandate require?', a: 'For covered group plans: screening, speech, OT, PT, and ABA for eligible individuals — under 18 (or 18+ in high school) diagnosed with a developmental disability by age 8 — with ABA capped at $36,000/year and $200,000 lifetime (CPI-adjusted). Unusually, it covers Down syndrome as well as ASD. Federal parity limits how hard the dollar caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Florida?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Florida Medicaid BA schedule (97153 at $12.26/unit — among the lowest in the Southeast) and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-florida': {
    slug: 'cigna-florida',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the § 627.6686 Geller Act mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Florida',
    state: 'FL', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Florida',
    h1: 'Cigna / Evernorth ABA coverage in Florida: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Florida: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Florida families — the national EN0499 policy with no assessment PA, the Steven A. Geller Autism Coverage Act (§ 627.6686) mandate with its Down syndrome extension, Florida\'s no-license BCBA landscape, and what intake should verify.',
    intro: [
      'For an intake team in Florida, a Cigna card means three layers at once: the carrier\'s national clinical policy, Florida\'s autism insurance mandate (the Steven A. Geller Autism Coverage Act, § 627.6686, Fla. Stat.), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: '§ 627.6686, Fla. Stat. (insurers) + § 641.31098 (HMOs) — Geller Act' },
      { label: 'Mandate age', value: 'Under 18 (or 18+ still in high school), dx of a developmental disability by age 8' },
      { label: 'Mandate caps', value: '$36,000/yr; $200,000 lifetime (CPI-adjusted; parity-limited)' },
      { label: 'Exempt from mandate', value: 'Individual, individually underwritten, and small-group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'None — no FL behavior analyst license; BCBA/FL-CBA credential (s. 393.17)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Florida',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Florida is the legal floor underneath it: the state mandate below governs what covered group plans must include, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Florida.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Florida mandate: what it guarantees (and doesn\'t)',
        body: [
          'The Steven A. Geller Autism Coverage Act (2008) requires coverage in group plans issued or delivered in Florida after April 1, 2009 — in practice fully-insured large-group plans and the state employee plan under § 627.6686, with companion § 641.31098 reaching large-group HMO contracts. It explicitly excludes individual-market, individually underwritten, and small-employer plans. The eligible individual is narrow: under 18 (or 18 and older but still in high school) AND diagnosed with a developmental disability at 8 years of age or younger. Covered services include well-child ASD screening plus speech, OT, PT, and applied behavior analysis — and unusually for a state mandate, it covers treatment of Down syndrome as well as ASD (note the friction: EN0499 itself is ASD-only, so a mandate-covered Down syndrome request rides on the statute, not the carrier policy). ABA benefits cap at $36,000 annually and $200,000 lifetime, with an annual CPI-medical adjustment; ABA providers must be certified under s. 393.17, Fla. Stat. or licensed under chapters 490/491. Self-funded ERISA plans sit outside state reach, and MHPAEA\'s ban on dollar-value treatment limits arguably neuters the caps for parity-subject plans. Florida DFS consumer guidance notes individual and small-group plans generally cover ABA via the ACA EHB benchmark plus parity even though the mandate doesn\'t reach them.',
        ],
        cites: [
          { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
          { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
        ],
      },
      {
        h2: 'No Florida-specific Cigna policy exists',
        body: [
          'We checked the current EN0499 text directly: it contains no Florida mention and no Florida carve-out — unlike Virginia, where the policy excludes fully-insured business, Florida members are handled under the standard EN0499 criteria (ASD diagnosis F84.0–F84.9 required, F84.2 excluded), subject to any controlling state mandate at the benefit-plan level. That means the no-assessment-PA fast path applies to Florida Cigna members, and Florida-specific answers come from benefits verification — plan funding type, mandate applicability, benefit limits — not from a carrier document. Cigna operates no Florida Medicaid MMA plan, so there is no Medicaid cross-check to run on a Cigna card.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Florida',
        body: [
          'Florida has no state behavior-analyst license — it is absent from the BACB\'s list of states with licensure laws. The operative credential is BACB certification (BCBA/BCaBA/RBT); s. 393.17, Fla. Stat. requires the state to recognize BACB certification, and legacy Florida Certified Behavior Analysts (FL-CBA, administered by BACB since 2003) remain recognized — the Geller Act itself keys ABA coverage to s. 393.17 certification or chapter 490/491 licensure. On rates: Cigna does not publish commercial ABA fee schedules for Florida (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Florida Medicaid schedule is the local floor to benchmark against, and it is low: 97153 pays $12.26 per 15-minute unit.',
        ],
        cites: [
          { title: 'BACB — U.S. Licensure of Behavior Analysts (FL not listed)', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured large-group (mandate applies) vs. individual/small-group or self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — then the assessment can start without PA.' },
      { title: 'Age + diagnosis-age history', desc: 'The mandate keys to under-18 (or in high school) with the developmental-disability dx made by age 8 — flag edge cases for parity analysis.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
      { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
      { title: 'BACB — U.S. Licensure of Behavior Analysts', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Florida?', a: 'Yes — under national policy EN0499 for ASD (no PA on assessment codes 97151/97152/0362T), layered on Florida\'s Geller Act (§ 627.6686) for covered fully-insured group plans. Self-funded, individual, and small-group plans sit outside the mandate, so verify plan funding type first.' },
      { q: 'What does the Florida autism mandate require?', a: 'For covered group plans: screening, speech, OT, PT, and ABA for eligible individuals — under 18 (or 18+ in high school) diagnosed with a developmental disability by age 8 — with ABA capped at $36,000/year and $200,000 lifetime (CPI-adjusted). It also covers Down syndrome, and federal parity limits how hard the dollar caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Florida?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Florida Medicaid BA schedule (97153 at $12.26/unit) and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-florida': {
    slug: 'unitedhealthcare-florida',
    family: 'unitedhealthcare',
    cardDesc: 'Optum criteria (BH803ABASCC) + a real FL State Mandates entry: Down syndrome ABA covered.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Florida',
    state: 'FL', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Florida',
    h1: 'UnitedHealthcare / Optum ABA coverage in Florida: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Florida: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Florida families — the national two-step authorization, Optum\'s Florida State Mandates entry covering ABA for Down syndrome, the Geller Act (§ 627.6686), Florida\'s no-license BCBA landscape, and what intake should verify.',
    intro: [
      'For an intake team in Florida, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Florida\'s autism insurance mandate (the Steven A. Geller Autism Coverage Act, § 627.6686, Fla. Stat.), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order — and Florida is one of the states where Optum publishes a genuine state-specific supplement, extending ABA coverage to Down syndrome for mandate-covered plans.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD per the national policy; + Down syndrome for FL mandate-covered plans' },
      { label: 'State mandate', value: '§ 627.6686, Fla. Stat. (insurers) + § 641.31098 (HMOs) — Geller Act' },
      { label: 'Mandate age', value: 'Under 18 (or 18+ still in high school), dx of a developmental disability by age 8' },
      { label: 'Mandate caps', value: '$36,000/yr; $200,000 lifetime (CPI-adjusted; parity-limited)' },
      { label: 'Exempt from mandate', value: 'Individual, individually underwritten, and small-group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'None — no FL behavior analyst license; BCBA/FL-CBA credential (s. 393.17)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Florida',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. That clinical policy is national — what changes in Florida is the legal floor underneath it: the state mandate below governs what covered group plans must include, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Florida.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Florida mandate: what it guarantees (and doesn\'t)',
        body: [
          'The Steven A. Geller Autism Coverage Act (2008) requires coverage in group plans issued or delivered in Florida after April 1, 2009 — in practice fully-insured large-group plans and the state employee plan under § 627.6686, with companion § 641.31098 reaching large-group HMO contracts. It explicitly excludes individual-market, individually underwritten, and small-employer plans. The eligible individual is narrow: under 18 (or 18 and older but still in high school) AND diagnosed with a developmental disability at 8 years of age or younger. Covered services include well-child ASD screening plus speech, OT, PT, and applied behavior analysis — and unusually for a state mandate, it covers treatment of Down syndrome as well as ASD. ABA benefits cap at $36,000 annually and $200,000 lifetime, with an annual CPI-medical adjustment; ABA providers must be certified under s. 393.17, Fla. Stat. or licensed under chapters 490/491. Self-funded ERISA plans sit outside state reach, and MHPAEA\'s ban on dollar-value treatment limits arguably neuters the caps for parity-subject plans. Florida DFS consumer guidance notes individual and small-group plans generally cover ABA via the ACA EHB benchmark plus parity even though the mandate doesn\'t reach them.',
        ],
        cites: [
          { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
          { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
        ],
      },
      {
        h2: 'Optum\'s Florida-specific criteria: Down syndrome ABA',
        body: [
          'Florida has its own entry in Optum\'s ABA State Mandates supplemental criteria (policy BH 803ABA STM12026, effective January 2026): for Florida members on mid- and large-group fully-insured plans (not individual or small-group), ABA is covered for the treatment of Down syndrome, and speech, physical, and occupational therapy plus ABA must be covered to the same extent as the existing Florida autism mandate. That makes UnitedHealthcare the carrier whose published criteria explicitly operationalize the Geller Act\'s Down syndrome extension — for an intake team, a Down syndrome inquiry on a fully-insured mid/large-group UHC plan is a coverable case, not an automatic ASD-only decline. Confirm funding type and group size before promising it.',
        ],
        cites: [
          { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA STM12026, Florida entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Florida',
        body: [
          'A family saying "we have UnitedHealthcare" in Florida may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of Florida, whose Behavior Analysis program Optum has managed since the February 2025 SMMC carve-in. That plan follows the state Medicaid rules (no autism diagnosis required, portal-only PA on Provider Express), not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
        cites: [
          { title: 'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Florida',
        body: [
          'Florida has no state behavior-analyst license — it is absent from the BACB\'s list of states with licensure laws. The operative credential is BACB certification (BCBA/BCaBA/RBT); s. 393.17, Fla. Stat. requires the state to recognize BACB certification, and legacy Florida Certified Behavior Analysts (FL-CBA, administered by BACB since 2003) remain recognized — the Geller Act itself keys ABA coverage to s. 393.17 certification or chapter 490/491 licensure. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Florida (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. The Florida Medicaid schedule is the local floor to benchmark against, and it is low: 97153 pays $12.26 per 15-minute unit.',
        ],
        cites: [
          { title: 'BACB — U.S. Licensure of Behavior Analysts (FL not listed)', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type + group size', desc: 'Fully insured mid/large-group triggers both the mandate and Optum\'s Down syndrome coverage; individual/small-group and self-funded ERISA are exempt.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Florida (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD with a validated tool for the standard path — or the Down syndrome diagnosis for the Florida mandate path.' },
      { title: 'Age + diagnosis-age history', desc: 'The mandate keys to under-18 (or in high school) with the developmental-disability dx made by age 8 — flag edge cases for parity analysis.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA STM12026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'Fla. Stat. § 627.6686 (2024)', url: 'https://www.flsenate.gov/Laws/statutes/2024/627.6686' },
      { title: 'FL Dept. of Financial Services — ASD coverage overview', url: 'https://www.myfloridacfo.com/division/consumers/consumerprotections/autism-spectrum-disorder' },
      { title: 'BACB — U.S. Licensure of Behavior Analysts', url: 'https://www.bacb.com/u-s-licensure-of-behavior-analysts/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Florida?', a: 'Yes — under Optum\'s national two-step authorization for ASD, layered on Florida\'s Geller Act (§ 627.6686) for covered fully-insured group plans. Self-funded, individual, and small-group plans sit outside the mandate, so verify plan funding type first.' },
      { q: 'Does UnitedHealthcare cover ABA for Down syndrome in Florida?', a: 'For mid- and large-group fully-insured Florida plans, yes — Optum\'s ABA State Mandates supplement explicitly covers ABA for the treatment of Down syndrome, mirroring the Florida mandate\'s unusual Down syndrome extension. It does not apply to individual or small-group plans; confirm funding type and group size.' },
      { q: 'What does the Florida autism mandate require?', a: 'For covered group plans: screening, speech, OT, PT, and ABA for eligible individuals — under 18 (or 18+ in high school) diagnosed with a developmental disability by age 8 — with ABA capped at $36,000/year and $200,000 lifetime (CPI-adjusted). Federal parity limits how hard the dollar caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Florida?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Florida Medicaid BA schedule (97153 at $12.26/unit) and treat rate-setting as part of contracting.' },
    ],
  },
};
