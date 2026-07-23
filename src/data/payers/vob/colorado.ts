/* ================================================================
   VOB ENRICHMENT — Colorado, Layers 1 (EDI routing crosswalk),
   3 (code-level coverage grid) + 4 (Medicaid rate table).
   See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Colorado ABA is the Pediatric Behavioral Therapies (PBT) EPSDT
     benefit and is a STATEWIDE FEE-FOR-SERVICE CARVE-OUT: the four
     Regional Accountable Entities (RAEs) administer the capitated
     behavioral-health benefit, but PBT is not in that capitation —
     every PAR goes to the state UM vendor Acentra (Atrezzo /
     ColoradoPAR.com) and every claim to the state fiscal agent
     (Gainwell), regardless of the member's RAE. bhCarveOut is
     therefore 'none' on the Medicaid guide (ABA rides the medical
     FFS claim, no second hop), and a RAE showing on the 271 does
     NOT redirect ABA. (Verified: HCPF PM 25-005, PBT Billing Manual;
     already-verified corpus prose in src/data/payers/colorado.ts.)
   - KNOWN OBSTACLE: hcpf.colorado.gov 403s every automated fetch.
     The PBT Billing Manual, PM 25-005, the FY2025-26 fee schedule
     (.xlsx) and Special Provider Bulletin B2500528 could not be
     retrieved live this pass. Where a fact traces only to those
     documents, provenance is stated on the field/source and the
     value is carried from the already-verified corpus prose (itself
     built from those primary sources) — see the rates.source string
     and per-field verifyVia. The Colorado interChange 270/271
     companion guide (Gainwell) could not be retrieved either, so
     medicaid271Notes ships 'unverified' per the "never guess" rule.
   - Colorado's PBT allowable-code table is a REDUCED CPT set:
     97151 (+ the 97151-TJ per-15-min variant), 97153, 97154, 97155,
     97158. 97156 (family/caregiver guidance) is NOT a billable code
     in Colorado — it is absent from the allowable-code table and has
     no rate. 97152, 97157, 0362T and 0373T are likewise not on the
     PBT allowable-code table. The codeGrid is keyed to Colorado's
     actual billable set, and the non-covered codes carry explicit
     'No' entries (a high-value intake fact), not the forced CPT list.
   - The four commercial guides (aetna/cigna/unitedhealthcare-colorado)
     run on the SAME national clinical policies as every other state
     (Aetna CPB 0554/0648; Evernorth/Cigna EN0499; Optum SCC +
     national ABA Reimbursement Policy). Their EDI IDs are national,
     not Colorado-specific; their codeGrid mechanics come from those
     national policies with the same gaps flagged in georgia.ts. What
     is Colorado-specific for commercial members is the C.R.S.
     10-16-104(1.4) mandate layer, which lives in the prose guide, not
     in these VOB layers.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, March 2026 — fetched and parsed this pass. Row-level extraction: "00071 Colorado Medicaid" (Eligibility: Yes, Claim Status: Yes); "00001 Aetna", "00004 Cigna", "00192 United Healthcare", "UHG007 United Healthcare - Optum Behavioral Solutions" (all Elig/Claim: Yes).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — fetched and parsed this pass; the copy itself carries an "As of 08/08/2012" footer on every page (same staleness finding already applied to the Georgia guide). Row-level extraction: "77016 MEDICAID - CO" (short name MCAID_COD7); "60054 AETNA", "62308 CIGNA", "87726 UNITED HEALTHCARE". No "MEDICAID - UT" / Utah Medicaid row exists in this 2012 snapshot.',
  true
);
const CO_INTERCHANGE_COMPANION_GUIDE = src(
  'https://web.archive.org/web/20250211050831/https://hcpf.colorado.gov/sites/hcpf/files/CO_EDI_v5010%20X12_270_271_CompanionGuide%20-%2003062024.pdf',
  'Colorado Medical Assistance Program 270/271 Companion Guide, March 2024 v2.2 (Gainwell Technologies), 16pp — retrieved via Wayback archive this pass (live hcpf.colorado.gov 403s all automated fetches). Managed-care (ACC/RAE) enrollment is carried in Subscriber loop 2110C/MSG (pipe-delimited qualifier/value pairs — MCSTARTRSN$XX = Managed-Care Start Reason code+desc, MCD$XXXXXXXX = the related entity\'s Colorado Medicaid ID) plus related-entity loop 2120C (entity NPI in 2120C/NM109, name in NM1). "ACC" = Accountable Care Collaborative (Colorado\'s RAE program). There is NO carrier-code -> RAE lookup table (the RAE is identified per-member by name+NPI+Medicaid ID). The 271 carries NO ABA/PBT/benefit-level carve-out flag — a member\'s RAE attribution is visible but ABA\'s FFS carve-out is NOT derivable from the 271, only from benefit policy.'
);
const CO_PBT_BILLING_MANUAL = src(
  'https://web.archive.org/web/20250807084124/https://hcpf.colorado.gov/pbt-manual',
  'Pediatric Behavioral Therapies Billing Manual (HCPF) — retrieved via Wayback archive this pass (live hcpf 403s). States "All PBT services must be pre-approved in a Prior Authorization Request (PAR) process," including the 97151 assessment; PARs go to Acentra via the Atrezzo portal (ColoradoPAR.com); approvals valid up to 6 months; RBT minimum for 97153, BCBA minimum for 97155; EVV mandatory for home/community delivery. Its "Procedure Code Table — Allowable Procedure Coding" lists verbatim: 97153, 97154, 97155, 97158, 97151, 97151-TJ (the complete PBT billable set).'
);
const CO_PM_25_005 = src(
  'https://hcpf.colorado.gov/sites/hcpf/files/HCPF%20PM%2025-005%20Pediatric%20Behavioral%20Therapy%20Policy%20Clarification.pdf',
  'HCPF PM 25-005 — Pediatric Behavioral Therapy Policy Clarification (effective 2025-04-15): PBT is "reimbursed by Health First Colorado as fee-for-service"; RAE/MCO assignment is irrelevant to ABA (one PAR process, one fee schedule, one claims pipeline statewide). hcpf.colorado.gov 403s automated retrieval of this exact URL this pass; the FFS-carve-out fact is independently corroborated by the retrieved PBT Billing Manual and the already-verified corpus prose (src/data/payers/colorado.ts).'
);
const CO_FEE_SCHEDULE = src(
  'https://web.archive.org/web/20260123111147id_/https://hcpf.colorado.gov/sites/hcpf/files/01_CO_Fee%20Schedule_Health%20First%20Colorado_07012025%20v1.4.pdf',
  'FY2025-26 Health First Colorado Fee Schedule (July 2025 v1.4) — retrieved via Wayback archive (byte-range; PBT rows recovered from the PDF content streams; live hcpf 403s). Confirms the PBT allowable-code table order (97150 -> 97151-TJ -> 97151 -> 97153 -> 97154 -> 97155 -> 97158 -> 97161) with 97152, 97156, 97157, 0362T, 0373T genuinely ABSENT, and the 97151-TJ $40.24/unit row. The 7/1/2025 rates were superseded by the 10/1/2025 reductions (see B2500528/B2500530).',
  true
);
const CO_RATE_BULLETIN_B2500528 = src(
  'https://web.archive.org/web/20260217015928/https://hcpf.colorado.gov/sites/hcpf/files/Special%20Provider%20Bulletin%20-%20Rate%20Reductions%20092025_B2500528_0.pdf',
  'Special Provider Bulletin B2500528 (Sep 2025, under Executive Order D 2025 014) — retrieved via Wayback archive this pass. Reduced PBT rates for DOS on/after 2025-10-01: 97151 per-unit $27.59->$27.09 (flat assessment $882.78->$866.88), 97153 $18.17->$17.20, 97155 $26.62->$25.80, 97154 $11.51->$8.81 (-23%), 97158 $17.83->$9.34 (-48%); 97151-TJ $40.24 unchanged.',
  true
);
const CO_RATE_BULLETIN_B2500530 = src(
  'https://web.archive.org/web/20260114194341/https://hcpf.colorado.gov/sites/hcpf/files/Health%20First%20Colorado%20Provider%20Bulletin%20B2500530.pdf',
  'Health First Colorado Provider Bulletin B2500530 (Oct 2025) — retrieved via Wayback archive this pass; corroborates the 10/1/2025 PBT reductions including the 97151 flat assessment at $866.88 (paid at an 8-hr / 32-unit increment x $27.09/unit). WATCHLIST: the FY25-26 1.6% increase was REPEALED effective 10/1/2025 (the cuts stand, not restored), and a further across-the-board -2.0% reduction plus a "reset of pediatric behavioral rates" is approved effective 7/1/2026 (FY2026-27, HB26-1410) — so DOS-on/after-7/1/2026 rates are likely BELOW the figures shipped here; the 7/1/2026 fee schedule could not be located (no archived copy). Re-pull 01_CO_Fee Schedule 07012026 to confirm current rates.',
  true
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025) — fetched and parsed this pass; states verbatim "Use Evernorth payer ID 62308" for ABA/autism claims submitted through Cigna\'s EDI vendors, confirming ABA rides the SAME payer ID as Cigna medical (no separate Evernorth EDI hop).'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — all 10 CPT codes medically necessary when criteria met; no PA on assessment codes 97151/97152/0362T; pure clinical-necessity policy, contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 (Applied Behavior Analysis) — cross-references CPB 0648 for ASD coverage; no ABA coding/reimbursement mechanics published.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 covered if selection criteria met (0362T/0373T under "other CPT codes related to the CPB"); no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — clinical-necessity criteria (ICD-10 F84.0 only); contains zero CPT codes; points to a separate Optum ABA Reimbursement Policy for coding detail. Colorado has no entry in Optum\'s ABA State Mandates supplemental criteria (eff. Jan 2026).'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Colorado-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied to the Colorado guide as 'inferred' absent a confirmed Colorado-specific override."
);

/* -------------------- Colorado Medicaid (PBT FFS) codeGrid -------------------- */

