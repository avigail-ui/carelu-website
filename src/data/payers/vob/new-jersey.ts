/* ================================================================
   VOB ENRICHMENT — New Jersey, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables, Medicaid lines
   only). See docs/vob-build.md for the spec. Covers NJ FamilyCare FFS,
   its 5 MCOs, and the 3 commercial guides:
   new-jersey-medicaid, horizon-nj-health,
   aetna-better-health-new-jersey, fidelis-care-new-jersey,
   unitedhealthcare-community-plan-new-jersey, wellpoint-new-jersey,
   aetna-new-jersey, cigna-new-jersey, unitedhealthcare-new-jersey.

   Sourcing notes (read before editing):
   - NJ FamilyCare's fiscal agent is Gainwell Technologies; the MMIS is
     NJMMIS. The NJMMIS 5010 270/271 companion guide (Dec 2022) was read
     in full: managed-care enrollment surfaces in Loop 2110C
     (EB04='HM' + REF01='18' → REF02 = 3-digit Managed Care Plan Code,
     REF03 = plan name) and Loop 2120C (NM101='PRP' → NM103 = MCO name,
     PER = MCO phone). The guide does NOT publish the 3-digit-code →
     MCO-name crosswalk (its Appendix 3 lists only eligibility-category
     names, none of the 5 MCOs) — so mcoCarrierCodes ships empty/
     'unverified' with a verifyVia, per the never-guess rule.
   - Layer 3 (codeGrid) restructures facts already verified in the prose
     corpus (src/data/payers/new-jersey.ts): the EPSDT benefit runs
     through the 5 MCOs since 4/1/2020; the MCO authorizes a QHP
     assessment and then the treatment plan; NO prior authorization is
     required while a member is FFS pending MCO enrollment; the state's
     "suggested" daily unit table (97151 32u, 97152 8u, 97153 32u,
     97154 12u, 97155 24u, 97156 16u, 97157 16u, 97158 16u, 0362T 8u,
     0373T 32u) is "guidance only" but the MCOs run it as MUE claim
     edits. That unit table was corroborated by the Aetna Better Health
     NJ 2020 rate sheet (which reproduces it verbatim), since the
     founding DMAHS newsletter PDF now 404s.
   - Layer 4 (rates) is Medicaid-only. NJ publishes real FFS rates.
     97153 $15.00 (raised from $11.20 eff 2/1/2022), 97155 $21.25, and
     97156 $25.00 are confirmed CURRENT (NJMMIS Procedure Master Listing
     CY2026 Q2, via ProviderSpark). The remaining codes' launch-era
     values come from the Aetna 2020 rate sheet and ship with an
     'unverified-as-current' note + a verifyVia to the portal-download
     Procedure Master Listing — the primary CY2026 listing is a portal
     download, not a fetchable URL. Aetna Better Health NJ's own sheet
     still shows the launch-era $11.20 on 97153 (now stale vs. the state
     $15.00) — carried honestly as the plan's published figure.
   - The 5 MCOs are not required to match the FFS schedule. Aetna
     publishes its own (launch-era) sheet; Horizon/Fidelis/UHC/Wellpoint
     publish no ABA fee schedule, so their rate tables reference the FFS
     schedule as the documented baseline with an unverified note.
   - Commercial guides (aetna-new-jersey, cigna-new-jersey,
     unitedhealthcare-new-jersey) get Layers 1+3 only — commercial ABA
     rates are contract-specific and out of scope. cigna-new-jersey,
     unlike cigna-virginia, HAS a real PA panel: EN0499 applies to NJ
     (no carve-out) — no PA on assessment codes 97151/97152/0362T,
     treatment PA required.
   - Carve-out reality check (from EDI research): Wellpoint's Carelon
     Behavioral Health relationship is utilization-management ONLY — BH/
     ABA claims still ride WLPNT via Availity (no separate Carelon claims
     payer ID). UHC Community Plan and UHC commercial use Optum for the
     BH network/authorizations but claims ride the medical payer ID
     (87726). Both are recorded as abaRidesOn='medical', not 'bh'.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, VobContact, StcMap } from './types.js';
import { aetnaFamilyStc, cignaFamilyStc, uhcFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const NJMMIS_270271_CG = src(
  'https://test.njmmis.com/downloadDocuments/5010_270-271_HIPAACompanionGuide.pdf',
  'NJ Medicaid / NJMMIS 5010 270/271 HIPAA Companion Guide (Gainwell, Dec 2022), read in full (the production-host www.njmmis.com copy 404s; the test-host copy is identical content). Documents managed-care enrollment in Loop 2110C (EB04="HM"; REF01="18" → REF02 = 3-digit Managed Care Plan Code, REF03 = plan name; MSG01 = managed-care messages) and Loop 2120C (NM101="PRP" → NM103 = MCO organization name, PER = MCO phone). No 3-digit-code → MCO-name crosswalk is published in this guide (Appendix 3 lists only eligibility-category names). Eligibility is real-time (MEVS), inquiry span up to 3 calendar months and not beyond end of the month following the current month; "eligibility for claim payment is not guaranteed beyond the end of the current month" (monthly guarantee), with begin/end dates returned as CCYYMMDD in DTP (2100C/2110C DTP03).'
);
const DMAHS_NEWSLETTER_V30N06 = src(
  'https://web.archive.org/web/2023/https://www.nj.gov/humanservices/dmahs/news/Provider_Newsletter_for_Applied_Behavior_Analysis_Therapy.pdf',
  'DMAHS Provider Newsletter Vol 30 No 06 (4/1/2020) — the founding ABA benefit design: MCO authorizes a QHP assessment then the treatment plan; FFS (billed to Gainwell) applies only to members pending MCO enrollment, with NO prior authorization required in that window; attaches the "suggested" daily unit limits "for guidance purposes only." The live nj.gov PDF now 404s; this is the web.archive.org copy. The unit table is corroborated verbatim by the Aetna Better Health NJ 2020 rate sheet.'
);
const NJMMIS_ABA_PACKET = src(
  'https://www.njmmis.com/documentDownload.aspx?document=Applied_Behavior_Analysis.pdf',
  'NJMMIS — ABA Treatment Provider FFS enrollment packet (May 2026, Gainwell): FFS ABA providers enroll via a dedicated packet, including fingerprint background checks per N.J.A.C. 10:77-4.9(g).'
);
const PROVIDERSPARK_NJ_RATES = src(
  'https://www.providerspark.com/for-providers/medicaid-rates/new-jersey/',
  'ProviderSpark NJ Medicaid rates, citing the NJMMIS Procedure Master Listing CY2026 Q2 — confirms current FFS per-15-min rates 97153 $15.00, 97155 $21.25, 97156 $25.00. Exposes only those three ABA codes; the remaining codes\' current values are not shown here.'
);
const AUTISM_NJ_RATE_INCREASE = src(
  'https://autismnj.org/news/autism-new-jerseys-advocacy-leads-to-medicaid-rate-increase-for-aba-services/',
  'Autism NJ — the technician direct-treatment rate (97153) was raised from $11.20 to $15.00 per 15-minute unit effective 2/1/2022 (DMAHS, using American Rescue Plan funds).'
);
const AETNA_NJ_RATE_SHEET = src(
  'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/newjersey/pdf/Applied%20behavioral%20analysis%20program.pdf',
  'Aetna Better Health of NJ — ABA Program rates (effective 4/1/2020, dated 03-30-2020), read in full: mirrors the state FFS LAUNCH schedule and reproduces the state\'s suggested daily unit limits verbatim as MUE limits. Rates: 97151 $25.00 (32u), 97152 $11.20 (8u), 97153 $11.20 (32u), 97154 $4.80 (12u), 97155 $21.25 (24u), 97156 $25.00 (16u), 97157 $12.40 (16u), 97158 $5.60 (16u), 0362T $25.00 (8u), 0373T $16.40 (32u). A 2020 launch-era document — its $11.20 on 97153 predates the 2/1/2022 increase to $15.00 and is now stale.',
  true
);
const OPTUM_ABA_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum ABA State Mandates (BH803ABASTM12026, rev. 11/18/2025, eff. Jan 2026) — NJ Medicaid entry: a comprehensive diagnostic evaluation is NOT required to access ABA; ages ~18 months to 21; school-setting services permitted outside normal school hours; enumerates the QHP roles.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — the national clinical policy behind UnitedHealthcare/Optum commercial ABA; contains no CPT-level coding/reimbursement mechanics.'
);
const HORIZON_ABA_OVERVIEW = src(
  'https://www.horizonnjhealth.com/sites/default/files/2020-12/Overview%20of%20ABA%20Services.pdf',
  'Horizon NJ Health — Overview of ABA Services (Nov/Dec 2020): NaviNet UM Request Tool; assessment fast-track of 32 units of 97151 valid for 30 days on confirmed eligibility + dx; MCG-based treatment review within 14 days; 6-month authorizations; enforces the state daily MUE unit limits; claims above authorized units are not reimbursed. Payor ID 22326.',
  true
);
const HORIZON_H0032_RETIRE = src(
  'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/horizon-to-stop-using-h0032-for-aba-services',
  'Horizon — H0032 retired for ABA on authorizations and claims effective 7/15/2026; use the 97151–97158 / 0362T / 0373T set only. Authorization requirements for ABA treatment hours stated as unchanged.'
);
const HORIZON_MEDICAL_POLICY_2026 = src(
  'https://www.horizonnjhealth.com/for-providers/news/updates-and-announcements/medical-policy-changes-applied-behavior-analysis',
  'Horizon — Medical Policy Changes (ABA), eff. 1/1/2026: revised PA and pre-/post-service medical-necessity review criteria (search excerpts reference standardized-instrument testing no more often than every 6 months). Full policy text could not be verified against the live document during the prose build — treat as "confirm in the portal."'
);
const FIDELIS_NJ_AUTH = src(
  'https://www.fideliscarenj.com/providers/medicaid/authorizations.html',
  'Fidelis Care NJ — Authorizations: outpatient authorization requests via provider.fideliscarenj.com or fax (888) 339-2677. No Fidelis-specific ABA clinical policy, fee schedule, or unit-cap document is published — the plan defers to the NJ FamilyCare state baseline (unverified).'
);
const WELLPOINT_NJ_EDI = src(
  'https://www.provider.wellpoint.com/new-jersey-provider/claims/electronic-data-interchange',
  'Wellpoint NJ — EDI page: Availity is Wellpoint\'s sole EDI partner (supports 837 P/I/D, 835, 276/277, 270/271); claims payer ID WLPNT. Carelon Behavioral Health provides utilization-management (authorizations) only — BH/ABA claims still submit to WLPNT via Availity; there is no separate Carelon claims payer ID.'
);
const DMAHS_BH_CONTACTS = src(
  'https://www.nj.gov/humanservices/dmhas/documents/pdf/resources/providers/DMAHS-BH-Integration-Points-of-Contact.pdf',
  'DMAHS BH Integration Points of Contact V3.1 — per-MCO ABA UM/contracting contacts and payor IDs.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 (Intensive Behavioral Interventions), eff. 5/15/2026 — applies to New Jersey (no state carve-out, unlike Virginia): no PA on assessment codes 97151, 97152, 0362T; treatment step requires the completed assessment + a treatment plan with the ABA PA form. Rett syndrome (F84.2) excluded from the ASD definition. A medical-necessity policy — no unit caps, POS codes, or telehealth/licensure modifiers.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide — "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical (no separate Evernorth EDI hop).'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 (Applied Behavior Analysis) — national medical-necessity policy for Aetna commercial; no coding/reimbursement mechanics published.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — national ASD coverage policy; 97151–97158 covered when criteria are met; no unit caps/POS/modifiers published.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026. pVerify codes are pVerify\'s proprietary internal codes, not national EDI IDs.'
);
const OPTUM_PROF_CLAIMS_LIST = src(
  'https://www.optum.com/content/dam/o4-dam/resources/pdfs/guides/professional-claims-payer-list.pdf',
  'Optum / Change Healthcare professional-claims payer list (read directly) — the Change Healthcare payer finder in document form; confirms the CHC payer IDs and 270/271 support flags below.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the fetchable copy carries an "As of 08/08/2012" footer; any ID read from it is treated as inferred/unverified pending a current Availity export.',
  true
);
const AETNA_BH_NJ_PORTAL = src(
  'https://www.aetnabetterhealth.com/newjersey/providers/portal.html',
  'Aetna Better Health of NJ — provider portal page, read in full: "The Availity Provider Portal gives you the info, tools and resources you need..."; lists primary provider support 1-855-232-3596 (TTY 711), Mon-Fri 8am-5pm, and a 24/7 general contact line at the same number; Availity registration support 1-800-282-4548.'
);
const EVERNORTH_BH_PROVIDER_SVC = src(
  'https://static.evernorth.com/assets/evernorth/provider/resourceLibrary/behavioralResources/doingBusinessWithUs/cbhProviderServiceCenter.html',
  'Evernorth (Cigna) Behavioral Health Provider Service Center page, read in full: main line 1.800.926.2273, staffed by Provider Advocates at the National Care Center (Bloomington, MN) — callers select prompt #5 for providers, then choose among claims / eligibility / authorization / online-services / personal-updates options.'
);
const EVERNORTH_PROVIDER_PORTAL = src(
  'https://provider.evernorth.com/app/login',
  'Evernorth Provider portal login page — the online portal for Evernorth/Cigna behavioral-health claims, eligibility, and authorization status.'
);
const UHC_PROVIDER_CONTACT = src(
  'https://www.uhcprovider.com/en/contact-us.html',
  'UnitedHealthcare Provider Services contact page, read in full: behavioral health / Optum support line 877-614-0484, described as a "24/7 behavioral health and substance use support line"; general commercial provider services 877-842-3210; provider-portal technical support 866-842-3278 opt. 1.'
);

/* ==================== Layer 4 — NJ FamilyCare FFS rate table ==================== */
/* NJ pays by provider specialty (RBT/BCaBA render direct codes; BCBA/BCBA-D
   render assessment/protocol/family codes), not a licensure-modifier ladder.
   Three codes are confirmed current (CY2026 Q2); the rest carry launch-era
   values with an unverified-as-current flag. */
