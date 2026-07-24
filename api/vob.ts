import { createHash } from 'node:crypto';
import { payers } from '../src/data/payers/index.js';
import { vob } from '../src/data/payers/vob/index.js';
import { CARVEOUTS } from '../src/data/payers/vob/carveouts.js';

/* ================================================================
   POST /api/vob — instant Verification of Benefits.

   Takes a PVerify-shaped eligibility payload and returns the instant
   VOB the Carelu directory can produce with no phone call: payer
   resolution, EDI routing (+ carve-out hop), benefit interpretation
   of the 271 blocks, code-level coverage/PA, Medicaid rates, and the
   residual open questions + call plan for whatever the wire can't
   answer. This is the standalone twin of the LeadTrap /api/vob
   backend — same Carelu data, deployable on Vercel for integration
   testing. It does NOT place calls (that's the LeadTrap backend).

   Auth: Authorization: Bearer <VOB_API_KEY>.
   ================================================================ */

interface StcBlock {
  stc?: string;
  active?: boolean | null;
  copay?: number | null;
  coinsurance?: number | null;
  deductible?: number | null;
  deductibleMet?: number | null;
  oopMax?: number | null;
  oopMet?: number | null;
  network?: string | null;
}
interface VobRequest {
  member?: { name?: string; memberId?: string; dob?: string; groupNumber?: string };
  payer271?: {
    payerName?: string;
    payerId?: string;
    state?: string;
    stcBlocks?: StcBlock[];
    eligibilityActive?: boolean | null;
  };
  employer?: { name?: string };
  practice?: { name?: string; npi?: string; tin?: string; callbackNumber?: string };
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'authorization, content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
  'content-type': 'application/json; charset=utf-8',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body, null, 1), { status, headers: { ...CORS, 'cache-control': 'no-store' } });

const known = (v: unknown): v is string =>
  typeof v === 'string' && v !== '' && v !== 'unverified' && !v.toLowerCase().startsWith('unverified') && v !== 'plan-dependent';

// A cost-share block "answers" a benefit when it states active status (+ at
// least one cost-share figure when active).
const blockResolves = (b: StcBlock | undefined): boolean => {
  if (!b || b.active == null) return false;
  if (b.active === false) return true;
  return b.copay != null || b.coinsurance != null || b.deductible != null || b.oopMax != null;
};

// Resolve a 271 payer/plan to a guide slug: match on a known EDI payer ID
// first, then on payer-name token overlap. Prefer a state-scoped guide over a
// national one when both match.
function resolveSlug(payerName: string, payerId: string | undefined, state: string | undefined): string | null {
  const all = Object.values(payers) as Array<{ slug: string; payer: string; state?: string; kind?: string }>;
  const inScope = all.filter((g) => !state || g.state === state || g.state === 'US');
  const pool = inScope.length ? inScope : all;

  if (payerId) {
    for (const g of pool) {
      const ids = (vob[g.slug] as { edi?: { payerId?: Record<string, string> } } | undefined)?.edi?.payerId ?? {};
      if (Object.values(ids).some((v) => v && known(v) && v === payerId)) {
        return preferState(pool, g, state);
      }
    }
  }
  const nameToks = new Set(payerName.toLowerCase().replace(/[()]/g, ' ').split(/\s+/).filter(Boolean));
  let best: { slug: string; state?: string } | null = null;
  let score = 0;
  for (const g of pool) {
    const gToks = new Set(g.payer.toLowerCase().replace(/[()]/g, ' ').split(/\s+/));
    const s = [...gToks].filter((t) => nameToks.has(t)).length;
    if (s > score || (s === score && s > 0 && g.state === state && best?.state !== state)) {
      best = g;
      score = s;
    }
  }
  return score > 0 && best ? best.slug : null;
}
function preferState<T extends { slug: string; state?: string; payer: string }>(pool: T[], hit: T, state: string | undefined): string {
  if (!state || hit.state === state) return hit.slug;
  const stateTwin = pool.find((g) => g.state === state && g.payer === hit.payer);
  return stateTwin ? stateTwin.slug : hit.slug;
}

