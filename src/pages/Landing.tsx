import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import DemoModalHost from '../components/DemoModal';

// Nav link that client-side-routes internal pages (no full reload → no font-swap
// flash in the nav pill). Same-page hash anchors and /demo (modal-intercepted)
// stay plain <a> tags.
function NavA({ href, ...rest }: { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const clientSide = href.startsWith('/') && !href.startsWith('/demo');
  return clientSide ? <Link to={href} {...rest} /> : <a href={href} {...rest} />;
}

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

const W: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 40px)' };

// ── MOBILE BREAKPOINT ── single source of truth for JS-level layout branches
// (CSS media queries handle styling; this handles structural differences like
// the how-it-works carousel going vertical).
const MOBILE_BP = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${MOBILE_BP}px)`).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isMobile;
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
  return <span ref={ref}>{prefix}{count.toLocaleString('en-US')}{suffix}</span>;
}


/* ================================================================
   NAV
   ================================================================ */
// `base` prefixes the section-anchor links so the same nav works from other
// routes (e.g. /solutions/*) — pass base="/carelu" there.
export function Nav({ base = '' }: { base?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center',
        padding: '16px 20px 0',
      }}>
        <div className="nav-pill" style={{
          display: 'flex', alignItems: 'center',
          width: 'min(720px, calc(100vw - 40px))',
          height: 56,
          borderRadius: 18,
          padding: '0 6px',
          background: 'rgba(250,248,243,0.72)',
          backdropFilter: 'blur(32px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.3)',
          border: '1px solid rgba(43,42,38,0.07)',
        }}>
          {/* Left links */}
          <div className="nav-side nav-side-left">
          <NavA href={`${base}#platform`} className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px 0 28px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1A1A1A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.84)'; }}
          >Product</NavA>
          <div className="hide-mobile" style={{ position: 'relative', display: 'inline-flex', alignSelf: 'stretch', alignItems: 'center' }}
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="nav-link" aria-expanded={solutionsOpen} style={{
              fontSize: 14, fontWeight: 400, color: solutionsOpen ? '#1A1A1A' : 'rgba(43,42,38,0.84)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 18px', transition: 'color 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 6, height: '100%',
              fontFamily: 'inherit',
            }}>
              Solutions
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                transform: solutionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s var(--ease-dramatic)',
              }}><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {solutionsOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 8, paddingTop: 8, zIndex: 101,
              }}>
                <div style={{
                  background: 'rgba(250,248,243,0.96)',
                  backdropFilter: 'blur(28px) saturate(1.3)', WebkitBackdropFilter: 'blur(28px) saturate(1.3)',
                  border: '1px solid rgba(43,42,38,0.08)', borderRadius: 16,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
                  padding: 8, minWidth: 200,
                }}>
                  {[
                    { t: 'Single-Site', d: 'One clinic, full front office', href: '/solutions/single-site' },
                    { t: 'Multi-Site', d: 'Every location, one system', href: '/solutions/multi-site' },
                    { t: 'Enterprise', d: 'Scale, integrations, security', href: '/solutions/enterprise' },
                  ].map(l => (
                    <NavA key={l.t} href={l.href} style={{
                      display: 'block', padding: '10px 14px', borderRadius: 10,
                      textDecoration: 'none', transition: 'background 0.15s',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(43,42,38,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{l.t}</span>
                      <span style={{ display: 'block', fontSize: 12, color: 'rgba(43,42,38,0.55)', marginTop: 1 }}>{l.d}</span>
                    </NavA>
                  ))}
                </div>
              </div>
            )}
          </div>
          <NavA href="/carelu/company" className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1A1A1A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.84)'; }}
          >Company</NavA>
          </div>

          {/* Center logo — the wordmark's ink sits ~5px left of its box center
              (dense "Care" + light trailing signature), so a small optical nudge
              lands it on true center. */}
          <NavA href="/carelu" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <img src="/carelu-logo.svg" alt="Carelu" className="nav-logo-img" style={{ height: 32, width: 'auto', display: 'block', transform: 'translateX(5px)' }} />
          </NavA>

          {/* Right: login + button */}
          <div className="nav-side nav-side-right">
          <NavA href="/login" className="hide-mobile nav-link" style={{ fontSize: 14, fontWeight: 400, color: 'rgba(43,42,38,0.84)', textDecoration: 'none', transition: 'color 0.2s', padding: '0 18px' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1A1A1A'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(43,42,38,0.84)'; }}
          >Log in</NavA>
          <a href="/demo" className="nav-demo-btn" style={{
            fontSize: 14, fontWeight: 600, color: '#1A1A1A',
            padding: '12px 24px', borderRadius: 14, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center',
            border: '1px solid rgba(0,0,0,0.08)',
            background: '#fff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
            transition: 'background 0.2s, box-shadow 0.3s, transform 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.08)'; }}
          >
            Get a Demo
          </a>
          <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 11, marginLeft: 2 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" style={{ display: 'block' }}>
              {mobileOpen
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
              }
            </svg>
          </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99, background: 'rgba(250,248,243,0.98)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '96px 28px 28px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}
          onClick={() => setMobileOpen(false)}>
          {[
            { t: 'Platform',     href: `${base}#platform` },
            { t: 'How It Works', href: `${base}#how-it-works` },
            { t: 'Results',      href: `${base}#results` },
            { t: 'Single-Site',  href: '/solutions/single-site' },
            { t: 'Multi-Site',   href: '/solutions/multi-site' },
            { t: 'Enterprise',   href: '/solutions/enterprise' },
            { t: 'FAQ',          href: `${base}#faq` },
            { t: 'Company',      href: '/carelu/company' },
            { t: 'Log in',       href: '/login' },
          ].map(l => (
            <NavA key={l.t} href={l.href} style={{ fontSize: 22, fontWeight: 400, fontFamily: 'var(--font-display)', color: '#2B2A26', textDecoration: 'none', padding: '20px 0', borderBottom: '1px solid rgba(43,42,38,0.06)' }}>{l.t}</NavA>
          ))}
          <a href="/demo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: '#1A1A1A', backgroundColor: '#fff', padding: '18px 24px', borderRadius: 14, textDecoration: 'none', marginTop: 32, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 18px rgba(0,0,0,0.1)' }}>
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

// One laurel branch (left side) — mirrored with `flip` for the right side.
// Full festival-style wreath half: leaf pairs herringboned along a deep arc.
function LaurelBranch({ flip }: { flip?: boolean }) {
  // (x, y) = station on the stem; t = growth direction (deg, -90 = straight up)
  const stations = [
    { x: 17.5, y: 49, t: -130 },
    { x: 13, y: 42.5, t: -113 },
    { x: 10, y: 35.5, t: -101 },
    { x: 8.4, y: 28, t: -91 },
    { x: 8.4, y: 20.5, t: -81 },
    { x: 9.8, y: 13.5, t: -69 },
    { x: 12.4, y: 7, t: -56 },
  ];
  const SPREAD = 44; // half-angle between the two leaves of a pair
  return (
    <svg
      width="15" height="32" viewBox="0 0 26 56" fill="none" aria-hidden="true"
      style={{
        display: 'block', flexShrink: 0,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      <path d="M21 54 C 7 46.5, 3.5 26, 14.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {stations.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <path d="M0 0 Q 4.5 -3.4 9 0 Q 4.5 3.4 0 0" fill="currentColor" transform={`rotate(${s.t - SPREAD})`} />
          <path d="M0 0 Q 4.5 -3.4 9 0 Q 4.5 3.4 0 0" fill="currentColor" transform={`rotate(${s.t + SPREAD})`} />
        </g>
      ))}
    </svg>
  );
}

