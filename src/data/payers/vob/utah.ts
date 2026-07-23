/* ================================================================
   VOB ENRICHMENT — Utah, Layers 1 (EDI routing crosswalk),
   3 (code-level coverage grid) + 4 (Medicaid rate table).
   See docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - Utah ABA is the state-plan Autism Spectrum Disorder (ASD)
     benefit and is a FEE-FOR-SERVICE CARVE-OUT: the four physical-
     health ACOs (Health Choice Utah, Healthy U, Molina, SelectHealth
     Community Care) never administer ABA — diagnosis documentation,
     prior authorization, and claims all go directly to Utah Medicaid
     (PRISM), whatever card the family carries. UnitedHealthcare holds
     NO Utah Medicaid ACO contract; United Behavioral Health (Optum)
     appears only as a Prepaid Mental Health Plan (PMHP) contractor,
     and PMHPs cover MH/SUD only — ABA is carved out to state FFS.
     bhCarveOut is therefore 'none' on the Medicaid guide (ABA rides
     the medical FFS claim, no second hop), and an ACO/PMHP showing on
     the 271 does NOT redirect ABA. (Verified: Utah Medicaid ASD
     provider manual + family FAQ; already-verified corpus prose in
     src/data/payers/utah.ts.)
   - Utah is one of the most intake-friendly Medicaid programs:
     NO PA on 97151 (behavior-identification assessment — 1 per
     26 weeks, up to 24 units); treatment codes need PA in 26-week
     periods via PRISM with a 10-BUSINESS-DAY grace to submit after
     starting services; coverage runs 'regardless of age' (PRISM
     shows ages 1+, adult plans included).
   - KNOWN OBSTACLE: Utah's ASD provider manual + family FAQ PDFs
     returned unreadable binary to previous fetchers. Rate/cap/PA
     facts are carried from the already-verified corpus prose (itself
     built from the PRISM Coverage/Reimbursement lookup, the archived
     ASD manual, and SPA UT-25-0007) and each source is cited with a
     retrieval note. The Utah Medicaid 270/271 companion guide
     (PRISM / fiscal agent) could not be retrieved this pass, so
     medicaid271Notes ships 'unverified' per the "never guess" rule.
   - The three commercial guides (aetna/cigna/unitedhealthcare-utah)
     run on the SAME national clinical policies as every other state
     (Aetna CPB 0554/0648; Evernorth/Cigna EN0499; Optum SCC +
     national ABA Reimbursement Policy). Their EDI IDs are national,
     not Utah-specific; their codeGrid mechanics come from those
     national policies with the same gaps flagged in georgia.ts. What
     is Utah-specific for commercial members is the Utah Code
     31A-22-642 mandate layer (individual + large group only — NOT
     small group), which lives in the prose guide, not in these VOB
     layers.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, VobContact } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, March 2026 — fetched and parsed this pass. Row-level extraction: "01324 MEDICAID UTAH" (Eligibility: Yes, Claim Status: No); "00001 Aetna", "00004 Cigna", "00192 United Healthcare", "UHG007 United Healthcare - Optum Behavioral Solutions" (all Elig/Claim: Yes).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — fetched and parsed this pass; the copy itself carries an "As of 08/08/2012" footer on every page. No "MEDICAID - UT" / Utah Medicaid row exists in this 2012 snapshot (Utah Medicaid EDI predates or postdates it differently), so the Availity ID for Utah Medicaid is left unverified. Commercial rows confirmed present: "60054 AETNA", "62308 CIGNA", "87726 UNITED HEALTHCARE".',
  true
);
const UT_PRISM_COMPANION_GUIDE = src(
  'https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/EE-Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20Companion%20(270,%20271)%20SFY25.pdf',
  'Utah Medicaid 270/271 Companion Guide (SFY25, "July 2024 005010_270/271", 46pp) — fetched and text-extracted this pass. Managed-care (ACO) plan is reported by ORGANIZATION NAME (NM103) in Loop 2120C (Subscriber Benefit Related Entity Name), NM1 segment — there is NO numeric carrier-code table in the guide. Capitated/managed-care status is flagged in Loop 2110C EB01="3" (Active - Services Capitated); FFS = EB01 "1" (Active Coverage). Both real-time (<=20s) and batch supported; inquiry DTP03 accepts a single date or a date range not to exceed 3 months; benefit issuance is monthly. Utah Medicaid "does not return eligibility at the Procedure Code level" (default STC "30"), so the 271 does NOT surface that ABA specifically bills FFS — the carve-out is applied from policy, not read off the 271. Trading-partner receiver ID (ISA08): HT000004-001 = FFS (ABA), -002 = MCO, -801 = atypical providers; connectivity via UHIN (qualifier "ZZ").'
);
const UT_PRISM_FEE_CSV = src(
  'https://health.utah.gov/stplan/lookup/output_csv.php',
  'PRISM Coverage & Reimbursement fee-schedule CSV export (POST: download_type=general, pac_code=166 [Applied Behavioral Analyst], plan_type=Traditional, service_date=07/01/2026) — fetched and parsed this pass; the authoritative current source for Utah ABA rates/PA/coverage. Every ABA row shows EffectiveStartDate 07/01/2026, UpdateOn 06/12/2026. Confirmed: 97151 $37.51 (PA No), 97153 $19.67 (PA Yes), 97154 $13.91 (PA Yes), 97155 $37.51 (PA Yes, HP/HO/HN), 97156 $37.51 (PA Yes), H0032 $37.51 (PA Yes); 97157 & 97158 flagged "Covered" but priced $0.00 (last effective 7/1/2022 — non-reimbursing at present); 97152, 0362T, 0373T = Not Covered.'
);
const UT_PRISM_LOOKUP = src(
  'https://health.utah.gov/stplan/lookup/CoverageLookup.php',
  'PRISM Coverage and Reimbursement Lookup (PAC 166) — 97151 shows "Prior Authorization Required? No"; ages 1+ with adult plans included. The interactive lookup POST returns only the empty form (session/JS-gated); authoritative rate/coverage data was obtained via the fee-schedule CSV export (see UT_PRISM_FEE_CSV).'
);
const UT_ASD_MANUAL = src(
  'https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder.pdf',
  'Utah Medicaid Provider Manual — Autism Spectrum Disorder Services (updated January 2026): ABA requires PA except initial/ongoing behavior-identification assessments; treatment PA in 26-week periods via PRISM with a 10-business-day grace to submit; technicians must be fully certified before serving any member; QHP supervises >=10% of technician direct-service time (>=50% of it direct). The live PDF returned unreadable binary to previous fetchers; facts carried from the already-verified corpus prose.',
  true
);
const UT_ASD_MANUAL_ARCHIVE = src(
  'https://web.archive.org/web/20240821082018/https://medicaid.utah.gov/Documents/manuals/pdfs/Medicaid%20Provider%20Manuals/Autism%20Spectrum%20Disorder%20Services/AutismSpectrumDisorder7-23.pdf',
  'Utah Medicaid ASD Services provider manual, July 2023 edition (Wayback archive) — corroborating copy for the PA/assessment/supervision mechanics where the current PDF is unreadable.',
  true
);
const UT_SPA_25_0007 = src(
  'https://web.archive.org/web/20260217123605/https://www.medicaid.gov/medicaid/spa/downloads/UT-25-0007.pdf',
  'SPA UT-25-0007 — Utah Medicaid 4.19-B fee schedule including ASD services (Wayback archive). Corroborates the PRISM rate set.',
  true
);
const UT_MIB_JULY2026 = src(
  'https://web.archive.org/web/20260717062915/https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid+Information+Bulletins/Traditional+Medicaid+Program/2026/July2026-MIB.pdf',
  'July 2026 Medicaid Information Bulletin (Wayback archive) — item 26-83 reconfirms group codes require group-size modifiers (UN/UP/UQ/UR/US) or claims deny; item 26-61 reclassifies ABA providers as High Risk for enrollment screening (revalidation + fingerprinting phased from Sept 2026).'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025) — fetched and parsed this pass; states verbatim "Use Evernorth payer ID 62308" for ABA/autism claims submitted through Cigna\'s EDI vendors, confirming ABA rides the SAME payer ID as Cigna medical (no separate Evernorth EDI hop).'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — all 10 CPT codes medically necessary when criteria met; no PA on assessment codes 97151/97152/0362T; only Virginia is carved out (Utah fully subject); pure clinical-necessity policy, no unit caps, POS codes, or modifiers.'
);
const AETNA_CPB0554 = src(
  'https://www.aetna.com/cpb/medical/data/500_599/0554.html',
  'Aetna CPB 0554 (Applied Behavior Analysis) — cross-references CPB 0648 for ASD coverage; no ABA coding/reimbursement mechanics published.'
);
const AETNA_CPB0648 = src(
  'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
  'Aetna CPB 0648 (Autism Spectrum Disorders) — 97151-97158 covered if selection criteria met; no unit caps, POS codes, telehealth modifiers, or licensure-tier modifiers given; no Utah entry.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — clinical-necessity criteria (ICD-10 F84.0 only); contains zero CPT codes; points to a separate Optum ABA Reimbursement Policy for coding detail. Utah has no entry in Optum\'s ABA State Mandates supplemental criteria (Jan 2026 edition lists 14 states, Utah not among them).'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Utah-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS or telehealth modifier given. Applied to the Utah guide as 'inferred' absent a confirmed Utah-specific override."
);

/* -------------------- Layer 7 vobContact source refs -------------------- */

