/* ================================================================
   VOB ENRICHMENT — New Mexico, Layers 1 (EDI routing crosswalk) +
   3 (code-level coverage grid) + 4 (Medicaid rate tables) + 7
   (contact & channel layer).
   See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Layer 4 (rates): new-mexico-medicaid carries the LOD #53 ABA fee
     schedule (eff. 1/1/2025) verbatim from the HCA-published PDF, with
     the full credential-tier ladder (U5 Qualifying Psychologist, U4
     BCBA-D, U3 BCBA, U9 BCaBA, U1 Behavior Technician). Under Letter of
     Direction #53 that FFS schedule is a RATE FLOOR every Turquoise Care
     MCO (and its sub-vendors) must meet — LOD #53 directs MCOs to "not
     negotiate less than the Medicaid fee-for-service (FFS) rate," makes
     the FFS rate the "minimum rate," and orders claims for DOS on/after
     1/1/2025 adjusted and paid within 60 days. So the four MCO guides
     carry the state numbers as an ENFORCEABLE minimum (fieldStatus
     'inferred' at the MCO level: the floor is verified, the MCO's actual
     paid rate at/above it is not separately published). Commercial
     guides (aetna/cigna/unitedhealthcare NM) carry NO rate table —
     commercial ABA rates are contract-specific per the build spec.
   - Layer 3 (code grid): PA verdicts extracted from the primary sources
     already cited in new-mexico.ts prose — the LOD #53 fee schedule
     marks 97151/97152/97154/97155/97156/97157/97158/0362T "Prior Auth:
     NO" and 97153 + 0373T "Prior Auth: YES"; Supplement 24-13 supplies
     the stage model, the under-20-hrs/week comprehensive-treatment PA
     quirk (3.17.1(A)), and the 97155 supervision ratio. UHC Community
     Plan's QRG independently states the same PA surface ("all autism
     services... except 97153 & 0373T"). Modifiers are the LOD #53
     credential tiers (U1–U5/U9) + UA/UB group-size on 97154/97158
     (verified). Per-code daily UNIT CAPS are NOT published in any NM
     primary source (unlike Georgia's CMS max-daily table) — unitCap
     ships 'unverified' with a verifyVia, never guessed; NM's published
     limits are program-level (comprehensive 30–40 hrs/wk, focused
     10–25, the <20 hrs/wk PA quirk), not per-code daily units.
   - Layer 1 (EDI): the NM 271's MCO-enrollment loop/segment and the
     271 carrier-code→MCO map could NOT be retrieved from a primary
     source this pass — the NM MMIS provider portal
     (nmmedicaid.portal.conduent.com) is behind Imperva/Incapsula bot
     protection, and NM appears to route 270/271 through the generic
     Conduent Eligibility Gateway (payer ID 00000001234), which
     publishes only a payer-agnostic envelope. medicaid271Notes
     therefore ships 'unverified' for the segment/carrier-code fields,
     with the HCA Turquoise Care Systems Manual's MCO list + TPL
     constants recorded as the closest available (but 834/TPL, not 271)
     mapping. Turquoise Care is fully integrated (no BH carve-out payer
     ID) — ABA rides the MCO's Medicaid payer ID, no two-hop. NEW:
     HCA launched "Turquoise Claims," a single-point-of-entry for
     Medicaid claims, 3/23/2026 (legacy payor/segment IDs denied after
     6/15/2026) — captured on new-mexico-medicaid.
   - Layer 7 (contact & channel): phone/fax/portal facts are mined from
     this file's own sourced notes plus direct re-fetches of the same
     documents (the Cigna Evernorth autism resource guide, the Optum NM
     Turquoise Care QRG, the Presbyterian provider-authorizations page,
     the BCBSNM Medicaid Provider Reference Manual, the HCA Third-Party
     Assessor page, the Molina NM provider contact page, and the Aetna
     ABA precert form GR-69017-4). BCBSNM's ABA Clinical Service Request
     Form prints a phone/fax (800-851-7498 / 877-361-7659) that the guide
     prose already flags as commercial/FEP-context — NOT reused here for
     the Medicaid guide; the Medicaid PRM's own Behavioral Health
     preauthorization line/fax is used instead. Where no primary source
     surfaced a verifiable number (both commercial UnitedHealthcare
     guides' precert lines), providerServicesPhone/fax are omitted
     rather than guessed. scriptedQuestions are generated per guide from
     that guide's own unverified/plan-dependent edi + codeGrid fields —
     never padded, never asking about anything already verified.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef, StcMap } from './types.js';
import { aetnaFamilyStc, cignaFamilyStc, uhcFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const LOD_53 = src(
  'https://www.hca.nm.gov/wp-content/uploads/FInal-LOD-53-Applied-Behavioral-Analysis-ABA-Fee-Schedule-Rates.pdf',
  'NM Health Care Authority, Letter of Direction #53 — ABA Fee Schedule Rates (LOD dated 3/21/2025; fee schedule effective 1/1/2025). Full credential-tiered per-15-min rate ladder (U5 Qualifying Psychologist, U4 BCBA-D, U3 BCBA, U9 BCaBA/BAA, U1 Behavior Technician) and per-code Prior-Auth flags (97151/97152/97154/97155/97156/97157/97158/0362T = NO; 97153 + 0373T = YES). LOD #53 directs every Turquoise Care MCO to pay no less than this FFS schedule, binds sub-vendors, and orders DOS-on/after-1/1/2025 claims adjusted within 60 days — a statewide rate FLOOR.'
);
const SUPPLEMENT_24_13 = src(
  'https://www.hca.nm.gov/wp-content/uploads/24-13-Supplement-ABA-Guidance.pdf',
  'MAD Supplement 24-13 — Applied Behavior Analysis (ABA) Guidance (9/17/2024). Stage model, ASD-or-at-risk eligibility, adult benefit, service-authorization + 6-month PA cadence, the under-20-hrs/week comprehensive-treatment PA quirk (3.17.1(A)), and the 97155 supervision ratio (≥4 units / 1 hour per 80 units / 20 hours of Stage 3). Program-level intensity: comprehensive 30–40 hrs/wk, focused 10–25, adult 10–40.'
);
const CONDUENT_MEDICAID_PAYER_GUIDE = src(
  'https://downloads.conduent.com/content/usa/en/document/270-payer-guide-medicaid-5010.pdf',
  'Conduent EDI Eligibility Gateway 270/271 Payer Guide — Medicaid (Conduent is the NM MMIS fiscal agent). Row "New Mexico Medicaid – 00000001234" (NM108=PI, ID in NM109); real-time 270/271; Eligibility Date Options: Past look-back 1 year, Range = Yes; default Service Type Code 30.'
);
const CONDUENT_COMPANION_GUIDE = src(
  'https://downloads.conduent.com/content/usa/en/document/eligibility-gateway-companion-guide.pdf',
  'Conduent Eligibility Gateway Companion Guide, ASC X12N 270/271 & 276/277, "All Payers," v2.4 (Aug 2021) — payer-agnostic envelope only (Loops 2100A/2100B/2100C/2110C/2100D). Contains NO NM-specific MCO carrier-code mapping and does not describe which 271 loop carries managed-care enrollment.'
);
const TC_SYSTEMS_MANUAL = src(
  'https://www.hca.nm.gov/wp-content/uploads/Turquoise-Care-Systems-Manual-V1.10-03032025_.pdf',
  'NM HCA Turquoise Care MCO Systems Manual v1.10 (3/3/2025). Names the four MCOs (BCBS / PRESBYTERIAN / UNITED HEALTH / MOLINA Turquoise Care) and internal TPL/834 carrier constants (TPLBCBS, TPLPRESBYTERIAN, TPLUNITED, TPLMOLINA, TPLASPEN, TPLHMS); enrollment granularity daily (834) + monthly (Omnicaid reconciliation). CAVEAT: this is the MCO↔MMIS 834/TPL file-exchange spec, NOT the provider-facing 271 response — so these constants are not confirmed as the codes returned in a 271.'
);
const TURQUOISE_CLAIMS = src(
  'https://www.phs.org/providers/claims/turquoise-claims',
  'Presbyterian provider page documenting HCA\'s "Turquoise Claims" single-point-of-entry for NM Medicaid claims, launched 3/23/2026 (legacy payor/segment IDs denied after 6/15/2026; individual ORP enrollment 10/1/2026). Also gives Presbyterian Turquoise Care Medicaid GS03 payor ID 77048 / Loop 2010BB NM109 = NMPHP.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list (March 2026). NOTE: the "Payer Code" column is pVerify\'s proprietary internal code, not a standard clearinghouse/CAQH payer ID.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list. NOTE: the fetchable public copy carries an "As of 08/08/2012" footer on every page — it predates Turquoise Care (2024) and Centennial Care, so its NM rows reflect the old Salud!/Centennial era and are unreliable for current routing.',
  true
);
const UHC_CLAIMS_PAYER_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
  'UnitedHealthcare Claims Payer List for Affiliates & Strategic Alliances. NM rows: "Medicaid | UnitedHealthcare Community Plan / NM | 87748" and "Dual SNP | UnitedHealthcare Community Plan / NM | 87726 | Former 87726" — i.e. the NM Medicaid claims payer ID is 87748, and 87726 is the NM Dual-SNP line, conflicting with the QRG value cited in the guide prose.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide for BH Providers (Mar 2025), electronic-claims section states verbatim: "Use Evernorth payer ID 62308," "the same for all plans covered under Evernorth Behavioral Health" — confirms ABA claims route to Evernorth ID 62308 (single ID, no second EDI hop).'
);
const OPTUM_NM_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/NMTurquoiseCareABAQRG.pdf',
  'Optum NM Turquoise Care ABA Network Quick Reference Guide (BH0000747_12162024) — "All autism services do not require prior authorization with the exception of 97153 & 0373T"; claims to Payer ID 87726 (ERA 86047) per the QRG. NOTE: UHC\'s own current affiliate claims payer list shows NM Medicaid = 87748 (87726 = NM Dual SNP) and 86047 = New Jersey — an unresolved conflict, shipped as-is.'
);

/* -------------------- Layer 4: rate tables -------------------- */

