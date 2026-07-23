/* ================================================================
   VOB ENRICHMENT — Florida SPLIT A, Layers 1 (EDI routing crosswalk)
   + 3 (code-level coverage grid) + 4 (Medicaid rate table, state
   guide only). See docs/vob-build.md for the spec. Covers:
   florida-medicaid, sunshine-health-florida, cms-health-plan-florida,
   simply-healthcare-florida, unitedhealthcare-community-plan-florida,
   humana-healthy-horizons-florida. A sibling session builds the
   remaining FL MMA plans + commercial guides into this same file —
   merge additively, never remove/rewrite another session's slugs.

   Sourcing notes (read before editing):
   - The FLMMIS 270/271 Companion Guide (v4.0, 2023-04-27, Gainwell/
     AHCA fiscal agent) WAS retrieved and read in full — unlike
     Georgia's, this one is a fetchable static PDF. It confirms
     Florida's canonical X12 payer ID (77027) and the exact 271 loop/
     segment carrying managed-care enrollment (Loop 2110C "Managed
     Care" repetition + nested Loop 2120C free-text entity name — NOT
     a fixed carrier-code table; that absence is itself the verified
     fact for medicaid271Notes.mcoCarrierCodes).
   - The current (2025 AND 2026 — rates unchanged) AHCA Behavior
     Analysis fee schedule WAS retrieved directly from ahca.myflorida.
     gov as fetchable PDFs (their WAF blocks a default WebFetch
     User-Agent but not a browser-like one). This produces a real,
     citable finding: CPT 97157 does not appear on either fee
     schedule and is not listed among covered service categories in
     the Dec 2024 coverage policy (§4.2.2) — cross-confirmed absent
     from Sunshine Health's own coding table (FL.CP.BH.500) and
     Humana's Florida Medicaid PA list too. Shipped as covered:'No'
     with fieldStatus 'verified' (verified-absent, not a guess) —
     see the FL_CODE_FACTS['97157'] entry below.
   - Florida's AHCA BA Coverage Policy (Dec 2024, Rule 59G-4.125)
     binds ALL 9 MMA plans to its service-coverage floor/ceiling
     (§1.2: plans "must not be subject to more stringent service
     coverage limits than specified in Florida Medicaid policies").
     None of the 4 MCOs in this split (Sunshine/CMS Health Plan,
     Simply/Carelon, UHC Community Plan/Optum, Humana) publish a
     full code-level unit-cap/POS/telehealth table of their own —
     each MCO's codeGrid below therefore starts from the AHCA
     statewide facts (fieldStatus 'inferred' by default) and is
     upgraded to 'verified' per-field only where that specific
     plan's own document independently restates or confirms the
     fact (Sunshine's FL.CP.BH.500 clinical policy is by far the
     most detailed of the four and confirms the most fields).
   - Telehealth is a genuine, verified quirk in Florida: ONLY 97156
     (family/caregiver training) has a stated telehealth allowance
     anywhere in state or plan documentation — GT modifier, capped at
     2 hrs/week, per Rule 59G-1.057, F.A.C. Every other code is
     telehealth:'No' by design, not by omission — this is the
     opposite pattern from Georgia (which allows telehealth broadly
     via POS 02/10 on every code).
   - No Florida BA document — state or plan-level — publishes numeric
     CMS place-of-service codes (no "POS 11/12/02/10" table like
     Georgia's). Every posAllowed value here is a categorical setting
     (home/office/school/community) drawn from plan PA-form checkboxes
     or the coverage policy's IEP/504 school-based requirement; that
     absence of numeric POS codes is itself a verified finding, not a
     gap left for later.
   - Sunshine Health's reported BA network-enrollment pause — flagged
     'unconfirmed' in the shipped florida.ts prose (citing only a
     3piesquared.com industry blog) — IS NOW CONFIRMED from Sunshine's
     own newsroom: a pause on adding new practitioners to existing BA
     groups took effect 2025-10-01 (all AHCA regions except A and B),
     and a partial reversal lifted it in Regions E and F starting
     2026-03-01. Carried into codeGrid notes for the 97153 entry on
     both sunshine-health-florida and cms-health-plan-florida per the
     build brief's instruction to note it there when verifiable.
   - Simply Healthcare's BA benefit is delegated to Carelon Behavioral
     Health for BOTH authorizations and claims (confirmed, not just
     auths) — abaRidesOn:'bh' with twoHopRequired:true, distinct from
     UHC Community Plan/Optum, where Optum manages utilization review
     but claims still bill under UHC's own payer ID 87726 (same ID as
     medical) — abaRidesOn:'medical', twoHopRequired:false. No
     Florida-specific Carelon EDI payer ID could be confirmed (only a
     national pVerify listing, 002465); a commonly-cited "BHOVO" code
     could not be verified against any primary Carelon source.
   - Sunshine's own site states its payer ID is 68069, but Availity's
     payer list separately shows "FLORIDA SUNSHINE STATE HEALTH PLAN"
     = 68057 and a distinct "Centene Corporation" = 68069 — an
     unresolved conflict between two source-adjacent listings, shipped
     as 'inferred' with the conflict spelled out in verifyVia rather
     than silently picking one.
   - UnitedHealthcare Community Plan of Florida's own BA quick-
     reference guides (FL-BAP-QRG.pdf and Optum's FLABAQRG.pdf) were
     both fetched and read in full and contain ZERO code-level detail
     (no CPT table, no unit caps, no POS, no telehealth, no modifiers)
     — confirmed to be 3-page administrative documents only. Optum's
     NATIONAL commercial ABA Reimbursement Policy (2022RP501A, used
     for Georgia's UHC entry) explicitly should NOT be extended to FL
     Medicaid: it uses a four-tier HN/HM/HO/HP modifier system, but
     the AHCA fee schedule that governs FL Medicaid (including UHC
     Community Plan, per the coverage policy's plan-compliance clause)
     uses only HN plus group-size U-modifiers — a materially different
     scheme. This guide's codeGrid therefore inherits AHCA's numbers,
     not Optum's national policy.
   - Humana's own materials explicitly defer coding mechanics to AHCA
     in writing ("Procedure codes and the latest published fee
     schedules can be found on the AHCA website... Rule 59G-4.002") —
     the cleanest, most explicit deferral statement found in this
     split, cited verbatim in the Humana codeGrid entries. Humana's PA
     form (MCD 466) also gives a concrete, previously-unpublished
     number: non-par providers are reimbursed at 80% of the Florida
     Medicaid fee schedule absent a controlling legal requirement or
     Letter of Agreement — replacing the vague "a percentage of..."
     language in the shipped florida.ts prose with an exact figure.
   - "TNFL" (Therapy Network of Florida / Health System One) was
     investigated per the build brief and confirmed to administer BA
     for Community Care Plan — a Florida MMA plan OUTSIDE this split's
     6 guides (likely covered by the sibling session). None of the 5
     MCO/state guides in this file delegate to TNFL.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, FieldStatus } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const FLMMIS_270_271_CG = src(
  'https://portal.flmmis.com/FLPublic/Portals/0/StaticContent/Public/COMPANION%20GUIDES/FMMIS_5010_270_271_Companion%20Guide_v4_0_04272023.pdf',
  'FMMIS 270/271 Batch and Interactive Health Care Eligibility and Response Transaction Companion Guide, 005010X279A1, Version 4.0, 2023-04-27 (AHCA/Gainwell Technologies fiscal agent) — retrieved and read in full. Confirms Florida Medicaid X12 payer ID 77027 (ISA06/ISA08, GS02/GS03, NM109 qualifier PI); managed-care enrollment surfaces in Loop 2110C\'s "Eleventh Repetition – Managed Care" (EB01=L/MC, EB03=96, EB04=MC) with the MCO/PCP identity as FREE TEXT in nested Loop 2120C (NM103) — no fixed carrier-code table exists in this guide. Eligibility spans use DTP qualifier 307 in RD8 (date-range) format for most repetitions, D8 (single date) for a few.',
  true
);
const FLMMIS_CG_INDEX = src(
  'https://portal.flmmis.com/FLPublic/Provider_ProviderServices/Provider_EDI/Provider_EDI_CompanionGuides/tabId/62/Default.aspx',
  'FLMMIS companion guide index page listing all current EDI companion guides and versions.'
);
const AHCA_FEE_SCHEDULE_2025 = src(
  'https://ahca.myflorida.com/content/download/26138/file/2025%20Behavior%20Analysis%20Fee%20Schedule.pdf',
  'AHCA "Behavior Analysis Fee Schedule January 1, 2025" — retrieved directly (AHCA blocks a default WebFetch User-Agent with 403 but not a browser-spoofed request). Full per-code rate table, all effective 2025-01-01.'
);
const AHCA_FEE_SCHEDULE_2026 = src(
  'https://ahca.myflorida.com/content/download/28096/file/2026%20BA%20Fee%20Schedule.pdf',
  'AHCA "Behavior Analysis Fee Schedule 2026" — retrieved directly. Rates are IDENTICAL to the 2025 schedule (no increase); CPT 97157 is absent from this schedule too, confirming the omission is not a 2025-only oversight.'
);
const AHCA_BA_COVERAGE_POLICY = src(
  'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf',
  'Florida Medicaid Behavior Analysis Services Coverage Policy, Dec 2024, incorporated by reference in Rule 59G-4.125, F.A.C. (effective 2025-02-10) — retrieved and read in full. Contains NO CPT code table itself (§8.3 defers to Rule 59G-4.002/the fee schedule); §1.2 binds all MMA plans to this policy\'s floor/ceiling; §4.2.2 sets the 40 hrs/week aggregate cap, 6-participant group cap, and the 97156-only 2 hrs/week telemedicine allowance (GT modifier, Rule 59G-1.057, F.A.C.); §8.2 sets the 8-minute billing rule; §7.2 requires IEP/504 (or documented explanation) for school-based authorization.'
);
const PVERIFY_PAYER_LIST_FL = src(
  'https://pverify.com/wp-content/uploads/2026/06/pVeify-Payer-List-June-26.pdf',
  'pVerify public payer list, dated June 2026 — fetched and parsed directly (pverify.com/payer-list/ itself is JS-rendered and not directly extractable).'
);
const AVAILITY_PAYER_LIST_STALE = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity payer list PDF served at this URL is a STALE legacy export dated "As of 08/08/2012," not Availity\'s current live payer list — used here only as a secondary cross-check, flagged staleRisk, never as the sole basis for a "verified" field.',
  true
);
const SUNSHINE_BA_QRG = src(
  'https://www.sunshinehealth.com/providers/Billing-manual/ba.html',
  'Sunshine Health — BA Provider Quick Reference Guide.'
);
const SUNSHINE_BA_PA_FORM = src(
  'https://www.sunshinehealth.com/content/dam/centene/Sunshine/pdfs/SH-PRO-BH-BA-PA-Request.pdf',
  'Sunshine Health BA Prior Authorization Request Form (SH_9518) — retrieved and read in full. Confirms 40 hr/week overall cap language, "telehealth only allowed for 97156 (see fee schedule)," TS modifier row for 97151 reassessment, HN modifier rows for 97155/97156, and a claims-edit FAQ note on XP-modifier ($0.01 minimum charge workaround) for 97153XP/97155XP.'
);
const SUNSHINE_CLINICAL_POLICY_BH500 = src(
  'https://www.sunshinehealth.com/content/dam/centene/Sunshine/policies/clinical-policies/FL.CP.BH.500.pdf',
  'Sunshine Health Clinical Policy FL.CP.BH.500, "Coding Implications — Behavior Analysis Services," rev. 06/24 — retrieved and read in full. Confirms 6-participant group cap for 97154/97158, Lead-Analyst-or-BCaBA-only rendering for 97155/97158 (RBT excluded), 2 hrs/week telemedicine cap for 97156 citing Rule 59G-1.057, and 10–25 hr/wk (Focused) vs. 30–40 hr/wk (Comprehensive) tiering within the 40 hr/wk ceiling. CPT 97157 is absent from this policy\'s coding table.'
);
const SUNSHINE_TELEHEALTH_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/telehealth-billing-update.html',
  'Sunshine Health general telehealth billing notice — states POS 02 is the system-recognized telehealth indicator and instructs providers NOT to append GT/95/CR modifiers. This is Sunshine\'s CROSS-PLAN telehealth billing convention and appears to conflict with the BA-specific GT-modifier requirement in FL.CP.BH.500/the state coverage policy — flagged as an open discrepancy in the 97156 codeGrid entry, not resolved by assumption.'
);
const SUNSHINE_EDI_PAGE = src(
  'https://www.sunshinehealth.com/providers/resources/electronic-transactions.html',
  'Sunshine Health electronic transactions page — states payer ID 68069 for "Medical/Medicare Advantage" claims and names Availity and Change Healthcare (Emdeon/WebMD/Envoy) as active EDI trading partners, without a clearinghouse-specific alternate ID.'
);
const SUNSHINE_PAUSE_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/aba-pause.html',
  'Sunshine Health newsroom — confirms (primary source, not the previously-cited 3piesquared.com industry blog) a temporary pause on adding new practitioners to existing BA provider groups, effective 2025-10-01, in all AHCA regions except A and B, "to ensure the existing BA network...is fully loaded and functions accurately." Sunshine retains discretion to enroll select providers where a need is identified; an Exception Request Form is available.'
);
const SUNSHINE_PAUSE_ENDS_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/pause-ends.html',
  'Sunshine Health newsroom — confirms the BA enrollment pause lifted in AHCA Regions E (Brevard, Orange, Osceola, Seminole) and F (Charlotte, Collier, DeSoto, Glades, Hendry, Lee, Sarasota) starting 2026-03-01. No stated end date found for the remaining paused regions as of this pass.'
);
const SIMPLY_CARELON_TRAINING = src(
  'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513',
  'Simply Healthcare / Carelon Behavioral Analysis provider training deck (24 slides, dated 2025-01-15, footer FLSMPLY-CD-078096-25) — retrieved and read in full. Confirms the 30-day treatment-plan/data freshness rule verbatim (slide 12: "no older than 30 days at the time of submission... current Vineland and BASC scores"), fax 1-800-370-1116, care-manager review "in accordance with Florida BA Service Coverage Policy: Rule 59G-4.125" (slide 7), 90-day minimum continuity of care (slide 10), and Availity/Payspan claims-and-payment routing. Contains NO CPT code table, unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers anywhere in its 24 slides.'
);
const SIMPLY_EDI_PAGE = src(
  'https://provider.simplyhealthcareplans.com/florida-provider/electronic-data-interchange',
  'Simply Healthcare Florida EDI page — states payer ID SMPLY is used for ALL transaction types via Availity\'s EDI Gateway, explicitly including 270/271 eligibility (in addition to 837/835/276-277).'
);
const CARELON_PROVIDER_HANDBOOK = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/carelon-behavioral-health-provider-handbook.pdf',
  'Carelon Behavioral Health national Provider Handbook — states (§9, Claims Procedures) that providers must look up the correct payer ID via "client and state specific guidelines" on Carelon\'s website or Availity\'s payer list; does not print a Florida-specific payer ID itself.'
);
const CARELON_NATIONAL_ABA_FORM_2019 = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/clinical/aba-authorization-request-form-2019-cpt-codes.pdf',
  'Carelon national ABA Authorization Request Form, "Effective 1/1/2019" — a NATIONAL, non-Florida-specific, pre-carve-in document. Only numeric detail found in any Carelon-authored source: 97151 "up to 32 units max for initial, up to 12 units max for reassessment" — this CONFLICTS with the AHCA/Florida-specific numbers (24 units initial / 18 units TS reassessment) and is NOT applied to this guide\'s codeGrid; cited only to document that it exists and should not be mistaken for a Florida figure.',
  true
);
const UHC_FL_BAP_QRG = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf',
  'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG, doc BH00998-1-25-QRG_03312025 — retrieved and read in full. 3-page administrative document: payer ID 87726, ERA payer ID 86047, 180-day timely filing, 15-day clean-claims turnaround, W9 + FL license required on first claim. Eligibility/benefits verification described ONLY via the Provider Express portal or phone — no 270/271 EDI payer ID given. Contains NO CPT table, unit caps, POS codes, telehealth modifiers, or "Gold Card" mention.'
);
const OPTUM_FLABA_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/flaba/FLABAQRG.pdf',
  'Optum Provider Express — Florida ABA QRG, doc BH01355-1-25-QRG_07162025 (newer revision than the UHC-branded QRG above, but identical scope/content) — retrieved and read in full. Same finding: no code-level coding/reimbursement detail.'
);
const HUMANA_ABA_FLYER = src(
  'https://assets.humana.com/is/content/humana/ABA_Informational_Flyer_AHCApdf',
  'Humana Healthy Horizons FL — Behavior Analysis Informational Flyer (675204FL0225) — retrieved and read in full. States verbatim: "Procedure codes and the latest published fee schedules can be found on the AHCA website: Rule 59G-4.002, Provider Reimbursement Schedules and Billing Codes" — an explicit, written deferral to AHCA for code-level mechanics. Payer ID 61101 for FFS claims via Availity Essentials (preferred), Waystar/ZirMed, TriZetto, SSI Group; PA channels Availity Essentials, IVR 800-523-0023 (24/7), fax 813-321-7220.'
);
const HUMANA_PA_FORM_MCD466 = src(
  'https://assets.humana.com/is/content/humana/ABA_PA_Formpdf',
  'Humana FL — ABA PA Form (MCD 466) — retrieved and read in full. Page 3 states verbatim: "Absent a controlling legal requirement or Letter of Agreement, nonparticipating providers will be reimbursed at 80% of the Medicaid Fee Schedule." POS field is categorical only (Home / Office-Center / School / Other checkboxes) — no numeric POS codes, no telehealth checkbox, no HN/HO/HM/HP fields anywhere on the form.'
);
const HUMANA_FL_PAL = src(
  'https://assets.humana.com/is/content/humana/FL%20MCD%20PAL%20Cpdf',
  'Humana Florida Medicaid Prior Authorization List, "PAL C," effective 2025-07-01, revised 2026-06-26 — retrieved and read in full (page 3: "Behavioral health — Managed by Humana — Applied behavioral analysis (ABA) therapy: 0362T, 0373T, 97151, 97152, 97153, 97154, 97155, 97156, 97158"). CPT 97157 is absent from this list (full-text-searched across both the Nov-2025 "PAL B" and this June-2026 "PAL C" revision); 97151-TS is not listed as a distinct line item — only base 97151 appears.'
);

/* -------------------- AHCA statewide code facts (Layer 3 baseline) -------------------- */

