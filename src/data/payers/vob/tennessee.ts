/* ================================================================
   VOB ENRICHMENT — Tennessee, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables, Medicaid
   guides only). See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - TennCare is 100% MCO-administered ABA — no direct state FFS ABA
     program. The shared "ABA Provider Requirements and Program
     Description" (rev. 06/13/2024, TNWP-CD-061917-24) and the
     "Universal Request for ABA" form (TN-WP-CD-000947-25-S506-A,
     Jan 2026) are the coding-mechanics sources for all three MCOs'
     shared baseline — already cited in src/data/payers/tennessee.ts.
     Both were fetched and read in full this pass (unlike GA's
     inaccessible companion guide): the Program Description's own
     "ABA Codes" appendix and the Universal Request form's CPT table
     cover ONLY 97151-97158 — 0362T and 0373T appear in NEITHER
     document, so they're marked "not confirmed in the shared code
     set" for wellpoint-tennessee and
     unitedhealthcare-community-plan-tennessee. BlueCare Tennessee is
     the one confirmed exception: its own 563-page Provider
     Administration Manual (H3259_W14_P2_07012026 v2) carries full CPT
     descriptions for 0362T AND 0373T in its own ABA code table — a
     genuine, sourced per-MCO difference, not collapsed into one
     shared value. tenncare-tennessee-medicaid (the umbrella guide)
     reflects this as "mixed by MCO," not a single yes/no.
   - TennCare's state-level EDI is documented in its own public "EDI
     Front Matter" (V8.0, February 2026) — unlike GA's companion
     guide, this document WAS retrievable in full and confirms 270/271
     eligibility (X12 V5010X279A1) is handled directly by TennCare —
     NOT brokered through its Managed Care Contractors (MCCs), which
     instead process 276/277, 278, 820, 834, 835, and 837I/D/P — via
     real-time SOAP (~0.5s avg response, $10,000 setup + $0.04/req) or
     batch SFTP (up to 100,000 members/file, $2,500 setup +
     $0.02/req). It does NOT name a loop/segment for MCO enrollment or
     a carrier-code crosswalk — the actual TennCare Companion Guide
     (TCCG) covering that detail is, per the Front Matter itself,
     "available to registered Trading Partners upon request," not a
     public download. medicaid271Notes is therefore unverified for the
     same reason GA's was (a real, confirmed gap, not a placeholder to
     fill), but with a much more specific verifyVia (request the TCCG
     from EDI.TennCare@tn.gov) than GA's "portal returns 403."
   - Because the state's own EDI Front Matter positions 270/271 as a
     state-run transaction (not an MCC/MCO one), none of the three
     MCOs has a confirmed MCO-specific 270/271 trading-partner
     relationship of its own for TennCare eligibility in any source
     found this pass — each MCO's supports270271/supportsRealtime is
     marked unverified for exactly this reason, with a verifyVia
     pointing back to the state-level pVerify entry ("00185 Tennessee
     Medicaid (TennCare)," Elig=Yes) as the practical fallback for
     confirming TennCare enrollment before routing to a specific MCO.
     UnitedHealthcare Community Plan of Tennessee is the one
     exception: pVerify's own list separately carries a dedicated
     "UHG003 United Healthcare Community Plan Tennessee" line flagged
     Elig=Yes, so supports270271 is verified true for that guide only.
   - TennCare publishes no ABA fee schedule at all — confirmed in
     tennessee.ts's own "Rates: negotiated, not published" section and
     re-confirmed here via the same CSG South comparison document
     (every TN cell blank). All four Medicaid guides ship an explicit
     RateTable with every byCode entry set to the literal 'unverified'
     and a source explaining why, pointing to the member's specific
     MCO provider contract as the only source of truth. This is the
     correct, confirmed outcome per the build spec — not a gap to be
     filled with a number.
   - Commercial Aetna/Cigna/UnitedHealthcare sections reuse the exact
     national source set and codeGrid factory pattern georgia.ts
     already established (AETNA_CPB0554/0648, CIGNA_EN0499, OPTUM_SCC,
     OPTUM_REIMBURSEMENT_POLICY) — these are national policies with no
     TN-specific coding mechanics published, so the "unverified, not
     invented" fields carry over unchanged. Note: tennessee.ts's own
     prose cites an Aetna precert form "GR-69017-4" and an Optum
     "two-step, every 4-6 months / 80% utilization" cadence for UHC —
     georgia.ts's own QA re-check (2026-07-23) found neither fact
     actually stated in the cited CPBs/Optum documents and removed
     them from its codeGrid. This file follows georgia.ts's finding
     (not tennessee.ts's older, unverified-against-source prose) for
     the same reason: the underlying primary source doesn't say it.
   - pVerify's public payer list (3/2026, 54 pages) and Availity's
     public 837 payer list (57 pages) were both fetched and searched
     directly this pass (not just copied from georgia.ts's cached
     findings). The Availity list still carries the same "As of
     08/08/2012" footer QA'd in georgia.ts/aetna-florida; any row
     pulled from it is fieldStatus 'inferred', not 'verified', per that
     same precedent. No BlueCare-, Wellpoint-, or TennCare-Medicaid-
     specific row was found anywhere in that document — only the
     national Aetna/Cigna/UnitedHealthcare commercial rows.
   - Wellpoint Tennessee's own provider EDI page (fetched directly)
     states its Availity payer ID is WLPNT — a live, TN-specific,
     low-staleness primary source, unlike the 2012 Availity snapshot.
     UnitedHealthcare's own multistate "Claims Payer List for
     UnitedHealthcare, Affiliates and Strategic Alliances" (dated
     5/13/2026, same document already cited in carveouts.ts's NY row)
     gives UnitedHealthcare Community Plan of TN its own Medical Payer
     ID (95378) distinct from the multi-state 87726 grouping used for
     most other states — but the stale 2012 Availity snapshot maps
     that same number (95378) to a DIFFERENT UHC affiliate ("UNITED
     HEALTHCARE OF RIVER VALLEY"), a genuine cross-source conflict
     flagged here rather than silently resolved (same treatment as the
     87726/UHG007 conflict already flagged in carveouts.ts for NY).
   - bhCarveOut fields throughout are kept consistent with the rows
     already shipped in vob/carveouts.ts (Cigna/Evernorth 62308 no
     second hop; Aetna commercial fully unverified; UHC commercial TN
     unverified; UHC Medicaid TN's weak "Optum platform" label
     unverified; Wellpoint TN Medicaid "no BH vendor named"). BlueCare
     Tennessee has no row in carveouts.ts at all — a real gap. This
     file's own read of BlueCare's 563-page Provider Administration
     Manual found "Applied Behavior Analyst Services" listed as one of
     many Behavioral Health PA categories BlueCare handles directly,
     submitted via BlueCare's own forms — no external BH vendor
     (Carelon/Optum/Magellan) named anywhere in its Behavioral Health
     sections — so administrator is set to 'none — in-house' with
     fieldStatus 'inferred' (absence-based, same pattern already used
     for the healthy-blue-north-carolina carveout row), not upgraded to
     a fully 'verified' none.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef, StcMap } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared national source refs (reused from georgia.ts's set) -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 (54 pages) — fetched and searched directly this pass for every Tennessee-relevant row (TennCare, BCBS Tennessee, Amerigroup/Wellpoint, UHC Community Plan Tennessee, plus the national Aetna/Cigna/UHC commercial rows).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs, 57 pages) — same "As of 08/08/2012" footer QA\'d in georgia.ts/aetna-florida. Row-level extraction this pass confirms 60054=AETNA, 87726=UNITEDHEALTHCARE, 62308=CIGNA present in that 2012 snapshot, plus 95378=UNITED HEALTHCARE OF RIVER VALLEY (a different UHC affiliate than TN\'s current 95378 — see UHC_CLAIMS_PAYER_LIST below). No BlueCare-, Wellpoint-, or TennCare-Medicaid-specific row was found anywhere in the document.',
  true
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — scoped to Down syndrome/non-ASD indications; cross-references CPB 0648 for actual ASD coverage. No ABA coding/reimbursement policy located.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 covered if selection criteria are met; 0362T/0373T under "other CPT codes related to the CPB." No unit caps, POS codes, telehealth modifiers, or the "GR-69017-4" precert form number tennessee.ts\'s prose cites are stated anywhere in this document — same QA finding georgia.ts made for aetna-georgia (2026-07-23).'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — pure clinical-necessity policy; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers.'
);
const CIGNA_AUTISM_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim "Use Evernorth payer ID 62308," confirming ABA claims use the SAME payer ID as Cigna medical claims nationally (no separate Evernorth EDI hop).'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria, Policy BH803ABASCC082025 — contains zero CPT codes; points to a separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  'Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not TN-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; applied here as \'inferred\' absent a confirmed TN-specific override, same treatment georgia.ts gave unitedhealthcare-georgia.'
);

/* -------------------- Tennessee-specific source refs -------------------- */

