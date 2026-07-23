/* ================================================================
   Layer 6 — carve-out map: carrier family x state x line of business
   -> BH administrator + payer ID + which side administers ABA, so
   hop-2 eligibility routing never needs a human. Populated from
   provider manuals already cited in src/data/payers/<state>.ts and
   src/data/payers/vob/<state>.ts (see docs/vob-build.md); served at
   /api/payers/carveouts.

   Sourcing notes (read before editing):
   - Every row traces to a fact already cited (with primary-source
     URL) somewhere in this corpus — either a state guide's prose or
     an already-shipped vob/<state>.ts edi.bhCarveOut object. This
     file does not introduce any new primary-source research; it
     restructures what the corpus already verified into the flat
     carrier x state x LOB shape Layer 6 asks for.
   - 'US' rows are used ONLY where the same administrator/payerId/
     abaAdministeredOn combination was independently confirmed,
     in the guide prose, across a large majority of the 19 states
     (Cigna/Evernorth). Every other family's behavior differs by
     state (or by Medicaid plan) and is NOT collapsed to a US row,
     per the build spec.
   - administrator/administratorPayerId/abaAdministeredOn are the
     literal string 'unverified' wherever no primary source in the
     corpus states the value — never guessed. Where a value is
     stated but only inferred from a cross-LOB or cross-guide
     pattern (not a document naming it directly for this exact row),
     that caveat is in the row's notes.
   - KNOWN CROSS-FILE INCONSISTENCY (flagged, not silently resolved):
     Optum Behavioral Health's payer ID appears as 87726 in the
     Florida and North Carolina vob files but as UHG007 in the New
     York vob file, for what both describe as the same UHC-Optum
     commercial arrangement. Neither vob file resolves this — see
     the unitedhealthcare/FL,NC vs unitedhealthcare/NY rows below.
     QA should reconcile; this file reproduces both values as found
     rather than picking one.
   ================================================================ */
import type { CarveoutRow, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string): SourceRef {
  return { url, accessDate: ACCESS_DATE, note };
}

/* -------------------- shared national source refs -------------------- */

const EVERNORTH_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'States verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna\'s medical claims nationally (no separate Evernorth EDI hop). Confirmed via identical guide-prose citation in GA, NC, FL, TX, NY, MD, MA, NJ, MO, NE, NM, OH, TN, UT, KS, IN, AZ, CO. The current edition\'s state-mandate paragraph names only New York and Virginia as carrying a state-specific exception; Virginia\'s exception excludes fully-insured business entirely (see the cigna/VA row).'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide.'
);
const OPTUM_ABA_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national. States UnitedHealthcare administers ABA through Optum Behavioral Health as a two-step (assessment, then treatment) authorization on Provider Express, but does not itself state a payer ID.'
);
const OPTUM_ABA_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum — ABA State Mandates supplemental criteria (BH803ABA STM), which states have dedicated entries as of the corpus\'s last read.'
);
const OPTUM_PROVIDER_EXPRESS_EDI = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/clinical-resources/autismABA2/abaCAMediCal12.html',
  'Optum/Provider Express public EDI page; the Florida guide quotes it stating "The Optum payer ID is 87726" (same as UnitedHealthcare\'s medical payer ID) directly, which is why FL commercial + FL/NC Medicaid Community Plan rows below carry fieldStatus-verified 87726.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — Applied Behavior Analysis (national commercial policy). No BH carve-out administrator is named in this policy or in any state-specific Aetna document reviewed across all 19 states.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 — Autism Spectrum Disorders (national commercial policy).'
);

/* ================================================================
   CIGNA / EVERNORTH — national default (commercial)
   ================================================================ */

const CIGNA_ROWS: CarveoutRow[] = [
  {
    family: 'cigna',
    state: 'US',
    lineOfBusiness: 'commercial',
    administrator: 'Evernorth Behavioral Health',
    administratorPayerId: '62308',
    abaAdministeredOn: 'medical',
    notes:
      'ABA rides on the same payer ID as Cigna medical claims nationally — no separate Evernorth EDI hop, no two-hop routing. Confirmed identical in guide prose for GA, NC, FL, TX, NY, MD, MA, NJ, MO, NE, NM, OH, TN, UT, KS, IN, AZ, CO (19 of 19 states researched for this build show the same fact). Exception: Virginia fully-insured business is excluded from EN0499 entirely — see the separate cigna/VA row.',
    sources: [EVERNORTH_EN0499, CIGNA_AUTISM_GUIDE],
  },
  {
    family: 'cigna',
    state: 'VA',
    lineOfBusiness: 'commercial',
    administrator: 'unverified — Evernorth Behavioral Health governs only self-funded (ASO) Virginia plans; fully-insured Virginia plans are explicitly excluded from EN0499',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'EN0499 states verbatim that Virginia fully-insured business is not subject to the policy. For fully-insured members, coverage terms (and therefore who administers hop-2 eligibility) come from the plan document and the state mandate, not Cigna\'s national IBI criteria — self-funded (ASO) Virginia plans still follow Evernorth/62308 as in the US row above. A 271 for a Cigna-VA member must first resolve funding type before this row can be assumed to apply.',
    sources: [EVERNORTH_EN0499],
  },
];

/* ================================================================
   AETNA — commercial: no BH carve-out administrator confirmed in
   any of the 19 states researched. Recorded as a single unverified
   national row rather than 19 duplicate unverified rows.
   ================================================================ */

const AETNA_COMMERCIAL_ROWS: CarveoutRow[] = [
  {
    family: 'aetna',
    state: 'US',
    lineOfBusiness: 'commercial',
    administrator: 'unverified',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'No BH carve-out administrator is named for Aetna commercial ABA in any of the 19 states\' guides (GA, NC, FL, TX, NY, MD, MA, NJ, MO, NE, NM, OH, TN, UT, KS, IN, AZ, CO, VA all checked directly — explicit "not researched to a primary source" / "publishes no state-specific ABA policy, form, or supplement" language repeats across every state). Aetna\'s national CPB 0554/CPB 0648 governs directly with precertification via Availity (form GR-69017-4); whether an internal BH unit or a named vendor adjudicates that precert was not confirmable from any primary source in this corpus. verifyVia: Aetna provider services precert line.',
    sources: [AETNA_CPB0554, AETNA_CPB0648],
  },
];

/* ================================================================
   UNITEDHEALTHCARE / OPTUM BEHAVIORAL HEALTH — commercial, per state.
   Behavior is NOT uniform across states (payer ID and abaAdministeredOn
   both vary, and TX Medicaid uses a genuinely different mechanism
   — see medicaid rows below), so no US row is used for this family.
   ================================================================ */

