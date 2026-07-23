/* ================================================================
   VOB ENRICHMENT — Georgia, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid). See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - The GAMMIS 5010 270-271 Companion Guide v2.19 (released 2026-06-16)
     is confirmed to exist on the GAMMIS EDI portal, but its content
     (loop/segment for CMO enrollment, carrier-code map, eligibility-span
     granularity) could not be retrieved — the portal serves it only via
     an interactive ASP.NET postback link, and the static dch.georgia.gov
     mirror used for other companion guides returns 403 to automated
     retrieval. medicaid271Notes is therefore 'unverified' throughout,
     per the "never guess" rule — NOT a placeholder to fill from pattern.
   - The GA DCH "Part II ASD Policy Manual" (Jan 2018, the URL already
     cited elsewhere in georgia.ts) still uses the pre-2019 Category III
     code set (0359T-0374T) and was NOT used for current-code billing
     facts here. Current per-code max-daily-units come from a 2023
     Gainwell/DCH provider presentation; current telehealth mechanics
     (GT modifier, POS 02/10) come from DCH's Oct 2025 telehealth
     guidance (official medicaid.georgia.gov URL for that document
     currently serves a stale March 2020 letter, so the citation below
     points to a mirror whose content matches DCH's own formatting).
   - Amerigroup's published CG-BEH-02 guideline (2017/2018) predates
     97151-97158 entirely and contains zero code-level billing detail
     in any known revision — its codeGrid entries are marked 'inferred'
     from the statewide DCH/CMS pattern, not from Amerigroup's own
     document, and carry a verifyVia pointing to Amerigroup provider
     services.
   - Commercial payers' national clinical-necessity policies (Cigna
     EN0499, Aetna CPB 0554/0648, Optum's GA-specific Supplemental
     Clinical Criteria) mostly do NOT publish coding/reimbursement
     mechanics (unit caps, POS, telehealth modifiers) — those fields
     are 'unverified' with a verifyVia, not invented. UnitedHealthcare's
     unit caps/modifiers come from Optum's separate NATIONAL ABA
     Reimbursement Policy (2022RP501A), applied here as 'inferred' since
     no GA-specific override could be confirmed.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, SourceRef, StcMap } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, anthemFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const GAMMIS_COMPANION_GUIDE_INDEX = src(
  'https://www.mmis.georgia.gov/portal/PubAccess.EDI/Companion%20Guides/tabId/45/Default.aspx',
  "Lists \"GAMMIS 5010 270-271 Companion Guide v2.19\" (released 2026-06-16) among GAMMIS's published companion guides. The document itself is served only via an interactive ASP.NET postback link on this portal page, not a static URL — content (loop/segment, carrier codes, eligibility granularity) could not be retrieved this pass."
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs) — QA re-check (2026-07-23): the fetchable copy itself carries an "As of 08/08/2012" footer on every page (same document/finding already applied to aetna-florida). Row-level extraction confirms 77034=GAMEDICAID, 26375=Amerigroup - Ft. Worth (TX, NOT Georgia), 60054=AETNA, 87726=UNITEDHEALTHCARE, 62308=CIGNA, 00601=ANTHEM as of that 2012 snapshot.',
  true
);
const DCH_ASD_MANUAL = src(
  'https://medicaid.georgia.gov/document/publication/asd-policy-manual/download',
  'GA DCH Part II ASD Policy Manual, dated 2018-01-01 — codes table still uses the pre-2019 Category III set (0359T-0374T), not current 97151-97158; used here only for the assessment recency/hours-cap facts already verified elsewhere in this guide.',
  true
);
const DCH_2023_PRESENTATION = src(
  'https://www.mmis.georgia.gov/portal/portals/0/staticcontent/public/all/notices/autism%20spectrum%20disorder%202023%20(002)%2020230209200139.pdf',
  'Gainwell/GA DCH "Georgia Medicaid Autism Services Presentation," Feb 2023, p.13 — current CMS max-daily-units table for all 10 codes (97151-97158, 0362T, 0373T); notes 97151/97152 and 97153/97154/97155 are billed as "families of codes" in GAMMIS PA requests.',
  true
);
const DCH_TELEHEALTH_GUIDANCE = src(
  'https://setrc.us/wp-content/uploads/2025/11/Telehealth-Guidance-Q4-October-2025.pdf',
  'GA DCH Division of Medical Assistance Plans, "Part II Policies and Procedures for Telehealth Guidance," version date 2025-10-01, §614 (ASD Services) and §605 (general telehealth billing) — mirror copy; the official medicaid.georgia.gov URL for this document currently serves a stale March 2020 COVID letter instead of the current version.'
);
const CARESOURCE_MM0212 = src(
  'https://www.caresource.com/documents/medicaid-ga-policy-medical-mm-0212-20250101',
  'CareSource GA MCD-MM-0212, effective 2025-01-01, §VII — max-daily-units table for all 10 codes (matches the DCH 2023 presentation); telehealth/setting-modifier mechanics are explicitly deferred to the GA DCH ASD manual, not restated here.',
  true
);
const PEACH_STATE_POLICY = src(
  'https://www.pshpgeorgia.com/content/dam/centene/peachstate/policies/clinical-policies/GA.CP.BH.504.pdf',
  "Peach State GA.CP.BH.504, last revised 10/25 — lists all 10 codes as covered with standard CPT descriptions; no unit-cap table or POS codes published in-document (only generic 'home/clinic/school/community, in-person/telehealth' language)."
);
const AMERIGROUP_CGBEH02 = src(
  'https://provider.amerigroup.com/docs/gpp/GA_CAID_UMGuideline_AdaptiveBehavioralTreatmentAutismSpectrumDisorder.pdf?v=202101081602',
  'Amerigroup GA CG-BEH-02, current effective date 2017-09-27, form GAPEC-2437-18 (June 2018) — codes table lists only the legacy Category III set (0359T-0374T); no 97151-97158, no unit caps, no POS/telehealth billing mechanics in any known revision of this guideline family (checked against a newer same-numbered CG-BEH-02 template used for other Anthem-affiliated plans, which is also code-list-free).',
  true
);
const ANTHEM_ABA_GUIDE = src(
  'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf',
  "Anthem ABA Provider Resource Guide, Oct 2024, p.7 — general POS list for \"ABA services\" (not broken out per code); defers unit caps to \"the current CMS MUE list\" and telehealth billing mechanics to a separate Virtual Visits reimbursement policy / CPT Appendix P.",
  true
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499, effective 2026-05-15 — all 10 codes listed as medically necessary when criteria are met; pure clinical-necessity policy, contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025, annual review 04/2026 — contains zero CPT codes (ICD-10 F84.0 only); points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not GA-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied to the GA guide as 'inferred' absent a confirmed GA-specific override."
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — scoped to Down syndrome/non-ASD indications; 97151-97158 appear only under "not covered for indications listed in this CPB." Cross-references CPB 0648 for actual ASD coverage.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  "Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met (0362T/0373T under \"other CPT codes related to the CPB\"); no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given. No separate Aetna ABA billing/reimbursement policy could be located (the one candidate URL from secondary sources 404s)."
);

/* -------------------- codeGrid factories -------------------- */