const TENNCARE_EDI_FRONT_MATTER = src(
  'https://www.tn.gov/content/dam/tn/tenncare/documents/HCFATennCareEDIFrontMatter.pdf',
  'TennCare EDI Front Matter, V8.0, February 2026 (15 pages, fetched and read in full) — states 270/271 (X12 V5010X279A1) is a transaction "Submitted Directly to/from TennCare," NOT among the transactions "Processed Through Managed Care Contractors (MCCs)" (276/277, 278, 820, 834, 835, 837I/D/P). Confirms real-time SOAP (~0.5s avg response, one-time $10,000 setup + $0.04/eligibility request) and batch SFTP (1-100,000 members/file, one-time $2,500 setup + $0.02/request) as the two direct 270/271 channels. Does NOT name a loop/segment for MCO enrollment or a carrier-code crosswalk — states the actual TennCare Companion Guide (TCCG) covering that detail is "available to registered Trading Partners upon request," not a public download.'
);
const TN_PROGRAM_DESCRIPTION = src(
  'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABARequirements.pdf',
  'ABA Provider Requirements & Program Description — TennCare MCOs, rev. 06/13/2024 (TNWP-CD-061917-24; 16 pages, fetched and read in full). Its own "ABA Codes" appendix (Assessment Codes + Initiation/Continuation Codes tables) lists ONLY 97151, 97152, 97153 (BA/RBT split), 97154, 97155, 97156, 97157, 97158 — 0362T and 0373T appear nowhere in the document. Telehealth section is qualitative appropriateness guidance only (interstate licensure, safety, technology limits, CMS telehealth-services link) — no POS code or modifier (GT/95) given.'
);
const TN_UNIVERSAL_REQUEST_FORM = src(
  'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_RequestABA.pdf',
  'Universal Request for Applied Behavior Analysis (ABA) form, TN-WP-CD-000947-25-S506-A, January 2026 (9-page fillable form, fetched and read in full). Its own CPT code table lists ONLY 97151 (modifier HO), 97152 (HM), 97153 (HO or HM, "indicate with modifier" for BA vs. RBT), 97154 (HM), 97155 (HO), 97156 (HO), 97157 (HO), 97158 (HO), plus a blank "Other" row — no 0362T/0373T row. States units "should reflect 15-minute increments," gives no printed numeric unit cap (the "Units Per Week"/"Units per Authorization period" columns are blank fields the requester fills in), and separates Place of Service into checkboxes (Clinic/Home/Community/School/Telehealth/Other) with no CMS POS numbers. A per-code "Indicate if Hours are telehealth" checkbox exists but no modifier is specified. Confirms the 26-week/6-month authorization period, the <90%-utilization-on-97153 written-explanation rule (formula: units used / units approved x 100), and that 97156 (parent training) volume is tracked separately at continuation — all already in tennessee.ts\'s prose.'
);
const TN_OVERVIEW_UPDATES = src(
  'https://www.provider.wellpoint.com/docs/gpp/TN_WLP_CAID_BH_ABAOverviewofUpdates.pdf',
  'Tri-MCO ABA Overview of Updates, Sept 2024 — already cited in tennessee.ts for MCO contact details; no additional code-level billing mechanics beyond the Program Description/Universal Request form.'
);
const BLUECARE_PAM = src(
  'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf',
  'BlueCare Tennessee Provider Administration Manual, H3259_W14_P2_07012026 v2 (563 pages, fetched and searched in full this pass). Its own Applied Behavior Analysis section gives full CPT descriptions for ALL TEN codes including 0362T and 0373T (unlike the tri-MCO Program Description/Universal Request form, which omit them) and calls out a distinct "97153HO" line ("effective for dates of service 9/1/2019 and forward") for BCBA/QHP-delivered 97153 vs. plain 97153 for technician-delivered; states "if the BCBA is directing an RBT, the client is present, and one or more protocols have been modified then 97155 may be billed concurrently with the RBT codes." Lists "Applied Behavior Analyst Services" as one of many Behavioral Health services requiring prior authorization, submitted via BlueCare\'s own request forms (bluecare.bcbst.com/providers/forms.html) — no external BH vendor (Carelon/Optum/Magellan) is named anywhere in the manual\'s Behavioral Health sections (OptumRX appears only for the unrelated pharmacy benefit). Separately gives a GENERAL (not ABA-specific) telehealth billing policy, eff. 10/1/2024: modifiers GT/93/95/G0/GQ/FQ/FR "for informational purposes," billed with POS 10 (patient\'s home) or POS 02 (elsewhere), POS 03 for school-based, POS 50/72 for RHC/FQHC — subject to the service being on BlueCare\'s separately-published "Telehealth Approved Code List" (not itself included in this manual, so ABA-specific telehealth-code eligibility is not directly confirmed).'
);
const BLUECARE_INIT_CONTINUATION_FORM = src(
  'https://content.bcbst.com/api/public/content/aba_initiation_continuation_for_therapy.pdf',
  'BlueCare — Initiation and Continuation of ABA Therapy form (rev. 2/26), fetched and read in full (6 pages). Its own "Code / Service Description / Hours per Week" table is blank fill-in with no codes, unit caps, POS, or modifiers printed — confirms the 6-month/26-week certification period and the hours-approved-vs-used reporting already in tennessee.ts\'s prose. Directs Tennessee providers to submit via Availity.'
);
const WELLPOINT_TN_EDI_PAGE = src(
  'https://www.provider.wellpoint.com/tennessee-provider/claims/electronic-data-interchange',
  'Wellpoint Tennessee\'s own provider EDI page, fetched directly this pass — states verbatim "Your payer name is WELLPOINT, and the payer ID is WLPNT" for Availity EDI transactions, while separately warning that commercial-membership claims must be submitted with a different payer ID than Medicaid/Medicare membership per "the Availity Payer List" — i.e., WLPNT is not stated as Medicaid-exclusive on this page.'
);
const UHC_CLAIMS_PAYER_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
  'UHC "Claims Payer List for UnitedHealthcare, Affiliates and Strategic Alliances," dated 5/13/2026 (fetched and read in full; same document already cited in carveouts.ts\'s NY row). States the row "UnitedHealthcare Community Plan / TN (formerly AmeriChoice TN: TennCare, Secure Plus Complete)" -> Medical Payer ID 95378 (COB Y, Smart Edits Y) — distinct from the multi-state 87726 grouping used for most other UHC Community Plan states. Separately lists "OptumHealth Behavioral Solutions" (formerly United Behavioral Health) at 87726 nationally — a different entity/ID than TN\'s own 95378.'
);
const UHC_TN_ABA_PROGRAM_DESC = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-ABA-Program-Description.pdf',
  'TN ABA Program Description (shared tri-MCO document, UHC\'s own copy, 6/2024) — fetched and read; contains no EDI payer ID, clearinghouse name, or code-level billing mechanics beyond what\'s in TN_PROGRAM_DESCRIPTION/TN_UNIVERSAL_REQUEST_FORM.'
);
const UHC_TN_LOC_GUIDELINES = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tn/behavioral-health/TN-BH-Level-of-Care-Guidelines-Applied-Behavioral-Analysis.pdf',
  'UHC — Level of Care Guidelines: Applied Behavior Analysis, rev. 12/13/2024 — fetched and read; a clinical-criteria document (physician-order requirement, >20 hrs/week extra-scrutiny threshold, telehealth device-attention test, 3-month no-progress discharge rule) with no CPT-code-level unit caps, POS codes, or modifiers.'
);
const CSG_SOUTH_COMPARISON = src(
  'https://csgsouth.org/wp-content/uploads/HSPS-Converted-IR__Comparison-of-Medicaid-Reimbursement-for-ABA-Individual-Services.pdf',
  'CSG South, "Comparison of Medicaid Reimbursement for ABA Individual Services," Feb 2026 — every Tennessee cell is blank; already cited in tennessee.ts\'s "Rates: negotiated, not published" section as the reason TennCare publishes no statewide/MCO ABA fee schedule.'
);

