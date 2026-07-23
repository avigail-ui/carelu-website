/* ================================================================
   VOB ENRICHMENT — Arizona, Layers 1 (EDI routing crosswalk) +
   3 (code-level coverage grid) + 4 (Medicaid rate tables).
   See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Layer 4 (rates): arizona-ahcccs carries the AHCCCS ABA fee schedule
     (fixed rates eff. 11/1/2023, converted from By-Report; verified
     UNCHANGED through the FY26 schedule eff. 10/1/2025) with the
     credential-tier modifiers HM (below bachelor's / BT-RBT), HN
     (bachelor's / BCaBA), HO (master's / BCBA), HP (doctoral / BCBA-D),
     and the POS 12 (home) premium (~10–11.5% above office). CRITICAL
     corrections applied vs. the guide prose: 97155 has NO HM rate —
     $25.05 is HN (not HM), $29.82 HO, $37.28 HP; same no-HM pattern for
     97151 and 97158. 97156 and 97157 remain "By Report" (no fixed
     rate) — shipped 'unverified'. 0362T and 0373T are NOT on the AHCCCS
     ABA fee schedule at all — shipped 'unverified' (check the physician
     fee schedule / code lookup). The 9715x codes live on the AHCCCS
     PHYSICIAN fee schedule, not the Behavioral Health Outpatient one.
     ACC/DDD plans are capitated but ABA tracks this physician fee
     schedule as the benchmark — MCO/DDD guides carry it 'inferred' as a
     benchmark (NOT a statutory floor like NM). Commercial guides carry
     NO rate table (contract-specific per the build spec).
   - Layer 3 (code grid): AMPM 320-S sets NO PA rules of its own — PA is
     delegated to the plans. So the state guide's grid is "delegated";
     each plan's grid carries its own verified PA surface from the prose
     (Mercy Care & UHC/Optum: no PA on 97151/97152, PA on treatment;
     AzCH: CP.BH.104 code-by-code; Banner/Health Choice/Molina: not
     published as a standing rule → 'unverified' + verifyVia). Per-code
     daily UNIT CAPS are not published (AzCH uses hour BANDS, not caps)
     → unitCap 'unverified'. Modifiers = the HM/HN/HO/HP fee-schedule
     tiers (verified). arizona-ddd rides the member's DDD Health Plan
     (Mercy Care DD or UHCCP DD) — same PA machinery as those plans' ACC
     lines.
   - Layer 1 (EDI): the AHCCCS 5010A 270/271 Standard Companion Guide
     v4.0 (Sept 2022) WAS retrievable — medicaid271Notes on
     arizona-ahcccs carries the verified MCO-enrollment segment
     (2120C NM1*Y2 = Managed Care Organization), the 6-digit plan codes
     ACTUALLY shown in the guide's worked examples (UHCCP/Banner/Health
     Choice/Molina codes are NOT enumerated there → noted unverified),
     DDD 271 visibility, and daily eligibility granularity. AHCCCS
     integrated BH into ACC (10/1/2018) and DDD (10/1/2019), so ABA
     rides the ACC/DDD contractor's own medical payer ID — no separate
     RBHA/BH carve-out payer, no two-hop for standard members.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const AMPM_320S = src(
  'https://www.azahcccs.gov/shared/Downloads/MedicalPolicyManual/300/320S.pdf',
  'AHCCCS Medical Policy Manual, AMPM 320-S — Behavior Analysis Services. Covers ASD "and/or other diagnoses as justified by medical necessity"; BHP-recommended based on assessment; ≥6-month progress reports. Sets NO prior-authorization rules of its own — PA is delegated to the contractors.'
);
const AHCCCS_RATE_NOTICE_2023 = src(
  'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf',
  'AHCCCS Final Public Notice — FFS rate changes eff. 11/1/2023, converting the ABA codes from By-Report to fixed, credential-tiered rates (HM/HN/HO/HP modifiers). The notice itself flags group codes 97154/97158 as still being "explored."'
);
const AHCCCS_FEE_SCHEDULE_FY26 = src(
  'https://azahcccs.gov/PlansProviders/Downloads/FFSrates/ABA/FY26_Final_ABA_FeeSchedule.xlsx',
  'AHCCCS ABA Fee Schedule, FFY26 (eff. 10/1/2025) — identical fixed dollar figures to FFY24 (eff. 11/1/2023) for all fixed codes; 97156/97157 remain "BR" (By Report); adds a TJ modifier on 97154 = $14.93. 0362T/0373T are not on this schedule. Cross-confirms the 2023 notice.'
);
const AHCCCS_COMPANION_GUIDE = src(
  'https://www.azahcccs.gov/Resources/Downloads/EDIchanges/AZ270_271_CG.pdf',
  'AHCCCS 270/271 Standard Companion Guide, TR3 005010A1, Version 4.0 (Sept 2022). Information Source NM1*PR*2*AHCCCS...FI*866004791. MCO enrollment returns in 2110C (EB*3*IND*30*HM*<6-digit code + plan name>, REF*6P contract type, REF*M7 rate code, DTP*291 span) and the 2120C loop NM1*Y2 (Y2 = Managed Care Organization). Daily eligibility spans (D8/RD8). Real-time and batch both offered.'
);
const AHCCCS_EDI_TECH_DOCS = src(
  'https://www.azahcccs.gov/Resources/EDI/EDITechnicaldocuments.html',
  'AHCCCS EDI Technical Documents — hosts the 5010A 270/271 companion guide and the "270/271 Real Time Vendor Listing" (confirms both batch and real-time eligibility).'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list (March 2026). NOTE: the "Payer Code" column is pVerify\'s proprietary internal code, not a standard clearinghouse/CAQH ID.'
);
const OPTUM_RTE_LIST = src(
  'https://www.optum.com/',
  'OptumInsight Real-Time Eligibility Payer List (Optum/Change Healthcare) — AZMCD "Arizona Medicaid (AHCCCS)"; 03432 "Arizona Physicians IPA - Community and State" (Loop 2100B must contain the NPI); 66901 "Banner University Family Care"; AEMED "Schaller Anderson Mercy Care" (fka Mercy Care Plan); HECHA "Health Choice of Arizona". Base host cited; specific list is the OptumInsight RTE payer directory.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list. NOTE: the fetchable public copy carries an "As of 08/08/2012" footer on every page — it predates the current ACC/DDD contracts (Molina-AZ, AzCH rebrand, current B-UFC), so several current AZ rows are absent; IDs read from it are downgraded accordingly.',
  true
);
const AZCH_EDI = src(
  'https://www.azcompletehealth.com/providers/resources/electronic-transactions.html',
  'Arizona Complete Health electronic-transactions page: Payer ID 68069 (Medicaid, Medicare and Exchange) across approved clearinghouses; supports 837, 835, real-time 270/271 and 276/277; CORE Phase II certified; EDI contact EDIBA@centene.com.'
);
const AZBLUE_MEDICAID_EDI = src(
  'https://www.azblue.com/medicaid/providers/claims',
  'BCBSAZ Health Choice (azblue.com Medicaid) claims/EDI: Payer ID 62179 via Availity; supports Eligibility Inquiry and Response (270/271); 5010-compliant.'
);
const MERCY_CARE_CLAIMS = src(
  'https://www.mercycareaz.org/providers/claims',
  'Mercy Care claims/EDI materials — claims Payer ID 86052 (Availity portal). Administered by Aetna Medicaid Administrators.'
);
const UHC_AZ_ORIENT = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/azaba/azABA_Provider_Orient.pdf',
  'Optum — Arizona AHCCCS Autism/ABA Program provider orientation (BH4129): "All ABA services require prior authorization except 97151 and 97152"; ASD diagnosis not required; claims Payer ID 03432 on UHCprovider.com; 90-day filing deadline.'
);
const MERCY_CARE_ABA = src(
  'https://www.mercycareaz.org/providers/applied-behavior-analysis.html',
  'Mercy Care ABA provider page: no PA for 97151/97152; 97153–97158 require PA on the plan\'s ABA form; 6-month authorizations; 0362T/0373T are required billing codes.'
);
const AZCH_CP_BH_104 = src(
  'https://www.azcompletehealth.com/content/dam/centene/policies/behavioral-policies/CP.BH.104.pdf',
  'Centene/AzCH Clinical Policy CP.BH.104 — Applied Behavior Analysis (rev. 12/24): BCBA assessment + FBA/skills assessment + individualized plan; updated assessment & plan every 6 months; hour bands (focused 10–25, comprehensive 30–40; supervision 1–2 hrs per 10 direct). Defers to "state-defined ABA criteria" (AMPM 320-S) for non-ASD diagnoses.'
);
const DES_DDD_HEALTH_PLANS = src(
  'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info',
  'DES — DDD Health Plans Information: effective 10/1/2019, Mercy Care and UnitedHealthcare Community Plan provide the statewide DDD Health Plans (physical + behavioral health incl. ABA, CRS, limited LTSS) for ALTCS-DD members — so DDD ABA rides the member\'s DDD Health Plan (Mercy Care 86052 or UHCCP/APIPA 03432).'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide for BH Providers (Mar 2025) states verbatim "Use Evernorth payer ID 62308," "the same for all plans covered under Evernorth Behavioral Health" — confirms ABA claims route to Evernorth ID 62308 (single ID, no second EDI hop).'
);

/* -------------------- Layer 4: rate tables -------------------- */

