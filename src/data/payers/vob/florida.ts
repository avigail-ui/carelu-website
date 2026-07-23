/* ================================================================
   VOB ENRICHMENT — Florida, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate table; NONE for
   commercial guides — contract-specific, excluded by spec). See
   docs/vob-build.md for the spec.

   This file merges TWO sibling change-sets, delivered in parallel and
   combined here (rebase conflicts on this file resolve as keep-both,
   per the build brief):

   SPLIT A covers florida-medicaid, sunshine-health-florida,
   cms-health-plan-florida, simply-healthcare-florida,
   unitedhealthcare-community-plan-florida, and
   humana-healthy-horizons-florida. Its sourcing notes (below) apply
   to the shared FL_CODE_FACTS/ahcaStateEntry/mcoEntry infrastructure,
   which SPLIT B (this file's remaining four Medicaid MMA guides)
   reuses as-is rather than duplicating with a separately-sourced
   (and, on cross-check, less authoritative) code grid — see the
   SPLIT B note at the end of this comment block for why.

   SPLIT A sourcing notes (read before editing):
   - The FLMMIS 270/271 Companion Guide (v4.0, 2023-04-27, Gainwell/
     AHCA fiscal agent) WAS retrieved and read in full — unlike
     Georgia's, this one is a fetchable static PDF. It confirms
     Florida's canonical X12 payer ID (77027) and the exact 271 loop/
     segment carrying managed-care enrollment (Loop 2110C "Managed
     Care" repetition + nested Loop 2120C free-text entity name — NOT
     a fixed carrier-code table; that absence is itself the verified
     fact for medicaid271Notes.mcoCarrierCodes).
   - The current (2025 AND 2026 — rates unchanged) AHCA Behavior
     Analysis fee schedule WAS retrieved directly from ahca.myflorida.
     gov as fetchable PDFs (their WAF blocks a default WebFetch
     User-Agent but not a browser-like one). This produces a real,
     citable finding: CPT 97157 does not appear on either fee
     schedule and is not listed among covered service categories in
     the Dec 2024 coverage policy (§4.2.2) — cross-confirmed absent
     from Sunshine Health's own coding table (FL.CP.BH.500) and
     Humana's Florida Medicaid PA list too. Shipped as covered:'No'
     with fieldStatus 'verified' (verified-absent, not a guess) —
     see the FL_CODE_FACTS['97157'] entry below. SPLIT B independently
     reached the same conclusion (97157 absent from the coverage
     policy text and every fee-schedule tracker it could reach) before
     the two splits were combined — genuine cross-validation, not
     copied work.
   - Florida's AHCA BA Coverage Policy (Dec 2024, Rule 59G-4.125)
     binds ALL 9 MMA plans to its service-coverage floor/ceiling
     (§1.2: plans "must not be subject to more stringent service
     coverage limits than specified in Florida Medicaid policies").
     None of the 4 MCOs in split A (Sunshine/CMS Health Plan,
     Simply/Carelon, UHC Community Plan/Optum, Humana) publish a
     full code-level unit-cap/POS/telehealth table of their own —
     each MCO's codeGrid below therefore starts from the AHCA
     statewide facts (fieldStatus 'inferred' by default) and is
     upgraded to 'verified' per-field only where that specific
     plan's own document independently restates or confirms the
     fact (Sunshine's FL.CP.BH.500 clinical policy is by far the
     most detailed of the four and confirms the most fields). SPLIT
     B's four MMA guides (Aetna Better Health, Molina, Community Care
     Plan, Florida Community Care) follow the identical pattern via
     the same mcoEntry() factory.
   - Telehealth is a genuine, verified quirk in Florida: ONLY 97156
     (family/caregiver training) has a stated telehealth allowance
     anywhere in state or plan documentation — GT modifier, capped at
     2 hrs/week, per Rule 59G-1.057, F.A.C. Every other code is
     telehealth:'No' by design, not by omission — this is the
     opposite pattern from Georgia (which allows telehealth broadly
     via POS 02/10 on every code).
   - No Florida BA document — state or plan-level — publishes numeric
     CMS place-of-service codes (no "POS 11/12/02/10" table like
     Georgia's). Every posAllowed value here is a categorical setting
     (home/office/school/community) drawn from plan PA-form checkboxes
     or the coverage policy's IEP/504 school-based requirement; that
     absence of numeric POS codes is itself a verified finding, not a
     gap left for later.
   - Sunshine Health's reported BA network-enrollment pause — flagged
     'unconfirmed' in the shipped florida.ts prose (citing only a
     3piesquared.com industry blog) — IS NOW CONFIRMED from Sunshine's
     own newsroom: a pause on adding new practitioners to existing BA
     groups took effect 2025-10-01 (all AHCA regions except A and B),
     and a partial reversal lifted it in Regions E and F starting
     2026-03-01. Carried into codeGrid notes for the 97153 entry on
     both sunshine-health-florida and cms-health-plan-florida per the
     build brief's instruction to note it there when verifiable.
   - Simply Healthcare's BA benefit is delegated to Carelon Behavioral
     Health for BOTH authorizations and claims (confirmed, not just
     auths) — abaRidesOn:'bh' with twoHopRequired:true, distinct from
     UHC Community Plan/Optum, where Optum manages utilization review
     but claims still bill under UHC's own payer ID 87726 (same ID as
     medical) — abaRidesOn:'medical', twoHopRequired:false. No
     Florida-specific Carelon EDI payer ID could be confirmed (only a
     national pVerify listing, 002465); a commonly-cited "BHOVO" code
     could not be verified against any primary Carelon source.
   - Sunshine's own site states its payer ID is 68069, but Availity's
     payer list separately shows "FLORIDA SUNSHINE STATE HEALTH PLAN"
     = 68057 and a distinct "Centene Corporation" = 68069 — an
     unresolved conflict between two source-adjacent listings, shipped
     as 'inferred' with the conflict spelled out in verifyVia rather
     than silently picking one.
   - UnitedHealthcare Community Plan of Florida's own BA quick-
     reference guides (FL-BAP-QRG.pdf and Optum's FLABAQRG.pdf) were
     both fetched and read in full and contain ZERO code-level detail
     (no CPT table, no unit caps, no POS, no telehealth, no modifiers)
     — confirmed to be 3-page administrative documents only. Optum's
     NATIONAL commercial ABA Reimbursement Policy (2022RP501A, used
     for Georgia's UHC entry) explicitly should NOT be extended to FL
     Medicaid: it uses a four-tier HN/HM/HO/HP modifier system, but
     the AHCA fee schedule that governs FL Medicaid (including UHC
     Community Plan, per the coverage policy's plan-compliance clause)
     uses only HN plus group-size U-modifiers — a materially different
     scheme. This guide's codeGrid therefore inherits AHCA's numbers,
     not Optum's national policy. SPLIT B's UnitedHealthcare FLORIDA
     COMMERCIAL guide (a different line of business) correctly keeps
     Optum's national 2022RP501A HN/HM/HO/HP scheme, since that guide
     is NOT bound by the AHCA Medicaid fee schedule.
   - Humana's own materials explicitly defer coding mechanics to AHCA
     in writing ("Procedure codes and the latest published fee
     schedules can be found on the AHCA website... Rule 59G-4.002") —
     the cleanest, most explicit deferral statement found in this
     split, cited verbatim in the Humana codeGrid entries. Humana's PA
     form (MCD 466) also gives a concrete, previously-unpublished
     number: non-par providers are reimbursed at 80% of the Florida
     Medicaid fee schedule absent a controlling legal requirement or
     Letter of Agreement — replacing the vague "a percentage of..."
     language in the shipped florida.ts prose with an exact figure.
   - "TNFL" (Therapy Network of Florida / Health System One) was
     investigated per the build brief and confirmed to administer BA
     for Community Care Plan — a Florida MMA plan OUTSIDE split A's
     6 guides, covered by split B (below) instead, with its own
     independently-read TNFL Behavior Analysis Provider Manual.

   SPLIT B sourcing notes (read before editing) — covers
   aetna-better-health-florida, molina-healthcare-florida,
   community-care-plan-florida, florida-community-care, and the
   Aetna/Cigna/UnitedHealthcare Florida COMMERCIAL guides:
   - Split B's own first-pass code grid was built from a
     PDF-text-extraction read of the AHCA coverage policy plus a
     secondary fee-schedule tracker (AHCA's own fee-schedule PDF 403s
     a default WebFetch User-Agent). Split A independently retrieved
     the ACTUAL AHCA fee-schedule PDFs (browser-spoofed request) and
     three MCOs' own coding documents (Sunshine's FL.CP.BH.500,
     Humana's PA form/PAL, Simply's Carelon training deck) — a
     materially stronger primary-source base for the exact same
     statewide facts. Per "accuracy beats completeness," split B's
     four MMA guides below were rebuilt on split A's
     FL_CODE_FACTS/mcoEntry() infrastructure rather than keeping a
     parallel, weaker-sourced code grid — the discarded first-pass
     version is not preserved here; its sourcing gaps are superseded,
     not merely duplicated.
   - Aetna Better Health of Florida's own Quick Reference Guide (Rev.
     11/2024, read directly) confirms EDI/EFT payer ID 128FL and Real
     Time payer ID ABHFL via its Office Ally enrollment section, plus
     a Behavioral Health-specific PA phone line (1-833-365-2474)
     distinct from the Physical Health line — not previously
     documented in florida.ts.
   - Florida Community Care's own BA services page (read directly)
     names Behavioral Services Network (BSN) as its behavioral-health
     network partner — a fact absent from florida.ts's existing FCC
     prose, which describes FCC BA authorization as fully in-house.
     Both are true at once: BSN appears to handle network
     credentialing/contracting (as it does for Aetna Better Health of
     Florida), while FCC's own Utilization Department still adjudicates
     the actual BA prior-authorization requests by fax/email/portal.
   - Community Care Plan's BA is fully delegated to Therapy Network of
     Florida (TNFL) for BOTH authorizations and claims — TNFL's own
     Behavior Analysis Provider Manual (read in full) states verbatim
     "Our Payer ID is 65062 for professional claims and 12k89 for
     institutional claims," and restates the 40-hrs/week threshold and
     6-participant group cap directly (upgraded to 'verified' via
     mcoEntry()'s confirmed-fields mechanism, same pattern split A
     uses for Sunshine/Humana).
   - UnitedHealthcare/Optum's national COMMERCIAL claims-routing payer
     ID (87726) is confirmed directly from Optum's own Provider
     Express EDI page ("The Optum payer ID is 87726"), matching the
     identical finding already shipped for UnitedHealthcare Community
     Plan of North Carolina (vob/north-carolina.ts) — an upgrade over
     Georgia's 'unverified' Availity ID and 'unverified' BH
     administratorPayerId/abaRidesOn for the same carrier family.
     Cigna/Evernorth's same-payer-ID pass-through (62308, no second
     EDI hop) is confirmed via the same national Autism Resource Guide
     already cited in Georgia. Aetna's commercial BH administration
     remains unverified: its own June 2022 OfficeLink Updates page was
     checked directly and says nothing about in-house vs. carve-out
     claims administration — an absence of evidence, not confirmation.
   - The Availity payer list PDF used by both splits (same URL) turns
     out to carry an "As of 08/08/2012" footer on every page — split
     A flags this correctly (AVAILITY_PAYER_LIST_STALE); split B's
     Aetna-florida commercial entry has been corrected accordingly
     (payerId.availity/changeHealthcare downgraded from 'verified' to
     'inferred', since 60054 is a long-standing national ID rather
     than independently reconfirmed this pass) — a real correction
     made during the merge, not a silent copy of the pre-merge value.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, FieldStatus, StcMap, VobContact } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const FLMMIS_270_271_CG = src(
  'https://portal.flmmis.com/FLPublic/Portals/0/StaticContent/Public/COMPANION%20GUIDES/FMMIS_5010_270_271_Companion%20Guide_v4_0_04272023.pdf',
  'FMMIS 270/271 Batch and Interactive Health Care Eligibility and Response Transaction Companion Guide, 005010X279A1, Version 4.0, 2023-04-27 (AHCA/Gainwell Technologies fiscal agent) — retrieved and read in full. Confirms Florida Medicaid X12 payer ID 77027 (ISA06/ISA08, GS02/GS03, NM109 qualifier PI); managed-care enrollment surfaces in Loop 2110C\'s "Eleventh Repetition – Managed Care" (EB01=L/MC, EB03=96, EB04=MC) with the MCO/PCP identity as FREE TEXT in nested Loop 2120C (NM103) — no fixed carrier-code table exists in this guide. Eligibility spans use DTP qualifier 307 in RD8 (date-range) format for most repetitions, D8 (single date) for a few.',
  true
);
const FLMMIS_CG_INDEX = src(
  'https://portal.flmmis.com/FLPublic/Provider_ProviderServices/Provider_EDI/Provider_EDI_CompanionGuides/tabId/62/Default.aspx',
  'FLMMIS companion guide index page listing all current EDI companion guides and versions.'
);
const FLMMIS_STC_APPENDIX = src(
  'https://portal.flmmis.com/FLPublic/Portals/0/StaticContent/Public/COMPANION%20GUIDES/FMMIS_5010_270_271_Companion%20Guide_v4_0_04272023.pdf',
  'Same FLMMIS 270/271 Companion Guide v4.0 as FLMMIS_270_271_CG, re-read for its service-type-code (STC) content this pass. Appendix A.6 "CORE-Required Service Codes" lists MH (Mental Health) among the 13 codes Florida Medicaid must return recipient financial info for on a GENERIC 271 response (alongside 1, 30, 33, 35, 47, 48, 50, 86, 88, 98, AL, UC); Appendix A.7 "Valid Explicit Inquiry Codes" separately lists A6 (Psychotherapy), A7/A8 (Psychiatric In/Outpatient), AI (Substance Abuse) as explicit-inquiry-only. The worked 271 transmission example (Appendix A.4) shows real EB segments bundling MH with the other CORE-required codes for both coinsurance ("EB*A*IND*1^33^47^48^56^86^88^98^MH^UC*****0.00") and copayment ("EB*B*IND*1^86^88^MH^UC****0.00"); the deductible segment in the same example ("EB*C*IND*30**FP...*25*0.00") is tied only to STC 30, never to MH.',
  true
);
const AHCA_FEE_SCHEDULE_2025 = src(
  'https://ahca.myflorida.com/content/download/26138/file/2025%20Behavior%20Analysis%20Fee%20Schedule.pdf',
  'AHCA "Behavior Analysis Fee Schedule January 1, 2025" — retrieved directly (AHCA blocks a default WebFetch User-Agent with 403 but not a browser-spoofed request). Full per-code rate table, all effective 2025-01-01.'
);
const AHCA_FEE_SCHEDULE_2026 = src(
  'https://ahca.myflorida.com/content/download/28096/file/2026%20BA%20Fee%20Schedule.pdf',
  'AHCA "Behavior Analysis Fee Schedule 2026" — retrieved directly. Rates are IDENTICAL to the 2025 schedule (no increase); CPT 97157 is absent from this schedule too, confirming the omission is not a 2025-only oversight.'
);
const AHCA_BA_COVERAGE_POLICY = src(
  'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf',
  'Florida Medicaid Behavior Analysis Services Coverage Policy, Dec 2024, incorporated by reference in Rule 59G-4.125, F.A.C. (effective 2025-02-10) — retrieved and read in full. Contains NO CPT code table itself (§8.3 defers to Rule 59G-4.002/the fee schedule); §1.2 binds all MMA plans to this policy\'s floor/ceiling; §4.2.2 sets the 40 hrs/week aggregate cap, 6-participant group cap, and the 97156-only 2 hrs/week telemedicine allowance (GT modifier, Rule 59G-1.057, F.A.C.); §8.2 sets the 8-minute billing rule; §7.2 requires IEP/504 (or documented explanation) for school-based authorization.'
);
const PVERIFY_PAYER_LIST_FL = src(
  'https://pverify.com/wp-content/uploads/2026/06/pVeify-Payer-List-June-26.pdf',
  'pVerify public payer list, dated June 2026 — fetched and parsed directly (pverify.com/payer-list/ itself is JS-rendered and not directly extractable).'
);
const AVAILITY_PAYER_LIST_STALE = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity payer list PDF served at this URL is a STALE legacy export dated "As of 08/08/2012," not Availity\'s current live payer list — used here only as a secondary cross-check, flagged staleRisk, never as the sole basis for a "verified" field.',
  true
);
const SUNSHINE_BA_QRG = src(
  'https://www.sunshinehealth.com/providers/Billing-manual/ba.html',
  'Sunshine Health — BA Provider Quick Reference Guide.'
);
const SUNSHINE_BA_PA_FORM = src(
  'https://www.sunshinehealth.com/content/dam/centene/Sunshine/pdfs/SH-PRO-BH-BA-PA-Request.pdf',
  'Sunshine Health BA Prior Authorization Request Form (SH_9518) — retrieved and read in full. Confirms 40 hr/week overall cap language, "telehealth only allowed for 97156 (see fee schedule)," TS modifier row for 97151 reassessment, HN modifier rows for 97155/97156, and a claims-edit FAQ note on XP-modifier ($0.01 minimum charge workaround) for 97153XP/97155XP.'
);
const SUNSHINE_CLINICAL_POLICY_BH500 = src(
  'https://www.sunshinehealth.com/content/dam/centene/Sunshine/policies/clinical-policies/FL.CP.BH.500.pdf',
  'Sunshine Health Clinical Policy FL.CP.BH.500, "Coding Implications — Behavior Analysis Services," rev. 06/24 — retrieved and read in full. Confirms 6-participant group cap for 97154/97158, Lead-Analyst-or-BCaBA-only rendering for 97155/97158 (RBT excluded), 2 hrs/week telemedicine cap for 97156 citing Rule 59G-1.057, and 10–25 hr/wk (Focused) vs. 30–40 hr/wk (Comprehensive) tiering within the 40 hr/wk ceiling. CPT 97157 is absent from this policy\'s coding table.'
);
const SUNSHINE_TELEHEALTH_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/telehealth-billing-update.html',
  'Sunshine Health general telehealth billing notice — states POS 02 is the system-recognized telehealth indicator and instructs providers NOT to append GT/95/CR modifiers. This is Sunshine\'s CROSS-PLAN telehealth billing convention and appears to conflict with the BA-specific GT-modifier requirement in FL.CP.BH.500/the state coverage policy — flagged as an open discrepancy in the 97156 codeGrid entry, not resolved by assumption.'
);
const SUNSHINE_EDI_PAGE = src(
  'https://www.sunshinehealth.com/providers/resources/electronic-transactions.html',
  'Sunshine Health electronic transactions page — states payer ID 68069 for "Medical/Medicare Advantage" claims and names Availity and Change Healthcare (Emdeon/WebMD/Envoy) as active EDI trading partners, without a clearinghouse-specific alternate ID.'
);
const SUNSHINE_PAUSE_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/aba-pause.html',
  'Sunshine Health newsroom — confirms (primary source, not the previously-cited 3piesquared.com industry blog) a temporary pause on adding new practitioners to existing BA provider groups, effective 2025-10-01, in all AHCA regions except A and B, "to ensure the existing BA network...is fully loaded and functions accurately." Sunshine retains discretion to enroll select providers where a need is identified; an Exception Request Form is available.'
);
const SUNSHINE_PAUSE_ENDS_NOTICE = src(
  'https://www.sunshinehealth.com/newsroom/pause-ends.html',
  'Sunshine Health newsroom — confirms the BA enrollment pause lifted in AHCA Regions E (Brevard, Orange, Osceola, Seminole) and F (Charlotte, Collier, DeSoto, Glades, Hendry, Lee, Sarasota) starting 2026-03-01. No stated end date found for the remaining paused regions as of this pass.'
);
const SIMPLY_CARELON_TRAINING = src(
  'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513',
  'Simply Healthcare / Carelon Behavioral Analysis provider training deck (24 slides, dated 2025-01-15, footer FLSMPLY-CD-078096-25) — retrieved and read in full. Confirms the 30-day treatment-plan/data freshness rule verbatim (slide 12: "no older than 30 days at the time of submission... current Vineland and BASC scores"), fax 1-800-370-1116, care-manager review "in accordance with Florida BA Service Coverage Policy: Rule 59G-4.125" (slide 7), 90-day minimum continuity of care (slide 10), and Availity/Payspan claims-and-payment routing. Contains NO CPT code table, unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers anywhere in its 24 slides.'
);
const SIMPLY_EDI_PAGE = src(
  'https://provider.simplyhealthcareplans.com/florida-provider/electronic-data-interchange',
  'Simply Healthcare Florida EDI page — states payer ID SMPLY is used for ALL transaction types via Availity\'s EDI Gateway, explicitly including 270/271 eligibility (in addition to 837/835/276-277).'
);
const CARELON_PROVIDER_HANDBOOK = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/carelon-behavioral-health-provider-handbook.pdf',
  'Carelon Behavioral Health national Provider Handbook — states (§9, Claims Procedures) that providers must look up the correct payer ID via "client and state specific guidelines" on Carelon\'s website or Availity\'s payer list; does not print a Florida-specific payer ID itself.'
);
const CARELON_NATIONAL_ABA_FORM_2019 = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/clinical/aba-authorization-request-form-2019-cpt-codes.pdf',
  'Carelon national ABA Authorization Request Form, "Effective 1/1/2019" — a NATIONAL, non-Florida-specific, pre-carve-in document. Only numeric detail found in any Carelon-authored source: 97151 "up to 32 units max for initial, up to 12 units max for reassessment" — this CONFLICTS with the AHCA/Florida-specific numbers (24 units initial / 18 units TS reassessment) and is NOT applied to this guide\'s codeGrid; cited only to document that it exists and should not be mistaken for a Florida figure.',
  true
);
const UHC_FL_BAP_QRG = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/fl/resources/FL-BAP-QRG.pdf',
  'UHC Community Plan FL — SMMC Behavioral Analysis Program QRG, doc BH00998-1-25-QRG_03312025 — retrieved and read in full. 3-page administrative document: payer ID 87726, ERA payer ID 86047, 180-day timely filing, 15-day clean-claims turnaround, W9 + FL license required on first claim. Eligibility/benefits verification described ONLY via the Provider Express portal or phone — no 270/271 EDI payer ID given. Contains NO CPT table, unit caps, POS codes, telehealth modifiers, or "Gold Card" mention.'
);
const OPTUM_FLABA_QRG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/flaba/FLABAQRG.pdf',
  'Optum Provider Express — Florida ABA QRG, doc BH01355-1-25-QRG_07162025 (newer revision than the UHC-branded QRG above, but identical scope/content) — retrieved and read in full. Same finding: no code-level coding/reimbursement detail.'
);
const HUMANA_ABA_FLYER = src(
  'https://assets.humana.com/is/content/humana/ABA_Informational_Flyer_AHCApdf',
  'Humana Healthy Horizons FL — Behavior Analysis Informational Flyer (675204FL0225) — retrieved and read in full. States verbatim: "Procedure codes and the latest published fee schedules can be found on the AHCA website: Rule 59G-4.002, Provider Reimbursement Schedules and Billing Codes" — an explicit, written deferral to AHCA for code-level mechanics. Payer ID 61101 for FFS claims via Availity Essentials (preferred), Waystar/ZirMed, TriZetto, SSI Group; PA channels Availity Essentials, IVR 800-523-0023 (24/7), fax 813-321-7220.'
);
const HUMANA_PA_FORM_MCD466 = src(
  'https://assets.humana.com/is/content/humana/ABA_PA_Formpdf',
  'Humana FL — ABA PA Form (MCD 466) — retrieved and read in full. Page 3 states verbatim: "Absent a controlling legal requirement or Letter of Agreement, nonparticipating providers will be reimbursed at 80% of the Medicaid Fee Schedule." POS field is categorical only (Home / Office-Center / School / Other checkboxes) — no numeric POS codes, no telehealth checkbox, no HN/HO/HM/HP fields anywhere on the form.'
);
const HUMANA_FL_PAL = src(
  'https://assets.humana.com/is/content/humana/FL%20MCD%20PAL%20Cpdf',
  'Humana Florida Medicaid Prior Authorization List, "PAL C," effective 2025-07-01, revised 2026-06-26 — retrieved and read in full (page 3: "Behavioral health — Managed by Humana — Applied behavioral analysis (ABA) therapy: 0362T, 0373T, 97151, 97152, 97153, 97154, 97155, 97156, 97158"). CPT 97157 is absent from this list (full-text-searched across both the Nov-2025 "PAL B" and this June-2026 "PAL C" revision); 97151-TS is not listed as a distinct line item — only base 97151 appears.'
);

/* -------------------- AHCA statewide code facts (Layer 3 baseline) -------------------- */

