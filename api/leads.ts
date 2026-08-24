import { json, requireConfig, isResponse, getRepoFileText, commitFiles } from './sources/_shared.js';
import { enrichLead, renderEnrichment, isFreeEmail } from './_enrich.js';

/* ================================================================
   POST /api/leads  (public, no auth)
   Body: { email, form?, name?, company?, size?, page?, website? }

   Every visitor who hands over contact info on carelu.com lands
   here. Leads are appended to leads.json in the PRIVATE
   carelu-sources repo and announced in Slack — demo requests to
   #sales (they are buying signal), every other form to #marketing
   (gated downloads, directory resources) naming the form they
   filled out. Before announcing, Claude enriches the lead from the
   email domain so the ping says who this actually is.

   `website` is a honeypot — bots that fill it get a 200 and are
   dropped. Never blocks the visitor: any storage, enrichment, or
   notification failure still returns 200 so the front-end proceeds.
   ================================================================ */

// Demo requests post to their own "Carelu demo request" Slack workflow ->
// #sales. Until that workflow exists in Slack this stays empty and demo
// leads fall back to the marketing workflow, so no ping is ever lost.
const SALES_SLACK_WEBHOOK_URL = '';

// "Carelu newsletter signup" Slack workflow -> #marketing. Deliberately NOT
// the shared SLACK_WEBHOOK_URL from _shared.ts: that one is the "Bot is down"
// workflow posting to #alerts, where signups were indistinguishable from
// bot-liveness noise. Variables must stay named `email` and `source` — the
// workflow renders only fields matching its declared variables, and a
// mismatch posts a blank message with no error (the trigger 200s on any
// body). Everything a human needs to read is therefore packed into `source`.
const MARKETING_SLACK_WEBHOOK_URL =
  'https://hooks.slack.com/triggers/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';

export const config = { maxDuration: 60 };

const EMAIL_RE = /^[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/* Every form that can reach this endpoint. `team` decides which Slack
   channel hears about it; `label` is what a human reads in the ping. Add a
   row here when a new form ships — an unknown key still records and pings
   marketing, it just reads as its raw key. */
const FORMS: Record<string, { label: string; team: 'sales' | 'marketing' }> = {
  demo: { label: 'Get a Demo', team: 'sales' },
  'referral-contacts': { label: 'Pediatrician referral-contacts list', team: 'marketing' },
  'payer-directory': { label: 'Payer directory', team: 'marketing' },
};

interface Lead {
  ts: string;
  email: string;
  /** Machine key for the form; kept as `source` so existing rows stay valid. */
  source: string;
  name?: string;
  company?: string;
  size?: string;
  page?: string;
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  // Honeypot: real users never see this field.
  if (str(body.website, 200) !== '') return json({ ok: true });

  const email = str(body.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid email' }, 400);

  // `form` is the current field; `source` is the legacy name for the same
  // thing and still arrives from any cached front-end bundle.
  const form = (str(body.form, 60) || str(body.source, 60) || 'unknown').toLowerCase();
  const name = str(body.name, 120);
  const company = str(body.company, 120);
  const size = str(body.size, 40);
  const page = str(body.page, 200);

  const known = FORMS[form];
  const formLabel = known?.label ?? form;
  const team = known?.team ?? 'marketing';

  const cfg = requireConfig();
  if (isResponse(cfg)) {
    // Repo token not configured — still let the visitor through, but say so in logs.
    console.error('leads: sources config missing, lead dropped', email);
    return json({ ok: true });
  }

  // A lost write is a lost lead. leads.json is a read-modify-write: two
  // signups landing together would make the second commit fail against a
  // moved ref (commitFiles updates with force:false). Re-read and retry so
  // the loser of the race still lands.
  let stored = false;
  let alreadyKnown = false;
  for (let attempt = 0; attempt < 4 && !stored; attempt++) {
    let leads: Lead[] = [];
    let readOk = false;
    try {
      leads = JSON.parse(await getRepoFileText(cfg.token, 'leads.json')) as Lead[];
      readOk = true;
    } catch (err) {
      // A 404 means this is the first lead ever, which is a legitimate empty
      // start. Any other read failure must NOT be treated as an empty list —
      // committing [] over a real file would wipe every subscriber.
      const status = (err as { status?: number }).status;
      if (status === 404) readOk = true;
      else console.error('leads: read failed', err);
    }
    if (!readOk) {
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
      continue;
    }

    // Dedupe per email PER FORM, not per email: someone who downloaded the
    // referral list months ago and now wants a demo is new information, and
    // sales has to hear about it. Re-submitting the same form is not.
    if (leads.some((l) => l.email === email && l.source === form)) {
      alreadyKnown = true;
      stored = true;
      break;
    }

    const lead: Lead = { ts: new Date().toISOString(), email, source: form };
    if (name) lead.name = name;
    if (company) lead.company = company;
    if (size) lead.size = size;
    if (page) lead.page = page;
    leads.push(lead);

    try {
      await commitFiles(
        cfg.token,
        [{ path: 'leads.json', content: JSON.stringify(leads, null, 1) + '\n' }],
        `lead: ${email} (${form})`
      );
      stored = true;
    } catch (err) {
      console.error(`leads: commit attempt ${attempt + 1} failed`, err);
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }

  if (!stored) console.error('leads: GAVE UP storing lead', email, form);

  if (stored && !alreadyKnown) {
    const enrichment = await enrichLead({ email, name, company, size, formLabel });
    const enriched = renderEnrichment(enrichment);

    // Both workflows declare the same two variables, so the whole human-
    // readable story goes in `source`.
    const headline = [name, company].filter(Boolean).join(' — ');
    const detail = [
      headline,
      size ? `self-reported size ${size}` : '',
      enriched,
      isFreeEmail(email) ? 'personal email domain' : '',
      page ? `from ${page}` : '',
    ].filter(Boolean).join(' | ');
    const display = detail ? `${formLabel} · ${detail}` : formLabel;

    const webhook = team === 'sales' && SALES_SLACK_WEBHOOK_URL
      ? SALES_SLACK_WEBHOOK_URL
      : MARKETING_SLACK_WEBHOOK_URL;
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source: display }),
      });
    } catch (err) {
      console.error('leads: slack notify failed (non-fatal)', err);
    }
  }

  return json({ ok: true });
}