const AZ_AHCCCS_RATES: RateTable = {
  source:
    'AHCCCS ABA fee schedule (physician fee schedule), fixed rates eff. 11/1/2023, verified unchanged through FFY26 (eff. 10/1/2025). Per-15-min by credential modifier: HM (below bachelor\'s/BT-RBT), HN (bachelor\'s/BCaBA), HO (master\'s/BCBA), HP (doctoral/BCBA-D). Rates below are the non-home (office/community) tier; POS 12 (home) pays a ~10–11.5% premium (given inline).',
  effectiveDate: '2023-11-01',
  byCode: {
    '97151': { rate: 'No HM tier. Office: $30.06 (HN) · $35.78 (HO) · $44.73 (HP). Home (POS 12): $33.27 / $39.60 / $49.50.', unit: '15min', modifierTiers: { HN: '$30.06', HO: '$35.78', HP: '$44.73' } },
    '97152': { rate: 'Office: $21.49 (HM) · $25.58 (HN) · $28.43 (HO/HP). Home: $23.95 / $28.54 / $31.71.', unit: '15min', modifierTiers: { HM: '$21.49', HN: '$25.58', HO: '$28.43', HP: '$28.43' } },
    '97153': { rate: 'Office: $17.91 (HM) · $21.32 (HN) · $23.69 (HO/HP). Home: $19.96 / $23.79 / $26.43.', unit: '15min', modifierTiers: { HM: '$17.91', HN: '$21.32', HO: '$23.69', HP: '$23.69' } },
    '97154': { rate: 'Office: $4.48 (HM) · $5.33 (HN) · $5.92 (HO/HP). Home: $4.99 / $5.95 / $6.61. FY26 adds TJ modifier = $14.93 (eff. 10/1/2025).', unit: '15min', modifierTiers: { HM: '$4.48', HN: '$5.33', HO: '$5.92', HP: '$5.92', TJ: '$14.93 (eff. 10/1/2025)' } },
    '97155': { rate: 'No HM tier. Office: $25.05 (HN) · $29.82 (HO) · $37.28 (HP). Home: $27.72 / $33.00 / $41.25.', unit: '15min', modifierTiers: { HN: '$25.05', HO: '$29.82', HP: '$37.28' } },
    '97156': { rate: 'unverified — "By Report" on the AHCCCS ABA fee schedule (eff. 2019-01-01, unchanged through FY26); not in the 2023 fixed-rate notice', unit: 'unverified' },
    '97157': { rate: 'unverified — "By Report" on the AHCCCS ABA fee schedule; not in the 2023 fixed-rate notice', unit: 'unverified' },
    '97158': { rate: 'No HM tier. Office: $6.26 (HN) · $7.46 (HO) · $9.32 (HP). Home: $6.93 / $8.25 / $10.31.', unit: '15min', modifierTiers: { HN: '$6.26', HO: '$7.46', HP: '$9.32' } },
    '0362T': { rate: 'unverified — not on the AHCCCS ABA fee schedule (FY24/FY26); check the physician fee schedule / code lookup', unit: 'unverified' },
    '0373T': { rate: 'unverified — not on the AHCCCS ABA fee schedule (FY24/FY26); check the physician fee schedule / code lookup', unit: 'unverified' },
  },
  sources: [AHCCCS_RATE_NOTICE_2023, AHCCCS_FEE_SCHEDULE_FY26],
};

