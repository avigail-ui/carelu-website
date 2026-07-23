/* ================================================================
   VOB ENRICHMENT — Utah, Layers 1 (EDI routing crosswalk),
   3 (code-level coverage grid) + 4 (Medicaid rate table).
   See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Utah ABA is the state-plan Autism Spectrum Disorder (ASD)
     benefit and is a FEE-FOR-SERVICE CARVE-OUT: the four physical-
     health ACOs (Health Choice Utah, Healthy U, Molina, SelectHealth
     Community Care) never administer ABA — diagnosis documentation,
     prior authorization, and claims all go directly to Utah Medicaid
     (PRISM), whatever card the family carries. UnitedHealthcare holds
     NO Utah Medicaid ACO contract; United Behavioral Health (Optum)
     appears only as a Prepaid Mental Health Plan (PMHP) contractor,
     and PMHPs cover MH/SUD only — ABA is carved out to state FFS.
     bhCarveOut is therefore 'none' on the Medicaid guide (ABA rides
     the medical FFS claim, no second hop), and an ACO/PMHP showing on
     the 271 does NOT redirect ABA. (Verified: Utah Medicaid ASD
     provider manual + family FAQ; already-verified corpus prose in
     src/data/payers/utah.ts.)
   - Utah is one of the most intake-friendly Medicaid programs:
     NO PA on 97151 (behavior-identification assessment — 1 per
     26 weeks, up to 24 units); treatment codes need PA in 26-week
     periods via PRISM with a 10-BUSINESS-DAY grace to submit after
     starting services; coverage runs 'regardless of age' (PRISM
     shows ages 1+, adult plans included).
   - KNOWN OBSTACLE: Utah's ASD provider manual + family FAQ PDFs
     returned unreadable binary to previous fetchers. Rate/cap/PA
     facts are carried from the already-verified corpus prose (itself
     built from the PRISM Coverage/Reimbursement lookup, the archived
     ASD manual, and SPA UT-25-0007) and each source is cited with a
     retrieval note. The Utah Medicaid 270/271 companion guide
     (PRISM / fiscal agent) could not be retrieved this pass, so
     medicaid271Notes ships 'unverified' per the "never guess" rule.
   - The three commercial guides (aetna/cigna/unitedhealthcare-utah)
     run on the SAME national clinical policies as every other state
     (Aetna CPB 0554/0648; Evernorth/Cigna EN0499; Optum SCC +
     national ABA Reimbursement Policy). Their EDI IDs are national,
     not Utah-specific; their codeGrid mechanics come from those
     national policies with the same gaps flagged in georgia.ts. What
     is Utah-specific for commercial members is the Utah Code
     31A-22-642 mandate layer (individual + large group only — NOT
     small group), which lives in the prose guide, not in these VOB
     layers.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, March 2026 — fetched and parsed this pass. Row-level extraction: "01324 MEDICAID UTAH" (Eligibility: Yes, Claim Status: No); "00001 Aetna", "00004 Cigna", "00192 United Healthcare", "UHG007 United Healthcare - Optum Behavioral Solutions" (all Elig/Claim: Yes).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — fetched and parsed this pass; the copy itself carries an "As of 08/08/2012" footer on every page. No "MEDICAID - UT" / Utah Medicaid row exists in this 2012 snapshot (Utah Medicaid EDI predates or postdates it differently), so the Availity ID for Utah Medicaid is left unverified. Commercial rows confirmed present: "60054 AETNA", "62308 CIGNA", "87726 UNITED HEALTHCARE".',
  true
);
const UT_PRISM_COMPANION_GUIDE = src(
  'https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/EE-Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20Companion%20(270,%20271)%20SFY25.pdf',
  'Utah Medicaid 270/271 Companion Guide (SFY25, "July 2024 005010_270/271", 46pp) — fetched and text-extracted this pass. Managed-care (ACO) plan is reported by ORGANIZATION NAME (NM103) in Loop 2120C (Subscriber Benefit Related Entity Name), NM1 segment — there is NO numeric carrier-code table in the guide. Capitated/managed-care status is flagged in Loop 2110C EB01="3" (Active - Services Capitated); FFS = EB01 "1" (Active Coverage). Both real-time (<=20s) and batch supported; inquiry DTP03 accepts a single date or a date range not to exceed 3 months; benefit issuance is monthly. Utah Medicaid "does not return eligibility at the Procedure Code level" (default STC "30"), so the 271 does NOT surface that ABA specifically bills FFS — the carve-out is applied from policy, not read off the 271. Trading-partner receiver ID (ISA08): HT000004-001 = FFS (ABA), -002 = MCO, -801 = atypical providers; connectivity via UHIN (qualifier "ZZ").'
);
const UT_PRISM_FEE_CSV = src(
  'https://health.utah.gov/stplan/lookup/output_csv.php',
  'PRISM Coverage & Reimbursement fee-schedule CSV export (POST: download_type=general, pac_code=166 [Applied Behavioral Analyst], plan_type=Traditional, service_date=07/01/2026) — fetched and parsed this pass; the authoritative current source for Utah ABA rates/PA/coverage. Every ABA row shows EffectiveStartDate 07/01/2026, UpdateOn 06/12/2026. Confirmed: 97151 $37.51 (PA No), 97153 $19.67 (PA Yes), 97154 $13.91 (PA Yes), 97155 $37.51 (PA Yes, HP/HO/HN), 97156 $37.51 (PA Yes), H0032 $37.51 (PA Yes); 97157 & 97158 flagged "Covered" but priced $0.00 (last effective 7/1/2022 — non-reimbursing at present); 97152, 0362T, 0373T = Not Covered.'
);
const UT_PRISM_LOOKUP = src(
  'https://health.utah.gov/stplan/lookup/CoverageLookup.php',
  'PRISM Coverage and Reimbursement Lookup (PAC 166) — 97151 shows "Prior Authorization Required? No"; ages 1+ with adult plans included. The interactive lookup POST returns only the empty form (session/JS-gated); authoritative rate/coverage data was obtained via the fee-schedule CSV export (see UT_PRISM_FEE_CSV).'
);
const UT_ASD_MANUAL = src(
  'https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder.pdf',
  'Utah Medicaid Provider Manual — Autism Spectrum Disorder Services (updated January 2026): ABA requires PA except initial/ongoing behavior-identification assessments; treatment PA in 26-week periods via PRISM with a 10-business-day grace to submit; technicians must be fully certified before serving any member; QHP supervises >=10% of technician direct-service time (>=50% of it direct). The live PDF returned unreadable binary to previous fetchers; facts carried from the already-verified corpus prose.',
  true
);
const UT_ASD_MANUAL_ARCHIVE = src(
  'https://web.archive.org/web/20240821082018/https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf',
  'Utah Medicaid ASD Services provider manual, July 2023 edition (Wayback archive) — corroborating copy for the PA/assessment/supervision mechanics where the current PDF is unreadable.',
  true
);
const UT_SPA_25_0007 = src(
  'https://web.archive.org/web/20260217123605/https://www.medicaid.gov/medicaid/spa/downloads/UT-25-0007.pdf',
  'SPA UT-25-0007 — Utah Medicaid 4.19-B fee schedule including ASD services (Wayback archive). Corroborates the PRISM rate set.',
  true
);
const UT_MIB_JULY2026 = src(
  'https://web.archive.org/web/20260717062915/https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid+Information+Bulletins/Traditional+Medicaid+Program/2026/July2026-MIB.pdf',
  'July 2026 Medicaid Information Bulletin (Wayback archive) — item 26-83 reconfirms group codes require group-size modifiers (UN/UP/UQ/UR/US) or claims deny; item 26-61 reclassifies ABA providers as High Risk for enrollment screening (revalidation + fingerprinting phased from Sept 2026).'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025) — fetched and parsed this pass; states verbatim "Use Evernorth payer ID 62308" for ABA/autism claims submitted through Cigna\'s EDI vendors, confirming ABA rides the SAME payer ID as Cigna medical (no separate Evernorth EDI hop).'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — all 10 CPT codes medically necessary when criteria met; no PA on assessment codes 97151/97152/0362T; only Virginia is carved out (Utah fully subject); pure clinical-necessity policy, no unit caps, POS codes, or modifiers.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 (Applied Behavior Analysis) — cross-references CPB 0648 for ASD coverage; no ABA coding/reimbursement mechanics published.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 covered if selection criteria met; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given; no Utah entry.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — clinical-necessity criteria (ICD-10 F84.0 only); contains zero CPT codes; points to a separate Optum ABA Reimbursement Policy for coding detail. Utah has no entry in Optum\'s ABA State Mandates supplemental criteria (Jan 2026 edition lists 14 states, Utah not among them).'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Utah-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied to the Utah guide as 'inferred' absent a confirmed Utah-specific override."
);

/* -------------------- Utah Medicaid (ASD FFS) codeGrid -------------------- */

