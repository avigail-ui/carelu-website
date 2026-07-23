/* ================================================================
   VOB ENRICHMENT — Texas, Layers 1 (EDI routing crosswalk), 3
   (code-level coverage grid), and 4 (Medicaid rate tables). See
   docs/vob-build.md for the spec.

   Sourcing notes (read before editing):
   - docs/vob-gaps.md flagged hhs.texas.gov as 403-blocked to automated
     fetch. tmhp.com is NOT similarly blocked: the 270/271 Medicaid/CHIP
     Eligibility Companion Guide (dated November 2024), the TMPPM
     Children's Services Handbook (§2.3 Autism Services), and TMHP's
     static/PDF fee schedules were all retrieved directly this pass.
     Where a fact below is 'unverified', it's because the specific
     document doesn't state it — not because the document was
     unreachable.
   - The 270/271 Companion Guide's Appendix 11.1 "Managed Care Program
     Codes" table maps STAR/STAR PLUS/STAR Kids/Foster Care/CHIP
     PROGRAM codes into EB05 — it is NOT a per-MCO health-plan lookup
     table. The actual MCO name is carried as free text in REF02
     (REF01=18, "Managed Care Plan Code") inside the 2110C "Covered
     Managed Care" EB loop; the guide's own example shows this as a
     literal placeholder ("MCOPLANNAME"), confirming the mechanism but
     not a fixed code table. medicaid271Notes.mcoCarrierCodes below
     ships the verified PROGRAM code table with that distinction noted
     explicitly, rather than being misrepresented as an MCO lookup.
   - Independently cross-checked against two primary sources — the
     TMPPM Children's Services Handbook §2.3 and TMHP's own "AUTISM
     SERVICES" static fee schedule (PRCR615C) — Texas's actual
     THSteps-CCP Autism Services billable code set is 97151, 97153,
     97154, 97155, 97156, 97158, and 99366. CPT codes 97152, 97157,
     0362T, and 0373T appear in NEITHER document: zero occurrences in
     the full handbook text, zero rows in the fee schedule. Per the
     "capture the state's actual billable code set, don't force the
     CPT list" instruction, those four codes ship 'unverified' in every
     Medicaid-track codeGrid rather than populated with GA/national
     figures that would misrepresent Texas policy.
   - Layer 3's TMPPM-baseline facts (unit caps, modifiers, telehealth
     rules, POS settings) are IDENTICAL across texas-medicaid and all 8
     MCO guides — every MCO guide in the existing texas.ts prose
     already states it applies TMPPM criteria with no distinct ABA
     policy of its own (Superior, TCHP, Wellpoint, Molina, Community
     First, and Driscoll each say so explicitly; Aetna Better Health
     and UHC Community Plan say so by absence of a found override).
     One shared, heavily-sourced grid factory is used for all 9 rather
     than repeating unverifiable "plan-specific" claims per guide.
   - Layer 4 rates: texas-medicaid's rates are the state fee schedule
     itself (verified, PRCR615C). MCO reimbursement is contract-specific
     and not publicly posted for any of the 8 Texas MCOs (already
     established in each guide's existing prose) — MCO rates.byCode
     ships the literal 'unverified' per code with the state schedule
     noted as the benchmark, per "MCO rates: only where publicly
     posted... otherwise unverified."
   - The 3 commercial guides (aetna-texas, cigna-texas,
     unitedhealthcare-texas) get Layers 1 + 3 only, per the build spec
     ("Do not attempt commercial rates"). Their codeGrid uses the full
     national CPT set (97151-97158, 0362T, 0373T) since national
     commercial clinical policy — not the Medicaid benefit's narrower
     code list — governs; texas.ts's own prose already establishes none
     of the three carriers publish a Texas-specific override of their
     national ABA policy (EN0499 for Cigna, CPB 0554/0648 for Aetna,
     Optum's SCC/2022RP501A for UnitedHealthcare, with Optum's ABA State
     Mandates supplement confirmed to have no Texas entry).
   - BH carve-out: Texas's THSteps-CCP Autism Services benefit is NOT
     carved out to a third-party BH administrator anywhere in the state
     (already verified via a TMHP policy release cited in texas.ts) —
     every Medicaid guide below ships bhCarveOut.administrator: 'none'.
     The one nuance is UnitedHealthcare Community Plan of Texas, where
     the existing texas.ts prose (independently verified, cited to UHC's
     own STAR Kids PA list) establishes that ABA authorization is routed
     to UHC's OWN Optum Behavioral Health network rather than its medical
     PA pipeline — a UM-routing carve-out within the UHC/Optum corporate
     family, not a third-party BHO. That guide ships abaRidesOn: 'bh'
     accordingly; every other Medicaid MCO ships abaRidesOn: 'medical'.
   ================================================================ */
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, StcMap, VobContact } from './types.js';
import { cignaFamilyStc, uhcFamilyStc, aetnaFamilyStc, inheritFamilyStc } from './stc-defaults.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared source refs -------------------- */

const COMPANION_GUIDE_270_271 = src(
  'https://www.tmhp.com/sites/default/files/file-library/edi/D00026_270_271_Medicaid_CHIP_Eligibility_Companion_Guide.pdf',
  'Texas Medicaid & CHIP 270/271 HIPAA Transaction Standard Companion Guide, dated November 2024 (§1.2: "batch and real-time mode"; §6.1 ISA08 Interchange Receiver ID = 617591011TIELP; 2110C EB/REF and 2120C loop tables; Appendix 11.1 Managed Care Program Codes). Directly retrievable from tmhp.com — unlike hhs.texas.gov, not bot-blocked.'
);
const TMHP_STC_SECTIONS = src(
  'https://www.tmhp.com/sites/default/files/file-library/edi/D00026_270_271_Medicaid_CHIP_Eligibility_Companion_Guide.pdf',
  'Same companion guide as COMPANION_GUIDE_270_271, re-read for its service-type-code (STC) content this pass. §10.1 (2110C EQ01) and §10.2 (2110C EB03) both list an explicit supported-code set including MH, A6, A7, A8, AI (behavioral-health codes) alongside AD/AE/AF (OT/PT/speech) — "Texas Medicaid does not support service type codes other than those listed." §11.3\'s worked 270/271 transmission examples show real EB*A (coinsurance) and EB*B (copayment) segments bundling MH together with "1|30|33|35|47|48|50|75|86|88|98|AL|AM|UC" for BOTH the Medicaid-Direct and "Covered Managed Care"/STAR/CHIP/CSHCN EB segments — i.e., the SAME rich behavioral-health-inclusive STC bundle is returned for managed-care (MCO) members through this one state-run feed, not just Medicaid-Direct FFS. By contrast, the deductible segments (EB*C, both "Beginning" §23 and "Remaining" §29) are tied ONLY to STC 30 in every example, never bundled with MH.',
  true
);
const TMPPM_HANDBOOK = src(
  'https://www.tmhp.com/sites/default/files/microsites/provider-manuals/tmppm/html/TMPPM/2_04_Childrens_Services/2_04_Childrens_Services.htm',
  "TMPPM Children's Services Handbook §2.3 Autism Services — §2.3.6 (LBA/LaBA/BT roles), §2.3.7 (documentation/PA requirements), §2.3.12 Reimbursement and Billing Guidelines, §2.3.12.1 Telehealth Service Delivery, §2.3.12.2 ABA Services (per-code descriptions), §2.3.12.3 (15-minute unit counting). Confirms Texas's actual billable Autism Services code set is 97151, 97153, 97154, 97155, 97156, 97158, and 99366 — 97152, 97157, 0362T, and 0373T do not appear anywhere in this chapter."
);
const AUTISM_FEE_SCHEDULE = src(
  'https://public.tmhp.com/FeeSchedules/StaticFeeSchedule/FeeSchedules.aspx?fn=%5C%5Ctmhp.net%5CFeeSchedule%5CPROD%5CStatic%5CTexas_Medicaid_Fee_Schedule_PRCR615C.pdf',
  'TMHP static fee schedule "AUTISM SERVICES" (PRCR615C) — Licensed Behavior Analyst (LBA) provider-type rows for 97151 (HO), 97153, 97154, 97155 (HN/HO), 97156 (HN/HO), 97158 (HN/HO), and 99366, effective dates shown per row (9/1/2025 for most, 3/1/2024 for 97154/97158/99366, unchanged in the 9/1/2025 rate action). Corroborates the handbook\'s code set: no 97152/97157/0362T/0373T rows exist in this schedule either.'
);
const HHSC_FEE_PACKET = src(
  'https://pfd.hhs.texas.gov/sites/default/files/documents/2025/9-1-2025-fee-adj-fetal-med-applied-behavior-dental-rate.pdf',
  'HHSC Provider Finance — ABA fee adjustment packet (eff. 9/1/2025, ~11.5% increase); already cited in texas.ts as the source for the prose rate figures reused here.'
);
const TMHP_FEE_LOOKUP = src('https://public.tmhp.com/FeeSchedules/OnlineFeeLookup/FeeScheduleSearch.aspx', 'TMHP Online Fee Lookup — interactive code-by-code search tool, not a static/fetchable page; the interface itself is the verifyVia for any code not in the static Autism Services schedule.');
const PVERIFY_PAYER_LIST = src(
  'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
  'pVerify public payer list, dated March 2026.'
);
const AVAILITY_PAYER_LIST = src(
  'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
  'Availity Essentials public payer list (837/270-271 payer IDs).'
);
const TMHP_AUTISM_BENEFIT_RELEASE = src(
  'https://www.tmhp.com/news/2021-07-30-hhsc-release-autism-services-benefits-effective-february-1-2022',
  'TMHP — HHSC Release of Autism Services Benefits (eff. 2/1/2022); already cited in texas.ts as the primary source that the benefit is not carved out to a BH administrator anywhere in Texas.'
);
const AETNA_CPB0554 = src('https://www.aetna.com/cpb/medical/data/500_599/0554.html', 'Aetna CPB 0554 — Applied Behavior Analysis.');
const AETNA_CPB0648 = src('https://www.aetna.com/cpb/medical/data/600_699/0648.html', 'Aetna CPB 0648 — Autism Spectrum Disorders.');
const CIGNA_EN0499 = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
  'Evernorth/Cigna EN0499 — no PA on assessment codes 97151/97152/0362T; PA required for treatment codes.'
);
const CIGNA_AUTISM_RESOURCE_GUIDE = src(
  'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
  'Cigna Autism Resource Guide — states verbatim "Use Evernorth payer ID 62308," confirming ABA/autism claims use the SAME payer ID as Cigna medical claims (no separate Evernorth EDI hop). Already cited in texas.ts.'
);
const OPTUM_SCC = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaSCC.pdf',
  'Optum ABA Supplemental Clinical Criteria (BH803ABASCC) — national policy, no Texas-specific coding/reimbursement mechanics.'
);
const OPTUM_REIMBURSEMENT_POLICY = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
  "Optum ABA Reimbursement Policy 2022RP501A — a NATIONAL commercial policy (not Texas-specific). Max-daily-units and HN/HM/HO/HP modifier tiers per code; applied to Texas as 'inferred' absent a confirmed TX-specific override."
);
const OPTUM_STATE_MANDATES = src(
  'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/scc/ABA_SCC_SM.pdf',
  "Optum ABA State Mandates supplemental clinical criteria (BH803ABA STM) — confirmed to contain no Texas entry; already cited in texas.ts."
);
const UHC_STAR_KIDS_PA_LIST = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tx/prior-auth/star-kids/TX-UHCCP-STAR-KIDS-Prior-Auth-Eff-11-1-2025.pdf',
  "UHC Community Plan of TX — STAR Kids PA list (eff. 11/1/2025) — does not contain ABA codes 97151-97158 because behavioral health, ABA included, is carved out to UHC's own Optum-administered BH network rather than the medical PA pipeline. Already verified and cited in texas.ts."
);
const UHC_TX_PA_PAGE = src('https://www.uhcprovider.com/en/health-plans-by-state/texas-health-plans/tx-comm-plan-home/tx-cp-prior-auth.html', 'UHC Community Plan of Texas — prior authorization page.');
const AETNA_BH_TX_MANUAL = src('https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/texas/providers/pdf/tx_provider_manual.pdf', 'Aetna Better Health of Texas — provider manual (access-restricted per texas.ts prose; PA/EDI mechanics beyond payer IDs not independently verifiable this pass).');
const MOLINA_TX_PA_PAGE = src('https://www.molinahealthcare.com/providers/tx/medicaid/forms/PA.aspx', 'Molina Healthcare of Texas — Prior Authorizations page (access-restricted per texas.ts prose).');
const SUPERIOR_ABA_LAUNCH = src('https://www.superiorhealthplan.com/newsroom/effective-0201222-new-medicaid-benefit-for-aba-services-prior-auth-required.html', 'Superior — New Medicaid Benefit for ABA Services, PA Required (eff. 2/1/2022).');
const TCHP_GUIDELINE = src('https://www.texaschildrenshealthplan.org/sites/default/files/2025-02/Autism%20Services%20Guideline.pdf', "TCHP — Autism Services Guideline #11281 v3, a formatted restatement of TMPPM criteria.");
const WELLPOINT_TX_BH_DOC = src('https://provider.amerigroup.com/docs/gpp/TX_CAID_TexasBehavioralHealth.pdf?v=202207071852', 'Wellpoint/Amerigroup — Texas Behavioral Health provider document; restates TMPPM modifier table and caps.');
const COMMUNITY_FIRST_BILLING_GUIDELINES = src('https://communityfirsthealthplans.com/community-first-providers/medicaid-providers/autism-services-billing-guidelines/', "Community First Health Plans — Autism Services Billing Guidelines, a TMPPM digest with its own HO/HN/HM crosswalk.");
const DRISCOLL_PA_PORTAL = src('https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services', 'Driscoll Health Plan — Prior Authorization Requirement Portal (Autism/ABA Services).');

/* -------------------- gap-fill: 6 new TX MCO guides (source refs) --------------------
   All already cited in this repo's src/data/payers/texas.ts base-guide prose for these
   6 slugs; re-read here for VOB Layers 1/3/4 rather than freshly fetched this pass. */
const CHC_ABA_GUIDELINE = src(
  'https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2026/07/mrg-aba-services-guideline.pdf',
  "Community Health Choice — Medical Review Guideline: Applied Behavioral Analysis (ABA) Services (adopted 6/2026). Names the TMPPM Children's Services Handbook §2 as governing authority; lists 97151,97153,97154,97155,97156,97158 explicitly (0362T and 99366 not mentioned); requires TSPA + CCP PA form + signed prescriber referral for the evaluation; 85%-attendance rule gates extension/recert approval; names DIR/Floortime, TEACCH, and RDI as excluded non-ABA interventions; \"Applies To\" checkboxes mark STAR and Marketplace but not STAR+PLUS."
);
const CHC_STAR_QRG = src('https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2021/04/STAR-QRG-3-2021.pdf', 'Community Health Choice — STAR Program Provider Quick Reference Guide (confirms Harris + Jefferson counties).');
const CHC_STARPLUS_QRG = src('https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2024/09/STARPLUS-Quick-Reference-Guide.pdf', "Community Health Choice — STAR+PLUS Program Provider Quick Reference Guide (Jefferson County absent from this list).");
const CHC_HHS_MANUAL = src('https://provider.communityhealthchoice.org/wp-content/uploads/sites/2/2025/10/HHS-Provider-Manual.pdf', 'Community Health Choice — HHS Provider Manual (states CHIP excludes ABA therapy).');