const newJerseyMedicaidRates: RateTable = {
  source:
    'NJ FamilyCare FFS ABA fee schedule (per 15-minute unit). 97153 $15.00 (raised from $11.20 eff 2/1/2022), 97155 $21.25, and 97156 $25.00 are CONFIRMED CURRENT via the NJMMIS Procedure Master Listing CY2026 Q2 (ProviderSpark). The remaining codes carry their launch-era values from the Aetna Better Health NJ 2020 rate sheet (which mirrored the state launch schedule) and are UNVERIFIED-as-current — the primary CY2026 Procedure Master Listing is a portal download on njmmis.com, not a fetchable URL. MCOs are not required to match this schedule.',
  effectiveDate: '2022-02-01',
  byCode: {
    '97153': { rate: '$15.00', unit: '15min', modifierTiers: { renderedBy: 'RBT / BCaBA', status: 'verified current (CY2026 Q2); raised from $11.20 eff 2/1/2022' } },
    '97155': { rate: '$21.25', unit: '15min', modifierTiers: { renderedBy: 'BCBA / BCBA-D', status: 'verified current (CY2026 Q2)' } },
    '97156': { rate: '$25.00', unit: '15min', modifierTiers: { renderedBy: 'BCBA / BCBA-D (family guidance)', status: 'verified current (CY2026 Q2)' } },
    '97151': { rate: '$25.00', unit: '15min', modifierTiers: { renderedBy: 'BCBA / BCBA-D (assessment)', status: 'launch-era value; current status unverified — confirm in the CY2026 Procedure Master Listing' } },
    '97152': { rate: '$11.20', unit: '15min', modifierTiers: { renderedBy: 'RBT / BCaBA (supporting assessment)', status: 'launch-era value; current status unverified' } },
    '97154': { rate: '$4.80', unit: '15min', modifierTiers: { renderedBy: 'RBT / BCaBA (group)', status: 'launch-era value; current status unverified' } },
    '97157': { rate: '$12.40', unit: '15min', modifierTiers: { status: 'launch-era value; current status unverified' } },
    '97158': { rate: '$5.60', unit: '15min', modifierTiers: { status: 'launch-era value; current status unverified' } },
    '0362T': { rate: '$25.00', unit: '15min', modifierTiers: { status: 'launch-era value; current status unverified' } },
    '0373T': { rate: '$16.40', unit: '15min', modifierTiers: { status: 'launch-era value; current status unverified' } },
  },
  sources: [PROVIDERSPARK_NJ_RATES, AUTISM_NJ_RATE_INCREASE, AETNA_NJ_RATE_SHEET, DMAHS_NEWSLETTER_V30N06],
};

