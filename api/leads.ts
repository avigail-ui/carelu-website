import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { json, requireConfig, isResponse, getRepoFileText, commitFiles } from './sources/_shared.js';

// Demo-form submits also email the team directly (Slack pings are easy to
// miss). Sends through the same SES account as the LeadTrap backend, whose
// verified identity is the ses.leadtrap.com SUBDOMAIN — the From must live
// there, not on leadtrap.com. Env names are SES_*, not AWS_*: Vercel reserves
// AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY and refuses to set them. Creds
// missing → skip silently (lead storage and Slack are unaffected).
const DEMO_NOTIFY_TO = ['yoni@leadtrap.com', 'avi@leadtrap.com'];
const DEMO_NOTIFY_FROM = 'Carelu Demo Requests <demo@ses.leadtrap.com>';

async function emailDemoNotify(email: string, source: string): Promise<void> {
  const accessKeyId = process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    console.error('leads: SES creds not configured, demo email skipped');
    return;
  }
  const ses = new SESv2Client({
    region: process.env.SES_REGION || 'us-east-1',
    credentials: { accessKeyId, secretAccessKey },
  });
  await ses.send(new SendEmailCommand({
    FromEmailAddress: DEMO_NOTIFY_FROM,
    Destination: { ToAddresses: DEMO_NOTIFY_TO },
    ReplyToAddresses: [email],
    Content: {
      Simple: {
        Subject: { Data: `Demo request — ${source.replace(/^demo:\s*/, '')}` },
        Body: {
          Text: {
            Data:
              `New demo request on carelu.com\n\n` +
              `Email: ${email}\n` +
              `Details: ${source}\n\n` +
              `They submitted the form and were shown the calendar; a Calendly ` +
              `invite only follows if they picked a slot. Reply-to is set to the lead.`,
          },
        },
      },
    },
  }));
}

// Dedicated "Carelu newsletter signup" Slack workflow -> #marketing. Deliberately
// NOT the shared SLACK_WEBHOOK_URL from _shared.ts: that one is the "Bot is down"
// workflow posting to #alerts, where signups were indistinguishable from
// bot-liveness noise. Variables must stay named `email` and `source` — the
// workflow renders only fields matching its declared variables, and a mismatch
// posts a blank message with no error (the trigger 200s on any body).
const LEADS_SLACK_WEBHOOK_URL =
  'https://hooks.slack.com/triggers/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';

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
  const isDemo = source.startsWith('demo');

  const cfg = requireConfig();
  if (isResponse(cfg)) {
    // Repo token not configured — still let the visitor through, but say so in logs.
    console.error('leads: sources config missing, lead dropped', email);
    return json({ ok: true });
  }

  // This list is the newsletter list, so a lost write is a lost subscriber.
  // leads.json is a read-modify-write: two signups landing together would make
  // the second commit fail against a moved ref (commitFiles updates with
  // force:false). Re-read and retry so the loser of the race still lands.
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

    // Newsletter-style signups dedupe on email alone. Demo-form captures
    // (source "demo: ...") must still land — and still ping Slack — even when
    // the email is already on the list from an earlier gated download; those
    // dedupe on the exact email+source pair instead.
    if (leads.some((l) => l.email === email && (!isDemo || l.source === source))) {
      alreadyKnown = true;
      stored = true;
      break;
    }

    leads.push({ ts: new Date().toISOString(), email, source });
    try {
      await commitFiles(
        cfg.token,
        [{ path: 'leads.json', content: JSON.stringify(leads, null, 1) + '\n' }],
        `lead: ${email} (${source})`
      );
      stored = true;
    } catch (err) {
      console.error(`leads: commit attempt ${attempt + 1} failed`, err);
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    }
  }

  if (!stored) console.error('leads: GAVE UP storing lead', email, source);

  if (stored && !alreadyKnown) {
    try {
      await fetch(LEADS_SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
    } catch (err) {
      console.error('leads: slack notify failed (non-fatal)', err);
    }
    if (isDemo) {
      try {
        await emailDemoNotify(email, source);
      } catch (err) {
        console.error('leads: demo email notify failed (non-fatal)', err);
      }
    }
  }

  return json({ ok: true });
}
