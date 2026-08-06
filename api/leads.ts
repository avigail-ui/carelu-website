import { json, requireConfig, isResponse, getRepoFileText, commitFiles, SLACK_WEBHOOK_URL } from './sources/_shared.js';

/* ================================================================
   POST /api/leads  (public, no auth)
   Body: { email, source?, website? }

   Soft-gate lead capture for gated resources (the pediatric
   referral-contacts dataset). Appends the lead to leads.json in the
   PRIVATE carelu-sources repo (creates the file on first lead) and
   best-effort-notifies Slack. `website` is a honeypot — bots that
   fill it get a 200 and are dropped.

   Never blocks the visitor: any storage failure still returns 200 so
   the front-end proceeds with the download.
   ================================================================ */

export const config = { maxDuration: 30 };

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

interface Lead {
  ts: string;
  email: string;
  source: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: { email?: unknown; source?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  // Honeypot: real users never see this field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 80) : 'unknown';
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid email' }, 400);

  const cfg = requireConfig();
  if (isResponse(cfg)) {
    // Repo token not configured — still let the visitor through, but say so in logs.
    console.error('leads: sources config missing, lead dropped', email);
    return json({ ok: true });
  }

  let leads: Lead[] = [];
  try {
    leads = JSON.parse(await getRepoFileText(cfg.token, 'leads.json')) as Lead[];
  } catch {
    // First lead ever (404) or transient read failure — start fresh either way;
    // commitFiles writes on top of HEAD so an existing file is never clobbered
    // silently unless the read genuinely failed, which we accept for v1 volume.
    leads = [];
  }

  const isNew = !leads.some((l) => l.email === email);
  if (isNew) {
    leads.push({ ts: new Date().toISOString(), email, source });
    try {
      await commitFiles(cfg.token, [{ path: 'leads.json', content: JSON.stringify(leads, null, 1) + '\n' }], `lead: ${email} (${source})`);
    } catch (err) {
      console.error('leads: commit failed', err);
    }
    try {
      await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: `New lead from carelu.com: ${email} (via ${source})` }),
      });
    } catch (err) {
      console.error('leads: slack notify failed (non-fatal)', err);
    }
  }

  return json({ ok: true });
}