/* Covered PBT codes: PAR required on everything (incl. 97151). Single rate
   per code, no credential-tier modifiers (TJ modifier only on 97151). POS
   settings (home/clinic/school/community) are covered; EVV mandatory for
   home/community. POS numbers and telehealth mechanics are not published in
   the sources retrievable this pass -> 'unverified' with verifyVia, not
   invented. */
function coPbtEntry(unitCap: string, capPeriod: string, notes: string, unitCapStatus: 'verified' | 'inferred' | 'unverified' = 'verified'): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — ALL PBT services need a Prior Authorization Request (PAR) via Acentra (Atrezzo / ColoradoPAR.com); approvals valid up to 6 months, reauth needs charts-and-graphs progress data.',
    unitCap,
    capPeriod,
    posAllowed: ['home', 'clinic', 'school', 'community', 'telehealth (modality; POS numbers not published in retrievable sources)'],
    telehealth: 'unverified — PBT telehealth POS/modifier mechanics not published in the sources retrievable this pass; EVV is mandatory for home/community delivery.',
    modifiers: ['TJ (97151 per-15-min variant only)', 'No credential-tier modifiers — single rate per code'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: unitCapStatus,
      capPeriod: unitCapStatus,
      posAllowed: 'verified',
      telehealth: 'unverified',
      modifiers: 'verified',
    },
    sources: [CO_PBT_BILLING_MANUAL, CO_FEE_SCHEDULE],
  };
}

