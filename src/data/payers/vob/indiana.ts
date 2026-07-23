/* ================================================================
   VOB ENRICHMENT — Indiana, Layers 1 (EDI routing crosswalk) + 3
   (code-level coverage grid) + 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec. Scope for this state: Medicaid
   lines only for Layer 4 (indiana-medicaid + its four active MCEs +
   the historical MDwise entry) — commercial guides (aetna-indiana,
   cigna-indiana, unitedhealthcare-indiana) ship Layers 1+3 only, per
   the build spec's "do not attempt commercial rates" rule.

   Sourcing notes (read before editing):
   - The 270/271 IHCP Companion Guide (Version 4.2, Publication Date
     March 31, 2026, in.gov/medicaid/providers/files/270-271-ihcp-
     companion-guide.pdf) was successfully retrieved and parsed this
     pass — unlike Georgia's equivalent, this document IS machine-
     readable. Section 7.4.5 "MANAGED CARE" gives the exact loop/
     segment for MCE enrollment (Loop 2100C EB/NM1) and confirms both
     batch and interactive (real-time) 270/271 are supported via CAQH
     CORE compliant web services. It does NOT publish a numeric
     carrier-code-to-MCE crosswalk table — MCEs are identified by a
     free-text program name (EB05) plus an MCE-assigned entity
     identifier (NM109), not a fixed code list — so
     medicaid271Notes.mcoCarrierCodes ships empty/unverified by design,
     not from a lookup failure.
   - IHCP Bulletin BT202627 (Feb 26, 2026) was also successfully
     retrieved and parsed — it carries the FULL individual and group
     ABA rate tables (Tables 1-3) for the current (DOS ≥4/1/2026) and
     upcoming (DOS ≥4/1/2027) phasedown steps. This is the strongest
     Layer 4 sourcing of any state shipped so far: every code, every
     modifier tier, both rate steps, directly from the bulletin PDF
     text (not a secondary summary).
   - The IHCP "Behavioral Health Services Codes" provider code table
     (provider.indianamedicaid.com, published April 2, 2026) supplied
     the exact per-code modifier requirements (practitioner-credential
     tier U1/U2/U3, group-size tier U4/U6/U8, comprehensive-therapy
     modifier UA) used in every indiana-medicaid codeGrid entry below.
   - No per-code POS list or per-code daily/weekly unit cap is
     published in either source — IHCP's model caps ABA at the
     PA-request level (≤40 hrs/week; comprehensive ABA draws from a
     4,000-hour lifetime allocation) rather than a per-code daily
     max the way Georgia's DCH does. posAllowed ships 'unverified'
     throughout; unitCap/capPeriod describe the PA-level structure.
   - MCE guides (Anthem, MHS, CareSource, UnitedHealthcare Community
     Plan) each publish PA-process detail (forms, documentation
     packages) but NOT their own code-level unit-cap/modifier tables —
     their codeGrid entries are 'inferred' from the statewide IHCP
     pattern above, same treatment Georgia gave Amerigroup/Peach State.
   - MDwise ended as an Indiana Medicaid MCE effective January 1, 2026
     (FSSA press release, in.gov/fssa/files/MDwise-Participation_
     FINAL-2025.pdf). Its vob entry ships for historical/reference
     completeness only — every field carries an EXITED notice, and the
     entry should NOT be used to route a live 2026+ eligibility check.
     Members were reassigned to Anthem, CareSource, or MHS.
   - pVerify's public payer list flags "00709 ANTHEM BCBS INDIANA" as
     Eligibility=No / Claim=No in its own table — surfaced verbatim in
     verifyVia rather than silently treated as a working ID. The
     Availity Essentials payer list carries the same "As of 08/08/2012"
     staleness footer already flagged in georgia.ts/aetna-florida —
     every Availity ID below is downgraded to 'inferred' for the same
     reason. National commercial payer IDs (Aetna 00001/60054, Cigna
     00004/62308, UnitedHealthcare 00192/87726) are reused verbatim
     from georgia.ts: these are the SAME national pVerify/Availity
     entries (re-confirmed by direct re-fetch this pass, access date
     below), not a guess carried over from another state.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, VobContact, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const IHCP_COMPANION_GUIDE = src(
  'https://www.in.gov/medicaid/providers/files/270-271-ihcp-companion-guide.pdf',
  '270/271 IHCP Companion Guide, Version 4.2, Publication Date March 31, 2026 (Indiana FSSA + Gainwell Technologies) — successfully retrieved and parsed. §7.4.5 "MANAGED CARE": Loop 2100C EB01=MC (Managed Care Coordinator), EB04=HM (HMO), EB05=free-text program name (Hoosier Healthwise / HIP / Hoosier Care Connect / PACE / PathWays for Aging), DTP01=307/DTP02=RD8=Managed Care Eligibility Date(s); followed by NM101=P5 (Plan Sponsor), NM103=MCE name, NM108=SV, NM109=Managed Care or PACE Entity Identifier. No numeric carrier-code table is published — MCEs are identified by name + NM109 identifier only. §4.1/§4.3: both batch and interactive (real-time, CAQH CORE compliant web services) 270/271 are supported.'
);
const IHCP_BH_CODES_TABLE = src(
  'https://provider.indianamedicaid.com/ihcp/Publications/providerCodes/Behavioral_Health_Services_Codes.pdf',
  'IHCP "Behavioral Health Services Codes" provider code table, Table 5, published April 2, 2026 — per-code modifier requirements: practitioner-credential tier (U1 RBT / U2 BCaBA / U3 BCBA-D, BCBA, HSPP, or physician), group-size tier (U4=2 / U6=3 / U8=4-8, required for 97154/97157/97158), and comprehensive-ABA modifier UA (required if applicable, all codes, eff. 4/1/2026). 97157 and 97158 are group-only codes (no individual-size modifier column); 97155 may be billed concurrently with technician-delivered 97153 when the QHP directs a present technician.'
);
const IHCP_BT202627 = src(
  'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf',
  'IHCP Bulletin BT202627, February 26, 2026 — Tables 1-3: full individual and group ABA maximum-fee tables (current, DOS≥4/1/2026, and DOS≥4/1/2027 phasedown steps) for all 10 codes; also states the 4,000-hour/16,000-unit comprehensive-ABA (modifier UA) lifetime allocation excludes 97155 and 97156, and that 97151/97152/97153/97154/0373T may no longer be billed with telehealth modifier 95 for DOS on/after 4/1/2026.'
);
const IHCP_PROMOD00039 = src(
  'https://www.in.gov/medicaid/providers/files/modules/behavioral-health-services.pdf',
  'IHCP Behavioral Health Services module (PROMOD00039), ABA section — PA structure (all ABA PA-required; each PA ≤6 months; up to 40 hrs/week requestable; caregiver coaching required, ≤18 hrs per 6-month authorization; ≥1 hr BCBA supervision per 8 hrs of technician services). No per-code POS list published.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 — re-fetched and parsed with layout-preserving extraction this pass (row: ID, Name, Eligibility Y/N, Claim Y/N, ERA Y/N, Line of Business).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs) — every page footer reads "As of 08/08/2012" (same finding already applied to aetna-florida and every Georgia guide); IDs below are sourced from this list but downgraded to \'inferred\' pending a current Availity export.',
  true
);
const ANTHEM_IN_MEDICAID_UM_GUIDELINE = src(
  'https://providers.anthem.com/docs/gpp/IN_CAID_ABAGuidelines.pdf',
  "Anthem Indiana Medicaid ABA UM Guideline (AINPEC-3345-21) — PA package (F84.0 diagnosis, testing results, intake assessment, treatment plan, daily schedule); no per-code unit-cap or modifier table published. Guideline last reviewed 2021, predates the 2026 IHCP changes."
);
const MHS_OTR_FORM = src(
  'https://www.mhsindiana.com/content/dam/centene/mhsindiana/medicaid/pdfs/508-BH-IN-Medicaid-ABA-OTR.pdf',
  "MHS (Centene) ABA Outpatient Treatment Request form — covers all ABA codes (97151-97158, 0362T, 0373T), distinguishes Focused vs. Comprehensive and Initial vs. Concurrent requests; no per-code unit-cap or modifier table published (defers to IHCP criteria)."
);
const CARESOURCE_IN_PA_PAGE = src(
  'https://www.caresource.com/in/providers/provider-portal/prior-authorization/medicaid/',
  'CareSource Indiana Medicaid prior-authorization page — portal-first PA workflow, IHCP universal PA form; no CareSource-specific ABA coding/reimbursement policy (archived MM-0900, 12/31/2022) — defers to IHCP criteria.'
);
const MDWISE_BH_REFERENCE_GUIDE = src(
  'https://www.mdwise.org/Uploads/Public/Documents/MDwise/BH-Reference-Guide.pdf',
  'MDwise Behavioral Health Reference Guide (historical) — lists ABA codes 97151-97158, 0362T, 0373T as PA-required across HHW and HIP; no MDwise-specific code-level unit-cap/modifier table. MDwise ended as an Indiana Medicaid MCE effective 1/1/2026 — this document is retained for historical reference only.'
);
const FSSA_MDWISE_EXIT = src(
  'https://www.in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf',
  'FSSA press release, "Announces End of MDwise Participation in Indiana Medicaid Programs," 11/12/2025 — MDwise ends as an MCE for HIP and Hoosier Healthwise effective 1/1/2026; members reassigned to Anthem, CareSource, or MHS.'
);
const UHC_IHCP_WORKS_DECK = src(
  'https://www.in.gov/medicaid/providers/files/IHCP-Works-2024-UHC-Prior-Authorization.pdf',
  'UHC Community Plan of Indiana — IHCP Works 2024 Prior Authorization seminar deck; confirms Optum Behavioral Health manages the Indiana ABA network separately from UHC medical, with the ABA Treatment Request Form via Provider Express. No per-code unit-cap/modifier table published.'
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
  'Evernorth/Cigna EN0499 — national medical-necessity policy; no unit caps, POS codes, or telehealth modifiers published.'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide, Mar 2025 — states verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical claims nationally (no separate Evernorth EDI hop). Not Indiana-specific; applies nationally.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy; zero CPT codes in-document.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum national ABA Reimbursement Policy (2022RP501A) — max-daily-units and HN/HM/HO/HP modifier tiers per code; not Indiana-specific, applied here as 'inferred' absent a confirmed Indiana override."
);

/* -------------------- Layer 7: contact & channel sources -------------------- */
/* Fetched/re-fetched this pass specifically to populate vobContact. Phone/fax numbers
   below were read directly out of these documents (not carried over from a search
   snippet) — see per-guide vobContact.sources for which of these backs which guide. */