const NM_MEDICAID_RATES: RateTable = {
  source:
    'NM HCA Letter of Direction #53 — ABA Fee Schedule Rates, effective 1/1/2025. Per-15-min rates by credential-tier modifier (U5 Qualifying Psychologist / U4 BCBA-D / U3 BCBA / U9 BCaBA / U1 Behavior Technician); 97154 & 97158 carry UA/UB group-size modifiers. Under LOD #53 these FFS rates are the enforceable minimum every Turquoise Care MCO and sub-vendor must meet.',
  effectiveDate: '2025-01-01',
  byCode: {
    '97151': { rate: '$130.94 (U5/U4) · $112.65 (U3 BCBA)', unit: '15min', modifierTiers: { U5: '$130.94', U4: '$130.94', U3: '$112.65' } },
    '97152': { rate: '$65.47 (U5/U4) · $58.33 (U3)', unit: '15min', modifierTiers: { U5: '$65.47', U4: '$65.47', U3: '$58.33' } },
    '97153': { rate: '$38.02 (U5) · $37.99 (U4) · $32.31 (U3 BCBA) · $23.35 (U9 BCaBA) · $19.85 (U1 BT)', unit: '15min', modifierTiers: { U5: '$38.02', U4: '$37.99', U3: '$32.31', U9: '$23.35', U1: '$19.85' } },
    '97154': { rate: '$21.88 (U5/U4) · $18.59 (U3) · $13.43 (U9) · $11.43 (U1) — UA (group 2–4) / UB (group 5–8)', unit: '15min', modifierTiers: { U5: '$21.88', U4: '$21.88', U3: '$18.59', U9: '$13.43', U1: '$11.43' } },
    '97155': { rate: '$55.55 (U5/U4) · $39.69 (U3)', unit: '15min', modifierTiers: { U5: '$55.55', U4: '$55.55', U3: '$39.69' } },
    '97156': { rate: '$35.79 (U5/U4) · $25.78 (U3)', unit: '15min', modifierTiers: { U5: '$35.79', U4: '$35.79', U3: '$25.78' } },
    '97157': { rate: '$71.43 (U5/U4) · $51.59 (U3)', unit: '15min', modifierTiers: { U5: '$71.43', U4: '$71.43', U3: '$51.59' } },
    '97158': { rate: '$15.88 (U5/U4) · $12.69 (U3) — UA (group 2–4) / UB (group 5–8)', unit: '15min', modifierTiers: { U5: '$15.88', U4: '$15.88', U3: '$12.69' } },
    '0362T': { rate: '$130.94 (U5/U4) · $112.29 (U3 BCBA)', unit: '15min', modifierTiers: { U5: '$130.94', U4: '$130.94', U3: '$112.29' } },
    '0373T': { rate: '$119.05 (U5/U4) · $107.13 (U3)', unit: '15min', modifierTiers: { U5: '$119.05', U4: '$119.05', U3: '$107.13' } },
    'T1026 UC': { rate: '$142.84/hour (ABA Clinical Management, BA-level)', unit: 'hour' },
    'T1026 UD': { rate: '$142.84/hour BA-level · $109.27 (U9 supervising BCaBA) — ABA Direct & Indirect Case Supervision', unit: 'hour', modifierTiers: { U9: '$109.27' } },
    'T1026 HI HK': { rate: '$206.33 flat (ISP Update)', unit: 'per service' },
  },
  sources: [LOD_53, HCA_ABA_PROVIDER()],
};

