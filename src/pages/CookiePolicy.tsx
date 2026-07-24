import DemoModalHost from '../components/DemoModal';
import { Nav } from './Landing';
import { useSeo } from '../hooks/useSeo';

/* ================================================================
   COOKIE POLICY — LeadTrap, Inc. dba Carelu
   Documents cookie categories + the specific technologies (Google
   Ads / gtag Consent Mode v2, Snitcher/Radar). Consent-gated via
   CookieConsent.tsx. Draft — have counsel review.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.1)';
const MUTED = 'rgba(43,42,38,0.72)';
const GREEN = '#3f7a34';
const UPDATED = 'July 24, 2026';

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: INK, letterSpacing: '-0.02em', margin: '44px 0 14px' }}>{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, margin: '0 0 14px' }}>{children}</p>;
}
function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: INK, fontWeight: 600 }}>{children}</strong>;
}

const CATEGORIES = [
  { name: 'Strictly necessary', tag: 'Always on', desc: 'Required for the site to work and to remember your cookie choice. These do not require consent. Includes the local storage key that records your consent preferences.' },
  { name: 'Analytics', tag: 'Consent required', desc: 'Help us understand how visitors use the site so we can improve it. Loaded only after you accept Analytics cookies.' },
  { name: 'Marketing', tag: 'Consent required', desc: 'Used to measure and improve our advertising and to identify which organizations engage with us. Loaded only after you accept Marketing cookies. Includes Google Ads and Snitcher (below).' },
];

const TECHS = [
  { name: 'Consent preferences', provider: 'Carelu (first-party)', cat: 'Strictly necessary', purpose: 'Stores your cookie choices in your browser (localStorage key carelu_cookie_consent_v1) so we can honor them.' },
  { name: 'Google Ads / gtag', provider: 'Google', cat: 'Marketing', purpose: 'Advertising and conversion measurement. We run Google Consent Mode v2 with all storage defaulted to “denied” until you consent, so no advertising cookies are set until you accept Marketing.' },
  { name: 'Snitcher (Radar)', provider: 'Snitcher', cat: 'Marketing', purpose: 'B2B visitor identification: infers the company/organization associated with a visitor’s IP address, and uses cookies / local storage to recognize returning visits. It identifies organizations, not named individuals. Configured with waitForConsent, so it only persists data after you accept Marketing cookies.' },
];

export default function CookiePolicy() {
  useSeo({
    title: 'Cookie Policy — Carelu',
    description: 'The cookies and similar technologies Carelu uses on carelu.com — strictly necessary, analytics, and marketing (Google Ads, Snitcher) — and how to manage your consent.',
    canonical: '/cookies',
  });
  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(140px, 16vw, 190px) clamp(20px, 5vw, 40px) 90px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 54px)', fontWeight: 400, color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
          Cookie Policy
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          LeadTrap, Inc. dba Carelu &middot; Last updated: {UPDATED}
        </p>
        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '36px 0 8px' }} />

        <P>
          This Cookie Policy explains how Carelu uses cookies and similar technologies (such as local storage and pixels)
          on carelu.com, and how you can control them. For how we handle personal information more generally, see our{' '}
          <a href="/privacy" style={{ color: '#2e5a26', fontWeight: 600 }}>Privacy Policy</a>.
        </P>

        <H2>How we ask for consent</H2>
        <P>
          When you first visit, a cookie banner lets you <B>Accept all</B>, <B>Reject</B> non-essential cookies, or
          <B> Customize</B> by category. Non-essential cookies do not load until you consent, and Google advertising runs
          under <B>Consent Mode v2</B> with storage defaulted to &ldquo;denied&rdquo; until you accept. You can change or
          withdraw your choice any time via the <B>Cookie preferences</B> link in the site footer.
        </P>

        <H2>Categories</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '4px 0 8px' }}>
          {CATEGORIES.map((c) => (
            <div key={c.name} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15.5, fontWeight: 700, color: INK }}>{c.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, background: 'rgba(63,122,52,0.09)', padding: '3px 9px', borderRadius: 100 }}>{c.tag}</span>
              </div>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <H2>Technologies we use</H2>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden', margin: '4px 0 8px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${HAIR}` }}>
                  {['Technology', 'Provider', 'Category', 'Purpose'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TECHS.map((t, i) => (
                  <tr key={t.name} style={{ borderBottom: i < TECHS.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
                    <td style={{ padding: '13px 18px', fontSize: 13.5, fontWeight: 600, color: INK, verticalAlign: 'top' }}>{t.name}</td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: MUTED, verticalAlign: 'top' }}>{t.provider}</td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: MUTED, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{t.cat}</td>
                    <td style={{ padding: '13px 18px', fontSize: 13, color: MUTED, lineHeight: 1.55, verticalAlign: 'top' }}>{t.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <H2>Managing cookies</H2>
        <P>
          Besides our banner and the <B>Cookie preferences</B> link, you can control cookies through your browser
          settings and opt out of certain advertising via industry tools (for example, Google&rsquo;s Ads Settings and
          the Network Advertising Initiative). Blocking some cookies may affect how the site works.
        </P>

        <H2>Changes</H2>
        <P>We may update this Cookie Policy as our practices or the technologies we use change; the &ldquo;Last
          updated&rdquo; date above reflects the latest revision.</P>

        <H2>Contact</H2>
        <P>Questions may be directed to{' '}
          <a href="mailto:privacy@carelu.com" style={{ color: '#2e5a26', fontWeight: 600 }}>privacy@carelu.com</a>.</P>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '28px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a href="/terms" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Terms</a>
            <a href="/privacy" style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.6)', textDecoration: 'none' }}>Privacy</a>
            <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} LeadTrap, Inc.</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
