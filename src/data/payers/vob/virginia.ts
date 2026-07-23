/* ================================================================
   VOB ENRICHMENT — Virginia, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables, Medicaid lines
   only). See docs/vob-build.md for the spec. Covers the state Medicaid
   FFS guide, its 5 Cardinal Care MCOs, and the 3 commercial guides:
   virginia-medicaid, aetna-better-health-virginia,
   anthem-healthkeepers-plus, humana-healthy-horizons-virginia,
   sentara-community-plan, unitedhealthcare-community-plan-virginia,
   aetna-virginia, cigna-virginia, unitedhealthcare-virginia.

   Sourcing notes (read before editing):
   - Virginia Medicaid's fiscal agent moved to Acentra Health under the
     Medicaid Enterprise System (MES). The MES/DMAS 270/271 companion
     guide governs where a member's Cardinal Care MCO enrollment appears
     in the 271; see virginia-medicaid.edi.medicaid271Notes for the
     retrieval outcome (populated where confirmed, 'unverified' with a
     verifyVia where the document could not be retrieved this pass — per
     the never-guess rule, NOT a placeholder filled from pattern).
   - Layer 3 (codeGrid) is almost entirely a restructuring of facts
     already verified in the prose corpus (src/data/payers/virginia.ts):
     the DMAS rule that assessment codes 97151/97152/0362T need NO
     service authorization, that all treatment hours require SA with
     units itemized per CPT code effective 10/15/2025, the ≥20-hrs/week
     (80-unit) activity-schedule threshold, and the licensure-tier
     modifiers (no modifier = technician, HN = LABA, TF = LMHP,
     HO = LBA). Two MCO-specific facts change the grid: Anthem
     HealthKeepers Plus publishes the state's clearest code/modifier/POS
     grid (GT telehealth on 97151/97153/97155/97156; school POS 03 on
     97151/97155/97156), and Humana's PA list flags 0362T as
     PA-required — a genuine deviation from the DMAS assessment-code
     baseline, carried honestly rather than normalized away.
   - Layer 4 (rates) is Medicaid-only per the build scope. The DMAS
     licensure-tiered per-15-minute rates come from the DMAS procedure
     fee file (CPT) and the VirginiaABA billing guidance already cited
     in the prose. Codes/tiers the fee file states are shipped
     'verified'; codes the prose did not enumerate ship 'unverified'
     with a verifyVia to the DMAS fee file. The 5 Cardinal Care MCOs run
     the identical DMAS criteria and forms; they are not required to
     match the FFS fee schedule, so their rate tables reference the DMAS
     schedule as the documented baseline, not a plan-confirmed paid rate.
   - Commercial guides (aetna-virginia, cigna-virginia,
     unitedhealthcare-virginia) get Layers 1+3 only — commercial ABA
     rates are contract-specific and out of scope (no rates block).
   - cigna-virginia intentionally has NO PA panel: the current EN0499
     policy explicitly does not apply to Virginia fully-insured
     business, so its codeGrid reflects that exclusion honestly rather
     than inventing PA verdicts. See its codeGrid notes.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const DMAS_APPENDIX_D = src(
  'https://vamedicaid.dmas.virginia.gov/sites/default/files/2025-07/MHS%20-%20Appendix%20D%20(updated%207.17.25)_Final.pdf',
  'DMAS Mental Health Services manual, Appendix D (ABA), rev. 7/17/2025 — confirms assessment codes 97151, 97152, 0362T need no service authorization; all treatment hours require SA. Host (vamedicaid.dmas.virginia.gov) was intermittently unreachable during the prose build; facts here mirror what the corpus already verified from it.'
);
const DMAS_SA_BULLETIN = src(
  'https://vamedicaid.dmas.virginia.gov/bulletin/service-authorization-update-applied-behavior-analysis-aba-effective-october-15-2025',
  'DMAS bulletin — ABA service authorization update, effective 10/15/2025: treatment SA requests (FFS and every Cardinal Care MCO) must itemize units per ABA CPT code on the new DMAS standardized preservice form; requests at or above 20 hrs/week (80 units) must include an individualized activity schedule.'
);
const DMAS_FEE_FILE_INDEX = src(
  'https://www.dmas.virginia.gov/for-providers/rates-and-rate-setting/procedure-fee-files-cpt-codes/',
  'DMAS procedure fee files (CPT) — index page. The current fee file carries the ABA program rows plus generic physician-fee ("REGULAR & CSB," place-of-service IP) rows for 97151/97152/97156/97157 at a few dollars per unit that are NOT the ABA program rates — a confirmed trap. Use only the OP (outpatient) rows with the ABA tier codes.'
);
const DMAS_FEE_FILE_97 = src(
  'https://www.dmas.virginia.gov/media/cptcodes/cptmedical4.csv',
  'DMAS CPT fee file, Part 4 (codes 80002–99607) — the authoritative source for the 97151–97158 ABA rates. Rows read directly: effective 12/01/2021, end 12/31/9999 (still current in the file that also carries 07/01/2026 rows). ABA rows are the OP place-of-service lines with tier codes: technician (no license modifier), U1/HN = LABA, U2/TF = LMHP, U3/U7/HO = LBA.'
);
const DMAS_FEE_FILE_T = src(
  'https://www.dmas.virginia.gov/media/cptcodes/cptmedical1.csv',
  'DMAS CPT fee file, Part 1 — the authoritative source for the 0362T/0373T ABA team-code rates (eff. 12/01/2021, still current).'
);
const DMAS_ABA_BILLING_GUIDANCE = src(
  'https://virginiaaba.org/wp-content/uploads/2021/11/ABA-Billing-Guidance-from-DMAS-Nov21.pdf',
  'VirginiaABA — ABA Billing Guidance from DMAS (Nov 2021): carries a DRAFT watermark and documents the licensure-tier MODIFIER definitions (no modifier = technician, HN = LABA, TF = LMHP, HO = LBA) and code descriptions — but NO dollar amounts. Cited here for modifier/tier logic only, not for the rate figures (which come from the live DMAS fee file CSVs above).',
  true
);
const DMAS_BRAVO_FAQ = src(
  'https://www.dmas.virginia.gov/media/4271/project-bravo-services-faqs-aba.pdf',
  'DMAS — Project BRAVO ABA FAQ: confirms the assessment-codes-need-no-SA rule and the initial-assessment-in-person requirement.'
);
const DMAS_SA_ACENTRA = src(
  'https://www.dmas.virginia.gov/for-providers/service-authorization/',
  'DMAS — service authorization page: FFS ABA authorizations run through Acentra Health\'s Atrezzo portal; MCO members follow their plan\'s UM process.'
);
const VA_MES_270271_CG = src(
  'https://vamedicaid.dmas.virginia.gov/sites/default/files/2026-07/MES%20EDI%20270-271%20Companion%20Guide_R100_20220509-PK%202.pdf',
  'Commonwealth of Virginia MES MMIS Companion Guide — 270/271 (ASC X12N 005010X279A1), Document Version 2.2, dated 2026-07-01, published by DMAS. Read in full. Notes: (1) the guide does NOT document a segment carrying the member\'s Cardinal Care MCO — Loop 2120C NM1 (NM108=PI, NM109 = TPL Carrier Code, NM103 = carrier name) is explicitly Third-Party Liability (other/commercial insurance), and MSG/2110C carries a 3-digit Aid Category / benefit-plan code (when EB01=1), not an MCO name; (2) no carrier-code → MCO-name table is published; (3) eligibility is queried by date (270 DTP01=291 plan date; 271 echoes DTP01=472), real-time (~60s) and batch (up to 100,000/day) both supported, with v2.2 adding DTP01=458 renewal/case-review date; (4) the guide — even the 7/1/2026 v2.2 — still names Conduent as the EDI fiscal agent (Virginia.EDISupport@Conduent.com, 1-866-352-0766), NOT Acentra; Acentra Health operates the FFS service-authorization Atrezzo portal, a separate function.'
);
const ANTHEM_VA_ABA_GRID = src(
  'https://providers.anthem.com/docs/gpp/VA_CAID_ABARequirements.pdf?v=202302021327',
  'Anthem HealthKeepers Plus (VA) — ABA requirements bulletin (Feb 2023): the state\'s clearest published ABA code/modifier/place-of-service grid — no SA on 97151/97152/0362T; SA required on 97153–97158 and 0373T; GT telehealth combinations payable on 97151, 97153, 97155, 97156; school allowed as a place of service (POS 03) for 97151, 97155, 97156.'
);
const ANTHEM_VA_INITIAL_SA = src(
  'https://providers.anthem.com/docs/gpp/VA_CCC_BH_ABA_InitialStay.pdf?v=202301010312',
  'Anthem HealthKeepers Plus (VA) — ABA initial SA request form (DMAS standardized): carries the DMAS header/admission criteria verbatim; requires an LMHP-level attestation and a listing of all ABA/behavior-therapy episodes from the prior 12 months.'
);
const HUMANA_VA_PAL = src(
  'https://assets.humana.com/is/content/humana/VA%20Medicaid%20PALpdf',
  'Humana Healthy Horizons in Virginia — PA and notification list (effective 7/1/2025): requires PA on 97153–97158 and 0373T; 97151 and 97152 are PA-free per the DMAS baseline; the list additionally flags 0362T as PA-required — a deviation from the DMAS assessment-code baseline.'
);
const AETNA_VA_ABA_DECK = src(
  'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/virginia/provider/pdf/abhva_applied_behavioral_analysis_providers.pdf',
  'Aetna Better Health of Virginia — ABA provider collaboration deck: DMAS standardized forms via Availity or fax (833) 757-1583; the authorization is tied to the rendering LBA/LMHP NPI (a provider change closes the auth and requires a new one); telehealth follows state policy (GT modifier).'
);
const SENTARA_VA_SA_FORM = src(
  'https://shc-p-001.sitecorecontenthub.cloud/api/public/content/c4fe04b9052647fb8655708609cc9e7f?v=4adf8dd1',
  'Sentara Community Plan — DMAS ABA preservice SA request form (units-per-code version, DOS 9/1/2025+): embeds the DMAS rules — units requested per CPT code, and the 20-hour/80-unit threshold that triggers the individualized activity schedule.'
);
const UHC_VA_PA_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/va/prior-authorization-and-notification/VA-UHCCP-Prior-Authorization-Effective-3-1-2025.pdf',
  'UnitedHealthcare Community Plan of Virginia — PA requirements (effective 3/1/2025): ABA is singled out for submission "via fax or Provider Express," bypassing the standard UHC PA&N tool; the DMAS service-specific forms and criteria govern the clinical substance.'
);
const UHC_VA_MANUAL = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/admin-guides/comm-plan/VA-UHCCP-Care-Provider-Manual.pdf',
  'UnitedHealthcare Community Plan of Virginia — 2026 provider manual (BH chapter): all mental-health services (ABA included) require registration/authorization using a DMAS service-specific form; Optum\'s national ABA guideline does not override the Virginia DMAS rules.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 (Applied Behavior Analysis) — national medical-necessity policy applied to Aetna commercial in Virginia; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers published in it.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — national ASD coverage policy; 97151–97158 covered when selection criteria are met; no coding/reimbursement mechanics published.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 (Intensive Behavioral Interventions), effective 5/15/2026 — states verbatim that Virginia fully-insured business is NOT subject to the policy. For fully-insured VA Cigna members, coverage terms come from the plan document and the state mandate, not EN0499\'s IBI criteria; self-funded (ASO) plans still follow EN0499.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025) — states "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna\'s medical claims (no separate Evernorth EDI hop).'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — the national clinical policy behind UnitedHealthcare/Optum commercial ABA; contains no CPT-level coding/reimbursement mechanics (ICD-10 F84.0 only).'
);
const OPTUM_ABA_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum ABA State Mandates supplemental criteria (BH 803ABA) — Virginia entry (eff. July 2022) adopts the Virginia statutory definitions of "autism spectrum disorder" and "medically necessary" for VA commercial fully-insured HMO/insurance plans.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the fetchable copy carries an "As of 08/08/2012" footer on every page (same staleness finding applied across this directory); any ID read from it is treated as inferred/unverified pending a current Availity export.',
  true
);

/* -------------------- Layer 7 (contact & channel) source refs --------------
   Fetched from the same domains already cited above, plus a handful of
   payer contact-us pages, specifically for provider-services phone/fax/
   portal/hours facts — the codeGrid/edi sources above didn't quote these. */