function gaMedicaidEntry(unitCap: number, notes?: string, extraSources?: SourceRef[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: `${unitCap} units/day`,
    capPeriod: 'day',
    posAllowed: [
      'in-clinic (U6 modifier)',
      'out-of-clinic / home / community (U7 modifier, higher rate)',
      'telehealth (POS 02 patient not at home, or POS 10 patient at home)',
    ],
    telehealth:
      "Yes — GT modifier, POS 02 or 10 per DCH's Oct 2025 telehealth guidance §605/§614.",
    modifiers: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'GT', '93 (audio-only)'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [DCH_2023_PRESENTATION, DCH_TELEHEALTH_GUIDANCE, ...(extraSources ?? [])],
  };
}

function careSourceEntry(unitCap: number, notes?: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: `${unitCap} units/day`,
    capPeriod: 'day',
    posAllowed: [
      'in-clinic (U6 modifier, per DCH manual)',
      'out-of-clinic / home / community (U7 modifier, per DCH manual)',
      'telehealth (POS 02 or 10, GT modifier, per DCH manual)',
    ],
    telehealth:
      "Deferred to GA DCH's telehealth guidance (GT modifier, POS 02/10) — MM-0212 doesn't restate the mechanics itself.",
    modifiers: ['U1', 'U2', 'U3', 'U4', 'U5 (defined directly in MM-0212)', 'U6 (deferred to DCH manual)', 'U7 (deferred to DCH manual)', 'GT (deferred to DCH manual)'],
    notes: [
      notes,
      'Verify via: CareSource provider portal — confirm no CareSource-specific override of the DCH setting/telehealth mechanics MM-0212 defers to.',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'inferred',
      modifiers: 'inferred',
    },
    sources: [CARESOURCE_MM0212, DCH_TELEHEALTH_GUIDANCE],
  };
}