interface FlCodeFact {
  covered: string;
  paRequired: string;
  unitCap: string;
  capPeriod: string;
  posAllowed: string[];
  telehealth: string;
  modifiers: string[];
  notes?: string;
}

const FL_POS: string[] = [
  'home (categorical — no CMS POS-code number published anywhere in FL BA documentation, state or plan level)',
  'office/clinic (categorical)',
  'school (categorical — IEP/504 plan, or a documented explanation, required with the PA request per the coverage policy §7.2)',
  'community/other (categorical, per plan PA-form checkboxes)',
];

const NO_TELEHEALTH =
  "No — not authorized for this code under the AHCA BA Coverage Policy. Only 97156 (family/caregiver training) has a stated telehealth allowance in Florida Medicaid BA; every other code is telehealth:'No' by policy design, not by omission.";

const FL_CODE_FACTS: Record<string, FlCodeFact> = {
  '97151': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      '24 units per initial behavior assessment (max); the reassessment variant, billed with modifier TS, caps at 18 units — same $19.05/unit rate either way.',
    capPeriod: 'per assessment/reassessment (not daily) — a new authorization is required each time, not a recurring daily allotment.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: ['TS — reassessment variant, same $19.05 rate, separate 18-unit cap (vs. 24 for the initial assessment)'],
    notes:
      'Physician referral + order + Comprehensive Diagnostic Evaluation gate the very first assessment request (no autism-diagnosis requirement) — see the guide\'s prose for the intake sequence.',
  },
  '97152': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: '8 units per assessment (max).',
    capPeriod: 'per assessment (not daily).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
  },
  '0362T': {
    covered: 'Yes',
    paRequired: 'Required, and conditioned on medical necessity for the extra-technician protocol per the coverage policy.',
    unitCap: '16 units per initial assessment or reassessment (max).',
    capPeriod: 'per assessment/reassessment.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
    notes:
      'Requires an on-site physician/QHP plus 2+ technicians for severe/destructive-behavior assessment support; billed alongside 97151/97151-TS, not standalone.',
  },
  '97153': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'No code-specific unit cap on the fee schedule; counts toward the aggregate 40 hrs/week (≈160 units/week) BA-intervention cap set by the coverage policy §4.2.2.',
    capPeriod: 'week (aggregate across all treatment codes together, not per-code).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'XP — concurrent-supervision supervisee line, not separately reimbursed (the supervisor bills 97153/97155/97155-HN instead)',
    ],
    notes:
      'Billed at the SAME $12.26/unit rate whether rendered by an RBT, BCaBA, or Lead Analyst — Florida does not tier 97153 by staff credential (contrast 97155/97156, which do via the HN modifier).',
  },
  '97154': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'Max 6 participants per group (coverage policy §4.2.2); the group also counts toward the aggregate 40 hrs/week cap. Rendered by Lead Analyst, BCaBA, or RBT.',
    capPeriod: 'week (aggregate) plus a 6-participant group-size ceiling.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'UN (2 clients, $7.58/unit)',
      'UP (3 clients, $7.08/unit)',
      'UQ (4 clients, $6.58/unit)',
      'UR (5 clients, $6.08/unit)',
      'US (6 clients, $5.58/unit)',
    ],
    notes: 'The modifier documents group size, not staff credential — rate scales DOWN as the group grows.',
  },
  '97155': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: 'No code-specific unit cap on the fee schedule; counts toward the aggregate 40 hrs/week cap.',
    capPeriod: 'week (aggregate across all treatment codes).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'HN — BCaBA tier, $15.37/unit (vs. $19.17 Lead Analyst base rate)',
      'XP — concurrent-supervision supervisee line, not separately reimbursed',
    ],
    notes: 'Rendered by Lead Analyst or BCaBA only — RBTs do not bill 97155 in Florida.',
  },
  '97156': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'No code-specific cap on direct/in-person units; the TELEHEALTH variant (GT modifier) is separately capped at 2 hrs/week (8 units/week).',
    capPeriod: 'week (telehealth portion); aggregate 40 hrs/week cap governs the rest.',
    posAllowed: FL_POS,
    telehealth:
      "Yes — the ONLY Florida Medicaid BA code with a confirmed telehealth allowance. GT modifier, up to 2 hrs/week, per Rule 59G-1.057, F.A.C. (coverage policy §4.2.2, FL.CP.BH.500). Not confirmed whether the telehealth allowance extends to BCaBA-rendered (HN-modifier) training — both the coverage policy and Sunshine's clinical policy name the \"Lead Analyst\" specifically. Separately: Sunshine's general (non-BA) telehealth billing notice instructs POS 02 with NO GT/95/CR modifier appended, which appears to conflict with the BA-specific GT-modifier requirement — an unresolved discrepancy, flagged rather than guessed at; confirm the correct billing combination with each plan before submitting a 97156 telehealth claim.",
    modifiers: ['GT — telemedicine delivery, same $19.05 rate, capped at 2 hrs/wk', 'HN — BCaBA tier, $15.24/unit (vs. $19.05 Lead Analyst base rate)'],
  },
  '97157': {
    covered:
      'No — absent from both the 2025 and 2026 AHCA Behavior Analysis fee schedules and not listed among the covered service categories in the Dec 2024 coverage policy §4.2.2. Cross-confirmed absent from Sunshine Health\'s own coding table (FL.CP.BH.500) and Humana\'s Florida Medicaid PA list too — three independent primary sources agree on the omission. This is NOT a formal written exclusion statement (no document states "97157 is excluded"), so treat this as verified-absent-from-the-billable-set rather than a proven-impossible claim.',
    paRequired: 'N/A — not on the state\'s billable BA code set per the fee schedule and PA lists reviewed.',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes:
      'If a family reports a Florida plan authorizing/paying 97157, verify directly with that plan — it would be an accommodation outside the state fee schedule, not the documented default.',
  },
  '97158': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'Max 6 participants per group; rendered by Lead Analyst or BCaBA only (NOT RBT, per the coverage policy — contrast 97154, which RBTs can render).',
    capPeriod: 'week (aggregate) plus a 6-participant group-size ceiling.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'UN (2 clients, $9.58/unit)',
      'UP (3 clients, $9.08/unit)',
      'UQ (4 clients, $8.58/unit)',
      'UR (5 clients, $8.08/unit)',
      'US (6 clients, $7.58/unit)',
    ],
  },
  '0373T': {
    covered: 'Yes',
    paRequired: 'Required, and conditioned on medical necessity for the extra-technician protocol.',
    unitCap: "No distinct unit cap beyond the underlying code's session limits — the fee schedule doesn't publish one separately for this add-on.",
    capPeriod: 'unverified',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
    notes:
      'Requires an on-site physician/QHP plus 2+ technicians for severe/destructive-behavior exposure treatment; billed alongside 97153/97155.',
  },
};

