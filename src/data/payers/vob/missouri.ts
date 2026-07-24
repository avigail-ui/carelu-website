/* ================================================================
   VOB ENRICHMENT — Missouri, Layers 1 (EDI routing crosswalk), 3
   (code-level coverage grid), and 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Missouri ABA (Behavior Analysis) is a fee-for-service CARVE-OUT
     under MO HealthNet: even for members enrolled in a MO HealthNet
     Managed Care plan (Healthy Blue, Home State Health, UnitedHealthcare
     Community Plan, Show Me Healthy Kids), ABA is billed to state FFS,
     never to the MCO. So there is exactly ONE Missouri Medicaid EDI
     target — MO HealthNet FFS — and no MCO VOB guides exist for MO
     (already established in missouri.ts prose). The carve-out was
     reconfirmed current this pass from two primary sources newer than
     the 7/2023 statement the corpus previously relied on: the MO
     HealthNet Managed Care Policy Statements "Effective 10/2024"
     (SFY25) and Healthy Blue's own Sep-2025 provider manual, both
     quoting the ABA-to-FFS carve-out verbatim.
   - The eMOMED (MO HealthNet) 5010 270/271 Companion Guide (Dec 2023)
     IS a fetchable static PDF. It documents that managed-care
     enrollment surfaces via EB04='MC' in Loop 2110C (with the ME
     eligibility code in EB05 / 2110C REF02 when REF01='M7') and the
     MCO's plan hotline in Loop 2120C PER04 — there is NO published
     carrier-code -> MCO-name lookup table in the guide (values resolve
     out of the MO HealthNet database / the separate Health Plan Record
     Layout Manual §C-45). The ABA FFS carve-out is a policy/routing
     fact and is NOT exposed as a discrete 271 field. medicaid271Notes
     captures this as verified, not as an unfilled gap.
   - The MO HealthNet Applied Behavioral Analysis fee schedule (an .xlsx
     on the apps.dss.mo.gov static file portal, file-stamped 2026-07-07)
     was retrieved and parsed directly this pass. All ten codes
     (97151-97158, 0362T, 0373T) are covered and priced; the per-code
     rate/tier/max-unit facts below come straight from that file and the
     Behavioral Health Services Manual §1.16 Tables 17-19. Missouri
     prices by rendering-practitioner tier via modifiers (HO = behavior
     analyst/psychologist, HN = assistant behavior analyst, HM = behavior
     technician/RBT billed by the licensed supervisor), plus U8 =
     home/other place of service and TM = telemedicine.
   - The 3 commercial guides (aetna-missouri, cigna-missouri,
     unitedhealthcare-missouri) get Layers 1 + 3 only, per the build
     spec ("Do not attempt commercial rates"). Their code grids reuse
     the same already-verified national clinical policies as the Georgia
     commercial guides (CPB 0554/0648, EN0499, Optum SCC/2022RP501A),
     which publish no coding/reimbursement mechanics — those fields ship
     'unverified' with a verifyVia, not invented. Missouri's autism
     mandate (RSMo 376.1224: the $40k/yr ABA cap through age 18, applying
     to fully-insured plans only) is noted where relevant.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, VobContact, StcMap } from './types.js';
import { aetnaFamilyStc, cignaFamilyStc, uhcFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const MO_COMPANION_GUIDE = src(
  'https://www.emomed.com/public/publicdocs/5010%20Companion%20Guide.pdf',
  'MO HealthNet EDI Companion Guide, December 2023 (005010), 33 pp — retrieved and read in full. 270/271 spec in Tables 9-10 (pp.17-19): MO HealthNet payer identity carried in Loop 2100A NM103="MO HEALTHNET", NM108="PI", NM109="431754897". Managed-care enrollment flagged by EB04="MC" (X12 "Managed Care" insurance-type code) in Loop 2110C; the ME (eligibility) code rides EB05 and 2110C REF02 (REF01="M7"); the MCO plan hotline surfaces in Loop 2120C PER04. No published carrier-code->MCO-name table (values resolve from the MO HealthNet database / the separate Health Plan Record Layout Manual §C-45). Real-time (1) or batch (99); DTP date-range spans keyed to calendar-month boundaries with day-specific eligibility supported.'
);
const MO_BHSM = src(
  'https://mydss.mo.gov/sites/mydss/files/media/file/2026/05/Behavioral%20Health%20Services%20Manual.docx',
  'MO HealthNet Behavioral Health Services Manual, §1.16 Applied Behavior Analysis Services (May 2026). Tables 17-19 give the billable modifier combinations per code (Table 18 in-person, Table 17 telehealth), documentation requirements per precert type (Table 19), POS codes (11 office / 12 home / 03 school / 99 other; U8 for POS 12 or 99), and the up-to-6-month precert period. Word tables parsed directly this pass (binary .docx not readable by plain fetch).'
);
const MO_FEE_SCHEDULE = src(
  'https://apps.dss.mo.gov/fmsfeeschedules/dlfiles/Applied%20Behavioral%20Analysis.xlsx',
  'MHD Applied Behavioral Analysis fee schedule (.xlsx on the apps.dss.mo.gov static file portal — https://apps.dss.mo.gov/fmsfeeschedules/DLFiles.aspx), file-stamped 2026-07-07. All 10 codes covered and priced per 15-min unit by tier (HO/HN/HM + U8/TM). Every TM (telemedicine) row is marked precert-NOT-required; every in-person (HO/HN/HM/U8/RHC) row precert-required. No U8 row exists for any HM/technician combination (technicians never carry U8).'
);
const MO_13CSR = src(
  'https://www.law.cornell.edu/regulations/missouri/13-CSR-70-98-030',
  '13 CSR 70-98.030 — Applied Behavior Analysis Services. Sets service-level rules: precertification required for all ABA except IEP school-based ABA; auth period not to exceed 180 days; services without precert not reimbursable (except retroactive eligibility). No per-code dollar/unit tables (defers to the fee schedule).'
);
const MO_MC_POLICY = src(
  'https://mydss.mo.gov/sites/mydss/files/media/pdf/2024/10/mo-healthnet-managed-care-policy-statements_SFY25-10-2024.pdf',
  'MO HealthNet Managed Care Policy Statements, "Effective 10/2024" (SFY25), 119 pp — supersedes the 7/2023 statement the corpus previously cited (staleRisk downgraded to low). Behavioral Health FFS Coordination section states verbatim that MO HealthNet Managed Care health plans are "not required to provide … Applied Behavior Analysis (ABA) services" and that FFS provides them for MO HealthNet-enrolled providers.'
);
const HEALTHY_BLUE_MANUAL = src(
  'https://provider.healthybluemo.com/docs/gpp/MO_CAID_HealthNetManagedCareProviderManual.pdf',
  'Healthy Blue MO HealthNet Managed Care Provider Manual (Sep 2025) — independently confirms the carve-out verbatim: "Applied Behavior Analysis (ABA) services for children with Autism Spectrum Disorder will be reimbursed by the state agency on a fee-for-service basis according to the terms and conditions of the MO HealthNet program."'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026. These are pVerify internal payer codes, not X12 CPIDs. Row-level extraction: 00146=Missouri Medicaid, 00001=Aetna, 00004=Cigna, 00192=United Healthcare; UHG007="United Healthcare - Optum Behavioral Solutions."'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the fetchable copy carries an "As of 08/08/2012" footer on every page (same staleness finding already applied to aetna-florida and the Georgia guides). Row-level extraction confirms 60054=AETNA, 62308=CIGNA, 87726=UNITEDHEALTHCARE in that 2012 snapshot; NO Missouri Medicaid row appears in the file.',
  true
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025, PCOMM-2025-225) — states verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical (no separate Evernorth EDI hop). Consistent with the Georgia and Texas builds.'
);
const OPTUM_EDI_PAGE = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/admin-resources/claim-tips/electronic-claim-submission-and-electronic-data-interchange.html',
  'Optum Provider Express EDI page — states verbatim "The Optum payer ID is 87726," confirming UnitedHealthcare / Optum / United Behavioral Health claims (ABA included) route on 87726, no second EDI hop. Consistent with the Florida and North Carolina builds.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — a medical-necessity policy; contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers, and (per this corpus\'s cigna-texas QA re-verification) no per-code prior-authorization distinction either.'
);
const AETNA_CPB0554 = src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis; medical-necessity policy only, no coding/reimbursement mechanics.');
const AETNA_CPB0648 = src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders; 97151-97158 covered when selection criteria are met, no unit caps/POS/telehealth/modifier detail. No separate Aetna ABA billing/reimbursement policy located.');
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy; contains zero CPT codes (ICD-10 F84.0 only). Points to the separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not MO-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier. Applied to the MO commercial guide as 'inferred' absent a confirmed MO-specific override."
);
const OPTUM_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum ABA State Mandates supplemental clinical criteria (BH 803ABA STM1 2026) — confirmed (per missouri.ts prose) to contain NO Missouri entry; Missouri commercial members run on Optum\'s standard national criteria.'
);
const RSMO_376_1224 = src(
  'https://revisor.mo.gov/main/OneSection.aspx?section=376.1224',
  'RSMo § 376.1224 — Missouri autism mandate: $40,000/yr ABA cap through age 18 (statutory base, CPI-indexed, exceedable with plan approval), 6-month review cadence, Chapter 337-licensed supervision. Applies to fully-insured plans only; self-funded private ERISA plans are federally preempted.'
);

/* -------------------- Layer 7 sources (vobContact) -------------------- */