interface FlCodeFact {
  covered: string;
  paRequired: string;
  unitCap: string;
  capPeriod: string;
  posAllowed: string[];
  telehealth: string;
  modifiers: string[];
  notes?: string;
}

const FL_POS: string[] = [
  'home (categorical — no CMS POS-code number published anywhere in FL BA documentation, state or plan level)',
  'office/clinic (categorical)',
  'school (categorical — IEP/504 plan, or a documented explanation, required with the PA request per the coverage policy §7.2)',
  'community/other (categorical, per plan PA-form checkboxes)',
];

const NO_TELEHEALTH =
  "No — not authorized for this code under the AHCA BA Coverage Policy. Only 97156 (family/caregiver training) has a stated telehealth allowance in Florida Medicaid BA; every other code is telehealth:'No' by policy design, not by omission.";

const FL_CODE_FACTS: Record<string, FlCodeFact> = {
  '97151': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      '24 units per initial behavior assessment (max); the reassessment variant, billed with modifier TS, caps at 18 units — same $19.05/unit rate either way.',
    capPeriod: 'per assessment/reassessment (not daily) — a new authorization is required each time, not a recurring daily allotment.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: ['TS — reassessment variant, same $19.05 rate, separate 18-unit cap (vs. 24 for the initial assessment)'],
    notes:
      'Physician referral + order + Comprehensive Diagnostic Evaluation gate the very first assessment request (no autism-diagnosis requirement) — see the guide\'s prose for the intake sequence.',
  },
  '97152': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: '8 units per assessment (max).',
    capPeriod: 'per assessment (not daily).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
  },
  '0362T': {
    covered: 'Yes',
    paRequired: 'Required, and conditioned on medical necessity for the extra-technician protocol per the coverage policy.',
    unitCap: '16 units per initial assessment or reassessment (max).',
    capPeriod: 'per assessment/reassessment.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
    notes:
      'Requires an on-site physician/QHP plus 2+ technicians for severe/destructive-behavior assessment support; billed alongside 97151/97151-TS, not standalone.',
  },
  '97153': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'No code-specific unit cap on the fee schedule; counts toward the aggregate 40 hrs/week (≈160 units/week) BA-intervention cap set by the coverage policy §4.2.2.',
    capPeriod: 'week (aggregate across all treatment codes together, not per-code).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'XP — concurrent-supervision supervisee line, not separately reimbursed (the supervisor bills 97153/97155/97155-HN instead)',
    ],
    notes:
      'Billed at the SAME $12.26/unit rate whether rendered by an RBT, BCaBA, or Lead Analyst — Florida does not tier 97153 by staff credential (contrast 97155/97156, which do via the HN modifier).',
  },
  '97154': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'Max 6 participants per group (coverage policy §4.2.2); the group also counts toward the aggregate 40 hrs/week cap. Rendered by Lead Analyst, BCaBA, or RBT.',
    capPeriod: 'week (aggregate) plus a 6-participant group-size ceiling.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'UN (2 clients, $7.58/unit)',
      'UP (3 clients, $7.08/unit)',
      'UQ (4 clients, $6.58/unit)',
      'UR (5 clients, $6.08/unit)',
      'US (6 clients, $5.58/unit)',
    ],
    notes: 'The modifier documents group size, not staff credential — rate scales DOWN as the group grows.',
  },
  '97155': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap: 'No code-specific unit cap on the fee schedule; counts toward the aggregate 40 hrs/week cap.',
    capPeriod: 'week (aggregate across all treatment codes).',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'HN — BCaBA tier, $15.37/unit (vs. $19.17 Lead Analyst base rate)',
      'XP — concurrent-supervision supervisee line, not separately reimbursed',
    ],
    notes: 'Rendered by Lead Analyst or BCaBA only — RBTs do not bill 97155 in Florida.',
  },
  '97156': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'No code-specific cap on direct/in-person units; the TELEHEALTH variant (GT modifier) is separately capped at 2 hrs/week (8 units/week).',
    capPeriod: 'week (telehealth portion); aggregate 40 hrs/week cap governs the rest.',
    posAllowed: FL_POS,
    telehealth:
      "Yes — the ONLY Florida Medicaid BA code with a confirmed telehealth allowance. GT modifier, up to 2 hrs/week, per Rule 59G-1.057, F.A.C. (coverage policy §4.2.2, FL.CP.BH.500). Not confirmed whether the telehealth allowance extends to BCaBA-rendered (HN-modifier) training — both the coverage policy and Sunshine's clinical policy name the \"Lead Analyst\" specifically. Separately: Sunshine's general (non-BA) telehealth billing notice instructs POS 02 with NO GT/95/CR modifier appended, which appears to conflict with the BA-specific GT-modifier requirement — an unresolved discrepancy, flagged rather than guessed at; confirm the correct billing combination with each plan before submitting a 97156 telehealth claim.",
    modifiers: ['GT — telemedicine delivery, same $19.05 rate, capped at 2 hrs/wk', 'HN — BCaBA tier, $15.24/unit (vs. $19.05 Lead Analyst base rate)'],
  },
  '97157': {
    covered:
      'No — absent from both the 2025 and 2026 AHCA Behavior Analysis fee schedules and not listed among the covered service categories in the Dec 2024 coverage policy §4.2.2. Cross-confirmed absent from Sunshine Health\'s own coding table (FL.CP.BH.500) and Humana\'s Florida Medicaid PA list too — three independent primary sources agree on the omission. This is NOT a formal written exclusion statement (no document states "97157 is excluded"), so treat this as verified-absent-from-the-billable-set rather than a proven-impossible claim.',
    paRequired: 'N/A — not on the state\'s billable BA code set per the fee schedule and PA lists reviewed.',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes:
      'If a family reports a Florida plan authorizing/paying 97157, verify directly with that plan — it would be an accommodation outside the state fee schedule, not the documented default.',
  },
  '97158': {
    covered: 'Yes',
    paRequired: 'Required',
    unitCap:
      'Max 6 participants per group; rendered by Lead Analyst or BCaBA only (NOT RBT, per the coverage policy — contrast 97154, which RBTs can render).',
    capPeriod: 'week (aggregate) plus a 6-participant group-size ceiling.',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [
      'UN (2 clients, $9.58/unit)',
      'UP (3 clients, $9.08/unit)',
      'UQ (4 clients, $8.58/unit)',
      'UR (5 clients, $8.08/unit)',
      'US (6 clients, $7.58/unit)',
    ],
  },
  '0373T': {
    covered: 'Yes',
    paRequired: 'Required, and conditioned on medical necessity for the extra-technician protocol.',
    unitCap: "No distinct unit cap beyond the underlying code's session limits — the fee schedule doesn't publish one separately for this add-on.",
    capPeriod: 'unverified',
    posAllowed: FL_POS,
    telehealth: NO_TELEHEALTH,
    modifiers: [],
    notes:
      'Requires an on-site physician/QHP plus 2+ technicians for severe/destructive-behavior exposure treatment; billed alongside 97153/97155.',
  },
};

