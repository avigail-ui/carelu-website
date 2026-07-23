import { createHash } from 'node:crypto';
import { payers } from '../../src/data/payers/index.js';
import type { PayerConfig } from '../../src/data/payers/types.js';

/* ================================================================
   Shared helpers for the public payer-directory read API
   (/api/payers, /api/payers/:slug, /api/payers/changelog).
   Underscore-prefixed so Vercel does not turn this into a route.
   ================================================================ */

export const SITE_URL = 'https://www.carelu.com';

export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

// Deterministic guide ordering (by slug) so corpus-level JSON + hashes
// are stable across deploys unless the data actually changes.
export const sortedGuides: PayerConfig[] = Object.values(payers).sort((a, b) =>
  a.slug.localeCompare(b.slug)
);

export function guideHash(guide: PayerConfig): string {
  return sha256(JSON.stringify(guide));
}

// Hash of the deterministic JSON of ALL guides — changes iff any guide changes.
export const corpusHash = sha256(JSON.stringify(sortedGuides));

const BASE_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'content-type': 'application/json; charset=utf-8',
};

function parseIfNoneMatch(request: Request): string[] {
  const raw = request.headers.get('if-none-match');
  if (!raw) return [];
  return raw
    .split(',')
    .map((tag) => tag.trim().replace(/^W\//, '').replace(/^"(.*)"$/, '$1'))
    .filter((tag) => tag.length > 0);
}

// 200 JSON with CORS + CDN caching + ETag; honors If-None-Match with a 304.
export function jsonResponse(request: Request, body: unknown, etag: string): Response {
  const headers = {
    ...BASE_HEADERS,
    'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    etag: `"${etag}"`,
  };
  const tags = parseIfNoneMatch(request);
  if (tags.includes(etag) || tags.includes('*')) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(JSON.stringify(body), { status: 200, headers });
}

export function errorResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...BASE_HEADERS, 'cache-control': 'no-store' },
  });
}
