/* ================================================================
   VOB ENRICHMENT — New York, split B: upstate Medicaid MCOs +
   commercial (Aetna, Cigna, UnitedHealthcare). Layers 1 (EDI routing
   crosswalk) + 3 (code-level coverage grid). See docs/vob-build.md.
   Layer 4 (Medicaid rates) is deliberately NOT populated for any
   guide in this split: none of the 5 upstate MCOs publish their own
   ABA rate schedule (the state eMedNY fee schedule is FFS-only and
   explicitly does not bind MMC plans — "MMC plans negotiate their
   own rates," per the eMedNY ABA Policy Manual as summarized in the
   new-york-medicaid guide), and commercial rates are out of scope by
   spec. A sibling change-set covers new-york-medicaid + downstate
   MCOs in this same file — this split ONLY touches the 8 slugs
   below; never edit another slug's block.

   Sourcing notes (read before editing):
   - pVerify and Availity payer IDs below come from live extraction
     of the same two public payer-list PDFs cited throughout this
     corpus (pverify.com All-Payers-List and Availity Essentials
     payer_list_wShortNames), re-fetched and parsed to a structured
     table this pass (both PDFs defeat naive text extraction — they
     render as column-separated blocks without table parsing — so
     confirm against the source PDF directly if re-verifying by eye).
   - Of the 5 upstate MCOs, only Excellus, Independent Health, and
     UnitedHealthcare/Aetna/Cigna resolve to a single unambiguous
     pVerify ID; MVP and Highmark WNY had a Medicaid-specific line
     item captured directly (MVP's general ID cross-confirmed against
     its own Payee ID 14165 cited in its Provider Policies document;
     Highmark's Medicaid-and-CHP line is pVerify's own explicit
     label). CDPHP has two unresolved candidate IDs. NONE of the 5
     upstate MCOs, and neither Excellus/CDPHP/Independent
     Health/Highmark, appear at all in the fetched Availity payer
     list — flagged per-guide as unverified rather than guessed.
   - UnitedHealthcare's Optum Behavioral Health carve-out payer ID
     (UHG007, pVerify) and Cigna's Evernorth same-ID pass-through
     (62308, Availity + Cigna's own Autism Resource Guide) both
     resolve cleanly. Aetna's BH administration in New York remains
     unconfirmed — no NY-specific Aetna document names one, matching
     this corpus's Georgia finding for the same payer.
   - Code-grid mechanics (unit caps, POS codes, billing modifiers) are
     largely 'unverified' for the 5 MCOs: unlike Georgia, New York's
     own FFS ABA Policy Manual doesn't publish billing modifiers or
     per-code POS numbers either (confirmed by re-reading the
     new-york-medicaid guide's own sourced sections) — so the absence
     here reflects the state's own documentation style, not a gap in
     this pass's research. Where a plan states something concrete
     (MVP's Medicaid-specific 0362T/0373T exclusion and school-setting
     bar; Highmark's $45,000/year cap and named telehealth codes;
     Excellus's/CDPHP's/Independent Health's named code lists or
     service categories) it is carried over verified from the guide
     prose's own already-cited primary sources.
   - Commercial codeGrid entries mirror this corpus's Georgia findings
     for Aetna/Cigna/UnitedHealthcare (none of the three publish
     code-level unit caps, POS codes, or modifiers in their national
     clinical policies) with New York's mandate specifics — the
     680-hour/year cap and LBA-only delivery requirement — layered on
     as notes, since DFS Circular Letter 6 and NYSED Article 167 (both
     already cited in the guide prose) verify them for New York
     directly.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 — re-fetched and parsed to a structured table this pass (table-extraction, not raw text, was required to reliably associate payer names with codes).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs) — re-fetched and parsed to a structured table this pass. Carries an "As of 08/08/2012" footer on its last page (matching this corpus\'s prior aetna-florida finding on the same URL) — treated as INFERRED, not verified, for any ID sourced from it alone; long-standing national payer IDs (Aetna 60054, Cigna 62308, UnitedHealthcare 87726) are unlikely to have changed since, but a current re-export was not available this pass.',
  true
);
const DFS_CL6 = src(
  'https://www.dfs.ny.gov/industry_guidance/circular_letters/cl2014_06',
  'DFS Insurance Circular Letter No. 6 (2014) — Standards for Insurance Coverage for ABA: 680 hours/policy-year cap (not a dollar cap), no age limit, LBA/CBAA delivery requirement effective 10/11/2014.'
);
const NYSED_ARTICLE_167 = src(
  'https://www.op.nysed.gov/professions/licensed-behavior-analysts/laws-rules-regulations/article-167',
  'NYSED Office of the Professions — Education Law Article 167 (§§ 8800-8808): Licensed Behavior Analyst (LBA) credential required to practice/bill; BCBA alone insufficient.'
);
const EMEDNY_ABA_POLICY = src(
  'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf',
  "eMedNY ABA Provider Policy Manual (updated Oct 1, 2025) — state FFS baseline: no prior authorization at FFS, referral-gated; carved into mainstream MMC 1/1/2023 with each plan setting its own PA. Does not itself publish billing modifiers or per-code POS numbers — New York's own state manual is silent on that mechanic, unlike Georgia's GT/U1-U7 convention."
);
const EMEDNY_MC_DIRECTORY = src(
  'https://www.emedny.org/providermanuals/allproviders/pdfs/information_for_all_providers_managed_care_information.pdf',
  'eMedNY — Managed Care Information plan directory (v2026-2) — confirms Excellus, MVP, CDPHP, Independent Health, and Highmark Western & Northeastern NY all carry the mainstream MMC ABA carve-in.'
);

/* -------------------- commercial (national) source refs -------------------- */

const AETNA_CPB0554 = src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis (national policy).');
const AETNA_CPB0648 = src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders (national policy); no unit caps, POS codes, or modifiers published; no separate Aetna ABA billing/reimbursement policy located.');
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 (national policy, applies fully in NY with no state carve-out) — no PA on assessment codes 97151/97152/0362T; PA required for treatment codes; excludes Rett syndrome (F84.2), which NY Medicaid covers.'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim: "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna\'s medical claims nationally, New York included (no separate Evernorth EDI hop).'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy; no CPT codes, unit caps, or POS/telehealth mechanics published.'
);
const OPTUM_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  "Optum ABA State Mandates supplemental criteria (BH 803ABA, Jan 2026) — carries an explicit New York entry, but it restates state MEDICAID/Child Health Plus criteria, not a commercial-mandate override; commercial NY members run on national UHC/Optum criteria plus the NY Insurance Law floor."
);

/* -------------------- codeGrid factories -------------------- */

const ALL_CODES = ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T'];

function nyMandateNote(extra?: string): string {
  return [
    "New York's autism mandate (Ins. Law §§ 3216(i)(25), 3221(l)(17), 4303(ee); DFS CL6) caps ABA at 680 hours per policy/calendar year for fully-insured plans (an hours cap, not dollars) and requires NYSED LBA/CBAA delivery or supervision — self-funded ERISA plans are exempt by preemption.",
    extra,
  ]
    .filter(Boolean)
    .join(' ');
}

function aetnaNyEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (form GR-69017-4), per national CPB 0554',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: nyMandateNote(
      'No NY-specific Aetna policy, form, or billing supplement was found — the national CPBs and precert form are the whole picture; the mandate reaches Aetna through Insurance Law, not an Aetna document. Verify via: Aetna provider services / precertification.'
    ),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AETNA_CPB0554, AETNA_CPB0648, DFS_CL6, NYSED_ARTICLE_167],
  };
}

function cignaNyEntry(paRequired: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: nyMandateNote(
      'EN0499 excludes Rett syndrome (F84.2), which NY Medicaid covers — a Rett family with a Cigna card should be routed through benefits verification and the plan document, not assumed covered. Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it.'
    ),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CIGNA_EN0499, DFS_CL6, NYSED_ARTICLE_167],
  };
}

function uhcNyEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — two-step Optum authorization (assessment, then treatment) via Provider Express; continued-service review every 4-6 months',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes: nyMandateNote(
      "Unit caps/modifiers carried from Optum's NATIONAL ABA Reimbursement Policy (2022RP501A) as 'inferred' — no NY-specific override confirmed. Optum's ABA State Mandates supplement does carry a NY entry, but it restates Medicaid/CHP criteria only, not a commercial override. Verify via: Provider Express / UHC provider services."
    ),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_STATE_MANDATES, DFS_CL6, NYSED_ARTICLE_167],
  };
}

/* Excellus: named in Medical Policy 3.01.11; PA/telehealth mechanics not published. */
const EXCELLUS_POLICY = src(
  'https://www.excellusbcbs.com/documents/d/global/exc-prv-applied-behavior-analysis',
  "Excellus Medical Policy 3.01.11, Applied Behavior Analysis (eff. 6/18/2026) — names 97151-97158, 0362T, 0373T as codes in scope; documentation and licensure tiers (LBA/BCBA, CBAA/BCaBA, RBT) specified; no unit-cap table, POS codes, or billing modifiers published."
);
const EXCELLUS_PA_PAGE = src('https://www.excellusbcbs.com/prior-authorization', "Excellus general Prior Authorization guidance — directs providers to check eMedNY for code-level Medicaid coverage before submitting a PA request; no ABA-specific PA list found.");
const EXCELLUS_TELEHEALTH = src(
  'https://provider.excellusbcbs.com/documents/20152/127460/EXC-PRV-Telehealth_Telemedicine+Corporate+Medical+Policy.pdf',
  "Excellus Telemedicine and Telehealth Corporate Medical Policy (#1.01.49) — does not list any ABA codes in its covered CPT/HCPCS table; ABA-code telehealth reimbursement is unconfirmed."
);

function excellusEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: "Not published for outpatient ABA specifically — medical policy describes a \"medical necessity review... when applicable,\" not a hard per-code PA gate",
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — no ABA codes appear in the general Telehealth Corporate Medical Policy\'s covered-code table',
    modifiers: ['unverified — policy names LBA/BCBA, CBAA/BCaBA, and RBT/behavior-technician licensure tiers but no billing modifier codes'],
    notes: `Code ${code} named in scope by Medical Policy 3.01.11. Verify PA specifics, unit limits, and telehealth billing in writing via BH Care Management (no vendor carve-out; handled in-house) before booking.`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [EXCELLUS_POLICY, EXCELLUS_PA_PAGE, EXCELLUS_TELEHEALTH],
  };
}

