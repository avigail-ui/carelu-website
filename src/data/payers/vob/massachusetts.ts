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
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef, StcMap } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, inheritFamilyStc } from './stc-defaults.js';

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
      fieldConfidence === 'verified'
        ? 'QA 2026-07-23: paRequired fieldStatus downgraded verified->unverified — neither 101 CMR 358 (a rate regulation that explicitly disclaims being an authorization: "101 CMR 358.00 is not authorization for or approval of the services") nor the Carelon/MBHP performance spec states a blanket ABA PA requirement; the requirement is plausibly true but its load-bearing source (MassHealth ABA Provider Manual/Bulletin) is not cited here — verify there.'
        : undefined,
      extraNotes,
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: isUnscheduled ? 'inferred' : fieldConfidence,
      // QA 2026-07-23: the blanket-PA claim is not stated in either cited source (101 CMR 358 disclaims
      // authorization; the performance spec only says "if authorization is required"), so a 'verified'
      // confidence is downgraded to 'unverified'. 'inferred' MCO callers are left as-is (a payer-pattern hedge).
      paRequired: fieldConfidence === 'verified' ? 'unverified' : fieldConfidence,
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
    'bhCarveOut.administrator': 'unverified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists multiple MassHealth-family candidates (00133 'Massachusetts Medicaid', 01398 'MASSHEALTH', BO00082 'MASSHEALTH-BO', 01421 'MASSHEALTH-EDI') without a clearly canonical single ID — confirm which code your clearinghouse actually routes on before automating.",
    'payerId.availity': 'No MassHealth row found in the (stale, 2012) Availity payer list retrieved this pass — confirm directly via Availity onboarding.',
    'payerId.changeHealthcare': 'Not researched this pass — confirm via Optum/Change Healthcare payer finder.',
    'bhCarveOut.administrator':
      'QA 2026-07-23 downgraded verified->unverified: the six-administrator roster and its plan-by-plan routing are editorial synthesis of the individual MA plan guides (which DO each document their administrator) — the cited MassHealth 270/271 companion guide contains zero BH-carve-out-administrator content, so it cannot carry a "verified" label here. Confirm each member\'s administrator from the plan-specific guide (MBHP/Carelon, Fallon/Carelon, WellSense in-house, Tufts/Point32Health, MGB/Optum).',
    'bhCarveOut.twoHopRequired':
      'QA 2026-07-23 downgraded verified->unverified: whether a second EDI hop is required varies by which administrator the member\'s plan uses (the administrator field itself says routing "varies by plan"), and the cited companion guide does not address BH claim-routing hops — resolve per the plan-specific guide.',
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
    'bhCarveOut.administrator': 'unverified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists this payer under its legacy name, 'Boston Medical Center Healthnet Plan' (01399) — WellSense's current name was queried but not found in retrieved pVerify content this pass; confirm the ID still applies under the current name.",
    'bhCarveOut.administrator':
      "QA 2026-07-23 downgraded verified->unverified: the '1/1/2026 in-house since previously Carelon/Beacon' claim is not stated in any of the three cited sources, and the cited WellSense EDI Companion Guide (Mar 2024) actively contradicts it (still routes BH to Beacon Health Strategies). The insourcing is TRUE but its supporting source — WellSense's own BH provider page (wellsense.org/providers/behavioral-health, 'all other products for MA and NH on Jan. 1, 2026') — is not among the cited refs; add/confirm it before restoring 'verified'.",
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

/* ==================== Layer 2 — STC interpretation maps ====================
   The MassHealth Standard Companion Guide (MASSHEALTH_270_271_CG, cited
   above) documents Loop 2110C's managed-care plan-enrollment structure
   (EB01/EB03/EB05) in detail but contains no service-type-code SUPPORT
   TABLE — no listing of which STCs (30, MH, A4-A8, etc.) the 271 actually
   returns financial detail for, and no statement on deductible/copay/
   coinsurance treatment for ABA-flavored codes. None of the other
   plan-specific EDI/claims documents already cited in this file
   (WELLSENSE_EDI_CG, TUFTS_270_271_CG, MGB_CLAIMS_PAGE, the Carelon/Beacon
   Fallon manual, or the Carelon national 270-271 guide) address STC support
   or cost-share treatment either — all are EDI-transaction/claims-routing
   documents, not STC/benefit-detail documents. masshealth-massachusetts-
   medicaid and its six Medicaid-side guides (MBHP + the 5 ACO/MCO plans)
   therefore ship fully 'unverified' rather than guessed from another
   state's or family's pattern (docs/vob-build.md ground rule 3).
   src/data/payers/massachusetts.ts (the Layer-0 prose file) was checked for
   a cited EPSDT cost-share primary source (grepped for "EPSDT", "$0",
   "cost share", "deductible", "copay") — it documents EPSDT covers ABA with
   no dollar/unit-of-service CAPS, but no source there states a $0 member
   cost-share/deductible figure, so deductibleAppliesToAba is NOT upgraded
   to 'no' for any of these seven guides; it remains honestly 'unverified'. */

