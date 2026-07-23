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
import type { VobExtension, EdiRouting, CodeGridEntry, RateTable, SourceRef, StcMap } from './types.js';
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

/* ==================== export ==================== */

export const texasVob: Record<string, VobExtension> = {
  'texas-medicaid': {
    edi: texasMedicaidEdi,
    codeGrid: tmppmCodeGrid(),
    rates: TX_MEDICAID_RATES,
    stcMap: texasMedicaidStc,
    lastUpdated: ACCESS_DATE,
  },
  'superior-healthplan-texas': {
    edi: superiorEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Submit via Superior's provider portal; verify code-level PA status on Superior's Prior Authorization Requirements page (superiorhealthplan.com) — Superior's 1/1/2026 PA-removal list did not touch any ABA codes.",
    }),
    rates: mcoUnverifiedRates('Superior HealthPlan'),
    stcMap: txMcoInferredStc('Superior HealthPlan'),
    lastUpdated: ACCESS_DATE,
  },
  'texas-childrens-health-plan': {
    edi: tchpEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "TCHP's Guideline #11281 v3 restates this requirement nearly verbatim; submit to the UM Department via the electronic authorization portal, fax, phone, or mail.",
    }),
    rates: mcoUnverifiedRates("Texas Children's Health Plan"),
    stcMap: txMcoInferredStc("Texas Children's Health Plan"),
    lastUpdated: ACCESS_DATE,
  },
  'wellpoint-texas': {
    edi: wellpointEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Wellpoint accepts its own ASD Treatment Plan Request Form OR the state CCP PA form; submit via Availity Essentials, phone, or fax.",
    }),
    rates: mcoUnverifiedRates('Wellpoint (formerly Amerigroup Texas)'),
    stcMap: txMcoInferredStc('Wellpoint'),
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-community-plan-texas': {
    edi: uhcCommunityEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Routes through UHC's designated behavioral health network (Optum), phone 888-887-9003 — NOT the medical PA pipeline, even though the clinical criteria are the unchanged TMPPM baseline.",
    }),
    rates: mcoUnverifiedRates('UnitedHealthcare Community Plan of Texas'),
    stcMap: txMcoInferredStc('UnitedHealthcare Community Plan of Texas'),
    lastUpdated: ACCESS_DATE,
  },
  'aetna-better-health-texas': {
    edi: aetnaBetterHealthEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Aetna Better Health of Texas's plan-specific submission mechanics (form, portal, UM fax/phone) are not publicly verifiable — its provider manual and PA pages return errors to automated retrieval. Confirm directly with provider relations before first submission.",
    }),
    rates: mcoUnverifiedRates('Aetna Better Health of Texas'),
    stcMap: txMcoInferredStc('Aetna Better Health of Texas'),
    lastUpdated: ACCESS_DATE,
  },
  'molina-healthcare-texas': {
    edi: molinaEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Molina directs providers to its Behavioral Health and Medical Prior Authorization Code Matrix / Look-Up Tool for code-level PA handling — its PA guide PDFs sit behind bot protection and were not independently verified this pass.",
    }),
    rates: mcoUnverifiedRates('Molina Healthcare of Texas'),
    stcMap: txMcoInferredStc('Molina Healthcare of Texas'),
    lastUpdated: ACCESS_DATE,
  },
  'community-first-health-plans': {
    edi: communityFirstEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "Community First's own Autism Services Billing Guidelines page restates this requirement directly, plus a published HO/HN/HM modifier crosswalk and concurrent-billing rules — one of the clearest MCO-published TMPPM digests in Texas.",
    }),
    rates: mcoUnverifiedRates('Community First Health Plans'),
    stcMap: txMcoInferredStc('Community First Health Plans'),
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
    lastUpdated: ACCESS_DATE,
  },
  'aetna-texas': {
    edi: aetnaTxCommercialEdi,
    codeGrid: aetnaTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(aetnaFamilyStc, 'Inherited from the Aetna family default (docs/vob-build.md Layer 2) — no Texas-specific 270/271 STC document found.'),
    lastUpdated: ACCESS_DATE,
  },
  'cigna-texas': {
    edi: cignaTxCommercialEdi,
    codeGrid: cignaTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(cignaFamilyStc, 'Inherited from the Cigna/Evernorth family default (docs/vob-build.md Layer 2) — national companion guide, no Texas-specific override found.'),
    lastUpdated: ACCESS_DATE,
  },
  'unitedhealthcare-texas': {
    edi: uhcTxCommercialEdi,
    codeGrid: uhcTxCommercialCodeGrid,
    stcMap: inheritFamilyStc(uhcFamilyStc, 'Inherited from the UnitedHealthcare/Optum family default (docs/vob-build.md Layer 2) — national companion guide, no Texas-specific override found.'),
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
    lastUpdated: ACCESS_DATE,
  },
  'firstcare-health-plans': {
    edi: firstcareEdi,
    codeGrid: tmppmCodeGrid({
      '97151': "FirstCare's Medicaid/CHIP PA code list (eff. 7/1/2026) confirms 97151 requires authorization, filed under \"Therapy services\" rather than \"Behavioral health.\" Submit via the myFirstCare Self-Service Portal (my.firstcare.com/Web) or fax using the Texas Standard PA form. CONFIRMED (not just plan-stated): TMHP (7/17/2026) and Texas HHS (7/21/2026) both announced Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026 — TMHP will not accept claims with dates of service after 8/31/2026. Treat this MCO's Medicaid line as expiring within weeks of this dataset's access date, not a stable long-term payer relationship.",
    }),
    rates: mcoUnverifiedRates('FirstCare Health Plans'),
    stcMap: txMcoInferredStc('FirstCare Health Plans'),
    lastUpdated: ACCESS_DATE,
  },
};