/* Aetna Better Health NJ publishes its own (launch-era) sheet — carried as the
   plan's published figures, honestly flagged as predating the 2/1/2022 increase. */
const aetnaNjRates: RateTable = {
  source:
    'Aetna Better Health of NJ — ABA Program rate sheet (eff. 4/1/2020), read in full: mirrors the state FFS LAUNCH schedule and reproduces the suggested daily unit limits verbatim as MUE limits. NOTE: this 2020 sheet still shows the launch-era $11.20 on 97153 and $11.20 on 97152 — the state raised 97153 to $15.00 eff 2/1/2022, and whether Aetna followed on its own schedule is UNVERIFIED. Confirm the current contracted 97153 rate directly with the plan.',
  effectiveDate: '2020-04-01',
  byCode: {
    '97151': { rate: '$25.00', unit: '15min', modifierTiers: { suggestedDailyUnits: '32' } },
    '97152': { rate: '$11.20', unit: '15min', modifierTiers: { suggestedDailyUnits: '8' } },
    '97153': { rate: '$11.20 (launch sheet; state since raised to $15.00 — verify)', unit: '15min', modifierTiers: { suggestedDailyUnits: '32' } },
    '97154': { rate: '$4.80', unit: '15min', modifierTiers: { suggestedDailyUnits: '12' } },
    '97155': { rate: '$21.25', unit: '15min', modifierTiers: { suggestedDailyUnits: '24' } },
    '97156': { rate: '$25.00', unit: '15min', modifierTiers: { suggestedDailyUnits: '16' } },
    '97157': { rate: '$12.40', unit: '15min', modifierTiers: { suggestedDailyUnits: '16' } },
    '97158': { rate: '$5.60', unit: '15min', modifierTiers: { suggestedDailyUnits: '16' } },
    '0362T': { rate: '$25.00', unit: '15min', modifierTiers: { suggestedDailyUnits: '8' } },
    '0373T': { rate: '$16.40', unit: '15min', modifierTiers: { suggestedDailyUnits: '32' } },
  },
  sources: [AETNA_NJ_RATE_SHEET, AUTISM_NJ_RATE_INCREASE],
};

/* MCOs with no published ABA fee schedule reference the FFS schedule as the
   documented baseline (not a plan-confirmed paid rate). */
function mcoBaselineRates(planName: string, extra?: string): RateTable {
  return {
    source: `No ${planName}-specific ABA fee schedule is publicly posted${extra ? ` (${extra})` : ''}; the NJ FamilyCare FFS schedule is the documented reference baseline (MCOs are not required to match it). Confirm the plan-paid rate in your participating-provider agreement.`,
    effectiveDate: newJerseyMedicaidRates.effectiveDate,
    byCode: newJerseyMedicaidRates.byCode,
    sources: [PROVIDERSPARK_NJ_RATES, AUTISM_NJ_RATE_INCREASE, DMAHS_BH_CONTACTS],
  };
}

/* ==================== Layer 3 — codeGrid factories ==================== */

/* NJ state baseline: EPSDT via the 5 MCOs. The MCO authorizes a QHP assessment
   then the treatment plan; NO PA while a member is FFS pending MCO enrollment.
   The state's suggested daily unit limits run as MUE claim edits, overridable
   under EPSDT medical necessity. */
