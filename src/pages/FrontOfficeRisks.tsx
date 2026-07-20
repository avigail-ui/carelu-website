import { useEffect } from 'react';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import FrontOfficeRisksSection from '../components/FrontOfficeRisksSection';
import { FRONT_OFFICE_RISKS } from '../data/risks';

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 800, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

export default function FrontOfficeRisks() {
  useReveal();
  useSeo({
    title: 'The Biggest ABA Front-Office Risks: Compliance, Denials, Prior Auth | Carelu',
    description:
      'The front office carries the biggest hidden risks in an ABA practice — HIPAA compliance, claim denials from bad intake data, prior-authorization gaps, assessment errors, and more. What each costs, and how to reduce it.',
    canonical: '/aba-front-office-risks',
  });
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'for-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'The biggest ABA front-office risks',
      description: 'Compliance, revenue, and clinical risks that live in the ABA front office — and how to reduce them.',
      url: 'https://carelu.com/aba-front-office-risks',
      author: { '@type': 'Organization', name: 'Carelu', url: 'https://carelu.com/' },
      publisher: { '@id': 'https://carelu.com/#organization' },
    });
    document.head.appendChild(script);
    return () => { document.getElementById('for-jsonld')?.remove(); };
  }, []);

  const counts = FRONT_OFFICE_RISKS.reduce((m, r) => { m[r.tag] = (m[r.tag] || 0) + 1; return m; }, {} as Record<string, number>);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <section style={{ paddingTop: 'clamp(150px, 18vw, 200px)', paddingBottom: 'clamp(24px, 3.5vw, 44px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Front-Office Risk</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 62px)', fontWeight: 400,
            color: INK, lineHeight: 1.07, letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 840,
          }}>
            The front office is your biggest hidden risk.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 640, margin: '20px auto 0',
          }}>
            Intake gets treated like admin work. But it’s where HIPAA compliance, insurance reimbursement,
            prior authorization, and clinical readiness are actually won or lost — often months before anyone
            notices. Here are the {FRONT_OFFICE_RISKS.length} biggest risks, what each costs, and how to reduce them.
          </p>
          <div className="rv d3" style={{ display: 'inline-flex', gap: 10, marginTop: 22, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['Compliance', 'Revenue', 'Clinical'] as const).map((t) => (
              <span key={t} style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(43,42,38,0.7)', background: '#fff', padding: '7px 14px', borderRadius: 100, border: '1px solid rgba(43,42,38,0.1)' }}>{counts[t] || 0} {t.toLowerCase()} risks</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(40px, 6vw, 60px)' }}>
        <div style={MEASURE}>
          <FrontOfficeRisksSection heading={false} />
          <p className="rv" style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.55)', margin: '24px 0 0', lineHeight: 1.6 }}>
            Related: <a href="/zapier-make-hipaa-risk" style={{ color: '#2e5a26', fontWeight: 600 }}>Why Zapier &amp; Make aren’t HIPAA compliant</a> ·
            {' '}<a href="/payers" style={{ color: '#2e5a26', fontWeight: 600 }}>the payer policy directory</a> ·
            {' '}<a href="/resources/aba-intake-drop-off" style={{ color: '#2e5a26', fontWeight: 600 }}>where families leak in intake</a>.
            This is general information, not legal, billing, or clinical advice.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(40px, 6vw, 80px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            De-risk the front office.
          </p>
          <p className="rv d1" style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px' }}>
            See how Carelu runs a compliant, verified intake end to end — so these risks stop living in spreadsheets and someone’s memory.
          </p>
          <a href="/demo" className="rv d2" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK, padding: '16px 32px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${HAIR}`, padding: '28px 0' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>© {new Date().getFullYear()} Carelu — The front office of care</span>
        </div>
      </footer>
    </div>
  );
}
