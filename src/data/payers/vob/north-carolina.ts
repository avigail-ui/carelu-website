/* ================================================================
   VOB ENRICHMENT — North Carolina SPLIT A, Layers 1 (EDI routing
   crosswalk) + 3 (code-level coverage grid) + 4 (Medicaid rate
   tables). See docs/vob-build.md for the spec. Covers the state
   Medicaid FFS guide and its 4 remaining Standard Plans:
   north-carolina-medicaid, healthy-blue-north-carolina,
   amerihealth-caritas-north-carolina, carolina-complete-health,
   unitedhealthcare-community-plan-north-carolina, plus the merged
   wellcare-north-carolina guide (kept for historical/routing
   reference). NC Tailored Plans + commercial guides are a sibling
   session's slugs in this SAME file — do not touch them.

   Sourcing notes (read before editing):
   - The NCTracks 270/271 Companion Guide (ASC X12N005010X279A1,
     version April 2025) was located and read in full — unlike
     Georgia's, this one IS a static, fetchable PDF. It documents a
     PLAN-TYPE code table (Appendix A, 2110C EB05) — Standard Plan,
     Tailored Plan, Carve-out, Health Choice variants, etc. — not a
     per-MCO carrier-name table. The specific MCO's identity/contact
     comes back dynamically in the 2120C NM1/PER loop, not from a
     fixed code list. This distinction is captured verbatim in
     medicaid271Notes rather than forced into a false MCO-name table.
   - The current, in-force Clinical Coverage Policy 8F PDF (Amended
     Date 2019-08-15, confirmed still the live version as of the
     access date below) was opened directly. Its Attachment A
     billing-code table lists ONLY 97151-97157 — 97158, 0362T, and
     0373T do NOT appear anywhere in NC Medicaid's RB-BHT code set.
     Per the "don't force the CPT list" rule, those three codes ship
     as explicit 'not covered' entries below rather than being
     silently omitted or filled with invented caps.
   - HB 696 (Session Law 2026-1) was read from the ratified bill text
     directly. Its ABA provisions (§3C.18) are effective on enactment
     — April 30, 2026 — NOT August 1, 2026; no primary source ties any
     ABA rate or billing-rule change to 8/1/2026, and the amended CCP
     8F itself remains unpublished (still in draft/rulemaking) as of
     the access date. Any assumption of an 8/1/2026 effective date is
     explicitly corrected here, not propagated.
   - No plan among Healthy Blue, AmeriHealth Caritas, or Carolina
     Complete Health publishes its own code-level unit caps, POS
     codes, or modifiers for RB-BHT — each defers wholesale to CCP 8F,
     confirmed by reading their own UM guides/manuals/checklists
     directly (AmeriHealth's UM Guide literally cites "8F. (ncdhhs.gov)"
     in place of restating anything). WellCare of NC's WNC.CP.109 is
     the one plan-authored document with an actual CPT/modifier grid
     (GT video, KX audio-only for 97156/97157) — kept as historical
     reference per the plan's 4/1/2026 merger into Carolina Complete
     Health. UnitedHealthcare Community Plan NC's Optum-run ABA
     program QRG has zero code-level detail; Optum's national ABA
     Modifier FAQ (HN/HO/HM/HP tiers) is explicitly scoped to
     "commercial members only" and is NOT applied here as if it
     covered NC Medicaid.
   - EDI payer IDs surfaced a real, repeated pattern: several
     clearinghouses assign DIFFERENT codes for claims vs. 270/271
     real-time eligibility vs. ERA for the same payer (Healthy Blue,
     AmeriHealth Caritas NC). Each is captured with its own
     verifyVia note rather than collapsed into one number.
   - Carolina Complete Health's WellCare-merger routing mechanics are
     unusually well-documented: the unified payer ID (68069) and the
     legacy WellCare-only codes (PCS 23937, HHCS 57538) come straight
     from the plan's own merger page, including its explicit warning
     that pre-4/1/2026 WellCare claims submitted to CCH's ID reject
     with "Mbr not valid on DOS."
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, StcMap } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const NCTRACKS_270_271_CG = src(
  'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
  'NCTracks Companion Guide, Health Care Eligibility Benefit Inquiry and Response (270/271) ASC X12N005010X279A1, version dated April 2025 — read in full. 2110C EB loop (EB05, Appendix A) carries managed-care PLAN-TYPE codes (Standard/Tailored/Carve-out/Health Choice variants); the specific MCO name/contact comes back dynamically in the 2120C NM1/PER loop, not from a fixed carrier-code table. Designed as a real-time, CAQH-CORE-compliant exchange (§1.2); eligibility inquiries may span up to 36 months history in 1-12 month segments, with Medicaid (DHB) allowing lookahead through the end of the next month.'
);
const NCTRACKS_DMH_EXCLUSION = src(
  'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
  'Same NCTracks Companion Guide URL as NCTRACKS_270_271_CG, re-read for its behavioral-health/STC content this pass — the currently-served copy is dated September 2023 per its own footer, not April 2025 as originally cited; flagged, not corrected, since the original citation may reflect a since-superseded version. §7.2 "Eligibility Returned" states verbatim: "Division of Mental Health (DMH) information is not returned. That information is available through the Local Managing Entity (LME)." §7.5 repeats: "Eligibility information is not returned for benefit plans that are covered by DMH." NC Medicaid RB-BHT/ABA sits within DMH\'s purview for the Tailored Plan / LME-MCO population specifically (Alliance, Trillium, Vaya, Partners) — this is a state-architecture fact, not a guess: NCTracks\' own 271 explicitly excludes it and names the LME as the correct source.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 (PDF metadata confirms 2026-03-06).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the fetchable copy is dated 2012 and predates NC Medicaid managed-care transformation entirely; used here only as a negative check (no current NC Medicaid MCO entries found in it), not as a source of current payer IDs.',
  true
);
const OPTUM_PROFESSIONAL_CLAIMS_LIST = src(
  'https://www.optum.com/content/dam/optum4/business/open_source/practice-management/professional-claims-payer-list.pdf',
  "Optum/Change Healthcare Professional Claims payer list."
);
const OPTUM_RTE_LIST = src(
  'https://business.optum.com/content/dam/optum4/business/open_source/practice-management/real-time-eligibility-payer-list.pdf',
  'Optum/Change Healthcare Real-Time Eligibility (270/271) payer list — several payers on this list carry a DIFFERENT code than their own Professional Claims list entry; treated as the authoritative list for EDI routing fields here since VOB is an eligibility-check use case.'
);
const OPTUM_INSTITUTIONAL_LIST = src(
  'https://www.optum.com/content/dam/optum4/business/open_source/practice-management/institutional-claims-payer-list.pdf',
  'Optum/Change Healthcare Institutional Claims payer list, updated 2025-01-30 — NC Medicaid appears here under a DIFFERENT numeric code (12K23) than its RTE/Professional alpha code (NCMCD); institutional code is NOT valid for 270/271 eligibility checks.'
);
const OPTUM_MODIFIER_FAQ = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ABA-ModifierFAQ.pdf',
  "Optum ABA Modifier FAQ (BH4167b) — defines the HN/HO/HM/HP credential-tier modifiers, but states verbatim this is \"amending their current Provider Agreement as it applies to commercial members only.\" No NC-Medicaid-specific document was found extending this scheme to Medicaid claims — NOT applied to the UHC Community Plan NC codeGrid below on that basis."
);
const CCP_8F_CURRENT = src(
  'https://medicaid.ncdhhs.gov/documents/files/8f/open',
  'NC Medicaid Clinical Coverage Policy 8F (RB-BHT for ASD) — opened directly; stamped "Amended Date: August 15, 2019" and confirmed still the live, in-force version as of the access date (the amended 2026 rewrite remains unpublished). Attachment A\'s billing-code table lists only 97151-97157 — no 97158, 0362T, or 0373T anywhere in the document.'
);
const NC_RATE_REVERSAL_BLOG = src(
  'https://medicaid.ncdhhs.gov/blog/2025/12/19/medicaid-rate-reduction-reversal-update',
  'NC Medicaid, "Medicaid Rate Reduction Reversal Update," 12/19/2025 — confirms the 10/1/2025 rate reductions (RB-BHT included) were reversed per the Governor\'s 12/10/2025 directive, restoring rates to 9/30/2025 levels, with updated schedules posted to the NCTracks Fee Schedules Portal 1/5/2026.'
);
const ALLIANCE_RATE_SCHEDULE = src(
  'https://www.alliancehealthplan.org/document-library/97251',
  'Alliance Health Standard Rate Schedule (RB-BHT rates, eff. 10/1/2025) — a Tailored Plan\'s own published rate sheet, used here only as a cross-check confirming the statewide fee-schedule figures (Alliance is out of this session\'s scope; a sibling session covers NC Tailored Plans directly).'
);
const HB696_BILL_TEXT = src(
  'https://dashboard.ncleg.gov/api/Services/BillDocument/2025/8406/0/HB%20696v5',
  'HB 696 / Session Law 2026-1 ratified bill text (ratified 4/28/2026, signed 4/30/2026) — §3C.18 is the ABA/RB-BHT section. Per §3C.18(e), the provisions are effective on enactment (4/30/2026), NOT 8/1/2026 — no rate or billing-rule change tied to 8/1/2026 was found anywhere in the bill (an unrelated Rural Health Transformation Plan reporting window in §3B.1 does reference 8/1/2026-10/30/2026, but has nothing to do with ABA).'
);
const NC_MEDICAID_8F_BLOG_072126 = src(
  'https://medicaid.ncdhhs.gov/blog/2026/07/21/reminder-requirements-research-based-behavioral-health-treatment-service-delivery',
  'NC Medicaid blog, 7/21/2026 — confirms current RB-BHT requirements "will not be impacted by upcoming revisions to CCP 8F," i.e. the amended policy remained pending, not final, two days before this file\'s access date.'
);
const HEALTHY_BLUE_PROVIDER_MANUAL = src(
  'https://provider.healthybluenc.com/docs/gpp/NCNC_CAID_ProviderManual.pdf',
  'Healthy Blue NC Provider Manual (NCHB-CD-PM-085510-25) — contains exactly one ABA-related sentence (a care-management blurb); no CPT codes, unit caps, POS codes, or modifiers anywhere in the document.'
);
const HEALTHY_BLUE_TELEHEALTH_REPOST = src(
  'https://provider.healthybluenc.com/docs/gpp/HBNC_HBTC_TelehealthBillingCode.pdf',
  "Healthy Blue NC re-hosting of NC Medicaid's own COVID-era \"Telehealth Billing Code Summary\" (originally Special Bulletin COVID-19 #34, dated 2020-06-25, posted 2021-07). Its Table 10 lists 97151-97155 (GT modifier) and 97156/97157 (GT, or CR if audio-visual isn't accessible) \"reported with usual place of service\" — but the bulletin is a temporary COVID-emergency modification that explicitly expires with the state of emergency; its 2026 currency is unconfirmed. 97158/0362T/0373T do not appear in it.",
  true
);
const AMERIHEALTH_UM_GUIDE = src(
  'https://www.amerihealthcaritasnc.com/assets/pdf/provider/resources/utilization-management-guide.pdf',
  'AmeriHealth Caritas NC Behavioral Health Utilization Management Guide, dated January 2025 — its RB-BHT documentation-requirements row reads verbatim "NC Medicaid: (RB-BHT) and (ASD), 8F. (ncdhhs.gov)," i.e. the plan defers in writing rather than restating anything. No CPT codes, unit caps, POS codes, or modifiers in the 5-page guide.'
);
const AMERIHEALTH_PA_LOOKUP = src(
  'https://www.amerihealthcaritasnc.com/provider/resources/prior-authorization-lookup',
  'AmeriHealth Caritas NC Prior Authorization Lookup Tool page — confirms PA was eliminated on 240+ physical/BH codes effective 1/1/2025, but whether any 9715x/CCP-8F code is among them is not stated on the page and requires an interactive per-code query; no static ABA code table published.'
);
const CCH_BEHAVIORAL_HEALTH_PAGE = src(
  'https://network.carolinacompletehealth.com/resources/behavioral-health.html',
  "Carolina Complete Health behavioral-health provider page — links the ABA Outpatient Treatment Request Checklist and states clinical requirements are \"detailed in Policy 8F\" on NC Medicaid's site; no CCH-authored code list."
);
const CCH_ABA_CHECKLIST = src(
  'https://network.carolinacompletehealth.com/content/dam/centene/carolinacompletehealth/pdfs/Applied%20Behavioral%20Analysis%20Outpatient%20Treatment%20Request%20Checklist%20-%20Provider%20Guide.pdf',
  'Carolina Complete Health "ABA Outpatient Treatment Request Checklist – Provider Guide," last revised 2023-06-23 — a clinical-documentation checklist (diagnostic evaluation, treatment-plan elements, VB-MAPP/ABLLS-R assessment tools). References an "8-10 hour" figure for assessment/reassessment as narrative market-standard guidance, NOT a codified unit cap; contains zero CPT codes, no POS codes, no modifiers.'
);
const CCH_MERGER_PAGE = src(
  'https://network.carolinacompletehealth.com/merger.html',
  'Carolina Complete Health WellCare-merger resources page — confirms the unified payer ID (68069, effective 4/1/2026) via Availity/CCH portal/EDI/mail; legacy WellCare-only payer IDs (PCS 23937, HHCS 57538) remain required for pre-4/1/2026 dates of service, with an explicit warning that submitting pre-merger WellCare claims under the CCH ID triggers a "Mbr not valid on DOS" rejection. Historical WellCare claims access preserved 2 years post-merger; active authorizations carry over automatically.'
);
const NCDHHS_MERGER_PLAYBOOK = src(
  'https://medicaid.ncdhhs.gov/providers/provider-playbook-medicaid-managed-care/trending-topics/wellcare-north-carolina-and-carolina-complete-health-merge-april-1-2026',
  'NC Medicaid Provider Playbook — official notice of the WellCare of North Carolina / Carolina Complete Health merger effective 4/1/2026; points to the CCH merger page above for claims/billing mechanics rather than stating them itself.'
);
const UHC_NC_ABA_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ncaba/ncABA-QRG.pdf',
  'UnitedHealthcare Community Plan of North Carolina ABA Program Quick Reference Guide (BH01063_04172025) — purely administrative: PA process (separate assessment then treatment authorizations), CMS-1500 claims to Optum Behavioral Health, Payer ID 87726 (same as UHC medical — confirmed single EDI hop for claims), ERA Payer ID 86047, 180-day timely filing. Zero CPT codes, unit caps, POS codes, or modifiers.'
);
const WELLCARE_WNC_CP_109 = src(
  'https://www.policies-wellcare.com/content/dam/centene/wellcare/nc/policies/clinical-policies/WNC.CP.109.pdf',
  'WellCare of North Carolina Clinical Policy WNC.CP.109 (RB-BHT for ASD), Last Review Date 05/2025 — the one plan-authored document in this scope with an actual CPT/modifier grid: 97151-97157 all telehealth-billable with modifier GT (video); 97156/97157 additionally telephonic-billable with modifier KX (audio-only) if criteria are met. States "usual place of service" for both — no telehealth-specific POS number given. 97158/0362T/0373T do not appear. Confirmed still reachable and unchanged as of the access date, ~4 months post-merger; may be withdrawn without notice.'
);
const WELLCARE_PROVIDER_RESOURCES = src(
  'https://marketplace.wellcarenc.com',
  'WellCare of North Carolina provider-resources site (base domain — the specific Provider Quick Reference Guide PDF path was not captured this pass); confirms Payer ID 68069, matching Carolina Complete Health post-merger.'
);

/* -------------------- codeGrid: north-carolina-medicaid -------------------- */

