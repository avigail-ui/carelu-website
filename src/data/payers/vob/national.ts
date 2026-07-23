/* ================================================================
   VOB ENRICHMENT — National commercial guides (aetna, cigna,
   unitedhealthcare-optum), Layers 1 (EDI routing crosswalk) and 3
   (code-level coverage grid) only — no rates, per docs/vob-build.md
   ("Do not attempt commercial rates").

   Sourcing notes (read before editing):
   - These are national-policy guides, not state guides: the clinical
     policies (Aetna CPB 0554/0648, Cigna/Evernorth EN0499, Optum's
     ABA Supplemental Clinical Criteria + Reimbursement Policy
     2022RP501A) are the SAME documents already cited in
     src/data/payers/national.ts and independently re-read during the
     Texas commercial build (vob/texas.ts's aetna-texas, cigna-texas,
     and unitedhealthcare-texas entries) — no new documents were
     fetched this pass; this file restructures already-verified facts
     into the national-scope guide, per the build spec's Layer 1/6
     guidance to reuse family manuals and the Layer 6 carve-out map
     rather than re-deriving.
   - EDI payer IDs are the generic national pVerify/Availity/Change
     Healthcare codes already used (and labeled as generic, not
     state-specific) in vob/texas.ts: Aetna 00001/60054, Cigna
     00004/62308, UnitedHealthcare 00192/87726.
   - BH carve-out fields are pulled directly from vob/carveouts.ts's
     Layer 6 'US' rows: Cigna -> Evernorth Behavioral Health (62308,
     no second EDI hop, confirmed identical in 18 of 19 states'
     guides) ships verified; Aetna's national row is fully
     'unverified' (no BH administrator named in any of the 19 states'
     guides); UnitedHealthcare/Optum has NO 'US' row in carveouts.ts
     by design — payer ID and administered-on side genuinely vary by
     state (87726 in FL/NC vs UHG007 in NY, both unresolved against
     each other) — so the national guide ships administratorPayerId
     'unverified' rather than picking one state's value as a default.
   - codeGrid unitCap/posAllowed ship 'plan-dependent' (not
     'unverified') for most codes: unlike a single state's Medicaid
     benefit, a national commercial guide spans fully-insured and
     self-funded/ERISA plans across every state mandate, and none of
     the three clinical policies state a universal unit/session
     structure — 'plan-dependent' honestly reflects that the reason
     is plan variation, not a research gap. Where a national policy
     DOES state a concrete figure (Aetna's per-code telehealth list;
     Cigna's "all ABA CPT codes are covered telehealth"; Optum's
     cluster/modifier/max-daily-unit figures in Reimbursement Policy
     2022RP501A), that figure ships with its own fieldStatus rather
     than being flattened to 'plan-dependent'.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, SourceRef, VobContact } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026. Same source already used in vob/texas.ts.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs). Same source already used in vob/texas.ts.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 — Applied Behavior Analysis (national commercial policy), already cited in src/data/payers/national.ts. Telehealth section covers 97151, 97153, 97155, 97156, 97157 via GT/95/FR modifiers per the telemedicine payment policy; 97152 explicitly excluded. No numeric unit cap, POS restriction, or BH carve-out administrator is named in this policy.'
);
const AETNA_CPB0648 = src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders (national commercial policy), already cited in src/data/payers/national.ts.');
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  "Evernorth/Cigna EN0499 — Intensive Behavioral Interventions coverage policy. Lists 97151-97158/0362T/0373T (not 99366) as \"considered medically necessary when criteria are met.\" Per the QA correction already recorded in vob/texas.ts, the document contains no per-code prior-authorization distinction and no coding/reimbursement mechanics (unit caps, POS, telehealth modifiers) — that finding is reused here rather than re-asserting the un-sourced \"no PA on assessment codes\" claim at the codeGrid layer."
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025), already cited in src/data/payers/national.ts — states verbatim "Use Evernorth payer ID 62308" (confirming no separate EDI hop) and that "all ABA CPT codes are covered telehealth services."'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national, already cited in src/data/payers/national.ts and vob/carveouts.ts. Two-step (assessment, then treatment) authorization via Provider Express; 4 code clusters (assessment: 97151/97152; direct care: 97153/97154; multi-staff: 0362T/0373T; QHP services: 97155-97158) with units flexing within a cluster without a new authorization; concurrent billing allowed for 97153+97155, 97154+97155, 97153+97156. Does not itself state a payer ID.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — national, already re-read during the Texas commercial build (vob/texas.ts). Max-daily-units and HN/HM/HO/HP modifier tiers per code; no state-specific override exists in Optum's ABA State Mandates supplement for the majority of states."
);
const OPTUM_ABA_FAQ = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaFAQ.pdf',
  'Optum ABA FAQ (Provider Express), already cited in src/data/payers/national.ts — tele-supervision and virtual family training require the provider to be an approved Optum virtual-visits provider with a completed attestation on Provider Express, and the authorization must note virtual delivery. Framed as a supplement to, not a replacement for, in-person care. Not code-specific.'
);

/* -------------------- Layer 7 vobContact source refs --------------------
   Same national contact facts already independently fetched and cited
   this pass (ACCESS_DATE 2026-07-23) in vob/tennessee.ts and vob/utah.ts —
   reused here rather than re-fetched, per this file's own convention of
   restructuring already-verified national facts rather than re-deriving
   them (see the file-header sourcing note). */