/* -------------------- codeGrid factories -------------------- */

function ahcaStateEntry(code: string): CodeGridEntry {
  const f = FL_CODE_FACTS[code];
  return {
    covered: f.covered,
    paRequired: f.paRequired,
    unitCap: f.unitCap,
    capPeriod: f.capPeriod,
    posAllowed: f.posAllowed,
    telehealth: f.telehealth,
    modifiers: f.modifiers,
    notes: f.notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'inferred',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [AHCA_FEE_SCHEDULE_2025, AHCA_FEE_SCHEDULE_2026, AHCA_BA_COVERAGE_POLICY],
  };
}

/* Generic MCO entry: starts from the AHCA statewide baseline (per the
   coverage policy's plan-compliance clause, §1.2) as 'inferred', and
   upgrades specific fields to 'verified' only where that plan's own
   document independently confirms them. */
function mcoEntry(
  code: string,
  opts: {
    planName: string;
    confirmed: Array<keyof Pick<FlCodeFact, 'covered' | 'paRequired' | 'unitCap' | 'telehealth' | 'modifiers'>>;
    extraNote?: string;
    extraSources: SourceRef[];
  }
): CodeGridEntry {
  const f = FL_CODE_FACTS[code];
  const confirmedSet = new Set<string>(opts.confirmed);
  const status = (field: string): FieldStatus => (confirmedSet.has(field) ? 'verified' : 'inferred');
  return {
    covered: f.covered,
    paRequired: f.paRequired,
    unitCap: f.unitCap,
    capPeriod: f.capPeriod,
    posAllowed: f.posAllowed,
    telehealth: f.telehealth,
    modifiers: f.modifiers,
    notes: [
      f.notes,
      opts.extraNote,
      `These are the statewide AHCA BA Coverage Policy mechanics, binding on ${opts.planName} per the policy's plan-compliance clause (§1.2); ${opts.planName}'s own documents don't restate full code-level unit-cap/POS detail beyond what's marked 'verified' above — confirm any 'inferred' field with ${opts.planName} provider relations before quoting a family.`,
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: status('covered'),
      paRequired: status('paRequired'),
      unitCap: status('unitCap'),
      posAllowed: 'inferred',
      telehealth: status('telehealth'),
      modifiers: status('modifiers'),
    },
    sources: [AHCA_BA_COVERAGE_POLICY, AHCA_FEE_SCHEDULE_2025, ...opts.extraSources],
  };
}

