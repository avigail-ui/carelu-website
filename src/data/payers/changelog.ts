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
];
