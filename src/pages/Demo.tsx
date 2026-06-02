import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ============================================================
   CARELU DEMO PAGE
   Hero w/ customer logos + Calendly embed
   ============================================================ */

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 36px' };

const logos = [
  { src: '/logos/strive-aba.png', alt: 'Strive ABA Therapy', w: 110 },
  { src: '/logos/golden-care.png', alt: 'Golden Care Therapy', w: 140 },
  { src: '/logos/grateful-care.avif', alt: 'Grateful Care ABA', w: 130 },
  { src: '/logos/supportive-care.png', alt: 'Supportive Care ABA', w: 160 },
  { src: '/logos/cross-river.png', alt: 'Cross River Therapy', w: 110 },
];

function Nav() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--gray-200)' }}>
      <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 96 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Carelu" style={{ height: 56, width: 'auto', display: 'block' }} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {['Platform', 'How It Works', 'FAQ'].map((t) => (
            <Link key={t} to={`/#${t.toLowerCase().replace(/\s+/g, '-')}`} className="hide-mobile nav-link" style={{ fontSize: '14px', fontWeight: 500, color: '#8C8674', textDecoration: 'none' }}>{t}</Link>
          ))}
          <Link to="/demo" className="btn-primary" style={{ fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#2C3E2D', padding: '10px 24px', borderRadius: '12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Request a Demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function Demo() {
  // Load Calendly script once
  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
      <Nav />

      {/* Hero — editorial serif, like Harvey */}
      <section style={{ paddingTop: 180, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Gradient mesh */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div className="orb-drift-1" style={{ position: 'absolute', width: 700, height: 700, top: -200, right: -150, borderRadius: '50%', background: 'radial-gradient(circle, var(--sage-100) 0%, transparent 70%)', filter: 'blur(80px)', opacity: 0.7 }} />
          <div className="orb-drift-2" style={{ position: 'absolute', width: 500, height: 500, bottom: -100, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,228,207,0.4) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div style={{ ...W, position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: 'EB Garamond, serif', fontSize: 'clamp(48px, 7vw, 84px)',
            fontWeight: 500, lineHeight: 1.05, letterSpacing: '-2px',
            color: 'var(--green-900)', marginBottom: 40, maxWidth: 900,
          }}>
            Somewhere right now, a parent is searching for <em style={{ fontStyle: 'italic' }}>care for their child.</em>
          </h1>
          <p style={{
            fontSize: 18, color: 'var(--gray-600)', lineHeight: 1.7,
            maxWidth: 520, marginBottom: 56,
          }}>
            Behavioral health providers nationwide trust Carelu to capture, qualify, and admit more families. Book a demo to see how it works for your practice.
          </p>

          {/* Customer logos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 44, flexWrap: 'wrap' }}>
            {logos.map((logo) => (
              <img key={logo.alt} src={logo.src} alt={logo.alt}
                style={{ width: logo.w, height: 36, objectFit: 'contain', opacity: 0.55 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Calendly embed section */}
      <section style={{ background: 'var(--green-900)', padding: '80px 36px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{
              display: 'inline-block', fontSize: 12, fontWeight: 600,
              color: 'var(--sage-300)', backgroundColor: 'rgba(255,255,255,0.08)',
              padding: '6px 16px', borderRadius: 999, marginBottom: 20,
            }}>Book a time</span>
            <h2 style={{
              fontFamily: 'EB Garamond, serif', fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 500, color: '#fff', lineHeight: 1.1, letterSpacing: '-1px',
              marginBottom: 12,
            }}>
              Pick a time that works.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto' }}>
              We'll walk through your intake flow and show you exactly how Carelu fits in.
            </p>
          </div>

          {/* Calendly widget — bottom overlay hides "Powered by Calendly" */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/d/cs28-9x7-qs3/leadtrap-demo?hide_gdpr_banner=1&background_color=ffffff&text_color=1b2e1e&primary_color=2c3e2d"
              style={{
                minWidth: 320, height: 740,
                background: '#fff',
              }}
            />
            {/* White cover over the Calendly footer */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0, bottom: 0,
              height: 40,
              background: '#fff',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 36px', borderTop: '1px solid var(--gray-200)' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Carelu" style={{ height: 32, width: 'auto', display: 'block', opacity: 0.55 }} />
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>HIPAA Compliant</span>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>SOC 2 Type II</span>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>© 2026 Carelu, Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
