/* ================================================================
   Layer 8 — schemas ONLY. These are intentionally defined and NOT
   populated in the directory (see docs/vob-build.md):

   - GroupOverride rows come later from client historical records and
     live call write-backs. Do NOT ingest client documents or member
     data into this repo — that ingestion path has a separate
     compliance review before it opens.
   - ClientNetworkStatus is per-practice config, populated at client
     onboarding from contract lists, never scraped.
   ================================================================ */

export interface GroupOverride {
  payerId: string;
  groupNumber: string;
  funding: 'self-funded' | 'fully-insured' | 'unknown';
  abaCovered: boolean | 'unknown';
  capsHours?: string;
  capsDollars?: string;
  copayUnit?: 'per-visit' | 'per-day';
  carveOutConfirmed?: boolean;
  sourceType: 'call' | 'eob' | 'planDoc';
  refNumber?: string;
  verifiedDate: string;
  verifiedBy: string;
}

export interface ClientNetworkStatus {
  payerId: string;
  planNetwork: string;
  npi: string;
  tin: string;
  inNetwork: boolean;
  effectiveDate: string;
  contractSource: string;
}
