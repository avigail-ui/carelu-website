import Anthropic from '@anthropic-ai/sdk';

/* ================================================================
   LEAD ENRICHMENT (best-effort, never fatal)

   Given what a visitor typed into a form — usually just a work email
   — work out who they are: the company behind the email domain, what
   it does, roughly how big it is, and the person's role if it is
   publicly findable. Claude does the lookup with the web-search
   server tool, so this needs no Clay/Apollo contract.

   Every failure path returns null and is logged: enrichment is a
   nice-to-have on a Slack ping, never a reason to lose a lead.
   ================================================================ */

// Personal-mailbox domains carry no company signal, so the web lookup is
// skipped for them entirely (it would only surface facts about Google).
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'hotmail.com',
  'outlook.com', 'live.com', 'msn.com', 'aol.com', 'icloud.com', 'me.com',
  'mac.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com',
  'comcast.net', 'verizon.net', 'sbcglobal.net', 'att.net', 'cox.net',
  'zoho.com', 'yandex.com', 'duck.com', 'hey.com',
]);

export interface Enrichment {
  company: string;
  companyDescription: string;
  companySize: string;
  personTitle: string;
  personNote: string;
  website: string;
  confidence: string;
}

// Every field is a plain required string with "" for unknown — deliberately
// NOT a nullable union. Nullable string schemas make the model volunteer
// nulls for fields it could have answered.
const ENRICHMENT_SCHEMA = {
  type: 'object',
  properties: {
    company: { type: 'string', description: 'Legal or trading name of the organization behind the email domain. "" if not identifiable.' },
    companyDescription: { type: 'string', description: 'One short clause: what they do and where they operate, e.g. "ABA therapy provider, 6 clinics across NJ and PA". "" if unknown.' },
    companySize: { type: 'string', description: 'Rough headcount or clinic count with a qualifier, e.g. "~120 staff" or "50-200 employees". "" if unknown.' },
    personTitle: { type: 'string', description: "The person's role at the company, only if publicly findable and clearly the same person. \"\" otherwise." },
    personNote: { type: 'string', description: 'One clause of anything else useful to a salesperson (recent funding, new location, hiring push). "" if nothing notable.' },
    website: { type: 'string', description: 'Company homepage URL. "" if unknown.' },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'], description: 'How sure you are this is the right organization.' },
  },
  required: ['company', 'companyDescription', 'companySize', 'personTitle', 'personNote', 'website', 'confidence'],
  additionalProperties: false,
} as const;

const SYSTEM = `You research inbound B2B leads for Carelu, which sells AI intake software to autism/ABA therapy providers and other healthcare practices.

Someone just filled out a form on carelu.com. Identify the organization behind their work email domain so a salesperson opening Slack knows who this is.

Rules:
- Search the web for the domain and the company name. The domain is the strongest signal; treat the person's typed name as secondary.
- Report only what you actually find. Use "" for any field you cannot support with a source. A short honest answer beats a padded guess.
- Never infer headcount from vibes — give a size only if a source states or clearly implies it.
- Only fill personTitle if you find that specific person at that specific company; same-name people elsewhere do not count.
- Keep every field to one short clause. This is a Slack line, not a report.`;

function buildPrompt(input: LeadInput, domain: string): string {
  const lines = [
    `Work email: ${input.email}`,
    `Email domain: ${domain}`,
  ];
  if (input.name) lines.push(`Name they typed: ${input.name}`);
  if (input.size) lines.push(`Practice size they selected: ${input.size}`);
  if (input.company) lines.push(`Company they typed: ${input.company}`);
  lines.push(`Form they submitted: ${input.formLabel}`);
  return lines.join('\n');
}

export interface LeadInput {
  email: string;
  name?: string;
  company?: string;
  size?: string;
  formLabel: string;
}

export function emailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

export function isFreeEmail(email: string): boolean {
  return FREE_EMAIL_DOMAINS.has(emailDomain(email));
}

export async function enrichLead(input: LeadInput): Promise<Enrichment | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const domain = emailDomain(input.email);
  if (!domain || isFreeEmail(input.email)) return null;

  // Bounded so a slow lookup can never eat the function's whole budget: the
  // Slack ping matters more than the enrichment attached to it.
  const client = new Anthropic({ timeout: 20_000, maxRetries: 1 });

  try {
    const response = await client.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4000,
      system: SYSTEM,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: ENRICHMENT_SCHEMA },
      },
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 4 }],
      messages: [{ role: 'user', content: buildPrompt(input, domain) }],
    });

    if (response.stop_reason === 'refusal') {
      console.error('enrich: model declined', response.stop_details);
      return null;
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    if (!text) return null;

    const parsed = JSON.parse(text) as Partial<Enrichment>;
    return {
      company: (parsed.company ?? '').trim(),
      companyDescription: (parsed.companyDescription ?? '').trim(),
      companySize: (parsed.companySize ?? '').trim(),
      personTitle: (parsed.personTitle ?? '').trim(),
      personNote: (parsed.personNote ?? '').trim(),
      website: (parsed.website ?? '').trim(),
      confidence: (parsed.confidence ?? '').trim(),
    };
  } catch (err) {
    console.error('enrich: lookup failed', err);
    return null;
  }
}

/** One-line rendering for a Slack message; "" when nothing was found. */
export function renderEnrichment(e: Enrichment | null): string {
  if (!e) return '';
  const who = [e.personTitle, e.company].filter(Boolean).join(' at ');
  const about = [e.companySize, e.companyDescription].filter(Boolean).join(' · ');
  const parts = [who, about, e.personNote, e.website].filter(Boolean);
  if (!parts.length) return '';
  const suffix = e.confidence && e.confidence !== 'high' ? ` (${e.confidence} confidence)` : '';
  return parts.join(' · ') + suffix;
}