const UT_MEDICAID_CONTACT_PROVIDERS = src(
  'https://medicaid.utah.gov/contact-information-providers/',
  'Utah Medicaid "Contact Information for Providers" page — fetched this pass. Prior Authorization line: "(801) 538-6155" (Salt Lake City area / all other states), toll-free "(800) 662-9651" (UT, ID, WY, CO, NM, AZ, NV); hours "Monday, Wednesday, Thursday, Friday 8am-5pm; Tuesday 11am-5pm"; phone-menu path "option 3, 3, then appropriate program." Also lists a general claims-inquiry line (800) 662-9651 (ANSI 276/277), an eligibility line 1-866-435-7414, and a general-inquiries line 1-866-608-9422 — none of these are ABA/ASD-program-specific, and no fax number is published on this page.'
);
const UT_PRISM_PORTAL_ACCESS = src(
  'https://medicaid.utah.gov/accessing-prism/',
  'Utah Medicaid "Accessing PRISM" page — fetched this pass; confirms the live PRISM provider portal URL is "https://prism.health.utah.gov/" (MFA required since 4/1/2021). Re-enrollment requests: "(801) 538-6155, or toll-free 1-800-662-9651"; general inquiries 1-866-608-9422; eligibility questions 1-866-435-7414.'
);
const AETNA_PRECERT_PAGE = src(
  'https://www.aetna.com/health-care-professionals/precertification.html',
  'Aetna "Precertification" page for health care professionals — fetched this pass. States precertification may be submitted "by electronic data interchange (EDI), through our secure provider website or by phone, using the number on the member\'s ID card," and links the Availity provider portal under "For Aetna providers." No fixed provider-services phone/fax number or published hours exist on this page — the phone channel is deliberately member-ID-card-specific (varies by plan), so providerServicesPhone is not populated for Aetna here.'
);
const CIGNA_PRECERT_PAGE = src(
  'https://www.cigna.com/health-care-providers/coverage-and-claims/precertification',
  'Cigna "Precertifications and Prior Authorizations" page — fetched this pass. Behavioral health precertification line: "1 (800) 926-2273" (listed for inpatient/partial-hospitalization programs; general medical precert is a separate "1 (800) 882-4462" / fax "1 (866) 873-8279," not behavioral-specific, so not carried into this guide as an ABA fax number).'
);
const EVERNORTH_BH_PROVIDER_SERVICES = src(
  'https://static.evernorth.com/assets/evernorth/provider/resourceLibrary/behavioralResources/doingBusinessWithUs/cbhProviderServiceCenter.html',
  'Evernorth Behavioral Health "Provider Service Center" page — fetched this pass; independently confirms the same Provider Advocate team line, "1.800.926.2273" (National Care Center, Bloomington MN), as the behavioral-health provider-services number. No fax number or specific hours are published on this page.'
);
const CIGNA_FOR_HCP_PORTAL = src(
  'https://www.cigna.com/health-care-providers/cigna-for-hcp-online-portal-features',
  'Cigna "CignaforHCP Online Portal Features" page — fetched this pass; confirms the provider-portal login URL as "https://cignaforhcp.cigna.com/app/login" ("Log in to CignaforHCP").'
);
const OPTUM_PROVIDER_EXPRESS_CONTACT = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/contact-us.html',
  'Optum "Provider Express — Contact Us" page — fetched this pass. Provider Services: "1-877-614-0484," Mon-Fri 7am-7pm CT (scope: credentialing, contracting, network status, provider demographics — not itself an ABA/PA line). Provider Express secure-portal technical support: "1-866-209-9320," same hours. No dedicated ABA/behavioral-health prior-authorization phone or fax number is published on this page; PA is submitted via the Provider Express secure portal or the number on the member\'s ID card.'
);

