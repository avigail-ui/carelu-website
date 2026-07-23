/* ================================================================
   PAYER DIRECTORY CHANGELOG — machine-readable change history.
   Appended to by the monthly payer-refresh routine for every shipped
   change-set (policy updates, new guides, corrections). Newest-first
   consumers should sort by date; entries here are append-order.
   Served publicly at /api/payers/changelog.
   ================================================================ */

export interface PayerChangeEntry {
  date: string;                        // ISO date the change-set shipped
  type: 'initial' | 'policy-update' | 'guides-added' | 'correction' | 'vob-enrichment';
  summary: string;                     // human-readable description of the change-set
  guides?: string[];                   // slugs touched by this change-set (omit = broad/all)
  details?: { slug: string; field: string; change: string; sourceUrl?: string }[];
  totals: { guides: number; states: number }; // directory size AFTER this change-set
}

export const PAYER_CHANGELOG: PayerChangeEntry[] = [
  {
    date: '2026-07-20',
    type: 'initial',
    summary:
      'Directory compiled from primary sources: 164 payer guides across 19 states — each state Medicaid program, every Medicaid MCO, and commercial plans, plus national Aetna/Cigna/UnitedHealthcare policy deep-dives.',
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-21',
    type: 'policy-update',
    summary:
      'Cited Staffing & credentialing sections added to all 19 state-Medicaid guides (RBT/technician certification, background checks, supervision floors); NC HB 696 status corrected (signed into law 4/30/2026, CCP 8F rewrite pending); Utah manual claims reconciled.',
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'VOB enrichment scaffolding shipped (build spec: docs/vob-build.md): typed schemas for EDI routing crosswalks, 271 service-type-code maps, code-level coverage grids, Medicaid rate tables, and VOB contacts (src/data/payers/vob/); Layer 6 carve-out dataset + /api/payers/carveouts endpoint; Layer 8 group-override and client-network schemas defined empty by design. Guide API now nests `vob` per guide. Georgia Layers 1+3 and the national DOL Form 5500 employer funding dataset are the first population tracks.',
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Layer 5 populated: employer funding-type dataset (docs/vob-build.md) built from the DOL/EBSA EFAST2 Form 5500 + Schedule A public bulk datasets, plan year 2024 (the latest complete filing year — 2025 filings are still trickling in). 54,141 health & welfare plan rows (66,872 before the >=125-participant size-budget cut, kept to stay under ~20MB) covering employers with >=125 reported participants: 13,543 fully-insured, 2,585 self-funded, 38,013 mixed (multiple funding arrangements on one filing, e.g. self-funded medical + insured dental). Sharded alphabetically into src/data/vob-employers/employers-<letter-range>.json + index.json (17.7MB total); build script scripts/vob/build_employers.py is the source of truth for the annual refresh. Served at GET /api/employers?q=<name> (top-10 normalized-name match + a `resolution` field); absence of a match always resolves to funding \'unknown\', never \'fully-insured\' — employers under ~100 participants are largely exempt from filing and church/government plans never file at all, per the dataset meta block\'s documented limits.',
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Georgia VOB enrichment shipped: Layer 1 (EDI routing crosswalk — pVerify/Availity/Change Healthcare payer IDs, BH carve-out routing) and Layer 3 (code-level coverage grid for 97151–97158, 0362T, 0373T) populated for all 8 Georgia guides. The GAMMIS 5010 270-271 Companion Guide v2.19 is confirmed to exist but its content (CMO loop/segment, carrier-code map, eligibility-span granularity) is not retrievable via automated means — medicaid271Notes ships \'unverified\' rather than guessed. Georgia Medicaid, CareSource, and the GA DCH 2023 provider presentation together confirm current max-daily-unit caps for all 10 codes (superseding the stale 2018 ASD manual’s Category III code table); Peach State and Amerigroup GA codeGrid entries are largely \'inferred\' from that statewide pattern since their own published policies (GA.CP.BH.504; the 2017/2018 CG-BEH-02 guideline) don’t restate code-level billing mechanics. Cigna/Evernorth’s BH carve-out confirmed as a same-payer-ID pass-through (no second EDI hop); Anthem’s Carelon routing and UnitedHealthcare’s Optum BH routing remain unresolved pending provider-services confirmation.',
    guides: [
      'georgia-medicaid',
      'amerigroup-georgia',
      'caresource-georgia',
      'peach-state-georgia',
      'anthem-bcbs-georgia',
      'aetna-georgia',
      'cigna-georgia',
      'unitedhealthcare-georgia',
    ],
    details: [
      {
        slug: 'georgia-medicaid',
        field: 'edi.payerId',
        change: 'pVerify 00100, Availity 77034/GAMEDICAID/D77034; Change Healthcare ambiguous (SKGA0 vs 12K05), left unverified.',
        sourceUrl: 'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
      },
      {
        slug: 'georgia-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'GAMMIS 5010 270-271 Companion Guide v2.19 confirmed to exist on the GAMMIS EDI portal; content not retrievable (interactive-only, static mirror 403s) — shipped unverified rather than guessed.',
        sourceUrl: 'https://www.mmis.georgia.gov/portal/PubAccess.EDI/Companion%20Guides/tabId/45/Default.aspx',
      },
      {
        slug: 'georgia-medicaid',
        field: 'codeGrid.*.unitCap',
        change:
          'Current CMS max-daily-units for all 10 codes (97151=32, 97152=16, 97153=32, 97154=18, 97155=24, 97156=16, 97157=16, 97158=16, 0362T=16, 0373T=32), cross-confirmed against CareSource MCD-MM-0212.',
        sourceUrl:
          'https://www.mmis.georgia.gov/portal/portals/0/staticcontent/public/all/notices/autism%20spectrum%20disorder%202023%20(002)%2020230209200139.pdf',
      },
      {
        slug: 'cigna-georgia',
        field: 'edi.bhCarveOut',
        change:
          'Confirmed Evernorth Behavioral Health rides on the SAME payer ID as Cigna medical (62308) — no second EDI hop required for ABA claims.',
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/autism-resource-guide.pdf',
      },
      {
        slug: 'anthem-bcbs-georgia',
        field: 'edi.bhCarveOut',
        change:
          'Carelon Behavioral Health is Anthem’s known BH administrator, but whether GA ABA claims route through Carelon (payer ID BHOVO/CHCBH) or Anthem’s own medical ID (00601) is unresolved — the Anthem ABA Provider Resource Guide describes standard CMS-1500 billing with no carve-out named. Shipped unverified.',
        sourceUrl:
          'https://files.providernews.anthem.com/5585/MULTI-BCBS-CM-072378-24-CPN72366-EXPRESS-ABA-prov-resource-gd-FINAL-V3.pdf',
      },
      {
        slug: 'amerigroup-georgia',
        field: 'codeGrid',
        change:
          'Amerigroup’s published CG-BEH-02 guideline (2017/2018) predates 97151–97158 entirely and has no code-level billing detail in any known revision — the full grid is inferred from the statewide DCH/CMS pattern, not confirmed against Amerigroup’s own current criteria.',
        sourceUrl:
          'https://provider.amerigroup.com/docs/gpp/GA_CAID_UMGuideline_AdaptiveBehavioralTreatmentAutismSpectrumDisorder.pdf?v=202101081602',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'correction',
    summary:
      'Directory corrections from MCO census (docs/vob-gaps.md), each independently re-verified against its primary source before applying: NC WellCare-into-Carolina-Complete-Health merger, IN MDwise exit, MA Tufts Health Together MCO discontinuation + WellSense BH insourcing, AZ Health Choice rebrand, and an NY Molina/Affinity co-brand note. No guide was deleted and no slug was changed.',
    guides: [
      'wellcare-north-carolina',
      'carolina-complete-health',
      'mdwise-indiana',
      'unitedhealthcare-community-plan-indiana',
      'tufts-health-together',
      'wellsense-massachusetts',
      'health-choice-arizona',
      'molina-healthcare-new-york',
    ],
    details: [
      {
        slug: 'wellcare-north-carolina',
        field: 'cardDesc / intro / atGlance / faq',
        change:
          'WellCare of North Carolina merged into Carolina Complete Health effective 4/1/2026. Guide kept (not deleted) with an unmistakable merged-status note and a pointer to the Carolina Complete Health guide.',
        sourceUrl:
          'https://medicaid.ncdhhs.gov/providers/provider-playbook-medicaid-managed-care/trending-topics/wellcare-north-carolina-and-carolina-complete-health-merge-april-1-2026',
      },
      {
        slug: 'carolina-complete-health',
        field: 'cardDesc / atGlance.Footprint / sections / collect / faq',
        change:
          'Service-area claim updated from a regional footprint (formerly described as \'regions 3–5\') to statewide, reflecting the 4/1/2026 WellCare merger.',
        sourceUrl:
          'https://medicaid.ncdhhs.gov/providers/provider-playbook-medicaid-managed-care/trending-topics/wellcare-north-carolina-and-carolina-complete-health-merge-april-1-2026',
      },
      {
        slug: 'mdwise-indiana',
        field: 'cardDesc / intro / atGlance / sections / collect / faq',
        change:
          'MDwise ended as an MCE for HIP and Hoosier Healthwise effective 1/1/2026; members reassigned to Anthem, CareSource, or MHS. Guide kept (not deleted) with a status note.',
        sourceUrl: 'https://www.in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf',
      },
      {
        slug: 'unitedhealthcare-community-plan-indiana',
        field: 'cardDesc / h1 / intro / atGlance.Plan type / sections / collect / faq',
        change:
          'Scope confirmed and made explicit: UnitedHealthcare Community Plan of Indiana serves Hoosier Care Connect and PathWays for Aging only — confirmed via FSSA\'s own managed-care plan roster that UHC does not administer HIP or Hoosier Healthwise in Indiana.',
        sourceUrl: 'https://www.in.gov/medicaid/partners/medicaid-partners/managed-care-health-plans/',
      },
      {
        slug: 'tufts-health-together',
        field: 'cardDesc / h1 / intro / atGlance / sections / collect / sources / faq',
        change:
          'Tufts Health Together MCO product discontinued effective 1/1/2026; only its two ACPPs (with Cambridge Health Alliance, with UMass Memorial Health) remain active. Guide updated to an ACPP-only structure.',
        sourceUrl:
          'https://www.mass.gov/doc/all-provider-bulletin-410-changes-to-masshealths-accountable-care-organizations-on-january-1-2026/download',
      },
      {
        slug: 'wellsense-massachusetts',
        field: 'cardDesc / intro / atGlance.BH administrator / sections / sources / faq',
        change:
          'WellSense\'s behavioral-health administration (including ABA) moved from Carelon to in-house effective 1/1/2026.',
        sourceUrl: 'https://www.wellsense.org/providers/behavioral-health-insourcing/faqs',
      },
      {
        slug: 'health-choice-arizona',
        field: 'payer / pill / h1 / metaTitle / metaDescription / intro / atGlance / sources / faq',
        change:
          '"Health Choice Arizona" display name updated to "Blue Cross Blue Shield of Arizona Health Choice" per AHCCCS\'s current official health plan list; slug (health-choice-arizona) unchanged, coverage/mechanics unaffected. Cross-references in the Arizona state guide updated to match.',
        sourceUrl: 'https://azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf',
      },
      {
        slug: 'molina-healthcare-new-york',
        field: 'intro / sources / faq',
        change:
          'Added a one-line note that "Affinity by Molina Healthcare" remains an actively-marketed downstate Medicaid Managed Care co-brand, not purely legacy Affinity branding.',
        sourceUrl: 'https://www.molinahealthcare.com/members/ny/hp/affinity/medicaid/overvw/overvw.aspx',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'NC split A shipped: Layer 1 (EDI routing crosswalk), Layer 3 (code-level coverage grid), and Layer 4 (Medicaid rate tables) populated for North Carolina Medicaid FFS and 4 of its Standard Plans, plus the merged WellCare of NC guide kept for historical/routing reference. Read the NCTracks 270/271 Companion Guide (ASC X12N005010X279A1, Apr 2025) in full — unlike Georgia\'s, it IS a static fetchable PDF: the 2110C EB loop (Appendix A) carries managed-care PLAN-TYPE codes (Standard/Tailored/Carve-out/Health Choice), while the specific MCO\'s identity/contact returns dynamically in the 2120C NM1/PER loop, not from a fixed carrier-name table — captured as such rather than forced into a false MCO-code map. Confirmed directly from the live CCP 8F PDF (Amended Date 2019-08-15, still in force) that NC Medicaid\'s RB-BHT code set is ONLY 97151-97157 — 97158/0362T/0373T ship as explicit "not covered" entries, not omitted or guessed. Corrected an assumed HB 696 8/1/2026 effective date after reading the ratified bill text directly: Session Law 2026-1\'s ABA provisions (Sec. 3C.18) are effective on enactment, 4/30/2026, with no rate or billing-rule change tied to 8/1/2026 anywhere in the bill, and the amended CCP 8F remains unpublished as of this access date. Confirmed Healthy Blue, AmeriHealth Caritas, and Carolina Complete Health each publish zero ABA code-level billing detail (pure 8F deference, several confirmed in the plans\' own document text); WellCare of NC\'s WNC.CP.109 is the one plan-authored CPT/modifier grid (GT/KX) in this set, kept historical per its 4/1/2026 merger into Carolina Complete Health, whose own merger page supplied the unified payer ID (68069) and legacy WellCare-only codes (PCS 23937, HHCS 57538) with an explicit pre-merger claims-rejection warning. Several EDI payer IDs surfaced clearinghouse-specific splits (different codes for claims vs. 270/271 RTE vs. ERA for the same payer, e.g. Healthy Blue, AmeriHealth Caritas NC) — each shipped with its own verifyVia note rather than collapsed into one number. UnitedHealthcare Community Plan NC: confirmed its Optum BH carve-out claims ride the SAME payer ID as medical (87726, no second EDI hop) but explicitly did NOT apply Optum\'s national ABA Modifier FAQ (HN/HO/HM/HP) to Medicaid, since that document scopes itself to "commercial members only."',
    guides: [
      'north-carolina-medicaid',
      'healthy-blue-north-carolina',
      'amerihealth-caritas-north-carolina',
      'carolina-complete-health',
      'unitedhealthcare-community-plan-north-carolina',
      'wellcare-north-carolina',
    ],
    details: [
      {
        slug: 'north-carolina-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'NCTracks 270/271 Companion Guide (Apr 2025) read in full: 2110C EB loop carries managed-care plan-TYPE codes (Appendix A: MCSTD, MCCRV, MCCFS, TPMC, TPHC, TPINV, TPTBI, HCSTD, HCCRV, PHPB, PHPC, PHHC); the specific MCO name/contact returns dynamically in the 2120C NM1/PER loop, not from this table. Real-time, CAQH-CORE-compliant exchange confirmed.',
        sourceUrl:
          'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
      },
      {
        slug: 'north-carolina-medicaid',
        field: 'codeGrid.97158 / 0362T / 0373T',
        change:
          "Confirmed absent from CCP 8F Attachment A's billing-code table (97151-97157 only) by opening the current policy PDF directly — shipped as explicit 'not covered' entries across all 6 guides rather than omitted or filled with an invented cap.",
        sourceUrl: 'https://medicaid.ncdhhs.gov/documents/files/8f/open',
      },
      {
        slug: 'north-carolina-medicaid',
        field: 'codeGrid.*.notes (HB 696 date correction)',
        change:
          "Read the ratified HB 696 / Session Law 2026-1 bill text directly: ABA provisions (Sec. 3C.18) are effective 4/30/2026 (date of enactment), not 8/1/2026 — no primary source ties any ABA rate or billing-rule change to 8/1/2026, and the amended CCP 8F remains unpublished as of this access date.",
        sourceUrl: 'https://dashboard.ncleg.gov/api/Services/BillDocument/2025/8406/0/HB%20696v5',
      },
      {
        slug: 'carolina-complete-health',
        field: 'edi.payerId / notes',
        change:
          "Unified payer ID 68069 effective 4/1/2026 confirmed via the plan's own merger page, along with legacy WellCare-only codes (PCS 23937, HHCS 57538) required for pre-4/1/2026 dates of service and the plan's explicit warning that submitting pre-merger WellCare claims under 68069 triggers a 'Mbr not valid on DOS' rejection.",
        sourceUrl: 'https://network.carolinacompletehealth.com/merger.html',
      },
      {
        slug: 'unitedhealthcare-community-plan-north-carolina',
        field: 'edi.bhCarveOut',
        change:
          "Confirmed the Optum BH carve-out for ABA rides the SAME payer ID as UHC medical claims (87726) — no second EDI hop. Explicitly did NOT apply Optum's national ABA Modifier FAQ (HN/HO/HM/HP tiers) to this guide's codeGrid, since that document states it applies to commercial members only.",
        sourceUrl: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ncaba/ncABA-QRG.pdf',
      },
      {
        slug: 'wellcare-north-carolina',
        field: 'codeGrid',
        change:
          "WNC.CP.109's own CPT/modifier grid (GT video-telehealth for 97151-97157; KX audio-only additionally for 97156/97157) shipped as historical/reference given the plan's 4/1/2026 merger into Carolina Complete Health — confirmed the policy document was still live and unchanged at access date but may be withdrawn without notice.",
        sourceUrl: 'https://www.policies-wellcare.com/content/dam/centene/wellcare/nc/policies/clinical-policies/WNC.CP.109.pdf',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'NC VOB enrichment SPLIT B shipped (docs/vob-build.md): Layer 1 (EDI crosswalk) + Layer 3 (code-level coverage grid) for all 7 guides, plus Layer 4 (Medicaid rate tables) for the 3 Tailored Plans that post one. Verified NC Medicaid\'s CCP 8F billable RB-BHT code set is 97151-97157 ONLY — 97158/0362T/0373T are confirmed absent from 8F\'s own code table, from Alliance\'s and Trillium\'s rate schedules, and from Vaya\'s authorization guidelines, so codeGrid ships those three as "not in state code set" rather than inventing entries; the full 10-code CPT set applies as normal to the 3 commercial guides. None of the 4 Tailored Plans (Alliance, Trillium, Vaya, Partners) appear under their own name on pVerify\'s or Availity\'s national payer lists (both fetched and full-text searched, not skimmed) — nor does NC Medicaid itself appear on Availity\'s list — so EDI payerId ships unverified for all 4 except where a plan\'s own document gave one directly (Trillium: Change Healthcare 56089 / SSI Group 43071, from its own Claims Submission Protocol). Vaya\'s document library, reported bot-blocked in the original compile, was retried and is NOT currently blocked — its Authorization Guidelines v2.0 and RB-BHT Guidance both extracted cleanly as plain text and supplied real code-level passthrough thresholds (97151: 32 units/6mo; 97155: 10% of 97153/97154 hours), applied as \'inferred\' to the other 3 Tailored Plans per the statewide CCP 8F pattern. Partners\' payer ID 68069 was confirmed, via Partners\' own FAQ with Carolina Complete Health, to be CCH\'s PHYSICAL-health delegation ID, not a behavioral-health/RB-BHT one — shipped unverified rather than reusing it incorrectly. UnitedHealthcare\'s Optum BH carve-out has real NC evidence this pass (Optum\'s own NC Medicaid ABA Quick Reference Guide: "Claims Payer ID 87726," same as medical) applied as inferred cross-LOB pattern to the commercial guide. Cigna/Evernorth\'s same-payer-ID pass-through (62308) reconfirmed, consistent with the Georgia build.',
    guides: [
      'alliance-health-north-carolina',
      'trillium-health-resources',
      'vaya-health',
      'partners-health-management',
      'aetna-north-carolina',
      'cigna-north-carolina',
      'unitedhealthcare-north-carolina',
    ],
    details: [
      {
        slug: 'trillium-health-resources',
        field: 'rates',
        change:
          'Own posted Rate Table FY 26-27: 97151 $30.56, 97152 $61.73, 97153 $20.81, 97154 $11.37, 97155 $32.22, 97156 $23.70, 97157 $11.51 per 15-min unit — matches Alliance\'s posted schedule exactly.',
        sourceUrl: 'https://www.trilliumhealthresources.org/sites/default/files/docs/Billing-Codes-Rates/Trillium-Rate-Table-FY-26-27.pdf',
      },
      {
        slug: 'vaya-health',
        field: 'rates.byCode.97156',
        change:
          'Vaya\'s only located rate document (dated 8/1/2024, eff. 7/1/2024) lists 97156 at $30.00, conflicting with the $23.70 both Alliance and Trillium currently post (eff. 10/1/2025) — flagged as a conflict rather than silently reconciled; shipped unverified pending a current Vaya-specific schedule.',
        sourceUrl: 'https://providers.vayahealth.com/wp-content/uploads/2024/07/Standard_Rate_Schedule_Tailored-Plan-Medicaid-Direct_Non-Clinician_20240801.pdf',
      },
      {
        slug: 'vaya-health',
        field: 'edi (bot-block retry)',
        change:
          'Vaya\'s provider-document library, reported bot-blocked in the original corpus compile, is NOT currently blocked — its Authorization Guidelines v2.0 (9/5/2025) and RB-BHT Guidance (5/1/2025) both retrieved and extracted cleanly as plain text this pass.',
        sourceUrl: 'https://providers.vayahealth.com/wp-content/uploads/2025/09/Authorization_Guidelines_Medicaid_RB_BHT_ASD.pdf',
      },
      {
        slug: 'partners-health-management',
        field: 'edi.payerId',
        change:
          'Payer ID 68069 confirmed (via the Partners/Carolina Complete Health FAQ) to be CCH\'s payer ID for physical-health claims delegated under the Tailored-Plan/Centene arrangement, NOT a behavioral-health/RB-BHT payer ID — shipped unverified rather than misapplying it.',
        sourceUrl: 'https://network.carolinacompletehealth.com/content/dam/centene/carolinacompletehealth/pdfs/Partners-Carolina-Complete-Health-FAQ-General-Topics-3.7.24.pdf',
      },
      {
        slug: 'unitedhealthcare-north-carolina',
        field: 'edi.bhCarveOut',
        change:
          'Optum\'s own NC Medicaid ABA Quick Reference Guide confirms "Claims Payer ID 87726" (same as UHC medical) for autism/ABA claims addressed to Optum Behavioral Health — applied to this commercial guide as inferred cross-LOB pattern evidence (the QRG itself is Medicaid-specific), not a commercial-specific confirmation.',
        sourceUrl: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ncaba/ncABA-QRG.pdf',
      },
      {
        slug: 'codeGrid (all 4 Tailored Plans)',
        field: 'codeGrid.97158 / codeGrid.0362T / codeGrid.0373T',
        change:
          'Confirmed absent from NC Medicaid\'s actual CCP 8F billable RB-BHT code set (97151-97157 only) — verified directly against CCP 8F\'s own CPT table, Alliance\'s and Trillium\'s rate schedules, and Vaya\'s authorization guidelines, rather than assumed from the standard 10-code CPT list.',
        sourceUrl: 'https://medicaid.ncdhhs.gov/documents/files/8f-1/open',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'FL VOB enrichment SPLIT A shipped (docs/vob-build.md): Layer 1 (EDI crosswalk) + Layer 3 (code-level coverage grid) for 6 guides, plus Layer 4 (Medicaid rate table) for florida-medicaid. The FLMMIS 270/271 Companion Guide (v4.0, 2023-04-27) was retrieved and read in full — unlike Georgia\'s, it is a fetchable static PDF — confirming Florida\'s canonical X12 payer ID (77027) and that managed-care enrollment in the 271 has NO fixed carrier-code table (Loop 2110C "Managed Care" repetition, MCO identity as free text in nested Loop 2120C NM103); that absence is shipped as a verified fact, not an unfilled gap. The current AHCA Behavior Analysis fee schedule was retrieved directly for both 2025 and 2026 (rates identical) and surfaced a real finding, cross-confirmed by three independent primary sources (AHCA\'s fee schedule, Sunshine Health\'s own FL.CP.BH.500 coding table, and Humana\'s Florida Medicaid PA list): CPT 97157 does not appear on any of them and ships as covered:\'No\' rather than assumed-covered. Florida also confirmed a genuine coding quirk opposite Georgia\'s pattern: only 97156 (family/caregiver training) has a stated telehealth allowance anywhere in state or plan documentation (GT modifier, 2 hrs/week cap, Rule 59G-1.057) — every other code ships telehealth:\'No\' by verified policy design. None of the 4 MCOs in this split publish a full code-level unit-cap/POS/telehealth table of their own, so each MCO codeGrid inherits the AHCA statewide baseline as \'inferred\' (per the coverage policy\'s plan-compliance clause, §1.2) and upgrades specific fields to \'verified\' only where that plan\'s own document independently confirms them — Sunshine\'s FL.CP.BH.500 clinical policy confirms the most; Simply/Carelon\'s and UHC/Optum\'s FL-specific QRGs confirm almost none. Sunshine Health\'s previously-unconfirmed BA network-enrollment pause (flagged as an unverified industry blog report in the shipped florida.ts prose) is now CONFIRMED from Sunshine\'s own newsroom: effective 2025-10-01 in all AHCA regions except A and B, partially lifted in Regions E and F starting 2026-03-01. Humana\'s non-par reimbursement, previously vague ("a percentage of..."), now has an exact figure from Humana\'s own PA form: 80% of the Florida Medicaid fee schedule absent a controlling legal requirement or Letter of Agreement. "TNFL" (Therapy Network of Florida) was investigated per the build brief and confirmed to administer BA for Community Care Plan, a Florida MMA plan OUTSIDE this split\'s 6 guides — none of the 5 MCO/state guides shipped here delegate to TNFL.',
    guides: [
      'florida-medicaid',
      'sunshine-health-florida',
      'cms-health-plan-florida',
      'simply-healthcare-florida',
      'unitedhealthcare-community-plan-florida',
      'humana-healthy-horizons-florida',
    ],
    details: [
      {
        slug: 'florida-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'FLMMIS 270/271 Companion Guide v4.0 (2023-04-27) retrieved and read in full: payer ID 77027; MCO enrollment surfaces in Loop 2110C\'s "Eleventh Repetition – Managed Care" with the MCO name as free text in nested Loop 2120C (NM103) — no fixed carrier-code table exists, shipped as a verified fact. Eligibility spans use DTP qualifier 307 in RD8 (date-range) format.',
        sourceUrl: 'https://portal.flmmis.com/FLPublic/Portals/0/StaticContent/Public/COMPANION%20GUIDES/FMMIS_5010_270_271_Companion%20Guide_v4_0_04272023.pdf',
      },
      {
        slug: 'florida-medicaid',
        field: 'codeGrid.97157 / rates.byCode.97157',
        change:
          'CPT 97157 is absent from both the 2025 and 2026 AHCA Behavior Analysis fee schedules and not listed among covered service categories in the Dec 2024 coverage policy §4.2.2 — cross-confirmed absent from Sunshine Health\'s own coding table and Humana\'s FL PAL too. Shipped covered:\'No\' with fieldStatus \'verified\' (verified-absent across 3 independent sources), not an unfilled gap.',
        sourceUrl: 'https://ahca.myflorida.com/content/download/26138/file/2025%20Behavior%20Analysis%20Fee%20Schedule.pdf',
      },
      {
        slug: 'florida-medicaid',
        field: 'codeGrid.97156.telehealth',
        change:
          'Only 97156 (family/caregiver training) has a confirmed telehealth allowance in Florida Medicaid BA — GT modifier, capped at 2 hrs/week, per Rule 59G-1.057, F.A.C. Every other code ships telehealth:\'No\' by verified policy design, the opposite pattern from Georgia (which allows telehealth broadly via POS 02/10 on every code).',
        sourceUrl: 'https://www.flrules.org/gateway/readRefFile.asp?refId=17525&filename=Florida%20Medicaid%20Behavior%20Analysis%20Services%20Coverage%20Policy.pdf',
      },
      {
        slug: 'sunshine-health-florida',
        field: 'codeGrid.97153.notes (network pause)',
        change:
          'Sunshine\'s BA network-enrollment pause — previously only sourced to an unverified industry blog — is now confirmed from Sunshine\'s own newsroom: effective 2025-10-01 in all AHCA regions except A and B, partially lifted in Regions E and F starting 2026-03-01.',
        sourceUrl: 'https://www.sunshinehealth.com/newsroom/aba-pause.html',
      },
      {
        slug: 'simply-healthcare-florida',
        field: 'edi.bhCarveOut',
        change:
          'Confirmed Carelon Behavioral Health handles BOTH authorizations AND claims for Simply\'s BA benefit (abaRidesOn:\'bh\', twoHopRequired:true) — distinct from UHC Community Plan/Optum, where Optum manages UM but claims still bill under UHC\'s own payer ID 87726 (abaRidesOn:\'medical\', twoHopRequired:false). No Florida-specific Carelon EDI payer ID could be confirmed; a commonly-cited "BHOVO" code could not be verified against any primary Carelon source.',
        sourceUrl: 'https://provider.simplyhealthcareplans.com/docs/gpp/FLFL_SIMPLY_CarelonBehavioralAnalysisTrainingRes.pdf?v=202503041513',
      },
      {
        slug: 'humana-healthy-horizons-florida',
        field: 'codeGrid (non-par rate)',
        change:
          'Non-par reimbursement is 80% of the Florida Medicaid fee schedule absent a controlling legal requirement or Letter of Agreement (Humana\'s own MCD 466 PA form, p.3) — replaces the previously vague "a percentage of..." language with an exact figure.',
        sourceUrl: 'https://assets.humana.com/is/content/humana/ABA_PA_Formpdf',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Texas VOB enrichment shipped: Layer 1 (EDI crosswalk), Layer 3 (code-level coverage grid), and Layer 4 (Medicaid rate tables; none for commercial) populated for all 12 Texas guides. Unlike hhs.texas.gov (403-blocked to automated fetch per docs/vob-gaps.md), tmhp.com was directly retrievable: the 270/271 Medicaid/CHIP Eligibility Companion Guide (Nov 2024), the TMPPM Children\'s Services Handbook §2.3 Autism Services, and TMHP\'s "AUTISM SERVICES" static fee schedule (PRCR615C) were all fetched and read in full. Cross-checking the handbook against the fee schedule independently confirmed Texas\'s actual THSteps-CCP Autism Services billable code set is 97151, 97153, 97154, 97155, 97156, 97158, and 99366 — CPT codes 97152, 97157, 0362T, and 0373T appear in neither primary source and ship \'unverified\' across every Medicaid-track guide rather than populated from another state\'s code list. Texas\'s ABA benefit is confirmed not carved out to any third-party BH administrator anywhere in the state (all 8 Medicaid MCOs ship bhCarveOut.administrator:\'none\'), with one nuance already established in existing texas.ts prose: UnitedHealthcare Community Plan of Texas routes ABA authorization to its own Optum-administered BH network rather than its medical PA pipeline (abaRidesOn:\'bh\'). The 3 commercial guides (aetna-texas, cigna-texas, unitedhealthcare-texas) reuse their already-verified national clinical policies (EN0499, CPB 0554/0648, Optum 2022RP501A) with the full national CPT code set, per the build spec\'s "do not attempt commercial rates" instruction.',
    guides: [
      'texas-medicaid',
      'superior-healthplan-texas',
      'texas-childrens-health-plan',
      'wellpoint-texas',
      'unitedhealthcare-community-plan-texas',
      'aetna-better-health-texas',
      'molina-healthcare-texas',
      'community-first-health-plans',
      'driscoll-health-plan',
      'aetna-texas',
      'cigna-texas',
      'unitedhealthcare-texas',
    ],
    details: [
      {
        slug: 'texas-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          "The 270/271 Companion Guide's Appendix 11.1 \"Managed Care Program Codes\" table (STAR=1, STAR PLUS=2, Foster Care/STAR Health=6, CHIP=8, STAR Kids=K, populated in EB05) is a PROGRAM-level code table, not a per-MCO health-plan lookup — the actual MCO name rides as free text in REF02 (REF01=18) inside the 2110C \"Covered Managed Care\" EB loop. Eligibility span is a date range (DTP*356/357), not a fixed monthly bucket. Both facts verified directly from the TMHP-hosted companion guide (Nov 2024) — not blocked like hhs.texas.gov.",
        sourceUrl: 'https://www.tmhp.com/sites/default/files/file-library/edi/D00026_270_271_Medicaid_CHIP_Eligibility_Companion_Guide.pdf',
      },
      {
        slug: 'texas-medicaid',
        field: 'codeGrid / rates',
        change:
          "Confirmed via two independent primary sources (TMPPM §2.3 and the Autism Services fee schedule PRCR615C) that 97152, 97157, 0362T, and 0373T are not part of Texas's THSteps-CCP Autism Services billable code set — zero occurrences in the full handbook text, zero rows in the fee schedule. Verified rates for the 7 codes that ARE covered: 97151 $27.56 (HO), 97153 $14.50, 97154 $1.63, 97155 $20.08 (HN)/$25.10 (HO), 97156 $18.40 (HN)/$23.01 (HO), 97158 $2.25 (HN)/$2.81 (HO), 99366 $33.96 — eff. 9/1/2025 where updated.",
        sourceUrl: 'https://public.tmhp.com/FeeSchedules/StaticFeeSchedule/FeeSchedules.aspx?fn=%5C%5Ctmhp.net%5CFeeSchedule%5CPROD%5CStatic%5CTexas_Medicaid_Fee_Schedule_PRCR615C.pdf',
      },
      {
        slug: 'unitedhealthcare-community-plan-texas',
        field: 'edi.bhCarveOut',
        change:
          "Confirmed ABA authorization routes to UHC's own Optum-administered behavioral health network (888-887-9003), not the medical PA pipeline — abaRidesOn:'bh', twoHopRequired inferred true. The BH network's own distinct EDI payer ID (candidate: pVerify's UHG007) could not be confirmed for Texas specifically and ships unverified.",
        sourceUrl: 'https://www.uhcprovider.com/content/dam/provider/docs/public/commplan/tx/prior-auth/star-kids/TX-UHCCP-STAR-KIDS-Prior-Auth-Eff-11-1-2025.pdf',
      },
      {
        slug: 'wellpoint-texas',
        field: 'edi.payerId.availity',
        change:
          "No entry branded \"Wellpoint\" exists in Availity's public payer list for Texas — only pre-rebrand \"Amerigroup\" entries split by region (Houston/Ft. Worth/Multiple States/generic). Shipped unverified rather than guessing which regional code applies.",
        sourceUrl: 'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      "FL split B shipped, merged into split A's florida.ts (docs/vob-build.md): Layer 1 (EDI routing crosswalk), Layer 3 (code-level coverage grid), and Layer 4 (Medicaid rate table; none for the 3 commercial guides, per spec) for 7 guides — Aetna Better Health of Florida, Molina Healthcare of Florida, Community Care Plan, Florida Community Care, and the Aetna/Cigna/UnitedHealthcare Florida commercial guides. Split B's own first-pass code grid (built from a PDF-text-extraction read of the AHCA coverage policy plus a secondary fee-schedule tracker, since AHCA's fee-schedule PDF 403s a default WebFetch User-Agent) was superseded during the merge: split A independently retrieved the ACTUAL AHCA fee-schedule PDFs (browser-spoofed request) and three MCOs' own coding documents, a materially stronger primary-source base for the identical statewide facts — per \"accuracy beats completeness,\" split B's four Medicaid MMA guides were rebuilt on split A's FL_CODE_FACTS/mcoEntry() infrastructure rather than kept on a parallel, weaker-sourced grid. Read Aetna Better Health of Florida's own Quick Reference Guide directly, confirming EDI payer ID 128FL (an upgrade over guessing past florida.ts's access-blocked-site caveat) and a Behavioral Health-specific PA phone line (1-833-365-2474) not previously documented. Read Community Care Plan's Therapy Network of Florida Behavior Analysis Provider Manual in full, confirming its EDI payer IDs (65062 professional / 12k89 institutional) verbatim, upgraded into the shared mcoEntry() confirmed-fields mechanism. Read Florida Community Care's own BA services page directly, surfacing a previously-undocumented fact: Behavioral Services Network (BSN) is FCC's behavioral-health network partner for credentialing (as it also is for Aetna Better Health of Florida) even though FCC's own Utilization Department still adjudicates BA prior authorizations in-house. Confirmed UnitedHealthcare/Optum's national COMMERCIAL claims payer ID (87726) directly from Optum's own Provider Express EDI page, upgrading Georgia's unverified Availity ID and unverified BH administratorPayerId/abaRidesOn for the same carrier family to verified, matching the identical finding already shipped for UnitedHealthcare Community Plan of North Carolina. Cigna/Evernorth's same-payer-ID pass-through (62308) is confirmed via the same national Autism Resource Guide already cited in Georgia. Aetna's commercial BH administration remains unverified: its own June 2022 OfficeLink Updates ABA claims page names no claims administrator — an absence of evidence, not confirmation. A cross-split correction surfaced during the merge: the shared Availity payer-list PDF both splits read carries an \"As of 08/08/2012\" footer on every page — split A had already flagged this (AVAILITY_PAYER_LIST_STALE); split B's aetna-florida commercial entry is corrected accordingly (payerId.availity/changeHealthcare downgraded 'verified' → 'inferred', since 60054 is a long-standing national ID rather than independently reconfirmed this pass).",
    guides: [
      'aetna-better-health-florida',
      'molina-healthcare-florida',
      'community-care-plan-florida',
      'florida-community-care',
      'aetna-florida',
      'cigna-florida',
      'unitedhealthcare-florida',
    ],
    details: [
      {
        slug: 'aetna-better-health-florida',
        field: 'edi.payerId',
        change:
          "ABHFL's own Quick Reference Guide (Rev. 11/2024) confirms EDI/EFT payer ID 128FL and Real Time (270/271) payer ID ABHFL via its Office Ally enrollment section; also surfaces a distinct Behavioral Health PA phone line (1-833-365-2474) not previously documented.",
        sourceUrl: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/provider/pdf/abhfl_quick_reference_guide.pdf',
      },
      {
        slug: 'florida-community-care',
        field: 'edi.bhCarveOut',
        change:
          "FCC's own BA services page names Behavioral Services Network (BSN) as its behavioral-health network partner (register at providers.bsnnet.com/auth/register) — a fact absent from florida.ts's existing FCC prose, which describes BA authorization as fully in-house. Captured as a credentialing-only carve-out: BA prior authorization itself still runs through FCC's own Utilization Department, not BSN.",
        sourceUrl: 'https://fcchealthplan.com/ba-services/',
      },
      {
        slug: 'community-care-plan-florida',
        field: 'edi.payerId / codeGrid',
        change:
          'Read Therapy Network of Florida\'s own Behavior Analysis Provider Manual for Community Care Plan in full: confirms EDI payer ID verbatim ("Our Payer ID is 65062 for professional claims and 12k89 for institutional claims"), the group-size-6 cap, and the 40-hrs/week aggregate threshold directly rather than by state-pattern inference alone.',
        sourceUrl: 'https://www.therapynetwork.com/state_links/ba/manuals/Community-Care-Plan-Behavior-Analysis-Provider-Manual.pdf',
      },
      {
        slug: 'unitedhealthcare-florida',
        field: 'edi.payerId / edi.bhCarveOut',
        change:
          'Confirmed directly from Optum Provider Express\'s own EDI page ("The Optum payer ID is 87726") that UnitedHealthcare, Optum, and United Behavioral Health claims — including ABA — all route on 87726, no second EDI hop. Upgrades Georgia\'s unverified Availity ID and unverified BH administratorPayerId/abaRidesOn for the same carrier family; matches the identical finding already shipped for UnitedHealthcare Community Plan of North Carolina.',
        sourceUrl: 'https://public.providerexpress.com/content/ope-provexpr/us/en/admin-resources/claim-tips/electronic-claim-submission-and-electronic-data-interchange.html',
      },
      {
        slug: 'aetna-florida',
        field: 'edi.payerId',
        change:
          "Corrected during merge with split A: the Availity payer-list PDF (same URL used across both FL splits and vob/georgia.ts) carries an \"As of 08/08/2012\" footer on every page. payerId.availity and payerId.changeHealthcare downgraded from 'verified' to 'inferred' — 60054 remains Aetna's long-standing national payer ID, but is no longer claimed as independently reconfirmed against a current Availity export this pass.",
        sourceUrl: 'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
      },
      {
        slug: 'aetna-florida',
        field: 'edi.bhCarveOut',
        change:
          'Checked Aetna\'s own June 2022 OfficeLink Updates "Applied behavior analysis (ABA) treatment and claims" page directly — it names no claims administrator, in-house or third-party. Shipped unverified (absence of evidence is not confirmation of in-house administration), matching Georgia\'s treatment of the same carrier.',
        sourceUrl: 'https://www.aetna.com/health-care-professionals/newsletters-news/office-link-updates-june-2022/behavioral-health-updates/applied-behavior-analysis-treatment-and-claims.html',
      },
    ],
    totals: { guides: 164, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'guides-added',
    summary:
      'Five upstate NY Medicaid MCO guides added, closing the largest enrollment gaps identified by the MCO census (docs/vob-gaps.md): Excellus BlueCross BlueShield (182,280 members, Central/Western NY + Southern Tier), MVP Health Plan (162,046, Capital Region/Hudson Valley/North Country), CDPHP (82,431, Capital District), Independent Health (60,275 per the census; a more recent NY DOH report found 61,649, Erie County only — not Monroe as previously assumed), and Highmark Western & Northeastern NY (45,402, 8 WNY counties). Each guide is built from the plan\'s own primary sources (provider manuals, named ABA/BH clinical or payment policies, prior-authorization forms) rather than the state baseline alone; where a plan-specific detail (PA turnaround, telehealth reimbursement, exact BH delegate) could not be confirmed in a public document, the guide says so explicitly and points to Provider Services rather than guessing.',
    guides: [
      'excellus-bcbs-new-york',
      'mvp-health-plan-new-york',
      'cdphp-new-york',
      'independent-health-new-york',
      'highmark-western-new-york',
    ],
    totals: { guides: 169, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'NY split B shipped (docs/vob-build.md): Layer 1 (EDI routing crosswalk) + Layer 3 (code-level coverage grid) for 8 guides — the 5 upstate Medicaid MCOs (Excellus, MVP, CDPHP, Independent Health, Highmark Western & Northeastern NY) plus Aetna, Cigna, and UnitedHealthcare commercial. Layer 4 (Medicaid rates) intentionally NOT populated for any of the 5 MCOs: none publish their own ABA fee schedule, and the state eMedNY schedule is FFS-only and explicitly doesn\'t bind MMC plans (per the existing new-york-medicaid guide\'s own sourced text) — commercial gets no rates per spec either. Re-fetched pVerify\'s and Availity\'s public payer-list PDFs and, since both defeat naive text extraction (columns collapse into disjoint blocks), parsed them to structured tables this pass rather than reusing unconfirmed numbers. Resolved two ambiguities this corpus\'s Georgia guide had left open for the same commercial carriers: UnitedHealthcare\'s Optum Behavioral Health carve-out payer ID (UHG007, pVerify) and a plain "87726 UNITEDHEALTHCARE" Availity entry (Georgia\'s guide found none). Discovered the fetched Availity PDF carries an "As of 08/08/2012" footer — consistent with this corpus\'s prior aetna-florida finding on the same URL — so every Availity-sourced ID here ships \'inferred\', not \'verified\', except MVP\'s (independently confirmed via MVP\'s own 2025 Provider Policies document naming Payee ID 14165 directly). Captured the Medicaid-specific pVerify line item where one exists (Highmark: "01357 HIGHMARK BCBS WESTERN NY - MEDICAID AND CHP", distinct from its general "00325 BCBS of Western New York" and legacy "00326 Healthnow" entries) and flagged plain ambiguity honestly where none does (CDPHP: two unresolved generic candidates, 00328 and 002466; MVP: pVerify\'s only match is Child-Health-Plus-labeled, not a general MMC line; Excellus: no Medicaid-specific line among several regional sub-brand entries). Independent Health\'s codeGrid and BH-carve-out fields ship mostly \'inferred\'/\'unverified\' because its MediSource member handbook describes ABA by service category, not CPT code, and never states outright whether Carelon (which the plan says administers general BH) or Independent Health itself adjudicates ABA specifically — the handbook\'s own section placement is the only (indirect) evidence. Highmark WNY\'s codeGrid carries the richest confirmed telehealth detail in this split (97151/97153/97155/97156/97157 via POS 02 + modifier 95/GT, from a 2020/Jan-2022 COVID-era bulletin) alongside its stated $45,000/calendar-year benefit maximum. Commercial codeGrid entries mirror Georgia\'s finding that none of the three carriers publish code-level unit caps, POS codes, or modifiers nationally, layering on New York\'s 680-hour/year mandate cap and LBA-licensure requirement (DFS Circular Letter 6; NYSED Article 167) as notes since both are verified for New York directly. QA spot-check: re-opened Cigna\'s Autism Resource Guide, MVP\'s FastFax #2025.16, and Highmark\'s COVID-19 telehealth bulletin directly against the claims made from them in the guide prose — all three matched.',
    guides: [
      'excellus-bcbs-new-york',
      'mvp-health-plan-new-york',
      'cdphp-new-york',
      'independent-health-new-york',
      'highmark-western-new-york',
      'aetna-new-york',
      'cigna-new-york',
      'unitedhealthcare-new-york',
    ],
    details: [
      {
        slug: 'unitedhealthcare-new-york',
        field: 'edi.bhCarveOut.administratorPayerId',
        change:
          'Resolved this corpus\'s Georgia-guide ambiguity: pVerify lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" line, separate from UHC\'s own 87726/00192 — used as the Optum BH carve-out\'s own payer ID, though whether ABA specifically rides that hop for NY commercial members (vs. UHC\'s medical ID) remains unconfirmed.',
        sourceUrl: 'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
      },
      {
        slug: 'highmark-western-new-york',
        field: 'edi.payerId',
        change:
          'Captured the Medicaid-specific pVerify line item directly: "01357 HIGHMARK BCBS WESTERN NY - MEDICAID AND CHP" — distinct from the plan\'s general "00325 BCBS of Western New York" and legacy-brand "00326 Healthnow" entries, neither of which is used for this Medicaid guide.',
        sourceUrl: 'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
      },
      {
        slug: 'mvp-health-plan-new-york',
        field: 'edi.payerId.availity',
        change:
          'Verified 14165 independent of the stale (2012-dated) Availity PDF: MVP\'s own 2025 Provider Policies document states directly "EDI submissions use Payee ID 14165," matching the Availity list\'s "14165 MVP HEALTH PLAN" entry.',
        sourceUrl:
          'https://www.mvphealthcare.com/-/media/project/mvp/healthcare/documents/provider-policies-and-payment-policies/2025/january/mvp-provider-policies-effective-january-1-2025.pdf',
      },
      {
        slug: 'independent-health-new-york',
        field: 'edi.bhCarveOut',
        change:
          'Shipped unverified rather than guessing: Independent Health\'s own policy page says Carelon "oversees all behavioral health benefit management" for its state products, but the current MediSource member handbook describes ABA in "Independent Health covers..." language, apart from the Carelon-branded BH section — indicative, not an explicit single-sentence confirmation either way.',
        sourceUrl: 'https://www.independenthealth.com/providers/policies-and-guidelies/behavioral-health-for-state-products',
      },
      {
        slug: 'cdphp-new-york',
        field: 'edi.payerId',
        change:
          'Two unresolved candidate pVerify IDs found for CDPHP ("00328 Capital District Physicians Health Plan (CDPHP)" and "002466 CDPHP(Capital District Physicians Health Plan)"), both generic with no Medicaid designation — shipped both, unresolved, rather than picking one.',
        sourceUrl: 'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
      },
      {
        slug: 'aetna-new-york',
        field: 'edi.payerId.availity / edi.payerId.changeHealthcare',
        change:
          'Downgraded from \'verified\' to \'inferred\' after discovering the fetched Availity PDF carries an "As of 08/08/2012" footer (matching this corpus\'s prior aetna-florida finding on the identical URL) — 60054 remains Aetna\'s long-standing national payer ID but is not independently reconfirmed against a current export this pass.',
        sourceUrl: 'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
      },
    ],
    totals: { guides: 169, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'correction',
    summary:
      'QA spot-check GA+NC: 47 fields checked, 32 confirmed, 4 corrected, 11 downgraded.',
    guides: [
      'georgia-medicaid',
      'amerigroup-georgia',
      'aetna-georgia',
      'unitedhealthcare-georgia',
      'north-carolina-medicaid',
      'aetna-north-carolina',
      'unitedhealthcare-community-plan-north-carolina',
    ],
    details: [
      {
        slug: 'georgia-medicaid',
        field: 'codeGrid.*.telehealth',
        change:
          'Re-opened all three cited sources (DCH 2023 presentation, DCH Oct-2025 telehealth guidance, DCH ASD Policy Manual, all direct PDF extraction) — none contains the claim that a telehealth rendering provider "must be located in Georgia or within 50 miles of the state border." Removed that clause from all 10 codes\' telehealth field; the GT-modifier/POS-02-or-10 mechanics that remain ARE confirmed verbatim in §605/§614.',
        sourceUrl: 'https://setrc.us/wp-content/uploads/2025/11/Telehealth-Guidance-Q4-October-2025.pdf',
      },
      {
        slug: 'amerigroup-georgia',
        field: 'edi.payerId.availity / edi.payerId.changeHealthcare',
        change:
          'Availity\'s own payer list (row-level PDF extraction) resolves payer ID 26375 to "Amerigroup - Ft. Worth" — a Texas entity, not Georgia. No GA-specific Amerigroup ID appears in the list under any code. Downgraded both fields to \'unverified\' rather than propagate the wrong ID.',
        sourceUrl: 'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
      },
      {
        slug: 'georgia-medicaid / aetna-georgia',
        field: 'edi.payerId.availity',
        change:
          'The cited Availity list carries an "As of 08/08/2012" footer on every page (same document already flagged stale for aetna-florida in an earlier correction pass, but missed here). 77034 (GA Medicaid) and 60054 (Aetna) are both confirmed present in that 2012 snapshot, but downgraded from \'verified\' to \'inferred\' pending reconfirmation against a current export, matching the aetna-florida precedent.',
        sourceUrl: 'https://essentials.availity.com/availity/documents/payer_list_wShortNames.pdf',
      },
      {
        slug: 'aetna-georgia / aetna-north-carolina',
        field: 'codeGrid.*.paRequired',
        change:
          'Precertification form "GR-69017-4," cited across all 10 codes in both states, does not appear in either Aetna CPB 0554 or CPB 0648 (both fetched and full-text-checked) — the two CPBs are medical-necessity policies with no precertification-process content at all. Removed the form number and downgraded paRequired to \'unverified\'; the general "covered if criteria are met" fact (CPB 0648) remains verified.',
        sourceUrl: 'https://www.aetna.com/cpb/medical/data/600_699/0648.html',
      },
      {
        slug: 'unitedhealthcare-georgia',
        field: 'codeGrid.*.paRequired / edi.payerId.changeHealthcare',
        change:
          'Neither cited Optum document (ABA Supplemental Clinical Criteria; national ABA Reimbursement Policy 2022RP501A, both fetched and full-text-checked) mentions a "two-step" assessment-then-treatment authorization flow or a 4-6 month review cadence — removed and downgraded to \'unverified\'. Separately, changeHealthcare payer ID 87726 is not in either cited source (pVerify\'s own list has no "87726" line, only a distinct "UHG007" entry) — downgraded to \'unverified\'. Unit-cap and modifier figures on the same codeGrid entries WERE independently confirmed verbatim against the Optum Reimbursement Policy.',
        sourceUrl: 'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/guidelines/reimbPolicies/abaReimburs2020s.pdf',
      },
      {
        slug: 'north-carolina-medicaid',
        field: 'edi.medicaid271Notes.mcoCarrierCodes',
        change:
          'Carrier code "MCCFS" ("Children & Families Specialty Plan") does not appear anywhere in the NCTracks 270/271 Companion Guide\'s Appendix A plan-coverage-description table (confirmed by direct retrieval and full-text extraction) — removed. The other 11 carrier codes in the map were individually checked and all match the source\'s Appendix A table.',
        sourceUrl:
          'https://www.nctracks.nc.gov/content/dam/jcr:b987d9f5-d230-4c81-b78b-05780eb0bbaf/270_271%20Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20(7).pdf',
      },
      {
        slug: 'north-carolina-medicaid',
        field: 'codeGrid.*.paRequired',
        change:
          'Citation corrected: CCP 8F\'s Prior Approval requirement is in §5.0-5.2, not "Section 6.0" (which is actually "Provider(s) Eligible to Bill," an unrelated section) — confirmed by direct retrieval and full-text extraction of the policy.',
        sourceUrl: 'https://medicaid.ncdhhs.gov/documents/files/8f/open',
      },
      {
        slug: 'unitedhealthcare-community-plan-north-carolina',
        field: 'codeGrid.*.paRequired',
        change:
          'The cited NC ABA Program Quick Reference Guide (fetched and full-text-checked) states only that all autism services require prior authorization via one Treatment Authorization Request Form — it does not describe a "two-step" separate assessment-then-treatment authorization flow as previously shipped. Corrected the text to match the source; the general "PA required" fact stays verified.',
        sourceUrl:
          'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/ncaba/ncABA-QRG.pdf',
      },
    ],
    totals: { guides: 169, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'correction',
    summary:
      'QA spot-check FL+TX: 213 fields checked, 157 confirmed, 8 corrected, 48 downgraded.',
    guides: [
      'florida-medicaid',
      'aetna-better-health-florida',
      'florida-community-care',
      'unitedhealthcare-florida',
      'texas-medicaid',
      'cigna-texas',
      'community-first-health-plans',
      'driscoll-health-plan',
    ],
    details: [
      {
        slug: 'aetna-better-health-florida',
        field: 'codeGrid.*.covered / codeGrid.*.paRequired (9 codes)',
        change:
          "Downgraded 'verified' to 'inferred' — re-fetched ABHFL_QRG (Rev. 11/2024) in full: it's a single-page administrative contact sheet (phone/fax/EDI IDs) with zero mentions of ABA, CPT codes, or code-level coverage/PA detail. Citing it as a plan-specific confirming source for every code's covered/paRequired was a miscitation; the underlying values are unchanged (still bound by the AHCA coverage policy's plan-compliance clause, §1.2) but now correctly shown as inferred rather than plan-confirmed.",
        sourceUrl: 'https://www.aetnabetterhealth.com/content/dam/aetna/medicaid/florida/provider/pdf/abhfl_quick_reference_guide.pdf',
      },
      {
        slug: 'florida-community-care',
        field: 'codeGrid.*.covered / codeGrid.*.paRequired (9 codes)',
        change:
          "Downgraded 'verified' to 'inferred' — re-fetched FCC_BA_PAGE: confirms the BSN partnership and in-house UM department, but explicitly contains no CPT table, unit caps, or covered-code list. Citing it as a plan-specific confirming source for every code's covered/paRequired was a miscitation; values unchanged, status corrected.",
        sourceUrl: 'https://fcchealthplan.com/ba-services/',
      },
      {
        slug: 'cigna-texas',
        field: 'codeGrid.*.paRequired (11 codes)',
        change:
          "Downgraded 'verified' to 'unverified' — re-fetched EN0499 in full: it contains zero occurrences of \"prior authorization\" or \"precertification\" and states no per-code PA distinction between assessment and treatment codes. The prior 'Not required on assessment codes / Required on treatment codes' split was not supported by this document; now marked unverified with guidance to confirm via Cigna/Evernorth provider services.",
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
      {
        slug: 'cigna-texas',
        field: 'codeGrid.99366.covered',
        change:
          "Downgraded 'verified' to 'unverified' — 99366 (interdisciplinary team meeting) does not appear anywhere in EN0499's coding table (which lists only 97151-97158/0362T/0373T); the policy does not address interdisciplinary team-meeting billing at all.",
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
      {
        slug: 'driscoll-health-plan',
        field: 'codeGrid.97152',
        change:
          "Corrected from 'not on Texas's billable ABA code set' (unverified) to a confirmed Driscoll-specific exception: Driscoll's own live PA-lookup portal lists 97152 as \"AUTHORIZATION REQUIRED\" for STAR/STAR Kids (excl. CHIP/CHIP Perinate), citing TMPPM §2.3, with HO/HN/HM and 95-telehealth modifier rules — even though 97152 is independently confirmed absent from the current TMPPM handbook text and the Autism Services fee schedule. Not changed for texas-medicaid or the other 7 TX MCO guides, which show no equivalent finding.",
        sourceUrl: 'https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services',
      },
      {
        slug: 'driscoll-health-plan',
        field: 'codeGrid.97157',
        change:
          "Same correction as 97152 above: Driscoll's PA portal lists 97157 as \"AUTHORIZATION REQUIRED\" for STAR/STAR Kids citing TMPPM §2.3, despite the code's confirmed absence from the current TMPPM handbook text and fee schedule. Driscoll-specific only.",
        sourceUrl: 'https://webapps.driscollhealthplan.com/priorauthcheck/?s=Autism+(ABA)+Services',
      },
    ],
    totals: { guides: 169, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'guides-added',
    summary:
      'Six Texas Medicaid MCO guides added, closing the largest remaining Texas gaps identified by the MCO census (docs/vob-gaps.md): Community Health Choice (Harris/Houston + Jefferson SDAs, own ABA Medical Review Guideline adopted 6/2026), Blue Cross Blue Shield of Texas Medicaid (Travis/Austin SDA, insourced behavioral health from Magellan in 2024), Cook Children\'s Health Plan (six-county Fort Worth-area STAR + STAR Kids, dedicated 123-page ABA provider training), Parkland Community Health Plan (Dallas County STAR, behavioral health insourced from Carelon 9/1/2025), El Paso Health (El Paso + Hudspeth counties, formerly El Paso First — not the SDA\'s sole MCO per HHSC service-area sources, corrected from the census\'s working assumption), and FirstCare Health Plans (Lubbock + MRSA West, plan wind-down confirmed for 8/31/2026 pending regulatory approval). Each guide is built from the plan\'s own primary sources (provider manuals, ABA-specific policy documents, PA checklists and code lists) rather than the state TMPPM baseline alone; hhs.texas.gov blocks automated access, so any claim confirmable only there is written around with explicit confirm-with-plan language rather than asserted.',
    guides: [
      'community-health-choice-texas',
      'bcbs-texas-medicaid',
      'cook-childrens-health-plan',
      'parkland-community-health-plan',
      'el-paso-health',
      'firstcare-health-plans',
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'VOB enrichment shipped for New York split A — Medicaid FFS + downstate MCOs (Layers 1, 3, and 4). new-york-medicaid gets all three layers: the eMedNY 270/271 mechanics (Loop 2120C NM1 carries the MCO name, not a numeric carrier code — no crosswalk table exists in the companion guide or the MEVS/DVS manual), the current ABA fee schedule (97151/97155/97156 $19.26, 97153 $14.45 post the 4/1/2026 phase-down, group codes 97154/97157/97158 $3.31/member), and the code grid confirming NY Medicaid FFS uses zero billing modifiers (NPI role fields differentiate LBA/CBAA/technician instead) and no per-code hour caps beyond an 8-person group-session limit. The other 7 downstate MCOs (Fidelis, UnitedHealthcare Community Plan, Anthem HealthPlus, Healthfirst, MetroPlus, EmblemHealth, Molina) get Layers 1+3. Two build-spec assumptions were corrected by direct evidence: Healthfirst and MetroPlus do NOT delegate behavioral health to an external administrator — both manage it in-house (Healthfirst\'s own manual: "Healthfirst manages the Behavioral Health services for all of its members"; MetroPlus in-sourced from Beacon Health Options 10/1/2021) — while EmblemHealth\'s Carelon Behavioral Health carve-out is confirmed for BH generally but NOT specifically confirmed for ABA (no EmblemHealth document names an ABA claims administrator). Anthem HealthPlus New York\'s own current publications contain an unresolved, quoted-verbatim contradiction over 0362T/0373T and school-setting coverage (a 2023 FAQ excludes both; a January 2026 newsletter and the June 2026 auth form both reference them as billable/allowed) — shipped as-is rather than guessed at. UnitedHealthcare Community Plan\'s own EDI documents conflict on its payer ID (NYU01 vs. 87726 across three different UHC/Optum-published lists) — also shipped unresolved. Every clearinghouse payer ID was extracted directly from the underlying pVerify/Availity/Optum PDFs; several (Anthem HealthPlus, EmblemHealth, Molina) carry multiple ambiguous candidates, flagged via verifyVia rather than resolved by guessing.',
    guides: [
      'new-york-medicaid',
      'fidelis-care-new-york',
      'unitedhealthcare-community-plan-new-york',
      'anthem-healthplus-new-york',
      'healthfirst-new-york',
      'metroplus-health-new-york',
      'emblemhealth-new-york',
      'molina-healthcare-new-york',
    ],
    details: [
      {
        slug: 'new-york-medicaid',
        field: 'edi.medicaid271Notes.mcoSegmentLocation',
        change:
          "MMC enrollment flagged by EB01='U' (Loop 2110C); the MCO's actual name is carried in Loop 2120C NM1 (NM101='Y2', NM108='PI') as free text — no numeric carrier-code-to-MCO-name table exists in the companion guide or the MEVS/DVS Provider Manual.",
        sourceUrl: 'https://www.emedny.org/hipaa/5010/transactions/eMedNY_Transaction_Information_CAQH-CORE_CG_X12_version_5010.pdf',
      },
      {
        slug: 'new-york-medicaid',
        field: 'rates.byCode.97153',
        change:
          'Confirmed full phase-down history: $19.26 → $16.85/unit (eff. 10/1/2025) → $14.45/unit (eff. 4/1/2026, current) — cross-confirmed between the live fee schedule and the Aug 2025 Medicaid Update (retrieved via Wayback Machine archive since health.ny.gov 403s automated fetches).',
        sourceUrl: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Fee_Schedule.xls',
      },
      {
        slug: 'healthfirst-new-york',
        field: 'edi.bhCarveOut.administrator',
        change:
          "Corrected the build-spec assumption that Healthfirst delegates BH — Healthfirst's own 3/1/2026 NY Provider Manual states verbatim \"Healthfirst manages the Behavioral Health services for all of its members,\" with zero \"Beacon\"/\"Carelon\" hits across 196 pages. Shipped as 'none — in-house', not the assumed carve-out.",
        sourceUrl: 'https://assets.healthfirst.org/pdf_9432a72611d0176a1f6a5503a1d88d94/',
      },
      {
        slug: 'metroplus-health-new-york',
        field: 'edi.bhCarveOut.administrator',
        change:
          "Corrected the same build-spec assumption for MetroPlus — MetroPlus in-sourced behavioral health from Beacon Health Options effective 10/1/2021 per its own press release, confirmed by zero Beacon/Carelon hits across its 2025 Provider Manual and 2026 BH/HCBS PA grid.",
        sourceUrl: 'https://metroplus.org/press/important-notice-to-our-applied-behavioral-analysis-aba-providers-regarding-2023-aba-benefit-changes/',
      },
      {
        slug: 'emblemhealth-new-york',
        field: 'edi.bhCarveOut',
        change:
          "Carelon Behavioral Health confirmed as EmblemHealth's BH administrator generally (incl. Medicaid/HARP), but abaRidesOn shipped 'unverified' rather than 'bh' — no EmblemHealth document specifically names an ABA claims administrator; the ABA benefit page enumerates no CPT codes and EmblemHealth's two master pre-authorization lists (610 + 226 pages) contain zero ABA/CPT-97xxx hits.",
        sourceUrl: 'https://www.emblemhealth.com/content/dam/emblemhealth/pdfs/provider-manual/behavioral-health-services.pdf',
      },
      {
        slug: 'anthem-healthplus-new-york',
        field: 'codeGrid.0362T / codeGrid.0373T',
        change:
          "Shipped as an unresolved, quoted-verbatim conflict rather than guessed: Anthem's 2023 FAQ (still live) states \"Medicaid does not cover CPT codes 0362T and 0373T and schools as a place of service,\" while Anthem's own January 2026 newsletter lists both codes in an \"Affected CPT codes\" billable table and the June 2026 auth form references 0362T for initial-assessment requests.",
        sourceUrl: 'https://providernews.anthem.com/new-york/articles/applied-behavior-analysis-services-faq-for-providers-13424',
      },
      {
        slug: 'unitedhealthcare-community-plan-new-york',
        field: 'edi.payerId.changeHealthcare',
        change:
          "Shipped as unresolved: UHC's own ERA Payer List (12/2/2024) breaks NY out as its own ID (NYU01); UHC's own Claims Payer List (5/13/2026) does not visibly list NY under the multi-state 87726 grouping; Optum's own Institutional Claims Payer List (1/30/2025) explicitly includes NY under a different 87726 grouping. Three UHC/Optum-published documents disagree — not resolved by picking one.",
        sourceUrl: 'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-ERA-Payer-List-for-Affiliates-Strategic-Alliances.pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Layer 2 STC maps: family defaults + attached to 62 enriched guides',
    guides: [
      'georgia-medicaid', 'amerigroup-georgia', 'caresource-georgia', 'peach-state-georgia', 'anthem-bcbs-georgia', 'aetna-georgia', 'cigna-georgia', 'unitedhealthcare-georgia',
      'florida-medicaid', 'sunshine-health-florida', 'cms-health-plan-florida', 'simply-healthcare-florida', 'unitedhealthcare-community-plan-florida', 'humana-healthy-horizons-florida', 'aetna-better-health-florida', 'molina-healthcare-florida', 'community-care-plan-florida', 'florida-community-care', 'aetna-florida', 'cigna-florida', 'unitedhealthcare-florida',
      'north-carolina-medicaid', 'healthy-blue-north-carolina', 'amerihealth-caritas-north-carolina', 'carolina-complete-health', 'unitedhealthcare-community-plan-north-carolina', 'wellcare-north-carolina', 'alliance-health-north-carolina', 'trillium-health-resources', 'vaya-health', 'partners-health-management', 'aetna-north-carolina', 'cigna-north-carolina', 'unitedhealthcare-north-carolina',
      'texas-medicaid', 'superior-healthplan-texas', 'texas-childrens-health-plan', 'wellpoint-texas', 'unitedhealthcare-community-plan-texas', 'aetna-better-health-texas', 'molina-healthcare-texas', 'community-first-health-plans', 'driscoll-health-plan', 'aetna-texas', 'cigna-texas', 'unitedhealthcare-texas',
      'excellus-bcbs-new-york', 'mvp-health-plan-new-york', 'cdphp-new-york', 'independent-health-new-york', 'highmark-western-new-york', 'aetna-new-york', 'cigna-new-york', 'unitedhealthcare-new-york',
      'new-york-medicaid', 'fidelis-care-new-york', 'unitedhealthcare-community-plan-new-york', 'anthem-healthplus-new-york', 'healthfirst-new-york', 'metroplus-health-new-york', 'emblemhealth-new-york', 'molina-healthcare-new-york',
    ],
    details: [
      {
        slug: '_family-defaults',
        field: 'vob/stc-defaults.ts',
        change:
          "Layer 2 (docs/vob-build.md): built family-level StcMap defaults for the 5 major commercial carriers from each family's own published 270/271 companion guide, with the public X12 STC vocabulary (CAQH CORE Eligibility & Benefits Data Content Rule vEB.2.0, Appendix 5.1) as the shared reference — notably, that rule documents MH/A4-A8/AI/AJ/AK as CAQH-CORE 'discretionary' specifically for behavioral-health privacy reasons, which is the primary-source explanation for why ABA cost-share detail is often thin on the wire even when a payer 'supports' the code. Cigna (Companion Guide v2.3, Aug 2024) and UnitedHealthcare (v9.0, Feb 2025) both fetched and read in full: both explicitly support MH/A4-A8/AI/AJ/AK with real financial detail (quality271Score 'high'); Cigna's guide additionally documents an MH-specific limitation (remaining deductible/benefit amounts withheld for Mental Health/Pharmacy/Vision plans) and a distinct 'Cigna Behavioral Health' response entity for MH-flavored requests. Aetna, Anthem/Elevance, and the independent-BCBS-licensee family default all ship honestly 'unverified': no commercial-line 270/271 companion guide with an STC table could be located publicly for any of the three (only an unrelated Aetna Medicare Supplement product's guide was found) — Availity Payer Spaces, where this documentation likely lives, requires authenticated access this pass did not have.",
      },
      {
        slug: 'florida-medicaid',
        field: 'stcMap',
        change:
          "Confirmed via the FLMMIS 270/271 Companion Guide (v4.0, already cited in this corpus for Layer 1): MH is one of 13 CORE-required generic-inquiry service codes (Appendix A.6), and the guide's own worked 271 example bundles MH with coinsurance and copayment segments — abaBenefitBucket 'MH', quality271Score 'high'. The same example ties the deductible segment only to STC 30, never MH — noted via verifyVia rather than asserted as 'no' from a single example.",
      },
      {
        slug: 'texas-medicaid',
        field: 'stcMap',
        change:
          "Confirmed via the TMHP 270/271 Companion Guide (Nov 2024, already cited for Layer 1): §10.1/§10.2 explicitly list MH among the state's supported STC set, and the worked transmission examples repeat the identical MH-bundled coinsurance/copay pattern for BOTH Medicaid-Direct AND 'Covered Managed Care'/STAR/CHIP/CSHCN segments — meaning Texas's centralized TMHP EDI architecture returns the same rich behavioral-health-inclusive detail for MCO members as for FFS. On that basis, all 8 TX Medicaid MCO guides inherit texas-medicaid's stcMap as 'inferred' rather than shipping fully 'unverified', a treatment not applied to any other state's MCOs in this build. Deductible segments are, as in Florida, tied only to STC 30 across every example — here confirmed as 'no' rather than left unverified, since the pattern repeats consistently.",
      },
      {
        slug: 'north-carolina-medicaid',
        field: 'stcMap',
        change:
          "The NCTracks 270/271 Companion Guide (already cited for Layer 1) states outright, twice (§7.2, §7.5): \"Division of Mental Health (DMH) information is not returned. That information is available through the Local Managing Entity (LME).\" Since NC's RB-BHT/ABA benefit sits within DMH's purview for the LME-MCO population, this is a verified-ABSENT finding, not a gap — quality271Score ships 'low' with fieldStatus 'verified' on that specific field. The 4 Tailored Plans (Alliance, Trillium, Vaya, Partners) are the LME-MCOs this exclusion points to; each guide's verifyVia notes that context even though no plan-specific STC document was found to confirm what they themselves return.",
      },
      {
        slug: '_new-york-split-a',
        field: 'stcMap',
        change:
          "This build's own new-york.ts split was rebased against a concurrent session's New York split A (new-york-medicaid + 7 downstate MCOs), which landed after this build's stcMap work began. Rather than ship the 8 newly-arrived guides without Layer 2 coverage, all 8 were given stcMap on merge (bringing the total from 54 to 62): new-york-medicaid ships 'unverified' (eMedNY's companion guide was read for MMC-enrollment mechanics by the concurrent session, not specifically re-checked for its own STC/service-type-code support table this pass) and the 7 downstate MCOs (Fidelis, UnitedHealthcare Community Plan, Anthem HealthPlus, Healthfirst, MetroPlus, EmblemHealth, Molina) each ship 'unverified' with a plan-specific verifyVia, consistent with every other state's Medicaid-MCO treatment in this build.",
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Layer 6 carve-out map populated: 111 rows across 19 states (plus 1 confirmed national-default row for Cigna/Evernorth). Extracted and structured from provider-manual facts already cited in src/data/payers/<state>.ts and the shipped vob/{georgia,north-carolina,florida,texas,new-york}.ts edi.bhCarveOut objects — no new primary-source research introduced. Covers: Cigna->Evernorth (62308, national default, with the Virginia fully-insured exception carved out separately); Anthem/Elevance->Carelon Behavioral Health (confirmed full carve-out for Simply Healthcare FL and Wellpoint NJ, inferred for Anthem BCBS GA, explicit no-carve-out for Healthy Blue NC and Wellpoint TX, and flagged as an unconfirmed gap for OH/TN/VA Anthem Medicaid plans); UnitedHealthcare->Optum Behavioral Health per state and line of business (verified payer ID 87726 for FL/NC, explicit BH-side carve-out for both NY and TX Medicaid Community Plans, UHG007 for NY commercial — flagged as an unresolved cross-file inconsistency against the 87726 figure, not silently reconciled, alongside the NY Medicaid Community Plan\'s own NYU01-vs-87726 conflict already documented in vob/new-york.ts); Maryland Medicaid -> Carelon BHASO (one statewide row covering all nine HealthChoice MCOs); the six MassHealth BH administrators (MBHP/Carelon for PCC+ACO+HNE, Carelon for Fallon, in-house for WellSense since 1/1/2026, internal UM for Tufts Health Together, Optum for Mass General Brigham Health Plan); Florida\'s TNFL full delegation (Community Care Plan) and the BSN network-credentialing-only pattern (Aetna Better Health FL, Florida Community Care); Colorado/Missouri/Utah statewide Medicaid FFS carve-outs (ABA removed from all MCOs regardless of carrier); New York\'s upstate/downstate MCOs, reconciled against the vob/new-york.ts Layers 1+3 data that shipped in a parallel session while this work was in progress (Healthfirst and MetroPlus corrected from "unverified" to verified in-house/in-sourced-from-Beacon facts; EmblemHealth\'s Carelon administrator upgraded from inferred to verified with abaRidesOn still unverified; Fidelis downgraded from an assumed "none" to "unverified" per the shipped guide\'s more conservative treatment) — one contradiction found and flagged rather than silently resolved: this build\'s own NY research read named eviCore (ended 9/1/2021) as Molina NY\'s prior BH vendor, while the freshly-shipped vob fact names Beacon Health Options (ended 1/1/2022); Ohio\'s OhioRISE reverse-carve-out (ABA explicitly excluded from the BH specialty plan). 55 of 111 rows carry an unverified administratorPayerId with a verifyVia note rather than a guessed value, per the never-guess rule.',
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Colorado + Utah VOB enrichment shipped: Layer 1 (EDI routing crosswalk), Layer 3 (code-level coverage grid) and Layer 4 (Medicaid rate tables — Medicaid only) populated for all 8 CO+UT guides (colorado-medicaid, aetna/cigna/unitedhealthcare-colorado; utah-medicaid, aetna/cigna/unitedhealthcare-utah). Both states run ABA as a statewide fee-for-service carve-out, so the Medicaid guides ship bhCarveOut \'none\' (ABA rides the medical FFS line) and both 271s were confirmed to carry NO ABA-carve-out flag — the carve-out is applied from policy, not read off the wire. Colorado: the interChange (Gainwell) 270/271 companion guide (Mar 2024 v2.2) was retrieved via Wayback despite hcpf.colorado.gov 403ing every live fetch — RAE/ACC attribution rides loop 2110C/MSG + 2120C with no carrier-code table; the PBT allowable-code set is the reduced 97151/97151-TJ/97153/97154/97155/97158 (97152, 97156, 97157, 0362T, 0373T CONFIRMED absent from two fetched sources — 97156 parent-training is not billable in Colorado). Utah: the PRISM 270/271 companion guide (SFY25) and the live PRISM PAC-166 fee CSV (eff. 7/1/2026) were both retrieved — MCO shows by organization name in loop 2120C / EB01="3" capitated; 97151 needs no PA (1/26wks); rates confirmed 97153 $19.67, 97151/97155/97156/H0032 $37.51, 97154 $13.91, with 97157/97158 flagged Covered but priced $0.00 (non-reimbursing), and 97152/0362T/0373T Not Covered. RATE WATCHLIST: Colorado\'s 10/1/2025 PBT cuts stand (the FY25-26 1.6% bump was repealed, not restored) and a further -2.0% + "pediatric behavioral rate reset" is approved for 7/1/2026 — the 7/1/2026 CO fee schedule could not be located, so the shipped CO rates (incl. corrected 97151 flat $866.88) are the last confirmed 10/1/2025 set. The commercial six inherit the same national policies/payer IDs as every other state (Cigna/Evernorth confirmed same-payer-ID 62308 pass-through; Aetna and UHC BH-carve-out routing remain unresolved pending provider-services confirmation).',
    guides: [
      'colorado-medicaid',
      'aetna-colorado',
      'cigna-colorado',
      'unitedhealthcare-colorado',
      'utah-medicaid',
      'aetna-utah',
      'cigna-utah',
      'unitedhealthcare-utah',
    ],
    details: [
      {
        slug: 'colorado-medicaid',
        field: 'rates.byCode.97151 + rates.source',
        change:
          'Corrected the 97151 flat-assessment rate: $882.78 was the 7/1/2025 amount; it dropped to $866.88 for DOS on/after 10/1/2025 (= 32 units x $27.09/unit at an 8-hr increment), per the retrieved Bulletins B2500528/B2500530. WATCHLIST added: a further -2.0% + pediatric-behavioral rate reset is approved for 7/1/2026 (FY2026-27, HB26-1410); the 7/1/2026 fee schedule could not be located, so the shipped values are the last confirmed 10/1/2025 set.',
        sourceUrl: 'https://web.archive.org/web/20260114194341/https://hcpf.colorado.gov/sites/hcpf/files/Health%20First%20Colorado%20Provider%20Bulletin%20B2500530.pdf',
      },
      {
        slug: 'colorado-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'Populated verified from the retrieved interChange 270/271 Companion Guide (Mar 2024 v2.2, via Wayback): ACC/RAE attribution rides loop 2110C/MSG (MCSTARTRSN$, MCD$) + loop 2120C (NPI/name); there is NO carrier-code->RAE table and NO ABA/PBT carve-out flag on the 271. Availity ID left unverified — the only fetchable Availity list is a 2012 relic predating Colorado\'s 2017 interChange migration.',
        sourceUrl: 'https://web.archive.org/web/20250211050831/https://hcpf.colorado.gov/sites/hcpf/files/CO_EDI_v5010%20X12_270_271_CompanionGuide%20-%2003062024.pdf',
      },
      {
        slug: 'utah-medicaid',
        field: 'edi.medicaid271Notes + rates',
        change:
          'Populated verified from the retrieved PRISM 270/271 Companion Guide (SFY25) and the live PRISM PAC-166 fee CSV (eff. 7/1/2026): MCO reported by organization name in loop 2120C, capitated flagged EB01="3", real-time <=20s, no procedure-level eligibility (no ABA carve-out flag on the 271). Rates confirmed 97153 $19.67, 97151/97155/97156/H0032 $37.51, 97154 $13.91; 97157/97158 flagged Covered but priced $0.00 (non-reimbursing since 7/1/2022); 97152/0362T/0373T Not Covered.',
        sourceUrl: 'https://medicaid-documents.dhhs.utah.gov/Documents/pdfs/EE-Health%20Care%20Eligibility%20Benefit%20Inquiry%20and%20Response%20Companion%20(270,%20271)%20SFY25.pdf',
      },
      {
        slug: 'aetna-colorado / unitedhealthcare-colorado / aetna-utah / unitedhealthcare-utah',
        field: 'edi.bhCarveOut',
        change:
          'Shipped unverified rather than guessed: Aetna ABA administration (in-house vs BH carve-out) was not researched to a primary source; UHC/Optum ABA routing is unresolved — pVerify lists a distinct "UHG007 United Healthcare - Optum Behavioral Solutions" alongside the "00192 United Healthcare" medical entry, and whether commercial ABA rides 87726 (medical) or routes to Optum was not confirmed.',
        sourceUrl: 'https://pverify.com/wp-content/uploads/2026/03/pVerifyPayers_All-Payers-List-3-2026.pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Indiana + Kansas VOB enrichment shipped: Layers 1 (EDI routing crosswalk) and 3 (code-level coverage grid) for all 16 guides (9 IN, 7 KS), plus Layer 4 (Medicaid rate tables) for the 10 Medicaid-line guides (indiana-medicaid + its 5 MCE guides; kansas-medicaid + its 3 KanCare MCOs). Indiana\'s 270/271 IHCP Companion Guide (v4.2, 3/31/2026) and fee-schedule bulletin BT202627 were both machine-readable this pass (unlike Georgia\'s equivalent) — Layer 1 medicaid271Notes ships fully verified (Loop 2100C EB/NM1 managed-care segment, both batch and real-time 270/271 confirmed), and Layer 4 ships the complete individual + group ABA rate table across both the current (DOS≥4/1/2026) and upcoming (DOS≥4/1/2027) phasedown steps for all 10 codes, extracted directly from the bulletin\'s Tables 1-3. MDwise\'s vob entry (historical) is flagged EXITED throughout — it ended as an HIP/Hoosier Healthwise MCE 1/1/2026 and should not route a live eligibility check; members reassigned to Anthem, CareSource, or MHS. Kansas\'s codeGrid deliberately ships its actual 7-code CCTS/IIS billable set (97151-97156, 97158 — no 97157, no 0362T/0373T), not the forced 10-code CPT list used elsewhere, per the build spec. The real KMAP 270/271 Companion Guide (v6.0, 5/2/2017, staleRisk:true) was located via a direct legacy-host document URL after the public portal page redirected to an SSO wall on every attempt; it gives the Loop 2110C/EB03=30 managed-care segment but no numeric carrier-code table. Kansas Medicaid rates for the State Plan 9715x codes remain honestly unverified beyond a stale 2019 anchor ($17.50/unit for 97151) — the KMAP interactive fee lookup is SSO-walled, and this pass\'s re-check of the FY2024-FY2026 HCBS rate bulletins confirmed they cover only BI/TA/I-DD waiver services and the separate HCBS Autism waiver code T2040, not the State Plan CCTS/IIS codes. National commercial payer IDs (Aetna 00001/60054, Cigna 00004/62308, UnitedHealthcare 00192/87726) reused verbatim from georgia.ts, re-confirmed by direct re-fetch of the pVerify/Availity public payer lists (same 08/08/2012 Availity staleness footer already flagged elsewhere in the corpus).',
    guides: [
      'indiana-medicaid',
      'anthem-indiana-medicaid',
      'mhs-indiana',
      'caresource-indiana',
      'mdwise-indiana',
      'unitedhealthcare-community-plan-indiana',
      'aetna-indiana',
      'cigna-indiana',
      'unitedhealthcare-indiana',
      'kansas-medicaid',
      'sunflower-health-plan-kansas',
      'unitedhealthcare-community-plan-kansas',
      'healthy-blue-kansas',
      'aetna-kansas',
      'cigna-kansas',
      'unitedhealthcare-kansas',
    ],
    details: [
      {
        slug: 'indiana-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'Fully verified from the 270/271 IHCP Companion Guide (v4.2, 3/31/2026): Loop 2100C EB01=MC/EB04=HM/EB05=program name for managed-care coordination, followed by NM1 (NM101=P5, NM103=MCE name, NM109=MCE entity identifier); DTP02=RD8 date-range eligibility span. No numeric carrier-code table exists — MCEs are identified by name + entity ID only.',
        sourceUrl: 'https://www.in.gov/medicaid/providers/files/270-271-ihcp-companion-guide.pdf',
      },
      {
        slug: 'indiana-medicaid',
        field: 'rates.byCode',
        change:
          'Complete individual + group ABA rate table for all 10 codes (97151-97158, 0362T, 0373T) across the current (DOS≥4/1/2026) and upcoming (DOS≥4/1/2027) phasedown steps, extracted directly from BT202627 Tables 1-3 (e.g. 97153 $16.04→$15.39; 97155 U3 $25.97→$24.93; 97154/97157/97158 group-size-tiered rates U4/U6/U8).',
        sourceUrl: 'https://www.in.gov/medicaid/providers/files/bulletins/BT202627.pdf',
      },
      {
        slug: 'mdwise-indiana',
        field: 'edi + codeGrid',
        change:
          "Shipped historical/reference-only, flagged EXITED on every field: MDwise ended as an Indiana Medicaid MCE effective 1/1/2026 (FSSA press release); do not route a live eligibility check to this entry. Members reassigned to Anthem, CareSource, or MHS.",
        sourceUrl: 'https://www.in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf',
      },
      {
        slug: 'kansas-medicaid',
        field: 'codeGrid',
        change:
          "Ships Kansas's actual 7-code CCTS/IIS billable set (97151, 97152, 97155, 97156 from the 1/1/2017 State Plan transition; 97153, 97154, 97158 added 7/1/2024) — no 97157, no 0362T/0373T — per the build spec's instruction not to force the CPT list onto a state with a different code structure.",
        sourceUrl: 'https://www.sunflowerhealthplan.com/newsroom/kmap-17129.html',
      },
      {
        slug: 'kansas-medicaid',
        field: 'edi.medicaid271Notes.mcoSegmentLocation',
        change:
          'The real KMAP 270/271 Standard Companion Guide (v6.0, 5/2/2017) was located via a direct legacy-host URL after the public portal page redirected to an SSO login wall on every attempt — Loop 2110C, 12th Repetition: EB03=30 interpreted as "Managed care organization," EB05=free-text plan name. Shipped with staleRisk:true given the 2017 date.',
        sourceUrl: 'https://www.kmap-state-ks.us/Documents/EDI/2017-05_270-271-DXC.pdf',
      },
      {
        slug: 'kansas-medicaid',
        field: 'rates.byCode',
        change:
          "Genuinely unverified beyond a stale 2019 anchor (97151 = $17.50/unit, KMAP Bulletin 18259) — re-checked the KMAP interactive fee lookup (SSO-walled) and the FY2024/2025/2026 HCBS rate-increase bulletins this pass; confirmed those bulletins cover only Brain Injury/Technology Assisted/I-DD HCBS waiver rates plus the separate HCBS Autism waiver code T2040, not the State Plan 9715x codes. Every other code ships 'unverified — pull from the KMAP interactive fee-schedule lookup' rather than a guessed figure.",
        sourceUrl: 'https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Virginia + New Jersey VOB enrichment shipped (docs/vob-build.md): Layer 1 (EDI routing crosswalk), Layer 3 (code-level coverage grid for 97151–97158, 0362T, 0373T), and Layer 4 (Medicaid rate tables, Medicaid lines only) for all 18 VA + NJ guides (vob/virginia.ts, vob/new-jersey.ts). VIRGINIA: read the DMAS/MES 270/271 companion guide (v2.2, 7/1/2026) in full — it does NOT carry the Cardinal Care MCO in any documented 271 segment (2120C NM1 is Third-Party-Liability/commercial; MSG/2110C carries a 3-digit aid-category code, not an MCO name; no carrier→MCO map is published), so virginia-medicaid.medicaid271Notes documents what IS specified (date-level query, real-time + batch, v2.2 DTP01=458 renewal date) and marks the MCO-name placement unverified with a DMAS MES EDI-support verifyVia; flagged that the guide still names Conduent (not Acentra) as EDI fiscal agent — Acentra runs the separate FFS service-authorization Atrezzo portal. Confirmed the full DMAS licensure-tiered ABA fee schedule directly from the live DMAS CPT fee-file CSVs (cptmedical4.csv / cptmedical1.csv), all 10 codes eff. 12/1/2021 still current (97153 $15.00 tech / $23.48 LABA-HN / $39.40 LMHP-TF / $46.63 LBA-HO confirmed exactly, plus the previously-unenumerated group/team codes 97154/97157/97158/0362T/0373T) — and confirmed the physician-fee-row trap (generic REGULAR & CSB IP rows at a few dollars are NOT the ABA rates); the VirginiaABA billing-guidance PDF is a DRAFT with no dollar amounts, cited for modifier logic only. Preserved Humana Healthy Horizons\' genuine 0362T PA quirk (PA-required, deviating from the DMAS assessment-code baseline) and Anthem HealthKeepers Plus\' published code/modifier/POS grid (GT telehealth on 97151/97153/97155/97156; school POS 03 on 97151/97155/97156). cigna-virginia intentionally ships NO PA panel: EN0499 excludes VA fully-insured business, so its codeGrid is plan-dependent/exclusion-honest rather than inventing PA verdicts. NEW JERSEY: read the NJMMIS/Gainwell 5010 270/271 companion guide (Dec 2022) in full — MCO enrollment surfaces in Loop 2110C (EB04=HM; REF01=18 → REF02 3-digit plan code, REF03 plan name) and Loop 2120C (NM101=PRP → NM103 MCO name/PER phone), the pre-selection FFS window is the documented basis for the no-PA-pending-enrollment fast-start, eligibility is real-time with a monthly guarantee; the 3-digit-code→MCO-name crosswalk is NOT in the guide (Appendix 3 lists only eligibility categories) so mcoCarrierCodes ships empty with a verifyVia. NJ FFS rates: 97153 $15.00 (raised from $11.20 eff 2/1/2022), 97155 $21.25, 97156 $25.00 confirmed CURRENT (NJMMIS Procedure Master Listing CY2026 Q2 via ProviderSpark); the remaining codes carry launch-era values from the Aetna Better Health NJ 2020 rate sheet (which reproduces the state MUE daily-unit table verbatim) with an unverified-as-current flag + a portal-download verifyVia. Corrected two carve-out assumptions from EDI research: Wellpoint\'s Carelon relationship is utilization-management ONLY (BH/ABA claims ride WLPNT via Availity; abaRidesOn=medical), and UHC Community Plan / UHC commercial use Optum for the BH network but claims ride the medical payer ID (87726) — both recorded abaRidesOn=medical, not bh. cigna-new-jersey (unlike cigna-virginia) ships a real EN0499 PA panel (no PA on 97151/97152/0362T; treatment PA required) since NJ has no carve-out. Verified payer IDs across all 18 guides against pVerify (Mar 2026) and the Optum/Change Healthcare professional-claims list; Availity IDs read only from the stale 2012 public snapshot ship inferred/unverified pending a current export.',
    guides: [
      'virginia-medicaid',
      'aetna-better-health-virginia',
      'anthem-healthkeepers-plus',
      'humana-healthy-horizons-virginia',
      'sentara-community-plan',
      'unitedhealthcare-community-plan-virginia',
      'aetna-virginia',
      'cigna-virginia',
      'unitedhealthcare-virginia',
      'new-jersey-medicaid',
      'horizon-nj-health',
      'aetna-better-health-new-jersey',
      'fidelis-care-new-jersey',
      'unitedhealthcare-community-plan-new-jersey',
      'wellpoint-new-jersey',
      'aetna-new-jersey',
      'cigna-new-jersey',
      'unitedhealthcare-new-jersey',
    ],
    details: [
      {
        slug: 'virginia-medicaid',
        field: 'rates.byCode',
        change:
          'Full DMAS licensure-tiered ABA fee schedule confirmed directly from the live DMAS CPT fee-file CSVs (all 10 codes, eff. 12/1/2021, still current): 97153 $15.00 tech / $23.48 LABA (HN) / $39.40 LMHP (TF) / $46.63 LBA (HO); QHP codes 97151/97155/97156 at $23.48/$39.40/$46.63; group/team codes 97154/97157/97158/0362T/0373T supplied at their distinct rates. Physician-fee-row trap confirmed and excluded.',
        sourceUrl: 'https://www.dmas.virginia.gov/media/cptcodes/cptmedical4.csv',
      },
      {
        slug: 'virginia-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'DMAS/MES 270/271 companion guide (v2.2, 7/1/2026) read in full: does NOT document a segment carrying the Cardinal Care MCO (2120C NM1 = TPL/commercial; MSG/2110C = 3-digit aid-category code); no carrier→MCO map published. Documented what IS specified (date-level query DTP01=291/472, real-time + batch, v2.2 adds DTP01=458 renewal date) and marked MCO placement unverified. Guide still names Conduent (not Acentra) as EDI fiscal agent — Acentra runs the separate FFS Atrezzo SA portal.',
        sourceUrl: 'https://vamedicaid.dmas.virginia.gov/sites/default/files/2026-07/MES%20EDI%20270-271%20Companion%20Guide_R100_20220509-PK%202.pdf',
      },
      {
        slug: 'humana-healthy-horizons-virginia',
        field: 'codeGrid.0362T',
        change:
          "Preserved Humana's genuine deviation from the DMAS assessment-code baseline: its VA PA list (eff. 7/1/2025) flags 0362T as PA-required while 97151/97152 stay PA-free — carried honestly (PA-required) rather than normalized to the state rule.",
        sourceUrl: 'https://assets.humana.com/is/content/humana/VA%20Medicaid%20PALpdf',
      },
      {
        slug: 'cigna-virginia',
        field: 'codeGrid',
        change:
          'No PA panel by design: the current EN0499 (eff. 5/15/2026) states verbatim that Virginia fully-insured business is not subject to the policy, so every codeGrid field ships plan-dependent/exclusion-honest (funding type first on a live benefits check) rather than inventing PA verdicts. EDI IDs (Evernorth 62308 pass-through) still provided.',
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
      {
        slug: 'new-jersey-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'NJMMIS/Gainwell 5010 270/271 companion guide (Dec 2022) read in full: MCO enrollment in Loop 2110C (EB04=HM; REF01=18 → REF02 3-digit plan code, REF03 plan name) and Loop 2120C (NM101=PRP → NM103 MCO name/PER phone); pre-selection FFS window is the documented basis for the no-PA-pending-enrollment fast-start; real-time with a monthly guarantee. The 3-digit-code→MCO-name crosswalk is NOT in the guide (Appendix 3 = eligibility categories only) — mcoCarrierCodes ships empty with a verifyVia.',
        sourceUrl: 'https://test.njmmis.com/downloadDocuments/5010_270-271_HIPAACompanionGuide.pdf',
      },
      {
        slug: 'new-jersey-medicaid',
        field: 'rates.byCode',
        change:
          'NJ FFS ABA rates: 97153 $15.00 (raised from $11.20 eff 2/1/2022), 97155 $21.25, 97156 $25.00 confirmed current (NJMMIS Procedure Master Listing CY2026 Q2). Remaining codes carry launch-era values from the Aetna Better Health NJ 2020 sheet (which reproduces the state daily-unit MUE table verbatim) with an unverified-as-current flag; the primary CY2026 listing is a portal download.',
        sourceUrl: 'https://www.providerspark.com/for-providers/medicaid-rates/new-jersey/',
      },
      {
        slug: 'wellpoint-new-jersey',
        field: 'edi.bhCarveOut',
        change:
          'Corrected from an assumed Carelon claims carve-out: Carelon Behavioral Health provides utilization-management ONLY for Wellpoint NJ — BH/ABA claims still submit to WLPNT via Availity (no separate Carelon claims payer ID); abaRidesOn=medical. Change Healthcare uses the legacy Amerigroup-NJ line 28806 (270/271=N there), so the Availity/WLPNT path is preferred for eligibility.',
        sourceUrl: 'https://www.provider.wellpoint.com/new-jersey-provider/claims/electronic-data-interchange',
      },
      {
        slug: 'cigna-new-jersey',
        field: 'codeGrid',
        change:
          "Unlike cigna-virginia, EN0499 APPLIES to NJ (no state carve-out): shipped a real PA panel — no PA on assessment codes 97151/97152/0362T, treatment PA required with the ABA PA form. EN0499 clarified as Evernorth's coverage-policy number, not a payer ID; claims route on 62308.",
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Ohio + Missouri VOB enrichment shipped (docs/vob-build.md): Layer 1 (EDI routing crosswalk), Layer 3 (code-level coverage grid), and Layer 4 (Medicaid rate tables, Medicaid lines only) for all 11 Ohio guides and all 4 Missouri guides. OHIO 270/271: worked the known obstacle — managedcare.medicaid.ohio.gov and the ODM companion-guide listing page both 404 to automated fetch, but the ODM Next Generation Fiscal Intermediary (Gainwell) 5010 270/271 Companion Guide v13.0 (2023-06-30) was retrieved directly from Ohio\'s asset CDN and read in full: Loop 2110C EB01=\'MC\' flags MCO enrollment, the MCO entity is named free-text in Loop 2120C NM1 (NM101=\'PR\'), EB05 carries the coded plan-coverage description, eligibility spans are MONTHLY (EB06=\'34\'), and the guide carries a FIXED ODM trading-partner code table (ISA06/08) plus a 2100A NM109 MCE-payer-ID table that make each MCO — including Aetna OhioRISE (trading partner 0021914 / MCE payer 60054) — separately visible on the wire. Encoded the OhioRISE landmine as a verified 271 fact: OhioRISE IS visible in eligibility but per ODM\'s Mixed Services Protocol NEVER pays ABA; the member\'s medical MCO does. Ohio rates ship from ODM\'s ABA fee appendix (Appendix A to draft rule 5160-34-03, package ERF188422B.pdf) — the only published ODM ABA fee document, transcribed verbatim with its DRAFT/not-yet-filed status and blank effective-date column flagged rather than presented as in-force; codes.ohio.gov (in-force OAC 5160-34) is JS/bot-gated and could not be re-read. Ohio prices by practitioner-tier descriptor (Independent COBA/BCBA/BCBA-D · BCaBA · RBT), NOT by HN/HO/HM modifier — codeGrid modifiers ship accordingly. Per-code daily caps use the CMS NCCI MUE ceiling enumerated verbatim in CareSource MM-0028 (verified there, inferred elsewhere; the state rule sets none of its own). Both bot-blocks from the original compile were RETRIED and are no longer blocked (AmeriHealth Caritas OH BH PA page and Molina OH PA page both load); Optum\'s OH Medicaid LOCG PDF and Anthem\'s CG-BEH-02 GPP asset are JS-gated / not-extractable, so those plans\' per-code detail ships \'inferred\'/\'unverified\' with a verifyVia. Confirmed Anthem OH Medicaid\'s Carelon relationship is a UM/prior-authorization hop ONLY (Carelon "provides utilization management services on behalf of the health plan") — ABA claims have no second hop and ride the ODM FI to Anthem\'s MCE payer ID 0002937, resolving the OH-Anthem-Carelon gap the Layer 6 map flagged as unconfirmed. MISSOURI: reconfirmed the ABA FFS carve-out (ABA billed to state FFS even for MCO enrollees) against two sources newer than the corpus\'s prior 7/2023 statement — the MO HealthNet Managed Care Policy Statements "Effective 10/2024" (SFY25) and Healthy Blue\'s Sep-2025 provider manual, both quoting it verbatim (staleRisk downgraded to low). The eMOMED 5010 270/271 Companion Guide (Dec 2023) documents managed-care enrollment via EB04=\'MC\' in Loop 2110C (ME code in EB05 / REF02 when REF01=\'M7\'), the MCO plan hotline in Loop 2120C PER04, MO HealthNet\'s in-transaction identifier NM109=\'431754897\', monthly eligibility keyed to calendar-month boundaries, and NO carrier-code->MCO-name table (values resolve from the Health Plan Record Layout Manual §C-45) — the ABA carve-out is a routing fact, not a discrete 271 field. The MHD Applied Behavioral Analysis fee schedule (.xlsx, file-stamped 2026-07-07) was parsed directly: all 10 codes covered and priced by tier (HO behavior analyst/psychologist · HN assistant · HM RBT-billed-by-supervisor, plus U8 in-home and TM telehealth), with the fee file marking every TM row precert-not-required and no U8 row ever paired with a technician (HM) combination. Availity\'s public payer list (2012-dated) has no Missouri Medicaid row and is unreliable for the OH MCOs; pVerify codes captured as pVerify-internal (not X12 CPIDs); Change Healthcare CPIDs remain login-gated and ship unverified. The 6 commercial guides (Aetna/Cigna/UnitedHealthcare in each state) get Layers 1+3 only per spec, reusing the already-verified national policies (CPB 0554/0648, EN0499, Optum SCC/2022RP501A) with the state autism mandates noted (OH R.C. 3923.84 floors; MO RSMo 376.1224 $40k/yr cap); Cigna\'s per-code PA split ships \'unverified\' consistent with this corpus\'s cigna-texas EN0499 re-verification, and Optum\'s ABA State Mandates supplement HAS an Ohio entry (CNS/CNP ordering, eff. 3/2025) but no Missouri entry.',
    guides: [
      'ohio-medicaid',
      'caresource-ohio',
      'buckeye-health-plan',
      'molina-healthcare-ohio',
      'anthem-ohio-medicaid',
      'unitedhealthcare-community-plan-ohio',
      'amerihealth-caritas-ohio',
      'humana-healthy-horizons-ohio',
      'aetna-ohio',
      'cigna-ohio',
      'unitedhealthcare-ohio',
      'missouri-medicaid',
      'aetna-missouri',
      'cigna-missouri',
      'unitedhealthcare-missouri',
    ],
    details: [
      {
        slug: 'ohio-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          'ODM/Gainwell FI 270/271 Companion Guide v13.0 (2023-06-30) read in full (retrieved from dam.assets.ohio.gov after managedcare.medicaid.ohio.gov 404\'d): Loop 2110C EB01=\'MC\' flags MCO enrollment; MCO named free-text in 2120C NM1 (NM101=\'PR\'); EB05 coded plan description; monthly spans (EB06=\'34\'). Populated mcoCarrierCodes from the guide\'s fixed ISA06/08 trading-partner table + 2100A NM109 MCE-payer-ID table (e.g. 0003150 CareSource, 0004202 Buckeye, 0007316 Molina, 88337 UHC, 842435374 AmeriHealth Caritas, 61103 Humana, 0002937 Anthem, 0021914/60054 Aetna OhioRISE).',
        sourceUrl:
          'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Providers/MITS/HIPAA%205010%20Implementation/CompanionGuide/OMES/FFS/Ohio270-271.pdf',
      },
      {
        slug: 'ohio-medicaid',
        field: 'edi.medicaid271Notes (OhioRISE landmine)',
        change:
          'OhioRISE (Aetna) is separately visible in the 271 (trading partner 0021914 / MCE claims payer ID 60054) but NEVER pays ABA per ODM\'s Mixed Services Protocol — the underlying medical MCO does. Encoded as a verified 271-visibility + payer-routing fact so the eligibility response is not misread as OhioRISE being the ABA payer.',
        sourceUrl: 'https://dam.assets.ohio.gov/image/upload/v1743449666/managedcare.medicaid.ohio.gov/OhioRISE/OhioRISE_Mixed_Services_Protocol_20250401.pdf',
      },
      {
        slug: 'ohio-medicaid',
        field: 'rates',
        change:
          'ODM ABA fee appendix (Appendix A to DRAFT rule 5160-34-03, ERF188422B.pdf, stamped "DRAFT - NOT YET FILED", blank effective-date column) transcribed verbatim: 97151 $30.49 Independent/$22.67 BCaBA, 97152 $17.00 RBT, 97153 $16.04 RBT, 97154 $7.61 RBT, 97155 $27.28/$20.63, 97156 $30.09/$22.37, 97157 $14.46/$10.62, 97158 $14.46/$10.62, 0362T/0373T $33.54. Priced by practitioner tier, not by billing modifier. Shipped with draft status flagged, not as an in-force schedule.',
        sourceUrl: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders,%20Partners/LegalandContracts/Rules/ERF188422B.pdf',
      },
      {
        slug: 'caresource-ohio',
        field: 'codeGrid.*.unitCap',
        change:
          'Full CMS NCCI MUE daily-unit table extracted verbatim from MM-0028 (97151=32, 97152=16, 97153=32, 97154=18, 97155=24, 97156=16, 97157=16, 97158=16, 0362T=16, 0373T=32) — verified on CareSource, applied as the inferred federal ceiling on the other OH guides since the state rule sets no per-code daily cap of its own.',
        sourceUrl: 'https://www.caresource.com/documents/medicaid-oh-policy-medical-mm-0028-20250701.pdf',
      },
      {
        slug: 'anthem-ohio-medicaid',
        field: 'edi.bhCarveOut',
        change:
          'Carelon Behavioral Health is a UM/prior-authorization hop ONLY (per the Carelon-Anthem OH integration QRG: "independent company providing utilization management services on behalf of the health plan") — ABA CLAIMS have no second EDI hop and route through the ODM FI to Anthem\'s MCE payer ID 0002937. twoHopRequired=true reflects the authorization hop; there is NO separate Carelon BH claims payer ID. Resolves the OH-Anthem-Carelon gap the Layer 6 carve-out map flagged as unconfirmed.',
        sourceUrl: 'https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/oh/ohbcbs-cd-025424-23-carelon-bh-intgrtn-qrg.pdf',
      },
      {
        slug: 'buckeye-health-plan',
        field: 'codeGrid.97151/97152.paRequired',
        change:
          'The in-network assessment-PA waiver in buckeye prose is NOT stated in CP.BH.104 itself (which was read in full) — it belongs on Buckeye\'s separate PA list / pre-auth check tool. Shipped \'inferred\' with a verifyVia rather than \'verified\', per accuracy-over-completeness.',
        sourceUrl: 'https://www.buckeyehealthplan.com/content/dam/centene/Buckeye/policies/clinical-policies/CP.BH.104.pdf',
      },
      {
        slug: 'amerihealth-caritas-ohio / molina-healthcare-ohio',
        field: 'edi / codeGrid (bot-block retry)',
        change:
          'Both sites, reported bot-blocked in the original compile, were retried and are NOT currently blocked: AmeriHealth Caritas OH\'s BH PA page confirms ABA needs PA (UM 833-735-7700, fax 833-329-6411, Jiva/NaviNet); Molina OH\'s PA page loads but is member-facing with no code/EDI detail. Neither publishes an EDI payer ID on-page — routing uses the ODM FI MCE payer IDs (842435374, 0007316; Molina CHC id 20149 from claim.md, inferred).',
        sourceUrl: 'https://www.amerihealthcaritasoh.com/provider/resources/behavioral-prior-auth',
      },
      {
        slug: 'missouri-medicaid',
        field: 'edi.medicaid271Notes + carve-out currency',
        change:
          'eMOMED 5010 270/271 Companion Guide (Dec 2023) read in full: managed-care enrollment via EB04=\'MC\' (Loop 2110C), ME code in EB05/REF02(M7), MCO plan hotline in 2120C PER04, in-transaction ID NM109=\'431754897\', monthly spans, NO carrier-code->MCO table (resolves via Health Plan Record Layout Manual §C-45). ABA FFS carve-out reconfirmed current against the MO HealthNet Managed Care Policy Statements "Effective 10/2024" (newer than the corpus\'s prior 7/2023) and Healthy Blue\'s Sep-2025 manual — staleRisk downgraded to low.',
        sourceUrl: 'https://www.emomed.com/public/publicdocs/5010%20Companion%20Guide.pdf',
      },
      {
        slug: 'missouri-medicaid',
        field: 'rates / codeGrid',
        change:
          'MHD Applied Behavioral Analysis fee schedule (.xlsx, file-stamped 2026-07-07) parsed directly: all 10 codes covered and priced by tier (HO/HN/HM + U8 in-home + TM telehealth). Key figures: 97153 $20.13 (HO/HN)/$16.37 (HM, raised eff 7/1/2024), 97151/97155/97156/0362T/0373T $25.26 HO ($27.46 U8 in-home for 97155/0362T/0373T), 97154 $2.05 HM-only (eff 5/1/2025), 97157 $3.16/$2.52 (eff 12/18/2025), 97158 $3.16/$2.14. Every TM row is precert-not-required; technicians never carry U8. Daily maxima 97151=32, 97152=16, 97153=32, 97154=8, 97155=24, 97156=16, 97157=8, 97158=6, 0362T=16, 0373T=32.',
        sourceUrl: 'https://apps.dss.mo.gov/fmsfeeschedules/dlfiles/Applied%20Behavioral%20Analysis.xlsx',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'New Mexico + Arizona VOB enrichment shipped: Layers 1 (EDI routing crosswalk), 3 (code-level coverage grid, 97151–97158/0362T/0373T), and 4 (Medicaid rate tables) populated for all 8 NM Turquoise Care guides and all 11 AZ AHCCCS guides. NM: the LOD #53 ABA fee schedule (eff. 1/1/2025) ships verbatim with the full U5/U4/U3/U9/U1 credential ladder, and — because LOD #53 makes that FFS schedule an enforceable rate FLOOR for every Turquoise Care MCO and sub-vendor — the four MCO guides carry it as a verified minimum (their own paid rate at/above it is not published). PA verdicts come from the fee schedule\'s per-code flags (97153 + 0373T = PA; assessment/most treatment = no PA), independently confirmed for UHC Community Plan by its Turquoise Care QRG. The NM 271 MCO-enrollment loop/segment and carrier-code map ship \'unverified\' — the NM MMIS portal is Incapsula-blocked and NM routes 270/271 through the generic Conduent Eligibility Gateway (payer ID 00000001234); the HCA Turquoise Care Systems Manual\'s MCO/TPL constants are recorded as the closest (834/TPL, not 271) mapping. AZ: the AHCCCS ABA fee schedule (fixed rates eff. 11/1/2023, verified unchanged through FY26) ships with HM/HN/HO/HP tiers and the POS-12 home premium — with corrections vs. the guide prose (97155/97151/97158 have no HM tier; $25.05 is 97155-HN, not HM), and 97156/97157 (By Report) + 0362T/0373T (off the ABA schedule) ship \'unverified\'. The AHCCCS 5010A 270/271 Companion Guide v4.0 WAS retrievable: medicaid271Notes carries the verified 2120C NM1*Y2 managed-care segment and the 6-digit plan codes actually shown in its worked examples (Mercy Care 010306, AzCH 010422, DCS/CMDP 010166, CRS, AIHP, QMB/SLMB); UHCCP/Banner/Health-Choice/Molina 6-digit codes are not enumerated there → unverified. arizona-ddd carries no standalone payer ID (ABA rides the member\'s DDD Health Plan, Mercy Care DD 86052 or UHCCP DD 03432; DDD enrollment resolves in one 271 hop via EB05 "DDD Subcontractor Plan" + NM1*Y2). AHCCCS integrated BH into ACC (2018)/DDD (2019), so ABA rides each plan\'s medical payer ID — no BH carve-out, no two-hop. One unresolved conflict shipped as-is: UHC Community Plan NM claims ID — the Optum NM ABA QRG says 87726/ERA 86047, but UHC\'s own current affiliate list shows NM Medicaid = 87748 (87726 = NM Dual SNP) and 86047 = New Jersey. Cigna/Evernorth confirmed as a same-ID pass-through (62308) in both states. Commercial guides carry EDI + code grid but no rate table (contract-specific).',
    guides: [
      'new-mexico-medicaid',
      'blue-cross-blue-shield-new-mexico',
      'presbyterian-health-plan-new-mexico',
      'molina-healthcare-new-mexico',
      'unitedhealthcare-community-plan-new-mexico',
      'aetna-new-mexico',
      'cigna-new-mexico',
      'unitedhealthcare-new-mexico',
      'arizona-ahcccs',
      'mercy-care-arizona',
      'unitedhealthcare-community-plan-arizona',
      'arizona-complete-health',
      'banner-university-family-care',
      'health-choice-arizona',
      'molina-healthcare-arizona',
      'arizona-ddd',
      'aetna-arizona',
      'cigna-arizona',
      'unitedhealthcare-arizona',
    ],
    details: [
      {
        slug: 'new-mexico-medicaid',
        field: 'rates',
        change:
          'LOD #53 ABA fee schedule (eff. 1/1/2025) shipped verbatim: 97151 $130.94 (U5/U4)/$112.65 (U3); 97153 $38.02/$37.99/$32.31/$23.35/$19.85 (U5/U4/U3/U9/U1); 97155 $55.55/$39.69; 97156 $35.79/$25.78; 0362T $130.94/$112.29; 0373T $119.05/$107.13; T1026 UC/UD $142.84/hr ($109.27 supervising BCaBA); ISP Update (T1026 HI HK) $206.33. Under LOD #53 this is an enforceable MCO rate floor.',
        sourceUrl: 'https://www.hca.nm.gov/wp-content/uploads/FInal-LOD-53-Applied-Behavioral-Analysis-ABA-Fee-Schedule-Rates.pdf',
      },
      {
        slug: 'new-mexico-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          "271 MCO-enrollment segment/carrier-code map shipped 'unverified': the NM MMIS provider portal is Imperva/Incapsula-blocked and NM appears to route 270/271 through the generic Conduent Eligibility Gateway (payer ID 00000001234, real-time, 1-yr look-back, date-range), which publishes no NM-specific MCO segment. The HCA Turquoise Care Systems Manual v1.10 MCO/TPL constants (TPLBCBS/TPLPRESBYTERIAN/TPLUNITED/TPLMOLINA) are 834/TPL, not 271. NEW: HCA 'Turquoise Claims' single-point-of-entry launched 3/23/2026 (legacy IDs denied after 6/15/2026).",
        sourceUrl: 'https://downloads.conduent.com/content/usa/en/document/270-payer-guide-medicaid-5010.pdf',
      },
      {
        slug: 'unitedhealthcare-community-plan-new-mexico',
        field: 'edi.payerId.changeHealthcare',
        change:
          "Shipped as an unresolved conflict rather than guessed: the Optum NM Turquoise Care ABA QRG (cited in the guide prose) states claims Payer ID 87726 (ERA 86047), but UHC's own current Claims Payer List for Affiliates & Strategic Alliances shows NM Medicaid = 87748 (with 87726 labeled the NM Dual SNP, 'Former 87726') and 86047 = New Jersey; the NM ERA appears under a multi-state row (candidate 04567). changeHealthcare set to 87748 with the conflict documented.",
        sourceUrl: 'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
      },
      {
        slug: 'arizona-ahcccs',
        field: 'edi.medicaid271Notes',
        change:
          'AHCCCS 270/271 Companion Guide v4.0 (Sept 2022) retrieved: managed-care enrollment returns in 2110C (EB*3*IND*30*HM*<6-digit code+name>, REF*6P contract type) and the definitive 2120C NM1*Y2 (Managed Care Organization) segment; daily spans (D8/RD8); real-time + batch. mcoCarrierCodes populated from the guide\'s worked examples (010306 Mercy Care, 010422 AzCH, 010166 DCS/CMDP, 010115/999125 CRS, 999998 AIHP, 008715 QMB, 008040 SLMB). UHCCP/Banner/Health-Choice/Molina 6-digit codes are not enumerated in the guide → unverified.',
        sourceUrl: 'https://www.azahcccs.gov/Resources/Downloads/EDIchanges/AZ270_271_CG.pdf',
      },
      {
        slug: 'arizona-ahcccs',
        field: 'rates',
        change:
          'AHCCCS ABA fee schedule (fixed eff. 11/1/2023, unchanged through FY26 eff. 10/1/2025): 97153 $17.91 (HM)/$21.32 (HN)/$23.69 (HO/HP) office, ~10–11.5% home premium. CORRECTIONS vs. prose: 97155/97151/97158 have NO HM tier ($25.05 = 97155-HN, not HM). 97156/97157 remain By Report; 0362T/0373T are off the ABA fee schedule → all four shipped unverified.',
        sourceUrl: 'https://www.azahcccs.gov/AHCCCS/Downloads/PublicNotices/rates/FinalPublicNotice_RateChanges_20231101_ABA.pdf',
      },
      {
        slug: 'arizona-ddd',
        field: 'edi.bhCarveOut',
        change:
          "DDD has no standalone EDI payer ID — ABA rides the member's DDD Health Plan (Mercy Care DD 86052 or UHCCP DD 03432; both integrated BH since 10/1/2019). DDD enrollment resolves in one AHCCCS 271 hop via EB05 'DDD Subcontractor Plan'/'DES/DDD Targeted Support Coordination' + the NM1*Y2 plan; the CG publishes no DDD 6-digit code or explicit ABA routing rule, so that is established by the DES DDD Health Plans documents.",
        sourceUrl: 'https://des.az.gov/services/disabilities/developmental-disabilities/individuals-and-families/supports-and-services/ddd-health-plans-info',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      "Massachusetts + Maryland VOB enrichment shipped: Layers 1 (EDI routing crosswalk), 3 (code-level coverage grid, 97151-97158/0362T/0373T), and 4 (Medicaid rate tables) populated for all 10 MA guides (masshealth-massachusetts-medicaid, mbhp, wellsense, tufts-health-together, fallon, health-new-england, mass-general-brigham-health-plan, aetna/cigna/unitedhealthcare-massachusetts) and all 4 MD guides (maryland-medicaid, aetna/cigna/unitedhealthcare-maryland). MASSACHUSETTS: the MassHealth 270/271 companion guide (Nov 2023) confirms managed-care enrollment rides Loop 2110C (EB01=L/MC/D, EB05 returns the plan name as free text — NO numeric carrier-code table exists, unlike the coded 2120C tables some other states publish). 101 CMR 358.03's official fee schedule was retrieved in full: it prices exactly 7 codes (97151/97155/97156=$30.73, 97153=$16.37, 97154=$13.91, 97157=$26.12, H0031-U2=$30.73) and CONFIRMS 97152/97158/0362T/0373T absent from the schedule (individual-consideration pricing per 358.03(4)(b), not a retrieval gap). The Carelon/MBHP ABA Performance Specification (updated 2/15/2026) confirms a group-session cap (4.5 hrs/day, 2-8 members) but NO per-code unit caps, POS codes, or telehealth modifiers anywhere — shipped as a confirmed absence. WellSense's own EDI companion guide (Mar 2024) is flagged as out-of-date on BH-carve-out routing since WellSense insourced ABA administration from Carelon 1/1/2026; Mass General Brigham Health Plan's Optum BH payer ID (87726) is confirmed to be the SAME number as UnitedHealthcare's national medical payer ID, an unresolved routing ambiguity flagged rather than silently resolved. MARYLAND: the single most load-bearing finding — Maryland's own 270/271 companion guide (2013, the only version published) contains ZERO references to \"BHASO,\" \"Carelon,\" \"Beacon,\" or any behavioral-health administrator anywhere in its 22 pages; a plain 270/271 against Maryland Medicaid's MMIS does NOT surface the ABA carve-out, so hop-2 routing to Carelon has to be hard-coded business logic, not detected from the wire. Carelon became Maryland's BHASO only recently (1/1/2025, succeeding Optum) — MDH's own Provider Transmittal PT 54-25 names the Carelon submitter ID as BHOMD (superseding Optum-era OMDBH), independently corroborated by Claim.MD's payer registry; shipped as 'inferred' rather than 'verified' for ABA specifically since no ABA-named transmittal citing BHOMD was found. The MD ABA fee schedule's two remaining rate gaps (97154, 97158) were filled directly from the manual's pp.15-16 table ($10.45/$8.36/$6.96 tiered per-participant for 97154; $10.45 for 97158), and Maryland's telehealth eligibility rule (GT modifier limited to direct supervision, parent training, group parent training) is shipped as a confirmed negative for all other codes, not an omission. pVerify's payer-list page returned a Cloudflare bot-block on direct retrieval for Maryland this pass — every pVerify-sourced field for the 4 MD guides ships 'unverified' rather than from an unconfirmed scrape.",
    guides: [
      'masshealth-massachusetts-medicaid',
      'mbhp-massachusetts',
      'wellsense-massachusetts',
      'tufts-health-together',
      'fallon-health-massachusetts',
      'health-new-england-massachusetts',
      'mass-general-brigham-health-plan',
      'aetna-massachusetts',
      'cigna-massachusetts',
      'unitedhealthcare-massachusetts',
      'maryland-medicaid',
      'aetna-maryland',
      'cigna-maryland',
      'unitedhealthcare-maryland',
    ],
    details: [
      {
        slug: 'masshealth-massachusetts-medicaid',
        field: 'rates',
        change:
          "101 CMR 358.03(3) fee schedule retrieved in full: 97151/97155/97156=$30.73, 97153=$16.37, 97154=$13.91, 97157=$26.12, H0031-U2=$30.73 (eff. 10/1/2024). 97152, 97158, 0362T, 0373T confirmed ABSENT from the published schedule — reimbursed by individual consideration per 358.03(4)(b); no bulletin naming an applied rate for these four was found.",
        sourceUrl: 'https://www.mass.gov/doc/rates-for-applied-behavior-analysis-effective-october-1-2024-0/download',
      },
      {
        slug: 'masshealth-massachusetts-medicaid',
        field: 'edi.medicaid271Notes',
        change:
          "MassHealth's 270/271 companion guide (Nov 2023) confirms Loop 2110C EB01=L(PCC)/MC(MCO,ACO,ICO,CP,SCO,PACE)/D(Community Partner), EB03=30, EB05 returns the plan name as free text with no numeric carrier-code table. Both real-time (single-patient) and batch supported given a Trading Partner Agreement on file.",
        sourceUrl: 'https://www.mass.gov/doc/masshealth-standard-companion-guide-health-care-eligibilitybenefit-inquiry-and-information-response-270271-0/download',
      },
      {
        slug: 'wellsense-massachusetts',
        field: 'edi.bhCarveOut',
        change:
          "WellSense's own EDI Claims Companion Guide (Mar 2024) still names Beacon Health Strategies for BH claims routing — flagged as OUT OF DATE against the main guide's already-verified fact that WellSense insourced BH administration from Carelon effective 1/1/2026. administratorPayerId and abaRidesOn ship 'inferred', not 'verified', pending a post-insourcing WellSense EDI document.",
        sourceUrl: 'https://www.wellsense.org/hubfs/Provider/Documents%20and%20Forms/Claims%20Resources/EDI_Claims_Companion_Guide_for_5010.pdf',
      },
      {
        slug: 'mass-general-brigham-health-plan',
        field: 'edi.bhCarveOut.administratorPayerId',
        change:
          "MGB's own claims page confirms BH claims route to Optum, payer ID 87726 — the SAME number as UnitedHealthcare's national medical payer ID per UHC's own 5/13/2026 payer list. How a clearinghouse distinguishes MGB's medical vs. Optum BH claims when the ID is shared was not confirmed this pass; shipped as an open verifyVia flag rather than silently resolved.",
        sourceUrl: 'https://massgeneralbrighamhealthplan.org/providers/claims',
      },
      {
        slug: 'maryland-medicaid',
        field: 'edi.bhCarveOut',
        change:
          "CRITICAL FINDING: Maryland's own 270/271 companion guide (2013, the only version hosted) contains zero references to BHASO/Carelon/Beacon/ValueOptions anywhere in 22 pages — a plain 270/271 against MD Medicaid's MMIS does NOT surface the ABA carve-out; hop-2 routing to Carelon is not wire-discoverable and must be hard-coded. MDH Provider Transmittal PT 54-25 (Dec 16, 2024) confirms Carelon became the BHASO 1/1/2025 (succeeding Optum) with submitter ID BHOMD (formerly OMDBH) — corroborated by Claim.MD's payer registry, but not confirmed ABA-specific by name (shipped 'inferred').",
        sourceUrl: 'https://health.maryland.gov/iac/HIPAA/pdf/Companion%20Guide_270n271_EligibiltyInquirynResponse.pdf',
      },
      {
        slug: 'maryland-medicaid',
        field: 'rates.byCode.97154 / rates.byCode.97158',
        change:
          "Filled the two rate gaps left in the main guide's prose directly from the MDH ABA Provider Manual (eff. 2/1/2026) fee schedule, pp.15-16: 97154 = $10.45 (psych/BCBA-D/BCBA, per participant) / $8.36 (BCaBA) / $6.96 (RBT/BT), daily max 16 units, group limited to 2-8 participants; 97158 = $10.45 (psych/BCBA-D/BCBA tier), daily max 10 units, group limited to 2-8 participants.",
        sourceUrl: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf',
      },
      {
        slug: 'maryland-medicaid',
        field: 'codeGrid.*.telehealth',
        change:
          "Maryland's telehealth eligibility (GT modifier) is confirmed limited to direct BCaBA/RBT/BT supervision, parent training, and group parent training (97155, 97156, 97157) — shipped as a confirmed NEGATIVE for all other codes (97151, 97152, 97153, 97154, 97158, 0362T, 0373T), not an omission or an inferred gap.",
        sourceUrl: 'https://health.maryland.gov/mmcp/epsdt/ABA/Documents/ABA%20Provider%20Manual%202_1_26%20(2).pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'VOB enrichment: Tennessee + Nebraska, Layers 1 (EDI routing crosswalk), 3 (code-level coverage grid), and 4 (Medicaid rate tables) across all 14 guides. ' +
      'TENNESSEE (7 guides — tenncare-tennessee-medicaid, bluecare-tennessee, unitedhealthcare-community-plan-tennessee, wellpoint-tennessee, aetna-tennessee, cigna-tennessee, unitedhealthcare-tennessee): confirmed TennCare publishes NO statewide or MCO ABA fee schedule at all (every Tennessee cell blank in the Feb 2026 CSG South multistate comparison) — Layer 4 ships as an explicit RateTable for all 4 Medicaid guides with every byCode entry the literal \'unverified\' and a source explaining why (the member\'s specific MCO contract is the only source of truth), the correct outcome per the build spec rather than a gap. The shared tri-MCO "ABA Provider Requirements and Program Description" and "Universal Request for ABA" form (both fetched and read in full) cover only 97151-97158 — 0362T/0373T appear in neither document, so tenncare-tennessee-medicaid, unitedhealthcare-community-plan-tennessee, and wellpoint-tennessee ship those two codes "not confirmed in the shared code set." BlueCare Tennessee is the one confirmed exception: its own 563-page Provider Administration Manual DOES list both codes with full CPT descriptions — a genuine per-MCO difference shipped as-is. TennCare\'s public "EDI Front Matter" (V8.0, fetched and read in full) confirms 270/271 is handled directly by the state (not brokered through the MCOs) via real-time SOAP or batch SFTP, but the loop/segment/carrier-code detail lives in the TennCare Companion Guide, available to registered trading partners only on request (EDI.TennCare@tn.gov) — medicaid271Notes ships unverified for that reason, same treatment as Georgia\'s inaccessible GAMMIS guide. A genuine cross-source EDI conflict was found and flagged rather than resolved: UHC\'s own 5/13/2026 Claims Payer List gives UnitedHealthcare Community Plan of Tennessee a dedicated Medical Payer ID (95378) distinct from the multi-state 87726 grouping, but the stale 2012 Availity snapshot maps that same 95378 to a different UHC affiliate entirely ("United Healthcare of River Valley"). ' +
      'NEBRASKA (7 guides — nebraska-medicaid, nebraska-total-care, molina-healthcare-nebraska, unitedhealthcare-community-plan-nebraska, aetna-nebraska, cigna-nebraska, unitedhealthcare-nebraska): the August 1, 2025 rate cuts are fully confirmed against two independent primary sources (Provider Bulletin 25-14\'s own table and the MHSUD fee schedule\'s dedicated "ABA" tab, both the July 2025 and SFY27 editions): 97151 $38.16, 97152 $25.88, 97153 $18.70, 97154 $7.49, 97155 $22.72, 97156 $26.06, 97158 $12.05 per 15-minute unit, directed onto all 3 Heritage Health MCOs per Health Plan Advisory 25-08 (no independent MCO-negotiated rate). 97157, 0362T, and 0373T are confirmed ABSENT from Nebraska\'s billable ABA code set (checked against four independent primary sources) — shipped as a verified non-coverage fact, not a research gap. The state\'s own 20-vs-30-hour weekly cap conflict is preserved honestly: the treatment MSD\'s literal text caps direct-service codes at 20 hrs/week, while Provider Bulletin 25-02 and the DHHS ABA Facts page describe policy as allowing up to 30 hrs/week — both figures given in codeGrid notes rather than resolved by fiat. Telehealth (modifier 95, POS 02/10) confirmed allowed only for 97151/97155/97156, explicitly prohibited for 97152/97153/97154/97158. The NE MMIS 270/271 companion guide (dated 2015, staleRisk) was retrieved and read in full: Loop 2120C NM1 (entity code X3) carries the member\'s MCO name as free text, with no numeric carrier-code crosswalk table anywhere in the document — a verified absence, not a gap. pVerify payer IDs confirmed via direct table-extraction for both states (e.g. Nebraska Medicaid 01204, Nebraska Total Care 01205, Molina NE 06080, Tennessee Medicaid 00185); UnitedHealthcare Community Plan of Nebraska reuses the already-shipped Layer 6 carve-out fact (Optum Behavioral Health / "United Behavioral Health," payer ID 87726 / ERA 86047). ' +
      'Both states: bhCarveOut fields throughout were kept consistent with the rows already shipped in vob/carveouts.ts rather than re-derived (Cigna/Evernorth 62308 no second hop nationally; Aetna commercial fully unverified nationally; per-state UHC facts reused as-is). Commercial Aetna/Cigna/UnitedHealthcare codeGrid entries reuse the national CPB/EN0499/Optum-policy source set and apply the same corrections georgia.ts\'s prior QA pass already made (the Aetna "GR-69017-4" precert form number and the UHC "every 4-6 months / 80% utilization" review cadence do not actually appear in their cited source documents — both existing states\' prose still cite them, but neither is asserted as verified here).',
    guides: [
      'tenncare-tennessee-medicaid',
      'bluecare-tennessee',
      'unitedhealthcare-community-plan-tennessee',
      'wellpoint-tennessee',
      'aetna-tennessee',
      'cigna-tennessee',
      'unitedhealthcare-tennessee',
      'nebraska-medicaid',
      'nebraska-total-care',
      'molina-healthcare-nebraska',
      'unitedhealthcare-community-plan-nebraska',
      'aetna-nebraska',
      'cigna-nebraska',
      'unitedhealthcare-nebraska',
    ],
    details: [
      {
        slug: 'tenncare-tennessee-medicaid',
        field: 'rates',
        change:
          'Confirmed TennCare publishes no statewide or MCO ABA fee schedule (every TN cell blank in the CSG South comparison) — shipped as an explicit RateTable with every byCode entry \'unverified\' and a source explaining why, per the build spec\'s guidance that this is the correct outcome for TN, not a gap to fill.',
        sourceUrl: 'https://csgsouth.org/wp-content/uploads/HSPS-Converted-IR__Comparison-of-Medicaid-Reimbursement-for-ABA-Individual-Services.pdf',
      },
      {
        slug: 'bluecare-tennessee',
        field: 'codeGrid.0362T / codeGrid.0373T',
        change:
          "BlueCare's own 563-page Provider Administration Manual lists both codes with full CPT descriptions, unlike the shared tri-MCO Program Description and Universal Request form (which the other two MCO guides rely on and which omit both codes entirely) — a genuine per-MCO difference shipped as-is, not collapsed to one shared value.",
        sourceUrl: 'https://content.bcbst.com/api/public/content/prov-bct-pam.pdf',
      },
      {
        slug: 'unitedhealthcare-community-plan-tennessee',
        field: 'edi.payerId.changeHealthcare',
        change:
          'Genuine cross-source conflict shipped unresolved: UHC\'s own 5/13/2026 Claims Payer List gives this plan a dedicated Medical Payer ID (95378), but the stale 2012 Availity snapshot maps that same number to a different UHC affiliate ("United Healthcare of River Valley").',
        sourceUrl: 'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/Payer-List-UHC-Affiliates-Strategic-Alliances.pdf',
      },
      {
        slug: 'nebraska-medicaid',
        field: 'rates.byCode',
        change:
          'August 1, 2025 rate cuts cross-confirmed against two independent primary sources (Provider Bulletin 25-14 + the MHSUD fee schedule\'s ABA tab); per-provider-type billing eligibility captured in modifierTiers (e.g. 97153 billable by Provider Types 57/67/83/84/85 but not 1/2; ineligible types show $0 in the fee schedule, not a lower rate).',
        sourceUrl: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-14.pdf',
      },
      {
        slug: 'nebraska-medicaid',
        field: 'codeGrid.97157 / codeGrid.0362T / codeGrid.0373T',
        change:
          'Confirmed absent from Nebraska\'s billable ABA code set across four independent primary sources (Provider Bulletin 25-14, DHHS ABA Facts page, MHSUD fee schedule ABA tab, both ABA Medicaid Service Definitions\' own code lists) — shipped covered: \'No\' as a verified fact, not left as an unresearched gap.',
        sourceUrl: 'https://dhhs.ne.gov/Pages/Applied-Behavior-Analysis.aspx',
      },
      {
        slug: 'nebraska-medicaid',
        field: 'codeGrid.97153.unitCap',
        change:
          'The 20-vs-30 hr/week conflict is presented as-is per the build spec: the treatment MSD\'s literal text caps direct-service hours at 20/week; Provider Bulletin 25-02 and the DHHS ABA Facts page both describe the policy as up to 30/week. Both figures shipped in the notes field, not resolved by picking one.',
        sourceUrl: 'https://dhhs.ne.gov/Medicaid%20Provider%20Bulletins/Provider%20Bulletin%2025-02.pdf',
      },
      {
        slug: 'nebraska-medicaid',
        field: 'edi.medicaid271Notes.mcoSegmentLocation',
        change:
          'NE MMIS 270/271 Companion Guide (dated 3/9/2015, staleRisk) retrieved and read in full: Loop 2120C NM1, entity-identifier code X3, carries the member\'s MCO name as free text (code P3 separately carries the enrolled PCP\'s name) — no numeric MCO carrier-code table exists in the document, a verified absence rather than an unresearched gap.',
        sourceUrl: 'https://dhhs.ne.gov/Documents/270-271%20Companion%20guide.pdf',
      },
      {
        slug: 'unitedhealthcare-community-plan-nebraska',
        field: 'edi.bhCarveOut',
        change:
          'Reused the already-shipped Layer 6 carve-out fact (Optum Behavioral Health, branded "United Behavioral Health"; payer ID 87726 / ERA 86047) rather than re-deriving a conflicting value — consistent with vob/carveouts.ts.',
        sourceUrl:
          'https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/neaba/neNEMedicaidQRG.pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      "VOB gap-fill: the last 9 guides without any VOB data now have it — 6 new Texas Medicaid MCO guides (Layers 1, 3, 4) and the 3 national commercial guides (Layers 1, 3; no rates, per the build spec). All 175 guides across 19 states now carry at least Layers 1+3. " +
      'TEXAS (community-health-choice-texas, bcbs-texas-medicaid, cook-childrens-health-plan, parkland-community-health-plan, el-paso-health, firstcare-health-plans): codeGrid and rates reuse the TMHP program-wide baseline (tmppmCodeGrid/mcoUnverifiedRates) already shipped and cited for the other 8 TX MCO guides in vob/texas.ts, with plan-specific facts pulled only from each plan\'s own documents already cited in src/data/payers/texas.ts. Two genuine plan-specific contradictions of the shared "not on Texas\'s billable ABA code set" finding were confirmed and shipped as-is rather than collapsed to the state default: Parkland Community Health Plan\'s own PA Requirements list (eff. 9/1/2025) explicitly names 97152 and 97157 under "Applied Behavior Analysis" (new pchpPaListCode() override, mirroring the existing driscollPortalCode() pattern). Two behavioral-health insourcing transitions are recorded as current-state facts: BCBSTX Medicaid insourced BH from Magellan in 2024 (bhCarveOut.administrator: \'none\', with the historical Magellan reference flagged stale); Parkland insourced BH from Carelon effective 9/1/2025 (same treatment). FirstCare\'s Medicaid plans are flagged as winding down (FirstCare\'s own site: "plans end 8/31/2026, subject to regulatory approval") in edi.verifyVia and codeGrid notes. EDI payerId fields for all 6 new TX guides ship the literal \'unverified\' with verifyVia notes — no pVerify/Availity/Change Healthcare payer-list entry could be independently confirmed this pass for these 6 specific plans (as opposed to a same-named commercial affiliate or an ambiguous multi-entry match); Texas\'s already-established centralized TMHP 270/271 architecture (medicaid271Notes on texas-medicaid) still applies to all 6 as Medicaid MCOs, but a distinct clearinghouse-side payer ID per plan was not confirmed. ' +
      "NATIONAL (new src/data/payers/vob/national.ts, spread into vob/index.ts as nationalVob): aetna, cigna, unitedhealthcare-optum ship Layers 1+3 only, no rates (\"do not attempt commercial rates\" per docs/vob-build.md). EDI payer IDs reuse the generic national pVerify/Availity/Change Healthcare codes already established (and labeled generic, not state-specific) in vob/texas.ts's commercial entries: Aetna 00001/60054, Cigna 00004/62308, UnitedHealthcare 00192/87726. bhCarveOut fields reuse vob/carveouts.ts's Layer 6 'US' rows directly: Cigna -> Evernorth Behavioral Health (62308, no second EDI hop, confirmed identical in 18 of 19 states' guides) ships verified; Aetna ships fully unverified (no BH administrator named in any of the 19 states researched); UnitedHealthcare/Optum deliberately has no national default in carveouts.ts (payer ID and administered-on side genuinely vary by state — 87726 in FL/NC vs. UHG007 in NY, unresolved against each other) and ships administratorPayerId 'unverified' rather than picking one state's value. codeGrid unitCap/posAllowed ship 'plan-dependent' (not 'unverified') for most codes — a national commercial guide spans fully-insured and self-funded/ERISA plans across every state mandate, and none of the three clinical policies (CPB 0554/0648, EN0499, Optum's ABA Supplemental Clinical Criteria + Reimbursement Policy 2022RP501A) state a universal unit/session structure, so 'plan-dependent' reflects plan variation rather than a research gap. Where a national policy DOES state a concrete figure, it ships with its own fieldStatus instead: Aetna's per-code telehealth list (97151/97153/97155/97156/97157 covered, 97152 excluded, GT/95/FR modifiers) and Cigna's \"all ABA CPT codes are covered telehealth services\" both ship verified; Optum's cluster-based max-daily-unit and modifier-tier figures (Reimbursement Policy 2022RP501A) are quoted in codeGrid notes but the formal unitCap field still ships 'plan-dependent' per the same national-variation reasoning. 99366 ships 'unverified' for all 3 national guides — none of the three source documents address interdisciplinary team-meeting billing. Cigna's codeGrid reuses the QA correction already recorded in vob/texas.ts: EN0499 does not actually state a per-code PA distinction between assessment and treatment codes despite the base guide's prose describing one, so paRequired ships 'unverified' per code rather than re-asserting the un-sourced claim.",
    guides: [
      'community-health-choice-texas',
      'bcbs-texas-medicaid',
      'cook-childrens-health-plan',
      'parkland-community-health-plan',
      'el-paso-health',
      'firstcare-health-plans',
      'aetna',
      'cigna',
      'unitedhealthcare-optum',
    ],
    details: [
      {
        slug: 'parkland-community-health-plan',
        field: 'codeGrid.97152 / codeGrid.97157',
        change:
          "PCHP's own PA Requirements list (eff. 9/1/2025) explicitly names 97152 and 97157 under \"Applied Behavior Analysis\" — a plan-specific exception to the shared statewide \"not on Texas's billable ABA code set\" finding, shipped as its own override (pchpPaListCode()) rather than collapsed to the state default, the same treatment already given to Driscoll's 97152/97157 override.",
        sourceUrl: 'https://providers.parklandhealthplan.com/Uploads/Public/Documents/Provider/PCHP%202025%20Prior%20Authorization%20Requirements%20v2.pdf',
      },
      {
        slug: 'bcbs-texas-medicaid',
        field: 'edi.bhCarveOut.administrator',
        change:
          "BCBSTX Medicaid carved Medicaid behavioral health out to Magellan as recently as mid-2023; BCBSTX announced \"insourcing\" of Medicaid behavioral health on 5/10/2024, and every current-generation document found (PA checklist rev. 4/26/2024, Sept. 2024 UM training) routes ABA to BCBSTX's own BH intake fax/Availity with no Magellan reference — shipped 'none' for the current state, with the historical Magellan relationship flagged as superseded rather than silently dropped.",
        sourceUrl: 'https://www.bcbstx.com/provider/medicaid/education-and-reference/news/2024/05-10-2024-md-behavioral-health-aba-forms',
      },
      {
        slug: 'parkland-community-health-plan',
        field: 'edi.bhCarveOut.administrator',
        change:
          "PCHP transitioned behavioral health administration from Carelon Behavioral Health to direct in-house administration effective 9/1/2025 — providers who had contracted with Carelon for PCHP's BH network had to re-contract directly with PCHP. Shipped 'none' for the current state; PCHP's own 218-page provider manual (last revised Sept. 2024) still describes a Carelon relationship and is treated as materially out of date for BH/ABA per PCHP's own transition announcement.",
        sourceUrl: 'https://parklandhealthplan.com/living-well/blog/articles/pchp-benefits-update-changes-to-behavioral-health-services/',
      },
      {
        slug: 'firstcare-health-plans',
        field: 'edi',
        change:
          "FirstCare's own site states its Texas Medicaid plans \"end on Aug. 31, 2026, subject to regulatory approval\" — flagged in edi.verifyVia and codeGrid notes rather than treated as a stable long-term payer relationship; confirm current enrollment/transition status before onboarding new cases.",
        sourceUrl: 'https://www.firstcare.com/en/Individuals-and-Families/STAR-CHIP/STAR-Medicaid',
      },
      {
        slug: 'unitedhealthcare-optum',
        field: 'edi.bhCarveOut.administratorPayerId',
        change:
          "No national default payer ID is asserted — vob/carveouts.ts already flags 87726 (FL/NC) vs. UHG007 (NY) as an unresolved cross-file inconsistency for what both describe as the same UHC-Optum commercial arrangement; the national guide ships 'unverified' rather than picking one state's value as a default.",
        sourceUrl: 'https://public.providerexpress.com/content/ope-provexpr/us/en/clinical-resources/autismABA2/abaCAMediCal12.html',
      },
      {
        slug: 'cigna',
        field: 'codeGrid.paRequired',
        change:
          "Reused the QA correction already recorded in vob/texas.ts's cigna-texas entry: EN0499, re-read in full, contains no per-code prior-authorization distinction between assessment and treatment codes, despite src/data/payers/national.ts's own prose describing one — paRequired ships 'unverified' per code at the national-guide level rather than re-asserting the un-sourced claim.",
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'correction',
    summary:
      "EDI payer-ID follow-up for the 6 new Texas MCO guides shipped in the prior entry: their edi.payerId fields, shipped 'unverified' pending research, are now populated (or explicitly confirmed absent) against pVerify's payer-list page, Availity's master payer list (downloaded and grep-verified directly), and Optum's official Real-Time (270/271) Eligibility Payer List (also downloaded and grep-verified directly). Community Health Choice: pVerify 01071, Availity 48145 — Change Healthcare ships an explicit unresolved conflict (60495 per CHC's own EDI page vs. 48145 per Optum's eligibility list) rather than picking one. BCBS Texas Medicaid: two distinct pVerify codes confirmed (01017 STAR/CHIP, 01352 STAR Kids) — genuinely different from the single combined Availity code (66002, sourced from BCBSTX's own site, not independently found in Availity's own master list) and Optum's HCSVC (labeled STAR/CHIP scope only, STAR Kids coverage under it unconfirmed). Cook Children's Health Plan: pVerify 01077 (no CHIP/STAR split); Availity CCHP1 (CHIP) / CCHP9 (STAR, STAR Kids), cross-validated by the plan's own EDI page. Parkland Community Health Plan: confirmed absent from pVerify; Availity AND Change Healthcare both confirm 66917 (three independent sources agreeing exactly — the strongest cross-validation in this set), with a legacy 'Schaller Anderson Parkland Community PRCHP' alias flagged as likely deprecated but not fully confirmed dead. El Paso Health: pVerify's only entry (00796) is explicitly CHIP-scoped; Availity splits into 5 line-of-business-specific codes (EPF02 STAR/STAR+PLUS, EPF03 CHIP, EPF37 Healthcare Options, EPF10/EPF11 Preferred Administrators), all independently confirmed by the plan's own payer-ID PDF; Change Healthcare/Optum ships a verified absence (the plan's own documentation states its clearinghouse relationship is Availity + TriZetto only). FirstCare Health Plans: pVerify 01105 (generic, no Medicaid split); Availity distinguishes 94998 (Medicaid) from 94999 (general/commercial) — and a materially more important fact surfaced during this research: TMHP (7/17/2026) and Texas HHS (7/21/2026) both confirmed Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026 (TMHP will not accept claims with dates of service after 8/31/2026), upgrading the prior entry's softer 'plan's own site says subject to regulatory approval' framing to a confirmed exit date across two independent state sources. pVerify's page is JS-rendered and was queried via repeated matching results rather than an independent raw-HTML grep, so its values ship fieldStatus 'inferred' throughout this correction; Availity's and Optum's master-list PDFs were downloaded and text-extracted directly, so their values ship 'verified' where a clean single match was found.",
    guides: [
      'community-health-choice-texas',
      'bcbs-texas-medicaid',
      'cook-childrens-health-plan',
      'parkland-community-health-plan',
      'el-paso-health',
      'firstcare-health-plans',
    ],
    details: [
      {
        slug: 'community-health-choice-texas',
        field: 'edi.payerId.changeHealthcare',
        change:
          "Genuine cross-source conflict shipped unresolved rather than picking one: 60495 per CHC's own EDI page (names Change Healthcare directly but doesn't specify claims- vs. eligibility-specific) vs. 48145 per Optum's official Real-Time Eligibility Payer List (a document specifically scoped to 270/271, and matching the Availity ID exactly).",
        sourceUrl: 'https://provider.communityhealthchoice.org/resources/him-hipaa/',
      },
      {
        slug: 'bcbs-texas-medicaid',
        field: 'edi.payerId.pverify',
        change:
          'Confirmed as two genuinely distinct codes, not one: 01017 for STAR/CHIP and 01352 for STAR Kids — a real per-program split at the pVerify level that does not exist at Availity (single combined 66002) or Optum (HCSVC, STAR/CHIP-scoped only).',
        sourceUrl: 'https://pverify.com/payer-list/',
      },
      {
        slug: 'parkland-community-health-plan',
        field: 'edi.payerId',
        change:
          'Availity (66917), Change Healthcare/Optum (66917), and PCHP\'s own EDI page (66917) all agree exactly — the strongest cross-validation of any payer ID in this build. A legacy alias, "Schaller Anderson Parkland Community PRCHP," appears in Optum\'s list and is flagged as likely deprecated (an earlier third-party administrator) but not dropped outright since it could not be fully confirmed dead.',
        sourceUrl: 'https://providers.parklandhealthplan.com/claims-payments/electronic-data-interchange/',
      },
      {
        slug: 'el-paso-health',
        field: 'edi.payerId.availity',
        change:
          "Not a single payer ID — El Paso Health routes 5 distinct line-of-business codes (EPF02 STAR/STAR+PLUS, EPF03 CHIP, EPF37 Healthcare Options, EPF10/EPF11 Preferred Administrators), independently confirmed by full agreement between the plan's own \"Availity/TPS Payer Identifications\" PDF and Availity's separate master payer list.",
        sourceUrl: 'https://www.elpasohealth.com/documents/EPH-PR-El-Paso-Health-Payer-Identifications---Updated-09.24.pdf',
      },
      {
        slug: 'firstcare-health-plans',
        field: 'edi / codeGrid.97151',
        change:
          "Upgraded from the prior entry's softer sourcing (FirstCare's own site: plans end 8/31/2026, \"subject to regulatory approval\") to a confirmed exit: TMHP (7/17/2026) and Texas HHS (7/21/2026) both announced Baylor Scott & White/FirstCare is exiting Texas Medicaid managed care effective 9/1/2026, with TMHP stating it will not accept claims with dates of service after 8/31/2026.",
        sourceUrl: 'https://www.tmhp.com/news/2026-07-17-baylor-scott-white-and-firstcare-health-plans-will-end-participation-texas-medicaid',
      },
    ],
    totals: { guides: 175, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'guides-added',
    summary:
      'Four guides added, plus a Florida marketplace-distinction subsection: TennCare Select (tenncare-select) — confirmed as a legally distinct PIHP contract (Edison ID 83332) from BlueCare\'s own MCO contract, both run by Volunteer State Health Plan/BCBST, serving SSI children, DCS foster youth ("SelectKids"), and IDD/CHOICES populations ("SelectCommunity"), with a verified 37,095-member CY2024 average enrollment per TennCare\'s own CMS-submitted MCPAR; Select Health Utah (select-health-utah) — written as a dual-audience guide since SelectHealth Community Care (the Medicaid ACO) is carved out to Utah Medicaid FFS same as the other 3 ACOs, while Select Health\'s commercial book runs its own Policy #630 (whose full text returned a site error at every retrieval attempt, so specific criteria beyond the live ABA Preauthorization Form are shipped as unverified rather than guessed); Baylor Scott & White / RightCare (baylor-scott-white-texas) — a genuine finding surfaced mid-research and made the guide\'s headline: RightCare is exiting Texas Medicaid managed care entirely effective 8/31/2026 per TMHP\'s own 7/17/2026 announcement, matching the wind-down already documented for its sister brand FirstCare; and Dell Children\'s Health Plan (dell-childrens-health-plan) — corrected from this change-set\'s own working assumption that the plan was newly launched: the plan\'s own provider manual confirms it has run STAR in the Travis SDA since 3/1/2012 and CHIP since 2000, so the guide describes it as established, not new. Also added a verified subsection to the sunshine-health-florida guide clarifying that Ambetter from Sunshine Health is Centene\'s ACA Marketplace brand, not Florida Medicaid — with a genuine finding worth flagging: Florida\'s autism mandate (§ 627.6686) explicitly excludes individual-market plans by its own statutory text, so Ambetter\'s ABA coverage rests on ACA/MHPAEA rules and Centene\'s CP.BH.104 clinical policy rather than the state mandate or the AHCA Medicaid Behavior Analysis policy that governs the rest of that guide.',
    guides: [
      'tenncare-select',
      'select-health-utah',
      'baylor-scott-white-texas',
      'dell-childrens-health-plan',
      'sunshine-health-florida',
    ],
    totals: { guides: 179, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      "Layer 5 fix: medical-line disambiguation from Schedule A. The plan-level `funding` field lands on " +
      "'mixed' whenever one Form 5500 filing wraps medical + dental + life etc. under the same Part II " +
      "funding-arrangement checkboxes — 70.2% of employer rows (38,013/54,141) were landing there and " +
      "degrading to 'unknown' downstream. Added `medicalFunding` ('fully-insured' | 'self-funded' | " +
      "'ambiguous' | 'unknown'), `medicalCarriers`, and `stopLoss` to every row, derived per Schedule A row " +
      "joined on ACK_ID: a health-benefit checkbox with a reported premium names the medical carrier as " +
      "fully-insured; a health checkbox with no premium is an administrative-services-only (ASO) contract " +
      "on a self-funded plan; a checkbox-less row is matched against a documented carrier-name / free-text " +
      'rule list (DENTAL, VISION, VSP, DELTA DENTAL, LIFE INSURANCE, DISABILITY, STOP LOSS, AD&D, EAP, ' +
      "CRITICAL ILLNESS, etc. — full lists in scripts/vob/build_employers.py) for ancillary lines; anything " +
      "left over resolves to 'ambiguous' with the carrier name preserved, never guessed. Re-ran against the " +
      'same DOL/EBSA EFAST2 Form 5500 + Schedule A plan-year-2024 bulk datasets (54,141 rows, >=125 ' +
      "participants, 19.88MB — unchanged from the prior Layer 5 build). New distribution: 6,083 (11.2%) " +
      "fully-insured, 44,921 (83.0%) self-funded, 2,673 (4.9%) ambiguous, 464 (0.9%) unknown — the " +
      "unresolvable 'mixed'/ambiguous share collapsed from 70.2% to 5.8%. `funding` is unchanged for " +
      'compatibility; GET /api/employers now returns the new fields per row and the `resolution` field ' +
      'explains when to prefer `medicalFunding` over `funding` for the medical benefit specifically. ' +
      'Spot-checked: WALMART and HOME DEPOT mainland plans self-funded (medicalFunding matches), with a ' +
      'Puerto Rico subsidiary plan on each correctly split out as fully-insured (Aetna / Triple-S Salud); ' +
      "DELTA AIR LINES mainland plans self-funded; SAINT FRANCIS UNIVERSITY (327 participants, UPMC Health " +
      "Plan) and SAMSONITE (1,341 participants, Blue Cross Blue Shield of Massachusetts) as fully-insured " +
      'small-mid examples.',
    totals: { guides: 179, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      'Layer 7 contacts + scripted questions: GA/NC/FL/TX/NY. vobContact populated for all 62 already-enriched guides across the two wedge-market states plus FL/TX/NY (GA 8, NC 13, FL 13, TX 12, NY 16): providerServicesPhone, hours, portal, fax, and ivrPath sourced by fetching each guide\'s provider quick-reference guide, provider manual, or contact page directly this pass — several PDFs returned binary/unreadable content to the fetch tool and were downloaded and text-extracted locally instead so every phone digit shipped was actually read, not guessed. A verified phone number was found for all 62 guides; where a fetch 403\'d, was JS-rendered, or the document simply had no contact section (e.g. several state Medicaid EDI portals already flagged blocked in docs/vob-gaps.md), the field was omitted per the "never fill with \'unverified\'" rule rather than invented — VobContact.providerServicesPhone was correspondingly made optional in types.ts. scriptedQuestions were generated (not scraped) per guide from that guide\'s OWN already-shipped edi.verifyVia keys, edi.bhCarveOut fields marked \'unverified\', stcMap fields marked \'unverified\'/\'plan-dependent\', and codeGrid fields marked \'unverified\' — 372 questions across the 62 guides (avg 6.0/guide, range 4-7); none qualified for the empty-array no-call outcome since Layer 1-3 data for these 5 states is still heavily unverified/plan-dependent across the board. No edi/stcMap/codeGrid/rates content was modified.',
    guides: [
      'georgia-medicaid', 'amerigroup-georgia', 'caresource-georgia', 'peach-state-georgia', 'anthem-bcbs-georgia', 'aetna-georgia', 'cigna-georgia', 'unitedhealthcare-georgia',
      'north-carolina-medicaid', 'healthy-blue-north-carolina', 'amerihealth-caritas-north-carolina', 'carolina-complete-health', 'unitedhealthcare-community-plan-north-carolina', 'wellcare-north-carolina', 'alliance-health-north-carolina', 'trillium-health-resources', 'vaya-health', 'partners-health-management', 'aetna-north-carolina', 'cigna-north-carolina', 'unitedhealthcare-north-carolina',
      'florida-medicaid', 'sunshine-health-florida', 'cms-health-plan-florida', 'simply-healthcare-florida', 'unitedhealthcare-community-plan-florida', 'humana-healthy-horizons-florida', 'aetna-better-health-florida', 'molina-healthcare-florida', 'community-care-plan-florida', 'florida-community-care', 'aetna-florida', 'cigna-florida', 'unitedhealthcare-florida',
      'texas-medicaid', 'superior-healthplan-texas', 'texas-childrens-health-plan', 'wellpoint-texas', 'unitedhealthcare-community-plan-texas', 'aetna-better-health-texas', 'molina-healthcare-texas', 'community-first-health-plans', 'driscoll-health-plan', 'aetna-texas', 'cigna-texas', 'unitedhealthcare-texas',
      'excellus-bcbs-new-york', 'mvp-health-plan-new-york', 'cdphp-new-york', 'independent-health-new-york', 'highmark-western-new-york', 'aetna-new-york', 'cigna-new-york', 'unitedhealthcare-new-york', 'new-york-medicaid', 'fidelis-care-new-york', 'unitedhealthcare-community-plan-new-york', 'anthem-healthplus-new-york', 'healthfirst-new-york', 'metroplus-health-new-york', 'emblemhealth-new-york', 'molina-healthcare-new-york',
    ],
    totals: { guides: 179, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'correction',
    summary:
      'QA spot-check NY+CO/UT/NM/AZ/OH/MO: 163 checked, 157 confirmed, 0 corrected, 2 downgraded. ' +
      'Adversarial re-verification of the VOB edi/codeGrid/rates \'verified\' fields across seven state files — each state\'s state-Medicaid guide plus two other guides chosen at random, every cited primary source re-opened and re-read (binary PDF/xlsx/docx sources downloaded and text-extracted directly rather than trusted on faith). Guides audited: NY (new-york-medicaid, highmark-western-new-york, molina-healthcare-new-york); CO (colorado-medicaid, cigna-colorado, unitedhealthcare-colorado); UT (utah-medicaid, cigna-utah, unitedhealthcare-utah); NM (new-mexico-medicaid, presbyterian-health-plan-new-mexico, cigna-new-mexico); AZ (arizona-ahcccs, arizona-complete-health, cigna-arizona); OH (ohio-medicaid, caresource-ohio, cigna-ohio); MO (missouri-medicaid, cigna-missouri, unitedhealthcare-missouri). ' +
      'The corpus held up: 157 fields CONFIRMED verbatim against their source (rates re-derived from the raw fee-schedule files in NY/CO/UT/AZ/OH/MO, Ohio\'s draft-rule rate table matched to the cent, NY\'s Highmark telehealth code set matched character-by-character), 0 REFUTED. Four fields were UNREACHABLE (not defects, left unchanged): CO\'s three bhCarveOut fields rest on Colorado PM 25-005, which hard-403s automated fetches, and AZ\'s arizona-ahcccs changeHealthcare \'AZMCD\' cites only the Optum homepage, which carries no payer directory. Two MISCITED citations were caught and downgraded to \'unverified\' with a verifyVia note (value strings left intact, nothing invented): arizona-ahcccs medicaid271Notes.mcoCarrierCodes and cigna-utah\'s assessment-code paRequired.',
    guides: ['arizona-ahcccs', 'cigna-utah'],
    details: [
      {
        slug: 'arizona-ahcccs',
        field: 'edi.medicaid271Notes.mcoCarrierCodes',
        change:
          'MISCITED -> downgraded verified to unverified. Re-fetch of the AHCCCS 5010A 270/271 Companion Guide (v4.0) confirmed 7 of the 9 shipped 6-digit carrier codes in its worked 271 examples, but 999998 (AHCCCS American Indian Health Program FFS) and 008690 (FFS Temporary) appear nowhere in the document (0 hits across all 46 pp.). The segment FORMAT is confirmed; the specific per-plan codes are not fully supported by the cited guide. verifyVia expanded to enumerate the confirmed vs. absent codes and direct confirmation against a current AHCCCS carrier-code source before quoting.',
        sourceUrl: 'https://www.azahcccs.gov/Resources/Downloads/EDIchanges/AZ270_271_CG.pdf',
      },
      {
        slug: 'cigna-utah',
        field: 'codeGrid.97151/97152/0362T.paRequired',
        change:
          'MISCITED -> downgraded verified to unverified on the three ABA assessment codes. EN0499 as fetched publishes only medical-necessity criteria and contains no \'prior authorization\'/\'precertification\' language, and never states that assessment codes are PA-exempt — so the shipped \'Not required (per EN0499)\' status is not supported by its citation. Value string left unchanged; fieldStatus.paRequired downgraded with a QA note pointing to Cigna/Evernorth precertification lists. The seven treatment codes (97153-97158, 0373T) whose PA claim IS backed by EN0499 were left untouched.',
        sourceUrl: 'https://static.cigna.com/assets/chcp/pdf/coveragePolicies/medical/en_mm_0499_coveragepositioncriteria_intensive_behavioral_interventions.pdf',
      },
    ],
    totals: { guides: 179, states: 19 },
  },
  {
    date: '2026-07-23',
    type: 'vob-enrichment',
    summary:
      "Layer 7 contacts + scripted questions: remaining 14 states (docs/vob-build.md) — vobContact added to all 104 guides across vob/{arizona,colorado,indiana,kansas,massachusetts,maryland,missouri,nebraska,new-jersey,new-mexico,ohio,tennessee,utah,virginia}.ts (GA/NC/FL/TX/NY tracked separately). Contact data was mined cheapest-first: nearly every guide's own already-cited quick-reference guides, PA forms, and provider manuals — sourced during the prior Layers 1/3/4 passes — already quoted a phone/fax/UM line verbatim in their `note` text (e.g. Ohio's Buckeye PA form, AmeriHealth Caritas BH page, Humana PAL; Kansas's Sunflower QRG; Nebraska's Molina PA page); those were reused directly rather than re-fetched. Genuine gaps (hours, portal URLs, payers with nothing in their existing sources) were filled via fresh WebFetch of the same cited documents' contact sections or a targeted WebSearch for the payer's official quick-reference/contact page — dozens of new source URLs were added this pass (Optum/Provider Express, Availity, Evernorth/Cigna BH provider-service pages, state Medicaid contact/EVS pages, MCO quick-reference guides). The high-stakes rule held throughout: a phone or fax number ships only where it was personally read in a fetched document; where no verifiable number existed (Aetna's member-ID-card-only precert routing in most states, Mercy Care Arizona, Molina Ohio's own portal-confirm hedge, several commercial UHC/Optum lines with no ABA-specific number, Arizona DDD's no-standalone-line structure), the field is omitted rather than filled with a placeholder — zero guides carry the literal 'unverified' in a phone/fax field. `VobContact.providerServicesPhone` was changed from required to optional in types.ts to make that omission representable. scriptedQuestions were generated per guide from that guide's OWN edi/stcMap/codeGrid fieldStatus/unverified markers — not templated — averaging 3.85 questions/guide (range 1–6, e.g. Ohio's cigna-ohio and aetna-ohio at 5 each vs. Kansas's cigna-kansas at 2 and the EXITED mdwise-indiana at 1); no guide came back with zero unverified fields, so none shipped an empty array. Two corrections surfaced mid-pass: a genuine unterminated-string syntax error in missouri.ts's Aetna quick-reference source (mismatched quote delimiters) was caught by `tsc -b` (the project-references build tsc invokes) and fixed, and WellSense Massachusetts's own current Quick Reference Guide still lists Carelon as the BH/ABA contact — in tension with this corpus's existing '(WellSense insourced ABA 1/1/2026)' claim — flagged as that guide's lead scripted question rather than silently overwritten. QA spot-check (Layer 9): re-opened the cited source for kansas-medicaid (KMAP companion guide contact section), ohio-medicaid (ODM PNM Contact Us page), and new-jersey-medicaid (DMAHS BH Integration Points of Contact PDF) — all three vobContact phone numbers matched the re-fetched documents verbatim.",
    guides: [
      'aetna-arizona', 'arizona-ahcccs', 'arizona-complete-health', 'arizona-ddd', 'banner-university-family-care', 'cigna-arizona', 'health-choice-arizona', 'mercy-care-arizona', 'molina-healthcare-arizona', 'unitedhealthcare-arizona', 'unitedhealthcare-community-plan-arizona',
      'aetna-colorado', 'cigna-colorado', 'colorado-medicaid', 'unitedhealthcare-colorado',
      'aetna-indiana', 'anthem-indiana-medicaid', 'caresource-indiana', 'cigna-indiana', 'indiana-medicaid', 'mdwise-indiana', 'mhs-indiana', 'unitedhealthcare-community-plan-indiana', 'unitedhealthcare-indiana',
      'aetna-kansas', 'cigna-kansas', 'healthy-blue-kansas', 'kansas-medicaid', 'sunflower-health-plan-kansas', 'unitedhealthcare-community-plan-kansas', 'unitedhealthcare-kansas',
      'aetna-massachusetts', 'cigna-massachusetts', 'fallon-health-massachusetts', 'health-new-england-massachusetts', 'mass-general-brigham-health-plan', 'masshealth-massachusetts-medicaid', 'mbhp-massachusetts', 'tufts-health-together', 'unitedhealthcare-massachusetts', 'wellsense-massachusetts',
      'aetna-maryland', 'cigna-maryland', 'maryland-medicaid', 'unitedhealthcare-maryland',
      'aetna-missouri', 'cigna-missouri', 'missouri-medicaid', 'unitedhealthcare-missouri',
      'aetna-nebraska', 'cigna-nebraska', 'molina-healthcare-nebraska', 'nebraska-medicaid', 'nebraska-total-care', 'unitedhealthcare-community-plan-nebraska', 'unitedhealthcare-nebraska',
      'aetna-better-health-new-jersey', 'aetna-new-jersey', 'cigna-new-jersey', 'fidelis-care-new-jersey', 'horizon-nj-health', 'new-jersey-medicaid', 'unitedhealthcare-community-plan-new-jersey', 'unitedhealthcare-new-jersey', 'wellpoint-new-jersey',
      'aetna-new-mexico', 'blue-cross-blue-shield-new-mexico', 'cigna-new-mexico', 'molina-healthcare-new-mexico', 'new-mexico-medicaid', 'presbyterian-health-plan-new-mexico', 'unitedhealthcare-community-plan-new-mexico', 'unitedhealthcare-new-mexico',
      'aetna-ohio', 'amerihealth-caritas-ohio', 'anthem-ohio-medicaid', 'buckeye-health-plan', 'caresource-ohio', 'cigna-ohio', 'humana-healthy-horizons-ohio', 'molina-healthcare-ohio', 'ohio-medicaid', 'unitedhealthcare-community-plan-ohio', 'unitedhealthcare-ohio',
      'aetna-tennessee', 'bluecare-tennessee', 'cigna-tennessee', 'tenncare-tennessee-medicaid', 'unitedhealthcare-community-plan-tennessee', 'unitedhealthcare-tennessee', 'wellpoint-tennessee',
      'aetna-utah', 'cigna-utah', 'unitedhealthcare-utah', 'utah-medicaid',
      'aetna-better-health-virginia', 'aetna-virginia', 'anthem-healthkeepers-plus', 'cigna-virginia', 'humana-healthy-horizons-virginia', 'sentara-community-plan', 'unitedhealthcare-community-plan-virginia', 'unitedhealthcare-virginia', 'virginia-medicaid',
    ],
    totals: { guides: 179, states: 19 },
  },
];