const UHC_COMMERCIAL_ROWS: CarveoutRow[] = ([
  ['GA', '87726', 'unverified', 'inferred cross-LOB from the NC/FL Optum EDI confirmation; pVerify separately lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" code not resolved against 87726 for Georgia specifically.'],
  ['NC', '87726', 'medical', 'fieldStatus: inferred for this commercial guide — 87726 and "medical" side are directly verified only for NC Medicaid Community Plan (see below); applied here as a cross-LOB pattern, not a commercial-specific confirmation.'],
  ['FL', '87726', 'medical', 'fieldStatus: verified. Optum\'s own Provider Express EDI page states directly, "The Optum payer ID is 87726."'],
  ['TX', 'unverified', 'unverified', 'No commercial-specific confirmation found; Optum\'s national ABA State Mandates supplement confirmed to have no Texas entry.'],
  ['NY', 'UHG007', 'unverified', 'pVerify-listed code UHG007, distinct from the 87726 used in FL/NC — see the cross-file inconsistency flagged at the top of this file. Whether ABA specifically rides that hop vs. UHC\'s medical ID for NY commercial members is unconfirmed.'],
  ['MD', 'unverified', 'unverified', 'No Maryland-specific payer ID or side confirmed for commercial UHC/Optum.'],
  ['MA', 'unverified', 'unverified', 'No Massachusetts-specific payer ID or side confirmed for commercial UHC/Optum (distinct from the MassHealth Medicaid Mass General Brigham Health Plan -> Optum arrangement, see MA Medicaid rows).'],
  ['NJ', 'unverified', 'unverified', 'Optum\'s ABA State Mandates document carries a dedicated New Jersey section, but it is explicitly "For New Jersey Medicaid members" only — no NJ commercial-specific entry exists.'],
  ['AZ', 'unverified', 'unverified', 'No Arizona-specific payer ID confirmed for commercial UHC/Optum.'],
  ['CO', 'unverified', 'unverified', 'Colorado has no entry in Optum\'s ABA State Mandates supplemental criteria — no Colorado-specific overlay or payer ID confirmed.'],
  ['IN', 'unverified', 'unverified', 'No Indiana-specific payer ID confirmed for commercial UHC/Optum.'],
  ['KS', 'unverified', 'unverified', 'Optum\'s ABA State Mandates Kansas section is explicitly "for Kansas Medicaid members" only — does not apply to commercial Kansas members.'],
  ['MO', 'unverified', 'unverified', 'No Missouri-specific payer ID confirmed for commercial UHC/Optum.'],
  ['NE', 'unverified', 'unverified', 'No Nebraska-specific payer ID confirmed for commercial UHC/Optum (contrast Nebraska Medicaid Community Plan, which has an explicit 87726 ERA 86047 fact — see below).'],
  ['NM', 'unverified', 'unverified', 'No New Mexico-specific payer ID confirmed for commercial UHC/Optum (contrast New Mexico Medicaid Community Plan, which has an explicit 87726 ERA 86047 fact — see below).'],
  ['OH', 'unverified', 'unverified', 'No Ohio-specific payer ID confirmed for commercial UHC/Optum.'],
  ['TN', 'unverified', 'unverified', 'No Tennessee-specific payer ID confirmed for commercial UHC/Optum.'],
  ['UT', 'unverified', 'unverified', 'Utah has no entry in Optum\'s ABA State Mandates supplemental criteria (Jan 2026 edition lists 14 states; Utah is not among them).'],
  ['VA', 'unverified', 'unverified', 'Virginia has its own entry in Optum\'s ABA State Mandates supplement (eff. July 2022): for VA commercial fully-insured HMO/insurance plans, Optum adopts the VA statutory definitions of "autism spectrum disorder" and "medically necessary" in place of its standard criteria — a clinical-criteria override, not a payer-ID confirmation.'],
] as Array<[string, string, 'medical' | 'bh' | 'unverified', string]>).map(([state, payerId, side, note]) => ({
  family: 'unitedhealthcare',
  state,
  lineOfBusiness: 'commercial' as const,
  administrator: 'Optum Behavioral Health',
  administratorPayerId: payerId,
  abaAdministeredOn: side,
  notes: note,
  sources: [OPTUM_ABA_SCC, ...(payerId === '87726' ? [OPTUM_PROVIDER_EXPRESS_EDI] : []), ...(note.includes('State Mandates') ? [OPTUM_ABA_STATE_MANDATES] : [])],
}));

/* ================================================================
   UNITEDHEALTHCARE COMMUNITY PLAN / OPTUM — Medicaid, per state.
   Genuinely different mechanisms per state (medical-side pass-
   through in FL/NC vs. a true BH carve-out with no medical PA
   listing in TX) — must not be collapsed into one row.
   ================================================================ */

