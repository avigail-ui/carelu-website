/* ================================================================
   VOB ENRICHMENT — Maryland, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate table). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - The single most important finding in this file: Maryland's own
     270/271 companion guide (MDH, dated 2013 "Draft Version 2" — the
     ONLY version hosted, 13 years stale) contains ZERO references to
     "BHASO," "Carelon," "Beacon," "ValueOptions," or any behavioral-
     health administrator anywhere in its 22 pages. Loop 2120C NM1
     (NM101=1P/FA/PRP) carries only an MCO name, Facility name, or
     Primary Payer name. A plain 270/271 against Maryland Medicaid's
     MMIS therefore does NOT surface the ABA/BH carve-out at all —
     there is no discoverable EDI signal telling a clearinghouse to
     route ABA to Carelon instead of the HealthChoice MCO on the
     card. That routing has to be hard-coded business logic (which
     this file encodes via bhCarveOut + twoHopRequired: true), not
     something a 271 parser can detect on its own.
   - Carelon became Maryland's BHASO only recently — January 1, 2025
     (succeeding Optum, which had run the state's Public Behavioral
     Health System before that). MDH's own Provider Transmittal
     PT 54-25 (Dec 16, 2024) states the Carelon "submitter ID" is
     BHOMD (superseding Optum-era OMDBH), confirmed independently by
     Claim.MD's clearinghouse payer registry ("Additional IDs:
     OMDBH"). That transmittal is written for the Health Homes
     program specifically — no ABA-specific MDH transmittal naming
     BHOMD was found this pass, so administratorPayerId ships
     'inferred' (same BHASO/PBHS umbrella), not 'verified', pending a
     document that names BHOMD for ABA claims specifically.
   - pVerify's payer-list page (pverify.com/payer-list/) returned a
     literal Cloudflare bot-block page on direct retrieval this pass
     — any pVerify-sourced number for a Maryland guide is therefore
     'unverified' throughout this file, not silently filled from an
     unverifiable scrape.
   - Real-time-vs-batch for the Carelon/BHOMD hop: Carelon's own
     national 270-271 companion guide states verbatim "At present,
     Carelon does not support real-time Eligibility Benefit Inquiry
     and Response transactions" (batch only). That guide is generic/
     national, not Maryland-specific, so supportsRealtime for the
     BHOMD hop ships 'inferred' from that statement, not verified
     against a Maryland-specific Carelon companion guide (none found).
   - Aetna/Cigna/UnitedHealthcare commercial code-level billing
     mechanics (unit caps, POS, modifiers) are NOT Maryland-specific
     in any source found for Georgia either — these three carriers
     publish clinical-necessity policy nationally and defer coding
     detail to reimbursement policies that don't carry state
     overrides. Entries below reuse the same national source
     documents (CPB 0554/0648, EN0499, Optum SCC + Reimbursement
     Policy) already verified in vob/georgia.ts — legitimately the
     same documents, not duplicated research.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const MD_270_271_CG_2013 = src(
  'https://health.maryland.gov/iac/HIPAA/pdf/Companion%20Guide_270n271_EligibiltyInquirynResponse.pdf',
  'MDH Companion Guide for 270/271 Health Care Eligibility Benefit Inquiry/Response, ASC X12N 005010X279A1, dated 2013-01-01 "Draft Version 2" — the only version hosted at this URL. Loop 2120C NM1 (NM101=1P Provider/FA Facility/PRP Primary Payer) carries the entity name as free text; contains zero references to BHASO/Carelon/Beacon/ValueOptions/ASO anywhere in the document. ISA08/GS03 = 526002033MCPP (production) / MMISELIG. DTP01=307, format D8 (single calendar date, not a span) — "DHMH still requires Providers to verify eligibility on the Date of Service." Real-time supported for single-subscriber inquiries (batch caps at 99 subscriber loops/transaction).',
  true
);
const PT_54_25 = src(
  'https://health.maryland.gov/mmcp/provider/Documents/transmittals/PT%2054-25%20Health%20Homes%20Services%20Integration%20with%20Carelon%20Behavioral%20Health.pdf',
  'MDH Provider Transmittal PT 54-25 (Dec 16, 2024) — confirms Carelon became Maryland\'s Administrative Services Organization for the Public Behavioral Health System effective January 1, 2025 (succeeding Optum), and states "the submitter ID of BHOMD" for Carelon as the pay-to entity. Written for the Health Homes program specifically; no ABA-specific transmittal naming BHOMD was found this pass.'
);
const CARELON_MD_ASO_FAQ = src(
  'https://marylandbehavioralhealth.optum.com/content/dam/ops-maryland/documents/provider/transition/Maryland-Provider-FAQ-10.17.24.pdf',
  'Carelon "Maryland ASO Provider FAQ, Batch 3 — Final 10/17/24" — confirms Optum was the prior ASO through 12/31/2024 ("The relationship with Optum ends on December 31, 2024"); states "Participant eligibility is loaded directly into the Carelon platform from Medicaid... EVS is supported with information directly from the Maryland Medicaid system. That information interfaces with the ASO" — i.e., eligibility reaches Carelon via a direct data feed, not a standard 270/271 a clearinghouse could intercept; the payer ID itself was explicitly withheld at FAQ-publication time ("will be shared with the provider network prior to go-live").'
);
const CARELON_NATIONAL_270271_CG = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/guides/270-271-companion-guide.pdf',
  'Carelon national 270-271 Companion Guide, cover-dated "January 2024 (Version 1.0)" but written for the older ASC X12N 004010X092A1 transaction-set version — states verbatim "At present, Carelon does not support real-time Eligibility Benefit Inquiry and Response transactions" (batch only, 24-hour turnaround). ISA/GS Receiver ID BEACON963116116; no Maryland-specific variant appears anywhere in this document. Generic/national — not Maryland-specific evidence on its own.',
  true
);
const CLAIM_MD_BHOMD = src(
  'https://www.claim.md/payer/BHOMD/MARYLAND%20PUBLIC%20BEHAVIORAL%20HEALTH%20SYSTEM.html',
  'Claim.MD clearinghouse payer directory — Payer ID BHOMD, "MARYLAND PUBLIC BEHAVIORAL HEALTH SYSTEM," lists Eligibility/Benefits plus Professional (1500) and Institutional (UB) claims support; "Additional IDs: OMDBH" confirms the same payer record absorbed the prior Optum-era ID.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/payer-list/',
  'pVerify public payer-list page — returned a Cloudflare bot-block page on direct automated retrieval this pass (confirmed via curl, Ray ID logged). No payer ID for any Maryland guide could be independently verified from this source this pass; treat every pverify field below as unverified rather than filled from an unconfirmed scrape.',
  true
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs) — the same document already cited in vob/georgia.ts and vob/florida.ts, which found it carries an "As of 08/08/2012" footer throughout (13.9 years old as of this access date). Row-level extraction confirms 60054=AETNA, 62308=CIGNA nationally (no Maryland-specific override or row). No UnitedHealthcare or Maryland Medicaid/Carelon-BHASO row was found on re-check this pass.',
  true
);
const UHC_PAYER_LIST_2026 = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
  '"Claims Payer List for UnitedHealthcare, Affiliates and Strategic Alliances," dated 5/13/2026 (current, not stale). UnitedHealthcare Commercial and Community Plan (Medicaid, multi-state) both list payer ID 87726. Row for "Other OptumHealth Behavioral Solutions (formerly United Behavioral Health and PacifiCare Behavioral Health) 87726 ... former payer id 33053" confirms UHC medical and Optum Behavioral Health currently SHARE payer ID 87726 nationally. A separately-reported Optum professional-claims list (exact URL not independently re-confirmed this pass) reportedly carries a Maryland Medicaid candidate ID "MDMCD" and an unexplained "MD / MAMP" annotation on a UnitedHealthcare row — both ship unverified pending a directly-citable source.',
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499, effective 2026-05-15 — all 10 codes listed as medically necessary when criteria are met; pure clinical-necessity policy, contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers. No Maryland-specific provision or carve-out found in the current version.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025, p.7 — states verbatim: "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna\'s medical claims nationally (no separate Evernorth EDI hop) — no Maryland-specific override found.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — Applied Behavior Analysis. National clinical-necessity policy; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers published. No Maryland-specific exhibit found.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given. No separate Aetna ABA billing/reimbursement policy or Maryland-specific exhibit could be located.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025, annual review 04/2026 — national criteria, contains zero CPT codes (ICD-10 F84.0 only); points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Maryland-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied here as 'inferred' absent a confirmed Maryland-specific override."
);
const OPTUM_STATE_MANDATES_MD = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  "Optum BH803ABA — ABA State Mandates supplemental criteria, Maryland entry — reproduces COMAR 31.10.39.03 (comprehensive evaluation, physician prescription with annual review, no-denial hour floors of 25 hrs/week ages 18mo-5 and 10 hrs/week ages 6-18, no experimental/investigational denial) for fully-insured Maryland plans. Contains no per-code unit-cap/POS/modifier table beyond the mandate's own hour floors."
);
const MD_ABA_MANUAL = src(
  'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf',
  'MDH ABA Provider Manual, effective 2026-02-01, pp.15-16 (fee schedule) and pp.4/14 (billing/contact). Full-text search this pass confirmed: no "EDI," "companion guide," "270," "271," or "payer ID" appear anywhere in this 16-page manual — Carelon is the named EDI/billing contact (800-888-1965) but no clearinghouse payer ID is stated in it. Confirms CMS-1500 paper / CMS 837P electronic billing format.'
);

/* -------------------- Layer 7: contact & channel sources -------------------- */

