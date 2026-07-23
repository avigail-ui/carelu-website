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
];