const BCBSTX_MEDICAID_NEWS = src(
  'https://www.bcbstx.com/provider/medicaid/education-and-reference/news/2024/05-10-2024-md-behavioral-health-aba-forms',
  'BCBSTX — Medicaid Behavioral Health / ABA Forms Update (5/10/2024) — announces "insourcing of Behavioral Health Services for Medicaid," ending the prior Magellan carve-out (last referenced in a 7/5/2023-dated PA summary).'
);
const BCBSTX_ABA_CHECKLIST = src('https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/applied-behavioral-analysis-pa-requirement-checklist.pdf', 'BCBSTX — Applied Behavioral Analysis PA Requirement Checklist (rev. 4/26/2024) — routes ABA PA to BCBSTX\'s own BH intake fax (1-888-530-9809) or Availity Essentials, no Magellan reference.');
const BCBSTX_PA_CODE_GRID = src(
  'https://www.bcbstx.com/docs/provider/tx/provider-medicaid/um/prior-auth-proc-code-grid-06012026.pdf',
  'BCBSTX — Texas Medicaid Benefit Prior Authorization Procedure Code List — lists 97151,97153,97154,97155,97156,97158 each as "Applied Behavioral Health (Allowable only for members 20 years of age or younger)," PA-required, eff. 1/1/2024. No 0362T or 99366 row found.'
);
const BCBSTX_MEDICAID_MANUAL = src('https://www.bcbstx.com/content/dam/hcsc/docs/provider/tx/provider-medicaid/education/2067877-758408-0324-TX-Medicaid-STAR-CHIP-STARKids-Provider-Manual-Handbook.pdf', 'BCBSTX — Texas Medicaid STAR, CHIP, and STAR Kids Provider Manual — no dedicated Autism Services chapter; general PA turnaround 3 business days.');

const CCHP_ABA_TRAINING = src(
  'https://www.cookchp.org/siteassets/documents/pdfs/provider-relations/applied-behavior-analysis-011525-.pdf',
  "Cook Children's Health Plan — Applied Behavior Analysis provider training (rev. 1/15/2025) — 97151 caps 6 hrs/24 units, 30-day authorization window, HO modifier only; 97153/97154 no required modifier; 97155/97156/97158 need HO or HN; 99366 no modifier, F84.0-only, capped 2x/year, needs ≥3 licensed professionals incl. the LBA, ≥30 min; telehealth (95) allowed on 97151,97155,97156,97158,99366; 8-hr/day combined direct-treatment cap across 97153/97154/97155/97158."
);
const CCHP_ACUTE_PA_TRAINING = src('https://www.cookchp.org/siteassets/documents/pdfs/electronic-visit/acute-prior-authorization-including-pdn--aba-062426.pdf', "Cook Children's Health Plan — Acute Prior Authorization (Including PDN & ABA) provider training (rev. 6/24/2026) — determination letters delivered via EpicCare Link In Basket only, not faxed; fax only while portal access is pending.");
const CCHP_PA_SEARCH = src('https://www.cookchp.org/providers/prior-authorization-search/', "Cook Children's Health Plan — Prior Authorization Search & Submission page.");
const CCHP_CCP_FORM = src('https://www.cookchp.org/siteassets/documents/pdfs/provider-manual/comprehensive-care-program-prior-authorization-request-form-2024.pdf', "Cook Children's Health Plan — Comprehensive Care Program Prior Authorization Request Form (2024), with a dedicated ABA section.");

const PCHP_PA_REQUIREMENTS = src(
  'https://providers.parklandhealthplan.com/Uploads/Public/Documents/Provider/PCHP%202025%20Prior%20Authorization%20Requirements%20v2.pdf',
  'Parkland Community Health Plan — Prior Authorization Requirements (eff. 9/1/2025) — states "Prior authorization is required for ABA evaluation, initial course of treatment, and subsequent re-evaluations for recertification"; code table lists 97151,97152,97153,97154,97155,97156,97157,97158,99366 under "Applied Behavior Analysis" — 0362T absent.'
);
const PCHP_ABA_OVERVIEW = src('https://parklandhealthplan.com/living-well/blog/articles/aba', 'Parkland Community Health Plan — ABA benefit overview (member-facing) — confirms STAR-only (CHIP excluded), ages 0-20, ASD dx within 3 years.');
const PCHP_BH_TRANSITION = src('https://parklandhealthplan.com/living-well/blog/articles/pchp-benefits-update-changes-to-behavioral-health-services/', 'Parkland Community Health Plan — Behavioral Health Services Transition Announcement — BH insourced from Carelon effective 9/1/2025; providers had to re-contract directly with PCHP.');
const PCHP_BH_NETWORK_PAGE = src('https://providers.parklandhealthplan.com/our-network/behavioral-health/', 'Parkland Community Health Plan — Behavioral Health network page.');

const EPH_ABA_CHECKLIST = src(
  'https://elpasohealth.com/documents/ABA-REQUEST-CHECKLIST-final-2022.pdf',
  "El Paso Health — ABA Request Checklist (eff. 2/1/2022) — evaluation (97151, 6-hr/24-unit cap, HO only) needs signed referral + diagnostic documentation, authorization valid 60 days from requested date; 90-day extension (97155) needs attendance logs + LBA progress summary; 180-day recert (97151 again) 'does not require prior auth, will be reviewed upon submission.'"
);
const EPH_DOC_MEMO = src('https://www.elpasohealth.com/pdf/EPH%20-%20Documententaton%20for%20ABA%20Authorization%20_.pdf', "El Paso Health — Documentation Required for ABA Authorizations (memo, 5/15/2026) — attendance logs (child + caregiver) required with every extension/recert; <85% attendance triggers a documentation requirement.");
const EPH_DX_MEMO = src('https://www.elpasohealth.com/pdf/EPH-PR-Comprehensive%20Diagnostic%20Evaluation%20for%20Autism%20Services.pdf', "El Paso Health — Comprehensive Diagnostic Evaluation for Autism Services (memo, 5/15/2026) — requires a validated standardized tool (ADOS, ADI-R, or CARS named); screening tools (e.g. M-CHAT-R/F) do not qualify.");
const EPH_QRG = src('https://www.elpasohealth.com/pdf/EPH-STARCHIPSTARPLUS%20Quick%20Reference%20Guide.pdf', 'El Paso Health — STAR/CHIP/STAR+PLUS Quick Reference Guide.');

const FIRSTCARE_PA_LIST = src(
  'https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR/PA-List.pdf',
  'FirstCare — Texas Medicaid/CHIP Notification/Prior Authorization Codes (eff. 7/1/2026) — lists 97151,97153,97154,97155,97156,97158,99366 as requiring authorization, filed under "Therapy services." 97152, 97157, 0362T, 0373T absent from this Medicaid-specific list (they appear only in FirstCare\'s separate commercial Medical Coverage Policy #206).'
);
const FIRSTCARE_POLICY_206 = src('https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf', 'FirstCare — Medical Coverage Policy #206: Autism Spectrum Disorder — explicitly defers Medicaid coverage decisions to the TMPPM; confirms the mandate\'s $36,000/yr cap does not apply to Medicaid.');
const FIRSTCARE_PROVIDER_MANUAL = src('https://www.firstcare.com/-/media/project/bsw/sites/firstcare/documents/STAR-CHIP-Provider-Manual.pdf', 'FirstCare — 2026 STAR and CHIP Provider Manual — general PA turnaround 3 working days; submit ≥5 days before anticipated service date.');
const FIRSTCARE_STAR_STATUS = src('https://www.firstcare.com/en/Individuals-and-Families/STAR-CHIP/STAR-Medicaid', 'FirstCare — STAR Medicaid plan-status page — states plans end 8/31/2026, subject to regulatory approval.');

/* -------------------- gap-fill correction pass: EDI payer-ID research -------------------- */
const PVERIFY_PAYER_LIST_PAGE = src('https://pverify.com/payer-list/', "pVerify's public payer-list page (distinct from the March-2026 PDF cited elsewhere in this file) — JS-rendered, so entries below were confirmed via repeated, consistently-matching queries rather than a raw-HTML grep.");
const OPTUM_RT_ELIGIBILITY_PAYER_LIST = src('https://www.optum.com/content/dam/o4-dam/resources/pdfs/guides/optuminsight-rt-eligibility-payer-list.pdf', "Optum's official Real-Time (270/271) Eligibility Payer List (last-modified 5/22/2025) — downloaded and text-extracted directly.");
const CHC_EDI_PAGE = src('https://provider.communityhealthchoice.org/resources/him-hipaa/', 'Community Health Choice — HIM/HIPAA/EDI resources page — states "Community currently receives electronic transactions through the following clearinghouse: Change Healthcare... Payor ID: 60495" (does not specify claims- vs. eligibility-specific).');
const BCBSTX_MEDICAID_ELIGIBILITY_PAGE = src('https://www.bcbstx.com/provider/medicaid/claims-and-eligibility/eligibility', 'BCBSTX — Medicaid Claims and Eligibility page — states Availity payer ID 66002 for STAR/CHIP/STAR Kids eligibility (single combined ID, no per-program split stated).');
const CCHP_EDI_PAGE = src('https://www.cookchp.org/providers/electronic-submission-services/', "Cook Children's Health Plan — Electronic Submission Services page — states \"CHIP Payor ID is CCHP1 and STAR/STAR Kids Payor ID is CCHP9.\"");
const PCHP_EDI_PAGE = src('https://providers.parklandhealthplan.com/claims-payments/electronic-data-interchange/', 'Parkland Community Health Plan — Electronic Data Interchange page — states "The Parkland Community Health Plan Payer ID for electronic claims is Payer ID # 66917," naming Availity, TriZetto Provider Solutions, Office Ally, Emdeon, and Claim Logic as accepted paths.');
const EPH_PAYER_ID_PDF = src('https://www.elpasohealth.com/documents/EPH-PR-El-Paso-Health-Payer-Identifications---Updated-09.24.pdf', "El Paso Health — \"Availity/TPS Payer Identifications\" (updated 9/24) — states the plan's agreement is with Availity and TriZetto Provider Solutions only, with per-line-of-business codes (STAR/STAR+PLUS: EPF02; CHIP: EPF03; Healthcare Options: EPF37; Preferred Administrators: EPF10; Preferred Administrators Children's Hospital: EPF11) and no mention of Change Healthcare or Optum anywhere.");
const TMHP_FIRSTCARE_EXIT_NEWS = src('https://www.tmhp.com/news/2026-07-17-baylor-scott-white-and-firstcare-health-plans-will-end-participation-texas-medicaid', 'TMHP news (7/17/2026) — "Baylor Scott & White and FirstCare Health Plans Will End Participation in Texas Medicaid" — TMHP will not accept claims with dates of service after 8/31/2026.', true);
const HHS_FIRSTCARE_EXIT_NEWS = src('https://www.hhs.texas.gov/provider-news/2026/07/21/evv-impacts-baylor-scott-white-firstcare-mcos-end-participation-texas-medicaid-managed-care', 'Texas HHS provider news (7/21/2026) — confirms Baylor Scott & White/FirstCare\'s exit from Texas Medicaid managed care and resulting EVV impacts.', true);

/* -------------------- Layer 3: TMPPM-baseline code grid -------------------- */
/* Shared across texas-medicaid and all 8 Medicaid MCO guides — every MCO
   guide's existing prose already establishes it applies these state
   criteria unchanged, with no distinct ABA policy of its own. */

const NOT_IN_STATE_CODE_SET: Pick<CodeGridEntry, 'covered' | 'paRequired' | 'unitCap' | 'capPeriod' | 'posAllowed' | 'telehealth' | 'modifiers'> = {
  covered: 'unverified',
  paRequired: 'unverified',
  unitCap: 'unverified',
  capPeriod: 'unverified',
  posAllowed: ['unverified'],
  telehealth: 'unverified',
  modifiers: ['unverified'],
};