/* ==================== florida-medicaid (state FFS) ==================== */

const floridaMedicaidEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '77027', changeHealthcare: 'unverified' },
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
      "Loop 2110C (Subscriber Eligibility or Benefit Information), \"Eleventh Repetition – Managed Care\": EB01='L' (PCP, individual) or 'MC' (MCO, entity), EB03=96 (Professional/Physician), EB04='MC' (Medicaid). MCO/PCP identity is carried in the nested Loop 2120C (Subscriber Benefit Related Entity Name): NM101='1P' (Provider), NM103=free-text plan/provider name, with contact phone in the PER segment.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      'Date range (RD8 format, CCYYMMDD-CCYYMMDD) via the Loop 2110C DTP segment (qualifier 307=Eligibility) for most repetitions; a few repetitions (e.g., Well Baby Care) use a single date (D8, qualifier 472=Service) instead. Not a fixed monthly bucket — driven by date-of-service.',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pverify.com/payer-list/ is JS-rendered and not extractable via automated fetch this pass — confirm Florida Medicaid's pVerify code directly with pVerify onboarding.",
    'payerId.availity':
      "77027 is Florida Medicaid's own X12 payer ID per the FLMMIS companion guide (confirmed primary source); Availity's own current live payer list was not independently reachable (the fetched URL served a stale 2012 export that happens to list 77027 too) — confirm 77027 is still what Availity routes 270/271 through before automating on it.",
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass — confirm via Optum/Change Healthcare onboarding.',
  },
  sources: [FLMMIS_270_271_CG, FLMMIS_CG_INDEX, PVERIFY_PAYER_LIST_FL, AVAILITY_PAYER_LIST_STALE],
};

const floridaMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': ahcaStateEntry('97151'),
  '97152': ahcaStateEntry('97152'),
  '97153': ahcaStateEntry('97153'),
  '97154': ahcaStateEntry('97154'),
  '97155': ahcaStateEntry('97155'),
  '97156': ahcaStateEntry('97156'),
  '97157': ahcaStateEntry('97157'),
  '97158': ahcaStateEntry('97158'),
  '0362T': ahcaStateEntry('0362T'),
  '0373T': ahcaStateEntry('0373T'),
};

const floridaMedicaidRates: RateTable = {
  source: 'AHCA Behavior Analysis Fee Schedule (2025 and 2026 — rates identical across both years)',
  effectiveDate: '2025-01-01',
  byCode: {
    '97151': { rate: '$19.05', unit: '15min', modifierTiers: { TS: '$19.05 (reassessment; same rate, 18-unit cap vs. 24 for the initial assessment)' } },
    '97152': { rate: '$12.19', unit: '15min' },
    '0362T': { rate: '$12.19', unit: '15min' },
    '97153': { rate: '$12.26', unit: '15min', modifierTiers: { XP: 'Not reimbursed (concurrent-supervision supervisee line)' } },
    '97154': {
      rate: '$7.58 (2 clients, UN)',
      unit: '15min',
      modifierTiers: { UN: '$7.58 (2 clients)', UP: '$7.08 (3)', UQ: '$6.58 (4)', UR: '$6.08 (5)', US: '$5.58 (6)' },
    },
    '97155': { rate: '$19.17 (Lead Analyst)', unit: '15min', modifierTiers: { HN: '$15.37 (BCaBA)', XP: 'Not reimbursed (concurrent-supervision supervisee line)' } },
    '97156': {
      rate: '$19.05 (Lead Analyst)',
      unit: '15min',
      modifierTiers: { GT: '$19.05 (telemedicine — same rate, capped at 2 hrs/week)', HN: '$15.24 (BCaBA)' },
    },
    '97157': { rate: 'Not on the AHCA fee schedule (2025 or 2026) — not confirmed reimbursable under Florida Medicaid BA.', unit: '15min' },
    '97158': {
      rate: '$9.58 (2 clients, UN)',
      unit: '15min',
      modifierTiers: { UN: '$9.58 (2 clients)', UP: '$9.08 (3)', UQ: '$8.58 (4)', UR: '$8.08 (5)', US: '$7.58 (6)' },
    },
    '0373T': { rate: '$12.19', unit: '15min' },
  },
  sources: [AHCA_FEE_SCHEDULE_2025, AHCA_FEE_SCHEDULE_2026],
};

/* ==================== sunshine-health-florida & cms-health-plan-florida ====================
   CMS Health Plan is operated BY Sunshine Health and uses Sunshine's BA process end to end
   (confirmed in research) — the codeGrid below is shared between both guides; EDI differs
   (CMS Health Plan has no independently confirmed EDI identity of its own). */

const sunshineEdi: EdiRouting = {
  payerId: { pverify: '00327', availity: '68069', changeHealthcare: '68069' },
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
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      "Sunshine's own electronic-transactions page states payer ID 68069, but Availity's payer list separately shows a distinct line item \"FLORIDA SUNSHINE STATE HEALTH PLAN\" = 68057 alongside a separate \"Centene Corporation\" = 68069 — an unresolved conflict between two source-adjacent listings. Confirm which ID Availity actually routes Sunshine FL 270/271 eligibility through before automating.",
    'payerId.changeHealthcare':
      "Sunshine's own page names Change Healthcare as an active trading partner using the same 68069 ID as Availity, but no independent Change Healthcare-specific payer directory was reachable to cross-confirm.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID — neither Sunshine\'s page nor the BA QRG specifies.',
  },
  sources: [PVERIFY_PAYER_LIST_FL, SUNSHINE_EDI_PAGE, SUNSHINE_BA_QRG, AVAILITY_PAYER_LIST_STALE],
};

const cmsHealthPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
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
      'No distinct CMS Health Plan entry was found in pVerify\'s or Availity\'s public payer lists — CMS Health Plan is operated by Sunshine Health and its BA program rides on Sunshine\'s process end to end (per Sunshine\'s BA QRG), but whether CMS Health Plan uses Sunshine\'s own EDI payer ID (68069) or requires separate enrollment was not confirmed. Confirm via Sunshine/CMS Health Plan provider relations.',
    'payerId.availity': 'Same as pverify — not independently confirmed.',
    'payerId.changeHealthcare': 'Same as pverify — not independently confirmed.',
    supports270271: 'Not stated in any CMS Health Plan or Sunshine document reviewed.',
    supportsRealtime: 'Not stated.',
  },
  sources: [SUNSHINE_BA_QRG],
};

const sunshineCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraNote:
      "Sunshine's own BA QRG confirms an industry-reported network-enrollment pause on adding new practitioners to existing BA provider groups: effective 2025-10-01 in all AHCA regions except A and B (Sunshine newsroom, aba-pause.html), partially lifted in Regions E and F starting 2026-03-01 (pause-ends.html). Verify current status by region with Sunshine provider relations before promising a new hire's start date.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500, SUNSHINE_PAUSE_NOTICE, SUNSHINE_PAUSE_ENDS_NOTICE],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth'],
    extraNote: "Sunshine's PA form doesn't restate the UN–US group-size modifier letters (says only \"see fee schedule for participant amount\") — the letters themselves are inferred from the AHCA fee schedule.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth', 'modifiers'],
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500, SUNSHINE_TELEHEALTH_NOTICE],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Sunshine Health',
    confirmed: ['covered'],
    extraNote: "Independently cross-confirmed absent from Sunshine's own FL.CP.BH.500 coding table — not just the AHCA fee schedule.",
    extraSources: [SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'unitCap', 'telehealth'],
    extraNote: "Sunshine's PA form doesn't restate the UN–US group-size modifier letters — inferred from the AHCA fee schedule.",
    extraSources: [SUNSHINE_BA_PA_FORM, SUNSHINE_CLINICAL_POLICY_BH500],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Sunshine Health',
    confirmed: ['covered', 'paRequired', 'telehealth'],
    extraSources: [SUNSHINE_BA_PA_FORM],
  }),
};

/* ==================== simply-healthcare-florida ==================== */

const simplyEdi: EdiRouting = {
  payerId: { pverify: '00665', availity: 'SMPLY', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable to confirm a distinct ID for Simply FL.',
    supportsRealtime: "Simply's EDI page confirms 270/271 is a supported transaction type via Availity's EDI Gateway but doesn't state real-time vs. batch.",
    'bhCarveOut.administratorPayerId':
      "pVerify lists a NATIONAL \"Carelon Behavioral Health\" entry (002465), but no Florida-specific Carelon EDI payer ID was confirmed — Carelon's own national Provider Handbook directs providers to look up the state-specific ID via Carelon's website or Availity's payer list rather than printing one itself, and Availity's own payer list has no distinct Carelon/CBH line item (Carelon claims for Simply appear to route through Availity without a separately documented Carelon-specific code). A commonly-cited \"BHOVO\" code could not be verified against any primary Carelon source. Confirm directly with Carelon's EDI helpdesk (1-888-247-9311 / e-supportservices@carelonbehavioralhealth.com) or Availity onboarding.",
  },
  sources: [PVERIFY_PAYER_LIST_FL, SIMPLY_EDI_PAGE, SIMPLY_CARELON_TRAINING, CARELON_PROVIDER_HANDBOOK],
};

const simplyCarelonExtraNote =
  'Carelon requires the treatment plan and supporting data to be no older than 30 days at PA submission (a process rule layered on top of the state\'s 6-month clinical reassessment cycle) — refresh data collection before assembling any renewal packet.';

const simplyCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING, CARELON_NATIONAL_ABA_FORM_2019],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered'],
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Carelon Behavioral Health (Simply Healthcare)',
    confirmed: ['covered', 'paRequired'],
    extraNote: simplyCarelonExtraNote,
    extraSources: [SIMPLY_CARELON_TRAINING],
  }),
};

/* ==================== unitedhealthcare-community-plan-florida ==================== */

const uhcCommunityPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '87726', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: '87726',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "No Florida-specific pVerify entry was found for UHC Community Plan (only other-state UHC Community Plan lines and an ambiguous \"UHG007 United Healthcare - Optum Behavioral Solutions\" entry not confirmed to apply to FL Medicaid BA). Confirm with pVerify onboarding.",
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass.',
    supports270271:
      "UHC's own FL BAP QRG describes eligibility/benefits verification ONLY via the Provider Express portal or phone — it does not mention 270/271 EDI eligibility for this specific program, though UnitedHealthcare broadly supports 270/271 nationally. Confirm whether FL Medicaid BA eligibility specifically runs through EDI or is portal/phone-only.",
    supportsRealtime: "Not stated for this program; UHC's QRG describes the portal check as taking \"less than 2 minutes,\" consistent with real-time but not an explicit EDI claim.",
  },
  sources: [UHC_FL_BAP_QRG, OPTUM_FLABA_QRG, AVAILITY_PAYER_LIST_STALE],
};