const IHCP_QRG_CONTACT = src(
  'https://www.in.gov/medicaid/providers/files/quick-reference.pdf',
  'IHCP Quick Reference Guide – Contact Information, Version 14.1, May 2026 — FFS Provider Customer Assistance 800-457-4584; IHCP Provider Healthcare Portal at portal.indianamedicaid.com; per-MCE Managed Care contact page (by line of business) gives Anthem Provider Services 844-533-1995 (HIP) / 844-284-1798 (Hoosier Care Connect) / 866-408-6132 (Hoosier Healthwise) / 833-569-4739 (PathWays), fax by service (Physical Health 866-406-2803, BH Inpatient 877-434-7578, BH Outpatient 866-877-5229); CareSource Provider Services 844-607-2831, PA fax 844-432-8924; MHS Provider Services 877-647-4848, PA fax 866-912-4245 (Physical), 844-288-2591 (BH Inpatient), 866-694-3649 (BH Outpatient); UnitedHealthcare Community Plan Provider Services 877-610-9785, PA fax 844-897-6514, electronic payer ID 87726. MDwise listed with only an email (providerservices@mdwise.org), no phone — consistent with its post-exit residual listing.'
);
const MHS_PROVIDER_QRG_2019 = src(
  'https://www.mhsindiana.com/content/dam/centene/mhsindiana/medicaid/pdfs/Provider-QRG.pdf',
  "MHS \"PROVIDER Quick Reference Guide,\" effective June 1, 2019 — 877-647-4848 (TTY/TDD 1-800-743-3333), mhsindiana.com; GENERAL OFFICE HOURS 8 a.m.–5 p.m. EST (closed holidays); MEMBER/PROVIDER SERVICES 8 a.m.–8 p.m.; REFERRALS AND AUTHORIZATIONS 8 a.m.–5 p.m. (closed 12–1 p.m.); Secure Provider Portal at mhsindiana.com/login; fax numbers: Network Management 866-912-4244, Medical Appeals 866-714-7993, Case Management 866-694-3653, Referrals/Authorizations 866-912-4245. This is the newest MHS-published quick-reference PDF located this pass; dated 2019, so downgraded with staleRisk pending a current MHS-branded refresh (the main phone/referral-fax numbers are cross-confirmed current via IHCP_QRG_CONTACT above).",
  true
);
const MDWISE_QUICK_CONTACT_GUIDE = src(
  'https://www.mdwise.org/Uploads/Public/Documents/MDwise/MDwise-Quick-Contact-Guide.pdf',
  'MDwise "Provider Quick Contact Guide" (doc code DR-07-2025-17415/HHW-HIPP1005, dated 7/25, i.e. pre-dating the 1/1/2026 MCE exit) — MDwise Provider Services phone (local) 1-317-630-2831; Provider Customer Service Unit (PCSU) 1-833-654-9192, fax 1-463-426-5854; myMDwise Provider Portal at mdwise.org/for-providers/mymdwise-provider-portal; general/member customer service 1-800-356-1204. Retained for historical reference only — MDwise ended as an Indiana Medicaid MCE effective 1/1/2026 (see FSSA_MDWISE_EXIT); do not use these numbers to route a live 2026+ eligibility check.'
);
const UHC_IN_COMM_PLAN_CONTACT = src(
  'https://www.uhcprovider.com/en/health-plans-by-state/indiana-health-plans/in-comm-plan-home.html',
  'UHCprovider.com — UnitedHealthcare Community Plan of Indiana contact page — Provider Services (claims, prior auth, eligibility) 877-610-9785, available 8 a.m.–8 p.m. ET Monday–Friday; Optum Behavioral Health 800-888-2998 (toll-free), fax 844-897-6514, providerexpress.com; a dedicated "Provider Advocate - Indiana Autism/ABA Network Management" line is listed separately: 715-833-6538, fax 855-572-3643, territory "All ABA providers" — the most directly on-point contact found for an ABA-specific call on this guide.'
);
const UHC_NATIONAL_CONTACT_US = src(
  'https://www.uhcprovider.com/en/contact-us.html',
  'UHCprovider.com national Contact Us page — General provider assistance / Provider Services 877-842-3210 (not Indiana-specific — no separate Indiana commercial line found, distinct from the Indiana-specific Community Plan Medicaid number above); "24/7 behavioral health and substance use support line" 877-614-0484 (Optum); Behavioral health routes to Optum Provider Express or the same 877-614-0484 line.'
);
const AETNA_BH_PRECERT_LIST = src(
  'https://www.aetna.com/document-library/healthcare-professionals/documents-forms/bh_precert_list.pdf',
  'Aetna "Participating provider behavioral health precertification list," effective/last updated August 1, 2024 — Applied Behavioral Analysis (ABA) is listed among the behavioral health services requiring precertification; questions routed to Commercial plans 1-888-632-3862 (TTY 711); submission via the Availity® provider portal (Availity.com) or AetnaElectronicPrecert.com. Also states verbatim: "precertification programs don\'t apply to fully insured members in Indiana" — a general Aetna precert-program carve-out for Indiana, not ABA-specific, surfaced here as a call-script flag rather than used to alter the codeGrid paRequired value above. Document is ~24 months old at this access date; staleRisk flagged.',
  true
);
const CIGNA_CONTACT_US = src(
  'https://static.cigna.com/assets/chcp/resourceLibrary/medicalResourcesList/medicalCommunication/medicalContactUs.html',
  'CHCP (Cigna for Health Care Professionals) "Contact Us" resource page — Provider Services 800.88Cigna (882.4462), CignaforHCP.com; separately lists "Other Important Contacts: Evernorth Behavioral Health, Phone: 800.926.2273, Website: Provider.Evernorth.com" — the correct routing for ABA-specific calls given Evernorth\'s administrator role confirmed elsewhere in this file.'
);