const NJ_DAILY_UNITS: Record<string, string> = {
  '97151': '32 units/day', '97152': '8 units/day', '97153': '32 units/day', '97154': '12 units/day',
  '97155': '24 units/day', '97156': '16 units/day', '97157': '16 units/day', '97158': '16 units/day',
  '0362T': '8 units/day', '0373T': '32 units/day',
};

function njBaselineEntry(code: string, notes?: string, extraSources: SourceRef[] = []): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required via the MCO (assessment + treatment) — NO prior authorization while a member is FFS pending MCO enrollment (a real fast-start window for newly eligible children).',
    unitCap: `${NJ_DAILY_UNITS[code]} — state "suggested" MUE limit, run by the MCOs as a claim edit; overridable under EPSDT medical necessity`,
    capPeriod: 'day',
    posAllowed: ['home', 'office/clinic (11)', 'community', 'telehealth', 'school (outside normal school hours — see Optum NJ entry)'],
    telehealth: 'Allowed; school-setting services permitted outside normal school hours per Optum\'s Nov 2025 NJ entry (a looser position than the state\'s original 2020 no-school rule) — confirm per MCO.',
    modifiers: ['Provider-specialty based (RBT / BCaBA render direct codes; BCBA / BCBA-D render assessment/protocol/family codes)', 'H0032 retired for ABA by Horizon eff. 7/15/2026 — use the 97151–97158 / 0362T / 0373T set'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [DMAHS_NEWSLETTER_V30N06, OPTUM_ABA_STATE_MANDATES, ...extraSources],
  };
}

function njBaselineGrid(extraSources: SourceRef[] = []): Record<string, CodeGridEntry> {
  const g: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NJ_DAILY_UNITS)) g[code] = njBaselineEntry(code, undefined, extraSources);
  return g;
}

/* ==================== new-jersey-medicaid ==================== */

const newJerseyMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00161', availity: 'unverified', changeHealthcare: 'NJMCD' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'none (FFS / pending-enrollment ABA rides the medical FFS line, billed to Gainwell)',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "MCO enrollment surfaces in Loop 2110C when EB04='HM' (Health Maintenance Organization; EB04='MC' = straight Medicaid/FFS): the 2110C REF segment carries REF01='18' (Plan Number) → REF02 = the 3-digit Managed Care Plan Code, REF01='1W' → REF02 = Managed Care Member ID, and REF03 = Managed Care Plan Name; 2110C MSG01 carries managed-care messages; and Loop 2120C NM1 with NM101='PRP' (Primary Payer) carries the MCO organization name (NM103) with the MCO phone in the 2120C PER. During the pre-selection window a member shows as FFS Medicaid (EB04='MC') with no HM segment — the documented basis for the 'pending MCO enrollment = FFS' fast-start.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      "Real-time (MEVS). Inquiry span up to 3 calendar months and not beyond the end of the month following the current month; \"eligibility for claim payment is not guaranteed beyond the end of the current month\" — i.e. a monthly guarantee — with begin/end dates returned as CCYYMMDD spans in DTP (single segment 2100C DTP03; multiple segments 2110C DTP03).",
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
    'payerId.availity': 'No distinct NJ Medicaid FFS line in the stale 2012 Availity list; confirm via a current Availity Essentials export or the NJMMIS 5010 companion guide.',
    'medicaid271Notes.mcoCarrierCodes':
      'The 3-digit Managed Care Plan Code → MCO-name crosswalk is NOT published in the 270/271 companion guide (its Appendix 3 lists only eligibility-category names, none of the 5 MCOs). Obtain the plan-code reference from NJMMIS "Rate and Code Information" or the 834 enrollment / encounter (837/835) companion materials, or by mapping REF03 (plan name) / 2120C NM103 on a live 271.',
  },
  sources: [NJMMIS_270271_CG, DMAHS_NEWSLETTER_V30N06, NJMMIS_ABA_PACKET, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST],
};

/* ==================== horizon-nj-health ==================== */

const horizonEdi: EdiRouting = {
  payerId: { pverify: '00297', availity: '22326', changeHealthcare: '22326' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (Horizon administers BH in-house post-2023 BH integration)',
    administratorPayerId: '22326',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00297 = "Horizon New Jersey Health" (verified).',
    'payerId.availity': 'Payor ID 22326 per Horizon\'s ABA overview and claims materials; appears as "Horizon Mercy" in the stale 2012 Availity list — confirm against a current export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 22326 (Horizon\'s legacy "Mercy Health Plan of New Jersey" line; supports 270/271).',
    supportsRealtime: 'Confirm real-time vs. batch via NaviNet/Availity onboarding for 22326.',
  },
  sources: [HORIZON_ABA_OVERVIEW, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST],
};

/* Horizon layers a stricter process on the state baseline: 32-unit/30-day
   assessment fast-track, MCG review, 6-month auths, hard MUE edges. */
const horizonCodeGrid: Record<string, CodeGridEntry> = (() => {
  const g = njBaselineGrid([HORIZON_ABA_OVERVIEW]);
  g['97151'] = njBaselineEntry(
    '97151',
    'Assessment fast-track: once Horizon confirms eligibility, an ASD diagnosis, and a QHP script, it issues 32 units of 97151 valid for 30 days without a full clinical review (submit via NaviNet before requesting). Book the assessment within the 30-day window.',
    [HORIZON_ABA_OVERVIEW]
  );
  // Horizon enforces the state MUE table hard: claims above authorized units are not reimbursed.
  for (const code of Object.keys(NJ_DAILY_UNITS)) {
    if (code === '97151') continue;
    g[code] = njBaselineEntry(
      code,
      'Horizon enforces the state daily MUE unit limits ("shall not consider for reimbursement units exceeding the daily maximum") — claims above authorized units are not reimbursed. Treatment: post-assessment ABA Request Form via NaviNet, MCG review within 14 days, 6-month authorizations. Two announced 2026 changes to confirm in the portal: revised PA / medical-necessity review criteria eff. 1/1/2026, and H0032 retired for ABA eff. 7/15/2026 (use the 97151–97158 / 0362T / 0373T set).',
      [HORIZON_ABA_OVERVIEW, HORIZON_H0032_RETIRE, HORIZON_MEDICAL_POLICY_2026]
    );
  }
  return g;
})();

/* ==================== aetna-better-health-new-jersey ==================== */

