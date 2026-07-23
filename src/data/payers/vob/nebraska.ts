/* ================================================================
   VOB ENRICHMENT — Nebraska, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Provider Bulletin 25-14 and the MHSUD fee schedule are PDFs/XLSX
     that a plain WebFetch could not render this pass (returned
     "corrupted binary" every time) — they were downloaded directly
     and parsed with pdfminer.six / openpyxl instead. The resulting
     rate figures were cross-checked against TWO independent primary
     documents (the bulletin's own table AND the fee schedule's "ABA"
     tab) and match exactly, so they carry fieldStatus 'verified'
     rather than 'inferred'.
   - The SFY27 fee-schedule URL cited in src/data/payers/nebraska.ts
     ("MHSUD SFY27 Fee Schedule.xlsx") 404s as of this pass — DHHS's
     Provider Rates & Fee Schedules index page now serves it at a
     different filename, "REVISED MHSUD SFY27 Fee Schedule.xlsx".
     Both that file and the July 2025 interim schedule ("Mental
     Health and Substance July 1 2025 Updated 7.31.25.xlsx") were
     fetched directly and used here; the dead original URL is not
     cited below.
   - The fee schedule's "ABA" tab is the single richest coding-
     mechanics source found this pass: it gives, per code, a
     telehealth modifier + POS column (populated ONLY for 97151,
     97155, 97156 — blank for every other ABA code) and a per-
     provider-type rate matrix (columns 1=MD, 2=DO, 57=Provisionally
     Licensed PhD, 67=Licensed Psychologist, 83=BCBA/LBA, 84=BCaBA/
     LaBA, 85=RBT) where ineligible provider types are listed at a
     flat $0, not a lower nonzero rate. That is the primary source
     for this file's "credential differentiates who CAN bill a code,
     not what the eligible biller is PAID" framing, and it also
     independently confirms 97157, 0362T, and 0373T are simply absent
     from Nebraska's billable ABA code set (they have no row on this
     tab, no entry in Provider Bulletin 25-14, no mention on DHHS's
     "Applied Behavior Analysis Facts" page, and no entry in either
     ABA Medicaid Service Definition's own "Fee schedule codes for
     this service are" list) — treated here as a verified absence,
     not merely an unresearched gap.
   - Oddity flagged, not silently fixed: both ABA Medicaid Service
     Definitions (the treatment MSD AND the Behavior Identification
     Assessment MSD) list the IDENTICAL "Fee schedule codes for this
     service are: 97153, 97154, 97155, 97156, 97158" block verbatim —
     including in the assessment MSD, which is otherwise entirely
     about 97151/97152 and never mentions those five codes again.
     Read as a copy/paste artifact in DHHS's own PDF template, not
     evidence that assessment codes bill under those numbers.
   - The NE MMIS 270/271 Companion Guide (dhhs.ne.gov, effective date
     printed as 3/9/2015) was retrieved successfully and read in full
     — unlike Georgia's inaccessible GAMMIS guide, this one directly
     answers Layer 1's core questions. It carries staleRisk: true
     (11+ years old) for anything time-sensitive (e.g., help-desk
     phone numbers), but its 271 loop/segment content is structural
     EDI-standard mapping unlikely to have changed and is treated as
     verified. It documents NO numeric MCO carrier-code crosswalk —
     the member's MCO name is returned as free text (loop 2120C, NM1,
     entity identifier code "X3"), not a coded value — so
     mcoCarrierCodes is a verified EMPTY object, not an unresearched
     gap.
   - pVerify payer IDs below were extracted with pdfplumber's table
     parser (not the flattened text dump), because the source PDF's
     multi-column table lays out the ID/Name/Elig/Claims/ERA/LOB
     columns in separate text blocks that a naive line-order read
     cannot reliably re-associate — a raw-text WebFetch of this
     document mis-parsed or refused it entirely on every attempt this
     pass. Table-cell extraction gave clean, verifiable rows.
   - Availity's public payer list (same "As of 08/08/2012" stale
     snapshot already flagged in georgia.ts / aetna-florida) contains
     NO row at all for Nebraska Medicaid, Nebraska Total Care, Molina
     Healthcare of Nebraska, or UnitedHealthcare Community Plan of
     Nebraska — only an unrelated "Coventry Health Care - Nebraska"
     legacy line. Those four payerId.availity fields are therefore
     'unverified', not merely stale.
   - Aetna precertification form number: nebraska.ts's own prose (and
     the aetna-nebraska PayerConfig) cites "form GR-69017-4" for
     Aetna's national ABA precert. georgia.ts's independent QA
     re-check of the SAME two source CPBs (0554, 0648) found that
     form number does not actually appear in either document and
     removed it there. That correction is not repeated here — the
     aetna-nebraska codeGrid below does NOT assert the form number as
     a verified fact, flagging the cross-file tension explicitly
     instead of silently picking a side.
   - Commercial clinical/coding-mechanics facts (Aetna CPB 0554/0648,
     Cigna/Evernorth EN0499, Optum's national ABA Supplemental
     Clinical Criteria + Reimbursement Policy 2022RP501A) are NATIONAL
     policies with no Nebraska-specific overlay found in any of them
     (Optum's own ABA State Mandates supplement, BH803ABA, has no
     Nebraska entry — already noted in nebraska.ts prose). Their
     coding-mechanics content is therefore reused from the same
     documents georgia.ts already extracted, exactly as the build
     brief invited for shared national payer IDs.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, FieldStatus } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const MSD_TREATMENT = src(
  'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis.pdf',
  'NE ABA Medicaid Service Definition (treatment), eff. 2/7/2025 — direct read confirms: settings limited to community/home/office-or-clinic (school ABA routes through the 471 NAC 25 school-based-services program, not independent providers); "Direct ABA service hours...may not exceed 6 hours in a single day or a total of 20 hours per week" (verbatim); staffing ratios per code (97151 1:1 clinician, 97152 1:1 technician, 97153 1:1 technician, 97154 1 technician:2-5 children, 97155 1:1 clinician, 97156 1 clinician:1 family, 97158 1 clinician:2-5 children); "Other ABA treatment services (CPT 97153, 97154, 97158) cannot be provided via telehealth" (verbatim) — 97155/97156 telehealth allowed only under listed conditions; direct supervision by observation required for >=10% of weekly "direct service hours (97153/97154/97155)."'
);
const MSD_ASSESSMENT = src(
  'https://dhhs.ne.gov/Behavioral%20Health%20Service%20Definitions/Applied%20Behavior%20Analysis%20Behavior%20Identification%20Assessment.pdf',
  'NE ABA Behavior Identification Assessment MSD, eff. 2/7/2025 — direct read confirms: 97151 (licensed clinician) "may be completed via audiovisual telehealth if" a listed set of caregiver/environment/documentation conditions hold; 97152 (technician) "cannot be completed via telehealth" (verbatim). Its own "Fee schedule codes for this service are" list oddly repeats 97153-97158 verbatim from the treatment MSD template rather than listing 97151/97152 — treated as a document artifact, not a billing fact (see file header).'
);
const PB_25_02 = src(
  'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-02.pdf',
  'Provider Bulletin 25-02 (Jan 31, 2025; eff. 2/7/2025), "Hours of Service" section — direct read: describes the finalized rule itself as "6 hours of direct patient assessment and treatment per day, up to a total 20-30 hours per week" and "Up to 30 hours per week...was considered a fair balance," i.e., this bulletin\'s OWN text differs from the treatment MSD PDF\'s literal "20 hours per week" cap — an internal DHHS document conflict, not just a DHHS-vs-third-party one.'
);
const PB_25_14 = src(
  'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf',
  'Provider Bulletin 25-14 (July 1, 2025), "Applied Behavior Analysis Rates" — direct read confirms the exact 7-code rate table effective 8/1/2025 (97151 $38.16, 97152 $25.88, 97153 $18.70, 97154 $7.49, 97155 $22.72, 97156 $26.06, 97158 $12.05) and states "Medicaid managed care rates will also be adjusted to reflect the revised Medicaid ABA rates effective August 1, 2025." Contains no mention of 97157, 0362T, or 0373T at all.'
);
const HPA_25_08 = src(
  'https://dhhs.ne.gov/Guidance%20Docs/Health%20Plan%20Advisory%2025-08%20-%20Applied%20Behavior%20Analysis%20Rates.pdf',
  'Health Plan Advisory 25-08 (July 1, 2025), addressed to "Nebraska Medicaid Managed Care Plans" — directs the same 8/1/2025 rate table (identical 7 codes/figures as PB 25-14) to all three Heritage Health MCOs; no independent MCO-negotiated rate is contemplated.'
);
const DHHS_ABA_FACTS = src(
  'https://dhhs.ne.gov/Pages/Applied-Behavior-Analysis.aspx',
  'DHHS "Applied Behavior Analysis Facts" page — direct read confirms the same 7-code rate table and states "Hours of service up to 30 hours per week, and direct service hours of 6 hours per day, except in cases when more hours are medically necessary." No mention of 97157, 0362T, or 0373T; no telehealth detail.'
);
const MHSUD_FEE_SCHEDULE_SFY27 = src(
  'https://dhhs.ne.gov/Medicaid%20Practitioner%20Fee%20Schedules/REVISED%20MHSUD%20SFY27%20Fee%20Schedule.xlsx',
  'Mental Health & Substance Use Disorder fee schedule, "REVISED" SFY27 edition (eff. 7/1/2026) — the actual current URL; the filename cited in src/data/payers/nebraska.ts ("MHSUD SFY27 Fee Schedule.xlsx", no "REVISED" prefix) 404s as of this access. The dedicated "ABA" tab gives, per code: telehealth modifier + POS columns (populated ONLY for 97151/97155/97156, each "95" / "02, 10" — blank for 97152/97153/97154/97158) and per-provider-type rate columns (1 MD, 2 DO, 57 Provisionally Licensed PhD, 67 Licensed Psychologist, 83 BCBA, 84 BCaBA, 85 RBT), with ineligible provider types shown as a flat $0 rather than a lower nonzero figure. Same 7 rates as PB 25-14, confirmed identical for SFY27. No 97157/0362T/0373T row exists on this tab.'
);
const MHSUD_FEE_SCHEDULE_JUL2025 = src(
  'https://dhhs.ne.gov/Medicaid%20Practitioner%20Fee%20Schedules/Mental%20Health%20and%20Substance%20July%201%202025%20Updated%207.31.25.xlsx',
  'Mental Health & Substance Use Disorder fee schedule, July 2025 edition (updated 7/31/2025) — same "ABA" tab structure as the SFY27 edition, used here to cross-check the post-8/1/2025 rate table and to confirm the pre-cut (7/1-7/31/2025) rates for context. Confirms the same telehealth modifier/POS pattern (97151/97155/97156 only) and per-provider-type $0 pattern.'
);
const COMPANION_GUIDE = src(
  'https://dhhs.ne.gov/Documents/270-271%20Companion%20guide.pdf',
  'NE MMIS 270/271 Companion Guide (5010, printed effective date 3/9/2015) — direct read confirms: "Nebraska Medicaid currently supports both batch and real-time transactions for HTTP/S and batch only for SFTP for the 270/271"; receiver ID "MMISNEBR"; loop 2120C NM1 (Subscriber Benefit Related Entity Name), NM101 entity-identifier code "X3" conveys "the name of the MCO (Med/Surg HMO)" as free text (code "P3" separately conveys the enrolled PCP\'s name); loop 2100C DTP01 code "292" flags a Managed Care full-risk-capitation coverage span in the eligibility/benefit-date segment. No numeric MCO carrier-code table anywhere in the document, and no explicit statement of eligibility-span granularity (monthly/daily) beyond the real-time/batch transaction-timing rules already quoted.',
  true
);
const PVERIFY_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026. Table-cell extraction confirms rows: 01204=Nebraska Medicaid (Elig Yes/Claims No/ERA No/Medical), 01205=Nebraska Total Care (same flags), 06080=Molina Healthcare of Nebraska (same flags), 00001=Aetna (Elig Yes/Claims Yes/ERA No), 00004=Cigna (Elig Yes/Claims Yes/ERA No), 00192=United Healthcare (Elig Yes/Claims Yes/ERA No). No Nebraska-specific "UnitedHealthcare Community Plan" row exists anywhere in the document — only the generic national "United Healthcare" (00192) plus separate state-tagged rows for Kansas (UHG002) and Tennessee (UHG003) and a distinct "United Healthcare - Optum Behavioral Solutions" (UHG007) national BH-line entry.'
);
const AVAILITY_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs) — QA re-check (2026-07-23): the fetchable copy carries an "As of 08/08/2012" footer (same finding already applied to georgia.ts / aetna-florida). Table-cell extraction confirms 60054=AETNA, 62308=CIGNA, 87726=UNITEDHEALTHCARE as of that 2012 snapshot — but contains NO row of any kind (numeric or named) for Nebraska Medicaid, Nebraska Total Care, Molina Healthcare of Nebraska, or UnitedHealthcare Community Plan of Nebraska; the only Nebraska-tagged row at all is an unrelated legacy "COVENTRY HEALTH CARE - NEBRASKA" line.',
  true
);
const NTC_POLICY = src(
  'https://www.nebraskatotalcare.com/content/dam/centene/Nebraska/policies/clinical-policies/NE.CP.BH.105_Applied_Behavioral_Analysis_Documentation_Requirements_07022024_508.pdf',
  'Nebraska Total Care NE.CP.BH.105 (rev. 06/2024) — operationalizes the state MSDs; sets group adaptive treatment at 2-8 participants (wider than the state MSD\'s own 2-5 staffing-ratio table for 97154/97158 — a documented plan-specific variation, not reconciled here); requires the IDI + a functional behavior assessment with direct assessment/data analysis in the assessment package; no BH carve-out vendor named anywhere in the document.'
);
const NTC_FORMS_PAGE = src(
  'https://www.nebraskatotalcare.com/providers/resources/behavioral-health-forms.html',
  'Nebraska Total Care behavioral-health forms page — ABA Form + OTR tip sheets; submission via provider.nebraskatotalcare.com portal or fax 866-593-1955.'
);
const MOLINA_PA_PAGE = src(
  'https://www.molinahealthcare.com/providers/ne/medicaid/Claims/priorauth.aspx',
  'Molina NE Medicaid prior-authorization page — Availity Essentials (preferred), fax (833) 832-1015, phone (844) 782-2678; quarterly PA code-change PDFs posted; no Nebraska-specific ABA clinical policy or code-level PA statement published; no BH carve-out vendor named.'
);
const OPTUM_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf',
  'NE Heritage Health Medicaid ABA Program Quick Reference Guide (Optum BH4233) — "All Autism Services require Prior Authorization"; two-step assessment-then-treatment authorization (no treatment on the assessment auth alone); claims payer ID 87726, 180-day timely filing; verify benefits via the BH number on the member ID card, not the medical line.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — all 10 codes listed as medically necessary when criteria are met; pure clinical-necessity policy, contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers. Current edition\'s state-mandate paragraph names only New York/Virginia as carrying a state-specific exception — no Nebraska-specific language.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  "Cigna Autism Resource Guide, Mar 2025 — states verbatim: \"Use Evernorth payer ID 62308,\" independently confirming ABA/autism claims use the same payer ID as Cigna's medical claims nationally (no separate Evernorth EDI hop)."
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025 — contains zero CPT codes (ICD-10 F84.0 only); points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Nebraska-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied here as 'inferred' absent a confirmed Nebraska-specific override (same treatment georgia.ts gave this same document)."
);
const OPTUM_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum — ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026 edition) — confirmed to contain no Nebraska entry (already noted in nebraska.ts prose); commercial Nebraska members get Optum\'s standard national criteria, with the state mandate operating at the benefits layer instead.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — scoped to Down syndrome/non-ASD indications; 97151-97158 appear only under "not covered for indications listed in this CPB." Cross-references CPB 0648 for actual ASD coverage. No unit caps, POS codes, telehealth modifiers, or a precert form number appear in this document (georgia.ts\'s independent QA re-check found the same on the same document).'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  "Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met (0362T/0373T under \"other CPT codes related to the CPB\"); no unit caps, POS codes, telehealth modifiers, or precert form number given."
);
const NE_MANDATE = src(
  'https://nebraskalegislature.gov/laws/statutes.php?statute=44-7,106',
  'Neb. Rev. Stat. § 44-7,106 (LB 254, eff. 1/1/2015) — requires coverage of ASD screening/diagnosis/treatment under 21 for state-regulated plans, with behavioral health treatment including ABA capped at 25 hrs/week; a benefits-layer cap distinct from any single CPT code\'s unit cap, and exempt for non-grandfathered individual/small-group ACA plans and self-funded ERISA plans.'
);

/* -------------------- Layer 4: Medicaid rate table -------------------- */
/* Shared across nebraska-medicaid and all 3 Heritage Health MCOs per
   HPA 25-08 ("Medicaid managed care rates will also be adjusted to
   reflect the revised Medicaid ABA rates" — no independent MCO rate). */