/* -------------------- Layer 4: shared IN Medicaid rate table -------------------- */
/* IHCP's published max-fee schedule (BT202627 Tables 1-3) is the state benchmark for
   ALL Medicaid-line guides (state FFS + every MCE) — MCE-contracted rates are
   negotiated separately and not independently published (per indiana-medicaid's own
   guide prose). Reused verbatim across indiana-medicaid, anthem-indiana-medicaid,
   mhs-indiana, caresource-indiana, unitedhealthcare-community-plan-indiana, and
   mdwise-indiana (historical). */
function indianaMedicaidRates(): RateTable {
  return {
    source:
      'IHCP Bulletin BT202627 (Feb 26, 2026), Tables 1-3 — state fee-schedule maximum. MCE-contracted rates are negotiated separately per plan and not independently published; this is the benchmark cited in every Indiana Medicaid ABA guide.',
    effectiveDate: '2026-04-01',
    byCode: {
      '97151': {
        rate: '$20.56 (U2, BCaBA) / $25.97 (U3, BCBA/BCBA-D/HSPP/physician)',
        unit: '15min',
        modifierTiers: {
          U2: '$20.56 (DOS ≥4/1/2026) → $19.74 (DOS ≥4/1/2027)',
          U3: '$25.97 (DOS ≥4/1/2026) → $24.93 (DOS ≥4/1/2027)',
        },
      },
      '97152': {
        rate: '$16.04 (U1, RBT)',
        unit: '15min',
        modifierTiers: { U1: '$16.04 (DOS ≥4/1/2026) → $15.39 (DOS ≥4/1/2027)' },
      },
      '97153': {
        rate: '$16.04 (U1/U2/U3 — uniform across all three practitioner tiers since 4/1/2026)',
        unit: '15min',
        modifierTiers: {
          U1: '$16.04 (DOS ≥4/1/2026) → $15.39 (DOS ≥4/1/2027); pre-4/1/2026 was $17.06 (U1 only — U2/U3 not allowable for 97153 before that date)',
          U2: '$16.04 (DOS ≥4/1/2026) → $15.39 (DOS ≥4/1/2027) — N/A before 4/1/2026',
          U3: '$16.04 (DOS ≥4/1/2026) → $15.39 (DOS ≥4/1/2027) — N/A before 4/1/2026',
        },
      },
      '97154': {
        rate: 'Group-only (no individual/non-group rate published) — $9.21 (U1+U4, group of 2), DOS ≥4/1/2026',
        unit: '15min',
        modifierTiers: {
          'U1+U4 (group of 2)': '$9.21 (DOS ≥4/1/2026) → $8.84 (DOS ≥4/1/2027); pre-4/1/2026 flat rate (any group size) was $4.87',
          'U1+U6 (group of 3)': '$6.14 (DOS ≥4/1/2026) → $5.90 (DOS ≥4/1/2027)',
          'U1+U8 (group of 4-8)': '$4.61 (DOS ≥4/1/2026) → $4.43 (DOS ≥4/1/2027)',
        },
      },
      '97155': {
        rate: '$20.54 (U2, BCaBA) / $25.97 (U3, BCBA)',
        unit: '15min',
        modifierTiers: {
          U2: '$20.54 (DOS ≥4/1/2026) → $19.72 (DOS ≥4/1/2027)',
          U3: '$25.97 (DOS ≥4/1/2026) → $24.93 (DOS ≥4/1/2027)',
        },
        // 97155 and 97156 are excluded from the 4,000-hour comprehensive-ABA lifetime allocation (BT202627).
      },
      '97156': {
        rate: '$20.56 (U2, BCaBA) / $26.54 (U3, BCBA)',
        unit: '15min',
        modifierTiers: {
          U2: '$20.56 (DOS ≥4/1/2026) → $19.74 (DOS ≥4/1/2027)',
          U3: '$26.54 (DOS ≥4/1/2026) → $25.47 (DOS ≥4/1/2027)',
        },
      },
      '97157': {
        rate: 'Group-only — $11.82 (U2+U4, group of 2), DOS ≥4/1/2026',
        unit: '15min',
        modifierTiers: {
          'U2+U4 (group of 2)': '$11.82 → $11.35 (4/1/2027); pre-4/1/2026 flat rate (any size) was $6.25 (U2)',
          'U2+U6 (group of 3)': '$7.88 → $7.57 (4/1/2027)',
          'U2+U8 (group of 4-8)': '$5.91 → $5.68 (4/1/2027)',
          'U3+U4 (group of 2)': '$14.93 → $14.33 (4/1/2027); pre-4/1/2026 flat rate (any size) was $7.89 (U3)',
          'U3+U6 (group of 3)': '$9.95 → $9.56 (4/1/2027)',
          'U3+U8 (group of 4-8)': '$7.46 → $7.16 (4/1/2027)',
        },
      },
      '97158': {
        rate: 'Group-only — $11.82 (U2+U4, group of 2), DOS ≥4/1/2026 (identical rate structure to 97157)',
        unit: '15min',
        modifierTiers: {
          'U2+U4 (group of 2)': '$11.82 → $11.35 (4/1/2027); pre-4/1/2026 flat rate (any size) was $6.25 (U2)',
          'U2+U6 (group of 3)': '$7.88 → $7.57 (4/1/2027)',
          'U2+U8 (group of 4-8)': '$5.91 → $5.68 (4/1/2027)',
          'U3+U4 (group of 2)': '$14.93 → $14.33 (4/1/2027); pre-4/1/2026 flat rate (any size) was $7.89 (U3)',
          'U3+U6 (group of 3)': '$9.95 → $9.56 (4/1/2027)',
          'U3+U8 (group of 4-8)': '$7.46 → $7.16 (4/1/2027)',
        },
      },
      '0362T': {
        rate: '$26.83 (U1)',
        unit: '15min',
        modifierTiers: { U1: '$26.83 (DOS ≥4/1/2026) → $25.75 (DOS ≥4/1/2027)' },
      },
      '0373T': {
        rate: '$26.83 (U1)',
        unit: '15min',
        modifierTiers: { U1: '$26.83 (DOS ≥4/1/2026) → $25.75 (DOS ≥4/1/2027)' },
      },
    },
    sources: [IHCP_BT202627],
  };
}