const MYDSS_HOT_TIP = src(
  'https://mydss.mo.gov/mhd/hot-tips/updated-precertification-forms-bh-services-and-aba',
  "MO HealthNet 'Updated Precertification Forms for BH Services and ABA' hot-tip page — states verbatim providers can \"either print and wet-sign or insert their e-signature before faxing to the Behavioral Health Services Help Desk at (573) 635-6516,\" confirming the fax number already carried in this file's ABA precert prose. Forms live on the MO HealthNet Provider Forms page; refers out to the Behavioral Health Services Provider Manual for full process."
);
const MYDSS_BH_SERVICES_PAGE = src(
  'https://mydss.mo.gov/mhd/behavioral-health-services',
  'MO HealthNet Behavioral Health Services landing page — lists MHD.BehavioralHealth@dss.mo.gov for BH Services questions, TDD/TTY 800-735-2966 (Relay Missouri 711), and names/links the two provider portals: eMOMED (https://www.emomed.com/portal/wps/portal/eMOMED/login) and CyberAccess (https://www.cyberaccessonline.net/CyberAccess/Login.aspx). References the Applied Behavior Analysis Request for Precertification form (2575-045); no dedicated ABA phone/fax beyond the BH Services Help Desk fax already cited.'
);
const AETNA_QUICK_REF_GUIDE = src(
  'https://health.maryland.gov/pophealth/Documents/Local%20Health%20Department%20Billing%20Manual/PDF%20Manual/Section%20VI/Aetna%20Quick%20Reference%20Guide%20May%202020.pdf',
  "Aetna 'At a glance' quick reference guide for health care professionals (form 83.03.830.1 L, 5/20), reproduced on a Maryland state health department billing-manual page — Missouri is listed under the guide's 'Mid-America region.' Contact Us table (p.10) + Provider Service Center section (p.11): Provider Service Center 1-800-624-0756 (HMO-based & all Aetna Medicare Advantage plans) or 1-888-632-3862 / 1-888-MD-AETNA (all other plans); self-service phone options include verifying patient coverage/benefits and getting medical precertification information. The same Contact Us table lists 'Behavioral health and substance use disorders — Provider services: Refer to the member ID card' — no single published BH/ABA line. Portal: Availity.com (Availity.com/aetnaproviders); registration/login help 1-800-AVAILITY (1-800-282-4548), Mon-Fri 8 AM-7 PM ET.",
  true
);
const OPTUM_CONTACT_US = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/contact-us.html',
  "Optum Provider Express 'Contact Us' page — Provider Services 1-877-614-0484 (Mon-Fri 7 AM-7 PM CT) covers credentialing/recredentialing, contracting/fee schedules, network status, and provider demographic changes; it does NOT cover member eligibility/benefits. The page directs member-specific eligibility, benefits, and authorization inquiries to \"the number on the back of the member's ID card\" — no separate universal ABA/behavioral-benefits line is published. Names the 'Provider Express secure portal' as the provider website."
);