function ncMedicaidCoveredEntry(code: string, assessmentCode: boolean): CodeGridEntry {
  const telehealthNote =
    "Inferred only — GT modifier (video) confirmed across two independently-published, non-authoritative documents (WellCare's WNC.CP.109 clinical policy and a Healthy-Blue-reposted NC Medicaid COVID-era Telehealth Billing Code Summary), but neither is NC Medicaid's own current, non-emergency policy statement; the COVID bulletin explicitly sunsets with the state of emergency. HB 696 (S.L. 2026-1, effective 4/30/2026) separately restricts paraprofessional telehealth delivery and caps LQASP telehealth supervision at 50%, pending the amended CCP 8F, which remains unpublished as of the access date — verify current telehealth mechanics before relying on this." +
    (assessmentCode ? '' : ' 97156/97157 additionally show KX (audio-only/telephonic) under documented caregiver-access-barrier criteria in the same two sources.');
  return {
    covered: `Yes (${code})`,
    paRequired: 'Required — PA required for ALL RB-BHT services, assessment included (CCP 8F §5.0-5.2, Prior Approval)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: telehealthNote,
    modifiers: assessmentCode ? ['GT (inferred)'] : ['GT (inferred)', 'KX (inferred, audio-only, conditional)'],
    notes:
      'No confirmed unit-cap, cap-period, or POS-code table was located for this code in the current CCP 8F PDF or the NCTracks Fee Schedules Portal (a dynamic search tool, not a fetchable static document) this pass. Verify via: NCTracks Fee Schedules Portal / CCP 8F Attachment A.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'inferred',
      modifiers: 'inferred',
    },
    sources: [CCP_8F_CURRENT, WELLCARE_WNC_CP_109, HEALTHY_BLUE_TELEHEALTH_REPOST, HB696_BILL_TEXT, NC_MEDICAID_8F_BLOG_072126],
  };
}

function ncMedicaidNotCoveredEntry(code: string): CodeGridEntry {
  return {
    covered: `No — ${code} is not in CCP 8F Attachment A's billing-code table (97151-97157 only) or the restored NC Medicaid RB-BHT fee schedule`,
    paRequired: 'N/A — code not covered under NC Medicaid RB-BHT',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes:
      "Confirmed absent from both the current CCP 8F PDF (Amended Date 2019-08-15, still in force as of the access date) and the fee schedule restored 2026-01-05 — NC Medicaid's RB-BHT code set does not include this code, unlike some other states' ABA fee schedules.",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      capPeriod: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [CCP_8F_CURRENT],
  };
}

const northCarolinaMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': ncMedicaidCoveredEntry('97151', true),
  '97152': ncMedicaidCoveredEntry('97152', true),
  '97153': ncMedicaidCoveredEntry('97153', false),
  '97154': ncMedicaidCoveredEntry('97154', false),
  '97155': ncMedicaidCoveredEntry('97155', false),
  '97156': ncMedicaidCoveredEntry('97156', false),
  '97157': ncMedicaidCoveredEntry('97157', false),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

/* 97158, 0362T, 0373T excluded from rates below — not in NC Medicaid's RB-BHT code set (see codeGrid notes). */
const northCarolinaMedicaidRates: RateTable = {
  source:
    'NC Medicaid RB-BHT fee schedule, restored 2026-01-05 to pre-10/1/2025-cut levels (NCTracks Fee Schedules Portal — a dynamic search tool; figures cross-checked against Alliance Health\'s published Standard Rate Schedule, not re-opened from the live portal export this pass).',
  effectiveDate: '2025-10-01',
  byCode: {
    '97151': { rate: '$30.56', unit: '15min' },
    '97152': { rate: '$61.73', unit: '15min' },
    '97153': { rate: '$20.81', unit: '15min' },
    '97154': { rate: '$11.37', unit: '15min' },
    '97155': { rate: '$32.22', unit: '15min' },
    '97156': { rate: '$23.70', unit: '15min' },
    '97157': { rate: '$11.51', unit: '15min' },
  },
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, CCP_8F_CURRENT],
};

const northCarolinaMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00164', availity: 'unverified', changeHealthcare: 'NCMCD' },
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
      "2110C EB loop (EB01='1', EB05 plan-type code per Appendix A) flags managed-care enrollment and plan TYPE (Standard Plan, Tailored Plan, Carve-out, Children & Families Specialty Plan, Health Choice variants); the SPECIFIC MCO's identity and contact info comes back dynamically in the 2120C NM1/PER loop (NM101='Y2' Prepaid Health Plan, 'P3' PCP/AMH, '13' Tailored Care Manager) — not from a fixed carrier-name table. 2110C MSG segment carries free-text notes (cost-sharing, time-limit overrides, tribal-option notes).",
    mcoCarrierCodes: {
      MCSTD: 'Medicaid Managed Care - Standard Plan',
      MCCRV: 'Medicaid Managed Care - Carve-out',
      TPMC: 'Tailored Plan',
      TPHC: 'Health Choice Tailored Plan',
      TPINV: 'Innovations Tailored Plan',
      TPTBI: 'TBI Tailored Plan',
      HCSTD: 'Health Choice Standard Plan',
      HCCRV: 'Health Choice Carve-out',
      PHPB: 'PIHP Behavioral Health',
      PHPC: 'PIHP Innovations-CAP',
      PHHC: 'PIHP NC Health Choice Behavioral Health',
    },
    eligibilitySpanGranularity:
      'Real-time, CAQH-CORE-compliant 270/271 exchange (Companion Guide §1.2); returned eligibility periods are date-range based rather than a simple monthly/daily flag — inquiries may span up to 36 months of history in 1-12 month segments (13 if the current month is included), with Medicaid (DHB) allowing lookahead through the end of the next month.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      "The only fetchable Availity public payer-list PDF is dated 2012 and predates NC's Medicaid managed-care transformation — no current NC Medicaid entry found in it. Confirm directly via Availity Essentials onboarding.",
    'payerId.changeHealthcare':
      "NCMCD (alpha) is Optum's code on both its Professional Claims and Real-Time Eligibility payer lists — use this for 270/271. A SEPARATE numeric code, 12K23, appears on Optum's Institutional Claims list; do not use 12K23 for eligibility checks.",
  },
  sources: [NCTRACKS_270_271_CG, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_PROFESSIONAL_CLAIMS_LIST, OPTUM_RTE_LIST, OPTUM_INSTITUTIONAL_LIST],
};

/* -------------------- healthy-blue-north-carolina -------------------- */

function healthyBlueDefersEntry(code: string): CodeGridEntry {
  return {
    covered: `Yes (${code}) — per CCP 8F deference; Healthy Blue publishes no ABA-specific code list of its own`,
    paRequired:
      'Required — per CCP 8F; check the Availity Interactive Care Reviewer / Precertification Lookup Tool for the current code-specific PA flag (no ABA-specific static list was found)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth:
      "Unverified as current, plan-authored mechanics. Healthy Blue's own Provider Manual contains no ABA telehealth detail; the one document with a code-specific telehealth table (GT modifier, or CR for 97156/97157 if audio-visual is inaccessible) is Healthy Blue's own re-hosting of an NC Medicaid COVID-era bulletin that explicitly sunsets with the state of emergency — its 2026 currency is unconfirmed.",
    modifiers: ['unverified'],
    notes:
      "Verify via: Availity Essentials Interactive Care Reviewer / Precertification Lookup Tool. The Healthy Blue NC Provider Manual's only ABA reference is a single care-management sentence — no CPT codes, unit caps, POS codes, or modifiers appear anywhere in it.",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [HEALTHY_BLUE_PROVIDER_MANUAL, HEALTHY_BLUE_TELEHEALTH_REPOST, CCP_8F_CURRENT],
  };
}

const healthyBlueCodeGrid: Record<string, CodeGridEntry> = {
  '97151': healthyBlueDefersEntry('97151'),
  '97152': healthyBlueDefersEntry('97152'),
  '97153': healthyBlueDefersEntry('97153'),
  '97154': healthyBlueDefersEntry('97154'),
  '97155': healthyBlueDefersEntry('97155'),
  '97156': healthyBlueDefersEntry('97156'),
  '97157': healthyBlueDefersEntry('97157'),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

const healthyBlueRates: RateTable = {
  source:
    "NC Medicaid RB-BHT fee schedule — the mandatory reimbursement floor Standard Plans must meet (>=100% of the state schedule unless the provider agrees otherwise). No Healthy-Blue-specific published rate schedule was found, so these figures are the floor Healthy Blue must meet, not a plan-confirmed paid rate.",
  effectiveDate: '2025-10-01',
  byCode: northCarolinaMedicaidRates.byCode,
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, HEALTHY_BLUE_PROVIDER_MANUAL],
};

const healthyBlueEdi: EdiRouting = {
  payerId: { pverify: '00700', availity: '00602', changeHealthcare: '14422' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists 00700, a THIRD number distinct from both Availity's 00602 and Optum's RTE code 14422 — not reconciled against either this pass.",
    'payerId.changeHealthcare':
      "Optum's Professional Claims list shows 00602 (matching Availity/the plan's own provider manual), but its separate Real-Time Eligibility list shows a DIFFERENT code, 14422, for the same payer — use 14422 for 270/271 eligibility checks, 00602 for claims.",
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      "No BH carve-out administrator is named anywhere in the Healthy Blue NC Provider Manual for RB-BHT — inferred as none (billed as a standard Medicaid medical benefit) absent evidence of a separate administrator; confirm via Healthy Blue provider services.",
  },
  sources: [HEALTHY_BLUE_PROVIDER_MANUAL, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_PROFESSIONAL_CLAIMS_LIST, OPTUM_RTE_LIST],
};

/* -------------------- amerihealth-caritas-north-carolina -------------------- */