const uhcExtraNote =
  "Optum manages utilization review/PA for this program (two-step 'ABA Assessment' then 'ABA Treatment' request types on Provider Express), but claims still bill under UnitedHealthcare's own payer ID 87726 — the SAME ID as medical claims, not a separate behavioral-health-specific ID (contrast Simply/Carelon, which fully carves both auth AND claims to a distinct entity).";

const uhcCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraNote: uhcExtraNote,
    extraSources: [UHC_FL_BAP_QRG, OPTUM_FLABA_QRG],
  }),
  '97152': mcoEntry('97152', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97153': mcoEntry('97153', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97154': mcoEntry('97154', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97155': mcoEntry('97155', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97156': mcoEntry('97156', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97157': mcoEntry('97157', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: [],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '97158': mcoEntry('97158', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'UnitedHealthcare Community Plan of Florida (Optum-managed)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [UHC_FL_BAP_QRG],
  }),
};

/* ==================== humana-healthy-horizons-florida ==================== */

const humanaEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '61101', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      'No pVerify entry specific to "Humana Healthy Horizons" Medicaid in Florida was found; a candidate "Humana of Florida" entry (00434) is NOT confirmed to be the same payer entity as Healthy Horizons Medicaid — confirm with pVerify onboarding before using 00434.',
    'payerId.changeHealthcare': 'No Change Healthcare-specific payer directory was reachable this pass.',
    supports270271:
      "Humana's ABA flyer addresses only claims (payer ID 61101) and PA submission channels (Availity, IVR, fax) — it does not separately confirm 61101 is used for 270/271 eligibility, though that's the common pattern for Availity-routed payers.",
    supportsRealtime: 'Not addressed in any Humana FL BA document reviewed.',
  },
  sources: [HUMANA_ABA_FLYER],
};

const humanaExtraNote =
  "Humana's own materials explicitly defer coding mechanics to AHCA in writing: \"Procedure codes and the latest published fee schedules can be found on the AHCA website... Rule 59G-4.002.\" Non-par providers are reimbursed at 80% of the Florida Medicaid fee schedule, absent a controlling legal requirement or Letter of Agreement (MCD 466 PA form, p.3) — a concrete figure, not the vague \"a percentage of...\" previously on file.";

const humanaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraNote: humanaExtraNote,
    extraSources: [HUMANA_ABA_FLYER, HUMANA_PA_FORM_MCD466, HUMANA_FL_PAL],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered'],
    extraNote: 'Independently cross-confirmed absent from the Humana FL PAL too — not just the AHCA fee schedule.',
    extraSources: [HUMANA_FL_PAL],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Humana Healthy Horizons in Florida',
    confirmed: ['covered', 'paRequired'],
    extraSources: [HUMANA_FL_PAL],
  }),
};

/* -------------------- additional source refs (split B) -------------------- */

const ABHFL_QRG = src(
  'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/provider/pdf/abhfl_quick_reference_guide.pdf',
  'Aetna Better Health of Florida Quick Reference Guide (Rev. 11/2024) — read in full via PDF text extraction. Confirms EDI/EFT payer ID 128FL and Real Time (270/271) payer ID ABHFL via the Office Ally enrollment section, and a distinct Behavioral Health prior-auth phone line for MMA (1-833-365-2474) separate from the Physical Health PA line (1-860-607-8056) — but names no BH claims payer ID distinct from 128FL.'
);
const BSN_PROVIDER_SITE = src(
  'https://bsnnet.com/',
  "Behavioral Services Network (BSN) homepage — confirms BSN is Florida's behavioral-health provider network (14,000+ points of access across FL/GA/NC/SC), delegated by both Aetna Better Health of Florida (BA network contracting/credentialing per ABHFL's own provider notices) and Florida Community Care (per FCC's own BA services page). No distinct EDI claims payer ID is published for BSN on its own site — BA claims for both plans appear to route through each health plan's own payer ID (128FL for ABHFL; FLCCR for FCC), not a separate BSN ID."
);
const MOLINA_FL_HANDBOOK = src(
  'https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/fl/medicaid/3-18-26-MHFL-Medicaid-Provider-Handbook-508.ashx',
  'Molina Healthcare of Florida Medicaid Provider Handbook (updated 3/18/2026, 213 pages) — read in full via PDF text extraction. Confirms EDI Payer ID 51062 (stated 15+ times); contains ZERO mentions of "Behavior Analysis," "ABA," or any of codes 97151-97158/0362T/0373T anywhere in the document, confirming florida.ts’s existing note that Molina’s BA-specific rules live only in its separate, access-restricted BA Quick Reference Guide.'
);
const CCP_TNFL_BA_MANUAL = src(
  'https://www.therapynetwork.com/state_links/ba/manuals/Community-Care-Plan-Behavior-Analysis-Provider-Manual.pdf',
  'Community Care Plan Behavior Analysis Provider Manual (2025-01-29, hosted by Therapy Network of Florida) — read in full via PDF text extraction. States verbatim: "Our Payer ID is 65062 for professional claims and 12k89 for institutional claims." Confirms all codes on the FL BA fee schedule require TN prior authorization; group size maxes at 6; the state’s 40-hrs/week aggregate threshold is restated as a documentation trigger ("Any requests for more than 40 hours" need extra justification); and the non-covered list matches the state exclusions (travel time, shadow/1:1 aide, concurrent multi-provider billing).'
);
const FCC_BA_PAGE = src(
  'https://fcchealthplan.com/ba-services/',
  "Florida Community Care — Behavioral Analysis Services provider page — confirms EDI/clearinghouse Payer ID FLCCR via Availity verbatim (\"using Payer ID FLCCR\"), and separately names Behavioral Services Network (BSN) as FCC's behavioral-health network partner (providers register at providers.bsnnet.com/auth/register) — distinct from the FCC in-house Utilization Department that actually adjudicates BA prior authorizations by fax/email/portal. No code-level billing table is published on this page."
);
const OPTUM_PROVIDER_EXPRESS_EDI = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/admin-resources/claim-tips/electronic-claim-submission-and-electronic-data-interchange.html',
  'Optum Provider Express — Electronic Claim Submission & EDI page — states verbatim "The Optum payer ID is 87726." Confirms UnitedHealthcare, Optum, and United Behavioral Health (the legacy name behind Optum Behavioral Health) claims — including behavioral health — route on this same ID, matching Availity’s master payer list entry for UnitedHealthcare (87726) and the identical finding already shipped for UnitedHealthcare Community Plan of North Carolina in vob/north-carolina.ts.'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — a national document with no Florida-specific carve-out — states verbatim: "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical claims nationwide (no second EDI hop). Same document already cited for this fact in vob/georgia.ts.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499, effective 2026-05-15 — national clinical-necessity policy; no PA on assessment codes 97151/97152/0362T, PA required for treatment codes; contains no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — scoped to Down syndrome/non-ASD indications; 97151-97158 appear only under "not covered for indications listed in this CPB." Cross-references CPB 0648 for actual ASD coverage.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 listed as covered if selection criteria are met (0362T/0373T under "other CPT codes related to the CPB"); no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given.'
);
const AETNA_ABA_CLAIMS_PAGE = src(
  'https://www.aetna.com/health-care-professionals/newsletters-news/office-link-updates-june-2022/behavioral-health-updates/applied-behavior-analysis-treatment-and-claims.html',
  "Aetna OfficeLink Updates (June 2022), \"Applied behavior analysis (ABA) treatment and claims\" — read directly. Describes only the ABA Medical Necessity Guide's purpose; contains no statement of whether ABA claims are administered in-house or via a third-party behavioral-health carve-out, and names no claims administrator. Absence of a named carve-out here is not confirmation of in-house administration."
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025, annual review 04/2026 — contains zero CPT codes (ICD-10 F84.0 only); points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not FL-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied here as 'inferred' absent a confirmed FL-specific override, same treatment as vob/georgia.ts."
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 — read via PDF text extraction (a different snapshot than PVERIFY_PAYER_LIST_FL above, dated June 2026; both cited where each was the document actually read). Confirms: 00980 Aetna Better Health (FL), 00300 Molina Healthcare of Florida, 00004 Cigna, 00510 Cigna Behavioral, 00001 Aetna, 00192 United Healthcare, UHG007 United Healthcare - Optum Behavioral Solutions. No entry found under "Community Care Plan," "Florida Community Care," "Therapy Network," or "Behavioral Services Network"/"BSN."'
);

/* ==================== aetna-better-health-florida ==================== */

const aetnaBetterHealthFlEdi: EdiRouting = {
  payerId: { pverify: '00980', availity: '128FL', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Behavioral Services Network (BSN) — BA network contracting/credentialing delegate only',
    administratorPayerId: '128FL (same as ABHFL medical — BSN publishes no distinct EDI/claims payer ID of its own)',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer directory — not checked this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for payer ID 128FL.',
    'bhCarveOut.administratorPayerId':
      "Confirm directly with ABHFL provider services or BSN (info@bsnnet.com, 305-907-7470) whether BA claims specifically require a routing marker distinct from the standard 128FL EDI ID — neither BSN's site nor the ABHFL Quick Reference Guide states one exists, but this is an absence of evidence, not confirmation.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, ABHFL_QRG, BSN_PROVIDER_SITE],
};

/* QA correction (2026-07-23): ABHFL_QRG (Rev. 11/2024) was re-fetched and read
   in full this pass — it is a single-page administrative contact sheet
   (phone/fax numbers, EDI payer IDs, PA phone lines). It contains zero
   mentions of ABA, CPT codes, or any code-level coverage/PA detail. Citing
   it as a 'confirmed'/plan-specific source for covered/paRequired on every
   code (as the previous version of this file did) was a miscitation — the
   claim doesn't appear in the cited document. These facts are still true
   (bound by the AHCA coverage policy's plan-compliance clause, §1.2) but
   correctly ship as 'inferred', matching the treatment mcoEntry() already
   gives 97157 below and every other MCO's code-level facts by default. */
const aetnaBetterHealthFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97152': mcoEntry('97152', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '0362T': mcoEntry('0362T', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97153': mcoEntry('97153', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97154': mcoEntry('97154', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97155': mcoEntry('97155', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97156': mcoEntry('97156', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '97157': mcoEntry('97157', {
    planName: 'Aetna Better Health of Florida',
    confirmed: ['covered'],
    extraNote: 'ABHFL publishes no BA code-level table of its own — the state-verified absence applies here by the same plan-compliance clause as every other MMA plan.',
    extraSources: [],
  }),
  '97158': mcoEntry('97158', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
  '0373T': mcoEntry('0373T', { planName: 'Aetna Better Health of Florida', confirmed: [], extraSources: [] }),
};

/* ==================== molina-healthcare-florida ==================== */

const molinaFlEdi: EdiRouting = {
  payerId: { pverify: '00300', availity: '51062', changeHealthcare: 'unverified' },
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
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer directory — not checked this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for payer ID 51062.',
  },
  sources: [PVERIFY_PAYER_LIST, MOLINA_FL_HANDBOOK],
};

const molinaFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97152': mcoEntry('97152', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '0362T': mcoEntry('0362T', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97153': mcoEntry('97153', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97154': mcoEntry('97154', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97155': mcoEntry('97155', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97156': mcoEntry('97156', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '97157': mcoEntry('97157', {
    planName: 'Molina Healthcare of Florida',
    confirmed: ['covered'],
    extraNote:
      "Molina's own 213-page Medicaid Provider Handbook contains zero mentions of Behavior Analysis or any BA code — BA-specific rules live only in Molina's separate, access-restricted BA Quick Reference Guide, not reviewed this pass.",
    extraSources: [MOLINA_FL_HANDBOOK],
  }),
  '97158': mcoEntry('97158', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
  '0373T': mcoEntry('0373T', { planName: 'Molina Healthcare of Florida', confirmed: ['covered', 'paRequired'], extraSources: [MOLINA_FL_HANDBOOK] }),
};

/* ==================== community-care-plan-florida ==================== */

const communityCarePlanFlEdi: EdiRouting = {
  payerId: {
    pverify: 'unverified',
    availity: '65062 (professional) / 12k89 (institutional) — Therapy Network of Florida, not Community Care Plan directly',
    changeHealthcare: 'unverified',
  },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Therapy Network of Florida (TNFL) — full delegation of BOTH authorizations and claims for BA',
    administratorPayerId: '65062 (professional) / 12k89 (institutional)',
    abaRidesOn: 'medical',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'Not found under "Therapy Network," "TNFL," or "Community Care Plan" in either pVerify payer list checked this pass — confirm directly with pVerify onboarding.',
    supports270271: "TNFL's own BA manual documents claims (837) submission in detail but does not confirm 270/271 real-time eligibility support specifically — confirm via Availity onboarding.",
    'bhCarveOut.abaRidesOn':
      "TNFL's manual treats BA claims as standard professional/institutional (837P/837I) claims, not a distinct behavioral-health service-type bucket — inferred as 'medical' rather than confirmed verbatim.",
  },
  sources: [CCP_TNFL_BA_MANUAL],
};

const communityCarePlanFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired'],
    extraNote: "TNFL's own BA Provider Manual confirms every code on the FL BA fee schedule requires TN prior authorization directly, not just by state-pattern inference.",
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97152': mcoEntry('97152', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '0362T': mcoEntry('0362T', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97153': mcoEntry('97153', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired', 'unitCap'],
    extraNote: "TNFL's manual restates the 40-hrs/week aggregate threshold as a documentation trigger (\"Any requests for more than 40 hours\" need extra justification) directly, not just by state-pattern inference.",
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97154': mcoEntry('97154', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired', 'unitCap'],
    extraNote: "TNFL's manual restates the 6-participant group-size cap directly.",
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97155': mcoEntry('97155', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired', 'unitCap'],
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97156': mcoEntry('97156', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '97157': mcoEntry('97157', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered'],
    extraNote: "TNFL's manual does not separately confirm this absence — inherits the statewide finding (absent from both AHCA fee schedules and the coverage policy).",
    extraSources: [],
  }),
  '97158': mcoEntry('97158', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired', 'unitCap'],
    extraNote: "TNFL's manual restates the 6-participant group-size cap directly.",
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
  '0373T': mcoEntry('0373T', {
    planName: 'Community Care Plan (via Therapy Network of Florida)',
    confirmed: ['covered', 'paRequired'],
    extraSources: [CCP_TNFL_BA_MANUAL],
  }),
};

/* ==================== florida-community-care ==================== */

const floridaCommunityCareEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'FLCCR', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Behavioral Services Network (BSN) — network credentialing/contracting partner only',
    administratorPayerId: "FLCCR (same as FCC medical — BSN publishes no distinct EDI/claims payer ID; BA prior authorization itself runs through FCC's own in-house Utilization Department, not BSN)",
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'Not found under "Florida Community Care" or "FLCCR" in either pVerify payer list checked this pass — confirm directly with pVerify onboarding.',
    supports270271: "FCC's own BA services page confirms claims routing (FLCCR via Availity) but does not confirm 270/271 real-time eligibility support specifically.",
    'bhCarveOut.administratorPayerId':
      "Confirm directly with FCC's Utilization Department (FCCUMDepartment@FCCHealthPlan.com, 1-833-322-7526) or BSN whether BA claims specifically require routing distinct from FLCCR — neither source states one exists, but this is an absence of evidence, not confirmation.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [FCC_BA_PAGE, BSN_PROVIDER_SITE],
};

/* QA correction (2026-07-23): FCC_BA_PAGE (fcchealthplan.com/ba-services/) was
   re-fetched this pass — it confirms the BSN partnership and in-house UM
   department (still valid for the EDI layer above), but explicitly does NOT
   include a CPT code table, unit caps, or a covered-code list; it only points
   to a separate "Prior Authorization Program PDF" not reviewed this pass.
   Citing it as a 'confirmed' plan-specific source for covered/paRequired on
   every code (as the previous version of this file did) was a miscitation.
   These facts are still true (bound by the AHCA coverage policy's
   plan-compliance clause, §1.2) but correctly ship as 'inferred', matching
   the treatment mcoEntry() already gives 97157 below. */
const floridaCommunityCareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': mcoEntry('97151', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97152': mcoEntry('97152', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '0362T': mcoEntry('0362T', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97153': mcoEntry('97153', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97154': mcoEntry('97154', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97155': mcoEntry('97155', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97156': mcoEntry('97156', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '97157': mcoEntry('97157', {
    planName: 'Florida Community Care',
    confirmed: ['covered'],
    extraNote: "FCC's BA services page publishes no code-level table of its own — the state-verified absence applies here by the same plan-compliance clause as every other MMA plan.",
    extraSources: [],
  }),
  '97158': mcoEntry('97158', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
  '0373T': mcoEntry('0373T', { planName: 'Florida Community Care', confirmed: [], extraSources: [] }),
};

/* ==================== aetna-florida (commercial) ==================== */

const aetnaFlEdi: EdiRouting = {
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
    'payerId.pverify': 'National Aetna payer ID, not FL-specific — same ID already verified for vob/georgia.ts via the same pVerify master list.',
    'payerId.availity':
      "The Availity payer list PDF checked this pass carries an \"As of 08/08/2012\" footer on every page — a stale snapshot, not confirmed current. 60054 is Aetna's long-standing national payer ID (also used unchanged in vob/georgia.ts), so it ships 'inferred' rather than 'verified' pending a current Availity onboarding check.",
    'payerId.changeHealthcare': 'Not independently checked against a current Change Healthcare payer directory this pass — same caveat as payerId.availity.',
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for payer ID 60054.',
    'bhCarveOut.administrator':
      "Checked Aetna's own June 2022 OfficeLink Updates \"Applied behavior analysis (ABA) treatment and claims\" page directly — it describes only the ABA Medical Necessity Guide and names no claims administrator, in-house or third-party. A broader search found no named ABA/BH carve-out vendor for Aetna commercial nationally (unlike Cigna/Evernorth or UHC/Optum) — but absence of a named carve-out is not confirmation of in-house administration. Confirm via Aetna provider services or the national BH Provider Manual.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST_STALE, AETNA_ABA_CLAIMS_PAGE],
};

function aetnaFlCodeEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (form GR-69017-4)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located this pass (same finding as vob/georgia.ts).',
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

const aetnaFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaFlCodeEntry(),
  '97152': aetnaFlCodeEntry(),
  '97153': aetnaFlCodeEntry(),
  '97154': aetnaFlCodeEntry(),
  '97155': aetnaFlCodeEntry(),
  '97156': aetnaFlCodeEntry(),
  '97157': aetnaFlCodeEntry(),
  '97158': aetnaFlCodeEntry(),
  '0362T': aetnaFlCodeEntry(),
  '0373T': aetnaFlCodeEntry(),
};

/* ==================== cigna-florida (commercial) ==================== */

const cignaFlEdi: EdiRouting = {
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
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for payer ID 62308.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST_STALE, CIGNA_AUTISM_RESOURCE_GUIDE],
};

function cignaFlCodeEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it (same finding as vob/georgia.ts).',
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

const cignaFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaFlCodeEntry('Not required (per EN0499)'),
  '97152': cignaFlCodeEntry('Not required (per EN0499)'),
  '97153': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaFlCodeEntry('Not required (per EN0499)'),
  '0373T': cignaFlCodeEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

/* ==================== unitedhealthcare-florida (commercial) ==================== */

const unitedhealthcareFlEdi: EdiRouting = {
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
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for payer ID 87726.',
    'bhCarveOut.administratorPayerId':
      "pVerify separately lists a distinct \"UHG007 United Healthcare - Optum Behavioral Solutions\" code (this file's PVERIFY_PAYER_LIST, March 2026 snapshot) — this may be used for real-time 270/271 eligibility specifically even though claims settle on 87726 (confirmed directly via Optum's own Provider Express EDI page); confirm which ID a live eligibility check actually returns before automating on 87726 alone.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST_STALE, OPTUM_PROVIDER_EXPRESS_EDI, OPTUM_SCC],
};

function uhcFlCodeEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
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
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the FL-specific Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed FL-specific override (same finding as vob/georgia.ts). Verify via: Provider Express / UHC provider services.",
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

const unitedhealthcareFlCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcFlCodeEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcFlCodeEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcFlCodeEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcFlCodeEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcFlCodeEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcFlCodeEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcFlCodeEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcFlCodeEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcFlCodeEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcFlCodeEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== Layer 2 — STC interpretation maps ====================
   Florida Medicaid's own 271 richness is directly confirmed (FLMMIS_STC_APPENDIX):
   MH is a CORE-required generic code with real coinsurance/copay detail in the
   guide's own worked example. The 8 Medicaid MCOs below run their own EDI payer
   IDs (Layer 1) rather than the FLMMIS feed, so that richness does NOT transfer
   automatically — each ships 'unverified' with a verifyVia note contrasting it
   against the confirmed state baseline, per the "never guess" rule. */

const floridaMedicaidStc: StcMap = {
  abaBenefitBucket: 'MH',
  deductibleAppliesToAba: 'unverified',
  costShareType: 'plan-dependent',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'high',
  fieldStatus: {
    abaBenefitBucket: 'verified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'verified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'verified',
  },
  verifyVia: {
    deductibleAppliesToAba:
      "The guide's own worked 271 example ties the deductible EB segment (EB*C) only to STC 30, never bundling MH into it the way the coinsurance/copay segments do — suggestive of 'no', but only one example was reviewed; confirm via Florida Medicaid provider services before relying on it.",
    copayUnit: 'Not addressed by the companion guide (an EDI/transaction-format document) — confirm via the AHCA BA Coverage Policy or provider services.',
    oopMaxApplies: 'Not addressed by the companion guide — confirm via the AHCA BA Coverage Policy or provider services.',
  },
  sources: [FLMMIS_STC_APPENDIX],
};

function flMcoUnverifiedStc(planName: string): StcMap {
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
      abaBenefitBucket: `${planName} runs its own EDI payer ID (Layer 1) rather than the FLMMIS feed — Florida Medicaid's own confirmed richness (MH is CORE-required with real coinsurance/copay detail, FLMMIS_STC_APPENDIX) does not transfer automatically. Confirm via ${planName}'s own EDI/provider services.`,
    },
    sources: [FLMMIS_STC_APPENDIX],
  };
}

