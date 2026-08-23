/* ================================================================
   GET /api/policy?kind=privacy|terms&company=<name>

   Serves carelu.com/privacy/:company and /terms/:company (rewritten
   here by vercel.json) — the default Privacy Policy and Terms of
   Service every practice on the platform gets, templated with the
   company's name straight from the URL.

   Server-rendered on purpose: these pages exist to be read by
   carrier (A2P 10DLC) compliance reviewers following the consent
   line's links, and some of that review is automated — a scanner
   fetching raw HTML must see the full policy text, not an empty SPA
   shell waiting for JavaScript. That's also why the SMS section
   leads the privacy page: the required disclosures are the first
   thing on it.

   The audience otherwise is a FAMILY who clicked a link on a
   provider's intake form — so no marketing nav, noindex, and a quiet
   hosted-by-Carelu footer. Draft — have counsel review before
   treating as authoritative.
   ================================================================ */

const UPDATED = 'August 23, 2026';

/** Words kept fully uppercase when prettifying a hand-typed slug. */
const INITIALISMS = new Set(['ABA', 'LLC', 'PLLC', 'PC', 'PA', 'INC']);

/**
 * The company display name from the query, or null when absent/blank.
 * Platform-generated links carry the name URL-encoded, so it arrives
 * decoded and renders exactly as stored. A hyphenated all-lowercase
 * slug (someone typing the URL by hand) is title-cased word by word.
 * Length-capped: this string renders into the page and the <title>.
 */
