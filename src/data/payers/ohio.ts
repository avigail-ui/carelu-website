import type { PayerConfig } from './types.js';

export const ohioPayers: Record<string, PayerConfig> = {
  'ohio-medicaid': {
    slug: 'ohio-medicaid',
    cardDesc: 'OAC 5160-34: all-PA ABA, 6-month reviews, published rates, and the OhioRISE carve-out myth.',
    assessmentPA: 'Required — PA on all covered ABA codes under the current rule (a pending rewrite would exempt the first 10 assessment hours per 180 days)',
    treatmentPA: 'Required — with medical-necessity review at baseline and every 6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD per OAC 5160-34-02',
    payer: 'Ohio Medicaid',
    state: 'OH', kind: 'state-medicaid',
    pill: 'Payer Guide · Ohio Medicaid',
    h1: 'Ohio Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Ohio Medicaid ABA Coverage, Rates & Prior Authorization Guide | Carelu',
    metaDescription:
      'How Ohio Medicaid covers ABA (adaptive behavior services) under OAC 5160-34-02 — prior authorization, 6-month reviews, published fee-schedule rates by credential tier, COBA/BCBA credentialing, and why OhioRISE never pays for ABA.',
    intro: [
      'Ohio Medicaid covers ABA — "adaptive behavior services" — for the assessment and treatment of autism spectrum disorder under Ohio Administrative Code rule 5160-34-02. Ohio runs heavily through its Next Generation managed-care plans, several of which layer genuinely distinct clinical policies on the state rule, so the per-plan guides below matter more here than in most states. Two facts worth knowing cold: OhioRISE (Aetna) never pays for ABA — the member\'s MCO does, even for OhioRISE-enrolled youth — and ODM has a pending rewrite of the ABA chapter that would loosen assessment PA.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — adaptive behavior services for ASD (OAC 5160-34-02)' },
      { label: 'Prior auth', value: 'Required for all covered ABA codes (current rule)' },
      { label: 'Reviews', value: 'Medical necessity at baseline, then every 6 months' },
      { label: 'Rates (per 15 min)', value: '97153 $16.04 (RBT) · 97155 $27.28 · 97151 $30.49 (COBA/BCBA tier)' },
      { label: 'Credentialing', value: 'COBA or BCBA/BCBA-D as independent practitioner; ODM Provider Type 19' },
      { label: 'OhioRISE', value: 'Does NOT pay ABA — bill the member\'s MCO (or FFS), always' },
      { label: 'Staff screening', value: 'COBA: BCI + FBI fingerprint check (OAC 4783-4-03) · RBTs: BACB background + abuse-registry check within 180 days' },
    ],
    sections: [
      {
        h2: 'Coverage & the state rule',
        body: [
          'OAC rule 5160-34-02 covers adaptive behavior services for the assessment and treatment of ASD, with prior authorization required for all covered ABA codes at both initial and ongoing stages and medical-necessity review at baseline and at least every six months. The ASD diagnosis must come from a documented comprehensive diagnostic evaluation by a licensed physician, psychologist, or other clinician qualified to diagnose autism, demonstrating DSM-5-TR criteria. Independent practitioners are Certified Ohio Behavior Analysts (COBA, under ORC Chapter 4783) or BACB BCBAs/BCBA-Ds, enrolled with ODM as Provider Type 19, Specialty 190; BCaBAs and RBTs work under supervision.',
          'Watch the pending rewrite: ODM has drafted new rules 5160-34-01 through -03 that would, among other changes, require assessment PA only beyond 10 hours per 180 days and remove specific diagnostic-condition requirements. As of mid-2026 the rewrite had not been adopted — the all-PA framework still governs — but any guide or SOP built on Ohio rules should be re-checked when the chapter files. One access note from this review: codes.ohio.gov\'s live page for rule 5160-34-02 currently returns "Number Not Found," and the entire 5160-34 chapter is missing from the Title 5160 master chapter index — a gap between 5160-33 and 5160-35 — while neighboring rules resolve normally. We could not determine from primary sources whether this reflects the rewrite actually filing (which would explain a renumbering) or a site indexing gap; confirm current rule status with Rules@Medicaid.Ohio.gov or JCARR before relying on the codes.ohio.gov citation below.',
        ],
        cites: [
          { title: 'Ohio Administrative Code — rule 5160-34-02 (URL currently returns "Number Not Found" — verify before relying on it)', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
          { title: 'ODM — draft ABA rule package (5160-34-01/-02/-03 + fee appendix)', url: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf' },
        ],
      },
      {
        h2: 'Rates: tiered by credential',
        body: [
          'ODM\'s ABA fee schedule pays per 15-minute unit by practitioner tier. Current maximum payment amounts: 97151 assessment $30.49 at the independent-practitioner tier (COBA/BCBA/BCBA-D) and $22.67 at the BCaBA tier; 97153 direct treatment $16.04 (RBT tier); 97155 protocol modification $27.28 / $20.63; 97156 family training $30.09 / $22.37; group codes and 0362T/0373T ($33.54) have their own lines. MCO-contracted rates are negotiated, with the ODM schedule as the reference point. These amounts come from ODM\'s rule filing labeled "current maximum payment amount" — confirm the in-force appendix to 5160-34-02 when modeling revenue precisely.',
        ],
        cites: [
          { title: 'ODM — ABA rule package with Appendix A fee schedule', url: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf' },
        ],
      },
      {
        h2: 'The OhioRISE carve-out myth',
        body: [
          'A recurring point of confusion in Ohio: OhioRISE — the Aetna-run specialty plan for youth with complex behavioral-health needs — does not cover ABA. ODM\'s Mixed Services Protocol states explicitly that claims for ABA services (97151–97158, 0362T, 0373T) for ASD are the responsibility of the member\'s Medicaid MCO or fee-for-service, even when the youth is enrolled in OhioRISE. If an intake team hears "we\'re on OhioRISE," the follow-up question is which MCO holds the medical benefit — that\'s who authorizes and pays for ABA.',
        ],
        cites: [
          { title: 'ODM — OhioRISE Mixed Services Protocol (4/1/2025)', url: 'https://dam.assets.ohio.gov/image/upload/v1743449666/managedcare.medicaid.ohio.gov/OhioRISE/OhioRISE_Mixed_Services_Protocol_20250401.pdf' },
        ],
      },
      {
        h2: 'Staffing & credentialing: who you can hire, and what they must clear',
        body: [
          'Ohio layers no separate technician license or state registry on top of the BACB — behavior technicians are RBTs, so the BACB\'s own bar is the employee-level floor: applicants must be at least 18 with a high-school education, complete the 40-hour training and initial competency assessment, and pass both a criminal background check and an abuse-registry check no more than 180 days before applying (the BACB itself doesn\'t require fingerprinting). The pending rule rewrite (draft 5160-34-01) would formalize this — defining the RBT as a BACB-certified paraprofessional under close, ongoing supervision of a COBA, BCBA, or BCBA-D — and would add a 90-day "exam-eligible RBT" window: a technician who has finished the coursework and competency assessment could render supervised services for 90 days from exam eligibility, documented on form ODM 10391, then must be certified or stop rendering. As of the May 2025 clearance package that chapter was still marked draft and not yet filed — hire to the BACB requirements today and re-check when it files.',
          'Screening runs at two levels, and it pays to keep them straight. At the supervisor level, COBA applicants must complete a fingerprint-based BCI criminal-records check that includes an FBI check (OAC 4783-4-03) — the Board of Psychology accepts results only directly from BCI, won\'t issue the certificate without acceptable results, and the applicant bears the cost (the board doesn\'t currently publish COBA application fees in a retrievable form — confirm directly). At the organization level, OAC 5160-1-17.8 runs the database battery at enrollment and revalidation: the provider and every 5%-or-greater owner or managing agent are screened against the HHS-OIG exclusion list, SAM, the Medicare Exclusion Database, other states\' Medicaid termination lists, the ODH nurse aide registry, and the DODD abuser registry — a hit disqualifies the provider agreement (the appendix assigning ABA Provider Type 19\'s screening risk level wasn\'t retrievable; high-risk types add owner fingerprinting). One trap: Ohio\'s ARCS registry-check mandates (OAC 5123-2-02) bind DODD-system and waiver staff, not state-plan ABA — no Ohio rule mandates employee-level fingerprints for state-plan-only RBTs, so the BACB 180-day check plus mirroring the OIG/SAM exclusion checks on all staff is the operative standard.',
          'Supervision is where Ohio is unusual: OAC 4783-6-02 requires the COBA to build a written supervision plan into each client\'s treatment plan — naming every supervisee, their relationship to the client, and their responsibilities, with the amount and type of training and supervision specified — and mandates consultation before plan initiation and before any modification plus periodic direct observation, but sets no fixed ratio; frequency and intensity are the COBA\'s documented judgment, and client assessment, treatment-plan development, and efficacy review can never be delegated. The quantitative floor comes from the plans instead: Optum/UHC\'s Ohio Medicaid criteria (effective 7/1/2026) require 1–2 hours of direct case supervision per 10 hours of direct treatment per week, citing CASP standards, and CareSource\'s MM-0028 requires supervision records retained 5 years (COBAs) or 7 years (BCBAs/RBTs) after supervision ends — with claims tied to documentation discrepancies subject to recoupment. Staff to the strictest contracted plan, not the state rule.',
        ],
        cites: [
          { title: 'BACB — RBT Handbook (background-check and supervision requirements)', url: 'https://www.bacb.com/rbt-handbook' },
          { title: 'ODM — draft ABA rule package (5160-34-01/-02/-03 + fee appendix)', url: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf' },
          { title: 'Ohio Administrative Code — rule 4783-4-03 (COBA criminal records check)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-03' },
          { title: 'Ohio Administrative Code — rule 5160-1-17.8 (provider screening)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-5160-1-17-8' },
          { title: 'Ohio Administrative Code — rule 5123-2-02 (DODD background investigations)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-5123-2-02' },
          { title: 'Ohio Administrative Code — rule 4783-6-02 (COBA supervision responsibilities)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-6-02' },
          { title: 'Optum/UHC Community Plan — Ohio Medicaid supplemental clinical criteria (eff. 7/1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf' },
          { title: 'CareSource — Ohio Medicaid ABA policy (MM-0028)', url: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Member ID & Next Gen MCO', desc: 'CareSource, Buckeye, Molina, Anthem, UHC, AmeriHealth Caritas, or Humana — several run materially different ABA policies.' },
      { title: 'OhioRISE status + underlying MCO', desc: 'OhioRISE never pays ABA — identify the MCO that does.' },
      { title: 'ASD diagnosis (DSM-5-TR)', desc: 'The comprehensive diagnostic evaluation, the licensed clinician who completed it, and the date — some MCOs restrict which specialties qualify.' },
      { title: 'Rendering practitioner tier', desc: 'COBA/BCBA vs. BCaBA vs. RBT determines the rate line — staffing is a revenue decision.' },
      { title: 'Review cadence', desc: 'Baseline and 6-month medical-necessity reviews — the intake baseline sets the terms.' },
    ],
    sources: [
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
      { title: 'ODM — ABA rule package + Appendix A fee schedule (draft filing)', url: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf' },
      { title: 'ODM — OhioRISE Mixed Services Protocol', url: 'https://dam.assets.ohio.gov/image/upload/v1743449666/managedcare.medicaid.ohio.gov/OhioRISE/OhioRISE_Mixed_Services_Protocol_20250401.pdf' },
      { title: 'Ohio Medicaid Managed Care Health Plan Comparison (2026) — confirms current 7-plan roster', url: 'https://ohfiles.blob.core.windows.net/public/OhioMHWebsite/Documents/Ohio%20Medicaid%20Managed%20Care%20Health%20Plan%20Comparison%202026.pdf' },
      { title: 'CareSource — Ohio Medicaid ABA policy (MM-0028)', url: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf' },
      { title: 'BACB — RBT Handbook (background-check and supervision requirements)', url: 'https://www.bacb.com/rbt-handbook' },
      { title: 'Ohio Administrative Code — rule 4783-4-03 (COBA criminal records check)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-03' },
      { title: 'Ohio Administrative Code — rule 5160-1-17.8 (provider screening)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-5160-1-17-8' },
      { title: 'Ohio Administrative Code — rule 5123-2-02 (DODD background investigations)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-5123-2-02' },
      { title: 'Ohio Administrative Code — rule 4783-6-02 (COBA supervision responsibilities)', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-6-02' },
      { title: 'Optum/UHC Community Plan — Ohio Medicaid supplemental clinical criteria (eff. 7/1/2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf' },
    ],
    faq: [
      { q: 'Does Ohio Medicaid cover ABA therapy?', a: 'Yes — as adaptive behavior services for ASD under OAC 5160-34-02, with prior authorization on all covered ABA codes and medical-necessity reviews at baseline and every six months.' },
      { q: 'Does OhioRISE cover ABA?', a: 'No — ODM\'s Mixed Services Protocol assigns ABA claims to the member\'s Medicaid MCO (or FFS) even for OhioRISE-enrolled youth. Always identify the underlying MCO.' },
      { q: 'What does Ohio Medicaid pay for ABA?', a: 'Per 15-minute unit by credential tier: 97153 at $16.04 (RBT), 97155 at $27.28 and 97151 at $30.49 at the COBA/BCBA tier, with lower BCaBA-tier amounts. MCO rates are contractual against this benchmark.' },
      { q: 'Who can provide ABA under Ohio Medicaid?', a: 'Independent practitioners are COBAs (Ohio Board of Psychology, ORC 4783) or BCBAs/BCBA-Ds enrolled as ODM Provider Type 19, Specialty 190; BCaBAs and RBTs deliver under supervision.' },
    ],
  },

  'caresource-ohio': {
    slug: 'caresource-ohio',
    family: 'caresource',
    cardDesc: 'The strictest OH policy: named diagnostician specialties, ADOS/ADI-R/CARS-2, docs-before-claims.',
    assessmentPA: 'Required — medical-necessity review on all ABA at baseline; assessments capped ~6–10 hrs per 6 months without justification',
    treatmentPA: 'Required — 6-month cycles; treatment records must reach CareSource BEFORE claims are accepted',
    dxRequired: 'Yes \u2014 ASD from a child/adolescent psychiatrist, psychologist, child neurologist, or developmental pediatrician (ADOS/ADI-R/CARS-2)',
    payer: 'CareSource Ohio',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · CareSource (OH)',
    h1: 'CareSource Ohio ABA coverage (Next Gen MCO).',
    metaTitle: 'CareSource Ohio Medicaid ABA Coverage & Prior Auth (MM-0028) | Carelu',
    metaDescription:
      'How CareSource administers Ohio Medicaid ABA under policy MM-0028 — restricted diagnostician specialties, required diagnostic instruments, MUE daily-unit limits, the documentation-before-claims rule, and 6-month reviews.',
    intro: [
      'CareSource is the dominant Ohio Medicaid plan in our data, and its ABA policy (MM-0028, current version effective July 2025) is materially stricter than the state rule: it names which specialties may diagnose, which instruments count, how many assessment hours are reasonable, and — most operationally unusual — requires treatment documentation to be submitted before claims will be accepted. If a family carries CareSource, this policy is the gate.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO' },
      { label: 'Policy', value: 'OH MCD-MM-0028 (eff. 7/1/2025), citing MCG B-806-T' },
      { label: 'Diagnostician', value: 'Child/adolescent psychiatrist, psychologist, child neurologist, or developmental pediatrician' },
      { label: 'Instruments', value: 'ADOS, ADI-R, or CARS-2; evals >24 months old need a symptom letter' },
      { label: 'Claims rule', value: 'Treatment records BEFORE claims — no docs, no payment' },
      { label: 'Discontinuation', value: 'No meaningful progress across two successive 6-month periods' },
      { label: 'Diagnosis recency', value: 'Eval >24 months old needs a current-symptoms letter' },
    ],
    sections: [
      {
        h2: 'The diagnosis bar — narrower than the state\'s',
        body: [
          'Where the state rule accepts any licensed clinician qualified to diagnose autism, MM-0028 restricts the diagnosis to a child/adolescent psychiatrist, psychologist, child neurologist, or developmental pediatrician, using a standardized instrument — ADOS, ADI-R, or CARS-2. If the evaluation is more than 24 months old, a provider letter documenting DSM symptoms within the past year is required. Screening referral packets against these names and instruments at intake prevents the most common CareSource denial.',
        ],
        cites: [
          { title: 'CareSource — OH MCD-MM-0028 (eff. 7/1/2025)', url: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf' },
        ],
      },
      {
        h2: 'Authorization, units, and the docs-before-claims rule',
        body: [
          'All ABA services get medical-necessity review at baseline and every 6 months, with continuation requests documenting progress against baseline using the same measurement tools. Behavioral assessments should generally not exceed 6–10 hours per 6-month period without justification. Daily units follow the CMS MUE maxima, enumerated in the policy: 97151 at 32, 97153 at 32, 97155 at 24, 97156 at 16 daily units, among others. The operational standout: treatment records must be submitted to CareSource prior to claim submission — "claims will not be accepted without accompanying treatment documentation" — which makes clinical-documentation turnaround a cash-flow variable. UM runs at (800) 488-0134 via the CareSource Provider Portal.',
          'Other texture worth knowing: telehealth covers parent training and supervision, with 1:1 ABA via telehealth only when medically necessary under a documented service-delivery plan; H0036 (CPST) billing is accepted from community behavioral health centers in lieu of ABA CPT codes; and the discontinuation trigger is no meaningful progress across two successive 6-month authorization periods.',
        ],
        cites: [
          { title: 'CareSource — OH MCD-MM-0028 (eff. 7/1/2025)', url: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf' },
          { title: 'CareSource — Ohio Medicaid prior authorization list', url: 'https://www.caresource.com/documents/ohio-medicaid-prior-authorization-list/' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnostician specialty + instrument', desc: 'Must be one of the four named specialties using ADOS, ADI-R, or CARS-2 — screen before submission.' },
      { title: 'Evaluation date', desc: '>24 months old triggers the symptom-documentation letter requirement.' },
      { title: 'Documentation pipeline', desc: 'Treatment records precede claims — build the handoff so billing never waits on notes.' },
      { title: 'Progress measurement plan', desc: 'Continuations must reuse baseline measurement tools — lock them in at the start.' },
    ],
    sources: [
      { title: 'CareSource — OH MCD-MM-0028 (eff. 7/1/2025)', url: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf' },
      { title: 'CareSource — Ohio Medicaid prior authorization list', url: 'https://www.caresource.com/documents/ohio-medicaid-prior-authorization-list/' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does CareSource Ohio cover ABA therapy?', a: 'Yes — under policy MM-0028, with medical-necessity review on all ABA at baseline and every 6 months. Its requirements are stricter than the state rule on diagnostician specialty, instruments, and documentation.' },
      { q: 'Who can diagnose autism for CareSource Ohio ABA?', a: 'A child/adolescent psychiatrist, psychologist, child neurologist, or developmental pediatrician, using ADOS, ADI-R, or CARS-2 — narrower than the state baseline.' },
      { q: 'Why did CareSource reject our claim?', a: 'A distinctive MM-0028 rule: treatment documentation must be submitted before claims. Claims without accompanying treatment records are not accepted — check the documentation pipeline first.' },
    ],
  },

  'buckeye-health-plan': {
    slug: 'buckeye-health-plan',
    family: 'centene',
    cardDesc: 'In-network assessments PA-free; CP.BH.104 hour parameters (6/day, 30/wk) and school rules.',
    assessmentPA: 'Not required in-network — 97151/97152 need PA for out-of-network only (plan form)',
    treatmentPA: 'Required — 97153–97158 via the Autism Services PA form with IDI/FBA, schedule, parent-training plan, IEP',
    dxRequired: 'Yes \u2014 autism diagnosis; CDE accepted within the past 5 years',
    payer: 'Buckeye Health Plan (OH)',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · Buckeye Health Plan',
    h1: 'Buckeye Health Plan ABA coverage (Next Gen MCO).',
    metaTitle: 'Buckeye Health Plan (Ohio Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Buckeye Health Plan administers Ohio Medicaid ABA — no PA on in-network assessments, Centene policy CP.BH.104 hour parameters, the Autism Services PA form package, and school-attendance expectations.',
    intro: [
      'Buckeye Health Plan (Centene) runs Ohio Medicaid ABA under Centene\'s corporate clinical policy CP.BH.104 — and offers the most intake-friendly front door of Ohio\'s stricter plans: in-network assessment codes 97151 and 97152 require no prior authorization (PA applies out-of-network only). The treatment side is where Centene\'s structure bites, with explicit hour parameters and a documentation package that rewards preparation.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO (Centene)' },
      { label: 'Policy', value: 'CP.BH.104 (rev. 2/2026) + CP.BH.105 documentation requirements' },
      { label: 'Assessment PA', value: 'None in-network; out-of-network only (97151, 97152)' },
      { label: 'Hour parameters', value: '≤6 hrs/day, ≤30 hrs/wk unless justified; <20 hrs/wk for full-time students' },
      { label: 'Supervision', value: '97155 ≥2 hrs/wk or 10% of direct hours; max 20% unless justified' },
      { label: 'Diagnosis window', value: 'CDE accepted within the past 5 years' },
      { label: 'Diagnosis recency', value: 'CDE accepted within the past 5 years' },
    ],
    sections: [
      {
        h2: 'The treatment-request package',
        body: [
          'Treatment PA (97153–97158) runs through Buckeye\'s Autism Services Prior Authorization Request Form, which wants the individual diagnostic interview or FBA, objective testing results, a description of coordination with other services, the proposed schedule with rendering provider type per session, a parent-training plan, and a copy of the IEP or IFSP. The form also requires an HSPP-or-physician attestation of active participation in the treatment plan. Requests fax to (866) 694-3649 (UM phone (800) 224-1991); retrospective dates aren\'t processed on the standard form and route to a separate fax. The pre-auth check tool on buckeyehealthplan.com answers code-level questions.',
        ],
        cites: [
          { title: 'Buckeye — Autism Services Prior Authorization Request Form', url: 'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/WebsitePDFs/BehavioralHealthEducation/Medicaid-ABA-OTR-P-Form-508-6-28-23.pdf' },
        ],
      },
      {
        h2: 'Hour parameters and school expectations',
        body: [
          'CP.BH.104 sets the numbers: treatment should not exceed 6 hours/day and 30 hours/week without detailed clinical justification (severity or escalation criteria, with BCBA and guardian signatures), and the policy expects under 20 hours/week for children attending school full-time — comprehensive ABA is framed as 30–40 hours/week for the cases that warrant it. Protocol modification (97155) should run at least 2 hours/week or 10% of direct hours (whichever is greater), capped at 20% unless justified. The comprehensive diagnostic evaluation is accepted if conducted within the past five years.',
        ],
        cites: [
          { title: 'Buckeye — CP.BH.104 Applied Behavior Analysis (rev. 2/2026)', url: 'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/policies/clinical-policies/CP.BH.104.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Network status', desc: 'In-network assessments skip PA entirely — confirm contracting before promising the fast path.' },
      { title: 'School schedule', desc: 'Full-time students face the <20 hrs/week expectation — capture attendance honestly.' },
      { title: 'IEP / IFSP copy', desc: 'Required in the treatment package — request it at intake, not at submission.' },
      { title: 'Physician/HSPP engagement', desc: 'The attestation of active participation needs a named, willing clinician.' },
    ],
    sources: [
      { title: 'Buckeye — CP.BH.104 Applied Behavior Analysis', url: 'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/policies/clinical-policies/CP.BH.104.pdf' },
      { title: 'Buckeye — Autism Services PA Request Form', url: 'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/WebsitePDFs/BehavioralHealthEducation/Medicaid-ABA-OTR-P-Form-508-6-28-23.pdf' },
      { title: 'Buckeye — clinical & payment policies index', url: 'https://www.buckeyehealthplan.com/providers/resources/clinical-payment-policies.html' },
    ],
    faq: [
      { q: 'Does Buckeye Health Plan cover ABA therapy?', a: 'Yes — under Centene\'s CP.BH.104 policy. In-network assessments (97151, 97152) need no prior authorization; treatment codes require PA via the Autism Services form.' },
      { q: 'What are Buckeye\'s ABA hour limits?', a: 'No more than 6 hours/day and 30 hours/week without detailed clinical justification, and under 20 hours/week expected for full-time students. Protocol modification runs 2 hrs/week or 10% of direct hours, capped at 20% unless justified.' },
      { q: 'How current must the autism diagnosis be for Buckeye?', a: 'The comprehensive diagnostic evaluation is accepted if conducted within the past 5 years.' },
    ],
  },

  'molina-healthcare-ohio': {
    slug: 'molina-healthcare-ohio',
    family: 'molina',
    cardDesc: 'Tracks state ABA policy; Availity-only PA since 1/2026 — key documents best pulled via portal.',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD per OAC 5160-34-02',
    payer: 'Molina Healthcare of Ohio',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · Molina (OH)',
    h1: 'Molina Healthcare of Ohio ABA coverage (Next Gen MCO).',
    metaTitle: 'Molina Healthcare of Ohio Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of Ohio administers Medicaid ABA — state-policy-aligned criteria, the January 2026 move to Availity-only prior authorization, and the contacts and checks worth confirming in the portal.',
    intro: [
      'Molina Healthcare of Ohio administers the Medicaid ABA benefit in line with the state framework — no distinct Molina ABA clinical policy has surfaced publicly — with the plan-specific story being workflow: effective January 1, 2026, Molina discontinued fax PA submissions in Ohio, making Availity Essentials the sole authorization channel. A sourcing note: Molina\'s site blocks automated access, so verify plan-level specifics in Availity or by phone rather than relying on cached summaries.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO' },
      { label: 'Clinical rules', value: 'State OAC 5160-34 framework — no distinct Molina ABA policy found' },
      { label: 'Prior auth', value: 'Required for ABA per the plan\'s PA list' },
      { label: 'Submission', value: 'Availity Essentials ONLY since 1/1/2026 (fax discontinued)' },
      { label: 'BH auth line', value: '(855) 322-4081 (confirm current number in the portal)' },
      { label: 'Rates', value: 'Contracted; ODM fee schedule is the benchmark' },
    ],
    sections: [
      {
        h2: 'How Molina runs ABA authorization',
        body: [
          'Clinically, expect the OAC 5160-34 baseline: PA on covered ABA codes, DSM-5-TR diagnosis via comprehensive evaluation, and 6-month medical-necessity reviews. Operationally, the January 2026 change matters most — all prior authorization requests go through Availity Essentials, with fax submissions no longer accepted in Ohio. Because Molina\'s public site is inaccessible to automated tools (and some cached numbers may be stale), confirm the current PA code list and behavioral-health contacts inside Availity or via the plan\'s provider line before building SOPs around them. The OhioRISE rule applies here as everywhere: ABA for an OhioRISE-enrolled Molina member still bills to Molina.',
        ],
        cites: [
          { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
          { title: 'Molina OH — prior authorization information (access via portal; site blocks automated retrieval)', url: 'https://www.molinahealthcare.com/members/oh/en-US/mem/medicaid/overvw/care/prior-authorizations.aspx' },
        ],
      },
    ],
    collect: [
      { title: 'Availity access', desc: 'The only PA channel since January 2026 — make sure the team\'s registration and payer connection are live.' },
      { title: 'ASD diagnosis (DSM-5-TR)', desc: 'Comprehensive evaluation per the state baseline.' },
      { title: 'Current PA code list', desc: 'Pull it from Availity each quarter — the public site can\'t be relied on for updates.' },
    ],
    sources: [
      { title: 'Molina OH — prior authorization page (verify via portal)', url: 'https://www.molinahealthcare.com/members/oh/en-US/mem/medicaid/overvw/care/prior-authorizations.aspx' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of Ohio cover ABA therapy?', a: 'Yes — under the Ohio Medicaid framework (OAC 5160-34), with prior authorization required on ABA services. No distinct Molina clinical policy layers on top.' },
      { q: 'How do I submit an ABA authorization to Molina Ohio?', a: 'Through Availity Essentials — Molina discontinued fax PA submissions in Ohio effective January 1, 2026.' },
    ],
  },

  'anthem-ohio-medicaid': {
    slug: 'anthem-ohio-medicaid',
    family: 'anthem',
    cardDesc: 'CG-BEH-02 adopted on top of the state rule; Availity/ICR, EPSDT framing in the provider manual.',
    treatmentPA: 'Required — UM requests via Availity Essentials / Interactive Care Reviewer',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD per OAC 5160-34-02',
    payer: 'Anthem BCBS Ohio (Medicaid)',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · Anthem (OH Medicaid)',
    h1: 'Anthem Ohio Medicaid ABA coverage (Next Gen MCO).',
    metaTitle: 'Anthem Ohio Medicaid ABA Coverage & Prior Auth (CG-BEH-02) | Carelu',
    metaDescription:
      'How Anthem administers Ohio Medicaid ABA — the adopted CG-BEH-02 adaptive behavioral treatment guideline on top of OAC 5160-34, Availity/ICR submission, and EPSDT framing for under-21 members.',
    intro: [
      'Anthem Blue Cross and Blue Shield administers Ohio Medicaid ABA by adopting its corporate Clinical UM Guideline CG-BEH-02 (Adaptive Behavioral Treatment) on top of the state rule — the same guideline family it applies in Georgia and elsewhere, bringing hour parameters and supervision ratios the state rule doesn\'t specify. The provider manual frames ASD services for under-21 members squarely under EPSDT: medically necessary services can exceed adult plan limits.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO' },
      { label: 'Clinical rules', value: 'CG-BEH-02 adopted (per the plan\'s Clinical UM Guidelines list)' },
      { label: 'Prior auth', value: 'Via Availity Essentials / Interactive Care Reviewer' },
      { label: 'Hour parameters', value: 'CG-BEH-02 family: ≤40 hrs/wk; ~2 hrs protocol modification per 10 direct' },
      { label: 'EPSDT', value: 'Under-21 services may exceed adult limits when medically necessary' },
      { label: 'OhioRISE', value: 'Inpatient psych routes to OhioRISE — ABA stays with Anthem' },
    ],
    sections: [
      {
        h2: 'How Anthem administers the benefit',
        body: [
          'Anthem\'s Ohio Medicaid Clinical UM Guidelines list confirms CG-BEH-02 (and CG-BEH-15 for activity therapy) as the adopted criteria for adaptive behavioral treatment, layered on the OAC 5160-34 baseline. The CG-BEH-02 family of guidelines carries the familiar Anthem parameters — total requested treatment at or under 40 hours/week, protocol modification around 2 hours per 10 direct hours — though the Ohio-specific published delta is thinner than at CareSource or Buckeye, so verify current hour rules in the guideline text or the PA lookup tool at providers.anthem.com/oh before finalizing a request. UM submissions run through Availity Essentials\' Interactive Care Reviewer, per the October 2025 provider manual, which also confirms the EPSDT framing and that under-21 inpatient psychiatric care routes to OhioRISE while ABA remains Anthem\'s responsibility.',
        ],
        cites: [
          { title: 'Anthem OH Medicaid — Clinical UM Guidelines list (CG-BEH-02)', url: 'https://providers.anthem.com/docs/gpp/OH_CAID_FEB23CUMG.pdf' },
          { title: 'Anthem OH Medicaid — provider manual (10/2025)', url: 'https://providers.anthem.com/docs/gpp/OH_CAID_ProviderManual.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'PA lookup check', desc: 'The assessment-vs-treatment PA split isn\'t published — run the codes through the lookup tool per case.' },
      { title: 'ASD diagnosis (DSM-5-TR)', desc: 'Comprehensive evaluation per the state baseline.' },
      { title: 'Requested hours + justification', desc: 'CG-BEH-02\'s hour parameters reward requests framed against severity and history.' },
      { title: 'OhioRISE status', desc: 'Psychiatric services may route to OhioRISE, but ABA bills to Anthem — keep the paths straight.' },
    ],
    sources: [
      { title: 'Anthem OH Medicaid — Clinical UM Guidelines list', url: 'https://providers.anthem.com/docs/gpp/OH_CAID_FEB23CUMG.pdf' },
      { title: 'Anthem OH Medicaid — provider manual (10/2025)', url: 'https://providers.anthem.com/docs/gpp/OH_CAID_ProviderManual.pdf' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does Anthem Ohio Medicaid cover ABA therapy?', a: 'Yes — under its adopted CG-BEH-02 adaptive behavioral treatment guideline on top of OAC 5160-34, submitted via Availity\'s Interactive Care Reviewer, with EPSDT protections for under-21 members.' },
      { q: 'Does OhioRISE change anything for Anthem ABA members?', a: 'Inpatient psychiatric care for under-21s routes to OhioRISE, but ABA always stays with Anthem (per ODM\'s mixed-services protocol) — bill the MCO, not OhioRISE.' },
    ],
  },

  'unitedhealthcare-community-plan-ohio': {
    slug: 'unitedhealthcare-community-plan-ohio',
    family: 'unitedhealthcare',
    cardDesc: 'Optum\'s OH supplemental criteria: 80% utilization trigger, tool lists, Provider Type 19 detail.',
    assessmentPA: 'Per the state rule — Optum\'s OH criteria defer to OAC for practitioner and PA requirements',
    treatmentPA: 'Required — reviews per auth period; utilization below 80% over 2 weeks triggers barrier documentation',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD with a validated screener AND a formal tool (ADOS/ADI-R/DISCO)',
    payer: 'UnitedHealthcare Community Plan of Ohio',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · UHC Community Plan (OH)',
    h1: 'UnitedHealthcare Community Plan of Ohio ABA coverage (Next Gen MCO).',
    metaTitle: 'UHC Community Plan Ohio Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers Ohio Medicaid ABA — Optum\'s Ohio supplemental clinical criteria, the 80% utilization review trigger, diagnostic tool requirements, and Provider Type 19 credentialing.',
    intro: [
      'UnitedHealthcare Community Plan of Ohio runs ABA through Optum Behavioral Health under a dedicated Ohio Medicaid supplemental clinical criteria document (effective July 2026) — which defers to the Ohio Administrative Code on eligibility and PA structure while adding Optum\'s own UM texture: a utilization trigger at 80% of authorized hours, explicit diagnostic-tool requirements, and supervision expectations. Operationally, everything lives on Provider Express.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO (BH via Optum)' },
      { label: 'Clinical rules', value: 'Optum OH supplemental criteria (BH803OH012026.E) over the OAC baseline' },
      { label: 'Diagnosis', value: 'DSM-5-TR + ≥1 validated screener AND ≥1 formal tool (ADOS, ADI-R, DISCO)' },
      { label: 'Utilization trigger', value: '<80% of authorized hours over 2 weeks → barrier documentation' },
      { label: 'Supervision', value: '1–2 hrs case supervision per 10 direct-treatment hours weekly' },
      { label: 'Portal', value: 'Provider Express — Ohio Medicaid ABA Program page' },
    ],
    sections: [
      {
        h2: 'What Optum\'s Ohio criteria add',
        body: [
          'The supplemental criteria require a DSM-5-TR diagnosis from a state-licensed physician, psychologist, or qualified clinician using at least one validated screening tool plus one formal diagnostic instrument (ADOS, ADI-R, or DISCO). There\'s no numeric hour cap — requested hours must be justified by impairment, severity, and history — but continued-treatment reviews specifically scrutinize utilization below 80% of authorized hours over any two-week period, requiring documented barriers. Direct case supervision follows the CASP-based expectation of 1–2 hours per 10 hours of direct treatment weekly. Telehealth is available for ABA with member prerequisite-skill and caregiver-support conditions. Non-Medicaid-enrolled providers need a single case agreement.',
          'Credentialing is unusually explicit: COBA providers enroll with Ohio Medicaid as Provider Type 19, Specialty 190, with NPIs for both rendering and group, then join the Optum network via the Provider Express Ohio Medicaid ABA Program page.',
        ],
        cites: [
          { title: 'Optum — Ohio Medicaid Supplemental Clinical Criteria (BH803OH012026.E)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnosis + both tools', desc: 'A validated screener and a formal instrument (ADOS/ADI-R/DISCO) — confirm both exist before the request.' },
      { title: 'Realistic availability', desc: 'The 80%-utilization trigger makes honest scheduling a review-survival issue.' },
      { title: 'Optum + ODM enrollment', desc: 'Provider Type 19/Specialty 190 with rendering and group NPIs, plus Optum network status.' },
      { title: 'Caregiver capacity', desc: 'Telehealth eligibility and treatment design both hinge on documented caregiver support.' },
    ],
    sources: [
      { title: 'Optum — Ohio Medicaid Supplemental Clinical Criteria', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Ohio cover ABA?', a: 'Yes — through Optum under Ohio-specific supplemental clinical criteria that defer to the OAC on eligibility and PA while adding Optum\'s UM requirements (diagnostic tools, supervision ratios, the 80% utilization trigger).' },
      { q: 'What happens if a family uses fewer hours than authorized?', a: 'Utilization below 80% of authorized hours over a two-week period triggers scrutiny at continued-treatment review, with barrier documentation required — request hours the family can actually attend.' },
      { q: 'How do I credential for UHC Ohio ABA?', a: 'Enroll with Ohio Medicaid as Provider Type 19, Specialty 190 (rendering + group NPIs), then join the Optum network via Provider Express\'s Ohio Medicaid ABA Program page.' },
    ],
  },

  'amerihealth-caritas-ohio': {
    slug: 'amerihealth-caritas-ohio',
    family: 'amerihealth',
    cardDesc: 'State-rule-driven UM; NaviNet/Jiva workflow — thinnest public ABA paper trail of the OH plans.',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD per OAC 5160-34-02',
    payer: 'AmeriHealth Caritas Ohio',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · AmeriHealth Caritas (OH)',
    h1: 'AmeriHealth Caritas Ohio ABA coverage (Next Gen MCO).',
    metaTitle: 'AmeriHealth Caritas Ohio Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How AmeriHealth Caritas Ohio administers Medicaid ABA — state-rule-driven criteria, the NaviNet/Jiva authorization workflow, UM contacts, and what to verify directly in the portal.',
    intro: [
      'AmeriHealth Caritas Ohio — the newest of Ohio\'s Next Generation plans — publishes no distinct ABA clinical policy, so expect utilization management driven by the state rule (OAC 5160-34). Like its North Carolina sibling, the plan\'s site blocks automated access, which makes its portal the source of truth: this guide covers the verified structure and flags what to confirm directly.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO (newest entrant)' },
      { label: 'Clinical rules', value: 'State OAC 5160-34 framework — no distinct plan policy found' },
      { label: 'Prior auth', value: 'Required before ABA begins; 6-month auth periods' },
      { label: 'UM contact', value: '(833) 735-7700' },
      { label: 'Portal', value: 'Jiva via NaviNet' },
      { label: 'Decision time', value: 'Initial authorizations reported at 10–14 business days' },
    ],
    sections: [
      {
        h2: 'How AmeriHealth Caritas runs ABA authorization',
        body: [
          'The clinical baseline is the state rule: PA on ABA services, DSM-5-TR diagnosis via comprehensive evaluation, 6-month review cycles. Authorization requests flow through the Jiva UM system via NaviNet, with UM at (833) 735-7700 and initial authorization decisions commonly reported at 10–14 business days — a timeline to set family expectations against. Approved intensities in the 10–40 hours/week range track clinical necessity per the state framework. Because the plan\'s public documents can\'t be pulled programmatically, download the current behavioral-health PA guidance from the portal and re-check it quarterly; the OhioRISE rule applies as everywhere — ABA bills to AmeriHealth Caritas, never to OhioRISE.',
        ],
        cites: [
          { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
          { title: 'AmeriHealth Caritas OH — BH prior authorization (access via portal; site blocks automated retrieval)', url: 'https://www.amerihealthcaritasoh.com/provider/resources/behavioral-prior-auth' },
        ],
      },
    ],
    collect: [
      { title: 'NaviNet/Jiva access', desc: 'The working authorization channel — confirm registration before the first case.' },
      { title: 'ASD diagnosis (DSM-5-TR)', desc: 'Comprehensive evaluation per the state baseline.' },
      { title: 'Timeline expectations', desc: '10–14 business days for initial decisions — communicate it to families up front.' },
    ],
    sources: [
      { title: 'AmeriHealth Caritas OH — BH prior authorization page (verify via portal)', url: 'https://www.amerihealthcaritasoh.com/provider/resources/behavioral-prior-auth' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does AmeriHealth Caritas Ohio cover ABA therapy?', a: 'Yes — under the Ohio Medicaid framework, with prior authorization before services begin and 6-month authorization periods, managed through Jiva via NaviNet.' },
      { q: 'How long do AmeriHealth Caritas Ohio ABA authorizations take?', a: 'Initial decisions are commonly reported at 10–14 business days — plan family communication accordingly.' },
    ],
  },

  'humana-healthy-horizons-ohio': {
    slug: 'humana-healthy-horizons-ohio',
    family: 'humana',
    cardDesc: 'Cleanest all-codes PA statement in Ohio; state-policy criteria plus Availity logistics.',
    assessmentPA: 'Required — the PA list covers every ABA code (97151–97158, 0362T, 0373T), assessments included',
    treatmentPA: 'Required — same list; unauthorized services face retrospective review and financial penalties',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD per OAC 5160-34-02',
    payer: 'Humana Healthy Horizons in Ohio',
    state: 'OH', kind: 'medicaid-mco', parent: 'Ohio Medicaid',
    pill: 'Payer Guide · Humana Healthy Horizons (OH)',
    h1: 'Humana Healthy Horizons in Ohio ABA coverage (Next Gen MCO).',
    metaTitle: 'Humana Healthy Horizons Ohio Medicaid ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Humana Healthy Horizons administers Ohio Medicaid ABA — prior authorization on every ABA code per its PA list, in-house behavioral UM, Availity submission, and the retrospective-review penalty for skipping PA.',
    intro: [
      'Humana Healthy Horizons in Ohio administers ABA on the state clinical framework with the cleanest all-codes PA statement of the seven plans: its prior-authorization list (effective January 2026) names every ABA code — 97151 through 97158, 0362T, and 0373T — with no assessment exemption. There\'s no distinct Humana clinical policy layered on top; what the plan adds is in-house behavioral UM, Availity logistics, and a sharp consequence for skipping the process.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Ohio Next Generation MCO' },
      { label: 'Clinical rules', value: 'State OAC 5160-34 framework — no distinct plan ABA policy' },
      { label: 'Prior auth', value: 'Every ABA code on the PA list (eff. 1/1/2026), assessments included' },
      { label: 'Skip-PA consequence', value: 'Retrospective medical-necessity review + financial penalties' },
      { label: 'Submission', value: 'Availity Essentials; provider line (877) 856-5707' },
      { label: 'UM', value: 'In-house Humana behavioral health' },
    ],
    sections: [
      {
        h2: 'How Humana runs ABA authorization',
        body: [
          'The PA and notification list is unambiguous: "Applied behavioral analysis (ABA) therapy" covers 97151, 97152, 97153, 97154, 97155, 97156, 97157, 97158, 0362T, and 0373T — so unlike Buckeye (or the DMAS-style structures elsewhere), the assessment itself needs authorization before the first appointment, and intake should sequence accordingly. Services rendered without PA are subject to retrospective medical-necessity review and financial penalties, which converts a skipped authorization into a revenue write-off risk. Submissions run through Availity Essentials (registration at 800-AVAILITY), with the Ohio provider line at (877) 856-5707. Clinical criteria follow the state framework — DSM-5-TR diagnosis, 6-month reviews — and the OhioRISE rule holds: ABA bills to Humana, never to OhioRISE.',
        ],
        cites: [
          { title: 'Humana Healthy Horizons OH — PA and notification list (eff. 1/1/2026)', url: 'https://assets.humana.com/is/content/humana/OH%20MCD%20PAL%20Dpdf' },
        ],
      },
    ],
    collect: [
      { title: 'Assessment PA first', desc: 'Unlike some plans, the assessment needs authorization — build it into the intake sequence.' },
      { title: 'ASD diagnosis (DSM-5-TR)', desc: 'Comprehensive evaluation per the state baseline.' },
      { title: 'Authorization before service', desc: 'The retrospective-review penalty makes "start now, authorize later" a losing bet.' },
    ],
    sources: [
      { title: 'Humana Healthy Horizons OH — PA and notification list', url: 'https://assets.humana.com/is/content/humana/OH%20MCD%20PAL%20Dpdf' },
      { title: 'Ohio Administrative Code — rule 5160-34-02', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02' },
    ],
    faq: [
      { q: 'Does Humana Healthy Horizons in Ohio cover ABA?', a: 'Yes — on the state clinical framework, with prior authorization required on every ABA code including assessments, submitted via Availity Essentials.' },
      { q: 'What happens if we deliver ABA without a Humana authorization?', a: 'The service is subject to retrospective medical-necessity review and financial penalties — treat authorization-before-service as non-negotiable.' },
    ],
  },

  'aetna-ohio': {
    slug: 'aetna-ohio',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Ohio R.C. § 3923.84 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes \u2014 ASD only (F84.0\u2013F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Ohio',
    state: 'OH', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Ohio',
    h1: 'Aetna ABA coverage in Ohio: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Ohio: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Ohio families — the national clinical policy, prior authorization, the Ohio R.C. § 3923.84 mandate (ages, caps, exemptions), Ohio behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Ohio, a Aetna card means three layers at once: the carrier\'s national clinical policy, Ohio\'s autism insurance mandate (Ohio R.C. § 3923.84), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Ohio R.C. § 3923.84' },
      { label: 'Mandate age', value: 'Service floors apply under age 14' },
      { label: 'Mandate caps', value: 'Floors, not caps: ≥20 hrs/wk ABA-inclusive intervention' },
      { label: 'Exempt from mandate', value: 'Limited-benefit policy types; self-funded ERISA' },
      { label: 'Licensure', value: 'Certified Ohio Behavior Analyst (COBA, Board of Psychology)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Ohio',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Ohio is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Ohio.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Ohio mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ohio’s mandate (HB 463, 2017; R.C. 3923.84, with § 1751.84 for HMOs) sets service floors for insureds under age 14 rather than caps: at least 20 hours/week of “clinical therapeutic intervention” — explicitly defined to include applied behavior analysis — plus 20 visits/year each for speech and OT and 30 outpatient mental-health visits/year. Mandated ABA must be provided by or under the supervision of a Certified Ohio Behavior Analyst (or licensed psychologist/counselor/social worker/MFT), and since a March 2025 amendment, clinical nurse specialists and certified nurse practitioners can also prescribe or order ASD services. Dollar limits and cost-sharing can’t be less favorable than substantially all medical/surgical benefits; self-funded ERISA plans are exempt by preemption, and carriers in practice authorize on medical necessity rather than the statutory hour counts.',
        ],
        cites: [
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
        ],
      },
      {
        h2: 'No Ohio-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Ohio-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Ohio-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Ohio',
        body: [
          'Ohio’s COBA certificate (ORC Chapter 4783, Ohio Board of Psychology, with a direct BCBA pathway) is baked into the mandate itself — R.C. 3923.84 conditions mandated ABA on COBA-supervised delivery — so COBA status is a commercial coverage requirement in Ohio, not just a Medicaid credentialing detail. On rates: Aetna does not publish commercial ABA fee schedules for Ohio (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
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
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Ohio?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Ohio\'s mandate (Ohio R.C. § 3923.84) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Ohio autism mandate require?', a: 'Ohio’s mandate (HB 463, 2017; R.C. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Ohio?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Ohio Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-ohio': {
    slug: 'cigna-ohio',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Ohio R.C. § 3923.84 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes \u2014 ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Ohio',
    state: 'OH', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Ohio',
    h1: 'Cigna / Evernorth ABA coverage in Ohio: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Ohio: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Ohio families — the national clinical policy, prior authorization, the Ohio R.C. § 3923.84 mandate (ages, caps, exemptions), Ohio behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Ohio, a Cigna card means three layers at once: the carrier\'s national clinical policy, Ohio\'s autism insurance mandate (Ohio R.C. § 3923.84), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Ohio R.C. § 3923.84' },
      { label: 'Mandate age', value: 'Service floors apply under age 14' },
      { label: 'Mandate caps', value: 'Floors, not caps: ≥20 hrs/wk ABA-inclusive intervention' },
      { label: 'Exempt from mandate', value: 'Limited-benefit policy types; self-funded ERISA' },
      { label: 'Licensure', value: 'Certified Ohio Behavior Analyst (COBA, Board of Psychology)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Ohio',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Ohio is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Ohio.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Ohio mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ohio’s mandate (HB 463, 2017; R.C. 3923.84, with § 1751.84 for HMOs) sets service floors for insureds under age 14 rather than caps: at least 20 hours/week of “clinical therapeutic intervention” — explicitly defined to include applied behavior analysis — plus 20 visits/year each for speech and OT and 30 outpatient mental-health visits/year. Mandated ABA must be provided by or under the supervision of a Certified Ohio Behavior Analyst (or licensed psychologist/counselor/social worker/MFT), and since a March 2025 amendment, clinical nurse specialists and certified nurse practitioners can also prescribe or order ASD services. Dollar limits and cost-sharing can’t be less favorable than substantially all medical/surgical benefits; self-funded ERISA plans are exempt by preemption, and carriers in practice authorize on medical necessity rather than the statutory hour counts.',
        ],
        cites: [
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
        ],
      },
      {
        h2: 'No Ohio-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no Ohio-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where Ohio-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Ohio',
        body: [
          'Ohio’s COBA certificate (ORC Chapter 4783, Ohio Board of Psychology, with a direct BCBA pathway) is baked into the mandate itself — R.C. 3923.84 conditions mandated ABA on COBA-supervised delivery — so COBA status is a commercial coverage requirement in Ohio, not just a Medicaid credentialing detail. On rates: Cigna does not publish commercial ABA fee schedules for Ohio (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
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
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Ohio?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Ohio\'s mandate (Ohio R.C. § 3923.84) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Ohio autism mandate require?', a: 'Ohio’s mandate (HB 463, 2017; R.C. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Ohio?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Ohio Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-ohio': {
    slug: 'unitedhealthcare-ohio',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Ohio R.C. § 3923.84 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Ohio',
    state: 'OH', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Ohio',
    h1: 'UnitedHealthcare / Optum ABA coverage in Ohio: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Ohio: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Ohio families — the national clinical policy, prior authorization, the Ohio R.C. § 3923.84 mandate (ages, caps, exemptions), Ohio behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Ohio, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Ohio\'s autism insurance mandate (Ohio R.C. § 3923.84), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Ohio R.C. § 3923.84' },
      { label: 'Mandate age', value: 'Service floors apply under age 14' },
      { label: 'Mandate caps', value: 'Floors, not caps: ≥20 hrs/wk ABA-inclusive intervention' },
      { label: 'Exempt from mandate', value: 'Limited-benefit policy types; self-funded ERISA' },
      { label: 'Licensure', value: 'Certified Ohio Behavior Analyst (COBA, Board of Psychology)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Ohio',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Ohio is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Ohio.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Ohio mandate: what it guarantees (and doesn\'t)',
        body: [
          'Ohio’s mandate (HB 463, 2017; R.C. 3923.84, with § 1751.84 for HMOs) sets service floors for insureds under age 14 rather than caps: at least 20 hours/week of “clinical therapeutic intervention” — explicitly defined to include applied behavior analysis — plus 20 visits/year each for speech and OT and 30 outpatient mental-health visits/year. Mandated ABA must be provided by or under the supervision of a Certified Ohio Behavior Analyst (or licensed psychologist/counselor/social worker/MFT), and since a March 2025 amendment, clinical nurse specialists and certified nurse practitioners can also prescribe or order ASD services. Dollar limits and cost-sharing can’t be less favorable than substantially all medical/surgical benefits; self-funded ERISA plans are exempt by preemption, and carriers in practice authorize on medical necessity rather than the statutory hour counts.',
        ],
        cites: [
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
        ],
      },
      {
        h2: 'Optum\'s Ohio-specific criteria',
        body: [
          'Ohio has its own entries in Optum’s ABA State Mandates supplemental criteria: for Ohio fully-insured members (effective March 2025), ASD screening, diagnosis, and treatment may also be performed, prescribed, or ordered by clinical nurse specialists and certified nurse practitioners — mirroring the 2025 amendment to the state mandate and widening who can generate a qualifying order.',
        ],
        cites: [
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Ohio',
        body: [
          'A family saying “we have UnitedHealthcare” in Ohio may actually be on the carrier’s Medicaid plan — UnitedHealthcare Community Plan of Ohio — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Ohio',
        body: [
          'Ohio’s COBA certificate (ORC Chapter 4783, Ohio Board of Psychology, with a direct BCBA pathway) is baked into the mandate itself — R.C. 3923.84 conditions mandated ABA on COBA-supervised delivery — so COBA status is a commercial coverage requirement in Ohio, not just a Medicaid credentialing detail. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Ohio (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Ohio (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Ohio Rev. Code § 3923.84 (autism coverage mandate)', url: 'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/' },
      { title: 'Ohio Admin. Code 4783-4-01 — COBA requirements', url: 'https://www.law.cornell.edu/regulations/ohio/Ohio-Admin-Code-4783-4-01' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Ohio?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Ohio\'s mandate (Ohio R.C. § 3923.84) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Ohio autism mandate require?', a: 'Ohio’s mandate (HB 463, 2017; R.C. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Ohio?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Ohio Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