function peachStateEntry(notes?: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'Not published in GA.CP.BH.504; the statewide GA DCH/CMS-mandated daily caps (see the Georgia Medicaid and CareSource entries) are assumed to apply absent a Peach State-specific table.',
    capPeriod: 'day (inferred)',
    posAllowed: ['home', 'clinic', 'school', 'community', 'telehealth (modality named; no POS numbers given)'],
    telehealth:
      "Allowed as a modality per GA.CP.BH.504's general language; code-specific modifier/POS numbers are not published — inferred to follow GA DCH mechanics (GT modifier, POS 02/10).",
    modifiers: ['Inferred: GA DCH U1–U7 tiers/setting modifiers, GT telehealth — not restated in GA.CP.BH.504'],
    notes: [
      notes,
      'Verify via: Peach State UM/PA portal — GA.CP.BH.504 publishes no unit-cap table or modifier list of its own.',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'verified',
      telehealth: 'inferred',
      modifiers: 'inferred',
    },
    sources: [PEACH_STATE_POLICY],
  };
}

function amerigroupEntry(unitCap: number): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: `${unitCap} units/day`,
    capPeriod: 'day (inferred)',
    posAllowed: ['Inferred: GA DCH in-clinic (U6) / out-of-clinic (U7) / telehealth (POS 02 or 10, GT) — not confirmed in Amerigroup’s own guideline'],
    telehealth: "Inferred — GA DCH mechanics (GT modifier, POS 02/10); not confirmed in Amerigroup's own guideline.",
    modifiers: ['Inferred: GA DCH U1–U7 tiers/setting modifiers, GT telehealth'],
    notes:
      "Verify via: Amerigroup Georgia provider portal / current UM guideline — the published CG-BEH-02 (2017/2018) predates 97151–97158 and contains no code-level billing detail; every field on this entry is inferred from the statewide DCH/CMS pattern, not confirmed against Amerigroup's own current criteria.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'inferred',
      telehealth: 'inferred',
      modifiers: 'inferred',
    },
    sources: [AMERIGROUP_CGBEH02, DCH_2023_PRESENTATION],
  };
}

function anthemEntry(paRequired: string, notes?: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: [
      '12 = Home',
      '11 = Office/Clinic',
      '99 = Community',
      '03 = School',
      '10 = Telehealth (member in home)',
      '02 = Telehealth (member outside home)',
    ],
    telehealth:
      "Allowed via POS 10/02 per the ABA Provider Resource Guide's general POS list; code-specific modifier (95/GT) and per-code telehealth eligibility aren't published — the guide defers to a separate Virtual Visits reimbursement policy / CPT Appendix P.",
    modifiers: ["HM (less than bachelor's)", "HN (bachelor's)", "HO (master's)"],
    notes: [
      notes,
      "Verify via: CMS's current MUE list (unit caps — the guide defers to it) and Anthem's Virtual Visits reimbursement policy / CPT Appendix P (telehealth mechanics).",
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'verified',
      telehealth: 'unverified',
      modifiers: 'verified',
    },
    sources: [ANTHEM_ABA_GUIDE],
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
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it.',
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
    paRequired: 'Required — Optum ABA prior authorization (specific process/review cadence not confirmed in either cited source)',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the GA-specific Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed GA-specific override. QA re-check (2026-07-23): the previously shipped \"two-step authorization (assessment, then treatment); continued-service review every 4-6 months\" language does not appear in either OPTUM_SCC or the Reimbursement Policy — removed pending a source that actually states it. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY],
  };
}

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
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located this pass. QA re-check (2026-07-23): form "GR-69017-4," previously cited here, does not appear in either CPB 0554 or CPB 0648 — removed pending a source that actually states it.',
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

