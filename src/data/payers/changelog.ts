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
];