/* -------------------- Layer 7 contact-layer source refs (fetched this pass) -------------------- */

const AETNA_BH_PRECERT_LIST = src(
  'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/healthcare-professionals/documents-forms/bh_precert_list.pdf',
  'Aetna "Participating provider behavioral health precertification list for Aetna," effective 8/1/2024 (fetched, downloaded, and text-extracted in full this pass). Its own precertification table explicitly lists "3. Applied behavioral analysis (ABA)" against CPT codes 97151, 97152, 97153, 97154, 97155, 97156, 97157, 97158, 0362T, 0373T. States verbatim: "If you have any questions about submitting a request or about our precertification process, call us: Commercial plans: 1-888-632-3862 (TTY: 711); Medicare plans: 1-800-624-0756 (TTY: 711)" and directs submission via the Availity provider portal (Availity.com) or AetnaElectronicPrecert.com.',
  true
);
const CIGNA_EBH_ADMIN_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/resourceLibrary/behavioral/ebh-provider-admin-guide.pdf',
  'Evernorth Behavioral Administrative Guidelines, PCOMM-2021-1080 (8/21; fetched, downloaded, and text-extracted in full this pass, 114 pages). Its own "Important contact information" table states verbatim, under "Perform telephone transactions" (eligibility/coverage verification, claim status, "Request precertification for services"): "Phone: 800.926.2273"; the online-transactions row directs providers to Provider.Evernorth.com. Also separately confirms a dedicated "Autism clinics" contracting workflow exists (distinct TIN/location grouping for autism-provider clinics).',
  true
);
const PROVIDER_EXPRESS_SUPPORT_PAGE = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/about-us/provider-express-support.html',
  'Provider Express (Optum) Support page, fetched directly this pass — states verbatim "1 866-209-9320 (toll-free)" as the Provider Express Support Center phone, with hours "8 a.m. to 8 p.m. Eastern time"; also notes live chat available 8 a.m.-5 p.m. Central time through the same site. A live, continuously-maintained support page rather than a dated PDF snapshot, so not flagged staleRisk.'
);

/* -------------------- shared tri-MCO codeGrid factory (Layer 3) -------------------- */

const TN_MCO_MODIFIERS: Record<string, string[]> = {
  '97151': ['HO'],
  '97152': ['HM'],
  '97153': [
    'HO (BCBA/LBA-delivered — billed "97153HO" per BlueCare\'s Provider Administration Manual, eff. DOS 9/1/2019+)',
    'HM (RBT/technician-delivered)',
  ],
  '97154': ['HM'],
  '97155': ['HO'],
  '97156': ['HO'],
  '97157': ['HO'],
  '97158': ['HO'],
};

function tnMcoCoreEntry(code: string, notes?: string, extraSources?: SourceRef[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Universal Request for ABA form (assessment + treatment)',
    unitCap:
      'No fixed numeric cap published — "Units Per Week"/"Units per Authorization period" are blank fields on the Universal Request form, justified via the severity/unit guide (levels 1-3 across communication, social, behavior, and adaptive domains)',
    capPeriod: '26 weeks (6 months) per authorization period',
    posAllowed: ['clinic', 'home', 'community', 'school', 'telehealth (checkbox on the Universal Request form — no CMS POS number given)'],
    telehealth:
      'Allowed as a modality (flagged per code via a checkbox on the Universal Request form) but treated cautiously per the Program Description\'s telehealth-appropriateness guidance (interstate licensure, safety, technology limits); no CPT-code-specific POS number or modifier (GT/95) is published in the tri-MCO documents.',
    modifiers: TN_MCO_MODIFIERS[code] ?? ['unverified'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'inferred',
      modifiers: 'verified',
    },
    sources: [TN_PROGRAM_DESCRIPTION, TN_UNIVERSAL_REQUEST_FORM, ...(extraSources ?? [])],
  };
}

function tnMcoNotConfirmedExtraCodeEntry(code: '0362T' | '0373T', extraSources?: SourceRef[]): CodeGridEntry {
  return {
    covered:
      'Not confirmed in the shared tri-MCO code set — absent from both the Program Description\'s own "ABA Codes" appendix and the Universal Request form\'s CPT table (97151-97158 only). BlueCare Tennessee\'s own Provider Administration Manual DOES list ' +
      code +
      ' (see bluecare-tennessee) — confirm directly with this MCO\'s provider services before assuming coverage.',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: this MCO\'s provider services, or the Universal Request form\'s blank "Other" code line — the shared tri-MCO documents\' own printed code lists stop at 97158.',
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [TN_PROGRAM_DESCRIPTION, TN_UNIVERSAL_REQUEST_FORM, ...(extraSources ?? [])],
  };
}

/* -------------------- tenncare-tennessee-medicaid (umbrella) -------------------- */

function tenncareEntry(code: string): CodeGridEntry {
  if (code === '0362T' || code === '0373T') {
    const base = tnMcoNotConfirmedExtraCodeEntry(code, [BLUECARE_PAM]);
    return {
      ...base,
      covered:
        'Mixed by MCO — BlueCare Tennessee\'s own Provider Administration Manual lists ' +
        code +
        ' with a full CPT description; the shared tri-MCO Program Description and Universal Request form (which the UnitedHealthcare Community Plan and Wellpoint guides rely on) omit it entirely. Confirm per the member\'s specific MCO — see the BlueCare / UHC Community Plan / Wellpoint guides.',
      fieldStatus: { ...base.fieldStatus, covered: 'inferred' },
    };
  }
  const notes: Record<string, string> = {
    '97153': 'Continuation requests must report % of authorized units used on this code — under 90% requires a written explanation (formula on the Universal Request form).',
    '97156': 'Parent-training volume delivered is tracked separately at continuation, per week/month, on the Universal Request form.',
  };
  return tnMcoCoreEntry(code, notes[code]);
}

const tenncareMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': tenncareEntry('97151'),
  '97152': tenncareEntry('97152'),
  '97153': tenncareEntry('97153'),
  '97154': tenncareEntry('97154'),
  '97155': tenncareEntry('97155'),
  '97156': tenncareEntry('97156'),
  '97157': tenncareEntry('97157'),
  '97158': tenncareEntry('97158'),
  '0362T': tenncareEntry('0362T'),
  '0373T': tenncareEntry('0373T'),
};

const tenncareMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00185', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator:
      'none — ABA benefit administration is 100% delegated to the member\'s assigned MCO; TennCare\'s own state-level system (TCMIS) handles base Medicaid eligibility only (see the BlueCare / UHC Community Plan / Wellpoint guides for each MCO\'s own carve-out status)',
    administratorPayerId: 'N/A',
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
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'unverified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'No TennCare/TN-Medicaid-specific row found anywhere in the fetched Availity 837 payer list (57 pages, "As of 08/08/2012" footer) — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'Not checked against a dedicated Optum/Change Healthcare payer directory this pass — confirm via the Change Healthcare payer finder.',
    'medicaid271Notes.mcoSegmentLocation':
      'TennCare\'s public "EDI Front Matter" (V8.0, Feb 2026) confirms 270/271 is handled directly by TennCare (not an MCC transaction) via batch SFTP or real-time SOAP, but the loop/segment carrying MCO enrollment/carrier-code detail lives in the actual TennCare Companion Guide (TCCG) — described in the Front Matter as "available to registered Trading Partners upon request," not a public download. Request the TCCG via EDI.TennCare@tn.gov.',
    'medicaid271Notes.mcoCarrierCodes': 'Same — request the TCCG from EDI.TennCare@tn.gov.',
    'medicaid271Notes.eligibilitySpanGranularity': 'Same — request the TCCG from EDI.TennCare@tn.gov.',
  },
  sources: [TENNCARE_EDI_FRONT_MATTER, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* -------------------- bluecare-tennessee -------------------- */

function bluecareEntry(code: string, notes?: string): CodeGridEntry {
  const isCore = code !== '0362T' && code !== '0373T';
  return {
    covered: 'Yes',
    paRequired:
      'Required — Universal Request for ABA form (assessment + treatment)' +
      (isCore ? '' : '; listed with a full CPT description in BlueCare\'s own Provider Administration Manual (this code, unlike the shared tri-MCO documents, which omit it)'),
    unitCap: isCore
      ? 'No fixed numeric cap published — "Units Per Week"/"Units per Authorization period" are blank fields on the Universal Request form, justified via the severity/unit guide (levels 1-3 across communication, social, behavior, and adaptive domains)'
      : 'unverified — BlueCare\'s Provider Administration Manual gives only the CPT description, no numeric unit cap',
    capPeriod: '26 weeks (6 months) per authorization period',
    posAllowed: ['clinic', 'home', 'community', 'school', 'telehealth'],
    telehealth:
      'BlueCare\'s general (not ABA-code-specific) telehealth billing policy (eff. 10/1/2024) requires POS 10 (patient\'s home) or POS 02 (elsewhere) — POS 03 for school-based, POS 50/72 for RHC/FQHC — with modifiers GT, 93, 95, G0, GQ, FQ, or FR "for informational purposes." Whether this code is on BlueCare\'s separately-published "Telehealth Approved Code List" (referenced but not included in the manual read this pass) is not directly confirmed.',
    modifiers: isCore ? TN_MCO_MODIFIERS[code] : ['unverified — no modifier given for this code in BlueCare\'s own code table'],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: isCore ? 'verified' : 'unverified',
      posAllowed: 'verified',
      telehealth: 'inferred',
      modifiers: isCore ? 'verified' : 'unverified',
    },
    sources: [BLUECARE_PAM, TN_PROGRAM_DESCRIPTION, TN_UNIVERSAL_REQUEST_FORM, BLUECARE_INIT_CONTINUATION_FORM],
  };
}

const blueCareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': bluecareEntry('97151'),
  '97152': bluecareEntry('97152'),
  '97153': bluecareEntry(
    '97153',
    'Continuation requests must report % of authorized units used on this code — under 90% requires a written explanation. Billed "97153HO" when BCBA/QHP-delivered vs. plain 97153 when technician-delivered (eff. DOS 9/1/2019+, per BlueCare\'s Provider Administration Manual).'
  ),
  '97154': bluecareEntry('97154'),
  '97155': bluecareEntry(
    '97155',
    'Per BlueCare\'s Provider Administration Manual: may be billed concurrently with technician-delivered codes when the BCBA is directing an RBT, the client is present, and one or more protocols have been modified.'
  ),
  '97156': bluecareEntry('97156', 'Parent-training volume delivered is tracked separately at continuation, per week/month, on the Universal Request form.'),
  '97157': bluecareEntry('97157'),
  '97158': bluecareEntry('97158'),
  '0362T': bluecareEntry('0362T'),
  '0373T': bluecareEntry('0373T'),
};

const blueCareEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator:
      'none — in-house (inferred from absence): BlueCare\'s own 563-page Provider Administration Manual lists "Applied Behavior Analyst Services" as one of many Behavioral Health PA categories BlueCare handles directly, submitted via BlueCare\'s own forms — no external BH vendor (Carelon/Optum/Magellan) named anywhere in its Behavioral Health sections',
    administratorPayerId: 'N/A',
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
      'pVerify\'s public list carries only a generic "00219 Blue Cross Blue Shield Tennessee" entry (Elig=Yes, Claim=Yes, Medical) with no distinct BlueCare/TennCareSelect Medicaid line — not confirmed whether that ID covers the Medicaid product or only commercial BCBST. Secondary clearinghouse aggregators list additional unconfirmed candidates ("00390" per web.claim.md, "TNXBC" per ClaimRemedi\'s TN BCBS 837/835 enrollment page) — neither corroborated against a BCBST-published source this pass. Confirm with pVerify onboarding and BCBST EDI enrollment (800-924-7141) before automating.',
    'payerId.availity':
      'No BlueCare-, TennCareSelect-, or CoverKids-specific row found in the fetched Availity 837 payer list. BlueCare\'s own digital-resources page confirms Availity as its EDI portal but states no payer ID directly. Confirm via BCBST EDI enrollment (800-924-7141) / eBusiness_service@bcbst.com.',
    'payerId.changeHealthcare': 'Not checked against a dedicated Optum/Change Healthcare payer directory this pass.',
    supports270271:
      'TennCare\'s own EDI Front Matter (Feb 2026) positions 270/271 as a state-run (not MCC/MCO) transaction — no source found this pass confirms BlueCare separately operates its own 270/271 trading-partner relationship for TennCare Medicaid eligibility specifically (as opposed to its broader BCBST book of business). Practical fallback: pVerify\'s state-level "00185 Tennessee Medicaid (TennCare)" entry (Elig=Yes) confirms TennCare enrollment; cross-reference the member\'s MCO card for BlueCare assignment. Confirm directly via pVerify/Availity onboarding.',
    supportsRealtime: 'Same reasoning as supports270271 — confirm via pVerify/Availity onboarding.',
    'bhCarveOut.administrator':
      'BCBST provider services, (423) 535-5717 option 2, or BHABA@bcbst.com (both already cited in tennessee.ts) — this guide found no primary source stating "no carve-out" in so many words, only its absence across a 563-page manual\'s Behavioral Health sections, so the field is not upgraded to a fully confirmed "none."',
  },
  sources: [BLUECARE_PAM, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, TENNCARE_EDI_FRONT_MATTER],
};

/* -------------------- unitedhealthcare-community-plan-tennessee -------------------- */

