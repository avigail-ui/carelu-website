import { useState, useEffect, useRef, useCallback } from 'react';
import { useReveal } from '../hooks/useReveal';
import NavDropdown from '../components/NavDropdown';

/* ================================================================
   LEADTRAP — $100K LANDING
   ================================================================
   Design principles:
   - Serif headlines, sans body. Type IS the design.
   - Monochromatic dark with one accent (#4A7C3F).
   - Generous whitespace. Nothing cramped.
   - Every element earns its place.
   ================================================================ */

const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);
function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 40px' };
const accent = '#4A7C3F';

// ── SCROLL PROGRESS ──
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (!ref.current) return;
      ref.current.style.transform = `scaleX(${window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)})`;
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);
  return <div ref={ref} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 2, background: `linear-gradient(90deg, ${accent}, rgba(43,42,38,0.2))`, transformOrigin: '0 0', transform: 'scaleX(0)', zIndex: 1000, willChange: 'transform' }} />;
}

// ── ANIMATED COUNTER ──
function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const dur = 2200, t0 = performance.now();
        (function tick(now: number) {
          const p = Math.min((now - t0) / dur, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 4)) * target));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

// ── SECTION LABEL ──
function Label({ children }: { children: string }) {
  return (
    <span className="rv" style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase' as const,
      color: accent, marginBottom: 24,
    }}>{children}</span>
  );
}

/* ================================================================
   NAV
   ================================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center',
        padding: '16px 20px 0',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          height: 72,
          borderRadius: 22,
          padding: '0 7px 0 0',
          background: 'rgba(250,248,243,0.72)',
          backdropFilter: 'blur(32px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
          border: '1px solid rgba(43,42,38,0.07)',
        }}>
          {/* Left links */}
          <a href="#product" className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px 0 28px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2C3E2D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.5)'; }}
          >Product</a>
          <a href="/carelu/company" className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2C3E2D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.5)'; }}
          >Company</a>

          {/* Center logo */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, margin: '0 100px' }}>
            <img src="/carelu-logo.png" alt="Carelu" style={{ height: 42, width: 'auto', display: 'block' }} />
          </a>

          {/* Right: login + button */}
          <a href="/login" className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2C3E2D'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.5)'; }}
          >Log in</a>
          <a href="/demo" style={{
            fontSize: 14, fontWeight: 500, color: '#fff',
            padding: '12px 24px', borderRadius: 14, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
            border: 'none',
            background: '#2C3E2D',
            transition: 'background 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1A2E1F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2C3E2D'; }}
          >
            Request demo
          </a>
          <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', top: 72, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(250,248,243,0.98)', backdropFilter: 'blur(20px)', padding: '40px 28px', display: 'flex', flexDirection: 'column' }}
          onClick={() => setMobileOpen(false)}>
          {['Platform', 'How It Works', 'Results', 'FAQ'].map(t => (
            <a key={t} href={`#${t.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: 22, fontWeight: 400, fontFamily: 'var(--font-display)', color: '#2B2A26', textDecoration: 'none', padding: '22px 0', borderBottom: '1px solid rgba(43,42,38,0.06)' }}>{t}</a>
          ))}
          <a href="/demo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: '#fff', backgroundColor: '#2C3E2D', padding: '18px 24px', borderRadius: 14, textDecoration: 'none', marginTop: 32 }}>
            Get a Demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      )}
    </>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const obs = new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.25 });
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ paddingTop: 200, paddingBottom: 0, position: 'relative', overflow: 'hidden', backgroundImage: 'linear-gradient(180deg, rgba(26,46,31,0.34) 0%, rgba(26,46,31,0.12) 32%, rgba(250,248,243,0) 62%, #FAF8F3 100%), url(/sky.jpg)', backgroundSize: 'cover', backgroundPosition: 'center top' }}>
      {/* Ambient glow behind video */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '140%', height: '80%', background: `radial-gradient(ellipse 50% 50% at 50% 60%, rgba(74,124,63,0.07) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ ...W, position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="hero-sub" style={{ marginBottom: 26 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 12.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.96)',
            background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.34)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: '9px 18px', borderRadius: 100,
          }}>The very first care enablement platform</span>
        </div>
        <h1 className="rv-scale" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 96px)',
          fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.03em',
          color: '#fff', maxWidth: 1000, margin: '0 auto',
        }}>
          <span className="hero-line">The future of intake is here.</span>
        </h1>

        {/* short divider */}
        <div className="hero-sub" style={{ width: 96, height: 1, background: '#ffffff', margin: '34px auto 0' }} />

        <p className="hero-sub" style={{
          fontSize: 'clamp(15px, 1.4vw, 19px)', color: 'rgba(255,255,255,0.94)',
          lineHeight: 1.7, maxWidth: 620, margin: '24px auto 44px',
          fontWeight: 400,
        }}>
          Carelu runs your entire intake operation — from first contact to admitted patient. Built for ABA therapy and behavioral health.
        </p>

        <div className="hero-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 80 }}>
          <a href="/demo" className="hero-cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 15, fontWeight: 600, color: '#fff', backgroundColor: '#2C3E2D',
            padding: '14px 32px', borderRadius: 100, textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.3s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1), 0 0 40px rgba(43,42,38,0.06)',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(43,42,38,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1), 0 0 40px rgba(43,42,38,0.06)'; }}
          >
            Get a Demo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#how-it-works" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.94)',
            padding: '14px 24px', borderRadius: 100, textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.45)',
            transition: 'color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#2C3E2D'; e.currentTarget.style.borderColor = 'rgba(43,42,38,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.5)'; e.currentTarget.style.borderColor = 'rgba(43,42,38,0.1)'; }}
          >
            See How It Works
          </a>
        </div>

        {/* Video with premium frame */}
        <div className="hero-visual" style={{
          maxWidth: 1000, margin: '0 auto',
          borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(43,42,38,0.08)',
          boxShadow: '0 0 0 1px rgba(43,42,38,0.04), 0 24px 80px rgba(0,0,0,0.5), 0 0 120px rgba(74,124,63,0.05)',
        }}>
          <video ref={videoRef} controls muted loop playsInline style={{ width: '100%', height: 'auto', display: 'block' }}>
            <source src="https://framerusercontent.com/assets/ZEFznJK3xO8gPZ8psOliFXvKwO0.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   LOGO BAR
   ================================================================ */