interface UtEntryOpts {
  covered?: string;
  paRequired: string;
  paStatus?: 'verified' | 'inferred' | 'unverified';
  unitCap: string;
  unitCapStatus?: 'verified' | 'inferred' | 'unverified';
  capPeriod: string;
  telehealth: string;
  telehealthStatus?: 'verified' | 'inferred' | 'unverified';
  modifiers: string[];
  notes: string;
  sources: SourceRef[];
}

function utEntry(o: UtEntryOpts): CodeGridEntry {
  return {
    covered: o.covered ?? 'Yes',
    paRequired: o.paRequired,
    unitCap: o.unitCap,
    capPeriod: o.capPeriod,
    posAllowed: ['home', 'clinic', 'community', 'school (school-based ABA on an IEP routes to the School-Based Skills Development benefit, not FFS)', 'telehealth (per code — see telehealth)'],
    telehealth: o.telehealth,
    modifiers: o.modifiers,
    notes: o.notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: o.paStatus ?? 'verified',
      unitCap: o.unitCapStatus ?? 'verified',
      capPeriod: o.unitCapStatus ?? 'verified',
      posAllowed: 'verified',
      telehealth: o.telehealthStatus ?? 'verified',
      modifiers: o.modifiers.length ? 'verified' : 'unverified',
    },
    sources: o.sources,
  };
}