const AETNA_BH_PRECERT_LIST = src(
  'https://www.aetna.com/content/dam/aetna/pdfs/aetnacom/healthcare-professionals/documents-forms/bh_precert_list.pdf',
  'Aetna "Participating provider behavioral health precertification list for Aetna," effective 8/1/2024 — its own precertification table explicitly lists "3. Applied behavioral analysis (ABA)" against CPT codes 97151, 97152, 97153, 97154, 97155, 97156, 97157, 97158, 0362T, 0373T. States verbatim: "Commercial plans: 1-888-632-3862 (TTY: 711); Medicare plans: 1-800-624-0756 (TTY: 711)" and directs submission via the Availity provider portal (Availity.com) or AetnaElectronicPrecert.com. Already independently fetched and cited (2026-07-23) in vob/tennessee.ts.',
  true
);
const CIGNA_EBH_ADMIN_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/resourceLibrary/behavioral/ebh-provider-admin-guide.pdf',
  'Evernorth Behavioral Administrative Guidelines, PCOMM-2021-1080 (8/21) — its own "Important contact information" table states verbatim, under "Perform telephone transactions" (eligibility/coverage verification, claim status, precertification requests): "Phone: 800.926.2273"; online transactions route to Provider.Evernorth.com. Already independently fetched and cited (2026-07-23) in vob/tennessee.ts.',
  true
);
const PROVIDER_EXPRESS_SUPPORT_PAGE = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/about-us/provider-express-support.html',
  'Provider Express (Optum) Support page — states verbatim "1 866-209-9320 (toll-free)" as the Provider Express Support Center phone, hours "8 a.m. to 8 p.m. Eastern time"; live chat 8 a.m.-5 p.m. Central time through the same site. Already independently fetched and cited (2026-07-23) in vob/tennessee.ts.'
);
const OPTUM_PROVIDER_EXPRESS_CONTACT = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/contact-us.html',
  'Optum "Provider Express — Contact Us" page — Provider Services: "1-877-614-0484," Mon-Fri 7am-7pm CT (credentialing, contracting, network status, provider demographics — not itself an ABA/PA line); Provider Express secure-portal technical support "1-866-209-9320," same hours. No dedicated ABA/BH prior-authorization phone or fax published on this page — PA runs through the Provider Express portal or the number on the member\'s ID card. Already independently fetched and cited (2026-07-23) in vob/utah.ts.'
);

/* ==================== aetna (national commercial) ==================== */

const aetnaEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'unverified', administratorPayerId: 'unverified', abaRidesOn: 'unverified', twoHopRequired: 'unverified' },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      "No BH carve-out administrator is named for Aetna commercial ABA in any of the 19 states' guides in this corpus (see vob/carveouts.ts AETNA_COMMERCIAL_ROWS 'US' row) — CPB 0554/0648 govern directly with precertification via Availity (form GR-69017-4). Whether an internal Aetna BH unit or a named vendor adjudicates that precert was not confirmable from any primary source. Confirm via Aetna provider services precert line.",
    'payerId.pverify':
      "00001 is the generic national pVerify \"Aetna\" entry, reused from vob/texas.ts's aetna-texas commercial entry. pVerify separately lists \"TEXAS HEALTH AETNA\" (00875) and other regional joint-venture plans as distinct products — confirm the member's specific plan before routing.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, AETNA_CPB0554, AETNA_CPB0648],
};

