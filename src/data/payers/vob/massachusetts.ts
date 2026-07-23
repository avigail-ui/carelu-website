/* ================================================================
   VOB ENRICHMENT — Massachusetts, Layers 1 (EDI routing crosswalk)
   + 3 (code-level coverage grid) + 4 (Medicaid rate table). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - The MassHealth Standard Companion Guide for 270/271 (ASC X12N
     005010X279A1, cover-dated "November 2023" — 32 months old at
     access date, staleRisk: true) WAS retrieved and read in full.
     It confirms managed-care enrollment rides Loop 2110C: EB01 = L
     (PCC managed care) / MC (MCO, ACO, ICO, CP, SCO, or PACE) / D
     (Community Partner), EB03 = 30, EB05 returns the PLAN NAME AS
     FREE TEXT (verbatim: "MassHealth will generate additional 2110C
     loops to display all applicable benefit plans"). There is NO
     numeric carrier-code-to-plan-name table anywhere in this guide —
     that absence is itself the verified fact for
     medicaid271Notes.mcoCarrierCodes, not a gap to fill. MassHealth's
     own X12 identifier is an ETIN (DMA7384 at 2100A NM108/109,
     qualifier 46) — a different namespace from the clearinghouse
     payer IDs below; do not conflate the two.
   - 101 CMR 358.03(3), the official fee schedule (Mass. Register,
     published 9/27/2024, effective 10/1/2024), was retrieved and its
     table extracted in full. It contains EXACTLY 7 priced rows:
     97151, 97153, 97154, 97155, 97156, 97157, and H0031-U2.
     97152, 97158, 0362T, and 0373T do NOT appear anywhere in the
     published schedule — CONFIRMED ABSENT, not a retrieval failure.
     358.03(4)(b) provides for "individual consideration" pricing of
     unlisted/new codes; no administrative bulletin listing an
     applied rate for these four codes could be located this pass.
     Also confirmed: no unit caps, POS codes, telehealth mechanics, or
     billing modifiers appear anywhere in 101 CMR 358.00-358.05 — it
     is pure rate-setting text, closing out (not leaving open) that
     question.
   - The Carelon/MBHP ABA Performance Specification (updated
     2/15/2026, current) was retrieved in full. It is a clinical/
     administrative spec, not a billing manual: it contains NO CPT-
     level unit caps, POS codes, or telehealth billing modifiers
     (GT/95, POS 02/10) anywhere. It DOES confirm a real, usable
     group-session limit (up to 4.5 hrs/day, groups of 2-8 members)
     and the 1:10 LABA-to-technician supervision floor already in the
     main guide prose. Telehealth is confirmed allowed as a modality
     (parent/caregiver consent, must not replace in-person
     availability) with no modifier or POS code specified in the
     document itself.
   - pVerify's payer-list page (pverify.com/payer-list/, no version/
     date stamp visible) and the Availity Essentials payer list
     (same "As of 08/08/2012" stale PDF already cited in
     vob/georgia.ts and vob/florida.ts) were both queried. Multiple
     MassHealth-family candidates surfaced on pVerify (00133, 01398,
     BO00082, 01421) without a clear single canonical ID — shipped as
     'inferred' with the ambiguity flagged, not resolved by guessing.
     WellSense's current name, Tufts/Point32Health, and
     UnitedHealthcare were queried on pVerify but not found in
     retrieved page content this pass — flagged as likely truncation
     (the live page is very large), not confirmed absence.
   - WellSense's own "EDI Claims Companion Guide for 5010" (v7, March
     2024, ~28 months old, staleRisk: true) confirms payer ID 13337
     for professional claims (cross-validated against the 2012
     Availity snapshot's identical BMC HealthNet Plan number) but
     still names "Beacon Health Strategies" as the BH claims routing
     — per the main guide's already-verified facts, WellSense
     insourced BH administration 1/1/2026, so this document is now
     OUT OF DATE on the carve-out-administrator question specifically
     (the 13337 medical/professional payer ID is presumably
     unaffected). Flagged explicitly in wellsenseEdi below rather than
     silently treated as current.
   - Tufts/Point32Health's 270-271 companion guide ("May 2017", 9+
     years stale) documents a direct SOAP/CORE connection (ReceiverID
     170558746, CORERuleVersion 2.2.0) — a CAQH CORE identifier, NOT
     the same namespace as the 04298 clearinghouse payer ID found via
     Availity. Both are recorded distinctly, not conflated.
   - Mass General Brigham Health Plan's own claims page (first-party,
     current) states behavioral health claims route to Optum, payer
     ID 87726 — the SAME number as UnitedHealthcare's national medical
     payer ID per UHC's own 5/13/2026 payer list. How a clearinghouse
     distinguishes medical vs. BH claims when the ID is shared was
     not confirmed this pass — flagged via verifyVia rather than
     assumed resolved.
   - Commercial payers' (Aetna/Cigna/UnitedHealthcare) national
     clinical-necessity policies and coding mechanics are the SAME
     documents already verified in vob/georgia.ts — reused here as
     the same primary sources, not duplicated research. No
     Massachusetts-specific override of their coding/reimbursement
     mechanics was found for any of the three.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const MASSHEALTH_270_271_CG = src(
  'https://www.mass.gov/doc/masshealth-standard-companion-guide-health-care-eligibilitybenefit-inquiry-and-information-response-270271-0/download',
  'MassHealth Standard Companion Guide, Health Care Eligibility/Benefit Inquiry and Information Response (270/271), ASC X12N 005010X279A1, cover-dated "November 2023." Loop 2110C EB01 = L (PCC managed care) / MC (MCO, ACO, ICO, CP, SCO, or PACE) / D (Community Partner); EB03 = 30; EB05 returns the plan name as free text — no numeric carrier-code table exists. DTP01 = 307 (span dates). Both real-time (single-patient) and batch 270/271 supported, contingent on a Trading Partner Agreement on file. MassHealth\'s own X12 ETIN (not a clearinghouse payer ID): DMA7384 at 2100A NM108/109 (qualifier 46).',
  true
);
const CMR_358_FEE_SCHEDULE = src(
  'https://www.mass.gov/doc/rates-for-applied-behavior-analysis-effective-october-1-2024-0/download',
  '101 CMR 358.00: Rates for Applied Behavior Analysis, Final Adoption, published in the Mass. Register 2024-09-27 (effective 2024-10-01). The complete fee schedule at 358.03(3) contains exactly 7 priced codes: 97151=$30.73, 97153=$16.37, 97154=$13.91, 97155=$30.73, 97156=$30.73, 97157=$26.12, H0031-U2=$30.73. 97152, 97158, 0362T, 0373T are confirmed ABSENT from the published schedule — 358.03(4)(b) allows "individual consideration" pricing for unlisted codes; no bulletin naming an applied rate for these four was found. No unit caps, POS codes, telehealth mechanics, or modifiers appear anywhere in 358.00-358.05.',
  true
);
const CARELON_MBHP_PERFSPEC = src(
  'https://providers.masspartnership.com/pdf/PerfSpec-ABA.pdf',
  'Carelon/MBHP "Performance Specifications — Outpatient Services — Applied Behavior Analysis," updated 2026-02-15 (current). Contains no CPT-level unit caps, POS codes, or telehealth billing modifiers (GT/95, POS 02/10) — a clinical/administrative spec, not a billing manual. Confirms: group instruction up to 4.5 hrs/day in groups of 2-8 members; LABA supervision at ≥10% of direct-service hours (≤25% without documented rationale, ≥1 hr/month if ≤10 hrs/month direct treatment); telehealth allowed at parent/caregiver request when clinically appropriate, must not replace in-person availability, no modifier/POS code specified; services deliverable 7 days/week, 365 days/year as clinically appropriate; 14-calendar-day referral-to-service standard (42 CFR 441.56(e)); home/community-based by default, center-based only with documented clinical justification, school explicitly carved to IEP/DESE and not billed to the health plan.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/payer-list/',
  'pVerify public payer-list live page (no version/date stamp visible on the page). Confirmed rows: Massachusetts Medicaid 00133 (Elig/Claim: Y); MASSHEALTH 01398; MASSHEALTH-BO BO00082; MASSHEALTH-EDI 01421; MASSACHUSETTS BEHAVIORAL HEALTH (BHO) [MBHP] 00831; Health New England Eligibility Standard 00601; Fallon Community Health Plan 00092 (+ "Fallon Community Health Plan (Exception)" 01099); Mass General Brigham Health Plan 01589; Boston Medical Center Healthnet Plan [WellSense predecessor name] 01399; Aetna 00001; Cigna 00004 (+ Cigna Behavioral 00510). WellSense (current name), Tufts Health Plan/Point32Health, and UnitedHealthcare were queried but not found in retrieved page content this pass — likely truncation given the page\'s size, not confirmed absence.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the same document already cited in vob/georgia.ts and vob/florida.ts, carrying an "As of 08/08/2012" footer throughout (13.9 years old at access date). Massachusetts-relevant rows confirmed: 04286/F04286 = Health New England; 04298/F04298/4298 = Tufts Health Plan; 13337/F13337 = Boston Medical Center Health Plan; F62308 = Cigna; F60054 = Aetna; F87726/F8772T = United Healthcare; F12345 and FMCCBV both = Cigna Behavioral Health (the list is internally inconsistent between these two, a further reason to distrust it); 4293 = Neighborhood Health Plan (legacy Point32/Tufts-lineage plan). No row found for MassHealth, MBHP, WellSense\'s current name, Mass General Brigham Health Plan, or AllWays.',
  true
);
const WELLSENSE_EDI_CG = src(
  'https://www.wellsense.org/hubfs/Provider/Documents%20and%20Forms/Claims%20Resources/EDI_Claims_Companion_Guide_for_5010.pdf',
  'WellSense "EDI Claims Companion Guide for 5010," v7, March 2024. Confirms payer ID 13337 for professional claims (cross-validates the 2012 Availity/BMC HealthNet Plan number — independent agreement ~12 years apart). States: "Behavioral Health providers should call Beacon Health Strategies... for information about submitting electronic claims" — per the main WellSense guide\'s already-verified facts, WellSense insourced BH administration effective 1/1/2026, so THIS DOCUMENT IS NOW OUT OF DATE on the carve-out-administrator question specifically; the 13337 medical/professional payer ID is presumably unaffected by the insourcing.',
  true
);
const TUFTS_270_271_CG = src(
  'https://www.point32health.org/documents/thpp-270-271',
  'Point32Health/Tufts Health Plan 270-271 companion guide, cover-dated "May 2017." Documents a direct SOAP/CORE connection (ReceiverID 170558746, CORERuleVersion 2.2.0) — a CAQH CORE connection identifier, NOT the same namespace as the 04298 clearinghouse payer ID found via Availity; both recorded distinctly. No ABA-specific or behavioral-health carve-out language found in this generic X12 companion guide.',
  true
);
const MGB_CLAIMS_PAGE = src(
  'https://massgeneralbrighamhealthplan.org/providers/claims',
  "Mass General Brigham Health Plan's own claims page (first-party). Medical claims payer ID 04293. States behavioral health providers submit claims to Optum, payer ID 87726 — confirming the medical/BH carve-out split at the EDI level for this plan specifically."
);
const UHC_PAYER_LIST_2026 = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
  '"Claims Payer List for UnitedHealthcare, Affiliates and Strategic Alliances," dated 5/13/2026 (current, not stale). UnitedHealthcare Commercial: 87726. Row for "Other OptumHealth Behavioral Solutions (formerly United Behavioral Health and PacifiCare Behavioral Health) 87726 ... former payer id 33053" confirms UHC national medical and Optum Behavioral Health currently SHARE payer ID 87726 — the same number found on Mass General Brigham Health Plan\'s own claims page for its Optum BH carve-out (see MGB_CLAIMS_PAGE).'
);
const CARELON_NATIONAL_270271_CG = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/guides/270-271-companion-guide.pdf',
  'Carelon national 270-271 Companion Guide, cover-dated "January 2024 (Version 1.0)" but written for the older ASC X12N 004010X092A1 transaction-set version. ISA/GS Receiver ID BEACON963116116 for both inbound 270 and outbound 271; no Massachusetts-specific variant. Generic/national — not MA-specific evidence on its own, used here only to source the ISA identifier and to note Carelon\'s national BH carve-out routing pattern.',
  true
);
const CLAIM_MD_CARELON = src(
  'https://www.claim.md/payer/43324',
  'claim.md clearinghouse payer directory — Payer ID 43324, "Beacon Health Strategies" / Carelon Behavioral Health. Supports Professional (1500), Institutional (UB), Secondary claims, Eligibility/Benefits, and ERA.'
);
const STEDI_CARELON = src(
  'https://www.stedi.com/healthcare/network/carelon-behavioral-health',
  'Stedi healthcare network directory — primary payer ID BHOVO for Carelon Behavioral Health; aliases listed in Stedi\'s own network mapping: 00813, 11058, 43324, 4743, 5909, CHCBH, CHIPA, EJEYL, VALOP, Z1226, ZP4170. Supports 270/271, 837P/837I, 835.'
);
const FALLON_CARELON_MANUAL = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/ma/behavioral-health-policy-and-procedure-manual-for-providers-fallon.pdf',
  'Beacon/Carelon "Provider Manual | Fallon Health," revision stamped September 2021 (pre-Carelon-rebrand "Beacon Health Options" branding). Confirms EDI submission structurally ("submit EDI claims directly to Beacon, or through a billing intermediary... use Beacon\'s Emdeon Payer ID") but the actual numeric Emdeon payer ID is not printed anywhere in the extracted text — could not confirm a specific number from this document.',
  true
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499, effective 2026-05-15 — all 10 codes listed as medically necessary when criteria are met; pure clinical-necessity policy, contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers. No Massachusetts-specific carve-out (only Virginia is carved out by name).'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim: "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna\'s medical claims nationally (no separate Evernorth EDI hop).'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — Applied Behavior Analysis. National clinical-necessity policy; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers published.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given. No separate Aetna ABA billing/reimbursement policy located.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025, annual review 04/2026 — national criteria, contains zero CPT codes (ICD-10 F84.0 only); points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Massachusetts-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied here as 'inferred' absent a confirmed Massachusetts-specific override."
);
const OPTUM_STATE_MANDATES_MA = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum BH803ABA — ABA State Mandates supplemental criteria, Massachusetts entries (BH 803ABA STM12026, eff. Jan 2026): (1) MA Medicaid Early Intervention members, eff. 10/1/2021 — ABA not to exceed 30 hrs/week, BCBA-to-paraprofessional supervision at 1:10, supervisor and technician possibly both required present during home visits; (2) MA commercial members, eff. 1/1/2026 — Down syndrome (trisomy-21) coverage including ABA plus speech/OT/PT, implementing Ch. 388 of the Acts of 2024.'
);

/* -------------------- Layer 4: MassHealth ABA rates -------------------- */

