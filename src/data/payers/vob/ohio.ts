/* ================================================================
   VOB ENRICHMENT — Ohio, Layers 1 (EDI routing crosswalk), 3
   (code-level coverage grid), and 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - HIGH-VALUE FIND: the ODM Next Generation program's Fiscal
     Intermediary (Gainwell Technologies) publishes a 5010 270/271
     companion guide, v13.0 dated 2023-06-30, retrievable directly from
     Ohio's asset CDN (dam.assets.ohio.gov) even though
     managedcare.medicaid.ohio.gov and the ODM companion-guide listing
     page both 404 to automated fetch. It documents the MCO-enrollment
     mechanics for the 271 in full: Loop 2110C EB01='MC' flags MCO
     enrollment, the MCO entity is named in Loop 2120C NM1 (NM101='PR'),
     EB05 carries the coded plan-coverage description, eligibility spans
     are MONTHLY (EB06='34'), and — critically for the OhioRISE landmine
     — the guide carries a FIXED ODM trading-partner code table (ISA06/
     ISA08) plus a 2100A NM109 MCE-payer-ID table that make each MCO,
     including Aetna OhioRISE, separately identifiable on the wire.
     medicaid271Notes on ohio-medicaid ships these as verified.
   - THE OHIORISE LANDMINE: OhioRISE (Aetna) IS separately visible in
     the 271 (trading-partner 0021914 / MCE claims payer ID 60054), but
     per ODM's Mixed Services Protocol OhioRISE NEVER pays ABA — the
     member's medical MCO (or FFS) does, even for OhioRISE-enrolled
     youth. The 271 shows OhioRISE enrollment; the ABA payer is the
     underlying MCO. This is encoded in the notes, not guessed.
   - THE FEE SCHEDULE IS A DRAFT: ODM's ABA fee appendix (per-15-min
     "current maximum payment amount") lives in the rule package
     ERF188422B.pdf, which is stamped "DRAFT - NOT YET FILED" on every
     rule page and moves the fee schedule from 5160-34-02 to a new
     5160-34-03 Appendix A (the draft removes 5160-34-02). It is the
     only published ODM ABA fee document and is what the existing
     ohio.ts prose already quotes — the rates below are transcribed
     verbatim from that draft appendix with the draft status flagged and
     the effective-date column shown as blank, NOT presented as an
     in-force schedule. codes.ohio.gov (in-force OAC 5160-34 text) is
     JS/bot-gated and could not be read this pass.
   - PRICING IS BY PRACTITIONER TIER, NOT MODIFIER: the ODM appendix
     differentiates payment by practitioner-tier descriptor rows
     (Independent Adaptive Services Practitioner = COBA/BCBA/BCBA-D;
     BCaBA; RBT), with NO HN/HO/HM/TG modifier column. Whether ODM
     requires tier modifiers on claims is silent in the document —
     codeGrid modifiers ship accordingly (unverified, described).
   - PER-CODE DAILY CAPS: the in-force/draft state rule sets no per-code
     daily unit cap (only an assessment PA threshold of 10 hrs/180 days
     and a 1:8 group ratio). The per-code CMS NCCI MUE ceilings are
     enumerated verbatim in CareSource's MM-0028 (97151=32, 97152=16,
     97153=32, 97154=18, 97155=24, 97156=16, 97157=16, 97158=16,
     0362T=16, 0373T=32) and are the operative federal daily ceiling —
     applied as 'verified' on the CareSource guide and 'inferred'
     elsewhere, with the state's own silence noted on ohio-medicaid.
   - BOT-BLOCK RETRIES: AmeriHealth Caritas Ohio's and Molina Ohio's
     provider pages, reported blocked in the original compile, are NOT
     currently blocked — both loaded this pass (AmeriHealth Caritas
     confirms ABA needs PA; Molina's page is member-facing with no
     code/EDI detail). Optum's Ohio Medicaid LOCG PDF and Anthem's
     CG-BEH-02 asset are JS-gated / not-locatable to automated fetch —
     those plans' per-code detail ships 'inferred'/'unverified' with a
     verifyVia, per "never guess."
   - The 3 commercial guides (aetna-ohio, cigna-ohio,
     unitedhealthcare-ohio) get Layers 1 + 3 only, per the build spec
     ("Do not attempt commercial rates"); their code grids reuse the
     already-verified national clinical policies (CPB 0554/0648, EN0499,
     Optum SCC/2022RP501A) as in the Georgia build, with Ohio's autism
     mandate (R.C. 3923.84) noted.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const ODM_COMPANION_GUIDE = src(
  'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Providers/MITS/HIPAA%205010%20Implementation/CompanionGuide/OMES/FFS/Ohio270-271.pdf',
  "ODM / Gainwell Fiscal Intermediary 5010 270/271 Companion Guide, v13.0 dated 2023-06-30 (Gainwell EDI helpdesk OH_FI_EDI_Helpdesk@gainwelltechnologies.com), retrieved directly from Ohio's asset CDN (managedcare.medicaid.ohio.gov and the ODM companion-guide listing page both 404 to automated fetch). §6 (pp.27-28): Loop 2110C EB01='MC' = MCO enrollment; MCO entity named in Loop 2120C NM1 (NM101='PR', name in NM103); EB05='Plan Coverage Description' (coded, per ODM's separate 271 Code Crosswalk). §7 (pp.13-16): fixed ODM trading-partner code table (ISA06/ISA08) + 2100A NM109 MCE-payer-ID table. Eligibility span MONTHLY (EB06='34'); real-time and batch supported."
);
const ODM_RULE_PACKAGE = src(
  'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf',
  'ODM ABA rule package (5160-34-01 providers + 5160-34-03 coverage/reimbursement, with Appendix A fee schedule) — stamped "DRAFT - NOT YET FILED" on every rule page (authoring print date 05/08/2025); the draft removes 5160-34-02. Appendix A "Fee schedule for Applied Behavior Analysis / CURRENT MAXIMUM PAYMENT AMOUNT" prices per 15-min unit by practitioner tier (Independent COBA/BCBA/BCBA-D; BCaBA; RBT) with a BLANK effective-date column and NO billing-modifier column. This is the only published ODM ABA fee document; figures transcribed verbatim with draft status flagged.'
);
const OAC_5160_34_02 = src(
  'https://codes.ohio.gov/ohio-administrative-code/rule-5160-34-02',
  'OAC 5160-34-02 (in-force ABA rule: all-PA framework, DSM-5-TR ASD, 6-month reviews) — cited throughout ohio.ts prose. codes.ohio.gov is JS/bot-gated to automated fetch (returned "no rule number corresponds" this pass); in-force text not independently re-read here, so the current effective date is taken from ohio.ts prose, not reconfirmed against the live code page this pass.'
);
const OHIORISE_MSP = src(
  'https://dam.assets.ohio.gov/image/upload/v1743449666/managedcare.medicaid.ohio.gov/OhioRISE/OhioRISE_Mixed_Services_Protocol_20250401.pdf',
  'ODM OhioRISE Mixed Services Protocol (4/1/2025) — assigns ABA claims (97151-97158, 0362T, 0373T) to the member\'s Medicaid MCO (or FFS) even for OhioRISE-enrolled youth; OhioRISE (Aetna) never pays ABA. Already cited in ohio.ts prose.'
);
const CARESOURCE_MM0028 = src(
  'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf',
  'CareSource OH MCD-MM-0028 (eff. 7/1/2025) — enumerates the CMS MUE daily-unit maxima verbatim for all 10 codes (97151=32, 97152=16, 97153=32, 97154=18, 97155=24, 97156=16, 97157=16, 97158=16, 0362T=16, 0373T=32); the docs-before-claims rule ("claims will not be accepted without accompanying treatment documentation"); telehealth for parent training/supervision and 1:1 ABA when medically necessary; H0036 (CPST) acceptance from certified CBHCs; 6-month reviews; assessments 6-10 hrs/6 months; RBT supervision >=5% of monthly ABA hours.',
  true
);
const CARESOURCE_PA_LIST = src(
  'https://www.caresource.com/documents/ohio-medicaid-prior-authorization-list/',
  'CareSource — Ohio Medicaid prior authorization list.'
);
const BUCKEYE_CP_BH_104 = src(
  'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/policies/clinical-policies/CP.BH.104.pdf',
  'Buckeye (Centene) CP.BH.104 Applied Behavior Analysis (last rev. 2/2026) — treatment <=6 hrs/day and <=30 hrs/wk without justification; <20 hrs/wk for full-time students; 97155 protocol modification >=2 hrs/wk or 10% of direct hours, <=20% unless justified; <80% attendance triggers continuation documentation; full CPT/HCPCS list (97151-97158, 0362T, 0373T). Does NOT state an in-network assessment-PA waiver (that provision, if any, sits on Buckeye\'s separate PA list) and gives no per-code unit caps / POS numbers / telehealth modifiers.'
);
const BUCKEYE_PA_FORM = src(
  'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/WebsitePDFs/BehavioralHealthEducation/Medicaid-ABA-OTR-P-Form-508-6-28-23.pdf',
  'Buckeye — Autism Services Prior Authorization Request Form (treatment 97153-97158); UM (800) 224-1991, fax (866) 694-3649. The in-network assessment-PA waiver referenced in ohio.ts prose is a PA-list fact, not stated in CP.BH.104 — treat as inferred pending the current PA list/pre-auth tool.'
);
const ANTHEM_CUMG = src(
  'https://providers.anthem.com/docs/gpp/OH_CAID_FEB23CUMG.pdf',
  'Anthem OH Medicaid Clinical UM Guidelines list (adopts CG-BEH-02 for adaptive behavioral treatment) — cited in ohio.ts prose. This GPP asset resolved to an embedded-font resource rather than the CG-BEH-02 guideline text this pass; per-code ABA billing detail not independently re-extractable from it.'
);
const ANTHEM_MANUAL = src(
  'https://providers.anthem.com/docs/gpp/OH_CAID_ProviderManual.pdf',
  'Anthem OH Medicaid provider manual (10/2025) — Availity/Interactive Care Reviewer submission, EPSDT framing; no ABA per-code coverage/unit table surfaced in the readable portions this pass.'
);
const CARELON_ANTHEM_QRG = src(
  'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/oh/ohbcbs-cd-025424-23-carelon-bh-intgrtn-qrg.pdf',
  'Carelon Behavioral Health — Ohio / Anthem Medicaid integration Quick Reference Guide: "Carelon Behavioral Health, Inc. is an independent company providing utilization management services on behalf of the health plan"; claims (ABA included) must be submitted through an ODM-authorized EDI trading partner or Availity DDE to the health plan — i.e., Carelon is a UM/prior-auth hop only, with NO separate BH claims payer ID; ABA claims ride the ODM FI to Anthem\'s MCE payer ID 0002937.'
);
const OPTUM_OH_LOCG = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/optumLOCG/ohlocg/ohMedcadLOCG.pdf',
  'Optum — Ohio Medicaid Supplemental Clinical Criteria (BH803OH; eff. 7/1/2026) — defers to OAC on eligibility/PA and adds Optum UM texture (80%-of-authorized-hours utilization trigger, 1-2 hrs case supervision per 10 direct-treatment hours, diagnostic-tool requirements, Provider Type 19/Specialty 190 credentialing). JS-gated to automated fetch this pass (returned a JS download interstitial) — the UM facts are carried from ohio.ts\'s already-verified prose, not re-extracted, so per-code coding mechanics remain unverified.'
);
const HUMANA_OH_PAL = src(
  'https://assets.humana.com/is/content/humana/OH%20MCD%20PAL%20Dpdf',
  'Humana Healthy Horizons OH — PA and notification list (eff. 1/1/2026, rev. 6/29/2026): under "Applied behavioral analysis (ABA) therapy" the list names all 10 codes (97151-97158, 0362T, 0373T), so PA applies to the entire ABA code set, assessments included. No per-code unit caps / POS / telehealth detail (it is a PA list only).'
);
const AMERIHEALTH_BH_PAGE = src(
  'https://www.amerihealthcaritasoh.com/provider/resources/behavioral-prior-auth',
  'AmeriHealth Caritas Ohio — behavioral-health prior-authorization page (NOT bot-blocked this pass, contrary to the original compile): confirms "Behavioral Analysis Therapy for Autism Spectrum Disorder" requires PA; UM (833) 735-7700, fax (833) 329-6411, Jiva via NaviNet. No EDI payer ID on the page — routing uses the ODM FI MCE payer ID 842435374.'
);
const MOLINA_OH_PA_PAGE = src(
  'https://www.molinahealthcare.com/members/oh/en-US/mem/medicaid/overvw/care/prior-authorizations.aspx',
  'Molina Healthcare of Ohio — prior-authorization page (NOT bot-blocked this pass; member-facing, no code-level or EDI detail). Availity-only PA submission since 1/1/2026 per ohio.ts prose.'
);
const MOLINA_EDI_CLAIMMD = src(
  'https://www.claim.md/payer/20149',
  'Clearinghouse payer directory (claim.md) entry for Molina Healthcare of Ohio EDI payer ID 20149 — Molina contracts Change Healthcare/Optum as its 270/271 & 837 clearinghouse. Secondary (clearinghouse directory, not a Molina-published primary source) — shipped inferred; ODM FI eligibility routing uses trading-partner 0007316.'
);
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026 (pVerify internal payer codes, not X12 CPIDs). Row-level extraction: 00165=Ohio Medicaid (Dental DE0105), 01360=CareSource Ohio (00776=CareSource Ohio Medicaid MCE), 00354=Buckeye Community Health, 00151=Molina Healthcare of Ohio (00849=Molina Ohio Medicaid MCE), 00759=Anthem BCBS Ohio Medicaid, 01548=AmeriHealth Caritas Ohio, 00819=Humana Healthy Horizons (Ohio Medicaid), 00001=Aetna, 00004=Cigna, 00192=UnitedHealthcare. No distinct "UHC Community Plan of Ohio" row (only generic Community-Plan codes / national 00192).'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list — the fetchable copy carries an "As of 08/08/2012" footer on every page (same staleness finding applied across this corpus). Only the long-stable national commercial IDs (60054=AETNA, 62308=CIGNA, 87726=UNITEDHEALTHCARE) are trustworthy from it; the Ohio Next-Gen MCO "F#####" entries are Availity ATADMIN administrator records, not submission IDs.',
  true
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide (Mar 2025) — "Use Evernorth payer ID 62308," confirming ABA/autism claims ride the SAME payer ID as Cigna medical (no second EDI hop). Consistent with the Georgia/Texas builds.'
);
const OPTUM_EDI_PAGE = src(
  'https://public.providerexpress.com/content/ope-provexpr/us/en/admin-resources/claim-tips/electronic-claim-submission-and-electronic-data-interchange.html',
  'Optum Provider Express EDI page — "The Optum payer ID is 87726," confirming UnitedHealthcare / Optum / UBH claims (ABA included) route on 87726, no second EDI hop.'
);
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — medical-necessity policy; no unit caps, POS codes, telehealth/licensure modifiers, and (per this corpus\'s cigna-texas QA re-verification) no per-code prior-authorization content.'
);
const AETNA_CPB0554 = src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis; medical-necessity policy only.');
const AETNA_CPB0648 = src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders; 97151-97158 covered when selection criteria are met; no unit caps/POS/telehealth/modifier detail.');
const AETNA_ABA_CLAIMS = src(
  'https://www.aetna.com/health-care-professionals/newsletters-news/office-link-updates-june-2022/behavioral-health-updates/applied-behavior-analysis-treatment-and-claims.html',
  'Aetna OfficeLink Updates (June 2022) — "Applied behavior analysis (ABA) treatment and claims": ABA is administered under the member\'s behavioral-health benefits as an internal Aetna function (not a separate carve-out company); no distinct BH claims payer ID named. National commercial claims ride 60054. In-house BH administration is inferred, not stated as a payer ID.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy; zero CPT codes (ICD-10 F84.0 only). Points to the separate Optum ABA Reimbursement Policy for coding detail.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy, not Ohio-specific. Max-daily-units and HN/HM/HO/HP modifier tiers per code; no POS/telehealth modifier. Applied to the OH commercial guide as 'inferred' absent a confirmed OH-specific override."
);
const OPTUM_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  'Optum ABA State Mandates supplemental clinical criteria (BH 803ABA, Jan 2026) — HAS an Ohio entry (unlike Missouri/Texas): for OH fully-insured members (eff. 3/2025) clinical nurse specialists and certified nurse practitioners may also screen/diagnose/order ASD services, mirroring the 2025 amendment to R.C. 3923.84. Already cited in unitedhealthcare-ohio prose.'
);
const OHIO_MANDATE = src(
  'https://codes.findlaw.com/oh/title-xxxix-insurance/oh-rev-code-sect-3923-84/',
  'Ohio Rev. Code § 3923.84 — autism mandate (HB 463, 2017): service FLOORS for insureds under age 14 (>=20 hrs/wk clinical therapeutic intervention, ABA-inclusive), COBA-supervised delivery; self-funded ERISA plans exempt by preemption. Applies to fully-insured plans only.'
);

/* CMS NCCI MUE daily-unit ceilings, enumerated verbatim in CareSource
   MM-0028 (the operative federal per-code daily cap; the ODM state rule
   sets none of its own). */