/* MVP: named payment policy with a Medicaid-specific 0362T/0373T exclusion + school-setting bar. */
const MVP_PAYMENT_POLICY = src(
  'https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/provider-policies-and-payment-policies/2026/april/mvp-payment-policies-effective-april-1-2026.pdf',
  "MVP Applied Behavior Analysis Services Payment Policy (eff. 4/1/2026) — names 97151-97158, 0362T, 0373T, but excludes 0362T and 0373T from Medicaid Managed Care (MMC) reimbursement specifically; RBT/unlicensed-rendered services reimbursable only under 97152/97153/97154; telehealth tied to an expired CMS-waiver reference (3/31/2025) without a stated current policy."
);
const MVP_BH_AUTH_GRID = src(
  'https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/provider/online-resources/bh-services-and-authorization-requirements',
  'MVP Behavioral Health Services and Authorization Requirements — "Applied Behavior Analysis" listed "Auth Required" for NY Medicaid/CHP, ages 0-20, eff. 1/1/2023.'
);
const MVP_FASTFAX_SCHOOL = src(
  'https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/fastfax/2025/2025-16-aba-school-setting-exclusion.pdf',
  'MVP FastFax #2025.16 (3/27/2025) — effective 7/1/2025, ABA (all 10 codes) is administratively denied when billed with Place of Service = School.'
);

function mvpEntry(code: string): CodeGridEntry {
  const mmcExcluded = code === '0362T' || code === '0373T';
  const rbtEligible = code === '97152' || code === '97153' || code === '97154';
  return {
    covered: mmcExcluded ? 'No — excluded from Medicaid Managed Care reimbursement specifically (billable on MVP\'s other lines of business, per the payment policy)' : 'Yes',
    paRequired: mmcExcluded
      ? 'N/A — not reimbursable under MMC'
      : 'Required — MVP\'s ABA Payment Policy requires PA for both assessment and treatment; referral from an NYS-licensed, Medicaid-enrolled physician/psychologist/psychiatric NP/pediatric NP/PA, valid 2 years',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['home', 'office/clinic', 'community', 'NOT school (POS = School administratively denied eff. 7/1/2025)'],
    telehealth: "Plan-dependent/unverified — MVP's payment policy ties ABA telehealth reimbursement to a CMS waiver referencing 3/31/2025 without a subsequent update; confirm current status with Provider Services",
    modifiers: rbtEligible
      ? ['RBT/unlicensed-professional-rendered services reimbursable under this code (97152/97153/97154 only, per the payment policy)']
      : ['unverified — no billing modifier codes published; RBT/unlicensed-rendered services are NOT reimbursable under this code per the payment policy'],
    notes: mmcExcluded
      ? 'Appears on MVP\'s general covered-code list but explicitly excluded from Medicaid Managed Care reimbursement — verify before billing to avoid a denial.'
      : 'Submit PA by phone (1-800-684-9286), fax (1-855-853-4850), or email (BHservices@mvphealthcare.com). Confirm HARP coverage directly — the current policy\'s scope lists HARP without explicitly reversing an older stated HARP exclusion.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'verified',
      telehealth: 'unverified',
      modifiers: 'verified',
    },
    sources: [MVP_PAYMENT_POLICY, MVP_BH_AUTH_GRID, MVP_FASTFAX_SCHOOL],
  };
}

/* CDPHP: only 97151-97158 named (no T-codes); PA/limit specifics behind the secure portal. */
const CDPHP_POAM_18 = src(
  'https://www.cdphp.com/-/media/files/providers/poam/section-18-behavioral-health.pdf',
  'CDPHP Provider Office Administrative Manual, Section 18 — Behavioral Health (rev. July 2025) — names 97151-97158 (NOT 0362T/0373T) as ABA CPT codes in scope; "not subject to a maximum benefit"; ABA must be provided/supervised by a NYS-licensed BCBA/BCBA-D; code-level PA/limits deferred to the secure provider portal.'
);
const CDPHP_POAM_5 = src(
  'https://www.cdphp.com/-/media/files/providers/poam/section-5-referral-authorization-process.pdf',
  'CDPHP POAM Section 5 — Referral/Authorization Process (rev. January 2025) — "certain" BH services in Medicaid-Select/HARP require PA via the Behavioral Health Access Center; whether ABA is among them is not stated.'
);
const CDPHP_TELEHEALTH = src(
  'https://www.cdphp.com/-/media/files/providers/behavioral-health/hedis-toolkit-and-bh-guidelines/practice-guidelines-telemental-health.pdf',
  'CDPHP behavioral-health resources link to the American Telemedicine Association\'s 2017 telemental-health practice guidelines (a third-party clinical standard, not a CDPHP coverage commitment) — no CDPHP-specific ABA telehealth billing policy found.'
);

function cdphpEntry(code: string): CodeGridEntry {
  const named = code !== '0362T' && code !== '0373T';
  return {
    covered: named ? 'Yes' : 'unverified — not named in the POAM\'s ABA code list (which enumerates only 97151-97158)',
    paRequired: 'unverified — CDPHP states "certain" BH services require PA via the Behavioral Health Access Center but does not confirm whether ABA codes are among them',
    unitCap: named ? 'Not subject to a maximum benefit (per POAM §18) — but code-level unit limits, if any, sit behind the secure Prior Authorization Guideline on provider.cdphp.com, unconfirmed' : 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified — no CDPHP-specific ABA telehealth billing policy found',
    modifiers: ['unverified — POAM requires NYS-licensed BCBA/BCBA-D delivery/supervision but publishes no billing modifier codes'],
    notes: 'Call the Behavioral Health Access Center (518-641-3600 / 1-888-320-9584) and get PA/limit specifics in writing per case before booking.',
    fieldStatus: {
      covered: named ? 'verified' : 'unverified',
      paRequired: 'unverified',
      unitCap: named ? 'verified' : 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [CDPHP_POAM_18, CDPHP_POAM_5, CDPHP_TELEHEALTH],
  };
}

/* Independent Health: no CPT-level breakdown published — service categories only. */
const IH_BH_STATE_PRODUCTS = src(
  'https://www.independenthealth.com/providers/policies-and-guidelies/behavioral-health-for-state-products',
  '"Carelon now oversees all behavioral health benefit management services for our MediSource, MediSource Connect, Child Health Plus and Essential Plans" — general BH delegation statement; does not mention ABA specifically.'
);
const IH_MEDISOURCE_HANDBOOK = src(
  'https://www.independenthealth.com/content/dam/independenthealth/individuals-and-families/find-a-health-plan/documents/state/medisource-member-handbook.pdf',
  '2026 MediSource Member Handbook — describes ABA in "Independent Health covers..." language, placed apart from the Carelon-branded "Behavioral Health Care" section; covered service TYPES named (individual/group treatment, family training) but no CPT codes, unit caps, or PA specifics given.'
);

function independentHealthEntry(): CodeGridEntry {
  return {
    covered: 'Yes (service category, not broken out per CPT code) — "Independent Health covers..." language in the MediSource handbook, apart from the Carelon-branded BH section',
    paRequired: 'unverified — handbook\'s general member-facing PA list doesn\'t name ABA specifically, but that list is a simplified member summary, not a provider code grid',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['home', 'other setting (named generically; no POS codes given)'],
    telehealth: 'unverified — no ABA-specific telehealth policy found',
    modifiers: ['unverified — handbook requires LBA delivery or LBA-supervised CBAA delivery; no billing modifier codes published'],
    notes:
      "Confirm whether Independent Health or Carelon actually adjudicates this code before routing — the handbook's ABA section carries no Carelon reference anywhere, unlike the general BH section, but no single provider-facing sentence states the split explicitly. Erie County (Buffalo) footprint only — not Monroe/Rochester.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'inferred',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [IH_BH_STATE_PRODUCTS, IH_MEDISOURCE_HANDBOOK],
  };
}

/* Highmark WNY: $45k/yr cap, confirmed PA, and named telehealth codes (dated bulletin). */
const HIGHMARK_PROVIDER_MANUAL = src(
  'https://providerpublic.mybcbswny.com/docs/gpp/NYNY_NYW_ProviderManual.pdf',
  'Highmark BCBS of Western New York Provider Manual (eff. 4/1/2026) — "$45,000 per calendar year" ABA benefit maximum; ABA "requires authorization" across MMC/SSI/HARP/CHPlus; BH delegated to Wellpoint Partnership Plan, LLC since 2016, though the same manual\'s vendor-disclosure footer also names Carelon Behavioral Health IPA Strategies without clarifying scope.'
);
const HIGHMARK_ASD_TESTING_FORM = src(
  'https://providerpublic.mybcbswny.com/docs/gpp/NYHM_ReqAuth_AutismSpectrumDisorderTesting.pdf',
  'Highmark WNY — Request for Authorization: Autism Spectrum Disorder Testing (Feb 2026) — gates the diagnostic workup (96130, 96131, 96136-96139) ahead of ABA access; submit via Availity Essentials or fax 844-452-8073.'
);
const HIGHMARK_TELEHEALTH_BULLETIN = src(
  'https://providerpublic.mybcbswny.com/docs/gpp/NYNY_NYW_CAID_PU_COVID19GuidanceTelehealthBH.pdf',
  'Highmark WNY COVID-19 Telehealth/Telephonic Guidance for BH Services (orig. June 2020, republished Jan 2022) — recognizes ABA telehealth for 97151, 97153, 97155 (FBA/protocol/protocol-modification) and 97156/97157 (caregiver training), POS 02, modifier 95 or GT; audio-only does not qualify. No newer document found superseding it.'
);

function highmarkEntry(code: string): CodeGridEntry {
  const telehealthCodes = ['97151', '97153', '97155', '97156', '97157'];
  const hasTelehealth = telehealthCodes.includes(code);
  return {
    covered: 'Yes',
    paRequired: 'Required — listed on the Provider Manual\'s BH prior-authorization table for MMC/SSI ("Covered effective 1/1/2023: requires authorization") and HARP/CHPlus ("Covered: requires authorization")',
    unitCap: 'unverified — no per-code unit cap published; the manual states a $45,000-per-calendar-year benefit MAXIMUM (dollar cap, not a per-code unit cap) covering the whole ABA benefit',
    capPeriod: 'calendar year (benefit-level dollar cap, not per-code)',
    posAllowed: hasTelehealth ? ['telehealth (POS 02)', 'unverified for other settings'] : ['unverified'],
    telehealth: hasTelehealth
      ? `Yes — confirmed via a 2020/Jan-2022 COVID-era bulletin: POS 02, modifier 95 or GT; audio-only does not qualify. Bulletin predates current policy cycles — verify it's still operative with Provider Services before relying on it.`
      : 'unverified — not named in the only telehealth bulletin found (which lists 97151/97153/97155/97156/97157 specifically)',
    modifiers: hasTelehealth ? ['95', 'GT'] : ['unverified'],
    notes:
      code === '97151'
        ? 'A standalone "Request for Authorization: Autism Spectrum Disorder Testing" form gates the diagnostic workup ahead of this code and explicitly asks whether the request is meant to access ABA services.'
        : "Track the $45,000/calendar-year benefit cap as a scheduling constraint from day one. Confirm with Provider Services whether Wellpoint Partnership Plan or Carelon is the operative BH/ABA reviewer for this case.",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: hasTelehealth ? 'verified' : 'unverified',
      telehealth: hasTelehealth ? 'verified' : 'unverified',
      modifiers: hasTelehealth ? 'verified' : 'unverified',
    },
    sources: hasTelehealth
      ? [HIGHMARK_PROVIDER_MANUAL, HIGHMARK_ASD_TESTING_FORM, HIGHMARK_TELEHEALTH_BULLETIN]
      : [HIGHMARK_PROVIDER_MANUAL, HIGHMARK_ASD_TESTING_FORM],
  };
}