const CARELON_MD_PROVIDER_CONTACT = src(
  'https://maryland.carelonbh.com/provider/',
  'Carelon Behavioral Health of Maryland provider page — states "1-800-888-1965" is the primary contact number for "provider customer service and all inquiries (emergent, urgent, and routine calls)," and that "Carelon provides clinical staff coverage 24 hours a day, seven days a week, 365 days a year to respond to all participant and provider calls." Cross-confirms the same 1-800-888-1965 number the ABA Provider Manual gives for billing/precertification/registration questions; also lists Provider.relations.MD@carelon.com for provider-relations/alerts.'
);
const CARELON_MD_PROVIDERCONNECT_PORTAL = src(
  'https://maryland.carelonbh.com/behavioral-health-providers/',
  'Carelon Behavioral Health of Maryland provider-resources page — names the portal "ProviderConnect," described as "Carelon\'s secure, password-protected portal where participating providers conduct certain online activities directly with Carelon 24 hours a day, seven days a week," with login URL https://providerportal.carelonbehavioralhealth.com/index.html#/login.'
);
const AETNA_BH_ABA_PRECERT_FORM = src(
  'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/pharmacy-insurance/healthcare-professional/documents/outpatient-behavioral-health-BH-ABA-assessment-precert.pdf',
  'Aetna "Outpatient Behavioral Health (BH) — ABA Treatment Request" form, GR-69017-4 (7-26) — states verbatim "Don\'t use this form for Maryland and Massachusetts," so this document\'s national Precertification Department phone (1-800-424-4047), misdirected-fax numbers (1-800-624-0756 / 1-888-632-3862), and clinical-fax line (833-596-0339) are confirmed NOT to apply to Maryland and ship omitted rather than reused here. Does confirm Aetna\'s general national provider portal is Availity ("Just use our provider portal on Availity. Register today at Availity.com/aetnaproviders") — that portal statement precedes the Maryland/Massachusetts exclusion and is not itself scoped out by it.'
);
const UHC_PROVIDER_EXPRESS_CONTACT = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/contact-us.html',
  'Optum Provider Express "Contact Us" page — the only published phone numbers are 1-877-614-0484 ("Credentialing and recredentialing, Contracting and fee schedules, Network status, Provider demographic changes," Mon–Fri 7 a.m.–7 p.m. CT) and 1-866-209-9320 (Provider Express portal technical support only, same hours); no dedicated ABA/behavioral-health benefits-verification or prior-authorization phone number is published on this page.'
);
const UHC_PROVIDER_EXPRESS_PRIOR_AUTH = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/admin-resources/prior-auth-info.html',
  "Optum Provider Express \"Prior Authorization and Notification Information\" page — directs providers to the secure Provider Express portal (or the number on the member's ID card) for eligibility/PA verification; confirms no dedicated ABA/behavioral-health phone number is published here either."
);