function uhcTnEntry(code: string): CodeGridEntry {
  if (code === '0362T' || code === '0373T') {
    return tnMcoNotConfirmedExtraCodeEntry(code, [UHC_TN_ABA_PROGRAM_DESC]);
  }
  const notes: Record<string, string> = {
    '97153':
      'Continuation requests must report % of authorized units used on this code — under 90% requires a written explanation. UHC overlay: comprehensive programs above 20 hrs/week (across all direct-treatment codes combined) get extra scrutiny — expected only with multiple needs, roughly the first two years of ABA, and DSM-5 severity level 2-3.',
    '97156': 'Parent-training volume delivered is tracked separately at continuation. UHC overlay: a documented caregiver participation plan is required; non-participation is a discharge criterion.',
  };
  const base = tnMcoCoreEntry(code, notes[code], [UHC_TN_ABA_PROGRAM_DESC, UHC_TN_LOC_GUIDELINES]);
  return {
    ...base,
    paRequired:
      base.paRequired +
      ' — plus UHC\'s own Level of Care Guidelines (rev. 12/13/2024): a physician order/script recommending ABA is explicitly required at initiation, the strictest of the three MCOs',
    telehealth:
      base.telehealth +
      ' UHC overlay: direct telehealth ABA is only medically necessary when the member can attend to a device for an extended period (Level of Care Guidelines) — still no CPT-specific POS/modifier published.',
    fieldStatus: { ...base.fieldStatus, paRequired: 'verified' },
  };
}

const uhcCommunityPlanCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcTnEntry('97151'),
  '97152': uhcTnEntry('97152'),
  '97153': uhcTnEntry('97153'),
  '97154': uhcTnEntry('97154'),
  '97155': uhcTnEntry('97155'),
  '97156': uhcTnEntry('97156'),
  '97157': uhcTnEntry('97157'),
  '97158': uhcTnEntry('97158'),
  '0362T': uhcTnEntry('0362T'),
  '0373T': uhcTnEntry('0373T'),
};

const uhcCommunityPlanEdi: EdiRouting = {
  payerId: { pverify: 'UHG003', availity: 'unverified', changeHealthcare: '95378' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'unverified — only an at-a-glance "Optum platform" label found, not elaborated in body text',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'No dedicated "UnitedHealthcare Community Plan Tennessee" row found in the fetched Availity 837 payer list — that list\'s only exact numeric match for TN\'s current Medical Payer ID (95378, per UHC\'s own 5/13/2026 Claims Payer List) maps instead to "UNITED HEALTHCARE OF RIVER VALLEY," a DIFFERENT UHC affiliate, in that stale 2012 snapshot — a genuine cross-source conflict, not resolved here (same treatment as the 87726/UHG007 conflict already flagged in carveouts.ts for NY). Confirm directly with Availity onboarding before automating.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Same caveat already recorded in vob/carveouts.ts\'s TN row: the guide\'s at-a-glance table says "TennCare MCO (UnitedHealthcare / Optum platform)" but the body text describes only UHC\'s own Level of Care Guidelines without naming Optum as administrator anywhere. Verify via UHC Community Plan TN provider services.',
    'bhCarveOut.administratorPayerId': 'Same as administrator.',
    'bhCarveOut.abaRidesOn': 'Same as administrator.',
    'bhCarveOut.twoHopRequired': 'Same as administrator.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UHC_CLAIMS_PAYER_LIST, UHC_TN_ABA_PROGRAM_DESC],
};

/* -------------------- wellpoint-tennessee -------------------- */

function wellpointEntry(code: string): CodeGridEntry {
  if (code === '0362T' || code === '0373T') {
    return tnMcoNotConfirmedExtraCodeEntry(code);
  }
  const isAssessment = code === '97151' || code === '97152';
  const notes: Record<string, string> = {
    '97151': 'Assessment request needs an MD order or a licensed treating provider\'s recommendation attached (per the Universal Request form and Wellpoint\'s own workflow emphasis).',
    '97152': 'Assessment request needs an MD order or a licensed treating provider\'s recommendation attached (per the Universal Request form and Wellpoint\'s own workflow emphasis).',
    '97153': 'Continuation requests must report % of authorized units used on this code — under 90% requires a written explanation.',
    '97156': 'Parent-training volume delivered is tracked separately at continuation.',
  };
  return tnMcoCoreEntry(code, isAssessment ? notes[code] : notes[code]);
}

const wellpointCodeGrid: Record<string, CodeGridEntry> = {
  '97151': wellpointEntry('97151'),
  '97152': wellpointEntry('97152'),
  '97153': wellpointEntry('97153'),
  '97154': wellpointEntry('97154'),
  '97155': wellpointEntry('97155'),
  '97156': wellpointEntry('97156'),
  '97157': wellpointEntry('97157'),
  '97158': wellpointEntry('97158'),
  '0362T': wellpointEntry('0362T'),
  '0373T': wellpointEntry('0373T'),
};

const wellpointEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'WLPNT', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'unverified — no BH vendor named in this guide',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    'payerId.pverify':
      'Two conflicting pVerify candidates, same ambiguity georgia.ts found for amerigroup-georgia: a generic "06067 WELLPOINT - AMERIGROUP" line (Elig=Yes, Claim=Yes, Medical) and a state-tagged "00706 AMERIGROUP (IA,DC,MD,FL,GA,WA,TN,TX,NM)" line explicitly listing TN but flagged Elig/Claim=No. Neither resolved to a single canonical TN Medicaid code this pass — confirm with pVerify onboarding.',
    'payerId.changeHealthcare': 'Not checked against a dedicated Optum/Change Healthcare payer directory this pass.',
    supports270271:
      'TennCare\'s own EDI Front Matter (Feb 2026) positions 270/271 as a state-run (not MCC/MCO) transaction — no source found this pass confirms Wellpoint separately operates its own 270/271 trading-partner relationship for TennCare Medicaid eligibility. Practical fallback: pVerify\'s state-level "00185 Tennessee Medicaid (TennCare)" entry (Elig=Yes) confirms TennCare enrollment; cross-reference the member\'s MCO card for Wellpoint assignment.',
    supportsRealtime: 'Same reasoning as supports270271.',
    'bhCarveOut.administrator':
      'Same caveat already recorded in vob/carveouts.ts\'s anthem/TN row: no Carelon or other BH vendor named; ABA submissions go through Availity\'s Interactive Care Reviewer using the universal tri-MCO form. Verify via Wellpoint TN provider services (833-731-2154).',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, WELLPOINT_TN_EDI_PAGE, TN_UNIVERSAL_REQUEST_FORM, TN_OVERVIEW_UPDATES],
};