/* ==================== missouri-medicaid (Layers 1 + 3 + 4) ==================== */

const missouriMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00146', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    // ABA is not delegated to a third-party BH administrator; it is a
    // fee-for-service carve-out from managed care, billed to MO HealthNet
    // directly. No second EDI hop; claims ride MO HealthNet FFS.
    administrator: 'none (ABA is a MO HealthNet FFS carve-out from managed care — billed to the state, never to the MCO)',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "Loop 2110C EB segment: EB04='MC' (X12 Managed Care code) flags managed-care enrollment; the ME (eligibility) code rides EB05, and 2110C REF02 when REF01='M7'. The MCO's plan hotline surfaces in Loop 2120C PER04. The ABA FFS carve-out is NOT exposed as a discrete 271 field — it must be inferred from the coverage category, not read off the wire.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      'Real-time (1) or batch (99); DTP date-range spans keyed to calendar-month boundaries, with day-specific eligibility also supported. Monthly ME-segment coverage is the default granularity.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      'No Missouri Medicaid row appears in the fetched Availity payer list (which carries an "As of 08/08/2012" footer) — confirm the current Availity payer ID directly with Availity onboarding. MO HealthNet\'s own in-transaction identifier is NM109="431754897" per the eMOMED companion guide, but that is the payer ID inside the X12, not a clearinghouse routing CPID.',
    'payerId.changeHealthcare':
      'Change Healthcare\'s medical payer list is login-gated; no primary source retrieved this pass. Confirm the Change Healthcare CPID via authenticated clearinghouse enrollment.',
    'medicaid271Notes.mcoCarrierCodes':
      'No carrier-code->MCO-name table is published in the eMOMED companion guide; plan-code values resolve from the MO HealthNet database / the Health Plan Record Layout Manual §C-45. Obtain that manual for the plan-code definitions if a named-MCO map is required.',
  },
  sources: [MO_COMPANION_GUIDE, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, MO_MC_POLICY, HEALTHY_BLUE_MANUAL],
};

