import type { PayerConfig } from './types.js';

export const northCarolinaPayers: Record<string, PayerConfig> = {
  'north-carolina-medicaid': {
    slug: 'north-carolina-medicaid',
    cardDesc: 'RB-BHT under CCP 8F: PA on everything, 180-day auths, published rates, HB 696 shakeup.',
    assessmentPA: 'Required — PA for ALL RB-BHT services, including the assessment (CCP 8F)',
    treatmentPA: 'Required — initial and reauthorization periods up to 180 days each',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'North Carolina Medicaid',
    state: 'NC', kind: 'state-medicaid',
    pill: 'Payer Guide · North Carolina Medicaid',
    h1: 'North Carolina Medicaid ABA coverage: the intake guide.',
    metaTitle: 'North Carolina Medicaid ABA (RB-BHT) Coverage, Rates & Prior Auth | Carelu',
    metaDescription:
      'How NC Medicaid covers ABA as Research-Based Behavioral Health Treatment (RB-BHT) under Clinical Coverage Policy 8F — prior authorization, 180-day auth cycles, published fee-schedule rates, the HB 696 overhaul, and the Standard/Tailored plan landscape.',
    intro: [
      'North Carolina is one of the highest-demand ABA states in the country, and NC Medicaid covers ABA as "Research-Based Behavioral Health Treatment" (RB-BHT) under Clinical Coverage Policy 8F. The benefit is available in every delivery channel — NC Medicaid Direct, all five Standard Plans, all four Tailored Plans, and the new Children & Families Specialty Plan — and the plans must pay at least the state fee schedule. But 2025–2026 brought a rate cut and reversal, a major legislative overhaul (HB 696), and a policy rewrite in public comment, so this is a market where staying current is part of the job.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — RB-BHT under CCP 8F; under 21 via EPSDT, adults 21+ via a 2021 SPA' },
      { label: 'Prior auth', value: 'Required for ALL RB-BHT services, assessment included' },
      { label: 'Auth periods', value: 'Initial and reauth each up to 180 days' },
      { label: 'Plan review', value: 'LQASP treatment plan reviewed ≥ every 6 months, rewritten annually' },
      { label: 'Rates (per 15 min)', value: '97151 $30.56 · 97153 $20.81 · 97155 $32.22 · 97156 $23.70' },
      { label: 'Watch', value: 'HB 696 ABA provisions effective 8/1/2026; new CCP 8F draft in comment' },
      { label: 'Diagnosis recency', value: 'Under-3 provisional dx must be confirmed within 6 months' },
    ],
    sections: [
      {
        h2: 'Who qualifies, and through which plan',
        body: [
          'RB-BHT is covered for members under 21 with an ASD diagnosis established using a scientifically validated diagnostic tool, via EPSDT — and, less well known, a State Plan Amendment effective July 1, 2021 extends RB-BHT coverage to adults 21 and older as well. For children under three, a provisional diagnosis is accepted at the time services begin, with a definitive diagnosis expected within six months — a detail worth capturing so young families aren\'t turned away prematurely.',
          'The benefit exists in every delivery channel: NC Medicaid Direct, the five Standard Plans (Healthy Blue, AmeriHealth Caritas, Carolina Complete Health, UnitedHealthcare Community Plan, WellCare), the four Tailored Plans (Alliance, Trillium, Vaya, Partners — launched July 1, 2024), and the Children & Families Specialty Plan for child-welfare-involved members (launched December 1, 2025). The clinical rules are 8F everywhere; each plan\'s guide below covers its submission mechanics and quirks.',
        ],
        cites: [
          { title: 'NC Medicaid — Clinical Coverage Policy 8F (RB-BHT)', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
          { title: 'Disability Rights NC — autism-related services in NC (incl. 2021 SPA)', url: 'https://disabilityrightsnc.org/resources/autism-related-services-in-nc/' },
          { title: 'NC Medicaid — Tailored Plans', url: 'https://medicaid.ncdhhs.gov/tailored-plans' },
        ],
      },
      {
        h2: 'Authorization & treatment plan',
        body: [
          'Prior authorization is required for all RB-BHT services — including the assessment. Initial authorizations run up to 180 days, reauthorizations up to another 180, and the reauth must be submitted before the current authorization expires. The treatment plan must be written and reviewed at least every six months by a Licensed Qualified Autism Service Provider (LQASP), rewritten annually, and at least 10% of approved services should be directly observed by the LQASP. As with any long review cadence, the baseline data collected at intake is what every future review is measured against.',
        ],
        cites: [
          { title: 'NC Medicaid — Clinical Coverage Policy 8F (RB-BHT)', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
        ],
      },
      {
        h2: 'Rates: published, cut, and restored',
        body: [
          'NC Medicaid publishes RB-BHT rates, and every plan — Standard, Tailored, or LME/MCO — must reimburse at no less than 100% of the state fee schedule unless the provider agrees otherwise, which makes the schedule an effective statewide floor. Current per-15-minute rates (effective 10/1/2025): 97151 $30.56, 97152 $61.73, 97153 $20.81, 97154 $11.37, 97155 $32.22, 97156 $23.70, 97157 $11.51. Know the recent history too: a 10% RB-BHT cut took effect October 1, 2025 during a budget shortfall, was reversed by the Governor\'s December 10, 2025 directive, and restored schedules posted January 5, 2026 — so any rate sheet dated fall 2025 is wrong in your favor.',
        ],
        cites: [
          { title: 'Alliance Health — Standard Rate Schedule (RB-BHT rates, eff. 10/1/2025)', url: 'https://www.alliancehealthplan.org/document-library/97251' },
          { title: 'NCDHHS — BH rate increases & the 100%-of-fee-schedule floor', url: 'https://medicaid.ncdhhs.gov/blog/2023/11/15/nc-medicaid-behavioral-health-services-rate-increases' },
          { title: 'Acuity News — NC ABA rates restored + HB 696 oversight', url: 'https://acuity.news/regulation/nc-medicaid-aba-rates-restored-hb696-oversight-2026/' },
        ],
      },
      {
        h2: 'HB 696: the August 2026 overhaul',
        body: [
          'HB 696 (Session Law 2026-1, signed April 30, 2026) rewires NC Medicaid ABA effective August 1, 2026: no new out-of-state BCBA/QASP-supervisor enrollments; assessments must be in-person (telehealth assessments aren\'t reimbursed absent a documented exception); paraprofessionals can\'t deliver services by telehealth except documented necessity; telehealth LQASP observation/direction is capped at 50% per beneficiary (with DHHS implementing policy reportedly tightening remote supervision to roughly 20% of therapy time); the 10% LQASP observation floor is codified; and paraprofessionals must hold RBT or ABAT certification, with a 120-day grace period for new hires. Plans above 16 hours/week originally required monthly reapproval — softened to every 3 months in the budget signed July 7, 2026. Separately, a revised CCP 8F went through public comment May 15 – June 14, 2026, so expect a new policy version to supersede the December 2020 document.',
        ],
        cites: [
          { title: 'Governor\'s office — HB 696 signing (4/30/2026)', url: 'https://governor.nc.gov/news/press-releases/2026/04/30/governor-stein-takes-action-one-bill' },
          { title: 'NC Health News — new ABA Medicaid rules (7/2026)', url: 'https://www.northcarolinahealthnews.org/2026/07/15/autism-aba-therapy-medicaid-new-rules/' },
          { title: 'NCTracks — CCP 8F public-comment notice (5/2026)', url: 'https://www.nctracks.nc.gov/content/public/providers/provider-communications/2026----Announcements/Public-Comment-Notice--Policy-8F---Research-Based-Behavioral-Health-Treatment-for-Autism-Spectrum-Disorder.html' },
        ],
      },
    ],
    collect: [
      { title: 'Medicaid ID & health plan', desc: 'Standard Plan, Tailored Plan, CFSP, or NC Medicaid Direct — it decides the portal, forms, and UM contacts.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Diagnosis, instrument, and date; for under-3, provisional-diagnosis status and the 6-month confirmation clock.' },
      { title: 'Service order', desc: 'Signed by an MD/DO/LP, based on an assessment, dated on/before service start, valid one year.' },
      { title: 'Assessment (in-person from 8/2026)', desc: 'HB 696 requires in-person assessments — plan scheduling and staffing accordingly.' },
      { title: 'Supervisor credentials & location', desc: 'Out-of-state supervisor enrollment is closing; RBT/ABAT certification is now mandatory for paraprofessionals.' },
    ],
    sources: [
      { title: 'NC Medicaid — 8F RB-BHT for ASD (policy page)', url: 'https://medicaid.ncdhhs.gov/8f-research-based-behavioral-health-treatment-rb-bht-autism-spectrum-disorder-asd' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F (PDF)', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
      { title: 'NCDHHS — BH rate floor bulletin', url: 'https://medicaid.ncdhhs.gov/blog/2023/11/15/nc-medicaid-behavioral-health-services-rate-increases' },
      { title: 'Alliance Health — Standard Rate Schedule (RB-BHT)', url: 'https://www.alliancehealthplan.org/document-library/97251' },
      { title: 'Governor\'s office — HB 696 signing', url: 'https://governor.nc.gov/news/press-releases/2026/04/30/governor-stein-takes-action-one-bill' },
      { title: 'NC Health News — new ABA rules coverage', url: 'https://www.northcarolinahealthnews.org/2026/07/15/autism-aba-therapy-medicaid-new-rules/' },
    ],
    faq: [
      { q: 'Does North Carolina Medicaid cover ABA therapy?', a: 'Yes — as Research-Based Behavioral Health Treatment (RB-BHT) under Clinical Coverage Policy 8F, in every delivery channel (Medicaid Direct, Standard Plans, Tailored Plans, and the Children & Families Specialty Plan). All RB-BHT services require prior authorization, including the assessment.' },
      { q: 'What does NC Medicaid pay for ABA?', a: 'Published per-15-minute rates, effective 10/1/2025: 97151 $30.56, 97153 $20.81, 97155 $32.22, 97156 $23.70 — and every managed-care plan must pay at least 100% of the state fee schedule unless the provider agrees otherwise.' },
      { q: 'What does HB 696 change for ABA providers?', a: 'From August 1, 2026: in-person assessments, no new out-of-state supervisor enrollments, RBT/ABAT certification for paraprofessionals, a 50% cap on telehealth supervision, a codified 10% observation floor, and 3-month reapprovals for plans above 16 hours/week.' },
      { q: 'Can a young child start before a confirmed diagnosis?', a: 'For children under three, NC Medicaid accepts a provisional ASD diagnosis when services begin, with a definitive diagnosis expected within six months.' },
    ],
  },

  'healthy-blue-north-carolina': {
    slug: 'healthy-blue-north-carolina',
    family: 'anthem',
    cardDesc: 'Straight CCP 8F via Availity/ICR; RB-BHT exempt from network distance rules; CFSP sibling plan.',
    assessmentPA: 'Required — per CCP 8F (all RB-BHT services PA\'d); submit via Availity Interactive Care Reviewer',
    treatmentPA: 'Required — 180-day auth cycles per 8F',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'Healthy Blue (NC)',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Healthy Blue (NC)',
    h1: 'Healthy Blue North Carolina ABA coverage (Standard Plan).',
    metaTitle: 'Healthy Blue NC (Medicaid Standard Plan) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How Healthy Blue administers NC Medicaid RB-BHT (ABA) — full adoption of Clinical Coverage Policy 8F, Availity/Interactive Care Reviewer submission, behavioral-health fax lines, and the Children & Families Specialty Plan distinction.',
    intro: [
      'Healthy Blue — the Anthem/Elevance Standard Plan — administers NC Medicaid\'s RB-BHT benefit by adopting the state Clinical Coverage Policies wholesale: no Healthy-Blue-specific ABA clinical criteria exist. That makes this a mechanics guide: where requests go, which fax lines answer, and one structural wrinkle — Blue Cross NC also operates the separate Children & Families Specialty Plan, so foster-care-involved children will show up under a different plan than standard Healthy Blue.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Medicaid Standard Plan (Anthem / Elevance)' },
      { label: 'Clinical rules', value: 'CCP 8F adopted as-is — no plan-specific ABA policy' },
      { label: 'Prior auth', value: 'Required per 8F; PA form + Precert Lookup Tool published' },
      { label: 'Submission', value: 'Availity Essentials / Interactive Care Reviewer' },
      { label: 'Network note', value: 'RB-BHT exempt from standard time/distance network rules' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'How Healthy Blue administers RB-BHT',
        body: [
          'The provider manual lists RB-BHT among covered behavioral-health services and adopts NC\'s Clinical Coverage Policies — so the whole clinical picture (PA on everything including assessment, 180-day cycles, LQASP plan reviews) is the CCP 8F baseline covered in the state guide. Submissions run through Availity Essentials\' Interactive Care Reviewer; behavioral-health authorization fax lines are (844) 429-9636 for outpatient and (844) 439-3574 for inpatient, with provider services at (844) 594-5072. Use the plan\'s Precertification Lookup Tool to confirm code-level requirements before submitting.',
          'One provider-friendly detail from the manual: RB-BHT is explicitly exempt from the plan\'s standard network time/distance standards — an open-network posture that matters if you\'re expanding into new counties.',
        ],
        cites: [
          { title: 'Healthy Blue NC — Provider Manual', url: 'https://provider.healthybluenc.com/docs/gpp/NCNC_CAID_ProviderManual.pdf' },
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
        ],
      },
      {
        h2: 'The Children & Families Specialty Plan wrinkle',
        body: [
          'Since December 1, 2025, child-welfare-involved members are auto-enrolled in the statewide Children & Families Specialty Plan ("Healthy Blue Care Together"), also operated by Blue Cross NC — a separate plan from standard Healthy Blue with its own member IDs. For intake, this means a foster or kinship placement family saying "we have Healthy Blue" needs one more verification question before you pick the submission path.',
        ],
      },
    ],
    collect: [
      { title: 'Standard Healthy Blue vs. Care Together (CFSP)', desc: 'Child-welfare-involved members are on the specialty plan — confirm which ID the family holds.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per CCP 8F, with the MD/DO/LP service order.' },
      { title: 'County / region', desc: 'RB-BHT\'s network-rules exemption makes cross-county serving feasible — capture location anyway for scheduling.' },
    ],
    sources: [
      { title: 'Healthy Blue NC — Provider Manual', url: 'https://provider.healthybluenc.com/docs/gpp/NCNC_CAID_ProviderManual.pdf' },
      { title: 'Healthy Blue NC — prior authorization page', url: 'https://provider.healthybluenc.com/north-carolina-provider/prior-authorization' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Healthy Blue NC cover ABA therapy?', a: 'Yes — Healthy Blue administers NC Medicaid\'s RB-BHT benefit by adopting Clinical Coverage Policy 8F: PA on all services including assessment, 180-day authorization cycles, LQASP treatment-plan reviews.' },
      { q: 'How do I submit an RB-BHT authorization to Healthy Blue?', a: 'Via Availity Essentials\' Interactive Care Reviewer, or fax (844) 429-9636 for outpatient behavioral health. Check the Precertification Lookup Tool for code-level requirements first.' },
      { q: 'What is Healthy Blue Care Together?', a: 'The separate Children & Families Specialty Plan (launched December 2025) for child-welfare-involved members, also run by Blue Cross NC. Foster families\' "Healthy Blue" cards may actually be CFSP — verify before submitting.' },
    ],
  },

  'amerihealth-caritas-north-carolina': {
    slug: 'amerihealth-caritas-north-carolina',
    family: 'amerihealth',
    cardDesc: 'CCP 8F deference; NaviNet + PA Lookup Tool; thinnest public paper trail of the NC plans.',
    assessmentPA: 'Required — per CCP 8F; confirm code-level rules in AmeriHealth\'s PA Lookup Tool',
    treatmentPA: 'Required — per CCP 8F 180-day cycles; UM at (888) 738-0004',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'AmeriHealth Caritas North Carolina',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · AmeriHealth Caritas (NC)',
    h1: 'AmeriHealth Caritas North Carolina ABA coverage (Standard Plan).',
    metaTitle: 'AmeriHealth Caritas NC (Medicaid Standard Plan) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How AmeriHealth Caritas administers NC Medicaid RB-BHT (ABA) — deference to Clinical Coverage Policy 8F, the PA Lookup Tool and NaviNet workflow, UM contacts, and why its documents are best pulled manually.',
    intro: [
      'AmeriHealth Caritas North Carolina administers the RB-BHT benefit as a Standard Plan, mapping its coverage decisions to the state Clinical Coverage Policies — including 8F for ABA. Fair warning on sourcing: AmeriHealth\'s provider site is aggressively bot-protected, so this guide leans on the state baseline plus the plan\'s published contact points, and flags the two documents your team should pull manually from the portal.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Medicaid Standard Plan' },
      { label: 'Clinical rules', value: 'CCP 8F via the plan\'s Clinical Coverage Policy Reference Tool' },
      { label: 'Prior auth', value: 'Required per 8F; confirm codes in the PA Lookup Tool' },
      { label: 'UM contact', value: '(888) 738-0004' },
      { label: 'Portal', value: 'NaviNet + PA Lookup Tool at amerihealthcaritasnc.com' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'How AmeriHealth administers RB-BHT',
        body: [
          'The clinical rules are the CCP 8F baseline: PA on all RB-BHT services including the assessment, 180-day authorization cycles, LQASP treatment-plan reviews at least every six months. AmeriHealth\'s own layer is a Clinical Coverage Policy Reference Tool mapping to the state policies, a Behavioral Health Utilization Management Guide (January 2025 edition), and a PA Lookup Tool for code-level checks. One thing to verify directly: AmeriHealth eliminated prior authorization on 240+ physical and behavioral-health codes effective January 1, 2025 — whether any 9715x codes made that list isn\'t publicly confirmed, so run your codes through the Lookup Tool rather than assuming.',
          'Because the plan\'s site blocks automated access, have your team download the current BH UM Guide and the PA Lookup results from the portal directly, and keep dated copies with your payer files.',
        ],
        cites: [
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
          { title: 'AmeriHealth Caritas NC — Behavioral Health UM Guide (pull manually; bot-blocked)', url: 'https://www.amerihealthcaritasnc.com/content/dam/amerihealth-caritas/acnc/pdf/provider/resources/utilization-management-guide.pdf.coredownload.inline.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Member ID + plan confirmation', desc: 'Standard AmeriHealth Caritas NC vs. other channels — verify at (888) 738-0004 if in doubt.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per CCP 8F, with the MD/DO/LP service order.' },
      { title: 'Code-level PA check', desc: 'Run the planned CPT codes through the PA Lookup Tool before promising timelines.' },
    ],
    sources: [
      { title: 'AmeriHealth Caritas NC — prior authorization resources (bot-blocked; access via portal)', url: 'https://www.amerihealthcaritasnc.com/provider/resources/physical-prior-auth' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does AmeriHealth Caritas NC cover ABA therapy?', a: 'Yes — as a Standard Plan it administers NC Medicaid\'s RB-BHT benefit under Clinical Coverage Policy 8F, with prior authorization per the state baseline. Confirm code-level rules in the plan\'s PA Lookup Tool.' },
      { q: 'How do I reach AmeriHealth Caritas NC utilization management?', a: 'UM runs at (888) 738-0004; the provider workflow uses NaviNet and the PA Lookup Tool at amerihealthcaritasnc.com. The January 2025 Behavioral Health UM Guide has the current details — pull it from the portal.' },
    ],
  },

  'carolina-complete-health': {
    slug: 'carolina-complete-health',
    family: 'centene',
    cardDesc: 'Explicit CCP 8F deference + an ABA treatment-request checklist; regions 3–5 footprint.',
    assessmentPA: 'Required — per CCP 8F, before rendering any RB-BHT service including assessment',
    treatmentPA: 'Required — submit with the ABA outpatient treatment request checklist via the provider portal',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'Carolina Complete Health',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Carolina Complete Health',
    h1: 'Carolina Complete Health ABA coverage (Standard Plan).',
    metaTitle: 'Carolina Complete Health (NC Medicaid) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How Carolina Complete Health administers NC Medicaid RB-BHT (ABA) — explicit deference to Clinical Coverage Policy 8F, the ABA outpatient treatment request checklist, portal submission, and its regional footprint.',
    intro: [
      'Carolina Complete Health — the physician-led Centene joint venture — administers RB-BHT with the cleanest policy posture of the Standard Plans: its behavioral-health page states outright that clinical requirements are detailed in Policy 8F on the state\'s Medicaid website. The plan\'s own contribution is operational: an ABA Outpatient Treatment Request Checklist that structures submissions, and a regional footprint worth checking before intake.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Medicaid Standard Plan (Centene JV, physician-led)' },
      { label: 'Clinical rules', value: 'Explicit deference to CCP 8F' },
      { label: 'Prior auth', value: 'Required per 8F; ABA treatment-request checklist published' },
      { label: 'Portal', value: 'provider.carolinacompletehealth.com' },
      { label: 'Footprint', value: 'Operates in select NC regions — verify the member\'s county' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'How CCH administers RB-BHT',
        body: [
          'Clinically, everything is CCP 8F: PA before rendering any RB-BHT service (assessment included), 180-day authorization cycles, LQASP treatment-plan reviews. Requests go through the provider portal accompanied by the plan\'s ABA Outpatient Treatment Request Checklist — using it as your internal submission template removes back-and-forth. Behavioral health is integrated in-house (clinical training questions go to BH_training@centene.com), and provider services runs at (833) 552-3876, Monday–Saturday 7am–6pm. Note that CCH operates in select NC regions rather than statewide, so verify the member\'s county during eligibility; note also that Partners Health Management\'s Tailored Plan documentation cross-references CCH policies, reflecting shared Centene infrastructure.',
        ],
        cites: [
          { title: 'Carolina Complete Health — behavioral health provider page', url: 'https://network.carolinacompletehealth.com/resources/behavioral-health.html' },
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
        ],
      },
    ],
    collect: [
      { title: 'Member county / region', desc: 'CCH isn\'t statewide — confirm the member\'s county maps to its service regions.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per CCP 8F, with the MD/DO/LP service order.' },
      { title: 'Checklist items', desc: 'Build intake to pre-fill the plan\'s ABA treatment-request checklist.' },
    ],
    sources: [
      { title: 'Carolina Complete Health — behavioral health page (8F deference, checklist)', url: 'https://network.carolinacompletehealth.com/resources/behavioral-health.html' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Carolina Complete Health cover ABA therapy?', a: 'Yes — RB-BHT per NC Clinical Coverage Policy 8F, which the plan defers to explicitly. PA is required before any RB-BHT service, submitted through the provider portal with the plan\'s ABA treatment-request checklist.' },
      { q: 'Is Carolina Complete Health available statewide?', a: 'No — it operates in select NC regions. Verify the member\'s county during eligibility before planning intake.' },
    ],
  },

  'unitedhealthcare-community-plan-north-carolina': {
    slug: 'unitedhealthcare-community-plan-north-carolina',
    family: 'unitedhealthcare',
    cardDesc: 'The Optum carve-out: separate assessment & treatment auths on Provider Express, own criteria.',
    assessmentPA: 'Required — a SEPARATE Optum authorization for the assessment, distinct from treatment',
    treatmentPA: 'Required — second authorization via Provider Express after the assessment',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'UnitedHealthcare Community Plan of North Carolina',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · UHC Community Plan (NC)',
    h1: 'UnitedHealthcare Community Plan of North Carolina ABA coverage (Standard Plan).',
    metaTitle: 'UHC Community Plan NC (Medicaid) ABA / RB-BHT Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers NC Medicaid RB-BHT (ABA) — the Optum-run network since 2021, separate assessment and treatment authorizations on Provider Express, supplemental clinical criteria, and NCTracks enrollment.',
    intro: [
      'UnitedHealthcare Community Plan is the most operationally distinct of NC\'s Standard Plans for ABA: since July 1, 2021, Optum manages the RB-BHT network, which means a separate portal (Provider Express), a two-step authorization flow with distinct assessment and treatment requests, and UHC\'s own NC Medicaid supplemental clinical criteria layered on the CCP 8F floor. If your practice serves UHC members, treat this as its own workflow, not a variant of the others.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Medicaid Standard Plan (ABA network run by Optum since 7/2021)' },
      { label: 'Clinical rules', value: 'CCP 8F floor + UHC NC supplemental clinical criteria' },
      { label: 'Prior auth', value: 'Two separate auths: assessment first, then treatment' },
      { label: 'Portal', value: 'Provider Express (One Healthcare ID); support (866) 209-9320' },
      { label: 'Enrollment', value: 'NCTracks enrollment required before joining the Optum ABA network' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'The two-step Optum flow',
        body: [
          'Optum requires an authorization for the ABA assessment that is separate from the treatment authorization — the same structure as Optum\'s commercial ABA program, run here under NC Medicaid rules. Both submit through the Provider Express secure portal (One Healthcare ID), where the NC ABA quick-reference guide and provider orientation also live; portal support runs at (866) 209-9320 and network/provider relations at (877) 614-0484. Sequence intake accordingly: benefits check → assessment auth → assessment → treatment auth — with the state\'s 8F requirements (validated diagnostic tool, service order) satisfied before step one.',
          'Providers must be enrolled with NC Medicaid through NCTracks before they can join the Optum ABA network — a credentialing dependency worth building into any expansion timeline.',
        ],
        cites: [
          { title: 'Optum Provider Express — NC Medicaid ABA Program', url: 'https://public.providerexpress.com/content/ope-provexpr/us/en/clinical-resources/autismABA2/abaCAMediCal12.html' },
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
        ],
      },
    ],
    collect: [
      { title: 'Member ID + plan confirmation', desc: 'UHC Community Plan members route through Optum — different portal and forms than every other NC plan.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per CCP 8F; needed before the assessment authorization.' },
      { title: 'Assessment scheduling window', desc: 'The two-step auth flow adds a cycle — set family expectations on timeline honestly.' },
      { title: 'NCTracks + Optum credentialing status', desc: 'Both enrollments must be in place before serving UHC members.' },
    ],
    sources: [
      { title: 'Optum Provider Express — NC Medicaid ABA Program', url: 'https://public.providerexpress.com/content/ope-provexpr/us/en/clinical-resources/autismABA2/abaCAMediCal12.html' },
      { title: 'UHC Community Plan NC — prior authorization page', url: 'https://www.uhcprovider.com/en/health-plans-by-state/north-carolina-health-plans/nc-comm-plan-home/nc-cp-prior-auth.html' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of NC cover ABA?', a: 'Yes — RB-BHT under the CCP 8F baseline, administered through Optum, which has managed the plan\'s ABA network since July 2021, with UHC\'s own supplemental clinical criteria on top.' },
      { q: 'How is UHC\'s NC authorization process different?', a: 'It\'s a two-step flow on Provider Express: a separate authorization for the assessment, then a second for treatment — unlike the single-request flow at most other NC plans.' },
      { q: 'What credentialing do I need for UHC NC ABA?', a: 'NC Medicaid enrollment via NCTracks first, then Optum ABA network credentialing — plan for both in your timeline.' },
    ],
  },

  'wellcare-north-carolina': {
    slug: 'wellcare-north-carolina',
    family: 'centene',
    cardDesc: 'Branded policy WNC.CP.109 that restates 8F; auth-list driven PA, telehealth via WNC.CP.193.',
    assessmentPA: 'Required — per CCP 8F baseline; confirm code-level PA in WellCare\'s Authorization Lookup Tool',
    treatmentPA: 'Required — WNC.CP.109 restates 8F: LQASP plan, review ≥ every 6 months',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'WellCare of North Carolina',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · WellCare (NC)',
    h1: 'WellCare of North Carolina ABA coverage (Standard Plan).',
    metaTitle: 'WellCare NC (Medicaid Standard Plan) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How WellCare of North Carolina administers RB-BHT (ABA) — clinical policy WNC.CP.109 restating CCP 8F with a state-precedence clause, the Authorization Lookup Tool workflow, and telehealth rules under WNC.CP.193.',
    intro: [
      'WellCare of North Carolina (Centene) is the one Standard Plan with a branded ABA clinical policy — WNC.CP.109, "Research-Based Behavioral Health Treatment for ASD" (last reviewed May 2025). Read it closely, though, and it\'s a near-verbatim restatement of CCP 8F with an explicit clause that state Medicaid coverage provisions take precedence wherever they conflict. So the state guide covers the clinical substance; this guide covers WellCare\'s tooling.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Medicaid Standard Plan (Centene)' },
      { label: 'Clinical rules', value: 'WNC.CP.109 — restates CCP 8F; state rules take precedence' },
      { label: 'Prior auth', value: 'Code-level PA via the Authorization Lookup Tool + BH auth list' },
      { label: 'Telehealth', value: 'Governed by separate policy WNC.CP.193' },
      { label: 'Portal', value: 'WellCare of NC provider portal (wellcarenc.com)' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'How WellCare administers RB-BHT',
        body: [
          'WNC.CP.109 mirrors 8F\'s criteria — under-21 coverage via EPSDT, a validated diagnostic tool, provisional diagnosis under age three with definitive diagnosis within six months, LQASP treatment plans reviewed at least every six months — and defers wholesale to CCP 8F Section 6.0 on provider qualifications. Rather than listing PA\'d codes in the policy, WellCare delegates code-level requirements to its Authorization Lookup Tool and Medicaid Behavioral Health Authorization List, so check your specific codes there before each submission cycle. Telehealth for RB-BHT is governed by a separate policy (WNC.CP.193), with telephonic parent training allowed only for documented caregiver health or access barriers — and NC\'s HB 696 telehealth restrictions tighten this further from August 2026.',
        ],
        cites: [
          { title: 'WellCare NC — WNC.CP.109 RB-BHT clinical policy', url: 'https://www.policies-wellcare.com/content/dam/centene/wellcare/nc/policies/clinical-policies/WNC.CP.109.pdf' },
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
        ],
      },
    ],
    collect: [
      { title: 'Code-level PA check', desc: 'The Authorization Lookup Tool is the source of truth — check it each auth cycle, not once.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per 8F/WNC.CP.109; provisional-dx path documented for under-3s.' },
      { title: 'Telehealth justification', desc: 'Telephonic parent training needs a documented caregiver barrier under WNC.CP.193.' },
    ],
    sources: [
      { title: 'WellCare NC — WNC.CP.109 RB-BHT clinical policy', url: 'https://www.policies-wellcare.com/content/dam/centene/wellcare/nc/policies/clinical-policies/WNC.CP.109.pdf' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does WellCare of NC cover ABA therapy?', a: 'Yes — under clinical policy WNC.CP.109, which restates NC\'s CCP 8F (and explicitly yields to state rules on any conflict). PA requirements are managed code-by-code through WellCare\'s Authorization Lookup Tool.' },
      { q: 'Does WellCare NC cover ABA parent training by phone?', a: 'Only under its telehealth policy WNC.CP.193, when a documented caregiver health or access barrier exists — and NC\'s August 2026 HB 696 rules restrict ABA telehealth further.' },
    ],
  },

  'alliance-health-north-carolina': {
    slug: 'alliance-health-north-carolina',
    family: '',
    cardDesc: 'Tailored Plan publishing real rates + the strictest diagnostic-tool and service-order enforcement.',
    assessmentPA: 'Required — per 8F, with Alliance\'s RB-BHT cover sheet accompanying service requests',
    treatmentPA: 'Required — 180-day cycles per 8F, through Alliance UM',
    dxRequired: 'Yes \u2014 ASD via ADI-R, ADOS-2, CARS-2, or TELE-ASD-PEDS; screeners alone rejected',
    payer: 'Alliance Health (NC Tailored Plan)',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Alliance Health (NC)',
    h1: 'Alliance Health ABA coverage (NC Tailored Plan).',
    metaTitle: 'Alliance Health (NC Tailored Plan) ABA / RB-BHT Coverage & Rates | Carelu',
    metaDescription:
      'How Alliance Health administers NC Medicaid RB-BHT (ABA) — CCP 8F clinical rules, published fee-schedule rates, and the state\'s strictest documented enforcement on diagnostic instruments and service orders.',
    intro: [
      'Alliance Health is one of NC\'s four Tailored Plans, and for ABA providers it stands out on two fronts: it publishes an actual rate schedule (the clearest public confirmation of the state fee-schedule floor in action), and its February 2026 RB-BHT guidance enforces diagnostic-instrument and service-order requirements more explicitly than any other NC plan. Clinically it\'s straight CCP 8F — but its documentation bar is where referrals get screened out.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Tailored Plan (public LME/MCO)' },
      { label: 'Clinical rules', value: 'CCP 8F + operational RB-BHT guidance (Feb 2026)' },
      { label: 'Prior auth', value: 'Required per 8F, with Alliance\'s RB-BHT cover sheet' },
      { label: 'Diagnostic bar', value: 'ADI-R, ADOS-2, CARS-2, TELE-ASD-PEDS accepted; GARS/M-CHAT/SRS insufficient alone' },
      { label: 'Service order', value: 'MD/DO/LP-signed, assessment-based, valid 1 year, dated before start' },
      { label: 'Rates (per 15 min)', value: '97151 $30.56 · 97153 $20.81 · 97155 $32.22 · 97156 $23.70' },
    ],
    sections: [
      {
        h2: 'The documentation bar',
        body: [
          'Alliance\'s guidance names the acceptable ASD diagnostic instruments — ADI-R, ADOS-2, CARS-2, and TELE-ASD-PEDS — and explicitly rejects GARS, M-CHAT, and SRS as standalone diagnoses. It\'s equally specific on the service order: signed by an MD, DO, or licensed psychologist, based on a behavioral/adaptive/functional assessment, dated on or before the service start, valid one year — and a bare "medical necessity statement" does not qualify. Screen referral packets against both requirements at intake; sending families back for a qualifying diagnostic evaluation mid-authorization is where NC pipelines stall.',
        ],
        cites: [
          { title: 'Alliance Health — Guidance for RB-BHT Providers (Feb 2026)', url: 'https://www.alliancehealthplan.org/provider-updates/guidance-for-rb-bht-providers/' },
        ],
      },
      {
        h2: 'Rates & submission',
        body: [
          'Alliance publishes its standard rate schedule outright — RB-BHT at the state fee-schedule levels, per 15-minute unit, effective 10/1/2025: 97151 $30.56, 97152 $61.73, 97153 $20.81, 97154 $11.37, 97155 $32.22, 97156 $23.70, 97157 $11.51 (noted as subject to LME/MCO funding). Authorization follows the 8F baseline — PA on everything, 180-day cycles — with the plan\'s fillable RB-BHT cover sheet accompanying service requests through Alliance UM. Alliance also participates as a Children & Families Specialty Plan network partner.',
        ],
        cites: [
          { title: 'Alliance Health — Standard Rate Schedule (RB-BHT)', url: 'https://www.alliancehealthplan.org/document-library/97251' },
        ],
      },
    ],
    collect: [
      { title: 'Diagnostic instrument check', desc: 'Confirm the diagnosis used ADI-R, ADOS-2, CARS-2, or TELE-ASD-PEDS — screeners alone will be rejected.' },
      { title: 'Qualifying service order', desc: 'MD/DO/LP-signed, assessment-based, dated on/before start, within 1 year.' },
      { title: 'RB-BHT cover sheet', desc: 'Include Alliance\'s fillable cover sheet with every service request.' },
    ],
    sources: [
      { title: 'Alliance Health — Guidance for RB-BHT Providers (Feb 2026)', url: 'https://www.alliancehealthplan.org/provider-updates/guidance-for-rb-bht-providers/' },
      { title: 'Alliance Health — Standard Rate Schedule', url: 'https://www.alliancehealthplan.org/document-library/97251' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Alliance Health cover ABA therapy?', a: 'Yes — as a Tailored Plan, Alliance administers RB-BHT under CCP 8F, paying the state fee-schedule rates (97153 at $20.81/15-min, 97155 at $32.22/15-min, effective 10/1/2025).' },
      { q: 'What diagnostic tools does Alliance accept for ABA?', a: 'ADI-R, ADOS-2, CARS-2, and TELE-ASD-PEDS. GARS, M-CHAT, and SRS are explicitly insufficient as standalone diagnoses — a common reason referral packets bounce.' },
      { q: 'What makes a valid service order for Alliance?', a: 'Signed by an MD, DO, or licensed psychologist; based on a behavioral, adaptive, or functional assessment; dated on or before the service start date; valid one year. A bare medical-necessity statement doesn\'t qualify.' },
    ],
  },

  'trillium-health-resources': {
    slug: 'trillium-health-resources',
    family: '',
    cardDesc: 'Tailored Plan with the best single reference doc: 180-day TARs, adult coverage, GT/KX modifier rules.',
    assessmentPA: 'Required — TAR (prior authorization) on all RB-BHT codes, telehealth included',
    treatmentPA: 'Required — initial and reauth up to 180 days each; reauth before current auth expires',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'Trillium Health Resources (NC Tailored Plan)',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Trillium (NC)',
    h1: 'Trillium Health Resources ABA coverage (NC Tailored Plan).',
    metaTitle: 'Trillium Health Resources (NC Tailored Plan) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How Trillium Health Resources administers NC Medicaid RB-BHT (ABA) — its benefit-plan service definition citing CCP 8F, 180-day TAR cycles, adult coverage under the 2021 SPA, and telehealth modifier rules.',
    intro: [
      'Trillium Health Resources, an eastern-NC Tailored Plan, publishes the single best reference document of the four Tailored Plans: a Medicaid Child Behavioral Health Benefit Plan (revised July 2026) carrying a complete RB-BHT service definition that cites CCP 8F and the 2021 State Plan Amendment as its sources. Nothing in it is clinically distinct from the state baseline — which is exactly what makes it a reliable operational reference for TAR submissions.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Tailored Plan (public LME/MCO, eastern NC)' },
      { label: 'Clinical rules', value: 'CCP 8F via its benefit-plan service definition' },
      { label: 'Prior auth', value: 'TAR required on all codes 97151–97157, telehealth included' },
      { label: 'Auth periods', value: 'Initial + reauth up to 180 days each; renew before expiry' },
      { label: 'Ages', value: '"Children, Adolescents and Adults" — reflects the 21+ SPA coverage' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'How Trillium runs RB-BHT authorization',
        body: [
          'Every RB-BHT code (97151–97157) requires a TAR — prior authorization — including telephonic and telehealth delivery. The initial request needs the written assessment, diagnosis documentation from a validated tool, and the MD/DO/LP service order; treatment requests add a complete treatment plan signed by the LQASP and the legally responsible person, plus a discharge plan. Authorizations run up to 180 days for both initial and reauthorization periods, with reauth due before the current one expires, and all services are subject to post-payment review. Units run in 15-minute increments with no published unit caps.',
          'Telehealth mechanics worth knowing (pre-HB-696 language, so expect tightening from August 2026): the GT modifier is usable on all RB-BHT codes for telehealth, and 97156/97157 are telephonic-billable with the KX modifier under caregiver-barrier criteria. LOCUS/CALOCUS is no longer required, but a standardized assessment tool is still expected.',
        ],
        cites: [
          { title: 'Trillium — Medicaid Child BH Services Benefit Plan (rev. 7/2026)', url: 'https://www.trilliumhealthresources.org/sites/default/files/docs/Benefit-Plans-Services-Definitions/Trillium-Medicaid-Child-BH-Benefit-Plan.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'Assessment + service order', desc: 'Written assessment, validated-tool diagnosis documentation, and the MD/DO/LP order — all required at the initial TAR.' },
      { title: 'Signatures', desc: 'Treatment plans need the LQASP and the legally responsible person\'s signatures.' },
      { title: 'Reauth calendar', desc: '180-day cycles with renewal due before expiry — put it on the calendar at intake.' },
      { title: 'Age', desc: 'Trillium\'s benefit plan covers adults too — don\'t screen out 21+ inquiries reflexively.' },
    ],
    sources: [
      { title: 'Trillium — Medicaid Child BH Services Benefit Plan', url: 'https://www.trilliumhealthresources.org/sites/default/files/docs/Benefit-Plans-Services-Definitions/Trillium-Medicaid-Child-BH-Benefit-Plan.pdf' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Trillium cover ABA therapy?', a: 'Yes — RB-BHT under CCP 8F, with a TAR (prior authorization) required for every code including telehealth delivery, in 180-day authorization cycles.' },
      { q: 'Does Trillium cover ABA for adults?', a: 'Its benefit plan lists RB-BHT for "Children, Adolescents and Adults," reflecting the 2021 State Plan Amendment that extended NC RB-BHT coverage past age 21.' },
      { q: 'Can Trillium ABA services be delivered by telehealth?', a: 'Historically yes with the GT modifier (and 97156/97157 telephonically with KX under caregiver-barrier criteria) — but HB 696\'s August 2026 rules restrict ABA telehealth significantly; verify current rules first.' },
    ],
  },

  'vaya-health': {
    slug: 'vaya-health',
    family: '',
    cardDesc: 'Western-NC Tailored Plan; 8F via SARs to Vaya UM — key documents must be pulled manually.',
    assessmentPA: 'Required — per 8F; Vaya publishes RB-BHT authorization guidelines (v2.0, eff. 9/2025) on its provider portal',
    treatmentPA: 'Required — service authorization requests (SARs) reviewed by Vaya UM against 8F medical necessity',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'Vaya Health (NC Tailored Plan)',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Vaya Health (NC)',
    h1: 'Vaya Health ABA coverage (NC Tailored Plan).',
    metaTitle: 'Vaya Health (NC Tailored Plan) ABA / RB-BHT Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Vaya Health (Vaya Total Care) administers NC Medicaid RB-BHT (ABA) in western North Carolina — CCP 8F administration through SARs to Vaya UM, and which plan documents to pull from the provider portal.',
    intro: [
      'Vaya Health — operating the "Vaya Total Care" Tailored Plan across western North Carolina — administers RB-BHT as straight CCP 8F, with authorization running through service authorization requests (SARs) to Vaya\'s in-house UM team. A transparency note: Vaya\'s provider-document library blocks automated access, so this guide covers the verified structure and contacts, and names the two plan documents your team should download directly before relying on plan-specific details.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Tailored Plan (public LME/MCO, western NC — "Vaya Total Care")' },
      { label: 'Clinical rules', value: 'CCP 8F; Vaya RB-BHT authorization guidelines v2.0 (eff. 9/2025)' },
      { label: 'Prior auth', value: 'Required — SARs to Vaya UM' },
      { label: 'UM contact', value: '(800) 893-6246 ext. 1513 · UM@vayahealth.com' },
      { label: 'Portal', value: 'providers.vayahealth.com' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor); Vaya publishes its own rate schedule' },
    ],
    sections: [
      {
        h2: 'How Vaya administers RB-BHT',
        body: [
          'The clinical picture is the CCP 8F baseline: PA on all services including the 97151 comprehensive assessment (which Vaya\'s guidelines designate as LQASP-billed), 180-day authorization cycles, and LQASP treatment-plan reviews. SARs submit through the provider portal and are reviewed by Vaya UM against medical necessity and the clinical coverage policy. Two documents to pull manually from providers.vayahealth.com and keep in your payer files: the "Authorization Guidelines: Medicaid RB-BHT for ASD" v2.0 (effective September 5, 2025) and the May 2025 RB-BHT guidance — both live in the plan\'s document library, which blocks automated retrieval.',
        ],
        cites: [
          { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
          { title: 'Vaya Health — prior authorization information (access via portal)', url: 'https://providers.vayahealth.com/authorization-information/prior-authorization/' },
        ],
      },
    ],
    collect: [
      { title: 'Member county', desc: 'Vaya\'s footprint is western NC — confirm the county maps to Vaya before intake.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per CCP 8F, with the MD/DO/LP service order.' },
      { title: 'Current Vaya guidelines', desc: 'Download the RB-BHT authorization guidelines (v2.0) from the portal and re-check quarterly.' },
    ],
    sources: [
      { title: 'Vaya Health — RB-BHT authorization guidelines v2.0 (pull manually; bot-blocked)', url: 'https://providers.vayahealth.com/wp-content/uploads/2025/09/Authorization_Guidelines_Medicaid_RB_BHT_ASD.pdf' },
      { title: 'Vaya Health — prior authorization page', url: 'https://providers.vayahealth.com/authorization-information/prior-authorization/' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Vaya Health cover ABA therapy?', a: 'Yes — as a Tailored Plan, Vaya administers RB-BHT under CCP 8F, with service authorization requests reviewed by its UM team ((800) 893-6246 ext. 1513, UM@vayahealth.com).' },
      { q: 'Where are Vaya\'s ABA-specific rules?', a: 'In its "Authorization Guidelines: Medicaid RB-BHT for ASD" (v2.0, effective September 2025) and its RB-BHT guidance, both in the provider portal\'s document library — download them directly, as the library blocks automated access.' },
    ],
  },

  'partners-health-management': {
    slug: 'partners-health-management',
    family: '',
    cardDesc: 'Tailored Plan with the ALL-codes authorization: one auth covers every RB-BHT code via ProAuth.',
    assessmentPA: 'Required — per adopted CCP 8F',
    treatmentPA: 'Required — one "ALL codes" authorization on the base code covers every RB-BHT code/modifier',
    dxRequired: 'Yes \u2014 ASD via a validated diagnostic tool; under-3s may start on a provisional diagnosis',
    payer: 'Partners Health Management (NC Tailored Plan)',
    state: 'NC', kind: 'medicaid-mco', parent: 'North Carolina Medicaid',
    pill: 'Payer Guide · Partners (NC)',
    h1: 'Partners Health Management ABA coverage (NC Tailored Plan).',
    metaTitle: 'Partners Health Management (NC Tailored Plan) ABA / RB-BHT Coverage | Carelu',
    metaDescription:
      'How Partners Health Management administers NC Medicaid RB-BHT (ABA) — CCP 8F adoption, the provider-friendly ALL-codes authorization model in ProAuth, and the recoupment caveat that comes with it.',
    intro: [
      'Partners Health Management, a Tailored Plan, adopts NC\'s clinical coverage policies outright for medical-necessity decisions — 8F included — and runs the most provider-friendly authorization model in the state: since October 2023, RB-BHT authorizations issue as "ALL codes," meaning one authorization on the base code covers every RB-BHT service code and modifier combination, telehealth included. The flexibility is real; so is the caveat that billing outside the approved treatment plan risks recoupment.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'NC Tailored Plan (public LME/MCO)' },
      { label: 'Clinical rules', value: 'CCP 8F adopted for medical-necessity decisions' },
      { label: 'Prior auth', value: 'Required — single ALL-codes authorization per member' },
      { label: 'Portal', value: 'ProAuth (base code as Primary Procedure Code on Prescreen)' },
      { label: 'UM contact', value: 'UMQuestions@partnersbhm.org' },
      { label: 'Rates', value: '≥100% of the NC Medicaid fee schedule (state floor)' },
    ],
    sections: [
      {
        h2: 'The ALL-codes authorization model',
        body: [
          'Instead of code-by-code authorizations, Partners issues one authorization covering all RB-BHT codes and modifiers: submit via ProAuth entering the base code as the Primary Procedure Code on the Prescreen and selecting the Treatment Type from the dropdown; authorizations are then visible in both ProAuth and Alpha. Operationally this means clinical teams can flex between assessment, direct treatment, supervision, and parent training without new requests — but every billed unit must still trace to the approved treatment plan, because Partners pairs the flexibility with post-payment review and recoupment for out-of-plan billing.',
          'Partners also runs an Autism Services Learning Collaborative for its network ABA providers, and its Tailored Plan documentation cross-references Carolina Complete Health policies through a Centene infrastructure partnership.',
        ],
        cites: [
          { title: 'Partners — RB-BHT authorizations transition to ALL codes (provider alert)', url: 'https://providers.partnersbhm.org/authorizations-for-research-based-behavioral-health-treatment-transition-to-all-codes/' },
          { title: 'Partners — Tailored Plan clinical coverage policies (adopts 8F)', url: 'https://www.partnersbhm.org/tailoredplan/providers/manuals-forms-and-policies/clinical-coverage-policies/' },
        ],
      },
    ],
    collect: [
      { title: 'Treatment-plan alignment', desc: 'The ALL-codes auth only protects billing that matches the approved plan — keep the plan current as services shift.' },
      { title: 'ASD diagnosis + validated tool', desc: 'Per adopted CCP 8F, with the MD/DO/LP service order.' },
      { title: 'ProAuth setup', desc: 'Base code on the Prescreen, Treatment Type from the dropdown — train the intake/billing handoff on it once.' },
    ],
    sources: [
      { title: 'Partners — Tailored Plan clinical coverage policies', url: 'https://www.partnersbhm.org/tailoredplan/providers/manuals-forms-and-policies/clinical-coverage-policies/' },
      { title: 'Partners — ALL-codes authorization provider alert', url: 'https://providers.partnersbhm.org/authorizations-for-research-based-behavioral-health-treatment-transition-to-all-codes/' },
      { title: 'NC Medicaid — Clinical Coverage Policy 8F', url: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open' },
    ],
    faq: [
      { q: 'Does Partners Health Management cover ABA therapy?', a: 'Yes — as a Tailored Plan it adopts CCP 8F for RB-BHT medical-necessity decisions, with prior authorization required per the state baseline.' },
      { q: 'What is the ALL-codes authorization?', a: 'Since October 2023, one Partners authorization on the base code covers all RB-BHT codes and modifiers — no code-by-code requests. Billing must still match the approved treatment plan or risk recoupment.' },
      { q: 'How do I submit an RB-BHT authorization to Partners?', a: 'Through ProAuth: enter the base code as the Primary Procedure Code on the Prescreen, select the Treatment Type from the dropdown. Questions go to UMQuestions@partnersbhm.org.' },
    ],
  },

  'aetna-north-carolina': {
    slug: 'aetna-north-carolina',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the N.C.G.S. § 58-3-192 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    dxRequired: 'Yes \u2014 ASD only (F84.0\u2013F84.9); ABA for other diagnoses considered experimental',
    payer: 'Aetna in North Carolina',
    state: 'NC', kind: 'commercial',
    pill: 'Payer Guide · Aetna · North Carolina',
    h1: 'Aetna ABA coverage in North Carolina: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in North Carolina: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for North Carolina families — the national clinical policy, prior authorization, the N.C.G.S. § 58-3-192 mandate (ages, caps, exemptions), North Carolina behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in North Carolina, a Aetna card means three layers at once: the carrier\'s national clinical policy, North Carolina\'s autism insurance mandate (N.C.G.S. § 58-3-192), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'N.C.G.S. § 58-3-192' },
      { label: 'Mandate age', value: 'May be limited to 18 and younger (parity-limited)' },
      { label: 'Mandate caps', value: '$40,000/yr cap, CPI-indexed (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small group; self-funded ERISA' },
      { label: 'Licensure', value: 'NC Licensed Behavior Analyst (NCBALB, since 2023)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in North Carolina',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in North Carolina is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in North Carolina.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The North Carolina mandate: what it guarantees (and doesn\'t)',
        body: [
          'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. Coverage may be limited to individuals 18 or younger and capped at $40,000/year (CPI-indexed from 2017). Two big carve-outs: the mandate does not apply to non-grandfathered individual and small-group plans (the ACA essential-health-benefits segment), and self-funded ERISA plans are exempt by preemption. The age and dollar limits are quantitative treatment limits of doubtful enforceability under MHPAEA for large-group plans.',
        ],
        cites: [
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No North Carolina-specific Aetna policy exists',
        body: [
          'We checked: Aetna publishes no North Carolina-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where North Carolina-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
        ],
      },
      {
        h2: 'Licensure & rates in North Carolina',
        body: [
          'North Carolina licenses behavior analysts under the Behavior Analyst Licensure Act (2021), with the NC Behavior Analyst Licensure Board accepting applications since July 2023 — ending the old regime where BCBAs worked under licensed-psychologist supervision. Commercial credentialing now runs on the LBA/LaBA license. On rates: Aetna does not publish commercial ABA fee schedules for North Carolina (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
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
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in North Carolina?', a: 'Yes — under the carrier\'s national policy for ASD, layered on North Carolina\'s mandate (N.C.G.S. § 58-3-192) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the North Carolina autism mandate require?', a: 'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in North Carolina?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the North Carolina Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-north-carolina': {
    slug: 'cigna-north-carolina',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the N.C.G.S. § 58-3-192 mandate layer.',
    assessmentPA: 'Not required for assessment codes 97151, 97152, 0362T (per national policy EN0499)',
    treatmentPA: 'Required — assessment + treatment plan with the ABA PA form (EN0499)',
    dxRequired: 'Yes \u2014 ASD only; Rett syndrome (F84.2) excluded under EN0499',
    payer: 'Cigna / Evernorth in North Carolina',
    state: 'NC', kind: 'commercial',
    pill: 'Payer Guide · Cigna · North Carolina',
    h1: 'Cigna / Evernorth ABA coverage in North Carolina: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in North Carolina: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for North Carolina families — the national clinical policy, prior authorization, the N.C.G.S. § 58-3-192 mandate (ages, caps, exemptions), North Carolina behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in North Carolina, a Cigna card means three layers at once: the carrier\'s national clinical policy, North Carolina\'s autism insurance mandate (N.C.G.S. § 58-3-192), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'N.C.G.S. § 58-3-192' },
      { label: 'Mandate age', value: 'May be limited to 18 and younger (parity-limited)' },
      { label: 'Mandate caps', value: '$40,000/yr cap, CPI-indexed (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small group; self-funded ERISA' },
      { label: 'Licensure', value: 'NC Licensed Behavior Analyst (NCBALB, since 2023)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in North Carolina',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in North Carolina is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in North Carolina.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The North Carolina mandate: what it guarantees (and doesn\'t)',
        body: [
          'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. Coverage may be limited to individuals 18 or younger and capped at $40,000/year (CPI-indexed from 2017). Two big carve-outs: the mandate does not apply to non-grandfathered individual and small-group plans (the ACA essential-health-benefits segment), and self-funded ERISA plans are exempt by preemption. The age and dollar limits are quantitative treatment limits of doubtful enforceability under MHPAEA for large-group plans.',
        ],
        cites: [
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'No North Carolina-specific Cigna policy exists',
        body: [
          'We checked: Cigna / Evernorth publishes no North Carolina-specific ABA policy, form, or supplement — the national policy plus the state mandate is the whole picture. That’s worth knowing in itself: it means benefits verification (plan funding type, mandate applicability, benefit limits) is where North Carolina-specific answers come from, not a carrier document.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in North Carolina',
        body: [
          'North Carolina licenses behavior analysts under the Behavior Analyst Licensure Act (2021), with the NC Behavior Analyst Licensure Board accepting applications since July 2023 — ending the old regime where BCBAs worked under licensed-psychologist supervision. Commercial credentialing now runs on the LBA/LaBA license. On rates: Cigna does not publish commercial ABA fee schedules for North Carolina (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
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
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in North Carolina?', a: 'Yes — under the carrier\'s national policy for ASD, layered on North Carolina\'s mandate (N.C.G.S. § 58-3-192) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the North Carolina autism mandate require?', a: 'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in North Carolina?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the North Carolina Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-north-carolina': {
    slug: 'unitedhealthcare-north-carolina',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the N.C.G.S. § 58-3-192 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    dxRequired: 'Yes \u2014 DSM-5-TR ASD confirmed with a validated tool (ADI-R, ADOS-2, etc.)',
    payer: 'UnitedHealthcare / Optum in North Carolina',
    state: 'NC', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · North Carolina',
    h1: 'UnitedHealthcare / Optum ABA coverage in North Carolina: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in North Carolina: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for North Carolina families — the national clinical policy, prior authorization, the N.C.G.S. § 58-3-192 mandate (ages, caps, exemptions), North Carolina behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in North Carolina, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, North Carolina\'s autism insurance mandate (N.C.G.S. § 58-3-192), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'N.C.G.S. § 58-3-192' },
      { label: 'Mandate age', value: 'May be limited to 18 and younger (parity-limited)' },
      { label: 'Mandate caps', value: '$40,000/yr cap, CPI-indexed (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Non-grandfathered individual/small group; self-funded ERISA' },
      { label: 'Licensure', value: 'NC Licensed Behavior Analyst (NCBALB, since 2023)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in North Carolina',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in North Carolina is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in North Carolina.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The North Carolina mandate: what it guarantees (and doesn\'t)',
        body: [
          'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. Coverage may be limited to individuals 18 or younger and capped at $40,000/year (CPI-indexed from 2017). Two big carve-outs: the mandate does not apply to non-grandfathered individual and small-group plans (the ACA essential-health-benefits segment), and self-funded ERISA plans are exempt by preemption. The age and dollar limits are quantitative treatment limits of doubtful enforceability under MHPAEA for large-group plans.',
        ],
        cites: [
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in North Carolina',
        body: [
          'A family saying “we have UnitedHealthcare” in North Carolina may actually be on the carrier’s Medicaid plan — UnitedHealthcare Community Plan of North Carolina — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in North Carolina',
        body: [
          'North Carolina licenses behavior analysts under the Behavior Analyst Licensure Act (2021), with the NC Behavior Analyst Licensure Board accepting applications since July 2023 — ending the old regime where BCBAs worked under licensed-psychologist supervision. Commercial credentialing now runs on the LBA/LaBA license. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for North Carolina (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of North Carolina (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'N.C. Gen. Stat. § 58-3-192 (autism coverage mandate)', url: 'https://codes.findlaw.com/nc/chapter-58-insurance/nc-gen-st-sect-58-3-192/' },
      { title: 'Autism Speaks — North Carolina state-regulated coverage', url: 'https://www.autismspeaks.org/north-carolina-state-regulated-insurance-coverage' },
      { title: 'North Carolina Behavior Analyst Licensure Board', url: 'https://ncbehavioranalystboard.org/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in North Carolina?', a: 'Yes — under the carrier\'s national policy for ASD, layered on North Carolina\'s mandate (N.C.G.S. § 58-3-192) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the North Carolina autism mandate require?', a: 'North Carolina’s mandate (effective July 2016) requires covered health benefit plans to cover “adaptive behavior treatment” — the statutory term; ABA itself isn’t named, but board certified behavior analysts are among the eight authorized provider categories, and treatment must be ordered by a licensed physician or licensed psychologist. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in North Carolina?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the North Carolina Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
