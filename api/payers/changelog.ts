import { PAYER_CHANGELOG } from '../../src/data/payers/changelog.js';
import { jsonResponse, sha256 } from './_shared.js';

/* ================================================================
   GET /api/payers/changelog — machine-readable history of policy
   changes and directory expansion, newest-first. (Static filename
   wins over the [slug] dynamic route on Vercel, so this path is
   never shadowed.)
   ================================================================ */

export async function GET(request: Request): Promise<Response> {
  const entries = [...PAYER_CHANGELOG].sort((a, b) => b.date.localeCompare(a.date));
  const etag = sha256(JSON.stringify(entries));
  const body = {
    latest: entries[0]?.date ?? null,
    entries,
  };
  return jsonResponse(request, body, etag);
}