function utNotCoveredEntry(note: string): CodeGridEntry {
  return {
    covered: 'No — Not Covered on the Utah Medicaid fee schedule (PRISM PAC 166)',
    paRequired: 'N/A',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes: note,
    fieldStatus: { covered: 'verified' },
    sources: [UT_PRISM_FEE_CSV],
  };
}

const utahMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': utEntry({
    paRequired: 'NOT required — behavior-identification assessments are exempt from PA (PRISM CSV: PA=No).',
    unitCap: '1 assessment per 26 weeks, up to 24 units; reassessment roughly every 6 months',
    capPeriod: '26 weeks',
    telehealth: 'unverified for the assessment specifically — the manual permits telehealth for supervision and parent training but excludes technician-delivered direct treatment; assessment telehealth eligibility not restated in retrievable sources.',
    telehealthStatus: 'unverified',
    modifiers: [],
    notes: 'Behavior-identification assessment (professional). Pays $37.51/15-min unit (see rates). No PA means intake can book and bill the assessment immediately with a diagnosis in hand.',
    sources: [UT_PRISM_FEE_CSV, UT_PRISM_LOOKUP, UT_ASD_MANUAL, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97153': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM; 10-business-day grace to submit after starting services.',
    unitCap: 'Up to 780 hours (3,120 units) per 26 weeks (30 hours/week)',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — technician-delivered 97153 must be in person (telehealth excluded for technician-delivered 97153/97154 and group 97158).',
    modifiers: [],
    notes: 'Technician-delivered direct treatment — the volume code. Pays $19.67/15-min unit (see rates). Overage above the max allowed units goes to secondary medical review.',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97154': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '52 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — group technician-delivered treatment must be in person.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ (per MIB item 26-83) or the claim denies'],
    notes: 'Group adaptive behavior treatment (technician-delivered). Pays $13.91/15-min unit (see rates). Group-size modifier is mandatory.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97155': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Supervision (97155 + H0032) capped at 84 combined hours (336 units) per 26 weeks; >=50% must be direct supervision; overage via secondary review',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — supervision may be delivered via synchronous two-way audio/video.',
    modifiers: ['HP (psychologist/BCBA-D)', 'HO (BCBA)', 'HN (BCaBA/analyst-in-training)'],
    notes: 'QHP protocol-modification / supervision code. Pays $37.51/15-min unit across credential tiers (single published rate; HP/HO/HN are reporting modifiers, not rate tiers — see rates). QHP must supervise >=10% of technician direct-service time, >=50% of it direct.',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97156': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Recommended minimum 3 episodes per 26 weeks (up to 4 units/episode)',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — family/parent training may be delivered via synchronous two-way audio/video.',
    modifiers: [],
    notes: 'Family adaptive-behavior guidance (parent training). Pays $37.51/15-min unit (see rates).',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97157': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '3 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — multiple-family group guidance may be delivered via synchronous two-way audio/video.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ or the claim denies'],
    notes: 'Multiple-family group guidance. Flagged "Covered" on PRISM but priced $0.00 (rate last effective 7/1/2022 — NON-REIMBURSING at present; see rates). Confirm current reimbursement before relying on this code.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97158': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '26 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — group treatment with protocol modification must be in person.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ or the claim denies'],
    notes: 'Group adaptive behavior treatment with protocol modification. Flagged "Covered" on PRISM but priced $0.00 (rate last effective 7/1/2022 — NON-REIMBURSING at present; see rates). Confirm current reimbursement before relying on this code.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  'H0032': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Counts toward the 84 combined supervision hours (336 units) per 26 weeks (with 97155)',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — treatment-planning/supervision activity may be delivered via synchronous two-way audio/video.',
    modifiers: [],
    notes: 'MH service-plan development (indirect supervision) code used alongside 97155; shares the 84-hour supervision cap. Pays $37.51/15-min unit (see rates).',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97152': utNotCoveredEntry(
    'Behavior-identification assessment BY A TECHNICIAN — Not Covered by Utah Medicaid (only the professional 97151 assessment is billable). Verified from the PRISM PAC-166 fee-schedule export.'
  ),
  '0362T': utNotCoveredEntry(
    'Not Covered by Utah Medicaid (last coverage-relevant date 7/1/2021; a $16.41 rate is listed but the code is flagged Not Covered). Utah bills the Category-I CPT set, not the legacy Category-III codes.'
  ),
  '0373T': utNotCoveredEntry(
    'Not Covered by Utah Medicaid (last coverage-relevant date 7/1/2021; a $16.41 rate is listed but the code is flagged Not Covered).'
  ),
};