function notInStateCodeSet(code: string): CodeGridEntry {
  return {
    ...NOT_IN_STATE_CODE_SET,
    notes: `${code} does not appear anywhere in the TMPPM Children's Services Handbook §2.3 Autism Services or in TMHP's "AUTISM SERVICES" static fee schedule (PRCR615C) — cross-checked against both independently. Texas's actual THSteps-CCP Autism Services billable code set appears to be limited to 97151, 97153, 97154, 97155, 97156, 97158, and 99366. Verify via: TMHP provider relations / Online Fee Lookup — confirm whether this code is billable under Texas Medicaid THSteps-CCP Autism Services at all, under a different program, or not covered.`,
    fieldStatus: {
      covered: 'unverified',
      paRequired: 'unverified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [TMPPM_HANDBOOK, AUTISM_FEE_SCHEDULE],
  };
}

const DAILY_CAP_NOTE = '8-hour (32-unit) combined daily direct-treatment cap, shared with 97153, 97154, 97155, and 97158 (TMPPM §2.3.12).';
const SETTINGS: string[] = ['office', 'home', 'clinic', 'community'];

function tmppmEntry(code: '97151' | '97153' | '97154' | '97155' | '97156' | '97158' | '99366', planNote?: string): CodeGridEntry {
  const base: Record<string, CodeGridEntry> = {
    '97151': {
      covered: 'Yes — ABA Initial Evaluation / Re-evaluation, by the LBA',
      paRequired: "Required — CCP PA form + signed prescriber referral; not reimbursable unless the evaluation was submitted for authorization of payment; must be billed within 30 calendar days of the first date of service",
      unitCap: '24 units (6 hours) per evaluation or re-evaluation event',
      capPeriod: 'per evaluation event; re-evaluations authorized no more than once every 180 days',
      posAllowed: SETTINGS,
      telehealth: "Yes — 95 modifier, synchronous audio-visual only, delivered by the LBA (LaBAs and BTs/RBTs may not deliver any service remotely)",
      modifiers: ['HO (required — LBA only)'],
      notes: planNote,
    },
    '97153': {
      covered: 'Yes — direct 1:1 ABA treatment (BT-complexity level), delivered per treatment-plan protocol',
      paRequired: 'Required — covered under the treatment authorization (90-day initial + 90-day extension, then 180-day recertifications; no prescriber signature on the 90-day extension since 4/1/2025)',
      unitCap: `Shares the ${DAILY_CAP_NOTE}`,
      capPeriod: 'day',
      posAllowed: SETTINGS,
      telehealth: 'No — 1:1 direct treatment must be delivered in person',
      modifiers: ['No modifier required (HO/HN/HM may be reported for information only)'],
      notes: ['Either 97153 or 97155 may be billed for direct individual treatment hours — bill the code matching who delivered the session.', planNote].filter(Boolean).join(' '),
    },
    '97154': {
      covered: 'Yes — direct group ABA treatment (BT-complexity level; group is 2–8 children/youth)',
      paRequired: 'Required — covered under the treatment authorization (90-day initial + 90-day extension, then 180-day recertifications)',
      unitCap: `Shares the ${DAILY_CAP_NOTE}`,
      capPeriod: 'day',
      posAllowed: SETTINGS,
      telehealth: 'No — group direct treatment must be delivered in person',
      modifiers: ['No modifier required (HO/HN/HM may be reported for information only)'],
      notes: ['Either 97154 or 97158 may be billed for direct group treatment hours.', planNote].filter(Boolean).join(' '),
    },
    '97155': {
      covered: 'Yes — protocol modification / direct 1:1 time by the LBA (or delegated LaBA)',
      paRequired: 'Required — covered under the treatment authorization (90-day initial + 90-day extension, then 180-day recertifications)',
      unitCap: `Shares the ${DAILY_CAP_NOTE}`,
      capPeriod: 'day',
      posAllowed: SETTINGS,
      telehealth: 'Yes — 95 modifier, synchronous audio-visual, delivered by the LBA only',
      modifiers: ['HO or HN (one required)'],
      notes: [
        'Also the code used to bill the required progress summary submitted after the first 90 days of treatment. Only DIRECT supervision (LBA observing the LaBA/BT with the client) is reimbursable under this code — indirect supervision (caseload review, data discussion) is not billable.',
        planNote,
      ].filter(Boolean).join(' '),
    },
    '97156': {
      covered: 'Yes — parent/caregiver education & training, by the LBA (or delegated LaBA)',
      paRequired: 'Required — covered under the treatment authorization',
      unitCap: 'unverified — NOT part of the 8-hour combined daily direct-treatment cap; no separate daily/weekly unit cap found in TMPPM §2.3',
      capPeriod: 'unverified',
      posAllowed: SETTINGS,
      telehealth: 'Yes — 95 modifier, synchronous audio-visual, delivered by the LBA (LaBAs may not deliver this — or any — service via telehealth, even by delegation)',
      modifiers: ['HO or HN (one required)'],
      notes: ['Continued treatment authorization considers caregiver attendance at ≥85% of planned sessions.', planNote].filter(Boolean).join(' '),
    },
    '97158': {
      covered: 'Yes — group protocol modification, by the LBA (or delegated LaBA)',
      paRequired: 'Required — covered under the treatment authorization',
      unitCap: `Shares the ${DAILY_CAP_NOTE}`,
      capPeriod: 'day',
      posAllowed: SETTINGS,
      telehealth: 'Yes — 95 modifier, synchronous audio-visual, delivered by the LBA only',
      modifiers: ['HO or HN (one required)'],
      notes: planNote,
    },
    '99366': {
      covered: 'Yes — interdisciplinary team meeting, attended by qualified nonphysician health-care providers',
      paRequired: "Not separately authorized — reimbursable when a PA for ABA evaluation, re-evaluation, or treatment is already on file; reimbursement limited to primary diagnosis F84",
      unitCap: 'unverified — no explicit per-meeting unit cap found in TMPPM §2.3 beyond the diagnosis/PA gating rule; no more than one Medicaid-enrolled participant per specialty may bill',
      capPeriod: 'unverified',
      posAllowed: [...SETTINGS, 'remote participation for team members (95 modifier)'],
      telehealth: 'Yes — 95 modifier for remote participation by team members',
      modifiers: ['No modifier required (95 for remote participation)'],
      notes: ['School-district personnel may participate and count toward the 3-participant licensed-professional minimum but are not separately reimbursable.', planNote].filter(Boolean).join(' '),
    },
  };
  const entry = base[code];
  return {
    ...entry,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: entry.unitCap.startsWith('unverified') ? 'unverified' : 'verified',
      posAllowed: 'verified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [TMPPM_HANDBOOK, AUTISM_FEE_SCHEDULE],
  };
}

function tmppmCodeGrid(planNotes?: Partial<Record<'97151' | '97153' | '97154' | '97155' | '97156' | '97158' | '99366', string>>): Record<string, CodeGridEntry> {
  return {
    '97151': tmppmEntry('97151', planNotes?.['97151']),
    '97152': notInStateCodeSet('97152'),
    '97153': tmppmEntry('97153', planNotes?.['97153']),
    '97154': tmppmEntry('97154', planNotes?.['97154']),
    '97155': tmppmEntry('97155', planNotes?.['97155']),
    '97156': tmppmEntry('97156', planNotes?.['97156']),
    '97157': notInStateCodeSet('97157'),
    '97158': tmppmEntry('97158', planNotes?.['97158']),
    '0362T': notInStateCodeSet('0362T'),
    '0373T': notInStateCodeSet('0373T'),
    '99366': tmppmEntry('99366', planNotes?.['99366']),
  };
}

/* QA correction (2026-07-23): Driscoll's own live PA-lookup portal
   (webapps.driscollhealthplan.com/priorauthcheck) was fetched this pass and
   lists BOTH 97152 and 97157 as "AUTHORIZATION REQUIRED" for STAR/STAR Kids
   (excluded on CHIP/CHIP Perinate), each entry citing "TMPPM Children
   Services Handbook Volume 2, Section 2.3, Medicaid Autism Services Policy"
   as its own review-criteria source. This directly contradicts the shared
   tmppmCodeGrid()'s notInStateCodeSet() finding for these two codes AS
   APPLIED TO DRISCOLL SPECIFICALLY — even though 97152/97157 independently
   confirmed absent from the TMPPM handbook text and the Autism Services
   static fee schedule (PRCR615C) as currently published. Overridden below
   for driscoll-health-plan only; not changed for texas-medicaid or the other
   7 MCO guides, since no equivalent finding exists for them this pass. */
function driscollPortalCode(code: string, description: string): CodeGridEntry {
  return {
    covered: `Yes, per Driscoll's own live PA-lookup portal (STAR, STAR Kids; excluded on CHIP/CHIP Perinate) — contradicts the "not on Texas's billable ABA code set" finding shipped for ${code} elsewhere in this file (texas-medicaid and the other 7 MCO guides); treat as a confirmed Driscoll-specific exception, not the statewide default.`,
    paRequired: `Required, effective 2/1/2025, per Driscoll's PA portal (${description}).`,
    unitCap: 'unverified — not shown on the PA portal entry',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not shown on the PA portal entry'],
    telehealth: "95 modifier required for telehealth visits, per Driscoll's PA portal",
    modifiers: ['HO (LBA)', 'HN (LaBA)', 'HM (BT) — required on auth requests and claims, as applicable', '95 (telehealth)'],
    notes: `Driscoll's PA portal cites "TMPPM Children Services Handbook Volume 2, Section 2.3, Medicaid Autism Services Policy" as its review criteria for ${code}, even though ${code} does not appear anywhere in that handbook chapter's text or in TMHP's "AUTISM SERVICES" static fee schedule (PRCR615C) — independently confirmed this pass. Verify directly with Driscoll before assuming this applies to any other Texas Medicaid plan.`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'verified',
      modifiers: 'verified',
    },
    sources: [DRISCOLL_PA_PORTAL],
  };
}

/* Gap-fill: Parkland Community Health Plan's own PA Requirements list
   (eff. 9/1/2025) explicitly names 97152 and 97157 under its "Applied
   Behavior Analysis" PA category — the same kind of plan-specific
   contradiction of the shared notInStateCodeSet() finding as Driscoll's
   above, independently confirmed for Parkland only, not the other 12
   guides sharing tmppmCodeGrid(). */
function pchpPaListCode(code: string): CodeGridEntry {
  return {
    covered: `Yes, per Parkland Community Health Plan's own Prior Authorization Requirements list (eff. 9/1/2025) — contradicts the "not on Texas's billable ABA code set" finding shipped for ${code} elsewhere in this file; treat as a confirmed PCHP-specific exception, not the statewide default.`,
    paRequired: `Required — PCHP's PA Requirements document states plainly that PA is required for ABA evaluation, initial course of treatment, and re-evaluations/recertification, and lists ${code} explicitly under "Applied Behavior Analysis."`,
    unitCap: 'unverified — not shown on PCHP\'s PA list; the document points to a supporting-documentation appendix not independently verified this pass',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not shown on PCHP\'s PA list'],
    telehealth: 'unverified — not addressed in PCHP\'s PA Requirements document',
    modifiers: ['unverified — not shown on PCHP\'s PA list'],
    notes: `PCHP's PA Requirements document (eff. 9/1/2025) lists ${code} under "Applied Behavior Analysis" even though ${code} does not appear anywhere in the TMPPM Children's Services Handbook §2.3 text or TMHP's "AUTISM SERVICES" static fee schedule (PRCR615C) — independently confirmed this pass. Verify current documentation requirements directly with PCHP provider services (1-888-672-2277) before assuming this applies to any other Texas Medicaid plan.`,
    fieldStatus: {
      covered: 'verified',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [PCHP_PA_REQUIREMENTS],
  };
}

/* -------------------- Layer 4: rate tables -------------------- */

const TX_MEDICAID_RATES: RateTable = {
  source: 'TMHP static fee schedule "AUTISM SERVICES" (PRCR615C), Licensed Behavior Analyst (LBA) provider type; cross-confirmed against the HHSC 9/1/2025 rate-adjustment packet already cited in texas.ts prose.',
  effectiveDate: '2025-09-01',
  byCode: {
    '97151': { rate: '$27.56 per 15-min unit (HO modifier only)', unit: '15min' },
    '97152': { rate: 'unverified — code not found in the Autism Services fee schedule or TMPPM §2.3', unit: 'unverified' },
    '97153': { rate: '$14.50 per 15-min unit (no modifier required)', unit: '15min' },
    '97154': { rate: '$1.63 per 15-min unit (no modifier required; rate last reviewed 3/1/2024, unchanged in the 9/1/2025 action)', unit: '15min' },
    '97155': { rate: 'Modifier-tiered — see modifierTiers', unit: '15min', modifierTiers: { HN: '$20.08 (LaBA)', HO: '$25.10 (LBA)' } },
    '97156': { rate: 'Modifier-tiered — see modifierTiers', unit: '15min', modifierTiers: { HN: '$18.40 (LaBA)', HO: '$23.01 (LBA)' } },
    '97157': { rate: 'unverified — code not found in the Autism Services fee schedule or TMPPM §2.3', unit: 'unverified' },
    '97158': { rate: 'Modifier-tiered — see modifierTiers (rates last reviewed 3/1/2024, unchanged in the 9/1/2025 action)', unit: '15min', modifierTiers: { HN: '$2.25 (LaBA)', HO: '$2.81 (LBA)' } },
    '0362T': { rate: 'unverified — code not found in the Autism Services fee schedule or TMPPM §2.3', unit: 'unverified' },
    '0373T': { rate: 'unverified — code not found in the Autism Services fee schedule or TMPPM §2.3', unit: 'unverified' },
    '99366': { rate: '$33.96 per encounter (no modifier required; LBA provider type; rate last reviewed 3/1/2024)', unit: 'per encounter' },
  },
  sources: [AUTISM_FEE_SCHEDULE, HHSC_FEE_PACKET, TMHP_FEE_LOOKUP],
};

function mcoUnverifiedRates(planName: string): RateTable {
  return {
    source: `Not separately published by ${planName} — contract-specific. The TMHP "AUTISM SERVICES" state fee schedule (PRCR615C) is the public benchmark MCO contracts generally track, per ${planName}'s own guide prose, but the actual contracted rate is confidential.`,
    effectiveDate: 'unverified',
    byCode: {
      '97151': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($27.56/unit, HO)', unit: 'unverified' },
      '97152': { rate: 'unverified', unit: 'unverified' },
      '97153': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($14.50/unit)', unit: 'unverified' },
      '97154': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($1.63/unit)', unit: 'unverified' },
      '97155': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($20.08 HN / $25.10 HO)', unit: 'unverified' },
      '97156': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($18.40 HN / $23.01 HO)', unit: 'unverified' },
      '97157': { rate: 'unverified', unit: 'unverified' },
      '97158': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($2.25 HN / $2.81 HO)', unit: 'unverified' },
      '0362T': { rate: 'unverified', unit: 'unverified' },
      '0373T': { rate: 'unverified', unit: 'unverified' },
      '99366': { rate: 'unverified — see texas-medicaid rates for the state benchmark ($33.96/encounter)', unit: 'unverified' },
    },
    sources: [AUTISM_FEE_SCHEDULE],
  };
}

/* ==================== texas-medicaid ==================== */

const texasMedicaidEdi: EdiRouting = {
  payerId: { pverify: '00186', availity: 'unverified', changeHealthcare: 'unverified' },
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
      "2110C EB loop carries the base eligibility/benefit segment (EB01='1' covered / 'I' non-covered, EB04='OT', EB05=program short code, e.g. 'STAR'); the Managed Care Plan Code itself is REF02 in the SAME loop's REF segment where REF01='18' (per §11: 'Texas Medicaid will send \"18\" in REF01 to indicate the presence of a...Managed Care Plan Code in the REF02 element'). A separate 2120C loop, present only for members with an assigned PCP or provider lock-in, carries the Primary Care Physician's name — NOT the MCO name.",
    mcoCarrierCodes: {
      '1': 'STAR (EB05 short code: STAR)',
      '2': 'STAR PLUS (EB05 short code: STRP)',
      '6': 'Foster Care Managed Care / STAR Health (EB05 short code: STRH)',
      '7': "Children's Medicaid Dental Services (EB05 short code: DENT)",
      '8': 'CHIP (EB05 short code: CHIPMCO)',
      '9': 'CHIP Dental (EB05 short code: CHIPDENT)',
      K: 'STAR Kids (EB05 short code: STRK)',
    },
    eligibilitySpanGranularity:
      "Date range, not a fixed monthly bucket — DTP*356 (coverage begin) and DTP*357 (coverage end) in D8 (CCYYMMDD) format on the 'Covered Managed Care' EB segment carry the actual enrollment span, which can run for any number of days/months per the companion guide's own example (20141001–20150430).",
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
    'payerId.availity': "No distinct \"Texas Medicaid\"/\"TMHP\" FFS entry appears in Availity's public 837/270-271 payer list (searched in full) — FFS Medicaid eligibility is more commonly checked directly with TMHP than via Availity as a clearinghouse; confirm via Availity onboarding if a code exists.",
    'payerId.changeHealthcare': 'Optum/Change Healthcare payer finder — not checked this pass.',
    'medicaid271Notes.mcoCarrierCodes':
      "The table above is the verified PROGRAM code table (STAR/STAR Kids/STAR Health/CHIP), populated in EB05 — it is NOT a per-MCO health-plan lookup (e.g., there is no fixed code for \"Superior\" vs. \"Wellpoint\" in this companion guide). The actual MCO name rides as free text in REF02 when REF01=18; if a fixed MCO-code crosswalk exists elsewhere, it wasn't located in this document — confirm via the TMHP EDI Help Desk (1-888-863-3638, option 4).",
  },
  sources: [COMPANION_GUIDE_270_271, PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST],
};

/* ==================== superior-healthplan-texas ==================== */

