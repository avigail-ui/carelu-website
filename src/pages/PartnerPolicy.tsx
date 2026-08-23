import { useParams } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   PER-COMPANY POLICY PAGES — /privacy/:company and /terms/:company

   The default Privacy Policy and Terms of Service that every practice
   on the platform gets out of the box, templated with the company's
   name. The intake form's consent line links here whenever the
   practice hasn't supplied its own policy URLs, so the audience is a
   FAMILY who clicked a link on a provider's form — not a provider
   shopping for Carelu. Hence: no marketing nav, no demo CTA, noindex
   (hundreds of near-duplicate pages must not enter the index), and a
   quiet "hosted by Carelu" note instead of Carelu branding up top.

   The :company param is the company's display name, URL-encoded by
   the platform (e.g. /privacy/Step%20Ahead%20ABA). Hand-typed
   hyphenated slugs are prettified as a fallback.

   The SMS section deliberately carries the carrier-required lines
   (STOP/HELP, rates, and the no-third-party-marketing-sharing
   sentence) — A2P reviewers follow the consent line's privacy link to
   exactly this page. Draft — have counsel review before treating as
   authoritative.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = 'rgba(43,42,38,0.72)';
const GREEN = '#2e5a26';
const UPDATED = 'August 23, 2026';

/** Words kept fully uppercase when prettifying a hand-typed slug. */
const INITIALISMS = new Set(['ABA', 'LLC', 'PLLC', 'PC', 'PA', 'INC']);

/**
 * The company display name from the URL, or null when absent/blank.
 * React Router hands the param already percent-decoded, so a
 * platform-generated link renders the name exactly as stored. A
 * hyphenated all-lowercase slug (someone typing the URL by hand) is
 * title-cased word by word instead of shown raw. Length-capped: this
 * string renders into the page and the <title>.
 */
function companyNameFromParam(raw: string | undefined): string | null {
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

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400,
      color: INK, letterSpacing: '-0.02em', margin: '40px 0 12px',
    }}>{children}</h2>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, margin: '0 0 14px' }}>{children}</p>;
}
function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: INK, fontWeight: 600 }}>{children}</strong>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li style={{ fontSize: 15, color: MUTED, lineHeight: 1.72, marginBottom: 7 }}>{children}</li>;
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} style={{ color: GREEN, fontWeight: 600 }}>{children}</a>;
}

function Shell({ heading, company, children }: {
  heading: string;
  company: string;
  children: React.ReactNode;
}) {
  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(60px, 9vw, 110px) clamp(20px, 5vw, 40px) 70px' }}>
        <p style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', margin: '0 0 10px' }}>
          {company}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.5vw, 50px)', fontWeight: 400, color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          {heading}
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          Last updated: {UPDATED}
        </p>
        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '32px 0 8px' }} />
        {children}
      </main>
      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '24px 0 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)' }}>
          <p style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)', margin: 0, lineHeight: 1.6 }}>
            This page is hosted by{' '}
            <a href="https://carelu.com" style={{ color: 'rgba(43,42,38,0.6)', fontWeight: 600 }}>Carelu</a>{' '}
            on behalf of {company}. Questions about this page itself can be sent to{' '}
            <a href="mailto:privacy@carelu.com" style={{ color: 'rgba(43,42,38,0.6)', fontWeight: 600 }}>privacy@carelu.com</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function PartnerPrivacy() {
  const { company: raw } = useParams();
  const company = companyNameFromParam(raw) ?? 'This practice';
  const encoded = encodeURIComponent(company);
  useSeo({
    title: `Privacy Policy — ${company}`,
    description: `How ${company} collects, uses, and protects the information families share when contacting the practice.`,
    noindex: true,
  });
  return (
    <Shell heading="Privacy Policy" company={company}>
      <P>
        This Privacy Policy describes how {company} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
        collects, uses, and protects the information you share with us when you contact us, complete our inquiry or
        intake forms, chat with us online, or communicate with us by phone, text message, or email.
      </P>

      <H2>Information we collect</H2>
      <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
        <LI><B>Contact information</B> you provide, such as your name, phone number, email address, and home address.</LI>
        <LI><B>Information about the person seeking care</B> that you choose to share — for example your child&rsquo;s
          name, age, diagnosis, and care needs — so we can understand how we may be able to help.</LI>
        <LI><B>Insurance information</B>, such as your insurance company, plan, and member ID, used to check whether
          our services may be covered.</LI>
        <LI><B>Records of our communications</B> with you, including form responses, chat conversations, text messages,
          emails, and call notes.</LI>
      </ul>

      <H2>How we use information</H2>
      <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
        <LI>to respond to your inquiry and answer your questions;</LI>
        <LI>to determine whether our services fit your family&rsquo;s needs and location;</LI>
        <LI>to verify insurance benefits and coverage;</LI>
        <LI>to schedule appointments and coordinate the start of care;</LI>
        <LI>to send follow-up communications you have consented to receive; and</LI>
        <LI>to keep records and comply with our legal obligations.</LI>
      </ul>

      <H2>Text messaging (SMS)</H2>
      <P>
        If you consent to receive text messages from us — for example by checking the SMS consent box on our intake
        form — we may text you about your inquiry, scheduling, next steps, and occasional updates and offers. Consent
        to receive texts is optional and is <B>not</B> a condition of receiving services. Message frequency varies;
        message and data rates may apply. Reply <B>STOP</B> at any time to opt out and <B>HELP</B> for help.
      </P>
      <P>
        <B>No mobile opt-in data is shared with third parties or affiliates for marketing or promotional purposes.</B>{' '}
        Text messaging originator opt-in data and consent are not shared with any third parties, except as necessary
        to deliver the messages (for example, our messaging platform and SMS carrier partners) or as required by law.
      </P>

      <H2>How we share information</H2>
      <P>We do not sell your personal information. We share it only with:</P>
      <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
        <LI><B>Service providers</B> that help us operate — including Carelu, the platform that powers our intake
          forms and communications — each permitted to use your information only to provide their service to us;</LI>
        <LI><B>Insurance companies and payers</B>, to verify your benefits and coverage in connection with your
          inquiry; and</LI>
        <LI><B>Legal recipients</B> where required by law, legal process, or to protect rights and safety.</LI>
      </ul>

      <H2>Health information</H2>
      <P>
        If you become a patient or client of our practice, health information about your family member is protected
        under applicable law, including HIPAA where it applies, and is handled as described in our Notice of Privacy
        Practices, which we provide when care begins.
      </P>

      <H2>Children&rsquo;s privacy</H2>
      <P>
        Information about children is provided to us by a parent or legal guardian as part of seeking care. We do not
        knowingly collect information directly from children through our forms or website.
      </P>

      <H2>Security and retention</H2>
      <P>
        We use reasonable administrative, technical, and organizational safeguards designed to protect your
        information, and we retain it only as long as needed for the purposes above and to meet our legal obligations.
      </P>

      <H2>Your choices</H2>
      <P>
        You may opt out of text messages at any time by replying <B>STOP</B>, and you may ask us to access, correct,
        or delete the information you have shared with us by contacting us directly. Depending on where you live,
        applicable law may give you additional rights over your personal information.
      </P>

      <H2>Changes to this policy</H2>
      <P>
        We may update this Privacy Policy from time to time. When we do, the &ldquo;Last updated&rdquo; date above
        will change.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about this policy or your information may be directed to {company} using the contact details on our
        website or in any message we have sent you. See also our <A href={`/terms/${encoded}`}>Terms of Service</A>.
      </P>
    </Shell>
  );
}