const utahMedicaidRates: RateTable = {
  source:
    'PRISM Coverage & Reimbursement fee-schedule CSV export (PAC 166, plan_type=Traditional), effective 7/1/2026 (every ABA row: EffectiveStartDate 07/01/2026, UpdateOn 06/12/2026) — fetched and parsed this pass; the authoritative current source. Single published rate per code; 97155 carries credential-reporting modifiers (HP/HO/HN) but one published rate across tiers. SPA UT-25-0007 was retrieved (Wayback) but its packet contains only the 4.19-B cover + CMS approval pages, not the ABA dollar table, so dollar confirmation is from the live PRISM export. NOTE: 97157 and 97158 are flagged "Covered" but priced $0.00 (rates last effective 7/1/2022) — non-reimbursing at present.',
  effectiveDate: '2026-07-01',
  byCode: {
    '97151': { rate: '$37.51 per 15-min unit', unit: '15min' },
    '97153': { rate: '$19.67 per 15-min unit', unit: '15min' },
    '97154': { rate: '$13.91 per 15-min unit (group, technician-delivered)', unit: '15min' },
    '97155': { rate: '$37.51 per 15-min unit (single rate across HP/HO/HN credential-reporting modifiers)', unit: '15min', modifierTiers: { HP: '$37.51 (psychologist/BCBA-D)', HO: '$37.51 (BCBA)', HN: '$37.51 (BCaBA/analyst-in-training)' } },
    '97156': { rate: '$37.51 per 15-min unit', unit: '15min' },
    '97157': { rate: '$0.00 — flagged Covered but priced $0.00 (rate last effective 7/1/2022; non-reimbursing at present)', unit: '15min' },
    '97158': { rate: '$0.00 — flagged Covered but priced $0.00 (rate last effective 7/1/2022; non-reimbursing at present)', unit: '15min' },
    'H0032': { rate: '$37.51 per 15-min unit', unit: '15min' },
  },
  sources: [UT_PRISM_FEE_CSV, UT_SPA_25_0007],
};