const MUE: Record<string, number> = {
  '97151': 32, '97152': 16, '97153': 32, '97154': 18, '97155': 24,
  '97156': 16, '97157': 16, '97158': 16, '0362T': 16, '0373T': 32,
};
const ABA_CODES = ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T'];

/* -------------------- Layer 4: rate tables -------------------- */

const OHIO_MEDICAID_RATES: RateTable = {
  source: 'ODM ABA fee appendix (Appendix A to draft rule 5160-34-03, package ERF188422B.pdf) — "CURRENT MAXIMUM PAYMENT AMOUNT," per 15-min unit, by practitioner tier. DRAFT (not-yet-filed) filing with a blank effective-date column; the only published ODM ABA fee document and the one ohio.ts prose already quotes. No billing-modifier column — priced by practitioner-tier descriptor.',
  effectiveDate: 'unverified — the ODM ABA fee appendix is a DRAFT (not-yet-filed) rule package; its effective-date column is blank',
  byCode: {
    '97151': { rate: 'Tiered — see modifierTiers (assessment)', unit: '15min', modifierTiers: { 'Independent (COBA/BCBA/BCBA-D)': '$30.49', BCaBA: '$22.67' } },
    '97152': { rate: '$17.00 per 15-min unit (RBT tier)', unit: '15min', modifierTiers: { RBT: '$17.00' } },
    '97153': { rate: '$16.04 per 15-min unit (RBT tier)', unit: '15min', modifierTiers: { RBT: '$16.04' } },
    '97154': { rate: '$7.61 per 15-min unit (RBT tier, group)', unit: '15min', modifierTiers: { RBT: '$7.61' } },
    '97155': { rate: 'Tiered — see modifierTiers', unit: '15min', modifierTiers: { 'Independent (COBA/BCBA/BCBA-D)': '$27.28', BCaBA: '$20.63' } },
    '97156': { rate: 'Tiered — see modifierTiers (family guidance)', unit: '15min', modifierTiers: { 'Independent (COBA/BCBA/BCBA-D)': '$30.09', BCaBA: '$22.37' } },
    '97157': { rate: 'Tiered — see modifierTiers (multi-family group)', unit: '15min', modifierTiers: { 'Independent (COBA/BCBA/BCBA-D)': '$14.46', BCaBA: '$10.62' } },
    '97158': { rate: 'Tiered — see modifierTiers (group w/ protocol modification)', unit: '15min', modifierTiers: { 'Independent (COBA/BCBA/BCBA-D)': '$14.46', BCaBA: '$10.62' } },
    '0362T': { rate: '$33.54 per 15-min unit (single rate)', unit: '15min' },
    '0373T': { rate: '$33.54 per 15-min unit (single rate)', unit: '15min' },
  },
  sources: [ODM_RULE_PACKAGE],
};

