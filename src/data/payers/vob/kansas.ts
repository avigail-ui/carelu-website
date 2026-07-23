/* ================================================================
   VOB ENRICHMENT — Kansas, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec. Scope for this state: Medicaid
   lines only for Layer 4 (kansas-medicaid + its three KanCare MCOs)
   — commercial guides (aetna-kansas, cigna-kansas,
   unitedhealthcare-kansas) ship Layers 1+3 only.

   Sourcing notes (read before editing):
   - Kansas doesn't bill ABA under the standard CPT set. KanCare's
     autism benefit (CCTS + IIS under EPSDT) uses a subset: 97151,
     97152, 97155, 97156 were billable from the 1/1/2017 State Plan
     transition; 97153, 97154, and 97158 became additionally billable
     effective 7/1/2024 (per kansas.ts guide prose). 97157 and the
     Category III codes (0362T/0373T) are NOT part of Kansas's
     billable set — per the build spec's explicit instruction, this
     codeGrid ships exactly that 7-code set for kansas-medicaid,
     sunflower-health-plan-kansas, unitedhealthcare-community-plan-
     kansas, and healthy-blue-kansas, not the full CPT list forced
     from other states. Commercial KS guides (Aetna/Cigna/UHC) DO use
     the standard 10-code CPT set, since commercial ABA billing isn't
     tied to the KanCare CCTS/IIS structure.
   - The actual KMAP 270/271 Standard Companion Guide WAS located and
     is machine-readable this pass — not via the portal.kmap-state-
     ks.us public page (which redirects to an OAM/SSO login wall for
     every attempt, consistent with prior VOB-build sessions'
     experience with KMAP/BSRB portals), but via a direct document URL
     on the legacy www.kmap-state-ks.us host. It is Version 6.0, dated
     May 2, 2017 — the document itself states no later companion-guide
     revision exists in the 270/271 line, so this ships with
     staleRisk:true (>18 months old) rather than being treated as
     current, per the freshness rule. It gives the Loop 2110C /
     EB03=30 managed-care segment location but — like Georgia and
     Indiana — no numeric carrier-code table; MCOs are identified by a
     free-text EB05 description only.
   - Kansas Medicaid rates for the State Plan CCTS/IIS 9715x codes
     remain genuinely unverified beyond a stale 2019 anchor — this
     matches kansas.ts's own guide prose ("we won't quote current
     Kansas autism-services rates, because we couldn't verify them").
     This pass re-attempted the watchlist: the KMAP interactive fee
     lookup redirects to the same SSO wall as the companion-guide
     portal, and the FY2024/FY2025/FY2026 HCBS rate-increase bulletins
     (checked directly) cover only Brain Injury / Technology Assisted
     / I-DD HCBS waiver services plus the separate HCBS Autism waiver
     code T2040 — NOT the State Plan CCTS/IIS 9715x codes. No more-
     current State Plan rate was found. Layer 4 therefore ships mostly
     'unverified' for Kansas, which is the honest per-spec answer, not
     an incomplete pass.
   - National commercial payer IDs (Aetna 00001/60054, Cigna
     00004/62308, UnitedHealthcare 00192/87726) are reused verbatim
     from georgia.ts/indiana.ts: the SAME national pVerify/Availity
     entries, re-confirmed by direct re-fetch this pass.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const KMAP_COMPANION_GUIDE = src(
  'https://www.kmap-state-ks.us/Documents/EDI/2017-05_270-271-DXC.pdf',
  'KMAP Health Care Eligibility Benefit Inquiry and Response (270-271) Standard Companion Guide, Version 6.0, May 2, 2017 (DXC Technology, KDHE fiscal agent) — successfully retrieved directly (the portal.kmap-state-ks.us public-facing HIPAACompanionGuides page redirects to an OAM/SSO login wall). Loop 2110C, 12th Repetition (Managed Care): EB (Subscriber Eligibility/Benefit) segment, EB03 (Service Type Code)=30 interpreted by KMAP as "Managed care organization," EB05=Plan Coverage Description (free-text MCO name); no numeric carrier-code table. §4.2/§4.5: both secure-website batch submission and a dedicated real-time SFTP/VAN connection ("restricted to only eligibility requests at this point") are supported.',
  true
);
const KMAP_BULLETIN_17129 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-17129.html',
  'KMAP Bulletin 17129 — Additional State Plan Services (CCTS/IIS under EPSDT, eff. 1/1/2017); CCTS billed 97151/97152/97155/97156, IIS billed 97153.'
);
const KMAP_BULLETIN_18259 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-18259.html',
  'KMAP Bulletin 18259 — Mental Health/Autism CPT crosswalk, eff. 1/1/2019: 0359T→97151 at $17.50 per 15-minute unit. Last dated dollar figure located for any Kansas autism-services code.'
);
const KMAP_BULLETIN_19029 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html',
  'KMAP Bulletin 19029 — Rate Increase for Autism Services, eff. 4/1/2019; raises the 1/1/2019 crosswalk rates but does not publish the new dollar amounts in the bulletin text. Also states the CCTS 50 hrs/year and IIS 25 hrs/week initial-authorization soft limits.'
);
const KMAP_BULLETIN_22128 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-221280.html',
  'KMAP Bulletin 22128 — BH Services Rate Increase, eff. 7/1/2022 — explicitly does NOT include the 9715x autism codes.'
);
const KMAP_HCBS_FY2025 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-24116.html',
  'KMAP Bulletin — HCBS Rate Changes for Fiscal Year 2025 (eff. 7/1/2024), checked this pass for a current 9715x figure: covers only Brain Injury (BI), Technology Assisted (TA), and Intellectual/Developmental Disabilities (I/DD) HCBS waiver rates, plus HCBS Autism waiver code T2040 ($155.52/month, U2) — NOT the State Plan CCTS/IIS 9715x codes.'
);
const KMAP_HCBS_FY2026 = src(
  'https://www.sunflowerhealthplan.com/newsroom/kmap-25122.html',
  'KMAP Bulletin — Updated HCBS Rate Increase for Fiscal Year 2026 (eff. 7/1/2025), checked this pass: same BI/TA/I-DD HCBS-only scope as the FY2025 bulletin — no State Plan CCTS/IIS 9715x rate figures published.'
);
const KMAP_FEE_LOOKUP = src(
  'https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules',
  'KMAP interactive fee-schedule lookup — the stated source of truth for current rates, but redirects to an OAM/SSO login wall on every attempt this pass (same wall blocking the companion-guide portal page); not machine-accessible.',
  true
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 — re-fetched and parsed with layout-preserving extraction this pass.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — every page footer reads "As of 08/08/2012"; no Kansas Medicaid, Sunflower, KanCare, or Healthy Blue Kansas entry was found anywhere in this list (contrast with Indiana/Georgia, which have at least partial coverage).',
  true
);
const SUNFLOWER_KS_CP01 = src(
  'https://www.sunflowerhealthplan.com/content/dam/centene/sunflower/policies/clinical-policies/KS.CP.01-Applied-Behavioral-Analysis.pdf',
  'Sunflower KS.CP.01 — Applied Behavioral Analysis clinical policy; PA package detail (Autism Authorization Request Form, named assessment instruments, 6-month diagnosis-validation rule, Kan Be Healthy gate); no per-code unit-cap or modifier table published beyond the state CCTS/IIS soft limits.'
);
const OPTUM_KS_MEDICAID_CRITERIA = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum ABA State Mandates supplemental criteria, "For Kansas Medicaid member" section — 40 hrs/week individualized-plan ceiling, 6-month diagnosis validation, monthly CCTS progress review, 6-month renewal, exclusion list. No per-code unit-cap/modifier table.'
);
const UHC_KS_GETTING_STARTED = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ksABA/ksHowToAuth.pdf',
  'UHC/Optum "Getting started: KanCare members diagnosed with ASD" (BH00567_10102024) — commits to reimbursing at Kansas Medicaid autism-services rates; KMAP-first credentialing (~60 days).'
);
const HEALTHY_BLUE_KS_PA_PAGE = src(
  'https://www.healthybluekansas.com/provider/state-federal/resources/prior-authorization-requirements',
  'Healthy Blue Kansas — Prior Authorization Requirements page; Availity-based PA submission, BH outpatient fax 1-866-852-8978. No Kansas-specific ABA hour caps, review cadence, or code-level unit-cap/modifier table published — the biggest verification gap among the three KanCare MCOs (per kansas.ts guide prose).'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — national ABA clinical-necessity policy; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — national policy; 97151-97158 listed as covered if criteria met; no coding/reimbursement mechanics.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — national medical-necessity policy; no unit caps, POS codes, or telehealth modifiers published. Kansas has no Cigna Medicaid plan (Cigna cards are always commercial in KS).'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical claims nationally.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy; zero CPT codes in-document.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum national ABA Reimbursement Policy (2022RP501A) — max-daily-units and HN/HM/HO/HP modifier tiers per code; not Kansas-specific, applied here as 'inferred' absent a confirmed Kansas override."
);

/* -------------------- Layer 4: shared KanCare rate table -------------------- */
/* Kansas's State Plan CCTS/IIS rates for 9715x codes are genuinely unverified beyond
   the 2019 anchor (see file header). Reused across kansas-medicaid,
   sunflower-health-plan-kansas, unitedhealthcare-community-plan-kansas, and
   healthy-blue-kansas — UHC/Optum's own guide commits to paying "the Kansas Medicaid
   autism-services rates," so the same anchor/gap applies to it too. */