/* -------------------- select-health-utah source refs (closing sweep, 2026-07-23) -------------------- */

const SELECTHEALTH_MEDICAID_SUMMARY = src(
  'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/programs/government/medicaid-provider-summary.pdf',
  "Select Health — Medicaid Provider Summary; already cited in src/data/payers/utah.ts — describes SelectHealth Community Care as one of Select Health's government/managed products, 'available to eligible members living in all Utah counties.'"
);
const SELECTHEALTH_PRM = src(
  'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/Reference%20Manuals/prm-comm-govt.pdf',
  "Select Health — Provider Reference Manual (Commercial & Government), Appendix B; already cited in utah.ts — states 'Select Health Community Care policies typically align with State of Utah Medicaid policy' and defines a 'Fee-For-Service Medicaid member' as anyone whose needed service is covered by Medicaid rather than the ACO plan — the same carve-out mechanism documented for all four Utah ACOs in the utah-medicaid VOB entry above. Does not explicitly name ABA/autism services on its carved-out-services list (mental-health medications, emergency transportation, LTC, apnea monitors, dental) — the FFS routing is inherited from Utah Medicaid's own carve-out policy, not a Select-Health-authored statement."
);
const SELECTHEALTH_POLICY_UPDATE_0226 = src(
  'https://selecthealth.org/providers/policies/policy-update-bulletins/policy-update-0226',
  "Select Health — Policy Update Bulletin, February 2026; already cited in utah.ts — confirms Policy #630 ('Applied Behavior Analysis (ABA)') was revised effective 1/1/2026 (reorganized medical-necessity criteria, removed an FEHB-plan exception). The policy PDF itself returned a maintenance error at every attempt this pass — specific diagnostic/hour-based criteria remain unverified pending direct confirmation."
);
const SELECTHEALTH_ABA_PREAUTH_FORM = src(
  'https://selecthealth.org/content/dam/selecthealth/Provider/PDFs/forms/sh-aba-pre-auth-form.pdf',
  "Select Health — ABA Preauthorization Form (2026); already cited in utah.ts — distinguishes an initial request (diagnostic evaluation report required) from a concurrent/continuation request (updated treatment plan with progress data required); routes by line of business via email: commercial to commercialUMintake@imail.org (fax 801-442-0825), Community Care (Medicaid/CHIP) to medicaidUMintake@imail.org (fax 801-442-0625) — relevant only for the non-ABA services Community Care still administers, since ABA itself routes to Utah Medicaid — Medicare to medicareUMintake@imail.org (fax 801-442-0302); 14-day decision window across all states. No numeric unit cap, POS code, or modifier is specified on the form itself."
);
const SELECTHEALTH_PREAUTH_FORMS_PAGE = src(
  'https://selecthealth.org/providers/preauthorization/forms-reports',
  "Select Health — Preauthorization Forms & Reports page; already cited in utah.ts — names the online 'Preauth & Care Plan Tool' (some requests auto-approve) and a general 24/7 preauthorization help desk, 800-442-4566; general commercial provider support runs through 800-222-6358."
);
const SELECTHEALTH_PAYER_ID_LIST = src(
  'https://www.selecthealth.org/content/dam/selecthealth/Provider/PDFs/claims/payer-id-list.pdf',
  'Select Health Payer ID List (effective 5/11/2026) — a WebSearch summary of this document this pass reported Availity (Basic software, through UHIN) as HT006873-001 and Availity (Advanced software) professional payer ID as SX107; a direct WebFetch of the PDF returned only compressed/encoded content and could not independently re-derive these values from readable text. Corroborated by a second, independent source (thepracticebridge.com\'s payer-ID finder, which separately lists "Select Health of Utah | Payer ID: SX107" for professional/institutional claims) — two-source agreement, but neither read directly from primary-document text this pass, so shipped as inferred rather than verified.',
  true
);
const UT_31A_22_642_CURRENT = src(
  'https://le.utah.gov/xcode/Title31A/Chapter22/C31A-22-S642_2026050620260506.html',
  'Utah Code Section 31A-22-642 (current, eff. 5/6/2026); already cited in src/data/payers/utah.ts — the state autism mandate governing individual and large-group commercial plans (not small-group, not Medicaid).'
);