function ohioMcoUnverifiedRates(planName: string): RateTable {
  return {
    source: `Not separately published by ${planName} — MCO-contracted ABA rates are negotiated and confidential. The ODM ABA fee appendix (see ohio-medicaid rates) is the public benchmark MCO contracts track, per ${planName}'s own guide prose.`,
    effectiveDate: 'unverified',
    byCode: {
      '97151': { rate: 'unverified — see ohio-medicaid rates for the ODM benchmark ($30.49 Independent / $22.67 BCaBA)', unit: 'unverified' },
      '97152': { rate: 'unverified — ODM benchmark $17.00 (RBT)', unit: 'unverified' },
      '97153': { rate: 'unverified — ODM benchmark $16.04 (RBT)', unit: 'unverified' },
      '97154': { rate: 'unverified — ODM benchmark $7.61 (RBT)', unit: 'unverified' },
      '97155': { rate: 'unverified — ODM benchmark $27.28 Independent / $20.63 BCaBA', unit: 'unverified' },
      '97156': { rate: 'unverified — ODM benchmark $30.09 Independent / $22.37 BCaBA', unit: 'unverified' },
      '97157': { rate: 'unverified — ODM benchmark $14.46 Independent / $10.62 BCaBA', unit: 'unverified' },
      '97158': { rate: 'unverified — ODM benchmark $14.46 Independent / $10.62 BCaBA', unit: 'unverified' },
      '0362T': { rate: 'unverified — ODM benchmark $33.54', unit: 'unverified' },
      '0373T': { rate: 'unverified — ODM benchmark $33.54', unit: 'unverified' },
    },
    sources: [ODM_RULE_PACKAGE],
  };
}