/* -------------------- codeGrid factories -------------------- */

function ahcaStateEntry(code: string): CodeGridEntry {
  const f = FL_CODE_FACTS[code];
  return {
    covered: f.covered,
    paRequired: f.paRequired,
    unitCap: f.unitCap,
    capPeriod: f.capPeriod,
    posAllowed: f.posAllowed,
    telehealth: f.telehealth,
    modifiers: f.modifiers,
    notes: f.notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [AHCA_FEE_SCHEDULE_2025, AHCA_FEE_SCHEDULE_2026, AHCA_BA_COVERAGE_POLICY],
  };
}

/* Generic MCO entry: starts from the AHCA statewide baseline (per the
   coverage policy's plan-compliance clause, §1.2) as 'inferred', and
   upgrades specific fields to 'verified' only where that plan's own
   document independently confirms them. */
function mcoEntry(
  code: string,
  opts: {
    planName: string;
    confirmed: Array<keyof Pick<FlCodeFact, 'covered' | 'paRequired' | 'unitCap' | 'telehealth' | 'modifiers'>>;
    extraNote?: string;
    extraSources: SourceRef[];
  }
): CodeGridEntry {
  const f = FL_CODE_FACTS[code];
  const confirmedSet = new Set<string>(opts.confirmed);
  const status = (field: string): FieldStatus => (confirmedSet.has(field) ? 'verified' : 'inferred');
  return {
    covered: f.covered,
    paRequired: f.paRequired,
    unitCap: f.unitCap,
    capPeriod: f.capPeriod,
    posAllowed: f.posAllowed,
    telehealth: f.telehealth,
    modifiers: f.modifiers,
    notes: [
      f.notes,
      opts.extraNote,
      `These are the statewide AHCA BA Coverage Policy mechanics, binding on ${opts.planName} per the policy's plan-compliance clause (§1.2); ${opts.planName}'s own documents don't restate full code-level unit-cap/POS detail beyond what's marked 'verified' above — confirm any 'inferred' field with ${opts.planName} provider relations before quoting a family.`,
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: status('covered'),
      paRequired: status('paRequired'),
      unitCap: status('unitCap'),
      posAllowed: 'inferred',
      telehealth: status('telehealth'),
      modifiers: status('modifiers'),
    },
    sources: [AHCA_BA_COVERAGE_POLICY, AHCA_FEE_SCHEDULE_2025, ...opts.extraSources],
  };
}