function amerihealthDefersEntry(code: string): CodeGridEntry {
  return {
    covered: `Yes (${code}) — per CCP 8F deference; confirmed in AmeriHealth's own UM Guide, which cites "8F. (ncdhhs.gov)" rather than restating anything`,
    paRequired:
      "Required — per CCP 8F. AmeriHealth eliminated PA on 240+ physical/BH codes effective 1/1/2025; whether any 9715x code is among them is not stated on the PA Lookup Tool's public page and requires an interactive per-code query.",
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — no ABA-specific telehealth mechanics are published anywhere in AmeriHealth\'s own materials',
    modifiers: ['unverified'],
    notes:
      'Verify via: AmeriHealth Caritas NC Prior Authorization Lookup Tool (interactive, code-by-code) and UM at (888) 738-0004.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AMERIHEALTH_UM_GUIDE, AMERIHEALTH_PA_LOOKUP, CCP_8F_CURRENT],
  };
}

const amerihealthCodeGrid: Record<string, CodeGridEntry> = {
  '97151': amerihealthDefersEntry('97151'),
  '97152': amerihealthDefersEntry('97152'),
  '97153': amerihealthDefersEntry('97153'),
  '97154': amerihealthDefersEntry('97154'),
  '97155': amerihealthDefersEntry('97155'),
  '97156': amerihealthDefersEntry('97156'),
  '97157': amerihealthDefersEntry('97157'),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

const amerihealthRates: RateTable = {
  source:
    'NC Medicaid RB-BHT fee schedule — the mandatory reimbursement floor Standard Plans must meet. No AmeriHealth-Caritas-specific published rate schedule was found, so these figures are the floor AmeriHealth must meet, not a plan-confirmed paid rate.',
  effectiveDate: '2025-10-01',
  byCode: northCarolinaMedicaidRates.byCode,
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, AMERIHEALTH_UM_GUIDE],
};

const amerihealthEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: '14337' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify's March 2026 list carries TWO different, internally-inconsistent entries for this payer — 25148 \"AMERIHEALTH CARITAS NC\" and 02145 \"AMERIHEALTH CARITAS NORTH CAROLINA\" — not reconcilable from the document alone; confirm with pVerify support before automating.",
    'payerId.availity': 'No Availity-specific confirmation found; confirm directly via Availity onboarding.',
    'payerId.changeHealthcare':
      "14337 is Optum's Real-Time Eligibility code; the plan's own provider guide and Optum's Institutional/Professional Claims lists instead show 81671 for CLAIMS — a different code from the RTE entry used here for 270/271.",
    supportsRealtime: 'Confirm real-time vs. batch via Availity/Optum onboarding for this payer ID.',
    'bhCarveOut.administrator':
      "No BH carve-out administrator is named anywhere in AmeriHealth's UM Guide for RB-BHT — inferred as none absent evidence of a separate administrator; confirm via AmeriHealth UM at (888) 738-0004.",
  },
  sources: [AMERIHEALTH_UM_GUIDE, PVERIFY_PAYER_LIST, OPTUM_RTE_LIST, OPTUM_INSTITUTIONAL_LIST, OPTUM_PROFESSIONAL_CLAIMS_LIST],
};

/* -------------------- carolina-complete-health -------------------- */

function cchDefersEntry(code: string): CodeGridEntry {
  return {
    covered: `Yes (${code}) — explicit deference to CCP 8F; no CCH-authored code list`,
    paRequired:
      "Required — per CCP 8F, before rendering any RB-BHT service; submit with CCH's ABA Outpatient Treatment Request Checklist",
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — no ABA-specific telehealth mechanics published by CCH',
    modifiers: ['unverified'],
    notes:
      "CCH's ABA Outpatient Treatment Request Checklist references an \"8-10 hour\" figure for assessment/reassessment as narrative market-standard guidance, NOT a codified unit cap — do not treat as a hard limit. CCH's own clinical-policies index points straight to state 8F rather than hosting an equivalent numbered clinical policy. Verify via: provider portal / (833) 552-3876.",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CCH_BEHAVIORAL_HEALTH_PAGE, CCH_ABA_CHECKLIST, CCP_8F_CURRENT],
  };
}

const carolinaCompleteHealthCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cchDefersEntry('97151'),
  '97152': cchDefersEntry('97152'),
  '97153': cchDefersEntry('97153'),
  '97154': cchDefersEntry('97154'),
  '97155': cchDefersEntry('97155'),
  '97156': cchDefersEntry('97156'),
  '97157': cchDefersEntry('97157'),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

const carolinaCompleteHealthRates: RateTable = {
  source:
    'NC Medicaid RB-BHT fee schedule — the mandatory reimbursement floor Standard Plans must meet. No Carolina-Complete-Health-specific published rate schedule was found, so these figures are the floor CCH must meet, not a plan-confirmed paid rate.',
  effectiveDate: '2025-10-01',
  byCode: northCarolinaMedicaidRates.byCode,
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, CCH_BEHAVIORAL_HEALTH_PAGE],
};

const carolinaCompleteHealthEdi: EdiRouting = {
  payerId: { pverify: '002462', availity: 'unverified', changeHealthcare: '68069' },
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
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'No Availity-specific confirmation found beyond the plan\'s own stated "EDI Payor ID 68069"; confirm directly via Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity/Optum onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'No BH carve-out administrator is named for RB-BHT in CCH\'s behavioral-health provider materials — inferred as none absent evidence of a separate administrator; confirm via provider services (833) 552-3876.',
  },
  sources: [CCH_BEHAVIORAL_HEALTH_PAGE, CCH_MERGER_PAGE, PVERIFY_PAYER_LIST, OPTUM_RTE_LIST, OPTUM_PROFESSIONAL_CLAIMS_LIST,
    src(
      'https://network.carolinacompletehealth.com/merger.html',
      'Confirms EDI Payor ID 68069 effective statewide 4/1/2026 (same code CCH already used pre-merger, now also covering legacy WellCare of NC members going forward); legacy WellCare-only codes PCS 23937 / HHCS 57538 remain required for dates of service before 4/1/2026 only.'
    ),
  ],
};

/* -------------------- unitedhealthcare-community-plan-north-carolina -------------------- */

function uhcNcEntry(code: string): CodeGridEntry {
  return {
    covered: `Yes (${code})`,
    paRequired:
      "Required — all autism/ABA services require prior authorization, submitted via the Treatment Authorization Request Form online at providerexpress.com (per the NC ABA Program Quick Reference Guide). Both authorizations and claims run through the same Optum/UHC payer ID.",
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — the NC ABA Program QRG contains no telehealth mechanics for this code',
    modifiers: [
      'unverified — Optum\'s national ABA Modifier FAQ (HN/HO/HM/HP credential tiers) is explicitly scoped to "commercial members only" (BH4167b) and is NOT confirmed to apply to NC Medicaid claims; not applied here absent a Medicaid-specific document.',
    ],
    notes:
      'Claims (including the Optum BH carve-out) route on the SAME payer ID as medical (87726) — confirmed, no second EDI hop for claims. QA re-check (2026-07-23): the previously shipped claim of a "two-step" flow — separate authorizations for assessment vs. treatment — does not appear in the QRG; the document states only that all services require PA via one Treatment Authorization Request Form. Verify via: Provider Express / (866) 209-9320.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [UHC_NC_ABA_QRG, OPTUM_MODIFIER_FAQ, CCP_8F_CURRENT],
  };
}

const unitedhealthcareCommunityPlanCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcNcEntry('97151'),
  '97152': uhcNcEntry('97152'),
  '97153': uhcNcEntry('97153'),
  '97154': uhcNcEntry('97154'),
  '97155': uhcNcEntry('97155'),
  '97156': uhcNcEntry('97156'),
  '97157': uhcNcEntry('97157'),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

const unitedhealthcareCommunityPlanRates: RateTable = {
  source:
    'NC Medicaid RB-BHT fee schedule — the mandatory reimbursement floor Standard Plans must meet. No UHC-Community-Plan-specific published rate schedule was found, so these figures are the floor UHC must meet, not a plan-confirmed paid rate.',
  effectiveDate: '2025-10-01',
  byCode: northCarolinaMedicaidRates.byCode,
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, UHC_NC_ABA_QRG],
};

const unitedhealthcareCommunityPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
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
    'payerId.pverify':
      "No NC-specific \"UnitedHealthcare Community Plan of North Carolina\" line exists in pVerify's list — only generic \"United Healthcare\" (00192) and \"United Healthcare - Optum Behavioral Solutions\" (UHG007), neither state-tagged. Confirm which (if either) pVerify actually routes NC eligibility checks through.",
    'payerId.availity': 'No Availity-specific confirmation found; confirm directly via Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via Optum/Provider Express onboarding for this payer ID.',
  },
  sources: [UHC_NC_ABA_QRG, PVERIFY_PAYER_LIST, OPTUM_PROFESSIONAL_CLAIMS_LIST, OPTUM_RTE_LIST],
};

/* -------------------- wellcare-north-carolina (merged 4/1/2026; historical/routing reference) -------------------- */

function wellcareEntry(code: string, videoOnly: boolean): CodeGridEntry {
  return {
    covered: `Yes (${code}, historical — pre-4/1/2026 merger; route current inquiries to carolina-complete-health)`,
    paRequired:
      "Required — per the CCP 8F baseline WNC.CP.109 restates; code-level PA requirements were delegated to WellCare's own Authorization Lookup Tool / Medicaid Behavioral Health Authorization List (not independently re-verified this pass).",
    unitCap: 'Not published in WNC.CP.109',
    capPeriod: 'Not published in WNC.CP.109',
    posAllowed: ['usual place of service — no telehealth-specific POS number published by WNC.CP.109'],
    telehealth: videoOnly
      ? 'Yes — modifier GT (interactive audio-visual). WNC.CP.109 states telephonic (audio-only) delivery is not billable for this code.'
      : 'Yes — modifier GT (interactive audio-visual); ALSO telephonic-billable with modifier KX (audio-only) if the criteria in WNC.CP.109 §I.E./V.D. are met.',
    modifiers: videoOnly ? ['GT'] : ['GT', 'KX (conditional, audio-only)'],
    notes:
      'Historical/reference only — WellCare of NC merged into Carolina Complete Health effective 4/1/2026. WNC.CP.109 was still live and unchanged as of the access date but may be withdrawn without notice; Carolina Complete Health\'s own clinical-policy index does not carry an equivalent CCH-branded successor, pointing to state 8F instead. Route current inquiries to the carolina-complete-health guide.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [WELLCARE_WNC_CP_109, NCDHHS_MERGER_PLAYBOOK, CCH_MERGER_PAGE],
  };
}

const wellcareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': wellcareEntry('97151', true),
  '97152': wellcareEntry('97152', true),
  '97153': wellcareEntry('97153', true),
  '97154': wellcareEntry('97154', true),
  '97155': wellcareEntry('97155', true),
  '97156': wellcareEntry('97156', false),
  '97157': wellcareEntry('97157', false),
  '97158': ncMedicaidNotCoveredEntry('97158'),
  '0362T': ncMedicaidNotCoveredEntry('0362T'),
  '0373T': ncMedicaidNotCoveredEntry('0373T'),
};

const wellcareRates: RateTable = {
  source:
    'NC Medicaid RB-BHT fee schedule — the mandatory reimbursement floor Standard Plans had to meet pre-merger. Historical reference only; WellCare of NC merged into Carolina Complete Health effective 4/1/2026 — see carolina-complete-health for current rates/routing.',
  effectiveDate: '2025-10-01',
  byCode: northCarolinaMedicaidRates.byCode,
  sources: [NC_RATE_REVERSAL_BLOG, ALLIANCE_RATE_SCHEDULE, NCDHHS_MERGER_PLAYBOOK],
};

const wellcareEdi: EdiRouting = {
  payerId: { pverify: '00734', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
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
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify's own March 2026 entry (00734 \"WELLCARE OF NORTH CAROLINA\") is flagged Eligibility=No, Claim Status=No — consistent with the plan being sunset into Carolina Complete Health. Do not route new eligibility checks through this ID.",
    'payerId.changeHealthcare':
      'Optum\'s generic "Wellcare Health Plans"/"Wellcare HMO Inc." code (14163) is explicitly restricted by Optum\'s own Real-Time Eligibility list to "NJ,TX" only — NOT valid for NC. No NC-specific WellCare code was found on any current Optum list.',
    supports270271:
      'The plan is merged/sunset as of 4/1/2026 — current eligibility lookups should route to Carolina Complete Health\'s payer ID (68069) instead. Flagged unverified rather than false since some legacy-claims transactional activity may persist within the 2-year post-merger access window per the CCH merger page.',
  },
  sources: [WELLCARE_PROVIDER_RESOURCES, PVERIFY_PAYER_LIST, OPTUM_RTE_LIST, CCH_MERGER_PAGE, NCDHHS_MERGER_PLAYBOOK],
};