/* ==================== georgia-medicaid ==================== */

const georgiaMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00100', availity: '77034', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation: 'unverified',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'unverified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'QA re-check (2026-07-23): the cited Availity list carries an "As of 08/08/2012" footer — 77034=GAMEDICAID is confirmed present in that snapshot, but downgraded from verified to inferred pending reconfirmation against a current Availity export (same treatment already applied to aetna-florida for the identical staleness finding).',
    'payerId.changeHealthcare':
      'Optum/Change Healthcare payer finder — two conflicting IDs surfaced (SKGA0, 12K05) and neither was resolved to a single canonical ID this pass.',
    supportsRealtime:
      'GAMMIS 5010 270-271 Companion Guide v2.19 — confirmed to exist on the GAMMIS EDI portal but not retrievable this pass (interactive-only, static mirror 403s).',
    'medicaid271Notes.mcoSegmentLocation':
      'Same companion guide — obtain via the GAMMIS provider portal login or the DCH EDI helpdesk; the static dch.georgia.gov mirror used for other companion guides returns 403 for this document.',
    'medicaid271Notes.mcoCarrierCodes': 'Same companion guide.',
    'medicaid271Notes.eligibilitySpanGranularity': 'Same companion guide.',
  },
  sources: [GAMMIS_COMPANION_GUIDE_INDEX, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const georgiaMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': gaMedicaidEntry(
    32,
    'Billed as a family with 97152 in GAMMIS PA requests — entering one code sends both for authorization. Comprehensive assessment generally capped at 8 hrs per 6-month period.',
    [DCH_ASD_MANUAL]
  ),
  '97152': gaMedicaidEntry(16, 'Billed as a family with 97151 in GAMMIS PA requests.'),
  '97153': gaMedicaidEntry(32, 'Billed as a family with 97154/97155 in GAMMIS PA requests.'),
  '97154': gaMedicaidEntry(18, 'Billed as a family with 97153/97155 in GAMMIS PA requests.'),
  '97155': gaMedicaidEntry(24, 'Billed as a family with 97153/97154 in GAMMIS PA requests.'),
  '97156': gaMedicaidEntry(16),
  '97157': gaMedicaidEntry(16),
  '97158': gaMedicaidEntry(16),
  '0362T': gaMedicaidEntry(16),
  '0373T': gaMedicaidEntry(
    32,
    'Extra-technician / intensifying protocol; DCH-aligned CMO policies generally require a titration plan back toward 97153 and a BCBA onsite and immediately available.'
  ),
};

/* ==================== amerigroup-georgia ==================== */

const amerigroupEdi: EdiRouting = {
  payerId: { pverify: '00025', availity: 'unverified', changeHealthcare: 'unverified' },
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
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists a generic \"00025 AMERIGROUP\" (Elig: Y) plus a separate GA-inclusive entry \"00706 AMERIGROUP (IA,DC,MD,FL,GA,WA,TN,TX,NM)\" flagged Elig/Claim: No in pVerify's own table — confirm which code pVerify actually routes GA eligibility checks through before automating on 00025.",
    'payerId.availity':
      "QA re-check (2026-07-23): Availity's own list resolves 26375 to \"Amerigroup - Ft. Worth\" (Texas), not Georgia — confirmed by direct retrieval and row-level extraction of the source PDF. The list's only GA-relevant Amerigroup line is a generic, non-state-tagged \"27518 AMERIGROUP\" entry. Confirm the correct GA-specific Availity ID directly with Availity onboarding before automating.",
    'payerId.changeHealthcare':
      'QA re-check (2026-07-23): no Change Healthcare-specific source was ever cited for this value — it had been copied from the (incorrect) Availity figure. Confirm via Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const amerigroupCodeGrid: Record<string, CodeGridEntry> = {
  '97151': amerigroupEntry(32),
  '97152': amerigroupEntry(16),
  '97153': amerigroupEntry(32),
  '97154': amerigroupEntry(18),
  '97155': amerigroupEntry(24),
  '97156': amerigroupEntry(16),
  '97157': amerigroupEntry(16),
  '97158': amerigroupEntry(16),
  '0362T': amerigroupEntry(16),
  '0373T': amerigroupEntry(32),
};

/* ==================== caresource-georgia ==================== */