/* ==================== florida-medicaid (state FFS) ==================== */

const floridaMedicaidEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '77027', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "Loop 2110C (Subscriber Eligibility or Benefit Information), \"Eleventh Repetition – Managed Care\": EB01='L' (PCP, individual) or 'MC' (MCO, entity), EB03=96 (Professional/Physician), EB04='MC' (Medicaid). MCO/PCP identity is carried in the nested Loop 2120C (Subscriber Benefit Related Entity Name): NM101='1P' (Provider), NM103=free-text plan/provider name, with contact phone in the PER segment.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      'Date range (RD8 format, CCYYMMDD-CCYYMMDD) via the Loop 2110C DTP segment (qualifier 307=Eligibility) for most repetitions; a few repetitions (e.g., Well Baby Care) use a single date (D8, qualifier 472=Service) instead. Not a fixed monthly bucket — driven by date-of-service.',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pverify.com/payer-list/ is JS-rendered and not extractable via automated fetch this pass — confirm Florida Medicaid's pVerify code directly with pVerify onboarding.",
    'payerId.availity':
      "77027 is Florida Medicaid's own X12 payer ID per the FLMMIS companion guide (confirmed primary source); Availity's own current live payer list was not independently reachable (the fetched URL served a stale 2012 export that happens to list 77027 too) — confirm 77027 is still what Availity routes 270/271 through before automating on it.",
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass — confirm via Optum/Change Healthcare onboarding.',
  },
  sources: [FLMMIS_270_271_CG, FLMMIS_CG_INDEX, PVERIFY_PAYER_LIST_FL, AVAILITY_PAYER_LIST_STALE],
};

const floridaMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': ahcaStateEntry('97151'),
  '97152': ahcaStateEntry('97152'),
  '97153': ahcaStateEntry('97153'),
  '97154': ahcaStateEntry('97154'),
  '97155': ahcaStateEntry('97155'),
  '97156': ahcaStateEntry('97156'),
  '97157': ahcaStateEntry('97157'),
  '97158': ahcaStateEntry('97158'),
  '0362T': ahcaStateEntry('0362T'),
  '0373T': ahcaStateEntry('0373T'),
};

const floridaMedicaidRates: RateTable = {
  source: 'AHCA Behavior Analysis Fee Schedule (2025 and 2026 — rates identical across both years)',
  effectiveDate: '2025-01-01',
  byCode: {
    '97151': { rate: '$19.05', unit: '15min', modifierTiers: { TS: '$19.05 (reassessment; same rate, 18-unit cap vs. 24 for the initial assessment)' } },
    '97152': { rate: '$12.19', unit: '15min' },
    '0362T': { rate: '$12.19', unit: '15min' },
    '97153': { rate: '$12.26', unit: '15min', modifierTiers: { XP: 'Not reimbursed (concurrent-supervision supervisee line)' } },
    '97154': {
      rate: '$7.58 (2 clients, UN)',
      unit: '15min',
      modifierTiers: { UN: '$7.58 (2 clients)', UP: '$7.08 (3)', UQ: '$6.58 (4)', UR: '$6.08 (5)', US: '$5.58 (6)' },
    },
    '97155': { rate: '$19.17 (Lead Analyst)', unit: '15min', modifierTiers: { HN: '$15.37 (BCaBA)', XP: 'Not reimbursed (concurrent-supervision supervisee line)' } },
    '97156': {
      rate: '$19.05 (Lead Analyst)',
      unit: '15min',
      modifierTiers: { GT: '$19.05 (telemedicine — same rate, capped at 2 hrs/week)', HN: '$15.24 (BCaBA)' },
    },
    '97157': { rate: 'Not on the AHCA fee schedule (2025 or 2026) — not confirmed reimbursable under Florida Medicaid BA.', unit: '15min' },
    '97158': {
      rate: '$9.58 (2 clients, UN)',
      unit: '15min',
      modifierTiers: { UN: '$9.58 (2 clients)', UP: '$9.08 (3)', UQ: '$8.58 (4)', UR: '$8.08 (5)', US: '$7.58 (6)' },
    },
    '0373T': { rate: '$12.19', unit: '15min' },
  },
  sources: [AHCA_FEE_SCHEDULE_2025, AHCA_FEE_SCHEDULE_2026],
};