function HCA_ABA_PROVIDER(): SourceRef {
  return src(
    'https://www.hca.nm.gov/providers/aba-applied-behavior-analysis-provider-information/',
    'HCA — ABA Provider Information (billing instructions, attestations, fee-schedule links).'
  );
}

function nmMcoFloorRates(planName: string): RateTable {
  return {
    source: `Not separately published by ${planName}. Under LOD #53 the NM Medicaid FFS ABA fee schedule (see new-mexico-medicaid rates) is the ENFORCEABLE MINIMUM ${planName} and its sub-vendors must pay, retroactive to 1/1/2025 — so the floor is verified even though ${planName}'s actual contracted/paid rate at or above it is not published.`,
    effectiveDate: '2025-01-01 (floor)',
    byCode: {
      '97151': { rate: '≥ $112.65 (U3) / $130.94 (U5/U4) — LOD #53 floor', unit: '15min' },
      '97152': { rate: '≥ $58.33 (U3) / $65.47 (U5/U4) — LOD #53 floor', unit: '15min' },
      '97153': { rate: '≥ $19.85 (U1) / $23.35 (U9) / $32.31 (U3) — LOD #53 floor', unit: '15min' },
      '97154': { rate: '≥ $11.43 (U1) / $18.59 (U3) — LOD #53 floor', unit: '15min' },
      '97155': { rate: '≥ $39.69 (U3) / $55.55 (U5/U4) — LOD #53 floor', unit: '15min' },
      '97156': { rate: '≥ $25.78 (U3) / $35.79 (U5/U4) — LOD #53 floor', unit: '15min' },
      '97157': { rate: '≥ $51.59 (U3) / $71.43 (U5/U4) — LOD #53 floor', unit: '15min' },
      '97158': { rate: '≥ $12.69 (U3) / $15.88 (U5/U4) — LOD #53 floor', unit: '15min' },
      '0362T': { rate: '≥ $112.29 (U3) / $130.94 (U5/U4) — LOD #53 floor', unit: '15min' },
      '0373T': { rate: '≥ $107.13 (U3) / $119.05 (U5/U4) — LOD #53 floor', unit: '15min' },
    },
    sources: [LOD_53],
  };
}

/* -------------------- Layer 3: code-grid factories -------------- */

const NM_TX_QUIRK =
  'State PA quirk (Supplement 24-13 §3.17.1(A)): comprehensive treatment averaging UNDER 20 hrs/week requires PA regardless. Also PA-gated: >2 hrs T1026 UC/UD supervision per 10 hrs Stage 3.';

function nmMedicaidEntry(pa: string, notes?: string, statusOverrides?: Record<string, 'verified' | 'inferred' | 'unverified' | 'plan-dependent'>): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['home', 'clinic / office', 'community', 'school', 'telehealth (modality allowed; NM ABA-specific POS numbers not published in the fee schedule/Supplement)'],
    telehealth: 'unverified — Supplement 24-13 contemplates the settings above but does not publish ABA-specific telehealth POS/modifier mechanics.',
    modifiers: ['U5 (Qualifying Psychologist)', 'U4 (BCBA-D)', 'U3 (BCBA)', 'U9 (BCaBA)', 'U1 (Behavior Technician)', 'UA/UB group size (97154/97158)'],
    notes: [notes, 'Verify via: HCA/MCO — per-code daily unit caps are not published in NM primary sources (limits are program-level: comprehensive 30–40 hrs/wk, focused 10–25, the <20-hrs/wk PA quirk).']
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'inferred',
      telehealth: 'unverified',
      modifiers: 'verified',
      ...statusOverrides,
    },
    sources: [LOD_53, SUPPLEMENT_24_13],
  };
}

const PA_NO = 'Not required (LOD #53 fee schedule: "Prior Auth: NO")';
const PA_YES = 'Required (LOD #53 fee schedule: "Prior Auth: YES")';