const utahMedicaidEdi: EdiRouting = {
  payerId: { pverify: '01324', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'none — ABA is carved out of all four ACOs and the PMHPs to state FFS; the ACO/PMHP handles only ASD-related PT/OT/ST and MH/SUD. Claims go to Utah Medicaid (PRISM) on the medical FFS line.',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation: 'Loop 2120C (Subscriber Benefit Related Entity Name), NM1 segment — the related MCO Plan is reported here by ORGANIZATION NAME (NM103), not a carrier code. Managed-care/capitated status is flagged in Loop 2110C EB01="3" (Active - Services Capitated); FFS = EB01 "1" (Active Coverage).',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Real-time (response <=20s) and batch; inquiry DTP03 accepts a single date or a date range not to exceed 3 months (up to 3 years retro); benefit issuance is monthly, out-of-pocket frequency quarterly. Utah Medicaid does NOT return eligibility at the procedure-code level (default STC "30"), so the 271 does not surface that ABA specifically bills FFS — the carve-out is applied from policy, not read off the 271.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      'pVerify lists TWO Utah Medicaid FFS entries — "00672 Utah Medicaid" (Elig: Yes, Claim: No) and "01324 MEDICAID UTAH" (Elig: Yes). 01324 is used here; confirm with pVerify which is the live real-time 270/271 payer for FFS before automating.',
    'payerId.availity':
      'No "MEDICAID - UT" / Utah Medicaid row exists in the fetched Availity list (which carries an "As of 08/08/2012" footer); the only Utah hit is an unrelated MA plan — confirm the current Availity ID via the login-gated Availity Essentials portal search.',
    'payerId.changeHealthcare':
      'No Change Healthcare-specific source was retrievable this pass — confirm via the Optum/Change Healthcare payer finder. The commonly-cited "SKUT0" is a clearinghouse-side routing alias, NOT the PRISM identifier; the companion guide\'s actual trading-partner receiver ID (ISA08) is HT000004-001 for FFS (the ABA line), via UHIN.',
    'medicaid271Notes.mcoCarrierCodes': 'By design there is NO numeric carrier-code table in the Utah 270/271 companion guide — the ACO/MCO is identified by organization name (NM103) in loop 2120C. (Utah ACOs: Health Choice Utah, Healthy U, Molina Healthcare of Utah, SelectHealth Community Care; PMHPs include United Behavioral Health.) Because ABA is a statewide FFS carve-out, an ACO/PMHP appearing on the 271 does NOT redirect ABA — all PAs go to Utah Medicaid FFS regardless.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UT_PRISM_COMPANION_GUIDE, UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
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
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located. Utah-specific layer is the Utah Code 31A-22-642 mandate (individual + large group only — NOT small group), which governs limits, not coding mechanics.',
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
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it. Utah is fully subject to EN0499 (only Virginia is carved out), so the no-assessment-PA fast path holds.',
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
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the Optum Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed Utah-specific override. Utah has no entry in Optum's ABA State Mandates supplemental criteria (Jan 2026). Verify via: Provider Express / UHC provider services.",
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

/* ==================== aetna-utah (commercial) ==================== */

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
      'Availity "60054 AETNA" is confirmed present but the fetched Availity list carries an "As of 08/08/2012" footer — inferred pending reconfirmation against a current Availity export.',
    'payerId.changeHealthcare': 'Carried from the same 2012 Availity snapshot as the medical payer ID; confirm via the Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services / ABA precertification whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Utah. Aetna holds no Utah Medicaid ACO contract, so there is no Medicaid line to confuse an Aetna card with.',
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

/* ==================== cigna-utah (commercial) ==================== */

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

/* ==================== unitedhealthcare-utah (commercial) ==================== */

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
      'Provider Express / UHC provider services — pVerify lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" alongside the "00192 United Healthcare" medical entry; not resolved whether commercial Utah ABA rides the 87726 medical ID or routes to Optum Behavioral. UHC holds no Utah Medicaid ACO contract.',
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

export const utahVob: Record<string, VobExtension> = {
  'utah-medicaid': { edi: utahMedicaidEdi, codeGrid: utahMedicaidCodeGrid, rates: utahMedicaidRates, lastUpdated: ACCESS_DATE },
  'aetna-utah': { edi: aetnaEdi, codeGrid: aetnaCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-utah': { edi: cignaEdi, codeGrid: cignaCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-utah': { edi: unitedhealthcareEdi, codeGrid: unitedhealthcareCodeGrid, lastUpdated: ACCESS_DATE },
};