/* -------------------- codeGrid factories -------------------- */

const NO_95_TELEHEALTH_CODES = new Set(['97151', '97152', '97153', '97154', '0373T']);

function indianaMedicaidEntry(code: string, modifiers: string[], notes?: string): CodeGridEntry {
  const telehealthRestricted = NO_95_TELEHEALTH_CODES.has(code);
  return {
    covered: 'Yes',
    paRequired: 'Required — all ABA services (each PA ≤6 months)',
    unitCap:
      'No per-code daily/weekly unit cap published; PA-approved up to 40 hrs/week overall. Comprehensive ABA (16+ hrs/wk, modifier UA) draws from a 4,000-hour (16,000-unit) lifetime allocation — 97155 and 97156 are excluded from that allocation.',
    capPeriod: 'PA-approved weekly intensity; separate lifetime allocation for comprehensive ABA (per member, not per code)',
    posAllowed: ['unverified'],
    telehealth: telehealthRestricted
      ? 'No — modifier 95 (synchronous telemedicine) may not be billed with this code for DOS on/after 4/1/2026 (BT202627).'
      : 'Not restricted by BT202627\'s 4/1/2026 telehealth change; no code-specific POS/modifier detail published for telehealth delivery of this code otherwise.',
    modifiers,
    notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'unverified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [IHCP_BH_CODES_TABLE, IHCP_BT202627, IHCP_PROMOD00039],
  };
}

