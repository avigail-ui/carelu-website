import { PAYER_REVIEWED, STATE_META } from '../../src/data/payers/index.js';
import { PAYER_CHANGELOG } from '../../src/data/payers/changelog.js';
import { SITE_URL, corpusHash, guideHash, jsonResponse, sortedGuides } from './_shared.js';

/* ================================================================
   GET /api/payers — public read-only index of the ABA payer
   directory. Lists every guide with a per-guide contentHash (and a
   corpus-level corpusHash/ETag) so consumers can detect exactly
   which guides changed without re-fetching everything.
   ================================================================ */

export async function GET(request: Request): Promise<Response> {
  const guides = sortedGuides.map((p) => ({
    slug: p.slug,
    payer: p.payer,
    state: p.state,
    kind: p.kind,
    family: p.family,
    cardDesc: p.cardDesc,
    assessmentPA: p.assessmentPA,
    treatmentPA: p.treatmentPA,
    dxRequired: p.dxRequired,
    sections: p.sections.length,
    contentHash: guideHash(p),
    web: `${SITE_URL}/payers/${p.slug}`,
    api: `/api/payers/${p.slug}`,
  }));

  const latestChange = PAYER_CHANGELOG.reduce(
    (latest, entry) => (entry.date > latest ? entry.date : latest),
    PAYER_CHANGELOG[0]?.date ?? ''
  );

  const body = {
    meta: {
      reviewed: PAYER_REVIEWED,
      counts: {
        guides: guides.length,
        states: STATE_META.length,
        policyRules: sortedGuides.reduce((n, p) => n + p.sections.length, 0),
      },
      corpusHash,
      latestChange,
      docs: 'GET /api/payers lists every ABA payer guide with content hashes (compare contentHash per guide, or the corpusHash/ETag overall, to detect changes), GET /api/payers/{slug} returns the full guide, and GET /api/payers/changelog returns the machine-readable change history.',
    },
    guides,
  };

  return jsonResponse(request, body, corpusHash);
}