const AETNA_TELEHEALTH_CODES = new Set(['97151', '97153', '97155', '97156', '97157']);

function aetnaEntry(code: string): CodeGridEntry {
  const is99366 = code === '99366';
  const telehealthYes = AETNA_TELEHEALTH_CODES.has(code);
  return {
    covered: is99366
      ? 'unverified — 99366 (interdisciplinary team meeting) is not addressed in CPB 0554 or CPB 0648'
      : 'Yes — for ASD (F84.0–F84.9) only, per national policy CPB 0554 (paired with CPB 0648)',
    paRequired: is99366
      ? 'unverified — not addressed in CPB 0554/0648'
      : 'Required — precertification (form GR-69017-4, eff. 1/1/2026), submitted via Availity or phone; reauthorization commonly ~6 months (verify per plan)',
    unitCap: 'plan-dependent — CPB 0554 sets no numeric unit or hour cap; self-funded/ERISA plans, fully-insured plan documents, and state mandates each set their own limits',
    capPeriod: 'plan-dependent',
    posAllowed: ['plan-dependent'],
    telehealth: is99366
      ? 'unverified — not addressed in CPB 0554\'s telehealth section'
      : telehealthYes
      ? "Yes — GT/95/FR modifiers per Aetna's telemedicine payment policy"
      : "No — 97152 is explicitly excluded from Aetna's ABA telehealth coverage",
    modifiers: is99366 ? ['plan-dependent'] : telehealthYes ? ['GT', '95', 'FR (telehealth)'] : ['plan-dependent'],
    notes:
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are national medical-necessity policies; unit caps, POS, and non-telehealth modifiers are governed by the specific plan document, not stated nationally.',
    fieldStatus: {
      covered: is99366 ? 'unverified' : 'verified',
      paRequired: is99366 ? 'unverified' : 'verified',
      unitCap: 'plan-dependent',
      posAllowed: 'plan-dependent',
      telehealth: is99366 ? 'unverified' : 'verified',
      modifiers: is99366 ? 'plan-dependent' : telehealthYes ? 'verified' : 'plan-dependent',
    },
    sources: [AETNA_CPB0554, AETNA_CPB0648],
  };
}

const aetnaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T', '99366'].map((code) => [code, aetnaEntry(code)])
);

/* ==================== cigna (national commercial) ==================== */

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
  verifyVia: { supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.' },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const cignaCodeGridNotes: Record<string, string> = {
  '97151': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97152': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97153': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97154': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97155': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97156': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97157': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '97158': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '0362T': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '0373T': "unverified — EN0499 does not state a per-code PA requirement (confirm via Cigna/Evernorth provider services or the precertification list)",
  '99366': 'unverified — EN0499 does not address interdisciplinary team-meeting billing',
};

const cignaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(cignaCodeGridNotes).map(([code, paRequired]) => [
    code,
    {
      covered:
        code === '99366'
          ? "unverified — 99366 (interdisciplinary team meeting) does not appear in EN0499's coding table at all"
          : 'Yes — for ASD, per national policy EN0499 (Rett syndrome/F84.2 excluded)',
      paRequired,
      unitCap: 'plan-dependent — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics (unit caps, POS) are published in it',
      capPeriod: 'plan-dependent',
      posAllowed: ['plan-dependent'],
      telehealth: code === '99366' ? 'unverified — not addressed by EN0499 or the autism resource guide' : 'Yes — "all ABA CPT codes are covered telehealth services" per Cigna\'s March 2025 provider guide',
      modifiers: ['plan-dependent — no telehealth modifier list published nationally'],
      notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; per-code PA status, unit caps, and POS are plan-dependent or unconfirmed nationally.',
      fieldStatus: {
        covered: code === '99366' ? 'unverified' : 'verified',
        paRequired: 'unverified',
        unitCap: 'plan-dependent',
        posAllowed: 'plan-dependent',
        telehealth: code === '99366' ? 'unverified' : 'verified',
        modifiers: 'plan-dependent',
      },
      sources: code === '99366' ? [CIGNA_EN0499] : [CIGNA_EN0499, CIGNA_AUTISM_RESOURCE_GUIDE],
    },
  ])
);