function maMedicaidUnverifiedStc(phoneNote: string): StcMap {
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
      abaBenefitBucket: `The MassHealth 270/271 companion guide documents managed-care plan-enrollment structure (Loop 2110C) but no service-type-code support table or ABA-specific cost-share detail. ${phoneNote}`,
    },
    sources: [MASSHEALTH_270_271_CG],
  };
}

const massHealthMedicaidStc = maMedicaidUnverifiedStc('Confirm via MassHealth Customer Service for Providers, 1-800-841-2900.');
const mbhpStc = maMedicaidUnverifiedStc('Confirm via Beacon/Carelon Member Services, 1-888-421-8861.');
const fallonStc = maMedicaidUnverifiedStc("Confirm via Beacon/Carelon Member Services, 1-888-421-8861 (Fallon's ABA administrator).");
const hneStc = maMedicaidUnverifiedStc("Confirm via Beacon/Carelon Member Services, 1-888-421-8861 (HNE BeHealthy Partnership's ABA administrator).");
const wellsenseStc = maMedicaidUnverifiedStc('Confirm via WellSense Provider Service Center, 1-888-566-0008.');
const tuftsStc = maMedicaidUnverifiedStc('Confirm via Point32Health provider services, 1-888-257-1985.');
const mgbStc = maMedicaidUnverifiedStc('Confirm via Mass General Brigham Health Plan Provider Services, 1-855-444-4647, or Optum BH at 844-451-3518 (HMO/PPO) / 866-262-8067 (Medicare).');