/* Layer 3 — MO HealthNet code grid. All 10 codes covered; billable
   tiers and daily-unit maxima differ per code (from the fee schedule +
   BHSM Tables 17-18). */

const MO_POS = ['11 = office', '12 = home (U8 modifier required)', '03 = school', '99 = other (U8 modifier required)', 'telehealth (TM modifier)'];
const MO_TELEHEALTH =
  "Yes — TM modifier. The ABA fee schedule marks every TM (telemedicine) row as NOT requiring precertification, unlike in-person rows. Delivered only by the tiers each code allows (LaBAs and technicians are limited per the manual).";

function moMedicaidEntry(unitCap: number, tierNote: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — precertification via the faxed ABA precertification request form (form 2575-045 per missouri.ts prose) to the MHD Behavioral Health Services help desk, (573) 635-6516; the sole exception is school-based ABA delivered under an IEP. Precertified for up to 6 months. Telehealth (TM) rows are marked no-precert on the fee schedule.',
    unitCap: `${unitCap} units/day`,
    capPeriod: 'day',
    posAllowed: MO_POS,
    telehealth: MO_TELEHEALTH,
    modifiers,
    notes: tierNote,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MO_FEE_SCHEDULE, MO_BHSM, MO_13CSR],
  };
}

const missouriMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': moMedicaidEntry(32, 'Behavior-identification assessment — behavior analyst / psychologist tier only (HO); no HN or HM tier. In-home via U8; telehealth via TM.', ['HO', 'U8 (in-home)', 'TM (telehealth)']),
  '97152': moMedicaidEntry(16, 'Supporting assessment (one technician) — HO, HN, or HM (RBT billed by the supervisor, HO+HM or HN+HM). In-home HO/HN via U8; technician rows never carry U8.', ['HO', 'HN', 'HM (RBT, billed by supervisor)', 'U8 (HO/HN in-home)', 'TM']),
  '97153': moMedicaidEntry(32, 'Direct treatment by protocol — HO $20.13 / HN $20.13 / HM $16.37 (RBT billed by supervisor). 32 units = 8 hrs/day. In-home HO/HN via U8; technician rows never carry U8.', ['HO', 'HN', 'HM (RBT, billed by supervisor)', 'U8 (HO/HN in-home)', 'TM']),
  '97154': moMedicaidEntry(8, 'Group treatment by protocol — billable ONLY as a technician service, HM combined with the supervisor tier (HO+HM or HN+HM); no standalone HO/HN, U8, or RHC pricing. Rate $2.05, effective 5/1/2025.', ['HM (RBT, billed by supervisor)', 'TM']),
  '97155': moMedicaidEntry(24, 'Treatment with protocol modification — HO $25.26 (in-home $27.46 with U8) / HN $17.73 (no in-home bump). Behavior analyst / assistant tiers only; no technician tier.', ['HO', 'HN', 'U8 (HO in-home, higher rate)', 'TM']),
  '97156': moMedicaidEntry(16, 'Family treatment guidance — HO $25.26 / HN $20.13 (HN raised eff 7/1/2024). Behavior analyst / assistant tiers; no technician tier.', ['HO', 'HN', 'U8 (HO/HN in-home)', 'TM']),
  '97157': moMedicaidEntry(8, 'Multiple-family group treatment guidance — HO $3.16 / HN $2.52 (effective 12/18/2025). Behavior analyst / assistant tiers; no technician tier.', ['HO', 'HN', 'U8 (HO/HN in-home)', 'TM']),
  '97158': moMedicaidEntry(6, 'Group treatment with protocol modification — HO $3.16 / HN $2.14. Behavior analyst / assistant tiers; no technician tier and (per the fee file) no U8 in-home row.', ['HO', 'HN', 'TM']),
  '0362T': moMedicaidEntry(16, 'Supporting assessment, two or more technicians — behavior analyst / psychologist tier only (HO); in-home $27.46 with U8.', ['HO', 'U8 (in-home, higher rate)', 'TM']),
  '0373T': moMedicaidEntry(32, 'Treatment with protocol modification, two or more technicians — behavior analyst / psychologist tier only (HO); in-home $27.46 with U8.', ['HO', 'U8 (in-home, higher rate)', 'TM']),
};

