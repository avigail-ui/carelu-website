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
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const NCTRACKS_270_271_CG = src(
  'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
  'NCTracks Companion Guide, Health Care Eligibility Benefit Inquiry and Response (270/271) ASC X12N005010X279A1, version dated April 2025 — read in full. 2110C EB loop (EB05, Appendix A) carries managed-care PLAN-TYPE codes (Standard/Tailored/Carve-out/Health Choice variants); the specific MCO name/contact comes back dynamically in the 2120C NM1/PER loop, not from a fixed carrier-code table. Designed as a real-time, CAQH-CORE-compliant exchange (§1.2); eligibility inquiries may span up to 36 months history in 1-12 month segments, with Medicaid (DHB) allowing lookahead through the end of the next month.'
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
    paRequired: 'Required — PA required for ALL RB-BHT services, assessment included (CCP 8F Attachment A / Section 6.0)',
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
      MCCFS: 'Children & Families Specialty Plan',
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
      "Required — a two-step Optum authorization flow: a SEPARATE authorization for the ABA assessment, then a second for treatment (per the NC ABA Program Quick Reference Guide). This is a utilization-management sequence, not a claims-routing difference — both authorizations and claims run through the same Optum/UHC payer ID.",
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — the NC ABA Program QRG contains no telehealth mechanics for this code',
    modifiers: [
      'unverified — Optum\'s national ABA Modifier FAQ (HN/HO/HM/HP credential tiers) is explicitly scoped to "commercial members only" (BH4167b) and is NOT confirmed to apply to NC Medicaid claims; not applied here absent a Medicaid-specific document.',
    ],
    notes:
      'Claims (including the Optum BH carve-out) route on the SAME payer ID as medical (87726) — confirmed, no second EDI hop for claims. Verify via: Provider Express / (866) 209-9320.',
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

/* ==================== export ==================== */

export const northCarolinaVob: Record<string, VobExtension> = {
  'north-carolina-medicaid': {
    edi: northCarolinaMedicaidEdi,
    codeGrid: northCarolinaMedicaidCodeGrid,
    rates: northCarolinaMedicaidRates,
    lastUpdated: ACCESS_DATE,
  },
  'healthy-blue-north-carolina': {
    edi: healthyBlueEdi,
    codeGrid: healthyBlueCodeGrid,
    rates: healthyBlueRates,
    lastUpdated: ACCESS_DATE,
  },
  'amerihealth-caritas-north-carolina': {
    edi: amerihealthEdi,
    codeGrid: amerihealthCodeGrid,
    rates: amerihealthRates,
    lastUpdated: ACCESS_DATE,
  },
  'carolina-complete-health': {
    edi: carolinaCompleteHealthEdi,
    codeGrid: carolinaCompleteHealthCodeGrid,
    rates: carolinaCompleteHealthRates,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-north-carolina': {
    edi: unitedhealthcareCommunityPlanEdi,
    codeGrid: unitedhealthcareCommunityPlanCodeGrid,
    rates: unitedhealthcareCommunityPlanRates,
    lastUpdated: ACCESS_DATE,
  },
  'wellcare-north-carolina': {
    edi: wellcareEdi,
    codeGrid: wellcareCodeGrid,
    rates: wellcareRates,
    lastUpdated: ACCESS_DATE,
  },
};