/* -------------------- Layer 7: contact & channel sources --------------------
   Sourcing notes for this layer (read before editing):
   - MBHP/Fallon/HNE: the Carelon/Beacon "Behavioral Health Policy and
     Procedure Manual for Providers | Fallon Health" (same document already
     cited above as FALLON_CARELON_MANUAL, re-fetched and read in full this
     pass) states, in section 1.7/3.1: a National Provider Service Line at
     800-397-1630 (8 a.m.-8 p.m. ET, Mon-Fri) for contracting/credentialing,
     and a Beacon Member Services number (888-421-8861) used throughout the
     document for member eligibility/authorization/claims-status checks and
     complaints. A Claims Hotline (888-249-0478) and an eServices portal
     (beaconhealthoptions.com) are also confirmed. No general correspondence
     fax was found (only an Adverse Incident Report fax, 877-335-5452 -
     deliberately NOT reused here as a general fax since that would misdirect
     routine correspondence). This is a Carelon/Beacon-wide contact set, not
     Fallon-specific, so it is reused for MBHP and HNE (whose ABA
     administrator is also MBHP/Carelon per this file's already-verified
     facts).
   - MassHealth: mass.gov's own "Eligibility Verification System (EVS)
     Overview" page (fetched and read in full this pass) confirms MassHealth
     Customer Service for Providers - Main (800) 841-2900, Mon-Fri 8 a.m.-5
     p.m., TTY/TDD 711, fax (617) 988-8910, and the EVS/POSC portal. This
     independently cross-validates the AVR number (800-554-0042) already
     found in the Carelon/Beacon Fallon manual.
   - Aetna: Aetna's own "Support system: Behavioral Health Provider Manual"
     (cover-dated 8/22, ~46 months old at access date, staleRisk: true;
     fetched and read in full this pass) confirms ABA requires
     precertification by calling the number on the member's ID card; states
     HMO/Medicare Advantage plans call 1-800-624-0756, all other plans call
     1-888-632-3862 (1-888-MDAetna); Provider Service Center hours 8 a.m.-5
     p.m.; Availity.com is the provider portal. No general correspondence fax
     was found (only a tax-ID-change fax, 859-455-8650 - not reused here as a
     general fax for the same reason as above).
   - Cigna: reuses CIGNA_AUTISM_GUIDE (already cited above), which - read in
     full this pass - contains a dedicated "Contacting us" section: Autism
     Care Coordinator team at 877-279-7603 (Mon-Fri 8:30 a.m.-5 p.m. CT) for
     ABA eligibility/benefits/authorization, and a Provider Services
     department at 800-926-2273 (Mon-Fri 7 a.m.-7 p.m. CT) for billing;
     portal Provider.Evernorth.com.
   - UnitedHealthcare/Optum: Provider Express's own "Contact Us" page
     (fetched and read in full this pass) gives a Provider Services line
     (877-614-0484, Mon-Fri 7 a.m.-7 p.m. CT) for credentialing/contracting/
     network status - NOT eligibility or ABA precert specifically - and
     states explicitly: "Call the number on the back of the member's ID card
     for plan-related inquiries," meaning there is no single national
     eligibility/precert line; portal Providerexpress.com.
   - Mass General Brigham Health Plan: MGB's own claims page (already cited
     above as MGB_CLAIMS_PAGE, re-fetched this pass) states a general
     Provider Services number (855-444-4647), a provider portal
     (provider.massgeneralbrighamhealthplan.org), and - critically for
     ABA/BH specifically - that behavioral health claims route to Optum at
     844-451-3518 (HMO/PPO) or 866-262-8067 (Medicare); no Medicaid-specific
     line was distinguished on the page, flagged in the entry below.
   - WellSense: WellSense's own current "Massachusetts Provider Quick
     Reference Guide" (no version/date stamp visible, fetched and read in
     full this pass) gives a Provider Service Center (888-566-0008) and,
     separately, "Behavioral Health Services: Call Carelon Behavioral Health,
     LLC at 866-444-5155" plus a prior-auth fax (617-951-3464) and the
     HealthTrio provider portal. IMPORTANT: this current guide STILL lists
     Carelon as the BH/ABA contact, which sits in tension with this file's
     already-verified fact that WellSense insourced BH administration
     in-house effective 1/1/2026 - flagged as a scripted question below
     rather than silently resolved either way.
   ================================================================ */