/* Layer 4 — MO HealthNet ABA rate table (fee schedule dated 2026-07-07). */

const MO_MEDICAID_RATES: RateTable = {
  source: 'MHD Applied Behavioral Analysis fee schedule (.xlsx, apps.dss.mo.gov static portal), file-stamped 2026-07-07; cross-confirmed against the Behavioral Health Services Manual §1.16. Per 15-min unit; TM (telemedicine) rows precert-not-required.',
  effectiveDate: '2026-07-07 (file stamp; per-code rate-effective dates vary — noted per code)',
  byCode: {
    '97151': { rate: 'Modifier-tiered — see modifierTiers (max 32 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', 'U8+HO': '$25.26 (in-home)', 'TM+HO': '$25.26 (telehealth, no precert)' } },
    '97152': { rate: 'Modifier-tiered — see modifierTiers (max 16 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', HN: '$17.12 (assistant BA)', HM: '$15.00 (RBT, billed by supervisor)' } },
    '97153': { rate: 'Modifier-tiered — see modifierTiers (max 32 units/day = 8 hrs; HO/HN/HM rates eff 7/1/2024)', unit: '15min', modifierTiers: { HO: '$20.13 (behavior analyst/psychologist)', HN: '$20.13 (assistant BA)', HM: '$16.37 (RBT, billed by supervisor; raised from $17.73 base eff 7/1/2024)' } },
    '97154': { rate: '$2.05 per 15-min unit — technician service only, HM + supervisor tier (HO+HM or HN+HM); no standalone HO/HN pricing (max 8 units/day; eff 5/1/2025)', unit: '15min', modifierTiers: { 'HM (billed by HO or HN)': '$2.05' } },
    '97155': { rate: 'Modifier-tiered — see modifierTiers (max 24 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', 'U8+HO': '$27.46 (in-home, HO only)', HN: '$17.73 (assistant BA; no in-home bump)' } },
    '97156': { rate: 'Modifier-tiered — see modifierTiers (max 16 units/day; HN eff 7/1/2024)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', HN: '$20.13 (assistant BA)' } },
    '97157': { rate: 'Modifier-tiered — see modifierTiers (max 8 units/day; eff 12/18/2025)', unit: '15min', modifierTiers: { HO: '$3.16 (behavior analyst/psychologist)', HN: '$2.52 (assistant BA)' } },
    '97158': { rate: 'Modifier-tiered — see modifierTiers (max 6 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$3.16 (behavior analyst/psychologist)', HN: '$2.14 (assistant BA)' } },
    '0362T': { rate: 'Modifier-tiered — see modifierTiers (max 16 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', 'U8+HO': '$27.46 (in-home)' } },
    '0373T': { rate: 'Modifier-tiered — see modifierTiers (max 32 units/day; eff 7/1/2022)', unit: '15min', modifierTiers: { HO: '$25.26 (behavior analyst/psychologist)', 'U8+HO': '$27.46 (in-home)' } },
  },
  sources: [MO_FEE_SCHEDULE, MO_BHSM],
};