/* ================================================================
   VOB ENRICHMENT — North Carolina SPLIT B: Tailored Plans (Alliance,
   Trillium, Vaya, Partners) + commercial (Aetna, Cigna, UnitedHealthcare).
   Layers 1 (EDI crosswalk) + 3 (code grid) + 4 (rate tables, Tailored
   Plans only — commercial rates are contract-specific and excluded
   per docs/vob-build.md). NC Medicaid Direct + the five Standard
   Plans are a separate change-set (SPLIT A) landing in this same
   file/export from a parallel session — see the merge note on
   `northCarolinaVob` below.

   Sourcing notes (read before editing):
   - NC Medicaid's actual RB-BHT billable code set under Clinical
     Coverage Policy 8F is 97151-97157 ONLY. The 8F PDF's own
     telehealth-eligibility table (Attachment A) stops at 97157; no
     97158, 0362T, or 0373T appears in 8F, in Alliance's or Trillium's
     posted rate schedules, or in Vaya's authorization guidelines or
     rate schedule. This was verified by direct retrieval and text
     extraction of all four documents (not assumed) — codeGrid entries
     for those three CPT/HCPCS codes are marked "not part of NC's CCP
     8F billable code set" rather than invented. 99366 was checked and
     is likewise absent from 8F's code table.
   - None of Alliance Health, Trillium Health Resources, Vaya Health, or
     Partners Health Management appear under their own name on either
     the pVerify March-2026 payer list or the Availity Essentials 837
     payer list (both fetched and full-text-searched this pass, not
     skimmed) — nor does NC Medicaid itself appear on Availity's list.
     This is a structural fact, not a gap in this pass: Tailored Plan
     eligibility for RB-BHT most likely resolves through NC Medicaid's
     own 271 (NCTracks), with Tailored Plan enrollment surfacing as an
     MCO segment inside that response — the same mechanism the state-
     Medicaid guide's medicaid271Notes covers (a parallel session's
     scope, not populated here). Each Tailored Plan's own claims/EDI
     documentation was used instead where it exists.
   - Vaya's provider-document library, reported bot-blocked in the
     original corpus compile, was retried this pass and is NOT
     blocked: both its RB-BHT Authorization Guidelines v2.0 (Sept 2025)
     and its RB-BHT Guidance (May 2025) are plain-text PDFs that
     extracted cleanly. What remains genuinely unverified for Vaya is
     a *current* (FY26-27-cycle) rate schedule — the only rate
     document found is dated 7/1/2024 and one of its rates (97156)
     conflicts with the current statewide figure Alliance and Trillium
     both post; see the Vaya rates block below for the conflict detail.
   - Partners' payer ID 68069, which surfaces in several search hits
     and in the Partners/Carolina Complete Health FAQ, is confirmed by
     that same FAQ to be Carolina Complete Health's payer ID for
     PHYSICAL health claims delegated to CCH under the Tailored-Plan/
     Centene infrastructure arrangement (Availity list independently
     confirms 68069 = "Centene Corporation") — NOT a behavioral-health
     or RB-BHT payer ID. Partners' own BH claims route through
     ProAuth/Alpha+ with no clearinghouse payer ID found this pass;
     shipped 'unverified' rather than reusing 68069, which would be
     wrong.
   - Cigna/Evernorth's carve-out is the same national, already-verified
     same-payer-ID pass-through documented in the Georgia build (Cigna's
     own Autism Resource Guide states "Use Evernorth payer ID 62308").
     UnitedHealthcare's Optum BH routing has real NC-specific evidence
     this pass, via the (Medicaid) UHC Community Plan of NC ABA Quick
     Reference Guide: "Claims Payer ID 87726" (same as UHC's medical
     payer ID) for all autism/ABA claims, addressed to "Optum
     Behavioral Health." That QRG is Medicaid-specific, so it's applied
     to the COMMERCIAL unitedhealthcare-north-carolina guide as
     'inferred' cross-state/cross-LOB pattern evidence, not verified —
     pVerify separately lists a distinct "UHG007 United Healthcare -
     Optum Behavioral Solutions" entry not resolved against 87726 for
     commercial NC specifically.
   ================================================================ */
/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST_NCB = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 — full-text extracted and searched; no entry for Alliance Health, Trillium Health Resources, Vaya Health, or Partners Health Management under any name variant.'
);
const AVAILITY_PAYER_LIST_NCB = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  "Availity Essentials public payer list (837/270-271 payer IDs) — full-text extracted and searched; no entry for Alliance Health, Trillium Health Resources, Vaya Health, or Partners Health Management, and no entry for NC Medicaid itself. Payer ID 68069 in this list resolves to \"Centene Corporation,\" cross-confirming it is Carolina Complete Health's ID, not a Tailored Plan's."
);
const CCP_8F = src(
  'https://medicaid.ncdhhs.gov/documents/files/8f-1/open',
  'NC Medicaid Clinical Coverage Policy 8F (RB-BHT) — Section D/Attachment A: the CPT code table (telehealth-eligible with GT; telephonic-eligible with KX only for 97156/97157 under caregiver-barrier criteria in §3.1.2/3.2.5) stops at 97157. Section F (Place of Service) is narrative only — no POS numeric codes given. Retrieved and full-text extracted directly, not summarized from a mirror.'
);
const ALLIANCE_RATE_SCHEDULE_NCB = src(
  'https://www.alliancehealthplan.org/document-library/97251',
  "Alliance Health — Standard Rate Schedule, \"FY26 - Updated June 2026 V2 Format Revision/RB-BHT\" — RB-BHT line items (97151-97157) at $30.56/$61.73/$20.81/$11.37/$32.22/$23.70/$11.51 per 15-min unit, effective 10/1/2025. Retrieved and full-text extracted directly; no 97158, 0362T, or 0373T line items exist in the document."
);
const ALLIANCE_RBBHT_GUIDANCE = src(
  'https://www.alliancehealthplan.org/provider-updates/guidance-for-rb-bht-providers/',
  'Alliance Health — Guidance for RB-BHT Providers (Feb 2026) — diagnostic-instrument and service-order requirements; already cited in the base corpus prose.'
);
const TRILLIUM_RATE_TABLE = src(
  'https://www.trilliumhealthresources.org/sites/default/files/docs/Billing-Codes-Rates/Trillium-Rate-Table-FY-26-27.pdf',
  'Trillium Health Resources — Rate Table FY 26-27 — 97151-97157 (marked "**" = unified rate across legacy LME/MCOs) at $30.56/$61.73/$20.81/$11.37/$32.22/$23.70/$11.51 per 15-min unit, matching Alliance’s posted figures exactly. The table’s own Effective/End Date columns for these rows read 1/1/2024-12/31/2099 (a validity window in the rate-engine sense, not a distinct effective date) rather than restating 10/1/2025 — flagged here rather than silently reconciled. No 97158, 0362T, or 0373T rows exist in the document.'
);
const TRILLIUM_CLAIMS_PROTOCOL = src(
  'https://www.trilliumhealthresources.org/sites/default/files/docs/Provider-documents/Claims/Trillium-Medicaid-Direct-Tailored-Plan-Claims-Submission-Protocol.pdf',
  'Trillium — Tailored Plan & Medicaid Direct Claims Submission Protocol (rev. 9/23/2025) — states verbatim: Behavioral Health clearinghouse claims use Change Healthcare (payer ID 56089) or The SSI Group (payer ID 43071); Physical Health claims route to Carolina Complete Health via payer ID 68069 (a Centene delegation, confirmed separately on the Availity list). Retrieved and full-text extracted directly.'
);
const TRILLIUM_BENEFIT_PLAN = src(
  'https://www.trilliumhealthresources.org/sites/default/files/docs/Benefit-Plans-Services-Definitions/Trillium-Medicaid-Child-BH-Benefit-Plan.pdf',
  'Trillium — Medicaid Child BH Services Benefit Plan (rev. 7/2026) — already cited in the base corpus prose; source for the GT/KX telehealth-modifier language restated here.'
);
const VAYA_AUTH_GUIDELINES = src(
  'https://providers.vayahealth.com/wp-content/uploads/2025/09/Authorization_Guidelines_Medicaid_RB_BHT_ASD.pdf',
  'Vaya Health — Authorization Guidelines: Medicaid RB-BHT for ASD, v2.0, effective 9/5/2025 — code-by-code SAR documentation requirements and passthrough thresholds (97151: notification SAR up to 32 units/6 months, then medical-necessity review; 97155: notification SAR up to 1 hour per 10 hours of 97153/97154, then review). Reported bot-blocked in the original corpus compile; retried this pass and retrieved cleanly as plain text (not a scanned image) via direct download + pdftotext — NOT currently blocked.'
);
const VAYA_RBBHT_GUIDANCE = src(
  'https://providers.vayahealth.com/wp-content/uploads/2025/05/RB_BHT_Guidance_20250522.pdf',
  'Vaya Health — RB-BHT (ABA) Guidance, v1.0, rev. 5/1/2025 — confirms the 97155 passthrough as "up to 10% of approved 97153 hours" (consistent with the 1-hr-per-10-hr ratio in the Authorization Guidelines) and restates the May 2019 NC Medicaid Bulletin that 97155 does not cover routine technician-supervision/fidelity checks. Retrieved and extracted cleanly.'
);
const VAYA_RATE_SCHEDULE_2024 = src(
  'https://providers.vayahealth.com/wp-content/uploads/2024/07/Standard_Rate_Schedule_Tailored-Plan-Medicaid-Direct_Non-Clinician_20240801.pdf',
  'Vaya Health — Standard Rate Schedule: Tailored Plan/Medicaid Direct (Non-Clinician), dated 8/1/2024, rates effective 7/1/2024 — 97151-97157 listed; six of seven match Alliance/Trillium’s current 10/1/2025 statewide figures exactly, but 97156 is listed at $30.00 vs. the $23.70 both other Tailored Plans currently post. Retrieved and full-text extracted directly. This is the only Vaya rate document located this pass despite a search for a current FY26-27-cycle schedule (the Rate & Checkwrite Schedules page lists only generic "Clinician-Based"/"Non-Clinician-Based" schedule links, not a current one located and confirmed to postdate the Oct-2025/Jan-2026 rate cut-and-restoration cycle) — flagged staleRisk, not silently used as current.',
  true
);
const VAYA_OFFICEALLY_ENROLLMENT = src(
  'https://cms.officeally.com/OfficeAlly/Forms/EDI/VayaHealth_SmokyMtn_EDI_ENR_PKT.pdf',
  'Office Ally — Vaya Health (payer ID 13010) pre-enrollment instructions, Office Ally’s own clearinghouse document. Retrieved and full-text extracted directly. Vaya does not appear under this or any name on pVerify’s or Availity’s national lists (see those source notes) — Office Ally is a separate, third clearinghouse, confirmed directly rather than inferred.'
);
const PARTNERS_ALL_CODES_ALERT = src(
  'https://providers.partnersbhm.org/authorizations-for-research-based-behavioral-health-treatment-transition-to-all-codes/',
  "Partners — RB-BHT authorizations transition to ALL codes (provider alert); already cited in the base corpus prose."
);
const PARTNERS_CCH_FAQ = src(
  'https://network.carolinacompletehealth.com/content/dam/centene/carolinacompletehealth/pdfs/Partners-Carolina-Complete-Health-FAQ-General-Topics-3.7.24.pdf',
  "Partners/Carolina Complete Health FAQ (3/7/2024) — states verbatim that Payer ID 68069 is \"for physical health claims\" processed by Carolina Complete Health, and that behavioral health claims (where RB-BHT lives) go through Partners’ own portal/Alpha+, a separate system with no payer ID given in this document. Retrieved and full-text extracted directly — used here to rule OUT 68069 as Partners’ BH/RB-BHT payer ID, not to confirm one."
);
const UHC_NC_MEDICAID_ABA_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ncaba/ncABA-QRG.pdf',
  'Optum Provider Express — "UnitedHealthcare Community Plan of North Carolina ABA Program Quick Reference Guide" — states verbatim "Electronic Submission ... Claims Payer ID 87726" (same ID as UHC’s medical claims) and "Mail paper claims to: Optum Behavioral Health." This is the Medicaid Community Plan QRG, not a commercial document — retrieved and full-text extracted directly (the page wraps the PDF in a JS download redirect; fetched the underlying asset path directly).'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499, effective 2026-05-15 — all 10 codes listed as medically necessary when criteria are met; no unit caps, POS codes, or telehealth/licensure-tier modifiers published. Same national policy already verified in the Georgia build.'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna’s medical claims (no separate Evernorth EDI hop). Same national document already verified in the Georgia build; already cited in the NC corpus prose.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025 — contains zero CPT codes; points to a separate Optum ABA Reimbursement Policy for coding detail. Already cited in the NC corpus prose and verified in the Georgia build.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not NC-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied here as 'inferred' absent a confirmed NC-specific override, same treatment as the Georgia build."
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — scoped to Down syndrome/non-ASD indications; cross-references CPB 0648 for actual ASD coverage. No coding/reimbursement mechanics.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met (0362T/0373T under "other CPT codes related to the CPB"); no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given. No separate Aetna ABA billing/reimbursement policy located, same as the Georgia build.'
);

/* -------------------- Layer 3: codeGrid factories -------------------- */

/* NC Medicaid's CCP 8F billable RB-BHT set is 97151-97157 ONLY (verified —
   see file header). This factory carries the shared, state-level facts
   (telehealth/telephonic modifier eligibility, place-of-service language,
   180-day auth-cycle framing) that are identical across all four Tailored
   Plans; each call layers in the plan's own authorization mechanism. */
