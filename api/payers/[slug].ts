import { PAYER_REVIEWED, payers } from '../../src/data/payers/index.js';
import { SITE_URL, errorResponse, guideHash, jsonResponse } from './_shared.js';

/* ================================================================
   GET /api/payers/:slug — the full PayerConfig JSON for one guide,
   plus its contentHash (compare against /api/payers to detect
   changes), canonical web/api URLs, and the review date.
   ================================================================ */

export async function GET(request: Request): Promise<Response> {
  const pathname = new URL(request.url).pathname;
  const last = pathname.split('/').filter(Boolean).pop() ?? '';
  const slug = decodeURIComponent(last);

  const guide = payers[slug];
  if (!guide) {
    return errorResponse({ error: 'unknown payer slug', see: '/api/payers' }, 404);
  }

  const contentHash = guideHash(guide);
  const body = {
    meta: { reviewed: PAYER_REVIEWED },
    contentHash,
    web: `${SITE_URL}/payers/${guide.slug}`,
    api: `/api/payers/${guide.slug}`,
    guide,
  };

  return jsonResponse(request, body, contentHash);
}