const aetnaBetterHealthNjEdi: EdiRouting = {
  payerId: { pverify: '000942', availity: '46320', changeHealthcare: '46320' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (Aetna administers BH in-house)',
    administratorPayerId: '46320',
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
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 000942 = "AETNA BETTER HEALTH (NJ)" (legacy line "Aetna Better Health NJ-REV" 00921 also exists).',
    'payerId.availity': 'Provider/claims ID 46320 per the Aetna Better Health of NJ provider QRG (Availity / Office Ally).',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 46320 = "Aetna Better Health of New Jersey" (supports 270/271).',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 46320.',
  },
  sources: [AETNA_NJ_RATE_SHEET, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST],
};

/* Aetna is closest to the state baseline; its published sheet adopts the MUE
   limits verbatim. Grid = state baseline with the rate-sheet MUE note. */
const aetnaBetterHealthNjCodeGrid: Record<string, CodeGridEntry> = (() => {
  const g: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NJ_DAILY_UNITS)) {
    g[code] = njBaselineEntry(
      code,
      'Aetna\'s published ABA Program sheet adopts the state suggested daily limits verbatim as MUE (medically-unlikely-edit) claim limits. Urgent requests decided in 24h, routine in 7 days; submit via Availity or the BH prior authorization form; progress reports via Availity or fax (844) 404-3972.',
      [AETNA_NJ_RATE_SHEET]
    );
  }
  return g;
})();

/* ==================== fidelis-care-new-jersey ==================== */

const fidelisEdi: EdiRouting = {
  payerId: { pverify: '00803', availity: '14163', changeHealthcare: '14163' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (state baseline; Centene/WellCare BH machinery, no distinct ABA carve-out found)',
    administratorPayerId: '14163',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00803 = "FIDELIS CARE NEW JERSEY" (Eligibility=Yes / claim-status No).',
    'payerId.availity': '14163 is the Centene/WellCare national payer ID (appears as "WELLCARE HEALTH PLANS" in the stale 2012 Availity list) — the NJ Centene line is branded WellCare. Confirm against a current Availity export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 14163 = "Wellcare HMO, Inc." (Centene/WellCare family; supports 270/271). NOTE: "Fidelis Care" is Centene\'s NEW YORK brand — do NOT use the NY line 11315 for NJ.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 14163.',
  },
  sources: [FIDELIS_NJ_AUTH, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST],
};

/* Fidelis publishes no ABA-specific caps/rates — state baseline, with the
   unit fields as the likely edit surface (unverified as plan-confirmed). */
const fidelisCodeGrid: Record<string, CodeGridEntry> = (() => {
  const g: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NJ_DAILY_UNITS)) {
    const e = njBaselineEntry(
      code,
      'No Fidelis-specific ABA clinical policy, fee schedule, or unit-cap document is published — the plan defers to the NJ FamilyCare state baseline (unverified). Outpatient auth requests via provider.fideliscarenj.com or fax (888) 339-2677. Confirm assessment format, spans, and unit handling with the plan\'s UM contact before the first submission.',
      [FIDELIS_NJ_AUTH]
    );
    // The daily-unit edit is assumed (state guide), not confirmed against a Fidelis document.
    e.fieldStatus = { ...e.fieldStatus, unitCap: 'inferred' };
    g[code] = e;
  }
  return g;
})();

/* ==================== unitedhealthcare-community-plan-new-jersey ==================== */

const uhcCpNjEdi: EdiRouting = {
  payerId: { pverify: 'UHG001', availity: '87726', changeHealthcare: '86047' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (network/authorization via Provider Express; claims ride the medical payer ID)',
    administratorPayerId: '87726',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify has no NJ-specific UHC Community Plan row; UHG001 = generic "UnitedHealth Group - Community Plan." Confirm the NJ-specific mapping via pVerify payer search.',
    'payerId.availity': 'Claims payer ID 87726 per UHC EDI docs (appears as "UNITEDHEALTHCARE" in the stale 2012 Availity list) — confirm against a current export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 86047 = "UnitedHealthcare Community Plan / NJ" (former 86001; supports 270/271). UHC docs: claims payer ID 87726, ERA 86047 — same plan.',
    'bhCarveOut.abaRidesOn': 'ABA network contracted separately through Optum/Provider Express, but claims ride the medical payer ID (87726 claims / 86047 NJ community-plan line) — no separate Optum BH claims payer ID, no second EDI hop.',
    supportsRealtime: 'Confirm real-time vs. batch via Provider Express / Availity onboarding.',
  },
  sources: [OPTUM_ABA_STATE_MANDATES, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST],
};

/* UHC-CP NJ: Optum-run, friendliest diagnosis bar (no comprehensive eval),
   school outside hours. Grid = state baseline with the Optum-entry facts. */
const uhcCpNjCodeGrid: Record<string, CodeGridEntry> = (() => {
  const g: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NJ_DAILY_UNITS)) {
    g[code] = njBaselineEntry(
      code,
      'Optum-administered (Provider Express NJ ABA path; BH intake 1-888-362-3368 opt. 3). Per Optum\'s NJ Medicaid entry (rev. 11/18/2025): no comprehensive diagnostic evaluation required (any physician/psychologist ASD dx opens the benefit), ages ~18 months to 21, school-setting services permitted outside normal school hours. No stated NJ hour caps beyond the state MUE table.',
      [OPTUM_ABA_STATE_MANDATES]
    );
  }
  return g;
})();

/* ==================== wellpoint-new-jersey ==================== */

const wellpointEdi: EdiRouting = {
  payerId: { pverify: '06067', availity: 'WLPNT', changeHealthcare: '28806' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health (utilization management / contracting ONLY — BH/ABA claims ride WLPNT via Availity)',
    administratorPayerId: 'WLPNT',
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
    'payerId.pverify': 'pVerify 06067 = "WELLPOINT - AMERIGROUP" (legacy "AMERIGROUP" 00025 / "AMERIGROUP (CLAIMS)" 00705).',
    'payerId.availity': 'Claims payer ID WLPNT per the Wellpoint NJ EDI page (Availity is Wellpoint\'s sole EDI partner; supports 270/271) and the Carelon NJ QRG.',
    'payerId.changeHealthcare': 'Change Healthcare uses the legacy "Amerigroup - New Jersey" line 28806 (NOT WLPNT) — and Optum shows 270/271 = N on that line, so prefer the Availity/WLPNT path for eligibility.',
    'bhCarveOut.administrator': 'Carelon provides utilization-management/authorization services only ("an independent company providing utilization management services on behalf of the health plan"); BH/ABA CLAIMS still submit to WLPNT via Availity — no separate Carelon claims payer ID. ABA network contracting runs through Carelon (provider.relations.NJ@carelon.com).',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for WLPNT.',
  },
  sources: [WELLPOINT_NJ_EDI, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST, DMAHS_BH_CONTACTS],
};