function nmMedicaidGrid(planNote?: string): Record<string, CodeGridEntry> {
  const n = (extra?: string) => [planNote, extra].filter(Boolean).join(' ') || undefined;
  return {
    '97151': nmMedicaidEntry(PA_NO, n('Stage 2 BCBA assessment; done annually.')),
    '97152': nmMedicaidEntry(PA_NO, n()),
    '97153': nmMedicaidEntry(PA_YES, n(`Adaptive behavior treatment by protocol — the primary PA-gated code. ${NM_TX_QUIRK}`)),
    '97154': nmMedicaidEntry(PA_NO, n('Group adaptive behavior treatment; UA (group 2–4) / UB (group 5–8) size modifiers.')),
    '97155': nmMedicaidEntry(PA_NO, n('Protocol modification / supervision; ≥1 hr per 20 hrs of Stage 3 (97153/97154/97156) required with the recipient present.')),
    '97156': nmMedicaidEntry(PA_NO, n('Family adaptive behavior treatment guidance.')),
    '97157': nmMedicaidEntry(PA_NO, n()),
    '97158': nmMedicaidEntry(PA_NO, n('Group family guidance; UA/UB size modifiers.')),
    '0362T': nmMedicaidEntry(PA_NO, n()),
    '0373T': nmMedicaidEntry(PA_YES, n(`Extra-technician / intensifying protocol. ${NM_TX_QUIRK}`)),
  };
}

/* Commercial factories — national clinical policies publish no NM coding
   mechanics; unit caps / POS / telehealth modifiers ship 'unverified'. */

function nmCignaEntry(pa: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics published. ABA claims route to Evernorth payer ID 62308.',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [CIGNA_AUTISM_GUIDE],
  };
}

function nmAetnaEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (assessment and treatment), per national CPB 0554/0648; NM mandate NMSA §59A-22-49 governs fully-insured benefit terms.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement mechanics published, and Aetna runs no NM Medicaid plan.',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis.'), src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders.')],
  };
}

function nmUhcCommercialEntry(pa: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Optum Provider Express — the ABA Supplemental Clinical Criteria (BH803ABASCC) has no NM entry and no CPT coding mechanics; national two-step (assessment auth, then treatment auth), reviews every 4–6 months.',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf', 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC).')],
  };
}

function commercialGrid(entryFn: () => CodeGridEntry): Record<string, CodeGridEntry> {
  const codes = ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T'];
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of codes) grid[c] = entryFn();
  return grid;
}

function cignaCommercialGrid(): Record<string, CodeGridEntry> {
  const noPa = ['97151', '97152', '0362T'];
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
    grid[c] = nmCignaEntry(noPa.includes(c) ? 'Not required (per EN0499)' : 'Required — assessment + treatment plan with the ABA PA form (EN0499)');
  }
  return grid;
}

/* ==================== new-mexico-medicaid ==================== */

const newMexicoMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00162', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  medicaid271Notes: {
    mcoSegmentLocation: 'unverified',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      'Daily and monthly (834 daily enrollment files + monthly Omnicaid MMIS reconciliation, per the HCA Turquoise Care Systems Manual). The Conduent Eligibility Gateway supports real-time date-range 270/271 with a 1-year past look-back.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'unverified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify code 00162 = "New Mexico Medicaid" (Elig Y / Claim Y); this is pVerify\'s proprietary code, not a standard clearinghouse ID. The Conduent Eligibility Gateway 270/271 payer ID is 00000001234 (NM108=PI/NM109).',
    'payerId.availity': 'The public Availity list (2012 vintage) predates Turquoise Care and has no current NM Medicaid FFS row — confirm via Availity Essentials logged-in payer list.',
    'payerId.changeHealthcare': 'Conduent Eligibility Gateway ID 00000001234 documented; a distinct Change Healthcare NM Medicaid ID not resolved this pass. NOTE: HCA "Turquoise Claims" single-point-of-entry launched 3/23/2026 — legacy payor/segment IDs denied after 6/15/2026, so confirm current routing.',
    'medicaid271Notes.mcoSegmentLocation':
      'NM 271 MCO-enrollment loop/segment not retrievable this pass — the NM MMIS provider portal (nmmedicaid.portal.conduent.com) is Incapsula-blocked, and NM routes 270/271 through the generic Conduent Eligibility Gateway (no NM-specific MCO segment published). Request the "New Mexico Medicaid 270/271 Companion Guide" from Conduent EDI (egateway@conduent.com) or via the authenticated provider portal.',
    'medicaid271Notes.mcoCarrierCodes':
      'The HCA Turquoise Care Systems Manual lists MCO header names (BCBS/PRESBYTERIAN/UNITED HEALTH/MOLINA Turquoise Care) and TPL/834 constants (TPLBCBS, TPLPRESBYTERIAN, TPLUNITED, TPLMOLINA) — but those govern 834/TPL file exchange, NOT the provider-facing 271, so the 271 carrier-code map is unverified.',
  },
  sources: [PVERIFY_PAYER_LIST, CONDUENT_MEDICAID_PAYER_GUIDE, CONDUENT_COMPANION_GUIDE, TC_SYSTEMS_MANUAL, TURQUOISE_CLAIMS, AVAILITY_PAYER_LIST],
};

/* ==================== blue-cross-blue-shield-new-mexico ==================== */

const bcbsNmEdi: EdiRouting = {
  payerId: { pverify: '00046', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (integrated Turquoise Care)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00046 = "BCBS of New Mexico" (Elig Y / Claim Y).',
    'payerId.availity': 'No BCBSNM Medicaid row in the 2012 Availity list — confirm current ID via Availity Essentials.',
    'payerId.changeHealthcare': 'Confirm the Medicaid claims payer ID via BCBSNM\'s 270/271 companion guide (bcbsnm.com/docs/provider/nm/nm_eligibility_benefits_270_271.pdf) and Turquoise Care claims section.',
    'bhCarveOut.abaRidesOn': 'BH (incl. ABA) is administered within the integrated Turquoise Care plan (BCBSNM ABA policy CPCP011); no separate BH payer ID surfaced — ABA rides the BCBSNM Medicaid payer ID. Confirm at Turquoise Claims cutover.',
  },
  sources: [
    PVERIFY_PAYER_LIST,
    AVAILITY_PAYER_LIST,
    src('https://www.bcbsnm.com/docs/provider/nm/standards/cpcp/2026/cpcp011-3-20-2026.pdf', 'BCBSNM CPCP011 Applied Behavioral Analysis coding policy (eff. 3/20/2026).'),
  ],
};