/* -------------------- Layer 4: Maryland Medicaid ABA rates -------------------- */

const marylandMedicaidRates: RateTable = {
  source: 'MDH ABA Provider Manual (eff. Feb 1, 2026), fee schedule pp.15–16',
  effectiveDate: '2026-02-01',
  byCode: {
    '97151': { rate: '$38.34', unit: '15min', modifierTiers: { note: 'Psychologist/BCBA-D/BCBA tier only; daily max 32 units' } },
    '97152': { rate: '$19.17', unit: '15min' },
    '97153': {
      rate: '$24.41 (BCBA) / $20.91 (BCaBA) / $19.17 (RBT/BT)',
      unit: '15min',
      modifierTiers: { note: 'Daily max 32 units across all tiers' },
    },
    '97154': {
      rate: '$10.45 (psych/BCBA-D/BCBA, per ABA participant) / $8.36 (BCaBA) / $6.96 (RBT/BT)',
      unit: '15min',
      modifierTiers: { note: 'Group limited to 2–8 ABA participants; daily max 16 units' },
    },
    '97155': { rate: '$38.34', unit: '15min', modifierTiers: { GT: '$38.34 — remote direction of a technician, same rate; daily max 24 units' } },
    '97156': {
      rate: '$20.91 (without child present) / $38.34 (with child present, billed 97156-U2)',
      unit: '15min',
      modifierTiers: { U2: '$38.34 — child present variant; daily max 16 units' },
    },
    '97157': { rate: '$12.91 per family', unit: '15min', modifierTiers: { note: 'Group limited to 2–8 families; daily max 10 units' } },
    '97158': { rate: '$10.45 per ABA participant (psych/BCBA-D/BCBA tier)', unit: '15min', modifierTiers: { note: 'Group limited to 2–8 ABA participants; daily max 10 units' } },
    '0362T': { rate: '$52.28', unit: '15min', modifierTiers: { note: 'Daily max 32 units' } },
    '0373T': { rate: '$52.28', unit: '15min', modifierTiers: { note: 'Daily max 24 units' } },
  },
  sources: [MD_ABA_MANUAL],
};