/* -------------------- Utah Medicaid (ASD FFS) codeGrid -------------------- */

interface UtEntryOpts {
  covered?: string;
  paRequired: string;
  paStatus?: 'verified' | 'inferred' | 'unverified';
  unitCap: string;
  unitCapStatus?: 'verified' | 'inferred' | 'unverified';
  capPeriod: string;
  telehealth: string;
  telehealthStatus?: 'verified' | 'inferred' | 'unverified';
  modifiers: string[];
  notes: string;
  sources: SourceRef[];
}

function utEntry(o: UtEntryOpts): CodeGridEntry {
  return {
    covered: o.covered ?? 'Yes',
    paRequired: o.paRequired,
    unitCap: o.unitCap,
    capPeriod: o.capPeriod,
    posAllowed: ['home', 'clinic', 'community', 'school (school-based ABA on an IEP routes to the School-Based Skills Development benefit, not FFS)', 'telehealth (per code — see telehealth)'],
    telehealth: o.telehealth,
    modifiers: o.modifiers,
    notes: o.notes,
    fieldStatus: {
      covered: 'verified',
      paRequired: o.paStatus ?? 'verified',
      unitCap: o.unitCapStatus ?? 'verified',
      capPeriod: o.unitCapStatus ?? 'verified',
      posAllowed: 'verified',
      telehealth: o.telehealthStatus ?? 'verified',
      modifiers: o.modifiers.length ? 'verified' : 'unverified',
    },
    sources: o.sources,
  };
}

function utNotCoveredEntry(note: string): CodeGridEntry {
  return {
    covered: 'No — Not Covered on the Utah Medicaid fee schedule (PRISM PAC 166)',
    paRequired: 'N/A',
    unitCap: 'N/A',
    capPeriod: 'N/A',
    posAllowed: [],
    telehealth: 'N/A',
    modifiers: [],
    notes: note,
    fieldStatus: { covered: 'verified' },
    sources: [UT_PRISM_FEE_CSV],
  };
}

