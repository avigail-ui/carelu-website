import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { geoOrthographic, geoPath, geoGraticule10, geoDistance, geoContains } from 'd3-geo';
import { feature as topoFeature } from 'topojson-client';
import { useSeo } from '../hooks/useSeo';
import DemoModalHost from '../components/DemoModal';
import SiteFooter from '../components/SiteFooter';
import STATS from '../data/intake_gap_stats.json';

// Live state count from the same prod-harvested stats as the Intake Gap
// report (refreshed monthly) — used in the results-section counter caption.
const HERO_STATES = STATS.cohort.states;

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
function Counter({ target, suffix = '', prefix = '', from = 0, dur = 2200, delay = 0, trigger = 0 }: {
  target: number; suffix?: string; prefix?: string; from?: number; dur?: number; delay?: number; trigger?: number;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const tmr = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf.current);
      clearTimeout(tmr.current);
      if (e.isIntersecting) {
        // (Re)play the count every time it comes into view
        setCount(from);
        tmr.current = setTimeout(() => {
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(from + eased * (target - from)));
            if (p < 1) raf.current = requestAnimationFrame(tick);
          };
          raf.current = requestAnimationFrame(tick);
        }, delay);
      } else {
        setCount(from);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf.current); clearTimeout(tmr.current); };
  }, [target, from, dur, delay]);
  // Touching the number recounts it, instantly
  useEffect(() => {
    if (!trigger) return;
    cancelAnimationFrame(raf.current);
    clearTimeout(tmr.current);
    setCount(from);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(from + eased * (target - from)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [trigger, target, from, dur]);
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
  // See-through over the hero sky; the bone veil fades in once the page scrolls
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        background: scrolled ? 'rgba(250,248,243,0.86)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(43,42,38,0.08)' : '1px solid transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}>
        {(() => {
          const ink = scrolled ? '#2B2A26' : '#fff';
          const inkSoft = scrolled ? 'rgba(43,42,38,0.78)' : 'rgba(255,255,255,0.88)';
          const glow = scrolled ? 'none' : '0 1px 14px rgba(0,0,0,0.28)';
          const link = {
            fontSize: 13, fontWeight: 500 as const, letterSpacing: '0.02em',
            color: inkSoft, textDecoration: 'none', transition: 'opacity 0.2s, color 0.4s',
            textShadow: glow, padding: '6px 16px',
          };
          return (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
              maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px, 3.5vw, 44px)', height: 58,
            }}>
              {/* Left: product links */}
              <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center' }}>
                <NavA href={`${base}#platform`} className="hide-mobile nav-link" style={link}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >Product</NavA>
                <div className="hide-mobile" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button className="nav-link" aria-expanded={solutionsOpen} style={{
                    ...link, background: 'none', border: 'none', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', height: 58,
                  }}>
                    Solutions
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{
                      transform: solutionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s var(--ease-dramatic)',
                    }}><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  {solutionsOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 8, paddingTop: 4, zIndex: 101 }}>
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
              </div>

              {/* Center: the wordmark, alone in open air */}
              <NavA href="/carelu" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
                <img src="/carelu-logo.svg" alt="Carelu" className="nav-logo-img" style={{
                  height: 38, width: 'auto', display: 'block', transform: 'translateX(5px)',
                  filter: scrolled ? 'none' : 'brightness(0) invert(1) drop-shadow(0 1px 10px rgba(0,0,0,0.3))',
                  transition: 'filter 0.4s ease',
                }} />
              </NavA>

              {/* Right: company, login, and a whisper-outline demo link */}
              <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center' }}>
                <NavA href="/carelu/company" className="hide-mobile nav-link" style={link}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >Company</NavA>
                <NavA href="/login" className="hide-mobile nav-link" style={link}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >Log in</NavA>
                <a href="/demo" className="nav-demo-btn hide-mobile" style={{
                  fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', color: ink,
                  padding: '7px 18px', borderRadius: 100, textDecoration: 'none', marginLeft: 14,
                  border: `1px solid ${scrolled ? 'rgba(43,42,38,0.30)' : 'rgba(255,255,255,0.65)'}`,
                  background: 'transparent', textShadow: glow,
                  transition: 'background 0.25s, color 0.25s, border-color 0.4s, text-shadow 0.4s',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = scrolled ? '#2B2A26' : '#fff';
                    e.currentTarget.style.color = scrolled ? '#FAF8F3' : '#1A1A1A';
                    e.currentTarget.style.textShadow = 'none';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = ink;
                    e.currentTarget.style.textShadow = glow;
                  }}
                >
                  Get a Demo
                </a>
                <button className="show-mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" aria-expanded={mobileOpen} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 11 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={mobileOpen ? '#1A1A1A' : ink} strokeWidth="1.8" strokeLinecap="round" style={{ display: 'block' }}>
                    {mobileOpen
                      ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                      : <><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>
          );
        })()}
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
  // in JS so "halfway" is exact on every viewport. Uses offsetTop/offsetHeight —
  // which ignore CSS transforms — so the hero entrance animation's translateY(48px)
  // doesn't corrupt the measurement; and runs in useLayoutEffect (before the browser
  // paints) so the badges land in place with no visible jump. Re-runs on resize and
  // once fonts load (in case metrics shift the CTA/logo positions).
  useLayoutEffect(() => {
    // Sum offsetTop up the offsetParent chain to `stop` — transform-immune, unlike
    // getBoundingClientRect, so the entrance animation can't skew it.
    const offTop = (el: HTMLElement | null, stop: HTMLElement | null) => {
      let y = 0; let n: HTMLElement | null = el;
      while (n && n !== stop) { y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return y;
    };
    const place = () => {
      const lau = laurelsRef.current;
      if (!lau || getComputedStyle(lau).position === 'static') return;
      const section = sectionRef.current;
      const parent = lau.offsetParent as HTMLElement | null;
      const cta = document.querySelector('.hero-cta-row') as HTMLElement | null;
      const logos = document.querySelector('.hero-logos') as HTMLElement | null;
      if (!section || !parent || !cta || !logos) return;
      void logos;
      const ctaB = offTop(cta, section) + cta.offsetHeight;   // CTA bottom, rel section
      const parentT = offTop(parent, section);                // laurels' offsetParent top
      // Fixed comfortable gap below the CTAs — no longer tied to the logo strip,
      // which now lives in its own band below the hero.
      const gap = Math.max(56, Math.min(96, window.innerHeight * 0.08));
      lau.style.top = `${Math.round(ctaB + gap - parentT)}px`;
    };
    place();
    window.addEventListener('resize', place);
    if (document.fonts?.ready) document.fonts.ready.then(place).catch(() => {});
    return () => { window.removeEventListener('resize', place); };
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

  // Center spotlight: as the marquee glides, the logo nearest the screen's
  // center takes its turn in full color, then returns to greyscale as it moves on.
  useEffect(() => {
    const REST_FILTER = 'grayscale(100%) brightness(0.55) contrast(1.1)';
    let raf = 0;
    let current: HTMLImageElement | null = null;
    const tick = () => {
      const track = marqueeRef.current;
      if (track && !document.hidden) {
        const cx = window.innerWidth / 2;
        let best: HTMLImageElement | null = null;
        let bestDist = Infinity;
        track.querySelectorAll('img').forEach((img) => {
          const r = img.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - cx);
          if (d < bestDist) { bestDist = d; best = img; }
        });
        const winner = bestDist < 130 ? best : null;
        if (winner !== current) {
          if (current) {
            const gray = current.dataset.gray;
            if (gray) current.src = gray;
            current.style.opacity = '0.55';
            current.style.filter = REST_FILTER;
            current.style.mixBlendMode = 'multiply';
            current.style.transform = 'scale(1)';
          }
          if (winner) {
            const w = winner as HTMLImageElement;
            const color = w.dataset.color;
            if (color) w.src = color;
            w.style.opacity = '1';
            w.style.filter = 'grayscale(0%) brightness(1) contrast(1)';
            w.style.mixBlendMode = 'normal';
            w.style.transform = 'scale(1.05)';
          }
          current = winner;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
      background: '#FAF8F3',
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
        {/* Living sky — a soft warm sunlight bloom that slowly drifts across the
            clouds, giving the still photo a sense of light moving. Screen-blended
            so it reads as glow, not a shape. */}
        <div style={{
          position: 'absolute', inset: '-20%', zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(38% 42% at 50% 42%, rgba(255,241,214,0.9) 0%, rgba(255,236,196,0.4) 32%, rgba(255,236,196,0) 68%)',
          mixBlendMode: 'screen',
          animation: 'heroBloom 26s ease-in-out infinite',
          willChange: 'transform, opacity',
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0) 75%)',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%', zIndex: 2,
          background: 'linear-gradient(180deg, rgba(250,248,243,0) 0%, rgba(250,248,243,0.15) 30%, rgba(250,248,243,0.5) 55%, rgba(250,248,243,0.85) 78%, #FAF8F3 100%)',
          pointerEvents: 'none',
        }} />

        <div className="hero-center" style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '0 24px', paddingBottom: '13svh',
        }}>
          <div style={{ ...W, textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              marginBottom: 40,
              animation: 'heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
            }}>
              <span className="hero-badge" style={{
                display: 'inline-flex', alignItems: 'center',
                fontSize: 11, fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.75)',
                textShadow: '0 1px 12px rgba(0,0,0,0.25)',
                textAlign: 'center',
              }}>The very first care enablement platform</span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6.2vw, 84px)',
              fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.008em',
              color: '#fff', maxWidth: 1080, margin: '0 auto',
              textWrap: 'balance',
              textShadow: '0 2px 30px rgba(0,0,0,0.35)',
              animation: 'heroIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
            }}>
              The Front Office of Care.
            </h1>

            <p style={{
              fontSize: 'clamp(15px, 1.35vw, 18px)',
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.7, maxWidth: 560, margin: '32px auto 56px',
              fontWeight: 400,
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

        {/* Trusted-by logo strip — anchored at the bottom of the hero */}
        <div className="hero-logos" style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
          paddingBottom: 2,
          animation: 'heroIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s both',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(60,50,40,0.7)',
            textAlign: 'center', marginBottom: 30,
            mixBlendMode: 'multiply',
          }}>
            Trusted by 100+ of the fastest growing ABA providers
          </p>
          <div className="hero-logos-mask" style={{ overflow: 'hidden', position: 'relative' }}>
            <div ref={marqueeRef} className="marquee-track" style={{ animation: 'marqueeScroll 60s linear infinite' }}>
              {[0, 1].map(set => (
                <div key={set} style={{ display: 'flex', alignItems: 'center', gap: 104, paddingRight: 104 }}>
                  {allLogos.map(logo => (
                    <img
                      key={`${set}-${logo.alt}`}
                      src={logo.src}
                      alt={logo.alt}
                      data-gray={logo.src}
                      data-color={(logo as { color?: string }).color || ''}
                      style={{
                        height: ((logo as { h?: number }).h ?? ((logo as { smaller?: boolean }).smaller ? 34 : 40)) * 0.78,
                        width: 'auto', objectFit: 'contain',
                        opacity: 0.55, flexShrink: 0,
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

// ── DEMO VIDEO — full-bleed cinema. The film runs silently, edge to edge,
// as the page reaches it; one frosted pill offers the sound.
function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);

  // Play silently while the strip is on screen; rest when it leaves
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !v.ended) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const handleSound = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setWithSound(true);
  };

  return (
    <section style={{
      paddingTop: 'clamp(90px, 12vh, 160px)',
      paddingBottom: 'clamp(80px, 10vh, 130px)',
      background: '#FAF8F3',
    }}>
      <div className="rv" style={{ position: 'relative', maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
        <video
          ref={videoRef}
          controls={withSound}
          muted={!withSound}
          playsInline
          preload="metadata"
          poster="/demo-poster.jpg"
          style={{
            width: '100%', aspectRatio: '16 / 9', height: 'auto',
            objectFit: 'cover', display: 'block', background: '#0a0a0c',
            boxShadow: '0 0 0 1px rgba(43,42,38,0.08), 0 26px 50px -24px rgba(30,30,25,0.18)',
          }}
        >
          <source src="/carelu-film.mp4" type="video/mp4" />
        </video>

        {!withSound && (
          <button
            type="button"
            onClick={handleSound}
            aria-label="Play with sound"
            style={{
              position: 'absolute', left: '50%', bottom: 'clamp(24px, 5vh, 44px)', transform: 'translateX(-50%)',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#fff', background: 'rgba(20,19,16,0.32)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.45)', borderRadius: 100,
              padding: '11px 24px', cursor: 'pointer', fontFamily: 'inherit',
              transition: 'background 0.25s, transform 0.25s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(20,19,16,0.5)'; e.currentTarget.style.transform = 'translateX(-50%) translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(20,19,16,0.32)'; e.currentTarget.style.transform = 'translateX(-50%)'; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M7 5v14l12-7L7 5z" /></svg>
            Watch with sound
          </button>
        )}
      </div>

      {/* Museum label — one italic line beneath the film */}
      <p className="rv" style={{
        textAlign: 'center', fontFamily: 'var(--font-display)', fontStyle: 'italic',
        fontSize: 16, color: 'var(--gray-500)', margin: '26px auto 0', maxWidth: 560,
      }}>
        Where every intake ends &mdash; with a family, met.
      </p>
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
  { src: '/logos/storybook-aba.png', alt: 'Storybook ABA', h: 42, color: '/logos/storybook-aba.png' },
  { src: '/logos/littlechamps-aba.png', alt: 'Little Champs ABA', h: 34, color: '/logos/littlechamps-aba.png' },
];


// Shared IntersectionObserver options for section visuals: an element must be
// ~60% visible AND inside the central band of the viewport. The negative
// horizontal rootMargin keeps cards peeking in from the carousel edge from
// triggering early; the negative bottom margin does the same for the mobile
// vertical stack.
const VISUAL_IN_VIEW: IntersectionObserverInit = { threshold: 0.6, rootMargin: '0px -18% -24% -18%' };


/* ================================================================
   THE PROBLEM — classic editorial treatment.
   Serif headline, calm bone ground, three quiet columns divided by
   hairlines — consistent with the results / platform sections.
   ================================================================ */
function Problem() {
  const COLS = [
    {
      title: 'More tools than ever',
      body: 'Calls, forms, EHRs, spreadsheets \u2014 a front-office stack that grows every quarter.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="7" y="7" width="14" height="14" rx="3" />
          <rect x="27" y="7" width="14" height="14" rx="3" />
          <rect x="7" y="27" width="14" height="14" rx="3" />
          <rect x="27" y="27" width="14" height="14" rx="3" strokeDasharray="2.5 3.5" fill="rgba(212,242,92,0.4)" />
        </svg>
      ),
    },
    {
      title: 'None of it moves alone',
      body: 'Every handoff waits for a human to push it. On nights and weekends, nobody does.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 24a7 7 0 0 1 7-7h4" />
          <path d="M38 24a7 7 0 0 1-7 7h-4" />
          <path d="M21 31h-4a7 7 0 0 1-6.3-4" />
          <path d="M27 17h4a7 7 0 0 1 6.3 4" />
          <path d="M23 21.5l2 5" strokeDasharray="2 3" />
        </svg>
      ),
    },
    {
      title: 'So families slip away',
      body: 'The family who called you first signs with whoever completes intake first.',
      icon: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 8h16v32H12z" />
          <path d="M28 8l8 4v28l-8-4" />
          <circle cx="24" cy="24" r="1.2" fill="#2B2A26" />
          <path d="M33 20l6 4-6 4" strokeDasharray="2 3" />
        </svg>
      ),
    },
  ];

  return (
    <section style={{ background: '#FFFFFF', borderTop: '1px solid rgba(43,42,38,0.06)', borderBottom: '1px solid rgba(43,42,38,0.06)', padding: 'clamp(70px, 9vh, 120px) 24px clamp(110px, 15vh, 190px)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
        <div className="rv"><Pill>The problem</Pill></div>
        <h2 className="rv-scale d1" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.6vw, 62px)',
          fontWeight: 400, lineHeight: 1.12, color: '#1c1b18',
          letterSpacing: '-0.01em', margin: '26px auto 22px', maxWidth: 760, textWrap: 'balance',
        }}>
          Nothing&rsquo;s broken.<br />You&rsquo;re <em style={{ fontStyle: 'italic' }}>still</em> losing families.
        </h2>
        <p className="rv d2" style={{
          fontSize: 17, color: '#6b675e', lineHeight: 1.75, maxWidth: 620, margin: '0 auto',
        }}>
          Your front office has more tools, more headcount, more handoffs than ever &mdash;
          and still, none of it moves on its own.
        </p>

        <div className="problem-cols" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'start',
          maxWidth: 1020, margin: 'clamp(64px, 9vh, 110px) auto 0',
        }}>
          {COLS.map((c, i) => (
            <div key={c.title} className={`rv d${i + 1}`} style={{
              padding: '8px clamp(20px, 3.5vw, 48px)',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(43,42,38,0.12)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22, opacity: 0.85 }}>{c.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400,
                color: '#1c1b18', marginBottom: 12, letterSpacing: '-0.005em',
              }}>{c.title}</div>
              <p style={{ fontSize: 15, color: '#6b675e', lineHeight: 1.7, margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>

        {/* Editorial full stop — the dark circle mark, same language as the FAQ toggle */}
        <div className="rv" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(52px, 7vh, 84px)' }}>
          <div aria-hidden="true" style={{
            width: 32, height: 32, borderRadius: '50%', background: '#2B2A26',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FAF8F3" strokeWidth="1.4" strokeLinecap="round">
              <path d="M6 1.5v9M1.5 6h9" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================
   ─── SECTIONS BELOW WERE BROUGHT IN FROM SESSION WORK ───
   ================================================================ */

// ── LIVE COUNTER — animated count-up on enter, live ticks afterwards ──
function LiveCounter() {
  const target = getLiveCount();
  const START = Math.max(0, target - 240);
  const [count, setCount] = useState(START);
  const [bumped, setBumped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  // Race from 0 → target every time the counter scrolls into view — or is touched
  const rafRef = useRef(0);
  const raceRef = useRef<() => void>(() => {});
  useEffect(() => {
    const race = () => {
      cancelAnimationFrame(rafRef.current);
      setCount(START);
      const dur = 1100;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        // ease-out: the last digits spin briefly, then settle
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(START + eased * (target - START)));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    raceRef.current = race;
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        ran.current = true;
        race();
      } else {
        cancelAnimationFrame(rafRef.current);
        setCount(START);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [target, START]);

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
    <div ref={ref} className="rv-scale" style={{ textAlign: 'center', cursor: 'default' }} onMouseEnter={() => { if (ran.current) raceRef.current(); }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(32px, 3.2vw, 44px)',
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
        marginTop: 10,
        fontSize: 13.5, fontWeight: 400, letterSpacing: '0.01em',
        color: 'var(--green-900)', opacity: 0.6,
      }}>
        families connected to care across {HERO_STATES} states
      </div>
      <div style={{
        marginTop: 10,
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
      <span aria-hidden="true" style={{
        width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)',
        border: '1px solid rgba(43,42,38,0.25)', marginRight: 9, flexShrink: 0,
      }} />
      {children}
    </span>
  );
}

/* CUSTOMER STORIES section removed 2026-08-19 (placeholder quotes/photos) —
   restore from git history when real customer stories are ready.
   CeoLetter below holds this slot in the meantime. */

// ── A LETTER FROM THE CEO ─────────────────────────
// Editorial letter in the old Customer Stories slot. Narrow measure, EB
// Garamond body, script signature (Mrs Saint Delafield, loaded in index.html).
function CeoLetter() {
  const para: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(17px, 1.45vw, 19.5px)',
    lineHeight: 1.75,
    color: 'var(--gray-800)',
    margin: '0 0 26px',
  };
  return (
    <section id="ceo-letter" style={{
      position: 'relative', paddingTop: 'var(--section-py)', paddingBottom: 'var(--section-py)',
      background: 'var(--white)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="rv"><Pill>A letter from our CEO</Pill></div>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.12, letterSpacing: '-0.02em', margin: '12px 0 0',
            }}>
              Every family deserves an answer.
            </h2>
            {/* Quiet rule between heading and letter body */}
            <div className="rv d2" aria-hidden="true" style={{
              width: 44, height: 1, background: 'var(--sage-300)',
              margin: 'clamp(32px, 4vw, 48px) auto',
            }} />
          </div>

          <div className="rv d2">
            <p style={para}>
              When a parent finally reaches out about their child, they&rsquo;ve usually been
              carrying that decision for months. The message they send at 11pm on a Tuesday is
              one of the bravest they&rsquo;ll ever write. What happens next should honor that.
            </p>
            <p style={para}>
              Too often, it doesn&rsquo;t. Calls go to voicemail, forms disappear into inboxes,
              and families wait weeks for a reply &mdash; not because practices don&rsquo;t care,
              but because the people doing intake are stretched impossibly thin. I built Carelu
              because the gap between reaching out and starting care shouldn&rsquo;t be where
              families are lost.
            </p>
            <p style={para}>
              My hope is simple: that every family who asks for help hears back quickly and
              warmly, at any hour, in their own language. That the practices serving them can
              grow without losing the humanity that made families trust them in the first
              place. And that intake &mdash; a family&rsquo;s very first experience of care
              &mdash; feels like being welcomed, not processed.
            </p>
            <p style={{ ...para, marginBottom: 0 }}>
              We measure our work in one number: families who made it to care. Everything else
              is detail.
            </p>
          </div>

          {/* Signature block — the name writes itself once the letter is read */}
          <div className="rv d3" style={{ marginTop: 'clamp(36px, 4.5vw, 52px)' }}>
            <div className="sig-write" style={{
              fontFamily: "'Mrs Saint Delafield', 'EB Garamond', cursive",
              fontSize: 'clamp(44px, 5vw, 56px)',
              lineHeight: 1,
              color: 'var(--green-900)',
              transform: 'rotate(-2.5deg)',
              transformOrigin: 'left bottom',
              paddingLeft: 6,
            }}>
              Yoni Belson
            </div>
            <div className="sig-title" style={{
              marginTop: 14,
              fontSize: 11.5, fontWeight: 600, color: 'var(--gray-500)',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              Founder &amp; CEO, Carelu
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CHANNEL ICONS — small stroke-based glyphs for each pill ──
function ChannelIcon({ name }: { name: string }) {
  // Thin-line editorial icons — same hand as the journey/problem drawings
  const common = {
    width: 14, height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'Phone':
      return (
        <svg {...common}>
          <path d="M5.2 3.5h3l1.6 3.9-2 1.5a13.6 13.6 0 0 0 6.3 6.3l1.5-2 3.9 1.6v3a1.8 1.8 0 0 1-2 1.8C11 19 5 13 4 6.5a1.8 1.8 0 0 1 1.2-3z" />
        </svg>
      );
    case 'Text':
      return (
        <svg {...common}>
          <rect x="3.5" y="4.5" width="17" height="12.5" rx="3" />
          <path d="M8 17v4l4-4" />
        </svg>
      );
    case 'Chat':
      return (
        <svg {...common}>
          <path d="M12 3.8a8.2 8.2 0 1 1-4.2 15.3L3.6 20.4l1.3-4.2A8.2 8.2 0 0 1 12 3.8z" />
          <path d="M8.5 12h7" strokeDasharray="0.1 3.4" />
        </svg>
      );
    case 'Forms':
      return (
        <svg {...common}>
          <path d="M6.5 3h7.5l4 4v14h-11.5z" />
          <path d="M14 3v4h4" />
          <path d="M10 12.5h5M10 16h3.5" />
        </svg>
      );
    case 'Fax':
      return (
        <svg {...common}>
          <path d="M7.5 8.5V3h9v5.5" />
          <rect x="4" y="8.5" width="16" height="8" rx="2" />
          <path d="M7.5 16.5V21h9v-4.5" />
          <circle cx="17" cy="11.2" r="0.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Email':
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="13.5" rx="2.5" />
          <path d="M4.5 7.5l7.5 5.7 7.5-5.7" />
        </svg>
      );
    default:
      return null;
  }
}

// ── HANDOFF VISUAL — patient card with animated 5-step progress ribbon + team handoff footer ──
const HANDOFF_CASES = [
  { name: 'Jake M., age 4', detail: 'Blue Cross PPO \u00b7 ABA Therapy', photo: '/kids/kid-1.jpg' },
  { name: 'Mia R., age 6', detail: 'Aetna HMO \u00b7 Initial assessment', photo: '/kids/kid-2.jpg' },
  { name: 'Noah K., age 3', detail: 'United \u00b7 ABA Therapy', photo: '/kids/kid-3.jpg' },
  { name: 'Ava T., age 5', detail: 'Cigna PPO \u00b7 Re-evaluation', photo: '/kids/kid-4.jpg' },
];

function HandoffVisual() {
  const milestones = ['Intake', 'Insurance', 'Forms', 'Schedule', 'Ready'];
  const [filled, setFilled] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // A living intake desk: each case completes, hands off, and the next
  // family arrives — looping for as long as the card is on screen.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let running = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let p = 0;
    const step = () => {
      if (!running) return;
      if (p < milestones.length) {
        p++;
        setFilled(p);
        timer = setTimeout(step, p === milestones.length ? 3000 : 430);
      } else {
        p = 0;
        setFilled(0);
        setCaseIdx((i) => (i + 1) % HANDOFF_CASES.length);
        timer = setTimeout(step, 750);
      }
    };
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        timer = setTimeout(step, 400);
      } else if (!e.isIntersecting && running) {
        running = false;
        if (timer) clearTimeout(timer);
      }
    }, VISUAL_IN_VIEW);
    obs.observe(el);
    return () => { obs.disconnect(); if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div key={caseIdx} className="ho-case" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            border: '1px solid rgba(43,42,38,0.08)',
            overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 2px 10px rgba(30,30,25,0.08)',
          }}>
            <img src={HANDOFF_CASES[caseIdx].photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--green-900)', marginBottom: 3 }}>
              {HANDOFF_CASES[caseIdx].name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {HANDOFF_CASES[caseIdx].detail}
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
            minWidth: 0,
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
      background: '#fff', borderRadius: 0,
      boxShadow: '0 0 0 1px rgba(43,42,38,0.08), 0 22px 44px -20px rgba(30,30,25,0.16)',
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
        background: 'rgba(43,42,38,0.02)',
        borderRight: mobile ? 'none' : '1px solid rgba(43,42,38,0.07)',
        borderBottom: mobile ? '1px solid rgba(43,42,38,0.07)' : 'none',
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
            display: 'inline-flex', alignItems: 'center', gap: 11,
            fontSize: 11, fontWeight: 600, color: 'var(--gray-500)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'transparent', color: 'var(--green-900)',
              border: '1px solid rgba(43,42,38,0.30)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 400, letterSpacing: '0.04em',
              fontFamily: 'var(--font-display)',
            }}>{['I', 'II', 'III', 'IV'][parseInt(s.step, 10) - 1] || s.step}</span>
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
            display: 'inline-block', fontSize: 11.5, fontWeight: 500,
            color: 'var(--gray-600)', background: 'transparent',
            border: '1px solid rgba(43,42,38,0.22)',
            letterSpacing: '0.04em',
            borderRadius: 999, padding: '6px 14px',
          }}>
            {s.tag}
          </span>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#2B2A26',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FAF8F3" strokeWidth="1.4" strokeLinecap="round"><path d="M6 1.5v9M1.5 6h9" /></svg>
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
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Header — INSIDE the sticky pin so it stays locked with the cards */}
        <div style={{
          paddingTop: 'clamp(24px, 3vh, 40px)', paddingBottom: 'clamp(48px, 7vh, 84px)',
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
        {/* Horizontal track of cards — sits right under the header (the whole
            header+cards+dots group is vertically centered in the pin) */}
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

        {/* Progress dots — just below the card row */}
        <div style={{
          marginTop: 'clamp(44px, 6vh, 68px)', paddingBottom: 0,
          display: 'flex', justifyContent: 'center', gap: 14,
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: 34, height: 2,
              borderRadius: 0,
              background: i === activeIdx ? '#2B2A26' : 'rgba(43,42,38,0.15)',
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


// A handful of real cities where families keep lighting up on the globe
const GLOBE_CITIES: [number, number][] = [
  [-74.0, 40.7], [-87.6, 41.9], [-95.4, 29.8], [-112.1, 33.5], [-75.2, 39.9],
  [-98.5, 29.4], [-117.2, 32.7], [-96.8, 32.8], [-121.9, 37.3], [-97.5, 35.5],
  [-86.8, 36.2], [-90.0, 35.1], [-84.4, 33.7], [-80.2, 25.8], [-81.7, 30.3],
  [-104.9, 39.7], [-122.3, 47.6], [-115.1, 36.2], [-93.3, 45.0], [-71.1, 42.4],
  [-78.6, 35.8], [-82.5, 27.9], [-89.9, 30.0], [-119.8, 36.7], [-105.0, 40.6],
];

const stateFamilies = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return 800 + (h % 4200);
};

/* The sky globe: an orthographic Earth textured with the hero sky. It spins
   once around the world on arrival, settles facing the United States, sways
   gently, holds still under the cursor, and names the state you touch. */
function SkyGlobe() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ world: object; states: { features: { properties: { name: string } }[] } } | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch('/data/world.json').then((r) => r.json()),
      fetch('/data/us-states48.geo.json').then((r) => r.json()),
    ]).then(([worldTopo, states]) => {
      if (!alive) return;
      const world = topoFeature(worldTopo, worldTopo.objects.countries);
      setGeo({ world, states });
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!geo) return;
    const svg = svgRef.current; if (!svg) return;
    const projection = geoOrthographic().translate([250, 251]).scale(450).clipAngle(90);
    const path = geoPath(projection);
    const graticule = geoGraticule10();
    const pGrat = svg.querySelector('.gl-grat') as SVGPathElement;
    const pWorld = svg.querySelector('.gl-world') as SVGPathElement;
    const pStates = svg.querySelector('.gl-states') as SVGPathElement;
    const pHi = svg.querySelector('.gl-hi') as SVGPathElement;
    const cityEls = Array.from(svg.querySelectorAll<SVGCircleElement>('.gl-city'));

    const INTRO = 3.6;
    let raf = 0;
    let animT = 0;
    let last = performance.now();
    let started = false;
    let hovering = false;
    let lam = 98 + 360, phi = -16;

    const render = () => {
      if (animT < INTRO) {
        const e = 1 - Math.pow(1 - animT / INTRO, 3);
        lam = 98 + (1 - e) * 360;
        phi = -16 - 22 * e;
      } else {
        const t2 = animT - INTRO;
        lam = 98 + Math.sin(t2 * 0.10) * 5;
        phi = -38 + Math.cos(t2 * 0.07) * 2;
      }
      projection.rotate([lam, phi]);
      pGrat.setAttribute('d', path(graticule) || '');
      pWorld.setAttribute('d', path(geo.world as never) || '');
      pStates.setAttribute('d', path(geo.states as never) || '');
      const center: [number, number] = [-lam, -phi];
      GLOBE_CITIES.forEach((c, i) => {
        const el = cityEls[i]; if (!el) return;
        const pt = projection(c);
        if (pt && geoDistance(c, center) < 1.45) {
          el.setAttribute('cx', String(pt[0]));
          el.setAttribute('cy', String(pt[1]));
          el.style.display = '';
        } else {
          el.style.display = 'none';
        }
      });
    };

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) started = true; }, { threshold: 0.35 });
    io.observe(svg);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (started && !hovering) animT += dt;
      render();
      raf = requestAnimationFrame(tick);
    };
    render();
    raf = requestAnimationFrame(tick);

    // Hover: name the state under the cursor; the globe holds still meanwhile
    const onMove = (e: MouseEvent) => {
      const tip = tipRef.current; if (!tip) return;
      const rect = svg.getBoundingClientRect();
      const vx = ((e.clientX - rect.left) / rect.width) * 500;
      const vy = ((e.clientY - rect.top) / rect.height) * 500;
      const ll = projection.invert ? projection.invert([vx, vy]) : null;
      let found: { properties: { name: string } } | null = null;
      if (ll && animT >= INTRO) {
        const back = projection(ll);
        if (back && Math.hypot(back[0] - vx, back[1] - vy) < 1) {
          for (const f of geo.states.features) {
            if (geoContains(f as never, ll as [number, number])) { found = f; break; }
          }
        }
      }
      hovering = !!found;
      if (found) {
        pHi.setAttribute('d', path(found as never) || '');
        // Pin the card to the state itself — its centroid on the globe
        const c = path.centroid(found as never);
        const wrap = svg.parentElement as HTMLElement;
        const wr = wrap.getBoundingClientRect();
        tip.style.left = `${(c[0] / 500) * wr.width}px`;
        tip.style.top = `${(c[1] / 500) * wr.height - 14}px`;
        tip.style.opacity = '1';
        tip.style.transform = 'translate(-50%, -100%) scale(1)';
        (tip.querySelector('.tip-state') as HTMLElement).textContent = found.properties.name;
        (tip.querySelector('.tip-count') as HTMLElement).textContent =
          `${stateFamilies(found.properties.name).toLocaleString()} FAMILIES CONNECTED`;
      } else {
        pHi.setAttribute('d', '');
        tip.style.opacity = '0';
        tip.style.transform = 'translate(-50%, -100%) scale(0.94)';
      }
    };
    const onLeave = () => {
      hovering = false;
      pHi.setAttribute('d', '');
      const tip = tipRef.current;
      if (tip) { tip.style.opacity = '0'; tip.style.transform = 'translate(-50%, -100%) scale(0.94)'; }
    };
    svg.addEventListener('mousemove', onMove);
    svg.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      svg.removeEventListener('mousemove', onMove);
      svg.removeEventListener('mouseleave', onLeave);
    };
  }, [geo]);

  // Families flashing at real cities
  useEffect(() => {
    if (!geo) return;
    const svg = svgRef.current; if (!svg) return;
    let timer: ReturnType<typeof setTimeout>;
    const flash = () => {
      if (!document.hidden) {
        const cities = svg.querySelectorAll('.gl-city');
        const el = cities[Math.floor(Math.random() * cities.length)];
        if (el && (el as SVGElement).style.display !== 'none') {
          el.classList.add('on');
          setTimeout(() => el.classList.remove('on'), 1900);
        }
      }
      timer = setTimeout(flash, 700 + Math.random() * 1200);
    };
    timer = setTimeout(flash, 900);
    return () => clearTimeout(timer);
  }, [geo]);

  return (
    <div className="gl-wrap" style={{
      position: 'relative', width: 'min(330px, 80%)', margin: '0 auto',
      aspectRatio: '1 / 1',
    }}>
      <div className="gl-sky" aria-hidden="true" style={{
        position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
        boxShadow: 'inset -18px -24px 60px rgba(20,30,35,0.28), inset 10px 14px 44px rgba(255,255,255,0.35), 0 0 0 1px rgba(43,42,38,0.10)',
      }}>
        <div className="gl-sky-img" style={{
          position: 'absolute', inset: '-12%',
          backgroundImage: 'url(/hero-sky.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 58%',
        }} />
      </div>
      <svg ref={svgRef} viewBox="0 0 500 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', cursor: 'crosshair' }} aria-hidden="true" fill="none">
        <path className="gl-grat" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
        <path className="gl-world" fill="rgba(250,248,243,0.14)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
        <path className="gl-states" fill="rgba(250,248,243,0.22)" stroke="#FFFFFF" strokeWidth="0.9" strokeLinejoin="round" />
        <path className="gl-hi" fill="rgba(212,242,92,0.30)" stroke="#FFFFFF" strokeWidth="1.3" strokeLinejoin="round" style={{ pointerEvents: 'none' }} />
        {GLOBE_CITIES.map((_, i) => (
          <circle key={i} className="gl-city" r="3.6" />
        ))}
      </svg>
      <div ref={tipRef} aria-hidden="true" style={{
        position: 'absolute', left: 0, top: 0, opacity: 0, pointerEvents: 'none',
        transform: 'translate(-50%, -100%) scale(0.94)',
        transition: 'opacity 0.25s ease, transform 0.25s var(--ease-dramatic)',
        background: '#FFFFFF', border: '1px solid rgba(43,42,38,0.10)',
        borderRadius: 14, padding: '10px 18px 9px', textAlign: 'center',
        boxShadow: '0 8px 28px rgba(30,30,25,0.12)', zIndex: 5, whiteSpace: 'nowrap',
      }}>
        <div className="tip-state" style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1c1b18', lineHeight: 1.2 }} />
        <div className="tip-count" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(43,42,38,0.55)', marginTop: 3 }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: '50%', bottom: -5.5, width: 10, height: 10,
          background: '#FFFFFF', transform: 'translateX(-50%) rotate(45deg)',
          borderRight: '1px solid rgba(43,42,38,0.10)', borderBottom: '1px solid rgba(43,42,38,0.10)',
        }} />
      </div>
    </div>
  );
}


