/* ================================================================
   VOB ENRICHMENT — shared types (see docs/vob-build.md).
   These layers turn a 270/271 eligibility response + the payer
   directory into an instant verification of benefits. Data lives in
   one file per state (vob/<state>.ts), merged in vob/index.ts, and
   is served nested under `vob` on /api/payers/:slug.

   Editorial rules (non-negotiable, from the build spec):
   - Primary sources only; every fact carries sourceUrl + accessDate.
   - Never guess: unverifiable values are the literal 'unverified'
     with a verifyVia note. fieldStatus distinguishes verified /
     inferred / unverified per field.
   ================================================================ */

export type FieldStatus = 'verified' | 'inferred' | 'unverified' | 'plan-dependent';

export interface SourceRef {
  url: string;
  accessDate: string; // YYYY-MM-DD
  note?: string;
  staleRisk?: boolean; // source document older than 18 months
}

/* Layer 1 — EDI routing crosswalk */
export interface EdiRouting {
  payerId: { pverify?: string; availity?: string; changeHealthcare?: string };
  supports270271: boolean | 'unverified';
  supportsRealtime: boolean | 'unverified';
  bhCarveOut: {
    administrator: string; // Evernorth, Carelon, Optum BH, Magellan, 'none', ...
    administratorPayerId: string;
    abaRidesOn: 'medical' | 'bh' | 'either' | 'unverified';
    twoHopRequired: boolean | 'unverified';
  };
  medicaid271Notes?: {
    // state-medicaid guides only
    mcoSegmentLocation: string; // loop/segment carrying MCO enrollment in the 271
    mcoCarrierCodes: Record<string, string>; // carrier code -> MCO name
    eligibilitySpanGranularity: string; // monthly / daily / real-time
  };
  fieldStatus?: Record<string, FieldStatus>;
  verifyVia?: Record<string, string>; // field -> portal/phone/document to confirm
  sources: SourceRef[];
}

/* Layer 2 — service-type-code interpretation map */
export interface StcMap {
  abaBenefitBucket: string; // STC the payer returns ABA cost share under: 30, MH, A4, A6, ...
  deductibleAppliesToAba: 'yes' | 'no' | 'plan-dependent' | 'unverified';
  costShareType: 'copay' | 'coinsurance' | 'plan-dependent' | 'unverified';
  copayUnit: 'per-visit' | 'per-day' | 'plan-dependent' | 'unverified';
  oopMaxApplies: boolean | 'unverified';
  quality271Score: 'high' | 'medium' | 'low' | 'unverified';
  fieldStatus?: Record<string, FieldStatus>;
  verifyVia?: Record<string, string>;
  sources: SourceRef[];
}

/* Layer 3 — code-level coverage grid. Keyed by the state's ACTUAL billable
   code set (CPT 97151-97158/0362T/0373T, 99366 where covered, or H-codes /
   state-specific sets) — never force the CPT list. */
export interface CodeGridEntry {
  covered: string;
  paRequired: string;
  unitCap: string;
  capPeriod: string;
  posAllowed: string[]; // home/office/school/telehealth (+POS numbers where specified)
  telehealth: string;
  modifiers: string[]; // HN/HO/HM/HP tiers, GT/95, plan quirks
  notes?: string;
  fieldStatus?: Record<string, FieldStatus>;
  sources?: SourceRef[];
}

/* Layer 4 — Medicaid rate tables (never commercial: contract-specific) */
export interface RateTable {
  source: string;
  effectiveDate: string;
  byCode: Record<string, { rate: string; unit: string; modifierTiers?: Record<string, string> }>;
  sources?: SourceRef[];
}

/* Layer 7 — contact & channel layer for the residual scripted-call path */
export interface VobContact {
  // Omitted (not 'unverified') when no fetched primary source confirmed a
  // number — phone numbers are high-stakes; never guess or fill a placeholder.
  providerServicesPhone?: string;
  ivrPath?: string;
  hours?: string;
  portal?: { name: string; url: string };
  fax?: string;
  // Generated, not scraped: only the fields this guide marks
  // unverified/plan-dependent — the call asks 3 questions, not 30.
  scriptedQuestions: string[];
  sources?: SourceRef[];
}

/* Per-guide VOB extension, keyed by guide slug in vob/index.ts. */
export interface VobExtension {
  edi?: EdiRouting;
  stcMap?: StcMap;
  codeGrid?: Record<string, CodeGridEntry>;
  rates?: RateTable;
  vobContact?: VobContact;
  lastUpdated: string; // YYYY-MM-DD of the change-set that last touched this
}

/* Layer 6 — carve-out map row (dataset in vob/carveouts.ts) */
export interface CarveoutRow {
  family: string; // carrier family slug (aetna, anthem, cigna, unitedhealthcare, ...)
  state: string; // 'GA' | ... | 'US' for national defaults
  lineOfBusiness: 'commercial' | 'medicaid' | 'marketplace';
  administrator: string;
  administratorPayerId: string;
  abaAdministeredOn: 'medical' | 'bh' | 'unverified';
  notes?: string;
  sources: SourceRef[];
}
