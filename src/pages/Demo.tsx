import { DemoFlow } from '../components/DemoModal';

/* ============================================================
   CARELU DEMO PAGE — fallback for direct visits to /demo.
   The primary path is the on-page overlay (DemoModalHost);
   this page hosts the same gated form + calendar flow on the
   brand's dark panel over the bone background.
   ============================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';

function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', justifyContent: 'center',
      padding: '16px 20px 0',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 16,
        height: 56, borderRadius: 18, padding: '0 8px 0 24px',
        background: 'rgba(250,248,243,0.72)',
        backdropFilter: 'blur(32px) saturate(1.3)', WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
        border: '1px solid rgba(43,42,38,0.07)',
      }}>
        <a href="/carelu" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 30, width: 'auto', display: 'block' }} />
        </a>
        <a href="/carelu" style={{
          fontSize: 14, fontWeight: 500, color: 'rgba(43,42,38,0.84)', textDecoration: 'none',
          padding: '10px 18px', borderRadius: 100, transition: 'background 0.2s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(43,42,38,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >← Back to Carelu</a>
      </div>
    </nav>
  );
}

export default function Demo() {
  return (
    <div className="session-light" style={{ minHeight: '100vh', background: BONE, fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <main style={{ width: '100%', maxWidth: 1080, margin: '0 auto', flex: 1, padding: 'clamp(110px, 15vh, 150px) clamp(16px, 3vw, 40px) clamp(48px, 7vw, 88px)', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.6vw, 60px)',
            fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0,
          }}>
            See Carelu on your own intake.
          </h1>
          <p style={{ fontSize: 'clamp(15px, 1.3vw, 17px)', color: '#8C8674', lineHeight: 1.7, maxWidth: 520, margin: '16px auto 0' }}>
            Tell us a little about your practice and pick a time —
            we'll walk through your intake flow and show exactly how Carelu fits in.
          </p>
        </div>

        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <DemoFlow />
        </div>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 12, color: '#8C8674' }}>
          <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 20, width: 'auto', opacity: 0.8 }} />
          <span>© {new Date().getFullYear()} Carelu, Inc. · HIPAA · SOC 2</span>
        </div>
      </footer>
    </div>
  );
}