const BEACON_FALLON_MANUAL_CONTACT = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/ma/behavioral-health-policy-and-procedure-manual-for-providers-fallon.pdf',
  'Carelon/Beacon "Behavioral Health Policy and Procedure Manual for Providers | Fallon Health" (Sept. 2021 revision date, stale). Section 3.1: National Provider Service Line 800-397-1630, 8 a.m.-8 p.m. ET Mon-Fri, for contracting/credentialing/provider relations. Section 1.7: "Call Beacon at 888.421.8861 to check member eligibility, number of visits available and applicable co-payments, confirm authorization, and get claims status." Section 8: Claims Hotline 888-249-0478 (Mon-Fri, hours as printed in the document). eServices portal at beaconhealthoptions.com. This is a Carelon/Beacon-wide (not Fallon-specific) contact set, reused for MBHP and HNE per this file\'s already-verified BH-administrator facts.',
  true
);
const MASSHEALTH_EVS_CONTACT = src(
  'https://www.mass.gov/info-details/eligibility-verification-system-overview',
  'Mass.gov "Eligibility Verification System (EVS) Overview" page (live, no staleness). MassHealth Customer Service for Providers - Main: (800) 841-2900, "Open Monday-Friday 8 a.m.-5 p.m."; TTY/TDD: 711; Fax: (617) 988-8910; email provider@masshealthquestions.com. EVS itself is described as available 24/7 via the Provider Online Service Center (POSC) or the Automated Voice Response (AVR) line - independently cross-validating the AVR number (800-554-0042) already found in BEACON_FALLON_MANUAL_CONTACT.'
);
const AETNA_BH_PROVIDER_MANUAL = src(
  'https://www.aetna.com/document-library/healthcare-professionals/documents-forms/bh-provider-manual.pdf',
  'Aetna "Support system: Behavioral Health Provider Manual," cover-dated 8/22 (~46 months old at access date, staleRisk: true). States: "Applied behavior analysis (ABA) services require precertification. To get ABA services precertified, call the number on the member\'s Aetna ID card and speak to a Member Services representative." Provider Service Center hours 8 a.m.-5 p.m.; HMO/Medicare Advantage plans call 1-800-624-0756 (TTY 711); "all other plans" call 1-888-632-3862 / 1-888-MDAetna (TTY 711); provider portal is Availity.com. No general correspondence fax found in this document (only a tax-ID-change fax, 859-455-8650, not reused here as a general fax).',
  true
);
const PROVIDER_EXPRESS_CONTACT_PAGE = src(
  'https://www.providerexpress.com/content/ope-provexpr/us/en/contact-us.html',
  'Optum Provider Express "Contact Us" live page (fetched and grepped for phone numbers directly, no staleness marker). "Provider Services" line 877-614-0484 (Mon-Fri, 7 a.m.-7 p.m. CT) is for credentialing/contracting/network-status/demographic questions only. States verbatim under "Member-Related Inquiries": "Call the number on the back of the member\'s ID card for plan-related inquiries" - confirming there is no single national Optum BH eligibility/ABA-precert phone line; benefits/eligibility are otherwise checked via the Provider Express secure portal.'
);
const MGB_PROVIDER_CONTACT = src(
  'https://massgeneralbrighamhealthplan.org/providers/claims',
  "Mass General Brigham Health Plan's own claims page (same URL already cited above as MGB_CLAIMS_PAGE, re-fetched and read in full this pass). Provider Services phone 855-444-4647; provider portal at provider.massgeneralbrighamhealthplan.org (24/7 for claims/eligibility per the page). Behavioral health claims specifically route to Optum: 844-451-3518 (HMO/PPO plans) or 866-262-8067 (Medicare plans) - the page does not separately distinguish a Medicaid/ACO line."
);
const TUFTS_CONTACT_US_PAGE = src(
  'https://www.point32health.org/provider/contact-us',
  'Point32Health "Contact us" live page for providers (fetched and grepped for phone numbers directly, no staleness marker). States verbatim: "Servicing inquiries for Tufts Health Direct, Tufts Health RITogether, Tufts Health One Care, and Tufts Health Together - MassHealth MCO Plan and Accountable Care Partnership Plans[:] Massachusetts Phone: 888-257-1985[,] Hours: Monday-Friday, 8 a.m.-5 p.m." Also lists a distinct "Tufts Health Plan portal" (providers.tufts-health.com) among Point32Health\'s secure portals; no fax number found on the page.'
);
const WELLSENSE_MA_QRG = src(
  'https://www.wellsense.org/hubfs/Provider/Training/Quick_Reference_Guide_MA.pdf?hsLang=en',
  'WellSense "Massachusetts Provider Quick Reference Guide" (no version/date stamp visible on the document; fetched and read in full this pass, presumed current). Provider Service Center: 888-566-0008. Prior Authorization Department fax: 617-951-3464. "Behavioral Health Services: Call Carelon Behavioral Health, LLC at 866-444-5155" (also listed with sub-lines: MassHealth 888-217-3501, Clarity plans 877-957-5600, Senior Care Options 855-833-8125). Provider portal: HealthTrio, accessed via wellsense.org. IMPORTANT: this current guide still lists Carelon as the BH/ABA contact, which is in tension with this file\'s already-verified fact that WellSense insourced BH administration in-house effective 1/1/2026 - not resolved here, flagged as a scripted question instead.'
);

/* -------------------- Layer 7: vobContact objects -------------------- */

const massHealthMedicaidContact: VobContact = {
  providerServicesPhone: '1-800-841-2900',
  hours: 'Monday-Friday, 8:00 a.m.-5:00 p.m. ET (MassHealth Customer Service for Providers); the Eligibility Verification System itself is available 24/7',
  ivrPath:
    "Automated Voice Response (AVR) eligibility line: 1-800-554-0042 (24/7) - independently confirmed by both mass.gov's EVS overview page and the Carelon/Beacon Fallon manual. For a live representative, call the main number above. TTY/TDD: 711.",
  portal: { name: 'MassHealth Provider Online Service Center (POSC) / Eligibility Verification System (EVS)', url: 'https://newmmis-portal.ehs.state.ma.us/EHSProviderPortal/providerLanding/providerLanding.jsf' },
  fax: '617-988-8910',
  scriptedQuestions: [
    'Which of the six BH administrators (MBHP/Carelon, Fallon/Carelon, WellSense in-house, Point32Health/Tufts internal UM, or Optum for Mass General Brigham Health Plan) manages this member\'s specific MassHealth plan?',
    'Since the 271 returns the enrolled plan name as free text rather than a numeric MCO code, can you confirm the exact plan name this member is enrolled in?',
    'For codes 97152, 97158, 0362T, and 0373T - since none of them appear in the published 101 CMR 358.03 fee schedule - what individual-consideration rate applies for this member\'s claims?',
    'Are there any per-code unit caps beyond the published group-code caps (97154/97157) that apply to this member?',
    'What billing modifiers, if any, does this plan require on ABA claims?',
  ],
  sources: [MASSHEALTH_EVS_CONTACT, BEACON_FALLON_MANUAL_CONTACT],
};