const DMAS_PROVIDER_CONTACT = src(
  'https://www.dmas.virginia.gov/for-providers/service-authorization/',
  'DMAS service-authorization page, provider-contact section: general DMAS Provider Services 1-800-552-8627 (in-state long distance) or (804) 786-6273 (local/out-of-state); Acentra Health service-authorization line 1-888-827-2884 (1-888-VAPAUTH), fax 1-877-OKBYFAX (652-9329); Acentra\'s Atrezzo portal is at https://portal.kepro.com/Login/Login and is available 24/7 for SA submission (phone-support hours for the general DMAS line are not published on this page).'
);
const AETNA_BH_VA_CONTACT = src(
  'https://www.aetnabetterhealth.com/virginia/providers/index.html',
  'Aetna Better Health of Virginia — provider home page: Provider Services 1-800-279-1878 (TTY: 711), Monday-Friday 8 AM-6 PM; provider portal is Availity (apps.availity.com).'
);
const ANTHEM_VA_CONTACT = src(
  'https://providers.anthem.com/virginia-provider/contact-us',
  'Anthem HealthKeepers Plus (VA Medicaid) — Contact Us page: Provider Services 800-901-0020 (TTY/TDD: 711); provider portal is Availity Essentials (availity.com); page also references a 24/7 NurseLine — a separate line whose own phone hours are not published on this page.'
);
const HUMANA_VA_CONTACT = src(
  'https://provider.humana.com/medicaid/virginia-medicaid/contact-us',
  'Humana Healthy Horizons in Virginia — provider Contact Us page: Provider Services 844-881-4482, Monday-Friday 7 a.m.-7 p.m. Eastern time.'
);
const SENTARA_VA_CONTACT = src(
  'https://www.sentarahealthplans.com/en/providers/contact-us',
  'Sentara Health Plans — provider Contact Us page: Medicaid Provider Services 757-552-7474 or 1-800-229-8822, 8 a.m.-6 p.m. Monday-Friday; Behavioral Health Provider Services 757-552-7174 or 1-800-648-8420 (same Medicaid hours); fax 757-552-7499 (behavioral health) / 757-552-7316 (general); provider portal is Availity (www.Availity.com).'
);
const UHC_PROVIDER_CONTACT = src(
  'https://www.uhcprovider.com/en/contact-us.html',
  'UHCprovider.com — Contact Us page: general Provider Services 877-842-3210 (24/7 chat also available in the UnitedHealthcare Provider Portal); behavioral health routes to Optum Provider Express, or call 877-614-0484 directly.'
);
const OPTUM_PROVIDER_EXPRESS_HOME = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en.html',
  'Optum Provider Express home page — confirms Provider Express as the live behavioral-health provider portal (clinical + administrative resources); no phone number or hours published on the home page itself.'
);
const AETNA_PROVIDER_SERVICE_CENTER = src(
  'https://www.aetna.com/about-us/contact-aetna.html',
  'Aetna — Contact Us page: Provider Service Center 1-888-632-3862 (TTY: 711) for non-Medicare plans (individual & family / commercial), handling benefits, claims, appeals, and precertification (select the precertification prompt); line-specific hours not published on this page.'
);
const AETNA_AVAILITY_PAGE = src(
  'https://www.aetna.com/health-care-professionals/availity.html',
  'Aetna — Availity provider-portal page: confirms Availity (apps.availity.com) as Aetna\'s provider portal; Availity Client Services line 1-800-282-4548, Monday-Friday 8 AM-8 PM ET, is for Availity portal support, not Aetna claims/precert.'
);
const CIGNA_PROVIDER_SERVICES_CONTACT = src(
  'https://www.cigna.com/health-care-providers/credentialing',
  'Cigna Healthcare — provider credentialing/contact page: general Provider Services 1-800-88CIGNA (882-4462); behavioral health provider services 1-800-926-2273; provider portal is CignaforHCP (cignaforhcp.cigna.com/app/login).'
);