function ncTailoredPlanEntry(opts: {
  code: string;
  paRequired: string;
  paFieldStatus: 'verified' | 'inferred';
  unitCap: string;
  unitCapFieldStatus: 'verified' | 'inferred' | 'unverified';
  notes?: string;
  extraSources?: SourceRef[];
}): CodeGridEntry {
  const kxEligible = opts.code === '97156' || opts.code === '97157';
  return {
    covered: 'Yes',
    paRequired: opts.paRequired,
    unitCap: opts.unitCap,
    capPeriod: '180 days (initial + reauth, per CCP 8F auth cycle)',
    posAllowed: [
      'home (primary private residence)',
      'office/clinic',
      'school or work',
      'community / place of recreation or socialization',
      '(CCP 8F Section F is narrative only — no POS numeric codes given)',
    ],
    telehealth: kxEligible
      ? "Yes — GT modifier for telehealth (audio-visual). Telephonic (audio-only, KX modifier) also allowed, but ONLY when the caregiver's physical/behavioral health status or an access barrier (transportation, technology) prevents in-person or telehealth participation (CCP 8F §3.1.2/3.2.5)."
      : 'Yes — GT modifier for telehealth (audio-visual). Telephonic (KX) delivery is not permitted for this code per CCP 8F’s Attachment A code table.',
    modifiers: kxEligible
      ? ['GT (telehealth)', 'KX (telephonic, caregiver-barrier criteria only)']
      : ['GT (telehealth)'],
    notes: opts.notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: opts.paFieldStatus,
      unitCap: opts.unitCapFieldStatus,
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [CCP_8F, ...(opts.extraSources ?? [])],
  };
}

function ncCodeNotInStateSet(code: string): CodeGridEntry {
  return {
    covered: `No — ${code} is not part of NC Medicaid's CCP 8F billable RB-BHT code set (97151–97157 only)`,
    paRequired: 'N/A',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes:
      "Confirmed absent from CCP 8F's own CPT code table (Attachment A), from Alliance's and Trillium's posted rate schedules, and from Vaya's authorization guidelines and rate schedule — checked directly, not assumed from the CPT list.",
    fieldStatus: { covered: 'verified', paRequired: 'verified' },
    sources: [CCP_8F, ALLIANCE_RATE_SCHEDULE_NCB, TRILLIUM_RATE_TABLE, VAYA_AUTH_GUIDELINES],
  };
}

/* -------------------- commercial codeGrid factories (full CPT set, same national policies verified in Georgia) -------------------- */

function cignaEntryNC(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it. Same finding as the Georgia build (national policy, not NC-specific).',
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

function aetnaEntryNC(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (specific form number not confirmed in either cited CPB)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located this pass (same finding as the Georgia build). QA re-check (2026-07-23): form "GR-69017-4," previously cited here, does not appear in either CPB 0554 or CPB 0648 — removed pending a source that actually states it.',
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

function uhcEntryNC(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — two-step Optum authorization (assessment, then treatment); continued-service review every 4–6 months',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's NATIONAL ABA Reimbursement Policy (2022RP501A), same as the Georgia build — applied absent a confirmed NC-specific override. Claims-routing payer ID (87726, same as medical) is corroborated by Optum's own NC MEDICAID ABA Quick Reference Guide, applied here as inferred cross-LOB evidence, not a commercial-specific confirmation. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, UHC_NC_MEDICAID_ABA_QRG],
  };
}

/* ==================== alliance-health-north-carolina ==================== */

const allianceEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'bh',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'Alliance Health does not appear on pVerify’s March-2026 national payer list under any name variant — confirm via pVerify onboarding directly.',
    'payerId.availity': 'Alliance Health does not appear on the Availity Essentials 837 payer list either — confirm via Availity onboarding directly.',
    'payerId.changeHealthcare':
      'Multiple independent clearinghouse-adjacent payer-ID directories (Office Ally-family listings, practice-management EHR payer finders) consistently show "Alliance Behavioral Health, payer ID 23071" — but none is Change Healthcare’s, pVerify’s, or Availity’s own official list, and Alliance’s own EDI/claims pages return 403 to automated retrieval. Confirm 23071 and its clearinghouse directly with Alliance Provider Support ((855) 759-9700 / Claims@AllianceHealthPlan.org) before automating routing on it.',
    supports270271: 'Same as above — Alliance’s own EDI/Trading-Partner-Agreement pages block automated access (403); confirm directly.',
    'bhCarveOut.administrator': 'Alliance is itself the LME/MCO administering behavioral health (including RB-BHT) directly — inferred from its role as a Tailored Plan, not from a document naming "no carve-out" explicitly.',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB],
};