const NE_RATE_SOURCES: SourceRef[] = [PB_25_14, HPA_25_08, MHSUD_FEE_SCHEDULE_SFY27, MHSUD_FEE_SCHEDULE_JUL2025, DHHS_ABA_FACTS];

function neRateTable(forMco: boolean): RateTable {
  return {
    source: forMco
      ? 'Nebraska DHHS Provider Bulletin 25-14 sets the statewide fee-for-service rate; Health Plan Advisory 25-08 directs all 3 Heritage Health MCOs to track it identically — no independent MCO-negotiated ABA rate found.'
      : 'Nebraska DHHS Provider Bulletin 25-14, confirmed against the MHSUD fee schedule\'s "ABA" tab (both the July 2025 and SFY27 editions carry the same 7 figures).',
    effectiveDate: '2025-08-01',
    byCode: {
      '97151': {
        rate: '38.16',
        unit: '15min',
        modifierTiers: {
          '1 (MD)': '38.16',
          '2 (DO)': '38.16',
          '57 (Provisionally Licensed PhD)': '38.16',
          '67 (Licensed Psychologist)': '38.16',
          '83 (BCBA/LBA)': '38.16',
          '84 (BCaBA/LaBA)': 'not billable — $0 in the fee schedule',
          '85 (RBT)': 'not billable — $0 in the fee schedule',
        },
      },
      '97152': {
        rate: '25.88',
        unit: '15min',
        modifierTiers: {
          '57 (Provisionally Licensed PhD)': '25.88',
          '67 (Licensed Psychologist)': '25.88',
          '84 (BCaBA/LaBA)': '25.88',
          '85 (RBT)': '25.88',
          '1 (MD)': 'not billable — $0 in the fee schedule',
          '2 (DO)': 'not billable — $0 in the fee schedule',
          '83 (BCBA/LBA)': 'not billable — $0 in the fee schedule',
        },
      },
      '97153': {
        rate: '18.70',
        unit: '15min',
        modifierTiers: {
          '57 (Provisionally Licensed PhD)': '18.70',
          '67 (Licensed Psychologist)': '18.70',
          '83 (BCBA/LBA)': '18.70',
          '84 (BCaBA/LaBA)': '18.70',
          '85 (RBT)': '18.70',
          '1 (MD)': 'not billable — $0 in the fee schedule',
          '2 (DO)': 'not billable — $0 in the fee schedule',
        },
      },
      '97154': {
        rate: '7.49',
        unit: '15min',
        modifierTiers: {
          '57 (Provisionally Licensed PhD)': '7.49',
          '67 (Licensed Psychologist)': '7.49',
          '83 (BCBA/LBA)': '7.49',
          '84 (BCaBA/LaBA)': '7.49',
          '85 (RBT)': '7.49',
          '1 (MD)': 'not billable — $0 in the fee schedule',
          '2 (DO)': 'not billable — $0 in the fee schedule',
        },
      },
      '97155': {
        rate: '22.72',
        unit: '15min',
        modifierTiers: {
          '1 (MD)': '22.72',
          '2 (DO)': '22.72',
          '57 (Provisionally Licensed PhD)': '22.72',
          '67 (Licensed Psychologist)': '22.72',
          '83 (BCBA/LBA)': '22.72',
          '84 (BCaBA/LaBA)': 'not billable — $0 in the fee schedule',
          '85 (RBT)': 'not billable — $0 in the fee schedule',
        },
      },
      '97156': {
        rate: '26.06',
        unit: '15min',
        modifierTiers: {
          '1 (MD)': '26.06',
          '2 (DO)': '26.06',
          '57 (Provisionally Licensed PhD)': '26.06',
          '67 (Licensed Psychologist)': '26.06',
          '83 (BCBA/LBA)': '26.06',
          '84 (BCaBA/LaBA)': 'not billable — $0 in the fee schedule',
          '85 (RBT)': 'not billable — $0 in the fee schedule',
        },
      },
      '97157': {
        rate: 'unverified',
        unit: '15min',
        modifierTiers: {},
      },
      '97158': {
        rate: '12.05',
        unit: '15min',
        modifierTiers: {
          '1 (MD)': '12.05',
          '2 (DO)': '12.05',
          '57 (Provisionally Licensed PhD)': '12.05',
          '67 (Licensed Psychologist)': '12.05',
          '83 (BCBA/LBA)': '12.05',
          '84 (BCaBA/LaBA)': 'not billable — $0 in the fee schedule',
          '85 (RBT)': 'not billable — $0 in the fee schedule',
        },
      },
      '0362T': { rate: 'unverified', unit: '15min', modifierTiers: {} },
      '0373T': { rate: 'unverified', unit: '15min', modifierTiers: {} },
    },
    sources: NE_RATE_SOURCES,
  };
}