/* -------------------- aetna-tennessee (commercial) -------------------- */

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
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy located this pass. tennessee.ts\'s own prose cites precert form "GR-69017-4," but that number does not appear in either cited CPB — same QA finding georgia.ts made for aetna-georgia (2026-07-23); not restated here as confirmed.',
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
      'The cited Availity list carries an "As of 08/08/2012" footer — 60054=AETNA is confirmed present in that snapshot, but downgraded from verified to inferred pending reconfirmation against a current Availity export (same treatment georgia.ts and aetna-florida already apply for the identical staleness finding).',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'No BH carve-out administrator is named for Aetna commercial ABA in any of the 19 states\' guides researched across this corpus, TN included — matches vob/carveouts.ts\'s aetna/US commercial row exactly. Verify via Aetna provider services precert line.',
  },
  sources: [AETNA_CPB0554, AETNA_CPB0648, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* -------------------- cigna-tennessee (commercial) -------------------- */

function cignaEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it.',
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
  sources: [CIGNA_EN0499, CIGNA_AUTISM_GUIDE, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* -------------------- unitedhealthcare-tennessee (commercial) -------------------- */

function uhcCommercialEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum ABA prior authorization (specific process/review cadence not confirmed in either cited source)',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      'Unit caps and modifiers sourced from Optum\'s national ABA Reimbursement Policy (2022RP501A) — no TN-specific override confirmed, same treatment georgia.ts gave unitedhealthcare-georgia. tennessee.ts\'s own prose cites a "two-step ... every 4-6 months" review cadence and an 80%-utilization flag, but neither figure appears in OPTUM_SCC or the Reimbursement Policy — same QA finding georgia.ts made (2026-07-23); not restated here as confirmed. Verify via: Provider Express / UHC provider services.',
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

const unitedhealthcareCodeGrid: Record<string, CodeGridEntry> = {
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

const unitedhealthcareEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: 'unverified' },
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
      'The cited Availity list carries an "As of 08/08/2012" footer — a generic "87726 UNITEDHEALTHCARE" row is confirmed present in that snapshot, but downgraded from verified to inferred pending reconfirmation against a current Availity export (same treatment already applied to Aetna in this file for the identical staleness finding).',
    'payerId.changeHealthcare': 'Not confirmed against a dedicated Optum/Change Healthcare payer directory this pass — confirm via Provider Express / UHC provider services.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'No Tennessee-specific payer ID or side (medical vs. BH) confirmed for commercial UHC/Optum — matches vob/carveouts.ts\'s unitedhealthcare/TN commercial row exactly. Verify via Provider Express / UHC provider services.',
  },
  sources: [OPTUM_SCC, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* -------------------- Layer 4 — Medicaid rate tables -------------------- */

function tnNoRatesTable(mcoLabel: string): RateTable {
  const codes = ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T'];
  const byCode: RateTable['byCode'] = {};
  codes.forEach((c) => {
    byCode[c] = { rate: 'unverified', unit: '15min' };
  });
  return {
    source:
      'TennCare publishes no statewide ABA fee schedule — ABA is 100% MCO-administered, and ' +
      mcoLabel +
      ' negotiates and pays its own contracted rate per individual provider agreement, not a state-published fee schedule. Confirmed via a Feb 2026 multistate Medicaid ABA-reimbursement comparison (CSG South) that leaves every Tennessee cell blank for exactly this reason — the same fact already documented in this guide\'s own "Rates: negotiated, not published" prose. The only source of truth is the practice\'s own contract with ' +
      mcoLabel +
      '; verify via that MCO\'s network/provider-relations contact, not a state rate lookup.',
    effectiveDate: 'unverified — no state or MCO ABA fee schedule publicly posted',
    byCode,
    sources: [CSG_SOUTH_COMPARISON],
  };
}

const tenncareMedicaidRates = tnNoRatesTable('each of the three "at-risk" MCOs (BlueCare, UnitedHealthcare Community Plan, and Wellpoint)');
const blueCareRates = tnNoRatesTable('BlueCare Tennessee');
const uhcCommunityPlanRates = tnNoRatesTable('UnitedHealthcare Community Plan of Tennessee');
const wellpointRates = tnNoRatesTable('Wellpoint Tennessee');

/* -------------------- Layer 7 — contact & channel layer --------------------
   Part 1 (phone/fax/hours/portal) is scraped from the same primary sources
   already cited above in this file (mined first) plus a handful of newly
   fetched national/EDI-vendor contact pages for the three commercial guides
   and the TennCare umbrella guide. Part 2 (scriptedQuestions) is generated
   from whatever THIS guide's own edi/codeGrid/rates layers mark unverified
   or plan-dependent — never padded to a round number. -------------------- */

const tenncareMedicaidContact: VobContact = {
  providerServicesPhone:
    '(800) 852-2683 — TennCare Provider Services, per the state\'s own EDI Front Matter (that line is stated there specifically for PDMS registration/portal-access questions; ABA benefit administration itself is 100% delegated to the member\'s MCO — use the BlueCare / UnitedHealthcare Community Plan / Wellpoint guide\'s own number for benefit or PA questions)',
  scriptedQuestions: [
    'Which of the three TennCare MCOs — BlueCare, UnitedHealthcare Community Plan, or Wellpoint — is this member currently enrolled with for ABA services?',
    'Does this member\'s specific MCO cover 0362T and 0373T, or only the shared tri-MCO code set (97151-97158)?',
    'What is the negotiated per-unit rate for 97151-97158 (and 0362T/0373T where covered) under this member\'s MCO provider contract, since TennCare publishes no statewide ABA fee schedule?',
    'Can you confirm which loop/segment carries this member\'s MCO enrollment on the 271 response, or should we route this eligibility question to the assigned MCO directly?',
  ],
  sources: [TENNCARE_EDI_FRONT_MATTER],
};

const blueCareContact: VobContact = {
  providerServicesPhone:
    '1-800-924-7141 — BlueCare Tennessee Provider Service Line, also listed as the Prior Authorization (Medical and Behavioral Health) phone number in the Provider Administration Manual\'s own "Contact Us" table',
  ivrPath: '(423) 535-5717, option 2 — reaches BlueCare\'s in-house behavioral health/UM team (BHABA@bcbst.com) for ABA-specific PA questions',
  fax: '1-800-292-5311 (BlueCare/TennCareSelect prior-authorization fax; CoverKids uses a separate fax, 1-800-851-2491)',
  portal: { name: 'BlueCare online provider tool (bluecare.bcbst.com) / Availity', url: 'https://bluecare.bcbst.com' },
  scriptedQuestions: [
    'Is 0362T (or 0373T) on BlueCare\'s current Telehealth Approved Code List, and is there a published unit cap for either code?',
    'What modifier, if any, does BlueCare want on 0362T/0373T claims — its own code table gives a CPT description but no modifier for these two codes?',
    'Can eligibility/benefits for this member be checked in real time through a clearinghouse, or only via Availity\'s standard batch process?',
  ],
  sources: [BLUECARE_PAM, TN_UNIVERSAL_REQUEST_FORM],
};

const uhcCommunityPlanContact: VobContact = {
  providerServicesPhone:
    '(800) 690-1606 — the dedicated ABA authorization line, per the Tri-MCO ABA Overview of Updates ("For authorization requests, questions or submission, please contact: 800-690-1606"); UnitedHealthcare Community Plan of TN\'s general Provider Services line is (877) 222-6720, per the Universal Request form\'s "Additional MCO Contact Information" table',
  fax: '(877) 217-6068',
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'Is ABA administered directly by UnitedHealthcare Community Plan, or through a separate behavioral health vendor like Optum — and if a vendor, is there a second EDI hop for eligibility/benefits?',
    'Does this member\'s plan cover 0362T and 0373T in addition to the shared tri-MCO 97151-97158 code set?',
    'Can eligibility be checked in real time, or only via batch, for this payer ID?',
  ],
  sources: [TN_OVERVIEW_UPDATES, TN_UNIVERSAL_REQUEST_FORM],
};

const wellpointContact: VobContact = {
  providerServicesPhone:
    '(833) 731-2154 — Wellpoint Tennessee Provider Services (Medicaid line), confirmed on both Wellpoint\'s own ABA provider page and the Universal Request form\'s MCO contact table',
  fax: '(866) 920-6006 or (888) 881-6309',
  portal: { name: 'Availity (Interactive Care Reviewer)', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'Is ABA administered directly by Wellpoint, or delegated to an outside behavioral health vendor?',
    'Does this member\'s plan cover 0362T and 0373T in addition to the shared tri-MCO 97151-97158 code set?',
    'Can eligibility for this member be checked in real time through Availity, or does it require a batch request?',
  ],
  sources: [WELLPOINT_TN_EDI_PAGE, TN_UNIVERSAL_REQUEST_FORM, TN_OVERVIEW_UPDATES],
};

const aetnaContact: VobContact = {
  providerServicesPhone:
    '1-888-632-3862 (commercial plans; TTY 711) — Aetna\'s Precertification Department, per Aetna\'s own participating-provider behavioral health precertification list, which explicitly lists ABA codes 97151-97158, 0362T, and 0373T as requiring precertification',
  portal: { name: 'Availity', url: 'https://www.availity.com' },
  scriptedQuestions: [
    'What is the exact precertification form and submission process for ABA under this member\'s specific plan?',
    'Is there a numeric unit or hour cap for ABA codes, and what is the authorization period?',
    'What place-of-service codes and modifiers are required when billing 97151-97158 and 0362T/0373T?',
    'Is telehealth allowed for any ABA codes under this plan, and if so what modifier/POS applies?',
    'Is ABA administered on the medical side, or carved out to a separate behavioral health vendor?',
  ],
  sources: [AETNA_BH_PRECERT_LIST],
};

const cignaContact: VobContact = {
  providerServicesPhone: '800.926.2273 — Cigna/Evernorth Provider Services, per Evernorth\'s own Behavioral Administrative Guidelines (used for eligibility/coverage verification, claim status, and "request precertification for services")',
  portal: { name: 'Provider.Evernorth.com / CignaforHCP.com', url: 'https://provider.evernorth.com' },
  scriptedQuestions: [
    'Is there a numeric unit or hour cap for ABA codes, and what is the authorization period?',
    'What place-of-service codes and modifiers should be used when billing 97151-97158 and 0362T/0373T?',
    'Is telehealth allowed for any ABA codes under this plan?',
  ],
  sources: [CIGNA_EBH_ADMIN_GUIDE],
};

const unitedhealthcareContact: VobContact = {
  providerServicesPhone: '1-866-209-9320 — Provider Express Support Center (toll-free)',
  hours: '8 a.m.-8 p.m. Eastern time (phone); live chat also available 8 a.m.-5 p.m. Central time via Provider Express',
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'Does this plan apply Optum\'s national daily unit caps and HN/HM/HO/HP modifier tiers as published (e.g., 32 units/day on 97151/97153), or does it carry a plan-specific override?',
    'What is the actual prior-authorization review cadence and utilization threshold for continued ABA services under this member\'s plan?',
    'What place-of-service codes apply for in-clinic vs. home vs. telehealth ABA sessions?',
    'Is telehealth allowed for any ABA codes, and under what conditions?',
  ],
  sources: [PROVIDER_EXPRESS_SUPPORT_PAGE, OPTUM_SCC],
};