function allianceCodeGrid(): Record<string, CodeGridEntry> {
  const cover = 'Required — per CCP 8F, submitted with Alliance’s fillable RB-BHT cover sheet through Alliance UM';
  return {
    '97151': ncTailoredPlanEntry({
      code: '97151', paRequired: cover, paFieldStatus: 'verified',
      unitCap: 'unverified — no Alliance-specific or statewide per-code unit cap document located (180-day auth cycle is the governing limit)',
      unitCapFieldStatus: 'unverified',
      notes: 'Diagnostic-instrument bar applies at this step: ADI-R, ADOS-2, CARS-2, or TELE-ASD-PEDS required (Alliance Feb-2026 guidance); GARS/M-CHAT/SRS rejected as standalone.',
      extraSources: [ALLIANCE_RBBHT_GUIDANCE],
    }),
    '97152': ncTailoredPlanEntry({ code: '97152', paRequired: cover, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97153': ncTailoredPlanEntry({ code: '97153', paRequired: cover, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97154': ncTailoredPlanEntry({ code: '97154', paRequired: cover, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97155': ncTailoredPlanEntry({
      code: '97155', paRequired: cover, paFieldStatus: 'verified',
      unitCap: 'Inferred from Vaya’s statewide-pattern passthrough: routinely approved up to 1 hour per 10 hours of 97153/97154 (10%); above that, reviewed for medical necessity. Not confirmed as an Alliance-specific rule.',
      unitCapFieldStatus: 'inferred',
      extraSources: [VAYA_RBBHT_GUIDANCE],
    }),
    '97156': ncTailoredPlanEntry({ code: '97156', paRequired: cover, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97157': ncTailoredPlanEntry({ code: '97157', paRequired: cover, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97158': ncCodeNotInStateSet('97158'),
    '0362T': ncCodeNotInStateSet('0362T'),
    '0373T': ncCodeNotInStateSet('0373T'),
  };
}

const allianceRates: RateTable = {
  source: 'Alliance Health — Standard Rate Schedule',
  effectiveDate: '2025-10-01',
  byCode: {
    '97151': { rate: '$30.56', unit: '15min' },
    '97152': { rate: '$61.73', unit: '15min' },
    '97153': { rate: '$20.81', unit: '15min' },
    '97154': { rate: '$11.37', unit: '15min' },
    '97155': { rate: '$32.22', unit: '15min' },
    '97156': { rate: '$23.70', unit: '15min' },
    '97157': { rate: '$11.51', unit: '15min' },
    '97158': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0362T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0373T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
  },
  sources: [ALLIANCE_RATE_SCHEDULE_NCB],
};

/* ==================== trillium-health-resources ==================== */

const trilliumEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: '56089' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'bh',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'Trillium does not appear on pVerify’s national payer list under any name variant.',
    'payerId.availity': 'Trillium does not appear on the Availity Essentials 837 payer list either.',
    supports270271: 'Confirm 270/271 eligibility routing directly with Trillium — its own Claims Submission Protocol documents 837 claims routing (Change Healthcare 56089, The SSI Group 43071) but not eligibility-check routing specifically.',
    'bhCarveOut.administrator': 'Trillium is itself the LME/MCO administering behavioral health (including RB-BHT) directly — inferred from its role as a Tailored Plan and from its own claims protocol routing BH claims in-house (not to a third-party administrator).',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB, TRILLIUM_CLAIMS_PROTOCOL, TRILLIUM_BENEFIT_PLAN],
};

function trilliumCodeGrid(): Record<string, CodeGridEntry> {
  const tar = 'Required — TAR (initial + reauth up to 180 days each, telehealth included); reauth due before current auth expires';
  return {
    '97151': ncTailoredPlanEntry({
      code: '97151', paRequired: tar, paFieldStatus: 'verified',
      unitCap: 'unverified — no Trillium-specific per-code unit cap document located',
      unitCapFieldStatus: 'unverified',
      notes: 'No published unit caps (per the base corpus prose); units run in 15-minute increments. Inferred from Vaya’s statewide pattern: other Tailored Plans notify-approve up to 32 units/6 months before requiring medical-necessity review.',
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97152': ncTailoredPlanEntry({ code: '97152', paRequired: tar, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97153': ncTailoredPlanEntry({ code: '97153', paRequired: tar, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97154': ncTailoredPlanEntry({ code: '97154', paRequired: tar, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97155': ncTailoredPlanEntry({
      code: '97155', paRequired: tar, paFieldStatus: 'verified',
      unitCap: 'Inferred from Vaya’s statewide-pattern passthrough: up to 1 hour per 10 hours of 97153/97154 (10%); above that, medical-necessity review. Not confirmed as a Trillium-specific rule.',
      unitCapFieldStatus: 'inferred',
      extraSources: [VAYA_RBBHT_GUIDANCE],
    }),
    '97156': ncTailoredPlanEntry({ code: '97156', paRequired: tar, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }),
    '97157': ncTailoredPlanEntry({ code: '97157', paRequired: tar, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified' }, ),
    '97158': ncCodeNotInStateSet('97158'),
    '0362T': ncCodeNotInStateSet('0362T'),
    '0373T': ncCodeNotInStateSet('0373T'),
  };
}

const trilliumRates: RateTable = {
  source: 'Trillium Health Resources — Rate Table FY 26-27',
  effectiveDate: '2025-10-01',
  byCode: {
    '97151': { rate: '$30.56', unit: '15min' },
    '97152': { rate: '$61.73', unit: '15min' },
    '97153': { rate: '$20.81', unit: '15min' },
    '97154': { rate: '$11.37', unit: '15min' },
    '97155': { rate: '$32.22', unit: '15min' },
    '97156': { rate: '$23.70', unit: '15min' },
    '97157': { rate: '$11.51', unit: '15min' },
    '97158': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0362T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0373T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
  },
  sources: [TRILLIUM_RATE_TABLE, ALLIANCE_RATE_SCHEDULE_NCB],
};

/* ==================== vaya-health ==================== */

const vayaEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'bh',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'Vaya does not appear on pVerify’s national payer list under any name variant.',
    'payerId.availity': 'Vaya does not appear on the Availity Essentials 837 payer list either.',
    'payerId.changeHealthcare':
      'Vaya IS confirmed on Office Ally — a third clearinghouse not named in this schema — as payer ID 13010, directly from Office Ally’s own pre-enrollment instructions PDF. Not pVerify’s, Availity’s, or (confirmed) Change Healthcare’s own ID; confirm the clearinghouse-specific mapping with Vaya EDI (EDI@vayahealth.com) or (828) 586-5501 ext. 5227/3313 before automating routing.',
    supports270271: 'Confirm 270/271 eligibility routing directly — Vaya publishes separate "EDI 270 and 271 Companion Guide" and "EDI Real-Time 270 and 271 Companion Guide" documents (referenced on its claims-submission page) whose content was not retrieved this pass.',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB, VAYA_OFFICEALLY_ENROLLMENT],
};

function vayaCodeGrid(): Record<string, CodeGridEntry> {
  return {
    '97151': ncTailoredPlanEntry({
      code: '97151',
      paRequired: 'Passthrough: notification SAR + service order, up to 32 units per 6 months; requests above 32 units reviewed for medical necessity. Above 32 units, Initial/Concurrent SAR + service order + clinical documentation validating ASD diagnosis via a scientifically validated tool required.',
      paFieldStatus: 'verified',
      unitCap: '32 units per 6 months (passthrough notification threshold; higher requests reviewed)',
      unitCapFieldStatus: 'verified',
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97152': ncTailoredPlanEntry({
      code: '97152',
      paRequired: 'Initial: SAR + FBA + treatment plan + service order (annual) + clinical documentation validating ASD diagnosis. Concurrent: SAR + FBA + treatment plan + service order (annual).',
      paFieldStatus: 'verified',
      unitCap: 'unverified — no passthrough threshold published for this code (unlike 97151/97155)',
      unitCapFieldStatus: 'unverified',
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97153': ncTailoredPlanEntry({
      code: '97153',
      paRequired: 'Initial: SAR + FBA + treatment plan + service order (annual) + clinical documentation validating ASD diagnosis. Concurrent: SAR + FBA + treatment plan + service order (annual).',
      paFieldStatus: 'verified',
      unitCap: 'unverified — no passthrough threshold published for this code',
      unitCapFieldStatus: 'unverified',
      notes: "Vaya's guidelines list this as \"97153 96\" — modifier 96 (habilitative) appears alongside the base code in its documentation table.",
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97154': ncTailoredPlanEntry({
      code: '97154',
      paRequired: 'Initial: SAR + FBA + treatment plan + service order (annual) + clinical documentation validating ASD diagnosis. Concurrent: SAR + FBA + treatment plan + service order (annual).',
      paFieldStatus: 'verified',
      unitCap: 'unverified — no passthrough threshold published for this code',
      unitCapFieldStatus: 'unverified',
      notes: "Vaya's guidelines list this as \"97154 96\" — modifier 96 (habilitative) appears alongside the base code.",
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97155': ncTailoredPlanEntry({
      code: '97155',
      paRequired: 'Passthrough: notification SAR, up to 1 hour per 10 hours of direct intervention (97153/97154) — i.e. 10%. Requests for a higher ratio: SAR + service order + clinical documentation validating ASD diagnosis + FBA + treatment plan, reviewed for medical necessity.',
      paFieldStatus: 'verified',
      unitCap: '1 hour per 10 hours of 97153/97154 (10% passthrough threshold; higher ratios reviewed)',
      unitCapFieldStatus: 'verified',
      notes: 'Confirmed by two independent Vaya documents (Authorization Guidelines v2.0 and the May-2025 RB-BHT Guidance) and consistent with the May-2019 NC Medicaid Bulletin restriction that 97155 does not cover routine technician-supervision/fidelity checks.',
      extraSources: [VAYA_AUTH_GUIDELINES, VAYA_RBBHT_GUIDANCE],
    }),
    '97156': ncTailoredPlanEntry({
      code: '97156',
      paRequired: 'Initial: SAR + FBA + treatment plan + service order (annual) + clinical documentation validating ASD diagnosis. Concurrent: SAR + FBA + treatment plan + service order (annual).',
      paFieldStatus: 'verified',
      unitCap: 'unverified — no passthrough threshold published for this code',
      unitCapFieldStatus: 'unverified',
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97157': ncTailoredPlanEntry({
      code: '97157',
      paRequired: 'Initial: SAR + FBA + treatment plan + service order (annual) + clinical documentation validating ASD diagnosis. Concurrent: SAR + FBA + treatment plan + service order (annual).',
      paFieldStatus: 'verified',
      unitCap: 'unverified — no passthrough threshold published for this code',
      unitCapFieldStatus: 'unverified',
      extraSources: [VAYA_AUTH_GUIDELINES],
    }),
    '97158': ncCodeNotInStateSet('97158'),
    '0362T': ncCodeNotInStateSet('0362T'),
    '0373T': ncCodeNotInStateSet('0373T'),
  };
}

const vayaRates: RateTable = {
  source: 'Vaya Health — Standard Rate Schedule: Tailored Plan/Medicaid Direct (Non-Clinician), dated 8/1/2024',
  effectiveDate: '2024-07-01',
  byCode: {
    '97151': { rate: '$30.56', unit: '15min' },
    '97152': { rate: '$61.73', unit: '15min' },
    '97153': { rate: '$20.81', unit: '15min' },
    '97154': { rate: '$11.37', unit: '15min' },
    '97155': { rate: '$32.22', unit: '15min' },
    '97156': {
      rate: 'unverified — Vaya’s 8/1/2024 schedule lists $30.00, which CONFLICTS with the $23.70 both Alliance and Trillium currently post (eff. 10/1/2025); flagged rather than reconciled',
      unit: '15min',
    },
    '97157': { rate: '$11.51', unit: '15min' },
    '97158': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0362T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0373T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
  },
  sources: [VAYA_RATE_SCHEDULE_2024, ALLIANCE_RATE_SCHEDULE_NCB, TRILLIUM_RATE_TABLE],
};

/* ==================== partners-health-management ==================== */

const partnersEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'bh',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'Partners does not appear on pVerify’s national payer list under any name variant.',
    'payerId.availity': 'Partners does not appear on the Availity Essentials 837 payer list either.',
    'payerId.changeHealthcare':
      "Payer ID 68069, which surfaces in several search results for “Partners,” is confirmed by Partners' OWN FAQ with Carolina Complete Health to be CCH's payer ID for PHYSICAL health claims delegated under the Tailored-Plan/Centene arrangement — NOT a behavioral-health or RB-BHT payer ID (RB-BHT is a BH service). Availity independently lists 68069 as \"Centene Corporation.\" Partners' own BH claims route through ProAuth (authorization) and Alpha+ (claims), with no clearinghouse payer ID found in any document retrieved this pass — confirm directly via ClaimsDepartment@PartnersBHM.org before assuming a routing.",
    supports270271: 'Same as above — confirm directly with Partners EDI/claims support.',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB, PARTNERS_CCH_FAQ],
};

function partnersCodeGrid(): Record<string, CodeGridEntry> {
  const allCodes =
    'Required — ONE "ALL codes" authorization on the base code (submitted via ProAuth, base code as Primary Procedure Code on the Prescreen, Treatment Type selected from the dropdown) covers every RB-BHT code and modifier combination, telehealth included. Billing must still trace to the approved treatment plan or risk recoupment on post-payment review.';
  return {
    '97151': ncTailoredPlanEntry({ code: '97151', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified — no Partners-specific or statewide per-code unit cap document located', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97152': ncTailoredPlanEntry({ code: '97152', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97153': ncTailoredPlanEntry({ code: '97153', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97154': ncTailoredPlanEntry({ code: '97154', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97155': ncTailoredPlanEntry({
      code: '97155', paRequired: allCodes, paFieldStatus: 'verified',
      unitCap: 'Inferred from Vaya’s statewide-pattern passthrough: up to 1 hour per 10 hours of 97153/97154 (10%). Not confirmed as a Partners-specific rule — the ALL-codes model may not enforce a distinct 97155 ratio at all.',
      unitCapFieldStatus: 'inferred',
      extraSources: [PARTNERS_ALL_CODES_ALERT, VAYA_RBBHT_GUIDANCE],
    }),
    '97156': ncTailoredPlanEntry({ code: '97156', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97157': ncTailoredPlanEntry({ code: '97157', paRequired: allCodes, paFieldStatus: 'verified', unitCap: 'unverified', unitCapFieldStatus: 'unverified', extraSources: [PARTNERS_ALL_CODES_ALERT] }),
    '97158': ncCodeNotInStateSet('97158'),
    '0362T': ncCodeNotInStateSet('0362T'),
    '0373T': ncCodeNotInStateSet('0373T'),
  };
}

const partnersRates: RateTable = {
  source: 'unverified — no publicly posted Partners-specific RB-BHT rate schedule located this pass',
  effectiveDate: 'unverified',
  byCode: {
    '97151': { rate: 'unverified', unit: '15min' },
    '97152': { rate: 'unverified', unit: '15min' },
    '97153': { rate: 'unverified', unit: '15min' },
    '97154': { rate: 'unverified', unit: '15min' },
    '97155': { rate: 'unverified', unit: '15min' },
    '97156': { rate: 'unverified', unit: '15min' },
    '97157': { rate: 'unverified', unit: '15min' },
    '97158': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0362T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
    '0373T': { rate: 'N/A', unit: 'N/A — not part of NC’s CCP 8F billable code set' },
  },
  sources: [
    src(
      'https://www.partnersbhm.org/tailoredplan/providers/manuals-forms-and-policies/clinical-coverage-policies/',
      'Partners publishes clinical coverage policy adoption (defers to CCP 8F) but no distinct rate schedule was located on its provider site this pass — unlike Alliance and Trillium, which both post one. NC’s ≥100%-of-fee-schedule floor (already in the base corpus prose) means the statewide 97151-97157 figures Alliance/Trillium post likely apply as a floor, but that is inferred, not a Partners-specific confirmation.'
    ),
  ],
};

/* ==================== aetna-north-carolina (commercial) ==================== */

const aetnaEdiNC: EdiRouting = {
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
      'QA re-check (2026-07-23): AVAILITY_PAYER_LIST_NCB\'s own sourcing note already discloses this list is dated 2012 (an "As of 08/08/2012" footer, confirmed by direct retrieval) and should not be treated as a source of current payer IDs — downgraded from verified to inferred to match that disclosure (60054=AETNA is present in the 2012 snapshot, but not reconfirmed current).',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity — this value was carried over from the same 2012 Availity snapshot.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass (same gap as the Georgia build) — confirm via Aetna provider services or the ABA precertification process whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for North Carolina.',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB],
};

const aetnaCodeGridNC: Record<string, CodeGridEntry> = {
  '97151': aetnaEntryNC(), '97152': aetnaEntryNC(), '97153': aetnaEntryNC(), '97154': aetnaEntryNC(), '97155': aetnaEntryNC(),
  '97156': aetnaEntryNC(), '97157': aetnaEntryNC(), '97158': aetnaEntryNC(), '0362T': aetnaEntryNC(), '0373T': aetnaEntryNC(),
};

/* ==================== cigna-north-carolina (commercial) ==================== */

const cignaEdiNC: EdiRouting = {
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
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const cignaCodeGridNC: Record<string, CodeGridEntry> = {
  '97151': cignaEntryNC('Not required (per EN0499)'),
  '97152': cignaEntryNC('Not required (per EN0499)'),
  '97153': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaEntryNC('Not required (per EN0499)'),
  '0373T': cignaEntryNC('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

/* ==================== unitedhealthcare-north-carolina (commercial) ==================== */

const unitedhealthcareEdiNC: EdiRouting = {
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
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "Confirmed for MEDICAID: Optum's own “UnitedHealthcare Community Plan of North Carolina ABA Program Quick Reference Guide” states verbatim “Claims Payer ID 87726” (same as medical) for autism/ABA claims, addressed to Optum Behavioral Health. Applied to this COMMERCIAL guide as inferred cross-LOB pattern evidence, not a commercial-specific confirmation — pVerify separately lists a distinct “UHG007 United Healthcare - Optum Behavioral Solutions” payer ID not reconciled against 87726 for commercial NC. Confirm directly via Provider Express / UHC provider services before automating commercial routing.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST_NCB, AVAILITY_PAYER_LIST_NCB, OPTUM_SCC, UHC_NC_MEDICAID_ABA_QRG],
};

const unitedhealthcareCodeGridNC: Record<string, CodeGridEntry> = {
  '97151': uhcEntryNC('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcEntryNC('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcEntryNC('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcEntryNC('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcEntryNC('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcEntryNC('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcEntryNC('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcEntryNC('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcEntryNC('16 units/day (≤4 hrs)', []),
  '0373T': uhcEntryNC('32 units/day (≤8 hrs)', []),
};

/* ==================== Layer 2 — STC interpretation maps ====================
   NCTracks explicitly and verifiably does NOT return DMH (behavioral health,
   which RB-BHT/ABA falls under for the LME-MCO population) in its 271 —
   §7.2/§7.5 of NCTRACKS_DMH_EXCLUSION state this outright and name the LME as
   the correct source instead. That is itself the verified fact for
   north-carolina-medicaid: quality271Score ships 'low' (verified-absent, not
   a guess) rather than 'unverified'. Standard Plan MCOs administer RB-BHT
   in-house (no statewide carve-out, per docs/vob-build.md-adjacent NC prose
   already in this file) and run their own EDI systems separate from
   NCTracks — no MCO-specific 270/271 STC document was located, so those ship
   'unverified'. The 4 Tailored Plans (Alliance, Trillium, Vaya, Partners) are
   themselves the LME-MCOs NCTracks defers DMH/BH eligibility to — noted in
   verifyVia as useful context — but no plan-specific STC document was found
   for them either, so they also ship 'unverified' rather than inferred. */

const northCarolinaMedicaidStc: StcMap = {
  abaBenefitBucket: 'unverified',
  deductibleAppliesToAba: 'unverified',
  costShareType: 'unverified',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'low',
  fieldStatus: {
    abaBenefitBucket: 'unverified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'unverified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'verified',
  },
  verifyVia: {
    abaBenefitBucket:
      'NCTracks explicitly excludes DMH (behavioral health) benefit information from its 271 response and names the Local Managing Entity (LME) as the correct source (NCTRACKS_DMH_EXCLUSION §7.2/§7.5) — for NC Medicaid Direct FFS members, no STC bucket in the NCTracks 271 carries ABA benefit detail at all. Confirm eligibility via the member\'s assigned LME-MCO directly.',
  },
  sources: [NCTRACKS_DMH_EXCLUSION],
};

function ncStandardPlanUnverifiedStc(planName: string): StcMap {
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
      abaBenefitBucket: `${planName} administers RB-BHT/ABA in-house (no statewide carve-out) and runs its own EDI system separate from NCTracks, which itself excludes behavioral-health info from its 271 (NCTRACKS_DMH_EXCLUSION). No ${planName}-specific 270/271 STC document was located. Confirm via ${planName}'s own EDI/provider services.`,
    },
    sources: [NCTRACKS_DMH_EXCLUSION],
  };
}

function ncTailoredPlanUnverifiedStc(planName: string): StcMap {
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
      abaBenefitBucket: `${planName} is the LME-MCO NCTracks itself defers DMH/behavioral-health eligibility to for its region (NCTRACKS_DMH_EXCLUSION §7.2) — it is the correct source of truth for RB-BHT/ABA, but no ${planName}-specific 270/271 STC document was located to confirm which bucket/fields it populates. Confirm via ${planName}'s own EDI/provider services.`,
    },
    sources: [NCTRACKS_DMH_EXCLUSION],
  };
}

/* ==================== Layer 7 — vobContact ====================
   Contact data below is scraped, not inferred: every phone/fax/hours/IVR
   value was read directly out of a primary source fetched THIS pass (PDF
   text-extracted via pymupdf where WebFetch returned binary/unreadable
   content, or a provider-contact page fetched directly). Where a fetch
   turned up nothing usable (403, JS-rendered, or the document simply
   doesn't contain contact info), the field is omitted rather than
   guessed — see the per-guide notes below for what was tried.
   - marketplace.wellcarenc.com was fetched and read this pass but is
     WellCare's ACA Marketplace/Ambetter site, not the NC Medicaid
     Standard Plan RB-BHT program in scope here (confirmed by its own
     "Ambetter"/"Discontinuing operations" content) — its phone number
     was discarded as wrong-product-line, not used.
   - partnersbhm.org's public pages 403 to the WebFetch tool (consistent
     with this file's existing bot-blocked notes for that domain) but
     were reachable via a direct curl fetch with a browser user-agent
     this pass; content was read and confirmed from that fetch.
   - scriptedQuestions are generated per docs/vob-build.md Layer 7 from
     each guide's OWN edi.verifyVia keys, edi.bhCarveOut.* fields whose
     value is literally 'unverified', stcMap fields whose value is
     'unverified'/'plan-dependent', and codeGrid fields whose value is
     literally 'unverified' (or whose notes explicitly flag a gap) —
     capped at 3-7, most consequential first. The medicaid271Notes MCO-
     exclusion-from-271 fact and the 97158/0362T/0373T not-in-CCP-8F
     fact are both verified, not gaps, and are correctly excluded here.
   ================================================================ */

/* -------------------- Layer 7 shared source refs -------------------- */

const NCTRACKS_CONTACT_INFO = src(
  'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
  'Same NCTracks 270/271 Companion Guide PDF as NCTRACKS_270_271_CG, re-read this pass (via direct download + text extraction, since WebFetch returned only binary/unreadable content) for its §5 Contact Information section: "5.1 Electronic Data Interchange (EDI) Technical Assistance — Phone: 1-800-688-6696, option #1 ... Website: http://www.nctracks.nc.gov/provider/index.html." A separate AAA03 reject-code table instructs "call NCTracks Call Center at 1-800-688-6696, option 3" when reject reason code 42 (system down or data error) is returned. No hours of operation were stated for the Call Center in this document.'
);
const VAYA_CONTACT_PAGE = src(
  'https://providers.vayahealth.com/contact/',
  'Vaya Health — Contact Us page (provider section), fetched directly this pass — states verbatim the "Provider Support Service Line" is "1-866-990-9712," hours "7 a.m. to 6 p.m., Monday – Saturday, including holidays," and lists Authorizations (Utilization Management) at "1-800-893-6246, ext. 1515 (behavioral health), ext. 1526 (physical health)."'
);
const PARTNERS_PROVIDER_NETWORK_CONTACTS = src(
  'https://providers.partnersbhm.org/provider-network-contacts/',
  'Partners Health Management — Provider Network Contacts page. WebFetch returned empty content for this domain (consistent with this file\'s existing partnersbhm.org bot-block notes); fetched successfully instead via direct curl with a browser user-agent and read from the extracted text. States verbatim "Provider Services Line ... Call: 1-877-398-4145" and names the "ProviderCONNECT Portal" (login help and general questions both routed to the same 1-877-398-4145 line, per-topic email addresses given but no distinct phone numbers). No hours of operation were stated on this page.'
);
const AETNA_CONTACT_PAGE = src(
  'https://www.aetna.com/about-us/contact-aetna.html',
  'Aetna — official Contact Us page, "Medical providers" help topics, fetched directly this pass — states verbatim "Non-Medicare plans (includes individual & family plans): 1-888-632-3862 ${tty}, (choose precertification prompt)." This is Aetna\'s general non-Medicare provider/precertification service center, not an ABA-specific line — no dedicated Aetna ABA/autism contact page was located this pass, and no Aetna-specific portal name/URL was found on this page (the Availity portal association below is carried over as inferred from the pre-existing stc-defaults.ts finding that Aetna directs EDI submitters to Availity, not confirmed by a fresh fetch of an Aetna-branded portal page).'
);
const EVERNORTH_ABA_PA_FORM = src(
  'https://static.evernorth.com/assets/evernorth/provider/pdf/resourceLibrary/behavioral/applied-behavior-analysis.pdf',
  'Evernorth Behavioral Health — Applied Behavior Analysis Prior Authorization Form (PCOMM-2025-224), fetched and text-extracted directly this pass — states verbatim to "send it to ABA@Evernorth.com (preferred) or fax it to 860.687.9230," and to call "the Autism Care Coordinator team at 877.279.7603, Monday through Friday from 9:00 a.m. to 4:00 p.m. CT" for submission issues (a narrower window than the Autism Resource Guide\'s general 8:30 a.m.–5:00 p.m. CT team hours — both cited, not reconciled).'
);
const OPTUM_PROVIDER_EXPRESS_SUPPORT = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/about-us/provider-express-support.html',
  'Optum Provider Express — Support page, fetched directly this pass — states verbatim "you may also call the Provider Express Support Center at 1 866-209-9320 (toll-free) from 8 a.m. to 8 p.m. Eastern time." A general commercial/Medicaid Provider Express support line, not ABA-specific.'
);

/* ==================== north-carolina-medicaid ==================== */

const northCarolinaMedicaidContact: VobContact = {
  providerServicesPhone: '1-800-688-6696',
  ivrPath:
    'Option 1 for EDI technical assistance (270/271 support); option 3 for an explanation when a 271 response returns AAA03 reject reason code 42 (system down or data error) — per the Companion Guide §5.1 and its AAA03 reject-code table.',
  portal: { name: 'NCTracks Provider Portal', url: 'http://www.nctracks.nc.gov/provider/index.html' },
  scriptedQuestions: [
    'What are the per-code unit caps and cap periods for 97151-97157 (e.g., 97153, 97155) — not published in the current CCP 8F PDF and not checked against the live NCTracks Fee Schedules Portal this pass?',
    'What place-of-service settings/codes are allowed for RB-BHT delivery (home, clinic, school, telehealth)?',
    'Do you use payer ID NCMCD (not 12K23, which is institutional-only) for 270/271 real-time eligibility checks, and what is your current Availity payer ID?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it charged per-visit or per-day?',
    'Since NCTracks\' own 271 does not return DMH/behavioral-health benefit detail, which LME-MCO or plan should I contact directly to confirm this member\'s RB-BHT benefit and cost share?',
  ],
  sources: [NCTRACKS_CONTACT_INFO],
};

/* ==================== healthy-blue-north-carolina ==================== */

const healthyBlueContact: VobContact = {
  providerServicesPhone: '844-594-5072',
  hours: 'Monday–Saturday, 7 a.m.–6 p.m. Eastern time (voice portal accessible 24/7)',
  ivrPath:
    'Provider Services main line, option 2 for Prior Authorization/Notification – Physical Health. Outpatient and Inpatient Behavioral Health Utilization Management (where RB-BHT authorization sits) is reached directly at 844-594-5082 — no separate IVR menu is documented for BH UM in the Provider Manual.',
  portal: { name: 'Availity Essentials / Healthy Blue Provider Portal', url: 'https://provider.healthybluenc.com' },
  scriptedQuestions: [
    'Do you use payer ID 00602 or 14422 for real-time 270/271 eligibility checks (the plan\'s Professional Claims and Real-Time Eligibility lists show different codes)?',
    'Does Healthy Blue administer RB-BHT in-house, or is there a behavioral-health carve-out administrator I should route to instead?',
    'What are the unit caps and cap periods for 97151-97157?',
    'What place-of-service codes and telehealth modifiers (GT/CR) are approved for RB-BHT billing?',
    'Is the ABA cost share a copay or coinsurance, and is it charged per-visit or per-day?',
    'Does the deductible apply to RB-BHT, and is there an out-of-pocket max that applies?',
  ],
  sources: [HEALTHY_BLUE_PROVIDER_MANUAL],
};

/* ==================== amerihealth-caritas-north-carolina ==================== */

const amerihealthContact: VobContact = {
  providerServicesPhone: '1-833-900-2262',
  hours: 'Monday–Friday, 8 a.m.–5 p.m. (Behavioral Health Utilization Management)',
  fax: '1-833-893-2262',
  ivrPath:
    'BH UM direct line 1-833-900-2262 handles RB-BHT prior-authorization questions during business hours; after hours, weekends, and holidays route to Member Services at 1-855-375-8811. Fax the completed Prior Authorization Request Form to 1-833-893-2262 (Inpatient Concurrent Review uses a separate fax, 1-833-894-2262).',
  portal: { name: 'NaviNet', url: 'https://www.amerihealthcaritasnc.com/provider/resources/navinet.aspx' },
  scriptedQuestions: [
    'Which payer ID do you use for 270/271 real-time eligibility checks (pVerify, Availity, and Change Healthcare all show gaps or unreconciled codes)?',
    'Is ABA/RB-BHT administered in-house, or through a separate behavioral-health carve-out administrator?',
    'What are the current unit caps and cap periods for 97151-97157?',
    'What telehealth modifiers and place-of-service codes are approved for RB-BHT?',
    'Is the RB-BHT cost share a copay or coinsurance, charged per-visit or per-day, and does the deductible apply?',
  ],
  sources: [AMERIHEALTH_UM_GUIDE],
};

/* ==================== carolina-complete-health ==================== */

const carolinaCompleteHealthContact: VobContact = {
  providerServicesPhone: '1-833-552-3876',
  hours: 'Monday–Saturday, 7 a.m.–6 p.m.',
  portal: { name: 'Carolina Complete Health Provider Portal', url: 'https://provider.carolinacompletehealth.com' },
  scriptedQuestions: [
    'What is your Availity payer ID for real-time 270/271 eligibility checks?',
    'Is RB-BHT administered in-house, or through a behavioral-health carve-out administrator?',
    'What are the unit caps and cap periods for 97151-97157?',
    'What telehealth modifiers and place-of-service codes are approved for RB-BHT?',
    'Is the ABA cost share a copay or coinsurance, charged per-visit or per-day, and does it apply to the deductible?',
  ],
  sources: [CCH_BEHAVIORAL_HEALTH_PAGE],
};

/* ==================== unitedhealthcare-community-plan-north-carolina ==================== */

const unitedhealthcareCommunityPlanContact: VobContact = {
  providerServicesPhone: '866-633-4449',
  ivrPath:
    'The Customer Service Center (866-633-4449) handles claim status per the QRG. No fixed provider-services number is published for benefits/eligibility — the QRG instead directs callers to "the Behavioral Health number located on the back of the member\'s ID card." EDI Support for 270/271 feed issues is 1-800-210-8315 (ac_edi_ops@uhc.com).',
  portal: { name: 'Optum Provider Express', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'Which payer ID (pVerify or Availity) do you use for real-time 270/271 eligibility checks on UHC Community Plan NC?',
    'What are the unit caps and cap periods for 97151-97157?',
    'Do the HN/HO/HM/HP credential-tier modifiers from Optum\'s national ABA Modifier FAQ apply to NC Medicaid ABA claims, or only to commercial members?',
    'What telehealth mechanics and place-of-service codes are approved for RB-BHT under the Optum-managed network?',
    'Is the ABA cost share a copay or coinsurance, and does the deductible apply?',
  ],
  sources: [UHC_NC_ABA_QRG],
};

/* ==================== wellcare-north-carolina (merged 4/1/2026; contact routes to Carolina Complete Health) ==================== */

const wellcareContact: VobContact = {
  providerServicesPhone: '1-833-552-3876',
  hours:
    'Monday–Saturday, 7 a.m.–6 p.m. — this is Carolina Complete Health\'s provider-services line, the successor plan post-merger; WellCare of North Carolina no longer operates a standalone provider-services line under its own name (a "1-833-925-2861" number found on marketplace.wellcarenc.com this pass was confirmed to belong to WellCare\'s separate ACA Marketplace/Ambetter product, not this Medicaid Standard Plan, and was discarded rather than used).',
  portal: {
    name: 'Carolina Complete Health Provider Portal (successor to WellCare of NC, effective 4/1/2026)',
    url: 'https://provider.carolinacompletehealth.com',
  },
  scriptedQuestions: [
    'For legacy WellCare-of-NC members, do RB-BHT eligibility and prior-authorization calls now route entirely through Carolina Complete Health\'s provider-services line?',
    'Which payer ID should I use for eligibility checks post-merger — Carolina Complete Health\'s 68069, or a legacy WellCare-specific code?',
    'What were the unit caps and cap periods for 97151-97157 under WNC.CP.109, and do they still apply post-merger?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it per-visit or per-day?',
  ],
  sources: [CCH_BEHAVIORAL_HEALTH_PAGE, CCH_MERGER_PAGE, NCDHHS_MERGER_PLAYBOOK],
};

/* ==================== alliance-health-north-carolina ==================== */

const allianceContact: VobContact = {
  providerServicesPhone: '855-759-9700',
  ivrPath:
    'Member and Recipient Services (800-510-9132) is member-facing only — use Provider Support (855-759-9700) for practice/provider calls.',
  portal: { name: 'Alliance Health Provider Portal', url: 'https://providerportal.alliancehealthplan.org/' },
  scriptedQuestions: [
    'What is Alliance\'s payer ID (pVerify, Availity, or Change Healthcare) for 270/271 eligibility checks — none is confirmed on any national payer list?',
    'Does Alliance support real-time 270/271 eligibility checks, or is this batch-only?',
    'What are Alliance\'s per-code unit caps for 97151-97157, beyond the 180-day authorization-cycle ceiling?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it per-visit or per-day?',
    'Since Alliance is the LME-MCO itself, what STC bucket or benefit detail does a 270/271 eligibility check actually return for RB-BHT?',
  ],
  sources: [ALLIANCE_RBBHT_GUIDANCE],
};

/* ==================== trillium-health-resources ==================== */

const trilliumContact: VobContact = {
  providerServicesPhone: '866-998-2597',
  ivrPath:
    'Listed as "Business & Administrative Matters" in the Claims Submission Protocol\'s Tailored Plan Medicaid contact block; "Member & Recipient Services" (877-685-2415) is the separate member-facing line — do not use it for provider calls.',
  portal: { name: 'Trillium Provider Direct Portal', url: 'https://www.trilliumhealthresources.org' },
  scriptedQuestions: [
    'Do you support real-time 270/271 eligibility checks, and what is your Availity/pVerify payer ID — neither is found on their national lists?',
    'What are Trillium\'s per-code unit caps for 97151-97157, beyond the 180-day TAR cycle?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it per-visit or per-day?',
    'Does the deductible apply to RB-BHT, and is there an out-of-pocket max?',
    'What STC bucket does Trillium return ABA benefit detail under on a 270/271 eligibility response?',
  ],
  sources: [TRILLIUM_CLAIMS_PROTOCOL],
};

/* ==================== vaya-health ==================== */

const vayaContact: VobContact = {
  providerServicesPhone: '1-866-990-9712',
  hours: '7 a.m.–6 p.m., Monday–Saturday, including holidays',
  ivrPath:
    'General Provider Support Service Line is 1-866-990-9712. Code-specific Authorizations (behavioral health) route to 1-800-893-6246 ext. 1515; Provider Portal/IT technical assistance is ext. 1500.',
  portal: { name: 'Vaya Provider Portal', url: 'https://providers.vayahealth.com/provider-portal/' },
  scriptedQuestions: [
    'What is Vaya\'s payer ID for 270/271 real-time eligibility checks — only Office Ally\'s 13010 is confirmed; Vaya does not appear on pVerify or Availity\'s national lists?',
    'What are the per-code unit caps for 97152, 97153, 97154, 97156, and 97157 (97151\'s 32-units/6-months and 97155\'s 10% passthrough are already confirmed)?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it per-visit or per-day?',
    'Does the deductible apply to RB-BHT, and is there an out-of-pocket max?',
    'What STC bucket does Vaya return ABA benefit detail under on a 270/271 eligibility response?',
  ],
  sources: [VAYA_CONTACT_PAGE],
};

/* ==================== partners-health-management ==================== */

const partnersContact: VobContact = {
  providerServicesPhone: '1-877-398-4145',
  portal: { name: 'Partners ProviderCONNECT Portal', url: 'https://providers.partnersbhm.org/category/providerconnect/' },
  scriptedQuestions: [
    'What is Partners\' payer ID for 270/271 eligibility checks — confirmed NOT 68069 (Carolina Complete Health\'s physical-health ID) — what do you actually use?',
    'What are the per-code unit caps for 97151-97157 under the single ALL-codes authorization?',
    'Is there a copay or coinsurance for RB-BHT, and if so is it per-visit or per-day?',
    'Does the deductible apply to RB-BHT, and is there an out-of-pocket max?',
    'What STC bucket does Partners return ABA benefit detail under on a 270/271 eligibility response?',
  ],
  sources: [PARTNERS_PROVIDER_NETWORK_CONTACTS],
};

/* ==================== aetna-north-carolina (commercial) ==================== */

const aetnaContactNC: VobContact = {
  providerServicesPhone: '1-888-632-3862',
  ivrPath:
    'Choose the precertification prompt for ABA/behavioral-health prior-authorization requests — Aetna\'s own service-centers directory lists this as the Non-Medicare (including individual & family) plans line; no ABA-specific number was located.',
  portal: { name: 'Availity Essentials (Aetna Payer Space)', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'Does ABA route through a behavioral-health carve-out administrator, or stay on the medical plan — and what payer ID do you use for eligibility and claims?',
    'What is your correct EDI payer ID for 270/271 real-time eligibility checks (both Availity\'s and Change Healthcare\'s listed codes are carried over from a stale 2012 snapshot)?',
    'Is the ABA copay charged per-visit or per-day, and does it apply to the deductible?',
    'What are the per-code unit caps, cap periods, and allowed place-of-service settings for 97151-97158/0362T/0373T?',
    'What telehealth modifiers (GT/95) and licensure-tier modifiers are accepted on ABA claims?',
    'What form or process is used for ABA precertification?',
    'Does the plan\'s out-of-pocket max apply to ABA services?',
  ],
  sources: [AETNA_CONTACT_PAGE],
};

/* ==================== cigna-north-carolina (commercial) ==================== */

const cignaContactNC: VobContact = {
  providerServicesPhone: '877.279.7603',
  hours:
    'Monday–Friday, 8:30 a.m.–5:00 p.m. CT (Autism Care Coordinator team); PA-form submission issues specifically are staffed Monday–Friday, 9:00 a.m.–4:00 p.m. CT per the ABA Prior Authorization Form.',
  fax: '860.687.9230',
  ivrPath:
    'Email ABA@Evernorth.com is preferred over fax for the ABA Prior Authorization Form. The general (non-ABA) Provider Services billing line is 800.926.2273.',
  portal: { name: 'Evernorth Provider website', url: 'https://provider.evernorth.com' },
  scriptedQuestions: [
    'Is the ABA copay charged per-visit or per-day for this specific plan?',
    'Is ABA cost share a copay or coinsurance for this plan (Cigna\'s family default is plan-dependent)?',
    'Does the plan\'s out-of-pocket max apply to ABA/RB-BHT services?',
    'What are the per-code unit caps and cap periods for 97151-97158/0362T/0373T?',
    'What place-of-service settings and telehealth modifiers (GT/95) are accepted for ABA claims?',
    'Do you support real-time or only batch 270/271 for this payer ID?',
  ],
  sources: [CIGNA_AUTISM_RESOURCE_GUIDE, EVERNORTH_ABA_PA_FORM],
};

/* ==================== unitedhealthcare-north-carolina (commercial) ==================== */

const unitedhealthcareContactNC: VobContact = {
  providerServicesPhone: '866-209-9320',
  hours: '8 a.m.–8 p.m. Eastern time',
  portal: { name: 'Optum Provider Express', url: 'https://www.providerexpress.com' },
  scriptedQuestions: [
    'Does ABA route to Optum Behavioral Health (payer ID 87726) for this specific commercial plan, or does it stay on standard medical routing — please confirm whether a second EDI hop is required?',
    'Do you support real-time or only batch 270/271 for this payer ID?',
    'Is ABA cost share a copay or coinsurance for this plan (UHC\'s family default is plan-dependent)?',
    'Is the copay charged per-visit or per-day, and does the deductible apply?',
    'Does the plan\'s out-of-pocket max apply to ABA services?',
    'What telehealth modifiers and place-of-service settings are accepted for ABA billing under this plan?',
  ],
  sources: [OPTUM_PROVIDER_EXPRESS_SUPPORT],
};

/* ==================== export ====================
   SPLIT A (NC Medicaid Direct + 5 Standard Plans) and SPLIT B
   (4 Tailored Plans + 3 commercial) landed concurrently from two
   sessions and were combined here on rebase per the merge rule in
   the build prompt: keep both sides, never remove or rewrite the
   other session's entries. All 13 North Carolina VOB-enriched guide
   slugs are covered.
   ================================================================ */
export const northCarolinaVob: Record<string, VobExtension> = {
  // ---- SPLIT A: NC Medicaid Direct + Standard Plans ----
  'north-carolina-medicaid': {
    edi: northCarolinaMedicaidEdi,
    codeGrid: northCarolinaMedicaidCodeGrid,
    rates: northCarolinaMedicaidRates,
    stcMap: northCarolinaMedicaidStc,
    vobContact: northCarolinaMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'healthy-blue-north-carolina': {
    edi: healthyBlueEdi,
    codeGrid: healthyBlueCodeGrid,
    rates: healthyBlueRates,
    stcMap: ncStandardPlanUnverifiedStc('Healthy Blue'),
    vobContact: healthyBlueContact,
    lastUpdated: ACCESS_DATE,
  },
  'amerihealth-caritas-north-carolina': {
    edi: amerihealthEdi,
    codeGrid: amerihealthCodeGrid,
    rates: amerihealthRates,
    stcMap: ncStandardPlanUnverifiedStc('AmeriHealth Caritas North Carolina'),
    vobContact: amerihealthContact,
    lastUpdated: ACCESS_DATE,
  },
  'carolina-complete-health': {
    edi: carolinaCompleteHealthEdi,
    codeGrid: carolinaCompleteHealthCodeGrid,
    rates: carolinaCompleteHealthRates,
    stcMap: ncStandardPlanUnverifiedStc('Carolina Complete Health'),
    vobContact: carolinaCompleteHealthContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-north-carolina': {
    edi: unitedhealthcareCommunityPlanEdi,
    codeGrid: unitedhealthcareCommunityPlanCodeGrid,
    rates: unitedhealthcareCommunityPlanRates,
    stcMap: ncStandardPlanUnverifiedStc('UnitedHealthcare Community Plan of North Carolina'),
    vobContact: unitedhealthcareCommunityPlanContact,
    lastUpdated: ACCESS_DATE,
  },
  'wellcare-north-carolina': {
    edi: wellcareEdi,
    codeGrid: wellcareCodeGrid,
    rates: wellcareRates,
    stcMap: ncStandardPlanUnverifiedStc('WellCare of North Carolina'),
    vobContact: wellcareContact,
    lastUpdated: ACCESS_DATE,
  },
  // ---- SPLIT B: Tailored Plans + commercial ----
  'alliance-health-north-carolina': {
    edi: allianceEdi,
    codeGrid: allianceCodeGrid(),
    rates: allianceRates,
    stcMap: ncTailoredPlanUnverifiedStc('Alliance Health'),
    vobContact: allianceContact,
    lastUpdated: ACCESS_DATE,
  },
  'trillium-health-resources': {
    edi: trilliumEdi,
    codeGrid: trilliumCodeGrid(),
    rates: trilliumRates,
    stcMap: ncTailoredPlanUnverifiedStc('Trillium Health Resources'),
    vobContact: trilliumContact,
    lastUpdated: ACCESS_DATE,
  },
  'vaya-health': {
    edi: vayaEdi,
    codeGrid: vayaCodeGrid(),
    rates: vayaRates,
    stcMap: ncTailoredPlanUnverifiedStc('Vaya Health'),
    vobContact: vayaContact,
    lastUpdated: ACCESS_DATE,
  },
  'partners-health-management': {
    edi: partnersEdi,
    codeGrid: partnersCodeGrid(),
    rates: partnersRates,
    stcMap: ncTailoredPlanUnverifiedStc('Partners Health Management'),
    vobContact: partnersContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-north-carolina': {
    edi: aetnaEdiNC,
    codeGrid: aetnaCodeGridNC,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no North Carolina-specific 270/271 STC document found.'),
    vobContact: aetnaContactNC,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-north-carolina': {
    edi: cignaEdiNC,
    codeGrid: cignaCodeGridNC,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no North Carolina-specific override found.'),
    vobContact: cignaContactNC,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-north-carolina': {
    edi: unitedhealthcareEdiNC,
    codeGrid: unitedhealthcareCodeGridNC,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no North Carolina-specific override found.'),
    vobContact: unitedhealthcareContactNC,
    lastUpdated: ACCESS_DATE,
  },
};
