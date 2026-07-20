import Anthropic from '@anthropic-ai/sdk';
import { payers, PAYER_REVIEWED } from '../src/data/payers/index.js';

/* ================================================================
   POST /api/ask — the payer-directory chat.
   Grounded Q&A over the payer-guide corpus: retrieve the most
   relevant guide sections for the question, hand ONLY those to
   Claude, and stream back an answer that cites the primary sources.
   ================================================================ */

export const config = { maxDuration: 60 };

type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface Chunk {
  payer: string;
  state: string;
  slug: string;
  title: string;
  text: string;
  hay: string;
  sources: { title: string; url: string }[];
}

// Flatten every guide section into a retrievable chunk. Built once per
// (cold) function instance; the corpus is static per deploy.
const CHUNKS: Chunk[] = Object.values(payers).flatMap((p) => {
  const guideSources = p.sources;
  const base = [
    {
      payer: p.payer, state: p.state ?? '', slug: p.slug,
      title: 'At a glance',
      text:
        p.atGlance.map((f) => `${f.label}: ${f.value}`).join('. ') +
        (p.assessmentPA ? ` Assessment prior auth: ${p.assessmentPA}.` : '') +
        (p.treatmentPA ? ` Treatment prior auth: ${p.treatmentPA}.` : '') +
        (p.dxRequired ? ` Autism diagnosis required: ${p.dxRequired}.` : ''),
      sources: guideSources.slice(0, 2),
    },
    ...p.sections.map((s) => ({
      payer: p.payer, state: p.state ?? '', slug: p.slug,
      title: s.h2,
      text: [
        ...(s.body ?? []),
        ...(s.list ?? []).map((i) => `${i.title}: ${i.desc}`),
      ].join(' '),
      sources: (s.cites && s.cites.length > 0 ? s.cites : guideSources.slice(0, 1)),
    })),
  ];
  return base.map((c) => ({ ...c, hay: `${c.payer} ${c.state} ${c.title} ${c.text}`.toLowerCase() }));
});

const STATE_NAMES: Record<string, string> = {
  ga: 'georgia', nc: 'north carolina', in: 'indiana', va: 'virginia', tn: 'tennessee',
  oh: 'ohio', nj: 'new jersey', md: 'maryland', co: 'colorado', ut: 'utah', az: 'arizona',
  ny: 'new york', nm: 'new mexico', mo: 'missouri', tx: 'texas', ma: 'massachusetts',
  fl: 'florida', ks: 'kansas', ne: 'nebraska',
};

function retrieve(question: string, prevUser: string | undefined, limit = 14): Chunk[] {
  const q = `${prevUser ?? ''} ${question}`.toLowerCase();
  const words = Array.from(new Set(q.split(/[^a-z0-9]+/).filter((w) => w.length > 2)));
  // Expand state abbreviations so "AZ medicaid" matches "arizona".
  const stateTerms = Object.entries(STATE_NAMES)
    .filter(([abbr, name]) => q.includes(name) || new RegExp(`\\b${abbr}\\b`).test(q))
    .map(([, name]) => name);

  const scored = CHUNKS.map((c) => {
    let score = 0;
    for (const w of words) if (c.hay.includes(w)) score += 1;
    const payerLower = c.payer.toLowerCase();
    for (const w of words) if (payerLower.includes(w)) score += 4;
    for (const st of stateTerms) {
      if (c.payer.toLowerCase().includes(st) || c.hay.includes(st)) score += 3;
      if (STATE_NAMES[c.state.toLowerCase()] === st) score += 5;
    }
    return { c, score };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score);
  const picked: Chunk[] = [];
  let chars = 0;
  for (const { c } of scored) {
    if (picked.length >= limit || chars > 42000) break;
    picked.push(c);
    chars += c.text.length;
  }
  return picked;
}

const SYSTEM = `You are the Carelu ABA Payer Directory assistant, embedded on carelu.com/payers. You answer questions from ABA-provider intake and billing teams about insurance payers — prior authorization, assessment PA, diagnosis requirements, rates, reauthorization cadence, licensure, mandates.

Hard rules:
- Answer ONLY from the excerpts provided in the conversation. They come from Carelu's payer guides, each fact compiled from primary sources (payer policies, state manuals, statutes) and last reviewed ${PAYER_REVIEWED}. Never use outside knowledge for factual claims about payers, rates, or policies — if the excerpts don't contain the answer, say plainly that our directory doesn't have that verified yet and point to the closest relevant guide instead.
- Cite as you go: attach a markdown link to the primary source for each factual claim, e.g. "PA is required for the assessment ([GA DCH ASD Manual](url))". Use the source URLs given with each excerpt. At the end, add a "Read more:" line linking the most relevant guide page(s) using their site paths, e.g. [Georgia Medicaid guide](/payers/georgia-medicaid).
- Be concise and operational — answer the question directly in the first sentence, then only the detail an intake operator needs. Prefer short paragraphs over lists unless comparing several payers.
- Every answer ends with a one-line reminder that policies change and to verify against the payer's live policy for the specific member.
- If the question is not about ABA payers/insurance/intake (or asks for legal, clinical, or billing advice beyond general information), decline briefly and steer back to payer questions.
- Never invent payer names, policy numbers, dollar amounts, or URLs.`;

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'not configured' }), { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m): m is ChatMessage => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
    .slice(-8)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  const last = history[history.length - 1];
  if (!last || last.role !== 'user' || last.content.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'no question' }), { status: 400 });
  }
  if (last.content.length > 1000) {
    return new Response(JSON.stringify({ error: 'question too long' }), { status: 400 });
  }

  const prevUser = history.filter((m) => m.role === 'user').slice(-2, -1)[0]?.content;
  const chunks = retrieve(last.content, prevUser);

  const excerpts = chunks.length === 0
    ? 'No relevant excerpts found for this question.'
    : chunks.map((c, i) =>
        `[Excerpt ${i + 1}] ${c.payer}${c.state ? ` (${c.state})` : ''} — ${c.title}\nGuide page: /payers/${c.slug}\nSources: ${c.sources.map((s) => `${s.title} <${s.url}>`).join(' | ')}\n${c.text}`
      ).join('\n\n');

  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    ...history.slice(0, -1),
    {
      role: 'user',
      content: `<excerpts>\n${excerpts}\n</excerpts>\n\nQuestion: ${last.content}`,
    },
  ];

  const stream = client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 1500,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'low' },
    system: SYSTEM,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on('text', (delta) => controller.enqueue(encoder.encode(delta)));
      stream.on('error', (err) => {
        controller.enqueue(encoder.encode('\n\nSorry — something went wrong generating this answer. Please try again.'));
        console.error('ask stream error', err);
        controller.close();
      });
      stream.on('end', () => controller.close());
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
