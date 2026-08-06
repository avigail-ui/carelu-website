import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { payers, PAYER_REVIEWED, STATE_META } from '../data/payers';
import type { PayerConfig, PayerSource } from '../data/payers';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — PAYER GUIDES (/payers/:slug)
   ABA coverage & prior-auth guides per payer, driven by
   src/data/payers.ts. Verification-guide framing: primary sources
   linked, "last reviewed" + verify disclaimer on every page.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';
const GREEN_DKC = '#2e5a26';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 780, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

function usePayerJsonLd(config: PayerConfig) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'payer-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: config.h1,
          description: config.metaDescription,
          url: `https://carelu.com/payers/${config.slug}`,
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
    return () => { document.getElementById('payer-jsonld')?.remove(); };
  }, [config]);
}

function PayerGuide({ config }: { config: PayerConfig }) {
  useReveal();
  useSeo({
    title: config.metaTitle,
    description: config.metaDescription,
    canonical: `/payers/${config.slug}`,
  });
  usePayerJsonLd(config);

  // Numbered source list: the guide's sources plus any section-level cites not
  // already in it. Superscript markers in the text reference these numbers.
  const allSources: PayerSource[] = [...config.sources];
  for (const s of config.sections) {
    for (const c of s.cites ?? []) {
      if (!allSources.some((x) => x.url === c.url)) allSources.push(c);
    }
  }
  const srcNum = (url: string) => allSources.findIndex((x) => x.url === url) + 1;
  const CiteSup = ({ cites }: { cites?: PayerSource[] }) => {
    if (!cites || cites.length === 0) return null;
    return (
      <sup style={{ fontSize: '0.68em', lineHeight: 0 }}>
        {cites.map((c, i) => (
          <a key={c.url} href={`#src-${srcNum(c.url)}`} title={c.title}
            style={{ color: GREEN_DKC, textDecoration: 'none', fontWeight: 700, marginLeft: i === 0 ? 3 : 2 }}>
            [{srcNum(c.url)}]
          </a>
        ))}
      </sup>
    );
  };

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
            letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 840,
          }}>
            {config.h1}
          </h1>
          <div className="rv d2" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'center', margin: '18px auto 0' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: GREEN_DKC, background: 'rgba(63,122,52,0.08)', padding: '6px 13px', borderRadius: 100 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></svg>
              Last updated {PAYER_REVIEWED}
            </span>
            <a href="#sources" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: 'rgba(43,42,38,0.65)', background: '#fff', padding: '6px 13px', borderRadius: 100, textDecoration: 'none', border: '1px solid rgba(43,42,38,0.1)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
              {config.sources.length} primary sources
            </a>
          </div>
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
          {config.kind === 'medicaid-mco' && config.parent && (
            <div className="rv" style={{ background: 'rgba(63,122,52,0.05)', border: '1px solid rgba(63,122,52,0.18)', borderRadius: 14, padding: '14px 20px', margin: '4px 0 8px', fontSize: 13.5, color: 'rgba(43,42,38,0.72)', lineHeight: 1.6 }}>
              This plan administers the <strong style={{ color: INK }}>{config.parent}</strong> ABA benefit — the state rules are the floor, and this page covers what the plan layers on top.
              {(() => {
                const parentGuide = Object.values(payers).find((p) => p.kind === 'state-medicaid' && p.state === config.state);
                return parentGuide ? <> Read it together with the <a href={`/payers/${parentGuide.slug}`} style={{ color: GREEN_DKC, fontWeight: 600 }}>{parentGuide.payer} guide →</a></> : null;
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Prior auth + diagnosis at a glance — the questions every intake team asks first */}
      {(config.assessmentPA || config.treatmentPA || config.dxRequired) && (
        <section style={{ paddingTop: 'clamp(8px, 1.5vw, 16px)' }}>
          <div style={MEASURE}>
            <div className="rv" style={{
              background: '#fff', borderRadius: 18, border: '1.5px solid rgba(63,122,52,0.3)',
              boxShadow: '0 6px 28px rgba(46,90,38,0.08)', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}>
              {[
                { label: 'Prior auth for the assessment', value: config.assessmentPA },
                { label: 'Prior auth for treatment', value: config.treatmentPA },
                { label: 'Autism diagnosis required?', value: config.dxRequired },
              ].filter((x) => x.value).map((x) => (
                <div key={x.label} style={{ padding: 'clamp(16px, 2.2vw, 22px)', borderTop: `3px solid ${GREEN}` }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: GREEN, marginBottom: 7 }}>{x.label}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: INK, lineHeight: 1.55 }}>{x.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* At a glance */}
      <section style={{ padding: 'clamp(16px, 2.5vw, 30px) 0' }}>
        <div style={W}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 20,
            padding: 'clamp(22px, 3vw, 32px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px 34px',
          }}>
            {config.atGlance.map((f) => (
              <div key={f.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: `1px solid ${HAIR}`, paddingBottom: 12 }}>
                <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', width: 118, paddingTop: 2 }}>{f.label}</span>
                <span style={{ fontSize: 14, color: INK, lineHeight: 1.5, fontWeight: 500 }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      {config.sections.map((s) => (
        <section key={s.h2} style={{ paddingTop: 'clamp(24px, 3.2vw, 40px)' }}>
          <div style={MEASURE}>
            <h2 className="rv" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)',
              fontWeight: 400, color: INK, lineHeight: 1.2,
              letterSpacing: '-0.014em', margin: '0 0 14px',
            }}>{s.h2}</h2>
            {s.body?.map((p, i) => (
              <p key={i} className="rv" style={{ fontSize: 15.5, color: 'rgba(43,42,38,0.72)', lineHeight: 1.75, margin: '0 0 16px' }}>
                {p}<CiteSup cites={s.cites} />
              </p>
            ))}
            {s.list && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 4 }}>
                {s.list.map((item) => (
                  <div key={item.title} className="rv" style={{
                    background: '#fff', borderRadius: 15,
                    padding: 'clamp(16px, 2.2vw, 22px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
                  }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: INK, margin: '0 0 5px', fontFamily: 'var(--font-body)' }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.65)', lineHeight: 1.62, margin: 0 }}>
                      {item.desc}<CiteSup cites={s.cites} />
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Commercial national guides: how the policy plays out state by state */}
      {config.kind === 'commercial' && config.state === 'US' && (
        <section style={{ paddingTop: 'clamp(36px, 5vw, 56px)' }}>
          <div style={MEASURE}>
            <h2 className="rv" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)',
              fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em', margin: '0 0 10px',
            }}>How {config.payer} works state by state</h2>
            <p className="rv" style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.7, margin: '0 0 16px' }}>
              The clinical policy above is national, but three state-level layers change what a family's card actually buys:
              the state autism mandate (what fully-insured plans must cover), the carrier's state Medicaid plans (which follow
              the state Medicaid rules, not this commercial policy), and plan funding type (self-funded ERISA plans can carve
              benefits differently). Here's the picture in the states we cover:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STATE_META.map((st) => {
                const familyPlans = Object.values(payers).filter(
                  (p) => p.kind === 'medicaid-mco' && p.state === st.code && p.family && p.family === config.family
                );
                return (
                  <div key={st.code} className="rv" style={{ background: '#fff', borderRadius: 14, padding: 'clamp(14px, 2vw, 20px)', boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>{st.name}</span>
                      <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.5)' }}>Mandate: {st.mandate}</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.6, margin: 0 }}>
                      Fully-insured {config.payer} plans issued in {st.name} sit under the state mandate above.{' '}
                      {familyPlans.length > 0 ? (
                        <>For Medicaid members, {config.payer} operates{' '}
                          {familyPlans.map((p, i) => (
                            <span key={p.slug}>
                              {i > 0 && (i === familyPlans.length - 1 ? ' and ' : ', ')}
                              <a href={`/payers/${p.slug}`} style={{ color: GREEN_DKC, fontWeight: 600 }}>{p.payer}</a>
                            </span>
                          ))}
                          {' '}— covered by its own guide, not this one.{' '}
                        </>
                      ) : null}
                      State Medicaid baseline:{' '}
                      <a href={`/payers/${st.medicaidSlug}`} style={{ color: GREEN_DKC, fontWeight: 600 }}>
                        {payers[st.medicaidSlug]?.payer ?? st.name} guide →
                      </a>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* What intake should collect */}
      <section style={{ paddingTop: 'clamp(36px, 5vw, 56px)' }}>
        <div style={MEASURE}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 20,
            border: '1px solid rgba(63,122,52,0.2)',
            padding: 'clamp(24px, 3.2vw, 34px)',
            boxShadow: '0 6px 28px rgba(46,90,38,0.08)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 14 }}>
              What intake should collect for {config.payer}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {config.collect.map((c) => (
                <div key={c.title} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 19, height: 19, borderRadius: '50%', background: 'rgba(63,122,52,0.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(43,42,38,0.75)' }}>
                    <strong style={{ color: INK, fontWeight: 700 }}>{c.title}</strong> — {c.desc}
                  </span>
                </div>
              ))}
            </div>
            <a href="/downloads/aba-verification-call-checklist.pdf" download style={{
              display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 20,
              fontSize: 13.5, fontWeight: 600, color: GREEN_DKC, textDecoration: 'none',
              borderBottom: '1.5px solid rgba(63,122,52,0.4)', paddingBottom: 2,
            }}>
              Download the free verification-call checklist (PDF)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </a>
          </div>
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

      {/* Sources + disclaimer */}
      <section id="sources" style={{ paddingTop: 'clamp(30px, 4vw, 46px)', scrollMarginTop: 90 }}>
        <div style={MEASURE}>
          <div className="rv" style={{ padding: '18px 22px', borderLeft: `3px solid rgba(43,42,38,0.2)`, background: 'rgba(43,42,38,0.03)', borderRadius: '0 12px 12px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Primary sources</div>
            <ol style={{ margin: 0, padding: '0 0 0 22px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {allSources.map((s, i) => (
                <li key={s.url} id={`src-${i + 1}`} style={{ fontSize: 13, lineHeight: 1.55, scrollMarginTop: 100 }}>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'rgba(43,42,38,0.75)' }}>{s.title}</a>
                </li>
              ))}
            </ol>
            <p style={{ fontSize: 12, color: 'rgba(43,42,38,0.55)', lineHeight: 1.6, margin: '12px 0 0' }}>
              Payer policies change frequently and vary by plan, state, and funding type. This guide was
              compiled from the sources above and last reviewed {PAYER_REVIEWED}; it is general information,
              not billing, legal, or clinical advice. Always verify current requirements against the payer's
              live policy and a benefits check for the specific member.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)',
            fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Carelu collects all of this automatically.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 560, margin: '0 auto 30px',
          }}>
            Every ID, document, and detail this payer requires — gathered conversationally the moment a
            family reaches out, with insurance verified before your team touches the file.
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
      <SiteFooter />
    </div>
  );
}

export default function PayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? payers[slug] : undefined;
  if (!config) return <Navigate to="/carelu" replace />;
  return <PayerGuide config={config} />;
}
