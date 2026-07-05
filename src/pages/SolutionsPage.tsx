import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { Nav } from './Landing';

/* ================================================================
   CARELU — SOLUTIONS (Single-Site / Multi-Site / Enterprise)
   Matches the landing-page brand system: bone surfaces, ink text,
   lime accent, EB Garamond display serif, floating pill nav.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const LIME = '#D4F25C';
const HAIR = 'rgba(43,42,38,0.08)';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

type Feature = { title: string; desc: string };
type SizeData = {
  pill: string;
  h1: string;
  sub: string;
  features: Feature[];
  trustBand?: boolean;
  ctaLine: string;
};

const SIZES: Record<string, SizeData> = {
  'single-site': {
    pill: 'For single-site practices',
    h1: 'Big-group intake. Single-clinic team.',
    sub: 'Every family answered, qualified, and scheduled — without adding headcount. Carelu gives one clinic the front office of a fifty-clinic group.',
    features: [
      { title: 'Never miss a family', desc: 'Nights, weekends, lunch rushes — Carelu answers every inquiry in seconds, in English and Spanish, while your team is with clients.' },
      { title: 'No new headcount', desc: 'One coordinator with Carelu does the work of a team: qualifying families, collecting documents, chasing signatures, scheduling assessments.' },
      { title: 'Live in days', desc: 'We configure everything around your practice and train your team. No IT project, nothing to install.' },
      { title: 'Grows with you', desc: 'Opening a second location? Your rules, panels, and flows come with you — Carelu scales the moment you do.' },
    ],
    ctaLine: 'See what your intake could look like.',
  },
  'multi-site': {
    pill: 'For multi-site organizations',
    h1: 'One front office for every location.',
    sub: 'Location-specific rules with organization-wide visibility. Carelu routes every family to the right site, the right panel, the right program — automatically.',
    features: [
      { title: 'Location-aware intake', desc: 'Different insurance panels, service areas, and open capacity per site — every family is qualified against the right rules, every time.' },
      { title: 'Smart routing', desc: 'Families land at the right location automatically. No cross-site phone tag, no misrouted referrals.' },
      { title: 'Org-wide visibility', desc: 'One dashboard across all locations — every conversation, every intake, every bottleneck, in real time.' },
      { title: 'A consistent experience', desc: 'Every family gets the same instant, warm intake, whichever site they reach — your brand, everywhere.' },
    ],
    ctaLine: 'Bring every location onto one system.',
  },
  'enterprise': {
    pill: 'For enterprise organizations',
    h1: 'Intake infrastructure at scale.',
    sub: 'Multi-state rollouts, deep integrations, and a dedicated partner invested like your own team. Built to pass your security review.',
    features: [
      { title: 'Integrates with your stack', desc: 'Leading CRMs and EMRs — Salesforce, HubSpot, CentralReach, and more — plus webhooks for everything else. Every document and detail syncs back to one family record, so nothing is entered twice.' },
      { title: 'Security first', desc: 'HIPAA compliant, SOC 2 Type II, BAAs signed before you go live, US-only data centers. We support your security review end to end.' },
      { title: 'Rollouts, managed', desc: 'Phased launches across regions and brands, with location-specific rules configured for you — not by you.' },
      { title: 'A dedicated partner', desc: 'A named growth partner who knows your organization, watches your funnel, and handles changes without a ticket queue.' },
    ],
    trustBand: true,
    ctaLine: 'Let’s scope your rollout.',
  },
};

export default function SolutionsPage() {
  const { slug } = useParams<{ slug: string }>();
  useReveal();
  const data = slug ? SIZES[slug] : undefined;
  if (!data) return <Navigate to="/carelu" replace />;

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 220px)', paddingBottom: 'clamp(40px, 6vw, 72px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff',
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>{data.pill}</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.6vw, 76px)',
            fontWeight: 400, color: INK, lineHeight: 1.06,
            letterSpacing: '-0.025em', margin: '26px auto 0', maxWidth: 820,
          }}>
            {data.h1}
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 600, margin: '24px auto 0',
          }}>
            {data.sub}
          </p>
          <div className="rv d3" style={{ display: 'inline-flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/demo" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
              padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.3s',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Get a Demo
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="/carelu#how-it-works" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 15, fontWeight: 600, color: INK,
              padding: '14px 26px', borderRadius: 100, textDecoration: 'none',
              border: '1.5px solid rgba(43,42,38,0.25)', background: 'transparent',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = INK; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(43,42,38,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >See How It Works</a>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ paddingTop: 'clamp(24px, 3vw, 40px)', paddingBottom: 'clamp(64px, 8vw, 110px)' }}>
        <div style={W}>
          <div className="sol-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {data.features.map((f, i) => (
              <div key={f.title} className={`rv d${Math.min(i + 1, 5)}`} style={{
                background: '#fff', borderRadius: 22,
                padding: 'clamp(28px, 3.2vw, 40px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <span style={{
                  display: 'inline-flex', width: 10, height: 10, borderRadius: '50%',
                  background: LIME, border: `1.5px solid ${INK}`, marginBottom: 18,
                }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.1vw, 27px)',
                  fontWeight: 400, color: INK, lineHeight: 1.2,
                  letterSpacing: '-0.5px', margin: '0 0 10px',
                }}>{f.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.62)', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {data.trustBand && (
            <div className="rv" style={{
              marginTop: 18, background: '#fff', borderRadius: 22,
              padding: 'clamp(24px, 3vw, 36px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
              gap: 'clamp(16px, 3vw, 40px)',
            }}>
              {['HIPAA', 'SOC 2 Type II', 'AES-256', 'US-only data', 'BAA signed'].map(label => (
                <span key={label} style={{
                  fontSize: 13, fontWeight: 600, color: INK,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ paddingBottom: 'clamp(80px, 10vw, 140px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 400, color: INK, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 28px',
          }}>
            {data.ctaLine}
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
            padding: '16px 32px', borderRadius: 100, textDecoration: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </section>

      {/* Minimal footer */}
      <footer style={{ borderTop: `1px solid ${HAIR}`, padding: '28px 0' }}>
        <div style={{ ...W, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>
            © {new Date().getFullYear()} Carelu — The front office of care
          </span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .sol-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
