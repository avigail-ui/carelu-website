import { CARVEOUTS } from '../../src/data/payers/vob/carveouts.js';
import { jsonResponse, sha256 } from './_shared.js';

/* ================================================================
   GET /api/payers/carveouts — Layer 6 of the VOB enrichment build
   (docs/vob-build.md): carrier family x state x line of business ->
   BH administrator + payer ID + which side administers ABA, for
   hop-2 eligibility routing. (Static filename beats the [slug]
   dynamic route, so this path never collides with a guide.)
   ================================================================ */

export async function GET(request: Request): Promise<Response> {
  const etag = sha256(JSON.stringify(CARVEOUTS));
  const body = {
    docs: 'Rows map carrier family + state + line of business to the BH administrator that answers hop-2 eligibility. Populated from provider manuals; every row carries primary-source refs.',
    count: CARVEOUTS.length,
    entries: CARVEOUTS,
  };
  return jsonResponse(request, body, etag);
}