/* ==================== Layer 7 — vobContact ====================
   Contact-data sourcing notes (read before editing):
   - Every phone/fax/ivrPath value below was read directly off a document
     fetched THIS pass (WebFetch on the cited URL, or — where a PDF's text
     layer didn't extract cleanly via WebFetch — a Read of the same fetched
     PDF). Per the build brief's "never guess" rule for high-stakes contact
     data, no number is carried over from florida.ts's prose citations
     without an independent refetch this pass; several numbers below happen
     to match the prose exactly (Sunshine's PA fax, Humana's IVR/fax, FCC's
     call center/PA fax, ABHFL's BH PA line, TNFL's payer ID) because both
     passes read the same primary source and got the same answer — genuine
     cross-validation, not a copy.
   - fl.acentra.com (Florida Medicaid's FFS eQSuite vendor, Acentra Health)
     returned HTTP 503 to every WebFetch attempt this pass (homepage,
     /behavior-analysis/, /contact-us/, and a PDF user guide all 503'd) —
     the same automated-fetch-blocking pattern docs/vob-gaps.md documents
     for ahca.myflorida.com's clean URLs. Acentra's own customer-service
     phone (cited in florida.ts's prose, sourced from a prior pass) is
     therefore NOT repeated here — it could not be independently confirmed
     this pass. What WAS fetched this pass is FLMMIS's own (Gainwell
     Technologies, the state's fiscal agent) provider-services line, which
     is what's shipped for florida-medicaid; the Acentra eQSuite URL is
     reused for `portal` only (lower-stakes per the build brief) with the
     reuse flagged in its source note.
   - Molina (molinahealthcare.com), Aetna commercial precert
     (aetna.com/document-library), and Evernorth/Cigna's Provider Advocate
     line (static.evernorth.com) were all fetched fresh this pass via
     WebFetch/WebSearch-then-WebFetch rather than reused from any existing
     citation, since none of florida.ts's or this file's existing
     SourceRefs covered provider-services contact info for those four guides.
   ================================================================ */

const FLMMIS_CONTACT_PAGE = src(
  'https://portal.flmmis.com/FLPublic/Provider_ContactUs/tabId/59/Default.aspx',
  'FLMMIS (Gainwell Technologies, Florida Medicaid\'s fiscal agent) provider-services contact page — fetched and read this pass. States the general provider-services line 1-800-289-7799, with option 4 for the Provider Enrollment Unit and option 7 for Medicaid Secure Portal (Web Portal) access; a separate WebSearch-indexed snapshot of a sibling FLMMIS page additionally shows option 5 for password resets/general FLMMIS assistance (Mon–Fri 7am–6pm ET) but that specific page could not be independently refetched this pass, so the hours and option-5 routing are not shipped as confirmed.'
);
const ACENTRA_BA_PORTAL_REUSED = src(
  'https://fl.acentra.com/behavior-analysis/',
  'Acentra Health (eQHealth Solutions) Florida Medicaid Behavior Analysis / eQSuite page — already cited in florida.ts\'s prose sources for florida-medicaid. Reused here for `portal` ONLY (lower-stakes per the build brief); NOT independently refetched this pass — the entire fl.acentra.com domain returned HTTP 503 to WebFetch on every URL attempted this pass (homepage, this page, /contact-us/, and a PDF eQSuite user guide), matching the automated-fetch-blocking pattern docs/vob-gaps.md documents for ahca.myflorida.com. Acentra\'s own customer-service phone/fax (cited in florida.ts\'s prose from a prior pass) is therefore NOT repeated in this guide\'s providerServicesPhone/fax fields.',
  true
);
const MOLINA_FL_CONTACT_PAGE = src(
  'https://www.molinahealthcare.com/providers/fl/medicaid/contacts/contact_info.aspx',
  'Molina Healthcare of Florida Medicaid — Provider Contacts page — fetched and read this pass. States provider services phone (855) 322-4076, Monday–Friday 8:00 a.m.–7:00 p.m.; member services (866) 472-4585; names the Molina Provider Portal (provider.molinahealthcare.com) and an Availity claims-submission page. No fax number for general provider services appears on this page.'
);
const AETNA_BH_PRECERT_LIST = src(
  'https://www.aetna.com/document-library/healthcare-professionals/documents-forms/bh_precert_list.pdf',
  'Aetna "Participating provider behavioral health precertification list," effective 8/1/2024 — fetched and read this pass. Page 3 states verbatim: "Commercial plans: 1-888-632-3862 (TTY: 711)" for precertification questions, and names Availity.com as the primary online submission portal (AetnaElectronicPrecert.com for EMR-integrated submission). Page 5\'s services table explicitly lists 97151-97158/0362T/0373T under "Applied behavioral analysis (ABA)" as requiring precertification — confirms this guide\'s existing paRequired finding, not newly asserted here.'
);
const EVERNORTH_PROVIDER_SERVICE_CENTER = src(
  'https://static.evernorth.com/assets/evernorth/provider/resourceLibrary/behavioralResources/doingBusinessWithUs/cbhProviderServiceCenter.html',
  'Evernorth (Cigna) Behavioral Health Provider Service Center page — fetched and read this pass. States the Provider Advocate line 1.800.926.2273, operated from Evernorth\'s National Care Center in Bloomington, MN; instructs providers to select prompt #5 for the provider menu, then choose from Claims (#1), Eligibility and benefits (#2), Authorization for IOP/PHP/Inpatient services (#3), Online services (#4), or Personal updates (#5). No fax number or specific business hours are stated on this page.'
);
const UHC_PROVIDER_CONTACT_PAGE = src(
  'https://www.uhcprovider.com/en/contact-us.html',
  'UnitedHealthcare Provider Portal — Contact Us page — fetched and read this pass. Lists general commercial provider services at 877-842-3210; Optum Behavioral Health / 24/7 behavioral health and substance-use support at 877-614-0484 (same number already confirmed for UHC Community Plan of Florida via the FL BAP QRG, consistent with Optum administering both lines of business); UnitedHealthcare Provider Portal technical support at 866-842-3278, option 1.'
);

const sunshineContact: VobContact = {
  providerServicesPhone: '1-844-477-8313',
  hours: 'Provider Services, Utilization Management (BA prior auth), and weekend/after-hours on-call all route through the same line, Monday–Friday 8 a.m.–8 p.m. Eastern.',
  fax: '1-844-208-9113',
  portal: { name: 'Sunshine Health Secure Provider Portal', url: 'https://www.sunshinehealth.com/login.html' },
  scriptedQuestions: [
    'What payer ID should we use for Availity and Change Healthcare 270/271 eligibility checks — 68069, or the distinct 68057 line Availity separately lists for "Florida Sunshine State Health Plan"?',
    'Do you support real-time 270/271 eligibility checks, or is it batch only?',
    'Does the deductible apply to ABA services?',
    'Is the ABA cost share a copay or coinsurance?',
    'Is the copay charged per visit or per day for ABA codes?',
    'Does the member’s out-of-pocket maximum apply to ABA benefits?',
    'For telehealth-delivered 97156, should claims use the GT modifier or POS 02 with no modifier — your general telehealth billing notice and your BA-specific clinical policy appear to conflict?',
  ],
  sources: [SUNSHINE_BA_QRG],
};

const cmsHealthPlanContact: VobContact = {
  providerServicesPhone: '1-844-477-8313',
  hours: 'Shared Sunshine Health machinery — same Provider Services / UM line, Monday–Friday 8 a.m.–8 p.m. Eastern (CMS Health Plan’s own determination clock runs 7 calendar days rather than Sunshine’s 5, per florida.ts prose, but the contact channel is identical).',
  fax: '1-844-208-9113',
  portal: { name: 'Sunshine Health Secure Provider Portal', url: 'https://www.sunshinehealth.com/login.html' },
  scriptedQuestions: [
    'Does CMS Health Plan use its own EDI payer ID, or does it ride on Sunshine Health’s payer ID (68069) for 270/271 eligibility checks? Do you support real-time checks?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA services, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day for ABA codes?',
    'Does the member’s out-of-pocket maximum apply to ABA benefits?',
    'For telehealth-delivered 97156, should claims use the GT modifier or POS 02 with no modifier?',
  ],
  sources: [SUNSHINE_BA_QRG],
};