/* ==================== Layer 4 — DMAS rate table (shared) ==================== */
/* DMAS licensure-tiered per-15-minute rates. Tiers: no modifier = technician,
   HN = LABA, TF = LMHP, HO = LBA. Codes/tiers the prose corpus verified from the
   DMAS fee file + VirginiaABA billing guidance ship 'verified'; codes not
   enumerated there ship 'unverified' with a verifyVia to the DMAS fee file. */
const virginiaMedicaidRates: RateTable = {
  source:
    'DMAS CPT fee file (cptmedical4.csv for 97151–97158; cptmedical1.csv for 0362T/0373T), read directly from the live file: licensure-tiered per-15-minute ABA rates effective 12/01/2021 (end 12/31/9999), still current in the file that also carries 07/01/2026 rows. Tiers flagged by modifier: no modifier = technician, HN/U1 = LABA, TF/U2 = LMHP, HO/U3/U7 = LBA; ABA rows are the OP (outpatient) place-of-service lines. Trap (confirmed): the file also carries generic "REGULAR & CSB" IP rows for 97151/97152/97156/97157 at a few dollars per unit (e.g. 97151 IP $6.75) — those are the non-ABA physician-fee lines, NOT the ABA program rates. Modifier definitions cross-checked against VirginiaABA\'s (draft) DMAS billing guidance.',
  effectiveDate: '2021-12-01',
  byCode: {
    // Direct-service tiers (technician / LABA-HN / LMHP-TF / LBA-HO), per 15 min. QHP-only codes have no technician tier.
    '97151': { rate: '$23.48 (LABA) / $39.40 (LMHP) / $46.63 (LBA)', unit: '15min', modifierTiers: { 'HN (LABA)': '$23.48', 'TF (LMHP)': '$39.40', 'HO (LBA)': '$46.63' } },
    '97152': { rate: '$15.00 (technician) / $23.48 (LABA)', unit: '15min', modifierTiers: { technician: '$15.00', 'HN (LABA)': '$23.48' } },
    '97153': { rate: '$15.00 (technician)', unit: '15min', modifierTiers: { technician: '$15.00', 'HN (LABA)': '$23.48', 'TF (LMHP)': '$39.40', 'HO (LBA)': '$46.63' } },
    '97154': { rate: '$12.77 (technician) — group', unit: '15min', modifierTiers: { technician: '$12.77', 'HN (LABA)': '$15.60', 'TF (LMHP)': '$13.13', 'HO (LBA)': '$15.55' } },
    '97155': { rate: '$23.48 (LABA) / $39.40 (LMHP) / $46.63 (LBA)', unit: '15min', modifierTiers: { 'HN (LABA)': '$23.48', 'TF (LMHP)': '$39.40', 'HO (LBA)': '$46.63' } },
    '97156': { rate: '$23.48 (LABA) / $39.40 (LMHP) / $46.63 (LBA)', unit: '15min', modifierTiers: { 'HN (LABA)': '$23.48', 'TF (LMHP)': '$39.40', 'HO (LBA)': '$46.63' } },
    '97157': { rate: '$7.83 (LABA) / $13.13 (LMHP) / $15.55 (LBA) — multi-family group', unit: '15min', modifierTiers: { 'HN (LABA)': '$7.83', 'TF (LMHP)': '$13.13', 'HO (LBA)': '$15.55' } },
    '97158': { rate: '$22.83 (LABA) / $28.13 (LMHP) / $30.54 (LBA) — group w/ protocol mod', unit: '15min', modifierTiers: { 'HN (LABA)': '$22.83', 'TF (LMHP)': '$28.13', 'HO (LBA)': '$30.54' } },
    '0362T': { rate: '$53.47 (LABA) / $69.39 (LMHP) / $76.62 (LBA) — team supporting assessment', unit: '15min', modifierTiers: { 'HN (LABA)': '$53.47', 'TF (LMHP)': '$69.39', 'HO (LBA)': '$76.62' } },
    '0373T': { rate: '$53.47 (LABA) / $69.39 (LMHP) / $76.62 (LBA) — team treatment', unit: '15min', modifierTiers: { 'HN (LABA)': '$53.47', 'TF (LMHP)': '$69.39', 'HO (LBA)': '$76.62' } },
  },
  sources: [DMAS_FEE_FILE_97, DMAS_FEE_FILE_T, DMAS_FEE_FILE_INDEX, DMAS_ABA_BILLING_GUIDANCE],
};

/* MCO rate tables reference the DMAS schedule as the documented baseline. The
   5 Cardinal Care MCOs run identical DMAS criteria/forms but are not required
   to match the FFS fee schedule (contract-negotiated), so these are the
   reference floor, not a plan-confirmed paid rate. */
function mcoRates(planName: string): RateTable {
  return {
    source: `${virginiaMedicaidRates.source} No ${planName}-specific ABA fee schedule is publicly posted; the 5 Cardinal Care MCOs run identical DMAS criteria and standardized forms but are not required to match the FFS schedule — this table is the DMAS reference baseline, not a plan-confirmed paid rate.`,
    effectiveDate: virginiaMedicaidRates.effectiveDate,
    byCode: virginiaMedicaidRates.byCode,
    sources: [DMAS_FEE_FILE_97, DMAS_FEE_FILE_T, DMAS_ABA_BILLING_GUIDANCE],
  };
}