const NOT_IN_SCHEDULE =
  'Not in the published 101 CMR 358.03(3) fee schedule — reimbursed by individual consideration per 358.03(4)(b); no administrative bulletin naming an applied rate for this code was found.';

const massHealthRates: RateTable = {
  source: '101 CMR 358.00: Rates for Applied Behavior Analysis, Final Adoption (Mass. Register, published 2024-09-27; effective 2024-10-01)',
  effectiveDate: '2024-10-01',
  byCode: {
    '97151': { rate: '$30.73', unit: '15min' },
    '97152': { rate: NOT_IN_SCHEDULE, unit: '15min' },
    '97153': { rate: '$16.37', unit: '15min' },
    '97154': { rate: '$13.91', unit: '15min', modifierTiers: { note: 'Group code — face-to-face, 2+ patients per session' } },
    '97155': { rate: '$30.73', unit: '15min' },
    '97156': { rate: '$30.73', unit: '15min' },
    '97157': { rate: '$26.12', unit: '15min', modifierTiers: { note: 'Multiple-family group, up to 8 participants' } },
    '97158': { rate: NOT_IN_SCHEDULE, unit: '15min' },
    '0362T': { rate: NOT_IN_SCHEDULE, unit: '15min' },
    '0373T': { rate: NOT_IN_SCHEDULE, unit: '15min' },
    'H0031-U2': { rate: '$30.73', unit: '15min', modifierTiers: { U2: 'Assessment/case-planning for home services by a licensed professional' } },
  },
  sources: [CMR_358_FEE_SCHEDULE],
};

