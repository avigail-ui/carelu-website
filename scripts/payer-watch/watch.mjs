#!/usr/bin/env node
/**
 * Carelu payer-source watcher.
 *
 * Reads every primary-source URL cited in src/data/payers.ts, fetches each
 * one, and compares a content hash against the last run's snapshot. When a
 * source changed (or newly fails to fetch), it posts a Slack alert so the
 * payer guide can be reviewed and its "last reviewed" stamp updated.
 *
 * Run weekly via LaunchAgent (com.carelu.payer-watch). Manual run:
 *   SLACK_WEBHOOK_URL=... node scripts/payer-watch/watch.mjs
 *
 * Slack webhook is a Workflow Builder trigger: flat JSON, plain text only
 * (same convention as leadtrap-bot-monitor).
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const PAYERS_TS = ROOT + 'src/data/payers.ts';
const SNAP_PATH = fileURLToPath(new URL('./snapshots.json', import.meta.url));
const SLACK = process.env.SLACK_WEBHOOK_URL;
const SLACK_FIELD = process.env.SLACK_WEBHOOK_FIELD || 'text';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// Pull { title, url } pairs out of the sources arrays in payers.ts.
const src = readFileSync(PAYERS_TS, 'utf8');
const sources = [];
const re = /\{ title: '((?:[^'\\]|\\.)*)', url: '([^']+)' \}/g;
let m;
while ((m = re.exec(src))) sources.push({ title: m[1].replace(/\\'/g, "'"), url: m[2] });

const snaps = existsSync(SNAP_PATH) ? JSON.parse(readFileSync(SNAP_PATH, 'utf8')) : {};

async function fetchHash(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 45000);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow', signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return { status: r.status };
    const buf = Buffer.from(await r.arrayBuffer());
    // For HTML, hash visible-ish text (strip scripts/styles/tags + whitespace)
    // so rotating nonces/timestamps don't cause false positives; binaries hash raw.
    const ct = r.headers.get('content-type') || '';
    let basis = buf;
    if (/text\/html/.test(ct)) {
      const text = buf.toString('utf8')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ');
      basis = Buffer.from(text);
    }
    return { status: r.status, hash: createHash('sha256').update(basis).digest('hex'), bytes: buf.length };
  } catch (e) {
    clearTimeout(t);
    return { error: String(e?.message || e).slice(0, 80) };
  }
}

const changed = [], failed = [], fresh = [];
for (const s of sources) {
  const r = await fetchHash(s.url);
  const prev = snaps[s.url];
  if (r.hash) {
    if (prev?.hash && prev.hash !== r.hash) changed.push(s);
    else if (!prev) fresh.push(s);
    snaps[s.url] = { hash: r.hash, bytes: r.bytes, checked: new Date().toISOString(), title: s.title };
  } else {
    // Only alert on NEW failures (some sources are permanently bot-blocked).
    if (prev && !prev.failing) failed.push({ ...s, why: r.error || `HTTP ${r.status}` });
    snaps[s.url] = { ...(prev || {}), failing: true, why: r.error || `HTTP ${r.status}`, checked: new Date().toISOString(), title: s.title };
    continue;
  }
  delete snaps[s.url].failing;
  delete snaps[s.url].why;
}
writeFileSync(SNAP_PATH, JSON.stringify(snaps, null, 1));

const date = new Date().toISOString().slice(0, 10);
console.log(`[${date}] checked ${sources.length} sources: ${changed.length} changed, ${failed.length} new failures, ${fresh.length} first-seen`);

if ((changed.length || failed.length) && SLACK) {
  const lines = [`Carelu payer-source watch (${date})`];
  if (changed.length) {
    lines.push('', `CHANGED — review the guide + bump PAYER_REVIEWED in src/data/payers.ts:`);
    for (const c of changed) lines.push(`• ${c.title} — ${c.url}`);
  }
  if (failed.length) {
    lines.push('', 'NEWLY UNREACHABLE (check manually):');
    for (const f of failed) lines.push(`• ${f.title} (${f.why}) — ${f.url}`);
  }
  lines.push('', 'Guides: https://carelu.com/payers');
  await fetch(SLACK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ [SLACK_FIELD]: lines.join('\n') }),
  }).catch((e) => console.error('slack post failed', e));
}