async function employerFunding(name: string, origin: string): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(`${origin}/api/employers?q=${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const d = (await r.json()) as { matches?: Array<Record<string, unknown>> };
    return d.matches?.[0] ?? { funding: 'unknown', note: 'no Form 5500 match — funding unknown, not fully-insured' };
  } catch {
    return null;
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: Request): Promise<Response> {
  const key = process.env.VOB_API_KEY;
  if (!key) return json({ error: 'VOB API not configured (missing VOB_API_KEY)' }, 503);
  const auth = request.headers.get('authorization') ?? '';
  const bearer = auth.replace(/^Bearer\s+/i, '');
  // constant-time compare
  const ok =
    bearer.length === key.length &&
    createHash('sha256').update(bearer).digest('hex') === createHash('sha256').update(key).digest('hex');
  if (!ok) return json({ error: 'unauthorized' }, 401);

  let body: VobRequest;
  try {
    body = (await request.json()) as VobRequest;
  } catch {
    return json({ error: 'bad request body' }, 400);
  }
  const p271 = body.payer271 ?? {};
  if (!p271.payerName && !p271.payerId) return json({ error: 'payer271.payerName or payer271.payerId is required' }, 400);

  const slug = resolveSlug(p271.payerName ?? '', p271.payerId, p271.state);
  if (!slug) {
    return json({
      status: 'UNRESOLVED_PAYER',
      message: `Could not match "${p271.payerName ?? p271.payerId}"${p271.state ? ` in ${p271.state}` : ''} to a directory guide.`,
      hint: 'Check the payer name/state, or the payer may not be covered yet. See https://www.carelu.com/api/payers',
    });
  }

  const guide = payers[slug] as {
    slug: string;
    payer: string;
    state?: string;
    kind?: string;
    family?: string;
  };
  const gv = (vob[slug] ?? {}) as {
    edi?: {
      payerId?: Record<string, string>;
      supportsRealtime?: unknown;
      bhCarveOut?: { administrator?: string; administratorPayerId?: string; abaRidesOn?: string; twoHopRequired?: unknown };
      medicaid271Notes?: unknown;
    };
    stcMap?: Record<string, unknown>;
    codeGrid?: Record<string, { covered?: string; paRequired?: string; unitCap?: string; notes?: string }>;
    rates?: { source?: string; effectiveDate?: string; byCode?: Record<string, unknown> };
    vobContact?: { providerServicesPhone?: string; hours?: string; ivrPath?: string; scriptedQuestions?: string[] };
  };

  const blockByStc = new Map<string, StcBlock>();
  for (const b of p271.stcBlocks ?? []) {
    const s = (b.stc ?? '').trim().toUpperCase();
    if (s) blockByStc.set(s, b);
  }

  // ── Routing (with carve-out hop) ──────────────────────────────
  const carve = gv.edi?.bhCarveOut;
  let carveOut: Record<string, unknown> | null = null;
  if (carve && carve.administrator && carve.administrator.toLowerCase() !== 'none') {
    carveOut = { ...carve };
  } else if (guide.family) {
    const row = CARVEOUTS.find(
      (c: { family: string; state: string; lineOfBusiness: string; administrator: string; administratorPayerId: string; abaAdministeredOn: string }) =>
        c.family === guide.family && (c.state === guide.state || c.state === 'US'),
    );
    if (row) carveOut = { administrator: row.administrator, administratorPayerId: row.administratorPayerId, abaAdministeredOn: row.abaAdministeredOn };
  }
  const routing = { ediPayerId: gv.edi?.payerId ?? { requested: p271.payerId ?? null }, carveOut };

  // ── Benefit interpretation (stcMap is one ABA record) ─────────
  const stc = gv.stcMap ?? {};
  const bucket = known(stc.abaBenefitBucket) ? (stc.abaBenefitBucket as string).toUpperCase() : null;
  const block = (bucket ? blockByStc.get(bucket) : undefined) ?? blockByStc.get('30');
  const interpretationVerified = known(stc.copayUnit) && known(stc.deductibleAppliesToAba);
  const benefit = {
    abaBenefitBucket: bucket ?? 'unverified',
    interpretationVerified,
    copayUnit: stc.copayUnit ?? null,
    deductibleAppliesToAba: stc.deductibleAppliesToAba ?? null,
    quality271Score: stc.quality271Score ?? null,
    from271: block
      ? { active: block.active ?? null, copay: block.copay ?? null, coinsurance: block.coinsurance ?? null, deductible: block.deductible ?? null, oopMax: block.oopMax ?? null }
      : null,
    resolved: blockResolves(block) && interpretationVerified,
  };

  // ── Coverage / PA per code (correct field: paRequired) ────────
  const coverage = Object.entries(gv.codeGrid ?? {}).map(([code, e]) => ({
    code,
    covered: e.covered ?? null,
    priorAuth: e.paRequired ?? null,
    priorAuthKnown: known(e.paRequired),
    unitCap: e.unitCap ?? null,
    notes: e.notes ?? null,
  }));

  const rates = gv.rates?.byCode ? { source: gv.rates.source, effectiveDate: gv.rates.effectiveDate, byCode: gv.rates.byCode } : null;

  // ── Gating: what still needs a live call ──────────────────────
  const openQuestions: string[] = [];
  if (p271.eligibilityActive !== true) openQuestions.push('Confirm the member’s eligibility is active for the current plan year.');
  if (!benefit.resolved) {
    openQuestions.push(
      bucket
        ? `Verify the ABA cost share on the ${bucket} benefit: copay or coinsurance, charged per visit or per day, and whether the deductible applies.`
        : 'Verify the member’s behavioral-health / ABA benefits (directory could not confirm which 271 block carries ABA cost share).',
    );
  }
  if (carveOut && carve?.twoHopRequired === true) {
    openQuestions.push(`Confirm ABA is administered by ${carveOut.administrator} and verify benefits on that line (payer ID ${carveOut.administratorPayerId ?? 'unknown'}).`);
  }
  const paUnknown = coverage.filter((c) => !c.priorAuthKnown).map((c) => c.code);
  if (paUnknown.length) {
    openQuestions.push(
      paUnknown.length === coverage.length && coverage.length > 1
        ? 'Confirm which ABA codes require prior authorization (assessment vs treatment codes).'
        : `Confirm whether prior authorization is required for: ${paUnknown.join(', ')}.`,
    );
  }

  let employer: Record<string, unknown> | null = null;
  if (body.employer?.name) employer = await employerFunding(body.employer.name, new URL(request.url).origin);

  const gatingResolved = openQuestions.length === 0;
  const contact = gv.vobContact;
  return json({
    status: gatingResolved ? 'INSTANT_COMPLETE' : 'CALL_NEEDED',
    resolvedPayer: { slug, name: guide.payer, state: guide.state, kind: guide.kind, web: `https://www.carelu.com/payers/${slug}` },
    eligibility: { active: p271.eligibilityActive ?? null },
    routing,
    benefit,
    coverage,
    rates,
    employer,
    openQuestions,
    gatingResolved,
    callPlan: gatingResolved
      ? null
      : {
          phone: carveOut?.administratorPayerId && carve?.twoHopRequired ? contact?.providerServicesPhone : contact?.providerServicesPhone,
          callThe: carveOut?.administrator ?? guide.payer,
          hours: contact?.hours ?? null,
          scriptedQuestions: contact?.scriptedQuestions ?? openQuestions,
        },
    disclaimer: 'Instant VOB from the Carelu directory. Fields marked unresolved need a provider-services call; verify against the payer for any specific member.',
  });
}