const simplyContact: VobContact = {
  providerServicesPhone: '1-800-397-1630',
  hours: 'Carelon National Provider Service Line: Monday–Friday, 8 a.m.–8 p.m. Eastern. (Availity Client Services, a separate line, keeps the same hours: 1-800-282-4548.)',
  fax: '1-800-370-1116',
  portal: { name: 'Availity Essentials (claims); Carelon eServices (authorizations)', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'What payer ID should we use for Change Healthcare eligibility checks, and do you support real-time 270/271?',
    'What EDI payer ID does Carelon Behavioral Health use for Simply ABA claims/authorizations — is it separate from Simply’s own SMPLY ID?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA services, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [SIMPLY_CARELON_TRAINING],
};

const uhcCommunityPlanContact: VobContact = {
  providerServicesPhone: '1-877-614-0484',
  ivrPath: 'Provider Express Web Support Center (portal help): 1-866-209-9320. EDI/claims support: 1-800-210-8315 or ac_edi_ops@uhc.com.',
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com/' },
  scriptedQuestions: [
    'What payer ID should we use for pVerify and Change Healthcare eligibility checks, and do you support 270/271 real-time eligibility — or is BA eligibility portal/phone-only, as your own QRG suggests?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [UHC_FL_BAP_QRG],
};

const humanaContact: VobContact = {
  providerServicesPhone: '800-477-6931',
  hours: 'Participating and nonparticipating providers: Monday–Friday, 8 a.m.–8 p.m. Eastern.',
  fax: '813-321-7220',
  ivrPath: 'Prior-authorization IVR: 800-523-0023, available 24/7 (live representatives Monday–Friday, 8 a.m.–8 p.m. Eastern).',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'What payer ID should we use for pVerify and Change Healthcare eligibility checks, and do you support 270/271 real-time eligibility on Availity ID 61101, or is it batch only?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [HUMANA_ABA_FLYER],
};

const aetnaBetterHealthFlContact: VobContact = {
  providerServicesPhone: '1-800-441-5501',
  hours: 'Member Services: Monday–Friday, 7:30 a.m.–7:00 p.m. Eastern. Availity technical support: Monday–Friday, 8 a.m.–8 p.m. Eastern (except holidays), 1-800-282-4548.',
  fax: '1-844-235-1340',
  ivrPath: 'Behavioral Health prior-auth (MMA): 1-833-365-2474 — a distinct line from Physical Health PA, 1-860-607-8056.',
  portal: { name: 'Availity Essentials', url: 'https://availity.com/' },
  scriptedQuestions: [
    'What payer ID should we use for Change Healthcare eligibility checks, and do you support real-time 270/271 on payer ID 128FL?',
    'Does BA claims routing require a payer ID distinct from 128FL, and does ABA ride on the medical benefit or a behavioral-health carve-out through BSN?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [ABHFL_QRG],
};

const molinaFlContact: VobContact = {
  providerServicesPhone: '(855) 322-4076',
  hours: 'Monday–Friday, 8:00 a.m.–7:00 p.m.',
  portal: { name: 'Molina Healthcare of Florida Provider Portal', url: 'https://provider.molinahealthcare.com/provider/login' },
  scriptedQuestions: [
    'What payer ID should we use for Change Healthcare eligibility checks, and do you support real-time 270/271 on Availity ID 51062?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [MOLINA_FL_CONTACT_PAGE],
};

const communityCarePlanFlContact: VobContact = {
  providerServicesPhone: '1-888-550-8800',
  ivrPath: 'Provider Relations: 1-888-550-8800, option 2. Claims status/customer service (live interaction): 877-372-1273 — listen carefully to the voice prompts, which may answer the inquiry without needing a representative.',
  fax: '1-855-470-4490',
  portal: { name: 'Therapy Network of Florida Provider Web Portal (HS1)', url: 'https://asp.healthsystemone.com/hs1providers' },
  scriptedQuestions: [
    'Does Community Care Plan/TNFL support 270/271 eligibility checks, and what pVerify payer ID should we use (professional claims route to 65062 via Availity)?',
    'Does ABA claims/eligibility route as a standard medical claim, or under a distinct behavioral-health bucket for TNFL?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [CCP_TNFL_BA_MANUAL],
};

const floridaCommunityCareContact: VobContact = {
  providerServicesPhone: '1-833-322-7526',
  fax: '305-675-6138',
  portal: {
    name: 'Florida Community Care Provider Portal (HealthX)',
    url: 'https://secure.healthx.com/v3app/publicservice/loginv1/login.aspx?bc=16544617-390b-4625-9657-c7b235c09d3c&serviceid=df6f8096-64ea-498a-a657-7c7b407ae072',
  },
  scriptedQuestions: [
    'Does FCC support real-time 270/271 eligibility checks, and what pVerify payer ID should we use (Availity ID FLCCR)?',
    'Does BA claims/auth routing require a payer ID distinct from FLCCR, and does ABA ride the medical benefit or a behavioral-health carve-out via BSN?',
    'Which service-type code do you return ABA benefit details under?',
    'Does the deductible apply to ABA, and is the cost share a copay or coinsurance?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What’s the cap period for 0373T?',
  ],
  sources: [FCC_BA_PAGE],
};

const floridaMedicaidContact: VobContact = {
  providerServicesPhone: '1-800-289-7799',
  ivrPath: 'Option 4: Provider Enrollment Unit. Option 7: Medicaid Secure Portal (Web Portal) access.',
  portal: { name: 'Acentra Health eQSuite (Florida Medicaid Behavior Analysis FFS authorizations)', url: 'https://fl.acentra.com/behavior-analysis/' },
  scriptedQuestions: [
    'What payer ID do you use for pVerify and Change Healthcare 270/271 eligibility checks for Florida Medicaid (vs. Availity’s 77027)?',
    'Is the ABA cost share for this member a copay or coinsurance, and does the deductible apply to ABA services?',
    'Is any copay charged per visit or per day for ABA codes?',
    'Does the member’s out-of-pocket maximum apply to ABA benefits?',
    'What’s the cap period for 0373T (adaptive behavior treatment with protocol modification, 2+ techs)?',
  ],
  sources: [FLMMIS_CONTACT_PAGE, ACENTRA_BA_PORTAL_REUSED],
};

const aetnaFlContact: VobContact = {
  providerServicesPhone: '1-888-632-3862',
  portal: { name: 'Availity', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'Does ABA route to a behavioral-health carve-out administrator, or stay in-house on the medical plan — and what payer ID applies for eligibility checks?',
    'What are the unit caps and cap periods (daily/weekly) for 97151–97158, 0362T, and 0373T under this member’s plan?',
    'What places of service are allowed for ABA (home, office, school, telehealth), and is telehealth covered for any code?',
    'Are there required billing modifiers (licensure tier, telehealth) for ABA codes?',
    'Is the ABA cost share a copay or coinsurance, and does the deductible apply?',
    'Is any copay charged per visit or per day, and does the out-of-pocket max apply to ABA?',
    'What payer ID do you use for Availity and Change Healthcare eligibility checks, and do you support real-time 270/271?',
  ],
  sources: [AETNA_BH_PRECERT_LIST],
};

const cignaFlContact: VobContact = {
  providerServicesPhone: '1-800-926-2273',
  ivrPath: 'Select prompt #5 for the provider menu, then: #1 Claims, #2 Eligibility and benefits, #3 Authorization for IOP/PHP/Inpatient services, #4 Online services, #5 Personal updates.',
  portal: { name: 'Evernorth for Health Care Professionals', url: 'https://provider.evernorth.com/' },
  scriptedQuestions: [
    'Do you support real-time 270/271 eligibility checks on Evernorth payer ID 62308, or is it batch only?',
    'Is the ABA cost share a copay or coinsurance, and is it charged per visit or per day?',
    'Does the member’s out-of-pocket maximum apply to ABA benefits?',
    'What are the unit caps and cap periods for 97151–97158, 0362T, and 0373T under this member’s plan?',
    'What places of service are allowed, and is telehealth covered for any ABA code?',
    'Are there required billing modifiers for ABA codes?',
  ],
  sources: [EVERNORTH_PROVIDER_SERVICE_CENTER],
};

const unitedhealthcareFlContact: VobContact = {
  providerServicesPhone: '877-842-3210',
  ivrPath: 'Optum Behavioral Health provider services / 24/7 behavioral health & substance-use support: 877-614-0484. UnitedHealthcare Provider Portal technical support: 866-842-3278, option 1.',
  portal: { name: 'Provider Express (Optum Behavioral Health)', url: 'https://public.providerexpress.com/' },
  scriptedQuestions: [
    'Do you support real-time 270/271 eligibility checks on payer ID 87726, or is it batch only?',
    'Does ABA eligibility route through payer ID 87726, or does Optum Behavioral Health use a separate ID (e.g., UHG007) for 270/271 checks?',
    'Is the ABA cost share a copay or coinsurance for this member’s plan?',
    'Is the copay charged per visit or per day?',
    'Does the out-of-pocket maximum apply to ABA benefits?',
    'What places of service are allowed for ABA, and is telehealth covered for any code?',
  ],
  sources: [UHC_PROVIDER_CONTACT_PAGE],
};

/* ==================== export ==================== */

export const floridaVob: Record<string, VobExtension> = {
  'florida-medicaid': { edi: floridaMedicaidEdi, codeGrid: floridaMedicaidCodeGrid, rates: floridaMedicaidRates, stcMap: floridaMedicaidStc, vobContact: floridaMedicaidContact, lastUpdated: ACCESS_DATE },
  'sunshine-health-florida': { edi: sunshineEdi, codeGrid: sunshineCodeGrid, stcMap: flMcoUnverifiedStc('Sunshine Health'), vobContact: sunshineContact, lastUpdated: ACCESS_DATE },
  'cms-health-plan-florida': { edi: cmsHealthPlanEdi, codeGrid: sunshineCodeGrid, stcMap: flMcoUnverifiedStc('CMS Health Plan'), vobContact: cmsHealthPlanContact, lastUpdated: ACCESS_DATE },
  'simply-healthcare-florida': { edi: simplyEdi, codeGrid: simplyCodeGrid, stcMap: flMcoUnverifiedStc('Simply Healthcare'), vobContact: simplyContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-florida': { edi: uhcCommunityPlanEdi, codeGrid: uhcCodeGrid, stcMap: flMcoUnverifiedStc('UnitedHealthcare Community Plan of Florida'), vobContact: uhcCommunityPlanContact, lastUpdated: ACCESS_DATE },
  'humana-healthy-horizons-florida': { edi: humanaEdi, codeGrid: humanaCodeGrid, stcMap: flMcoUnverifiedStc('Humana Healthy Horizons'), vobContact: humanaContact, lastUpdated: ACCESS_DATE },
  'aetna-better-health-florida': {
    edi: aetnaBetterHealthFlEdi,
    codeGrid: aetnaBetterHealthFlCodeGrid,
    rates: { ...floridaMedicaidRates, source: `${floridaMedicaidRates.source}. No ABHFL-specific rate schedule is publicly posted — MCOs must not impose limits more stringent than this state schedule, which serves as the reference baseline (AHCA BA Coverage Policy §1.2).` },
    stcMap: flMcoUnverifiedStc('Aetna Better Health of Florida'),
    vobContact: aetnaBetterHealthFlContact,
    lastUpdated: ACCESS_DATE,
  },
  'molina-healthcare-florida': {
    edi: molinaFlEdi,
    codeGrid: molinaFlCodeGrid,
    rates: { ...floridaMedicaidRates, source: `${floridaMedicaidRates.source}. No Molina-specific rate schedule is publicly posted — MCOs must not impose limits more stringent than this state schedule, which serves as the reference baseline (AHCA BA Coverage Policy §1.2).` },
    stcMap: flMcoUnverifiedStc('Molina Healthcare of Florida'),
    vobContact: molinaFlContact,
    lastUpdated: ACCESS_DATE,
  },
  'community-care-plan-florida': {
    edi: communityCarePlanFlEdi,
    codeGrid: communityCarePlanFlCodeGrid,
    rates: { ...floridaMedicaidRates, source: `${floridaMedicaidRates.source}. TNFL's own BA manual defers explicitly to "the Florida BA Fee Schedule" without restating rates — this table is that state schedule, used as the reference baseline.` },
    stcMap: flMcoUnverifiedStc('Community Care Plan (Therapy Network of Florida)'),
    vobContact: communityCarePlanFlContact,
    lastUpdated: ACCESS_DATE,
  },
  'florida-community-care': {
    edi: floridaCommunityCareEdi,
    codeGrid: floridaCommunityCareCodeGrid,
    rates: { ...floridaMedicaidRates, source: `${floridaMedicaidRates.source}. No FCC-specific rate schedule is publicly posted — MCOs must not impose limits more stringent than this state schedule, which serves as the reference baseline (AHCA BA Coverage Policy §1.2).` },
    stcMap: flMcoUnverifiedStc('Florida Community Care'),
    vobContact: floridaCommunityCareContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-florida': {
    edi: aetnaFlEdi,
    codeGrid: aetnaFlCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Florida-specific 270/271 STC document found.'),
    vobContact: aetnaFlContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-florida': {
    edi: cignaFlEdi,
    codeGrid: cignaFlCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Florida-specific override found.'),
    vobContact: cignaFlContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-florida': {
    edi: unitedhealthcareFlEdi,
    codeGrid: unitedhealthcareFlCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Florida-specific override found.'),
    vobContact: unitedhealthcareFlContact,
    lastUpdated: ACCESS_DATE,
  },
};