const UHC_MEDICAID_ROWS: CarveoutRow[] = [
  {
    family: 'unitedhealthcare',
    state: 'NC',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaAdministeredOn: 'medical',
    notes:
      'Since 7/1/2021 Optum manages the RB-BHT network (separate Provider Express portal, two-step assessment/treatment authorization), but claims bill on the SAME payer ID as UHC medical (87726) — no second EDI hop for claims. fieldStatus: verified (UHC NC ABA QRG BH01063_04172025 states "Claims Payer ID 87726" and "Mail paper claims to: Optum Behavioral Health").',
    sources: [src('https://public.providerexpress.com/content/ope-provexpr/us/en/clinical-resources/autismABA2/abaCAMediCal12.html', 'UHC NC ABA Quick Reference Guide (BH01063_04172025).'), OPTUM_PROVIDER_EXPRESS_EDI],
  },
  {
    family: 'unitedhealthcare',
    state: 'FL',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaAdministeredOn: 'medical',
    notes:
      'Optum manages UM/PA for the Community Plan\'s ABA benefit, but claims still bill under UnitedHealthcare\'s own payer ID 87726 — the same ID as medical claims, not a separate BH-specific ID. Contrast Simply Healthcare/Carelon and Community Care Plan/TNFL below, which fully carve both auth AND claims to a distinct entity. fieldStatus: verified.',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/flaba/flABA_Provider_Orient.pdf', 'UHC Community Plan FL SMMC Behavioral Analysis Program QRG.'), OPTUM_PROVIDER_EXPRESS_EDI],
  },
  {
    family: 'unitedhealthcare',
    state: 'TX',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'Genuinely different mechanism from FL/NC: UHC\'s own STAR Kids medical prior-authorization list (eff. 11/1/2025) does NOT contain ABA codes 97151–97158 at all — ABA is carved out to a separate Optum BH authorization pipeline (phone 888-887-9003), a true two-hop routing within the UHC/Optum corporate family, not a medical-side pass-through. No payer ID confirmed for this BH-side hop specifically. fieldStatus: administrator + BH-side verified via UHC\'s own PA list; payer ID and two-hop mechanics inferred, not separately confirmed.',
    sources: [src('https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tx/prior-auth/TX-STAR-Kids-Medical-Prior-Authorization-List.pdf', 'UHC Community Plan TX STAR Kids PA list (eff. 11/1/2025) — confirms absence of ABA codes.')],
  },
  {
    family: 'unitedhealthcare',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health (United Behavioral Health of New York, I.P.A., Inc.)',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'UnitedHealthcare Community Plan of New York. fieldStatus: administrator + abaRidesOn=bh verified per vob/new-york.ts (shipped 2026-07-23) — do not conflate with the NY commercial UHG007 fact (a different guide). administratorPayerId is genuinely unresolved because UHC\'s own EDI documents CONFLICT: the ERA Payer List (12/2/2024) breaks NY out as its own ID (NYU01); the newer Claims Payer List (5/13/2026) does not visibly list NY under the multi-state 87726 grouping; Optum\'s own Institutional Claims Payer List (1/30/2025) explicitly includes NY under a different 87726 grouping. Not resolved by picking one — confirm via Provider Express/UHC EDI enrollment before routing.',
    sources: [
      src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf', 'Optum NY Medicaid ABA Provider Orientation (BH00869, 01/30/2025) — states "All ABA services require prior authorization."'),
      src('https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ERA-Payer-List-for-Affiliates-Strategic-Alliances.pdf', 'UHC ERA Payer List (12/2/2024) — lists NY as NYU01.'),
    ],
  },
  {
    family: 'unitedhealthcare',
    state: 'NJ',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaAdministeredOn: 'unverified',
    notes:
      'Governed by a dedicated NJ Medicaid entry in Optum\'s ABA State Mandates document (BH803ABASTM12026, eff. Jan 2026) stating a comprehensive diagnostic evaluation is not required to access ABA and permitting school-setting services outside school hours. The "87726" figure is stated in context of the plan\'s claims generally — not explicitly labeled as Optum-specific vs. UHC Community Plan-level — flagging that ambiguity rather than asserting it.',
    sources: [OPTUM_ABA_STATE_MANDATES],
  },
  {
    family: 'unitedhealthcare',
    state: 'AZ',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '03432',
    abaAdministeredOn: 'unverified',
    notes:
      'AHCCCS ACC + DDD ("DD by UHCCP") ABA runs on a dedicated AZ AHCCCS ABA Program via Optum\'s Provider Express for authorizations, but claims bill on UHCprovider.com under 03432 — that ID is stated generally as UHC\'s claims payer ID, not explicitly labeled Optum-specific, and the auth/claims split across two portals means a single medical-vs-BH label would be misleading.',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf', 'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129).')],
  },
  {
    family: 'unitedhealthcare',
    state: 'KS',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'KanCare CCTS/IIS benefit runs through Optum. Providers must complete KMAP enrollment first; Optum then retrieves the application to begin credentialing (~60 days); CCTS credentialing requires both BACB certification and a Kansas BSRB license number.',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf', 'Optum — ABA State Mandates supplemental criteria, Kansas Medicaid section.')],
  },
  {
    family: 'unitedhealthcare',
    state: 'NE',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health (branded "United Behavioral Health")',
    administratorPayerId: '87726 (ERA 86047)',
    abaAdministeredOn: 'unverified',
    notes:
      'Heritage Health MCO; autism network carved to Optum since 1/1/2017. "Verify benefits via the behavioral-health number on the member ID card, not the medical line" per the plan\'s own QRG — suggesting a distinct BH routing despite sharing the 87726 claims ID with UHC medical elsewhere. 180-day timely filing.',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf', 'NE Heritage Health Medicaid ABA Program Quick Reference Guide (Optum BH4233).')],
  },
  {
    family: 'unitedhealthcare',
    state: 'NM',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum (branded "United Behavioral Health d/b/a Optum")',
    administratorPayerId: '87726 (ERA 86047)',
    abaAdministeredOn: 'unverified',
    notes: 'Turquoise Care MCO. Runs on "Optum\'s dedicated network." All autism services bill on a CMS-1500 to payer ID 87726 (ERA 86047).',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/NMTurquoiseCareABAQRG.pdf', 'NM Turquoise Care ABA Network Quick Reference Guide (BH0000747_12162024).')],
  },
  {
    family: 'unitedhealthcare',
    state: 'IN',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'Scope limited to Hoosier Care Connect + PathWays for Aging (explicitly NOT HIP/Hoosier Healthwise, where Anthem/MHS/CareSource/MDwise each administer ABA in-house with no Optum involvement — see anthem/centene/caresource rows). Optum was selected to build and manage a separately credentialed Indiana ABA network.',
    sources: [src('https://www.in.gov/medicaid/providers/files/IHCP-Works-2024-UHC-Prior-Authorization.pdf', 'UHC Community Plan — IHCP Works 2024 Prior Authorization seminar deck.')],
  },
  {
    family: 'unitedhealthcare',
    state: 'OH',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes: 'Next Gen Medicaid MCO; runs under a dedicated Ohio Medicaid Optum supplemental clinical criteria document (BH803OH012026.E, eff. July 2026).',
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf', 'Optum — Ohio Medicaid Supplemental Clinical Criteria (BH803OH012026.E).')],
  },
  {
    family: 'unitedhealthcare',
    state: 'VA',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'Cardinal Care MCO. Same DMAS clinical criteria and standardized forms as every other Cardinal Care MCO, but submissions go by fax or Optum\'s Provider Express portal, and ABA credentialing runs through the Optum network rather than UHC medical — an administrative/credentialing/submission-channel carve-out; clinical criteria stay DMAS\'s, not Optum\'s national ABA guideline.',
    sources: [src('https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/va/prior-authorization-and-notification/VA-UHCCP-Prior-Authorization-Effective-3-1-2025.pdf', 'UHC Community Plan VA — PA requirements (eff. 3/1/2025).')],
  },
  {
    family: 'unitedhealthcare',
    state: 'TN',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified — only an at-a-glance "Optum platform" label found, not elaborated in body text',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Weakest-sourced UHC/Optum Medicaid fact in this dataset: the guide\'s at-a-glance table says "TennCare MCO (UnitedHealthcare / Optum platform)" but the body text describes only UHC\'s own Level of Care Guidelines without naming Optum as administrator anywhere. Recorded with the administrator field itself marked unverified despite the label, per the never-guess rule — verifyVia UHC Community Plan TN provider services.',
    sources: [src('https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-ABA-Program-Description.pdf', 'TN ABA Program Description (UHC copy).')],
  },
];

/* ================================================================
   ANTHEM / ELEVANCE / WELLPOINT → CARELON BEHAVIORAL HEALTH.
   Patchy by design: confirmed carve-out in some states/plans, an
   explicit no-carve-out in others, and simply not mentioned (a real
   gap, not a "none") elsewhere — recorded as found, per state.
   ================================================================ */