/* ==================== Layer 3 — codeGrid factories ==================== */

/* DMAS baseline: assessment codes 97151/97152/0362T need NO service
   authorization; treatment codes require SA with per-code units (eff.
   10/15/2025) and the ≥20-hr/week activity-schedule threshold. Licensure-tier
   modifiers apply statewide; telehealth via GT modifier per state policy. */
function dmasAssessmentEntry(notes?: string, extraSources: SourceRef[] = []): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Not required — DMAS rule: assessment codes 97151, 97152, 0362T need no service authorization',
    unitCap: 'No hard cap — EPSDT medical necessity governs; comprehensive assessment typically authorized in a bounded window per the treatment request',
    capPeriod: 'n/a (no SA on assessment codes)',
    posAllowed: ['home', 'office/clinic (11)', 'school (03)', 'community', 'telehealth (GT)'],
    telehealth: 'Yes — GT modifier, per DMAS state telehealth policy (initial assessment must be conducted in person).',
    modifiers: ['no modifier = technician', 'HN = LABA', 'TF = LMHP', 'HO = LBA'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [DMAS_APPENDIX_D, DMAS_BRAVO_FAQ, ...extraSources],
  };
}

function dmasTreatmentEntry(notes?: string, extraSources: SourceRef[] = []): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — service authorization on the DMAS standardized preservice form; units itemized per CPT code (eff. 10/15/2025)',
    unitCap: 'No hard cap — units requested per code; requests ≥20 hrs/week (80 units) must include an individualized activity schedule',
    capPeriod: 'per authorization span (EPSDT medical necessity; ~6-month spans typical)',
    posAllowed: ['home', 'office/clinic (11)', 'school (03)', 'community', 'telehealth (GT)'],
    telehealth: 'Yes — GT modifier, per DMAS state telehealth policy.',
    modifiers: ['no modifier = technician', 'HN = LABA', 'TF = LMHP', 'HO = LBA'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [DMAS_APPENDIX_D, DMAS_SA_BULLETIN, ...extraSources],
  };
}

/* Standard DMAS grid shared by FFS + the Cardinal Care MCOs that pass DMAS
   through unchanged (Aetna, Sentara, UHC-VA). MCO-specific deviations
   (Anthem's published POS/telehealth grid, Humana's 0362T PA quirk) get their
   own factories below. */
function dmasCodeGrid(extraTreatmentSources: SourceRef[] = [], extraAssessmentSources: SourceRef[] = []): Record<string, CodeGridEntry> {
  return {
    '97151': dmasAssessmentEntry('Behavior-identification assessment (QHP). No service authorization — book the assessment on an ASD diagnosis; build the treatment request from it.', extraAssessmentSources),
    '97152': dmasAssessmentEntry('Supporting assessment (technician-adjunct). No service authorization.', extraAssessmentSources),
    '0362T': dmasAssessmentEntry('Behavior-identification supporting assessment (extended/destructive-behavior). No service authorization under the DMAS baseline (note: Humana Healthy Horizons flags 0362T as PA-required — see that guide).', extraAssessmentSources),
    '97153': dmasTreatmentEntry('Direct one-on-one adaptive-behavior treatment by a technician. Per-code units on the preservice form since 10/15/2025.', extraTreatmentSources),
    '97154': dmasTreatmentEntry('Group adaptive-behavior treatment. SA required.', extraTreatmentSources),
    '97155': dmasTreatmentEntry('Adaptive-behavior treatment with protocol modification (QHP). SA required; billable alongside 97153 when the QHP directs face-to-face.', extraTreatmentSources),
    '97156': dmasTreatmentEntry('Family adaptive-behavior treatment guidance (QHP). SA required.', extraTreatmentSources),
    '97157': dmasTreatmentEntry('Multiple-family group guidance. SA required.', extraTreatmentSources),
    '97158': dmasTreatmentEntry('Group adaptive-behavior treatment with protocol modification. SA required.', extraTreatmentSources),
    '0373T': dmasTreatmentEntry('Extended/destructive-behavior treatment protocol (extra-technician). SA required.', extraTreatmentSources),
  };
}

/* ==================== virginia-medicaid ==================== */

const virginiaMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00197', availity: 'AIDVA', changeHealthcare: 'unverified' },
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
      "The MES 270/271 companion guide (v2.2) does NOT document a segment carrying the Cardinal Care MCO name. What it does document: MSG/Loop 2110C (MSG01, when EB01='1') carries a 3-digit Aid Category / benefit-plan code — NOT an MCO name; Loop 2120C NM1 (NM108='PI', NM109 = TPL Carrier Code, NM103 = carrier name) is explicitly Third-Party Liability (other/commercial insurance), NOT the Medicaid MCO; EB04='MC' flags Medicaid coverage generically. Per the never-guess rule, the specific Cardinal Care MCO is treated as NOT reliably returned by the FFS 271 per this guide — confirm on a live 271 or with DMAS MES EDI support.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      "Queried by specific date, not a monthly/daily span flag: the 270 sends DTP01='291' (plan date) and the 271 echoes DTP01='472' (eligibility/benefit date). Real-time (single inquiry, ~60-sec response) and batch (up to 100,000 requests/day, 271 ~6 a.m. next day) both supported. v2.2 (eff. 7/1/2026) adds DTP01='458' (member renewal / case-review date) in Loop 2110C. Explicit monthly-vs-daily characterization is not stated in the guide.",
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.availity': 'Availity short name VA_MCAID = "AIDVA" appears only in the stale 2012 Availity snapshot; confirm against a current Availity Essentials export.',
    'payerId.changeHealthcare': 'No primary Change Healthcare/Optum ID confirmed for VA Medicaid FFS this pass. Do NOT use "12115 / VA Fee Basis Programs" — that is U.S. Dept. of Veterans Affairs, not Virginia Medicaid. Confirm via the CHC/Optum payer finder and the DMAS MES EDI portal.',
    'medicaid271Notes.mcoSegmentLocation':
      'DMAS MES EDI support (MESEDISupport@dmas.virginia.gov, or Conduent EDI 1-866-352-0766 / Virginia.EDISupport@Conduent.com): request a production 271 sample and ask specifically where the member\'s Cardinal Care MCO is reported (MSG aid-category vs. a benefit-related-entity loop vs. not returned via the FFS 271).',
    'medicaid271Notes.mcoCarrierCodes': 'Same DMAS MES EDI support — the carrier/MCO code crosswalk is not in the 270/271 guide (likely in the 834 enrollment materials).',
  },
  sources: [VA_MES_270271_CG, DMAS_SA_ACENTRA, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== aetna-better-health-virginia ==================== */

const aetnaBetterHealthVaEdi: EdiRouting = {
  payerId: { pverify: '000935', availity: '128VA', changeHealthcare: '128VA' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (DMAS pass-through; Aetna administers ABA in-house on DMAS forms)',
    administratorPayerId: '128VA',
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
    'payerId.pverify': 'pVerify 000935 = "AETNA BETTER HEALTH VIRGINIA" (Medical, Eligibility=Yes) on the pVerify Mar-2026 list.',
    'payerId.availity': 'Health Plan Payer ID 128VA per the DMAS Aetna MCO Directory (2024-03-07) and Aetna Better Health VA claims guidance (also the Office Ally / Change Healthcare submission ID).',
    'payerId.changeHealthcare': 'Change Healthcare submissions also use 128VA per Aetna Better Health VA claims guidance.',
    supportsRealtime: 'Confirm real-time vs. batch via the plan\'s EDI onboarding for 128VA.',
  },
  sources: [AETNA_VA_ABA_DECK, PVERIFY_PAYER_LIST],
};

const aetnaBetterHealthVaCodeGrid = dmasCodeGrid([AETNA_VA_ABA_DECK]);

/* ==================== anthem-healthkeepers-plus ==================== */

const anthemHkpEdi: EdiRouting = {
  payerId: { pverify: '002467', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (DMAS pass-through; Anthem administers ABA on DMAS forms via Availity/ICR)',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify 002467 = "Anthem Healthkeepers" (Medical, Eligibility=Yes) on the pVerify Mar-2026 list.',
    'payerId.availity': 'The DMAS Anthem MCO Directory (2025-10-17) states the clearinghouse payer ID must be obtained from your clearinghouse — the published "058916206CMSCOS" is a direct-to-Anthem billing ID, not a clearinghouse ID. Anthem uses Availity as its exclusive EDI gateway; confirm the specific 270/271 payer ID via Availity Essentials / the Anthem VA EDI page.',
    'payerId.changeHealthcare': 'Clearinghouse-specific per the DMAS directory; confirm via the Change Healthcare/Optum payer finder for Anthem HealthKeepers Plus (VA Medicaid).',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding.',
  },
  sources: [ANTHEM_VA_ABA_GRID, PVERIFY_PAYER_LIST],
};

/* Anthem publishes the state's clearest grid — capture its specific POS/telehealth facts. */
function anthemHkpAssessmentEntry(code: string, telehealthGt: boolean, schoolPos: boolean): CodeGridEntry {
  const pos = ['home', 'office/clinic (11)', 'community'];
  if (schoolPos) pos.push('school (POS 03) — allowed per Anthem\'s published grid');
  if (telehealthGt) pos.push('telehealth (GT)');
  return {
    covered: 'Yes',
    paRequired: `Not required — Anthem\'s published grid confirms no service authorization on ${code}`,
    unitCap: 'No hard cap — EPSDT medical necessity; the initial behavior-identification assessment sequence follows the DMAS baseline',
    capPeriod: 'n/a (no SA on assessment codes)',
    posAllowed: pos,
    telehealth: telehealthGt
      ? 'Yes — GT telehealth combination payable on this code per Anthem\'s published grid.'
      : 'Per DMAS state telehealth policy; this code is not listed among Anthem\'s explicitly GT-payable ABA codes.',
    modifiers: ['no modifier = technician', 'HN = LABA', 'TF = LMHP', 'HO = LBA'],
    notes: 'Anthem HealthKeepers Plus publishes the state\'s clearest ABA code/modifier/POS grid (Feb 2023 bulletin). The initial SA form requires an LMHP-level attestation and a 12-month prior-ABA-episode history.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: telehealthGt ? 'verified' : 'inferred',
      modifiers: 'verified',
    },
    sources: [ANTHEM_VA_ABA_GRID, ANTHEM_VA_INITIAL_SA],
  };
}

function anthemHkpTreatmentEntry(code: string, telehealthGt: boolean, schoolPos: boolean): CodeGridEntry {
  const pos = ['home', 'office/clinic (11)', 'community'];
  if (schoolPos) pos.push('school (POS 03) — allowed per Anthem\'s published grid');
  if (telehealthGt) pos.push('telehealth (GT)');
  return {
    covered: 'Yes',
    paRequired: `Required — SA on ${code} per Anthem\'s published grid; units itemized per CPT code on the DMAS standardized form (eff. 10/15/2025)`,
    unitCap: 'No hard cap — per-code units; requests ≥20 hrs/week (80 units) need an individualized activity schedule (stated on Anthem\'s own form)',
    capPeriod: 'per authorization span (~6-month spans typical)',
    posAllowed: pos,
    telehealth: telehealthGt
      ? 'Yes — GT telehealth combination payable on this code per Anthem\'s published grid.'
      : 'Per DMAS state telehealth policy; this code is not listed among Anthem\'s explicitly GT-payable ABA codes.',
    modifiers: ['no modifier = technician', 'HN = LABA', 'TF = LMHP', 'HO = LBA'],
    notes: 'Grid worth bookmarking: Anthem\'s Feb 2023 bulletin publishes the full ABA code/modifier/POS grid; BH authorizations submit via Availity Essentials\' Interactive Care Reviewer.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: telehealthGt ? 'verified' : 'inferred',
      modifiers: 'verified',
    },
    sources: [ANTHEM_VA_ABA_GRID, ANTHEM_VA_INITIAL_SA],
  };
}

const anthemHkpCodeGrid: Record<string, CodeGridEntry> = {
  // GT telehealth explicitly payable on 97151, 97153, 97155, 97156; school POS 03 on 97151, 97155, 97156.
  '97151': anthemHkpAssessmentEntry('97151', true, true),
  '97152': anthemHkpAssessmentEntry('97152', false, false),
  '0362T': anthemHkpAssessmentEntry('0362T', false, false),
  '97153': anthemHkpTreatmentEntry('97153', true, false),
  '97154': anthemHkpTreatmentEntry('97154', false, false),
  '97155': anthemHkpTreatmentEntry('97155', true, true),
  '97156': anthemHkpTreatmentEntry('97156', true, true),
  '97157': anthemHkpTreatmentEntry('97157', false, false),
  '97158': anthemHkpTreatmentEntry('97158', false, false),
  '0373T': anthemHkpTreatmentEntry('0373T', false, false),
};

/* ==================== humana-healthy-horizons-virginia ==================== */

const humanaVaEdi: EdiRouting = {
  payerId: { pverify: '00112', availity: '61101', changeHealthcare: '61101' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (DMAS pass-through; Humana administers ABA on DMAS forms via Availity)',
    administratorPayerId: '61101',
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
  },
  verifyVia: {
    'payerId.pverify': 'pVerify has no VA-specific Humana row; 00112 = generic "Humana" (Medical, Eligibility=Yes). Confirm the Humana Healthy Horizons Virginia-specific mapping via pVerify payer search (plan entered VA 7/1/2025, replacing Molina).',
    'payerId.availity': 'Payer ID 61101 per Humana\'s official VA Medicaid claims page (Humana\'s universal ID, used across Availity and Change Healthcare).',
    'payerId.changeHealthcare': 'Same universal Humana ID 61101 per the VA Medicaid claims page.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 61101.',
  },
  sources: [HUMANA_VA_PAL, PVERIFY_PAYER_LIST],
};

/* Humana's PA list flags 0362T as PA-required — a genuine deviation from the
   DMAS assessment-code baseline. 97151/97152 stay PA-free. */
const humanaVaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': dmasAssessmentEntry('97151 is PA-free on Humana\'s VA PA list (effective 7/1/2025), consistent with the DMAS baseline.', [HUMANA_VA_PAL]),
  '97152': dmasAssessmentEntry('97152 is PA-free on Humana\'s VA PA list, consistent with the DMAS baseline.', [HUMANA_VA_PAL]),
  '0362T': {
    covered: 'Yes',
    paRequired: 'Required — PLAN QUIRK: Humana\'s VA PA and notification list (eff. 7/1/2025) flags 0362T as PA-required, unlike the DMAS baseline where 0362T is an authorization-free assessment code. Request the auth rather than litigating the discrepancy; note the DMAS rule in the request.',
    unitCap: 'No hard cap — EPSDT medical necessity',
    capPeriod: 'per authorization',
    posAllowed: ['home', 'office/clinic (11)', 'school (03)', 'community', 'telehealth (GT)'],
    telehealth: 'Yes — GT modifier, per DMAS state telehealth policy.',
    modifiers: ['no modifier = technician', 'HN = LABA', 'TF = LMHP', 'HO = LBA'],
    notes: 'The one genuine deviation from the DMAS assessment-code baseline among the Cardinal Care MCOs — carried honestly rather than normalized to the state rule.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [HUMANA_VA_PAL, DMAS_APPENDIX_D],
  },
  '97153': dmasTreatmentEntry('PA required on 97153–97158 and 0373T per Humana\'s VA PA list (eff. 7/1/2025).', [HUMANA_VA_PAL]),
  '97154': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
  '97155': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
  '97156': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
  '97157': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
  '97158': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
  '0373T': dmasTreatmentEntry('PA required per Humana\'s VA PA list.', [HUMANA_VA_PAL]),
};

/* ==================== sentara-community-plan ==================== */

const sentaraEdi: EdiRouting = {
  payerId: { pverify: '002478', availity: '54154', changeHealthcare: '54154' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none (DMAS pass-through; Sentara Health Plans administers ABA in-house)',
    administratorPayerId: '54154',
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
    'payerId.pverify': 'pVerify 002478 = "SENTARA HEALTH PLANS" (Medical, Eligibility=Yes); legacy "Optima/Sentara" 00310 also exists. Directory entries under "Optima" are stale.',
    'payerId.availity': 'Payer ID 54154 per the DMAS Sentara MCO Directory (2025-10-29); corroborated by the 2012 Availity row "OPTIMA HEALTH PLAN → 54154."',
    'payerId.changeHealthcare': 'Payer ID 54154 per the DMAS Sentara MCO Directory; legacy Virginia Premier (VP) group runout claims go to CHC ID VAPRM.',
    supportsRealtime: 'Confirm real-time vs. batch via the plan\'s EDI onboarding; the PAL lookup tool at pal.sentarahealthplans.com answers code-level questions.',
  },
  sources: [SENTARA_VA_SA_FORM, PVERIFY_PAYER_LIST],
};

const sentaraCodeGrid = dmasCodeGrid([SENTARA_VA_SA_FORM]);

/* ==================== unitedhealthcare-community-plan-virginia ==================== */

const uhcCpVaEdi: EdiRouting = {
  payerId: { pverify: 'UHG001', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (network/authorization; claims ride the medical payer ID)',
    administratorPayerId: '87726',
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
    'payerId.pverify': 'pVerify has no VA-specific UHC Community Plan row; UHG001 = generic "UnitedHealth Group - Community Plan" (Eligibility=Yes). Confirm the VA-specific mapping via pVerify payer search.',
    'payerId.availity': 'Health Plan Payer ID 87726 (Institutional / Professional / Professional Mental Health) per the DMAS UHC MCO Directory (2024-03-07).',
    'payerId.changeHealthcare': 'UHC universal medical ID 87726 per the DMAS directory (also the UHC affiliates EDI payer list).',
    'bhCarveOut.abaRidesOn': 'The DMAS UHC directory lists "Professional Mental Health — 87726," i.e. ABA/BH claims ride the SAME 87726 medical payer ID; Optum administers the panel/authorizations (Provider Express, Optum BH 1-888-872-4205) but does not change claim routing — so no second EDI hop.',
    supportsRealtime: 'Confirm real-time vs. batch via the plan\'s EDI onboarding for 87726.',
  },
  sources: [UHC_VA_PA_LIST, UHC_VA_MANUAL, PVERIFY_PAYER_LIST],
};

const uhcCpVaCodeGrid = dmasCodeGrid([UHC_VA_PA_LIST, UHC_VA_MANUAL]);

/* ==================== aetna-virginia (commercial) ==================== */

const aetnaVaEdi: EdiRouting = {
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
    'payerId.changeHealthcare': 'Change Healthcare/Optum professional-claims list confirms 60054 = "Aetna Health Plan - PPO" (supports 270/271).',
    'bhCarveOut.administrator': 'Aetna Behavioral Health rides the same medical payer ID (no second hop); confirm the VA-specific ABA precertification path via Aetna provider services.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 60054.',
  },
  sources: [AETNA_CPB0554, AETNA_CPB0648, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* Commercial national policy — no coding/reimbursement mechanics published. */
function aetnaCommercialEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification via Availity or phone (both assessment and treatment), per Aetna\'s national CPB 0554/0648; reauthorization commonly ~6 months. For fully-insured VA plans the Va. Code § 38.2-3418.17 mandate is the legal floor; self-funded ERISA plans are exempt.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Aetna provider services / precertification and a live benefits check (plan funding type first) — CPB 0554 & 0648 are medical-necessity policies with no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers. Commercial ABA rates are contract-specific (out of Layer 4 scope).',
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

const aetnaVaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaCommercialEntry(),
  '97152': aetnaCommercialEntry(),
  '97153': aetnaCommercialEntry(),
  '97154': aetnaCommercialEntry(),
  '97155': aetnaCommercialEntry(),
  '97156': aetnaCommercialEntry(),
  '97157': aetnaCommercialEntry(),
  '97158': aetnaCommercialEntry(),
  '0362T': aetnaCommercialEntry(),
  '0373T': aetnaCommercialEntry(),
};

/* ==================== cigna-virginia (commercial) ==================== */
/* INTENTIONAL: no PA panel. EN0499 explicitly does not apply to VA
   fully-insured business — the codeGrid reflects the exclusion honestly
   rather than inventing PA verdicts. */