function kansasMedicaidRates(): RateTable {
  return {
    source:
      'KMAP interactive fee-schedule lookup is the stated source of truth but is not machine-accessible (SSO wall). Last dated anchor: KMAP Bulletin 18259 set 97151 at $17.50/15-min unit effective 1/1/2019; KMAP Bulletin 19029 raised rates effective 4/1/2019 without publishing amounts; the 7/1/2022 BH increase (Bulletin 22128) explicitly excluded 9715x codes; the FY2024/2025/2026 HCBS rate bulletins (checked this pass) cover only BI/TA/I-DD HCBS waiver services and the separate HCBS Autism waiver code T2040, not State Plan CCTS/IIS. Every code below except 97151 is unverified.',
    effectiveDate: '2019-01-01',
    byCode: {
      '97151': {
        rate: '$17.50 (stale 2019 anchor — raised 4/1/2019 by an unpublished amount; current figure unverified)',
        unit: '15min',
      },
      '97152': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
      '97153': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
      '97154': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
      '97155': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
      '97156': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
      '97158': { rate: 'unverified — pull from the KMAP interactive fee-schedule lookup', unit: '15min' },
    },
    sources: [KMAP_BULLETIN_18259, KMAP_BULLETIN_19029, KMAP_BULLETIN_22128, KMAP_HCBS_FY2025, KMAP_HCBS_FY2026, KMAP_FEE_LOOKUP],
  };
}