function coNotCoveredEntry(note: string, status: 'verified' | 'unverified' = 'verified'): CodeGridEntry {
  return {
    covered: status === 'verified' ? 'No — not on the Colorado PBT allowable-code table' : 'unverified — not confirmed on the Colorado PBT allowable-code table',
    paRequired: 'N/A',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes: note,
    fieldStatus: { covered: status },
    sources: [CO_FEE_SCHEDULE],
  };
}

const coloradoMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': coPbtEntry(
    'Flat per assessment (billed once per 365 days); the 97151-TJ per-15-min variant is capped at 2 units per 365 days',
    '365 days',
    'Behavior-identification assessment. Pays a FLAT amount per assessment ($866.88 for DOS on/after 10/1/2025, down from $882.78 on the 7/1/2025 schedule — see rates), NOT per 15-min unit, once per 365 days; the 97151-TJ modifier variant pays per 15-min unit (2 units/365 days). PAR required despite being an assessment — unlike many states.'
  ),
  '97153': coPbtEntry(
    'Per approved PAR (up to a 6-month authorization period)',
    'per PAR (up to 6 months)',
    'Technician-delivered direct treatment — RBT/ABAT certification is a billing condition (minimum credential for 97153). Per-15-min unit rate cut for DOS on/after 10/1/2025 (see rates).',
    'inferred'
  ),
  '97154': coPbtEntry(
    'Per approved PAR (up to a 6-month authorization period)',
    'per PAR (up to 6 months)',
    'Group adaptive behavior treatment. Rate cut hardest in Bulletin B2500528 ($11.51 -> $8.81, -23%, DOS on/after 10/1/2025) — treat group service lines with caution (see rates).',
    'inferred'
  ),
  '97155': coPbtEntry(
    'Per approved PAR (up to a 6-month authorization period)',
    'per PAR (up to 6 months)',
    'Protocol modification — BCBA (or equivalent) minimum credential. Per-15-min unit rate cut for DOS on/after 10/1/2025 (see rates).',
    'inferred'
  ),
  '97158': coPbtEntry(
    'Per approved PAR (up to a 6-month authorization period)',
    'per PAR (up to 6 months)',
    'Group adaptive behavior treatment with protocol modification. Rate cut hardest of all in Bulletin B2500528 ($17.83 -> $9.34, -48%, DOS on/after 10/1/2025) — see rates.',
    'inferred'
  ),
  '97156': coNotCoveredEntry(
    'NOT COVERED in Colorado — 97156 (family/caregiver adaptive-behavior guidance) is absent from the PBT allowable-code table and has no rate. Caregiver training is a required element woven into the treatment plan, not separately billable revenue. This is a Colorado-specific intake fact worth surfacing before a family expects parent-training billing.'
  ),
  '97152': coNotCoveredEntry(
    'Not on the Colorado PBT allowable-code table — CONFIRMED absent from two fetched primary sources this pass: the PBT Billing Manual\'s "Allowable Procedure Coding" table (97153, 97154, 97155, 97158, 97151, 97151-TJ verbatim) and the FY25-26 v1.4 fee schedule (order jumps 97151 -> 97153). Colorado uses only the professional 97151 assessment.'
  ),
  '97157': coNotCoveredEntry(
    'Not on the Colorado PBT allowable-code table — confirmed absent from the PBT Billing Manual allowable-coding table and the v1.4 fee schedule.'
  ),
  '0362T': coNotCoveredEntry(
    'Not on the Colorado PBT allowable-code table (Colorado bills the Category-I CPT set, not the legacy Category-III codes) — confirmed absent from the PBT Billing Manual allowable-coding table and the v1.4 fee schedule.'
  ),
  '0373T': coNotCoveredEntry(
    'Not on the Colorado PBT allowable-code table — confirmed absent from the PBT Billing Manual allowable-coding table and the v1.4 fee schedule.'
  ),
};