function inferredFromStatePattern(base: CodeGridEntry, verifyViaPortal: string): CodeGridEntry {
  return {
    ...base,
    notes: [base.notes, `Verify via: ${verifyViaPortal} — this plan's own published materials don't restate per-code unit caps or modifier tables; the statewide IHCP pattern is applied here as inferred.`]
      .filter(Boolean)
      .join(' '),
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'inferred',
      modifiers: 'inferred',
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
    notes: 'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are national medical-necessity policies only; no Indiana-specific or ABA-specific coding/reimbursement policy located.',
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
    notes: 'Verify via: Cigna/Evernorth provider services — EN0499 is a national medical-necessity policy only; no coding/reimbursement mechanics published.',
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
    paRequired: "Required — Optum ABA two-step authorization (assessment, then treatment); reviews every 4-6 months per Indiana's national UnitedHealthcare/Optum guide",
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes: "Unit caps/modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A), applied here as inferred absent a confirmed Indiana-specific override. Verify via: Provider Express / UHC provider services.",
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

/* ==================== indiana-medicaid ==================== */

const indianaMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00116', availity: 'IHCP', changeHealthcare: 'unverified' },
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
      'Loop 2100C, Subscriber EB segment: EB01=MC (Managed Care Coordinator), EB04=HM (HMO), EB05=free-text program name (Hoosier Healthwise Managed Care / Healthy Indiana Plan Managed Care / Hoosier Care Connect / PACE Managed Care / Indiana PathWays for Aging Managed Care). The MCE itself is named in the following NM1 segment: NM101=P5 (Plan Sponsor), NM103=MCE/PACE entity name, NM108=SV, NM109=MCE/PACE entity identifier. DTP01=307/DTP02=RD8 gives the Managed Care Eligibility Date span.',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity:
      'Date-range (DTP02=RD8 format, CCYYMMDD-CCYYMMDD start/end) rather than a single-day snapshot — the 271 reports a Managed Care Eligibility Date span, not a monthly or daily flag.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'inferred',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not located this pass.',
    'bhCarveOut.administrator':
      'No IHCP source states an ABA-specific BH carve-out exists or doesn\'t; inferred "none" from every reviewed MCE guide describing ABA as billed directly under IHCP/MCE medical claims, not routed to a named BH administrator (contrast with unitedhealthcare-community-plan-indiana below, which DOES carve ABA to Optum). Confirm with FSSA/Gainwell EDI helpdesk if automating.',
    'medicaid271Notes.mcoCarrierCodes':
      'The companion guide identifies MCEs by free-text name (EB05) plus an entity identifier (NM109), not a fixed numeric carrier-code table — this field ships empty by design, not as an unretrieved lookup. If a numeric crosswalk exists elsewhere (e.g., a Gainwell trading-partner spec), request it via INXIXTradingPartner@gainwelltechnologies.com.',
  },
  sources: [IHCP_COMPANION_GUIDE, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const indianaMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': indianaMedicaidEntry('97151', ['U2', 'U3', 'UA (if comprehensive)'], 'Behavior identification assessment by professional, each 15 minutes.'),
  '97152': indianaMedicaidEntry('97152', ['U1', 'UA (if comprehensive)'], 'Behavior identification assessment by technician, each 15 minutes.'),
  '97153': indianaMedicaidEntry('97153', ['U1', 'U2', 'U3', 'UA (if comprehensive)'], 'Adaptive behavior treatment by technician; U2/U3 (BCaBA/BCBA) tiers newly allowable for this code effective 4/1/2026 (previously RBT/U1-only).'),
  '97154': indianaMedicaidEntry('97154', ['U1', 'U4/U6/U8 (group size, required)', 'UA (if comprehensive)'], 'Group ABA treatment by technician — group-size modifier required; no individual/non-group rate exists for this code.'),
  '97155': indianaMedicaidEntry('97155', ['U2', 'U3'], 'Adaptive behavior treatment by professional using an established plan. May be billed concurrently with technician-delivered 97153 when the QHP directs a present technician. Excluded from the 4,000-hour comprehensive-ABA lifetime allocation.'),
  '97156': indianaMedicaidEntry('97156', ['U2', 'U3'], 'Adaptive behavior treatment by professional with family. Excluded from the 4,000-hour comprehensive-ABA lifetime allocation.'),
  '97157': indianaMedicaidEntry('97157', ['U2', 'U3', 'U4/U6/U8 (group size, required)', 'UA (if comprehensive)'], 'Group-only code — no individual/non-group rate exists.'),
  '97158': indianaMedicaidEntry('97158', ['U2', 'U3', 'U4/U6/U8 (group size, required)', 'UA (if comprehensive)'], 'Group-only code — no individual/non-group rate exists.'),
  '0362T': indianaMedicaidEntry('0362T', ['U1', 'UA (if comprehensive)'], 'Behavior identification supporting assessment for destructive behavior, technician face-to-face time.'),
  '0373T': indianaMedicaidEntry('0373T', ['U1', 'UA (if comprehensive)'], 'Adaptive behavior treatment with protocol modification for destructive behavior, technician face-to-face time.'),
};

/* ==================== anthem-indiana-medicaid ==================== */

const anthemInMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00709', availity: 'ANTHEM - IN', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      'pVerify\'s own table flags "00709 ANTHEM BCBS INDIANA" as Eligibility=No / Claim=No — the ID exists in the directory but pVerify does not currently support automated eligibility or claim status on it. Confirm current support status directly with pVerify before automating.',
    'payerId.availity': 'Same 2012-vintage Availity list staleness finding as every ID below — confirm against a current Availity export.',
    supports270271: 'Not stated directly for this specific MCE entry in either source; confirm via Availity onboarding.',
    'bhCarveOut.administrator': 'No Anthem Indiana Medicaid document reviewed states or disclaims a BH carve-out for ABA specifically — inferred "none" from the UM guideline describing direct PA/claims handling.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, ANTHEM_IN_MEDICAID_UM_GUIDELINE],
};

const anthemInMedicaidCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(indianaMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'Anthem Indiana Medicaid provider services / Availity Interactive Care Reviewer'),
  ])
);

/* ==================== mhs-indiana ==================== */

const mhsIndianaEdi: EdiRouting = {
  payerId: { pverify: '00379', availity: 'unverified', changeHealthcare: 'unverified' },
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
    'payerId.availity': 'No MHS/Managed Health Services Indiana entry found in the fetched Availity 837 payer list — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not located this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify onboarding for this payer ID.',
    'bhCarveOut.administrator': 'No MHS document reviewed states or disclaims a BH carve-out for ABA specifically — inferred "none" from the OTR form describing direct PA/claims handling.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, MHS_OTR_FORM],
};

const mhsIndianaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(indianaMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'MHS UM (877) 647-4848 or the ABA Outpatient Treatment Request tip sheet'),
  ])
);

/* ==================== caresource-indiana ==================== */

const caresourceIndianaEdi: EdiRouting = {
  payerId: { pverify: '01358', availity: '37311', changeHealthcare: 'unverified' },
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
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'Same 2012-vintage Availity list staleness finding as every ID above — confirm against a current Availity export. (Availity also lists an "F37311" institutional variant of this same ID.)',
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not located this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator': 'CareSource\'s own prior-auth page describes direct PA/claims handling with no named BH administrator — inferred "none".',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CARESOURCE_IN_PA_PAGE],
};

const caresourceIndianaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(indianaMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'CareSource Provider Portal or UM (844) 607-2831'),
  ])
);

/* ==================== mdwise-indiana (HISTORICAL — MCE EXITED 1/1/2026) ==================== */

const mdwiseIndianaEdi: EdiRouting = {
  payerId: {
    pverify: '000923 (MDWISE Medicaid Health Plans) — legacy sub-plan IDs also on file: 06068 (Hoosier Healthwise), 00381 (Hoosier Alliance), 01180 (Exchange)',
    availity: 'unverified',
    changeHealthcare: 'unverified',
  },
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
    'payerId.pverify':
      'HISTORICAL ONLY — MDwise ended as an Indiana Medicaid MCE effective 1/1/2026 (FSSA press release); these IDs should NOT be used to route a live eligibility check. Route current requests to anthem-indiana-medicaid, caresource-indiana, or mhs-indiana instead, per the member\'s reassigned plan.',
    'payerId.availity': 'No MDwise entry found in the fetched Availity 837 payer list; moot given the MCE exit.',
    supportsRealtime: 'Moot given the MCE exit — not pursued further this pass.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, MDWISE_BH_REFERENCE_GUIDE, FSSA_MDWISE_EXIT],
};

const mdwiseIndianaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(indianaMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(
      { ...entry, notes: `HISTORICAL — MDwise ended as an Indiana Medicaid MCE effective 1/1/2026; members were reassigned to Anthem, CareSource, or MHS. ${entry.notes ?? ''}`.trim() },
      'N/A — MDwise no longer administers Indiana Medicaid ABA claims; use the member\'s reassigned MCE guide'
    ),
  ])
);

/* ==================== unitedhealthcare-community-plan-indiana ==================== */

const uhcCommunityPlanIndianaEdi: EdiRouting = {
  payerId: { pverify: 'unverified (UHG001 "UnitedHealth Group - Community Plan" is a generic national candidate, not confirmed Indiana-specific)', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: 'unverified',
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
    administratorPayerId: 'unverified',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'unverified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'Indiana-specific UHC Community Plan pVerify ID not located this pass (contrast with Kansas below, which has a confirmed state-specific "UHG002" entry) — confirm via Provider Express / UHC provider services.',
    'payerId.availity': 'No UHC Community Plan Indiana entry found in the fetched Availity 837 payer list.',
    supports270271: 'Confirm via pVerify/Availity onboarding.',
    'bhCarveOut.administratorPayerId': 'Confirm via Provider Express whether ABA claims route on a distinct Optum BH payer ID or the same 87726 used for UHC medical.',
    'bhCarveOut.abaRidesOn': 'Optum manages the ABA network/credentialing/PA per the IHCP Works deck, but claims may still route on the shared medical payer ID — the medical/BH split for the EDI hop itself is not confirmed.',
  },
  sources: [PVERIFY_PAYER_LIST, UHC_IHCP_WORKS_DECK],
};

const uhcCommunityPlanIndianaCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(indianaMedicaidCodeGrid).map(([code, entry]) => [
    code,
    inferredFromStatePattern(entry, 'Provider Express ABA Treatment Request Form / Optum Indiana Medicaid ABA Program page'),
  ])
);

/* ==================== aetna-indiana (commercial — Layers 1+3 only) ==================== */

const aetnaIndianaEdi: EdiRouting = {
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
    'payerId.availity': 'Same 2012-vintage Availity list staleness finding as georgia.ts/aetna-florida — downgraded to inferred pending a current Availity export.',
    'payerId.changeHealthcare': 'Same staleness finding as payerId.availity.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator': 'Not researched to a primary source this pass — confirm via Aetna provider services or the ABA precertification process whether Aetna administers ABA in-house or via a BH carve-out for Indiana commercial plans.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

const aetnaIndianaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': aetnaEntry(), '97152': aetnaEntry(), '97153': aetnaEntry(), '97154': aetnaEntry(),
  '97155': aetnaEntry(), '97156': aetnaEntry(), '97157': aetnaEntry(), '97158': aetnaEntry(),
  '0362T': aetnaEntry(), '0373T': aetnaEntry(),
};

/* ==================== cigna-indiana (commercial — Layers 1+3 only) ==================== */