/* -------------------- codeGrid factories -------------------- */

const GROUP_CODES = new Set(['97154', '97157']);
const UNSCHEDULED_CODES = new Set(['97152', '97158', '0362T', '0373T']);

function stateBaselineEntry(code: string, fieldConfidence: 'verified' | 'inferred', extraNotes?: string): CodeGridEntry {
  const isGroup = GROUP_CODES.has(code);
  const isUnscheduled = UNSCHEDULED_CODES.has(code);
  return {
    covered: isUnscheduled
      ? 'Yes (assumed covered under the comprehensive EPSDT benefit; not separately priced in the current 101 CMR 358.03 fee schedule — see Layer 4 rates)'
      : 'Yes',
    paRequired: 'Required — PA is required for all ABA services/hours/units, assessment and treatment alike',
    unitCap: isGroup ? '18 units/day (≤4.5 hrs), group size 2–8 members' : 'unverified — no per-code unit cap published in 101 CMR 358 or the Carelon/MBHP performance spec',
    capPeriod: isGroup ? 'day' : 'unverified',
    posAllowed: [
      'home/community (default)',
      'center-based/clinic (documented clinical justification required per the Carelon/MBHP performance spec)',
      'school (carved to IEP/DESE — not billed to the health plan)',
    ],
    telehealth:
      'Yes, as a modality — allowed at parent/caregiver request when clinically appropriate per the Carelon/MBHP performance spec; must not replace in-person availability. No telehealth modifier (GT/95) or POS code is specified in the spec.',
    modifiers: ['unverified — no HN/HO/HM/HP or GT/95-style modifiers found in 101 CMR 358 or the Carelon/MBHP performance spec'],
    notes: [
      isUnscheduled ? 'Not separately priced in the current fee schedule — see Layer 4 for the individual-consideration note.' : undefined,
      isGroup ? 'Group-session cap and size come from the Carelon/MBHP performance spec, not a fee-schedule/coding source.' : undefined,
      extraNotes,
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: isUnscheduled ? 'inferred' : fieldConfidence,
      paRequired: fieldConfidence,
      unitCap: isGroup ? fieldConfidence : 'unverified',
      posAllowed: fieldConfidence === 'verified' ? 'verified' : 'inferred',
      telehealth: fieldConfidence === 'verified' ? 'verified' : 'inferred',
      modifiers: 'unverified',
    },
    sources: [CMR_358_FEE_SCHEDULE, CARELON_MBHP_PERFSPEC],
  };
}

