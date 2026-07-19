import DemoModalHost from '../components/DemoModal';
import { useReveal } from '../hooks/useReveal';
import { useSeo } from '../hooks/useSeo';
import { Nav } from './Landing';
import { PAYER_REVIEWED } from '../data/payers';

/* ================================================================
   CARELU — PAYER DIRECTORY (/payers)
   Index of all ABA payer coverage & prior-auth guides, split into
   national commercial payers (policies apply across states) and
   state-specific guides. States/payers are added on a rolling basis;
   sources are re-checked on a schedule and each guide carries a
   "last reviewed" stamp.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const HAIR = 'rgba(43,42,38,0.08)';
const GREEN = '#3f7a34';

const W: React.CSSProperties = { maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

const NATIONAL = [
  { slug: 'aetna', name: 'Aetna', desc: 'CPB 0554 — ASD-only coverage, precert form GR-69017-4, telehealth codes.' },
  { slug: 'cigna', name: 'Cigna / Evernorth', desc: 'No PA on assessment codes; EN0499 treatment authorization; full telehealth.' },
  { slug: 'unitedhealthcare-optum', name: 'UnitedHealthcare / Optum', desc: 'Two-step auth via Provider Express, 4–6 month reviews, code clusters.' },
];

const STATES: { state: string; live: boolean; guides: { slug: string; name: string; desc: string }[] }[] = [
  {
    state: 'Georgia', live: true,
    guides: [
      { slug: 'georgia-medicaid', name: 'Georgia Medicaid (DCH)', desc: 'EPSDT coverage under 21, Katie Beckett path, CMO landscape, PA packages.' },
      { slug: 'anthem-bcbs-georgia', name: 'Anthem BCBS Georgia', desc: 'CG-BEH-02 criteria + Ava\'s Law and parity protections.' },
    ],
  },
];

const ROADMAP = ['North Carolina', 'New Jersey', 'Texas', 'Florida', 'TRICARE (Autism Care Demonstration)'];

function Card({ href, name, desc }: { href: string; name: string; desc: string }) {
  return (
    <a href={href} className="rv" style={{
      display: 'block', background: '#fff', borderRadius: 18,
      padding: 'clamp(20px, 2.6vw, 28px)', textDecoration: 'none',
      boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
      transition: 'transform 0.2s, box-shadow 0.25s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.09)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(19px, 2vw, 23px)', fontWeight: 400, color: INK, margin: 0, letterSpacing: '-0.01em' }}>{name}</h3>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
      <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.62)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </a>
  );
}

export default function PayersDirectory() {
  useReveal();
  useSeo({
    title: 'ABA Payer Guides: Coverage & Prior Auth by Insurer & State | Carelu',
    description:
      'Intake-focused guides to ABA insurance coverage and prior authorization — national commercial payers (Aetna, Cigna, UnitedHealthcare/Optum) plus state-specific Medicaid and BCBS guides. Updated on a rolling basis.',
    canonical: '/payers',
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
            }}>Payer Guides · Directory</span>
          </div>
          <h1 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.8vw, 64px)', fontWeight: 400,
            color: INK, lineHeight: 1.08, letterSpacing: '-0.02em', margin: '26px auto 0', maxWidth: 820,
          }}>
            ABA coverage, payer by payer.
          </h1>
          <p className="rv d2" style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(43,42,38,0.68)',
            lineHeight: 1.65, maxWidth: 620, margin: '22px auto 0',
          }}>
            Intake-focused guides to how each payer covers ABA — eligibility, prior authorization,
            documentation, and exactly what to collect from a family. Compiled from primary sources,
            re-checked on a schedule, last reviewed {PAYER_REVIEWED}.
          </p>
        </div>
      </section>

      {/* National payers */}
      <section style={{ paddingBottom: 'clamp(30px, 4vw, 48px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 400,
            color: INK, letterSpacing: '-0.012em', margin: '0 0 6px',
          }}>National commercial payers</h2>
          <p className="rv" style={{ fontSize: 14, color: 'rgba(43,42,38,0.6)', margin: '0 0 16px', lineHeight: 1.6 }}>
            These clinical policies apply across states (state mandates and plan funding layer on top — each guide covers how).
          </p>
          <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {NATIONAL.map((g) => <Card key={g.slug} href={`/payers/${g.slug}`} name={g.name} desc={g.desc} />)}
          </div>
        </div>
      </section>

      {/* State guides */}
      <section style={{ paddingBottom: 'clamp(30px, 4vw, 48px)' }}>
        <div style={W}>
          <h2 className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 400,
            color: INK, letterSpacing: '-0.012em', margin: '0 0 6px',
          }}>State-specific guides</h2>
          <p className="rv" style={{ fontSize: 14, color: 'rgba(43,42,38,0.6)', margin: '0 0 16px', lineHeight: 1.6 }}>
            Medicaid programs and state-regulated plans, state by state.
          </p>
          {STATES.map((st) => (
            <div key={st.state} style={{ marginBottom: 18 }}>
              <div className="rv" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GREEN, marginBottom: 10 }}>{st.state}</div>
              <div className="dir-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {st.guides.map((g) => <Card key={g.slug} href={`/payers/${g.slug}`} name={g.name} desc={g.desc} />)}
              </div>
            </div>
          ))}
          <div className="rv" style={{
            marginTop: 8, background: 'rgba(63,122,52,0.05)', border: '1px dashed rgba(63,122,52,0.35)',
            borderRadius: 16, padding: 'clamp(18px, 2.4vw, 26px)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 6 }}>More states & payers on the way</div>
            <p style={{ fontSize: 13.5, color: 'rgba(43,42,38,0.65)', lineHeight: 1.6, margin: 0 }}>
              Next up: {ROADMAP.join(' · ')}. Guides are added on a rolling basis and every published
              guide's sources are re-checked on a schedule. Need a payer covered sooner?{' '}
              <a href="/demo" style={{ color: '#2e5a26', fontWeight: 600 }}>Tell us which one</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist download */}
      <section style={{ paddingBottom: 'clamp(40px, 5vw, 60px)' }}>
        <div style={W}>
          <div className="rv" style={{
            background: '#fff', borderRadius: 20, border: '1px solid rgba(63,122,52,0.22)',
            padding: 'clamp(22px, 3vw, 32px)', boxShadow: '0 6px 28px rgba(46,90,38,0.08)',
            display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 26px)', flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 4 }}>The verification-call checklist</div>
              <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.65)', lineHeight: 1.55, margin: 0 }}>
                Every question to ask on a benefits call — works for any payer, free to print and adapt.
              </p>
            </div>
            <a href="/downloads/aba-verification-call-checklist.pdf" download style={{
              display: 'inline-flex', alignItems: 'center', gap: 9, flexShrink: 0,
              fontSize: 14.5, fontWeight: 600, color: '#fff', backgroundColor: GREEN,
              padding: '13px 24px', borderRadius: 100, textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(46,90,38,0.24)', transition: 'transform 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Download the checklist
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingBottom: 'clamp(80px, 10vw, 130px)', textAlign: 'center' }}>
        <div style={W}>
          <p className="rv" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 42px)', fontWeight: 400,
            color: INK, lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Or let Carelu handle the payers for you.
          </p>
          <p className="rv d1" style={{
            fontSize: 'clamp(15px, 1.5vw, 17px)', color: 'rgba(43,42,38,0.65)',
            lineHeight: 1.65, maxWidth: 540, margin: '0 auto 30px',
          }}>
            Carelu captures every ID and document each payer requires and verifies benefits at first contact — automatically, for every family.
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
        @media (max-width: 900px) { .dir-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .dir-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