const allLogos = [
  { src: '/logos/strive-aba.png', alt: 'Strive ABA' },
  { src: '/logos/golden-care-full.png', alt: 'Golden Care' },
  { src: '/logos/grateful-care.avif', alt: 'Grateful Care' },
  { src: '/logos/supportive-care.png', alt: 'Supportive Care' },
  { src: '/logos/cross-river.png', alt: 'Cross River' },
  { src: '/logos/totalcare.webp', alt: 'Total Care' },
  { src: '/logos/above-beyond.webp', alt: 'Above & Beyond' },
  { src: '/logos/blossom-aba.webp', alt: 'Blossom ABA' },
  { src: '/logos/link-color.png', alt: 'Links ABA', smaller: true },
];

function LogoBar() {
  return (
    <div style={{ padding: '64px 0 72px' }}>
      <p className="rv" style={{
        fontSize: 12, fontWeight: 500, letterSpacing: '0.12em',
        textTransform: 'uppercase' as const, color: 'rgba(43,42,38,0.90)',
        textAlign: 'center', marginBottom: 40,
      }}>
        Trusted by 100+ of the fastest growing ABA providers
      </p>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, #FAF8F3, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to left, #FAF8F3, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div className="marquee-track" style={{ animation: 'marqueeScroll 50s linear infinite' }}>
          {[0, 1].map(set => (
            <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 72, paddingRight: 72 }}>
              {allLogos.map(logo => (
                <img key={`${set}-${logo.alt}`} src={logo.src} alt={logo.alt}
                  style={{ height: (logo as { smaller?: boolean }).smaller ? 58 : 82, width: 'auto', objectFit: 'contain', opacity: 0.85, flexShrink: 0, filter: (logo as { bright?: number }).bright ? `brightness(${(logo as { bright?: number }).bright})` : 'none' }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* Real tool logos raining down behind the problem headline — the "too many systems" chaos */
const RAIN_ICONS = [
  { n: 'zoho',                left: 5,  size: 40, dur: 9.0,  delay: 0.0 },
  { n: 'clickup',             left: 14, size: 32, dur: 10.5, delay: 1.8 },
  { n: 'monday',              left: 23, size: 42, dur: 7.8,  delay: 0.6 },
  { n: 'calendly',            left: 33, size: 34, dur: 9.6,  delay: 2.6 },
  { n: 'lobbie',              left: 42, size: 38, dur: 8.4,  delay: 0.3 },
  { n: 'intakeq',             left: 51, size: 30, dur: 11.0, delay: 3.4 },
  { n: 'docusign',            left: 60, size: 40, dur: 8.0,  delay: 1.1 },
  { n: 'pandadoc',            left: 69, size: 33, dur: 10.0, delay: 2.2 },
  { n: 'gmail',               left: 78, size: 42, dur: 7.5,  delay: 0.9 },
  { n: 'outlook',             left: 88, size: 34, dur: 9.2,  delay: 2.9 },
  { n: 'centralreach',        left: 95, size: 30, dur: 8.8,  delay: 4.2 },
  { n: 'calltrackingmetrics', left: 9,  size: 30, dur: 11.5, delay: 4.8 },
  { n: 'callrail',            left: 28, size: 32, dur: 10.2, delay: 5.2 },
  { n: 'salesforce',          left: 46, size: 38, dur: 8.6,  delay: 1.5 },
  { n: 'jotform',             left: 64, size: 30, dur: 11.2, delay: 3.8 },
  { n: 'typeform',            left: 83, size: 32, dur: 9.8,  delay: 4.5 },
  { n: 'googlesheets',        left: 19, size: 34, dur: 8.2,  delay: 3.0 },
  { n: 'ringcentral',         left: 56, size: 36, dur: 9.4,  delay: 0.4 },
  { n: 'rethink',             left: 73, size: 30, dur: 10.8, delay: 5.5 },
  { n: 'twilio',              left: 38, size: 40, dur: 7.9,  delay: 2.0 },
];

type RainBody = {
  n: string; size: number; left: number; drift: number;
  x: number; y: number; vx: number; vy: number;
  angle: number; vangle: number; el: HTMLDivElement | null;
};

/* Physics sandbox: logos fall in, bounce, and can be grabbed + thrown */
function IconPlayground({ opacity }: { opacity: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodiesRef = useRef<RainBody[]>([]);
  const dragRef = useRef<{ b: RainBody; offX: number; offY: number; vx: number; vy: number } | null>(null);
  const rafRef = useRef(0);

  if (bodiesRef.current.length === 0) {
    bodiesRef.current = RAIN_ICONS.map((ic) => ({
      n: ic.n, size: ic.size, left: ic.left, drift: 1.3 + Math.random() * 1.7,
      x: 0, y: 0, vx: 0, vy: 0,
      angle: Math.random() * 26 - 13, vangle: Math.random() * 1.6 - 0.8, el: null,
    }));
  }

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    let W = wrap.clientWidth, H = wrap.clientHeight;
    const onResize = () => { W = wrap.clientWidth; H = wrap.clientHeight; };
    window.addEventListener('resize', onResize);

    bodiesRef.current.forEach((b, i) => {
      b.x = (b.left / 100) * Math.max(W - b.size, 1);
      b.y = -b.size - (i % 7) * 110 - Math.random() * H * 0.6; // staggered above -> rains in over time
      b.vx = (Math.random() - 0.5) * 0.8; b.vy = b.drift;
    });

    const EY = 0.035, EX = 0.03, WALL = 0.6;
    const E = 0.72; // bounciness between tiles
    const step = () => {
      const drag = dragRef.current;
      const bodies = bodiesRef.current;

      // 1) integrate (dragged tile is positioned by the pointer)
      for (const b of bodies) {
        if (drag && drag.b === b) continue;
        b.vy += (b.drift - b.vy) * EY;   // ease back to a gentle fall after a throw
        b.vx += (0 - b.vx) * EX;
        b.x += b.vx; b.y += b.vy; b.angle += b.vangle; b.vangle *= 0.96;
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * WALL; b.vangle += 0.5; }
        else if (b.x > W - b.size) { b.x = W - b.size; b.vx = -Math.abs(b.vx) * WALL; b.vangle -= 0.5; }
        if (b.y > H + b.size) { // recycle to the top -> endless rain
          b.y = -b.size - Math.random() * 200;
          b.x = Math.random() * Math.max(W - b.size, 1);
          b.vx = (Math.random() - 0.5) * 0.8; b.vy = b.drift; b.angle = Math.random() * 26 - 13;
        }
      }

      // 2) tile-to-tile collisions — separate + elastic bounce (equal mass; dragged tile = immovable)
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i]; const ar = a.size * 0.46;
        const aDrag = !!drag && drag.b === a;
        for (let j = i + 1; j < bodies.length; j++) {
          const c = bodies[j]; const cr = c.size * 0.46;
          const dx = (c.x + c.size / 2) - (a.x + a.size / 2);
          const dy = (c.y + c.size / 2) - (a.y + a.size / 2);
          const min = ar + cr; const d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2); const nx = dx / d, ny = dy / d; const overlap = min - d;
          const cDrag = !!drag && drag.b === c;
          // positional separation
          if (aDrag && !cDrag) { c.x += nx * overlap; c.y += ny * overlap; }
          else if (cDrag && !aDrag) { a.x -= nx * overlap; a.y -= ny * overlap; }
          else if (!aDrag && !cDrag) { a.x -= nx * overlap / 2; a.y -= ny * overlap / 2; c.x += nx * overlap / 2; c.y += ny * overlap / 2; }
          // velocity impulse (treat a dragged tile as having zero velocity)
          const avx = aDrag ? 0 : a.vx, avy = aDrag ? 0 : a.vy;
          const cvx = cDrag ? 0 : c.vx, cvy = cDrag ? 0 : c.vy;
          const rvn = (cvx - avx) * nx + (cvy - avy) * ny;
          if (rvn < 0) {
            if (aDrag && !cDrag) { const jj = -(1 + E) * rvn; c.vx += jj * nx; c.vy += jj * ny; c.vangle += (Math.random() - 0.5) * 2.5; }
            else if (cDrag && !aDrag) { const jj = -(1 + E) * rvn; a.vx -= jj * nx; a.vy -= jj * ny; a.vangle += (Math.random() - 0.5) * 2.5; }
            else if (!aDrag && !cDrag) {
              const jj = -(1 + E) * rvn / 2;
              a.vx -= jj * nx; a.vy -= jj * ny; c.vx += jj * nx; c.vy += jj * ny;
              a.vangle -= jj * 0.5; c.vangle += jj * 0.5;
            }
          }
        }
      }

      // 3) paint
      for (const b of bodies) {
        if (b.el) b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.angle}deg)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', onResize); };
  }, []);

  const down = (b: RainBody) => (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current; if (!wrap) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
    const r = wrap.getBoundingClientRect();
    dragRef.current = { b, offX: (e.clientX - r.left) - b.x, offY: (e.clientY - r.top) - b.y, vx: 0, vy: 0 };
    b.vangle = 0;
  };
  const move = (b: RainBody) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current; const wrap = wrapRef.current;
    if (!drag || drag.b !== b || !wrap) return;
    const r = wrap.getBoundingClientRect();
    const nx = (e.clientX - r.left) - drag.offX;
    const ny = (e.clientY - r.top) - drag.offY;
    drag.vx = nx - b.x; drag.vy = ny - b.y;
    b.x = nx; b.y = ny;
  };
  const up = (b: RainBody) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    e.currentTarget.style.cursor = 'grab';
    if (!drag || drag.b !== b) return;
    const clamp = (v: number) => Math.max(-48, Math.min(48, v));
    b.vx = clamp(drag.vx * 1.15); b.vy = clamp(drag.vy * 1.15); b.vangle = clamp(drag.vx) * 0.4;
    dragRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  const interactive = opacity > 0.25;
  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 5, pointerEvents: 'none', opacity, transition: 'opacity 0.3s', visibility: opacity > 0.04 ? 'visible' : 'hidden' }}>
      {bodiesRef.current.map((b, i) => (
        <div key={i} ref={(el) => { b.el = el; }}
          onPointerDown={down(b)} onPointerMove={move(b)} onPointerUp={up(b)} onPointerCancel={up(b)}
          style={{
            position: 'absolute', top: 0, left: 0, width: b.size, height: b.size,
            borderRadius: b.size * 0.26, background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'grab', touchAction: 'none', userSelect: 'none', willChange: 'transform',
            pointerEvents: interactive ? 'auto' : 'none',
          }}>
          <img src={`/logos/rain/${b.n}.png`} alt="" draggable={false} style={{ width: '62%', height: '62%', objectFit: 'contain', pointerEvents: 'none' }} />
        </div>
      ))}
    </div>
  );
}