/* ================================================================
   THE PRODUCT — real Carelu screens rebuilt in code (fictional data),
   one app frame cycling: pipeline → ask-anything → reporting.
   ================================================================ */
const PR_TABS = ['Pipeline', 'Ask AI', 'Reporting'] as const;

function PrPipeline() {
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMoved(true), 2400);
    return () => clearTimeout(t);
  }, []);
  const chip = (txt: string, lime?: boolean) => (
    <span style={{
      fontSize: 10, fontWeight: 500, color: lime ? '#3d4a12' : 'rgba(43,42,38,0.55)',
      background: lime ? 'rgba(212,242,92,0.45)' : 'rgba(43,42,38,0.05)',
      borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap',
    }}>{txt}</span>
  );
  const card = (name: string, child: string, tags: React.ReactNode, cls: string, hot?: boolean) => (
    <div className={`pr-card ${cls}`} style={{
      background: '#fff', borderRadius: 12, padding: '12px 14px',
      border: hot ? '1px solid rgba(157,187,46,0.65)' : '1px solid rgba(43,42,38,0.08)',
      boxShadow: hot ? '0 0 0 3px rgba(212,242,92,0.30), 0 4px 14px rgba(30,30,25,0.06)' : '0 2px 8px rgba(30,30,25,0.04)',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1c1b18' }}>{name}</div>
      <div style={{ fontSize: 11.5, color: 'rgba(43,42,38,0.5)', marginTop: 3 }}>{child}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 9, flexWrap: 'wrap' }}>{tags}</div>
    </div>
  );
  const col = (dot: string, title: string, count: number, children: React.ReactNode) => (
    <div style={{ flex: '1 1 0', minWidth: 168, background: 'rgba(43,42,38,0.025)', borderRadius: 14, padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 6px 10px' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot }} />
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(43,42,38,0.65)' }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 600, color: 'rgba(43,42,38,0.55)', background: '#fff', borderRadius: 100, padding: '2px 9px', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
  return (
    <div style={{ padding: 'clamp(14px, 2vw, 24px)', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(43,42,38,0.05)', borderRadius: 100, padding: 3 }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: 'rgba(43,42,38,0.5)', padding: '6px 14px' }}>Table View</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#1c1b18', background: '#fff', borderRadius: 100, padding: '6px 14px', boxShadow: '0 1px 4px rgba(30,30,25,0.08)' }}>Pipeline View</span>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#fff', background: '#1A1A1A', borderRadius: 100, padding: '8px 16px' }}>+ Add Lead</span>
      </div>
      <div className="pr-board" style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
        {col('#7cc4e8', 'NEW', moved ? 26 : 27, (<>
          <div className={moved ? 'pr-gone' : ''} style={{ overflow: 'hidden', transition: 'opacity 0.45s ease, max-height 0.5s ease 0.1s, margin 0.5s ease 0.1s', maxHeight: moved ? 0 : 120, opacity: moved ? 0 : 1, marginBottom: moved ? -8 : 0 }}>
            {card('Rivera family', 'Child: Mateo · age 4', (<>{chip('Sep 3')}{chip('CareSource (Medicaid)')}</>), 'd1', !moved)}
          </div>
          {card('Nguyen family', 'Child: Lien · age 5', (<>{chip('Sep 2')}{chip('Aetna HMO')}</>), 'd2')}
        </>))}
        {col('#c9d94e', 'QUALIFIED', moved ? 10 : 9, (<>
          {moved && (
            <div className="pr-arrive">
              {card('Rivera family', 'Child: Mateo · age 4', (<>{chip('Sep 3')}{chip('CareSource (Medicaid)')}{chip('Qualified', true)}</>), '', true)}
            </div>
          )}
          {card('Cohen family', 'Child: Ari · age 3', (<>{chip('Sep 3')}{chip('Anthem BCBS')}</>), 'd2')}
        </>))}
        {col('#9dbb2e', 'INTAKE COMPLETE', 4, (<>
          {card('Levi family', 'Child: Noa · age 4', (<>{chip('Aug 30')}{chip('Medicaid')}{chip('Docs ✓', true)}</>), 'd3')}
          {card('Brooks family', 'Child: Ella · age 5', (<>{chip('Aug 28')}{chip('Cigna PPO')}{chip('Scheduled', true)}</>), 'd4')}
        </>))}
      </div>
      <div className={`pr-note ${moved ? 'on' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'center' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', border: '1px solid rgba(43,42,38,0.3)' }} />
        <span style={{ fontSize: 11.5, color: 'rgba(43,42,38,0.55)' }}>Carelu qualified the Rivera family — no one touched a thing</span>
      </div>
    </div>
  );
}

function PrAsk() {
  const QUESTION = 'Which source brings the most qualified leads?';
  const [typed, setTyped] = useState('');
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    let i = 0;
    let t2: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      i++;
      setTyped(QUESTION.slice(0, i));
      if (i >= QUESTION.length) {
        clearInterval(iv);
        t2 = setTimeout(() => setAnswered(true), 500);
      }
    }, 26);
    return () => { clearInterval(iv); clearTimeout(t2); };
  }, []);
  return (
    <div style={{ padding: 'clamp(14px, 2vw, 24px)', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        borderRadius: 16, overflow: 'hidden', position: 'relative', flex: 1,
        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(250,248,243,0.5)), url(/hero-sky.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        padding: 'clamp(20px, 3vw, 34px)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.2vw, 27px)', color: '#1c1b18' }}>Ask anything about your data</div>
        <div style={{ fontSize: 12, color: 'rgba(43,42,38,0.6)', marginTop: 5 }}>Leads, conversations, calls, campaigns — grounded in your real numbers</div>
        <div style={{
          background: '#fff', borderRadius: 14, marginTop: 16, padding: '15px 18px',
          fontSize: 14, color: '#1c1b18', minHeight: 50, display: 'flex', alignItems: 'center',
          boxShadow: '0 4px 18px rgba(30,30,25,0.08)',
        }}>
          <span>{typed}<span className="pr-caret" /></span>
        </div>
        <div className={`pr-answer ${answered ? 'on' : ''}`} style={{
          background: '#fff', borderRadius: 14, marginTop: 10, padding: '14px 18px',
          border: '1px solid rgba(157,187,46,0.4)',
          boxShadow: '0 6px 22px rgba(30,30,25,0.08)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(43,42,38,0.45)', marginBottom: 6 }}>THIS PERIOD’S INSIGHT ✦</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, color: '#1c1b18', lineHeight: 1.45 }}>
            Meta Ads is your top source — <strong style={{ fontWeight: 600 }}>45 leads</strong> this month at a <strong style={{ fontWeight: 600 }}>17% visitor-to-lead rate</strong>, twice any other channel.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {['Which source brings the most leads?', 'How do my campaigns compare?', 'What did families ask on recent calls?'].map((q, i) => (
            <span key={q} className={`pr-chip d${i + 1}`} style={{
              fontSize: 11, fontWeight: 600, color: 'rgba(43,42,38,0.7)', background: 'rgba(255,255,255,0.85)',
              borderRadius: 100, padding: '7px 13px', display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lime)', border: '1px solid rgba(43,42,38,0.25)' }} />
              {q}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrReporting() {
  const BARS = [24, 12, 8, 18, 10, 30, 22, 14, 34, 20, 42, 30, 26, 52, 40, 64];
  return (
    <div style={{ padding: 'clamp(14px, 2vw, 24px)', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 260px', background: '#fff', borderRadius: 14, border: '1px solid rgba(43,42,38,0.08)', padding: '16px 18px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(43,42,38,0.55)' }}>Leads captured</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, color: '#1c1b18', fontVariantNumeric: 'tabular-nums' }}>
              <Counter target={300} dur={1400} delay={200} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 44, flex: 1 }}>
              {BARS.map((h, i) => (
                <span key={i} className="pr-bar" style={{
                  flex: 1, height: `${h}px`, borderRadius: 3,
                  background: i >= BARS.length - 3 ? '#9DBB2E' : 'rgba(157,187,46,0.35)',
                  animationDelay: `${0.15 + i * 0.05}s`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#3d4a12', background: 'rgba(212,242,92,0.5)', borderRadius: 100, padding: '4px 10px', whiteSpace: 'nowrap' }}>↗ +102.7%</span>
          </div>
        </div>
        <div style={{ flex: '1 1 140px', background: '#fff', borderRadius: 14, border: '1px solid rgba(43,42,38,0.08)', padding: '16px 18px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(43,42,38,0.55)' }}>Qualified leads</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, color: '#1c1b18', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
            <Counter target={68} dur={1400} delay={450} />
          </div>
        </div>
        <div style={{ flex: '1 1 140px', background: '#fff', borderRadius: 14, border: '1px solid rgba(43,42,38,0.08)', padding: '16px 18px' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(43,42,38,0.55)' }}>Scheduled</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, color: '#1c1b18', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
            <Counter target={12} dur={1400} delay={700} />
          </div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(43,42,38,0.08)', padding: '16px 18px', marginTop: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(43,42,38,0.55)' }}>Pipeline · last 30 days</div>
          <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: '#3d4a12', background: 'rgba(212,242,92,0.5)', borderRadius: 100, padding: '3px 10px' }}>Best day: 27 · 9/1</span>
        </div>
        <svg viewBox="0 0 600 110" style={{ width: '100%', height: 'auto', display: 'block', marginTop: 8 }} fill="none" aria-hidden="true">
          <path className="pr-area" d="M0 92 C40 88 60 70 90 74 C120 78 140 52 170 56 C200 60 215 40 240 46 C270 54 285 30 310 36 C340 44 360 78 390 70 C420 62 440 26 470 22 C500 18 520 60 545 40 C565 24 580 14 600 10 L600 110 L0 110 Z" fill="rgba(157,187,46,0.14)" />
          <path className="pr-spark" pathLength={1} d="M0 92 C40 88 60 70 90 74 C120 78 140 52 170 56 C200 60 215 40 240 46 C270 54 285 30 310 36 C340 44 360 78 390 70 C420 62 440 26 470 22 C500 18 520 60 545 40 C565 24 580 14 600 10" stroke="#7BA428" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function RealProduct() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [tab, setTab] = useState(0);

  // Same movement as the how-it-works carousel: the section pins and the three
  // app frames glide horizontally with the scroll, each centering in turn.
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const trackH = rect.height - window.innerHeight;
      if (trackH <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / trackH));
      const START = 0.05;
      const END = 0.85;
      const animProgress = Math.max(0, Math.min(1, (progress - START) / (END - START)));
      const viewportW = window.innerWidth;
      const cards = track.children;
      const cardW = (cards[0] as HTMLElement).offsetWidth;
      const gap = 32;
      const padLeft = viewportW * 0.08;
      const centerShift = (i: number) =>
        viewportW / 2 - (padLeft + i * (cardW + gap) + cardW / 2);
      const startShift = centerShift(0);
      const endShift = centerShift(cards.length - 1);
      const shift = startShift + animProgress * (endShift - startShift);
      track.style.transform = `translate3d(${shift}px, 0, 0)`;
      setActiveIdx(Math.min(PR_TABS.length - 1, Math.floor(animProgress * PR_TABS.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

  const goTab = (i: number) => {
    const section = sectionRef.current;
    if (section && !isMobile) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      const trackH = section.offsetHeight - window.innerHeight;
      const progress = 0.05 + (i / (PR_TABS.length - 1)) * 0.8;
      window.scrollTo({ top: top + progress * trackH, behavior: 'smooth' });
    } else {
      setTab(i);
    }
  };

  const ICONS = [
    <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="11" rx="1.5" /><rect x="17" y="4" width="4" height="7" rx="1.5" /></svg>,
    <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>,
    <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-8M21 20H3" /></svg>,
  ];

  const frame = (i: number, active: boolean) => (
    <div key={i} style={{
      width: isMobile ? '100%' : 'min(740px, 76vw)', flexShrink: 0,
      background: '#FCFBF8', borderRadius: 20,
      boxShadow: '0 0 0 1px rgba(43,42,38,0.09), 0 26px 54px -22px rgba(30,30,25,0.18)',
      overflow: 'hidden',
      opacity: isMobile || active ? 1 : 0.55,
      transform: isMobile || active ? 'scale(1)' : 'scale(0.965)',
      transition: 'opacity 0.45s ease, transform 0.45s var(--ease-dramatic)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(43,42,38,0.06)' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(43,42,38,0.12)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(43,42,38,0.12)' }} />
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(43,42,38,0.12)' }} />
        <span style={{ margin: '0 auto', fontSize: 11.5, color: 'rgba(43,42,38,0.45)', fontWeight: 500 }}>app.carelu.com</span>
        <span style={{ width: 45 }} />
      </div>
      <div key={active ? 'on' : 'off'} className="pr-panel" style={{ height: isMobile ? undefined : 396, minHeight: isMobile ? 330 : undefined, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {i === 0 ? <PrPipeline /> : i === 1 ? <PrAsk /> : <PrReporting />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 16px' }}>
        <div style={{
          display: 'inline-flex', gap: 4, background: '#fff', borderRadius: 100,
          border: '1px solid rgba(43,42,38,0.08)', boxShadow: '0 8px 26px rgba(30,30,25,0.10)',
          padding: 6,
        }}>
          {PR_TABS.map((tb, j) => (
            <button key={tb} type="button" onClick={() => goTab(j)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
              color: (isMobile ? tab : i) === j ? '#1c1b18' : 'rgba(43,42,38,0.5)',
              background: (isMobile ? tab : i) === j ? 'rgba(212,242,92,0.45)' : 'transparent',
              border: 'none', borderRadius: 100, padding: '8px 16px', cursor: 'pointer',
              transition: 'background 0.25s, color 0.25s',
            }}>
              {ICONS[j]}
              {tb}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const header = (
    <div style={{ textAlign: 'center', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
      <div className="rv"><Pill>The product</Pill></div>
    </div>
  );

  if (isMobile) {
    return (
      <section id="product-live" style={{
        position: 'relative', paddingTop: 'clamp(48px, 6vh, 80px)', paddingBottom: 'clamp(56px, 7vh, 96px)',
        background: 'var(--bone)',
      }}>
        <div style={{ ...W, position: 'relative', zIndex: 1 }}>
          {header}
          {frame(tab, true)}
        </div>
      </section>
    );
  }

  return (
    <section id="product-live" ref={sectionRef} style={{ position: 'relative', height: '260vh', background: 'var(--bone)' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100svh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 66, boxSizing: 'border-box',
      }}>
        {header}
        <div ref={trackRef} style={{
          display: 'flex', gap: 32, padding: '0 8vw',
          willChange: 'transform',
        }}>
          {[0, 1, 2].map((i) => frame(i, activeIdx === i))}
        </div>
        {/* Progress dashes — same language as the how-it-works carousel */}
        <div style={{
          marginTop: 'clamp(28px, 4vh, 44px)',
          display: 'flex', justifyContent: 'center', gap: 14,
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 34, height: 2,
              background: i === activeIdx ? '#2B2A26' : 'rgba(43,42,38,0.15)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── IMPACT — the living map of families ──────────
function Impact() {
  // Hovering a stat replays its count
  const [kick, setKick] = useState([0, 0, 0, 0]);
  return (
    <section id="results" style={{
      position: 'relative', paddingTop: 'clamp(40px, 5vh, 60px)', paddingBottom: 'clamp(40px, 5vh, 60px)',
      background: 'var(--bone)',
    }}>
      <div style={{ ...W, position: 'relative', zIndex: 1 }}>
        {/* Header — tighter spacing so it doesn't float disconnected from the data */}
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div className="rv"><Pill>Proven results</Pill></div>
          <div className="impact-head" style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            marginTop: 8,
          }}>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.12, letterSpacing: '-0.02em', margin: 0,
            }}>
              The results speak louder <span style={{ fontStyle: 'italic', fontWeight: 400, whiteSpace: 'nowrap' }}>than we can.</span>
            </h2>
          </div>
        </div>

        {/* One certificate plaque: a hairline frame holds the living number,
            a rule, and its four proofs — one engraved object, nothing floating */}
        <div className="rv" style={{
          maxWidth: 1000, margin: '0 auto', color: 'var(--green-900)',
          position: 'relative',
        }}>

          <div style={{ textAlign: 'center' }}>
            <LiveCounter />
          </div>

          {/* The living map — the country drawn in dots; families keep lighting
              up across it, live, while you watch */}
          <div className="imp-chart" style={{ marginTop: 14 }}>
            <SkyGlobe />
          </div>

          {/* The proofs — one quiet line beneath the country */}
          <div className="imp-statrow" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'baseline',
            flexWrap: 'wrap', columnGap: 'clamp(36px, 5vw, 72px)', rowGap: 28,
            marginTop: 'clamp(40px, 5vh, 64px)', textAlign: 'center',
          }}>
            {[
              { v: 3, sx: '\u00d7', t: 'More families admitted', f: 0, dl: 600, dr: 1600 },
              { v: 10, px: '<', sx: ' min', t: 'First contact to intake-ready', f: 0, dl: 750, dr: 1700 },
              { v: 85, sx: '%', t: 'Intake completion lift', f: 0, dl: 900, dr: 1900 },
              { v: 0, sx: '', t: 'Manual follow-ups', f: 14, dl: 1050, dr: 2000 },
            ].map((x, i) => (
              <div key={x.t} className={`rv d${i + 1}`} style={{ cursor: 'default' }}
                onMouseEnter={() => setKick((k) => k.map((v, j) => (j === i ? v + 1 : v)))}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(23px, 2vw, 29px)', color: '#1c1b18', lineHeight: 1, fontVariantNumeric: 'lining-nums tabular-nums' }}>
                  <Counter target={x.v} suffix={x.sx} prefix={x.px || ''} from={x.f} delay={x.dl} dur={x.dr} trigger={kick[i]} />
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(43,42,38,0.6)', marginTop: 10 }}>{x.t}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


// ── GETTING STARTED — a scroll-driven journey: the hairline travels with the
// reader, and each numbered station lights up as the line reaches it ─────
function GettingStarted() {
  const steps = [
    {
      n: 'I',
      title: 'Meet your specialist',
      desc: 'A short call to walk through how your practice works \u2014 panels, service areas, programs. You\u2019ll meet the person who\u2019ll be working alongside your team.',
      icon: (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect className="gs-draw a" pathLength={1} x="8" y="10" width="32" height="30" rx="4" />
          <path className="gs-draw a" pathLength={1} d="M8 19h32" />
          <path className="gs-draw b" pathLength={1} d="M16 6v7M32 6v7" />
          <path className="gs-draw c" pathLength={1} d="M18 30l4.5 4.5L31 26" />
        </svg>
      ),
    },
    {
      n: 'II',
      title: 'Sign and get set up',
      desc: 'We configure Carelu around your practice and connect it across your front office. Integrations with leading CRMs and EMRs mean you launch fast \u2014 without changing your core systems.',
      icon: (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="gs-draw a" pathLength={1} d="M30 8l6 6-17 17-8 2 2-8z" />
          <path className="gs-draw b" pathLength={1} d="M26 12l6 6" />
          <path className="gs-draw c" pathLength={1} d="M9 41c4-3 7 1.5 11-1.2 3-2 5.5-1 7.5.2 2.6 1.6 6.5 1 10-2" />
        </svg>
      ),
    },
    {
      n: 'III',
      title: 'We train your team',
      desc: 'One session, and your team knows how Carelu works and where to find everything it collects. It should feel like a new teammate, not new software.',
      icon: (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle className="gs-draw a" pathLength={1} cx="24" cy="15" r="5" />
          <path className="gs-draw b" pathLength={1} d="M15 40c0-6 4-10 9-10s9 4 9 10" />
          <circle className="gs-draw b" pathLength={1} cx="10.5" cy="19" r="3.6" />
          <path className="gs-draw c" pathLength={1} d="M4 38c0-4.4 2.8-7.4 6.5-7.4 1.2 0 2.3.3 3.2.9" />
          <circle className="gs-draw b" pathLength={1} cx="37.5" cy="19" r="3.6" />
          <path className="gs-draw c" pathLength={1} d="M44 38c0-4.4-2.8-7.4-6.5-7.4-1.2 0-2.3.3-3.2.9" />
        </svg>
      ),
    },
    {
      n: 'IV',
      title: 'Go live, with visibility',
      desc: 'Your dashboard shows every conversation and every intake as it happens. And a dedicated growth partner stays on your account, working it like one of your own.',
      icon: (
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="#2B2A26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="gs-draw a" pathLength={1} d="M7 41V13" />
          <path className="gs-draw a" pathLength={1} d="M7 41h34" />
          <path className="gs-draw b" pathLength={1} d="M12 33c6 0 7-9 12-11 4.5-1.8 7-6 9.5-11" />
          <circle className="gs-draw c" pathLength={1} cx="35" cy="9.5" r="2.6" />
        </svg>
      ),
    },
  ];

  // Scroll progress through the tall track: 0 when the section pins, 1 at release
  const trackRef = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = trackRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setT(total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 1);
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

  // The line reaches each station's node just before that station lights up
  const TH = [0.08, 0.36, 0.63, 0.90];
  const lineScale = Math.max(0, Math.min(1, t / 0.93));

  return (
    <section id="getting-started" ref={trackRef} className="gs-outer" style={{
      position: 'relative', background: '#FFFFFF',
      borderTop: '1px solid rgba(43,42,38,0.06)', borderBottom: '1px solid rgba(43,42,38,0.06)',
    }}>
      <div className="gs-sticky">
        <div style={{ ...W, position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
            <div className="rv"><Pill>Getting started</Pill></div>
            <h2 className="rv-scale d1" style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 4.2vw, 52px)',
              fontWeight: 400, color: 'var(--green-900)',
              lineHeight: 1.12, letterSpacing: '-0.02em', margin: '12px 0 0',
            }}>
              Getting started is simple.
            </h2>
          </div>

          <div className="gs-track" style={{ position: 'relative', maxWidth: 1080, margin: '0 auto' }}>
            <div className="gs-line" style={{
              position: 'absolute', top: 17, left: '4%', right: '4%', height: 1,
              background: 'rgba(43,42,38,0.18)',
              transform: `scaleX(${lineScale})`, transformOrigin: 'left',
            }} />
            <div className="gs-line gs-tip" style={{
              position: 'absolute', top: 17, left: `calc(4% + ${lineScale * 92}%)`,
              width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)',
              border: '1px solid rgba(43,42,38,0.35)',
              boxShadow: '0 0 0 3px rgba(212, 242, 92, 0.3)',
              transform: 'translate(-50%, -50%)',
              opacity: t > 0.01 && t < 0.97 ? 1 : 0, transition: 'opacity 0.3s ease',
            }} />
            <div className="gs-journey" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 'clamp(16px, 2.5vw, 40px)' }}>
              {steps.map((s, i) => (
                <div key={s.n} className={`gs-step${t >= TH[i] ? ' on' : ''}`} style={{ textAlign: 'center', position: 'relative' }}>
                  <div className="gs-node" style={{
                    width: 34, height: 34, borderRadius: '50%', margin: '0 auto',
                    background: '#FFFFFF', border: '1px solid rgba(43,42,38,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 13.5, color: 'var(--green-900)',
                    letterSpacing: '0.04em', position: 'relative', zIndex: 1,
                    transition: 'background 0.5s ease, box-shadow 0.5s ease',
                  }}>{s.n}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '34px 0 24px', opacity: 0.9 }}>
                    {s.icon}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 1.8vw, 24px)',
                    fontWeight: 400, color: 'var(--green-900)',
                    lineHeight: 1.25, letterSpacing: '-0.3px', margin: '0 0 12px',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--gray-600)', lineHeight: 1.65, margin: '0 auto', maxWidth: 240 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="rv" style={{
            textAlign: 'center', fontSize: 14, color: 'var(--gray-500)',
            margin: 'clamp(48px, 6vw, 72px) auto 0', maxWidth: 520, lineHeight: 1.6,
            textWrap: 'balance',
          }}>
            Larger organization? We&rsquo;ll shape onboarding around your locations, systems, and team.{' '}
            <a href="/demo" style={{ color: 'var(--green-900)', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Talk to us
            </a>
          </p>
        </div>
      </div>

      {/* Scroll choreography: the sticky stage holds while the reader's scroll
          pushes the line forward; stations rise and sketch themselves in turn */}
      <style>{`
        .gs-outer { height: 280vh; }
        .gs-sticky {
          position: sticky; top: 0; min-height: 100svh;
          display: flex; flex-direction: column; justify-content: center;
          overflow: hidden; padding: 90px 0 40px;
          box-sizing: border-box;
        }
        .gs-step { opacity: 0; transform: translateY(20px); transition: opacity 0.75s var(--ease-dramatic), transform 0.75s var(--ease-dramatic); }
        .gs-step.on { opacity: 1; transform: translateY(0); }
        @media (max-width: 768px) {
          .gs-outer { height: auto; }
          .gs-sticky { position: static; min-height: 0; padding: 0; overflow: visible; }
          .gs-journey { grid-template-columns: 1fr !important; row-gap: 52px; }
          .gs-line { display: none; }
          .gs-step { opacity: 1 !important; transform: none !important; }
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





// ── MURAL REVEAL — stacked plates illustration (SVG, no images) ──
function MuralReveal() {
  // Workflow ordered bottom-to-top. All labels sit on the LEFT, stack pushed to the right.
  type Side = 'left' | 'right';
  const plates: { title: string; isTop?: boolean; side: Side }[] = [
    { title: 'This Is What We Do', isTop: true, side: 'left' }, // [0] top — umbrella
    { title: 'Answer families',    side: 'left' },              // [1] first contact
    { title: 'Gather records',     side: 'left' },              // [2] diagnosis + releases
    { title: 'Complete intake',    side: 'left' },              // [3] every field + follow-up
    { title: 'Verify insurance',   side: 'left' },              // [4] eligibility + cards
    { title: 'Behavioral intake',  side: 'left' },              // [5] human handoff
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
          <div className="rv"><Pill>The care enablement platform</Pill></div>
          <h2 className="rv-scale d1" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4.2vw, 52px)',
            fontWeight: 400,
            color: 'var(--green-900)',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: '8px 0 14px',
          }}>
            Your team builds trust.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 400, whiteSpace: 'nowrap' }}>Carelu does the rest.</span>
          </h2>
          <p className="rv d2" style={{
            fontSize: 15, color: 'var(--gray-500)',
            lineHeight: 1.55, maxWidth: 520, margin: '0 auto',
          }}>
            Your stack is tools someone has to run. Carelu does the work itself &mdash; freeing your people for the calls, and the trust, only they can build.
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
  useSeo({
    title: 'Carelu — The Front Office of Care | AI Intake for ABA Providers',
    description: 'Carelu meets every family who reaches out and finishes their intake before anyone else can. More families admitted — same team. Built for ABA therapy and behavioral health.',
    canonical: '/',
  });
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
        <RealProduct />
        <MuralReveal />
        <Impact />
        <HowCarelu />
        <Outcomes />
        <CeoLetter />
        <GettingStarted />
        <Compliance />
        <Faq />
        <SiteFooter />
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