const cignaVaEdi: EdiRouting = {
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
    'payerId.pverify': 'pVerify 00004 = "Cigna" (Medical, Eligibility=Yes); pVerify also lists "Cigna Behavioral" 00510.',
    'payerId.availity': 'Evernorth payer ID 62308 per the Cigna Autism Resource Guide (same ID as Cigna medical — no separate Evernorth EDI hop); inferred pending a current Availity export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum professional-claims list confirms 62308 = "CIGNA - PPO" (supports 270/271).',
    supportsRealtime: 'Confirm real-time vs. batch via the clearinghouse onboarding for 62308.',
  },
  sources: [CIGNA_AUTISM_GUIDE, CIGNA_EN0499, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* No PA panel by design — EN0499 carves VA fully-insured out of the policy. */
function cignaVaExclusionEntry(): CodeGridEntry {
  return {
    covered: 'Plan-dependent — for fully-insured VA members, coverage comes from the plan document + the Va. Code § 38.2-3418.17 mandate, NOT EN0499; self-funded (ASO) plans follow EN0499.',
    paRequired: 'No PA panel published for this guide — EN0499 explicitly does not apply to Virginia fully-insured business, so the national no-assessment-PA / treatment-PA rules cannot be assumed. Determine the plan\'s funding type on a live benefits check before assuming any PA verdict.',
    unitCap: 'plan-dependent',
    capPeriod: 'plan-dependent',
    posAllowed: ['plan-dependent'],
    telehealth: 'plan-dependent',
    modifiers: ['plan-dependent'],
    notes: 'Intentionally no invented PA fields: the current EN0499 (eff. 5/15/2026) states verbatim that Virginia fully-insured business is not subject to the policy. Verify via: a live benefits check (funding type first) + Cigna/Evernorth provider services; for fully-insured plans, the plan document and the state mandate govern.',
    fieldStatus: {
      covered: 'plan-dependent',
      paRequired: 'plan-dependent',
      unitCap: 'plan-dependent',
      posAllowed: 'plan-dependent',
      telehealth: 'plan-dependent',
      modifiers: 'plan-dependent',
    },
    sources: [CIGNA_EN0499],
  };
}

const cignaVaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaVaExclusionEntry(),
  '97152': cignaVaExclusionEntry(),
  '97153': cignaVaExclusionEntry(),
  '97154': cignaVaExclusionEntry(),
  '97155': cignaVaExclusionEntry(),
  '97156': cignaVaExclusionEntry(),
  '97157': cignaVaExclusionEntry(),
  '97158': cignaVaExclusionEntry(),
  '0362T': cignaVaExclusionEntry(),
  '0373T': cignaVaExclusionEntry(),
};

/* ==================== unitedhealthcare-virginia (commercial) ==================== */

const uhcVaEdi: EdiRouting = {
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
    'payerId.pverify': 'pVerify 00192 = "United Healthcare" (Medical, Eligibility=Yes); pVerify also lists a distinct "United Healthcare - Optum Behavioral Solutions" UHG007.',
    'payerId.availity': 'Availity 87726 = UNITEDHEALTHCARE appears in the stale 2012 snapshot and matches the current national UHC ID — inferred pending a current export.',
    'payerId.changeHealthcare': 'Change Healthcare/Optum lists 87726 = "UnitedHealthcare" (supports 270/271); corroborated by the UHC affiliates EDI payer list.',
    'bhCarveOut.abaRidesOn': 'ABA administered through Optum Behavioral Health (Provider Express, two-step auth) but claims ride the medical 87726 payer ID — no second EDI hop. Confirm the Optum credentialing path via Provider Express.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for 87726.',
  },
  sources: [OPTUM_SCC, OPTUM_ABA_STATE_MANDATES, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

function uhcVaCommercialEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum two-step authorization on Provider Express (assessment first, then treatment) under the Supplemental Clinical Criteria; continued-service reviews every 4–6 months. For fully-insured VA plans, Optum adopts the Va. statutory ASD / medical-necessity definitions (ABA State Mandates, eff. 7/2022); self-funded ERISA plans are mandate-exempt.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Provider Express / Optum provider services and a live benefits check (plan funding type first) — the Supplemental Clinical Criteria carries no CPT-level unit caps, POS codes, or telehealth modifiers. Commercial ABA rates are contract-specific (out of Layer 4 scope).',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [OPTUM_SCC, OPTUM_ABA_STATE_MANDATES],
  };
}

const uhcVaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcVaCommercialEntry(),
  '97152': uhcVaCommercialEntry(),
  '97153': uhcVaCommercialEntry(),
  '97154': uhcVaCommercialEntry(),
  '97155': uhcVaCommercialEntry(),
  '97156': uhcVaCommercialEntry(),
  '97157': uhcVaCommercialEntry(),
  '97158': uhcVaCommercialEntry(),
  '0362T': uhcVaCommercialEntry(),
  '0373T': uhcVaCommercialEntry(),
};

/* ==================== Layer 7 — contact & channel layer ====================
   scriptedQuestions are generated (not scraped): each list targets only what
   THIS guide's own edi/codeGrid/rates layers ship unverified/plan-dependent,
   phrased the way an intake coordinator would ask them on a live call. */

const virginiaMedicaidContact: VobContact = {
  providerServicesPhone: '1-800-552-8627 (in-state) or (804) 786-6273 (local/out-of-state)',
  ivrPath:
    'General DMAS provider line above is for eligibility/enrollment questions. ABA service-authorization requests and status route through Acentra Health\'s Atrezzo line, 1-888-827-2884 (1-888-VAPAUTH) — not the general DMAS number.',
  hours: 'Acentra\'s Atrezzo portal accepts SA submissions 24/7; phone-support hours for the general DMAS Provider Services line are not published in the cited source.',
  portal: { name: 'Acentra Health Atrezzo (DMAS service-authorization portal)', url: 'https://portal.kepro.com/Login/Login' },
  fax: '1-877-OKBYFAX (652-9329) — Acentra Health service-authorization fax',
  scriptedQuestions: [
    'Which Cardinal Care MCO is this member enrolled in right now? Our eligibility read can\'t reliably map that off the FFS 271.',
    'Is this member\'s ABA benefit currently running through FFS Medicaid, or have they transitioned to one of the five Cardinal Care MCOs?',
    'What places of service are approved under the current authorization — home, school, community?',
    'Can you read me the aid-category / benefit-plan code shown for this member so we can confirm plan assignment?',
  ],
  sources: [DMAS_PROVIDER_CONTACT, DMAS_SA_ACENTRA],
};

const aetnaBetterHealthVaContact: VobContact = {
  providerServicesPhone: '1-800-279-1878 (TTY: 711)',
  hours: 'Monday-Friday, 8 AM-6 PM',
  portal: { name: 'Availity', url: 'https://apps.availity.com/availity/web/public.elegant.login' },
  fax: '(833) 757-1583 — behavioral health/ABA prior-authorization fax',
  scriptedQuestions: [
    'What places of service are approved under this member\'s authorization — home, school, community, or telehealth?',
    'Does Aetna Better Health of Virginia reimburse these ABA codes at the DMAS fee-schedule rate, or is there a different contracted rate?',
  ],
  sources: [AETNA_BH_VA_CONTACT, AETNA_VA_ABA_DECK],
};

const anthemHkpContact: VobContact = {
  providerServicesPhone: '800-901-0020 (TTY/TDD: 711)',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'For codes other than 97151, 97153, 97155, and 97156, is telehealth reimbursed, or is in-person required?',
    'Does Anthem HealthKeepers Plus pay these ABA codes at the DMAS fee-schedule rate, or is there a plan-specific rate?',
  ],
  sources: [ANTHEM_VA_CONTACT, ANTHEM_VA_ABA_GRID],
};

const humanaVaContact: VobContact = {
  providerServicesPhone: '844-881-4482',
  hours: 'Monday-Friday, 7 a.m.-7 p.m. Eastern time',
  portal: { name: 'Humana provider portal', url: 'https://provider.humana.com/medicaid/virginia-medicaid' },
  scriptedQuestions: [
    'Can you confirm prior authorization is on file for 0362T before we schedule? Humana requires PA on this code even though the state baseline doesn\'t.',
    'What places of service are approved under this member\'s authorization — home, school, community, or telehealth?',
    'Does Humana Healthy Horizons pay these ABA codes at the DMAS fee-schedule rate, or is there a plan-specific rate?',
  ],
  sources: [HUMANA_VA_CONTACT, HUMANA_VA_PAL],
};