const coloradoMedicaidRates: RateTable = {
  source:
    'FY2025-26 Health First Colorado Fee Schedule (July 2025 v1.4) + Special Provider Bulletins B2500528 & B2500530 (rate reductions eff. 10/1/2025) — all retrieved via Wayback archive this pass (live hcpf.colorado.gov 403s). Single flat statewide rate per code, no credential-tier modifiers (TJ modifier only on 97151). WATCHLIST (IMPORTANT): the FY25-26 1.6% increase was REPEALED effective 10/1/2025 (these cuts stand — NOT restored), and a further across-the-board -2.0% reduction PLUS a "reset of pediatric behavioral rates" is approved effective 7/1/2026 (FY2026-27, HB26-1410). As of 2026-07-23 the current DOS-on/after-7/1/2026 rates are therefore likely BELOW the figures below, but the 7/1/2026 fee schedule could not be located this pass (no archived copy) — treat the values here as the last CONFIRMED (10/1/2025) set and re-pull 01_CO_Fee Schedule 07012026.',
  effectiveDate: '2025-10-01',
  byCode: {
    '97151': { rate: '$866.88 flat per assessment (DOS on/after 10/1/2025; = 32 units x $27.09/unit at an 8-hr increment) — was $882.78 on the 7/1/2025 schedule; once per 365 days (frequency per the PBT Billing Manual PAR section)', unit: 'per assessment' },
    '97151-TJ': { rate: '$40.24 per 15-min unit (2 units per 365 days; not reduced in the 10/1/2025 bulletins)', unit: '15min' },
    '97153': { rate: '$17.20 per 15-min unit (cut from $18.17, DOS on/after 10/1/2025)', unit: '15min' },
    '97154': { rate: '$8.81 per 15-min unit (cut from $11.51, -23%, DOS on/after 10/1/2025)', unit: '15min' },
    '97155': { rate: '$25.80 per 15-min unit (cut from $26.62, DOS on/after 10/1/2025)', unit: '15min' },
    '97158': { rate: '$9.34 per 15-min unit (cut from $17.83, -48%, DOS on/after 10/1/2025)', unit: '15min' },
  },
  sources: [CO_FEE_SCHEDULE, CO_RATE_BULLETIN_B2500528, CO_RATE_BULLETIN_B2500530],
};

const coloradoMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00071', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — ABA/PBT is a statewide FFS carve-out; RAEs do not administer or pay ABA. Claims go to the state fiscal agent (Gainwell) on the medical FFS line.',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation: 'Managed-care (ACC/RAE) enrollment is carried in Subscriber loop 2110C/MSG (pipe-delimited qualifier/value pairs — MCSTARTRSN$XX = Managed-Care Start Reason code+description, MCD$XXXXXXXX = the related entity\'s Colorado Medicaid ID) plus related-entity loop 2120C (entity NPI in 2120C/NM109, name in NM1). "ACC" = Accountable Care Collaborative (Colorado\'s RAE program; the v2.2 guide does not use the literal term "RAE").',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Real-time / near-real-time (271 returned "within 30 minutes or less") and batch; the response is keyed to the date span requested in the 270 (no explicit monthly-vs-daily span rule is stated in the guide). CRITICAL: the 271 carries NO ABA/PBT/benefit-level carve-out flag — a member\'s RAE (ACC) attribution is visible, but ABA\'s FFS carve-out is NOT derivable from the 271. It must be applied from benefit policy: all PARs go to Acentra and claims to Gainwell FFS regardless of the RAE shown.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      'A "77016 MEDICAID - CO" row exists in the fetched Availity list, but that list carries an "As of 08/08/2012" footer and PREDATES Colorado\'s 2017 migration to the interChange/Gainwell MMIS — so the 2012 value is not trustworthy for the current system; left unverified. Confirm via the login-gated Availity Essentials Payer List search.',
    'payerId.changeHealthcare':
      'No Change Healthcare-specific source was retrievable this pass — confirm via the Optum/Change Healthcare payer finder for Health First Colorado / Colorado interChange. Direct submitters use the interChange trading-partner ID (there is no single numeric clearinghouse "payer ID" in the companion guide).',
    supportsRealtime:
      'The companion guide/FAQ states the 271 returns "within 30 minutes or less" (near-real-time / batch), not a sub-second RTE figure — true real-time support is unconfirmed. Confirm via the Colorado interChange (Gainwell) EDI enrollment.',
    'medicaid271Notes.mcoCarrierCodes': 'By design there is NO carrier-code -> RAE lookup table in the companion guide — the RAE/MCO is identified per-member by name+NPI (loop 2120C) and Colorado Medicaid ID (MSG MCD$). (Colorado RAEs: RMHP=Region 1, Northeast Health Partners=Region 2, Colorado Community Health Alliance=Region 3, Colorado Access=Region 4, plus the Elevate/Denver Health MCO; use HCPF\'s ACC Phase III reference to map region<->RAE.)',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CO_INTERCHANGE_COMPANION_GUIDE, CO_PM_25_005],
};

