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
];