function azBenchmarkRates(planName: string): RateTable {
  return {
    source: `Not separately published by ${planName}. AHCCCS ACC/DDD plans are capitated, but ABA tracks the AHCCCS physician fee schedule (see arizona-ahcccs rates) as the public benchmark — ${planName}'s actual contracted rate is not published (and is NOT a statutory floor, unlike New Mexico).`,
    effectiveDate: '2023-11-01 (AHCCCS benchmark)',
    byCode: {
      '97151': { rate: 'Benchmark: $30.06 (HN) / $35.78 (HO) / $44.73 (HP) office — see arizona-ahcccs', unit: '15min' },
      '97152': { rate: 'Benchmark: $21.49 (HM) / $25.58 (HN) / $28.43 (HO/HP) office — see arizona-ahcccs', unit: '15min' },
      '97153': { rate: 'Benchmark: $17.91 (HM) / $21.32 (HN) / $23.69 (HO/HP) office — see arizona-ahcccs', unit: '15min' },
      '97154': { rate: 'Benchmark: $4.48 (HM) / $5.33 (HN) / $5.92 (HO/HP) office — see arizona-ahcccs', unit: '15min' },
      '97155': { rate: 'Benchmark: $25.05 (HN) / $29.82 (HO) / $37.28 (HP) office — see arizona-ahcccs', unit: '15min' },
      '97156': { rate: 'unverified — By Report at AHCCCS', unit: 'unverified' },
      '97157': { rate: 'unverified — By Report at AHCCCS', unit: 'unverified' },
      '97158': { rate: 'Benchmark: $6.26 (HN) / $7.46 (HO) / $9.32 (HP) office — see arizona-ahcccs', unit: '15min' },
      '0362T': { rate: 'unverified — not on the AHCCCS ABA fee schedule', unit: 'unverified' },
      '0373T': { rate: 'unverified — not on the AHCCCS ABA fee schedule', unit: 'unverified' },
    },
    sources: [AHCCCS_RATE_NOTICE_2023, AHCCCS_FEE_SCHEDULE_FY26],
  };
}