const utahMedicaidCodeGrid: Record<string, CodeGridEntry> = {
  '97151': utEntry({
    paRequired: 'NOT required — behavior-identification assessments are exempt from PA (PRISM CSV: PA=No).',
    unitCap: '1 assessment per 26 weeks, up to 24 units; reassessment roughly every 6 months',
    capPeriod: '26 weeks',
    telehealth: 'unverified for the assessment specifically — the manual permits telehealth for supervision and parent training but excludes technician-delivered direct treatment; assessment telehealth eligibility not restated in retrievable sources.',
    telehealthStatus: 'unverified',
    modifiers: [],
    notes: 'Behavior-identification assessment (professional). Pays $37.51/15-min unit (see rates). No PA means intake can book and bill the assessment immediately with a diagnosis in hand.',
    sources: [UT_PRISM_FEE_CSV, UT_PRISM_LOOKUP, UT_ASD_MANUAL, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97153': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM; 10-business-day grace to submit after starting services.',
    unitCap: 'Up to 780 hours (3,120 units) per 26 weeks (30 hours/week)',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — technician-delivered 97153 must be in person (telehealth excluded for technician-delivered 97153/97154 and group 97158).',
    modifiers: [],
    notes: 'Technician-delivered direct treatment — the volume code. Pays $19.67/15-min unit (see rates). Overage above the max allowed units goes to secondary medical review.',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97154': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '52 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — group technician-delivered treatment must be in person.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ (per MIB item 26-83) or the claim denies'],
    notes: 'Group adaptive behavior treatment (technician-delivered). Pays $13.91/15-min unit (see rates). Group-size modifier is mandatory.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97155': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Supervision (97155 + H0032) capped at 84 combined hours (336 units) per 26 weeks; >=50% must be direct supervision; overage via secondary review',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — supervision may be delivered via synchronous two-way audio/video.',
    modifiers: ['HP (psychologist/BCBA-D)', 'HO (BCBA)', 'HN (BCaBA/analyst-in-training)'],
    notes: 'QHP protocol-modification / supervision code. Pays $37.51/15-min unit across credential tiers (single published rate; HP/HO/HN are reporting modifiers, not rate tiers — see rates). QHP must supervise >=10% of technician direct-service time, >=50% of it direct.',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97156': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Recommended minimum 3 episodes per 26 weeks (up to 4 units/episode)',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — family/parent training may be delivered via synchronous two-way audio/video.',
    modifiers: [],
    notes: 'Family adaptive-behavior guidance (parent training). Pays $37.51/15-min unit (see rates).',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97157': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '3 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — multiple-family group guidance may be delivered via synchronous two-way audio/video.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ or the claim denies'],
    notes: 'Multiple-family group guidance. Flagged "Covered" on PRISM but priced $0.00 (rate last effective 7/1/2022 — NON-REIMBURSING at present; see rates). Confirm current reimbursement before relying on this code.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97158': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: '26 episodes per 26 weeks',
    capPeriod: '26 weeks',
    telehealth: 'NOT allowed — group treatment with protocol modification must be in person.',
    modifiers: ['Group-size modifier required: UN=2 / UP=3 / UQ=4 / UR=5 / US=6+ or the claim denies'],
    notes: 'Group adaptive behavior treatment with protocol modification. Flagged "Covered" on PRISM but priced $0.00 (rate last effective 7/1/2022 — NON-REIMBURSING at present; see rates). Confirm current reimbursement before relying on this code.',
    sources: [UT_PRISM_FEE_CSV, UT_MIB_JULY2026, UT_ASD_MANUAL_ARCHIVE],
  }),
  'H0032': utEntry({
    paRequired: 'Required — PA in 26-week periods via PRISM.',
    unitCap: 'Counts toward the 84 combined supervision hours (336 units) per 26 weeks (with 97155)',
    capPeriod: '26 weeks',
    telehealth: 'Allowed — treatment-planning/supervision activity may be delivered via synchronous two-way audio/video.',
    modifiers: [],
    notes: 'MH service-plan development (indirect supervision) code used alongside 97155; shares the 84-hour supervision cap. Pays $37.51/15-min unit (see rates).',
    sources: [UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
  }),
  '97152': utNotCoveredEntry(
    'Behavior-identification assessment BY A TECHNICIAN — Not Covered by Utah Medicaid (only the professional 97151 assessment is billable). Verified from the PRISM PAC-166 fee-schedule export.'
  ),
  '0362T': utNotCoveredEntry(
    'Not Covered by Utah Medicaid (last coverage-relevant date 7/1/2021; a $16.41 rate is listed but the code is flagged Not Covered). Utah bills the Category-I CPT set, not the legacy Category-III codes.'
  ),
  '0373T': utNotCoveredEntry(
    'Not Covered by Utah Medicaid (last coverage-relevant date 7/1/2021; a $16.41 rate is listed but the code is flagged Not Covered).'
  ),
};

const utahMedicaidRates: RateTable = {
  source:
    'PRISM Coverage & Reimbursement fee-schedule CSV export (PAC 166, plan_type=Traditional), effective 7/1/2026 (every ABA row: EffectiveStartDate 07/01/2026, UpdateOn 06/12/2026) — fetched and parsed this pass; the authoritative current source. Single published rate per code; 97155 carries credential-reporting modifiers (HP/HO/HN) but one published rate across tiers. SPA UT-25-0007 was retrieved (Wayback) but its packet contains only the 4.19-B cover + CMS approval pages, not the ABA dollar table, so dollar confirmation is from the live PRISM export. NOTE: 97157 and 97158 are flagged "Covered" but priced $0.00 (rates last effective 7/1/2022) — non-reimbursing at present.',
  effectiveDate: '2026-07-01',
  byCode: {
    '97151': { rate: '$37.51 per 15-min unit', unit: '15min' },
    '97153': { rate: '$19.67 per 15-min unit', unit: '15min' },
    '97154': { rate: '$13.91 per 15-min unit (group, technician-delivered)', unit: '15min' },
    '97155': { rate: '$37.51 per 15-min unit (single rate across HP/HO/HN credential-reporting modifiers)', unit: '15min', modifierTiers: { HP: '$37.51 (psychologist/BCBA-D)', HO: '$37.51 (BCBA)', HN: '$37.51 (BCaBA/analyst-in-training)' } },
    '97156': { rate: '$37.51 per 15-min unit', unit: '15min' },
    '97157': { rate: '$0.00 — flagged Covered but priced $0.00 (rate last effective 7/1/2022; non-reimbursing at present)', unit: '15min' },
    '97158': { rate: '$0.00 — flagged Covered but priced $0.00 (rate last effective 7/1/2022; non-reimbursing at present)', unit: '15min' },
    'H0032': { rate: '$37.51 per 15-min unit', unit: '15min' },
  },
  sources: [UT_PRISM_FEE_CSV, UT_SPA_25_0007],
};

const utahMedicaidEdi: EdiRouting = {
  payerId: { pverify: '01324', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'none — ABA is carved out of all four ACOs and the PMHPs to state FFS; the ACO/PMHP handles only ASD-related PT/OT/ST and MH/SUD. Claims go to Utah Medicaid (PRISM) on the medical FFS line.',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation: 'Loop 2120C (Subscriber Benefit Related Entity Name), NM1 segment — the related MCO Plan is reported here by ORGANIZATION NAME (NM103), not a carrier code. Managed-care/capitated status is flagged in Loop 2110C EB01="3" (Active - Services Capitated); FFS = EB01 "1" (Active Coverage).',
    mcoCarrierCodes: {},
    eligibilitySpanGranularity: 'Real-time (response <=20s) and batch; inquiry DTP03 accepts a single date or a date range not to exceed 3 months (up to 3 years retro); benefit issuance is monthly, out-of-pocket frequency quarterly. Utah Medicaid does NOT return eligibility at the procedure-code level (default STC "30"), so the 271 does not surface that ABA specifically bills FFS — the carve-out is applied from policy, not read off the 271.',
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      'pVerify lists TWO Utah Medicaid FFS entries — "00672 Utah Medicaid" (Elig: Yes, Claim: No) and "01324 MEDICAID UTAH" (Elig: Yes). 01324 is used here; confirm with pVerify which is the live real-time 270/271 payer for FFS before automating.',
    'payerId.availity':
      'No "MEDICAID - UT" / Utah Medicaid row exists in the fetched Availity list (which carries an "As of 08/08/2012" footer); the only Utah hit is an unrelated MA plan — confirm the current Availity ID via the login-gated Availity Essentials portal search.',
    'payerId.changeHealthcare':
      'No Change Healthcare-specific source was retrievable this pass — confirm via the Optum/Change Healthcare payer finder. The commonly-cited "SKUT0" is a clearinghouse-side routing alias, NOT the PRISM identifier; the companion guide\'s actual trading-partner receiver ID (ISA08) is HT000004-001 for FFS (the ABA line), via UHIN.',
    'medicaid271Notes.mcoCarrierCodes': 'By design there is NO numeric carrier-code table in the Utah 270/271 companion guide — the ACO/MCO is identified by organization name (NM103) in loop 2120C. (Utah ACOs: Health Choice Utah, Healthy U, Molina Healthcare of Utah, SelectHealth Community Care; PMHPs include United Behavioral Health.) Because ABA is a statewide FFS carve-out, an ACO/PMHP appearing on the 271 does NOT redirect ABA — all PAs go to Utah Medicaid FFS regardless.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UT_PRISM_COMPANION_GUIDE, UT_PRISM_FEE_CSV, UT_ASD_MANUAL_ARCHIVE],
};

const utahMedicaidContact: VobContact = {
  providerServicesPhone: '(801) 538-6155 (toll-free 1-800-662-9651 from UT/ID/WY/CO/NM/AZ/NV)',
  hours: 'Mon, Wed, Thu, Fri 8:00am-5:00pm MT; Tue 11:00am-5:00pm MT',
  ivrPath: 'Phone menu: option 3, then 3, then select the appropriate program (per the Prior Authorization line on the provider contact page).',
  portal: { name: 'PRISM', url: 'https://prism.health.utah.gov/' },
  scriptedQuestions: [
    'Can the initial 97151 behavior-identification assessment be delivered via telehealth, or does it require an in-person visit?',
  ],
  sources: [UT_MEDICAID_CONTACT_PROVIDERS, UT_PRISM_PORTAL_ACCESS],
};

/* -------------------- commercial codeGrid factories (national policy) -------------------- */

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
      'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy could be located. Utah-specific layer is the Utah Code 31A-22-642 mandate (individual + large group only — NOT small group), which governs limits, not coding mechanics.',
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

function cignaEntry(paRequired: string, paStatus: 'verified' | 'unverified' = 'verified', extraNote = ''): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired,
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics are published in it. Utah is fully subject to EN0499 (only Virginia is carved out), so the no-assessment-PA fast path holds.' + extraNote,
    fieldStatus: {
      covered: 'verified',
      paRequired: paStatus,
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
    paRequired: 'Required — Optum ABA two-step authorization via Provider Express (assessment, then treatment); continued-service reviews every 4-6 months per the corpus prose (cadence not restated in the cited SCC).',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — the Optum Supplemental Clinical Criteria contains no CPT codes at all; applied here absent a confirmed Utah-specific override. Utah has no entry in Optum's ABA State Mandates supplemental criteria (Jan 2026). Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'inferred',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY],
  };
}

/* ==================== aetna-utah (commercial) ==================== */

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
      'Availity "60054 AETNA" is confirmed present but the fetched Availity list carries an "As of 08/08/2012" footer — inferred pending reconfirmation against a current Availity export.',
    'payerId.changeHealthcare': 'Carried from the same 2012 Availity snapshot as the medical payer ID; confirm via the Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administrator':
      'Not researched to a primary source this pass — confirm via Aetna provider services / ABA precertification whether Aetna administers ABA in-house or via a separate behavioral-health carve-out for Utah. Aetna holds no Utah Medicaid ACO contract, so there is no Medicaid line to confuse an Aetna card with.',
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

const aetnaContact: VobContact = {
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'Does this ABA claim require precertification, and if so what form or process do you use for it?',
    'Are there daily, weekly, or annual unit/hour caps on the treatment codes (97153-97158)?',
    'What place-of-service settings are allowed for ABA — home, clinic, school, telehealth?',
    'Is telehealth allowed for any of the ABA codes, and if so which ones?',
    'Does Aetna administer ABA/behavioral health benefits in-house, or through a separate behavioral-health carve-out for this plan?',
    'Are licensure-tier modifiers (e.g., HN/HO/HM/HP) required on claims, and if so which apply to which codes?',
  ],
  sources: [AETNA_PRECERT_PAGE, AVAILITY_PAYER_LIST],
};

/* ==================== cigna-utah (commercial) ==================== */

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
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_RESOURCE_GUIDE],
};