/* -------------------- codeGrid factories -------------------- */

/* Kansas's actual billable set for CCTS/IIS: 97151/97152/97155/97156 from 1/1/2017;
   97153/97154/97158 added 7/1/2024. No 97157, no 0362T/0373T — never force the CPT list. */
const CCTS_2024_CODES = new Set(['97153', '97154', '97158']);

function kansasMedicaidEntry(code: string, service: 'CCTS' | 'IIS' | 'CCTS or IIS', notes?: string): CodeGridEntry {
  const since2024 = CCTS_2024_CODES.has(code);
  return {
    covered: 'Yes',
    paRequired: 'Required — physician/licensed-practitioner recommendation + prior authorization, per MCO intake (KMAP Bulletin 17129)',
    unitCap: `Service-level, not per-code: CCTS soft limit 50 hrs/year; IIS initial authorization up to 25 hrs/week (more available on medical necessity). Billed under ${service}.`,
    capPeriod: 'CCTS: year (soft limit); IIS: week (initial authorization)',
    posAllowed: ['unverified'],
    telehealth: 'unverified — no telehealth modifier/POS detail published in KMAP bulletins reviewed this pass',
    modifiers: ['unverified — no KMAP modifier-tier table located (contrast with Indiana, which publishes one)'],
    notes: [
      notes,
      since2024
        ? 'Billable under this service effective 7/1/2024 — a later addition to the original 1/1/2017 CCTS/IIS code set.'
        : 'Billable under this service since the 1/1/2017 State Plan CCTS/IIS transition.',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [KMAP_BULLETIN_17129, KMAP_BULLETIN_19029],
  };
}

function inferredFromStatePattern(base: CodeGridEntry, verifyViaPortal: string): CodeGridEntry {
  return {
    ...base,
    notes: [base.notes, `Verify via: ${verifyViaPortal} — this plan's own published materials don't restate per-code unit caps or a modifier table beyond the state CCTS/IIS soft limits; the statewide KMAP pattern is applied here as inferred.`]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
  };
}

function aetnaEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (form GR-69017-4), per national CPB 0554',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are national medical-necessity policies only. Aetna no longer runs a KanCare Medicaid plan in Kansas (exited 1/1/2025) — every Aetna card in Kansas today is commercial.',
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
    notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a national medical-necessity policy only; no Kansas-specific coding/reimbursement mechanics published.',
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

function uhcCommercialEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: "Required — Optum ABA two-step authorization (assessment, then treatment); reviews every 4-6 months per the national UnitedHealthcare/Optum guide",
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes: "Unit caps/modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A), applied here as inferred absent a confirmed Kansas-specific override. Optum's Kansas-specific entry in the State Mandates supplement is a Medicaid-only section (governs unitedhealthcare-community-plan-kansas, not this commercial guide). Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY],
  };
}