/* -------------------- Layer 3: code-grid factories -------------- */

function azEntry(
  covered: string,
  pa: string,
  paStatus: 'verified' | 'inferred' | 'unverified' | 'plan-dependent',
  notes: string,
  sources: SourceRef[]
): CodeGridEntry {
  return {
    covered,
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['office/clinic', 'home (POS 12 — pays a ~10–11.5% premium on the AHCCCS schedule)', 'school', 'community', 'telehealth (modality allowed under AMPM 320-S; ABA-specific POS/modifier not itemized)'],
    telehealth: 'unverified — AMPM 320-S permits the settings above but does not publish ABA-specific telehealth POS/modifier mechanics.',
    modifiers: ['HM (below bachelor\'s / BT-RBT)', 'HN (bachelor\'s / BCaBA)', 'HO (master\'s / BCBA)', 'HP (doctoral / BCBA-D)'],
    notes,
    fieldStatus: {
      covered: covered.startsWith('Yes') ? 'verified' : 'inferred',
      paRequired: paStatus,
      unitCap: 'unverified',
      posAllowed: 'inferred',
      telehealth: 'unverified',
      modifiers: 'verified',
    },
    sources,
  };
}

const NO_DX = 'AMPM 320-S covers ASD "and/or other diagnoses as justified by medical necessity" — no strict autism-dx requirement. Per-code daily unit caps are not published (AzCH uses hour bands, not caps).';

/* State FFS: PA delegated to plans. */
function ahcccsGrid(): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
    grid[c] = azEntry('Yes', 'Delegated to plans — AMPM 320-S sets no PA of its own; PA rules live at the member\'s ACC/DDD plan (see per-plan guides).', 'verified', `${NO_DX} Verify the operative PA at the member's ACC or DDD Health Plan.`, [AMPM_320S]);
  }
  return grid;
}

/* Mercy Care / UHC-Optum pattern: no PA on 97151/97152, PA on treatment. */
function mercyUhcGrid(planLabel: string, source: SourceRef): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
    const isAssessment = c === '97151' || c === '97152';
    grid[c] = azEntry(
      'Yes',
      isAssessment
        ? 'Not required — assessment codes 97151/97152 are explicitly PA-exempt.'
        : 'Required — treatment codes require PA on the plan\'s ABA form/portal.',
      'verified',
      `${planLabel} ${NO_DX}`,
      [source, AMPM_320S]
    );
  }
  return grid;
}

/* Plans with no published standing PA rule (Banner, Health Choice, Molina). */
function azUnpublishedGrid(planLabel: string, source: SourceRef): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
    grid[c] = azEntry(
      'Yes',
      'unverified — not published as a standing rule; verify the current code row before quoting a start date.',
      'unverified',
      `${planLabel} ${NO_DX}`,
      [source, AMPM_320S]
    );
  }
  return grid;
}

/* Commercial AZ factories (national policies, no AZ coding mechanics). */
function azCommercialGrid(entryFn: (pa: string) => CodeGridEntry, treatmentPa: string, assessmentPa?: string, noPaCodes: string[] = []): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
    const pa = noPaCodes.includes(c) ? (assessmentPa ?? treatmentPa) : treatmentPa;
    grid[c] = entryFn(pa);
  }
  return grid;
}

function azAetnaEntry(pa: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding mechanics published. (Commercial only — for Aetna-administered AHCCCS members see mercy-care-arizona.) Steven\'s Law caps repealed by SB 1590 (2025).',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis.'), src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders.')],
  };
}

function azCignaEntry(pa: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only (no AZ carve-out); ABA claims route to Evernorth payer ID 62308. Steven\'s Law caps repealed by SB 1590 (2025).',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [CIGNA_AUTISM_GUIDE],
  };
}