/* ==================== closing sweep: tenncare-select ====================
   Sourcing notes: TennCare Select is a separate state PIHP contract (Edison
   ID 83332) but is administered by the SAME entity as bluecare-tennessee —
   Volunteer State Health Plan, Inc. d/b/a BlueCare Tennessee — and the
   BlueCare Tennessee Provider Administration Manual's own ABA section
   covers BOTH BlueCare and TennCareSelect members under one shared policy
   (already verified and cited in src/data/payers/tennessee.ts). The
   codeGrid below therefore reuses bluecareEntry() unchanged rather than
   re-deriving it — same CPT codes, same PA mechanics, same telehealth
   policy — with the difference being contact numbers and, for a subset of
   members, LTSS sub-programs (SelectKids, SelectCommunity, Katie Beckett
   Part A), which live in prose, not these VOB layers. A single-source,
   fax-routed EDI payer-ID candidate ("10504," per a FinThrive payer-list
   WebSearch snippet this pass) could not be independently corroborated
   against a second primary source and is flagged, not shipped as
   confirmed — same treatment already given to BlueCare's own multiple
   unconfirmed pVerify candidates in this file. */

const TENNCARE_SELECT_CONTRACT = src(
  'https://www.capitol.tn.gov/Archives/Joint/committees/fiscal-review/contracts/2025/05-21-25/28.%20TennCare%20(Volunteer%20State%20Health%20Plan%20d.b.a%20BlueCare)%20Amend%201%20Redacted.pdf',
  'TennCare (Volunteer State Health Plan d.b.a. BlueCare) Contract Amendment #1, Edison Contract ID 83332 (term 1/1/2025-12/31/2027); already cited in src/data/payers/tennessee.ts — confirms TennCare Select operates as a separate PIHP agreement from BlueCare\'s standard MCO contract, both administered by Volunteer State Health Plan, Inc. d/b/a BlueCare Tennessee.'
);
const TENNCARE_SELECT_MCPAR = src(
  'https://www.tn.gov/content/dam/tn/tenncare/documents/2025ManagedCareProgramAnnualReport.pdf',
  "TennCare Managed Care Program Annual Report (MCPAR), submitted to CMS 6/29/2025 for CY2024; already cited in tennessee.ts — TennCare Select average monthly enrollment 37,095 (~2.5% of statewide TennCare)."
);
const FINTHRIVE_PAYER_LIST_SNIPPET = src(
  'https://www.insuranceverifier.finthrive.com/Document/FinThrive%20Payer%20List.pdf',
  'FinThrive Payer List — a WebSearch summary of this document this pass surfaced a single unconfirmed candidate row, "BlueCare Tennessee-TennCareSelect ... Payer ID 10504 ... via FAX," but a direct fetch of the PDF returned only compressed/encoded content and could not independently corroborate that row. Not a confirmed EDI payer ID — flagged as a single-source candidate only, not used to populate payerId.pverify/availity below.',
  true
);

const tenncareSelectEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator:
      'none — in-house (same finding as bluecare-tennessee): TennCare Select\'s ABA benefit is administered directly by Volunteer State Health Plan/BlueCare Tennessee under the SAME shared tri-MCO Provider Administration Manual policy that covers BlueCare — no external BH vendor (Carelon/Optum/Magellan) named',
    administratorPayerId: 'N/A',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "No TennCare-Select-specific pVerify row was confirmed this pass — pVerify's public list carries only the state-level \"00185 Tennessee Medicaid (TennCare)\" entry (Elig=Yes) and a generic \"00219 Blue Cross Blue Shield Tennessee\" row, neither confirmed TennCare-Select-specific. A single WebSearch snippet of the FinThrive payer list surfaced an unconfirmed candidate (\"10504,\" fax-routed) that could not be independently corroborated against a readable primary document — see FINTHRIVE_PAYER_LIST_SNIPPET. Confirm via pVerify onboarding or BCBST EDI enrollment (800-924-7141).",
    'payerId.availity': 'Same as payerId.pverify — no TennCare-Select-specific row found in the fetched Availity 837 payer list. Confirm via BCBST EDI enrollment (800-924-7141) / eBusiness_service@bcbst.com.',
    'payerId.changeHealthcare': 'Not checked against a dedicated Optum/Change Healthcare payer directory this pass.',
    supportsRealtime:
      "TennCare's own EDI Front Matter positions 270/271 as a state-run (not MCC/MCO) transaction — practical fallback: pVerify's state-level \"00185 Tennessee Medicaid (TennCare)\" entry (Elig=Yes) confirms TennCare enrollment; cross-reference the member's MCO card for TennCare Select assignment. Confirm directly via pVerify/Availity onboarding.",
  },
  sources: [TENNCARE_SELECT_CONTRACT, TENNCARE_SELECT_MCPAR, BLUECARE_PAM, TENNCARE_EDI_FRONT_MATTER, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, FINTHRIVE_PAYER_LIST_SNIPPET],
};

