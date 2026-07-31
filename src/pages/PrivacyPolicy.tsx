import DemoModalHost from '../components/DemoModal';
import { Nav } from './Landing';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   PRIVACY POLICY — LeadTrap, Inc. dba Carelu
   Covers the carelu.com marketing site. Product data / PHI is
   governed by the Terms of Service and a signed BAA.
   Draft — have counsel review before treating as authoritative.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = 'rgba(43,42,38,0.72)';
const UPDATED = 'July 31, 2026';

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{
      fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400,
      color: INK, letterSpacing: '-0.02em', margin: '44px 0 14px', scrollMarginTop: 100,
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

export default function PrivacyPolicy() {
  useSeo({
    title: 'Privacy Policy — Carelu',
    description: 'How Carelu (LeadTrap, Inc.) collects, uses, and shares information on carelu.com, including cookies, analytics, and B2B visitor identification.',
    canonical: '/privacy',
  });
  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(140px, 16vw, 190px) clamp(20px, 5vw, 40px) 90px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 54px)', fontWeight: 400, color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          LeadTrap, Inc. dba Carelu &middot; Last updated: {UPDATED}
        </p>
        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '36px 0 8px' }} />

        <P>
          This Privacy Policy explains how LeadTrap, Inc., a Delaware corporation doing business as Carelu
          (&ldquo;Carelu,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), handles information in
          connection with our website at carelu.com and related marketing pages (the &ldquo;Site&rdquo;).
        </P>
        <P>
          <B>Scope.</B> This policy covers the Site. Information processed through the Carelu product on behalf of a
          provider &mdash; including any Protected Health Information (PHI) &mdash; is governed by our{' '}
          <a href="/terms" style={{ color: '#2e5a26', fontWeight: 600 }}>Terms of Service</a> and, where applicable, a
          signed Business Associate Agreement (BAA), not by this Site policy. We do not collect PHI through this Site.
          One exception: our handling of data from email accounts a provider connects to the Carelu product (Google or
          Microsoft) is described in <a href="#connected-email" style={{ color: '#2e5a26', fontWeight: 600 }}>Connected
          email accounts</a> below.
        </P>

        <H2>Information we collect</H2>
        <P><B>Information you provide.</B> When you request a demo, contact us, or fill out a form, we collect the
          information you submit &mdash; such as your name, work email, phone number, organization, and practice size.</P>
        <P><B>Information collected automatically.</B> When you visit the Site, we and our providers automatically
          collect certain technical data, such as your IP address, device and browser type, pages viewed, referring
          URLs, and interactions with the Site, using cookies and similar technologies (see our{' '}
          <a href="/cookies" style={{ color: '#2e5a26', fontWeight: 600 }}>Cookie Policy</a>).</P>
        <P><B>Business / firmographic data.</B> We use a third-party visitor-identification service (Snitcher) that may
          infer the <em>company or organization</em> associated with a visitor&rsquo;s IP address so we can understand
          which businesses are interested in Carelu. This identifies organizations, not named individuals, and runs only
          after you accept Marketing cookies.</P>

        <H2>How we use information</H2>
        <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
          <LI>to respond to your inquiries, schedule demos, and provide information you request;</LI>
          <LI>to operate, maintain, secure, and improve the Site;</LI>
          <LI>to measure and improve our marketing and understand which organizations engage with us;</LI>
          <LI>to comply with legal obligations and enforce our terms; and</LI>
          <LI>with your consent, for advertising and analytics as described in our Cookie Policy.</LI>
        </ul>

        <H2>How we share information</H2>
        <P>We do not sell your personal information for money. We share information with:</P>
        <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
          <LI><B>Service providers</B> that operate the Site on our behalf, including hosting (Vercel), demo scheduling
            (Calendly), analytics and advertising (Google), visitor identification (Snitcher), and, for customers,
            payment processing (Stripe) &mdash; each authorized to use the data only to provide their service to us;</LI>
          <LI><B>Legal and safety</B> recipients where required by law, legal process, or to protect rights, property,
            and safety; and</LI>
          <LI><B>Business transfers</B> &mdash; in connection with a merger, acquisition, financing, or sale of assets,
            subject to this policy.</LI>
        </ul>
        <P>
          Some advertising and analytics cookies may constitute a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
          information under certain U.S. state privacy laws. You control these through the cookie banner and the
          <B> Cookie preferences</B> link in the footer.
        </P>

        <H2 id="connected-email">Connected email accounts (Google and Microsoft)</H2>
        <P>
          Providers using the Carelu product may connect a Google (Gmail) or Microsoft (Outlook) email account. With the
          account holder&rsquo;s permission, Carelu accesses that mailbox only to provide user-facing features the
          provider has enabled &mdash; such as sending intake follow-up emails from the provider&rsquo;s address, reading
          replies from families so they appear in the provider&rsquo;s Carelu inbox, and organizing those messages (for
          example, marking them as read or labeled once handled). Providers can disconnect a mailbox at any time from
          their Carelu settings, which revokes our access; previously synced data is deleted on request.
        </P>
        <P>
          Carelu&rsquo;s use and transfer of information received from Google APIs adheres to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer"
            style={{ color: '#2e5a26', fontWeight: 600 }}>Google API Services User Data Policy</a>, including the{' '}
          <B>Limited Use</B> requirements. Specifically:
        </P>
        <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
          <LI>we only use Google user data to provide and improve the user-facing mailbox features described above;</LI>
          <LI>we do not transfer Google user data to third parties except as necessary to provide these features, to
            comply with applicable law, or as part of a merger or acquisition with notice;</LI>
          <LI>we do not use Google user data for advertising;</LI>
          <LI>we do not allow humans to read Google user data unless we have the account holder&rsquo;s affirmative
            agreement, it is necessary for security or compliance purposes, or the data has been aggregated and
            anonymized; and</LI>
          <LI>we do not use Google Workspace or Gmail data to develop, improve, or train generalized artificial
            intelligence or machine-learning models.</LI>
        </ul>
        <P>
          Microsoft account data accessed through Microsoft Graph is handled under the same restrictions. OAuth tokens
          for connected accounts are stored encrypted and are never shared.
        </P>

        <H2>SMS / text messaging</H2>
        <P>
          Families may receive text messages from a provider via Carelu only after providing consent &mdash; for example,
          by submitting a form or chat conversation that discloses SMS follow-up, or by texting in first. Message
          frequency varies; message and data rates may apply. Reply <B>STOP</B> to opt out at any time and <B>HELP</B>{' '}
          for help. <B>No mobile opt-in data is shared with third parties or affiliates for marketing or promotional
          purposes.</B> Text messaging originator opt-in data and consent are not shared with any third parties, except
          as necessary to deliver the messages (e.g., our SMS carrier partners) or as required by law.
        </P>

        <H2>Cookies and your choices</H2>
        <P>
          We use strictly-necessary, analytics, and marketing cookies. Non-essential cookies (analytics and marketing,
          including Google Ads and Snitcher) load only after you consent through our cookie banner, and you can change or
          withdraw consent at any time using the <B>Cookie preferences</B> link in the footer. For details on each
          technology, see our <a href="/cookies" style={{ color: '#2e5a26', fontWeight: 600 }}>Cookie Policy</a>.
        </P>

        <H2>Your rights</H2>
        <P>
          Depending on where you live, you may have rights to access, correct, delete, or obtain a copy of your personal
          information, and to opt out of certain processing (including targeted advertising and any &ldquo;sale&rdquo; or
          &ldquo;sharing&rdquo;). To exercise these rights, contact us using the details below; we will respond as
          required by applicable law. We will not discriminate against you for exercising your rights.
        </P>

        <H2>Data retention</H2>
        <P>
          We retain information for as long as needed to fulfill the purposes described in this policy, to comply with
          our legal obligations, resolve disputes, and enforce our agreements, after which we delete or de-identify it.
        </P>

        <H2>HIPAA and health information</H2>
        <P>
          The Site is a marketing website and is not intended to collect Protected Health Information. Please do not
          submit PHI through Site forms. In the Carelu product, PHI is handled under our Terms of Service and a signed
          BAA, with the safeguards described there.
        </P>

        <H2>Children&rsquo;s privacy</H2>
        <P>
          The Site is directed to healthcare providers and businesses, not to children, and we do not knowingly collect
          personal information from children through the Site. (Carelu&rsquo;s product serves provider organizations that
          care for children; any such information is handled by those providers under their own agreements and the BAA.)
        </P>

        <H2>Security</H2>
        <P>
          We use reasonable administrative, technical, and organizational measures designed to protect information. No
          method of transmission or storage is completely secure, and we cannot guarantee absolute security.
        </P>

        <H2>Changes to this policy</H2>
        <P>
          We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last updated&rdquo;
          date above and, where appropriate, provide additional notice.
        </P>

        <H2>Contact</H2>
        <P>
          Questions about this Privacy Policy or your information may be directed to Carelu at{' '}
          <a href="mailto:privacy@carelu.com" style={{ color: '#2e5a26', fontWeight: 600 }}>privacy@carelu.com</a>.
        </P>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '28px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/terms" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Terms</a>
            <a href="/cookies" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Cookies</a>
            <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} LeadTrap, Inc.</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
