import type { PayerConfig } from './types';

export const virginiaPayers: Record<string, PayerConfig> = {
  'virginia-medicaid': {
    slug: 'virginia-medicaid',
    cardDesc: 'EPSDT under 21; NO auth on assessment codes, per-code unit SAs, licensure-tiered rates.',
    assessmentPA: 'Not required — assessment codes 97151, 97152, 0362T need no service authorization',
    treatmentPA: 'Required — all treatment hours; units itemized per CPT code (eff. 10/15/2025)',
    payer: 'Virginia Medicaid (DMAS)',
    state: 'VA', kind: 'state-medicaid',
    pill: 'Payer Guide · Virginia Medicaid',
    h1: 'Virginia Medicaid ABA coverage: the intake guide.',
    metaTitle: 'Virginia Medicaid (DMAS) ABA Coverage, Rates & Prior Auth Guide | Carelu',
    metaDescription:
      'How Virginia Medicaid (DMAS) covers ABA under EPSDT — no service authorization on assessment codes, per-code unit requests since October 2025, licensure-tiered fee-schedule rates, Acentra Health authorization, and the Cardinal Care MCO landscape.',
    intro: [
      'Virginia Medicaid, administered by DMAS, covers ABA for children under 21 through the EPSDT benefit — historically labeled "Behavioral Therapy" and now documented as ABA in the Mental Health Services manual\'s Appendix D. The structure is one of the more intake-friendly in our directory: assessment codes need no service authorization at all, so with an ASD diagnosis in hand you can book the assessment immediately. The rigor arrives at the treatment authorization, which since October 2025 must itemize units per CPT code. All five Cardinal Care MCOs run on the identical DMAS criteria and standardized forms — their guides below cover the per-plan mechanics.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — under 21, via EPSDT (no hard hour cap)' },
      { label: 'Assessment auth', value: 'NONE — 97151, 97152, 0362T need no service authorization' },
      { label: 'Treatment auth', value: 'Required — units per CPT code (eff. 10/15/2025, new DMAS form)' },
      { label: '20-hr threshold', value: 'Requests ≥20 hrs/week need an individualized activity schedule' },
      { label: 'Rates (per 15 min)', value: '97153: $15.00 tech · $23.48 LABA · $46.63 LBA (licensure tiers)' },
      { label: 'FFS auth vendor', value: 'Acentra Health (Atrezzo portal); MCOs run their own UM' },
    ],
    sections: [
      {
        h2: 'The intake-friendly part: no authorization on assessments',
        body: [
          'DMAS requires no service authorization for the assessment codes — 97151, 97152, and 0362T — a fact confirmed both in the Mental Health Services manual\'s Appendix D and in the fee file\'s own PA flags. For intake, that means the sequence can be: verify eligibility → book the assessment immediately → build the treatment request from the assessment. One post-pandemic constraint: initial assessments must be conducted in person.',
        ],
        cites: [
          { title: 'DMAS — MHS manual Appendix D (rev. 7/2025)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
          { title: 'DMAS — Project BRAVO ABA FAQ', url: 'https://www.dmas.virginia.gov/media/4271/project-bravo-services-faqs-aba.pdf' },
        ],
      },
      {
        h2: 'Treatment authorization',
        body: [
          'All treatment hours require service authorization with a predetermined number of units for each treatment procedure code. Effective for dates of service October 15, 2025 and later, requests — fee-for-service and every Cardinal Care MCO alike — must itemize units per ABA CPT code on the new DMAS standardized preservice form (no more bundling under 97155), so intake and clinical planning need to align on requested intensity code by code. Requests at or above 20 hours/week (80 units) must include an individualized schedule of activities, and continued-stay requests need an updated ISP plus graphical progress data. There is no hard hour cap — EPSDT medical necessity governs. Fee-for-service authorizations go through Acentra Health\'s Atrezzo portal; MCO members follow their plan\'s process.',
        ],
        cites: [
          { title: 'DMAS bulletin — ABA service authorization update (eff. 10/15/2025)', url: 'https://vamedicaid.dmas.virginia.gov/bulletin/service-authorization-update-applied-behavior-analysis-aba-effective-october-15-2025' },
          { title: 'DMAS — MHS manual Appendix D (rev. 7/2025)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
        ],
      },
      {
        h2: 'Rates: tiered by licensure, not setting',
        body: [
          'Virginia\'s fee schedule pays by practitioner licensure tier, flagged with modifiers: no modifier = technician, HN = Licensed Assistant Behavior Analyst (LABA), TF = LMHP, HO = Licensed Behavior Analyst (LBA). Per 15-minute unit (effective 12/1/2021 and still current in the July 2026 fee file): 97153 direct treatment pays $15.00 at the technician tier, $23.48 LABA, $39.40 LMHP, and $46.63 LBA; assessment and QHP codes (97151, 97155, 97156) pay $23.48 / $39.40 / $46.63 at the LABA / LMHP / LBA tiers. Who renders the service is therefore a first-order revenue variable in Virginia. One trap when reading the raw fee file: it also carries generic physician-fee rows for 97151 and 97156 at a few dollars per unit — those are the non-ABA schedule lines, not the ABA program rates.',
        ],
        cites: [
          { title: 'DMAS — procedure fee files (CPT), source of ABA rates', url: 'https://www.dmas.virginia.gov/for-providers/rates-and-rate-setting/procedure-fee-files-cpt-codes/' },
          { title: 'DMAS — ABA billing guidance (modifier tiers)', url: 'https://virginiaaba.org/wp-content/uploads/2021/11/ABA-Billing-Guidance-from-DMAS-Nov21.pdf' },
        ],
      },
      {
        h2: 'The Cardinal Care MCO landscape',
        body: [
          'Cardinal Care is the unified brand for Virginia Medicaid managed care, and a new single managed-care contract took effect July 1, 2025 — the same date Molina exited Virginia Medicaid (contract terminated 6/30/2025) and Humana Healthy Horizons entered, absorbing Molina\'s members. The five active MCOs — Aetna Better Health, Anthem HealthKeepers Plus, Humana Healthy Horizons, Sentara Community Plan, and UnitedHealthcare Community Plan — all apply the identical DMAS criteria and standardized ABA forms, so the per-plan differences are operational: portals, fax lines, credentialing paths, and UHC\'s Optum carve-out. Providers in every MCO network must also keep their DMAS PRSS enrollment current, and only Board of Medicine-licensed LBAs/LABAs can provide ABA within scope.',
        ],
        cites: [
          { title: 'VirginiaABA — July 1, 2025 Medicaid changes (Molina exit, Humana entry)', url: 'https://virginiaaba.org/july-1st-medicaid-changes-what-providers-need-to-know/' },
          { title: 'VirginiaABA — October 2025 Medicaid changes (per-code SAs)', url: 'https://virginiaaba.org/october-2025-medicaid-changes-what-providers-need-to-know/' },
        ],
      },
    ],
    collect: [
      { title: 'Member ID & Cardinal Care MCO', desc: 'Aetna, Anthem, Humana, Sentara, or UHC (or FFS) — same clinical rules, different submission machinery.' },
      { title: 'ASD diagnosis', desc: 'Diagnosis, the qualified professional who made it, and the date — then book the assessment; no auth needed.' },
      { title: 'Units per CPT code', desc: 'The treatment request itemizes intensity code by code — align intake and clinical planning early.' },
      { title: 'Weekly schedule (if ≥20 hrs)', desc: 'Requests at 80+ units/week need an individualized activity schedule.' },
      { title: 'Rendering practitioner tier', desc: 'LBA vs. LABA vs. technician determines the rate — staffing is a revenue decision.' },
    ],
    sources: [
      { title: 'DMAS — MHS manual Appendix D (ABA)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
      { title: 'DMAS — ABA service authorization update (eff. 10/15/2025)', url: 'https://vamedicaid.dmas.virginia.gov/bulletin/service-authorization-update-applied-behavior-analysis-aba-effective-october-15-2025' },
      { title: 'DMAS — procedure fee files (CPT)', url: 'https://www.dmas.virginia.gov/for-providers/rates-and-rate-setting/procedure-fee-files-cpt-codes/' },
      { title: 'DMAS — Project BRAVO ABA FAQ', url: 'https://www.dmas.virginia.gov/media/4271/project-bravo-services-faqs-aba.pdf' },
      { title: 'DMAS — service authorization (Acentra Health)', url: 'https://www.dmas.virginia.gov/for-providers/service-authorization/' },
    ],
    faq: [
      { q: 'Does Virginia Medicaid cover ABA therapy?', a: 'Yes — for members under 21 with autism, under the EPSDT benefit, with no hard hour cap. Assessment codes need no service authorization; all treatment hours are authorized with units itemized per CPT code.' },
      { q: 'Does the ABA assessment need prior authorization in Virginia?', a: 'No — 97151, 97152, and 0362T require no service authorization under DMAS rules (confirmed in the manual and the fee file\'s PA flags). Treatment codes do.' },
      { q: 'What does Virginia Medicaid pay for ABA?', a: 'Licensure-tiered rates per 15-minute unit: 97153 pays $15.00 (technician), $23.48 (LABA), $39.40 (LMHP), or $46.63 (LBA); assessment and QHP codes pay the LABA/LMHP/LBA tiers. Modifiers HN/TF/HO flag the tier.' },
      { q: 'Which MCOs run Virginia Medicaid ABA?', a: 'Aetna Better Health, Anthem HealthKeepers Plus, Humana Healthy Horizons (which replaced Molina on July 1, 2025), Sentara Community Plan, and UnitedHealthcare Community Plan — all on identical DMAS criteria and forms.' },
    ],
  },

  'aetna-better-health-virginia': {
    slug: 'aetna-better-health-virginia',
    family: 'aetna',
    cardDesc: 'DMAS forms/criteria via Availity; the auth lives on the LBA\'s NPI — changes need a new auth.',
    assessmentPA: 'Not required — DMAS rule: assessment codes 97151, 97152, 0362T need no service authorization',
    treatmentPA: 'Required — DMAS standardized initial/continued-stay forms via Availity or fax (833) 757-1583',
    payer: 'Aetna Better Health of Virginia',
    state: 'VA', kind: 'medicaid-mco', parent: 'Virginia Medicaid (DMAS)',
    pill: 'Payer Guide · Aetna Better Health (VA)',
    h1: 'Aetna Better Health of Virginia ABA coverage (Cardinal Care MCO).',
    metaTitle: 'Aetna Better Health of Virginia ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Aetna Better Health administers Virginia Medicaid ABA — DMAS standardized forms and criteria, Availity submission, the NPI-matching authorization rule, and credentialing via DMAS PRSS.',
    intro: [
      'Aetna Better Health of Virginia administers the Cardinal Care ABA benefit on DMAS\'s standardized forms and criteria — Aetna\'s national commercial ABA policy (CPB 0554) does not apply here. The plan-specific layer is operational, and one rule dominates it: the authorization is tied to the rendering LBA/LMHP\'s NPI, and changing the rendering provider closes the existing auth and requires a new one. Staff turnover is an authorization event at this plan.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Cardinal Care MCO (Aetna Medicaid)' },
      { label: 'Clinical rules', value: 'DMAS criteria + standardized MHS ABA forms (not CPB 0554)' },
      { label: 'Assessment auth', value: 'None — DMAS assessment codes are auth-free' },
      { label: 'Submission', value: 'Availity (preferred) or fax (833) 757-1583' },
      { label: 'NPI rule', value: 'Auth tied to the rendering LBA/LMHP NPI; changes need a NEW auth' },
      { label: 'Appeals', value: 'Peer-to-peer reconsideration within 7 calendar days of denial' },
    ],
    sections: [
      {
        h2: 'How Aetna Better Health runs ABA authorization',
        body: [
          'Treatment requests use the DMAS standardized MHS ABA initial and continued-stay forms, submitted through Availity (the plan\'s preferred channel) or by fax to (833) 757-1583, with the DMAS rules — per-code units, the 20-hour activity-schedule threshold — applying as everywhere in Cardinal Care. Details that bounce submissions: signature-font e-signatures are rejected on SA forms, and a blank discharge-date field counts as an incomplete submission. After a medical-necessity denial, the peer-to-peer reconsideration window is 7 calendar days — short enough that intake should flag denials to clinical leadership same-day.',
          'The NPI-matching rule deserves process design: the authorization lives on the supervising LBA/LMHP\'s NPI and must match the claim\'s rendering NPI, no exceptions. When a case transfers between supervisors, request the new authorization before the transition, not after the first denied claim.',
        ],
        cites: [
          { title: 'Aetna Better Health VA — ABA provider collaboration deck', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/virginia/provider/pdf/abhva_applied_behavioral_analysis_providers.pdf' },
        ],
      },
      {
        h2: 'Credentialing & billing basics',
        body: [
          'Enroll with DMAS through the PRSS portal and select Aetna, then email the plan\'s provider-relations team (AetnaBetterHealth-VAProviderRelations@Aetna.com) to trigger credentialing. Telehealth follows state policy (GT modifier). Timely filing runs 365 days, EDI payer ID 128VA.',
        ],
        cites: [
          { title: 'Aetna Better Health VA — prior authorization page', url: 'https://www.aetnabetterhealth.com/virginia/providers/prior-authorization.html' },
        ],
      },
    ],
    collect: [
      { title: 'Supervising LBA/LMHP NPI', desc: 'The auth binds to it — track it per case, and treat supervisor changes as authorization events.' },
      { title: 'ASD diagnosis', desc: 'Then book the assessment — no authorization needed on assessment codes.' },
      { title: 'Complete SA forms', desc: 'Wet-style signatures and filled discharge-date fields — the two known bounce reasons.' },
      { title: 'Units per CPT code', desc: 'Per the DMAS 10/15/2025 rule, intensity is requested code by code.' },
    ],
    sources: [
      { title: 'Aetna Better Health VA — ABA provider collaboration deck', url: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/virginia/provider/pdf/abhva_applied_behavioral_analysis_providers.pdf' },
      { title: 'Aetna Better Health VA — prior authorization page', url: 'https://www.aetnabetterhealth.com/virginia/providers/prior-authorization.html' },
      { title: 'DMAS — MHS manual Appendix D (ABA)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
    ],
    faq: [
      { q: 'Does Aetna Better Health of Virginia cover ABA?', a: 'Yes — on DMAS\'s EPSDT criteria and standardized forms (Aetna\'s commercial CPB 0554 policy doesn\'t apply). Assessment codes need no authorization; treatment codes do, via Availity or fax.' },
      { q: 'What happens if our supervising BCBA changes mid-authorization?', a: 'The authorization is tied to the rendering LBA/LMHP\'s NPI — a change closes the existing auth and requires a new one. Request it before the transition to avoid denied claims.' },
      { q: 'How do I join Aetna Better Health VA\'s network?', a: 'Enroll with DMAS via the PRSS portal, select Aetna, then email AetnaBetterHealth-VAProviderRelations@Aetna.com to start credentialing.' },
    ],
  },

  'anthem-healthkeepers-plus': {
    slug: 'anthem-healthkeepers-plus',
    family: 'anthem',
    cardDesc: 'DMAS forms via Availity/ICR; publishes the clearest code/modifier/POS grid in Virginia.',
    assessmentPA: 'Not required — published grid confirms no SA on 97151, 97152, 0362T',
    treatmentPA: 'Required — 97153–97158, 0373T on DMAS standardized forms; ≥20 hrs/wk needs the activity schedule',
    payer: 'Anthem HealthKeepers Plus (VA)',
    state: 'VA', kind: 'medicaid-mco', parent: 'Virginia Medicaid (DMAS)',
    pill: 'Payer Guide · Anthem HealthKeepers Plus',
    h1: 'Anthem HealthKeepers Plus ABA coverage (Cardinal Care MCO).',
    metaTitle: 'Anthem HealthKeepers Plus (VA Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Anthem HealthKeepers Plus administers Virginia Medicaid ABA — DMAS standardized forms and criteria, the published code/modifier/POS grid, telehealth and school place-of-service rules, and Availity submission.',
    intro: [
      'Anthem HealthKeepers Plus administers Virginia\'s Cardinal Care ABA benefit on the DMAS standardized forms — its own initial SA form carries the DMAS header and admission criteria verbatim. What Anthem uniquely contributes is clarity: a published code/modifier/place-of-service grid that answers the billing questions other plans leave to trial and error, including telehealth combinations and school-setting rules.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Cardinal Care MCO (HealthKeepers, Inc.)' },
      { label: 'Clinical rules', value: 'DMAS criteria + standardized forms, verbatim' },
      { label: 'Assessment auth', value: 'None — grid confirms 97151, 97152, 0362T auth-free' },
      { label: 'Submission', value: 'Availity Essentials / Interactive Care Reviewer' },
      { label: 'Telehealth', value: 'GT combos payable on 97151, 97153, 97155, 97156 et al.' },
      { label: 'School setting', value: 'POS 03 allowed for 97151, 97155, 97156' },
    ],
    sections: [
      {
        h2: 'The grid worth bookmarking',
        body: [
          'Anthem\'s February 2023 provider bulletin publishes the full ABA code/modifier/place-of-service grid: no service authorization on 97151, 97152, and 0362T; SA required on 97153–97158 and 0373T; GT telehealth combinations payable on the assessment, direct-treatment, and family-training codes; and school as an allowed place of service (POS 03) for 97151, 97155, and 97156 — useful for IEP-adjacent care coordination. The initial SA form requires an LMHP-level attestation signature and a listing of all ABA or behavior-therapy treatment episodes from the past 12 months across all providers — so prior-treatment history is an intake question, not a billing afterthought.',
        ],
        cites: [
          { title: 'Anthem VA — ABA requirements bulletin (code/modifier/POS grid)', url: 'https://providers.anthem.com/docs/gpp/VA_CAID_ABARequirements.pdf?v=202302021327' },
          { title: 'Anthem VA — ABA initial SA request form (DMAS standardized)', url: 'https://providers.anthem.com/docs/gpp/VA_CCC_BH_ABA_InitialStay.pdf?v=202301010312' },
        ],
      },
      {
        h2: 'Submission mechanics',
        body: [
          'Behavioral-health authorizations submit digitally through Availity Essentials\' Interactive Care Reviewer; provider services runs at (800) 901-0020. The DMAS rules apply unchanged: per-code unit requests since October 2025, the ≥20-hours/week activity-schedule requirement (stated on Anthem\'s own form), and the under-21 EPSDT scope in effect since December 2021.',
        ],
        cites: [
          { title: 'Anthem VA — provider news: ABA authorization submission changes', url: 'https://providernews.anthem.com/virginia/articles/important-changes-to-applied-behavioral-analysis-aba-authori-26746' },
        ],
      },
    ],
    collect: [
      { title: 'Prior ABA episodes (12 months)', desc: 'The initial SA form requires them across all providers — ask at intake.' },
      { title: 'ASD diagnosis', desc: 'Then book the assessment — no authorization needed on assessment codes.' },
      { title: 'Setting preferences', desc: 'School delivery is billable for select codes (POS 03) — capture the school picture.' },
      { title: 'LMHP attestation', desc: 'The initial SA needs an LMHP/LMHP-R/S/RP signature — line it up before submission.' },
    ],
    sources: [
      { title: 'Anthem VA — ABA requirements bulletin (Feb 2023)', url: 'https://providers.anthem.com/docs/gpp/VA_CAID_ABARequirements.pdf?v=202302021327' },
      { title: 'Anthem VA — ABA initial SA request form', url: 'https://providers.anthem.com/docs/gpp/VA_CCC_BH_ABA_InitialStay.pdf?v=202301010312' },
      { title: 'DMAS — MHS manual Appendix D (ABA)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
    ],
    faq: [
      { q: 'Does Anthem HealthKeepers Plus cover ABA?', a: 'Yes — Virginia\'s Cardinal Care ABA benefit on DMAS criteria and standardized forms: no authorization on assessment codes, SA on treatment codes 97153–97158 and 0373T, submitted via Availity\'s Interactive Care Reviewer.' },
      { q: 'Does Anthem HealthKeepers Plus cover ABA by telehealth or in schools?', a: 'Its published grid pays GT telehealth combinations on 97151, 97153, 97155, and 97156, and allows school as a place of service (POS 03) for 97151, 97155, and 97156.' },
    ],
  },

  'humana-healthy-horizons-virginia': {
    slug: 'humana-healthy-horizons-virginia',
    family: 'humana',
    cardDesc: 'Virginia\'s newest MCO (7/2025, ex-Molina members); DMAS forms, one PA-list quirk on 0362T.',
    assessmentPA: 'Not required for 97151/97152 (off the PA list) — but Humana\'s list does flag 0362T, unlike DMAS',
    treatmentPA: 'Required — 97153–97158, 0373T per the plan\'s PA list (eff. 7/1/2025), on DMAS standardized forms',
    payer: 'Humana Healthy Horizons in Virginia',
    state: 'VA', kind: 'medicaid-mco', parent: 'Virginia Medicaid (DMAS)',
    pill: 'Payer Guide · Humana Healthy Horizons (VA)',
    h1: 'Humana Healthy Horizons in Virginia ABA coverage (Cardinal Care MCO).',
    metaTitle: 'Humana Healthy Horizons Virginia ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Humana Healthy Horizons administers Virginia Medicaid ABA — the July 2025 entry replacing Molina, DMAS standardized forms, the PA list\'s 0362T quirk, and credentialing for the new network.',
    intro: [
      'Humana Healthy Horizons is Virginia\'s newest Cardinal Care MCO: it entered July 1, 2025, the day after DMAS terminated Molina\'s contract, and absorbed Molina\'s members automatically. Like the other four plans it runs ABA on DMAS criteria and standardized forms — but as a new plan it comes with fresh credentialing, transition-honored authorizations, and one genuine quirk on its PA list worth knowing.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Cardinal Care MCO — entered 7/1/2025, replacing Molina' },
      { label: 'Clinical rules', value: 'DMAS criteria + standardized service-specific forms' },
      { label: 'Assessment auth', value: '97151/97152 PA-free; 0362T IS on Humana\'s PA list (plan quirk)' },
      { label: 'Transition', value: 'Molina members auto-moved; prior auths honored ≥30 days post-transition' },
      { label: 'BH contact', value: 'VA_BH_Medicaid@humana.com; Availity portal' },
      { label: 'Access standard', value: 'BH appointment within 5 business days of coverage determination' },
    ],
    sections: [
      {
        h2: 'The transition, and what it means for intake',
        body: [
          'Former Molina members transitioned to Humana automatically on July 1, 2025 (with a 90-day plan-change window through September 30, 2025), and existing service authorizations were honored for at least 30 days past the transition. By now any Molina-era authorization has cycled through Humana\'s own process — but member cards, portal registrations, and stale directory listings can still say Molina, so verify plan identity on every "Molina" inquiry. Providers contract and credential through VA_BH_Medicaid@humana.com, keeping DMAS PRSS enrollment current, and the plan\'s behavioral-health access standard commits to an appointment within 5 business days of a coverage-criteria determination.',
        ],
        cites: [
          { title: 'VirginiaABA — July 1, 2025 Medicaid changes', url: 'https://virginiaaba.org/july-1st-medicaid-changes-what-providers-need-to-know/' },
          { title: 'Humana Healthy Horizons VA — BH provider resource guide', url: 'https://assets.humana.com/is/content/humana/VA_BH_Provider_Resource_Guidepdf' },
        ],
      },
      {
        h2: 'The PA list, including the 0362T quirk',
        body: [
          'Humana\'s Virginia PA and notification list (effective 7/1/2025) requires prior authorization on 97153–97158 and 0373T, with 97151 and 97152 correctly PA-free per the DMAS baseline. The quirk: the list also flags 0362T — a code DMAS treats as an authorization-free assessment code — as PA-required. If your assessments use 0362T for Humana members, request the authorization rather than litigating the discrepancy on the back end, and note the DMAS rule in the request.',
        ],
        cites: [
          { title: 'Humana Healthy Horizons VA — PA and notification list (eff. 7/1/2025)', url: 'https://assets.humana.com/is/content/humana/VA%20Medicaid%20PALpdf' },
        ],
      },
    ],
    collect: [
      { title: 'Plan identity on "Molina" inquiries', desc: 'Molina exited 6/30/2025 — those members are Humana now; verify the current card.' },
      { title: 'ASD diagnosis', desc: 'Then book the assessment — 97151/97152 need no authorization (0362T does, per Humana\'s list).' },
      { title: 'Units per CPT code', desc: 'The DMAS 10/15/2025 per-code rule applies to Humana requests.' },
      { title: 'Credentialing status', desc: 'New network — confirm your contracting/credentialing is complete before quoting start dates.' },
    ],
    sources: [
      { title: 'Humana Healthy Horizons VA — PA and notification list', url: 'https://assets.humana.com/is/content/humana/VA%20Medicaid%20PALpdf' },
      { title: 'Humana Healthy Horizons VA — BH provider resource guide', url: 'https://assets.humana.com/is/content/humana/VA_BH_Provider_Resource_Guidepdf' },
      { title: 'VirginiaABA — July 1, 2025 Medicaid changes', url: 'https://virginiaaba.org/july-1st-medicaid-changes-what-providers-need-to-know/' },
    ],
    faq: [
      { q: 'Does Humana Healthy Horizons in Virginia cover ABA?', a: 'Yes — it administers the Cardinal Care ABA benefit on DMAS criteria and standardized forms, having entered Virginia on July 1, 2025 as Molina\'s replacement.' },
      { q: 'What happened to Molina members in Virginia?', a: 'DMAS terminated Molina\'s contract effective June 30, 2025; members auto-transitioned to Humana with a 90-day plan-change window and authorizations honored at least 30 days. Verify plan identity on any inquiry that mentions Molina.' },
      { q: 'Does Humana require PA on ABA assessments?', a: 'Not on 97151/97152 — but unlike DMAS, its PA list flags 0362T as PA-required. Request the auth for 0362T rather than assuming the state rule carries.' },
    ],
  },

  'sentara-community-plan': {
    slug: 'sentara-community-plan',
    family: '',
    cardDesc: 'First to post the new DMAS units-per-code form; dedicated BCBA-change workflow, PAL lookup tool.',
    assessmentPA: 'Not required — DMAS rule; Sentara\'s ABA forms cover treatment codes only',
    treatmentPA: 'Required — new DMAS preservice form (posted for DOS 9/1/2025+); fax (844) 895-3231',
    payer: 'Sentara Community Plan (VA)',
    state: 'VA', kind: 'medicaid-mco', parent: 'Virginia Medicaid (DMAS)',
    pill: 'Payer Guide · Sentara Community Plan',
    h1: 'Sentara Community Plan ABA coverage (Cardinal Care MCO).',
    metaTitle: 'Sentara Community Plan (VA Medicaid) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How Sentara Community Plan (formerly Optima/Virginia Premier) administers Virginia Medicaid ABA — the new DMAS units-per-code preservice form, fax and portal channels, the BCBA change-request workflow, and the PAL lookup tool.',
    intro: [
      'Sentara Community Plan — the Cardinal Care MCO formed from Optima Family Care and Virginia Premier — runs ABA as a pure pass-through of DMAS forms and criteria, and it was the first plan to post the new DMAS units-per-code preservice form (for dates of service September 1, 2025 onward, ahead of the statewide October 15 mandate). Its plan-specific value is workflow tooling: dedicated fax lines, a PA lookup tool, and a standing BCBA change-request form that most plans lack.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Cardinal Care MCO (ex-Optima Family Care / Virginia Premier)' },
      { label: 'Clinical rules', value: 'DMAS criteria + standardized forms, verbatim' },
      { label: 'Assessment auth', value: 'None — DMAS assessment codes are auth-free' },
      { label: 'Submission', value: 'Provider portal or BH fax (844) 895-3231 / (757) 963-9620' },
      { label: 'Supervisor changes', value: 'Dedicated BCBA Change Request Form (upd. 3/2026)' },
      { label: 'PA lookup', value: 'pal.sentarahealthplans.com' },
    ],
    sections: [
      {
        h2: 'How Sentara runs ABA authorization',
        body: [
          'Treatment requests use the DMAS preservice service-authorization form — the units-per-code version Sentara posted for dates of service September 1, 2025 and after — plus the matching continued-stay form. The form itself embeds the DMAS rules: units requested per CPT code, and the 20-hours/80-units threshold that triggers the individualized activity schedule. Its worked example models 2 hours/day × 5 days × 24 weeks — roughly 6-month authorization spans as the norm. Non-urgent behavioral-health authorizations fax to (844) 895-3231 or (757) 963-9620 (effective August 2025); behavioral-health provider services runs at (757) 552-7174 / (800) 648-8420, and the PAL lookup tool at pal.sentarahealthplans.com answers code-level questions.',
          'Two housekeeping notes: directory entries under "Optima" are stale — it\'s all Sentara Community Plan under Cardinal Care now — and supervisor changes have their own administrative workflow via the BCBA Change Request Form (updated March 2026), so a supervising-BCBA transition is paperwork, not a new authorization battle.',
        ],
        cites: [
          { title: 'Sentara — BH prior authorization forms for government plans', url: 'https://www.sentarahealthplans.com/en/providers/claims-authorizations/authorizations/behavioral-health/government' },
          { title: 'Sentara — DMAS ABA preservice SA request form (DOS 9/1/2025+)', url: 'https://shc-p-001.sitecorecontenthub.cloud/api/public/content/c4fe04b9052647fb8655708609cc9e7f?v=4adf8dd1' },
          { title: 'Sentara — BH authorization fax numbers and forms update (eff. 8/1/2025)', url: 'https://www.sentarahealthplans.com/en/providers/updates/behavioral-health-authorization-fax-numbers-and-forms' },
        ],
      },
    ],
    collect: [
      { title: 'ASD diagnosis', desc: 'Then book the assessment — no authorization needed on assessment codes.' },
      { title: 'Units per CPT code', desc: 'Sentara\'s form is the units-per-code template — plan intensity code by code.' },
      { title: 'Weekly schedule (if ≥20 hrs)', desc: 'The 80-unit threshold triggers the activity-schedule requirement, embedded in the form.' },
      { title: 'Supervising BCBA on file', desc: 'Use the BCBA Change Request Form when supervision changes — don\'t let claims hit a stale name.' },
    ],
    sources: [
      { title: 'Sentara — BH prior authorization forms (government plans)', url: 'https://www.sentarahealthplans.com/en/providers/claims-authorizations/authorizations/behavioral-health/government' },
      { title: 'Sentara — DMAS ABA preservice SA form (DOS 9/1/2025+)', url: 'https://shc-p-001.sitecorecontenthub.cloud/api/public/content/c4fe04b9052647fb8655708609cc9e7f?v=4adf8dd1' },
      { title: 'DMAS — ABA service authorization update (eff. 10/15/2025)', url: 'https://vamedicaid.dmas.virginia.gov/bulletin/service-authorization-update-applied-behavior-analysis-aba-effective-october-15-2025' },
    ],
    faq: [
      { q: 'Does Sentara Community Plan cover ABA?', a: 'Yes — Virginia\'s Cardinal Care ABA benefit on DMAS criteria and forms: no authorization on assessment codes, treatment authorized with units per CPT code on the new DMAS preservice form.' },
      { q: 'Is Optima Family Care the same as Sentara Community Plan?', a: 'Yes — Optima Family Care and Virginia Premier merged into Sentara Community Plan under the Cardinal Care rebrand. Anything still labeled Optima is stale.' },
      { q: 'How do I change the supervising BCBA on a Sentara authorization?', a: 'Use the plan\'s dedicated BCBA Change Request Form (updated March 2026) — a standing administrative workflow rather than a new authorization.' },
    ],
  },

  'unitedhealthcare-community-plan-virginia': {
    slug: 'unitedhealthcare-community-plan-virginia',
    family: 'unitedhealthcare',
    cardDesc: 'DMAS criteria with ABA carved to Optum: Provider Express submission, separate credentialing.',
    assessmentPA: 'Not required — DMAS rule; assessment codes are auth-free',
    treatmentPA: 'Required — DMAS service-specific forms, submitted via fax or Provider Express (not the standard UHC PA tool)',
    payer: 'UnitedHealthcare Community Plan of Virginia',
    state: 'VA', kind: 'medicaid-mco', parent: 'Virginia Medicaid (DMAS)',
    pill: 'Payer Guide · UHC Community Plan (VA)',
    h1: 'UnitedHealthcare Community Plan of Virginia ABA coverage (Cardinal Care MCO).',
    metaTitle: 'UHC Community Plan Virginia (Cardinal Care) ABA Coverage & Prior Auth | Carelu',
    metaDescription:
      'How UnitedHealthcare Community Plan administers Virginia Medicaid ABA — DMAS criteria and service-specific forms with the behavioral benefit carved to Optum, Provider Express submission, and separate credentialing.',
    intro: [
      'UnitedHealthcare Community Plan of Virginia applies the same DMAS criteria and service-specific forms as every Cardinal Care MCO — its provider manual says so directly — but routes the work through Optum Behavioral Health. ABA is the one service its PA list steers away from the standard UHC authorization tool: submissions go by fax or through Optum\'s Provider Express portal, and ABA credentialing runs through the Optum network rather than UHC medical.',
    ],
    atGlance: [
      { label: 'Plan type', value: 'Cardinal Care MCO (BH administered by Optum)' },
      { label: 'Clinical rules', value: 'DMAS criteria + service-specific forms (not Optum\'s national ABA guideline)' },
      { label: 'Assessment auth', value: 'None — DMAS assessment codes are auth-free' },
      { label: 'Submission', value: 'Fax or Provider Express — not the standard UHC PA&N tool' },
      { label: 'Credentialing', value: 'Optum network via providerexpress.com, plus DMAS PRSS' },
      { label: 'Phone', value: '(844) 284-0146' },
    ],
    sections: [
      {
        h2: 'The Optum layer on a DMAS base',
        body: [
          'The 2026 provider manual is explicit that all mental-health services — ABA included — require registration or authorization using a DMAS service-specific form, which keeps the clinical criteria identical statewide; Optum\'s national ABA guideline does not override the Virginia rules. What Optum changes is the plumbing: the Cardinal Care PA requirements list (effective March 2025) singles ABA out for submission "via fax or Provider Express," bypassing the standard UHC Provider Portal PA&N tool, and ABA providers credential through Optum\'s network at providerexpress.com (plus mandatory DMAS PRSS enrollment). No referral is needed for outpatient behavioral health, and the manual publishes urgent-versus-standard authorization turnaround tables worth setting family expectations against.',
        ],
        cites: [
          { title: 'UHC Community Plan VA — PA requirements (eff. 3/1/2025)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/va/prior-authorization-and-notification/VA-UHCCP-Prior-Authorization-Effective-3-1-2025.pdf' },
          { title: 'UHC Community Plan of Virginia — 2026 provider manual (BH chapter)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/admin-guides/comm-plan/VA-UHCCP-Care-Provider-Manual.pdf' },
        ],
      },
    ],
    collect: [
      { title: 'ASD diagnosis', desc: 'Then book the assessment — no authorization needed on assessment codes.' },
      { title: 'Units per CPT code', desc: 'DMAS\'s per-code rule applies; submit on the DMAS service-specific form.' },
      { title: 'Optum credentialing status', desc: 'ABA runs on the Optum network — separate from UHC medical, plus DMAS PRSS.' },
      { title: 'Submission channel', desc: 'Fax or Provider Express for ABA — not the standard UHC PA&N tool.' },
    ],
    sources: [
      { title: 'UHC Community Plan VA — PA requirements (eff. 3/1/2025)', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/va/prior-authorization-and-notification/VA-UHCCP-Prior-Authorization-Effective-3-1-2025.pdf' },
      { title: 'UHC Community Plan of Virginia — 2026 provider manual', url: 'https://www.uhcprovider.com/content/dam/provider/docs/public/admin-guides/comm-plan/VA-UHCCP-Care-Provider-Manual.pdf' },
      { title: 'DMAS — MHS manual Appendix D (ABA)', url: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare Community Plan of Virginia cover ABA?', a: 'Yes — on DMAS criteria and service-specific forms, with the behavioral benefit administered by Optum. Assessment codes need no authorization; treatment authorizations go by fax or Provider Express.' },
      { q: 'Do I use the standard UHC portal for Virginia ABA authorizations?', a: 'No — the plan\'s PA list routes ABA specifically to fax or Optum\'s Provider Express, unlike its other services.' },
      { q: 'What credentialing does UHC Virginia ABA require?', a: 'Optum behavioral-network credentialing via providerexpress.com plus DMAS PRSS enrollment — a different path than UHC medical.' },
    ],
  },

  'aetna-virginia': {
    slug: 'aetna-virginia',
    family: 'aetna',
    cardDesc: 'CPB 0554 (ABA) + CPB 0648 (ASD) + the Va. Code § 38.2-3418.17 mandate layer.',
    assessmentPA: 'Required — precertification (form GR-69017-4), per Aetna\'s national CPB 0554 policy',
    treatmentPA: 'Required — precertification; reauthorization commonly ~6 months (verify per plan)',
    payer: 'Aetna in Virginia',
    state: 'VA', kind: 'commercial',
    pill: 'Payer Guide · Aetna · Virginia',
    h1: 'Aetna ABA coverage in Virginia: the intake guide.',
    metaTitle: 'Aetna ABA Coverage in Virginia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Aetna covers ABA for Virginia families — the national clinical policy, prior authorization, the Va. Code § 38.2-3418.17 mandate (ages, caps, exemptions), Virginia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Virginia, a Aetna card means three layers at once: the carrier\'s national clinical policy, Virginia\'s autism insurance mandate (Va. Code § 38.2-3418.17), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Aetna policy' },
      { label: 'State mandate', value: 'Va. Code § 38.2-3418.17' },
      { label: 'Mandate age', value: 'Any age (since 1/1/2020, HB 2577)' },
      { label: 'Mandate caps', value: '$35,000/yr ABA cap in statute (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Short-term/limited policies; self-funded ERISA' },
      { label: 'Licensure', value: 'VA Licensed Behavior Analyst (Board of Medicine)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Virginia',
        body: [
          'Aetna covers ABA for autism spectrum disorder under its national clinical policy CPB 0554 (paired with CPB 0648 for ASD), and considers ABA experimental for anything else. Precertification is required for both the assessment and treatment — form GR-69017-4, submitted via Availity or phone — with reauthorization commonly on a roughly 6-month cadence. That clinical policy is national — what changes in Virginia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Aetna guide; this page covers what changes in Virginia.',
        ],
        cites: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
        ],
      },
      {
        h2: 'The Virginia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. ABA is subject to an annual maximum benefit of $35,000 unless the insurer elects more (still in the current statute), must be provided or supervised by a behavior analyst licensed by the Board of Medicine, and the prescriber must be independent of the ABA provider. Self-funded ERISA plans are exempt by preemption, and the $35K cap is a quantitative limit of doubtful MHPAEA enforceability for large-group plans.',
        ],
        cites: [
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'Aetna Medicaid in Virginia',
        body: [
          'A family saying “we have Aetna” in Virginia may actually be on the carrier’s Medicaid plan — Aetna Better Health of Virginia — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Virginia',
        body: [
          'Virginia requires a Board of Medicine license to practice as a behavior analyst (Va. Code § 54.1-2957.16, built on BACB certification) — and the mandate itself conditions ABA coverage on delivery or supervision by a licensed behavior analyst, so licensure is a coverage requirement, not just a credentialing one. On rates: Aetna does not publish commercial ABA fee schedules for Virginia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. Aetna Better Health of Virginia (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Aetna CPB 0554 — Applied Behavior Analysis', url: 'https://www.aetna.com/cpb/medical/data/500_599/0554.html' },
      { title: 'Aetna CPB 0648 — Autism Spectrum Disorders', url: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html' },
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
    ],
    faq: [
      { q: 'Does Aetna cover ABA therapy in Virginia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Virginia\'s mandate (Va. Code § 38.2-3418.17) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Virginia autism mandate require?', a: 'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Aetna pay for ABA in Virginia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Virginia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'cigna-virginia': {
    slug: 'cigna-virginia',
    family: 'cigna',
    cardDesc: 'EN0499 + autism resource guide + the Va. Code § 38.2-3418.17 mandate layer.',
    payer: 'Cigna / Evernorth in Virginia',
    state: 'VA', kind: 'commercial',
    pill: 'Payer Guide · Cigna · Virginia',
    h1: 'Cigna / Evernorth ABA coverage in Virginia: the intake guide.',
    metaTitle: 'Cigna ABA Coverage in Virginia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How Cigna / Evernorth covers ABA for Virginia families — the national clinical policy, prior authorization, the Va. Code § 38.2-3418.17 mandate (ages, caps, exemptions), Virginia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Virginia, a Cigna card means three layers at once: the carrier\'s national clinical policy, Virginia\'s autism insurance mandate (Va. Code § 38.2-3418.17), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order. One Virginia-sized caveat up front: Cigna’s national EN0499 policy explicitly does not apply to Virginia fully-insured business, so the usual no-assessment-PA fast path can’t be assumed until you know the plan’s funding type.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national Cigna policy' },
      { label: 'State mandate', value: 'Va. Code § 38.2-3418.17' },
      { label: 'Mandate age', value: 'Any age (since 1/1/2020, HB 2577)' },
      { label: 'Mandate caps', value: '$35,000/yr ABA cap in statute (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Short-term/limited policies; self-funded ERISA' },
      { label: 'Licensure', value: 'VA Licensed Behavior Analyst (Board of Medicine)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Virginia',
        body: [
          'Cigna (through Evernorth Behavioral Health) covers ABA for autism under national policy EN0499 with one of the friendliest front doors in the industry: no prior authorization on assessment codes 97151, 97152, and 0362T. The rigor arrives at the treatment step, which requires the completed assessment plus a treatment plan with Cigna\'s ABA PA form. That clinical policy is national — what changes in Virginia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our Cigna / Evernorth guide; this page covers what changes in Virginia.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
      { title: 'Cigna autism resource guide (Mar 2025)', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf' },
        ],
      },
      {
        h2: 'The Virginia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. ABA is subject to an annual maximum benefit of $35,000 unless the insurer elects more (still in the current statute), must be provided or supervised by a behavior analyst licensed by the Board of Medicine, and the prescriber must be independent of the ABA provider. Self-funded ERISA plans are exempt by preemption, and the $35K cap is a quantitative limit of doubtful MHPAEA enforceability for large-group plans.',
        ],
        cites: [
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'The Virginia carve-out: EN0499 does not apply to fully-insured plans',
        body: [
          'The current EN0499 states verbatim that Virginia fully-insured business is not subject to the policy. For fully-insured Cigna members in Virginia, coverage terms come from the plan document and the state mandate — not Cigna’s national IBI criteria — while self-funded (ASO) plans still follow EN0499. Practically: for a Virginia Cigna family, don’t assume the no-assessment-PA fast path or any other EN0499 rule until benefits verification confirms which regime the plan sits under.',
        ],
        cites: [
      { title: 'Evernorth EN0499 — Intensive Behavioral Interventions', url: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf' },
        ],
      },
      {
        h2: 'Licensure & rates in Virginia',
        body: [
          'Virginia requires a Board of Medicine license to practice as a behavior analyst (Va. Code § 54.1-2957.16, built on BACB certification) — and the mandate itself conditions ABA coverage on delivery or supervision by a licensed behavior analyst, so licensure is a coverage requirement, not just a credentialing one. On rates: Cigna does not publish commercial ABA fee schedules for Virginia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
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
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
    ],
    faq: [
      { q: 'Does Cigna cover ABA therapy in Virginia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Virginia\'s mandate (Va. Code § 38.2-3418.17) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Virginia autism mandate require?', a: 'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does Cigna pay for ABA in Virginia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Virginia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },

  'unitedhealthcare-virginia': {
    slug: 'unitedhealthcare-virginia',
    family: 'unitedhealthcare',
    cardDesc: 'Optum Supplemental Clinical Criteria (BH803ABASCC) + the Va. Code § 38.2-3418.17 mandate layer.',
    assessmentPA: 'Required — step 1 of Optum\'s two-step authorization (assessment auth via Provider Express)',
    treatmentPA: 'Required — step 2 (treatment auth); reviews every 4–6 months',
    payer: 'UnitedHealthcare / Optum in Virginia',
    state: 'VA', kind: 'commercial',
    pill: 'Payer Guide · UnitedHealthcare · Virginia',
    h1: 'UnitedHealthcare / Optum ABA coverage in Virginia: the intake guide.',
    metaTitle: 'UnitedHealthcare ABA Coverage in Virginia: Prior Auth & Mandate Guide | Carelu',
    metaDescription:
      'How UnitedHealthcare / Optum covers ABA for Virginia families — the national clinical policy, prior authorization, the Va. Code § 38.2-3418.17 mandate (ages, caps, exemptions), Virginia behavior-analyst licensure, and what intake should verify.',
    intro: [
      'For an intake team in Virginia, a UnitedHealthcare card means three layers at once: the carrier\'s national clinical policy, Virginia\'s autism insurance mandate (Va. Code § 38.2-3418.17), and the plan\'s funding type deciding which of the two actually binds. This guide stacks them in order.',
    ],
    atGlance: [
      { label: 'Covers ABA?', value: 'Yes — for ASD, per the national UnitedHealthcare policy' },
      { label: 'State mandate', value: 'Va. Code § 38.2-3418.17' },
      { label: 'Mandate age', value: 'Any age (since 1/1/2020, HB 2577)' },
      { label: 'Mandate caps', value: '$35,000/yr ABA cap in statute (parity-limited)' },
      { label: 'Exempt from mandate', value: 'Short-term/limited policies; self-funded ERISA' },
      { label: 'Licensure', value: 'VA Licensed Behavior Analyst (Board of Medicine)' },
    ],
    sections: [
      {
        h2: 'The national policy, applied in Virginia',
        body: [
          'UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step authorization on the Provider Express portal — assessment authorized first, then treatment — under Optum\'s Supplemental Clinical Criteria, with continued-service reviews every 4–6 months and an operational flag when utilization falls below 80% of authorized hours. That clinical policy is national — what changes in Virginia is the legal floor underneath it: the state mandate below governs what fully-insured plans must cover, while self-funded employer plans answer to ERISA and federal parity instead. Plan funding type is therefore the first fact to establish on every benefits check. The full national policy breakdown lives in our UnitedHealthcare / Optum guide; this page covers what changes in Virginia.',
        ],
        cites: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
        ],
      },
      {
        h2: 'The Virginia mandate: what it guarantees (and doesn\'t)',
        body: [
          'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. ABA is subject to an annual maximum benefit of $35,000 unless the insurer elects more (still in the current statute), must be provided or supervised by a behavior analyst licensed by the Board of Medicine, and the prescriber must be independent of the ABA provider. Self-funded ERISA plans are exempt by preemption, and the $35K cap is a quantitative limit of doubtful MHPAEA enforceability for large-group plans.',
        ],
        cites: [
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
        ],
      },
      {
        h2: 'Optum\'s Virginia-specific criteria',
        body: [
          'Virginia has its own entry in Optum’s ABA State Mandates supplemental criteria: for Virginia commercial fully-insured HMO and insurance plans (effective July 2022), Optum adopts the Virginia statutory definitions of “autism spectrum disorder” and “medically necessary” in place of its standard criteria — so for fully-insured members, the statute’s definitions, not Optum’s defaults, control the medical-necessity conversation.',
        ],
        cites: [
      { title: 'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf' },
        ],
      },
      {
        h2: 'UnitedHealthcare Medicaid in Virginia',
        body: [
          'A family saying “we have UnitedHealthcare” in Virginia may actually be on the carrier’s Medicaid plan — UnitedHealthcare Community Plan of Virginia — which follows the state Medicaid rules, not this commercial policy. Verify which line of business the card belongs to, and use the dedicated guide for the Medicaid plan.',
        ],
      },
      {
        h2: 'Licensure & rates in Virginia',
        body: [
          'Virginia requires a Board of Medicine license to practice as a behavior analyst (Va. Code § 54.1-2957.16, built on BACB certification) — and the mandate itself conditions ABA coverage on delivery or supervision by a licensed behavior analyst, so licensure is a coverage requirement, not just a credentialing one. On rates: UnitedHealthcare does not publish commercial ABA fee schedules for Virginia (none of the national carriers do) — rates are contract-negotiated and live in your participating-provider agreement, so treat rate expectations as a contracting conversation, not a lookup.',
        ],
        cites: [
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
        ],
      },
    ],
    collect: [
      { title: 'Plan funding type', desc: 'Fully insured (mandate applies) vs. self-funded ERISA (exempt) — it decides which rulebook governs. Ask for the employer and check the card.' },
      { title: 'Line of business', desc: 'Commercial vs. UnitedHealthcare Community Plan of Virginia (Medicaid) — different rules, different guide.' },
      { title: 'Member ID + card photo', desc: 'Enough to run a live benefits verification — the only reliable answer on limits and cost-sharing.' },
      { title: 'Diagnosis report', desc: 'DSM-5 ASD diagnosis, diagnosing provider and credentials, evaluation date.' },
      { title: 'Age', desc: 'Where the mandate carries age terms, flag edge cases for the parity analysis rather than turning families away.' },
    ],
    sources: [
      { title: 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC)', url: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf' },
      { title: 'Va. Code § 38.2-3418.17 (official — Virginia LIS)', url: 'https://law.lis.virginia.gov/vacode/title38.2/chapter34/section38.2-3418.17/' },
      { title: 'Autism Speaks — Virginia state-regulated coverage', url: 'https://www.autismspeaks.org/virginia-state-regulated-insurance-coverage' },
      { title: 'Va. Code § 54.1-2957.16 — behavior analyst licensure (official)', url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter29/section54.1-2957.16/' },
    ],
    faq: [
      { q: 'Does UnitedHealthcare cover ABA therapy in Virginia?', a: 'Yes — under the carrier\'s national policy for ASD, layered on Virginia\'s mandate (Va. Code § 38.2-3418.17) for fully-insured plans. Self-funded employer plans are exempt from the mandate, so always verify plan funding type first.' },
      { q: 'What does the Virginia autism mandate require?', a: 'Virginia’s mandate covers individual and group policies and HMO plans, and since January 1, 2020 it applies at any age — the old age caps were removed by 2019’s HB 2577. See the mandate section above for ages, caps, and exemptions — and remember federal parity limits how hard the numeric caps can be enforced against group plans.' },
      { q: 'What does UnitedHealthcare pay for ABA in Virginia?', a: 'Commercial ABA rates are not published — they are negotiated in your participating-provider agreement. Benchmark against the Virginia Medicaid fee schedule where one exists, and treat rate-setting as part of contracting.' },
    ],
  },
};