/* Layer 2 — MO HealthNet STC interpretation map. The eMOMED 5010 270/271
   Companion Guide (Dec 2023, MO_COMPANION_GUIDE above) was fetched and read
   in full for this build's EDI-routing work — its Tables 9-10 document loop/
   segment mechanics (managed-care flags, eligibility date spans) but contain
   no service-type-code support table (which STCs MO HealthNet actually
   populates with financial detail on the wire). No separate MO HealthNet
   270/271 STC/benefit-response reference was located either. Per
   docs/vob-build.md's "never guess" rule this ships fully 'unverified'
   rather than assumed from another state's Medicaid pattern (same treatment
   as georgia-medicaid's gaUnverifiedStc). */

const missouriMedicaidStc: StcMap = {
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
    abaBenefitBucket:
      'The eMOMED 5010 270/271 Companion Guide (Dec 2023) documents managed-care/eligibility loop-segment mechanics but publishes no service-type-code support table, so which STC bucket carries ABA cost-share detail (and whether MO HealthNet populates financial detail on the 271 at all) is unconfirmed. Confirm via the MHD Behavioral Health Services Help Desk, fax (573) 635-6516, or the eMOMED provider portal.',
    deductibleAppliesToAba: 'Same gap as abaBenefitBucket — MO HealthNet has no member cost-sharing structure documented in this corpus\'s cited sources; confirm via MHD Behavioral Health Services or eMOMED.',
    costShareType: 'Same gap as abaBenefitBucket.',
    copayUnit: 'Same gap as abaBenefitBucket.',
    oopMaxApplies: 'Same gap as abaBenefitBucket.',
    quality271Score: 'Same gap as abaBenefitBucket.',
  },
  sources: [MO_COMPANION_GUIDE],
};

/* Layer 7 — MO HealthNet contact & channel layer. Mined from this file's own
   sourcing plus two mydss.mo.gov pages fetched this pass: no general MHD
   provider-services phone number was found anywhere (only a fax, an email
   alias, and a TDD/TTY relay line), so providerServicesPhone ships omitted
   rather than guessed. */

const missouriMedicaidContact: VobContact = {
  fax: '(573) 635-6516 — MHD Behavioral Health Services Help Desk; fax (or e-signed fax) the Applied Behavior Analysis Request for Precertification form (2575-045) here.',
  portal: { name: 'eMOMED (MO HealthNet Provider Portal)', url: 'https://www.emomed.com' },
  scriptedQuestions: [
    "Can you confirm this member's current MO HealthNet eligibility span and that ABA benefits bill fee-for-service regardless of any managed-care plan (Healthy Blue, Home State Health, UnitedHealthcare Community Plan, Show Me Healthy Kids) shown on the 271?",
    'Is there an active ABA precertification on file for this member, and if so, what is the expiration date (precerts run up to 6 months)?',
  ],
  sources: [MO_BHSM, MYDSS_HOT_TIP, MYDSS_BH_SERVICES_PAGE],
};

/* ==================== commercial guides (Layers 1 + 3 only) ==================== */
/* Same national carriers as the Georgia commercial guides; national
   clinical policies publish no coding/reimbursement mechanics, so those
   fields ship 'unverified' with a verifyVia. Missouri's $40k/yr ABA
   mandate cap (RSMo 376.1224, fully-insured plans only) is noted. */

const MO_MANDATE_NOTE =
  "Missouri mandate (RSMo 376.1224): fully-insured plans carry a $40,000/calendar-year ABA cap through age 18 (CPI-indexed statutory base, exceedable with plan approval); self-funded private ERISA plans are exempt. The cap is a benefit-design fact, not a per-code rule — verify plan funding type and the current adjusted cap on the live 271/benefits check.";

/* ---- aetna-missouri ---- */

const aetnaMissouriEdi: EdiRouting = {
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
      '60054 is Aetna\'s long-standing national payer ID, confirmed present in the fetched Availity list — but that list carries an "As of 08/08/2012" footer, so this ships \'inferred\' pending reconfirmation against a current export (same treatment as aetna-florida / aetna-georgia).',
    'payerId.changeHealthcare': 'Change Healthcare CPID not retrievable this pass (login-gated) — confirm via authenticated clearinghouse enrollment.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'No primary source names a separate Aetna BH/ABA claims administrator or payer ID; Aetna behavioral health is generally administered in-house on the national commercial payer ID (60054), but this was not confirmed to a primary source this pass. Confirm via Aetna provider services / the ABA precertification process.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

function aetnaMoEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (specific form number not confirmed in either cited CPB)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: `Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located. ${MO_MANDATE_NOTE}`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AETNA_CPB0554, AETNA_CPB0648, RSMO_376_1224],
  };
}

const aetnaMissouriCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaMoEntry(),
  '97152': aetnaMoEntry(),
  '97153': aetnaMoEntry(),
  '97154': aetnaMoEntry(),
  '97155': aetnaMoEntry(),
  '97156': aetnaMoEntry(),
  '97157': aetnaMoEntry(),
  '97158': aetnaMoEntry(),
  '0362T': aetnaMoEntry(),
  '0373T': aetnaMoEntry(),
};

/* Layer 7 — Aetna contact & channel layer. Source is Aetna's own quick
   reference guide (May 2020, staleRisk — reconfirm before relying on the
   numbers), which places Missouri in its 'Mid-America region' and states
   plainly that behavioral-health provider services has no universal line
   ("refer to the member ID card"); the numbers below are the general
   medical Provider Service Center, which the guide's own self-service list
   ties to precertification and benefits verification. */

const aetnaMissouriContact: VobContact = {
  providerServicesPhone:
    "1-800-624-0756 (HMO-based & Aetna Medicare Advantage plans) or 1-888-632-3862 / 1-888-MD-AETNA (all other plans) — Aetna Provider Service Center; self-service options include verifying patient coverage/benefits and getting medical precertification information. Behavioral-health-specific provider services routes to the number on the member's ID card — no separate universal BH/ABA line is published.",
  portal: { name: 'Availity (Aetna Payer Space)', url: 'https://www.availity.com/aetnaproviders' },
  scriptedQuestions: [
    "Is ABA billed on Aetna's standard medical payer ID, or does a separate behavioral-health administrator/payer ID handle ABA claims for this member's plan?",
    'Does this group support real-time (vs. batch) 270/271 eligibility responses?',
    'What is the ABA precertification process and form for this plan, and what are the daily/session unit caps per code (97151-97158, 0362T, 0373T)?',
    "Which places of service (home, school, clinic, telehealth) are approved for this member's ABA benefit, and what billing modifiers are required for out-of-clinic delivery?",
    'Is this a fully-insured Missouri plan subject to the RSMo 376.1224 $40,000/year ABA cap, or a self-funded ERISA plan exempt from the state mandate — and if capped, what is the current adjusted annual maximum?',
  ],
  sources: [AETNA_QUICK_REF_GUIDE],
};

/* ---- cigna-missouri ---- */

const cignaMissouriEdi: EdiRouting = {
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

function cignaMoEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'unverified — EN0499 (re-verified for this corpus, per the cigna-texas QA pass) contains no per-code prior-authorization content; confirm the assessment-vs-treatment PA split with Cigna/Evernorth provider services',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: `Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement/PA mechanics are published in it. ${MO_MANDATE_NOTE}`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CIGNA_EN0499, RSMO_376_1224],
  };
}

const cignaMissouriCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaMoEntry(),
  '97152': cignaMoEntry(),
  '97153': cignaMoEntry(),
  '97154': cignaMoEntry(),
  '97155': cignaMoEntry(),
  '97156': cignaMoEntry(),
  '97157': cignaMoEntry(),
  '97158': cignaMoEntry(),
  '0362T': cignaMoEntry(),
  '0373T': cignaMoEntry(),
};

/* Layer 7 — Cigna/Evernorth contact & channel layer. Mined from the same
   Autism Resource Guide (March 2025) already cited for this guide's EDI
   sourcing — its 'Contacting us' section (p.3, p.7-9) names two dedicated
   lines and the provider portal in full. */

const cignaMissouriContact: VobContact = {
  providerServicesPhone:
    '877-279-7603 (Evernorth Autism Care Coordinator team — nonclinical; patient benefits/eligibility, authorization info, and ABA-specific questions) or 800-926-2273 (Evernorth Provider Services — billing, benefits, and eligibility for autism-related treatment)',
  hours: 'Autism Care Coordinator team: Mon-Fri 8:30 AM-5:00 PM CT. Provider Services: Mon-Fri 7:00 AM-7:00 PM CT.',
  portal: {
    name: 'Evernorth provider website — Procedure Code Benefit Tool (real-time eligibility/benefit check) and Coverage Confirmation Grid (secure-email benefit verification, 1-business-day turnaround)',
    url: 'https://provider.evernorth.com',
  },
  scriptedQuestions: [
    'Does this plan require prior authorization for ABA treatment codes (97153-97158), or only for the initial assessment codes (97151/97152/0362T)?',
    'What are the daily/session unit caps for ABA treatment codes under this specific plan?',
    'Which places of service (home, school, clinic, telehealth) are approved for this member\'s ABA benefit, and are modifiers required for services delivered outside the clinic?',
    'Is this a fully-insured Missouri plan subject to the RSMo 376.1224 $40,000/year ABA cap, or a self-funded ERISA plan exempt from the state mandate — and if capped, what is the current adjusted annual maximum?',
    'Does this payer ID support real-time (vs. batch) 270/271 eligibility responses for this group?',
  ],
  sources: [CIGNA_AUTISM_RESOURCE_GUIDE],
};