/* ==================== sunshine-health-florida & cms-health-plan-florida ====================
   CMS Health Plan is operated BY Sunshine Health and uses Sunshine's BA process end to end
   (confirmed in research) — the codeGrid below is shared between both guides; EDI differs
   (CMS Health Plan has no independently confirmed EDI identity of its own). */

const sunshineEdi: EdiRouting = {
  payerId: { pverify: '00327', availity: '68069', changeHealthcare: '68069' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      "Sunshine's own electronic-transactions page states payer ID 68069, but Availity's payer list separately shows a distinct line item \"FLORIDA SUNSHINE STATE HEALTH PLAN\" = 68057 alongside a separate \"Centene Corporation\" = 68069 — an unresolved conflict between two source-adjacent listings. Confirm which ID Availity actually routes Sunshine FL 270/271 eligibility through before automating.",
    'payerId.changeHealthcare':
      "Sunshine's own page names Change Healthcare as an active trading partner using the same 68069 ID as Availity, but no independent Change Healthcare-specific payer directory was reachable to cross-confirm.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID — neither Sunshine\'s page nor the BA QRG specifies.',
  },
  sources: [PVERIFY_PAYER_LIST_FL, SUNSHINE_EDI_PAGE, SUNSHINE_BA_QRG, AVAILITY_PAYER_LIST_STALE],
};

const cmsHealthPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      'No distinct CMS Health Plan entry was found in pVerify\'s or Availity\'s public payer lists — CMS Health Plan is operated by Sunshine Health and its BA program rides on Sunshine\'s process end to end (per Sunshine\'s BA QRG), but whether CMS Health Plan uses Sunshine\'s own EDI payer ID (68069) or requires separate enrollment was not confirmed. Confirm via Sunshine/CMS Health Plan provider relations.',
    'payerId.availity': 'Same as pverify — not independently confirmed.',
    'payerId.changeHealthcare': 'Same as pverify — not independently confirmed.',
    supports270271: 'Not stated in any CMS Health Plan or Sunshine document reviewed.',
    supportsRealtime: 'Not stated.',
  },
  sources: [SUNSHINE_BA_QRG],
};

const sunshineCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraNote:
      "Sunshine's own BA QRG confirms an industry-reported network-enrollment pause on adding new practitioners to existing BA provider groups: effective 2025-10-01 in all AHCA regions except A and B (Sunshine newsroom, aba-pause.html), partially lifted in Regions E and F starting 2026-03-01 (pause-ends.html). Verify current status by region with Sunshine provider relations before promising a new hire's start date.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500, SUNSHINE_PAUSE_NOTICE, SUNSHINE_PAUSE_ENDS_NOTICE],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth'],
    extraNote: "Sunshine's PA form doesn't restate the UN–US group-size modifier letters (says only \"see fee schedule for participant amount\") — the letters themselves are inferred from the AHCA fee schedule.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500, SUNSHINE_TELEHEALTH_NOTICE],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Sunshine Health',
    confirmed: ['covered'],
    extraNote: "Independently cross-confirmed absent from Sunshine's own FL.CP.BH.500 coding table — not just the AHCA fee schedule.",
    extraSources: [SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth'],
    extraNote: "Sunshine's PA form doesn't restate the UN–US group-size modifier letters — inferred from the AHCA fee schedule.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
};

/* ==================== simply-healthcare-florida ==================== */

const simplyEdi: EdiRouting = {
  payerId: { pverify: '00665', availity: 'SMPLY', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable to confirm a distinct ID for Simply FL.',
    supportsRealtime: "Simply's EDI page confirms 270/271 is a supported transaction type via Availity's EDI Gateway but doesn't state real-time vs. batch.",
    'bhCarveOut.administratorPayerId':
      "pVerify lists a NATIONAL \"Carelon Behavioral Health\" entry (002465), but no Florida-specific Carelon EDI payer ID was confirmed — Carelon's own national Provider Handbook directs providers to look up the state-specific ID via Carelon's website or Availity's payer list rather than printing one itself, and Availity's own payer list has no distinct Carelon/CBH line item (Carelon claims for Simply appear to route through Availity without a separately documented Carelon-specific code). A commonly-cited \"BHOVO\" code could not be verified against any primary Carelon source. Confirm directly with Carelon's EDI helpdesk (1-888-247-9311 / e-supportservices@carelonbehavioralhealth.com) or Availity onboarding.",
  },
  sources: [PVERIFY_PAYER_LIST_FL, SIMPLY_EDI_PAGE, SIMPLY_CARELON_TRAINING, CARELON_PROVIDER_HANDBOOK],
};