/* -------------------- Layer 3: code-grid factories -------------------- */

/* ohio-medicaid (state FFS baseline). */
function ohioMedicaidEntry(code: string): CodeGridEntry {
  const isAssessment = code === '97151' || code === '97152' || code === '0362T';
  return {
    covered: 'Yes — covered for Medicaid individuals under 21 following a comprehensive diagnostic evaluation (OAC 5160-34; OhioRISE Mixed Services Protocol lists all 10 codes as MCO/FFS-paid)',
    paRequired: isAssessment
      ? 'Required — current OAC 5160-34-02 all-PA rule. The pending (not-yet-filed) 5160-34-03 rewrite would exempt assessment/reassessment up to 10 hrs per 180 days.'
      : 'Required — at treatment initiation and again for continuation beyond the initial 180-day authorization (current rule; draft 5160-34-03 retains treatment PA).',
    unitCap: `${MUE[code]} units/day (CMS NCCI MUE ceiling, enumerated in CareSource MM-0028)`,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['Priced by practitioner tier (Independent COBA/BCBA/BCBA-D · BCaBA · RBT), not by a billing modifier in the ODM fee appendix — confirm any claim-level tier modifier with ODM/the MCO'],
    notes: `The in-force/draft ODM ABA rule sets NO per-code daily unit cap of its own — only an assessment PA threshold (10 hrs/180 days) and a 1:8 group-session ratio (97154/97158). The daily cap shown is the CMS NCCI MUE ceiling. POS settings and telehealth mechanics are not enumerated in the draft rule package and could not be read from the JS-gated in-force OAC text this pass — shipped unverified. Verify via: ODM telehealth rule (OAC 5160-1-18) and the member's MCO policy.`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [OAC_5160_34_02, ODM_RULE_PACKAGE, OHIORISE_MSP, CARESOURCE_MM0028],
  };
}

/* CareSource — the one OH MCO with a full published MUE table + telehealth rules. */
function careSourceEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — under MM-0028 (citing MCG B-806-T); diagnosis restricted to child/adolescent psychiatrist, psychologist, child neurologist, or developmental pediatrician (ADOS/ADI-R/CARS-2)',
    paRequired: 'Required — medical-necessity review at baseline and every 6 months. Distinctive rule: treatment documentation must reach CareSource BEFORE claims — "claims will not be accepted without accompanying treatment documentation." UM (800) 488-0134.',
    unitCap: `${MUE[code]} units/day (CMS MUE maximum, enumerated in MM-0028)`,
    capPeriod: 'day',
    posAllowed: ['unverified — MM-0028 does not enumerate POS numbers'],
    telehealth:
      code === '97156' || code === '97157'
        ? 'Yes — parent/caregiver training and supervision may be delivered via telehealth per MM-0028 (no specific GT/95 modifier or POS number stated).'
        : 'Conditional — 1:1 ABA via telehealth only when medically necessary under a documented service-delivery plan (MM-0028); no telehealth modifier/POS number stated.',
    modifiers: ['unverified — MM-0028 does not publish a licensure-tier/telehealth modifier table'],
    notes:
      'Assessments generally 6-10 hrs per 6 months without justification; discontinuation trigger is no meaningful progress across two successive 6-month periods; H0036 (CPST) accepted from certified CBHCs in lieu of ABA CPT codes; RBT supervision >=5% of monthly ABA hours. Verify POS/telehealth modifier mechanics via the CareSource provider portal.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'verified',
      posAllowed: 'unverified',
      telehealth: 'verified',
      modifiers: 'unverified',
    },
    sources: [CARESOURCE_MM0028, CARESOURCE_PA_LIST],
  };
}