/* ---- unitedhealthcare-missouri ---- */

const uhcMissouriEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
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
    'payerId.availity':
      '87726 confirmed as the Optum/UHC claims payer ID directly from Optum Provider Express\'s EDI page (verified); the Availity-list occurrence is from the stale 2012 export, so this field ships \'inferred\' on the Availity source specifically. pVerify separately lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" code — 87726 is the correct single-hop ID for ABA per Optum\'s own page.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_EDI_PAGE],
};

function uhcMoEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum ABA prior authorization via Provider Express (specific process/review cadence not confirmed in the cited sources)',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes: `Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the ABA Supplemental Clinical Criteria contains no CPT codes; applied here absent a confirmed MO-specific override, and (per missouri.ts prose) Optum's ABA State Mandates supplement has no Missouri entry, so MO commercial members run on the standard national criteria. Verify via: Provider Express / UHC provider services. ${MO_MANDATE_NOTE}`,
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES, RSMO_376_1224],
  };
}

const uhcMissouriCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcMoEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcMoEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcMoEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcMoEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcMoEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcMoEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcMoEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcMoEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcMoEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcMoEntry('32 units/day (≤8 hrs)', []),
};

/* Layer 7 — Optum/UHC contact & channel layer. Provider Express's own
   Contact Us page draws a hard line this file preserves: the published
   Provider Services number is for credentialing/contracting/network, NOT
   member eligibility or ABA authorization — those calls route to the
   number on the member's ID card, which is why no single ABA benefits
   line is claimed here. */

const uhcMissouriContact: VobContact = {
  providerServicesPhone:
    "1-877-614-0484 (Optum Provider Express Provider Services, Mon-Fri 7 AM-7 PM CT — credentialing/recredentialing, contracting/fee schedules, network status, provider demographic changes; NOT member eligibility). Member-specific eligibility/benefits/ABA-authorization calls route to the number on the back of the member's ID card — Optum publishes no separate universal ABA benefits line.",
  hours: '1-877-614-0484 line: Mon-Fri 7 AM-7 PM CT.',
  portal: { name: 'Provider Express secure portal', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    "Which places of service (home, school, clinic, telehealth) are approved for this member's ABA benefit, and are billing modifiers required for out-of-clinic delivery?",
    'Does telehealth apply to any ABA codes for this specific plan, and if so, is a GT/95 modifier required?',
    'What is the Optum ABA prior-authorization process and review cadence for this member (submission via Provider Express, turnaround time, re-authorization period)?',
    "Can you confirm the daily/session unit caps per ABA code for this member's specific plan? (Our defaults come from Optum's national ABA reimbursement policy, not a Missouri-specific document.)",
    'Does this payer ID support real-time (vs. batch) 270/271 eligibility responses for this group?',
    'Is this a fully-insured Missouri plan subject to the RSMo 376.1224 $40,000/year ABA cap, or self-funded/ERISA-exempt?',
  ],
  sources: [OPTUM_CONTACT_US],
};

/* ==================== export ==================== */

export const missouriVob: Record<string, VobExtension> = {
  'missouri-medicaid': {
    edi: missouriMedicaidEdi,
    codeGrid: missouriMedicaidCodeGrid,
    stcMap: missouriMedicaidStc,
    rates: MO_MEDICAID_RATES,
    vobContact: missouriMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-missouri': {
    edi: aetnaMissouriEdi,
    codeGrid: aetnaMissouriCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Missouri-specific 270/271 STC document found.'),
    vobContact: aetnaMissouriContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-missouri': {
    edi: cignaMissouriEdi,
    codeGrid: cignaMissouriCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Missouri-specific override found.'),
    vobContact: cignaMissouriContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-missouri': {
    edi: uhcMissouriEdi,
    codeGrid: uhcMissouriCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Missouri-specific override found.'),
    vobContact: uhcMissouriContact,
    lastUpdated: ACCESS_DATE,
  },
};