function companyNameFromParam(raw: string | null): string | null {
  if (!raw) return null;
  const name = raw.trim().slice(0, 120);
  if (!name) return null;
  if (name.includes(' ') || !name.includes('-')) return name;
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (INITIALISMS.has(upper)) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/** The company name is URL input that lands in HTML — always escaped. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function privacyBody(c: string, termsHref: string): string {
  return `
<p>This Privacy Policy describes how ${c} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects the information you share with us when you contact us, complete our inquiry or intake forms, chat with us online, or communicate with us by phone, text message, or email.</p>

<h2>Text messaging (SMS)</h2>
<p>If you consent to receive text messages from us &mdash; for example by checking the SMS consent box on our intake form &mdash; we may text you about your inquiry, scheduling, next steps, and occasional updates and offers. Consent to receive texts is optional and is <strong>not</strong> a condition of receiving services. Message frequency varies; message and data rates may apply. Reply <strong>STOP</strong> at any time to opt out and <strong>HELP</strong> for help.</p>
<p><strong>No mobile opt-in data is shared with third parties or affiliates for marketing or promotional purposes.</strong> Text messaging originator opt-in data and consent are not shared with any third parties, except as necessary to deliver the messages (for example, our messaging platform and SMS carrier partners) or as required by law.</p>

<h2>Information we collect</h2>
<ul>
<li><strong>Contact information</strong> you provide, such as your name, phone number, email address, and home address.</li>
<li><strong>Information about the person seeking care</strong> that you choose to share &mdash; for example your child&rsquo;s name, age, diagnosis, and care needs &mdash; so we can understand how we may be able to help.</li>
<li><strong>Insurance information</strong>, such as your insurance company, plan, and member ID, used to check whether our services may be covered.</li>
<li><strong>Records of our communications</strong> with you, including form responses, chat conversations, text messages, emails, and call notes.</li>
</ul>

<h2>How we use information</h2>
<ul>
<li>to respond to your inquiry and answer your questions;</li>
<li>to determine whether our services fit your family&rsquo;s needs and location;</li>
<li>to verify insurance benefits and coverage;</li>
<li>to schedule appointments and coordinate the start of care;</li>
<li>to send follow-up communications you have consented to receive; and</li>
<li>to keep records and comply with our legal obligations.</li>
</ul>

<h2>How we share information</h2>
<p>We do not sell your personal information. We share it only with:</p>
<ul>
<li><strong>Service providers</strong> that help us operate &mdash; including Carelu, the platform that powers our intake forms and communications &mdash; each permitted to use your information only to provide their service to us;</li>
<li><strong>Insurance companies and payers</strong>, to verify your benefits and coverage in connection with your inquiry; and</li>
<li><strong>Legal recipients</strong> where required by law, legal process, or to protect rights and safety.</li>
</ul>

<h2>Health information</h2>
<p>If you become a patient or client of our practice, health information about your family member is protected under applicable law, including HIPAA where it applies, and is handled as described in our Notice of Privacy Practices, which we provide when care begins.</p>

<h2>Children&rsquo;s privacy</h2>
<p>Information about children is provided to us by a parent or legal guardian as part of seeking care. We do not knowingly collect information directly from children through our forms or website.</p>

<h2>Security and retention</h2>
<p>We use reasonable administrative, technical, and organizational safeguards designed to protect your information, and we retain it only as long as needed for the purposes above and to meet our legal obligations.</p>

<h2>Your choices</h2>
<p>You may opt out of text messages at any time by replying <strong>STOP</strong>, and you may ask us to access, correct, or delete the information you have shared with us by contacting us directly. Depending on where you live, applicable law may give you additional rights over your personal information.</p>

<h2>Changes to this policy</h2>
<p>We may update this Privacy Policy from time to time. When we do, the &ldquo;Last updated&rdquo; date above will change.</p>

<h2>Contact</h2>
<p>Questions about this policy or your information may be directed to ${c} using the contact details on our website or in any message we have sent you. See also our <a href="${termsHref}">Terms of Service</a>.</p>`;
}

function termsBody(c: string, privacyHref: string): string {
  return `
<p>These Terms of Service (&ldquo;Terms&rdquo;) apply when you contact ${c} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) or use our inquiry and intake forms, online chat, or related communications. By submitting a form or communicating with us, you agree to these Terms.</p>

<h2>Communications</h2>
<p>By providing your contact details, you agree that we may respond to your inquiry by phone, email, or &mdash; where you have separately consented &mdash; text message. Text messaging is optional and never a condition of receiving services; message frequency varies, message and data rates may apply, and you can reply <strong>STOP</strong> to opt out or <strong>HELP</strong> for help at any time. How we handle your information is described in our <a href="${privacyHref}">Privacy Policy</a>.</p>

<h2>Not medical advice; not for emergencies</h2>
<p>Our forms, website, and messages provide general information about our services. They are not medical advice, and submitting an inquiry does not create a provider&ndash;patient relationship or guarantee that services will be available or covered. A care relationship begins only when we formally agree to provide services. <strong>If you are experiencing an emergency, call 911</strong> or contact your local emergency services &mdash; do not use our forms or messaging for urgent situations.</p>

<h2>Accurate information</h2>
<p>Please provide accurate, current information when you contact us. Eligibility, scheduling, and insurance decisions are based on what you share, and inaccurate information may delay or prevent care.</p>

<h2>Insurance and coverage</h2>
<p>Any information we share about insurance benefits or coverage is based on the details you provide and on responses from your insurer, and is not a guarantee of coverage or payment. Final coverage determinations are made by your insurance company.</p>

<h2>Acceptable use</h2>
<p>You agree not to misuse our forms or communications &mdash; including submitting false information, attempting to access accounts or data that are not yours, or interfering with the operation of our website and intake systems.</p>

<h2>Disclaimers and limitation of liability</h2>
<p>Our website, forms, and communications are provided &ldquo;as is.&rdquo; To the fullest extent permitted by law, we disclaim warranties of any kind with respect to them and will not be liable for indirect, incidental, or consequential damages arising from their use. Nothing in these Terms limits liability that cannot be limited under applicable law, and nothing in them alters the terms of any services agreement we enter into with you when care begins.</p>

<h2>Changes to these Terms</h2>
<p>We may update these Terms from time to time. When we do, the &ldquo;Last updated&rdquo; date above will change. Continued use of our forms and communications after a change means you accept the updated Terms.</p>

<h2>Contact</h2>
<p>Questions about these Terms may be directed to ${c} using the contact details on our website or in any message we have sent you.</p>`;
}

function page(kind: 'privacy' | 'terms', company: string): string {
  const c = esc(company);
  const enc = encodeURIComponent(company);
  const heading = kind === 'privacy' ? 'Privacy Policy' : 'Terms of Service';
  const description =
    kind === 'privacy'
      ? `How ${c} collects, uses, and protects the information families share when contacting the practice.`
      : `The terms that apply when you contact ${c} or use the practice&rsquo;s inquiry and intake forms.`;
  const body =
    kind === 'privacy'
      ? privacyBody(c, `/terms/${enc}`)
      : termsBody(c, `/privacy/${enc}`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${heading} &mdash; ${c}</title>
<meta name="description" content="${description}" />
<meta name="robots" content="noindex, nofollow" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #FAF8F3; color: rgba(43,42,38,0.72); font-family: 'DM Sans', system-ui, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: clamp(60px, 9vw, 110px) clamp(20px, 5vw, 40px) 70px; }
  .eyebrow { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(43,42,38,0.5); margin-bottom: 10px; }
  h1 { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(34px, 4.5vw, 50px); font-weight: 400; color: #1A1A1A; letter-spacing: -0.025em; line-height: 1.1; }
  .updated { font-size: 14px; color: rgba(43,42,38,0.55); margin-top: 14px; }
  .rule { height: 1px; background: rgba(43,42,38,0.12); margin: 32px 0 22px; }
  h2 { font-family: 'EB Garamond', Georgia, serif; font-size: 24px; font-weight: 400; color: #1A1A1A; letter-spacing: -0.02em; margin: 40px 0 12px; }
  p { font-size: 15px; line-height: 1.75; margin-bottom: 14px; }
  ul { margin: 0 0 14px; padding-left: 22px; }
  li { font-size: 15px; line-height: 1.72; margin-bottom: 7px; }
  strong { color: #1A1A1A; font-weight: 600; }
  a { color: #2e5a26; font-weight: 600; }
  footer { border-top: 1px solid rgba(43,42,38,0.08); padding: 24px 0 32px; }
  footer div { max-width: 760px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px); }
  footer p { font-size: 12.5px; color: rgba(43,42,38,0.5); line-height: 1.6; margin: 0; }
  footer a { color: rgba(43,42,38,0.6); }
</style>
</head>
<body>
<main>
  <p class="eyebrow">${c}</p>
  <h1>${heading}</h1>
  <p class="updated">Last updated: ${UPDATED}</p>
  <div class="rule"></div>
  ${body}
</main>
<footer>
  <div>
    <p>This page is hosted by <a href="https://carelu.com">Carelu</a> on behalf of ${c}. Questions about this page itself can be sent to <a href="mailto:privacy@carelu.com">privacy@carelu.com</a>.</p>
  </div>
</footer>
</body>
</html>`;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const kind = url.searchParams.get('kind') === 'terms' ? 'terms' : 'privacy';
  const company =
    companyNameFromParam(url.searchParams.get('company')) ?? 'This practice';
  return new Response(page(kind, company), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      // The name is the whole input, so pages are safely cacheable; a
      // template change ships with the next deploy regardless.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
