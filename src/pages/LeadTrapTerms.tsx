import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   TERMS OF SERVICE — LeadTrap, Inc. (leadtrap.com)
   Product-level terms for the LeadTrap platform. Served on the
   leadtrap.com host; carelu.com serves TermsPage.tsx.
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
const link = { color: accent, fontWeight: 600, textDecoration: 'none' };

export default function LeadTrapTerms() {
  useSeo({
    title: 'Terms of Service — LeadTrap',
    description: 'The terms governing access to and use of the LeadTrap platform, websites, and related chat, phone, SMS, and email services.',
    canonical: 'https://leadtrap.com/terms',
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          LeadTrap, Inc. dba Carelu &middot; Effective date: {EFFECTIVE}
        </p>
        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '36px 0 8px' }} />

        <P>
          These Terms of Service (&ldquo;Terms&rdquo;) govern access to and use of the LeadTrap platform, websites, and
          related services (the &ldquo;Services&rdquo;) provided by LeadTrap, Inc., a Delaware corporation doing business
          as Carelu (&ldquo;LeadTrap&rdquo;). By using the Services you agree to these Terms.
        </P>

        <H2>1. The Services</H2>
        <P>LeadTrap provides AI-powered lead capture, qualification, intake, and communication tools (chat, phone, SMS,
          and email) for business customers (&ldquo;Partners&rdquo;). Partners use the Services to communicate with their
          own prospective and current clients (&ldquo;Leads&rdquo;).</P>

        <H2>2. Accounts</H2>
        <P>You must provide accurate information and keep your credentials secure. You are responsible for activity under
          your account. You must be authorized to act for the Partner organization you register.</P>

        <H2>3. Partner Responsibilities</H2>
        <P>Partners are responsible for: (a) the content and configuration of their campaigns, prompts, and messages;
          (b) obtaining all consents required to contact Leads by SMS, phone, or email, including consents required by the
          TCPA, CAN-SPAM, and carrier messaging policies; (c) complying with laws applicable to their industry, including
          HIPAA where applicable; and (d) the accuracy of business information they provide for carrier or platform
          registrations.</P>

        <H2>4. Connected Accounts (Google / Microsoft)</H2>
        <P>Partners may connect third-party accounts (such as Gmail or Microsoft Outlook) to the Services. By connecting
          an account, you authorize LeadTrap to access it as described in our{' '}
          <a href="/privacy" style={link}>Privacy Policy</a> and only to provide the features you enable. You may
          disconnect at any time. Use of Google data is subject to the Google API Services User Data Policy, including
          Limited Use.</P>

        <H2>5. Acceptable Use</H2>
        <P>You may not use the Services to send spam or unconsented messages; violate law or third-party rights; transmit
          malware; probe or disrupt the Services; misrepresent your identity; or resell the Services without
          authorization. LeadTrap may suspend accounts that create carrier, deliverability, or legal risk.</P>

        <H2>6. Fees</H2>
        <P>Paid plans are billed as described at purchase. Fees are non-refundable except as required by law. Carrier
          surcharges and messaging fees may be passed through.</P>

        <H2>7. Data</H2>
        <P>As between the parties, Partners own their Lead data. LeadTrap processes it to provide the Services as described
          in the Privacy Policy and any applicable data processing or business associate agreement. LeadTrap owns the
          Services, including all software, models, and aggregated, de-identified usage data.</P>

        <H2>8. Confidentiality</H2>
        <P>Each party will protect the other&rsquo;s confidential information with reasonable care and use it only to
          perform under these Terms.</P>

        <H2>9. Disclaimers</H2>
        <P>The Services are provided &ldquo;as is.&rdquo; LeadTrap disclaims all implied warranties, including
          merchantability, fitness for a particular purpose, and non-infringement. AI-generated content may be inaccurate;
          Partners are responsible for reviewing configurations and communications for their use case.</P>

        <H2>10. Limitation of Liability</H2>
        <P>To the maximum extent permitted by law, neither party is liable for indirect, incidental, special, or
          consequential damages, and LeadTrap&rsquo;s aggregate liability is limited to the fees paid in the twelve months
          before the claim.</P>

        <H2>11. Indemnification</H2>
        <P>Partner will defend and indemnify LeadTrap against claims arising from Partner&rsquo;s content, campaigns,
          failure to obtain required consents, or violation of law.</P>

        <H2>12. Termination</H2>
        <P>Either party may terminate as described in the applicable order or, for uncured material breach, on 30
          days&rsquo; notice. On termination, Partner data is available for export for 30 days, after which it is deleted
          per our retention policy.</P>

        <H2>13. General</H2>
        <P>These Terms are governed by the laws of the State of Delaware, excluding conflicts rules. Disputes will be
          resolved in the state or federal courts located in the State of Delaware. These Terms plus any order form are
          the entire agreement. LeadTrap may update these Terms with notice; continued use is acceptance.</P>
        <P>Contact: <a href="mailto:legal@leadtrap.com" style={link}>legal@leadtrap.com</a>, LeadTrap, Inc., 169 Madison
          Ave, STE 62431, New York, NY 10016.</P>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '28px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: INK, textDecoration: 'none' }}>LeadTrap</Link>
          <span style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/privacy" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Privacy</a>
            <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} LeadTrap, Inc.</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