/* -------------------- commercial codeGrid factories (national policy) -------------------- */

function aetnaEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (specific form number not confirmed in either cited CPB)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located. Colorado-specific layer is the C.R.S. 10-16-104(1.4) mandate (fully-insured only), which governs limits, not coding mechanics.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AETNA_CPB0554, AETNA_CPB0648],
  };
}

function cignaEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it. We found no Colorado carve-out in EN0499 (only Virginia is carved out), so the no-assessment-PA fast path should apply to Colorado members.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CIGNA_EN0499],
  };
}

function uhcEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum ABA two-step authorization via Provider Express (assessment, then treatment); continued-service reviews every 4-6 months per the corpus prose (cadence not restated in the cited SCC).',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the Optum Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed Colorado-specific override. Colorado has no entry in Optum's ABA State Mandates supplemental criteria (eff. Jan 2026). Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY],
  };
}

/* ==================== aetna-colorado (commercial) ==================== */

const aetnaEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'unverified',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'Availity "60054 AETNA" is confirmed present but the fetched Availity list carries an "As of 08/08/2012" footer — inferred pending reconfirmation against a current Availity export (same treatment as the Georgia guide).',
    'payerId.changeHealthcare': 'Carried from the same 2012 Availity snapshot as the medical payer ID; confirm via the Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services / ABA precertification whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Colorado.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const aetnaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaEntry(),
  '97152': aetnaEntry(),
  '97153': aetnaEntry(),
  '97154': aetnaEntry(),
  '97155': aetnaEntry(),
  '97156': aetnaEntry(),
  '97157': aetnaEntry(),
  '97158': aetnaEntry(),
  '0362T': aetnaEntry(),
  '0373T': aetnaEntry(),
};

/* ==================== cigna-colorado (commercial) ==================== */

const cignaEdi: EdiRouting = {
  payerId: { pverify: '00004', availity: '62308', changeHealthcare: '62308' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Evernorth Behavioral Health',
    administratorPayerId: '62308',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const cignaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaEntry('Not required (per EN0499)'),
  '97152': cignaEntry('Not required (per EN0499)'),
  '97153': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaEntry('Not required (per EN0499)'),
  '0373T': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

/* ==================== unitedhealthcare-colorado (commercial) ==================== */

const unitedhealthcareEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'Availity "87726 UNITED HEALTHCARE" is confirmed present but the fetched Availity list carries an "As of 08/08/2012" footer — inferred pending reconfirmation against a current Availity export.',
    'payerId.changeHealthcare': 'Carried from the same 2012 Availity snapshot; confirm via the Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      'Provider Express / UHC provider services — pVerify lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" alongside the "00192 United Healthcare" medical entry; not resolved whether commercial Colorado ABA rides the 87726 medical ID or routes to Optum Behavioral. Colorado Medicaid runs through Rocky Mountain Health Plans (RMHP) but ABA is a state FFS carve-out — RMHP does not authorize or pay ABA.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_SCC],
};

const unitedhealthcareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcEntry('32 units/day (<=8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcEntry('32 units/day (<=8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcEntry('18 units/day (<=4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcEntry('24 units/day (<=6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcEntry('16 units/day (<=4 hrs)', []),
  '0373T': uhcEntry('32 units/day (<=8 hrs)', []),
};

/* ==================== export ==================== */

export const coloradoVob: Record<string, VobExtension> = {
  'colorado-medicaid': { edi: coloradoMedicaidEdi, codeGrid: coloradoMedicaidCodeGrid, rates: coloradoMedicaidRates, lastUpdated: ACCESS_DATE },
  'aetna-colorado': { edi: aetnaEdi, codeGrid: aetnaCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-colorado': { edi: cignaEdi, codeGrid: cignaCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-colorado': { edi: unitedhealthcareEdi, codeGrid: unitedhealthcareCodeGrid, lastUpdated: ACCESS_DATE },
};