/* ==================== kansas-medicaid ==================== */

const kansasMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00128', availity: 'unverified', changeHealthcare: 'unverified' },
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
      'Loop 2110C, 12th Repetition (Managed Care): EB (Subscriber Eligibility/Benefit Information) segment, EB03 (Service Type Code) = 30, which KMAP interprets as "Managed care organization"; EB05 = Plan Coverage Description (free-text MCO name). A related but distinct repetition uses EB03 values 1/35/56/MH for "Primary care provider."',
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
    'payerId.pverify': 'pVerify\'s own table flags "00128 Kansas Medicaid" as Eligibility=Yes / Claim=No — eligibility checks are supported, claim-status checks are not, per pVerify\'s own table.',
    'payerId.availity': 'No Kansas Medicaid entry found anywhere in the fetched Availity 837 payer list — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not located this pass.',
    'bhCarveOut.administrator': 'No KMAP source states or disclaims a BH carve-out for ABA specifically — inferred "none" from every reviewed MCO guide describing CCTS/IIS as billed directly (contrast with unitedhealthcare-community-plan-kansas below, which DOES route ABA through Optum). Per docs/vob-gaps.md census: "ABA is MCO-administered... no statewide carve-out."',
    'medicaid271Notes.mcoCarrierCodes':
      'The 2017 companion guide identifies MCOs by free-text description (EB05) only, not a numeric carrier-code table — ships empty by design. Note the document is dated May 2, 2017 (staleRisk) — a current KMAP EDI helpdesk confirmation (1-800-933-6593, option 4) would be needed to confirm no newer revision exists.',
    'medicaid271Notes.eligibilitySpanGranularity': 'Not stated in the 2017 companion guide — confirm via KMAP EDI helpdesk or a live 271 sample transaction.',
  },
  sources: [KMAP_COMPANION_GUIDE, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const kansasMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': kansasMedicaidEntry('97151', 'CCTS', 'Comprehensive assessment, now billed under CCTS.'),
  '97152': kansasMedicaidEntry('97152', 'CCTS'),
  '97153': kansasMedicaidEntry('97153', 'CCTS or IIS', 'Originally IIS-only (technician-delivered 1:1); CCTS was also authorized to bill this code effective 7/1/2024.'),
  '97154': kansasMedicaidEntry('97154', 'CCTS or IIS'),
  '97155': kansasMedicaidEntry('97155', 'CCTS'),
  '97156': kansasMedicaidEntry('97156', 'CCTS'),
  '97158': kansasMedicaidEntry('97158', 'CCTS'),
};