/* -------------------- codeGrid factories -------------------- */

const TELEHEALTH_ELIGIBLE_CODES = new Set(['97155', '97156', '97157']);

function mdMedicaidEntry(code: string, unitCap: string, notes?: string): CodeGridEntry {
  const telehealthEligible = TELEHEALTH_ELIGIBLE_CODES.has(code);
  return {
    covered: 'Yes',
    paRequired: 'Required — every ABA service, including the 97151 assessment; gated by a preceding Comprehensive Diagnostic Evaluation confirming ASD',
    unitCap,
    capPeriod: 'day',
    posAllowed: [
      'home (default/preferred)',
      'community',
      'clinic/center-based (requires individualized justification under COMAR 10.09.28.05C)',
      'school (participants 6+ expected to be in school with an IEP; short-term/clinically-justified ABA only; an RBT/BT may not serve as a 1:1 school aide)',
    ],
    telehealth: telehealthEligible
      ? 'Yes — GT modifier. Confirmed on Maryland\'s telehealth-eligible service list (direct BCaBA/RBT/BT supervision, parent training, group parent training).'
      : "No — NOT on Maryland's telehealth-eligible service list. The ABA Provider Manual limits telehealth (GT modifier) to direct supervision, parent training, and group parent training only; direct 97153 treatment and the other codes are explicitly excluded.",
    modifiers: telehealthEligible ? ['GT (telehealth)', code === '97156' ? 'U2 (child present)' : ''].filter(Boolean) : ['None published for this code'],
    notes: [
      notes,
      'Credential-tier billing (BCBA/BCaBA/RBT-BT) is paid via separate fee-schedule lines per the manual, not distinct modifier codes — no modifier letters for credential tiers are stated in the manual; verify current billing-modifier convention with Carelon if a claim denies on this basis.',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'inferred',
    },
    sources: [MD_ABA_MANUAL],
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
      "Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy or Maryland-specific exhibit could be located. Maryland's habilitative-services mandate (COMAR 31.10.39.03) bars denial solely on prescribed hours up to 25/week (ages 18mo–5) or 10/week (6–18) for fully-insured plans — that is a mandate floor, not a payer-published per-code cap, and doesn't resolve this field. QA 2026-07-23: paRequired downgraded verified->unverified — CPB 0554, re-read in full, contains no precertification/prior-authorization language and no form 'GR-69017-4'; the precert requirement is plausibly true via Aetna's national process but is not stated in the cited policy.",
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
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics or Maryland-specific exhibit are published in it. QA 2026-07-23: paRequired downgraded verified->unverified — EN0499, re-read in full, contains no prior-authorization/precertification language, so the "(per EN0499)" attribution cannot support the per-code PA verdicts. The three assessment "Not required" values are separately corroborated by the Cigna Autism Resource Guide (cited at the EDI level); the treatment-code "Required" verdicts remain to be confirmed with Cigna/Evernorth provider services.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
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
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the Supplemental Clinical Criteria contains no CPT codes at all; applied here as 'inferred' absent a confirmed Maryland-specific override. Optum's BH803ABA State Mandates supplement reproduces the COMAR 31.10.39.03 hour floors for fully-insured Maryland plans (25 hrs/wk ages 18mo–5, 10 hrs/wk 6–18) — a mandate floor, not a per-code cap, so it doesn't resolve this field. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES_MD],
  };
}