/* ==================== unitedhealthcare-optum (national commercial) ==================== */

const unitedhealthcareOptumEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "vob/carveouts.ts deliberately ships no national 'US' row for UnitedHealthcare/Optum commercial — the payer ID and administered-on side vary by state and are unresolved even against each other (87726 in FL/NC vs. UHG007 in NY, flagged as a cross-file inconsistency, neither picked as a default). Confirm the specific plan's routing via Provider Express or the state-specific guide in this corpus before assuming a national default.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId — genuinely state-dependent, not a national default.',
    'bhCarveOut.twoHopRequired':
      "Optum's own SCC describes a two-step UM/authorization workflow (assessment auth, then treatment auth) — that is distinct from whether the 270/271 ELIGIBILITY check itself requires a second EDI hop, which is not confirmed nationally.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_SCC],
};

const UHC_OPTUM_UNIT_CAPS: Record<string, string> = {
  '97151': '32 units/day (≤8 hrs)',
  '97152': '16 units/day (≤4 hrs)',
  '97153': '32 units/day (≤8 hrs)',
  '97154': '18 units/day (≤4.5 hrs)',
  '97155': '24 units/day (≤6 hrs)',
  '97156': '16 units/day (≤4 hrs)',
  '97157': '16 units/day (≤4 hrs)',
  '97158': '16 units/day (≤4 hrs)',
  '0362T': '16 units/day (≤4 hrs)',
  '0373T': '32 units/day (≤8 hrs)',
};

const UHC_OPTUM_MODIFIERS: Record<string, string[]> = {
  '97151': ['HN', 'HO', 'HP'],
  '97152': ['HN', 'HM', 'HO', 'HP'],
  '97153': ['HN', 'HM', 'HO', 'HP'],
  '97154': ['HN', 'HM', 'HO', 'HP'],
  '97155': ['HN', 'HO', 'HP'],
  '97156': ['HN', 'HO', 'HP'],
  '97157': ['HN', 'HO', 'HP'],
  '97158': ['HN', 'HO', 'HP'],
  '0362T': [],
  '0373T': [],
};

function unitedhealthcareOptumEntry(code: string): CodeGridEntry {
  const is99366 = code === '99366';
  const optumCap = UHC_OPTUM_UNIT_CAPS[code];
  return {
    covered: is99366 ? "unverified — 99366 is not addressed in Optum's ABA Supplemental Clinical Criteria or Reimbursement Policy 2022RP501A" : 'Yes',
    paRequired: is99366
      ? 'unverified'
      : "Required — step 1 of Optum's two-step authorization (assessment auth via Provider Express), then step 2 treatment auth; continued-service reviews every 4–6 months",
    unitCap: is99366
      ? 'unverified'
      : `plan-dependent — Optum's national Reimbursement Policy 2022RP501A default is ${optumCap}; state mandates and ASO/fully-insured plan terms can override this figure`,
    capPeriod: is99366 ? 'unverified' : 'plan-dependent — day, per Optum default; confirm against the specific plan',
    posAllowed: ['plan-dependent'],
    telehealth: is99366
      ? 'unverified'
      : "Tele-supervision and virtual family training allowed with an approved Optum virtual-visits attestation on Provider Express (framed as a supplement to, not replacement for, in-person care); no per-code telehealth-eligibility list found nationally",
    modifiers: is99366 ? ['unverified'] : UHC_OPTUM_MODIFIERS[code] ?? ['plan-dependent'],
    notes:
      "Unit caps sourced from Optum's national ABA Reimbursement Policy (2022RP501A), shipped as 'plan-dependent' at the national-guide level since state mandates and ASO/fully-insured status can each override the default. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: is99366 ? 'unverified' : 'verified',
      paRequired: is99366 ? 'unverified' : 'verified',
      unitCap: is99366 ? 'unverified' : 'plan-dependent',
      posAllowed: 'plan-dependent',
      telehealth: is99366 ? 'unverified' : 'verified',
      modifiers: is99366 ? 'unverified' : (UHC_OPTUM_MODIFIERS[code]?.length ? 'inferred' : 'plan-dependent'),
    },
    sources: is99366 ? [OPTUM_SCC] : [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_ABA_FAQ],
  };
}

const unitedhealthcareOptumCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T', '99366'].map((code) => [code, unitedhealthcareOptumEntry(code)])
);

/* ==================== Layer 7 — vobContact ==================== */

const aetnaContact: VobContact = {
  providerServicesPhone: '1-888-632-3862 (commercial) / 1-800-624-0756 (Medicare)',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'Does Aetna administer ABA in-house for this plan, or via a behavioral-health carve-out — and if carved out, what administrator/payer ID should we use for eligibility checks?',
    'Does this plan support real-time (vs. batch) 270/271 eligibility for payer ID 00001?',
    'What are the daily/session unit caps for 97151-97158 and 0362T/0373T under this specific plan?',
    'What place-of-service settings (home/office/school/telehealth) does this plan allow for ABA, and what modifiers does it require?',
    'Is 99366 (interdisciplinary team meeting) a covered, billable benefit under this plan?',
  ],
  sources: [AETNA_BH_PRECERT_LIST],
};

const cignaContact: VobContact = {
  providerServicesPhone: '1-800-926-2273 (Evernorth Behavioral Health)',
  portal: { name: 'CignaforHCP / Provider.Evernorth.com', url: 'https://cignaforhcp.cigna.com/app/login' },
  scriptedQuestions: [
    'Does this plan require prior authorization on ABA assessment codes (97151/97152/0362T) separately from treatment codes, since EN0499 does not state a per-code PA distinction?',
    'Is 99366 (interdisciplinary team meeting) a covered, billable benefit under this plan?',
    'What are the daily/session unit caps for 97151-97158 and 0362T/0373T under this specific plan?',
    'What place-of-service settings does this plan allow for ABA, and what modifiers (beyond the confirmed telehealth-everywhere policy) does it require?',
    'Does this plan support real-time (vs. batch) 270/271 eligibility for payer ID 00004?',
  ],
  sources: [CIGNA_EBH_ADMIN_GUIDE],
};

const unitedhealthcareOptumContact: VobContact = {
  providerServicesPhone: '1-877-614-0484 (Provider Express — Behavioral Health/ABA)',
  hours: 'Mon-Fri 7:00am-7:00pm CT',
  ivrPath: 'Provider Express secure-portal technical support runs a separate line, 1-866-209-9320, same hours — use 877-614-0484 for BH/ABA authorization and eligibility questions, not portal login issues.',
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com/' },
  scriptedQuestions: [
    'Does ABA route through Optum Behavioral Health, or directly through UnitedHealthcare medical benefits for this specific plan?',
    'What EDI payer ID routes the BH-side 270/271 eligibility check for this plan, and does eligibility itself require a second hop to Optum, or only the PA/UM step?',
    'Do the national Reimbursement Policy (2022RP501A) daily unit caps apply to this specific plan, or does a state mandate/ASO plan document override them?',
    'What place-of-service settings are allowed for ABA, and is telehealth permitted beyond tele-supervision/virtual family training?',
    'Is 99366 (interdisciplinary team meeting) a covered, billable benefit under this plan?',
  ],
  sources: [OPTUM_PROVIDER_EXPRESS_CONTACT, PROVIDER_EXPRESS_SUPPORT_PAGE],
};

/* ==================== export ==================== */

export const nationalVob: Record<string, VobExtension> = {
  aetna: {
    edi: aetnaEdi,
    codeGrid: aetnaCodeGrid,
    vobContact: aetnaContact,
    lastUpdated: ACCESS_DATE,
  },
  cigna: {
    edi: cignaEdi,
    codeGrid: cignaCodeGrid,
    vobContact: cignaContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-optum': {
    edi: unitedhealthcareOptumEdi,
    codeGrid: unitedhealthcareOptumCodeGrid,
    vobContact: unitedhealthcareOptumContact,
    lastUpdated: ACCESS_DATE,
  },
};