/* ==================== sunflower-health-plan-kansas ==================== */

const sunflowerKansasEdi: EdiRouting = {
  payerId: { pverify: '01285', availity: 'unverified', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'No Sunflower/Kansas entry found in the fetched Availity 837 payer list — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not located this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify onboarding for this payer ID.',
    'bhCarveOut.administrator': 'KS.CP.01 describes direct PA/claims handling with no named BH administrator for ABA — inferred "none".',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, SUNFLOWER_KS_CP01],
};

const sunflowerKansasCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(kansasMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'Sunflower secure portal/Availity PA channels'),
  ])
);

/* ==================== unitedhealthcare-community-plan-kansas ==================== */

const uhcCommunityPlanKansasEdi: EdiRouting = {
  payerId: { pverify: 'UHG002', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
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
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      'pVerify lists "UHG002 UNITEDHEALTHCARE COMMUNITY PLAN KANSAS (KANCARE)" as Eligibility=Yes / Claim=Yes — a confirmed Kansas-specific entry (contrast with Indiana, which has no state-specific UHC Community Plan pVerify ID).',
    'payerId.availity': 'No UHC Community Plan Kansas entry found in the fetched Availity 837 payer list.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId': 'Confirm via Provider Express whether ABA claims route on a distinct Optum BH payer ID or the shared UHG002 medical ID — providers enroll with KMAP first, then Optum retrieves the application to begin credentialing (~60 days), which suggests a UM/credentialing hop separate from the claims payer ID, but this is not directly confirmed.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, OPTUM_KS_MEDICAID_CRITERIA, UHC_KS_GETTING_STARTED],
};

const uhcCommunityPlanKansasCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(kansasMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'Provider Express (KanCare Autism/ABA Program) or the KanCare network contact'),
  ])
);

/* ==================== healthy-blue-kansas ==================== */

const healthyBlueKansasEdi: EdiRouting = {
  payerId: {
    pverify: 'unverified (candidates: 00213 Blue Cross Blue Shield Kansas / 00306 Blue Cross Blue Shield Kansas City — neither confirmed as the Healthy Blue Medicaid JV product specifically)',
    availity: 'unverified',
    changeHealthcare: 'unverified',
  },
  supports270271: 'unverified',
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
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      'Healthy Blue Kansas is a 1/1/2025 three-way JV (BCBS of Kansas + BCBS of Kansas City + Anthem/Elevance) — no pVerify entry named "Healthy Blue Kansas" or "KanCare" was found; the two BCBS-Kansas entries in the list predate the JV and are not confirmed to route the Medicaid product specifically. Confirm via pVerify/Availity onboarding using the plan\'s own EDI enrollment guidance.',
    'payerId.availity': 'No Healthy Blue or KanCare-flavored entry found anywhere in the fetched Availity 837 payer list — the biggest EDI gap of the three KanCare MCOs.',
    supports270271: 'Not confirmed this pass — Healthy Blue Kansas publishes the least ABA-specific/EDI-specific detail of the three MCOs (per kansas.ts guide prose); confirm via Availity or the plan\'s provider services line.',
    'bhCarveOut.administrator': 'No Healthy Blue Kansas document reviewed states or disclaims a BH carve-out for ABA specifically — inferred "none" from internal Anthem BH staff running UM per the guide\'s own prose (no external ABA vendor identified).',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, HEALTHY_BLUE_KS_PA_PAGE],
};

const healthyBlueKansasCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(kansasMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'Availity (Patient Registration > Authorizations & Referrals) or the ABA line 877-563-9347'),
  ])
);

/* ==================== aetna-kansas (commercial — Layers 1+3 only) ==================== */

const aetnaKansasEdi: EdiRouting = {
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
    'payerId.availity': 'Same 2012-vintage Availity list staleness finding as georgia.ts/indiana.ts — downgraded to inferred pending a current Availity export.',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator': 'Not researched to a primary source this pass — confirm via Aetna provider services whether Aetna administers ABA in-house or via a BH carve-out for Kansas commercial plans. (Not to be confused with Aetna Better Health of Kansas, the former KanCare Medicaid plan that lost its contract 1/1/2025 — this is the commercial line only.)',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const aetnaKansasCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaEntry(), '97152': aetnaEntry(), '97153': aetnaEntry(), '97154': aetnaEntry(),
  '97155': aetnaEntry(), '97156': aetnaEntry(), '97157': aetnaEntry(), '97158': aetnaEntry(),
  '0362T': aetnaEntry(), '0373T': aetnaEntry(),
};

/* ==================== cigna-kansas (commercial — Layers 1+3 only) ==================== */

const cignaKansasEdi: EdiRouting = {
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

const cignaKansasCodeGrid: Record<string, CodeGridEntry> = {
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

/* ==================== unitedhealthcare-kansas (commercial — Layers 1+3 only) ==================== */

const unitedhealthcareKansasEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: 'unverified', changeHealthcare: '87726' },
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
    'payerId.availity': 'No plain "UnitedHealthcare" (distinct from Kansas KanCare-specific "UHG002") entry confirmed for this exact ID pairing in the fetched Availity list — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'pVerify separately lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" entry — not resolved which applies for Kansas commercial ABA specifically.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId': "Provider Express / UHC provider services — confirm whether ABA claims route on a distinct Optum BH payer ID or the shared 87726 medical ID.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId. Note Optum\'s Kansas-specific criteria section is a Medicaid-only supplement (governs unitedhealthcare-community-plan-kansas, not this commercial guide) — commercial Kansas members follow the national Supplemental Clinical Criteria.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, OPTUM_SCC],
};

const unitedhealthcareKansasCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcCommercialEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcCommercialEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcCommercialEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcCommercialEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcCommercialEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcCommercialEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcCommercialEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== export ==================== */

export const kansasVob: Record<string, VobExtension> = {
  'kansas-medicaid': { edi: kansasMedicaidEdi, codeGrid: kansasMedicaidCodeGrid, rates: kansasMedicaidRates(), lastUpdated: ACCESS_DATE },
  'sunflower-health-plan-kansas': { edi: sunflowerKansasEdi, codeGrid: sunflowerKansasCodeGrid, rates: kansasMedicaidRates(), lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-kansas': { edi: uhcCommunityPlanKansasEdi, codeGrid: uhcCommunityPlanKansasCodeGrid, rates: kansasMedicaidRates(), lastUpdated: ACCESS_DATE },
  'healthy-blue-kansas': { edi: healthyBlueKansasEdi, codeGrid: healthyBlueKansasCodeGrid, rates: kansasMedicaidRates(), lastUpdated: ACCESS_DATE },
  'aetna-kansas': { edi: aetnaKansasEdi, codeGrid: aetnaKansasCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-kansas': { edi: cignaKansasEdi, codeGrid: cignaKansasCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-kansas': { edi: unitedhealthcareKansasEdi, codeGrid: unitedhealthcareKansasCodeGrid, lastUpdated: ACCESS_DATE },
};
