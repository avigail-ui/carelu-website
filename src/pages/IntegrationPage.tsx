import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { integrations } from '../data/integrations';
import type { IntegrationConfig } from '../data/integrations';

/* ================================================================
   CARELU — INTEGRATION PAGES (/integrations/:slug)
   Partnership pages driven by src/data/integrations.ts. Carelu is
   the intake layer that CONNECTS to these platforms — additive
   framing only; the platforms are partners, not competitors.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 780, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

function IntegrationGuide({ config }: { config: IntegrationConfig }) {
  useReveal();
  useSeo({
    title: config.metaTitle,
    description: config.metaDescription,
    canonical: `/integrations/${config.slug}`,
  });
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'integration-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: config.h1,
          description: config.metaDescription,
          url: `https://carelu.com/integrations/${config.slug}`,
          author: { '@type': 'Organization', name: 'Carelu', url: 'https://carelu.com/' },
          publisher: { '@id': 'https://carelu.com/#organization' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: config.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('integration-jsonld')?.remove(); };
  }, [config]);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(28px, 4vw, 46px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff',
              padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>{config.pill}</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.6vw, 60px)',
            fontWeight: 400, color: INK, lineHeight: 1.08,
            letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 880,
          }}>
            {config.h1}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div style={MEASURE}>
          {config.intro.map((p, i) => (
            <p key={i} className="rv" style={{
              fontSize: 'clamp(16px, 1.6vw, 18px)', color: 'rgba(43,42,38,0.78)',
              lineHeight: 1.75, margin: '0 0 20px',
            }}>{p}</p>
          ))}
        </div>
      </section>

      {/* What it is / what Carelu adds */}
      <section style={{ padding: 'clamp(16px, 2.5vw, 30px) 0' }}>
        <div style={W}>
          <div className="int-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="rv" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', marginBottom: 12 }}>
                What {config.name} does
              </div>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.72)', lineHeight: 1.7, margin: 0 }}>{config.whatItIs}</p>
            </div>
            <div className="rv d1" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', border: '1px solid rgba(63,122,52,0.2)', boxShadow: '0 6px 28px rgba(46,90,38,0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 12 }}>
                What Carelu adds
              </div>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.72)', lineHeight: 1.7, margin: 0 }}>{config.whatCareluAdds}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — flow */}
      <section style={{ paddingTop: 'clamp(28px, 4vw, 46px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)',
            fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em',
            margin: '0 0 18px', textAlign: 'center',
          }}>How it works together</h2>
          <div className="int-flow" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {config.flow.map((s, i) => (
              <div key={s.title} className={`rv d${Math.min(i + 1, 4)}`} style={{
                background: '#fff', borderRadius: 18, padding: 'clamp(20px, 2.4vw, 26px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(63,122,52,0.12)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 12,
                }}>{i + 1}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: INK, margin: '0 0 7px', fontFamily: 'var(--font-body)' }}>{s.title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who runs which job */}
      <section style={{ paddingTop: 'clamp(32px, 4.5vw, 52px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)',
            fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em',
            margin: '0 0 18px', textAlign: 'center',
          }}>One funnel, clear lanes</h2>
          <div className="rv" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', padding: '6px 0' }}>
            {config.rows.map((r, i) => (
              <div key={r.job} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                padding: '13px 22px',
                borderBottom: i < config.rows.length - 1 ? `1px solid ${HAIR}` : 'none',
              }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: INK, lineHeight: 1.5 }}>{r.job}</span>
                <span style={{
                  flexShrink: 0, fontSize: 12.5, fontWeight: 700, padding: '5px 14px', borderRadius: 100,
                  color: r.where === 'Carelu' ? '#fff' : 'rgba(43,42,38,0.75)',
                  background: r.where === 'Carelu' ? GREEN : 'rgba(43,42,38,0.07)',
                }}>{r.where}</span>
              </div>
            ))}
          </div>
          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', margin: '12px 0 0', textAlign: 'center' }}>
            Third-party capabilities summarized at category level from public information — verify specifics with the vendor.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(38px, 5vw, 58px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)',
            fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em', margin: '0 0 16px',
          }}>Common questions</h2>
          {config.faq.map((f) => (
            <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 7px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.68, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)',
            fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Your platform, plus a front office that never sleeps.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px',
          }}>
            See Carelu answer, qualify, and admit a family end to end — and deliver the finished record into {config.name}.
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 15, fontWeight: 600, color: BONE, backgroundColor: INK,
            padding: '16px 32px', borderRadius: 100, textDecoration: 'none',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)', transition: 'transform 0.2s',
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
        @media (max-width: 980px) { .int-flow { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .int-flow { grid-template-columns: 1fr !important; } }
        @media (max-width: 820px) { .int-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default function IntegrationPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? integrations[slug] : undefined;
  if (!config) return <Navigate to="/carelu" replace />;
  return <IntegrationGuide config={config} />;
}
