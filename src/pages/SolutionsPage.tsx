import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';

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
      { title: 'Integrates with your stack', desc: 'Leading CRMs and EMRs — Salesforce, HubSpot, CentralReach, and more — plus webhooks for everything else. Launch without changing your core systems.' },
      { title: 'Security first', desc: 'HIPAA compliant, SOC 2 Type II, BAAs signed before you go live, US-only data centers. We support your security review end to end.' },
      { title: 'Rollouts, managed', desc: 'Phased launches across regions and brands, with location-specific rules configured for you — not by you.' },
      { title: 'A dedicated partner', desc: 'A named growth partner who knows your organization, watches your funnel, and handles changes without a ticket queue.' },
    ],
    trustBand: true,
    ctaLine: 'Let’s scope your rollout.',
  },
};

function Nav({ current }: { current: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  const tabs = [
    { t: 'Single-Site', slug: 'single-site' },
    { t: 'Multi-Site', slug: 'multi-site' },
    { t: 'Enterprise', slug: 'enterprise' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center', padding: '16px 20px 0',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', height: 56,
          borderRadius: 18, padding: '0 6px',
          background: 'rgba(250,248,243,0.72)',
          backdropFilter: 'blur(32px) saturate(1.3)', WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
          border: '1px solid rgba(43,42,38,0.07)',
        }}>
          <a href="/carelu" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0 20px 0 22px' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 28, width: 'auto', display: 'block' }} />
          </a>
          {tabs.map(tab => (
            <a key={tab.slug} href={`/solutions/${tab.slug}`} className="hide-mobile" style={{
              fontSize: 14, fontWeight: current === tab.slug ? 600 : 400,
              color: current === tab.slug ? INK : 'rgba(43,42,38,0.72)',
              textDecoration: 'none', padding: '8px 14px', borderRadius: 10,
              background: current === tab.slug ? 'rgba(43,42,38,0.06)' : 'transparent',
              transition: 'color 0.2s, background 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = INK; }}
              onMouseLeave={(e) => { if (current !== tab.slug) e.currentTarget.style.color = 'rgba(43,42,38,0.72)'; }}
            >{tab.t}</a>
          ))}
          <a href="/demo" style={{
            fontSize: 14, fontWeight: 600, color: INK,
            padding: '12px 24px', borderRadius: 14, textDecoration: 'none', marginLeft: 10,
            border: '1px solid rgba(0,0,0,0.08)', background: '#fff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
            transition: 'box-shadow 0.3s, transform 0.2s',
            display: 'inline-flex', alignItems: 'center',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.08)'; }}
          >Get a Demo</a>
          <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 11, marginLeft: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" style={{ display: 'block' }}>
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(250,248,243,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '96px 28px 28px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          onClick={() => setMobileOpen(false)}>
          {[
            { t: 'Home', href: '/carelu' },
            ...tabs.map(tab => ({ t: tab.t, href: `/solutions/${tab.slug}` })),
            { t: 'Company', href: '/carelu/company' },
          ].map(l => (
            <a key={l.t} href={l.href} style={{ fontSize: 22, fontWeight: 400, fontFamily: 'var(--font-display)', color: '#2B2A26', textDecoration: 'none', padding: '20px 0', borderBottom: `1px solid ${HAIR}` }}>{l.t}</a>
          ))}
          <a href="/demo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: INK, backgroundColor: '#fff', padding: '18px 24px', borderRadius: 14, textDecoration: 'none', marginTop: 32, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 18px rgba(0,0,0,0.1)' }}>
            Get a Demo
          </a>
        </div>
      )}
    </>
  );
}

export default function SolutionsPage() {
  const { slug } = useParams<{ slug: string }>();
  useReveal();
  const data = slug ? SIZES[slug] : undefined;
  if (!data) return <Navigate to="/carelu" replace />;

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav current={slug!} />

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
