/* ================================================================
   VOB enrichment data — merged per-state (see docs/vob-build.md).
   Each state ships as vob/<state>.ts exporting a
   Record<guideSlug, VobExtension>; spread it into `vob` below.
   Served nested as `vob` on /api/payers/:slug (null until a guide
   is enriched); /api/payers lists per-guide `vob: true/false`.
   ================================================================ */
export * from './types.js';
import type { VobExtension } from './types.js';
import { georgiaVob } from './georgia.js';
import { northCarolinaVob } from './north-carolina.js';
import { floridaVob } from './florida.js';

export const vob: Record<string, VobExtension> = {
  ...georgiaVob,
  ...northCarolinaVob,
  ...floridaVob,
  // ... as further states are delivered
};
