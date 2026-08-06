import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { integrations } from '../data/integrations';
import { crms } from '../data/crms';
import SiteFooter from '../components/SiteFooter';

/* ================================================================
   CARELU — INTEGRATIONS DIRECTORY (/integrations)
   Index of platform integration pages. Carelu connects to the
   systems providers already run and delivers complete intake
   records into them — partners, not competitors.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

export default function IntegrationsDirectory() {
  useReveal();
  useSeo({
    title: 'Integrations — Carelu Connects to the Systems You Already Run',
    description:
      'Carelu integrates with leading ABA practice-management platforms, EHRs, and CRMs — CentralReach, Rethink, Aloha ABA, Salesforce, HubSpot, and more — delivering complete intake records into your system of record.',
    canonical: '/integrations',
  });

  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <section style={{ paddingTop: 'clamp(150px, 18vw, 210px)', paddingBottom: 'clamp(28px, 4vw, 46px)', textAlign: 'center' }}>
        <div style={W}>
          <div className="rv">
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: INK, background: '#fff', padding: '10px 20px', borderRadius: 100,
              border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
            }}>Integrations</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)', fontWeight: 400,
            color: INK, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 860,
          }}>
            Carelu plays well with your stack.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 620, margin: '22px auto 0',
          }}>
            Keep the platform your practice runs on. Carelu answers, qualifies, and admits families
            in front of it — and delivers every complete, verified record into your system of record.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(30px, 4vw, 48px)' }}>
        <div style={W}>
          <div className="rv" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, margin: '0 0 12px' }}>Practice platforms & EHRs</div>
          <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {Object.values(integrations).map((g) => (
              <a key={g.slug} href={`/integrations/${g.slug}`} className="rv" style={{
                display: 'block', background: '#fff', borderRadius: 18,
                padding: 'clamp(20px, 2.6vw, 28px)', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.25s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.09)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 23px)', fontWeight: 400, color: INK, margin: 0, letterSpacing: '-0.01em' }}>{g.name}</h3>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
                <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.6, margin: 0 }}>{g.whatCareluAdds.slice(0, 130)}…</p>
              </a>
            ))}
          </div>

          <div className="rv" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, margin: '26px 0 12px' }}>CRMs</div>
          <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {Object.values(crms).map((c) => (
              <a key={c.slug} href={`/carelu-vs-${c.slug}`} className="rv" style={{
                display: 'block', background: '#fff', borderRadius: 18,
                padding: 'clamp(20px, 2.6vw, 28px)', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s, box-shadow 0.25s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.09)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 23px)', fontWeight: 400, color: INK, margin: 0, letterSpacing: '-0.01em' }}>{c.name}</h3>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
                <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.6, margin: 0 }}>
                  Carelu does the intake and syncs complete records into {c.name} — or serves as your CRM. See how it works.
                </p>
              </a>
            ))}
          </div>

          <div className="rv" style={{
            marginTop: 16, background: 'rgba(63,122,52,0.05)', border: '1px dashed rgba(63,122,52,0.35)',
            borderRadius: 16, padding: 'clamp(18px, 2.4vw, 26px)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 6 }}>Plus everything with a webhook</div>
            <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: 0 }}>
              Beyond the platforms and CRMs above, Carelu supports webhooks for anything custom. If your
              system isn't listed, it almost certainly still works.{' '}
              <a href="/demo" style={{ color: '#2e5a26', fontWeight: 600 }}>Ask us about yours</a>.
            </p>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 'clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <a href="/demo" className="rv" style={{
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

      <SiteFooter />

      <style>{`
        @media (max-width: 900px) { .dir-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .dir-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