function wellsenseEntry(code: string): CodeGridEntry {
  const base = stateBaselineEntry(
    code,
    'inferred',
    'WellSense insourced behavioral-health administration from Carelon effective 1/1/2026; no WellSense-published billing/coding manual specific to ABA was found post-insourcing, so this entry is inferred from the pre-insourcing statewide Carelon/MBHP pattern rather than confirmed against a current WellSense document.'
  );
  return base;
}

function tuftsEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — via Point32Health\'s own updated ABA PA form and internal UM (not the Massachusetts Standard ABA PA form, not the Carelon/MBHP performance spec)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      "Point32Health self-manages ABA UM against its own medical-necessity guideline (InterQual + SmartSheets, new MNG eff. 1/1/2026) rather than the state-baseline Carelon/MBHP mechanics used by every other MassHealth administrator — no code-level unit-cap/POS/modifier detail was retrieved from Point32's own MNG or ABA PA form this pass. Verify via: Point32Health provider services, or the Tufts Health Together ABA Medical Necessity Guideline PDF (point32health.org).",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [TUFTS_270_271_CG],
  };
}

function mgbEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — via Optum\'s two-step authorization (assessment, then treatment); plan-level submission specifics not published, verify via Provider Express',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps/modifiers sourced from Optum's NATIONAL ABA Reimbursement Policy (2022RP501A), applied here as 'inferred' absent a confirmed MGB-specific override. For Early Intervention (under-3) members specifically, Optum's Massachusetts state-mandate entry (eff. 10/1/2021) caps ABA at 30 hrs/week and codifies 1:10 BCBA-to-paraprofessional supervision — a distinct, MA-specific rule layered on top of the national reimbursement policy's per-code unit caps.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES_MA],
  };
}

function aetnaEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (form GR-69017-4, per Aetna\'s national CPB 0554 policy)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy or Massachusetts-specific exhibit could be located. Aetna hosts and uses the Massachusetts Standard ABA PA Form (see the main guide), but that form governs process, not unit caps/POS/modifiers.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
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
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics or Massachusetts-specific exhibit are published in it.',
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
    paRequired: 'Required — step 1 of Optum\'s two-step authorization (assessment, then treatment); reviews every 4–6 months',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps/modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the Supplemental Clinical Criteria contains no CPT codes at all; applied here as 'inferred' absent a confirmed Massachusetts-specific override. Optum's BH803ABA State Mandates supplement separately codifies MA Medicaid EI's 30 hr/week cap + 1:10 supervision (eff. 10/1/2021) and MA commercial Down syndrome coverage (eff. 1/1/2026) — see the MGB and state-Medicaid entries for those. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES_MA],
  };
}

const ALL_CODES = ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T'];

function buildGrid(entryFn: (code: string) => CodeGridEntry): Record<string, CodeGridEntry> {
  return Object.fromEntries(ALL_CODES.map((code) => [code, entryFn(code)]));
}

/* ==================== masshealth-massachusetts-medicaid ==================== */

const CARELON_MULTI_ID_NOTE =
  '43324 (claim.md) / BHOVO (Stedi) / 00831 (pVerify) / ISA Receiver ID BEACON963116116 (Carelon national companion guide) — genuinely multiple identifiers across clearinghouses for the same Carelon/Beacon entity, not resolved to one canonical number.';

const massHealthMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00133', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: "Varies by plan — MBHP (Carelon) is the default/largest administrator (PCC Plan, Primary Care ACOs, HNE BeHealthy); five other administrators exist per plan (Carelon-direct for Fallon, WellSense in-house since 1/1/2026, Point32Health internal UM for Tufts Health Together, Optum for Mass General Brigham Health Plan) — see the individual MA plan guides for administrator-specific routing.",
    administratorPayerId: CARELON_MULTI_ID_NOTE,
    abaRidesOn: 'unverified',
    twoHopRequired: true,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "Loop 2110C EB01 = L (PCC managed care) / MC (MCO, ACO, ICO, CP, SCO, or PACE) / D (Community Partner); EB03 = 30 (service type); EB05 returns the PLAN NAME as free text; DTP01 = 307 for span dates.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Both real-time (single-patient inquiries) and batch supported, contingent on a Trading Partner Agreement on file; system availability 24/7 except scheduled maintenance.',
  },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists multiple MassHealth-family candidates (00133 'Massachusetts Medicaid', 01398 'MASSHEALTH', BO00082 'MASSHEALTH-BO', 01421 'MASSHEALTH-EDI') without a clearly canonical single ID — confirm which code your clearinghouse actually routes on before automating.",
    'payerId.availity': 'No MassHealth row found in the (stale, 2012) Availity payer list retrieved this pass — confirm directly via Availity onboarding.',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    'bhCarveOut.abaRidesOn':
      'Varies by which of the six administrators the member\'s specific plan uses (MBHP/Carelon and Fallon/Carelon ride BH; WellSense folds into its own medical claims post-insourcing; Tufts and MGB have their own distinct arrangements) — see the plan-specific guides rather than treating the state program as one carve-out.',
  },
  sources: [MASSHEALTH_270_271_CG, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CLAIM_MD_CARELON, STEDI_CARELON, CARELON_NATIONAL_270271_CG],
};

const massHealthMedicaidCodeGrid = buildGrid((code) => stateBaselineEntry(code, 'verified'));

/* ==================== mbhp-massachusetts ==================== */

const mbhpEdi: EdiRouting = {
  payerId: { pverify: '00831', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Is the BH administrator (Carelon Behavioral Health — MBHP is a Carelon company); not routing to a separate entity',
    administratorPayerId: CARELON_MULTI_ID_NOTE,
    abaRidesOn: 'bh',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.availity': 'No MBHP row found in the (stale, 2012) Availity payer list retrieved this pass — confirm directly via Availity onboarding, or via the claim.md (43324) / Stedi (BHOVO) IDs already confirmed.',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: "Carelon's national 270-271 companion guide (a distinct, non-MA-specific document) states Carelon does not support real-time eligibility transactions — not independently confirmed for MBHP's Massachusetts line specifically this pass.",
  },
  sources: [PVERIFY_PAYER_LIST, CLAIM_MD_CARELON, STEDI_CARELON, CARELON_NATIONAL_270271_CG],
};

const mbhpCodeGrid = buildGrid((code) => stateBaselineEntry(code, 'verified'));

/* ==================== fallon-health-massachusetts ==================== */