const ANTHEM_ROWS: CarveoutRow[] = [
  {
    family: 'anthem',
    state: 'GA',
    lineOfBusiness: 'commercial',
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'fieldStatus: inferred. Confirm whether ABA claims route to Carelon Behavioral Health (candidate payer IDs: BHOVO per Availity, or CHCBH per Optum-adjacent ERA lists — neither confirmed) or bill directly under Anthem\'s own medical payer ID (00601). The Anthem ABA Provider Resource Guide itself describes standard CMS-1500 billing with no carve-out named.',
    sources: [src('https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf', 'Anthem ABA Provider Resource Guide (Oct 2024).')],
  },
  {
    family: 'anthem',
    state: 'FL',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'Simply Healthcare Florida (Elevance-owned Medicaid MCO). Genuine full carve-out confirmed — effective 2/1/2025, BOTH authorizations (Carelon eServices portal or fax 1-800-370-1116) AND claims (via Availity Essentials) delegate to Carelon. No Florida-specific Carelon EDI payer ID confirmed (pVerify lists only a national "Carelon Behavioral Health" entry, 002465; a "BHOVO" code is unverified for this plan specifically).',
    sources: [src('https://www.simplyhealthcareplans.com/content/dam/provider/simply/pdf/aba-carelon-training-2025.pdf', 'Simply/Carelon Behavioral Analysis provider training deck (2025-01-15).')],
  },
  {
    family: 'anthem',
    state: 'NC',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house, no vendor carve-out found',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'Healthy Blue North Carolina (Anthem/Elevance Standard Plan). No BH carve-out administrator named anywhere in the Healthy Blue NC Provider Manual for RB-BHT; fieldStatus: inferred from absence, not an explicit "no carve-out" sentence — confirm via Healthy Blue provider services.',
    sources: [src('https://provider.healthybluenc.com/docs/gpp/NC_CAID_ProviderManual.pdf', 'Healthy Blue NC Provider Manual.')],
  },
  {
    family: 'anthem',
    state: 'TX',
    lineOfBusiness: 'medicaid',
    administrator: 'none — no carve-out found',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'Wellpoint Texas (formerly Amerigroup, Elevance-owned Medicaid MCO). No BH vendor named; ABA administered as a standard Medicaid benefit.',
    sources: [src('https://provider.wellpoint.com/texas-provider/prior-authorization', 'Wellpoint TX provider prior-authorization page.')],
  },
  {
    family: 'anthem',
    state: 'NJ',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Wellpoint New Jersey (formerly Amerigroup). Confirmed as a separate contracting funnel from the medical plan: "ABA network contracting runs through Carelon Behavioral Health (provider.relations.NJ@carelon.com) — a separate funnel from the Wellpoint medical plan, so a practice contracted for medical services isn\'t automatically in the ABA network." Wellpoint\'s own claims payer ID (WLPNT) is plan-level, not Carelon\'s.',
    sources: [src('https://provider.wellpoint.com/new-jersey-provider/behavioral-health', 'Wellpoint NJ provider behavioral-health page.')],
  },
  {
    family: 'anthem',
    state: 'OH',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified — no BH vendor named in this guide (notable gap vs. this family\'s pattern elsewhere)',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Anthem BCBS Ohio Medicaid (Next Gen MCO). No BH vendor (e.g., Carelon) is named anywhere in this guide — only Anthem\'s own adopted clinical guideline CG-BEH-02 with submission via Availity/ICR. Flagged explicitly because a Carelon carve-out would be the expected pattern for this carrier family; its absence here should be a priority item to re-verify directly with Anthem Ohio provider services rather than assumed either way.',
    sources: [],
  },
  {
    family: 'anthem',
    state: 'TN',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified — no BH vendor named in this guide',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes: 'Wellpoint Tennessee (TennCare MCO). No Carelon or other BH vendor named; ABA submissions go through Availity\'s Interactive Care Reviewer using a universal tri-MCO ABA request form.',
    sources: [src('https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf', 'Universal Request for ABA form (TN-WP-CD-000947-25, Jan 2026).')],
  },
  {
    family: 'anthem',
    state: 'VA',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified — no BH vendor named in this guide',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes: 'Anthem HealthKeepers Plus (Cardinal Care MCO). No Carelon or other BH vendor named; ABA administered directly on DMAS standardized forms via Availity ICR.',
    sources: [src('https://providers.anthem.com/docs/gpp/VA_CAID_ABARequirements.pdf', 'Anthem VA — ABA requirements bulletin.')],
  },
];

/* ================================================================
   AETNA MEDICAID (Aetna Better Health / Mercy Care) — per state.
   Distinct from the Aetna commercial national row above; Maryland
   is covered by the statewide Carelon BHASO row, not repeated here.
   ================================================================ */

const AETNA_MEDICAID_ROWS: CarveoutRow[] = [
  {
    family: 'aetna',
    state: 'AZ',
    lineOfBusiness: 'medicaid',
    administrator: 'Aetna Medicaid Administrators LLC — whole-plan administrator (Mercy Care); no separate BH-only vendor named',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'medical',
    notes: 'Mercy Care (AHCCCS ACC + DDD + DCS foster-care book). ABA runs on Mercy Care\'s own page/forms citing AMPM 320-S — no distinct clinical policy layered on top, no separate BH carve-out vendor identified.',
    sources: [src('https://www.mercycareaz.org/providers/applied-behavior-analysis.html', 'Mercy Care — Applied Behavior Analysis provider page.')],
  },
  {
    family: 'aetna',
    state: 'NJ',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house, no external vendor',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'Aetna Better Health of New Jersey. "There\'s no distinct Aetna clinical ABA policy layered on top — authorization runs through the standard behavioral-health PA machinery on Availity." No external administrator named.',
    sources: [],
  },
  {
    family: 'aetna',
    state: 'TX',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'Aetna Better Health of Texas administers ABA directly, no BH vendor named.',
    sources: [],
  },
  {
    family: 'aetna',
    state: 'VA',
    lineOfBusiness: 'medicaid',
    administrator: 'none — administered directly by Aetna Better Health on DMAS standardized forms, explicitly NOT under Aetna\'s national commercial policy',
    administratorPayerId: 'N/A — the "128VA" figure in this guide is Aetna Better Health of Virginia\'s own Medicaid EDI payer ID, not a BH-administrator ID',
    abaAdministeredOn: 'medical',
    notes: 'Cardinal Care MCO. "Aetna Better Health of Virginia administers the Cardinal Care ABA benefit on DMAS\'s standardized forms and criteria — Aetna\'s national commercial ABA policy (CPB 0554) does not apply here."',
    sources: [src('https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/virginia/provider/pdf/abhva_applied_behavioral_analysis_providers.pdf', 'Aetna Better Health VA — ABA provider collaboration deck.')],
  },
  {
    family: 'aetna',
    state: 'KS',
    lineOfBusiness: 'medicaid',
    administrator: 'N/A — Aetna Better Health of Kansas lost the KanCare 3.0 contract; members auto-transitioned to Healthy Blue Kansas on 1/1/2025',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'unverified',
    notes: 'Historical-exit fact, not a current carve-out — recorded because directories may still list Aetna Better Health of Kansas as an active KanCare MCO.',
    sources: [src('https://www.kac.org/state_selects_companies_to_manage_kancare', 'Kansas Action for Children — State selects companies to manage KanCare.')],
  },
];

/* ================================================================
   STATE-LEVEL MEDICAID FFS CARVE-OUTS. ABA is removed from managed
   care back to a statewide fee-for-service process, regardless of
   which MCO/carrier the member is enrolled with — not a
   carrier-specific arrangement, so family is 'all'.
   ================================================================ */

const STATE_FFS_CARVEOUT_ROWS: CarveoutRow[] = [
  {
    family: 'all',
    state: 'CO',
    lineOfBusiness: 'medicaid',
    administrator: 'Acentra Health (formerly Kepro) — statewide FFS UM vendor; claims paid by state fiscal agent Gainwell',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'ABA/Pediatric Behavioral Therapy is a fee-for-service EPSDT state-plan benefit carved OUT of all four Regional Accountable Entities\' (RAEs) BH capitation, regardless of which RAE/MCO a Health First Colorado member is assigned. PARs go through the Atrezzo portal to Acentra; claims pay through Gainwell. This supersedes any carrier-specific row for Colorado Medicaid (e.g., UnitedHealthcare/Rocky Mountain Health Plans does not authorize or pay ABA claims at all).',
    sources: [src('https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20PM%2025-005%20Pediatric%20Behavioral%20Therapy%20Policy%20Clarification.pdf', 'HCPF PM 25-005 — Pediatric Behavioral Therapy Policy Clarification: "PBT is reimbursed by Health First Colorado as fee-for-service."')],
  },
  {
    family: 'all',
    state: 'MO',
    lineOfBusiness: 'medicaid',
    administrator: 'MO HealthNet (state) — fully carved out of ALL managed care to fee-for-service; no MCO or BH vendor involved',
    administratorPayerId: 'N/A — routes by fax (form 2575-045, to 573-635-6516), not EDI',
    abaAdministeredOn: 'unverified',
    notes:
      'Applies uniformly regardless of MCO (Healthy Blue, Home State Health, UnitedHealthcare Community Plan, Show Me Healthy Kids all confirm the same fact in their own provider manuals: ABA is "reimbursed by the state agency on a fee-for-service basis"). Supersedes any carrier-specific Medicaid row for Missouri.',
    sources: [src('https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx', 'MO HealthNet Behavioral Health Services Manual, §1.16 (ABA carve-out), May 2026.')],
  },
  {
    family: 'all',
    state: 'UT',
    lineOfBusiness: 'medicaid',
    administrator: 'Utah Medicaid (state) — ABA and the ASD diagnostic evaluation carved out of all 4 ACOs to fee-for-service',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Utah\'s four ACOs (Health Choice Utah, Healthy U, Molina, SelectHealth Community Care) handle physical health and ASD-related PT/OT/speech, but ABA itself stays FFS at the state level regardless of ACO. United Behavioral Health (Optum) is listed as a Prepaid Mental Health Plan (PMHP) contractor for inpatient/outpatient MH and SUD, but PMHPs do not cover ABA — so Optum\'s PMHP role is not relevant to ABA hop-2 routing in Utah. Supersedes any carrier-specific Medicaid row for Utah.',
    sources: [src('https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf', 'Utah Medicaid Provider Manual — Autism Spectrum Disorder Services (archived).')],
  },
];

/* ================================================================
   MARYLAND — statewide BHASO carve-out, applies to ALL nine
   HealthChoice MCOs identically (Aetna Better Health, Priority
   Partners, Kaiser, UnitedHealthcare Community Plan, MedStar,
   Wellpoint, and others). One row, not nine near-duplicates.
   ================================================================ */

const MARYLAND_ROWS: CarveoutRow[] = [
  {
    family: 'all',
    state: 'MD',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health of Maryland (the state\'s Behavioral Health Administrative Services Organization / BHASO)',
    administratorPayerId: 'unverified — only a phone line found (800-888-1965); Carelon ProviderConnect (auths) and Availity Essentials (claims) are the named portals',
    abaAdministeredOn: 'bh',
    notes:
      'ABA (like all specialty behavioral health) is carved OUT of all nine HealthChoice MCOs and paid fee-for-service by the state through Carelon — whatever MCO card a Maryland Medicaid family carries (Aetna Better Health, UnitedHealthcare Community Plan, Wellpoint, Priority Partners, Kaiser, MedStar, etc.), every ABA authorization and claim goes to Carelon, never to the MCO. This row supersedes any carrier-specific Maryland Medicaid row. Historical note: Carelon replaced Optum Maryland as the BHASO; any provider material still pointing at Optum Maryland is stale.',
    sources: [
      src('https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf', 'MDH ABA Provider Manual (eff. Feb 1, 2026).'),
      src('https://health.maryland.gov/mmcp/healthchoice/Pages/BehavioralHealthCoverage.aspx', 'MDH HealthChoice — Behavioral Health Coverage (carve-out).'),
    ],
  },
];

/* ================================================================
   MASSACHUSETTS — MassHealth's six BH-administering plan pages.
   Family is the plan/ACPP brand, not a national carrier, since
   that is how the corpus (and MassHealth itself) organizes this.
   WellSense already reflects the 1/1/2026 in-house move.
   ================================================================ */

const MASSACHUSETTS_ROWS: CarveoutRow[] = [
  {
    family: 'mbhp',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'MBHP (Massachusetts Behavioral Health Partnership) — a Carelon Behavioral Health company',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes: 'Authorizes ABA for the PCC Plan, all Primary Care ACOs, and Health New England\'s BeHealthy Partnership plan (see health-new-england row) — the single biggest ABA gatekeeper in MassHealth. Submission via Carelon\'s ProviderConnect portal (providers.masspartnership.com); provider line 1-800-495-0086.',
    sources: [src('https://www.carelonbehavioralhealth.com/providers/forms-and-guides/ma', 'Carelon Behavioral Health — Massachusetts forms & guides.')],
  },
  {
    family: 'health-new-england',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'MBHP (Carelon)',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes: 'BeHealthy Partnership (with Baystate Healthcare Alliance). HNE runs no behavioral-health UM of its own — the benefit is fully administered by MBHP.',
    sources: [src('https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf', 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023).')],
  },
  {
    family: 'fallon-health',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes: 'Fallon\'s MassHealth ACPPs (Fallon 365 Care w/Reliant, Fallon-Atrius, Berkshire Fallon Health Collaborative). Fallon has no published ABA criteria of its own — defers to Carelon\'s UM on the state-baseline rules. Among the six plans that received first-wave recoupment letters from MassHealth\'s CY2024 1:10-supervision audit.',
    sources: [src('https://abh.memberclicks.net/assets/docs/KeepingCoverage/2023%20MassHealth%20Accountable%20and%20Managed%20Care%20Options%20031723.pdf', 'MassHealth Managed Care Options — plan/BH-vendor map (April 2023).')],
  },
  {
    family: 'wellsense',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'in-house (WellSense’s own BH team) as of 1/1/2026 — previously Carelon',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'bh',
    notes:
      'Effective January 1, 2026, WellSense brought behavioral-health administration (including ABA) in-house for all Massachusetts products (Medicaid Essential MCO + 8 ACPPs, Medicare, and ACA), ending its Carelon arrangement. Claims for dates of service on/after 1/1/2026 go directly to WellSense; Carelon continues run-off only for inpatient admissions that began before 1/1/2026, through discharge or 3/31/2026 (whichever comes first). Submission via HealthTrio Connect; ABA PA fax 857-264-2673.',
    sources: [src('https://www.wellsense.org/providers/behavioral-health-insourcing/faqs', 'WellSense — Behavioral health insourcing FAQs.')],
  },
  {
    family: 'tufts-health-together',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'none — self-managed internally (Point32Health’s own UM)',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'bh',
    notes:
      'Point32Health’s Tufts Health Together (2 ACPPs, with Cambridge Health Alliance and UMass Memorial Health; MCO product discontinued 1/1/2026). The only MassHealth plan family that self-manages behavioral health — no Carelon, no Optum — reviewing ABA against its own medical-necessity guideline (InterQual criteria) on Point32Health’s own ABA PA form rather than the Massachusetts standard form.',
    sources: [src('https://www.point32health.org/provider/applied-behavioral-analysis-policy-and-coverage-updates-102025', 'Point32Health — ABA policy and coverage updates (Oct 2025).')],
  },
  {
    family: 'mass-general-brigham-health-plan',
    state: 'MA',
    lineOfBusiness: 'medicaid',
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'bh',
    notes:
      'Mass General Brigham Health Plan (formerly AllWays), the MassHealth ACPP paired with the MGB ACO — the only MassHealth plan whose ABA runs through Optum. Governed by the United Behavioral Health ABA criteria plus Optum\'s ABA State Mandates supplement (BH803ABA STM1 2026, eff. Jan 2026), which codifies a 30 hrs/week EI cap and 1:10 BCBA-to-paraprofessional supervision directly (vs. the other five plans, where 1:10 is enforced later via audit).',
    sources: [OPTUM_ABA_STATE_MANDATES],
  },
];

/* ================================================================
   FLORIDA — additional Medicaid-specific carve-outs beyond the
   UHC/Anthem rows above: TNFL full delegation, and the BSN
   network-credentialing-only pattern (explicitly NOT an
   auth/claims carve-out, kept distinct from true carve-outs).
   ================================================================ */

const FLORIDA_ROWS: CarveoutRow[] = [
  {
    family: 'community-care-plan',
    state: 'FL',
    lineOfBusiness: 'medicaid',
    administrator: 'Therapy Network of Florida (TNFL) — full delegation of both authorizations and claims',
    administratorPayerId: '65062 (professional) / 12k89 (institutional)',
    abaAdministeredOn: 'medical',
    notes:
      'Community Care Plan (CCP) delegates its entire Behavior Analysis function to TNFL. Payer IDs quoted verbatim from TNFL\'s own manual: "Our Payer ID is 65062 for professional claims and 12k89 for institutional claims." abaAdministeredOn is medical because TNFL treats BA claims as standard professional/institutional, not a distinct BH bucket — despite the full delegation.',
    sources: [src('https://www.ccpcares.org/media/behavior-analysis-provider-manual.pdf', 'Community Care Plan Behavior Analysis Provider Manual (2025-01-29, hosted by TNFL).')],
  },
  {
    family: 'aetna',
    state: 'FL',
    lineOfBusiness: 'medicaid',
    administrator: 'Behavioral Services Network (BSN) — network contracting/credentialing delegate ONLY, not an authorization/claims carve-out',
    administratorPayerId: '128FL (same as ABHFL medical — BSN publishes no distinct EDI/claims payer ID of its own)',
    abaAdministeredOn: 'medical',
    notes:
      'Aetna Better Health of Florida. To join ABHFL\'s BA network, providers contract/credential through BSN (info@bsnnet.com, 305-907-7470) — a distinct entry point from Aetna\'s own credentialing. But BA prior authorization itself is adjudicated by ABHFL directly, not by BSN. Do not treat BSN as equivalent to a Carelon/TNFL-style carve-out.',
    sources: [src('https://www.aetnabetterhealth.com/florida/providers/resources.html', 'ABHFL Quick Reference Guide (Rev. 11/2024); BSN homepage (bsnnet.com).')],
  },
  {
    family: 'florida-community-care',
    state: 'FL',
    lineOfBusiness: 'medicaid',
    administrator: 'Behavioral Services Network (BSN) — network credentialing/contracting partner only; BA prior authorization itself runs through FCC’s own in-house Utilization Department, not BSN',
    administratorPayerId: 'FLCCR (same as FCC medical — BSN publishes no distinct EDI/claims payer ID)',
    abaAdministeredOn: 'medical',
    notes: 'Florida Community Care. Same BSN network-only pattern as Aetna Better Health of Florida above — this nuance is not stated in the plan\'s own public BA-services page, which describes FCC\'s process as fully in-house without naming BSN at all.',
    sources: [src('https://www.fcchealthplan.com/ba-services/', 'FCC BA services page.')],
  },
];

/* ================================================================
   NEW YORK Medicaid MCOs — mostly in-house/unclear, cross-checked
   directly against vob/new-york.ts (already shipped). No
   contradictions found beyond the 87726/UHG007 Optum payer-ID
   divergence flagged at the top of this file.
   ================================================================ */

const NEW_YORK_ROWS: CarveoutRow[] = [
  {
    family: 'excellus',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house BH Care Management; no vendor carve-out found',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'Excellus BlueCross BlueShield (upstate). BH/ABA are not delegated to eviCore (Excellus\'s vendor for radiology/cardiology/MSK/oncology/sleep) or any other named UM vendor — BH Care Management runs through Excellus directly.',
    sources: [src('https://www.excellusbcbs.com/documents/d/global/exc-prv-applied-behavior-analysis', 'Excellus Medical Policy 3.01.11.')],
  },
  {
    family: 'mvp-health-plan',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house BH/ABA UM (wrote its own ABA medical-necessity criteria in 2021)',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'MVP delegates radiology, musculoskeletal, and post-acute UM to eviCore/Magellan/naviHealth respectively, but no vendor carve-out exists for BH specifically.',
    sources: [src('https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/provider-policies-and-payment-policies/2026/april/mvp-payment-policies-effective-april-1-2026.pdf', 'MVP Applied Behavior Analysis Services Payment Policy (eff. 4/1/2026).')],
  },
  {
    family: 'cdphp',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — in-house CDPHP Behavioral Health Access Center (518-641-3600 / 1-888-320-9584)',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes: 'No named BH vendor carve-out.',
    sources: [src('https://www.cdphp.com/-/media/files/providers/poam/section-18-behavioral-health.pdf', 'CDPHP Provider Office Administrative Manual, Section 18 (rev. July 2025).')],
  },
  {
    family: 'independent-health',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health manages general BH for MediSource, but ABA appears to sit outside that delegation and be administered by Independent Health directly',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'fieldStatus: inferred from handbook structure (the MediSource member handbook places its ABA section apart from the "Behavioral Health Care" section that carries Carelon\'s crisis-line branding), not from a single explicit provider-facing statement. verifyVia: Independent Health Provider Services (716-250-7183 / 1-833-891-9372) — confirm whether ABA routes to Carelon\'s EDI hop or bills directly to Independent Health\'s own payer ID (00436).',
    sources: [src('https://www.independenthealth.com/providers/policies-and-guidelies/behavioral-health-for-state-products', 'Independent Health — Behavioral Health for State Products.')],
  },
  {
    family: 'highmark',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'Wellpoint Partnership Plan, LLC (formerly Amerigroup Partnership Plan) — has administered Medicaid/HARP/CHPlus BH since 2016 per numerous manual citations; the same manual\'s vendor-disclosure footer ALSO names Carelon Behavioral Health IPA Strategies, LLC without clarifying scope',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Highmark Western and Northeastern New York (8 WNY counties). Unresolved which entity applies to ABA specifically. verifyVia: WNYBehavioralHealthTeam@wellpoint.com or Highmark WNY Provider Services — confirm which entity adjudicates ABA and get that entity\'s own EDI payer ID before routing.',
    sources: [src('https://providerpublic.mybcbswny.com/docs/gpp/NYNY_NYW_ProviderManual.pdf', 'Highmark BCBS of Western New York Provider Manual (eff. 4/1/2026).')],
  },
  {
    family: 'molina',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — Molina brought behavioral health in-house effective 1/1/2022, ending a Beacon Health Options delegation',
    administratorPayerId: '',
    abaAdministeredOn: 'medical',
    notes:
      'Molina Healthcare of New York (formerly Affinity). fieldStatus: verified per vob/new-york.ts (shipped 2026-07-23). FLAGGED CONTRADICTION: an earlier read of this guide\'s narrative prose (used for this row before the 2026-07-23 vob shipment) described a different prior vendor/date — "eviCore, until 9/1/2021." The freshly-shipped structured vob fact instead names Beacon Health Options and 1/1/2022. This row uses the newer, vob-sourced fact as authoritative; QA should reconcile which prior-vendor/date pair (eviCore/9-1-2021 vs. Beacon/1-1-2022) is correct in the underlying new-york.ts guide prose.',
    sources: [src('https://www.molinahealthcare.com/providers/ny/medicaid/comm/-/media/Molina/PublicWebsite/PDF/Providers/ny/medicaid/Prior%20Authorization%20Update_Provider_Notice_for_ABA', 'Molina NY provider notice — changes to ABA prior authorization requirements.')],
  },
  {
    family: 'fidelis-care',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'Fidelis runs a full ABA clinical policy of its own (FC.CP.BH.301.04) with no BH vendor named — but per vob/new-york.ts (Layers 1+3, shipped 2026-07-23), that absence was deliberately NOT treated as a confirmed "none": Fidelis was out of the build spec\'s confirmed-delegator scope (Healthfirst/EmblemHealth/MetroPlus only), so whether ABA/BH claims route on Fidelis\'s own medical ID (11315) or a separate Centene-affiliated BH vendor remains an open question, not a verified in-house fact — verifyVia Fidelis provider services.',
    sources: [src('https://www.fideliscare.org/Portals/0/Providers/Applied-Behavior-Analysis-Policy-FC.BH.301.04.pdf', 'Fidelis ABA Clinical Policy FC.CP.BH.301.04.')],
  },
  {
    family: 'healthfirst',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — Healthfirst manages behavioral health in-house',
    administratorPayerId: '',
    abaAdministeredOn: 'medical',
    notes:
      'fieldStatus: verified per vob/new-york.ts (shipped 2026-07-23), which corrected the build spec\'s assumption that Healthfirst delegates BH — Healthfirst\'s own 3/1/2026 NY Provider Manual states verbatim "Healthfirst manages the Behavioral Health services for all of its members," with zero Beacon/Carelon hits across 196 pages. One caveat carried in the same source: the manual elsewhere references "the delegated Behavioral Health Care management organization" without naming a vendor in the chart it points to — likely vestigial language, per that vob entry\'s own note.',
    sources: [src('https://hfproviders.org/resource-posts/applied-behavior-analysis-supervision-requirements', 'Healthfirst provider page — ABA supervision requirements.')],
  },
  {
    family: 'metroplus-health',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none — MetroPlus in-sourced BH from Beacon Health Options effective 10/1/2021',
    administratorPayerId: '',
    abaAdministeredOn: 'medical',
    notes:
      'fieldStatus: verified per vob/new-york.ts (shipped 2026-07-23), which corrected the build spec\'s assumption that MetroPlus delegates BH — MetroPlus\'s own press release confirms it in-sourced BH from Beacon Health Options effective 10/1/2021, corroborated by zero Beacon/Carelon hits across its 2025 Provider Manual and 2026 BH/HCBS PA grid.',
    sources: [src('https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/', 'MetroPlusHealth notice — 2023 ABA benefit changes.')],
  },
  {
    family: 'anthem',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'unverified — Carelon Behavioral Health named only as an unconfirmed candidate',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes: 'Anthem HP, LLC / Anthem Blue Cross and Blue Shield HealthPlus. Guide states "several operational facts have no published answer we could verify: ...whether Carelon Behavioral Health plays a UM role for ABA."',
    sources: [src('https://providernews.anthem.com/new-york/articles/applied-behavior-analysis-services-faq-for-providers-13424', 'Anthem NY provider news — ABA Services FAQ (article 13424).')],
  },
  {
    family: 'emblemhealth',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaAdministeredOn: 'unverified',
    notes:
      'fieldStatus: administrator verified, abaAdministeredOn unverified, per vob/new-york.ts (shipped 2026-07-23). Carelon IS confirmed as EmblemHealth\'s BH administrator generally, including for Medicaid/HARP ("covered behavioral health benefits are managed by Carelon Behavioral Health") — but no EmblemHealth document specifically states ABA claims route through Carelon; the ABA benefit page names no administrator and enumerates no CPT codes, and EmblemHealth\'s two master pre-authorization lists (610 + 226 pages) contain zero ABA/CPT-97xxx hits (consistent with, but not proof of, Carelon routing). Carelon\'s own clearinghouse ID is itself ambiguous (pVerify shows two candidates: 002465 "Carelon Behavioral Health" vs. 002460 "Beacon Health Option-EDI Carelon"). verifyVia Carelon Behavioral Health provider services (888-247-9311, per EmblemHealth\'s manual).',
    sources: [src('https://www.emblemhealth.com/providers/resources/State-Sponsored-Programs/medicaid-applied-behavior-analysis-benefit-', 'EmblemHealth — Medicaid ABA benefit page.')],
  },
  {
    family: 'all',
    state: 'NY',
    lineOfBusiness: 'medicaid',
    administrator: 'none',
    administratorPayerId: '',
    abaAdministeredOn: 'medical',
    notes:
      'New York Medicaid fee-for-service (eMedNY) baseline — applies only when a member is FFS, not enrolled in a Mainstream Medicaid Managed Care (MMC) plan. eMedNY\'s own ABA Provider Policy Manual is explicit that MMC members must instead follow their specific MMC plan\'s rules (see the per-MCO rows above and elsewhere in this file) — this row does not supersede or apply to any MCO-enrolled member. fieldStatus: verified per vob/new-york.ts (shipped 2026-07-23).',
    sources: [src('https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf', 'eMedNY ABA Provider Policy Manual (updated Oct 1, 2025).')],
  },
];

/* ================================================================
   GEORGIA / NORTH CAROLINA / TEXAS Medicaid MCOs with no BH
   carve-out (ABA administered directly, medical side). Recorded
   because "no carve-out" is itself the actionable hop-2 fact.
   ================================================================ */

const NO_CARVEOUT_MEDICAID_MCO_ROWS: CarveoutRow[] = [
  { family: 'amerigroup', state: 'GA', notes: 'Georgia Medicaid CMO.' },
  { family: 'caresource', state: 'GA', notes: 'Georgia Medicaid CMO.' },
  { family: 'peach-state-health-plan', state: 'GA', notes: 'Georgia Medicaid CMO.' },
  { family: 'amerihealth-caritas', state: 'NC', notes: 'North Carolina Medicaid Standard Plan; fieldStatus inferred from absence in AmeriHealth’s UM Guide for RB-BHT.' },
  { family: 'carolina-complete-health', state: 'NC', notes: 'North Carolina Medicaid Standard Plan; fieldStatus inferred from absence in CCH’s behavioral-health provider materials.' },
  { family: 'wellcare', state: 'NC', notes: 'North Carolina Medicaid Standard Plan (merged into Carolina Complete Health 4/1/2026, historical); fieldStatus inferred.' },
  { family: 'alliance-health', state: 'NC', bh: true, notes: 'North Carolina Tailored Plan / LME-MCO — Alliance is itself the LME/MCO administering BH (including RB-BHT) directly; inferred from its role as a Tailored Plan, not an explicit "no carve-out" document.' },
  { family: 'trillium-health-resources', state: 'NC', bh: true, notes: 'North Carolina Tailored Plan / LME-MCO — same as Alliance Health; also carries the state’s GT/KX telehealth modifier quirk (already verified elsewhere in this corpus).' },
  { family: 'vaya-health', state: 'NC', bh: true, notes: 'North Carolina Tailored Plan / LME-MCO — same pattern as Alliance/Trillium.' },
  { family: 'partners-health-management', state: 'NC', bh: true, notes: 'North Carolina Tailored Plan / LME-MCO. BH claims route through ProAuth (auth) / Alpha+ (claims) in-house; no clearinghouse payer ID found in any document reviewed.' },
  { family: 'sunshine-health', state: 'FL', notes: 'Florida Medicaid MCO.' },
  { family: 'cms-health-plan', state: 'FL', notes: 'Florida Medicaid MCO (operated by Sunshine Health); fieldStatus inferred.' },
  { family: 'humana', state: 'FL', notes: 'Humana Healthy Horizons Florida.' },
  { family: 'molina', state: 'FL', notes: 'Molina Healthcare of Florida.' },
  { family: 'superior-healthplan', state: 'TX', notes: 'Superior HealthPlan (Centene), Texas Medicaid MCO.' },
  { family: 'texas-childrens-health-plan', state: 'TX', notes: 'Texas Medicaid MCO.' },
  { family: 'molina', state: 'TX', notes: 'Molina Healthcare of Texas.' },
  { family: 'community-first-health-plans', state: 'TX', notes: 'Texas Medicaid MCO.' },
  { family: 'driscoll-health-plan', state: 'TX', notes: 'Texas Medicaid MCO.' },
  { family: 'humana', state: 'OH', notes: 'Humana Healthy Horizons Ohio. "There’s no distinct Humana clinical policy layered on top; what the plan adds is in-house behavioral UM."' },
  { family: 'mhs', state: 'IN', notes: 'MHS (Managed Health Services, Centene), Indiana Medicaid MCO (Hoosier Healthwise, HIP) — runs its own ABA Outpatient Treatment Request (OTR) form in-house.' },
].map((r) => ({
  family: r.family,
  state: r.state,
  lineOfBusiness: 'medicaid' as const,
  administrator: 'none',
  administratorPayerId: 'N/A',
  abaAdministeredOn: (r.bh ? 'bh' : 'medical') as 'medical' | 'bh',
  notes: r.notes,
  sources: [],
}));

/* ================================================================
   MEDICAID MCOs where the corpus found no explicit statement
   either way (not "none", not a named vendor) — recorded as
   unverified so the gap is visible rather than silently absent.
   ================================================================ */

const AMBIGUOUS_MEDICAID_MCO_ROWS: CarveoutRow[] = [
  { family: 'anthem', state: 'IN', notes: 'Hoosier Healthwise/HIP/Hoosier Care Connect — administers ABA directly under its own UM guideline (AINPEC-3345-21) restating IHCP criteria; no BH vendor named, but no explicit "in-house" statement either.' },
  { family: 'caresource', state: 'IN', notes: 'Hoosier Healthwise/HIP — archived its own ABA policy (MM-0900) end of 2022, defers to IHCP/CMS criteria with no formal documented policy; no BH vendor named.' },
  { family: 'mdwise', state: 'IN', notes: 'Historical MCE, ended as MCE 1/1/2026. Own Behavioral Health Reference Guide lists ABA codes as PA-required, points to IHCP criteria; no BH vendor identified.' },
  { family: 'sunflower-health-plan', state: 'KS', notes: 'KanCare (Centene). Own clinical policy KS.CP.01 and Autism Authorization Request Form applied across KanCare/Medicare/Ambetter lines; no separate BH vendor identified.' },
  { family: 'healthy-blue', state: 'KS', notes: 'KanCare, newest MCO (1/1/2025, Anthem/Elevance JV). Explicit: "internal Anthem BH staff run utilization management directly — no external ABA vendor was identified on the pages we reviewed."' },
  { family: 'nebraska-total-care', state: 'NE', notes: 'Heritage Health MCO (Centene). Own policy NE.CP.BH.105 and OTR process; strongly implied in-house but no explicit carve-out/no-carve-out sentence exists for this plan the way it does for Molina NE.' },
  { family: 'molina', state: 'NE', notes: 'Heritage Health MCO. Explicit in-house: hires Nebraska-based "Care Review Clinician, ABA" roles requiring an LBA license.', override_admin: 'none — explicit in-house' },
  { family: 'blue-cross-blue-shield', state: 'NM', notes: 'Turquoise Care MCO. At-a-glance: "in-house behavioral health UM." No BH vendor named.', override_admin: 'none — in-house' },
  { family: 'presbyterian-health-plan', state: 'NM', notes: 'Turquoise Care (Medicaid) BH is explicitly in-house — "Magellan handles only Presbyterian’s Medicare and commercial BH, never Medicaid." (A separate commercial/Medicare Presbyterian->Magellan fact exists but is out of scope for this Medicaid row.)', override_admin: 'none — in-house for Medicaid; Magellan handles only Medicare/commercial for this same plan' },
  { family: 'molina', state: 'NM', notes: 'No BH vendor named, and no explicit in-house statement either — genuinely ambiguous.' },
  { family: 'buckeye-health-plan', state: 'OH', notes: 'Ohio Next Gen Medicaid MCO (Centene). Runs on Centene’s own corporate policy CP.BH.104; functionally in-house but the guide never uses the word for this plan specifically.' },
  { family: 'caresource', state: 'OH', notes: 'Ohio Medicaid MCO. No BH vendor named anywhere in the entry (policy MM-0028 is CareSource’s own).' },
  { family: 'molina', state: 'OH', notes: 'Ohio Medicaid MCO. "No distinct Molina ABA clinical policy has surfaced publicly" — does not affirmatively state in-house vs. carve-out.' },
  { family: 'amerihealth-caritas', state: 'OH', notes: 'Ohio Medicaid MCO. UM runs through Jiva via NaviNet (a UM platform, not a named BH carve-out administrator).' },
  { family: 'fidelis-care', state: 'NJ', notes: 'NJ FamilyCare MCO (formerly WellCare, Centene). Best-evidence read: runs the state benefit through generic Centene BH UM machinery, with no distinct ABA clinical policy, fee schedule, or unit-cap document surfaced anywhere public.' },
  { family: 'horizon-nj-health', state: 'NJ', notes: 'NJ FamilyCare MCO. No external BH vendor named; described as Horizon’s "own medical policy, MCG-based utilization review" via NaviNet.' },
].map((r) => ({
  family: r.family,
  state: r.state,
  lineOfBusiness: 'medicaid' as const,
  administrator: r.override_admin ?? 'unverified — no BH vendor named, but no explicit in-house/no-carve-out statement either',
  administratorPayerId: r.override_admin ? 'N/A' : 'unverified',
  abaAdministeredOn: (r.override_admin ? 'medical' : 'unverified') as 'medical' | 'unverified',
  notes: r.notes,
  sources: [],
}));

/* ================================================================
   OHIO — the OhioRISE reverse-carve-out: a specialty BH plan that
   explicitly EXCLUDES ABA (stays with the medical MCO/FFS instead
   of the BH specialty plan). Worth recording as its own fact since
   it is the opposite of every other row in this file.
   ================================================================ */

const OHIO_ROWS: CarveoutRow[] = [
  {
    family: 'ohiorise',
    state: 'OH',
    lineOfBusiness: 'medicaid',
    administrator: 'none — OhioRISE (the Aetna-run specialty BH plan for youth with complex behavioral-health needs) does NOT cover ABA; the member’s regular Medicaid MCO or FFS remains responsible even when the child is OhioRISE-enrolled',
    administratorPayerId: 'N/A',
    abaAdministeredOn: 'medical',
    notes:
      'Reverse-carve-out: ODM’s Mixed Services Protocol states explicitly that claims for ABA services (97151–97158, 0362T, 0373T) for ASD are the responsibility of the member’s Medicaid MCO or fee-for-service, even when the youth is enrolled in OhioRISE. A practice that assumes "OhioRISE enrollment = BH carve-out applies to ABA" will misroute claims.',
    sources: [src('https://dam.assets.ohio.gov/image/upload/v1743449666/managedcare.medicaid.ohio.gov/OhioRISE/OhioRISE_Mixed_Services_Protocol_20250401.pdf', 'ODM — OhioRISE Mixed Services Protocol (4/1/2025).')],
  },
];

export const CARVEOUTS: CarveoutRow[] = [
  ...CIGNA_ROWS,
  ...AETNA_COMMERCIAL_ROWS,
  ...UHC_COMMERCIAL_ROWS,
  ...UHC_MEDICAID_ROWS,
  ...ANTHEM_ROWS,
  ...AETNA_MEDICAID_ROWS,
  ...STATE_FFS_CARVEOUT_ROWS,
  ...MARYLAND_ROWS,
  ...MASSACHUSETTS_ROWS,
  ...FLORIDA_ROWS,
  ...NEW_YORK_ROWS,
  ...NO_CARVEOUT_MEDICAID_MCO_ROWS,
  ...AMBIGUOUS_MEDICAID_MCO_ROWS,
  ...OHIO_ROWS,
];