/* ==================== presbyterian-health-plan-new-mexico ==================== */

const presbyterianNmEdi: EdiRouting = {
  payerId: { pverify: '02154', availity: 'unverified', changeHealthcare: '77048' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (in-house Turquoise Care BH for Medicaid)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify BO00106 = "Presbyterian Health Plan"; 02154 = "Presbyterian Health Plan-EDI" (both Elig Y).',
    'payerId.availity': 'The 2012 Availity list shows only legacy "PRESBYTERIAN SALUD (NM)" (DPRESA) — stale. Confirm current ID via Availity Essentials.',
    'payerId.changeHealthcare': 'Presbyterian Turquoise Care Medicaid GS03 payor ID 77048 / Loop 2010BB NM109 = NMPHP (per phs.org Turquoise Claims page). Claim.MD lists Presbyterian as PREHP.',
    'bhCarveOut.administrator': 'The guide prose establishes Presbyterian handles Turquoise Care (Medicaid) BH in-house (Magellan = Medicare/commercial only). A secondary source referenced "Magellan" for Presbyterian generally, but the primary Turquoise Claims page names no BH administrator — confirm ABA auth/claims are in-house via Presbyterian Provider line (505) 923-5757.',
    'bhCarveOut.abaRidesOn': 'Integrated Turquoise Care; ABA rides the Presbyterian Medicaid payer ID (77048). No separate BH payer ID surfaced.',
  },
  sources: [PVERIFY_PAYER_LIST, TURQUOISE_CLAIMS, AVAILITY_PAYER_LIST],
};

/* ==================== molina-healthcare-new-mexico ==================== */