/* Buckeye (Centene) — CP.BH.104 hour parameters; per-code caps not in the policy. */
function buckeyeEntry(code: string): CodeGridEntry {
  const isAssessment = code === '97151' || code === '97152';
  return {
    covered: 'Yes — Centene CP.BH.104; comprehensive diagnostic evaluation accepted within the past 5 years',
    paRequired: isAssessment
      ? 'In-network: no PA on assessment codes 97151/97152 (out-of-network only) per ohio.ts prose — NOTE: this waiver is not stated in CP.BH.104 itself; it sits on Buckeye\'s separate PA list / pre-auth check tool, so it ships inferred pending that source.'
      : 'Required — 97153-97158 via the Autism Services PA Request Form (IDI/FBA, schedule, parent-training plan, IEP/IFSP, HSPP/physician attestation); fax (866) 694-3649, UM (800) 224-1991.',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — not restated in CP.BH.104, which caps by aggregate hours: <=6 hrs/day, <=30 hrs/wk without justification, <20 hrs/wk for full-time students)`,
    capPeriod: 'day',
    posAllowed: ['home', 'clinic', 'school', 'community', 'telehealth (modality named in CP.BH.104 Background; no POS numbers given)'],
    telehealth: 'Allowed as a modality per CP.BH.104 (in-person or telehealth); no code-specific modifier/POS number published.',
    modifiers: ['unverified — CP.BH.104 is criteria-based, no licensure-tier/telehealth modifier table'],
    notes:
      code === '97155'
        ? 'Protocol modification (97155) should run >=2 hrs/wk or 10% of direct hours (whichever is greater), capped at 20% unless justified (CP.BH.104). Behavioral assessment completed <=2 months before initial treatment auth; reassessment every 6 months. Verify via: Buckeye pre-auth check tool for code-level PA status.'
        : 'Behavioral assessment completed <=2 months before initial treatment auth; reassessment every 6 months. Verify via: Buckeye pre-auth check tool for code-level PA status.',
    fieldStatus: {
      covered: 'verified',
      paRequired: isAssessment ? 'inferred' : 'verified',
      unitCap: 'inferred',
      posAllowed: 'inferred',
      telehealth: 'inferred',
      modifiers: 'unverified',
    },
    sources: [BUCKEYE_CP_BH_104, BUCKEYE_PA_FORM],
  };
}

/* Molina OH — tracks the state rule; no distinct ABA policy; Availity-only PA since 1/2026. */
function molinaEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — administered on the OAC 5160-34 state framework; no distinct Molina ABA clinical policy published',
    paRequired: 'Required per Molina\'s PA list — submitted via Availity Essentials ONLY since 1/1/2026 (fax discontinued in Ohio). BH auth line (855) 322-4081 (confirm current number in the portal).',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — Molina publishes no distinct per-code table; state/CMS default)`,
    capPeriod: 'day',
    posAllowed: ['unverified — confirm in Availity; Molina\'s public site is member-facing with no code-level detail'],
    telehealth: 'unverified — confirm in Availity',
    modifiers: ['unverified — confirm in Availity'],
    notes:
      'Molina Ohio tracks the state ABA framework (PA on covered codes, DSM-5-TR diagnosis, 6-month reviews). Pull the current PA code list from Availity each quarter — the public site can\'t be relied on for updates. OhioRISE rule applies: ABA for an OhioRISE-enrolled Molina member still bills to Molina.',
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'inferred',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [MOLINA_OH_PA_PAGE, OAC_5160_34_02],
  };
}

/* Anthem OH Medicaid — adopts CG-BEH-02; per-code text not re-extractable this pass. */
function anthemEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — CG-BEH-02 (Adaptive Behavioral Treatment) adopted on the OAC 5160-34 baseline; EPSDT framing for under-21 members',
    paRequired: 'Required — UM via Availity Essentials / Interactive Care Reviewer (per the 10/2025 provider manual). The assessment-vs-treatment PA split is not published — run codes through the PA lookup tool per case.',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — CG-BEH-02 family generally caps total treatment at <=40 hrs/wk; per-code caps not re-extractable from the cited Anthem assets this pass)`,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'CG-BEH-02 carries the familiar Anthem parameters (<=40 hrs/wk total, ~2 hrs protocol modification per 10 direct hours), but the Ohio-specific published delta is thin and the cited GPP assets did not yield extractable per-code text this pass. Inpatient psychiatric care routes to OhioRISE; ABA stays with Anthem. Verify via: the current CG-BEH-02 guideline text (Carelon/Anthem clinical-guideline index) and the PA lookup at providers.anthem.com/oh.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [ANTHEM_CUMG, ANTHEM_MANUAL],
  };
}

/* UnitedHealthcare Community Plan of Ohio (Optum) — LOCG JS-gated. */
function uhcCommunityEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — Optum OH Medicaid Supplemental Clinical Criteria (defers to OAC on eligibility/PA); DSM-5-TR + a validated screener AND a formal tool (ADOS/ADI-R/DISCO)',
    paRequired: 'Required — reviews per authorization period; continued-treatment review scrutinizes utilization below 80% of authorized hours over any two-week period (barrier documentation required). No numeric hour cap — hours justified by severity/history.',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — the Optum OH LOCG sets no numeric hour cap and was JS-gated to re-extraction this pass; state/CMS default applies)`,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'Available for ABA with member prerequisite-skill and caregiver-support conditions (per ohio.ts prose from the Optum OH LOCG); no telehealth modifier/POS number stated.',
    modifiers: ['unverified'],
    notes:
      'Direct case supervision 1-2 hrs per 10 hrs of direct treatment weekly (CASP-based). COBA enrolls as ODM Provider Type 19, Specialty 190 (rendering + group NPIs), then joins the Optum network via Provider Express. The LOCG PDF is JS-gated to automated fetch — UM facts carried from ohio.ts\'s already-verified prose; per-code coding mechanics unverified. Verify via: Provider Express / UHC provider services.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'inferred',
      modifiers: 'unverified',
    },
    sources: [OPTUM_OH_LOCG, OAC_5160_34_02],
  };
}