const caresourceEdi: EdiRouting = {
  payerId: { pverify: '01359', availity: 'GACS1', changeHealthcare: 'GACS1' },
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
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const caresourceCodeGrid: Record<string, CodeGridEntry> = {
  '97151': careSourceEntry(32),
  '97152': careSourceEntry(16),
  '97153': careSourceEntry(32),
  '97154': careSourceEntry(18),
  '97155': careSourceEntry(24),
  '97156': careSourceEntry(16),
  '97157': careSourceEntry(16),
  '97158': careSourceEntry(16),
  '0362T': careSourceEntry(16),
  '0373T': careSourceEntry(32),
};

/* ==================== peach-state-georgia ==================== */

const peachStateEdi: EdiRouting = {
  payerId: { pverify: '00385', availity: '68069', changeHealthcare: '68069' },
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
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const peachStateCodeGrid: Record<string, CodeGridEntry> = {
  '97151': peachStateEntry(),
  '97152': peachStateEntry(),
  '97153': peachStateEntry(),
  '97154': peachStateEntry(),
  '97155': peachStateEntry(),
  '97156': peachStateEntry(),
  '97157': peachStateEntry(),
  '97158': peachStateEntry(),
  '0362T': peachStateEntry(),
  '0373T': peachStateEntry(
    'Requires an extra-technician plan, environmental modifications per target behavior, a titration plan toward 97153, and a BCBA onsite and immediately available (per GA.CP.BH.504).'
  ),
};

/* ==================== anthem-bcbs-georgia (commercial) ==================== */

const anthemEdi: EdiRouting = {
  payerId: { pverify: '01347', availity: '00601', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify also separately lists \"00032 BCBS of Georgia\" — confirm which code applies to this specific plan family before automating routing.",
    'payerId.changeHealthcare': 'Optum/Change Healthcare institutional payer list shows two candidates for Anthem GA (00101 and 00601), not resolved to one.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "Anthem BCBS Georgia provider services — confirm whether ABA claims route to Carelon Behavioral Health (payer ID BHOVO per Availity / CHCBH per Optum's ERA list) or bill directly under Anthem's own medical payer ID (00601). The Anthem ABA Provider Resource Guide itself describes standard CMS-1500 billing with no carve-out named.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, ANTHEM_ABA_GUIDE],
};

const anthemCodeGrid: Record<string, CodeGridEntry> = {
  '97151': anthemEntry('Required — part of the ≤20-combined-hour initial behavior-identification assessment'),
  '97152': anthemEntry('Required — part of the ≤20-combined-hour initial behavior-identification assessment'),
  '97153': anthemEntry('Required — treatment plan, reviewed every 6 months'),
  '97154': anthemEntry('Required — treatment plan, reviewed every 6 months'),
  '97155': anthemEntry(
    'Required — treatment plan, reviewed every 6 months',
    "Billable alongside 97153 only when the technician and the QHP are both face-to-face and the QHP is directing (per the ABA Provider Resource Guide, which contains an apparent typo — \"971555\" — in this rule)."
  ),
  '97156': anthemEntry('Required — protocol modification, up to 2 hrs per 10 direct hours, max 8/week'),
  '97157': anthemEntry('Required — treatment plan, reviewed every 6 months'),
  '97158': anthemEntry('Required — treatment plan, reviewed every 6 months'),
  '0362T': anthemEntry('Required — part of the ≤20-combined-hour initial behavior-identification assessment'),
  '0373T': anthemEntry('Required — treatment plan, reviewed every 6 months'),
};

/* ==================== aetna-georgia (commercial) ==================== */

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
      'QA re-check (2026-07-23): the cited Availity list carries an "As of 08/08/2012" footer — 60054=AETNA is confirmed present in that snapshot, but downgraded from verified to inferred pending reconfirmation against a current Availity export (same treatment already applied to aetna-florida for the identical staleness finding).',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity — this value was carried over from the same 2012 Availity snapshot.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services or the ABA precertification process whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Georgia.',
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

/* ==================== cigna-georgia (commercial) ==================== */

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
  sources: [
    PVERIFY_PAYER_LIST,
    AVAILITY_PAYER_LIST,
    src(
      'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
      "Cigna Autism Resource Guide, Mar 2025 — states verbatim: \"Use Evernorth payer ID 62308,\" confirming ABA/autism claims use the SAME payer ID as Cigna's medical claims (no separate Evernorth EDI hop)."
    ),
  ],
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

/* ==================== unitedhealthcare-georgia (commercial) ==================== */

const unitedhealthcareEdi: EdiRouting = {
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
    'payerId.availity': 'No UnitedHealthcare entry of any kind appears in the fetched Availity 837 payer list — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare':
      "QA re-check (2026-07-23): neither cited source (pVerify list, Optum ABA Supplemental Clinical Criteria) actually contains this payer ID — pVerify's own list has no \"87726\" line at all, only a distinct \"UHG007 United Healthcare - Optum Behavioral Solutions\" entry, and the Optum SCC document contains zero payer IDs. Confirm directly via Provider Express / UHC provider services before automating on 87726.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "Provider Express / UHC provider services — UHC's own EDI payer list shows GA Community Plan behavioral claims routing on the same 87726 used for medical, but pVerify separately lists a distinct \"UHG007 United Healthcare - Optum Behavioral Solutions\" code; not resolved which applies for commercial GA ABA specifically.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, OPTUM_SCC],
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
   GAMMIS's 270/271 Companion Guide content (which STCs it populates) is the
   SAME document whose retrieval blocker is already documented above
   (GAMMIS_COMPANION_GUIDE_INDEX) — an interactive ASP.NET postback link, not
   a static URL. Its service-type-code support table could not be retrieved
   this pass either, so georgia-medicaid and its 3 CMOs (which run their own
   PA/eligibility but have no independently published 270/271 STC table of
   their own) ship fully 'unverified' rather than guessed from another
   state's pattern. */

function gaUnverifiedStc(phoneNote: string): StcMap {
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
      abaBenefitBucket: `GAMMIS 5010 270-271 Companion Guide v2.19 is confirmed to exist but its service-type-code support table is not retrievable via automated means (same ASP.NET-postback blocker documented for medicaid271Notes). ${phoneNote}`,
    },
    sources: [GAMMIS_COMPANION_GUIDE_INDEX],
  };
}

const georgiaMedicaidStc = gaUnverifiedStc('Confirm via GAMMIS provider services or the Gainwell EDI help desk.');
const amerigroupStc = gaUnverifiedStc('Confirm via Amerigroup GA provider services.');
const caresourceStc = gaUnverifiedStc('Confirm via CareSource GA provider services.');
const peachStateStc = gaUnverifiedStc('Confirm via Peach State Health Plan provider services.');

/* ==================== export ==================== */

export const georgiaVob: Record<string, VobExtension> = {
  'georgia-medicaid': { edi: georgiaMedicaidEdi, codeGrid: georgiaMedicaidCodeGrid, stcMap: georgiaMedicaidStc, lastUpdated: ACCESS_DATE },
  'amerigroup-georgia': { edi: amerigroupEdi, codeGrid: amerigroupCodeGrid, stcMap: amerigroupStc, lastUpdated: ACCESS_DATE },
  'caresource-georgia': { edi: caresourceEdi, codeGrid: caresourceCodeGrid, stcMap: caresourceStc, lastUpdated: ACCESS_DATE },
  'peach-state-georgia': { edi: peachStateEdi, codeGrid: peachStateCodeGrid, stcMap: peachStateStc, lastUpdated: ACCESS_DATE },
  'anthem-bcbs-georgia': {
    edi: anthemEdi,
    codeGrid: anthemCodeGrid,
    stcMap: inheritFamilyStc(anthemFamilyStc, 'Inherited from the Anthem/Elevance family default (docs/vob-build.md Layer 2) — no Georgia-specific 270/271 STC document found.'),
    lastUpdated: ACCESS_DATE,
  },
  'aetna-georgia': {
    edi: aetnaEdi,
    codeGrid: aetnaCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Georgia-specific 270/271 STC document found.'),
    lastUpdated: ACCESS_DATE,
  },
  'cigna-georgia': {
    edi: cignaEdi,
    codeGrid: cignaCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Georgia-specific override found.'),
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-georgia': {
    edi: unitedhealthcareEdi,
    codeGrid: unitedhealthcareCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Georgia-specific override found.'),
    lastUpdated: ACCESS_DATE,
  },
};