/* -------------------- Layer 3: state Medicaid code grid -------------------- */

const NOT_BILLABLE_NOTE =
  'Not part of Nebraska Medicaid\'s billable ABA code set — confirmed absent from Provider Bulletin 25-14, the DHHS "Applied Behavior Analysis Facts" page, the MHSUD fee schedule\'s "ABA" tab, and both ABA Medicaid Service Definitions\' own "Fee schedule codes for this service are" lists (checked directly, all four, this pass). If a family\'s MCO nonetheless authorizes this code, verify the rate directly with DHHS Rate & Reimbursement (DHHS.ratesreimbursement@nebraska.gov) — do not assume a rate from the pattern of the other 7 codes.';

function notBillableEntry(): CodeGridEntry {
  return {
    covered: 'No',
    paRequired: 'N/A — not a billable Nebraska Medicaid ABA code',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes: NOT_BILLABLE_NOTE,
    fieldStatus: { covered: 'verified' },
    sources: [PB_25_14, DHHS_ABA_FACTS, MHSUD_FEE_SCHEDULE_SFY27, MSD_TREATMENT, MSD_ASSESSMENT],
  };
}

const NE_STATE_CODEGRID: Record<string, CodeGridEntry> = {
  '97151': {
    covered: 'Yes',
    paRequired:
      'Not independently confirmed as a standalone PA event — the treatment MSD requires the ABA assessment and treatment plan to be submitted together with the initial treatment prior-authorization request, and an Initial Diagnostic Interview (IDI) within the previous 12 months must precede the assessment. No Nebraska document states whether the assessment CPT codes trigger their own separate PA step at the state level (contrast UnitedHealthcare/Optum, which explicitly requires one — see that guide).',
    unitCap: 'No per-code daily/weekly unit cap published. Staffing ratio: 1 licensed clinician : 1 child.',
    capPeriod: 'unverified — no cap published',
    posAllowed: ['home', 'community', 'office or clinic', 'telehealth — POS 02 (patient not at home) or POS 10 (patient at home)'],
    telehealth:
      'Yes, conditional — audiovisual only (modifier 95). Allowed if caregivers are on-site using live synchronous methods, the environment is assessed safe (or modified to be), caregivers have a secure internet connection, the individual does not need more than 1:1 support, and use is documented as clinically necessary (not for provider/caregiver convenience).',
    modifiers: [
      '95 (telehealth, audiovisual — informational modifier, placed after any payment modifier), with POS 02 or 10',
      'No CPT modifier for licensure tier — billed by enrolled Provider Type 1 (MD), 2 (DO), 57 (Provisionally Licensed PhD), 67 (Licensed Psychologist), or 83 (BCBA/LBA); Provider Types 84 (BCaBA/LaBA) and 85 (RBT) are not reimbursed for this code ($0 in the fee schedule)',
    ],
    notes: 'Rate $38.16/15min is flat across every eligible provider type — no BCBA-vs-physician differential where both are eligible to bill (see rates.byCode).',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_ASSESSMENT, MSD_TREATMENT, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '97152': {
    covered: 'Yes',
    paRequired:
      'Not independently confirmed as a standalone PA event — see 97151. Bundled with the assessment package submitted alongside the initial treatment PA request.',
    unitCap: 'No per-code daily/weekly unit cap published. Staffing ratio: 1 technician : 1 child.',
    capPeriod: 'unverified — no cap published',
    posAllowed: ['home', 'community', 'office or clinic'],
    telehealth: 'No — the ABA Behavior Identification Assessment MSD states verbatim this code "cannot be completed via telehealth."',
    modifiers: [
      'No telehealth modifier applicable (telehealth not allowed for this code)',
      'Billed by Provider Type 57 (Provisionally Licensed PhD), 67 (Licensed Psychologist), 84 (BCaBA/LaBA), or 85 (RBT); Provider Types 1 (MD), 2 (DO), and 83 (BCBA/LBA) are not reimbursed for this code ($0 in the fee schedule)',
    ],
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_ASSESSMENT, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '97153': {
    covered: 'Yes',
    paRequired:
      'Required — MCO-administered; the treatment MSD requires the assessment + treatment plan with the initial PA request, and Provider Bulletin 25-02 states PA duration "is based on medical necessity and therefore is variable in duration" (no fixed statewide period). Treatment plan reviewed at least every 90 days regardless of PA duration.',
    unitCap:
      'Grouped with 97154/97155 under the MSD\'s "direct ABA service hours" definition (the same codes subject to the 10%-of-hours direct-supervision rule): may not exceed 24 units/day (6 hrs) per the treatment MSD\'s literal text, with a weekly cap the state\'s own documents state two different ways — 80 units/week (20 hrs) per the treatment MSD\'s literal text; 120 units/week (30 hrs) per Provider Bulletin 25-02 and the DHHS ABA Facts page. Both figures given deliberately, not resolved by fiat — request against the 20-hr/week reading as the conservative floor and cite the 30-hr materials when clinical need justifies more; either way, hours above 6/day require PA\'d clinical justification.',
    capPeriod: 'day (verified: 24 units / 6 hrs) and week (conflicting: 80 vs 120 units / 20 vs 30 hrs — see unitCap)',
    posAllowed: ['home', 'community', 'office or clinic'],
    telehealth:
      'No — the treatment MSD states verbatim: "Other ABA treatment services (CPT 97153, 97154, 97158) cannot be provided via telehealth."',
    modifiers: [
      'No telehealth modifier applicable (telehealth not allowed for this code)',
      'Billed by Provider Type 57, 67, 83 (BCBA/LBA), 84 (BCaBA/LaBA), or 85 (RBT); Provider Types 1 (MD)/2 (DO) not reimbursed ($0 in the fee schedule)',
    ],
    notes:
      'Direct supervision by observation required for no less than 10% of weekly direct-service hours (97153/97154/97155 combined), documented in progress notes; failure must be documented with a corrective-action plan. An LBA may supervise at most 24 technicians.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_TREATMENT, PB_25_02, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27, DHHS_ABA_FACTS],
  },
  '97154': {
    covered: 'Yes',
    paRequired: 'Required — same PA mechanics as 97153 (see that entry).',
    unitCap:
      'Grouped with 97153/97155 under the MSD\'s "direct ABA service hours" definition — see the 97153 entry for the same 6-hr/day, 20-vs-30-hr/week conflict. Staffing ratio: 1 technician : 2-5 children (group).',
    capPeriod: 'day (verified: 24 units / 6 hrs, combined w/ 97153/97155) and week (conflicting — see 97153)',
    posAllowed: ['home', 'community', 'office or clinic'],
    telehealth:
      'No — the treatment MSD states verbatim: "Other ABA treatment services (CPT 97153, 97154, 97158) cannot be provided via telehealth."',
    modifiers: [
      'No telehealth modifier applicable (telehealth not allowed for this code)',
      'Billed by Provider Type 57, 67, 83 (BCBA/LBA), 84 (BCaBA/LaBA), or 85 (RBT); Provider Types 1 (MD)/2 (DO) not reimbursed ($0 in the fee schedule)',
    ],
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_TREATMENT, PB_25_02, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '97155': {
    covered: 'Yes',
    paRequired: 'Required — same PA mechanics as 97153 (see that entry).',
    unitCap:
      'Grouped with 97153/97154 under the MSD\'s "direct ABA service hours" definition — see the 97153 entry for the same 6-hr/day, 20-vs-30-hr/week conflict. Staffing ratio: 1 licensed clinician : 1 child.',
    capPeriod: 'day (verified: 24 units / 6 hrs, combined w/ 97153/97154) and week (conflicting — see 97153)',
    posAllowed: ['home', 'community', 'office or clinic', 'telehealth — POS 02 (patient not at home) or POS 10 (patient at home)'],
    telehealth:
      'Yes, conditional — audiovisual only (modifier 95). Allowed only if the individual is receiving 97153 services concurrently, plus environment/safety and documented-necessity conditions from the treatment MSD are met.',
    modifiers: [
      '95 (telehealth, audiovisual), with POS 02 or 10 — conditional, see telehealth field',
      'Billed by Provider Type 1 (MD), 2 (DO), 57, 67, or 83 (BCBA/LBA); Provider Types 84 (BCaBA/LaBA)/85 (RBT) not reimbursed ($0 in the fee schedule)',
    ],
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_TREATMENT, PB_25_02, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '97156': {
    covered: 'Yes',
    paRequired: 'Required — same PA mechanics as 97153 (see that entry).',
    unitCap:
      'Not grouped into the MSD\'s "direct ABA service hours" definition (that phrase is specifically 97153/97154/97155) — no separate per-code daily/weekly unit cap was found for 97156 itself. A distinct, non-unit-cap mechanism applies instead: caregiver participation minimums of 1 hr/month (services <=10 hrs/month) or 2-4 hrs/month (services >10 hrs/month), tracked for continued-stay review rather than billed as a cap.',
    capPeriod: 'unverified — no per-code cap found; see notes for the separate monthly caregiver-participation-hour mechanism',
    posAllowed: ['home', 'community', 'office or clinic', 'telehealth — POS 02 (patient not at home) or POS 10 (patient at home)'],
    telehealth:
      'Yes, conditional — audiovisual only (modifier 95), per the treatment MSD\'s documented-necessity and environment/safety conditions for family training.',
    modifiers: [
      '95 (telehealth, audiovisual), with POS 02 or 10 — conditional, see telehealth field',
      'Billed by Provider Type 1 (MD), 2 (DO), 57, 67, or 83 (BCBA/LBA); Provider Types 84 (BCaBA/LaBA)/85 (RBT) not reimbursed ($0 in the fee schedule)',
    ],
    notes: 'Staffing ratio: 1 licensed clinician : 1 family. Teachers count for at most 25% of required caregiver-training hours; IEP meetings are not billable.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_TREATMENT, PB_25_02, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '97157': notBillableEntry(),
  '97158': {
    covered: 'Yes',
    paRequired: 'Required — same PA mechanics as 97153 (see that entry).',
    unitCap: 'No per-code daily/weekly unit cap found (not part of the "direct ABA service hours" 97153/97154/97155 grouping). Staffing ratio: 1 licensed clinician : 2-5 children (group).',
    capPeriod: 'unverified — no cap published',
    posAllowed: ['home', 'community', 'office or clinic'],
    telehealth:
      'No — the treatment MSD states verbatim: "Other ABA treatment services (CPT 97153, 97154, 97158) cannot be provided via telehealth."',
    modifiers: [
      'No telehealth modifier applicable (telehealth not allowed for this code)',
      'Billed by Provider Type 1 (MD), 2 (DO), 57, 67, or 83 (BCBA/LBA); Provider Types 84 (BCaBA/LaBA)/85 (RBT) not reimbursed ($0 in the fee schedule)',
    ],
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [MSD_TREATMENT, PB_25_14, MHSUD_FEE_SCHEDULE_SFY27],
  },
  '0362T': notBillableEntry(),
  '0373T': notBillableEntry(),
};

/* -------------------- MCO code-grid overrides -------------------- */
/* Each Heritage Health MCO inherits the state's clinical/coding
   mechanics (MCOs are directed to the same fee schedule per HPA
   25-08 and administer the same MSDs) with a per-MCO PA/submission
   overlay layered on top per-code group. */

const ASSESSMENT_CODES = ['97151', '97152'];
const TREATMENT_CODES = ['97153', '97154', '97155', '97156', '97158'];

function mcoCodeGrid(opts: {
  assessmentPaRequired: string;
  assessmentPaFieldStatus: FieldStatus;
  treatmentPaRequired: string;
  treatmentPaFieldStatus: FieldStatus;
  clinicalFieldStatus: FieldStatus; // how confidently the MCO's OWN documents confirm the inherited state coding mechanics
  extraSources: SourceRef[];
  extraNoteByCode?: Record<string, string>;
}): Record<string, CodeGridEntry> {
  const out: Record<string, CodeGridEntry> = {};
  for (const code of Object.keys(NE_STATE_CODEGRID)) {
    const base = NE_STATE_CODEGRID[code];
    const isAssessment = ASSESSMENT_CODES.includes(code);
    const isTreatment = TREATMENT_CODES.includes(code);
    const paRequired = isAssessment ? opts.assessmentPaRequired : isTreatment ? opts.treatmentPaRequired : base.paRequired;
    const paFieldStatus: FieldStatus = isAssessment
      ? opts.assessmentPaFieldStatus
      : isTreatment
        ? opts.treatmentPaFieldStatus
        : (base.fieldStatus?.paRequired ?? 'unverified');
    const extraNote = opts.extraNoteByCode?.[code];
    out[code] = {
      ...base,
      paRequired,
      notes: [base.notes, extraNote].filter(Boolean).join(' '),
      fieldStatus: base.fieldStatus
        ? {
            ...base.fieldStatus,
            paRequired: paFieldStatus,
            unitCap: isTreatment ? opts.clinicalFieldStatus : base.fieldStatus.unitCap,
            telehealth: base.fieldStatus.telehealth === 'verified' ? opts.clinicalFieldStatus : base.fieldStatus.telehealth,
            posAllowed: base.fieldStatus.posAllowed === 'verified' ? opts.clinicalFieldStatus : base.fieldStatus.posAllowed,
            modifiers: base.fieldStatus.modifiers === 'verified' ? opts.clinicalFieldStatus : base.fieldStatus.modifiers,
          }
        : undefined,
      sources: [...(base.sources ?? []), ...opts.extraSources],
    };
  }
  return out;
}

/* ==================== nebraska-medicaid ==================== */

const nebraskaMedicaidEdi: EdiRouting = {
  payerId: { pverify: '01204', availity: 'unverified', changeHealthcare: 'unverified' },
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
      'Loop 2120C, segment NM1 ("Subscriber Benefit Related Entity Name"), NM101 entity-identifier code "X3" — conveys the name of the member\'s MCO (Med/Surg HMO) as free text in NM103. (Code "P3" separately conveys the enrolled PCP\'s name; loop 2100C, segment DTP, DTP01 code "292" flags a Managed Care full-risk-capitation coverage span in the eligibility/benefit-date segment.)',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'inferred',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'No Nebraska Medicaid row of any kind (numeric or named) appears in the fetched Availity Essentials payer list — that list is also a stale "As of 08/08/2012" snapshot (same finding already applied in GA/FL). Confirm directly via Availity onboarding.',
    'payerId.changeHealthcare': 'No Change Healthcare-specific source found this pass — confirm via Optum/Change Healthcare payer finder.',
    'bhCarveOut.administrator':
      'Inferred from the absence of any BH-vendor mention in Nebraska Total Care\'s and Molina\'s own ABA/PA documents, cross-checked against this corpus\'s own Medicaid MCO coverage-gap census (docs/vob-gaps.md, 2026-07-23: "ABA is integrated into each MCO\'s capitated physical+behavioral health contract — not carved out"). UnitedHealthcare Community Plan of Nebraska is the one exception (Optum-managed since 1/1/2017) — see that guide.',
    'medicaid271Notes.eligibilitySpanGranularity':
      'The NE MMIS 270/271 Companion Guide (dated 3/9/2015 — 11+ years old, staleRisk) documents real-time-vs-batch transaction timing in detail but never states whether the returned eligibility span itself is monthly, daily, or tied to the inquiry date. Confirm via the NE Medicaid EDI help desk (866-498- extension per the companion guide\'s EDI Submissions Requirements page) or by inspecting a live 271 response.',
  },
  sources: [COMPANION_GUIDE, PVERIFY_LIST, AVAILITY_LIST],
};

/* ==================== nebraska-total-care ==================== */

const nebraskaTotalCareEdi: EdiRouting = {
  payerId: { pverify: '01205', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
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
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'No Nebraska Total Care row appears in the fetched Availity Essentials payer list at all — confirm directly via Availity onboarding.',
    'payerId.changeHealthcare': 'No Change Healthcare-specific source found this pass — confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: 'pVerify\'s list confirms eligibility support (Elig: Yes) but does not state real-time vs. batch — confirm via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Inferred from absence — NE.CP.BH.105 names no BH carve-out vendor anywhere in the document; not an explicit "no carve-out" statement. Confirm via Nebraska Total Care provider services.',
  },
  sources: [PVERIFY_LIST, NTC_POLICY],
};

const nebraskaTotalCareCodeGrid = mcoCodeGrid({
  assessmentPaRequired:
    'Unverified whether the assessment CPT codes independently require a standalone PA event — NE.CP.BH.105 requires the IDI plus a functional behavior assessment (with direct assessment and data analysis) inside the assessment PACKAGE, but does not state that the assessment codes themselves trigger a separate PA step distinct from the OTR-based treatment request. Verify in the provider portal or with the plan before booking.',
  assessmentPaFieldStatus: 'unverified',
  treatmentPaRequired:
    'Required — Outpatient Treatment Request (OTR): the ABA Form via the secure provider portal (provider.nebraskatotalcare.com) or fax 866-593-1955. Must include hours requested per code with clinical justification, billing codes, a titration/discharge plan, a crisis plan, and coordination-of-care attempts logged by date/outcome/contact name.',
  treatmentPaFieldStatus: 'verified',
  clinicalFieldStatus: 'inferred',
  extraSources: [NTC_POLICY, NTC_FORMS_PAGE],
  extraNoteByCode: {
    '97154': 'NE.CP.BH.105 sets group adaptive treatment at 2-8 participants — wider than the state MSD\'s own staffing-ratio table (2-5 children). Documented plan-specific variation, not reconciled here.',
    '97158': 'NE.CP.BH.105 sets group adaptive treatment at 2-8 participants — wider than the state MSD\'s own staffing-ratio table (2-5 children). Documented plan-specific variation, not reconciled here.',
  },
});

/* ==================== molina-healthcare-nebraska ==================== */

const molinaHealthcareNebraskaEdi: EdiRouting = {
  payerId: { pverify: '06080', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
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
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'No Molina Healthcare of Nebraska row appears in the fetched Availity Essentials payer list at all — Molina\'s own PA page names Availity Essentials as its preferred channel but publishes no payer ID; confirm directly via Availity onboarding.',
    'payerId.changeHealthcare': 'No Change Healthcare-specific source found this pass — confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: 'pVerify\'s list confirms eligibility support (Elig: Yes) but does not state real-time vs. batch — confirm via Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Inferred from absence — Molina\'s NE Medicaid PA page names no BH carve-out vendor and publishes no Nebraska-specific ABA clinical policy at all. Confirm via Molina NE provider services.',
  },
  sources: [PVERIFY_LIST, MOLINA_PA_PAGE],
};

const molinaHealthcareNebraskaCodeGrid = mcoCodeGrid({
  assessmentPaRequired:
    'Unverified — Molina publishes no Nebraska-specific statement on whether the ABA assessment codes require PA. Confirm via Availity Essentials, fax (833) 832-1015, phone (844) 782-2678, or the plan\'s quarterly PA code-list/look-up tool before every new intake cohort.',
  assessmentPaFieldStatus: 'unverified',
  treatmentPaRequired:
    'Presumed required (state MSD default), but Molina publishes no Nebraska-specific ABA PA policy — submission channels are Availity Essentials (preferred), fax (833) 832-1015, or phone (844) 782-2678, with a BH Certification of Need for Services form for BH services generally. PA code lists change quarterly; re-verify every quarter.',
  treatmentPaFieldStatus: 'unverified',
  clinicalFieldStatus: 'inferred',
  extraSources: [MOLINA_PA_PAGE],
});

/* ==================== unitedhealthcare-community-plan-nebraska ==================== */

const unitedhealthcareCommunityPlanNebraskaEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '87726', changeHealthcare: '87726 (ERA 86047)' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (branded "United Behavioral Health")',
    administratorPayerId: '87726 (ERA 86047)',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'inferred',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify':
      'No Nebraska-specific "UnitedHealthcare Community Plan" row exists in pVerify\'s March 2026 list (checked directly, table-cell extraction) — only the generic national "United Healthcare" (00192) and state-tagged Kansas/Tennessee rows exist. Confirm via pVerify onboarding or Provider Express.',
    supportsRealtime: 'Confirm real-time vs. batch via Provider Express/UHC EDI onboarding for this payer ID.',
    'bhCarveOut.abaRidesOn':
      'The plan\'s own QRG (BH4233) says to "verify benefits via the behavioral-health number on the member ID card, not the medical line," suggesting distinct BH routing — but claims still bill on the SAME 87726 ID used for UHC medical claims elsewhere, so "which side" ABA rides is genuinely ambiguous rather than unresearched. Same shipped fact already recorded in vob/carveouts.ts — do not contradict it.',
    'bhCarveOut.twoHopRequired':
      "Optum's program is a two-STEP authorization workflow (assessment auth, then treatment auth) — a UM/prior-auth concept, not necessarily an EDI/claims two-hop, since claims share the single 87726 ID. Whether this constitutes a genuine second EDI hop (vs. a single-payer-ID UM process) is unconfirmed; verify with UHC Community Plan of Nebraska / Optum provider services.",
  },
  sources: [OPTUM_QRG, PVERIFY_LIST],
};

const unitedhealthcareCommunityPlanNebraskaCodeGrid = mcoCodeGrid({
  assessmentPaRequired:
    'Required — step 1 of Optum\'s two-step authorization. "All Autism Services require Prior Authorization" including the assessment (which includes write-up time); a written request (the treatment request form marked as an assessment request) must attach the diagnostic evaluation, IDI, or FBA. Treatment cannot begin on the assessment auth alone.',
  assessmentPaFieldStatus: 'verified',
  treatmentPaRequired:
    'Required — step 2 (treatment authorization), a separate auth from the assessment. Must include the diagnosing provider\'s evaluation plus a treatment plan with baseline/mastery criteria, a transition plan, discharge criteria, parent goals, supervision hours, and coordination of care. Medical necessity applies at initial AND concurrent review; additional units require their own PA.',
  treatmentPaFieldStatus: 'verified',
  clinicalFieldStatus: 'inferred',
  extraSources: [OPTUM_QRG],
  extraNoteByCode: {
    '97153': 'Claims bill on payer ID 87726, 180-day timely filing, per Optum\'s NE QRG.',
  },
});

/* ==================== aetna-nebraska (commercial) ==================== */

const aetnaNebraskaEdi: EdiRouting = {
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
      'QA re-check (2026-07-23): the cited Availity list carries an "As of 08/08/2012" footer — 60054=AETNA is confirmed present in that snapshot, but downgraded from verified to inferred pending reconfirmation against a current Availity export (same treatment already applied to aetna-georgia / aetna-florida for the identical staleness finding).',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity — carried over from the same 2012 Availity snapshot.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source in any of the 19 states this corpus has covered so far (see vob/carveouts.ts\'s single national "unverified" Aetna commercial row) — confirm via Aetna provider services / the precertification line whether Aetna administers ABA in-house or via a named behavioral-health vendor for Nebraska.',
  },
  sources: [PVERIFY_LIST, AVAILITY_LIST],
};

function aetnaNeEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — precertification, per Aetna\'s national CPB 0554/0648. Cross-file note: nebraska.ts\'s own prose cites "form GR-69017-4," but georgia.ts\'s independent QA re-check of the SAME two CPBs found that form number does not actually appear in either document and removed it there — that correction is applied here too: the form number is NOT asserted as a verified fact.',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy located. Separately, Nebraska\'s mandate (Neb. Rev. Stat. § 44-7,106) caps behavioral health treatment including ABA at 25 hrs/week for state-regulated (large-group/grandfathered) plans — a benefits-layer cap, distinct from and not a substitute for any per-code unit cap, which remains unpublished by Aetna itself.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'inferred',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AETNA_CPB0554, AETNA_CPB0648, NE_MANDATE],
  };
}

const aetnaNebraskaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaNeEntry(),
  '97152': aetnaNeEntry(),
  '97153': aetnaNeEntry(),
  '97154': aetnaNeEntry(),
  '97155': aetnaNeEntry(),
  '97156': aetnaNeEntry(),
  '97157': aetnaNeEntry(),
  '97158': aetnaNeEntry(),
  '0362T': aetnaNeEntry(),
  '0373T': aetnaNeEntry(),
};

/* ==================== cigna-nebraska (commercial) ==================== */

const cignaNebraskaEdi: EdiRouting = {
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
  sources: [PVERIFY_LIST, AVAILITY_LIST, CIGNA_AUTISM_GUIDE],
};

function cignaNeEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics published. Separately, Nebraska\'s mandate (Neb. Rev. Stat. § 44-7,106) caps behavioral health treatment including ABA at 25 hrs/week for state-regulated (large-group/grandfathered) plans — a benefits-layer cap, distinct from any per-code unit cap.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CIGNA_EN0499, NE_MANDATE],
  };
}

const cignaNebraskaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaNeEntry('Not required (per EN0499)'),
  '97152': cignaNeEntry('Not required (per EN0499)'),
  '97153': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaNeEntry('Not required (per EN0499)'),
  '0373T': cignaNeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

/* ==================== unitedhealthcare-nebraska (commercial) ==================== */

const unitedhealthcareNebraskaEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: 'unverified', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.availity': 'No Nebraska-specific UnitedHealthcare commercial payer ID confirmed — same gap already recorded in vob/carveouts.ts for this family/state. Confirm via Availity onboarding.',
    'payerId.changeHealthcare': 'Same gap as payerId.availity — confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      'No Nebraska-specific payer ID confirmed for commercial UHC/Optum — contrast Nebraska Medicaid Community Plan, which has an explicit 87726 (ERA 86047) fact (see that guide). Confirm via Provider Express / UHC provider services.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_LIST, OPTUM_SCC],
};

function uhcNeCommercialEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — Optum ABA two-step authorization (assessment auth first, then treatment auth) via Provider Express, with continued-service reviews every 4-6 months.',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the ABA Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed Nebraska-specific override (Optum's ABA State Mandates supplement has no Nebraska entry). Separately, Nebraska's mandate (Neb. Rev. Stat. § 44-7,106) caps behavioral health treatment including ABA at 25 hrs/week for state-regulated plans — a benefits-layer cap, distinct from these per-code unit caps. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES, NE_MANDATE],
  };
}

const unitedhealthcareNebraskaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcNeCommercialEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcNeCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcNeCommercialEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcNeCommercialEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcNeCommercialEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcNeCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcNeCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcNeCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcNeCommercialEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcNeCommercialEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== export ==================== */