/* AmeriHealth Caritas Ohio — state-rule-driven; thin paper trail. */
function amerihealthEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — "Behavioral Analysis Therapy for Autism Spectrum Disorder" (AmeriHealth Caritas OH BH PA page); administered on the OAC 5160-34 state framework, no distinct plan ABA policy published',
    paRequired: 'Required before ABA begins; 6-month authorization periods. Jiva UM via NaviNet; UM (833) 735-7700, fax (833) 329-6411. Initial decisions commonly reported at 10-14 business days.',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — no distinct plan table; state/CMS default)`,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'Approved intensities generally 10-40 hrs/wk per clinical necessity (state framework). The plan\'s BH PA page is NOT bot-blocked this pass (contrary to the original compile) but publishes no code-level table. OhioRISE rule applies: ABA bills to AmeriHealth Caritas, never to OhioRISE. Verify code-level detail via the plan portal / provider manual.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [AMERIHEALTH_BH_PAGE, OAC_5160_34_02],
  };
}

/* Humana Healthy Horizons Ohio — all codes on the PA list. */
function humanaEntry(code: string): CodeGridEntry {
  return {
    covered: 'Yes — administered on the OAC 5160-34 state framework; no distinct Humana ABA clinical policy',
    paRequired: 'Required — every ABA code is on Humana\'s PA and notification list (eff. 1/1/2026), assessments included; services rendered without PA face retrospective medical-necessity review and financial penalties. Submit via Availity Essentials; OH provider line (877) 856-5707; in-house Humana behavioral UM.',
    unitCap: `${MUE[code]} units/day (CMS MUE ceiling — the PAL is a PA list only, no per-code cap; state/CMS default)`,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes:
      'The PA list names 97151-97158, 0362T, 0373T explicitly under "Applied behavioral analysis (ABA) therapy" — so the assessment itself needs authorization before the first appointment (unlike Buckeye\'s in-network assessment waiver). Clinical criteria follow the state framework (DSM-5-TR, 6-month reviews). OhioRISE rule applies. Verify code-level POS/telehealth via Humana provider services.',
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [HUMANA_OH_PAL, OAC_5160_34_02],
  };
}

function buildGrid(fn: (code: string) => CodeGridEntry): Record<string, CodeGridEntry> {
  const grid: Record<string, CodeGridEntry> = {};
  for (const code of ABA_CODES) grid[code] = fn(code);
  return grid;
}

/* -------------------- Layer 1: EDI routing -------------------- */

/* Shared ODM FI trading-partner / MCE-payer-ID crosswalk (verified from
   the v13.0 companion guide) — surfaced on ohio-medicaid's
   medicaid271Notes.mcoCarrierCodes. */
const ODM_MCO_CARRIER_CODES: Record<string, string> = {
  MMISODJFS: 'ODM Fee-for-Service (ISA06/08 trading partner)',
  '0021920': 'AmeriHealth Caritas Ohio (ISA trading partner)',
  '0002937': 'Anthem BCBS Ohio — medical MCE (ISA trading partner / 2100A NM109 payer ID)',
  '0004202': 'Buckeye Health Plan (ISA trading partner / MCE payer ID)',
  '0003150': 'CareSource (ISA trading partner / MCE payer ID)',
  '0021919': 'Humana Health Plan of Ohio (ISA trading partner)',
  '0007316': 'Molina Healthcare of Ohio (ISA trading partner / MCE payer ID)',
  '0007610': 'UnitedHealthcare Community Plan of Ohio (ISA trading partner)',
  '0021914': 'Aetna OhioRISE (ISA trading partner) — NEVER pays ABA; the member\'s medical MCO does',
  '88337': 'UnitedHealthcare Ohio Medicaid — 2100A NM109 MCE claims payer ID',
  '842435374': 'AmeriHealth Caritas Ohio — 2100A NM109 MCE claims payer ID',
  '61103': 'Humana Ohio Medicaid — 2100A NM109 MCE claims payer ID',
  '60054': 'Aetna OhioRISE — 2100A NM109 MCE claims payer ID (OhioRISE, not ABA)',
};

const ohioMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00165', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'none — ABA is a medical benefit of the member\'s MCO (or FFS); OhioRISE (Aetna) is enrolled-but-never-the-ABA-payer',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  medicaid271Notes: {
    mcoSegmentLocation:
      "Loop 2110C EB01='MC' flags MCO enrollment; the MCO entity is named in Loop 2120C NM1 (NM101='PR', name free-text in NM103); EB05 carries the coded 'Plan Coverage Description' (defined in ODM's separate 271 Code Crosswalk). MCO routing is also identifiable via the fixed ODM trading-partner codes in ISA06/ISA08 and the 2100A NM109 MCE-payer-ID table (see mcoCarrierCodes). OhioRISE (Aetna) is separately visible (trading partner 0021914 / MCE payer 60054) — but per ODM's Mixed Services Protocol OhioRISE never pays ABA; identify the underlying medical MCO, which is the ABA payer.",
    mcoCarrierCodes: ODM_MCO_CARRIER_CODES,
    eligibilitySpanGranularity:
      "Monthly — EB06 Time Period Qualifier '34' (Month); coverage reported through the last day of the queried month. Transaction supports real-time and batch.",
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'verified',
    'medicaid271Notes.mcoSegmentLocation': 'verified',
    'medicaid271Notes.mcoCarrierCodes': 'verified',
    'medicaid271Notes.eligibilitySpanGranularity': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      "The Availity list (2012-dated) shows only ATADMIN 'F#####' administrator records for the OH MCOs, not submission IDs; ODM FFS's own envelope trading-partner ID is 'MMISODJFS' (ISA06/08) per the companion guide. Confirm the current Availity submission ID with Availity onboarding.",
    'payerId.changeHealthcare':
      'Change Healthcare medical CPID list is login-gated; not retrievable this pass. For eligibility, ODM FI routing uses the trading-partner code MMISODJFS. Confirm the CHC CPID via authenticated clearinghouse enrollment.',
  },
  sources: [ODM_COMPANION_GUIDE, PVERIFY_PAYER_LIST, ODM_RULE_PACKAGE, OHIORISE_MSP, AVAILITY_PAYER_LIST],
};

const caresourceEdi: EdiRouting = {
  payerId: { pverify: '01360', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify lists 01360 (CareSource Ohio) and a separate 00776 (CareSource Ohio Medicaid MCE) — confirm which pVerify routes OH Medicaid ABA eligibility through before automating.',
    'payerId.availity': 'Availity shows only an ATADMIN admin record (F31114) for CareSource of Ohio, not a submission ID — confirm with Availity onboarding.',
    'payerId.changeHealthcare': 'ODM FI eligibility routing uses trading partner / MCE payer ID 0003150 (companion guide); a distinct Change Healthcare CPID was not retrievable this pass.',
    supportsRealtime: 'Real-time eligibility confirmed via the ODM FI companion guide (whole 270/271 flow); confirm plan-level real-time vs. batch via the clearinghouse.',
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE, CARESOURCE_MM0028],
};

const buckeyeEdi: EdiRouting = {
  payerId: { pverify: '00354', availity: 'unverified', changeHealthcare: '0004202' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.availity': 'Availity shows only an ATADMIN admin record (F32004), not a submission ID — confirm with Availity onboarding.',
    'payerId.changeHealthcare': 'ODM FI trading partner / MCE payer ID 0004202 (companion guide); a distinct Change Healthcare CPID was not separately confirmed.',
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE],
};

const molinaEdi: EdiRouting = {
  payerId: { pverify: '00151', availity: 'unverified', changeHealthcare: '20149' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify lists 00151 (Molina Healthcare of Ohio) and a separate 00849 (Molina Ohio Medicaid MCE) — confirm which routes OH Medicaid ABA eligibility.',
    'payerId.changeHealthcare': "Molina OH claims payer ID 20149 is from the claim.md clearinghouse directory (Molina uses Change Healthcare/Optum as its clearinghouse) — a secondary source, shipped inferred; ODM FI eligibility routing uses trading partner 0007316.",
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE, MOLINA_EDI_CLAIMMD],
};

const anthemOhioEdi: EdiRouting = {
  payerId: { pverify: '00759', availity: 'unverified', changeHealthcare: '0002937' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'Carelon Behavioral Health (utilization management / prior authorization ONLY — not a claims administrator)',
    administratorPayerId: '',
    abaRidesOn: 'medical',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.availity': 'Confirm the current Availity submission ID with Availity onboarding (2012 list unreliable for OH MCOs).',
    'payerId.changeHealthcare': 'ODM FI MCE payer ID 0002937 (companion guide) — ABA claims ride the ODM FI to Anthem\'s medical payer ID, NOT a Carelon payer ID.',
    'bhCarveOut.twoHopRequired':
      'Carelon is a UM/prior-authorization hop only (Carelon "provides utilization management services on behalf of the health plan"); ABA CLAIMS have no second hop — they route through the ODM FI to Anthem MCE payer ID 0002937. twoHopRequired=true reflects the authorization hop; there is NO separate BH claims payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE, CARELON_ANTHEM_QRG],
};

const uhcCommunityEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: '88337' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: {
    administrator: 'Optum Behavioral Health (UM; claims ride UHC\'s own payer ID, no second hop)',
    administratorPayerId: '88337',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'verified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'pVerify has no distinct "UHC Community Plan of Ohio" row — only generic Community-Plan codes (BO00075/UHG001) or national UHC 00192. Confirm via pVerify support before automating.',
    'payerId.availity': 'Confirm the current Availity submission ID with Availity onboarding.',
    'bhCarveOut.administrator':
      'Optum administers UHC Community Plan BH/ABA UM; the ODM FI MCE claims payer ID is 88337 (companion guide, verified). Whether ABA claims specifically ride 88337 vs a distinct Optum BH ID for OH Medicaid is inferred from the FI table (no second hop found) — confirm via Provider Express / UHC provider services.',
  },
  sources: [ODM_COMPANION_GUIDE, PVERIFY_PAYER_LIST, OPTUM_OH_LOCG],
};

const amerihealthEdi: EdiRouting = {
  payerId: { pverify: '01548', availity: 'unverified', changeHealthcare: '842435374' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none (state-rule-driven; BH administrator not named on the plan\'s BH PA page)', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.availity': 'AmeriHealth Caritas Ohio postdates the 2012 Availity list (absent) — confirm with Availity onboarding.',
    'payerId.changeHealthcare': 'ODM FI MCE claims payer ID 842435374 (companion guide, verified); a distinct Change Healthcare CPID was not separately confirmed.',
    'bhCarveOut.administrator': 'The plan\'s BH PA page confirms ABA needs PA but names no BH administrator — confirm in-house vs. delegated via the ACO provider manual.',
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE, AMERIHEALTH_BH_PAGE],
};

const humanaOhioEdi: EdiRouting = {
  payerId: { pverify: '00819', availity: 'unverified', changeHealthcare: '61103' },
  supports270271: true,
  supportsRealtime: true,
  bhCarveOut: { administrator: 'none — in-house Humana behavioral health', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'inferred',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.availity': 'Humana Healthy Horizons Ohio postdates the 2012 Availity list (absent) — confirm with Availity onboarding.',
    'payerId.changeHealthcare': 'ODM FI MCE claims payer ID 61103 (companion guide, verified); a distinct Change Healthcare CPID was not separately confirmed.',
  },
  sources: [PVERIFY_PAYER_LIST, ODM_COMPANION_GUIDE, HUMANA_OH_PAL],
};

/* -------------------- commercial guides (Layers 1 + 3 only) -------------------- */

const OHIO_MANDATE_NOTE =
  'Ohio mandate (R.C. 3923.84): fully-insured plans set service FLOORS for insureds under age 14 (>=20 hrs/wk ABA-inclusive clinical therapeutic intervention), COBA-supervised; self-funded ERISA plans are exempt. Verify plan funding type on the live benefits check.';

const aetnaOhioEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: '60054' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Aetna Behavioral Health (in-house — not a separate carve-out company)',
    administratorPayerId: '60054',
    abaRidesOn: 'medical',
    twoHopRequired: false,
  },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
    'bhCarveOut.administratorPayerId': 'inferred',
    'bhCarveOut.abaRidesOn': 'inferred',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.availity': '60054 is Aetna\'s long-standing national ID, present in the fetched Availity list but that list is 2012-dated — ships inferred pending a current export (matches aetna-florida/aetna-georgia).',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.',
    'bhCarveOut.administrator': 'Aetna administers ABA under the member\'s BH benefit as an internal function; no separate BH claims payer ID is published (national claims ride 60054). Confirm via Aetna provider services / the ABA precertification process.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, AETNA_ABA_CLAIMS],
};

function aetnaOhEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — precertification (specific form number not confirmed in either cited CPB)',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: `Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are medical-necessity policies only; no ABA coding/reimbursement policy located. ${OHIO_MANDATE_NOTE}`,
    fieldStatus: { covered: 'verified', paRequired: 'unverified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [AETNA_CPB0554, AETNA_CPB0648, OHIO_MANDATE],
  };
}

const cignaOhioEdi: EdiRouting = {
  payerId: { pverify: '00004', availity: '62308', changeHealthcare: '62308' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Evernorth Behavioral Health', administratorPayerId: '62308', abaRidesOn: 'medical', twoHopRequired: false },
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
  verifyVia: { supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.' },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, CIGNA_AUTISM_RESOURCE_GUIDE],
};

function cignaOhEntry(): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'unverified — EN0499 (re-verified for this corpus per the cigna-texas QA pass) contains no per-code prior-authorization content; confirm the assessment-vs-treatment PA split with Cigna/Evernorth provider services',
    unitCap: 'unverified',
    capPeriod: 'unverified',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers: ['unverified'],
    notes: `Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement/PA mechanics are published in it. ${OHIO_MANDATE_NOTE}`,
    fieldStatus: { covered: 'verified', paRequired: 'unverified', unitCap: 'unverified', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'unverified' },
    sources: [CIGNA_EN0499, OHIO_MANDATE],
  };
}

const uhcOhioEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: '87726' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'Optum Behavioral Health', administratorPayerId: '87726', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'verified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'verified',
  },
  verifyVia: {
    'payerId.availity': '87726 confirmed as the Optum/UHC claims payer ID via Optum Provider Express\'s EDI page (verified); the Availity occurrence is from the 2012 export, so the Availity source ships inferred.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_EDI_PAGE],
};

function uhcOhEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: 'Required — Optum ABA prior authorization via Provider Express (specific process/review cadence not confirmed in the cited sources)',
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes: `Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A); the ABA Supplemental Clinical Criteria contains no CPT codes. Ohio HAS an entry in Optum's ABA State Mandates supplement (eff. 3/2025): CNSs and CNPs may screen/diagnose/order ASD services for OH fully-insured members, mirroring the R.C. 3923.84 amendment. Verify via: Provider Express / UHC provider services. ${OHIO_MANDATE_NOTE}`,
    fieldStatus: { covered: 'inferred', paRequired: 'unverified', unitCap: 'inferred', posAllowed: 'unverified', telehealth: 'unverified', modifiers: 'inferred' },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES, OHIO_MANDATE],
  };
}