const molinaNmEdi: EdiRouting = {
  payerId: { pverify: '00247', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (integrated Turquoise Care)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00247 = "Molina Healthcare of New Mexico" (Elig Y / Claim Y).',
    'payerId.availity': 'The 2012 Availity list shows "MOLINA HEALTHCARE NEW MEXICO" (FNM505) — predates Molina\'s 7/1/2024 Turquoise Care entry; treat as legacy. Confirm current ID via Availity Essentials.',
    'payerId.changeHealthcare': 'Confirm the current Turquoise Care claims payer ID / GS03 / NM109 via Molina NM provider EDI page (Molina mandates Availity Essentials for PA).',
    'bhCarveOut.abaRidesOn': 'Integrated Turquoise Care; ABA rides the Molina NM Medicaid payer ID, no two-hop. Verify against the Molina NM provider manual.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== unitedhealthcare-community-plan-new-mexico ==================== */

const uhcCommunityNmEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: '87748' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'Optum Behavioral Health (network administrator)', administratorPayerId: '87748', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'No NM-Community-Plan-specific pVerify code exists — only national rows (00192 "United Healthcare"; UHG007 "United Healthcare - Optum Behavioral Solutions").',
    'payerId.availity': 'No NM Community Plan row in the 2012 Availity list — confirm via Availity Essentials.',
    'payerId.changeHealthcare':
      'UNRESOLVED CONFLICT: the Optum NM Turquoise Care ABA QRG cited in the guide prose says claims Payer ID 87726 (ERA 86047); UHC\'s own current affiliate claims payer list shows NM Medicaid = 87748 (87726 = NM Dual SNP, "Former 87726") and 86047 = New Jersey (NM ERA appears under a multi-state row, candidate 04567). Reconcile via the current UHC Community Plan NM ABA/behavioral QRG or UHC EDI support before automating.',
    'bhCarveOut.administratorPayerId': 'Optum is the BH network administrator, but claims route to the UHC Community Plan Medicaid payer ID (87748), not a separate Optum payer ID — no two-hop on claims. ERA ID unresolved (see changeHealthcare).',
  },
  sources: [UHC_CLAIMS_PAYER_LIST, OPTUM_NM_QRG, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== aetna-new-mexico (commercial) ==================== */

const aetnaNmEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Aetna Behavioral Health (in-house)', administratorPayerId: '60054', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'Availity 2012 list shows "AETNA INSURANCE COMPANY" (F60054) — stale but the 60054 national ID remains current; confirm via Availity Essentials.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.',
    'bhCarveOut.administrator': 'Aetna administers ABA in-house on the same 60054 payer ID (no separate BH carve-out ID). Confirm any delegated ABA vendor via NM plan-specific benefits.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== cigna-new-mexico (commercial) ==================== */

const cignaNmEdi: EdiRouting = {
  payerId: { pverify: '00004', availity: 'unverified', changeHealthcare: '62308' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Evernorth Behavioral Health', administratorPayerId: '62308', abaRidesOn: 'bh', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00004 = "Cigna"; 00510 = "Cigna Behavioral". No "Evernorth" row in pVerify.',
    'payerId.availity': 'Availity 2012 list shows only "CIGNA" (FCIG22) — stale, no Evernorth row. Confirm via Availity Essentials.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.',
  },
  sources: [PVERIFY_PAYER_LIST, CIGNA_AUTISM_GUIDE, AVAILITY_PAYER_LIST],
};

/* ==================== unitedhealthcare-new-mexico (commercial) ==================== */

const uhcNmEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: 'unverified', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Optum Behavioral Health', administratorPayerId: '87726', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00192 = "United Healthcare"; UHG007 = "United Healthcare - Optum Behavioral Solutions" (both Elig Y / Claim Y).',
    'payerId.availity': 'Availity 2012 list shows "UNITED HEALTHCARE (UHC)" (F37128/8772T/F16412) — stale. Confirm via Availity Essentials.',
    'payerId.changeHealthcare': '87726 is UHC\'s dominant national commercial claims ID; the commercial NM ABA/ERA behavioral IDs are not separately published — confirm via the UHC commercial NM ABA QRG / Provider Express.',
    'bhCarveOut.administratorPayerId': 'Optum administers commercial ABA authorizations (Provider Express); claims typically route to the UHC medical payer ID 87726 (no two-hop on claims). Confirm the behavioral ERA ID via Provider Express.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== Layer 2 — STC interpretation maps ====================
   NM Medicaid: the same retrieval blockers already documented for Layer 1
   (newMexicoMedicaidEdi above) apply here — the NM MMIS provider portal
   (nmmedicaid.portal.conduent.com) is Incapsula-blocked, and NM's 270/271
   routes through the generic, payer-agnostic Conduent Eligibility Gateway
   (CONDUENT_COMPANION_GUIDE is an "All Payers" envelope doc with no
   NM-specific or Medicaid-specific service-type-code support table). No
   Turquoise Care MCO publishes an independent 270/271 companion guide of
   its own, and this file's own Layer-0 prose (src/data/payers/new-mexico.ts)
   was checked directly and contains no cited EPSDT/cost-share-amount fact
   (only a generic "the only reliable answer on limits and cost-sharing"
   pointer to live benefits verification) — so nothing here can be lifted
   to a verified deductible/cost-share field. new-mexico-medicaid and its 4
   Turquoise Care MCOs therefore ship fully 'unverified', reusing each
   guide's own already-cited Layer 7 phone/portal as the verifyVia contact
   rather than inventing one. */

function nmMedicaidUnverifiedStc(phoneNote: string, extraSources: SourceRef[] = []): StcMap {
  return {
    abaBenefitBucket: 'unverified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'unverified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'unverified',
    fieldStatus: {
      abaBenefitBucket: 'unverified',
      deductibleAppliesToAba: 'unverified',
      costShareType: 'unverified',
      copayUnit: 'unverified',
      oopMaxApplies: 'unverified',
      quality271Score: 'unverified',
    },
    verifyVia: {
      abaBenefitBucket: `NM's 270/271 traffic routes through the generic Conduent Eligibility Gateway (CONDUENT_COMPANION_GUIDE, an "All Payers" envelope doc with no NM- or Medicaid-specific service-type-code support table); the NM MMIS provider portal is Incapsula-blocked, and no Turquoise Care MCO publishes its own 270/271 companion guide. ${phoneNote}`,
    },
    sources: [CONDUENT_MEDICAID_PAYER_GUIDE, CONDUENT_COMPANION_GUIDE, ...extraSources],
  };
}

const newMexicoMedicaidStc = nmMedicaidUnverifiedStc('Confirm via the NM Medicaid Third-Party Assessor (Comagine Health, 1-866-962-2180) — see this guide\'s own vobContact.');
const bcbsNmStc = nmMedicaidUnverifiedStc('Confirm via BCBSNM Provider Customer Service (1-877-232-5518) or the Eligibility & Benefit IVR (1-888-349-3706) — see this guide\'s own vobContact.');
const presbyterianNmStc = nmMedicaidUnverifiedStc('Confirm via Presbyterian Prior Authorization/Utilization Management (505-923-5757 / 1-888-923-5757) — see this guide\'s own vobContact.');
const molinaNmStc = nmMedicaidUnverifiedStc('Confirm via Molina NM Provider Services ((855) 322-4078) — see this guide\'s own vobContact.');
const uhcCommunityNmStc = nmMedicaidUnverifiedStc(
  'Confirm via UHC Community Plan of NM Provider Services (1-888-702-2202) or Provider Express — see this guide\'s own vobContact.',
  [OPTUM_NM_QRG]
);

/* -------------------- Layer 7: contact & channel sources -------------------- */

const HCA_TPA = src(
  'https://www.hca.nm.gov/new-mexico-medicaid-third-party-assessor/',
  'HCA — New Mexico Medicaid Third Party Assessor page. Comagine Health is the state\'s TPA for FFS utilization review/prior authorization (behavioral health included); phone 1-866-962-2180, Monday through Friday 8:00 a.m. to 5:00 p.m. MT; portal at comagine.org/program/new-mexico-medicaid.'
);
const BCBSNM_MEDICAID_PRM = src(
  'https://www.bcbsnm.com/docs/provider/nm/medicaid-prm.pdf',
  'BCBSNM Medicaid (Turquoise Care) Provider Reference Manual. Managed Care Plan Contacts List: BCBSNM Medicaid program / Behavioral Health preauthorization line 1-877-232-5518 (also cited as Utilization Management — Preauthorization and Out-of-Network Referrals); Preauthorization Fax — Behavioral Health 888-530-9809 (outpatient service requests only); Provider Customer Service (claims, benefits) 1-800-693-0663; Eligibility & Benefit IVR 1-888-349-3706 (Mon–Fri 5 a.m.–10:30 p.m. MT, Sat 5 a.m.–2:30 p.m. MT); Availity self-service portal (1-800-282-4548). NOTE: this manual\'s numbers are the Medicaid/Turquoise Care lines — distinct from, and more reliable for Medicaid members than, the ABA Clinical Service Request Form\'s printed commercial/FEP phone/fax.'
);
const PHS_AUTHORIZATIONS = src(
  'https://www.phs.org/providers/authorizations',
  'Presbyterian Health Plan — Authorizations for Providers page. Prior Authorization/Utilization Management assistance at 505-923-5757 or 1-888-923-5757 (available during and after normal business hours); Turquoise Care behavioral health/ABA authorization fax (505) 843-3019; myPRES provider portal (mypres.phs.org) plus an online Turquoise Care PA submission portal (sso2.phs.org).'
);
const MOLINA_NM_CONTACT = src(
  'https://www.molinahealthcare.com/providers/nm/medicaid/contacts/contact_info.aspx',
  'Molina Healthcare of New Mexico — Provider Contact Us page. Provider Services (855) 322-4078 (TTY 711), Monday through Friday 8:00 a.m. to 5:00 p.m. MT; references the Availity Essentials provider portal for prior-authorization lookup tools. No Molina-specific ABA/behavioral-health fax published.'
);
const AETNA_ABA_PRECERT_FORM = src(
  'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/pharmacy-insurance/healthcare-professional/documents/outpatient-behavioral-health-BH-ABA-assessment-precert.pdf',
  'Aetna GR-69017-4 (7-26) — Outpatient Behavioral Health (BH) ABA Treatment Request: Required Information for Precertification. States to submit precertification via the Availity provider portal (Availity.com/aetnaproviders) or call the Precertification Department at 1-800-424-4047 (TTY 711); a separate FaxHub (833-596-0339) accepts supporting clinical information only, not new precert requests.'
);
const OPTUM_ABA_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC, annual review 08/2025, interim review 04/2026), hosted on the Provider Express portal (public.providerexpress.com). Confirms PA is required for ABA unless otherwise specified/mandated; contains no NM-specific coding mechanics and no provider-services phone/fax — commercial members verify via Provider Express / the number on the member\'s ID card.'
);