function azUhcEntry(pa: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: pa,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Optum Provider Express — Optum\'s ABA State Mandates criteria carry an AZ commercial entry operationalizing SB 1590 (cap repeal), but no CPT coding mechanics; national two-step (assessment auth, then treatment). (Commercial only — for the AHCCCS plan see unitedhealthcare-community-plan-arizona.)',
    fieldStatus: { covered: 'verified', paRequired: 'verified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [src('https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf', 'Optum ABA Supplemental Clinical Criteria (BH803ABASCC).')],
  };
}

/* ==================== arizona-ahcccs ==================== */

const ahcccsEdi: EdiRouting = {
  payerId: { pverify: '00027', availity: 'unverified', changeHealthcare: 'AZMCD' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  medicaid271Notes: {
    mcoSegmentLocation:
      'MCO enrollment returns in Loop 2110C as EB*3*IND*30*HM*<6-digit plan code + plan name> (EB01=3 Active–Services Capitated, EB03=30 Health Benefit Plan Coverage, EB04=HM HMO), with REF*6P (contract type, e.g. ACC/CAP, ACC/PPC, ACC/FFS), REF*M7 (rate code) and DTP*291 (span). The DEFINITIVE managed-care segment is the 2120C loop NM1*Y2*2*<PLAN NAME> (Y2 = Managed Care Organization). Information Source = NM1*PR*2*AHCCCS...FI*866004791.',
    mcoCarrierCodes: {
      '010306': 'Mercy Care Plan',
      '010422': 'Arizona Complete Health Care',
      '010166': 'DCS/CMDP',
      '010115': 'CRS Fully Integrated',
      '999125': 'CRS Partial BH',
      '999998': 'AHCCCS American Indian HP (FFS)',
      '008690': 'FFS Temporary',
      '008715': 'AHCCCS QMB - Only',
      '008040': 'AHCCCS SLMB - Part B Buy-In',
    },
    eligibilitySpanGranularity:
      'Daily — dates use D8 (single CCYYMMDD) or RD8 (date range) via DTP*291/307/292; EB repeats up to 20 occurrences and overlapping enrollments are possible. Real-time and batch both offered (AHCCCS EDI Technical Documents page).',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00027 = "Arizona Medicaid (AHCCCS)" (Elig Y / Claim Y). Optum/Change Healthcare ID = AZMCD.',
    'payerId.availity': 'The public Availity list (2012 vintage) has no current AHCCCS row — confirm via Availity Essentials.',
    'medicaid271Notes.mcoCarrierCodes':
      'Downgraded to unverified 2026-07-23: re-fetch of the AHCCCS 270/271 CG v4.0 confirmed 7 of the 9 shipped codes present in the guide\'s worked 271 examples (010306 MERCY CARE PLAN, 010422 AZ COMPLETE HEALTH CARE, 010166 DCS/CMDP, 010115 CRS FULLY INTEGRATED, 999125 CRS PARTIAL BH, 008715 AHCCCS QMB-ONLY, 008040 AHCCCS SLMB-PART B BUY-IN), but 999998 (AHCCCS American Indian HP FFS) and 008690 (FFS Temporary) were NOT found anywhere in the fetched guide — those two are miscited. The guide also does NOT publish a full appendix mapping every plan — UHCCP/APIPA, Banner-UFC, BCBSAZ Health Choice, and Molina-AZ 6-digit codes are NOT enumerated there either (the segment FORMAT is confirmed; the specific per-plan codes are not). Confirm 999998/008690 against a current AHCCCS carrier-code source before quoting.',
  },
  sources: [PVERIFY_PAYER_LIST, OPTUM_RTE_LIST, AHCCCS_COMPANION_GUIDE, AHCCCS_EDI_TECH_DOCS, AVAILITY_PAYER_LIST],
};

/* ==================== mercy-care-arizona ==================== */

const mercyCareEdi: EdiRouting = {
  payerId: { pverify: '00841', availity: '86052', changeHealthcare: '86052' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (integrated — Aetna Medicaid Administrators)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00841 = "Mercy Care Arizona" (Elig Y). Related: 00842 "Mercy Care Plan (AHCCCS)", 06053 "Mercy Care RBHA".',
    'payerId.availity': 'Availity 86052 = "Mercy Care" (2012 list, but 86052 remains the current claims ID); Optum RTE = AEMED "Schaller Anderson Mercy Care".',
    'bhCarveOut.abaRidesOn': 'BH integrated since 10/1/2018 (ACC) / 10/1/2019 (DDD); ABA rides medical on 86052 — no two-hop.',
  },
  sources: [PVERIFY_PAYER_LIST, MERCY_CARE_CLAIMS, AVAILITY_PAYER_LIST, OPTUM_RTE_LIST],
};

/* ==================== unitedhealthcare-community-plan-arizona ==================== */

const uhcCommunityAzEdi: EdiRouting = {
  payerId: { pverify: '00205', availity: '03432', changeHealthcare: '03432' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'Optum Behavioral Health (network administrator; integrated)', administratorPayerId: '03432', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'Optum RTE = 03432 "Arizona Physicians IPA - Community and State" (Loop 2100B must contain the NPI); Optum AZ ABA orientation confirms claims Payer ID 03432. pVerify 00205 = "Arizona Physician\'s IPA - UHC Community Plan"; Availity 3432/F03432 "ARIZONA PHYSICIANS IPA".',
    'bhCarveOut.abaRidesOn': 'Optum administers the BH network but claims route to 03432 (integrated) — no two-hop.',
  },
  sources: [OPTUM_RTE_LIST, UHC_AZ_ORIENT, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== arizona-complete-health ==================== */

const azchEdi: EdiRouting = {
  payerId: { pverify: '01348', availity: 'unverified', changeHealthcare: '68069' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none (integrated — Centene)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'AzCH\'s own electronic-transactions page: Payer ID 68069 (Medicaid, Medicare and Exchange) across all clearinghouses. pVerify 01348 = "ARIZONA COMPLETE HEALTH" (predecessors 00356 Cenpatico-AZ, 00353 Bridgeway).',
    'payerId.availity': 'AzCH not present in the 2012 Availity list (only predecessors Bridgeway 68054 / Cenpatico 68048) — confirm via Availity Essentials; the plan\'s own page routes to 68069 regardless of clearinghouse.',
  },
  sources: [AZCH_EDI, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== banner-university-family-care ==================== */

const bannerEdi: EdiRouting = {
  payerId: { pverify: '01013', availity: 'unverified', changeHealthcare: '66901' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none (integrated — Banner / UA Health Plans)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'Optum RTE 66901 = "Banner University Family Care" is the ELIGIBILITY (270/271) ID (verified). The CLAIMS payer ID appears as 09830 in clearinghouse directories but Banner\'s own submissions page could not be fetched (header-overflow) — treat claims 09830 as unverified-from-primary; confirm via bannerhealth.com/bhpprovider/resources/claims/submissions.',
    'payerId.availity': 'The 2012 Availity list shows only legacy "UNIVERSITY FAMILY CARE - MARICOPA" (9908) / "BANNER HEALTH PLAN" (SX145) — confirm current B-UFC/ACC ID via Availity Essentials.',
  },
  sources: [OPTUM_RTE_LIST, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== health-choice-arizona (BCBSAZ Health Choice) ==================== */

const healthChoiceEdi: EdiRouting = {
  payerId: { pverify: '00233', availity: '62179', changeHealthcare: '62179' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (integrated — BCBSAZ)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00233 = "Health Choice Arizona" (Elig Y / Claim Y); 06042 = "Health Choice Pathway". Now branded "Blue Cross Blue Shield of Arizona Health Choice".',
    'payerId.availity': 'Availity 62179 = "HEALTHCHOICE OF ARIZONA"; azblue.com Medicaid EDI confirms Payer ID 62179 via Availity. Optum RTE = HECHA.',
    supportsRealtime: 'azblue.com confirms 270/271 support; confirm real-time vs. batch via the clearinghouse.',
  },
  sources: [AZBLUE_MEDICAID_EDI, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_RTE_LIST],
};

/* ==================== molina-healthcare-arizona ==================== */

const molinaAzEdi: EdiRouting = {
  payerId: { pverify: '00847', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none (integrated — Molina Complete Care of AZ)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00847 = "MOLINA COMPLETE CARE OF ARIZONA MEDICAID" (Elig Y).',
    'payerId.availity': 'No Molina-AZ row in the 2012 Availity list (Molina entered AZ later). Molina\'s AZ EDI page contracts The SSI Group clearinghouse and references Availity but does not print a payer ID — a candidate "A4353" surfaced only in a third-party doc, NOT a Molina primary source → unverified. Confirm via Molina AZ "Clearinghouse Information" page / Availity Essentials.',
    'payerId.changeHealthcare': 'No Molina-AZ entry in the Optum RTE list — confirm via Molina AZ EDI.',
  },
  sources: [PVERIFY_PAYER_LIST, src('https://www.molinahealthcare.com/providers/az/medicaid/resource/edi.aspx', 'Molina Healthcare of Arizona EDI page — supports 837/835/278/270-271/276-277; clearinghouse The SSI Group; payer ID not printed (directs to Clearinghouse Information).'), AVAILITY_PAYER_LIST],
};

/* ==================== arizona-ddd ==================== */

const dddEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'The member\'s DDD Health Plan (Mercy Care DD → 86052, or UHCCP DD → 03432)', administratorPayerId: '86052 / 03432', abaRidesOn: 'medical', twoHopRequired: false },
  medicaid271Notes: {
    mcoSegmentLocation:
      'DDD enrollment surfaces in the AHCCCS 271 via EB05 descriptions "DDD Subcontractor Plan" / "DES/DDD Targeted Support Coordination" (e.g. EB*3*IND*CQ**DES/DDD TARGETED SUPPORT COORDINATION with DTP*292), 2120C NM103 "DDDS Code and Description", and contract-type codes @ (DES/DD/RI) and S (MHS/CAP/DD). The member\'s actual DDD Health Plan (Mercy Care DD or UHCCP/APIPA DD) appears as the NM1*Y2 managed-care enrollment — so eligibility resolves in ONE AHCCCS 270/271 hop, and ABA then rides that plan\'s payer ID.',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Daily (same AHCCCS 271 mechanics as arizona-ahcccs).',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': 'DES/DDD has NO standalone EDI payer ID — ABA claims/eligibility ride the member\'s DDD Health Plan (Mercy Care DD → 86052 or UHCCP DD → 03432 per DDD Health Plan assignment). Verify which DDD Health Plan the member chose from their card.',
    'medicaid271Notes.mcoCarrierCodes':
      'The AHCCCS companion guide does not publish DDD-plan 6-digit carrier codes or explicit ABA claim-routing rules; the DDD Health Plan arrangement (Mercy Care DD / UHCCP DD) is established by the DES DDD Health Plans documents, not the 270/271 CG.',
  },
  sources: [DES_DDD_HEALTH_PLANS, AHCCCS_COMPANION_GUIDE, MERCY_CARE_CLAIMS, UHC_AZ_ORIENT],
};

/* ==================== aetna-arizona (commercial) ==================== */

const aetnaAzEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: 'unverified', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Aetna Behavioral Health (in-house)', administratorPayerId: '60054', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00001 = "Aetna" (Elig Y / Claim Y). Note: "we have Aetna" in AZ often means a Mercy Care (Medicaid) member — see mercy-care-arizona.',
    'payerId.changeHealthcare': '60054 is Aetna\'s standard national commercial/EDI ID (Aetna administers ABA in-house on the same ID), but it was not in the required pVerify/Availity/Optum primary PDFs this pass — confirm via Aetna EDI / Availity Essentials.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== cigna-arizona (commercial) ==================== */

const cignaAzEdi: EdiRouting = {
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
    'payerId.availity': 'No clean Cigna/Evernorth row in the 2012 Availity list — confirm via Availity Essentials.',
  },
  sources: [PVERIFY_PAYER_LIST, CIGNA_AUTISM_GUIDE, AVAILITY_PAYER_LIST],
};

/* ==================== unitedhealthcare-arizona (commercial) ==================== */

const uhcAzEdi: EdiRouting = {
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
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00192 = "United Healthcare"; UHG007 = "United Healthcare - Optum Behavioral Solutions". Note: "we have UnitedHealthcare" in AZ often means the UHC Community Plan (Medicaid/DDD) — see unitedhealthcare-community-plan-arizona.',
    'payerId.changeHealthcare': '87726 is UHC\'s dominant national commercial ID; the AZ commercial ABA/behavioral ERA IDs are not separately published — confirm via uhcprovider.com EDI / Provider Express.',
    'bhCarveOut.administratorPayerId': 'Optum administers commercial ABA authorizations; claims typically route to the UHC medical ID 87726 (no two-hop on claims).',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== export ==================== */

export const arizonaVob: Record<string, VobExtension> = {
  'arizona-ahcccs': { edi: ahcccsEdi, codeGrid: ahcccsGrid(), rates: AZ_AHCCCS_RATES, lastUpdated: ACCESS_DATE },
  'mercy-care-arizona': {
    edi: mercyCareEdi,
    codeGrid: mercyUhcGrid('6-month authorization periods; 0362T/0373T are required billing codes.', MERCY_CARE_ABA),
    rates: azBenchmarkRates('Mercy Care'),
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-arizona': {
    edi: uhcCommunityAzEdi,
    codeGrid: mercyUhcGrid('Optum-run; treatment via the Provider Express ABA Treatment Form or fax 1-888-541-6691; 90-day filing deadline.', UHC_AZ_ORIENT),
    rates: azBenchmarkRates('UnitedHealthcare Community Plan of Arizona'),
    lastUpdated: ACCESS_DATE,
  },
  'arizona-complete-health': {
    edi: azchEdi,
    codeGrid: (() => {
      const grid: Record<string, CodeGridEntry> = {};
      for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
        const isAssessment = c === '97151' || c === '97152';
        grid[c] = azEntry(
          'Yes',
          isAssessment
            ? 'Not published as a single rule — CP.BH.104 governs clinically; AzCH\'s PA page works code-by-code, so run the lookup before promising an auth-free 97151/97152.'
            : 'Required per CP.BH.104 (BCBA assessment + FBA/skills assessment + individualized plan; updated assessment & plan every 6 months).',
          isAssessment ? 'unverified' : 'verified',
          `Centene overlay CP.BH.104 (rev. 12/24), deferring to AMPM 320-S for non-ASD diagnoses. Hour bands: focused 10–25, comprehensive 30–40; supervision 1–2 hrs per 10 direct. 5-year eval-recency gate. ${NO_DX}`,
          [AZCH_CP_BH_104, AMPM_320S]
        );
      }
      return grid;
    })(),
    rates: azBenchmarkRates('Arizona Complete Health'),
    lastUpdated: ACCESS_DATE,
  },
  'banner-university-family-care': {
    edi: bannerEdi,
    codeGrid: azUnpublishedGrid('Banner publishes an ABA Prior Authorization Form (treatment PA exists) but no clinical policy, assessment-PA rule, or durations — pull the current form from bannerhealth.com/bhpprovider.', src('https://www.bannerhealth.com/bhpprovider/resources/bh/materials', 'Banner Health Plans behavioral-health materials — lists the ABA Prior Authorization Form; no clinical policy/assessment-PA rule published.')),
    rates: azBenchmarkRates('Banner-University Family Care'),
    lastUpdated: ACCESS_DATE,
  },
  'health-choice-arizona': {
    edi: healthChoiceEdi,
    codeGrid: azUnpublishedGrid('Blue Cross Blue Shield of Arizona Health Choice runs PA from frequently-updated PA-Guidelines grids (≥7 versions Jan 2024–May 2026), not a published ABA policy — pull the current grid rows for 97151–97158 from healthchoiceaz.com (PA line 1-800-322-8670 / fax 480-760-4732).', src('https://www.healthchoiceaz.com/providers/pa-guidelines', 'Health Choice Arizona PA guidelines (grids) — the code-level PA source of truth; grids revise several times a year.')),
    rates: azBenchmarkRates('Blue Cross Blue Shield of Arizona Health Choice'),
    lastUpdated: ACCESS_DATE,
  },
  'molina-healthcare-arizona': {
    edi: molinaAzEdi,
    codeGrid: azUnpublishedGrid('Molina publishes no distinct AZ ABA policy — its Prior Auth and Pre-Service Review Guide (Healthcare Services (844) 782-2678 / fax (833) 832-1015; Availity Essentials) is the operational front door; verify the ABA code rows before booking.', src('https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/az/Forms/MHAZ-Prior-Auth-and-Pre-Service-Review-Guide-508.pdf', 'Molina Healthcare of Arizona Prior Auth and Pre-Service Review Guide — the operational PA reference; no standing ABA rule published.')),
    rates: azBenchmarkRates('Molina Healthcare of Arizona'),
    lastUpdated: ACCESS_DATE,
  },
  'arizona-ddd': {
    edi: dddEdi,
    codeGrid: (() => {
      const grid: Record<string, CodeGridEntry> = {};
      for (const c of ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T']) {
        const isAssessment = c === '97151' || c === '97152';
        grid[c] = azEntry(
          'Yes',
          isAssessment
            ? 'Not required — both DDD Health Plans (Mercy Care DD, UHCCP DD) skip PA on 97151/97152, same as their ACC lines.'
            : 'Required — through the member\'s DDD Health Plan on its own ABA machinery (Mercy Care\'s ABA form, 6-month auths; or Optum\'s Provider Express Treatment Form).',
          'verified',
          `ALTCS-DD path — ABA rides Mercy Care DD or UHCCP DD, same PA machinery as those plans\' ACC lines. ${NO_DX}`,
          [DES_DDD_HEALTH_PLANS, AMPM_320S]
        );
      }
      return grid;
    })(),
    rates: azBenchmarkRates('the member\'s DDD Health Plan (Mercy Care DD / UHCCP DD)'),
    lastUpdated: ACCESS_DATE,
  },
  'aetna-arizona': {
    edi: aetnaAzEdi,
    codeGrid: azCommercialGrid(azAetnaEntry, 'Required — precertification (assessment and treatment), per national CPB 0554/0648; ASD only.'),
    lastUpdated: ACCESS_DATE,
  },
  'cigna-arizona': {
    edi: cignaAzEdi,
    codeGrid: azCommercialGrid(azCignaEntry, 'Required — assessment + treatment plan with the ABA PA form (EN0499)', 'Not required (per EN0499)', ['97151', '97152', '0362T']),
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-arizona': {
    edi: uhcAzEdi,
    codeGrid: azCommercialGrid(azUhcEntry, 'Required — Optum two-step (assessment auth, then treatment auth); reviews every 4–6 months'),
    lastUpdated: ACCESS_DATE,
  },
};
