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
import type { VobExtension, EdiRouting, CodeGridEntry, SourceRef } from './types.js';

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
};