const mbhpContact: VobContact = {
  providerServicesPhone: '1-800-397-1630',
  hours: '8:00 a.m.-8:00 p.m. ET, Monday-Friday (National Provider Service Line)',
  ivrPath:
    'For member eligibility, authorization confirmation, visit counts, and claims status specifically, Beacon\'s manual directs providers to 1-888-421-8861 (also usable for complaints; TTY 711). Claims Hotline: 1-888-249-0478.',
  portal: { name: 'Beacon/Carelon eServices', url: 'https://www.beaconhealthoptions.com' },
  scriptedQuestions: [
    'Does MBHP support real-time (single-inquiry) 270/271 eligibility checks, or only batch submission?',
    'Are there any per-code daily or weekly unit caps beyond the published group-code (97154) cap?',
    'What billing modifiers does MBHP require on ABA claims (licensure tier, telehealth, or otherwise)?',
  ],
  sources: [BEACON_FALLON_MANUAL_CONTACT, CLAIM_MD_CARELON, STEDI_CARELON],
};

const fallonContact: VobContact = {
  providerServicesPhone: '1-800-397-1630',
  hours: '8:00 a.m.-8:00 p.m. ET, Monday-Friday (National Provider Service Line, shared across Carelon/Beacon\'s health-plan clients including Fallon)',
  ivrPath:
    'For member eligibility, authorization confirmation, and claims status specifically, call 1-888-421-8861 (Beacon Member Services). For Fallon Health\'s own (non-BH) medical/administrative line, the manual separately lists 1-800-868-5200.',
  portal: { name: 'Beacon/Carelon eServices', url: 'https://www.beaconhealthoptions.com' },
  scriptedQuestions: [
    "What is Carelon/Beacon's actual numeric EDI/Emdeon payer ID for Fallon Health claims (Fallon's own provider manual confirms the process but doesn't print the number)?",
    'Does Fallon support real-time single-patient 270/271 eligibility checks, or only batch?',
    'Are there any Fallon-specific per-code unit caps or billing modifiers that differ from the statewide Carelon/MBHP baseline?',
  ],
  sources: [BEACON_FALLON_MANUAL_CONTACT, FALLON_CARELON_MANUAL, CLAIM_MD_CARELON],
};

const hneContact: VobContact = {
  providerServicesPhone: '1-800-397-1630',
  hours: '8:00 a.m.-8:00 p.m. ET, Monday-Friday (National Provider Service Line - HNE\'s ABA authorization routes to MBHP/Carelon per this file\'s already-verified facts)',
  ivrPath: 'For member eligibility, authorization confirmation, and claims status specifically, call 1-888-421-8861 (Beacon Member Services).',
  portal: { name: 'Beacon/Carelon eServices', url: 'https://www.beaconhealthoptions.com' },
  scriptedQuestions: [
    "Can you confirm HNE's current Availity payer ID (the one on file is sourced from a 2012 list)?",
    'Does HNE / BeHealthy Partnership support real-time 270/271 eligibility checks?',
    'Are there HNE-specific per-code unit caps, POS restrictions, or billing modifiers that differ from the statewide MBHP baseline?',
  ],
  sources: [BEACON_FALLON_MANUAL_CONTACT],
};