/* ==================== maryland-medicaid ==================== */

const marylandMedicaidEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health (Maryland\'s Behavioral Health Administrative Services Organization, BHASO) — since 1/1/2025, previously Optum Maryland',
    administratorPayerId: 'BHOMD (formerly OMDBH under Optum through 12/31/2024)',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "Loop 2120C 'Subscriber Benefit Related Entity Name,' segment NM1 (NM101 = 1P Provider/FA Facility/PRP Primary Payer) carries the HealthChoice MCO name (or facility/primary-payer name) as free text — NOT a coded carrier-code table.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Single calendar date (DTP01=307, format D8) — Maryland requires eligibility verification on the actual date of service, not a forward-looking span.',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page returned a Cloudflare bot-block on direct retrieval this pass — confirm Maryland Medicaid's pVerify ID directly via pVerify support/onboarding, not automated scraping.",
    'payerId.availity': 'No Maryland Medicaid entry found in the (unofficial, third-party-mirrored) Availity 837 payer list retrieved this pass — confirm via Availity onboarding directly.',
    'payerId.changeHealthcare':
      "A candidate 'MDMCD' ID surfaced via an Optum/UHC-affiliated payer list, but the exact source URL/page for that specific line could not be independently re-confirmed this pass — treat as a lead, not a shipped fact.",
    'bhCarveOut.administratorPayerId':
      "BHOMD is confirmed by MDH's own PT 54-25 transmittal as Carelon's Maryland submitter ID, but that transmittal is written for the Health Homes program specifically — no ABA-specific MDH transmittal naming BHOMD was found this pass. Confirm directly with Carelon provider services (800-888-1965) or ProviderConnect onboarding that ABA claims use the same BHOMD ID.",
    supportsRealtime:
      'This value (true) describes Maryland MMIS\'s OWN 270/271 per the 2013 companion guide (single-subscriber real-time inquiries supported). It does NOT describe the Carelon/BHOMD hop — Carelon\'s national companion guide states it does not support real-time eligibility transactions (batch only); no Maryland-specific Carelon companion guide was found to confirm this for the BHOMD line specifically. Treat the BHASO hop as batch-only pending direct confirmation.',
  },
  sources: [MD_270_271_CG_2013, PT_54_25, CARELON_MD_ASO_FAQ, CARELON_NATIONAL_270271_CG, CLAIM_MD_BHOMD, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UHC_PAYER_LIST_2026],
};

const marylandMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mdMedicaidEntry('97151', '32 units/day', 'Gated by a preceding Comprehensive Diagnostic Evaluation (CDE) from a QHCP confirming ASD (F84.0/.5/.8/.9); only a psychologist, BCBA-D, or BCBA may complete this assessment.'),
  '97152': mdMedicaidEntry('97152', '32 units/day', 'QA 2026-07-23: corrected from "unverified" — the MD ABA Provider Manual fee schedule (eff. 2/1/2026) states the daily max for 97152 verbatim: "97152 Behavior Identification ... BCaBA/RBT/BT $19.17 15 minutes 32 units Supporting Assessment." The earlier "no daily cap found" reading was wrong; 32 units/day is stated and matches the fieldStatus:verified.'),
  '97153': mdMedicaidEntry('97153', '32 units/day', 'Direct treatment; billed at BCBA, BCaBA, or RBT/BT tier depending on rendering staff credential.'),
  '97154': mdMedicaidEntry('97154', '16 units/day', 'Group adaptive behavior treatment; group limited to 2–8 ABA participants.'),
  '97155': mdMedicaidEntry('97155', '24 units/day', 'Protocol modification; GT modifier available for remote direction of a technician (same rate as in-person).'),
  '97156': mdMedicaidEntry('97156', '16 units/day', 'Parent training — billed 97156-U2 when the child is present (higher rate) vs. without the child present (lower rate).'),
  '97157': mdMedicaidEntry('97157', '10 units/day', 'Multiple-family group parent training; group limited to 2–8 families.'),
  '97158': mdMedicaidEntry('97158', '10 units/day', 'Group adaptive behavior treatment with protocol modification; group limited to 2–8 ABA participants.'),
  '0362T': mdMedicaidEntry('0362T', '32 units/day'),
  '0373T': mdMedicaidEntry('0373T', '24 units/day', 'Extra-technician/intensifying protocol.'),
};

