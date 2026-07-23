import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorResponse, jsonResponse, sha256 } from './payers/_shared.js';

/* ================================================================
   GET /api/employers?q=<employer name> — Layer 5 of the VOB
   enrichment build (docs/vob-build.md): the DOL Form 5500 employer
   funding-type dataset. Splits commercial members into
   mandate-protected (fully-insured) vs. plan-document-governed
   (self-funded) BEFORE any call.

   No query -> dataset meta only (filing year, size-budget limits,
   the "absence != fully-insured" rule, government-plan notes).
   With ?q= -> top 10 name matches (same normalization used to build
   the dataset: uppercase, strip punctuation + entity suffixes,
   collapse whitespace), each with the full row, plus a `resolution`
   field explaining how to use — or not use — the result.

   Data lives in src/data/vob-employers/ (sharded alphabetically by
   scripts/vob/build_employers.py, the source of truth for refreshes)
   and is loaded once per (cold) function instance, same pattern as
   the CHUNKS corpus in api/ask.ts.
   ================================================================ */

type Funding = 'self-funded' | 'fully-insured' | 'mixed' | 'unknown';
type MedicalFunding = 'fully-insured' | 'self-funded' | 'ambiguous' | 'unknown';

interface EmployerRow {
  sponsorNameNormalized: string;
  ein: string;
  funding: Funding;
  carriers: string[];
  planYearEnd: string | null;
  participants: number;
  source: string;
  filingYear: number;
  raw?: string[];
  // Medical-line disambiguation (docs/vob-build.md Layer 5 fix): which line
  // of business the filing's Schedule A rows actually insure, so a `funding`
  // of 'mixed' (medical + dental + life etc. on one filing) resolves to a
  // specific medical-benefit read instead of degrading to 'unknown'.
  medicalFunding: MedicalFunding;
  medicalCarriers?: string[];
  stopLoss?: boolean;
}

interface DatasetIndex {
  meta: Record<string, unknown>;
  shards: { key: string; file: string; count: number; bytes: number }[];
}

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/vob-employers');

function loadJson<T>(file: string): T {
  return JSON.parse(readFileSync(path.join(DATA_DIR, file), 'utf-8')) as T;
}

const INDEX = loadJson<DatasetIndex>('index.json');
const ALL_EMPLOYERS: EmployerRow[] = INDEX.shards.flatMap((shard) => loadJson<EmployerRow[]>(shard.file));

// Must match the normalization in scripts/vob/build_employers.py exactly —
// this is the primary match key on both sides.
const SUFFIX_RE = /\b(INCORPORATED|INC|LLC|LLP|LP|CORP|CORPORATION|CO|COMPANY|LTD|LIMITED)\b\.?/g;
const PUNCT_RE = /[^\sA-Z0-9]/g;
const SPACE_RE = /\s+/g;

function normalize(raw: string): string {
  return raw
    .toUpperCase()
    .replace(PUNCT_RE, ' ')
    .replace(SUFFIX_RE, ' ')
    .replace(SPACE_RE, ' ')
    .trim();
}

const MATCH_RESOLUTION =
  'Matched Form 5500 filing(s) for this employer name — use the funding value on the matched row(s). ' +
  'An employer with multiple plans (e.g. self-funded medical + fully-insured dental/vision) can legitimately ' +
  'have rows that disagree; prefer the row for the benefit line being verified. For the MEDICAL benefit ' +
  "specifically, prefer `medicalFunding` over `funding`: `funding` is the plan-level Form 5500 Part II read " +
  "and lands on 'mixed' whenever one filing wraps medical + dental + life etc. under the same funding-" +
  "arrangement checkboxes, while `medicalFunding` is derived from which Schedule A row actually insures the " +
  "medical line — 'fully-insured' names the carrier(s) in `medicalCarriers`; 'self-funded' means every " +
  'Schedule A on the filing is either an administrative-services-only (ASO) health contract with no premium ' +
  "reported or a purely ancillary line (dental/vision/life/disability/stop-loss), so the medical benefit " +
  "itself is paid from general assets (`stopLoss: true` when a stop-loss Schedule A is present); 'ambiguous' " +
  'means a carrier on the filing could not be classified as medical or ancillary from the checkboxes or the ' +
  "name/text rule list, and its name is preserved in `medicalCarriers` rather than guessed either way.";

const NO_MATCH_RESOLUTION =
  "No Form 5500 filing matched this employer name. Absence of a match is NOT evidence of fully-insured " +
  'status — employers under ~100 participants are largely exempt from filing, and church/government plans ' +
  "never file at all. Resolve both funding and medicalFunding as 'unknown' and route to a scripted VOB call.";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const qRaw = (url.searchParams.get('q') ?? '').slice(0, 200).trim();

  if (!qRaw) {
    const etag = sha256(JSON.stringify(INDEX.meta));
    return jsonResponse(request, { meta: INDEX.meta }, etag);
  }

  const q = normalize(qRaw);
  if (!q) {
    return errorResponse({ error: 'query normalized to an empty string', q: qRaw }, 400);
  }

  const exact: EmployerRow[] = [];
  const prefix: EmployerRow[] = [];
  const contains: EmployerRow[] = [];
  for (const row of ALL_EMPLOYERS) {
    if (row.sponsorNameNormalized === q) exact.push(row);
    else if (row.sponsorNameNormalized.startsWith(q)) prefix.push(row);
    else if (row.sponsorNameNormalized.includes(q)) contains.push(row);
  }

  const matches = [...exact, ...prefix, ...contains].slice(0, 10);
  const body = {
    query: qRaw,
    normalizedQuery: q,
    count: matches.length,
    matches,
    resolution: matches.length > 0 ? MATCH_RESOLUTION : NO_MATCH_RESOLUTION,
  };

  const etag = sha256(JSON.stringify(body));
  return jsonResponse(request, body, etag);
}