const wellsenseContact: VobContact = {
  providerServicesPhone: '1-866-444-5155',
  ivrPath:
    'This is Carelon Behavioral Health\'s line, per WellSense\'s current MA Provider Quick Reference Guide ("Behavioral Health Services: Call Carelon Behavioral Health, LLC"). For general (non-BH) provider services, call 1-888-566-0008. This QRG still listing Carelon is in tension with the 1/1/2026 in-house BH insourcing already noted in this guide\'s edi layer - confirm current BH routing before relying on either number.',
  portal: { name: 'WellSense Provider Portal (HealthTrio)', url: 'https://www.wellsense.org' },
  fax: '617-951-3464',
  scriptedQuestions: [
    'Is ABA/behavioral health currently administered by Carelon Behavioral Health, or has WellSense fully insourced this function as previously indicated for 1/1/2026?',
    'Does ABA billing currently ride on the medical side (payer ID 13337) or through a separate BH hop?',
    "What is WellSense's current pVerify payer ID (the file on hand only has the legacy 'Boston Medical Center Healthnet Plan' listing)?",
    'Are there WellSense-specific per-code unit caps, POS rules, or billing modifiers for ABA codes 97151-97158/0362T/0373T?',
  ],
  sources: [WELLSENSE_MA_QRG, WELLSENSE_EDI_CG],
};

const tuftsContact: VobContact = {
  providerServicesPhone: '1-888-257-1985',
  hours: 'Monday-Friday, 8:00 a.m.-5:00 p.m. (Tufts Health Direct, Tufts Health RITogether, Tufts Health One Care, and Tufts Health Together - MassHealth MCO Plan and Accountable Care Partnership Plans, per Point32Health\'s own contact-us page)',
  portal: { name: 'Tufts Health Plan Provider Portal', url: 'https://providers.tufts-health.com/thp/portal/providers/login/' },
  scriptedQuestions: [
    "What is Tufts Health Together's pVerify payer ID for real-time eligibility checks?",
    'Does Tufts Health Together support standard clearinghouse real-time 270/271, or only the CAQH CORE connection described in its 2017 companion guide?',
    "What are the per-code daily/weekly unit caps for ABA codes 97151-97158/0362T/0373T under Tufts's own InterQual-based medical necessity guideline?",
    'What POS codes and telehealth billing modifiers does Tufts require for ABA?',
  ],
  sources: [TUFTS_CONTACT_US_PAGE, TUFTS_270_271_CG],
};

const mgbContact: VobContact = {
  providerServicesPhone: '1-855-444-4647',
  ivrPath:
    'Behavioral health/ABA claims route to Optum specifically: 844-451-3518 (HMO/PPO members) or 866-262-8067 (Medicare members), per MGB\'s own claims page - no Medicaid/ACO-specific BH line was distinguished on that page, so confirm which applies for this MassHealth member before calling.',
  portal: { name: 'MGB Health Plan Provider Portal', url: 'https://provider.massgeneralbrighamhealthplan.org/' },
  scriptedQuestions: [
    "Since MGB's medical claims and Optum BH claims share payer ID 87726, how does the clearinghouse route BH/ABA claims specifically - is a distinct submitter ID or taxonomy code required?",
    "Do MGB's ABA unit caps and modifiers match Optum's national reimbursement policy, or does MGB have a plan-specific override?",
    'For Early Intervention (under-3) MassHealth members, does the 30 hr/week ABA cap and 1:10 supervision ratio apply through MGB the same way it does through MBHP?',
  ],
  sources: [MGB_PROVIDER_CONTACT, MGB_CLAIMS_PAGE],
};

const aetnaContact: VobContact = {
  providerServicesPhone: '1-888-632-3862',
  hours: '8:00 a.m.-5:00 p.m., Monday-Friday (Provider Service Center); Aetna Behavioral Health staff available 24/7 for utilization-management discussions via the same numbers',
  ivrPath:
    "1-888-632-3862 (1-888-MDAetna) is for \"all other plans\" per Aetna's Behavioral Health Provider Manual; HMO-based and Aetna Medicare Advantage plans instead call 1-800-624-0756. ABA precertification itself is requested by calling the number on the member's own ID card and asking for a Member Services representative - confirm which plan-specific number applies before calling.",
  portal: { name: 'Availity Essentials (Aetna provider portal)', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'Does Aetna administer ABA in-house or through a separate behavioral-health carve-out vendor for this member\'s Massachusetts plan?',
    'What are the per-code daily/weekly unit caps for ABA codes 97151-97158/0362T/0373T?',
    'What POS codes and telehealth modifiers does Aetna require for ABA billing?',
    'What licensure-tier billing modifiers, if any, does Aetna require on ABA claims?',
  ],
  sources: [AETNA_BH_PROVIDER_MANUAL],
};