const marylandMedicaidVobContact: VobContact = {
  providerServicesPhone: '1-800-888-1965',
  ivrPath: 'Option 1, then Option 4 — ABA department (per the ABA Provider Manual\'s Carelon Call Center menu; the manual quotes this path in its Sentinel Event reporting section, but it\'s the same general Carelon Call Center number given elsewhere in the manual for billing/precertification/registration).',
  hours: 'Weekdays 8 a.m.–5 p.m. (Carelon Call Center, per the ABA Provider Manual); Carelon\'s own Maryland provider page separately describes 24/7 clinical staff coverage for participant/provider calls generally.',
  portal: { name: 'Carelon ProviderConnect', url: 'https://providerportal.carelonbehavioralhealth.com/index.html#/login' },
  scriptedQuestions: [
    "What is the exact daily unit cap for 97152, since the fee schedule gives a rate ($19.17) but the manual doesn't state an explicit daily cap for this code?",
    'Is the Carelon/BHOMD eligibility and benefits hop for ABA claims processed in real time, or batch/next-day only?',
    'Does the BHOMD submitter ID apply to ABA claims specifically, or is that ID only confirmed for the Health Homes program?',
    'What modifier, if any, should be appended to indicate rendering-provider credential tier (BCBA vs. BCaBA vs. RBT/BT) if a claim denies on that basis?',
    'Which clearinghouse payer ID should our EDI vendor use for Maryland Medicaid 270/271 eligibility inquiries (pVerify, Availity, or Change Healthcare)?',
  ],
  sources: [MD_ABA_MANUAL, CARELON_MD_PROVIDER_CONTACT, CARELON_MD_PROVIDERCONNECT_PORTAL],
};

/* ==================== aetna-maryland ==================== */

const aetnaMdEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '60054', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'unverified',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page returned a Cloudflare bot-block this pass — a prior fetch surfaced '00001' but could not be independently re-verified against the live page, so it ships unverified rather than trusted.",
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services or the ABA precertification process whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Maryland.',
  },
  sources: [AVAILITY_PAYER_LIST, UHC_PAYER_LIST_2026, PVERIFY_PAYER_LIST],
};

const aetnaMdCodeGrid: Record<string, CodeGridEntry> = {
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

const aetnaMdVobContact: VobContact = {
  portal: { name: 'Availity Essentials (Aetna provider portal)', url: 'https://www.availity.com/aetnaproviders' },
  scriptedQuestions: [
    'What are the daily or weekly unit caps for ABA codes 97151–97158, 0362T, and 0373T under this member\'s plan?',
    'Which places of service (home, office, school, telehealth) are authorized for ABA under this plan?',
    'Is telehealth (GT or 95 modifier) allowed for any ABA codes, and if so which ones?',
    'Are licensure-tier billing modifiers (HN/HO/HM/HP) required to distinguish BCBA vs. RBT/BT rendering providers?',
    'Does Aetna administer ABA benefits in-house or through a separate behavioral-health carve-out administrator for this Maryland plan?',
    "Since Aetna's national ABA precertification form (GR-69017-4) explicitly excludes Maryland, what is the correct Maryland-specific precertification process or form, and what phone/fax should we use?",
  ],
  sources: [AETNA_BH_ABA_PRECERT_FORM],
};

/* ==================== cigna-maryland ==================== */

const cignaMdEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '62308', changeHealthcare: '62308' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'Evernorth Behavioral Health',
    administratorPayerId: '62308',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page returned a Cloudflare bot-block this pass — a prior fetch surfaced '00004' but could not be independently re-verified against the live page, so it ships unverified rather than trusted.",
  },
  sources: [AVAILITY_PAYER_LIST, UHC_PAYER_LIST_2026, CIGNA_AUTISM_GUIDE, PVERIFY_PAYER_LIST],
};