/* RiverFlow — channels merge as tributaries into one Carelu river -> completed intake */
const RIVER_CHANNELS: { label: string; y: number; c: string; trib: string; d: React.ReactNode }[] = [
  { label: 'Phone', y: 40,  c: '#4A7C3F', trib: 'M92,40 C 250,40 300,150 430,150',  d: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3" /> },
  { label: 'Text',  y: 95,  c: '#5E9462', trib: 'M92,95 C 250,95 330,150 430,150',  d: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" /> },
  { label: 'Email', y: 150, c: '#2C3E2D', trib: 'M92,150 L 430,150',                 d: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></> },
  { label: 'Web',   y: 205, c: '#4A7C3F', trib: 'M92,205 C 250,205 330,150 430,150', d: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20z" /></> },
  { label: 'Fax',   y: 260, c: '#5E9462', trib: 'M92,260 C 250,260 300,150 430,150', d: <><path d="M6 9V3h12v6" /><rect x="6" y="13" width="12" height="8" /><path d="M6 17H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" /></> },
];
const MAIN_RIVER = 'M430,150 C 560,108 700,192 846,150';

function RiverFlow() {
  return (
    <svg viewBox="0 0 920 300" fill="none" style={{ display: 'block', width: '100%', height: 'auto', maxWidth: 920, margin: '0 auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id="riverG" x1="430" y1="0" x2="846" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FA877" /><stop offset="1" stopColor="#2C3E2D" />
        </linearGradient>
        <radialGradient id="riverGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9CB98E" stopOpacity="0.32" /><stop offset="1" stopColor="#9CB98E" stopOpacity="0" />
        </radialGradient>
        <filter id="chipShadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A2E1F" floodOpacity="0.13" />
        </filter>
      </defs>

      {/* ambient glow */}
      <ellipse cx="610" cy="150" rx="390" ry="150" fill="url(#riverGlow)" />

      {/* tributaries */}
      {RIVER_CHANNELS.map((ch, i) => (
        <path key={`t${i}`} id={`trib${i}`} d={ch.trib} stroke="#B7C4A8" strokeWidth="1.6" strokeLinecap="round"
          style={{ strokeDasharray: '2 9', animation: 'riverDash 0.9s linear infinite' }} />
      ))}

      {/* main river: soft body + current + flowing glint */}
      <path d={MAIN_RIVER} stroke="#C8D0B8" strokeOpacity="0.55" strokeWidth="11" strokeLinecap="round" />
      <path id="mainRiver" d={MAIN_RIVER} stroke="url(#riverG)" strokeWidth="3.5" strokeLinecap="round" />
      <path d={MAIN_RIVER} stroke="#F0F5EE" strokeWidth="2" strokeLinecap="round"
        style={{ strokeDasharray: '4 18', animation: 'riverDash 0.9s linear infinite' }} />

      {/* tributary droplets — channels feeding the river */}
      {RIVER_CHANNELS.map((ch, i) => (
        <circle key={`td${i}`} r="3.2" fill={ch.c} opacity="0">
          <animateMotion dur="2.8s" begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href={`#trib${i}`} /></animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="2.8s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* droplets flowing down the main river */}
      {[0, 0.9, 1.8, 2.7].map((b, i) => (
        <circle key={`md${i}`} r="4.5" fill="#3B5E34" opacity="0">
          <animateMotion dur="3.6s" begin={`${b}s`} repeatCount="indefinite"><mpath href="#mainRiver" /></animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.86;1" dur="3.6s" begin={`${b}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* channel source chips */}
      {RIVER_CHANNELS.map((ch, i) => (
        <g key={`c${i}`}>
          <rect x="54" y={ch.y - 18} width="36" height="36" rx="11" fill="#fff" filter="url(#chipShadow)" />
          <g transform={`translate(63 ${ch.y - 9}) scale(0.75)`} stroke={ch.c} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none">{ch.d}</g>
          <text x="72" y={ch.y + 31} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="#2C3E2D" style={{ fontFamily: 'var(--font-body)' }}>{ch.label}</text>
        </g>
      ))}

      {/* completed node with pulse */}
      <circle cx="846" cy="150" r="30" fill="none" stroke="#2C3E2D" strokeOpacity="0.5">
        <animate attributeName="r" values="30;48" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;0" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="846" cy="150" r="30" fill="#2C3E2D" />
      <path d="M833 150l9 9 17 -18" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="846" y="202" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A2E1F" style={{ fontFamily: 'var(--font-body)' }}>Completed intake</text>
    </svg>
  );
}

/* easeOutBounce — drop with gravity acceleration, bounce on landing */
function easeOutBounce(x: number): number {
  const n1 = 7.5625, d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) { x -= 1.5 / d1; return n1 * x * x + 0.75; }
  if (x < 2.5 / d1) { x -= 2.25 / d1; return n1 * x * x + 0.9375; }
  x -= 2.625 / d1; return n1 * x * x + 0.984375;
}

/* ================================================================
   THE PROBLEM — Carelu-style browser chaos (dark mode)
   Sticky scroll: text → browser windows slam in → cursor closes → solution
   ================================================================ */
function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;
      setT(Math.max(0, Math.min(1, -rect.top / trackH)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = ['Monday.com', 'DocuSign', 'IntakeQ', 'Gmail', 'Google Voice', 'eFax', 'Outlook', 'Scheduling', 'Insurance...', 'Sheets', 'Slack', 'RingCentral', 'Jotform', 'Calendly', 'CentralReach', 'Zoho', 'PandaDoc'];

  // Phase timing
  const rainOpacity = Math.max(0, Math.min(1, (0.5 - t) / 0.12)); // icons rain during the calm headline beat, fade as windows arrive
  const browserVisible = t > 0.14;
  const enterProgress = t < 0.14 ? 0 : Math.min(1, (t - 0.14) / 0.12);
  const browserX = 0;
  const browserY = (1 - easeOutBounce(enterProgress)) * -72; // fall from the top, bounce on landing
  const cursorProgress = t < 0.3 ? 0 : Math.min(1, (t - 0.3) / 0.2);
  const ce = cursorProgress < 0.5 ? 2 * cursorProgress * cursorProgress : 1 - Math.pow(-2 * cursorProgress + 2, 2) / 2;
  const cursorX = 55 - ce * 52.5;
  const cursorY = 65 - ce * 62.5;
  const closed = t > 0.5;
  const closing = t > 0.55 && !closed;
  const closeScale = closing ? Math.max(0, 1 - (t - 0.55) * 14) : 1;

  return (
    <div ref={trackRef} style={{ height: '220vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        backgroundColor: closed ? '#F0F5EE' : '#fff',
        transition: 'background-color 0.5s',
        overflow: 'hidden',
      }}>
        {/* Ambient glow for solution phase -- no earth image, pure dark with subtle accent radial */}
        {t > 0.5 && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
              width: '120%', height: '80%',
              background: `radial-gradient(ellipse 40% 40% at 50% 40%, rgba(74,124,63,${Math.min((t - 0.5) * 2, 0.08)}) 0%, transparent 70%)`,
              transition: 'opacity 0.8s',
            }} />
          </div>
        )}

        {/* Draggable, throwable tool-logo playground during the calm headline beat */}
        <IconPlayground opacity={rainOpacity} />

        {/* Text overlay */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 36px', marginBottom: 32, width: '100%' }}>
          {/* Problem text */}
          <div style={{ opacity: t > 0.5 ? 0 : 1, transition: 'opacity 0.3s', position: 'absolute', inset: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, color: '#000', maxWidth: 640, margin: '0 auto 16px' }}>
              You're juggling multiple systems for inquiries, forms, insurance, and scheduling.
            </h2>
            <p style={{ fontSize: 17, color: '#666', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              Your team spends all day chasing families for missing forms and signatures — and still loses them before they ever get to care.
            </p>
          </div>
          {/* Solution headline + cards are rendered in a separate zIndex 9 layer below */}
          {/* Spacer */}
          <div style={{ visibility: 'hidden' }}>
            <span style={{ display: 'inline-block', fontSize: 11, marginBottom: 20 }}>&nbsp;</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.12, maxWidth: 640, margin: '0 auto 16px' }}>&nbsp;<br />&nbsp;</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>&nbsp;</p>
          </div>
        </div>

        {/* Floating capability pills around central glow -- Artisan style */}
        {t > 0.5 && (() => {
          const cw = Math.min(Math.max((t - 0.58) / 0.34, 0), 1); // headline gradient sweep

          return (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 9,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              opacity: t > 0.6 ? 1 : 0, transition: 'opacity 0.6s',
              pointerEvents: 'none',
            }}>
              {/* Headline */}
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 60px)',
                fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.02em',
                textAlign: 'center', marginBottom: 18, position: 'relative', zIndex: 2,
                backgroundImage: 'linear-gradient(90deg, #5E9462 0%, #4A7C3F 16%, #2C3E2D 34%, #4A7C3F 48%, #1A2E1F 58%, #1A2E1F 100%)',
                backgroundSize: '215% 100%',
                backgroundPosition: `${cw * 100}% 0`,
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
                transition: 'background-position 0.25s linear',
              }}>
                Carelu makes sure no one slips away
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(43,42,38,0.79)', textAlign: 'center', lineHeight: 1.6, maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 2 }}>
                Every channel, instant qualification, document and signature collection, and follow-up that never quits — all handled by one AI built for ABA intake.
              </p>

              {/* River: every channel flows through Carelu to a completed intake */}
              <div style={{ width: '100%', maxWidth: 940, margin: '36px auto 0', position: 'relative', zIndex: 2 }}>
                <RiverFlow />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ================================================================
   HOW IT WORKS — Monaco-style 3-section layout with animated mockups
   ================================================================ */
/* ===== How it works — Monaco-style auto-cycling feature sections ===== */
const MOCK_CARD: React.CSSProperties = { background: '#ffffff', borderRadius: 16, border: '1px solid rgba(43,42,38,0.06)', overflow: 'hidden' };
const FEATURE_BLOCK: React.CSSProperties = { background: '#ffffff', borderRadius: 20, border: '1px solid rgba(43,42,38,0.05)', padding: 'clamp(40px, 5vw, 64px)', marginBottom: 80 };
const STEP_H3: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 400, color: '#2B2A26', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' };
const STEP_SUB: React.CSSProperties = { fontSize: 14.5, color: 'rgba(43,42,38,0.74)', lineHeight: 1.7, marginBottom: 28, maxWidth: 420 };
const stepGrid = (mockFirst: boolean): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: mockFirst ? '1fr 1.1fr' : '1.1fr 1fr', gap: 56, alignItems: 'center' });

const MockHead = (title: string, badge?: { text: string; tone?: 'green' | 'accent' | 'amber' }) => (
  <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(43,42,38,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(43,42,38,0.90)' }}>{title}</span>
    {badge && (
      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100,
        background: badge.tone === 'green' ? 'rgba(34,197,94,0.12)' : badge.tone === 'amber' ? 'rgba(245,158,11,0.1)' : 'rgba(74,124,63,0.1)',
        color: badge.tone === 'green' ? '#22c55e' : badge.tone === 'amber' ? '#f59e0b' : accent }}>{badge.text}</span>
    )}
  </div>
);
const Check = (color = '#22c55e') => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>);

// A feature block whose bullets auto-advance while it's on screen, with the
// mock morphing to match. Clicking a bullet jumps to it. (Monaco's motion.)
function CycleStep({ heading, sub, bullets, mock, mockFirst = false, boxed = false }: {
  heading: React.ReactNode;
  sub: string;
  bullets: { label: string; desc: string }[];
  mock: (active: number) => React.ReactNode;
  mockFirst?: boolean;
  boxed?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActive((a) => (a + 1) % bullets.length), 4000);
    return () => clearInterval(id);
  }, [inView, bullets.length]);

  const text = (
    <div>
      <h3 style={STEP_H3}>{heading}</h3>
      <p style={STEP_SUB}>{sub}</p>
      <div>
        {bullets.map((b, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ display: 'block', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0 12px 20px', borderLeft: `2px solid ${active === i ? '#fff' : 'rgba(43,42,38,0.08)'}`, transition: 'border-color 0.4s', width: '100%' }}>
            <div style={{ fontSize: 14, fontWeight: active === i ? 600 : 400, color: active === i ? '#fff' : 'rgba(43,42,38,0.4)', transition: 'color 0.4s' }}>{b.label}</div>
            {active === i && <div style={{ fontSize: 13, color: 'rgba(43,42,38,0.86)', lineHeight: 1.6, marginTop: 6 }}>{b.desc}</div>}
          </button>
        ))}
      </div>
    </div>
  );

  const card = (
    <div style={MOCK_CARD}>
      <div key={active} style={{ animation: 'mockSwap 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
        {mock(active)}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="rv" style={boxed ? FEATURE_BLOCK : { marginBottom: 80 }}>
      <div className="mobile-stack" style={stepGrid(mockFirst)}>
        {mockFirst ? <>{card}{text}</> : <>{text}{card}</>}
      </div>
    </div>
  );
}

function HowItWorks() {
  // ── Section 1: They reach out. We pick up. ──
  const mock1 = (a: number) => {
    if (a === 0) return (<>
      {MockHead('Inbox', { text: 'Live', tone: 'accent' })}
      <div style={{ padding: '4px 0' }}>
        {[{ n: 'Maria T.', ch: 'Phone' }, { n: 'David K.', ch: 'Web form' }, { n: 'Sarah J.', ch: 'Text' }, { n: 'Luis R.', ch: 'Chat' }, { n: 'James W.', ch: 'Email' }].map((r, j, arr) => (
          <div key={j} style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: j < arr.length - 1 ? '1px solid rgba(43,42,38,0.04)' : 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `hsl(${j * 55 + 200}, 45%, 55%)`, color: '#2B2A26', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.n[0]}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(43,42,38,0.90)' }}>{r.n}</div><div style={{ fontSize: 10, color: 'rgba(43,42,38,0.82)' }}>{r.ch} · just now</div></div>
            <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: 'rgba(74,124,63,0.12)', color: accent }}>New</span>
          </div>
        ))}
      </div>
    </>);
    if (a === 1) return (<>
      {MockHead('Answered automatically', { text: '24/7', tone: 'green' })}
      <div style={{ padding: '22px 18px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 54, color: '#2B2A26', lineHeight: 1 }}><Counter target={8} suffix="s" /></div>
        <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.74)', marginTop: 6 }}>average first response</div>
        <div style={{ marginTop: 16, padding: '10px 12px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', fontSize: 12, color: 'rgba(43,42,38,0.89)' }}>Even at 11pm on a Saturday — no voicemail, no wait.</div>
      </div>
    </>);
    return (<>
      {MockHead('Every family, their language')}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 150 }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: '88%', padding: '10px 13px', borderRadius: 12, background: '#ffffff', border: '1px solid rgba(43,42,38,0.06)' }}>
          <div style={{ fontSize: 9, color: accent, fontWeight: 700, marginBottom: 3 }}>EN</div>
          <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.90)' }}>Hi! How can I help you and your child get started?</div>
        </div>
        <div style={{ alignSelf: 'flex-start', maxWidth: '88%', padding: '10px 13px', borderRadius: 12, background: 'rgba(74,124,63,0.1)', border: '1px solid rgba(74,124,63,0.16)' }}>
          <div style={{ fontSize: 9, color: accent, fontWeight: 700, marginBottom: 3 }}>ES</div>
          <div style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.90)' }}>¡Hola! ¿Cómo puedo ayudar a usted y a su hijo a empezar?</div>
        </div>
      </div>
    </>);
  };

  // ── Section 2: Qualified on contact. ──
  const mock2 = (a: number) => {
    if (a === 0) return (<>
      {MockHead('Service Area · Florida', { text: 'One config', tone: 'accent' })}
      <div style={{ padding: '4px 0' }}>
        {[{ k: 'Location', v: 'Miami, FL' }, { k: 'Age range', v: '2–7 yrs' }, { k: 'Diagnosis', v: 'Autism — required' }, { k: 'Service types', v: 'ABA, Assessment' }].map((r, j, arr) => (
          <div key={j} style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: j < arr.length - 1 ? '1px solid rgba(43,42,38,0.04)' : 'none' }}>
            <span style={{ fontSize: 12, color: 'rgba(43,42,38,0.74)' }}>{r.k}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 12, color: 'rgba(43,42,38,0.90)', fontWeight: 500 }}>{r.v}</span>{Check()}</div>
          </div>
        ))}
      </div>
    </>);
    if (a === 1) return (<>
      {MockHead('Insurance', { text: 'Per plan', tone: 'accent' })}
      <div style={{ padding: '8px 18px' }}>
        {[{ p: 'Blue Cross PPO', s: 'In-network', t: 'green' }, { p: 'Aetna HMO', s: 'Case-by-case', t: 'amber' }, { p: 'Cigna Open Access', s: 'Case-by-case', t: 'amber' }, { p: 'Out-of-state Medicaid', s: 'Not accepted', t: 'red' }].map((r, j, arr) => (
          <div key={j} style={{ padding: '11px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: j < arr.length - 1 ? '1px solid rgba(43,42,38,0.04)' : 'none' }}>
            <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.90)' }}>{r.p}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: r.t === 'green' ? 'rgba(34,197,94,0.12)' : r.t === 'amber' ? 'rgba(245,158,11,0.1)' : 'rgba(236,106,94,0.12)', color: r.t === 'green' ? '#22c55e' : r.t === 'amber' ? '#f59e0b' : '#ec6a5e' }}>{r.s}</span>
          </div>
        ))}
      </div>
    </>);
    return (<>
      {MockHead('Result', { text: 'Pre-approved', tone: 'green' })}
      <div style={{ padding: '22px 18px', textAlign: 'center', minHeight: 150 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{Check()}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#2B2A26' }}>Pre-approved</div>
        <div style={{ fontSize: 12, color: 'rgba(43,42,38,0.74)', marginTop: 6 }}>Miami, FL · age 4 · Blue Cross PPO</div>
        <div style={{ fontSize: 12, color: accent, marginTop: 12 }}>answered in <Counter target={3} suffix=" min" /></div>
      </div>
    </>);
  };

  // ── Section 3: Intake, completed. ──
  const mock3 = (a: number) => {
    if (a === 0) return (<>
      {MockHead('Jake Torres · Intake', { text: '78% complete', tone: 'accent' })}
      <div style={{ padding: '10px 18px' }}>
        {[{ d: 'Consent to Treat', done: true }, { d: 'HIPAA authorization', done: true }, { d: 'Insurance card', done: true }, { d: 'Diagnosis report', done: false }].map((r, j, arr) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: j < arr.length - 1 ? '1px solid rgba(43,42,38,0.04)' : 'none' }}>
            {r.done ? Check() : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid rgba(43,42,38,0.18)' }} />}
            <span style={{ fontSize: 12.5, color: r.done ? 'rgba(43,42,38,0.6)' : 'rgba(43,42,38,0.35)', flex: 1 }}>{r.d}</span>
            {!r.done && <span style={{ fontSize: 10, color: '#f59e0b' }}>chasing…</span>}
          </div>
        ))}
      </div>
    </>);
    if (a === 1) return (<>
      {MockHead('Following up', { text: 'Auto', tone: 'accent' })}
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[{ m: "Hi Maria, just need Jake's diagnosis report to finish up — you can upload it right here.", t: 'Day 2 · auto' }, { m: 'Quick nudge on that report whenever you get a sec!', t: 'Day 4 · auto' }, { m: 'Got it — thank you! The intake is complete.', t: 'Day 5' }].map((f, j) => (
          <div key={j} style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(74,124,63,0.06)', border: '1px solid rgba(74,124,63,0.1)' }}>
            <div style={{ fontSize: 12, color: 'rgba(43,42,38,0.90)', lineHeight: 1.5 }}>{f.m}</div>
            <div style={{ fontSize: 10, color: 'rgba(43,42,38,0.79)', marginTop: 4 }}>{f.t}</div>
          </div>
        ))}
      </div>
    </>);
    return (<>
      {MockHead('Jake Torres · Complete', { text: 'Ready', tone: 'green' })}
      <div style={{ padding: '14px 18px' }}>
        {['Qualified — Blue Cross PPO', 'Consent to Treat signed', 'HIPAA authorized', 'Insurance card on file', 'Diagnosis report on file'].map((item, j, arr) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 12.5, color: 'rgba(43,42,38,0.90)', borderBottom: j < arr.length - 1 ? '1px solid rgba(43,42,38,0.04)' : 'none' }}>{Check()} {item}</div>
        ))}
        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)', fontSize: 12, color: 'rgba(43,42,38,0.89)', textAlign: 'center' }}>Ready for your team to take on</div>
      </div>
    </>);
  };

  return (
    <section id="how-it-works" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <Label>How it works</Label>
          <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, lineHeight: 1.08, color: '#2B2A26', letterSpacing: '-0.02em' }}>
            Scale your practice<br />on your terms.
          </h2>
          <p className="rv" style={{ fontSize: 16, color: 'rgba(43,42,38,0.74)', lineHeight: 1.7, margin: '20px auto 0', maxWidth: 560 }}>
            Carelu runs intake end-to-end, so you grow your caseload without growing your team.
          </p>
        </div>

        <CycleStep
          boxed
          mockFirst
          heading={<>They reach out.<br />We pick up.</>}
          sub="Families reach out from everywhere — phone, text, email, web forms, your chat. Carelu answers every one instantly, around the clock, in English and Spanish, so no family slips away before anyone's even at their desk."
          bullets={[
            { label: 'Every channel, one inbox', desc: 'Phone, text, email, web, fax, and chat all land in a single view. Nothing gets lost.' },
            { label: 'Answered in seconds', desc: 'Every family gets an instant response, day or night, not a voicemail they never return to.' },
            { label: 'English & Spanish', desc: 'Meets every family in their language from the first word.' },
          ]}
          mock={mock1}
        />

        <CycleStep
          heading="Qualified on contact."
          sub="The moment a family reaches out, our agents check them against your clinic's rules — location, age, diagnosis, service type, insurance — and give a clear answer on the spot, so your team never spends a day on a family you can't serve."
          bullets={[
            { label: 'Your rules, one config', desc: 'Set your Service Areas once; every channel reads from the same rules and gives the same answer.' },
            { label: 'Insurance, checked', desc: 'In-network, case-by-case, or not accepted — sorted automatically, per plan.' },
            { label: 'Pre-approved on the spot', desc: 'Families see a clear yes or no in minutes, not after days of back-and-forth.' },
          ]}
          mock={mock2}
        />

        <CycleStep
          boxed
          mockFirst
          heading="Intake, completed."
          sub="Once a family qualifies, our agents keep going — collecting every document, gathering e-signatures, and following up on anything missing until the case is a complete intake. Your coordinators stop chasing leads and start building trust with families."
          bullets={[
            { label: 'Documents & e-signatures', desc: 'Collected in conversation, not chased over weeks of calls and texts.' },
            { label: 'Follow-up, handled', desc: 'The relentless chasing intake used to require, done for you.' },
            { label: 'A complete intake', desc: 'Qualified, documents in, consent signed — the case ready for your team to take on.' },
          ]}
          mock={mock3}
        />

      </div>
    </section>
  );
}