/* -------------------- Layer 7: vobContact objects -------------------- */

const newMexicoMedicaidContact: VobContact = {
  providerServicesPhone: '1-866-962-2180',
  hours: 'Mon–Fri 8:00 a.m.–5:00 p.m. MT (Comagine Health, the state\'s Third-Party Assessor)',
  portal: { name: 'Comagine Health (NM Medicaid Third-Party Assessor)', url: 'https://comagine.org/program/new-mexico-medicaid' },
  scriptedQuestions: [
    'Which Turquoise Care MCO (or FFS) is this member enrolled with — call routing differs by plan.',
    'Since HCA\'s "Turquoise Claims" cutover (legacy payor/segment IDs denied after 6/15/2026), what is the current EDI payer ID for eligibility and claims?',
    'Which loop/segment in the 271 response carries the member\'s assigned Turquoise Care MCO?',
    'Is there a published per-code daily/weekly unit cap for ABA, or only the program-level hour ranges (comprehensive 30–40 hrs/wk, focused 10–25)?',
    'Are ABA-specific telehealth POS codes or modifiers used for Medicaid FFS billing?',
  ],
  sources: [HCA_TPA],
};

const bcbsNmContact: VobContact = {
  providerServicesPhone: '1-877-232-5518',
  fax: '888-530-9809 (Behavioral Health preauthorization — outpatient service requests only)',
  ivrPath: 'Eligibility & Benefit IVR: 1-888-349-3706 (self-service eligibility/benefits lookup)',
  hours: 'IVR: Mon–Fri 5:00 a.m.–10:30 p.m. MT, Sat 5:00 a.m.–2:30 p.m. MT',
  portal: { name: 'Availity', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'Confirm whether BCBSNM supports real-time 270/271 eligibility for Turquoise Care, or only batch.',
    'The BCBSNM ABA Clinical Service Request Form header prints 800-851-7498 / fax 877-361-7659 — please confirm the correct Turquoise Care (Medicaid) routing number, since that header is commercial/FEP.',
    'Is there a published per-code daily unit cap for ABA, or only the state\'s program-level hour ranges?',
    'Are ABA-specific telehealth POS codes or modifiers used for Turquoise Care billing?',
    'What is the current Availity/Change Healthcare payer ID for BCBSNM Medicaid claims?',
  ],
  sources: [BCBSNM_MEDICAID_PRM],
};

const presbyterianNmContact: VobContact = {
  providerServicesPhone: '505-923-5757 (or 1-888-923-5757 toll-free)',
  fax: '(505) 843-3019 (Turquoise Care behavioral health/ABA authorization fax)',
  hours: 'Available during and after normal business hours (per phs.org)',
  portal: { name: 'myPRES', url: 'https://mypres.phs.org/' },
  scriptedQuestions: [
    'Confirm Turquoise Care (Medicaid) behavioral health/ABA authorizations are handled in-house — not routed to Magellan (which is Presbyterian\'s Medicare/commercial BH vendor only).',
    'Confirm whether Presbyterian supports real-time 270/271 eligibility checks.',
    'Is there a published per-code daily unit cap for ABA beyond the state\'s weekly-hour ranges?',
    'Are ABA-specific telehealth POS codes or modifiers used for Presbyterian Turquoise Care billing?',
  ],
  sources: [PHS_AUTHORIZATIONS],
};

const molinaNmContact: VobContact = {
  providerServicesPhone: '(855) 322-4078',
  hours: 'Mon–Fri 8:00 a.m.–5:00 p.m. MT',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'Which ABA codes currently require prior authorization under Molina\'s Turquoise Care plan — does the state baseline (PA only on 97153 & 0373T) apply, or does Molina run its own list?',
    'Confirm whether Molina supports real-time 270/271 eligibility verification.',
    'What is the current Availity/Change Healthcare payer ID for Molina NM Medicaid claims?',
    'Are ABA-specific telehealth POS codes or modifiers used for Molina Turquoise Care billing?',
    'Is there a published per-code daily unit cap, or only the state\'s program-level weekly-hour guidance?',
  ],
  sources: [MOLINA_NM_CONTACT],
};