const tenncareSelectCodeGrid: Record<string, CodeGridEntry> = {
  '97151': bluecareEntry('97151'),
  '97152': bluecareEntry('97152'),
  '97153': bluecareEntry(
    '97153',
    'Continuation requests must report % of authorized units used on this code — under 90% requires a written explanation. Billed "97153HO" when BCBA/QHP-delivered vs. plain 97153 when technician-delivered (eff. DOS 9/1/2019+, per the shared BlueCare/TennCare Select Provider Administration Manual).'
  ),
  '97154': bluecareEntry('97154'),
  '97155': bluecareEntry(
    '97155',
    'Per the shared BlueCare/TennCare Select Provider Administration Manual: may be billed concurrently with technician-delivered codes when the BCBA is directing an RBT, the client is present, and one or more protocols have been modified.'
  ),
  '97156': bluecareEntry('97156', 'Parent-training volume delivered is tracked separately at continuation, per week/month, on the Universal Request form.'),
  '97157': bluecareEntry('97157'),
  '97158': bluecareEntry('97158'),
  '0362T': bluecareEntry('0362T'),
  '0373T': bluecareEntry('0373T'),
};

const tenncareSelectRates = tnNoRatesTable('TennCare Select (administered by Volunteer State Health Plan/BlueCare Tennessee)');

const tenncareSelectContact: VobContact = {
  providerServicesPhone: '1-800-276-1978 — TennCare Select Provider Service Line (distinct from BlueCare\'s 1-800-468-9736)',
  ivrPath:
    'PA questions: 1-800-711-4104 (TennCare Select Prior Auth phone, distinct from BlueCare\'s 1-888-423-0131). SelectKids (foster care) has its own line: Provider/Family Services 1-800-451-9147. SelectCommunity (IDD): 1-800-292-8196. Member Service Line (for confirming enrollment): 1-800-263-5479.',
  fax: '1-800-292-5311 (Prior Auth fax — shared with BlueCare Tennessee); SelectKids fax 1-800-330-2842; SelectCommunity fax 1-888-255-9175',
  portal: { name: 'BlueCare online provider tool (bluecare.bcbst.com) / Availity', url: 'https://bluecare.bcbst.com' },
  scriptedQuestions: [
    'Confirm this member is on TennCare Select rather than standard BlueCare — contact numbers and forms differ even though both run through the same BCBST/VSHP entity.',
    'Is this member on a TennCare Select sub-program (SelectKids/foster care, SelectCommunity/IDD, or Katie Beckett Part A) with its own dedicated contact line?',
    'Is 0362T (or 0373T) on the current Telehealth Approved Code List, and is there a published unit cap for either code?',
    'What is the negotiated per-unit rate for the ABA code set under this member\'s TennCare Select provider contract, since TennCare publishes no statewide ABA fee schedule?',
    'What EDI payer ID should be used for this member\'s 270/271 eligibility check — no TennCare-Select-specific code was confirmed this pass?',
  ],
  sources: [TENNCARE_SELECT_CONTRACT, BLUECARE_PAM],
};

/* ==================== Layer 2 — STC interpretation maps ====================
   TennCare's own EDI Front Matter (V8.0, Feb 2026 — TENNCARE_EDI_FRONT_MATTER,
   already cited above for Layer 1) confirms 270/271 is a state-run
   transaction but explicitly states the document that would carry the
   service-type-code support table — the actual TennCare Companion Guide
   (TCCG) — is "available to registered Trading Partners upon request," not a
   public download. No MCO (BlueCare, UnitedHealthcare Community Plan,
   Wellpoint, TennCare Select) publishes its own independent 270/271 STC
   table either. This is the same confirmed-gap shape as georgia.ts's
   gaUnverifiedStc (GAMMIS's companion guide exists but its STC table isn't
   retrievable) — not a placeholder to fill, a documented blocker. All five
   TennCare-side guides therefore ship fully 'unverified' StcMaps, each with
   a plan-specific verifyVia phone number reused from that guide's own
   vobContact (not invented). src/data/payers/tennessee.ts's EPSDT prose
   (checked this pass) states ABA is covered with no annual benefit/hour cap
   but never states a $0 cost-share/deductible figure with a citation, so
   deductibleAppliesToAba is NOT set to 'no' here — an honest 'unverified'
   per the "never guess" rule, not an inference from EPSDT's general
   medical-necessity mandate. */

function tnUnverifiedStc(phoneNote: string): StcMap {
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
      abaBenefitBucket: `TennCare's public EDI Front Matter confirms 270/271 exists as a direct state-run transaction but states the TennCare Companion Guide (TCCG) — the document that would carry the service-type-code support table — is available to registered Trading Partners only upon request (EDI.TennCare@tn.gov), not a public download; no MCO publishes an independent STC table of its own. ${phoneNote}`,
    },
    sources: [TENNCARE_EDI_FRONT_MATTER],
  };
}

const tenncareMedicaidStc = tnUnverifiedStc(
  "Confirm via TennCare Provider Services, (800) 852-2683, or by requesting the TCCG from EDI.TennCare@tn.gov — though ABA benefit administration itself is 100% delegated to the member's MCO."
);
const blueCareStc = tnUnverifiedStc("Confirm via BlueCare Tennessee Provider Service Line, 1-800-924-7141.");
const uhcCommunityPlanStc = tnUnverifiedStc(
  "Confirm via UnitedHealthcare Community Plan of TN's dedicated ABA authorization line, (800) 690-1606, or its general Provider Services line, (877) 222-6720."
);
const wellpointStc = tnUnverifiedStc("Confirm via Wellpoint Tennessee Provider Services (Medicaid line), (833) 731-2154.");
const tenncareSelectStc = tnUnverifiedStc("Confirm via TennCare Select Provider Service Line, 1-800-276-1978.");

/* ==================== export ==================== */

export const tennesseeVob: Record<string, VobExtension> = {
  'tenncare-tennessee-medicaid': {
    edi: tenncareMedicaidEdi,
    codeGrid: tenncareMedicaidCodeGrid,
    stcMap: tenncareMedicaidStc,
    rates: tenncareMedicaidRates,
    vobContact: tenncareMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'bluecare-tennessee': {
    edi: blueCareEdi,
    codeGrid: blueCareCodeGrid,
    stcMap: blueCareStc,
    rates: blueCareRates,
    vobContact: blueCareContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-tennessee': {
    edi: uhcCommunityPlanEdi,
    codeGrid: uhcCommunityPlanCodeGrid,
    stcMap: uhcCommunityPlanStc,
    rates: uhcCommunityPlanRates,
    vobContact: uhcCommunityPlanContact,
    lastUpdated: ACCESS_DATE,
  },
  'wellpoint-tennessee': {
    edi: wellpointEdi,
    codeGrid: wellpointCodeGrid,
    stcMap: wellpointStc,
    rates: wellpointRates,
    vobContact: wellpointContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-tennessee': {
    edi: aetnaEdi,
    codeGrid: aetnaCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Tennessee-specific 270/271 STC document found.'),
    vobContact: aetnaContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-tennessee': {
    edi: cignaEdi,
    codeGrid: cignaCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Tennessee-specific override found.'),
    vobContact: cignaContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-tennessee': {
    edi: unitedhealthcareEdi,
    codeGrid: unitedhealthcareCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Tennessee-specific override found.'),
    vobContact: unitedhealthcareContact,
    lastUpdated: ACCESS_DATE,
  },
  'tenncare-select': {
    edi: tenncareSelectEdi,
    codeGrid: tenncareSelectCodeGrid,
    stcMap: tenncareSelectStc,
    rates: tenncareSelectRates,
    vobContact: tenncareSelectContact,
    lastUpdated: ACCESS_DATE,
  },
};