/* ==================== EDI routing per guide ==================== */

const excellusEdi: EdiRouting = {
  payerId: { pverify: '00465', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — in-house BH Care Management; no vendor carve-out found',
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
      "Listed as \"BCBS of New York (Excellus)\" (00465, Elig/Claim: Yes) — pVerify also separately lists regional sub-brand entries with no Medicaid designation on any of them: BCBS of Central New York (00330), Univera (00451), BCBS of the Rochester Area (00308), BCBS of Utica-Watertown (00309). No Medicaid-specific Excellus line item exists in this list — confirm which code routes Medicaid Managed Care eligibility checks before automating.",
    'payerId.availity': 'No Excellus/BCBS-New York entry of any kind found in the fetched Availity payer list — confirm directly with Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, EXCELLUS_PA_PAGE, EMEDNY_MC_DIRECTORY, src('https://provider.excellusbcbs.com/authorizations/sds-portal', 'Excellus provider portal — SDS authorization portal; BH Care Management runs through Excellus directly, not a named UM vendor.')],
};

const mvpEdi: EdiRouting = {
  payerId: { pverify: '00156', availity: '14165', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — in-house BH/ABA UM (MVP wrote its own ABA medical-necessity criteria in 2021); no vendor carve-out for BH specifically',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify's only MVP match is explicitly labeled \"00156 MVP Health Care (New York) - MVP Child Health Plus,\" not a general Medicaid Managed Care line — no separate MMC-labeled pVerify entry was found. Treat 00156 as CHP-specific and confirm the MMC-line ID with pVerify onboarding before automating on it for non-CHP Medicaid members.",
    'payerId.availity':
      "Verified independent of the (stale, 2012-dated) Availity PDF: MVP's own 2025 Provider Policies document states directly \"EDI submissions use Payee ID 14165,\" which the Availity list also carries as \"14165 MVP HEALTH PLAN.\"",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [
    PVERIFY_PAYER_LIST,
    AVAILITY_PAYER_LIST,
    src(
      'https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/provider-policies-and-payment-policies/2025/january/mvp-provider-policies-effective-january-1-2025.pdf',
      'MVP 2025 Provider Policies — states EDI submissions use Payee ID 14165, cross-confirming the Availity "14165 MVP HEALTH PLAN" entry as MVP\'s general claims/EDI ID.'
    ),
  ],
};

const cdphpEdi: EdiRouting = {
  payerId: { pverify: '00328', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — in-house CDPHP Behavioral Health Access Center (518-641-3600 / 1-888-320-9584); no named BH vendor carve-out',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists TWO unresolved candidates for CDPHP: \"00328 Capital District Physicians Health Plan (CDPHP)\" and \"002466 CDPHP(Capital District Physicians Health Plan)\" — both generic (Elig: Yes, Claim: No on both), neither labeled Medicaid vs. commercial. Confirm which code applies to Medicaid Managed Care specifically via pVerify onboarding before automating.",
    'payerId.availity': 'No CDPHP entry of any kind found in the fetched Availity payer list — confirm directly with Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CDPHP_POAM_5],
};

const independentHealthEdi: EdiRouting = {
  payerId: { pverify: '00436', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator:
      'Carelon Behavioral Health manages general BH for MediSource per the plan\'s own policy page, but ABA appears to sit outside that delegation and be administered by Independent Health directly (inferred from handbook structure, not a single explicit provider-facing statement)',
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
    'payerId.availity': 'No Independent Health entry of any kind found in the fetched Availity payer list — confirm directly with Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      'Confirm with Independent Health Provider Services (716-250-7183 / 1-833-891-9372) whether ABA authorizations/claims route to Carelon\'s EDI hop (BHOVO/similar) or bill directly to Independent Health\'s own payer ID (00436) before assuming either.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, IH_BH_STATE_PRODUCTS, IH_MEDISOURCE_HANDBOOK],
};

const highmarkWnyEdi: EdiRouting = {
  payerId: { pverify: '01357', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator:
      'Wellpoint Partnership Plan, LLC (formerly Amerigroup Partnership Plan) — has administered Medicaid/HARP/CHPlus BH since 2016 per the Provider Manual\'s numerous Medicaid-specific citations, though the same manual\'s vendor-disclosure footer also names Carelon Behavioral Health IPA Strategies without clarifying scope',
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
    'payerId.pverify':
      "pVerify's \"01357 HIGHMARK BCBS WESTERN NY - MEDICAID AND CHP\" is the Medicaid-specific line item (used here); note two adjacent general-brand entries also exist and are NOT used for this Medicaid guide — \"00325 BCBS of Western New York\" and \"00326 Healthnow\" (the plan's pre-2021 legacy name).",
    'payerId.availity': 'No Highmark Western New York-specific entry found in the fetched Availity payer list (only generic Pennsylvania-associated "HIGHMARK" / "HIGHMARK - KEY FAMILY" entries, not used here) — confirm directly with Availity onboarding.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      'Contact WNYBehavioralHealthTeam@wellpoint.com or Highmark WNY Provider Services to confirm whether Wellpoint or Carelon adjudicates ABA specifically, and get that entity\'s own EDI payer ID before routing.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, HIGHMARK_PROVIDER_MANUAL, EMEDNY_ABA_POLICY],
};

const aetnaNyEdi: EdiRouting = {
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
      '60054 is a long-standing national Aetna payer ID (also carried in this corpus\'s Georgia guide), but the only Availity source located this pass carries an "As of 08/08/2012" footer — get a current Availity export to independently reconfirm before treating it as verified.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'No NY-specific Aetna document names a BH carve-out administrator (matching this corpus\'s Georgia finding for the same payer) — confirm via Aetna provider services or the ABA precertification form (GR-69017-4) whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for New York.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const cignaNyEdi: EdiRouting = {
  payerId: { pverify: '00004', availity: '62308', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      '62308 is a long-standing national Cigna payer ID (also carried in this corpus\'s Georgia guide, and confirmed by Cigna\'s own Autism Resource Guide for ABA specifically), but the only Availity source located this pass carries an "As of 08/08/2012" footer — get a current Availity export to independently reconfirm before treating it as verified.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "The Availity payer list ALSO separately lists a distinct \"Cigna Behavioral Health\" line item (codes 2331/CIGNABHVL2/MCCBV and admin aliases F02331/F12345/FMCCBV) — not used here because Cigna's own Autism Resource Guide states verbatim to use 62308 for ABA/autism claims; flagging the alternate entry in case a given clearinghouse routes ABA through it instead.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const uhcNyEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'UHG007',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      "The fetched Availity list DOES carry a plain \"87726 UNITEDHEALTHCARE\" entry (a correction over this corpus's Georgia guide, which found none) — confirm it's the same ID used for NY eligibility routing specifically.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.abaRidesOn':
      "pVerify lists a distinct \"UHG007 United Healthcare - Optum Behavioral Solutions\" line (Elig/Claim: Yes) separate from UHC's own 87726/00192 — resolving this corpus's prior Georgia-guide ambiguity on the carve-out's own payer ID, but whether ABA specifically rides that hop vs. UHC's medical ID for NY commercial members is still unconfirmed. Verify via Provider Express / UHC provider services.",
    'bhCarveOut.twoHopRequired': 'Same as abaRidesOn.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_SCC],
};

/* ==================== codeGrids per guide ==================== */

function buildGrid(fn: (code: string) => CodeGridEntry): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const code of ALL_CODES) grid[code] = fn(code);
  return grid;
}

const excellusCodeGrid = buildGrid(excellusEntry);
const mvpCodeGrid = buildGrid(mvpEntry);
const cdphpCodeGrid = buildGrid(cdphpEntry);
const independentHealthCodeGrid = buildGrid(() => independentHealthEntry());
const highmarkCodeGrid = buildGrid(highmarkEntry);

const aetnaNyCodeGrid = buildGrid(() => aetnaNyEntry());
const cignaNyCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaNyEntry('Not required (per EN0499)'),
  '97152': cignaNyEntry('Not required (per EN0499)'),
  '97153': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaNyEntry('Not required (per EN0499)'),
  '0373T': cignaNyEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};
const uhcNyCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcNyEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcNyEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcNyEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcNyEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcNyEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcNyEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcNyEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcNyEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcNyEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcNyEntry('32 units/day (≤8 hrs)', []),
};


/* ================================================================
   SPLIT A — new-york-medicaid + downstate MCOs (Layers 1+3+4).
   Appended after split B (upstate + commercial) above; no shared
   slugs. PVERIFY_PAYER_LIST_A / AVAILITY_PAYER_LIST_A below are
   this split's own re-fetch of the same two public payer lists
   (dated later than split B's) — kept as separate consts rather
   than reused to avoid conflating fetch dates/notes.
   ================================================================ */

/* -------------------- shared source refs -------------------- */

const EMEDNY_COMPANION_GUIDE = src(
  'https://www.emedny.org/hipaa/5010/transactions/eMedNY_Transaction_Information_CAQH-CORE_CG_X12_version_5010.pdf',
  '"NEW YORK STATE MEDICAID COMPANION GUIDE V 5.2.1" (based on the CAQH-CORE Master Companion Guide Template; revision history shows updates through 7/7/2026) — the master EDI companion guide covering all X12 transactions (270/271, 276/277, 278, 820, 834, 835, 837, 999), with a dedicated §11 for 270/271. Read in full (79 pages). Confirms MMC enrollment flags via EB01=\'U\' (Loop 2110C) with the MCO name itself in Loop 2120C NM1 (NM101=\'Y2\', NM108=\'PI\') as free text — no numeric carrier-code table exists in this document.'
);
const EMEDNY_MEVS_DVS_MANUAL = src(
  'https://www.emedny.org/ProviderManuals/5010/MEVS/MEVS_DVS_Provider_Manual_(5010).pdf',
  'eMedNY MEVS/DVS Provider Manual (5010), dated October 2025 — checked for a carrier-code-to-MCO-name crosswalk (none found); confirms the telephone/ARU system speaks the plan name as free text and that plan coverage determinations are month-based ("PLAN DATE IS...the first day of the month eligibility information was requested").'
);
const EMEDNY_ABA_FEE_SCHEDULE = src(
  'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Fee_Schedule.xls',
  'eMedNY ABA Fee Schedule (.xls; file metadata "Last Saved" 2/28/2026; sheet header "Effective Date: April 1, 2026") — fetched and read directly (HTTP 200). Only 97151-97158 appear (12 rows); 0362T, 0373T, 99366 are entirely absent.'
);
const EMEDNY_ABA_POLICY_MANUAL = src(
  'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Policy.pdf',
  'eMedNY Applied Behavior Analysis Provider Policy Manual [Updated October 1, 2025] — read in full (15 pages). Defines only 97151-97158; no PA requirement, no per-code hour caps (only an 8-individual group-session cap on 97154/97158), no POS codes, no code-level telehealth rule, and zero billing modifiers anywhere in the text.'
);
const NYS_MEDICAID_UPDATE_AUG2025 = src(
  'https://web.archive.org/web/20251031063334if_/https://www.health.ny.gov/health_care/medicaid/program/update/2025/no08_2025-08.htm',
  'Wayback Machine archive (snapshot 2025-10-31) of NYS Medicaid Update, August 2025, Vol. 41 No. 8 — the live health.ny.gov URL returns HTTP 403 to automated fetches (confirmed during this build); this is an archived copy of the primary-source bulletin text, not a secondary paraphrase. "Reimbursement Reduction for Services Administered by an Unlicensed Individual" section confirms 97153: $16.85/unit eff. 10/1/2025, $14.45/unit eff. 4/1/2026; same issue documents the 10/1/2025 LBA 5%-supervision rule applying to both FFS and MMC.'
);
const ACUITY_NEWS_RATES = src(
  'https://acuity.news/regulation/new-york-medicaid-aba-reimbursement-rate-reduction-2026/',
  'Secondary source, used only for cross-confirmation of the 97153 phase-down figures and the pre-reduction $19.26 baseline — consistent with the primary fee schedule and Medicaid Update.'
);
const PVERIFY_PAYER_LIST_A = src(
  'https://pverify.com/wp-content/uploads/2026/06/pVeify-Payer-List-June-26.pdf',
  'pVerify public payer list, dated June 2026.'
);
const AVAILITY_PAYER_LIST_A = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs).'
);
const OPTUM_INSTITUTIONAL_PAYER_LIST = src(
  'https://business.optum.com/content/dam/o4-dam/resources/pdfs/white-papers/institutional-claims-payer-list.pdf',
  'Optum/Change Healthcare Institutional Claims Payer List, updated 1/30/2025.'
);
const UHC_ERA_PAYER_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ERA-Payer-List-for-Affiliates-Strategic-Alliances.pdf',
  'UHC\'s own ERA Payer List, dated 12/2/2024 — breaks out "UnitedHealthcare Community Plan / NY (formerly AmeriChoice...)" as its own payer ID NYU01, distinct from the multi-state 87726 grouping.'
);
const UHC_CLAIMS_PAYER_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
  'UHC\'s own Claims Payer List, dated 5/13/2026 (newer than the ERA list) — NY does not appear broken out; a multi-state row under 87726 does not visibly list NY (partial OCR corruption on this row could not be resolved).'
);