/* Wellpoint: state baseline, Carelon UM plumbing. */
const wellpointCodeGrid: Record<string, CodeGridEntry> = (() => {
  const g: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NJ_DAILY_UNITS)) {
    const e = njBaselineEntry(
      code,
      'No Wellpoint-specific published ABA criteria/caps/rates — state baseline. ABA authorization submits via Availity or (800) 454-3730 (Carelon runs the UM); ABA network contracting is a SEPARATE funnel through Carelon Behavioral Health (provider.relations.NJ@carelon.com). Confirm spans and unit handling with the plan before the first submission.',
      [WELLPOINT_NJ_EDI, DMAHS_BH_CONTACTS]
    );
    e.fieldStatus = { ...e.fieldStatus, unitCap: 'inferred' };
    g[code] = e;
  }
  return g;
})();

/* ==================== aetna-new-jersey (commercial) ==================== */

const aetnaNjCommercialEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Aetna Behavioral Health (same-payer-ID pass-through)',
    administratorPayerId: '60054',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00001 = "Aetna" (Medical, Eligibility=Yes).',
    'payerId.availity': 'Availity 60054 = AETNA appears in the stale 2012 snapshot and matches the current national Aetna commercial ID — inferred pending a current export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 60054 = "Aetna Health Plan - PPO" (supports 270/271).',
    'bhCarveOut.administrator': 'Aetna Behavioral Health rides the same medical payer ID (no second hop); confirm the ABA precertification path via Aetna provider services.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 60054.',
  },
  sources: [AETNA_CPB0554, AETNA_CPB0648, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST, AVAILITY_PAYER_LIST],
};

function aetnaCommercialEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification via Availity or phone (both assessment and treatment) per Aetna\'s national CPB 0554/0648; reauthorization commonly ~6 months. For fully-insured NJ plans the P.L. 2009, c.115 mandate is the legal floor (dollar caps voided for MHPAEA group plans per DOBI Bulletin 10-02); self-funded ERISA plans are exempt.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Aetna provider services / precertification and a live benefits check (plan funding type first) — CPB 0554 & 0648 are medical-necessity policies with no unit caps, POS codes, or modifiers. Commercial ABA rates are contract-specific (out of Layer 4 scope).',
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

const aetnaNjCommercialCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.keys(NJ_DAILY_UNITS).map((c) => [c, aetnaCommercialEntry()])
);

/* ==================== cigna-new-jersey (commercial) ==================== */
/* Unlike VA, EN0499 APPLIES to NJ — a real PA panel. */

const cignaNjEdi: EdiRouting = {
  payerId: { pverify: '00004', availity: '62308', changeHealthcare: '62308' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Evernorth Behavioral Health (same-payer-ID pass-through)',
    administratorPayerId: '62308',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00004 = "Cigna" (Medical, Eligibility=Yes); "Cigna Behavioral" 00510 also listed.',
    'payerId.availity': 'Evernorth payer ID 62308 per the Cigna Autism Resource Guide (same ID as Cigna medical); inferred pending a current Availity export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 62308 = "CIGNA - PPO" (supports 270/271). NOTE: EN0499 is Evernorth\'s ABA COVERAGE-POLICY number, not a payer ID — "EN0499 applies to NJ" means the policy governs (no carve-out); routing stays on 62308.',
    supportsRealtime: 'Confirm real-time vs. batch via the clearinghouse onboarding for 62308.',
  },
  sources: [CIGNA_AUTISM_GUIDE, CIGNA_EN0499, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST, AVAILITY_PAYER_LIST],
};

function cignaNjEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Cigna/Evernorth provider services and a live benefits check (funding type first) — EN0499 is a medical-necessity policy with no unit caps, POS codes, or modifiers. Unlike Virginia, EN0499 applies to NJ fully-insured business (no carve-out); the P.L. 2009, c.115 mandate is the legal floor for fully-insured plans. Commercial ABA rates are contract-specific (out of Layer 4 scope).',
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

const cignaNjCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaNjEntry('Not required (per EN0499)'),
  '97152': cignaNjEntry('Not required (per EN0499)'),
  '0362T': cignaNjEntry('Not required (per EN0499)'),
  '97153': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0373T': cignaNjEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

/* ==================== unitedhealthcare-new-jersey (commercial) ==================== */

const uhcNjCommercialEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (network/authorization; claims ride the medical payer ID)',
    administratorPayerId: '87726',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 00192 = "United Healthcare" (Medical, Eligibility=Yes); "United Healthcare - Optum Behavioral Solutions" UHG007 also listed.',
    'payerId.availity': 'Availity 87726 = UNITEDHEALTHCARE appears in the stale 2012 snapshot and matches the current national UHC ID — inferred pending a current export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 87726 = "UnitedHealthcare" (supports 270/271).',
    'bhCarveOut.abaRidesOn': 'ABA administered through Optum Behavioral Health (Provider Express, two-step auth) but claims ride the medical 87726 payer ID — no second EDI hop.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 87726.',
  },
  sources: [OPTUM_SCC, PVERIFY_PAYER_LIST, OPTUM_PROF_CLAIMS_LIST, AVAILITY_PAYER_LIST],
};

function uhcNjCommercialEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum two-step authorization on Provider Express (assessment first, then treatment) under the Supplemental Clinical Criteria; continued-service reviews every 4–6 months. Commercial members use the national criteria\'s validated-tool diagnostic standard (NOT the looser NJ Medicaid diagnosis bar). For fully-insured NJ plans the P.L. 2009, c.115 mandate is the legal floor; self-funded ERISA plans are exempt.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Provider Express / Optum provider services and a live benefits check (plan funding type + line of business first) — the Supplemental Clinical Criteria carries no CPT-level unit caps, POS codes, or modifiers. Commercial ABA rates are contract-specific (out of Layer 4 scope).',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [OPTUM_SCC],
  };
}

const uhcNjCommercialCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.keys(NJ_DAILY_UNITS).map((c) => [c, uhcNjCommercialEntry()])
);

/* ==================== Layer 2 — STC interpretation maps ====================
   The NJMMIS 5010 270/271 Companion Guide (NJMMIS_270271_CG, already read in
   full above for Layer 1 / medicaid271Notes) documents managed-care
   enrollment loops/segments in detail but does NOT publish a service-type-
   code (STC) support table — it never states which STCs NJMMIS returns or
   whether ABA-relevant cost-share detail (deductible/copay/coinsurance) is
   populated on the wire. No independent NJ Medicaid 270/271 STC document
   was located this pass. new-jersey-medicaid and its 5 MCOs (Horizon,
   Aetna Better Health, Fidelis, UHC Community Plan, Wellpoint — all NJ
   FamilyCare Medicaid managed-care lines, NOT the commercial book of
   business the national aetna/anthem/uhc family defaults represent) run
   their own PA/eligibility per the EDI sections above but have no
   independently published 270/271 STC table of their own, so they ship
   fully 'unverified' rather than guessed from another state's pattern or
   borrowed from a commercial family default. The separate Layer-0 prose
   file (src/data/payers/new-jersey.ts) documents the EPSDT benefit design
   in detail (MCO authorization workflow, daily unit limits, FFS rates) but
   contains no statement of EPSDT member cost-share ($0 or otherwise) — so
   deductibleAppliesToAba ships 'unverified', not inferred, here too. */