const aetnaOhioCodeGrid = buildGrid(() => aetnaOhEntry());
const cignaOhioCodeGrid = buildGrid(() => cignaOhEntry());
const uhcOhioCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcOhEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcOhEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcOhEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcOhEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcOhEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcOhEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcOhEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcOhEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcOhEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcOhEntry('32 units/day (≤8 hrs)', []),
};

/* ==================== export ==================== */

export const ohioVob: Record<string, VobExtension> = {
  'ohio-medicaid': { edi: ohioMedicaidEdi, codeGrid: buildGrid(ohioMedicaidEntry), rates: OHIO_MEDICAID_RATES, lastUpdated: ACCESS_DATE },
  'caresource-ohio': { edi: caresourceEdi, codeGrid: buildGrid(careSourceEntry), rates: ohioMcoUnverifiedRates('CareSource Ohio'), lastUpdated: ACCESS_DATE },
  'buckeye-health-plan': { edi: buckeyeEdi, codeGrid: buildGrid(buckeyeEntry), rates: ohioMcoUnverifiedRates('Buckeye Health Plan'), lastUpdated: ACCESS_DATE },
  'molina-healthcare-ohio': { edi: molinaEdi, codeGrid: buildGrid(molinaEntry), rates: ohioMcoUnverifiedRates('Molina Healthcare of Ohio'), lastUpdated: ACCESS_DATE },
  'anthem-ohio-medicaid': { edi: anthemOhioEdi, codeGrid: buildGrid(anthemEntry), rates: ohioMcoUnverifiedRates('Anthem BCBS Ohio Medicaid'), lastUpdated: ACCESS_DATE },
  'unitedhealthcare-community-plan-ohio': { edi: uhcCommunityEdi, codeGrid: buildGrid(uhcCommunityEntry), rates: ohioMcoUnverifiedRates('UnitedHealthcare Community Plan of Ohio'), lastUpdated: ACCESS_DATE },
  'amerihealth-caritas-ohio': { edi: amerihealthEdi, codeGrid: buildGrid(amerihealthEntry), rates: ohioMcoUnverifiedRates('AmeriHealth Caritas Ohio'), lastUpdated: ACCESS_DATE },
  'humana-healthy-horizons-ohio': { edi: humanaOhioEdi, codeGrid: buildGrid(humanaEntry), rates: ohioMcoUnverifiedRates('Humana Healthy Horizons in Ohio'), lastUpdated: ACCESS_DATE },
  'aetna-ohio': { edi: aetnaOhioEdi, codeGrid: aetnaOhioCodeGrid, lastUpdated: ACCESS_DATE },
  'cigna-ohio': { edi: cignaOhioEdi, codeGrid: cignaOhioCodeGrid, lastUpdated: ACCESS_DATE },
  'unitedhealthcare-ohio': { edi: uhcOhioEdi, codeGrid: uhcOhioCodeGrid, lastUpdated: ACCESS_DATE },
};
