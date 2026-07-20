import type { PayerConfig } from './types.js';

export const nebraskaPayers: Record<string, PayerConfig> = {
  'nebraska-medicaid': {
    slug: 'nebraska-medicaid',
    cardDesc: 'Under 21 via EPSDT; ASD dx NOT required; deep Aug 2025 rate cuts (97153 → $18.70).',
    assessmentPA: 'MCO-administered — the treatment MSD requires the assessment + treatment plan with the initial PA request; an IDI within 12 months must establish the need first',
    treatmentPA: 'Required — via the member\'s MCO; PA duration is variable per medical necessity (no fixed statewide period); treatment plan reviewed at least every 90 days',
    dxRequired: 'No — ASD or a developmental or intellectual disability qualifies, when the ABA assessment establishes treatment need',
    payer: 'Nebraska Medicaid (Heritage Health)',
    state: 'NE', kind: 'state-medicaid',
    pill: 'Payer Guide · Nebraska Medicaid',
    h1: 'Nebraska Medicaid (Heritage Health) ABA coverage: the intake guide.',
    metaTitle: 'Nebraska Medicaid (Heritage Health) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Nebraska Medicaid covers ABA under Heritage Health managed care — no strict autism-diagnosis requirement, the 12-month IDI recency rule, MCO prior authorization, the August 2025 rate cuts (97153 to $18.70), the 20-vs-30 hour cap conflict, and LBA licensure.',
    intro: [
      'Nebraska Medicaid covers ABA for members under 21 through EPSDT, under a pair of Medicaid Service Definitions (MSDs) effective February 7, 2025 — and delivers it entirely through Heritage Health managed care, so every authorization runs through one of three MCOs: Nebraska Total Care, Molina, or UnitedHealthcare Community Plan (with ABA managed by Optum). Two things make Nebraska unusual. First, an autism diagnosis is not strictly required — a developmental or intellectual disability qualifies when the ABA assessment establishes need. Second, in August 2025 DHHS cut ABA rates roughly 28–79% by code after program spend exploded from $4.6M to $85M+ in four years, making Nebraska one of the lowest-paying ABA states in the country. Both facts should shape how a practice runs intake here.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21 (ages 0–20), via EPSDT' },
      { label: 'Diagnosis', value: 'ASD NOT strictly required — developmental or intellectual disability qualifies' },
      { label: 'Diagnosis recency', value: 'Initial Diagnostic Interview (IDI) within the previous 12 months' },
      { label: 'Prior auth', value: 'MCO-administered — assessment + treatment plan filed with the initial PA request' },
      { label: 'Hour caps', value: '6 hrs/day; weekly cap conflicts — MSD text says 20, DHHS materials say up to 30' },
      { label: 'Rates (per 15 min)', value: '97151 $38.16 · 97153 $18.70 · 97155 $22.72 · 97156 $26.06 (eff. 8/1/2025)' },
      { label: 'Licensure', value: 'NE LBA license mandatory for Medicaid BCBAs since 1/1/2025' },
    ],
    sections: [
      {
        h2: 'Who qualifies: broader than autism',
        body: [
          'Admission requires a diagnosis of ASD or a developmental or intellectual disability — plus significant functional impairment in at least two listed domains — when the need for ABA is established by the ABA behavior identification assessment. That makes Nebraska one of the states where intake should not turn away a family without an autism diagnosis: ask about developmental and intellectual disability diagnoses too. The gate that does apply universally is the Initial Diagnostic Interview: an IDI by a licensed clinician, completed within the previous 12 months, must establish the need for the ABA assessment (with an IDI addendum if the clinical presentation has changed). One additional carve-out worth knowing: DD-waiver recipients may receive ABA assessments (97151/97152) regardless of age, and even for non-ABA purposes.',
        ],
        cites: [
          { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
          { title: 'ABA Behavior Identification Assessment MSD', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis%20Behavior%20Identification%20Assessment.pdf' },
        ],
      },
      {
        h2: 'The August 2025 rate cuts',
        body: [
          'Effective August 1, 2025, DHHS cut ABA reimbursement dramatically — roughly 28–79% by code per CASP\'s estimate — after program spend grew from $4.6M in 2020 to more than $85M in 2024, a >2,000% increase DHHS cites on its own ABA Facts page. The current schedule per 15-minute unit: 97151 assessment $38.16, 97153 direct treatment $18.70, 97155 protocol modification $22.72, 97156 family training $26.06 (also 97152 $25.88, 97154 $7.49, 97158 $12.05). Rates are credential-flat — no BCBA-versus-technician tier for the same code — and telehealth (modifier 95, POS 02/10) is allowed for 97151, 97155, and 97156 only. The cuts triggered a legislative interim study, a State Auditor attestation report, and the near-exit of the state\'s largest provider — but they remain fully in force: the SFY27 fee schedule effective July 1, 2026 carries the same numbers. DHHS also directs the Heritage Health MCOs to track this fee schedule (HPA 25-08), so there is no MCO rate refuge. For practices, Nebraska Medicaid volume is a margin question to model deliberately, not an afterthought.',
        ],
        cites: [
          { title: 'Provider Bulletin 25-14 — Applied Behavior Analysis Rates (July 1, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf' },
          { title: 'SFY27 Mental Health & Substance Use Fee Schedule (July 2026)', url: 'https://dhhs.ne.gov/Medicaid%20Practitioner%20Fee%20Schedules/MHSUD%20SFY27%20Fee%20Schedule.xlsx' },
          { title: 'DHHS "Applied Behavior Analysis Facts" page', url: 'https://dhhs.ne.gov/Pages/Applied-Behavior-Analysis.aspx' },
          { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
        ],
      },
      {
        h2: 'Authorization, and the 20-vs-30 hour question',
        body: [
          'Prior authorization runs through the member\'s MCO. The treatment MSD requires the ABA assessment and treatment plan to be submitted with the initial prior authorization request, and Provider Bulletin 25-02 clarifies that PA duration is "based on medical necessity and therefore is variable in duration" — no fixed statewide authorization period. Separately from whatever the MCO authorizes, the treatment plan itself must be reviewed and updated at least every 90 days.',
          'On weekly intensity, the state\'s own documents conflict. The current ABA treatment MSD text caps direct service at 6 hours per day and 20 hours per week absent PA\'d clinical justification — while DHHS\'s public ABA Facts page and PB 25-02 describe the policy as allowing up to 30 hours per week. We present both because the state does: plan requests against the 20-hour MSD text as the conservative floor, cite the DHHS 30-hour materials when clinical need justifies more, and expect hours beyond 6/day or the weekly cap to require clinical justification through PA either way.',
        ],
        cites: [
          { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
          { title: 'Provider Bulletin 25-02 — ABA Service Definitions (eff. Feb 7, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-02.pdf' },
          { title: 'DHHS "Applied Behavior Analysis Facts" page', url: 'https://dhhs.ne.gov/Pages/Applied-Behavior-Analysis.aspx' },
        ],
      },
      {
        h2: 'Compliance rules that decide reauthorization',
        body: [
          'Since January 1, 2025, every BCBA serving Nebraska Medicaid must hold a Nebraska Licensed Behavior Analyst (LBA) license (BCaBAs a LaBA license); an LBA may supervise at most 24 technicians, must directly observe at least 10% of weekly direct-service hours, and must personally deliver at least 1 hour per month of in-person direct service. Caregiver participation is a tracked compliance item: 1 hour per month when services run 10 or fewer hours/month, otherwise a 2–4 hour monthly minimum, with teachers countable for at most 25% of caregiver-training hours — services won\'t be denied solely for non-participation, but it factors into continued-stay review. Continued-stay progress must be demonstrated with Vineland-3, VB-MAPP, or ABLLS (the preferred tools), and discharge triggers include no progress over two consecutive authorization periods or more than 6 months without demonstrated progress. Also excluded from coverage: two concurrent LBAs (unless justified), shadow/aide services in schools, ABA concurrent with ST/OT/PT sessions, naps and recreation time, and services delivered by a legally responsible person. School-based ABA bills through the Medicaid school-based services program (471 NAC 25), not independent providers.',
        ],
        cites: [
          { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
          { title: 'Provider Bulletin 25-02 — ABA Service Definitions (eff. Feb 7, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-02.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Heritage Health MCO', desc: 'Nebraska Total Care, Molina, or UnitedHealthcare Community Plan — same state MSD rules, very different submission machinery.' },
      { title: 'Qualifying diagnosis', desc: 'ASD or a developmental/intellectual disability — don\'t screen out non-autism families; the ABA assessment establishes need.' },
      { title: 'IDI date and clinician', desc: 'The Initial Diagnostic Interview must be within the previous 12 months — if it\'s older, an updated IDI (or addendum) comes before the assessment.' },
      { title: 'Caregiver availability', desc: 'Monthly participation minimums (1–4 hrs depending on service volume) factor into continued-stay review — set expectations at intake.' },
      { title: 'Other therapy schedule', desc: 'ABA concurrent with ST/OT/PT is not covered — map the family\'s full schedule to avoid billing conflicts.' },
    ],
    sources: [
      { title: 'Provider Bulletin 25-02 — ABA Service Definitions (Jan 31, 2025; eff. Feb 7, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-02.pdf' },
      { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
      { title: 'ABA Behavior Identification Assessment MSD', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis%20Behavior%20Identification%20Assessment.pdf' },
      { title: 'Provider Bulletin 25-14 — ABA Rates (July 1, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf' },
      { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
      { title: 'DHHS "Applied Behavior Analysis Facts" page', url: 'https://dhhs.ne.gov/Pages/Applied-Behavior-Analysis.aspx' },
      { title: 'SFY27 Mental Health & Substance Use Fee Schedule (July 2026)', url: 'https://dhhs.ne.gov/Medicaid%20Practitioner%20Fee%20Schedules/MHSUD%20SFY27%20Fee%20Schedule.xlsx' },
    ],
    faq: [
      { q: 'Does Nebraska Medicaid cover ABA therapy?', a: 'Yes — for members under 21 through EPSDT, administered entirely by the three Heritage Health MCOs under the state\'s ABA Medicaid Service Definitions (effective February 2025). Prior authorization runs through the member\'s MCO.' },
      { q: 'Is an autism diagnosis required for ABA under Nebraska Medicaid?', a: 'No — admission criteria accept ASD or a developmental or intellectual disability, when the ABA assessment establishes treatment need and there\'s significant functional impairment in at least two domains. An Initial Diagnostic Interview within the previous 12 months must establish the need.' },
      { q: 'What does Nebraska Medicaid pay for ABA?', a: 'Per 15-minute unit, effective August 1, 2025: 97151 $38.16, 97153 $18.70, 97155 $22.72, 97156 $26.06 — a roughly 28–79% cut by code from prior rates, still in force in the SFY27 fee schedule. Rates are credential-flat, and MCOs are directed to track the state schedule.' },
      { q: 'How many hours per week does Nebraska Medicaid allow?', a: 'The state\'s documents conflict: the ABA treatment MSD text caps direct service at 6 hours/day and 20 hours/week absent PA\'d clinical justification, while DHHS\'s own summaries (including PB 25-02) describe the policy as up to 30 hours/week. Requests above the caps need clinical justification through prior authorization either way.' },
    ],
  },

  'nebraska-total-care': {
    slug: 'nebraska-total-care',
    family: 'centene',
    cardDesc: 'Closest to the state baseline; OTR-based PA, documentation-heavy NE.CP.BH.105 policy.',
    treatmentPA: 'Required — Outpatient Treatment Request (OTR) via the provider portal or fax 866-593-1955, with hours per code, titration/discharge plan, crisis plan, and coordination-of-care attempts',
    dxRequired: 'ASD per DSM-5-TR "or an appropriate diagnosis as otherwise specified according to state-defined ABA criteria" — mirrors the state\'s non-ASD pathway',
    payer: 'Nebraska Total Care (Centene)',
    state: 'NE', kind: 'medicaid-mco', parent: 'Nebraska Medicaid (Heritage Health)',
    pill: 'Payer Guide · Nebraska Total Care',
    h1: 'Nebraska Total Care ABA coverage (Heritage Health MCO).',
    metaTitle: 'Nebraska Total Care (Heritage Health MCO) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Nebraska Total Care (Centene) administers Nebraska Medicaid ABA — the NE.CP.BH.105 documentation policy, OTR-based prior authorization, IDI and FBA requirements in the assessment package, and why denial risk here is documentation-driven.',
    intro: [
      'Nebraska Total Care, Centene\'s Heritage Health plan, is the closest of the three MCOs to the state baseline: its Nebraska-specific policy NE.CP.BH.105 ("Applied Behavioral Analysis Documentation Requirements," rev. 06/2024) operationalizes the DHHS Medicaid Service Definitions rather than imposing distinct medical-necessity criteria — and its own footer says state Medicaid provisions take precedence in any conflict. What the plan adds is paperwork rigor: an OTR-based authorization workflow and a documentation checklist detailed enough that denial risk here is documentation-driven more than criteria-driven.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Heritage Health MCO (Centene)' },
      { label: 'Clinical rules', value: 'State MSDs, operationalized by NE.CP.BH.105 (documentation policy)' },
      { label: 'Prior auth', value: 'OTR process — ABA Form via portal or fax 866-593-1955' },
      { label: 'Assessment package', value: 'Must include the IDI and an FBA with direct assessment + data analysis' },
      { label: 'Group sessions', value: 'Group adaptive treatment: minimum 2, maximum 8 participants' },
      { label: 'Rates', value: 'Tracks the state fee schedule per DHHS direction (HPA 25-08)' },
    ],
    sections: [
      {
        h2: 'How Nebraska Total Care runs ABA authorization',
        body: [
          'ABA requests go through the Outpatient Treatment Request (OTR) process — the plan publishes an ABA Form and an ABA OTR Tip Sheet — submitted through the secure provider portal (provider.nebraskatotalcare.com) or by fax to 866-593-1955. The treatment plan must include hours requested per service with clinical justification, billing codes, a titration/discharge plan, a crisis plan, and documented coordination-of-care attempts down to dates, success, and contact names. On the front end, NE.CP.BH.105 requires the behavior identification assessment package to include the IDI and a functional behavior assessment with direct assessment and data analysis. One honest gap: we did not locate a published NTC statement that the assessment CPT codes themselves require PA — verify the assessment-PA question in the portal or with the plan before booking, rather than assuming either way.',
        ],
        cites: [
          { title: 'NE.CP.BH.105 — Applied Behavioral Analysis Documentation Requirements', url: 'https://www.nebraskatotalcare.com/content/dam/centene/Nebraska/policies/clinical-policies/NE.CP.BH.105_Applied_Behavioral_Analysis_Documentation_Requirements_07022024_508.pdf' },
          { title: 'Nebraska Total Care — behavioral health forms (ABA Form, OTR tip sheets)', url: 'https://www.nebraskatotalcare.com/providers/resources/behavioral-health-forms.html' },
        ],
      },
      {
        h2: 'Documentation is the denial risk',
        body: [
          'The policy\'s documentation checklist is unusually granular: time in/out, pauses in service with resume times, even preferred-versus-legal name conventions. Paired with the plan\'s published tip-sheet suite (assessment/plans, caregiver training, coordination of care, transition planning), the signal is active chart auditing — build session-note templates to the checklist rather than remediating at audit. Clinically, the policy mirrors the state: it accepts a confirmed DSM-5-TR ASD diagnosis "or an appropriate diagnosis as otherwise specified according to state-defined ABA criteria," which preserves Nebraska\'s developmental/intellectual-disability pathway, and group adaptive treatment sessions must run with 2–8 participants. Rates track the state fee schedule per DHHS direction.',
        ],
        cites: [
          { title: 'NE.CP.BH.105 — Applied Behavioral Analysis Documentation Requirements', url: 'https://www.nebraskatotalcare.com/content/dam/centene/Nebraska/policies/clinical-policies/NE.CP.BH.105_Applied_Behavioral_Analysis_Documentation_Requirements_07022024_508.pdf' },
          { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'IDI + FBA for the assessment package', desc: 'NE.CP.BH.105 requires both in the behavior identification assessment — line them up before submission.' },
      { title: 'Qualifying diagnosis', desc: 'ASD or the state\'s non-ASD pathway (developmental/intellectual disability) — the policy honors both.' },
      { title: 'Coordination-of-care log', desc: 'The OTR wants attempts with dates, outcome, and contact names — start the log at intake.' },
      { title: 'Crisis + titration/discharge plans', desc: 'Both are required treatment-plan elements — missing sections bounce requests.' },
    ],
    sources: [
      { title: 'NE.CP.BH.105 — Applied Behavioral Analysis Documentation Requirements', url: 'https://www.nebraskatotalcare.com/content/dam/centene/Nebraska/policies/clinical-policies/NE.CP.BH.105_Applied_Behavioral_Analysis_Documentation_Requirements_07022024_508.pdf' },
      { title: 'Nebraska Total Care — behavioral health forms', url: 'https://www.nebraskatotalcare.com/providers/resources/behavioral-health-forms.html' },
      { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
    ],
    faq: [
      { q: 'Does Nebraska Total Care cover ABA therapy?', a: 'Yes — it administers the Nebraska Medicaid ABA benefit under the state Medicaid Service Definitions, with its NE.CP.BH.105 documentation policy layered on top. Its own policy says state provisions take precedence in any conflict.' },
      { q: 'How do I submit an ABA authorization to Nebraska Total Care?', a: 'Through the Outpatient Treatment Request (OTR) process — the ABA Form via the secure provider portal (provider.nebraskatotalcare.com) or fax 866-593-1955, with hours per code, clinical justification, titration/discharge and crisis plans, and coordination-of-care documentation.' },
      { q: 'Does the ABA assessment itself need PA at Nebraska Total Care?', a: 'The plan publishes no clear statewide statement that the assessment CPT codes require PA — the published policy focuses on what the assessment package must contain (IDI + FBA). Verify assessment-PA handling in the portal or with the plan before booking.' },
    ],
  },

  'molina-healthcare-nebraska': {
    slug: 'molina-healthcare-nebraska',
    family: 'molina',
    cardDesc: 'Newest MCO (2024); state-baseline rules, Availity intake, quarterly PA-list churn.',
    payer: 'Molina Healthcare of Nebraska',
    state: 'NE', kind: 'medicaid-mco', parent: 'Nebraska Medicaid (Heritage Health)',
    pill: 'Payer Guide · Molina Healthcare (NE)',
    h1: 'Molina Healthcare of Nebraska ABA coverage (Heritage Health MCO).',
    metaTitle: 'Molina Healthcare of Nebraska (Heritage Health) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Molina Healthcare of Nebraska administers Nebraska Medicaid ABA — the 2024 Heritage Health entrant, Availity Essentials submission, quarterly PA code-list changes, and what remains unpublished about its ABA-specific rules.',
    intro: [
      'Molina Healthcare of Nebraska is the newest Heritage Health MCO — it entered January 1, 2024, replacing Healthy Blue — and has the least Nebraska-specific published ABA infrastructure of the three plans. No Nebraska-specific ABA clinical policy has been published: Molina applies the state Medicaid Service Definitions plus its corporate behavioral-health criteria, so treat it as state-baseline clinically and expect the differentiation to be operational — Availity intake, corporate forms, and quarterly PA code-list churn.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Heritage Health MCO — entered 1/1/2024, replacing Healthy Blue' },
      { label: 'Clinical rules', value: 'State MSDs + Molina corporate BH criteria (no published NE ABA policy)' },
      { label: 'Submission', value: 'Availity Essentials (preferred), fax (833) 832-1015, phone (844) 782-2678' },
      { label: 'PA code lists', value: 'Change quarterly — re-verify ABA codes each quarter' },
      { label: 'ABA UM', value: 'In-house — Molina hires NE-based LBA care review clinicians' },
      { label: 'Rates', value: 'Tracks the state fee schedule per DHHS direction (HPA 25-08)' },
    ],
    sections: [
      {
        h2: 'What\'s published — and what isn\'t',
        body: [
          'Molina\'s Nebraska Medicaid PA page establishes the machinery: requests submit through Availity Essentials (preferred), by fax to (833) 832-1015, or by phone at (844) 782-2678, with a Behavioral Health Certification of Need for Services form published for BH services and quarterly PA code-change PDFs posted for the current year. What it does not establish is an ABA-specific rulebook: we found no published Nebraska statement on whether the ABA assessment codes need PA, and third-party descriptions of Molina\'s ABA treatment-PA specifics could not be verified against a Molina document. Practically: assume the state MSD rules govern clinically, confirm ABA code-level PA requirements through Availity or the plan\'s PA look-up tool before every new intake cohort, and re-check quarterly — the PA lists genuinely change.',
        ],
        cites: [
          { title: 'Molina NE Medicaid — prior authorization page (Availity, fax, phone, quarterly PA code changes)', url: 'https://www.molinahealthcare.com/providers/ne/medicaid/Claims/priorauth.aspx' },
        ],
      },
      {
        h2: 'Working with the newest plan',
        body: [
          'Molina took over from Healthy Blue on January 1, 2024 under a five-year contract (with a two-year option), alongside Nebraska Total Care and UnitedHealthcare. Its ABA utilization management is done in-house — the plan hires Nebraska-based "Care Review Clinician, ABA" roles requiring an LBA license — so expect clinical conversations with licensed analysts rather than a delegated vendor. Rates follow the state schedule per DHHS\'s Health Plan Advisory 25-08, the same as the other two MCOs. Given the thin published ABA surface, the operating posture at this plan is verify-first: every code, every quarter, in the portal.',
        ],
        cites: [
          { title: 'Healthcare Dive — Nebraska awards Medicaid managed care contracts (Molina, NTC, UHC; start 1/1/2024)', url: 'https://www.healthcaredive.com/news/Nebraska-Medicaid-managed-care/632712/' },
          { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Availity access confirmed', desc: 'Availity Essentials is the preferred PA channel — make sure registration covers Molina NE before the first request.' },
      { title: 'Current-quarter PA code list', desc: 'ABA code PA status can change quarterly — pull the latest PA code-change PDF or use the look-up tool.' },
      { title: 'Qualifying diagnosis + IDI', desc: 'State MSD rules govern: ASD or developmental/intellectual disability, with an IDI in the previous 12 months.' },
      { title: 'Certification of Need form', desc: 'Molina publishes a BH Certification of Need for Services form — have it in the submission packet.' },
    ],
    sources: [
      { title: 'Molina NE Medicaid — prior authorization page', url: 'https://www.molinahealthcare.com/providers/ne/medicaid/Claims/priorauth.aspx' },
      { title: 'Healthcare Dive — Nebraska Medicaid managed care awards (1/1/2024)', url: 'https://www.healthcaredive.com/news/Nebraska-Medicaid-managed-care/632712/' },
      { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
    ],
    faq: [
      { q: 'Does Molina Healthcare of Nebraska cover ABA therapy?', a: 'Yes — as a Heritage Health MCO it administers the Nebraska Medicaid ABA benefit under the state Medicaid Service Definitions. Molina publishes no Nebraska-specific ABA clinical policy, so the state rules plus corporate BH criteria govern.' },
      { q: 'Does Molina Nebraska require PA on ABA assessments?', a: 'No published Nebraska-specific answer exists — Molina\'s PA requirements live in quarterly code lists and its PA look-up tool. Verify the ABA codes in Availity or with the plan directly, and re-check each quarter.' },
      { q: 'How do I submit an ABA prior authorization to Molina Nebraska?', a: 'Availity Essentials is the preferred channel; fax (833) 832-1015 and phone (844) 782-2678 are the fallbacks. Include the state-required package — treatment plan, ABA assessment, and IDI.' },
    ],
  },

  'unitedhealthcare-community-plan-nebraska': {
    slug: 'unitedhealthcare-community-plan-nebraska',
    family: 'unitedhealthcare',
    cardDesc: 'ABA carved to Optum since 2017; all autism services need PA, two-step assessment→treatment auth.',
    assessmentPA: 'Required — "All Autism Services require Prior Authorization"; written assessment request (treatment form marked as assessment) with the diagnostic evaluation / IDI / FBA attached',
    treatmentPA: 'Required — for all services and additional units; medical necessity applies at initial and concurrent review',
    dxRequired: 'State MSD rules govern — ASD or a developmental/intellectual disability qualifies; attach the diagnosing provider\'s evaluation to the request',
    payer: 'UnitedHealthcare Community Plan of Nebraska',
    state: 'NE', kind: 'medicaid-mco', parent: 'Nebraska Medicaid (Heritage Health)',
    pill: 'Payer Guide · UHC Community Plan (NE)',
    h1: 'UnitedHealthcare Community Plan of Nebraska ABA coverage (Heritage Health MCO).',
    metaTitle: 'UHC Community Plan Nebraska (Heritage Health) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan of Nebraska administers Medicaid ABA — the Optum-managed autism network since 2017, the two-step assessment/treatment authorization, portal and fax channels, and why concurrent review here has teeth.',
    intro: [
      'UnitedHealthcare Community Plan of Nebraska (UnitedHealthcare of the Midlands) administers the Heritage Health ABA benefit with the autism network carved to Optum Behavioral Health — an arrangement in place since January 1, 2017, with its own NE-specific program guide, training deck, forms, and fax lines. The state MSD coverage rules and state-directed rates apply, but Optum layers its own clinical criteria, a two-step assessment-then-treatment authorization workflow, and active utilization review on top — materially more process than the state baseline, and worth designing intake around.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Heritage Health MCO — ABA network managed by Optum since 1/1/2017' },
      { label: 'Prior auth', value: '"All Autism Services require Prior Authorization" — assessment included' },
      { label: 'Auth structure', value: 'Two-step: assessment auth first, then treatment auth — no treatment on the assessment auth alone' },
      { label: 'Submission', value: 'Optum ABA treatment-request portal; fax 1-888-541-6691' },
      { label: 'Benefits check', value: 'BH number on the member ID card or NMES line 1-800-642-6092' },
      { label: 'Claims', value: 'Payer ID 87726; 180-day timely filing' },
    ],
    sections: [
      {
        h2: 'The two-step Optum funnel',
        body: [
          'Optum\'s Nebraska program requires prior authorization for everything: the initial ABA assessment (including write-up time) needs a written request — the treatment request form marked as an assessment request — with the diagnostic evaluation, IDI, or FBA attached. Treatment is a second, separate authorization: families cannot start treatment on the assessment auth alone. Treatment requests must include the evaluation from the diagnosing provider plus a treatment plan with baseline and mastery criteria, a transition plan, discharge criteria, parent goals, supervision hours, and coordination of care — and medical necessity applies at both initial and concurrent review, with additional units requiring their own PA. Submissions go through Optum\'s online ABA treatment-request portal or fax 1-888-541-6691 (an older quick-reference guide lists 1-855-268-9392); claims run on payer ID 87726 with 180-day timely filing.',
        ],
        cites: [
          { title: 'NE Heritage Health Medicaid ABA Program Quick Reference Guide (Optum BH4233)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf' },
          { title: 'NE Heritage Health Medicaid Autism/ABA Program provider training (NE_4556)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/NE_4556_ABA-HeritageTrain.pdf' },
        ],
      },
      {
        h2: 'What intake should know about this plan',
        body: [
          'Optum runs the ABA network separately from the medical plan — verify benefits via the behavioral-health number on the member ID card or the NMES line at 1-800-642-6092, not the medical line. Per Optum\'s program documents, eligibility is described as members younger than 20 covered under Heritage Health. Treatment requests probe school hours and parent participation, and expect concurrent review to have teeth: ProPublica\'s 2024–2025 reporting on Optum strategy documents around ABA cost containment in Medicaid plans named Nebraska among focus states. Rates are not an Optum variable — DHHS\'s HPA 25-08 requires MCO ABA rates to reflect the revised state fee schedule effective August 1, 2025 — so the plan-specific work is process: clean two-step requests, complete treatment-plan elements, and progress data ready at every concurrent review.',
        ],
        cites: [
          { title: 'NE Heritage Health Medicaid ABA Program Quick Reference Guide (Optum BH4233)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf' },
          { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
          { title: 'ProPublica — UnitedHealth limiting ABA access in Medicaid', url: 'https://www.propublica.org/article/unitedhealthcare-insurance-autism-denials-applied-behavior-analysis-medicaid' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnostic evaluation / IDI / FBA', desc: 'Must attach to the written assessment request — the two-step funnel starts with this packet.' },
      { title: 'BH number from the member card', desc: 'The ABA network is Optum, separate from medical — verify via the BH line or NMES 1-800-642-6092.' },
      { title: 'Parent goals + participation plan', desc: 'Treatment requests require parent goals and probe participation — capture commitment at intake.' },
      { title: 'School-hours picture', desc: 'Optum\'s treatment request asks about school hours — document the schedule before submission.' },
      { title: 'Progress data cadence', desc: 'Concurrent review is active here — baseline/mastery data ready at every review, not just reauthorization.' },
    ],
    sources: [
      { title: 'NE Heritage Health Medicaid ABA Program Quick Reference Guide (Optum BH4233)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf' },
      { title: 'NE Heritage Health Medicaid Autism/ABA Program provider training (NE_4556)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/NE_4556_ABA-HeritageTrain.pdf' },
      { title: 'ABA Medicaid Service Definition (treatment MSD)', url: 'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf' },
      { title: 'Health Plan Advisory 25-08 — ABA Rates (to Heritage Health MCOs)', url: 'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Nebraska cover ABA?', a: 'Yes — it administers the Heritage Health ABA benefit under the state Medicaid Service Definitions, with the autism network managed by Optum Behavioral Health since 2017. All autism services, the assessment included, require prior authorization.' },
      { q: 'Does the ABA assessment need PA at UHC Community Plan of Nebraska?', a: 'Yes — the initial assessment needs a written request (the treatment request form marked as an assessment request) with the diagnostic evaluation, IDI, or FBA attached. Treatment is a second, separate authorization.' },
      { q: 'How do I submit an ABA authorization to UHC/Optum in Nebraska?', a: 'Through Optum\'s online ABA treatment-request portal or fax 1-888-541-6691, with the full treatment-plan package (baseline/mastery criteria, transition and discharge plans, parent goals, supervision hours, coordination of care). Claims use payer ID 87726 with 180-day timely filing.' },
    ],
  },

  'aetna-nebraska': {
    slug: 'aetna-nebraska',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Neb. Rev. Stat. § 44-7,106 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes — ASD only (F84.0–F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in Nebraska',
    state: 'NE', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Nebraska',
    h1: 'Aetna ABA coverage in Nebraska: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Nebraska: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Nebraska families — the national clinical policy, prior authorization, the Neb. Rev. Stat. § 44-7,106 mandate (under 21, the 25-hour weekly cap, exemptions), Nebraska behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Nebraska, an Aetna card means three layers at once: the carrier\'s national clinical policy, Nebraska\'s autism insurance mandate (Neb. Rev. Stat. § 44-7,106), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Neb. Rev. Stat. § 44-7,106 (LB 254, eff. 1/1/2015)' },
      { label: 'Mandate age', value: 'Under 21 (screening, diagnosis, and treatment of ASD)' },
      { label: 'Mandate caps', value: '25 hrs/week maximum benefit for behavioral health treatment incl. ABA' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small-group ACA plans; self-funded ERISA (preempted)' },
      { label: 'Licensure', value: 'NE Licensed Behavior Analyst (DHHS Licensure Unit, 172 NAC 86)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Nebraska',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Nebraska is the legal floor underneath it: the state mandate below governs what state-regulated plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Nebraska.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Nebraska mandate: what it guarantees (and doesn\'t)',
        body: [
          'Nebraska\'s mandate (LB 254 of 2014, effective for policies delivered or renewed on or after January 1, 2015) requires coverage of screening, diagnosis, and treatment of ASD for individuals under 21 — with behavioral health treatment including ABA capped at a maximum benefit of 25 hours per week until age 21. No visit limits or less-favorable dollar limits or cost-sharing are otherwise permitted, non-BHT payments (OT/ST/PT, pharmacy, psychiatric care) cannot be applied against the cap, and the insurer may review treatment at most once every 6 months, at its own cost. ABA must be provided or supervised by a nationally certified behavior analyst or licensed psychologist, in person or by telehealth. The reach is narrower than it reads: the statute exempts non-grandfathered individual and small-group ACA plans required to include essential health benefits, so the mandate\'s practical territory is large-group and grandfathered plans — and while the statute\'s text reaches self-funded plans "to the extent not preempted," ERISA preemption still takes self-funded employer plans off the table. The 25-hour cap is also a quantitative limit whose enforceability against group plans is in tension with federal parity (MHPAEA) — treat that as an argument to raise, not a settled fact.',
        ],
        cites: [
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
        ],
      },
      {
        h2: 'No Nebraska-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no Nebraska-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That\'s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, the 25-hour cap\'s presence in the plan document) is where Nebraska-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in Nebraska',
        body: [
          'Nebraska licenses behavior analysts under the Behavior Analyst Practice Act (Neb. Rev. Stat. § 38-4401 et seq., regulations at 172 NAC 86): the Licensed Behavior Analyst (LBA) credential for BCBAs and LaBA for BCaBAs, administered by the DHHS Licensure Unit with a Board of Behavior Analysts — and since January 1, 2025 the state\'s Medicaid program requires the license of every practicing BCBA, which has made LBA licensure the de facto floor for the market. On rates: Aetna does not publish commercial ABA fee schedules for Nebraska (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. When benchmarking, note that Nebraska\'s Medicaid fee schedule sits unusually low after the August 2025 cuts (97153 at $18.70 per 15 minutes), so commercial contracts here carry more of the margin than in most states.',
        ],
        cites: [
      { title: 'NE DHHS — Behavior Analyst licensure (Behavior Analyst Practice Act, 172 NAC 86)', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
      { title: 'Provider Bulletin 25-14 — ABA Rates (July 1, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Large-group/grandfathered state-regulated (mandate applies) vs. small-group/individual ACA or self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — Aetna\'s commercial policy is ASD-only.' },
      { title: 'Requested weekly hours vs. the 25-hour cap', desc: 'Where the mandate governs, BHT including ABA caps at 25 hrs/week — plan intensity and any parity argument accordingly.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
      { title: 'NE DHHS — Behavior Analyst licensure page', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Nebraska?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Nebraska\'s mandate (Neb. Rev. Stat. § 44-7,106) for state-regulated plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Nebraska autism mandate require?', a: 'Coverage of ASD screening, diagnosis, and treatment for individuals under 21, with behavioral health treatment including ABA capped at 25 hours per week — and insurer treatment reviews limited to once every 6 months. Non-grandfathered individual and small-group ACA plans are exempt, as are self-funded ERISA plans by preemption.' },
      { q: 'What does Aetna pay for ABA in Nebraska?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Nebraska\'s Medicaid schedule is an unusually low benchmark after the August 2025 cuts, so treat commercial rate-setting as a first-order contracting conversation.' },
    ],
  },

  'cigna-nebraska': {
    slug: 'cigna-nebraska',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Neb. Rev. Stat. § 44-7,106 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes — ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in Nebraska',
    state: 'NE', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Nebraska',
    h1: 'Cigna / Evernorth ABA coverage in Nebraska: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Nebraska: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Nebraska families — the national clinical policy, prior authorization, the Neb. Rev. Stat. § 44-7,106 mandate (under 21, the 25-hour weekly cap, exemptions), Nebraska behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Nebraska, a Cigna card means three layers at once: the carrier\'s national clinical policy, Nebraska\'s autism insurance mandate (Neb. Rev. Stat. § 44-7,106), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Neb. Rev. Stat. § 44-7,106 (LB 254, eff. 1/1/2015)' },
      { label: 'Mandate age', value: 'Under 21 (screening, diagnosis, and treatment of ASD)' },
      { label: 'Mandate caps', value: '25 hrs/week maximum benefit for behavioral health treatment incl. ABA' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small-group ACA plans; self-funded ERISA (preempted)' },
      { label: 'Licensure', value: 'NE Licensed Behavior Analyst (DHHS Licensure Unit, 172 NAC 86)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Nebraska',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Nebraska is the legal floor underneath it: the state mandate below governs what state-regulated plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Nebraska.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Nebraska mandate: what it guarantees (and doesn\'t)',
        body: [
          'Nebraska\'s mandate (LB 254 of 2014, effective for policies delivered or renewed on or after January 1, 2015) requires coverage of screening, diagnosis, and treatment of ASD for individuals under 21 — with behavioral health treatment including ABA capped at a maximum benefit of 25 hours per week until age 21. No visit limits or less-favorable dollar limits or cost-sharing are otherwise permitted, non-BHT payments (OT/ST/PT, pharmacy, psychiatric care) cannot be applied against the cap, and the insurer may review treatment at most once every 6 months, at its own cost. ABA must be provided or supervised by a nationally certified behavior analyst or licensed psychologist, in person or by telehealth. The reach is narrower than it reads: the statute exempts non-grandfathered individual and small-group ACA plans required to include essential health benefits, so the mandate\'s practical territory is large-group and grandfathered plans — and while the statute\'s text reaches self-funded plans "to the extent not preempted," ERISA preemption still takes self-funded employer plans off the table. The 25-hour cap is also a quantitative limit whose enforceability against group plans is in tension with federal parity (MHPAEA) — treat that as an argument to raise, not a settled fact.',
        ],
        cites: [
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
        ],
      },
      {
        h2: 'No Nebraska-specific Cigna policy exists',
        body: [
          'We checked: the current EN0499 contains no Nebraska carve-out or mention — its state-mandate language cites New York only as an example — so Nebraska commercial members are handled under the standard national policy, subject to the § 44-7,106 mandate on state-regulated plans. That\'s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, the 25-hour cap\'s presence in the plan document) is where Nebraska-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Nebraska',
        body: [
          'Nebraska licenses behavior analysts under the Behavior Analyst Practice Act (Neb. Rev. Stat. § 38-4401 et seq., regulations at 172 NAC 86): the Licensed Behavior Analyst (LBA) credential for BCBAs and LaBA for BCaBAs, administered by the DHHS Licensure Unit with a Board of Behavior Analysts — and since January 1, 2025 the state\'s Medicaid program requires the license of every practicing BCBA, which has made LBA licensure the de facto floor for the market. On rates: Cigna does not publish commercial ABA fee schedules for Nebraska (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. When benchmarking, note that Nebraska\'s Medicaid fee schedule sits unusually low after the August 2025 cuts (97153 at $18.70 per 15 minutes), so commercial contracts here carry more of the margin than in most states.',
        ],
        cites: [
      { title: 'NE DHHS — Behavior Analyst licensure (Behavior Analyst Practice Act, 172 NAC 86)', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
      { title: 'Provider Bulletin 25-14 — ABA Rates (July 1, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Large-group/grandfathered state-regulated (mandate applies) vs. small-group/individual ACA or self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date — then book the assessment; EN0499 needs no assessment PA.' },
      { title: 'Requested weekly hours vs. the 25-hour cap', desc: 'Where the mandate governs, BHT including ABA caps at 25 hrs/week — plan intensity and any parity argument accordingly.' },
    ],
    sources: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
      { title: 'NE DHHS — Behavior Analyst licensure page', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Nebraska?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Nebraska\'s mandate (Neb. Rev. Stat. § 44-7,106) for state-regulated plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Nebraska autism mandate require?', a: 'Coverage of ASD screening, diagnosis, and treatment for individuals under 21, with behavioral health treatment including ABA capped at 25 hours per week — and insurer treatment reviews limited to once every 6 months. Non-grandfathered individual and small-group ACA plans are exempt, as are self-funded ERISA plans by preemption.' },
      { q: 'What does Cigna pay for ABA in Nebraska?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Nebraska\'s Medicaid schedule is an unusually low benchmark after the August 2025 cuts, so treat commercial rate-setting as a first-order contracting conversation.' },
    ],
  },

  'unitedhealthcare-nebraska': {
    slug: 'unitedhealthcare-nebraska',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Neb. Rev. Stat. § 44-7,106 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes — DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in Nebraska',
    state: 'NE', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Nebraska',
    h1: 'UnitedHealthcare / Optum ABA coverage in Nebraska: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Nebraska: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Nebraska families — the national clinical policy, prior authorization, the Neb. Rev. Stat. § 44-7,106 mandate (under 21, the 25-hour weekly cap, exemptions), Nebraska behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Nebraska, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Nebraska\'s autism insurance mandate (Neb. Rev. Stat. § 44-7,106), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Neb. Rev. Stat. § 44-7,106 (LB 254, eff. 1/1/2015)' },
      { label: 'Mandate age', value: 'Under 21 (screening, diagnosis, and treatment of ASD)' },
      { label: 'Mandate caps', value: '25 hrs/week maximum benefit for behavioral health treatment incl. ABA' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small-group ACA plans; self-funded ERISA (preempted)' },
      { label: 'Licensure', value: 'NE Licensed Behavior Analyst (DHHS Licensure Unit, 172 NAC 86)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Nebraska',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Nebraska is the legal floor underneath it: the state mandate below governs what state-regulated plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. Notably, Optum\'s ABA State Mandates supplemental criteria document (BH 803ABA, January 2026) contains no Nebraska entry — so Nebraska commercial members get the standard Optum criteria, with the state mandate operating at the benefits layer rather than through carrier-modified clinical criteria. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Nebraska.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026; no Nebraska entry)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'The Nebraska mandate: what it guarantees (and doesn\'t)',
        body: [
          'Nebraska\'s mandate (LB 254 of 2014, effective for policies delivered or renewed on or after January 1, 2015) requires coverage of screening, diagnosis, and treatment of ASD for individuals under 21 — with behavioral health treatment including ABA capped at a maximum benefit of 25 hours per week until age 21. No visit limits or less-favorable dollar limits or cost-sharing are otherwise permitted, non-BHT payments (OT/ST/PT, pharmacy, psychiatric care) cannot be applied against the cap, and the insurer may review treatment at most once every 6 months, at its own cost. ABA must be provided or supervised by a nationally certified behavior analyst or licensed psychologist, in person or by telehealth. The reach is narrower than it reads: the statute exempts non-grandfathered individual and small-group ACA plans required to include essential health benefits, so the mandate\'s practical territory is large-group and grandfathered plans — and while the statute\'s text reaches self-funded plans "to the extent not preempted," ERISA preemption still takes self-funded employer plans off the table. The 25-hour cap is also a quantitative limit whose enforceability against group plans is in tension with federal parity (MHPAEA) — treat that as an argument to raise, not a settled fact.',
        ],
        cites: [
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Nebraska',
        body: [
          'A family saying "we have UnitedHealthcare" in Nebraska may actually be on the carrier\'s Medicaid plan — UnitedHealthcare Community Plan of Nebraska (Heritage Health), whose ABA network Optum has managed since 2017 — which follows the state Medicaid rules and the Optum Medicaid workflow, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
        cites: [
      { title: 'Optum NE Heritage Health ABA Quick Reference Guide (BH4233)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Nebraska',
        body: [
          'Nebraska licenses behavior analysts under the Behavior Analyst Practice Act (Neb. Rev. Stat. § 38-4401 et seq., regulations at 172 NAC 86): the Licensed Behavior Analyst (LBA) credential for BCBAs and LaBA for BCaBAs, administered by the DHHS Licensure Unit with a Board of Behavior Analysts — and since January 1, 2025 the state\'s Medicaid program requires the license of every practicing BCBA, which has made LBA licensure the de facto floor for the market. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Nebraska (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement. When benchmarking, note that Nebraska\'s Medicaid fee schedule sits unusually low after the August 2025 cuts (97153 at $18.70 per 15 minutes), so commercial contracts here carry more of the margin than in most states.',
        ],
        cites: [
      { title: 'NE DHHS — Behavior Analyst licensure (Behavior Analyst Practice Act, 172 NAC 86)', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
      { title: 'Provider Bulletin 25-14 — ABA Rates (July 1, 2025)', url: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Large-group/grandfathered state-regulated (mandate applies) vs. small-group/individual ACA or self-funded ERISA (exempt) — it decides which rulebook governs.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Nebraska (Heritage Health Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5-TR ASD diagnosis confirmed with a validated tool (ADI-R, ADOS-2, etc.) — Optum\'s criteria require it.' },
      { title: 'Requested weekly hours vs. the 25-hour cap', desc: 'Where the mandate governs, BHT including ABA caps at 25 hrs/week — plan intensity and any parity argument accordingly.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
      { title: 'Neb. Rev. Stat. § 44-7,106 (full text)', url: 'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106' },
      { title: 'NE DHHS — Behavior Analyst licensure page', url: 'https://dhhs.ne.gov/licensure/Pages/Behavior-Analyst.aspx' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Nebraska?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Nebraska\'s mandate (Neb. Rev. Stat. § 44-7,106) for state-regulated plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Nebraska autism mandate require?', a: 'Coverage of ASD screening, diagnosis, and treatment for individuals under 21, with behavioral health treatment including ABA capped at 25 hours per week — and insurer treatment reviews limited to once every 6 months. Non-grandfathered individual and small-group ACA plans are exempt, as are self-funded ERISA plans by preemption.' },
      { q: 'Does Optum have Nebraska-specific ABA criteria?', a: 'Not on the commercial side — Optum\'s ABA State Mandates supplement (BH 803ABA) has no Nebraska entry, so standard Optum criteria apply. On the Medicaid side it\'s the opposite: Optum runs a dedicated NE Heritage Health ABA program with its own forms and workflow — see the UHC Community Plan of Nebraska guide.' },
      { q: 'What does UnitedHealthcare pay for ABA in Nebraska?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Nebraska\'s Medicaid schedule is an unusually low benchmark after the August 2025 cuts, so treat commercial rate-setting as a first-order contracting conversation.' },
    ],
  },
};