function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const laurelsRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Center the trust laurels in the empty gap between the CTAs and the logo strip
  // (they're pulled out of the centered flow and absolutely positioned). Measured
  // in JS so "halfway" is exact on every viewport; re-runs after the entrance
  // animations settle and on resize. Skipped on landscape phones (static in flow).
  useEffect(() => {
    const place = () => {
      const lau = laurelsRef.current;
      if (!lau || getComputedStyle(lau).position === 'static') return;
      const parent = lau.offsetParent as HTMLElement | null;
      const cta = document.querySelector('.hero-cta-row') as HTMLElement | null;
      const logos = document.querySelector('.hero-logos') as HTMLElement | null;
      if (!parent || !cta || !logos) return;
      const pTop = parent.getBoundingClientRect().top;
      const ctaB = cta.getBoundingClientRect().bottom - pTop;
      const logosT = logos.getBoundingClientRect().top - pTop;
      lau.style.top = `${Math.round((ctaB + logosT) / 2 - lau.offsetHeight / 2)}px`;
    };
    const timers = [250, 1200, 2400].map((d) => setTimeout(place, d));
    window.addEventListener('resize', place);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('resize', place); };
  }, []);

  // Preload the full-color logo variants so the hover swap is instant
  useEffect(() => {
    allLogos.forEach((l) => {
      const c = (l as { color?: string }).color;
      if (c) { const img = new Image(); img.src = c; }
    });
  }, []);

  // Safari fast-forwards a CSS animation to "catch up" the wall-clock time it
  // spent backgrounded — so after an app switch the logo marquee flies. Restart
  // the animation from zero whenever the page becomes visible again (also covers
  // bfcache restores via pageshow) so it always resumes at the intended speed.
  useEffect(() => {
    const restart = () => {
      const el = marqueeRef.current;
      if (!el || document.hidden) return;
      el.style.animation = 'none';
      void el.offsetWidth; // force reflow
      el.style.animation = 'marqueeScroll 60s linear infinite';
    };
    document.addEventListener('visibilitychange', restart);
    window.addEventListener('pageshow', restart);
    return () => {
      document.removeEventListener('visibilitychange', restart);
      window.removeEventListener('pageshow', restart);
    };
  }, []);

  // Scroll-driven video (only first VIDEO_CAP of duration plays) + staged content reveal
  const VIDEO_CAP = 0.35;
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const sec = sectionRef.current; const v = videoRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = sec.offsetHeight - vh;
      if (total <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / total));
      setProgress(p);
      if (v) {
        const dur = v.duration;
        if (dur && isFinite(dur)) v.currentTime = p * dur * VIDEO_CAP;
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    const v = videoRef.current;
    const onLoaded = () => update();
    v?.addEventListener('loadedmetadata', onLoaded);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      cancelAnimationFrame(raf);
      v?.removeEventListener('loadedmetadata', onLoaded);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Everything in the hero is visible on page load — pill, headline, subhead,
  // CTAs, and logos all fade in together (staggered via the heroIn CSS animation
  // below) rather than waiting for the user to scroll. `progress` still drives
  // the parallax/dissolve as the hero scrolls away.
  void progress;

  return (
    <section ref={sectionRef} className="hero-section" style={{
      position: 'relative', height: '100svh',
      background: '#f0e6d2',
    }}>
      <div className="hero-sticky" style={{
        position: 'sticky', top: 0, height: '100svh',
        overflow: 'hidden', background: 'transparent',
      }}>
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 50%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.45) 84%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(180deg, #000 0%, #000 50%, rgba(0,0,0,0.85) 68%, rgba(0,0,0,0.45) 84%, rgba(0,0,0,0) 100%)',
          }}
        >
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/hero-sky.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              animation: 'heroSkyDrift 48s ease-in-out infinite',
              willChange: 'transform',
            }}
          />
        </div>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0) 75%)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', zIndex: 2,
          background: 'linear-gradient(180deg, rgba(240,230,210,0) 0%, rgba(240,230,210,0.15) 30%, rgba(240,230,210,0.5) 55%, rgba(240,230,210,0.85) 78%, #f0e6d2 100%)',
          pointerEvents: 'none',
        }} />

        <div className="hero-center" style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px',
        }}>
          <div style={{ ...W, textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              marginBottom: 28,
              animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
            }}>
              <span className="hero-badge" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#fff',
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                padding: '8px 18px', borderRadius: 100,
                textAlign: 'center',
              }}>The very first care enablement platform</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.008em',
              color: '#fff', maxWidth: 1080, margin: '0 auto',
              textShadow: '0 2px 30px rgba(0,0,0,0.35)',
              animation: 'heroIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
            }}>
              The future of intake is here.
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 1.4vw, 19px)',
              color: '#fff',
              lineHeight: 1.6, maxWidth: 600, margin: '24px auto 40px',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.28), 0 2px 16px rgba(0,0,0,0.4)',
              animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both',
            }}>
              Carelu runs your entire intake — from first contact to admitted patient. For ABA and behavioral health organizations of every size.
            </p>

            <div className="hero-cta-row" style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
              animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both',
            }}>
              <a href="/demo" className="hero-cta-btn" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 15, fontWeight: 600, color: '#1A1A1A', backgroundColor: '#fff',
                padding: '14px 28px', borderRadius: 100, textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.3s',
                boxShadow: '0 8px 28px rgba(0,0,0,0.32)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.32)'; }}
              >
                Get a Demo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#how-it-works" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                fontSize: 15, fontWeight: 600, color: '#fff',
                padding: '14px 26px', borderRadius: 100, textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.85)',
                background: 'transparent',
                backdropFilter: 'blur(10px) saturate(1.1)', WebkitBackdropFilter: 'blur(10px) saturate(1.1)',
                transition: 'background-color 0.2s, transform 0.2s, border-color 0.2s',
                letterSpacing: '-0.005em',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                See How It Works
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>

            {/* Enterprise trust signals — one thin line of laurel award badges.
                Pulled out of the centered flow and JS-centered in the gap between
                the CTAs and the logo strip (see the placement effect above). */}
            <div ref={laurelsRef} className="hero-laurels" style={{
              position: 'absolute', left: 0, right: 0, top: 0,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              flexWrap: 'nowrap', gap: 'clamp(10px, 3.2vw, 44px)',
              animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 1.05s both',
            }}>
              {[
                { big: 'HIPAA', small: 'Compliant' },
                { big: 'SOC 2', small: 'Type II' },
                { big: 'BAA', small: 'Every provider' },
              ].map(({ big, small }) => (
                <div key={big} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  color: 'rgba(60,50,40,0.7)', mixBlendMode: 'multiply',
                }}>
                  <LaurelBranch />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'clamp(12.5px, 1.1vw, 14px)', fontWeight: 700, letterSpacing: '0.03em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>{big}</div>
                    <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.92, marginTop: 2, whiteSpace: 'nowrap' }}>{small}</div>
                  </div>
                  <LaurelBranch flip />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted-by logo strip — anchored at the bottom of the hero
            Dark-grayscale logos with mix-blend-mode so they stay legible on both
            the misty video and the cream dissolve below — no scrim/band needed */}
        <div className="hero-logos" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
          paddingBottom: 'clamp(10px, 1.6vh, 22px)',
          animation: 'heroIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(60,50,40,0.7)',
            textAlign: 'center', marginBottom: 20,
            mixBlendMode: 'multiply',
          }}>
            Trusted by 100+ of the fastest growing ABA providers
          </p>
          <div className="hero-logos-mask" style={{ overflow: 'hidden', position: 'relative' }}>
            <div ref={marqueeRef} className="marquee-track" style={{ animation: 'marqueeScroll 60s linear infinite' }}>
              {[0, 1].map(set => (
                <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 80, paddingRight: 80 }}>
                  {allLogos.map(logo => (
                    <img
                      key={`${set}-${logo.alt}`}
                      src={logo.src}
                      alt={logo.alt}
                      style={{
                        height: (logo as { h?: number }).h ?? ((logo as { smaller?: boolean }).smaller ? 34 : 40),
                        width: 'auto', objectFit: 'contain',
                        opacity: 0.78, flexShrink: 0,
                        filter: 'grayscale(100%) brightness(0.55) contrast(1.1)',
                        mixBlendMode: 'multiply',
                        transition: 'opacity 0.3s ease, filter 0.4s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), mix-blend-mode 0.2s ease',
                        willChange: 'transform, filter',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        // Swap to the full-color original (the resting image has its
                        // wordmark baked to near-black, so it has no color to reveal)
                        const c = (logo as { color?: string }).color;
                        if (c) e.currentTarget.src = c;
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.filter = 'grayscale(0%) brightness(1) contrast(1)';
                        e.currentTarget.style.mixBlendMode = 'normal';
                        e.currentTarget.style.transform = 'scale(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.src = logo.src;
                        e.currentTarget.style.opacity = '0.78';
                        e.currentTarget.style.filter = 'grayscale(100%) brightness(0.55) contrast(1.1)';
                        e.currentTarget.style.mixBlendMode = 'multiply';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── DEMO VIDEO ── The older "watch demo" video in a white frame with play button.
// Sits in its own section right under the hero.
function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlay = () => {
    const v = videoRef.current; if (!v) return;
    v.play().catch(() => {});
    setIsPlaying(true);
  };

  return (
    <section style={{
      paddingTop: 'clamp(80px, 10vh, 140px)',
      paddingBottom: 'clamp(80px, 10vh, 140px)',
      background: 'linear-gradient(180deg, #f0e6d2 0%, #f5ecd9 25%, #faf3e5 55%, #FAF8F3 100%)',
    }}>
      <div style={{ ...W, maxWidth: 1040, textAlign: 'center' }}>
        <div className="hero-visual" style={{
          maxWidth: 880, margin: '0 auto',
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#fff',
          boxShadow: '0 18px 60px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)',
          position: 'relative',
        }}>
          <video
            ref={videoRef}
            controls={isPlaying}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/demo-poster.jpg"
            style={{ width: '100%', height: 'auto', display: 'block', background: '#fff' }}
          >
            <source src="https://framerusercontent.com/assets/ZEFznJK3xO8gPZ8psOliFXvKwO0.mp4" type="video/mp4" />
          </video>

          {!isPlaying && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play video"
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.22) 100%)',
                border: 'none', cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.28) 100%)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.22) 100%)'; }}
            >
              <span style={{
                position: 'relative',
                width: 72, height: 72, borderRadius: '50%',
                background: '#1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(26,46,31,0.28), 0 0 0 1px rgba(26,46,31,0.06)',
              }}>
                <span style={{
                  position: 'absolute', inset: -10, borderRadius: '50%',
                  border: '1px solid rgba(26,46,31,0.22)',
                  animation: 'hubPulse 2.4s ease-out infinite',
                  pointerEvents: 'none',
                }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
                  <path d="M7 5v14l12-7L7 5z" />
                </svg>
              </span>
              <span style={{
                position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.45)',
              }}>
                Watch demo · 2 min
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   LOGO BAR
   ================================================================ */
// Above-the-fold strip uses the `dark/` variants — same logos with the wordmark
// darkened to near-black (icon shade untouched) so the company NAMES read clearly
// through the greyscale filter. Originals stay for the full-color testimonial nav.
const allLogos = [
  { src: '/logos/dark/strive-aba.png', alt: 'Strive ABA', color: '/logos/strive-aba.png' },
  { src: '/logos/treetop.png', alt: 'The Treetop', h: 44 },
  { src: '/logos/dark/golden-care-full.png', alt: 'Golden Care', color: '/logos/golden-care-full.png' },
  { src: '/logos/dark/grateful-care.png', alt: 'Grateful Care', color: '/logos/grateful-care.avif' },
  { src: '/logos/advanceable-aba.svg', alt: 'Advanceable ABA', smaller: true },
  { src: '/logos/dark/inbloom.png', alt: 'InBloom Autism Services', h: 30, color: '/logos/inbloom.png' },
  { src: '/logos/dark/apex.png', alt: 'Apex ABA', color: '/logos/apex.png' },
  { src: '/logos/dark/totalcare.png', alt: 'Total Care', color: '/logos/totalcare.webp' },
  { src: '/logos/dark/kidsclub.png', alt: 'Kids Club ABA', color: '/logos/kidsclub.png' },
  { src: '/logos/dark/cross-river.png', alt: 'Cross River', color: '/logos/cross-river.png' },
  { src: '/logos/advanced-autism.svg', alt: 'Advanced Autism Services', h: 40 },
  { src: '/logos/dark/supportive-care.png', alt: 'Supportive Care', color: '/logos/supportive-care.png' },
  { src: '/logos/dark/stepahead.png', alt: 'Step Ahead ABA', h: 46, color: '/logos/stepahead.png' },
  { src: '/logos/dark/above-beyond.png', alt: 'Above & Beyond', h: 52, color: '/logos/above-beyond.webp' },
  { src: '/logos/dark/behaviorcare.png', alt: 'BehaviorCare Therapy', color: '/logos/behaviorcare.png' },
  { src: '/logos/dark/blossom-aba.png', alt: 'Blossom ABA', h: 46, color: '/logos/blossom-aba.webp' },
  { src: '/logos/dark/link-color.png', alt: 'Links ABA', smaller: true, color: '/logos/link-color.png' },
];


// Shared IntersectionObserver options for section visuals: an element must be
// ~60% visible AND inside the central band of the viewport. The negative
// horizontal rootMargin keeps cards peeking in from the carousel edge from
// triggering early; the negative bottom margin does the same for the mobile
// vertical stack.
const VISUAL_IN_VIEW: IntersectionObserverInit = { threshold: 0.6, rootMargin: '0px -18% -24% -18%' };


/* Every tool an ABA org already runs, laid out as a loose web around the headline —
   all wired to a system of record, but the threads are frayed and half-broken.
   Positions are normalized (0..1) fractions of the section, kept clear of the
   centered text zone. "Connected, but not." */
const WEB_ICONS: { n: string; bx: number; by: number; size: number }[] = [
  { n: 'salesforce',          bx: 0.08, by: 0.30, size: 74 },
  { n: 'hubspot',             bx: 0.21, by: 0.15, size: 58 },
  { n: 'quo',                 bx: 0.40, by: 0.16, size: 60 },
  { n: 'outlook',             bx: 0.60, by: 0.16, size: 64 },
  { n: 'googlecalendar',      bx: 0.78, by: 0.14, size: 58 },
  { n: 'calendly',            bx: 0.91, by: 0.20, size: 56 },
  { n: 'docusign',            bx: 0.26, by: 0.31, size: 54 },
  { n: 'gmail',               bx: 0.64, by: 0.26, size: 52 },
  { n: 'twilio',              bx: 0.94, by: 0.40, size: 66 },
  { n: 'ghl',                 bx: 0.06, by: 0.52, size: 62 },
  { n: 'jotform',             bx: 0.19, by: 0.52, size: 56 },
  { n: 'simplepractice',      bx: 0.79, by: 0.52, size: 72 },
  { n: 'ringcentral',         bx: 0.93, by: 0.62, size: 60 },
  { n: 'lobbie',              bx: 0.35, by: 0.64, size: 60 },
  { n: 'bolt',                bx: 0.24, by: 0.57, size: 62 },
  { n: 'rethink',             bx: 0.51, by: 0.71, size: 56 },
  { n: 'intakeq',             bx: 0.66, by: 0.64, size: 56 },
  { n: 'artemisaba',          bx: 0.84, by: 0.68, size: 64 },
  { n: 'zoho',                bx: 0.13, by: 0.71, size: 66 },
  { n: 'pandadoc',            bx: 0.08, by: 0.87, size: 58 },
  { n: 'monday',              bx: 0.24, by: 0.85, size: 58 },
  { n: 'clickup',             bx: 0.42, by: 0.91, size: 72 },
  { n: 'callrail',            bx: 0.58, by: 0.87, size: 56 },
  { n: 'calltrackingmetrics', bx: 0.72, by: 0.90, size: 64 },
  { n: 'whatconverts',        bx: 0.88, by: 0.84, size: 54 },
];

type WebNode = {
  n: string; size: number;
  bx: number; by: number;   // base position (fraction of section W/H)
  phx: number; phy: number; // drift phase
  ax: number; ay: number;   // drift amplitude (px)
  x: number; y: number;     // current center (px)
  rev: number;              // reveal progress 0..1
  hub?: boolean;            // the inert System-of-Record hub everything tethers to
  dead?: boolean;           // a stuck/dead integration — rendered greyed out
  el: HTMLDivElement | null;
};
type WebEdge = { a: number; b: number; broken: boolean; line: SVGLineElement | null };

/* The tangled-web sandbox: logos wired together by frayed threads, gently drifting,
   grab-and-pull to stretch the connections. */
function SystemWeb({ textRef }: { textRef: React.RefObject<HTMLDivElement | null> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<WebNode[]>([]);
  const edgesRef = useRef<WebEdge[]>([]);
  const dragRef = useRef<{ node: WebNode; offX: number; offY: number } | null>(null);
  const rafRef = useRef(0);
  const startedRef = useRef(false);
  const tRef = useRef(0);
  const maskRef = useRef<SVGRectElement | null>(null);

  if (nodesRef.current.length === 0) {
    // deterministic pseudo-random keyed off the index (stable across SSR/hydration)
    const rnd = (i: number, s: number) => { const v = Math.sin((i + 1) * s) * 43758.5453; return v - Math.floor(v); };
    const mobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const scale = mobile ? 0.64 : 1;

    // Mobile shows a curated subset — 24 tiles is too dense on a narrow screen.
    const MOBILE_KEEP = new Set([
      'salesforce', 'hubspot', 'quo', 'outlook', 'googlecalendar', 'calendly',
      'simplepractice', 'ringcentral', 'intakeq', 'monday', 'clickup', 'pandadoc', 'callrail',
    ]);
    const source = mobile ? WEB_ICONS.filter((ic) => MOBILE_KEEP.has(ic.n)) : WEB_ICONS;

    // No center, no villain — just a sprawl of tools, all wired to each other and looking
    // perfectly fine. That's the point of "Nothing's broken": it's all connected, nothing's
    // technically wrong, and families still slip away.
    const nodes: WebNode[] = source.map((ic, i) => {
      let bx = ic.bx, by = ic.by;
      if (mobile) {
        // Narrow portrait: pull nodes off the edges (no clipping) and squeeze them into
        // a top band + a bottom band, leaving the middle clear for the taller headline.
        bx = 0.5 + (bx - 0.5) * 0.86;
        by = by < 0.46
          ? 0.20 + (by / 0.46) * 0.15          // top band  → [0.20, 0.35]
          : 0.60 + ((by - 0.46) / 0.54) * 0.34; // bottom band → [0.60, 0.94]
      }
      return {
        n: ic.n, size: Math.round(ic.size * scale), bx, by,
        phx: rnd(i, 12.9898) * Math.PI * 2, phy: rnd(i, 78.233) * Math.PI * 2,
        ax: 4 + rnd(i, 3.7) * 6, ay: 4 + rnd(i, 5.1) * 6,
        x: 0, y: 0, rev: 0, el: null,
      };
    });
    nodesRef.current = nodes;

    // Decentralized mesh: wire each tool to its two nearest neighbours (deduped). All
    // threads intact — it looks connected, because nothing's broken.
    const seen = new Set<string>();
    const edges: WebEdge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const near = nodes
        .map((m, j) => ({ j, dd: (m.bx - nodes[i].bx) ** 2 + (m.by - nodes[i].by) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.dd - b.dd);
      for (let k = 0; k < 2; k++) {
        const j = near[k].j;
        const a = Math.min(i, j), b = Math.max(i, j);
        const key = `${a}-${b}`;
        if (!seen.has(key)) { seen.add(key); edges.push({ a, b, broken: false, line: null }); }
      }
    }
    edgesRef.current = edges;
  }

  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    let W = wrap.clientWidth, H = wrap.clientHeight;
    const onResize = () => { W = wrap.clientWidth; H = wrap.clientHeight; };
    window.addEventListener('resize', onResize);

    // Hold the web hidden until the section scrolls into view, then reveal it.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { startedRef.current = true; io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(wrap);

    const step = () => {
      const nodes = nodesRef.current, edges = edgesRef.current, drag = dragRef.current;
      tRef.current += 0.016;
      const T = tRef.current;
      const started = startedRef.current;

      // Live keep-out box around the headline + subhead so no tile drifts over the
      // text and hurts readability. Union of the actual line boxes (tight, not the
      // full-width block), in wrap-local coords, padded by GAP.
      let keep: { l: number; t: number; r: number; b: number } | null = null;
      const tc = textRef.current;
      if (tc) {
        const wr = wrap.getBoundingClientRect();
        let l = Infinity, t = Infinity, r = -Infinity, bt = -Infinity;
        tc.querySelectorAll('h2, p').forEach((el) => {
          for (const rc of el.getClientRects()) {
            l = Math.min(l, rc.left); t = Math.min(t, rc.top);
            r = Math.max(r, rc.right); bt = Math.max(bt, rc.bottom);
          }
        });
        if (l !== Infinity) {
          const GAP = 16;
          const bl = l - wr.left, bt2 = t - wr.top, br = r - wr.left, bb = bt - wr.top;
          keep = { l: bl - GAP, t: bt2 - GAP, r: br + GAP, b: bb + GAP };
          // Punch the same box (a touch larger) out of the thread layer so no spoke
          // ever crosses the text — the blurred mask fades threads out as they approach.
          if (maskRef.current) {
            const M = 26;
            maskRef.current.setAttribute('x', String(bl - M));
            maskRef.current.setAttribute('y', String(bt2 - M));
            maskRef.current.setAttribute('width', String((br - bl) + M * 2));
            maskRef.current.setAttribute('height', String((bb - bt2) + M * 2));
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        if (started) nd.rev = Math.max(0, Math.min(1, (T - i * 0.045) / 0.6)); // staggered fade-in
        if (!drag || drag.node !== nd) {
          nd.x = nd.bx * W + Math.sin(T * 0.5 + nd.phx) * nd.ax;   // slow ambient drift
          nd.y = nd.by * H + Math.cos(T * 0.42 + nd.phy) * nd.ay;
          // push out of the text box along the axis of least penetration (drift resets
          // each frame, so this is stable — the tile just hovers along the text edge)
          if (keep) {
            const h = nd.size / 2;
            const nl = nd.x - h, nr = nd.x + h, nt = nd.y - h, nb = nd.y + h;
            if (nr > keep.l && nl < keep.r && nb > keep.t && nt < keep.b) {
              const penL = nr - keep.l, penR = keep.r - nl, penU = nb - keep.t, penD = keep.b - nt;
              const min = Math.min(penL, penR, penU, penD);
              if (min === penL) nd.x -= penL;
              else if (min === penR) nd.x += penR;
              else if (min === penU) nd.y -= penU;
              else nd.y += penD;
            }
          }
        }
        if (nd.el) {
          const s = 0.62 + 0.38 * nd.rev;
          nd.el.style.transform = `translate(${nd.x - nd.size / 2}px, ${nd.y - nd.size / 2}px) scale(${s})`;
          nd.el.style.opacity = String(nd.rev);
        }
      }

      for (const e of edges) {
        if (!e.line) continue;
        const a = nodes[e.a], b = nodes[e.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len, uy = dy / len;
        const gapA = a.size / 2 + (e.broken ? 15 : 4);   // broken threads stop well short of the tile
        const gapB = b.size / 2 + (e.broken ? 15 : 4);
        e.line.setAttribute('x1', String(a.x + ux * gapA));
        e.line.setAttribute('y1', String(a.y + uy * gapA));
        e.line.setAttribute('x2', String(b.x - ux * gapB));
        e.line.setAttribute('y2', String(b.y - uy * gapB));
        e.line.setAttribute('opacity', String(Math.min(a.rev, b.rev) * (e.broken ? 0.12 : 0.2)));
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(rafRef.current); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  const down = (nd: WebNode) => (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current; if (!wrap) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
    const r = wrap.getBoundingClientRect();
    dragRef.current = { node: nd, offX: (e.clientX - r.left) - nd.x, offY: (e.clientY - r.top) - nd.y };
  };
  const move = (nd: WebNode) => (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current; const wrap = wrapRef.current;
    if (!drag || drag.node !== nd || !wrap) return;
    const r = wrap.getBoundingClientRect();
    nd.x = (e.clientX - r.left) - drag.offX;
    nd.y = (e.clientY - r.top) - drag.offY;
  };
  const up = (nd: WebNode) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.cursor = 'grab';
    if (dragRef.current && dragRef.current.node === nd) {
      // rebase so the ambient drift resumes around where it was dropped (no snap-back)
      const wrap = wrapRef.current; const T = tRef.current;
      if (wrap && wrap.clientWidth && wrap.clientHeight) {
        nd.bx = (nd.x - Math.sin(T * 0.5 + nd.phx) * nd.ax) / wrap.clientWidth;
        nd.by = (nd.y - Math.cos(T * 0.42 + nd.phy) * nd.ay) / wrap.clientHeight;
      }
      dragRef.current = null;
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* noop */ }
  };

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 5, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="webMaskBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <mask id="webTextMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* black = hidden; blurred so threads feather out approaching the text */}
            <rect ref={maskRef} x="0" y="0" width="0" height="0" rx="34" fill="black" filter="url(#webMaskBlur)" />
          </mask>
        </defs>
        <g mask="url(#webTextMask)">
          {edgesRef.current.map((e, i) => (
            <line key={i} ref={(el) => { e.line = el; }}
              stroke="#2A2A24"
              strokeWidth={e.broken ? 1 : 1.3}
              strokeDasharray={e.broken ? '1.5 11' : undefined}
              strokeLinecap="round"
              opacity={0} />
          ))}
        </g>
      </svg>
      {nodesRef.current.map((nd, i) => (
        <div key={i} ref={(el) => { nd.el = el; }}
          onPointerDown={down(nd)} onPointerMove={move(nd)} onPointerUp={up(nd)} onPointerCancel={up(nd)}
          style={{
            position: 'absolute', top: 0, left: 0, width: nd.size, height: nd.size,
            borderRadius: nd.size * 0.26,
            background: '#F4F2EC', border: '1px solid rgba(30,30,25,0.05)',
            boxShadow: '0 8px 22px rgba(30,30,25,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'grab', touchAction: 'none', userSelect: 'none', willChange: 'transform', opacity: 0,
            pointerEvents: 'auto',
          }}>
          <img src={`/logos/rain/${nd.n}.png`} alt="" draggable={false} style={{
            width: '58%', height: '58%', objectFit: 'contain', pointerEvents: 'none',
          }} />
        </div>
      ))}
    </div>
  );
}


/* ================================================================
   THE PROBLEM — Carelu-style browser chaos (dark mode)
   Sticky scroll: text → browser windows slam in → cursor closes → solution
   ================================================================ */
function Problem() {
  const trackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);

  // Scroll-tied progress (so the animation rewinds when user scrolls back up).
  // No sticky pinning — uses the section's natural position in the viewport to compute t,
  // so there's no 100vh "exit transition" that reads as empty space.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // t = 0 when the section's top is at viewport bottom (just appearing);
      // t = 1 when the section's bottom is at viewport top (fully scrolled past).
      // Animation runs as the section traverses the viewport — t=0 when section's
      // top hits the viewport bottom, t=1 when the section's top hits the viewport top.
      const t = Math.max(0, Math.min(1, (vh - rect.top) / vh));
      setT(t);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // The chaos animation was reduced to the tool web only — the old browser-tabs
  // sequence (and its phase timing) moved to _archive/ChaosTabsAnimation.tsx.
  const closed = false;  // section never "closes" — it just scrolls away naturally

  return (
    <div ref={trackRef} style={{
      height: '100svh', position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: closed ? '#FAF8F3' : '#fff',
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

        {/* Loose, frayed web of every tool wired to the system of record */}
        <SystemWeb textRef={textRef} />

        {/* Text overlay — above the tile pile so it stays readable; pointer-through
            so the tiles behind it are still draggable */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 6, pointerEvents: 'none', padding: '0 36px', marginBottom: 32, width: '100%' }}>
          {/* Problem text */}
          <div ref={textRef} style={{ opacity: 1, transition: 'opacity 0.3s', position: 'absolute', inset: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.02em', color: '#000', maxWidth: 720, margin: '0 auto 16px' }}>
              Nothing&rsquo;s broken.<br />You&rsquo;re still losing families.
            </h2>
            <p style={{ fontSize: 17, color: '#666', lineHeight: 1.7, maxWidth: 580, margin: '0 auto' }}>
              More tools, more headcount, more complexity &mdash; but none of it moves on its own. So intake stalls, and families slip to the competitor who answers first.
            </p>
          </div>
          {/* Solution headline + cards are rendered in a separate zIndex 9 layer below */}
          {/* Spacer */}
          <div style={{ visibility: 'hidden' }}>
            <span style={{ display: 'inline-block', fontSize: 11, marginBottom: 20 }}>&nbsp;</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 400, lineHeight: 1.12, maxWidth: 720, margin: '0 auto 16px' }}>&nbsp;<br />&nbsp;</h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>&nbsp;</p>
          </div>
        </div>

        {/* Solution-phase reveal was moved to the MuralReveal section below.
            Keeping this conditional empty so the chaos-tabs animation still plays out. */}
    </div>
  );
}


/* ================================================================
   ─── SECTIONS BELOW WERE BROUGHT IN FROM SESSION WORK ───
   ================================================================ */

// ── LIVE COUNTER — animated count-up on enter, live ticks afterwards ──
function LiveCounter() {
  const target = getLiveCount();
  const [count, setCount] = useState(0);
  const [bumped, setBumped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  // Animate from 0 → target when the counter scrolls into view
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const dur = 2200;
        const t0 = performance.now();
        (function tick(now: number) {
          const p = Math.min((now - t0) / dur, 1);
          // ease-out quart for a "racing then settling" feel
          const eased = 1 - Math.pow(1 - p, 4);
          setCount(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  // After the initial count-up, keep ticking live every ~6s with a subtle "bump" cue
  useEffect(() => {
    if (!ran.current) return;
    const interval = setInterval(() => {
      const next = getLiveCount();
      setCount((prev) => (next > prev ? next : prev));
      setBumped(true);
      setTimeout(() => setBumped(false), 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="rv-scale" style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(44px, 5vw, 68px)',
        fontWeight: 400,
        color: 'var(--green-900)',
        lineHeight: 1,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'lining-nums tabular-nums',
        fontFeatureSettings: '"lnum" 1, "tnum" 1',
        transform: bumped ? 'scale(1.012)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      }}>
        {count.toLocaleString()}+
      </div>
      <div style={{
        marginTop: 12,
        fontSize: 15, fontWeight: 500,
        color: 'var(--green-900)', opacity: 0.6,
      }}>
        families connected to care
      </div>
      <div style={{
        marginTop: 14,
        display: 'inline-flex', alignItems: 'center', gap: 7,
      }}>
        <span className="dot-pulse" style={{
          width: 7, height: 7, borderRadius: '50%',
          backgroundColor: 'var(--lime)', display: 'inline-block',
          boxShadow: '0 0 0 3px rgba(212, 242, 92, 0.3)',
        }} />
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--green-900)', opacity: 0.5,
        }}>
          Live
        </span>
      </div>
    </div>
  );
}

function Pill({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 14, fontWeight: 500,
      color: dark ? 'rgba(255,255,255,0.85)' : '#1A1A1A',
      backgroundColor: dark ? 'rgba(255,255,255,0.10)' : '#fff',
      padding: '10px 20px', borderRadius: 100,
      marginBottom: 24,
      letterSpacing: '-0.005em',
      border: dark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.06)',
      boxShadow: dark ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
    }}>
      {children}
    </span>
  );
}

// ── CUSTOMER STORIES ─────────────────────────────
// `photo` is a placeholder headshot until real customer photos come in.
// Add a `video` URL to any story and its portrait grows a play button that
// opens the lightbox player.
type CustomerStory = {
  logo: string; photo: string; quote: string;
  name: string; role: string; company: string;
  video?: string;
  logoH?: number; // selector-row height override for logos that render small
};
const customerStories: CustomerStory[] = [
  {
    logo: '/logos/golden-care.png',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=900&fit=crop&crop=faces',
    quote: "Our intake coordinator was spending 6 hours a day on follow-ups. With Carelu, she spends that time actually helping families get started with care.",
    name: 'Maria C.',
    role: 'Clinical Director',
    company: 'Golden Care Therapy',
  },
  {
    logo: '/logos/cross-river.png',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=900&fit=crop&crop=faces',
    quote: "We opened three new locations last quarter. With Carelu, we didn't hire a single new intake coordinator. Every site was live on day one.",
    name: 'James T.',
    role: 'VP of Operations',
    company: 'Cross River Therapy',
  },
  {
    logo: '/logos/strive-aba.png',
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=900&fit=crop&crop=faces',
    quote: "A parent texted us at 11pm on a Saturday. By Monday morning, their child was already scheduled for an assessment. That never happened before Carelu.",
    name: 'Rachel M.',
    role: 'Director of Admissions',
    company: 'Strive ABA Therapy',
  },
  {
    logo: '/logos/supportive-care.png',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=faces',
    quote: "We went from losing 60% of families during intake to retaining 85%. The ROI was obvious within the first two weeks.",
    name: 'David K.',
    role: 'Operations Manager',
    company: 'Supportive Care ABA',
  },
  {
    logo: '/logos/above-beyond.webp',
    logoH: 40,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=900&fit=crop&crop=faces',
    quote: "We used to lose families over the weekend. Now Carelu handles Saturday and Sunday inquiries the same as Tuesday at 10am. Our waitlist is shorter than it's ever been.",
    name: 'Sarah L.',
    role: 'Intake Manager',
    company: 'Above & Beyond ABA',
  },
  {
    logo: '/logos/blossom-aba.webp',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop&crop=faces',
    quote: "The follow-up alone saved us 20 hours a week. Parents get nudged for missing documents automatically -- our team just reviews completed cases.",
    name: 'Michael R.',
    role: 'Regional Director',
    company: 'Blossom ABA',
  },
];

function CustomerStories() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const active = customerStories[activeIdx];
  const prev = () => { setVideoOpen(false); setActiveIdx((i) => (i - 1 + customerStories.length) % customerStories.length); };
  const next = () => { setVideoOpen(false); setActiveIdx((i) => (i + 1) % customerStories.length); };

  // Auto-rotate every 6s; pauses while hovered or while a video is playing.
  // Re-runs on activeIdx so any manual navigation resets the clock.
  useEffect(() => {
    if (paused || videoOpen) return;
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % customerStories.length);
    }, 6000);
    return () => clearInterval(t);
  }, [activeIdx, paused, videoOpen]);

  // Small corner markers — subtle dark squares like the Intercom layout
  const cornerSq = { width: 6, height: 6, background: 'rgba(0,0,0,0.18)' } as const;

  return (
    <section style={{
      paddingTop: 'clamp(56px, 8vw, 100px)', paddingBottom: 'clamp(56px, 8vw, 100px)',
      background: '#fff',
      position: 'relative',
    }}>
      <div style={W}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="rv"><Pill>Customer stories</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400, lineHeight: 1.12, letterSpacing: '-0.02em',
            color: 'var(--green-900)', maxWidth: 720, margin: '12px auto 0',
          }}>
            Hear from teams who trust Carelu.
          </h2>
        </div>

        {/* Editorial testimonial — serif pull-quote beside an arched portrait.
            Photos are placeholders until real customer shots come in; a story
            with a `video` URL gets a play button that opens the lightbox. */}
        <div className="rv-scale d2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: 'relative',
            maxWidth: 1060, margin: '0 auto',
            padding: 'clamp(32px, 4.5vw, 56px) clamp(24px, 4vw, 56px)',
          }}>
          {/* 4 corner markers */}
          <div style={{ position: 'absolute', top: 0,  left: 0,  ...cornerSq }} />
          <div style={{ position: 'absolute', top: 0,  right: 0, ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0,  ...cornerSq }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, ...cornerSq }} />

          <div className="stories-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 290px',
            gap: 'clamp(32px, 5vw, 72px)',
            alignItems: 'center',
          }}>
            {/* Quote column — all stories stacked in one grid cell and
                crossfaded, so outgoing and incoming quotes blend smoothly */}
            <div>
              {/* Oversized serif quote flourish */}
              <div aria-hidden="true" style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 'clamp(72px, 7vw, 100px)', lineHeight: 0.5,
                height: 'clamp(34px, 3.5vw, 46px)',
                color: 'var(--lime)',
                WebkitTextStroke: '1px rgba(44,62,45,0.55)',
                userSelect: 'none',
              }}>
                &ldquo;
              </div>
              <div style={{ display: 'grid' }}>
                {customerStories.map((s, i) => (
                  <div key={s.company} aria-hidden={i !== activeIdx} style={{
                    gridArea: '1 / 1',
                    opacity: i === activeIdx ? 1 : 0,
                    transform: i === activeIdx ? 'none' : 'translateY(6px)',
                    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    pointerEvents: i === activeIdx ? 'auto' : 'none',
                  }}>
                    <blockquote style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(21px, 2.3vw, 30px)',
                      lineHeight: 1.4, letterSpacing: '-0.02em',
                      color: 'var(--green-900)',
                      fontWeight: 400,
                      margin: 0,
                    }}>
                      {s.quote}
                    </blockquote>
                    <div style={{ marginTop: 26 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--green-900)' }}>
                        {s.name}
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: 'var(--gray-500)',
                        letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 5,
                      }}>
                        {s.role} &middot; {s.company}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Snapshot portrait — a print pinned to the page: cream border,
                slight tilt. A real face builds trust; play button appears
                automatically when the story has a video */}
            <div className="stories-photo" style={{
              position: 'relative', width: 276,
              justifySelf: 'end',
              transform: 'rotate(-2.5deg)',
              background: '#FDFCF9',
              padding: '10px 10px 13px',
              borderRadius: 18,
              boxShadow: '0 16px 44px rgba(20,40,30,0.16), 0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                position: 'relative', overflow: 'hidden',
                borderRadius: 10, width: '100%', aspectRatio: '4 / 5',
              }}>
              {/* All portraits stacked and crossfaded — also preloads every
                  photo so rotation never flashes */}
              {customerStories.map((s, i) => (
                <img
                  key={s.company}
                  src={s.photo}
                  alt={i === activeIdx ? s.name : ''}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center top', display: 'block',
                    opacity: i === activeIdx ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              ))}
              {active.video && (
                <button
                  onClick={() => setVideoOpen(true)}
                  aria-label={`Play video from ${active.name}`}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    background: 'rgba(20,30,22,0.18)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.25s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(20,30,22,0.30)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(20,30,22,0.18)'; }}
                >
                  <span style={{
                    width: 62, height: 62, borderRadius: '50%',
                    background: 'rgba(250,248,243,0.94)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--green-900)" style={{ marginLeft: 3 }}>
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                </button>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: client logos are the navigation — full color, faded when inactive */}
        <div className="stories-logos" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 'clamp(20px, 3.5vw, 44px)', marginTop: 30, flexWrap: 'wrap',
        }}>
          {customerStories.map((s, i) => (
            <button
              key={s.company}
              onClick={() => setActiveIdx(i)}
              aria-label={`Show story from ${s.company}`}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 2px 12px', position: 'relative',
                opacity: i === activeIdx ? 1 : 0.35,
                filter: i === activeIdx ? 'none' : 'saturate(0.4)',
                transition: 'opacity 0.25s ease, filter 0.25s ease',
              }}
              onMouseEnter={(e) => { if (i !== activeIdx) e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = i === activeIdx ? '1' : '0.35'; }}
            >
              <img
                src={s.logo}
                alt={s.company}
                style={{ height: s.logoH ?? 26, width: 'auto', objectFit: 'contain', display: 'block' }}
              />
              <span style={{
                position: 'absolute', left: '50%', bottom: 0,
                width: 22, height: 2, borderRadius: 1,
                background: 'var(--green-900)',
                transform: `translateX(-50%) scaleX(${i === activeIdx ? 1 : 0})`,
                transformOrigin: 'center',
                transition: 'transform 0.35s var(--ease-dramatic)',
              }} />
            </button>
          ))}
        </div>

        {/* Mobile: arrows + dots (logo row hides below 768px) */}
        <div className="stories-mobile-nav" style={{
          display: 'none', alignItems: 'center', justifyContent: 'center', gap: 28,
          marginTop: 24,
        }}>
          <button onClick={prev} aria-label="Previous" style={{
            width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--green-900)',
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 15L7.5 10L12.5 5" /></svg>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {customerStories.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Story ${i + 1}`}
                style={{
                  width: i === activeIdx ? 24 : 8, height: 8,
                  borderRadius: 4, border: 'none', padding: 0,
                  background: i === activeIdx ? 'var(--green-900)' : 'rgba(0,0,0,0.18)',
                  cursor: 'pointer',
                  transition: 'width 0.3s var(--ease-dramatic), background 0.2s',
                }}
              />
            ))}
          </div>
          <button onClick={next} aria-label="Next" style={{
            width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.15)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--green-900)',
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 5L12.5 10L7.5 15" /></svg>
          </button>
        </div>

        {/* Video lightbox — used by stories that ship a `video` URL */}
        {videoOpen && active.video && (
          <div
            onClick={() => setVideoOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(15,20,16,0.82)',
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <button
              onClick={() => setVideoOpen(false)}
              aria-label="Close video"
              style={{
                position: 'absolute', top: 20, right: 24,
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(250,248,243,0.12)', border: '1px solid rgba(250,248,243,0.3)',
                color: '#FAF8F3', cursor: 'pointer', fontSize: 20, lineHeight: 1,
              }}
            >
              ×
            </button>
            <video
              src={active.video}
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 'min(920px, 100%)', maxHeight: '80vh',
                borderRadius: 16, background: '#000',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        )}

        {/* Proof stats row */}
        <div className="proof-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, marginTop: 56, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 28 }}>
          {[
            {
              node: <>
                <Counter target={60} suffix="%" />
                <svg width="26" height="12" viewBox="0 0 30 12" fill="none" stroke="var(--green-900)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 10px', display: 'inline-block', verticalAlign: 'middle', opacity: 0.7 }}>
                  <path d="M1 6h27M23 1.5L28.5 6L23 10.5" />
                </svg>
                <Counter target={15} suffix="%" />
              </>,
              desc: 'Family drop-off rate, first month with Carelu',
            },
            { node: <><Counter target={0} /> missed</>, desc: 'Every lead followed up — no one falls through the cracks' },
            { node: <><Counter target={24} /> / <Counter target={7} /></>, desc: 'Nights, weekends, holidays — never miss a family' },
          ].map((s, i) => (
            <div key={i} className={`rv d${i + 1}`} style={{ padding: '0 24px', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--green-900)', marginBottom: 8, fontVariantNumeric: 'lining-nums tabular-nums' }}>{s.node}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>{s.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── CHANNEL ICONS — small stroke-based glyphs for each pill ──
function ChannelIcon({ name }: { name: string }) {
  const common = {
    width: 13, height: 13,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'Phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'Text':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'Chat':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'Forms':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      );
    case 'Fax':
      return (
        <svg {...common}>
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" rx="1" />
        </svg>
      );
    case 'Email':
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2 7 12 13 22 7" />
        </svg>
      );
    default:
      return null;
  }
}

// ── HANDOFF VISUAL — patient card with animated 5-step progress ribbon + team handoff footer ──
function HandoffVisual() {
  const milestones = ['Intake', 'Insurance', 'Forms', 'Schedule', 'Ready'];
  const [filled, setFilled] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let ran = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran) {
        ran = true;
        let p = 0;
        interval = setInterval(() => {
          p++;
          setFilled(p);
          if (p >= milestones.length) {
            if (interval) clearInterval(interval);
          }
        }, 280);
        obs.disconnect();
      }
    }, VISUAL_IN_VIEW);
    obs.observe(el);
    return () => { obs.disconnect(); if (interval) clearInterval(interval); };
  }, []);

  const teamAvatars: { initials: string; bg: string }[] = [
    { initials: 'SK', bg: '#4285F4' }, // Google blue
    { initials: 'MR', bg: '#EA4335' }, // Google red
    { initials: 'AP', bg: '#34A853' }, // Google green
  ];

  // Filled progress percent — derived from `filled`
  const fillPct = (Math.max(0, Math.min(filled - 1, milestones.length - 1)) / (milestones.length - 1)) * 100;
  const ready = filled >= milestones.length;

  return (
    <div ref={ref} style={{
      position: 'relative',
      width: '100%', maxWidth: 440, margin: '0 auto',
      background: '#fff', borderRadius: 22,
      padding: 'clamp(18px, 5vw, 32px) clamp(14px, 4.5vw, 32px) clamp(18px, 5vw, 28px)',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Soft connection web — sits behind all content as a subtle background pattern */}
      <svg
        viewBox="0 0 440 480"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.5 }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="handoffWebGlow" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="rgba(212,242,92,0.18)" />
            <stop offset="70%" stopColor="rgba(212,242,92,0)" />
          </radialGradient>
        </defs>
        <circle cx="220" cy="260" r="200" fill="url(#handoffWebGlow)" />
        {/* Six anchor nodes around the card with curved cross-connections */}
        {(() => {
          const cx = 220, cy = 260, r = 180;
          const nodes = Array.from({ length: 6 }, (_, i) => {
            const a = (-90 + i * 60) * (Math.PI / 180);
            return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
          });
          const lines: React.ReactElement[] = [];
          for (let i = 0; i < nodes.length; i++) {
            for (let j of [1, 2]) {
              const p1 = nodes[i];
              const p2 = nodes[(i + j) % nodes.length];
              const mx = (p1.x + p2.x) / 2;
              const my = (p1.y + p2.y) / 2;
              const qx = cx + (mx - cx) * 0.35;
              const qy = cy + (my - cy) * 0.35;
              lines.push(
                <path
                  key={`${i}-${j}`}
                  d={`M ${p1.x} ${p1.y} Q ${qx} ${qy} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke="rgba(26,46,31,0.07)"
                  strokeWidth="1"
                />
              );
            }
          }
          return lines;
        })()}
      </svg>

      {/* Content sits above the web */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top status — small pill, generous breathing room */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 100,
          background: ready ? 'rgba(212,242,92,0.22)' : 'rgba(0,0,0,0.04)',
          marginBottom: 28,
          transition: 'background 0.4s',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: ready ? 'var(--lime)' : 'rgba(0,0,0,0.25)',
            transition: 'background 0.4s',
          }} />
          <span style={{
            fontSize: 11, fontWeight: 500, letterSpacing: '0.1em',
            color: 'var(--green-900)',
            textTransform: 'uppercase',
          }}>
            {ready ? 'Case ready' : 'In progress'}
          </span>
        </div>

        {/* Patient identity — clean horizontal row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #F4F1EA 0%, #E9E4D6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
            letterSpacing: '0.02em',
            color: 'var(--green-900)', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>JM</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--green-900)', marginBottom: 3 }}>
              Jake M., age 4
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              Blue Cross PPO · ABA Therapy
            </div>
          </div>
        </div>

      {/* Progress ribbon — delicate outlined dots, hairline connector */}
      <div style={{ position: 'relative', padding: '0 10px', marginBottom: 32 }}>
        {/* Background line — hairline, matches the channel-web aesthetic */}
        <div style={{
          position: 'absolute', top: 6.5, left: 18, right: 18,
          height: 1, background: 'rgba(26,46,31,0.10)',
        }} />
        {/* Filled progress line — still hairline, just a touch more visible */}
        <div style={{
          position: 'absolute', top: 6.5, left: 18,
          width: `calc((100% - 36px) * ${fillPct / 100})`,
          height: 1, background: 'rgba(26,46,31,0.45)',
          transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
        {/* Milestone dots + labels */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          {milestones.map((m, i) => {
            const done = filled > i;
            const isReadyDot = i === milestones.length - 1 && done;
            return (
              <div key={m} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11,
              }}>
                <div style={{
                  width: 13, height: 13, borderRadius: '50%',
                  background: '#fff',
                  border: done
                    ? '1px solid rgba(26,46,31,0.55)'
                    : '1px solid rgba(26,46,31,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: done ? 'scale(1)' : 'scale(0.85)',
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease 0.15s',
                  boxShadow: isReadyDot && ready ? '0 0 0 4px rgba(212, 242, 92, 0.4)' : 'none',
                }}>
                  {done && (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="rgba(26,46,31,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: done ? 1 : 0, transition: 'opacity 0.25s ease 0.2s' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span style={{
                  fontSize: 'clamp(9px, 2.8vw, 11px)',
                  color: done ? 'var(--green-900)' : 'var(--gray-500)',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease',
                  opacity: done ? 0.85 : 0.65,
                }}>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Handoff footer — simple, single-line layout */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
        opacity: ready ? 1 : 0.55,
        transform: ready ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--lime)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>
          <span style={{
            fontSize: 13, fontWeight: 400, color: 'var(--green-900)',
            whiteSpace: 'nowrap',
          }}>
            Handed off to clinical team
          </span>
        </div>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {teamAvatars.map((a, i) => (
            <div key={a.initials} style={{
              width: 24, height: 24, borderRadius: '50%',
              background: a.bg,
              border: '2px solid #fff',
              marginLeft: i > 0 ? -8 : 0,
              fontSize: 9, fontWeight: 600,
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{a.initials}</div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

// ── CHECKLIST VISUAL — each row's icon goes idle → loading-spinner → check (cascading) ──
function ChecklistVisual() {
  const items = [
    { label: 'Insurance verified', sub: 'Blue Cross PPO', done: true },
    { label: 'Consent form', sub: 'Signed', done: true },
    { label: 'Insurance card', sub: 'Uploaded via text', done: true },
    { label: 'Diagnosis report', sub: 'Requested', done: true },
  ];
  type ItemState = 'idle' | 'loading' | 'done';
  const [states, setStates] = useState<ItemState[]>(['idle', 'idle', 'idle', 'idle']);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let ran = false;
    const STAGGER = 350;
    const LOAD_MS = 650;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran) {
        ran = true;
        items.forEach((item, i) => {
          const startT = i * STAGGER;
          // start loading
          timeouts.push(setTimeout(() => {
            setStates((prev) => {
              const next = [...prev];
              next[i] = 'loading';
              return next;
            });
          }, startT));
          // for items that complete, flip to done after a short load
          if (item.done) {
            timeouts.push(setTimeout(() => {
              setStates((prev) => {
                const next = [...prev];
                next[i] = 'done';
                return next;
              });
            }, startT + LOAD_MS));
          }
        });
        obs.disconnect();
      }
    }, VISUAL_IN_VIEW);
    obs.observe(el);
    return () => { obs.disconnect(); timeouts.forEach((t) => clearTimeout(t)); };
  }, []);

  return (
    <div ref={ref} style={{ width: '100%', maxWidth: 320, margin: '0 auto', textAlign: 'left' }}>
      {items.map((item, j, arr) => {
        const state = states[j];
        const isDone = state === 'done';
        const isLoading = state === 'loading';
        return (
          <div key={j} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 0',
            borderBottom: j < arr.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--green-900)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.sub}</div>
            </div>

            <div style={{ position: 'relative', width: 24, height: 24 }}>
              {/* idle: faded dashed placeholder */}
              <div style={{
                position: 'absolute', inset: 0,
                width: 24, height: 24, borderRadius: '50%',
                border: '1.5px dashed rgba(0,0,0,0.18)',
                opacity: state === 'idle' ? 1 : 0,
                transform: state === 'idle' ? 'scale(1)' : 'scale(0.8)',
                transition: 'opacity 0.25s ease, transform 0.25s ease',
                pointerEvents: 'none',
              }} />

              {/* loading: spinning lime arc on a faint stone ring */}
              <svg
                width="24" height="24" viewBox="0 0 24 24"
                fill="none"
                style={{
                  position: 'absolute', inset: 0,
                  opacity: isLoading ? 1 : 0,
                  transform: isLoading ? 'scale(1)' : 'scale(0.85)',
                  transition: 'opacity 0.2s ease, transform 0.25s ease',
                  animation: isLoading ? 'spin 0.8s linear infinite' : 'none',
                  pointerEvents: 'none',
                }}
              >
                <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.08)" strokeWidth="2.4" />
                <circle cx="12" cy="12" r="10" stroke="var(--lime)" strokeWidth="2.6"
                  strokeLinecap="round" strokeDasharray="20 48" />
              </svg>

              {/* done: lime-filled circle + dark check, with an expanding lime pulse */}
              <div style={{
                position: 'absolute', inset: 0,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--lime)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: isDone ? 1 : 0,
                transform: isDone ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.3s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                pointerEvents: 'none',
                boxShadow: isDone ? '0 1px 8px rgba(212, 242, 92, 0.45)' : 'none',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green-900)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline
                    points="20 6 9 17 4 12"
                    style={{
                      strokeDasharray: 30,
                      strokeDashoffset: isDone ? 0 : 30,
                      transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.12s',
                    }}
                  />
                </svg>
              </div>
              {isDone && (
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 24, height: 24, borderRadius: '50%',
                  border: '2px solid var(--lime)',
                  animation: 'checkLand 0.7s ease-out both',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CHANNELS HUB — sequential reveal: center first, then each pill clockwise ──
function ChannelsHub() {
  const channels = [
    { name: 'Phone', soon: false },
    { name: 'Text', soon: false },
    { name: 'Chat', soon: false },
    { name: 'Forms', soon: false },
    { name: 'Fax', soon: true },
    { name: 'Email', soon: false },
  ];
  const [step, setStep] = useState(0); // 0 = hidden, 1..6 = each pill appears, then connections
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    let ran = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran) {
        ran = true;
        let s = 0;
        interval = setInterval(() => {
          s++;
          setStep(s);
          if (s >= channels.length + 1) {
            if (interval) clearInterval(interval);
          }
        }, 260);
        obs.disconnect();
      }
    }, VISUAL_IN_VIEW);
    obs.observe(el);
    return () => { obs.disconnect(); if (interval) clearInterval(interval); };
  }, []);

  // Hexagonal positions for each pill — same as before
  const PILL_RADIUS = 130;
  const positions = channels.map((_, i) => {
    const a = (-90 + i * 60) * (Math.PI / 180);
    return { x: 180 + Math.cos(a) * PILL_RADIUS, y: 180 + Math.sin(a) * PILL_RADIUS };
  });

  // Web of curved connections — every pair of adjacent + every-other-pair
  // (gives a rich "all connected" mesh without a central hub).
  const connections: { from: number; to: number }[] = [];
  for (let i = 0; i < channels.length; i++) {
    connections.push({ from: i, to: (i + 1) % channels.length }); // hex ring
    connections.push({ from: i, to: (i + 2) % channels.length }); // skip-one inner chords
  }
  const webVisible = step >= channels.length + 1;

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 360, aspectRatio: '1 / 1', margin: '0 auto' }}>
      <svg viewBox="0 0 360 360" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          {/* Soft gradient so the web reads as a calm connection, not heavy lines */}
          <radialGradient id="webGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--lime)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center glow — subtle warm haze under the web */}
        <circle cx="180" cy="180" r="120" fill="url(#webGlow)"
          style={{ opacity: webVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />

        {/* Web — curved lines connecting pills */}
        {connections.map((c, i) => {
          const p1 = positions[c.from];
          const p2 = positions[c.to];
          // Curve control point bowed toward the center for a soft, organic feel
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const cx = 180 + (mx - 180) * 0.4;
          const cy = 180 + (my - 180) * 0.4;
          const path = `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
          // Each line lights up shortly after both endpoints are visible
          const lineDelay = Math.max(c.from, c.to) * 0.26;
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="rgba(26,46,31,0.18)"
              strokeWidth="1.2"
              strokeLinecap="round"
              style={{
                opacity: webVisible ? 1 : 0,
                transition: `opacity 0.6s ease ${lineDelay}s`,
              }}
            />
          );
        })}

        {/* Glowing node dot at each pill anchor (small accent under each pill) */}
        {positions.map((p, i) => {
          const visible = step >= i + 1;
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y} r="4"
              fill="var(--lime)"
              style={{
                opacity: visible ? 0.9 : 0,
                transition: 'opacity 0.4s ease',
                filter: 'drop-shadow(0 0 6px rgba(212,242,92,0.6))',
              }}
            />
          );
        })}
      </svg>

      {/* Channel pills */}
      {channels.map((ch, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const x = 50 + Math.cos(a) * 36;
        const y = 50 + Math.sin(a) * 36;
        const visible = step >= i + 1;
        return (
          <div key={ch.name} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: `translate(-50%, -50%) scale(${visible ? 1 : 0.4})`,
            opacity: visible ? 1 : 0,
            background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 999, padding: '7px 14px 7px 11px',
            fontSize: 12, fontWeight: 500, color: 'var(--green-900)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap',
            display: 'inline-flex', alignItems: 'center', gap: 7,
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
          }}>
            <ChannelIcon name={ch.name} />
            {ch.name}
            {ch.soon && (
              <span style={{
                position: 'absolute', top: -9, right: -8,
                background: 'var(--bone)', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 999, padding: '2.5px 6px',
                fontSize: 8, fontWeight: 600, letterSpacing: '0.05em',
                textTransform: 'uppercase', lineHeight: 1,
                color: 'rgba(26,46,31,0.55)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }}>
                Coming soon
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ── HOW CARELU WORKS ── (video subsection removed)
function HowCarelu() {
  const steps = [
    {
      step: '01',
      tag: 'Multi-channel',
      title: 'Every family. Answered in seconds.',
      desc: 'Phone calls, texts, web forms, faxes, emails — Carelu answers them all instantly, 24/7, in English and Spanish. Families get a response in seconds, not days.',
      visual: <ChannelsHub />,
    },
    {
      step: '02',
      tag: 'AI-powered',
      title: 'Qualifies and collects. Automatically.',
      desc: 'Carelu knows your insurance panels, service areas, and open capacity. It verifies eligibility, collects insurance cards, gathers consent forms — all through natural conversation.',
      visual: <ChecklistVisual />,
    },
    {
      step: '03',
      tag: 'Automated',
      title: 'Follows up and delivers. Every time.',
      desc: 'Missing documents? Carelu nudges. Doctor hasn\'t responded? It follows up. And every document and detail syncs to the family record — intake\'s source of truth. Once it\'s complete and signed, Carelu schedules the assessment and hands off a ready case.',
      visual: <HandoffVisual />,
    },
  ];
  return <HowItWorksScroll steps={steps} />;
}

type HowStep = { step: string; tag: string; title: string; desc: string; visual: React.ReactNode };

// One step card — shared by the desktop horizontal track and the mobile vertical stack.
function HowStepCard({ s, mobile }: { s: HowStep; mobile?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 24,
      boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
      display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1.2fr',
      overflow: 'hidden',
      width: mobile ? '100%' : 'clamp(640px, 78vw, 900px)',
      minHeight: mobile ? 0 : 380,
      minWidth: 0,
      flexShrink: 0,
    }}>
      <div style={{
        padding: mobile ? '28px 20px' : 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.015)',
        minWidth: 0, overflow: 'hidden',
      }}>
        {s.visual}
      </div>
      <div style={{
        padding: mobile ? '28px 24px 24px' : '40px 40px 32px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        minWidth: 0,
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontSize: 11, fontWeight: 600, color: 'var(--gray-500)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--lime)', color: 'var(--green-900)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, letterSpacing: 0,
              fontFamily: 'var(--font-body)',
            }}>{s.step}</span>
            Step
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: mobile ? 24 : 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 400, color: 'var(--green-900)',
            lineHeight: 1.2, letterSpacing: '-0.5px',
            margin: '0 0 14px',
          }}>
            {s.title}
          </h3>
          <p style={{
            fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0,
          }}>
            {s.desc}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: mobile ? 22 : 28, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)',
        }}>
          <span style={{
            display: 'inline-block', fontSize: 12, fontWeight: 500,
            color: 'var(--gray-600)', background: 'rgba(0,0,0,0.04)',
            borderRadius: 999, padding: '6px 14px',
          }}>
            {s.tag}
          </span>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--green-900)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksScroll({ steps }: { steps: HowStep[] }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (isMobile) return; // mobile renders a vertical stack — no scroll-jacking
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / trackH));
      // Animation starts as soon as the section enters view (header + first card
      // visible together) and finishes shortly before it scrolls off.
      const START = 0.05;
      const END = 0.85;
      const animProgress = Math.max(0, Math.min(1, (progress - START) / (END - START)));

      // Center the FIRST card at animProgress=0 and the LAST card at
      // animProgress=1, so the row enters with step 1 centered, slides left as
      // you scroll, and ends with the final step centered (not flush to an edge).
      const viewportW = window.innerWidth;
      const cards = track.children;
      const cardW = (cards[0] as HTMLElement).offsetWidth;
      const gap = 32;                   // matches the track's `gap`
      const padLeft = viewportW * 0.08; // matches the track's `padding: 0 8vw`
      // translateX that puts card i's center at the viewport center
      const centerShift = (i: number) =>
        viewportW / 2 - (padLeft + i * (cardW + gap) + cardW / 2);
      const startShift = centerShift(0);
      const endShift = centerShift(cards.length - 1);
      const shift = startShift + animProgress * (endShift - startShift);
      track.style.transform = `translate3d(${shift}px, 0, 0)`;

      // Active card indicator
      const total = steps.length;
      const idx = Math.min(total - 1, Math.floor(animProgress * total));
      setActiveIdx(idx);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [steps.length, isMobile]);

  // ── MOBILE: vertical stack — step 1 → 2 → 3 top to bottom, no pinning ──
  if (isMobile) {
    return (
      <section id="how-it-works" style={{
        position: 'relative', background: 'var(--bone)',
        paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      }}>
        <div style={{ textAlign: 'center', paddingBottom: 36 }}>
          <div className="rv"><Pill>How it works</Pill></div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, marginTop: 12, padding: '0 20px' }}>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 8vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12,
              letterSpacing: '-0.02em', margin: 0,
            }}>
              Scale your practice on your terms.
            </h2>
          </div>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 20,
          padding: '0 20px', maxWidth: 560, margin: '0 auto',
        }}>
          {steps.map((s, i) => (
            <div key={s.step} className={`rv d${Math.min(i + 1, 5)}`} style={{ minWidth: 0 }}>
              <HowStepCard s={s} mobile />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── DESKTOP: pinned horizontal track, step 1 centered → step 3 centered ──
  return (
    <section id="how-it-works" ref={sectionRef} style={{
      height: '320vh', position: 'relative', background: 'var(--bone)',
    }}>
      <div style={{
        position: 'sticky', top: 0, height: '100svh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header — INSIDE the sticky pin so it stays locked with the cards */}
        <div style={{
          paddingTop: 'clamp(36px, 5vh, 64px)', paddingBottom: 'clamp(48px, 7vh, 88px)',
          textAlign: 'center', flex: '0 0 auto',
        }}>
          <div className="rv"><Pill>How it works</Pill></div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            marginTop: 12,
          }}>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)', lineHeight: 1.12,
              letterSpacing: '-0.02em', margin: 0,
            }}>
              Scale your practice on your terms.
            </h2>
            <img
              className="rv-scale h2-doodle"
              src="/how-it-works-illustration.svg"
              alt=""
              aria-hidden="true"
              style={{ width: 135, height: 'auto', display: 'block', flexShrink: 0, margin: '-38px -22px -38px -12px' }}
            />
          </div>
        </div>
        {/* Horizontal track of cards */}
        <div style={{
          flex: '0 0 auto', display: 'flex', alignItems: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex', gap: 32,
              padding: '0 8vw',
              willChange: 'transform',
              transition: 'transform 0.05s linear',
            }}
          >
            {steps.map((s) => (
              <HowStepCard key={s.step} s={s} />
            ))}
          </div>
        </div>

        {/* Progress dots — sit lower, with extra breathing room above */}
        <div style={{
          marginTop: 'clamp(48px, 7vh, 96px)', paddingBottom: 'clamp(24px, 4vh, 48px)',
          display: 'flex', justifyContent: 'center', gap: 8,
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? 24 : 8, height: 8,
              borderRadius: 4,
              background: i === activeIdx ? 'var(--green-900)' : 'rgba(0,0,0,0.18)',
              transition: 'width 0.3s var(--ease-dramatic), background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── OUTCOMES — expandable improvement-metric rows ──────────
function Outcomes() {
  const [open, setOpen] = useState<number | null>(0);
  const metrics = [
    {
      v: 40, s: '%', label: 'Increase in lead volume',
      bullets: [
        'Engaging AI chat starts conversations website forms never could.',
        'AI phone coverage does intake on after-hours, overflow, and missed calls.',
        'Every inquiry answered in seconds — nights and weekends included.',
        'English and Spanish, natively.',
      ],
    },
    {
      v: 85, s: '%', label: 'Increase in intake completion',
      bullets: [
        'Magic forms turn 30-page packets into one natural conversation.',
        'Instant qualification against your panels, service areas, and capacity.',
        'Automatic follow-ups on every missing piece — documents, signatures, consents.',
        'Doctors reached out to directly when a diagnosis report is missing.',
      ],
    },
    {
      v: 70, s: '%', label: 'Less staff time per intake',
      bullets: [
        'Eligibility checked, documents collected, everything synced to the family record — no re-entry.',
        'Every follow-up handled — families, doctors, missing pieces.',
        'Your coordinators handle exceptions, not data entry.',
        'One coordinator runs what used to take a team.',
      ],
    },
    {
      v: 35, s: '%', label: 'Improvement in show-up rates',
      bullets: [
        'Assessments scheduled the moment prior authorization clears.',
        'Reminders before every appointment.',
        'Families who go quiet are re-engaged automatically.',
      ],
    },
    {
      v: 5000, s: '+', label: 'RBTs and BCBAs hired through Carelu',
      bullets: [
        'Candidates apply through the same natural conversation families do — no clunky portals.',
        'Credentials, availability, and screening questions collected up front.',
        'Thousands of clinicians brought to providers.',
      ],
    },
  ];
  const numCol = 'clamp(96px, 11vw, 150px)';
  return (
    <section id="outcomes" style={{
      position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <div className="rv"><Pill>Outcomes</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400, color: 'var(--green-900)',
            lineHeight: 1.12, letterSpacing: '-0.02em', margin: '12px 0 0',
          }}>
            Improve the metrics that matter.
          </h2>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', borderTop: '1px solid rgba(0,0,0,0.10)' }}>
          {metrics.map((m, i) => (
            <div key={m.label} className={`rv d${i + 1}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.10)' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-label={`${open === i ? 'Collapse' : 'Expand'}: ${m.label}`}
                style={{
                  width: '100%', display: 'grid',
                  gridTemplateColumns: `${numCol} 1fr auto`,
                  alignItems: 'center', gap: 'clamp(16px, 2.5vw, 32px)',
                  padding: '26px 0', border: 'none', background: 'none',
                  textAlign: 'left', cursor: 'pointer',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 400,
                  fontSize: 'clamp(38px, 4.2vw, 58px)', lineHeight: 1,
                  color: 'var(--green-900)', letterSpacing: '-0.02em',
                  fontVariantNumeric: 'lining-nums tabular-nums',
                  whiteSpace: 'nowrap',
                }}>
                  <Counter target={m.v} suffix={m.s} />
                </span>
                <span style={{
                  fontSize: 'clamp(16px, 1.7vw, 19px)', fontWeight: 500,
                  color: 'var(--green-900)', letterSpacing: '-0.01em',
                }}>
                  {m.label}
                </span>
                <span aria-hidden="true" style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid rgba(0,0,0,0.15)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--green-900)', fontSize: 19, fontWeight: 300, lineHeight: 1,
                  background: open === i ? 'var(--lime)' : 'transparent',
                  borderColor: open === i ? 'var(--green-900)' : 'rgba(0,0,0,0.15)',
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.35s var(--ease-dramatic), background 0.25s, border-color 0.25s',
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: open === i ? 260 : 0, overflow: 'hidden',
                transition: 'max-height 0.5s var(--ease-dramatic)',
              }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: `${numCol} 1fr auto`,
                  gap: 'clamp(16px, 2.5vw, 32px)',
                }}>
                  <span />
                  <ul style={{
                    margin: 0, paddingBottom: 26, paddingLeft: 18, maxWidth: 560,
                    listStyle: 'disc',
                  }}>
                    {m.bullets.map((b) => (
                      <li key={b} style={{
                        fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.75,
                      }}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ── IMPACT — clean stat cards on cream ──────────
function Impact() {
  return (
    <section id="results" style={{
      position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        {/* Header — tighter spacing so it doesn't float disconnected from the data */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div className="rv"><Pill>Proven results</Pill></div>
          <div className="impact-head" style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            marginTop: 12,
          }}>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0,
            }}>
              The results speak louder than we can.
            </h2>
            <img
              className="rv-scale h2-doodle"
              src="/results-illustration.svg"
              alt=""
              aria-hidden="true"
              style={{ width: 92, height: 'auto', display: 'block', flexShrink: 0, margin: '-16px 0 -16px 18px' }}
            />
          </div>
        </div>

        {/* Unified stats block — counter and cards live in one composition with consistent spacing */}
        <div style={{ maxWidth: 1100, margin: '0 auto', color: 'var(--green-900)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <LiveCounter />
          </div>

          <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { v: 3, s: '\u00d7', t2: 'More families admitted', d: 'Same team. Same hours. Triple the output.' },
            { v: 10, s: ' min', t2: 'First contact to intake-ready', p: '<', d: 'What used to take 3-5 days.' },
            { v: 85, s: '%', t2: 'Increase in intake completion', d: 'Families finish what they start.' },
            { v: 0, s: '', t2: 'Manual follow-ups', d: 'Your team focuses on care, not chasing.' },
          ].map((s, i) => (
            <div
              key={s.t2}
              className={`rv-scale d${i + 1}`}
              style={{
                background: '#fff', borderRadius: 20,
                padding: '40px 28px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
                transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(20, 40, 30, 0.12), 0 2px 6px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)';
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 400,
                color: 'var(--green-900)', lineHeight: 1, marginBottom: 16,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'lining-nums tabular-nums',
              }}>
                <Counter target={s.v} suffix={s.s} prefix={s.p || ''} />
              </div>
              <div style={{ fontWeight: 500, color: 'var(--green-900)', fontSize: 14, marginBottom: 6 }}>{s.t2}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
          </div>
        </div>

      </div>
    </section>
  );
}


// ── GETTING STARTED — 2×2 vignette cards + founder note on direct access ─────

// Small animated vignettes for each onboarding step — same crafted-miniature
// language as ChecklistVisual / HandoffVisual.
function GsVignetteCall() {
  return (
    <div className="gs-pop" style={{
      background: '#fff', borderRadius: 14, padding: '16px 18px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
      width: 250,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces" alt="" style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          objectFit: 'cover', border: '1px solid var(--sage-200)',
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-900)' }}>Intro call</div>
          <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>Intake specialist &middot; 45 min</div>
        </div>
      </div>
      <div style={{
        marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>Tue, 11:00 AM</span>
        <span className="gs-check" style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'var(--lime)', color: 'var(--green-900)',
          fontSize: 10.5, fontWeight: 600, borderRadius: 999, padding: '4px 9px',
        }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
          Scheduled
        </span>
      </div>
    </div>
  );
}

function GsVignetteSign() {
  return (
    <div className="gs-pop" style={{
      background: '#fff', borderRadius: 14, padding: '18px 20px 14px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
      width: 250,
    }}>
      {[112, 168, 138].map((w) => (
        <div key={w} style={{ height: 5, width: w, borderRadius: 3, background: 'rgba(0,0,0,0.07)', marginBottom: 8 }} />
      ))}
      <div style={{
        marginTop: 14, paddingTop: 4, borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
      }}>
        <svg width="128" height="42" viewBox="0 0 128 42" fill="none" style={{ display: 'block' }}>
          <path
            className="gs-sig"
            pathLength={1}
            d="M6 32 C 20 6, 30 4, 27 20 C 24 33, 12 37, 24 28 C 38 18, 44 14, 52 22 C 58 28, 64 20, 72 24 C 80 28, 88 18, 98 24 C 106 29, 114 24, 122 27"
            stroke="var(--green-800, #2C3E2D)" strokeWidth="1.6" strokeLinecap="round"
          />
        </svg>
        <span className="gs-check" style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: 'var(--lime)', color: 'var(--green-900)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
        </span>
      </div>
    </div>
  );
}

function GsVignetteTrain() {
  const team = [
    { initials: 'DK', bg: '#7B8F7B' },
    { initials: 'RA', bg: '#A08F76' },
    { initials: 'MS', bg: '#6E7F8D' },
    { initials: 'TB', bg: '#8D7B8F' },
  ];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {team.map((a, i) => (
          <div key={a.initials} className="gs-av" style={{
            width: 44, height: 44, borderRadius: '50%',
            background: a.bg, border: '2.5px solid #fff',
            marginLeft: i > 0 ? -10 : 0,
            fontSize: 12, fontWeight: 600, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
            position: 'relative', zIndex: team.length - i,
          }}>
            {a.initials}
          </div>
        ))}
      </div>
      <div className="gs-check" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 16,
        background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: 999, padding: '6px 13px',
        fontSize: 11.5, fontWeight: 500, color: 'var(--green-900)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <span style={{
          width: 15, height: 15, borderRadius: '50%', background: 'var(--lime)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-900)',
        }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 6" /></svg>
        </span>
        Team onboarded
      </div>
    </div>
  );
}

function GsVignetteLive() {
  return (
    <div className="gs-pop" style={{
      background: '#fff', borderRadius: 14, padding: '16px 18px 14px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
      width: 250,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Intakes this week
        </span>
        <span className="gs-check" style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10.5, fontWeight: 600, color: 'var(--green-900)',
          background: 'var(--lime)', borderRadius: 999, padding: '3px 8px',
        }}>
          Live
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1.1,
        color: 'var(--green-900)', fontVariantNumeric: 'lining-nums tabular-nums',
        marginBottom: 6,
      }}>
        <Counter target={12} />
      </div>
      <svg width="100%" height="38" viewBox="0 0 214 38" fill="none" preserveAspectRatio="none" style={{ display: 'block' }}>
        <path
          className="gs-spark"
          pathLength={1}
          d="M2 32 C 26 30, 38 24, 56 25 C 76 26, 88 18, 108 19 C 126 20, 138 12, 158 13 C 176 14, 194 8, 212 5"
          stroke="var(--green-800, #2C3E2D)" strokeWidth="1.8" strokeLinecap="round"
        />
        <circle className="gs-check" cx="212" cy="5" r="3.5" fill="var(--lime)" stroke="var(--green-900)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

function GettingStarted() {
  const steps = [
    {
      n: '01',
      title: 'Meet your specialist',
      desc: 'A short call to walk through how your practice works — panels, service areas, programs. You’ll meet the person who’ll be working alongside your team.',
      visual: <GsVignetteCall />,
    },
    {
      n: '02',
      title: 'Sign and get set up',
      desc: 'We configure Carelu around your practice and connect it across your front office. Integrations with leading CRMs and EMRs mean you launch fast — without changing your core systems.',
      visual: <GsVignetteSign />,
    },
    {
      n: '03',
      title: 'We train your team',
      desc: 'One session, and your team knows how Carelu works and where to find everything it collects. It should feel like a new teammate, not new software.',
      visual: <GsVignetteTrain />,
    },
    {
      n: '04',
      title: 'Go live, with visibility',
      desc: 'Your dashboard shows every conversation and every intake as it happens. And a dedicated growth partner stays on your account, working it like one of your own.',
      visual: <GsVignetteLive />,
    },
  ];
  return (
    <section id="getting-started" style={{
      position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
          <div className="rv"><Pill>Getting started</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400, color: 'var(--green-900)',
            lineHeight: 1.12, letterSpacing: '-0.02em', margin: '12px 0 0',
          }}>
            Getting started is simple.
          </h2>
        </div>

        {/* 2×2 step cards — each with a small animated vignette */}
        <div className="gs-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20,
          maxWidth: 1000, margin: '0 auto',
        }}>
          {steps.map((s, i) => (
            <div key={s.n} className={`rv gs-card d${i + 1}`} style={{
              background: '#fff', borderRadius: 24,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.015)', borderBottom: '1px solid rgba(0,0,0,0.04)',
                minHeight: 178, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '26px 24px',
              }}>
                {s.visual}
              </div>
              <div style={{ padding: '26px 30px 30px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontSize: 11, fontWeight: 600, color: 'var(--gray-500)',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  marginBottom: 12,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--lime)', color: 'var(--green-900)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, letterSpacing: 0,
                  }}>{s.n}</span>
                  Step
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2vw, 26px)',
                  fontWeight: 400, color: 'var(--green-900)',
                  lineHeight: 1.2, letterSpacing: '-0.5px', margin: '0 0 10px',
                }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet enterprise pointer */}
        <p className="rv" style={{
          textAlign: 'center', fontSize: 14, color: 'var(--gray-500)',
          margin: '40px auto 0', maxWidth: 520, lineHeight: 1.6,
        }}>
          Larger organization? We&rsquo;ll shape onboarding around your locations, systems, and team.{' '}
          <a href="/demo" style={{ color: 'var(--green-900)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Talk to us
          </a>
        </p>
      </div>

      {/* Scoped vignette choreography — cards rise via .rv; inner pieces follow */}
      <style>{`
        .gs-card .gs-pop { opacity: 0; transform: translateY(12px) scale(0.97); transition: opacity 0.6s ease 0.25s, transform 0.65s var(--ease-dramatic) 0.25s; }
        .gs-card.visible .gs-pop { opacity: 1; transform: translateY(0) scale(1); }
        .gs-card .gs-check { opacity: 0; transform: scale(0.4); transition: opacity 0.4s ease 1.05s, transform 0.5s var(--ease-dramatic) 1.05s; }
        .gs-card.visible .gs-check { opacity: 1; transform: scale(1); }
        .gs-card .gs-sig { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.3s ease-in-out 0.45s; }
        .gs-card.visible .gs-sig { stroke-dashoffset: 0; }
        .gs-card .gs-spark { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.3s ease-in-out 0.45s; }
        .gs-card.visible .gs-spark { stroke-dashoffset: 0; }
        .gs-card .gs-av { opacity: 0; transform: scale(0.3) translateY(6px); transition: opacity 0.45s ease, transform 0.55s var(--ease-dramatic); }
        .gs-card.visible .gs-av { opacity: 1; transform: scale(1) translateY(0); }
        .gs-card.visible .gs-av:nth-child(1) { transition-delay: 0.3s; }
        .gs-card.visible .gs-av:nth-child(2) { transition-delay: 0.42s; }
        .gs-card.visible .gs-av:nth-child(3) { transition-delay: 0.54s; }
        .gs-card.visible .gs-av:nth-child(4) { transition-delay: 0.66s; }
        @media (max-width: 768px) {
          .gs-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}


// ── COMPLIANCE -- formal certificate style ─────
function Compliance() {
  const items = [
    { label: 'HIPAA', detail: 'End-to-end encryption, signed BAAs, annual audits' },
    { label: 'SOC 2', detail: 'Type II certified, continuous monitoring' },
    { label: 'AES-256', detail: 'Data encrypted at rest and in transit (TLS 1.2+)' },
    { label: 'US Only', detail: 'HIPAA-eligible data centers, no offshore processing' },
    { label: 'RBAC', detail: 'Role-based access controls, full audit trail on PHI' },
    { label: 'BAA', detail: 'Signed before you go live, every time' },
  ];

  const headlineWords = ['Your', 'compliance', 'team', 'will', 'love', 'us.'];

  // Custom intersection observer for the header — drives the orchestrated reveal
  // (shield pulse → shield outline draw → checkmark draw → word cascade → subtitle)
  const headRef = useRef<HTMLDivElement>(null);
  const [headInView, setHeadInView] = useState(false);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHeadInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{
      paddingTop: 'clamp(56px, 8vw, 100px)', paddingBottom: 'clamp(56px, 8vw, 100px)',
      background: 'var(--white)',
    }}>
      <div style={W}>
        {/* The "certificate" — capped width, generous inner padding */}
        <div className="rv-scale compliance-cert" style={{
          border: '1px solid var(--gray-200)',
          borderRadius: 22,
          padding: 'clamp(44px, 5.2vw, 72px)',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 1080,
          margin: '0 auto',
        }}>
          {/* Corner flourishes — slightly smaller */}
          {[{ top: 0, left: 0 }, { top: 0, right: 0, scaleX: -1 }, { bottom: 0, left: 0, scaleY: -1 }, { bottom: 0, right: 0, scaleX: -1, scaleY: -1 }].map((pos, i) => (
            <svg key={i} width="36" height="36" viewBox="0 0 36 36" fill="none" style={{
              position: 'absolute', ...pos,
              transform: `scaleX(${pos.scaleX ?? 1}) scaleY(${pos.scaleY ?? 1})`,
              opacity: 0.14,
            }}>
              <path d="M0 0 L36 0 L36 3 L3 3 L3 36 L0 36 Z" fill="var(--green-800)" />
            </svg>
          ))}

          {/* Shield icon + headline */}
          <div
            ref={headRef}
            className={`compliance-head${headInView ? ' visible' : ''}`}
            style={{ textAlign: 'center', marginBottom: 32 }}
          >
            <div className="compliance-shield" style={{
              width: 52, height: 52, borderRadius: '50%', margin: '0 auto 18px',
              background: 'var(--sage-100)', border: '1px solid var(--sage-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              willChange: 'transform, box-shadow',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path className="compliance-shield-path" pathLength={1} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path className="compliance-check" pathLength={1} d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)', fontWeight: 400,
              color: 'var(--green-900)', lineHeight: 1.12, marginBottom: 12,
              letterSpacing: '-0.02em',
            }}>
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className="compliance-word"
                  style={{ animationDelay: `${0.25 + i * 0.08}s` }}
                >
                  {word}{i < headlineWords.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className="compliance-subtitle" style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-400)', maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
              Built for healthcare from day one. Not retrofitted.
            </p>
          </div>

          {/* Certification grid — tighter cell padding */}
          <div className="mobile-stack compliance-cells" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0, borderTop: '1px solid var(--gray-200)',
          }}>
            {items.map((item, i) => (
              <div
                key={item.label}
                className={`rv d${i + 1}`}
                style={{
                  padding: '28px 24px',
                  borderRight: (i % 3 !== 2) ? '1px solid var(--gray-200)' : 'none',
                  borderBottom: i < 3 ? '1px solid var(--gray-200)' : 'none',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400,
                  color: 'var(--green-900)', marginBottom: 6, letterSpacing: '-0.02em',
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.5 }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>

          {/* Scoped keyframes — soft, subtle reveal */}
          <style>{`
            @keyframes complianceFadeUp {
              from { opacity: 0; transform: translateY(8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes complianceShieldFade {
              from { opacity: 0; transform: scale(0.96); }
              to   { opacity: 1; transform: scale(1); }
            }

            .compliance-word {
              display: inline-block;
              opacity: 0;
              transform: translateY(8px);
              will-change: transform, opacity;
            }
            .compliance-head.visible .compliance-word {
              animation: complianceFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
            }

            .compliance-shield {
              opacity: 0;
              transform: scale(0.96);
              transform-origin: center center;
              will-change: transform, opacity;
            }
            .compliance-head.visible .compliance-shield {
              animation: complianceShieldFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
            }

            .compliance-shield-path { /* renders normally, no draw-in */ }
            .compliance-check { /* renders normally, no draw-in */ }

            .compliance-subtitle {
              opacity: 0;
              transform: translateY(8px);
              will-change: transform, opacity;
            }
            .compliance-head.visible .compliance-subtitle {
              animation: complianceFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
            }

            @media (prefers-reduced-motion: reduce) {
              .compliance-word, .compliance-subtitle, .compliance-shield {
                opacity: 1 !important; transform: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}


// ── FAQ ──────────────────────────────────────────
function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: 'How does Carelu keep patient data safe?', a: 'We use end-to-end encryption, sign BAAs with every provider, undergo annual SOC 2 Type II audits, and store all data in HIPAA-eligible US data centers.' },
    { q: 'Will this replace our intake team?', a: "No -- and that's the point. Carelu handles the repetitive parts (eligibility checks, document collection, follow-ups) so your team can spend their time on clinical work and complex cases." },
    { q: 'How long until we\'re live?', a: 'Most providers go live within 1-2 weeks. We handle setup, configure your insurance rules and conversation flows, and train your team.' },
    { q: 'What if a family needs a real person?', a: 'Carelu hands off to your team with full context -- everything collected so far, the family\'s preferences, and a summary of the conversation.' },
    { q: 'Does Carelu integrate with our EHR or practice management system?', a: 'Yes. Carelu connects to the systems you already use -- CentralReach, Rethink, and most major EHR and practice management platforms -- so completed cases flow straight into your existing workflow with no double entry.' },
    { q: 'Can this work with my CRM?', a: 'Yes. Some practices use Carelu as their CRM, but we also integrate with Salesforce, Monday, Zoho, HubSpot, GoHighLevel, and ClickUp -- and we\'re always adding more. And with webhooks, you can connect Carelu to any other CRM or internal system.' },
    { q: 'Where does all the intake information live?', a: 'On the family record -- intake\'s single source of truth. A document emailed in is attached automatically, a detail mentioned in conversation updates the record, and both your team and the family can keep it current. It syncs to the systems you already use, so nothing is entered twice.' },
    { q: 'Which channels and languages does it support?', a: 'Phone, text, web forms, faxes, and email -- all in one inbox, answered 24/7. Conversations run natively in English and Spanish, with more languages on the way.' },
    { q: 'Can it handle multiple locations and insurance panels?', a: 'Absolutely. Carelu supports multi-site practices with location-specific rules -- different insurance panels, service areas, and open capacity per site -- and routes every family to the right place automatically.' },
    { q: 'What does onboarding look like?', a: 'We do the heavy lifting. Our team configures your insurance rules, service areas, and conversation flows, connects your channels, and trains your staff -- most providers are fully live within 1-2 weeks.' },
    { q: 'What does this actually cost?', a: 'We price based on volume and channels. Most providers see positive ROI within the first month. Book a demo and we\'ll walk through pricing for your setup.' },
  ];

  return (
    <section id="faq" style={{
      paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--bone)',
    }}>
      <div style={W}>
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 80, maxWidth: 1100, margin: '0 auto' }}>
          <div className="rv-left">
            <div className="rv"><Pill>Questions</Pill></div>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Let&apos;s clear things up.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--gray-500)', lineHeight: 1.6 }}>
              Still have questions? <a href="mailto:hello@carelu.ai" style={{ color: 'var(--green-900)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>We&apos;re real humans — just ask.</a>
            </p>

            {/* Hand-drawn doodle: new eye illustration */}
            <img
              className="rv d2"
              src="/faq-doodle-new.svg"
              alt=""
              aria-hidden="true"
              style={{ width: '100%', maxWidth: 460, display: 'block', marginTop: 32, marginLeft: -24 }}
            />
          </div>
          <div className="faq-card" style={{
            background: '#fff', borderRadius: 24, padding: '8px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
          }}>
            {faqs.map((f, i) => (
              <div key={i} className={`rv-right d${Math.min(i + 1, 5)}`} style={{
                borderBottom: i < faqs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
              }}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-label={`${open === i ? 'Collapse' : 'Expand'}: ${f.q}`} style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '24px 0', border: 'none', background: 'none', textAlign: 'left', gap: 16,
                  cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--green-900)' }}>{f.q}</span>
                  <span aria-hidden="true" style={{
                    fontSize: 20, color: 'var(--gray-500)',
                    transition: 'transform 0.3s var(--ease-dramatic)',
                    display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0,
                  }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.5s var(--ease-dramatic)' }}>
                  <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7, paddingBottom: 22, margin: 0 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



// ── CTA + FOOTER ─────────────────────────────────
function CtaFooter() {
  const columns: { title: string; links: string[] }[] = [
    { title: 'Product',    links: ['Intake AI', 'Insurance Verification', 'Document Collection', 'Follow-ups', 'Scheduling'] },
    { title: 'Industries', links: ['ABA Therapy', 'Mental Health', 'Home Care', 'Addiction Treatment', 'Hospice'] },
    { title: 'Customers',  links: ['Single-Site', 'Multi-Site', 'Enterprise'] },
    { title: 'Company',    links: ['About', 'Careers', 'News', 'Contact'] },
    { title: 'Resources',  links: ['Documentation', 'Trust', 'Status', 'Security'] },
  ];

  return (
    <footer style={{
      position: 'relative',
      padding: 'clamp(260px, 26vw, 400px) 36px 36px',
      background: 'var(--bone)',
      overflow: 'hidden',
    }}>
      {/* Landscape image — at 80% opacity so it stays the dominant background but with a softer feel */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/footer-landscape-new.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8,
        pointerEvents: 'none',
      }} />
      {/* Top cream fade — blends the landscape into the bone page background above */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 'clamp(140px, 18vw, 240px)',
        background: 'linear-gradient(180deg, var(--bone) 0%, rgba(250,248,243,0.85) 35%, rgba(250,248,243,0) 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* Dark wash for white text legibility */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(20,30,25,0.06) 0%, rgba(20,30,25,0.20) 55%, rgba(20,30,25,0.38) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400, color: 'var(--bone)',
            lineHeight: 1.12, letterSpacing: '-0.02em',
            maxWidth: 860, margin: '0 auto 14px',
            textShadow: '0 2px 16px rgba(0,0,0,0.25)',
          }}>
            Somewhere right now, a parent is searching for care for their child.
          </h2>
          <p className="rv d2" style={{
            fontSize: 15, color: 'rgba(250,248,243,0.82)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto',
            textShadow: '0 1px 8px rgba(0,0,0,0.2)',
          }}>
            Let&apos;s make sure they find you — and that when they do, someone&apos;s there.
          </p>
        </div>

        {/* Link columns */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 32, marginBottom: 80,
        }} className="footer-grid">
          {columns.map((col) => (
            <div key={col.title}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13, fontWeight: 600, color: 'var(--bone)',
                marginBottom: 16,
                textShadow: '0 1px 6px rgba(0,0,0,0.2)',
              }}>
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href={
                      link === 'Single-Site' ? '/solutions/single-site'
                      : link === 'Multi-Site' ? '/solutions/multi-site'
                      : link === 'Enterprise' ? '/solutions/enterprise'
                      : link === 'About' ? '/carelu/company'
                      : link === 'Careers' ? '/carelu/company#careers'
                      : link === 'Trust' || link === 'Security' ? 'https://trust.carelu.com'
                      : '#'
                    }
                    {...((link === 'Trust' || link === 'Security') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    style={{
                      fontSize: 13, color: 'rgba(250,248,243,0.75)',
                      textDecoration: 'none', transition: 'color 0.2s',
                      textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--bone)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(250,248,243,0.75)'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row: brand + legal */}
        <div style={{
          paddingTop: 28, borderTop: '1px solid rgba(250,248,243,0.22)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src="/carelu-logo.svg"
              alt="Carelu"
              style={{
                height: 24, width: 'auto', display: 'block',
                filter: 'brightness(0) invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.2))',
              }}
            />
            <span style={{
              width: 1, height: 18, background: 'rgba(250,248,243,0.32)', display: 'inline-block',
            }} />
            <span style={{
              fontSize: 11, color: 'rgba(250,248,243,0.7)',
              fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase',
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
            }}>
              Powered by
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <img
                src="/leadtrap-mark.svg"
                alt=""
                style={{
                  height: 18, width: 18, display: 'block', borderRadius: '50%',
                  filter: 'invert(1) drop-shadow(0 1px 6px rgba(0,0,0,0.2))',
                }}
              />
              <span style={{
                fontSize: 11.5, fontWeight: 700, color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.2)', letterSpacing: '-0.01em',
              }}>
                LeadTrap
              </span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Privacy Policy</a>
            <a href="/terms" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Terms</a>
            <a href="https://trust.carelu.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>Security</a>
            <span style={{ fontSize: 12, color: 'rgba(250,248,243,0.7)', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}>HIPAA · SOC 2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


// ── MURAL REVEAL — stacked plates illustration (SVG, no images) ──
function MuralReveal() {
  // Workflow ordered bottom-to-top. All labels sit on the LEFT, stack pushed to the right.
  type Side = 'left' | 'right';
  const plates: { title: string; isTop?: boolean; side: Side }[] = [
    { title: 'This Is What We Do', isTop: true, side: 'left' }, // [0] top — umbrella
    { title: 'Follow-up',          side: 'left' },              // [1]
    { title: 'Scheduling',         side: 'left' },              // [2]
    { title: 'Diagnosis',          side: 'left' },              // [3]
    { title: 'Consent forms',      side: 'left' },              // [4]
    { title: 'Insurance card',     side: 'left' },              // [5]
    { title: 'Eligibility',        side: 'left' },              // [6] first step
  ];
  const PLATE_COUNT = plates.length;

  // Defined before the geometry so mobile can use a tighter coordinate space.
  const isMobile = useIsMobile();

  // ===== STACK GEOMETRY =====
  // Mobile uses a narrower SVG canvas (less empty margin in the viewBox), so
  // the same plates render ~35% larger on a phone without touching desktop.
  const RX = isMobile ? 158 : 170;
  const RY = 48;
  const PLATE_DEPTH = 34;
  const PLATE_GAP_CLOSED = 0;     // closed → all plates collapsed under the top one
  const PLATE_GAP_OPEN = 64;      // fully open → roomy stack
  const TOP_CY = 56;
  const STROKE = 'rgba(140,140,160,0.55)';
  // =========================

  const PLATE_CX = isMobile ? 396 : 580;
  const LEFT_LABEL_X = isMobile ? 200 : 250;   // where the connector line starts
  const LABEL_LEFT_ANCHOR_X = isMobile ? 4 : 30; // left edge of label column
  const RIGHT_LABEL_X = PLATE_CX + RX + 60;

  const SVG_W = isMobile ? 560 : 760;
  // SVG height sized for the fully-open state (stable layout, no jumping)
  const SVG_H = TOP_CY + (PLATE_COUNT - 1) * PLATE_GAP_OPEN + PLATE_DEPTH + RY + 30;

  // ── Scroll-tied progress (0 = closed, 1 = fully open) ──
  // Ref on the scroll-tracker div (not the outer section) so we can add a cream buffer
  // BELOW the tracker before the next section appears.
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let rafId = 0;
    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = sec.offsetHeight - vh;
      if (total <= 0) { setProgress(0); return; }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Scroll deadzone: stack stays closed until the user has scrolled past START_THRESHOLD.
  // Below the threshold → animProgress = 0 → only "This Is What We Do" label is visible.
  // Mobile gets a much shorter runway — long dead-scroll feels broken on a phone.
  const START_THRESHOLD = isMobile ? 0.1 : 0.2;
  const END_THRESHOLD = isMobile ? 0.82 : 0.88;
  const animProgress = Math.max(0, Math.min(1, (progress - START_THRESHOLD) / (END_THRESHOLD - START_THRESHOLD)));

  // Start CLOSED (only top plate + "This Is What We Do" visible),
  // OPEN as the user scrolls — layers + labels progressively reveal one by one.
  // ease-out cubic for a soft "settle" feel
  const eased = 1 - Math.pow(1 - animProgress, 3);
  const PLATE_GAP = PLATE_GAP_CLOSED + (PLATE_GAP_OPEN - PLATE_GAP_CLOSED) * eased;

  // Label/connector opacity — top label is always visible; others start hidden
  // and FADE IN sequentially as their plate emerges from underneath.
  const labelOpacity = (i: number) => {
    if (i === 0) return 1;
    // each non-top label appears as its plate emerges (top-down: closest to top first)
    const step = 1 / PLATE_COUNT;
    const start = (i - 1) * step * 0.9;
    const end = start + step * 0.9;
    return Math.max(0, Math.min(1, (animProgress - start) / (end - start)));
  };

  return (
    <section id="platform" style={{
      position: 'relative', background: 'var(--bone)',
    }}>
      <div ref={sectionRef} style={{
        // Scroll tracker — sticky inner lives here. Animation progress is tied to this height.
        // Kept tight so almost all the scroll drives the reveal (little dead space).
        height: isMobile ? '150svh' : '165vh', position: 'relative',
      }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 24, paddingBottom: 24,
        overflow: 'hidden',
      }}>
      <div style={W}>
        {/* Section heading — compact so the stacked-plates diagram has room to open */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 28px', padding: '0 24px' }}>
          <div className="rv"><Pill>Introducing Carelu</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400,
            color: 'var(--green-900)',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: '8px 0 14px',
          }}>
            One platform. Every channel.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, whiteSpace: 'nowrap' }}>Always on.</span>
          </h2>
          <p className="rv d2" style={{
            fontSize: 15, color: 'var(--gray-500)',
            lineHeight: 1.55, maxWidth: 520, margin: '0 auto',
          }}>
            The care enablement platform that makes sure every family who can receive care does &mdash; not another system of record.
          </p>
        </div>

        {/* The stacked-plates diagram — narrower max-width for a more compact size */}
        <div className="layers-diagram rv-scale d3" style={{
          position: 'relative',
          width: '100%', maxWidth: 620,
          margin: '0 auto',
          aspectRatio: `${SVG_W} / ${SVG_H}`,
        }}>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <defs>
              {/* Warm turquoise gradient for the top plate */}
              <linearGradient id="topFace" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%"   stopColor="#BFE0AE" />
                <stop offset="100%" stopColor="#DCEDC4" />
              </linearGradient>
              {/* Diagonal criss-cross grid for the top plate */}
              <pattern id="topGrid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="0.6" />
              </pattern>
              <radialGradient id="gridFade" cx="50%" cy="50%" r="55%">
                <stop offset="0%"   stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.35" />
              </radialGradient>
              <mask id="topGridMask">
                <ellipse cx={PLATE_CX} cy={TOP_CY} rx={RX * 0.96} ry={RY * 0.96} fill="url(#gridFade)" />
              </mask>
              {/* Elegant fade for the connector lines — starts soft near the label, lands solid at the plate */}
              <linearGradient id="connectorFade" gradientUnits="userSpaceOnUse"
                x1={LEFT_LABEL_X} y1="0" x2={PLATE_CX - RX} y2="0">
                <stop offset="0"    stopColor="#1A2E1F" stopOpacity="0.05" />
                <stop offset="0.35" stopColor="#1A2E1F" stopOpacity="0.32" />
                <stop offset="1"    stopColor="#1A2E1F" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {/* Render plates BACK-TO-FRONT (bottom of stack first, top last) so upper plates
                occlude the ones below. Side bands are filled opaquely → real stacked-plate look. */}
            {plates.slice().reverse().map((plate, reverseIdx) => {
              const i = PLATE_COUNT - 1 - reverseIdx;
              const topCy = TOP_CY + i * PLATE_GAP;
              return (
                <g key={i}>
                  {/* Side band — filled OPAQUE; the stroke traces the visible edges. */}
                  <path
                    d={`M ${PLATE_CX - RX},${topCy}
                        a ${RX},${RY} 0 0 0 ${RX * 2},0
                        v ${PLATE_DEPTH}
                        a ${RX},${RY} 0 0 1 ${-RX * 2},0
                        z`}
                    fill={plate.isTop ? 'rgba(191,224,174,0.6)' : 'var(--bone)'}
                    stroke={STROKE} strokeWidth="1"
                  />
                  {/* The full top face — only for the topmost plate. */}
                  {plate.isTop && (
                    <>
                      <ellipse cx={PLATE_CX} cy={topCy} rx={RX} ry={RY}
                        fill="url(#topFace)" stroke={STROKE} strokeWidth="1" />
                      <rect x={PLATE_CX - RX} y={topCy - RY} width={RX * 2} height={RY * 2}
                        fill="url(#topGrid)" mask="url(#topGridMask)" />
                    </>
                  )}
                </g>
              );
            })}

            {/* Connector lines — left or right based on label side */}
            {plates.map((plate, i) => {
              const topCy = TOP_CY + i * PLATE_GAP;
              // For occluded plates (1..6) anchor the dot on the visible portion of the side rim.
              const overlap = Math.max(0, PLATE_DEPTH - PLATE_GAP);
              const visibleTopY = i === 0 ? topCy : topCy + overlap;
              const dotY = (visibleTopY + topCy + PLATE_DEPTH) / 2;
              const isLeft = plate.side === 'left';
              const plateEdgeX = isLeft ? PLATE_CX - RX - 4 : PLATE_CX + RX + 4;
              const labelEdgeX = isLeft ? LEFT_LABEL_X + 6 : RIGHT_LABEL_X - 6;
              return (
                <g key={`conn-${i}`} style={{ opacity: labelOpacity(i), transition: 'opacity 0.3s ease' }}>
                  <line
                    x1={labelEdgeX} y1={dotY}
                    x2={plateEdgeX} y2={dotY}
                    stroke="url(#connectorFade)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  />
                  <circle cx={plateEdgeX} cy={dotY} r="2.6" fill="var(--green-900)" />
                </g>
              );
            })}
          </svg>

          {/* Labels overlaid — all left-aligned, each preceded by a lime checkmark circle */}
          {plates.map((plate, i) => {
            const topCy = TOP_CY + i * PLATE_GAP;
            const overlap = Math.max(0, PLATE_DEPTH - PLATE_GAP);
            const visibleTopY = i === 0 ? topCy : topCy + overlap;
            const dotY = (visibleTopY + topCy + PLATE_DEPTH) / 2;
            const topPct = (dotY / SVG_H) * 100;
            const leftPct = (LABEL_LEFT_ANCHOR_X / SVG_W) * 100;

            return (
              <div key={i} className="mural-label" style={{
                position: 'absolute',
                top: `${topPct}%`,
                left: `${leftPct}%`,
                transform: 'translateY(-50%)',
                display: 'inline-flex',

                alignItems: 'center',
                gap: 10,
                fontSize: plate.isTop ? 15 : 13.5,
                fontWeight: plate.isTop ? 500 : 400,
                color: 'var(--green-900)',
                letterSpacing: '-0.005em',
                whiteSpace: 'nowrap',
                opacity: labelOpacity(i),
                transition: 'opacity 0.3s ease',
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--lime)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="var(--green-900)" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {plate.title}
              </div>
            );
          })}
        </div>
      </div>
      </div>
      </div>
    </section>
  );
}

// ── PAGE ─────────────────────────────────────────


// ── PAGE ─────────────────────────────────────────
export default function Landing() {
  useReveal();
  // Scroll to the section hash when arriving via a client-side navigation
  // (e.g. Product in the nav from /solutions/* → /carelu#platform).
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView());
  }, []);
  return (
    <div style={{ background: '#FAF8F3', color: '#2B2A26', minHeight: '100vh' }}>
      {/* Top sections kept from main */}
      <DemoModalHost />
      <Nav />
      <Hero />
      <DemoVideo />
      <Problem />

      {/* Session-work sections below — wrapped in .session-light to restore
          the cream/dark-green palette that these components expect. */}
      <div className="session-light">
        <MuralReveal />
        <Impact />
        <HowCarelu />
        <Outcomes />
        <CustomerStories />
        <GettingStarted />
        <Compliance />
        <Faq />
        <CtaFooter />
      </div>

      {/*
        ── ARCHIVED ──
        The original "chaos tabs" Problem animation lives in:
        src/components/_archive/ChaosTabsAnimation.tsx
        Import { ChaosTabsAnimation } and render here if you want it back.
      */}
    </div>
  );
}