const cignaCodeGrid: Record<string, CodeGridEntry> = {
  '97151': cignaEntry('Not required (per EN0499)', 'unverified', ' QA verify (2026-07-23): EN0499 as fetched publishes only medical-necessity criteria and contains no \'prior authorization\'/\'precertification\' language and no statement exempting assessment codes from PA, so this \'Not required\' value is downgraded from verified to unverified pending confirmation via Cigna/Evernorth precertification lists.'),
  '97152': cignaEntry('Not required (per EN0499)', 'unverified', ' QA verify (2026-07-23): EN0499 as fetched publishes only medical-necessity criteria and contains no \'prior authorization\'/\'precertification\' language and no statement exempting assessment codes from PA, so this \'Not required\' value is downgraded from verified to unverified pending confirmation via Cigna/Evernorth precertification lists.'),
  '97153': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97154': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97155': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97156': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97157': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '97158': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
  '0362T': cignaEntry('Not required (per EN0499)', 'unverified', ' QA verify (2026-07-23): EN0499 as fetched publishes only medical-necessity criteria and contains no \'prior authorization\'/\'precertification\' language and no statement exempting assessment codes from PA, so this \'Not required\' value is downgraded from verified to unverified pending confirmation via Cigna/Evernorth precertification lists.'),
  '0373T': cignaEntry('Required — assessment + treatment plan with the ABA PA form (EN0499)'),
};