const uhcCommunityNmContact: VobContact = {
  providerServicesPhone: '1-888-702-2202',
  fax: '1-888-541-6691 (Treatment Authorization Request Form — 97153/0373T PA)',
  portal: { name: 'Provider Express (One Healthcare ID) / uhcprovider.com', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'Please confirm the correct claims payer ID for UHC Community Plan of New Mexico ABA billing — the plan\'s own QRG says 87726, but UHC\'s current affiliate claims payer list says 87748.',
    'Please confirm the correct Electronic Remittance Advice (ERA) payer ID — the QRG says 86047, which UHC\'s national list maps to New Jersey, not New Mexico.',
    'Is there a published per-code daily/weekly unit cap for ABA beyond the state\'s program-level hour ranges?',
    'Are ABA-specific telehealth POS codes or modifiers used for UHC Community Plan billing?',
  ],
  sources: [OPTUM_NM_QRG],
};

const aetnaNmContact: VobContact = {
  providerServicesPhone: '1-800-424-4047',
  fax: '833-596-0339 (FaxHub — supporting clinical information only, not new precert requests)',
  portal: { name: 'Availity', url: 'https://availity.com/aetnaproviders' },
  scriptedQuestions: [
    'Confirm whether this member\'s plan is fully insured (NM mandate NMSA § 59A-22-49 applies) or self-funded ERISA (mandate exempt).',
    'What are the specific unit caps, POS restrictions, and telehealth modifier requirements for ABA codes under this member\'s plan?',
    'Confirm whether Aetna supports real-time 270/271 eligibility for this plan.',
    'Is a separate BH carve-out vendor involved for this plan, or does Aetna administer ABA in-house?',
  ],
  sources: [AETNA_ABA_PRECERT_FORM],
};

const cignaNmContact: VobContact = {
  providerServicesPhone: '800.926.2273',
  ivrPath: 'Autism Care Coordinator team (nonclinical): 877.279.7603 — patient benefits/eligibility, authorization status, and ABA-specific questions',
  hours: 'Provider Services: Mon–Fri 7:00 a.m.–7:00 p.m. CT; Autism Care Coordinator team: Mon–Fri 8:30 a.m.–5:00 p.m. CT',
  portal: { name: 'Evernorth Provider (Provider.Evernorth.com)', url: 'https://provider.evernorth.com' },
  scriptedQuestions: [
    'Confirm whether this member\'s plan is fully insured (NM mandate applies) or self-funded ERISA (mandate exempt).',
    'What are the specific unit caps, POS restrictions, and telehealth modifier requirements for ABA codes under this member\'s plan?',
    'Confirm whether Cigna/Evernorth supports real-time 270/271 eligibility for this plan.',
  ],
  sources: [CIGNA_AUTISM_GUIDE],
};

const uhcNmContact: VobContact = {
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'Confirm whether this member\'s plan is fully insured (NM mandate applies) or self-funded ERISA (mandate exempt).',
    'What are the specific unit caps, POS restrictions, and telehealth modifier requirements for ABA codes under this member\'s plan?',
    'Confirm the claims payer ID for this member\'s ABA benefit, and whether it differs from the standard UHC medical ID (87726).',
    'Confirm whether real-time 270/271 eligibility is supported for this plan.',
  ],
  sources: [OPTUM_ABA_SCC],
};

/* ==================== export ==================== */

export const newMexicoVob: Record<string, VobExtension> = {
  'new-mexico-medicaid': {
    edi: newMexicoMedicaidEdi,
    codeGrid: nmMedicaidGrid(),
    rates: NM_MEDICAID_RATES,
    stcMap: newMexicoMedicaidStc,
    vobContact: newMexicoMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'blue-cross-blue-shield-new-mexico': {
    edi: bcbsNmEdi,
    codeGrid: nmMedicaidGrid('State baseline via the shared Turquoise Care Level of Care Guidelines (defer to NMAC 8.321.2). BCBSNM treatment requests use the ABA Clinical Service Request Form (≥2 weeks / within 30 days before start).'),
    rates: nmMcoFloorRates('BCBSNM'),
    stcMap: bcbsNmStc,
    vobContact: bcbsNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'presbyterian-health-plan-new-mexico': {
    edi: presbyterianNmEdi,
    codeGrid: nmMedicaidGrid('State baseline; Presbyterian treatment requests use its own Stage 3 ABA Clinical Review Form (fax (505) 843-3019 or the Turquoise Care portal — NOT Magellan for Medicaid).'),
    rates: nmMcoFloorRates('Presbyterian Health Plan'),
    stcMap: presbyterianNmStc,
    vobContact: presbyterianNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'molina-healthcare-new-mexico': {
    edi: molinaNmEdi,
    codeGrid: nmMedicaidGrid('State baseline; Molina publishes no NM-specific ABA policy — submit PAs via Availity Essentials and confirm code-level PA in the portal per case.'),
    rates: nmMcoFloorRates('Molina Healthcare of New Mexico'),
    stcMap: molinaNmStc,
    vobContact: molinaNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-new-mexico': {
    edi: uhcCommunityNmEdi,
    codeGrid: nmMedicaidGrid('Optum-administered; the NM Turquoise Care QRG confirms the state PA surface exactly — only 97153 & 0373T require PA; submit on the NM Uniform PA Form via Provider Express or fax 1-888-541-6691.'),
    rates: nmMcoFloorRates('UnitedHealthcare Community Plan of New Mexico'),
    stcMap: uhcCommunityNmStc,
    vobContact: uhcCommunityNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-new-mexico': {
    edi: aetnaNmEdi,
    codeGrid: commercialGrid(nmAetnaEntry),
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no New Mexico-specific 270/271 STC document found.'),
    vobContact: aetnaNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-new-mexico': {
    edi: cignaNmEdi,
    codeGrid: cignaCommercialGrid(),
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no New Mexico-specific override found.'),
    vobContact: cignaNmContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-new-mexico': {
    edi: uhcNmEdi,
    codeGrid: commercialGrid(() => nmUhcCommercialEntry('Required — Optum two-step (assessment auth, then treatment auth); reviews every 4–6 months')),
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no New Mexico-specific override found.'),
    vobContact: uhcNmContact,
    lastUpdated: ACCESS_DATE,
  },
};