const cignaIndianaEdi: EdiRouting = {
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

const cignaIndianaCodeGrid: Record<string, CodeGridEntry> = {
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

/* ==================== unitedhealthcare-indiana (commercial — Layers 1+3 only) ==================== */

const unitedhealthcareIndianaEdi: EdiRouting = {
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
    'payerId.availity': 'No plain "UnitedHealthcare" entry (distinct from "United Healthcare" 87726) confirmed in the fetched Availity list for this exact ID pairing — confirm directly with Availity onboarding.',
    'payerId.changeHealthcare': 'pVerify separately lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" entry — not resolved which applies for Indiana commercial ABA specifically.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId': "Provider Express / UHC provider services — confirm whether ABA claims route on a distinct Optum BH payer ID or the shared 87726 medical ID.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, OPTUM_SCC],
};

const unitedhealthcareIndianaCodeGrid: Record<string, CodeGridEntry> = {
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

/* ==================== Layer 7: vobContact ====================
   Contact fields (phone/fax/hours/portal) are scraped from primary provider-
   facing documents — reused from this file's own Layer 1/3/4 sources where a
   number/URL was already quoted verbatim in a src() note, supplemented by new
   fetches this pass (consts above) for gaps. scriptedQuestions are generated,
   not scraped: each targets a field this guide's OWN edi/codeGrid marks
   unverified/plan-dependent — never a fact already verified above. */

const indianaMedicaidContact: VobContact = {
  providerServicesPhone: '800-457-4584 (IHCP Provider Customer Assistance, Gainwell Technologies)',
  portal: { name: 'IHCP Provider Healthcare Portal', url: 'https://portal.indianamedicaid.com' },
  scriptedQuestions: [
    'Which service location(s) — home, clinic, school, telehealth — are authorized on this member\'s approved ABA PA? (IHCP publishes no per-code POS list.)',
    'Does this member\'s 270/271 route through a Change Healthcare payer ID, or only pVerify/Availity? (unconfirmed for IHCP)',
    'If the member is on comprehensive ABA (modifier UA), how many hours/units remain of the 4,000-hour lifetime allocation?',
  ],
  sources: [IHCP_QRG_CONTACT],
};

const anthemInMedicaidContact: VobContact = {
  providerServicesPhone:
    'Varies by line of business — HIP: 844-533-1995 / Hoosier Care Connect: 844-284-1798 / Hoosier Healthwise: 866-408-6132 / PathWays: 833-569-4739 (Anthem Indiana Medicaid Provider Services)',
  fax: 'Physical Health (Inpatient & Outpatient): 866-406-2803 / Behavioral Health Inpatient: 877-434-7578 / Behavioral Health Outpatient: 866-877-5229',
  portal: { name: 'Availity Essentials', url: 'https://Availity.com' },
  scriptedQuestions: [
    'Which of the four Anthem Indiana Medicaid lines of business (HIP, Hoosier Healthwise, Hoosier Care Connect, PathWays) is the member enrolled in? Provider Services routes to a different phone number for each.',
    'Does Availity support real-time (interactive) 270/271 for this member\'s plan, or only batch?',
    'What are the per-code unit caps, POS, and modifier requirements for this member\'s ABA authorization? (Anthem\'s UM guideline doesn\'t restate IHCP\'s statewide code-level table.)',
    'Has pVerify\'s flagged "00709 Eligibility=No/Claim=No" status changed, or should this check route through Availity instead?',
  ],
  sources: [IHCP_QRG_CONTACT, ANTHEM_IN_MEDICAID_UM_GUIDELINE],
};

const mhsIndianaContact: VobContact = {
  providerServicesPhone: '877-647-4848 (MHS Provider Services; TTY/TDD 1-800-743-3333)',
  hours:
    'General office 8 a.m.–5 p.m. ET, closed holidays; Member & Provider Services 8 a.m.–8 p.m.; Referrals & Authorizations 8 a.m.–5 p.m. (closed 12–1 p.m.)',
  portal: { name: 'MHS Secure Provider Portal', url: 'https://www.mhsindiana.com/login' },
  fax: 'Physical Health Referrals/PA: 866-912-4245 / Behavioral Health Inpatient: 844-288-2591 / Behavioral Health Outpatient: 866-694-3649',
  scriptedQuestions: [
    'Does MHS\'s payer ID (00379) support real-time 270/271, or only batch — and is there a distinct Availity or Change Healthcare ID?',
    'What are the per-code unit caps, POS, and modifier requirements for this member\'s ABA authorization? (MHS\'s OTR form defers to IHCP criteria without its own table.)',
    'Does MHS route ABA claims through a named BH administrator, or directly under IHCP medical claims, for this member\'s plan?',
  ],
  sources: [IHCP_QRG_CONTACT, MHS_PROVIDER_QRG_2019, MHS_OTR_FORM],
};

const caresourceIndianaContact: VobContact = {
  providerServicesPhone: '844-607-2831 (CareSource Indiana Medicaid Provider Services / Prior Authorization)',
  fax: '844-432-8924 (CareSource general/PA fax)',
  portal: { name: 'CareSource Provider Portal', url: 'https://providerportal.caresource.com/IN' },
  scriptedQuestions: [
    'Does CareSource\'s Indiana Medicaid payer ID support real-time 270/271, and is there a distinct Change Healthcare ID?',
    'What are the per-code unit caps, POS, and modifier requirements for this member\'s ABA authorization? (CareSource\'s PA page defers to IHCP criteria without its own table.)',
    'Does CareSource administer ABA directly or via a named BH administrator for this member\'s plan?',
  ],
  sources: [CARESOURCE_IN_PA_PAGE, IHCP_QRG_CONTACT],
};

const mdwiseIndianaContact: VobContact = {
  providerServicesPhone:
    '1-833-654-9192 (MDwise Provider Customer Service Unit) — HISTORICAL ONLY: MDwise ended as an Indiana Medicaid MCE effective 1/1/2026; do not use to route a live 2026+ eligibility check',
  fax: '1-463-426-5854 (historical Provider Customer Service Unit fax)',
  portal: { name: 'myMDwise Provider Portal (historical)', url: 'https://www.mdwise.org/for-providers/mymdwise-provider-portal' },
  scriptedQuestions: [
    'If a member\'s ID card still shows MDwise, confirm their reassigned MCE (Anthem, CareSource, or MHS) before proceeding — MDwise ended as an Indiana Medicaid MCE effective 1/1/2026.',
  ],
  sources: [MDWISE_QUICK_CONTACT_GUIDE, FSSA_MDWISE_EXIT, MDWISE_BH_REFERENCE_GUIDE],
};

const uhcCommunityPlanIndianaContact: VobContact = {
  providerServicesPhone: '877-610-9785 (UnitedHealthcare Community Plan of Indiana Provider Services)',
  hours: '8 a.m.–8 p.m. Eastern Time, Monday–Friday',
  ivrPath:
    'For ABA-specific issues, ask to be routed to Optum Behavioral Health (800-888-2998) or the Indiana Autism/ABA Network Management Provider Advocate (715-833-6538) rather than general medical Provider Services.',
  fax: '844-897-6514 (Optum Behavioral Health / prior authorization fax)',
  portal: { name: 'Provider Express (Optum Behavioral Health)', url: 'https://public.providerexpress.com' },
  scriptedQuestions: [
    'What is the correct pVerify/Availity payer ID for Indiana Community Plan 270/271 eligibility checks? (No Indiana-specific ID confirmed yet.)',
    'Do ABA claims route on Optum\'s own BH payer ID, or the shared UHC medical ID (87726)?',
    'What are the per-code unit caps, POS, and modifier requirements for this member\'s ABA authorization? (Only the statewide IHCP pattern is on file, not a UHC/Optum-specific table.)',
  ],
  sources: [UHC_IN_COMM_PLAN_CONTACT],
};

const aetnaIndianaContact: VobContact = {
  providerServicesPhone: '1-888-632-3862 (Aetna commercial precertification / Provider Services, TTY 711)',
  portal: { name: 'Availity Essentials', url: 'https://Availity.com' },
  scriptedQuestions: [
    'Does Aetna administer ABA in-house or via a behavioral-health carve-out for this member\'s Indiana commercial plan?',
    'What are the per-code unit caps, POS, telehealth allowance, and licensure-tier modifiers for ABA codes? (No Indiana-specific coding table is published.)',
    'Is precertification actually required for this member? Aetna\'s national BH precertification list states its precertification programs don\'t apply to fully insured members in Indiana — confirm the member\'s funding type (fully insured vs. self-funded) before assuming PA applies.',
  ],
  sources: [AETNA_BH_PRECERT_LIST],
};

const cignaIndianaContact: VobContact = {
  providerServicesPhone:
    '800-882-4462 (Cigna Provider Services, general) / 800-926-2273 (Evernorth Behavioral Health — route ABA-specific calls here)',
  portal: { name: 'CignaforHCP / Provider.Evernorth.com', url: 'https://cignaforhcp.cigna.com' },
  scriptedQuestions: [
    'Does Cigna/Evernorth support real-time (interactive) 270/271 for this payer ID, or only batch?',
    'What are the per-code unit caps, POS, telehealth allowance, and modifier requirements for ABA codes? (EN0499 is a national medical-necessity policy only — no coding/reimbursement mechanics published.)',
  ],
  sources: [CIGNA_CONTACT_US, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const unitedhealthcareIndianaContact: VobContact = {
  providerServicesPhone: '877-842-3210 (UnitedHealthcare commercial Provider Services — national line; no Indiana-specific override located)',
  ivrPath: 'For ABA/behavioral health, ask for the 24/7 behavioral health and substance use support line (877-614-0484, Optum) or Provider Express instead of general medical Provider Services.',
  portal: { name: 'UnitedHealthcare Provider Portal / Provider Express', url: 'https://www.uhcprovider.com' },
  scriptedQuestions: [
    'Do ABA claims route on a distinct Optum Behavioral Health payer ID, or the shared UHC medical ID (87726), for this member\'s plan?',
    'What is the telehealth allowance and what POS codes apply to ABA services? (Neither is published in Optum\'s national reimbursement policy for Indiana specifically.)',
    'Is a two-hop EDI routing (medical → BH) required for this member\'s eligibility check?',
  ],
  sources: [UHC_NATIONAL_CONTACT_US, OPTUM_SCC],
};

/* ==================== export ==================== */

export const indianaVob: Record<string, VobExtension> = {
  'indiana-medicaid': { edi: indianaMedicaidEdi, codeGrid: indianaMedicaidCodeGrid, rates: indianaMedicaidRates(), vobContact: indianaMedicaidContact, lastUpdated: ACCESS_DATE },
  'anthem-indiana-medicaid': { edi: anthemInMedicaidEdi, codeGrid: anthemInMedicaidCodeGrid, rates: indianaMedicaidRates(), vobContact: anthemInMedicaidContact, lastUpdated: ACCESS_DATE },
  'mhs-indiana': { edi: mhsIndianaEdi, codeGrid: mhsIndianaCodeGrid, rates: indianaMedicaidRates(), vobContact: mhsIndianaContact, lastUpdated: ACCESS_DATE },
  'caresource-indiana': { edi: caresourceIndianaEdi, codeGrid: caresourceIndianaCodeGrid, rates: indianaMedicaidRates(), vobContact: caresourceIndianaContact, lastUpdated: ACCESS_DATE },
  'mdwise-indiana': { edi: mdwiseIndianaEdi, codeGrid: mdwiseIndianaCodeGrid, rates: indianaMedicaidRates(), vobContact: mdwiseIndianaContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-indiana': { edi: uhcCommunityPlanIndianaEdi, codeGrid: uhcCommunityPlanIndianaCodeGrid, rates: indianaMedicaidRates(), vobContact: uhcCommunityPlanIndianaContact, lastUpdated: ACCESS_DATE },
  'aetna-indiana': { edi: aetnaIndianaEdi, codeGrid: aetnaIndianaCodeGrid, vobContact: aetnaIndianaContact, lastUpdated: ACCESS_DATE },
  'cigna-indiana': { edi: cignaIndianaEdi, codeGrid: cignaIndianaCodeGrid, vobContact: cignaIndianaContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-indiana': { edi: unitedhealthcareIndianaEdi, codeGrid: unitedhealthcareIndianaCodeGrid, vobContact: unitedhealthcareIndianaContact, lastUpdated: ACCESS_DATE },
};
