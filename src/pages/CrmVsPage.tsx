import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { crms, CRM_ROWS } from '../data/crms';
import type { CrmConfig } from '../data/crms';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — CRM VS PAGES (/carelu-vs-:slug)
   Config-driven from src/data/crms.ts. A CRM is software your team
   operates; Carelu does the intake itself. Every page ends on the
   two-sided turn: combine (Carelu works inside your CRM) OR use
   Carelu as your CRM.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };
const MEASURE: React.CSSProperties = { maxWidth: 780, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

function CrmGuide({ config }: { config: CrmConfig }) {
  useReveal();
  useSeo({
    title: config.metaTitle,
    description: config.metaDescription,
    canonical: `/carelu-vs-${config.slug}`,
  });
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'crmvs-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: config.h1,
          description: config.metaDescription,
          url: `https://carelu.com/carelu-vs-${config.slug}`,
          author: { '@type': 'Organization', name: 'Carelu', url: 'https://carelu.com/' },
          publisher: { '@id': 'https://carelu.com/#organization' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: config.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById('crmvs-jsonld')?.remove(); };
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
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>{config.pill}</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 62px)', fontWeight: 400,
            color: INK, lineHeight: 1.07, letterSpacing: '-0.022em', margin: '26px auto 0', maxWidth: 820,
          }}>
            {config.h1}
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 620, margin: '20px auto 0',
          }}>
            {config.name} is {config.category}. Carelu is a care enablement platform — it doesn’t track your intake, it does it.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div style={MEASURE}>
          {config.intro.map((p, i) => (
            <p key={i} className="rv" style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', color: 'rgba(43,42,38,0.78)', lineHeight: 1.75, margin: '0 0 20px' }}>{p}</p>
          ))}
        </div>
      </section>

      {/* What it is / Carelu */}
      <section style={{ padding: 'clamp(16px, 2.5vw, 30px) 0' }}>
        <div style={W}>
          <div className="crm-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="rv" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', marginBottom: 12 }}>What {config.name} is</div>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.72)', lineHeight: 1.7, margin: 0 }}>{config.whatItIs}</p>
            </div>
            <div className="rv d1" style={{ background: INK, borderRadius: 20, padding: 'clamp(24px, 3vw, 34px)', boxShadow: '0 14px 44px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4F25C', marginBottom: 12 }}>The difference</div>
              <p style={{ fontSize: 15.5, color: 'rgba(250,248,243,0.9)', lineHeight: 1.7, margin: 0 }}>{config.angle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ paddingTop: 'clamp(28px, 4vw, 46px)' }}>
        <div style={W}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)', fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em', margin: '0 0 18px', textAlign: 'center' }}>Same job. Who actually does it?</h2>
          <div className="rv" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIR}` }}>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', width: '32%' }}>The job</th>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)' }}>{config.name}</th>
                    <th style={{ textAlign: 'left', padding: '16px 22px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN }}>Carelu</th>
                  </tr>
                </thead>
                <tbody>
                  {CRM_ROWS.map((r, i) => (
                    <tr key={r.job} style={{ borderBottom: i < CRM_ROWS.length - 1 ? `1px solid ${HAIR}` : 'none', background: i === CRM_ROWS.length - 1 ? 'rgba(63,122,52,0.04)' : 'transparent' }}>
                      <td style={{ padding: '14px 22px', fontSize: 14, fontWeight: 600, color: INK, lineHeight: 1.45 }}>{r.job}</td>
                      <td style={{ padding: '14px 22px', fontSize: 13.5, color: 'rgba(43,42,38,0.6)', lineHeight: 1.5 }}>{r.crm}</td>
                      <td style={{ padding: '14px 22px', fontSize: 13.5, color: '#2e5a26', fontWeight: 600, lineHeight: 1.5 }}>{r.carelu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="rv" style={{ fontSize: 12, color: 'rgba(43,42,38,0.45)', margin: '12px 0 0', textAlign: 'center' }}>
            {config.name} capabilities summarized at category level from public information — verify specifics with the vendor.
          </p>
        </div>
      </section>

      {/* Combine OR replace */}
      <section style={{ paddingTop: 'clamp(40px, 6vw, 74px)' }}>
        <div style={W}>
          <div className="crm-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div className="rv" style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(63,122,52,0.2)', padding: 'clamp(24px, 3.2vw, 34px)', boxShadow: '0 6px 28px rgba(46,90,38,0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GREEN, marginBottom: 12 }}>Option 1 · Combine them</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 24px)', fontWeight: 400, color: INK, margin: '0 0 10px', letterSpacing: '-0.01em' }}>Keep {config.name}. Carelu works inside it.</h3>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.72)', lineHeight: 1.68, margin: 0 }}>
                Carelu connects to {config.name} and does all the intake work — answering, qualifying,
                verifying, collecting documents — then syncs the complete, verified record straight into it.
                Your pipeline, your reports, your team’s habits: unchanged. They just fill themselves now.
              </p>
            </div>
            <div className="rv d1" style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 3.2vw, 34px)', boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.5)', marginBottom: 12 }}>Option 2 · Replace it</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 24px)', fontWeight: 400, color: INK, margin: '0 0 10px', letterSpacing: '-0.01em' }}>Or use Carelu as your CRM.</h3>
              <p style={{ fontSize: 15, color: 'rgba(43,42,38,0.72)', lineHeight: 1.68, margin: 0 }}>
                Don’t have a CRM you’re attached to? Carelu can be your system of record for families and
                intake — with a live queue, complete records, and status on everyone — so you skip the
                cost and upkeep of running {config.name} entirely. Either way, the intake is done for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'clamp(40px, 5.5vw, 64px)' }}>
        <div style={MEASURE}>
          <h2 className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.6vw, 31px)', fontWeight: 400, color: INK, lineHeight: 1.2, letterSpacing: '-0.014em', margin: '0 0 16px' }}>Common questions</h2>
          {config.faq.map((f) => (
            <div key={f.q} className="rv" style={{ borderTop: `1px solid ${HAIR}`, padding: '16px 0' }}>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: INK, margin: '0 0 7px', fontFamily: 'var(--font-body)' }}>{f.q}</h3>
              <p style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.68)', lineHeight: 1.68, margin: 0 }}>{f.a}</p>
            </div>
          ))}
          <p className="rv" style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.55)', margin: '22px 0 0' }}>
            See the full picture: <a href="/carelu-vs-crm" style={{ color: '#2e5a26', fontWeight: 600 }}>Carelu vs. a CRM</a> ·
            {' '}<a href="/integrations" style={{ color: '#2e5a26', fontWeight: 600 }}>all integrations</a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px, 8vw, 96px) 0 clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 400, color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
            Stop running software. Start admitting families.
          </p>
          <p className="rv d1" style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)', lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px' }}>
            See Carelu run a full intake end to end — and drop the finished record into {config.name}, or hold it as your own.
          </p>
          <a href="/demo" className="rv d2" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600,
            color: BONE, backgroundColor: INK, padding: '16px 32px', borderRadius: 100, textDecoration: 'none',
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

      <SiteFooter />

      <style>{`@media (max-width: 820px) { .crm-two { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

export default function CrmVsPage() {
  const slug = useLocation().pathname.replace(/^\/carelu-vs-/, '');
  const config = slug ? crms[slug] : undefined;
  if (!config) return <Navigate to="/carelu-vs-crm" replace />;
  return <CrmGuide config={config} />;
}
