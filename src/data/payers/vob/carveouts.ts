/* ================================================================
   Layer 6 — carve-out map: carrier family x state x line of business
   -> BH administrator + payer ID + which side administers ABA, so
   hop-2 eligibility routing never needs a human. Populated from
   provider manuals (see docs/vob-build.md); served at
   /api/payers/carveouts.
   ================================================================ */
import type { CarveoutRow } from './types.js';

export const CARVEOUTS: CarveoutRow[] = [];