/* -------------------- fidelis-care-new-york sources -------------------- */

const FIDELIS_ABA_POLICY = src(
  'https://www.fideliscare.org/Portals/0/Providers/Applied-Behavior-Analysis-Policy-FC.BH.301.04.pdf',
  'Fidelis Clinical Policy: Applied Behavior Analysis, FC.CP.BH.301.04, date of last revision 7/25 (approved 9/25) — read in full.'
);
const FIDELIS_TIP_SHEET = src(
  'https://www.fideliscare.org/Portals/0/Providers/TipSheets/ABA-Provider-Tip-Sheet.pdf',
  'Fidelis Behavioral Health ABA Provider Tip Sheet, dated 01/01/2026 — read in full.'
);

/* -------------------- UHC Community Plan / Optum sources -------------------- */

const OPTUM_NY_ABA_ORIENTATION = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/nyaba/NYabaPres.pdf',
  'Optum "New York Medicaid ABA Provider Orientation," doc BH00869_01302025 — read in full, incl. the CPT billing table (slide 26) and telehealth/POS-02 instructions (slide 15).'
);
const OPTUM_ABA_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum "Applied Behavior Analysis (ABA) State Mandates," policy BH803ABASTM12026, effective January 2026 — the NY Medicaid/CHP entry (p.4) is quoted in full below; contains no hour caps, CPT specifics, telehealth provision, or PA rule for NY specifically (unlike several other states\' entries in the same document).'
);

/* -------------------- Anthem HealthPlus New York sources -------------------- */

const ANTHEM_TREATMENT_PLAN_FORM = src(
  'https://providers.anthem.com/docs/gpp/NY_ABC_CAID_ABA_AuthReqForm.pdf?v=202411221617',
  'Anthem "Treatment Plan Request Form for Autism Spectrum Disorders — New York | Medicaid," form NY-BCBS-CD-008303-26-GRP2461, June 2026 revision.'
);
const ANTHEM_ABA_FAQ_2023 = src(
  'https://providernews.anthem.com/new-york/articles/applied-behavior-analysis-services-faq-for-providers-13424',
  'Anthem NY provider-news article 13424, "Applied behavior analysis services FAQ for providers," originally published 5/19/2023 under the Empire BCBS HealthPlus brand (page carries the notice "Beginning January 1, 2024, Empire became Anthem"; live and unretracted as of 2026-07-23). States verbatim: "Medicaid does not cover CPT codes 0362T and 0373T and schools as a place of service."'
);
const ANTHEM_STREAMLINED_2026 = src(
  'https://providernews.anthem.com/new-york/articles/streamlined-aba-claim-process-starts-january-1-2026-27878',
  'Anthem NY provider-news article 27878, "Streamlined ABA claim process starts January 1, 2026," published 1/1/2026 — moves all ABA CPT codes to a weekly-approved-units cap structure and lists 0362T/0373T in its "Affected CPT codes" table, in tension with the 2023 FAQ\'s exclusion statement.'
);
const ANTHEM_ABA_REMINDERS = src(
  'https://providernews.anthem.com/new-york/articles/aba-reminders-27626',
  'Anthem NY provider-news article 27626, "ABA reminders," published 12/1/2025 — restates the state\'s 2-year referral-packet requirements.'
);
const ANTHEM_NY_MEDICAID_PROVIDER_MANUAL = src(
  'https://providers.anthem.com/docs/gpp/NY_ABC_CAID_ProviderManual.pdf?v=202501161732',
  'Anthem NY Medicaid/CHPlus Provider Manual — 245 pages, read in full for EDI payer IDs (§ EDI) and Chapter 6 Behavioral Health Services. States Availity professional payer ID 00803, institutional 00303; mandates Availity as the EDI gateway for all trading partners. Zero "ABA"/"Applied Behavior Analysis" hits in the full text; the ASD screening/diagnosis/treatment section (under CHPlus) states no PA and does not name Carelon, even though a separate "additional digital applications" listing elsewhere in the manual names "Services through Carelon Behavioral Health" alongside Carelon Medical Benefits Management (radiology) — ambiguous whether that listing applies to this Medicaid line specifically or is shared boilerplate.'
);

/* -------------------- Healthfirst sources -------------------- */

const HEALTHFIRST_PROVIDER_MANUAL = src(
  'https://assets.healthfirst.org/pdf_9432a72611d0176a1f6a5503a1d88d94/',
  'Healthfirst NY Provider Manual, "Updated: 3/1/2026" — 196 pages, read in full. §9 Behavioral Health Services states verbatim: "Healthfirst manages the Behavioral Health services for all of its members." Zero "Beacon"/"Carelon" hits in the full text. Also states "Healthfirst Payer ID Number 80141 – For EDI Claims Only" and that Healthfirst covers ABA effective 1/1/2023. One internal-consistency caveat: the manual elsewhere references "the delegated Behavioral Health Care management organization (as noted in the chart in Section 9.1)," but the referenced §9.1 chart names no third-party vendor — likely vestigial/boilerplate language, not evidence of an actual BH carve-out.'
);
const HEALTHFIRST_PA_CODE_LIST_2026 = src(
  'https://assets.healthfirst.org/pdf_8AApk7IXUJoE/2026interoperability-prior-auth-code-list-english',
  '"Healthfirst Prior Authorization Code List," 2026, 179 pages — 97151-97158 all appear (p.96); this master list is not broken out by line of business (Medicaid MC vs. commercial), so applying it to the Medicaid line specifically is inferred, not directly stated. 0362T/0373T do not appear anywhere in the document.'
);
const HEALTHFIRST_ABA_UPDATE_NOTICE = src(
  'https://hfproviders.org/whatsnew/updated-healthfirst-policy-for-the-authorization-of-applied-behavioral-analysis-aba-services',
  'Healthfirst "What\'s New" notice, posted 7/7/2026: "Updated Healthfirst Policy for the Authorization of Applied Behavioral Analysis (ABA) Services, Effective Oct. 7, 2026." The underlying policy document itself is not linked on this page — obtain via Provider Services (1-888-801-1660).'
);
const HEALTHFIRST_SUPERVISION = src(
  'https://hfproviders.org/resource-posts/applied-behavior-analysis-supervision-requirements',
  'Healthfirst provider page republishing the state\'s 10/1/2025 LBA-supervision requirements (5% of technician hours, 2 monthly face-to-face contacts, 6-supervisee cap) as applying to Healthfirst plans.'
);

/* -------------------- MetroPlusHealth sources -------------------- */

const METROPLUS_MANUAL_2024 = src(
  'https://metroplus.org/wp-content/uploads/2024/08/PRV-24.075_MPH_2024-Provider-Manual_FINAL_081224.pdf',
  'MetroPlus 2024 Provider Manual — 183 pages, read in full. p.7 confirms ABA authorization submission to metroplusaba@metroplus.org / 212.908.5182; Appendix XB (Child Health Plus Benefit Summary, p.273) states "Applied Benefit Analysis (ABA) – limited to 680 hours/calendar year"; the equivalent Appendix XA (core Medicaid Managed Care, pp.269-271) covers ABA with no stated hour figure. Zero "Beacon"/"Carelon" hits in the full text.'
);
const METROPLUS_BH_HCBS_PA_GRID_2026 = src(
  'https://metroplus.org/wp-content/uploads/2026/05/2026_MH_BH_HCBS_Provider-PA-Request-Guide_-v1.2_C_FINAL.xlsx',
  '"2026 MH/BH/HCBS Provider PA Request Guide," v1.2 — read in full. Row 11 on the Medicaid_PIC_Enhanced(HARP) sheet ("CHILDREN Applied Behavior Analysis Treatment (ABA)") shows In-Network Prior Authorization = Yes, repeated identically on the CHP/EP1-4/EP-200-250/QHP/Gold sheets. This is a CATEGORY-level line item — no individual CPT code (97151-97158) is broken out anywhere in the workbook, including its dedicated Telehealth and Modifier-Definitions sheets, both of which have zero ABA-specific entries. The MMC Coding Crosswalk sheet explicitly excludes APG-reimbursed services (which includes ABA) from its scope.'
);
const METROPLUS_2023_NOTICE = src(
  'https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/',
  'MetroPlus press notice, published 12/29/2022, on the ABA benefit effective 1/1/2023.'
);
const METROPLUS_MANUAL_2025 = src(
  'https://metroplus.org/wp-content/uploads/2025/04/PRV-25.047_MPH-2024-Provider-Manual-March-Updates_2025_FINAL.pdf',
  'MetroPlus Provider Manual, March 2025 update — states "Submit claims electronically: Emdeon Payer ID# 13265" across all MetroPlus lines of business (Emdeon is the legacy/historical name for what is now Change Healthcare/Optum).'
);