const cignaMdCodeGrid: Record<string, CodeGridEntry> = {
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

const cignaMdVobContact: VobContact = {
  providerServicesPhone: '877.279.7603',
  hours: 'Monday–Friday, 8:30 a.m.–5:00 p.m. CT (Autism Care Coordinator team — benefits, eligibility, and authorization questions). A separate Provider Services department at 800.926.2273 handles billing/demographic questions, Monday–Friday 7:00 a.m.–7:00 p.m. CT.',
  portal: { name: 'Evernorth provider website (Procedure Code Benefit Tool)', url: 'https://provider.evernorth.com' },
  scriptedQuestions: [
    "What are the daily or weekly unit caps for this member's plan across the ABA code set (97151–97158, 0362T, 0373T)?",
    'Which places of service (home, office, school, telehealth) are authorized under this plan?',
    'Are telehealth modifiers (GT or 95) accepted for any ABA codes, and if so which ones?',
    'Are licensure-tier billing modifiers required to distinguish BCBA vs. BCaBA vs. RBT/BT rendering providers?',
  ],
  sources: [CIGNA_AUTISM_GUIDE],
};

/* ==================== unitedhealthcare-maryland ==================== */

const unitedhealthcareMdEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page returned a Cloudflare bot-block this pass — confirm directly via pVerify support/onboarding.",
    'payerId.changeHealthcare':
      "One UHC row in the Optum/UHC payer list carried an unexplained 'MD / MAMP' annotation alongside the shared 87726 ID — meaning and effect on routing not confirmed this pass.",
    'bhCarveOut.abaRidesOn':
      "UHC's national medical claims and Optum Behavioral Health carve-out currently share the SAME payer ID (87726) per UHC's own payer list ('Other OptumHealth Behavioral Solutions ... 87726 ... former payer id 33053') — how a clearinghouse distinguishes medical vs. BH claims when the ID is identical (taxonomy code? submitter ID?) was not confirmed this pass. Verify via Provider Express / UHC EDI support before automating routing.",
    'bhCarveOut.twoHopRequired': 'Same open question as abaRidesOn — confirm directly with UHC/Optum EDI support.',
  },
  sources: [AVAILITY_PAYER_LIST, UHC_PAYER_LIST_2026, PVERIFY_PAYER_LIST],
};

const unitedhealthcareMdCodeGrid: Record<string, CodeGridEntry> = {
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

const unitedhealthcareMdVobContact: VobContact = {
  portal: { name: 'Provider Express', url: 'https://www.providerexpress.com' },
  scriptedQuestions: [
    'Which places of service (home, office, school, telehealth) are authorized for ABA under this plan?',
    'Is telehealth allowed for any ABA codes, and which modifier (GT or 95) applies?',
    'Since UHC medical claims and Optum Behavioral Health share the same payer ID (87726), how should our clearinghouse distinguish ABA/behavioral claims from medical claims for routing?',
    'Is a two-hop authorization/eligibility process required between UHC and Optum Behavioral Health for ABA, or is it handled directly on one system?',
    "Can you confirm the current daily unit caps per code (97151–97158, 0362T, 0373T) for this specific plan, since Optum's national reimbursement policy is being used as a proxy?",
    'What is the direct phone number for ABA benefits and prior-authorization verification, since none is published on Provider Express?',
  ],
  sources: [UHC_PROVIDER_EXPRESS_CONTACT, UHC_PROVIDER_EXPRESS_PRIOR_AUTH],
};

/* ==================== export ==================== */

export const marylandVob: Record<string, VobExtension> = {
  'maryland-medicaid': {
    edi: marylandMedicaidEdi,
    codeGrid: marylandMedicaidCodeGrid,
    rates: marylandMedicaidRates,
    vobContact: marylandMedicaidVobContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-maryland': { edi: aetnaMdEdi, codeGrid: aetnaMdCodeGrid, vobContact: aetnaMdVobContact, lastUpdated: ACCESS_DATE },
  'cigna-maryland': { edi: cignaMdEdi, codeGrid: cignaMdCodeGrid, vobContact: cignaMdVobContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-maryland': {
    edi: unitedhealthcareMdEdi,
    codeGrid: unitedhealthcareMdCodeGrid,
    vobContact: unitedhealthcareMdVobContact,
    lastUpdated: ACCESS_DATE,
  },
};