const simplyCarelonExtraNote =
  'Carelon requires the treatment plan and supporting data to be no older than 30 days at PA submission (a process rule layered on top of the state\'s 6-month clinical reassessment cycle) — refresh data collection before assembling any renewal packet.';

const simplyCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING, CARELON_NATIONAL_ABA_FORM_2019],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered'],
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
};

/* ==================== unitedhealthcare-community-plan-florida ==================== */

const uhcCommunityPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '87726', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "No Florida-specific pVerify entry was found for UHC Community Plan (only other-state UHC Community Plan lines and an ambiguous \"UHG007 United Healthcare - Optum Behavioral Solutions\" entry not confirmed to apply to FL Medicaid BA). Confirm with pVerify onboarding.",
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass.',
    supports270271:
      "UHC's own FL BAP QRG describes eligibility/benefits verification ONLY via the Provider Express portal or phone — it does not mention 270/271 EDI eligibility for this specific program, though UnitedHealthcare broadly supports 270/271 nationally. Confirm whether FL Medicaid BA eligibility specifically runs through EDI or is portal/phone-only.",
    supportsRealtime: "Not stated for this program; UHC's QRG describes the portal check as taking \"less than 2 minutes,\" consistent with real-time but not an explicit EDI claim.",
  },
  sources: [UHC_FL_BAP_QRG, OPTUM_FLABA_QRG, AVAILITY_PAYER_LIST_STALE],
};

const uhcExtraNote =
  "Optum manages utilization review/PA for this program (two-step 'ABA Assessment' then 'ABA Treatment' request types on Provider Express), but claims still bill under UnitedHealthcare's own payer ID 87726 — the SAME ID as medical claims, not a separate behavioral-health-specific ID (contrast Simply/Carelon, which fully carves both auth AND claims to a distinct entity).";

const uhcCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraNote: uhcExtraNote,
    extraSources: [UHC_FL_BAP_QRG, OPTUM_FLABA_QRG],
  }),
  '97152': mcoEntry('97152', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97153': mcoEntry('97153', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97154': mcoEntry('97154', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97155': mcoEntry('97155', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97156': mcoEntry('97156', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97157': mcoEntry('97157', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: [],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97158': mcoEntry('97158', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
};

/* ==================== humana-healthy-horizons-florida ==================== */

const humanaEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '61101', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      'No pVerify entry specific to "Humana Healthy Horizons" Medicaid in Florida was found; a candidate "Humana of Florida" entry (00434) is NOT confirmed to be the same payer entity as Healthy Horizons Medicaid — confirm with pVerify onboarding before using 00434.',
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass.',
    supports270271:
      "Humana's ABA flyer addresses only claims (payer ID 61101) and PA submission channels (Availity, IVR, fax) — it does not separately confirm 61101 is used for 270/271 eligibility, though that's the common pattern for Availity-routed payers.",
    supportsRealtime: 'Not addressed in any Humana FL BA document reviewed.',
  },
  sources: [HUMANA_ABA_FLYER],
};

const humanaExtraNote =
  "Humana's own materials explicitly defer coding mechanics to AHCA in writing: \"Procedure codes and the latest published fee schedules can be found on the AHCA website... Rule 59G-4.002.\" Non-par providers are reimbursed at 80% of the Florida Medicaid fee schedule, absent a controlling legal requirement or Letter of Agreement (MCD 466 PA form, p.3) — a concrete figure, not the vague \"a percentage of...\" previously on file.";

const humanaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraNote: humanaExtraNote,
    extraSources: [HUMANA_ABA_FLYER, HUMANA_PA_FORM_MCD466, HUMANA_FL_PAL],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered'],
    extraNote: 'Independently cross-confirmed absent from the Humana FL PAL too — not just the AHCA fee schedule.',
    extraSources: [HUMANA_FL_PAL],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
};

/* ==================== export ==================== */

export const floridaVob: Record<string, VobExtension> = {
  'florida-medicaid': { edi: floridaMedicaidEdi, codeGrid: floridaMedicaidCodeGrid, rates: floridaMedicaidRates, lastUpdated: ACCESS_DATE },
  'sunshine-health-florida': { edi: sunshineEdi, codeGrid: sunshineCodeGrid, lastUpdated: ACCESS_DATE },
  'cms-health-plan-florida': { edi: cmsHealthPlanEdi, codeGrid: sunshineCodeGrid, lastUpdated: ACCESS_DATE },
  'simply-healthcare-florida': { edi: simplyEdi, codeGrid: simplyCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-florida': { edi: uhcCommunityPlanEdi, codeGrid: uhcCodeGrid, lastUpdated: ACCESS_DATE },
  'humana-healthy-horizons-florida': { edi: humanaEdi, codeGrid: humanaCodeGrid, lastUpdated: ACCESS_DATE },
};