/* -------------------- EmblemHealth sources -------------------- */

const EMBLEM_BH_MANUAL = src(
  'https://www.emblemhealth.com/content/dam/emblemhealth/pdfs/provider-manual/behavioral-health-services.pdf',
  'EmblemHealth Provider Manual, Ch. 26 "Behavioral Health Services," dated 4/30/2026 — states verbatim: "EmblemHealth offers two behavioral health programs administered through Carelon Behavioral Health..." and "Although care for Medicaid and HARP members is coordinated through their Health Home, covered behavioral health benefits are managed by Carelon Behavioral Health." Zero "ABA"/CPT-code hits across the full 6-page chapter — Carelon is confirmed as EmblemHealth\'s BH administrator generally (incl. Medicaid/HARP), but ABA specifically is never named in this chapter.'
);
const EMBLEM_ABA_BENEFIT_PAGE = src(
  'https://www.emblemhealth.com/providers/resources/State-Sponsored-Programs/medicaid-applied-behavior-analysis-benefit-',
  'EmblemHealth Medicaid ABA benefit page, dated 12/07/2022, effective 1/1/2023 — full page content read directly (not summarized). States coverage for LBA/CBAA-delivered ABA per the state eligibility baseline; names NO CPT codes and NO claims/PA administrator anywhere on the page.'
);
const EMBLEM_CARELON_RENAME = src(
  'https://www.emblemhealth.com/providers/news/beacon-health-carleon-health-202304',
  'EmblemHealth provider-news notice, 4/19/2023: "Beacon Health Options has been renamed to Carelon Behavioral Health."'
);
const EMBLEM_PA_LISTS = src(
  'https://www.emblemhealth.com/content/dam/emblemhealth/pdfs/provider/sortable-policies/preauthorization-list-emblemhealth.pdf',
  'EmblemHealth\'s two master pre-authorization lists (610-page "EH Enterprise PA List_HIP_GHI," updated 6/26/2026, and the 226-page Appendix A) were both read in full — neither contains CPT 97151-97158, 0362T, 0373T, or any "ABA"/"Autism" text. Both lists are scoped to HIP/GHI commercial/Medicare membership rather than Medicaid specifically, so the absence is notable but not conclusive proof of Carelon routing.'
);

/* -------------------- Molina Healthcare of New York sources -------------------- */

const MOLINA_BEACON_TRANSITION_LETTER = src(
  'https://www.molinahealthcare.com/-/media/Molina/PublicWebsite/PDF/Providers/ny/medicaid/D-MHNY-Provider-Letter-Beacon-Transition-FINAL.pdf',
  'Molina NY provider letter, dated 12/2/2021: "effective January 1, 2022 Molina Healthcare of New York, Inc. will be administering all behavioral health services...Beacon Health Options will no longer be managing or administrating the behavioral health services..." Includes an attached Provider Quick Reference Guide stating clearinghouse "SSI/Claimsnet" and "Payer ID 16146."'
);
const MOLINA_ABA_PA_NOTICE = src(
  'https://www.molinahealthcare.com/providers/ny/medicaid/comm/-/media/Molina/PublicWebsite/PDF/Providers/ny/medicaid/Prior%20Authorization%20Update_Provider_Notice_for_ABA',
  'Molina NY provider notice, effective 10/1/2021, adding ABA to the MMC benefit package: "Prior authorization will be required for Applied Behavioral Analysis (ABA). The following CPT codes will require prior authorization before the services are rendered: 97151, 97152, 97153, 97155." 97154/97156/97157/97158/0362T/0373T are not named in this notice and no other Molina NY document expands or supersedes the list.'
);

/* ==================== new-york-medicaid ==================== */

const newYorkMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00163', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  medicaid271Notes: {
    mcoSegmentLocation:
      "MMC enrollment is flagged by EB01='U' (Loop 2110C EB segment) — \"the patient's benefits are administered by another payer indicated in EB05\" — but the MCO's actual NAME is carried in Loop 2120C, NM1 segment (NM101='Y2' Subscriber Benefit Related Entity Name, NM108='PI' identification-code qualifier), not in a coded field within 2110C itself. A companion REF segment in Loop 2110C (REF01='18' Plan Number or '6P' Group Number) may carry the plan/policy number tied to that same 2120C entity.",
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      "Query granularity is by date-of-service, constrained to the CURRENT calendar month only — no future-month requests, no date-range requests (\"if a range is submitted, eligibility determination will be based upon the 'from' date\"). Underlying coverage determinations are month-based per the MEVS/DVS Provider Manual (\"PLAN DATE IS...the first day of the month eligibility information was requested\"). The 271's EB06 Time Period Qualifier carries codes 26/27/29/34 for benefit-amount date ranges, but this companion guide doesn't define those codes in prose.",
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'unverified',
    'medicaid271Notes.eligibilitySpanGranularity': 'inferred',
  },
  verifyVia: {
    'payerId.availity':
      'Searched the full Availity payer list for "medicaid"/"new york"/"emedny" — no statewide NY Medicaid FFS entry exists (Availity onboarding for FFS EDI is typically direct with eMedNY, not via a commercial clearinghouse entry) — confirm via eMedNY Trading Partner enrollment.',
    'payerId.changeHealthcare':
      "No statewide eMedNY FFS entry found in Optum's Institutional Claims Payer List — the only NY-Medicaid-adjacent row found (00246, \"Blue Cross Blue Shield of Western New York Medicaid/CHP\") is a regional Highmark-administered product, not the statewide FFS payer. Confirm via eMedNY Trading Partner enrollment.",
    'medicaid271Notes.mcoCarrierCodes':
      "No numeric carrier-code-to-MCO-name table exists in the companion guide or the MEVS/DVS Provider Manual — the 271 returns the MCO's name as free text (NM103) rather than a coded lookup. If a crosswalk exists, it would be in the separate \"Information for All Providers – Managed Care Information\" manual (not fetched this pass) — verify there or via the eMedNY EDI helpdesk.",
    'medicaid271Notes.eligibilitySpanGranularity':
      "The companion guide's EB06 Time Period Qualifier codes (26/27/29/34) aren't defined in prose in this document — confirm exact meaning against the X12 005010X279 TR3 codebook or eMedNY EDI helpdesk.",
  },
  sources: [EMEDNY_COMPANION_GUIDE, EMEDNY_MEVS_DVS_MANUAL, PVERIFY_PAYER_LIST_A],
};

function nyMedicaidFfsEntry(
  code: string,
  notes: string,
  extraSources?: SourceRef[]
): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Not required — no PA/prior-approval requirement anywhere in the ABA Policy Manual (Oct 1, 2025); the gate is a practitioner referral valid ≤2 years, not a per-claim authorization.',
    unitCap:
      code === '97154' || code === '97158'
        ? 'No hour/unit cap published; group SESSIONS capped at 8 individuals'
        : 'No hour/unit cap published in the ABA Policy Manual',
    capPeriod: code === '97154' || code === '97158' ? 'per session (group-size cap only)' : 'unverified — no cap period given',
    posAllowed: [
      'private practice',
      'clinic',
      'hospital',
      'residence/home',
      'community setting',
      'NOT reimbursable in a school setting (explicit exclusion)',
    ],
    telehealth:
      'unverified for service delivery — the ABA Policy Manual addresses telehealth only for LBA SUPERVISION of unlicensed technicians (synchronous audio/video permitted), not for billing a session itself as telehealth; no code-specific telehealth modifier is given.',
    modifiers: [],
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'verified',
      telehealth: 'unverified',
      modifiers: 'verified',
    },
    sources: [EMEDNY_ABA_POLICY_MANUAL, ...(extraSources ?? [])],
  };
}

function nyMedicaidFfsUnverifiedEntry(code: string): CodeGridEntry {
  return {
    covered:
      'unverified — absent from the ABA Fee Schedule (eff. 4/1/2026), the ABA Policy Manual (Oct 1, 2025), and the Aug 2025 Medicaid Update; no explicit exclusion statement was found for this code either',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: `${code} does not appear in NY Medicaid FFS's ABA fee schedule or policy manual — the state's actual billable ABA code set (per both primary documents) is 97151-97158 only. Verify via eMedNY Provider Enrollment/DRG unit before assuming this code is billable.`,
    fieldStatus: {
      covered: 'unverified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [EMEDNY_ABA_FEE_SCHEDULE, EMEDNY_ABA_POLICY_MANUAL],
  };
}

const newYorkMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': nyMedicaidFfsEntry('97151', 'Assessment code — billed in 15-min units at $19.26/unit (see rates).'),
  '97152': nyMedicaidFfsEntry(
    '97152',
    'Confirmed covered on the current fee schedule at $19.26/unit — no distinct historical effective date is published (unverified when this code was first billable).'
  ),
  '97153': nyMedicaidFfsEntry(
    '97153',
    "Technician-delivered direct treatment — the volume code. Rate is being phased down: $19.26 → $16.85/unit (eff. 10/1/2025) → $14.45/unit (eff. 4/1/2026, current). See rates for the full history.",
    [NYS_MEDICAID_UPDATE_AUG2025]
  ),
  '97154': nyMedicaidFfsEntry(
    '97154',
    "Group adaptive behavior treatment — capped at 8 individuals per session; billed at $3.31/unit per member (not the $19.26 individual rate). Also subject to the 97156/97157 'concert of care' rule is NOT stated for 97154 specifically — that rule applies only to 97156 &amp; 97157 per the manual."
  ),
  '97155': nyMedicaidFfsEntry('97155', 'QHP protocol-modification code — billed at $19.26/unit.'),
  '97156': nyMedicaidFfsEntry(
    '97156',
    "Family guidance code — billed at $19.26/unit. Per the ABA Policy Manual: \"CPT code 97156 & 97157 can only be billed when the service is delivered in concert with care of the patient as part of the child's treatment plan\" (applies jointly to both codes)."
  ),
  '97157': nyMedicaidFfsEntry(
    '97157',
    "Multiple-family group guidance — billed at $3.31/unit per member (group rate). Subject to the same 'delivered in concert with care of the patient' restriction as 97156, per the manual."
  ),
  '97158': nyMedicaidFfsEntry(
    '97158',
    "Group adaptive behavior treatment with protocol modification — capped at 8 individuals per session (same cap as 97154); billed at $3.31/unit per member. Fee-schedule footnote: \"effective for dates of service on or after 11/1/2022.\""
  ),
  '0362T': nyMedicaidFfsUnverifiedEntry('0362T'),
  '0373T': nyMedicaidFfsUnverifiedEntry('0373T'),
  '99366': nyMedicaidFfsUnverifiedEntry('99366'),
};