function njUnverifiedStc(verifyNote: string, extraSources: SourceRef[] = []): StcMap {
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
      abaBenefitBucket: `The NJMMIS 5010 270/271 Companion Guide (read in full for Layer 1) documents managed-care enrollment loops but publishes no service-type-code support table. ${verifyNote}`,
    },
    sources: [NJMMIS_270271_CG, ...extraSources],
  };
}

const newJerseyMedicaidStc = njUnverifiedStc(
  'Confirm via Gainwell Technologies Provider Services (1-800-776-6334) or the DMAHS Autism Line (609-588-8522).',
  [DMAHS_BH_CONTACTS]
);
const horizonStc = njUnverifiedStc(
  'Confirm via Horizon NJ Health Provider Services (1-800-682-9091) or Availity Essentials.',
  [DMAHS_BH_CONTACTS]
);
const aetnaBetterHealthNjStc = njUnverifiedStc(
  'Confirm via Aetna Better Health of NJ Provider Services (1-855-232-3596) or Availity Essentials.',
  [DMAHS_BH_CONTACTS]
);
const fidelisStc = njUnverifiedStc(
  'Confirm via the Fidelis Care Provider Portal (provider.fideliscarenj.com) or fax (888) 339-2677.',
  [DMAHS_BH_CONTACTS]
);
const uhcCpNjStc = njUnverifiedStc(
  'Confirm via Provider Express (1-888-362-3368) or Optum Behavioral Health.',
  [DMAHS_BH_CONTACTS]
);
const wellpointStc = njUnverifiedStc(
  'Confirm via Wellpoint NJ Provider Services (1-800-454-3730) or Availity Essentials.',
  [DMAHS_BH_CONTACTS]
);

/* ==================== Layer 7 — contact & channel layer ====================
   Contact facts are sourced two ways: (a) mined verbatim from notes on
   source refs already used elsewhere in this file (fax/phone numbers the
   prior sourcing pass already read and quoted); (b) the DMAHS BH Integration
   Points of Contact V3.1 PDF (DMAHS_BH_CONTACTS, already cited in the EDI
   layer), fetched in full for this pass — it carries a per-MCO "ABA Contact"
   / "Provider Services" / fax block that supersedes the older, thinner notes
   (e.g. it shows Horizon has migrated its UM/claims workflow onto Availity,
   not the 2020-era NaviNet tool cited in HORIZON_ABA_OVERVIEW). Commercial
   guides required fresh fetches of each carrier's own national provider-
   services contact page; Aetna's own precertification page states precert
   phone numbers are printed on the member's ID card rather than published
   as one universal number, so aetna-new-jersey ships with NO
   providerServicesPhone — a verified absence, not an oversight.
   scriptedQuestions are generated from what THIS guide's own edi/codeGrid/
   rates layers mark unverified/plan-dependent/inferred — never scraped. */

const njMedicaidContact: VobContact = {
  providerServicesPhone: '1-800-776-6334',
  ivrPath:
    'Gainwell Technologies Provider Services (general FFS line). For ABA/DIR-specific questions, DMAHS runs a dedicated Autism Line: 609-588-8522 (MAHS.ASDinquiries@dhs.nj.gov).',
  portal: { name: 'NJMMIS', url: 'https://www.njmmis.com' },
  scriptedQuestions: [
    'Which of the 5 MCOs (or FFS) is this member enrolled in, and what is the 3-digit Managed Care Plan Code shown in their eligibility response? (our companion guide has no code-to-MCO crosswalk)',
    'Can you confirm today\'s per-15-minute rate for 97151, 97152, 97154, 97157, 97158, 0362T, and 0373T? (our reference for these 7 codes is the 2020 launch schedule, not the current CY2026 listing)',
    'Is the member still in the FFS pending-MCO-enrollment window (no PA required), or already enrolled with an MCO (assessment + treatment PA)?',
  ],
  sources: [DMAHS_BH_CONTACTS, NJMMIS_270271_CG],
};

const horizonContact: VobContact = {
  providerServicesPhone: '1-800-682-9091',
  ivrPath:
    'Prior-auth progress requests and continued-stay requests: 800-626-2212 (or via Availity). Claims Contact line above is 1-800-682-9091 (email BHMedicaid_@horizonblue.com).',
  portal: { name: 'Availity Essentials', url: 'https://apps.availity.com/web/onboarding/availity-fr-ui/#/login' },
  fax: '732-938-1444',
  scriptedQuestions: [
    'Are the January 2026 medical-policy changes to PA / medical-necessity review criteria already in effect for this member\'s plan?',
    'What is today\'s paid rate for the ABA codes — Horizon aligned BH fees to the state\'s 3/1/2024 rate increase, but we don\'t have it broken out by code?',
    'Which places of service are approved under this member\'s authorization (home, office, school, community, telehealth)?',
    'Is eligibility checking real-time or batch through your clearinghouse?',
  ],
  sources: [DMAHS_BH_CONTACTS, HORIZON_ABA_OVERVIEW],
};

const aetnaBetterHealthNjContact: VobContact = {
  providerServicesPhone: '1-855-232-3596',
  ivrPath: 'Press * for healthcare provider. Also serves as Availity registration support routing.',
  hours: 'Mon-Fri 8am-5pm (general contact line also answers 24/7 per the Aetna Better Health NJ portal page)',
  portal: { name: 'Availity Essentials', url: 'https://www.aetnabetterhealth.com/newjersey/providers/portal.html' },
  fax: '844-404-3972',
  scriptedQuestions: [
    'Can you confirm the current contracted rate for 97153 — our reference (Aetna\'s 2020 sheet) still shows $11.20, but the state raised the FFS rate to $15.00 in 2022?',
    'What are today\'s rates for 97151, 97152, 97154, 97157, 97158, 0362T, and 0373T?',
    'Which places of service are approved under this member\'s ABA authorization?',
  ],
  sources: [DMAHS_BH_CONTACTS, AETNA_BH_NJ_PORTAL, AETNA_NJ_RATE_SHEET],
};