export const nebraskaVob: Record<string, VobExtension> = {
  'nebraska-medicaid': { edi: nebraskaMedicaidEdi, codeGrid: NE_STATE_CODEGRID, rates: neRateTable(false), lastUpdated: ACCESS_DATE },
  'nebraska-total-care': { edi: nebraskaTotalCareEdi, codeGrid: nebraskaTotalCareCodeGrid, rates: neRateTable(true), lastUpdated: ACCESS_DATE },
  'molina-healthcare-nebraska': { edi: molinaHealthcareNebraskaEdi, codeGrid: molinaHealthcareNebraskaCodeGrid, rates: neRateTable(true), lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-nebraska': {
    edi: unitedhealthcareCommunityPlanNebraskaEdi,
    codeGrid: unitedhealthcareCommunityPlanNebraskaCodeGrid,
    rates: neRateTable(true),
    lastUpdated: ACCESS_DATE,
  },
  'aetna-nebraska': { edi: aetnaNebraskaEdi, codeGrid: aetnaNebraskaCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-nebraska': { edi: cignaNebraskaEdi, codeGrid: cignaNebraskaCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-nebraska': { edi: unitedhealthcareNebraskaEdi, codeGrid: unitedhealthcareNebraskaCodeGrid, lastUpdated: ACCESS_DATE },
};
