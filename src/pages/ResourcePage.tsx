import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { resources } from '../data/resources';
import type { ResourceConfig } from '../data/resources';

/* ================================================================
   CARELU — RESOURCE ARTICLES (/resources/:slug)
   Intent-matched BoFu guides driven by src/data/resources.ts.
   Brand system matches SolutionsPage: bone surface, ink text,
   EB Garamond display, floating pill nav, minimal footer.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

/* Article + FAQPage JSON-LD, injected per page and cleaned up on unmount. */
function useArticleJsonLd(config: ResourceConfig) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'resource-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: config.h1,
          description: config.metaDescription,
          url: `https://carelu.com/resources/${config.slug}`,
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
    return () => { document.getElementById('resource-jsonld')?.remove(); };
  }, [config]);
}

function ResourceArticle({ config }: { config: ResourceConfig }) {
  useReveal();
  useSeo({
    title: config.metaTitle,
    description: config.metaDescription,
    canonical: `/resources/${config.slug}`,
  });
  useArticleJsonLd(config);

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      {/* Hero */}
      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(32px, 4.5vw, 56px)', textAlign: 'center' }}>
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
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)',
            fontWeight: 400, color: INK, lineHeight: 1.08,
            letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 840,
          }}>
            {config.h1}
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section style={{ paddingBottom: 'clamp(8px, 1.5vw, 18px)' }}>
        <div style={MEASURE}>
          {config.intro.map((p, i) => (
            <p key={i} className="rv" style={{
              fontSize: 'clamp(16px, 1.6vw, 18.5px)', color: 'rgba(43,42,38,0.78)',
              lineHeight: 1.75, margin: '0 0 20px',
            }}>{p}</p>
          ))}
        </div>
      </section>

      {/* Sections */}
      {config.sections.map((s) => (
        <section key={s.h2} style={{ paddingTop: 'clamp(22px, 3vw, 36px)' }}>
          <div style={MEASURE}>
            <h2 className="rv" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
              fontWeight: 400, color: INK, lineHeight: 1.18,
              letterSpacing: '-0.015em', margin: '0 0 16px',
            }}>{s.h2}</h2>
            {s.body?.map((p, i) => (
              <p key={i} className="rv" style={{
                fontSize: 16, color: 'rgba(43,42,38,0.72)', lineHeight: 1.75, margin: '0 0 16px',
              }}>{p}</p>
            ))}
            {s.list && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
                {s.list.map((item) => (
                  <div key={item.title} className="rv" style={{
                    background: '#fff', borderRadius: 16,
                    padding: 'clamp(18px, 2.4vw, 24px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                  }}>
                    <h3 style={{
                      fontSize: 15.5, fontWeight: 700, color: INK,
                      margin: '0 0 6px', letterSpacing: '-0.005em', fontFamily: 'var(--font-body)',
                    }}>{item.title}</h3>
                    <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Download card */}
      {config.download && (
        <section style={{ paddingTop: 'clamp(36px, 5vw, 56px)' }}>
          <div style={MEASURE}>
            <div className="rv" style={{
              background: '#fff', borderRadius: 20,
              border: `1px solid rgba(63,122,52,0.22)`,
              padding: 'clamp(24px, 3.2vw, 36px)',
              display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 26px)', flexWrap: 'wrap',
              boxShadow: '0 6px 28px rgba(46,90,38,0.08)',
            }}>
              <span aria-hidden style={{
                flexShrink: 0, width: 46, height: 46, borderRadius: 14,
                background: 'rgba(63,122,52,0.10)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
                </svg>
              </span>
              <div style={{ flex: '1 1 280px' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 4 }}>Free template</div>
                <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.65)', lineHeight: 1.55, margin: 0 }}>{config.download.blurb}</p>
              </div>
              <a href={config.download.file} download style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                fontSize: 14.5, fontWeight: 600, color: '#fff', backgroundColor: GREEN,
                padding: '13px 24px', borderRadius: 100, textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(46,90,38,0.24)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {config.download.label.replace('Download the free ', 'Download ').replace(' (PDF)', '')}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.7vw, 33px)',
            fontWeight: 400, color: INK, lineHeight: 1.18,
            letterSpacing: '-0.015em', margin: '0 0 18px',
          }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {config.faq.map((f) => (
              <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '18px 0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: INK, margin: '0 0 8px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
                <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.68)', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 100px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 44px)',
            fontWeight: 400, color: INK, lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            {config.ctaHeadline}
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 560, margin: '0 auto 30px',
          }}>{config.ctaSub}</p>
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
    </div>
  );
}

export default function ResourcePage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? resources[slug] : undefined;
  if (!config) return <Navigate to="/carelu" replace />;
  return <ResourceArticle config={config} />;
}