const superiorEdi: EdiRouting = {
  payerId: { pverify: '00393', availity: '39188', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'payerId.availity':
      "Availity's list also carries several Centene-corporate entries (SHP11/FSHP11/DSHP11 \"SUPERIOR HEALTH/CENTENE CORP\") alongside the clean-name match used here (39188, \"Superior Health Plan of Texas\") — confirm 39188 is correct for professional (837P) 270/271 eligibility specifically, not just claims.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, SUPERIOR_ABA_LAUNCH, TMHP_AUTISM_BENEFIT_RELEASE],
};

/* ==================== texas-childrens-health-plan ==================== */

const tchpEdi: EdiRouting = {
  payerId: { pverify: '00275', availity: 'TXCSM', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'payerId.availity':
      "Availity separately lists \"TEXAS CHILDRENS HEALTH PLAN COMM\" (76048/TXCHLDCOMM) as a distinct commercial product — TXCSM (\"TEXAS CHILDRENS HEALTH PLAN STAR\") is the Medicaid-line code used here; do not conflate the two when routing.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, TCHP_GUIDELINE],
};

/* ==================== wellpoint-texas ==================== */

const wellpointEdi: EdiRouting = {
  payerId: { pverify: '06067', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.availity':
      "Availity's public list has no entry branded \"Wellpoint\" for Texas — only pre-rebrand \"Amerigroup\" entries split by region (26374 Houston, 26375 Ft. Worth, 26378 Multiple States, 27518 generic). The January 2024 Amerigroup-to-Wellpoint rebrand changed no PA or claims processes per texas.ts's own verified prose, so one of these Amerigroup-branded codes likely still routes eligibility, but which regional code applies is not resolvable from the payer list alone — confirm via Availity Essentials onboarding or the plan's Prior Authorization Requirements page.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, WELLPOINT_TX_BH_DOC],
};

/* ==================== unitedhealthcare-community-plan-texas ==================== */

const uhcCommunityEdi: EdiRouting = {
  payerId: { pverify: '00192', availity: '87726', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Optum Behavioral Health',
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
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify':
      "00192 is the generic national \"United Healthcare\" pVerify entry, not a Texas-Community-Plan-specific code — the public list doesn't break this payer out by state. pVerify separately lists UHG007 \"United Healthcare - Optum Behavioral Solutions\" as a candidate BH-specific code.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.administratorPayerId':
      "UHC's STAR Kids PA list confirms ABA is NOT on the medical PA pipeline and routes to the designated BH network (888-887-9003) — but no distinct EDI payer ID for that BH network was confirmed for Texas specifically. pVerify's \"UHG007 United Healthcare - Optum Behavioral Solutions\" is an unconfirmed candidate. Confirm via uhcprovider.com or the BH line directly.",
    'bhCarveOut.twoHopRequired':
      "Inferred true because prior authorization demonstrably requires a second contact (Optum BH, 888-887-9003) distinct from UHC's medical PA tool — but whether the 270/271 ELIGIBILITY check itself requires a second EDI hop (vs. only the UM/PA step) was not independently confirmed.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, UHC_STAR_KIDS_PA_LIST, UHC_TX_PA_PAGE, OPTUM_STATE_MANDATES],
};

/* ==================== aetna-better-health-texas ==================== */

const aetnaBetterHealthEdi: EdiRouting = {
  payerId: { pverify: '000944', availity: '38692', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify separately lists \"AETNA BETTER HEALTH (TX) CHIP\" (000945) as a distinct product from the Medicaid line (000944) used here — confirm the member's line of business before routing.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, AETNA_BH_TX_MANUAL, TMHP_AUTISM_BENEFIT_RELEASE],
};

/* ==================== molina-healthcare-texas ==================== */

const molinaEdi: EdiRouting = {
  payerId: { pverify: '00152', availity: '20554', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, MOLINA_TX_PA_PAGE],
};

/* ==================== community-first-health-plans ==================== */

const communityFirstEdi: EdiRouting = {
  payerId: { pverify: '01390', availity: 'COMMF', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'verified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify lists two candidates — \"01390 Community First Health Plans\" (used here) and \"06106 Community First Health Plan\" — not resolved to one; confirm which routes eligibility before automating.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, COMMUNITY_FIRST_BILLING_GUIDELINES],
};

/* ==================== driscoll-health-plan ==================== */

const driscollEdi: EdiRouting = {
  payerId: { pverify: '01090', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
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
      "pVerify lists two candidates — \"01090 Driscoll Health Plan\" (used here) and \"002472 DRISCOLL CHILDRENS HEALTH PLAN\" — not resolved to one.",
    'payerId.availity':
      "Availity's public list only surfaces a CHIP-specific product (\"DRISCOLL CHILDRENS PLAN-CHIP\", 74284/DCHCH) — no distinct STAR/STAR Kids code was found, and it's unconfirmed whether the CHIP code also serves the Medicaid lines. Confirm via Availity Essentials onboarding.",
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, DRISCOLL_PA_PORTAL],
};

/* ==================== aetna-texas (commercial) ==================== */

const aetnaTxCommercialEdi: EdiRouting = {
  payerId: { pverify: '00001', availity: '60054', changeHealthcare: '60054' },
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
      'Not researched to a primary source this pass — confirm via Aetna provider services or the ABA precertification form (GR-69017-4) whether Aetna administers ABA in-house or via a separate BH carve-out for Texas commercial business.',
    'payerId.pverify':
      "pVerify separately lists \"TEXAS HEALTH AETNA\" (00875) — a distinct Texas Health Resources/Aetna joint-venture plan, not standard Aetna commercial. Don't route a Texas Health Aetna card on 00001.",
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, AETNA_CPB0554, AETNA_CPB0648],
};

const aetnaTxCommercialCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  ['97151', '97152', '97153', '97154', '97155', '97156', '97157', '97158', '0362T', '0373T', '99366'].map((code) => [
    code,
    {
      covered: 'Yes — for ASD, per national policy CPB 0554 (paired with CPB 0648)',
      paRequired: 'Required — precertification (form GR-69017-4), submitted via Availity or phone; reauthorization commonly ~6 months (verify per plan)',
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: ['unverified'],
      telehealth: 'unverified',
      modifiers: ['unverified'],
      notes:
        'Verify via: Aetna provider services / precertification — CPB 0554 & 0648 are national medical-necessity policies only; no Texas-specific or national ABA coding/reimbursement policy was located.',
      fieldStatus: {
        covered: 'verified',
        paRequired: 'verified',
        unitCap: 'unverified',
        posAllowed: 'unverified',
        telehealth: 'unverified',
        modifiers: 'unverified',
      },
      sources: [AETNA_CPB0554, AETNA_CPB0648],
    },
  ])
);

/* ==================== cigna-texas (commercial) ==================== */

const cignaTxCommercialEdi: EdiRouting = {
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

/* QA correction (2026-07-23): EN0499 was re-fetched and read in full this
   pass. Its coding table lists 97151-97158/0362T/0373T (NOT 99366) as
   "Considered Medically Necessary when criteria...are met" but the document
   contains zero occurrences of "prior authorization," "precertification," or
   any per-code PA distinction — there is no statement anywhere in it that
   assessment codes (97151/97152/0362T) are PA-exempt while treatment codes
   require a PA form. The previous version of this field asserted that
   distinction as 'verified' against this source; it is a miscitation and is
   downgraded to 'unverified' below. */
const cignaTxCodeGridNotes: Record<string, string> = {
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

const cignaTxCommercialCodeGrid: Record<string, CodeGridEntry> = Object.fromEntries(
  Object.entries(cignaTxCodeGridNotes).map(([code, paRequired]) => [
    code,
    {
      covered:
        code === '99366'
          ? 'unverified — 99366 (interdisciplinary team meeting) does not appear in EN0499\'s coding table at all; EN0499 does not address interdisciplinary team-meeting billing'
          : 'Yes — for ASD, per national policy EN0499 (no Texas carve-out — confirmed no TX-specific exception in the current edition)',
      paRequired,
      unitCap: 'unverified',
      capPeriod: 'unverified',
      posAllowed: ['unverified'],
      telehealth: 'unverified',
      modifiers: ['unverified'],
      notes:
        'Verify via: Cigna/Evernorth provider services — EN0499 is a medical-necessity policy only; no coding/reimbursement mechanics (unit caps, POS, telehealth modifiers) or per-code PA requirements are published in it.',
      fieldStatus: {
        covered: code === '99366' ? 'unverified' : 'verified',
        paRequired: 'unverified',
        unitCap: 'unverified',
        posAllowed: 'unverified',
        telehealth: 'unverified',
        modifiers: 'unverified',
      },
      sources: [CIGNA_EN0499],
    },
  ])
);

/* ==================== unitedhealthcare-texas (commercial) ==================== */

const uhcTxCommercialEdi: EdiRouting = {
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
      "Provider Express / UHC provider services — UHC administers ABA nationally via Optum's two-step Provider Express authorization, but no distinct Texas-commercial EDI payer ID for that BH pipeline was confirmed. pVerify's \"UHG007 United Healthcare - Optum Behavioral Solutions\" is an unconfirmed candidate.",
    'bhCarveOut.abaRidesOn': 'Same as administratorPayerId.',
    'bhCarveOut.twoHopRequired': 'Same as administratorPayerId.',
  },
  sources: [PVERIFY_PAYER_LIST, AVAILITY_PAYER_LIST, OPTUM_SCC, OPTUM_STATE_MANDATES],
};

const uhcTxCommercialCodeGrid: Record<string, CodeGridEntry> = {
  '97151': uhcTxEntry('32 units/day (≤8 hrs)', ['HN', 'HO', 'HP']),
  '97152': uhcTxEntry('16 units/day (≤4 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97153': uhcTxEntry('32 units/day (≤8 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97154': uhcTxEntry('18 units/day (≤4.5 hrs)', ['HN', 'HM', 'HO', 'HP']),
  '97155': uhcTxEntry('24 units/day (≤6 hrs)', ['HN', 'HO', 'HP']),
  '97156': uhcTxEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97157': uhcTxEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '97158': uhcTxEntry('16 units/day (≤4 hrs)', ['HN', 'HO', 'HP']),
  '0362T': uhcTxEntry('16 units/day (≤4 hrs)', []),
  '0373T': uhcTxEntry('32 units/day (≤8 hrs)', []),
  '99366': uhcTxEntry('unverified', []),
};

function uhcTxEntry(unitCap: string, modifiers: string[]): CodeGridEntry {
  return {
    covered: 'Yes',
    paRequired: "Required — step 1 of Optum's two-step authorization (assessment auth via Provider Express), then step 2 treatment auth; continued-service reviews every 4–6 months",
    unitCap,
    capPeriod: 'day',
    posAllowed: ['unverified'],
    telehealth: 'unverified',
    modifiers,
    notes:
      "Unit caps and modifiers sourced from Optum's national ABA Reimbursement Policy (2022RP501A) — Optum's ABA State Mandates supplement has no Texas entry (confirmed), so this national policy is applied as 'inferred' absent a confirmed Texas-specific override. Verify via: Provider Express / UHC provider services.",
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'verified',
      unitCap: unitCap === 'unverified' ? 'unverified' : 'inferred',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: modifiers.length ? 'inferred' : 'unverified',
    },
    sources: [OPTUM_SCC, OPTUM_REIMBURSEMENT_POLICY, OPTUM_STATE_MANDATES],
  };
}

/* ==================== gap-fill: 6 new TX MCO guides — Layer 1 (EDI) ====================
   Payer IDs below are researched against the same public pVerify/Availity
   payer lists already cited for the other 8 MCO guides in this file; where
   a reliable match could not be confirmed for this specific plan (as
   opposed to a same-named commercial affiliate or an ambiguous multi-entry
   match), the field ships the literal 'unverified' with a verifyVia note
   rather than a guess. */

const chcEdi: EdiRouting = {
  payerId: { pverify: '01071', availity: '48145', changeHealthcare: 'unverified — conflicting candidates (60495 vs. 48145), see verifyVia' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page (JS-rendered) shows 01071 \"Community Health Choice\" (Eligibility: Yes) — confirmed via repeated matching queries, not an independent raw-HTML grep; slightly lower confidence than the Availity figure.",
    'payerId.changeHealthcare':
      "Two authoritative-looking values conflict and neither is picked as a default: (1) 60495, per CHC's own EDI page, which names Change Healthcare directly but doesn't specify claims- vs. eligibility-specific; (2) 48145, per Optum's official Real-Time (270/271) Eligibility Payer List, a document specifically scoped to eligibility — and it matches the Availity ID exactly. Confirm directly with Change Healthcare/Optum or CHC provider services (713-295-2273) before routing.",
    supports270271: 'Availity master payer list (48145, INITLOAD) confirms Availity Essentials routing; also rides the centralized TMHP 270/271 feed described in texasMedicaidEdi.medicaid271Notes.',
    'bhCarveOut.administrator': "CHC's own ABA Medical Review Guideline describes CHC's own UM machinery throughout (frequency tiers, attendance rule, named exclusions) with no external BH vendor named anywhere.",
  },
  sources: [CHC_ABA_GUIDELINE, CHC_HHS_MANUAL, CHC_STAR_QRG, CHC_STARPLUS_QRG, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST, CHC_EDI_PAGE, OPTUM_RT_ELIGIBILITY_PAYER_LIST],
};

const bcbstxMedicaidEdi: EdiRouting = {
  payerId: { pverify: '01017 (STAR/CHIP) / 01352 (STAR Kids)', availity: '66002', changeHealthcare: 'HCSVC' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'inferred',
    'payerId.changeHealthcare': 'inferred',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "pVerify's payer-list page shows TWO distinct Medicaid-specific entries, separate from the commercial BCBSTX code (00220): 01017 \"BCBS Texas Medicaid STAR CHIP\" and 01352 \"BCBS TEXAS MEDICAID STAR Kids.\" Confirmed via repeated matching queries, not an independent raw-HTML grep.",
    'payerId.availity':
      "66002 is stated on BCBSTX's own Medicaid eligibility page (covering STAR/CHIP/STAR Kids together, no per-program split) — but this exact code could NOT be found in Availity's own master payer-list PDF (only commercial BCBSTX-family codes appear there), so it's sourced from the payer's own site pointing at Availity, not independently cross-validated against Availity's published list. Confirm via Availity Essentials onboarding before routing.",
    'payerId.changeHealthcare':
      "HCSVC per Optum's official Real-Time Eligibility Payer List, labeled \"BCBS Texas Medicaid Star CHIP\" — explicitly STAR/CHIP scope; whether it also covers STAR Kids (which has its own distinct pVerify code, 01352) is unconfirmed.",
    supports270271: 'Rides the same centralized TMHP 270/271 feed as every other MCO in this file; also has distinct clearinghouse-side codes across all three networks researched (see payerId fields).',
    'bhCarveOut.administrator':
      "As recently as a 7/5/2023-dated PA summary, BCBSTX directed providers to Magellan for Texas Medicaid behavioral health — a carve-out. BCBSTX announced 'insourcing' of Medicaid behavioral health on 5/10/2024, and every current-generation document found (PA checklist rev. 4/26/2024, Sept. 2024 UM training) routes ABA to BCBSTX's own BH intake fax/Availity, with no Magellan reference. Shipped 'none' for the CURRENT state; if a legacy document still references Magellan, treat it as superseded per BCBSTX's own 2024 announcement.",
  },
  sources: [BCBSTX_MEDICAID_NEWS, BCBSTX_ABA_CHECKLIST, BCBSTX_MEDICAID_MANUAL, BCBSTX_PA_CODE_GRID, PVERIFY_PAYER_LIST_PAGE, BCBSTX_MEDICAID_ELIGIBILITY_PAGE, OPTUM_RT_ELIGIBILITY_PAYER_LIST],
};

const cchpEdi: EdiRouting = {
  payerId: { pverify: '01077', availity: 'CCHP1 (CHIP) / CCHP9 (STAR, STAR Kids)', changeHealthcare: 'unverified — confirmed absent from Optum\'s official Real-Time Eligibility Payer List' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page shows a single 01077 \"Cook Children's Health Plan\" entry (Eligibility: Yes), no CHIP/STAR split — confirmed via repeated matching queries, not an independent raw-HTML grep.",
    'payerId.availity': "Availity's own master list independently confirms both codes, matching Cook Children's own EDI page verbatim (\"CHIP Payor ID is CCHP1 and STAR/STAR Kids Payor ID is CCHP9\") — strong agreement between two independent sources.",
    supports270271: "Confirmed via Availity's master payer list; also rides the centralized TMHP 270/271 feed as every other MCO in this file.",
    'bhCarveOut.administrator': "Cook Children's own 123-page ABA provider training and Acute PA training describe the plan's own EpicCare Link authorization pipeline throughout, with no external BH vendor named anywhere.",
  },
  sources: [CCHP_ABA_TRAINING, CCHP_ACUTE_PA_TRAINING, CCHP_PA_SEARCH, CCHP_CCP_FORM, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST, CCHP_EDI_PAGE, OPTUM_RT_ELIGIBILITY_PAYER_LIST],
};

const pchpEdi: EdiRouting = {
  payerId: { pverify: 'unverified — confirmed absent from pVerify\'s payer list', availity: '66917', changeHealthcare: '66917' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify': 'Searched pVerify\'s payer-list page twice for "Parkland" in any form — no matching row exists. Confirm via pVerify onboarding if this changes.',
    'payerId.availity':
      "66917 is confirmed by THREE independent sources agreeing exactly: Availity's own master payer list, PCHP's own EDI page (\"Payer ID # 66917\"), and Optum's Real-Time Eligibility Payer List — the strongest cross-validation among the 6 new TX guides. One caveat: Optum's list also carries a legacy/alias entry, \"Schaller Anderson Parkland Community PRCHP\" (Schaller Anderson was an earlier third-party administrator) — flagged as likely deprecated but not fully confirmed dead; don't use PRCHP.",
    'payerId.changeHealthcare': 'Same 66917 code confirmed in Optum\'s official Real-Time Eligibility Payer List ("Parkland Community Health Plan 66917 ALL").',
    supports270271: 'Confirmed via Availity/Optum payer lists; also rides the centralized TMHP 270/271 feed as every other MCO in this file.',
    'bhCarveOut.administrator':
      "PCHP transitioned behavioral health administration from Carelon Behavioral Health to direct in-house administration effective 9/1/2025 — providers who had contracted with Carelon for PCHP's BH network had to re-contract directly with PCHP. Shipped 'none' for the CURRENT state; PCHP's own 218-page provider manual (last revised Sept. 2024) still describes a Carelon relationship and is treated as materially out of date for BH/ABA per PCHP's own transition announcement.",
  },
  sources: [PCHP_PA_REQUIREMENTS, PCHP_BH_TRANSITION, PCHP_BH_NETWORK_PAGE, PCHP_ABA_OVERVIEW, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST, PCHP_EDI_PAGE, OPTUM_RT_ELIGIBILITY_PAYER_LIST],
};

const ephEdi: EdiRouting = {
  payerId: {
    pverify: '00796 (branded "El Paso First Health Plans CHIP" — CHIP scope only; STAR/STAR+PLUS coverage under this code unconfirmed)',
    availity: 'EPF02 (STAR/STAR+PLUS), EPF03 (CHIP), EPF37 (Healthcare Options), EPF10/EPF11 (Preferred Administrators)',
    changeHealthcare: 'N/A — El Paso Health\'s own documentation confirms no Change Healthcare/Optum relationship (Availity + TriZetto Provider Solutions only)',
  },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'verified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
  },
  verifyVia: {
    'payerId.pverify':
      "Only one pVerify entry was found — 00796, explicitly branded \"El Paso First Health Plans CHIP\" — despite multiple targeted searches, no separate STAR/STAR+PLUS entry exists on pVerify's list. Whether 00796 also routes STAR/STAR+PLUS eligibility (as the single Availity code EPF02 does not cover CHIP) is unconfirmed; do not assume it does.",
    'payerId.availity':
      "Multiple line-specific codes confirmed by full agreement between El Paso Health's own \"Availity/TPS Payer Identifications\" PDF and Availity's independent master payer list: STAR Medicaid HMO (Premier Plan) + STAR+PLUS = EPF02; CHIP = EPF03; Healthcare Options (HCO) = EPF37; Preferred Administrators = EPF10; Preferred Administrators Children's Hospital = EPF11. Route by line of business, not a single generic code.",
    'payerId.changeHealthcare': "El Paso Health's own payer-ID document states explicitly its clearinghouse agreement is with Availity and TriZetto Provider Solutions (TPS) only, with no mention of Change Healthcare or Optum anywhere; also confirmed absent from Optum's official Real-Time Eligibility Payer List — a verified absence, not an unresearched gap.",
    supports270271: "Confirmed via Availity's master payer list and El Paso Health's own EDI documentation; also rides the centralized TMHP 270/271 feed as every other MCO in this file.",
    'bhCarveOut.administrator': "El Paso Health's own ABA Request Checklist and 2026 documentation memos describe the plan's own PA pipeline (portal, fax, phone) throughout, with no external BH vendor named anywhere.",
  },
  sources: [EPH_ABA_CHECKLIST, EPH_DOC_MEMO, EPH_DX_MEMO, EPH_QRG, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST, EPH_PAYER_ID_PDF, OPTUM_RT_ELIGIBILITY_PAYER_LIST],
};

const firstcareEdi: EdiRouting = {
  payerId: { pverify: '01105 (generic "FirstCare" — no Medicaid/STAR/CHIP-specific split found)', availity: '94998 (FirstCare Medicaid; distinct from 94999, FirstCare general/commercial)', changeHealthcare: 'unverified — confirmed absent from Optum\'s official Real-Time Eligibility Payer List' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: { administrator: 'none', administratorPayerId: '', abaRidesOn: 'medical', twoHopRequired: false },
  fieldStatus: {
    'payerId.pverify': 'inferred',
    'payerId.availity': 'verified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': "pVerify's payer-list page shows a single generic 01105 \"FirstCare\" entry (Eligibility: Yes) with no Medicaid-specific split — confirmed via repeated matching queries, not an independent raw-HTML grep. IMPORTANT: TMHP and Texas HHS both confirmed (7/17/2026 and 7/21/2026 respectively) that Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026 — TMHP will not accept claims with dates of service after 8/31/2026. Treat this MCO's Medicaid line as expiring, not a stable long-term payer, regardless of any payer ID confirmed here.",
    'payerId.availity': "Availity's master payer list independently confirms two distinct codes: 94998 \"FIRSTCARE - MEDICAID\" and 94999 \"FIRSTCARE\" (general/commercial) — use 94998 for Medicaid members. FirstCare's own public provider pages do not independently state either code.",
    supports270271: "Confirmed via Availity's master payer list; also rides the centralized TMHP 270/271 feed as every other MCO in this file — through 8/31/2026, per the confirmed Medicaid exit above.",
    'bhCarveOut.administrator':
      'FirstCare\'s Medicaid PA code list files ABA under "Therapy services," not "Behavioral health," and no external BH vendor is named for ABA specifically — but FirstCare\'s own contact tables list separate Medical PA (1-800-884-4905) and Behavioral Health PA (1-855-395-9652) lines, and which one actually processes ABA requests is not resolved in FirstCare\'s own documents. Shipped \'none\' (no third-party vendor) as inferred rather than verified, given that internal-routing ambiguity.',
  },
  sources: [
    FIRSTCARE_PA_LIST,
    FIRSTCARE_POLICY_206,
    FIRSTCARE_PROVIDER_MANUAL,
    FIRSTCARE_STAR_STATUS,
    PVERIFY_PAYER_LIST_PAGE,
    AVAILITY_PAYER_LIST,
    OPTUM_RT_ELIGIBILITY_PAYER_LIST,
    TMHP_FIRSTCARE_EXIT_NEWS,
    HHS_FIRSTCARE_EXIT_NEWS,
  ],
};

/* ==================== Layer 2 — STC interpretation maps ====================
   TMHP's own worked 271 transmission examples (TMHP_STC_SECTIONS) show the
   SAME rich MH-bundled STC set returned for "Covered Managed Care"/STAR/CHIP/
   CSHCN EB segments as for Medicaid-Direct — Texas's centralized TMHP EDI
   architecture means MCO members' eligibility rides the SAME state feed, not
   a per-MCO one (unlike Florida/Georgia). All 8 MCO guides below therefore
   inherit the state pattern as 'inferred' rather than shipping fully
   'unverified' — still not 'verified' per-MCO, since no MCO-specific document
   confirms it independently. */

const texasMedicaidStc: StcMap = {
  abaBenefitBucket: 'MH',
  deductibleAppliesToAba: 'no',
  costShareType: 'plan-dependent',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'high',
  fieldStatus: {
    abaBenefitBucket: 'verified',
    deductibleAppliesToAba: 'verified',
    costShareType: 'verified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'verified',
  },
  verifyVia: {
    copayUnit: 'Not addressed by the companion guide (an EDI/transaction-format document) — confirm via provider services.',
    oopMaxApplies: 'Not addressed by the companion guide — confirm via provider services.',
  },
  sources: [TMHP_STC_SECTIONS],
};

function txMcoInferredStc(planName: string): StcMap {
  return inheritFamilyStc(texasMedicaidStc, `${planName}'s eligibility rides TMHP's own centralized 270/271 feed (Texas's architecture, confirmed by TMHP_STC_SECTIONS's worked "Covered Managed Care" example) rather than a per-MCO feed — inherited as 'inferred', not independently confirmed for this specific MCO.`);
}

/* ==================== Layer 7 — vobContact ====================
   Sourcing notes:
   - Every providerServicesPhone/fax/ivrPath value below was read directly
     off a provider-services/contact-us page or provider quick-reference
     guide fetched this pass (not carried over from memory or from a
     WebSearch snippet alone) — several of these plans' provider manuals
     block automated retrieval (Aetna Better Health TX, Molina TX, per the
     prose already in texas.ts), but their standalone contact-us pages
     were independently fetchable even when the manual PDF was not.
   - Aetna's Texas commercial line (aetna-texas) has no ABA- or
     Texas-specific provider phone published; the number shipped is
     Aetna's national non-Medicare Healthcare Provider Service Center,
     confirmed on Aetna's own contact page. Aetna's Behavioral Health
     Precertification list PDF and ABA precert form PDF were fetched but
     returned no readable phone/fax text — not used as a source for that
     reason (no fabricated digits).
   - portal entries marked "reused" below cite an already-known/well-known
     portal URL for that payer family without a fresh fetch confirming
     that exact URL this pass, per the build spec's lower bar for portal
     accuracy (a wrong URL just 404s, unlike a wrong phone number).
   - Driscoll's fax (1-866-741-5650) reuses the number already verified
     and cited in this guide's own prose/source list (texas.ts,
     driscoll-health-plan treatmentPA field) rather than a fresh fetch
     finding it restated verbatim; a fresh fetch of driscollhealthplan.com
     this pass surfaced a companion PA/referrals phone (1-877-455-1053) at
     the same number's neighborhood, shipped as providerServicesPhone.
   - Closing-sweep addendum (2026-07-23): vobContact for the 6 gap-fill
     TX MCO guides (community-health-choice-texas, bcbs-texas-medicaid,
     cook-childrens-health-plan, parkland-community-health-plan,
     el-paso-health, firstcare-health-plans) below. Fax numbers for
     several of these plans were already fetched and cited in this
     file's own codeGrid notes (see chcEdi/bcbstxMedicaidEdi/cchpEdi/
     pchpEdi/ephEdi/firstcareEdi source blocks above); providerServicesPhone
     numbers were independently confirmed this pass directly from each
     plan's own contact/phone-directory page. FirstCare's Medicaid
     wind-down (confirmed exit 8/31/2026, same as baylor-scott-white-texas)
     applies here too — its contact info is shipped as current through
     that date, not a stable long-term line.
   ================================================================ */

const texasMedicaidContact: VobContact = {
  providerServicesPhone: '800-925-9126',
  hours: '7 a.m.–7 p.m. Central Time, Monday–Friday',
  portal: { name: 'TMHP.com / TexMedConnect provider portal', url: 'https://www.tmhp.com/' },
  ivrPath:
    "Contact Center menu routes by topic — ask for \"Authorizations\" or \"Eligibility\"; a separate Third Party Resource (insurance verification) line runs 8 a.m.–5 p.m. CT. EDI/TexMedConnect technical issues route to the EDI Help Desk (1-888-863-3638), already cited in this guide's edi.verifyVia.",
  scriptedQuestions: [
    'Do you have a distinct Availity or Change Healthcare payer ID for Texas Medicaid/TMHP 270/271 eligibility checks, separate from pVerify code 00186?',
    "Beyond the STAR/STAR Kids/CHIP program code carried in EB05, is there a fixed lookup table mapping REF02 codes to specific MCO names (e.g., Superior vs. Wellpoint), or does the MCO name only ever appear as free text?",
    "Is the Autism Services copay or coinsurance charged per visit or per day, and does the member's out-of-pocket maximum apply to this benefit?",
    'Are CPT codes 97152, 97157, 0362T, and 0373T billable under THSteps-CCP Autism Services at all, under a different program, or not covered?',
    'Is there a daily or weekly unit cap for 97156 (parent/caregiver training) or 99366 (interdisciplinary team meeting)?',
  ],
  sources: [src('https://www.tmhp.com/contact', 'TMHP Contact page, fetched this pass — Contact Center 800-925-9126, hours 7 a.m.–7 p.m. CT Monday–Friday; lists Authorizations, Eligibility, and EDI/TexMedConnect among its menu options.')],
};

const superiorContact: VobContact = {
  providerServicesPhone: '1-877-391-5921',
  hours: '8 a.m.–5 p.m. Central Time, Monday–Friday (STAR Health extends to 6 p.m. CT)',
  portal: { name: 'Superior HealthPlan Secure Provider Portal', url: 'https://www.superiorhealthplan.com/providers/login.html' },
  ivrPath: 'One line covers CHIP, STAR, STAR Health, STAR Kids, and STAR+PLUS — no separate ABA/BH prompt found.',
  scriptedQuestions: [
    'Does Superior support real-time (vs. batch) 270/271 eligibility responses for payer ID 00393?',
    "Confirm 39188 is the correct Availity payer ID for Superior's professional 270/271 eligibility specifically, distinct from the Centene-corporate entities (SHP11/FSHP11/DSHP11) also on the list.",
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply to ABA services?',
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under Superior's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [src('https://www.superiorhealthplan.com/contact-us/phone-directory.html', "Superior HealthPlan Phone Directory, fetched this pass — main Provider Services line 1-877-391-5921, 8 a.m.–5 p.m. CT Monday–Friday (STAR Health to 6 p.m. CT), covering CHIP/STAR/STAR Health/STAR Kids/STAR+PLUS.")],
};

const tchpContact: VobContact = {
  providerServicesPhone: '832-828-1004 (toll-free 1-877-213-5508)',
  hours: '8 a.m.–5 p.m. Central Time, Monday–Friday; after-hours/weekend/holiday calls route to an answering service with next-business-day callback',
  portal: { name: "Texas Children's Link (EpicCare Link)", url: 'https://epiccarelink.texaschildrens.org' },
  fax: '832-825-8750',
  ivrPath: 'Telephone TouCHPoint automated system (832-828-1007) offers 24/7 automated eligibility, benefits, and claims-status lookup without a live rep; its own fax is 832-825-8777.',
  scriptedQuestions: [
    'Does TCHP support real-time (vs. batch) 270/271 eligibility for payer ID 00275?',
    "Confirm TXCSM is the correct Availity code for TCHP's STAR Medicaid line, distinct from the separately listed TXCHLDCOMM commercial product (76048).",
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under TCHP's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [
    src('https://www.texaschildrenshealthplan.org/providers/provider-resources/quick-reference-guide', 'TCHP Provider Quick Reference Guide page, fetched this pass — Provider Services 832-828-1004 / 1-800-731-8527, fax 832-825-8750, portal "Texas Children\'s Link" via epiccarelink.texaschildrens.org.'),
    src('https://www.texaschildrenshealthplan.org/contact-us', 'TCHP Contact Us page, fetched this pass — Provider Services Hotline 832-828-1004 / toll-free 1-877-213-5508, hours 8 a.m.–5 p.m. CT Monday–Friday with after-hours answering service; Telephone TouCHPoint automated line 832-828-1007, fax 832-825-8777.'),
  ],
};

const wellpointContact: VobContact = {
  providerServicesPhone: '1-833-731-2162',
  fax: '1-800-964-3627',
  portal: { name: 'Availity Essentials', url: 'https://apps.availity.com/' },
  scriptedQuestions: [
    'Which Availity payer ID routes Wellpoint Texas Medicaid eligibility — one of the legacy Amerigroup regional codes (26374 Houston, 26375 Ft. Worth, 26378 Multiple States, 27518 generic), and if so which one?',
    'Does Wellpoint support real-time (vs. batch) 270/271 eligibility for payer ID 06067?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under Wellpoint's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [src('https://www.wellpoint.com/tx/provider/state-federal/contact-us', "Wellpoint TX Provider Contact Us page, fetched this pass — Medicaid/CHIP Provider Services 1-833-731-2162, fax 1-800-964-3627; page names Availity Essentials for self-service claims/eligibility; no hours-of-operation text found on this page for this specific line (confirmed via a second targeted fetch).")],
};

const uhcCommunityContact: VobContact = {
  providerServicesPhone: '888-887-9003',
  hours: 'Monday–Friday, 8 a.m.–6 p.m. Central Time',
  portal: { name: 'UnitedHealthcare Provider Portal', url: 'https://www.uhcprovider.com/' },
  ivrPath: "Behavioral health/ABA authorizations and referrals route through this same 888-887-9003 line (Optum-administered) — do not call the medical PA line for ABA.",
  scriptedQuestions: [
    "Since ABA authorization routes to UHC's Optum Behavioral Health network rather than the medical PA pipeline, what EDI payer ID should be used for the BH-side eligibility check — is UHG007 correct, or does 00192 cover it?",
    'Does the 270/271 eligibility check itself require a second EDI hop to Optum BH, or only the PA/UM step?',
    'Does UHC support real-time (vs. batch) 270/271 eligibility for this payer ID?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under this plan's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [src('https://www.uhcprovider.com/en/health-plans-by-state/texas-health-plans/tx-comm-plan-home/tx-cp-contact-us.html', 'UHC Community Plan of Texas Contact Us page, fetched this pass — Provider Services 888-887-9003, Monday–Friday 8 a.m.–6 p.m. CST; UnitedHealthcare Provider Portal at uhcprovider.com; Optum behavioral-health court-ordered-services line 877-614-0484 listed separately (not the general ABA routing number).')],
};

const aetnaBetterHealthContact: VobContact = {
  providerServicesPhone: '1-800-248-7767 (Bexar service area) / 1-800-306-8612 (Tarrant service area)',
  hours: '8 a.m.–5 p.m., Monday–Friday',
  portal: { name: 'Availity', url: 'https://apps.availity.com/' },
  scriptedQuestions: [
    'Confirm which payer ID routes Aetna Better Health of Texas\'s Medicaid line eligibility (000944) vs. its CHIP line (000945).',
    'Does Aetna Better Health of Texas support real-time (vs. batch) 270/271 eligibility for this payer ID?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under this plan's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [src('https://www.aetnabetterhealth.com/texas/providers/contact-us.html', "Aetna Better Health of Texas Provider Contact Us page, fetched this pass (independently reachable even though the plan's provider-manual PDF blocks automated retrieval, per this guide's edi source notes) — STAR Bexar 1-800-248-7767, STAR Tarrant 1-800-306-8612, both 8 a.m.–5 p.m. Monday–Friday; Provider Portal & Claims via Availity (apps.availity.com).")],
};

const molinaContact: VobContact = {
  providerServicesPhone: '(855) 322-4080',
  hours: 'Monday–Friday, 8 a.m.–5 p.m. local time',
  portal: { name: 'Availity Essentials (Molina Healthcare)', url: 'https://www.availity.com/molinahealthcare' },
  ivrPath: 'After-hours Nurse Advice Line: (888) 275-8750.',
  scriptedQuestions: [
    'Does Molina support real-time (vs. batch) 270/271 eligibility for payer ID 00152?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under Molina's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
    "Where can we find Molina's code-level PA requirements (Behavioral Health and Medical Prior Authorization Code Matrix), and are 97151–97158 all subject to the standard TMPPM rules or does Molina apply its own overlay?",
  ],
  sources: [src('https://www.molinahealthcare.com/providers/tx/medicaid/resource/services.aspx', "Molina Healthcare of Texas provider services page, fetched this pass (independently reachable even though Molina's PA guide PDFs sit behind bot protection, per this guide's edi source notes) — UM Department (855) 322-4080, hours Monday–Friday 8 a.m.–5 p.m. local time; portal is Availity Essentials (www.availity.com/molinahealthcare).")],
};

const communityFirstContact: VobContact = {
  providerServicesPhone: '1-800-434-2347',
  hours: '8:30 a.m.–5 p.m., Monday–Friday',
  portal: { name: 'Community First Provider Portal (HealthTrio Connect)', url: 'https://cfhpprovider.healthtrioconnect.com/' },
  ivrPath: 'Prior-authorization-specific line: 210-358-6050 (local), same toll-free/hours as above.',
  scriptedQuestions: [
    'Which payer ID is correct for Community First eligibility checks — pVerify 01390 or 06106?',
    'Does Community First support real-time (vs. batch) 270/271 eligibility?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    "Are CPT codes 97152, 97157, 0362T, and 0373T billable under Community First's Autism Services benefit?",
    'Is there a daily/weekly unit cap for 97156 (parent/caregiver training) or 99366 (team meeting)?',
  ],
  sources: [
    src('https://medicaid.communityfirsthealthplans.com/contact-us/', 'Community First Health Plans (Medicaid) Contact Us page, fetched this pass — Provider Relations 210-358-6294, STAR/CHIP toll-free 1-800-434-2347, hours 8:30 a.m.–5 p.m. Monday–Friday; Provider Portal at cfhpprovider.healthtrioconnect.com.'),
    src('https://medicaid.communityfirsthealthplans.com/provider-prior-authorizations/', 'Community First Health Plans prior-authorization page, fetched this pass — PA assistance line 210-358-6050 local / 1-800-434-2347 toll-free, same 8:30 a.m.–5 p.m. Monday–Friday hours; portal named HealthTrio Connect.'),
  ],
};

const driscollContact: VobContact = {
  providerServicesPhone: '1-877-455-1053',
  fax: '1-866-741-5650',
  portal: { name: 'Driscoll Prior Authorization Requirement Portal (Autism/ABA Services)', url: 'https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services' },
  ivrPath: 'Regional Provider Services lines also exist: Hidalgo service area 1-855-425-3247, Nueces service area 1-877-324-3627.',
  scriptedQuestions: [
    'Which payer ID is correct — pVerify 01090 or 002472 — for Driscoll eligibility checks?',
    "Does Driscoll's Availity STAR/STAR Kids eligibility route through the CHIP-specific code (74284/DCHCH), or is there a separate STAR/STAR Kids code?",
    'Does Driscoll support real-time (vs. batch) 270/271 eligibility?',
    "What's the daily/weekly unit cap and allowed POS for 97152 and 97157 — the PA portal confirms both are covered/authorization-required but doesn't show caps or POS on the entry?",
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    'Are CPT codes 0362T and 0373T billable under Driscoll\'s Autism Services benefit, and is there a daily/weekly unit cap for 97156 or 99366?',
  ],
  sources: [src('https://driscollhealthplan.com/for-providers/', 'Driscoll Health Plan "For Providers" page, fetched this pass — CHIP/STAR/STAR Kids prior authorization & referrals 1-877-455-1053 (also 1-866-741-5650), Hidalgo Provider Services 1-855-425-3247, Nueces Provider Services 1-877-324-3627, DHP Provider Portal at dhpproviderportal.com, PA lookup portal at driscollhealthplan.com/priorauthcheck.')],
};

const aetnaTxCommercialContact: VobContact = {
  providerServicesPhone: '1-888-632-3862',
  portal: { name: 'Availity', url: 'https://apps.availity.com/' },
  scriptedQuestions: [
    'Does Aetna administer ABA in-house for Texas commercial members, or via a behavioral-health carve-out — and if carved out, what\'s the administrator and payer ID to use for eligibility checks?',
    'What service-type-code bucket does Aetna return ABA benefits under, and does the deductible apply to ABA services?',
    "Is the ABA copay or coinsurance charged per visit or per day, and does the plan's out-of-pocket maximum apply?",
    'What are the daily/session unit caps for 97151–97158, 0362T, 0373T, and 99366 under this member\'s plan?',
    'What POS settings (home/office/school/telehealth) and modifiers (HN/HO/HM/HP, GT/95) does Aetna require for ABA billing in Texas?',
    'Does Aetna support real-time 270/271 eligibility for payer ID 00001, and confirm this isn\'t the Texas Health Aetna joint-venture plan (00875)?',
  ],
  sources: [src('https://www.aetna.com/about-us/contact-aetna.html', "Aetna Contact Aetna page, fetched this pass — Healthcare Provider Service Centers: non-Medicare 1-888-632-3862, Medicare 1-800-624-0756; no ABA- or Texas-specific provider line found (Aetna directs precertification callers to the number on the member's ID card). Hours not stated for this specific line on this page.")],
};

const cignaTxCommercialContact: VobContact = {
  providerServicesPhone: '1-800-926-2273',
  ivrPath: "Select prompt #5 for providers, then: #1 Claims, #2 Eligibility and benefits, #3 Authorization (IOP/PHP/Inpatient), #4 Online services, #5 Personal updates.",
  portal: { name: 'Cigna for Health Care Professionals (CignaforHCP)', url: 'https://cignaforhcp.cigna.com' },
  scriptedQuestions: [
    'Does Evernorth/Cigna require prior authorization on ABA assessment codes (97151/97152/0362T) separately from treatment codes (97153–97158), since EN0499 doesn\'t state a per-code PA distinction?',
    'Is CPT 99366 (interdisciplinary team meeting) covered and billable under this member\'s ABA benefit?',
    'Is the ABA copay or coinsurance charged per visit or per day?',
    "Does the plan's out-of-pocket maximum apply to ABA services?",
    'What are the daily/session unit caps for 97151–97158, 0362T, and 0373T under this member\'s plan?',
    'What POS settings and modifiers (telehealth 95/GT, licensure tiers) does Cigna/Evernorth require for ABA billing?',
    'Does Cigna support real-time (vs. batch) 270/271 eligibility for payer ID 00004?',
  ],
  sources: [src('https://static.evernorth.com/assets/evernorth/provider/resourceLibrary/behavioralResources/doingBusinessWithUs/cbhProviderServiceCenter.html', 'Evernorth Behavioral Health Provider Service Center page, fetched this pass — 1-800-926-2273, prompt #5 for providers with sub-options for claims/eligibility/authorization/online services/personal updates; hours and fax not stated on this page.')],
};

const uhcTxCommercialContact: VobContact = {
  providerServicesPhone: '877-842-3210',
  ivrPath: 'Behavioral health/substance-use line (Optum): 877-614-0484, 24/7.',
  portal: { name: 'UnitedHealthcare Provider Portal', url: 'https://www.uhcprovider.com/' },
  scriptedQuestions: [
    "Since ABA is administered via Optum's two-step Provider Express authorization, what EDI payer ID routes the BH-side eligibility check, and does eligibility itself require two hops or just the PA/UM step?",
    "Is ABA administered on the medical or behavioral-health side of this member's plan?",
    'What POS settings are allowed for ABA codes, and is telehealth permitted for any of 97151–97158, 0362T, or 0373T?',
    'Is the ABA copay or coinsurance charged per visit or per day?',
    "Does the plan's out-of-pocket maximum apply to ABA services?",
    'Is there a daily unit cap for 99366 (interdisciplinary team meeting)?',
  ],
  sources: [src('https://www.uhcprovider.com/en/contact-us.html', 'UHCprovider.com Contact Us page, fetched this pass — general national provider services 877-842-3210, Behavioral Health & Substance Use (Optum) 877-614-0484 (24/7), UnitedHealthcare Provider Portal at uhcprovider.com; hours not stated for the 877-842-3210 line on this page.')],
};

/* ==================== closing sweep: vobContact for the 6 gap-fill TX MCO guides ==================== */

const chcContact: VobContact = {
  providerServicesPhone: '713.295.2300 (local) / 1.888.435.2850 (toll-free)',
  hours: 'Monday-Friday, 8:00 a.m.-5:00 p.m. Central Time',
  fax: '713.295.2283 (general); Behavioral Health PA — inpatient 713.576.0932, outpatient 713.576.0939',
  portal: { name: 'Community Health Choice Provider Portal', url: 'https://providerportal.communityhealthchoice.org/s/login/' },
  scriptedQuestions: [
    'Confirm the correct EDI payer ID for 270/271 eligibility checks — 01071 (pVerify) vs. the two conflicting Change Healthcare candidates (60495 per CHC\'s own EDI page vs. 48145 per Optum\'s Real-Time Eligibility Payer List).',
    'Does CHC support real-time (vs. batch) 270/271 eligibility for this payer ID?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply to ABA services?',
    'Are CPT codes 97152, 97157, 0362T, and 0373T billable under CHC\'s Autism Services benefit at all, or only 97151/97153-97156/97158 per the Medical Review Guideline?',
    'Is ABA confirmed covered for CHC Marketplace members the same way it is for STAR, and is it excluded for CHIP members as the HHS Provider Manual states?',
  ],
  sources: [
    src('https://provider.communityhealthchoice.org/contact-community/', 'Community Health Choice — Contact Community (provider) page, fetched this pass — Provider Services 713.295.2300 (local) / 1.888.435.2850 (toll-free), Mon-Fri 8am-5pm; general fax 713.295.2283; Behavioral Health PA fax: inpatient 713.576.0932, outpatient 713.576.0939; Provider Portal at providerportal.communityhealthchoice.org.'),
  ],
};

const bcbstxMedicaidContact: VobContact = {
  providerServicesPhone: '1-877-560-8055 (STAR/CHIP) / 1-877-784-6802 (STAR Kids)',
  hours: '8:00 a.m.-5:00 p.m. Central Time',
  fax: '1-888-530-9809 (Behavioral Health/ABA PA intake, per BCBSTX\'s own PA Requirement Checklist)',
  ivrPath: 'Provider Relations/Network line (credentialing, contracting): 1-855-212-1615 — separate from the member-services numbers above.',
  portal: { name: 'Availity Essentials', url: 'https://www.availity.com/' },
  scriptedQuestions: [
    'Confirm 66002 is the correct Availity payer ID for STAR/CHIP/STAR Kids eligibility, and whether STAR Kids (which has its own distinct pVerify code, 01352) is also covered by that single Availity ID.',
    'Does BCBSTX support real-time (vs. batch) 270/271 eligibility for this payer ID?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'Is CPT 99366 billable under this plan\'s Autism Services benefit — it does not appear on BCBSTX\'s own PA code grid or provider manual?',
    'Since BCBSTX insourced Medicaid behavioral health from Magellan in 2024, confirm ABA PA still routes to the 1-888-530-9809 BH intake fax or Availity, not a Magellan channel.',
  ],
  sources: [
    src('https://www.bcbstx.com/provider/medicaid/contact', 'BCBS Texas — Provider Medicaid Contact Us page (confirmed via search this pass) — Medicaid (STAR)/CHIP Customer Service 1-877-560-8055, STAR Kids 1-877-784-6802, hours 8am-5pm CST; Provider Relations/Network 1-855-212-1615; eligibility/claims via Availity (availity.com).'),
    BCBSTX_ABA_CHECKLIST,
  ],
};

const cchpContact: VobContact = {
  providerServicesPhone: '1-888-243-3312 (Provider Relations — credentialing, contracting, demographics)',
  hours: 'Monday-Friday, 8:00 a.m.-5:00 p.m. (excluding state holidays)',
  fax: '682-885-8402 (STAR/CHIP PA); 682-303-0005 or 844-843-0005 (STAR Kids PA, portal-access-pending only)',
  ivrPath: 'General Member Services: 1-800-964-2247 — determination letters are delivered via the EpicCare Link In Basket only, never faxed; fax is for submission while portal access is pending.',
  portal: { name: "Cook Children's EpicCare Link", url: 'https://www.cookchp.org/providers/prior-authorization-search/' },
  scriptedQuestions: [
    'Confirm the correct Availity payer ID split — CCHP1 for CHIP vs. CCHP9 for STAR/STAR Kids — for 270/271 eligibility checks.',
    'Does Cook Children\'s Health Plan support real-time (vs. batch) 270/271 eligibility for these payer IDs?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'Is CPT 99366 billable beyond the F84.0-only, twice-per-year, 3-licensed-professional-minimum rule already confirmed in Cook Children\'s own ABA training?',
    'Does the 8-hour/day combined direct-treatment cap across 97153/97154/97155/97158 confirmed in Cook Children\'s own training match the statewide TMPPM cap exactly, or does the plan apply a stricter overlay?',
  ],
  sources: [
    src('https://www.cookchp.org/join/contact-us/', "Cook Children's Health Plan — Contact Us page, fetched this pass — Provider Relations toll-free 1-888-243-3312, Mon-Fri 8am-5pm (excl. state holidays), TTY 7-1-1/1-800-735-2988; General Member Services 1-800-964-2247."),
    CCHP_ABA_TRAINING,
    CCHP_ACUTE_PA_TRAINING,
  ],
};

const pchpContact: VobContact = {
  providerServicesPhone: '1-888-672-2277 (STAR) / 1-888-814-2352 (CHIP/CHIP Perinate)',
  hours: '8:00 a.m.-5:00 p.m. Central Time, Monday-Friday (except state holidays)',
  fax: 'BH-specific 214-266-2064 / 1-844-266-2064; general PA 214-266-2085 / 1-844-303-1382',
  portal: { name: 'Parkland Community Health Plan Provider Portal', url: 'https://providers.parklandhealthplan.com/' },
  scriptedQuestions: [
    'Since PCHP insourced behavioral health from Carelon effective 9/1/2025, confirm our practice is credentialed directly with PCHP (not still routed through a Carelon-era process) before submitting an ABA PA.',
    'Is there a confirmed EDI payer ID for 270/271 eligibility checks — pVerify shows no match for "Parkland" at all?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'PCHP\'s own PA Requirements list names 97152 and 97157 under "Applied Behavior Analysis," contradicting the statewide TMPPM code set — what are the unit caps, POS, and modifiers for these two codes specifically?',
    'Is CPT 99366 billable under this plan\'s Autism Services benefit?',
  ],
  sources: [
    src('https://parklandhealthplan.com/phone-directory', 'Parkland Community Health Plan — Important Phone Numbers page, fetched this pass — Member Services STAR 1-888-672-2277, CHIP/CHIP Perinate 1-888-814-2352, hours 8am-5pm CST Mon-Fri; Provider Portal at providers.parklandhealthplan.com.'),
    PCHP_PA_REQUIREMENTS,
    PCHP_BH_TRANSITION,
  ],
};

const ephContact: VobContact = {
  providerServicesPhone: '1-888-310-3434 (general correspondence)',
  fax: '915-298-7866 / 1-844-298-7866 (outpatient/elective ABA PA); 915-532-2286 (general provider services)',
  portal: { name: 'El Paso Health Provider Portal', url: 'https://secure.healthx.com/elpasoprovider' },
  ivrPath: 'Telephonic PA requests (STAR): 915-532-3778.',
  scriptedQuestions: [
    'Confirm which of El Paso Health\'s line-of-business Availity codes (EPF02 STAR/STAR+PLUS, EPF03 CHIP) applies to this specific member for 270/271 eligibility checks.',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'El Paso Health\'s own ABA Request Checklist caps the evaluation at 6 hrs/24 units (HO only) — does this apply identically to the 60-day authorization-validity rule for re-evaluations, or does that differ per the 2026 memo?',
    'Are CPT codes 97152, 97157, 0362T, and 0373T billable under El Paso Health\'s Autism Services benefit at all?',
    'Is CPT 99366 billable under this plan\'s Autism Services benefit?',
  ],
  sources: [
    src('http://elpasohealth.com/contact-us.html', 'El Paso Health — Contact Us page, fetched this pass — general correspondence 1-888-310-3434 (fax 915-532-2877); general provider services fax 915-532-2286; PA (outpatient/elective) fax 915-298-7866 / 1-844-298-7866, telephonic STAR requests 915-532-3778.'),
    EPH_ABA_CHECKLIST,
    EPH_QRG,
  ],
};

const firstcareContact: VobContact = {
  providerServicesPhone: '800.431.STAR (7798) — STAR Medicaid customer service',
  hours: 'Utilization Management: Mon-Fri 6:00am-6:00pm CT, weekends/holidays 9:00am-12:00pm CT; online submissions accepted 24/7',
  portal: { name: 'myFirstCare Self-Service Portal', url: 'https://my.firstcare.com/Web' },
  scriptedQuestions: [
    'CONFIRMED: Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026 (TMHP 7/17/2026, Texas HHS 7/21/2026) — confirm this family\'s post-exit MCO reassignment status before building a long-term authorization plan around FirstCare.',
    'Confirm the correct Availity payer ID (94998 FirstCare Medicaid, distinct from 94999 general/commercial) is being used for this member\'s 270/271 eligibility check.',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'Since FirstCare files ABA under "Therapy services" rather than "Behavioral health," confirm whether ABA PA routes through the Medical PA line or the Behavioral Health PA line (1-855-395-9652).',
    'Are CPT codes 97152, 97157, 0362T, and 0373T billable under FirstCare\'s Medicaid Autism Services benefit, or only under its separate commercial Medical Coverage Policy #206?',
  ],
  sources: [
    src('https://www.firstcare.com/en/providers', "FirstCare — Providers page and related UM policy content (confirmed via search this pass) — STAR Medicaid customer service 800.431.STAR (7798); Utilization Management Mon-Fri 6am-6pm CT, weekends/holidays 9am-12pm CT, online authorization submission 24/7 via the FirstCare Self-Service Portal (my.firstcare.com/Web)."),
    TMHP_FIRSTCARE_EXIT_NEWS,
  ],
};

/* ==================== closing sweep: full VOB layers for baylor-scott-white-texas + dell-childrens-health-plan ==================== */

const RIGHTCARE_PA_LIST = src(
  'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/forms/medicaid/RightCare_Authorization_List.pdf',
  'RightCare — Texas Medicaid/CHIP Prior Authorization Codes List (eff. 7/1/2026); already cited in texas.ts — confirms PA-required ABA codes 97151, 97153, 97154, 97155, 97156, 97158, 99366 (each eff. 1/3/2020), 97152/97157 absent, matching the statewide TMHP code set exactly.'
);
const RIGHTCARE_POLICY_206 = src(
  'https://wadcdnstorageprod.blob.core.windows.net/bswhp/Medical-Policies/206.pdf',
  'BSWHP Medical Coverage Policy 206 — Autism Spectrum Disorder (eff. 7/1/2026); already cited in texas.ts — explicitly defers Medicaid coverage decisions to the TMPPM.'
);
const RIGHTCARE_PROVIDER_MANUAL = src(
  'https://rightcare.swhp.org/-/media/project/bsw/sites/rightcare/documents/provider-manual.pdf',
  "RightCare — 2026 Provider Manual; already cited in texas.ts — states behavioral health is administered in-house as \"RightCare Behavioral Health Management\" (phone 1-855-395-9652, fax 1-844-436-8779), distinct from the medical Prior Authorization/Medical Management line (1-855-691-7947, fax 1-512-383-8703 or 1-800-292-1349); General Provider Relations 1-855-TX-RIGHT (1-855-897-4448); reimbursement follows the Medicaid fee schedule \"when available.\""
);
const TMHP_BSW_EXIT_NEWS = src(
  'https://www.tmhp.com/news/2026-07-17-baylor-scott-white-and-firstcare-health-plans-will-end-participation-texas-medicaid',
  'TMHP news (7/17/2026) — Baylor Scott & White (RightCare, MRSA Central) and FirstCare Health Plans (MRSA West) will end participation in Texas Medicaid managed care effective 8/31/2026 (regulatory approval pending); claims for DOS on/after 9/1/2026 rejected; providers have until 8/31/2028 to submit claims for earlier DOS.',
  true
);

const rightcareEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'none — "RightCare Behavioral Health Management" is an in-house unit, not a third-party BH vendor (no Cenpatico/Beacon/Magellan/Carelon/Optum named anywhere in the plan\'s current provider manual or PA materials)',
    administratorPayerId: 'N/A',
    abaRidesOn: 'unverified',
    twoHopRequired: 'unverified',
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.abaRidesOn': 'unverified',
    'bhCarveOut.twoHopRequired': 'unverified',
  },
  verifyVia: {
    'payerId.pverify': 'No pVerify or Availity entry for "RightCare," "Scott and White Health Plan," or "Baylor Scott & White" was confirmed this pass (the plan\'s own provider manual and network flyers are image/graphics-heavy PDFs that did not yield extractable EDI text) — confirm via RightCare Provider Relations (1-855-897-4448) or pVerify/Availity onboarding. Given the confirmed 8/31/2026 Medicaid exit, treat any answer as good only through that date.',
    'payerId.availity': 'Same as payerId.pverify.',
    'payerId.changeHealthcare': 'Same as payerId.pverify.',
    supportsRealtime: 'Confirm real-time vs. batch via pVerify/Availity onboarding for this payer ID.',
    'bhCarveOut.abaRidesOn': 'RightCare\'s own PA code list does not separate ABA from general PT/OT/rehab codes by routing channel — confirm with RightCare directly (Medical Management 1-855-691-7947 vs. Behavioral Health Management 1-855-395-9652) before your first request.',
    'bhCarveOut.twoHopRequired': 'Depends on the answer to abaRidesOn above.',
  },
  sources: [RIGHTCARE_PA_LIST, RIGHTCARE_POLICY_206, RIGHTCARE_PROVIDER_MANUAL, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST],
};

const rightcareContact: VobContact = {
  fax: 'Medical Management/PA: 1-512-383-8703 or 1-800-292-1349; Behavioral Health Management: 1-844-436-8779',
  providerServicesPhone: '1-855-691-7947 (Medical Management/PA) or 1-855-395-9652 (Behavioral Health Management) — confirm which routes ABA specifically',
  ivrPath: 'General Provider Relations: 1-855-TX-RIGHT (1-855-897-4448).',
  portal: { name: 'RightCare Self-Service Portal', url: 'https://rightcare.swhp.org/providers' },
  scriptedQuestions: [
    'CONFIRMED: RightCare is exiting Texas Medicaid managed care effective 8/31/2026 (TMHP 7/17/2026 announcement) — confirm this family\'s post-exit MCO reassignment status.',
    'Does ABA prior authorization route through Medical Management (1-855-691-7947) or Behavioral Health Management (1-855-395-9652)? RightCare\'s own PA code list does not separate these codes by routing channel.',
    'What EDI payer ID should be used for this member\'s 270/271 eligibility check?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
    'Does a RightCare-specific authorization-period length apply (vs. the general TMPPM baseline), and does DeWitt County fall within the MRSA Central service area for this plan specifically?',
  ],
  sources: [RIGHTCARE_PROVIDER_MANUAL, TMHP_BSW_EXIT_NEWS],
};

const rightcareCodeGrid: Record<string, CodeGridEntry> = tmppmCodeGrid({
  '97151': "RightCare's own Medicaid/CHIP PA Codes list (eff. 7/1/2026) confirms 97151 as PA-required since 1/3/2020, matching the TMPPM baseline exactly. PLAN IS WINDING DOWN — exits Texas Medicaid 8/31/2026 (regulatory approval pending); PA processes remain unaffected during the transition per TMHP/RightCare's own notices.",
});

/* ==================== dell-childrens-health-plan ==================== */

const DELL_PROVIDER_MANUAL = src(
  'https://dellchildrenshealthplan.com/wp-content/uploads/2024/11/Provider-Manual-102024_web.pdf',
  "Dell Children's Health Plan — STAR Medicaid and CHIP Provider Manual (Oct 2024); already cited in texas.ts — explicitly lists Applied Behavior Analysis (ABA) therapy as a covered STAR behavioral-health service; behavioral health (ABA included) is delegated to Magellan Healthcare."
);
const DELL_BH_PAGE = src(
  'https://dellchildrenshealthplan.com/manage-your-health/behavioral-health/',
  "Dell Children's Health Plan — Behavioral Health (member) page; already cited in texas.ts — states ABA \"is now a benefit for STAR members,\" requiring prior ASD diagnostic testing by a developmental pediatrician, neurologist, psychiatrist, licensed psychologist, or autism diagnosis team; directs self-referral to Magellan toll-free 1-800-424-1764."
);
const DELL_PA_LIST = src(
  'https://dellchildrenshealthplan.com/wp-content/uploads/2026/04/Dell-Childrens-Prior-Authorization-List-Final-Effective-6_1_2026.xlsx-DCHP-PA-List-2.pdf',
  "Dell Children's Health Plan — STAR/CHIP Prior Authorization List (eff. 6/1/2026); already cited in texas.ts — PA=Yes for 97151, 97153, 97154, 97155, 97156, 97158, 99366, cross-referenced to the TMPPM Children's Services Handbook; ALSO shows 97157 PA=Yes, an unresolved discrepancy against the statewide THSteps-CCP Autism Services code set."
);
const DELL_MANUALS_FORMS = src(
  'https://dellchildrenshealthplan.com/for-providers/manuals-forms/',
  "Dell Children's Health Plan — Manuals & Forms page; already cited in texas.ts — lists Magellan-branded BH Prior Auth Form, Initial Review Form, Concurrent Review Form accessed through the Magellan portal; dedicated BH PA fax (866) 354-8758, distinct from the plan's general medical PA fax 844-981-3329."
);
const MAGELLAN_TX_STATE_PAGE = src(
  'https://www.magellanprovider.com/news-publications/state-plan-eap-specific-information/texas.aspx',
  "Magellan Healthcare — Texas state-plan provider page (fetched this pass) — corroborates the Behavioral Health/substance-use hotline 1-800-424-1764 (TTY 7-1-1), available 24/7; BH prior-authorization forms and portal at magellanhealth.com; a separate Provider Customer Services line (1-844-781-2343, Mon-Fri 8am-5pm CT) handles medical/surgical/BH inpatient and outpatient authorization portal questions."
);

const dellChildrensEdi: EdiRouting = {
  payerId: { pverify: 'unverified', availity: 'unverified', changeHealthcare: 'unverified — the plan states Change Healthcare operates its EDI Gateway generally, but no specific payer ID was confirmed this pass' },
  supports270271: true,
  supportsRealtime: 'unverified',
  bhCarveOut: {
    administrator: 'Magellan Healthcare',
    administratorPayerId: 'unverified',
    abaRidesOn: 'bh',
    twoHopRequired: true,
  },
  fieldStatus: {
    'payerId.pverify': 'unverified',
    'payerId.availity': 'unverified',
    'payerId.changeHealthcare': 'unverified',
    supports270271: 'verified',
    supportsRealtime: 'unverified',
    'bhCarveOut.administrator': 'verified',
    'bhCarveOut.administratorPayerId': 'unverified',
    'bhCarveOut.abaRidesOn': 'verified',
    'bhCarveOut.twoHopRequired': 'inferred',
  },
  verifyVia: {
    'payerId.pverify': 'No pVerify entry for "Dell Children\'s Health Plan" was confirmed this pass — confirm via pVerify onboarding or the plan\'s General Provider Services line (1-844-781-2343).',
    'payerId.availity': 'A WebSearch this pass surfaced that Dell Children\'s Health Plan "has designated Change Healthcare to operate and service your EDI entry point (EDI Gateway)," but no specific payer ID was independently confirmed against a readable primary document — confirm via Change Healthcare (877-411-7271) or the plan directly.',
    'payerId.changeHealthcare': 'Same as payerId.availity.',
    supportsRealtime: 'Confirm real-time vs. batch via the plan\'s EDI Gateway (Change Healthcare) onboarding.',
    'bhCarveOut.administratorPayerId': 'Confirm with Magellan Healthcare (1-800-424-1764) or via magellanhealth.com — no distinct EDI payer ID for the Magellan BH carve-out was confirmed this pass.',
    'bhCarveOut.twoHopRequired': 'Inferred true because ABA prior authorization demonstrably requires contacting Magellan separately from the plan\'s general medical PA channel — but whether the 270/271 ELIGIBILITY check itself requires a second EDI hop to Magellan (vs. only the PA/UM step) was not independently confirmed.',
  },
  sources: [DELL_PROVIDER_MANUAL, DELL_BH_PAGE, MAGELLAN_TX_STATE_PAGE, PVERIFY_PAYER_LIST_PAGE, AVAILITY_PAYER_LIST],
};

const dellChildrensContact: VobContact = {
  providerServicesPhone: '1-844-781-2343 (General Provider/Customer Services) or 1-800-424-1764 (Magellan Behavioral Health — 24/7)',
  hours: 'General Provider Services: Mon-Fri 8am-5pm CT. Magellan BH hotline: 24/7.',
  fax: '(866) 354-8758 (Magellan BH PA); 844-981-3329 (general medical PA)',
  portal: { name: 'HealthX Provider Portal (medical) / magellanhealth.com (behavioral health)', url: 'https://dellchildrenshealthplan.com/for-providers/manuals-forms/' },
  scriptedQuestions: [
    'Confirm ABA prior authorization routes through Magellan Healthcare (1-800-424-1764 / magellanhealth.com) and not the plan\'s general medical PA channel — use the Magellan-branded BH Prior Auth Form.',
    'PA list shows 97157 as PA=Yes even though it is absent from the statewide THSteps-CCP Autism Services code set — is 97157 actually billable under this plan\'s ABA benefit?',
    'Is ABA an explicitly covered benefit for standard CHIP (non-STAR, non-Perinatal) members, or only for STAR members as the provider manual\'s STAR-specific list states?',
    'What EDI payer ID should be used for this member\'s 270/271 eligibility check, given the plan\'s stated use of Change Healthcare as its EDI Gateway?',
    'Is the ABA copay or coinsurance charged per visit or per day, and does the plan\'s out-of-pocket maximum apply?',
  ],
  sources: [DELL_BH_PAGE, DELL_MANUALS_FORMS, MAGELLAN_TX_STATE_PAGE],
};

function dellPaListDiscrepancyCode(code: string): CodeGridEntry {
  return {
    covered: `Yes, per Dell Children's own PA list (eff. 6/1/2026, PA=Yes) — contradicts the "not on Texas's billable ABA code set" finding shipped for ${code} elsewhere in this file (texas-medicaid and the other Medicaid MCO guides); the plan's own list gives no code-level detail beyond a PA=Yes/No flag, so treat as a confirmed Dell-specific discrepancy needing direct confirmation, not a resolved fact either way.`,
    paRequired: `Required, per Dell Children's PA list (eff. 6/1/2026) — flagged PA=Yes for ${code} with no further code-level detail given.`,
    unitCap: 'unverified — not shown on the PA list (a PA=Yes/No flag only)',
    capPeriod: 'unverified',
    posAllowed: ['unverified — not shown on the PA list'],
    telehealth: 'unverified — not addressed in the PA list',
    modifiers: ['unverified — not shown on the PA list'],
    notes: `DISCREPANCY: Dell Children's own PA list (eff. 6/1/2026) shows ${code} as PA=Yes, even though ${code} is confirmed absent from Texas Medicaid's actual THSteps-CCP Autism Services billable code set per TMHP's own fee schedule and handbook (independently confirmed this pass). Verify directly with Dell Children's/Magellan before assuming this applies to any other Texas Medicaid plan.`,
    fieldStatus: {
      covered: 'inferred',
      paRequired: 'verified',
      unitCap: 'unverified',
      posAllowed: 'unverified',
      telehealth: 'unverified',
      modifiers: 'unverified',
    },
    sources: [DELL_PA_LIST, TMPPM_HANDBOOK, AUTISM_FEE_SCHEDULE],
  };
}

const dellChildrensCodeGrid: Record<string, CodeGridEntry> = {
  ...tmppmCodeGrid({
    '97151': "Dell Children's own PA list (eff. 6/1/2026) confirms 97151 PA=Yes, matching the TMPPM baseline. Behavioral health (ABA included) is delegated to Magellan Healthcare, not administered in-house — route PA through Magellan's own form/portal, not the plan's general medical channel.",
  }),
  '97157': dellPaListDiscrepancyCode('97157'),
};

/* ==================== export ==================== */

export const texasVob: Record<string, VobExtension> = {
  'texas-medicaid': {
    edi: texasMedicaidEdi,
    codeGrid: tmppmCodeGrid(),
    rates: TX_MEDICAID_RATES,
    stcMap: texasMedicaidStc,
    vobContact: texasMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'superior-healthplan-texas': {
    edi: superiorEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Submit via Superior's provider portal; verify code-level PA status on Superior's Prior Authorization Requirements page (superiorhealthplan.com) — Superior's 1/1/2026 PA-removal list did not touch any ABA codes.",
    }),
    rates: mcoUnverifiedRates('Superior HealthPlan'),
    stcMap: txMcoInferredStc('Superior HealthPlan'),
    vobContact: superiorContact,
    lastUpdated: ACCESS_DATE,
  },
  'texas-childrens-health-plan': {
    edi: tchpEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "TCHP's Guideline #11281 v3 restates this requirement nearly verbatim; submit to the UM Department via the electronic authorization portal, fax, phone, or mail.",
    }),
    rates: mcoUnverifiedRates("Texas Children's Health Plan"),
    stcMap: txMcoInferredStc("Texas Children's Health Plan"),
    vobContact: tchpContact,
    lastUpdated: ACCESS_DATE,
  },
  'wellpoint-texas': {
    edi: wellpointEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Wellpoint accepts its own ASD Treatment Plan Request Form OR the state CCP PA form; submit via Availity Essentials, phone, or fax.",
    }),
    rates: mcoUnverifiedRates('Wellpoint (formerly Amerigroup Texas)'),
    stcMap: txMcoInferredStc('Wellpoint'),
    vobContact: wellpointContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-texas': {
    edi: uhcCommunityEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Routes through UHC's designated behavioral health network (Optum), phone 888-887-9003 — NOT the medical PA pipeline, even though the clinical criteria are the unchanged TMPPM baseline.",
    }),
    rates: mcoUnverifiedRates('UnitedHealthcare Community Plan of Texas'),
    stcMap: txMcoInferredStc('UnitedHealthcare Community Plan of Texas'),
    vobContact: uhcCommunityContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-better-health-texas': {
    edi: aetnaBetterHealthEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Aetna Better Health of Texas's plan-specific submission mechanics (form, portal, UM fax/phone) are not publicly verifiable — its provider manual and PA pages return errors to automated retrieval. Confirm directly with provider relations before first submission.",
    }),
    rates: mcoUnverifiedRates('Aetna Better Health of Texas'),
    stcMap: txMcoInferredStc('Aetna Better Health of Texas'),
    vobContact: aetnaBetterHealthContact,
    lastUpdated: ACCESS_DATE,
  },
  'molina-healthcare-texas': {
    edi: molinaEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Molina directs providers to its Behavioral Health and Medical Prior Authorization Code Matrix / Look-Up Tool for code-level PA handling — its PA guide PDFs sit behind bot protection and were not independently verified this pass.",
    }),
    rates: mcoUnverifiedRates('Molina Healthcare of Texas'),
    stcMap: txMcoInferredStc('Molina Healthcare of Texas'),
    vobContact: molinaContact,
    lastUpdated: ACCESS_DATE,
  },
  'community-first-health-plans': {
    edi: communityFirstEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Community First's own Autism Services Billing Guidelines page restates this requirement directly, plus a published HO/HN/HM modifier crosswalk and concurrent-billing rules — one of the clearest MCO-published TMPPM digests in Texas.",
    }),
    rates: mcoUnverifiedRates('Community First Health Plans'),
    stcMap: txMcoInferredStc('Community First Health Plans'),
    vobContact: communityFirstContact,
    lastUpdated: ACCESS_DATE,
  },
  'driscoll-health-plan': {
    edi: driscollEdi,
    codeGrid: {
      ...tmppmCodeGrid({
        '97151': "Verify per-code PA status on Driscoll's Prior Authorization Requirement Portal (driscollhealthplan.com/priorauthcheck) before submitting; Driscoll uses the statewide Texas Authorization Referral Form (TARF), not a proprietary form.",
      }),
      '97152': driscollPortalCode('97152', 'PR Behavior ID Support Assmt by 1 Tech, EA 15 Min'),
      '97157': driscollPortalCode('97157', 'PR Multiple Fam Group Bhv Tx Gdn Phys/QHP, EA 15 Min'),
    },
    rates: mcoUnverifiedRates('Driscoll Health Plan'),
    stcMap: txMcoInferredStc('Driscoll Health Plan'),
    vobContact: driscollContact,
    lastUpdated: ACCESS_DATE,
  },
  'aetna-texas': {
    edi: aetnaTxCommercialEdi,
    codeGrid: aetnaTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Texas-specific 270/271 STC document found.'),
    vobContact: aetnaTxCommercialContact,
    lastUpdated: ACCESS_DATE,
  },
  'cigna-texas': {
    edi: cignaTxCommercialEdi,
    codeGrid: cignaTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Texas-specific override found.'),
    vobContact: cignaTxCommercialContact,
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-texas': {
    edi: uhcTxCommercialEdi,
    codeGrid: uhcTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Texas-specific override found.'),
    vobContact: uhcTxCommercialContact,
    lastUpdated: ACCESS_DATE,
  },

  /* ==================== gap-fill: 6 new TX MCO guides ==================== */

  'community-health-choice-texas': {
    edi: chcEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "CHC's own ABA Medical Review Guideline requires bundling a signed prescriber referral with BOTH the Texas Standard Prior Authorization Form (TSPA) and the state's CCP Prior Authorization Request Form — two forms, not one. Submit via CHC's provider portal or fax 713.295.2283 / 1.844.899.2495 (STAR); BH-specific outpatient fax 713.576.0931.",
      '97155': "CHC's 90-day extension and 180-day recertification requests both require a child + parent/caregiver attendance log plus a BCBA(LBA)-and-parent-signed progress summary; CHC states members are 'expected to attend at least 85% of scheduled sessions' — falling below requires the ABA therapist to document why and what corrective measures were taken.",
    }),
    rates: mcoUnverifiedRates('Community Health Choice'),
    stcMap: txMcoInferredStc('Community Health Choice'),
    vobContact: chcContact,
    lastUpdated: ACCESS_DATE,
  },
  'bcbs-texas-medicaid': {
    edi: bcbstxMedicaidEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "BCBSTX's own PA code grid (eff. 1/1/2024) confirms 97151 as PA-required, 'Allowable only for members 20 years of age or younger.' Submit to BCBSTX's BH intake fax 1-888-530-9809 or the Availity Essentials portal — NOT Magellan, which BCBSTX insourced away from in 2024.",
      '99366': "Not found on BCBSTX's own PA code grid or provider manual — rely on the statewide TMPPM baseline rather than a BCBSTX-specific rule.",
    }),
    rates: mcoUnverifiedRates('Blue Cross Blue Shield of Texas (Medicaid)'),
    stcMap: txMcoInferredStc('Blue Cross Blue Shield of Texas (Medicaid)'),
    vobContact: bcbstxMedicaidContact,
    lastUpdated: ACCESS_DATE,
  },
  'cook-childrens-health-plan': {
    edi: cchpEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Cook Children's own ABA training adds a detail not stated in the statewide TMPPM baseline: the evaluation authorization carries a 30-day window. Submit through the EpicCare Link secure provider portal (fax 682-885-8402 for STAR/CHIP, or 682-303-0005 / 844-843-0005 for STAR Kids, only while portal access is pending) — determination letters are delivered via the portal only, never faxed.",
      '99366': "Cook Children's own training restates the statewide 99366 rule in more detail: F84.0-only reimbursement, capped twice per year, requiring at least 3 licensed professionals (one the LBA) meeting a minimum of 30 minutes.",
    }),
    rates: mcoUnverifiedRates("Cook Children's Health Plan"),
    stcMap: txMcoInferredStc("Cook Children's Health Plan"),
    vobContact: cchpContact,
    lastUpdated: ACCESS_DATE,
  },
  'parkland-community-health-plan': {
    edi: pchpEdi,
    codeGrid: {
      ...tmppmCodeGrid({
        '97151': "PCHP's own PA Requirements document (eff. 9/1/2025) states plainly PA is required for ABA evaluation, initial treatment, and re-evaluations/recertification. Submit via the BH-specific fax 214-266-2064 / 1-844-266-2064, the general PA fax 214-266-2085 / 1-844-303-1382, or PCHP's provider portal — behavioral health was insourced from Carelon effective 9/1/2025, so confirm your practice is credentialed directly with PCHP, not still routed through a Carelon-era process.",
      }),
      '97152': pchpPaListCode('97152'),
      '97157': pchpPaListCode('97157'),
    },
    rates: mcoUnverifiedRates('Parkland Community Health Plan'),
    stcMap: txMcoInferredStc('Parkland Community Health Plan'),
    vobContact: pchpContact,
    lastUpdated: ACCESS_DATE,
  },
  'el-paso-health': {
    edi: ephEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "El Paso Health's ABA Request Checklist (eff. 2/1/2022) caps the evaluation at 6 hrs/24 units (HO only) with the resulting authorization valid 60 days from the requested evaluation date; a 2026 memo additionally requires a validated standardized diagnostic tool (ADOS, ADI-R, or CARS named) — screening tools like the M-CHAT-R/F do not qualify. Submit via the provider portal (secure.healthx.com/elpasoprovider) or fax 915-298-7866 / 1-844-298-7866. An older 2022 PA Requirements Catalog listing these codes as 'no authorization required' is stale and superseded by the current ABA Request Checklist and 2026 memos — don't cite it.",
      '97155': "90-day extensions (billed under 97155) require attendance logs for both the child and the parent/caregiver plus an LBA progress summary; <85% attendance triggers a requirement for the LBA to document why and what corrective steps were taken (2026 memo).",
    }),
    rates: mcoUnverifiedRates('El Paso Health'),
    stcMap: txMcoInferredStc('El Paso Health'),
    vobContact: ephContact,
    lastUpdated: ACCESS_DATE,
  },
  'firstcare-health-plans': {
    edi: firstcareEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "FirstCare's Medicaid/CHIP PA code list (eff. 7/1/2026) confirms 97151 requires authorization, filed under \"Therapy services\" rather than \"Behavioral health.\" Submit via the myFirstCare Self-Service Portal (my.firstcare.com/Web) or fax using the Texas Standard PA form. CONFIRMED (not just plan-stated): TMHP (7/17/2026) and Texas HHS (7/21/2026) both announced Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026 — TMHP will not accept claims with dates of service after 8/31/2026. Treat this MCO's Medicaid line as expiring within weeks of this dataset's access date, not a stable long-term payer relationship.",
    }),
    rates: mcoUnverifiedRates('FirstCare Health Plans'),
    stcMap: txMcoInferredStc('FirstCare Health Plans'),
    vobContact: firstcareContact,
    lastUpdated: ACCESS_DATE,
  },

  /* ==================== closing sweep: 2 final TX gap-fill guides ==================== */

  'baylor-scott-white-texas': {
    edi: rightcareEdi,
    codeGrid: rightcareCodeGrid,
    rates: mcoUnverifiedRates('RightCare (Baylor Scott & White Health Plan)'),
    stcMap: txMcoInferredStc('RightCare (Baylor Scott & White Health Plan)'),
    vobContact: rightcareContact,
    lastUpdated: ACCESS_DATE,
  },
  'dell-childrens-health-plan': {
    edi: dellChildrensEdi,
    codeGrid: dellChildrensCodeGrid,
    rates: mcoUnverifiedRates("Dell Children's Health Plan"),
    stcMap: txMcoInferredStc("Dell Children's Health Plan"),
    vobContact: dellChildrensContact,
    lastUpdated: ACCESS_DATE,
  },
};
