import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   PRIVACY POLICY — LeadTrap, Inc. (leadtrap.com)
   Product-level policy covering leadtrap.com, app.leadtrap.ai, and
   the chat/phone/SMS/email products. Carries the Twilio A2P SMS
   consent clause (§4) and the Google API Limited Use block (§3)
   required for carrier + OAuth verification. Served on the leadtrap.com
   host; carelu.com serves the marketing-scoped PrivacyPolicy.tsx.
   Draft — have counsel review before treating as authoritative.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = 'rgba(43,42,38,0.72)';
const EFFECTIVE = 'July 31, 2026';
const accent = '#2f6f8f';

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)', fontSize: 25, fontWeight: 400,
      color: INK, letterSpacing: '-0.02em', margin: '42px 0 14px',
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
const link = { color: accent, fontWeight: 600, textDecoration: 'none' };

export default function LeadTrapPrivacy() {
  useSeo({
    title: 'Privacy Policy — LeadTrap',
    description: 'How LeadTrap, Inc. collects, uses, and shares information across leadtrap.com and its chat, phone, SMS, and email products, including Google/Microsoft email data and SMS consent.',
    canonical: 'https://leadtrap.com/privacy',
  });
  return (
    <div style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <header style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px clamp(20px, 5vw, 40px)' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.jpeg" alt="" style={{ height: 26, width: 26, borderRadius: 6 }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 18, color: INK, letterSpacing: '-0.02em' }}>LeadTrap</span>
        </Link>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(40px, 6vw, 70px) clamp(20px, 5vw, 40px) 90px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 54px)', fontWeight: 400, color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          LeadTrap, Inc. dba Carelu &middot; Effective date: {EFFECTIVE}
        </p>
        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '36px 0 8px' }} />

        <P>
          LeadTrap, Inc., a Delaware corporation doing business as Carelu (&ldquo;LeadTrap,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us&rdquo;), provides an AI-powered lead capture, qualification, and intake platform for healthcare
          providers and service businesses. This Privacy Policy explains what information we collect, how we use it, and
          the choices you have. It applies to leadtrap.com, app.leadtrap.ai, and our chat, phone, SMS, and email products
          (the &ldquo;Services&rdquo;).
        </P>

        <H2>1. Information We Collect</H2>
        <P><B>Information you provide.</B> Account details (name, email, phone, company), billing information, and content
          you submit through the Services.</P>
        <P><B>Lead and intake information.</B> When you interact with a LeadTrap chat widget, phone agent, SMS
          conversation, or intake form operated on behalf of one of our business customers (&ldquo;Partners&rdquo;), we
          collect the information you share &mdash; such as your name, contact details, insurance information, and the
          content of your conversation &mdash; on behalf of that Partner and process it under their instructions.</P>
        <P><B>Email data (with your permission).</B> If a Partner connects a Google or Microsoft email account to the
          Services, we access mailbox data through Google and Microsoft APIs solely as described in Section 3.</P>
        <P><B>Automatic information.</B> Log data, device and browser information, approximate location derived from IP
          address, and usage analytics.</P>

        <H2>2. How We Use Information</H2>
        <P>We use information to provide and operate the Services; route, qualify, and follow up with leads on behalf of
          Partners; send and receive communications the Partner has configured (chat, SMS, phone, email); provide
          reporting and analytics to Partners; secure and improve the Services; and comply with law.</P>
        <P>We do <B>not</B> sell personal information. We do <B>not</B> use lead or intake information for advertising.</P>

        <H2>3. Google and Microsoft Email Data</H2>
        <P>If a Partner connects a Gmail or Microsoft Outlook account, LeadTrap accesses that mailbox only to provide
          user-facing features the Partner has enabled &mdash; such as sending intake follow-up emails from the
          Partner&rsquo;s address, reading replies from leads so they appear in the Partner&rsquo;s LeadTrap inbox, and
          organizing those messages (for example, marking them as read or labeled once handled).</P>
        <P>LeadTrap&rsquo;s use and transfer of information received from Google APIs adheres to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" style={link} target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>,
          including the <B>Limited Use</B> requirements. Specifically:</P>
        <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
          <LI>We only use Google user data to provide and improve the user-facing mailbox features described above.</LI>
          <LI>We do <B>not</B> transfer Google user data to third parties except as necessary to provide these features,
            to comply with applicable law, or as part of a merger or acquisition with notice.</LI>
          <LI>We do <B>not</B> use Google user data for advertising.</LI>
          <LI>We do <B>not</B> allow humans to read Google user data unless we have the account holder&rsquo;s affirmative
            agreement, it is necessary for security or compliance purposes, or the data has been aggregated and
            anonymized.</LI>
          <LI>We do <B>not</B> use Google Workspace or Gmail data to develop, improve, or train generalized artificial
            intelligence or machine-learning models.</LI>
        </ul>
        <P>Microsoft account data accessed through Microsoft Graph is handled under the same restrictions. Partners can
          disconnect a mailbox at any time from their LeadTrap settings, which revokes our access; previously synced data
          can be deleted on request.</P>

        <H2>4. SMS / Text Messaging</H2>
        <P>Leads may receive SMS messages from a Partner via LeadTrap only after providing consent &mdash; for example, by
          submitting a form or chat conversation that discloses SMS follow-up, or by texting in first. Message frequency
          varies; message and data rates may apply. Reply <B>STOP</B> to opt out at any time and <B>HELP</B> for help.</P>
        <P><B>No mobile opt-in data is shared with third parties or affiliates for marketing or promotional purposes.</B>{' '}
          Text messaging originator opt-in data and consent are not shared with any third parties, except as necessary to
          deliver the messages (e.g., our SMS carrier partners) or as required by law.</P>

        <H2>5. Sharing</H2>
        <P>We share information with: the Partner on whose behalf a conversation occurs; service providers who process
          data for us under contract (hosting, telephony/SMS carriers, payment processing, analytics); and authorities
          when required by law. We may share aggregated, de-identified information that cannot reasonably identify you.</P>

        <H2>6. Data Retention and Deletion</H2>
        <P>We retain personal information for as long as needed to provide the Services to the relevant Partner, then
          delete or de-identify it. Partners may request deletion of lead data at any time; account holders may request
          deletion of their account data by contacting{' '}
          <a href="mailto:privacy@leadtrap.com" style={link}>privacy@leadtrap.com</a>.</P>

        <H2>7. Security</H2>
        <P>We use industry-standard safeguards, including encryption in transit (TLS) and at rest, access controls, and
          least-privilege internal access. OAuth tokens for connected email accounts are stored encrypted and are never
          shared.</P>

        <H2>8. Your Rights</H2>
        <P>Depending on where you live, you may have rights to access, correct, delete, or port your personal
          information, and to opt out of certain processing. Contact{' '}
          <a href="mailto:privacy@leadtrap.com" style={link}>privacy@leadtrap.com</a> to exercise these rights. If we
          process your data on behalf of a Partner, we may direct your request to that Partner.</P>

        <H2>9. Children</H2>
        <P>The Services are not directed to children under 13, and we do not knowingly collect their information without
          appropriate consent obtained by the Partner (e.g., a parent completing intake for a child&rsquo;s care).</P>

        <H2>10. Changes and Contact</H2>
        <P>We will post any changes to this policy on this page with an updated effective date. Questions:{' '}
          <a href="mailto:privacy@leadtrap.com" style={link}>privacy@leadtrap.com</a>, LeadTrap, Inc., 169 Madison Ave,
          STE 62431, New York, NY 10016.</P>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '28px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: INK, textDecoration: 'none' }}>LeadTrap</Link>
          <span style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/terms" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Terms</a>
            <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} LeadTrap, Inc.</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