const fallonEdi: EdiRouting = {
  payerId: { pverify: '00092', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health (Beacon) — administers ABA directly for Fallon\'s MassHealth ACPPs',
    administratorPayerId: CARELON_MULTI_ID_NOTE,
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify also separately lists a 'Fallon Community Health Plan (Exception)' entry (01099) — confirm which code applies before automating routing.",
    'payerId.availity': 'No Fallon row found in the (stale, 2012) Availity payer list retrieved this pass — confirm directly via Availity onboarding.',
    'bhCarveOut.administratorPayerId':
      "Carelon/Beacon's own Fallon-specific provider manual (Sept 2021, stale) confirms EDI submission structurally (\"use Beacon's Emdeon Payer ID\") but does not print the actual numeric ID anywhere in its text — confirm directly with Carelon provider services.",
  },
  sources: [PVERIFY_PAYER_LIST, FALLON_CARELON_MANUAL, CLAIM_MD_CARELON, STEDI_CARELON],
};

const fallonCodeGrid = buildGrid((code) =>
  stateBaselineEntry(
    code,
    'inferred',
    "Fallon's own Carelon-administered provider manual confirms EDI submission structurally but does not restate code-level billing mechanics — this entry is inferred from the statewide Carelon/MBHP pattern, not independently confirmed against a Fallon-specific coding document."
  )
);

/* ==================== health-new-england-massachusetts ==================== */

const hneEdi: EdiRouting = {
  payerId: { pverify: '00601', availity: '04286', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'MBHP (Carelon) — BeHealthy Partnership members\' ABA authorization is the MBHP flow',
    administratorPayerId: CARELON_MULTI_ID_NOTE,
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      'Sourced from the stale (2012) Availity payer list — downgraded to inferred pending reconfirmation against a current Availity export (same treatment already applied in vob/georgia.ts for the identical staleness finding).',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CLAIM_MD_CARELON, STEDI_CARELON],
};

const hneCodeGrid = buildGrid((code) =>
  stateBaselineEntry(
    code,
    'inferred',
    'No HNE-specific ABA billing document was found — this entry is inferred from the statewide Carelon/MBHP pattern (BeHealthy Partnership routes ABA authorization to MBHP), not independently confirmed against an HNE-published coding document.'
  )
);

/* ==================== wellsense-massachusetts ==================== */

const wellsenseEdi: EdiRouting = {
  payerId: { pverify: '01399', availity: '13337', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: "In-house (WellSense) since 1/1/2026 — previously Carelon/Beacon Health Strategies",
    administratorPayerId: 'n/a post-insourcing — routes through WellSense\'s own payer ID (13337); pre-1/1/2026 claims used Carelon/Beacon (43324 / BHOVO)',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists this payer under its legacy name, 'Boston Medical Center Healthnet Plan' (01399) — WellSense's current name was queried but not found in retrieved pVerify content this pass; confirm the ID still applies under the current name.",
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    'bhCarveOut.administratorPayerId':
      "WellSense's own EDI Claims Companion Guide (March 2024) still names Beacon Health Strategies for BH claims — that document PRE-DATES the 1/1/2026 insourcing and is now out of date on this specific point; no post-insourcing WellSense EDI document was found confirming the current BH routing mechanics.",
    'bhCarveOut.abaRidesOn': 'Inferred from the insourcing announcement, not confirmed against a post-1/1/2026 WellSense billing document.',
    'bhCarveOut.twoHopRequired': 'Same as abaRidesOn.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, WELLSENSE_EDI_CG],
};

const wellsenseCodeGrid = buildGrid((code) => wellsenseEntry(code));

/* ==================== tufts-health-together ==================== */

const tuftsEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '04298', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'None — internal Point32Health UM (no external BH vendor)',
    administratorPayerId: 'n/a',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'Not found on pVerify\'s payer-list page this pass — likely truncation (the live page is very large), confirm directly.',
    'payerId.availity':
      'Sourced from the stale (2012) Availity payer list — downgraded to inferred pending reconfirmation. Note: Tufts/Point32Health\'s own 270-271 companion guide (May 2017) documents a SEPARATE, non-payer-ID identifier for real-time eligibility — CAQH CORE ReceiverID 170558746 — which is not interchangeable with the 04298 clearinghouse payer ID; confirm which your integration actually needs.',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Tufts\' own 270-271 companion guide (2017, stale) describes a direct SOAP/CORE connection rather than standard clearinghouse real-time eligibility — not independently confirmed as still current.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, TUFTS_270_271_CG],
};

const tuftsCodeGrid = buildGrid(() => tuftsEntry());

/* ==================== mass-general-brigham-health-plan ==================== */