const cignaContact: VobContact = {
  providerServicesPhone: '1-877-279-7603',
  hours: 'Monday-Friday, 8:30 a.m.-5:00 p.m. CT (Autism Care Coordinator team, dedicated to ABA eligibility/benefits/authorization); the general Provider Services department (1-800-926-2273) is available Monday-Friday, 7:00 a.m.-7:00 p.m. CT for billing questions',
  portal: { name: 'Evernorth Provider Portal', url: 'https://provider.evernorth.com' },
  scriptedQuestions: [
    'What are Evernorth\'s per-code daily/weekly unit caps for ABA codes 97153-97158/0373T?',
    'What POS codes and telehealth billing modifiers does Evernorth require for ABA?',
    "Which pVerify payer ID applies to Cigna ABA claims specifically - 00004, or the separate 'Cigna Behavioral' 00510 listing?",
  ],
  sources: [CIGNA_AUTISM_GUIDE],
};

const unitedhealthcareContact: VobContact = {
  providerServicesPhone: '1-877-614-0484',
  hours: 'Monday-Friday, 7:00 a.m.-7:00 p.m. CT',
  ivrPath:
    "This Provider Express \"Provider Services\" line handles credentialing/contracting/network-status questions, NOT eligibility or ABA precertification specifically. Provider Express's own contact page states: \"Call the number on the back of the member's ID card for plan-related inquiries\" - there is no single national Optum BH eligibility/precert line; check eligibility via the Provider Express portal or the member-specific ID card number.",
  portal: { name: 'Provider Express (Optum Behavioral Health provider portal)', url: 'https://www.providerexpress.com' },
  scriptedQuestions: [
    "Does ABA ride on UHC's medical claims or a distinct Optum BH hop for this specific Massachusetts plan, given the shared payer ID 87726?",
    "What is UHC's current pVerify payer ID (not found in this session's query)?",
    "Do UHC's ABA unit caps and modifiers match Optum's national reimbursement policy, or is there a Massachusetts-specific override?",
    'What POS codes and telehealth billing modifiers does UHC/Optum require for ABA in Massachusetts?',
  ],
  sources: [PROVIDER_EXPRESS_CONTACT_PAGE, UHC_PAYER_LIST_2026, OPTUM_REIMBURSEMENT_POLICY],
};

/* ==================== export ==================== */

export const massachusettsVob: Record<string, VobExtension> = {
  'masshealth-massachusetts-medicaid': { edi: massHealthMedicaidEdi, codeGrid: massHealthMedicaidCodeGrid, rates: massHealthRates, stcMap: massHealthMedicaidStc, vobContact: massHealthMedicaidContact, lastUpdated: ACCESS_DATE },
  'mbhp-massachusetts': { edi: mbhpEdi, codeGrid: mbhpCodeGrid, stcMap: mbhpStc, vobContact: mbhpContact, lastUpdated: ACCESS_DATE },
  'fallon-health-massachusetts': { edi: fallonEdi, codeGrid: fallonCodeGrid, stcMap: fallonStc, vobContact: fallonContact, lastUpdated: ACCESS_DATE },
  'health-new-england-massachusetts': { edi: hneEdi, codeGrid: hneCodeGrid, stcMap: hneStc, vobContact: hneContact, lastUpdated: ACCESS_DATE },
  'wellsense-massachusetts': { edi: wellsenseEdi, codeGrid: wellsenseCodeGrid, stcMap: wellsenseStc, vobContact: wellsenseContact, lastUpdated: ACCESS_DATE },
  'tufts-health-together': { edi: tuftsEdi, codeGrid: tuftsCodeGrid, stcMap: tuftsStc, vobContact: tuftsContact, lastUpdated: ACCESS_DATE },
  'mass-general-brigham-health-plan': { edi: mgbEdi, codeGrid: mgbCodeGrid, stcMap: mgbStc, vobContact: mgbContact, lastUpdated: ACCESS_DATE },
  'aetna-massachusetts': {
    edi: aetnaEdi,
    codeGrid: aetnaCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Massachusetts-specific 270/271 STC document found.'),
    vobContact: aetnaContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-massachusetts': {
    edi: cignaEdi,
    codeGrid: cignaCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Massachusetts-specific override found.'),
    vobContact: cignaContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-massachusetts': {
    edi: unitedhealthcareEdi,
    codeGrid: unitedhealthcareCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Massachusetts-specific override found.'),
    vobContact: unitedhealthcareContact,
    lastUpdated: ACCESS_DATE,
  },
};