const newYorkMedicaidRates: RateTable = {
  source:
    'eMedNY ABA Fee Schedule (.xls, effective 4/1/2026), cross-confirmed for the 97153 phase-down history against the NYS Medicaid Update Aug 2025 (Vol 41 No 8) — the FFS fee schedule is a single flat statewide rate per code with no credential tiers, no modifiers, no geographic variation. MMC plans negotiate their own rates (see each MCO guide\'s rates block).',
  effectiveDate: '2026-04-01',
  byCode: {
    '97151': { rate: '$19.26 per 15-min unit', unit: '15min' },
    '97152': { rate: '$19.26 per 15-min unit (no distinct historical effective date published)', unit: '15min' },
    '97153': {
      rate: '$14.45 per 15-min unit (current, eff. 4/1/2026) — phased down from $19.26 → $16.85 (eff. 10/1/2025) → $14.45 (eff. 4/1/2026)',
      unit: '15min',
    },
    '97154': { rate: '$3.31 per unit per member (group code)', unit: '15min' },
    '97155': { rate: '$19.26 per 15-min unit', unit: '15min' },
    '97156': { rate: '$19.26 per 15-min unit', unit: '15min' },
    '97157': { rate: '$3.31 per unit per member (group code)', unit: '15min' },
    '97158': { rate: '$3.31 per unit per member (group code); effective for DOS on/after 11/1/2022 per fee-schedule footnote', unit: '15min' },
    '0362T': { rate: 'unverified — code absent from the fee schedule', unit: 'unverified' },
    '0373T': { rate: 'unverified — code absent from the fee schedule', unit: 'unverified' },
    '99366': { rate: 'unverified — code absent from the fee schedule', unit: 'unverified' },
  },
  sources: [EMEDNY_ABA_FEE_SCHEDULE, NYS_MEDICAID_UPDATE_AUG2025, ACUITY_NEWS_RATES],
};

/* ==================== fidelis-care-new-york ==================== */

const fidelisEdi: EdiRouting = {
  payerId: { pverify: '00329', availity: '11315', changeHealthcare: '11315' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'unverified', administratorPayerId: 'unverified', abaRidesOn: 'unverified', twoHopRequired: 'unverified' },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      "Not researched to a primary source this pass (out of the confirmed-delegator scope in the build spec, which named only Healthfirst/EmblemHealth/MetroPlus) — confirm via Fidelis provider services whether ABA/BH claims route on Fidelis's own medical ID (11315) or a separate Centene-affiliated BH vendor.",
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, OPTUM_INSTITUTIONAL_PAYER_LIST],
};

function fidelisEntry(notes?: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      "Required — governed by Fidelis's own medical-necessity policy (FC.CP.BH.301.04); a behavioral assessment must be completed before treatment is requested. The policy does not differentiate PA turnaround/workflow for assessment (97151/97152) vs. treatment codes — both fall under the same medical-necessity review.",
    unitCap:
      "Not published as a numeric cap. The policy frames intensity descriptively — Focused ABA (10-25 hrs/wk) vs. Comprehensive ABA (30-40 hrs/wk) — and states explicitly: \"the intensity of comprehensive treatment must be individualized to the person's characteristics and other factors\" (not an enforced ceiling).",
    capPeriod: 'unverified — no cap-period structure published',
    posAllowed: ['unverified — no POS code list in either Fidelis document', 'NOT school setting since 9/1/2023 (30-day transition period applied at rollout)'],
    telehealth: 'unverified — the word "telehealth" does not appear anywhere in either Fidelis document reviewed.',
    modifiers: ['unverified — no HN/HO/HM/HP or other billing modifier is mentioned in either document'],
    notes: [
      notes,
      'Claims due within 90 days of date of service. Treatment plan/assessment updates every 6 months; comprehensive diagnostic evaluation re-required every 5 years. Diagnosis codes per Fidelis\'s own ICD-10 table: F84.0, F84.2, F84.3 (narrower than Optum\'s F84.0/F84.2/F84.5/F84.8/F84.9 — see the UHC Community Plan entry).',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [FIDELIS_ABA_POLICY, FIDELIS_TIP_SHEET],
  };
}

const fidelisCodeGrid: Record<string, CodeGridEntry> = {
  '97151': fidelisEntry(
    "Lighter documentation standard than treatment initiation per the policy's two-pathway structure (behavioral assessment vs. initiation of ABA treatment), but still subject to the same PA process — not PA-exempt."
  ),
  '97152': fidelisEntry(),
  '97153': fidelisEntry(),
  '97154': fidelisEntry(),
  '97155': fidelisEntry(),
  '97156': fidelisEntry(),
  '97157': fidelisEntry(),
  '97158': fidelisEntry(),
  '0362T': fidelisEntry('Listed in Fidelis\'s own CPT tables in both documents as a covered code.'),
  '0373T': fidelisEntry('Listed in Fidelis\'s own CPT tables in both documents as a covered code.'),
};

/* ==================== unitedhealthcare-community-plan-new-york ==================== */

const uhcCommunityPlanEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (United Behavioral Health of New York, I.P.A., Inc.)',
    administratorPayerId: 'unverified',
    abaRidesOn: 'bh',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'inferred',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': 'No NY-specific UHC Community Plan entry found in pVerify\'s list — only generic/other-state rows (00192, UHG001). Confirm directly with pVerify onboarding before automating.',
    'payerId.availity': 'No NY-specific row found — only legacy "AmeriChoice of N.Y. (Medicaid)" (86048) and "AmeriChoice of NY Personal Care Plus" (86002), which may be inactive post-rebrand. Confirm current status with Availity.',
    'payerId.changeHealthcare':
      "GENUINELY CONFLICTING across UHC's own documents: UHC's ERA Payer List (12/2/2024) breaks NY out as its own ID, NYU01 (\"UnitedHealthcare Community Plan / NY, formerly AmeriChoice...\"); UHC's own Claims Payer List (5/13/2026, newer) does not visibly list NY under the multi-state 87726 grouping (row partially unreadable); Optum's own Institutional Claims Payer List (1/30/2025) DOES explicitly include NY in a different multi-state 87726 grouping (\"...NC, NE, NM, NY, OH...\"). Do not pick one — confirm directly with UHC/Optum EDI enrollment before routing.",
    supportsRealtime: 'Confirm real-time vs. batch via Optum/UHC EDI onboarding.',
    'bhCarveOut.administratorPayerId':
      "Optum's own payer lists show OptumHealth Behavioral Solutions (the BH product) using the SAME national ID (87726) as UHC's general medical claims — no NY-specific separate BH ID was found. Given the medical-claims ID conflict above (NYU01 vs. 87726), it's unresolved whether ABA/BH claims for this specific plan use NYU01 or 87726. Confirm via Provider Express / UHC provider services.",
    'bhCarveOut.twoHopRequired': 'Same open question as administratorPayerId — confirm via Provider Express.',
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, UHC_ERA_PAYER_LIST, UHC_CLAIMS_PAYER_LIST, OPTUM_INSTITUTIONAL_PAYER_LIST, OPTUM_NY_ABA_ORIENTATION],
};

function uhcCommunityPlanEntry(code: string, telehealthEligible: boolean, notes?: string): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — "All ABA services require prior authorization" (Optum NY Medicaid ABA Provider Orientation, verbatim, slide 20), with separate portal request paths for ABA Assessment vs. Treatment; no exemption stated for assessment codes.',
    unitCap: code === '97158' ? 'Group sessions capped at 8 individuals (billing table, slide 26)' : 'Not published — no numeric hour/unit cap given in either Optum document',
    capPeriod: 'unverified — no cap-period structure published',
    posAllowed: ['unverified — no POS code list published beyond the telehealth POS 02 instruction below'],
    telehealth: telehealthEligible
      ? 'Yes, for ABA supervision (97155) and/or caregiver training — billed with the SAME procedure code plus POS 02, once approved as an Optum virtual-visits provider (verbatim from slide 15). Optum\'s orientation names 97151-97157 collectively as eligible for this virtual-visits framing.'
      : 'Not listed among the telehealth-eligible codes on slide 15 — treat as unverified for this code specifically.',
    modifiers: ['none published — the billing table\'s "Modifier" column (slide 26) is blank for every code'],
    notes: [
      notes,
      'Claims due within 120 days of date of service (differs from Fidelis\'s 90-day rule). Diagnosis codes per Optum: F84.0, F84.2, F84.5, F84.8, F84.9 (broader than Fidelis\'s F84.0/F84.2/F84.3).',
    ]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: code === '97158' ? 'verified' : 'unverified',
      posAllowed: 'unverified',
      telehealth: telehealthEligible ? 'verified' : 'unverified',
      modifiers: 'verified',
    },
    sources: [OPTUM_NY_ABA_ORIENTATION, OPTUM_ABA_STATE_MANDATES],
  };
}

const uhcCommunityPlanCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcCommunityPlanEntry('97151', true),
  '97152': uhcCommunityPlanEntry('97152', true),
  '97153': uhcCommunityPlanEntry('97153', true),
  '97154': uhcCommunityPlanEntry('97154', true),
  '97155': uhcCommunityPlanEntry('97155', true, 'Named specifically for telehealth supervision in the orientation deck.'),
  '97156': uhcCommunityPlanEntry('97156', true, 'Named specifically for telehealth caregiver training in the orientation deck.'),
  '97157': uhcCommunityPlanEntry('97157', true, 'Named specifically for telehealth caregiver training in the orientation deck.'),
  '97158': uhcCommunityPlanEntry('97158', false),
  '0362T': {
    covered: 'unverified — not published in the billing table (slide 26) or the State Mandates document; not mentioned anywhere in either Optum document reviewed',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified', paRequired: 'unverified' },
    sources: [OPTUM_NY_ABA_ORIENTATION, OPTUM_ABA_STATE_MANDATES],
  },
  '0373T': {
    covered: 'unverified — not published in the billing table (slide 26) or the State Mandates document; not mentioned anywhere in either Optum document reviewed',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified', paRequired: 'unverified' },
    sources: [OPTUM_NY_ABA_ORIENTATION, OPTUM_ABA_STATE_MANDATES],
  },
};

/* ==================== anthem-healthplus-new-york ==================== */

const anthemHealthPlusEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: '00803 (professional) / 00303 (institutional)', changeHealthcare: '00303' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'unverified', administratorPayerId: 'unverified', abaRidesOn: 'unverified', twoHopRequired: 'unverified' },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'unverified',
  },
  verifyVia: {
    'payerId.pverify':
      "Three candidate pVerify entries, none unambiguously this specific plan: \"00047 BCBS of New York (Empire)\" (active, Elig/Claim: Yes, but a general Empire ID not HealthPlus-labeled); \"01364 EMPIRE BC NEW YORK\" (inactive); \"00712 EMPIRE BCBS NEW YORK HEALTHPLUS\" (HealthPlus-labeled but shows inactive/unsupported). Confirm directly with pVerify onboarding.",
    supportsRealtime: 'Confirm real-time vs. batch via Availity onboarding for these payer IDs.',
    'bhCarveOut.administrator':
      "Anthem's own 245-page NY Medicaid Provider Manual is internally ambiguous: its Behavioral Health chapter uses in-house program language throughout (\"The Anthem Behavioral Health program\"), and its quick-reference table lists an identical phone number for BH precertification and physical-health precertification (800-450-8753) — both suggesting in-house administration. But a separate \"additional digital applications\" listing in the same manual names \"Services through Carelon Behavioral Health\" as an available Availity Essentials app, without specifying which line(s) of business it covers. The manual's own ASD-specific section (under CHPlus) names no administrator and requires no PA. Confirm directly with Anthem provider services before building this as either a carve-out or a non-carve-out fact.",
  },
  sources: [PVERIFY_PAYER_LIST_A, ANTHEM_NY_MEDICAID_PROVIDER_MANUAL, OPTUM_INSTITUTIONAL_PAYER_LIST],
};

function anthemNyEntry(code: string, capPeriodPre2026: string, paNote?: string): CodeGridEntry {
  return {
    covered:
      code === '0362T' || code === '0373T'
        ? "CONFLICTING within Anthem's own current publications — NOT reconciled, verify directly before billing. Anthem's 2023 provider-news FAQ (still live, article 13424) states verbatim: \"Medicaid does not cover CPT codes 0362T and 0373T and schools as a place of service.\" But Anthem's own January 2026 newsletter (article 27878, \"Streamlined ABA claim process\") lists this code in its \"Affected CPT codes\" table for the new 2026 weekly-unit billing structure, and the June 2026 Treatment Plan Request Form references 0362T for initial-assessment requests alongside 97151/97152."
        : 'Yes',
    paRequired:
      paNote ??
      "Required — via the Treatment Plan Request Form (Availity preferred). Incomplete forms are returned, not pended.",
    unitCap:
      "Not published as a numeric hour/unit ceiling in any Anthem document reviewed — caps are structured by PERIOD (see capPeriod), and the form's Comprehensive-vs-Focused ABA checkbox has no defined hour ranges attached to it in any of the four Anthem documents checked.",
    capPeriod: `${capPeriodPre2026} through 2025; Anthem's Jan 2026 provider newsletter (article 27878) states ALL ABA codes move to a weekly-approved-units cap structure effective 1/1/2026 — treat the pre-2026 period distinction as historical only.`,
    posAllowed: [
      'Checkboxes only on the Treatment Plan Request Form: Home / Clinic / School (if allowed) / Telehealth (if allowed) / Other — no POS numeric codes given',
      "\"School (if allowed)\" on the June 2026 form is in unreconciled tension with the 2023 FAQ's unambiguous \"Medicaid does not cover...schools as a place of service\" statement",
    ],
    telehealth: 'unverified — the form has a "Telehealth (if allowed)" checkbox but names no specific modifier or POS code.',
    modifiers: ['unverified — no HO/HN/HM/HP or other billing modifier appears in any of the four Anthem documents reviewed'],
    notes:
      code === '97151' || code === '97152'
        ? "Lighter documentation path on the same form when \"requesting only 97151/97152 and 0362T\" — diagnostic evaluation + referral only, vs. the full treatment-initiation packet (baseline/mastery criteria, transition plan, discharge criteria, etc.) required otherwise. Still submitted for authorization — not PA-exempt."
        : undefined,
    fieldStatus: {
      covered: code === '0362T' || code === '0373T' ? 'unverified' : 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      capPeriod: 'verified',
      posAllowed: 'verified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [ANTHEM_TREATMENT_PLAN_FORM, ANTHEM_ABA_FAQ_2023, ANTHEM_STREAMLINED_2026, ANTHEM_ABA_REMINDERS],
  };
}

const anthemHealthPlusCodeGrid: Record<string, CodeGridEntry> = {
  '97151': anthemNyEntry('97151', 'per authorization period'),
  '97152': anthemNyEntry('97152', 'per authorization period'),
  '97153': anthemNyEntry('97153', 'per week'),
  '97154': anthemNyEntry('97154', 'per week', 'Required — PA effective 4/1/2023 per the 2023 FAQ footnote.'),
  '97155': anthemNyEntry('97155', 'per authorization period'),
  '97156': anthemNyEntry('97156', 'per authorization period'),
  '97157': anthemNyEntry('97157', 'per authorization period', 'Required — PA effective 4/1/2023 per the 2023 FAQ footnote.'),
  '97158': anthemNyEntry('97158', 'per week'),
  '0362T': anthemNyEntry('0362T', 'unverified'),
  '0373T': anthemNyEntry('0373T', 'unverified'),
};

/* ==================== healthfirst-new-york ==================== */

const healthfirstEdi: EdiRouting = {
  payerId: { pverify: '00110', availity: '80141', changeHealthcare: '80141' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — Healthfirst manages behavioral health in-house',
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
    'bhCarveOut.administrator':
      "This CORRECTS the build spec's assumption that Healthfirst delegates BH — Healthfirst's own 3/1/2026 NY Provider Manual states verbatim \"Healthfirst manages the Behavioral Health services for all of its members,\" with zero \"Beacon\"/\"Carelon\" hits across 196 pages. One caveat: the same manual elsewhere references \"the delegated Behavioral Health Care management organization,\" but the chart it points to names no vendor — likely vestigial language. If a future policy update contradicts this, re-verify via Healthfirst Provider Services (1-888-801-1660).",
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, OPTUM_INSTITUTIONAL_PAYER_LIST, HEALTHFIRST_PROVIDER_MANUAL],
};

function healthfirstEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      "Required — appears on Healthfirst's 2026 Prior Authorization Code List (p.96). That master list is not broken out by line of business (Medicaid MC vs. commercial), so applying it to the Medicaid line specifically is inferred, not directly stated for Medicaid alone.",
    unitCap: 'unverified — not published',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not published'],
    telehealth:
      'unverified for service delivery — Healthfirst republishes the state\'s rule allowing synchronous audio/video for LBA SUPERVISION of technicians, but no code-level telehealth-for-service-delivery rule is published.',
    modifiers: ['unverified — not published'],
    notes: "Full ABA authorization-policy text is not linked publicly — an updated policy was announced 7/7/2026 with a reported effective date of 10/7/2026; obtain the current text from Healthfirst Provider Services (1-888-801-1660) before quoting timelines.",
    fieldStatus: { covered: 'inferred', paRequired: 'inferred', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [HEALTHFIRST_PA_CODE_LIST_2026, HEALTHFIRST_ABA_UPDATE_NOTICE, HEALTHFIRST_SUPERVISION],
  };
}

const healthfirstCodeGrid: Record<string, CodeGridEntry> = {
  '97151': healthfirstEntry(),
  '97152': healthfirstEntry(),
  '97153': healthfirstEntry(),
  '97154': healthfirstEntry(),
  '97155': healthfirstEntry(),
  '97156': healthfirstEntry(),
  '97157': healthfirstEntry(),
  '97158': healthfirstEntry(),
  '0362T': {
    covered: 'unverified — does not appear on the 2026 Prior Authorization Code List (179 pages, searched in full)',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [HEALTHFIRST_PA_CODE_LIST_2026],
  },
  '0373T': {
    covered: 'unverified — does not appear on the 2026 Prior Authorization Code List (179 pages, searched in full)',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [HEALTHFIRST_PA_CODE_LIST_2026],
  },
};

/* ==================== metroplus-health-new-york ==================== */

const metroplusEdi: EdiRouting = {
  payerId: { pverify: '00659', availity: '13265', changeHealthcare: '13265' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — MetroPlus in-sourced BH from Beacon Health Options effective 10/1/2021',
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
    'bhCarveOut.administrator':
      "This CORRECTS the build spec's assumption that MetroPlus delegates BH — MetroPlus's own press release confirms it in-sourced BH from Beacon Health Options effective 10/1/2021 (\"Participating behavioral health providers now work directly with MetroPlusHealth\"), corroborated by zero Beacon/Carelon hits across its 2025 Provider Manual and 2026 BH/HCBS PA grid.",
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, METROPLUS_MANUAL_2025],
};

function metroplusEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired:
      'Required — confirmed at the CATEGORY level ("CHILDREN Applied Behavior Analysis Treatment (ABA)", In-Network Prior Authorization = Yes) on the 2026 BH/HCBS Provider PA Request Guide, repeated across all lines of business (MMC/HARP, CHP, Essential Plan, QHP, Gold). This source does NOT break PA status out by individual CPT code — applying it to this specific code is inferred from the category-level finding, not a direct per-code statement.',
    unitCap:
      "Not stated for core Medicaid Managed Care. The Child Health Plus-specific benefit summary (Provider Manual Appendix XB) states an explicit \"Applied Benefit Analysis (ABA) – limited to 680 hours/calendar year\" — but the equivalent core-MMC appendix (XA) states no hour figure at all, so this cap likely does NOT apply to the mainstream Medicaid line.",
    capPeriod: 'calendar year (Child Health Plus line only, 680-hr cap); unverified for core Medicaid Managed Care',
    posAllowed: [
      'unverified — the workbook\'s dedicated coding crosswalk sheet EXCLUDES APG-reimbursed services (which includes ABA) from its scope, so no POS detail is available from this source',
    ],
    telehealth: 'unverified — the workbook\'s three dedicated telehealth sheets (Outpatient, CORE, Mobile Crisis) contain zero ABA references.',
    modifiers: ['unverified — the workbook\'s Modifier Code Definitions sheet has no ABA-specific entries'],
    notes:
      'Authorization requests + clinical information submitted to MetroPlus CSS by email (metroplusaba@metroplus.org) or fax (212-908-5182), per the plan\'s 2023 benefit notice — not a portal workflow.',
    fieldStatus: { covered: 'verified', paRequired: 'inferred', unitCap: 'inferred', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [METROPLUS_BH_HCBS_PA_GRID_2026, METROPLUS_MANUAL_2024, METROPLUS_2023_NOTICE],
  };
}

const metroplusCodeGrid: Record<string, CodeGridEntry> = {
  '97151': metroplusEntry(),
  '97152': metroplusEntry(),
  '97153': metroplusEntry(),
  '97154': metroplusEntry(),
  '97155': metroplusEntry(),
  '97156': metroplusEntry(),
  '97157': metroplusEntry(),
  '97158': metroplusEntry(),
  '0362T': {
    covered: 'unverified — not found in any MetroPlus source reviewed (the PA grid does not break out CPT codes for ABA at all)',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [METROPLUS_BH_HCBS_PA_GRID_2026],
  },
  '0373T': {
    covered: 'unverified — not found in any MetroPlus source reviewed (the PA grid does not break out CPT codes for ABA at all)',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [METROPLUS_BH_HCBS_PA_GRID_2026],
  },
};

