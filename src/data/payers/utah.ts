import type { PayerConfig } from './types.js';

export const utahPayers: Record<string, PayerConfig> = {
  'utah-medicaid': {
    slug: 'utah-medicaid',
    cardDesc: 'FFS carve-out — ACO card irrelevant for ABA, no PA on 97151, adults covered, PRISM rates.',
    assessmentPA: 'Not required — behavior identification assessments (97151) are exempt from PA; 1 assessment per 26 weeks, up to 24 units',
    treatmentPA: 'Required — all treatment codes, 26-week periods via the PRISM portal; 10-business-day grace to submit after starting services',
    dxRequired: 'Yes — written ASD diagnosis using evidence-based standardized measures; the completed diagnostic tool must accompany the initial PA',
    payer: 'Utah Medicaid',
    state: 'UT', kind: 'state-medicaid',
    pill: 'Payer Guide · Utah Medicaid',
    h1: 'Utah Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Utah Medicaid ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Utah Medicaid covers ABA as a fee-for-service carve-out — why the ACO card doesn\'t matter, no PA on assessments, the 10-business-day PA grace period, adult coverage, published PRISM rates effective 7/1/2026, and the September 2026 High-Risk revalidation wave.',
    intro: [
      'Utah Medicaid covers ABA through its state-plan Autism Spectrum Disorder services — and the single most important structural fact is that ABA is a fee-for-service carve-out. Utah runs four physical-health ACOs (Health Choice Utah, Healthy U, Molina, SelectHealth Community Care), but ABA never touches them: diagnosis documentation, prior authorization, and claims all go directly to Utah Medicaid, whatever card the family carries. Layer on no PA for assessments, a 10-business-day retroactive PA grace period, coverage regardless of age, and a published fee schedule, and Utah is one of the most intake-friendly Medicaid programs in our directory. One transparency note: parts of this guide rest on the archived July 2023 ASD manual corroborated against the live PRISM coverage lookup; the January 2026 manual has since been verified directly (cited in the staffing section below) — where editions conflict, the newer manual governs.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — ages 1 and older, \'regardless of age\'; adults with ASD included' },
      { label: 'Structure', value: 'FFS carve-out — bill Utah Medicaid directly, even for ACO-enrolled members' },
      { label: 'Assessment PA', value: 'None — 97151 needs no PA (1 assessment per 26 weeks, up to 24 units)' },
      { label: 'Treatment PA', value: 'Required — 26-week periods via PRISM; 10-business-day grace after starting' },
      { label: 'Rates (per 15 min)', value: '97153 $19.67 · 97151/97155/97156 $37.51 (effective 7/1/2026)' },
      { label: 'Hour caps', value: '97153 up to 30 hrs/week (780 hrs per 26 wks); supervision 84 hrs combined' },
      { label: 'Staff screening', value: 'Techs fully certified before serving any member (RBT/QABA/BICC) — no grace period since Jan 2026' },
      { label: 'Watch', value: 'High-Risk revalidation + fingerprinting notices phased from Sept 2026' },
    ],
    sections: [
      {
        h2: 'The carve-out: your ACO card doesn\'t matter for ABA',
        body: [
          'Utah\'s four ACOs handle physical health, and for autism-diagnosed members they also handle ASD-related PT, OT, and speech — but ABA and the autism diagnostic evaluation are carved out to state fee-for-service. The manual states that mental health evaluations and psychological testing for diagnosing developmental disorders are carved out of the managed-care entities and reimbursed fee-for-service, and the state\'s own family-facing FAQ confirms that ABA PA requests go to the Medicaid agency and providers bill Medicaid directly. Practically: intake never needs to route an ABA request by plan. Capture the ACO name only for coordinating PT/OT/ST — for ABA, every Utah Medicaid family follows the identical state workflow, and there is no per-plan portal, form, or criteria variation to track.',
        ],
        cites: [
          { title: 'Accessing Medicaid Autism Related Services — FAQ for Parents and Families (2024-07 V2.0, archived)', url: 'https://web.archive.org/web/20260106200503/https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/Accessing%20ASD%20Services%20FAX%20V2,%207-15-24.pdf' },
          { title: 'Utah Medicaid Provider Manual — Autism Spectrum Disorder Services (July 2023, archived)', url: 'https://web.archive.org/web/20240821082018/https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf' },
          { title: 'Utah Medicaid Managed Care page (ACO list)', url: 'https://medicaid.utah.gov/managed-care/' },
        ],
      },
      {
        h2: 'Assess first, authorize later: no PA on 97151 and the 10-day grace',
        body: [
          'The manual is explicit: ABA therapy requires prior authorization — but that requirement \'does not apply to initial or ongoing behavior identification assessments.\' The live PRISM lookup confirms it: 97151 shows \'Prior Authorization Required? No,\' limited to one assessment per 26 weeks at up to 24 units, with reassessment roughly every 6 months. So with a diagnosis in hand, intake can book and bill the assessment immediately.',
          'Treatment codes (97153, 97155, 97156, group codes, H0032) do need PA, submitted to the state PA unit through the PRISM portal on the ABA Services Prior Authorization Form, in 26-week authorization periods. Utah then adds a rare cushion: a 10-business-day grace period to submit the PA after starting services — initial and recertification alike — so a completed assessment can flow straight into treatment without an authorization gap. Miss the window and the authorization starts on the completed-submission date instead, so treat day one of treatment as the PA clock. The initial packet is substantial: the PA form, a copy of the written ASD diagnosis with the completed diagnostic tool, an order or prescription for ABA (renewed annually), and a treatment plan with assessment-tool copies, baseline data, measurable goals, weekly service amounts by code, and settings including telehealth hours. Reauthorization adds progress-versus-baseline data using the same measurement method, and requests above the maximum allowed units go to secondary medical review.',
        ],
        cites: [
          { title: 'Utah Medicaid Provider Manual — ASD Services, Ch. 8 (July 2023, archived)', url: 'https://web.archive.org/web/20240821082018/https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf' },
          { title: 'PRISM Coverage and Reimbursement Lookup (97151 PA flag)', url: 'https://health.utah.gov/stplan/lookup/CoverageLookup.php' },
        ],
      },
      {
        h2: 'Rates, caps, and who\'s covered',
        body: [
          'Utah publishes its ABA rates in the PRISM coverage lookup. Effective July 1, 2026, per 15-minute unit: 97153 direct treatment pays $19.67, and 97151, 97155, and 97156 all pay $37.51 — 97155 reported with a credential modifier (HP psychologist/BCBA-D, HO BCBA, HN BCaBA/analyst-in-training) but a single published rate across tiers. The caps are generous: 97153 up to 780 hours per 26 weeks (30 hours/week), supervision (97155 plus H0032) capped at 84 combined hours per 26 weeks, with overage requests possible through secondary review. Parent training (97156) carries a recommended minimum of 3 episodes per 26 weeks. Supervision has a floor, too: the QHP must supervise at least 10% of technician direct-service time, at least half of it directly.',
          'Two eligibility facts set Utah apart. First, ASD services are available \'regardless of age\' — PRISM shows allowed ages 1 and older with adult plans included, so adults with ASD can get ABA, which almost no state Medicaid program offers. Second, third-party liability is enforced: commercial insurance must be exhausted first, and if the provider isn\'t paneled with the member\'s private plan and no out-of-network benefit exists, a transition (or enrollment with the insurer) must occur within 6 months of discovering the coverage — so ask about other insurance at intake, not at the first denied claim. Also worth flagging: telehealth works for supervision and parent training but not for technician-delivered 97153/97154 or group 97158, and school-based ABA on an IEP routes through the School-Based Skills Development benefit instead of FFS.',
        ],
        cites: [
          { title: 'PRISM Coverage and Reimbursement Lookup (rates, PA flags, age limits — PAC 166)', url: 'https://health.utah.gov/stplan/lookup/CoverageLookup.php' },
          { title: 'ASD Related Services program page (services regardless of age)', url: 'https://medicaid.utah.gov/ltc-2/asd/' },
          { title: 'SPA UT-25-0007 — 4.19-B fee schedule incl. ASD services (archived)', url: 'https://web.archive.org/web/20260217123605/https://www.medicaid.gov/medicaid/spa/downloads/UT-25-0007.pdf' },
        ],
      },
      {
        h2: 'Watch: the September 2026 High-Risk revalidation wave',
        body: [
          'Per the July 2026 Medicaid Information Bulletin (item 26-61), Utah has reclassified ABA providers as \'High Risk\' for enrollment screening. Every existing ABA provider must revalidate within 18 months, with notices phased starting September 2026 — and revalidation now includes individual ownership reporting and fingerprint-based background checks. Failure to complete within 60 days of your notice risks enrollment closure, which would stop FFS claims cold, so treat the notice as a drop-everything item when it arrives. The same MIB (item 26-83) reconfirmed that group codes still require group-size modifiers (UN/UP/UQ/UR/US) or claims deny. Sourcing note: the January 2026 ASD manual is verified and cited in this guide; the state lists a further 04/13/2026 update whose PDF was not retrievable at review time — where a determination hinges on the newest manual language, confirm with the PA unit (dmhfmedicalpolicy@utah.gov).',
        ],
        cites: [
          { title: 'July 2026 Medicaid Information Bulletin — items 26-61 and 26-83 (archived)', url: 'https://web.archive.org/web/20260717062915/https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid+Information+Bulletins/Traditional+Medicaid+Program/2026/July2026-MIB.pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'The January 2026 ASD manual update removed the technician on-ramp: behavior technicians must be fully certified before performing any services for a Utah Medicaid member — the manual states there is \'no grace period granted between a technician\'s initial hire date and the date in which the technician receives certification,\' ending the prior policy that allowed a 40-hour training plus competency assessment within 120 days of hire. Utah accepts technician certification from any NCCA-accredited body, naming the BACB (RBT), QABA, and BICC as examples, and the current certificate is submitted to Medicaid as part of provider enrollment. That changes the hiring math: an uncertified hire cannot touch a Medicaid caseload while training. The BACB floor beneath the RBT credential: age 18+, high-school education, a criminal background check and an abuse registry check — both confirmed by an attesting certificant no more than 180 days before the RBT application — the 40-hour training, the exam, and ongoing supervision of at least 5% of behavior-analytic service hours each calendar month.',
          'Utah runs no separate state background check on ABA technicians — the criminal and abuse-registry screening rides entirely on the required national certification. The state\'s screening energy points at owners instead. Effective July 1, 2026, MIB item 26-61 reclassified ABA providers to the \'High Risk\' screening category (Utah invoked 42 CFR 455.450(e) on May 1, 2026, citing national fraud trends). Every existing ABA provider must revalidate within 18 months; notices mail in phases beginning September 2026, and the screening must be completed within 60 days of the notice date or enrollment closes. High-Risk screening means: reporting every individual or corporation with a 5%-or-greater direct or indirect ownership interest; FBI fingerprint-based criminal background checks for those 5%+ individual owners (via FBI channelers); unannounced pre- or post-enrollment site visits; and the $750 federally mandated 2026 enrollment fee — waived only with proof of active enrollment and fee payment to Medicare or another state\'s Medicaid program. DHHS has committed to CMS to screen 4,644 high-risk billing providers by June 2028, so this wave will reach every ABA agency; have ownership disclosures, licenses, and certifications current and uploadable in PRISM before your letter arrives.',
          'On the supervisor side, practicing behavior analysis requires a Utah license under the Behavior Analyst Licensing Act (Utah Code Title 58, Chapter 61, Part 7): behavior analyst (LBA) — current good-standing BCBA certification qualifies outright, or a master\'s/doctorate plus 1,500 supervised hours and the exam — and assistant behavior analyst (LaBA), and the ASD manual requires supervising BCBAs and BCBA-Ds to hold the Utah license. Rule R156-61a adds a written supervision contract with per-meeting documentation and makes supervising without one unprofessional conduct. The Medicaid ratio that binds staffing: the QHP must supervise at least 10% of the time a member receives direct services from a technician or assistant analyst, at least 50% of it direct supervision — an additional 10% of direct supervision can be prior-authorized with documented medical necessity — and remote supervision counts only via synchronous two-way audio/video. Services by a \'behavior analyst in training\' (enrolled in a BACB-approved course sequence) are also billable under the licensure exemptions in Utah Code 58-61-707(10)–(12) when supervised by a psychologist or behavior analyst. And because ABA is a FFS carve-out, none of the four ACOs credential or screen ABA staff — certification, licensure, and the new High-Risk screening all run through state enrollment in PRISM. One unverified item: DOPL\'s behavior-analyst application page (which carries license fees) blocks automated retrieval, so confirm current licensing fees with DOPL directly.',
        ],
        cites: [
          { title: 'Utah Medicaid Provider Manual — Autism Spectrum Disorder Services (updated January 2026)', url: 'https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder.pdf' },
          { title: 'July 2026 Medicaid Information Bulletin — items 26-61 and 26-83 (archived)', url: 'https://web.archive.org/web/20260717062915/https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid+Information+Bulletins/Traditional+Medicaid+Program/2026/July2026-MIB.pdf' },
          { title: 'Utah DHHS — Medicaid SUD/ABA High-Risk announcement (June 23, 2026)', url: 'https://dhhs.utah.gov/featured-news/utah-dhhs-will-impose-medicaid-sud-enrollmentmoratorium-to-combat-fraud/' },
          { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
          { title: 'Utah Code Title 58, Chapter 61, Part 7 — Behavior Analyst Licensing Act', url: 'https://le.utah.gov/xcode/Title58/Chapter61/58-61-P7.html' },
          { title: 'Utah Administrative Rule R156-61a — Behavior Analyst Licensing Act Rule', url: 'https://adminrules.utah.gov/public/rule/R156-61a/Current%20Rules' },
        ],
      },
    ],
    collect: [
      { title: 'Written ASD diagnosis + completed diagnostic tool', desc: 'Both attach to the initial PA — the diagnosis must rest on evidence-based standardized measures, though no specific instrument is mandated.' },
      { title: 'Order / prescription for ABA', desc: 'Required in the initial packet and renewed annually — chase it at intake.' },
      { title: 'Other insurance', desc: 'TPL is enforced: commercial coverage must be exhausted first, with a 6-month transition clock once discovered.' },
      { title: 'Weekly hours by code + settings', desc: 'The treatment plan itemizes weekly service amounts per code, including telehealth hours — align intake and clinical planning early.' },
      { title: 'ACO name (for PT/OT/ST only)', desc: 'Irrelevant to ABA routing, but the ACO handles ASD-related PT, OT, and speech for its enrollees.' },
    ],
    sources: [
      { title: 'Utah Medicaid Provider Manual — ASD Services (July 2023 edition, archived)', url: 'https://web.archive.org/web/20240821082018/https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf' },
      { title: 'PRISM Coverage and Reimbursement Lookup (rates & PA flags)', url: 'https://health.utah.gov/stplan/lookup/CoverageLookup.php' },
      { title: 'Accessing Medicaid Autism Related Services — family FAQ (archived)', url: 'https://web.archive.org/web/20260106200503/https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/Accessing%20ASD%20Services%20FAX%20V2,%207-15-24.pdf' },
      { title: 'ASD Related Services program page', url: 'https://medicaid.utah.gov/ltc-2/asd/' },
      { title: 'SPA UT-25-0007 — fee schedule (archived)', url: 'https://web.archive.org/web/20260217123605/https://www.medicaid.gov/medicaid/spa/downloads/UT-25-0007.pdf' },
      { title: 'July 2026 Medicaid Information Bulletin (archived)', url: 'https://web.archive.org/web/20260717062915/https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid+Information+Bulletins/Traditional+Medicaid+Program/2026/July2026-MIB.pdf' },
      { title: 'Utah Medicaid Managed Care page (ACO list)', url: 'https://medicaid.utah.gov/managed-care/' },
      { title: 'Utah Medicaid Provider Manual — ASD Services (updated January 2026)', url: 'https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder.pdf' },
      { title: 'Utah DHHS — Medicaid SUD/ABA High-Risk announcement (June 23, 2026)', url: 'https://dhhs.utah.gov/featured-news/utah-dhhs-will-impose-medicaid-sud-enrollmentmoratorium-to-combat-fraud/' },
      { title: 'BACB RBT Handbook (updated 06/2026)', url: 'https://www.bacb.com/rbt-handbook' },
      { title: 'Utah Code Title 58, Chapter 61, Part 7 — Behavior Analyst Licensing Act', url: 'https://le.utah.gov/xcode/Title58/Chapter61/58-61-P7.html' },
      { title: 'Utah Administrative Rule R156-61a — Behavior Analyst Licensing Act Rule', url: 'https://adminrules.utah.gov/public/rule/R156-61a/Current%20Rules' },
    ],
    faq: [
      { q: 'Does Utah Medicaid cover ABA therapy?', a: 'Yes — as a state-plan ASD service, fee-for-service, regardless of age (PRISM shows ages 1 and older, adult plans included). No PA on assessments; treatment requires PA in 26-week periods, with a 10-business-day grace to submit after starting services.' },
      { q: 'My client is on Molina / SelectHealth / Healthy U / Health Choice — where does the ABA request go?', a: 'To Utah Medicaid directly. ABA is carved out of all four ACO contracts to state fee-for-service — the ACO handles only ASD-related PT/OT/ST. There are no per-plan ABA portals, forms, or criteria in Utah.' },
      { q: 'What does Utah Medicaid pay for ABA?', a: 'Published in the PRISM lookup, effective 7/1/2026 per 15-minute unit: 97153 pays $19.67; 97151, 97155, and 97156 each pay $37.51 (97155 with credential modifiers HP/HO/HN but one published rate).' },
      { q: 'Can adults get ABA under Utah Medicaid?', a: 'Yes — Utah\'s ASD services are not an EPSDT child-only benefit. The state offers them regardless of age, and PRISM lists Traditional Adult and Targeted Adult plans among covered eligibility groups.' },
    ],
  },

  'select-health-utah': {
    slug: 'select-health-utah',
    cardDesc: 'Two different products under one name: Community Care (Medicaid) rides UT FFS; commercial runs its own Policy #630.',
    assessmentPA: 'Community Care (Medicaid) members: none — routes to Utah Medicaid FFS, not Select Health. Commercial members: required — ABA Preauthorization Form, initial request',
    treatmentPA: 'Community Care (Medicaid) members: routes to Utah Medicaid FFS. Commercial members: required — concurrent ABA Preauthorization Form; 14-day decision (Utah)',
    dxRequired: 'Yes — ASD; Medicaid members follow Utah Medicaid\'s diagnostic-tool requirement, commercial members follow Select Health Policy #630 (confirm exact criteria with plan — current policy text not publicly retrievable at review)',
    payer: 'Select Health (Utah)',
    state: 'UT', kind: 'medicaid-mco', parent: 'Utah Medicaid',
    pill: 'Payer Guide · Select Health',
    h1: 'Select Health ABA coverage in Utah: Medicaid ACO vs. commercial.',
    metaTitle: 'Select Health (Utah) ABA Coverage & Prior Auth Guide | Carelu',
    metaDescription:
      'Select Health in Utah is two different products for ABA purposes: SelectHealth Community Care (the Medicaid ACO) rides Utah Medicaid\'s FFS carve-out, while Select Health commercial plans run their own ABA policy (#630) with a dedicated preauthorization form. What intake needs to ask.',
    intro: [
      'A family saying "we have Select Health" in Utah could mean two structurally different things, and getting it right changes where the ABA request goes. SelectHealth Community Care is one of Utah Medicaid\'s four ACOs (alongside Health Choice Utah, Healthy U, and Molina) — and Utah Medicaid carves ABA out of every ACO to state fee-for-service, so a Community Care member\'s ABA request never touches Select Health at all; it goes straight to Utah Medicaid, exactly as our Utah Medicaid guide describes. Select Health also separately sells commercial insurance — employer group and individual/marketplace plans, branded simply "Select Health" — and for those members, Select Health runs its own ABA clinical policy, its own prior-authorization form, and its own utilization-management team. Select Health (the parent brand) is a wholly owned subsidiary of Intermountain Health. This guide covers both paths.',
    ],
    atGlance: [
      { label: 'Two products, one name', value: 'SelectHealth Community Care (Medicaid ACO) vs. Select Health commercial (employer/individual)' },
      { label: 'Community Care + ABA', value: 'Carved out to Utah Medicaid FFS — Select Health does not administer it' },
      { label: 'Commercial + ABA', value: 'Select Health\'s own Policy #630 "Applied Behavior Analysis" (revised eff. 1/1/2026)' },
      { label: 'Commercial prior auth', value: 'Required — ABA Preauthorization Form; 14-day decision in Utah' },
      { label: 'Commercial submission', value: 'commercialUMintake@imail.org · fax 801-442-0825' },
      { label: 'Parent company', value: 'Intermountain Health (Select Health is a wholly owned subsidiary)' },
      { label: 'Utah mandate', value: 'Utah Code § 31A-22-642 — governs individual/large-group commercial plans, not small-group or Medicaid' },
    ],
    sections: [
      {
        h2: 'First question: which Select Health?',
        body: [
          'Select Health\'s own Medicaid Provider Summary describes SelectHealth Community Care as one of three government/managed products it runs alongside Select Health Medicare and Select Health Share, "available to eligible members living in all Utah counties." Its Provider Reference Manual separately defines a "Fee-For-Service Medicaid member" as anyone whose needed service is covered by Medicaid rather than the ACO plan — the same carve-out mechanism our Utah Medicaid guide documents for all four ACOs — and its Appendix B for Community Care states plainly that "Select Health Community Care policies typically align with State of Utah Medicaid policy." Select Health\'s own published carved-out-services list names mental-health medications, emergency transportation, long-term care, apnea monitors, and dental — it doesn\'t explicitly name ABA/autism services, so treat the FFS routing as inherited from Utah Medicaid\'s own carve-out policy (already verified in our Utah Medicaid guide) rather than a Select Health-authored statement. Either way, the operational answer for intake is the same: for a Community Care member, don\'t call Select Health for ABA — go straight to Utah Medicaid.',
        ],
        cites: [
          { title: 'Select Health — Medicaid Provider Summary', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/programs/government/medicaid-provider-summary.pdf' },
          { title: 'Select Health — Provider Reference Manual (Commercial & Government), Appendix B', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/Reference%20Manuals/prm-comm-govt.pdf' },
          { title: 'Select Health — Medicaid Member Handbook', url: 'https://selecthealth.org/content/dam/selecthealth/Medicaid/PDFs/medicaid-handbook.pdf' },
        ],
      },
      {
        h2: 'Commercial members: Select Health\'s own ABA policy',
        body: [
          'For employer-group, self-funded, and individual/marketplace members, Select Health runs its own numbered medical policy — Policy #630, "Applied Behavior Analysis (ABA)" — which Select Health\'s February 2026 Policy Update Bulletin confirms was revised effective January 1, 2026 (the bulletin describes reorganized medical-necessity criteria and removal of an FEHB-plan exception, but the policy PDF itself returned a maintenance error at every attempt during this review — treat specific diagnostic or hour-based criteria as unverified until confirmed directly with Select Health). What is independently confirmed from Select Health\'s own live 2026 ABA Preauthorization Form: it distinguishes an initial request (diagnostic evaluation report required) from a concurrent/continuation request (updated treatment plan with progress data required), and Utah decisions on commercial plans are due within 14 days absent expedited review. The form also collects a detailed weekly ABA schedule (day, time, setting — office/home/other), school and other-therapy schedules, and IEP/ISP/504/ARD status — build that into your intake packet before submitting.',
        ],
        cites: [
          { title: 'Select Health — Policy Update Bulletin, February 2026 (Policy 630 revision)', url: 'https://selecthealth.org/providers/policies/policy-update-bulletins/policy-update-0226' },
          { title: 'Select Health — ABA Preauthorization Form (2026)', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/forms/sh-aba-pre-auth-form.pdf' },
        ],
      },
      {
        h2: 'Submission mechanics by line of business',
        body: [
          'Select Health\'s ABA Preauthorization Form routes requests by email, split cleanly by line of business: commercial (large/small employer, self-funded, individual) goes to commercialUMintake@imail.org (fax 801-442-0825); Select Health Community Care (Medicaid/CHIP) goes to medicaidUMintake@imail.org (fax 801-442-0625) — relevant only for the non-ABA services Community Care still administers, since ABA itself routes to Utah Medicaid, not this address; Select Health Medicare goes to medicareUMintake@imail.org (fax 801-442-0302), with a 14-day decision window across all states. Select Health also runs an online "Preauth & Care Plan Tool," where some requests qualify for auto-approval, and a general 24/7 preauthorization help desk at 800-442-4566. General provider support for commercial plans runs through 800-222-6358.',
        ],
        cites: [
          { title: 'Select Health — ABA Preauthorization Form (2026)', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/forms/sh-aba-pre-auth-form.pdf' },
          { title: 'Select Health — Preauthorization Forms & Reports', url: 'https://selecthealth.org/providers/preauthorization/forms-reports' },
        ],
      },
      {
        h2: 'The Utah mandate and commercial market segment',
        body: [
          'Utah Code § 31A-22-642 requires ASD diagnosis-and-treatment coverage in the individual and large-group markets — small-group plans are not named by the statute. Select Health\'s own ABA Preauthorization Form lists "Commercial Plans (Large/Small Employer, Self-Funded, Ind.)" as a single routing category, meaning Select Health\'s ABA intake process is unified across market segments even though the mandate\'s protections (no age limit, no hour cap for plans entered or renewed since 1/1/2020) legally apply only to individual and large-group business — small-group and self-funded ERISA plans sit outside the mandate. We found no Select Health page that discusses mandate compliance or breaks out market segment explicitly, so confirm a given member\'s market segment (individual, small-group, large-group, or self-funded) as part of benefits verification rather than assuming mandate protections apply. Also worth knowing: starting before July 1, 2027, Utah requires every health benefit plan — Select Health included — to publicly report autism-assessment wait times, PA practices, and average ABA hours/cost to the Insurance Department annually.',
        ],
        cites: [
          { title: 'Utah Code § 31A-22-642 (current version, effective 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.html' },
          { title: 'Select Health — ABA Preauthorization Form (2026)', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/forms/sh-aba-pre-auth-form.pdf' },
        ],
      },
      {
        h2: 'Rates',
        body: [
          'No Select Health-specific ABA fee schedule (commercial or Community Care) was found published. For Community Care members, ABA rides Utah Medicaid FFS entirely, so the relevant benchmark is Utah Medicaid\'s own published PRISM rates ($19.67 per 15-minute unit on 97153; $37.51 on 97151/97155/97156, effective 7/1/2026) — not a Select Health rate at all. For commercial members, rates are contract-negotiated and live in your participating-provider agreement.',
        ],
        cites: [
          { title: 'PRISM Coverage and Reimbursement Lookup (rates & PA flags)', url: 'https://health.utah.gov/stplan/lookup/CoverageLookup.php' },
        ],
      },
    ],
    collect: [
      { title: 'Community Care vs. commercial', desc: 'The single most important question — ask which product the family is on, or check whether the card says "Community Care" (Medicaid) vs. a standard employer/individual plan.' },
      { title: 'For Community Care members: route to Utah Medicaid', desc: 'ABA never touches Select Health for these members — collect the same documents our Utah Medicaid guide describes and submit through PRISM.' },
      { title: 'For commercial members: market segment', desc: 'Individual/large-group (mandate applies, no hour cap since 2020) vs. small-group/self-funded (mandate doesn\'t apply) — ask for the employer and check the card.' },
      { title: 'Diagnostic evaluation report (initial) or updated treatment plan (continuation)', desc: 'Select Health\'s commercial ABA Preauthorization Form requires one or the other depending on request type.' },
      { title: 'Weekly ABA schedule + IEP/504 status', desc: 'The commercial preauth form asks for a full weekly schedule by setting and school-plan status — gather this before submitting.' },
    ],
    sources: [
      { title: 'Select Health — Medicaid Provider Summary', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/programs/government/medicaid-provider-summary.pdf' },
      { title: 'Select Health — Provider Reference Manual (Commercial & Government)', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/Reference%20Manuals/prm-comm-govt.pdf' },
      { title: 'Select Health — Medicaid Member Handbook', url: 'https://selecthealth.org/content/dam/selecthealth/Medicaid/PDFs/medicaid-handbook.pdf' },
      { title: 'Select Health — Policy Update Bulletin, February 2026 (Policy 630 revision)', url: 'https://selecthealth.org/providers/policies/policy-update-bulletins/policy-update-0226' },
      { title: 'Select Health — ABA Preauthorization Form (2026)', url: 'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/forms/sh-aba-pre-auth-form.pdf' },
      { title: 'Select Health — Preauthorization Forms & Reports', url: 'https://selecthealth.org/providers/preauthorization/forms-reports' },
      { title: 'Utah Code § 31A-22-642 (current, eff. 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.html' },
      { title: 'PRISM Coverage and Reimbursement Lookup (rates & PA flags)', url: 'https://health.utah.gov/stplan/lookup/CoverageLookup.php' },
    ],
    faq: [
      { q: 'Does Select Health cover ABA therapy in Utah?', a: 'Depends which Select Health. SelectHealth Community Care (the Medicaid ACO) never administers ABA — it rides Utah Medicaid\'s fee-for-service carve-out. Select Health commercial (employer/individual) plans cover ABA under the plan\'s own Policy #630, with prior authorization required.' },
      { q: 'My client has "Select Health Community Care" — where does the ABA request go?', a: 'To Utah Medicaid directly, not to Select Health. ABA is carved out of all four Utah Medicaid ACOs (including SelectHealth Community Care) to state fee-for-service — see our Utah Medicaid guide.' },
      { q: 'How do I submit an ABA prior authorization to Select Health commercial?', a: 'Select Health\'s ABA Preauthorization Form, emailed to commercialUMintake@imail.org (fax 801-442-0825 as backup). Decisions on Utah commercial plans are due within 14 days.' },
      { q: 'What does Select Health pay for ABA?', a: 'No published fee schedule exists for either product. Community Care members\' ABA is paid at Utah Medicaid\'s own PRISM rates (not a Select Health rate); commercial rates are negotiated in your participating-provider agreement.' },
    ],
  },

  'aetna-utah': {
    slug: 'aetna-utah',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Utah Code § 31A-22-642 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Utah',
    state: 'UT', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Utah',
    h1: 'Aetna ABA coverage in Utah: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Utah: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Utah families — the national clinical policy, prior authorization, the Utah Code § 31A-22-642 mandate (markets, ages, caps, exemptions), Utah behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Utah, an Aetna card means three layers at once: the carrier\'s national clinical policy, Utah\'s autism insurance mandate (Utah Code § 31A-22-642), and the plan\'s market segment and funding type deciding which of the two actually binds. This guide stacks them in order — and in Utah, the market-segment question comes first, because the mandate covers individual and large-group plans but not small group.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Utah Code § 31A-22-642' },
      { label: 'Mandate markets', value: 'Individual + large group only — small group NOT covered' },
      { label: 'Mandate age', value: 'No age limit (plans entered/renewed on or after 1/1/2020)' },
      { label: 'Mandate caps', value: 'No hour limit since 2020; 600 hr/yr floor on legacy pre-2020 plans' },
      { label: 'Exempt from mandate', value: 'Small group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'UT Licensed Behavior Analyst (DOPL, Utah Code 58-61 Part 7)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Utah',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Utah is the legal floor underneath it: the state mandate below governs what individual and large-group fully-insured plans must cover, while small-group and self-funded plans answer to the plan document and federal parity instead. Market segment and plan funding type are therefore the first facts to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Utah.',
        ],
        cites: [
          { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Utah mandate: what it guarantees (and doesn\'t)',
        body: [
          'Utah Code § 31A-22-642 requires coverage for the diagnosis and treatment of autism spectrum disorder in the individual and large-group markets — small group plans are not named by the statute, making market segment the load-bearing question in Utah, even ahead of funding type. For plans entered or renewed on or after January 1, 2020 there is no age limit and no cap on covered ABA hours; the older 600-hours-a-year floor and the ages-2-to-under-10 window govern only legacy pre-2020 plans. The statute has operational teeth, too: the treatment plan is due to the insurer within 14 business days of starting treatment, the insurer may review it at most once every 3 months, and plan networks must include both board certified behavior analysts and qualified licensed mental health providers. Its diagnosis definition is strict — a board-certified neurologist, psychiatrist, or pediatrician with ASD experience, or an experienced licensed psychologist. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA supplies the parity floor for group plans. New from the 2026 amendment: beginning before July 1, 2027, every health benefit plan must report autism-assessment wait times, whether it imposes PA on assessment or treatment, and ABA utilization to the Utah Insurance Department annually — with public website disclosure of which plans reimburse non-physician therapists from September 1, 2027. Insurer PA behavior in Utah is about to become public record.',
        ],
        cites: [
          { title: 'Utah Code § 31A-22-642 (current version, effective 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
          { title: 'Utah Code § 31A-22-642 (prior version, effective 5/4/2022)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2022050420220504.pdf' },
        ],
      },
      {
        h2: 'No Utah-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Utah-specific ABA policy, form, or supplement — CPB 0648 contains no Utah entry, and Aetna\'s standard language defers to state mandates for fully-insured plans. The national policy plus the state mandate is the whole picture. That\'s worth knowing in itself: it means benefits verification (market segment, plan funding type, mandate applicability) is where Utah-specific answers come from, not a carrier document. Aetna also holds no Utah Medicaid ACO contract, so there is no Medicaid line of business to confuse an Aetna card with here.',
        ],
        cites: [
          { title: 'Aetna CPB 0648 — Autism Spectrum Disorders (no Utah entry)', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Utah',
        body: [
          'Utah requires a license to practice behavior analysis: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LABA) credentials under the Behavior Analyst Licensing Act (Utah Code Title 58, Chapter 61, Part 7), administered by the Division of Professional Licensing (DOPL). Behavior technicians work as certified paraprofessionals under QHP supervision rather than as licensees. On rates: Aetna does not publish commercial ABA fee schedules for Utah (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Utah does give you a public benchmark, though: the Medicaid PRISM rates effective 7/1/2026 pay $19.67 per 15-minute unit on 97153 and $37.51 on 97151/97155/97156.',
        ],
        cites: [
          { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7 (official)', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Market segment + funding type', desc: 'Individual or large group fully-insured (mandate applies) vs. small group or self-funded ERISA (exempt) — in Utah this decides everything. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report + diagnosing provider credentials', desc: 'The mandate\'s diagnosis definition names specific credentials (neurologist, psychiatrist, pediatrician with ASD experience, or licensed psychologist) — capture who diagnosed.' },
      { title: 'Treatment start date', desc: 'The mandate\'s treatment plan is due to the insurer within 14 business days of starting treatment — put the clock on the calendar.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Utah Code § 31A-22-642 (current, eff. 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
      { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Utah?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Utah\'s mandate (Utah Code § 31A-22-642) for individual and large-group fully-insured plans. Small-group and self-funded employer plans sit outside the mandate, so always verify market segment and funding type first.' },
      { q: 'What does the Utah autism mandate require?', a: 'For individual and large-group plans entered or renewed since 1/1/2020: coverage for ASD diagnosis and treatment with no age limit and no cap on ABA hours, a treatment plan due within 14 business days of starting treatment, insurer reviews at most every 3 months, and networks that include BCBAs. Small group is not covered by the statute.' },
      { q: 'What does Aetna pay for ABA in Utah?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Utah Medicaid\'s published PRISM rates ($19.67/unit on 97153, $37.51 on 97151/97155/97156, effective 7/1/2026) and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-utah': {
    slug: 'cigna-utah',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Utah Code § 31A-22-642 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Utah',
    state: 'UT', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Utah',
    h1: 'Cigna / Evernorth ABA coverage in Utah: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Utah: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Utah families — the national EN0499 policy, prior authorization, the Utah Code § 31A-22-642 mandate (markets, ages, caps, exemptions), Utah behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Utah, a Cigna card means three layers at once: the carrier\'s national clinical policy, Utah\'s autism insurance mandate (Utah Code § 31A-22-642), and the plan\'s market segment and funding type deciding which of the two actually binds. This guide stacks them in order — and in Utah, the market-segment question comes first, because the mandate covers individual and large-group plans but not small group.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Utah Code § 31A-22-642' },
      { label: 'Mandate markets', value: 'Individual + large group only — small group NOT covered' },
      { label: 'Mandate age', value: 'No age limit (plans entered/renewed on or after 1/1/2020)' },
      { label: 'Mandate caps', value: 'No hour limit since 2020; 600 hr/yr floor on legacy pre-2020 plans' },
      { label: 'Exempt from mandate', value: 'Small group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'UT Licensed Behavior Analyst (DOPL, Utah Code 58-61 Part 7)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Utah',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. And unlike Virginia — the one state EN0499 carves out — Utah fully-insured business is squarely subject to the policy, so the no-assessment-PA fast path holds here, with the Utah mandate controlling wherever it is more generous. Plan market segment and funding type are still the first facts to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Utah.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions (eff. 5/15/2026; only Virginia carved out)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
          { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Utah mandate: what it guarantees (and doesn\'t)',
        body: [
          'Utah Code § 31A-22-642 requires coverage for the diagnosis and treatment of autism spectrum disorder in the individual and large-group markets — small group plans are not named by the statute, making market segment the load-bearing question in Utah, even ahead of funding type. For plans entered or renewed on or after January 1, 2020 there is no age limit and no cap on covered ABA hours; the older 600-hours-a-year floor and the ages-2-to-under-10 window govern only legacy pre-2020 plans. The statute has operational teeth, too: the treatment plan is due to the insurer within 14 business days of starting treatment, the insurer may review it at most once every 3 months, and plan networks must include both board certified behavior analysts and qualified licensed mental health providers. Its diagnosis definition is strict — a board-certified neurologist, psychiatrist, or pediatrician with ASD experience, or an experienced licensed psychologist. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA supplies the parity floor for group plans. New from the 2026 amendment: beginning before July 1, 2027, every health benefit plan must report autism-assessment wait times, whether it imposes PA on assessment or treatment, and ABA utilization to the Utah Insurance Department annually — with public website disclosure of which plans reimburse non-physician therapists from September 1, 2027. Insurer PA behavior in Utah is about to become public record.',
        ],
        cites: [
          { title: 'Utah Code § 31A-22-642 (current version, effective 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
          { title: 'Utah Code § 31A-22-642 (prior version, effective 5/4/2022)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2022050420220504.pdf' },
        ],
      },
      {
        h2: 'No Utah-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no Utah-specific ABA policy, form, or supplement — EN0499 mentions Utah nowhere, and its only state exclusion is Virginia. The national policy plus the state mandate is the whole picture. That\'s worth knowing in itself: it means benefits verification (market segment, plan funding type, mandate applicability) is where Utah-specific answers come from, not a carrier document. Cigna also holds no Utah Medicaid ACO contract, so there is no Medicaid line of business to confuse a Cigna card with here.',
        ],
        cites: [
          { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Utah',
        body: [
          'Utah requires a license to practice behavior analysis: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LABA) credentials under the Behavior Analyst Licensing Act (Utah Code Title 58, Chapter 61, Part 7), administered by the Division of Professional Licensing (DOPL). Behavior technicians work as certified paraprofessionals under QHP supervision rather than as licensees. On rates: Cigna does not publish commercial ABA fee schedules for Utah (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Utah does give you a public benchmark, though: the Medicaid PRISM rates effective 7/1/2026 pay $19.67 per 15-minute unit on 97153 and $37.51 on 97151/97155/97156.',
        ],
        cites: [
          { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7 (official)', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Market segment + funding type', desc: 'Individual or large group fully-insured (mandate applies) vs. small group or self-funded ERISA (exempt) — in Utah this decides everything. Ask for the employer and check the card.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report + diagnosing provider credentials', desc: 'The mandate\'s diagnosis definition names specific credentials (neurologist, psychiatrist, pediatrician with ASD experience, or licensed psychologist) — capture who diagnosed.' },
      { title: 'Treatment start date', desc: 'The mandate\'s treatment plan is due to the insurer within 14 business days of starting treatment — put the clock on the calendar.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Utah Code § 31A-22-642 (current, eff. 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
      { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Utah?', a: 'Yes — under national policy EN0499 (which fully applies in Utah, unlike Virginia), layered on Utah\'s mandate (Utah Code § 31A-22-642) for individual and large-group fully-insured plans. Small-group and self-funded employer plans sit outside the mandate, so always verify market segment and funding type first.' },
      { q: 'Does the ABA assessment need prior authorization with Cigna in Utah?', a: 'No — EN0499 requires no PA on assessment codes 97151, 97152, and 0362T, and Utah is fully subject to that policy. Treatment then requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form.' },
      { q: 'What does the Utah autism mandate require?', a: 'For individual and large-group plans entered or renewed since 1/1/2020: coverage for ASD diagnosis and treatment with no age limit and no cap on ABA hours, a treatment plan due within 14 business days of starting treatment, insurer reviews at most every 3 months, and networks that include BCBAs. Small group is not covered by the statute.' },
      { q: 'What does Cigna pay for ABA in Utah?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Utah Medicaid\'s published PRISM rates ($19.67/unit on 97153, $37.51 on 97151/97155/97156, effective 7/1/2026) and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-utah': {
    slug: 'unitedhealthcare-utah',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Utah Code § 31A-22-642 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Utah',
    state: 'UT', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Utah',
    h1: 'UnitedHealthcare / Optum ABA coverage in Utah: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Utah: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Utah families — the national clinical policy, prior authorization, the Utah Code § 31A-22-642 mandate (markets, ages, caps, exemptions), Utah behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Utah, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Utah\'s autism insurance mandate (Utah Code § 31A-22-642), and the plan\'s market segment and funding type deciding which of the two actually binds. This guide stacks them in order — and in Utah, the market-segment question comes first, because the mandate covers individual and large-group plans but not small group.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Utah Code § 31A-22-642' },
      { label: 'Mandate markets', value: 'Individual + large group only — small group NOT covered' },
      { label: 'Mandate age', value: 'No age limit (plans entered/renewed on or after 1/1/2020)' },
      { label: 'Mandate caps', value: 'No hour limit since 2020; 600 hr/yr floor on legacy pre-2020 plans' },
      { label: 'Exempt from mandate', value: 'Small group plans; self-funded ERISA' },
      { label: 'Licensure', value: 'UT Licensed Behavior Analyst (DOPL, Utah Code 58-61 Part 7)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Utah',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months. Notably, Utah has no entry in Optum\'s ABA State Mandates supplemental criteria (the January 2026 edition lists 14 states — Utah is not among them), so Utah commercial ABA runs on Optum\'s standard national criteria plus the state mandate below. The mandate governs what individual and large-group fully-insured plans must cover, while small-group and self-funded plans answer to the plan document and federal parity instead. Market segment and plan funding type are therefore the first facts to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Utah.',
        ],
        cites: [
          { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
          { title: 'Optum — ABA State Mandates supplemental criteria (BH803ABA_STM1_2026; no Utah entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Utah mandate: what it guarantees (and doesn\'t)',
        body: [
          'Utah Code § 31A-22-642 requires coverage for the diagnosis and treatment of autism spectrum disorder in the individual and large-group markets — small group plans are not named by the statute, making market segment the load-bearing question in Utah, even ahead of funding type. For plans entered or renewed on or after January 1, 2020 there is no age limit and no cap on covered ABA hours; the older 600-hours-a-year floor and the ages-2-to-under-10 window govern only legacy pre-2020 plans. The statute has operational teeth, too: the treatment plan is due to the insurer within 14 business days of starting treatment, the insurer may review it at most once every 3 months, and plan networks must include both board certified behavior analysts and qualified licensed mental health providers. Its diagnosis definition is strict — a board-certified neurologist, psychiatrist, or pediatrician with ASD experience, or an experienced licensed psychologist. Self-funded ERISA plans are exempt by federal preemption, and MHPAEA supplies the parity floor for group plans. New from the 2026 amendment: beginning before July 1, 2027, every health benefit plan must report autism-assessment wait times, whether it imposes PA on assessment or treatment, and ABA utilization to the Utah Insurance Department annually — with public website disclosure of which plans reimburse non-physician therapists from September 1, 2027. Insurer PA behavior in Utah is about to become public record.',
        ],
        cites: [
          { title: 'Utah Code § 31A-22-642 (current version, effective 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
          { title: 'Utah Code § 31A-22-642 (prior version, effective 5/4/2022)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2022050420220504.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare and Utah Medicaid: no ACO, and a PMHP that doesn\'t touch ABA',
        body: [
          'UnitedHealthcare holds no Utah Medicaid ACO contract, so unlike most states there is no UHC Community Plan to confuse a card with. The one place the name appears on the Medicaid side is United Behavioral Health (Optum), listed among Utah\'s Prepaid Mental Health Plan contractors — but PMHPs cover inpatient and outpatient mental health and SUD services only, and ABA is carved out of Utah managed care entirely to state fee-for-service. If a Utah family turns out to be on Medicaid, their ABA runs through Utah Medicaid FFS regardless of any plan name — use our Utah Medicaid guide.',
        ],
        cites: [
          { title: 'Utah Medicaid Managed Care page (PMHP list incl. United Behavioral Health)', url: 'https://medicaid.utah.gov/managed-care/' },
        ],
      },
      {
        h2: 'Licensure & rates in Utah',
        body: [
          'Utah requires a license to practice behavior analysis: the Licensed Behavior Analyst (LBA) and Licensed Assistant Behavior Analyst (LABA) credentials under the Behavior Analyst Licensing Act (Utah Code Title 58, Chapter 61, Part 7), administered by the Division of Professional Licensing (DOPL). Behavior technicians work as certified paraprofessionals under QHP supervision rather than as licensees. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Utah (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. Utah does give you a public benchmark, though: the Medicaid PRISM rates effective 7/1/2026 pay $19.67 per 15-minute unit on 97153 and $37.51 on 97151/97155/97156.',
        ],
        cites: [
          { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7 (official)', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Market segment + funding type', desc: 'Individual or large group fully-insured (mandate applies) vs. small group or self-funded ERISA (exempt) — in Utah this decides everything. Ask for the employer and check the card.' },
      { title: 'Commercial vs. Medicaid', desc: 'No UHC Medicaid ACO exists in Utah — a Medicaid family\'s ABA goes to Utah Medicaid FFS, a different guide entirely.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report + validated tool', desc: 'Optum wants DSM-5-TR ASD confirmed with a validated instrument (ADI-R, ADOS-2, etc.); the mandate separately names diagnosing-provider credentials.' },
      { title: 'Treatment start date', desc: 'The mandate\'s treatment plan is due to the insurer within 14 business days of starting treatment — put the clock on the calendar.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (no Utah entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'Utah Code § 31A-22-642 (current, eff. 5/6/2026)', url: 'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.pdf' },
      { title: 'Behavior Analyst Licensing Act — Utah Code 58-61 Part 7', url: 'https://le.utah.gov/xcode/Title58/Chapter61/C58-61-P7_2015051220150701.pdf' },
      { title: 'Utah Medicaid Managed Care page (PMHP list)', url: 'https://medicaid.utah.gov/managed-care/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Utah?', a: 'Yes — under Optum\'s national two-step authorization process for ASD, layered on Utah\'s mandate (Utah Code § 31A-22-642) for individual and large-group fully-insured plans. Small-group and self-funded employer plans sit outside the mandate, so always verify market segment and funding type first.' },
      { q: 'Does Optum have Utah-specific ABA criteria?', a: 'No — Utah has no entry in Optum\'s ABA State Mandates supplemental criteria (January 2026 edition), so Utah commercial ABA runs on Optum\'s standard national criteria plus the state mandate.' },
      { q: 'What does the Utah autism mandate require?', a: 'For individual and large-group plans entered or renewed since 1/1/2020: coverage for ASD diagnosis and treatment with no age limit and no cap on ABA hours, a treatment plan due within 14 business days of starting treatment, insurer reviews at most every 3 months, and networks that include BCBAs. Small group is not covered by the statute.' },
      { q: 'What does UnitedHealthcare pay for ABA in Utah?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against Utah Medicaid\'s published PRISM rates ($19.67/unit on 97153, $37.51 on 97151/97155/97156, effective 7/1/2026) and treat rate-setting as part of contracting.' },
    ],
  },
};