/* ================================================================
   TESTIMONIALS
   ================================================================ */
const stories = [
  { logo: '/logos/golden-care.png', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=900&fit=crop&crop=faces', quote: "Our intake coordinator was spending 6 hours a day on follow-ups. Now she spends that time helping families get started with care.", name: 'Maria C.', role: 'Clinical Director', company: 'Golden Care' },
  { logo: '/logos/cross-river.png', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=900&fit=crop&crop=faces', quote: "We opened three new locations last quarter. We didn't hire a single new intake coordinator. Every site was live on day one.", name: 'James T.', role: 'VP of Operations', company: 'Cross River Therapy' },
  { logo: '/logos/strive-aba.png', photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=900&fit=crop&crop=faces', quote: "A parent texted us at 11pm on a Saturday. By Monday morning, their child was already scheduled for an assessment.", name: 'Rachel M.', role: 'Director of Admissions', company: 'Strive ABA' },
  { logo: '/logos/supportive-care.png', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=faces', quote: "We went from losing 60% of families during intake to retaining 85%. The ROI was obvious within two weeks.", name: 'David K.', role: 'Ops Manager', company: 'Supportive Care ABA' },
  { logo: '/logos/above-beyond.webp', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=900&fit=crop&crop=faces', quote: "We used to lose families over the weekend. Now Carelu handles Saturday and Sunday the same as Tuesday at 10am.", name: 'Sarah L.', role: 'Intake Manager', company: 'Above & Beyond' },
  { logo: '/logos/blossom-aba.webp', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop&crop=faces', quote: "The follow-up alone saved us 20 hours a week. Parents get nudged for missing documents automatically.", name: 'Michael R.', role: 'Regional Director', company: 'Blossom ABA' },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const DWELL = 7000;

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % stories.length), DWELL);
    return () => clearInterval(id);
  }, [active]);

  const s = stories[active];

  return (
    <section id="customers" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <Label>Customer stories</Label>
          <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: '#2B2A26', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
            Trusted by the fastest-growing<br />ABA providers.
          </h2>
        </div>

        <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: '0.82fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }}>
          {/* Photo */}
          <div key={`photo-${active}`} style={{ animation: 'mockSwap 0.55s var(--ease-dramatic)', borderRadius: 20, overflow: 'hidden', aspectRatio: '4 / 5', background: '#E8EDE4', boxShadow: '0 24px 70px rgba(26,46,31,0.13)' }}>
            <img src={s.photo} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%', display: 'block' }} />
          </div>

          {/* Quote + attribution */}
          <div key={`text-${active}`} style={{ animation: 'mockSwap 0.55s var(--ease-dramatic)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2.7vw, 40px)', fontWeight: 400, lineHeight: 1.22, letterSpacing: '-0.012em', color: '#1A2E1F', margin: 0 }}>
              &ldquo;{s.quote}&rdquo;
            </p>
            <div style={{ marginTop: 'clamp(24px, 3vw, 36px)' }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#1A2E1F' }}>{s.name}</div>
              <div style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.58)', marginTop: 3 }}>{s.role}</div>
              <div style={{ fontSize: 14.5, color: 'rgba(43,42,38,0.58)' }}>{s.company}</div>
            </div>
            <img src={s.logo} alt={s.company} style={{ height: 88, width: 'auto', objectFit: 'contain', marginTop: 30, opacity: 0.95 }} />
          </div>
        </div>

        {/* Progress segments */}
        <div style={{ display: 'flex', gap: 10, marginTop: 'clamp(40px, 5vw, 60px)' }}>
          {stories.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} aria-label={`Show story ${i + 1}`} style={{
              flex: 1, height: 3, padding: 0, border: 'none', cursor: 'pointer',
              borderRadius: 100, background: 'rgba(43,42,38,0.13)', overflow: 'hidden', position: 'relative',
            }}>
              {i < active && <span style={{ position: 'absolute', inset: 0, background: '#1A2E1F' }} />}
              {i === active && <span key={`fill-${active}`} style={{ position: 'absolute', inset: 0, background: '#1A2E1F', transformOrigin: 'left', animation: `fillBar ${DWELL}ms linear forwards` }} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   RESULTS COUNTER
   ================================================================ */
function ResultsCounter() {
  const [count, setCount] = useState(getLiveCount);
  useEffect(() => { const i = setInterval(() => setCount(getLiveCount()), 10000); return () => clearInterval(i); }, []);

  return (
    <section id="results" style={{ position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }} />

      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <Label>Proven Results</Label>
        <h2 className="rv-scale" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: '#2B2A26', marginBottom: 48, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
          The results speak louder than we can.
        </h2>

        <div className="rv-scale" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 9vw, 112px)', color: '#2B2A26', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            {count.toLocaleString()}+
          </div>
          <div style={{ fontSize: 'clamp(18px, 2vw, 24px)', color: 'rgba(43,42,38,0.84)', marginTop: 12, fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic' }}>
            families admitted through Carelu
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <span className="dot-pulse" style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: accent, display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'rgba(43,42,38,0.74)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Live</span>
          </div>
        </div>

        <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { v: 3, s: '\u00d7', label: 'More families admitted', sub: 'Same team. Same hours. Triple the output.' },
            { v: 10, s: ' min', p: '<', label: 'First contact to intake-ready', sub: 'What used to take 3-5 days.' },
            { v: 85, s: '%', label: 'Family completion rate', sub: 'Industry average is under 30%.' },
            { v: 0, s: '', label: 'Manual follow-ups', sub: 'Your team focuses on care, not chasing.' },
          ].map((s, i) => (
            <div key={s.label} className={`rv-scale d${i + 1}`} style={{
              background: '#ffffff', borderRadius: 16,
              padding: '40px 28px', border: '1px solid rgba(43,42,38,0.1)',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 48px)', color: '#2B2A26', lineHeight: 1, marginBottom: 12, fontWeight: 400 }}>
                <Counter target={s.v} suffix={s.s} prefix={s.p || ''} />
              </div>
              <div style={{ fontWeight: 600, color: '#2B2A26', fontSize: 14, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(43,42,38,0.79)', lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* RunAlongside removed */

/* ================================================================
   COMPLIANCE
   ================================================================ */
function Compliance() {
  return (
    <section style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div className="rv-scale" style={{ border: '1px solid rgba(43,42,38,0.06)', borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ textAlign: 'center', padding: 'clamp(48px, 6vw, 72px) clamp(24px, 4vw, 48px) 40px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(74,124,63,0.08)', border: '1px solid rgba(74,124,63,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: '#2B2A26', lineHeight: 1.08, marginBottom: 12, letterSpacing: '-0.02em' }}>
              Your compliance team<br />will love us.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.82)', maxWidth: 380, margin: '0 auto' }}>Built for healthcare from day one. Not retrofitted.</p>
          </div>
          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid rgba(43,42,38,0.06)' }}>
            {[
              { label: 'HIPAA', detail: 'End-to-end encryption, signed BAAs, annual audits' },
              { label: 'SOC 2', detail: 'Type II certified, continuous monitoring' },
              { label: 'AES-256', detail: 'Encrypted at rest and in transit' },
              { label: 'US Only', detail: 'HIPAA-eligible data centers' },
              { label: 'RBAC', detail: 'Role-based access, full audit trail' },
              { label: 'BAA', detail: 'Signed before you go live, every time' },
            ].map((item, i) => (
              <div key={item.label} className={`rv d${i + 1}`} style={{
                padding: '28px 24px',
                borderRight: (i % 3 !== 2) ? '1px solid rgba(43,42,38,0.06)' : 'none',
                borderBottom: i < 3 ? '1px solid rgba(43,42,38,0.06)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, color: '#2B2A26', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(43,42,38,0.82)', lineHeight: 1.5 }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FAQ
   ================================================================ */
function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: 'How does Carelu keep patient data safe?', a: 'End-to-end encryption, signed BAAs with every provider, annual SOC 2 Type II audits, and all data stored in HIPAA-eligible US data centers.' },
    { q: 'Will this replace our intake team?', a: "No -- Carelu handles the repetitive parts (eligibility, documents, follow-ups) so your team focuses on clinical work and complex cases." },
    { q: 'How long until we\'re live?', a: 'Most providers go live within 1-2 weeks. We handle setup, configure your insurance rules and conversation flows, and train your team.' },
    { q: 'What if a family needs a real person?', a: 'Carelu hands off to your team with full context -- everything collected, the family\'s preferences, and a conversation summary.' },
    { q: 'What does this actually cost?', a: 'Pricing is based on volume and channels. Most providers see positive ROI within the first month. Book a demo for your specific setup.' },
  ];

  return (
    <section id="faq" style={{ paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)' }}>
      <div style={W}>
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 96 }}>
          <div className="rv-left">
            <Label>FAQ</Label>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', fontWeight: 400, color: '#2B2A26', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Let's clear<br />things up.
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.82)', lineHeight: 1.6 }}>
              Still have questions?<br /><a href="mailto:hello@leadtrap.ai" style={{ color: accent, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>We're real humans -- just ask.</a>
            </p>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} className={`rv-right d${Math.min(i + 1, 5)}`} style={{ borderBottom: '1px solid rgba(43,42,38,0.06)' }}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', border: 'none', background: 'none', textAlign: 'left', gap: 20, cursor: 'pointer' }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: open === i ? '#fff' : 'rgba(43,42,38,0.7)', transition: 'color 0.2s' }}>{f.q}</span>
                  <span style={{ fontSize: 18, color: 'rgba(43,42,38,0.54)', transition: 'transform 0.3s var(--ease-dramatic)', display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0, lineHeight: 1 }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.5s var(--ease-dramatic)' }}>
                  <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.86)', lineHeight: 1.7, paddingBottom: 24 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CTA + FOOTER
   ================================================================ */
function CtaFooter() {
  return (
    <>
      {/* CTA */}
      <section style={{ padding: '0 40px 40px' }}>
        <div className="cta-grid rv-scale" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: '#ffffff', borderRadius: 16, padding: 'clamp(40px, 5vw, 64px)', border: '1px solid rgba(43,42,38,0.06)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: '#2B2A26', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
              Stop losing families.<br />Start{' '}
              <span style={{ fontStyle: 'italic', color: accent }}>growing</span>.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(43,42,38,0.86)', lineHeight: 1.6, maxWidth: 420 }}>
              Carelu handles intake end-to-end so your team delivers care, not paperwork.
            </p>
          </div>
          <a href="/demo" style={{
            background: '#fff', borderRadius: 16, padding: '40px 36px', color: '#000',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            textDecoration: 'none', transition: 'transform 0.3s',
            position: 'relative', overflow: 'hidden', minHeight: 200,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 600 }}>Go live in days</span>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.5vw, 32px)', color: '#000', marginTop: 14, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                See how it works<br />for your practice.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>Get a Demo</span>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1A2E1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/carelu-logo.png" alt="Carelu" style={{ height: 22, width: 'auto', opacity: 0.85, display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {['ABA Therapy', 'Mental Health', 'Home Care'].map(link => (
              <a key={link} href={`/for/${link.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ fontSize: 12, color: 'rgba(43,42,38,0.79)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.25)'; }}
              >{link}</a>
            ))}
            <span style={{ width: 1, height: 12, background: '#ffffff' }} />
            <a href="mailto:hello@leadtrap.ai" style={{ fontSize: 12, color: 'rgba(43,42,38,0.79)', textDecoration: 'none' }}>hello@leadtrap.ai</a>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(43,42,38,0.49)' }}>&copy; 2026 Carelu, Inc.</span>
        </div>
      </footer>
    </>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Landing() {
  useReveal();
  return (
    <div style={{ background: '#FAF8F3', color: '#2B2A26', minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <LogoBar />
      <Problem />
      <HowItWorks />
      <Testimonials />
      <ResultsCounter />
      <Compliance />
      <Faq />
      <CtaFooter />
    </div>
  );
}