/* ==================== emblemhealth-new-york ==================== */

const emblemhealthEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'inferred',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
  },
  verifyVia: {
    'payerId.pverify':
      "EmblemHealth operates through at least three legally distinct underwriting entities (EmblemHealth Plan Inc./GHI, HIP/Health Insurance Plan of Greater NY, EmblemHealth Insurance Company), each with different candidate IDs: pVerify shows \"000101 EMBLEM HEALTH-EDI\", \"00965 HIP NEW YORK\", \"01115 GHI\" — none confirmed as the Medicaid-line-specific ID. Confirm which entity underwrites the Medicaid line directly with EmblemHealth.",
    'payerId.availity':
      "Multiple candidates, none confirmed for Medicaid specifically: \"13551 GHI - New York\", \"55247 Health Insurance Plan of Greater [New York]\". Confirm with Availity/EmblemHealth.",
    'payerId.changeHealthcare':
      "Heavily ambiguous — Optum's own list shows at least five distinct candidates by sub-brand (81336 general Emblem Health, E5247 Insurance Co MCR, 13551 GHI NYC MCR, 25531 HMO Select, 55247 HIP/EmblemHealth INS NY), plus a newly announced (7/21/2026) separate real-time-eligibility ID (10406, \"HIP of NY\") distinct from the older claims ID. Confirm the specific Medicaid-line ID directly with EmblemHealth/Optum.",
    'bhCarveOut.administratorPayerId':
      "Carelon's own clearinghouse ID is itself ambiguous — pVerify shows two active-looking candidates (\"002465 Carelon Behavioral Health\" vs. \"002460 Beacon Health Option-EDI Carelon\"), and no distinct general Carelon BH ID was found in Availity's or Optum's published lists. Confirm via Carelon Behavioral Health provider services (888-247-9311, per EmblemHealth's manual).",
    'bhCarveOut.abaRidesOn':
      "Carelon IS confirmed as EmblemHealth's BH administrator generally, INCLUDING for Medicaid/HARP (\"covered behavioral health benefits are managed by Carelon Behavioral Health\") — but NO EmblemHealth document specifically states ABA claims route through Carelon. The ABA benefit page names no administrator and enumerates no CPT codes at all; EmblemHealth's two master pre-authorization lists (610 + 226 pages, both read in full) contain zero ABA/CPT-97xxx hits, which is consistent with — but not proof of — Carelon routing. Confirm directly.",
    'bhCarveOut.twoHopRequired': 'Same open question as abaRidesOn — confirm directly with EmblemHealth or Carelon provider services.',
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, OPTUM_INSTITUTIONAL_PAYER_LIST, EMBLEM_BH_MANUAL, EMBLEM_CARELON_RENAME],
};

function emblemhealthEntry(): CodeGridEntry {
  return {
    covered:
      'inferred — the Medicaid ABA benefit page states generic coverage ("EmblemHealth will cover Applied Behavior Analysis (ABA) services for eligible EmblemHealth Medicaid members") but names NO individual CPT codes at all; coverage of this specific code is inferred from that general statement, not directly confirmed.',
    paRequired: 'unverified — no PA statement for ABA found anywhere in EmblemHealth\'s published materials (the benefit page is silent, and this code doesn\'t appear on either of EmblemHealth\'s master pre-authorization lists).',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not published'],
    telehealth: 'unverified — not published',
    modifiers: ['unverified — not published'],
    notes: 'No distinct EmblemHealth ABA clinical policy was located — the state\'s eligibility criteria (under 21, ASD/Rett, referral) is restated verbatim on the benefit page as the entire clinical rulebook. Verify PA and code-level mechanics through the emblemhealth.com provider portal per case.',
    fieldStatus: { covered: 'inferred', paRequired: 'unverified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [EMBLEM_ABA_BENEFIT_PAGE, EMBLEM_PA_LISTS, EMBLEM_BH_MANUAL],
  };
}

const emblemhealthCodeGrid: Record<string, CodeGridEntry> = {
  '97151': emblemhealthEntry(),
  '97152': emblemhealthEntry(),
  '97153': emblemhealthEntry(),
  '97154': emblemhealthEntry(),
  '97155': emblemhealthEntry(),
  '97156': emblemhealthEntry(),
  '97157': emblemhealthEntry(),
  '97158': emblemhealthEntry(),
  '0362T': {
    covered: 'unverified — not mentioned on the ABA benefit page (which names no CPT codes at all) or either master pre-authorization list',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [EMBLEM_ABA_BENEFIT_PAGE, EMBLEM_PA_LISTS],
  },
  '0373T': {
    covered: 'unverified — not mentioned on the ABA benefit page (which names no CPT codes at all) or either master pre-authorization list',
    paRequired: 'unverified',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    fieldStatus: { covered: 'unverified' },
    sources: [EMBLEM_ABA_BENEFIT_PAGE, EMBLEM_PA_LISTS],
  },
};

/* ==================== molina-healthcare-new-york ==================== */

const molinaEdi: EdiRouting = {
  payerId: { pverify: '00349 (legacy "Affinity Health Plan", active) — see verifyVia', availity: '13334', changeHealthcare: '16146' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — Molina brought behavioral health in-house effective 1/1/2022, ending a Beacon Health Options delegation',
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
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify shows the rebranded \"06002 Molina Healthcare of New York (Total Care New York)\" with Claim Status support = No, while the legacy \"00349 Affinity Health Plan\" entry shows full Eligibility+Claim Status = Yes — confirm which ID pVerify actually routes live traffic through today before automating on either.",
    'payerId.availity':
      "Availity's list only has \"13334 AFFINITY HEALTH PLAN\" (legacy branding) — no entry titled \"Molina Healthcare of New York\" was found. Likely the same underlying connection under old branding, but not confirmed.",
    'payerId.changeHealthcare':
      'Confirmed via a strong primary source (Molina\'s own Provider Quick Reference Guide: "Clearinghouse: SSI/Claimsnet — Payer ID 16146") and cross-listed in Optum\'s own Institutional Claims Payer List — but Molina\'s own document names its designated clearinghouse as "SSI/Claimsnet," not explicitly Optum/Change Healthcare, so the cross-listing may reflect interoperability rather than Optum being the primary designated gateway. Verify directly.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.',
  },
  sources: [PVERIFY_PAYER_LIST_A, AVAILITY_PAYER_LIST_A, MOLINA_BEACON_TRANSITION_LETTER],
};

function molinaEntry(paNamed: boolean): CodeGridEntry {
  return {
    covered: paNamed ? 'Yes' : 'unverified — not named in the 10/2021 ABA-benefit provider notice; not addressed either way in any other Molina NY document found',
    paRequired: paNamed
      ? "Required — explicitly named in Molina's 10/1/2021 provider notice: \"The following CPT codes will require prior authorization before the services are rendered: 97151, 97152, 97153, 97155.\""
      : "unverified — NOT named in Molina's 10/1/2021 ABA-benefit provider notice (which named only 97151/97152/97153/97155); no other Molina NY document expands or supersedes that list, so PA status for this code is genuinely unconfirmed rather than assumed exempt.",
    unitCap: 'unverified — not published in either Molina NY bulletin reviewed',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not published'],
    telehealth: 'unverified — not published',
    modifiers: ['unverified — not published'],
    notes:
      'Molina NY runs ABA UM in-house since 1/1/2022 (Beacon Health Options previously administered it); a "Codification Matrix" is referenced as the authoritative current PA code list on the plan\'s website but could not be located as a directly fetchable document this pass — its current ABA-specific content is unconfirmed.',
    fieldStatus: { covered: paNamed ? 'verified' : 'unverified', paRequired: paNamed ? 'verified' : 'unverified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [MOLINA_ABA_PA_NOTICE, MOLINA_BEACON_TRANSITION_LETTER],
  };
}

const molinaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': molinaEntry(true),
  '97152': molinaEntry(true),
  '97153': molinaEntry(true),
  '97154': molinaEntry(false),
  '97155': molinaEntry(true),
  '97156': molinaEntry(false),
  '97157': molinaEntry(false),
  '97158': molinaEntry(false),
  '0362T': molinaEntry(false),
  '0373T': molinaEntry(false),
};

/* ==================== export ==================== */

export const newYorkVob: Record<string, VobExtension> = {
  'excellus-bcbs-new-york': { edi: excellusEdi, codeGrid: excellusCodeGrid, lastUpdated: ACCESS_DATE },
  'mvp-health-plan-new-york': { edi: mvpEdi, codeGrid: mvpCodeGrid, lastUpdated: ACCESS_DATE },
  'cdphp-new-york': { edi: cdphpEdi, codeGrid: cdphpCodeGrid, lastUpdated: ACCESS_DATE },
  'independent-health-new-york': { edi: independentHealthEdi, codeGrid: independentHealthCodeGrid, lastUpdated: ACCESS_DATE },
  'highmark-western-new-york': { edi: highmarkWnyEdi, codeGrid: highmarkCodeGrid, lastUpdated: ACCESS_DATE },
  'aetna-new-york': { edi: aetnaNyEdi, codeGrid: aetnaNyCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-new-york': { edi: cignaNyEdi, codeGrid: cignaNyCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-new-york': { edi: uhcNyEdi, codeGrid: uhcNyCodeGrid, lastUpdated: ACCESS_DATE },

  'new-york-medicaid': { edi: newYorkMedicaidEdi, codeGrid: newYorkMedicaidCodeGrid, rates: newYorkMedicaidRates, lastUpdated: ACCESS_DATE },
  'fidelis-care-new-york': { edi: fidelisEdi, codeGrid: fidelisCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-new-york': { edi: uhcCommunityPlanEdi, codeGrid: uhcCommunityPlanCodeGrid, lastUpdated: ACCESS_DATE },
  'anthem-healthplus-new-york': { edi: anthemHealthPlusEdi, codeGrid: anthemHealthPlusCodeGrid, lastUpdated: ACCESS_DATE },
  'healthfirst-new-york': { edi: healthfirstEdi, codeGrid: healthfirstCodeGrid, lastUpdated: ACCESS_DATE },
  'metroplus-health-new-york': { edi: metroplusEdi, codeGrid: metroplusCodeGrid, lastUpdated: ACCESS_DATE },
  'emblemhealth-new-york': { edi: emblemhealthEdi, codeGrid: emblemhealthCodeGrid, lastUpdated: ACCESS_DATE },
  'molina-healthcare-new-york': { edi: molinaEdi, codeGrid: molinaCodeGrid, lastUpdated: ACCESS_DATE },
};