export function PartnerTerms() {
  const { company: raw } = useParams();
  const company = companyNameFromParam(raw) ?? 'This practice';
  const encoded = encodeURIComponent(company);
  useSeo({
    title: `Terms of Service — ${company}`,
    description: `The terms that apply when you contact ${company} or use the practice's inquiry and intake forms.`,
    noindex: true,
  });
  return (
    <Shell heading="Terms of Service" company={company}>
      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) apply when you contact {company} (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) or use our inquiry and intake forms, online chat, or related
        communications. By submitting a form or communicating with us, you agree to these Terms.
      </P>

      <H2>Not medical advice; not for emergencies</H2>
      <P>
        Our forms, website, and messages provide general information about our services. They are not medical advice,
        and submitting an inquiry does not create a provider&ndash;patient relationship or guarantee that services
        will be available or covered. A care relationship begins only when we formally agree to provide services.{' '}
        <B>If you are experiencing an emergency, call 911</B> or contact your local emergency services — do not use
        our forms or messaging for urgent situations.
      </P>

      <H2>Accurate information</H2>
      <P>
        Please provide accurate, current information when you contact us. Eligibility, scheduling, and insurance
        decisions are based on what you share, and inaccurate information may delay or prevent care.
      </P>

      <H2>Communications</H2>
      <P>
        By providing your contact details, you agree that we may respond to your inquiry by phone, email, or — where
        you have separately consented — text message. Text messaging is optional and never a condition of receiving
        services; message frequency varies, message and data rates may apply, and you can reply <B>STOP</B> to opt
        out or <B>HELP</B> for help at any time. How we handle your information is described in our{' '}
        <A href={`/privacy/${encoded}`}>Privacy Policy</A>.
      </P>

      <H2>Insurance and coverage</H2>
      <P>
        Any information we share about insurance benefits or coverage is based on the details you provide and on
        responses from your insurer, and is not a guarantee of coverage or payment. Final coverage determinations are
        made by your insurance company.
      </P>

      <H2>Acceptable use</H2>
      <P>
        You agree not to misuse our forms or communications — including submitting false information, attempting to
        access accounts or data that are not yours, or interfering with the operation of our website and intake
        systems.
      </P>

      <H2>Disclaimers and limitation of liability</H2>
      <P>
        Our website, forms, and communications are provided &ldquo;as is.&rdquo; To the fullest extent permitted by
        law, we disclaim warranties of any kind with respect to them and will not be liable for indirect, incidental,
        or consequential damages arising from their use. Nothing in these Terms limits liability that cannot be
        limited under applicable law, and nothing in them alters the terms of any services agreement we enter into
        with you when care begins.
      </P>

      <H2>Changes to these Terms</H2>
      <P>
        We may update these Terms from time to time. When we do, the &ldquo;Last updated&rdquo; date above will
        change. Continued use of our forms and communications after a change means you accept the updated Terms.
      </P>

      <H2>Contact</H2>
      <P>
        Questions about these Terms may be directed to {company} using the contact details on our website or in any
        message we have sent you.
      </P>
    </Shell>
  );
}