const cignaContact: VobContact = {
  providerServicesPhone: '1 (800) 926-2273 (Evernorth Behavioral Health Provider Advocate team / National Care Center)',
  portal: { name: 'CignaforHCP', url: 'https://cignaforhcp.cigna.com/app/login' },
  scriptedQuestions: [
    'Are there unit or hour caps on the treatment codes (97153-97158), and if so what are they?',
    'What place-of-service settings are allowed for ABA — home, clinic, school, telehealth?',
    'Is telehealth allowed for any of the ABA codes, and if so which ones?',
    'Are licensure-tier modifiers required on claims, and if so which apply to which codes?',
  ],
  sources: [EVERNORTH_BH_PROVIDER_SERVICES, CIGNA_PRECERT_PAGE, CIGNA_FOR_HCP_PORTAL],
};

/* ==================== unitedhealthcare-utah (commercial) ==================== */

const unitedhealthcareEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: '87726' },
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
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.availity':
      'Availity "87726 UNITED HEALTHCARE" is confirmed present but the fetched Availity list carries an "As of 08/08/2012" footer — inferred pending reconfirmation against a current Availity export.',
    'payerId.changeHealthcare': 'Carried from the same 2012 Availity snapshot; confirm via the Optum/Change Healthcare payer finder.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      'Provider Express / UHC provider services — pVerify lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" alongside the "00192 United Healthcare" medical entry; not resolved whether commercial Utah ABA rides the 87726 medical ID or routes to Optum Behavioral. UHC holds no Utah Medicaid ACO contract.',
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_SCC],
};

const unitedhealthcareCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcEntry('32 units/day (<=8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcEntry('32 units/day (<=8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcEntry('18 units/day (<=4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcEntry('24 units/day (<=6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcEntry('16 units/day (<=4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcEntry('16 units/day (<=4 hrs)', []),
  '0373T': uhcEntry('32 units/day (<=8 hrs)', []),
};

const unitedhealthcareContact: VobContact = {
  providerServicesPhone: '1-877-614-0484 (Provider Services — credentialing, contracting, network status, provider demographics)',
  hours: 'Mon-Fri 7:00am-7:00pm CT',
  ivrPath: 'This line covers credentialing/contracting/demographics, not ABA authorization status directly; for PA status use the Provider Express portal or the number on the back of the member\'s ID card (portal technical support: 1-866-209-9320, same hours).',
  portal: { name: 'Provider Express', url: 'https://public.providerexpress.com/' },
  scriptedQuestions: [
    'Does ABA route through Optum Behavioral Health, or directly through UnitedHealthcare medical benefits for this plan?',
    'What place-of-service settings are allowed for ABA billing — home, clinic, school, telehealth?',
    'Is telehealth allowed for any of the ABA codes, and if so which ones?',
    'Do the published daily unit caps apply to this specific plan, or are they plan-dependent?',
    'Which credential-tier modifiers (HN/HM/HO/HP) does this plan require, and do they match the standard national tiers?',
  ],
  sources: [OPTUM_PROVIDER_EXPRESS_CONTACT, OPTUM_SCC],
};

/* ==================== select-health-utah (closing sweep) ====================
   Two products under one guide, per the base guide's own prose: SelectHealth
   Community Care (a Utah Medicaid ACO) carves ABA out to Utah Medicaid FFS
   entirely — identical to every other UT ACO already documented in
   utahMedicaidEdi above — while Select Health's commercial line
   (employer/individual) runs its OWN clinical policy (#630) and its own ABA
   Preauthorization Form. edi/codeGrid below describe the commercial line,
   since that is the line Select Health actually administers ABA on; the
   Community Care line's ABA eligibility/PA answer is utah-medicaid's own
   entry (payerId.pverify 01324) — flagged explicitly in verifyVia rather
   than duplicated here as if Select Health had a second, redundant Medicaid
   ABA process of its own. */

const selectHealthUtahEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'SX107 (Availity Advanced) / HT006873-001 (Availity Basic, via UHIN)', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator:
      "For Community Care (Medicaid) members: none via Select Health — ABA is carved out entirely to Utah Medicaid FFS, identical to Utah's other three ACOs (see utah-medicaid above); Select Health does not administer or adjudicate ABA for these members at all. For commercial members: Select Health administers ABA in-house under its own Policy #630 — no third-party BH vendor named.",
    administratorPayerId: 'N/A (Community Care) / unverified (commercial)',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'No pVerify entry for "Select Health" or "SelectHealth Community Care" was independently confirmed this pass — confirm via pVerify onboarding.',
    'payerId.availity':
      'SX107/HT006873-001 come from a WebSearch summary of Select Health\'s own Payer ID List PDF, corroborated by a second independent source (thepracticebridge.com), but neither was read directly from readable primary-document text this pass — treat as inferred, not verified. IMPORTANT: for a Community Care (Medicaid) member, do NOT use this ID for an ABA eligibility check — route to utah-medicaid\'s own entry (pVerify 01324) instead, since ABA is carved out to state FFS entirely and Select Health never adjudicates it for these members.',
    'payerId.changeHealthcare': 'Not checked against a dedicated Optum/Change Healthcare payer directory this pass.',
    supportsRealtime: 'Confirm real-time vs. batch via UHIN/Availity onboarding for this payer ID.',
  },
  sources: [SELECTHEALTH_MEDICAID_SUMMARY, SELECTHEALTH_PRM, SELECTHEALTH_PAYER_ID_LIST, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

function selectHealthCommercialEntry(): CodeGridEntry {
  return {
    covered: 'Yes — commercial members only, under Select Health\'s own Policy #630 ("Applied Behavior Analysis (ABA)," revised eff. 1/1/2026). NOT applicable to Community Care (Medicaid) members — see utah-medicaid\'s codeGrid instead; ABA never touches Select Health for those members.',
    paRequired:
      'Required — Select Health\'s own ABA Preauthorization Form: an initial request needs a diagnostic evaluation report; a concurrent/continuation request needs an updated treatment plan with progress data. Decisions on Utah commercial plans are due within 14 days absent expedited review.',
    unitCap: 'unverified — Policy #630\'s specific medical-necessity/hour criteria could not be retrieved this pass (the policy PDF returned a maintenance error at every attempt); the Preauthorization Form itself gives no numeric unit cap.',
    capPeriod: 'unverified',
    posAllowed: ['office', 'home', 'other (per the Preauthorization Form\'s weekly-schedule field — no CMS POS numbers given)'],
    telehealth: 'unverified — not addressed on the Preauthorization Form or in the retrievable Policy #630 update bulletin.',
    modifiers: ['unverified'],
    notes:
      "Verify via: Select Health commercial UM intake (commercialUMintake@imail.org, fax 801-442-0825) — Policy #630's full medical-necessity criteria were not retrievable this pass; confirm unit caps, POS, and modifiers directly. The Utah Code 31A-22-642 mandate layer (individual + large group only — NOT small group) governs limits for qualifying plans, not coding mechanics.",
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'inferred',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [SELECTHEALTH_POLICY_UPDATE_0226, SELECTHEALTH_ABA_PREAUTH_FORM, UT_31A_22_642_CURRENT],
  };
}

const selectHealthUtahCodeGrid: Record<string, CodeGridEntry> = {
  '97151': selectHealthCommercialEntry(),
  '97152': selectHealthCommercialEntry(),
  '97153': selectHealthCommercialEntry(),
  '97154': selectHealthCommercialEntry(),
  '97155': selectHealthCommercialEntry(),
  '97156': selectHealthCommercialEntry(),
  '97157': selectHealthCommercialEntry(),
  '97158': selectHealthCommercialEntry(),
  '0362T': selectHealthCommercialEntry(),
  '0373T': selectHealthCommercialEntry(),
};

const selectHealthUtahRates: RateTable = {
  source:
    "No Select Health-specific ABA fee schedule (commercial or Community Care) was found published. For Community Care members, ABA rides Utah Medicaid FFS entirely, so utah-medicaid's own published PRISM rates ($19.67/15-min unit on 97153; $37.51 on 97151/97155/97156/H0032, effective 7/1/2026) are the actual reimbursement — not a Select Health rate at all, and not restated here to avoid implying Select Health sets it. For commercial members, rates are contract-negotiated and live in the practice's participating-provider agreement.",
  effectiveDate: 'unverified — no Select Health-specific schedule exists for either product',
  byCode: {
    '97151': { rate: 'unverified — commercial is contract-negotiated; Community Care members bill Utah Medicaid FFS directly (see utah-medicaid: $37.51/unit)', unit: 'unverified' },
    '97153': { rate: 'unverified — commercial is contract-negotiated; Community Care members bill Utah Medicaid FFS directly (see utah-medicaid: $19.67/unit)', unit: 'unverified' },
    '97155': { rate: 'unverified — commercial is contract-negotiated; Community Care members bill Utah Medicaid FFS directly (see utah-medicaid: $37.51/unit)', unit: 'unverified' },
    '97156': { rate: 'unverified — commercial is contract-negotiated; Community Care members bill Utah Medicaid FFS directly (see utah-medicaid: $37.51/unit)', unit: 'unverified' },
  },
  sources: [UT_PRISM_FEE_CSV, SELECTHEALTH_POLICY_UPDATE_0226],
};

const selectHealthUtahContact: VobContact = {
  providerServicesPhone: '800-222-6358 (general commercial provider support) / 800-442-4566 (24/7 preauthorization help desk)',
  fax: '801-442-0825 (commercial UM intake); Community Care (non-ABA services) 801-442-0625',
  portal: { name: 'Select Health Preauth & Care Plan Tool', url: 'https://selecthealth.org/providers/preauthorization/forms-reports' },
  scriptedQuestions: [
    'Confirm which product this family is on — SelectHealth Community Care (Medicaid, routes ABA to Utah Medicaid FFS entirely) vs. Select Health commercial (Policy #630, its own PA process) — since the two have completely different ABA workflows.',
    'For commercial members: what are Policy #630\'s actual unit caps, POS restrictions, and modifier requirements — the policy PDF itself was not retrievable this pass?',
    'For commercial members: what market segment is this plan (individual/large-group vs. small-group/self-funded), since only the first two are protected by the Utah Code 31A-22-642 mandate?',
    'Is telehealth allowed for any ABA codes under the commercial Policy #630, and if so which ones?',
    'What EDI payer ID should be used for a commercial member\'s 270/271 eligibility check — SX107 or HT006873-001 — neither was independently confirmed against readable primary-source text this pass?',
  ],
  sources: [SELECTHEALTH_PREAUTH_FORMS_PAGE, SELECTHEALTH_ABA_PREAUTH_FORM],
};

/* ==================== export ==================== */

export const utahVob: Record<string, VobExtension> = {
  'utah-medicaid': { edi: utahMedicaidEdi, codeGrid: utahMedicaidCodeGrid, rates: utahMedicaidRates, vobContact: utahMedicaidContact, lastUpdated: ACCESS_DATE },
  'aetna-utah': { edi: aetnaEdi, codeGrid: aetnaCodeGrid, vobContact: aetnaContact, lastUpdated: ACCESS_DATE },
  'cigna-utah': { edi: cignaEdi, codeGrid: cignaCodeGrid, vobContact: cignaContact, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-utah': { edi: unitedhealthcareEdi, codeGrid: unitedhealthcareCodeGrid, vobContact: unitedhealthcareContact, lastUpdated: ACCESS_DATE },
  'select-health-utah': {
    edi: selectHealthUtahEdi,
    codeGrid: selectHealthUtahCodeGrid,
    rates: selectHealthUtahRates,
    vobContact: selectHealthUtahContact,
    lastUpdated: ACCESS_DATE,
  },
};