const mgbEdi: EdiRouting = {
  payerId: { pverify: '01589', availity: 'unverified', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health — the only MassHealth plan whose ABA runs through Optum',
    administratorPayerId: '87726',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
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
    'payerId.availity': 'No Mass General Brigham Health Plan / AllWays row found in the (stale, 2012) Availity payer list — confirm directly via Availity onboarding.',
    'bhCarveOut.administratorPayerId':
      "87726 is the SAME number as UnitedHealthcare's national medical payer ID (confirmed via UHC's own 5/13/2026 payer list). How a clearinghouse distinguishes MGB's medical claims from its Optum BH claims when the ID is shared (taxonomy code? submitter ID?) was not confirmed this pass — verify directly with Optum/UHC EDI support before automating routing.",
  },
  sources: [PVERIFY_PAYER_LIST, MGB_CLAIMS_PAGE, UHC_PAYER_LIST_2026],
};

const mgbCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mgbEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': mgbEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': mgbEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': mgbEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': mgbEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': mgbEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': mgbEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': mgbEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': mgbEntry('16 units/day (≤4 hrs)', []),
  '0373T': mgbEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== aetna-massachusetts ==================== */

const aetnaEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: 'unverified' },
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
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'Sourced from the stale (2012) Availity payer list — downgraded to inferred pending reconfirmation against a current Availity export (same treatment already applied in vob/georgia.ts for the identical staleness finding).',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services or the ABA precertification process whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Massachusetts.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const aetnaCodeGrid = buildGrid(() => aetnaEntry());

/* ==================== cigna-massachusetts ==================== */

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
    'payerId.pverify': 'inferred',
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
    'payerId.pverify': "pVerify also separately lists 'Cigna Behavioral' (00510) — confirm which code applies to ABA claims specifically before automating routing.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_GUIDE],
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

/* ==================== unitedhealthcare-massachusetts ==================== */

const unitedhealthcareEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify':
      'Not found on pVerify\'s payer-list page in this session\'s query (a prior, separately-researched Georgia session found 00192 for UHC — not independently re-confirmed for Massachusetts this pass; do not assume it carries over without verification).',
    'payerId.availity':
      'Sourced from the stale (2012) Availity payer list — downgraded to inferred pending reconfirmation against a current Availity export.',
    'bhCarveOut.abaRidesOn':
      "UHC's national medical claims and Optum Behavioral Health carve-out currently share the SAME payer ID (87726) per UHC's own 5/13/2026 payer list ('Other OptumHealth Behavioral Solutions ... 87726 ... former payer id 33053'). How a clearinghouse distinguishes medical vs. BH claims when the ID is identical was not confirmed this pass — verify via Provider Express / UHC EDI support before automating routing.",
    'bhCarveOut.twoHopRequired': 'Same open question as abaRidesOn.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UHC_PAYER_LIST_2026],
};

const unitedhealthcareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== export ==================== */

export const massachusettsVob: Record<string, VobExtension> = {
  'masshealth-massachusetts-medicaid': { edi: massHealthMedicaidEdi, codeGrid: massHealthMedicaidCodeGrid, rates: massHealthRates, lastUpdated: ACCESS_DATE },
  'mbhp-massachusetts': { edi: mbhpEdi, codeGrid: mbhpCodeGrid, lastUpdated: ACCESS_DATE },
  'fallon-health-massachusetts': { edi: fallonEdi, codeGrid: fallonCodeGrid, lastUpdated: ACCESS_DATE },
  'health-new-england-massachusetts': { edi: hneEdi, codeGrid: hneCodeGrid, lastUpdated: ACCESS_DATE },
  'wellsense-massachusetts': { edi: wellsenseEdi, codeGrid: wellsenseCodeGrid, lastUpdated: ACCESS_DATE },
  'tufts-health-together': { edi: tuftsEdi, codeGrid: tuftsCodeGrid, lastUpdated: ACCESS_DATE },
  'mass-general-brigham-health-plan': { edi: mgbEdi, codeGrid: mgbCodeGrid, lastUpdated: ACCESS_DATE },
  'aetna-massachusetts': { edi: aetnaEdi, codeGrid: aetnaCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-massachusetts': { edi: cignaEdi, codeGrid: cignaCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-massachusetts': { edi: unitedhealthcareEdi, codeGrid: unitedhealthcareCodeGrid, lastUpdated: ACCESS_DATE },
};