const sentaraContact: VobContact = {
  providerServicesPhone: '757-552-7174 or 1-800-648-8420 (Behavioral Health Provider Services)',
  hours: '8 a.m.-6 p.m. Monday-Friday (Medicaid line)',
  portal: { name: 'Availity', url: 'https://www.availity.com' },
  fax: '757-552-7499 (Behavioral Health)',
  scriptedQuestions: [
    'What places of service are approved under this member\'s authorization — home, school, community, or telehealth?',
    'Does Sentara Community Plan pay these ABA codes at the DMAS fee-schedule rate, or is there a plan-specific contracted rate?',
  ],
  sources: [SENTARA_VA_CONTACT, SENTARA_VA_SA_FORM],
};

const uhcCpVaContact: VobContact = {
  providerServicesPhone: '877-842-3210',
  ivrPath:
    'General UHC Provider Services line above; ABA/behavioral-health authorization and benefits are Optum-administered — ask for Optum Behavioral Health / Provider Express, or call 877-614-0484 directly.',
  portal: { name: 'Optum Provider Express', url: 'https://public.providerexpress.com/content/ope-provexpr/us/en.html' },
  scriptedQuestions: [
    'What places of service are approved under this member\'s authorization — home, school, community, or telehealth?',
    'Does UnitedHealthcare Community Plan pay these ABA codes at the DMAS fee-schedule rate, or is there a plan-specific contracted rate?',
  ],
  sources: [UHC_PROVIDER_CONTACT, UHC_VA_MANUAL, OPTUM_PROVIDER_EXPRESS_HOME],
};

const aetnaVaContact: VobContact = {
  providerServicesPhone: '1-888-632-3862 (TTY: 711) — Aetna Provider Service Center',
  ivrPath: 'Select the precertification prompt for ABA/behavioral-health authorization; the member\'s ID card may list a plan-specific number instead.',
  portal: { name: 'Availity', url: 'https://apps.availity.com/availity/web/public.elegant.login' },
  scriptedQuestions: [
    'Is this member\'s plan fully insured or self-funded (ERISA)? The Virginia ABA mandate (Va. Code § 38.2-3418.17) only applies to fully-insured plans.',
    'Are there unit caps or annual/lifetime dollar limits on ABA services under this specific plan?',
    'Which places of service are authorized — home, clinic, school, telehealth?',
    'Is telehealth (GT/95) reimbursed for ABA codes, and if so which ones?',
    'Are licensure-tier modifiers (BCBA vs RBT) required for reimbursement under this plan?',
  ],
  sources: [AETNA_PROVIDER_SERVICE_CENTER, AETNA_AVAILITY_PAGE, AETNA_CPB0554, AETNA_CPB0648],
};

const cignaVaContact: VobContact = {
  providerServicesPhone: '1-800-926-2273 — Evernorth/Cigna Behavioral Health provider services (general Cigna provider line: 1-800-88CIGNA / 882-4462)',
  portal: { name: 'CignaforHCP', url: 'https://cignaforhcp.cigna.com/app/login' },
  scriptedQuestions: [
    'Is this member\'s Cigna plan fully insured or self-funded (ASO)? Fully-insured Virginia plans aren\'t subject to EN0499 — coverage runs off the plan document and the state mandate instead.',
    'Since there\'s no published PA panel for this plan type, is prior authorization required for ABA, and through what process?',
    'What unit caps or session limits apply to 97153 and the other treatment codes under this plan?',
    'Which places of service and telehealth modifiers are covered?',
    'Are licensure-tier billing requirements (BCBA/RBT) in place under this plan?',
  ],
  sources: [CIGNA_PROVIDER_SERVICES_CONTACT, CIGNA_EN0499],
};

const uhcVaContact: VobContact = {
  providerServicesPhone: '877-842-3210',
  ivrPath: 'ABA/behavioral-health benefits and authorization are Optum-administered — ask for Optum Behavioral Health / Provider Express, or call 877-614-0484 directly.',
  portal: { name: 'Optum Provider Express', url: 'https://public.providerexpress.com/content/ope-provexpr/us/en.html' },
  scriptedQuestions: [
    'Is this member\'s plan fully insured or self-funded (ERISA)? Optum\'s ABA State Mandates criteria apply only to Virginia fully-insured HMO/insurance plans.',
    'What unit caps or session limits apply to 97153 and related treatment codes under this plan?',
    'Which places of service (home, clinic, school, telehealth) are authorized?',
    'Are licensure-tier modifiers (BCBA/RBT) required for reimbursement?',
    'How often are continued-service reviews required — every 4-6 months, or plan-specific?',
  ],
  sources: [UHC_PROVIDER_CONTACT, OPTUM_SCC, OPTUM_ABA_STATE_MANDATES, OPTUM_PROVIDER_EXPRESS_HOME],
};

/* ==================== export ==================== */

export const virginiaVob: Record<string, VobExtension> = {
  'virginia-medicaid': { edi: virginiaMedicaidEdi, codeGrid: dmasCodeGrid(), rates: virginiaMedicaidRates, vobContact: virginiaMedicaidContact, lastUpdated: ACCESS_DATE },
  'aetna-better-health-virginia': { edi: aetnaBetterHealthVaEdi, codeGrid: aetnaBetterHealthVaCodeGrid, rates: mcoRates('Aetna Better Health of Virginia'), vobContact: aetnaBetterHealthVaContact, lastUpdated: ACCESS_DATE },
  'anthem-healthkeepers-plus': { edi: anthemHkpEdi, codeGrid: anthemHkpCodeGrid, rates: mcoRates('Anthem HealthKeepers Plus'), vobContact: anthemHkpContact, lastUpdated: ACCESS_DATE },
  'humana-healthy-horizons-virginia': { edi: humanaVaEdi, codeGrid: humanaVaCodeGrid, rates: mcoRates('Humana Healthy Horizons in Virginia'), vobContact: humanaVaContact, lastUpdated: ACCESS_DATE },
  'sentara-community-plan': { edi: sentaraEdi, codeGrid: sentaraCodeGrid, rates: mcoRates('Sentara Community Plan'), vobContact: sentaraContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-virginia': { edi: uhcCpVaEdi, codeGrid: uhcCpVaCodeGrid, rates: mcoRates('UnitedHealthcare Community Plan of Virginia'), vobContact: uhcCpVaContact, lastUpdated: ACCESS_DATE },
  'aetna-virginia': { edi: aetnaVaEdi, codeGrid: aetnaVaCodeGrid, vobContact: aetnaVaContact, lastUpdated: ACCESS_DATE },
  'cigna-virginia': { edi: cignaVaEdi, codeGrid: cignaVaCodeGrid, vobContact: cignaVaContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-virginia': { edi: uhcVaEdi, codeGrid: uhcVaCodeGrid, vobContact: uhcVaContact, lastUpdated: ACCESS_DATE },
};
