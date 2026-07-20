import type { PayerConfig } from './types.js';

export const missouriPayers: Record<string, PayerConfig> = {
  'missouri-medicaid': {
    slug: 'missouri-medicaid',
    cardDesc: 'Full FFS carve-out: one payer, one fax precert (form 2575-045), no MCO contracting.',
    assessmentPA: 'Required — all ABA needs precertification (sole exception: school-based ABA in an IEP); form 2575-045 faxed to (573) 635-6516 with the diagnostic evaluation',
    treatmentPA: 'Required — precertified up to 6 months; continuation needs the current plan, progress graphs, and barriers if progress isn\'t evident',
    dxRequired: 'ASD (F84.0, F84.3, F84.5, F84.8) by a licensed physician or psychologist for the standard benefit — but under EPSDT/HCY, ABA is also covered for other diagnoses when medically necessary',
    payer: 'MO HealthNet (Missouri Medicaid)',
    state: 'MO', kind: 'state-medicaid',
    pill: 'Payer Guide · MO HealthNet',
    h1: 'MO HealthNet (Missouri Medicaid) ABA coverage: the intake guide.',
    metaTitle: 'MO HealthNet (Missouri Medicaid) ABA Coverage, Rates & Precert Guide | Carelu',
    metaDescription:
      'How MO HealthNet covers ABA — the full fee-for-service carve-out from managed care, the single fax precertification (form 2575-045), EPSDT coverage beyond autism, the RBT/BCBA modifier rate split, 6-month auth periods, and the mandatory RBT credential rule.',
    intro: [
      'Missouri runs statewide Medicaid managed care — Healthy Blue, Home State Health, UnitedHealthcare, and the Show Me Healthy Kids specialty plan — but for ABA, none of that matters: the benefit is fully carved out of managed care, and every MO HealthNet member receives ABA on a fee-for-service basis directly from the state. The Behavioral Health Services Manual says it plainly, and the plans\' own manuals confirm it. For an ABA practice, MO HealthNet is effectively a single-payer state: one precertification pathway (a form faxed to the state help desk — no UM vendor, no portal), one fee schedule, and zero MCO contracting or credentialing for ABA. The whole intake playbook below is about working that one pathway well.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21; ASD standard benefit, plus other diagnoses under EPSDT/HCY when medically necessary' },
      { label: 'Structure', value: 'Full FFS carve-out — MCO enrollees included; no MCO ever touches ABA' },
      { label: 'Precert', value: 'Required for everything except IEP school-based ABA — form 2575-045 by fax to (573) 635-6516' },
      { label: 'Auth periods', value: 'Up to 6 months; approved hours and dates come back by fax' },
      { label: 'Rates (per 15 min)', value: '97153: $20.13 (HO/HN) vs. $16.37 (HM technician/RBT); 97151/97155/97156: $25.26 (HO)' },
      { label: 'RBT rule', value: 'National RBT credential mandatory — 90-day grace from passing the competency assessment' },
      { label: 'Licensure', value: 'Missouri LBA (RSMo 337.315); psychologists need MHD ABA-specialty approval' },
      { label: 'Staff screening', value: 'RBTs: BACB background + abuse-registry check; LBA/LaBA: MSHP + FBI fingerprints; FCSR not automatic for ABA' },
    ],
    sections: [
      {
        h2: 'The carve-out: why there are no MCO guides for Missouri',
        body: [
          'The Behavioral Health Services Manual states that participants enrolled in a MO HealthNet Managed Care health plan receive ABA services on a FFS basis, outside the managed-care benefit package — and the plans corroborate it in their own documents. Healthy Blue\'s provider manual lists ABA among services "reimbursed by the state agency on a fee-for-service basis," and the Show Me Healthy Kids manual\'s benefit grid routes ABA to "MO HealthNet Fee For Service." So whichever card a family shows — Healthy Blue, Home State Health, UnitedHealthcare Community Plan, or Show Me Healthy Kids (the statewide specialty plan for foster-care and adoption-subsidy children, a population with elevated behavioral needs) — the ABA answer is identical: state FFS, state precert, state fee schedule. MCO case managers are a referral source, not a payer; note that OT/PT/speech remain plan-covered with the MCO, which makes multi-service kids a coordination point, not a contracting one.',
        ],
        cites: [
          { title: 'MO HealthNet Behavioral Health Services Manual, §1.16 ABA Services (May 2026)', url: 'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx' },
          { title: 'Healthy Blue MO HealthNet Managed Care Provider Manual', url: 'https://provider.healthybluemo.com/docs/gpp/MO_CAID_HealthNetManagedCareProviderManual.pdf' },
          { title: 'Show Me Healthy Kids Provider Reference Manual (benefit grid)', url: 'https://www.homestatehealth.com/content/dam/centene/home-state-health/pdfs/HSH-SMHK-Provider-Manual_508%20Compliant%20063022.pdf' },
        ],
      },
      {
        h2: 'Precertification: one form, one fax number',
        body: [
          'All ABA services require precertification — the manual\'s sole exception is school-based ABA delivered under an IEP. The mechanics are refreshingly analog: complete the "Applied Behavior Analysis Request for Precertification" form (form 2575-045) and fax it to the MHD Behavioral Health Services help desk at (573) 635-6516. The state reviews in-house and faxes back the approved hours and the precert start and end dates. The initial "ABA Assessment for Intervention Planning" precert requires the diagnostic evaluation attached; the initial intervention precert requires that assessment plus the intervention plan; and continued intervention requires the current plan, progress data and graphs, and — where progress isn\'t evident — identified barriers and strategies. Intervention may be precertified for up to six months from the start date, with a new precert required to continue beyond it.',
          'Eligibility is diagnosis-flexible in a way intake teams should not miss: the standard benefit requires a participant under 21 with a diagnostic evaluation by a licensed physician or licensed psychologist producing an ASD diagnosis (precertifiable ICD-10 codes F84.0, F84.3, F84.5, F84.8) and recommending ABA as medically necessary — with evaluations expected to follow the Missouri Autism Guidelines Initiative\'s best-practice guidelines. But under the Healthy Children and Youth (EPSDT) program, ABA is also covered for participants under 21 with other diagnoses when medically necessary. An autism diagnosis is not an absolute gate — don\'t turn a non-ASD family away before the EPSDT analysis.',
        ],
        cites: [
          { title: 'MO HealthNet Behavioral Health Services Manual, §1.16 ABA Services (May 2026)', url: 'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx' },
          { title: 'MO HealthNet Behavioral Health Services page (form 2575-045 + bulletins)', url: 'https://mydss.mo.gov/mhd/behavioral-health-services' },
          { title: 'MHD ABA provider training (April 2022)', url: 'https://dss.mo.gov/mhd/providers/education/files/rodgers-applied-behavior-analysis.pdf' },
        ],
      },
      {
        h2: 'Rates: the modifier scheme is the revenue model',
        body: [
          'Missouri pays by rendering-practitioner tier, flagged with modifiers: HO = behavior analyst or psychologist, HN = assistant behavior analyst, HM = behavior technician/RBT (billed by the licensed supervisor), U8 = home or other place of service, TM = telemedicine. Per 15-minute unit from the official fee schedule: 97151 assessment pays $25.26 (max 32 units); 97153 direct treatment pays $20.13 at both the HO and HN tiers but $16.37 with the HM technician modifier (raised effective 7/1/2024 from $17.73; max 32 units — 8 hours/day); 97155 pays $25.26 HO ($27.46 with U8 in-home, $17.73 HN; max 24 units); 97156 family training pays $25.26 HO / $20.13 HN (max 16 units). Two quirks worth wiring into billing: the fee file marks the TM telemedicine rows as NOT requiring prior authorization, and technicians\' claims must never carry the U8 modifier. The daily unit maximums are real — an October 2022 hot tip confirmed a system fix after 97153/97155 claims wrongly denied on limit restrictions.',
        ],
        cites: [
          { title: 'MHD Applied Behavioral Analysis fee schedule (official download portal)', url: 'https://apps.dss.mo.gov/fmsfeeschedules/DLFiles.aspx' },
        ],
      },
      {
        h2: 'Staffing rules: the RBT mandate and enrollment structure',
        body: [
          'Missouri made the national RBT credential mandatory with a 90-day grace period: a behavior technician (18+, high-school diploma, 40-hour RBT training, passed initial competency assessment) may render services for up to 90 calendar days from passing the competency assessment, but must pass the national RBT exam and hold the BACB credential by day 90 to continue — effective April 1, 2024 and reiterated in MHD\'s June 2026 billing-compliance bulletin. Technicians and RBTs cannot enroll as MHD providers; their services are billed by the licensed supervisor with the HM modifier plus the supervisor\'s specialty modifier. Enrolled behavior analysts hold the Missouri (or home-state) LBA license, and psychologists may only bill ABA once MHD approves them for the ABA specialty (credential documents fax to MMAC Provider Enrollment, (573) 634-3105). One structural recommendation from the state\'s own training: group practices with two or more licensed behavior analysts should enroll as an "Autism Clinic" (Provider Type 50 – Clinic/Group, specialty AC), which parks precerts at the clinic level so any performing provider in the clinic can serve the client — a genuine continuity-of-care advantage when supervisors change.',
        ],
        cites: [
          { title: 'MO HealthNet Behavioral Health Services page (June 2026 RBT mandate bulletin)', url: 'https://mydss.mo.gov/mhd/behavioral-health-services' },
          { title: 'MHD ABA provider training (April 2022)', url: 'https://dss.mo.gov/mhd/providers/education/files/rodgers-applied-behavior-analysis.pdf' },
          { title: 'MO HealthNet Behavioral Health Services Manual, §1.16 ABA Services (May 2026)', url: 'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'At the technician level, Missouri layers almost nothing on the BACB — because it delegated the whole credential: 13 CSR 70-98.030 requires technicians to be "credentialed by the Behavior Analyst Certification Board (BACB) as a Registered Behavior Technician," with no state-registry alternative, and the April 1, 2024 policy adds the age/education floor (18+, high-school diploma or national equivalent, the 40-hour training and competency assessment) alongside the 90-day exam runway covered above. That makes the BACB\'s own screening rules the binding check for every technician hire: within 180 days of paying for the RBT application, the applicant must pass a criminal background check and an abuse-registry check "comparable to those required of home health aides, child care professionals, and teachers" — an employer-run check inside that window satisfies it if you keep the documentation for audit. One pipeline wrinkle: applicants on or after January 1, 2026 need the updated 2026 40-hour training (certificate carrying the 2026 approval statement, trainer an active BCBA/BCaBA with supervision training) and the updated competency assessment.',
          'Supervisors carry the state\'s only individual-level fingerprint mandate. LBA and LaBA licensure under RSMo 337.315 (Behavior Analyst Advisory Board, Division of Professional Registration — applications now run through the MOPRO portal, launched January 14, 2025) requires two classified fingerprint sets: one processed by the Missouri State Highway Patrol against the state repository, the second forwarded to the FBI. Missouri also adds a training mandate found nowhere in the ABA payment rules: at least two hours of suicide assessment, referral, treatment, and management training at initial licensure and at every renewal (HB 1719, effective August 28, 2018). Useful for hiring pre-certification talent: the statute provides provisional licenses allowing practice under licensed supervision before BCBA/BCaBA certification — terminating automatically after one year, renewable once for a two-year maximum — plus 90-day temporary licenses (one extension) for practitioners licensed elsewhere. On structure, 13 CSR 70-98.030 requires each technician to work under an LBA, an LaBA, or a licensed psychologist officially granted supervisory privileges by the BACB, with the supervisory relationship documented in writing; the rule sets no numeric ratio of its own, so the BACB\'s 5%-of-monthly-hours RBT supervision minimum (two monthly face-to-face contacts, at least one individual) is the operative floor.',
          'At the agency level, screening runs through Missouri Medicaid Audit & Compliance: under 13 CSR 65-2 and 42 CFR 455.450, MMAC screens every provider at initial enrollment and revalidation by federal risk category — limited-risk screening covers cross-state license verification, identity confirmation, and database checks (SSA Death Master File, NPPES, OIG exclusions, Medicare enrollment, National Sex Offender Public Website); moderate risk (the default for any provider type not otherwise categorized) adds pre-enrollment and unannounced post-enrollment site visits; high risk adds fingerprint-based FBI and MSHP checks of every 5%-or-greater owner, submitted via the MACHS system through the state vendor IDEMIA, with an exemption for owners fingerprinted for Medicare or another state Medicaid within the last two years. Two honest caveats close the picture. First, Missouri\'s Family Care Safety Registry is not automatic for ABA agencies: RSMo 210.900 ties the "mental health worker" registration duty to personal-care staff of DD facilities and group homes, so a standard outpatient/in-home ABA clinic isn\'t covered by definition — though agencies operating DD facilities or group homes or employing personal-care workers are (registration within 15 days of hire), and many providers use the FCSR voluntarily as an inexpensive screening tool. Second, the MO HealthNet ABA rule itself contains no employee background-check provision, so the binding individual-level checks are exactly the BACB RBT check and the licensure fingerprinting above — confirm any employer-level extras with MMAC provider enrollment rather than assuming them.',
        ],
        cites: [
          { title: '13 CSR 70-98.030 — Applied Behavior Analysis Services', url: 'https://www.law.cornell.edu/regulations/missouri/13-CSR-70-98-030' },
          { title: 'MO HealthNet Provider Bulletin Vol. 47 No. 19 — Grace Period for RBT Credential', url: 'https://mydss.mo.gov/sites/mydss/files/media/pdf/2024/09/ABA-Grace-Period-RBT-Bulletin.pdf' },
          { title: 'BACB RBT Handbook (background-check eligibility requirement)', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230407-a.pdf' },
          { title: 'BACB — Meeting RBT Requirements During the 2026 Transition', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
          { title: 'RSMo § 337.315 — behavior analyst licensure (fingerprints, provisional licenses)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
          { title: 'Missouri Behavior Analyst Advisory Board (Division of Professional Registration)', url: 'https://pr.mo.gov/ba.asp' },
          { title: 'MMAC — Provider Assigned Risk Categories', url: 'https://mmac.mo.gov/providers/provider-enrollment/new-providers/provider-assigned-risk-categories/' },
          { title: 'MMAC — Fingerprint Based Criminal History Checks', url: 'https://mmac.mo.gov/providers/provider-enrollment/new-providers/fingerprint-based-criminal-history-checks/' },
          { title: 'RSMo § 210.900 — Family Care Safety Registry definitions', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=210.900' },
          { title: 'MO DHSS FAQ — Who is required to register with the Family Care Safety Registry?', url: 'https://mohealth.uservoice.com/knowledgebase/articles/1166425-who-is-required-to-register-with-the-family-care-s' },
        ],
      },
    ],
    collect: [
      { title: 'MO HealthNet eligibility — not the plan card', desc: 'Whichever MCO card the family shows, ABA is state FFS. Verify MO HealthNet eligibility; skip the MCO analysis entirely.' },
      { title: 'Diagnostic evaluation', desc: 'By a licensed physician or psychologist — required with the assessment precert. ASD codes F84.0/F84.3/F84.5/F84.8, or frame the EPSDT case for other diagnoses.' },
      { title: 'Age (under 21)', desc: 'The benefit is under-21 in both the standard and EPSDT pathways.' },
      { title: 'School services / IEP status', desc: 'IEP-based school ABA is precert-exempt — and a coordination fact for the intervention plan.' },
      { title: 'Rendering-tier plan', desc: 'HO vs. HN vs. HM decides the rate on every hour — staffing mix is a first-order revenue variable.' },
    ],
    sources: [
      { title: 'MO HealthNet Behavioral Health Services Manual, §1.16 ABA Services (May 2026)', url: 'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx' },
      { title: 'MHD Applied Behavioral Analysis fee schedule (official download portal)', url: 'https://apps.dss.mo.gov/fmsfeeschedules/DLFiles.aspx' },
      { title: 'MO HealthNet Behavioral Health Services page (precert form 2575-045, bulletins)', url: 'https://mydss.mo.gov/mhd/behavioral-health-services' },
      { title: 'MHD ABA provider training — Applied Behavior Analysis Services (April 2022)', url: 'https://dss.mo.gov/mhd/providers/education/files/rodgers-applied-behavior-analysis.pdf' },
      { title: 'Healthy Blue MO HealthNet Managed Care Provider Manual', url: 'https://provider.healthybluemo.com/docs/gpp/MO_CAID_HealthNetManagedCareProviderManual.pdf' },
      { title: 'Show Me Healthy Kids Provider Reference Manual', url: 'https://www.homestatehealth.com/content/dam/centene/home-state-health/pdfs/HSH-SMHK-Provider-Manual_508%20Compliant%20063022.pdf' },
      { title: '13 CSR 70-98.030 — Applied Behavior Analysis Services', url: 'https://www.law.cornell.edu/regulations/missouri/13-CSR-70-98-030' },
      { title: 'MO HealthNet Provider Bulletin Vol. 47 No. 19 — Grace Period for RBT Credential', url: 'https://mydss.mo.gov/sites/mydss/files/media/pdf/2024/09/ABA-Grace-Period-RBT-Bulletin.pdf' },
      { title: 'BACB RBT Handbook', url: 'https://assets.bacb.com/wp-content/uploads/2022/01/RBTHandbook_230407-a.pdf' },
      { title: 'BACB — Meeting RBT Requirements During the 2026 Transition', url: 'https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf' },
      { title: 'RSMo § 337.315 — behavior analyst licensure (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
      { title: 'Missouri Behavior Analyst Advisory Board (Division of Professional Registration)', url: 'https://pr.mo.gov/ba.asp' },
      { title: 'MMAC — Provider Assigned Risk Categories', url: 'https://mmac.mo.gov/providers/provider-enrollment/new-providers/provider-assigned-risk-categories/' },
      { title: 'MMAC — Fingerprint Based Criminal History Checks', url: 'https://mmac.mo.gov/providers/provider-enrollment/new-providers/fingerprint-based-criminal-history-checks/' },
      { title: 'RSMo § 210.900 — Family Care Safety Registry definitions', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=210.900' },
      { title: 'MO DHSS FAQ — Family Care Safety Registry registration requirements', url: 'https://mohealth.uservoice.com/knowledgebase/articles/1166425-who-is-required-to-register-with-the-family-care-s' },
    ],
    faq: [
      { q: 'Does MO HealthNet cover ABA therapy?', a: 'Yes — for participants under 21, with precertification. The standard benefit requires an ASD diagnosis from a licensed physician or psychologist; under EPSDT/HCY, ABA is also covered for other diagnoses when medically necessary.' },
      { q: 'Do I need to contract with Missouri\'s Medicaid MCOs to provide ABA?', a: 'No. ABA is fully carved out of managed care — every member, including MCO and Show Me Healthy Kids enrollees, gets ABA through state fee-for-service. One payer, one precert form, no MCO credentialing for ABA.' },
      { q: 'How do I get an ABA authorization from MO HealthNet?', a: 'Fax form 2575-045 (the ABA Request for Precertification) with the required clinicals to the Behavioral Health Services help desk at (573) 635-6516. There\'s no portal or UM vendor — approval comes back by fax with hours and dates, for periods up to 6 months.' },
      { q: 'What does MO HealthNet pay for ABA?', a: 'Per 15-minute unit: 97151 at $25.26; 97153 at $20.13 (analyst/assistant tiers) or $16.37 with the HM technician modifier; 97155 at $25.26 ($27.46 in-home with U8); 97156 at $25.26. The HM-vs-HO split makes staffing mix the key revenue lever.' },
      { q: 'Can RBTs provide ABA under MO HealthNet?', a: 'Yes, billed by the licensed supervisor with the HM modifier — but the national RBT credential is mandatory: technicians have 90 calendar days from passing the initial competency assessment to pass the RBT exam and be BACB-credentialed.' },
    ],
  },

  'aetna-missouri': {
    slug: 'aetna-missouri',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the RSMo § 376.1224 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Missouri',
    state: 'MO', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Missouri',
    h1: 'Aetna ABA coverage in Missouri: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Missouri: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Missouri families — the national clinical policy, prior authorization, the RSMo § 376.1224 mandate (the $40K ABA cap through 18, exemptions), Missouri behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Missouri, a Aetna card means three layers at once: the carrier\'s national clinical policy, Missouri\'s autism insurance mandate (RSMo § 376.1224), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'RSMo § 376.1224 (HB 1311, 2010; expanded 1/1/2020)' },
      { label: 'Mandate age', value: 'No overall age limit stated; the ABA dollar cap applies through age 18' },
      { label: 'Mandate caps', value: '$40,000/yr ABA (statutory base, CPI-indexed; exceedable with plan approval)' },
      { label: 'Exempt from mandate', value: 'Self-funded private ERISA plans; short-term and limited policies' },
      { label: 'Licensure', value: 'MO Licensed Behavior Analyst (RSMo 337.315, Div. of Professional Registration)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Missouri',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. Aetna publishes no Missouri-specific ABA policy, form, or supplement — we checked — so the national policy plus the state mandate is the whole picture, with Missouri\'s statutory constraints (the 6-month treatment-plan review cadence, the ABA cap) applying to fully-insured business by operation of law rather than via a carrier document. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Missouri.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Missouri mandate: what it guarantees (and doesn\'t)',
        body: [
          'Missouri\'s mandate — enacted by 2010\'s HB 1311, with the current version applying to plans delivered, issued, continued, or renewed on or after January 1, 2020 (which added developmental and physical disability coverage) — reaches unusually far: beyond ordinary individual and group policies, it covers the state consolidated health care plan, self-insured governmental plans, MEWAs, and self-insured school district health plans established after 1/1/2020. ABA must be ordered by the treating licensed physician or psychologist in a treatment plan, supervised by a board-certified behavior analyst licensed under Chapter 337, and insurers may review the ABA treatment plan no more than once every 6 months unless the provider agrees otherwise. The headline number: ABA carries a $40,000-per-calendar-year cap for individuals through age 18 — statutory base value. Three things soften it: the cap may be exceeded with prior plan approval when additional ABA is medically necessary; it is CPI-indexed (carriers must adjust at least triennially, with the current adjusted figure published annually in the Missouri Register — don\'t quote $40K as the live number without checking); and other autism treatments (OT/PT/speech, psychiatric, pharmacy) sit outside the cap entirely. Self-funded private ERISA plans remain federally preempted.',
        ],
        cites: [
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
        ],
      },
      {
        h2: 'Licensure & rates in Missouri',
        body: [
          'Missouri requires behavior-analyst licensure: RSMo 337.315 prohibits practicing applied behavior analysis without an LBA (or Licensed Assistant Behavior Analyst) license or an enumerated exception — supervised trainees, licensed psychologists within scope, IDEA school personnel, and students among them. The Behavior Analyst Advisory Board within the State Committee of Psychologists (Division of Professional Registration, RSMo 337.300–337.345) reviews applications, and the mandate itself requires BCBA-supervised, Chapter 337-licensed delivery — so licensure is a coverage requirement, not just a credentialing one. On rates: Aetna does not publish commercial ABA fee schedules for Missouri (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against MO HealthNet\'s published fee schedule ($20.13/unit on 97153 at the analyst tier) when modeling.',
        ],
        cites: [
      { title: 'RSMo § 337.315 — behavior analyst licensure (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies — including MO\'s unusual reach into governmental and school self-insured plans) vs. self-funded private ERISA (exempt). Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age vs. the cap', desc: 'The ABA dollar cap runs through age 18 and is CPI-indexed — verify the current adjusted value and year-to-date usage before projecting hours.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
      { title: 'RSMo § 337.315 — behavior analyst licensure', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Missouri?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Missouri\'s mandate (RSMo § 376.1224) for fully-insured plans. Self-funded private employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Missouri autism mandate require?', a: 'Coverage of ASD diagnosis and treatment including ABA, with a $40,000-per-year ABA cap through age 18 — a CPI-indexed statutory base that can be exceeded with plan approval when medically necessary. Treatment-plan reviews are limited to once every 6 months, and ABA must be supervised by a Chapter 337-licensed behavior analyst.' },
      { q: 'What does Aetna pay for ABA in Missouri?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the MO HealthNet fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-missouri': {
    slug: 'cigna-missouri',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the RSMo § 376.1224 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Missouri',
    state: 'MO', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Missouri',
    h1: 'Cigna / Evernorth ABA coverage in Missouri: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Missouri: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Missouri families — the national clinical policy, prior authorization, the RSMo § 376.1224 mandate (the $40K ABA cap through 18, exemptions), Missouri behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Missouri, a Cigna card means three layers at once: the carrier\'s national clinical policy, Missouri\'s autism insurance mandate (RSMo § 376.1224), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'RSMo § 376.1224 (HB 1311, 2010; expanded 1/1/2020)' },
      { label: 'Mandate age', value: 'No overall age limit stated; the ABA dollar cap applies through age 18' },
      { label: 'Mandate caps', value: '$40,000/yr ABA (statutory base, CPI-indexed; exceedable with plan approval)' },
      { label: 'Exempt from mandate', value: 'Self-funded private ERISA plans; short-term and limited policies' },
      { label: 'Licensure', value: 'MO Licensed Behavior Analyst (RSMo 337.315, Div. of Professional Registration)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Missouri',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. And unlike some states, Missouri gets the national policy straight: we searched the current EN0499 (effective 5/15/2026) end to end and Missouri appears nowhere — no carve-out, no state-specific criteria — so EN0499 applies to Missouri members except where state law requires otherwise. The legal floor underneath it is the mandate below, which governs fully-insured plans, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Missouri.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Missouri mandate: what it guarantees (and doesn\'t)',
        body: [
          'Missouri\'s mandate — enacted by 2010\'s HB 1311, with the current version applying to plans delivered, issued, continued, or renewed on or after January 1, 2020 (which added developmental and physical disability coverage) — reaches unusually far: beyond ordinary individual and group policies, it covers the state consolidated health care plan, self-insured governmental plans, MEWAs, and self-insured school district health plans established after 1/1/2020. ABA must be ordered by the treating licensed physician or psychologist in a treatment plan, supervised by a board-certified behavior analyst licensed under Chapter 337, and insurers may review the ABA treatment plan no more than once every 6 months unless the provider agrees otherwise. The headline number: ABA carries a $40,000-per-calendar-year cap for individuals through age 18 — statutory base value. Three things soften it: the cap may be exceeded with prior plan approval when additional ABA is medically necessary; it is CPI-indexed (carriers must adjust at least triennially, with the current adjusted figure published annually in the Missouri Register — don\'t quote $40K as the live number without checking); and other autism treatments (OT/PT/speech, psychiatric, pharmacy) sit outside the cap entirely. Self-funded private ERISA plans remain federally preempted.',
        ],
        cites: [
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
        ],
      },
      {
        h2: 'Licensure & rates in Missouri',
        body: [
          'Missouri requires behavior-analyst licensure: RSMo 337.315 prohibits practicing applied behavior analysis without an LBA (or Licensed Assistant Behavior Analyst) license or an enumerated exception — supervised trainees, licensed psychologists within scope, IDEA school personnel, and students among them. The Behavior Analyst Advisory Board within the State Committee of Psychologists (Division of Professional Registration, RSMo 337.300–337.345) reviews applications, and the mandate itself requires BCBA-supervised, Chapter 337-licensed delivery — so licensure is a coverage requirement, not just a credentialing one. On rates: Cigna does not publish commercial ABA fee schedules for Missouri (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against MO HealthNet\'s published fee schedule ($20.13/unit on 97153 at the analyst tier) when modeling.',
        ],
        cites: [
      { title: 'RSMo § 337.315 — behavior analyst licensure (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies — including MO\'s unusual reach into governmental and school self-insured plans) vs. self-funded private ERISA (exempt). Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age vs. the cap', desc: 'The ABA dollar cap runs through age 18 and is CPI-indexed — verify the current adjusted value and year-to-date usage before projecting hours.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
      { title: 'RSMo § 337.315 — behavior analyst licensure', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Missouri?', a: 'Yes — under the carrier\'s national EN0499 policy for ASD (which applies in Missouri without any state carve-out), layered on Missouri\'s mandate (RSMo § 376.1224) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Missouri autism mandate require?', a: 'Coverage of ASD diagnosis and treatment including ABA, with a $40,000-per-year ABA cap through age 18 — a CPI-indexed statutory base that can be exceeded with plan approval when medically necessary. Treatment-plan reviews are limited to once every 6 months, and ABA must be supervised by a Chapter 337-licensed behavior analyst.' },
      { q: 'What does Cigna pay for ABA in Missouri?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the MO HealthNet fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-missouri': {
    slug: 'unitedhealthcare-missouri',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the RSMo § 376.1224 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Missouri',
    state: 'MO', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Missouri',
    h1: 'UnitedHealthcare / Optum ABA coverage in Missouri: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Missouri: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Missouri families — the national clinical policy, prior authorization, the RSMo § 376.1224 mandate (the $40K ABA cap through 18, exemptions), Missouri behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Missouri, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Missouri\'s autism insurance mandate (RSMo § 376.1224), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'RSMo § 376.1224 (HB 1311, 2010; expanded 1/1/2020)' },
      { label: 'Mandate age', value: 'No overall age limit stated; the ABA dollar cap applies through age 18' },
      { label: 'Mandate caps', value: '$40,000/yr ABA (statutory base, CPI-indexed; exceedable with plan approval)' },
      { label: 'Exempt from mandate', value: 'Self-funded private ERISA plans; short-term and limited policies' },
      { label: 'Licensure', value: 'MO Licensed Behavior Analyst (RSMo 337.315, Div. of Professional Registration)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Missouri',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. Notably, Missouri has no entry in Optum\'s ABA State Mandates supplemental criteria document (we checked the 2026 edition — the state list runs AZ through VA and skips Missouri), so Missouri commercial members run on Optum\'s standard national criteria, with RSMo § 376.1224 applying to fully-insured plans by operation of law rather than through an Optum overlay. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Missouri.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA STM1 2026 — no Missouri entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Missouri mandate: what it guarantees (and doesn\'t)',
        body: [
          'Missouri\'s mandate — enacted by 2010\'s HB 1311, with the current version applying to plans delivered, issued, continued, or renewed on or after January 1, 2020 (which added developmental and physical disability coverage) — reaches unusually far: beyond ordinary individual and group policies, it covers the state consolidated health care plan, self-insured governmental plans, MEWAs, and self-insured school district health plans established after 1/1/2020. ABA must be ordered by the treating licensed physician or psychologist in a treatment plan, supervised by a board-certified behavior analyst licensed under Chapter 337, and insurers may review the ABA treatment plan no more than once every 6 months unless the provider agrees otherwise. The headline number: ABA carries a $40,000-per-calendar-year cap for individuals through age 18 — statutory base value. Three things soften it: the cap may be exceeded with prior plan approval when additional ABA is medically necessary; it is CPI-indexed (carriers must adjust at least triennially, with the current adjusted figure published annually in the Missouri Register — don\'t quote $40K as the live number without checking); and other autism treatments (OT/PT/speech, psychiatric, pharmacy) sit outside the cap entirely. Self-funded private ERISA plans remain federally preempted.',
        ],
        cites: [
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Missouri: the carve-out twist',
        body: [
          'A family saying "we have UnitedHealthcare" in Missouri may be on UnitedHealthcare Community Plan of Missouri — one of the four MO HealthNet Managed Care plans. But here Missouri differs from most states: Medicaid ABA is fully carved out of managed care to state fee-for-service, so UHC (and Optum) plays no role in Missouri Medicaid ABA authorization or payment. For those families, skip this page entirely — the state MO HealthNet guide is the operative one, and the precert goes to the state by fax, not to Provider Express.',
        ],
        cites: [
      { title: 'MO HealthNet Behavioral Health Services Manual, §1.16 (ABA carve-out)', url: 'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx' },
      { title: 'MO HealthNet Managed Care Health Plans list', url: 'https://mydss.mo.gov/mhd/managed-care-health-plans' },
        ],
      },
      {
        h2: 'Licensure & rates in Missouri',
        body: [
          'Missouri requires behavior-analyst licensure: RSMo 337.315 prohibits practicing applied behavior analysis without an LBA (or Licensed Assistant Behavior Analyst) license or an enumerated exception — supervised trainees, licensed psychologists within scope, IDEA school personnel, and students among them. The Behavior Analyst Advisory Board within the State Committee of Psychologists (Division of Professional Registration, RSMo 337.300–337.345) reviews applications, and the mandate itself requires BCBA-supervised, Chapter 337-licensed delivery — so licensure is a coverage requirement, not just a credentialing one. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Missouri (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Benchmark against MO HealthNet\'s published fee schedule ($20.13/unit on 97153 at the analyst tier) when modeling.',
        ],
        cites: [
      { title: 'RSMo § 337.315 — behavior analyst licensure (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies — including MO\'s unusual reach into governmental and school self-insured plans) vs. self-funded private ERISA (exempt). Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Missouri — Medicaid members route ABA to state FFS, not to Optum at all.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age vs. the cap', desc: 'The ABA dollar cap runs through age 18 and is CPI-indexed — verify the current adjusted value and year-to-date usage before projecting hours.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA STM1 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'RSMo § 376.1224 (Missouri Revisor of Statutes)', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224' },
      { title: 'RSMo § 337.315 — behavior analyst licensure', url: 'https://revisor.mo.gov/main/OneSection.aspx?section=337.315' },
      { title: 'MO HealthNet Managed Care Health Plans list', url: 'https://mydss.mo.gov/mhd/managed-care-health-plans' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Missouri?', a: 'Yes — under Optum\'s national ABA criteria (Missouri has no entry in Optum\'s State Mandates supplement), layered on Missouri\'s mandate (RSMo § 376.1224) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Missouri autism mandate require?', a: 'Coverage of ASD diagnosis and treatment including ABA, with a $40,000-per-year ABA cap through age 18 — a CPI-indexed statutory base that can be exceeded with plan approval when medically necessary. Treatment-plan reviews are limited to once every 6 months, and ABA must be supervised by a Chapter 337-licensed behavior analyst.' },
      { q: 'Does Optum handle UnitedHealthcare Medicaid ABA in Missouri?', a: 'No — Missouri carves Medicaid ABA out of managed care entirely. UHC Community Plan members get ABA through MO HealthNet fee-for-service, with precertification faxed to the state, so Optum and Provider Express never enter the picture.' },
      { q: 'What does UnitedHealthcare pay for ABA in Missouri?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the MO HealthNet fee schedule, and treat rate-setting as part of contracting.' },
    ],
  },
};