const fidelisContact: VobContact = {
  fax: '888-339-2677',
  portal: { name: 'Fidelis Care Provider Portal', url: 'https://provider.fideliscarenj.com' },
  scriptedQuestions: [
    'Does Fidelis enforce the state\'s suggested daily unit limits as hard claim edits, or does it apply different unit caps?',
    'Is there a distinct BH/ABA carve-out administrator, or does ABA process through Fidelis\'s standard Centene/WellCare BH structure?',
    'Is eligibility checking real-time or batch through your clearinghouse?',
  ],
  sources: [DMAHS_BH_CONTACTS, FIDELIS_NJ_AUTH],
};

const uhcCpNjContact: VobContact = {
  providerServicesPhone: '1-888-362-3368',
  ivrPath: 'Enter TIN # → select option 3 (intake) → enter member ID/DOB → select "Mental Health."',
  portal: { name: 'Provider Express', url: 'https://www.providerexpress.com' },
  scriptedQuestions: [
    'Does Optum apply any unit or hour caps beyond the state\'s daily MUE table for this member?',
    'Is eligibility checking real-time or batch?',
    'Can you confirm the correct pVerify payer code for this NJ Community Plan line? (our mapping is inferred, not payer-confirmed)',
  ],
  sources: [DMAHS_BH_CONTACTS, OPTUM_ABA_STATE_MANDATES],
};

const wellpointContact: VobContact = {
  providerServicesPhone: '1-800-454-3730',
  hours: 'Carelon National Provider Services Line (contracting, 800-397-1630): Mon-Fri 8am-8pm ET',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com' },
  fax: '844-442-8007',
  scriptedQuestions: [
    'Does Wellpoint enforce the state\'s daily MUE unit limits as claim edits, or apply different caps?',
    'Is eligibility checking real-time or batch through Availity?',
    'Is ABA network contracting still routed through Carelon Behavioral Health, or has that changed?',
  ],
  sources: [DMAHS_BH_CONTACTS, WELLPOINT_NJ_EDI],
};

const aetnaNjCommercialContact: VobContact = {
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'What is the member\'s plan funding type — fully-insured (P.L. 2009, c.115 mandate applies) or self-funded (ERISA, mandate-exempt)?',
    'Are there unit or hour caps on ABA codes for this member\'s specific plan?',
    'Which places of service (home/office/school/telehealth) are approved for this member\'s authorization?',
    'Are there modifier requirements (licensure tier, telehealth) for billing?',
    'Is eligibility checking real-time or batch?',
  ],
  sources: [AVAILITY_PAYER_LIST],
};
// Note: Aetna's own precertification page states precert numbers are printed
// on the member's ID card, not published as one universal line — so no
// providerServicesPhone/fax is included here (a verified absence).

const cignaNjContact: VobContact = {
  providerServicesPhone: '1-800-926-2273',
  ivrPath: 'Select prompt #5 for providers, then choose among claims / eligibility / authorization / online services / personal updates.',
  portal: { name: 'Evernorth Provider Portal', url: 'https://provider.evernorth.com/app/login' },
  scriptedQuestions: [
    'What is the member\'s plan funding type — fully-insured (P.L. 2009, c.115 mandate applies) or self-funded (ERISA)?',
    'Are there unit or hour caps on the treatment codes (97153-97158, 0373T) for this member\'s plan?',
    'Which places of service are approved, and is telehealth allowed for this member?',
    'Is eligibility checking real-time or batch through your clearinghouse?',
  ],
  sources: [EVERNORTH_BH_PROVIDER_SVC, EVERNORTH_PROVIDER_PORTAL],
};

const uhcNjCommercialContact: VobContact = {
  providerServicesPhone: '877-614-0484',
  hours: '24/7 (per UHC provider services contact page)',
  portal: { name: 'Provider Express', url: 'https://www.providerexpress.com' },
  scriptedQuestions: [
    'What is the member\'s plan funding type — fully-insured or self-funded?',
    'Are there unit or hour caps on ABA codes under the Supplemental Clinical Criteria for this plan?',
    'Which places of service and telehealth options are approved?',
    'Is eligibility checking real-time or batch?',
  ],
  sources: [UHC_PROVIDER_CONTACT, OPTUM_SCC],
};

/* ==================== export ==================== */

export const newJerseyVob: Record<string, VobExtension> = {
  'new-jersey-medicaid': { edi: newJerseyMedicaidEdi, stcMap: newJerseyMedicaidStc, codeGrid: njBaselineGrid([NJMMIS_ABA_PACKET]), rates: newJerseyMedicaidRates, vobContact: njMedicaidContact, lastUpdated: ACCESS_DATE },
  'horizon-nj-health': { edi: horizonEdi, stcMap: horizonStc, codeGrid: horizonCodeGrid, rates: mcoBaselineRates('Horizon NJ Health', 'Horizon aligned BH fees to the DMAHS rate increase for DOS on/after 3/1/2024, but the specific ABA amounts are unverified'), vobContact: horizonContact, lastUpdated: ACCESS_DATE },
  'aetna-better-health-new-jersey': { edi: aetnaBetterHealthNjEdi, stcMap: aetnaBetterHealthNjStc, codeGrid: aetnaBetterHealthNjCodeGrid, rates: aetnaNjRates, vobContact: aetnaBetterHealthNjContact, lastUpdated: ACCESS_DATE },
  'fidelis-care-new-jersey': { edi: fidelisEdi, stcMap: fidelisStc, codeGrid: fidelisCodeGrid, rates: mcoBaselineRates('Fidelis Care NJ'), vobContact: fidelisContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-new-jersey': { edi: uhcCpNjEdi, stcMap: uhcCpNjStc, codeGrid: uhcCpNjCodeGrid, rates: mcoBaselineRates('UnitedHealthcare Community Plan NJ'), vobContact: uhcCpNjContact, lastUpdated: ACCESS_DATE },
  'wellpoint-new-jersey': { edi: wellpointEdi, stcMap: wellpointStc, codeGrid: wellpointCodeGrid, rates: mcoBaselineRates('Wellpoint NJ'), vobContact: wellpointContact, lastUpdated: ACCESS_DATE },
  'aetna-new-jersey': { edi: aetnaNjCommercialEdi, stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no New Jersey-specific 270/271 STC document found.'), codeGrid: aetnaNjCommercialCodeGrid, vobContact: aetnaNjCommercialContact, lastUpdated: ACCESS_DATE },
  'cigna-new-jersey': { edi: cignaNjEdi, stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no New Jersey-specific override found.'), codeGrid: cignaNjCodeGrid, vobContact: cignaNjContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-new-jersey': { edi: uhcNjCommercialEdi, stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no New Jersey-specific override found.'), codeGrid: uhcNjCommercialCodeGrid, vobContact: uhcNjCommercialContact, lastUpdated: ACCESS_DATE },
};
